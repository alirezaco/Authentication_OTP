export interface ICachePayload {
  id: string;
  username: string;
  token: string;
  lastLogin: number;
  count: number;
}

export interface IBanPayload {
  id: string;
  count: number;
  timeBan: number;
}
