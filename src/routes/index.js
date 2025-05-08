/**
 *
 * Defines the routes for the application, which link HTTP requests to specific controllers
 *
 */

const siteRouter = require('./site.routes');

const routes = (app) => {
  app.use(`/`, siteRouter);
};

module.exports = routes;
