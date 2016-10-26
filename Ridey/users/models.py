# -*- coding: utf-8 -*- 
from django.db import models
from django.contrib.auth.models import User

class Fb_user(models.Model):
        user = models.OneToOneField(User)
        fb_email = models.EmailField()
        fb_name = models.CharField(max_length=45)
        fb_id = models.CharField(max_length=16)
        car_image = models.ImageField(upload_to='car_images/',default = 'car_images/car_default.png')
        phone_number = models.CharField(max_length=30, null=True, blank=True)
        last_post_id = models.IntegerField(null=True, blank=True)
        rating = models.IntegerField(default=1)
        positive_raters = models.IntegerField(default=1)
        negative_raters = models.IntegerField(default=1)
        
        def __unicode__(self):
                return unicode(str(self.fb_name))

class Comment(models.Model):
        comment = models.TextField()
        fb_id = models.CharField(max_length=16)
        from_fb_id = models.CharField(max_length=16)
        from_fb_name = models.CharField(max_length=45)
        
        def __unicode__(self):
                return unicode(str(self.comment))