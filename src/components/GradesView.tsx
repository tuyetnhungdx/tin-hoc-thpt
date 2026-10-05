import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GradeResult, CompletionLevel } from '../types';

export const GradesView: React.FC = () => {
  const {
    grades,
    students,
    classes,
    lessons,
    addGrade,
    updateGrade,
    deleteGrade,
    openConfirmDialog,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [lessonFilter, setLessonFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeResult | null>(null);
  const [formStudentId, setFormStudentId] = useState('');
  const [formLessonId, setFormLessonId] = useState('');
  const [formScore, setFormScore] = useState<number>(8.0);
  const [formCompletionLevel, setFormCompletionLevel] = useState<CompletionLevel>('Hoàn thành tốt');
  const [formComment, setFormComment] = useState('');
  const [formUpdatedAt, setFormUpdatedAt] = useState('');

  // Filtered grades
  const filteredGrades = grades.filter((g) => {
    const student = students.find((s) => s.id === g.studentId);
    const lesson = lessons.find((l) => l.id === g.lessonId);
    const studentName = student ? student.fullName.toLowerCase() : '';
    const studentCode = student ? student.code.toLowerCase() : '';
    const lessonTitle = lesson ? lesson.title.toLowerCase() : '';
    const commentText = g.comment.toLowerCase();

    const term = searchTerm.toLowerCase();
    const matchSearch =
      studentName.includes(term) ||
      studentCode.includes(term) ||
      lessonTitle.includes(term) ||
      commentText.includes(term);

    const matchClass = classFilter === 'all' || g.classId === classFilter;
    const matchLesson = lessonFilter === 'all' || g.lessonId === lessonFilter;
    const matchLevel = levelFilter === 'all' || g.completionLevel === levelFilter;

    return matchSearch && matchClass && matchLesson && matchLevel;
  });

  const handleOpenAdd = () => {
    setEditingGrade(null);
    const defaultStudent = students[0];
    setFormStudentId(defaultStudent ? defaultStudent.id : '');
    setFormLessonId(lessons[0] ? lessons[0].id : '');
    setFormScore(8.0);
    setFormCompletionLevel('Hoàn thành tốt');
    setFormComment('Hoàn thành tốt bài thực hành, thao tác chuẩn xác.');
    setFormUpdatedAt(new Date().toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (grade: GradeResult) => {
    setEditingGrade(grade);
    setFormStudentId(grade.studentId);
    setFormLessonId(grade.lessonId);
    setFormScore(grade.score);
    setFormCompletionLevel(grade.completionLevel);
    setFormComment(grade.comment);
    setFormUpdatedAt(grade.updatedAt);
    setIsModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formLessonId) return;

    const targetStudent = students.find((s) => s.id === formStudentId);
    const studentClassId = targetStudent ? targetStudent.classId : classes[0]?.id || '';

    // Auto calculate completion level based on score if user keeps default
    let level = formCompletionLevel;
    if (formScore >= 8.0) level = 'Hoàn thành tốt';
    else if (formScore >= 5.0) level = 'Đạt';
    else level = 'Chưa đạt';

    const payload = {
      studentId: formStudentId,
      classId: studentClassId,
      lessonId: formLessonId,
      score: Number(formScore),
      completionLevel: level,
      comment: formComment.trim() || 'Đã ghi nhận kết quả.',
      updatedAt: formUpdatedAt || new Date().toISOString().slice(0, 10),
    };

    if (editingGrade) {
      updateGrade(editingGrade.id, payload);
    } else {
      addGrade(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteGradePrompt = (grade: GradeResult) => {
    const student = students.find((s) => s.id === grade.studentId);
    const studentName = student ? student.fullName : 'học sinh';

    openConfirmDialog({
      title: `Xác nhận xóa điểm của ${studentName}?`,
      message: `Hành động này sẽ xóa vĩnh viễn kết quả đánh giá (${grade.score}đ) khỏi hệ thống.`,
      confirmLabel: 'Xóa kết quả',
      onConfirm: () => {
        deleteGrade(grade.id);
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ClipboardCheck className="w-7 h-7 text-sky-600" />
            Sổ Quản Lý Kết Quả Học Tập
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ghi nhận điểm số, đánh giá mức độ đạt chuẩn và nhận xét sư phạm môn Tin học.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            title="In bảng điểm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">In Bảng Điểm</span>
          </button>

          <button
            id="btn-add-grade"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nhập Kết Quả Mới</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, bài học, nhận xét..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Lớp:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Bài học:</span>
            <select
              value={lessonFilter}
              onChange={(e) => setLessonFilter(e.target.value)}
              className="max-w-[200px] truncate px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tất cả bài học</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Mức độ:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="Hoàn thành tốt">Hoàn thành tốt</option>
              <option value="Đạt">Đạt</option>
              <option value="Chưa đạt">Chưa đạt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredGrades.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Không có bản ghi điểm phù hợp</h3>
            <p className="text-sm text-slate-500 mt-1">
              Thử xóa bớt bộ lọc hoặc bấm &quot;Nhập Kết Quả Mới&quot; để thêm điểm.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Học sinh</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">Bài / Chủ đề Tin học</th>
                  <th className="py-3.5 px-4 text-center">Điểm</th>
                  <th className="py-3.5 px-4">Mức độ hoàn thành</th>
                  <th className="py-3.5 px-4">Nhận xét của cô Nhung</th>
                  <th className="py-3.5 px-4">Ngày cập nhật</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.map((grade) => {
                  const student = students.find((s) => s.id === grade.studentId);
                  const cls = classes.find((c) => c.id === grade.classId);
                  const lesson = lessons.find((l) => l.id === grade.lessonId);

                  return (
                    <tr key={grade.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          {student ? student.fullName : 'Học sinh đã xóa'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {student ? student.code : '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-100 text-sky-800">
                          {cls ? cls.name : '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-700 font-medium max-w-xs">
                        {lesson ? lesson.title : 'Chưa xác định'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block font-extrabold text-base px-2.5 py-0.5 rounded-lg ${
                            grade.score >= 8.0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : grade.score >= 5.0
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {grade.score}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            grade.completionLevel === 'Hoàn thành tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : grade.completionLevel === 'Đạt'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {grade.completionLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm italic">
                        &ldquo;{grade.comment}&rdquo;
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {grade.updatedAt}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(grade)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-white rounded-lg transition"
                            title="Sửa kết quả"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGradePrompt(grade)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition"
                            title="Xóa kết quả"
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

      {/* Modal Add/Edit Grade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingGrade ? 'Cập Nhật Điểm Học Sinh' : 'Nhập Điểm & Kết Quả Học Tập'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn Học Sinh <span className="text-red-500">*</span>
                </label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {students.map((st) => {
                    const cls = classes.find((c) => c.id === st.classId);
                    return (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.code}) - Lớp {cls ? cls.name : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bài học / Chuyên đề đánh giá <span className="text-red-500">*</span>
                </label>
                <select
                  value={formLessonId}
                  onChange={(e) => setFormLessonId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {lessons.map((lsn) => (
                    <option key={lsn.id} value={lsn.id}>
                      {lsn.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Điểm số (thang điểm 10) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày đánh giá
                  </label>
                  <input
                    type="date"
                    value={formUpdatedAt}
                    onChange={(e) => setFormUpdatedAt(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức độ hoàn thành
                </label>
                <select
                  value={formCompletionLevel}
                  onChange={(e) => setFormCompletionLevel(e.target.value as CompletionLevel)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Hoàn thành tốt">Hoàn thành tốt (≥ 8.0)</option>
                  <option value="Đạt">Đạt yêu cầu (5.0 - 7.9)</option>
                  <option value="Chưa đạt">Chưa đạt / Cần hỗ trợ (&lt; 5.0)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhận xét sư phạm của cô Tuyết Nhung
                </label>
                <textarea
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Góp ý về cú pháp lập trình, kỹ năng thực hành máy, tinh thần học tập..."
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
                  {editingGrade ? 'Lưu Kết Quả' : 'Xác Nhận Nhập Điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
