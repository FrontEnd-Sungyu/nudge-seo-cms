import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '넛지 SEO 통합 CMS',
  description:
    '다수의 웹서비스 Google Search Console 지표와 색인·크롤링 상태를 한 화면에서 모니터링',
  icons: {
    icon: '/nudge.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
