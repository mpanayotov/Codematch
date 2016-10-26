from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
import os
def fromRelativePath(*relativeComponents):
    return os.path.join(os.path.dirname(__file__), *relativeComponents).replace("\\","/")

from mobile_api.mobile_api_urls import moible_api_patterns
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'homepage.views.render_landing_page', name='home'),
    url("^admin-media/(?P<path>.*)$",
    "django.views.static.serve",
    {"document_root": fromRelativePath("media", "admin-media")}),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += moible_api_patterns