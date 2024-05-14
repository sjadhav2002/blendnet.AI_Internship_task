from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Company(models.Model):
    symbol = models.CharField(primary_key=True,max_length=50)
    name = models.CharField(max_length=255)
    exchange = models.CharField(max_length=50)
    assetType = models.CharField(max_length=50)
    perf_today = models.FloatField(max_length=10,null=True, blank=True)
    perf_10day = models.FloatField(max_length=10,null=True, blank=True)
    perf_30day = models.FloatField(max_length=10,null=True, blank=True)
    high_today = models.FloatField(max_length=10,null=True, blank=True)
    high_10day = models.FloatField(max_length=10,null=True, blank=True)
    high_30day = models.FloatField(max_length=10,null=True, blank=True)
    low_today = models.FloatField(max_length=10,null=True, blank=True)
    low_10day = models.FloatField(max_length=10,null=True, blank=True)
    low_30day = models.FloatField(max_length=10,null=True, blank=True)
    

    def __str__(self):
        return f"{self.symbol} - {self.name}"
    
class Watchlist(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    companies = models.ManyToManyField('Company', through='WatchlistCompany')

    def __str__(self):
        return self.name
    
    
class WatchlistCompany(models.Model):
    id = models.AutoField(primary_key=True)
    watchlist = models.ForeignKey(Watchlist, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.watchlist.name} - {self.company.name}"