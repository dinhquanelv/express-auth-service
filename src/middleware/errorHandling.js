const errorHandling = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMessage = err.message || 'Internal server error!';

  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack, // do not show in fe
  });
};

module.exports = errorHandling;
