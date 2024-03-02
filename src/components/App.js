import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Options from "./Options";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

export default function App() {
	const initialState = {
		questions: [],
		//"loading","error","ready","active","finished"
		status: "loading",
		index: 0,
		answer: null,
		points: 0,
		highScore: 0,
		secondsRemaining: null,
	};
	const SECS_PER_QUESTION = 30;
	function reducer(state, action) {
		switch (action.type) {
			case "dataRecived":
				return { ...state, questions: action.payload, status: "ready" };
			case "dataFaild":
				return { ...state, status: "error" };
			case "start":
				return {
					...state,
					status: "active",
					secondsRemaining: state.questions.length * SECS_PER_QUESTION,
				};
			case "newAnswer":
				const question = state.questions.at(state.index);
				console.log(question);
				return {
					...state,
					answer: action.payload,
					points:
						action.payload === question.correctOption
							? state.points + question.points
							: state.points,
				};
			case "nextQuestion":
				return { ...state, index: state.index + 1, answer: null };
			case "finish":
				return {
					...state,
					status: "finished",
					highScore:
						state.points > state.highScore ? state.points : state.highScore,
				};
			case "restart":
				return {
					...state,
					...initialState,
					status: "ready",
					questions: state.questions,
				};
			case "tick":
				return {
					...state,
					secondsRemaining: state.secondsRemaining - 1,
					status: state.secondsRemaining === 0 ? "finished" : state.status,
				};
			default:
				throw new Error("unKnown Error");
		}
	}
	const [
		{ questions, status, index, answer, points, highScore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);

	useEffect(() => {
		fetch("http://localhost:9000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataRecived", payload: data }))
			.catch((err) => dispatch({ type: "dataFaild" }));
	}, []);
	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0
	);
	return (
		<div className="app">
			<Header></Header>
			<Main>
				{status === "loading" && <Loader></Loader>}
				{status === "error" && <Error></Error>}
				{status === "ready" && (
					<StartScreen
						dispatch={dispatch}
						numQuestions={questions.length}
					></StartScreen>
				)}
				{status === "active" && (
					<>
						<Progress
							points={points}
							numQuestions={numQuestions}
							index={index}
							maxPossiblePoints={maxPossiblePoints}
							answer={answer}
						></Progress>
						<Question question={questions[index]}>
							<Options
								question={questions[index]}
								dispatch={dispatch}
								answer={answer}
							></Options>
						</Question>
						<Footer>
							<Timer
								secondsRemaining={secondsRemaining}
								dispatch={dispatch}
							></Timer>
							<NextButton
								index={index}
								numQuestions={numQuestions}
								dispatch={dispatch}
								answer={answer}
							></NextButton>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						maxPossiblePoints={maxPossiblePoints}
						highScore={highScore}
						dispatch={dispatch}
					></FinishScreen>
				)}
			</Main>
		</div>
	);
}
