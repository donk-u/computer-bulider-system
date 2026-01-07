# Builder Store 使用指南

使用 Zustand 管理配置器的状态，包括组件选择、价格计算、兼容性检查和持久化存储。

## 📁 文件结构

```
lib/store/
└── builder-store.ts           # Zustand store 定义

app/examples/
└── builder-store-demo.tsx   # 完整示例页面
```

## 🚀 快速开始

### 1. 基础用法

```tsx
import { useBuilderStore } from '@/lib/store/builder-store';

function MyComponent() {
  const { selectedComponents, addComponent, removeComponent } = useBuilderStore();

  const handleAdd = () => {
    addComponent('cpu', {
      id: 'cpu-1',
      categorySlug: 'cpu',
      brand: 'AMD',
      model: 'Ryzen 7 5800X',
      fullName: 'AMD Ryzen 7 5800X',
      price: 299,
      specs: { /* ... */ },
      imageUrl: '',
    });
  };

  return (
    <div>
      <div>总价格: ${totalPrice}</div>
      <div>兼容性评分: {compatibilityScore}</div>
      <button onClick={handleAdd}>添加 CPU</button>
    </div>
  );
}
```

### 2. 使用选择器（性能优化）

```tsx
import { useBuilderStore, selectTotalPrice, selectComponentCount } from '@/lib/store/builder-store';

function PriceDisplay() {
  // 只订阅 totalPrice 的变化
  const totalPrice = useBuilderStore(selectTotalPrice);
  
  return <div>总价格: ${totalPrice}</div>;
}

function ComponentCount() {
  // 只订阅组件数量的变化
  const count = useBuilderStore(selectComponentCount);
  
  return <div>已选组件: {count}</div>;
}
```

## 📦 Store API

### 状态（State）

| 状态 | 类型 | 说明 |
|-----|------|------|
| `selectedComponents` | `Record<string, Component>` | 已选择的组件映射 |
| `totalPrice` | `number` | 总价格（自动计算） |
| `compatibilityIssues` | `CompatibilityIssue[]` | 兼容性问题列表 |
| `compatibilityScore` | `number` | 兼容性评分 (0-100) |
| `isLoading` | `boolean` | 是否正在加载 |
| `lastSavedAt` | `string \| null` | 最后保存时间 |

### 方法（Actions）

#### addComponent(type, component)
添加或替换组件。

```tsx
addComponent('cpu', component);
```

**参数**：
- `type: string` - 组件类型（cpu, gpu, motherboard, ram, storage, psu, case, cooling）
- `component: Component` - 组件对象

**行为**：
- 如果类型不存在：添加新组件
- 如果类型已存在：替换现有组件
- 自动更新总价格
- 自动检查兼容性
- 自动更新评分

#### removeComponent(type)
移除组件。

```tsx
removeComponent('cpu');
```

**参数**：
- `type: string` - 组件类型

**行为**：
- 从配置中移除指定类型组件
- 重新计算价格
- 重新检查兼容性
- 更新评分

#### clearBuild()
清空所有配置。

```tsx
clearBuild();
```

**行为**：
- 清空所有已选组件
- 重置价格为 0
- 清空兼容性问题
- 重置评分为 100

#### checkCompatibility()
检查兼容性。

```tsx
const issues = checkCompatibility();
```

**返回**：
- `CompatibilityIssue[]` - 兼容性问题列表

**行为**：
- 检查所有组件间的兼容性
- 生成问题列表
- 更新评分

#### saveToLocalStorage()
保存到本地存储。

```tsx
const success = saveToLocalStorage();
```

**返回**：
- `boolean` - 是否保存成功

**行为**：
- 将当前配置保存到 localStorage
- 更新 lastSavedAt 时间戳

#### loadFromLocalStorage()
从本地存储加载。

```tsx
const success = loadFromLocalStorage();
```

**返回**：
- `boolean` - 是否加载成功

**行为**：
- 从 localStorage 读取配置
- 恢复组件和价格
- 重新检查兼容性

#### exportConfig()
导出配置为 JSON 字符串。

```tsx
const json = exportConfig();
```

**返回**：
- `string` - JSON 字符串

**格式**：
```json
{
  "version": "1.0",
  "exportDate": "2024-01-05T...",
  "totalPrice": 1999,
  "components": {
    "cpu": { /* ... */ },
    "gpu": { /* ... */ }
  }
}
```

#### importConfig(json)
从 JSON 导入配置。

```tsx
const success = importConfig(jsonString);
```

**参数**：
- `json: string` - JSON 字符串

**返回**：
- `boolean` - 是否导入成功

#### getCompatibilityGrade()
获取兼容性等级。

```tsx
const grade = getCompatibilityGrade();
// 'perfect' | 'good' | 'fair' | 'incompatible'
```

**评分规则**：
- `score >= 90`: perfect（完美）
- `score >= 70`: good（良好）
- `score >= 50`: fair（一般）
- `score < 50`: incompatible（不兼容）

#### setComponents(components)
批量设置组件。

```tsx
setComponents({
  cpu: cpuComponent,
  gpu: gpuComponent,
  motherboard: moboComponent,
});
```

**参数**：
- `components: Record<string, Component>` - 组件映射

#### getComponentStats()
获取组件统计信息。

```tsx
const stats = getComponentStats();
// {
//   totalComponents: 3,
//   totalPrice: 1500,
//   categories: ['cpu', 'gpu', 'motherboard'],
//   missingCategories: ['ram', 'storage', 'psu', 'case', 'cooling']
// }
```

#### canAddComponent(component)
检查组件是否可以添加。

```tsx
const { canAdd, reason } = canAddComponent(component);
```

**参数**：
- `component: Component` - 要添加的组件

**返回**：
```typescript
{
  canAdd: boolean;
  reason?: string;  // 不能添加的原因
}
```

#### resetToDefault()
重置为默认配置。

```tsx
resetToDefault();
```

## 🎯 选择器（Selectors）

为了性能优化，提供了内置选择器，只订阅特定的状态变化。

### selectTotalPrice
```tsx
const totalPrice = useBuilderStore(selectTotalPrice);
```

### selectComponentCount
```tsx
const componentCount = useBuilderStore(selectComponentCount);
```

### selectCompatibilityScore
```tsx
const compatibilityScore = useBuilderStore(selectCompatibilityScore);
```

### selectIsBuildComplete
```tsx
const isComplete = useBuilderStore(selectIsBuildComplete);
// 所有组件都已选择且兼容性评分 >= 70
```

## 💾 持久化

### 自动持久化

Store 使用 Zustand 的 `persist` 中间件，自动将以下状态保存到 localStorage：

```typescript
partialize: (state) => ({
  selectedComponents: state.selectedComponents,
  totalPrice: state.totalPrice,
  lastSavedAt: state.lastSavedAt,
})
```

**注意**：
- `compatibilityIssues` 和 `compatibilityScore` 不会持久化（动态计算）
- localStorage key: `pc-builder-storage`

### 手动保存/加载

```tsx
// 保存到自定义位置
saveToLocalStorage();

// 从 localStorage 加载
loadFromLocalStorage();

// 导出为 JSON
const json = exportConfig();

// 从 JSON 导入
importConfig(json);
```

## 🔄 实时更新

### 监听 Store 变化

```tsx
import { subscribeToBuilderStore } from '@/lib/store/builder-store';

useEffect(() => {
  const unsubscribe = subscribeToBuilderStore((state) => {
    console.log('Store updated:', state);
  });

  return () => unsubscribe();
}, []);
```

### 响应式 UI

```tsx
function ComponentSelector() {
  const { selectedComponents, addComponent } = useBuilderStore();
  
  return (
    <div>
      {selectedComponents.cpu ? (
        <div>CPU: {selectedComponents.cpu.fullName}</div>
      ) : (
        <button onClick={() => addComponent('cpu', component)}>
          选择 CPU
        </button>
      )}
    </div>
  );
}
```

## 📊 统计信息

### 获取详细统计

```tsx
const stats = getComponentStats();

console.log(stats);
// {
//   totalComponents: 5,
//   totalPrice: 1500,
//   categories: ['cpu', 'gpu', 'motherboard', 'ram', 'storage'],
//   missingCategories: ['psu', 'case', 'cooling']
// }
```

### 显示进度

```tsx
function ProgressIndicator() {
  const { selectedComponents } = useBuilderStore();
  const totalTypes = 8; // cpu, gpu, motherboard, ram, storage, psu, case, cooling
  const progress = (Object.keys(selectedComponents).length / totalTypes) * 100;
  
  return (
    <div>
      <Progress value={progress} />
      <div className="text-sm mt-2">完成度: {Math.round(progress)}%</div>
    </div>
  );
}
```

## ⚠️ 最佳实践

### 1. 使用选择器优化性能

```tsx
// ❌ 不好：订阅整个 store
function PriceDisplay() {
  const { totalPrice, selectedComponents } = useBuilderStore();
  return <div>${totalPrice}</div>;
}

// ✅ 好：只订阅需要的状态
function PriceDisplay() {
  const totalPrice = useBuilderStore(selectTotalPrice);
  return <div>${totalPrice}</div>;
}
```

### 2. 批量操作

```tsx
// ❌ 不好：多次调用 addComponent（触发多次重新渲染）
addComponent('cpu', cpu);
addComponent('gpu', gpu);
addComponent('ram', ram);

// ✅ 好：使用 setComponents 批量设置
setComponents({
  cpu: cpu,
  gpu: gpu,
  ram: ram,
});
```

### 3. 条件检查

```tsx
function handleAddComponent(component: Component) {
  const { canAddComponent, addComponent } = useBuilderStore();
  
  const { canAdd, reason } = canAddComponent(component);
  
  if (!canAdd) {
    alert(reason);
    return;
  }
  
  addComponent(component.categorySlug, component);
}
```

### 4. 持久化策略

```tsx
// 页面卸载时自动保存
useEffect(() => {
  return () => {
    saveToLocalStorage();
  };
}, []);

// 定时自动保存
useEffect(() => {
  const interval = setInterval(() => {
    saveToLocalStorage();
  }, 30000); // 每30秒保存一次
  
  return () => clearInterval(interval);
}, []);
```

## 🎨 示例场景

### 场景 1：组件选择器

```tsx
function ComponentPicker({ type, components }: { type: string, components: Component[] }) {
  const { selectedComponents, addComponent, removeComponent } = useBuilderStore();
  const selected = selectedComponents[type];
  
  return (
    <div>
      <h3>{type}</h3>
      <div className="space-y-2">
        {components.map(component => (
          <div key={component.id} onClick={() => addComponent(type, component)}>
            {component.fullName} - ${component.price}
          </div>
        ))}
      </div>
      {selected && (
        <Button onClick={() => removeComponent(type)}>
          移除 {selected.fullName}
        </Button>
      )}
    </div>
  );
}
```

### 场景 2：价格汇总

```tsx
function PriceSummary() {
  const totalPrice = useBuilderStore(selectTotalPrice);
  const { selectedComponents } = useBuilderStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>价格汇总</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(selectedComponents).map(([type, component]) => (
            <div key={type} className="flex justify-between">
              <span>{type}</span>
              <span>${component.price}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>总计</span>
            <span className="text-green-500">${totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 场景 3：兼容性提示

```tsx
function CompatibilityIndicator() {
  const { compatibilityIssues, compatibilityScore } = useBuilderStore();
  const grade = getCompatibilityGrade();
  
  if (compatibilityIssues.length === 0) {
    return (
      <Badge variant="default" className="bg-green-500">
        ✓ 完全兼容
      </Badge>
    );
  }
  
  const hasErrors = compatibilityIssues.some(issue => issue.severity === 'error');
  
  return (
    <Badge variant={hasErrors ? "destructive" : "secondary"}>
      {hasErrors ? '⚠️ 不兼容' : '⚡ 有警告'}
    </Badge>
  );
}
```

### 场景 4：配置导入/导出

```tsx
function ConfigManager() {
  const { exportConfig, importConfig, saveToLocalStorage, loadFromLocalStorage } = useBuilderStore();
  const [importText, setImportText] = useState('');
  
  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pc-build-${Date.now()}.json`;
    a.click();
  };
  
  const handleImport = () => {
    const success = importConfig(importText);
    if (success) {
      alert('导入成功！');
      setImportText('');
    } else {
      alert('导入失败！');
    }
  };
  
  return (
    <div>
      <Button onClick={handleExport}>导出配置</Button>
      <Button onClick={handleLoad}>加载本地配置</Button>
      
      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="粘贴配置 JSON..."
      />
      <Button onClick={handleImport}>导入配置</Button>
    </div>
  );
}
```

## 🔧 高级用法

### 订阅特定状态

```tsx
// 只监听价格变化
useEffect(() => {
  const unsubscribe = useBuilderStore.subscribe(
    state => state.totalPrice,
    (price) => {
      console.log('价格变化:', price);
    }
  );
  
  return unsubscribe;
}, []);
```

### 获取 Store 状态（用于调试）

```tsx
import { getBuilderStoreState } from '@/lib/store/builder-store';

function DebugPanel() {
  const state = getBuilderStoreState();
  
  return (
    <pre>
      {JSON.stringify(state, null, 2)}
    </pre>
  );
}
```

### 自定义选择器

```tsx
const selectCpuComponent = (state: BuilderStore) => state.selectedComponents.cpu;
const selectCpuPrice = (state: BuilderStore) => state.selectedComponents.cpu?.price || 0;

function CpuInfo() {
  const cpu = useBuilderStore(selectCpuComponent);
  const cpuPrice = useBuilderStore(selectCpuPrice);
  
  if (!cpu) {
    return <div>未选择 CPU</div>;
  }
  
  return (
    <div>
      <div>{cpu.fullName}</div>
      <div>${cpuPrice}</div>
    </div>
  );
}
```

## 🐛 故障排除

### 问题：状态没有持久化

**原因**：localStorage 可能被禁用或已满。

**解决方案**：
```tsx
try {
  saveToLocalStorage();
} catch (error) {
  console.error('持久化失败:', error);
  // 提示用户
  alert('无法保存配置，请检查浏览器设置');
}
```

### 问题：导入失败

**原因**：JSON 格式不正确或缺少必需字段。

**解决方案**：
```tsx
const success = importConfig(json);
if (!success) {
  try {
    const parsed = JSON.parse(json);
    console.error('缺少字段:', parsed);
  } catch {
    console.error('JSON 格式错误');
  }
}
```

### 问题：性能问题

**原因**：订阅了过多的状态或使用了全量订阅。

**解决方案**：
```tsx
// ❌ 不好：订阅整个 store
const store = useBuilderStore();

// ✅ 好：只订阅需要的状态
const totalPrice = useBuilderStore(state => state.totalPrice);

// ✅ 更好：使用内置选择器
const totalPrice = useBuilderStore(selectTotalPrice);
```

## 📚 相关资源

- [Zustand 官方文档](https://docs.pmnd.rs/zustand)
- [兼容性检查器指南](./COMPATIBILITY_GUIDE.md)
- [完整示例页面](./app/examples/builder-store-demo.tsx)

## 🎉 总结

Builder Store 提供了完整的状态管理解决方案：

✅ **组件管理** - 添加、移除、清空组件
✅ **自动计算** - 价格、兼容性评分
✅ **持久化** - 自动/手动保存到 localStorage
✅ **导出/导入** - JSON 格式的配置文件
✅ **性能优化** - 选择器模式，精确订阅
✅ **类型安全** - 完整的 TypeScript 支持
✅ **易用性** - 简洁的 API，丰富的方法

现在可以在实际项目中使用 Builder Store 来管理配置器的状态了！
