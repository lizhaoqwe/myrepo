from rest_framework import serializers
from .models import News,NewsCategory,Comment,Banner
from apps.xfzauth.serializers import UserSerializer

class NewsCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ['id','name']


class NewsSerializer(serializers.HyperlinkedModelSerializer):
    category = NewsCategorySerializer()
    author = UserSerializer()
    class Meta:
        model = News
        fields = ['id','title','desc','thumbnail','category','author','pub_time']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    author = UserSerializer()
    class Meta:
        model = Comment
        fields = ['id','content','author','pub_time']

class BannerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Banner
        fields = ['id','image_url','link_to','priority']