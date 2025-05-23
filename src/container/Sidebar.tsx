/**
 * 좌측 내비게이션 바(LNB) 컴포넌트
 *
 * @component Sidebar
 * @description 서비스 상세 페이지에서 사용하는 좌측 내비게이션 바
 */

import { MONITORED_SITES } from '@/constants/monitoredSite'
import { formatDomain } from '@/utils/formatter'
import Link from 'next/link'

interface SidebarProps {
  /** 현재 선택된 서비스 ID */
  currentServiceId: string
  /** 서비스 변경 시 호출되는 함수 */
  onServiceChange: (id: string) => void
}

export const Sidebar = ({
  currentServiceId,
  onServiceChange,
}: SidebarProps) => {
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      {/* 로고 및 메인화면 링크 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <Link href="/" className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
              S
            </div>
          </div>
          <div className="ml-2">
            <span className="text-sm font-semibold text-gray-900">
              넛지 SEO 통합 CMS
            </span>
          </div>
        </Link>
      </div>

      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">서비스 목록</h2>
        <p className="text-sm text-gray-500 mt-1">
          등록된 {MONITORED_SITES.length}개 서비스
        </p>
      </div>

      {/* 서비스 목록 */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          {MONITORED_SITES.map((service) => (
            <button
              key={service.id}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                service.id === currentServiceId
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onServiceChange(service.id)}
            >
              {service.iconUrl ? (
                <img
                  src={service.iconUrl}
                  alt={service.name}
                  className="w-6 h-6 rounded mr-3 flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  {service.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 truncate">
                <span className="block truncate">{service.name}</span>
                <span className="block text-xs text-gray-500 truncate">
                  {formatDomain(service.url)}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
