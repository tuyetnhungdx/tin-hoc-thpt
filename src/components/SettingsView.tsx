import React, { useState } from 'react';
import {
  Settings,
  User,
  School,
  Save,
  Download,
  Upload,
  RotateCcw,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    teacherInfo,
    updateTeacherInfo,
    resetToSampleData,
    exportJSON,
    importJSON,
    exportSingleHtmlApp,
    openConfirmDialog,
  } = useApp();

  const [name, setName] = useState(teacherInfo.name);
  const [subject, setSubject] = useState(teacherInfo.subject);
  const [school, setSchool] = useState(teacherInfo.school);
  const [academicYear, setAcademicYear] = useState(teacherInfo.academicYear);
  const [email, setEmail] = useState(teacherInfo.email || '');
  const [phone, setPhone] = useState(teacherInfo.phone || '');
  const [room, setRoom] = useState(teacherInfo.room || '');

  const handleSaveTeacherInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherInfo({
      name: name.trim(),
      subject: subject.trim(),
      school: school.trim(),
      academicYear: academicYear.trim(),
      email: email.trim(),
      phone: phone.trim(),
      room: room.trim(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetPrompt = () => {
    openConfirmDialog({
      title: 'Khôi phục về dữ liệu mẫu ban đầu?',
      message:
        'Hệ thống sẽ nạp lại toàn bộ dữ liệu mẫu ban đầu của cô Trần Thị Tuyết Nhung (các lớp 10A1, 10A2, 11A1, 12A1 cùng học sinh và điểm số môn Tin học). Toàn bộ dữ liệu bạn đã sửa đổi trước đó sẽ được thay thế.',
      confirmLabel: 'Khôi phục dữ liệu mẫu',
      onConfirm: () => {
        resetToSampleData();
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-sky-600" />
          Cài Đặt Hệ Thống & Quản Trị Dữ Liệu
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tùy chỉnh thông tin giáo viên, sao lưu dữ liệu nội bộ và xuất bản báo cáo giảng dạy.
        </p>
      </div>

      {/* 1. Teacher Information Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
          <User className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900">Thông Tin Giáo Viên Phụ Trách</h2>
        </div>

        <form onSubmit={handleSaveTeacherInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và Tên Giáo viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trường THPT giảng dạy <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn giảng dạy <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phòng thực hành chính
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email công vụ / liên hệ
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên lạc
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thông Tin Giáo Viên</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Data Backup, Export & Single File HTML */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">Sao Lưu & Quản Lý Dữ Liệu Ngoại Tuyến</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Ứng dụng hoạt động hoàn toàn trực tiếp trên trình duyệt bằng cơ chế lưu trữ nội bộ (localStorage). Không cần kết nối internet hay máy chủ ngoài. Bạn có thể tự do sao lưu, nạp lại hoặc xuất file HTML độc lập bất cứ lúc nào.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50/50 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sao Lưu Dữ Liệu JSON</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tải toàn bộ lớp, học sinh, điểm và bài học về máy tính để lưu trữ an toàn.
              </p>
            </div>
            <button
              type="button"
              onClick={exportJSON}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition text-center shadow-xs"
            >
              Tải file sao lưu (.json)
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/50 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Phục Hồi Dữ Liệu</h3>
              <p className="text-xs text-slate-500 mt-1">
                Nạp lại dữ liệu đã lưu từ file JSON sao lưu trước đó trên máy.
              </p>
            </div>
            <label className="mt-4 w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition text-center cursor-pointer shadow-xs block">
              <span>Chọn file JSON phục hồi</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Export Single-file HTML */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Xuất File HTML Độc Lập</h3>
              <p className="text-xs text-slate-500 mt-1">
                Xuất file HTML hoàn chỉnh để lưu trữ, mở xem trực tiếp bằng trình duyệt và in ấn báo cáo.
              </p>
            </div>
            <button
              type="button"
              onClick={exportSingleHtmlApp}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition text-center shadow-xs"
            >
              Tải file HTML hoàn chỉnh (.html)
            </button>
          </div>

          {/* Reset sample data */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/50 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Khôi Phục Mẫu Ban Đầu</h3>
              <p className="text-xs text-slate-500 mt-1">
                Đặt lại các lớp 10A1, 10A2, 11A1, 12A1 cùng dữ liệu Tin học mặc định.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetPrompt}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition text-center shadow-xs"
            >
              Khôi phục dữ liệu mẫu
            </button>
          </div>
        </div>
      </div>

      {/* 3. Guide & Principles */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-bold text-slate-900">Hướng Dẫn Nhanh Dành Cho Giáo Viên THPT</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">1. Thao tác trên phòng máy & máy chiếu</h4>
            <p className="leading-relaxed">
              Các nút bấm được thiết kế kích thước lớn, font chữ rõ ràng, dễ dàng bấm chọn bằng chuột máy tính hoặc chạm trực tiếp trên màn hình cảm ứng / bảng tương tác thông minh.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">2. Quản lý điểm & xếp loại học lực</h4>
            <p className="leading-relaxed">
              Hệ thống tự động đồng bộ điểm số mới nhất và cập nhật trạng thái học sinh (Hoàn thành tốt: ≥ 8.0, Đạt: 5.0 - 7.9, Cần hỗ trợ: &lt; 5.0).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">3. Bảo mật & quyền riêng tư</h4>
            <p className="leading-relaxed">
              Không gửi dữ liệu học sinh ra bất kỳ máy chủ nào. Mọi thông tin được giữ kín tuyệt đối trên thiết bị của cô Trần Thị Tuyết Nhung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
