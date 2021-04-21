import * as _ from "lodash";
import { Message } from "../message/message.model";
import { MessagesService } from "../message/messages.service";
import { User } from "../user/user.model";
import { Thread } from "./thread.model";
import { ThreadsService } from "./threads.service";

describe("ThreadService", () => {
  it("should collect the threads from messages", () => {
    const u1: User = new User("Peter", '');
    const u2: User = new User("Peter2", '');

    const t1: Thread = new Thread("t1", "Thread 1", "");
    const t2: Thread = new Thread("t2", "Thread 2", "");

    const m1: Message = new Message({
      author: u1,
      text: 'Hello',
      thread: t1
    });
    const m2: Message = new Message({
      author: u2,
      text: 'Hello2',
      thread: t1
    });
    const m3: Message = new Message({
      author: u1,
      text: 'Hello3',
      thread: t2
    });

    const messagesService: MessagesService = new MessagesService();
    const threadService: ThreadsService = new ThreadsService(messagesService);

    threadService.threads.subscribe((threadObj: {[key:string]: Thread}) => {
      const threads: Thread[] = Object.values(threadObj);
      const threadNames: string = threads.map((t:Thread) => t.name).join(", ");
      console.log('threads: ', threads.length, threadNames);
    })

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
    messagesService.addMessage(m3);

  });
});
