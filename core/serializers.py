from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Content

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
class TeamSerializer(serializers.ModelSerializer):
    members = serializers.SlugRelatedField(
        many = True,
        read_only = True,
        slug_field = 'username'
    )
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members', 'created_at', 'updated_at']
        realy_only_fields = ['created_at', 'updated_at']
        
class ContentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    team_name = serializers.ReadOnlyField(source='team.name')
    
    class Meta:
        model = Content
        fields = [
            'id',
            'title',
            'slug',
            'content_text',
            'content_type',
            'author',
            'team',
            'team_name',
            'is_published',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug']