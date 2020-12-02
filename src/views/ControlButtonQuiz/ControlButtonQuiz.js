import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ControllButtonQuiz.css';

function ControlButtonQuiz({
	hasPrevious,
	isRequiredQuestion,
	isLastQuestion,
	onNextQuestion,
	onPrevQuestion,
	prevIndex,
	nextIndex,
}) {
	return (
		<div className="controlButtons">
			<button
				type="button"
				onClick={() => onPrevQuestion(prevIndex)}
				disabled={!hasPrevious || isLastQuestion}
				className="prevButton"
			>
				<i className="material-icons">west</i>
			</button>
			<button
				type="button"
				disabled={isRequiredQuestion}
				onClick={() => onNextQuestion(nextIndex)}
				className="nextButton"
			>
				<span className="material-icons">east</span>
			</button>
		</div>
	);
}
ControlButtonQuiz.propTypes = {
	hasPrevious: PropTypes.bool.isRequired,
	isRequiredQuestion: PropTypes.bool.isRequired,
	isLastQuestion: PropTypes.bool.isRequired,
	onNextQuestion: PropTypes.func.isRequired,
	onPrevQuestion: PropTypes.func.isRequired,
	prevIndex: PropTypes.number,
	nextIndex: PropTypes.number.isRequired,
};
export default ControlButtonQuiz;
