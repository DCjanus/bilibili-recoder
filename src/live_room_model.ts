import * as request from 'request-promise-native';
import { UnexpectedResponse, WrongRoomUrlFormat } from "./exceptions";

export class LiveRoomModel {
    /**
     * 代表直播间的模型类
     * @param room_id               直播间ID，用户不需理会（不是URL中那个数字）
     * @param room_url              直播间URL
     * @param room_title            直播间标题
     * @param author_nick_name      主播昵称
     * @param video_stream_url      视频流URL
     */
    private constructor(
        readonly room_id         : number,
        readonly room_url        : string,
        readonly room_title      : string,
        readonly author_nick_name: string,
        readonly video_stream_url: string,
    ) { }

    /**
     * 根据给定的直播间URL创建一个Recoder对象
     * 由于暂时TypeScript还没有提供async constructor
     * 故只能以静态方法的形式构建该对象
     * @param room_url              给定的直播间URL
     */
    static async new(live_room_url: string): Promise<LiveRoomModel> {

        const room_url                         = parse_room_url(live_room_url);
        const room_id                          = await query_room_id(room_url);
        const video_stream_url                 = await query_video_stream_url(room_id);
        const { author_nick_name, room_title } = await query_room_info(room_id);

        return new LiveRoomModel(
            room_id,
            room_url,
            room_title,
            author_nick_name,
            video_stream_url);
    }
}

/**
 * 根据给定的直播间URL获取直播间ID
 * @param room_url                  给定的直播间URL
 */
async function query_room_id(room_url: string): Promise<number> {
    const response = await request.get(room_url);

    const pattern      = new RegExp('var ROOMID = (\\d+?);');
    const match_result = response.match(pattern);

    if (match_result === null) throw new UnexpectedResponse(room_url);

    return Number.parseInt(match_result[1]);
}

/**
 * 根据给定的直播间ID获取直播间信息
 * @param room_id                   给定的直播间ID
 */
async function query_room_info(room_id: number) {
    const url = `http://api.live.bilibili.com/room/v1/Room/getRoomInfoMain?roomid=${room_id}`;

    const response                                        = await request.get(url, { json: true });
    const { code, data: { ANCHOR_NICK_NAME, ROOMTITLE } } = response;
    if (code !== 0) throw new UnexpectedResponse(url, response);

    return { author_nick_name: ANCHOR_NICK_NAME, room_title: ROOMTITLE };
}

/**
 * 根据给定的直播间ID获取视频流URL
 * @param room_id                   给定的直播间ID
 */
async function query_video_stream_url(room_id: number) {
    const url      = `http://live.bilibili.com/api/playurl?player=1&cid=${room_id}&quality=0`;
    const response = await request.get(url);
    const pattern  = new RegExp('<url><!\\[CDATA\\[(.+?)\\]\\]></url>');

    const match_result = response.match(pattern);
    if (match_result === null) throw new UnexpectedResponse(url, response);
    return match_result[1];
}

/**
 * 判断给定的直播间URL是否满足需求
 * 后期可能加入更多功能
 * @param room_url                  给定的直播间URL
 */
function parse_room_url(room_url: string) {
    const pattern = new RegExp(`^https?://live.bilibili.com/\\d+?$`);
    if (!pattern.test(room_url)) {
        throw new WrongRoomUrlFormat(room_url);
    } else {
        return room_url;
    }
}


