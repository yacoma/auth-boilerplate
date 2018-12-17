.PHONY:	install

install: env/bin/python

env/bin/python:
	virtualenv -p python3.5 --clear env

.PHONY:	deploylive

deploylive: env/bin/python
	env/bin/pip install --upgrade-strategy eager -U pip setuptools
	env/bin/pip install --upgrade-strategy eager -Ue '.[production]'
	rm -rf node_modules
	npm install
	npm run build:production
	rm -rf ../client/build
	mkdir -p ../client/build
	cp -a static/* ../client/build/

	# check gunicorn config and create database if not present
	export RUN_ENV=production; env/bin/gunicorn --check-config server.run

.PHONY:	setuplocal

setuplocal: env/bin/python
	env/bin/pip install --upgrade-strategy eager -U pip setuptools
	env/bin/pip install --upgrade-strategy eager -Ue .
	npm install
	npm run build

	# check gunicorn config and create database if not present
	env/bin/gunicorn --check-config server.run

.PHONY:	clean

clean:
	- rm -rf env node_modules
	- rm -f static/auth.js static/auth.js.map static/index.html
	- rm -f server/auth.db
