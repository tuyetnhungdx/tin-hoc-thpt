import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatsView: React.FC = () => {
  const { classes, students, lessons, grades } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Filter students based on selection
  const targetStudents =
    selectedClassId === 'all'
      ? students
      : students.filter((s) => s.classId === selectedClassId);

  // Filter grades based on selection
  const targetGrades =
    selectedClassId === 'all'
      ? grades
      : grades.filter((g) => g.classId === selectedClassId);

  // 1. Student performance categories
  const goodCount = targetStudents.filter((s) => s.status === 'Hoàn thành tốt').length;
  const passCount = targetStudents.filter((s) => s.status === 'Đạt').length;
  const needSupportCount = targetStudents.filter((s) => s.status === 'Cần hỗ trợ').length;

  // 2. Average score
  const overallAvg =
    targetGrades.length > 0
      ? (targetGrades.reduce((sum, g) => sum + g.score, 0) / targetGrades.length).toFixed(1)
      : '0.0';

  // 3. Lesson completion rate
  const completedLessons = lessons.filter((l) => l.status === 'Đã hoàn thành').length;
  const inProgressLessons = lessons.filter((l) => l.status === 'Đang thực hiện').length;
  const lessonCompletionRate =
    lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  // 4. Class comparison data for chart
  const classComparisonData = classes.map((cls) => {
    const clsGrades = grades.filter((g) => g.classId === cls.id);
    const clsStudents = students.filter((s) => s.classId === cls.id);
    const avgScore =
      clsGrades.length > 0
        ? Number((clsGrades.reduce((sum, g) => sum + g.score, 0) / clsGrades.length).toFixed(1))
        : 0;
    const goodInClass = clsStudents.filter((s) => s.status === 'Hoàn thành tốt').length;
    const goodPercent =
      clsStudents.length > 0 ? Math.round((goodInClass / clsStudents.length) * 100) : 0;

    return {
      id: cls.id,
      name: cls.name,
      studentCount: clsStudents.length,
      gradeCount: clsGrades.length,
      avgScore,
      goodPercent,
    };
  });

  // Top students (score >= 8.5)
  const topStudents = [...targetStudents]
    .filter((s) => s.recentScore !== undefined)
    .sort((a, b) => (b.recentScore || 0) - (a.recentScore || 0))
    .slice(0, 5);

  // Need support students (status === 'Cần hỗ trợ' or score < 5.5)
  const supportStudents = targetStudents.filter(
    (s) => s.status === 'Cần hỗ trợ' || (s.recentScore !== undefined && s.recentScore < 5.5)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-sky-600" />
            Báo Cáo Thống Kê Sư Phạm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng hợp dữ liệu kết quả học tập, so sánh giữa các lớp và phân loại năng lực học sinh môn Tin học.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Lọc lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tất cả các lớp ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Thời gian:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Cả học kỳ hiện tại</option>
              <option value="month">30 ngày gần đây</option>
              <option value="week">Tuần này</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Hoàn Thành Tốt
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">{goodCount}</span>
            <span className="text-xs text-slate-500">
              ({targetStudents.length ? Math.round((goodCount / targetStudents.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Học sinh đạt kết quả thực hành xuất sắc</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Cần Hỗ Trợ Kèm Cặp
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700">{needSupportCount}</span>
            <span className="text-xs text-slate-500">
              ({targetStudents.length ? Math.round((needSupportCount / targetStudents.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Cần cô Nhung lưu ý phụ đạo giờ phòng máy</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Điểm Trung Bình
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-sky-700">{overallAvg}đ</span>
            <span className="text-xs text-slate-500">thang điểm 10</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tính trên {targetGrades.length} lượt bài kiểm tra</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tiến Độ Bài Dạy
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700">{lessonCompletionRate}%</span>
            <span className="text-xs text-slate-500">
              ({completedLessons}/{lessons.length} bài xong)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">{inProgressLessons} bài học đang triển khai</p>
        </div>
      </div>

      {/* Class Comparison Chart Component */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              Biểu Đồ So Sánh Kết Quả & Điểm Trung Bình Giữa Các Lớp
            </h2>
            <p className="text-xs text-slate-500">
              Trực quan hóa điểm số trung bình (thang 10) và tỷ lệ học sinh hoàn thành tốt
            </p>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
            Khối THPT Nguyễn Dục
          </span>
        </div>

        {/* Bar comparison visual */}
        <div className="space-y-6">
          {classComparisonData.map((item) => {
            const barWidthPercent = Math.min(100, Math.max(5, (item.avgScore / 10) * 100));

            return (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-slate-800 font-bold">Lớp {item.name}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({item.studentCount} học sinh • {item.gradeCount} bài kiểm tra)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Tốt: <strong>{item.goodPercent}%</strong>
                    </span>
                    <span className="text-base font-extrabold text-sky-700 font-mono">
                      {item.avgScore > 0 ? `${item.avgScore}đ` : 'Chưa có điểm'}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 rounded-xl h-6 p-1 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${barWidthPercent}%` }}
                  >
                    {barWidthPercent > 20 && (
                      <span className="text-[10px] text-white font-bold tracking-wider">
                        {item.avgScore} / 10
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Top Performing Students vs Students Needing Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Students */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Học Sinh Tiêu Biểu Môn Tin Học
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Điểm cao nhất
              </span>
            </div>

            <div className="space-y-3">
              {topStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Chưa có dữ liệu học sinh tiêu biểu.
                </div>
              ) : (
                topStudents.map((st, index) => {
                  const cls = classes.find((c) => c.id === st.classId);
                  return (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            index === 0
                              ? 'bg-amber-400 text-slate-900'
                              : index === 1
                              ? 'bg-slate-300 text-slate-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{st.fullName}</p>
                          <p className="text-xs text-slate-500">
                            Lớp {cls ? cls.name : '-'} • {st.code}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-extrabold text-emerald-600 font-mono">
                        {st.recentScore}đ
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Support Needed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Danh Sách Cần Cô Nhung Kèm Cặp Thêm
              </h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                {supportStudents.length} học sinh
              </span>
            </div>

            <div className="space-y-3">
              {supportStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-emerald-600 font-medium">
                  ✓ Tuyệt vời! Hiện không có học sinh nào ở mức cần hỗ trợ đặc biệt.
                </div>
              ) : (
                supportStudents.map((st) => {
                  const cls = classes.find((c) => c.id === st.classId);
                  return (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{st.fullName}</p>
                          <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                            Lớp {cls ? cls.name : '-'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 italic">
                          {st.notes || 'Cần chú ý hướng dẫn thêm thao tác lưu file và cú pháp lệnh.'}
                        </p>
                      </div>
                      <span className="text-base font-bold text-amber-700 font-mono shrink-0">
                        {st.recentScore !== undefined ? `${st.recentScore}đ` : 'Chưa có'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
