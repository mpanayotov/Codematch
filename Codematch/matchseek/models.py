# -*- coding: utf-8 -*- 
from django.db import models
from django.contrib.auth.models import User
from talents.models import Talent
from companies.models import Company, Position

class Batch(models.Model):
        start_date = models.DateTimeField()
        end_date = models.DateTimeField()
        location = models.CharField(max_length=100)
        duration = models.IntegerField()
        name = models.CharField(max_length=100)
        active = models.BooleanField(default=False)
        max_number_companies = models.IntegerField()
        min_number_companies = models.IntegerField()
        number_talents = models.IntegerField()
        min_days_before_start = models.IntegerField()
        
        def __unicode__(self):
                return str(self.name)
            
class BatchCompany(models.Model):
        batch_id = models.IntegerField()
        company_id = models.IntegerField()
        approved = models.BooleanField(default=False)
        
        def __unicode__(self):
                return str(self.batch)

class BatchTalent(models.Model):
        batch_id = models.IntegerField()
        talent_id = models.IntegerField()
        approved = models.BooleanField(default=False)
        
        def __unicode__(self):
                return str(self.name)
            
class Match(models.Model):
        talent_id = models.IntegerField()
        company_id = models.IntegerField()
        position_id = models.IntegerField()
        match = models.IntegerField()
        is_talent_interested = models.NullBooleanField(null=True, blank=True)
        from_batch = models.BooleanField(default=False)
        batch_id = models.IntegerField(null=True, blank=True)
        is_active = models.BooleanField(default=True)
        
        def __unicode__(self):
                return str(self.company + " - " + self.talent)
        
        class Meta:
            unique_together = ('talent_id', 'company_id', 'position_id')
 
class Messege(models.Model):
        text = models.TextField()
        match_id = models.IntegerField()
        sender = models.CharField(max_length=30)
        time = models.DateTimeField()
        
        def __unicode__(self):
                return str(self.company_id + " - " + self.talent_id + " - " + self.position_id)
          
class PlatformInformation(models.Model):
    name = models.CharField(max_length=100)
    value = models.TextField()