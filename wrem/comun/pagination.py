from rest_framework.pagination import PageNumberPagination
from rest_framework.settings import api_settings


class CustomPageNumberPagination(PageNumberPagination):
    # The default page size.
    # Defaults to `None`, meaning pagination is disabled.
    page_size = api_settings.PAGE_SIZE

    # Client can control the page using this query parameter.
    page_query_param = 'page'

    # Client can control the page size using this query parameter.
    # Default is 'None'. Set to eg 'page_size' to enable usage.
    page_size_query_param = 'page_size'

    # Set to an integer to limit the maximum page size the client may request.
    # Only relevant if 'page_size_query_param' has also been set.
    max_page_size = None
