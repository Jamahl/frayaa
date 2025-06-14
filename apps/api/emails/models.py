from django.db import models
from django.utils import timezone

class Email(models.Model):
    """Model representing an email message from Gmail."""
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='emails'
    )
    gmail_message_id = models.CharField(max_length=255, db_index=True)
    thread_id = models.CharField(max_length=255, db_index=True, blank=True, null=True)
    from_email = models.EmailField()
    to_email = models.TextField()  # Can be multiple recipients
    subject = models.TextField()
    snippet = models.TextField(blank=True)
    received_at = models.DateTimeField(db_index=True)
    is_read = models.BooleanField(default=False)
    labels = models.JSONField(default=list, blank=True)
    raw_headers = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'gmail_message_id')
        ordering = ['-received_at']

    def __str__(self):
        return f"{self.subject} - {self.from_email}"


class EmailSyncStatus(models.Model):
    """Tracks the sync status for a user's email."""
    user = models.OneToOneField(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='email_sync_status',
        primary_key=True
    )
    last_processed_at = models.DateTimeField(null=True, blank=True)
    last_successful_sync = models.DateTimeField(null=True, blank=True)
    sync_in_progress = models.BooleanField(default=False)
    last_error = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Sync status for {self.user.email}"
