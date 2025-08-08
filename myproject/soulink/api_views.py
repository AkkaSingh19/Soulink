from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import generics
from .serializer import PostSerializer, PostDetailSerializer, CommentSerializer, PostShareSerializer
from taggit.models import Tag
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from .models import Post
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser



class PostListAPIView(ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.published.all()
        tag_slug = self.kwargs.get('tag_slug')
        if tag_slug:
            tag = Tag.objects.filter(slug=tag_slug).first()
            if tag:
                queryset = queryset.filter(tags__in=[tag])
        return queryset
    

class PostDetailAPIView(RetrieveAPIView):
    serializer_class = PostDetailSerializer

    def get_object(self):
        year = self.kwargs['year']
        month = self.kwargs['month']
        day = self.kwargs['day']
        slug = self.kwargs['slug']

        return get_object_or_404(
            Post,
            slug=slug,
            status='published',
            publish__year=year,
            publish__month=month,
            publish__day=day
        )

class CommentCreateAPIView(generics.CreateAPIView):
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id, status='published')
        serializer.save(post=post)


class PostShareAPIView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, status='published')
        serializer = PostShareSerializer(data=request.data)

        if serializer.is_valid():
            cd = serializer.validated_data
            post_url = request.build_absolute_uri(post.get_absolute_url())
            subject = f"{cd['name']} recommends you read \"{post.title}\""
            message = f"Read \"{post.title}\" at {post_url}\n\n{cd['name']}'s comments: {cd['comments']}"

            send_mail(subject, message, 'your_email@example.com', [cd['to']])
            return Response({'status': 'Email sent successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PostSearchAPIView(APIView):
    def get(self, request, format=None):
        query = request.GET.get('query')
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        search_vector = SearchVector('title', 'body')
        search_query = SearchQuery(query)

        results = Post.published.annotate(
            search=search_vector,
            rank=SearchRank(search_vector, search_query)
        ).filter(search=search_query).order_by('-rank')

        serializer = PostSerializer(results, many=True, context={'request': request})
        return Response(serializer.data)
    
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")  

        
        if not username or not password or not email:
            return Response({"error": "Username, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email) 

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreatePostView(CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class UserPostListView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        status = self.request.query_params.get("status") 
        queryset = Post.objects.filter(author=self.request.user)

        if status in ["published", "draft"]:
            queryset = queryset.filter(status=status)

        return queryset.order_by("-publish")

class UserPostDetailView(RetrieveUpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
    

class UserPostDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk, author=request.user)
        except Post.DoesNotExist:
            return Response({"error": "Post not found or not yours."}, status=status.HTTP_404_NOT_FOUND)

        confirm = request.data.get("confirm")

        if confirm is not True:
            return Response(
                {"message": "Are you sure you want to delete this post? Send {\"confirm\": true} to proceed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        post.delete()
        return Response({"message": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "image": user.profile.image.url if hasattr(user, "profile") and user.profile.image else None,
    })

@api_view(['GET'])
def published_posts_count(request):
    count = Post.objects.filter(status="published").count()
    return Response({"count": count})