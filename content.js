// 在这里填写资料。保留英文引号和逗号，文字写在引号内。
// 多段文字可以用 \n 换行。路径也使用 /，例如 media/film-01.mp4。
window.portfolio = {
  name: "余珮格 Peige Yu",
  about: "余珮格是一位专注于互动叙事与视觉的设计师，擅长构思有活力的叙事，突出其中的乐趣，并将其转化为具体的画面和互动体验。她的主要项目涵盖叙事游戏、影像、互动装置等。具备故事脚本、美术设计、动画制作与交互原型搭建的经验。\n\n在技术工具上，她通常使用Unity、Unreal Engine、Godot及TouchDesigner等交互引擎，并能将Codex、Claude、Midjourney等AI工具融入工作流，辅助代码编写与美术资产生成。有较强的英语能力可适应国际化团队沟通。\n\n她本科毕业于中央美术学院艺术与科技专业（获优秀毕业生、保送研究生资格），目前正在伦敦大学学院（UCL）攻读数字媒体制作硕士。",
  email: "pegeyue@gmail.com",
  phone: "+86 15880217933",
  portfolioPdf: "files/portfolio.pdf?v=142a1d0918",
  wechat: "",
  works: [
    {
      id: "work-02",
      title: "框子里",
      titleEn: "A Day in Frame",
      year: "2026",
      duration: "02:24",
      cover: "images/a-day-in-frame.png",
      poster: "images/video-poster-gray.svg?v=f046ccd24c",
      background: { src: "images/backgrounds/a-day-in-frame.webp", tone: "light" },
      video: "media/a-day-in-frame.mp4",
      role: "游戏概念构思、玩法设计、机制设计、2D场景程序制作、3D交互程序制作（合作）、2D与3D场景美术设计",
      medium: "数字游戏设计",
      description: "玩家用一台相机，抓住房间中的某变化。咔！从现实中捕捉小东西，一点点筑造出这个微观世界。这些“somewhat”......它们在这个小小的2D世界里互相互动，随着时间不断变化。一闪而过的变化、环境的氛围，都是可拍摄的对象。重新游玩摄影的乐趣。",
      images: []
    },
    {
      id: "work-01",
      title: "旅行故事",
      titleEn: "Travel Stories",
      year: "2026",
      duration: "02:27", // 例如 02:30
      cover: "images/travel-stories.png", // 封面路径，例如 images/cover-01.jpg
      background: { src: "images/backgrounds/travel-stories.webp", tone: "night" },
      video: "media/travel-stories.mp4", // 视频路径，例如 media/film-01.mp4，或 HTTPS 视频直链。
      role: "动画3D美术设计、脚本设计、AI辅助脚本制作、渲染、沟通交付", // 例如 导演、摄影、剪辑
      medium: "装置影像设计", // 例如 短片、三维动画
      description: "Skyframe Awards 2026 是由 The Story Engineers 主办，面向数字艺术家的创作活动，以“Depth and Light”为主题，为180平方米的悬吊式 LED 天顶屏幕制作原创数字影像。五位创作者入选，作品展出于伦敦金融城 Fen Court 的 Hogarth Court。",
      images: [] // 详情图：[{ src: "images/detail-01.jpg", caption: "图片说明" }]
    },
    {
      id: "work-03",
      title: "基克拉德斯群岛的女巫生态箱",
      titleEn: "The Witch's Terrarium of the Cyclades",
      year: "2026",
      duration: "03:35",
      cover: "images/witch-ecosystem.png",
      background: { src: "images/backgrounds/witch-ecosystem.webp", tone: "dark" },
      video: "media/witch-ecosystem.mp4?v=4dc1383bc2",
      videoAspect: "1920 / 1000",
      role: "游戏概念构思、玩法设计、机制设计、2D场景程序开发、2D场景美术设计、音效设计与编辑",
      medium: "数字游戏设计",
      description: "你的女巫姑妈让你帮她打理生态箱。",
      images: []
    },
    {
      id: "work-04",
      title: "负一倍镜",
      titleEn: "Negative 1 FOV",
      year: "2025",
      duration: "04:06",
      cover: "images/negative-1x-cutout.webp",
      poster: "images/video-poster-white.svg",
      background: { src: "images/backgrounds/negative-1x.webp", tone: "light-inset" },
      video: "media/negative-1x.mp4?v=4c4daef89f",
      videoAspect: "1748 / 1080",
      role: "概念设计、骨骼绑定、动画制作、设计图绘制、纹理贴图、交互功能设计、交互机制脚本编写、环境设计与搭建",
      medium: "交互影像/数字游戏设计",
      description: "午睡正酣者的奇思妙想。",
      images: []
    },
    {
      id: "work-06",
      title: "时间",
      titleEn: "Time",
      year: "2023",
      duration: "01:06",
      cover: "images/time.png",
      background: { src: "images/backgrounds/time.webp", tone: "dark" },
      video: "media/time.mp4",
      role: "图片生成、视频制作",
      medium: "实验影像设计",
      description: "这部实验性视频尝试探索生成式人工智能工具对图像文化——对视觉形式的组织方面——可能产生的影响。生成式人工智能显著降低了数字图像的创作门槛，互联网上的图像数量激增，同时也削弱了图像的可信度。图像正经历一种“文本化”。\n\n与这种图像体验形成鲜明对比的，是电影中的长镜头。以法国新浪潮电影为例，长镜头通过延长拍摄时长并最大限度地减少剪辑干预，保留了时空的连续性。我以“时间”（Time）为提示词，利用人工智能图像生成工具，对电影《日以继夜》（Day for Night）开场那段时长1分30秒的长镜头中的每一帧进行了重构；通过这种方式，我将原本强调连续与纪实的叙事，转化为一种破碎的视觉体验，借此制造一种关于时间与连续性的乐趣。",
      images: []
    },
    {
      id: "work-05",
      title: "余数",
      titleEn: "The Remainder",
      year: "2023",
      duration: "01:34",
      cover: "images/remainder-cutout.webp",
      poster: "images/video-poster-gray.svg?v=f046ccd24c",
      background: { src: "images/backgrounds/remainder.webp", tone: "white" },
      video: "media/remainder.mp4?v=9e49c6ebad",
      role: "参与2D美术设计、界面设计",
      medium: "游戏视觉设计",
      description: "这款社会模拟游戏围绕“现在—未来—过去”的三重时间结构展开。通过调整某一特定认知模型的参数，游戏在“未来”重新定义其意义，从而使一种新的秩序得以从“过去”中诞生。",
      images: []
    },
    {
      id: "work-07",
      title: "评论检索器",
      titleEn: "Comment Retriever",
      year: "2022",
      duration: "00:30",
      cover: "images/comment-retriever-cutout.webp",
      poster: "images/video-poster-gray.svg?v=f046ccd24c",
      background: { tone: "white" },
      video: "media/comment-retriever.mp4",
      role: "概念设计、视觉设计、程序制作",
      medium: "交互艺术/界面艺术设计",
      description: "评论检索器借助情绪值在 0 到 1 之间的差异，用一个滑块选中该情绪值的评论展示出来，隔离了发表它的用户，隔离了原帖的语境，以一种陌生的观看方式去重新看这一条孤岛般的评论。由整个界面的动态、数据图表的形态，去联想这条评论作为一句比较单纯的文本背后所卷积着的情感。",
      images: []
    }
  ]
};
