#!/usr/bin/python
# -*- coding: utf-8 -*- 
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import HttpResponse
from django.core import serializers

def render_landing_page(request):
    return render_to_response('index.html',{},context_instance=RequestContext(request))