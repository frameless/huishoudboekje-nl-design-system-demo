from setuptools import setup

setup(
    name='huishoudboekje_service',
    version='0.1.0',
    packages=['core_service', 'models', 'huishoudboekje_service'],
    scripts=[],
    url='',
    license='',
    description='Huishoudboekje Service',
    install_requires=[
        "Flask>=2.2.2,<3",
        "SQLAlchemy>=1.4.40,<2",
        "psycopg2-binary>=2.9.3,<3",
        "Flask-SQLAlchemy>=2.5.1,<3",
        "Flask-Migrate>=3.1.0,<4",
        "Flask-Script>=2.0.6,<3",
        "jsonschema>=4.15.0,<5",
        'gunicorn>=20.1.0,<21',
        'schwifty>=2022.7.1',
        'marshmallow-dataclass>=8.5.8,<9',
        'pyyaml>=6.0,<7',
        'Werkzeug>=2.2.2,<3',
        'itsdangerous>=2.1.2,<3',
        'python-dateutil==2.8.2,<3',
        'MarkupSafe==2.1.1',
        'future==0.18.2',
        'WTForms==3.0.1'
    ]
)
