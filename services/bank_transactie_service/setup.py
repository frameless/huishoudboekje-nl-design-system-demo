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
        "Flask>=1.1.4,<2",
        "SQLAlchemy>=1.4.40,<2",
        "psycopg2-binary>=2.8.6,<3",
        "Flask-SQLAlchemy>=2.5.1,<3",
        "Flask-Migrate>=2.7.0,<3",
        "Flask-Script>=2.0.6,<3",
        "jsonschema>=4.12.1,<5",
        'gunicorn>=20.0.4,<21',
        'Werkzeug>=1.0.1,<2',
        'MarkupSafe==2.0.1',
		'future==0.16.0',
		'WTForms==2.0.2'
    ],
)
