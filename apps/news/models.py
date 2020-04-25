from django.db import models
from apps.xfzauth.models import User



class NewsCategory(models.Model):
    name = models.CharField(max_length=100)


class News(models.Model):
    title = models.CharField(max_length=200)
    desc = models.CharField(max_length=200)
    thumbnail = models.URLField()
    content = models.TextField()
    pub_time = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey('NewsCategory',on_delete=models.SET_NULL,null=True)
    author = models.ForeignKey('xfzauth.User',on_delete=models.SET_NULL,null=True)
    class Meta:
        ordering = ['-pub_time']

class Comment(models.Model):
    pub_time = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    author = models.ForeignKey('xfzauth.User',on_delete=models.CASCADE)
    news = models.ForeignKey('News',on_delete=models.CASCADE)
    class Meta:
        ordering = ['-pub_time']


class Banner(models.Model):
    priority = models.IntegerField()
    image_url = models.URLField()
    link_to = models.URLField()
    pub_time = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-priority']