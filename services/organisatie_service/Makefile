MODULES=core models
export HHB_SECRET ?= test
export ORGANISATIE_DATABASE_URL ?=

.PHONY: all
all: coverage

<<<<<<< HEAD:services/organisatie_service/Makefile
.PHONY: prepare
prepare: ../../backend/requirements.txt test_requirements.txt
=======
.PHONY: requirements
requirements: requirements.txt test_requirements.txt
>>>>>>> adjust makefiles:organisatie-service/Makefile
	pip install $(patsubst %,-r %,$^)

.PHONY: coverage
coverage: htmlcov coverage.xml

<<<<<<< HEAD:services/organisatie_service/Makefile
.coverage: ../../backend/tests $(MODULES)
=======
.coverage: tests $(foreach MODULE,tests $(MODULES),$(shell find $(MODULE) -type f))
>>>>>>> adjust makefiles:organisatie-service/Makefile
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
