from django.http import HttpResponse
from django.shortcuts import render,redirect,reverse
from django.contrib.admin.views.decorators import staff_member_required
from django.views import View
from django.views.decorators.http import require_POST,require_GET
from apps.news.models import NewsCategory
from utils import restful
from .forms import CategoryForm,EditNewsForm
from datetime import datetime
from django.conf import settings
import os
from .forms import NewsForm,AddBannersForm,EditBannersForm
from apps.news.models import News,Banner
from apps.news.serializers import BannerSerializer,NewsSerializer
from datetime import datetime
from django.utils.timezone import make_aware
from django.core.paginator import Paginator
from urllib import parse
@staff_member_required(login_url='index')
def cms_index(request):
    now_time = datetime.now()
    context = {
        'now_time': now_time,
    }
    return render(request, 'cms/cms_index.html', context=context)

@require_GET
def write_news(request):
    categories = NewsCategory.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'cms/write_news.html',context=context)


@require_GET
def gategory(request):
    categories = NewsCategory.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'cms/cms_category.html', context=context)


@require_POST
def publish_news(request):
    form = NewsForm(request.POST)
    if form.is_valid():
        title = form.cleaned_data.get('title')
        desc = form.cleaned_data.get('desc')
        thumbnail = form.cleaned_data.get('thumbnail')
        content = form.cleaned_data.get('content')
        category_id = form.cleaned_data.get('category')
        category = NewsCategory.objects.get(pk=category_id)
        News.objects.create(title=title,desc=desc,thumbnail=thumbnail,content=content,category=category,author=request.user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())

@require_POST
def add_news_category(request):
    name = request.POST.get('name')
    exists = NewsCategory.objects.filter(name=name).exists()
    if not exists:
        NewsCategory.objects.create(name=name)
        return restful.ok()
    else:
        return restful.params_error(message='该分类已经存在')

@require_POST
def delete_news_category(request):
    deleteform = CategoryForm(request.POST)
    if deleteform.is_valid():
        pk = deleteform.cleaned_data.get('pk')
        name = deleteform.cleaned_data.get('name')
        print(pk, name)
        if pk and name:
            NewsCategory.objects.get(pk=pk).delete()
            return restful.ok()
        else:
            return restful.params_error(message='删除失败')
    else:
        return restful.unauth(message='删除出错')

@require_POST
def edit_news_category(request):
    editform = CategoryForm(request.POST)
    if editform.is_valid():
        pk = editform.cleaned_data.get('pk')
        name = editform.cleaned_data.get('name')
        if pk and name:
            NewsCategory.objects.filter(pk=pk).update(name=name)
            return restful.ok()
        else:
            return restful.params_error(message='修改失败')
    else:
        return restful.unauth(message='您输入的分类不符合规范')

@require_POST
def upload(request):
    file = request.FILES.get('file')
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT,name), 'wb') as f:
        for chunk in file.chunks():
            f.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL+name)
    return restful.result(data={'url': url})

@require_POST
def add_banner(request):
    form = AddBannersForm(request.POST)
    if form.is_valid():
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        priority = form.cleaned_data.get('priority')
        banner = Banner.objects.create(image_url=image_url,link_to=link_to,priority=priority)
        return restful.result(data={'banner_id': banner.pk})
    else:
        return restful.params_error(form.get_errors())

def banners(request):
    return render(request, 'cms/cms_banners.html')

@require_GET
def banner_list(request):
    banners = Banner.objects.all()
    serializer = BannerSerializer(banners,many=True)
    return restful.result(data=serializer.data)


@require_POST
def banner_delete(request):
    banner_id = request.POST.get('banner_id')
    Banner.objects.get(pk=banner_id).delete()
    return restful.ok()

@require_POST
def banner_edit(request):
    form = EditBannersForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        priority = form.cleaned_data.get('priority')
        Banner.objects.filter(pk=pk).update(image_url=image_url,link_to=link_to,priority=priority)
        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message=form.get_errors())

class NewsListView(View):
    def get(self,request):
        page = int(request.GET.get('p', 1))
        start = request.GET.get('start')
        end = request.GET.get('end')
        title = request.GET.get('title')
        category = int(request.GET.get('category',0) or 0)
        news = News.objects.all()
        if start or end:
            if start:
                starttime = datetime.strptime(start, '%Y/%m/%d')
            else:
                starttime = datetime(year=2020, month=4, day=14)
            if end:
                endtime = datetime.strptime(end, '%Y/%m/%d')
            else:
                endtime = datetime.today()
            news = news.filter(pub_time__range=(make_aware(starttime), make_aware(endtime)))
        if title:
            news = news.filter(title__icontains=title)
        if category:
            news = News.objects.filter(category_id=category)
        paginator = Paginator(news, 2)
        page_obj = paginator.page(page)
        context_obj = self.get_pagination_data(paginator, page_obj, 2)
        categories = NewsCategory.objects.all()
        context = {
            'start': start,
            'end': end,
            'title': title,
            'category': category,
            'news': page_obj.object_list,
            'categories': categories,
            'page_obj': page_obj,
            'paginator': paginator,
            'url_query': '&'+parse.urlencode({
                'start': start or '',
                'end': end or '',
                'title': title or '',
                'category': category or ''
            })
        }
        context.update(context_obj)
        return render(request, 'cms/news_list.html',context=context)
    def get_pagination_data(self,paginator,page_obj,around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages
        left_has_more = False
        right_has_more = False

        if current_page <= around_count +2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page-around_count,current_page)
        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page+1,num_pages+1)
        else:
            right_has_more = True
            right_pages = range(current_page+1,current_page+around_count+1)
        return {
            'current_page':current_page,
            'left_pages': left_pages,
            'right_pages': right_pages,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages
        }

@require_POST
def news_delete(request):
    news_id = request.POST.get('news_id')
    News.objects.get(pk=news_id).delete()
    return restful.ok()



class NewsEditView(View):
    def get(self,request,news_id):
        print(news_id)
        news = News.objects.get(pk=news_id)
        context = {
            'news': news,
            'category': NewsCategory.objects.all()
        }
        return render(request,'cms/write_news.html',context=context)
    def post(self,request,news_id):
        print(news_id)
        form = EditNewsForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data.get('pk')
            title = form.cleaned_data.get('title')
            desc = form.cleaned_data.get('desc')
            content = form.cleaned_data.get('content')
            thumbnail = form.cleaned_data.get('thumbnail')
            category_id = form.cleaned_data.get('category')
            if category_id:
                category = NewsCategory.objects.get(pk=category_id)
                News.objects.filter(pk=pk).update(title=title,
                                                         desc=desc,
                                                         content=content,
                                                         thumbnail=thumbnail,
                                                         category=category)
                return restful.ok()
            else:
                return restful.params_error(message=form.get_errors())