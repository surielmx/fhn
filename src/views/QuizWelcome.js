import React from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

function QuizWelcome({ onStartQuiz }) {
	return (
		<div className="quizWelcome">
			<img src="./assets/bank_logo.png" alt="Bank logo" width="64" />
			<h2>How are you doing with your money? Take a 2-minute quiz.</h2>
			<button type="button" onClick={onStartQuiz} className="btnPrimary">
				Let´s Do This!
			</button>
		</div>
	);
}

QuizWelcome.propTypes = {
	onStartQuiz: PropTypes.func,
};
export default QuizWelcome;
