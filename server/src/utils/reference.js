const crypto = require('crypto');

// Dropped 0/O and 1/I so a reference is easy to read back over the phone.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeReference() {
  const bytes = crypto.randomBytes(6);
  let body = '';
  for (let i = 0; i < bytes.length; i += 1) {
    body += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `HL-${body}`;
}

module.exports = { makeReference };
