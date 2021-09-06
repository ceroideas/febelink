import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Index1Component } from './index1/index1.component';

const routes: Routes = [
    {
        path: '',
        component: Index1Component
    },
    {
        path: 'index-1',
        component: Index1Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
