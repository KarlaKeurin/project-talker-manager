const HTTP_BAD_REQUEST_STATUS = 400;

const validateSearchRateQuery = async (req, res, next) => {
  const { rate } = req.query;
  if (!rate) {
    return next();
  } if (!Number.isInteger(Number(rate))) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  } if (rate < 1 || rate > 5) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return next();
};

const validateSearchDateQuery = async (req, res, next) => {
  const { date } = req.query;
  const dateReg = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!date) {
    return next();
  } if (!dateReg.test(date)) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

module.exports = {
  validateSearchRateQuery,
  validateSearchDateQuery,
};