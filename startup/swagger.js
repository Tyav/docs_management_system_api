const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	swaggerDefinition : {
		// Like the one described here: https://swagger.io/specification/#infoObject
		info     : {
			title       : 'Document Management System API Documentation',
			version     : '1.0.0',
			description : 'Test Document Management System APIs with swagger docs',
			contact     : {
				email : 'tyav2greenz@gmail.com',
			},
		},
		tags     : [
			{
				name        : 'User',
				description : 'Everything about the Users API',
			},
			{
				name        : 'Document',
				description : 'Everything about the Documents API',
			},
			{
				name        : 'Role',
				description : 'Everything about the Roles API',
			},
		],
		// schemes  : [ 'https', 'http' ],
		// host     : 'localhost:4040/',
	},
	// List of files to be processes. You can also set globs './routes/*.js'
	apis              : [ './api/v1/swagger-files/*.yaml' ],
};

const specs = swaggerJsdoc(options);

module.exports = app => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
