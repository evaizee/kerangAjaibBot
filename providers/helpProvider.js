var getHelpInfo = function (messageText){
	let text = ''
	switch(messageText){
		case '/hourly':
			text = 'Let me provide you with today weather forecast in hourly manner or you can tell me the precise hour. \r\n Please provide me with this command "hourly, (your location), (expected hour in 24 hours style)-optional". \r\n Example: hourly, newcastle upon tyne, 18 OR hourly, newcastle upon tyne'
			break
		case '/daily':
			text = 'I will provide you with weather for today and the next 6 days \r\n Please provide me with this command "daily, (your location)". \r\n Example: daily, newcastle upon tyne'
			break
		case '/now':
			text = 'I can get you latest weather forecast \r\n Please provide me with this command "now, (your location)". \r\n Example: now, newcastle upon tyne'
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