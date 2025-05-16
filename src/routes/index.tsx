import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/dashboard';
import ServiceDetailPage from '../pages/services/show';

/**
 * 애플리케이션 라우터 설정
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/services/:serviceId',
    element: <ServiceDetailPage />,
  },
]);