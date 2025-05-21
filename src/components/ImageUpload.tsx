import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import ShapeAnalysis from './ShapeAnalysis';
import { ShapeAnalysis as ShapeAnalysisType } from '../types';
import { analyzeShapeImage } from '../utils/api';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  previewUrl?: string;
  shapeAnalysis: ShapeAnalysisType;
  onShapeAnalysisChange: (analysis: ShapeAnalysisType) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  previewUrl,
  shapeAnalysis,
  onShapeAnalysisChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageUpload(file);
      try {
        setIsAnalyzing(true);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          try {
            const analysis = await analyzeShapeImage(base64String);
            onShapeAnalysisChange(analysis);
          } catch (err) {
            setError('이미지 분석 중 오류가 발생했습니다. 결과화면으로 바로 이동합니다.');
            onShapeAnalysisChange({
              firstShape: '',
              secondShape: '',
              thirdShape: '',
              fourthShape: ''
            });
          } finally {
            setIsAnalyzing(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('이미지 분석 중 오류가 발생했습니다. 결과화면으로 바로 이동합니다.');
        onShapeAnalysisChange({
          firstShape: '',
          secondShape: '',
          thirdShape: '',
          fourthShape: ''
        });
        setIsAnalyzing(false);
      }
    }
  }, [onImageUpload, onShapeAnalysisChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const renderImageUpload = () => (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f0f0f0' : 'white',
        border: '2px dashed #ccc',
        '&:hover': {
          backgroundColor: '#f0f0f0'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <Box>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            이미지를 클릭하여 변경
          </Typography>
        </Box>
      ) : (
        <Typography>
          {isDragActive
            ? '이미지를 여기에 놓으세요'
            : '이미지를 클릭하거나 드래그하여 업로드하세요'}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {isMobile ? (
        <Box>
          <Box sx={{ mb: 3 }}>
            {renderImageUpload()}
          </Box>
          <Box>
            {isAnalyzing ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>이미지 분석 중...</Typography>
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
            ) : (
              <ShapeAnalysis
                analysis={shapeAnalysis}
                onChange={onShapeAnalysisChange}
              />
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {renderImageUpload()}
          </Box>
          <Box sx={{ flex: 1 }}>
            {isAnalyzing ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>이미지 분석 중...</Typography>
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
            ) : (
              <ShapeAnalysis
                analysis={shapeAnalysis}
                onChange={onShapeAnalysisChange}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload; 