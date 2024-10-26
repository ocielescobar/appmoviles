import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
const redireccionarLogin = () => redirectUnauthorizedTo(['/registrar']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redireccionarLogin },
    loadChildren: () => import('./page/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./page/registrar/registrar.module').then(m => m.RegistrarPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./page/recuperar/recuperar.module').then(m => m.RecuperarPageModule)
  },
  {
    path: 'ride-list',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redireccionarLogin },
    loadChildren: () => import('./page/ride-list/ride-list.module').then(m => m.RideListPageModule)
  },
  {
    path: 'create-ride',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redireccionarLogin },
    loadChildren: () => import('./page/create-ride/create-ride.module').then(m => m.CreateRidePageModule)
  },
  {
    path: 'reset-password',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redireccionarLogin },
    loadChildren: () => import('./page/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'profile',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redireccionarLogin },
    loadChildren: () => import('./page/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }