/**
 * API 인증 라우트
 */

export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello from API Route' }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // 실제 구현에서는 인증 로직 처리
  return new Response(JSON.stringify({ message: 'Auth endpoint', data }), {
    headers: { 'content-type': 'application/json' },
  });
}