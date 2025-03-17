import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const isLogin=route.routeConfig?.path=='login'

  const router=inject(Router)
  isLogin
  const token = localStorage.getItem('token');
  if( isLogin && token){
  return false ;
  }else if( !isLogin && token){
   return true;
  }else if(isLogin && !token){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }

};
