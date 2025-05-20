/**
 * 서비스 요약 정보를 표시하는 카드 컴포넌트
 *
 * @component ServiceCard
 * @description 메인 화면에서 각 서비스의 요약 정보를 카드 형태로 표시하며, 클릭시 상세 페이지로 이동합니다
 */

import type { Service } from '../types/service'
import { KpiItem } from '../components/KpiItem'
import {
  formatDate,
  formatDomain,
  formatGrowth,
  formatNumber,
  formatPercent,
} from '../utils/formatter'

interface ServiceCardProps {
  /** 서비스 정보 객체 */
  service: Service
  /** 서비스 증감률 정보 (선택 사항, 없으면 기본값 사용) */
  growth?: {
    clicks: number
    impressions: number
    ctr: number
    position: number
  }
  /** 카드 클릭시 실행할 함수 */
  onClick: (id: string) => void
}

export const ServiceCard = ({ service, growth, onClick }: ServiceCardProps) => {
  // growth 값이 없으면 기본값 사용 (0)
  const growthData = growth || {
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  }

  return (
    <div
      className="card card-hover p-5 cursor-pointer transition-all duration-200 hover:translate-y-[-2px]"
      onClick={() => onClick(service.id)}
    >
      <div className="flex items-center mb-4">
        {service.iconUrl ? (
          <img
            src={service.iconUrl}
            alt={service.name}
            className="w-8 h-8 rounded-md mr-3"
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
            {service.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <p className="text-sm text-gray-500">{formatDomain(service.url)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <KpiItem
          label="클릭수"
          value={formatNumber(service.summary.clicks, true)}
          growth={formatGrowth(growthData.clicks)}
          isPositive={growthData.clicks > 0}
        />
        <KpiItem
          label="노출수"
          value={formatNumber(service.summary.impressions, true)}
          growth={formatGrowth(growthData.impressions)}
          isPositive={growthData.impressions > 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <KpiItem
          label="CTR"
          value={formatPercent(service.summary.ctr)}
          growth={formatGrowth(growthData.ctr)}
          isPositive={growthData.ctr > 0}
        />
        <KpiItem
          label="평균 순위"
          value={service.summary.position.toFixed(1)}
          growth={formatGrowth(growthData.position, true)} // 순위는 낮을수록 좋음
          isPositive={growthData.position < 0}
        />
      </div>

      <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 flex justify-between items-center">
        <div>
          {service.verified ? (
            <span className="text-success-600 flex items-center">
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
          ) : (
            <span className="text-warning-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              미인증
            </span>
          )}
        </div>
        <div>
          최종 업데이트:{' '}
          {formatDate(service.lastUpdatedAt || service.createdAt)}
        </div>
      </div>
    </div>
  )
}
