from urllib.parse import urljoin
from django.templatetags.static import static
from django_filtering_ui.conf import (
    DJANGO_FILTERING_UI_DEV_PATH,
    DJANGO_FILTERING_UI_DEV_URL,
)

from django_filtering_ui.templatetags.django_filtering_ui import entrypoint, vue_provide


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


class TestVueProvide:
    """
    Tests the ``vue_provide`` templatetag.
    """

    def test_default_use(self):
        key = 'msg'
        value = "testing message"
        rendered = vue_provide(key, value)

        expected_result = (
            "<script>window.vueProvided = window.vueProvided || {}; "
            f'vueProvided["{key}"] = "{value}";</script>'
        )
        assert rendered.strip() == expected_result

    def test_unquoted_use(self, settings):
        key = 'notices'
        value = '{"notices": ["testing message"]}'
        rendered = vue_provide(key, value, quote=False)

        expected_result = (
            "<script>window.vueProvided = window.vueProvided || {}; "
            # Note, the missing quotes around the value.
            f'vueProvided["{key}"] = {value};</script>'
        )
        assert rendered.strip() == expected_result
