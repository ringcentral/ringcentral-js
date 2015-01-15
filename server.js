(function() {

    var express = require('express'),
        app = express();

    app.use(express.static('.'));

    var server = app.listen(process.env.PORT || 80, function() {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Listening at http://%s:%s', host, port)

    });

})();