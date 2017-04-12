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
	(                             \
	  cd $(top_srcdir)/vcnc-rest; \
	  NVM_DIR=$(TOOLROOT)/nvm; \
	  [ ! -d $(NVM_DIR) ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm); \
	  [ ! -d $(NVM_DIR) ] && (echo "Can't find NVM_DIR"; exit 1); \
	  . $(NVM_DIR)/nvm.sh;  \
	  npm install;                 \
	  npm run json-ize                 \
	)

clean-local:
	echo TBD
