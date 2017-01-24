# -*- coding: utf-8 -*- 
from django.contrib import admin
from matchseek.models import Batch, BatchCompany, BatchTalent, Match, PlatformInformation

class BatchAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['start_date']
    list_display = ['name', 'start_date','end_date', 'location', 'duration',
                    'active', 'max_number_companies', 'min_number_companies',
                    'number_talents']

class BatchCompanyAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['company_id']
    list_display = ['batch_id', 'company_id']

class BatchTalentAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['talent_id']
    list_display = ['batch_id', 'talent_id']

class MatchAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    search_fields = ['position_id']
    list_display = ['talent_id', 'company_id', 'position_id', 'match']

class PlatformInfoAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    list_display = ['name', 'value']

admin.site.register(Batch, BatchAdmin)
admin.site.register(BatchCompany, BatchCompanyAdmin)
admin.site.register(BatchTalent, BatchTalentAdmin)
admin.site.register(Match, MatchAdmin)
admin.site.register(PlatformInformation, PlatformInfoAdmin)