MODULES := bank_transactie_service models
export HHB_SECRET ?= test
export TRANSACTIE_DATABASE_URL ?=

COVERAGE_FILE := .coverage
COVERAGE_HTML := htmlcov
COVERAGE_XML := coverage.xml
TESTS = tests
.PHONY: all
all: coverage

.PHONY: requirements
requirements: requirements.txt test_requirements.txt
	pip install $(patsubst %,-r %,$^)

.PHONY: coverage
coverage: $(COVERAGE_FILE) $(COVERAGE_HTML) $(COVERAGE_XML)

$(COVERAGE_FILE): $(TESTS) $(MODULES)
	pytest $(patsubst %,--cov=%,$(MODULES)) $<

$(COVERAGE_HTML): $(COVERAGE_FILE)
	coverage html -d $@

$(COVERAGE_XML): $(COVERAGE_FILE)
	coverage xml -o $@

.PHONY: open_html
open_html: $(COVERAGE_HTML)
	open $</index.html

.PHONY: clean
clean:
	rm -rf $(COVERAGE_FILE) $(COVERAGE_HTML) $(COVERAGE_XML)
