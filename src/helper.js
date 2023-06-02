// temp function to generate random id
function getRandomIntId(max = 99999) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  getRandomIntId,
};
