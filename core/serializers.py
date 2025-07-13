from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Content

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members']

class ContentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    author_username = serializers.CharField(source='author.username', read_only=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Content
        fields = ['id', 'title', 'slug', 'content_text', 'content_type',
                  'author', 'author_username', 'team', 'team_name',
                  'created_at', 'updated_at', 'is_published']
        read_only_fields = ['slug', 'created_at', 'updated_at', 'is_published']