import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { SkinService } from '../services/skin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  password = '';
  data: any = {};
  error = false;
  caisses: any[] = [];

  private caseImgs = [
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQ1naqRJGUXvdnnwITTxKH2YejTkjJSucEo37jE9tT33wHl-UVrYG77I9KLMlhpPd_t_bY/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFU2nfGaJG0btN2wwYHfxa-hY-uFxj4Dv50nj7uXpI7w3AewrhBpMWH6d9CLMlhpEbAe-Zk/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQxnaecIT8Wv9rilYTYkfTyNuiFwmhUvpZz3-2Z9oqg0Vew80NvZzuiJdeLMlhpwFO-XdA/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQynaHMJT9B74-ywtjYxfOmMe_Vx28AucQj3brAoYrz3Fay_kY4MG_wdYeLMlhpLMaM-1U/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQwnfCcJmxDv9rhwIHZwqP3a-uGwz9Xv8F0j-qQrI3xiVLkrxVuZW-mJoWLMlhpWhFkc9M/256fx256f"
      ,"https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQ0naTKJjhHu92ywoSIlq_3Zu7Vxm0CuMFwi-2Wpojw0APnqBBuYW31JY6LMlhpMMztXwM/256fx256f"
    ]
  
  private casePrices = [0.85,0.37,0.28,0.50,0.53,1.92,0.81];

  constructor(private http: HttpClient,private router: Router, private skinService: SkinService, private authService: AuthService) {}

  ngOnInit(){
    
  }

  submitPassword() {
    this.http.get<any>('http'+(isDevMode()?'':'s')+'://chiyanh.cluster031.hosting.ovh.net/jimarblecaseget?pass='+this.password)
      .subscribe({
        next: (res) => {
          console.log("retour requete",res);
          if(res.data)
          {
            this.data.users = res.data;
            this.data.historique = {};

            this.data.users = this.data.users.sort((a:any,b:any)=>{return a.pseudo.localeCompare(b.pseudo)});

            this.skinService.getAllCases().subscribe((skins:any) => {
              this.caisses = skins;
              for(let i=0;i<this.caisses.length;i++)
              {
                this.caisses[i].price = this.casePrices[i];
                this.caisses[i].img = this.caseImgs[i];
              }
              this.data.caisses = this.caisses;

              this.authService.setUserData(this.data);
              window.open((isDevMode()?'/JiMarbleCase':'')+'/overlay', '_blank', 'width=800,height=600');
              this.router.navigate(['/config']);
            });
            
            this.error = false;
          }
          
        },
        error: () => {
          this.error = true;
        }
      });
  }
}
