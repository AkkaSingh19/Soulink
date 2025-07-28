from django.shortcuts import render, get_object_or_404, redirect
from .models import Post, Comment, Subscriber
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .forms import EmailPostForm, CommentForm, SubscriberForm, LoginForm, UnsubscribeForm
from django.core.mail import send_mail
from taggit.models import Tag
from django.db.models import Count
from django.contrib.postgres.search import SearchVector
from .forms import EmailPostForm, CommentForm, SearchForm
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.conf import settings

def post_list(request, tag_slug=None):
    object_list = Post.published.all()  
    tag = None
    if tag_slug:
          tag = get_object_or_404(Tag, slug=tag_slug)
          object_list = object_list.filter(tags__in=[tag])
    paginator = Paginator(object_list, 5)  # 5 posts per page
    page = request.GET.get('page')

    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    return render(request, 'blog/post/list.html', {'posts': posts, 'tag': tag})


def post_detail(request, year, month, day, post):
          post = get_object_or_404(
               Post,
               slug=post,
               status='published',
               publish__year=year,
               publish__month=month,
               publish__day=day)
    # List of active comments for this post
          comments = post.comments.filter(active=True)
          new_comment = None
          if request.method == 'POST':
               comment_form = CommentForm(data=request.POST)
               if comment_form.is_valid():
                    new_comment = comment_form.save(commit=False)
                    new_comment.post = post
                    new_comment.save()
          else:
               comment_form = CommentForm()
          post_tags_ids = post.tags.values_list('id', flat=True)
          similar_posts = Post.published.filter(tags__in=post_tags_ids).exclude(id=post.id)
          similar_posts = similar_posts.annotate(same_tags=Count('tags')) .order_by('-same_tags','-publish')[:4]
          return render(request, 'blog/post/detail.html', {'post': post, 'comments': comments, 'new_comment': new_comment, 'comment_form': comment_form, 'similar_posts': similar_posts})

def home(request):
    return render(request, 'test.html')


def post_share(request, post_id):
    post = get_object_or_404(Post, id=post_id, status='published')
    sent = False
    cd = None

    if request.method == 'POST':
        form = EmailPostForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            post_url = request.build_absolute_uri(post.get_absolute_url())
            subject = f"{cd['name']} recommends you read \"{post.title}\""
            message = f"Read \"{post.title}\" at {post_url}\n\n" \
                      f"{cd['name']}'s comments: {cd['comments']}"
            send_mail(subject, message, 'aks.singh1902@gmail.com', [cd['to']])
            sent = True
    else:
        form = EmailPostForm() 

    return render(request, 'blog/post/share.html', {'post': post, 'form': form, 'sent': sent, 'cd': cd})

def post_search(request):
     form = SearchForm()
     query = None
     results = []
     if 'query' in request.GET:
          form = SearchForm(request.GET)
          if form.is_valid():
               query = form.cleaned_data['query']
               search_vector = SearchVector('title', 'body')
               search_query = SearchQuery(query)
               results = Post.published.annotate( #similarity=TrigramSimilarity('title', query), ).filter(similarity__gt=0.1).order_by('-similarity')
               search=search_vector, rank=SearchRank(search_vector, search_query) ).filter(search=search_query).order_by('-rank')
     return render(request,'blog/post/search.html',{'form': form,'query': query, 'results': results})



def subscribe_view(request):
    if request.method == 'POST':
        form = SubscriberForm(request.POST)
        if form.is_valid():
            subscriber = form.save()
            # Send confirmation email
            send_mail(
                subject="Subscription Confirmed",
                message="Thank you for subscribing to my blog SOULINK! You'll receive notifications on every new post, don't forget to comment your views.",
                from_email="your@email.com",
                recipient_list=[subscriber.email],
            )
            messages.success(request, "You have subscribed successfully")
            return redirect('blog:subscribe')
    else:
        form = SubscriberForm()
    return render(request, 'blog/subscribe.html', {'form': form})


def unsubscribe(request):
    if request.method == 'POST':
        form = UnsubscribeForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            try:
                subscriber = Subscriber.objects.get(name=name, email=email)
                subscriber.delete()

                # Send email
                send_mail(
                    subject="Unsubscribed Successfully",
                    message=f"Hi {name},\n\nYou have successfully unsubscribed from our blog notifications.",
                    from_email="your@email.com",
                    recipient_list=[email],
                    fail_silently=False,
                )

                messages.success(request, 'You have been unsubscribed successfully. A confirmation email has been sent.')
            except Subscriber.DoesNotExist:
                messages.error(request, 'No matching subscriber found.')
            return redirect('blog:unsubscribe')
    else:
        form = UnsubscribeForm()
    return render(request, 'blog/unsubscribe.html', {'form': form})


