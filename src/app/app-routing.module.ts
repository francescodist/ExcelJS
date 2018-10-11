import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../pages/home/home.component';
import {HomeModule} from '../pages/home/home.module';
import {CheckDelegationComponent} from '../pages/check-delegation/check-delegation.component';
import {CheckDelegationModule} from '../pages/check-delegation/check-delegation.module';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'check-delegation', component: CheckDelegationComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        HomeModule,
        CheckDelegationModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


