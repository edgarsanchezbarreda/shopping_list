const express = require('express');
const morgan = require('morgan');

const ExpressError = require('./expressError');
const shoppingListRoutes = require('./routes/shoppingList');
const middleware = require('./middleware');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/items', shoppingListRoutes);
app.use(middleware.logger);

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// 404 Handler.
app.use(function(req, res) {
	return new ExpressError('Not Found', 404);
});

// Generic error handler.
app.use(function(err, req, res, next) {
	let status = err.status || 500;

	return res.status(status).json({
		error: {
			message: err.message,
			status: status
		}
	});
});

module.exports = app;
