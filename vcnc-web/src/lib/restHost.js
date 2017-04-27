/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */

function restHost() {
  if (window.location.host === 'localhost:3000') {
    return 'localhost:6130';
  }
  const port = parseInt(window.location.port, 10) + 10;
  return `${window.location.hostname}:${port}`;
}

export default restHost;


