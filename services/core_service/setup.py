import os
from setuptools import setup

setup(
    name='core-service',
    version='0.1.0',
    packages=['core_service'],
    scripts=[],
    url='',
    license='',
    description='Core Service for elements shared between other services',
    install_requires=[
        "Flask>=1.1.4,<2",
        "SQLAlchemy>=1.4.40,<2",
        "psycopg2-binary>=2.8.6,<3",
        "Flask-SQLAlchemy>=2.5.1,<3",
        "Flask-Inputs>=0.3.0,<1",
        "jsonschema>=4.12.1,<5",
        'Werkzeug>=1.0.1,<2',
        'MarkupSafe==2.0.1'
    ],
)
