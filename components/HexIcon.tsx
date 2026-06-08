import React, { memo } from 'react';
import Svg, { Polygon, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface HexIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
  glowing?: boolean;
  children?: React.ReactNode;
  label?: string;
}

export const HexIcon = memo(({
  size = 56,
  color = COLORS.forge,
  filled = false,
  glowing = false,
}: HexIconProps) => {
  const points = getHexPoints(size / 2 - 2, size / 2, size / 2);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0.05" />
        </LinearGradient>
      </Defs>
      <Polygon
        points={points}
        fill={filled ? color : glowing ? `url(#hexGrad)` : 'transparent'}
        stroke={color}
        strokeWidth={glowing ? 1.5 : 1}
        strokeOpacity={glowing ? 1 : 0.7}
      />
    </Svg>
  );
});

function getHexPoints(r: number, cx: number, cy: number): string {
  const angles = [30, 90, 150, 210, 270, 330];
  return angles
    .map(a => {
      const rad = (Math.PI / 180) * a;
      return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
    })
    .join(' ');
}
