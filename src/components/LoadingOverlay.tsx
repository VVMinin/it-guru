import { useEffect, useState } from 'react';
import { Progress } from 'antd';

export const LoadingOverlay = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 95) return 95;
        const increment = Math.max(1, Math.floor((95 - prev) / 8));
        return Math.min(prev + increment, 95);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <Progress
        type="circle"
        percent={percent}
        strokeColor="#242EDB"
        size={80}
        format={(p) => `${p}%`}
      />
    </div>
  );
};
