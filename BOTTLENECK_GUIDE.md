# 瓶颈分析系统使用指南

完整的硬件配置瓶颈分析系统，智能检测系统瓶颈并提供优化建议。

## 目录

- [功能概述](#功能概述)
- [快速开始](#快速开始)
- [核心功能](#核心功能)
- [API 参考](#api-参考)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 功能概述

### 瓶颈检测

系统会自动检测以下类型的瓶颈：

1. **CPU-GPU 平衡** - 检测 CPU 和 GPU 性能是否匹配
2. **内存容量** - 检查内存容量是否足够
3. **内存速度** - 检查内存速度是否影响性能
4. **存储速度** - 检查存储类型和速度
5. **电源功率** - 检查电源功率是否充足
6. **性能评分** - 检查各维度性能是否达标
7. **VRAM 容量** - 检查显存是否足够

### 严重程度分类

- **Critical（严重）** - 需要立即处理，严重影响系统性能或安全
- **Warning（警告）** - 需要关注，影响性能但可正常使用
- **Info（提示）** - 优化建议，可提升体验
- **None（无）** - 无瓶颈

### 系统健康评估

- **Excellent** - 配置优秀，无明显瓶颈
- **Good** - 配置良好，有轻微优化空间
- **Fair** - 配置一般，存在一些瓶颈
- **Poor** - 配置较差，存在较多瓶颈
- **Critical** - 配置严重不足，需要立即优化

## 快速开始

### 1. 访问示例页面

```bash
npm run dev
# 访问 http://localhost:3000/examples/bottleneck-demo
```

### 2. 基础使用

```typescript
import { quickAnalyzeBottlenecks } from '@/lib/bottleneck';

const result = await quickAnalyzeBottlenecks(
  selectedComponents,
  performanceMetrics,
  systemScores
);

console.log('系统健康状况:', result.overallHealth);
console.log('瓶颈数量:', result.bottlenecks.length);
console.log('严重瓶颈:', result.criticalCount);
console.log('警告:', result.warningCount);
```

### 3. 使用 React 组件

```tsx
import { BottleneckDisplay } from '@/components/bottleneck';

function MyPage() {
  return (
    <BottleneckDisplay
      result={analysisResult}
      onOptimize={(bottleneck) => {
        console.log('优化:', bottleneck);
        // 打开组件选择器或推荐页面
      }}
    />
  );
}
```

## 核心功能

### 1. BottleneckAnalyzer 类

```typescript
import { BottleneckAnalyzer } from '@/lib/bottleneck';

const analyzer = new BottleneckAnalyzer({
  cpuGpuRatioThreshold: {
    warning: 1.5,
    critical: 2.0,
  },
  ramCapacityThreshold: {
    warning: 16,
    critical: 8,
  },
  // ... 其他配置
});

// 执行分析
const result = analyzer.analyze(
  components,
  metrics,
  scores
);

// 生成优化建议
const suggestions = analyzer.generateOptimizationSuggestions(result, 500);
```

### 2. 快速分析

```typescript
import { quickAnalyzeBottlenecks } from '@/lib/bottleneck';

const result = await quickAnalyzeBottlenecks(
  components,
  metrics,
  scores
);
```

### 3. 瓶颈分析结果

```typescript
interface BottleneckAnalysisResult {
  bottlenecks: Bottleneck[];          // 瓶颈列表
  criticalCount: number;               // 严重瓶颈数量
  warningCount: number;               // 警告数量
  infoCount: number;                  // 提示数量
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  canImprove: boolean;                // 是否可以优化
  quickWins: Bottleneck[];            // 快速改进项
}
```

## API 参考

### BottleneckAnalyzer

#### 构造函数

```typescript
new BottleneckAnalyzer(config?: Partial<BottleneckAnalysisConfig>)
```

#### 方法

##### analyze()

执行完整瓶颈分析。

```typescript
analyze(
  components: Record<string, Component>,
  metrics: ComponentPerformanceMetrics,
  scores: SystemScores
): BottleneckAnalysisResult
```

##### setConfig()

更新分析配置。

```typescript
setConfig(config: Partial<BottleneckAnalysisConfig>): void
```

##### generateOptimizationSuggestions()

生成优化建议。

```typescript
generateOptimizationSuggestions(
  result: BottleneckAnalysisResult,
  budget?: number
): OptimizationSuggestion[]
```

### 配置参数

```typescript
interface BottleneckAnalysisConfig {
  cpuGpuRatioThreshold: {
    warning: number;    // GPU/CPU 比例 > 1.5 警告
    critical: number;  // GPU/CPU 比例 > 2.0 严重
  };
  
  ramCapacityThreshold: {
    warning: number;    // < 16GB 警告
    critical: number;   // < 8GB 严重
  };
  
  ramSpeedThreshold: {
    ddr4: number;       // DDR4 < 3200MHz 警告
    ddr5: number;       // DDR5 < 6000MHz 警告
  };
  
  storageSpeedThreshold: {
    nvme: number;       // NVMe < 3000MB/s 警告
    ssd: number;        // SSD < 500MB/s 警告
  };
  
  psuWattageMargin: {
    minimum: number;    // 至少 100W 余量
    recommended: number; // 推荐 200W 余量
  };
  
  vramThreshold: {
    warning: number;    // < 8GB 警告
    critical: number;   // < 6GB 严重
  };
  
  performanceThreshold: {
    low: number;         // < 50 低性能
    medium: number;      // < 70 中等性能
    high: number;        // < 85 高性能
  };
}
```

## 使用示例

### 示例 1: 基础瓶颈分析

```typescript
import { quickAnalyzeBottlenecks } from '@/lib/bottleneck';

async function analyzeConfiguration() {
  // 准备数据
  const components = {
    cpu: cpuComponent,
    gpu: gpuComponent,
    ram: ramComponent,
    // ...
  };

  const metrics = {
    cpu: {
      singleCore: 1800,
      multiCore: 12000,
      gamingScore: 8500,
      productivityScore: 11000,
    },
    gpu: {
      computeScore: 18000,
      gamingScore: 20000,
      rayTracingScore: 15000,
      vram: 12,
    },
    ram: {
      capacity: 16,
      speed: 3200,
      type: 'DDR4',
      bandwidth: 25600,
    },
    // ...
  };

  const scores = {
    gaming: 75,
    productivity: 72,
    workstation: 68,
    value: 78,
    efficiency: 80,
  };

  // 执行分析
  const result = await quickAnalyzeBottlenecks(
    components,
    metrics,
    scores
  );

  // 处理结果
  console.log('系统健康:', result.overallHealth);
  result.bottlenecks.forEach(bottleneck => {
    console.log('组件:', bottleneck.component);
    console.log('严重程度:', bottleneck.severity);
    console.log('影响:', bottleneck.impact, '%');
    console.log('建议:', bottleneck.suggestion);
  });
}
```

### 示例 2: 自定义配置分析

```typescript
import { BottleneckAnalyzer } from '@/lib/bottleneck';

async function customAnalysis() {
  // 创建分析器，使用自定义配置
  const analyzer = new BottleneckAnalyzer({
    cpuGpuRatioThreshold: {
      warning: 2.0,    // 更宽松的阈值
      critical: 3.0,
    },
    ramCapacityThreshold: {
      warning: 32,     // 更高的内存要求
      critical: 16,
    },
  });

  // 执行分析
  const result = analyzer.analyze(
    components,
    metrics,
    scores
  );

  // 生成预算内的优化建议
  const suggestions = analyzer.generateOptimizationSuggestions(
    result,
    1000  // $1000 预算
  );

  console.log('优化建议:', suggestions);
}
```

### 示例 3: React 组件集成

```tsx
'use client';

import { useState, useEffect } from 'react';
import { BottleneckDisplay } from '@/components/bottleneck';
import { quickAnalyzeBottlenecks } from '@/lib/bottleneck';
import { useBuilderStore } from '@/lib/store/builder-store';

export default function BottleneckAnalysis() {
  const { selectedComponents } = useBuilderStore();
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function analyze() {
      // 计算性能指标
      const metrics = calculatePerformanceMetrics(selectedComponents);
      const scores = calculateSystemScores(selectedComponents);

      // 执行瓶颈分析
      const analysis = await quickAnalyzeBottlenecks(
        selectedComponents,
        metrics,
        scores
      );

      setResult(analysis);
    }

    analyze();
  }, [selectedComponents]);

  const handleOptimize = (bottleneck) => {
    // 打开组件选择器，跳转到对应组件
    console.log('优化组件:', bottleneck.component);
  };

  return (
    <div>
      <h2>瓶颈分析</h2>
      {result && (
        <BottleneckDisplay
          result={result}
          onOptimize={handleOptimize}
        />
      )}
    </div>
  );
}
```

### 示例 4: 紧凑型展示

```tsx
import { CompactBottleneckDisplay } from '@/components/bottleneck';

function Sidebar() {
  return (
    <aside>
      <h3>系统状态</h3>
      <CompactBottleneckDisplay result={analysisResult} />
    </aside>
  );
}
```

## 最佳实践

### 1. 在配置变更时自动分析

```tsx
useEffect(() => {
  async function analyze() {
    const result = await quickAnalyzeBottlenecks(
      selectedComponents,
      metrics,
      scores
    );
    setResult(result);
  }

  // 防抖处理，避免频繁计算
  const timeoutId = setTimeout(analyze, 500);
  return () => clearTimeout(timeoutId);
}, [selectedComponents]);
```

### 2. 根据用户场景调整阈值

```typescript
function getAnalyzerConfig(userScenario: string) {
  if (userScenario === 'gaming') {
    return {
      cpuGpuRatioThreshold: { warning: 1.3, critical: 1.8 },
      vramThreshold: { warning: 12, critical: 10 },
    };
  } else if (userScenario === 'productivity') {
    return {
      ramCapacityThreshold: { warning: 32, critical: 16 },
      storageSpeedThreshold: { nvme: 5000, ssd: 1000 },
    };
  }
  return {};
}
```

### 3. 提供预算内的优化建议

```typescript
const suggestions = analyzer.generateOptimizationSuggestions(
  result,
  userBudget  // 根据用户预算筛选
);
```

### 4. 结合性能分析使用

```typescript
// 先进行性能分析
const performanceReport = await generatePerformanceReport(
  selectedComponents,
  totalPrice
);

// 再进行瓶颈分析
const bottleneckAnalysis = await quickAnalyzeBottlenecks(
  selectedComponents,
  performanceReport.metrics,
  performanceReport.scores
);

// 综合展示
return (
  <div>
    <PerformancePreview report={performanceReport} />
    <BottleneckDisplay result={bottleneckAnalysis} />
  </div>
);
```

## 常见问题

### Q1: 如何自定义瓶颈检测阈值？

```typescript
const analyzer = new BottleneckAnalyzer({
  cpuGpuRatioThreshold: {
    warning: 1.5,  // 自定义阈值
    critical: 2.0,
  },
});
```

### Q2: 如何处理没有瓶颈的情况？

```typescript
if (result.bottlenecks.length === 0) {
  console.log('配置优秀，无需优化');
} else {
  // 显示瓶颈列表
  <BottleneckDisplay result={result} />
}
```

### Q3: 如何获取预计的性能提升？

```typescript
result.bottlenecks.forEach(bottleneck => {
  if (bottleneck.estimatedImprovement) {
    console.log(`预计提升: +${bottleneck.estimatedImprovement} 分`);
  }
});
```

### Q4: 如何集成到现有项目中？

```typescript
// 1. 导入分析器
import { quickAnalyzeBottlenecks } from '@/lib/bottleneck';

// 2. 准备数据（从你的数据源获取）
const components = getSelectedComponents();
const metrics = calculateMetrics(components);
const scores = calculateScores(components);

// 3. 执行分析
const result = await quickAnalyzeBottlenecks(
  components,
  metrics,
  scores
);

// 4. 使用组件展示
<BottleneckDisplay result={result} />
```

## 相关文档

- [性能计算器指南](./PERFORMANCE_GUIDE.md)
- [综合跑分指南](./COMPOSITE_BENCHMARK_GUIDE.md)
- [Builder Store 指南](./STORE_GUIDE.md)
- [类型定义](./types/bottleneck.ts)

## 总结

瓶颈分析系统提供：

✅ **智能检测** - 7 种瓶颈类型自动识别
✅ **多级分类** - Critical/Warning/Info 三级严重程度
✅ **影响分析** - 量化瓶颈影响程度
✅ **优化建议** - 针对性改进建议
✅ **健康评估** - 系统整体健康状况
✅ **快速改进** - 低成本高收益的优化选项
✅ **灵活配置** - 可自定义检测阈值
✅ **完整组件** - 可视化展示组件
✅ **易于集成** - 简单的 API 和 React 组件
