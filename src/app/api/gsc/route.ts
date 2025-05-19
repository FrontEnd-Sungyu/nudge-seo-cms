/**
 * Google Search Console API 연동 라우트
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');
  
  // 실제 구현에서는 Google Search Console API 호출
  return new Response(JSON.stringify({ 
    message: 'Google Search Console API 데이터',
    serviceId
  }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // 실제 구현에서는 GSC API 쿼리 처리
  return new Response(JSON.stringify({ 
    message: 'Google Search Console 데이터 요청 성공',
    query: data 
  }), {
    headers: { 'content-type': 'application/json' },
  });
}