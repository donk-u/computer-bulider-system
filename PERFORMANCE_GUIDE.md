# 性能预览面板使用指南

性能预览面板提供实时性能计算、场景分析和瓶颈诊断，帮助用户了解配置的实际性能表现。

## 📁 文件结构

```
types/
└── performance.ts              # 性能类型定义

lib/
└── performance-calculator.ts   # 性能计算器（18KB）

components/performance/
└── performance-preview.tsx     # 性能预览面板组件

app/examples/
└── performance-preview-demo.tsx # 完整示例页面
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { PerformancePreview } from '@/components/performance/performance-preview';
import { useBuilderStore } from '@/lib/store/builder-store';

function BuilderPage() {
  const { selectedComponents } = useBuilderStore();
  
  return (
    <div>
      {/* 其他内容 */}
      <PerformancePreview />
    </div>
  );
}
```

### 2. 手动计算性能

```tsx
import { generatePerformanceReport } from '@/lib/performance-calculator';
import { useBuilderStore } from '@/lib/store/builder-store';

function MyComponent() {
  const { selectedComponents, totalPrice } = useBuilderStore();
  
  const report = generatePerformanceReport(selectedComponents, totalPrice);
  
  return (
    <div>
      <h1>性能评分: {report.overallScore}</h1>
      <p>等级: {report.overallGrade}</p>
      <p>瓶颈: {report.bottleneck.message}</p>
    </div>
  );
}
```

## 📊 性能评分系统

### 综合评分算法

```typescript
// 1. 标准化各组件分数（转换为 0-100）
normalizedCpu = cpuScore / 65000 * 100
normalizedGpu = gpuScore / 36000 * 100
normalizedRam = ramScore
normalizedStorage = storageScore

// 2. 加权平均
overallScore = normalizedCpu * 0.25 + 
               normalizedGpu * 0.45 + 
               normalizedRam * 0.20 + 
               normalizedStorage * 0.10
```

### 评分等级

| 评分范围 | 等级 | 颜色 | 说明 |
|---------|------|------|------|
| 95-100  | S    | 紫色 | 极致性能 |
| 85-94   | A    | 绿色 | 高端配置 |
| 70-84   | B    | 蓝色 | 良好配置 |
| 50-69   | C    | 黄色 | 中端配置 |
| 30-49   | D    | 橙色 | 入门配置 |
| 0-29    | F    | 红色 | 性能不足 |

### 场景权重

不同使用场景的组件权重不同：

| 场景 | CPU | GPU | 内存 | 存储 |
|-----|-----|-----|------|------|
| 4K 游戏 | 30% | 60% | 10% | 0% |
| 1440p 游戏 | 35% | 50% | 15% | 0% |
| 1080p 游戏 | 40% | 40% | 20% | 0% |
| 办公生产力 | 50% | 0% | 30% | 20% |
| 内容创作 | 35% | 35% | 20% | 10% |
| 游戏直播 | 45% | 35% | 20% | 0% |

## 🔧 核心功能

### 1. 组件性能基准

基于各组件的实际规格计算性能分数：

```typescript
// CPU 性能（基于 PassMark 基准）
getCpuPerformanceScore(component) -> number

// GPU 性能（基于 3DMark Time Spy GPU 基准）
getGpuPerformanceScore(component) -> number

// 内存性能（基于类型和频率）
getRamPerformanceScore(component) -> number

// 存储性能（基于类型和速度）
getStoragePerformanceScore(component) -> number
```

### 2. 场景性能预测

计算不同使用场景下的性能表现：

```typescript
// 6 个场景
- gaming_4k      // 4K 游戏
- gaming_1440p   // 1440p 游戏
- gaming_1080p   // 1080p 游戏
- productivity   // 办公生产力
- creator        // 内容创作
- streaming      // 游戏直播
```

**输出内容**：
- 场景评分（0-100）
- 瓶颈分析
- 优化建议
- FPS 预估（游戏场景）

### 3. 瓶颈分析

识别配置中的性能瓶颈：

```typescript
analyzeBottleneck(cpuScore, gpuScore, ramScore, storageScore) -> {
  type: 'cpu' | 'gpu' | 'ram' | 'storage' | 'balanced',
  severity: 'critical' | 'moderate' | 'minor' | 'none',
  component: string,
  message: string,
  impact: number,
  suggestion: string
}
```

**严重级别**：
- `critical`: 严重影响（评分 < 40）
- `moderate`: 中等影响（评分 40-60）
- `minor`: 轻微影响（评分 60-80）
- `none`: 无明显瓶颈（评分 ≥ 80）

### 4. 性能报告

生成完整的性能分析报告：

```typescript
generatePerformanceReport(components, totalPrice) -> {
  overallScore: number,
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F',
  benchmarks: {
    cpuScore: number,
    gpuScore: number,
    ramScore: number,
    storageScore: number,
    overallScore: number
  },
  scenarios: ScenarioPerformance[],
  bottleneck: PerformanceBottleneck,
  summary: {
    gaming: string,
    productivity: string,
    creator: string,
    upgradePath: string[]
  },
  estimatedPrice: number,
  pricePerformanceRatio: number
}
```

## 📐 基准数据库

### CPU 基准（PassMark）

| 型号 | 分数 | 级别 | 类别 |
|-----|------|------|------|
| i9-14900K | 56000 | 旗舰 | 极致性能 |
| i7-14700K | 45000 | 高端 | 高性能 |
| i5-14600K | 35000 | 中高端 | 主流 |
| Ryzen 9 7950X | 65000 | 旗舰 | 极致性能 |
| Ryzen 7 7800X3D | 58000 | 旗舰 | 极致性能 |
| Ryzen 5 7600X | 32000 | 中高端 | 主流 |

### GPU 基准（3DMark Time Spy GPU）

| 型号 | 分数 | 级别 | 类别 |
|-----|------|------|------|
| RTX 4090 | 36000 | 旗舰 | 极致性能 |
| RTX 4080 Super | 29000 | 旗舰 | 极致性能 |
| RTX 4070 Ti | 23000 | 高端 | 高性能 |
| RTX 4060 | 12000 | 中端 | 主流 |
| RX 7900 XTX | 30000 | 旗舰 | 极致性能 |
| RX 7800 XT | 19000 | 中高端 | 主流 |

### 内存基准

| 规格 | 分数 | 级别 | 类别 |
|-----|------|------|------|
| DDR5-8000 | 100 | 旗舰 | 极致性能 |
| DDR5-6400 | 90 | 高端 | 高性能 |
| DDR5-6000 | 85 | 中高端 | 高性能 |
| DDR4-3600 | 70 | 中端 | 主流 |
| DDR4-3200 | 65 | 中端 | 主流 |

### 存储基准

| 规格 | 分数 | 级别 | 类别 |
|-----|------|------|------|
| PCIe 5.0 NVMe | 100 | 旗舰 | 极致性能 |
| PCIe 4.0 NVMe (10000+) | 95 | 旗舰 | 极致性能 |
| PCIe 4.0 NVMe (7000) | 90 | 高端 | 高性能 |
| PCIe 4.0 NVMe (5000) | 80 | 中高端 | 主流 |
| SATA SSD | 45 | 中端 | 办公 |
| HDD | 20 | 入门 | 存储 |

## 🎨 组件 API

### PerformancePreview

主组件，显示完整的性能预览面板。

```tsx
<PerformancePreview />
```

**特性**：
- ✅ 自动从 Builder Store 读取组件
- ✅ 实时计算性能评分
- ✅ 显示组件基准分数
- ✅ 6 个场景性能分析
- ✅ 瓶颈分析
- ✅ 性能总结
- ✅ FPS 预估（游戏场景）
- ✅ 响应式布局

## 🎯 使用场景

### 场景 1：集成到配置器

```tsx
import { BuilderLayout } from '@/components/layouts/builder-layout';
import { PerformancePreview } from '@/components/performance/performance-preview';

export default function BuilderPage() {
  return (
    <BuilderLayout>
      {/* 左侧：组件选择 */}
      {/* 中间：配置预览 */}
      
      {/* 右侧：性能预览 */}
      <div className="lg:col-span-1">
        <PerformancePreview />
      </div>
    </BuilderLayout>
  );
}
```

### 场景 2：自定义性能显示

```tsx
import { generatePerformanceReport } from '@/lib/performance-calculator';

function CustomPerformanceDisplay() {
  const { selectedComponents, totalPrice } = useBuilderStore();
  const report = generatePerformanceReport(selectedComponents, totalPrice);
  
  return (
    <div className="space-y-4">
      {/* 自定义评分显示 */}
      <div className="text-center">
        <div className="text-6xl font-bold text-blue-500">
          {report.overallScore}
        </div>
        <div className="text-2xl text-gray-400">
          {report.overallGrade} 级
        </div>
      </div>
      
      {/* 自定义图表 */}
      <div>
        <h3>场景性能</h3>
        {report.scenarios.map(scenario => (
          <div key={scenario.name}>
            {scenario.displayName}: {scenario.score}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 场景 3：实时性能监控

```tsx
import { useEffect } from 'react';
import { subscribeToBuilderStore } from '@/lib/store/builder-store';

function PerformanceMonitor() {
  useEffect(() => {
    const unsubscribe = subscribeToBuilderStore((state) => {
      // 组件变化时重新计算性能
      const report = generatePerformanceReport(
        state.selectedComponents,
        state.totalPrice
      );
      
      console.log('性能评分:', report.overallScore);
      console.log('瓶颈:', report.bottleneck.message);
    });
    
    return unsubscribe;
  }, []);
  
  return null;
}
```

## 🔍 性能优化建议

### 1. 提升 CPU 性能

```typescript
// 当前瓶颈
{
  type: 'cpu',
  severity: 'critical',
  suggestion: '升级到更高规格的处理器（建议至少 i5/Ryzen 5 级别）'
}
```

**优化建议**：
- 选择多核高频处理器
- 优先考虑支持超频的型号
- 关注 PassMark 基准分

### 2. 提升 GPU 性能

```typescript
// 当前瓶颈
{
  type: 'gpu',
  severity: 'critical',
  suggestion: '升级到中高端显卡以获得更好的游戏性能'
}
```

**优化建议**：
- 根据目标分辨率选择显卡
- 1080p: RTX 3060 / RX 6600 XT
- 1440p: RTX 4070 / RX 7800 XT
- 4K: RTX 4080 / RX 7900 XTX

### 3. 提升内存性能

```typescript
// 当前瓶颈
{
  type: 'ram',
  severity: 'moderate',
  suggestion: '建议至少使用 32GB DDR4-3200 或 DDR5-6000'
}
```

**优化建议**：
- 容量至少 32GB
- 频率越高越好
- 双通道配置

### 4. 提升存储性能

```typescript
// 当前瓶颈
{
  type: 'storage',
  severity: 'minor',
  suggestion: '升级到 PCIe 4.0 NVMe SSD 以获得更快的加载速度'
}
```

**优化建议**：
- 优先使用 NVMe SSD
- PCIe 4.0 推荐读取速度 ≥ 5000 MB/s
- 系统盘容量 ≥ 1TB

## 📈 性能对比

### 预设配置对比

| 配置 | 评分 | 等级 | 价格 | 性价比 |
|-----|------|------|------|--------|
| 入门级 | 45 | C | $506 | $11.2/分 |
| 中端 | 62 | B | $956 | $15.4/分 |
| 高端 | 78 | A | $1,956 | $25.1/分 |
| 旗舰 | 95 | S | $3,296 | $34.7/分 |

### 场景性能对比

| 场景 | 入门级 | 中端 | 高端 | 旗舰 |
|-----|--------|------|------|------|
| 4K 游戏 | 38 | 55 | 72 | 95 |
| 1440p 游戏 | 48 | 65 | 80 | 98 |
| 1080p 游戏 | 55 | 70 | 85 | 99 |
| 办公生产力 | 65 | 75 | 88 | 95 |
| 内容创作 | 42 | 58 | 75 | 95 |
| 游戏直播 | 45 | 62 | 78 | 95 |

## 🎓 最佳实践

### 1. 性能平衡

```typescript
// 目标：均衡配置
// CPU 分数和 GPU 分数差距不应超过 30%

const cpuScore = getCpuPerformanceScore(cpu);
const gpuScore = getGpuPerformanceScore(gpu);

if (Math.abs(cpuScore - gpuScore) > 15000) {
  // 性能不平衡
  console.warn('CPU 和 GPU 性能差距过大');
}
```

### 2. 预算优化

```typescript
// 计算性价比
const pricePerformanceRatio = totalPrice / overallScore;

// 性价比阈值
if (pricePerformanceRatio > 30) {
  // 性价比低
  console.warn('配置性价比偏低');
}
```

### 3. 场景匹配

```typescript
// 根据使用场景选择配置
const targetScenario = 'gaming_1440p';
const targetScore = 70;

const scenarioReport = generatePerformanceReport(components, totalPrice);
const gamingScore = scenarioReport.scenarios.find(
  s => s.name === targetScenario
)?.score;

if (gamingScore < targetScore) {
  // 优化建议
  console.log('配置不适合 1440p 游戏');
}
```

## 🐛 故障排除

### 问题 1：评分不准确

**原因**：组件不在基准数据库中

**解决方案**：
```typescript
// 检查组件是否在基准库
if (!CPU_BENCHMARKS[cpu.model]) {
  console.warn('CPU 不在基准库中，使用估算');
}

// 更新基准库
CPU_BENCHMARKS['新 CPU 型号'] = {
  type: 'cpu',
  score: 分数,
  tier: '级别',
  category: '类别'
};
```

### 问题 2：性能评分过低

**原因**：组件选择不合理或缺少关键组件

**解决方案**：
```typescript
// 检查关键组件
if (!components.cpu || !components.gpu) {
  console.warn('缺少 CPU 或 GPU');
}

// 检查组件兼容性
const result = validateSystemConfiguration(componentMap);
if (!result.isCompatible) {
  console.warn('组件不兼容');
}
```

### 问题 3：瓶颈分析错误

**原因**：组件性能差距过大

**解决方案**：
```typescript
// 分析瓶颈
const bottleneck = analyzeBottleneck(cpuScore, gpuScore, ramScore, storageScore);

// 查看详细信息
console.log('瓶颈类型:', bottleneck.type);
console.log('严重程度:', bottleneck.severity);
console.log('影响程度:', bottleneck.impact);
console.log('优化建议:', bottleneck.suggestion);
```

## 📚 相关资源

- [性能计算器源码](../lib/performance-calculator.ts)
- [性能类型定义](../types/performance.ts)
- [Builder Store 指南](./STORE_GUIDE.md)
- [完整示例页面](../app/examples/performance-preview-demo.tsx)

## 🎉 总结

性能预览面板提供：

✅ **实时计算** - 基于组件规格动态计算性能
✅ **多场景分析** - 6 个使用场景的性能预估
✅ **瓶颈诊断** - 智能识别性能瓶颈
✅ **FPS 预估** - 游戏场景的帧率预测
✅ **优化建议** - 针对性的升级建议
✅ **基准数据库** - 完整的组件性能基准
✅ **可视化展示** - 直观的图表和进度条

现在可以在配置器中使用性能预览面板，为用户提供实时性能反馈！
