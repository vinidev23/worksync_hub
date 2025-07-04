from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import Team, Content
from .serializers import UserSerializer, TeamSerializer, ContentSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        team = serializer.save()
        team.members.add(self.request.user)

    @action(detail=True, methods=['post', 'delete'], url_path='members')
    def manage_members(self, request, pk=None):
        team = get_object_or_404(Team, pk=pk)
        if request.method == 'POST':
            member_id = request.data.get('user_id')
            try:
                user = User.objects.get(id=member_id)
                team.members.add(user)
                return Response({'status': 'member added'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        elif request.method == 'DELETE':
            member_id = request.data.get('user_id')
            try:
                user = User.objects.get(id=member_id)
                team.members.remove(user)
                return Response({'status': 'member removed'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'status': 'invalid method'}, status=status.HTTP_400_BAD_REQUEST)

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise permissions.exceptions.NotAuthenticated("Autenticação necessária para criar conteúdo.")

        title = serializer.validated_data['title']
        team = serializer.validated_data['team']
        base_slug = slugify(title)
        slug = base_slug
        counter = 1
        while Content.objects.filter(team=team, slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        serializer.save(author=self.request.user, slug=slug)

    def get_queryset(self):
        user = self.request.user
        print(f"DEBUG: Usuário da requisição para Content: {user.username} (Autenticado: {user.is_authenticated})")

        if user.is_authenticated:
            queryset = Content.objects.filter(team__members=user, is_published=True).distinct()
            print(f"DEBUG: Conteúdos encontrados para {user.username}: {queryset.count()} itens.")
            for item in queryset:
                print(f"  - ID: {item.id}, Título: {item.title}, Equipe: {item.team.name}, Publicado: {item.is_published}")
            return queryset
        
        print("DEBUG: Usuário não autenticado para Content. Retornando nenhum conteúdo.")
        return Content.objects.none()