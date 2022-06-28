DB_HOST := localhost

.PHONY: createdb
createdb:
	createuser --echo --login --host $(DB_HOST) --username postgres $(DB_NAME) &>/dev/null || :
	createdb --echo --owner $(DB_NAME) --host $(DB_HOST) --username postgres $(DB_NAME)  &>/dev/null || :
	psql --host $(DB_HOST) --username postgres --dbname postgres --command "ALTER USER $(DB_NAME) WITH ENCRYPTED PASSWORD '$(DB_NAME)';"  &>/dev/null || :

.PHONY: preparedb
preparedb: createdb
	APP_SETTINGS=$(CONFIG_MODULE).config.Config \
	python manage.py db upgrade

.PHONY: lint-alembic
lint-alembic:
	export APP_SETTINGS=$(CONFIG_MODULE).config.Config
	#(if (shell python manage.py db heads | awk 'NR>1'), \
#		(error 'Multiple alembic revision heads detected, see https://alembic.sqlalchemy.org/en/latest/branches.html'), \
#	)

lint: lint-alembic
