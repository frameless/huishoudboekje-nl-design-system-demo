from setuptools import setup

setup(
    name='backend',
    version='0.1.0',
    packages=['hhb_backend'],
    scripts=[],
    url='',
    description='HuishoudBoekje GraphQL backend',
    install_requires=[
        'Flask>=1.1.2',
        'graphql-core>=2,<3',
        'flask-graphql>=2,<3',
        'flask-oidc>=1.4.0',
        'gunicorn>=20.0.4',
        'graphene>=2,<3',
        'requests>=2.24.0',
        'aiodataloader>=0.2.0',
        'graphene-file-upload>=1.2.2',
        'mt-940>=4.23.0',
        'nest-asyncio>=1.4.3',
        'python-dateutil>=2.8.1',
        'sepaxml>=2.3.0',
        'dataclasses-json>=0.5.2',
        'schwifty>=2021.01.0',
        'Werkzeug>=1.0.1,<2',
    ],
)
