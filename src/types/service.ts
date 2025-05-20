/**
 * 서비스 정보를 나타내는 인터페이스
 *
 * @interface Service
 * @description Google Search Console에 등록된 웹 서비스 정보
 */
export interface Service {
  /** 서비스 고유 식별자 */
  id: string
  /** 서비스 이름 (사용자 지정) */
  name: string
  /** 서비스 URL (GSC Property ID) */
  url: string
  /** 서비스 아이콘 URL (선택사항) */
  iconUrl?: string
  /** GSC 소유권 확인 여부 */
  verified: boolean
  /** 서비스 요약 정보 */
  summary: ServiceSummary
  /** 서비스 등록 일시 */
  createdAt: Date
  /** 마지막 데이터 업데이트 일시 */
  lastUpdatedAt?: Date
  growth?: {
    clicks: number
    impressions: number
    ctr: number
    position: number
  }
}

/**
 * 서비스 요약 정보 인터페이스
 *
 * @interface ServiceSummary
 * @description 서비스의 주요 KPI 요약 정보
 */
export interface ServiceSummary {
  /** 총 클릭수 */
  clicks: number
  /** 총 노출수 */
  impressions: number
  /** 클릭률 (%) */
  ctr: number
  /** 평균 검색 순위 */
  position: number
  /** 색인된 페이지 수 */
  indexed: number
  /** 미색인 페이지 수 */
  notIndexed: number
  /** 크롤링 요청 수 */
  crawlRequests: number
  /** 평균 응답 시간 (ms) */
  responseTime: number
}

/**
 * KPI 증감률 인터페이스
 *
 * @interface ServiceGrowth
 * @description 이전 기간 대비 KPI 증감률
 */
export interface ServiceGrowth {
  /** 클릭수 증감률 (%) */
  clicks: number
  /** 노출수 증감률 (%) */
  impressions: number
  /** 클릭률 증감률 (%) */
  ctr: number
  /** 평균 순위 증감률 (%) - 음수가 좋음 */
  position: number
  /** 색인 페이지 증감률 (%) */
  indexed: number
  /** 미색인 페이지 증감률 (%) - 음수가 좋음 */
  notIndexed: number
  /** 크롤링 요청 증감률 (%) */
  crawlRequests: number
  /** 응답 시간 증감률 (%) - 음수가 좋음 */
  responseTime: number
}
