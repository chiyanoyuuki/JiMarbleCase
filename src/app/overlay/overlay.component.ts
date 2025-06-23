import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TwitchChatService } from '../services/twitch-chat.service';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  data: any = {};
  userClicked:any;
  caisseClicked:any;

  private rarityColors: any = {
    'Consumer':'blue',
    'Industrial':'blue',
    'Mil-Spec':'blue',
    'Restricted':'purple',
    'Classified':'pink',
    'Covert':'red',
    'Exceedingly':'yellow',
    'Extraordinary': 'yellow'
  };

  show:any = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const bc = new BroadcastChannel('overlay-channel');
    bc.onmessage = (event) => {
      this.data = event.data;
      this.userClicked = this.data.users.find((user:any)=>user.clicked);
      this.caisseClicked = this.data.caisses.find((caisse:any)=>caisse.clicked);
      if(this.userClicked || this.caisseClicked) this.show = true;
      else this.show = false;
      this.cdr.detectChanges();
    };
  }

  getSkins()
  {
    return this.caisseClicked?this.caisseClicked.skins:[];
  }

  getRarityColor(rarity: string | undefined): string {
    if (!rarity) return 'transparent'; // couleur par défaut si pas de rarity

    const firstWord = rarity.split(' ')[0];
    return this.rarityColors[firstWord] || 'transparent';
  }

  distributeStrictlyDecreasing(): number[] {
    const totalCases = this.getNumberOfCases();
    const distribution: number[] = [];
    let next = 1;

    // Étape 1 : Trouver le maximum de personnes possibles avec une suite décroissante
    while ((next * (next + 1)) / 2 <= totalCases) {
      next++;
    }
    next--; // On dépasse au dernier tour, donc on recule

    // Étape 2 : Construire la séquence décroissante
    for (let i = next; i >= 1; i--) {
      distribution.push(i);
    }

    // Étape 3 : Distribuer les caisses restantes (s'il y en a, en ajoutant +1 aux plus gros)
    let remaining = totalCases - distribution.reduce((a, b) => a + b, 0);
    let index = 0;
    while (remaining > 0) {
      distribution[index]++;
      remaining--;
      index++;
    }

    return distribution;
  }

  getNumberOfCases(){
    let nb = 0;
    if(this.data.caisses)
    {
      this.data.caisses.forEach((caisse:any)=>nb+=caisse.qte?caisse.qte:0);
    }
    return nb;
  }

  getCaisses()
  {
    return this.data.caisses?this.data.caisses.filter((caisse:any)=>caisse.qte>0):[];
  }

  getSkinImg(skin:any)
  {
    let caisse = this.data.caisses.find((caisse:any)=>caisse.case==skin.caisse);
    if(caisse)
    {
      let s = caisse.skins.find((sk:any)=>sk.name == skin.skin);
      if(s) return s.img;
    }
    return "";
  }

  getSkinPrice(skin:any)
  {
    let caisse = this.data.caisses.find((caisse:any)=>caisse.case==skin.caisse);
    if(caisse)
    {
      let s = caisse.skins.find((sk:any)=>sk.name == skin.skin);
      if(s) return s.prices[0];
    }
    return "NA";
  }
}