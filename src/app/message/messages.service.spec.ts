import { Thread } from "../thread/thread.model";
import { User } from "../user/user.model";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";

describe("MessagesService", () => {
  it("add new messages", () => {
    const user: User = new User("Peter", "");
    const thread: Thread = new Thread("t1", "Peter", "");
    const m1: Message = new Message({
      author: user,
      text: 'Hello',
      thread: thread
    });
    const m2: Message = new Message({
      author: user,
      text: 'Hello again',
      thread: thread
    });

    const messagesService: MessagesService = new MessagesService();

    messagesService.newMessages.subscribe((message:Message)=>{
      console.log('=> new message: ', message.text);
    });

    messagesService.messages.subscribe((messages:Message[])=>{
      console.log('=> messages: ', messages.length);
    })

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
  });
});
