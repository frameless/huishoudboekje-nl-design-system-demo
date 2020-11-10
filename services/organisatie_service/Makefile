coverage:
	pytest --cov=organisatie_service --cov=models tests

html_coverage: coverage
	coverage html -d coverage_html
	open coverage_html/index.html