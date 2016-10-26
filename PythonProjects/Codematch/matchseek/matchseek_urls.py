from django.conf.urls import patterns, include, url

matchseekpatterns = patterns('',
    url(r'^saveChoice/', 'matchseek.views.save_choice'),
    url(r'^createMessege/', 'matchseek.views.create_messege'),
    url(r'^adminpanel/findMatches/', 'matchseek.matchfunctions.find_matches'),
)