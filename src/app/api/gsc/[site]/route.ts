/**
 * 특정 사이트의 기간별 Google Search Console 데이터를 요청하는 API 라우트
 */
import { NextRequest } from 'next/server'
import { JWT } from 'google-auth-library'
import { google } from 'googleapis'

// 모니터링할 사이트 URL 매핑
const siteUrls: Record<string, string> = {
  linkareer: 'https://linkareer.com/',
  community: 'https://community.linkareer.com/',
  cbt: 'sc-domain:cbt-community.linkareer.com',
}

// 사이트 이름 매핑
const siteNames: Record<string, string> = {
  linkareer: '링커리어',
  community: '링커리어 커뮤니티',
  cbt: '링커리어 CBT 커뮤니티',
}

/**
 * 기간별 GSC 검색 통계 데이터를 가져옴
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { site: string } },
) {
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

    // 쿼리 파라미터에서 기간 가져오기
    const { searchParams } = new URL(request.url)
    const periodDays = searchParams.get('days') || '7' // 기본값은 7일
    const days = parseInt(periodDays)

    // Search Console 데이터는 보통 3일 지연됨
    const today = new Date()
    const latestDataDate = new Date(today)
    latestDataDate.setDate(today.getDate() - 3)

    // 기간 계산
    const endDate = latestDataDate.toISOString().split('T')[0]
    const startDate = new Date(latestDataDate)
    startDate.setDate(latestDataDate.getDate() - (days - 1)) // days일 기간 (당일 포함)
    const startDateStr = startDate.toISOString().split('T')[0]

    // 이전 기간 계산 (비교용)
    const prevEndDate = new Date(startDate)
    prevEndDate.setDate(startDate.getDate() - 1)
    const prevEndDateStr = prevEndDate.toISOString().split('T')[0]

    const prevStartDate = new Date(prevEndDate)
    prevStartDate.setDate(prevEndDate.getDate() - (days - 1)) // 동일한 기간
    const prevStartDateStr = prevStartDate.toISOString().split('T')[0]

    // JWT를 이용한 서비스 계정 인증
    const auth = new JWT({
      email: process.env.GCP_CLIENT_EMAIL,
      key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })

    // Search Console API 초기화
    const webmasters = google.searchconsole({ version: 'v1', auth })

    // 현재 기간 데이터 요청 (날짜별 데이터)
    const currentDetailResponse = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate,
        dimensions: ['date'], // 날짜별 데이터
        rowLimit: days,
      },
    })

    // 현재 기간 총계 데이터 요청 (차원 없이)
    const currentTotalResponse = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate,
        // 차원 없이 요청하면 총계 데이터를 반환
      },
    })

    // 이전 기간 총계 데이터 요청 (증감률 계산용)
    const prevResponse = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: prevStartDateStr,
        endDate: prevEndDateStr,
        // 차원 없이 요청하면 총계 데이터를 반환
      },
    })

    // 현재 기간 총계 데이터
    const current = currentTotalResponse.data.rows?.[0] || {
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

    // 지표 요약 데이터
    const metrics = {
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
        change: calculateChange(prev.position || 0, current.position || 0),
      },
    }

    // 응답 구성
    return new Response(
      JSON.stringify({
        site: {
          id: site,
          name: siteNames[site] || site,
          url: siteUrl,
        },
        period: {
          current: {
            startDate: startDateStr,
            endDate,
          },
          previous: {
            startDate: prevStartDateStr,
            endDate: prevEndDateStr,
          },
        },
        latestDataDate,
        metrics,
        detailData: currentDetailResponse.data.rows || [],
      }),
      {
        headers: { 'content-type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error(`사이트 ${params.site} 기간별 데이터 요청 오류:`, error)
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
