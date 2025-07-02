from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import UserViewSet, TeamViewSet, ContentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'content', ContentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls )),
    path('api/routh', include('rest_framework.urls', namespace='rest_framework')),
]
