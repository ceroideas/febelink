import {UtilitiesService} from './../../services/utilities.service';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {
  AlertController,
  
} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Subscription} from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit{
  public message = '';
  public messages:any[] = [];
  public currentUser: any;
  public timeout: any;
  public user_id: any;
  public user_name: any;
  public person_name: any;
  public person_id: any;
  public room_id: any;
  public view_finish = true;
  public create: any;
  public empty_chat: any;
  public load_data = null;
  public messageDateString: any;
  public exist_old_messages: any;
  public firstMessage: any;
  public finish_chat = false;
  private reciveMessageSubscription: Subscription | undefined;
  @ViewChild(IonInfiniteScroll, {static: false})
  infiniteScroll: IonInfiniteScroll | undefined;
  @ViewChild('id_input_message', {static: false}) input_message: Input | undefined;

  @ViewChild('content', {static: true}) private content: any;

  userIdDemand: string ="";
  demandId: number = 0;
  searchTitle: string = "";

  paramsQuery: any;
  paramsUrl:any;

  constructor(
    private socket: Socket,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public ApiService: ApiService,
    private utiltySVC: UtilitiesService
  ) {
    // this.socket.connect();

    // this.platform.pause.subscribe(() => {
    //     this.socket.removeAllListeners();
    // });

    this.route.params.subscribe((params) => {
      this.user_name = params?.['user_name'];

      this.person_name = params?.['person_name'];
      this.person_id = this.route.snapshot?.params?.['receiverId'];
      this.room_id = params?.['roomId'];
      this.create = params?.['create'];
      params['id_demandante']
        ? (this.userIdDemand = JSON.parse(params['id_demandante']))
        : (this.userIdDemand = this.user_id);
      this.demandId = params?.['demand_id'];
      this.searchTitle = params?.['search_title'];
    });
  }

  async ngOnInit() {
    this.currentUser = await this.utiltySVC?.getUserData();

    this.user_id = this.currentUser?.id;

    this.person_id = this.route.snapshot?.paramMap.get('receiverId');
    this.person_name = this.route.snapshot?.paramMap.get('receiverUsername');

    this.route.paramMap.subscribe((params) => {
      this.person_id = params.get('receiverId')!;
      this.person_name = params.get('receiverUsername')!;
    });

    this.ApiService.getAllMessages(this.room_id).then((myObservable) => {
      myObservable.subscribe((response) => {
        if (response.correct == true && response.message == 'Correct') {
          //@ts-ignore
          this.load_data = true;
          let new_messages: any = [];
          if (response.result.length){
            this.firstMessage = response.result[0]['id'];
            this.finish_chat = response.result[0]['finish'];
          }
          
          response.result.forEach(function callback(
            currentValue: any,
            index: any,
            array: any
          ) {
            currentValue.timecreated = currentValue.timecreated * 1000;
            var message_hour = new Date(currentValue.timecreated).getHours();
            let message_min = new Date(currentValue.timecreated).getMinutes();
            let message_hour_reset;

            if (message_hour < 10) {
              message_hour_reset = 0 + '' + message_hour;
            } else {
              message_hour_reset = message_hour;
            }

            let message_min_reset;

            if (message_min < 10) {
              message_min_reset = 0 + '' + message_min;
            } else {
              message_min_reset = message_min;
            }

            var message_createdAt =
              message_hour_reset + ':' + message_min_reset;

            let message = {
              msg: currentValue.text,
              user: currentValue.user_id,
              createdAt: message_createdAt,
              timecreated: currentValue.timecreated,
            };

            new_messages.push(message);
          });

          this.messages = new_messages;

          this.empty_chat = false;
          this.scrollToBottomOnInit_one();
          this.ApiService.setMessagesAsRead();
        } else if (response.correct == true && response.message == 'NoChat') {
          this.empty_chat = true;
          this.view_finish = false;
          this.scrollToBottomOnInit_one();
        } else {
          this.presentAlert(
            'Error desconocido',
            'Error desconocido',
            'Aceptar'
          );
          this.empty_chat = true;
        }
      });
    });

    const connectionLog = await this.socket.emit('create', this.room_id);

    this.reciveMessageSubscription = this.socket
      .fromEvent('message')
      .subscribe((message) => {

        //@ts-ignore
        var message_hour = new Date(message['timecreated']).getHours();
        //@ts-ignore

        var message_min = new Date(message['timecreated']).getMinutes();
        let message_hour_reset;

        if (message_hour < 10) {
          message_hour_reset = 0 + '' + message_hour;
        } else {
          message_hour_reset = message_hour;
        }

        let message_min_reset;

        if (message_min < 10) {
          message_min_reset = 0 + '' + message_min;
        } else {
          message_min_reset = message_min;
        }
        //@ts-ignore

        message['createdAt'] = message_hour_reset + ':' + message_min_reset;
        //@ts-ignore

        this.messages.push(message);
        this.scrollToBottomOnInit();
      });
  }

  // ionViewDidLeave() {
  //   this.socket.disconnect();
  //   this.reciveMessageSubscription?.unsubscribe();
  // }

  async presentAlert(title: any, message: any, button:any) {
    const alert = await this.alertController.create({
      header: title,
      message: '<p>' + message + '</p>',
      buttons: [button],
      animated: true,
    });

    await alert.present();
  }

  async sendMessage() {
    if (this.message.length > 1000) {
      this.presentAlert(
        'Máximo de caracteres permitidos',
        'Has escrito más de 1000 caracteres, mejor divídelo en varios mensajes.',
        'Aceptar'
      );
    } else {
      this.view_finish = true;

      let d = new Date();
      let timestamp = d.getTime();
      var message_hour = new Date(timestamp).getHours();
      let message_min = new Date(timestamp).getMinutes();
      let message_hour_reset;

      if (message_hour < 10) {
        message_hour_reset = 0 + '' + message_hour;
      } else {
        message_hour_reset = message_hour;
      }

      let message_min_reset;

      if (message_min < 10) {
        message_min_reset = 0 + '' + message_min;
      } else {
        message_min_reset = message_min;
      }

      var message_createdAt = message_hour_reset + ':' + message_min_reset;
      let message = {
        msg: this.message,
        user: this.user_id,
        createdAt: message_createdAt,
        timecreated: timestamp,
      };

      // this.messages.push(message);
      this.scrollToBottomOnInit();
      const messageSocketResponse = await this.socket.emit('send-message', {
        room_id: this.room_id,
        text: this.message,
        user: this.user_id,
        timecreated: timestamp,
      });

      // @ts-ignore
      this.input_message.setFocus();
      await this.setMessageDB(this.message, this.room_id, timestamp);
      // this.messages = this.messages.concat(message);
      // this.submitOffer();
      this.message = '';
      this.empty_chat = false;
    }
  }

  async setMessageDB(message:any, room:any, timecreated:any) {
    await this.ApiService.setMessage(
      this.user_id,
      this.person_id,
      message,
      room,
      timecreated
    ).then((myObservable) => {
      myObservable.subscribe((response) => {
        if (response.correct != true && response.message != 'Correct') {
          this.presentAlert(
            'Error desconocido',
            'Error desconocido, por favor contacte con soporte@nerbay.com indicando el código de error [e-12627]',
            'Aceptar'
          );
        }
        this.newMessageChat(this.person_id);
      });
    });

    // await this.ApiService.sendNotificacionNewMessage(this.person_id, this.message);
  }

  async newMessageChat(person_id:any) {
    await this.socket.emit('new_update_room', person_id + 'user_login');
  }

  scrollToBottomOnInit() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
        setTimeout(() => {
          if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
          }
          setTimeout(() => {
            if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
            }
            setTimeout(() => {
              if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
              }
            }, 2);
          }, 2);
        }, 2);
      }, 2);
    }, 2);
  }

  scrollToBottomOnInitMessage() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
        setTimeout(() => {
          if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
          }
          setTimeout(() => {
            if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
            }
            setTimeout(() => {
              if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
              }
              setTimeout(() => {
                if (this.content.scrollToBottom) {
                  this.content.scrollToBottom();
                }
                setTimeout(() => {
                  if (this.content.scrollToBottom) {
                    this.content.scrollToBottom();
                  }
                  setTimeout(() => {
                    if (this.content.scrollToBottom) {
                      this.content.scrollToBottom();
                    }
                    setTimeout(() => {
                      if (this.content.scrollToBottom) {
                        this.content.scrollToBottom();
                      }
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }

  scrollToBottomOnInit_one() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
        setTimeout(() => {
          if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
          }
          setTimeout(() => {
            if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
            }
            setTimeout(() => {
              if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
                //@ts-ignore
                this.load_data = true;
              }
            }, 2);
          }, 2);
        }, 2);
      }, 2);
    }, 2);
  }

  scrollToBottomOnInitEnterMessage() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
        setTimeout(() => {
          if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
          }
          setTimeout(() => {
            if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
            }
            setTimeout(() => {
              if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
              }
            }, 2);
          }, 2);
        }, 2);
      }, 2);
    }, 2);
  }

  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) {
      return true;
    }

    //@ts-ignore
    const d1 = new Date(this.messages[messageIndex - 1].timecreated);
    //@ts-ignore
    const d2 = new Date(this.messages[messageIndex].timecreated);

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }

  getMessageDate(messageIndex: number): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let dateToday = new Date().toLocaleDateString('es-ES', options);

    const longDateYesterday = new Date();
    longDateYesterday.setDate(new Date().getDate() - 1);
    const dateYesterday = longDateYesterday.toLocaleDateString(
      'es-ES',
      options
    );
    const today = dateToday;
    const yesterday = dateYesterday;

    const wholeDate = new Date(
       //@ts-ignore
      this.messages[messageIndex].timecreated
    ).toLocaleDateString('es-ES', options);

    this.messageDateString = wholeDate;

    if (
       //@ts-ignore
      new Date(this.messages[messageIndex].timecreated).getFullYear() ===
      new Date().getFullYear()
    ) {
      if (this.messageDateString === today) {
        return 'Hoy';
      } else if (this.messageDateString === yesterday) {
        return 'Ayer';
      } else {
        return this.messageDateString;
      }
    } else {
      return wholeDate;
    }
  }

  async finishChat() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Bloquear usuario',
      message:
        'Si cierras un chat, el usuario no podrá seguir enviandote mensajes.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          },
        },
        {
          text: 'Finalizar',
          handler: () => {
            this.sendCloseChat();
          },
        },
      ],
    });

    await alert.present();
  }

  async openChat() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Abrir chat',
      message: 'Si abres un chat el ofertante podrá enviarte mensajes.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          },
        },
        {
          text: 'Abrir',
          handler: () => {
            this.sendOpenChat();
          },
        },
      ],
    });

    await alert.present();
  }

  sendOpenChat() {
    this.ApiService.openChat(this.room_id).then((myObservable) => {
      myObservable.subscribe((response) => {
        if (response.correct != true && response.message != 'Correct') {
          this.presentAlert(
            'Error desconocido',
            'Error desconocido',
            'Aceptar'
          );
        } else {
          this.finish_chat = false;
          this.presentAlert(
            'Chat abierto',
            'Ahora puedes escribir y el ofertante podrá enviarte mensajes.',
            'Aceptar'
          );
        }
      });
    });
  }

  sendCloseChat() {
    this.ApiService.closeChat(this.room_id).then((myObservable) => {
      myObservable.subscribe((response) => {
        if (response.correct != true && response.message != 'Correct') {
          this.presentAlert(
            'Error desconocido',
            'Error desconocido',
            'Aceptar'
          );
        } else {
          this.finish_chat = true;
          this.presentAlert(
            'Chat cerrado',
            'Ahora no puedes escribir, ni el ofertante podra enviarte mensajes.',
            'Aceptar'
          );
        }
      });
    });
  }

  async submitOffer() {
    (
      await this.ApiService.realizarOferta(
        this.searchTitle,
        this.message,
         //@ts-ignore
        0,
        this.demandId
      )
    ).subscribe((resp) => {
      console.log("test ceroideas",'submitOffer', resp);
    });
  }
}
