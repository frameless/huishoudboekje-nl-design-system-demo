MODULES=core models
export HHB_SECRET ?= test
export ORGANISATIE_DATABASE_URL ?=

.PHONY: all
all: coverage

.PHONY: prepare
prepare: ../../backend/requirements.txt test_requirements.txt
	pip install $(patsubst %,-r %,$^)

.PHONY: coverage
coverage: htmlcov coverage.xml

.coverage: ../../backend/tests $(MODULES)
	pytest $(patsubst %,--cov=%,$(MODULES)) $<

htmlcov: ../../backend/.coverage
	coverage html -d $@

coverage.xml: ../../backend/.coverage
	coverage xml -o $@

.PHONY: open_html
open_html: htmlcov
	open $</index.html

.PHONY: clean
clean:
	rm -rf .coverage htmlcov coverage.xml
