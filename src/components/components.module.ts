import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { SinogramComponent } from './sinogram/sinogram';
import { PostComponent } from './post/post';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [SinogramComponent,
	PostComponent],
	imports: [CommonModule, IonicModule],
	exports: [SinogramComponent,
	PostComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ComponentsModule {}
