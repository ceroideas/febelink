import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Platform } from '@ionic/angular';
import { IFile } from 'src/app/components/file-picker/models/file.model';
import { FileService } from 'src/app/components/file-picker/services/file.service';
import { IUser } from 'src/app/models/user.model';
import { AlertSvc, IAlert } from 'src/app/services/alert.service';
import { answerOptions } from 'src/utils/utils';
import { IForm } from '../../models/assistant.model';

@Component({
  selector: 'app-assistant-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class AssistantFormComponent implements OnInit {
  @Output() OnSubmit: EventEmitter<IForm> = new EventEmitter();
  @Output() OnCancel: EventEmitter<any> = new EventEmitter();

  @Input() perfil: IUser;
  @Input() localidad: string;

  form: FormGroup;
  iFile: IFile;
  answerOptions = answerOptions();

  name: string;
  email: string;
  password: string;

  constructor(
    private formBuilder: FormBuilder,
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
    this.fileSelected(null);
    this.form.reset();
  }

  submit() {
    const { descripcion, ofertas_restantes } = this.form.value;

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
    const { descripcion } = this.form.value;
    return descripcion;
  }
  ofertas_restantes(): string {
    console.log({ value: this.form.value });
    const { ofertas_restantes } = this.form.value;
    return ofertas_restantes;
  }
}
