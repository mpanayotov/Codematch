import math
import re
import datetime
from django.core.mail import EmailMessage
import sys, os
import inspect

def mobile(request):

    device = {}

    ua = request.META.get('HTTP_USER_AGENT', '').lower()

    if ua.find("iphone") > 0:
        device['iphone'] = "iphone" + re.search("iphone os (\d)", ua).groups(0)[0]

    if ua.find("ipad") > 0:
        device['ipad'] = "ipad"

    if ua.find("android") > 0:
        device['android'] = "android" + re.search("android (\d\.\d)", ua).groups(0)[0].translate(None, '.')

    # spits out device names for CSS targeting, to be applied to <html> or <body>.
    device['classes'] = " ".join(v for (k,v) in device.items())

    return device

def distance(origin, destination):
    """
    function that calculates and returns the distance between two points
    where each point has two values - latitude and longitude
    """
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius = 6371  # km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = radius * c

    return d

def send_error_email(function_name):
    exc_type, exc_obj, exc_tb = sys.exc_info()
    file_name = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    description = "File name: " + str(file_name) + "\n" + "Function name: "+ str(function_name) + "\n" + "Error type: " + str(exc_type) + "\n" + "Error on line: " + str(exc_tb.tb_lineno)  
    date_time = "datetime: " + str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M")) +" \n"
    description = date_time + description
    email = EmailMessage('Ridey Error', description, to=['mihail_workbuz@abv.bg'])
    email.send()

def send_log_message(description):
    email = EmailMessage('Ridey Log', description, to=['mihail_workbuz@abv.bg'])
    email.send()
#time_now = datetime.datetime.now()
#        reports_around_closest_branch = [report for report in reports_around_closest_branch
#                   if divmod((time_now - report.datetime.replace(tzinfo=None)).days, 60)[0] < 60]

def find_between( s, first, last ):
    try:
        start = s.index( first ) + len( first )
        end = s.index( last, start )
        return s[start:end]
    except ValueError:
        return ""