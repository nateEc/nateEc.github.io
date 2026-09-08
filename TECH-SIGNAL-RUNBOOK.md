# Tech Signal 日更运行手册

## 当前运行方式

- 发布任务：`ddc4746f1b10`，每天北京时间 11:30，保留 `no_agent=true`；不依赖 LLM 是否可用。
- 11:00 的 AI、HN + TechCrunch 简报任务保持原有时间；发布任务自行重新抓取，不依赖简报生成或消息投递成功。
- 专用目录：`~/.hermes/workspaces/portfolio-tech-signal`，跟踪远端 `main`。
- 开发目录仍用于本地预览，不会被日更任务 stash、提交或推送。
- Hermes 入口：`~/.hermes/scripts/{publish-tech-news.py,sync-tech-news.py,ai_digest_zh.py,hacker_news_digest.py}`，仅启动专用目录中的同名版本化脚本。
- Node 固定为 `~/.nvm/versions/node/v22.22.1/bin`，避免使用依赖已失效 ICU 的 Homebrew Node。升级时显式验证并更新 `PORTFOLIO_NODE_BIN`。
- 专用目录须包含 `.git/tech-signal-publisher` 所有权标记；普通开发目录不允许自动恢复文件。

## 发布链路与保护

1. 取得 `.git/tech-signal.lock` 文件锁；另一个发布进程仍在执行时拒绝重入。
2. 检查专用目录和 `main`，拒绝非新闻文件的脏改动。前次中断留下的未提交快照先备份到 `.git/tech-news-recovery.json`，再恢复已提交版本。
3. 拉取远端，正常更新直接 fast-forward。仅包含新闻快照的待推送提交可以 rebase 后重试推送；冲突会中止 rebase 并保留提交，绝不 force push。
4. 如果今天已有完整的已提交快照，直接核对线上版本，避免重复生成和提交。否则按 Node 版本和 lockfile 指纹安装依赖。
5. 抓取三个来源。每次 HTTP 请求最多两次尝试、单次 socket 超时最多 10 秒；整个 digest 最多两次尝试。HN RSS 失败或返回空内容时改用 [HN 官方 API](https://github.com/HackerNews/API)。可选文章摘要和热度补充使用有上限的并发，失败保留来源已有摘要。
6. 同时校验来源错误、非空条目、三个不同来源、HTTPS 链接、标题及时间戳。验证通过后先写同目录临时文件、`fsync`，再原子替换；失败不会覆盖旧快照。不把昨天的数据伪装成今天。
7. 运行 `npm run check`。只提交 `public/tech-news/latest.json`，提交使用 Conventional Commits 中文标题和非空中文正文，推送最多三次。
8. 等待 GitHub Pages，最长 10 分钟。优先核对线上完整快照的日期和生成时间戳，每次探测使用不同查询值避免旧缓存。如果本机遇到 DNS/TLS 等连接故障，可以改用 [GitHub 官方部署 API](https://docs.github.com/en/rest/deployments/deployments)：必须同时匹配本次完整 commit SHA、`main`、`github-pages` 环境成功状态，以及 `.github/workflows/pages.yml` 工作流成功结果。日志明确注明“GitHub 已确认部署，但本机 HTTP 可达性未核验”，不把它说成在线内容直读验证。可达但返回错误状态、空数据、过期数据的页面不能走该替代路径。部署超时保留提交供下次核验，不回滚远端或掩盖错误。

## 日常检查与重跑

```bash
hermes cron status
hermes cron runs ddc4746f1b10 --limit 5
hermes cron run ddc4746f1b10
```

`run` 只触发指定任务，CLI 会报告立即执行、后台执行或等待下一次 scheduler tick；不更改每天 11:30 的计划。不要用全局 `tick` 强制运行其他任务。

本地回归检查（使用可工作的 Node）：

```bash
cd ~/.hermes/workspaces/portfolio-tech-signal
export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"
PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_tech_news.py
npm run check
```

回归测试使用临时 Git 仓库和模拟 HTTP，不推送真实远端。实际任务日志在 `~/.hermes/cron/output/ddc4746f1b10/`。任务执行失败和通知渠道投递失败是两件不同的事，应分别查看状态。

## 恢复与边界

- 若网络或来源持续故障，旧页面继续可用，任务应诚实报错；网络恢复后用上面的 `run` 重试。
- 2026-09-08 实测，本机曾将站点域名解析到 `sinkhole.paloaltonetworks.com`，出现 TLS EOF。脚本不会修改 DNS、启用代理或绕过网络安全策略；仅在可访问的 GitHub 官方控制面核验部署。若 GitHub API 也不可用，则继续重试并最终报告未完成核验。
- Git 冲突或专用目录出现非新闻修改时，先保留现场，人工检查；不要删除改动、清空仓库或强推。与开发目录无关，不要要求先发布本地功能。
- 更换机器时先克隆远端到专用目录，配置 Git 身份和认证、安装指定 Node、创建所有权标记，再安装薄入口并设置任务 workdir。不要将整个 `~/.hermes` 或凭证提交到仓库。
- 本次切换前的四个 Hermes 脚本和发布任务配置片段保存在 `~/.hermes/backups/tech-signal-20260908/`。需要回退时先停止正在运行的发布进程，检查旧实现的已知缺陷，再恢复对应入口和 workdir；无需回滚已发布的完整新闻。
- 此定时任务依赖本机开机且 Hermes Gateway 运行、可访问新闻来源和 GitHub、Git 认证有效。不能承诺在关机、断网或上游长期故障时仍然发布成功；这些情况下保留有效内容比伪造成功更重要。
