from typing import Any
from urllib.parse import urljoin

from django import template
from django.templatetags.static import static
from django.utils.html import mark_safe
from django.utils.safestring import SafeString

from ..conf import get_dev_url, is_dev_enabled


register = template.Library()


@register.simple_tag()
def entrypoint(name: str) -> SafeString:
    """
    Renders a ``<script>`` tag with the static resource path
    or a url to the development server path.
    The ``name`` parameter matches the input name defined in ``vite.config.js``
    (i.e. either filtering or listing).

    The development server url is used when ``settings.DJANGO_FILTERING_UI_DEV`` is defined.
    When using a development server the resulting script tag will
    contain the ``crossorigin`` attribute to provide CORS support.
    """
    opts = ''
    if is_dev_enabled():
        base_uri = get_dev_url()
        uri = urljoin(base_uri, name)
        opts = ' crossorigin'
    else:
        uri = static(f"django-filtering-ui/{name}")
    return mark_safe(
        f'<script type="module" src="{uri}"{opts}></script>'
    )


@register.simple_tag()
def vue_provide(key: str, value: Any, quote: bool = True) -> SafeString:
    """
    Writes a ``<script>`` tag with javascript that will be picked up by the
    ``vue-plugin-django-utils`` VueJS plugin package on the frontend.
    The provided key and value is essentially like calling VueJS'
    ``provide(key, value)`` function.

    The key value pair can be used in VueJS with ``inject('key-name')``.

    Be sure to set ``quote=False`` if supplying JSON encoded data.
    """
    q = '"' if quote else ''
    return mark_safe(
        "<script>window.vueProvided = window.vueProvided || "
        f'{{}}; vueProvided["{key}"] = {q}{value}{q};</script>'
    )
