import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, addQuestionToCourse, getCardsForCourse, publishQuiz } from "../../api"; 
import { toast } from "react-toastify";
import QuizzEditor from './QuizzEditor';
import QuestionCard from './QuestionCard';

const QuizizzPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionType, setNewQuestionType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to access this page.");
      navigate('/login', { replace: true });
      return;
    }

    const loadPageData = async () => {
      try {
        setIsLoading(true);
        const [courseRes, questionsRes] = await Promise.all([
          getCourseById(id),
          getCardsForCourse(id)
        ]);
        
        setCourse(courseRes.data);

        const parsedQuestions = questionsRes.data.map(card => {
          try {
            const backData = JSON.parse(card.back);
            return {
              id: card.id,
              questionText: card.front,
              ...backData
            };
          } catch (e) {
            return { id: card.id, questionText: card.front, type: 'unknown' };
          }
        });
        setQuestions(parsedQuestions);

      } catch (err) {
        console.error("Failed to load page data:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          toast.error("Invalid session. Please log in again.");
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          toast.error("Failed to load course data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [id, navigate]);

  const handleAddNewQuestionClick = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSelectQuestionType = (type) => {
    setNewQuestionType(type);
    setIsEditing(true);
    closeModal();
  };

  const handleSaveQuestion = (questionData) => {
    if (editingQuestion) {
      const updatedQuestions = questions.map(q =>
        q.id === editingQuestion.id ? { ...q, ...questionData } : q
      );
      setQuestions(updatedQuestions);
      toast.success("Question updated!");
    } else {
      toast.promise(
        addQuestionToCourse(id, questionData).then(res => {
          const savedCard = res.data.card;
          const backData = JSON.parse(savedCard.back);
          const newQuestion = {
            id: savedCard.id,
            questionText: savedCard.front,
            ...backData
          };
          setQuestions(prev => [...prev, newQuestion]);
        }),
        {
          pending: "Saving question...",
          success: "Question saved!",
          error: "Error! Failed to save question."
        }
      );
    }
    setIsEditing(false);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q.id !== questionId));
      toast.info("Question deleted.");
    }
  };

  const handleEditQuestion = (questionToEdit) => {
    setEditingQuestion(questionToEdit);
    setIsEditing(true);
  };

  const handlePublish = () => {
    if (questions.length === 0) {
      toast.error("You can't publish a quiz without questions.");
      return;
    }
    if (window.confirm("After publishing, you will no longer be able to add or delete questions in this session. Are you sure?")) {
      toast.promise(
        publishQuiz(id, questions).then(() => {
          setTimeout(() => navigate('/courses'), 1500);
        }),
        {
          pending: "Publishing quiz...",
          success: "Published successfully! Redirecting...",
          error: "Failed to publish quiz."
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans text-gray-900 min-h-screen pb-20">
      <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Link to="/courses" className="p-2 rounded border border-gray-300 hover:bg-gray-100">
            <i className="fas fa-arrow-left text-gray-700"></i>
          </Link>
          <span className="text-sm font-semibold">Quiz for: {course?.name || "..."}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded px-4 py-2"
          >
            Publish Quiz
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{questions.length} question(s)</h2>
          <button
            onClick={handleAddNewQuestionClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
          >
            + Add Question
          </button>
        </div>

        {!isEditing && (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          {isEditing ? (
            <QuizzEditor
              questionType={editingQuestion ? editingQuestion.type : newQuestionType}
              onSave={handleSaveQuestion}
              onCancel={handleCancelEdit}
              initialData={editingQuestion}
            />
          ) : (
            questions.length > 0 && (
              <div className="text-center">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 hover:border-gray-500"
                  onClick={handleAddNewQuestionClick}
                >
                  + Add Another Question
                </button>
              </div>
            )
          )}
        </div>

        {!isEditing && questions.length === 0 && (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Start building your quiz!</h3>
            <p className="text-gray-500 mt-2 mb-4">Click the "Add Question" button to create your first one.</p>
            <button
              type="button"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
              onClick={handleAddNewQuestionClick}
            >
              + Add Question
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose a question type</h2>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleSelectQuestionType("multipleChoice")}
                className="w-full text-left p-4 hover:bg-gray-100 rounded-md border border-gray-200"
              >
                <strong className="text-purple-700">Multiple Choice</strong>
                <p className="text-sm text-gray-500 mt-1">Students select one or more correct answers.</p>
              </button>
              <button
                onClick={() => handleSelectQuestionType("fillInTheBlank")}
                className="w-full text-left p-4 hover:bg-gray-100 rounded-md border border-gray-200"
              >
                <strong className="text-purple-700">Fill in the Blank</strong>
                <p className="text-sm text-gray-500 mt-1">Students type the correct answer.</p>
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizizzPage;
