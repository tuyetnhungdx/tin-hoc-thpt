/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { LessonsView } from './components/LessonsView';
import { GradesView } from './components/GradesView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { School, Calendar, Download, RefreshCw } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, teacherInfo, exportSingleHtmlApp, resetToSampleData, openConfirmDialog } = useApp();

  const handleReset = () => {
    openConfirmDialog({
      title: 'Khôi phục dữ liệu mẫu ban đầu?',
      message: 'Đặt lại toàn bộ dữ liệu danh sách lớp, học sinh và bài học môn Tin học về trạng thái chuẩn ban đầu của cô Trần Thị Tuyết Nhung.',
      confirmLabel: 'Khôi phục mẫu',
      onConfirm: resetToSampleData,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar & Mobile Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              <School className="w-4 h-4 text-sky-600" />
              <span>{teacherInfo.school}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Chế độ ngoại tuyến • Dữ liệu cục bộ an toàn</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportSingleHtmlApp}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 px-3 py-1.5 rounded-lg transition"
              title="Xuất file HTML hoàn chỉnh có thể mở offline"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Xuất File HTML Độc Lập</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              title="Khôi phục dữ liệu mẫu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'classes' && <ClassesView />}
          {activeTab === 'students' && <StudentsView />}
          {activeTab === 'lessons' && <LessonsView />}
          {activeTab === 'grades' && <GradesView />}
          {activeTab === 'stats' && <StatsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
