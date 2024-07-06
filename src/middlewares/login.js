const HTTP_BAD_REQUEST_STATUS = 400;

const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "email" é obrigatório' });
  } if (!email.match(/^\S+@\S+\.\S+$/)) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } if (!password) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O campo "password" é obrigatório' });
  } if (password.length < 6) {
    return res.status(HTTP_BAD_REQUEST_STATUS)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return next();
};

module.exports = {
  validateLoginData,
};