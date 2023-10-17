'use strict'

module.exports = {
  require: ['ts-node/register', 'source-map-support/register', 'src/index.ts'],
  'full-trace': true,
  recursive: true,
  timeout: 20000,
  spec: ['src/**/*-spec.ts']
};
