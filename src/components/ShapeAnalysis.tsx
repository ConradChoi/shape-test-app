import React from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import { ShapeAnalysis as ShapeAnalysisType } from '../types';

interface ShapeAnalysisProps {
  analysis: ShapeAnalysisType;
  onChange: (analysis: ShapeAnalysisType) => void;
  editable?: boolean;
}

const ShapeAnalysis: React.FC<ShapeAnalysisProps> = ({ analysis, onChange, editable = true }) => {
  const handleChange = (field: keyof ShapeAnalysisType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...analysis,
      [field]: event.target.value,
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        도형 분석 결과
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="1차 도형"
          value={analysis.firstShape}
          onChange={handleChange('firstShape')}
          disabled={!editable}
          fullWidth
        />
        <TextField
          label="2차 도형"
          value={analysis.secondShape}
          onChange={handleChange('secondShape')}
          disabled={!editable}
          fullWidth
        />
        <TextField
          label="3차 도형"
          value={analysis.thirdShape}
          onChange={handleChange('thirdShape')}
          disabled={!editable}
          fullWidth
        />
        <TextField
          label="4차 도형"
          value={analysis.fourthShape}
          onChange={handleChange('fourthShape')}
          disabled={!editable}
          fullWidth
        />
      </Box>
    </Paper>
  );
};

export default ShapeAnalysis; 