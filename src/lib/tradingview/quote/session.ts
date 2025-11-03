// @ts-nocheck
const { genSessionID } = require('../utils');
const quoteMarketConstructor = require('./market');

module.exports = (client) => class QuoteSession {
  #sessionID = genSessionID('qs');
  #client = client;
  #symbolListeners = {};

  constructor(options = {}) {
    this.#client.sessions[this.#sessionID] = { type: 'quote', onData: (packet) => {
      if (global.TW_DEBUG) console.log('§90§30§102 QUOTE SESSION §0 DATA', packet);
      if (packet.type === 'quote_completed') {
        const symbolKey = packet.data[1];
        if (!this.#symbolListeners[symbolKey]) { this.#client.send('quote_remove_symbols', [this.#sessionID, symbolKey]); return; }
        this.#symbolListeners[symbolKey].forEach((h) => h(packet));
      }
      if (packet.type === 'qsd') {
        const symbolKey = packet.data[1].n;
        if (!this.#symbolListeners[symbolKey]) { this.#client.send('quote_remove_symbols', [this.#sessionID, symbolKey]); return; }
        this.#symbolListeners[symbolKey].forEach((h) => h(packet));
      }
    } };

    const fields = (options.customFields && options.customFields.length > 0 ? options.customFields : []);
    this.#client.send('quote_create_session', [this.#sessionID]);
    this.#client.send('quote_set_fields', [this.#sessionID, ...fields]);
  }

  #quoteSession = { sessionID: this.#sessionID, symbolListeners: this.#symbolListeners, send: (t, p) => this.#client.send(t, p) };
  Market = quoteMarketConstructor(this.#quoteSession);
  delete() { this.#client.send('quote_delete_session', [this.#sessionID]); delete this.#client.sessions[this.#sessionID]; }
};