# Generated by Django 4.2.11 on 2024-05-05 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=120)),
                ('description', models.TextField()),
                ('completed', models.CharField(default='Completed', max_length=20)),
            ],
        ),
    ]
