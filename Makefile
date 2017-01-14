.PHONY:	install

install: env/bin/python

env/bin/python:
	virtualenv  -p python3.5 --no-site-packages env
	env/bin/pip install --upgrade pip setuptools
	env/bin/pip install -Ue .

.PHONY:	deploylive

deploylive: env/bin/python
	cp -af deploy/live_settings.json settings.json
	npm install
	npm run build:production
	touch server/run.py  # trigger reload

.PHONY:	setuplocal

setuplocal: env/bin/python
	cp -af deploy/local_settings.json settings.json
	npm install
	npm run build

.PHONY:	clean

clean:
	- rm -rf env node_modules
	- rm static/auth.js static/auth.js.map static/index.html
