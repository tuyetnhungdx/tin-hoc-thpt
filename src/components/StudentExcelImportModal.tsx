import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Layers,
  ArrowRight,
  FileCheck,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  downloadStudentExcelTemplate,
  parseStudentExcelFile,
  ParsedExcelStudent,
} from '../utils/excelHelper';
import { Student } from '../types';

interface StudentExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId?: string;
}

export const StudentExcelImportModal: React.FC<StudentExcelImportModalProps> = ({
  isOpen,
  onClose,
  defaultClassId,
}) => {
  const { classes, addStudents, showToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    defaultClassId || (classes[0] ? classes[0].id : '')
  );
  const [autoDetectClass, setAutoDetectClass] = useState<boolean>(true);

  const [fileName, setFileName] = useState<string>('');
  const [parsedStudents, setParsedStudents] = useState<ParsedExcelStudent[]>([]);
  const [selectedTempIds, setSelectedTempIds] = useState<Set<string>>(new Set());
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewSearch, setPreviewSearch] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentTargetClass = classes.find((c) => c.id === selectedClassId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setIsParsing(true);
    setFileName(file.name);

    try {
      const results = await parseStudentExcelFile(file, classes);
      if (results.length === 0) {
        setParseError('Không tìm thấy học sinh nào trong file vừa tải lên.');
        setParsedStudents([]);
        setSelectedTempIds(new Set());
      } else {
        setParsedStudents(results);
        // Select all valid ones by default
        const validIds = new Set(results.filter((r) => r.isValid).map((r) => r.idTemp));
        setSelectedTempIds(validIds);
      }
    } catch (err: any) {
      setParseError(err.message || 'Lỗi khi phân tích file Excel.');
      setParsedStudents([]);
      setSelectedTempIds(new Set());
    } finally {
      setIsParsing(false);
      // Reset input value so same file can be re-selected if edited
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const className = currentTargetClass?.name || '10A1';
    downloadStudentExcelTemplate(className);
    showToast('Đã tải xuống file Excel mẫu thành công!', 'info');
  };

  const handleToggleSelectAll = () => {
    const validStudents = parsedStudents.filter((s) => s.isValid);
    if (selectedTempIds.size === validStudents.length) {
      setSelectedTempIds(new Set());
    } else {
      setSelectedTempIds(new Set(validStudents.map((s) => s.idTemp)));
    }
  };

  const handleToggleRow = (idTemp: string) => {
    setSelectedTempIds((prev) => {
      const next = new Set(prev);
      if (next.has(idTemp)) {
        next.delete(idTemp);
      } else {
        next.add(idTemp);
      }
      return next;
    });
  };

  const handleExecuteImport = () => {
    const chosenList = parsedStudents.filter((s) => selectedTempIds.has(s.idTemp) && s.isValid);

    if (chosenList.length === 0) {
      showToast('Vui lòng chọn ít nhất một học sinh hợp lệ để nhập.', 'warning');
      return;
    }

    // Prepare payload
    const toImport: Omit<Student, 'id'>[] = chosenList.map((item) => {
      // Find class ID: if autoDetectClass is true and item has suggestedClassName, try matching
      let targetClsId = selectedClassId;
      if (autoDetectClass && item.suggestedClassName) {
        const found = classes.find(
          (c) =>
            c.name.toLowerCase().trim() === item.suggestedClassName?.toLowerCase().trim() ||
            c.name.toLowerCase().replace('lớp', '').trim() === item.suggestedClassName?.toLowerCase().replace('lớp', '').trim()
        );
        if (found) {
          targetClsId = found.id;
        }
      }

      return {
        fullName: item.fullName,
        code: item.code,
        gender: item.gender,
        classId: targetClsId,
        dateOfBirth: item.dateOfBirth,
        parentPhone: item.parentPhone,
        status: item.status,
        recentScore: item.recentScore,
        notes: item.notes,
      };
    });

    addStudents(toImport, currentTargetClass?.name);
    onClose();
  };

  const validCount = parsedStudents.filter((s) => s.isValid).length;
  const invalidCount = parsedStudents.length - validCount;

  const filteredPreview = parsedStudents.filter((s) => {
    if (!previewSearch) return true;
    const term = previewSearch.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      (s.suggestedClassName || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col justify-between my-auto">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nhập Danh Sách Học Sinh Bằng File Excel
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tải lên bảng tính (.xlsx, .xls, .csv). Hệ thống tự động phân loại cột họ tên, mã học sinh, điểm và số điện thoại.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Configuration & File Selection Area */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Class Selection */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                1. Chọn Lớp Tiếp Nhận
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.academicYear})
                  </option>
                ))}
              </select>

              <label className="mt-3 flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDetectClass}
                  onChange={(e) => setAutoDetectClass(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span>Tự động khớp lớp nếu trong file có cột &ldquo;Lớp&rdquo;</span>
              </label>
            </div>

            {/* Template Download Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <Download className="w-4 h-4 text-emerald-600" />
                  2. Chưa có file mẫu?
                </span>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Tải ngay mẫu Excel chuẩn môn Tin học có sẵn các cột STT, Họ tên, Điểm số, SĐT phụ huynh...
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Mẫu Excel (.xlsx)</span>
              </button>
            </div>

            {/* Upload File Area */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  3. Chọn Tệp Tin Excel
                </span>
                <p className="text-[11px] text-slate-500 truncate">
                  {fileName ? `Đã chọn: ${fileName}` : 'Hỗ trợ .xlsx, .xls, .csv'}
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excel-file-input"
                />
                <label
                  htmlFor="excel-file-input"
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{fileName ? 'Chọn File Khác...' : 'Tải File Lên'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Parsing State & Errors */}
          {isParsing && (
            <div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center gap-2 text-sky-700 text-sm font-medium">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent" />
              <span>Đang đọc và phân tích cấu trúc bảng tính Excel...</span>
            </div>
          )}

          {parseError && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedStudents.length > 0 && (
            <div className="mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Xem Trước Danh Sách ({parsedStudents.length} học sinh)</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {validCount} hợp lệ
                  </span>
                  {invalidCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {invalidCount} lỗi
                    </span>
                  )}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Lọc nhanh danh sách..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedTempIds.size === validCount && validCount > 0}
                          onChange={handleToggleSelectAll}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                      </th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và Tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Lớp gán</th>
                      <th className="py-2.5 px-3 text-center">Điểm</th>
                      <th className="py-2.5 px-3">Mức độ</th>
                      <th className="py-2.5 px-3">SĐT Phụ huynh</th>
                      <th className="py-2.5 px-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPreview.map((st, idx) => {
                      const isSelected = selectedTempIds.has(st.idTemp);
                      const targetClassDisplay =
                        autoDetectClass && st.suggestedClassName
                          ? st.suggestedClassName
                          : currentTargetClass?.name || '10A1';

                      return (
                        <tr
                          key={st.idTemp}
                          className={`hover:bg-slate-50 transition ${
                            !st.isValid
                              ? 'bg-red-50/40 text-red-700'
                              : isSelected
                              ? 'bg-emerald-50/30'
                              : ''
                          }`}
                        >
                          <td className="py-2 px-3 text-center">
                            {st.isValid ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleRow(st.idTemp)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                            ) : (
                              <span title={st.errorReason || 'Dữ liệu không hợp lệ'} className="inline-flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-500 inline" />
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-medium text-slate-600">
                            {st.code}
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {st.fullName}
                          </td>
                          <td className="py-2 px-3 text-slate-600">
                            {st.gender}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                              Lớp {targetClassDisplay}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-700">
                            {st.recentScore !== undefined ? st.recentScore : '-'}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
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
                          <td className="py-2 px-3 text-slate-500">
                            {st.parentPhone || '-'}
                          </td>
                          <td className="py-2 px-3 text-slate-500 max-w-xs truncate" title={st.notes}>
                            {st.notes || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-slate-500">
            {parsedStudents.length > 0 ? (
              <span>
                Đã chọn <strong>{selectedTempIds.size}</strong> trên tổng số <strong>{validCount}</strong> học sinh hợp lệ
              </span>
            ) : (
              <span>Vui lòng tải lên file Excel để xem trước dữ liệu</span>
            )}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={selectedTempIds.size === 0}
              onClick={handleExecuteImport}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>Xác Nhận Nhập {selectedTempIds.size > 0 ? `(${selectedTempIds.size} em)` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
