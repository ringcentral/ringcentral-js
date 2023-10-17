'use strict'

module.exports = {
  require: ['ts-node/register', 'source-map-support/register'],
  'full-trace': true,
  recursive: true,
  spec: ['src/**/*-spec.ts']
};
