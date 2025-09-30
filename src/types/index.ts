export interface UserInfo {
  name: string;
  birthDate: string; // YYYY-MM-DD format
  age: number;
  gender: '' | 'male' | 'female';
  dominantHand: '' | 'right' | 'left';
  occupation: string;
  bloodType: '' | 'A' | 'B' | 'O' | 'AB';
  email: string;
  phone: string;
}

export interface ShapeSelection {
  primaryShape: string; // 1차 도형
  secondaryShape: string; // 2차 도형
  tertiaryShape: string; // 3차 도형
  quaternaryShape: string; // 4차 도형
  primaryShapeType: string; // 1차 도형 12가지 형태 중 선택
  selectionMethod: 'basic' | 'dichotomy'; // 기본 or 이분법
  dichotomySelections: {
    option1_2: string[]; // 1번+2번 선택
    option2_3: string[]; // 2번+3번 선택
    option1_3: string[]; // 1번+3번 선택
  };
}

export interface AnalysisData {
  imageFile: File;
  imagePreview: string;
  analysisResult: string;
  confidence: number;
  timestamp: Date;
  shapeSelection?: ShapeSelection; // 도형 선택 정보 추가
}

export interface ShapeAnalysis {
  shapeType: string;
  characteristics: string[];
  psychologicalInterpretation: string;
  recommendations: string[];
}
