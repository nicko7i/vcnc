/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */

function restHost() {
  //
  //  Give the URL priority
  //
  const params = new URLSearchParams(window.location.search.substring(1));
  const rest = params.get('rest');
  if (rest) {
    return rest;
  }
  //
  //  Otherwise, if the URL is the Slingshot BrowserSync default, use the
  //  pre-configured product default. This is where a developer's
  //  vcnc-rest would be listening.
  //
  if (window.location.host === 'localhost:3000') {
    return 'localhost:6130';
  }
  //
  //  Otherwise, use the offset convention programmed into vcnc-rest.
  //
  const port = parseInt(window.location.port, 10) + 10;
  return `${window.location.hostname}:${port}`;
}

export default restHost;

