# -*- coding: utf-8 -*- 
from django.db import models
from django.contrib.auth.models import User

class Talent(models.Model):
        user = models.OneToOneField(User)
        is_active = models.BooleanField(default=True)
        can_match_outside_batch = models.BooleanField(default=True)
        username = models.CharField(max_length=100,null=True, blank=True)
        location = models.CharField(max_length=100,null=True, blank=True)
        tech_skills = models.TextField(null=True, blank=True)
        time_preferences = models.TextField(null=True, blank=True)
        role = models.CharField(max_length=150,null=True, blank=True)
        exp_level = models.CharField(max_length=100,null=True, blank=True)
        work_description = models.TextField(null=True, blank=True)
        salary = models.CharField(max_length=100,null=True, blank=True)
        operating_system = models.CharField(max_length=100,null=True, blank=True)
        editor = models.CharField(max_length=100,null=True, blank=True)
        work_type = models.CharField(max_length=100,null=True, blank=True)
        relocate = models.NullBooleanField(default=False,null=True, blank=True)
        linkedin_url = models.CharField(max_length=100,null=True, blank=True)
        github_url = models.CharField(max_length=100,null=True, blank=True)
        profile_picture = models.ImageField(upload_to='developer_profile_pictures/',
                                      default = 'developer_profile_pictures/profile_default.png',null=True, blank=True)
        
        def __unicode__(self):
                return str(self.user)

class UserProfile(models.Model):
    email = models.EmailField()
    activation_key = models.CharField(max_length=30)
    
    def __unicode__(self):
        return str(self.email)