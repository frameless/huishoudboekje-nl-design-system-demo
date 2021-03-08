generate:
	python generator.py

MODULES := generators
PREFIX := sample_data/

include ../python.mk

REGISTRY_PREFIX := registry.gitlab.com/commonground/huishoudboekje/app-new
DOCKER_TAG := dev
.PHONY: docker
docker:
	$(eval IMAGE := $(REGISTRY_PREFIX)/sample-data:$(DOCKER_TAG))
	docker build -t $(IMAGE) .

clean:
	rm -rvf data/*
