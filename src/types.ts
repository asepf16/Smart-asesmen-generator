export interface SchoolIdentity {
  schoolName: string;
  npsn?: string;
  educationLevel: 'TK/PAUD' | 'SD/MI' | 'SMP/MTs' | 'SMA/MA' | 'SMK';
  phase: 'Fondasi' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  grade: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  curriculum: string;
  subject?: string;
  schoolAddress?: string;
  principalName?: string;
  principalNip?: string;
}

export interface TeacherIdentity {
  teacherName: string;
  nip?: string;
  subject: string;
  role?: string;
}

export type AssessmentType =
  | 'Asesmen Formatif'
  | 'Asesmen Sumatif Harian/Lingkup Materi'
  | 'Asesmen Sumatif Tengah Semester'
  | 'Asesmen Sumatif Akhir Semester'
  | 'Asesmen Sumatif Akhir Tahun'
  | 'Asesmen Sumatif Akhir Jenjang';

export interface TujuanPembelajaran {
  id: string;
  code: string;
  tpText: string;
  material: string;
  scope?: string;
  competence?: string;
  isAiSuggested?: boolean;
}

export interface TPAnalysisItem {
  id: string;
  code: string;
  tpText: string;
  kko: string;
  bloomLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  cognitiveCategory: 'LOTS' | 'MOTS' | 'HOTS';
  coreCompetence: string;
  essentialMaterial: string;
  aspects: {
    knowledge: string;
    skill: string;
    understanding: string;
  };
  complexity: 'Rendah' | 'Sedang' | 'Tinggi';
  recommendedIndicators: string[];
  recommendedAssessmentForms: string[];
  akmRelevance: string;
}

export interface BlueprintItem {
  id: string;
  number: number;
  tpCode: string;
  tpText: string;
  material: string;
  indicator: string;
  bloomLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  cognitiveCategory: 'LOTS' | 'MOTS' | 'HOTS';
  competence: string;
  questionType: string;
  weight: number;
  stimulusType: string;
}

export interface ExamDistribution {
  lots: number;
  mots: number;
  hots: number;
}

export interface ExamConfig {
  assessmentType: AssessmentType;
  totalQuestions: number;
  durationMinutes: number;
  distribution: ExamDistribution;
  questionTypes: Record<string, number>;
  akmProportion?: number;
}

export interface OptionItem {
  label: string;
  text: string;
}

export interface StatementItem {
  statement: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface RubricItem {
  score: number;
  description: string;
}

export interface QuestionItem {
  id: string;
  number: number;
  tpCode: string;
  questionType: string;
  stimulus?: string;
  question: string;
  options?: OptionItem[];
  complexItems?: StatementItem[];
  matchingPairs?: MatchingPair[];
  answerKey: string;
  explanation: string;
  bloomLevel: string;
  cognitiveCategory: 'LOTS' | 'MOTS' | 'HOTS';
  competence: string;
  hotsReason?: string;
  akmAspect?: string;
  weight: number;
  maxScore: number;
  rubric?: RubricItem[];
  remedialNote?: string;
  enrichmentNote?: string;
}

export interface ValidationItem {
  number: number;
  status: 'Sangat Baik' | 'Baik' | 'Perlu Revisi';
  score: number;
  cognitiveCheck: string;
  stimulusCheck: string;
  keyCheck: string;
  distractorCheck: string;
  languageCheck: string;
  notes: string;
  recommendations: string;
}

export interface ValidationReport {
  overallVerdict: string;
  summary: string;
  validationResults: ValidationItem[];
}

export interface AssessmentPackage {
  id: string;
  createdAt: string;
  title: string;
  schoolInfo: SchoolIdentity;
  teacherInfo: TeacherIdentity;
  examConfig: ExamConfig;
  tps: TujuanPembelajaran[];
  tpAnalyses?: TPAnalysisItem[];
  blueprint: BlueprintItem[];
  questions: QuestionItem[];
  validation?: ValidationReport;
}
