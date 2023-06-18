import {SeoService} from 'src/app/services/seo.service';
import {AdviseService} from './../services/advises.service';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IAdviseFull} from '../models/advises.model';

const GENERAL_TITLE = 'Feed Oráculo | Febelink ¿Qué necesitas?';

@Component({
  selector: 'app-post-advise',
  templateUrl: './advise.page.html',
  styleUrls: ['./advise.page.scss'],
})
export class AdvisePage implements OnInit {
  @Input() id: number;
  @Input() iAdvise: IAdviseFull;

  isLoading: boolean = false;

  paramsQuery: any;
  paramsUrl: any;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private adviseSvc: AdviseService,
    private seoService: SeoService
  ) {
  }

  async ngOnInit() {
    this.paramsQuery = this.actRoute.snapshot.queryParamMap;
    this.paramsUrl = this.actRoute.snapshot.params;

    if (this.paramsUrl?.id) {
      await this.getPost(this.paramsUrl?.id);
    }

    this.seoService.generateTags({
      title: GENERAL_TITLE,
      image: this.iAdvise?.media_url,
      description: this.iAdvise?.content,
    });
  }

  /* If has id -> editing post */
  async getPost(id: number) {
    this.id = id;
    this.isLoading = true;

    const {response, error} = await this.adviseSvc.get(id);
    /* if( error )
      this.toastSvc.show( error.message || error.msg || 'An error ocurred on getPost' ) */

    this.iAdvise = !response?.id ? null : response;

    this.isLoading = false;

    // To Trigger Asynchronously Issue to Give Tokens by Views
    this.adviseSvc.issue(id);
  }

  backButton() {
    this.router.navigate(['oracles']);
  }

  newOne() {
    this.router.navigate(['oracle/create']);
  }
}
