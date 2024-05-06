# models.py

from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone

class PasswordReset(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def create_reset_code(cls, email):
        code = get_random_string(length=6, allowed_chars='1234567890')
        return cls.objects.create(email=email, code=code)

    def is_valid(self):
        # Check if the code is still valid (within a certain time limit, 10 minute)
        expiration_time = self.created_at + timezone.timedelta(minutes=10)
        return timezone.now() <= expiration_time
