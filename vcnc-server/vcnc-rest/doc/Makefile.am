#
#	'cnc_server/doc' makefile
#
#	Copyright (C) 2015	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#
GENERATE_MD=$(top_srcdir)/vcnc-rest/node_modules/markdown-styles/bin/generate-md
MARKDOWN_SRCS = 		\
	index.md

MARKDOWN_HTML =			\
	index.html

$(MARKDOWN_HTML) : markdown-products-proxy
markdown-products-proxy : $(MARKDOWN_SRCS)
	(source $(top_srcdir)/scripts/makelib.sh; \
	do_markdown_products_proxy $(top_srcdir), $(GENERATE_MD))

BUILT_SOURCES = $(MARKDOWN_HTML)
CLEANFILES = $(MARKDOWN_HTML) markdown-products-proxy

local-clean:
	rm -rf $(top_srcdir)/vcnc-rest/static/doc-html
