from django.contrib.auth.forms import forms
from apps.forms import FormMixMin
from apps.news.models import News,Banner
class CategoryForm(forms.Form, FormMixMin):
    pk = forms.IntegerField(error_messages={'require': 'pk必须是整型'})
    name = forms.CharField(max_length=15)


class NewsForm(forms.ModelForm, FormMixMin):
    category = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']

class AddBannersForm(forms.ModelForm,FormMixMin):
    class Meta:
        model = Banner
        fields = ['priority','link_to','image_url']

class EditBannersForm(forms.ModelForm,FormMixMin):
    pk = forms.IntegerField()
    class Meta:
        model = Banner
        fields = ['priority','link_to','image_url']


class EditNewsForm(forms.ModelForm, FormMixMin):
    pk = forms.IntegerField()
    category = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['author','pub_time','category']