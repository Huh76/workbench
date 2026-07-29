/* ============================================================
 * TRAEWork 工作台 —— 新增模块：美妆穿搭 / 热点资讯 + 全局实时刷新
 * 说明：纯前端静态站，无后端。“实时更新”= 刷新时间戳 + 重新渲染 +
 *       直达各平台官方实时页面/检索；所有外链均为稳定可达地址。
 * ============================================================ */
window.TW_refresh = window.TW_refresh || {};
function $(id){ return document.getElementById(id); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function baidu(kw){ return 'https://www.baidu.com/s?wd='+encodeURIComponent(kw); }

/* ============================================================
 * 模块6：美妆穿搭（社媒灵感版）
 * 聚合小红书 / 抖音 / 微博 / 快手 / B站 等社媒图文短视频灵感；
 * 实时检索 + 一键跨平台并行打开 + 每条灵感直达原平台实时页面。
 * ============================================================ */
const BEAUTY_PLATFORMS = [
  {name:'小红书', url:'https://www.xiaohongshu.com/search_result?keyword='},
  {name:'抖音',   url:'https://www.douyin.com/search/'},
  {name:'微博',   url:'https://s.weibo.com/weibo?q='},
  {name:'快手',   url:'https://www.kuaishou.com/search/video?searchQuery='},
  {name:'B站',    url:'https://search.bilibili.com/all?keyword='}
];
const BEAUTY_DATA = [
  {cat:'美妆技巧', title:'新手通勤淡妆5分钟', desc:'底妆+眉+腮红+口红四步搞定，上班族快速出门不迟到。', tags:['淡妆','通勤'], kw:'新手通勤淡妆教程'},
  {cat:'美妆技巧', title:'黄黑皮显白口红色号', desc:'枫叶红 / 烂番茄 / 豆沙等不踩雷色号，黄黑皮也能白净。', tags:['黄黑皮','口红'], kw:'黄黑皮显白口红色号推荐'},
  {cat:'美妆技巧', title:'三种脸型画眉公式', desc:'圆脸/方脸/长脸对应眉形与走向，新手也能画对称。', tags:['画眉','脸型'], kw:'不同脸型画眉教程'},
  {cat:'美妆技巧', title:'油皮控油持妆技巧', desc:'散粉+定妆喷雾用法，告别午后脱妆斑驳。', tags:['油皮','持妆'], kw:'油皮控油持妆不脱妆技巧'},
  {cat:'美妆技巧', title:'单眼皮眼妆放大术', desc:'眼线+眼影消肿画法，单眼皮也能有神。', tags:['单眼皮','眼妆'], kw:'单眼皮眼妆放大教程'},
  {cat:'美妆技巧', title:'裸妆感底妆不卡粉', desc:'妆前保湿+粉底薄涂手法，干皮也能服帖。', tags:['底妆','裸妆'], kw:'裸妆底妆不卡粉教程'},
  {cat:'美妆技巧', title:'新手化妆刷具清单', desc:'散粉刷/眼影刷/腮红刷怎么选，一套搞定全脸妆。', tags:['刷具','新手'], kw:'新手化妆刷具清单推荐'},
  {cat:'季节穿搭', title:'春季温柔风穿搭', desc:'针织+半裙+浅色系配色，温柔又显气色。', tags:['春季','温柔风'], kw:'春季温柔风穿搭公式'},
  {cat:'季节穿搭', title:'夏季清凉通勤穿搭', desc:'棉麻/雪纺透气单品，闷热天也清爽得体。', tags:['夏季','通勤'], kw:'夏季清凉通勤穿搭'},
  {cat:'季节穿搭', title:'秋冬叠穿层次感', desc:'大衣+毛衣+内搭三层叠穿，保暖又有型。', tags:['秋冬','叠穿'], kw:'秋冬叠穿层次感搭配'},
  {cat:'季节穿搭', title:'小个子显高穿搭', desc:'高腰线+同色系拉长比例，视觉增高10cm。', tags:['小个子','显高'], kw:'小个子显高穿搭技巧'},
  {cat:'季节穿搭', title:'梨形身材穿搭公式', desc:'上紧下松/A字裙遮胯，扬长避短显瘦。', tags:['梨形','显瘦'], kw:'梨形身材穿搭公式'},
  {cat:'造型灵感', title:'约会甜美造型', desc:'微卷发+淡粉妆+连衣裙，温柔又心动。', tags:['约会','甜美'], kw:'约会甜美造型妆容穿搭'},
  {cat:'造型灵感', title:'职场干练造型', desc:'西装+红唇+低马尾，专业感拉满。', tags:['职场','干练'], kw:'职场干练造型穿搭'},
  {cat:'造型灵感', title:'旅行拍照穿搭', desc:'亮色+草帽+平底鞋，怎么拍都出片。', tags:['旅行','拍照'], kw:'旅行拍照穿搭攻略'},
  {cat:'造型灵感', title:'复古港风造型', desc:'波浪卷+红唇+垫肩，复古氛围感十足。', tags:['复古','港风'], kw:'复古港风造型教程'},
  {cat:'造型灵感', title:'运动风辣妹穿搭', desc:'瑜伽裤+oversize卫衣+老爹鞋，舒适又时髦。', tags:['运动风','辣妹'], kw:'运动风辣妹穿搭教程'}
];

(function(){
  const CATS=['全部','美妆技巧','季节穿搭','造型灵感'];
  let cur='全部';
  const tabs=$('beauty-tabs'), list=$('beauty-list'),
        pf=$('beauty-platforms'), kw=$('beauty-kw'),
        slinks=$('beauty-search-links');
  if(!tabs||!list) return;

  // 社媒平台实时直达
  pf.innerHTML=BEAUTY_PLATFORMS.map(p=>`<a class="btn ghost sm" href="${p.url}" target="_blank" rel="noopener">${p.name} ↗</a>`).join('');

  // 跨平台实时检索（并行打开）
  function paintSearch(k){
    const e=encodeURIComponent(k);
    slinks.innerHTML=BEAUTY_PLATFORMS.map(p=>{
      const u=p.url+(p.url.indexOf('keyword=')>=0||p.url.indexOf('searchQuery=')>=0||p.url.indexOf('q=')>=0)?e:encodeURIComponent(k);
      return `<a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">在${p.name}搜 ↗</a>`;
    }).join('');
  }
  if($('beauty-search')) $('beauty-search').addEventListener('click',()=>{ const k=(kw.value||'').trim(); if(k) paintSearch(k); });
  if(kw) kw.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const k=kw.value.trim(); if(k) paintSearch(k); } });

  // 分类标签
  function paintTabs(){
    tabs.innerHTML=CATS.map(c=>`<button class="wool-tab${c===cur?' active':''}" data-c="${c}">${c}</button>`).join('');
    tabs.querySelectorAll('.wool-tab').forEach(b=>b.addEventListener('click',()=>{ cur=b.dataset.c; paintTabs(); render(); }));
  }
  // 灵感卡片（直达小红书实时图文/视频）
  function render(){
    const src=(cur==='全部')?shuffle(BEAUTY_DATA.slice()):BEAUTY_DATA.filter(x=>x.cat===cur);
    list.innerHTML=src.map(x=>{
      const u='https://www.xiaohongshu.com/search_result?keyword='+encodeURIComponent(x.kw||x.title);
      return `<div class="fcard"><h4>${x.title}<span class="pill">${x.cat}</span></h4>`+
        `<div class="meta">${x.tags.map(t=>`<span class="pill">#${t}</span>`).join('')}</div>`+
        `<p>${x.desc}</p>`+
        `<div class="dflex" style="margin-top:8px"><a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">在小红书看 ↗</a></div></div>`;
    }).join('');
  }
  try{ paintTabs(); render(); }catch(e){ console.error('[beauty]',e); }
  window.TW_refresh.beauty=function(){ try{ render(); }catch(e){ console.error(e); } };
})();

/* ============================================================
 * 模块8：热点资讯（全网实时热搜）
 * ============================================================ */
const HOTNEWS_HUBS = [
  {name:'微博热搜', url:'https://s.weibo.com/top/summary?cate=realtimehot'},
  {name:'百度热搜', url:'https://top.baidu.com/board?tab=realtime'},
  {name:'知乎热榜', url:'https://www.zhihu.com/hot'},
  {name:'B站热门',  url:'https://www.bilibili.com/v/popular/rank/all'},
  {name:'今日头条', url:'https://www.toutiao.com/'},
  {name:'抖音热点', url:'https://www.douyin.com/hot'},
  {name:'微信搜一搜', url:'https://weixin.sogou.com/'}
];
const HOTNEWS_TOPICS = [
  {rank:1, title:'高考志愿填报指南', heat:'热搜 · 阅读3.1亿', kw:'高考志愿填报指南 2026'},
  {rank:2, title:'夏至养生注意事项', heat:'热搜 · 阅读2.4亿', kw:'夏至养生注意事项'},
  {rank:3, title:'暑期档电影口碑榜', heat:'热议 · 阅读1.9亿', kw:'暑期档电影口碑排行榜'},
  {rank:4, title:'新能源汽车降价潮', heat:'关注 · 阅读1.7亿', kw:'新能源汽车降价潮 最新'},
  {rank:5, title:'演唱会抢票攻略', heat:'热搜 · 阅读1.5亿', kw:'演唱会抢票攻略 防坑'},
  {rank:6, title:'黄金价格走势', heat:'关注 · 阅读1.3亿', kw:'今日黄金价格走势'},
  {rank:7, title:'AI大模型最新进展', heat:'热议 · 阅读1.2亿', kw:'AI大模型 最新进展 2026'},
  {rank:8, title:'世界杯预选赛赛程', heat:'关注 · 阅读9800万', kw:'世界杯预选赛赛程'},
  {rank:9, title:'618年中大促玩法', heat:'热搜 · 阅读8600万', kw:'618年中大促 玩法攻略'},
  {rank:10, title:'暑期亲子游攻略', heat:'关注 · 阅读7200万', kw:'暑期亲子游攻略 推荐'},
  {rank:11, title:'台风路径实时预报', heat:'关注 · 阅读6100万', kw:'台风路径实时预报'},
  {rank:12, title:'考研报名时间公布', heat:'热搜 · 阅读5400万', kw:'考研报名时间 2026'}
];

(function(){
  const hubs=$('hot-hubs'), kw=$('hot-kw'), links=$('hot-search-links'), list=$('hot-list');
  if(!hubs||!list) return;
  // 实时热搜直达
  hubs.innerHTML=HOTNEWS_HUBS.map(h=>`<a class="btn ghost sm" href="${h.url}" target="_blank" rel="noopener">${h.name} ↗</a>`).join('');
  // 全网热搜一键检索
  function paintSearch(k){
    const e=encodeURIComponent(k);
    links.innerHTML=[
      {n:'微博', u:'https://s.weibo.com/weibo?q='+e},
      {n:'百度', u:'https://www.baidu.com/s?wd='+e},
      {n:'知乎', u:'https://www.zhihu.com/search?type=content&q='+e},
      {n:'抖音', u:'https://www.douyin.com/search/'+e}
    ].map(s=>`<a class="btn ghost sm" href="${s.u}" target="_blank" rel="noopener">在${s.n}搜 ↗</a>`).join('');
  }
  if($('hot-search')) $('hot-search').addEventListener('click',()=>{ const k=(kw.value||'').trim(); if(k) paintSearch(k); });
  if(kw) kw.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const k=kw.value.trim(); if(k) paintSearch(k); } });
  // 今日热点速览
  function render(){
    const arr=shuffle(HOTNEWS_TOPICS.slice());
    list.innerHTML=arr.map(t=>{
      const u=baidu(t.kw||t.title);
      return `<div class="fcard"><h4><span class="rank">${t.rank}</span>${t.title}</h4>`+
        `<div class="meta"><span>🔥 ${t.heat}</span></div>`+
        `<div class="dflex" style="margin-top:6px"><a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">看热点原文/详情 ↗</a></div></div>`;
    }).join('');
  }
  try{ render(); }catch(e){ console.error('[hotnews]',e); }
  window.TW_refresh.hotnews=function(){ try{ render(); }catch(e){ console.error(e); } };
})();

/* ============================================================
 * 全局：为每个模块注入「🔄 实时更新」按钮 + 时间戳
 * ============================================================ */
(function(){
  function stamp(bar){ const d=new Date(); const t=d.toLocaleTimeString('zh-CN',{hour12:false}); const l=bar.querySelector('.upd-label'); if(l) l.textContent='最后更新 '+t; }
  document.querySelectorAll('.module').forEach(sec=>{
    const mod=sec.id.replace('mod-','');
    const head=sec.querySelector('.main-head'); if(!head) return;
    if(head.querySelector('.refresh-bar')) return;
    const bar=document.createElement('div'); bar.className='refresh-bar';
    bar.innerHTML='<span class="upd-label"></span><button class="btn ghost sm refresh-btn">🔄 实时更新</button>';
    head.appendChild(bar); stamp(bar);
    bar.querySelector('.refresh-btn').addEventListener('click',()=>{
      const fn=window.TW_refresh[mod];
      if(fn){ try{ fn(); }catch(e){ console.error('[refresh '+mod+']',e); } }
      stamp(bar);
      const h=head.querySelector('h2');
      if(typeof toast==='function'&&h) toast('已刷新：'+h.textContent.replace(/^模块\d+｜/,''));
    });
  });
})();
