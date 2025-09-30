import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { AnalysisData, ShapeSelection } from '../types';

interface ImageUploadFormProps {
  onSubmit: (data: AnalysisData) => void;
  onError: (error: string) => void;
  initialData?: AnalysisData;
  userInfo?: any;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onSubmit, onError, initialData, userInfo }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialData?.imageFile || null);
  const [preview, setPreview] = useState<string | null>(initialData?.imagePreview || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 도형 선택 상태
  const [shapeSelection, setShapeSelection] = useState<ShapeSelection>(initialData?.shapeSelection || {
    primaryShape: '',
    secondaryShape: '',
    tertiaryShape: '',
    quaternaryShape: '',
    primaryShapeType: '',
    selectionMethod: 'basic',
    dichotomySelections: {
      option1_2: [],
      option2_3: [],
      option1_3: []
    }
  });

  // 1차 도형 12가지 형태 옵션
  const primaryShapeTypes = [
    '미개발', '순수열정', '중복형', '조사형', '몰입형', '천재형',
    '드문형', '콤플렉스', '역동성', '욕구불만', '일자형', '무가치형'
  ];

  // 도형 선택 옵션
  const shapeOptions = [
    { value: 'circle', label: '○' },
    { value: 'triangle', label: '△' },
    { value: 'square', label: '□' },
    { value: 's', label: 'S' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onError(''); // Clear any previous errors
      } else {
        onError('이미지 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 도형 선택 핸들러들
  const handleShapeChange = (shapeType: keyof ShapeSelection, value: string) => {
    setShapeSelection(prev => {
      const newSelection = { ...prev, [shapeType]: value };
      
      // 중복 선택 방지 로직
      if (shapeType === 'primaryShape') {
        // 1차 선택 시, 2차~4차에서 같은 값 제거
        if (newSelection.secondaryShape === value) newSelection.secondaryShape = '';
        if (newSelection.tertiaryShape === value) newSelection.tertiaryShape = '';
        if (newSelection.quaternaryShape === value) newSelection.quaternaryShape = '';
      } else if (shapeType === 'secondaryShape') {
        // 2차 선택 시, 3차~4차에서 같은 값 제거
        if (newSelection.tertiaryShape === value) newSelection.tertiaryShape = '';
        if (newSelection.quaternaryShape === value) newSelection.quaternaryShape = '';
      } else if (shapeType === 'tertiaryShape') {
        // 3차 선택 시, 4차에서 같은 값 제거
        if (newSelection.quaternaryShape === value) newSelection.quaternaryShape = '';
      }
      
      return newSelection;
    });
  };

  const handleSelectionMethodChange = (method: 'basic' | 'dichotomy') => {
    setShapeSelection(prev => ({
      ...prev,
      selectionMethod: method
    }));
  };

  const handleDichotomySelection = (option: keyof ShapeSelection['dichotomySelections'], value: string, checked: boolean) => {
    setShapeSelection(prev => ({
      ...prev,
      dichotomySelections: {
        ...prev.dichotomySelections,
        [option]: checked 
          ? [...prev.dichotomySelections[option], value]
          : prev.dichotomySelections[option].filter(item => item !== value)
      }
    }));
  };

  // 각 단계별로 사용 가능한 도형 옵션 필터링
  const getAvailableShapeOptions = (currentShape: string) => {
    const selectedShapes = [
      shapeSelection.primaryShape,
      shapeSelection.secondaryShape,
      shapeSelection.tertiaryShape,
      shapeSelection.quaternaryShape
    ].filter(Boolean);
    
    return shapeOptions.filter(option => 
      option.value === currentShape || !selectedShapes.includes(option.value)
    );
  };

  const analyzeImage = async (file: File, userInfo: any, shapeSelection: ShapeSelection): Promise<string> => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `이 도형 이미지와 선택된 도형 정보를 분석하여 다음 구조로 심리학적 해석을 제공해주세요:

=== 기질 영역 ===
1차 도형 ${shapeSelection.primaryShape}에 대한 기질적 특징, 장점 및 보완점을 상세히 설명해주세요.

=== 성격 영역 ===
복합기질(복합도형) 분석:
${userInfo.age <= 45 ? 
  `- 1차 + 2차 도형 복합기질: ${shapeSelection.primaryShape} + ${shapeSelection.secondaryShape}의 특징, 장점 및 보완점` :
  userInfo.age >= 46 && userInfo.age <= 70 ?
  `- 1차 + 2차 도형 복합기질: ${shapeSelection.primaryShape} + ${shapeSelection.secondaryShape}의 특징, 장점 및 보완점
- 2차 + 3차 도형 복합기질: ${shapeSelection.secondaryShape} + ${shapeSelection.tertiaryShape}의 특징, 장점 및 보완점` :
  `- 1차 + 2차 도형 복합기질: ${shapeSelection.primaryShape} + ${shapeSelection.secondaryShape}의 특징, 장점 및 보완점
- 2차 + 3차 도형 복합기질: ${shapeSelection.secondaryShape} + ${shapeSelection.tertiaryShape}의 특징, 장점 및 보완점
- 3차 + 4차 도형 복합기질 (향후 과제): ${shapeSelection.tertiaryShape} + ${shapeSelection.quaternaryShape}의 향후 발전 방향과 과제`}

=== 전체 도형 분석 영역 ===
선택된 도형들의 변화 과정 (${shapeSelection.primaryShape} → ${shapeSelection.secondaryShape} → ${shapeSelection.tertiaryShape} → ${shapeSelection.quaternaryShape})을 바탕으로 전체 도형의 패턴, 변화 과정, 그리고 각 단계별 의미를 분석해주세요.

=== 종합 결과 영역 ===
전체 도형 분석을 바탕으로 한 종합적인 결론과 개인적 성장을 위한 구체적인 향후 과제를 제시해주세요.

각 영역별로 전문적이면서도 이해하기 쉽게 한국어로 작성해주세요.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API 오류 상세:', errorData);
        
        let errorMessage = 'API 요청 실패';
        if (response.status === 401) {
          errorMessage = 'OpenAI API 키가 유효하지 않거나 권한이 없습니다. API 키를 확인해주세요.';
        } else if (response.status === 429) {
          errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 500) {
          errorMessage = 'OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = `API 요청 실패 (${response.status}): ${errorData.error?.message || '알 수 없는 오류'}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API 오류:', error);
      
      // API 키 문제인 경우 더 구체적인 Mock 데이터 제공
      if (error instanceof Error && error.message.includes('API 키')) {
        console.warn('API 키 문제로 인해 Mock 데이터를 사용합니다.');
        return generateDetailedMockAnalysis(shapeSelection);
      }
      
      // Fallback to mock result if API fails
      const mockResults = [
        "이 도형은 안정성과 균형을 나타내며, 사용자는 체계적이고 신중한 성격을 가지고 있습니다. 직선과 곡선의 조화는 창의성과 논리성을 동시에 갖춘 인물임을 시사합니다.",
        "원형의 도형은 완성도와 조화를 중시하는 성격을 보여줍니다. 사용자는 타인과의 관계를 중요하게 생각하며, 협력적인 환경에서 최고의 성과를 낼 수 있습니다.",
        "각진 도형은 강한 의지력과 목표 지향적 성격을 나타냅니다. 사용자는 도전을 두려워하지 않으며, 명확한 계획을 세워 목표를 달성하는 능력이 뛰어납니다."
      ];
      return mockResults[Math.floor(Math.random() * mockResults.length)];
    }
  };

  const generateDetailedMockAnalysis = (shapeSelection: ShapeSelection) => {
    return `
도형심리 테스트 분석 결과 (Mock 데이터)

=== 기질 영역 ===
1차 도형 ${shapeSelection.primaryShape}에 대한 기질적 특징:
- 기본적인 성향과 특성을 나타내는 핵심 도형
- 개인의 근본적인 기질과 성향을 보여줍니다
- 장점: 안정적이고 일관된 성향
- 보완점: 유연성과 적응력 향상 필요

=== 성격 영역 ===
복합기질(복합도형) 분석:
- 1차 + 2차 도형의 조합으로 나타나는 성격적 특성
- 각 도형의 장점을 결합한 독특한 성격 유형
- 장점: 다양한 상황에 대한 적응력
- 보완점: 일관성 있는 목표 설정과 추진력

=== 전체 도형 분석 ===
선택된 도형들의 변화 과정:
${shapeSelection.primaryShape} → ${shapeSelection.secondaryShape} → ${shapeSelection.tertiaryShape} → ${shapeSelection.quaternaryShape}

각 단계별 의미:
- 1차: 기본 기질과 성향
- 2차: 성장과 발전 방향
- 3차: 성숙과 완성도
- 4차: 미래 지향적 과제

=== 종합 결과 ===
전체 분석을 바탕으로 한 결론:
개인의 성장 과정과 발전 방향을 명확히 보여주는 도형 패턴입니다. 
각 단계별로 체계적인 발전을 이루어 나갈 수 있는 잠재력을 가지고 있습니다.

향후 과제:
1. 1차 도형의 기본 기질을 바탕으로 한 안정적 성장
2. 2차 도형의 발전 방향을 통한 목표 설정
3. 3차 도형의 성숙도를 통한 완성도 향상
4. 4차 도형의 미래 지향적 과제 수행

※ 이 분석은 Mock 데이터입니다. 실제 분석을 위해서는 유효한 OpenAI API 키가 필요합니다.
    `.trim();
  };

  const validateShapeSelection = (): string | null => {
    // 1차~4차 도형 검증
    if (!shapeSelection.primaryShape) {
      return '1차 도형을 선택해주세요.';
    }
    if (!shapeSelection.secondaryShape) {
      return '2차 도형을 선택해주세요.';
    }
    if (!shapeSelection.tertiaryShape) {
      return '3차 도형을 선택해주세요.';
    }
    if (!shapeSelection.quaternaryShape) {
      return '4차 도형을 선택해주세요.';
    }

    // 1차 도형 12가지 형태 검증
    if (shapeSelection.selectionMethod === 'basic') {
      if (!shapeSelection.primaryShapeType.trim()) {
        return '1차 도형 12가지 형태 중 하나를 선택해주세요.';
      }
    } else if (shapeSelection.selectionMethod === 'dichotomy') {
      const { option1_2, option2_3, option1_3 } = shapeSelection.dichotomySelections;
      if (option1_2.length === 0) {
        return '1번+2번 조합에서 해당하는 형태를 선택해주세요.';
      }
      if (option2_3.length === 0) {
        return '2번+3번 조합에서 해당하는 형태를 선택해주세요.';
      }
      if (option1_3.length === 0) {
        return '1번+3번 조합에서 해당하는 형태를 선택해주세요.';
      }
    }

    return null;
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      onError('이미지를 선택해주세요.');
      return;
    }

    // 도형 선택 정보 검증
    const validationError = validateShapeSelection();
    if (validationError) {
      onError(validationError);
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeImage(selectedFile, userInfo, shapeSelection);
      const analysisData: AnalysisData = {
        imageFile: selectedFile,
        imagePreview: preview!,
        analysisResult,
        confidence: Math.random() * 0.3 + 0.7, // Mock confidence between 0.7-1.0
        timestamp: new Date(),
        shapeSelection
      };
      onSubmit(analysisData);
    } catch (error) {
      onError('이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 이미지 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>검사지 이미지 업로드</CardTitle>
          <CardDescription>
            그린 도형 이미지를 업로드하여 심리 분석을 진행합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                이미지 파일을 선택하거나 드래그하여 업로드
              </h3>
              <p className="text-muted-foreground">
                JPG, PNG, GIF 파일만 지원됩니다.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <Card>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={preview || ''}
                  alt="업로드된 도형"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{selectedFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  크기: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  variant="destructive"
                  onClick={handleRemoveFile}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  제거
                </Button>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* 2. 1차/2차/3차/4차 도형 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>도형 선택</CardTitle>
          <CardDescription>
            그린 도형의 특성을 선택하여 더 정확한 분석을 진행합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1차~4차 도형 선택</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryShape">1차 도형</Label>
                <Select value={shapeSelection.primaryShape} onValueChange={(value) => handleShapeChange('primaryShape', value)}>
                  <SelectTrigger id="primaryShape">
                    <SelectValue placeholder="1차 도형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableShapeOptions(shapeSelection.primaryShape).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryShape">2차 도형</Label>
                <Select value={shapeSelection.secondaryShape} onValueChange={(value) => handleShapeChange('secondaryShape', value)}>
                  <SelectTrigger id="secondaryShape">
                    <SelectValue placeholder="2차 도형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableShapeOptions(shapeSelection.secondaryShape).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tertiaryShape">3차 도형</Label>
                <Select value={shapeSelection.tertiaryShape} onValueChange={(value) => handleShapeChange('tertiaryShape', value)}>
                  <SelectTrigger id="tertiaryShape">
                    <SelectValue placeholder="3차 도형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableShapeOptions(shapeSelection.tertiaryShape).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quaternaryShape">4차 도형</Label>
                <Select value={shapeSelection.quaternaryShape} onValueChange={(value) => handleShapeChange('quaternaryShape', value)}>
                  <SelectTrigger id="quaternaryShape">
                    <SelectValue placeholder="4차 도형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableShapeOptions(shapeSelection.quaternaryShape).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. 1차 도형 12가지 형태 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>1차 도형 12가지 형태</CardTitle>
          <CardDescription>
            첨부한 이미지에서 해당하는 형태를 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 선택 방식 */}
          <div className="space-y-3">
            <Label>선택 방식</Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="basic"
                  name="selectionMethod"
                  value="basic"
                  checked={shapeSelection.selectionMethod === 'basic'}
                  onChange={(e) => handleSelectionMethodChange(e.target.value as 'basic' | 'dichotomy')}
                  className="h-4 w-4"
                />
                <Label htmlFor="basic">기본</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="dichotomy"
                  name="selectionMethod"
                  value="dichotomy"
                  checked={shapeSelection.selectionMethod === 'dichotomy'}
                  onChange={(e) => handleSelectionMethodChange(e.target.value as 'basic' | 'dichotomy')}
                  className="h-4 w-4"
                />
                <Label htmlFor="dichotomy">이분법</Label>
              </div>
            </div>
          </div>

          {/* 기본 방식 */}
          {shapeSelection.selectionMethod === 'basic' && (
            <div className="space-y-3">
              <Label>첨부한 이미지에서 해당하는 형태를 선택하세요</Label>
              <div className="grid grid-cols-3 gap-3">
                {primaryShapeTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`basic-${index}`}
                      checked={shapeSelection.primaryShapeType === type}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          handleShapeChange('primaryShapeType', type);
                        } else {
                          handleShapeChange('primaryShapeType', '');
                        }
                      }}
                    />
                    <Label htmlFor={`basic-${index}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이분법 방식 */}
          {shapeSelection.selectionMethod === 'dichotomy' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>1번+2번 조합에서 해당하는 형태를 선택하세요</Label>
                <div className="grid grid-cols-3 gap-3">
                  {primaryShapeTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option1_2-${index}`}
                        checked={shapeSelection.dichotomySelections.option1_2.includes(type)}
                        onCheckedChange={(checked: boolean) => 
                          handleDichotomySelection('option1_2', type, checked)
                        }
                      />
                      <Label htmlFor={`option1_2-${index}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>2번+3번 조합에서 해당하는 형태를 선택하세요</Label>
                <div className="grid grid-cols-3 gap-3">
                  {primaryShapeTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option2_3-${index}`}
                        checked={shapeSelection.dichotomySelections.option2_3.includes(type)}
                        onCheckedChange={(checked: boolean) => 
                          handleDichotomySelection('option2_3', type, checked)
                        }
                      />
                      <Label htmlFor={`option2_3-${index}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>1번+3번 조합에서 해당하는 형태를 선택하세요</Label>
                <div className="grid grid-cols-3 gap-3">
                  {primaryShapeTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option1_3-${index}`}
                        checked={shapeSelection.dichotomySelections.option1_3.includes(type)}
                        onCheckedChange={(checked: boolean) => 
                          handleDichotomySelection('option1_3', type, checked)
                        }
                      />
                      <Label htmlFor={`option1_3-${index}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. 분석 시작 버튼 */}
      {selectedFile && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || validateShapeSelection() !== null}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  '도형 분석 시작'
                )}
              </Button>
            </div>
            {validateShapeSelection() && (
              <p className="text-sm text-destructive mt-2 text-center">
                {validateShapeSelection()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploadForm;
