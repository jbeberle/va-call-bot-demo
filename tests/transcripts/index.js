const Describe = require('../src/Describe');
const myHealtheVet = require('./myHealtheVet');
const dsLogon = require('./dsLogon');
const escalation = require('./escalation');
const interrupt = require('./interrupt.js');

module.exports = [
  new Describe('My Healthe Vet', myHealtheVet),
  new Describe('DS Logon', dsLogon),
  new Describe('Escalation path', escalation),
  new Describe('Cancellation path', interrupt),
];
