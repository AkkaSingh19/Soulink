from django.apps import AppConfig


class SoulinkConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'soulink'
    def ready(self):
        import soulink.signals