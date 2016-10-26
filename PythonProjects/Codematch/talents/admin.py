# -*- coding: utf-8 -*- 
from django.contrib import admin
from talents.models import Talent, UserProfile

class TalentAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['username']
    list_display = ['user', 'username', 'location', 'tech_skills', 'time_preferences',
                     'role', 'exp_level', 'work_description', 'salary', 'operating_system',
                     'editor', 'relocate', 'linkedin_url', 'github_url', 'profile_picture']

class UserProfileAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['email']
    list_display = ['email', 'activation_key']

admin.site.register(Talent, TalentAdmin)
admin.site.register(UserProfile, UserProfileAdmin)