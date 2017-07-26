export class WrongRoomUrlFormat extends Error {
    /**
     * 输入的直播间URL格式不正确
     * @param url                   输入的直播间URL
     */
    constructor(
        public url: string
    ) {
        super();
        this.message = `输入的直播间URL格式不正确:${this.url}`
    }
}

export class UnexpectedResponse extends Error {
    /**
     * 网络请求返回的数据与预期不符
     * @param url                   请求的URL
     * @param content               服务器返回数据内容
     */
    constructor(
        public url     : string,
        public content?: string
    ) {
        super();
        if (this.content) {
            this.message = `对${this.url}网络请求的数据与预期不符:${this.content}`;
        } else {
            this.message = `对${this.url}网络请求的数据与预期不符`;
        }
    }
}

