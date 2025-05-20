/**
 * KPI 항목 컴포넌트
 *
 * @component KpiItem
 * @description 서비스 카드 내부에서 개별 KPI 항목을 표시하는 컴포넌트
 */

interface KpiItemProps {
  /** KPI 라벨 */
  label: string
  /** KPI 값 */
  value: string
  /** 증감률 문자열 */
  growth: string
  /** 증감이 긍정적인지 여부 */
  isPositive: boolean
}

export const KpiItem = ({ label, value, growth, isPositive }: KpiItemProps) => {
  return (
    <div className="p-2 rounded-md bg-gray-50">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div
        className={`text-xs ${isPositive ? 'text-success-600' : 'text-danger-600'} font-medium`}
      >
        {growth}
      </div>
    </div>
  )
}
