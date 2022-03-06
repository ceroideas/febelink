import { TranslateConfigService } from './translate/translate-config.service';
import { Injectable } from '@angular/core';
import { IReport } from '../models/report.model';
import { AlertSvc } from './alert.service';
import { HttpService } from './http.service';
import { LoadingSvc } from './loading.service';
import { ToastSvc } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

    constructor(
        private alertSvc: AlertSvc
        , private toastSvc: ToastSvc
        , private loadingSvc: LoadingSvc
        , private translateSvc: TranslateConfigService
        , private http: HttpService
    ) {}

    async show( report: IReport ) {
        this.alertSvc.show({
            title: 'common.report.create.title'
            , msg: 'common.report.create.msg'
            
            , inputs: [{
                  name: 'report',
                  id: 'report',
                  type: 'textarea',
                  placeholder: this.translateSvc.instant( 'common.report.create.placeholder' )
            }]
            
            , buttons: [{
                    text: 'common.buttons.cancel',
                    dismiss: true,
                }, {
                    text: 'common.buttons.report',
                    handler: ( data ) => {
                        if(( data?.report || '' ).trim().split( ' ' ).length < 5 ) {
                            this.toastSvc.show( 'common.mailTo.error.minLength', true )
                            return false
                        }
                        this.exec({ ...report, why: data?.report })
                    }
            }]
        }, true )
    }

    async exec( report: IReport )
    {
        await this.loadingSvc.show()

        const { response, error } = await this.http.post( 'report', report )
        this.toastSvc.show( error
            ? error.msg || error.message || 'Could not post Report'
            : response.msg || response.message
        , true )

        await this.loadingSvc.dismiss()
    }
}
