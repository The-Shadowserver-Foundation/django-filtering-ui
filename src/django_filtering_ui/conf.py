from urllib.parse import urljoin
from django.conf import settings


DJANGO_FILTERING_UI_DEV_ENABLED = False
DJANGO_FILTERING_UI_DEV_URL = "http://localhost:5173"
DJANGO_FILTERING_UI_DEV_PATH = "/js-src/"


def is_dev_enabled() -> bool:
    return getattr(settings, "DJANGO_FILTERING_UI_DEV_ENABLED", DJANGO_FILTERING_UI_DEV_ENABLED)

def get_dev_url() -> str:
    url = getattr(settings, "DJANGO_FILTERING_UI_DEV_URL", DJANGO_FILTERING_UI_DEV_URL)
    path = getattr(settings, "DJANGO_FILTERING_UI_DEV_PATH", DJANGO_FILTERING_UI_DEV_PATH)
    return urljoin(url, path)
