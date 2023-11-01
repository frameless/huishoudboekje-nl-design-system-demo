from setuptools import setup

setup(
    name='transactie-service',
    version='0.1.0',
    packages=['models', 'bank_transactie_service'],
    scripts=[],
    url='',
    license='',
    description='Transactie Service',
    install_requires=[
        "Flask>=2.3.1,<3",
        "SQLAlchemy>=2.0.22,<3",
        "psycopg>=3.1.12,<4",
        "psycopg2-binary>=2.9.6,<3",
        "Flask-SQLAlchemy>=3.1.0",
        "Flask-Migrate>=4.0.5,<5",
        "jsonschema>=4.15.0,<5",
        'gunicorn>=20.1.0,<21',
        'Werkzeug>=2.3.3,<3',
        'MarkupSafe==2.1.1',
                'future==0.18.3',
                'WTForms==3.0.1',
        'statsd==4.0.1'
    ],
)
