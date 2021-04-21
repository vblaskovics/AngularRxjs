import { Message } from "../message/message.model";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Thread } from "../thread/thread.model";
import { User } from "../user/user.model";
import { filter, scan, publishReplay, refCount, map } from "rxjs/operators";

const initialMessages: Message[] = [];

interface IMessagesOperation extends Function {
  (messages: Message[]): Message[];
}

@Injectable()
export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>();
  messages: Observable<Message[]>;
  updates: Subject<any> = new Subject<any>();
  create: Subject<Message> = new Subject<Message>();

  constructor() {
    this.messages = this.updates.pipe(
      scan((messages: Message[], operation: IMessagesOperation) => {
        return operation(messages);
      }, initialMessages),
      publishReplay(1),
      refCount()
    );

    this.create
      .pipe(
        map(
          (message: Message): IMessagesOperation => {
            return (messages: Message[]) => {
              return messages.concat(message);
            };
          }
        )
      )
      .subscribe(this.updates);

    this.newMessages.subscribe(this.create);
  }

  addMessage(message: Message): void {
    this.newMessages.next(message);
  }

  messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
    return this.newMessages.pipe(
      filter((message: Message) => {
        return message.thread.id === thread.id && message.author.id !== user.id;
      })
    );
  }
}
