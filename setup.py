# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

name = 'auth-boilerplate'
description = (
    'Authentication boilerplate based on Morepath and Cerebral'
)
version = '0.0.1'


setup(
    name=name,
    version=version,
    description=description,
    author='Henri Hulski',
    author_email='henri.hulski@gazeta.pl',
    license='MIT',
    url="https://github.com/henri-hulski/auth-boilerplate",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    platforms='any',
    install_requires=[
        'more.jwtauth',
        'more.cerberus',
        'more.pony',
        'more.emit',
        'argon2_cffi',
        'gunicorn',
        'itsdangerous',
        'yagmail',
        'keyrings.alt',
        'email_validator',
        'pyyaml',
    ],
    extras_require=dict(
        test=[
            'pytest >= 2.9.1',
            'pytest-remove-stale-bytecode',
            'pytest-localserver',
            'pytest-env',
            'WebTest >= 2.0.14',
        ],
        pep8=[
            'flake8',
            'pep8-naming',
        ],
        coverage=[
            'pytest-cov',
        ],
        docs=[
            'mkdocs',
        ],
        production=[
            'psycopg2',
        ]
    ),
    entry_points=dict(
        morepath=[
            'scan = server',
        ],
    ),
    classifiers=[
        'Intended Audience :: Developers',
        'Environment :: Web Environment',
        'Topic :: Internet :: WWW/HTTP :: WSGI',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ]
)
