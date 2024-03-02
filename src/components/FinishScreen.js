function FinishScreen({ dispatch, points, maxPossiblePoints, highScore }) {
	const precentage = (points / maxPossiblePoints) * 100;

	return (
		<>
			<p className="result">
				You Scored <strong>{points}</strong> Out of {maxPossiblePoints} (
				{Math.ceil(precentage)} %)
			</p>
			<p className="highscore">(HighScore: {highScore} points)</p>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "restart" })}
			>
				Restart Quiz
			</button>
		</>
	);
}

export default FinishScreen;
