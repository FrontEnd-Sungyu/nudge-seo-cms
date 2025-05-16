/**
 * 메인 대시보드 페이지
 *
 * @component DashboardPage
 * @description 서비스 카드 목록을 표시하는 메인 대시보드 페이지
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/common/Header'
import { ServiceCard } from '../../components/dashboard/ServiceCard'
import { mockServices } from '../../data/mockData'
import type { Service } from '../../types/service'

export const DashboardPage = () => {
  const [services] = useState<Service[]>(mockServices)
  const navigate = useNavigate()

  // 서비스 카드 클릭 핸들러
  const handleServiceClick = (id: string) => {
    navigate(`/services/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 서비스 없을 때 표시할 내용 */}
        {services.length === 0 ? (
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
            </div>

            {/* 서비스 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
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

export default DashboardPage