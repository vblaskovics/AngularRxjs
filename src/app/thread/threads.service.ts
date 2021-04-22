import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, combineLatest } from "rxjs/operators";
import { Message } from "../message/message.model";
import { MessagesService } from "../message/messages.service";
import { Thread } from "./thread.model";

@Injectable()
export class ThreadsService {
  threads: Observable<{ [key: string]: Thread }>;

  onderedThreads: Observable<Thread[]>;

  currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread());

  currentThreadMessages: Observable<Message[]>;

  constructor(public messagesService: MessagesService) {
    this.threads = messagesService.messages.pipe(
      map((messages: Message[]) => {
        const threads: { [key: string]: Thread } = {};

        messages.map((message: Message) => {
          threads[message.thread.id] =
            threads[message.thread.id] || message.thread;

          const messagesThread: Thread = threads[message.thread.id];
          if (
            !messagesThread.lastMassege ||
            messagesThread.lastMassege.sentAt < message.sentAt
          ) {
            messagesThread.lastMassege = message;
          }
        });

        return threads;
      })
    );

    this.onderedThreads = this.threads.pipe(
      map((threadsObj: { [key: string]: Thread }) => {
        const threads: Thread[] = _.values(threadsObj);
        return _.sortBy(threads, (t: Thread) => t.lastMassege.sentAt).reverse();
      })
    );

    this.currentThread.subscribe(this.messagesService.markThreadAsRead);

    this.currentThreadMessages = this.currentThread.pipe(
      combineLatest(
        messagesService.messages,
        (currentThread: Thread, messages: Message[]) => {
          if (currentThread && messages.length > 0) {
            return messages.filter(
              (message) => message.thread.id === currentThread.id
            ).map((message: Message) => {
              message.isRead = true;
              return message;
            });
          } else {
            return [];
          }
        }
      )
    );
  }

  setCurrentThread(newThread: Thread): void {
    this.currentThread.next(newThread);
  }
}
