/* eslint-disable react/prop-types */
function Question({ question, onAnswerClick }) {
  console.log(question);
  return (
    <div className="questions">
      <h2 className="question-title">{question.question}</h2>

      <ul className="answers">
        {question.answerOptions.map((option) => (
          <li key={option.text} className="answer">
            <button
              className="answerBtn"
              type="button"
              onClick={() => onAnswerClick(option.isCorrect)}
            >
              {option.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Question;
