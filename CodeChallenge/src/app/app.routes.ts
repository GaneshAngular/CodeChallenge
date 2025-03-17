import { Routes } from '@angular/router';
import { restrictChallengePageGuard } from './core/guards/challengePage/restrict-challenge-page.guard';
import { isLoggedGuard } from './core/guards/isLogged/is-logged.guard';


export const routes: Routes = [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'

},
  {
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate:[isLoggedGuard],
  children:[
    {
      path:'',
      redirectTo:'interviews',
      pathMatch:'full'
    },{
      path:'interviews',
      loadComponent:()=> import('./pages/dashboard/interview/interview.component').then(i=>i.InterviewComponent)
    },{
      path:'sessions',
      loadComponent:()=> import('./pages/dashboard/session/session.component').then(i=>i.SessionComponent)
    },{
      path:'projects',
      loadComponent:()=> import('./pages/dashboard/project/project.component').then(i=>i.ProjectComponent)
    }
  ]
},{
  path:'login',
  loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  canActivate:[isLoggedGuard]
},
// ,{
//   path:'live/challenge/expired',
//   loadComponent: () => import('./pages/session-end/session-end.component').then(m => m.SessionEndComponent)
// },
{
  path:'live/challenge/:id',
  // component:LiveChallengeComponent,
  loadComponent:()=>import('./pages/live-challenge/live-challenge.component').then(i=>i.LiveChallengeComponent),
  canDeactivate:[restrictChallengePageGuard],
},{
  path:'live/interview/:id',
  loadComponent: () => import('./pages/live-interview/live-interview.component').then(m => m.LiveInterviewComponent)
},{
  path:'response/:message',
  loadComponent: () => import('./pages/session-end/session-end.component').then(m => m.SessionEndComponent)
},{
  path:'notFound',
  loadComponent:()=>import('./pages/not-found-404/not-found-404.component').then(m=>m.NotFound404Component)
}
,{
  path:'**',
   redirectTo:'/notFound',
  pathMatch:'full'
}
];
