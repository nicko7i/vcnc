#!bash
#
#  Support functions for 'make' building 'npm' projects.
#
#  The code associated with a target is not 'bash' -- it's
#  not even 'sh'.  This lets us script targets with real bash.
#
function do_all { (
  set +x
  srcdir=$1
  TOOLROOT=$2
  #
  cd ${srcdir}
  NVM_DIR=${TOOLROOT}/nvm
  [ ! -d ${NVM_DIR} ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm)
  [ ! -d ${NVM_DIR} ] && (echo "Can't find NVM_DIR"; exit 1)
  . ${NVM_DIR}/nvm.sh
  npm install
)}

function do_all_rest { (
  do_all
  set +x
  srcdir=$1
  TOOLROOT=$2
  #
  cd ${srcdir}
  NVM_DIR=${TOOLROOT}/nvm
  [ ! -d ${NVM_DIR} ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm)
  [ ! -d ${NVM_DIR} ] && (echo "Can't find NVM_DIR"; exit 1)
  . ${NVM_DIR}/nvm.sh
  npm install
  npm run json-ize
)}

function do_all_gyp { (
  set +x
  srcdir=$1
  TOOLROOT=$2
  PROG_NODE_GYP=$3
  #
  pwd
  echo "SRCDIR is $(readlink -f ${srcdir})"
  cd ${srcdir}
  NVM_DIR=${TOOLROOT}/nvm
  echo ${NVM_DIR}
  [ ! -d ${NVM_DIR} ] && (NVM_DIR=$(TOOLROOT)/share/vcnc/nvm)
  [ ! -d ${NVM_DIR} ] && (echo "Can't find NVM_DIR"; exit 1)
  . ${NVM_DIR}/nvm.sh
  npm install
  ${PROG_NODE_GYP} configure
  ${PROG_NODE_GYP} build
)}

function do_markdown_products_proxy { (
  set +x
  top_srcdir=$1
  GENERATE_MD=$2
  [ -x ${GENERATE_MD} ] || { echo 'generate-md not found'; exit 1; }
  rm -rf ${top_srcdir}/doc-html
  mkdir -p ${top_srcdir}/doc-html
  ${GENERATE_MD} --input ${top_srcdir}/vcnc-rest/doc --output ${top_srcdir}/vcnc-rest/static/doc-html --layout mixu-page
  touch markdown-products-proxy
)}
