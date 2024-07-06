const express = require('express');
// const fs = require('fs').promises;
// const path = require('path');

// const TALKER_DATA_PATH = '../talker.json';

const randomToken = require('./utils/token');

const { 
  readTalkersData,
  writNewTalkerData,
  updateTalkerData,
  deleteTalkerData,
  editTalkerRate,
} = require('./utils/fsUtils');

const { 
  validateLoginData,
} = require('./middlewares/login');

const { 
  validateTalkerToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerRateCatch,
} = require('./middlewares/talker');

const {
  validateSearchRateQuery,
  validateSearchDateQuery,
} = require('./middlewares/talkerQueryParam');

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;
const HTTP_NOT_FOUND_STATUS = 404;
// const HTTP_BAD_REQUEST_STATUS = 400;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();

  if (talkers) {
    return res.status(HTTP_OK_STATUS).json(talkers);
  } 
  return res.status(HTTP_OK_STATUS).json([]);
});

app.get('/talker/search', 
  validateTalkerToken,
  validateSearchRateQuery,
  validateSearchDateQuery, async (req, res) => {
    const { q, rate, date } = req.query;
    const talkersBase = await readTalkersData();

    const filteredTalkers = q ? talkersBase 
      .filter((talker) => talker.name.includes(q)) : talkersBase;
    const filteredRate = rate ? filteredTalkers
      .filter((talker) => talker.talk.rate === Number(rate)) : filteredTalkers;
    const filteredDate = date ? filteredRate
      .filter((talker) => talker.talk.watchedAt === date) : filteredRate;
    
    return res.status(HTTP_OK_STATUS).json(filteredDate);
  });

app.patch('/talker/rate/:id',
  validateTalkerToken,
  validateTalkerRateCatch, async (req, res) => {
    const { id } = req.params;
    
    await editTalkerRate(Number(id), req.body);
    return res.status(204).send();
  });

app.get('/talker/:id', async (req, res) => {
  const talkers = await readTalkersData();
  const { id } = req.params;
  const talker = talkers.find((talkerId) => talkerId.id === Number(id));

  if (talker) {
    return res.status(HTTP_OK_STATUS).json(talker);
  } 
  return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateLoginData, async (req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: randomToken() });
});

app.post('/talker',
  validateTalkerToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate, async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await readTalkersData();

    const findLastTalkerId = talkers[talkers.length - 1];
    const talkerId = findLastTalkerId ? findLastTalkerId.id : 0;
    const newTalkerId = talkerId + 1;

    const newTalkerWithId = { id: newTalkerId, name, age, talk };
  
    await writNewTalkerData(newTalkerWithId);
    res.status(HTTP_CREATED_STATUS).json(newTalkerWithId);
  });

app.put('/talker/:id',
  validateTalkerToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  async (req, res) => {
    const { id } = req.params;
    const updatedTalkerData = req.body;

    try {
      const updatedTalker = await updateTalkerData(Number(id), updatedTalkerData);
      return res.status(HTTP_OK_STATUS).json(updatedTalker);
    } catch (error) {
      return res.status(HTTP_NOT_FOUND_STATUS)
        .json({ message: 'Pessoa palestrante não encontrada' });
    }
  });
  
app.delete('/talker/:id', validateTalkerToken, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));
  return res.status(HTTP_NO_CONTENT_STATUS).end();
});
