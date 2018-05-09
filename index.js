require('dotenv').load()

const express     = require('express')
const app         = express()
const bodyParser  = require('body-parser')
const axios       = require('axios')
const request     = require('./providers/requestProvider')
const help        = require('./providers/helpProvider')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/new-message/'+process.env.TELEGRAM_BOT_ID, function(req, res) {
    const message = req.body.message

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
    if(message.text != undefined){
        if(message.text.toLowerCase().indexOf('/hourly') >= 0 || message.text.toLowerCase().indexOf('/daily') >= 0 || message.text.toLowerCase().indexOf('/start') >= 0 || message.text.toLowerCase().indexOf('/hi') >= 0 || message.text.toLowerCase().indexOf('/now') >= 0){
            let text = help.getHelpInfo(message.text.toLowerCase())
            request.sendMessage(text, message.chat.id, axios).then(response => {
                console.log('message sent')
                res.end('ok')
            }).catch(err => {
                console.log('Error :', err)
                res.end('Error :' + err)
            })
            console.log(text)            
        }
        else if(message.text.toLowerCase().indexOf('hourly') >= 0 || message.text.toLowerCase().indexOf('daily') >= 0 || message.text.toLowerCase().indexOf('hi') >= 0 || message.text.toLowerCase().indexOf('now') >= 0){
            let commandArr = message.text.split(',')
            let place = commandArr[1].trim()
            let command = commandArr[0].trim()

            if(place != undefined && place != ''){
                request.sendCoordinateRequest(place, axios).then(placeResult => {
                    if(placeResult != false){
                        let coord = {
                            lat : placeResult.geometry.location.lat,
                            lon : placeResult.geometry.location.lng
                        }

                        request.sendWeatherRequest(place, axios, coord, command, commandArr[2]).then(forecastResult => {
                            if(forecastResult != false){
                                console.log(forecastResult)

                                request.sendMessage(forecastResult, message.chat.id, axios).then(response => {
                                    console.log('message sent')
                                    res.end('ok')
                                }).catch(err => {
                                    console.log('Error :', err)
                                    res.end('Error :' + err)
                                })

                            }
                            else{
                                text = "Sorry, but I cannot find any weather forecast for " + place + ", with all respect, can you provide me with another location?"
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
            }
        }
        else{
            text = "Sorry, but I cannot provide that for now"
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

// Finally, start our server
app.listen(8080, function() {
  console.log('Telegram app listening on port 8080!');
});
