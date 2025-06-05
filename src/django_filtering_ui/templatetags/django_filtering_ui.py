from typing import Any
from urllib.parse import urljoin

from django import template
from django.conf import settings
from django.templatetags.static import static
from django.utils.html import escapejs, mark_safe
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
    if quote:
        value = escapejs(value)
        q = '"'
    else:
        q = ''
    return mark_safe(
        "<script>window.vueProvided = window.vueProvided || "
        f'{{}}; vueProvided["{key}"] = {q}{value}{q};</script>'
    )

@register.inclusion_tag("django_filtering_ui/inclusion.html", takes_context=True)
def django_filtering_ui(context):
    """
    This template tag encapsulates the entrypoint and vue provides
    templating into a single call.

    Renders all the tags needed for the given ``entrypoint``
    This will include the ``<script>`` tag for the entrypoint
    and any supporting vue provides.

    Needed context is:
        - 'entrypoint' - either 'listing' or 'filtering'
        - 'listing_url' - a url to the listing page
        - 'filtering_options_schema' - the options schema
        - 'filtering_json_schema' - the jsonschema

    """
    ep = context.get('entrypoint')
    if ep not in ('filtering', 'listing'):
        raise ValueError(f"Invalid 'entrypoint' value:  {ep}")

    entrypoint_name = f"{ep}.js"
    local_context = {
        'entrypoint': entrypoint_name,
        'filtering_url': context['filtering_url'],
        'listing_url': context['listing_url'],
        'filtering_options_schema': context['filtering_options_schema'],
        'filtering_json_schema': context['filtering_json_schema'],
        'DEBUG': "true" if settings.DEBUG else "false",  # js true/false value
    }
    return local_context
