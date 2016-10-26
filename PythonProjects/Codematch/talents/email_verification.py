# -*- coding: utf-8 -*- 
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
#from email.MIMEImage import MIMEImage
import string
import random
import os
import datetime
from django.contrib.sites.models import Site
from talents.models import UserProfile
from django.core.mail import send_mail


@csrf_exempt
def activation_email(request):
    email = request.POST["email"]
    try:
        User.objects.get(email=email)
        return HttpResponse("duplicated_email", content_type="text/html; charset=utf-8")
    except:
        activation_key = generate_activation_key()
        user_profile = UserProfile.objects.create(email=email, activation_key=activation_key)
        user_profile.save()
        
        send_activation_email(email, activation_key)
                       
        return HttpResponse("Verification_email_sent", content_type="text/html; charset=utf-8")

def generate_activation_key():
    key = str(''.join(random.choice(string.ascii_letters + string.digits) for i in range(25)))
    return key

def send_activation_email(email, activation_key):
    current_site = Site.objects.get_current().domain
    key_str = "http://" + current_site + "/confirm/" + activation_key + "/"
    content = """Thank you for signing up, you are 1 step away from creating your unique profile in codematch.eu! \n
    Click the link below to verify your email and complete your profile. \n """+key_str
                
    send_mail("Codematch.eu Verification", content, "support@codematch.eu", [email])

"""
def send_activation_email(email, activation_key):
    template_html = 'email_acc_activation.html'
    template_text = 'email_acc_activation.txt'

    subject = "Codematch email verification"

    from_email = settings.DEFAULT_FROM_EMAIL           
    #date = str(datetime.datetime.now().strftime("%d %B"))
    
    current_site = Site.objects.get_current().domain
    activation_url = content = "http://" + current_site + "/confirm/" + activation_key + "/"
    
    text_content = render_to_string(template_text, {"activation_url": activation_url})
    html_content = render_to_string(template_html, {"activation_url": activation_url})

    msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
    msg.attach_alternative(html_content, "text/html")
    
    #images = ['checkmark_big.png']
    
    #for image in images:
        #fp = open('/home/park0odf/www.testparkingsector.bg/static/imgs/mail/' + image, 'rb')
        #msg_img = MIMEImage(fp.read())
        #fp.close()
        #msg_img.add_header('Content-ID', '<{0}>'.format(image))
        #msg.attach(msg_img)
    
    msg.send()
"""
@csrf_exempt
def confirm(request, activation_key):
    try:
        profile = UserProfile.objects.get(activation_key=activation_key)
        email = profile.email
        profile.delete()
        return render_to_response('signup.html', {"email":email}, context_instance=RequestContext(request))
    except:
        return render_to_response('expired.html', {}, context_instance=RequestContext(request))