from django.contrib import admin
from django.urls import path,include
from . import views
app_name = 'cms'
urlpatterns = [
    path('', views.cms_index, name='cms_index'),
    path('write_news/', views.write_news, name='write_news'),
    path('gategory/', views.gategory, name='gategory'),
    path('add_news_gategory/', views.add_news_category, name='add_news_gategory'),
    path('delete_news_gategory/', views.delete_news_category, name='delete_news_gategory'),
    path('edit_news_gategory/', views.edit_news_category, name='edit_news_gategory'),
    path('upload/', views.upload, name='upload'),
    path('publish_news/', views.publish_news, name='publish_news'),
    path('banners/', views.banners, name='banners'),
    path('add_banner/', views.add_banner, name='add_banner'),
    path('banner_list/', views.banner_list, name='banner_list'),
    path('banner_delete/', views.banner_delete, name='banner_delete'),
    path('banner_edit/', views.banner_edit, name='banner_edit'),
    path('news_list/', views.NewsListView.as_view(), name='news_list'),
    path('news_delete/', views.news_delete, name='news_delete'),
    path('news_edit/<news_id>', views.NewsEditView.as_view(), name='news_edit'),
]
