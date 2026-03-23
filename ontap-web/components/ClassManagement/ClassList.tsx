import React, { useState, useMemo } from 'react';
import { 
    FaSchool, FaSearch, FaTimes, FaPlus, FaChalkboardTeacher, 
    FaEdit, FaTrash, FaUserTie, FaArrowLeft, FaSort, FaSortAmountDown, FaSortAmountUp,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { Course, UserProfile } from '../../types';

interface ClassListProps {
    courses: Course[];
    loadingCourses: boolean;
    courseSearchTerm: string;
    setCourseSearchTerm: (s: string) => void;
    onSelectCourse: (course: Course) => void;
    onEditCourse: (course: Course, e: React.MouseEvent) => void;
    onDeleteCourse: (id: string) => void;
    onAddCourse: () => void;
    onBack: () => void;
    userProfile: UserProfile;
    headTeacherNames: Record<string, string>;
    creatorProfiles?: Record<string, {name: string, role: string}>;
    licenses: any[];
    canCreateClass: boolean;
}

const safeLower = (s: string | undefined | null) => (s || '').toLowerCase();

const ClassList: React.FC<ClassListProps> = ({
    courses,
    loadingCourses,
    courseSearchTerm,
    setCourseSearchTerm,
    onSelectCourse,
    onEditCourse,
    onDeleteCourse,
    onAddCourse,
    onBack,
    userProfile,
    headTeacherNames,
    creatorProfiles = {},
    licenses,
    canCreateClass
}) => {
    // Local state for sorting and pagination
    const [sortKey, setSortKey] = useState<'name' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const filteredAndSortedCourses = useMemo(() => {
        let result = courses.filter(c => 
            safeLower(c.name).includes(safeLower(courseSearchTerm)) || 
            safeLower(c.description).includes(safeLower(courseSearchTerm))
        );

        result.sort((a, b) => {
            const valA = (a as any)[sortKey] || '';
            const valB = (b as any)[sortKey] || '';
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [courses, courseSearchTerm, sortKey, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
    const paginatedCourses = filteredAndSortedCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: 'name' | 'createdAt') => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                    <FaSchool className="text-teal-600" /> Quản lý Lớp học
                </h1>
                <button 
                    onClick={onBack} 
                    className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors shadow-sm flex items-center gap-2"
                >
                    <FaArrowLeft size={14} /> Quay lại Dashboard
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-end md:items-center">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 group-focus-within:text-teal-500 text-lg transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-teal-500 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-all duration-300"
                        placeholder="Tìm kiếm lớp học theo tên hoặc mô tả..."
                        value={courseSearchTerm}
                        onChange={(e) => {setCourseSearchTerm(e.target.value); setCurrentPage(1);}}
                    />
                    {courseSearchTerm && (
                        <button
                            onClick={() => {setCourseSearchTerm(''); setCurrentPage(1);}}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-gray-500 hidden sm:block">Sắp xếp:</span>
                    <button 
                        onClick={() => handleSort('name')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${sortKey === 'name' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50 border border-gray-200 dark:border-slate-700'}`}
                    >
                        Tên {sortKey === 'name' && (sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                    </button>
                    <button 
                        onClick={() => handleSort('createdAt')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${sortKey === 'createdAt' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50 border border-gray-200 dark:border-slate-700'}`}
                    >
                        Mới nhất {sortKey === 'createdAt' && (sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                    </button>
                    {canCreateClass && (
                        <button 
                            onClick={onAddCourse} 
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold ml-2"
                        >
                            <FaPlus /> Thêm Lớp
                        </button>
                    )}
                </div>
            </div>

            {/* Course List Content */}
            {loadingCourses ? (
                <div className="p-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 animate-pulse">Đang tải danh sách lớp học...</p>
                </div>
            ) : paginatedCourses.length === 0 ? (
                <div className="text-center p-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl max-w-2xl mx-auto">
                    <div className="bg-gray-50 dark:bg-slate-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaSchool className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Chưa tìm thấy lớp học nào</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo lớp học mới.</p>
                    {canCreateClass && (
                        <button 
                            onClick={onAddCourse} 
                            className="bg-teal-600 text-white px-8 py-3 rounded-2xl hover:bg-teal-700 shadow-lg transition font-bold"
                        >
                            Tạo Lớp Học Đầu Tiên
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedCourses.map((course, idx) => {
                            const currentRole = userProfile?.role || 'hoc_vien';
                            const canEditThis = ['admin', 'quan_ly', 'lanh_dao'].includes(currentRole) || 
                                              (currentRole === 'giao_vien' && (course.headTeacherId === userProfile?.id || (course.teacherIds || []).includes(userProfile?.id)));
                            const canDeleteThis = ['admin', 'quan_ly', 'lanh_dao'].includes(currentRole);

                            return (
                                <div
                                    key={course.id}
                                    onClick={() => onSelectCourse(course)}
                                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col relative animate-fade-in"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    {(canEditThis || canDeleteThis) && (
                                        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canEditThis && (
                                                <button
                                                    onClick={(e) => onEditCourse(course, e)}
                                                    className="p-2.5 bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 rounded-xl shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                    title="Sửa lớp"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                            )}
                                            {canDeleteThis && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                                                    className="p-2.5 bg-white/90 dark:bg-slate-800/90 text-red-600 dark:text-red-400 rounded-xl shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                    title="Xóa lớp"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div className="h-40 bg-gradient-to-br from-teal-500 to-emerald-600 relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        <FaChalkboardTeacher className="text-white/20 w-28 h-28 transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-bold text-xl text-white truncate drop-shadow-md">{course.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {course.licenseId && (
                                                    <span className="text-[10px] font-bold text-teal-100 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {licenses.find(l => l.id === course.licenseId)?.name || course.licenseId}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-bold text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
                                                    ID: {course.id.slice(0, 8)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                                            {course.description || 'Chưa có mô tả chi tiết cho lớp học này.'}
                                        </p>
                                        <div className="flex justify-between items-center pt-5 border-t border-gray-50 dark:border-slate-700">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                                    <FaUserTie className="text-blue-600" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-tighter">GV Chủ nhiệm</span>
                                                    <span className="text-sm font-bold truncate block dark:text-white">
                                                        {course.headTeacherId ? (headTeacherNames[course.headTeacherId] || '...') : 'Chưa phân công'}
                                                    </span>
                                                    {course.createdBy && creatorProfiles[course.createdBy] && (
                                                        <div className="flex items-center gap-1.5 mt-1 border-t border-gray-100 dark:border-slate-700/50 pt-1">
                                                            <span className="text-[9px] text-gray-400 uppercase font-bold">Người tạo:</span>
                                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate max-w-[80px]" title={creatorProfiles[course.createdBy].name}>
                                                              {creatorProfiles[course.createdBy].name}
                                                            </span>
                                                            <span className={`px-1.5 py-[1px] border rounded text-[8px] font-bold ${
                                                              creatorProfiles[course.createdBy].role === 'admin' ? 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800' :
                                                              creatorProfiles[course.createdBy].role === 'lanh_dao' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                                              creatorProfiles[course.createdBy].role === 'quan_ly' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                                              'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                                            }`}>
                                                              {creatorProfiles[course.createdBy].role === 'admin' ? 'Admin' :
                                                               creatorProfiles[course.createdBy].role === 'lanh_dao' ? 'Lãnh đạo' :
                                                               creatorProfiles[course.createdBy].role === 'quan_ly' ? 'Quản lý' : 'Giáo viên'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-teal-600 font-bold text-sm bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                Quản lý <FaArrowLeft className="rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <span className="text-sm text-gray-500">
                                Hiển thị <span className="font-bold text-gray-800 dark:text-gray-200">{paginatedCourses.length}</span> trong <span className="font-bold text-gray-800 dark:text-gray-200">{filteredAndSortedCourses.length}</span> lớp học
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <FaChevronLeft />
                                </button>
                                <div className="flex gap-1.5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page ? 'bg-teal-600 text-white shadow-lg scale-110' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-teal-500'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                            <select 
                                value={itemsPerPage}
                                onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                                className="bg-transparent border-gray-200 dark:border-slate-700 text-sm font-medium rounded-xl focus:ring-teal-500 outline-none p-1.5"
                            >
                                <option value={6}>6 lớp / trang</option>
                                <option value={9}>9 lớp / trang</option>
                                <option value={12}>12 lớp / trang</option>
                                <option value={24}>24 lớp / trang</option>
                            </select>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ClassList;
