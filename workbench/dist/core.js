(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MC = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const stages = [
    { id: 'analysis', name: '分析', role: '分析 AI', color: '#508d78' },
    { id: 'model', name: '建模', role: '建模 AI', color: '#7b75b5' },
    { id: 'code', name: '代码', role: '编程 AI', color: '#5385ac' },
    { id: 'paper', name: '论文', role: '论文 AI', color: '#bb8c55' },
    { id: 'check', name: '检查', role: '审查 AI', color: '#a86e7e' }
  ];
  const definitions = [
    ['A01','analysis','题意拆解与范围确认',[],'逐条拆解题目要求，明确各小问的目标、约束、评价标准与不可做的假设。','原始赛题、附件与已核实的参赛要求','01_分析/题意拆解.md'],
    ['A02','analysis','数据字典与口径确认',['A01'],'梳理文件、字段、单位、主键和缺失值含义，统一时间与指标口径。','题意拆解、原始数据目录','01_分析/数据字典.md'],
    ['A03','analysis','数据清洗与质量核验',['A02'],'记录缺失、异常、重复记录的处理规则，保留原始数据与清洗日志。','数据字典、原始数据','01_分析/清洗规则与质量报告.md'],
    ['A04','analysis','探索分析与小问映射',['A03'],'识别分布、关联和异常，把每一小问对应到可用数据与待验证假设。','清洗后的数据、质量报告','01_分析/探索分析与小问映射.md'],
    ['M01','model','建立可比较的基准模型',['A04'],'选择简单可解释的基线，定义目标函数、指标与适用边界。','探索分析、小问映射','02_建模/基准模型.md'],
    ['M02','model','主模型与假设论证',['M01'],'给出变量、公式、假设与求解思路，说明相对基线的改进理由。','基准模型、已确认的数据口径','02_建模/主模型与假设.md'],
    ['M03','model','实验与评价方案',['M02'],'确定训练验证划分、评价指标、对照实验和敏感性分析，避免数据泄漏。','主模型、基准模型','02_建模/实验方案.md'],
    ['C01','code','搭建可复现的数据流水线',['M03','A03'],'实现数据读取与清洗，固定随机种子、环境和输入输出路径。','清洗规则、实验方案','03_代码/README与环境说明.md'],
    ['C02','code','模型实现与基线复现',['C01','M03'],'逐式对应实现模型，先跑通基线，再核验主模型的输入输出。','模型公式、数据流水线','03_代码/模型运行记录.md'],
    ['C03','code','对比实验与敏感性分析',['C02'],'用同一口径比较模型，记录参数、运行时间、误差和失败实验。','可运行代码、实验方案','03_代码/实验结果汇总.md'],
    ['C04','code','固化结果与论文图表',['C03'],'导出最终结果表与图，标注数据版本、单位和实验来源。','实验结果、已复核的指标','03_代码/结果与图表索引.md'],
    ['P01','paper','论文结构与证据目录',['A01','M03'],'将每一小问映射到论文章节，给结论预留数据、图表与引用证据。','题意拆解、模型与实验方案','04_论文/大纲与证据目录.md'],
    ['P02','paper','方法与结果章节',['C04','P01'],'依据实际模型和实验撰写，不补造结果；统一符号、公式与图表编号。','论文大纲、结果与图表索引','04_论文/方法与结果.md'],
    ['P03','paper','摘要、结论与参考文献',['P02'],'摘要数字与正文一致，结论回应各小问；核验引用可查且对应原文。','方法结果章节、真实文献来源','04_论文/摘要结论与引用.md'],
    ['P04','paper','全文整合与格式核对',['P03'],'合并全文，统一术语、编号与格式，按当届官方要求检查匿名与提交格式。','各章节、已核实的当届要求','04_论文/整合稿.pdf'],
    ['Q01','check','独立复现与结果核验',['C04'],'按说明从原始输入重新运行，核对关键表格与论文结果是否一致。','代码、环境说明、结果索引','05_检查/独立复现记录.md'],
    ['Q02','check','论文、代码与数据交叉检查',['P04','Q01'],'交叉核验每个结论的证据、每张图的数据与每段方法的实现。','整合稿、复现记录、数据与代码','05_检查/交叉检查记录.md'],
    ['Q03','check','最终自检与提交包',['Q02'],'处理所有阻塞项，完成最终自检，清点文件并留存提交包版本。','交叉检查记录、最终自检清单','05_检查/提交包清单.md']
  ];
  const checks = [
    ['coverage','内容完整','每一小问均有方法、结果与解释'],
    ['data','数据可靠','数据口径、单位、异常处理与版本可追溯'],
    ['leak','实验有效','验证划分合理，无训练验证数据泄漏'],
    ['reproduce','可以复现','固定环境和种子，关键结果独立运行一致'],
    ['alignment','结果一致','论文数字、表格、图形与代码输出相符'],
    ['sources','引用真实','引用可查，外部资料、代码与 AI 使用按当届规则说明'],
    ['original','独立表达','推导、分析与表述已人工核验，引用与复用已标注'],
    ['duplicate','没有冲突','重复任务与同名交付物已逐项核对'],
    ['format','格式合规','已核对当届官方的匿名、文件格式与命名要求'],
    ['package','提交齐全','论文、代码、依赖、附件与提交清单完整']
  ];
  const clone = x => JSON.parse(JSON.stringify(x));
  function initial() { return { version: 1, project: 'MathorCup 大数据竞赛', tasks: definitions.map((d,i) => ({ id:d[0], stage:d[1], title:d[2], deps:d[3], goal:d[4], input:d[5], expected:d[6], role:stages.find(s=>s.id===d[1]).role, status:'todo', artifacts:'', note:'', order:i })), checks:Object.fromEntries(checks.map(c=>[c[0],false])), log:[], updatedAt:null }; }
  function get(state,id) { const t = state.tasks.find(t=>t.id===id); if(!t) throw new Error('找不到该任务'); return t; }
  function missing(state,t) { return t.deps.filter(id=>get(state,id).status!=='done'); }
  function ready(state,t) { return t.status==='todo' && !missing(state,t).length; }
  function next(state) { return state.tasks.find(t=>t.status==='doing') || state.tasks.find(t=>t.status==='review') || state.tasks.find(t=>ready(state,t)) || state.tasks.find(t=>t.status==='blocked'); }
  function descendants(state,id) { const ids = new Set(); let changed=true; while(changed){ changed=false; for(const t of state.tasks) if(!ids.has(t.id) && t.deps.some(d=>d===id || ids.has(d))){ids.add(t.id);changed=true;} } return [...ids]; }
  function record(state,text) { state.updatedAt = new Date().toISOString(); state.log.unshift({at:state.updatedAt,text}); state.log=state.log.slice(0,40); }
  function transition(state,id,status,allowReset=false) {
    const t=get(state,id);
    if(!['todo','doing','review','done','blocked'].includes(status)) throw new Error('无效的任务状态');
    if(['doing','review','done'].includes(status) && missing(state,t).length) throw new Error('请先完成前置任务：'+missing(state,t).join('、'));
    if(status==='done' && (!t.artifacts.trim() || !t.note.trim())) throw new Error('完成前请填写实际交付物和交接说明');
    if(status==='done' && id==='Q03' && state.tasks.some(t=>t.id!=='Q03' && t.status!=='done')) throw new Error('最终提交前，请先完成所有项目任务（含新增任务）');
    if(status==='done' && id==='Q03' && checks.some(c=>!state.checks[c[0]])) throw new Error('最终提交前，请先完成全部最终自检项');
    const affected=t.status==='done' && status!=='done' ? descendants(state,id).filter(x=>get(state,x).status!=='todo') : [];
    if(affected.length && !allowReset) return {requiresReset:true,affected};
    affected.forEach(x=>get(state,x).status='todo');
    if(t.status==='done' && status!=='done') checks.forEach(c=>state.checks[c[0]]=false);
    t.status=status;
    if(status!=='done') state.checks.package=false;
    record(state,id+' '+t.title+' → '+({todo:'待开始',doing:'进行中',review:'待复核',done:'已完成',blocked:'已阻塞'}[status])+(affected.length?'；'+affected.length+'项后续任务需重新核验':''));
    return {requiresReset:false,affected};
  }
  function saveDelivery(state,id,{title,role,goal,artifacts,note}) {
    const t=get(state,id);
    if(!title.trim()) throw new Error('任务名称不能为空');
    if(t.status==='done' && (t.artifacts!==artifacts || t.note!==note || t.goal!==goal)) throw new Error('修改已完成任务的交付内容前，请先重新打开任务');
    Object.assign(t,{title:title.trim(),role,goal:goal.trim(),artifacts:artifacts.trim(),note:note.trim()});record(state,id+' 已保存任务说明与交接内容');
  }
  function add(state,{title,stage,goal,expected,deps}) {
    if(!title.trim() || !expected.trim()) throw new Error('请填写任务名称和预期交付物');
    if(state.tasks.length>=200) throw new Error('最多支持 200 项任务');
    if(!stages.some(s=>s.id===stage)) throw new Error('请选择有效阶段');
    if(deps.includes('Q03')) throw new Error('最终提交是项目终点，不能作为新增任务的前置');
    for(const id of deps) if(stages.findIndex(s=>s.id===get(state,id).stage)>stages.findIndex(s=>s.id===stage)) throw new Error('前置任务不能位于后续阶段');
    const id='T'+String(Date.now())+String(state.tasks.length);
    state.tasks.push({id,stage,title:title.trim(),goal:goal.trim(),expected:expected.trim(),deps:[...new Set(deps)],input:'按前置任务交付物执行',role:stages.find(s=>s.id===stage).role,status:'todo',artifacts:'',note:'',order:state.tasks.length});
    const final=state.tasks.find(t=>t.id==='Q03');if(final?.status==='done'){final.status='todo';checks.forEach(c=>state.checks[c[0]]=false);}state.checks.package=false;
    record(state,'新增任务：'+title.trim());return id;
  }
  const normalized=s=>s.toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  function similarity(a,b) { a=normalized(a);b=normalized(b);if(a===b)return 1;if(a.length<2||b.length<2)return 0;const grams=s=>new Set(Array.from({length:s.length-1},(_,i)=>s.slice(i,i+2)));const x=grams(a),y=grams(b);return 2*[...x].filter(v=>y.has(v)).length/(x.size+y.size); }
  function duplicates(state) {
    const issues=[];
    for(let i=0;i<state.tasks.length;i++) for(let j=i+1;j<state.tasks.length;j++) {
      const a=state.tasks[i],b=state.tasks[j],score=similarity(a.title,b.title);
      if(score>=0.65) issues.push({type:'任务可能重复',a:a.id,b:b.id,detail:a.title+' / '+b.title});
      const paths=t=>t.artifacts.split('\n').map(s=>s.trim().replace(/\\/g,'/').replace(/\/$/,'')).filter(Boolean);
      const common=paths(a).filter(x=>paths(b).includes(x));
      if(common.length) issues.push({type:'交付物路径重复',a:a.id,b:b.id,detail:common.join('、')});
      if(a.expected.trim()===b.expected.trim()) issues.push({type:'预期交付物相同',a:a.id,b:b.id,detail:a.expected});
    }
    return issues;
  }
  function prompt(state,id) {const t=get(state,id); return `你负责 MathorCup 竞赛的「${t.role}」任务。\n任务：${t.id} ${t.title}\n目标：${t.goal}\n输入要求：${t.input}\n\n上一步已登记的交付：\n${t.deps.length?t.deps.map(id=>{const p=get(state,id);return `[${p.id} ${p.title} / ${p.status==='done'?'已完成':'尚未完成'}]\n交付物：${p.artifacts||'尚未登记'}\n交接说明：${p.note||'尚未登记'}`}).join('\n\n'):'从原始赛题和附件开始。请先索取实际材料，不假定已有数据。'}\n\n本步预期交付：${t.expected}\n完成后请给出：实际文件或链接、关键结论、输入输出口径、验证方法、局限及下一步注意事项。\n不编造数据、实验或引用；不重复前置任务已完成的工作；遇到输入缺失时明确列出缺口。\n此指令不包含实际文件内容，请在执行环境中提供对应文件。`;}
  function validate(data) {
    if(!data || data.version!==1 || !Array.isArray(data.tasks) || data.tasks.length<1 || data.tasks.length>200) throw new Error('备份格式无效，任务数须为 1–200');
    const ids=new Set();for(const t of data.tasks){if(!t || typeof t.id!=='string' || !/^[A-Za-z0-9_-]+$/.test(t.id)||ids.has(t.id))throw new Error('备份包含无效或重复任务编号');ids.add(t.id);if(!stages.some(s=>s.id===t.stage)||!Array.isArray(t.deps)||!['todo','doing','review','done','blocked'].includes(t.status))throw new Error('备份任务字段不完整');for(const key of ['title','goal','expected','role','input','artifacts','note'])if(typeof t[key]!=='string'||t[key].length>30000)throw new Error('备份字段不完整或过长');if(!t.title.trim()||!t.expected.trim())throw new Error('备份缺少名称或预期交付物');}
    const visited=new Set(),active=new Set();function walk(id){if(active.has(id))throw new Error('任务依赖存在循环');if(visited.has(id))return;active.add(id);for(const d of get(data,id).deps){if(!ids.has(d))throw new Error('前置任务不存在');walk(d);}active.delete(id);visited.add(id);}data.tasks.forEach(t=>walk(t.id));
    const clean={version:1,project:typeof data.project==='string'?data.project.slice(0,100):'MathorCup 大数据竞赛',tasks:data.tasks.map((t,i)=>({id:t.id,stage:t.stage,title:t.title,deps:[...new Set(t.deps)],goal:t.goal,input:t.input,expected:t.expected,role:t.role,status:t.status,artifacts:t.artifacts,note:t.note,order:i})),checks:Object.fromEntries(checks.map(c=>[c[0],data.checks?.[c[0]]===true])),log:[],updatedAt:null};
    for(const t of clean.tasks) if(['doing','review','done'].includes(t.status) && missing(clean,t).length)throw new Error('备份中的任务状态与依赖冲突');
    for(const t of clean.tasks) if(t.status==='done'&&(!t.artifacts.trim()||!t.note.trim()))throw new Error('已完成任务缺少交接记录');
    if(clean.tasks.some(t=>t.id!=='Q03'&&t.deps.includes('Q03')))throw new Error('最终提交不能作为其他任务的前置');
    if(clean.tasks.some(t=>t.id==='Q03'&&t.status==='done')&&clean.tasks.some(t=>t.status!=='done'))throw new Error('最终提交完成时仍有未完成任务');
    if(clean.tasks.some(t=>t.id==='Q03'&&t.status==='done')&&checks.some(c=>!clean.checks[c[0]]))throw new Error('最终提交任务与自检状态冲突');
    return clean;
  }
  return {stages,checks,initial,get,missing,ready,next,descendants,transition,saveDelivery,add,duplicates,prompt,validate,record,clone};
});
