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
    ],
)
