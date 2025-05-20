/**
 * 서비스 상세 페이지 레이아웃 컴포넌트
 *
 * @component ServiceLayout
 * @description 서비스 상세 페이지의 전체 레이아웃을 구성하는 컴포넌트
 */

import { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../container/Sidebar'

interface ServiceLayoutProps {
  /** 현재 선택된 서비스 ID */
  serviceId: string
  /** 서비스 변경 시 호출될 함수 */
  onServiceChange: (id: string) => void
  /** 레이아웃 내부에 표시될 콘텐츠 */
  children: ReactNode
}

export const ServiceLayout = ({
  serviceId,
  onServiceChange,
  children,
}: ServiceLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentServiceId={serviceId}
          onServiceChange={onServiceChange}
        />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
