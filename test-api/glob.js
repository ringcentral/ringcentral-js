var context = require.context('./specs', true, /.+\-spec\.js$/);
context.keys().forEach(context);
module.exports = context;