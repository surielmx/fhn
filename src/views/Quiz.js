import React, { useEffect, useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import QuizWelcome from 'views/QuizWelcome';
import QuizQuestion from 'views/QuizQuestion';
import QuizScore from 'views/QuizScore';
import ControlButtonQuiz from 'views/ControlButtonQuiz/ControlButtonQuiz';
import QuizProgress from 'views/QuizProgress/QuizProgress';
import quizData from 'constants/quizData';
import { setLocalStorage, getLocalStorage, updateLocalAnswer } from 'util/localStorage';
import './Quiz.css';

function Quiz() {
	const initialState = {
		currentIndexQuestion: 0,
		totalQuestions: quizData.length,
		currentQuestion: {},
		answerSelected: '',
		isRequiredQuestion: false,
		quizStatus: 'pending',
		isLastQuestion: false,
		hasPrevious: false,
		prevIndex: null,
		nextIndex: 1,
		localStorageData: getLocalStorage('answers'),
		progress: 0,
	};
	const [quizMetadata, setquizMetadata] = useState(initialState);
	let quizDataRef = useRef(quizData);
	let individualProgressRef = useRef(100 / quizData.length);

	useEffect(() => {
		statusQuiz();
	}, []);

	const restoreAllRefQuestions = (existingQuestions) => {
		const oldQuizRef = [...quizDataRef.current];
		return oldQuizRef.map((oldQuiz) => {
			const questionAnswered = existingQuestions.find(
				(question) => question.idQuestion === oldQuiz.id
			);
			return Boolean(questionAnswered)
				? {
						...oldQuiz,
						answerSelected: questionAnswered.idAnswer,
						required: false,
				  }
				: oldQuiz;
		});
	};
	const getQuestion = (currentIndexQuestion) => {
		return quizDataRef.current[currentIndexQuestion];
	};
	const getStatusButton = (currentIndexQuestion) => {
		const { totalQuestions } = quizMetadata;
		const prevIndex = currentIndexQuestion > 0 ? currentIndexQuestion - 1 : null;
		const nextIndex =
			totalQuestions - 1 > currentIndexQuestion ? currentIndexQuestion + 1 : null;
		const hasPrevious = currentIndexQuestion > 0;
		return {
			hasPrevious,
			prevIndex,
			nextIndex,
		};
	};
	const setQuestion = (currentQuestion, currentIndexQuestion) => {
		const { totalQuestions } = quizMetadata;
		const { required: isRequiredQuestion } = currentQuestion;
		const statusButtons = getStatusButton(currentIndexQuestion);
		const currentProgress = individualProgressRef.current * (currentIndexQuestion + 1);
		const isLastQuestion = quizDataRef.current.length === currentIndexQuestion + 1;

		setquizMetadata({
			...quizMetadata,
			...statusButtons,
			...(quizMetadata.quizStatus === 'pending' && { quizStatus: 'started' }),
			currentQuestion,
			currentIndexQuestion,
			isRequiredQuestion,
			isLastQuestion,
			progress: currentProgress,
		});
	};
	const restoreQuizFlow = (existingQuestions, lastIndexQuestionAnswered) => {
		quizDataRef.current = restoreAllRefQuestions(existingQuestions);
		const currentQuestion = getQuestion(lastIndexQuestionAnswered);
		setQuestion(currentQuestion, lastIndexQuestionAnswered);
	};
	const statusQuiz = () => {
		const { totalQuestions } = quizMetadata;
		const quizStatus = getLocalStorage('statusQuiz');
		const existingQuestions = getLocalStorage('answers');
		const lastIndexQuestionAnswered = existingQuestions.length - 1;

		if (quizStatus === 'finished') {
			endQuiz();
			return;
		}

		if (Boolean(existingQuestions.length)) {
			restoreQuizFlow(existingQuestions, lastIndexQuestionAnswered);
		}
	};

	const endQuiz = () => {
		setLocalStorage('statusQuiz', 'finished');
		setquizMetadata({
			...quizMetadata,
			localStorageData: getLocalStorage('answers'),
			quizStatus: 'finished',
		});
	};

	const updateSingleRefQuestion = (idQuestion, idAnswer) => {
		const oldQuizRef = [...quizDataRef.current];
		quizDataRef.current = oldQuizRef.map((oldQuiz) => {
			if (oldQuiz.id === idQuestion && oldQuiz.required) {
				return {
					...oldQuiz,
					required: false,
					answerSelected: idAnswer,
				};
			} else {
				return oldQuiz;
			}
		});
	};
	const handlePrevQuestion = (prevIndexNumber) => {
		const currentQuestion = getQuestion(prevIndexNumber);
		setQuestion(currentQuestion, prevIndexNumber);
	};
	const handleNextQuestion = (nextIndexNumber) => {
		const { isLastQuestion } = quizMetadata;
		if (isLastQuestion) {
			endQuiz();
			return;
		}
		const currentQuestion = getQuestion(nextIndexNumber);
		setQuestion(currentQuestion, nextIndexNumber);
	};
	const handleClickAnswer = (idQuestion, idAnswer, answer, score) => {
		const { currentIndexQuestion, isRequiredQuestion } = quizMetadata;
		const currentQuestion = getQuestion(currentIndexQuestion);
		updateLocalAnswer('answers', {
			idQuestion,
			idAnswer,
			answer,
			score,
			text: currentQuestion.text,
		});
		updateSingleRefQuestion(idQuestion, idAnswer);
		setquizMetadata({
			...quizMetadata,
			answerSelected: idAnswer,
			currentQuestion: { ...currentQuestion, answerSelected: idAnswer },
			isRequiredQuestion: isRequiredQuestion && !isRequiredQuestion,
		});
	};
	const handleStartQuiz = () => {
		const { currentIndexQuestion } = quizMetadata;
		const currentQuestion = getQuestion(currentIndexQuestion);
		setLocalStorage('statusQuiz', 'started');
		setQuestion(currentQuestion, currentIndexQuestion);
	};

	if (quizMetadata.quizStatus === 'pending' && !quizDataRef.current) {
		return null;
	}

	return (
		<main className="quizContainer">
			{quizMetadata.quizStatus === 'pending' &&
				quizDataRef.current &&
				!Boolean(quizMetadata.localStorageData.length) && (
					<QuizWelcome onStartQuiz={handleStartQuiz} />
				)}
			{quizMetadata.quizStatus === 'started' && (
				<>
					<QuizProgress progress={quizMetadata.progress} />
					<SwitchTransition mode="out-in">
						<CSSTransition
							key={quizMetadata.currentIndexQuestion}
							timeout={200}
							classNames="fade"
						>
							<QuizQuestion
								{...quizMetadata.currentQuestion}
								onClickAnswer={handleClickAnswer}
							/>
						</CSSTransition>
					</SwitchTransition>
					<ControlButtonQuiz
						onPrevQuestion={handlePrevQuestion}
						onNextQuestion={handleNextQuestion}
						{...quizMetadata}
					/>
				</>
			)}
			{quizMetadata.quizStatus === 'finished' && (
				<QuizScore answers={quizMetadata.localStorageData} />
			)}
		</main>
	);
}

export default Quiz;
