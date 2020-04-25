from django.contrib import admin
from django.urls import path,include
from apps.news import views
from django.conf.urls.static import static
from django.conf import settings
import os
urlpatterns = [
    path('', views.index, name='index'),
    path('cms/', include('apps.cms.urls')),
    path('account/', include('apps.xfzauth.urls')),
    path('ueditor/', include('apps.ueditor.urls')),
    path('news/',include('apps.news.urls'))
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
