var getHelpInfo = function (messageText){
	let text = ''
	switch(messageText){
		case '/hourly':
			text = 'Let me provide you with today weather forecast in hourly manner or you can tell me the precise hour.\nPlease provide me with this command "hourly, (your location), (expected hour in 24 hours style)-optional".\nExample: hourly, newcastle upon tyne, 18 OR hourly, newcastle upon tyne'
			break
		case '/daily':
			text = 'I will provide you with weather for today and the next 6 days \nPlease provide me with this command "daily, (your location)".\nExample: daily, newcastle upon tyne'
			break
		case '/now':
			text = 'I can get you latest weather forecast \nPlease provide me with this command "now, (your location)". \nExample: now, newcastle upon tyne'
			break
		case '/hi':
			text = 'Hello, it is a pleasure to meet you today'
			break
	}
	return text
}

module.exports = {
	getHelpInfo : getHelpInfo
}