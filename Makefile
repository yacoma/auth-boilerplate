.PHONY:	install

install: env/bin/python

env/bin/python:
	virtualenv  -p python3.5 --no-site-packages env
	env/bin/pip install --upgrade pip setuptools

.PHONY:	deploylive

deploylive: env/bin/python
	env/bin/pip install -Ue .
	npm install

	# For production you should use this
	# npm run build:production

	# We want here the debugger to work so we do
	npm run build

	# check gunicorn config and create database if not present
	env/bin/gunicorn --check-config server.run

.PHONY:	setuplocal

setuplocal: env/bin/python
	env/bin/pip install -Ue .
	npm install
	npm run build

	# check gunicorn config and create database if not present
	env/bin/gunicorn --check-config server.run

.PHONY:	clean

clean:
	- rm -rf env node_modules
	- rm -f static/auth.js static/auth.js.map static/index.html
	- rm -f server/auth.db
