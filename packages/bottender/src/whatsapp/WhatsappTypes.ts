import { RequestContext } from '../types';

export { WhatsappConnectorOptions } from './WhatsappConnector';

export type MessageReceivedCommon = {
  messageId: number;
  type: 'from_client';
  text: string;
  transport: 'wa_dialog';
  clientId: number;
  operatorId: number | null;
  dialogId: number;
  channelId: number;
  photo: string | null;
  coordinates: string | null;
  audio: string | null;
  pdf: string | null;
  client: {
    id: number;
    phone: string;
    clientPhone: string | null;
    name: string;
    assignedName: string | null;
    externalId: number | null;
  };
  hookType: 'inbox' | 'outbox';
  requestId: number;
  isNewRequest: boolean;
  isNewClient: boolean;
  instaComment: boolean;
  extraData: null;
  isNew: boolean;
  eventTime: string;
};

export type TextMessageReceived = MessageReceivedCommon & {
  attachments: [];
};

/**
 * Twilio sends form variables named MediaUrlX, where X is a zero-based index.
 * WhatsApp messages will only contain one media file per incoming message, so you can access the file at MediaUrl0 on the incoming request from Twilio to your webhook URL.
 */
export type MediaMessageReceived = MessageReceivedCommon & {
  attachments: {
    id: number;
    resourceType: string;
    resourceId: number;
    file: {
      url: string;
    };
    hardLink: string;
    contentType: string;
    createdAt: string;
    updatedAt: string;
    companyId: number;
    originalFileName: null;
    fileSize: number;
  }[];
};

export type MessageReceived = TextMessageReceived | MediaMessageReceived;

export type MessageStatusCommon<S extends string> = {
  smsStatus: S;
  messageStatus: S;
  smsSid: string;
  channelToAddress: string;
  to: string;
  channelPrefix: 'whatsapp';
  messageSid: string;
  accountSid: string;
  from: string;
  apiVersion: '2010-04-01';
  channelInstallSid: string;
};

export type MessageSent = MessageStatusCommon<'sent'> & {
  structuredMessage: 'false';
};

export type MessageDelivered = MessageStatusCommon<'delivered'> & {
  eventType: 'DELIVERED';
};

export type MessageRead = MessageStatusCommon<'read'> & {
  eventType: 'READ';
};

export type WhatsappRawEvent = MessageReceived;

export type WhatsappRequestBody = any;

export type WhatsappRequestContext = RequestContext<
  WhatsappRequestBody,
  { 'x-twilio-signature'?: string }
>;
