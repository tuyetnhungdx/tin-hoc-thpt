import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TeacherInfo,
  ClassItem,
  Student,
  Lesson,
  GradeResult,
  TodoItem,
  ActivityLog,
  ActiveTab,
} from '../types';
import {
  initialTeacherInfo,
  initialClasses,
  initialStudents,
  initialLessons,
  initialGrades,
  initialTodos,
  initialActivityLogs,
} from '../data/initialData';

const STORAGE_KEY = 'tro_ly_giao_vien_tuyet_nhung_data_v1';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  teacherInfo: TeacherInfo;
  updateTeacherInfo: (info: Partial<TeacherInfo>) => void;
  classes: ClassItem[];
  addClass: (cls: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  addStudents: (students: Omit<Student, 'id'>[], targetClassName?: string) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  grades: GradeResult[];
  addGrade: (grade: Omit<GradeResult, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<GradeResult>) => void;
  deleteGrade: (id: string) => void;
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  activities: ActivityLog[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  confirmDialog: ConfirmDialogState;
  openConfirmDialog: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirmDialog: () => void;
  resetToSampleData: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  exportSingleHtmlApp: () => void;
  // Navigation helper to open specific student or class
  selectedClassIdForFilter: string | null;
  setSelectedClassIdForFilter: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedClassIdForFilter, setSelectedClassIdForFilter] = useState<string | null>(null);

  // Core state
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teacher`);
      return saved ? JSON.parse(saved) : initialTeacherInfo;
    } catch {
      return initialTeacherInfo;
    }
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
      return saved ? JSON.parse(saved) : initialClasses;
    } catch {
      return initialClasses;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lessons`);
      return saved ? JSON.parse(saved) : initialLessons;
    } catch {
      return initialLessons;
    }
  });

  const [grades, setGrades] = useState<GradeResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_grades`);
      return saved ? JSON.parse(saved) : initialGrades;
    } catch {
      return initialGrades;
    }
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_todos`);
      return saved ? JSON.parse(saved) : initialTodos;
    } catch {
      return initialTodos;
    }
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : initialActivityLogs;
    } catch {
      return initialActivityLogs;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openConfirmDialog = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'Xác nhận xóa',
      cancelLabel: options.cancelLabel || 'Hủy bỏ',
      onConfirm: () => {
        options.onConfirm();
        closeConfirmDialog();
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_teacher`, JSON.stringify(teacherInfo));
    } catch (e) {
      console.error(e);
    }
  }, [teacherInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
    } catch (e) {
      console.error(e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_lessons`, JSON.stringify(lessons));
    } catch (e) {
      console.error(e);
    }
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
    } catch (e) {
      console.error(e);
    }
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_todos`, JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  }, [todos]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  const addActivity = (text: string, type: ActivityLog['type']) => {
    const now = new Date();
    const timeStr = `Hôm nay lúc ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAct: ActivityLog = {
      id: 'act-' + Date.now(),
      text,
      timestamp: timeStr,
      type,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Teacher Info
  const updateTeacherInfo = (info: Partial<TeacherInfo>) => {
    setTeacherInfo((prev) => ({ ...prev, ...info }));
    showToast('Đã cập nhật thông tin giáo viên thành công');
  };

  // Classes
  const addClass = (clsData: Omit<ClassItem, 'id'>) => {
    const newId = 'cls-' + Date.now();
    const newCls: ClassItem = { ...clsData, id: newId };
    setClasses((prev) => [...prev, newCls]);
    addActivity(`Đã thêm lớp học mới: ${clsData.name}`, 'class');
    showToast(`Đã thêm lớp ${clsData.name} thành công.`);
  };

  const updateClass = (id: string, clsData: Partial<ClassItem>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...clsData } : c))
    );
    addActivity(`Đã cập nhật thông tin lớp học`, 'class');
    showToast('Đã cập nhật thông tin lớp học.');
  };

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    const clsName = cls ? cls.name : '';
    setClasses((prev) => prev.filter((c) => c.id !== id));
    // Also remove relations
    setStudents((prev) => prev.filter((s) => s.classId !== id));
    setGrades((prev) => prev.filter((g) => g.classId !== id));
    addActivity(`Đã xóa lớp học: ${clsName}`, 'class');
    showToast(`Đã xóa lớp ${clsName} và dữ liệu liên quan.`, 'info');
  };

  // Students
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = 'std-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newStudent: Student = { ...studentData, id: newId };
    setStudents((prev) => [...prev, newStudent]);
    addActivity(`Đã thêm học sinh: ${studentData.fullName}`, 'student');
    showToast('Đã thêm học sinh thành công.');
  };

  const addStudents = (newStudentsData: Omit<Student, 'id'>[], targetClassName?: string) => {
    if (!newStudentsData || newStudentsData.length === 0) return;
    const timestamp = Date.now();
    const createdList: Student[] = newStudentsData.map((data, index) => ({
      ...data,
      id: `std-${timestamp}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    }));

    setStudents((prev) => [...prev, ...createdList]);
    const classNameMsg = targetClassName ? ` vào lớp ${targetClassName}` : '';
    addActivity(`Đã nhập danh sách ${createdList.length} học sinh từ Excel${classNameMsg}`, 'student');
    showToast(`Đã nhập thành công ${createdList.length} học sinh từ file Excel!`, 'success');
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...studentData } : s))
    );
    addActivity(`Đã cập nhật thông tin học sinh`, 'student');
    showToast('Đã cập nhật dữ liệu học sinh.');
  };

  const deleteStudent = (id: string) => {
    const std = students.find((s) => s.id === id);
    const stdName = std ? std.fullName : '';
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    addActivity(`Đã xóa học sinh: ${stdName}`, 'student');
    showToast(`Đã xóa học sinh ${stdName}.`, 'info');
  };

  // Lessons
  const addLesson = (lessonData: Omit<Lesson, 'id'>) => {
    const newId = 'ls-' + Date.now();
    const newLesson: Lesson = { ...lessonData, id: newId };
    setLessons((prev) => [newLesson, ...prev]);
    addActivity(`Đã tạo bài học mới: ${lessonData.title}`, 'lesson');
    showToast('Đã thêm bài học thành công.');
  };

  const updateLesson = (id: string, lessonData: Partial<Lesson>) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...lessonData } : l))
    );
    addActivity(`Đã cập nhật bài học`, 'lesson');
    showToast('Đã cập nhật dữ liệu bài học.');
  };

  const deleteLesson = (id: string) => {
    const ls = lessons.find((l) => l.id === id);
    const lsTitle = ls ? ls.title : '';
    setLessons((prev) => prev.filter((l) => l.id !== id));
    setGrades((prev) => prev.filter((g) => g.lessonId !== id));
    addActivity(`Đã xóa bài học: ${lsTitle}`, 'lesson');
    showToast('Đã xóa dữ liệu bài học.', 'info');
  };

  // Grades
  const addGrade = (gradeData: Omit<GradeResult, 'id'>) => {
    const newId = 'grd-' + Date.now();
    const newGrade: GradeResult = { ...gradeData, id: newId };
    setGrades((prev) => [newGrade, ...prev]);
    
    // Auto-update student recent score & status
    const student = students.find((s) => s.id === gradeData.studentId);
    if (student) {
      let newStatus: Student['status'] = 'Đạt';
      if (gradeData.score >= 8.0) newStatus = 'Hoàn thành tốt';
      else if (gradeData.score < 5.0) newStatus = 'Cần hỗ trợ';
      updateStudent(student.id, {
        recentScore: gradeData.score,
        status: newStatus,
      });
    }

    addActivity(`Đã nhập điểm cho học sinh`, 'grade');
    showToast('Đã cập nhật dữ liệu điểm số.');
  };

  const updateGrade = (id: string, gradeData: Partial<GradeResult>) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...gradeData } : g))
    );
    if (gradeData.score !== undefined && gradeData.studentId) {
      let newStatus: Student['status'] = 'Đạt';
      if (gradeData.score >= 8.0) newStatus = 'Hoàn thành tốt';
      else if (gradeData.score < 5.0) newStatus = 'Cần hỗ trợ';
      updateStudent(gradeData.studentId, {
        recentScore: gradeData.score,
        status: newStatus,
      });
    }
    addActivity(`Đã sửa kết quả học tập`, 'grade');
    showToast('Đã cập nhật dữ liệu.');
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
    addActivity(`Đã xóa bản ghi kết quả học tập`, 'grade');
    showToast('Đã xóa dữ liệu.', 'info');
  };

  // Todos
  const addTodo = (todoData: Omit<TodoItem, 'id'>) => {
    const newId = 'td-' + Date.now();
    setTodos((prev) => [{ ...todoData, id: newId }, ...prev]);
    showToast('Đã thêm công việc cần làm.');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast('Đã xóa việc cần làm.', 'info');
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    setTeacherInfo(initialTeacherInfo);
    setClasses(initialClasses);
    setStudents(initialStudents);
    setLessons(initialLessons);
    setGrades(initialGrades);
    setTodos(initialTodos);
    setActivities(initialActivityLogs);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
  };

  // Export JSON
  const exportJSON = () => {
    const exportData = {
      teacherInfo,
      classes,
      students,
      lessons,
      grades,
      todos,
      activities,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Du-Lieu-Tro-Ly-Tin-Hoc-Tran-Thi-Tuyet-Nhung-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất tập tin sao lưu dữ liệu JSON thành công.');
  };

  // Import JSON
  const importJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.classes && data.students) {
        if (data.teacherInfo) setTeacherInfo(data.teacherInfo);
        if (data.classes) setClasses(data.classes);
        if (data.students) setStudents(data.students);
        if (data.lessons) setLessons(data.lessons);
        if (data.grades) setGrades(data.grades);
        if (data.todos) setTodos(data.todos);
        if (data.activities) setActivities(data.activities);
        showToast('Đã nhập và phục hồi dữ liệu từ file thành công!');
        return true;
      }
      showToast('Định dạng file sao lưu không hợp lệ.', 'error');
      return false;
    } catch {
      showToast('Lỗi khi đọc file JSON sao lưu.', 'error');
      return false;
    }
  };

  // Export Standalone Single HTML app
  const exportSingleHtmlApp = () => {
    const payload = {
      teacherInfo,
      classes,
      students,
      lessons,
      grades,
      todos,
      activities,
    };
    const currentJson = JSON.stringify(payload);

    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trợ lý Quản trị Học tập – Trần Thị Tuyết Nhung (Bản độc lập)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; }
    @media print {
      .no-print { display: none !important; }
      .print-full { width: 100% !important; margin: 0 !important; }
    }
  </style>
</head>
<body class="text-slate-800 antialiased p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-sky-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider mb-2">Hồ sơ Giảng dạy Ngoại tuyến</span>
        <h1 class="text-2xl md:text-3xl font-bold">Trợ lý Quản trị Học tập – Trần Thị Tuyết Nhung</h1>
        <p class="text-sky-100 text-sm mt-1">Giáo viên: <strong>${teacherInfo.name}</strong> • Môn: <strong>${teacherInfo.subject}</strong> • Trường: <strong>${teacherInfo.school}</strong> • Năm học: ${teacherInfo.academicYear}</p>
      </div>
      <div class="no-print">
        <button onclick="window.print()" class="px-5 py-2.5 bg-white text-sky-800 font-semibold rounded-xl hover:bg-sky-50 transition shadow">In Báo Cáo / Lưu PDF</button>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-medium">Tổng số lớp học</p>
        <p class="text-2xl font-bold text-sky-700 mt-1">${classes.length}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-medium">Tổng số học sinh</p>
        <p class="text-2xl font-bold text-teal-700 mt-1">${students.length}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-medium">Bài học / Chuyên đề</p>
        <p class="text-2xl font-bold text-indigo-700 mt-1">${lessons.length}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-medium">Lượt đánh giá kết quả</p>
        <p class="text-2xl font-bold text-emerald-700 mt-1">${grades.length}</p>
      </div>
    </div>

    <!-- Classes & Students Section -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h2 class="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Danh Sách Lớp Học & Học Sinh</h2>
      <div class="space-y-6">
        ${classes.map(cls => {
          const clsStudents = students.filter(s => s.classId === cls.id);
          return `
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-sky-100 text-sky-800 font-bold rounded-lg text-base">Lớp ${cls.name}</span>
                  <span class="text-xs text-slate-500 font-medium">Phòng: ${cls.room}</span>
                </div>
                <span class="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">Sĩ số: ${clsStudents.length} học sinh</span>
              </div>
              <p class="text-xs text-slate-600 mb-3 italic">${cls.description || ''}</p>
              
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border border-slate-200 bg-white rounded-lg">
                  <thead class="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th class="p-2.5 border-b">STT</th>
                      <th class="p-2.5 border-b">Mã HS</th>
                      <th class="p-2.5 border-b">Họ và Tên</th>
                      <th class="p-2.5 border-b">Giới tính</th>
                      <th class="p-2.5 border-b">Trạng thái</th>
                      <th class="p-2.5 border-b">Điểm gần nhất</th>
                      <th class="p-2.5 border-b">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${clsStudents.map((st, idx) => `
                      <tr class="border-b border-slate-100 hover:bg-slate-50">
                        <td class="p-2.5 text-slate-500 font-mono">${idx + 1}</td>
                        <td class="p-2.5 font-mono text-sky-700">${st.code}</td>
                        <td class="p-2.5 font-semibold text-slate-800">${st.fullName}</td>
                        <td class="p-2.5">${st.gender}</td>
                        <td class="p-2.5">
                          <span class="px-2 py-0.5 rounded text-[11px] font-medium ${st.status === 'Hoàn thành tốt' ? 'bg-emerald-100 text-emerald-800' : st.status === 'Đạt' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'}">
                            ${st.status}
                          </span>
                        </td>
                        <td class="p-2.5 font-bold ${Number(st.recentScore) >= 8 ? 'text-emerald-600' : Number(st.recentScore) >= 5 ? 'text-sky-700' : 'text-amber-600'}">
                          ${st.recentScore !== undefined ? st.recentScore : '-'}
                        </td>
                        <td class="p-2.5 text-slate-600">${st.notes || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Lessons & Grades -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h2 class="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Kết Quả Học Tập & Điểm Số Môn Tin Học</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 bg-white rounded-lg">
          <thead class="bg-slate-100 text-slate-700 font-semibold">
            <tr>
              <th class="p-2.5 border-b">Học sinh</th>
              <th class="p-2.5 border-b">Lớp</th>
              <th class="p-2.5 border-b">Bài học / Chuyên đề</th>
              <th class="p-2.5 border-b">Điểm</th>
              <th class="p-2.5 border-b">Mức độ</th>
              <th class="p-2.5 border-b">Nhận xét của cô Tuyết Nhung</th>
              <th class="p-2.5 border-b">Ngày</th>
            </tr>
          </thead>
          <tbody>
            ${grades.map(g => {
              const std = students.find(s => s.id === g.studentId);
              const cls = classes.find(c => c.id === g.classId);
              const lsn = lessons.find(l => l.id === g.lessonId);
              return `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="p-2.5 font-semibold text-slate-800">${std ? std.fullName : 'Học sinh'}</td>
                  <td class="p-2.5 text-slate-600">${cls ? cls.name : '-'}</td>
                  <td class="p-2.5 text-slate-700">${lsn ? lsn.title : '-'}</td>
                  <td class="p-2.5 font-bold text-base text-sky-700">${g.score}</td>
                  <td class="p-2.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-medium ${g.completionLevel === 'Hoàn thành tốt' ? 'bg-emerald-100 text-emerald-800' : g.completionLevel === 'Đạt' ? 'bg-sky-100 text-sky-800' : 'bg-red-100 text-red-800'}">
                      ${g.completionLevel}
                    </span>
                  </td>
                  <td class="p-2.5 text-slate-600 italic">${g.comment}</td>
                  <td class="p-2.5 text-slate-500">${g.updatedAt}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="text-center text-xs text-slate-400 pt-4 pb-6">
      Trợ lý Quản trị Học tập – Cô Trần Thị Tuyết Nhung • THPT Nguyễn Dục • Dữ liệu lưu trữ nội bộ
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tro-Ly-Quan-Tri-Hoc-Tap-Tran-Thi-Tuyet-Nhung-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống file HTML độc lập có thể mở trực tiếp không cần mạng!');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        teacherInfo,
        updateTeacherInfo,
        classes,
        addClass,
        updateClass,
        deleteClass,
        students,
        addStudent,
        addStudents,
        updateStudent,
        deleteStudent,
        lessons,
        addLesson,
        updateLesson,
        deleteLesson,
        grades,
        addGrade,
        updateGrade,
        deleteGrade,
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        activities,
        showToast,
        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,
        resetToSampleData,
        exportJSON,
        importJSON,
        exportSingleHtmlApp,
        selectedClassIdForFilter,
        setSelectedClassIdForFilter,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : toast.type === 'info'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span className="text-base">
              {toast.type === 'success' ? '✓' : toast.type === 'info' ? 'ℹ' : '⚠'}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Global Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirmDialog}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition"
              >
                {confirmDialog.cancelLabel || 'Hủy bỏ'}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition shadow-sm"
              >
                {confirmDialog.confirmLabel || 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
