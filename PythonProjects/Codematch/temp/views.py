# -*- coding: utf-8 -*- 
from django.shortcuts import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from mobile_api.models import Partner, Branch, ParkingReport, ApplicationParameters, MobileEmail
from mobile_api.additional_functions import distance, send_error_email, send_log_message
from itertools import chain
from django.conf import settings
import inspect
import datetime
from datetime import timedelta
import logging
log = logging.getLogger(__name__)
#log.info("Hey there it works!!") - write that where you want to test something

def get_partner_images(request):
    try:
        partners = Partner.objects.all()
        app_parameters = ApplicationParameters.objects.all()
        partners_and_parameters = list(chain(partners, app_parameters))
        data = serializers.serialize("json", partners_and_parameters)
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")
            #pass #send email with error message use e, https://wiki.python.org/moin/HandlingExceptions

@csrf_exempt
def get_parking_information_and_show_partners_around(request):
    try:
        radius = 0.6
        radius_for_branches = 0.4

        lat = float(request.POST["lat"])
        lng = float(request.POST["lng"])
        
        reports = []
        time_now = datetime.datetime.now()      
        before_one_hour = time_now - timedelta(hours=3)
        for x in range(0,2):
            reports = [report for report in ParkingReport.objects.filter(datetime__range=(before_one_hour, time_now))
                       if distance([report.lat, report.lng], [lat, lng]) < radius]
            if not reports:
                radius = radius + 0.3
            else:
                break
        
        partners_branches_around = [branch for branch in Branch.objects.all()
                        if distance([branch.lat, branch.lng], [lat, lng]) < radius_for_branches]
            
        reports_and_branches = list(chain(reports, partners_branches_around))
        data = serializers.serialize("json", reports_and_branches)
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")

@csrf_exempt       
def get_parking_information_around_nearest_selected_partner(request):
    try:
        radius = 0.6
            
        lat = float(request.POST["lat"])
        lng = float(request.POST["lng"])
        branch_key = int(request.POST["branch_key"])
        
        partner_branches = Branch.objects.filter(branch_key=branch_key)
        distances_to_partner_branches = [(distance([branch.lat, branch.lng], [lat, lng]), branch)
                                                 for branch in partner_branches]
        # sort tuples and get first one value which is the closest branch object
        closest_branch = sorted(distances_to_partner_branches)[0][1]
        
        reports_around_closest_branch = []
        time_now = datetime.datetime.now()      
        before_one_hour = time_now - timedelta(hours=3)
        for x in range(0,2):
            reports_around_closest_branch = [report for report in ParkingReport.objects.filter(datetime__range=(before_one_hour, time_now))
                                        if distance([report.lat, report.lng], [closest_branch.lat, closest_branch.lng]) < radius]
            if not reports_around_closest_branch:
                radius = radius + 0.3
            else:
                break
        
        closest_branch_and_reports_around_it = list(chain(reports_around_closest_branch, [closest_branch]))
        data = serializers.serialize("json", closest_branch_and_reports_around_it)
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")
        #import sys, os
        #exc_type, exc_obj, exc_tb = sys.exc_info()
        #data =  "Error type: " + str(exc_type) + "\n" + "Error on line: " + str(exc_tb.tb_lineno)
        #return HttpResponse(data, content_type="text/html; charset=utf-8")

@csrf_exempt 
def report_parking_availability(request):
    try:
        #line = str(request.POST["lat"])+str(request.POST["lng"])+str(request.POST["availability"])
        #send_log_message(line)
        lat = float(request.POST["lat"])
        lng = float(request.POST["lng"])
        availability = int(request.POST["availability"])
        time = datetime.datetime.now().replace(tzinfo=None)
            
        report = ParkingReport.objects.create(lat=lat, lng=lng, availability=availability, datetime=time)
        report.save()
        return HttpResponse("Report successful", content_type="text/html; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")  


@csrf_exempt
def receive_email(request):
    try:
        topic = request.POST["topic"]
        message = request.POST["message"]
        email = MobileEmail.objects.create(topic=topic, message=message)
        email.save()
        return HttpResponse("Email successful", content_type="text/html; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")

@csrf_exempt
def show_recent_reports(request):
    try:
        start_minutes = int(request.POST["start_minutes"])
        end_minutes = int(request.POST["end_minutes"])

        start_time = datetime.datetime.now() - timedelta(minutes=start_minutes)
        end_time = datetime.datetime.now() - timedelta(minutes=end_minutes)

        reports = ParkingReport.objects.filter(datetime__range=(start_time, end_time))

        data = serializers.serialize("json", reports)
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")

@csrf_exempt
def add_scheduled_reports(request):
    try:
        minutes_from_now = int(request.POST["minutes_from_now"])
        lat = float(request.POST["lat"])
        lng = float(request.POST["lng"])
        availability = int(request.POST["availability"])

        scheduled_time = (datetime.datetime.now() - timedelta(minutes=minutes_from_now)).replace(tzinfo=None)
            
        report = ParkingReport.objects.create(lat=lat, lng=lng, availability=availability, datetime=scheduled_time)
        report.save()
        return HttpResponse("Report successful", content_type="text/html; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")


"""
@csrf_exempt   
def get_partner_advertisments(request):
    try:
        branch_key = int(request.POST["branch_key"])
        partner = Partner.objects.get(branch_key=branch_key)
        partner_advertisments = {}
        
        first_ad = (open(settings.MEDIA_ROOT + str(partner.advertisment_first), "rb").read()).encode("base64")
        second_ad = (open(settings.MEDIA_ROOT + str(partner.advertisment_second), "rb").read()).encode("base64")
        third_ad = (open(settings.MEDIA_ROOT + str(partner.advertisment_third), "rb").read()).encode("base64")
            
        partner_advertisments[0] = first_ad
        partner_advertisments[1] = second_ad
        partner_advertisments[2] = third_ad
            
        data = simplejson.dumps(partner_advertisments) 
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")
"""  
    
    
    
    
    
    
    
    
    
    
    
    