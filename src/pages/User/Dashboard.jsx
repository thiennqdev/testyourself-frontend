import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CourseCard from "./CourseCard";
import { getPublicCourses } from "../../api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [newestQuizzes, setNewestQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedRecents = JSON.parse(localStorage.getItem('recentQuizzes') || '[]');
        setRecentQuizzes(storedRecents);

        const newestRes = await getPublicCourses();
        if (newestRes.data) {
          const sortedNewest = [...newestRes.data].sort((a, b) => b.id - a.id);
          setNewestQuizzes(sortedNewest.slice(0, 4));
        }

      } catch (error) {
        console.error("Failed to fetch newest quizzes:", error);
        toast.error("Failed to load the newest quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      <section className="relative bg-[url('/HeroCenter.png')] bg-cover bg-center h-30 sm:h-40 md:h-50 lg:h-65"></section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Recent Quizzes Section - From localStorage */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-teal-600 font-semibold text-lg">Recently Viewed Quizzes</h2>
                <Link to="/browse">
                  <button className="bg-teal-600 text-white text-xs font-semibold rounded-full px-5 py-1 hover:bg-teal-700">
                    View all
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((course) => (
                    <CourseCard
                      key={`recent-${course.id}`}
                      id={course.id}
                      title={course.title || course.name}
                      description={course.description}
                      image={course.image}
                      isPublished={course.is_published}
                      linkToAction="play"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You haven’t viewed any quizzes recently.</p>
                    <p className="text-sm text-gray-400 mt-2">Start exploring available quizzes!</p>
                    <Link to="/browse">
                      <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">
                        Explore now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Newest Quizzes Section - From API */}
            <section className="mt-24 rounded-lg py-10 px-4 sm:px-6 lg:px-8 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-teal-600 font-semibold text-lg">Newest Quizzes</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {newestQuizzes.length > 0 ? (
                  newestQuizzes.map((course) => (
                    <CourseCard
                      key={`newest-${course.id}`}
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      image={course.image}
                      isPublished={course.is_published}
                      linkToAction="play"
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-10">
                    No new quizzes have been published.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
