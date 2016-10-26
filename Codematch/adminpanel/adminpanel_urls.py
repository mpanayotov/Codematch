from django.conf.urls import patterns, include, url

adminpanelpatterns = patterns('',
    url(r'^adminpanel/', 'adminpanel.functions.render_admin_panel'),
    url(r'^getRequests/', 'adminpanel.functions.get_batch_requests_for_apporval'),
    url(r'^approve/talent/', 'adminpanel.functions.approve_talent_for_batch'),
    url(r'^approve/company/', 'adminpanel.functions.approve_company_for_batch'),
)