import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const root = path.dirname(__filename);
const htmlDir = path.join(root, 'html');
fs.mkdirSync(htmlDir, { recursive: true });

const brand = '@Odin设计师求职导师';

const pages = [
  {
    id: 'p1', file: 'p1-cover.html', step: 'SALARY REPORT', kind: 'cover',
    title: '设计岗薪资，\n别只查平均数', subtitle: '城市、方向、年限，哪个最影响你的定价？',
    lead: '很多设计师查薪资，只盯一个平均数。数字越查越乱，报价还是没依据。招聘方给设计岗定价时，先看的不是“设计师平均工资”。',
    cards: [
      ['01', '城市', '岗位密度、公司预算、跳槽机会，会先决定你的价格区间。'],
      ['02', '方向', '越靠近产品决策、复杂系统和业务结果，上限通常越高。'],
      ['03', '证据', '年限不是定价凭证，项目结果和负责范围才是。'],
    ],
    chips: ['UI', 'UX', '交互', '产品设计', '品牌视觉'],
    note: '薪资不是一个数字，是“城市 + 方向 + 证据”的组合。'
  },
  {
    id: 'p2', file: 'p2-city-gap.html', step: '01 / 07', kind: 'three',
    title: '同样 3 年，\n城市先拉开差距', subtitle: '不是你不值钱，是岗位预算不一样。',
    lead: '城市先影响三件事：岗位密度、公司预算、跳槽机会。',
    cards: [
      ['高上限城市', '北京、上海、深圳', '更容易出现总部、平台业务和复杂产品线。适合冲大厂、复杂项目、管理线。'],
      ['均衡机会城市', '杭州、广州、南京、成都', '机会更依赖行业和公司类型。适合兼顾成长、生活成本和长期稳定。'],
      ['成本友好城市', '武汉、西安、长沙等', '不等于低价值，但高预算岗位更少。适合优先稳定、家庭和生活半径。'],
    ],
    note: '城市不是身份标签，是预算环境。'
  },
  {
    id: 'p3', file: 'p3-city-choice.html', step: '02 / 07', kind: 'table',
    title: '一线高薪，\n不等于都该去', subtitle: '看岗位密度，也看生活成本。',
    intro: ['这个城市有没有你的方向？', '预算高的公司类型多不多？', '跳槽失败后，还有没有第二选择？', '涨幅会不会被房租、通勤和试错成本吃掉？'],
    headers: ['城市', '更常见机会', '适合人群'],
    rows: [
      ['北京', '内容、平台、AI、B 端、增长岗位多。', '想冲复杂项目、大厂和业务影响力的人。'],
      ['上海', '品牌、消费、外企、体验设计机会更集中。', '想走品牌体验、商业设计、跨国协作的人。'],
      ['深圳', '硬件、出海、产业互联网、增长型产品多。', '能接受快节奏，想贴近产业和商业化的人。'],
      ['杭州', '电商、平台、AI 应用岗位多，但方向集中。', '目标方向明确，能进入核心业务的人。'],
    ],
    note: '去一线不是为了“听起来更值钱”，是为了进入更高预算的岗位池。'
  },
  {
    id: 'p4', file: 'p4-direction.html', step: '03 / 07', kind: 'stack',
    title: '最值钱的方向，\n都靠近业务', subtitle: '岗位名不重要，定价来自负责范围。',
    items: [
      ['产品设计 / UX', '能影响转化、留存、使用效率，预算更容易被业务接受。'],
      ['交互 / B 端设计', '复杂流程多，能证明信息架构、系统思维和跨角色协作。'],
      ['设计系统 / 平台设计', '影响多条业务线，价值不只停在单个页面。'],
      ['品牌 / 视觉', '只做物料容易被压价；能做品牌策略、增长转化、整合传播，上限才会打开。'],
    ],
    note: '岗位名不决定价格，负责范围才决定价格。'
  },
  {
    id: 'p5', file: 'p5-experience.html', step: '04 / 07', kind: 'flow',
    title: '3 年、5 年、10 年，\n涨价证据不同', subtitle: '年限只给入场券，结果决定上限。',
    steps: [
      ['3 年', '执行稳定', '规范清楚，能独立完成页面和模块，不靠别人兜底。'],
      ['5 年', '负责链路', '知道目标、约束、取舍和结果，不只是接需求。'],
      ['8-10 年', '影响结果', '能影响业务、搭方法、带协作，或负责复杂系统。'],
    ],
    warning: '如果作品集里只有界面截图，年限越高越危险。面试官会问：这些年你负责的范围变大了吗？',
    note: '年限是背景，涨薪证据要写在项目里。'
  },
  {
    id: 'p6', file: 'p6-portfolio.html', step: '05 / 07', kind: 'compare',
    title: '高薪作品集，\n不是更会排版', subtitle: '它能证明你值得更高预算。',
    badTitle: '低价信号', goodTitle: '高价信号',
    bad: ['页面很多，但看不出你解决了什么问题。', '只写“负责 UI 设计”，没有职责边界。', '只展示结果图，没有过程判断。', '没有上线结果、业务反馈或复盘。'],
    good: ['项目目标清楚：为什么做，解决什么问题。', '你的角色清楚：你负责哪一段，推动了什么。', '关键取舍清楚：为什么这样设计，不是另一种。', '结果证据清楚：效率、转化、留存、复用、反馈至少有一个。'],
    note: '想拿更高预算，先让作品集看得出你的负责范围。'
  },
  {
    id: 'p7', file: 'p7-salary-check.html', step: '06 / 07', kind: 'mistakes',
    title: '查薪资，\n别被 4 个数字骗了', subtitle: '月薪、年包、范围、样本都要拆开看。',
    items: [
      ['月薪', '不等于年包。年终、绩效、补贴、期权都可能改变总收入。'],
      ['上限', '不等于你的报价。很多上限对应更高年限或管理职责。'],
      ['平均', '不等于岗位预算。平均数会混合不同城市和级别。'],
      ['岗位名', '不等于工作内容。同样叫 UI，可能是活动视觉，也可能是复杂产品设计。'],
    ],
    action: '跳槽前至少看 20 个同城同方向 JD，把职责、年限、薪资结构、公司类型分开记。',
    note: '查薪不是找安慰，是校准你的报价依据。'
  },
  {
    id: 'p8', file: 'p8-summary.html', step: '07 / 07', kind: 'summary',
    title: '下一次跳槽，\n按这张表复核', subtitle: '城市、方向、年限，最后都要变成求职动作。',
    rows: [
      ['城市预算低', '确认是否换城市、换行业，或进入同城预算更高的公司类型。'],
      ['方向上限低', '别只加作品集页数，往产品、UX、B 端、增长、设计系统或品牌策略靠。'],
      ['卡在 3-5 年', '补完整链路项目，写清目标、职责、过程判断和结果。'],
      ['卡在 8-10 年', '补团队协作、业务影响、方法沉淀和复杂系统经验。'],
    ],
    checks: [
      ['投递前', '同城同方向至少看 20 个 JD。'],
      ['报价前', '拆月薪、年包、绩效、年终和试用期。'],
      ['改作品集', '每个项目补目标、职责、取舍、结果。'],
      ['换城市', '把房租、通勤、试错成本一起算进去。'],
    ],
    cta: '跳槽前逐条复核，再决定投哪里、补什么、怎么报价。',
    note: '薪资提升不是“我想要更多”，而是让市场看见你值在哪里。'
  },
];

const css = `
*{box-sizing:border-box}html,body{margin:0;background:#ded9cf;color:#111;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",Arial,sans-serif}body{padding:40px 20px}.deck{display:grid;gap:36px;justify-content:center}.page{width:1080px;height:1440px;background:#f7f1e6;border:6px solid #111;box-shadow:16px 16px 0 #111;padding:58px;position:relative;overflow:hidden}.brand{display:flex;justify-content:space-between;align-items:center;font-size:24px;font-weight:900}.tag{border:3px solid #111;padding:10px 16px;background:#fff;box-shadow:5px 5px 0 #111}.tag.red{background:#ef3b2d;color:#fff}.tag.blue{background:#1f6fff;color:#fff}h1{white-space:pre-line;margin:54px 0 18px;font-size:82px;line-height:1.04;letter-spacing:0;font-weight:950}h2{white-space:pre-line;margin:44px 0 14px;font-size:64px;line-height:1.08;letter-spacing:0;font-weight:950}.subtitle{font-size:34px;line-height:1.35;font-weight:800;margin:0 0 30px}.lead{font-size:34px;line-height:1.5;font-weight:700;margin:28px 0}.grid{display:grid;gap:22px}.grid.two{grid-template-columns:1fr 1fr}.grid.three{grid-template-columns:repeat(3,1fr)}.card{background:#fffaf1;border:4px solid #111;box-shadow:8px 8px 0 #111;padding:24px}.card.dark{background:#111;color:#fff;box-shadow:8px 8px 0 #ef3b2d}.card.red{background:#ef3b2d;color:#fff}.card.blue{background:#1f6fff;color:#fff}.kicker{font-size:24px;font-weight:950;margin-bottom:12px;color:#ef3b2d}.card.dark .kicker,.card.red .kicker,.card.blue .kicker{color:#fff}.card-title{font-size:32px;line-height:1.22;font-weight:950;margin-bottom:12px}.card p,li{font-size:25px;line-height:1.42;font-weight:650;margin:0}ul{margin:0;padding-left:28px}li+li{margin-top:10px}.note{position:absolute;left:58px;right:58px;bottom:58px;background:#ef3b2d;color:#fff;border:4px solid #111;box-shadow:8px 8px 0 #111;padding:22px 28px;font-size:30px;line-height:1.32;font-weight:950}.chips{display:flex;flex-wrap:wrap;gap:14px;margin:32px 0}.chip{background:#fff;border:3px solid #111;padding:12px 16px;font-size:25px;font-weight:900;box-shadow:5px 5px 0 #111}.big-number{font-size:70px;line-height:1;font-weight:950;margin-bottom:14px}.table{border:4px solid #111;background:#fff;box-shadow:8px 8px 0 #111}.row{display:grid;grid-template-columns:.82fr 1.35fr 1.35fr;border-bottom:3px solid #111}.row:last-child{border-bottom:0}.cell{padding:17px;font-size:24px;line-height:1.33;font-weight:700;border-right:3px solid #111}.cell:last-child{border-right:0}.head .cell{background:#111;color:#fff;font-weight:950}.section-label{font-size:25px;font-weight:950;margin:28px 0 14px;display:inline-block;padding:9px 14px;background:#111;color:#fff}.strip{display:flex;gap:16px;align-items:flex-start;background:#fff;border:4px solid #111;padding:19px 22px;box-shadow:6px 6px 0 #111}.strip+.strip{margin-top:16px}.num{flex:0 0 auto;min-width:82px;height:54px;display:grid;place-items:center;background:#111;color:#fff;font-size:25px;font-weight:950}.strip strong{display:block;font-size:30px;line-height:1.18;margin-bottom:6px}.strip span{display:block;font-size:25px;line-height:1.38;font-weight:650}.compare{display:grid;grid-template-columns:1fr 1fr;gap:24px}.callout{background:#111;color:#fff;border:4px solid #111;box-shadow:8px 8px 0 #ef3b2d;padding:24px;font-size:29px;line-height:1.38;font-weight:900;margin-top:24px}.mini-list{display:grid;gap:14px}.summary-row{display:grid;grid-template-columns:.82fr 1.8fr;background:#fff;border:4px solid #111;box-shadow:6px 6px 0 #111}.summary-row+.summary-row{margin-top:16px}.summary-row b{background:#111;color:#fff;padding:18px;font-size:26px;line-height:1.25}.summary-row span{padding:18px;font-size:25px;line-height:1.4;font-weight:700}.summary-checks{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}.summary-check{background:#fffaf1;border:4px solid #111;box-shadow:6px 6px 0 #111;padding:17px}.summary-check b{display:block;color:#ef3b2d;font-size:24px;line-height:1.15;margin-bottom:8px}.summary-check span{display:block;font-size:23px;line-height:1.3;font-weight:750}.cta{margin-top:22px;background:#1f6fff;color:#fff;border:4px solid #111;box-shadow:8px 8px 0 #111;padding:20px 24px;font-size:31px;font-weight:950}.bg-mark{position:absolute;right:-40px;top:210px;font-size:230px;line-height:1;font-weight:950;color:rgba(17,17,17,.055);transform:rotate(-8deg);pointer-events:none}.kind-table h2{margin-top:34px;font-size:60px}.kind-table .subtitle{margin-bottom:22px}.kind-table .card{padding:18px}.kind-table .card-title{font-size:30px;margin-bottom:8px}.kind-table .card p{font-size:23px;line-height:1.34}.kind-table .section-label{font-size:24px;margin:18px 0 10px}.kind-table .cell{padding:11px 16px;font-size:22px;line-height:1.28}@media(max-width:1120px){body{padding:16px 8px}.page{transform:scale(calc((100vw - 24px)/1080));transform-origin:top center;margin-bottom:calc(-1440px + (1440px*((100vw - 24px)/1080)) + 36px)}.deck{gap:24px}}body.export{padding:0;background:#f7f1e6}body.export .deck{display:block}body.export .page{box-shadow:none;margin:0}body.export .page:not(.active-export){display:none}`;

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function brandHtml(page){return `<div class="brand"><span>${brand}</span><span class="tag ${page.id==='p1'?'red':'blue'}">${page.step}</span></div><div class="bg-mark">${page.id.toUpperCase()}</div>`;}
function note(page){return `<div class="note">${esc(page.note)}</div>`;}
function card(title, body, cls=''){return `<div class="card ${cls}"><div class="card-title">${esc(title)}</div><p>${esc(body)}</p></div>`;}
function list(items){return `<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;}
function renderPage(page){
  let body = brandHtml(page);
  if(page.kind==='cover'){
    body += `<h1>${esc(page.title)}</h1><p class="subtitle">${esc(page.subtitle)}</p><p class="lead">${esc(page.lead)}</p><div class="grid three">${page.cards.map((c,i)=>`<div class="card ${i===1?'blue':''}"><div class="big-number">${esc(c[0])}</div><div class="card-title">${esc(c[1])}</div><p>${esc(c[2])}</p></div>`).join('')}</div><div class="chips">${page.chips.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>`;
  } else if(page.kind==='three'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><p class="lead">${esc(page.lead)}</p><div class="grid three">${page.cards.map((c,i)=>`<div class="card ${i===0?'red':i===1?'blue':''}"><div class="kicker">${esc(c[0])}</div><div class="card-title">${esc(c[1])}</div><p>${esc(c[2])}</p></div>`).join('')}</div>`;
  } else if(page.kind==='table'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><div class="section-label">先问 4 个问题</div><div class="grid two">${page.intro.map((x,i)=>card('0'+(i+1),x,i===0?'dark':'' )).join('')}</div><div class="section-label">城市判断</div><div class="table"><div class="row head">${page.headers.map(h=>`<div class="cell">${esc(h)}</div>`).join('')}</div>${page.rows.map(r=>`<div class="row">${r.map(c=>`<div class="cell">${esc(c)}</div>`).join('')}</div>`).join('')}</div>`;
  } else if(page.kind==='stack'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><div class="mini-list">${page.items.map((it,i)=>`<div class="strip"><div class="num">0${i+1}</div><div><strong>${esc(it[0])}</strong><span>${esc(it[1])}</span></div></div>`).join('')}</div><div class="callout">共同点：越能解释业务结果，越不容易被当成单纯执行岗定价。</div>`;
  } else if(page.kind==='flow'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><div class="grid three">${page.steps.map((s,i)=>`<div class="card ${i===1?'blue':i===2?'dark':''}"><div class="big-number">${esc(s[0])}</div><div class="card-title">${esc(s[1])}</div><p>${esc(s[2])}</p></div>`).join('')}</div><div class="callout">${esc(page.warning)}</div>`;
  } else if(page.kind==='compare'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><div class="compare"><div class="card"><div class="kicker">${esc(page.badTitle)}</div>${list(page.bad)}</div><div class="card blue"><div class="kicker">${esc(page.goodTitle)}</div>${list(page.good)}</div></div>`;
  } else if(page.kind==='mistakes'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p><div class="grid two">${page.items.map((it,i)=>card(it[0],it[1],i===0?'red':i===3?'dark':'' )).join('')}</div><div class="callout">建议动作：${esc(page.action)}</div>`;
  } else if(page.kind==='summary'){
    body += `<h2>${esc(page.title)}</h2><p class="subtitle">${esc(page.subtitle)}</p>${page.rows.map(r=>`<div class="summary-row"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}<div class="summary-checks">${page.checks.map(r=>`<div class="summary-check"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}</div><div class="cta">${esc(page.cta)}</div>`;
  }
  body += note(page);
  return `<section class="page active-export kind-${page.kind}" id="${page.id}">${body}</section>`;
}
function fullHtml(page=null){
 const title = page ? `${page.id} 设计岗位薪资报告` : '设计岗位薪资报告-哪些城市-方向最值钱';
 const sections = page ? renderPage(page) : pages.map(renderPage).join('\n');
 return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${css}</style></head><body${page ? ' class="export"' : ''}><main class="deck">${sections}</main></body></html>`;
}
for (const page of pages) fs.writeFileSync(path.join(htmlDir, page.file), fullHtml(page));
fs.writeFileSync(path.join(root, 'preview', 'index.html'), fullHtml());
fs.writeFileSync(path.join(htmlDir, 'index.html'), fullHtml());
console.log(`Generated ${pages.length} cards`);
