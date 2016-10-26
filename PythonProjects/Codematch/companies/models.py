# -*- coding: utf-8 -*- 
from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
        user = models.OneToOneField(User)
        company_name = models.CharField(max_length=100,null=True, blank=True)
        user_name = models.CharField(max_length=50,null=True, blank=True)
        location = models.CharField(max_length=100,null=True, blank=True)
        short_description = models.TextField(null=True, blank=True)
        website_url = models.CharField(max_length=100,null=True, blank=True)
        foundation_year = models.CharField(max_length=100,null=True, blank=True)
        company_size = models.CharField(max_length=100,null=True, blank=True)
        industry = models.CharField(max_length=100,null=True, blank=True)
        tech_stack = models.TextField(null=True, blank=True)
        software_used = models.TextField(null=True, blank=True)
        funding = models.CharField(max_length=100,null=True, blank=True)
        investors = models.TextField(null=True, blank=True)
        annual_salary = models.CharField(max_length=100,null=True, blank=True)
        perks = models.TextField(null=True, blank=True)
        video_url = models.CharField(max_length=100,null=True, blank=True)
        crunch_base_url = models.CharField(max_length=100,null=True, blank=True)
        angel_list_url = models.CharField(max_length=100,null=True, blank=True)
        fb_page_url = models.CharField(max_length=100,null=True, blank=True)
        twitter_page_url = models.CharField(max_length=100,null=True, blank=True)
        youtube_channel_url = models.CharField(max_length=100,null=True, blank=True)
        long_description = models.TextField(null=True, blank=True)
        profile_picture = models.ImageField(upload_to='company_profile_pictures/',
                                      default = 'company_profile_pictures/profile_default.png',null=True, blank=True)

        def __unicode__(self):
                return str(self.user)

def generate_filename(self, filename):
            safe_name = self.company_name.replace(' ', '_')
            url = "company_galleries/%s/%s" % (safe_name, filename)
            return url

class CompanyImages(models.Model):
        company_id = models.IntegerField()
        company_name = models.CharField(max_length=100,null=True, blank=True)
        image = models.ImageField(upload_to=generate_filename,
                                      default = 'company_galleries/profile_default.png',null=True, blank=True)

        def __unicode__(self):
                return str(self.company_name)

class Position(models.Model):
        tech_skills = models.TextField(null=True, blank=True)
        time_preferences = models.TextField(null=True, blank=True)
        salary = models.CharField(max_length=50,null=True, blank=True)
        exp_level = models.CharField(max_length=50,null=True, blank=True)
        work_type = models.CharField(max_length=50,null=True, blank=True)
        project_description = models.TextField(null=True, blank=True)
        company_id = models.IntegerField()
        title = models.CharField(max_length=50,null=True, blank=True)
        purpose = models.CharField(max_length=50,null=True, blank=True)
        
        def __unicode__(self):
                return str(self.company_id)