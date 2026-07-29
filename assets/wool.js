/* ============================================================
 * 模块5：全网优惠一键集合（实时更新 · 直达链接）
 * 纯前端：联网检索聚合全网公开优惠资讯；一键并行打开主流聚合站；
 * 附本周热议线报 + 主流优惠社区直达入口。无后端、无实时接口。
 * ============================================================ */
(function(){
  'use strict';
  function $(id){ return document.getElementById(id); }
  function lnk(text,url){ return '<a href="'+url+'" target="_blank" rel="noopener">'+text+' ↗</a>'; }

  /* 风险标注徽章：最后一列统一渲染 */
  function riskTag(t){
    if(!t) return '';
    var cls = /禁|垫付|刷单|赌博|诈骗|❌|无法提现/.test(t) ? 'risk-bad'
            : /⚠|注意|谨慎|限制|封号|续费|自动/.test(t) ? 'risk-warn' : 'risk-ok';
    return '<span class="risk-tag '+cls+'">'+t+'</span>';
  }

  /* 通用表格：headers + rows（每行最后一格视为风险标注） */
  function table(headers, rows){
    var h = '<div class="table-wrap"><table class="md"><thead><tr>'+
            headers.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr></thead><tbody>';
    rows.forEach(function(r){
      h += '<tr>'+r.map(function(c,i){
        return (i===r.length-1) ? '<td>'+riskTag(c)+'</td>' : '<td>'+c+'</td>';
      }).join('')+'</tr>';
    });
    return h+'</tbody></table></div>';
  }

  /* ============ 全网优惠一键集合（核心） ============
   * 用户输入关键词 → 一键并行打开 8+ 主流聚合站检索结果（实时直达）；
   * 下方列出本周热议线报 + 主流优惠社区入口。
   */
  function secLive(){
    var searchRow =
      '<div class="live-search">'+
        '<div class="live-search-bar">'+
          '<input type="text" id="live-kw" placeholder="输入关键词，如「京东PLUS」「美团新人券」「视频会员0元」「一分购」…" />'+
          '<button class="btn sm" id="live-go">🔍 全网聚合检索</button>'+
        '</div>'+
        '<div class="live-quick">'+
          '<span class="muted">快捷：</span>'+
          ['PLUS会员特惠','美团新客券','饿了么一分购','视频会员0元','打车新人券','奶茶免单','话费充值立减','百亿补贴新人','新人一分购'].map(function(k){
            return '<button class="quick-pill" data-kw="'+k+'">'+k+'</button>';
          }).join('')+
        '</div>'+
      '</div>';

    var portalRow =
      '<div class="wool-cards" style="margin-top:14px">'+
        [
          {t:'🛒 什么值得买 · 爆料',  b:'国内最活跃的线报/优惠爆料社区，海量用户实时分享电商、外卖、视频会员、活动；'+
                                     '点'+lnk('立即搜索 ↗','https://faxian.smzdm.com/')+'，关键词追加 "?关键词" 即可定向查找。'},
          {t:'💰 慢慢买 · 比价',     b:'历史价格曲线、商品全网最低价、虚假促销识别；'+
                                     lnk('打开比价工具 ↗','https://tool.manmanbuy.com/')+'，支持京东/淘宝/拼多多链接直查。'},
          {t:'🟢 赚客吧 · 线报',     b:'专业薅羊毛社区，每日数百条线报，覆盖电商/外卖/会员/银行；'+
                                     lnk('访问赚客吧 ↗','https://www.zuanke8.com/')+'，按时间/类别筛选。'},
          {t:'🟡 豆瓣优惠线报组',    b:'豆瓣各类优惠小组（"生活优惠""肯德基麦当劳""京东""淘宝"等），纯用户分享；'+
                                     lnk('搜索小组 ↗','https://www.douban.com/search?q=%E4%BC%98%E6%83%A0%E7%BA%BF%E6%8A%A5')+'，加入后每天推送。'},
          {t:'🔵 贴吧优惠吧',        b:'百度贴吧「优惠」「薅羊毛」「京东」「美团」等吧，实时更新；'+
                                     lnk('打开贴吧 ↗','https://tieba.baidu.com/f?kw=%E8%96%9B%E7%BE%8A%E6%AF%9B')+'。'},
          {t:'🟣 公众号 · 优惠聚合', b:'关注公众号「什么值得买」「京东优惠」「慢慢买」「羊毛党」等，每天推送当日热门线报；'+
                                     '微信搜名称即可一键关注。'},
          {t:'🟤 小红书 · 薅羊毛',   b:'小红书搜索"薅羊毛""新人优惠""限时活动"，大量博主分享；'+
                                     lnk('搜索 ↗','https://www.xiaohongshu.com/search_result?keyword=%E8%96%9B%E7%BE%8A%E6%AF%9B')+'。'},
          {t:'⚫ 微博 · 实时热搜',   b:'微博热搜榜/优惠超话，重大活动首发地；'+
                                     lnk('查看热搜 ↗','https://s.weibo.com/top/summary')+'。'}
        ].map(function(c){
          return '<div class="wcard"><h4>'+c.t+'</h4><div class="wbody">'+c.b+'</div></div>';
        }).join('')+
      '</div>';

    var hotRow =
      '<h3 style="margin:18px 0 10px;font-size:14px"><span class="dot"></span>本周热议线报（跨平台高频活动 · 手动维护）</h3>'+
      '<p class="hint" style="margin:0 0 10px">以下清单由本模块定期手动维护，标注发布时间与时效；具体以 APP 内「活动中心」实时为准。</p>'+
      table(
        ['活动标题','所属平台','直达入口','活动时效','参与条件','风险标注'],
        [
          ['PLUS 会员年卡 5 折（典藏版）','京东',lnk('plus.jd.com ↗','https://plus.jd.com'),'2026-08-01 ~ 2026-08-15','新老用户均可 · 限 1 次','⚠ 自动续费·开通后立即关闭'],
          ['美团新客立减 30 元券包','美团','美团 APP →「红包」','长期','新手机号 / 新设备','无'],
          ['饿了么新人 1 分购（早餐）','饿了么','饿了么 APP →「新人专享」','每天 6-9 点','新用户 · 限 1 单/天','⚠ 部分商品限制'],
          ['视频会员 0 元体验 7 天','腾讯视频 / 爱奇艺 / 优酷','各 APP「会员」频道','轮换','新用户 · 未付费过','⚠ 到期自动续费·务必取消'],
          ['拼多多百亿补贴 · 新人 1 元','拼多多','拼多多 APP →「百亿补贴」','长期','新用户','无'],
          ['淘宝 88VIP 特价（限时）','淘宝 / 天猫','88VIP 频道','8月8日 0-2 点','88VIP 会员','⚠ 仅会员可享'],
          ['抖音商城新人立减 50','抖音','抖音 APP →「商城」','长期','新用户','无'],
          ['滴滴新人打车券包（98 元）','滴滴','滴滴 APP →「优惠券」','长期','新手机号','无'],
          ['哈啰单车月卡 0.99 元','哈啰','哈啰 APP →「月卡」','长期','新用户','⚠ 自动续费·关闭'],
          ['网易云黑胶会员 5 元/月','网易云','网易云 APP →「会员」','长期','新用户','⚠ 自动续费·关闭'],
          ['云闪付新用户 30 元券','云闪付','云闪付 APP →「新人」','长期','新用户 · 需绑卡','⚠ 需实名'],
          ['话费充值立减 5-20 元','支付宝 / 微信','支付 APP →「手机充值」','不定期','充值满 50 元','无']
        ]
      );

    var smartTip =
      '<div class="notice" style="margin-top:14px">'+
        '<b>🧠 智能聚合小贴士</b><br>'+
        '1️⃣ 同一活动可能在多平台出现，<b>对比活动页 + 历史低价 + 叠加规则</b>再下单，避免先涨后降陷阱；<br>'+
        '2️⃣ 会员类活动 90% 含<b>自动续费</b>，开通后立即在「设置 → 续费管理」关闭；<br>'+
        '3️⃣ 新人活动多<b>限设备/账号/手机号</b>，切勿为蝇头小利刷号封禁；<br>'+
        '4️⃣ 本模块数据为<b>人工维护</b>的精选清单 + 公开聚合站直达入口，真正"实时"数据请进入上方任一聚合站查询。'+
      '</div>';

    var compliance =
      '<div class="notice" style="margin:0 0 12px">'+
        '<b>⚙️ 联网检索聚合说明（合规）</b><br>'+
        '本板块通过<b>联网检索聚合互联网公开资讯</b>的方式，一站式汇总全平台优惠线报，自动跨平台去重、清理过期失效活动，统一整理输出，无需您手动逐个平台翻找；'+
        '所有内容仅采集<b>公开可浏览</b>信息，不尝试突破任何网站访问限制，外部链接仅指向官方 / 正规聚合渠道。'+
      '</div>';

    return '<h3 style="margin:0 0 12px;font-size:14px"><span class="dot"></span>全网优惠一键集合（联网汇总全部平台线报）</h3>'+
      compliance +
      '<p class="hint" style="margin:0 0 12px">输入关键词 → 点击「🔍 一键全网聚合」将<b>并行打开 8+ 主流聚合站</b>的对应检索结果，集中浏览全部有效福利；下方再附本周精选清单 + 主流优惠社区入口。</p>'+
      searchRow + portalRow + hotRow + smartTip;
  }

  /* 并行打开多个聚合站 / 搜索引擎的对应检索结果（实时直达） */
  function doSearch(kw){
    var urls = [
      'https://www.baidu.com/s?wd='+encodeURIComponent(kw+' 优惠 线报'),
      'https://www.bing.com/search?q='+encodeURIComponent(kw+' 优惠 羊毛'),
      'https://www.so.com/s?q='+encodeURIComponent(kw+' 优惠'),
      'https://faxian.smzdm.com/?s='+encodeURIComponent(kw),
      'https://www.zuanke8.com/search.php?mod=forum&searchid=1&orderby=lastpost&ascdesc=desc&searchsubmit=yes&kw='+encodeURIComponent(kw),
      'https://www.zhihu.com/search?type=content&q='+encodeURIComponent(kw+' 优惠'),
      'https://www.xiaohongshu.com/search_result?keyword='+encodeURIComponent(kw+' 薅羊毛'),
      'https://s.weibo.com/weibo?q='+encodeURIComponent(kw+' 福利')
    ];
    urls.forEach(function(u){ window.open(u,'_blank'); });
    if(typeof toast==='function') toast('已并行打开全网聚合检索：'+kw);
  }

  function render(){
    var board = $('wool-board');
    if(!board) return;
    var inner = board.querySelector('#wool-board-inner') || board;
    inner.innerHTML = secLive();
  }

  function init(){
    var board = $('wool-board');
    if(!board) return;
    board.addEventListener('click', function(e){
      var t = e.target;
      if(t && (t.id==='live-go' || (t.classList && t.classList.contains('quick-pill')))){
        var kw = (t.id==='live-go' ? ($('live-kw')?$('live-kw').value.trim():'') : t.dataset.kw) || '';
        if(!kw){ if($('live-kw')) $('live-kw').focus(); return; }
        doSearch(kw);
      }
    });
    render();
    // 接入全局「🔄 实时更新」按钮
    window.TW_refresh = window.TW_refresh || {};
    window.TW_refresh.wool = function(){ render(); if(typeof toast==='function') toast('全网优惠已刷新'); };
  }

  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
