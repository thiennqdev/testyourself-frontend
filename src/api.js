import axios from "axios";

// Tạo instance axios với baseURL linh hoạt
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor để tự động đính kèm token vào mỗi request yêu cầu xác thực
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ===================================================================
// === CÁC ROUTE CẦN XÁC THỰC (Protected Routes) ===
// ===================================================================

// --- API cho Khóa học (của người dùng) ---

export const getAllCourses = () => {
  return API.get("/courses", {
    headers: { 'Cache-Control': 'no-cache' },
  });
};

export const getCourseById = (id) => {
  return API.get(`/courses/${id}`);
};

export const createCourse = (formData) => {
  return API.post("/courses", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCourse = (id, formData) => {
  return API.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteCourse = (id) => {
  return API.delete(`/courses/${id}`);
};

export const publishQuiz = (courseId, questions) => {
  return API.post(`/courses/${courseId}/publish`, { questions });
};


// --- API cho Câu hỏi (của người dùng) ---

export const getCardsForCourse = (courseId) => {
    return API.get(`/courses/${courseId}/cards`);
};

export const addQuestionToCourse = (courseId, questionData) => {
  return API.post(`/courses/${courseId}/cards`, questionData);
};


// ===================================================================
// === CÁC ROUTE CÔNG KHAI (Public Routes) ===
// ===================================================================

export const getPublicCourses = () => {
  return API.get("/courses/public");
};

export const getPublicQuizDetail = (courseId) => {
  return API.get(`/public/quiz/${courseId}`);
};

export const getPublicQuizQuestions = (courseId) => {
  return API.get(`/public/quiz/${courseId}/questions`);
};

export const submitQuiz = (courseId, answers) => {
  return API.post(`/public/quiz/${courseId}/submit`, { answers });
};

export const getRecentQuizzes = () => {
  return API.get('/quizzes/recent-attempts'); 
};


// Export instance API nếu muốn sử dụng trực tiếp ở nơi khác
export default API;