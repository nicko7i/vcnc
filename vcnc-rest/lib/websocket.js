//
/* eslint-disable no-console */
const url = require('url');

function makeHandler() {
  let interval = null;
  let count = 0;
  return ws => {
    const location = url.parse(ws.upgradeReq.url, true);
    console.log('INFO-WS: Connected from ', location);

    ws.on('open', () => {
      console.log('INFO-WS: opened');
    });

    ws.on('message', message => {
      console.log('INFO-ws: received: %s', message)
    });

    ws.on('close', () => {
      console.log('INFO-ws: disconnected');
      clearInterval(interval);
    });

    interval = setInterval(() => {
      ws.send({
        rVtrq: 50 + count,
        rVpm: 40 + count,
        rVp: 30 + 2 * count,
      });
      count += 1;
    }, 15000);
  };
}

module.exports = {
  makeHandler,
};
