from setuptools import setup

setup(
    name="log-service",
    version="0.1.0",
    packages=["models", "log_service", "core_service"],
    scripts=[],
    url="",
    license="",
    description="Log Service",
    install_requires=[
        "Flask-Migrate>=2.5.3,<3",
        "Flask-SQLAlchemy>=2.4.4,<3",
        "Flask-Script>=2.0.6,<3",
        "Flask>=1.1.2,<2",
        "SQLAlchemy>=1.3.19,<2",
        "Werkzeug>=1.0.1,<2",
        "gunicorn>=20.0.4,<21",
        "jsonschema>=3.2.0,<4",
        "psycopg2-binary>=2.8.6,<3",
        'MarkupSafe==2.0.1',
        'future==0.16.0',
        'WTForms==2.0.2'
    ],
)
