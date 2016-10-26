# -*- coding: utf-8 -*- 
from django.contrib import admin
from companies.models import Company, Position, CompanyImages

class CompanyAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['company_name']
    list_display = ['user','company_name', 'short_description', 'industry','perks', 'company_size', 'profile_picture']

class PositionAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['company_id']
    list_display = ['company_id', 'tech_skills', 'project_description', 'salary', 'time_preferences']

class CompanyImagesAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['company_name']
    list_display = ['company_name', 'company_id', 'image']

admin.site.register(Company, CompanyAdmin)
admin.site.register(Position, PositionAdmin)
admin.site.register(CompanyImages, CompanyImagesAdmin)