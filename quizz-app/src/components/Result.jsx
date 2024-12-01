/* eslint-disable react/prop-types */
function Result({ userAnswers, questions, resetQuiz }) {
  const correctAnswers = userAnswers.filter((a) => a).length;

  return (
    <div className="result">
      <h2>Results</h2>
      <p>
        You answered {correctAnswers} out of {questions.length} questions
      </p>
      <button onClick={resetQuiz}>Reset Quiz</button>
      <ul>
        {questions.map((question, index) => {
          return (
            <>
              <li
                className="result-question"
                key={index}
                data-correct={userAnswers[index]}
              >
                Q-{index + 1}. {question.question}.{" "}
              </li>
              <span>
                {question.answerOptions
                  .filter((op) => op.isCorrect)
                  .map((op) => op.text)}
              </span>
            </>
          );
        })}
      </ul>
    </div>
  );
}

export default Result;
