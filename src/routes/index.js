const authRouter = require('./auth.routes');

const routes = (app) => {
  app.use(`/api`, authRouter);
};

module.exports = routes;
