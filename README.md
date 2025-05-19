# Nudge SEO CMS

여러 웹서비스(도메인)의 Google Search Console(GSC) 지표와 색인·크롤링 상태를 한 화면에서 모니터링하는 SEO 통합 관리 CMS입니다.

## 기술 스택

- React + Next.js 14
- Tailwind CSS
- Google Search Console API
- Recharts (차트 라이브러리)

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

## API 사용 예시

### 기본 검색 데이터 요청

```
GET /api/gsc?siteUrl=https://linkareer.com/
```

### 특정 사이트 데이터 요청

```
GET /api/gsc/linkareer
GET /api/gsc/community
GET /api/gsc/cbt
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