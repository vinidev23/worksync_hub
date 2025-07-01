from django.contrib import admin
from .models import Team, Content

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('members',)
    
@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'team', 'content_type', 'is_published', 'created_at')
    list_filter = ('content_type', 'is_published', 'team', 'created_at')
    search_fields = ('title', 'content_text', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author', 'team',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
