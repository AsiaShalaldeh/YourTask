from django.urls import path
from auth_app import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('', views.get_home, name='home'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    # path('home/<str:user_name>/', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('send-reset-code/', views.send_reset_code, name='send-reset-code'),
    path('verify-reset-code/', views.verify_reset_code, name='verify-reset-code'),
    path('reset-password/', views.reset_password, name='reset-password'),
    # path('login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]