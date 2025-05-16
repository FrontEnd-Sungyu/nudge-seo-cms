/**
 * 앱의 루트 컴포넌트
 * 
 * @component App
 * @description 애플리케이션의 진입점 컴포넌트
 */
import { useState } from 'react';
import DashboardPage from './pages/dashboard';
import ServiceDetailPage from './pages/services/show';

function App() {
  // 선택된 서비스 ID (null이면 대시보드 표시)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // 서비스 선택 핸들러
  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
  };
  
  // 대시보드로 돌아가기
  const handleBackToDashboard = () => {
    setSelectedServiceId(null);
  };
  
  return (
    <>
      {selectedServiceId ? (
        <ServiceDetailPage initialServiceId={selectedServiceId} />
      ) : (
        <DashboardPage onServiceSelect={handleServiceSelect} />
      )}
    </>
  );
}

export default App
