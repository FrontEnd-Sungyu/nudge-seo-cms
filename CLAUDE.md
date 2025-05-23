# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 프로젝트는 React, TypeScript, Next.js를 사용하여 구축된 SEO 통합 관리 CMS입니다. 성능과 개발자 경험에 중점을 둔 최소한의 설정으로 React를 사용합니다.

## 개발 명령어

- `npm run dev` - 개발 서버 시작 (3000번 포트에서 실행)
- `npm run build` - 프로덕션용 프로젝트 빌드
- `npm run start` - 프로덕션 서버 시작
- `npm run lint` - ESLint를 사용하여 코드 품질 문제 확인

## 프로젝트 구조

이 프로젝트는
표준 Next.js + React + TypeScript 설정을 따릅니다:

- `/src` - 메인 소스 코드
  - `/app` - Next.js App Router
    - `page.tsx` - 메인 페이지 컴포넌트
    - `layout.tsx` - 루트 레이아웃 컴포넌트
  - `/components` - 재사용 가능한 UI 컴포넌트
  - `/api` - API 유틸리티 및 타입 정의

## 설정 파일

프로젝트는 다음과 같은 설정 파일을 사용합니다:

- `next.config.mjs` - Next.js 설정
- `tsconfig.json` - TypeScript 설정
- `eslint.config.js` - TypeScript 및 React 플러그인을 사용한 새로운 플랫 구성 형식의 ESLint 설정
- `postcss.config.js` - Tailwind CSS를 위한 PostCSS 설정
- `tailwind.config.js` - Tailwind CSS 설정

## TypeScript 설정

이 프로젝트는 엄격한 타입 검사가 활성화된 TypeScript를 사용합니다. 다음 규칙을 적용합니다:

- 엄격한 타입 검사
- 사용되지 않는 지역 변수나 매개변수 금지
- 확인되지 않은 부작용 import 금지
- switch 문에서 fallthrough case 금지

## 브라우저 지원

이 애플리케이션은 ES2020을 지원하는 최신 브라우저를 대상으로 합니다.

## Response Rules

- 모든 질문에 대해 한국어로 먼저 응답한 후 필요한 경우 영어로 추가 설명합니다.
- 모든 질문에 대해 답변시 추가적으로 고려해야 하는 부분도 함께 설명합니다.
- 모든 질문에 대해 코드 작성은 별도 작성 요청을 하지 않는 경우 적용하지 않습니다.
- 개발 코드 작성시 함수나 hook등을 생성할 땐 항상 jsDoc 형식의 주석을 함께 추가하여 어떤 기능을 제공하는지 설명하도록 합니다.
- 기능 개발의 경우 아래 넛지 SEO 통합 CMS 기획서를 바탕으로 개발하도록 합니다

# 넛지 SEO 통합 CMS 기획서

## 1. 프로젝트 개요

- **목적**: 다수의 웹서비스(도메인)의 Google Search Console(GSC) 지표와 색인·크롤링 상태를 _로그인·백엔드·DB 없이_ 한 화면에서 모니터링.
- **기술 스택**: React + Next.js, Recharts, Tailwind CSS.
- **데이터 원천**: GSC 공식 Search Analytics API.

## 2. 핵심 기능

| 카테고리               | 상세 기능                                                                                                       | 비고                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **메인 화면**          | · 서비스 대시보드 카드 목록· 서비스 요약 정보 표시 · 서비스 카드 클릭 시 상세 페이지 진입                       | 최대 10개 서비스          |
| **서비스 관리**        | · 서비스별 Search Console 원본 페이지 링크                                                                      | 간편 관리                 |
| **지표 대시보드**      | · 총 클릭수·총 노출수·평균 CTR·평균 게재순위 · 색인된/미색인 페이지 · 최근 90일 크롤링 횟수 · 평균 응답속도(ms) | KPI 8개 타일, 증감률 배지 |
| **트렌드 차트**        | · 기간 선택(7·30·커스텀) · 4개 지표 토글(Line/Area)                                                             | 30일↑ → 7일 이동평균      |
| **색인·크롤링 리포트** | · 탭: "색인", "크롤 통계"                                                                                       | 형식 자동감지             |

## 3. 화면 구조

### 3-1. 메인 화면

```
┌─ 상단 헤더 ─────────────────────────────────────────────────┐
│ • 앱 로고 및 타이틀                                           │
│ • 새 서비스 추가 버튼                                         │
└───────────────────────────────────────────────────────────┘
┌─ 서비스 대시보드 카드 영역 ─────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│ │ 서비스1   │ │ 서비스2  │ │ 서비스3   │ ...                   │
│ │ 요약지표  │ │ 요약지표  │ │ 요약지표   │                       │
│ └─────────┘ └─────────┘ └─────────┘                       │
└───────────────────────────────────────────────────────────┘
```

### 3-2. 서비스 상세 페이지

```
┌─ LNB(좌측 내비게이션) ─┐  ┌─ 콘텐츠 영역 ─────────────────────┐
│ • 서비스 전환 목록     │  │ ◇ 서비스 타이틀 & 원본 콘솔 링크      │
│ • + 서비스 추가       │  │ ◇ KPI 8타일 (2행×4열)            │
│ • 부가 기능 메뉴       │ │ ◇ 기간 선택기 & 증감률              │
│                    │  │ ◇ 트렌드 차트 + 지표 토글           │
│                    │  │ ◇ 탭: 색인 │ 크롤 통계             │
└────────────────────┘  └────────────────────────────────┘

```

---
