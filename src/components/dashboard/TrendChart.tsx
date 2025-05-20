/**
 * 트렌드 차트 컴포넌트
 *
 * @component TrendChart
 * @description 서비스 검색 분석 데이터의 트렌드를 시각화하는 차트 컴포넌트
 */

import { useState, useEffect } from 'react'
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
  AreaChart,
} from 'recharts'
import { fetchSearchAnalytics, getDateRange } from '@/api/gscApi'
import type { GSCSearchAnalyticsRow } from '@/api/types'

type ChartType = 'line' | 'area'
type MetricType = 'clicks' | 'impressions' | 'ctr' | 'position'
type PeriodType = '7' | '28' | '90'

interface TrendChartProps {
  /** 사이트 URL */
  siteUrl?: string
  /** 트렌드 데이터 (외부에서 제공받은 경우) */
  trendData?: any[]
  /** 선택된 기간 */
  selectedPeriod: PeriodType
}

export const TrendChart = ({
  siteUrl,
  trendData,
  selectedPeriod = '7',
}: TrendChartProps) => {
  // 차트 타입 상태
  const [chartType, setChartType] = useState<ChartType>('line')
  // 선택된 기간 (컴포넌트 내부용)
  const [period, setPeriod] = useState<PeriodType>(selectedPeriod)
  // 표시할 지표
  const [metrics, setMetrics] = useState<MetricType[]>([
    'clicks',
    'impressions',
  ])
  // 차트 데이터
  const [data, setData] = useState<any[]>([])

  // 외부에서 제공된 선택된 기간이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (selectedPeriod) {
      setPeriod(selectedPeriod)
    }
  }, [selectedPeriod])

  // 외부에서 트렌드 데이터가 제공된 경우 사용
  useEffect(() => {
    if (trendData && trendData.length > 0) {
      const formattedData = trendData.map((row) => ({
        date: row.keys[0], // 첫 번째 차원은 날짜
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: (row.ctr * 100).toFixed(2), // API는 0-1 사이 값, UI는 퍼센트로 표시
        position: row.position.toFixed(1),
      }))

      setData(formattedData)
      return
    }

    fetchTrendData()
  }, [trendData, siteUrl, period])

  // API에서 데이터 가져오기 (외부에서 데이터를 제공하지 않은 경우)
  const fetchTrendData = async () => {
    // 사이트 URL이 없으면 목업 데이터 사용
    if (!siteUrl) {
      // 목업 데이터 생성
      const mockData = generateMockData(parseInt(period))
      setData(mockData)
      return
    }

    try {
      // 기간 설정
      const days = parseInt(period)
      const { startDate, endDate } = getDateRange(days)

      // API 호출
      const response = await fetchSearchAnalytics(
        siteUrl,
        startDate,
        endDate,
        ['date'], // 날짜별 데이터
        days, // 기간만큼 데이터 요청
      )

      // API 응답 데이터 변환
      if (response.rows && response.rows.length > 0) {
        const formattedData = response.rows.map(
          (row: GSCSearchAnalyticsRow) => ({
            date: row.keys[0], // 첫 번째 차원은 날짜
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: (row.ctr * 100).toFixed(2), // API는 0-1 사이 값, UI는 퍼센트로 표시
            position: row.position.toFixed(1),
          }),
        )

        setData(formattedData)
      } else {
        // 데이터가 없으면 빈 배열 설정
        setData([])
      }
    } catch (err) {
      console.error('트렌드 데이터 로드 중 오류 발생:', err)
      // 오류 발생 시 목업 데이터로 대체
      const mockData = generateMockData(parseInt(period))
      setData(mockData)
    }
  }

  // API 호출 전이나 오류 시 사용할 목업 데이터 생성 함수
  const generateMockData = (days: number) => {
    const mockData = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const baseClicks = 500 + Math.random() * 300
      const baseImpressions = 8000 + Math.random() * 4000

      mockData.push({
        date: date.toISOString().slice(0, 10),
        clicks: Math.round(baseClicks * (1 + Math.sin(i / 5) * 0.3)),
        impressions: Math.round(baseImpressions * (1 + Math.sin(i / 7) * 0.2)),
        ctr: (
          ((baseClicks * (1 + Math.sin(i / 5) * 0.3)) / baseImpressions) *
          (1 + Math.sin(i / 7) * 0.2) *
          100
        ).toFixed(2),
        position: (10 - 5 * Math.sin(i / 10)).toFixed(1),
      })
    }

    return mockData
  }

  // 지표 토글 핸들러
  const toggleMetric = (metric: MetricType) => {
    if (metrics.includes(metric)) {
      setMetrics(metrics.filter((m) => m !== metric))
    } else {
      setMetrics([...metrics, metric])
    }
  }

  // 왼쪽 Y축 레이블 가져오기
  const getLeftAxisLabel = (): string => {
    const leftAxisMetrics = metrics.filter(
      (m) => m === 'clicks' || m === 'impressions',
    )
    if (leftAxisMetrics.length === 1) {
      return labelMap[leftAxisMetrics[0]]
    } else if (leftAxisMetrics.length === 2) {
      return '클릭수 / 노출수'
    }
    return ''
  }

  // 오른쪽 Y축 레이블 가져오기
  const getRightAxisLabel = (): string => {
    const rightAxisMetrics = metrics.filter(
      (m) => m === 'ctr' || m === 'position',
    )
    if (rightAxisMetrics.length === 1) {
      return labelMap[rightAxisMetrics[0]]
    } else if (rightAxisMetrics.length === 2) {
      return 'CTR / 평균 순위'
    }
    return ''
  }

  // 차트에서 사용할 색상 맵
  const colorMap: Record<MetricType, string> = {
    clicks: '#0284c7', // primary-600
    impressions: '#8b5cf6', // secondary-600
    ctr: '#16a34a', // success-600
    position: '#dc2626', // danger-600
  }

  // 차트에서 사용할 레이블 맵
  const labelMap: Record<MetricType, string> = {
    clicks: '클릭수',
    impressions: '노출수',
    ctr: 'CTR (%)',
    position: '평균 순위',
  }

  return (
    <div className="card">
      {/* 차트 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-medium text-gray-900">검색 트렌드</h3>

        {/* 차트 타입 선택만 표시 (기간 선택은 상단 DateRangePicker로 이동) */}
        <div className="flex items-center">
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
                : undefined,
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
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                reversed={metrics.includes('position')}
                hide={metrics.length > 2}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                reversed={metrics.includes('position')}
                tick={{ fontSize: 12 }}
                hide={metrics.length > 2}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'clicks') return [`${value} 클릭`, '클릭수']
                  if (name === 'impressions') return [`${value} 노출`, '노출수']
                  if (name === 'ctr') return [`${value}%`, 'CTR']
                  if (name === 'position') return [`${value}위`, '평균 순위']
                  return [value, name]
                }}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }}
              />
              <Legend formatter={(value) => labelMap[value as MetricType]} />

              {metrics.includes('clicks') && (
                <Line
                  yAxisId={metrics.indexOf('clicks') === 0 ? 'left' : 'right'}
                  type="monotone"
                  dataKey="clicks"
                  stroke={colorMap.clicks}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              )}

              {metrics.includes('impressions') && (
                <Line
                  yAxisId={
                    metrics.indexOf('impressions') === 0 ? 'left' : 'right'
                  }
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
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                hide={metrics.length > 2}
                label={{
                  value: getLeftAxisLabel(),
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 10 },
                  dx: -15,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                domain={metrics.includes('position') ? [10, 1] : [0, 30]}
                hide={
                  metrics.length > 2 ||
                  (!metrics.includes('position') && !metrics.includes('ctr'))
                }
                label={{
                  value: getRightAxisLabel(),
                  angle: 90,
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fontSize: 10 },
                  dx: 15,
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'clicks') return [`${value} 클릭`, '클릭수']
                  if (name === 'impressions') return [`${value} 노출`, '노출수']
                  if (name === 'ctr') return [`${value}%`, 'CTR']
                  if (name === 'position') return [`${value}위`, '평균 순위']
                  return [value, name]
                }}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }}
              />
              <Legend formatter={(value) => labelMap[value as MetricType]} />

              {metrics.includes('clicks') && (
                <Area
                  yAxisId={metrics.indexOf('clicks') === 0 ? 'left' : 'right'}
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
                  yAxisId={
                    metrics.indexOf('impressions') === 0 ? 'left' : 'right'
                  }
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
  )
}
