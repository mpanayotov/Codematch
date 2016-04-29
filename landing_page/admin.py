# -*- coding: utf-8 -*- 
from django.contrib import admin
from landing_page.models import Post

class PostAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    #search_fields = ['datetime']
    list_display = ['id', 'message', 'update','direction_from', 'direction_to', 'rating', 'name',
                     'fb_id', 'date', 'car_image', 'phone_number']

admin.site.register(Post, PostAdmin)