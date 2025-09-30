import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';
import { Stepper } from './components/ui/stepper';
import UserInfoForm from './components/UserInfoForm';
import ImageUploadForm from './components/ImageUploadForm';
import AnalysisResult from './components/AnalysisResult';
import { UserInfo, AnalysisData } from './types';

const steps = ['사용자 정보 입력', '검사지 이미지 업로드', '분석 결과 확인'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 각 단계별 입력 데이터를 저장하는 상태
  const [stepData, setStepData] = useState<{
    userInfo?: UserInfo;
    imageData?: AnalysisData;
  }>({});

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
    setError(null);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUserInfo(null);
    setAnalysisData(null);
    setStepData({});
    setError(null);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStepData(prev => ({ ...prev, userInfo: info }));
    handleNext();
  };

  const handleImageUpload = (data: AnalysisData) => {
    setAnalysisData(data);
    setStepData(prev => ({ ...prev, imageData: data }));
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <UserInfoForm
            onSubmit={handleUserInfoSubmit}
            onError={setError}
            initialData={stepData.userInfo}
          />
        );
      case 1:
        return (
          <ImageUploadForm
            onSubmit={handleImageUpload}
            onError={setError}
            initialData={stepData.imageData}
            userInfo={userInfo}
          />
        );
      case 2:
        return (
          <AnalysisResult
            userInfo={userInfo!}
            analysisData={analysisData!}
            onReset={handleReset}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-foreground">
              도형심리 테스트
            </CardTitle>
            <p className="text-muted-foreground text-lg mt-2">
              AI 기반 도형심리 검사 분석 애플리케이션
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Stepper activeStep={activeStep} steps={steps} className="mb-8" />

            <div className="min-h-[400px]">
              {renderStepContent(activeStep)}
            </div>

            <div className="flex flex-row pt-4">
              <Button
                variant="outline"
                disabled={activeStep === 0}
                onClick={handleBack}
                className="mr-4"
              >
                이전
              </Button>
              <div className="flex-1" />
              {activeStep === steps.length - 1 && (
                <Button onClick={handleReset}>
                  다시 시작
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
