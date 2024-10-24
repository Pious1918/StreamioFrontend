import { HttpInterceptorFn } from '@angular/common/http';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token :string = localStorage.getItem('admintoken') ?? "";
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })

  return next(authReq)
};
