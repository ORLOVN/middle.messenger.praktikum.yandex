//express server
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./dist'));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'), function (err) {
        if (err) {
            console.log(err);
            res.send('file dist/index.html not found');

        } else {
            console.log('file dist/index.html not found');
        }
    });
});


app.post('/data-receiver', function (req, res) {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});



app.listen(PORT, function () {
    console.log(`Messenger app listening on port ${PORT}!`);
});

