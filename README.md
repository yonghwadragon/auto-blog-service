# 🍽️ Navely - AI 기반 네이버 블로그 자동화 서비스

**사진과 AI로 만드는 스마트한 맛집 블로그**

Navely는 사용자가 업로드한 사진들과 간단한 설명을 바탕으로 Gemini AI가 자동으로 블로그 글을 생성하고, 네이버 블로그에 자동으로 포스팅해주는 혁신적인 서비스입니다.

## ✨ 주요 기능

### 🤖 AI 기반 콘텐츠 생성
- **사진 분석**: 업로드한 음식/매장 사진을 Gemini Vision API로 분석
- **스마트 글쓰기**: 사진과 설명을 바탕으로 서론-본론-결론 구성의 완전한 블로그 글 자동 생성
- **SEO 최적화**: 검색 친화적인 키워드와 구조로 글 작성

### 📱 사용자 친화적 인터페이스
- **4단계 워크플로우**: 기본정보 → 사진업로드 → 콘텐츠생성 → 미리보기
- **드래그 앤 드롭**: 직관적인 사진 업로드
- **실시간 미리보기**: AI 생성 과정 실시간 모니터링

### 🔐 안전한 계정 관리
- **Firebase 인증**: 이메일/비밀번호 및 Google OAuth 지원
- **다중 계정 관리**: 여러 네이버 블로그 계정 등록 및 관리
- **보안 설정**: 계정 정보 암호화 저장

### 📍 스마트 위치 기능 (개발 예정)
- **자동 위치 검색**: 식당명 입력 시 네이버 지도 연동
- **위치 정보 자동 삽입**: 블로그 글에 매장 위치 자동 추가

## 🚀 빠른 시작

### 필수 조건
- Node.js 18.0 이상
- npm 또는 yarn
- Firebase 계정 (인증용)
- Google Gemini API 키

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd auto-blog-service
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` 파일에서 다음 값들을 설정하세요:
   ```bash
   # Firebase 설정
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # Gemini API 설정 (선택사항 - UI에서도 설정 가능)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   
   [http://localhost:3000](http://localhost:3000)에서 서비스를 확인하세요.

## 🏗️ 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── auth/           # 로그인/회원가입
│   ├── dashboard/      # 메인 대시보드
│   ├── posts/          # 포스트 목록 관리
│   ├── settings/       # 계정 및 API 설정
│   └── write/          # 포스트 작성
├── components/         # React 컴포넌트
│   ├── auth/          # 인증 관련
│   ├── dashboard/     # 대시보드 컴포넌트
│   ├── posts/         # 포스트 관리
│   ├── settings/      # 설정 페이지
│   └── write/         # 포스트 작성 폼
├── store/             # Zustand 상태 관리
├── lib/               # 유틸리티 함수
├── types/             # TypeScript 타입
└── hooks/             # 커스텀 훅
```

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작  
npm start

# 코드 린팅
npm run lint
```

## 🔧 기술 스택

### Frontend
- **Next.js 14** - App Router 사용
- **React 18** - 최신 React 기능
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Zustand** - 경량 상태 관리

### Authentication & Database
- **Firebase Auth** - 사용자 인증
- **Supabase** - PostgreSQL 데이터베이스 (개발 예정)

### AI & Automation
- **Google Gemini API** - AI 콘텐츠 생성
- **Python + Selenium** - 네이버 블로그 자동화

### UI Components
- **Lucide React** - 아이콘
- **Radix UI** - 접근성 좋은 UI 프리미티브

## 📋 사용 방법

### 1. 계정 설정
1. 회원가입 또는 Google 로그인
2. 설정 페이지에서 Gemini API 키 입력
3. 네이버 블로그 계정 정보 등록

### 2. 블로그 글 작성
1. **기본 정보**: 작업명, 블로그 제목, 위치, 발행 유형 입력
2. **사진 업로드**: 음식/매장 사진들을 드래그 앤 드롭으로 업로드
3. **사진 설명**: 각 사진별로 간단한 설명 추가
4. **AI 생성**: Gemini AI가 사진과 설명을 바탕으로 블로그 글 자동 생성
5. **미리보기**: 생성된 글 확인 및 수정
6. **자동 포스팅**: 네이버 블로그에 자동 업로드 (개발 예정)

## 🔄 개발 로드맵

### Phase 1: 기반 시스템 완성 ✅
- [x] Next.js 기본 구조
- [x] Firebase 인증 시스템
- [x] 기본 UI 컴포넌트
- [x] 포스트 작성 워크플로우

### Phase 2: 데이터베이스 연동 🚧 (진행중)
- [ ] Supabase 연동
- [ ] 사용자별 데이터 관리
- [ ] 포스트 이력 추적

### Phase 3: AI 기능 강화 🔜 (예정)
- [ ] Gemini Vision API 연동
- [ ] 사진 기반 콘텐츠 생성
- [ ] 위치 정보 자동 추출

### Phase 4: 네이버 블로그 자동화 🔜 (예정)
- [ ] Python 스크립트 연동
- [ ] 실시간 포스팅 상태 모니터링
- [ ] 사진 업로드 자동화
- [ ] 위치 정보 자동 설정

## 🤝 기여 가이드

이 프로젝트는 개인 프로젝트이지만, 버그 리포트나 기능 제안은 언제나 환영합니다!

### Git 워크플로우
- **main**: 배포 브랜치 (안정된 코드)
- **develop**: 개발 브랜치
- **feature/**: 기능 개발 브랜치

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 변경
```

## 📞 지원

- **이슈**: [GitHub Issues](링크 예정)
- **문서**: [프로젝트 위키](CLAUDE.md)
- **개발 진행상황**: [PROGRESS_REPORT.md](PROGRESS_REPORT.md)

## 📄 라이선스

This project is licensed under the MIT License.

---

**Navely와 함께 더 스마트한 블로그 생활을 시작하세요! 🚀**
