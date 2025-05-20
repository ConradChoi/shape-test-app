export interface UserInfo {
  name: string;
  dominantHand: 'left' | 'right';
  occupation: string;
  birthDate: string;
}

export interface ShapeAnalysis {
  firstShape: string;
  secondShape: string;
  thirdShape: string;
  fourthShape: string;
}

export interface AnalysisResult {
  userInfo: UserInfo;
  shapeAnalysis: ShapeAnalysis;
  interpretation: string;
} 