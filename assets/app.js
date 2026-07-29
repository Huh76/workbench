/* ============================================================
 * TRAEWork 工作台 —— 主逻辑（6 模块）
 * ============================================================ */
function $(id){ return document.getElementById(id); }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function download(name, text){ const b=new Blob([text],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; a.click(); }
function saveBlob(blob,name){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); }

/* ---------- 颜色工具 ---------- */
function hexToRgb(hex){ hex=hex.replace('#','').trim(); if(hex.length===3) hex=hex.split('').map(c=>c+c).join(''); if(hex.length!==6) return null; const n=parseInt(hex,16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}; }
function rgbToHex(r,g,b){ return '#'+[r,g,b].map(x=>clamp(Math.round(x),0,255).toString(16).padStart(2,'0')).join('').toUpperCase(); }
function rgbToCmyk(r,g,b){ r/=255;g/=255;b/=255; const k=1-Math.max(r,g,b); const c=k>=1?0:(1-r-k)/(1-k); const m=k>=1?0:(1-g-k)/(1-k); const y=k>=1?0:(1-b-k)/(1-k); return {c:Math.round(c*100),m:Math.round(m*100),y:Math.round(y*100),k:Math.round(k*100)}; }
function cmykToRgb(c,m,y,k){ c/=100;m/=100;y/=100;k/=100; return {r:Math.round(255*(1-c)*(1-k)),g:Math.round(255*(1-m)*(1-k)),b:Math.round(255*(1-y)*(1-k))}; }
function cmykStr(o){ return `${o.c},${o.m},${o.y},${o.k}`; }
function rgbToHsl(r,g,b){ r/=255;g/=255;b/=255; const mx=Math.max(r,g,b),mn=Math.min(r,g,b); let h,s,l=(mx+mn)/2; if(mx===mn){h=s=0;}else{const d=mx-mn; s=l>0.5?d/(2-mx-mn):d/(mx+mn); if(mx===r)h=((g-b)/d+(g<b?6:0)); else if(mx===g)h=(b-r)/d+2; else h=(r-g)/d+4; h/=6;} return {h:h*360,s:s*100,l:l*100}; }
function hslToRgb(h,s,l){ h/=360;s/=100;l/=100; let r,g,b; if(s===0){r=g=b=l;}else{ const hue2rgb=(p,q,t)=>{ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; }; const q=l<0.5?l*(1+s):l+s-l*s; const p=2*l-q; r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);} return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)}; }

/* ---------- 跨模块共享总线（一键复用） ---------- */
function dataURLtoFile(dataUrl,name){ const [h,body]=dataUrl.split(','); const mime=(h.match(/:(.*?);/)||[])[1]||'image/png'; const bin=atob(body); const arr=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i); return new File([arr],name,{type:mime}); }
function toast(msg){ let t=document.getElementById('tw-toast'); if(!t){ t=document.createElement('div'); t.id='tw-toast'; t.style.cssText='position:fixed;right:22px;bottom:22px;background:#161d29;color:#fff;padding:10px 14px;border-radius:10px;font-size:12.5px;box-shadow:0 6px 24px rgba(0,0,0,.25);z-index:9999;opacity:0;transition:opacity .2s;pointer-events:none'; document.body.appendChild(t); } t.textContent=msg; t.style.opacity='1'; clearTimeout(t._t); t._t=setTimeout(()=>t.style.opacity='0',1800); }
const TW = {
  go(mod){ const el=document.querySelector(`.nav-item[data-mod="${mod}"]`); if(el) el.click(); },
  sendColor(hex,to){ hex=(hex||'').toUpperCase(); if(!hexToRgb(hex))return;
    if(to==='palette'){ if(window.__PALETTE_setBase)window.__PALETTE_setBase(hex); this.go('palette'); toast('颜色已发送到「配色」主色'); }
    else if(to==='color'){ if(window.__COLOR_setHex)window.__COLOR_setHex(hex); this.go('color'); toast('颜色已发送到「色卡」'); }
  }
};
window.TW = TW;

/* ---------- 导航 ---------- */
(function(){ const items=document.querySelectorAll('.nav-item'); items.forEach(it=>{ it.addEventListener('click',()=>{ items.forEach(x=>x.classList.remove('active')); it.classList.add('active'); const m=it.dataset.mod; document.querySelectorAll('.module').forEach(s=>s.classList.toggle('active', s.id==='mod-'+m)); const mod=document.getElementById('mod-'+m); if(mod) mod.scrollIntoView({behavior:'smooth',block:'start'}); setupMobileCollapse(); }); }); })();

/* ---------- 手机端：卡片可折叠 + 一键收起/展开（缩小纵向占用） ---------- */
function setupMobileCollapse(){
  if(window.__collapseInited) return;
  window.__collapseInited = true;
  var isMobile = function(){ return window.matchMedia('(max-width:820px)').matches; };
  function modOf(card){ return card.closest('.module'); }
  function syncLabel(mod){
    var mb = mod ? mod.querySelector('.collapse-all-btn') : null;
    if(!mb) return;
    var cards = mod.querySelectorAll('.card.collapsible');
    var allCollapsed = true;
    cards.forEach(function(c){ if(!c.classList.contains('collapsed')) allCollapsed=false; });
    mb.textContent = allCollapsed ? '全部展开' : '全部收起';
  }
  // 1) 每个模块 main-head 注入「全部收起/展开」按钮（移动端显示）
  document.querySelectorAll('.module').forEach(function(mod){
    var head = mod.querySelector(':scope > .main-head');
    if(head && !head.querySelector('.collapse-all-btn')){
      var btn = document.createElement('button');
      btn.type='button'; btn.className='btn ghost sm collapse-all-btn';
      btn.textContent='全部收起';
      btn.addEventListener('click', function(){
        var cards = mod.querySelectorAll('.card.collapsible');
        var anyOpen=false; cards.forEach(function(c){ if(!c.classList.contains('collapsed')) anyOpen=true; });
        cards.forEach(function(c){ c.classList.toggle('collapsed', anyOpen); });
        syncLabel(mod);
      });
      head.appendChild(btn);
    }
  });
  // 2) 给每张可折叠卡片包裹主体 + 绑定点击
  document.querySelectorAll('.module').forEach(function(mod){
    var cards = Array.prototype.slice.call(mod.querySelectorAll('.card'));
    cards.forEach(function(card, idx){
      if(card.dataset.collapsibleInited) return;
      var h3 = card.querySelector(':scope > h3');
      var head = null;
      if(h3){ head = h3; }
      else { var sp = card.querySelector(':scope > .dflex.spread'); if(sp && sp.querySelector('h3')) head = sp; }
      if(!head) return; // 无标题卡片（如纯 tabs 卡）不折叠
      var body = document.createElement('div'); body.className='card-body';
      var n = head.nextElementSibling;
      while(n){ var nx=n.nextElementSibling; body.appendChild(n); n=nx; }
      card.appendChild(body);
      card.classList.add('collapsible');
      head.classList.add('card-head');
      var clickEl = head.classList.contains('spread') ? head.querySelector('h3') : head;
      clickEl.classList.add('card-head-chev');
      clickEl.addEventListener('click', function(){
        card.classList.toggle('collapsed');
        card.dataset.userToggled='1';
        syncLabel(modOf(card));
      });
      card.dataset.collapsibleInited='1';
      if(isMobile() && idx>0) card.classList.add('collapsed'); // 默认收起次要卡片
    });
  });
  document.querySelectorAll('.module').forEach(syncLabel);
}
if(document.readyState!=='loading') setupMobileCollapse();
else document.addEventListener('DOMContentLoaded', setupMobileCollapse);

/* ============================================================
 * 模块1：全国房源
 * ============================================================ */
(function(){
  const grid=$('prop-grid'), gridApt=$('prop-grid-apt'), statsEl=$('prop-stats'), countEl=$('prop-count');
  const compareBox=$('compare-box'), rentBox=$('rent-box');
  const selected=new Set();
  // 城市信息映射（用于平台URL动态生成）
  const cityMap={}; CITIES.forEach(c=>cityMap[c.name]=c);
  function typeTag(t){ return t==='住宅'?'<span class="tag res">70年住宅</span>':t==='公寓'?'<span class="tag apt">40年商办</span>':'<span class="tag biz">商办</span>'; }
  function layoutTag(l){ return '<span class="tag" style="background:#eef2ff;color:#3a4ec0;border-color:#c7d2fe">'+l+'</span>'; }
  function cardHTML(x,idx){
    return '<div class="house" data-idx="'+idx+'">' +
      '<div class="top"><b>'+x.community+'</b>'+typeTag(x.type)+layoutTag(x.layout)+'</div>' +
      '<div class="price">'+x.total+'万 <small>· '+x.unit+'元/㎡</small></div>' +
      '<div class="kv"><span><b>'+x.city+' · '+x.district+'</b></span><span>'+x.area+'㎡</span><span>'+x.age+'年楼龄</span><span>'+x.year+'年交房</span></div>' +
      '<div class="kv"><span>'+x.property+'</span>'+(x.gas?'<span class="tag gas">通天然气</span>':'<span class="badge-warn">⚠不通燃气</span>')+'<span>租'+x.rent+'元/月</span></div>' +
      '<div class="fac"><b>物业</b> '+x.wy+' ｜ <b>商圈</b> '+x.biz+'</div>' +
      '<div class="fac"><b>亮点</b> '+x.highlight+'</div>' +
      '<div class="fac"><b>短板</b> '+x.flaw+'</div>' +
      '<div class="fac"><b>风险</b> '+x.risk+'</div>' +
    '</div>';
  }
  // 城市→片区联动
  function districtsOf(city){
    if(!city) return [...new Set(PROPERTY_DATA.map(x=>x.district))];
    return [...new Set(PROPERTY_DATA.filter(x=>x.city===city).map(x=>x.district))];
  }
  function refreshDistricts(){
    const city=$('f-city').value;
    const ds=districtsOf(city);
    $('f-district').innerHTML='<option value="">全部</option>'+ds.map(function(d){return '<option>'+d+'</option>';}).join('');
  }
  function getFiltered(){
    const c=$('f-city').value, d=$('f-district').value, l=$('f-layout').value, t=$('f-type').value;
    const mp=parseFloat($('f-maxprice').value)||Infinity, ma=parseFloat($('f-maxarea').value)||Infinity, newOnly=$('f-newonly').checked;
    return PROPERTY_DATA.filter(function(x){
      if(c&&x.city!==c) return false;
      if(d&&x.district!==d) return false;
      if(l&&x.layout!==l) return false;
      if(t&&x.type!==t) return false;
      if(x.total>mp) return false;
      if(x.area>ma) return false;
      if(newOnly && !(x.year>=2016)) return false;
      return true;
    });
  }
  function render(){
    const list=getFiltered();
    const res=list.filter(function(x){return x.type==='住宅';}), apt=list.filter(function(x){return x.type==='公寓';});
    grid.innerHTML=res.map(function(x,i){return cardHTML(x, PROPERTY_DATA.indexOf(x));}).join('')||'<div class="hint">无符合条件的住宅房源。</div>';
    gridApt.innerHTML=apt.map(function(x){return cardHTML(x, PROPERTY_DATA.indexOf(x));}).join('')||'<div class="hint">无符合条件的商办公寓。</div>';
    const usable=list.filter(function(x){return x.type==='住宅';});
    var avg=function(a){return a.length?Math.round(a.reduce(function(s,x){return s+x;},0)/a.length):0;};
    var cityLabel=$('f-city').value||'全部城市';
    statsEl.innerHTML='<div class="stat"><b>'+usable.length+'</b><span>住宅(套)</span></div><div class="stat"><b>'+apt.length+'</b><span>商办公寓</span></div><div class="stat"><b>'+avg(usable.map(function(x){return x.total;}))+'万</b><span>住宅均价(总)</span></div><div class="stat"><b>'+avg(usable.map(function(x){return x.unit;}))+'</b><span>均价(元/㎡)</span></div><div class="stat"><b>'+(usable.length?avg(usable.map(function(x){return x.age;})).toFixed(1):0)+'年</b><span>平均楼龄</span></div>';
    countEl.textContent=cityLabel+' 共 '+list.length+' 条（住宅 '+res.length+' / 公寓 '+apt.length+'）';
    // 租金行情（按所选城市或全部城市的片区统计）
    var baseCity=$('f-city').value;
    var src = baseCity ? PROPERTY_DATA.filter(function(x){return x.city===baseCity;}) : PROPERTY_DATA;
    var dists=[...new Set(src.map(function(x){return x.district;}))];
    rentBox.innerHTML='<table class="md"><tr><th>城市</th><th>片区</th><th>参考月租(元)</th><th>在售住宅(套)</th></tr>'+dists.map(function(dn){
      var arr=src.filter(function(x){return x.district===dn&&x.type==='住宅';});
      var cName=baseCity||([...new Set(src.filter(function(x){return x.district===dn;}).map(function(x){return x.city;}))].join('/'));
      return '<tr><td>'+cName+'</td><td>'+dn+'</td><td>'+(arr.length?Math.round(arr.reduce(function(s,x){return s+x.rent;},0)/arr.length):'—')+'</td><td>'+arr.length+'</td></tr>';
    }).join('')+'</table>';
    bindCards();
  }
  function bindCards(){
    document.querySelectorAll('#prop-grid .house, #prop-grid-apt .house').forEach(function(el){
      el.addEventListener('click',function(){
        var i=+el.dataset.idx; var key=PROPERTY_DATA[i].community+'|'+PROPERTY_DATA[i].city;
        if(selected.has(key)){ selected.delete(key); el.style.outline=''; } else { if(selected.size>=3){ alert('最多对比 3 套'); return;} selected.add(key); el.style.outline='2px solid #2F6FED'; }
        renderCompare();
      });
    });
  }
  function renderCompare(){
    if(selected.size===0){ compareBox.innerHTML='<span class="hint">点击上方房源卡片加入对比（最多 3 套）。</span>'; return; }
    var arr=[...selected].map(function(k){return PROPERTY_DATA.find(function(x){return x.community+'|'+x.city===k;});}).filter(Boolean);
    compareBox.innerHTML='<table class="md"><tr><th>对比项</th>'+arr.map(function(x){return '<th>'+x.community+'</th>';}).join('')+'</tr>'+
      [['城市',function(x){return x.city;}],['片区',function(x){return x.district;}],['户型',function(x){return x.layout;}],['楼龄',function(x){return x.age+'年';}],['面积',function(x){return x.area+'㎡';}],['总价',function(x){return x.total+'万';}],['单价',function(x){return x.unit+'元/㎡';}],['产权',function(x){return x.property;}],['燃气',function(x){return x.gas?'通燃气':'不通';}],['月租',function(x){return x.rent+'元';}],['物业',function(x){return x.wy;}],['亮点',function(x){return x.highlight;}],['短板',function(x){return x.flaw;}]].map(function(pair){
        var k=pair[0],f=pair[1];
        return '<tr><td><b>'+k+'</b></td>'+arr.map(function(x){return '<td>'+f(x)+'</td>';}).join('')+'</tr>';
      }).join('')+'</table>';
  }
  // —— 初始化下拉 ——
  $('f-city').innerHTML='<option value="">全部城市</option>'+CITIES.map(function(c){return '<option>'+c.name+'</option>';}).join('');
  $('f-layout').innerHTML='<option value="">全部户型</option>'+LAYOUTS.map(function(l){return '<option>'+l+'</option>';}).join('');
  $('live-city').innerHTML=CITIES.map(function(c){return '<option>'+c.name+'</option>';}).join('');
  $('live-layout').innerHTML='<option value="">不限户型</option>'+LAYOUTS.map(function(l){return '<option>'+l+'</option>';}).join('');
  refreshDistricts();
  // —— 事件绑定 ——
  $('f-city').addEventListener('change',function(){ refreshDistricts(); });
  $('f-apply').addEventListener('click',render);
  $('f-reset').addEventListener('click',function(){ $('f-city').value='';$('f-layout').value='';$('f-type').value='';$('f-newonly').checked=false;$('f-maxprice').value='';$('f-maxarea').value='';refreshDistricts();render(); });
  $('prop-export').addEventListener('click',function(){
    var list=getFiltered(); var res=list.filter(function(x){return x.type==='住宅';}), apt=list.filter(function(x){return x.type==='公寓';});
    var head='|城市|户型|小区|片区|楼龄|面积|总价|单价|物业|燃气|月租|亮点|短板|风险|';
    var sep='|---|---|---|---|---|---|---|---|---|---|---|---|---|---|';
    var row=function(x){return '|'+x.city+'|'+x.layout+'|'+x.community+'|'+x.district+'|'+x.age+'年|'+x.area+'㎡|'+x.total+'万|'+x.unit+'|'+x.wy+'|'+(x.gas?'通':'不通')+'|'+x.rent+'|'+x.highlight+'|'+x.flaw+'|'+x.risk+'|';};
    var md='# 全国二手房源（调研参考）\n> 数据来源：贝壳/安居客公开在售整合，仅供参考，不作为交易依据。\n> 城市筛选：'+($('f-city').value||'全部')+' · 户型：'+($('f-layout').value||'全部')+'\n\n## 70年纯住宅\n'+head+'\n'+sep+'\n'+res.map(row).join('\n')+'\n\n## 40年商办公寓\n'+head+'\n'+sep+'\n'+apt.map(row).join('\n')+'\n';
    download('全国房源.md',md);
  });
  // —— 多平台实时检索（按城市动态生成URL，写入 <a> href）——
  var PLATFORMS = {
    beike:function(sale,layout,type,city){
      var c=cityMap[city]||cityMap['晋江'];
      var path = sale==='租房'?'zufang/':sale==='新房'?'loupan/':'ershoufang/';
      return 'https://'+c.abbr+'.ke.com/'+path;
    },
    anjuke:function(sale,layout,type,city){
      var c=cityMap[city]||cityMap['晋江'];
      return 'https://'+c.py+'.anjuke.com/'+(sale==='租房'?'rent/':'sale/');
    },
    lianjia:function(sale,layout,type,city){
      var c=cityMap[city]||cityMap['晋江'];
      return 'https://'+c.abbr+'.lianjia.com/'+(sale==='租房'?'zufang/':'ershoufang/');
    },
    '58':function(sale,layout,type,city){
      var c=cityMap[city]||cityMap['晋江'];
      return 'https://'+c.abbr+'.58.com/'+(sale==='租房'?'chuzu/':'ershoufang/');
    },
    baidu:function(sale,layout,type,city){
      var q=city+' '+(layout||'')+' '+(type==='商办'?'商办 ':'')+(sale==='租房'?'租房':sale==='新房'?'新房':'二手房')+' 房源';
      return 'https://www.baidu.com/s?wd='+encodeURIComponent(q.trim());
    }
  };
  function updatePlatformLinks(){
    var sale=$('live-sale').value, layout=$('live-layout').value, type=$('live-type').value, city=$('live-city').value||'晋江';
    document.querySelectorAll('[data-plat]').forEach(function(a){
      a.href=PLATFORMS[a.dataset.plat](sale,layout,type,city);
    });
  }
  try {
    if($('live-city')) $('live-city').addEventListener('change',updatePlatformLinks);
    if($('live-sale')) $('live-sale').addEventListener('change',updatePlatformLinks);
    if($('live-layout')) $('live-layout').addEventListener('change',updatePlatformLinks);
    if($('live-type')) $('live-type').addEventListener('change',updatePlatformLinks);
    updatePlatformLinks();
    render();
  } catch(e){ console.error('[property] init error:', e); }
  window.TW_refresh=window.TW_refresh||{}; window.TW_refresh.property=render;
})();


/* ============================================================
 * 模块2：CMYK 色卡
 * ============================================================ */
(function(){
  if(!document.getElementById('c-hex')) return; // 模块已移除时直接跳过，避免中断脚本
  const hexIn=$('c-hex'),rgbIn=$('c-rgb'),cmykIn=$('c-cmyk'),picker=$('c-picker'),prev=$('c-preview');
  function syncFromHex(hex){ const r=hexToRgb(hex); if(!r)return; const cm=rgbToCmyk(r.r,r.g,r.b); rgbIn.value=`${r.r},${r.g},${r.b}`; cmykIn.value=cmykStr(cm); picker.value=hex.toUpperCase(); prev.style.background=hex.toUpperCase(); }
  function syncFromRgb(s){ const p=s.split(',').map(Number); if(p.length!==3||p.some(isNaN))return; const h=rgbToHex(p[0],p[1],p[2]); syncFromHex(h); hexIn.value=h; }
  function syncFromCmyk(s){ const p=s.split(',').map(Number); if(p.length!==4||p.some(isNaN))return; const r=cmykToRgb(p[0],p[1],p[2],p[3]),h=rgbToHex(r.r,r.g,r.b); syncFromHex(h); hexIn.value=h; rgbIn.value=`${r.r},${r.g},${r.b}`; }
  $('c-apply').addEventListener('click',()=>{ const a=document.activeElement; if(a===hexIn)syncFromHex(hexIn.value); else if(a===rgbIn)syncFromRgb(rgbIn.value); else if(a===cmykIn)syncFromCmyk(cmykIn.value); else syncFromHex(hexIn.value); });
  hexIn.addEventListener('change',()=>syncFromHex(hexIn.value)); rgbIn.addEventListener('change',()=>syncFromRgb(rgbIn.value)); cmykIn.addEventListener('change',()=>syncFromCmyk(cmykIn.value)); picker.addEventListener('input',()=>{ syncFromHex(picker.value); hexIn.value=picker.value.toUpperCase(); });
  $('c-advice').addEventListener('click',()=>{
    const r=hexToRgb(hexIn.value)||{r:47,g:111,b:237}, cm=rgbToCmyk(r.r,r.g,r.b), total=cm.c+cm.m+cm.y+cm.k;
    const hsl=rgbToHsl(r.r,r.g,r.b); let s='';
    // 高偏色系识别
    if(r.r>r.g&&r.g>r.b&&r.r-r.b>40&&hsl.l<55) s+='【棕色系】棕系易偏红，建议品红略降、黄版主导，实色加少量黑防堆墨；';
    else if(hsl.l>78&&hsl.s<25) s+='【米白/浅灰系】浅色网点易丢失，建议加深 3~5%、避免绝网，K 版微补；';
    else if(hsl.s<22&&hsl.l>=45&&hsl.l<=80) s+='【浅灰系】灰平衡关键，C/M/Y 等比、K 微调，防止偏色；';
    else if(b>r&&b>g&&b-r>30&&hsl.l<55) s+='【宝蓝/深色系】蓝系青版网点增大明显，注意 K 版补网、控制总墨量；';
    else if(hsl.l<35) s+='【深色系】深色总墨量高，建议用替代黑（少C多K）避免透印；';
    else s+='【常规色】色值适中，常规四色可印；';
    if(total>300) s+=' 总墨量偏高，压暗部、控≤300%。';
    s+=' 材质适配：纸张印刷网点稳定；PVC 表面反光，建议加深 5~8% 并做耐磨；布料吸墨扩散，建议扩网 3~5% 并预缩水。';
    s+='（印刷参考值，大货量产务必实物打样核对）';
    $('c-advice-out').textContent=s;
  });
  const grid=$('p-grid'); let lib=[...PANTONE_TPG]; const PAGE=120; let curList=[], shown=0;
  function renderLib(k=''){ k=k.trim().toLowerCase(); curList=lib.filter(x=>!k||x.code.toLowerCase().includes(k)||x.name.toLowerCase().includes(k)); shown=Math.min(PAGE,curList.length); paintGrid(); }
  function paintGrid(){ const list=curList, slice=list.slice(0,shown);
    grid.innerHTML=slice.map(x=>{const r=hexToRgb(x.hex)||{r:0,g:0,b:0},cm=rgbToCmyk(r.r,r.g,r.b);return `<div class="swatch" data-hex="${x.hex}"><div class="chip" style="background:${x.hex}"></div><div class="info"><b>${x.code}</b><br>${x.name}<code>HEX ${x.hex.toUpperCase()}</code><div class="cmyk">CMYK ${cmykStr(cm)}</div><div class="cmyk">RGB ${r.r},${r.g},${r.b}</div><button class="btn ghost sm" data-topal="${x.hex}" style="margin-top:5px;padding:2px 8px">→ 配色</button></div></div>`;}).join('')||'<div class="hint">未找到。</div>';
    if(list.length>shown){ const b=document.createElement('button'); b.className='btn ghost sm'; b.id='p-more'; b.style.marginTop='10px'; b.textContent=`加载更多（剩余 ${list.length-shown} 条）`; grid.appendChild(b); b.addEventListener('click',()=>{ shown=Math.min(shown+PAGE,list.length); paintGrid(); }); }
    grid.querySelectorAll('.swatch').forEach(el=>el.addEventListener('click',()=>{ const h=el.dataset.hex; hexIn.value=h.toUpperCase(); syncFromHex(h); document.querySelector('.main').scrollTo({top:0,behavior:'smooth'}); }));
    grid.querySelectorAll('[data-topal]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); TW.sendColor(b.dataset.topal,'palette'); }));
    if($('p-count-out'))$('p-count-out').textContent=`共 ${list.length} 条 TPG 色（TPG 为纺织色卡，印刷以实物色卡为准）`; }
  $('p-search-btn').addEventListener('click',()=>renderLib($('p-search').value));
  $('p-search').addEventListener('keydown',e=>{ if(e.key==='Enter')renderLib($('p-search').value); });
  $('p-add').addEventListener('click',()=>{ const c=$('p-new-code').value.trim(),n=$('p-new-name').value.trim(),h=$('p-new-hex').value; if(!c||!n){alert('填色号与名称');return;} lib.unshift({code:c,name:n,hex:h.toUpperCase()}); renderLib($('p-search').value); $('p-new-code').value='';$('p-new-name').value=''; });
  renderLib();
  window.__COLOR_setHex=function(hex){ hex=(hex||'').toUpperCase(); if(!hexToRgb(hex))return; hexIn.value=hex; syncFromHex(hex); document.querySelector('.main').scrollTo({top:0,behavior:'smooth'}); };
  // 取色
  const pc=$('pick-canvas'),pctx=pc.getContext('2d',{willReadFrequently:true});
  $('pick-input').addEventListener('change',e=>{ const f=e.target.files[0]; if(!f)return; const img=new Image(); img.onload=()=>{ let w=img.naturalWidth,h=img.naturalHeight; if(w>900){const r=900/w;w=900;h=Math.round(h*r);} pc.width=w;pc.height=h;pctx.drawImage(img,0,0,w,h); }; img.src=URL.createObjectURL(f); });
  pc.addEventListener('click',e=>{ const rc=pc.getBoundingClientRect(),x=Math.round((e.clientX-rc.left)*(pc.width/rc.width)),y=Math.round((e.clientY-rc.top)*(pc.height/rc.height)),d=pctx.getImageData(x,y,1,1).data,rgb={r:d[0],g:d[1],b:d[2]},hex=rgbToHex(rgb.r,rgb.g,rgb.b),cm=rgbToCmyk(rgb.r,rgb.g,rgb.b); $('pick-rgb').textContent=`${rgb.r},${rgb.g},${rgb.b}`; $('pick-hex').textContent=hex; $('pick-cmyk').textContent=cmykStr(cm)+`（印刷参考值，大货务必打样核对）`; hexIn.value=hex;syncFromHex(hex); window.__pickHex=hex; if($('pick-to-pal'))$('pick-to-pal').disabled=false; pctx.fillStyle='#2F6FED';pctx.beginPath();pctx.arc(x,y,4,0,7);pctx.fill();pctx.strokeStyle='#fff';pctx.lineWidth=2;pctx.beginPath();pctx.arc(x,y,4,0,7);pctx.stroke(); });
  $('pick-to-pal').addEventListener('click',()=>{ if($('pick-to-pal').disabled||!window.__pickHex)return; TW.sendColor(window.__pickHex,'palette'); });
})();


/* ============================================================
 * 模块3：智能配色
 * ============================================================ */
(function(){
  if(!document.getElementById('pal-out')) return; // 模块已移除时直接跳过
  const out=$('pal-out'),sel=$('pal-preset'),gal=$('pal-gallery');
  PALETTE_PRESETS.forEach((p,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=(p.cat?p.cat+' · ':'')+p.name; sel.appendChild(o); });
  function swatchRow(colors){ return colors.map(h=>{ const r=hexToRgb(h)||{r:0,g:0,b:0},cm=rgbToCmyk(r.r,r.g,r.b); return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="width:26px;height:26px;border-radius:5px;border:1px solid #ccc;background:${h}"></span><span style="font-family:ui-monospace,monospace;font-size:12px">${h.toUpperCase()} · C${cm.c} M${cm.m} Y${cm.y} K${cm.k}</span><button class="btn ghost sm" data-sendcol="${h}" style="padding:2px 7px">→色卡</button></div>`; }).join(''); }
  function HX(h,s,l){ const c=hslToRgb(((h%360)+360)%360, clamp(s,0,100), clamp(l,0,100)); return rgbToHex(Math.round(c.r),Math.round(c.g),Math.round(c.b)); }
  function harmonyGroups(hex){
    const r=hexToRgb(hex)||{r:30,g:58,b:95}, hsl=rgbToHsl(r.r,r.g,r.b), h=hsl.h,s=hsl.s,l=hsl.l;
    const mono=[HX(h,s,Math.min(l+22,96)),HX(h,s,l+11),hex,HX(h,s+10,Math.max(l-15,4)),HX(h,s,Math.max(l-30,3))];
    const ana=[HX(h-40,s,l),HX(h-20,s,l),hex,HX(h+20,s,l),HX(h+40,s,l)];
    const comp=[hex,HX(h+180,s,clamp(l,32,72)),HX(h+180,s+12,clamp(l-10,4,99)),HX(h,s,l+12),'#FFFFFF'];
    const split=[hex,HX(h+150,s,clamp(l,34,74)),HX(h+210,s,clamp(l,34,74)),HX(h,s-12,Math.max(l-12,4))];
    const tri=[hex,HX(h+120,s,clamp(l,34,74)),HX(h+240,s,clamp(l,34,74)),HX(h,s,l+10)];
    const tetra=[hex,HX(h+90,s,clamp(l,34,74)),HX(h+180,s,clamp(l,34,74)),HX(h+270,s,clamp(l,34,74))];
    const neu=['#F4F1EC','#D9D4CB','#9A948B',hex,'#2B2B2C'];
    return [
      {name:'同色系 · 深浅渐变',cols:mono},
      {name:'邻近色 · 协调过渡',cols:ana},
      {name:'互补色 · 强对比',cols:comp},
      {name:'分裂互补 · 柔和撞色',cols:split},
      {name:'三角色 · 活泼均衡',cols:tri},
      {name:'四角色 · 丰富组合',cols:tetra},
      {name:'中性色 · 高级底色',cols:neu}
    ];
  }
  function gen(baseHex, material){
    const groups=harmonyGroups(baseHex);
    const matNote={ '纸张印刷':'网点稳定，按 CMYK 直接出；','PVC印刷':'表面反光，整体加深 5~8% 并做耐磨处理；','布料印刷':'吸墨扩散，扩网 3~5% 并预缩水。' }[material]||'';
    out.innerHTML=groups.map(g=>`<div class="card" style="margin-bottom:12px"><h3><span class="dot"></span>${g.name}</h3>${swatchRow(g.cols)}<div class="hint" style="margin-top:6px">${matNote}（印刷参考值，大货务必实物打样核对）</div></div>`).join('')+
      `<div class="dflex"><button class="btn ghost sm" id="pal-copy">复制全部配色CMYK</button></div>`;
    out.querySelectorAll('[data-sendcol]').forEach(b=>b.addEventListener('click',()=>TW.sendColor(b.dataset.sendcol,'color')));
    $('pal-copy').addEventListener('click',()=>{ let txt='TRAEWork 配色方案（'+material+'）\n'; groups.forEach(g=>{ txt+=`\n【${g.name}】\n`+g.cols.map(h=>{const rr=hexToRgb(h)||{r:0,g:0,b:0},cm=rgbToCmyk(rr.r,rr.g,rr.b);return `${h.toUpperCase()} CMYK(${cmykStr(cm)})`;}).join('\n'); }); download('配色方案.txt',txt); });
  }
  function renderGallery(){ if(!gal)return; gal.innerHTML=PALETTE_PRESETS.map((p,i)=>`<div class="pcard" data-i="${i}" title="点击套用：${p.name}"><div class="pname">${p.cat} · ${p.name}</div><div class="pbar">${p.scheme.map(c=>`<span style="background:${c}"></span>`).join('')}</div></div>`).join(''); gal.querySelectorAll('.pcard').forEach(el=>el.addEventListener('click',()=>{ const p=PALETTE_PRESETS[+el.dataset.i]; $('pal-base').value=p.base.toUpperCase(); sel.value=String(+el.dataset.i); gen(p.base,$('pal-material').value); gal.querySelectorAll('.pcard').forEach(x=>x.style.outline=''); el.style.outline='2px solid #2F6FED'; })); }
  $('pal-gen').addEventListener('click',()=>{ const base=$('pal-preset').value!==''?PALETTE_PRESETS[+$('pal-preset').value].base:$('pal-base').value; gen(base,$('pal-material').value); });
  if($('pal-random')) $('pal-random').addEventListener('click',()=>{ const hue=[8,28,52,140,196,265,320][Math.floor(Math.random()*7)]; const s=55+Math.random()*25, l=45+Math.random()*15; const c=hslToRgb(hue,s,l); const hex=rgbToHex(Math.round(c.r),Math.round(c.g),Math.round(c.b)); $('pal-base').value=hex; sel.value=''; gen(hex,$('pal-material').value); });
  gen($('pal-base').value,$('pal-material').value);
  window.__PALETTE_setBase=function(hex){ $('pal-base').value=(hex||'').toUpperCase(); gen(hex,$('pal-material').value); };
  renderGallery();
})();



/* ============================================================
 * 模块4：排版兼职招聘
 * ============================================================ */
(function(){
  const list=$('rec-list');
  if($('rec-sites') && typeof RECRUIT_SITES!=='undefined'){ $('rec-sites').innerHTML=RECRUIT_SITES.map(s=>`<a class="btn ghost sm" href="${s.url}" target="_blank" rel="noopener" title="${s.desc}">${s.name} ↗</a>`).join(''); }
  // 动态填充城市下拉（取城市主段：如「嘉兴·海宁」→ 全部、「嘉兴」→ 嘉兴）
  if($('rec-city')){ const src=(typeof RECRUIT_CITIES!=='undefined'&&RECRUIT_CITIES.length)?RECRUIT_CITIES:[...new Set(RECRUIT_DATA.map(x=>x.city.split('·')[0]))]; const cities=[...new Set(src)].sort((a,b)=>a.localeCompare(b,'zh')); $('rec-city').innerHTML='<option value="">全部城市</option>'+cities.map(c=>`<option>${c}</option>`).join(''); }
  function siteUrl(p){ const m=typeof RECRUIT_SITES!=='undefined'&&RECRUIT_SITES.find(x=>x.name===p); return m?m.url:'https://www.zhipin.com'; }
  function render(){ const p=$('rec-platform').value, m=$('rec-mode').value, c=$('rec-city').value; const arr=RECRUIT_DATA.filter(x=>(!p||x.platform===p)&&(!c||x.city.startsWith(c))&&(!m||x.mode.includes(m)));
    if(!arr.length){
      const sites=(typeof RECRUIT_SITES!=='undefined'?RECRUIT_SITES.map(s=>`<a class="btn ghost sm" href="${s.url}" target="_blank" rel="noopener">${s.name} ↗</a>`).join(''):'');
      list.innerHTML='<div class="hint" style="padding:14px 0">📭 当前筛选条件下暂无整合招聘数据。<br>建议：① 放宽「平台 / 方式」筛选；② 直接点击下方平台按钮查看该城市实时招聘（招聘人/联系方式/地址/福利/要求）。</div><div class="dflex wrap" style="gap:8px;flex-wrap:wrap;margin-top:8px">'+sites+'</div>';
      return;
    }
    list.innerHTML=arr.map(x=>`<div class="fcard"><h4>${x.title}<span class="pill">${x.platform}</span></h4><div class="meta"><span>💰 <b>${x.pay}</b></span><span>📍 ${x.city}</span><span>🛠 ${x.req}</span><span>📋 ${x.mode}</span><span>💳 ${x.settle}</span></div><p>${x.note}</p><div class="dflex" style="margin-top:8px"><a class="btn ghost sm" href="${siteUrl(x.platform)}" target="_blank" rel="noopener">去${x.platform}看实时（招聘人/联系方式/地址/福利/要求）↗</a></div></div>`).join(''); }
  $('rec-search').addEventListener('click',render); render();
  window.TW_refresh=window.TW_refresh||{}; window.TW_refresh.recruit=render;
})();

/* ============================================================
 * 模块5：红果短剧（已移除，保留防御性早退避免脚本中断）
 * ============================================================ */
(function(){
  if(!document.getElementById('dra-list')) return;
  const list=$('dra-list');
  function searchUrl(name){ return 'https://www.baidu.com/s?wd='+encodeURIComponent(name+' 红果短剧'); }
  // 分类导航：从 tags 聚合所有分类，点击即按该标签筛选
  const cats=[...new Set(DRAMA_DATA.flatMap(x=>x.tags.split('·').map(t=>t.trim())))].sort((a,b)=>a.localeCompare(b,'zh'));
  let activeCat='';
  const nav=$('dra-nav');
  function paintNav(){ nav.innerHTML=''; const mk=(label,val)=>{ const b=document.createElement('button'); b.className='btn ghost sm'+(activeCat===val?' on':''); b.textContent=label; b.addEventListener('click',()=>{ activeCat=(activeCat===val)?'':val; $('dra-search').value=''; paintNav(); render(); }); nav.appendChild(b); }; mk('全部',''); cats.forEach(c=>mk(c,c)); }
  paintNav();
  function render(){ const k=$('dra-search').value.trim().toLowerCase(); const arr=DRAMA_DATA.filter(x=>(!activeCat||x.tags.includes(activeCat))&&(!k||x.name.toLowerCase().includes(k)||x.tags.toLowerCase().includes(k)||x.likes.toLowerCase().includes(k)));
    $('dra-count').textContent=`共 ${arr.length} 部`+(activeCat?`（分类：${activeCat}）`:'');
    list.innerHTML=arr.map(x=>`<div class="fcard"><h4>${x.name}</h4><div class="meta">${x.tags.split('·').map(t=>`<span class="pill" style="cursor:pointer" data-tag="${t.trim()}">${t.trim()}</span>`).join('')}<span>🔥 ${x.heat}</span></div><p><b>简介：</b>${x.likes}</p><p><b>看点：</b>${x.point}</p><div class="dflex" style="margin-top:8px"><a class="btn ghost sm" href="${searchUrl(x.name)}" target="_blank" rel="noopener">在红果搜这部剧 ↗</a></div></div>`).join('')||'<div class="hint">无匹配短剧。</div>';
    list.querySelectorAll('[data-tag]').forEach(s=>s.addEventListener('click',()=>{ activeCat=s.dataset.tag; $('dra-search').value=''; paintNav(); render(); }));
  }
  $('dra-btn').addEventListener('click',render); render();
  window.TW_refresh=window.TW_refresh||{}; window.TW_refresh.drama=render;
})();

/* ============================================================
 * 模块6：全网影视（主流视频平台实时版）
 * 聚合腾讯视频/优酷/爱奇艺/哔哩哔哩/芒果TV 等平台实时剧集·动漫·综艺；
 * 平台直达 + 跨平台并行检索 + 每条直达原平台可看资源。
 * ============================================================ */
const FILM_PLATFORMS = [
  {name:'腾讯视频', home:'https://v.qq.com/',        search:'https://v.qq.com/x/search/?q='},
  {name:'优酷',     home:'https://www.youku.com/',    search:'https://so.youku.com/search_video/q_'},
  {name:'爱奇艺',   home:'https://www.iqiyi.com/',    search:'https://so.iqiyi.com/so/q_'},
  {name:'哔哩哔哩', home:'https://www.bilibili.com/',  search:'https://search.bilibili.com/all?keyword='},
  {name:'芒果TV',   home:'https://www.mgtv.com/',     search:'https://so.mgtv.com/so?k='}
];
(function(){
  const list=$('film-list'),
        pf=$('film-platforms'), kw=$('film-kw'), slinks=$('film-search-links');
  if(!list) return;

  // 主流平台实时直达
  if(pf) pf.innerHTML=FILM_PLATFORMS.map(p=>`<a class="btn ghost sm" href="${p.home}" target="_blank" rel="noopener">${p.name} ↗</a>`).join('');

  // 跨平台实时检索（并行打开）
  function paintSearch(t){
    const e=encodeURIComponent(t);
    if(slinks) slinks.innerHTML=FILM_PLATFORMS.map(p=>{
      const u=(p.search.indexOf('q_')>=0)?p.search+e:p.search+e;
      return `<a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">在${p.name}搜 ↗</a>`;
    }).join('');
  }
  if($('film-search')) $('film-search').addEventListener('click',()=>{ const t=(kw.value||'').trim(); if(t) paintSearch(t); });
  if(kw) kw.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const t=kw.value.trim(); if(t) paintSearch(t); } });

  // 列表渲染（每条直达各平台可看资源）
  function render(){
    const k=$('film-kind').value, sort=$('film-sort').value;
    let arr=FILM_DATA.filter(x=>!k||x.kind===k);
    arr.sort((a,b)=>sort==='year'?b.year-a.year:b.score-a.score);
    $('film-count').textContent=`共 ${arr.length} 部`;
    list.innerHTML=arr.map(x=>{
      const e=encodeURIComponent(x.name);
      const links=FILM_PLATFORMS.map(p=>{
        const u=(p.search.indexOf('q_')>=0)?p.search+e:p.search+e;
        return `<a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">${p.name} ↗</a>`;
      }).join('');
      return `<div class="fcard"><h4>${x.name}<span class="pill">${x.kind}</span><span class="pill">${x.year}</span><span class="pill">★${x.score}</span></h4>`+
        `<div class="meta"><span>${x.type}</span><span>适配：${x.audience}</span></div>`+
        `<p>${x.likes}</p>`+
        `<div class="dflex" style="margin-top:8px;gap:6px">${links}</div></div>`;
    }).join('')||'<div class="hint">无匹配内容。</div>';
  }
  $('film-btn').addEventListener('click',render); render();
  window.TW_refresh=window.TW_refresh||{}; window.TW_refresh.film=render;
})();

/* ============================================================
 * 数据元信息徽标（① 数据源透明化）
 * ============================================================ */
(function(){ if(typeof DATA_META==='undefined')return;
  document.querySelectorAll('.dmeta').forEach(el=>{ const m=DATA_META[el.dataset.dm]; if(!m)return;
    el.innerHTML=`📅 数据更新于 <b>${m.updatedAt}</b> ｜ 来源：${m.source}${m.live?` ｜ <a href="${m.live}" target="_blank" rel="noopener">查看实时↗</a>`:''}`;
  });
})();
