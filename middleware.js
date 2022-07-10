const ExpressError = require('./expressError');

const logger = (req, res, next) => {
	console.log(`Received a ${req.method} request to ${req.path}.`);
	return next();
};

const checkForPassword = (req, res, next) => {
	try {
		if (req.query.password !== 'monkeybreath') {
			throw new ExpressError('Missing Password', 402);
		} else {
			return next();
		}
	} catch (e) {
		return next(e);
	}
};

module.exports = { logger, checkForPassword };
