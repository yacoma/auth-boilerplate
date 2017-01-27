.PHONY:	install

install: env/bin/python

env/bin/python:
	virtualenv  -p python3.5 --no-site-packages env
	env/bin/pip install --upgrade pip setuptools

.PHONY:	deploylive

deploylive: env/bin/python
	cp -af deploy/settings_live.json settings.json
	env/bin/pip install -Ue .
	npm install

	# For production you should use this
	# npm run build:production

	# We want here the debugger to work so we do
	npm run build

	touch server/run.py  # trigger reload

.PHONY:	setuplocal

setuplocal: env/bin/python
	cp -af deploy/settings_local.json settings.json
	env/bin/pip install -Ue .
	npm install
	npm run build

.PHONY:	clean

clean:
	- rm -rf env node_modules
	- rm static/auth.js static/auth.js.map static/index.html
