# 자동 블로그 서비스 - 웹앱-Python 연동 프로젝트 진행 보고서

## 📋 프로젝트 개요 (2025.08.12 업데이트)

### 🎯 새로운 목표 (사용자 요구사항 기반)
**사용자 중심의 AI 기반 네이버 블로그 자동화 서비스 구축**

#### 핵심 워크플로우:
1. **사용자 입력** → 웹앱에서 블로그 제목 + 여러 사진 업로드 + 각 사진별 간단한 설명 입력
2. **AI 콘텐츠 생성** → Gemini API가 제목과 사진들, 설명을 바탕으로 서론-본론-결론 구성의 블로그 글 자동 생성
3. **네이버 블로그 포스팅** → 새로운 Python 스크립트가 제목 + AI 생성 글 + 사진들을 네이버 블로그에 자동 업로드
4. **위치 기능** → 식당명 등 입력 시 네이버 블로그 위치 검색 기능 자동 활용
5. **데이터 관리** → 모든 과정이 Supabase에 저장되어 사용자별 이력 관리

### 기존 상황과의 차이점
- **기존**: Excel 기반 → 단순 제목/본문 입력
- **신규**: 웹앱 기반 → 사진 중심의 리치 콘텐츠 + AI 분석
- **기존**: blog_auto_poster.py 활용
- **신규**: 완전히 새로운 Python 스크립트 개발 (사진 업로드 + 위치 검색 지원)

---

## 🔍 현재 프로젝트 구조 분석

### 웹앱 구조 (Next.js)
```
src/
├── app/                 # Next.js App Router 페이지들
│   ├── dashboard/       # 메인 대시보드
│   ├── posts/           # 포스트 관리
│   ├── settings/        # 설정 페이지 (사용자정보/Gemini API/네이버계정)
│   ├── write/           # 포스트 작성 (4단계 UI)
│   └── auth/            # Firebase 인증 (이메일/Google OAuth)
├── components/          # 기능별 React 컴포넌트들
│   ├── auth/           # AuthProvider, 인증 필요 메시지
│   ├── dashboard/      # 통계, 빠른작업, 최근글
│   ├── posts/          # 포스트 목록, 필터, 헤더
│   ├── settings/       # Gemini API, 네이버계정, 사용자프로필 관리
│   └── write/          # 4단계 포스트 작성 폼
├── store/               # Zustand 상태관리
├── lib/                 # 유틸리티 (Firebase, Supabase, auth helpers)
└── types/               # TypeScript 타입 정의
```

### 기존 상태 관리 (전체 분석 완료)
1. **postStore.ts**: 블로그 포스트 CRUD (이미 Supabase 연동으로 수정 완료)
2. **authStore.ts**: Firebase 인증 상태 (User 객체, 로그인 상태)
3. **settingsStore.ts**: Gemini API 키, 네이버 계정 관리 (로컬스토리지)

### 주요 컴포넌트들
1. **WritePostForm.tsx**: 4단계 글 작성 UI (기본정보→사진업로드→콘텐츠생성→미리보기)
2. **PostsList.tsx**: 페이지네이션된 포스트 목록
3. **NaverAccountSettings.tsx**: 네이버 계정 CRUD 관리
4. **UserProfile.tsx**: Firebase 사용자 프로필 관리 (이메일/Google 구분)

### Python 스크립트
- **blog_auto_poster.py**: 네이버 블로그 자동 포스팅 메인 스크립트
- Excel 파일에서 제목/본문 읽어서 Selenium으로 네이버 블로그 게시

---

## 🚀 이미 완료된 작업

### ✅ 1. 데이터베이스 설정
- **Supabase 클라이언트 라이브러리 설치** (`@supabase/supabase-js`)
- **환경 변수 설정** (`.env.example` 업데이트)
  - Firebase 설정 유지 (인증용)
  - Supabase 설정 추가 (데이터베이스용)
  - Python 스크립트용 네이버 계정 정보 추가
- **Supabase 클라이언트 생성** (`src/lib/supabase.ts`)

### ✅ 2. 데이터베이스 스키마 설계
**파일**: `database/schema.sql`

#### 테이블 구조:
1. **posts 테이블**
   - 기존 localStorage 구조를 PostgreSQL로 이전
   - 사용자별 데이터 격리 (RLS 적용)
   - 자동 업데이트 트리거 포함

2. **python_jobs 테이블** (신규)
   - Python 자동화 작업 추적
   - 진행 상황, 에러 처리, 상태 관리
   - 사용자별 작업 기록

### ✅ 3. 타입 정의 업데이트
**파일**: `src/types/index.ts`
- 기존 Post 인터페이스 확장 (user_id, updatedAt 추가)
- 새로운 PythonJob 인터페이스 추가

### ✅ 4. postStore 마이그레이션 (부분 완료)
**파일**: `src/store/postStore.ts`
- localStorage → Supabase 연동으로 전환
- 새로운 비동기 CRUD 메소드 구현
- 로딩/에러 상태 관리 추가

---

## 🔄 현재 진행 중인 작업

### 🔴 중대한 호환성 문제 발견!
**문제점**: postStore를 Supabase로 변경했지만 모든 컴포넌트가 여전히 구 API 사용 중

**영향받는 컴포넌트 (상세 분석)**:

1. **WritePostForm.tsx** (line 13, 50, 103)
   ```tsx
   // 현재 (동기식, localStorage 기반)
   const { addPost } = usePostStore()
   addPost(post)  // 동기 호출
   
   // 필요 (비동기, Supabase)
   const { addPost } = usePostStore() 
   const newPost = await addPost(postData)  // 비동기 + user_id 필요
   ```

2. **PostsList.tsx** (line 13)
   ```tsx
   // 현재 (즉시 사용 가능 데이터 가정)
   const { posts, deletePost } = usePostStore()
   
   // 필요 (데이터 로딩 + 비동기 처리)
   const { posts, loading, fetchPosts, deletePost } = usePostStore()
   useEffect(() => { fetchPosts(user.uid) }, [user])
   await deletePost(id)  // 비동기 처리
   ```

3. **RecentPosts.tsx** (line 12)
   ```tsx
   // 현재 (즉시 데이터 접근)
   const { posts } = usePostStore()
   
   // 필요 (로딩 상태 처리)
   const { posts, loading, fetchPosts } = usePostStore()
   // 데이터 로딩 없이 빈 배열 처리만 함
   ```

4. **StatsOverview.tsx** (line 27)
   ```tsx
   // 현재 (직접 posts 접근)
   const { posts } = usePostStore()
   
   // 필요 (로딩 및 에러 상태 처리)  
   const { posts, loading, error } = usePostStore()
   ```

**근본 원인**: postStore의 인터페이스가 완전히 바뀌었는데 컴포넌트들이 업데이트 안됨!

---

## 🚀 새로운 시스템 아키텍처 설계

### 📋 데이터베이스 스키마 확장
기존 Supabase 스키마에 추가 필요:

```sql
-- 사진 정보 테이블
CREATE TABLE post_images (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_description TEXT,
  upload_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 위치 정보 테이블  
CREATE TABLE post_locations (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  restaurant_name TEXT,
  selected_location TEXT,
  naver_place_id TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI 생성 작업 테이블 (기존 python_jobs 확장)
ALTER TABLE python_jobs ADD COLUMN ai_prompt TEXT;
ALTER TABLE python_jobs ADD COLUMN ai_generated_content TEXT;
ALTER TABLE python_jobs ADD COLUMN image_analysis_results JSONB;
```

### 🔄 새로운 워크플로우 단계별 설계

#### 1단계: 웹앱 UI 개선 (WritePostForm 확장)
- **현재 4단계**: 기본정보 → 사진업로드 → 콘텐츠생성 → 미리보기
- **확장 기능**:
  - 사진 업로드 시 각 사진별 설명 입력 필드 추가
  - 식당명 입력 시 위치 검색 UI 추가
  - "AI 생성 + 자동 포스팅" 통합 버튼 추가

#### 2단계: 새로운 Python 스크립트 개발
**파일명**: `AutoBlogPython/advanced_blog_poster.py`

**주요 기능**:
1. **Supabase 연동**: posts, post_images, post_locations 테이블 읽기
2. **Gemini Vision API**: 사진 분석 + 설명과 함께 블로그 글 생성
3. **네이버 블로그 고급 기능**:
   - 사진 업로드 (drag & drop 시뮬레이션)
   - 위치 검색 및 선택 자동화
   - 리치 에디터에 사진과 글 배치

#### 3단계: API 엔드포인트 개발
```typescript
// /api/run-advanced-posting
POST /api/run-advanced-posting
{
  postId: number,
  userId: string,
  naverAccountId: string
}

// /api/ai-content-generation  
POST /api/ai-content-generation
{
  title: string,
  images: { url: string, description: string }[],
  restaurantName?: string
}
```

#### 4단계: 실시간 진행 상황 모니터링
- WebSocket 또는 Server-Sent Events
- 단계별 진행률: AI 생성 중 → 네이버 로그인 → 사진 업로드 → 글 작성 → 위치 설정 → 발행

### 🎯 최종 사용자 경험
1. 사용자가 제목 + 식당명 입력
2. 여러 사진 드래그 앤 드롭 업로드
3. 각 사진에 간단한 설명 추가 ("맛있는 파스타", "분위기 좋은 인테리어" 등)
4. "AI 생성 후 자동 포스팅" 버튼 클릭
5. 실시간으로 진행상황 확인:
   - ✅ AI가 사진 분석 중...
   - ✅ 블로그 글 생성 중...
   - ✅ 네이버 블로그 접속 중...
   - ✅ 사진 업로드 중... (1/3)
   - ✅ 위치 검색 중... ("홍대 맛집" 검색)
   - ✅ 글 작성 및 발행 완료!
6. 완료 후 네이버 블로그 링크 제공

---

## 🚨 주요 고려사항 및 결정 필요 사항

### 1. 보안 문제
**현재 상황**: Python 스크립트의 네이버 계정 정보를 어떻게 관리할 것인가?

**옵션**:
- A) 서버 환경변수로 관리 (현재 계획)
- B) 데이터베이스에 암호화 저장
- C) 사용자별 계정 정보 입력 시스템

### 2. Python 실행 환경
**현재 상황**: Next.js에서 Python 스크립트를 어떻게 실행할 것인가?

**옵션**:
- A) child_process로 직접 실행 (현재 계획)
- B) 별도 Python 서버 구축 (Flask/FastAPI)
- C) 클라우드 함수 (Vercel Functions 제한 있음)

### 3. 실시간 진행 상황 업데이트
**옵션**:
- A) WebSocket 사용
- B) 폴링 방식 (주기적 API 호출)
- C) Server-Sent Events

### 4. 데이터 마이그레이션
**기존 localStorage 데이터**: 사용자가 기존에 작성한 포스트들을 Supabase로 이전할 것인가?

---

## 🛣️ 구현 로드맵 및 우선순위

### 🔄 현재 상황 정리
**주요 이슈**: 기존 postStore Supabase 마이그레이션으로 인한 호환성 문제

### 📋 제안하는 구현 순서

#### Phase 1: 기반 시스템 안정화 ⚡ (우선순위: 높음)
**목표**: 웹앱이 정상 작동하도록 복구

1. **옵션 A - 롤백 후 안정화** ⭐ (추천)
   - postStore를 기존 localStorage 버전으로 임시 복원
   - 웹앱 정상 작동 확인
   - 사용자가 테스트 가능한 상태 확보

2. **옵션 B - 일괄 수정**
   - 모든 컴포넌트를 한번에 Supabase 연동으로 수정
   - 리스크 높음 (여러 컴포넌트 동시 수정)

#### Phase 2: 새로운 요구사항 구현 🚀 (우선순위: 중간)
**목표**: 사용자가 원하는 AI + 사진 중심 워크플로우 구현

1. **데이터베이스 확장**
   - post_images, post_locations 테이블 추가
   - 기존 posts 테이블과의 관계 설정

2. **웹앱 UI 확장**
   - WritePostForm에 사진별 설명 입력 기능
   - 식당명 입력 및 위치 검색 프리뷰
   - "AI 생성 + 자동 포스팅" 통합 버튼

3. **새로운 Python 스크립트 개발**
   - `advanced_blog_poster.py` 개발
   - Gemini Vision API 연동
   - 네이버 블로그 사진 업로드 + 위치 설정 자동화

#### Phase 3: 고도화 기능 ✨ (우선순위: 낮음)
1. 실시간 진행 상황 모니터링
2. WebSocket 기반 상태 업데이트
3. 에러 처리 및 재시도 로직

### 🤝 권장 접근법

**즉시 결정이 필요한 사항**:
1. Phase 1에서 옵션 A(롤백) vs 옵션 B(일괄수정) 선택
2. 새로운 요구사항 구현을 언제 시작할지 결정

**개발자 강력 추천**:
- **Phase 1 옵션 A** 선택 (안정성 우선)
- 웹앱 정상화 후 → Phase 2 순차 진행
- 사용자가 각 단계에서 테스트 가능한 상태 유지

이 접근법의 장점:
✅ 사용자가 중간 결과물 테스트 가능  
✅ 각 단계별 검증 후 다음 단계 진행  
✅ 문제 발생 시 롤백 지점 명확  
✅ 점진적 개선으로 리스크 최소화

---

## 🎉 최신 완료 작업 (2025.08.13 업데이트)

### ✅ Phase 1: 시스템 안정화 완료!

#### 1. postStore localStorage 롤백 완료
- **문제**: Supabase 연동으로 인한 호환성 문제 (supabaseUrl 오류)
- **해결**: postStore를 기존 localStorage 방식으로 롤백
- **결과**: 웹앱 정상 작동 복구

#### 2. 완료 버튼 → Python 스크립트 실행 기능 구현 완료
**새로운 아키텍처**:
```
웹앱 완료 버튼 클릭
    ↓
API 엔드포인트 (/api/run-python-script)
    ↓
새로운 Python 스크립트 (web_to_naver_poster.py)
    ↓
네이버 블로그 자동 포스팅 + 브라우저 제어
```

#### 3. 새로운 Python 스크립트 개발 완료
**파일**: `AutoBlogPython/web_to_naver_poster.py`

**주요 기능**:
- 웹앱에서 JSON 데이터 직접 수신 (Excel 파일 불필요)
- Selenium + Chrome으로 네이버 블로그 자동 로그인
- 제목 + 본문 자동 입력 및 발행
- 실시간 진행 상황 콘솔 출력

#### 4. 실시간 UI 피드백 시스템 구현
- **로딩 상태**: "포스팅 중..." 버튼 비활성화
- **진행 메시지**: 실시간 상태 알림 (성공/오류)
- **자동 이동**: 완료 후 포스트 목록으로 리다이렉트

#### 5. Python 환경 설정 완료
- **requirements.txt** 생성
- **필수 라이브러리** 설치 완료:
  - selenium==4.15.2
  - webdriver-manager==4.0.1
  - pyperclip==1.8.2
  - python-dotenv==1.0.0

---

## 🔄 현재 상황 및 다음 단계

### 현재 작동 방식 (단일 사용자)
1. **환경 변수 설정**: `.env.local`에 `NAVER_ID`, `NAVER_PW` 설정
2. **글 작성**: 웹앱 4단계 워크플로우 완료
3. **완료 버튼**: Python 스크립트 자동 실행
4. **네이버 포스팅**: 브라우저 자동 제어로 글 발행

### 🚨 다중 사용자 환경 문제점
**현재 코드의 한계**:
1. **네이버 계정**: 모든 사용자가 동일한 계정으로 포스팅
2. **보안 문제**: 서버에 네이버 계정 정보 노출
3. **동시 실행**: 여러 사용자 동시 요청 시 충돌 가능
4. **환경 의존성**: 서버에 Python + Chrome 설치 필요

### 📋 Phase 2: 다중 사용자 지원 계획

#### 단계 2-1: 사용자별 계정 관리 (옵션 1 - 단기)
```typescript
// 목표: 각 사용자가 자신의 네이버 계정으로 포스팅
1. settingsStore 확장 → 사용자별 네이버 계정 정보 저장
2. Python 스크립트 → 동적으로 계정 정보 전달
3. 암호화 → 사용자 계정 정보 보안 강화
```

**구현 방법**:
- 설정 페이지에서 개별 네이버 계정 등록
- 암호화된 상태로 localStorage 저장
- API 호출 시 사용자별 계정 정보 전달

#### 단계 2-2: 별도 Python 서버 구축 (옵션 2 - 장기)
```bash
# 목표: 확장 가능하고 안전한 Python 실행 환경
Flask/FastAPI 서버
    ↓
Docker 컨테이너화
    ↓
클라우드 배포 (AWS/GCP)
    ↓
큐 시스템으로 동시 요청 처리
```

**장점**:
- 사용자별 격리된 실행 환경
- 동시 요청 처리 가능
- 보안 강화 (계정 정보 격리)
- 확장성 (수백명 사용자 지원)

### 🎯 즉시 시작할 작업 (Phase 2-1)

#### 우선순위 1: 사용자별 네이버 계정 관리
1. **settingsStore 확장**: 개인별 네이버 계정 저장
2. **설정 UI 개선**: 계정 등록/수정/삭제 기능
3. **API 수정**: 동적 계정 정보 전달
4. **보안 강화**: 계정 정보 암호화

#### 우선순위 2: 동시 실행 안정성
1. **요청 큐잉**: 동시 포스팅 방지
2. **에러 처리**: 실패 시 재시도 로직
3. **로그 시스템**: 사용자별 실행 기록

#### 우선순위 3: 사용자 경험 개선
1. **진행률 표시**: 단계별 상세 진행률
2. **포스팅 히스토리**: 성공/실패 기록
3. **계정 연결 상태**: 네이버 로그인 유효성 검사

---

## 🛠️ 기술적 결정사항

### 선택된 아키텍처 방향
- **단기 (1-2주)**: 옵션 1 - 사용자별 계정 관리
- **중기 (1-2개월)**: 옵션 2 - 별도 Python 서버
- **장기**: 완전한 서버리스 아키텍처

### 개발 우선순위
1. ✅ **완료**: 기본 Python 연동
2. 🔄 **진행 중**: 사용자별 계정 관리
3. 📅 **예정**: 별도 Python 서버
4. 📅 **예정**: 사진 업로드 + AI 분석

### 다음 커밋 목표
"feat: 사용자별 네이버 계정 관리 시스템 구현"