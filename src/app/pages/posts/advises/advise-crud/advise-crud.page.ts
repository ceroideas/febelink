import { Component, OnInit, ViewChild } from '@angular/core';
import { iWYSIWYG } from 'src/app/components/wysiwyg/models/wysiwyg.model';
import { ILang } from 'src/app/models/langs.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { IAdvise } from '../models/advises.model';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../components/file-picker/services/file.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { AdviseService } from '../services/advises.service';
import { SectorsComponent } from 'src/app/components/sectors/sectors.component';

@Component({
  selector: 'app-post-advise-crud',
  templateUrl: './advise-crud.page.html',
  styleUrls: ['./advise-crud.page.scss'],
})
export class AdviseCRUDPage implements OnInit {

  @ViewChild( "sectors" ) sectors: SectorsComponent
  
  isLoading: boolean = false
  
  langSelected: ILang

  form: FormGroup
  image: string | ArrayBuffer
  content: iWYSIWYG

  iAdvise: IAdvise

  paramsQuery: any
  paramsUrl: any

  constructor(
      private formBuilder: FormBuilder
    , public mediaSvc: FileService
    , private location: Location
    , private actRoute: ActivatedRoute
    , private adviseSvc: AdviseService
    , private toastSvc: ToastSvc
  ) { }

  async ngOnInit()
  {
    this.buildForm();

    this.paramsQuery = this.actRoute.snapshot.queryParamMap;
    this.paramsUrl = this.actRoute.snapshot.params

    if( this.paramsUrl?.id )
      this.getPost( this.paramsUrl?.id )
  }

  /* If has id -> editing post */
  async getPost( id: number ) {
    this.isLoading = true;

    const { response, error } = await this.adviseSvc.get( id )
    if( error ) {
      this.toastSvc.show( error.message || error.msg || 'An error ocurred on getPost' )
      return
    }

    console.log({ id: id, advise: this.iAdvise, response })
    this.iAdvise = response
    if( !this.iAdvise ) return

    // If is editing Post, update form with current values
    this.buildForm()
    this.image = this.iAdvise.photo
    this.content.html = this.iAdvise.content

    this.isLoading = false;
  }

  ionViewDidLeave()
  {
    this.form.reset()
  }

  buildForm()
  {
    const disabled = this.paramsUrl?.id && this.isLoading;

    this.form = this.formBuilder.group({
      sector: new FormControl({ value: this.iAdvise?.id_sector || 0, disabled: disabled }, Validators.required ),
      subsector: new FormControl({ value: this.iAdvise?.id_subsector || 0, disabled: disabled }, Validators.required ),
      title: new FormControl({ value: this.iAdvise?.title || '', disabled: disabled }, Validators.required ),
      subtitle: new FormControl({ value: this.iAdvise?.subtitle || '', disabled: disabled }, Validators.required ),
      summary: new FormControl({ value: this.iAdvise?.summary || '', disabled: disabled }, Validators.required ),
    });
  }

  onLangSelected( langSelected: ILang )
  {
    this.langSelected = langSelected
  }

  imgSelected( src )
  {
    this.image = src
  }

  wysiwygChange( content: iWYSIWYG )
  {
    this.content = content;
  }

  /* On Cancel */
  cancel() {
    this.location.back();
  }

  /* On Share Advise */
  shareAdvise() {
    const { title, subtitle, summary } = this.form.value;
  }
}
