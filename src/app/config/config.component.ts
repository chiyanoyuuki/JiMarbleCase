import { CommonModule } from '@angular/common';
import { Component, isDevMode, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import DATA from '../../../public/data.json';
import { SkinService } from '../services/skin.service';
import { TwitchChatService } from '../services/twitch-chat.service';
import { from } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  data : any = [];
  saved = false;

  selectedPlayer: any;
  selectedCaisse: any;

  
  private date: any = "";

  private bc = new BroadcastChannel('overlay-channel');

  constructor(private authService: AuthService,private twitchChat: TwitchChatService) {}

  ngOnInit() {
    this.data = this.authService.getUserData();
    console.log("config data", this.data);

    this.date = this.formatDate(new Date());

    this.twitchChat.messages$.subscribe(msgs => {
      msgs.forEach(msg=>{
        let user = this.data.users.find((user:any)=>user.pseudo.toLowerCase()==msg.user.toLowerCase());
        if(!user){
          this.data.users.push({pseudo:msg.user,points:0,msgs:1});
        }
        else{
          if(!user.msgs) user.msgs = 1;
          else user.msgs = user.msgs + 1;
        }
      })
    });
  }

parseDate(dateStr: string): Date {
  // dateStr est au format "dd/MM/yyyy"
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

getLatestDatePlus7Days(users: any[]): Date | null {
  let latestDate: Date | null = null;

  users.filter(user=>user.skins).forEach(user => {
    user.skins.forEach((skin: any) => {
      const currentDate = this.parseDate(skin.date);
      if (!latestDate || currentDate > latestDate) {
        latestDate = currentDate;
      }
    });
  });

  if (!latestDate) return null; // pas de dates trouvées

  return this.addDays(latestDate, 7);
}

formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mois 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

  selectPlayer(user:any)
  {
    this.selectedPlayer = user;
  }

  addQte(caisse:any, qte:number)
  {
    if(!caisse.qte) caisse.qte = qte;
    else caisse.qte += qte;
    this.updateOverlay();
  }

  addPoints(nb:number)
  {
    this.selectedPlayer.points += nb;
    this.data.historique.push({user:this.selectedPlayer.pseudo,price:("+"+nb), img:"twitch.png"});
    this.updateOverlay();
  }

  clickCaisse(index:number){
    this.data.caisses = this.data.caisses.map((c:any, i:any) => ({
      ...c,
      clicked: i === index && !c.clicked
    }));
    if(this.selectedCaisse == this.data.caisses[index]) this.selectedCaisse = undefined;
    else this.selectedCaisse = this.data.caisses[index];
    this.updateOverlay();
  }

  clickSkin(skin:any)
  {
    if(!this.selectedPlayer.skins) this.selectedPlayer.skins = [];
    if(!this.selectedCaisse.opened)this.selectedCaisse.opened = 1;
    else this.selectedCaisse.opened += 1;
    this.selectedPlayer.skins.push({caisse:this.selectedCaisse.case,skin:skin.name,date:this.date});
    this.data.historique.push({user:this.selectedPlayer.pseudo,img:skin.img,price:skin.prices[0]});
    this.updateOverlay();
  }

  getCaisseQte(caisse:any)
  {
    let qte = 0;
    let opened = 0;
    if(caisse.qte) qte = caisse.qte;
    if(caisse.opened) opened = caisse.opened;
    return qte - opened;
  }

  getGains()
  {
    
  }

  getSkins()
  {
    if(!this.data.caisses)return;
    let skins: any = [];
    const caisse = this.data.caisses.find((caisse:any)=>caisse.clicked);
    if(caisse) skins = caisse.skins;
    return skins;
  }

  getMaxAveragePrice = (skins: any[]): number => {
    let max = 0;
    for (const skin of skins) {
      if (skin.averagePrice && skin.averagePrice > max) {
        max = skin.averagePrice;
      }
    }
    return parseFloat(max.toFixed(2));
  };

  getGlobalAveragePrice = (skins: any[]): number => {
    let total = 0;
    let count = 0;

    for (const skin of skins) {
      if (skin.averagePrice && !isNaN(skin.averagePrice)) {
        total += skin.averagePrice;
        count++;
      }
    }

    return count > 0 ? parseFloat((total / count).toFixed(2)) : 0;
  };

  updateOverlay() {
    this.bc.postMessage(this.data); // Notify overlay
  }

  save()
  {
    from(
      fetch(
        'http' +
          (isDevMode() ? '' : 's') +
          '://chiyanh.cluster031.hosting.ovh.net/jimarblecaseset.php',
        {
          body: JSON.stringify({users:this.data.users}),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          mode: 'no-cors',
        }
      ).then((data: any) => {
        this.saved = true;
      })
    );
  }
}