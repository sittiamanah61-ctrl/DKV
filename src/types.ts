export type ActiveTab = 
  | 'beranda'
  | 'modul'
  | 'studio-interaktif'
  | 'video'
  | 'portofolio'
  | 'jadwal'
  | 'asesmen'
  | 'game'
  | 'forum'
  | 'guru';

export interface ModuleItem {
  id: string;
  title: string;
  category: 'Prinsip Desain' | 'Tipografi' | 'Nirmana' | 'Teori Warna' | 'Desain Poster';
  summary: string;
  readTime: string;
  difficulty: 'Dasar' | 'Menengah' | 'Lanjutan';
  image: string;
  badge: string;
  content: {
    overview: string;
    keyPoints: string[];
    visualTips: string[];
    curriculumCode: string;
    practiceTask: string;
  };
}

export interface StudentWork {
  id: string;
  title: string;
  author: string;
  studentClass: 'X DKV 1' | 'X DKV 2';
  category: 'Nirmana' | 'Tipografi' | 'Poster' | 'Vektor' | 'Warna';
  image: string;
  description: string;
  likes: number;
  date: string;
  grade?: number;
  teacherFeedback?: string;
  badgeAwarded?: string;
}

export interface PracticeSchedule {
  id: string;
  day: string;
  date: string;
  time: string;
  subject: string;
  room: string;
  instructor: string;
  toolsNeeded: string[];
  maxCapacity: number;
  currentBooked: number;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
}

export interface TaskNotification {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: 'Belum Selesai' | 'Menunggu Dinilai' | 'Selesai' | 'Terlambat';
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  description: string;
  points: number;
}

export interface ForumPost {
  id: string;
  author: string;
  studentClass: string;
  avatarColor: string;
  title: string;
  content: string;
  category: 'Tanya Konsep' | 'Kritik Desain' | 'Tips Software' | 'Diskusi Proyek';
  likes: number;
  repliesCount: number;
  createdAt: string;
  replies: ForumReply[];
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  author: string;
  isTeacher?: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface VideoCreative {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoEmbedId?: string;
  mentor: string;
  description: string;
  timestamps: { time: string; topic: string }[];
}

export interface AssessmentQuestion {
  id: number;
  category: 'Prinsip Desain' | 'Tipografi' | 'Nirmana' | 'Teori Warna' | 'Desain Poster';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface EssayQuestion {
  id: number;
  category: 'Prinsip Desain' | 'Tipografi' | 'Nirmana' | 'Teori Warna' | 'Desain Poster';
  question: string;
  rubric: string;
  hint: string;
}

export interface StudentEssaySubmission {
  id: string;
  studentName: string;
  studentClass: 'X DKV 1' | 'X DKV 2';
  submittedAt: string;
  answers: { questionId: number; answer: string }[];
  mcqScore: number;
  totalGrade?: number;
  teacherNotes?: string;
  isGraded: boolean;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  category: string;
  unlockedAt?: string;
}
