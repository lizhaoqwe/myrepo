from django.db.models import F
from django.shortcuts import render
from .models import NewsCategory
from .models import News
from django.conf import settings
from .serializers import NewsSerializer,CommentSerializer
from utils import restful
from django.views.decorators.http import require_POST,require_GET
from django.http import Http404
from .forms import CommentForm
from .models import Comment
from apps.xfzauth.decorators import xfz_login_required
from .models import Banner
def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    articles = News.objects.order_by('-pub_time')[0:count]
    categories = NewsCategory.objects.all()
    banners = Banner.objects.all()
    context = {
        'banners': banners,
        'articles': articles,
        'categories': categories
    }
    return render(request, 'index.html',context=context)

def news_list(request):
    page = int(request.GET.get('p',1))
    category_id = int(request.GET.get('category_id',0))
    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT
    if category_id == 0:
        newses = News.objects.all()[start:end]
    else:
        newses = News.objects.filter(category__id=category_id)[start:end]
    serializer = NewsSerializer(newses,many=True)
    data = serializer.data
    return restful.result(data=data)




def news_detail(request,news_id):
    print(news_id)
    news = News.objects.get(pk=news_id)
    comments = Comment.objects.filter(news=news)
    context = {
        'news': news,
        'comments': comments,
    }
    return render(request, 'news_detail.html', context=context)


@xfz_login_required
def news_comment(request):
    commentform = CommentForm(request.POST)
    print(request.POST)
    print(commentform.is_valid())
    if commentform.is_valid():
        content = commentform.cleaned_data.get('content')
        news_id = commentform.cleaned_data.get('news_id')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content,news=news,author=request.user)
        serializer = CommentSerializer(comment)
        print(serializer)
        return restful.result(data=serializer.data)
    else:
        return restful.params_error(message=commentform.get_errors())

def search(request):
    return render(request, 'search.html')


def payinfo(request):
    return render(request, 'payinfo.html')
