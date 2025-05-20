/**
 * 서비스 상세 페이지
 *
 * @component ServiceDetailPage
 * @description 서비스의 상세 정보와 KPI 지표를 보여주는 페이지
 */

'use client'

import { MONITORED_SITES, fetchSitePeriodData } from '@/api/gscApi'
import {
  DateRangePicker,
  PeriodType,
} from '@/container/DateRangePicker'
import { KpiCard } from '@/container/KpiCard'
import { TrendChart } from '@/container/TrendChart'
import { Sidebar } from '@/container/Sidebar'
import type { Service, ServiceGrowth } from '@/types/service'
import {
  formatDate,
  formatDomain,
  formatGrowth,
  formatNumber,
  formatPercent,
} from '@/utils/formatter'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ServiceDetailPage({
  params,
}: {
  params: { serviceId: string }
}) {
  const { serviceId } = params
  const router = useRouter()

  // 현재 서비스 데이터
  const [service, setService] = useState<Service>()
  // 서비스 증감률
  const [growth, setGrowth] = useState<ServiceGrowth>()
  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(true)
  // 에러 상태
  const [error, setError] = useState<string | null>()
  // 선택된 기간
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7')
  // 최신 데이터 날짜
  const [latestDataDate, setLatestDataDate] = useState<string>()
  // 트렌드 데이터
  const [trendData, setTrendData] = useState<any[]>([])

  // 기간 변경 핸들러
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period)
  }

  // 선택된 기간이 변경되면 데이터 다시 로드
  useEffect(() => {
    loadPeriodData()
  }, [serviceId, selectedPeriod])

  // 기간별 데이터 로드
  const loadPeriodData = async () => {
    try {
      setLoading(true)

      // API에서 기간별 데이터 가져오기
      const periodData = await fetchSitePeriodData(serviceId, selectedPeriod)

      // 모니터링 중인 사이트 정보 가져오기
      const monitoredSite = MONITORED_SITES.find((s) => s.id === serviceId)
      const lastUpdateDate = new Date().setDate(new Date().getDate() - 3)

      if (!monitoredSite) {
        throw new Error('등록되지 않은 서비스입니다.')
      }

      // 최신 데이터 날짜 저장
      if (periodData.latestDataDate) {
        setLatestDataDate(periodData.latestDataDate)
      }

      // 트렌드 데이터 저장
      if (periodData.detailData) {
        setTrendData(periodData.detailData)
      }

      // 증감률 데이터 생성
      const calculatedGrowth: ServiceGrowth = {
        clicks: periodData.metrics.clicks.change || 0,
        impressions: periodData.metrics.impressions.change || 0,
        ctr: periodData.metrics.ctr.change || 0,
        position: periodData.metrics.position.change || 0,
        indexed: 0, // API에서 제공하지 않음
        notIndexed: 0, // API에서 제공하지 않음
        crawlRequests: 0, // API에서 제공하지 않음
        responseTime: 0, // API에서 제공하지 않음
      }

      // Service 객체 생성
      const serviceData: Service = {
        id: serviceId,
        name: periodData.site.name || monitoredSite.name,
        url: periodData.site.url || monitoredSite.url,
        iconUrl: monitoredSite.iconUrl,
        verified: true, // API에 접근 가능하면 인증된 것으로 간주
        summary: {
          clicks: periodData.metrics.clicks.value || 0,
          impressions: periodData.metrics.impressions.value || 0,
          ctr: (periodData.metrics.ctr.value || 0) * 100, // API는 0-1 사이 값, UI는 퍼센트로 표시
          position: periodData.metrics.position.value || 0,
          indexed: 0, // API에서 제공하지 않음
          notIndexed: 0, // API에서 제공하지 않음
          crawlRequests: 0, // API에서 제공하지 않음
          responseTime: 0, // API에서 제공하지 않음
        },
        createdAt: lastUpdateDate,
        lastUpdatedAt: lastUpdateDate,
      }

      setService(serviceData)
      setGrowth(calculatedGrowth)
      setError(null)
    } catch (err) {
      console.error('서비스 데이터 로드 중 오류 발생:', err)
      setError('서비스 데이터를 불러오는 중 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 서비스 변경 핸들러
  const handleServiceChange = (id: string) => {
    router.push(`/services/${id}`)
  }

  // 원본 서치콘솔로 이동
  const goToSearchConsole = () => {
    if (service) {
      window.open(
        `https://search.google.com/search-console?resource_id=${encodeURIComponent(service.url)}`,
        '_blank',
      )
    }
  }

  // 로딩 중이거나 데이터 없음
  if (loading || (!service && !error)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">서비스 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 발생
  if (error || !service) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
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
          <p className="text-gray-500 mb-4">
            {error || '서비스 데이터를 찾을 수 없습니다.'}
          </p>
          <button onClick={() => router.push('/')} className="btn-primary">
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (!growth) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 내비게이션 바 */}
      <Sidebar
        currentServiceId={serviceId || ''}
        onServiceChange={handleServiceChange}
      />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {service.iconUrl ? (
                <img
                  src={service.iconUrl}
                  alt={service.name}
                  className="w-10 h-10 rounded-md mr-4"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-4">
                  {service.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {service.name}
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                  {formatDomain(service.url)}
                  {service.verified && (
                    <span className="ml-2 text-success-600 flex items-center text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      인증됨
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex space-x-2">
              <button
                type="button"
                onClick={goToSearchConsole}
                className="btn-primary text-sm"
              >
                Search Console 열기
              </button>
            </div>
          </div>

          {/* 페이지 정보 및 업데이트 날짜 */}
          <div className="px-6 py-2 bg-gray-50 border-t border-b border-gray-200 text-sm text-gray-600">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <span className="font-medium">최신 데이터 기준일:</span>{' '}
                {latestDataDate &&
                  formatDate(new Date(latestDataDate), 'short')}
                <span className="ml-1 text-xs text-gray-500">
                  (Google Search Console은 데이터 처리에 약 3일이 소요됩니다)
                </span>
              </div>

              {/* 기간 선택기 */}
              <DateRangePicker
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                latestDataDate={latestDataDate}
              />
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto py-6 px-6">
          {/* KPI 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="클릭수"
              value={formatNumber(service.summary.clicks)}
              growth={formatGrowth(growth.clicks)}
              isPositive={growth.clicks > 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="노출수"
              value={formatNumber(service.summary.impressions)}
              growth={formatGrowth(growth.impressions)}
              isPositive={growth.impressions > 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="CTR"
              value={formatPercent(service.summary.ctr)}
              growth={formatGrowth(growth.ctr)}
              isPositive={growth.ctr > 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="평균 순위"
              value={service.summary.position.toFixed(1)}
              growth={formatGrowth(growth.position, true)} // 순위는 낮을수록 좋음
              isPositive={growth.position < 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="색인된 페이지"
              value={formatNumber(service.summary.indexed)}
              growth={formatGrowth(growth.indexed)}
              isPositive={growth.indexed > 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              }
            />
            <KpiCard
              title="미색인 페이지"
              value={formatNumber(service.summary.notIndexed)}
              growth={formatGrowth(growth.notIndexed, true)} // 미색인은 감소할수록 좋음
              isPositive={growth.notIndexed < 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="크롤링 요청"
              value={formatNumber(service.summary.crawlRequests)}
              growth={formatGrowth(growth.crawlRequests)}
              isPositive={growth.crawlRequests > 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <KpiCard
              title="평균 응답시간"
              value={`${service.summary.responseTime} ms`}
              growth={formatGrowth(growth.responseTime, true)} // 응답시간은 감소할수록 좋음
              isPositive={growth.responseTime < 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>

          {/* 트렌드 차트 */}
          <div className="mb-6">
            <TrendChart
              siteUrl={service.url}
              trendData={trendData}
              selectedPeriod={selectedPeriod}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
