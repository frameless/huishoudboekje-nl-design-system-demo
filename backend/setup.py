from setuptools import setup

setup(
    name='backend',
    version='0.1.0',
    packages=['hhb_backend', 'camtParser'],
    scripts=[],
    url='',
    description='HuishoudBoekje GraphQL backend',
    install_requires=[
        'Flask>=1.1.2,<2',
        'Werkzeug>=1.0.1,<2',
        'aiodataloader>=0.2.0,<1',
        'dataclasses-json>=0.5.2,<1',
        'flask-graphql>=2,<3',
        'flask-oidc>=1.4.0,<2',
        'flask-rbac==0.5.0',
        'graphene-file-upload>=1.2.2,<2',
        'graphene>=2,<3',
        'graphql-core>=2,<3',
        'gunicorn>=20.0.4,<21',
        'isodate==0.6.0',
        'mt-940>=4.23.0,<5',
        'nest-asyncio>=1.4.3,<2',
        'pydash==4.9.2',
        'pyjwt==2.0.1',
        'python-dateutil>=2.8.1,<3',
        'requests>=2.24.0,<3',
        'schwifty>=2021.01.0',
        'sepaxml>=2.3.0,<3',
        'Jinja2>=2.11.3,<3',
        'itsdangerous>=1.1.0,<2'
    ],
)
