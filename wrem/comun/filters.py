from django.contrib.admin.filters import (
    AllValuesFieldListFilter, BooleanFieldListFilter, ChoicesFieldListFilter, DateFieldListFilter,
    RelatedFieldListFilter, SimpleListFilter
)


class DropdownFilter(SimpleListFilter):
    """Filter to be used as parent for custom filters that
    want to use dropdowns."""
    template = 'comun/dropdown_filter.html'


class DropdownRelatedFieldFilter(RelatedFieldListFilter):
    """Equal to django's filter RelatedFieldListFilter but with a
    dropdown template."""
    template = 'comun/dropdown_filter.html'


class BooleanFieldListDropdownFilter(BooleanFieldListFilter):
    """Equal to django's filter BooleanFieldListFilter but with a
    dropdown template."""
    template = 'comun/dropdown_filter.html'


class ChoicesFieldListDropdownFilter(ChoicesFieldListFilter):
    """Equal to django's filter ChoicesFieldListFilter but with a
    dropdown template."""
    template = 'comun/dropdown_filter.html'


class DateFieldListDropdownFilter(DateFieldListFilter):
    """Equal to django's filter DateFieldListFilter but with a
    dropdown template."""
    template = 'comun/dropdown_filter.html'


class AllValuesFieldDropdownFilter(AllValuesFieldListFilter):
    """Equal to django's filter DateFieldListFilter but with a dropdown
    template. It's a last resort i. e. if a field is eligible to use
    e. g. the BooleanFieldListFilter, that'd be much more appropriate"""
    template = 'comun/dropdown_filter.html'
