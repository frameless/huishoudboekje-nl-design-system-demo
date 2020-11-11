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
        "Flask>=1.1.2",
        "SQLAlchemy>=1.3.19",
        "psycopg2-binary>=2.8.6",
        "Flask-SQLAlchemy>=2.4.4",
        "Flask-Inputs>=0.3.0",
        "jsonschema>=3.2.0",
    ],
)
