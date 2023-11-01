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
        "Flask>=2.3.1,<3",
        "SQLAlchemy>=2.0.22,<3",
        "psycopg>=3.1.12,<4",
        "psycopg2-binary>=2.9.6,<3",
        "Flask-SQLAlchemy>=3.1.0",
        "jsonschema>=4.15.0,<5",
        'Werkzeug>=2.3.3,<3',
        'MarkupSafe==2.1.1',
        'future==0.18.3',
        'WTForms==3.0.1'
    ]
)
