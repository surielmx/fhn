import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './QuizProgress.css';

function QuizProgress({ progress }) {
	let progressRef = useRef(null);

	useEffect(() => {
		progressRef.current.style.width = `${progress}%`;
	}, [progress]);

	return (
		<div className="quizProgressContainer">
			<div className="quizProgressBar quizProgress" ref={progressRef}></div>
		</div>
	);
}
QuizProgress.propTypes = {
	progress: PropTypes.number.isRequired,
};

export default QuizProgress;
