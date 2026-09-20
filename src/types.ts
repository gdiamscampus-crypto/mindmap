export type NodeShape = 'pill' | 'rounded' | 'rectangle' | 'underline' | 'oval';
export type ConnectionStyle = 'curved' | 'straight' | 'stepped';
export type FontStyle = 'sans' | 'serif' | 'mono' | 'handwriting';
export type CanvasPattern = 'dots' | 'grid' | 'blank';

export interface MindNodeData {
  id: string;
  parentId: string | null;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  // Node appearance
  color?: string; // background color
  textColor?: string;
  fontSize?: number; // e.g. 14, 16, 18, 22
  fontStyle?: FontStyle;
  fontWeight?: 'normal' | 'medium' | 'bold';
  shape?: NodeShape;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
  // Branch connection
  lineStyle?: ConnectionStyle;
  branchColor?: string;
  lineWidth?: number;
  // Node state
  collapsed?: boolean;
  notes?: string;
  emoji?: string;
  // Layout side relative to root for horizontal layout: 'left' | 'right' | null
  side?: 'left' | 'right';
}

export interface MindMap {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  backgroundColor: string;
  canvasPattern: CanvasPattern;
  defaultLineStyle: ConnectionStyle;
  rootId: string;
  nodes: Record<string, MindNodeData>;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  map: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt'>;
}

// ==========================================
// AI for Teachers Workshop Types
// ==========================================

export interface LessonPlanData {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  learningObjectives: string[];
  learningOutcomes: string[];
  previousKnowledge: string[];
  warmupActivity: {
    title: string;
    description: string;
    time: string;
  };
  teachingActivities: {
    step: string;
    time: string;
    details: string;
  }[];
  examples: string[];
  studentActivity: {
    title: string;
    instructions: string[];
    time: string;
  };
  assessmentQuestions: string[];
  homework: string[];
  differentiationSlowLearners: string[];
  extensionAdvancedLearners: string[];
}

export interface StudentMarkRecord {
  id: string;
  name: string;
  test1: number; // max 20
  test2: number; // max 20
  assignment: number; // max 10
  activity: number; // max 10
  finalExam: number; // max 40
}

export interface SlideData {
  slideNumber: number;
  title: string;
  content: string[];
  suggestedVisual: string;
  speakingPoint: string;
}

export interface QuizQuestionData {
  id: number;
  type: 'mcq' | 'true_false' | 'application';
  question: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
  explanation: string;
  autoGrading: boolean;
}

export interface WorkshopPackage {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  createdAt: number;
  lessonPlan: LessonPlanData;
  students: StudentMarkRecord[];
  slides: SlideData[];
  quiz: QuizQuestionData[];
  checklist: {
    docsCompleted: boolean;
    sheetsCompleted: boolean;
    slidesCompleted: boolean;
    formsCompleted: boolean;
  };
}

