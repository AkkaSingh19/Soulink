from rest_framework import serializers
from .models import Post, Comment
from django.db.models import Count
from taggit.serializers import (TagListSerializerField, TaggitSerializer)

class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    author = serializers.CharField(source='author.username', read_only=True)
    publish = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'publish', 'author', 'tags', 'status', 'image']
        read_only_fields = ['id', 'publish', 'author']

    def get_tags(self, obj):
        request = self.context.get('request')
        return [
            {
                "name": tag.name,
                "url": request.build_absolute_uri(f"/blog/api/posts/?tag={tag.name}")
            }
            for tag in obj.tags.all()
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'email', 'body', 'created', 'active']

class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    image = serializers.ImageField(use_url=True, required=False)
    comments = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "body",
            "author",
            "publish",
            "created",
            "updated",
            "status",
            "image",
            "tags",       
            "comments",
        ]

    def get_comments(self, obj):
        comments = obj.comments.filter(active=True)
        return CommentSerializer(comments, many=True).data

    def get_tags(self, obj):
        request = self.context.get("request")
        return [
            {
                "name": tag.name,
                "url": request.build_absolute_uri(f"/blog/api/posts/?tag={tag.name}")
            }
            for tag in obj.tags.all()
        ]


class PostShareSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    to = serializers.EmailField()
    comments = serializers.CharField(required=False, allow_blank=True)


