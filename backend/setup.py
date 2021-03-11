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
        'Werkzeug>=1.0.1,<2',
        'aiodataloader>=0.2.0',
        'dataclasses-json>=0.5.2',
        'flask-graphql>=2,<3',
        'flask-oidc>=1.4.0',
        'graphene-file-upload>=1.2.2',
        'graphene>=2,<3',
        'graphql-core>=2,<3',
        'gunicorn>=20.0.4',
        'mt-940>=4.23.0',
        'nest-asyncio>=1.4.3',
        'pydash==4.9.2',
        'python-dateutil>=2.8.1',
        'requests>=2.24.0',
        'schwifty>=2021.01.0',
        'sepaxml>=2.3.0',
    ],
)
