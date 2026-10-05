import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CourseCard from "./CourseCard";
import { getAllCourses, createCourse, deleteCourse, updateCourse } from "../../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `http://localhost:5000/${path}`;
  };

  const fetchCourses = () => {
    getAllCourses()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Invalid data:", res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    deleteCourse(id)
      .then(() => {
        toast.success("Quiz deleted successfully!");
        try {
          const recents = JSON.parse(localStorage.getItem('recentQuizzes') || '[]');
          const updatedRecents = recents.filter(course => course.id !== id);
          localStorage.setItem('recentQuizzes', JSON.stringify(updatedRecents));
        } catch (error) {
          console.error("Error updating localStorage:", error);
        }
        fetchCourses();
      })
      .catch(() => toast.error("Failed to delete quiz!"));
  };

  const resetAndHideForm = () => {
    setShowAdd(false);
    setEditingCourse(null);
    setNewTitle('');
    setNewDescription('');
    setImage(null);
    setImagePreview(null);
  };

  const handleAddCourse = () => {
    if (!newTitle.trim()) {
      toast.error("Course title cannot be empty.");
      return;
    }
    const formData = new FormData();
    formData.append("name", newTitle);
    formData.append("description", newDescription);
    if (image) formData.append("image", image);
    createCourse(formData)
      .then(() => {
        toast.success("Quiz created successfully!");
        resetAndHideForm();
        fetchCourses();
      })
      .catch(() => toast.error("Failed to create quiz!"));
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowAdd(false);
    setNewTitle(course.name);
    setNewDescription(course.description);
    setImagePreview(getFullImageUrl(course.image));
    setImage(null);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleUpdateCourse = () => {
    if (!newTitle.trim()) {
      toast.error("Course title cannot be empty.");
      return;
    }
    const formData = new FormData();
    formData.append("name", newTitle);
    formData.append("description", newDescription);
    if (image) formData.append("image", image);
    updateCourse(editingCourse.id, formData)
      .then(() => {
        toast.success("Quiz updated successfully!");
        resetAndHideForm();
        fetchCourses();
      })
      .catch(() => toast.error("Failed to update quiz!"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header current="My Quizzes" />

      <section className="relative bg-[url('/HeroCenter2.png')] bg-cover bg-center h-30 sm:h-40 md:h-50 lg:h-65">
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg"></h1>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My Quizzes</h2>
          <button
            onClick={() => {
              setShowAdd(true);
              setEditingCourse(null);
              setNewTitle('');
              setNewDescription('');
              setImage(null);
              setImagePreview(null);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition flex items-center gap-2"
          >
            <span className="font-bold text-lg">+</span> Add a Quiz
          </button>
        </div>

        {(showAdd || editingCourse) && (
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
              {editingCourse ? 'Edit Quiz' : 'Create New Quiz'}
            </h3>
            <input
              type="text"
              placeholder="Quiz title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              placeholder="Quiz description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded resize-y focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Image preview" className="w-full h-48 object-cover rounded" />
              </div>
            )}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={resetAndHideForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              {editingCourse ? (
                <button
                  onClick={handleUpdateCourse}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleAddCourse}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        )}

        <section>
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading...</p>
          ) : (
            courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="relative group bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                    <CourseCard
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      image={course.image}
                      isPublished={course.is_published}
                      linkToAction="edit"
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="px-3 py-1 text-xs bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showAdd && !editingCourse && (
                <div className="text-center mt-16 py-10 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-600 font-medium">You haven't created any quizzes yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click the "Add a Quiz" button to get started.
                  </p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="mt-6 px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                  >
                    Create Quiz Now
                  </button>
                </div>
              )
            )
          )}
        </section>
      </main>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CourseList;
