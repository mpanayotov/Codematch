# -*- coding: utf-8 -*- 
from django.contrib import admin
from mobile_api.models import Sticker

class StickerAdmin(admin.ModelAdmin):
    #ordering = ['datetime']
    #search_fields = ['datetime']
    list_display = ['id', 'image', 'lat', 'lng', 'radius', 'start_time', 'end_time']

admin.site.register(Sticker, StickerAdmin)