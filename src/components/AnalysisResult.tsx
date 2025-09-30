import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
// import { Textarea } from './ui/textarea';
import { Printer, Edit2, Save, X } from 'lucide-react';
import { UserInfo, AnalysisData } from '../types';

interface AnalysisResultProps {
  userInfo: UserInfo;
  analysisData: AnalysisData;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ userInfo, analysisData, onReset }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<{
    temperament: string;
    personality: string;
    overallAnalysis: string;
    conclusion: string;
  }>({
    temperament: '',
    personality: '',
    overallAnalysis: '',
    conclusion: ''
  });

  const handlePrint = () => {
    window.print();
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    // 현재 내용을 편집 상태로 복사
    setEditedContent(prev => ({
      ...prev,
      [section]: getCurrentContent(section)
    }));
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditedContent({
      temperament: '',
      personality: '',
      overallAnalysis: '',
      conclusion: ''
    });
  };

  const saveEditing = (section: string) => {
    // 여기서 실제로 분석 결과를 업데이트하는 로직을 구현할 수 있습니다
    console.log(`Saving ${section}:`, editedContent[section as keyof typeof editedContent]);
    setEditingSection(null);
  };

  const parseAnalysisResult = (analysisResult: string) => {
    const sections = {
      temperament: '',
      personality: '',
      overallAnalysis: '',
      conclusion: ''
    };

    console.log('분석 결과 파싱 시작:', analysisResult);

    // 분석 결과를 파싱하여 각 섹션별로 분리
    const lines = analysisResult.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('기질 영역') || trimmedLine.includes('=== 기질 영역 ===')) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection as keyof typeof sections] = currentContent.join('\n').trim();
        }
        currentSection = 'temperament';
        currentContent = [];
      } else if (trimmedLine.includes('성격 영역') || trimmedLine.includes('=== 성격 영역 ===')) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection as keyof typeof sections] = currentContent.join('\n').trim();
        }
        currentSection = 'personality';
        currentContent = [];
      } else if (trimmedLine.includes('전체 도형 분석') || trimmedLine.includes('=== 전체 도형 분석 영역 ===')) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection as keyof typeof sections] = currentContent.join('\n').trim();
        }
        currentSection = 'overallAnalysis';
        currentContent = [];
      } else if (trimmedLine.includes('종합 결과') || trimmedLine.includes('=== 종합 결과 영역 ===')) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection as keyof typeof sections] = currentContent.join('\n').trim();
        }
        currentSection = 'conclusion';
        currentContent = [];
      } else if (currentSection && trimmedLine) {
        // 섹션 헤더가 아닌 실제 내용인 경우
        if (!trimmedLine.includes('===') && !trimmedLine.includes('영역')) {
          currentContent.push(line);
        }
      }
    }

    // 마지막 섹션 처리
    if (currentSection && currentContent.length > 0) {
      sections[currentSection as keyof typeof sections] = currentContent.join('\n').trim();
    }

    console.log('파싱된 섹션들:', sections);
    return sections;
  };

  const getCurrentContent = (section: string): string => {
    const parsedSections = parseAnalysisResult(analysisData.analysisResult);
    const sectionContent = parsedSections[section as keyof typeof parsedSections];
    
    // 파싱된 내용이 있으면 반환, 없으면 전체 분석 결과에서 해당 섹션 관련 내용 찾기
    if (sectionContent && sectionContent.trim()) {
      return sectionContent;
    }
    
    // 파싱이 실패한 경우 전체 분석 결과를 표시
    if (analysisData.analysisResult && analysisData.analysisResult.trim()) {
      return analysisData.analysisResult;
    }
    
    return getDefaultContent(section);
  };

  const getDefaultContent = (section: string): string => {
    // 기본 안내 문구 (분석 결과가 없을 때)
    switch (section) {
      case 'temperament':
        return '1차 도형에 대한 기질적 특징, 장점 및 보완점이 여기에 표시됩니다.';
      case 'personality':
        return '복합기질(복합도형)의 특징, 장점 및 보완점이 여기에 표시됩니다.';
      case 'overallAnalysis':
        return '전체 도형의 패턴, 변화 과정, 그리고 각 단계별 의미가 여기에 표시됩니다.';
      case 'conclusion':
        return '전체 도형 분석을 바탕으로 한 종합적인 결론과 개인적 성장을 위한 구체적인 향후 과제가 여기에 표시됩니다.';
      default:
        return '';
    }
  };



  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return '높음';
    if (confidence >= 0.6) return '보통';
    return '낮음';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>분석 결과</CardTitle>
          <CardDescription>
            도형심리 분석이 완료되었습니다. 결과를 확인하고 저장하거나 인쇄할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={analysisData.imagePreview}
                  alt="분석된 도형"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">분석된 도형</h3>
                <p className="text-sm text-muted-foreground">
                  파일명: {analysisData.imageFile.name}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">분석 신뢰도</h4>
                <Badge
                  variant={getConfidenceColor(analysisData.confidence) === 'success' ? 'default' : 
                          getConfidenceColor(analysisData.confidence) === 'warning' ? 'secondary' : 'destructive'}
                >
                  {`${(analysisData.confidence * 100).toFixed(1)}% (${getConfidenceLabel(analysisData.confidence)})`}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">분석 일시</h4>
                <p className="text-sm text-muted-foreground">
                  {analysisData.timestamp.toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>사용자 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">이름</p>
              <p className="text-sm">{userInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">생년월일</p>
              <p className="text-sm">{userInfo.birthDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">나이</p>
              <p className="text-sm">{userInfo.age}세</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">성별</p>
              <p className="text-sm">
                {userInfo.gender === 'male' ? '남성' : userInfo.gender === 'female' ? '여성' : '미선택'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">자주 사용하는 손</p>
              <p className="text-sm">
                {userInfo.dominantHand === 'right' ? '오른손' : userInfo.dominantHand === 'left' ? '왼손' : '미선택'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">직업</p>
              <p className="text-sm">{userInfo.occupation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">혈액형</p>
              <p className="text-sm">
                {userInfo.bloodType === 'A' ? 'A형' : userInfo.bloodType === 'B' ? 'B형' : userInfo.bloodType === 'O' ? 'O형' : userInfo.bloodType === 'AB' ? 'AB형' : '미입력'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">이메일</p>
              <p className="text-sm">{userInfo.email || '미입력'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisData.shapeSelection && (
        <Card>
          <CardHeader>
            <CardTitle>도형 선택 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">1차 도형</p>
                <p className="text-sm">
                  {analysisData.shapeSelection.primaryShape === 'circle' ? '○' : 
                   analysisData.shapeSelection.primaryShape === 'triangle' ? '△' : 
                   analysisData.shapeSelection.primaryShape === 'square' ? '□' : 
                   analysisData.shapeSelection.primaryShape === 's' ? 'S' : 
                   analysisData.shapeSelection.primaryShape || '미선택'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">2차 도형</p>
                <p className="text-sm">
                  {analysisData.shapeSelection.secondaryShape === 'circle' ? '○' : 
                   analysisData.shapeSelection.secondaryShape === 'triangle' ? '△' : 
                   analysisData.shapeSelection.secondaryShape === 'square' ? '□' : 
                   analysisData.shapeSelection.secondaryShape === 's' ? 'S' : 
                   analysisData.shapeSelection.secondaryShape || '미선택'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">3차 도형</p>
                <p className="text-sm">
                  {analysisData.shapeSelection.tertiaryShape === 'circle' ? '○' : 
                   analysisData.shapeSelection.tertiaryShape === 'triangle' ? '△' : 
                   analysisData.shapeSelection.tertiaryShape === 'square' ? '□' : 
                   analysisData.shapeSelection.tertiaryShape === 's' ? 'S' : 
                   analysisData.shapeSelection.tertiaryShape || '미선택'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">4차 도형</p>
                <p className="text-sm">
                  {analysisData.shapeSelection.quaternaryShape === 'circle' ? '○' : 
                   analysisData.shapeSelection.quaternaryShape === 'triangle' ? '△' : 
                   analysisData.shapeSelection.quaternaryShape === 'square' ? '□' : 
                   analysisData.shapeSelection.quaternaryShape === 's' ? 'S' : 
                   analysisData.shapeSelection.quaternaryShape || '미선택'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">1차 도형 12가지 형태</p>
                <p className="text-sm">{analysisData.shapeSelection.primaryShapeType || '미선택'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">선택 방식</p>
                <p className="text-sm">
                  {analysisData.shapeSelection.selectionMethod === 'basic' ? '기본' : 
                   analysisData.shapeSelection.selectionMethod === 'dichotomy' ? '이분법' : '미선택'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>심리 분석 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기질 영역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-primary">기질 영역</h4>
              {editingSection !== 'temperament' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing('temperament')}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveEditing('temperament')}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    취소
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">1차 도형 특징</p>
              {editingSection === 'temperament' ? (
                <textarea
                  value={editedContent.temperament}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(prev => ({ ...prev, temperament: e.target.value }))}
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-blue-700 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="1차 도형에 대한 기질적 특징, 장점 및 보완점을 입력하세요..."
                />
              ) : (
                <div className="text-sm text-blue-700 leading-relaxed whitespace-pre-line">
                  {getCurrentContent('temperament') || 
                    (analysisData.shapeSelection?.primaryShape ? 
                      `${analysisData.shapeSelection.primaryShape === 'circle' ? '○' : 
                        analysisData.shapeSelection.primaryShape === 'triangle' ? '△' : 
                        analysisData.shapeSelection.primaryShape === 'square' ? '□' : 
                        analysisData.shapeSelection.primaryShape === 's' ? 'S' : 
                        analysisData.shapeSelection.primaryShape} 도형에 대한 기질적 특징, 장점 및 보완점이 여기에 표시됩니다.` : 
                      '1차 도형이 선택되지 않았습니다.')}
                </div>
              )}
            </div>
          </div>

          {/* 성격 영역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-primary">성격 영역</h4>
              {editingSection !== 'personality' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing('personality')}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveEditing('personality')}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    취소
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                복합기질(복합도형) 분석 - {userInfo.age}세
              </p>
              {editingSection === 'personality' ? (
                <textarea
                  value={editedContent.personality}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(prev => ({ ...prev, personality: e.target.value }))}
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-green-600 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="복합기질(복합도형)의 특징, 장점 및 보완점을 입력하세요..."
                />
              ) : (
                <div className="text-sm text-green-600 leading-relaxed whitespace-pre-line">
                  {getCurrentContent('personality') || 
                    (userInfo.age <= 45 ? 
                      `1차 + 2차 도형 복합기질의 특징, 장점 및 보완점이 여기에 표시됩니다.` :
                      userInfo.age >= 46 && userInfo.age <= 70 ?
                      `1차 + 2차 도형 복합기질과 2차 + 3차 도형 복합기질의 특징, 장점 및 보완점이 여기에 표시됩니다.` :
                      `1차 + 2차 도형 복합기질, 2차 + 3차 도형 복합기질, 그리고 3차 + 4차 도형 복합기질의 향후 발전 방향과 과제가 여기에 표시됩니다.`)}
                </div>
              )}
            </div>
          </div>

          {/* 전체 도형 분석 영역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-primary">전체 도형 분석 영역</h4>
              {editingSection !== 'overallAnalysis' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing('overallAnalysis')}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveEditing('overallAnalysis')}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    취소
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-2">선택된 모든 도형의 종합 분석</p>
              {editingSection === 'overallAnalysis' ? (
                <textarea
                  value={editedContent.overallAnalysis}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(prev => ({ ...prev, overallAnalysis: e.target.value }))}
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-purple-700 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="전체 도형의 패턴, 변화 과정, 그리고 각 단계별 의미를 입력하세요..."
                />
              ) : (
                <div className="text-sm text-purple-700 leading-relaxed whitespace-pre-line">
                  {getCurrentContent('overallAnalysis') || 
                    (analysisData.shapeSelection ? 
                      `선택된 도형들: ${analysisData.shapeSelection.primaryShape || '미선택'} → ${analysisData.shapeSelection.secondaryShape || '미선택'} → ${analysisData.shapeSelection.tertiaryShape || '미선택'} → ${analysisData.shapeSelection.quaternaryShape || '미선택'}\n전체 도형의 패턴, 변화 과정, 그리고 각 단계별 의미가 여기에 표시됩니다.` : 
                      '도형 선택 정보가 없습니다.')}
                </div>
              )}
            </div>
          </div>

          {/* 종합 결과 영역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-primary">종합 결과 영역</h4>
              {editingSection !== 'conclusion' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing('conclusion')}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveEditing('conclusion')}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    취소
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-orange-800 mb-2">전체 분석 결론 및 향후 과제</p>
              {editingSection === 'conclusion' ? (
                <textarea
                  value={editedContent.conclusion}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(prev => ({ ...prev, conclusion: e.target.value }))}
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-orange-700 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="전체 도형 분석을 바탕으로 한 종합적인 결론과 개인적 성장을 위한 구체적인 향후 과제를 입력하세요..."
                />
              ) : (
                <div className="text-sm text-orange-700 leading-relaxed whitespace-pre-line">
                  {getCurrentContent('conclusion') || 
                    '전체 도형 분석을 바탕으로 한 종합적인 결론과 개인적 성장을 위한 구체적인 향후 과제가 여기에 표시됩니다.'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>주의사항:</strong> 이 분석 결과는 AI 기반 도형심리 테스트를 통한 참고용 결과입니다. 
          정확한 심리 진단을 위해서는 전문 심리 상담사와 상담하시기 바랍니다.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          인쇄
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResult;
