import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import get from 'lodash/get';
import {
  OnRequestFunction,
  camelcaseKeys,
  createRequestInterceptor,
  snakecaseKeys,
} from 'messaging-api-common';

export interface Chat2DeskClientConfig {
  bearerToken: string;
  transport?: string;
  origin?: string;
}
type Chat2DeskMessageType = 'to_client';
type Chat2DeskMessageTransport = 'wa_dialog';
type Chat2DeskResponseStatus = 'success' | 'error';
interface Chat2DeskMessage {
  clientId: number;
  text: string | null;
  attachment?: string;
  pdf?: string;
  channelId: number;
  operatorId?: number;
  openDialog?: boolean;
  encrypted?: boolean;
  externalId?: number;
}
interface Chat2DeskMessageResponse {
  message?: string;
  data?: {
    messageId: number;
    channelId: number;
    operatorId: number;
    transport: Chat2DeskMessageTransport;
    type: Chat2DeskMessageType;
    clientId: number;
    dialogId: number;
    requestId: number;
  };
  attachment: string[];
  status: Chat2DeskResponseStatus;
}

interface AssignToOperatorOptions {
  messageId: number;
  operatorId: number;
}

function handleError(err: AxiosError): never {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data', {});
    const msg = `WhatsApp API - ${error.code} ${error.message} ${error.more_info}`;
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

export default class Chat2DeskClient {
  static connect(config: Chat2DeskClientConfig): Chat2DeskClient {
    return new Chat2DeskClient(config);
  }

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  _bearerToken: string;

  _transport: string;

  constructor(config: Chat2DeskClientConfig) {
    const chat2deskOrigin = `https://api.chat2desk.kz`;

    this._bearerToken = config.bearerToken;
    this._transport = config.transport || 'wa_dialog';

    this._axios = axios.create({
      baseURL: `${config.origin || chat2deskOrigin}/v1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._bearerToken,
      },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this._onRequest,
      })
    );
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get bearerToken(): string {
    return this._bearerToken;
  }

  async createMessage(message: Chat2DeskMessage) {
    try {
      const { data } = await this._axios.post<Chat2DeskMessageResponse>(
        '/messages',
        snakecaseKeys({
          type: 'to_client',
          transport: this._transport,
          ...message,
        })
      );

      return camelcaseKeys(data);
    } catch (err) {
      handleError(err);
    }
  }

  async assignToOperator({ messageId, operatorId }: AssignToOperatorOptions) {
    try {
      const { data } = await this._axios.get<{ data: []; success: string }>(
        `/messages/${messageId}/transfer?operator_id=${operatorId}`
      );

      return camelcaseKeys(data);
    } catch (error) {
      handleError(error);
    }
  }
}
