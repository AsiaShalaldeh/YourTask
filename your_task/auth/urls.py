from django.urls import path
from auth import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('', views.get_home, name='home'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    # path('home/<str:user_name>/', views.home, name='home'),
    path('register/', views.register, name='register'),
    # path('login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]