from setuptools import setup

setup(
    name='rapportage-service',
    version='0.1.0',
    packages=['rapportage_service'],
    scripts=[],
    url='',
    license='',
    description='Rapportage Service',
    install_requires=[
        "Flask>=2.3.1,<3",
        "psycopg>=3.1.12,<4",
        "psycopg2-binary>=2.9.6,<3",
        "Flask-Migrate>=3.1.0,<4",
        "jsonschema>=4.15.0,<5",
        'gunicorn>=20.1.0,<21',
        'Werkzeug>=2.3.3,<3',
        'requests>=2.31.0,<3',
        'flask-injector>=0.14.0,<1',
        'MarkupSafe==2.1.1',
                'future==0.18.3',
                'WTForms==3.0.1',
        'statsd==4.0.1'
    ],
)
