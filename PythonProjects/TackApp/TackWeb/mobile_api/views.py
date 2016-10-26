from django.shortcuts import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from mobile_api.models import Sticker
from mobile_api.additional_functions import distance, send_error_email, send_log_message
from itertools import chain
from django.conf import settings
import inspect
import datetime
from datetime import timedelta
from django.utils import simplejson

@csrf_exempt
def get_stickers(request):
    try:
        lat = float(request.POST["lat"])
        lng = float(request.POST["lng"])
        encoded = int(request.POST["encoded"])
        
        if encoded == 0:
            dist_and_stickers = [{distance([sticker.lat, sticker.lng], [lat, lng]):sticker} for sticker in Sticker.objects.all()
                            if distance([sticker.lat, sticker.lng], [lat, lng]) < sticker.radius]
            stickers_dict = {}
            for i  in dist_and_stickers:
                stickers_dict.update(i)
            
            selected_stickers = []
            for key in sorted(stickers_dict.iterkeys()):
                selected_stickers.append(stickers_dict[key])
                
            if not selected_stickers:
                return HttpResponse("No stickers around", content_type="text/html; charset=utf-8")
            
            data = serializers.serialize("json", selected_stickers)
            return HttpResponse(data, content_type="application/json; charset=utf-8")
        else:
            dist_and_stickers = [{distance([sticker.lat, sticker.lng], [lat, lng]):sticker} for sticker in Sticker.objects.all()
                            if distance([sticker.lat, sticker.lng], [lat, lng]) < sticker.radius]
            stickers_dict = {}
            for i  in dist_and_stickers:
                stickers_dict.update(i)
            
            selected_stickers = []
            for key in sorted(stickers_dict.iterkeys()):
                selected_stickers.append(stickers_dict[key])
                
            if not selected_stickers:
                return HttpResponse("No stickers around", content_type="text/html; charset=utf-8")
            
            stickers_encoded_urls = []
            for sticker in selected_stickers:
                stickers_encoded_urls.append((open(settings.MEDIA_ROOT + str(sticker.image), "rb").read()).encode("base64"))
            
            #data = serializers.serialize("json", selected_stickers)
            data = simplejson.dumps(stickers_encoded_urls)
            return HttpResponse(data, mimetype='application/json')
    except Exception:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error occured", content_type="text/html; charset=utf-8")