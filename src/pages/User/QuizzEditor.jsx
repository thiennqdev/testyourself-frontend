import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100'];

export default function QuizzEditor({ questionType, onSave, onCancel, initialData = null }) {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [blankAnswer, setBlankAnswer] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.questionText || '');
      if (initialData.type === 'multipleChoice') {
        setAnswers(JSON.parse(JSON.stringify(initialData.options || [])));
      } else if (initialData.type === 'fillInTheBlank') {
        setBlankAnswer(initialData.correctAnswer || '');
      }
    } else {
      setQuestion('');
      setAnswers([{ text: '', correct: false }, { text: '', correct: false }]);
      setBlankAnswer('');
      setQuestionImage(null);
      setImagePreview(null);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setQuestionImage(null);
    setImagePreview(null);
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index].text = value;
    setAnswers(updated);
  };

  const toggleCorrect = (index) => {
    const updatedAnswers = answers.map((answer, i) => ({
      ...answer,
      correct: i === index ? !answer.correct : false,
    }));
    setAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    if (answers.length < 5) {
      setAnswers([...answers, { text: '', correct: false }]);
    } else {
      toast.warn("Maximum 5 options");
    }
  };

  const deleteAnswer = (index) => {
    if (answers.length <= 2) {
      toast.error("Must be at least 2 options");
      return;
    }
    const updated = answers.filter((_, i) => i !== index);
    setAnswers(updated);
  };

  const handleSaveClick = () => {
    if (!question.trim()) {
      toast.error("Question content must not be empty.");
      return;
    }

    const questionData = {
      type: initialData ? initialData.type : questionType,
      questionText: question,
      options: answers,
      correctAnswer: blankAnswer,
      imageFile: questionImage,
    };
    onSave(questionData);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 space-y-6 border-2 border-purple-300">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">
          {initialData ? 'Edit Question' : `Create Question: ${questionType === 'multipleChoice' ? 'Multiple Choice' : 'Fill in the Blank'}`}
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm">
            Cancel
          </button>
          <button onClick={handleSaveClick} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm">
            Save Question
          </button>
        </div>
      </div>

      <div>
        <label className="block text-gray-600 mb-1 font-medium">Question Content</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: What does HTML stand for?"
          className="w-full bg-black text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {imagePreview && (
        <div className="relative border rounded-md p-2">
          <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain rounded-md bg-gray-100" />
          <button onClick={removeImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-lg hover:bg-opacity-75">×</button>
        </div>
      )}

      {(initialData ? initialData.type : questionType) === 'multipleChoice' && (
        <div className="space-y-4">
          <label className="block text-gray-600 font-medium">Answer Choices (Select 1 correct answer)</label>
          {answers.map((ans, i) => (
            <div key={i} className={`relative p-4 rounded-lg border border-gray-200 ${colors[i % colors.length]}`}>
              <textarea
                value={ans.text}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                placeholder={`Choice ${i + 1}`}
                className="w-full bg-transparent resize-none outline-none text-gray-700"
              />
              <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
                <button onClick={() => toggleCorrect(i)} className="text-xl" title="Mark as correct">
                  {ans.correct ? '✅' : '⭕'}
                </button>
                <button onClick={() => deleteAnswer(i)} className="text-xl" title="Delete choice">
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4">
            {answers.length < 5 && (
              <button onClick={addAnswer} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
                + Add Choice
              </button>
            )}
            <label htmlFor="question-image-upload" className="cursor-pointer p-2 rounded-md text-gray-500 hover:bg-gray-200" title="Attach image">
              <i className="fas fa-paperclip text-lg"></i>
            </label>
          </div>
        </div>
      )}

      {(initialData ? initialData.type : questionType) === 'fillInTheBlank' && (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Correct Answer</label>
            <input
              type="text"
              value={blankAnswer}
              onChange={(e) => setBlankAnswer(e.target.value)}
              placeholder="Enter the exact correct answer"
              className="w-full bg-black text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="question-image-upload" className="cursor-pointer p-2 rounded-md text-gray-500 hover:bg-gray-200" title="Attach image">
              <i className="fas fa-paperclip text-lg"></i>
            </label>
          </div>
        </div>
      )}

      <input
        id="question-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        key={imagePreview || ''}
      />
    </div>
  );
}
