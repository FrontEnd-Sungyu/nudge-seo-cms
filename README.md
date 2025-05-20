# Nudge SEO CMS

Nudge SEO CMS는 다수의 웹서비스(도메인)의 Google Search Console(GSC) 지표와 색인·크롤링 상태를 로그인·백엔드·DB 없이 한 화면에서 모니터링할 수 있는 SEO 통합 관리 시스템입니다. 이 프로젝트는 SEO 담당자가 여러 사이트의 검색 성능을 효율적으로 관리하고 모니터링할 수 있도록 설계되었습니다.

## 프로젝트 개요

Nudge SEO CMS는 기업의 여러 웹서비스에 대한 검색 데이터를 통합적으로 분석하고 시각화하여 SEO 성능을 최적화하는 데 도움을 줍니다. 사용자는 별도의 로그인이나 DB 설정 없이도 Google Search Console API를 통해 직접 데이터를 가져와 실시간으로 모니터링할 수 있습니다.

## 사용 기술 및 버전

### 주요 패키지

| 패키지              | 버전     | 용도                                 |
| ------------------- | -------- | ------------------------------------ |
| React               | ^18.2.0  | UI 컴포넌트 개발                     |
| Next.js             | ^14.0.4  | React 프레임워크, 서버 사이드 렌더링 |
| TypeScript          | ^5.3.3   | 정적 타입 검사                       |
| Tailwind CSS        | ^3.4.1   | UI 스타일링                          |
| Recharts            | ^2.12.3  | 데이터 시각화 차트                   |
| googleapis          | ^148.0.0 | Google API 접근                      |
| google-auth-library | ^9.15.1  | Google 인증                          |

### 개발 도구

- ESLint (^8.55.0): 코드 품질 관리
- Prettier (^3.2.5): 코드 포맷팅
- TypeScript (^5.3.3): 타입 안정성

## 프로젝트 구조 및 기능

### 페이지 구성

1. **메인 대시보드** (`/`)

   - 서비스 카드 목록 표시
   - 각 서비스의 주요 검색 지표 요약 정보
   - 최신 데이터 업데이트 날짜 표시

2. **서비스 상세 페이지** (`/services/[serviceId]`)
   - 선택한 서비스의 상세 검색 데이터
   - KPI 지표 8개 (클릭수, 노출수, CTR, 평균 순위, 색인 페이지, 미색인 페이지, 크롤링 요청, 평균 응답속도)
   - 기간별 트렌드 차트 (7일, 30일, 커스텀 기간 선택 가능)
   - 원본 Search Console 페이지 링크

### 주요 기능

- **통합 대시보드**: 등록된 모든 서비스의 검색 성능을 한 화면에서 확인
- **KPI 모니터링**: 주요 지표를 시각적으로 표시하고 증감률을 배지로 표현
- **기간별 비교**: 다양한 기간 설정으로 성능 변화 추이 분석
- **트렌드 분석**: 주요 지표의 시계열 데이터를 차트로 시각화
- **서비스 관리**: 다수의 웹서비스를 중앙집중식으로 관리

## API 구조

### 주요 API 엔드포인트

- `/api/gsc/summary`: 모든 사이트의 통합 요약 데이터 제공
- `/api/gsc/[site]`: 특정 사이트의 상세 데이터 제공
- `/api/gsc`: 커스텀 검색 쿼리를 통한 데이터 요청

## 개발 시작하기

1. 프로젝트 설치

   ```bash
   npm install
   ```

2. 개발 서버 실행

   ```bash
   npm run dev
   ```

3. 빌드

   ```bash
   npm run build
   ```

4. 프로덕션 서버 실행
   ```bash
   npm run start
   ```

## Google Search Console API 설정 방법

이 프로젝트는 Google Search Console API를 사용하여 SEO 데이터를 가져옵니다. 다음 단계에 따라 API 접근을 설정하세요:

### 1. Google Cloud Platform 프로젝트 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 로그인합니다.
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.
3. API 라이브러리에서 "Search Console API"를 검색하여 활성화합니다.

### 2. 서비스 계정 생성

1. GCP 콘솔의 "IAM 및 관리자" > "서비스 계정"으로 이동합니다.
2. "서비스 계정 만들기"를 클릭합니다.
3. 서비스 계정 이름과 설명을 입력하고 "만들기 및 계속"을 클릭합니다.
4. 역할은 필요에 따라 설정하거나 건너뛸 수 있습니다.
5. "완료"를 클릭하여 서비스 계정을 만듭니다.

### 3. 서비스 계정 키 생성

1. 생성된 서비스 계정 목록에서 해당 서비스 계정을 클릭합니다.
2. "키" 탭으로 이동하고 "키 추가" > "새 키 만들기"를 클릭합니다.
3. 키 유형으로 JSON을 선택하고 "만들기"를 클릭합니다.
4. 개인 키 파일이 자동으로 다운로드됩니다. 이 파일은 안전하게 보관하세요!

### 4. Google Search Console에 서비스 계정 추가

1. [Google Search Console](https://search.google.com/search-console)에 로그인합니다.
2. 각 속성(사이트)의 설정 > 사용자 및 권한 > 사용자 추가를 클릭합니다.
3. 서비스 계정 이메일을 입력하고 "소유자" 또는 "권한이 있는 사용자" 권한을 부여합니다.
4. 모니터링하려는 모든 사이트에 대해 반복합니다.

### 5. 환경 변수 설정

1. 프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.
2. `.env.local.example` 파일을 참고하여 필요한 환경 변수를 설정합니다:
   ```
   GCP_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----\n"
   GCP_API_KEY=your-api-key (선택사항)
   ```
   - `GCP_CLIENT_EMAIL`: 서비스 계정 이메일
   - `GCP_PRIVATE_KEY`: 서비스 계정 키 파일에서 가져온 개인키. 큰따옴표로 묶고 \n을 사용하여 줄바꿈 표시
   - `GCP_API_KEY`: (선택사항) Google API 키

## 모니터링 대상 서비스 설정

이 프로젝트는 `src/constants/monitoredSite.ts` 파일에서 정의된 사이트들을 모니터링합니다. 새로운 사이트를 추가하거나 기존 사이트를 수정하려면 이 파일을 업데이트하세요.

```typescript
export const MONITORED_SITES = [
  {
    id: 'your-site-id',
    name: '사이트 이름',
    url: 'https://yoursite.com/',
    iconUrl: '/assets/your-site-icon.png',
  },
  // 추가 사이트...
]
```

## API 사용 예시

### 기본 검색 데이터 요청

```
GET /api/gsc?siteUrl=https://linkareer.com/
```

### 특정 사이트 데이터 요청

```
GET /api/gsc/linkareer
GET /api/gsc/community
```

### 모든 사이트 요약 데이터

```
GET /api/gsc/summary
```

### 커스텀 데이터 요청

```
POST /api/gsc
Content-Type: application/json

{
  "siteUrl": "https://linkareer.com/",
  "startDate": "2024-04-19",
  "endDate": "2024-05-19",
  "dimensions": ["date", "page"],
  "rowLimit": 50
}
```

## License

MIT
