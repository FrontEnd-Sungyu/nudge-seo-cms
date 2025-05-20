/**
 * Google Search Console API 통신 모듈
 *
 * @module gscApi
 * @description Google Search Console API와 통신하는 함수들을 제공합니다.
 */

import { MONITORED_SITES } from '@/constants/monitoredSite'
import type {
  GSCSearchAnalyticsResponse,
  GSCSiteData,
  GSCSummaryData,
} from './types'

/**
 * GSC API 기본 URL
 */
const API_BASE_URL = '/api/gsc'

/**
 * 날짜 범위 생성 함수
 */
export const getDateRange = (days: number = 30) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

/**
 * 모든 사이트의 요약 데이터를 가져옵니다.
 */
export const fetchAllSitesSummary = async (): Promise<GSCSummaryData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`)

    if (!response.ok) {
      throw new Error('GSC 요약 데이터를 가져오는데 실패했습니다')
    }

    return await response.json()
  } catch (error) {
    console.error('GSC 요약 데이터 요청 오류:', error)
    throw error
  }
}

/**
 * 특정 사이트의 데이터를 가져옵니다.
 */
export const fetchSiteData = async (siteId: string): Promise<GSCSiteData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${siteId}`)

    if (!response.ok) {
      throw new Error(`${siteId} 사이트 데이터를 가져오는데 실패했습니다`)
    }

    return await response.json()
  } catch (error) {
    console.error(`${siteId} 사이트 데이터 요청 오류:`, error)
    throw error
  }
}

/**
 * 검색 분석 데이터를 커스텀 쿼리로 가져옵니다.
 */
export const fetchSearchAnalytics = async (
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = ['date'],
  rowLimit: number = 30,
): Promise<GSCSearchAnalyticsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl,
        startDate,
        endDate,
        dimensions,
        rowLimit,
      }),
    })

    if (!response.ok) {
      throw new Error('검색 분석 데이터를 가져오는데 실패했습니다')
    }

    return await response.json()
  } catch (error) {
    console.error('검색 분석 데이터 요청 오류:', error)
    throw error
  }
}

/**
 * 모든 사이트 데이터를 가져옵니다.
 */
export const fetchAllSitesData = async () => {
  try {
    const allSitesData = await Promise.all(
      MONITORED_SITES.map((site) => fetchSiteData(site.id)),
    )

    return allSitesData
  } catch (error) {
    console.error('모든 사이트 데이터 요청 오류:', error)
    throw error
  }
}

/**
 * 특정 사이트의 기간별 데이터를 가져옵니다.
 */
export const fetchSitePeriodData = async (
  siteId: string,
  days: string = '7',
) => {
  try {
    const response = await fetch(`/api/gsc/${siteId}?days=${days}`)

    if (!response.ok) {
      throw new Error(
        `${siteId} 사이트의 기간별 데이터를 가져오는데 실패했습니다`,
      )
    }

    return await response.json()
  } catch (error) {
    console.error(`${siteId} 사이트의 기간별 데이터 요청 오류:`, error)
    throw error
  }
}
