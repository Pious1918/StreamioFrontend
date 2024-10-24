import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {


// Check if the request URL contains 'amazonaws.com', which indicates a presigned S3 request
if (req.url.includes('amazonaws.com')) {
  return next(req);  // Pass the request without adding the Authorization header
}

  const token :string = localStorage.getItem('authtoken') ?? "";
  console.log("requst from inter",req)
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })

  return next(authReq)
};
