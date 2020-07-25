import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ChatMessage, UserInfo, ChatService, Pages } from 'src/app/services/chat.service';
import { NavParams, ModalController, IonSlides } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class GuidePage implements OnInit {

  @ViewChild("chatContent", {static: false}) chatContent: ElementRef;
  @ViewChild(IonSlides, {static: true}) slides: IonSlides;
  public events: any;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  pages: Pages[] = [];
  noShowCheckbox: boolean = false;
  showLogo: boolean = false;
  logoHeight: any;
  titleIcon: string = "chatbubbles";
  title: string = "Introducción";
  opacity: boolean = false;
  currenDescription: string = "";
  currentIndex: number = 0;
  guideChecked: boolean = false;

  constructor( private utilities: UtilitiesService,
               private api: ApiService,
               private chatService: ChatService,
               public navParams: NavParams,
               private modalCtrl: ModalController) { 
    
    // Get the navParams toUserId parameter
    this.toUser = {
      id: '210000198410281948',
      name: navParams.get('toUserName')
    };
    // Get mock user information
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
    });

  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    // unsubscribe
    this.events.unsubscribe();
  }

  ionViewDidEnter() {

    //Get profile
    this.obtenerPerfil();
    //Get Pages
    this.getPages();
    //get message list
    this.getMsg();
    // Subscribe to received  new message events
    //this.events = this.chatService.chatReceived().subscribe(msg => this.pushNewMsg(msg));

  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
  }

  //Función para obtener los datos del perfil en el storage

  obtenerPerfil() {
    this.utilities.getUserData().then(data => {
      if( data === null ){

        this.noShowCheckbox = false;

       }else{

        if(data.skip_wizard === 0) {
          this.noShowCheckbox = true;
        }

       }
   });
  }

  /**
   * @name getPages
   * @returns {Promise<Pages[]>}
   */
  getPages() {
    // Get mock message list
    return this.chatService
    .getPages()
    .subscribe(res => {
      this.pages = res;
    });
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    
    let index = 0;
    // Get mock message list
    return this.chatService
    .getMsgList()
    .subscribe(res => {

      console.log("MESSGES",res);

      this.msgList.push(res[0]);

      setTimeout(() => {
        this.msgList.push(res[1]);
      }, 1500);
      setTimeout(() => {
        this.msgList.push(res[2]);
      }, 3000);
      setTimeout(() => {
        this.msgList.push(res[3]);
      }, 4500);
      setTimeout(() => {
        this.msgList.push(res[4]);
      }, 6000);
      setTimeout(() => {
        this.showLogo = true;
        this.logoHeight = window.innerHeight - this.chatContent.nativeElement.offsetHeight - 112;
      }, 7500);

    });

  }

  /**
   * Close modal
   */
  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  closeDescription() {
    this.opacity = false;
  }

  async slideChanged() {

    this.opacity = false;
    this.currentIndex = await this.slides.getActiveIndex();
    this.title = this.pages[this.currentIndex].name;
    this.titleIcon = this.pages[this.currentIndex].icon;
    console.log('Current index is', this.currentIndex);
  
    setTimeout(() => {
     
      this.currenDescription = this.pages[this.currentIndex].description;
      this.opacity = true;

    }, 1000);
  }

  async forward() {
    this.slides.slideTo( await this.slides.getActiveIndex() + 1, 500);
  }

  async back() {
    this.slides.slideTo( await this.slides.getActiveIndex() - 1, 500);
  }

  async noShowAgaing() {
    
    this.modalCtrl.dismiss();

    if(this.guideChecked) {

      (await this.api.noShowAgain(null)).subscribe( res => {

        console.log("SAVE GUIDE",res.actualizado);
        this.utilities.saveUserData(res.actualizado);

      });

    }
    
  }

}
