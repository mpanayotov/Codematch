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
def find_matches(request):
    try:
        if request.user.is_authenticated():
            if check_for_superuser_and_active(request):
                batch = Batch.objects.get(id=request.POST["batch_id"])
                if batch.active:
                    
                    companies = []
                    for company in BatchCompany.objects.filter(approved=True):
                        company_obj = Company.objects.get(id=company.company_id)
                        companies.append(company_obj)
                    
                    talents = []
                    for talent in BatchTalent.objects.filter(approved=True):
                        talent_obj = Talent.objects.get(id=talent.talent_id)
                        talents.append(talent_obj)
                       
                    company_positions = []
                    company_ids = [company.id for company in companies]
                    for position in Position.objects.filter(purpose="batch"):
                        if position.company_id in company_ids:
                            company_positions.append(position)
                    
                    new_matches = []
                    for position in company_positions:
                        for talent in talents:
                            check_for_match_between(position,talent,batch, new_matches)
        
                    return HttpResponse("Search is over: "+str(len(new_matches))+" matches",
                                         content_type="text/html; charset=utf-8")
                    
                else:
                    return HttpResponse("Batch is not active", content_type="text/html; charset=utf-8")
            else:
                return HttpResponse("User is not superuser or is not active", content_type="text/html; charset=utf-8")
        else:
            return HttpResponse("User not authenticated", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def check_for_match_between(position,talent, batch, new_matches):
    if salaries_match(position,talent):
        time_priority = 0.7
        tech_priority = 0.3
        min_overall_percentage = 70
        time_percentage = time_coverage(position,talent)
        tech_skill_percentage = tech_skill_coverage(position,talent)
        match_percentage = time_percentage*time_priority + tech_skill_percentage*tech_priority
        
        #return HttpResponse(str(match_percentage)+" "+str(min_overall_percentage) , content_type="text/html; charset=utf-8")
        if match_percentage >= min_overall_percentage:
            company = Company.objects.get(id=position.company_id)
            try:
                Match.objects.get(talent_id=talent.id,company_id=company.id, position_id=position.id, from_batch=True, batch_id=batch.pk)
            except:
                match = Match.objects.create(talent_id=talent.id,company_id=company.id, position_id=position.id, match=match_percentage, from_batch=True, batch_id=batch.pk)
                match.save()
                new_matches.append(match)
                send_email_to_both_sides(match)

def salaries_match(position,talent):
    return True
    max_proposed_salary = int(position.salary)
    min_desired = int(talent.salary)
    return min_desired <= max_proposed_salary
 
def time_coverage(position,talent):
    polygonA_points = []
    polygonA_points = get_polygon_points(position.time_preferences)
    polygonB_points = []
    polygonB_points = get_polygon_points(talent.time_preferences)
    polygonA = Polygon(polygonA_points)
    polygonB = Polygon(polygonB_points)
    interesection_coverage = polygonA.intersection(polygonB).area
    intersection_percentage = int((interesection_coverage/polygonB.area)*100)
    intersection_percentage += 20
    if  intersection_percentage > 100:
        intersection_percentage = 100
    return intersection_percentage
    
def tech_skill_coverage(position,talent):
    required_skills = ast.literal_eval(position.tech_skills)
    talent_skills = ast.literal_eval(talent.tech_skills)
    
    matched_skills = []
    for i in required_skills:
        for j in talent_skills:
            if required_skills[i] == talent_skills[j]:
                matched_skills.append(required_skills[i])
    
    return int(len(matched_skills)*20)
   
def send_email_to_both_sides(match):
    company_user_id = Company.objects.get(id=match.company_id).user_id
    company_email = User.objects.get(id=company_user_id).email
    
    talent_user_id = Talent.objects.get(id=match.talent_id).user_id
    talent_email = User.objects.get(id=talent_user_id).email
    
    topic = "Codematch.eu - new Match"
    talent_messege = "Congratulations, you have a new match. \nYou can see it in the matches section in your profile.\n http://codematch.eu/login/"
    company_messege = "Congratulations, you have a new match. \nYou can see it in the matches section in your profile.\n http://codematch.eu/company/login/"             
    from_email = "support@codematch.eu"
    send_mail(topic, company_messege, from_email, [company_email])
    send_mail(topic, talent_messege, from_email, [talent_email])
    
def get_polygon_points(time_preferences):
    arr = time_preferences
    arr = arr[1:len(arr)-1].split("},")
    new_arr = map(lambda el: el+"}" if el[len(el)-1]!="}" else el, arr)
    returned_arr = []
    for el in new_arr:
        dic = ast.literal_eval(el)
        returned_arr.append((dic["x"], dic["y"]))
  
    return returned_arr

def find_match_for_talent(request):
    positions = Position.objects.filter(purpose="outside_batch")
    talent = Talent.objects.get(user=request.user.id)
    for position in positions:
        check_for_match(position,talent)

def find_match_for_company(request):
    talents = Talent.objects.filter(can_match_outside_batch=True)
    company = Company.objects.get(user=request.user.id)
    company_positions = Position.objects.filter(company_id=company.id, purpose="outside_batch")
    for position in company_positions:
        for talent in talents:
            check_for_match(position,talent)

def check_for_match(position,talent):
    if salaries_match(position,talent):
        time_priority = 0.7
        tech_priority = 0.3
        min_overall_percentage = 70
        time_percentage = time_coverage(position,talent)
        tech_skill_percentage = tech_skill_coverage(position,talent)
        match_percentage = time_percentage*time_priority + tech_skill_percentage*tech_priority
        
        #return HttpResponse(str(match_percentage)+" "+str(min_overall_percentage) , content_type="text/html; charset=utf-8")
        if match_percentage >= min_overall_percentage:
            company = Company.objects.get(id=position.company_id)
            try:
                Match.objects.get(talent_id=talent.id,company_id=company.id, position_id=position.id, from_batch=False)
            except:
                match = Match.objects.create(talent_id=talent.id,company_id=company.id, position_id=position.id, match=match_percentage, from_batch=False)
                match.save()
                send_email_to_both_sides(match)
