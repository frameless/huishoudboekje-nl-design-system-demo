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
        "Flask>=2.2.2,<3",
        "SQLAlchemy>=1.4.40,<2",
        "psycopg2-binary>=2.9.3,<3",
        "Flask-SQLAlchemy>=2.5.1,<3",
        "jsonschema>=4.15.0,<5",
        'Werkzeug>=2.2.2,<3',
        'MarkupSafe==2.1.1',
        'future==0.18.2',
        'WTForms==3.0.1'
    ]
)
