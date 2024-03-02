function Options({ question, dispatch, answer }) {
	const hasAnswerd = answer !== null;
	return (
		<div className="options">
			{question.options.map((opt, index) => (
				<button
					className={`btn btn-option ${index === answer ? "answer" : ""} ${
						hasAnswerd
							? index === question.correctOption
								? "correct"
								: "wrong"
							: ""
					}`}
					key={opt}
					disabled={hasAnswerd}
					onClick={() => dispatch({ type: "newAnswer", payload: index })}
				>
					{opt}
				</button>
			))}
		</div>
	);
}

export default Options;
