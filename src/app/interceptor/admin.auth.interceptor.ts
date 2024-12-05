import { HttpInterceptorFn } from '@angular/common/http';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {


  if (req.url.includes('amazonaws.com')) {
    console.log("reached over herere")
    return next(req);  // Pass the request without adding the Authorization header
  }
  const token :string = localStorage.getItem('admintoken') ?? "";

  console.log("tokennnadmin",token)
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })

  return next(authReq)
};
