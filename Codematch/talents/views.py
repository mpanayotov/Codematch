# -*- coding: utf-8 -*- 
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from itertools import chain
from django.core.mail import send_mail
from django.core import serializers
from django.conf import settings
from talents.models import Talent
from companies.models import Company, Position, CompanyImages
from matchseek.models import Match, Batch, BatchTalent, PlatformInformation, Messege
from talents.additional_functions import send_error_email
from datetime import timedelta
import datetime
import itertools
import json
import string
import random
import inspect
from matchseek.matchfunctions import find_match_for_talent

@csrf_exempt
def create_user(request):
    try:
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        location = request.POST["location"]
        try:
            User.objects.get(email=email)
            return HttpResponse("duplicated_email", content_type="text/html; charset=utf-8")
        except:    
            user = User.objects.create_user(username=username,
                                            email=email,
                                            password=password,
                                                    )
            user.save()          
            talent = Talent(user=user, location=location, username=username)
            talent.save()
                    
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
                             
            return HttpResponse("user_created", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def edit_profile_and_match(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                change_talent_fields(request)
                find_match_for_talent(request)
                return HttpResponse("match_successful", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def complete_dev_profile(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                change_talent_fields(request)
                return HttpResponse("complete_successful", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def change_talent_fields(request):
        exp_level = request.POST["exp_level"]
        role = request.POST["role"]
        tech_skills = request.POST["tech_skills"]
        time_preferences = request.POST["time_preferences"]
        work_description = request.POST["work_description"]
        salary = request.POST["salary"]
        linkedin_url = request.POST["linkedin"]
        github_url = request.POST["github"]
        relocate = int(request.POST["relocate"])
        editor = request.POST["editor"]
        operating_system = request.POST["operating_system"]
        work_type = request.POST["work_type"]
        
        talent = Talent.objects.get(user=request.user)
        
        talent.exp_level=exp_level
        talent.role=role
        talent.tech_skills=tech_skills
        talent.time_preferences=time_preferences
        talent.work_description=work_description
        talent.salary=salary
        talent.linkedin_url=linkedin_url
        talent.github_url=github_url
        talent.relocate=relocate
        talent.editor=editor
        talent.work_type=work_type
        talent.operating_system=operating_system
        if "can_match_outside_batch" in request.POST:
            talent.can_match_outside_batch=int(request.POST["can_match_outside_batch"])
        if "profile_picture" in request.FILES:
            talent.profile_picture = request.FILES["profile_picture"]

        talent.save()

@csrf_exempt
def sign_in_user(request):
    try:
        email = request.POST["email"]
        password = request.POST["password"]
        
        try:
            talent_user = User.objects.get(email=email)
            talent = Talent.objects.get(user=talent_user.id)
            username = talent_user.username
        except:
            return HttpResponse("user_does_not_exist", content_type="text/html; charset=utf-8")
        
        user = authenticate(username=username, password=password)
        if user is None:
            return HttpResponse("user_does_not_exist", content_type="text/html; charset=utf-8")
        
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
                         
        return HttpResponse("successful_login", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def log_in_user(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                if not profile_is_complete(request):
                    return HttpResponseRedirect("/talent/complete/")
                context = {"talent":talent}
                return render_to_response('talent_matches.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def show_talent_profile(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                if not profile_is_complete(request):
                    return HttpResponseRedirect("/talent/complete/")
                tech_stack = PlatformInformation.objects.get(name="tech_stack").value
                context = {"talent":talent, "tech_stack":tech_stack}
                return render_to_response('talent_profile.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/login/')
def complete_talent_profile(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                tech_stack = PlatformInformation.objects.get(name="tech_stack").value
                talent = Talent.objects.get(user=request.user.id)
                context = {"talent":talent,"tech_stack":tech_stack, "reminder":"Hi, thank you for signing up. We have a few steps for you to complete which will take you less than 2 minutes."}
                return render_to_response('complete_talent_profile.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
    
@login_required(login_url='/login/')
def talent_matches(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                if not profile_is_complete(request):
                    return HttpResponseRedirect("/talent/complete/")
                talent = Talent.objects.get(user=request.user.id)
                context = {"talent":talent, "reminder":"You have 2 matches."}            
                return render_to_response('talent_matches.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def get_matches(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                match_objects = Match.objects.filter(talent_id=talent.id, is_active=True)
                matches = get_match_data(match_objects)
                return HttpResponse(matches, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def get_match_data(match_objects):
    match_data = []
    company_images = []
    conversations = []
    for match in match_objects:
        match_data.append(Company.objects.get(id=match.company_id))
        match_data.append(Talent.objects.get(id=match.talent_id))
        match_data.append(Position.objects.get(id=match.position_id))
        match_data.append(match)
        company_images.append(CompanyImages.objects.filter(company_id=match.company_id))
        conversations.append(Messege.objects.filter(match_id=match.pk))
                
    all_images = []
    for image_collection in company_images:
        for image in image_collection:
            all_images.append(image)
                        
    all_messeges = []
    for chat in conversations:
        for messege in chat:
            all_messeges.append(messege)
    match_data = chain(match_data, all_images, all_messeges)
    matches = serializers.serialize("json", match_data)
        
    return matches

@login_required(login_url='/login/')
def talent_inbox(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                if not profile_is_complete(request):
                    return HttpResponseRedirect("/talent/complete/")
                talent = Talent.objects.get(user=request.user.id)
                context = {"talent":talent, "reminder":"Hi, thank you for signing up. We have a few steps for you to complete which will take you less than 2 minutes."}
                return render_to_response('talent_inbox.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def inbox_messeges(request):
    #try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                match_objects = Match.objects.filter(talent_id=talent.id, is_active=True)
                matches = get_match_data(match_objects)
                return HttpResponse(matches, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    #except:
        #send_error_email(inspect.stack()[0][3])
        #return HttpResponse("Error", content_type="text/html; charset=utf-8")

"""
@csrf_exempt
def get_matches2(request):
    #try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                match_objects = Match.objects.filter(talent_id=talent.id)
                match_data = []
                for match in match_objects:
                    company = Company.objects.get(id=match.company_id)
                    company_data = [company.pk, company.company_name,
                                    company.location,
                                    company.short_description, company.website_url,
                                    company.foundation_year, company.company_size,
                                    company.industry, company.tech_stack,
                                    company.software_used, company.funding,
                                    company.investors, company.annual_salary,
                                    company.perks, company.video_url,
                                    company.crunch_base_url, company.angel_list_url,
                                    company.fb_page_url, company.twitter_page_url,
                                    company.youtube_channel_url,
                                    company.long_description,
                                    str(company.profile_picture)]
                    talent = Talent.objects.get(id=match.talent_id)
                    talent_data = [talent.pk, talent.username, talent.location,
                                   talent.tech_skills, talent.tech_skills,
                                   talent.username, talent.time_preferences,
                                   talent.role, talent.work_description,
                                   talent.salary, talent.operating_system,
                                   talent.editor, talent.work_type,
                                   talent.relocate, talent.linkedin_url,
                                   talent.github_url, str(talent.profile_picture)]
                    position = Position.objects.get(id=match.position_id)
                    position_data = [position.pk, position.tech_skills,
                                     position.time_preferences,
                                     position.salary, position.exp_level,
                                     position.work_type, position.project_description,
                                     position.company_id, position.title]
                    matchdata = [match.pk, match.talent_id, match.company_id,
                                 match.position_id, match.match,
                                 match.is_talent_interested]
                    messeges = Messege.objects.filter(talent_id=match.talent_id,
                                                      company_id=match.company_id,
                                                      position_id=match.position_id)
                    conversation_data = [
                                         [m.pk, m.text, m.talent_id,
                                          m.company_id, m.position_id,
                                          str(m.time)]
                                         for m in messeges
                                         ]      
                    company_images = CompanyImages.objects.filter(company_id=match.company_id)
                    images_data = [[str(image.image), image.company_id] for image in company_images]
                    match_data.append((company_data, talent_data,
                                       position_data, matchdata,
                                       images_data, conversation_data))
                
                matches_json = simplejson.dumps({"matches" : match_data})
                return HttpResponse(matches_json, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    #except:
        #send_error_email(inspect.stack()[0][3])
        #return HttpResponse("Error", content_type="text/html; charset=utf-8")
"""

@login_required(login_url='/login/')
def render_batch_page(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                if not profile_is_complete(request):
                    return HttpResponseRedirect("/talent/complete/")
                talent = Talent.objects.get(user=request.user.id)
                context = {"talent":talent}
                return render_to_response('talent_batches.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def talent_batches(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                talent = Talent.objects.get(user=request.user.id)
                now = datetime.datetime.now()
                batches = Batch.objects.filter(active=True, end_date__gte=now)
                talentbatches = BatchTalent.objects.filter(talent_id=talent.id)
                data = chain(batches, talentbatches)
                data = serializers.serialize("json", data)
                return HttpResponse(data, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def talent_status_for_batch(batch, talent):
    try:
        talent_batch = BatchTalent.objects.get(batch_id=batch.id, talent_id=talent.id)
        if talent_batch.approved:
            return "approved"
        else:
            return "applied"
    except:
        return "not_applied"

def batch_does_not_start_soon(batch):
    period = batch.end_date - datetime.datetime.now()
    return period.days >= 0

@csrf_exempt
def talent_batch_application(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_talent(request):
                if profile_is_complete(request):
                    batch = Batch.objects.get(id=request.POST["batch_id"])
                    talent = Talent.objects.get(user=request.user.id)
                    if talent.location != batch.location and not talent.relocate and talent.work_type == "Onsite":
                        return HttpResponse("cannot_relocate", content_type="text/html; charset=utf-8")
                    if already_applied(talent, batch):
                        return HttpResponse("Already applied", content_type="text/html; charset=utf-8")
                    application = BatchTalent.objects.create(batch_id=batch.id, talent_id=talent.id, approved=False)
                    application.save()
                    send_approval_request_email(talent, batch)
                    return HttpResponse("successful_application", content_type="text/html; charset=utf-8")
                else:
                    return HttpResponse("Talent profile is not complete", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def send_approval_request_email(talent, batch):
    send_mail("Talent Batch Request",
               "You have a new Talent Batch Request for Approval \n Talent ID: "
               +str(talent.pk) +"/n Batch ID: "+str(batch.pk),
                "support@codematch.eu", ["mihail_workbuz@abv.bg"])

def already_applied(talent, batch):
    try:
        BatchTalent.objects.get(batch_id=batch.id, talent_id=talent.id)
        return True
    except:
        return False

def profile_is_complete(request):
    talent = Talent.objects.get(user=request.user.id)
    if talent.tech_skills is None or talent.tech_skills == "":
        return False
    if talent.time_preferences is None or talent.time_preferences == "":
        return False
    if talent.salary is None or talent.salary == "":
        return False
    if talent.role is None or talent.role == "":
        return False
    if talent.exp_level is None or talent.exp_level == "":
        return False
    if talent.work_description is None or talent.work_description == "":
        return False
    if talent.role is None or talent.role == "":
        return False
    if talent.operating_system is None or talent.operating_system == "":
        return False
    if talent.relocate is None or talent.relocate == "":
        return False
    if talent.linkedin_url is None or talent.linkedin_url == "":
        return False
    if talent.github_url is None or talent.github_url == "":
        return False
    if talent.profile_picture is None or talent.profile_picture == "":
        return False
    if talent.location is None or talent.location == "":
        return False
   
    return True

def check_for_existing_talent(request):
    try:
        talent = Talent.objects.get(user=request.user.id)
        return True
    except:
        return False

@csrf_exempt
def log_out(request):
    logout(request)
    return HttpResponseRedirect('/')