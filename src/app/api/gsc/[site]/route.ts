/**
 * 특정 사이트의 Google Search Console 데이터를 요청하는 API 라우트
 */
import { JWT } from 'google-auth-library'
import { google } from 'googleapis'

// 모니터링할 사이트 URL 매핑
const siteUrls: Record<string, string> = {
  linkareer: 'https://linkareer.com/',
  community: 'https://community.linkareer.com/',
  cbt: 'sc-domain:cbt-community.linkareer.com',
}

/**
 * 특정 사이트의 GSC 검색 통계 데이터를 가져옴
 */
export async function GET({ params }: { params: { site: string } }) {
  try {
    const site = params.site
    const siteUrl = siteUrls[site]

    if (!siteUrl) {
      return new Response(
        JSON.stringify({
          error: `지원하지 않는 사이트입니다: ${site}`,
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        },
      )
    }

    // 기본 날짜 범위 설정 (최근 30일)
    const today = new Date()
    const endDate = today.toISOString().split('T')[0]
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30,
    )
      .toISOString()
      .split('T')[0]

    // JWT를 이용한 서비스 계정 인증
    const auth = new JWT({
      email: process.env.GCP_CLIENT_EMAIL,
      key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })

    // Search Console API 초기화
    const webmasters = google.webmasters({ version: 'v3', auth })

    // 검색 분석 데이터 요청
    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: 30,
      },
    })

    // 사이트 이름 매핑
    const siteNames: Record<string, string> = {
      linkareer: '링커리어',
      community: '링커리어 커뮤니티',
      cbt: '링커리어 CBT 커뮤니티',
    }

    // 응답 데이터 구성
    return new Response(
      JSON.stringify({
        site: {
          id: site,
          name: siteNames[site] || site,
          url: siteUrl,
        },
        period: {
          startDate,
          endDate,
        },
        data: response.data,
      }),
      {
        headers: { 'content-type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error(`사이트 ${params.site} 데이터 요청 오류:`, error)
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
