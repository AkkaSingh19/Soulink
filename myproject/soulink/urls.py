from django.urls import path
from . import views
from .feeds import LatestPostsFeed
from .api_views import PostListAPIView, PostDetailAPIView, CommentCreateAPIView, PostShareAPIView, PostSearchAPIView 
from .api_views import SignupView, LogoutView, CreatePostView, UserPostListView, UserPostDetailView, UserPostDeleteView
from django.contrib.auth import views as auth_views
from django.contrib.sitemaps.views import sitemap
from soulink.sitemaps import PostSitemap
from .views import subscribe_view, unsubscribe
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import generics
from .api_views import user_profile


app_name = 'blog'  

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('tag/', views.post_list, name='post_list_by_tag'),
    path('<int:year>/<int:month>/<int:day>/', views.post_detail, name='post_detail'),
    path('<int:post_id>/share/', views.post_share, name='post_share'),
    path('feed/', LatestPostsFeed(), name='post_feed'),
    path('search/', views.post_search, name='post_search'),
    path('subscribe/', views.subscribe_view, name='subscribe'),
    path('unsubscribe/', views.unsubscribe, name='unsubscribe'),

    


    #api endpoints
    path('api/posts/', PostListAPIView.as_view(), name= 'post_list_api'),
    path('api/posts/tag/', PostListAPIView.as_view(), name= 'post_list_by_tag_api'),
    path('api/posts/<int:year>/<int:month>/<int:day>/', PostDetailAPIView.as_view(), name= 'api_post_detail'),
    path('api/posts/<int:post_id>/comment/', CommentCreateAPIView.as_view(), name='api_add_comment'),
    path('api/posts/<int:post_id>/share/', PostShareAPIView.as_view(), name='post_share_api'),
    path('api/posts/search/', PostSearchAPIView.as_view(), name= 'post_search_api'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # signin
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('posts/create/', CreatePostView.as_view(), name='create_post'),
    path('posts/', UserPostListView.as_view(), name='list_posts'),             # GET user's posts
    path('posts/<int:pk>/', UserPostDetailView.as_view(), name='detail_post'), 
    path('posts/<int:pk>/delete/', UserPostDeleteView.as_view(), name='delete_post'),
    path("user-profile/", user_profile, name="user-profile"),

]

