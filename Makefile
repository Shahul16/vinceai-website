.PHONY: serve test check clean

serve:   ## Serve the site locally on :8000
	@python3 -m http.server 8000

test:    ## Run the build verification suite
	@node tests/run.mjs

check: test ## Alias for test

clean:   ## Remove OS cruft
	@find . -name '.DS_Store' -delete
