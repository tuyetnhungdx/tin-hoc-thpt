import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  School,
  FileCheck2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel } from '../types';

export const DashboardView: React.FC = () => {
  const {
    teacherInfo,
    classes,
    students,
    lessons,
    grades,
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    activities,
    setActiveTab,
    setSelectedClassIdForFilter,
  } = useApp();

  // State for new todo input
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<PriorityLevel>('Bình thường');

  // Stats calculation
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const activeLessons = lessons.filter((l) => l.status === 'Đang thực hiện').length;

  const goodStudents = students.filter((s) => s.status === 'Hoàn thành tốt').length;
  const passStudents = students.filter((s) => s.status === 'Đạt').length;
  const needSupportStudents = students.filter((s) => s.status === 'Cần hỗ trợ').length;

  const completionRate =
    students.length > 0
      ? Math.round(((goodStudents + passStudents) / students.length) * 100)
      : 0;

  // Grade stats
  const averageGrade =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
      : '0.0';

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    addTodo({
      text: newTodoText.trim(),
      isDone: false,
      priority: newTodoPriority,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    setNewTodoText('');
  };

  const handleGoToClass = (clsId: string) => {
    setSelectedClassIdForFilter(clsId);
    setActiveTab('students');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Teacher Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 translate-y-12 w-48 h-48 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-sky-100 border border-white/10">
                <School className="w-3.5 h-3.5" />
                {teacherInfo.school}
              </span>
              <span className="inline-flex items-center gap-1 bg-teal-400/20 text-teal-200 border border-teal-300/20 px-3 py-1 rounded-full text-xs font-semibold">
                Môn: {teacherInfo.subject}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 px-2.5 py-1 rounded-full text-xs">
                Năm học {teacherInfo.academicYear}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white pt-1">
              Xin chào cô {teacherInfo.name}!
            </h1>
            <p className="text-sky-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Chào mừng cô đến với không gian quản trị giảng dạy Tin học. Dưới đây là bức tranh tổng quan về tiến độ các lớp, bài thực hành và kết quả học sinh.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              id="btn-quick-grade"
              type="button"
              onClick={() => setActiveTab('grades')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-sky-800 font-semibold text-sm hover:bg-sky-50 active:scale-95 transition shadow-sm"
            >
              <FileCheck2 className="w-4 h-4 text-sky-600" />
              <span>Nhập Điểm Nhanh</span>
            </button>
            <button
              id="btn-quick-lesson"
              type="button"
              onClick={() => setActiveTab('lessons')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm active:scale-95 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Bài Dạy</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Classes */}
        <div
          onClick={() => setActiveTab('classes')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Lớp Đang Quản Lý
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500">lớp học THPT</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-700 font-medium">
            <span>Chi tiết các khối 10, 11, 12</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tổng Số Học Sinh
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
            <span>Theo dõi theo lớp & học lực</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Active Lessons */}
        <div
          onClick={() => setActiveTab('lessons')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Bài Học Đang Thực Hiện
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activeLessons}</span>
            <span className="text-xs text-slate-500">/ {lessons.length} tổng chuyên đề</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
            <span>Quản lý tiến độ giảng dạy</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Completion Rate */}
        <div
          onClick={() => setActiveTab('stats')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tỷ Lệ Hoàn Thành
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{completionRate}%</span>
            <span className="text-xs text-slate-500">Đạt & Tốt (TB: {averageGrade}đ)</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span>Xem biểu đồ thống kê</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Student Learning Performance Chart & Class Quick Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                  Tình Hình Học Tập & Phân Phối Học Lực
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đánh giá toàn diện dựa trên số lượng học sinh và kết quả kiểm tra gần nhất
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 hover:bg-sky-100 transition"
              >
                Xem chi tiết thống kê →
              </button>
            </div>

            {/* Horizontal progress visualization */}
            <div className="my-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Hoàn thành tốt ({goodStudents} học sinh)
                  </span>
                  <span>{totalStudents ? Math.round((goodStudents / totalStudents) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalStudents ? (goodStudents / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    Đạt yêu cầu ({passStudents} học sinh)
                  </span>
                  <span>{totalStudents ? Math.round((passStudents / totalStudents) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalStudents ? (passStudents / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Cần hỗ trợ & kèm cặp thêm ({needSupportStudents} học sinh)
                  </span>
                  <span>{totalStudents ? Math.round((needSupportStudents / totalStudents) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalStudents ? (needSupportStudents / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Class status pills */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3">Lối tắt nhanh theo lớp học:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {classes.map((c) => {
                const count = students.filter((s) => s.classId === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleGoToClass(c.id)}
                    className="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200/80 hover:border-sky-300 text-left transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                      <span className="text-[10px] font-medium bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                        K{c.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{count} học sinh</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Lesson In-Progress Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Bài Học Đang Dạy
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('lessons')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Xem tất cả
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {lessons.slice(0, 3).map((lsn) => (
                <div
                  key={lsn.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {lsn.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        lsn.status === 'Đang thực hiện'
                          ? 'bg-sky-100 text-sky-800'
                          : lsn.status === 'Đã hoàn thành'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lsn.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {lsn.description}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {lsn.executionDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('lessons')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 text-xs font-semibold transition text-center"
          >
            Quản lý kế hoạch bài dạy môn Tin học →
          </button>
        </div>
      </div>

      {/* 4. Bottom Section: Việc cần làm (To-do) + Hoạt động gần đây (Recent Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Việc cần làm */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Việc Cần Làm Của Cô
                </h2>
                <p className="text-xs text-slate-500">
                  {todos.filter((t) => !t.isDone).length} nhiệm vụ chưa hoàn thành
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {todos.filter((t) => t.isDone).length}/{todos.length} Đã xong
              </span>
            </div>

            {/* Todo Input Form */}
            <form onSubmit={handleAddTodoSubmit} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Thêm việc cần làm mới (ví dụ: Chấm bài 10A1)..."
                className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <select
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value as PriorityLevel)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Bình thường">Bình thường</option>
                <option value="Quan trọng">Quan trọng</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 transition shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </form>

            {/* Todo List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có việc cần làm nào. Thêm công việc mới ở trên!
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition ${
                      todo.isDone
                        ? 'bg-slate-50/70 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.isDone}
                        onChange={() => toggleTodo(todo.id)}
                        className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <div>
                        <p
                          className={`text-sm ${
                            todo.isDone
                              ? 'line-through text-slate-500'
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              todo.priority === 'Khẩn cấp'
                                ? 'bg-red-100 text-red-700'
                                : todo.priority === 'Quan trọng'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {todo.priority}
                          </span>
                          {todo.dueDate && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {todo.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Xóa việc này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                Hoạt Động Gần Đây
              </h2>
              <span className="text-xs text-slate-400 font-medium">Nhật ký sư phạm</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có lịch sử hoạt động.
                </div>
              ) : (
                activities.slice(0, 7).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        act.type === 'grade'
                          ? 'bg-emerald-100 text-emerald-700'
                          : act.type === 'lesson'
                          ? 'bg-sky-100 text-sky-700'
                          : act.type === 'student'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {act.type === 'grade' ? (
                        <FileCheck2 className="w-4 h-4" />
                      ) : act.type === 'lesson' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : act.type === 'student' ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <GraduationCap className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800 leading-snug">
                        {act.text}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dữ liệu được lưu trữ an toàn trên thiết bị của cô</span>
            <span className="text-teal-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Sẵn sàng giảng dạy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
