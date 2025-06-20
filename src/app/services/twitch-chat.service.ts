import { Injectable } from '@angular/core';
import * as tmi from 'tmi.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TwitchChatService {
  private client: tmi.Client;
  private _messages = new BehaviorSubject<any[]>([]);
  public messages$ = this._messages.asObservable();

  constructor() {
    this.client = new tmi.Client({
      channels: ['jimapowa'] // exemple : ['frere_twitch']
    });

    this.client.connect();

    this.client.on('message', (channel, tags, message, self) => {
      if (self) return; // Ignore les messages envoyés par le bot lui-même

      const username = tags.username; // Le pseudo Twitch de l’envoyeur
      const userMessage = message;

      // Exemple : tu stockes dans un tableau d'objets {user, message}
      this._messages.next([...this._messages.value, { user: username, message: userMessage }]);
    });
  }
}