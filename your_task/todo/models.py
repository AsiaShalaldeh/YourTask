from django.db import models

# Create your models here.

class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.CharField(default="Completed", max_length=20)

    def __str__(self):
        return self.title
