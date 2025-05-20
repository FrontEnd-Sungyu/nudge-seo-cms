/**
 * 날짜 범위 선택 컴포넌트
 * 
 * @component DateRangePicker
 * @description 7일, 28일, 3개월 등의 기간을 선택할 수 있는 컴포넌트
 */

import { useState, useEffect } from 'react';

// 기간 타입 정의
export type PeriodType = '7' | '28' | '90';

// 컴포넌트 프롭스 타입
interface DateRangePickerProps {
  /** 선택된 기간 */
  selectedPeriod: PeriodType;
  /** 기간 변경 시 호출할 콜백 함수 */
  onPeriodChange: (period: PeriodType) => void;
  /** 최신 데이터 기준일 */
  latestDataDate?: string | null;
}

/**
 * 날짜 범위 선택 컴포넌트
 */
export const DateRangePicker = ({ 
  selectedPeriod, 
  onPeriodChange,
  latestDataDate
}: DateRangePickerProps) => {
  // 시작일과 종료일 계산
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });
  
  // 기간이 변경되면 날짜 범위 업데이트
  useEffect(() => {
    if (!latestDataDate) return;
    
    const endDate = new Date(latestDataDate);
    let startDate = new Date(endDate);
    
    // 선택된 기간에 따라 시작일 계산
    const days = parseInt(selectedPeriod);
    startDate.setDate(endDate.getDate() - (days - 1)); // 당일 포함하여 계산
    
    // 날짜 포맷팅
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    setDateRange({
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
  }, [selectedPeriod, latestDataDate]);
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* 선택된 날짜 범위 표시 */}
      {dateRange.start && dateRange.end && (
        <div className="text-sm text-gray-600 mr-2">
          <span className="font-medium">{dateRange.start}</span>
          <span className="mx-2">~</span>
          <span className="font-medium">{dateRange.end}</span>
        </div>
      )}
      
      {/* 기간 선택 버튼 그룹 */}
      <div className="flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-md ${
            selectedPeriod === '7' 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('7')}
        >
          7일
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            selectedPeriod === '28' 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('28')}
        >
          28일
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-md ${
            selectedPeriod === '90' 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('90')}
        >
          3개월
        </button>
      </div>
    </div>
  );
};