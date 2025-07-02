from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Nome da Equipe')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    members = models.ManyToManyField(User, related_name='teams', verbose_name='Membros')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    
    class Meta:
        verbose_name='Equipe'
        verbose_name_plural='Equipes'
        ordering = ['name']
        
    def __str__(self):
        return self.name
    
class Content(models.Model):
    TYPE_CHOICES = [
        ('ARTICLE', 'Artigo'),
        ('DOCUMENT', 'Documento'),
        ('REPORT', 'Relatório'),
        ('OTHER', 'Outro'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='Título')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='Slug')
    content_text = models.TextField(verbose_name='Conteúdo')
    content_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='ARTICLE', verbose_name='Tipo de Conteúdo')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='authored_content', verbose_name='Autor')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='contents', verbose_name='Equipe')
    is_published = models.BooleanField(default=False, verbose_name='Publicado')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name='Conteúdo'
        verbose_name_plural='Conteúdos'
        unique_together = ('team', 'slug')
        ordering = ['created_at']
        
    def __str__(self):
        return self.title