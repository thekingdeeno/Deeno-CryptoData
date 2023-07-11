



# number-shortener

Takes a long number and translates to a beautifully short number.

1000 = 1k

2600000 = 2.6m

301000000001 = 301b+

99999999999999 = 99.9t+

x > 9999999999999999 = scientific notation



# Installing

Using NPM

    npm i number-shortener

# Example
#### Import

    const shortNum = require('number-shortener')
	shortNum(301000000001) //returns 301b+
	shortNum(9999999999999999999991) //returns 1e+22
