import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {


  // Check if the request URL contains 'amazonaws.com', which indicates a presigned S3 request
  if (req.url.includes('amazonaws.com')) {
    console.log("reached over herere")
    return next(req);  // Pass the request without adding the Authorization header
  }


  // Define the admin routes
  const adminRoutes: (string | RegExp)[] = [
    "/userlist",
    "/savebanner",
    "/deletebanner",
    "/getbanner",
    "/countuser",
    "/topfive",
    "/reportvideosAdmin",
    /^\/userds\/[a-f0-9]{24}\/status$/,  // Regular expression for /userds/:id/status (ObjectId format)
    "/generateCommonPresigner",
    "/verifybyadmin",
    "/noticebyadmin",
  ];


  // Get tokens from local storage
  const userToken: string = localStorage.getItem('authtoken') ?? "";
  const adminToken: string = localStorage.getItem('admintoken') ?? "";

  let token: string = "";


  // Check if the requested URL matches any of the admin routes
  // Check if the requested URL matches any of the admin routes
  const isAdminRoute = adminRoutes.some(route => {
    if (typeof route === 'string') {
      return req.url.includes(route);  // For string routes, match with includes
    } else if (route instanceof RegExp) {
      return route.test(req.url);  // For regex routes, use test
    }
    return false;
  });

  
  if (isAdminRoute) {
    token = adminToken;  // Use admin token for admin routes
  } else {
    token = userToken;  // Use user token for user routes
  }

  // If no token, return the request without adding Authorization header
  if (!token) {
    return next(req);
  }

  // Clone the request and add the Authorization header with the appropriate token
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq);



  //   const token :string = localStorage.getItem('authtoken') ?? localStorage.getItem('admintoken') ?? "";
  //   console.log("requst from inter",req)
  //   const authReq = req.clone({
  //     headers: req.headers.set('Authorization', `Bearer ${token}`)
  //   })
  // console.log("feom interceop",authReq)
  //   return next(authReq)
};
