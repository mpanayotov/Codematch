from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
import os
def fromRelativePath(*relativeComponents):
    return os.path.join(os.path.dirname(__file__), *relativeComponents).replace("\\","/")
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'landing_page.views.render_landing_page', name='home'),
    url(r'^uploadCarImage/$', 'users.views.upload_car_image'),
    url(r'^savePhoneNumber/$', 'users.views.save_phone_number'),
    url(r'^saveComment/$', 'users.views.save_comment'),
    url(r'^publicatePost/$', 'landing_page.views.save_new_post'),
    url(r'^updateLastPost/$', 'users.views.update_post'),
    url(r'^showMorePosts/$', 'landing_page.views.show_posts_for_direction'),
    url(r'^showRecentPosts/$', 'landing_page.views.show_recent_posts'),
    url(r'^actualiseLastPostId/$', 'landing_page.views.actualise_lastpostid'),
    url(r'^loadComments/$', 'users.views.get_comments'),
    url(r'^logout/$', 'users.views.logout_request'),
    url(r'^fbLogin/$', 'users.views.facebook_login'),
    url(r'^searchName/$', 'users.views.get_name_results'),
    url(r'^testGlobal/$', 'landing_page.views.test_global'),
    url(r'^admin/', include(admin.site.urls)),
    url("^admin-media/(?P<path>.*)$",
    "django.views.static.serve",
    {"document_root": fromRelativePath("media", "admin-media")}),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
)

