from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('check/', views.checkuser, name='check'),
    path('addWatchlist/', views.addWatchlist, name='addWatchlist'),
    path('getWatchlistPerf/', views.getWatchlistPerf, name='getWatchlistPerf'),
    path('removeWatchlist/', views.removeWatchlist, name='removeWatchlist'),
    path('addCompanyToWatchlist/', views.addCompanyToWatchlist, name='addCompanyToWatchlist'),
    path('getCompanyGraph/', views.getCompanyGraph, name='getCompanyGraph'),
]