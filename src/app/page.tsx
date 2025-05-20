/**
 * 메인 대시보드 페이지
 *
 * @component DashboardPage
 * @description 서비스 카드 목록을 표시하는 메인 대시보드 페이지
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/common/Header'
import { ServiceCard } from '@/components/dashboard/ServiceCard'
import { MONITORED_SITES, fetchAllSitesSummary } from '@/api/gscApi'
import type { Service } from '@/types/service'
import type { GSCSiteSummary } from '@/api/types'
import { formatDate } from '@/utils/formatter'

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [latestDataDate, setLatestDataDate] = useState<string | null>(null)
  const router = useRouter()

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 실제 API 호출
        const summaryData = await fetchAllSitesSummary()

        if (summaryData.latestDataDate) {
          setLatestDataDate(summaryData.latestDataDate)
        }

        // API 응답 데이터를 서비스 형식으로 변환
        const mappedServices = summaryData.sites.map((site: GSCSiteSummary) => {
          // MONITORED_SITES에서 아이콘 URL 가져오기
          const monitoredSite = MONITORED_SITES.find((s) => s.id === site.id)
          const lastUpdateDate = new Date().setDate(new Date().getDate() - 3)
          return {
            id: site.id,
            name: site.name,
            url: site.url,
            iconUrl: monitoredSite?.iconUrl,
            verified: !site.error, // 에러가 없으면 인증된 것으로 간주
            summary: {
              clicks: site.metrics?.clicks.value || 0,
              impressions: site.metrics?.impressions.value || 0,
              ctr: (site.metrics?.ctr.value || 0) * 100, // API는 0-1 사이 값, UI는 퍼센트로 표시
              position: site.metrics?.position.value || 0,
              indexed: 0, // API에서 제공하지 않음
              notIndexed: 0, // API에서 제공하지 않음
              crawlRequests: 0, // API에서 제공하지 않음
              responseTime: 0, // API에서 제공하지 않음
            },
            growth: {
              clicks: site.metrics?.clicks.change || 0,
              impressions: site.metrics?.impressions.change || 0,
              ctr: site.metrics?.ctr.change || 0,
              position: site.metrics?.position.change || 0,
            },
            createdAt: lastUpdateDate,
            lastUpdatedAt: lastUpdateDate,
          }
        })

        setServices(mappedServices)
      } catch (err) {
        console.error('데이터 로드 중 오류 발생:', err)
        setError('데이터를 불러오는 중 문제가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 서비스 카드 클릭 핸들러
  const handleServiceClick = (id: string) => {
    router.push(`/services/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 로딩 중일 때 표시할 내용 */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          /* 에러 발생 시 표시할 내용 */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-danger-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              데이터를 불러올 수 없습니다
            </h2>
            <p className="text-gray-500 mb-4">{error}</p>
          </div>
        ) : services.length === 0 ? (
          /* 서비스 없을 때 표시할 내용 */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              등록된 서비스가 없습니다
            </h2>
            <p className="text-gray-500 mb-4">
              Google Search Console에 연결된 서비스를 추가하여 SEO 데이터를
              모니터링하세요.
            </p>
          </div>
        ) : (
          <>
            {/* 페이지 타이틀 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                서비스 대시보드
              </h2>
              <p className="text-gray-500">
                등록된 서비스의 주요 지표를 한눈에 확인하세요.
              </p>

              {/* 데이터 최신 날짜 안내 */}
              {latestDataDate && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-blue-700">
                        <span className="font-semibold">
                          최신 데이터 기준일:{' '}
                          {formatDate(new Date(latestDataDate), 'short')}{' '}
                        </span>
                        <span className="ml-1">
                          (Google Search Console은 데이터 처리에 약 3일이
                          소요됩니다. 지표는 위 날짜를 기준으로 최근 7일간의
                          집계 데이터입니다.)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 서비스 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  growth={service.growth}
                  onClick={handleServiceClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
        <p>© 2025 SEO 데이터 CMS. 모든 권리 보유.</p>
      </footer>
    </div>
  )
}
