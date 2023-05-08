import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    redirectTo: "socis",
    pathMatch: "full",
  }, {
    path: 'socis',
    loadChildren: () => import('./socis/socis.module').then(m => m.SocisModule)
  },

  {
    path: "administracio",
    loadChildren: () =>
      import(`./administracio/administracio.module`).then(
        (module) => module.AdministracioModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
