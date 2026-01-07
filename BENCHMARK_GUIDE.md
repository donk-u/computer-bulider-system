# 硬件性能跑分系统使用指南

完整的硬件性能跑分系统，支持 Supabase 数据库和计算公式两种方式。

## 📁 文件结构

```
types/
└── benchmark.ts                    # 跑分类型定义

lib/benchmark/
├── supabase-benchmark.ts          # Supabase 数据集成
├── performance-calculator.ts       # 性能计算算法
└── benchmark-manager.ts            # 跑分管理器

app/examples/
└── benchmark-demo.tsx             # 完整示例页面
```

## 🚀 快速开始

### 1. 基础使用

```tsx
import { getQuickSystemReport } from '@/lib/benchmark/benchmark-manager';
import { useBuilderStore } from '@/lib/store/builder-store';

function BenchmarkPage() {
  const { selectedComponents } = useBuilderStore();
  const [report, setReport] = useState(null);

  useEffect(() => {
    generateReport();
  }, [selectedComponents]);

  const generateReport = async () => {
    const report = await getQuickSystemReport(selectedComponents);
    setReport(report);
  };

  return (
    <div>
      <h1>综合评分: {report?.overallScore}</h1>
      <h2>性能等级: {report?.grade}</h2>
    </div>
  );
}
```

### 2. 使用自定义管理器

```tsx
import { BenchmarkManager } from '@/lib/benchmark/benchmark-manager';

const manager = new BenchmarkManager({
  useSupabaseData: true,
  enableCache: true,
  cacheExpiry: 3600000, // 1 小时
});

// 生成报告
const report = await manager.generateSystemReport(components);
```

## 📊 性能评分系统

### CPU 性能评分

```typescript
interface CPUPerformance {
  singleCore: number;        // 单核性能分数
  multiCore: number;         // 多核性能分数
  gamingScore: number;        // 游戏性能分数
  productivityScore: number; // 生产力性能分数
  overallScore: number;       // 综合评分
  passmarkScore?: number;     // PassMark 基准分（可选）
}
```

**计算公式**：

```typescript
// 单核性能
singleCore = baseClock * cores * 100 * singleThreadRating * 0.8 + boostClock * cores * 120 * 0.2

// 多核性能
multiCore = (baseScore + boostScore) * cores * 0.8 * (threads / cores) * 0.9

// 游戏性能
gamingScore = baseScore * 0.4 + boostScore * 0.6 + cacheScore * 0.1

// 生产力性能
productivityScore = (baseScore + cacheScore) * cores * 0.9 + boostScore * 0.1

// 综合评分
overallScore = (singleCore * 0.25 + multiCore * 0.35 + gamingScore * 0.25 + productivityScore * 0.15) / 100
```

**评分参考**：

| CPU 型号 | 单核 | 多核 | 游戏 | 生产力 | 综合 |
|---------|-----|------|------|--------|------|
| Ryzen 9 7950X | 8500 | 28000 | 9500 | 30000 | 15000 |
| i9-14900K | 8200 | 29000 | 9200 | 27000 | 14800 |
| Ryzen 7 7800X3D | 9000 | 18000 | 10000 | 19000 | 14000 |

### GPU 性能评分

```typescript
interface GPUPerformance {
  computeScore: number;       // 计算性能分数
  gamingScore: number;        // 游戏性能分数
  rayTracingScore: number;   // 光线追踪分数
  productivityScore: number; // 生产力性能分数
  overallScore: number;       // 综合评分
  timeSpyScore?: number;     // 3DMark Time Spy GPU 分数（可选）
  fireStrikeScore?: number;   // 3DMark Fire Strike 分数（可选）
}
```

**计算公式**：

```typescript
// 显存容量分数
vramScore = vram * 1500

// TDP 分数
tdpScore = tdp * 50

// PCIe 版本倍数
pcieMultiplier = {
  '5.0': 1.2,
  '4.0': 1.0,
  '3.0': 0.8,
  '2.0': 0.6,
}

// 计算性能
computeScore = (vramScore + tdpScore) * pcieMultiplier * 0.6

// 游戏性能
gamingScore = vramScore * 0.6 + tdpScore * 0.4 * pcieMultiplier

// 光线追踪分数
rayTracingScore = memoryBandwidth * 0.001 * (rayTracingSupport ? 1.5 : 0.5)

// 生产力性能
productivityScore = computeScore * 1.2 + rayTracingScore * 0.8

// 综合评分
overallScore = (computeScore * 0.2 + gamingScore * 0.4 + rayTracingScore * 0.25 + productivityScore * 0.15) / 100
```

**评分参考**：

| GPU 型号 | 计算 | 游戏 | 光追 | 生产力 | 综合 |
|---------|-----|------|------|--------|------|
| RTX 4090 | 28000 | 36000 | 32000 | 30000 | 32000 |
| RX 7900 XTX | 24000 | 30000 | 25000 | 26000 | 26000 |
| RTX 4080 Super | 22000 | 29000 | 26000 | 24000 | 26000 |

### 内存性能评分

```typescript
interface RAMPerformance {
  bandwidth: number;         // 带宽分数
  latency: number;           // 延迟分数
  capacityScore: number;     // 容量分数
  overallScore: number;       // 综合评分
  readSpeed?: number;        // 读取速度 MB/s（可选）
  writeSpeed?: number;       // 写入速度 MB/s（可选）
}
```

**计算公式**：

```typescript
// 类型倍数
typeMultiplier = {
  'DDR5': 1.0,
  'DDR4': 0.8,
  'DDR3': 0.6,
  'LPDDR5': 0.95,
  'LPDDR4': 0.75,
}

// 频率分数
frequencyScore = speed * typeMultiplier

// 带宽分数
bandwidth = frequencyScore * modules * 0.5

// 延迟分数
latencyScore = (20 / latency) * 100 * typeMultiplier

// 容量分数
capacityScore = {
  8: 40,
  16: 70,
  32: 100,
  64: 100,
  128: 100,
}

// 综合评分
overallScore = bandwidth * 0.4 + latencyScore * 0.3 + capacityScore * 0.3
```

**评分参考**：

| 内存规格 | 带宽 | 延迟 | 容量 | 综合 |
|---------|-----|------|------|------|
| DDR5-8000 64GB | 80 | 90 | 100 | 90 |
| DDR5-6400 64GB | 64 | 90 | 100 | 84 |
| DDR4-3600 32GB | 57 | 75 | 100 | 76 |

### 存储性能评分

```typescript
interface StoragePerformance {
  sequentialRead: number;    // 顺序读取分数
  sequentialWrite: number;   // 顺序写入分数
  randomRead: number;        // 随机读取分数
  randomWrite: number;       // 随机写入分数
  overallScore: number;      // 综合评分
  iops?: number;            // IOPS（可选）
}
```

**计算公式**：

```typescript
// 类型加成
typeBonus = {
  'NVMe': 1.0,
  'SSD': 0.6,
  'HDD': 0.2,
}

// 应用类型加成
seqReadFinal = sequentialRead * typeBonus
seqWriteFinal = sequentialWrite * typeBonus

// 随机性能
randomRead = sequentialRead * 0.6
randomWrite = sequentialWrite * 0.5

// 综合评分
overallScore = (seqReadFinal * 0.3 + seqWriteFinal * 0.3 + randomRead * 0.2 + randomWrite * 0.2) / 100
```

**评分参考**：

| 存储规格 | 顺序读 | 顺序写 | 随机读 | 随机写 | 综合 |
|---------|-------|-------|-------|-------|------|
| PCIe 4.0 NVMe (7450) | 75 | 70 | 45 | 35 | 57 |
| PCIe 4.0 NVMe (7000) | 70 | 70 | 42 | 35 | 54 |
| SATA SSD | 30 | 30 | 18 | 15 | 24 |

## 🔧 核心功能

### 1. Supabase 数据集成

```typescript
import { getComponentBenchmarkFromSupabase } from '@/lib/benchmark/supabase-benchmark';

// 获取单个组件基准数据
const benchmarkData = await getComponentBenchmarkFromSupabase(
  componentId,
  componentType
);

// 批量获取
const batchData = await getBatchComponentBenchmarks(componentIds, componentType);
```

**Supabase 表结构**：

```sql
CREATE TABLE component_benchmarks (
  id UUID PRIMARY KEY,
  component_id VARCHAR(255) NOT NULL,
  component_type VARCHAR(50) NOT NULL,
  
  -- CPU
  single_core_score INTEGER,
  multi_core_score INTEGER,
  gaming_score INTEGER,
  productivity_score INTEGER,
  passmark_score INTEGER,
  
  -- GPU
  compute_score INTEGER,
  ray_tracing_score INTEGER,
  time_spy_score INTEGER,
  fire_strike_score INTEGER,
  
  -- 内存
  bandwidth_score INTEGER,
  latency_score INTEGER,
  capacity_score INTEGER,
  
  -- 存储
  seq_read_score INTEGER,
  seq_write_score INTEGER,
  random_read_score INTEGER,
  random_write_score INTEGER,
  iops INTEGER,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(component_id, component_type)
);
```

### 2. 性能计算公式

```typescript
import {
  calculateCPUPerformance,
  calculateGPUPerformance,
  calculateRAMPerformance,
  calculateStoragePerformance,
} from '@/lib/benchmark/performance-calculator';

// CPU 计算
const cpuScore = calculateCPUPerformance(cpuComponent);

// GPU 计算
const gpuScore = calculateGPUPerformance(gpuComponent);

// 内存计算
const ramScore = calculateRAMPerformance(ramComponent);

// 存储计算
const storageScore = calculateStoragePerformance(storageComponent);
```

### 3. 跑分管理器

```typescript
import { BenchmarkManager } from '@/lib/benchmark/benchmark-manager';

// 创建管理器
const manager = new BenchmarkManager({
  useSupabaseData: true,      // 优先使用 Supabase 数据
  enableCache: true,           // 启用缓存
  cacheExpiry: 3600000,       // 缓存过期时间（1小时）
  customWeights: {             // 自定义权重（可选）
    cpu: {
      singleCore: 0.25,
      multiCore: 0.35,
      gaming: 0.25,
      productivity: 0.15,
    },
  },
});

// 获取组件评分
const score = await manager.getComponentScores(component);

// 批量获取评分
const scores = await manager.getBatchScores(components);

// 生成系统报告
const report = await manager.generateSystemReport(components);

// 对比组件
const comparison = await manager.compareComponents(componentA, componentB);

// 清除缓存
manager.clearCache();

// 获取缓存统计
const stats = manager.getCacheStats();
```

### 4. 快速 API

```typescript
import {
  getQuickComponentScores,
  getQuickSystemReport,
  quickCompareComponents,
} from '@/lib/benchmark/benchmark-manager';

// 快速获取组件评分
const score = await getQuickComponentScores(component);

// 快速生成系统报告
const report = await getQuickSystemReport(components);

// 快速对比组件
const comparison = await quickCompareComponents(componentA, componentB);
```

## 📈 系统综合评分

### 计算公式

```typescript
// 归一化分数
normalizedCpu = cpuOverallScore / 100
normalizedGpu = gpuOverallScore / 100
normalizedRam = ramOverallScore / 100
normalizedStorage = storageOverallScore / 100

// 加权平均
overallScore = normalizedCpu * 0.25 + 
               normalizedGpu * 0.45 + 
               normalizedRam * 0.20 + 
               normalizedStorage * 0.10
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

## 🎯 使用场景

### 场景 1：配置器集成

```tsx
import { getQuickSystemReport } from '@/lib/benchmark/benchmark-manager';
import { useBuilderStore } from '@/lib/store/builder-store';

function BuilderPage() {
  const { selectedComponents } = useBuilderStore();
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (Object.keys(selectedComponents).length >= 2) {
      generateReport();
    }
  }, [selectedComponents]);

  const generateReport = async () => {
    const report = await getQuickSystemReport(selectedComponents);
    setReport(report);
  };

  return (
    <div>
      {report && (
        <>
          <h1>综合评分: {report.overallScore}</h1>
          <h2>性能等级: {report.grade}</h2>
          <ul>
            {report.recommendations.map(rec => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
```

### 场景 2：组件对比

```tsx
import { quickCompareComponents } from '@/lib/benchmark/benchmark-manager';

async function compareCPUs() {
  const comparison = await quickCompareComponents(cpuA, cpuB);

  console.log('组件 A:', comparison.componentA);
  console.log('组件 B:', comparison.componentB);
  console.log('更优:', comparison.better);
  console.log('分数差异:', comparison.scoreDifference);
  console.log('性能提升:', comparison.percentageDifference, '%');
}
```

### 场景 3：性能排行榜

```tsx
import { BenchmarkManager } from '@/lib/benchmark/benchmark-manager';

const manager = new BenchmarkManager();

async function generateRanking() {
  const components = [
    cpu1, cpu2, cpu3, cpu4, cpu5
  ];

  const scores = await manager.getBatchScores(components);

  // 排序
  const ranked = components
    .map(comp => ({
      component: comp,
      score: scores.get(comp.id),
    }))
    .sort((a, b) => b.score.overallScore - a.score.overallScore);

  return ranked;
}
```

## 🎨 自定义配置

### 自定义权重

```typescript
const manager = new BenchmarkManager({
  customWeights: {
    cpu: {
      singleCore: 0.30,  // 增加单核权重
      multiCore: 0.40,
      gaming: 0.20,
      productivity: 0.10,
    },
    gpu: {
      compute: 0.25,    // 增加计算权重
      gaming: 0.35,
      rayTracing: 0.25,
      productivity: 0.15,
    },
  },
});
```

### 自定义缓存时间

```typescript
// 30 分钟缓存
const manager = new BenchmarkManager({
  cacheExpiry: 1800000, // 30 分钟
});

// 动态设置
manager.setParams({ cacheExpiry: 600000 }); // 10 分钟
```

### 禁用 Supabase 数据

```typescript
// 只使用计算公式
const manager = new BenchmarkManager({
  useSupabaseData: false,
});
```

## 📊 性能对比示例

### CPU 对比

| 型号 | 单核 | 多核 | 游戏 | 生产力 | 综合 | 等级 |
|-----|------|------|------|--------|------|------|
| Ryzen 9 7950X | 8500 | 28000 | 9500 | 30000 | 15000 | A |
| i9-14900K | 8200 | 29000 | 9200 | 27000 | 14800 | A |
| Ryzen 7 7800X3D | 9000 | 18000 | 10000 | 19000 | 14000 | A |

**对比结果**：
- Ryzen 9 7950X vs i9-14900K: Ryzen 9 单核更优（+3.7%），i9 多核更优（+3.6%）
- Ryzen 7 7800X3D 游戏性能最强，适合游戏场景

### GPU 对比

| 型号 | 计算 | 游戏 | 光追 | 生产力 | 综合 | 等级 |
|-----|------|------|------|--------|------|------|
| RTX 4090 | 28000 | 36000 | 32000 | 30000 | 32000 | S |
| RX 7900 XTX | 24000 | 30000 | 25000 | 26000 | 26000 | A |
| RTX 4080 Super | 22000 | 29000 | 26000 | 24000 | 26000 | A |

**对比结果**：
- RTX 4090 性能领先 RX 7900 XTX 约 23%
- RTX 4080 Super 与 RX 7900 XTX 性能相近

## 🐛 故障排除

### 问题 1：Supabase 连接失败

**原因**：Supabase 配置未设置或网络问题

**解决方案**：
```typescript
// 检查环境变量
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 降级到计算公式
const manager = new BenchmarkManager({
  useSupabaseData: false,
});
```

### 问题 2：评分不准确

**原因**：计算公式参数不完整

**解决方案**：
```typescript
// 检查组件规格
console.log('CPU 规格:', cpu.specs);

// 确保必需字段存在
if (!cpu.specs.cores || !cpu.specs.baseClock) {
  console.warn('CPU 规格不完整');
}

// 使用 Supabase 数据获取准确评分
const manager = new BenchmarkManager({
  useSupabaseData: true,
});
```

### 问题 3：缓存问题

**原因**：缓存过期或数据过时

**解决方案**：
```typescript
// 清除缓存
manager.clearCache();

// 设置更短的缓存时间
manager.setParams({ cacheExpiry: 600000 }); // 10 分钟

// 禁用缓存
manager.setParams({ enableCache: false });
```

## 📚 相关资源

- [跑分类型定义](../types/benchmark.ts)
- [Supabase 集成](../lib/benchmark/supabase-benchmark.ts)
- [性能计算算法](../lib/benchmark/performance-calculator.ts)
- [跑分管理器](../lib/benchmark/benchmark-manager.ts)
- [完整示例页面](../app/examples/benchmark-demo.tsx)

## 🎉 总结

硬件性能跑分系统提供：

✅ **双模式评分** - Supabase 数据 + 计算公式
✅ **多维度评估** - 单核/多核/游戏/生产力
✅ **智能缓存** - 提升性能，减少请求
✅ **组件对比** - 快速对比性能差异
✅ **系统报告** - 完整的性能分析
✅ **优化建议** - 针对性的升级建议
✅ **可扩展性** - 支持自定义权重和算法

现在可以在配置器中使用跑分系统，为用户提供专业的性能评估！
