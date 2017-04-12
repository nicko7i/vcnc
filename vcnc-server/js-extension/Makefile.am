#
#	'cnc-server/js-extension' makefile
#
#	Copyright (C) 2015	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#

#
#  Builds the JavaScript (v8) extension that wraps PIDL calls.
#
all:
	(cd $(top_srcdir)/js-extension; \
	  NVM_DIR=$(TOOLROOT)/nvm; \
	  [ ! -d $(NVM_DIR) ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm); \
	  [ ! -d $(NVM_DIR) ] && (echo "Can't find NVM_DIR"; exit 1); \
	  . $(NVM_DIR)/nvm.sh;  \
	  npm install; \
	  $(PROG_NODE_GYP) configure; \
	  $(PROG_NODE_GYP) build)

clean-local:
	echo TBD
