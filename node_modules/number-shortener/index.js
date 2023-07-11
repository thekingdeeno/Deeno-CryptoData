
// © 2018 Jonathon Powell

const shortsymbols = {
	// length: symbol,
	4: 't', //trillionths
	3: 'b', //billionths
	2: 'm', //millionths
	1: 'k' //thousanths
}

module.exports = function(number){	
	if(number > 9999999999999999) {
		/*
		Number is above trillionths... Most people don't remember all the number 
		placement names(or probably just me... lol), so give scientific notation! 
		
		I really wanted to write my own 'number to scientific notation converter'
		to allow things like 900000 = 9000*10^2. The built in method toExponential
		is likely read by a c++ interpreter, so thats expected to be much faster.
		
		Maybe optionalize it in the future?
		*/
		
		return number.toExponential()
	} else {
		/* Relatively short number, but still a bit long, so number 
		shortened with it's corresponding 'symbol' */
		
		//to see how many numbers are in string
		number = number.toString()
		
		//How many commas would there be? (ex. 1000000 = 1,000,000 = 2 commas)
		let commaCount = Math.floor((number.length-1) / 3)
		
		//Do we need to shorten the number?
		if(commaCount > 0){
			// Shorten number with symbol to 6 characters max
			// ex. 123456 = 123.4k+
			
			//Based on comma count, we can tell if its thousanths, millionths, etc
			let symbol = shortsymbols[commaCount]
			
			//Determine dot placement. Hacky, but efficient in lines of code
			let dotPlacement = number.length%3;
			if(dotPlacement === 0) dotPlacement = 3;
			
			//Determine if remainder is short number leaves out higher value
			if(Number(number.substr(dotPlacement+1)) > 0) symbol += '+';
			
			//Inserts dot. Hackily doesn't add dot if dotPlacement is  3
			number = number.substr(0,dotPlacement) + '.' + number.substr(dotPlacement)
			
			//Rounds to tenths place
			number = Math.floor(Number(number) * 10)/10
			
			number += symbol
			
		} // else just return the plain number
	}
	
	return number
}