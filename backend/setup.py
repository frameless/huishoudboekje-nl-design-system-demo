from setuptools import setup

setup(
    name='backend',
    version='0.1.0',
    packages=['hhb_backend'],
    scripts=[],
    url='',
    description='HuishoudBoekje GraphQL backend',
    install_requires=[
        'Flask>=2.2.2,<3',
        'Werkzeug>=2.2.2,<3',
        'aiodataloader>=0.2.1,<1',
        'dataclasses-json>=0.5.7,<1',
        # Should be 3.0.0b5, if it ever stops working (06-12-2022)
        'graphql-server',
        'graphene>=3.1.1,<4',
        'graphql-core>=3.2.3,<4',
        'gunicorn>=20.1.0,<21',
        'isodate==0.6.1',
        'mt-940>=4.26.0,<5',
        'nest-asyncio>=1.5.5,<2',
        'pydash==5.1.0',
        'pyjwt==2.4.0',
        'pyjwt[crypto]'
        'python-dateutil>=2.8.2,<3',
        'requests==2.29.0',
        'schwifty>=2022.7.1',
        'sepaxml>=2.5.0,<3',
        'Jinja2==3.1.2',
        'itsdangerous>=2.1.2,<3',
        'lxml>=4.9.1,<5',
        'pandas==1.4.4',
        'XlsxWriter==3.0.3',
        'Deprecated==1.2.13',
        'MarkupSafe==2.1.1'
    ],
)
