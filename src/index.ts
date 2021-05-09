import axios, { AxiosInstance } from 'axios';
import { v4 as newUuid } from 'uuid';

export class FrenchBench {
  private _ax: AxiosInstance;
  private token_type?: string;
  private token?: string;
  constructor(
    private baseURL: string,
  ) {
    this._ax = axios.create({ baseURL });
  }

  setToken(token: string, token_type = 'Bearer'): void {
    this.token = token;
    this.token_type = token_type;
  }

  async _action<TData = any, TMeta = any>(
    action: string,
    input: any = {},
    id: string | null = null,
  ): Promise<ApiResponseBody<TData, TMeta>> {
    const reqId = newUuid();
    try {
      const headers: ApiRequestHeaders = { 'x-fb-request-id': reqId };
      if (this.token_type && this.token) {
        headers['authorization'] = `${this.token_type} ${this.token}`;
      }
      // url is '' to avoid 308 perm. redirect from '/api/' to '/api'
      const res = await this._ax.post<ApiResponseBody<TData, TMeta>>('', { action, input, id }, { headers });
      return res.data;
    } catch (err) {
      return { error: err.message };
    }
  }

  async signin(input: SignInInput) { return this._action<SignInData>('user.signin', input); }
}

export interface ApiRequestHeaders extends Record<string, string> {}

export interface ApiResponseBody<TData = any, TMeta = any> {
  data?: TData | null;
  meta?: TMeta | null;
  error?: string | null;
}

export interface SignInInput {
  username: string;
  password: string;
}

export interface SignInData {
  id: string;
  username: string;
  token: string;
  token_type: string; // e.g. 'Bearer'
}
