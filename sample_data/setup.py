from setuptools import setup

setup(
    name='sample_data',
    version='0.1.0',
    packages=['generators'],
    scripts=[],
    url='',
    description='HuishoudBoekje Sample Data Generator',
    install_requires=[
        'marshmallow_dataclass==8.3.0',
        'schwifty==2020.11.0',
        'python_dateutil==2.8.1',
        'PyYAML==5.3.1',
        'Requests==2.25.1',
    ],
)
