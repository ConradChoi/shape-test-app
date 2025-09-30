# Shape Test App

AI 기반 도형심리 테스트 분석 애플리케이션

## 개요

이 애플리케이션은 사용자가 그린 도형을 AI를 통해 분석하여 심리적 특성을 해석하는 웹 애플리케이션입니다. React와 TypeScript를 기반으로 구축되었으며, Material-UI를 사용하여 현대적이고 직관적인 사용자 인터페이스를 제공합니다.

## 주요 기능

- **사용자 정보 입력**: 이름, 나이, 성별, 연락처 등 기본 정보 수집
- **이미지 업로드**: 도형이 그려진 검사지 이미지 업로드
- **AI 분석**: OpenAI API를 활용한 도형심리 분석
- **결과 확인**: 상세한 분석 결과 및 해석 제공
- **결과 저장**: 분석 결과를 텍스트 파일로 다운로드
- **인쇄 기능**: 결과를 인쇄할 수 있는 기능

## 기술 스택

- **Frontend**: React 18, TypeScript
- **UI Framework**: Material-UI (MUI)
- **AI Integration**: OpenAI API
- **Build Tool**: Create React App
- **Package Manager**: npm

## 환경 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 저장소 클론
git clone https://github.com/ConradChoi/shape-test-app.git
cd shape-test-app

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
# OpenAI API 설정
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# 애플리케이션 설정
REACT_APP_APP_NAME=Shape Test App
REACT_APP_VERSION=1.0.0
```

**OpenAI API 키 발급 방법:**
1. [OpenAI 플랫폼](https://platform.openai.com)에 접속
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 API 키 생성
4. 생성된 키를 `.env` 파일에 입력

### 3. 개발 서버 실행

```bash
# 개발 서버 시작
npm start
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 사용 방법

### 1단계: 사용자 정보 입력
- 이름, 나이, 성별, 이메일, 전화번호를 입력합니다.
- 모든 필드는 필수 입력 사항입니다.

### 2단계: 이미지 업로드
- 그린 도형이 포함된 이미지 파일을 업로드합니다.
- 지원 형식: JPG, PNG, GIF
- AI가 이미지를 분석하여 심리적 특성을 해석합니다.

### 3단계: 결과 확인
- 분석 결과를 확인합니다.
- 신뢰도 점수와 함께 상세한 해석을 제공합니다.
- 결과를 다운로드하거나 인쇄할 수 있습니다.

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── UserInfoForm.tsx    # 사용자 정보 입력 폼
│   ├── ImageUploadForm.tsx # 이미지 업로드 폼
│   └── AnalysisResult.tsx  # 분석 결과 표시
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── App.tsx             # 메인 애플리케이션 컴포넌트
├── index.tsx           # 애플리케이션 진입점
└── index.css           # 전역 스타일
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
# 프로덕션 빌드 생성
npm run build
```

빌드된 파일은 `build` 폴더에 생성됩니다.

### 배포

빌드된 파일을 정적 웹 호스팅 서비스(Netlify, Vercel, GitHub Pages 등)에 배포할 수 있습니다.

## 개발 가이드

### 새로운 기능 추가

1. `src/types/index.ts`에 필요한 타입 정의 추가
2. `src/components/`에 새로운 컴포넌트 생성
3. `src/App.tsx`에서 컴포넌트 통합

### 스타일링

Material-UI의 테마 시스템을 사용하여 일관된 디자인을 유지합니다. `src/App.tsx`에서 테마 설정을 수정할 수 있습니다.

## 문제 해결

### 일반적인 문제

1. **API 키 오류**: `.env` 파일의 API 키가 올바른지 확인
2. **이미지 업로드 실패**: 지원되는 이미지 형식인지 확인
3. **빌드 오류**: `node_modules` 삭제 후 `npm install` 재실행

### 로그 확인

개발자 도구의 콘솔에서 오류 메시지를 확인할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

---

**주의사항**: 이 애플리케이션은 교육 및 연구 목적으로 개발되었습니다. 정확한 심리 진단을 위해서는 전문 심리 상담사와 상담하시기 바랍니다.
