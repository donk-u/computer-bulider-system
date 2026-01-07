# 综合跑分系统使用指南

完整的综合跑分算法，整合游戏、生产力、工作站、性价比、效率等多个维度的性能评估。

## 📁 文件结构

```
types/
└── composite-benchmark.ts     # 综合跑分类型定义

lib/benchmark/
├── composite-calculator.ts   # 综合跑分算法
├── integrated-benchmark.ts   # 集成跑分系统
└── index.ts                  # 统一导出

app/examples/
└── composite-benchmark-demo.tsx  # 完整示例页面
```

## 🚀 快速开始

### 1. 基础使用

```typescript
import { getQuickFullSystemReport } from '@/lib/benchmark/integrated-benchmark';

const components = {
  cpu: cpuComponent,
  gpu: gpuComponent,
  ram: ramComponent,
  storage: storageComponent,
};

const report = await getQuickFullSystemReport(components);

console.log('综合评分:', report.overall);
console.log('性能等级:', report.grade);
console.log('游戏性能:', report.scores.gaming);
console.log('生产力:', report.scores.productivity);
console.log('性价比:', report.scores.value);
```

### 2. 使用集成系统

```typescript
import { IntegratedBenchmarkSystem } from '@/lib/benchmark/integrated-benchmark';

const system = new IntegratedBenchmarkSystem();

// 生成完整报告
const report = await system.generateFullSystemReport(components);

// 生成详细评分
const detailed = await system.generateDetailedReport(components);

// 对比配置
const comparison = await system.compareConfigurations(configA, configB);
```

## 📊 综合评分系统

### 评分维度

综合跑分系统包含 5 个评分维度：

#### 1. 游戏评分 (Gaming Score)
- **权重**：GPU 60%, CPU 30%, RAM 10%
- **子场景**：4K 游戏, 1440p 游戏, 1080p 游戏
- **计算公式**：
  ```typescript
  gaming = normalizedGpu * 0.6 + 
           normalizedCpu * 0.3 + 
           normalizedRam * 0.1
  ```

#### 2. 生产力评分 (Productivity Score)
- **权重**：CPU 50%, RAM 30%, Storage 20%
- **子维度**：CPU 性能, 内存性能, 存储性能, 多任务处理
- **计算公式**：
  ```typescript
  productivity = normalizedCpu * 0.5 + 
                normalizedRam * 0.3 + 
                normalizedStorage * 0.2
  ```

#### 3. 工作站评分 (Workstation Score)
- **权重**：CPU 35%, GPU 25%, RAM 25%, Storage 15%
- **适用场景**：专业渲染、3D 建模、视频编辑
- **计算公式**：
  ```typescript
  workstation = normalizedCpu * 0.35 + 
                normalizedGpu * 0.25 + 
                normalizedRam * 0.25 + 
                normalizedStorage * 0.15
  ```

#### 4. 性价比评分 (Value Score)
- **计算方式**：性能 / 价格 × 系数
- **调整系数**：使合理价格范围的性价比在 0-100 之间
- **计算公式**：
  ```typescript
  value = (performance / price) * 1000
  ```

#### 5. 效率评分 (Efficiency Score)
- **子维度**：功耗效率, 散热效率, 尺寸效率
- **计算公式**：
  ```typescript
  efficiency = powerEfficiency * 0.5 + 
               thermalEfficiency * 0.3 + 
               sizeEfficiency * 0.2
  ```

### 综合评分计算

```typescript
// 默认权重
const weights = {
  gaming: 0.30,
  productivity: 0.25,
  workstation: 0.20,
  value: 0.15,
  efficiency: 0.10,
};

// 综合评分
overall = gaming * 0.30 + 
          productivity * 0.25 + 
          workstation * 0.20 + 
          value * 0.15 + 
          efficiency * 0.10;
```

### 评分等级

| 评分 | 等级 | 颜色 | 描述 |
|-----|------|------|------|
| 95-100 | S | 紫色 | 极致性能 - 顶级配置 |
| 85-94 | A | 绿色 | 高端配置 - 性能出色 |
| 70-84 | B | 蓝色 | 良好配置 - 表现均衡 |
| 50-69 | C | 黄色 | 中端配置 - 满足需求 |
| 30-49 | D | 橙色 | 入门配置 - 基础性能 |
| 0-29 | F | 红色 | 性能不足 - 需要升级 |

## 🔧 核心功能

### 1. 综合评分计算

```typescript
import { calculateOverallScore } from '@/lib/benchmark/composite-calculator';

const result = calculateOverallScore(components, performances);
```

**返回**：
- `scores`: 各场景评分
- `overall`: 综合评分 (0-100)
- `grade`: 性能等级 (S/A/B/C/D/F)
- `bottlenecks`: 瓶颈列表
- `strengths`: 优势列表
- `weaknesses`: 劣势列表
- `recommendations`: 推荐建议

### 2. 瓶颈分析

系统会自动识别以下瓶颈：

#### CPU 瓶颈
- **Critical**: CPU < 50 且 GPU > 70
- **Moderate**: CPU < 60
- **建议**: 升级到多核高频处理器

#### GPU 瓶颈
- **Critical**: GPU < 50 且 CPU > 70
- **Moderate**: GPU < 60 且游戏 > 50
- **建议**: 升级到中高端显卡

#### 内存瓶颈
- **Moderate**: RAM < 50
- **Minor**: RAM 容量 < 32 且 CPU 核心 >= 8
- **建议**: 使用 32GB 或更大容量的高频内存

#### 存储瓶颈
- **Minor**: Storage < 50
- **建议**: 升级到 PCIe 4.0 NVMe SSD

### 3. 配置对比

```typescript
import { quickCompareConfigurations } from '@/lib/benchmark/integrated-benchmark';

const comparison = await quickCompareConfigurations(configA, configB);

console.log('胜者:', comparison.winner);
console.log('综合评分差异:', comparison.overallScoreDifference);
console.log('游戏性能差异:', comparison.gamingScoreDifference);
console.log('生产力差异:', comparison.productivityScoreDifference);
```

## 🎯 使用场景

### 场景 1：配置器集成

```typescript
import { getQuickFullSystemReport } from '@/lib/benchmark/integrated-benchmark';
import { useBuilderStore } from '@/lib/store/builder-store';

function CompositeBenchmarkPanel() {
  const { selectedComponents } = useBuilderStore();
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (Object.keys(selectedComponents).length >= 2) {
      generateReport();
    }
  }, [selectedComponents]);

  const generateReport = async () => {
    const report = await getQuickFullSystemReport(selectedComponents);
    setReport(report);
  };

  return (
    <div>
      {report && (
        <>
          <h1>综合评分: {report.overall}</h1>
          <h2>性能等级: {report.grade}</h2>
          
          {/* 场景评分 */}
          <div>游戏: {report.scores.gaming}</div>
          <div>生产力: {report.scores.productivity}</div>
          <div>性价比: {report.scores.value}</div>
          
          {/* 瓶颈 */}
          {report.bottlenecks.map(b => (
            <div key={b.component}>
              {b.component}: {b.message}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
```

### 场景 2：游戏配置推荐

```typescript
import { getQuickFullSystemReport } from '@/lib/benchmark/integrated-benchmark';

async function recommendGamingConfig(components) {
  const report = await getQuickFullSystemReport(components);
  
  if (report.scores.gaming >= 80) {
    console.log('推荐配置：游戏性能出色');
  } else if (report.scores.gaming >= 60) {
    console.log('推荐配置：游戏性能良好');
  } else {
    console.log('建议：升级 GPU 以提升游戏性能');
  }
}
```

### 场景 3：性价比优化

```typescript
import { getQuickFullSystemReport } from '@/lib/benchmark/integrated-benchmark';

async function optimizeValue(components) {
  const report = await getQuickFullSystemReport(components);
  
  // 分析性价比
  const { value, gaming, productivity } = report.scores;
  
  if (value >= 80 && gaming >= 70) {
    console.log('高性价比游戏配置');
  } else if (value >= 80 && productivity >= 70) {
    console.log('高性价比生产力配置');
  } else {
    console.log('建议：优化配置以提升性价比');
    
    // 查找瓶颈
    const criticalBottleneck = report.bottlenecks.find(
      b => b.severity === 'critical'
    );
    
    if (criticalBottleneck) {
      console.log('优先升级:', criticalBottleneck.component);
    }
  }
}
```

### 场景 4：配置对比选择

```typescript
import { quickCompareConfigurations } from '@/lib/benchmark/integrated-benchmark';

async function compareConfigs(configA, configB) {
  const comparison = await quickCompareConfigurations(configA, configB);
  
  if (comparison.winner === 'A') {
    console.log('推荐配置 A');
    console.log('游戏性能提升:', comparison.gamingScoreDifference);
    console.log('综合评分提升:', comparison.overallScoreDifference);
  } else if (comparison.winner === 'B') {
    console.log('推荐配置 B');
    console.log('生产力提升:', comparison.productivityScoreDifference);
    console.log('性价比提升:', comparison.valueScoreDifference);
  } else {
    console.log('两个配置性能相当');
    console.log('建议：根据具体使用场景选择');
  }
}
```

## 📈 性能优化建议

### 基于评分的建议

#### 游戏性能提升

```typescript
const report = await getQuickFullSystemReport(components);

if (report.scores.gaming < 70) {
  const criticalGpu = report.bottlenecks.find(
    b => b.component === 'GPU' && b.severity === 'critical'
  );
  
  if (criticalGpu) {
    console.log('建议：升级 GPU 以提升游戏性能');
    console.log('推荐：RTX 4060 Ti 或 RX 7700 XT');
  } else {
    console.log('建议：升级 CPU 以提升游戏帧率');
    console.log('推荐：Ryzen 5 7600X 或 i5-13600K');
  }
}
```

#### 生产力性能提升

```typescript
if (report.scores.productivity < 70) {
  const criticalCpu = report.bottlenecks.find(
    b => b.component === 'CPU' && b.severity === 'critical'
  );
  
  if (criticalCpu) {
    console.log('建议：升级 CPU 以提升生产力');
    console.log('推荐：Ryzen 7 或 i7 系列');
  } else {
    console.log('建议：升级内存以提升多任务处理');
    console.log('推荐：32GB DDR5');
  }
}
```

#### 性价比优化

```typescript
if (report.scores.value < 60) {
  console.log('建议：优化配置以提升性价比');
  
  // 查找性价比最低的组件
  const components = Object.entries(components);
  const componentCost = components.map(([key, comp]) => {
    const perf = performances[key];
    const perfScore = perf?.overallScore || 0;
    return {
      component: key,
      pricePerf: comp.price / (perfScore / 100),
    };
  });
  
  const worstValue = componentCost.sort((a, b) => b.pricePerf - a.pricePerf)[0];
  
  console.log(`建议：优化 ${worstValue.component} 的选择`);
}
```

## 🎨 自定义权重

### 修改评分权重

```typescript
import { IntegratedBenchmarkSystem } from '@/lib/benchmark/integrated-benchmark';

const system = new IntegratedBenchmarkSystem();

// 游戏优先配置
const gamingPrioritizedReport = await system.generateFullSystemReport(components, {
  weights: {
    gaming: 0.50,      // 增加游戏权重
    productivity: 0.20,
    workstation: 0.10,
    value: 0.10,
    efficiency: 0.10,
  },
});

// 生产力优先配置
const productivityPrioritizedReport = await system.generateFullSystemReport(components, {
  weights: {
    gaming: 0.20,
    productivity: 0.50,  // 增加生产力权重
    workstation: 0.15,
    value: 0.10,
    efficiency: 0.05,
  },
});

// 性价比优先配置
const valuePrioritizedReport = await system.generateFullSystemReport(components, {
  weights: {
    gaming: 0.25,
    productivity: 0.20,
    workstation: 0.10,
    value: 0.35,      // 增加性价比权重
    efficiency: 0.10,
  },
});
```

## 📊 评分示例

### 预设配置对比

| 配置 | 游戏 | 生产力 | 工作站 | 性价比 | 效率 | 综合 | 等级 |
|-----|------|--------|--------|--------|------|------|------|
| 入门级 | 45 | 55 | 50 | 65 | 60 | 55 | C |
| 中端 | 65 | 72 | 68 | 70 | 75 | 70 | B |
| 高端 | 80 | 85 | 82 | 60 | 70 | 75 | B |
| 旗舰 | 92 | 95 | 93 | 40 | 65 | 78 | A |

### 不同权重的影响

| 权重配置 | 游戏 | 生产力 | 综合 | 推荐场景 |
|---------|------|--------|------|---------|
| 默认 | 70 | 72 | 71 | 均衡使用 |
| 游戏优先 | 75 | 68 | 72 | 游戏 |
| 生产力优先 | 65 | 78 | 70 | 办公/创作 |
| 性价比优先 | 68 | 70 | 69 | 预算有限 |

## 🔍 瓶颈分析示例

### 系统瓶颈识别

```typescript
const report = await getQuickFullSystemReport(components);

report.bottlenecks.forEach(bottleneck => {
  console.log('组件:', bottleneck.component);
  console.log('严重程度:', bottleneck.severity);
  console.log('影响程度:', bottleneck.impact, '%');
  console.log('问题描述:', bottleneck.message);
  console.log('优化建议:', bottleneck.suggestion);
});
```

### 瓶颈等级说明

| 等级 | 影响程度 | 说明 | 优先级 |
|-----|---------|------|--------|
| Critical | >50% | 严重影响整体性能 | 立即升级 |
| Moderate | 20-50% | 中等影响性能 | 优先升级 |
| Minor | <20% | 轻微影响性能 | 可选升级 |

## 🐛 故障排除

### 问题 1：评分不准确

**原因**：组件规格不完整或缺少组件

**解决方案**：
```typescript
// 检查组件规格
console.log('CPU 规格:', components.cpu?.specs);
console.log('GPU 规格:', components.gpu?.specs);

// 确保必需组件存在
if (!components.cpu || !components.gpu) {
  console.warn('缺少 CPU 或 GPU，无法准确评分');
}

// 提供完整规格
components.cpu.specs = {
  cores: 8,
  baseClock: 3500,
  boostClock: 5000,
  tdp: 105,
  cache: 32000000,
};
```

### 问题 2：性价比评分偏低

**原因**：价格过高或性能不足

**解决方案**：
```typescript
const report = await getQuickFullSystemReport(components);

if (report.scores.value < 50) {
  console.log('性价比偏低，建议：');
  console.log('1. 优化组件选择，选择性价比更高的型号');
  console.log('2. 考虑减少不必要的升级');
  console.log('3. 查找性能相当但价格更低的替代品');
}
```

### 问题 3：瓶颈分析不准确

**原因**：组件性能数据不完整

**解决方案**：
```typescript
// 确保使用 Supabase 数据
const system = new IntegratedBenchmarkSystem();
system.setParams({ useSupabaseData: true });

// 或手动提供性能数据
const report = await system.generateFullSystemReport(components, {
  componentPerformances: {
    cpu: { overallScore: 75, gamingScore: 8000 },
    gpu: { overallScore: 85, gamingScore: 25000 },
  },
});
```

## 📚 相关资源

- [综合跑分类型定义](../types/composite-benchmark.ts)
- [综合跑分算法](../lib/benchmark/composite-calculator.ts)
- [集成跑分系统](../lib/benchmark/integrated-benchmark.ts)
- [完整示例页面](../app/examples/composite-benchmark-demo.tsx)
- [跑分系统指南](./BENCHMARK_GUIDE.md)

## 🎉 总结

综合跑分系统提供：

✅ **多维度评估** - 游戏、生产力、工作站、性价比、效率
✅ **智能权重** - 可自定义各维度权重
✅ **瓶颈分析** - 自动识别性能瓶颈
✅ **配置对比** - 快速对比不同配置
✅ **优化建议** - 基于评分的针对性建议
✅ **完整报告** - 包含优劣势和推荐
✅ **灵活配置** - 支持自定义参数
✅ **性能优化** - 集成缓存和批量操作

现在可以在配置器中使用综合跑分系统，为用户提供全面的多维度性能评估！
