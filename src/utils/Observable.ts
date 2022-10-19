import { removeAllListeners } from "process";
export type EventType = "locationChange" | "";
export type EventArg = { type: EventType; index: number };

export class Observer {
  private events: {
    type: EventType;
    handler: (arg: EventArg) => any;
  }[] = [];

  addEventHandler(
    type: EventType,
    eventHandlerFunction: (arg: EventArg) => void
  ) {
    this.events.push({ type: type, handler: eventHandlerFunction });
  }

  /**
   * タイプの一致するイベントに通知
   * @param type
   */
  notify(type: EventType) {
    this.events
      .filter((e) => e.type === type)
      .forEach((e, i) => e.handler({ type: e.type, index: i }));
  }

  /**
   * オブザーバーの全てのイベントに通知
   */
  notifyAll() {
    this.events.forEach((event, index) => {
      event.handler({ type: event.type, index: index });
    });
  }

  removeObserver(index: number) {
    this.events.slice(index, 1);
  }
}
