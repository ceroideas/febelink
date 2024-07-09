import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ToastSvc} from '../../services/toast.service';

@Component({
  selector: 'partial-popup',
  templateUrl: './partial-popup.component.html',
  styleUrls: ['./partial-popup.component.scss'],
})
export class PartialPopupComponent implements OnInit {

  @Input() displayToggle: boolean = false;
  @Output() partialLoginResponseEvent = new EventEmitter<string>();
  email: string = "";

  constructor(private userService: UserService, private toastService: ToastSvc) {
  }

  ngOnInit() {
  }

  async signUp() {
    const {response, error} = await this.userService.partialSignUp(this.email);
    if (response) {
      await this.partialLoginResponseEvent.emit(this.email);
      await this.toastService.show('Usuario registrado con éxito. Revisa tu email para completar el registro.');
    }
    if (error) {
      await this.toastService.show(error.error.message);
    }
  }

  closePopUp() {
    this.displayToggle = false;
  }
}
