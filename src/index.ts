import { LiveRoomModel } from './live_room_model';
import * as request from 'request-promise-native';

/**
 * 示例
 */
async function main() {
    const url       = 'https://live.bilibili.com/145';
    const live_room = await LiveRoomModel.new(url);
    console.log(live_room);
}

main();
