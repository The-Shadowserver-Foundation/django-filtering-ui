import django


def pytest_configure(config):
    from django.conf import settings

    settings.configure(
        DEBUG_PROPAGATE_EXCEPTIONS=True,
        DEBUG=True,
        INSTALLED_APPS=[
            "django_filtering_ui",
        ],
        TEMPLATES = [
            {
                "BACKEND": "django.template.backends.django.DjangoTemplates",
                "APP_DIRS": True,
            },
        ],
        STATIC_URL = "/static/"
    )

    django.setup()
