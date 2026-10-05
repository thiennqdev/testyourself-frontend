// --- FILE: src/pages/Admin/AdminQuizzEditor.jsx ---

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Import component dùng để sửa MỘT câu hỏi
import QuizzEditor from '../User/QuizzEditor';

// --- Component hiển thị một câu hỏi trong danh sách (giữ nguyên) ---
function QuestionItem({ question, index, onEdit, onDelete }) {
  // ... (code của component này giữ nguyên như phiên bản trước)
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <p className="text-sm text-gray-500 font-medium">{index + 1}. {question.type === 'multipleChoice' ? 'Multiple Choice' : 'Fill in the Blank'}</p>
          <p className="mt-1 text-gray-800 font-semibold">{question.questionText}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button onClick={() => onEdit(question)} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
          <button onClick={() => onDelete(index)} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash /></button>
        </div>
      </div>
      <div className="mt-3 pl-4 border-l-2 border-gray-200">
        {question.type === 'multipleChoice' ? (
          <ul className="space-y-1 text-sm">
            {question.options.map((opt, i) => (
              <li key={i} className={`flex items-center gap-2 ${opt.correct ? 'text-green-600' : 'text-gray-600'}`}>
                {opt.correct ? <FaCheckCircle /> : <FaTimesCircle className="text-red-400"/>}
                <span>{opt.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-600 font-mono bg-gray-100 p-2 rounded">Correct: {question.correctAnswer}</p>
        )}
      </div>
    </div>
  );
}

// --- Component chính: Quản lý toàn bộ Quiz ---
export default function AdminQuizzEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // Dữ liệu của câu hỏi đang sửa
  const [isEditorOpen, setIsEditorOpen] = useState(false); // Trạng thái của form editor (QuizzEditor)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false); // Trạng thái của modal chọn loại câu hỏi
  const [loading, setLoading] = useState(true);

  // 1. Tải dữ liệu của quiz (giữ nguyên)
  const fetchData = useCallback(async () => {
    // ... (code fetch data giữ nguyên như phiên bản trước)
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseInfo(res.data);
      const parsedQuestions = (res.data.cards || []).map(card => {
        const backData = JSON.parse(card.back || '{}');
        return { id: card.id, questionText: card.front, ...backData };
      });
      setQuestions(parsedQuestions);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load quiz data.");
      navigate('/admin/dashboard');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // --- LOGIC MỚI ĐỂ XỬ LÝ MODAL ---
  // 2. Khi nhấn nút "+ Add Question"
  const handleAddNewQuestionClick = () => {
    setIsTypeModalOpen(true); // Mở modal chọn loại câu hỏi
  };

  // 3. Khi chọn một loại câu hỏi từ modal
  const handleSelectQuestionType = (type) => {
    setIsTypeModalOpen(false); // Đóng modal chọn loại
    setEditingQuestion({ // Chuẩn bị một câu hỏi mới, trống
      type: type,
      questionText: '',
      options: (type === 'multipleChoice') ? [{text:'', correct:false}, {text:'', correct:false}] : [],
      correctAnswer: ''
    });
    setIsEditorOpen(true); // Mở form editor (QuizzEditor)
  };

  // 4. Khi nhấn nút "Edit" trên một câu hỏi đã có
  const handleEditQuestionClick = (questionToEdit) => {
    setEditingQuestion(questionToEdit);
    setIsEditorOpen(true);
  };
  
  // 5. Xử lý khi lưu một câu hỏi từ QuizzEditor
  const handleSaveQuestion = (updatedQuestionData) => {
    // Nếu editingQuestion có 'id' nghĩa là đang sửa câu hỏi cũ
    if (editingQuestion && editingQuestion.id) {
        const updatedQuestions = questions.map(q => 
            q.id === editingQuestion.id ? { ...q, ...updatedQuestionData } : q
        );
        setQuestions(updatedQuestions);
        toast.success("Question updated locally.");
    } else { // Ngược lại là thêm câu hỏi mới
        // Tạo một ID tạm thời cho câu hỏi mới để React có thể quản lý key
        const newQuestionWithId = { ...updatedQuestionData, id: `new-${Date.now()}` };
        setQuestions([...questions, newQuestionWithId]);
        toast.success("Question added locally.");
    }
    setIsEditorOpen(false);
    setEditingQuestion(null);
  };
  
  // 6. Hủy bỏ việc edit/thêm câu hỏi
  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  }

  // 7. Xóa một câu hỏi
  const handleDeleteQuestion = (indexToDelete) => {
    // ... (code giữ nguyên)
    if (window.confirm("Are you sure?")) {
        setQuestions(questions.filter((_, i) => i !== indexToDelete));
        toast.warn("Question removed locally. Click 'Publish Quiz' to save.");
    }
  };

  // 8. Lưu toàn bộ quiz lên server (giữ nguyên)
  const handlePublishQuiz = async () => {
    // ... (code giữ nguyên)
    const token = localStorage.getItem('token');
    try {
        await axios.post(`http://localhost:5000/api/courses/${id}/publish`, { questions }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }});
        toast.success("Quiz published successfully!");
        navigate("/admin/dashboard");
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to publish quiz.");
    }
  };

  if (loading) return <p className="text-center p-8">Loading Quiz Editor...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header (giữ nguyên) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <p className="text-sm text-gray-500">Quiz for: {courseInfo?.name}</p>
                <h1 className="text-3xl font-bold text-gray-800">{questions.length} question(s)</h1>
            </div>
            <div className="flex gap-3">
                <button onClick={handleAddNewQuestionClick} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"><FaPlus /> Add Question</button>
                <button onClick={handlePublishQuiz} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 font-semibold transition">Save Quiz</button>
            </div>
        </div>
        
        {/* Danh sách câu hỏi (giữ nguyên) */}
        <div className="space-y-4">
            {questions.length > 0 ? (
                questions.map((q, i) => <QuestionItem key={q.id || i} question={q} index={i} onEdit={handleEditQuestionClick} onDelete={handleDeleteQuestion} />)
            ) : (
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm border-2 border-dashed"><p className="text-gray-500">This quiz has no questions yet.</p></div>
            )}
        </div>
      </div>
      
      {/* MODAL MỚI: Chọn loại câu hỏi */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose a question type</h2>
            <div className="flex flex-col space-y-3">
              <button onClick={() => handleSelectQuestionType("multipleChoice")} className="w-full text-left p-4 hover:bg-gray-100 rounded-md border border-gray-200">
                <strong className="text-purple-700">Multiple Choice</strong>
                <p className="text-sm text-gray-500 mt-1">Students select one correct answer.</p>
              </button>
              <button onClick={() => handleSelectQuestionType("fillInTheBlank")} className="w-full text-left p-4 hover:bg-gray-100 rounded-md border border-gray-200">
                <strong className="text-purple-700">Fill in the Blank</strong>
                <p className="text-sm text-gray-500 mt-1">Students type the correct answer.</p>
              </button>
            </div>
            <button onClick={() => setIsTypeModalOpen(false)} className="mt-6 w-full border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {/* MODAL CŨ: Form editor (QuizzEditor) */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <QuizzEditor
                initialData={editingQuestion}
                onSave={handleSaveQuestion}
                onCancel={handleCancelEdit}
            />
        </div>
      )}
    </div>
  );
}