/**
 * Google Search Console API 연동 라우트
 */
import { JWT } from "google-auth-library";
import { google } from "googleapis";

/**
 * GSC API를 호출하여 검색 통계 데이터를 가져옴
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteUrl = searchParams.get('siteUrl');
    
    if (!siteUrl) {
      return new Response(JSON.stringify({ 
        error: '사이트 URL이 필요합니다.' 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    
    // 기본 날짜 범위 설정 (최근 30일)
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
    
    // JWT를 이용한 서비스 계정 인증
    const auth = new JWT({
      email: process.env.GCP_CLIENT_EMAIL,
      key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    // Search Console API 초기화
    const webmasters = google.webmasters({ version: "v3", auth });

    // 검색 분석 데이터 요청
    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["date"],
        rowLimit: 30, // 최대 30개 행
      },
    });

    return new Response(JSON.stringify(response.data), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Google Search Console API 오류:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "내부 서버 오류" 
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

/**
 * 커스텀 GSC API 요청 처리
 */
export async function POST(request: Request) {
  try {
    const { siteUrl, startDate, endDate, dimensions = ["date"], rowLimit = 30 } = await request.json();
    
    if (!siteUrl || !startDate || !endDate) {
      return new Response(JSON.stringify({ 
        error: '필수 파라미터가 누락되었습니다. (siteUrl, startDate, endDate)' 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // JWT를 이용한 서비스 계정 인증
    const auth = new JWT({
      email: process.env.GCP_CLIENT_EMAIL,
      key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    // Search Console API 초기화
    const webmasters = google.webmasters({ version: "v3", auth });

    // 검색 분석 데이터 요청
    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions,
        rowLimit,
      },
    });

    return new Response(JSON.stringify(response.data), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Google Search Console API 오류:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "내부 서버 오류" 
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}