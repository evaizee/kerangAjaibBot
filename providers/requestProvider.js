const botId 		= process.env.TELEGRAM_BOT_ID
const googleKey 	= process.env.GOOGLE_API_KEY
const weatherKey	= process.env.OPENWEATHER_KEY

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

var sendWeatherRequest = function (location, type, axios) {
	return new Promise(function (resolve, reject) {
		let url = 'http://api.openweathermap.org/data/2.5/weather?appid='+weatherKey+'&units=metric'
		switch(type){
			case 'city':
				url = url+'&q='+location
				break
			case 'coordinate':
				url = url+'&lat='+location.lat+'&lon='+location.lon
		}

		axios.get(url).then(response => {
			if(response.data['weather'] != undefined){
				return resolve(response.data)	
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

var sendCoordinateRequest = function (location, axios){
	return new Promise(function (resolve, reject) {
		let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'&key='+googleKey
		axios.get(url).then(response => {
			if(response.status.toLowerCase() == 'OK'){
				return resolve(response.results[0])
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

var setWeatherIcon = function (weatherId){
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

    return weatherIcon
}

module.exports = {
	sendWeatherRequest : sendWeatherRequest,
	sendCoordinateRequest : sendCoordinateRequest,
	sendMessage : sendMessage,
	setWeatherIcon : setWeatherIcon
}