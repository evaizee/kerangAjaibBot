var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const axios = require('axios')
const util = require('util')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

//This is the route the API will call
let thunderstorm = '\u1F429'    // Code: 200's, 900, 901, 902, 905
let drizzle = "\u1F4A7"         // Code: 300's
let rain = "\u2614"            // Code: 500's
let snowflake = "\u2744"       // Code: 600's snowflake
let snowman = "\u26C4"         // Code: 600's snowman, 903, 906
let atmosphere = "\u1F301"      // Code: 700's foogy
let clearSky = "\u2600"        // Code: 800 clear sky
let fewClouds = "\u26C5"       // Code: 801 sun behind clouds
let clouds = "\u2601"          // Code: 802-803-804 clouds general
let hot = "\u1F525" 			   // Code: 904

app.post('/new-message', function(req, res) {
  	const {message} = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  	if (!message || message.text.toLowerCase().indexOf('marco') >= 0) {
  		console.log('message.text')
  		let content = 'Polo Go!! ' + snowman
    	axios.post('https://api.telegram.org/bot418249931:AAE26HXheocEBfK3kpFQzoJCfkk40H8BmWI/sendMessage', {
	    	chat_id: message.chat.id,
	    	text: content
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
	  }

  	else if (message.text.toLowerCase().indexOf('weather') >= 0 ){
		  let city = message.text.substring(11)
  		let url = 'http://api.openweathermap.org/data/2.5/weather?appid=ea654eec38919fc04f92bf923b71b3eb&units=metric&q='+city
  		axios.get(url).then(response => {
  			
  			let weather = response.data['weather'][0]['description']
        let weatherId = response.data['weather'][0]['id']
  			let weatherIcon = ''
			
  			if(weatherId < 300){
  				weatherIcon = thunderstorm
  			}
  			else if(weatherId < 400 && weatherId >= 300){
  				weatherIcon = drizzle
  			}
  			else if(weatherId < 600 && weatherId >= 500){
  				weatherIcon = rain
  			}
  			else if(weatherId < 700 && weatherId >= 600){
  				weatherIcon = snow
  			}
  			else if(weatherId < 800 && weatherId >= 700){
  				weatherIcon = atmosphere
  			}
  			else if(weatherId == 800){
  				weatherIcon = clearSky
  			}
  			else if(weatherId > 800 && weatherId < 900){
  				weatherIcon = clouds
  			}
  			else{
          weatherIcon = atmosphere
  			}

  			axios.post('https://api.telegram.org/bot418249931:AAE26HXheocEBfK3kpFQzoJCfkk40H8BmWI/sendMessage', {
		    	chat_id: message.chat.id,
		    	text: 'Weather in '+ city + ' right now is ' + weather + ' ' + weatherIcon + '\n' + 'Temperature : ' + response.data.main.temp
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
  		})
  		.catch(error=>{
        res.end('error')
  			console.log(error)
  		})
  	}

  	// If we've gotten this far, it means that we have received a message containing the word "marco".
  	// Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  	// Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  	// The command curl -F "url=https://evaizee.xyz/new-message"  https://api.telegram.org/bot418249931:AAE26HXheocEBfK3kpFQzoJCfkk40H8BmWI/setWebhook  

});

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/hello', (req, res) => res.send('wazzup'))

app.get('/weather/:city', function(req, res){
	let city = req.params.city
  	let url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID=ea654eec38919fc04f92bf923b71b3eb'
  	console.log('tes')
  	axios.get(url).then(response => {
  		console.log(response.data.main.temp + ' ' + clearSky);
  	})
  	.catch(error=>{
  		console.log(error)
  	})
})
// Finally, start our server
app.listen(8080, function() {
  console.log('Telegram app listening on port 8080!');
});
