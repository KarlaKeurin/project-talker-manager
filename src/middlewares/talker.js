const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;

const validateTalkerToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(HTTP_UNAUTHORIZED_STATUS)
      .json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(HTTP_UNAUTHORIZED_STATUS)
      .json({ message: 'Token inválido' });
  }
  next();
};

const validateTalkerName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "name" é obrigatório' });
  } if (name.length < 3) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateTalkerAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "age" é obrigatório' });
  } if (!Number.isInteger(age) || age < 18) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  next();
};

const validateTalkerTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const validateTalkerWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  if (!watchedAt) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  } if (!watchedAt.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateTalkerRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (rate === undefined) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" é obrigatório' });
  } if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const validateTalkerRateCatch = (req, res, next) => {
  const { rate } = req.body;
  if (rate === undefined) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" é obrigatório' });
  } if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

module.exports = {
  validateTalkerToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerRateCatch,
};