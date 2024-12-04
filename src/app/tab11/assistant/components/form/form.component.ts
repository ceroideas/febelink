import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Platform } from '@ionic/angular';
import { IFile } from './../../../../components/file-picker/models/file.model';
import { FileService } from './../../../../components/file-picker/services/file.service';
import { IUser } from './../../../../models/user.model';
import { AlertSvc, IAlert } from './../../../../services/alert.service';
import { IForm } from '../../models/assistant.model';
import { answerOptions } from '../../../../../utils/utils';

@Component({
  selector: 'app-assistant-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class AssistantFormComponent implements OnInit {
  @Output() OnSubmit: EventEmitter<IForm> = new EventEmitter();
  @Output() OnCancel: EventEmitter<any> = new EventEmitter();

  @Input() perfil: IUser | null = null;
  @Input() localidad: string| null = null;

  form: UntypedFormGroup | null = null;
  iFile: IFile| null = null;
  answerOptions = answerOptions();

  name: string| null = null;
  email: string| null = null;
  password: string| null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public fileSvc: FileService,
    public platform: Platform,
    public alertSvc: AlertSvc
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ionViewDidLeave() {
    this.clear();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      descripcion: ['', Validators.required],
      ofertas_restantes: [answerOptions()[answerOptions().length - 1].value],
    });
  }

  clear() {
    //@ts-ignore
    this.fileSelected(null);
    this.form?.reset();
  }

  submit() {
    const { descripcion, ofertas_restantes } = this.form?.value;

    this.OnSubmit.emit({
      descript: descripcion,
      ofertas_restantes,
      file: this.iFile,
      name: this.name,
      email: this.email,
      password: this.password,
      localidad: this.localidad,
    } as IForm);
  }

  async cancel() {
    if (
      await this.alertSvc.confirm({
        title: 'tabs.tab1.pop.title',
        msg: 'tabs.tab1.pop.msg',
      } as IAlert)
    )
      this.OnCancel.emit();
  }

  fileSelected(file: IFile) {
    this.iFile = file;
  }

  file() {
    return this.iFile?.file;
  }
  src() {
    return this.iFile?.src;
  }
  descript(): string {
    const { descripcion } = this.form?.value;
    return descripcion;
  }
  ofertas_restantes(): string {
    const { ofertas_restantes } = this.form?.value;
    return ofertas_restantes;
  }
}
