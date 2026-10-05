import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  PlayCircle,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lesson, LessonStatus } from '../types';

export const LessonsView: React.FC = () => {
  const {
    lessons,
    classes,
    addLesson,
    updateLesson,
    deleteLesson,
    openConfirmDialog,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTopicCode, setFormTopicCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formClassIds, setFormClassIds] = useState<string[]>([]);
  const [formExecutionDate, setFormExecutionDate] = useState('');
  const [formStatus, setFormStatus] = useState<LessonStatus>('Chưa bắt đầu');

  const filteredLessons = lessons.filter((lsn) => {
    const matchSearch =
      lsn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lsn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lsn.topicCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || lsn.status === statusFilter;
    const matchClass =
      classFilter === 'all' || lsn.classIds.includes(classFilter);
    return matchSearch && matchStatus && matchClass;
  });

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setFormTitle('');
    setFormTopicCode('Chủ đề F - Tin học 10');
    setFormDescription('');
    setFormClassIds(classes.length > 0 ? [classes[0].id] : []);
    setFormExecutionDate(new Date().toISOString().slice(0, 10));
    setFormStatus('Chưa bắt đầu');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lsn: Lesson) => {
    setEditingLesson(lsn);
    setFormTitle(lsn.title);
    setFormTopicCode(lsn.topicCode || '');
    setFormDescription(lsn.description);
    setFormClassIds(lsn.classIds);
    setFormExecutionDate(lsn.executionDate);
    setFormStatus(lsn.status);
    setIsModalOpen(true);
  };

  const handleToggleClassSelection = (clsId: string) => {
    setFormClassIds((prev) =>
      prev.includes(clsId) ? prev.filter((id) => id !== clsId) : [...prev, clsId]
    );
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload = {
      title: formTitle.trim(),
      topicCode: formTopicCode.trim() || undefined,
      description: formDescription.trim(),
      classIds: formClassIds.length > 0 ? formClassIds : (classes.length > 0 ? [classes[0].id] : []),
      executionDate: formExecutionDate || new Date().toISOString().slice(0, 10),
      status: formStatus,
    };

    if (editingLesson) {
      updateLesson(editingLesson.id, payload);
    } else {
      addLesson(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLessonPrompt = (lsn: Lesson) => {
    openConfirmDialog({
      title: `Xác nhận xóa bài dạy?`,
      message: `Bài học "${lsn.title}" và các kết quả điểm gắn với bài này sẽ bị xóa khỏi hệ thống.`,
      confirmLabel: 'Xóa bài học',
      onConfirm: () => {
        deleteLesson(lsn.id);
      },
    });
  };

  const handleCycleStatus = (lsn: Lesson) => {
    let nextStatus: LessonStatus = 'Chưa bắt đầu';
    if (lsn.status === 'Chưa bắt đầu') nextStatus = 'Đang thực hiện';
    else if (lsn.status === 'Đang thực hiện') nextStatus = 'Đã hoàn thành';
    else nextStatus = 'Chưa bắt đầu';
    updateLesson(lsn.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Quản Lý Kế Hoạch & Bài Học Tin Học
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tiến độ phân phối chương trình, chủ đề lý thuyết và bài thực hành phòng máy.
          </p>
        </div>

        <button
          id="btn-add-lesson"
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Bài Học Mới</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài học, chuyên đề, nội dung bài thực hành..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Lớp áp dụng:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <span className="text-xs font-semibold text-slate-500">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lesson List Cards */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài học phù hợp</h3>
          <p className="text-sm text-slate-500 mt-1">
            Hãy điều chỉnh từ khóa tìm kiếm hoặc nhấn &quot;Tạo Bài Học Mới&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLessons.map((lsn) => {
            const assignedClasses = classes.filter((c) => lsn.classIds.includes(c.id));

            return (
              <div
                key={lsn.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {lsn.topicCode || 'Chương trình Tin học'}
                    </span>

                    {/* Status Pill with toggle on click */}
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(lsn)}
                      title="Bấm để chuyển trạng thái nhanh"
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                        lsn.status === 'Đã hoàn thành'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : lsn.status === 'Đang thực hiện'
                          ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lsn.status === 'Đã hoàn thành' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : lsn.status === 'Đang thực hiện' ? (
                        <PlayCircle className="w-3.5 h-3.5 text-sky-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{lsn.status}</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                    {lsn.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {lsn.description}
                  </p>

                  {/* Classes applied */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Lớp áp dụng:
                    </span>
                    {assignedClasses.length > 0 ? (
                      assignedClasses.map((c) => (
                        <span
                          key={c.id}
                          className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700"
                        >
                          {c.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Chưa chỉ định</span>
                    )}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ngày dạy: <strong>{lsn.executionDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(lsn)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                      title="Sửa bài dạy"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLessonPrompt(lsn)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition"
                      title="Xóa bài dạy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit Lesson */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingLesson ? 'Chỉnh Sửa Bài Dạy' : 'Tạo Bài Dạy / Chủ Đề Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên bài dạy / chuyên đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Bài thực hành: Cấu trúc rẽ nhánh if-else"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã chuyên đề / Phân môn
                  </label>
                  <input
                    type="text"
                    value={formTopicCode}
                    onChange={(e) => setFormTopicCode(e.target.value)}
                    placeholder="VD: Tin học 10 - Python"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày thực hiện giảng dạy
                  </label>
                  <input
                    type="date"
                    value={formExecutionDate}
                    onChange={(e) => setFormExecutionDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái triển khai
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as LessonStatus)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
              </div>

              {/* Multi-class selection checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chọn các lớp áp dụng bài dạy này:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {classes.map((cls) => (
                    <label
                      key={cls.id}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formClassIds.includes(cls.id)}
                        onChange={() => handleToggleClassSelection(cls.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Lớp {cls.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mục tiêu & mô tả ngắn nội dung bài học
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Nêu yêu cầu cần đạt, thiết bị phòng máy hoặc phiếu học tập cần dùng..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  {editingLesson ? 'Cập Nhật Bài Dạy' : 'Lưu Kế Hoạch Bài Dạy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
