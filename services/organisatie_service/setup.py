from setuptools import setup

setup(
    name='organisatie-service',
    version='0.1.0',
    packages=['core_service', 'models', 'organisatie_service'],
    scripts=[],
    url='',
    license='',
    description='Organisatie Service',
    install_requires=[
        "Flask>=1.1.2,<2",
        "SQLAlchemy>=1.3.19,<2",
        "psycopg2-binary>=2.8.6,<3",
        "Flask-SQLAlchemy>=2.4.4,<3",
        "Flask-Migrate>=2.5.3,<3",
        "Flask-Script>=2.0.6,<3",
        "Flask-Inputs>=0.3.0,<1",
        "jsonschema>=3.2.0,<4",
        'gunicorn>=20.0.4,<21',
        'Werkzeug>=1.0.1,<2',
    ],
)
