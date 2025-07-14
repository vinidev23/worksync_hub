from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Content(models.Model):
    CONTENT_CHOICES = [
        ('ARTICLE', 'Article'),
        ('TUTORIAL', 'Tutorial'),
        ('DOCUMENTATION', 'Documentation'),
        ('BLOG_POST', 'Blog Post'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    content_text = models.TextField()
    content_type = models.CharField(max_length=50, choices=CONTENT_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='content')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='content')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title or "")
            if not base_slug:
                base_slug = "content-item"

            unique_slug = base_slug
            num = 1
            while Content.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title