# -*- coding: utf-8 -*- 
from django.db import models

class Post(models.Model):
    name = models.CharField(max_length=50)
    fb_id = models.CharField(max_length=16)
    date = models.DateTimeField()
    car_image = models.CharField(max_length=150, default = 'car_images/car_default.png')
    phone_number = models.CharField(max_length=30, null=True, blank=True)
    message = models.TextField()
    update = models.TextField(null=True, blank=True)
    rating = models.IntegerField()
    direction_from = models.CharField(max_length=30)
    direction_to = models.CharField(max_length=30)
    
    def __unicode__(self):
        return unicode(str(self.id))
