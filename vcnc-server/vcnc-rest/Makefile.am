#
#	'cnc-server/vcnc-rest' makefile
#
#	Copyright (C) 2015	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#

SUBDIRS =						\
	.                           \
	doc                         \
	static

#
#  Builds the core libraries and component
#
all-local:
	(source $(top_srcdir)/scripts/makelib.sh;    \
	 do_all_rest $(top_srcdir)/vcnc-rest $(TOOLROOT))

clean-local:
	echo TBD
