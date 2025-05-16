/**
 * 트렌드 차트 컴포넌트
 * 
 * @component TrendChart
 * @description 서비스 검색 분석 데이터의 트렌드를 시각화하는 차트 컴포넌트
 */

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// 목업 데이터
const generateTrendData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const baseClicks = 500 + Math.random() * 300;
    const baseImpressions = 8000 + Math.random() * 4000;
    
    data.push({
      date: date.toISOString().slice(0, 10),
      clicks: Math.round(baseClicks * (1 + Math.sin(i / 5) * 0.3)),
      impressions: Math.round(baseImpressions * (1 + Math.sin(i / 7) * 0.2)),
      ctr: (baseClicks * (1 + Math.sin(i / 5) * 0.3) / baseImpressions * (1 + Math.sin(i / 7) * 0.2) * 100).toFixed(2),
      position: (10 - 5 * Math.sin(i / 10)).toFixed(1)
    });
  }
  
  return data;
};

interface TrendChartProps {
  /** 서비스 ID */
  serviceId: string;
}

type ChartType = 'line' | 'area';
type MetricType = 'clicks' | 'impressions' | 'ctr' | 'position';
type PeriodType = '7' | '30' | '90';

export const TrendChart = ({ serviceId }: TrendChartProps) => {
  // 차트 타입 상태
  const [chartType, setChartType] = useState<ChartType>('line');
  // 선택된 기간
  const [period, setPeriod] = useState<PeriodType>('30');
  // 표시할 지표
  const [metrics, setMetrics] = useState<MetricType[]>(['clicks', 'impressions']);
  
  // 목업 데이터 생성
  const data = generateTrendData(parseInt(period));
  
  // 지표 토글 핸들러
  const toggleMetric = (metric: MetricType) => {
    if (metrics.includes(metric)) {
      setMetrics(metrics.filter(m => m !== metric));
    } else {
      setMetrics([...metrics, metric]);
    }
  };
  
  // 차트에서 사용할 색상 맵
  const colorMap: Record<MetricType, string> = {
    clicks: '#0284c7',       // primary-600
    impressions: '#8b5cf6',  // secondary-600
    ctr: '#16a34a',          // success-600
    position: '#dc2626'      // danger-600
  };
  
  // 차트에서 사용할 레이블 맵
  const labelMap: Record<MetricType, string> = {
    clicks: '클릭수',
    impressions: '노출수',
    ctr: 'CTR (%)',
    position: '평균 순위'
  };
  
  return (
    <div className="card">
      {/* 차트 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-medium text-gray-900">검색 트렌드</h3>
        
        {/* 기간 선택 */}
        <div className="flex items-center">
          <div className="mr-4">
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  period === '7' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPeriod('7')}
              >
                7일
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  period === '30' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPeriod('30')}
              >
                30일
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  period === '90' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPeriod('90')}
              >
                90일
              </button>
            </div>
          </div>
          
          {/* 차트 타입 선택 */}
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                chartType === 'line' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setChartType('line')}
            >
              라인
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                chartType === 'area' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setChartType('area')}
            >
              영역
            </button>
          </div>
        </div>
      </div>
      
      {/* 지표 선택 토글 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(labelMap).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
              metrics.includes(key as MetricType)
                ? `bg-${key === 'clicks' ? 'primary' : key === 'impressions' ? 'secondary' : key === 'ctr' ? 'success' : 'danger'}-100 text-${key === 'clicks' ? 'primary' : key === 'impressions' ? 'secondary' : key === 'ctr' ? 'success' : 'danger'}-700 border border-${key === 'clicks' ? 'primary' : key === 'impressions' ? 'secondary' : key === 'ctr' ? 'success' : 'danger'}-200`
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
            onClick={() => toggleMetric(key as MetricType)}
            style={{
              backgroundColor: metrics.includes(key as MetricType) 
                ? `${key === 'clicks' ? '#e0f2fe' : key === 'impressions' ? '#ede9fe' : key === 'ctr' ? '#dcfce7' : '#fee2e2'}`
                : undefined,
              borderColor: metrics.includes(key as MetricType)
                ? `${key === 'clicks' ? '#bae6fd' : key === 'impressions' ? '#c4b5fd' : key === 'ctr' ? '#bbf7d0' : '#fecaca'}`
                : undefined,
              color: metrics.includes(key as MetricType)
                ? `${key === 'clicks' ? '#0369a1' : key === 'impressions' ? '#5b21b6' : key === 'ctr' ? '#15803d' : '#b91c1c'}`
                : undefined
            }}
          >
            <span className="mr-2">
              <span 
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: colorMap[key as MetricType] }}
              />
            </span>
            {label}
          </button>
        ))}
      </div>
      
      {/* 차트 */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
                domain={[0, 30]}
                hide={!metrics.includes('position') && !metrics.includes('ctr')}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'clicks') return [`${value} 클릭`, '클릭수'];
                  if (name === 'impressions') return [`${value} 노출`, '노출수'];
                  if (name === 'ctr') return [`${value}%`, 'CTR'];
                  if (name === 'position') return [`${value}위`, '평균 순위'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                }}
              />
              <Legend formatter={(value) => labelMap[value as MetricType]} />
              
              {metrics.includes('clicks') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke={colorMap.clicks} 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('impressions') && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="impressions" 
                  stroke={colorMap.impressions} 
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('ctr') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ctr" 
                  stroke={colorMap.ctr} 
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('position') && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="position" 
                  stroke={colorMap.position} 
                  strokeWidth={2}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
                domain={[0, 30]}
                hide={!metrics.includes('position') && !metrics.includes('ctr')}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'clicks') return [`${value} 클릭`, '클릭수'];
                  if (name === 'impressions') return [`${value} 노출`, '노출수'];
                  if (name === 'ctr') return [`${value}%`, 'CTR'];
                  if (name === 'position') return [`${value}위`, '평균 순위'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                }}
              />
              <Legend formatter={(value) => labelMap[value as MetricType]} />
              
              {metrics.includes('clicks') && (
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke={colorMap.clicks} 
                  fillOpacity={0.2}
                  fill={colorMap.clicks}
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('impressions') && (
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="impressions" 
                  stroke={colorMap.impressions} 
                  fillOpacity={0.2}
                  fill={colorMap.impressions}
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('ctr') && (
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ctr" 
                  stroke={colorMap.ctr} 
                  fillOpacity={0.2}
                  fill={colorMap.ctr}
                  strokeWidth={2}
                />
              )}
              
              {metrics.includes('position') && (
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="position" 
                  stroke={colorMap.position} 
                  fillOpacity={0.2}
                  fill={colorMap.position}
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};