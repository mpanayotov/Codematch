#!/usr/bin/python
# -*- coding: utf-8 -*- 
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import HttpResponse
from users.models import Fb_user, Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from landing_page.models import Post
from landing_page.additional_functions import send_error_email, find_between
from django.core import serializers
from django.utils import simplejson
import inspect
import string
import random
import requests

@csrf_exempt
def facebook_login(request):
    try:
        if request.is_ajax():
            if request.method == "POST":
                email = request.POST['email']
                username = request.POST['username']
                fb_id = request.POST['fb_id']
                try:
                    user = User.objects.get(id=Fb_user.objects.get(fb_email=email).user_id)
                except Fb_user.DoesNotExist:
                    return register_user_with_fb(request, email, username, fb_id)
                if user is not None:
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                    return HttpResponse("fblogin_complete", content_type="text/html; charset=utf-8")
                else:
                    send_error_email(inspect.stack()[0][3])
                    return HttpResponse("Cant authenticate", content_type="text/html; charset=utf-8")
            else:
                send_error_email(inspect.stack()[0][3])
                return HttpResponse("request method is not POST", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("not_ajax", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")
    
def register_user_with_fb(request, email, username, fb_id):
    password = str(''.join(random.choice(string.ascii_letters + string.digits) for i in range(12)))
    user = User.objects.create_user(username=username,
                                    email=email,
                                    password=password)
    user.save()
    
    #get fb_user adminid by using external site
    r = requests.get("http://fber.biz/en/tool/get-facebook-id-from-scoped", data={"FindIDForm[input]": fb_id, "FindIDForm[more]":"0"})
    real_fb_id = find_between(r.text, '<code class="text-30">', '</code>') 
    if real_fb_id == "":
        real_fb_id = fb_id
    
    fb_user = Fb_user(user=user,
                                fb_email=email,
                                fb_name=username,
                                fb_id=real_fb_id)
    fb_user.save()
            
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)
            
    #send_email_after_fbregister(email)          
    return HttpResponse("registration_with_fb_complete", content_type="text/html; charset=utf-8")

@csrf_exempt
def upload_car_image(request):
    if request.method == 'POST':
        if request.user.is_authenticated():
            try:
                user = Fb_user.objects.get(user=request.user.id)
                user.car_image = request.FILES["car_image"]
                user.save()
                return HttpResponse("Image_uploaded", content_type="text/html; charset=utf-8")
            except:
                send_error_email(inspect.stack()[0][3])
                return HttpResponse("Error", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("user_not_authenticated", content_type="text/html; charset=utf-8")
    else:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("request_not_post", content_type="text/html; charset=utf-8")

@csrf_exempt
def save_phone_number(request):
    if request.method == 'POST':
        if request.user.is_authenticated():
            try:
                user = Fb_user.objects.get(user=request.user.id)
                user.phone_number = request.POST["phone_number"]
                user.save()
                return HttpResponse("phone_number_uploaded", content_type="text/html; charset=utf-8")
            except:
                send_error_email(inspect.stack()[0][3])
                return HttpResponse("Error", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("user_not_authenticated", content_type="text/html; charset=utf-8")
    else:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("request_not_post", content_type="text/html; charset=utf-8")

@csrf_exempt
def update_post(request):
    if request.method == 'POST':
        if request.user.is_authenticated():
            try:
                user = Fb_user.objects.get(user=request.user.id)
                last_post = Post.objects.get(id=user.last_post_id)
                last_post.update = request.POST["update_text"]
                last_post.save()
                return HttpResponse("update_saved", content_type="text/html; charset=utf-8")
            except:
                send_error_email(inspect.stack()[0][3])
                return HttpResponse("Error", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("user_not_authenticated", content_type="text/html; charset=utf-8")
    else:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("request_not_post", content_type="text/html; charset=utf-8")

@csrf_exempt
def get_comments(request):
    try:
        fb_id = request.POST["fb_id"]
        comments = Comment.objects.filter(fb_id=fb_id)
        if len(comments) == 0 :
            return HttpResponse("no_comments_yet", content_type="text/html; charset=utf-8")
        else:
            data = serializers.serialize("json", comments)
            return HttpResponse(data, content_type="application/json; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

@csrf_exempt
def save_comment(request):
    try:
        if request.method == 'POST':
            if request.user.is_authenticated():
                try:
                    #assessment = request.POST["assessment"]
                    comment = request.POST["comment"]
                    user_fb_id = request.POST["user_fb_id"]
                    from_user = Fb_user.objects.get(user=request.user.id)
                    from_fb_id = from_user.fb_id
                    from_fb_name = from_user.fb_name
                    #update_rating(user_fb_id, assessment)
                    
                    new_comment = Comment.objects.create(fb_id=user_fb_id, comment=comment, from_fb_id=from_fb_id, from_fb_name=from_fb_name)
                    new_comment.save()              
                    return HttpResponse("comment_saved", content_type="text/html; charset=utf-8")
                except:
                    send_error_email(inspect.stack()[0][3])
                    return HttpResponse("Error", content_type="text/html; charset=utf-8")
            else:
                send_error_email(inspect.stack()[0][3])
                return HttpResponse("user_not_authenticated", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("request_not_post", content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def update_rating(user_fb_id, assessment):
    user = Fb_user.objects.get(fb_id=user_fb_id)
    if assessment == "positive":
        rating = int(round((float(1 + user.positive_raters) / float((1 + user.positive_raters) + user.negative_raters))*5))
        new_positive_raters = 1 + user.positive_raters
        user.rating = rating
        user.positive_raters = new_positive_raters
        user.save()
    else:
        rating = int(round((float(1 + user.negative_raters) / float((1 + user.negative_raters) + user.positive_raters))*5))
        new_negative_raters = 1 + user.negative_raters
        user.rating = rating
        user.negative_raters = new_negative_raters
        user.save()  

@csrf_exempt
def get_name_results(request):
    try:
        name = request.POST["name"]
        users = Fb_user.objects.filter(fb_name__istartswith=name)
        data = serializers.serialize("json", users)
        return HttpResponse(data, content_type="application/json; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("Error", content_type="text/html; charset=utf-8")

def logout_request(request):
        logout(request)
        return HttpResponseRedirect('/')