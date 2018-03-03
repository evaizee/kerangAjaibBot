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
    const message = req.body.message
console.log(message)
  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
    if(message.text != undefined){
        if (message.text.toLowerCase().indexOf('weather') >= 0 ){
            let place = message.text.substring(11)
            let weatherIcon = ''
            let text = ''

            request.sendWeatherRequest(place, 'place', axios).then(weatherResult => {
                weatherIcon = request.setWeatherIcon(weatherResult.id)
                text = 'Weather in '+ place + ' right now is ' + weatherResult['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + weatherResult.main.temp

                request.sendMessage(text, message.chat.id, axios).then(response => {
                    console.log('message sent')
                    res.end('ok')
                }).catch(err => {
                    console.log('Error :', err)
                    res.end('Error :' + err)
                })
            }).catch(err => {
                request.sendCoordinateRequest(place, axios).then(placeResult => {

                    request.sendWeatherRequest(coord, 'coordinate', axios).then(result => {
                        if(result != false){
                            let coord   = new Object()
                            coord.lat   = placeResult.geometry.location.lat
                            coord.lon   = placeResult.geometry.location.lng
                            weatherIcon = request.setWeatherIcon(result.id)
                            text        = 'Weather in '+ place + ' right now is ' + result['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + result.main.temp

                            request.sendMessage(text, message.chat.id, axios).then(response => {
                                console.log('message sent')
                                res.end('ok')
                            }).catch(err => {
                                console.log('Error :', err)
                                res.end('Error :' + err)
                            })
                        }
                        else{
                            text = "I cannot find " + place + ", please insert another location"
                            request.sendMessage(text, message.chat.id, axios).then(response => {
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
                }).catch(err => {
                    console.log('Error :', err)
                    res.end('Error :' + err)
                })
            })
        }
        else{
            text = "I cannot understand what you mean"
            request.sendMessage(text, message.chat.id, axios).then(response => {
                console.log('message sent')
                res.end('ok')
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
            text = 'Weather in '+ place + ' right now is ' + result['weather'][0]['description'] + ' ' + weatherIcon + '\n' + 'Temperature : ' + result.main.temp

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
        text = "I cannot understand what you mean"
        request.sendMessage(text, message.chat.id, axios).then(response => {
            console.log('message sent')
            res.end('ok')
        }).catch(err => {
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
