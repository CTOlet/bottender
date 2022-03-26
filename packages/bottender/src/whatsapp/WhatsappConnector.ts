import { EventEmitter } from 'events';

import { JsonObject } from 'type-fest';

import Session from '../session/Session';
import { Connector } from '../bot/Connector';
import { RequestContext } from '../types';

import Chat2DeskClient, { Chat2DeskClientConfig } from './Chat2DeskClient';
import WhatsappContext from './WhatsappContext';
import WhatsappEvent from './WhatsappEvent';
import { WhatsappRequestBody, WhatsappRequestContext } from './WhatsappTypes';

type ConnectorOptionsWithoutClient = Chat2DeskClientConfig;

type ConnectorOptionsWithClient = Chat2DeskClientConfig & {
  client: Chat2DeskClient;
};

export type WhatsappConnectorOptions =
  | ConnectorOptionsWithoutClient
  | ConnectorOptionsWithClient;

export default class WhatsappConnector
  implements Connector<WhatsappRequestBody, Chat2DeskClient>
{
  _client: Chat2DeskClient;

  constructor(options: WhatsappConnectorOptions) {
    if ('client' in options) {
      this._client = options.client;
    } else {
      const { bearerToken, transport, origin } = options;

      this._client = new Chat2DeskClient({
        bearerToken,
        transport,
        origin,
      });
    }
  }

  get platform(): 'whatsapp' {
    return 'whatsapp';
  }

  get client(): Chat2DeskClient {
    return this._client;
  }

  getUniqueSessionKey(body: WhatsappRequestBody): string {
    return body.clientId;
  }

  async updateSession(
    session: Session,
    body: WhatsappRequestBody
  ): Promise<void> {
    const userId = body.clientId;

    session.user = {
      _updatedAt: new Date().toISOString(),
      id: userId,
    };

    Object.freeze(session.user);
    Object.defineProperty(session, 'user', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: session.user,
    });
  }

  mapRequestToEvents(body: WhatsappRequestBody): WhatsappEvent[] {
    return [new WhatsappEvent(body)];
  }

  createContext(params: {
    event: WhatsappEvent;
    session: Session | null;
    initialState?: JsonObject | null;
    requestContext?: RequestContext;
    emitter?: EventEmitter | null;
  }): WhatsappContext {
    return new WhatsappContext({
      ...params,
      client: this._client,
    });
  }

  preprocess(_requestContext: WhatsappRequestContext) {
    // Do nothing
    return {
      shouldNext: true,
    };
  }
}
