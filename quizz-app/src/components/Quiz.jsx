import { useState } from "react";
import Question from "./Question";
import questions from "./../constants/questions.json";
import Result from "./Result";

function Quiz() {
  const [currQuestion, setCurrQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleNextQuestion = (isCorrect) => {
    setCurrQuestion(currQuestion + 1);
    setUserAnswers([...userAnswers, isCorrect]);
  };

  const resetQuiz = () => {
    setCurrQuestion(0);
    setUserAnswers([]);
  };
  return (
    <div className="quiz">
      <h1>World Quiz</h1>
      {currQuestion < questions.length && (
        <Question
          question={questions[currQuestion]}
          onAnswerClick={handleNextQuestion}
        />
      )}
      {currQuestion === questions.length && (
        <Result
          userAnswers={userAnswers}
          questions={questions}
          resetQuiz={resetQuiz}
        />
      )}
    </div>
  );
}

export default Quiz;
