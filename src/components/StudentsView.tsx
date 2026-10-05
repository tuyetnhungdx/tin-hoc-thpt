import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, LearningStatus } from '../types';
import { StudentExcelImportModal } from './StudentExcelImportModal';
import { exportStudentsToExcel } from '../utils/excelHelper';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    grades,
    lessons,
    addStudent,
    updateStudent,
    deleteStudent,
    openConfirmDialog,
    showToast,
    selectedClassIdForFilter,
    setSelectedClassIdForFilter,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>(selectedClassIdForFilter || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Excel Import Modal state
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formFullName, setFormFullName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formGender, setFormGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [formClassId, setFormClassId] = useState('');
  const [formDateOfBirth, setFormDateOfBirth] = useState('');
  const [formStatus, setFormStatus] = useState<LearningStatus>('Đạt');
  const [formRecentScore, setFormRecentScore] = useState<number | ''>('');
  const [formNotes, setFormNotes] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');

  // Student Detail Modal
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Sync class filter if passed from context
  useEffect(() => {
    if (selectedClassIdForFilter) {
      setClassFilter(selectedClassIdForFilter);
      setSelectedClassIdForFilter(null);
    }
  }, [selectedClassIdForFilter, setSelectedClassIdForFilter]);

  const filteredStudents = students.filter((st) => {
    const matchSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === 'all' || st.classId === classFilter;
    const matchStatus = statusFilter === 'all' || st.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormFullName('');
    setFormCode(`HS${classes[0]?.grade || 10}-${String(students.length + 1).padStart(3, '0')}`);
    setFormGender('Nam');
    setFormClassId(classes[0]?.id || '');
    setFormDateOfBirth('2009-01-01');
    setFormStatus('Đạt');
    setFormRecentScore('');
    setFormNotes('');
    setFormParentPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setFormFullName(st.fullName);
    setFormCode(st.code);
    setFormGender(st.gender);
    setFormClassId(st.classId);
    setFormDateOfBirth(st.dateOfBirth || '');
    setFormStatus(st.status);
    setFormRecentScore(st.recentScore !== undefined ? st.recentScore : '');
    setFormNotes(st.notes || '');
    setFormParentPhone(st.parentPhone || '');
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formClassId) return;

    const payload = {
      fullName: formFullName.trim(),
      code: formCode.trim() || `HS-${Date.now().toString().slice(-4)}`,
      gender: formGender,
      classId: formClassId,
      dateOfBirth: formDateOfBirth || undefined,
      status: formStatus,
      recentScore: formRecentScore !== '' ? Number(formRecentScore) : undefined,
      notes: formNotes.trim() || undefined,
      parentPhone: formParentPhone.trim() || undefined,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, payload);
      if (detailStudent?.id === editingStudent.id) {
        setDetailStudent({ ...editingStudent, ...payload });
      }
    } else {
      addStudent(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteStudentPrompt = (st: Student) => {
    openConfirmDialog({
      title: `Xác nhận xóa học sinh ${st.fullName}?`,
      message: `Hành động này sẽ xóa vĩnh viễn học sinh mã ${st.code} và dữ liệu điểm liên quan khỏi hệ thống.`,
      confirmLabel: 'Xóa học sinh',
      onConfirm: () => {
        deleteStudent(st.id);
        if (detailStudent?.id === st.id) {
          setDetailStudent(null);
        }
      },
    });
  };

  const handleExportExcel = () => {
    const targetList = filteredStudents.length > 0 ? filteredStudents : students;
    const currentClass = classes.find((c) => c.id === classFilter);
    const suffix = currentClass ? `Lop_${currentClass.name}` : 'ToanTruong';
    exportStudentsToExcel(targetList, classes, suffix);
    showToast(`Đã xuất danh sách ${targetList.length} học sinh ra file Excel!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-teal-600" />
            Quản Lý Danh Sách Học Sinh
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi thông tin, năng lực thực hành và tiến độ của từng học sinh trong các lớp Tin học.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-export-excel"
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-2xs"
            title="Xuất danh sách học sinh ra file Excel"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất Excel</span>
          </button>

          <button
            id="btn-import-excel"
            type="button"
            onClick={() => setIsExcelModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm active:scale-95"
            title="Nhập danh sách học sinh từ file Excel hoặc CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Nhập từ File Excel</span>
          </button>

          <button
            id="btn-add-student"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Học Sinh Mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên học sinh, mã HS, ghi chú..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Lớp:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tất cả các lớp ({students.length})</option>
              {classes.map((cls) => {
                const count = students.filter((s) => s.classId === cls.id).length;
                return (
                  <option key={cls.id} value={cls.id}>
                    Lớp {cls.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Hoàn thành tốt">Hoàn thành tốt</option>
              <option value="Đạt">Đạt yêu cầu</option>
              <option value="Cần hỗ trợ">Cần hỗ trợ thêm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy học sinh</h3>
            <p className="text-sm text-slate-500 mt-1">
              Thử xóa bộ lọc hoặc tìm kiếm bằng từ khóa khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Mã HS</th>
                  <th className="py-3.5 px-4">Họ và Tên</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">Giới tính</th>
                  <th className="py-3.5 px-4">Trạng thái học tập</th>
                  <th className="py-3.5 px-4 text-center">Điểm gần nhất</th>
                  <th className="py-3.5 px-4">Ghi chú sư phạm</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const studentClass = classes.find((c) => c.id === st.classId);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setDetailStudent(st)}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-sky-700">
                        {st.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {st.fullName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-100 text-sky-800">
                          {studentClass ? studentClass.name : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">{st.gender}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            st.status === 'Hoàn thành tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.status === 'Đạt'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.status === 'Hoàn thành tốt' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : st.status === 'Đạt' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block font-bold text-base ${
                            st.recentScore !== undefined && st.recentScore >= 8.0
                              ? 'text-emerald-600'
                              : st.recentScore !== undefined && st.recentScore >= 5.0
                              ? 'text-sky-700'
                              : 'text-amber-600'
                          }`}
                        >
                          {st.recentScore !== undefined ? `${st.recentScore}` : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                        {st.notes || '—'}
                      </td>
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDetailStudent(st)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-white rounded-lg transition"
                            title="Xem chi tiết học sinh"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition"
                            title="Sửa học sinh"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudentPrompt(st)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {detailStudent.code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    Lớp {classes.find((c) => c.id === detailStudent.classId)?.name || 'Chưa rõ'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{detailStudent.fullName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Giới tính</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                  {detailStudent.gender}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Ngày sinh</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                  {detailStudent.dateOfBirth || 'Chưa cập nhật'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Trạng thái</span>
                <span
                  className={`text-xs font-bold block mt-1 ${
                    detailStudent.status === 'Hoàn thành tốt'
                      ? 'text-emerald-700'
                      : detailStudent.status === 'Đạt'
                      ? 'text-sky-700'
                      : 'text-amber-700'
                  }`}
                >
                  {detailStudent.status}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Điểm gần nhất</span>
                <span className="text-base font-bold text-teal-700 block mt-0.5">
                  {detailStudent.recentScore !== undefined ? `${detailStudent.recentScore}đ` : '—'}
                </span>
              </div>
            </div>

            {/* Parent & Notes */}
            <div className="space-y-3 mb-6">
              {detailStudent.parentPhone && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>SĐT Liên hệ phụ huynh:</span>
                  <strong className="text-slate-900">{detailStudent.parentPhone}</strong>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-1">
                  Ghi chú sư phạm của cô Tuyết Nhung:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {detailStudent.notes || 'Chưa có ghi chú riêng.'}
                </p>
              </div>
            </div>

            {/* Grade History for this student */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                Lịch Sử Điểm & Đánh Giá Bài Dạy
              </h4>

              {grades.filter((g) => g.studentId === detailStudent.id).length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-400 border border-slate-100">
                  Chưa có dữ liệu bài kiểm tra / thực hành nào được ghi nhận cho học sinh này.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {grades
                    .filter((g) => g.studentId === detailStudent.id)
                    .map((grd) => {
                      const lsn = lessons.find((l) => l.id === grd.lessonId);
                      return (
                        <div
                          key={grd.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 block">
                              {lsn ? lsn.title : 'Bài thực hành'}
                            </span>
                            <p className="text-slate-600 italic leading-relaxed">
                              &ldquo;{grd.comment}&rdquo;
                            </p>
                            <span className="text-[10px] text-slate-400 block">{grd.updatedAt}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg font-bold text-sky-700 block">
                              {grd.score}đ
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                grd.completionLevel === 'Hoàn thành tốt'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : grd.completionLevel === 'Đạt'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {grd.completionLevel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = detailStudent;
                  setDetailStudent(null);
                  handleOpenEdit(target);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition"
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                type="button"
                onClick={() => setDetailStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStudent ? `Sửa Học Sinh: ${editingStudent.fullName}` : 'Thêm Học Sinh Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!editingStudent && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900 block">Có sẵn danh sách lớp trong file Excel?</span>
                    <span className="text-emerald-700">Nhập hàng loạt cả lớp thay vì nhập thủ công từng em</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsExcelModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap transition shadow-2xs"
                >
                  Nhập Excel
                </button>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và Tên học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="VD: HS10-001"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        Lớp {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={formDateOfBirth}
                    onChange={(e) => setFormDateOfBirth(e.target.value)}
                    className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái học tập
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LearningStatus)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Hoàn thành tốt">Hoàn thành tốt</option>
                    <option value="Đạt">Đạt yêu cầu</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ thêm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Điểm số gần nhất (thang 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formRecentScore}
                    onChange={(e) => setFormRecentScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="VD: 8.5"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SĐT Phụ huynh (để liên hệ khi cần)
                </label>
                <input
                  type="text"
                  value={formParentPhone}
                  onChange={(e) => setFormParentPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú năng lực sư phạm
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi nhận thái độ thực hành phòng máy, điểm mạnh, lỗi thường gặp..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  {editingStudent ? 'Cập Nhật Học Sinh' : 'Thêm Vào Danh Sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <StudentExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        defaultClassId={classFilter !== 'all' ? classFilter : undefined}
      />
    </div>
  );
};
