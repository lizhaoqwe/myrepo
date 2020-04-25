from django.contrib import admin
from django.urls import path,include
from . import views
app_name = 'news'
urlpatterns = [
    path('news_detail/<news_id>/', views.news_detail, name='news_detail'),
    path('search/', views.search, name='search'),
    path('payinfo/', views.payinfo, name='payinfo'),
    path('news_list/', views.news_list, name='news_list'),
    path('news_comment/', views.news_comment, name='news_comment'),
]
