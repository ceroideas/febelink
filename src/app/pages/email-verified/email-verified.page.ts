import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.page.html',
  styleUrls: ['./email-verified.page.scss'],
})
export class EmailVerifiedPage implements OnInit {

  id: string;
  loading: boolean = true;
  noerror: boolean = true;
  seconds: number = 7;

  constructor(
    private api: ApiService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(( params ) => {
      this.id = params.get('id');
      
      // If There is no Id, go Home
      if( !this.id )
        this.goHome();
      else
        this.checkEmailVerification();
    });
  }

  /**
   * If Id is valid, save user's email verification
   */
  public async checkEmailVerification() {
    (await this.api.emailVerified( this.id )).subscribe(
      (resp) => {
        this.noerror = true;
        this.loading = false;
        
        this.saveVerified( resp );
        this.waitToGoHome();
      },
      (err) => {
        this.noerror = false;
        this.loading = false;
        this.waitToGoHome();
      }
    );
  }

  async saveVerified( resp ) {
    const user = await this.utilities.getUserData();

    // only update user data if the one logged in is the same
    if( user.id != resp.id )
      return;
      
    user.email = resp.email;
    user.email_verified_at = resp.time.date;
    await this.utilities.saveUserData( user );
  }

  // This is to give the people time to read the answer
  // but also not left them stuck in this page
  async waitToGoHome() {
    for (let i = this.seconds; i > 0; i--) {
      await new Promise(r => { setTimeout(r, 1000); });
      this.seconds--;
    }

    this.goHome();
  }

  goHome() {
    this.router.navigate([ 'menu/todas' ]);
  }
}
