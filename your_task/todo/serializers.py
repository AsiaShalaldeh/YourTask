from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('task_id', 'title', 'description', 'completed')

class TaskFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description')

class TaskTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'status')