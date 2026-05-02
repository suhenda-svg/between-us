# Between Us PWA

这是按照高保真原型方向整理的 PWA 版本，包含：

- Home：纪念天数、今日记录、预算概览、相册预览
- Record：新增记录、搜索、点赞、删除、图片附件
- Album：新增照片、预览照片、删除照片
- Budget：预算进度、分类筛选、新增支出、删除支出
- Memos：新增备忘、搜索、勾选完成、删除
- 本地持久化：数据保存到浏览器 localStorage
- PWA：manifest、图标、service worker、离线缓存、手机添加到主屏幕

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的地址，例如：

```text
http://localhost:5173/
```

## 打包

```bash
npm run build
npm run preview
```

## 部署成手机可安装版本

把项目上传到 GitHub 后，可用 Vercel / Netlify / Cloudflare Pages 部署。

部署后用手机打开 HTTPS 地址：

- iPhone：Safari → 分享 → 添加到主屏幕
- Android：Chrome → 安装应用 / 添加到主屏幕

## 后续可升级

如果要做情侣双端同步，需要继续增加：

- 登录/注册
- 情侣绑定码
- 云数据库
- 图片云存储
- 权限和隐私政策
