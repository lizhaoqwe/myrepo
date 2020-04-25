from django import forms
from ..forms import FormMixMin

class CommentForm(forms.Form,FormMixMin):
    news_id = forms.IntegerField()
    content = forms.CharField()
