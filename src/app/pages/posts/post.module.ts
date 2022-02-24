import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostComponentsModule } from './components/components.module';

@NgModule({
  imports: [
      CommonModule
    , FormsModule
    , ReactiveFormsModule 
    , IonicModule
    , PostPageRoutingModule
    , SharedModule
    , PostComponentsModule
  ],
  declarations: [
      PostPage
  ]
})
export class PostPageModule {}
