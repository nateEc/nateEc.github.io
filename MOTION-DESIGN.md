# 本地动态展示设计

本轮只在本地修改，不自动提交、推送或部署。

## 动态分工

- 首屏：宽屏、足够高度时，Trace Inspector 随原生滚动横移、放大并淡变为真实 HiPilot 界面。小屏不固定首屏，保持正常阅读。
- 作品放映：HiPilot → Dub Studio → Git Workbench，现有真实截图制作的动态演绎短片，不冒充实际操作录屏。来源见 `public/demos/cinema/README.md`。
- 关于与经历：固定头像、逐条点亮工作原则；经历轴、当前条目的底色与编号跟随阅读位置变化。原有展开操作保持不变。
- 能力模型：交互、执行、验证三个三维平面，随章节持续旋转、拆开、切换高亮层。
- 深度案例：固定演示台搭配四段正文；真实界面动态演绎和明确标注的脱敏示意图分开呈现，底部系统路径由章节进度点亮。
- 归档与文章：截图轻微推移、卡片边缘聚焦、文章阅读下划线。无需劫持滚轮或锁定页面。

## 降级与资源

- `prefers-reduced-motion` 关闭连续运动、固定叙事与视频自动播放，保留完整正文、链接和静态图。
- 章节按钮支持键盘；手机跳转预留演示台的实际高度，避免标题被遮挡。
- 视频离开相应区域或页面隐藏后停止播放；提供手动暂停和静态封面降级。
- 无新增生产依赖；布局通过 CSS 3D、原生滚动、requestAnimationFrame 和 IntersectionObserver 完成。

## 验证

先运行 `npm run check`。浏览器回归脚本为 `scripts/check-motion-browser.mjs`，使用本机 Chrome 与 Playwright：

```sh
PORTFOLIO_URL=http://127.0.0.1:4174/ node scripts/check-motion-browser.mjs
```

如果 Playwright 不在项目依赖中，可通过 `PLAYWRIGHT_MODULE` 指向已有 Playwright 的 `index.mjs`；不要求为生产包添加浏览器测试依赖。截图写入系统临时目录，文件名前缀为 `portfolio-upgrade-`。

脚本覆盖所有能力/案例章节、案例视频自动播放、手机按钮跳转不遮挡标题、横向溢出、中英文切换、深色固定导航、减少动态偏好及运行时异常。视觉检查仍需关注平面构图、短屏和转场节奏。
