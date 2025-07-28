from rest_framework import serializers
from .models import Post, Comment
from django.db.models import Count


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'body', 'publish', 'author']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'email', 'body', 'created', 'active']

class PostDetailSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    similar_posts = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'body', 'publish', 'created', 'updated', 'status', 'comments', 'similar_posts']

    def get_comments(self, obj):
        comments = obj.comments.filter(active=True)
        return CommentSerializer(comments, many=True).data

    def get_similar_posts(self, obj):
        post_tags_ids = obj.tags.values_list('id', flat=True)
        similar_posts = Post.published.filter(tags__in=post_tags_ids).exclude(id=obj.id)
        similar_posts = similar_posts.annotate(same_tags=Count('tags')).order_by('-same_tags', '-publish')[:4]
        return [{'title': p.title, 'slug': p.slug, 'id': p.id} for p in similar_posts]

class PostShareSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    to = serializers.EmailField()
    comments = serializers.CharField(required=False, allow_blank=True)


