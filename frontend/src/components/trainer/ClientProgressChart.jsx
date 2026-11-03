import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, SIZES } from '../../constants/theme';
import { INITIAL_CLIENT_PROGRESS_CHART } from '../../data/mockData';

export default function ClientProgressChart() {
  const chartHeight = 150;
  const chartWidth = 320;
  const paddingX = 25;
  const paddingY = 20;

  // Chart coordinates mapping (W1: 38, W2: 46, W3: 68, W4: 84)
  const data = INITIAL_CLIENT_PROGRESS_CHART;
  const xStep = (chartWidth - paddingX * 2) / (data.length - 1);

  const points = data.map((d, index) => {
    const x = paddingX + index * xStep;
    const y = chartHeight - paddingY - (d.progress / 100) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Create smooth bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  // Create area closed path for gradient fill
  const areaPathD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <View style={styles.container}>
      {/* Chart Header matching Panel 2 */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Client Progress</Text>
          <Text style={styles.subtitle}>Avg. progress this month</Text>
        </View>

        <View style={styles.trendBadge}>
          <Text style={styles.trendText}>↑ +18%</Text>
          <Text style={styles.trendSub}> vs last month</Text>
        </View>
      </View>

      {/* SVG Chart with neon gradient fill */}
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id="greenGlowGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8BFF36" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#8BFF36" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#27272A" strokeWidth="1" />
          <Line x1={paddingX} y1={(chartHeight - paddingY) / 2} x2={chartWidth - paddingX} y2={(chartHeight - paddingY) / 2} stroke="#1C1C1F" strokeWidth="1" strokeDasharray="4, 4" />

          {/* Gradient area */}
          <Path d={areaPathD} fill="url(#greenGlowGradient)" />

          {/* Glowing Stroke line */}
          <Path d={pathD} fill="none" stroke="#8BFF36" strokeWidth="3" />

          {/* Data points */}
          {points.map((pt, i) => (
            <React.Fragment key={i}>
              <Circle cx={pt.x} cy={pt.y} r="4" fill="#050505" stroke="#8BFF36" strokeWidth="2.5" />
              <SvgText
                x={pt.x}
                y={chartHeight - 4}
                fontSize="10"
                fill="#71717A"
                textAnchor="middle"
                fontWeight="600"
              >
                {pt.week}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenMuted,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  trendText: {
    color: COLORS.primaryGreen,
    fontWeight: '700',
    fontSize: SIZES.fontXs,
  },
  trendSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

