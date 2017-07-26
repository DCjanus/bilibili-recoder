# bilibili直播录制工具

非常喜欢的一个B站UP主现在只直播不发视频了，UP主直播的时间我又总想不起来去看。

于是决定写个可以录制直播视频的脚本，方便随时观看。

# 任务表

- [x] 直播间信息获取
- [x] 直播流URL获取
- [ ] 检测直播流URL是否有效
- [ ] 实时下载直播数据
- [ ] 断线后自动重试

# 使用

本项目使用TypeScript开发，执行以下命令即可安装TypeScript编译环境:
```bash
npm install -g typescript
```

随后运行以下命令即可编译并运行本项目
```bash
npm install
npm start
```