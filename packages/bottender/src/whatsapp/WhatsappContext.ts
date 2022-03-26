import Context from '../context/Context';

import Chat2DeskClient from './Chat2DeskClient';
import WhatsappEvent from './WhatsappEvent';

class WhatsappContext extends Context<Chat2DeskClient, WhatsappEvent> {
  /**
   * The name of the platform.
   *
   */
  get platform(): 'whatsapp' {
    return 'whatsapp';
  }

  /**
   * Send text to the owner of the session.
   *
   */
  async sendText(
    text: string,
    options?: {
      attachment?: string;
      pdf?: string;
      operatorId?: number;
      openDialog?: boolean;
      encrypted?: boolean;
      externalId?: number;
    }
  ): Promise<any> {
    const { clientId, channelId } = this._event.rawEvent;

    return this._client.createMessage({
      clientId,
      channelId,
      text,
      ...options,
    });
  }

  async transferToHuman() {
    const { messageId } = this._event.rawEvent;
    const operatorId = 27969;

    return this._client.assignToOperator({
      messageId,
      operatorId,
    });
  }
}

export default WhatsappContext;
