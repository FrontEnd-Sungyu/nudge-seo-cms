/**
 * 숫자 포맷팅 함수
 *
 * @function formatNumber
 * @description 숫자를 읽기 쉬운 형태로 포맷팅
 *
 * @param {number} num - 포맷팅할 숫자
 * @param {boolean} [compact=false] - 축약형 사용 여부
 * @returns {string} 포맷팅된 숫자 문자열
 */
export const formatNumber = (num: number, compact = false): string => {
  if (compact && num >= 1000) {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num)
  }

  return new Intl.NumberFormat('ko-KR').format(num)
}

/**
 * 퍼센트 포맷팅 함수
 *
 * @function formatPercent
 * @description 소수를 백분율로 포맷팅
 *
 * @param {number} num - 포맷팅할 숫자 (0.123 = 12.3%)
 * @param {number} [decimals=1] - 소수점 자릿수
 * @returns {string} 포맷팅된 백분율 문자열
 */
export const formatPercent = (num: number, decimals = 1): string => {
  return `${num.toFixed(decimals)}%`
}

/**
 * 증감률 포맷팅 함수
 *
 * @function formatGrowth
 * @description 증감률을 부호와 함께 포맷팅
 *
 * @param {number} num - 증감률 (%)
 * @param {boolean} [inverse=false] - 반전 여부 (감소가 좋은 지표인 경우)
 * @returns {string} 포맷팅된 증감률 문자열
 */
export const formatGrowth = (num: number, inverse = false): string => {
  const isPositive = inverse ? num < 0 : num > 0
  const prefix = isPositive ? '+' : ''

  return `${prefix}${num.toFixed(1)}%`
}

/**
 * 날짜 포맷팅 함수
 *
 * @function formatDate
 * @description 날짜를 지정된 형식으로 포맷팅
 *
 * @param {Date} date - 포맷팅할 날짜
 * @param {string} [format='short'] - 포맷 스타일 ('short', 'long', 'year-month', 'time')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'long' | 'year-month' | 'time' = 'short',
): string => {
  if (format === 'short') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } else if (format === 'long') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } else if (format === 'year-month') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
    }).format(date)
  } else {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
}

/**
 * 도메인 포맷팅 함수
 *
 * @function formatDomain
 * @description URL에서 도메인 부분만 추출하여 포맷팅
 *
 * @param {string} url - 포맷팅할 URL
 * @param {boolean} [includeSubdomain=true] - 서브도메인 포함 여부
 * @returns {string} 포맷팅된 도메인 문자열
 */
export const formatDomain = (url: string, includeSubdomain = true): string => {
  try {
    const { hostname } = new URL(url)

    if (!includeSubdomain) {
      const parts = hostname.split('.')
      if (parts.length > 2) {
        return parts.slice(-2).join('.')
      }
    }

    return hostname
  } catch {
    return url
  }
}
