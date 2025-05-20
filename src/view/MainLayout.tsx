/**
 * 메인 화면 레이아웃 컴포넌트
 *
 * @component MainLayout
 * @description 애플리케이션 메인 화면을 구성하는 레이아웃 컴포넌트
 */

import { ReactNode } from 'react'
import { Header } from '../components/Header'

interface MainLayoutProps {
  /** 레이아웃 내부에 표시될 콘텐츠 */
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SEO 데이터 CMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
