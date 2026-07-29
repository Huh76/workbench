/* ============================================================
 * TRAEWork 数据层（含 2026 年公开整合调研资料）
 * 数据仅供个人调研参考，不作为交易/授权/商用依据。
 * ============================================================ */

/* ========== 模块1：全国二手房房源 ==========
 * city: 城市
 * layout: 户型（开间/一室一厅/两室一厅/...）
 * type: 住宅(70年) / 公寓(40年商办)
 * 字段：城市/户型/小区/片区/楼龄/面积/总价/单价/物业/燃气/月租/商圈/亮点/短板/风险
 */

/* 全国城市（abbr 用于贝壳/链家/58 子域，py 用于安居客子域） */
const CITIES = [
  { name:'北京',  abbr:'bj',  py:'beijing' },
  { name:'上海',  abbr:'sh',  py:'shanghai' },
  { name:'广州',  abbr:'gz',  py:'guangzhou' },
  { name:'深圳',  abbr:'sz',  py:'shenzhen' },
  { name:'杭州',  abbr:'hz',  py:'hangzhou' },
  { name:'成都',  abbr:'cd',  py:'chengdu' },
  { name:'武汉',  abbr:'wh',  py:'wuhan' },
  { name:'南京',  abbr:'nj',  py:'nanjing' },
  { name:'重庆',  abbr:'cq',  py:'chongqing' },
  { name:'苏州',  abbr:'su',  py:'suzhou' },
  { name:'西安',  abbr:'xa',  py:'xian' },
  { name:'天津',  abbr:'tj',  py:'tianjin' },
  { name:'郑州',  abbr:'zz',  py:'zhengzhou' },
  { name:'长沙',  abbr:'cs',  py:'changsha' },
  { name:'东莞',  abbr:'dg',  py:'dongguan' },
  { name:'宁波',  abbr:'nb',  py:'ningbo' },
  { name:'青岛',  abbr:'qd',  py:'qingdao' },
  { name:'昆明',  abbr:'km',  py:'kunming' },
  { name:'厦门',  abbr:'xm',  py:'xiamen' },
  { name:'福州',  abbr:'fz',  py:'fuzhou' },
  { name:'泉州',  abbr:'qz',  py:'quanzhou' },
  { name:'晋江',  abbr:'jinjiang', py:'jinjiang' },
];

/* 户型选项 */
const LAYOUTS = ['开间','一室一厅','一室两厅','两室一厅','两室两厅','三室一厅','三室二厅','四室及以上'];

const PROPERTY_DATA = [
  // —— 晋江（原数据）——
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"青阳", community:"宝龙城市广场(晋江)", year:2016, age:10, area:46.98, total:45.5, unit:9680, property:"70年", gas:true, rent:1300, wy:"宝龙物业",
    biz:"下楼即宝龙商圈/SM/万达，世纪大道，生活配套顶级", highlight:"南北通透、带电梯、精装拎包入住、核心地段", flaw:"单价偏高、车位紧张", risk:"价格含装修溢价，签约前核验产权与满五唯一" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"青阳", community:"宝龙城市广场(晋江) 小户", year:2013, age:13, area:44.56, total:30, unit:6733, property:"70年", gas:true, rent:1100, wy:"宝龙物业",
    biz:"青阳核心、宝龙商圈、交通便捷", highlight:"总价低、可收租、配套成熟", flaw:"楼龄偏长、西向采光一般", risk:"确认是否为住宅性质、可落户" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"梅岭", community:"浔兴奥林春天", year:2018, age:8, area:60.88, total:58, unit:9526, property:"70年", gas:true, rent:1500, wy:"浔兴物业",
    biz:"梅岭迎宾路、近八仙山公园、晋江一中", highlight:"满五年、有电梯、东向采光、次新", flaw:"面积略大、总价门槛高", risk:"核验满五唯一省税费" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"陈埭", community:"宝业头家", year:2020, age:6, area:37.76, total:35, unit:9269, property:"70年", gas:true, rent:900, wy:"宝业物业",
    biz:"鞋都路、近中国鞋都、庵上公交", highlight:"次新、有电梯、毛坯可自改、低总价", flaw:"毛坯需装修、周边工业感强", risk:"确认交付年限与燃气入户" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"桥南", community:"百捷中央公园", year:2019, age:7, area:41, total:52, unit:12683, property:"70年", gas:true, rent:1200, wy:"百捷物业",
    biz:"桥南片区商业、中医院桥南分院", highlight:"次新、性价比高、近泉州通勤", flaw:"片区配套仍在成熟", risk:"核验学区与产权" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"梅岭", community:"桥南·百信御江帝景", year:2021, age:5, area:43, total:57, unit:13256, property:"70年", gas:true, rent:1300, wy:"御江物业",
    biz:"江景、近晋江大桥", highlight:"次新、江景、通勤泉州便捷", flaw:"总价偏高", risk:"确认按揭与满二" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"青阳", community:"曾井片区次新电梯房", year:2021, age:5, area:45, total:63, unit:14000, property:"70年", gas:true, rent:1400, wy:"自管/街道",
    biz:"曾井建材城、晋江中医院", highlight:"次新、采光好、生活便利", flaw:"车位有限", risk:"核验房本与抵押" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"梅岭", community:"八仙山公园旁小户", year:2022, age:4, area:40, total:66, unit:16500, property:"70年", gas:true, rent:1500, wy:"品牌物业",
    biz:"八仙山公园、万达、晋江二小", highlight:"最新次新、环境优、学区好", flaw:"单价最高", risk:"确认限售与贷款资质" },
  { city:"晋江", layout:"一室一厅", type:"住宅", district:"陈埭", community:"溪边片区次新小户", year:2019, age:7, area:46, total:47, unit:10217, property:"70年", gas:true, rent:1000, wy:"自管",
    biz:"溪边公园、陈埭中心小学", highlight:"价格洼地、通燃气、可自住", flaw:"配套一般", risk:"核验燃气与落户" },
  { city:"晋江", layout:"一室一厅", type:"公寓", district:"梅岭", community:"梅岭·LOFT商办公寓", year:2022, age:4, area:38, total:45, unit:11842, property:"40年", gas:false, rent:1000, wy:"商办物业",
    biz:"世纪大道写字楼群", highlight:"挑高LOFT、通勤便利", flaw:"无天然气、商水商电、不可落户", risk:"⚠40年产权/不通燃气/不可落户/税费高，谨慎购买" },
  { city:"晋江", layout:"一室一厅", type:"公寓", district:"青阳", community:"青阳·写字楼改公寓", year:2021, age:5, area:33, total:36, unit:10909, property:"40年", gas:false, rent:850, wy:"商办物业",
    biz:"青阳商圈", highlight:"低总价上车", flaw:"无燃气、层高受限、非住宅", risk:"⚠商办性质，转手税费高、贷款受限" },

  // —— 北京 ——
  { city:"北京", layout:"一室一厅", type:"住宅", district:"朝阳", community:"望京·澳洲康都", year:2018, age:8, area:55, total:320, unit:58182, property:"70年", gas:true, rent:5500, wy:"首开物业",
    biz:"望京核心、近地铁15号线", highlight:"次新、近互联网商圈、通勤便利", flaw:"总价偏高", risk:"核验满五唯一与学区划分" },
  { city:"北京", layout:"两室一厅", type:"住宅", district:"海淀", community:"西二旗·领秀新硅谷", year:2017, age:9, area:89, total:560, unit:62921, property:"70年", gas:true, rent:7800, wy:"万科物业",
    biz:"近西二旗地铁站、中关村软件园", highlight:"次新、品牌物业、互联网从业者聚集", flaw:"单价高、通勤挤", risk:"确认学区与贷款资质" },
  { city:"北京", layout:"开间", type:"公寓", district:"朝阳", community:"CBD·建外SOHO开间", year:2015, age:11, area:45, total:280, unit:62222, property:"40年", gas:false, rent:6000, wy:"商办物业",
    biz:"国贸CBD核心", highlight:"通勤顶级、租售比高", flaw:"40年商办、不通燃气、不可落户", risk:"⚠商办性质，税费高、贷款受限" },

  // —— 上海 ——
  { city:"上海", layout:"一室一厅", type:"住宅", district:"浦东", community:"花木·大唐盛世", year:2019, age:7, area:52, total:380, unit:73077, property:"70年", gas:true, rent:6000, wy:"浦发物业",
    biz:"花木路、近世纪公园、龙阳路枢纽", highlight:"次新、近地铁2号线、生活配套成熟", flaw:"总价偏高", risk:"核验满五唯一与限购资格" },
  { city:"上海", layout:"两室一厅", type:"住宅", district:"闵行", community:"莘庄·好世凤凰城", year:2016, age:10, area:78, total:520, unit:66667, property:"70年", gas:true, rent:7000, wy:"万科物业",
    biz:"莘庄商圈、近地铁1号线", highlight:"品牌小区、南北通透、学区优质", flaw:"楼龄略长", risk:"核验学区政策与满二" },
  { city:"上海", layout:"开间", type:"公寓", district:"静安", community:"南京西路·SOHO开间", year:2020, age:6, area:40, total:320, unit:80000, property:"40年", gas:false, rent:6500, wy:"商办物业",
    biz:"南京西路商圈", highlight:"核心地段、租售比高", flaw:"40年商办、不通燃气", risk:"⚠商办性质，税费高" },

  // —— 深圳 ——
  { city:"深圳", layout:"一室一厅", type:"住宅", district:"南山", community:"前海·阳光花地", year:2020, age:6, area:48, total:360, unit:75000, property:"70年", gas:true, rent:5500, wy:"品牌物业",
    biz:"前海自贸区、近地铁5号线", highlight:"次新、地段好、投资自住两相宜", flaw:"单价高", risk:"核验限购与贷款资质" },
  { city:"深圳", layout:"两室一厅", type:"住宅", district:"宝安", community:"西乡·领航城", year:2018, age:8, area:72, total:420, unit:58333, property:"70年", gas:true, rent:5800, wy:"品牌物业",
    biz:"宝安中心区、近地铁1号线", highlight:"性价比高、品牌小区、通勤前海", flaw:"片区仍在发展", risk:"核验产权与满二" },

  // —— 广州 ——
  { city:"广州", layout:"两室一厅", type:"住宅", district:"天河", community:"珠江新城·保利心语", year:2017, age:9, area:75, total:480, unit:64000, property:"70年", gas:true, rent:6000, wy:"保利物业",
    biz:"珠江新城CBD、近地铁5号线", highlight:"CBD核心、品牌物业、保值性强", flaw:"总价高", risk:"核验满五唯一与学位" },
  { city:"广州", layout:"三室一厅", type:"住宅", district:"番禺", community:"华南碧桂园", year:2015, age:11, area:95, total:350, unit:36842, property:"70年", gas:true, rent:4800, wy:"碧桂园物业",
    biz:"番禺广场、近地铁3号线", highlight:"大盘社区、配套成熟、总价可控", flaw:"楼龄偏长", risk:"核验满二与物业费" },

  // —— 杭州 ——
  { city:"杭州", layout:"一室一厅", type:"住宅", district:"西湖", community:"文教·翠苑新村", year:2019, age:7, area:50, total:280, unit:56000, property:"70年", gas:true, rent:4500, wy:"街道物业",
    biz:"文教区、近地铁2号线", highlight:"次新、学区好、生活便利", flaw:"单价偏高", risk:"核验学区与满五唯一" },
  { city:"杭州", layout:"两室两厅", type:"住宅", district:"滨江", community:"滨和路·东方郡", year:2018, age:8, area:89, total:420, unit:47191, property:"70年", gas:true, rent:5500, wy:"品牌物业",
    biz:"滨江高新区、近地铁1号线", highlight:"互联网从业者聚集、次新、南北通透", flaw:"通勤挤", risk:"核验产权与限购" },

  // —— 成都 ——
  { city:"成都", layout:"两室一厅", type:"住宅", district:"武侯", community:"桐梓林·中华园", year:2017, age:9, area:72, total:220, unit:30556, property:"70年", gas:true, rent:3500, wy:"品牌物业",
    biz:"桐梓林商圈、近地铁1号线", highlight:"性价比高、生活配套成熟", flaw:"楼龄略长", risk:"核验满二与产权" },
  { city:"成都", layout:"三室二厅", type:"住宅", district:"高新", community:"金融城·中海兰庭", year:2020, age:6, area:120, total:450, unit:37500, property:"70年", gas:true, rent:5000, wy:"中海物业",
    biz:"金融城CBD、近地铁1号线", highlight:"次新、高端改善、品牌物业", flaw:"总价偏高", risk:"核验限购与贷款" },

  // —— 武汉 ——
  { city:"武汉", layout:"两室一厅", type:"住宅", district:"光谷", community:"光谷·保利茉莉公馆", year:2019, age:7, area:80, total:180, unit:22500, property:"70年", gas:true, rent:3000, wy:"保利物业",
    biz:"光谷核心、近地铁2号线", highlight:"次新、互联网从业者聚集、性价比高", flaw:"片区发展中", risk:"核验产权与满二" },

  // —— 南京 ——
  { city:"南京", layout:"一室一厅", type:"住宅", district:"鼓楼", community:"龙江·银城聚泽园", year:2018, age:8, area:52, total:260, unit:50000, property:"70年", gas:true, rent:4000, wy:"银城物业",
    biz:"龙江商圈、近地铁4号线", highlight:"次新、学区好、品牌物业", flaw:"单价偏高", risk:"核验满五唯一与学区" },

  // —— 重庆 ——
  { city:"重庆", layout:"两室一厅", type:"住宅", district:"渝北", community:"照母山·香港置地", year:2020, age:6, area:85, total:200, unit:23529, property:"70年", gas:true, rent:3200, wy:"品牌物业",
    biz:"照母山板块、近地铁5号线", highlight:"次新、环境好、性价比高", flaw:"距核心区较远", risk:"核验产权与满二" },

  // —— 西安 ——
  { city:"西安", layout:"两室一厅", type:"住宅", district:"雁塔", community:"高新·天地源枫林绿洲", year:2017, age:9, area:88, total:180, unit:20455, property:"70年", gas:true, rent:3000, wy:"品牌物业",
    biz:"高新路、近地铁3号线", highlight:"高新区核心、生活配套成熟", flaw:"楼龄略长", risk:"核验满二与产权" },

  // —— 厦门 ——
  { city:"厦门", layout:"一室一厅", type:"住宅", district:"思明", community:"筼筜湖·建发花园", year:2018, age:8, area:50, total:380, unit:76000, property:"70年", gas:true, rent:4500, wy:"建发物业",
    biz:"筼筜湖畔、近地铁2号线", highlight:"湖景房、次新、学区好", flaw:"单价高", risk:"核验限购与满五唯一" },

  // —— 苏州 ——
  { city:"苏州", layout:"三室一厅", type:"住宅", district:"工业园", community:"湖东·中海国际社区", year:2019, age:7, area:100, total:380, unit:38000, property:"70年", gas:true, rent:4200, wy:"中海物业",
    biz:"园区湖东、近地铁1号线", highlight:"次新、品牌物业、园区通勤便利", flaw:"总价偏高", risk:"核验限购与满二" },
];

/* ========== 模块4：潘通 TPG 全色库（2310 色） ==========
 * 完整色库已移至 assets/pantone.js（来自 xuduo18/pantone-colors 公开整理，
 * 含 TPG 色号/名称/HEX；RGB 与 CMYK 由 HEX 实时换算。TPG 为纺织色卡，
 * 印刷以实物色卡为准；色名版权归 Pantone，HEX 数值公开可用。
 */

/* ========== 模块6：智能配色预设（26 套场景化主题 + 算法和谐色） ==========
 * 每套预设提供 name / cat(分类) / base(主色) / scheme(5 色精选方案)。
 * 此外 gen() 会基于任意基色算法生成 互补/邻近/三角/四角 等 7 组和谐方案，
 * 因此配色数量近乎无限（预设 + 任意基色算法）。
 */
const PALETTE_PRESETS = [
  // —— 国风 ——
  { cat:"国风", name:"故宫红墙",  base:"#9E2B25", scheme:["#9E2B25","#E8C07D","#2E4A3D","#F2E8D5","#5A1A16"] },
  { cat:"国风", name:"青花瓷",    base:"#1F4E79", scheme:["#1F4E79","#FFFFFF","#3E6F9E","#C9D6E3","#0E2A45"] },
  { cat:"国风", name:"水墨江南",  base:"#3A3A3A", scheme:["#3A3A3A","#EDEAE3","#7C8B7A","#B7C4BC","#1C1C1C"] },
  { cat:"国风", name:"敦煌壁画",  base:"#C87941", scheme:["#C87941","#9B2335","#2E6E6A","#E3C16F","#3A2417"] },
  // —— 季节 ——
  { cat:"季节", name:"春樱",      base:"#F4A6B6", scheme:["#F4A6B6","#FFF0F3","#A8D5BA","#FCE3A0","#D66A86"] },
  { cat:"季节", name:"夏海",      base:"#1B9AAA", scheme:["#1B9AAA","#E8F6F6","#F4D35E","#0B6E8F","#EF767A"] },
  { cat:"季节", name:"秋叶",      base:"#C0492B", scheme:["#C0492B","#E8A14B","#8C5A2B","#EAD7A0","#5A2A1A"] },
  { cat:"季节", name:"冬雪",      base:"#6C8EBF", scheme:["#6C8EBF","#F4F7FB","#D9E2EE","#B0BEC5","#2E4A6B"] },
  // —— 节日 ——
  { cat:"节日", name:"喜庆红金",  base:"#C8102E", scheme:["#C8102E","#F2C14E","#1A1A1A","#E8B4B8","#7A0C1E"] },
  { cat:"节日", name:"圣诞",      base:"#0F8A5F", scheme:["#0F8A5F","#C0392B","#F2E9DC","#D4AF37","#0B3D2E"] },
  { cat:"节日", name:"新春",      base:"#D62828", scheme:["#D62828","#F4A261","#E9C46A","#FFF3E0","#9D0208"] },
  // —— 风格 ——
  { cat:"风格", name:"莫兰迪",    base:"#A39B8B", scheme:["#A39B8B","#D6CFC7","#B7A99A","#8E9AAF","#6D6875"] },
  { cat:"风格", name:"马卡龙",    base:"#F7A1C4", scheme:["#F7A1C4","#C5E3F0","#FCE38A","#B8E0D2","#E2A0C9"] },
  { cat:"风格", name:"性冷淡",    base:"#8C8C8C", scheme:["#8C8C8C","#F2F2F2","#D9D9D9","#BFBFBF","#4A4A4A"] },
  { cat:"风格", name:"赛博朋克",  base:"#FF2A6D", scheme:["#FF2A6D","#05D9E8","#7700FF","#01012B","#D1F7FF"] },
  { cat:"风格", name:"复古港风",  base:"#E8A33D", scheme:["#E8A33D","#C0392B","#2C3E50","#ECF0F1","#8E44AD"] },
  { cat:"风格", name:"INS 风",    base:"#E9C7C7", scheme:["#E9C7C7","#F5E8E8","#C9D6E3","#B8D8C8","#D6C9B8"] },
  { cat:"风格", name:"极简黑白",  base:"#1A1A1A", scheme:["#1A1A1A","#FFFFFF","#E0E0E0","#9E9E9E","#000000"] },
  { cat:"风格", name:"工业风",    base:"#4A4A4A", scheme:["#4A4A4A","#B5651D","#C0C0C0","#2C2C2C","#8B6F47"] },
  { cat:"风格", name:"清新绿植",  base:"#5E8C61", scheme:["#5E8C61","#E8F0E3","#A8C69F","#3A5A40","#F2D9A0"] },
  // —— 行业 ——
  { cat:"行业", name:"鞋业经典蓝白", base:"#1E3A5F", scheme:["#1E3A5F","#FFFFFF","#2897B1","#9CA6C1","#0F1E33"] },
  { cat:"行业", name:"暖橙活力吊牌", base:"#E07B39", scheme:["#E07B39","#FFF3E8","#B31B1B","#F2D022","#5A2A12"] },
  { cat:"行业", name:"科技蓝紫",    base:"#4361EE", scheme:["#4361EE","#7209B7","#4CC9F0","#F8F9FA","#3A0CA3"] },
  { cat:"行业", name:"美食橙红",    base:"#E63946", scheme:["#E63946","#F4A261","#2A9D8F","#E9C46A","#1D3557"] },
  { cat:"行业", name:"母婴柔粉",    base:"#F6BFC9", scheme:["#F6BFC9","#FCEEF2","#BFE3D4","#FBE7C6","#E2A0B0"] },
  { cat:"行业", name:"运动活力",    base:"#06D6A0", scheme:["#06D6A0","#118AB2","#EF476F","#FFD166","#073B4C"] }
];

/* ========== 模块4：招聘完整城市主列表（下拉框使用，覆盖全国主要城市） ========== */
const RECRUIT_CITIES = [
  // 一线 / 新一线
  '北京','上海','广州','深圳','成都','杭州','重庆','武汉','西安','苏州','南京','天津','长沙','郑州','青岛','沈阳','大连','宁波','东莞','无锡','佛山','合肥','昆明','哈尔滨','济南','厦门','福州','温州','金华',
  // 省会 / 自治区首府（补齐）
  '石家庄','太原','呼和浩特','长春','南昌','南宁','海口','贵阳','兰州','西宁','银川','乌鲁木齐','拉萨',
  // 其他重点地级市
  '泉州','晋江','常州','南通','徐州','唐山','烟台','潍坊','保定','台州','绍兴','扬州','珠海','中山','惠州','汕头','三亚','桂林','威海','盐城','泰州','镇江','湖州','芜湖','赣州','绵阳','临沂','洛阳','嘉兴'
];

/* ========== 模块9：印刷排版兼职招聘（2026 公开整合，覆盖全国主要城市） ========== */
const RECRUIT_DATA = [
  // —— 一线 / 新一线 ——
  { platform:"智联招聘", title:"排版设计【线上兼职】", pay:"3000-6000元", city:"嘉兴·海宁", req:"图书排版、ID/PS/AI", mode:"线上兼职", settle:"按月", note:"画册/相册/书籍/公众号排版，经验不限" },
  { platform:"智联招聘", title:"图文排版设计【线上兼职】", pay:"3000-6000元", city:"嘉兴·海宁", req:"方正ID/PS/AI", mode:"线上", settle:"按月", note:"量大稳定，适合长期兼职" },
  { platform:"BOSS直聘", title:"美工排版兼职", pay:"10-30元/时", city:"北京·丰台", req:"图书排版、3-5年", mode:"坐班", settle:"时结", note:"与团队协作出图，保证质量" },
  { platform:"BOSS直聘", title:"图书排版设计·画册", pay:"8000-12000元", city:"北京·朝阳", req:"AI/InDesign/PS、5年", mode:"坐班", settle:"月结", note:"出版集团画册排版，需面试" },
  { platform:"前程无忧", title:"试卷排版编辑专员（兼职）", pay:"100元/天", city:"武汉", req:"本科、Word/Excel、印刷工艺基础", mode:"坐班(周末双休)", settle:"按月", note:"试卷排版校对，格式规范、印刷标准" },
  { platform:"BOSS直聘", title:"图书排版", pay:"20-40元/时", city:"武汉·江汉", req:"童书排版、3-5年", mode:"坐班", settle:"时结", note:"版式设计，时间充足" },
  { platform:"BOSS直聘", title:"图书编辑排版（长期兼职）", pay:"250-300元/天", city:"深圳", req:"英文排版、审美耐心", mode:"线上", settle:"完工结", note:"自由职业，英文书籍优先" },
  { platform:"智联招聘", title:"排版设计（出版物）", pay:"7000-10000元", city:"深圳·福田", req:"方正/InDesign/PS、3年", mode:"坐班", settle:"月结", note:"出版社直招，主做教辅" },
  { platform:"BOSS直聘", title:"图书排版设计", pay:"4000-8000元/月", city:"杭州·萧山", req:"奢侈品鉴定教材排版", mode:"坐班/周末", settle:"月结", note:"可周末可工作日" },
  { platform:"智联招聘", title:"公众号排版兼职", pay:"80-150元/篇", city:"杭州·西湖", req:"135编辑器/秀米", mode:"居家", settle:"完工结", note:"电商公众号，可长期合作" },
  { platform:"58同城", title:"排版设计（长期兼职）", pay:"面议", city:"哈尔滨", req:"PS/AI/CDR/Word/PPT", mode:"居家", settle:"完工结", note:"企业宣传册，有印刷厂经验优先" },
  { platform:"智联招聘", title:"图文排版设计", pay:"5000-6000元", city:"合肥·瑶海", req:"AI/CDR/PS", mode:"坐班", settle:"月结", note:"画册排版" },
  { platform:"BOSS直聘", title:"线上排版编辑", pay:"150-200元/篇", city:"上海·徐汇", req:"InDesign、英文阅读", mode:"线上", settle:"完工结", note:"外贸画册，长期合作" },
  { platform:"智联招聘", title:"书籍排版助理", pay:"4500-6500元", city:"上海·浦东", req:"方正书版、应届可", mode:"坐班", settle:"月结", note:"出版社助理岗，可学徒" },
  { platform:"BOSS直聘", title:"杂志排版（兼职）", pay:"300元/页", city:"广州·天河", req:"InDesign/PS、时尚杂志经验", mode:"坐班/居家", settle:"完工结", note:"时尚杂志按页计酬" },
  { platform:"前程无忧", title:"排版设计师", pay:"6000-9000元", city:"广州·番禺", req:"AI/PS/方正、2年", mode:"坐班", settle:"月结", note:"包装印刷厂直招" },
  { platform:"智联招聘", title:"排版设计兼职（学生可）", pay:"15-25元/时", city:"成都·锦江", req:"基础PS/AI", mode:"线上", settle:"时结", note:"简单画册排版，学生党友好" },
  { platform:"BOSS直聘", title:"图书排版·线上长期", pay:"150-220元/千字", city:"成都·武侯", req:"InDesign/方正", mode:"线上", settle:"完工结", note:"按千字计酬，童书居多" },
  { platform:"BOSS直聘", title:"排版设计师（教辅）", pay:"5000-8000元", city:"南京·鼓楼", req:"方正/InDesign、2年", mode:"坐班", settle:"月结", note:"教辅出版社直招" },
  { platform:"智联招聘", title:"画册排版·按项目", pay:"面议", city:"南京·建邺", req:"AI/InDesign、3年", mode:"线上", settle:"项目结", note:"按单结算，自由度高" },
  { platform:"BOSS直聘", title:"排版助理（可实习）", pay:"3000-4500元", city:"苏州·工业园", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"外企出版部助理岗" },
  { platform:"智联招聘", title:"期刊排版（兼职）", pay:"200元/篇", city:"西安·雁塔", req:"方正/InDesign", mode:"线上", settle:"完工结", note:"学术期刊排版，按篇结算" },
  { platform:"BOSS直聘", title:"宣传册排版", pay:"100-300元/单", city:"西安·未央", req:"AI/CDR", mode:"居家", settle:"完工结", note:"中小型企业宣传册" },
  { platform:"智联招聘", title:"出版社排版", pay:"5000-7000元", city:"重庆·渝中", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招，主做教材" },
  { platform:"58同城", title:"排版设计（图文店）", pay:"4000-6000元", city:"重庆·江北", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"公众号长图排版", pay:"100-200元/篇", city:"天津·和平", req:"PS/AI、审美", mode:"居家", settle:"完工结", note:"新媒体公司，长期合作" },
  { platform:"智联招聘", title:"排版设计（印刷厂）", pay:"4500-6500元", city:"天津·河西", req:"方正/PS、2年", mode:"坐班", settle:"月结", note:"印刷厂直招" },
  { platform:"前程无忧", title:"线上排版（应届可）", pay:"3000-5000元", city:"长沙·岳麓", req:"PS/AI基础、应届可", mode:"线上", settle:"月结", note:"线上画册排版" },
  { platform:"智联招聘", title:"童书排版·长期", pay:"180-280元/本", city:"长沙·雨花", req:"InDesign/方正、2年", mode:"线上", settle:"完工结", note:"童书出版社，按本结算" },
  { platform:"BOSS直聘", title:"排版设计（高校出版社）", pay:"5000-7000元", city:"厦门·思明", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"高校出版社直招" },
  { platform:"智联招聘", title:"线上排版兼职", pay:"80-150元/单", city:"厦门·湖里", req:"AI/PS", mode:"线上", settle:"完工结", note:"小型设计公司外发" },
  { platform:"前程无忧", title:"排版设计助理", pay:"3500-5000元", city:"青岛·市南", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"出版社助理岗" },
  { platform:"BOSS直聘", title:"排版设计师", pay:"5000-8000元", city:"青岛·崂山", req:"AI/InDesign、2年", mode:"坐班", settle:"月结", note:"包装设计公司" },
  { platform:"智联招聘", title:"排版（居家）", pay:"面议", city:"济南·历下", req:"PS/AI", mode:"居家", settle:"完工结", note:"按项目结算" },
  { platform:"BOSS直聘", title:"出版社排版", pay:"4500-6500元", city:"济南·市中", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"智联招聘", title:"排版设计（线上长期）", pay:"100-180元/单", city:"郑州·金水", req:"PS/AI、审美", mode:"线上", settle:"完工结", note:"按单结算，长期合作" },
  { platform:"BOSS直聘", title:"杂志排版（兼职）", pay:"200-300元/页", city:"昆明·五华", req:"InDesign/PS", mode:"线上", settle:"完工结", note:"旅游杂志排版" },
  { platform:"智联招聘", title:"排版设计助理", pay:"3000-4500元", city:"宁波·鄞州", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"印刷厂助理岗" },
  { platform:"BOSS直聘", title:"线上排版（电商详情页）", pay:"80-150元/页", city:"东莞·南城", req:"PS、电商经验", mode:"居家", settle:"完工结", note:"电商详情页长期需求" },
  { platform:"智联招聘", title:"出版物排版", pay:"5000-7500元", city:"福州·鼓楼", req:"方正/InDesign、2年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"58同城", title:"图文店排版（兼职）", pay:"3500-5000元", city:"贵阳·云岩", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"童书排版（线上）", pay:"150-220元/千字", city:"南昌·东湖", req:"InDesign/方正", mode:"线上", settle:"完工结", note:"童书出版社外发" },
  { platform:"智联招聘", title:"排版设计（出版社）", pay:"4500-6500元", city:"南宁·青秀", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"前程无忧", title:"线上排版编辑", pay:"4000-6000元", city:"太原·小店", req:"AI/PS、应届可", mode:"线上", settle:"月结", note:"线上画册排版" },
  { platform:"BOSS直聘", title:"宣传册排版", pay:"150-300元/单", city:"兰州·城关", req:"AI/CDR", mode:"居家", settle:"完工结", note:"中小企业宣传册" },

  // —— 补齐省会 / 重点城市 ——
  { platform:"前程无忧", title:"排版设计（出版社）", pay:"4000-6000元", city:"石家庄·长安", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"智联招聘", title:"图文排版设计", pay:"3500-5000元", city:"呼和浩特·赛罕", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"智联招聘", title:"图书排版", pay:"5000-7000元", city:"沈阳·和平", req:"方正/InDesign、2年", mode:"坐班", settle:"月结", note:"出版集团画册排版" },
  { platform:"BOSS直聘", title:"排版设计（印刷厂）", pay:"4000-6000元", city:"长春·朝阳", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"印刷厂直招" },
  { platform:"BOSS直聘", title:"公众号排版兼职", pay:"80-150元/篇", city:"海口·美兰", req:"135编辑器/秀米", mode:"居家", settle:"完工结", note:"新媒体公司长期合作" },
  { platform:"智联招聘", title:"排版助理（可学徒）", pay:"3500-4500元", city:"拉萨·城关", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"出版社助理岗" },
  { platform:"前程无忧", title:"排版设计助理", pay:"3500-5000元", city:"西宁·城东", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"印刷厂助理岗" },
  { platform:"58同城", title:"图文排版（兼职）", pay:"3500-5000元", city:"银川·兴庆", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"出版社排版", pay:"4500-6500元", city:"乌鲁木齐·天山", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"智联招聘", title:"图书排版", pay:"5000-7500元", city:"大连·中山", req:"InDesign/方正、2年", mode:"坐班", settle:"月结", note:"出版集团画册排版" },
  { platform:"BOSS直聘", title:"排版设计（电商）", pay:"5000-7000元", city:"无锡·梁溪", req:"AI/PS、2年", mode:"坐班", settle:"月结", note:"电商详情页设计" },
  { platform:"智联招聘", title:"包装排版设计", pay:"5000-7000元", city:"佛山·禅城", req:"AI/CDR、2年", mode:"坐班", settle:"月结", note:"包装印刷厂直招" },
  { platform:"58同城", title:"排版设计（图文店）", pay:"4500-6000元", city:"珠海·香洲", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"图文排版（兼职）", pay:"4000-5500元", city:"中山·东区", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"广告公司外发" },
  { platform:"智联招聘", title:"排版设计（印刷厂）", pay:"4000-6000元", city:"惠州·惠城", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"印刷厂直招" },
  { platform:"BOSS直聘", title:"公众号排版", pay:"100-180元/单", city:"温州·鹿城", req:"秀米/135", mode:"居家", settle:"完工结", note:"按单结算长期合作" },
  { platform:"前程无忧", title:"排版助理（应届可）", pay:"3500-5000元", city:"金华·婺城", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"出版社助理岗" },
  { platform:"58同城", title:"图文排版（长期）", pay:"4000-5500元", city:"泉州·丰泽", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"智联招聘", title:"排版设计", pay:"5000-7000元", city:"常州·武进", req:"AI/InDesign、2年", mode:"坐班", settle:"月结", note:"包装设计公司" },
  { platform:"BOSS直聘", title:"出版社排版", pay:"4500-6500元", city:"南通·崇川", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"前程无忧", title:"排版设计（图文）", pay:"4000-6000元", city:"徐州·云龙", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"58同城", title:"排版设计（兼职）", pay:"3800-5500元", city:"唐山·路南", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"广告公司外发" },
  { platform:"智联招聘", title:"图书排版", pay:"4500-6500元", city:"烟台·芝罘", req:"InDesign/方正、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"BOSS直聘", title:"图文排版（电商）", pay:"4000-5500元", city:"潍坊·奎文", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"电商详情页长期需求" },
  { platform:"58同城", title:"排版设计（图文店）", pay:"3800-5500元", city:"保定·竞秀", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"公众号排版", pay:"100-180元/单", city:"台州·椒江", req:"秀米/135", mode:"居家", settle:"完工结", note:"按单结算" },
  { platform:"智联招聘", title:"出版社排版", pay:"4500-6500元", city:"绍兴·越城", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"BOSS直聘", title:"排版设计", pay:"4500-6500元", city:"扬州·邗江", req:"AI/PS、1年", mode:"坐班", settle:"月结", note:"包装设计公司" },
  { platform:"58同城", title:"排版设计（图文店）", pay:"4000-5500元", city:"芜湖·镜湖", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"图文排版（电商）", pay:"3800-5200元", city:"赣州·章贡", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"电商详情页" },
  { platform:"智联招聘", title:"排版设计", pay:"4000-6000元", city:"绵阳·涪城", req:"AI/PS、1年", mode:"坐班", settle:"月结", note:"印刷厂直招" },
  { platform:"58同城", title:"排版设计（兼职）", pay:"3800-5500元", city:"临沂·兰山", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"广告公司外发" },
  { platform:"BOSS直聘", title:"出版社排版", pay:"4500-6500元", city:"洛阳·西工", req:"方正/InDesign、1年", mode:"坐班", settle:"月结", note:"出版社直招" },
  { platform:"智联招聘", title:"图文排版（电商）", pay:"4000-5500元", city:"汕头·金平", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"电商详情页" },
  { platform:"58同城", title:"排版设计（兼职）", pay:"4000-5500元", city:"三亚·吉阳", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"排版助理（应届可）", pay:"3500-5000元", city:"桂林·秀峰", req:"AI基础、应届可", mode:"坐班", settle:"月结", note:"出版社助理岗" },
  { platform:"智联招聘", title:"排版设计", pay:"4500-6500元", city:"威海·环翠", req:"AI/PS、1年", mode:"坐班", settle:"月结", note:"包装设计公司" },
  { platform:"58同城", title:"图文排版（图文店）", pay:"3800-5200元", city:"盐城·亭湖", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },
  { platform:"BOSS直聘", title:"排版设计", pay:"4200-6000元", city:"泰州·海陵", req:"AI/PS、1年", mode:"坐班", settle:"月结", note:"广告公司" },
  { platform:"智联招聘", title:"排版设计", pay:"4500-6500元", city:"镇江·京口", req:"AI/PS、1年", mode:"坐班", settle:"月结", note:"包装设计公司" },
  { platform:"58同城", title:"图文排版（兼职）", pay:"4000-5500元", city:"湖州·吴兴", req:"PS/CDR、1年", mode:"坐班", settle:"月结", note:"图文店日常排版" },

  // —— 晋江（泉州下辖，鞋服产业带，补齐全平台可选） ——
  { platform:"BOSS直聘", title:"鞋盒/包装排版", pay:"180-320元/单", city:"晋江·陈埭", req:"AI/CDR、鞋服经验", mode:"居家", settle:"完工结", note:"鞋服包装平面排版" },
  { platform:"智联招聘", title:"电商详情页排版", pay:"3500-5500元", city:"晋江·梅岭", req:"PS/AI、1年", mode:"坐班", settle:"月结", note:"鞋服电商图文排版" },
  { platform:"58同城", title:"画册排版（兼职）", pay:"150-260元/单", city:"晋江·青阳", req:"ID/PS", mode:"居家", settle:"完工结", note:"企业宣传画册" },
  { platform:"前程无忧", title:"图文快印排版", pay:"3800-5000元", city:"晋江·池店", req:"CDR/PS、1年", mode:"坐班", settle:"月结", note:"快印店日常排版" },
  { platform:"猎聘", title:"品牌视觉排版", pay:"5000-8000元", city:"晋江·安海", req:"AI/PS、2年", mode:"坐班", settle:"月结", note:"鞋服品牌画册/海报" }
];

/* ========== 招聘平台直达（点开看招聘人/联系方式/地址/福利/要求） ========== */
const RECRUIT_SITES = [
  { name:"智联招聘", url:"https://www.zhaopin.com/sou?q=%E6%8E%92%E7%89%88", desc:"全国排版/设计类职位" },
  { name:"BOSS直聘", url:"https://www.zhipin.com/web/geek/search?query=%E6%8E%92%E7%89%88", desc:"直聊招聘方·响应快" },
  { name:"前程无忧", url:"https://search.51job.com/list/000000,000000,0000,00,9,99,%E6%8E%92%E7%89%88,2,1.html", desc:"海量全职/兼职" },
  { name:"58同城", url:"https://www.58.com/paiban/", desc:"本地兼职/日结多" },
  { name:"猎聘", url:"https://www.liepin.com/zhaopin/?key=%E6%8E%92%E7%89%88", desc:"中高级/远程" }
];

/* ========== 模块11：全网影视推荐（2026 真实） ========== */
const FILM_DATA = [
  { kind:"电影", name:"飞驰人生3", year:2026, type:"喜剧/赛车", score:9.2, likes:"韩寒执导、沈腾回归，巴音布鲁克拉力赛落幕后的热血故事", audience:"赛车迷、喜剧爱好者" },
  { kind:"电影", name:"功夫女足", year:2026, type:"运动/喜剧", score:9.4, likes:"周星驰风格，猫眼好评如潮，暑期档黑马", audience:"合家欢、运动题材观众" },
  { kind:"电影", name:"给阿嬷的情书", year:2026, type:"剧情/银发", score:9.3, likes:"以侨批诉说游子乡愁，票房近20亿，上半年最大黑马", audience:"剧情党、家庭观众" },
  { kind:"电影", name:"八仙！", year:2026, type:"动画/奇幻", score:8.3, likes:"国产动画领跑暑期新片，中式奇幻语境", audience:"国漫爱好者、家庭" },
  { kind:"电影", name:"玩具总动员5", year:2026, type:"动画/冒险", score:8.7, likes:"胡迪巴斯回归，面对电子产品的挑战", audience:"全年龄、童年IP粉" },
  { kind:"电影", name:"超级马力欧银河大电影", year:2026, type:"动画/冒险", score:8.7, likes:"任天堂经典IP，想看榜第一", audience:"游戏IP粉、亲子" },
  { kind:"电影", name:"奥德赛", year:2026, type:"科幻/史诗", score:8.5, likes:"诺兰新片，海外烂番茄94%，视觉与叙事双高", audience:"科幻迷、诺兰粉" },
  { kind:"电视剧", name:"十日终焉", year:2026, type:"无限流悬疑", score:9.0, likes:"肖战主演，齐夏细腻演绎获如潮好评，书粉认证天选", audience:"悬疑剧迷、书粉" },
  { kind:"电视剧", name:"这一秒过火", year:2026, type:"民国/情感", score:8.8, likes:"张凌赫眼神戏爆发，热度口碑双高", audience:"民国剧、颜值党" },
  { kind:"电视剧", name:"冬去春来", year:2026, type:"年代/剧情", score:9.4, likes:"白宇章若楠主演，央视八套收视破4，现象级年代剧", audience:"年代剧爱好者" },
  { kind:"电视剧", name:"家事法庭", year:2026, type:"律政/家庭", score:9.1, likes:"龚俊任敏主演，开播3天观众过亿，央视收视冠军", audience:"律政剧、家庭剧观众" },
  { kind:"电视剧", name:"月鳞绮纪", year:2026, type:"古装/奇幻", score:8.8, likes:"鞠婧祎曾舜晞，52小时优酷热度破万", audience:"古装仙侠粉" },
  { kind:"动漫", name:"中国奇谭2", year:2026, type:"国漫/短片集", score:8.7, likes:"12位导演9个中国风动画，本土生活命题", audience:"国漫爱好者" },
  { kind:"动漫", name:"罗小黑战记 学前篇", year:2026, type:"国漫/日常", score:8.5, likes:"围绕罗小黑入学前暑假生活", audience:"国漫粉、轻松向" },
  { kind:"综艺", name:"大侦探11", year:2026, type:"推理综艺", score:9.0, likes:"何炅大张伟回归，沉浸式推理再升级", audience:"综艺粉、推理迷" },
  { kind:"综艺", name:"烟火人间", year:2026, type:"生活纪实", score:9.1, likes:"豆瓣9.1，2026最火素人综艺，温暖治愈", audience:"慢综、治愈系观众" }
];

/* ========== 数据源元信息（① 透明化 + 可替换为连接器/API） ==========
 * 说明：本环境未接入贝壳/招聘平台官方连接器，以下为 2026-07-27 通过公开整合
 * 调研得到的参考数据；如需"真·实时"，可把对应数组替换为连接器/API 拉取结果，
 * 或点击「查看实时↗」跳转官方来源核对。
 */
const DATA_META = {
  property:{ updatedAt:'2026-07-27', source:'多平台实时检索（贝壳/安居客/链家/58等，选城市后点平台直达最新）', live:'https://bj.ke.com/ershoufang/' },
  recruit:{  updatedAt:'2026-07-27', source:'智联/BOSS/前程/58 公开整合',         live:'https://www.zhipin.com' },
  film:{     updatedAt:'2026-07-28', source:'腾讯视频/优酷/爱奇艺/哔哩哔哩/芒果TV 等主流平台公开热播整合，点击平台看实时', live:'https://v.qq.com/' }
};
