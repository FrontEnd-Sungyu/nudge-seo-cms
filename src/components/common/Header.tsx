/**
 * 애플리케이션 헤더 컴포넌트
 * 
 * @component Header
 * @description 앱 로고와 주요 액션 버튼을 포함한 헤더 컴포넌트
 */

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* 로고 및 앱 타이틀 */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-md bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                S
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">SEO 데이터 CMS</h1>
              <p className="text-xs text-gray-500">Search Console 통합 모니터링</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};