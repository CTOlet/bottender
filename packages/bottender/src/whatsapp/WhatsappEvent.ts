import { Event } from '../context/Event';

import {
  MediaMessageReceived,
  MessageReceived,
  WhatsappRawEvent,
} from './WhatsappTypes';

export default class WhatsappEvent implements Event<WhatsappRawEvent> {
  _rawEvent: WhatsappRawEvent;

  constructor(rawEvent: WhatsappRawEvent) {
    this._rawEvent = rawEvent;
  }

  /**
   * Underlying raw event from WhatsApp.
   *
   */
  get rawEvent(): WhatsappRawEvent {
    return this._rawEvent;
  }

  /**
   * Determine if the event is a message event.
   *
   */
  get isMessage(): boolean {
    return this._rawEvent.hookType === 'inbox';
  }

  /**
   * The message object from Messenger raw event.
   *
   */
  get message(): MessageReceived | null {
    return this.isMessage ? (this._rawEvent as MessageReceived) : null;
  }

  /**
   * Determine if the event is a message event which includes text.
   *
   */
  get isText(): boolean {
    return (
      this._rawEvent.hookType === 'inbox' && this._rawEvent.attachments === []
    );
  }

  /**
   * The text string from Messenger raw event.
   *
   */
  get text(): string | null {
    return (this._rawEvent as MessageReceived).text || null;
  }

  /**
   * Determine if the event is a message event which includes media.
   *
   */
  get isMedia(): boolean {
    return (
      this._rawEvent.hookType === 'inbox' &&
      this._rawEvent.attachments.length > 0
    );
  }

  /**
   * The media object from Messenger raw event.
   *
   */
  get media(): { contentType: string; url: string } | null {
    if (!this.isMedia) return null;

    const rawEvent = this._rawEvent as MediaMessageReceived;

    return {
      contentType: rawEvent.attachments[0].contentType,
      url: rawEvent.attachments[0].file.url,
    };
  }

  /**
   * Determine if the event is a message received event.
   *
   */
  get isReceived(): boolean {
    return this._rawEvent.hookType === 'inbox';
  }

  /**
   * The received object from WhatsApp raw event.
   *
   */
  get received(): MessageReceived | null {
    return this.isReceived ? (this._rawEvent as MessageReceived) : null;
  }
}
