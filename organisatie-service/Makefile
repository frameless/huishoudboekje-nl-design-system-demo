coverage:
	pytest --cov=core --cov=models tests

html_coverage: coverage
	coverage html -d coverage_html
	open coverage_html/index.html