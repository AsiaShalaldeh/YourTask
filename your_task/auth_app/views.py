from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ValidationError
from django.contrib import messages

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
            # validate_password(value)
            password = request.data.get('password')
            try:
                # Password must contain at least 8 characters, shouldn't be too common or entirely numeric.
                validate_password(password)
            except ValidationError as error:
                messages.error(request, ' '.join(error.messages))
                return redirect('register')

            if serializer.is_valid():
                # Hash the password before saving
                serializer.validated_data['password'] = make_password(password)
                serializer.save()
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
                user = authenticate(email=email, password=password)
                # return Response({'message': f'Invalid email or password {user}'}, status=status.HTTP_200_OK)
                # user = User.objects.get(email=email)
                if user is not None:
                    # User authenticated successfully
                    refresh = RefreshToken.for_user(user)

                    # Set token expiration time to 5 minutes
                    refresh.access_token.set_exp(lifetime=timedelta(minutes=5))

                    return Response({
                        'message': 'Login successful',
                        'refresh': str(refresh),
                    }, status=status.HTTP_200_OK)
                else:
                    # Authentication failed
                    return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
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
            try:
                validate_email(email)
            except ValidationError:
                return Response({'error': 'Invalid email'}, status=400)

            password_reset, created = PasswordReset.objects.get_or_create(email=email)
            # if not created and password_reset.is_valid():
            #     # If a valid code already exists for this email, resend it
            #     send_reset_code_email(password_reset)
            # else:
            #     # If a new code is generated or the old code expired, send a new one
            #     password_reset.code = get_random_string(length=6, allowed_chars='1234567890')
            #     password_reset.save()
            #     send_reset_code_email(password_reset)
            password_reset.code = get_random_string(length=6, allowed_chars='1234567890')
            password_reset.save()
            send_reset_code_email(password_reset)

            return Response({'success': 'Reset code sent', 'email': email})
        else:
            return Response(serializer.errors, status=400)

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
                return Response({'error': 'Email and code are required'}, status=400)

            password_reset = get_object_or_404(PasswordReset, email=email, code=code)

            # add expire date later is.valid()
            if password_reset is not None:
                return Response({'success': 'Code is valid'})
            else:
                return Response({'error': 'Code is invalid'}, status=400)

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
                return Response({'error': 'Password is not complex enough', 'message': error.messages}, status=400)        

            # Reset the user's password
            user = User.objects.get(email=email)
            user.set_password(make_password(new_password))
            user.save()

            return Response({'success': 'Password reset successful'})
        else:
            return Response(serializer.errors, status=400)

    return Response({'error': 'Method not allowed'}, status=405)