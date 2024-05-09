from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ValidationError
from django.contrib import messages
from .models import UserImage
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile

from .serializers import UserSerializer, ResetCodeSerializer, LoginSerializer, VerifyResetCodeSerializer, ResetPasswordSerializer
from .models import PasswordReset
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
import re

@api_view(('POST',))
def register(request):
    if request.method == 'POST':
        try:
            serializer = UserSerializer(data=request.data)

            # Validate email uniqueness
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate password complexity
            password = request.data.get('password')
            try:
                # Password must contain at least 8 characters, shouldn't be too common or entirely numeric.
                validate_password(password)
            except ValidationError as error:
                return Response({'error': 'كلمة السر يجب أن تحتوي على حروف وأرقام ورموز.'}, status=status.HTTP_400_BAD_REQUEST)

            if serializer.is_valid():
                serializer.validated_data['password'] = password
                serializer.save()
                
                user = User.objects.get(email=email)
                image_file = request.FILES.get('avatar')

                # Check if an image file was provided
                if image_file:
                    user_image = UserImage(image=image_file, user=user, caption="Profile Image")
                    user_image.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(('POST',))
def login(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            try:
                # Authenticate user
                entered_user = User.objects.filter(email=email).first()
                user = authenticate(username=entered_user.username, password=password)
                # user = User.objects.get(email=email)
                if user is not None:
                    # User authenticated successfully
                    access_token = AccessToken.for_user(user)
                    refresh_token = RefreshToken.for_user(user)

                     # Get the user's image path
                    user_image_path = None
                    user_image = UserImage.objects.filter(user=user).first()
                    if user_image:
                        user_image_path = user_image.image.url

                    return Response({
                        "access_token" : str(access_token),
                        "refresh_token" : str(refresh_token),
                        'user_image': user_image_path
                    }, status=status.HTTP_200_OK)
                else:
                    # Authentication failed
                    return Response({'message': 'كلمة المرور أو الإيميل غير صحيحة'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                # Log out the user if an error occurs
                logout(request)
                return Response({'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Return a response in case of non-POST requests
    return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(('POST',))
def logout(request):
    if request.method == 'POST':
        try:
            # Extract the refresh token from the request data
            refresh_token = request.data.get('refresh_token')

            if refresh_token:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# Password Reset Code
@api_view(('POST',))
def send_reset_code(request):
    if request.method == 'POST':
        serializer = ResetCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
        if not User.objects.filter(email=email, is_active=True).exists():
            return Response({'error': f'البريد الإلكتروني غير موجود. {email} '}, status=status.HTTP_400_BAD_REQUEST)
        password_reset, created = PasswordReset.objects.get_or_create(email=email)
        password_reset.code = get_random_string(length=6, allowed_chars='1234567890')
        password_reset.save()
        send_reset_code_email(password_reset)

        return Response({'success': 'Reset code sent', 'email': email}, status=status.HTTP_200_OK)

    return Response({'error': 'Method not allowed'}, status=405)

def send_reset_code_email(password_reset):
    # Send the reset code to the user via email
    subject = 'Password Reset Code'
    message = f'Your password reset code is: {password_reset.code}'
    send_mail(subject, message, None, [password_reset.email])


@api_view(('POST',))
def verify_reset_code(request):
    if request.method == 'POST':
        serializer = VerifyResetCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']

            if not email or not code:
                return Response({'error': 'Email and code are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not PasswordReset.objects.filter(email=email, code=code).exists():
                return Response({'error': f'الرمز غير صحيح.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'success': 'الرمز صحيح'}, status=status.HTTP_200_OK) 
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({'error': 'Method not allowed'}, status=405)


@api_view(('POST',))
def reset_password(request):
    if request.method == 'POST':
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            new_password = serializer.validated_data['new_password']

            try:
                # Password must contain at least 8 characters, shouldn't be too common or entirely numeric.
                validate_password(new_password)
            except ValidationError as error:
                return Response({'error': 'كلمة السر يجب أن تحتوي على حروف وأرقام ورموز.'}, status=status.HTTP_400_BAD_REQUEST)

            # Reset the user's password
            user = User.objects.get(email=email)
            user.set_password(make_password(new_password))
            user.save()

            return Response({'success': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=400)

    return Response({'error': 'Method not allowed'}, status=405)