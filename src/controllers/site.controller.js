/**
 *
 * Houses the controller functions that handle incoming HTTP requests and responses
 *
 */

const siteController = {
  index: (req, res, next) => {
    res.send('index page');
  },

  example: (req, res, next) => {
    res.send('example page');
  },
};

module.exports = siteController;
