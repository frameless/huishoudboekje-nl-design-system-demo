from setuptools import setup

setup(
    name='huishoudboekje-service',
    version='0.1.0',
    packages=['models', 'database', 'core'],
    scripts=[],
    url='',
    license='',
    description='Huishoudboekje Service',
    install_requires=[
        "Flask>=1.1.2",
        "SQLAlchemy>=1.3.19",
        "psycopg2-binary>=2.8.6",
        "Flask-SQLAlchemy>=2.4.4",
        "Flask-Migrate>=2.5.3",
        "Flask-Script>=2.0.6",
        "Flask-Inputs>=0.3.0",
        "jsonschema>=3.2.0",
        'gunicorn>=20.0.4',
    ],
)
