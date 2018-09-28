import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostsPage } from './posts';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PostsPage
  ],
  imports: [
    IonicPageModule.forChild(PostsPage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PostsPageModule {}