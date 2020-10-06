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
        'graphql-core<3,>=2.1',
        'Flask-GraphQL==2.0.1',
        'flask-oidc>=1.4.0',
        'gunicorn>=20.0.4',
        'graphene==2.1.8',
    ],
)
