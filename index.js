require('dotenv').load()

const express     = require('express')
const app         = express()
const bodyParser  = require('body-parser')
const axios       = require('axios')
const request     = require('./providers/requestProvider')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/new-message', function(req, res) {
    const {message} = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
    if(message.text != undefined){
        if (message.text.toLowerCase().indexOf('weather') >= 0 ){
            let place = message.text.substring(11)
            let weatherIcon = ''
            let message = ''

            request.sendWeatherRequest(place, 'place', axios).then(weatherResult => {
                if(result == false){
                    request.sendCoordinateRequest(place, axios).then(placeResult => {
                        let place = new Object()
                        place.lat = placeResult.geometry.location.lat
                        place.lon = placeResult.geometry.location.lng

                        request.sendWeatherRequest(place, 'coordinate', axios).then(result => {
                            weatherIcon = request.setWeatherIcon(result.id)
                            message = 'Weather in '+ place + ' right now is ' + result['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + result.main.temp

                            request.sendMessage(message, message.chat.id, axios).then(response => {
                                console.log('message sent')
                                res.end('ok')
                            }).catch(err => {
                                console.log('Error :', err)
                                res.end('Error :' + err)
                            })
                        }).catch(err => {
                            console.log('Error :', err)
                            res.end('Error :' + err)
                        })
                    }).catch(err => {
                        console.log('Error :', err)
                        res.end('Error :' + err)
                    })
                }

                else{
                    weatherIcon = request.setWeatherIcon(result.id)
                    message = 'Weather in '+ place + ' right now is ' + weatherResult['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + weatherResult.main.temp

                    request.sendMessage(message, message.chat.id, axios).then(response => {
                        console.log('message sent')
                        res.end('ok')
                    }).catch(err => {
                        console.log('Error :', err)
                        res.end('Error :' + err)
                    })
                }
            }).catch(err => {
                console.log('Error :', err)
                res.end('Error :' + err)
            })
        } 
    }
    else if(message.location != undefined){
        let place = new Object()
        place.lat = message.location.latitude
        place.lon = message.location.longitude

        request.sendWeatherRequest(place, 'coordinate', axios).then(result => {
            weatherIcon = request.setWeatherIcon(result.id)
            message = 'Weather in '+ place + ' right now is ' + result['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + result.main.temp

            request.sendMessage(message, message.chat.id, axios).then(response => {
                console.log('message sent')
                res.end('ok')
            }).catch(err => {
                console.log('Error :', err)
                res.end('Error :' + err)
            })
        }).catch(err => {
            console.log('Error :', err)
            res.end('Error :' + err)
        })
    }
    else{
        axios.post('https://api.telegram.org/bot418249931:AAE26HXheocEBfK3kpFQzoJCfkk40H8BmWI/sendMessage', {
            chat_id: message.chat.id,
            text: 'Sorry but i cannot understand your message'
        }).then(response => {
        // We get here if the message was successfully posted
            console.log('Message posted')
            res.end('ok')
        }).catch(err => {
      // ...and here if it was not
            console.log('Error :', err)
            res.end('Error :' + err)
        })
    }
})

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
