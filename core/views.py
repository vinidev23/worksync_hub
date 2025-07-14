# worksync_hub/core/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .models import Team, Content
from .serializers import UserSerializer, TeamSerializer, ContentSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            user_teams_ids = user.teams.values_list('id', flat=True)
            return Content.objects.filter(team__in=user_teams_ids).distinct()
        return Content.objects.none()

    def perform_create(self, serializer):
        new_content = serializer.save(author=self.request.user)

        subject = f'Novo Conteúdo Criado: "{new_content.title}"'

        context = {
            'content_title': new_content.title,
            'content_type': new_content.get_content_type_display(),
            'author_username': new_content.author.username,
            'team_name': new_content.team.name,
            'content_url': f"http://localhost:3000/content/{new_content.id}"
        }

        html_message = render_to_string('email/new_content_notification.html', context)
        plain_message = strip_tags(html_message)

        recipient_list = [member.email for member in new_content.team.members.all() if member.email]

        if recipient_list:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                recipient_list,
                html_message=html_message,
                fail_silently=False,
            )

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()