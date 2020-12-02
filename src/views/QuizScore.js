import React from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

function QuizScore({ answers }) {
	const answersWithScore = answers.filter((answerItem) => Number.isInteger(answerItem.score))
		.length;
	const sumScore = answers.reduce((acc, current) => {
		acc = acc + (Number.isInteger(current.score) ? current.score : 0);
		return acc;
	}, 0);

	const finalScore = sumScore / answersWithScore;

	return (
		<div className="score">
			<h1 className="scoreTitle">
				Score: <strong>{finalScore}</strong>
			</h1>
			<h3>Your answers:</h3>
			<ul className="answerList">
				{answers.map((singleAnswer) => {
					const singleAnswerMarckup = { __html: singleAnswer.text };
					return (
						<li key={singleAnswer.idQuestion} className="answerItem">
							<span dangerouslySetInnerHTML={singleAnswerMarckup} />
							<strong className="answerItemAnswer">{singleAnswer.answer}</strong>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
QuizScore.propTypes = {
	answers: PropTypes.array.isRequired,
};

export default QuizScore;
