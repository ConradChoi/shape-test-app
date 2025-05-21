import React, { useState } from 'react';
import { Container, Box, Button, Typography, Stepper, Step, StepLabel } from '@mui/material';
import UserInfoForm from './components/UserInfoForm';
import ImageUpload from './components/ImageUpload';
import ResultView from './components/ResultView';
import { UserInfo } from './types';

const steps = ['사용자 정보 입력', '검사지 업로드', '결과 보기'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    dominantHand: 'right',
    occupation: '',
    birthDate: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [shapeAnalysis, setShapeAnalysis] = useState<{
    firstShape: string;
    secondShape: string;
    thirdShape: string;
    fourthShape: string;
  }>({
    firstShape: '',
    secondShape: '',
    thirdShape: '',
    fourthShape: '',
  });

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // setResult({
      //   userInfo,
      //   shapeAnalysis,
      //   interpretation: '도형 분석 결과 해석이 여기에 표시됩니다.',
      // });
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserInfoForm userInfo={userInfo} onChange={setUserInfo} />;
      case 1:
        return (
          <ImageUpload
            onImageUpload={handleImageUpload}
            previewUrl={previewUrl}
            shapeAnalysis={shapeAnalysis}
            onShapeAnalysisChange={setShapeAnalysis}
          />
        );
      case 2:
        return (
          <ResultView
            uploadedImage={previewUrl}
            userInfo={{
              name: userInfo.name,
              birthDate: userInfo.birthDate,
              dominantHand: userInfo.dominantHand,
              occupation: userInfo.occupation,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI 기반 도형심리
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            이전
          </Button>
          {activeStep === 2 ? (
            <Button
              variant="contained"
              onClick={() => {
                setUserInfo({
                  name: '',
                  dominantHand: 'right',
                  occupation: '',
                  birthDate: '',
                });
                setImageFile(null);
                setPreviewUrl('');
                setShapeAnalysis({
                  firstShape: '',
                  secondShape: '',
                  thirdShape: '',
                  fourthShape: '',
                });
                setActiveStep(0);
              }}
            >
              처음
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !userInfo.name) ||
                (activeStep === 1 && !imageFile)
              }
            >
              다음
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
