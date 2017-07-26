import { LiveRoomModel } from './live_room_model';
import { UnexpectedResponse } from './exceptions';
import * as fs from 'fs';
import * as http from 'http';
import * as request_raw from 'request';
import * as request from 'request-promise-native';

export class Downloader {
    /**
     * 用于下载直播视频流的工具类
     * @param room_model            直播间model
     */
    private constructor(
        readonly room_model: LiveRoomModel
    ) { }

    /**
     * 创建一个下载工具类
     * @param room_url              目标直播间URL
     */
    static async new(room_url: string) {
        const room_model = await LiveRoomModel.new(room_url);
        return new Downloader(room_model);
    }

    /**
     * 录制直播数据到本地文件中
     * 中途断线会自动重新连接并更换文件
     * 以避免文件格式出错
     */
    async download() {
        while (this.room_model.is_living) {
            try {
                await this.download_worker(fs.createWriteStream(`${this.room_model.author_nick_name}-${this.room_model.room_title}-${new Date().getTime()}.flv`));
                break;
            } catch (e) {
                console.log(e);
                console.log(typeof e);
                this.room_model.refresh_live_state();
                if (this.room_model.is_living) {
                    throw new UnexpectedResponse(this.room_model.video_stream_url);
                }
            }
        }
    }

    /**
     * 将直播流数据写入给定的写入流中
     * @param write_stream          给定的写入流
     */
    private async download_worker(write_stream: fs.WriteStream) {
        return new Promise<http.IncomingMessage>((res, rej) => {
            request_raw
                .get(this.room_model.video_stream_url)
                .on('error', err => rej(err))
                .on('complete', (response) => res(response))
                .pipe(write_stream)
        });
    }
}