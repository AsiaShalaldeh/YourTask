from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_tasks, name='task-list'),
    path('tasks/', views.create_task, name='create-task'),
    path('tasks/<int:pk>/', views.update_task, name='update-task'),
    path('tasks/<int:pk>/', views.delete_task, name='delete-task'),
    path('tasks/search/', views.task_search, name='task-search'),
]
