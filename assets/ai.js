/* ============================================================
 * TRAEWork 工作台 —— 模块4：全能 AI 智能辅助（全面升级版）
 * 双模式：① 本地智能生成引擎（离线模板 + 规则算法）
 *         ② 主流 AI 平台实时直达（点击进最新实时对话/生成）
 * 覆盖 7 大类 22 项 AI 能力：写作文案 / 文本处理 / 图像设计
 *       / 规划结构 / 问答脑暴 / 编程办公 / 生活创意
 * 所有本地输出为结构化 Markdown，商用合规、无版权风险。
 * ============================================================ */
(function(){
  'use strict';

  /* ---------------- 轻量 Markdown → HTML ---------------- */
  function aiMd2html(md){
    if(!md) return '';
    var esc = function(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
    var inline = function(s){
      s = esc(s);
      s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
      s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g,'<strong>$1</strong>');
      return s;
    };
    var splitRow = function(l){ return l.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(function(c){return c.trim();}); };
    var isSep = function(l){ return /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.indexOf('-')>=0; };
    var lines = md.replace(/\r\n/g,'\n').split('\n');
    var html='', i=0;
    while(i<lines.length){
      var l = lines[i];
      if(/^```/.test(l)){ var buf=[]; i++; while(i<lines.length && !/^```/.test(lines[i])){ buf.push(lines[i]); i++; } html+='<pre><code>'+esc(buf.join('\n'))+'</code></pre>'; continue; }
      if(/^###\s+/.test(l)){ html+='<h3>'+inline(l.replace(/^###\s+/,''))+'</h3>'; i++; continue; }
      if(/^##\s+/.test(l)){ html+='<h2>'+inline(l.replace(/^##\s+/,''))+'</h2>'; i++; continue; }
      if(/^#\s+/.test(l)){ html+='<h1>'+inline(l.replace(/^#\s+/,''))+'</h1>'; i++; continue; }
      if(/^>\s?/.test(l)){ var qb=[]; while(i<lines.length && /^>\s?/.test(lines[i])){ qb.push(lines[i].replace(/^>\s?/,'')); i++; } html+='<blockquote>'+inline(qb.join(' '))+'</blockquote>'; continue; }
      if(/^---+\s*$/.test(l)){ html+='<hr>'; i++; continue; }
      if(/^\s*\|.*\|\s*$/.test(l) && i+1<lines.length && isSep(lines[i+1])){
        var head=splitRow(l); i+=2; var rows=[];
        while(i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])){ rows.push(splitRow(lines[i])); i++; }
        html+='<div class="table-wrap"><table class="md"><thead><tr>'+head.map(function(h){return '<th>'+inline(h)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+inline(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
        continue;
      }
      if(/^\s*[-*]\s+/.test(l)){ var ub=[]; while(i<lines.length && /^\s*[-*]\s+/.test(lines[i])){ ub.push(lines[i].replace(/^\s*[-*]\s+/,'')); i++; } html+='<ul>'+ub.map(function(b){return '<li>'+inline(b)+'</li>';}).join('')+'</ul>'; continue; }
      if(/^\s*\d+\.\s+/.test(l)){ var ob=[]; while(i<lines.length && /^\s*\d+\.\s+/.test(lines[i])){ ob.push(lines[i].replace(/^\s*\d+\.\s+/,'')); i++; } html+='<ol>'+ob.map(function(b){return '<li>'+inline(b)+'</li>';}).join('')+'</ol>'; continue; }
      if(l.trim()===''){ i++; continue; }
      var pb=[l]; i++;
      while(i<lines.length && lines[i].trim()!=='' && !/^(#{1,3}\s|>\s?|-\s|\*\s|\d+\.\s|\|.*\|\s*$|---+\s*$)/.test(lines[i])){ pb.push(lines[i]); i++; }
      html+='<p>'+pb.map(inline).join('<br>')+'</p>';
    }
    return html;
  }

  /* ---------------- 多语言术语库 ---------------- */
  var GL = {
    '印刷':{en:'printing',ja:'印刷(いんさつ)',ko:'인쇄'},'潘通':{en:'Pantone',ja:'パントン',ko:'팬톤'},
    '色差':{en:'color difference',ja:'色差(しさ)',ko:'색차'},'打样':{en:'proofing',ja:'校正(こうせい)',ko:'교정'},
    '油墨':{en:'ink',ja:'インキ',ko:'잉크'},'纸张':{en:'paper',ja:'紙(かみ)',ko:'종이'},'布料':{en:'fabric',ja:'布(ぬの)',ko:'원단'},
    '户型':{en:'layout',ja:'間取り(まどり)',ko:'평형'},'二手房':{en:'second-hand house',ja:'中古住宅',ko:'중고주택'},
    '房贷':{en:'mortgage',ja:'住宅ローン',ko:'주택담보대출'},'公积金':{en:'housing fund',ja:'住宅積立金',ko:'주택공제'},
    '契税':{en:'deed tax',ja:'不動産取得税',ko:'취득세'},'限购':{en:'purchase restriction',ja:'購入制限',ko:'구매제한'},
    '满五唯一':{en:'five-year-one-house',ja:'満5年唯一',ko:'5년유일'},
    '设计':{en:'design',ja:'デザイン',ko:'디자인'},'配色':{en:'color scheme',ja:'配色(はいしょく)',ko:'배색'},
    '海报':{en:'poster',ja:'ポスター',ko:'포스터'},'品牌':{en:'brand',ja:'ブランド',ko:'브랜드'},
    '文案':{en:'copy',ja:'コピー',ko:'카피'},'营销':{en:'marketing',ja:'マーケティング',ko:'마케팅'},
    '短视频':{en:'short video',ja:'ショート動画',ko:'숏폼'},'电商':{en:'e-commerce',ja:'EC',ko:'이커머스'},
    '运营':{en:'operation',ja:'オペレーション',ko:'운영'},'用户':{en:'user',ja:'ユーザー',ko:'사용자'},
    '体验':{en:'experience',ja:'体験',ko:'경험'},'质量':{en:'quality',ja:'品質',ko:'품질'},
    '交付':{en:'delivery',ja:'納品',ko:'납품'},'进度':{en:'progress',ja:'進捗',ko:'진행'},
    '方案':{en:'solution',ja:'案(あん)',ko:'방안'},'需求':{en:'requirement',ja:'要件',ko:'요구사항'},
    '产品':{en:'product',ja:'製品',ko:'제품'},'服务':{en:'service',ja:'サービス',ko:'서비스'},
    '价格':{en:'price',ja:'価格',ko:'가격'},'优惠':{en:'discount',ja:'割引',ko:'할인'},
    '活动':{en:'campaign',ja:'キャンペーン',ko:'이벤트'},'会议':{en:'meeting',ja:'会議',ko:'회의'},
    '报告':{en:'report',ja:'レポート',ko:'보고서'},'数据':{en:'data',ja:'データ',ko:'데이터'},
    '团队':{en:'team',ja:'チーム',ko:'팀'},'项目':{en:'project',ja:'プロジェクト',ko:'프로젝트'},
    '公司':{en:'company',ja:'会社',ko:'회사'},'客户':{en:'client',ja:'クライアント',ko:'고객'},
    '市场':{en:'market',ja:'市場',ko:'시장'},'销售':{en:'sales',ja:'営業',ko:'영업'},
    '成本':{en:'cost',ja:'コスト',ko:'비용'},'效率':{en:'efficiency',ja:'効率',ko:'효율'},
    '创新':{en:'innovation',ja:'革新',ko:'혁신'},'目标':{en:'goal',ja:'目標',ko:'목표'},
    'logo':{en:'logo',ja:'ロゴ',ko:'로고'},'色彩':{en:'color',ja:'色彩(しきさい)',ko:'컬러'}
  };
  function translate(text,target){
    if(!target||target==='zh') return text;
    var out=text;
    Object.keys(GL).sort(function(a,b){return b.length-a.length;}).forEach(function(k){
      if(out.indexOf(k)>=0){ out=out.split(k).join(GL[k][target]||k); }
    });
    return out;
  }

  /* ---------------- 文本处理算法 ---------------- */
  var FILLERS=['其实呢','说真的','说实话','说实在的','一般来讲','总的来说','基本上','应该说','我个人觉得','个人觉得','怎么说呢','这个嘛','呃','额','嘛','就是说','也就是说','说白了','换句话说','众所周知','不得不说','毋庸置疑','总而言之','说句实话','实话说','老实说','讲真的','一整个','绝绝子','yyds','家人们','宝子们','集美们','咱就是说','狠狠','泰裤辣','拿捏','冲鸭','绝了','咱','喏','哎','呀','哈','哦','啦','呗','噻'];
  var SYN=[['很好','出色'],['不错','优良'],['很多','大量'],['非常','格外'],['觉得','认为'],['可以','能够'],['问题','议题'],['办法','方案'],['因为','鉴于'],['所以','故而'],['但是','然而'],['重要','关键'],['需要','亟需'],['开始','启动'],['结束','收官'],['帮助','协助'],['使用','运用'],['提高','提升'],['增加','增长'],['减少','降低'],['改变','优化'],['漂亮','美观'],['便宜','实惠'],['快速','高效'],['简单','轻简'],['困难','挑战'],['努力','深耕'],['希望','期待'],['喜欢','青睐'],['知道','获悉'],['明白','厘清'],['做','推进'],['想','考量'],['看','审视'],['说','阐述']];
  var TYPOS=[['凭心而论','平心而论'],['默守成规','墨守成规'],['一如继往','一如既往'],['不径而走','不胫而走'],['一愁莫展','一筹莫展'],['穿流不息','川流不息'],['迫不急待','迫不及待'],['甘败下风','甘拜下风'],['悬梁刺骨','悬梁刺股'],['食不裹腹','食不果腹'],['饮鸠止渴','饮鸩止渴'],['安祥','安详'],['布署','部署'],['按排','安排'],['必竟','毕竟'],['编缉','编辑'],['辨论','辩论'],['沉缅','沉湎'],['璀灿','璀璨'],['渡假','度假'],['防碍','妨碍'],['粉沫','粉末'],['风糜','风靡'],['幅射','辐射'],['高吭','高亢'],['鼓惑','蛊惑'],['规距','规矩'],['寒喧','寒暄'],['喝采','喝彩'],['急燥','急躁'],['既使','即使'],['佳宾','嘉宾'],['坚难','艰难'],['交待','交代'],['叫囔','叫嚷'],['接恰','接洽'],['精典','经典'],['决对','绝对'],['峻工','竣工'],['恐布','恐怖'],['拉圾','垃圾'],['老俩口','老两口'],['连系','联系'],['了草','潦草'],['临摩','临摹'],['美仑美奂','美轮美奂'],['明片','名片'],['模似','模拟'],['膨涨','膨胀'],['批叛','批判'],['偏面','片面'],['拼揍','拼凑'],['气慨','气概'],['迁徒','迁徙'],['清淅','清晰'],['人材','人才'],['溶入','融入'],['善长','擅长'],['稍安毋躁','少安毋躁'],['试目以待','拭目以待'],['书藉','书籍'],['松驰','松弛'],['坦城','坦诚'],['通谍','通牒'],['通辑','通缉'],['推委','推诿'],['污晦','污秽'],['洗炼','洗练'],['喜戏','嬉戏'],['陷井','陷阱'],['亵黩','亵渎'],['泻露','泄露'],['心恢意冷','心灰意冷'],['宣染','渲染'],['循私','徇私'],['沿续','延续'],['影牒','影碟'],['引伸','引申'],['隐敝','隐蔽'],['涌跃','踊跃'],['原故','缘故'],['震憾','震撼'],['装祯','装帧'],['自曝自弃','自暴自弃'],['再接再励','再接再厉'],['消毁','销毁'],['蜇伏','蛰伏'],['沓无音信','杳无音信'],['入场卷','入场券'],['天翻地复','天翻地覆']];

  function splitSentences(t){
    var res=[], buf='';
    for(var i=0;i<t.length;i++){ var ch=t[i]; buf+=ch; if('。！？!?；;'.indexOf(ch)>=0){ res.push(buf.trim()); buf=''; } }
    if(buf.trim()) res.push(buf.trim());
    return res.filter(Boolean);
  }
  function tDefiller(t){ var s=t; FILLERS.forEach(function(f){ s=s.split(f).join(''); }); s=s.replace(/，{2,}/g,'，').replace(/。{2,}/g,'。').replace(/\s{2,}/g,' ').trim(); return s; }
  function swapSyn(t){ var s=t; SYN.forEach(function(p){ s=s.split(p[0]).join(p[1]); }); return s; }
  function tSimplify(t){
    var s=tDefiller(t); s=s.replace(/[，,]\s*(其实|不过|但是|然而|总之|另外|而且|并且)[，,]/g,'，');
    return splitSentences(s).map(function(x){ return x.length>50 ? (x.indexOf('，')>0&&x.indexOf('，')<50 ? x.slice(0,x.indexOf('，')+1) : x.slice(0,50)) : x; }).join('');
  }
  function tExpand(t){
    var sents=splitSentences(tDefiller(t));
    var pad=['具体而言，这一点往往体现在细节之中。','从实际使用来看，它能带来更顺手的体验。','综合以上，整体价值值得被看见。','对目标人群来说，这样的设计恰到好处。','长期而言，这也是一种更稳妥的选择。'];
    var out='';
    sents.forEach(function(s,i){ out+=s; if(i<pad.length){ if(!/[。！？!?]$/.test(s)) out+='。'; out+=pad[i]; } });
    return out;
  }
  function tPolish(t){ return swapSyn(tDefiller(t)); }
  function tTypo(t){ var s=t, changes=[]; TYPOS.forEach(function(p){ if(s.indexOf(p[0])>=0){ s=s.split(p[0]).join(p[1]); changes.push({from:p[0],to:p[1]}); } }); return {fixed:s,changes:changes}; }
  function tSmooth(t){
    var s=t;
    s=s.replace(/([！!])\1+/g,'！').replace(/([？?])\1+/g,'？').replace(/([。.])\1+/g,'。').replace(/，{2,}/g,'，').replace(/。，/g,'。').replace(/，。/g,'。');
    s=s.replace(/的的/g,'的').replace(/了了/g,'了');
    return splitSentences(s).map(function(x){ x=x.replace(/[，,、]$/,''); return x+(/[。！？!?]$/.test(x)?'':'。'); }).join('');
  }
  function tLogic(t){
    var sents=splitSentences(tDefiller(t));
    if(sents.length<2) return '## 逻辑梳理\n\n'+t+'\n\n> 文本较短，暂无需拆分逻辑层次。';
    var n=sents.length, a=Math.ceil(n/3), b=Math.ceil(2*n/3);
    return '## 逻辑梳理\n\n### 一、背景与现状\n'+sents.slice(0,a).join('')+'\n\n### 二、分析与过程\n'+sents.slice(a,b).join('')+'\n\n### 三、结论与建议\n'+sents.slice(b).join('')+'\n\n> 已按「背景 → 分析 → 结论」重排逻辑层次。';
  }
  function tSegment(t){
    var sents=splitSentences(tDefiller(t)), out='', buf=[], c=0;
    sents.forEach(function(s){ buf.push(s); c++; if(c>=2){ out+=buf.join('')+'\n\n'; buf=[]; c=0; } });
    if(buf.length) out+=buf.join('')+'\n\n';
    return out.trim();
  }
  function tStructure(t){
    var sents=splitSentences(tDefiller(t)), md='## 结构化提纲\n\n';
    sents.forEach(function(s,i){ md+=(i+1)+'. '+s+'\n'; });
    return md;
  }
  function tSummary(t){
    var sents=splitSentences(t);
    if(sents.length<=2) return '## 压缩摘要\n\n'+t;
    var stop=['的','了','是','在','我','你','他','她','它','们','这','那','有','和','与','及','也','都','就','而','等','一个','一种','我们','他们','这个','那个','因为','所以','但是','如果','可以','已经','通过','对于','关于','以及','进行','方面','目前','现在','一些','这些','那些'];
    var freq={};
    sents.forEach(function(s){ var w=s.replace(/[^\u4e00-\u9fa5]/g,''); for(var i=0;i<w.length;i++){ freq[w[i]]=(freq[w[i]]||0)+1; } });
    var scored=sents.map(function(s,i){ var w=s.replace(/[^\u4e00-\u9fa5]/g,''), sc=0; for(var i2=0;i2<w.length;i2++){ if(stop.indexOf(w[i2])<0) sc+=freq[w[i2]]||0; } return {s:s,i:i,score:sc/(w.length||1)}; });
    scored.sort(function(a,b){return b.score-a.score;});
    var top=scored.slice(0,Math.min(3,sents.length)).sort(function(a,b){return a.i-b.i;});
    return '## 压缩摘要（保留关键信息）\n\n'+top.map(function(x){return '• '+x.s;}).join('\n\n')+'\n\n> 原文共 '+sents.length+' 句，已提炼核心 '+top.length+' 句。';
  }

  /* ---------------- 表单构造助手 ---------------- */
  function fInp(id,label,ph){ return '<div class="field"><label>'+label+'</label><input type="text" id="'+id+'" placeholder="'+ph+'"></div>'; }
  function fTa(id,label,ph){ return '<div class="field"><label>'+label+'</label><textarea id="'+id+'" placeholder="'+ph+'"></textarea></div>'; }
  function fSel(id,label,opts){ return '<div class="field"><label>'+label+'</label><select id="'+id+'">'+opts.map(function(o){return '<option>'+o+'</option>';}).join('')+'</select></div>'; }
  function fInline(children){ return '<div class="inline">'+children+'</div>'; }
  function v(id){ var e=$(id); return e?e.value:''; }
  function vv(id,def){ var x=v(id); return (x&&x.trim())?x.trim():def; }

  /* ============================================================
   * ① AI 文案生成（扩展）
   * ============================================================ */
  var AI_COPY_TYPES=['宣传文案','海报文案','短视频文案','朋友圈文案','产品介绍','吊牌说明','店铺简介','个人简介','工作周报','工作总结','日记随笔','公众号推文','小红书笔记','淘宝详情页','招聘JD','活动邀请函'];
  var AI_STYLES=['正式','简约','高级','温柔','营销风','接地气','文艺风'];
  var AI_STYLE_TONE={
    '正式':{tag:['#专业','#信赖','#品质'],cta:'即刻咨询，开启品质之选。',open:function(n){return '【'+n+'】以专业实力，赢得每一份信赖。';}},
    '简约':{tag:['#简约','#实用','#优选'],cta:'了解更多，点击查看。',open:function(n){return '关于'+n+'，把复杂留给我们，把简单给你。';}},
    '高级':{tag:['#格调','#臻选','#非凡'],cta:'臻享此刻，即刻拥有。',open:function(n){return n+' · 格调非凡，只为懂得生活的人。';}},
    '温柔':{tag:['#暖心','#陪伴','#治愈'],cta:'愿它温柔你的每一天。',open:function(n){return '想和你说说'+n+'的温柔故事。';}},
    '营销风':{tag:['#爆款','#限时','#必入'],cta:'🔥 限时特惠，错过等一年！',open:function(n){return '别犹豫！'+n+'全网爆火，手慢无！';}},
    '接地气':{tag:['#实在','#划算','#靠谱'],cta:'咱家靠谱，闭眼入！',open:function(n){return '跟大伙儿唠唠'+n+'，实在好东西。';}},
    '文艺风':{tag:['#时光','#远方','#慢生活'],cta:'把日子过成诗。',open:function(n){return n+'，是藏在时光里的温柔。';}}
  };
  function genCopy(){
    var type=vv('ai-copy-type','宣传文案'), name=vv('ai-copy-input','（请填写产品/主题名）'), style=vv('ai-copy-style','简约');
    var t=AI_STYLE_TONE[style]||AI_STYLE_TONE['简约'];
    var head='# '+name+' · '+type, body='';
    switch(type){
      case '宣传文案':
        body='## 主标题\n'+t.open(name)+'\n\n## 核心卖点\n- 品质扎实：经得起日常使用的好物\n- 体验舒适：从细节处照顾你的感受\n- 高性价比：花得值，用得安心\n\n## 正文\n'+t.open(name)+'它不只是商品，更是一份贴心的生活提案。无论自用还是赠礼，都恰到好处。\n\n## 行动号召\n'+t.cta; break;
      case '海报文案':
        body='## 海报主标题\n'+t.open(name)+'\n\n## 副标题\n一眼心动，久久回味。\n\n## 卖点三点\n- ① 看得见的质感\n- ② 用得着的温度\n- ③ 买得值的安心\n\n## 角标文案\n'+t.tag.join(' ')+'\n\n## 行动按钮文案\n'+t.cta; break;
      case '短视频文案':
        body='## 开头钩子（前 3 秒）\n'+t.open(name)+'\n\n## 内容正文\n你有没有过这样的时刻——想要一点刚刚好的美好？'+name+'或许就是答案。\n\n## 结尾引导\n'+t.cta+' 评论区告诉我你的想法～'; break;
      case '朋友圈文案':
        body=t.open(name)+'\n\n日常里的小确幸，值得被记录。'+name+'，让今天比昨天更开心一点。\n\n'+t.tag.join(' '); break;
      case '产品介绍':
        body='## 产品名称\n'+name+'\n\n## 产品定位\n'+t.open(name)+'\n\n## 核心参数\n| 维度 | 说明 |\n|---|---|\n| 材质 | （请补充） |\n| 规格 | （请补充） |\n| 适用 | （请补充） |\n| 亮点 | （请补充） |\n\n## 使用场景\n- 日常自用\n- 馈赠亲友\n- 办公 / 展示\n\n## 为什么选它\n'+t.cta; break;
      case '吊牌说明':
        body='## '+name+' · 产品信息\n\n| 项目 | 内容 |\n|---|---|\n| 品名 | '+name+' |\n| 材质 | （请补充，如：头层牛皮 / 纯棉） |\n| 尺码 | （请补充） |\n| 产地 | （请补充） |\n| 洗护 | （请补充，如：冷水手洗 / 不可暴晒） |\n| 执行标准 | （请补充，如：GB/T XXXX） |\n| 安全类别 | （请补充，如：B 类） |\n\n> 以上信息请按实物吊牌核对，确保合规标注。'; break;
      case '店铺简介':
        body='## 欢迎来到 '+name+'\n\n'+t.open(name)+'\n\n我们专注做好每一件小事，把诚意放进产品里。从选品到服务，只为给你更安心的体验。\n\n## 本店主营\n- （请补充经营类目）\n- （请补充特色商品）\n\n## 服务承诺\n品质保障 · 用心售后 · 真诚待客'; break;
      case '个人简介':
        body='## 你好，我是与「'+name+'」同行的人\n\n'+t.open(name)+'\n\n热爱生活，也认真做事。希望通过'+name+'，把美好传递给更多人。\n\n## 我擅长\n- （请补充你的专长）\n- （请补充你的经历）\n\n> 期待与同频的你相遇。'; break;
      case '工作周报':
        body='## 本周工作周报（主题：'+name+'）\n\n### 一、本周完成\n1. 推进「'+name+'」相关核心事项，明确方向与节点\n2. 完成阶段性交付，质量符合预期\n3. 协同相关方对齐进度，排除阻塞\n\n### 二、数据与亮点\n- 关键产出：（请补充）\n- 亮点：（请补充）\n\n### 三、下周计划\n1. 围绕「'+name+'」继续深化\n2. （请补充）\n3. （请补充）\n\n### 四、风险与需支持\n- （请补充阻塞项与所需资源）'; break;
      case '工作总结':
        body='## 阶段工作总结（主线：'+name+'）\n\n### 一、工作回顾\n本阶段以「'+name+'」为主线，稳步推进各项任务，整体达成预期目标。\n\n### 二、核心成果\n- 成果1：（请补充）\n- 成果2：（请补充）\n- 成果3：（请补充）\n\n### 三、经验沉淀\n- 方法论：（请补充）\n- 可复用资产：（请补充）\n\n### 四、不足与改进\n- 待优化：（请补充）\n\n### 五、下阶段规划\n- （请补充）'; break;
      case '日记随笔':
        body='关于'+name+'的一些碎碎念。\n\n今天的风很轻，时间慢了下来。'+t.open(name)+'像是一个温柔的注脚，落在寻常日子的缝隙里。\n\n愿你也能在忙碌中，留一点空隙给自己的心。'; break;
      case '公众号推文':
        body='## 标题（3 选 1）\n1. '+t.open(name)+'\n2. 关于'+name+'，我想说几句掏心窝的话\n3. '+name+'：一个被低估的好物（附清单）\n\n## 开篇引入\n'+t.open(name)+'今天想认真聊聊它——不夸张、不套路，只说真实体验。\n\n## 正文结构\n- 痛点共鸣：你是不是也遇到过……\n- 真实体验：我用了之后的变化\n- 使用场景：什么人特别需要\n- 避坑提醒：购买 / 使用要注意\n\n## 结尾互动\n'+t.cta+' 你在用'+name+'时有什么心得？评论区聊聊～'; break;
      case '小红书笔记':
        body='## 标题（带情绪钩子）\n'+t.open(name)+'｜姐妹们冲！亲测好用不踩雷 💡\n\n## 正文\n📌 先说结论：'+name+'真的可以试试！\n\n✅ 我的使用感受：\n- 第一点：（请补充）\n- 第二点：（请补充）\n- 第三点：（请补充）\n\n💡 小贴士：（请补充）\n\n'+t.tag.join(' ')+' #好物分享 #亲测\n\n## 互动引导\n觉得有用记得点赞收藏 ❤️ 评论区交作业～'; break;
      case '淘宝详情页':
        body='## 宝贝标题（SEO 友好）\n'+name+' （核心词）+（属性词）+（场景词）+（人群词）\n\n## 五点描述\n- 【材质】：（请补充）\n- 【功能】：（请补充）\n- 【场景】：（请补充）\n- 【赠品/服务】：（请补充）\n- 【保障】：（请补充）\n\n## 详情页逻辑\n痛点 → 卖点 → 证明（图/评价） → 促销 → 逼单\n\n## 促销文案\n'+t.cta; break;
      case '招聘JD':
        body='## 招聘岗位：'+name+'\n\n## 岗位职责\n1. （请补充核心职责）\n2. （请补充）\n3. （请补充）\n\n## 任职要求\n- 学历 / 经验：（请补充）\n- 技能：（请补充）\n- 加分项：（请补充）\n\n## 我们提供\n- 薪资：（请补充）\n- 福利：（请补充）\n- 成长：（请补充）\n\n> 请以官方发布为准，投递前核验企业资质。'; break;
      case '活动邀请函':
        body='## 邀您参加 · '+name+'\n\n尊敬的宾客：\n\n诚邀您莅临「'+name+'」，与我们共度美好时光。\n\n## 活动信息\n- 时间：（请补充）\n- 地点：（请补充）\n- 形式：（请补充）\n\n## 报名方式\n（请补充报名链接 / 联系人）\n\n期待与您相见。'; break;
      default:
        body='## 正文\n'+t.open(name)+'\n\n## 行动号召\n'+t.cta;
    }
    return head+'\n\n'+body+'\n\n---\n*风格：'+style+' ｜ 由 TRAEWork AI 本地生成引擎产出，可商用，请按实际信息核对补充。*';
  }

  /* ============================================================
   * ② 社媒爆款文案
   * ============================================================ */
  function genSocial(){
    var plat=vv('ai-social-plat','小红书'), theme=vv('ai-social-theme','（如：黄黑皮口红 / 小个子穿搭）'), tone=vv('ai-social-tone','种草');
    var head='# '+theme+' · '+plat+'爆款文案（'+tone+'）', body='';
    if(plat==='小红书'){
      body='## 标题（带钩子）\n'+theme+'｜真的会爱住！亲测不踩雷 💡\n\n## 正文\n📌 一句话结论：'+theme+'，谁用谁知道！\n\n✅ 真实体验\n- 亮点1：（请补充）\n- 亮点2：（请补充）\n- 亮点3：（请补充）\n\n💡 适用人群：（请补充）\n\n#'+theme.replace(/\s/g,'')+' #好物分享 #亲测推荐 #日常分享\n\n## 引导\n觉得有用点赞收藏 ❤️ 评论区交作业～';
    } else if(plat==='抖音'){
      body='## 开头 3 秒钩子\n别划走！'+theme+'这件事，我后悔没早点知道。\n\n## 口播正文\n你有没有遇到过（痛点）？其实只要（方法），'+theme+'立马不一样。我亲测（结果）。\n\n## 字幕金句\n- “'+theme+'，真的香”\n- “早知道就好了”\n\n## 结尾引导\n点赞关注，下期教你（预告）。评论区扣 1 领资料～';
    } else if(plat==='朋友圈'){
      body=tone+'风 · '+theme+'\n\n日常里的小确幸，'+theme+'让今天更开心一点。\n\n#'+theme.replace(/\s/g,'')+' #生活记录';
    } else if(plat==='微博'){
      body='#'+theme.replace(/\s/g,'')+'# '+theme+'，你怎么看？\n\n（观点 / 吐槽 / 安利均可）：（请补充）\n\n转发抽 3 位送（奖品），周五开奖～';
    } else {
      body='## 标题\n'+theme+'：一篇说清楚\n\n## 开头\n今天聊'+theme+'，不绕弯子，直接上干货。\n\n## 干货结构\n1. 是什么\n2. 为什么重要\n3. 怎么做（步骤）\n4. 常见误区\n\n## 结尾\n收藏起来慢慢看，关注看更多'+theme+'内容。';
    }
    return head+'\n\n'+body+'\n\n> 文案为本地生成模板，发布前请按平台规则与真实体验补充。';
  }

  /* ============================================================
   * ③ 营销方案
   * ============================================================ */
  function genMarketing(){
    var prod=vv('ai-mk-prod','（如：618 美妆大促）'), aud=vv('ai-mk-aud','（如：18-30 岁学生党/白领）'), ch=vv('ai-mk-ch','（如：小红书+抖音+私域，预算 5 万）');
    return '# '+prod+' · 整合营销方案\n\n'+
      '## 一、目标与背景\n- 核心目标：曝光 / 拉新 / 转化 / 复购（请勾选）\n- 背景：'+prod+'所处的市场阶段与机会点\n\n'+
      '## 二、人群洞察\n- 目标人群：'+aud+'\n- 痛点：______ ｜ 爽点：______ ｜ 决策动因：______\n\n'+
      '## 三、核心策略（One Message）\n- 主张：（一句话说清为什么选我们）\n- 记忆点：（视觉 / 梗 / slogan）\n\n'+
      '## 四、内容矩阵\n| 平台 | 内容形式 | 角色 |\n|---|---|---|\n| 小红书 | 种草笔记 | 信任建设 |\n| 抖音 | 短视频/直播 | 爆发曝光 |\n| 私域 | 社群/朋友圈 | 转化复购 |\n| 公众号 | 深度长文 | 心智沉淀 |\n\n'+
      '## 五、传播节奏\n- 预热期（T-7~T-1）：悬念 / 预约\n- 爆发期（T0~T3）：集中投放 + 直播\n- 长尾期（T4~T14）：UGC / 复盘\n\n'+
      '## 六、转化路径\n曝光 → 点击 → 留资/加购 → 下单 → 分享裂变\n\n'+
      '## 七、资源与 ROI\n- 渠道与预算：'+ch+'\n- 预期 ROI / CAC：（请补充）\n\n'+
      '## 八、风险预案\n- 舆情 / 库存 / 投流失效 → 备选方案\n\n> 本方案为结构化框架，请按实际业务数据填充。';
  }

  /* ============================================================
   * ④ 邮件 / 沟通
   * ============================================================ */
  function genEmail(){
    var role=vv('ai-em-role','客户'), purpose=vv('ai-em-purpose','（如：跟进合同进度，确认下周签署）'), pts=vv('ai-em-pts','（如：1.条款已确认 2.需补材料 3.时间节点）');
    var ptsArr=pts.split(/[；;\n]/).map(function(s){return s.trim();}).filter(Boolean);
    var list=ptsArr.length?ptsArr.map(function(p,i){return (i+1)+'. '+p;}).join('\n'):'1. （请补充要点）';
    return '# 邮件草稿 · 致'+role+'\n\n'+
      '## 主题行（3 选 1）\n1. 【'+purpose.slice(0,12)+(purpose.length>12?'…':'')+'】'+role+'您好，烦请确认\n2. 关于'+purpose.slice(0,10)+(purpose.length>10?'…':'')+' —— 后续安排沟通\n3. 温馨提醒：'+purpose.slice(0,10)+(purpose.length>10?'…':'')+'\n\n'+
      '## 正文\n尊敬的'+role+'：\n\n您好！感谢您的关注与配合。就「'+purpose+'」一事，与您同步如下：\n\n'+list+'\n\n如无异议，我们将按上述安排推进；如有调整，随时与我联系。\n\n顺祝商祺！\n[您的姓名 / 团队]\n\n'+
      '## 备选标题\n- 简洁版：'+purpose.slice(0,16)+(purpose.length>16?'…':'')+'\n- 行动版：请确认：'+purpose.slice(0,12)+(purpose.length>12?'…':'');
  }

  /* ============================================================
   * ⑤ 简历优化
   * ============================================================ */
  function genResume(){
    var role=vv('ai-rs-role','（如：电商运营专员）'), exp=vv('ai-rs-exp','（如：负责店铺日常运营，GMV 提升 30%；带 3 人小组）');
    var expArr=exp.split(/[；;\n]/).map(function(s){return s.trim();}).filter(Boolean);
    var star=expArr.length?expArr.map(function(e,i){return '### 经历'+(i+1)+'\n- 情境(S)：______\n- 任务(T)：'+e+'\n- 行动(A)：______（你具体做了什么）\n- 结果(R)：______（量化：%，金额，时长）';}).join('\n\n'):'### 经历1\n- 情境(S)：______\n- 任务(T)：______\n- 行动(A)：______\n- 结果(R)：______（尽量量化）';
    return '# '+role+' · 简历优化方案\n\n'+
      '## 个人总结（3 行版）\n- 我是______（定位），擅长______。\n- 过往达成______（最亮眼成果）。\n- 期望在______方向继续深耕。\n\n'+
      '## 工作经历（STAR 改写）\n'+star+'\n\n'+
      '## 技能标签\n`'+role+'` `数据分析` `项目管理` `（补充你的硬技能）`\n\n'+
      '## 简历自检清单\n- [ ] 动词开头、量化结果\n- [ ] 一页为佳、重点前置\n- [ ] 无错别字、格式统一\n- [ ] 与岗位 JD 关键词对齐\n- [ ] 联系方式 & 作品集链接有效\n\n> 简历优化建议基于通用方法论，按目标岗位微调关键词。';
  }

  /* ============================================================
   * ⑥ 故事 / 小说
   * ============================================================ */
  function genStory(){
    var genre=vv('ai-st-genre','都市'), theme=vv('ai-st-theme','（如：失忆画家找回自我）'), hero=vv('ai-st-hero','（如：27 岁女插画师林晚）');
    return '# 《'+theme+'》· '+genre+'创作提纲\n\n'+
      '## 一句话梗概\n'+hero+'在'+theme+'的旅途中，完成了自我的救赎与成长。\n\n'+
      '## 三幕结构\n- 第一幕（建置）：'+hero+'的常态被打破，埋下'+theme+'的引子\n- 第二幕（对抗）：遭遇阻力与升级，关系与能力被考验\n- 第三幕（结局）：和解 / 反转 / 升华，留下余韵\n\n'+
      '## 人物小传\n- 姓名：'+hero+'\n- 外在目标：______ ｜ 内在需求：______\n- 性格弧光：从______到______\n- 对手 / 阻力：______\n\n'+
      '## 开篇段落（试写）\n'+hero+'从未想过，'+theme+'会以这样一种方式闯进生活。那天……（请续写）\n\n'+
      '## 章节大纲\n1. 开端：日常的裂缝\n2. 发展：被迫出发\n3. 转折：真相浮现\n4. 高潮：关键抉择\n5. 尾声：新的平衡\n\n> 结构模板可直接套用，按你的风格填充细节。';
  }

  /* ============================================================
   * ⑦ 短视频脚本
   * ============================================================ */
  function genVideo(){
    var plat=vv('ai-vd-plat','抖音'), topic=vv('ai-vd-topic','（如：3 分钟搞定周末快手菜）'), dur=vv('ai-vd-dur','30s');
    return '# '+topic+' · '+plat+'短视频脚本（'+dur+'）\n\n'+
      '## 开头钩子（前 3 秒）\n别划走！'+topic+'，新手也能一次成功。\n\n'+
      '## 分镜脚本\n| 时间 | 画面 | 台词/字幕 | 音效/BGM |\n|---|---|---|---|\n| 0-3s | 成品特写+标题 | “'+topic+'，真的简单” | 抓耳前奏 |\n| 3-'+dur.replace('s','')+'s | 步骤快剪 | 旁白讲解要点 | 轻快 BGM |\n| 结尾 | 成品+引导 | “点赞收藏，下期见” | 收尾音 |\n\n'+
      '## 结尾引导\n点赞 + 关注，评论区扣 1 领完整清单～\n\n> 脚本为结构模板，按实际素材调整节奏与字幕。';
  }

  /* ============================================================
   * ⑧ 文本处理（12 模式）
   * ============================================================ */
  var AI_TEXT_MODES=['全文精简','智能扩写','润色去糙','去口水话','高级改写','错别字校对','语句通顺优化','逻辑梳理','文章分段','结构化整理','长文压缩摘要'];
  function genText(){
    var mode=vv('ai-text-mode','全文精简'), text=v('ai-text-input');
    if(!text||!text.trim()) return '*（请粘贴待处理文本）*';
    var out='';
    switch(mode){
      case '全文精简': out='## 精简结果\n\n'+tSimplify(text)+'\n\n> 已去除冗余口语、压缩表达，保留核心信息。'; break;
      case '智能扩写': out='## 扩写结果\n\n'+tExpand(text); break;
      case '润色去糙': out='## 润色结果\n\n'+tPolish(text)+'\n\n> 已替换口语词、优化表达，更通顺专业。'; break;
      case '去口水话': out='## 去口水话结果\n\n'+tDefiller(text)+'\n\n> 已移除口头禅与填充词。'; break;
      case '高级改写': out='## 改写结果\n\n'+swapSyn(tDefiller(text))+'\n\n> 同义替换 + 句式调整，保持原意。'; break;
      case '错别字校对': { var r=tTypo(text); out='## 错别字校对\n\n'+r.fixed+'\n\n'+(r.changes.length?('### 修正记录\n'+r.changes.map(function(c){return '- '+c.from+' → '+c.to;}).join('\n')):'> 未发现明显错别字。'); } break;
      case '语句通顺优化': out='## 通顺优化\n\n'+tSmooth(text); break;
      case '逻辑梳理': out=tLogic(text); break;
      case '文章分段': out='## 分段结果\n\n'+tSegment(text); break;
      case '结构化整理': out=tStructure(text); break;
      case '长文压缩摘要': out=tSummary(text); break;
    }
    return out;
  }

  /* ============================================================
   * ⑨ 多语翻译（英/日/韩 术语库）
   * ============================================================ */
  var AI_LANGS=['英语 English','日语 日本語','韩语 한국어','中文（规范/回译）'];
  function genTranslate(){
    var lang=vv('ai-tr-lang','英语 English'), text=v('ai-tr-input');
    if(!text||!text.trim()) return '*（请粘贴待翻译文本）*';
    var map={'英语 English':'en','日语 日本語':'ja','韩语 한국어':'ko','中文（规范/回译）':'zh'};
    var tg=map[lang]||'en';
    var note = tg==='zh' ? '> 已做规范/回译整理（统一标点、术语、语序）。' : '> 基于印刷 / 设计 / 房产 / 办公术语库翻译；法/德/西等更多语种建议用文心一言 / DeepL（见上方平台直达）。';
    return '## 翻译结果（'+lang+'）\n\n'+translate(text,tg)+'\n\n'+note;
  }

  /* ============================================================
   * ⑩ 绘画 / 图像提示词
   * ============================================================ */
  var PROMPT_STYLES={
    '写实':{base:'photorealistic, ultra-detailed, 8k resolution, realistic texture, natural lighting',neg:'cartoon, illustration, low quality, blurry, deformed'},
    '高清产品图':{base:'product photography, clean studio background, soft diffused lighting, high-key, commercial product shot, 8k, sharp focus',neg:'cartoon, illustration, messy background, low quality'},
    '海报风':{base:'poster design, bold composition, vibrant color blocking, cinematic lighting, graphic, professional advertising visual',neg:'blurry, low contrast, messy, watermark'},
    '田园风':{base:'pastoral style, rustic, warm sunlight, natural scenery, soft film grain, cozy countryside atmosphere',neg:'urban, cyberpunk, dark, sharp neon'},
    'ins风':{base:'instagram aesthetic, soft pastel tones, minimalist, bright airy, clean composition, trendy',neg:'dark, cluttered, heavy, low saturation'},
    '工业风':{base:'industrial style, raw concrete, metal texture, moody lighting, brutalist, high contrast monochrome',neg:'pastel, cute, soft, decorative'},
    '简约商业风':{base:'minimalist commercial, clean negative space, elegant, flat lay, premium brand visual, soft shadow',neg:'busy, cluttered, noisy, low quality'},
    '动漫风':{base:'anime style, cel shading, vibrant, detailed line art, Japanese animation aesthetic, soft glow',neg:'photorealistic, 3d render, low quality, blurry'}
  };
  var LIGHT_NOTE={'工业风':'硬光高对比','田园风':'暖调自然光','ins风':'明亮柔光','写实':'自然柔光','高清产品图':'影棚柔光','海报风':'戏剧光','简约商业风':'柔和单光','动漫风':'赛璐珞补光'};
  var EN_LIGHT={'工业风':'hard high-contrast lighting','田园风':'warm natural sunlight','ins风':'bright soft lighting','写实':'natural soft lighting','高清产品图':'studio soft lighting','海报风':'cinematic lighting','简约商业风':'soft single-source lighting','动漫风':'cel-shading lighting'};
  function genPrompt(){
    var style=vv('ai-prompt-style','写实'), subject=vv('ai-prompt-input','（请描述主体，如：一双白色运动鞋）'), scene=vv('ai-prompt-scene','通用');
    var st=PROMPT_STYLES[style]||PROMPT_STYLES['写实'];
    var sceneMap={'鞋业产品图':'suitable for footwear product display, highlight material and stitching detail','房产封面':'real estate cover, spacious bright interior','广告海报':'advertising poster with eye-catching focal point','头像':'centered portrait, pleasing composition','壁纸':'balanced full-frame wallpaper composition','设计参考图':'design reference showing clear structure and texture'};
    var sc=sceneMap[scene]?sceneMap[scene]:'';
    var light=LIGHT_NOTE[style]||'自然光', enLight=EN_LIGHT[style]||'natural lighting';
    var cnFull=subject+'，'+style+'风格，'+light+'，主体突出，构图舒适，材质细腻'+(sc?('，'+scene):'')+'。8K 高清，细节丰富。';
    var enFull=translate(subject,'en')+', '+st.base+', '+enLight+', subject prominent, comfortable composition, fine material texture'+(sc?', '+sc:'')+'. 8k, highly detailed.';
    return '# AI 绘画提示词 · '+style+'\n\n'+
      '## 风格设定\n- 风格：'+style+'\n- 主体：'+subject+'\n- 光影：'+light+'\n- 适配场景：'+scene+'\n\n'+
      '## 中文提示词（即梦 / 可灵 / 通义万相）\n```\n'+cnFull+'\n参数建议：--ar 4:3 --style raw --v 6.0\n```\n\n'+
      '## English Prompt（Midjourney / Stable Diffusion）\n```\n'+enFull+'\nNegative prompt: '+st.neg+'\n```\n\n'+
      '## 出图建议\n- 推荐比例：产品 / 头像用 1:1，海报 / 封面用 4:3 或 16:9\n- 不满意就微调「风格」与「主体描述」重新生成\n- 商用前确认素材版权与平台规则';
  }

  /* ============================================================
   * ⑪ 起名 / 命名
   * ============================================================ */
  var BW_FRONT=['初','拾','暖','简','素','野','白','木','云','光','拾光','原来','小','一','半','知','栖','沐','禾','言','见','予','漫','南','北','山','海','溪','糖','盐','麦','栗','棠'];
  var BW_MID=['物','集','所','家','屋','间','社','铺','研','作','造','坊','盒','仓','谷','田','角','里','方','场'];
  var BW_TAIL=['生活','杂货','工坊','研究所','小铺','工作室','实验室','制造局','便利店','书房','食堂','花房','杂院','集市','博物馆','计划','社','所','铺','屋','园'];
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function genNaming(){
    var type=vv('ai-nm-type','品牌名'), ind=vv('ai-nm-ind','（如：咖啡 / 女鞋 / 文创）'), style=vv('ai-nm-style','文艺');
    var names=[], used={};
    while(names.length<12){
      var a=pick(BW_FRONT), b=pick(BW_MID), c=pick(BW_TAIL), mode=names.length%3, nm;
      nm = mode===0 ? a+b+c : mode===1 ? a+b : a+c;
      if(!used[nm]){ used[nm]=1; names.push(nm); }
    }
    return '# '+type+' 候选 · '+ind+'（'+style+'调性）\n\n'+
      '## 候选名称\n'+names.map(function(n,i){return (i+1)+'. '+n;}).join('\n')+'\n\n'+
      '## 命名逻辑\n- 前缀定调性（'+style+'），中缀定品类，后缀定场景\n- 建议组合：行业词 + 记忆点，便于注册与传播\n\n'+
      '## 落地提示\n- [ ] 商标近似查询（中国商标网）\n- [ ] 域名 / 社交账号可用性\n- [ ] 读音是否顺口、有无歧义\n- [ ] 是否易记、易写、易传播\n\n> 名称由本地引擎生成，注册前务必查重。';
  }

  /* ============================================================
   * ⑫ 大纲 / 思维导图
   * ============================================================ */
  var AI_OUTLINE_TYPES=['工作大纲','学习大纲','方案大纲','策划大纲','文章结构','运营框架'];
  var OUTLINE_MAP={
    '工作大纲':['目标与背景','核心任务拆解','责任分工与排期','关键节点与里程碑','风险预案','复盘机制'],
    '学习大纲':['学习目标','知识体系地图','阶段划分','重点与难点','练习与反馈','成果检验'],
    '方案大纲':['项目背景与痛点','目标与预期','整体思路','实施步骤','资源配置','效果评估'],
    '策划大纲':['活动背景与目的','目标人群','创意主题','流程设计','传播节奏','预算与 ROI'],
    '文章结构':['标题与立意','开篇引入','核心论点','论据支撑','转折升华','结尾行动号召'],
    '运营框架':['定位与人设','内容矩阵','增长路径','转化漏斗','数据指标','迭代优化']
  };
  function genOutline(){
    var type=vv('ai-ol-type','工作大纲'), theme=vv('ai-ol-theme','（请填写主题）');
    var secs=OUTLINE_MAP[type]||OUTLINE_MAP['工作大纲'];
    var md='# '+theme+' · '+type+'\n\n';
    secs.forEach(function(s,i){ md+='## '+(i+1)+'. '+s+'\n- 要点1：（请补充）\n- 要点2：（请补充）\n- 要点3：（请补充）\n\n'; });
    md+='---\n*由 TRAEWork AI 本地生成引擎产出，按实际项目补充要点即可直接落地。*';
    return md;
  }

  /* ============================================================
   * ⑬ PPT 大纲
   * ============================================================ */
  function genPpt(){
    var theme=vv('ai-pp-theme','（如：社区咖啡馆开业运营方案）'), aud=vv('ai-pp-aud','（如：内部评审 / 投资人对接）'), pages=vv('ai-pp-pages','10');
    var n=parseInt(pages,10)||10; if(n>14)n=14; if(n<5)n=5;
    var md='# 《'+theme+'》PPT 大纲（'+n+' 页 · 面向'+aud+'）\n\n';
    md+='## 封面\n- 主标题：'+theme+'\n- 副标题 / 汇报人 / 日期\n\n';
    md+='## 目录（2-3 页）\n1. 背景与机会\n2. 方案与路径\n3. 预期与计划\n\n';
    var bodyN=n-3;
    for(var i=1;i<=bodyN;i++){
      md+='## 第 '+(i+2)+' 页\n- 标题：（本页核心一句话）\n- 要点：① ② ③\n- 视觉：图 / 表 / 关键数字\n\n';
    }
    md+='## 结尾页\n- 总结主张\n- 下一步 / 行动号召 / 联系方式\n\n> 按页填充即可快速成稿，建议每页「一图一说」。';
    return md;
  }

  /* ============================================================
   * ⑭ 学习 / 知识卡片
   * ============================================================ */
  function genStudy(){
    var topic=vv('ai-sd-topic','（如：复利效应 / 光合作用）'), fmt=vv('ai-sd-fmt','费曼笔记');
    var head='# '+topic+' · '+fmt, body='';
    if(fmt==='费曼笔记'){
      body='## 一句话讲给小白听\n'+topic+'，其实就是______（用生活类比）。\n\n## 核心概念\n- 是什么：______\n- 为什么重要：______\n- 关键要素：______\n\n## 举个例子\n（用具体场景说明）：（请补充）\n\n## 易错点\n- （请补充常见误解）';
    } else if(fmt==='思维导图'){
      body='## 中心：'+topic+'\n- 分支一：（维度A）\n  - 子点1\n  - 子点2\n- 分支二：（维度B）\n  - 子点1\n  - 子点2\n- 分支三：（维度C）\n  - 子点1';
    } else if(fmt==='闪卡'){
      body='## 正面 / 背面 卡片（自测用）\n| 正面（问题） | 背面（答案） |\n|---|---|\n| '+topic+' 是什么？ | （请补充定义） |\n| 为什么重要？ | （请补充） |\n| 一个例子？ | （请补充） |';
    } else if(fmt==='速记清单'){
      body='## '+topic+' 速记 5 条\n1. （关键点）\n2. （关键点）\n3. （关键点）\n4. （关键点）\n5. （关键点）';
    } else {
      body='## '+topic+' 备考计划\n- 第1周：打基础（概念+例题）\n- 第2周：刷真题（错题本）\n- 第3周：查漏补缺（专题突破）\n- 第4周：模拟冲刺（限时训练）\n\n## 自测题\n1. （请补充）\n2. （请补充）';
    }
    return head+'\n\n'+body+'\n\n> 学习卡片模板，按学科填充即可用于复习 / 教学。';
  }

  /* ============================================================
   * ⑮ 数据报告
   * ============================================================ */
  function genData(){
    var topic=vv('ai-dt-topic','（如：Q2 电商 GMV 复盘）'), metrics=vv('ai-dt-metrics','（如：GMV、转化率、客单价、退货率）');
    var mArr=metrics.split(/[，,、；;\s]+/).map(function(s){return s.trim();}).filter(Boolean);
    var mlist=mArr.length?mArr:['指标A','指标B','指标C'];
    return '# '+topic+' · 数据分析报告\n\n'+
      '## 一、摘要（Executive Summary）\n- 核心结论：（一句话）\n- 关键数字：（请补充）\n\n'+
      '## 二、背景与目标\n- 分析目的：______\n- 数据范围：时间 / 渠道 / 样本\n\n'+
      '## 三、指标总览\n| 指标 | 本期 | 环比 | 目标 | 达成 |\n|---|---|---|---|---|\n'+mlist.map(function(m){return '| '+m+' | （值） | （±%） | （值） | （✅/⚠️） |';}).join('\n')+'\n\n'+
      '## 四、图表建议\n- 趋势：折线图（'+mlist[0]+' 随时间）\n- 结构：饼/柱图（占比）\n- 关系：散点（相关性）\n\n'+
      '## 五、洞察与结论\n- 发现1：（数据说了什么）\n- 发现2：（异常/机会）\n\n'+
      '## 六、下一步行动\n- [ ] （策略调整）\n- [ ] （实验 / AB 测试）\n- [ ] （复盘机制）\n\n> 报告结构模板，填入真实数据即可输出。';
  }

  /* ============================================================
   * ⑯ 问答速查（扩展知识库）
   * ============================================================ */
  var AI_QA=[
    {k:['cmyk','四色','印刷','色差','潘通','打样','油墨','色卡'],a:'### 印刷配色常识\n- **CMYK** 是印刷四色（青 / 品红 / 黄 / 黑），屏幕显示的 RGB 无法直接印刷，需转换为 CMYK。\n- **色差** 主要来源：屏幕与印刷介质不同、网点增大、材质吸墨差异。\n- **降色差做法**：以实物打样为准、控制总墨量≤300%、浅色加深 3~5%、PVC 加深 5~8%。\n- **潘通 (Pantone)** 为专色标准，大货务必对色卡核对。'},
    {k:['户型','房贷','公积金','二手房','限购','契税','满五唯一','贷款','买房'],a:'### 房产交易常识\n- **满五唯一**：房产证满 5 年且家庭唯一住房，可免征个税。\n- **契税**：首套 90㎡以下 1%，90㎡以上 1.5%；二套多按 1%~3%（以当地为准）。\n- **公积金**：利率低于商贷，需连续缴存满一定月数方可使用。\n- **购房前**：核查限购 / 限贷资格、房本抵押查封、户口迁出、实地看房。'},
    {k:['pdf','word','excel','表格','排版','快捷键','电脑','卡顿','蓝屏','格式化','文件','win','office'],a:'### 办公 / 电脑技巧\n- **排版**：正文用样式而非手动格式，图片嵌入型改为四周型更稳。\n- **Excel**：`Ctrl+;` 输日期、`Alt+=` 快速求和、`F4` 重复上一步。\n- **卡顿**：清理启动项、磁盘清理、加内存 / 换 SSD 见效最快。\n- **文件丢失**：先看回收站，再用历史版本 / 备份恢复，勿覆盖原盘。'},
    {k:['配色','色彩','对比','和谐','色轮','颜色'],a:'### 配色设计常识\n- **同色系**：深浅变化，最安全高级。\n- **互补色**（色轮对角）：强对比、吸睛。\n- **邻近色**：协调过渡，舒服耐看。\n- **三角 / 四角**：活泼均衡，适合多色品牌。\n- 商用务必附 CMYK 并实物打样。'},
    {k:['文案','标题','转化','营销','slogan','广告','爆款','种草'],a:'### 文案 / 营销常识\n- **标题公式**：人群 + 痛点 + 利益点，前 3 秒抓住注意。\n- **转化**：明确行动号召（CTA），降低决策门槛。\n- **风格**：正式 / 简约 / 高级 / 温柔 / 营销 / 接地气 / 文艺，按受众切换。\n- **种草逻辑**：痛点共鸣 → 真实体验 → 使用场景 → 避坑 → 互动。'},
    {k:['简历','面试','招聘','跳槽','薪酬','jd'],a:'### 求职常识\n- **简历**：动词开头、量化结果、与 JD 关键词对齐，一页为佳。\n- **面试**：用 STAR（情境-任务-行动-结果）讲经历，准备 3 个高光故事。\n- **谈薪**：先了解市场区间，给出期望并留谈判空间。\n- **离职**：做好工作交接，维护职业口碑。'},
    {k:['ai','大模型','提示词','prompt','gpt','豆包','kimi','文心','通义','deepseek','人工智能'],a:'### AI / 大模型常识\n- **提示词公式**：角色 + 任务 + 背景 + 约束 + 输出格式，越具体越好。\n- **选平台**：长文档用 Kimi、推理用 DeepSeek、多模态用豆包 / 通义、绘画用即梦 / 万相。\n- **降幻觉**：要求给出依据、分步思考、让它自我校验。\n- **商用**：注意版权与数据合规，敏感数据勿上传公网模型。'},
    {k:['短视频','脚本','直播','运营','涨粉','小红书','抖音'],a:'### 短视频 / 内容运营常识\n- **黄金 3 秒**：开头必须抛钩子（冲突 / 悬念 / 利益）。\n- **完播率**：节奏快、信息密度高、结尾引导互动。\n- **选题**：70% 爆款模仿 + 30% 原创人设。\n- **变现**：广告 / 带货 / 私域 / 知识付费，先想清楚路径。'}
  ];
  function genQA(){
    var q=vv('ai-qa-input','');
    if(!q) return '请在上方输入你的问题（设计印刷 / 房产 / 办公电脑 / 配色 / 文案 / 求职 / AI / 运营 等）。';
    var hit=null;
    for(var i=0;i<AI_QA.length;i++){ if(AI_QA[i].k.some(function(k){return q.toLowerCase().indexOf(k)>=0;})){ hit=AI_QA[i]; break; } }
    if(hit) return '# 问答结果\n\n'+hit.a+'\n\n> 本地知识库命中。如需更精准，可点击上方平台直达大模型实时问答。';
    return '# 问答结果\n\n未能在本地知识库直接命中「'+q+'」。建议从以下角度检索：\n\n- **明确关键词**：把问题拆成「对象 + 动作 + 场景」。\n- **权威渠道**：印刷查潘通 / 厂商规范，房产查当地住建与税务官网，办公查官方帮助文档，AI 查各平台文档。\n- **下一步**：补充更具体的背景（行业 / 场景 / 目标），我能给出更结构化的建议。\n\n> 本模块为离线知识库，深度开放问答可点击「AI 平台实时直达」。';
  }

  /* ============================================================
   * ⑰ 创意脑暴
   * ============================================================ */
  var BRAIN_TYPES=['取名','店名','产品名','海报主题','活动主题','文案创意','配色创意','拍摄创意'];
  function genBrain(){
    var type=vv('ai-br-type','文案创意'), theme=vv('ai-br-theme','（请填写方向 / 行业，如：咖啡 / 女鞋 / 文创）');
    var md='# '+type+' 创意脑暴 · '+theme+'\n\n';
    if(type==='取名'||type==='店名'||type==='产品名'){
      var names=[], used={};
      while(names.length<12){
        var a=pick(BW_FRONT), b=pick(BW_MID), c=pick(BW_TAIL), mode=names.length%3, nm;
        nm = mode===0 ? a+b+c : mode===1 ? a+b : a+c;
        if(!used[nm]){ used[nm]=1; names.push(nm); }
      }
      md+='## '+(type==='店名'?'候选店名':type==='产品名'?'候选产品名':'候选名称')+'\n'+names.map(function(n,i){return (i+1)+'. '+n;}).join('\n')+'\n\n> 适配方向：'+theme+'。可结合品牌调性二次筛选。';
    } else if(type==='配色创意'){
      var pal=[['奶油米杏','#F2EDE3','#E4D9C3','#C9B79C','#7C8A5A'],['雾感橄榄','#DDE3D2','#C2CBB0','#8C9A6E','#4F5A3A'],['暖陶土','#F3E2D6','#E2B79E','#C98A6E','#8A4B38'],['静谧蓝灰','#E6ECEF','#BFCCD4','#8AA0AD','#46586A'],['丰收麦田','#F6ECC9','#E6C879','#C99A3E','#7A5A22'],['暮山紫','#EDE4EC','#CDB6CF','#9C7BA0','#5E4566']];
      md+='## 推荐配色方案（含 HEX，商用请转 CMYK 并打样）\n';
      pal.forEach(function(p,i){ md+='\n### 方案 '+(i+1)+'：'+p[0]+'\n'+p.slice(1).map(function(h){return '- `'+h+'`';}).join('\n')+'\n'; });
      md+='\n> 适配方向：'+theme+'。建议主色占比 60%、辅助 30%、点缀 10%。';
    } else if(type==='拍摄创意'){
      var shots=['全景交代环境，奠定场景氛围','中景展示主体与搭配关系','特写材质 / 细节纹理','45° 俯拍平铺（flat lay）','逆光剪影营造情绪','人物使用场景代入','微距捕捉光影层次','动态瞬间抓拍','对称构图高级感','前景虚化突出主体'];
      md+='## 推荐拍摄镜头（'+theme+'）\n'+shots.map(function(s,i){return (i+1)+'. '+s;}).join('\n')+'\n\n> 建议统一色调与光比，成片更成系列。';
    } else {
      var pre=['治愈系','松弛感','高级感','复古','国风','极简','多巴胺','清爽','烟火气','未来感','慢生活','仪式感'];
      var core=['「'+theme+'」× 城市漫游','「'+theme+'」的一天','把'+theme+'过成诗','遇见'+theme+'的 100 种方式',theme+'研究所',theme+'的理想国','关于'+theme+'的温柔实验',theme+'生活提案',theme+'奇妙物语',theme+'限定企划'];
      var ideas=[]; for(var i=0;i<10;i++){ ideas.push(pre[i%pre.length]+' · '+core[i%core.length]); }
      var tm={'海报主题':'候选海报主题','活动主题':'候选活动主题','文案创意':'候选文案创意角度'};
      md+='## '+(tm[type]||'候选创意')+'\n'+ideas.map(function(s,i){return (i+1)+'. '+s;}).join('\n')+'\n\n> 可任选其一延展为正文 / 主视觉。';
    }
    md+='\n\n---\n*由 TRAEWork AI 本地生成引擎产出，多方案备选，可直接使用或二次创作。*';
    return md;
  }

  /* ============================================================
   * ⑱ 代码助手（离线骨架 + 方案）
   * ============================================================ */
  var CODE_LANGS=['Python','JavaScript','Java','SQL','HTML+CSS','Go','C++'];
  function codeSkeleton(lang,task){
    switch(lang){
      case 'Python': return 'def solve('+'(/* 输入参数 */)'+'):\n    # TODO: '+task+'\n    # 步骤1：\n    # 步骤2：\n    result = None\n    return result\n\nif __name__ == \'__main__\':\n    print(solve())';
      case 'JavaScript': return 'function solve('+'(/* 输入参数 */)'+') {\n  // TODO: '+task+'\n  // 步骤1：\n  // 步骤2：\n  const result = null;\n  return result;\n}\n\n// 调用与测试\nconsole.log(solve());';
      case 'Java': return 'public class Solution {\n    public static void main(String[] args) {\n        // TODO: '+task+'\n        // 步骤1：\n        // 步骤2：\n    }\n}';
      case 'SQL': return '-- TODO: '+task+'\nSELECT col1, col2\nFROM table_name\nWHERE condition = true\nGROUP BY col1\nORDER BY col2 DESC\nLIMIT 100;';
      case 'HTML+CSS': return '<!-- 结构 -->\n<div class="card">\n  <!-- TODO: '+task+' -->\n</div>\n\n<style>\n  .card { /* TODO: 样式 */ }\n</style>';
      case 'Go': return 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// TODO: '+task+'\n\tfmt.Println("hello")\n}';
      case 'C++': return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // TODO: '+task+'\n    return 0;\n}';
      default: return '// TODO: '+task;
    }
  }
  function genCode(){
    var lang=vv('ai-cd-lang','Python'), task=vv('ai-cd-task','（如：读取 CSV 并按某列排序输出）'), level=vv('ai-cd-level','标准');
    return '# '+lang+' · 代码方案（'+level+'）\n\n'+
      '## 实现思路\n1. 明确输入 / 输出与边界条件\n2. 选择数据结构与算法（复杂度：______）\n3. 分模块实现，先跑通主流程\n4. 处理异常与边界\n\n'+
      '## 伪代码\n```\n输入 → 预处理 → 核心计算 → 后处理 → 输出\n```\n\n'+
      '## 代码骨架（'+lang+'）\n```'+lang.toLowerCase()+'\n'+codeSkeleton(lang,task)+'\n```\n\n'+
      '## 测试用例\n- 正常输入：（请补充）\n- 边界：空值 / 超大 / 异常格式\n- 性能：数据量 ______ 时耗时 ______\n\n'+
      '## 常见坑\n- 类型 / 下标越界、编码、时区、浮点精度\n- 建议先写测试再补实现（TDD）\n\n> 本地引擎生成骨架与方案，完整实现可在上方平台直达 DeepSeek / 通义等实时补全。';
  }

  /* ============================================================
   * ⑲ 办公模板
   * ============================================================ */
  function genOffice(){
    var type=vv('ai-of-type','周报'), ctx=vv('ai-of-ctx','（如：本周完成店铺装修，下周上线大促）');
    var head='# '+type+'模板', body='';
    switch(type){
      case '周报': body='## 本周完成\n- （事项 + 结果）\n## 进行中\n- （事项 + 进度%）\n## 下周计划\n- （事项）\n## 风险 / 需支持\n- （请补充）\n\n> 背景：'+ctx; break;
      case '会议纪要': body='## 会议主题 / 时间 / 参与人\n## 结论\n- （决议1）（负责人 / 时间）\n## 待办\n| 事项 | 负责人 | 截止 |\n|---|---|---|\n| （请补充） | | |\n## 遗留问题\n- （请补充）'; break;
      case 'OKR': body='## 目标 O\n- （定性目标）\n## 关键结果 KR\n- KR1：（可量化，当前__/目标__）\n- KR2：（可量化）\n- KR3：（可量化）\n## 周节奏\n- 每周同步进度，月底复盘'; break;
      case '项目排期表': body='| 阶段 | 任务 | 负责人 | 开始 | 结束 | 状态 |\n|---|---|---|---|---|---|\n| 启动 | | | | | |\n| 设计 | | | | | |\n| 开发 | | | | | |\n| 验收 | | | | | |\n\n> 背景：'+ctx; break;
      case 'Excel公式': body='## 常用公式\n- 求和：`=SUM(A1:A10)`\n- 条件求和：`=SUMIF(范围,条件,求和范围)`\n- 查找：`=VLOOKUP(值,表,列,0)` / `=XLOOKUP(值,列,返回列)`\n- 去重计数：`=SUMPRODUCT(1/COUNTIF(范围,范围))`\n- 条件判断：`=IF(条件,真,假)`\n- 文本拼接：`=A1&" "&B1`\n\n> 背景：'+ctx; break;
      default: body='## 要点\n- （请补充）\n\n> 背景：'+ctx;
    }
    return head+'\n\n'+body+'\n\n> 办公模板为通用结构，按团队规范调整。';
  }

  /* ============================================================
   * ⑳ 旅行规划
   * ============================================================ */
  function genTravel(){
    var dest=vv('ai-trv-dest','（如：成都 3 日）'), days=vv('ai-trv-days','3'), pref=vv('ai-trv-pref','（如：美食+休闲，预算 3000）');
    var n=parseInt(days,10)||3; if(n>7)n=7; if(n<1)n=1;
    var md='# '+dest+' · 旅行规划（'+n+' 天）\n\n';
    md+='## 每日行程\n';
    for(var i=1;i<=n;i++){
      md+='### Day '+i+'\n- 上午：（景点/活动）\n- 中午：（餐饮推荐）\n- 下午：（景点/体验）\n- 晚上：（夜游/休整）\n\n';
    }
    md+='## 预算参考（'+pref+'）\n| 项目 | 预估 |\n|---|---|\n| 交通 | （请补充） |\n| 住宿 | （请补充） |\n| 餐饮 | （请补充） |\n| 门票/体验 | （请补充） |\n| 其他 | （请补充） |\n\n'+
      '## 行李清单\n- 证件 / 充电 / 常用药 / 当季衣物\n\n## 实用贴士\n- 提前订票订房；查天气；保存离线地图；留机动半天。\n\n> 行程为结构模板，按偏好与实时信息（天气/门票）调整。';
    return md;
  }

  /* ============================================================
   * ㉑ 健身 / 饮食计划
   * ============================================================ */
  function genFitness(){
    var goal=vv('ai-ft-goal','减脂'), level=vv('ai-ft-level','零基础'), freq=vv('ai-ft-freq','3 次/周');
    return '# '+goal+'计划（'+level+' · '+freq+'）\n\n'+
      '## 每周训练 split\n| 日 | 训练重点 | 内容 |\n|---|---|---|\n| 一 | '+goal+'主项 | 20-30min 主项训练 |\n| 二 | 活跃恢复 | 散步/拉伸/瑜伽 |\n| 三 | 力量/耐力 | 复合动作 3×12 |\n| 四 | 休息 | 充足睡眠 |\n| 五 | '+goal+'主项 | 间歇/循环训练 |\n| 六 | 活动 | 户外/球类 |\n| 日 | 休息 | 放松 |\n\n'+
      '## 饮食原则\n- 蛋白质足量（≈1.2-1.6g/kg）；蔬果占盘一半\n- 控糖控油，规律三餐，多喝水\n- 制造合理热量缺口（减脂）/ 盈余（增肌）\n\n'+
      '## 动作库（可选）\n- 居家：深蹲、平板、臀桥、俯卧撑（退阶）\n- 器械：推胸、划船、硬拉（注意姿势）\n\n'+
      '## 注意事项\n- 热身+拉伸，循序渐进，避免受伤\n- 疼痛即停；有基础病先咨询医生\n- 记录体重/围度/状态，4 周复盘\n\n> 计划为通用模板，请结合自身情况，必要时咨询专业教练/医生。';
  }

  /* ============================================================
   * ㉒ 面试准备
   * ============================================================ */
  function genInterview(){
    var role=vv('ai-iv-role','（如：产品经理）'), comp=vv('ai-iv-comp','（如：某互联网大厂/行业）'), bg=vv('ai-iv-bg','（如：2 年经验，主导过 0-1 项目）');
    return '# '+role+' · 面试备战（'+comp+'）\n\n'+
      '## 自我介绍模板（1 分钟）\n我是______，（几段经历）。最值得一提的是'+bg+'。我希望在'+comp+'继续深耕'+role+'。\n\n'+
      '## 高频问题清单\n1. 请介绍你最满意的一个项目（用 STAR）\n2. 遇到的最大困难 / 冲突如何解决？\n3. 为什么选'+comp+' / 这个'+role+'？\n4. 你的优劣势分别是什么？\n5. 未来 3-5 年规划？\n\n'+
      '## STAR 回答框架\n- S 情境：背景与挑战\n- T 任务：你的职责目标\n- A 行动：具体做了什么（突出"我"）\n- R 结果：量化成果 + 复盘\n\n'+
      '## 你该反问的问题\n- 团队当前最核心的目标是什么？\n- 这个岗位半年内的成功标准？\n- 团队文化与成长机制？\n\n'+
      '## 备战清单\n- [ ] 复盘 3 个高光项目（数据化）\n- [ ] 模拟 2 场面试\n- [ ] 了解'+comp+'业务与近期动态\n- [ ] 准备作品集 / 案例\n\n> 面试模板基于通用方法论，按岗位 JD 定向准备。';
  }

  /* ============================================================
   * 功能注册表（7 大类 22 项）
   * ============================================================ */
  var CATS=['写作文案','文本处理','图像设计','规划结构','问答脑暴','编程办公','生活创意'];
  var FUNCS=[
    {id:'copy',cat:'写作文案',name:'✍️ AI文案',form:function(){return fInline(fSel('ai-copy-type','文案类型',AI_COPY_TYPES)+fSel('ai-copy-style','风格',AI_STYLES))+fTa('ai-copy-input','产品/主题/对象（一句话）','如：一双头层牛皮小白鞋 / 一家社区咖啡馆 / 本周工作复盘');},gen:genCopy},
    {id:'social',cat:'写作文案',name:'📱 社媒爆款',form:function(){return fInline(fSel('ai-social-plat','平台',['小红书','抖音','朋友圈','微博','公众号'])+fSel('ai-social-tone','调性',['种草','测评','剧情','干货','搞笑']))+fTa('ai-social-theme','主题/产品','如：黄黑皮口红 / 小个子穿搭 / 约会妆');},gen:genSocial},
    {id:'marketing',cat:'写作文案',name:'🚀 营销方案',form:function(){return fTa('ai-mk-prod','产品/活动','如：618 美妆大促')+fTa('ai-mk-aud','目标人群','如：18-30 岁学生党/白领')+fTa('ai-mk-ch','渠道/预算','如：小红书+抖音+私域，预算 5 万');},gen:genMarketing},
    {id:'email',cat:'写作文案',name:'✉️ 邮件沟通',form:function(){return fSel('ai-em-role','收件人',['客户','领导','同事','合作方','下属'])+fTa('ai-em-purpose','主题/目的','如：跟进合同进度，确认下周签署')+fTa('ai-em-pts','要点（分号分隔）','如：1.条款已确认 2.需补材料 3.时间节点');},gen:genEmail},
    {id:'resume',cat:'写作文案',name:'📄 简历优化',form:function(){return fTa('ai-rs-role','目标岗位','如：电商运营专员')+fTa('ai-rs-exp','经历/技能（分号分隔）','如：负责店铺运营，GMV 提升 30%；带 3 人小组');},gen:genResume},
    {id:'story',cat:'写作文案',name:'📖 故事小说',form:function(){return fSel('ai-st-genre','题材',['都市','古风','科幻','悬疑','甜宠','励志'])+fTa('ai-st-theme','主题','如：失忆画家找回自我')+fTa('ai-st-hero','主角','如：27 岁女插画师林晚');},gen:genStory},
    {id:'video',cat:'写作文案',name:'🎬 视频脚本',form:function(){return fInline(fSel('ai-vd-plat','平台',['抖音','快手','视频号','B站','小红书'])+fSel('ai-vd-dur','时长',['15s','30s','60s']))+fTa('ai-vd-topic','主题','如：3 分钟搞定周末快手菜');},gen:genVideo},

    {id:'text',cat:'文本处理',name:'📝 文本处理',form:function(){return fSel('ai-text-mode','处理方式',AI_TEXT_MODES)+fTa('ai-text-input','待处理文本','粘贴需要精简 / 润色 / 改写 / 摘要的文本…');},gen:genText},
    {id:'translate',cat:'文本处理',name:'🌐 多语翻译',form:function(){return fSel('ai-tr-lang','目标语言',AI_LANGS)+fTa('ai-tr-input','待翻译文本','粘贴需要翻译 / 规范整理的文本…');},gen:genTranslate},

    {id:'prompt',cat:'图像设计',name:'🎨 绘画提示词',form:function(){return fInline(fSel('ai-prompt-style','画面风格',Object.keys(PROMPT_STYLES))+fSel('ai-prompt-scene','适配场景',['通用','鞋业产品图','房产封面','广告海报','头像','壁纸','设计参考图']))+fTa('ai-prompt-input','主体描述','如：一双白色运动鞋，停在浅色木地板上');},gen:genPrompt},
    {id:'naming',cat:'图像设计',name:'🏷 起名命名',form:function(){return fSel('ai-nm-type','命名类型',['品牌名','产品名','店名','活动名','自媒体名','课程名'])+fTa('ai-nm-ind','行业/调性','如：咖啡 / 女鞋 / 文创')+fSel('ai-nm-style','风格',['文艺','简约','国风','活力','高端','亲切']);},gen:genNaming},

    {id:'outline',cat:'规划结构',name:'🗂 大纲导图',form:function(){return fSel('ai-ol-type','大纲类型',AI_OUTLINE_TYPES)+fTa('ai-ol-theme','主题','如：社区咖啡馆开业运营方案 / 季度复盘');},gen:genOutline},
    {id:'ppt',cat:'规划结构',name:'📊 PPT大纲',form:function(){return fTa('ai-pp-theme','演示主题','如：社区咖啡馆开业运营方案')+fTa('ai-pp-aud','受众','如：内部评审 / 投资人对接')+fInp('ai-pp-pages','页数(5-14)','10');},gen:genPpt},
    {id:'study',cat:'规划结构',name:'🎓 学习卡片',form:function(){return fTa('ai-sd-topic','学习主题','如：复利效应 / 光合作用')+fSel('ai-sd-fmt','卡片形式',['费曼笔记','思维导图','闪卡','速记清单','备考计划']);},gen:genStudy},
    {id:'data',cat:'规划结构',name:'📈 数据报告',form:function(){return fTa('ai-dt-topic','报告主题','如：Q2 电商 GMV 复盘')+fTa('ai-dt-metrics','指标（逗号分隔）','如：GMV、转化率、客单价、退货率');},gen:genData},

    {id:'qa',cat:'问答脑暴',name:'💡 问答速查',form:function(){return fTa('ai-qa-input','你的问题','如：PVC 印刷为什么容易有色差？怎么调？');},gen:genQA},
    {id:'brain',cat:'问答脑暴',name:'🧠 创意脑暴',form:function(){return fSel('ai-br-type','脑暴类型',BRAIN_TYPES)+fTa('ai-br-theme','方向/行业/主题','如：咖啡 / 女鞋品牌 / 国风文创');},gen:genBrain},

    {id:'code',cat:'编程办公',name:'💻 代码助手',form:function(){return fInline(fSel('ai-cd-lang','语言',CODE_LANGS)+fSel('ai-cd-level','难度',['入门','标准','进阶']))+fTa('ai-cd-task','任务描述','如：读取 CSV 并按某列排序输出');},gen:genCode},
    {id:'office',cat:'编程办公',name:'📋 办公模板',form:function(){return fSel('ai-of-type','模板类型',['周报','会议纪要','OKR','项目排期表','Excel公式'])+fTa('ai-of-ctx','背景/上下文','如：本周完成店铺装修，下周上线大促');},gen:genOffice},

    {id:'travel',cat:'生活创意',name:'✈️ 旅行规划',form:function(){return fTa('ai-trv-dest','目的地','如：成都 3 日')+fInp('ai-trv-days','天数(1-7)','3')+fTa('ai-trv-pref','偏好/预算','如：美食+休闲，预算 3000');},gen:genTravel},
    {id:'fitness',cat:'生活创意',name:'💪 健身饮食',form:function(){return fSel('ai-ft-goal','目标',['减脂','增肌','塑形','提升体能'])+fSel('ai-ft-level','水平',['零基础','初级','进阶'])+fSel('ai-ft-freq','频次',['3 次/周','4 次/周','5 次+/周']);},gen:genFitness},
    {id:'interview',cat:'生活创意',name:'🎤 面试准备',form:function(){return fTa('ai-iv-role','目标岗位','如：产品经理')+fTa('ai-iv-comp','公司/行业','如：某互联网大厂/行业')+fTa('ai-iv-bg','自身背景','如：2 年经验，主导过 0-1 项目');},gen:genInterview}
  ];
  var FUNCS_MAP={}; FUNCS.forEach(function(f){ FUNCS_MAP[f.id]=f; });

  /* ============================================================
   * ② AI 平台实时直达
   * ============================================================ */
  var AI_PLATFORMS=[
    {n:'豆包',u:'https://www.doubao.com',t:'综合对话'},
    {n:'Kimi',u:'https://kimi.moonshot.cn',t:'长文阅读'},
    {n:'文心一言',u:'https://yiyan.baidu.com',t:'百度'},
    {n:'通义千问',u:'https://tongyi.aliyun.com',t:'阿里'},
    {n:'智谱清言',u:'https://chatglm.cn',t:'清华'},
    {n:'讯飞星火',u:'https://xinghuo.xfyun.cn',t:'讯飞'},
    {n:'DeepSeek',u:'https://chat.deepseek.com',t:'强推理'},
    {n:'腾讯元宝',u:'https://yuanbao.tencent.com',t:'腾讯'},
    {n:'海螺AI',u:'https://hailuoai.com',t:'MiniMax'},
    {n:'阶跃星辰',u:'https://www.stepfun.com',t:'阶跃'},
    {n:'百川',u:'https://www.baichuan-ai.com',t:'百川'},
    {n:'ChatGPT',u:'https://chatgpt.com',t:'OpenAI'},
    {n:'Claude',u:'https://claude.ai',t:'Anthropic'},
    {n:'通义万相',u:'https://tongyi.aliyun.com/wanxiang',t:'AI绘画'},
    {n:'即梦',u:'https://jimeng.jianying.com',t:'AI绘画'},
    {n:'可灵',u:'https://klingai.kuaishou.com',t:'AI视频'},
    {n:'Midjourney',u:'https://www.midjourney.com',t:'AI绘画'}
  ];
  var AI_GLOBAL=['豆包','Kimi','文心一言','通义千问','DeepSeek','智谱清言'];
  function renderPlatforms(){
    var box=$('ai-platforms'); if(!box) return;
    box.innerHTML=AI_PLATFORMS.map(function(p){ return '<a class="ai-plat" href="'+p.u+'" target="_blank" rel="noopener"><b>'+p.n+'</b><span>'+p.t+' ↗</span></a>'; }).join('');
  }
  function openGlobal(){
    var kw=v('ai-global-kw').trim();
    var links=$('ai-global-links'); if(links) links.innerHTML='';
    AI_GLOBAL.forEach(function(n){
      var p=AI_PLATFORMS.filter(function(x){return x.n===n;})[0];
      if(p && window.open){ window.open(p.u,'_blank'); }
      if(links) links.innerHTML+='<span class="tag" style="background:var(--primary-soft);color:var(--primary-dark);border-radius:999px;padding:3px 11px;font-size:11px;font-weight:600">已打开 '+n+' ↗</span> ';
    });
    if(typeof toast==='function') toast(kw?('已为你打开 '+AI_GLOBAL.length+' 个 AI，把这句话丢进去即可：'+kw.slice(0,20)):'已为你打开 '+AI_GLOBAL.length+' 个主流 AI');
  }

  /* ============================================================
   * ③ 今日 AI 精选（可刷新）
   * ============================================================ */
  var AI_HOT=[
    {t:'一句话生成活动海报',d:'输入主题，即梦 / 通义万相秒出图',u:'https://jimeng.jianying.com',tag:'AI绘画'},
    {t:'长文档秒读 + 摘要',d:'把报告丢给 Kimi，自动提炼要点',u:'https://kimi.moonshot.cn',tag:'文档'},
    {t:'会议纪要 → 行动清单',d:'文字 / 录音交给 AI 整理待办',u:'https://www.doubao.com',tag:'办公'},
    {t:'英文邮件润色翻译',d:'文心 / DeepSeek 中英互译 + 润色',u:'https://yiyan.baidu.com',tag:'翻译'},
    {t:'短视频脚本一键写',d:'豆包按平台生成分镜与台词',u:'https://www.doubao.com',tag:'脚本'},
    {t:'老照片 AI 上色修复',d:'腾讯ARC / 美图秀秀 AI 修复',u:'https://ai.tencent.com',tag:'图像'},
    {t:'代码报错 AI 帮你改',d:'把报错贴给 DeepSeek 立即定位',u:'https://chat.deepseek.com',tag:'编程'},
    {t:'AI 做 PPT 大纲',d:'通义 / 讯飞一键生成演示结构',u:'https://tongyi.aliyun.com',tag:'PPT'},
    {t:'简历优化 + 模拟面试',d:'智谱 / 豆包打磨简历与应答',u:'https://chatglm.cn',tag:'求职'},
    {t:'多语种实时翻译',d:'百度翻译 / DeepL 拍照即译',u:'https://fanyi.baidu.com',tag:'翻译'},
    {t:'AI 生成品牌名 / Slogan',d:'脑暴工具一键出命名方案',u:'https://www.doubao.com',tag:'命名'}
  ];
  var hotIdx=0;
  function renderHot(){
    var box=$('ai-hot-list'); if(!box) return;
    var n=6, html='';
    for(var i=0;i<n;i++){ var h=AI_HOT[(hotIdx+i)%AI_HOT.length]; html+='<a class="ai-hot" href="'+h.u+'" target="_blank" rel="noopener"><b>'+h.t+'</b><p>'+h.d+'</p><span class="tag">'+h.tag+' ↗</span></a>'; }
    box.innerHTML=html;
    var tm=$('ai-hot-time'); if(tm){ var d=new Date(); tm.textContent='更新于 '+d.toLocaleTimeString('zh-CN',{hour12:false}); }
  }
  function refreshHot(){ hotIdx=(hotIdx+6)%AI_HOT.length; renderHot(); if(typeof toast==='function') toast('已换一批 AI 精选玩法'); }

  /* ============================================================
   * UI 接线
   * ============================================================ */
  var curCat='全部';
  function renderCats(){
    var box=$('ai-cats'); if(!box) return;
    var html='<button class="ai-cat active" data-cat="全部">全部</button>'+CATS.map(function(c){return '<button class="ai-cat" data-cat="'+c+'">'+c+'</button>';}).join('');
    box.innerHTML=html;
    box.querySelectorAll('.ai-cat').forEach(function(b){
      b.addEventListener('click',function(){ curCat=b.dataset.cat; box.querySelectorAll('.ai-cat').forEach(function(x){x.classList.toggle('active',x===b);}); renderFuncs(); });
    });
  }
  function renderFuncs(){
    var box=$('ai-funcs'); if(!box) return;
    var list=FUNCS.filter(function(f){ return curCat==='全部'||f.cat===curCat; });
    box.innerHTML=list.map(function(f){ return '<button class="ai-func'+(f.id===window.__aiFn?' active':'')+'" data-fn="'+f.id+'">'+f.name+'</button>'; }).join('');
    box.querySelectorAll('.ai-func').forEach(function(b){
      b.addEventListener('click',function(){ setFn(b.dataset.fn); });
    });
  }
  function setFn(fn){
    window.__aiFn=fn;
    var def=FUNCS_MAP[fn];
    document.querySelectorAll('.ai-func').forEach(function(x){ x.classList.toggle('active', x.dataset.fn===fn); });
    var formBox=$('ai-form'); if(formBox && def) formBox.innerHTML=def.form();
    var label=def?def.name.replace(/^[^\u4e00-\u9fa5A-Za-z]+/,''):fn;
    var out=$('ai-output'); if(out) out.innerHTML='<span class="md-placeholder">已切换到「'+label+'」，填写需求后点击「⚡ 一键生成」即可得到结构化成品。</span>';
  }
  function aiGenerate(){
    var fn=window.__aiFn||'copy', def=FUNCS_MAP[fn], md='';
    try{ if(def&&def.gen) md=def.gen(); }catch(e){ md='生成出错：'+(e&&e.message?e.message:e); }
    if(!md||!md.trim()) md='*（请填写内容后点击生成）*';
    var out=$('ai-output'); if(out) out.innerHTML=aiMd2html(md);
    lastMd=md;
  }
  function copyMd(){
    if(!lastMd){ if(window.toast) toast('暂无可复制内容'); return; }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(lastMd).then(function(){ if(window.toast) toast('已复制 Markdown'); }, function(){ fallbackCopy(lastMd); });
    } else { fallbackCopy(lastMd); }
  }
  function fallbackCopy(t){ var ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); if(window.toast) toast('已复制'); }catch(e){} ta.remove(); }

  var lastMd='';

  // 绑定
  renderPlatforms();
  renderHot();
  renderCats();
  renderFuncs();
  if($('ai-gen')) $('ai-gen').addEventListener('click',aiGenerate);
  if($('ai-copy')) $('ai-copy').addEventListener('click',copyMd);
  if($('ai-global-go')) $('ai-global-go').addEventListener('click',openGlobal);
  if($('ai-hot-refresh')) $('ai-hot-refresh').addEventListener('click',refreshHot);
  window.__aiFn='copy';
  setFn('copy');

  // 注册全局刷新（与 newmods.js 的「🔄 实时更新」对齐）
  window.TW_refresh=window.TW_refresh||{};
  window.TW_refresh.ai=function(){ try{ refreshHot(); renderHot(); }catch(e){ console.error('[ai refresh]',e); } };
})();
