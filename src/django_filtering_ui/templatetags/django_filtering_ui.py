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
