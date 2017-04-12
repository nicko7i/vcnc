#
#	'cnc-server/vcnc-core' makefile
#
#	Copyright (C) 2015	IC Manage Inc
#
#	See the file 'COPYING' for license information.
#

#
#  Builds the core libraries and component
#
all:
	(                               \
	  cd $(top_srcdir)/vcnc-core    \
	  NVM_DIR=$(TOOLROOT)/nvm; \
	  [ ! -d $(NVM_DIR) ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm); \
	  [ ! -d $(NVM_DIR) ] && (echo "Can't find NVM_DIR"; exit 1); \
	  . $(NVM_DIR)/nvm.sh;  \
	  npm install                   \
	)

clean-local:
	echo TBD
