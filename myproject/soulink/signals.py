from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Post, Subscriber

@receiver(post_save, sender=Post)
def send_new_post_email(sender, instance, created, **kwargs):
    if created and instance.status == 'published':
        subscribers = Subscriber.objects.all()
        subject = f"New Blog Post: {instance.title}"
        message = f"{instance.title}\n\nRead it here: http://127.0.0.1:8000{instance.get_absolute_url()}"
        recipient_list = [subscriber.email for subscriber in subscribers]

        print("Signal fired! Subscribers:", recipient_list)

        if recipient_list:
            send_mail(
                subject,
                message,
                'your_email@gmail.com',  
                recipient_list,
                fail_silently=False,
            )