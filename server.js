var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var twilio = require('twilio');

var accountSid = 'AC16343b7a668f74da5d1da94b07449cdc'; // Your Account SID from www.twilio.com/console
var authToken = 'abf878a331d8f96816b987c918a3caeb'; // Your Auth Token from www.twilio.com/console

app.get('/scrape', function(req, res) {

    url = 'https://new.surfline.com/surf-report/pacific-beach/5842041f4e65fad6a7708841/forecast';

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var name, author, imageUrl;
            var json = { name: "", imageUrl: "", price: "", };

            // We'll use the unique header class as a starting point.

            $('.sl-spot-forecast-summary__stat > .quiver-surf-height').each(function(i, element) {
                var data = $(this);
                //.prev();
                name = data.text().trim();
                json.name = name;
                console.log(name);
            })

            var client = new twilio(accountSid, authToken);

            client.messages.create({
                    body: 'Surf height: ' + name,
                    to: '+16199463292', // Text this number
                    from: '+16194314436' // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));


            console.log(json);
            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function
        } else {
            console.log(error);
        }

        fs.appendFile('output.json', JSON.stringify(json, null, 4), { 'flag': 'a' }, function(err) {
            console.log('File write success!');
        })



        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    })

});

app.listen(process.ENV.PORT)
console.log('Magic happens on port ' + process.env.PORT);
exports = module.exports = app;
