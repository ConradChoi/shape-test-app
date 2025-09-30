import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserInfo } from '../types';

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onError: (error: string) => void;
  initialData?: UserInfo;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, onError, initialData }) => {
  const [formData, setFormData] = useState<UserInfo>(initialData || {
    name: '',
    birthDate: '',
    age: 0,
    gender: '',
    dominantHand: '',
    occupation: '',
    bloodType: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});

  // 생년월일로부터 나이 계산
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 선택해주세요.';
    } else {
      const age = calculateAge(formData.birthDate);
      if (age < 1 || age > 120) {
        newErrors.birthDate = '올바른 생년월일을 선택해주세요.';
      }
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    if (!formData.dominantHand) {
      newErrors.dominantHand = '자주 사용하는 손을 선택해주세요.';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = '직업을 입력해주세요.';
    }

    // 이메일은 선택사항이지만 입력한 경우 형식 검증
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 주소를 입력해주세요.';
    }

    if (!formData.phone.trim() || !/^[0-9-+\s()]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      onError('입력 정보를 확인해주세요.');
    }
  };

  const handleChange = (field: keyof UserInfo) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    
    if (field === 'birthDate') {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        birthDate: value,
        age: age
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 정보 입력</CardTitle>
        <CardDescription>
          도형심리 검사를 위해 기본 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="이름을 입력하세요"
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">생년월일 *</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange('birthDate')}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate}</p>
            )}
            {formData.age > 0 && !errors.birthDate && (
              <p className="text-sm text-muted-foreground">나이: {formData.age}세</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">성별 *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender')({ target: { value } })}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dominantHand">자주 사용하는 손 *</Label>
            <Select value={formData.dominantHand} onValueChange={(value) => handleChange('dominantHand')({ target: { value } })}>
              <SelectTrigger id="dominantHand">
                <SelectValue placeholder="자주 사용하는 손을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">오른손</SelectItem>
                <SelectItem value="left">왼손</SelectItem>
              </SelectContent>
            </Select>
            {errors.dominantHand && (
              <p className="text-sm text-destructive">{errors.dominantHand}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">직업 *</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={handleChange('occupation')}
              placeholder="직업을 입력하세요"
              required
            />
            {errors.occupation && (
              <p className="text-sm text-destructive">{errors.occupation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="010-1234-5678"
              required
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일(선택)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="이메일을 입력하세요 (선택사항)"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodType">혈액형(선택)</Label>
            <Select value={formData.bloodType} onValueChange={(value) => handleChange('bloodType')({ target: { value } })}>
              <SelectTrigger id="bloodType">
                <SelectValue placeholder="혈액형을 선택하세요 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A형</SelectItem>
                <SelectItem value="B">B형</SelectItem>
                <SelectItem value="O">O형</SelectItem>
                <SelectItem value="AB">AB형</SelectItem>
              </SelectContent>
            </Select>
            {errors.bloodType && (
              <p className="text-sm text-destructive">{errors.bloodType}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6">
            다음 단계
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserInfoForm;
