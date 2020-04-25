from django.contrib.auth import login,logout,authenticate
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .forms import LoginForm,RegisterForm
from utils import restful
from django.shortcuts import render,redirect,reverse
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from .models import User
from .decorators import xfz_login_required

@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request,telephone=telephone,password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="您的账号已被冻结")
        else:
            return restful.params_error(message="您的手机号或密码错误")
    else:
        errors = form.get_errors()
        return restful.server_error(message=errors)

def logout_view(request):
    logout(request)
    return redirect(reverse('index'))

def img_captcha(request):
    text,image = Captcha.gene_code()
    # BytesIO相当于一个管道，用来存储图片的流数据
    out = BytesIO()
    # 调用image的save方法，将照片存储到BytesIO中
    image.save(out, 'png')
    # 将BytesIO的文件指针移动到最开始位置
    out.seek(0)
    response = HttpResponse(content_type='image/png')
    # 从BytesIO的管道中，读取出图片数据，保存到response对象上
    response.write(out.read())
    response['Content-length'] = out.tell()
    return response

def register(request):
    registerform = RegisterForm(request.POST)
    if registerform.is_valid():
        telephone = registerform.cleaned_data.get('telephone')
        username = registerform.cleaned_data.get('username')
        password = registerform.cleaned_data.get('password')
        user = User.objects.create_user(telephone=telephone,username=username,password=password)
        login(request, user)

        return restful.ok()
    else:
        return restful.params_error(message=registerform.get_errors())

