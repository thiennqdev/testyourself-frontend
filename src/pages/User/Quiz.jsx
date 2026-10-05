import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicQuizDetail, getPublicQuizQuestions, submitQuiz } from '../../api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimeLeft(30);
    } else {
      handleSubmitQuiz();
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [courseRes, questionsRes] = await Promise.all([
          getPublicQuizDetail(id),
          getPublicQuizQuestions(id)
        ]);

        setCourse(courseRes.data);
        const parsedQuestions = questionsRes.data.map(card => {
          const backData = JSON.parse(card.back);
          return { id: card.id, questionText: card.front, ...backData };
        });
        setQuestions(parsedQuestions);

        if (parsedQuestions.length === 0) {
          toast.error("This quiz has no questions.");
          navigate('/browse');
        }

      } catch (error) {
        console.error("Failed to load public quiz data:", error);
        toast.error("Failed to load quiz. It may not exist or hasn’t been published.");
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    if (timeLeft <= 0) {
      toast.info("Time's up! Moving to the next question.");
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleNextQuestion, questions]);

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setTimeLeft(30);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await submitQuiz(id, userAnswers);
      toast.success("You’ve completed the quiz!");
      navigate(`/quiz/${id}/complete`, {
        state: { 
          result: res.data,
          answers: userAnswers, 
          questions: questions 
        }
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      toast.error("Failed to evaluate quiz on server. Displaying results locally.");
      navigate(`/quiz/${id}/complete`, {
        state: { answers: userAnswers, questions: questions }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !questions.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        Preparing your quiz...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Quiz Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
              <div className="flex items-center gap-2">
                <i className="far fa-clock"></i>
                <span>{timeLeft}s</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{currentQuestion.questionText}</h2>
          </div>

          {/* Answer Area */}
          {currentQuestion.type === 'multipleChoice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.text)}
                  className={`p-4 rounded-lg text-left text-gray-900 font-semibold border-2 transition-transform transform hover:scale-105 ${
                    userAnswers[currentQuestion.id] === option.text
                      ? 'border-purple-600 bg-purple-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fillInTheBlank' && (
            <div className="flex justify-center">
              <input
                type="text"
                value={userAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer..."
                className="w-full md:w-3/4 p-4 border-2 border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
