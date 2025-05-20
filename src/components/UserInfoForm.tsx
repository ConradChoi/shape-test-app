import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent } from '@mui/material';
import { UserInfo } from '../types';

interface UserInfoFormProps {
  userInfo: UserInfo;
  onChange: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, onChange }) => {
  const handleTextChange = (field: keyof UserInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...userInfo,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    onChange({
      ...userInfo,
      dominantHand: event.target.value as 'left' | 'right',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: '0 auto' }}>
      <TextField
        label="이름"
        value={userInfo.name}
        onChange={handleTextChange('name')}
        fullWidth
      />
      
      <FormControl fullWidth>
        <InputLabel>자주 사용하는 손</InputLabel>
        <Select
          value={userInfo.dominantHand}
          label="자주 사용하는 손"
          onChange={handleSelectChange}
        >
          <MenuItem value="left">왼손</MenuItem>
          <MenuItem value="right">오른손</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="직업"
        value={userInfo.occupation}
        onChange={handleTextChange('occupation')}
        fullWidth
      />

      <TextField
        label="생년월일"
        type="date"
        value={userInfo.birthDate}
        onChange={handleTextChange('birthDate')}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
};

export default UserInfoForm; 