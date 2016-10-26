# -*- coding: utf-8 -*- 
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
#from itertools import chain
from django.conf import settings
from talents.models import Talent
from companies.models import Company, Position
from matchseek.models import Batch, BatchCompany, BatchTalent, Match, Messege
from talents.additional_functions import send_error_email
from shapely.geometry import Polygon
import ast
import inspect
import datetime
from django.core.mail import send_mail
from adminpanel.functions import check_for_superuser_and_active

@csrf_exempt
def create_messege(request):
    try:
        if request.user.is_authenticated():
            match = Match.objects.get(pk=request.POST["match_id"])
            text = request.POST["text"]
            if user_relates_to_match(request, match):
                sender = get_sender(request)
                messege = Messege.objects.create(match_id=match.pk,
                                                  text=text,
                                                  sender=sender,
                                                  time=datetime.datetime.now())
                messege.save()
                data = serializers.serialize("json", [messege])
                return HttpResponse(data, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("User does not relate to match", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def get_sender(request):
    talent = Talent.objects.filter(user=request.user.id)
    company = Company.objects.filter(user=request.user.id)
    
    if(len(talent)==1):
        return "talent"
    
    if(len(company)==1):
        return "company"

@csrf_exempt
def save_choice(request):
    try:
        if request.user.is_authenticated():
            match = Match.objects.get(id=request.POST["match_id"])
            choice = int(request.POST["choice"])
            if user_relates_to_match(request, match):
                    match.is_talent_interested = choice
                    match.save()
                    return HttpResponse("choice is saved", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
 
def user_relates_to_match(request, match):
    talent = Talent.objects.filter(user=request.user.id)
    company = Company.objects.filter(user=request.user.id)
    match = Match.objects.get(id=match.pk)
    
    if(len(talent)==0 and len(company)==0):
        return False
    
    if(len(talent)==1):
        if(talent[0].pk == match.talent_id):
            return True
        else:
            return False
    
    if(len(company)==1):
        if(company[0].pk == match.company_id):
            return True
        else:
            return False