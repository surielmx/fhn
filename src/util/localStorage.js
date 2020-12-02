function getExistingAnswers(id, answers) {
	return answers.filter((answer) => answer.idQuestion === id).length;
}
function updateExistingAnswer(answerData, oldAnswers) {
	const { idQuestion } = answerData;
	return oldAnswers.map((oldAnswer) => {
		if (idQuestion === oldAnswer.idQuestion) {
			return {
				...oldAnswer,
				...answerData,
			};
		} else {
			return oldAnswer;
		}
	});
}
export function setLocalStorage(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key) {
	const value = JSON.parse(window.localStorage.getItem(key));
	return value ? value : [];
}

export function updateLocalAnswer(key, answerData) {
	const { idQuestion } = answerData;
	let answers = [];
	const oldAnswers = getLocalStorage(key);
	const existsAnswers = getExistingAnswers(idQuestion, oldAnswers);
	if (Boolean(existsAnswers)) {
		answers = updateExistingAnswer(answerData, oldAnswers);
	} else {
		answers = oldAnswers.concat([answerData]);
	}

	setLocalStorage(key, answers);
}
