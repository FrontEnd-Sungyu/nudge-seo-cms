/**
 * 목업 데이터 모음
 * @description 퍼블리싱 및 개발 테스트용 목업 데이터
 */

/**
 * 서비스(웹사이트) 목업 데이터
 */
export const mockServices = [
  {
    id: '1',
    name: '모네플 ~~~',
    url: 'https://example.com',
    iconUrl: 'https://via.placeholder.com/32',
    verified: true,
    summary: {
      clicks: 15240,
      impressions: 243600,
      ctr: 6.25,
      position: 18.4,
      indexed: 342,
      notIndexed: 27,
      crawlRequests: 4230,
      responseTime: 230,
    },
    createdAt: new Date('2023-07-15'),
    lastUpdatedAt: new Date('2025-05-15'),
  },
  {
    id: '2',
    name: '링커리어~ ~~',
    url: 'https://shop.example.com',
    iconUrl: 'https://via.placeholder.com/32/4ade80',
    verified: true,
    summary: {
      clicks: 8735,
      impressions: 98420,
      ctr: 8.87,
      position: 12.1,
      indexed: 1245,
      notIndexed: 42,
      crawlRequests: 9780,
      responseTime: 180,
    },
    createdAt: new Date('2023-09-20'),
    lastUpdatedAt: new Date('2025-05-14'),
  },
  {
    id: '3',
    name: '지니어트 ~~ ',
    url: 'https://blog.example.com',
    iconUrl: 'https://via.placeholder.com/32/a78bfa',
    verified: true,
    summary: {
      clicks: 3560,
      impressions: 45670,
      ctr: 7.79,
      position: 8.6,
      indexed: 542,
      notIndexed: 12,
      crawlRequests: 2340,
      responseTime: 150,
    },
    createdAt: new Date('2024-01-10'),
    lastUpdatedAt: new Date('2025-05-15'),
  },
  {
    id: '4',
    name: '언니의 파우치',
    url: 'https://support.example.com',
    iconUrl: 'https://via.placeholder.com/32/f87171',
    verified: true,
    summary: {
      clicks: 2250,
      impressions: 18900,
      ctr: 11.9,
      position: 5.2,
      indexed: 210,
      notIndexed: 8,
      crawlRequests: 1520,
      responseTime: 160,
    },
    createdAt: new Date('2024-02-05'),
    lastUpdatedAt: new Date('2025-05-12'),
  },
  {
    id: '5',
    name: '팀워크 ~~~',
    url: 'https://careers.example.com',
    iconUrl: 'https://via.placeholder.com/32/fbbf24',
    verified: true,
    summary: {
      clicks: 1870,
      impressions: 21300,
      ctr: 8.78,
      position: 7.4,
      indexed: 95,
      notIndexed: 3,
      crawlRequests: 980,
      responseTime: 120,
    },
    createdAt: new Date('2024-03-12'),
    lastUpdatedAt: new Date('2025-05-10'),
  },
]

/**
 * 증감률 계산 헬퍼 함수
 */
export const getRandomGrowth = () => {
  const isPositive = Math.random() > 0.3
  return isPositive ? Math.random() * 20 : -Math.random() * 15
}

/**
 * 각 서비스의 KPI 증감률 생성
 */
export const getServiceGrowth = () => {
  return {
    clicks: getRandomGrowth(),
    impressions: getRandomGrowth(),
    ctr: getRandomGrowth(),
    position: -getRandomGrowth(), // 포지션은 감소할수록 좋음
    indexed: getRandomGrowth(),
    notIndexed: -getRandomGrowth(), // 미색인은 감소할수록 좋음
    crawlRequests: getRandomGrowth(),
    responseTime: -getRandomGrowth(), // 응답 시간은 감소할수록 좋음
  }
}