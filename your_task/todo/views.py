from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Task
from .serializers import TaskSerializer, TaskFormSerializer, TaskTableSerializer
from django.contrib.auth.models import User


@api_view(('GET','POST'))
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])  
def get_add_tasks(request):
    if request.method == 'GET':
        # Retrieve tasks associated with the logged-in user
        tasks = Task.objects.filter(user=request.user)
        # tasks = Task.objects.all()
        serializer = TaskTableSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if request.user.is_authenticated:
            # Create a new task for the logged-in user
            serializer = TaskFormSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    

@api_view(('PATCH','DELETE'))
# @permission_classes([IsAuthenticated])
def update_delete_task(request, task_id):
    if request.method == "PATCH":
        # Update an existing task for the logged-in user
        try:
            task = Task.objects.get(task_id=task_id, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskFormSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete an existing task for the logged-in user
        try:
            task = Task.objects.get(task_id=task_id, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# if request.user.is_authenticated:
# @api_view(['GET'])
# def task_search(request):
#     query = request.query_params.get('query', None)
#     if query:
#         tasks = Task.objects.filter(title__icontains=query)
#     else:
#         tasks = Task.objects.all()
#     serializer = TaskTableSerializer(tasks, many=True)
#     return Response(serializer.data)