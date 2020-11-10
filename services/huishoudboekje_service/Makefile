coverage:
	pytest --cov=huishoudboekje_service --cov=models tests

html_coverage: coverage
	coverage html -d coverage_html
	open coverage_html/index.html