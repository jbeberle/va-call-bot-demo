function preventShowingHyperlink(provider) {
  return (provider || 'unknown').replace(/\./, '&period;');
}

function loginSelector(board) {
  return board === 'loginSelector';
}

function allClaimsSelector(board) {
  return board === 'allClaimsSelector';
}

function answerQuestionSelector(board) {
  return board === 'answerQuestionSelector';
}

function thanksForLettingUsKnowSelector(board) {
  return board === 'thanksForLettingUsKnowSelector';
}

function initialSelector(board) {
  return board === 'initialSelector';
}
function cancelling(board) {
  return board === 'cancelling';
}

module.exports = {
  preventShowingHyperlink,
  loginSelector,
  allClaimsSelector,
  initialSelector,
  answerQuestionSelector,
  thanksForLettingUsKnowSelector,
  cancelling,
};
