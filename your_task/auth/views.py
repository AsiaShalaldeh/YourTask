from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ValidationError
from django.contrib import messages

from .serializers import UserSerializer
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
            # if len(password) < 8 or not re.search(r'\d', password) or not re.search(r'[!@#$%^&*(),.?":{}|<>]',
            #                                                                         password):
            #     return JsonResponse(
            #         {"error": "Password must be at least 8 characters long and contain numbers and symbols"},
            #         status=status.HTTP_400_BAD_REQUEST)

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
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            # Authenticate user
            user = authenticate(email=email, password=password)
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
