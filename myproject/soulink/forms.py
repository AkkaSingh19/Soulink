from django import forms
from .models import Comment, Subscriber

class EmailPostForm(forms.Form):
    name = forms.CharField(max_length=25)
    email = forms.EmailField()
    to = forms.EmailField()
    comments = forms.CharField(required=False, widget=forms.Textarea)

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['name', 'email', 'body']

class SearchForm(forms.Form):
    query = forms.CharField()


class SubscriberForm(forms.ModelForm):
    class Meta:
        model = Subscriber
        fields = ['name', 'email', 'accepted_notifications']


class UnsubscribeForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()


class LoginForm(forms.Form):
 username = forms.CharField()
 password = forms.CharField(widget=forms.PasswordInput)