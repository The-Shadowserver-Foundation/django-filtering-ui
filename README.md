# Django Filtering UI

A Django app for providing a user interface (UI) to the
[`django-filtering`](https://github.com/The-Shadowserver-Foundation/django-filtering)
package.

The original usecase for the project's UI required the following:

- Does not disrupt existing backend rendered model listings
- provides the ability to filter on a field more than once
- provides the ability to toggle the filtering operation
  (i.e. `AND`, `OR` and `NOT` filters operators)
- provides the grouping of filters by operator (TODO)
- serializes UI filter data to JSON
- pre-validates UI filter data before sending to backend (TODO)

The UI is implemented in [VueJS](vuejs.org) as a progressive web app (PWA).
VueJS was used because of it's small footprint, ease of use, and progressive usage.

The UI implementation here in `django-filtering-ui` is separate from `django-filtering`
because there are multiple paths to implementing a frontend behavior.
I've choosen to create a PWA in VueJS,
but there is nothing stopping someone from developing a solution in htmx, React, JQuery, etc.

## Installation

Install via pip or the preferred package manager:

    pip install django-filtering-ui

Add this package to the installed apps list in your settings.
```py
INSTALLED_APPS=[
    #...
    'django_filtering_ui',
]
```

See [Usage](#usage) for how to integrate into your frontend.

## Usage

TODO

## State of development

This package is very much a work-in-progress. All APIs are completely unstable.

### Testing & development

Note, I'm testing within a docker container, because I never run anything locally.
There are two containers, one for each language; Python for the backend and Node for the frontend.
For the moment the containers is simply run with:

    docker run -d --rm --name django-filtering-ui--frontend --workdir /code -v $PWD:/code -p 5173:5173 -p 9223:9223 node:latest sleep infinity
    docker run -d --rm --name django-filtering-ui--backend --workdir /code -v $PWD:/code python:3.12 sleep infinity

#### Testing the frontend

Execute testing commands:

    docker exec django-filtering-ui--frontend npm install
    docker exec django-filtering-ui--frontend npm run test

#### Testing the backend

Execute testing commands:

    docker exec django-filtering-ui--backend pip install -e ".[tests]"
    docker exec django-filtering-ui--backend pytest

#### Using the debugger when testing the frontend

To use the chrome debugger use the following:

    npm exec -- vitest --inspect-brk 0.0.0.0:9223 --no-file-parallelism -t "$TEST_NAME" $TEST_FILE

Then open `chrome://inspect` and `0.0.0.0:9223` as a network target.

## Building for release

<!-- TODO: Investigate hatchling build hooks to build js src during py pkg build. -->

At this time the package is built as follows:

    # Builds the js source and outputs it into src/django_filtering_ui/static
    docker exec django-filtering-ui--frontend npm run build
    # Build the python package files
    docker exec django-filtering-ui--backend pip install hatchling
    docker exec django-filtering-ui--backend hatchling build

## License

GPL v3 (see `LICENSE` file)


## Copyright

© 2025 The Shadowserver Foundation
