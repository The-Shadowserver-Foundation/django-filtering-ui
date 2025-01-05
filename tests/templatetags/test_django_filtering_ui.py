from urllib.parse import urljoin
from django.templatetags.static import static
from django_filtering_ui.conf import (
    DJANGO_FILTERING_UI_DEV_PATH,
    DJANGO_FILTERING_UI_DEV_URL,
)

from django_filtering_ui.templatetags.django_filtering_ui import entrypoint


class TestEntrypoint:
    """
    Tests the ``entrypoint`` templatetag.
    """

    def test_default_use(self):
        name = 'filtering.js'
        rendered = entrypoint(name)

        url = static(f'django-filtering-ui/{name}')
        expected_result = f'<script type="module" src="{url}"></script>'
        assert rendered.strip() == expected_result

    def test_dev_use(self, settings):
        settings.DJANGO_FILTERING_UI_DEV_ENABLED = True
        name = 'filtering.js'
        rendered = entrypoint(name)

        url = urljoin(urljoin(DJANGO_FILTERING_UI_DEV_URL, DJANGO_FILTERING_UI_DEV_PATH), name)
        expected_result = f'<script type="module" src="{url}" crossorigin></script>'
        assert rendered.strip() == expected_result
