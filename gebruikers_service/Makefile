coverage:
	pytest --cov=gebruikers_service --cov=hhb_models tests

html_coverage: coverage
	coverage html -d coverage_html
	open coverage_html/index.html