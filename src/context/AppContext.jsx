import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialCourses = [
  {
    id: 'jee-calc-101',
    title: 'JEE Advanced Calculus Masterclass',
    description: 'Master differentiation, integration, limits, and differential equations with Amit Sir. Includes 30+ hours of video lectures and live doubt clearance sessions.',
    price: 4999,
    originalPrice: 9999,
    activeMembers: 142,
    rating: 4.9,
    content: [
      { id: 'v1', type: 'video', title: '1. Limits and Continuity - Core Concepts', duration: '45 mins', url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-displaying-financial-charts-40156-large.mp4', isLive: false },
      { id: 'v2', type: 'video', title: '2. Methods of Differentiation - Advanced Rules', duration: '52 mins', url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smart-phone-with-a-blue-screen-40899-large.mp4', isLive: false },
      { id: 'v3', type: 'video', title: '3. Definite Integrals & Properties (Live Stream)', duration: 'Live Session', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-at-home-40916-large.mp4', isLive: true }
    ]
  },
  {
    id: 'boards-matrix-12',
    title: 'Class 12 Boards - Matrices & Determinants',
    description: 'Complete syllabus coverage for high-scoring board topics. Learn matrix operations, adjoint, inverse, and system of equations equations in simple terms.',
    price: 2499,
    originalPrice: 4999,
    activeMembers: 98,
    rating: 4.8,
    content: [
      { id: 'm1', type: 'video', title: '1. Operations on Matrices', duration: '35 mins', url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-displaying-financial-charts-40156-large.mp4', isLive: false },
      { id: 'm2', type: 'video', title: '2. Properties of Determinants', duration: '40 mins', url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smart-phone-with-a-blue-screen-40899-large.mp4', isLive: false }
    ]
  },
  {
    id: 'olympiad-algebra',
    title: 'Olympiad Standard Algebra & Theory of Equations',
    description: 'Special batch designed for RMO, INMO, and national-level competitive math Olympiads. Dive deep into polynomials, inequalities, and complex systems.',
    price: 6999,
    originalPrice: 11999,
    activeMembers: 36,
    rating: 5.0,
    content: [
      { id: 'a1', type: 'video', title: '1. Cauchy-Schwarz Inequality Proofs', duration: '1 hr 10 mins', url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-displaying-financial-charts-40156-large.mp4', isLive: false },
      { id: 'a2', type: 'video', title: '2. Polynomials - Symmetric Functions of Roots (Live)', duration: 'Live Session', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-at-home-40916-large.mp4', isLive: true }
    ]
  }
];

const initialDoubts = [
  {
    id: 'd1',
    courseId: 'jee-calc-101',
    courseTitle: 'JEE Advanced Calculus Masterclass',
    studentName: 'Sourav Sen',
    studentEmail: 'sourav@maths.com',
    question: 'In the limit question as x approaches 0 for (sin x)/x, how do we mathematically prove it using the sandwich theorem? The geometry is a bit confusing.',
    timestamp: '2026-08-09T08:30:00Z',
    status: 'pending',
    reply: null
  },
  {
    id: 'd2',
    courseId: 'boards-matrix-12',
    courseTitle: 'Class 12 Boards - Matrices & Determinants',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul@boards.com',
    question: 'How is cofactor matrix different from transpose? Can you show step by step?',
    timestamp: '2026-08-08T14:20:00Z',
    status: 'resolved',
    reply: 'Hi Rahul! The cofactor matrix is created by replacing each element in the matrix with its cofactor (sign-adjusted minor). The transpose, on the other hand, simply swaps the rows and columns. To find the adjoint, you calculate the cofactor matrix and then take its transpose. Let me know if that helps!'
  }
];

export const AppProvider = ({ children }) => {
  // App state
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('amitsir_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(course => {
          const matchingInitial = initialCourses.find(ic => ic.id === course.id);
          const originalPrice = course.originalPrice || (matchingInitial ? matchingInitial.originalPrice : course.price * 2);
          return {
            ...course,
            originalPrice
          };
        });
      } catch (e) {
        return initialCourses;
      }
    }
    return initialCourses;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('amitsir_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [enrollments, setEnrollments] = useState(() => {
    const saved = localStorage.getItem('amitsir_enrollments');
    return saved ? JSON.parse(saved) : ['boards-matrix-12']; // default enrollment for test student
  });

  const [doubts, setDoubts] = useState(() => {
    const saved = localStorage.getItem('amitsir_doubts');
    return saved ? JSON.parse(saved) : initialDoubts;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('amitsir_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('amitsir_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('amitsir_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('amitsir_doubts', JSON.stringify(doubts));
  }, [doubts]);

  // Auth actions
  const login = (userData) => {
    setUser(userData);
    if (userData.name === 'Demo Student') {
      setEnrollments(courses.map(c => c.id));
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Course actions
  const addCourse = (course) => {
    const newCourse = {
      ...course,
      id: `course-${Date.now()}`,
      activeMembers: 0,
      rating: 5.0,
      content: []
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    // also clean up enrollments
    setEnrollments(prev => prev.filter(id => id !== courseId));
  };

  const enrollInCourse = (courseId) => {
    if (!enrollments.includes(courseId)) {
      setEnrollments(prev => [...prev, courseId]);
      // Increment student count in course details
      setCourses(prev => prev.map(c => {
        if (c.id === courseId) {
          return { ...c, activeMembers: (c.activeMembers || 0) + 1 };
        }
        return c;
      }));
    }
  };

  const addContentToCourse = (courseId, contentItem) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          content: [...c.content, { ...contentItem, id: `cont-${Date.now()}` }]
        };
      }
      return c;
    }));
  };

  const deleteContentFromCourse = (courseId, contentId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          content: c.content.filter(item => item.id !== contentId)
        };
      }
      return c;
    }));
  };

  // Doubt actions
  const addDoubt = (courseId, courseTitle, question) => {
    const newDoubt = {
      id: `doubt-${Date.now()}`,
      courseId,
      courseTitle,
      studentName: user ? user.name : 'Guest Student',
      studentEmail: user ? user.email : 'guest@student.com',
      question,
      timestamp: new Date().toISOString(),
      status: 'pending',
      reply: null
    };
    setDoubts(prev => [newDoubt, ...prev]);
  };

  const resolveDoubt = (doubtId, replyText) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          status: 'resolved',
          reply: replyText
        };
      }
      return d;
    }));
  };

  // Compute stats for Admin dashboard
  const getStats = () => {
    const totalEarnings = courses.reduce((sum, course) => {
      // Find how many enrollments match this course (we mock some historical signups + new ones)
      const mockSales = course.activeMembers * course.price;
      return sum + mockSales;
    }, 0);

    const totalStudents = courses.reduce((sum, course) => sum + (course.activeMembers || 0), 0);
    const activeDoubtsCount = doubts.filter(d => d.status === 'pending').length;

    return {
      totalEarnings,
      totalStudents,
      activeDoubtsCount,
      totalBatches: courses.length
    };
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      courses,
      addCourse,
      deleteCourse,
      enrollments,
      enrollInCourse,
      addContentToCourse,
      deleteContentFromCourse,
      doubts,
      addDoubt,
      resolveDoubt,
      stats: getStats()
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
