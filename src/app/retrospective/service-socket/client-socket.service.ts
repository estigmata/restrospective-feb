import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ClientSocketService {

  constructor(private socket: Socket) { }

  startConnection(player) {
    this.socket.emit('startSocketClient', player);
  }

  listenItemSaved() {
    return this.socket.fromEvent('itemSave');
  }

  listenItemUpdate() {
    return this.socket.fromEvent('itemUpdate');
  }

  listenItemDelete() {
    return this.socket.fromEvent('itemDelete');
  }

  sendCreateItem(item) {
    this.socket.emit('itemCreate', item);
  }

  listenItemCreation() {
    return this.socket.fromEvent('itemCreate');
  }

  sendEditionStartItem(item) {
    this.socket.emit('editionStartItem', item);
  }

  listenItemEditionStart() {
    return this.socket.fromEvent('editionStartItem');
  }

  sendCancelCreateEditItem(item) {
    this.socket.emit('cancelCreateEditItem', item);
  }

  listenItemCreationCanceled() {
    return this.socket.fromEvent('cancelCreateEditItem');
  }

  listenRetrospectiveUpdateState() {
    return this.socket.fromEvent('updateStateRetrospective');
  }

  listenNewPlayer() {
    return this.socket.fromEvent('playerSave');
  }
}
