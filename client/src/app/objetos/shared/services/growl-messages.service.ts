import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Message } from 'primeng/primeng';

@Injectable()
export class GrowlMessagesService {
  private growlMessages = new Subject<Message>();
  growlMessages$ = this.growlMessages.asObservable();

  constructor() { }

  newMessage(msg: Message): void{
    this.growlMessages.next(msg)
  }

}
