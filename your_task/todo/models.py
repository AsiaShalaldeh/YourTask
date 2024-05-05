from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.title
