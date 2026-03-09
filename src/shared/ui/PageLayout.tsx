import type { ReactNode } from 'react';
import { LoadingOverlay } from './LoadingOverlay';

interface PageLayoutProps {
  loading?: boolean;
  children: ReactNode;
}

export const PageLayout = ({ loading, children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <LoadingOverlay />}
      {children}
    </div>
  );
};
