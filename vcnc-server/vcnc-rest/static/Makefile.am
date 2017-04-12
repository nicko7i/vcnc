#
#	'cnc-server/vcnc-rest/static' makefile
#
#	Copyright (C) 2015-2017	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#

#
#  Install the software which provides the interactive API documentation.
#
all:
	if [ ! -d $(top_srcdir)/vcnc-rest/static/swagger-ui ]; then \
	  (cd $(top_srcdir)/vcnc-rest/static; \
	  $(PROG_GIT) clone --depth 1 --branch v2.2.10 https://github.com/swagger-api/swagger-ui.git; \
	  rm -rf swagger-ui/.git) \
	fi

clean-local:
	rm -rf $(top_srcdir)/vcnc-rest/static/swagger-ui
