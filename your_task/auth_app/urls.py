from django.urls import path
from auth_app import views
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings  
from django.conf.urls.static import static 

urlpatterns = [
    # path('', views.get_home, name='home'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    # path('home/<str:user_name>/', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('send-reset-code/', views.send_reset_code, name='send-reset-code'),
    path('verify-reset-code/', views.verify_reset_code, name='verify-reset-code'),
    path('reset-password/', views.reset_password, name='reset-password'),
    path('token/', 
          jwt_views.TokenObtainPairView.as_view(), 
          name ='token_obtain_pair'),
     path('token/refresh/', 
          jwt_views.TokenRefreshView.as_view(), 
          name ='token_refresh')
]
# if settings.DEBUG:
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)