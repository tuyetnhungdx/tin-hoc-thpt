import * as XLSX from 'xlsx';
import { Student, LearningStatus, ClassItem } from '../types';

export interface ParsedExcelStudent {
  idTemp: string;
  fullName: string;
  code: string;
  gender: 'Nam' | 'Nữ';
  dateOfBirth?: string;
  parentPhone?: string;
  status: LearningStatus;
  recentScore?: number;
  notes?: string;
  suggestedClassName?: string;
  isValid: boolean;
  errorReason?: string;
}

/**
 * Downloads a pre-formatted Excel template for high school teachers
 */
export function downloadStudentExcelTemplate(defaultClassName: string = '10A1') {
  const sampleData = [
    {
      'STT': 1,
      'Mã học sinh': 'HS10-001',
      'Họ và tên (*)': 'Nguyễn Văn An',
      'Giới tính': 'Nam',
      'Lớp': defaultClassName,
      'Ngày sinh (YYYY-MM-DD)': '2009-03-15',
      'Điểm gần nhất (thang 10)': 8.5,
      'Mức độ học tập': 'Hoàn thành tốt',
      'SĐT Phụ huynh': '0905 123 456',
      'Ghi chú sư phạm': 'Thực hành máy tính nhanh nhẹn, chăm chỉ'
    },
    {
      'STT': 2,
      'Mã học sinh': 'HS10-002',
      'Họ và tên (*)': 'Trần Thị Mai',
      'Giới tính': 'Nữ',
      'Lớp': defaultClassName,
      'Ngày sinh (YYYY-MM-DD)': '2009-07-22',
      'Điểm gần nhất (thang 10)': 9.0,
      'Mức độ học tập': 'Hoàn thành tốt',
      'SĐT Phụ huynh': '0912 345 678',
      'Ghi chú sư phạm': 'Cán sự bộ môn Tin học, hỗ trợ tốt các bạn'
    },
    {
      'STT': 3,
      'Mã học sinh': 'HS10-003',
      'Họ và tên (*)': 'Lê Hoàng Nam',
      'Giới tính': 'Nam',
      'Lớp': defaultClassName,
      'Ngày sinh (YYYY-MM-DD)': '2009-11-05',
      'Điểm gần nhất (thang 10)': 5.0,
      'Mức độ học tập': 'Cần hỗ trợ',
      'SĐT Phụ huynh': '0987 654 321',
      'Ghi chú sư phạm': 'Cần cô kèm thêm thao tác lưu file và cú pháp lệnh'
    },
    {
      'STT': 4,
      'Mã học sinh': 'HS10-004',
      'Họ và tên (*)': 'Phạm Thị Quỳnh',
      'Giới tính': 'Nữ',
      'Lớp': defaultClassName,
      'Ngày sinh (YYYY-MM-DD)': '2009-09-18',
      'Điểm gần nhất (thang 10)': 7.5,
      'Mức độ học tập': 'Đạt',
      'SĐT Phụ huynh': '0935 888 999',
      'Ghi chú sư phạm': 'Hoàn thành bài tập đúng thời gian quy định'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths for beautiful presentation
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 15 }, // Mã HS
    { wch: 24 }, // Họ và tên
    { wch: 12 }, // Giới tính
    { wch: 10 }, // Lớp
    { wch: 22 }, // Ngày sinh
    { wch: 24 }, // Điểm gần nhất
    { wch: 20 }, // Mức độ
    { wch: 18 }, // SĐT
    { wch: 45 }, // Ghi chú
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');

  const fileName = `Mau_Danh_Sach_Hoc_Sinh_THPT_Nguyen_Duc.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Exports current student list to Excel for teachers
 */
export function exportStudentsToExcel(students: Student[], classes: ClassItem[], fileNameSuffix: string = '') {
  const data = students.map((st, index) => {
    const cls = classes.find((c) => c.id === st.classId);
    return {
      'STT': index + 1,
      'Mã học sinh': st.code,
      'Họ và tên': st.fullName,
      'Giới tính': st.gender,
      'Lớp': cls ? cls.name : 'Chưa xếp',
      'Ngày sinh': st.dateOfBirth || '',
      'Điểm gần nhất': st.recentScore !== undefined ? st.recentScore : '',
      'Mức độ học tập': st.status,
      'SĐT Phụ huynh': st.parentPhone || '',
      'Ghi chú': st.notes || '',
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
  const fileName = `Danh_Sach_Hoc_Sinh_${fileNameSuffix || 'TinHoc'}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Normalizes text to lowercase and removes accents for flexible header matching
 */
function normalizeHeader(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Parse date values that could be Excel serial numbers or strings (e.g. 2009-05-15 or 15/05/2009)
 */
function parseExcelDate(val: any): string | undefined {
  if (!val) return undefined;
  if (typeof val === 'number') {
    // Excel date serial number conversion
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  const str = String(val).trim();
  // Check for YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    return str;
  }
  // Check for DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  return str;
}

/**
 * Parses an Excel or CSV file into candidate student records
 */
export async function parseStudentExcelFile(
  file: File,
  availableClasses: ClassItem[]
): Promise<ParsedExcelStudent[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('File không chứa trang tính (sheet) nào.');
        }

        const sheet = workbook.Sheets[sheetName];
        // Read raw 2D array
        const rawRows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
          defval: '',
        }) as any[][];

        if (rawRows.length < 2) {
          throw new Error('File Excel rỗng hoặc không có dữ liệu hàng.');
        }

        // Find header row (the first row with text that looks like student headers)
        let headerRowIdx = -1;
        for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
          const rowStr = rawRows[i].map((c) => String(c)).join(' ').toLowerCase();
          if (
            rowStr.includes('tên') ||
            rowStr.includes('name') ||
            rowStr.includes('học sinh') ||
            rowStr.includes('mã')
          ) {
            headerRowIdx = i;
            break;
          }
        }

        if (headerRowIdx === -1) {
          headerRowIdx = 0; // Default to first row
        }

        const headerRow = rawRows[headerRowIdx].map((c) => String(c).trim());

        // Map column indices
        let colFullName = -1;
        let colCode = -1;
        let colGender = -1;
        let colClass = -1;
        let colDOB = -1;
        let colScore = -1;
        let colStatus = -1;
        let colPhone = -1;
        let colNotes = -1;

        headerRow.forEach((hdr, idx) => {
          const norm = normalizeHeader(hdr);
          if (colFullName === -1 && (norm.includes('hoten') || norm.includes('hovaten') || norm.includes('ten') || norm.includes('fullname') || norm.includes('name'))) {
            colFullName = idx;
          } else if (colCode === -1 && (norm.includes('mahs') || norm.includes('mahocsinh') || norm.includes('maso') || norm.includes('code') || norm.includes('id'))) {
            colCode = idx;
          } else if (colGender === -1 && (norm.includes('gioitinh') || norm.includes('gender') || norm.includes('phai'))) {
            colGender = idx;
          } else if (colClass === -1 && (norm.includes('lop') || norm.includes('class') || norm.includes('lophoc'))) {
            colClass = idx;
          } else if (colDOB === -1 && (norm.includes('ngaysinh') || norm.includes('dob') || norm.includes('birth') || norm.includes('namssinh'))) {
            colDOB = idx;
          } else if (colScore === -1 && (norm.includes('diem') || norm.includes('score') || norm.includes('mark'))) {
            colScore = idx;
          } else if (colStatus === -1 && (norm.includes('mucdo') || norm.includes('trangthai') || norm.includes('hocluc') || norm.includes('status'))) {
            colStatus = idx;
          } else if (colPhone === -1 && (norm.includes('sdt') || norm.includes('dienthoai') || norm.includes('phone') || norm.includes('phuhuynh'))) {
            colPhone = idx;
          } else if (colNotes === -1 && (norm.includes('ghichu') || norm.includes('nhanxet') || norm.includes('note') || norm.includes('danhgia'))) {
            colNotes = idx;
          }
        });

        // Fallback: If no column identified as name, use column 1 or 2
        if (colFullName === -1) {
          if (headerRow.length > 2) colFullName = 2;
          else if (headerRow.length > 1) colFullName = 1;
          else colFullName = 0;
        }

        const parsedList: ParsedExcelStudent[] = [];

        for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
          const row = rawRows[r];
          if (!row || row.length === 0) continue;

          const rawName = colFullName >= 0 ? String(row[colFullName] || '').trim() : '';
          // Skip if completely empty row or header repeated
          if (!rawName || rawName.toLowerCase() === 'họ và tên' || rawName.toLowerCase() === 'họ tên') {
            continue;
          }

          // Generate fallback code if missing
          const rawCode = colCode >= 0 && row[colCode] ? String(row[colCode]).trim() : `HS-${Math.floor(1000 + Math.random() * 9000)}`;

          // Gender
          let gender: 'Nam' | 'Nữ' = 'Nam';
          if (colGender >= 0 && row[colGender]) {
            const gStr = String(row[colGender]).trim().toLowerCase();
            if (gStr.includes('nữ') || gStr.includes('nu') || gStr.includes('female') || gStr === 'f') {
              gender = 'Nữ';
            }
          }

          // Class
          const rawClass = colClass >= 0 && row[colClass] ? String(row[colClass]).trim() : undefined;

          // Date of birth
          const rawDOB = colDOB >= 0 ? parseExcelDate(row[colDOB]) : undefined;

          // Score
          let score: number | undefined = undefined;
          if (colScore >= 0 && row[colScore] !== undefined && row[colScore] !== '') {
            const num = parseFloat(String(row[colScore]).replace(',', '.'));
            if (!isNaN(num) && num >= 0 && num <= 10) {
              score = num;
            }
          }

          // Status
          let status: LearningStatus = 'Đạt';
          if (colStatus >= 0 && row[colStatus]) {
            const sStr = String(row[colStatus]).trim().toLowerCase();
            if (sStr.includes('tốt') || sStr.includes('tot') || sStr.includes('giỏi')) {
              status = 'Hoàn thành tốt';
            } else if (sStr.includes('hỗ trợ') || sStr.includes('ho tro') || sStr.includes('yếu') || sStr.includes('chưa đạt')) {
              status = 'Cần hỗ trợ';
            }
          } else if (score !== undefined) {
            if (score >= 8.0) status = 'Hoàn thành tốt';
            else if (score < 5.0) status = 'Cần hỗ trợ';
            else status = 'Đạt';
          }

          // Phone
          const rawPhone = colPhone >= 0 && row[colPhone] ? String(row[colPhone]).trim() : undefined;

          // Notes
          const rawNotes = colNotes >= 0 && row[colNotes] ? String(row[colNotes]).trim() : undefined;

          parsedList.push({
            idTemp: `temp-${r}-${Date.now()}`,
            fullName: rawName,
            code: rawCode,
            gender,
            dateOfBirth: rawDOB,
            parentPhone: rawPhone,
            status,
            recentScore: score,
            notes: rawNotes,
            suggestedClassName: rawClass,
            isValid: Boolean(rawName.length >= 2),
            errorReason: rawName.length < 2 ? 'Tên quá ngắn hoặc không hợp lệ' : undefined,
          });
        }

        resolve(parsedList);
      } catch (err: any) {
        reject(new Error(err.message || 'Lỗi khi đọc file Excel.'));
      }
    };

    reader.onerror = () => reject(new Error('Không thể đọc tệp tin.'));
    reader.readAsArrayBuffer(file);
  });
}
