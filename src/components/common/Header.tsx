/**
 * 애플리케이션 헤더 컴포넌트
 * 
 * @component Header
 * @description 앱 로고와 주요 액션 버튼을 포함한 헤더 컴포넌트
 */

interface HeaderProps {
  /** 새 서비스 추가 버튼 클릭 핸들러 */
  onAddService: () => void;
}

export const Header = ({ onAddService }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
          
          {/* 액션 버튼 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onAddService}
              className="btn-primary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              새 서비스 추가
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};