from django.contrib.auth.forms import forms
from django.core.exceptions import ValidationError
from utils import restful
from apps.forms import FormMixMin
from .models import User

class LoginForm(forms.Form, FormMixMin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(min_length=6,error_messages={'max_length':'密码最多不能超过20个字符','min_length':'密码不能少于6位'})
    remember = forms.BooleanField(required=False)

class RegisterForm(forms.Form, FormMixMin):
    telephone = forms.CharField(max_length=100)
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=20,min_length=6)
    re_password = forms.CharField(max_length=20,min_length=6)
    def clean(self):
        cleaned_data = super(RegisterForm,self).clean()
        telephone = cleaned_data.get('telephone')
        password = cleaned_data.get('password')
        re_password = cleaned_data.get('re_password')

        if password != re_password:
            raise forms.ValidationError('您输入的两次密码不一致')
        exists = User.objects.filter(telephone=telephone).exists()
        print(exists)
        if exists:
            raise forms.ValidationError('您的手机号已经被注册')
        return cleaned_data