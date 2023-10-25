const fs = require('fs-extra');
const path = require('path');

if (!fs.existsSync(path.resolve(__dirname, './dist'))) {
  fs.mkdirSync(path.resolve(__dirname, './dist'));
}

fs.ensureSymlinkSync(
    path.resolve(__dirname, '../sdk/dist'),
    path.resolve(__dirname, './dist/sdk')
);

fs.ensureSymlinkSync(
    path.resolve(__dirname, '../subscriptions-deprecated/dist'),
    path.resolve(__dirname, './dist/subscriptions-deprecated')
);

fs.ensureSymlinkSync(
    path.resolve(__dirname, '../subscriptions/dist'),
    path.resolve(__dirname, './dist/subscriptions')
);
