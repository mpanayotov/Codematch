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
from itertools import chain
from django.conf import settings
from talents.models import Talent
from companies.models import Company, Position, CompanyImages
from matchseek.models import Batch, BatchCompany, BatchTalent, Match, Messege
from talents.additional_functions import send_error_email
from shapely.geometry import Polygon
import ast
import inspect
import datetime


def get_batch_requests_for_apporval(request):
    try:
        if request.user.is_authenticated():
            if check_for_superuser_and_active(request):
                now = datetime.datetime.now()
                batches = Batch.objects.filter(active=True, end_date__gte=now)
                batch_talents = []
                batch_comapanies = []
                for batch in batches:
                    batch_talents.append(BatchTalent.objects.filter(batch_id=batch.id))
                    batch_comapanies.append(BatchCompany.objects.filter(batch_id=batch.id))
                
                talents = []
                companies = []
                positions = []
                all_batch_talents = []
                all_batch_companies = []
                all_positions = []
                
                for batch_talent_array in batch_talents:
                    for batchtalent in batch_talent_array:
                        talents.append(Talent.objects.get(id=batchtalent.talent_id))
                        all_batch_talents.append(batchtalent)
                
                company_images = []
                for batch_company_array in batch_comapanies:
                    for batchcompany in batch_company_array:
                        company = Company.objects.get(id=batchcompany.company_id)
                        position = Position.objects.filter(company_id=company.id, purpose="batch")
                        company_images.append(CompanyImages.objects.filter(company_id=company.id))
                        positions.append(position)
                        companies.append(company)
                        all_batch_companies.append(batchcompany)
                
                all_images = []
                for image_collection in company_images:
                    for image in image_collection:
                        all_images.append(image)
                
                for position_arr in positions:
                    for position in position_arr:
                        all_positions.append(position)
                
                data = chain(batches, talents, companies, all_positions,
                              all_batch_talents, all_batch_companies, all_images)
                data = serializers.serialize("json", data)
                return HttpResponse(data, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("User is not superuser or is not active", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
      
def check_for_superuser_and_active(request):
    user = User.objects.get(id=request.user.id)
    return user.is_superuser and user.is_active

def render_admin_panel(request):
    try:
        if request.user.is_authenticated():
            if check_for_superuser_and_active(request):
                return render_to_response('admin_page.html', {}, context_instance=RequestContext(request))
            else:
                return HttpResponse("User is not superuser or is not active", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def approve_talent_for_batch(request):
    try:
        if request.user.is_authenticated():
            if check_for_superuser_and_active(request):
                batchtalent = BatchTalent.objects.get(id=request.POST["batchtalent_id"])
                batchtalent.approved = True
                batchtalent.save()
                return HttpResponse("Successfully_approved", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("User is not superuser or is not active", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
        
@csrf_exempt
def approve_company_for_batch(request):
    try:
        if request.user.is_authenticated():
            if check_for_superuser_and_active(request):
                batchcompany = BatchCompany.objects.get(id=request.POST["batchcompany_id"])
                batchcompany.approved = True
                batchcompany.save()
                return HttpResponse("Successfully_approved", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("User is not superuser or is not active", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
