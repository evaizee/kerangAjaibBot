const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

app.post('sendMessage', function (req, res) {
	const message = req.body;
	if (!message || message.text.toLowerCase().indexOf('marco') <0) {
		return res.end()
	}

	axios.post('https://api.telegram.org/bot418249931:AAE26HXheocEBfK3kpFQzoJCfkk40H8BmWI/sendMessage', {
		chat_id: message.chat.id,
		text: 'Polo!!'
	})
	.then(response => {
	  // We get here if the message was successfully posted
	  console.log('Message posted')
	  res.end('ok')
	})
	.catch(err => {
	  // ...and here if it was not
	  console.log('Error :', err)
	  res.end('Error :' + err)
	})

});

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!');
});
