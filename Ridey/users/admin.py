# -*- coding: utf-8 -*- 
from django.contrib import admin
from users.models import Fb_user, Comment

class UserAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    #search_fields = ['datetime']
    list_display = ['user', 'fb_email', 'fb_name','fb_id', 'car_image', 'phone_number',
                     'last_post_id', 'rating', 'positive_raters', 'negative_raters']

class CommentAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    #search_fields = ['datetime']
    list_display = ['fb_id', 'comment', "from_fb_id", "from_fb_name"]
    
admin.site.register(Fb_user, UserAdmin)
admin.site.register(Comment, CommentAdmin)