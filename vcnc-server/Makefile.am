#
#	'cnc-server' makefile
#
#	Copyright (C) 2015	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#
ACLOCAL_AMFLAGS = -I m4
SUB_LOCAL = $(top_srcdir)/sub_local.pl

SUBDIRS = version js-extension vcnc-core vcnc-rest vcnc-sampler . installer
#
PROJECTIONS = 			\
	VERSION=$(VERSION)

#
#  On installation, place config/settings files into the 
#  target "/etc/" directory
#
#  .. this is premature; currently the node server only looks
#     in the directory containing app.js
#
#etcdir=$(datadir)/etc
#etc_DATA = velstor-vcnc.conf velstor-vcnc-settings.js


#
#
clean-local:

install-data-local:
	find $(top_srcdir) -name '*~' -exec rm '{}' ';'
	mkdir $(DESTDIR)$(prefix)/share/vcnc
	rsync -a $(top_srcdir) $(DESTDIR)$(prefix)/share/vcnc
