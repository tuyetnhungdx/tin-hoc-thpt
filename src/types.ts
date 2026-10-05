export type GradeLevel = 10 | 11 | 12;

export type LearningStatus = 'Hoàn thành tốt' | 'Đạt' | 'Cần hỗ trợ';

export type LessonStatus = 'Chưa bắt đầu' | 'Đang thực hiện' | 'Đã hoàn thành';

export type CompletionLevel = 'Hoàn thành tốt' | 'Đạt' | 'Chưa đạt';

export type PriorityLevel = 'Bình thường' | 'Quan trọng' | 'Khẩn cấp';

export interface TeacherInfo {
  name: string;
  subject: string;
  school: string;
  academicYear: string;
  email?: string;
  phone?: string;
  room?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  grade: GradeLevel;
  room: string;
  academicYear: string;
  description?: string;
}

export interface Student {
  id: string;
  code: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  classId: string;
  dateOfBirth?: string;
  status: LearningStatus;
  recentScore?: number;
  notes?: string;
  parentPhone?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  classIds: string[];
  executionDate: string;
  status: LessonStatus;
  topicCode?: string;
}

export interface GradeResult {
  id: string;
  studentId: string;
  classId: string;
  lessonId: string;
  score: number;
  completionLevel: CompletionLevel;
  comment: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  text: string;
  timestamp: string;
  type: 'class' | 'student' | 'lesson' | 'grade' | 'todo';
}

export interface TodoItem {
  id: string;
  text: string;
  isDone: boolean;
  dueDate?: string;
  priority: PriorityLevel;
}

export type ActiveTab = 
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'lessons'
  | 'grades'
  | 'stats'
  | 'settings';
