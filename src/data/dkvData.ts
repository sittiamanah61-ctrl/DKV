import { 
  ModuleItem, 
  StudentWork, 
  PracticeSchedule, 
  TaskNotification, 
  ForumPost, 
  VideoCreative, 
  AssessmentQuestion, 
  EssayQuestion,
  BadgeItem 
} from '../types';

export const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'prinsip-desain',
    title: 'Prinsip-Prinsip Dasar Desain Grafis & Tata Letak',
    category: 'Prinsip Desain',
    summary: 'Kuasai 6 pilar fundamental: Keseimbangan (Balance), Kontras, Irama (Rhythm), Penekanan (Emphasis), Proporsi, dan Kesatuan (Unity).',
    readTime: '12 Menit',
    difficulty: 'Dasar',
    image: '/assets/images/poster_swiss_reference_1793273438057.jpg',
    badge: 'Fundamental DKV',
    content: {
      overview: 'Prinsip desain merupakan kaidah dasar dalam menyusun elemen visual agar pesan yang disampaikan oleh komunikator visual dapat diterima oleh audiens dengan jelas, menarik, dan berdaya guna tinggi.',
      keyPoints: [
        'Keseimbangan (Balance): Simetris (formal), Asimetris (dinamis), dan Radial (memusat).',
        'Kontras (Contrast): Membedakan elemen primer dan sekunder lewat ukuran, warna, ketebalan, atau tekstur.',
        'Penekanan (Emphasis / Focal Point): Area utama yang pertama kali dilihat mata dalam hitungan detik.',
        'Irama & Pengulangan (Rhythm & Repetition): Menciptakan alur baca visual yang konsisten dan berpola.',
        'Proporsi & Skala: Hubungan ukuran antar elemen yang logis dan harmonis.',
        'Kesatuan (Unity): Harmoni menyeluruh sehingga desain terasa utuh tanpa elemen asing yang saling bertabrakan.'
      ],
      visualTips: [
        'Gunakan golden ratio atau aturan sepertiga (rule of thirds) untuk menentukan focal point.',
        'Hindari memberikan kontras maksimal pada seluruh elemen; tentukan satu bintang utama.',
        'Ruang kosong (White Space / Negative Space) adalah elemen aktif, bukan ruang kosong tak bernyawa.'
      ],
      curriculumCode: 'KD 3.1 & 4.1 - Dasar Desain Komunikasi Visual',
      practiceTask: 'Rancanglah 1 layout sketsa thumbnail sederhana ukuran A4 yang menerapkan kontras asimetris dan satu focal point dominan.'
    }
  },
  {
    id: 'tipografi',
    title: 'Anatomi Tipografi & Hierarki Visual Teks',
    category: 'Tipografi',
    summary: 'Eksplorasi anatomi huruf (Cap-Height, Ascender, Descender, Serif, Stem, Loop, Kerning, Tracking, dan Leading).',
    readTime: '15 Menit',
    difficulty: 'Dasar',
    image: '/assets/images/typography_anatomy_sheet_1793273438888.jpg',
    badge: 'Anatomi & Type',
    content: {
      overview: 'Tipografi bukan sekadar memilih font, melainkan seni mengatur dan membentuk huruf agar pesan tertulis tidak hanya mudah dibaca (legible & readable) tetapi juga memancarkan kepribadian serta emosi yang tepat.',
      keyPoints: [
        'Garis Dasar (Baseline) & X-Height: Tinggi huruf kecil standar yang menentukan kenyamanan membaca paragraf panjang.',
        'Ascender & Descender: Bagian huruf yang menjulang ke atas (h, k, d) dan menjuntai ke bawah garis dasar (p, q, g, j).',
        'Klasifikasi Huruf: Serif (klasik & terpercaya), Sans-Serif (modern & bersih), Slab Serif (tegas & kokoh), Script (luwes & artistik), Display (dekoratif judul).',
        'Jarak Huruf: Kerning (jarak antar pasangan dua huruf spesifik) vs Tracking (kerapatan kata/kalimat secara keseluruhan).',
        'Leading: Jarak antar baris kalimat; leading yang terlalu sempit membuat mata cepat lelah.'
      ],
      visualTips: [
        'Batasi penggunaan maksimal 2 hingga 3 keluarga font (font families) dalam satu karya desain.',
        'Pastikan kontras yang tegas antara ukuran Judul (Heading) dan Teks Isi (Body Copy).',
        'Hindari men-stretch (menarik pipih) huruf secara proporsional tidak seimbang; gunakan font weights yang asli.'
      ],
      curriculumCode: 'KD 3.3 & 4.3 - Tipografi Komunikasi Visual',
      practiceTask: 'Lakukan penyesuaian Kerning manual pada kata "TYPOGRAPHY" menggunakan simulator interaktif di menu Studio Interaktif.'
    }
  },
  {
    id: 'nirmana',
    title: 'Nirmana Dwimatra & Gubahan Bentuk Geometris',
    category: 'Nirmana',
    summary: 'Pengorganisasian elemen dasar rupa: titik, garis, bidang, gradasi, ilusi optik, tekstur visual, dan irama rupa murni.',
    readTime: '18 Menit',
    difficulty: 'Menengah',
    image: '/assets/images/nirmana_dwimatra_visual_1793273438692.jpg',
    badge: 'Estetika Rupa',
    content: {
      overview: 'Nirmana (rancangan tanpa makna verbal langsung) adalah latihan kepekaan rasa estetika seorang desainer. Melatih bagaimana titik, garis, bidang, dan ruang berinteraksi menciptakan ilusi gerak, kedalaman, dan ritme dinamis.',
      keyPoints: [
        'Unsur Dasar Rupa: Titik (Point), Garis (Line), Bidang (Shape), Ruang (Space), Warna (Color), Tekstur (Texture).',
        'Nirmana Titik: Pengelompokan titik (stippling) untuk menciptakan gradasi terang-gelap dan volume bentuk.',
        'Nirmana Garis: Garis lurus, patah, lengkung, dan konsentris yang membangkitkan ilusi getaran dan gelombang.',
        'Nirmana Bidang Geometris vs Organis: Pengulangan modul dengan rotasi, dilatasi, dan translasi.',
        'Ilusi Optik & Op-Art: Interaksi pola kontras hitam-putih yang memicu persepsi gerak di retina mata.'
      ],
      visualTips: [
        'Kerapian dan ketepatan jarak antar garis (precision) adalah kunci keberhasilan nirmana manual maupun digital.',
        'Eksplorasi gubahan skala: dari bidang kecil membesar secara bertahap (gradasi ukuran).',
        'Ciptakan transisi halus antara kerapatan padat menuju renggang untuk menghasilkan kesan ruang 3 dimensi.'
      ],
      curriculumCode: 'KD 3.2 & 4.2 - Nirmana Dwimatra & Trimatra',
      practiceTask: 'Buka simulator Nirmana Interaktif dan buat pola gelombang optik dengan menggeser frekuensi garis dan rotasi sudut.'
    }
  },
  {
    id: 'teori-warna',
    title: 'Teori Warna, Psikologi, & Harmoni Roda Warna',
    category: 'Teori Warna',
    summary: 'Pahami roda warna (Color Wheel), sistem RGB vs CMYK, harmoni komplementer, analog, triadik, serta efek psikologis warna.',
    readTime: '14 Menit',
    difficulty: 'Dasar',
    image: '/assets/aistudio/image_e92f0533.png',
    badge: 'Kromatik Desain',
    content: {
      overview: 'Warna adalah elemen visual paling emosional. Memahami hubungan antar warna pada roda warna dan perbedaan kanal produksi (layar vs cetak) adalah kompetensi wajib setiap desainer komunikasi visual.',
      keyPoints: [
        'RGB vs CMYK: RGB (Red-Green-Blue) untuk media digital pencahayaan; CMYK (Cyan-Magenta-Yellow-Black) untuk media cetak pigmen.',
        'Hue, Saturation, Value: Hue (nama warna), Saturation (kemurnian/kepekatan), Value/Brightness (tingkat terang/gelap).',
        'Skema Harmoni: Monokromatik (1 hue beda value), Analogous (warna bersebelahan), Komplementer (warna berseberangan), Triadik (tiga sudut berjarak sama).',
        'Psikologi Warna: Merah (energi/urgensi), Biru (kepercayaan/kestabilan), Hijau (alam/kesegaran), Kuning (optimisme/keceriaan).'
      ],
      visualTips: [
        'Gunakan rumus proporsi warna 60-30-10 (60% warna dominan dasar, 30% warna struktural, 10% aksen fokus).',
        'Pastikan kontras rasio minimal 4.5:1 antara teks dan latar belakang agar ramah dibaca semua orang.',
        'Jangan memilih warna hanya berdasar selera pribadi, sesuaikan dengan target audiens dan konteks pesan proyek.'
      ],
      curriculumCode: 'KD 3.4 & 4.4 - Teori & Aplikasi Warna DKV',
      practiceTask: 'Uji kepekaan matamu dalam Game Color Sense Challenge di tab Game Desain!'
    }
  },
  {
    id: 'desain-poster',
    title: 'Desain Poster: Komposisi Grid & Komunikasi Visual',
    category: 'Desain Poster',
    summary: 'Bedah teknik menyusun poster persuasif: sistem modular grid, hierarki teks 3 detik, daya pikat visual, dan Call To Action.',
    readTime: '16 Menit',
    difficulty: 'Menengah',
    image: '/assets/images/poster_swiss_reference_1793273438057.jpg',
    badge: 'Karya Publikasi',
    content: {
      overview: 'Poster adalah media komunikasi visual cetak maupun digital yang dirancang untuk menyampaikan pesan ringkas dalam hitungan detik saat orang berjalan melewatinya. Dibutuhkan kekuatan visual (eye-catching) dan kejelasan hierarki informasi.',
      keyPoints: [
        'Aturan 3 Detik: Headline atau elemen visual utama harus sanggup menghentikan langkah audiens dalam waktu kurang dari 3 detik.',
        'Sistem Grid Swiss (Modular Grid): Membagi bidang poster ke dalam kolom dan baris presisi untuk keteraturan tata letak.',
        'Hierarki 3 Tingkat: Level 1 (Headline/Tema Utama), Level 2 (Subjudul & Tanggal/Lokasi), Level 3 (Detail penyelenggara/kontak/sponsor).',
        'Kekuatan Visual: Penggunaan fotografi bernyawa tinggi atau ilustrasi vektor stilasi dengan pesan metaforis yang kuat.'
      ],
      visualTips: [
        'Hindari meletakkan teks penting terlalu dekat dengan tepi kanvas (berikan margin/bleeding minimal 1.5 - 2 cm).',
        'Pastikan ada satu elemen berukuran jauh lebih besar daripada elemen lain untuk membentuk pusat perhatian.',
        'Uji keterbacaan dengan mengecilkan zoom desain ke 25%; apakah judul utamanya masih terbaca jelas?'
      ],
      curriculumCode: 'KD 3.5 & 4.5 - Perancangan Media Poster & Publikasi',
      practiceTask: 'Gunakan referensi gaya Swiss Modern di aplikasi ini dan rancang draft poster kampanye sosial hemat energi.'
    }
  }
];

export const INITIAL_STUDENT_WORKS: StudentWork[] = [
  {
    id: 'work-1',
    title: 'Nirmana Gelombang Kinetik Dwimatra',
    author: 'Ahmad Rizky Pratama',
    studentClass: 'X DKV 1',
    category: 'Nirmana',
    image: '/assets/images/nirmana_dwimatra_visual_1793273438692.jpg',
    description: 'Eksplorasi garis lengkung konsentris menggunakan drawing pen 0.1, 0.3, dan 0.5 di atas kertas Bristol A3. Menghasilkan efek kedalaman 3 dimensi dan ilusi optik riak gelombang.',
    likes: 42,
    date: '24 Okt 2026',
    grade: 95,
    teacherFeedback: 'Penguasaan ketebalan garis sangat rapi dan presisi tinggi! Efek optiknya berhasil membangkitkan ilusi riak air yang dinamis. Pertahankan konsistensi tarikan tanganmu, Rizky.',
    badgeAwarded: 'Master Nirmana'
  },
  {
    id: 'work-2',
    title: 'Eksplorasi Tipografi Vektor Swiss Style',
    author: 'Nabila Syahrani',
    studentClass: 'X DKV 2',
    category: 'Poster',
    image: '/assets/images/poster_swiss_reference_1793273438057.jpg',
    description: 'Penerapan modular grid sistem gaya Swiss Typography dengan aksen warna jingga vermilion dan hijau zamrud. Berisi studi tata letak pameran karya seni grafis.',
    likes: 38,
    date: '26 Okt 2026',
    grade: 92,
    teacherFeedback: 'Hierarki tipografinya luar biasa jelas! Penempatan modular grid sangat tertib dan kontras warnanya tepat sasaran sesuai kaidah 60-30-10.',
    badgeAwarded: 'Typo Guru'
  },
  {
    id: 'work-3',
    title: 'Lembar Studi Anatomi Huruf & Kurva Bezier',
    author: 'Fajar Maulana',
    studentClass: 'X DKV 1',
    category: 'Tipografi',
    image: '/assets/images/typography_anatomy_sheet_1793273438888.jpg',
    description: 'Identifikasi anatomi huruf T, h, g, dan f beserta posisi titik anchor point dan handle kurva bezier pada garis millimeter grid buku sketsa.',
    likes: 31,
    date: '27 Okt 2026',
    grade: 88,
    teacherFeedback: 'Penandaan ascender dan baseline sangat akurat. Perhatikan sedikit jarak stem pada huruf g bagian loop bawah agar kurva lebih luwes.',
    badgeAwarded: 'Anatomi Huruf'
  },
  {
    id: 'work-4',
    title: 'Stilasi Huruf Kreatif QueenThings Graphic Studio',
    author: 'Siti Aminah Zahra',
    studentClass: 'X DKV 2',
    category: 'Vektor',
    image: '/assets/aistudio/image_e92f0533.png',
    description: 'Eksplorasi lettering sketsa tekstur kapur warna hijau pupus dengan kurva aksen oranye dan bounding box seleksi vektor bernuansa buku catatan seni.',
    likes: 49,
    date: '28 Okt 2026',
    grade: 96,
    teacherFeedback: 'Kombinasi gaya sketsa tangan dan elemen grafis vektor sangat segar! Bounding box seleksi memberikan sentuhan playful yang otentik bagi calon desainer.',
    badgeAwarded: 'Kreator Poster Juara'
  }
];

export const INITIAL_SCHEDULES: PracticeSchedule[] = [
  {
    id: 'sch-1',
    day: 'Senin',
    date: '02 Nov 2026',
    time: '07.30 - 10.30 WIB',
    subject: 'Praktik Manual Nirmana Dwimatra & Tekstur Rupa',
    room: 'Studio Gambar Manual (Lt. 2)',
    instructor: 'Ibu Sitti Amanah, S.Pd., M.Sn.',
    toolsNeeded: ['Kertas Bristol A3', 'Drawing Pen (0.1, 0.3, 0.5, 0.8)', 'Penggaris Segitiga Baja', 'Penghapus Karet'],
    maxCapacity: 36,
    currentBooked: 32,
    status: 'Akan Datang'
  },
  {
    id: 'sch-2',
    day: 'Rabu',
    date: '04 Nov 2026',
    time: '11.00 - 14.30 WIB',
    subject: 'Digital Vector & Pen Tool Path Illustrator',
    room: 'Lab Komputer Multimedia Apple & iMac (Lt. 3)',
    instructor: 'Bpk. Hendra Wijaya, S.Ds.',
    toolsNeeded: ['Pen Tablet / Wacom', 'Software Vektor Grafis', 'Flashdisk Portofolio'],
    maxCapacity: 36,
    currentBooked: 36,
    status: 'Akan Datang'
  },
  {
    id: 'sch-3',
    day: 'Jumat',
    date: '06 Nov 2026',
    time: '08.00 - 11.00 WIB',
    subject: 'Studio Dasar Fotografi Produk & Teori Pencahayaan Tiga Titik',
    room: 'Studio Fotografi & Green Screen (Lt. 1)',
    instructor: 'Ibu Sitti Amanah, S.Pd., M.Sn.',
    toolsNeeded: ['Kamera DSLR / Mirrorless Studio', 'Tripod', 'Produk Objek Kemasan Siswa'],
    maxCapacity: 24,
    currentBooked: 20,
    status: 'Akan Datang'
  }
];

export const INITIAL_TASKS: TaskNotification[] = [
  {
    id: 'tsk-1',
    title: 'Daily Asesmen 10 Pilihan Ganda & 5 Esai DKV',
    category: 'Evaluasi Teori',
    dueDate: 'Besok, 23.59 WIB',
    status: 'Belum Selesai',
    priority: 'Tinggi',
    description: 'Selesaikan 10 soal pilihan ganda kurikulum dan 5 soal esai analitis tentang prinsip desain, tipografi, nirmana, dan warna.',
    points: 100
  },
  {
    id: 'tsk-2',
    title: 'Finalisasi Nirmana Garis Kinetik Kertas Bristol',
    category: 'Tugas Manual',
    dueDate: '3 Hari Lagi (Senin)',
    status: 'Belum Selesai',
    priority: 'Tinggi',
    description: 'Finishing arsiran dan garis optik dengan tinta cina atau drawing pen hitam. Siap dipajang pada sesi kritik karya studio.',
    points: 90
  },
  {
    id: 'tsk-3',
    title: 'Eksplorasi Kerning Huruf & Font Pairing di Studio',
    category: 'Praktik Interaktif',
    dueDate: '5 Hari Lagi',
    status: 'Selesai',
    priority: 'Sedang',
    description: 'Coba studio tipografi interaktif, rekam kombinasi font yang paling harmonis untuk proyek poster.',
    points: 80
  },
  {
    id: 'tsk-4',
    title: 'Upload Karya Portofolio Mingguan Kelas 10',
    category: 'Portofolio',
    dueDate: 'Minggu Ini',
    status: 'Menunggu Dinilai',
    priority: 'Sedang',
    description: 'Unggah foto hasil tugas atau file grafis ke galeri portofolio kelas untuk mendapatkan review dan nilai dari guru.',
    points: 85
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'forum-1',
    author: 'Dimas Anggoro',
    studentClass: 'X DKV 1',
    avatarColor: 'bg-emerald-600',
    title: 'Tips cara menjaga garis pada Nirmana manual agar tidak mleber/bocor?',
    content: 'Halo teman-teman dan Ibu Guru, saat saya menarik garis drawing pen pakai penggaris mika, tintanya sering merembes di bawah penggaris. Ada trik posisi penggaris atau alat yang lebih aman?',
    category: 'Tanya Konsep',
    likes: 14,
    repliesCount: 3,
    createdAt: 'Kemarin, 14:20',
    isPinned: true,
    replies: [
      {
        id: 'rep-1',
        author: 'Ibu Sitti Amanah (Guru DKV)',
        isTeacher: true,
        content: 'Trik terbaik: tempelkan selotip kertas atau uang koin di bawah penggaris dekat tepinya agar ada celah udara (jarak elevasi) antara penggaris dan kertas. Jadi tinta drawing pen tidak akan tertarik masuk ke bawah penggaris secara kapiler.',
        createdAt: 'Kemarin, 15:10',
        likes: 18
      },
      {
        id: 'rep-2',
        author: 'Nabila Syahrani',
        isTeacher: false,
        content: 'Betul kata Bu Sitti! Aku pakai koin 500 perak di balik penggaris segitiga, hasilnya bersih banget garisnya nggak ada yang belepotan lagi.',
        createdAt: 'Kemarin, 16:05',
        likes: 6
      }
    ]
  },
  {
    id: 'forum-2',
    author: 'Kezia Putri',
    studentClass: 'X DKV 2',
    avatarColor: 'bg-amber-600',
    title: 'Bagaimana cara menentukan Font Pairing yang tepat untuk poster pameran seni?',
    content: 'Saya sedang membuat poster pameran keramik tradisional. Bagusnya memadukan serif klasik dengan sans-serif atau script ya? Mohon sarannya teman-teman!',
    category: 'Diskusi Proyek',
    likes: 9,
    repliesCount: 2,
    createdAt: '2 hari lalu',
    replies: [
      {
        id: 'rep-3',
        author: 'Ahmad Rizky Pratama',
        isTeacher: false,
        content: 'Untuk judul pameran keramik tradisional, font Serif dengan kontras tebal-tipis tinggi (seperti Playfair atau Bodoni) sangat cocok untuk kesan anggun. Lalu teks detail tanggal dan lokasi pakai Sans-serif modern yang netral.',
        createdAt: '2 hari lalu',
        likes: 7
      }
    ]
  }
];

export const INITIAL_VIDEOS: VideoCreative[] = [
  {
    id: 'vid-1',
    title: 'Mastering Pen Tool: Rahasia Mengendalikan Kurva Bezier Tanpa Pusing',
    category: 'Vektor & Ilustrasi',
    duration: '14:20',
    thumbnail: '/assets/images/typography_anatomy_sheet_1793273438888.jpg',
    videoEmbedId: 'm4XgP8u7R5Y',
    mentor: 'Bpk. Hendra Wijaya, S.Ds.',
    description: 'Kupas tuntas filosofi titik jangkar (anchor point), pegangan arah (direction handles), dan cara membuat kurva S yang mulus dengan sesedikit mungkin titik.',
    timestamps: [
      { time: '00:00', topic: 'Pengenalan Vektor vs Raster' },
      { time: '03:15', topic: 'Titik Sudut vs Titik Halus' },
      { time: '08:40', topic: 'Latihan Menjiplak Huruf Organik' },
      { time: '12:10', topic: 'Shortcut Efisiensi Kerja' }
    ]
  },
  {
    id: 'vid-2',
    title: 'Bedah Desain Poster Swiss Grid: Mengapa Komposisinya Begitu Memikat?',
    category: 'Tata Letak & Grid',
    duration: '18:45',
    thumbnail: '/assets/images/poster_swiss_reference_1793273438057.jpg',
    videoEmbedId: '7xXp8y19qZw',
    mentor: 'Ibu Sitti Amanah, S.Pd., M.Sn.',
    description: 'Analisis mendalam karya-karya legendaris Josef Müller-Brockmann dan Emil Ruder. Cara membuat modular grid dan hierarki teks yang berwibawa.',
    timestamps: [
      { time: '00:00', topic: 'Sejarah Swiss Style (International Typographic)' },
      { time: '04:30', topic: 'Struktur Baris & Kolom Grid' },
      { time: '10:15', topic: 'White Space sebagai Nafas Desain' },
      { time: '15:20', topic: 'Kritik Desain Poster Siswa' }
    ]
  },
  {
    id: 'vid-3',
    title: 'Nirmana Garis & Ilusi Optik: Dari Kertas Gambar Menuju Seni Digital',
    category: 'Nirmana & Seni Murni',
    duration: '12:10',
    thumbnail: '/assets/images/nirmana_dwimatra_visual_1793273438692.jpg',
    videoEmbedId: 'k4Pz9e8v1Lk',
    mentor: 'Ibu Sitti Amanah, S.Pd., M.Sn.',
    description: 'Proses kreatif pembuatan nirmana ritme gelombang. Mulai dari penentuan modul satuan bentuk, pergeseran sudut rotasi, hingga finishing tinta yang tajam.',
    timestamps: [
      { time: '00:00', topic: 'Konsep Irama & Repetisi' },
      { time: '03:20', topic: 'Gradasi Ukuran & Jarak' },
      { time: '07:45', topic: 'Teknik Tinta Anti-Cacat' },
      { time: '10:30', topic: 'Dokumentasi untuk Portofolio' }
    ]
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    category: 'Prinsip Desain',
    question: 'Prinsip desain yang bertujuan untuk menciptakan suatu pusat perhatian (focal point) sehingga mata pemirsa pertama kali tertuju padanya disebut...',
    options: ['Balance (Keseimbangan)', 'Emphasis (Penekanan)', 'Rhythm (Irama)', 'Proportion (Proporsi)'],
    correctAnswer: 1,
    explanation: 'Emphasis atau penekanan adalah prinsip yang memberikan aksen khusus pada elemen dominan agar menjadi pusat perhatian (focal point) utama dalam sebuah komposisi.'
  },
  {
    id: 2,
    category: 'Tipografi',
    question: 'Garis maya horizontal yang menjadi pijakan dasar berdirinya semua karakter huruf (seperti huruf A, B, x, h) disebut...',
    options: ['Cap-Height', 'Mean Line', 'Baseline', 'Descender Line'],
    correctAnswer: 2,
    explanation: 'Baseline adalah garis maya tempat semua karakter huruf bertumpu. Bagian descender (seperti pada p dan g) akan menjuntai ke bawah garis baseline ini.'
  },
  {
    id: 3,
    category: 'Tipografi',
    question: 'Penyesuaian jarak ruang horizontal antara DUA karakter huruf spesifik agar terlihat proporsional dan tidak berlubang dinamakan...',
    options: ['Leading', 'Tracking', 'Kerning', 'Alignment'],
    correctAnswer: 2,
    explanation: 'Kerning adalah penyesuaian jarak khusus antara sepasang huruf tertentu (misalnya antara huruf A dan V), sedangkan tracking adalah spasi rata di seluruh kata.'
  },
  {
    id: 4,
    category: 'Nirmana',
    question: 'Nirmana yang dibuat pada bidang datar dua dimensi yang hanya memiliki dimensi panjang dan lebar disebut...',
    options: ['Nirmana Trimatra', 'Nirmana Dwimatra', 'Nirmana Tetramatra', 'Nirmana Kinetik'],
    correctAnswer: 1,
    explanation: 'Nirmana Dwimatra merupakan pengorganisasian elemen visual pada bidang datar 2 dimensi (panjang dan lebar) tanpa kedalaman fisik nyata.'
  },
  {
    id: 5,
    category: 'Nirmana',
    question: 'Unsur visual terkecil dalam seni rupa dan nirmana yang tidak memiliki dimensi panjang maupun lebar tetapi mempunyai posisi koordinat adalah...',
    options: ['Garis', 'Titik (Point)', 'Bidang', 'Gumpal (Volume)'],
    correctAnswer: 1,
    explanation: 'Titik adalah unsur seni rupa paling mendasar yang menandai suatu kedudukan. Kumpulan titik dengan kerapatan berbeda dapat membentuk garis, bidang, maupun gradasi.'
  },
  {
    id: 6,
    category: 'Teori Warna',
    question: 'Skema harmoni warna yang menggunakan dua warna yang posisinya saling berhadapan secara langsung (180 derajat) pada roda warna disebut skema...',
    options: ['Analogous', 'Monokromatik', 'Komplementer', 'Triadik'],
    correctAnswer: 2,
    explanation: 'Warna komplementer saling berhadapan di roda warna (seperti merah-hijau atau biru-oranye). Skema ini menghasilkan kontras visual paling tinggi dan bertenaga.'
  },
  {
    id: 7,
    category: 'Teori Warna',
    question: 'Untuk keperluan publikasi cetak fisik (seperti majalah, spanduk, brosur, atau poster print), model warna standar yang harus digunakan adalah...',
    options: ['RGB (Red Green Blue)', 'CMYK (Cyan Magenta Yellow Key/Black)', 'HEX Color Code', 'Grayscale 1-bit'],
    correctAnswer: 1,
    explanation: 'CMYK adalah model warna subtraktif berbasis pigmen tinta cetak fisik, berbeda dengan RGB yang menggunakan model aditif pencahayaan layar monitor.'
  },
  {
    id: 8,
    category: 'Prinsip Desain',
    question: 'Ruang kosong tanpa elemen grafis aktif di sekitar objek desain yang berfungsi memberi jeda napas visual dan mencegah kesan sesak disebut...',
    options: ['Drop Shadow', 'White Space / Negative Space', 'Bleed Area', 'Safe Zone'],
    correctAnswer: 1,
    explanation: 'White Space (atau negative space) sangat krusial dalam desain untuk memisahkan hierarki, memandu alur pandang mata, dan membuat layout tampak elegan serta profesional.'
  },
  {
    id: 9,
    category: 'Tipografi',
    question: 'Keluarga huruf yang memiliki kait kecil (sirip) pada ujung-ujung goresan karakternya serta memberikan kesan formal, klasik, dan terpercaya adalah...',
    options: ['Sans-Serif', 'Serif', 'Decorative Display', 'Monospace'],
    correctAnswer: 1,
    explanation: 'Huruf Serif (seperti Times New Roman, Garamond, Playfair) memiliki kait sirip di ujung tangkai, cocok untuk teks editorial panjang dan kesan prestisius.'
  },
  {
    id: 10,
    category: 'Desain Poster',
    question: 'Dalam perancangan poster publikasi, informasi manakah yang harus diletakkan pada hierarki visual Level 1 (paling dominan)?',
    options: ['Daftar logo sponsor dan instansi pendukung', 'Headline utama / pesan kunci yang menarik perhatian', 'Nomor kontak narahubung dan media sosial', 'Alamat lengkap gedung dan denah ruangan'],
    correctAnswer: 1,
    explanation: 'Headline utama atau tema kampanye harus menjadi elemen Level 1 yang paling menonjol agar mampu ditangkap oleh audiens dalam 3 detik pertama.'
  }
];

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: 1,
    category: 'Prinsip Desain',
    question: 'Jelaskan bagaimana prinsip "Keseimbangan Asimetris" (Asymmetrical Balance) dapat membuat karya desain terlihat lebih dinamis dibandingkan "Keseimbangan Simetris", serta berikan contoh penerapannya pada desain poster festival musik!',
    rubric: 'Kriteria Penilaian: Pemahaman konsep bobot visual (visual weight), perbandingan simetris vs asimetris, dan kejelasan contoh studi kasus nyata.',
    hint: 'Gunakan kata kunci: bobot visual, ukuran objek, kontras warna, ruang negatif, dan alur dinamika mata pemirsa.'
  },
  {
    id: 2,
    category: 'Tipografi',
    question: 'Analisis mengapa pengaturan "Leading" (jarak antar baris) dan "Tracking" yang terlalu sempit dapat menurunkan tingkat keterbacaan (readability) pada teks paragraf bacaan. Bagaimana solusi standarnya untuk buku pelajaran?',
    rubric: 'Kriteria Penilaian: Penjelasan teknis anatomi teks, faktor kenyamanan mata manusia, dan rekomendasi rasio leading terhadap font size (misal 120-140%).',
    hint: 'Hubungkan dengan benturan ascender-descender dan ritme perpindahan baris oleh mata.'
  },
  {
    id: 3,
    category: 'Nirmana',
    question: 'Bagaimana sebuah komposisi Nirmana Garis dapat menciptakan ilusi gerak (motion illusion) dan kedalaman ruang tiga dimensi padahal digambar di atas kertas gambar dua dimensi yang datar?',
    rubric: 'Kriteria Penilaian: Penjelasan modul pengulangan, perubahan frekuensi/jarak antar garis, efek moire, serta gradasi ketebalan.',
    hint: 'Sebutkan konsep gradasi jarak (rapat ke renggang), arah garis lengkung konsentris, dan persepsi optik retina.'
  },
  {
    id: 4,
    category: 'Teori Warna',
    question: 'Jika kamu ditugaskan merancang identitas visual untuk "Produk Makanan Sehat Organik Ramah Lingkungan", skema harmoni warna apa yang paling tepat kamu pilih? Jelaskan alasan psikologis di balik pemilihan warna-warna tersebut!',
    rubric: 'Kriteria Penilaian: Ketepatan asosiasi psikologi warna (misal hijau alam, cokelat tanah, aksen kuning), pemilihan skema harmoni (analogous/monokromatik), dan relevansi target pasar.',
    hint: 'Sebutkan pesan emosional kesegaran, kebersihan, keaslian bahan, dan keberlanjutan bumi.'
  },
  {
    id: 5,
    category: 'Desain Poster',
    question: 'Uraikan peran "Sistem Modular Grid" (Swiss Grid System) dalam menciptakan keteraturan dan kejelasan hierarki pada desain poster komersial yang memuat banyak informasi teks dan gambar!',
    rubric: 'Kriteria Penilaian: Pemahaman fungsi grid pembagi bidang, konsistensi margin dan alur baca, serta keselarasan antar modul.',
    hint: 'Kaitkan dengan efisiensi penyusunan elemen, kerapian layout, dan profesionalitas brand.'
  }
];

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge-1',
    name: 'Pionir Desain X',
    description: 'Menyelesaikan modul pertama prinsip-prinsip desain DKV kelas 10.',
    iconName: 'Compass',
    unlocked: true,
    category: 'Pembelajaran',
    unlockedAt: '25 Okt 2026'
  },
  {
    id: 'badge-2',
    name: 'Master Nirmana',
    description: 'Mendapat apresiasi nilai di atas 90 untuk karya nirmana dwimatra.',
    iconName: 'Shapes',
    unlocked: true,
    category: 'Karya',
    unlockedAt: '26 Okt 2026'
  },
  {
    id: 'badge-3',
    name: 'Typo Detective',
    description: 'Berhasil mengidentifikasi seluruh anatomi huruf dan uji kerning.',
    iconName: 'Type',
    unlocked: true,
    category: 'Interaktif',
    unlockedAt: '27 Okt 2026'
  },
  {
    id: 'badge-4',
    name: 'Harmoni Kromatik',
    description: 'Menaklukkan tantangan kepekaan warna Color Sense Challenge level 5.',
    iconName: 'Palette',
    unlocked: false,
    category: 'Game'
  },
  {
    id: 'badge-5',
    name: 'Penyelesai Asesmen',
    description: 'Menyelesaikan 10 soal pilihan ganda dan 5 esai harian kurikulum.',
    iconName: 'Award',
    unlocked: false,
    category: 'Asesmen'
  },
  {
    id: 'badge-6',
    name: 'Desainer Kolaboratif',
    description: 'Memberikan umpan balik atau kritik konstruktif di forum diskusi kelas.',
    iconName: 'MessageSquare',
    unlocked: true,
    category: 'Komunitas',
    unlockedAt: '28 Okt 2026'
  }
];
