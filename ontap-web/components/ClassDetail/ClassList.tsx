import React, { useState, useMemo, useEffect } from 'react';
import {      FaSchool, FaSearch, FaTimes, FaPlus, FaChalkboardTeacher,      FaEdit, FaTrash, FaUserTie, FaArrowLeft, FaSortAmountDown, FaSortAmountUp,     FaChevronLeft, FaChevronRight, FaUsers, FaThLarge, FaList } from 'react-icons/fa'; 

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
    classStats?: Record<string, number>;
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
    canCreateClass,
    classStats = {}
}) => {
    // Local state for sorting and pagination
    const [sortKey, setSortKey] = useState<'name' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    
    // New state for filters and views
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finished'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
        const saved = localStorage.getItem('classManagerViewMode');
        return (saved as 'grid' | 'list') || 'grid';
    });

    useEffect(() => {
        localStorage.setItem('classManagerViewMode', viewMode);
    }, [viewMode]);

    const filteredAndSortedCourses = useMemo(() => {
        let result = courses.filter(c => 
            safeLower(c.name).includes(safeLower(courseSearchTerm)) || 
            safeLower(c.description).includes(safeLower(courseSearchTerm))
        );

        if (statusFilter !== 'all') {
            result = result.filter(c => (c.status || 'active') === statusFilter);
        }

        result.sort((a, b) => {
            const valA = (a as any)[sortKey] || '';
            const valB = (b as any)[sortKey] || '';
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [courses, courseSearchTerm, sortKey, sortOrder, statusFilter]);

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

    // Insights Calculations
    const activeClassesCount = courses.filter(c => (c.status || 'active') === 'active').length;
    const totalStudents = Object.values(classStats).reduce((a, b) => a + b, 0);

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

            {/* Insights Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xl">
                        <FaSchool />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng số lớp học</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{courses.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                        <FaUsers />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng số học viên</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalStudents}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                        <div className="relative">
                            <FaSchool />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Đang hoạt động</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{activeClassesCount}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col xl:flex-row gap-4 mb-8 items-stretch xl:items-center">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 group-focus-within:text-teal-500 text-lg transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-teal-500 rounded-xl shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-all duration-300"
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

                <div className="flex flex-wrap gap-2 items-center">
                    {/* Status Filters */}
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                        {(['all', 'active', 'finished'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => {setStatusFilter(status); setCurrentPage(1);}}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === status ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                {status === 'all' ? 'Tất cả' : status === 'active' ? 'Hoạt động' : 'Đã kết thúc'}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

                    <button 
                        onClick={() => handleSort('name')}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${sortKey === 'name' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800' : 'bg-white dark:bg-slate-800 text-gray-600 border border-gray-200 dark:border-slate-700'}`}
                    >
                        Tên {sortKey === 'name' && (sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                    </button>
                    <button 
                        onClick={() => handleSort('createdAt')}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${sortKey === 'createdAt' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800' : 'bg-white dark:bg-slate-800 text-gray-600 border border-gray-200 dark:border-slate-700'}`}
                    >
                        Mới nhất {sortKey === 'createdAt' && (sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />)}
                    </button>

                    <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="Grid View">
                            <FaThLarge />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="List View">
                            <FaList />
                        </button>
                    </div>

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
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Hãy thử thay đổi từ khóa hoặc bộ lọc, hoặc tạo lớp học mới.</p>
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
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {paginatedCourses.map((course, idx) => {
                            const currentRole = userProfile?.role || 'hoc_vien';
                            const canEditThis = ['admin', 'quan_ly', 'lanh_dao'].includes(currentRole) || 
                                              (currentRole === 'giao_vien' && (course.headTeacherId === userProfile?.id || (course.teacherIds || []).includes(userProfile?.id)));
                            const canDeleteThis = ['admin', 'quan_ly', 'lanh_dao'].includes(currentRole);

                            if (viewMode === 'list') {
                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => onSelectCourse(course)}
                                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden cursor-pointer transition-all duration-200 flex items-center p-4 gap-4 animate-fade-in group"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center relative overflow-hidden">
                                            {course.avatarUrl ? (
                                                <img src={course.avatarUrl} alt={course.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaChalkboardTeacher className="text-white/30 text-3xl" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">{course.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${course.status === 'finished' ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'}`}>
                                                        {course.status === 'finished' ? 'Đã kết thúc' : 'Hoạt động'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">{course.description || 'Chưa có mô tả'}</p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1.5"><FaUserTie className="text-blue-500"/> <span className="truncate max-w-[150px]">{course.headTeacherId ? (headTeacherNames[course.headTeacherId] || '...') : 'Chưa phân công'}</span></div>
                                                <div className="flex items-center gap-1.5"><FaUsers className="text-teal-500"/> {classStats[course.id] || 0} học viên</div>
                                            </div>
                                        </div>
                                        {(canEditThis || canDeleteThis) && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {canEditThis && <button onClick={(e) => {e.stopPropagation(); onEditCourse(course, e);}} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FaEdit/></button>}
                                                {canDeleteThis && <button onClick={(e) => {e.stopPropagation(); onDeleteCourse(course.id);}} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash/></button>}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

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
                                        {course.avatarUrl ? (
                                            <img src={course.avatarUrl} alt={course.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <FaChalkboardTeacher className="text-white/20 w-28 h-28 transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white text-xs font-medium">
                                            <FaUsers /> {classStats[course.id] || 0} học viên
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-bold text-xl text-white truncate drop-shadow-md">{course.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                {course.licenseId && (
                                                    <span className="text-[10px] font-bold text-teal-100 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {licenses.find(l => l.id === course.licenseId)?.name || course.licenseId}
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    course.status === 'finished' 
                                                    ? 'bg-red-500/80 text-white border border-red-400/50' 
                                                    : 'bg-emerald-500/80 text-white border border-emerald-400/50'
                                                }`}>
                                                    {course.status === 'finished' ? '🔴 Đã kết thúc' : '🟢 Đang hoạt động'}
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
