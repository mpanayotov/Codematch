#!/usr/bin/python
# -*- coding: utf-8 -*- 
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from landing_page.additional_functions import send_error_email
from django.shortcuts import HttpResponse
from landing_page.models import Post
from landing_page.additional_functions import mobile
from users.models import Fb_user
from django.core import serializers
import inspect
import datetime
from django.utils import simplejson

def render_landing_page(request):
    try:
        all_posts = Post.objects.all().order_by("id")
        last_post_id = all_posts[len(all_posts)-1].id
        if request.user.is_authenticated():
            fb_user = Fb_user.objects.get(user=request.user.id)
            message = None
            duration = None
            if fb_user.last_post_id:
                last_post = Post.objects.filter(id=fb_user.last_post_id)
                duration = calculate_time_difference(last_post)[0]
                message = last_post[0].message
            return render_to_response('index.html',
                                   {"fb_user":fb_user,
                                    "user_last_post":message,
                                     "last_post_duration": duration,
                                     "last_post_id":last_post_id},
                                    context_instance=RequestContext(request))
        else:
            return render_to_response('index.html',{"last_post_id":last_post_id},context_instance=RequestContext(request))
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("error", content_type="text/html; charset=utf-8")

"""
    iphone = "iphone" in mobile(request)
    
    all_posts = Post.objects.all()
    last_post_id = all_posts[len(all_posts)-1].id
    
    post_objects = Post.objects.filter(direction_from__exact="Стара Загора", direction_to__exact="София").order_by("-id")[:30]
    durations = calculate_time_difference(post_objects)
    posts = [(post,duration) for post,duration in zip(post_objects,durations)]
    
    post_objects_two = Post.objects.filter(direction_from__exact="София", direction_to__exact="Стара Загора").order_by("-id")[:30]
    durations_two = calculate_time_difference(post_objects_two)
    posts_two = [(post,duration) for post,duration in zip(post_objects_two,durations_two)]
    
    if request.user.is_authenticated():
        fb_user = Fb_user.objects.get(user=request.user.id)
        message = None
        duration = None
        if fb_user.last_post_id:
            last_post = Post.objects.filter(id=fb_user.last_post_id)
            duration = calculate_time_difference(last_post)[0]
            message = last_post[0].message
        return render_to_response('index.html',
                               {"posts":posts,"posts_two":posts_two, "iphone":iphone, "fb_user":fb_user,
                                "user_last_post":message, "last_post_duration": duration,
                                 "length1":len(posts), "length2":len(posts_two),"last_post_id":last_post_id},
                                context_instance=RequestContext(request))
    else:
        return render_to_response('index.html',
                               {"posts":posts, "posts_two":posts_two, "iphone":iphone,
                                 "length1":len(posts), "length2":len(posts_two), "last_post_id":last_post_id},
                                context_instance=RequestContext(request))
"""

@csrf_exempt
def show_posts_for_direction(request):
    try:
        direction_from = request.POST["direction_from"]
        direction_to = request.POST["direction_to"]
        start_from = request.POST["start_from"]
        last_post_id = request.POST["last_post_id"]
        end_with = int(start_from) + 10
        post_objects = Post.objects.filter(direction_from__exact=direction_from,
                                     direction_to__exact=direction_to,
                                     id__lte=last_post_id).order_by("-id")[start_from:end_with]
        durations = calculate_time_difference(post_objects)

        posts = [(post.name, post.fb_id, post.car_image, post.phone_number, post.message, post.update,
                  post.rating, post.direction_from, post.direction_to,duration) 
                 for post,duration in zip(post_objects,durations)]
        posts_json = simplejson.dumps({"posts" : posts})
        return HttpResponse(posts_json, content_type ="application/json; charset=utf-8")

    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("error", content_type="text/html; charset=utf-8")

@csrf_exempt
def show_recent_posts(request):
    try:
        direction_from = request.POST["direction_from"]
        direction_to = request.POST["direction_to"]
        last_post_id = request.POST["last_post_id"]
        post_objects = Post.objects.filter(direction_from__exact=direction_from,
                                     direction_to__exact=direction_to,
                                     id__gt=last_post_id).order_by("-id")
        durations = calculate_time_difference(post_objects)

        posts = [(post.name, post.fb_id, post.car_image, post.phone_number, post.message, post.update,
                  post.rating, post.direction_from, post.direction_to,duration) 
                 for post,duration in zip(post_objects,durations)]
        posts_json = simplejson.dumps({"posts" : posts})
        return HttpResponse(posts_json, content_type ="application/json; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("error", content_type="text/html; charset=utf-8")

@csrf_exempt
def actualise_lastpostid(request):
    try:
        all_posts = Post.objects.all().order_by("id")
        last_post_id = all_posts[len(all_posts)-1].id
        return HttpResponse(last_post_id, content_type="text/html; charset=utf-8")
    except:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("error", content_type="text/html; charset=utf-8")

@csrf_exempt
def test_global(request):
    data = serializers.serialize("json", current_posts)
    return HttpResponse(data, content_type="application/json; charset=utf-8")

def calculate_time_difference(posts):
    now = datetime.datetime.now()
    durations = []
    for post in posts:
        duration = now - post.date
        days, seconds = duration.days, duration.seconds
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        
        duration_string = ""
        if days > 0:
            if days == 1 :
                duration_string ="от "+ str(days) + " ден"
            else:
                duration_string = "от "+ str(days) + " дни"
        else:
            if hours > 0:
                if hours == 1:
                    duration_string ="от "+ str(hours) + " час"
                else:
                    duration_string ="от "+ str(hours) + " часа"
            else:
                if minutes > 0:
                    if minutes == 1:
                        duration_string ="от "+ str(minutes) + " минута"
                    else:
                        duration_string ="от "+ str(minutes) + " минути"
                else:
                    duration_string = "току-що"
        durations.append(duration_string)
    return durations;
                        
@csrf_exempt
def save_new_post(request):
    if request.method == 'POST':
        if request.user.is_authenticated():
            #try:
                user = Fb_user.objects.get(user=request.user.id)
                fb_id = user.fb_id
                name = user.fb_name
                rating = user.rating
                car_image = user.car_image
                phone_number = user.phone_number
                date = datetime.datetime.now()
                message = request.POST["message"]
                direction_from = request.POST["direction_from"]
                direction_to = request.POST["direction_to"]
                post = Post.objects.create(fb_id=fb_id, name=name, rating=rating, car_image=car_image,
                                           phone_number=phone_number, date=date, message=message,
                                           direction_from=direction_from, direction_to=direction_to)
                post.save()
                user.last_post_id = post.id
                user.save()
                return HttpResponse("post_saved", content_type="text/html; charset=utf-8")
            #except:
                #send_error_email(inspect.stack()[0][3])
                #return HttpResponse("Error", content_type="text/html; charset=utf-8")
        else:
            send_error_email(inspect.stack()[0][3])
            return HttpResponse("user_not_authenticated", content_type="text/html; charset=utf-8")
    else:
        send_error_email(inspect.stack()[0][3])
        return HttpResponse("request_not_post", content_type="text/html; charset=utf-8")