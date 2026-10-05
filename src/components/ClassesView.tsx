import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Eye,
  BookOpen,
  School,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassItem, GradeLevel } from '../types';

export const ClassesView: React.FC = () => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    students,
    lessons,
    grades,
    openConfirmDialog,
    setActiveTab,
    setSelectedClassIdForFilter,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formGrade, setFormGrade] = useState<GradeLevel>(10);
  const [formRoom, setFormRoom] = useState('');
  const [formAcademicYear, setFormAcademicYear] = useState('2024 - 2025');
  const [formDescription, setFormDescription] = useState('');

  // Class detail modal
  const [detailClass, setDetailClass] = useState<ClassItem | null>(null);

  const filteredClasses = classes.filter((cls) => {
    const matchSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade =
      selectedGradeFilter === 'all' || cls.grade.toString() === selectedGradeFilter;
    return matchSearch && matchGrade;
  });

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormName('');
    setFormGrade(10);
    setFormRoom('Phòng Tin 01');
    setFormAcademicYear('2024 - 2025');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormName(cls.name);
    setFormGrade(cls.grade);
    setFormRoom(cls.room);
    setFormAcademicYear(cls.academicYear);
    setFormDescription(cls.description || '');
    setIsModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        name: formName.trim(),
        grade: formGrade,
        room: formRoom.trim(),
        academicYear: formAcademicYear.trim(),
        description: formDescription.trim(),
      });
    } else {
      addClass({
        name: formName.trim(),
        grade: formGrade,
        room: formRoom.trim() || 'Phòng Tin 01',
        academicYear: formAcademicYear.trim() || '2024 - 2025',
        description: formDescription.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteClassPrompt = (cls: ClassItem) => {
    const studentCount = students.filter((s) => s.classId === cls.id).length;
    openConfirmDialog({
      title: `Xác nhận xóa lớp ${cls.name}?`,
      message: `Hành động này sẽ xóa lớp ${cls.name} cùng toàn bộ ${studentCount} học sinh và dữ liệu điểm liên quan. Thao tác này không thể hoàn tác.`,
      confirmLabel: 'Đồng ý xóa lớp',
      onConfirm: () => {
        deleteClass(cls.id);
        if (detailClass?.id === cls.id) {
          setDetailClass(null);
        }
      },
    });
  };

  const handleViewStudentsOfClass = (classId: string) => {
    setSelectedClassIdForFilter(classId);
    setActiveTab('students');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-sky-600" />
            Quản Lý Lớp Học THPT
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các lớp giảng dạy bộ môn Tin học do cô Trần Thị Tuyết Nhung phụ trách.
          </p>
        </div>

        <button
          id="btn-add-class"
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Lớp Mới</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên lớp, phòng máy, mô tả..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Lọc khối:</span>
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Tất cả các khối (10, 11, 12)</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>
      </div>

      {/* Class Cards Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy lớp học phù hợp</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Thêm Lớp Mới&quot; để tạo lớp học đầu tiên.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition"
          >
            Thêm lớp ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const classStudents = students.filter((s) => s.classId === cls.id);
            const classGrades = grades.filter((g) => g.classId === cls.id);
            const classAvg =
              classGrades.length > 0
                ? (classGrades.reduce((sum, g) => sum + g.score, 0) / classGrades.length).toFixed(1)
                : 'Chưa có';

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Top badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      Khối {cls.grade}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {cls.room}
                    </span>
                  </div>

                  {/* Class Title */}
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      Lớp {cls.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mt-1 leading-relaxed">
                    {cls.description || 'Lớp học thuộc chương trình Tin học trường THPT Nguyễn Dục.'}
                  </p>

                  {/* Quick stats grid inside card */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium block">Sĩ số</span>
                      <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Users className="w-4 h-4 text-teal-600" />
                        {classStudents.length} học sinh
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium block">Điểm trung bình</span>
                      <span className="text-lg font-bold text-sky-700 block mt-0.5">
                        {classAvg} {classAvg !== 'Chưa có' && 'đ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDetailClass(cls)}
                      className="p-2 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition"
                      title="Xem thông tin chi tiết lớp"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(cls)}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition"
                      title="Chỉnh sửa thông tin lớp"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClassPrompt(cls)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition"
                      title="Xóa lớp học này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewStudentsOfClass(cls.id)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-sky-300 transition"
                  >
                    <span>Xem học sinh</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Class Details Modal */}
      {detailClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  Khối {detailClass.grade} • {detailClass.academicYear}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Thông Tin Lớp {detailClass.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Phòng thực hành: {detailClass.room}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Mô tả / Đặc điểm lớp:
                </h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {detailClass.description || 'Không có mô tả bổ sung.'}
                </p>
              </div>

              {/* Students in class */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-800">
                    Danh Sách Học Sinh ({students.filter((s) => s.classId === detailClass.id).length} em):
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setDetailClass(null);
                      handleViewStudentsOfClass(detailClass.id);
                    }}
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    Chuyển đến trang Quản lý học sinh →
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Mã HS</th>
                        <th className="p-2.5">Họ và tên</th>
                        <th className="p-2.5">Trạng thái</th>
                        <th className="p-2.5">Điểm gần nhất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.filter((s) => s.classId === detailClass.id).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            Chưa có học sinh nào trong lớp này.
                          </td>
                        </tr>
                      ) : (
                        students
                          .filter((s) => s.classId === detailClass.id)
                          .map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono text-slate-500">{st.code}</td>
                              <td className="p-2.5 font-semibold text-slate-800">{st.fullName}</td>
                              <td className="p-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                    st.status === 'Hoàn thành tốt'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : st.status === 'Đạt'
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {st.status}
                                </span>
                              </td>
                              <td className="p-2.5 font-bold text-sky-700">
                                {st.recentScore !== undefined ? `${st.recentScore}đ` : '-'}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = detailClass;
                  setDetailClass(null);
                  handleOpenEditModal(target);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition"
              >
                Chỉnh sửa thông tin
              </button>
              <button
                type="button"
                onClick={() => setDetailClass(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingClass ? `Chỉnh Sửa Lớp ${editingClass.name}` : 'Thêm Lớp Học Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên lớp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: 10A3, 11A2..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khối lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học / Phòng Tin
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="VD: Phòng Tin 01, Tầng 2"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={formAcademicYear}
                    onChange={(e) => setFormAcademicYear(e.target.value)}
                    placeholder="2024 - 2025"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả / Đặc điểm lớp học
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi chú về học lực chung, trọng tâm chương trình Tin học..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  {editingClass ? 'Lưu Thay Đổi' : 'Thêm Lớp Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
