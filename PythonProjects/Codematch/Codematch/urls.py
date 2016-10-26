from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
import os
from companies.company_urls import companypatterns
from talents.talent_urls import talentpatterns
from matchseek.matchseek_urls import matchseekpatterns
from adminpanel.adminpanel_urls import adminpanelpatterns

def fromRelativePath(*relativeComponents):
    return os.path.join(os.path.dirname(__file__), *relativeComponents).replace("\\","/")
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'landing_page.views.render_landing_page', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url("^admin-media/(?P<path>.*)$",
    "django.views.static.serve",
    {"document_root": fromRelativePath("media", "admin-media")}),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
)

urlpatterns += companypatterns
urlpatterns += talentpatterns
urlpatterns += matchseekpatterns
urlpatterns += adminpanelpatterns
