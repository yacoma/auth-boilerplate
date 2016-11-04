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
        'pony',
        'argon2_cffi'
    ],
    extras_require=dict(
        test=[
            'pytest >= 2.9.1',
            'pytest-remove-stale-bytecode',
            'WebTest >= 2.0.14',
        ],
        pep8=[
            'flake8',
            'pep8-naming',
        ],
        coverage=[
            'pytest-cov',
        ],
    ),
    entry_points=dict(
        morepath=[
            'scan = server',
        ],
        console_scripts=[
            'run-app = server.run:run',
        ]
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
