/**
 * 모든 사이트의 통합 요약 데이터를 제공하는 API 라우트
 */
import { JWT } from 'google-auth-library'
import { google } from 'googleapis'

// 모니터링할 사이트 목록
const sites = [
  { id: 'linkareer', url: 'https://linkareer.com/', name: '링커리어' },
  {
    id: 'community',
    url: 'https://community.linkareer.com/',
    name: '링커리어 커뮤니티',
  },
  {
    id: 'cbt',
    url: 'sc-domain:cbt-community.linkareer.com',
    name: '링커리어 CBT 커뮤니티',
  },
]

/**
 * 모든 사이트의 GSC 요약 지표를 가져옴
 */
export async function GET() {
  try {
    // 날짜 범위 설정 (Search Console 데이터는 보통 3일 지연됨)
    const today = new Date()

    // 최신 데이터 날짜 (오늘로부터 3일 전)
    const latestDataDate = new Date(today)
    latestDataDate.setDate(today.getDate())

    // 최근 7일 범위
    const endDate = latestDataDate.toISOString().split('T')[0]
    const startDate = new Date(latestDataDate)
    startDate.setDate(latestDataDate.getDate() - 6) // 7일 기간 (당일 포함)
    const startDateStr = startDate.toISOString().split('T')[0]

    // 이전 7일 범위 (최근 7일 직전 7일)
    const prevEndDate = new Date(startDate)
    prevEndDate.setDate(startDate.getDate())
    const prevEndDateStr = prevEndDate.toISOString().split('T')[0]

    const prevStartDate = new Date(prevEndDate)
    prevStartDate.setDate(prevEndDate.getDate() - 6) // 7일 기간 (당일 포함)
    const prevStartDateStr = prevStartDate.toISOString().split('T')[0]

    // JWT를 이용한 서비스 계정 인증
    const auth = new JWT({
      email: process.env.GCP_CLIENT_EMAIL,
      key: process.env.GCP_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })

    // Search Console API 초기화
    const webmasters = google.searchconsole({ version: 'v1', auth })

    // 각 사이트별로 데이터 요청
    const results = await Promise.all(
      sites.map(async (site) => {
        try {
          // 현재 기간 데이터 요청
          const currentResponse = await webmasters.searchanalytics.query({
            siteUrl: site.url,
            requestBody: {
              startDate: startDateStr,
              endDate,
              // 차원 없이 요청하면 총계 데이터를 반환
            },
          })

          // 이전 기간 데이터 요청 (증감률 계산용)
          const prevResponse = await webmasters.searchanalytics.query({
            siteUrl: site.url,
            requestBody: {
              startDate: prevStartDateStr,
              endDate: prevEndDateStr,
            },
          })

          // 현재 기간 총계 데이터
          const current = currentResponse.data.rows?.[0] || {
            clicks: 0,
            impressions: 0,
            ctr: 0,
            position: 0,
          }

          // 이전 기간 총계 데이터
          const prev = prevResponse.data.rows?.[0] || {
            clicks: 0,
            impressions: 0,
            ctr: 0,
            position: 0,
          }

          // 증감률 계산 함수
          const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return 0
            return ((current - previous) / previous) * 100
          }

          // 사이트별 요약 데이터 구성
          return {
            id: site.id,
            name: site.name,
            url: site.url,
            metrics: {
              clicks: {
                value: current.clicks || 0,
                change: calculateChange(current.clicks || 0, prev.clicks || 0),
              },
              impressions: {
                value: current.impressions || 0,
                change: calculateChange(
                  current.impressions || 0,
                  prev.impressions || 0,
                ),
              },
              ctr: {
                value: current.ctr || 0,
                change: calculateChange(current.ctr || 0, prev.ctr || 0),
              },
              position: {
                value: current.position || 0,
                // 포지션은 낮을수록 좋으므로 변화율 계산 방식을 반대로 적용
                change: calculateChange(
                  prev.position || 0,
                  current.position || 0,
                ),
              },
            },
          }
        } catch (error: any) {
          console.error(`${site.name} 데이터 요청 오류:`, error)
          return {
            id: site.id,
            name: site.name,
            url: site.url,
            error: error.message || '데이터를 가져올 수 없습니다.',
          }
        }
      }),
    )

    // 전체 응답 구성
    return new Response(
      JSON.stringify({
        period: {
          current: { startDate: startDateStr, endDate },
          previous: { startDate: prevStartDateStr, endDate: prevEndDateStr },
        },
        latestDataDate: latestDataDate.toISOString().split('T')[0], // 최신 데이터 날짜 전달 (화면에 표시용)
        sites: results,
      }),
      {
        headers: { 'content-type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('요약 데이터 요청 오류:', error)
    return new Response(
      JSON.stringify({
        error: error.message || '내부 서버 오류',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    )
  }
}
