/**
 * KPI 지표 카드 컴포넌트
 * 
 * @component KpiCard
 * @description 서비스 상세 페이지에서 주요 KPI 지표를 표시하는 카드 컴포넌트
 */

interface KpiCardProps {
  /** 카드 제목 */
  title: string;
  /** 주 값 */
  value: string;
  /** 증감률 표시 문자열 */
  growth?: string;
  /** 증감이 긍정적인지 여부 */
  isPositive?: boolean;
  /** 아이콘 컴포넌트 */
  icon?: React.ReactNode;
  /** 추가 설명 */
  description?: string;
}

export const KpiCard = ({
  title,
  value,
  growth,
  isPositive = true,
  icon,
  description
}: KpiCardProps) => {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {growth && (
          <div 
            className={`ml-2 flex items-center text-sm font-medium ${
              isPositive ? 'text-success-600' : 'text-danger-600'
            }`}
          >
            {isPositive ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-0.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-0.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            <span>{growth}</span>
          </div>
        )}
      </div>
      {description && (
        <div className="mt-1 text-sm text-gray-500">{description}</div>
      )}
    </div>
  );
};