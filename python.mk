JUNIT_REPORT := report.xml
COVERAGE_FILE := .coverage
COVERAGE_HTML := htmlcov
COVERAGE_XML := coverage.xml
TESTS := tests

export JWT_SECRET ?= makeSecret
ifdef DB_URL_NAME
export $(DB_URL_NAME) ?= postgresql://$(DB_NAME):$(DB_NAME)@localhost/$(DB_NAME)
endif

.PHONY: all
all: coverage

.PHONY: requirements
requirements: requirements.txt test_requirements.txt
	pip install $(patsubst %,-r %,$^)

.PHONY: coverage
coverage: $(COVERAGE_FILE) $(COVERAGE_HTML) $(COVERAGE_XML)

$(JUNIT_REPORT) $(COVERAGE_FILE): $(TESTS) $(MODULES)
	pytest --junitxml=$(JUNIT_REPORT) $(patsubst %,--cov=%,$(MODULES)) $<

$(COVERAGE_HTML): $(COVERAGE_FILE)
	coverage html -d $@

$(COVERAGE_XML): $(COVERAGE_FILE)
	coverage xml -o $@


.PHONY: open_html
open_html: $(COVERAGE_HTML)
	open $</index.html

.PHONY: clean
clean:
	rm -rf $(JUNIT_REPORT) $(COVERAGE_FILE) $(COVERAGE_HTML) $(COVERAGE_XML)

.PHONY: lint
lint:
