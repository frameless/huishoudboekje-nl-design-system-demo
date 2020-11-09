MODULES=hhb_backend
export HHB_SECRET ?= test
export ORGANISATIE_DATABASE_URL ?=
export FLASK_ENV=development # To disable auth on /api/graphql

.PHONY: all
all: coverage

.PHONY: requirements
requirements: requirements.txt test_requirements.txt
	pip install $(patsubst %,-r %,$^)

.PHONY: coverage
coverage: htmlcov coverage.xml

.coverage: tests $(foreach MODULE,tests $(MODULES),$(shell find $(MODULE) -type f))
	pytest $(patsubst %,--cov=%,$(MODULES)) $<

htmlcov: .coverage
	coverage html -d $@

coverage.xml: .coverage
	coverage xml -o $@

.PHONY: open_html
open_html: htmlcov
	open $</index.html

.PHONY: clean
clean:
	rm -rf .coverage htmlcov coverage.xml
