# Copero Football Career Simulator — MVP 产品需求文档 V2.0

> 品牌名称：**Copero**  
> 产品名称：**Copero Football Career Simulator**  
> 目标域名：**copero.net**（仅在你拥有或已获授权使用该域名及品牌时）  
> 产品类型：免费在线足球生涯模拟游戏  
> 主关键词：**football career simulator**  
> 目标语言：英文（MVP）  
> 优先设备：桌面与移动端响应式

## 1. 产品定位与目标

用户创建一位从 16 岁出道的虚拟足球运动员，通过训练、俱乐部选择、转会、伤病恢复等决策，模拟直到退役的职业生涯，最后获得生涯评分、故事时间线和可分享的结果卡片。

**核心差异化：** 重点突出“选择影响命运”：每个赛季的决策能改变出场机会、成长、伤病、转会和最终结局，而不是仅点击按钮随机推进赛季。

**MVP 成功标准：** 无需注册即可在约 3–5 分钟内完成一次可理解、可重复游玩的足球生涯。

> 品牌合规：copero.net 是已有网站。开发前确认该域名、Copero 名称和相关商标的控制权或使用授权；如果并非自有品牌，不应直接复用其受保护的品牌标识、页面文案、素材或外观。本 PRD 不要求克隆竞品。

## 2. 目标用户与搜索意图

- 想免费在线模拟足球运动员职业生涯的足球爱好者。
- 想创建角色、转会俱乐部、获得冠军的休闲玩家。
- 想测试不同职业选择、分享足球生涯结果的社交用户。

SEO 关键词（待关键词工具核实实际搜索量）：

- 主词：`football career simulator`
- 次词：`free football career simulator`、`soccer career simulator`、`football career game`、`create your own football player`

## 3. MVP 功能范围

### P0-1 创建球员

**字段：** Player Name、Nationality、Position（ST/LW/RW/CAM/CM/CDM/LB/RB/CB/GK）、Preferred Foot（Left/Right）、Jersey Number（1–99）。

- 角色初始年龄 16 岁。
- 核心属性：Pace、Shooting、Passing、Dribbling、Defending、Physical（各 1–99）。
- 按位置给予不同初始模板；提供少量自由分配的属性点。
- OVR 按位置加权计算，不能直接取全部属性简单平均。
- 表单校验并提供合理默认值。

### P0-2 选择青训俱乐部

生成 3 家**虚构俱乐部**供选择：

| 类型 | 优势 | 代价 |
|---|---|---|
| Small Club | 出场机会较多 | 训练资源较弱 |
| Development Club | 成长条件平衡 | 竞争适中 |
| Elite Academy | 训练设施出色 | 一线队机会较少 |

每家俱乐部展示 Name、League Level、Training Quality、Playing Opportunity、Contract Salary。MVP 不需要真实队徽或受限赛事数据。

### P0-3 赛季模拟

游戏从 16 岁开始，按年度推进至主动退役或触发退役条件（建议最晚 38 岁）。每赛季展示：

- Age / Season / Club / OVR
- Appearances / Goals / Assists
- Fitness / Morale / Injury Status
- League Standing / Titles / Market Value
- 简短赛季总结：本赛季表现及主要变化原因

点击 `Next Season` 后，先完成本赛季决策再结算；避免重复点击产生两个赛季。

### P0-4 每赛季决策（核心差异化）

每赛季至少出现 1 个与当前状态有关的决策事件，包含预期收益与风险提示。

| 事件 | 可选决策 | 影响变量 |
|---|---|---|
| Training | Intensive / Balanced / Recovery | 成长、体能、伤病风险 |
| Transfer | Stay / Bigger Club / More Playing Time | 俱乐部、薪资、上场机会 |
| Coach Relationship | Follow Plan / Ask for Minutes / Change Position | 士气、教练信任、位置适配 |
| Injury Recovery | Return Early / Full Rehabilitation | 当季可用率、长期健康 |

事件需满足条件才触发，如没有伤病不能出现伤病康复选项；没有合理报价时不能保证转会成功。

**验收重点：** 相同初始条件下，改变至少一种选择会在后续赛季产生可验证的数值影响。

### P0-5 模拟引擎

使用 TypeScript 规则引擎 + **可设定种子的伪随机数**，无需调用生成式 AI 模型。

每季依次执行：

1. 依据位置属性计算有效 OVR。
2. 依据俱乐部竞争、体能、教练信任与伤病确定上场数。
3. 依据位置、上场时间与技能计算进球、助攻等预期值，再加入受限波动。
4. 根据球队实力估算战绩与夺冠机会。
5. 根据年龄、潜力、训练与伤病更新属性。
6. 判断转会、合同、奖项与退役事件。
7. 生成摘要，写入赛季历史。

**数值约束：**

- 16–22 岁以成长为主，23–29 岁较可能达到巅峰，30 岁后衰退风险逐渐上升；不同球员存在变异。
- 位置影响进球、助攻、能力评级及生涯评分，GK/DEF 不能仅因进球少而低分。
- 属性始终 1–99；出场、进球、助攻不能为负且应有合理上限。
- 相同 seed + 相同完整决策序列，结果必须完全一致。
- 模拟规则集中管理、带单元测试；不要在 UI 中散落随机公式。

**建议数据类型：**

```ts
type Attributes = {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
};

type Player = {
  id: string;
  name: string;
  nationality: string;
  position: 'ST' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'LB' | 'RB' | 'CB' | 'GK';
  preferredFoot: 'Left' | 'Right';
  jerseyNumber: number;
  age: number;
  attributes: Attributes;
  potential: number;
  fitness: number;
  morale: number;
  coachTrust: number;
  injuryStatus: 'healthy' | 'minor' | 'major';
  clubId: string;
  careerHistory: Season[];
};
```

`Season`、`Club`、`Decision`、`CareerResult` 和 `GameState` 由开发阶段补齐明确接口，并用版本号保证存档可迁移。

### P0-6 退役及结局

退役时展示：Matches、Goals、Assists、Trophies、Peak OVR、Clubs Played For、Career Legacy Score（0–100）。

五种结局：

1. Football Legend
2. World-Class Star
3. Club Hero
4. Professional Veteran
5. Unfulfilled Potential

评分结合位置、球员巅峰、个人产出、集体荣誉、稳定性和职业长度，结局通过透明阈值确定。避免使用未授权赛事或奖项商标进行误导性宣传。

### P0-7 存档与恢复

- 使用 `localStorage` 自动保存当前球员、seed、决策历史及模拟进度。
- 刷新页面后可以恢复最近一次游戏。
- 提供 `New Career`，二次确认后可重开。
- 处理旧版/损坏存档，不能导致白屏。

### P1-1 生涯可视化与分享

- 时间线：青训首秀、第一次进球/关键表现、主要转会、冠军、巅峰、退役。
- 使用折线图展示逐季 OVR、进球等变化。
- 生成 1080 × 1350 结果卡片：玩家名、国籍、Peak OVR、核心统计、结局、Copero 品牌与域名。
- 按钮：`Download Image`、`Copy Share Link`、`Play Again`。
- **真实分享链接**需要服务端持久化结果（例如 Cloudflare D1），不可把仅存在本地的结果链接宣传为他人可访问。后端未实现前只开放下载卡片，并隐藏分享链接按钮。

## 4. 页面与体验

| 路由 | 页面 | 目的 |
|---|---|---|
| `/` | Homepage | SEO 落地 + 创建球员入口 |
| `/career` | Career Simulator | 属性、决策、赛季统计、推进按钮 |
| `/career/result/[id]` | Career Result | 可分享结果（P1 后端就绪后开放） |
| `/how-it-works` | How It Works | 玩法、计算规则、评分解释 |

**首页结构：** Navigation → Hero → Create Player → How It Works → Unique Decisions → Sample Career → FAQ → Footer。

**UI 原则：** 原创深色/足球比赛数据风格；移动端优先保持表单及赛季决策易用；关键数值变化明确解释；按钮含 loading / disabled / error 状态；支持键盘操作和基本无障碍语义。

## 5. SEO / GEO 方案

### 首页 TDH

- **Title:** `Copero – Free Football Career Simulator Online`
- **Meta Description:** `Play Copero, a free football career simulator. Create your player, make career decisions, transfer clubs, win trophies, and build your football legacy.`
- **H1:** `Copero Football Career Simulator`
- **Hero subtitle:** `Create your player. Make career-changing decisions. Join new clubs, win trophies, and shape your football legacy.`

### 建议 FAQ（上线内容必须与实际功能一致）

1. What is Copero Football Career Simulator?
2. Is Copero free to play?
3. How do I create my own football player?
4. Can I change clubs during my career?
5. How do my decisions affect my career?
6. How are player stats and career scores calculated?
7. Can I save or share my football career?

### 技术 SEO

- 首页和规则页可由搜索引擎获取静态内容；不要仅靠 JS 渲染所有 SEO 文案。
- 设置正确 canonical、sitemap.xml、robots.txt、Open Graph。
- 使用符合真实页面内容的 `VideoGame` 或 `WebApplication` 结构化数据，避免虚假评分。
- 私人游戏进行中页面设为 `noindex`；结果页默认 `noindex`，除非有明确的高质量可索引内容策略。
- FAQ 不堆关键词，不承诺搜索结果必然显示富摘要。

## 6. 技术架构

- **Frontend:** Next.js + TypeScript + Tailwind CSS（复用现有工程组件与约定）。
- **UI:** shadcn/ui（若项目已有其他组件库，优先复用）。
- **State:** Zustand 或项目现有状态管理。
- **Simulation:** 纯 TypeScript、可测试的规则模块。
- **Storage P0:** localStorage。
- **Charts P1:** Recharts。
- **Share P1:** Cloudflare D1 存储结果快照，生成不可预测 ID，实施长度与频率限制。
- **Deployment:** 优先沿用现有 Cloudflare 部署方式，检查 Next.js 版本及适配器兼容性后实施。

不需要接入 OpenAI、Seedance、视频生成 API 或付费系统。

## 7. 数据与内容来源

- P0 使用虚构俱乐部、联赛及自定义评分规则。
- 不需要调用真实足球比赛 API。
- 如未来接入真实球员、赛事标识、球队队徽或实时统计，先核实数据来源、商业使用条款及商标/肖像使用权。

## 8. 不在 MVP 范围

- 3D/实时可视化比赛
- 多人在线对抗
- 真球队/球员数据授权整合
- AI 视频生成
- 订阅付费
- 每日排行榜、每日挑战
- 多语言系统（后续可增加西语）

## 9. 验收标准

1. 无需注册可创建球员并完整模拟到退役。
2. 10 个位置均可正常创建、结算及评分。
3. 每季至少一个合条件且影响后续状态的决策事件。
4. 固定 seed 与完整选择序列的输出完全一致。
5. 游戏进程可刷新后恢复，损坏存档有兜底。
6. 赛季历史总和与退役统计一致，数值不越界。
7. 伤病、转会、体能和年龄规则有自动化测试。
8. 退役结果显示评分和决定该评分的主要原因。
9. P1 分享开启后，其他设备能用链接查看同一结果。
10. 首页 SEO TDH、canonical、sitemap、robots、移动端布局有效。
11. 完成 lint、typecheck、build、核心测试，并列出真实结果与未完成事项。

## 10. 开发顺序

**阶段 A（P0，可发布）：** 项目与品牌配置 → 数据模型 → 纯函数模拟引擎 → 创建球员 → 俱乐部选择 → 决策与赛季页面 → 存档 → 退役结果 → 自动化测试 → SEO。

**阶段 B（P1）：** 生涯时间线 → 结果图片生成 → D1 分享快照 → 跨设备打开验证。

**阶段 C（P2，验证留存后）：** 每日挑战、排行榜、竞猜游戏、更多剧情、多语言。

## 11. 交给 Claude Code 的执行要求

1. 先检查当前项目代码、package.json、路由、部署配置及已有数据模型，列出要保留和要修改的模块。
2. 按本 PRD 将网站品牌统一为 **Copero**，包括页面标题、导航、Footer、metadata、OG、分享卡片、Logo 文本及游戏内文案；不得遗留 `Football Destiny`。
3. **不要克隆 copero.net 的源代码、文案、Logo 或 UI 版式**；实现原创的决策驱动游戏体验。
4. 先保证 P0 完整可玩，再做 P1；未实现的功能不要出现假按钮或假宣传。
5. 模拟引擎必须独立于 UI、具备确定性和自动化测试。
6. 避免破坏现有部署、环境变量与项目中其他可用功能。
7. 完成后输出：改动文件清单、可运行功能、测试执行结果、环境变量需求、未实现项和上线风险。
