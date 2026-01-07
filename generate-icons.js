/**
 * 图标生成辅助脚本
 * Icon Generation Helper Script
 *
 * 使用说明：
 * 1. 选择一个 AI 图标生成工具（推荐：IconPark、Recraft.ai、DALL-E 3）
 * 2. 从 AI_PROMPTS.txt 复制对应的提示词
 * 3. 生成图标后，使用此脚本验证和整理
 */

const fs = require('fs');
const path = require('path');

// 图标配置
const iconConfig = {
  components: {
    path: 'images/icons/components',
    size: 128,
    icons: [
      'cpu', 'cpu-lga1700', 'cpu-am4', 'cpu-am5',
      'gpu', 'gpu-nvidia', 'gpu-amd',
      'motherboard', 'motherboard-z790', 'motherboard-b660',
      'memory', 'memory-ddr4', 'memory-ddr5',
      'storage', 'storage-ssd', 'storage-hdd', 'storage-nvme',
      'power', 'power-550w', 'power-750w',
      'case', 'case-atx', 'case-matx',
      'cooler', 'cooler-air', 'cooler-water'
    ]
  },
  ui: {
    path: 'images/icons/ui',
    size: 48,
    icons: [
      'back', 'home', 'forward', 'close', 'more', 'menu', 'refresh',
      'search', 'filter', 'sort', 'clear',
      'edit', 'delete', 'copy', 'paste', 'save',
      'upload', 'download', 'image', 'file',
      'confirm', 'cancel', 'check', 'cross',
      'settings', 'help', 'info', 'arrow_down', 'arrow_up'
    ]
  },
  social: {
    path: 'images/icons/social',
    size: 48,
    icons: [
      'like', 'like-active',
      'save', 'save-active',
      'star', 'star-active',
      'comment', 'reply', 'share'
    ]
  },
  status: {
    path: 'images/icons/status',
    size: 64,
    icons: [
      'success', 'success_circle', 'check_circle',
      'error', 'error_circle', 'close_circle',
      'warning', 'warning_circle',
      'info', 'info_circle',
      'loading', 'loading_circle',
      'empty', 'no_data', 'no_result'
    ]
  },
  tabbar: {
    path: 'images/tabbar',
    size: 81,
    icons: [
      'home', 'home-active',
      'builder', 'builder-active',
      'community', 'community-active',
      'profile', 'profile-active'
    ]
  },
  placeholder: {
    path: 'images/placeholder',
    size: 400,
    icons: ['component', 'build', 'user', 'post']
  }
};

/**
 * 创建目录结构
 */
function createDirectoryStructure() {
  console.log('📁 创建目录结构...\n');

  const categories = Object.keys(iconConfig);

  categories.forEach(category => {
    const dirPath = path.join(__dirname, 'pcbuilder', iconConfig[category].path);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ 创建目录: ${iconConfig[category].path}`);
    } else {
      console.log(`📂 目录已存在: ${iconConfig[category].path}`);
    }
  });

  console.log('\n📋 目录结构创建完成！\n');
  return true;
}

/**
 * 验证图标文件
 */
function validateIcons() {
  console.log('🔍 验证图标文件...\n');

  const categories = Object.keys(iconConfig);
  const missingIcons = [];
  const existingIcons = [];

  categories.forEach(category => {
    const config = iconConfig[category];
    console.log(`\n📦 ${category.toUpperCase()} (${config.size}×${config.size}px)`);

    config.icons.forEach(iconName => {
      const filePath = path.join(__dirname, 'pcbuilder', config.path, `${iconName}.png`);

      if (fs.existsSync(filePath)) {
        existingIcons.push(`${config.path}/${iconName}.png`);
        console.log(`  ✅ ${iconName}.png`);
      } else {
        missingIcons.push(`${config.path}/${iconName}.png`);
        console.log(`  ❌ ${iconName}.png (缺失)`);
      }
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log(`📊 统计结果:`);
  console.log(`  ✅ 已存在: ${existingIcons.length} 个`);
  console.log(`  ❌ 缺失: ${missingIcons.length} 个`);
  console.log(`  📦 总计: ${existingIcons.length + missingIcons.length} 个`);
  console.log('='.repeat(60));

  if (missingIcons.length > 0) {
    console.log('\n⚠️  缺失的图标:');
    missingIcons.forEach(icon => console.log(`  - ${icon}`));
  }

  return {
    existing: existingIcons,
    missing: missingIcons,
    total: existingIcons.length + missingIcons.length
  };
}

/**
 * 生成检查清单
 */
function generateChecklist() {
  console.log('📋 生成检查清单...\n');

  const categories = Object.keys(iconConfig);
  let checklist = '# 图标生成检查清单\n\n';
  checklist += '使用此清单跟踪图标生成进度。\n\n';
  checklist += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;

  categories.forEach(category => {
    const config = iconConfig[category];
    checklist += `## ${category.toUpperCase()} (${config.size}×${config.size}px)\n\n`;

    config.icons.forEach(iconName => {
      const filePath = path.join(__dirname, 'pcbuilder', config.path, `${iconName}.png`);
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅' : '⬜';

      checklist += `- [${exists ? 'X' : ' '}] ${status} ${iconName}.png\n`;
    });

    checklist += '\n';
  });

  checklist += `---\n`;
  checklist += `总计: ${Object.values(iconConfig).reduce((sum, cat) => sum + cat.icons.length, 0)} 个图标\n`;

  const filePath = path.join(__dirname, 'ICONS_CHECKLIST.md');
  fs.writeFileSync(filePath, checklist, 'utf-8');

  console.log(`✅ 检查清单已保存到: ICONS_CHECKLIST.md\n`);
}

/**
 * 生成图标映射文件（用于代码引用）
 */
function generateIconMap() {
  console.log('🗺️  生成图标映射...\n');

  const categories = Object.keys(iconConfig);
  let iconMap = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    categories: {}
  };

  categories.forEach(category => {
    const config = iconConfig[category];
    iconMap.categories[category] = {
      path: config.path,
      size: config.size,
      icons: config.icons.map(icon => ({
        name: icon,
        path: `${config.path}/${icon}.png`,
        exists: fs.existsSync(path.join(__dirname, 'pcbuilder', config.path, `${iconName}.png`))
      }))
    };
  });

  const filePath = path.join(__dirname, 'pcbuilder/images/icon-manifest.json');
  fs.writeFileSync(filePath, JSON.stringify(iconMap, null, 2), 'utf-8');

  console.log(`✅ 图标映射已保存到: pcbuilder/images/icon-manifest.json\n`);
}

/**
 * 显示使用说明
 */
function showInstructions() {
  console.log(`
═══════════════════════════════════════════════════════════════
  AI 图标生成辅助工具
═══════════════════════════════════════════════════════════════

📚 使用步骤:

1️⃣  创建目录结构
   node generate-icons.js --init

2️⃣  选择 AI 工具并生成图标
   推荐工具:
   • IconPark AI (https://iconpark.oceanengine.com/)
   • Recraft.ai (https://www.recraft.ai/)
   • DALL-E 3 (需要 ChatGPT Plus)

3️⃣  复制提示词
   从 AI_PROMPTS.txt 复制对应的提示词

4️⃣  生成并保存图标
   将生成的图标保存到对应目录

5️⃣  验证图标
   node generate-icons.js --validate

6️⃣  生成检查清单
   node generate-icons.js --checklist

📂 目录结构:
   pcbuilder/
   ├── images/
   │   ├── icons/
   │   │   ├── components/  (128×128px, 25个)
   │   │   ├── ui/          (48×48px, 28个)
   │   │   ├── social/      (48×48px, 9个)
   │   │   └── status/      (64×64px, 15个)
   │   ├── tabbar/          (81×81px, 8个)
   │   └── placeholder/     (400×400px, 4个)

📋 可用命令:
   --init       创建目录结构
   --validate   验证图标文件
   --checklist  生成检查清单
   --manifest   生成图标映射
   --all        执行所有操作

🎯 快速开始:
   node generate-icons.js --all

═══════════════════════════════════════════════════════════════
`);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  try {
    if (args.length === 0) {
      showInstructions();
      return;
    }

    if (args.includes('--init') || args.includes('--all')) {
      createDirectoryStructure();
    }

    if (args.includes('--validate') || args.includes('--all')) {
      validateIcons();
    }

    if (args.includes('--checklist') || args.includes('--all')) {
      generateChecklist();
    }

    if (args.includes('--manifest') || args.includes('--all')) {
      generateIconMap();
    }

    if (args.includes('--help')) {
      showInstructions();
    }

    console.log('\n✅ 所有操作完成！');
  } catch (error) {
    console.error('\n❌ 发生错误:', error.message);
    process.exit(1);
  }
}

// 运行
main();
