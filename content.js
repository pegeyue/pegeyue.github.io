// 在这里填写资料。保留英文引号和逗号，文字写在引号内。
// 多段文字可以用 \n 换行。路径也使用 /，例如 media/film-01.mp4。
window.portfolio = {
  name: "Your Name 你的姓名",
  about: "个人简介待补充。",
  cvFile: "", // 简历文件，例如 files/cv.pdf；留空时隐藏下载按钮。
  cv: [
    { heading: "Education / 教育经历", entries: [] },
    { heading: "Experience / 项目与工作经历", entries: [] },
    { heading: "Skills / 专业技能", entries: [] }
  ],
  // entries 的写法：[{ date: "2026", title: "学校或项目名称", detail: "补充说明" }]
  contactIntro: "欢迎联系。",
  email: "",
  wechat: "",
  works: [
    {
      id: "work-01",
      title: "旅行故事",
      year: "",
      duration: "02:27", // 例如 02:30
      cover: "images/travel-stories.jpg", // 封面路径，例如 images/cover-01.jpg
      video: "media/travel-stories.mp4", // 视频路径，例如 media/film-01.mp4，或 HTTPS 视频直链。
      role: "", // 例如 导演、摄影、剪辑
      medium: "", // 例如 短片、三维动画
      description: "",
      images: [] // 详情图：[{ src: "images/detail-01.jpg", caption: "图片说明" }]
    },
    { id: "work-02", title: "框子里", year: "", duration: "02:24", cover: "images/a-day-in-frame.jpg", video: "media/a-day-in-frame.mp4", role: "", medium: "", description: "", images: [] },
    { id: "work-03", title: "基克拉德斯群岛的女巫生态箱", year: "", duration: "03:35", cover: "images/witch-ecosystem.jpg", video: "media/witch-ecosystem.mp4", role: "", medium: "", description: "", images: [] },
    { id: "work-04", title: "负一倍镜", year: "", duration: "04:06", cover: "images/negative-1x.jpg", video: "media/negative-1x.mp4", role: "", medium: "", description: "", images: [] },
    { id: "work-05", title: "余数", year: "", duration: "01:36", cover: "images/remainder.jpg", video: "media/remainder.mp4", role: "", medium: "", description: "", images: [] },
    { id: "work-06", title: "时间", year: "", duration: "01:06", cover: "images/time.jpg", video: "media/time.mp4", role: "", medium: "", description: "", images: [] },
    { id: "work-07", title: "评论检索器", year: "", duration: "00:30", cover: "images/comment-retriever.jpg", video: "media/comment-retriever.mp4", role: "", medium: "", description: "", images: [] }
  ]
};
