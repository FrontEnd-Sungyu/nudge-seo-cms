/**
 * 앱의 루트 컴포넌트
 * 
 * @component App
 * @description 애플리케이션의 진입점 컴포넌트
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;