const botId 		= process.env.TELEGRAM_BOT_ID
const googleKey 	= process.env.GOOGLE_API_KEY
const weatherKey	= process.env.DARKSKY_API_KEY
const weatherUrl 	= process.env.DARKSKY_FORECAST_URL

const moment        = require('moment')

const thunderstorm  = "\u26C8"
const drizzle       = "\u1F4A7"
const rain          = "\u2614"
const snowflake     = "\u2744"
const snowman       = "\u26C4"
const atmosphere    = "\uD83C\uDF01"
const clearSky      = "\u2600"
const fewClouds     = "\u26C5"
const clouds        = "\u2601"
const hot           = "\u1F525"

var sendWeatherRequest = function (place, axios, location, type, hour) {
	return new Promise(function (resolve, reject) {
		let url = weatherUrl+weatherKey+'/'+location.lat+','+location.lon+'?units=si'
		let typeName = ''
		type = type.toLowerCase()
		switch(type){
			case 'daily':
				url += '&exclude=currently,flags,alerts,minutely,hourly'
				typeName = 'daily'
				break
			case 'now':
				url += '&exclude=daily,flags,alerts,minutely,hourly'
				typeName = 'currently'
				break
			case 'hourly':
				url += '&exclude=currently,flags,alerts,minutely,daily'
				typeName = 'hourly'
				break
			default:
				url += '&exclude=daily,flags,alerts,minutely,hourly'
				typeName = 'currently'
				break
		}
		console.log(url)

		axios.get(url).then(forecast => {
			let weatherData = ''
			if(forecast.data.timezone != undefined){
				switch(type){
					case 'now':
						weatherData = forecast.data.currently
						weatherText = setWeatherIcon(weatherData.icon)
						weatherData = 'It is ' + weatherData.temperature + ' C \r\n The weather is ' + weatherText.text + weatherText.icon + ' in ' + place 
						break
					case 'hourly':
						let time = ''
						if(hour != undefined){
							time = moment({ y:moment().year(), M:moment().month(), d:moment().date(), h:hour, m:0, s:0, ms:0}).unix()
							weatherData = setMessageText(type, forecast.data.hourly.data, time, hour)
						}
						else{
							time = moment({ y:moment().year(), M:moment().month(), d:moment().date(), h:23, m:59, s:59, ms:59}).unix()
							weatherData = setMessageText(type, forecast.data.hourly.data, time)
						}
						break
					case 'daily':
						weatherData = setMessageText(type, forecast.data.daily.data)
						break
				}
				return resolve(weatherData)
			}
			else{
				return resolve(false)
			}
      	}).catch(error=>{
	        return reject(error)
      	})
	})
}

var sendCoordinateRequest = function (location, axios){
	return new Promise(function (resolve, reject) {
		let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'&key='+googleKey
		axios.get(url).then(response => {
			if(response.data.status.toLowerCase() == 'ok'){
				return resolve(response.data.results[0])
			}
			else{
				return resolve(false)
			}
		}).catch(error=>{
			console.log(error)
			return reject(error)
		})
	})
}

var sendMessage = function (message, chatId, axios){
	return new Promise(function(resolve, reject){
		axios.post('https://api.telegram.org/'+botId+'/sendMessage', {
         	chat_id: chatId,
         	text: message
        }).then(response => {
          // We get here if the message was successfully posted
            console.log('Message posted')
            return resolve('ok')
        }).catch(err => {
          // ...and here if it was not
            console.log('Error :', err)
            return reject(err)
        })
	})
}

function setMessageText(type, myArray, timeInput, expectedTime){
	let timeArray = []
	let message = ''
    for (var ii=0; ii < myArray.length; ii++) {
    	if(type == 'hourly'){
    		if(expectedTime != undefined){
	    		if ((myArray[ii].time == timeInput) || (myArray[ii].time-timeInput == 1800) || (timeInput-myArray[ii].time == 1800)) {
		            weatherText = setWeatherIcon(myArray[ii].icon)
	    			message = 'On'+ expectedTime + '\nThe weather is ' + weatherText.icon + ' ' + weatherText.text + '\nWhile the temperature is ' + myArray[ii].temperature + 'C\n\n'
		            timeArray.push(myArray[ii])
		            myArray[ii].message = message
		            ii = myArray.length
		        }
	    	}
	    	else{
	    		if(myArray[ii].time <= timeInput){
	    			weatherText = setWeatherIcon(myArray[ii].icon)
	    			message += 'On ' + moment.unix(myArray[ii].time).format('H') + '\nThe weather would be ' + weatherText.icon + ' ' + weatherText.text + '\nWhile the temperature is about ' + myArray[ii].temperature + 'C\n\n'
	    			timeArray.push(myArray[ii])
	    			myArray[ii].message += message
	    		}
	    		else{
	    			ii = myArray.length
	    		}
	    	}	
    	}
    	else if(type == 'daily') {
    		weatherText = setWeatherIcon(myArray[ii].icon)
	    	message += 'On ' + moment.unix(myArray[ii].time).format('MMMM D') + '\nThe weather would be ' + weatherText.icon + ' ' + weatherText.text + '\n\It would be ' + myArray[ii].summary.trim() + '\nWhile the temperature is about ' + myArray[ii].temperatureHigh + 'C' + ' at its peak\n\n'
    		timeArray.push(myArray[ii])
    		myArray[ii].message += message
    	}
    }
    return message
}

var setWeatherIcon = function (weather){
	let weatherText = new Object()

	if(weather == 'clear-day'){
      weatherText.icon = clearSky
      weatherText.text = 'Clear Sky '
    }
    else if(weather == 'clear-night'){
      weatherText.icon = clearSky
      weatherText.text = 'Clear Sky '
    }
    else if(weather == 'rain'){
      weatherText.icon = rain
      weatherText.text = 'Raining '
    }
    else if(weather == 'snow'){
      weatherText.icon = snowman
      weatherText.text = 'Snowing '
    }
    else if(weather == 'sleet'){
      weatherText.icon = snowflake
      weatherText.text = 'Hailing '
    }
    else if(weather == 'wind'){
      weatherText.icon = clearSky
      weatherText.text = 'Windy '
    }
    else if(weather == 'fog'){
      weatherText.icon = clouds
      weatherText.text = 'Foggy '
    }
    else if(weather == 'cloudy'){
      weatherText.icon = clouds
      weatherText.text = 'Cloudy '
    }
    else if(weather == 'partly-cloudy-day'){
      weatherText.icon = clouds
      weatherText.text = 'Cloudy '
    }
    else if(weather == 'partly-cloudy-night'){
      weatherText.icon = clouds
      weatherText.text = 'Cloudy '
    }

    return weatherText
}

module.exports = {
	sendWeatherRequest : sendWeatherRequest,
	sendCoordinateRequest : sendCoordinateRequest,
	sendMessage : sendMessage,
	setWeatherIcon : setWeatherIcon
}
