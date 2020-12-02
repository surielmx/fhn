import React from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

function QuizQuestion({ answers, id: idQuestion, text, help, onClickAnswer, answerSelected = '' }) {
	const keyanswers = Array.from({ length: answers.length }, (v, i) => i + 1).reverse();
	const title = { __html: text };
	const helpMarkup = { __html: help };

	return (
		<div className="quiz">
			<h1 className="questionTitle" dangerouslySetInnerHTML={title} />
			<small className="questionHelp" dangerouslySetInnerHTML={helpMarkup} />
			<ul>
				{answers.map(({ id: idAnswer, text, score }, index) => (
					<li key={idAnswer}>
						<button
							type="button"
							className={`btnAnswer ${
								answerSelected === idAnswer ? 'btnAnswerSelected' : ''
							}`}
							onClick={() => onClickAnswer(idQuestion, idAnswer, text, score)}
						>
							<span className="keyNumber">{keyanswers[index]}</span>
							{text}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
QuizQuestion.propTypes = {
	answers: PropTypes.array.isRequired,
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	help: PropTypes.string.isRequired,
	onClickAnswer: PropTypes.func.isRequired,
	answerSelected: PropTypes.string,
};

export default QuizQuestion;
