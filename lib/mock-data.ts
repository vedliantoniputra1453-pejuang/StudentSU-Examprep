import type {
  Course,
  CPMKItem,
  CpmkGap,
  Insight,
  MaterialItem,
  Question,
  SetupStep,
  SkillAxis,
  StatCardData,
  StudyProfile,
} from "@/lib/types";

export const profile: StudyProfile = {
  name: "Vedli",
  major: "Manajemen",
  semester: 3,
  examLabel: "UTS 15 Desember 2026",
  daysToExam: 42,
  interests: ["Teknologi", "Bisnis", "Olahraga"],
  customPrompt: "Saya suka analogi teknologi rintisan (startup), industri kopi, dan kompetisi bola basket kampus.",
};

export const stats: StatCardData[] = [
  { label: "Level pengetahuan", value: "62", unit: "/100", hint: "Rata-rata 12 CPMK aktif", tone: "sky" },
  { label: "CPMK dikuasai", value: "7", unit: "/12", hint: "Ambang kuasai 80%", tone: "leaf" },
  { label: "Latihan selesai", value: "8", unit: "sesi", hint: "3 dalam 7 hari terakhir", tone: "berry" },
  { label: "Jurnal terisi", value: "4", unit: "entri", hint: "Terakhir 2 hari lalu", tone: "sun" },
];

export const courses: Course[] = [
  {
    id: "eko-bisnis",
    code: "MGT201",
    name: "Ekonomi Bisnis",
    department: "manajemen",
    sessionDone: 5,
    sessionTotal: 14,
    nextTopic: "Sesi 6 · Struktur pasar",
    accent: "sky",
    textbook: "Sloman, John. (2024). Essential economics for business. Hoboken: Pearson.",
  },
  {
    id: "akm",
    code: "AKT210",
    name: "Akuntansi Manajemen",
    department: "akuntansi",
    sessionDone: 3,
    sessionTotal: 14,
    nextTopic: "Sesi 4 · Biaya relevan",
    accent: "leaf",
    textbook: "Garrison, Ray H. (2024). Managerial Accounting. McGraw-Hill.",
  },
  {
    id: "man-keu",
    code: "MGT215",
    name: "Manajemen Keuangan",
    department: "manajemen",
    sessionDone: 4,
    sessionTotal: 14,
    nextTopic: "Sesi 5 · Nilai waktu uang",
    accent: "berry",
    textbook: "Brigham & Ehrhardt. (2023). Financial Management: Theory & Practice. Cengage.",
  },
];

export const defaultCpmks: Record<string, CPMKItem[]> = {
  "eko-bisnis": [
    {
      id: "cpmk-1",
      courseId: "eko-bisnis",
      code: "CPMK 1",
      title: "Pendekatan Ekonomi Terhadap Pasar dan Konsumen",
      description: "Mendefinisikan konsep pendekatan ekonomi terhadap penawaran, permintaan, elastisitas dan perilaku konsumen.",
      sessions: [1, 2, 3],
      criteria: [
        {
          indicator: "1.1 Hubungan fungsi penawaran - permintaan dengan elastisitas harga",
          weight: 35,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Definisikan dengan benar fungsi penawaran-permintaan dan jelaskan hubungannya dengan elastisitas harga secara komprehensif." },
            { label: "Good", scoreRange: "75-84", descriptor: "Definisikan sebagian fungsi penawaran-permintaan dan jelaskan sebagian hubungan elastisitas harga." },
            { label: "Average", scoreRange: "65-74", descriptor: "Definisikan sebagian fungsi penawaran-permintaan tanpa uraian elastisitas yang memadai." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Definisi keliru atau gagal mengidentifikasi hubungan penawaran-permintaan." },
          ],
        },
        {
          indicator: "1.2 Konsep bisnis dan kinerja untuk pendekatan ekonomi",
          weight: 35,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat menentukan konsep bisnis dan kinerja serta hubungannya dengan pendekatan permintaan secara tepat." },
            { label: "Good", scoreRange: "75-84", descriptor: "Dapat menentukan konsep bisnis dan menjelaskan sebagian kinerjanya." },
            { label: "Average", scoreRange: "65-74", descriptor: "Hanya mendefinisikan konsep bisnis tanpa analisis kinerja." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Belum mampu mengaitkan konsep bisnis dengan pendekatan ekonomi." },
          ],
        },
        {
          indicator: "1.3 Estimasi permintaan dan perilaku konsumen",
          weight: 30,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat menentukan hubungan perkiraan tuntutan permintaan dan perilaku konsumen secara menyeluruh." },
            { label: "Good", scoreRange: "75-84", descriptor: "Mendefinisikan perkiraan permintaan dan sebagian perilaku konsumen." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menjelaskan sebagian perilaku konsumen atau perkiraan permintaannya saja." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Gagal menghubungkan elastisitas pendapatan dan selera konsumen terhadap permintaan." },
          ],
        },
      ],
    },
    {
      id: "cpmk-2",
      courseId: "eko-bisnis",
      code: "CPMK 2",
      title: "Maksimalisasi Keuntungan dan Struktur Pasar",
      description: "Diskusikan maksimalisasi keuntungan dengan faktor input di pasar kompetitif dan non kompetitif.",
      sessions: [4, 5, 6],
      criteria: [
        {
          indicator: "2.1 Hubungan berbagai biaya produksi",
          weight: 35,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Membahas benar bermacam biaya produksi (FC, VC, MC, ATC) dan menggambarkan kurva hubungan biaya secara tepat." },
            { label: "Good", scoreRange: "75-84", descriptor: "Membahas benar biaya produksi dan penarikan sebagian hubungan kurva." },
            { label: "Average", scoreRange: "65-74", descriptor: "Membahas biaya produksi dan menjelaskan sebagian perhitungannya saja." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Tertukar antara biaya tetap dan biaya marjinal." },
          ],
        },
        {
          indicator: "2.2 Maksimalisasi keuntungan persaingan tidak sempurna",
          weight: 35,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Menggambarkan keuntungan dengan benar (MR=MC) dalam persaingan tidak sempurna serta dampaknya pada harga dan kuantitas." },
            { label: "Good", scoreRange: "75-84", descriptor: "Menggambarkan sebagian maksimalisasi keuntungan dalam persaingan tidak sempurna." },
            { label: "Average", scoreRange: "65-74", descriptor: "Mendefinisikan sebagian maksimalisasi keuntungan dalam kaitannya dengan pendapatan." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Gagal menentukan kondisi laba maksimum pasar monopoli/oligopoli." },
          ],
        },
        {
          indicator: "2.3 Kekuatan di pasar tenaga kerja (Monopsony vs Monopoly)",
          weight: 30,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat menentukan dan menggambarkan secara tepat monopoli dan monopsoni pasar tenaga kerja serta dampaknya pada upah." },
            { label: "Good", scoreRange: "75-84", descriptor: "Mendefinisikan dan menjelaskan sebagian pasar tenaga kerja monopolistik." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menyebutkan konsep dasar tanpa analisis dampak biaya tenaga kerja." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Salah memahami perbedaan pembeli tunggal dan penjual tunggal." },
          ],
        },
      ],
    },
    {
      id: "cpmk-3",
      courseId: "eko-bisnis",
      code: "CPMK 3",
      title: "Strategi Pertumbuhan Bisnis dan Intervensi Pemerintah",
      description: "Mendemonstrasikan strategi pertumbuhan bisnis dan intervensi pemerintah.",
      sessions: [7, 8, 9],
      criteria: [
        {
          indicator: "3.1 Hubungan analisis strategis dan pembiayaan investasi",
          weight: 50,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Mendemonstrasikan dengan benar jenis analisis strategis dan pilihan strategi yang berhubungan dengan pembiayaan investasi." },
            { label: "Good", scoreRange: "75-84", descriptor: "Mendemonstrasikan sebagian pilihan strategis dan keputusan pendanaan." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menjelaskan konsep strategi tanpa perhitungan pembiayaan." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Tidak memahami kaitan suku bunga dan keputusan ekspansi." },
          ],
        },
        {
          indicator: "3.2 Perusahaan Multinasional dan Kebijakan Publik",
          weight: 50,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat menafsirkan perusahaan multinasional dan mengidentifikasi lengkap keuntungan serta tantangan regulasi/pajak pemerintah." },
            { label: "Good", scoreRange: "75-84", descriptor: "Menafsirkan perusahaan multinasional dan sebagian tantangannya." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menyebutkan definisi multinasional tanpa telaah kebijakan." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Gagal menjelaskan dampak subsidi dan pajak pada operasi multinasional." },
          ],
        },
      ],
    },
    {
      id: "cpmk-4",
      courseId: "eko-bisnis",
      code: "CPMK 4",
      title: "Ekonomi Makro dan Lingkungan Global",
      description: "Membedakan kebijakan ekonomi makro dan lingkungan ekonomi global.",
      sessions: [10, 11, 12, 13, 14],
      criteria: [
        {
          indicator: "4.1 Kegiatan utama ekonomi dan bisnis",
          weight: 30,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat meneliti dan menjelaskan kegiatan utama bisnis, sirkular aliran pendapatan, dan siklus bisnis secara akurat." },
            { label: "Good", scoreRange: "75-84", descriptor: "Menjelaskan aliran pendapatan dan siklus bisnis dasar." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menjelaskan sebagian kegiatan sirkular bisnis." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Gagal memetakan arus barang dan pembayaran makro." },
          ],
        },
        {
          indicator: "4.2 Kebijakan Ekonomi Makro (Fiskal & Moneter)",
          weight: 40,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Membedakan secara tepat sisi permintaan dan penawaran kebijakan makro serta implikasi inflasi dan suku bunga." },
            { label: "Good", scoreRange: "75-84", descriptor: "Membedakan sisi permintaan dan penawaran kebijakan fiskal." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menyebutkan instrumen pajak dan suku bunga tanpa keterkaitan." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Tertukar antara kebijakan moneter bank sentral dan APBN pemerintah." },
          ],
        },
        {
          indicator: "4.3 Keuntungan pembatasan perdagangan internasional",
          weight: 30,
          levels: [
            { label: "Excellent", scoreRange: "85-100", descriptor: "Dapat menjelaskan dan membedakan keuntungan serta dampak tarif/kuota perdagangan internasional secara ekstensif." },
            { label: "Good", scoreRange: "75-84", descriptor: "Menjelaskan sebagian keuntungan dan pembatasan tarif dagang." },
            { label: "Average", scoreRange: "65-74", descriptor: "Menyebutkan konsep proteksionisme dasar." },
            { label: "Poor", scoreRange: "0-64", descriptor: "Gagal menghitung deadweight loss dari kuota impor." },
          ],
        },
      ],
    },
  ],
};

export const defaultMaterials: MaterialItem[] = [
  {
    id: "mat-1",
    courseId: "eko-bisnis",
    sessionId: 1,
    kind: "default",
    title: "Sesi 1: Lingkungan Bisnis dan Pendekatan Ekonomi",
    text: "Mata kuliah mempelajari lingkungan ekonomi di mana operasi perusahaan berjalan dan analisis ekonomi digunakan dalam pengambilan keputusan bisnis. Input diolah menjadi output. Permintaan konsumen dipengaruhi oleh harga barang itu sendiri, harga barang substitusi/komplementer, pendapatan, selera, dan ekspektasi masa depan. Penawaran produsen dipengaruhi oleh biaya faktor produksi, teknologi, dan kebijakan perpajakan.",
    charCount: 425,
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "mat-2",
    courseId: "eko-bisnis",
    sessionId: 2,
    kind: "default",
    title: "Sesi 2: Elastisitas Harga Permintaan & Penawaran",
    text: "Elastisitas harga permintaan (PED) mengukur respons persentase perubahan jumlah barang yang diminta terhadap persentase perubahan harga: PED = (% Delta Q) / (% Delta P). Jika |PED| > 1 barang elastis (menurunkan harga meningkatkan total penerimaan TR). Jika |PED| < 1 barang inelastis (menaikkan harga meningkatkan total penerimaan TR). Pada komoditas kebutuhan pokok dan barang tanpa substitusi dekat, permintaan cenderung inelastis.",
    charCount: 450,
    createdAt: "2026-10-22T09:00:00Z",
  },
  {
    id: "mat-3",
    courseId: "eko-bisnis",
    sessionId: 4,
    kind: "default",
    title: "Sesi 4: Teori Biaya Produksi (FC, VC, MC, ATC)",
    text: "Biaya Total (TC) = Biaya Tetap (FC) + Biaya Variabel (VC). Biaya Marjinal (MC) adalah tambahan biaya dari satu unit output tambahan: MC = Delta TC / Delta Q. Hukum pertambahan hasil yang semakin menurun (Diminishing Marginal Returns) menyebabkan kurva MC berbentuk huruf U dan memotong kurva ATC serta AVC pada titik terendah masing-masing kurva.",
    charCount: 380,
    createdAt: "2026-11-01T09:00:00Z",
  },
  {
    id: "mat-4",
    courseId: "eko-bisnis",
    sessionId: 5,
    kind: "default",
    title: "Sesi 5: Maksimalisasi Laba pada Berbagai Struktur Pasar",
    text: "Aturan universal laba maksimum tercapai ketika Pendapatan Marjinal sama dengan Biaya Marjinal (MR = MC). Pada Pasar Persaingan Sempurna, perusahaan adalah price taker sehingga P = MR = AR. Pada Pasar Monopoli atau Persaingan Monopolistik, perusahaan memiliki downward-sloping demand curve sehingga P > MR. Titik impas (Break-even) terjadi jika P = ATC, sementara shutdown point jangka pendek terjadi jika P < AVC.",
    charCount: 440,
    createdAt: "2026-11-05T09:00:00Z",
  },
];

export const curatedQuestions: Record<string, Question[]> = {
  "eko-bisnis-uts": [
    {
      id: "q-ekb-1",
      cpmkCode: "CPMK 1",
      prompt: "Sebuah kafe mahasiswa di dekat kampus SU menemukan bahwa saat harga kopi susu dinaikkan dari Rp18.000 menjadi Rp20.000, jumlah cangkir yang terjual per hari turun dari 200 menjadi 190. Berapakah elastisitas harga permintaannya (PED) dan apa kebijakan harga yang paling logis bagi pemilik kafe?",
      format: "multiple-choice",
      options: [
        { id: "A", text: "Inelastis (|PED| ≈ 0,45); kenaikan harga justru menaikkan total penerimaan (omzet)." },
        { id: "B", text: "Elastis (|PED| ≈ 2,2); kafe merugi karena penurunan volume lebih besar daripada kenaikan harga." },
        { id: "C", text: "Unitari elastis (|PED| = 1); pendapatan pemilik tetap konstan." },
        { id: "D", text: "Elastis sempurna (|PED| = tak terhingga); seluruh pelanggan beralih ke kafe lain." },
      ],
      correctOptionId: "A",
      explanation: "Persentase perubahan kuantitas = -5%, persentase perubahan harga = +11,11%. Nilai |PED| = 5 / 11,11 ≈ 0,45 (< 1, inelastis). Karena permintaan inelastis, kenaikan harga meningkatkan total penerimaan: TR awal = Rp3.600.000, TR baru = Rp3.800.000.",
      rubricPoints: 25,
      difficulty: "medium",
      sourceSessions: [2],
    },
    {
      id: "q-ekb-2",
      cpmkCode: "CPMK 2",
      prompt: "Dalam struktur pasar persaingan monopolistik (misalnya industri kedai kopi artisanal atau brand apparel mahasiswa), mengapa keuntungan supernormal jangka pendek tidak akan bertahan dalam jangka panjang?",
      format: "multiple-choice",
      options: [
        { id: "A", text: "Karena pemerintah menetapkan batas harga atas (price ceiling) secara berkala." },
        { id: "B", text: "Karena rendahnya hambatan masuk (free entry) mengundang kompetitor baru yang menggeser kurva permintaan perusahaan ke kiri sampai P = ATC." },
        { id: "C", text: "Karena produsen sepakat membentuk kartel untuk membatasi kuota produksi." },
        { id: "D", text: "Karena biaya marjinal selalu melampaui pendapatan marjinal dalam jangka panjang." },
      ],
      correctOptionId: "B",
      explanation: "Ketiadaan hambatan masuk tinggi menarik produsen baru saat ada laba ekonomi positif. Masuknya substitusi mengurangi pangsa pasar masing-masing penjual sampai laba ekonomi menjadi nol (normal profit) di mana P = ATC.",
      rubricPoints: 25,
      difficulty: "medium",
      sourceSessions: [5],
    },
    {
      id: "q-ekb-3",
      cpmkCode: "CPMK 2",
      prompt: "Jika biaya tetap (TFC) sebuah unit bisnis sablon merchandise kampus adalah Rp6.000.000 per bulan dan biaya variabel (AVC) per baju adalah Rp40.000, berapakah harga minimum per unit agar perusahaan mencapai titik impas (break-even point) pada volume produksi 300 baju?",
      format: "multiple-choice",
      options: [
        { id: "A", text: "Rp50.000" },
        { id: "B", text: "Rp60.000" },
        { id: "C", text: "Rp70.000" },
        { id: "D", text: "Rp80.000" },
      ],
      correctOptionId: "B",
      explanation: "Total Biaya (TC) = TFC + (AVC * Q) = Rp6.000.000 + (Rp40.000 * 300) = Rp18.000.000. Biaya rata-rata (ATC) = TC / Q = Rp18.000.000 / 300 = Rp60.000. Maka titik impas tercapai saat P = ATC = Rp60.000.",
      rubricPoints: 25,
      difficulty: "medium",
      sourceSessions: [4],
    },
    {
      id: "q-ekb-4",
      cpmkCode: "CPMK 3",
      prompt: "Jelaskan bagaimana intervensi pemerintah berupa penetapan Upah Minimum (price floor di pasar tenaga kerja) mempengaruhi keputusan biaya produksi perusahaan manufaktur dan bagaimana perusahaan menyelaraskan strategi efisiensinya.",
      format: "essay",
      explanation: "Kriteria penilaian: 1) Menyebutkan kenaikan biaya marjinal (MC) dan dampaknya terhadap harga jual; 2) Menjelaskan substitusi faktor produksi dari tenaga kerja ke otomatisasi/teknologi; 3) Mengaitkan dengan rubrik CPMK 3 terkait intervensi regulasi dan pilihan strategis investasi.",
      rubricPoints: 25,
      difficulty: "hard",
      sourceSessions: [6, 7],
    },
  ],
};

export const skillAxes: SkillAxis[] = [
  { label: "Penawaran", you: 78, cohort: 70 },
  { label: "Permintaan", you: 84, cohort: 74 },
  { label: "Elastisitas", you: 61, cohort: 66 },
  { label: "Perilaku konsumen", you: 72, cohort: 68 },
  { label: "Biaya produksi", you: 55, cohort: 63 },
  { label: "Struktur pasar", you: 42, cohort: 60 },
  { label: "Analisis investasi", you: 36, cohort: 58 },
  { label: "Kebijakan makro", you: 64, cohort: 67 },
  { label: "Perdagangan internasional", you: 70, cohort: 65 },
  { label: "Etika dan hukum bisnis", you: 81, cohort: 72 },
];

export const cpmkGaps: CpmkGap[] = [
  {
    code: "CPMK 2",
    label: "Maksimalisasi keuntungan pada pasar kompetitif dan non-kompetitif",
    mastery: 38,
    note: "Sering tertukar antara biaya tetap dan biaya variabel saat menghitung laba.",
  },
  {
    code: "CPMK 3",
    label: "Strategi pertumbuhan bisnis dan intervensi pemerintah",
    mastery: 46,
    note: "Belum yakin kapan intervensi harga disebut sebagai price ceiling atau price floor.",
  },
  {
    code: "CPMK 1",
    label: "Elastisitas harga dan perilaku konsumen",
    mastery: 64,
    note: "Rumus elastisitas sudah benar, arah kesimpulannya masih terbalik.",
  },
];

export const setupSteps: SetupStep[] = [
  { label: "Unggah materi sesi 1-5", detail: "PPT dan transkrip Zoom Ekonomi Bisnis", done: true },
  { label: "Tetapkan CPMK dan rubrik", detail: "4 CPMK, rubrik penilaian UTS", done: true },
  { label: "Hubungkan API key", detail: "Dipakai untuk membuat soal latihan", done: false },
];

export const insight: Insight = {
  title: "Elastisitas bukan cuma soal ujian",
  body:
    "Tim pricing memakai elastisitas harga untuk memutuskan kapan diskon menambah omzet dan kapan justru memotong margin. Kalau kamu bisa menjelaskan arah elastisitas dengan tepat, kamu sudah melakukan satu bagian kecil dari pekerjaan itu.",
  source: "Terhubung ke CPMK 1 · Ekonomi Bisnis",
};
