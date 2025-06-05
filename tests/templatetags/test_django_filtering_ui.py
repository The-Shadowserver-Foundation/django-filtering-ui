from urllib.parse import urljoin

import pytest
from django.template import Template, Context
from django.templatetags.static import static
from django.utils.html import escapejs
from django_filtering_ui.conf import (
    DJANGO_FILTERING_UI_DEV_PATH,
    DJANGO_FILTERING_UI_DEV_URL,
)

from django_filtering_ui.templatetags.django_filtering_ui import (
    django_filtering_ui,
    entrypoint,
    vue_provide,
)


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
        value = "testing message with \"quoted\" content"
        rendered = vue_provide(key, value)

        expected_result = (
            "<script>window.vueProvided = window.vueProvided || {}; "
            f'vueProvided["{key}"] = "{escapejs(value)}";</script>'
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


class TestDjangoFilteringUi:
    """
    Tests the ``django_filtering_ui`` templatetag.
    """

    def test_default_use(self):
        entrypoint_name = 'filtering'
        context = {
            'listing_url': '$$$listing$$$',
            'filtering_url': '$$$filtering$$$',
            'filtering_options_schema': '$$$filtering_options_schema$$$',
            'filtering_json_schema': '$$$filtering_json_schema$$$',
        }

        tmplt = Template(
            "{% load django_filtering_ui from django_filtering_ui %}"
            f"{{% with entrypoint='{entrypoint_name}' %}}"
            "{% django_filtering_ui %}"
            "{% endwith %}"
        )
        rendered = tmplt.render(Context(context))
        assert 'src="/static/django-filtering-ui/filtering.js"' in rendered
        assert 'vueProvided["model-listing-url"] = "$$$listing$$$";' in rendered
        assert 'vueProvided["model-filtering-url"] = "$$$filtering$$$";' in rendered
        assert 'vueProvided["filtering-options-schema"] = $$$filtering_options_schema$$$;' in rendered
        assert 'vueProvided["filtering-json-schema"] = $$$filtering_json_schema$$$;' in rendered
        assert 'vueProvided["debug-enabled"] = false;' in rendered

    def test_invalid_use(self):
        entrypoint_name = 'bogus'
        context = {
            'entrypoint': entrypoint_name,
            'listing_url': '$$$listing$$$',
            'filtering_url': '$$$filtering$$$',
            'filtering_options_schema': '$$$filtering_options_schema$$$',
            'filtering_json_schema': '$$$filtering_json_schema$$$',
        }

        with pytest.raises(ValueError) as caught:
            django_filtering_ui(context)

        assert "Invalid 'entrypoint' value" in caught.value.args[0]
