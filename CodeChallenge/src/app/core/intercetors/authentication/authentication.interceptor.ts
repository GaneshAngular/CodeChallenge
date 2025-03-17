import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {

  const cloneReq=req.clone({
    setHeaders:{
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  return next(cloneReq);
};
