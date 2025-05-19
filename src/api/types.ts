/**
 * Google Search Console API 관련 타입 정의
 */

/**
 * Search Analytics API 응답 타입
 */
export interface GSCSearchAnalyticsResponse {
  /** 응답 행 데이터 배열 */
  rows?: GSCSearchAnalyticsRow[];
  /** 응답 메타데이터 */
  responseAggregationType?: string;
}

/**
 * Search Analytics 행 데이터 타입
 */
export interface GSCSearchAnalyticsRow {
  /** 검색 클릭수 */
  clicks: number;
  /** 검색 노출수 */
  impressions: number;
  /** 클릭률 (0-1 사이 값) */
  ctr: number;
  /** 평균 검색 순위 */
  position: number;
  /** 차원 값 (예: 날짜, 페이지, 쿼리 등) */
  keys: string[];
}

/**
 * 사이트 데이터 응답 타입
 */
export interface GSCSiteData {
  /** 사이트 정보 */
  site: {
    /** 사이트 ID */
    id: string;
    /** 사이트 이름 */
    name: string;
    /** 사이트 URL */
    url: string;
  };
  /** 기간 정보 */
  period: {
    /** 시작일 */
    startDate: string;
    /** 종료일 */
    endDate: string;
  };
  /** 검색 분석 데이터 */
  data: GSCSearchAnalyticsResponse;
}

/**
 * 모든 사이트 요약 데이터 응답 타입
 */
export interface GSCSummaryData {
  /** 기간 정보 */
  period: {
    /** 현재 기간 */
    current: {
      /** 시작일 */
      startDate: string;
      /** 종료일 */
      endDate: string;
    };
    /** 이전 기간 */
    previous: {
      /** 시작일 */
      startDate: string;
      /** 종료일 */
      endDate: string;
    };
  };
  /** 사이트 데이터 배열 */
  sites: GSCSiteSummary[];
}

/**
 * 사이트 요약 타입
 */
export interface GSCSiteSummary {
  /** 사이트 ID */
  id: string;
  /** 사이트 이름 */
  name: string;
  /** 사이트 URL */
  url: string;
  /** 에러 메시지 (데이터 요청에 실패한 경우) */
  error?: string;
  /** 사이트 지표 데이터 */
  metrics?: {
    /** 클릭수 */
    clicks: {
      /** 값 */
      value: number;
      /** 이전 기간 대비 변화량 (%) */
      change: number;
    };
    /** 노출수 */
    impressions: {
      /** 값 */
      value: number;
      /** 이전 기간 대비 변화량 (%) */
      change: number;
    };
    /** 클릭률 */
    ctr: {
      /** 값 (0-1 사이 값) */
      value: number;
      /** 이전 기간 대비 변화량 (%) */
      change: number;
    };
    /** 평균 검색 순위 */
    position: {
      /** 값 */
      value: number;
      /** 이전 기간 대비 변화량 (%) */
      change: number;
    };
  };
}