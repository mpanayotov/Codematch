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
from matchseek.models import Match, Batch, BatchTalent, BatchCompany, PlatformInformation, Messege
import datetime
import string
import random
import inspect
import os
from matchseek.matchfunctions import find_match_for_company
from landing_page.additional_functions import send_error_email

@csrf_exempt
def render_register_page(request):
    try:
        if request.user.is_authenticated():
            return HttpResponseRedirect("/company/login/")
        else:
            return render_to_response('company_register.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def company_profile_is_complete(request):
        company = Company.objects.get(user=request.user.id)
        if company.short_description is None or company.short_description == "":
            return False
        if company.website_url is None or company.website_url == "":
            return False
        if company.foundation_year is None or company.foundation_year == "":
            return False
        if company.company_size is None or company.company_size == "":
            return False
        if company.industry is None or company.industry == "":
            return False
        if company.tech_stack is None or company.tech_stack == "":
            return False
        if company.annual_salary is None or company.annual_salary == "":
            return False
        if company.perks is None or company.perks == "":
            return False
        if company.profile_picture is None or company.profile_picture == "":
            return False
        return True

def redirect_to_register_page(request):
        company = Company.objects.get(user=request.user.id)
        context = {"company":company,"incomplete":"incomplete",
                    "reminder":"Take your time and complete your company profile. Fill all fields to make your company more appealing and increase your chances to hire."}
        return render_to_response('company_register.html', context, context_instance=RequestContext(request))

@csrf_exempt
def login_company(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                return HttpResponseRedirect("/company/matches/")
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/company/login/')
def render_matches_page(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                context = {"company":company}
                return render_to_response('matches.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/company/login/')
def render_offer_page(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                tech_stack = PlatformInformation.objects.get(name="tech_stack").value
                context = {"company":company, "tech_stack":tech_stack}
                return render_to_response('create_offer.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/company/login/')
def edit_company_profile(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                    
                company = Company.objects.get(user=request.user.id)
                company_images = CompanyImages.objects.filter(company_id=company.pk)
                context = {"company":company, "company_images":company_images}
                return render_to_response('edit_company_profile.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/company/login/')
def show_company_profile(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                company_images = CompanyImages.objects.filter(company_id=company.id)
                context = {"company":company, "company_images":company_images,
                           "reminder":"Company_profile 2.", "complete_profile":"complete"}
                return render_to_response('company_profile.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@login_required(login_url='/login/')
def render_batch_page(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                context = {"company":company}
                return render_to_response('company_batches.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def company_batches(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                company = Company.objects.get(user=request.user.id)
                now = datetime.datetime.now()
                batches = Batch.objects.filter(active=True, end_date__gte=now)
                companybatches = BatchCompany.objects.filter(company_id=company.id)
                data = chain(batches, companybatches)
                data = serializers.serialize("json", data)
                return HttpResponse(data, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def already_applied(company, batch):
    try:
        BatchCompany.objects.get(batch_id=batch.id, company_id=company.id)
        return True
    except:
        return False

def company_status_for_batch(batch, talent):
    try:
        talent_batch = BatchTalent.objects.get(batch=batch, talent=talent)
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
def company_batch_application(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                    batch = Batch.objects.get(id=request.POST["batch_id"])
                    company = Company.objects.get(user=request.user.id)
                    if already_applied(company, batch):
                        return HttpResponse("Already applied", content_type="text/html; charset=utf-8")
                    application = BatchCompany.objects.create(batch_id=batch.id, company_id=company.id, approved=False)
                    application.save()
                    send_approval_request_email(company, batch)
                    return HttpResponse("successful_application", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Talent does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def send_approval_request_email(company, batch):
    send_mail("Company Batch Request",
               "You have a new Company Batch Request for Approval \n Company ID: "
               +str(company.pk) +"/n Batch ID: "+str(batch.pk),
                "support@codematch.eu", ["mihail_workbuz@abv.bg"])

@login_required(login_url='/company/login/')
def company_positions(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                tech_stack = PlatformInformation.objects.get(name="tech_stack").value
                context = {"company":company, "tech_stack":tech_stack}
                return render_to_response('company_positions.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def edit_position(request):
    #try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                time_preferences = request.POST["time_preferences"]
                tech_skills = request.POST["tech_skills"]
                title = request.POST["title"]
                work_type = request.POST["work_type"]
                exp_level = request.POST["exp_level"]
                salary = request.POST["salary"]
                project_description = request.POST["project_description"]
                position_id = int(request.POST["position_id"])             
                position = Position.objects.get(id=position_id)
                position.time_preferences=time_preferences
                position.tech_skills=tech_skills
                position.title=title
                position.work_type=work_type
                position.exp_level=exp_level
                position.salary=salary
                position.project_description=project_description
                position.save()
                return HttpResponse("edit_successful", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    #except:
        #send_error_email(inspect.stack()[0][3])
        #return HttpResponse("Error", content_type="text/html; charset=utf-8")
        
@csrf_exempt
def publish_position(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                company = Company.objects.get(user=request.user.id)
                if company_can_publish(company):
                    position_id = int(request.POST["position_id"])
                    position = Position.objects.get(id=position_id)
                    position.purpose = "outside_batch"
                    position.save()
                    find_match_for_company(request)
                    return HttpResponse("publish_successful", content_type="text/html; charset=utf-8")      
                else: 
                    return HttpResponse("cannot_publish", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def company_can_publish(company):
    positions = Position.objects.filter(company_id=company.id).exclude(purpose=None)
    return len(positions) < 15
    #implement publish conditions

def check_for_existing_company(request):
    try:
        company = Company.objects.get(user=request.user.id)
        return True
    except:
        return False

@csrf_exempt
def signin_company(request):
    try:
        email = request.POST["email"]
        password = request.POST["password"]
        
        try:
            company_user = User.objects.get(email=email)
            company = Company.objects.get(user=company_user.id)
            username = company_user.username
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
def signup_company(request):
    try:
        company_name = request.POST["company_name"]
        email = request.POST["company_email"]
        user_name = request.POST["user_name"]
        location = request.POST["location"]
        password = request.POST["password"]
        
        try:
            User.objects.get(email=email)
            return HttpResponse("duplicated_email", content_type="text/html; charset=utf-8")
        except:
            company_user = User.objects.create_user(username=company_name,email=email,password=password)
            company_user.save()
            
            company = Company.objects.create(user=company_user,
                                            company_name=company_name,
                                            user_name=user_name,
                                            location=location)
            
            company.save()
                    
            company_user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, company_user)
            
            return HttpResponseRedirect("/company/edit/")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def edit_company(request):
    try:
        company_name = request.POST["company_name"]
        email = request.POST["company_email"]
        user_name = request.POST["user_name"]
        location = request.POST["location"]
        short_description = request.POST["short_description"]
        company_size = request.POST["company_size"]
        website_url = request.POST["website_url"]
        foundation_year = request.POST["foundation_year"]
        tech_stack = request.POST["tech_stack"]
        industry = request.POST["industry"]
        software_used = request.POST["software_used"]
        funding = request.POST["funding"]
        investors = request.POST["investors"]
        annual_salary = request.POST["annual_salary"]
        perks = request.POST["perks"]
        video_url = request.POST["video_url"]
        crunch_base_url = request.POST["crunch_base_url"]
        angel_list_url = request.POST["angel_list_url"]
        fb_page_url = request.POST["fb_page_url"]
        twitter_page_url = request.POST["twitter_page_url"]
        youtube_channel_url = request.POST["youtube_channel_url"]
        long_description = request.POST["long_description"]
        
        company_user = User.objects.get(id=request.user.id)
        company_user.email = email
        company_user.username = company_name
        company_user.save()
        
        company = Company.objects.get(user=request.user.id)
        
        if "profile_picture" in request.FILES:
            company.profile_picture=request.FILES["profile_picture"]
        company.company_name=company_name
        company.user_name=user_name
        company.location=location
        company.short_description=short_description
        company.company_size=company_size
        company.website_url=website_url
        company.foundation_year=foundation_year
        company.tech_stack=tech_stack
        company.industry=industry
        company.software_used=software_used
        company.funding=funding
        company.investors=investors
        company.annual_salary=annual_salary
        company.perks=perks
        company.video_url=video_url
        company.crunch_base_url=crunch_base_url
        company.angel_list_url=angel_list_url
        company.fb_page_url=fb_page_url
        company.twitter_page_url=twitter_page_url
        company.youtube_channel_url=youtube_channel_url
        company.long_description=long_description
        
        company.save()
        
        if "image_0" in request.FILES:
            for i in range(0,len(request.FILES)):
                image_str = "image_"+str(i)
                if image_str in request.FILES:
                    image = CompanyImages.objects.create(company_id=company.id,
                                                     company_name=company_name,
                                                     image=request.FILES[image_str])
                
        return HttpResponse("edit_successful", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def get_matches(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                company = Company.objects.get(user=request.user.id)
                match_objects = Match.objects.filter(company_id=company.id, is_active=True)
                matches = get_match_data(match_objects)
                return HttpResponse(matches, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
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

@login_required(login_url='/company/login/')
def company_inbox(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                if not company_profile_is_complete(request):
                    return redirect_to_register_page(request)
                company = Company.objects.get(user=request.user.id)
                context = {"company":company, "reminder":"Hi, thank you for signing up. We have a few steps for you to complete which will take you less than 2 minutes."}
                return render_to_response('company_inbox.html', context, context_instance=RequestContext(request))
            else:
                return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
        else:
            return render_to_response('signin_company.html', {}, context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def inbox_messeges(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                company = Company.objects.get(user=request.user.id)
                match_objects = Match.objects.filter(company_id=company.id)
                matches = get_match_data(match_objects)
                return HttpResponse(matches, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def create_job_offer(request):
    try:
        company = Company.objects.get(user=request.user)
        tech_skills = request.POST["tech_skills"]
        time_preferences = request.POST["time_preferences"]
        salary = request.POST["salary"]
        title = request.POST["title"]
        project_description = request.POST["project_description"]
        work_type = request.POST["work_type"]
        exp_level = request.POST["exp_level"]
        
        position = Position.objects.create(
                                        tech_skills=tech_skills,
                                        time_preferences=time_preferences,
                                        salary=salary,
                                        title=title,
                                        exp_level=exp_level,
                                        work_type=work_type,
                                        project_description=project_description,
                                        company_id=company.id)
        position.save()
        
        return HttpResponse("offer_created", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
        
@csrf_exempt
def get_positions(request):
    try:
        if request.user.is_authenticated():
            if check_for_existing_company(request):
                company = Company.objects.get(user=request.user.id)
                positions = Position.objects.filter(company_id=company.pk)
                data = serializers.serialize("json", positions)
                return HttpResponse(data, content_type ="application/json; charset=utf-8")
            else:
                return HttpResponse("Company does not exist", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User is not logged in", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")