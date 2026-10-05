import React, { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const QuizComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { result, answers: userAnswers, questions } = location.state || {};

  useEffect(() => {
    if (!result && (!userAnswers || !questions)) {
      console.error("Quiz data not found. Redirecting...");
      navigate('/dashboard', { replace: true });
    }
  }, [result, userAnswers, questions, navigate]);

  const { correctAnswers, totalQuestions, scorePercent } = useMemo(() => {
    if (result) {
      return {
        correctAnswers: result.correctAnswers ?? 0,
        totalQuestions: result.totalQuestions ?? (questions?.length || 0),
        scorePercent: result.scorePercent ?? 0,
      };
    }

    if (!userAnswers || !questions || questions.length === 0) {
      return { correctAnswers: 0, totalQuestions: 0, scorePercent: 0 };
    }

    let correctCount = 0;

    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      if (question.type === 'multipleChoice') {
        const correctOption = question.options.find(opt => opt.correct === true);
        if (correctOption && correctOption.text === userAnswer) {
          correctCount++;
        }
      } else if (question.type === 'fillInTheBlank') {
        if (question.correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      }
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    return {
      correctAnswers: correctCount,
      totalQuestions: total,
      scorePercent: percentage,
    };
  }, [userAnswers, questions]);

  if (!userAnswers || !questions) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col justify-center items-center">
          <p>Loading your result...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header current="My Courses" />

      <main className="flex-grow flex flex-col justify-center items-center px-6 py-12 text-center bg-[#E9F0F5]">
        <img 
          src="/CongratsBro.png" 
          alt="Congratulations" 
          className="w-48 h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="font-semibold text-2xl mb-2 text-gray-700">Congratulations!</h2>
        <p className="text-sm text-[#8B9AB1] mb-6">
          You have completed this quiz.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">🎉 Your Result</h1>
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E0E0E0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1AA99F"
                  strokeWidth="3"
                  strokeDasharray={`${scorePercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#1AA99F]">
                {scorePercent}%
              </div>
            </div>
          </div>

          <div className="text-gray-600 mb-8">
            You answered <span className="font-semibold">{correctAnswers}</span> out of <span className="font-semibold">{totalQuestions}</span> questions correctly.
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#1AA99F] text-white rounded-full px-6 py-2 hover:bg-[#178a87] transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="border border-[#1AA99F] text-[#1AA99F] rounded-full px-6 py-2 hover:bg-[#d0f0ef] transition"
            >
              Browse More Quizzes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizComplete;
