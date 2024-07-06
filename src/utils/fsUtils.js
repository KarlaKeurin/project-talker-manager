// ARQUIVO ONDE FICAM AS FUNÇÕES DOS ENDPOINTS
const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = '../talker.json';

async function readTalkersData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function writNewTalkerData(newTalker) {
  const talkers = await readTalkersData();
  const newListTalkers = [...talkers, newTalker];
  await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), JSON.stringify(newListTalkers));

  return newListTalkers;
}

async function updateTalkerData(id, updatedTalkerData) {
  const talkers = await readTalkersData();
  const updateTalker = { id, ...updatedTalkerData };
  const findTalkerId = talkers.find((talker) => talker.id === id);

  if (!findTalkerId) {
    throw new Error();
  }

  const updatedTalker = talkers.reduce((talkersList, currentTalker) => {
    if (currentTalker.id === updateTalker.id) return [...talkersList, updateTalker];
    return [...talkersList, currentTalker];
  }, []);

  const updatedData = JSON.stringify(updatedTalker);
  await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);

  return updateTalker;
}

async function editTalkerRate(talkerId, rate) {
  const talkers = await readTalkersData();
  
  const filteredTalker = talkers.find(({ id }) => id === talkerId);
  if (filteredTalker) {
    const updateTalkers = talkers.map((talker) => {
      if (talker.id === talkerId) {
        const talkerData = talker;
        talkerData.talk.rate = rate.rate;
        return talker;
      }
      return talker;
    });
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), JSON
      .stringify(updateTalkers), 'utf-8');
  }
}

async function deleteTalkerData(id) {
  const talkers = await readTalkersData();
  const updateTalker = talkers.filter((currentTalker) => currentTalker.id !== id);

  const updatedData = JSON.stringify(updateTalker);
  await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);
}

module.exports = {
  readTalkersData,
  writNewTalkerData,
  updateTalkerData,
  deleteTalkerData,
  editTalkerRate,
};