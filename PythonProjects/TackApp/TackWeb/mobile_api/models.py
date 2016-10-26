from django.db import models

class Sticker(models.Model):
    lat = models.FloatField()
    lng = models.FloatField()
    radius = models.IntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    image = models.ImageField(upload_to='stickers/',default = 'stickers/default.png')
    
    def __unicode__(self):
        return unicode(str(self.image))