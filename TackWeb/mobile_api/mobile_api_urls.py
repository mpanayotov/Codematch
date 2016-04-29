from django.conf.urls import patterns, url

moible_api_patterns = patterns('',
    url(r'^getStickers/$', 'mobile_api.views.get_stickers'),
    #url(r'^getAvailabilityAndDisplayPartners/$', 'mobile_api.views.get_parking_information_and_show_partners_around'),
)