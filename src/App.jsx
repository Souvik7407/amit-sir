import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AdminAuthModal from './components/AdminAuthModal';
import StudentHome from './pages/StudentHome';
import CourseView from './pages/CourseView';
import TeacherDashboard from './pages/TeacherDashboard';
import MathBackground from './components/MathBackground';

function AppContent() {
  const { user } = useApp();
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  return (
    <>
      <MathBackground />
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)} 
      />

      <main style={{ flex: 1, position: 'relative' }}>
        {user?.role === 'teacher' ? (
          <TeacherDashboard />
        ) : activeCourseId ? (
          <CourseView 
            courseId={activeCourseId} 
            onBack={() => setActiveCourseId(null)} 
          />
        ) : (
          <StudentHome 
            onSelectCourse={(course) => setActiveCourseId(course.id)} 
            onOpenAuth={() => setIsAuthOpen(true)} 
            onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
          />
        )}
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
      
      <AdminAuthModal 
        isOpen={isAdminAuthOpen} 
        onClose={() => setIsAdminAuthOpen(false)} 
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
