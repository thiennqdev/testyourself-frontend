import React from 'react';

const QuestionCard = ({ question, index, onEdit, onDelete }) => {
  const getQuestionTypeName = (type) => {
    if (type === 'multipleChoice') return 'Multiple Choice';
    if (type === 'fillInTheBlank') return 'Fill in the Blank';
    return 'Unknown';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Question Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
        <div className="flex items-center gap-3 text-sm">
          <i className="fas fa-grip-vertical text-gray-400 cursor-move" title="Drag to reorder"></i>
          <span className="font-semibold">
            {index + 1}. {getQuestionTypeName(question.type)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <button className="p-2 hover:bg-gray-100 rounded" title="Duplicate">
            <i className="far fa-copy"></i>
          </button>
          <button 
            onClick={() => onEdit(question)} 
            className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200" 
            title="Edit"
          >
            <i className="fas fa-pencil-alt"></i>
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 hover:bg-gray-100 rounded text-xs"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="pl-6">
        <p className="font-semibold text-gray-800 mb-2">{question.questionText}</p>

        {/* Options for multiple choice */}
        {question.type === 'multipleChoice' && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 mb-1">Answer choices</p>
            {question.options && question.options.map((option, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm ${option.correct ? 'text-green-600' : 'text-red-600'}`}
              >
                {option.correct ? '✓' : '✗'}
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Answer for fill in the blank */}
        {question.type === 'fillInTheBlank' && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 mb-1">Correct Answer</p>
            <p className="text-sm text-green-600 font-mono bg-green-50 p-2 rounded inline-block">
              {question.correctAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
