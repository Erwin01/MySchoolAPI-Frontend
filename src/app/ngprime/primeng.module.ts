
import { NgModule } from '@angular/core'

import { ToastModule } from 'primeng/toast';

import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
    imports: [
        ToastModule,
        ConfirmDialogModule
    ],
    exports: [
        ToastModule,
        ConfirmDialogModule
    ],
    declarations: []
})

export class PrimeNGModule{}