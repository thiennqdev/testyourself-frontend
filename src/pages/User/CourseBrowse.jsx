import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CourseCard from './CourseCard'; // Reusing CourseCard component
import { getPublicCourses } from '../../api'; // Import API function
import { toast } from 'react-toastify'; // For error notifications

const CoursesBrowse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicCourses()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch public courses:", err);
        toast.error("Failed to load course list.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header current="Browse Quizzes" />

      <section className="bg-gray-100 relative px-10 py-10 md:py-16 md:px-20 overflow-hidden">
        <p className="max-w-4xl text-gray-700 text-base md:text-lg leading-relaxed">
          Browse the quizzes below. Click on one to view its details. If you're interested, take the quizz
          and it will be added to your "Recently Viewed Quizzes" list
        </p>
        <img
          alt="Notice Man"
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 top-1/2 -translate-y-1/2 opacity-100 w-30 h-30 md:w-40 md:h-40"
          height="160"
          src="https://www.kindpng.com/picc/m/121-1214526_man-with-symbol-exclamation-mark-man-png-transparent.png"
          width="160"
        />
      </section>

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-12">
        <section>
          <h2 className="font-semibold text-teal-600 mb-6">All Published Quizzes</h2>
          
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Loading quizzes...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-6">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      image={course.image}
                      isPublished={course.is_published}
                      linkToAction="play" // Navigate to quiz play page
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-10">
                    No quizzes have been published yet.
                  </p>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-20">
                <span>1 - {courses.length} / {courses.length}</span>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesBrowse;
