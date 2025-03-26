import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StocksOverviewComponent } from './components/stocks-overview/stocks-overview.component';

const routes: Routes = [
  {
    path: 'stocks',
    component: StocksOverviewComponent,
  },

  { path: '', redirectTo: 'stocks', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
