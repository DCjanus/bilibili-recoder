import { Downloader } from './downloader';
import * as request from 'request-promise-native';

/**
 * 示例
 */
async function main() {
    const url        = 'https://live.bilibili.com/3556263';
    const downloader = await Downloader.new(url);
    const res        = await downloader.download();
    console.log("下载完成");
}

main();
