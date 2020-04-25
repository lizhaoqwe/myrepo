from django.contrib import admin
from django.urls import path,include
from . import views
app_name = 'xfzauth'
urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('img_captcha/',views.img_captcha, name='img_captcha'),
    path('register/',views.register, name='register')
]