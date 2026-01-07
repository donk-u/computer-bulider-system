# 兼容性检查系统使用指南

## 概述

完整的 TypeScript 兼容性规则系统，用于检查 PC 硬件组件之间的兼容性。

## 功能特性

- ✅ 类型安全的组件定义
- ✅ 预定义的兼容性规则（100+ 条规则）
- ✅ 灵活的规则系统
- ✅ 实时兼容性监控
- ✅ 智能优化建议
- ✅ 兼容性评分系统
- ✅ 报告导出功能

## 文件结构

```
types/
└── compatibility.ts                 # 类型定义和规则（12KB）

lib/
└── compatibility-checker.ts       # 检查工具和监控器（10KB）
```

## 快速开始

### 1. 导入类型

```tsx
import {
  Component,
  ComponentType,
  ComponentSpecs,
  CompatibilityRule,
  CompatibilityCheckResult,
} from '@/types/compatibility'
```

### 2. 检查组件兼容性

```tsx
import { validateComponentPair } from '@/lib/compatibility-checker'

const cpu: Component = {
  id: '1',
  type: 'cpu',
  brand: 'AMD',
  model: 'Ryzen 7 5800X',
  specs: {
    socket: 'AM4',
    cores: 8,
    threads: 16,
    baseClock: 3800,
    boostClock: 4800,
    tdp: 105,
  },
  price: 2199,
}

const motherboard: Component = {
  id: '2',
  type: 'motherboard',
  brand: 'ASUS',
  model: 'ROG STRIX B550-F',
  specs: {
    socket: 'AM4',
    formFactor: 'ATX',
    chipset: 'B550',
    memoryType: 'DDR4',
    memorySlots: 4,
    maxMemorySpeed: 4800,
    maxMemoryCapacity: 128,
    pcieVersion: 'PCIe4.0',
  },
  price: 1299,
}

const result = validateComponentPair(cpu, motherboard)

console.log(result)
// {
//   isCompatible: true,
//   message: '组件兼容',
//   severity: 'info',
//   issues: []
// }
```

### 3. 检查系统配置

```tsx
import { validateSystemConfiguration } from '@/lib/compatibility-checker'

const components = new Map<ComponentType, Component>([
  ['cpu', cpu],
  ['motherboard', motherboard],
  ['ram', ram],
  ['gpu', gpu],
])

const result = validateSystemConfiguration(components)

console.log(result)
// {
//   isCompatible: true,
//   message: '组件兼容',
//   severity: 'info',
//   issues: [],
//   suggestions: ['请检查上述不兼容的组件', '考虑更换不兼容的组件']
// }
```

### 4. 实时监控

```tsx
import { CompatibilityMonitor } from '@/lib/compatibility-checker'

const monitor = new CompatibilityMonitor(components)

// 添加监听器
const unsubscribe = monitor.addListener((score) => {
  console.log('新评分:', score)
  // 更新 UI
})

// 更新组件
monitor.updateComponent(newCpu)

// 移除组件
monitor.removeComponent('ram')

// 获取当前评分
const currentScore = monitor.getScore()

// 获取等级
const grade = monitor.getGrade()

// 清理监听器
unsubscribe()
```

### 5. 快速检查

```tsx
import { quickCompatibilityCheck } from '@/lib/compatibility-checker'

const result = quickCompatibilityCheck(
  newComponent,
  existingComponents
)

console.log(result)
// {
//   canAdd: true,
//   reasons: [],
//   warnings: ['CPU 频率可能导致主板稳定性问题']
// }
```

## 组件类型

### ComponentType

支持的 8 种组件类型：

```typescript
type ComponentType =
  | 'cpu'          // CPU
  | 'gpu'          // 显卡
  | 'motherboard'   // 主板
  | 'ram'          // 内存
  | 'storage'       // 存储
  | 'psu'          // 电源
  | 'case'          // 机箱
  | 'cooling'      // 散热
```

### ComponentSpecs

每种组件类型有不同的规格字段：

#### CPU 规格
- `socket?: string`           // 插槽类型
- `cores?: number`           // 核心数
- `threads?: number`        // 线程数
- `baseClock?: number`      // 基础频率
- `boostClock?: number`     // 加速频率
- `tdp?: number`           // 热设计功耗

#### GPU 规格
- `vram?: number`           // 显存
- `pcie?: string`          // PCIe 接口
- `tdp?: number`           // 热设计功耗
- `length?: number`         // 长度

#### 主板规格
- `socket?: string`          // CPU 插槽
- `formFactor?: string`       // 板型
- `chipset?: string`         // 芯片组
- `memoryType?: string`       // 内存类型
- `memorySlots?: number`      // 内存插槽
- `maxMemorySpeed?: number`  // 最大内存频率
- `maxMemoryCapacity?: number // 最大内存容量

#### 内存规格
- `type?: string`            // DDR4, DDR5
- `capacity?: number`        // 容量（GB）
- `speed?: number`          // 频率（MHz）
- `modules?: number`        // 模组数量
- `ecc?: boolean`          // 是否支持 ECC

#### 存储规格
- `type?: string`            // SSD, HDD, NVMe
- `interface?: string`       // SATA, NVMe
- `capacity?: number`        // 容量
- `speed?: number`          // 速度

#### 电源规格
- `wattage?: number`         // 功率（W）
- `efficiency?: string`       // 效率等级
- `modular?: boolean`        // 是否模组
- `length?: number`          // 长度

#### 机箱规格
- `formFactor?: string`       // ATX, Micro-ATX, ITX
- `maxLength?: number`       // 最大显卡长度
- `maxWidth?: number`        // 最大散热器高度
- `driveBays?: string`       // 驱动器位

#### 散热规格
- `type?: string`            // Air, Liquid, AIO
- `socket?: string`          // 支持 CPU 插槽
- `tdp?: number`           // 最大 TDP
- `height/width/depth`       // 尺寸
- `noiseLevel?: number`      // 噪音等级

## 兼容性规则

### 预定义规则系统

系统包含 7 组主要规则：

1. **CPU 与主板**（3 条规则）
   - 插槽匹配
   - TDP 限制
   - 频率兼容性

2. **内存与主板**（4 条规则）
   - 类型匹配
   - 频率限制
   - 插槽数量
   - 容量限制

3. **GPU 与主板**（2 条规则）
   - PCIe 版本兼容
   - 长度限制

4. **存储与主板**（1 条规则）
   - 接口兼容

5. **电源与系统**（3 条规则）
   - 板型匹配
   - GPU 功率需求
   - 机箱长度限制

6. **散热与 CPU**（2 条规则）
   - 插槽匹配
   - TDP 限制

7. **机箱与主板/GPU/散热**（3 条规则）
   - 板型匹配
   - GPU 长度限制
   - 散热器高度限制

### 严重级别

- `error`: 不兼容，无法工作
- `warning`: 可能有问题，需要注意
- `info`: 信息提示

## 工具函数

### validateComponentPair()

检查两个组件之间的兼容性：

```tsx
const result = validateComponentPair(cpu, motherboard)

result: {
  isCompatible: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  issues?: CompatibilityIssue[]
}
```

### validateSystemConfiguration()

检查整个系统配置的兼容性：

```tsx
const result = validateSystemConfiguration(components)

result: {
  isCompatible: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  issues: CompatibilityIssue[]
  suggestions: string[]
}
```

### quickCompatibilityCheck()

快速检查组件是否可以添加：

```tsx
const result = quickCompatibilityCheck(newComponent, existingComponents)

result: {
  canAdd: boolean
  reasons: string[]
  warnings: string[]
}
```

### calculateCompatibilityScore()

计算系统兼容性评分：

```tsx
const score = calculateCompatibilityScore(components)

// 评分规则：
// - 完美：无错误，90-100 分
// - 良好：无错误但有警告，70-89 分
// - 一般：有错误，50-69 分
// - 不兼容：多个错误，0-49 分
```

### getCompatibilityGrade()

获取兼容性等级：

```tsx
const { grade, color, icon } = getCompatibilityGrade(score)

// score >= 90: 完美 ⭐⭐⭐
// score >= 70: 良好 ⭐⭐
// score >= 50: 一般 ⭐
// score < 50: 不兼容 ❌
```

### getOptimizationSuggestions()

生成系统优化建议：

```tsx
const suggestions = getOptimizationSuggestions(components)

// 智能分析：
// - CPU/GPU 瓶颈检测
// - 内存容量建议
// - 双通道内存建议
// 等等...
```

### exportCompatibilityReport()

导出兼容性报告：

```tsx
// 文本格式
const textReport = exportCompatibilityReport(components, 'text')

// JSON 格式
const jsonReport = exportCompatibilityReport(components, 'json')
```

## CompatibilityMonitor 类

实时监控组件变化的类：

```tsx
const monitor = new CompatibilityMonitor(initialComponents)

// 添加监听器
const unsubscribe = monitor.addListener((score) => {
  console.log('评分变化:', score)
})

// 更新组件
monitor.updateComponent(newCpu)

// 获取当前状态
const score = monitor.getScore()
const grade = monitor.getGrade()

// 清理
unsubscribe()
```

## CompatibilityQueryTool 工具类

规则查询工具：

```tsx
// 查找影响某个组件的所有规则
const rules = CompatibilityQueryTool.findRulesAffecting('cpu')

// 查找两个组件类型之间的所有规则
const rules = CompatibilityQueryTool.findRulesBetween('cpu', 'motherboard')

// 获取组件兼容性矩阵
const matrix = CompatibilityQueryTool.getCompatibilityMatrix()
```

## 使用示例

查看完整示例：`app/examples/compatibility-example.tsx`

运行示例：
```bash
npm run dev
# 访问 http://localhost:3000/examples/compatibility-example
```

## 集成到应用

### 在 BuilderLayout 中使用

```tsx
import { validateSystemConfiguration } from '@/lib/compatibility-checker'

function BuilderPage() {
  const [components] = useState<Map<ComponentType, Component>>()

  const checkCompatibility = () => {
    const result = validateSystemConfiguration(components)
    if (!result.isCompatible) {
      // 显示错误
    }
  }

  return (
    <BuilderLayout>
      <Button onClick={checkCompatibility}>
        检查兼容性
      </Button>
    </BuilderLayout>
  )
}
```

### 在组件选择中实时显示

```tsx
import { quickCompatibilityCheck } from '@/lib/compatibility-checker'

function ComponentSelector() {
  const [newComponent, setNewComponent] = useState<Component | null>(null)
  const [existingComponents] = useState<Map<ComponentType, Component>>(...)

  const handleComponentSelect = () => {
    const result = quickCompatibilityCheck(newComponent!, existingComponents)

    if (result.canAdd) {
      // 添加组件
    } else {
      // 显示警告
      result.reasons.forEach(reason => alert(reason))
    }
  }

  return (
    <ComponentList onSelect={setNewComponent} onAdd={handleComponentSelect} />
  )
}
```

## 扩展指南

### 添加新的兼容性规则

编辑 `types/compatibility.ts`：

```tsx
export const customRules: CompatibilityRule[] = [
  {
    componentA: 'cpu',
    componentB: 'gpu',
    check: (cpu, gpu) => {
      // 自定义检查逻辑
      return true
    },
    message: '自定义规则描述',
    severity: 'warning',
  },
  // 添加更多规则...
]
```

### 自定义评分算法

修改 `calculateCompatibilityScore()` 函数：

```tsx
export function calculateCompatibilityScore(
  components: Map<ComponentType, Component>
): number {
  // 自定义评分逻辑
  const { isCompatible, issues } = checkSystemCompatibility(components)

  if (!isCompatible) return 0

  // 基础分
  let score = 100

  // 扣分规则
  issues.forEach(issue => {
    if (issue.severity === 'error') {
      score -= 30  // 每个错误扣 30 分
    } else if (issue.severity === 'warning') {
      score -= 10  // 每个警告扣 10 分
    }
  })

  return Math.max(0, score)
}
```

## API 参考

### 类型导出

```typescript
export type ComponentType
export interface Component
export interface ComponentSpecs
export interface CompatibilityRule
export interface CompatibilityCheckResult
export interface CompatibilityIssue
export type ComponentPair
export const componentTypeNames
export const componentTypeIcons
```

### 规则导出

```typescript
export const cpuMotherboardRules
export const ramMotherboardRules
export const gpuMotherboardRules
export const storageMotherboardRules
export const psuSystemRules
export const coolingCpuRules
export const caseMotherboardRules
export const getAllRules()
export const getRulesForComponentPair()
```

### 函数导出

```typescript
export function checkCompatibility()
export function checkSystemCompatibility()
export function validateComponentPair()
export function formatCompatibilityResult()
export function generateCompatibilityReport()
export function getOptimizationSuggestions()
export function calculateCompatibilityScore()
export function getCompatibilityGrade()
export class CompatibilityMonitor
export const CompatibilityQueryTool
```

## 最佳实践

1. **类型安全**
   - 使用 TypeScript 类型定义所有数据结构
   - 避免使用 `any` 类型

2. **规则管理**
   - 将规则集中定义，便于维护
   - 使用严重级别区分错误和警告

3. **性能优化**
   - 避免在渲染函数中进行计算
   - 使用 useMemo 缓存计算结果

4. **用户反馈**
   - 提供清晰的错误消息
   - 给出具体的解决建议

5. **测试覆盖**
   - 为每个兼容性规则编写测试用例
   - 测试边界情况和异常场景

## 故障排除

### 组件不显示

检查 Component 类型是否正确：

```tsx
// ✅ 正确
const cpu: Component = {
  type: 'cpu',  // 类型字段
  // ...
}

// ❌ 错误
const cpu: Component = {
  type: 'CPU',  // 大写错误
  // ...
}
```

### 检查不工作

确认调用了检查函数：

```tsx
// ✅ 正确
const result = validateComponentPair(cpu, motherboard)
if (!result.isCompatible) {
  // 处理不兼容
}

// ❌ 错误
validateComponentPair(cpu, motherboard)
// 忘记处理返回值
```

### 评分不准确

检查评分算法是否符合预期：

```tsx
// 调试评分计算
const score = calculateCompatibilityScore(components)
console.log('评分:', score)

// 100 = 完美
// 70-89 = 良好
// 50-69 = 一般
// 0-49 = 不兼容
```

## 技术栈

- **TypeScript** - 类型系统
- **React Hooks** - 状态管理
- **Framer Motion** - 动画效果
- **无依赖** - 纯 TypeScript 实现

## 许可证

MIT License - 与主项目保持一致
