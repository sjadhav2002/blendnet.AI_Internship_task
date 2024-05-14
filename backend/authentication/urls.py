from django.urls import path
from . import views

urlpatterns = [
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.signout, name='signout'),
    path('get_csrf/', views.get_csrf_token, name='csrf'),
    path('check_username/<str:username>/', views.check_username, name='check_username'),
]