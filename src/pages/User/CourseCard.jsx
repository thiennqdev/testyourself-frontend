import React from "react";
import { Link } from "react-router-dom";

// Helper function to add a quiz to the 'recents' list in localStorage
const addQuizToRecents = (courseData) => {
  // Chỉ lưu vào 'recents' khi người dùng nhấn để LÀM BÀI, không phải để sửa
  if (!courseData || !courseData.is_published) {
    return;
  }
  
  try {
    // Lấy danh sách hiện tại từ localStorage, hoặc tạo mảng rỗng nếu chưa có
    const recents = JSON.parse(localStorage.getItem('recentQuizzes') || '[]');
    
    // Xóa quiz này nếu nó đã tồn tại trong danh sách để đưa nó lên đầu
    const updatedRecents = recents.filter(c => c.id !== courseData.id);
    
    // Thêm quiz vừa click vào đầu danh sách (gần đây nhất)
    const newRecents = [courseData, ...updatedRecents];
    
    // Giới hạn danh sách chỉ lưu 8 quiz gần nhất
    const finalRecents = newRecents.slice(0, 8);
    
    // Lưu danh sách mới vào lại localStorage
    localStorage.setItem('recentQuizzes', JSON.stringify(finalRecents));

  } catch (error) {
    console.error("Failed to update recent quizzes in localStorage", error);
  }
};


const CourseCard = ({ id, title, description, image, isPublished, linkToAction }) => {
  
  const getImageUrl = (path) => {
    if (!path) {
      return "https://storage.googleapis.com/a1aa/image/aace060a-8668-4978-5ec8-9f1501f8ce39.jpg";
    }
    return path.startsWith("http") ? path : `http://localhost:5000/${path}`;
  };

  const imageUrl = getImageUrl(image);

  const getDestinationUrl = () => {
    // Ưu tiên 1: Nếu hành động là để LÀM BÀI (từ Browse page hoặc Dashboard)
    if (linkToAction === 'play' || (isPublished && linkToAction !== 'edit')) {
      return `/quiz/${id}`;
    }
    // Mặc định, kể cả bản nháp, là đi đến trang chỉnh sửa
    return `/courses/${id}/quiz-editor`;
  };

  const destinationUrl = getDestinationUrl();

  // Tập hợp dữ liệu của course để lưu vào localStorage
  const courseDataForStorage = { id, title, description, image, is_published: isPublished };

  return (
    <Link
      to={destinationUrl}
      // Khi click, gọi hàm để lưu vào danh sách xem gần đây
      onClick={() => addQuizToRecents(courseDataForStorage)}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
        />
        {isPublished && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
            Published
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base mb-1 text-gray-800 truncate group-hover:text-purple-600">{title}</h3>
        <p className="text-sm leading-tight line-clamp-2 flex-grow text-gray-600">
          {description || "Chưa có mô tả cho khóa học này."}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;