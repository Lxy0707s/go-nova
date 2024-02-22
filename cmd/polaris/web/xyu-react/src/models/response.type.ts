// 接口的返回值类型
export type Res =
  | {
      status: number; // 状态，200成功
      data?: any; // 返回的数据
      message?: string; // 返回的消息
    }
  | undefined;

export type Page = {
    pageNum: number; // 当前页码
    pageSize: number; // 每页显示多少条
    total: number; // 总共多少条数据
};