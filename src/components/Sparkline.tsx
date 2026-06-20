interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({ data, width = 80, height = 30, color = '#10B981' }: SparklineProps) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = isPositive ? '#10B981' : '#EF4444';
  const fillColor = isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const fillPts = `0,${height} ${pts.join(' ')} ${width},${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polygon points={fillPts} fill={fillColor} />
      <polyline points={pts.join(' ')} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
