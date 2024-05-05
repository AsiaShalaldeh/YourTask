from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer, TaskFormSerializer, TaskTableSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    # Retrieve tasks associated with the logged-in user
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskTableSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    # Create a new task for the logged-in user
    serializer = TaskFormSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    # Update an existing task for the logged-in user
    try:
        task = Task.objects.get(pk=task_id, user=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskFormSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    # Delete an existing task for the logged-in user
    try:
        task = Task.objects.get(pk=task_id, user=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    task.delete()
    return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def task_search(request):
    query = request.query_params.get('status', None)
    if query:
        tasks = Task.objects.filter(title__icontains=query)
    else:
        tasks = Task.objects.all()
    serializer = TaskTableSerializer(tasks, many=True)
    return Response(serializer.data)