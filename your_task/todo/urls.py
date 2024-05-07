from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_add_tasks, name='get_add_tasks'),
    path('tasks/<int:task_id>/', views.update_delete_task, name='update_delete_task'),
    # path('tasks/search/', views.task_search, name='task-search'),
]
