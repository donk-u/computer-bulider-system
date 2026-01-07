# 性能可视化系统使用指南

完整的性能可视化系统，包括雷达图、柱状图和性能描述生成。

## 目录

- [功能概述](#功能概述)
- [快速开始](#快速开始)
- [组件介绍](#组件介绍)
- [API 参考](#api-参考)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 功能概述

### 1. 雷达图（五维性能）

显示配置在五个维度的性能表现：
- 游戏性能
- 生产力性能
- 工作站性能
- 性价比
- 能效

**特点**：
- SVG 自定义绘制
- 响应式设计
- 紧凑型版本
- 等级徽章（S/A/B/C/D/F）

### 2. 柱状图（组件贡献度）

显示各组件对整体性能的贡献：
- 贡献度百分比
- 组件分数
- 主要贡献者
- 统计信息

**特点**：
- 基于 Recharts
- 自定义颜色
- Tooltip 支持
- 紧凑型版本

### 3. 性能描述生成

自动生成性能分析文字：
- 性能等级评定
- 优劣势分析
- 适用场景推荐
- 优化建议

**特点**：
- 智能评分
- 模板化描述
- 多维度分析
- 详细报告

## 快速开始

### 1. 访问示例页面

```bash
npm run dev
# 访问 http://localhost:3000/examples/performance-visualization-demo
```

### 2. 使用综合可视化组件

```tsx
import { PerformanceVisualization } from '@/components/performance/performance-visualization';

<PerformanceVisualization
  scores={systemScores}
  metrics={performanceMetrics}
  contributions={componentContributions}
  totalPrice={1335}
/>
```

### 3. 使用独立图表组件

```tsx
import { PerformanceRadarChart } from '@/components/charts';
import { ComponentContributionBarChart } from '@/components/charts';

// 雷达图
<PerformanceRadarChart
  data={[
    { category: '游戏', value: 75 },
    { category: '生产力', value: 70 },
    { category: '工作站', value: 68 },
    { category: '性价比', value: 78 },
    { category: '能效', value: 80 },
  ]}
  size={300}
/>

// 柱状图
<ComponentContributionBarChart
  data={[
    { component: 'CPU', contribution: 25, score: 75 },
    { component: 'GPU', contribution: 35, score: 85 },
    { component: 'RAM', contribution: 20, score: 70 },
  ]}
  height={300}
/>
```

### 4. 生成性能描述

```tsx
import { quickGeneratePerformanceDescription } from '@/lib/performance';

const description = quickGeneratePerformanceDescription(
  scores,
  metrics,
  contributions
);

console.log('性能等级:', description.overall.grade);
console.log('优势:', description.characteristics.strengths);
console.log('劣势:', description.characteristics.weaknesses);
console.log('适用场景:', description.characteristics.useCases);
console.log('总结:', description.summary);
```

## 组件介绍

### PerformanceVisualization

综合性能可视化组件，整合所有图表和描述。

```tsx
interface PerformanceVisualizationProps {
  scores: SystemScores;                    // 五项评分
  metrics: ComponentPerformanceMetrics;     // 组件性能指标
  contributions: ComponentContributionDescription[];  // 组件贡献
  totalPrice?: number;                     // 总价格
  compact?: boolean;                       // 紧凑模式
}
```

### PerformanceRadarChart

雷达图组件，显示五维性能。

```tsx
interface RadarChartProps {
  data: Array<{ category: string; value: number }>;
  maxValue?: number;          // 最大值（默认 100）
  size?: number;              // 图表大小（默认 300）
  colors?: {                 // 自定义颜色
    fill: string;
    stroke: string;
    axis: string;
    label: string;
  };
  showLabels?: boolean;      // 显示标签（默认 true）
  showGrid?: boolean;        // 显示网格（默认 true）
}
```

### ComponentContributionBarChart

组件贡献度柱状图。

```tsx
interface ComponentBarChartProps {
  data: Array<{
    component: string;
    contribution: number;
    score: number;
    color?: string;
  }>;
  maxValue?: number;         // 最大值（默认 100）
  orientation?: 'vertical' | 'horizontal';  // 方向
  showLegend?: boolean;      // 显示图例（默认 true）
  showTooltip?: boolean;     // 显示 Tooltip（默认 true）
  height?: number;           // 高度（默认 300）
}
```

### PerformanceDescriptor

性能描述生成器类。

```typescript
class PerformanceDescriptor {
  generateDescription(
    scores: SystemScores,
    metrics: ComponentPerformanceMetrics,
    contributions: ComponentContributionDescription[]
  ): PerformanceDescription;
}
```

## API 参考

### SystemScores

系统五项评分。

```typescript
interface SystemScores {
  gaming: number;           // 游戏性能 0-100
  productivity: number;     // 生产力 0-100
  workstation: number;      // 工作站 0-100
  value: number;           // 性价比 0-100
  efficiency: number;      // 能效 0-100
}
```

### ComponentPerformanceMetrics

组件性能指标。

```typescript
interface ComponentPerformanceMetrics {
  cpu?: {
    singleCore: number;
    multiCore: number;
    gamingScore: number;
    productivityScore: number;
  };
  gpu?: {
    computeScore: number;
    gamingScore: number;
    rayTracingScore: number;
    vram: number;
  };
  ram?: {
    capacity: number;       // GB
    speed: number;         // MHz
    type: 'DDR4' | 'DDR5';
    bandwidth: number;
  };
  storage?: {
    type: 'NVMe' | 'SSD' | 'HDD';
    capacity: number;       // GB
    readSpeed: number;     // MB/s
    writeSpeed: number;    // MB/s
  };
}
```

### ComponentContributionDescription

组件贡献描述。

```typescript
interface ComponentContributionDescription {
  component: string;        // 组件名称
  contribution: number;     // 贡献度 0-100
  role: string;           // 角色（核心/重要/支撑/辅助）
  impact: string;          // 影响描述
}
```

### PerformanceDescription

完整性能描述。

```typescript
interface PerformanceDescription {
  overall: PerformanceGrade;           // 整体等级
  characteristics: PerformanceCharacteristics;  // 性能特点
  scenarios: ScenarioDescription[];   // 场景描述
  componentContributions: ComponentContributionDescription[];  // 组件贡献
  summary: string;                   // 总结
  detailedAnalysis: string;           // 详细分析
}
```

## 使用示例

### 示例 1: 基础使用

```tsx
'use client';

import { PerformanceVisualization } from '@/components/performance/performance-visualization';
import { useBuilderStore } from '@/lib/store/builder-store';
import { generatePerformanceReport } from '@/lib/performance-calculator';

export default function PerformancePage() {
  const { selectedComponents, totalPrice } = useBuilderStore();

  // 计算性能
  const performanceReport = generatePerformanceReport(selectedComponents, totalPrice);

  return (
    <div>
      <h1>性能可视化</h1>
      <PerformanceVisualization
        scores={{
          gaming: performanceReport.scenarioPerformance[0]?.score || 0,
          productivity: performanceReport.scenarioPerformance[3]?.score || 0,
          workstation: performanceReport.scenarioPerformance[4]?.score || 0,
          value: performanceReport.pricePerformanceRatio || 0,
          efficiency: performanceReport.efficiencyScore || 0,
        }}
        metrics={performanceReport.componentPerformanceMetrics}
        contributions={performanceReport.componentContributions}
        totalPrice={totalPrice}
      />
    </div>
  );
}
```

### 示例 2: 独立雷达图

```tsx
import { PerformanceRadarChart } from '@/components/charts';

function MyComponent() {
  const scores = {
    gaming: 85,
    productivity: 75,
    workstation: 70,
    value: 80,
    efficiency: 75,
  };

  const data = Object.entries(scores).map(([key, value]) => ({
    category: key,
    value,
  }));

  return (
    <PerformanceRadarChart
      data={data}
      size={350}
      colors={{
        fill: 'rgba(16, 185, 129, 0.3)',
        stroke: 'rgb(16, 185, 129)',
        axis: 'rgba(148, 163, 184, 0.5)',
        label: 'rgb(71, 85, 105)',
      }}
    />
  );
}
```

### 示例 3: 自定义柱状图

```tsx
import { ComponentContributionBarChart } from '@/components/charts';

function MyComponent() {
  const contributions = [
    { component: 'CPU', contribution: 30, score: 85, color: 'rgb(59, 130, 246)' },
    { component: 'GPU', contribution: 40, score: 90, color: 'rgb(16, 185, 129)' },
    { component: 'RAM', contribution: 20, score: 75, color: 'rgb(245, 158, 11)' },
    { component: 'Storage', contribution: 10, score: 70, color: 'rgb(239, 68, 68)' },
  ];

  return (
    <ComponentContributionBarChart
      data={contributions}
      orientation="horizontal"
      height={250}
      showLegend={false}
    />
  );
}
```

### 示例 4: 生成性能描述

```tsx
import { quickGeneratePerformanceDescription } from '@/lib/performance';

async function generateDescription() {
  const scores = {
    gaming: 85,
    productivity: 75,
    workstation: 70,
    value: 80,
    efficiency: 75,
  };

  const metrics = {
    cpu: {
      singleCore: 2000,
      multiCore: 15000,
      gamingScore: 10000,
      productivityScore: 14000,
    },
    gpu: {
      computeScore: 20000,
      gamingScore: 25000,
      rayTracingScore: 20000,
      vram: 16,
    },
  };

  const contributions = [
    { component: 'CPU', contribution: 25, role: '重要组件', impact: '重要贡献' },
    { component: 'GPU', contribution: 40, role: '核心组件', impact: '主要性能来源' },
    { component: 'RAM', contribution: 20, role: '支撑组件', impact: '一般影响' },
    { component: 'Storage', contribution: 15, role: '辅助组件', impact: '一般影响' },
  ];

  const description = quickGeneratePerformanceDescription(scores, metrics, contributions);

  console.log('等级:', description.overall.grade);          // A
  console.log('标题:', description.overall.title);          // 高端配置
  console.log('优势:', description.characteristics.strengths);
  console.log('劣势:', description.characteristics.weaknesses);
  console.log('适用场景:', description.characteristics.useCases);
  console.log('总结:', description.summary);

  return description;
}
```

### 示例 5: 侧边栏紧凑型展示

```tsx
import { CompactRadarChart } from '@/components/charts';
import { CompactComponentBarChart } from '@/components/charts';

function Sidebar() {
  return (
    <aside className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">性能概览</h3>
        <CompactRadarChart
          data={[
            { category: '游戏', value: 85 },
            { category: '生产力', value: 75 },
            { category: '工作站', value: 70 },
            { category: '性价比', value: 80 },
            { category: '能效', value: 75 },
          ]}
          size={160}
        />
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">组件贡献</h3>
        <CompactComponentBarChart
          data={[
            { component: 'CPU', contribution: 25 },
            { component: 'GPU', contribution: 40 },
            { component: 'RAM', contribution: 20 },
          ]}
          height={150}
        />
      </div>
    </aside>
  );
}
```

## 最佳实践

### 1. 数据准备

```tsx
// 从 Builder Store 获取组件
const { selectedComponents, totalPrice } = useBuilderStore();

// 计算性能分数
const performanceReport = generatePerformanceReport(selectedComponents, totalPrice);

// 准备五项评分
const scores: SystemScores = {
  gaming: calculateGamingScore(performanceReport),
  productivity: calculateProductivityScore(performanceReport),
  workstation: calculateWorkstationScore(performanceReport),
  value: calculateValueScore(performanceReport, totalPrice),
  efficiency: calculateEfficiencyScore(performanceReport),
};

// 准备组件贡献
const contributions: ComponentContributionDescription[] = Object.entries(selectedComponents).map(
  ([type, component]) => ({
    component: type,
    contribution: calculateContribution(type, component, performanceReport),
    role: getComponentRole(type),
    impact: getContributionImpact(type),
  })
);
```

### 2. 响应式设计

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <PerformanceRadarChart data={data} size={300} />
  <ComponentContributionBarChart data={data} height={300} />
</div>
```

### 3. 自定义颜色

```tsx
<PerformanceRadarChart
  data={data}
  colors={{
    fill: 'rgba(139, 92, 246, 0.3)',    // 紫色填充
    stroke: 'rgb(139, 92, 246)',         // 紫色边框
    axis: 'rgba(148, 163, 184, 0.5)',   // 灰色轴线
    label: 'rgb(71, 85, 105)',           // 深灰色标签
  }}
/>
```

### 4. 性能优化

```tsx
// 使用 useMemo 缓存数据
const radarData = useMemo(() => {
  return Object.entries(scores).map(([key, value]) => ({
    category: key,
    value,
  }));
}, [scores]);

const barData = useMemo(() => {
  return contributions.map(item => ({
    component: item.component,
    contribution: item.contribution,
    score: metrics[item.component.toLowerCase()] || 0,
  }));
}, [contributions, metrics]);
```

## 常见问题

### Q1: 如何自定义雷达图的五项评分？

```tsx
const customScores = {
  gaming: 80,
  productivity: 70,
  workstation: 65,
  value: 75,
  efficiency: 72,
};

const data = Object.entries(customScores).map(([key, value]) => ({
  category: key,
  value,
}));

<PerformanceRadarChart data={data} />
```

### Q2: 如何调整柱状图的排序？

```tsx
// 按贡献度排序
const sortedData = [...data].sort((a, b) => b.contribution - a.contribution);

<ComponentContributionBarChart data={sortedData} />
```

### Q3: 如何在性能描述中添加自定义内容？

```tsx
const description = quickGeneratePerformanceDescription(scores, metrics, contributions);

// 添加自定义内容
const customDescription = {
  ...description,
  summary: description.summary + ' 该配置特别适合游戏玩家。',
};
```

### Q4: 如何导出图表为图片？

可以使用 html2canvas 或类似库：

```tsx
import html2canvas from 'html2canvas';

async function exportChart(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png');
    // 下载或上传图片
  }
}
```

## 相关文档

- [性能计算器指南](./PERFORMANCE_GUIDE.md)
- [综合跑分指南](./COMPOSITE_BENCHMARK_GUIDE.md)
- [瓶颈分析指南](./BOTTLENECK_GUIDE.md)
- [Builder Store 指南](./STORE_GUIDE.md)

## 总结

性能可视化系统提供：

✅ **雷达图** - 五维性能可视化
✅ **柱状图** - 组件贡献度分析
✅ **性能描述** - 智能文字描述
✅ **综合展示** - 一站式可视化
✅ **紧凑型** - 适合侧边栏
✅ **响应式** - 自适应布局
✅ **自定义** - 颜色和样式
✅ **类型安全** - 完整 TypeScript 支持
✅ **详细文档** - 丰富示例和指南
