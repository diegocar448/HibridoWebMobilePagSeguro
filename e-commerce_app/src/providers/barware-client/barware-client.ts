import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class BarwareClient {

  private apiURL: string;

  private apiVersion: string;

  constructor(private http: Http) {
    //this.apiURL = "http://localhost";
    this.apiURL = "http://localhost/laravel54-ionic2-serie/public/";
    this.apiVersion = "v1";
  }



  get(endpoint: string, data?: object, headers?: object) {
    if (typeof data == "object" && data != null && Object.keys(data).length > 0) {
      endpoint += "?" + this.jsonToUrlEnconded(data);
    }

    let options = new RequestOptions({headers: this.getHeaders(headers)});
    return this.http
        .get(this.urlWithEndpoint(endpoint), options)
        .toPromise();
  }

  post(endpoint: string, data: object, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    let body = JSON.stringify(data);
    return this.http
        .post(this.urlWithEndpoint(endpoint), body, options)
        .toPromise();
  }

  put(endpoint: string, data: object, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    let body = JSON.stringify(data);
    return this.http
        .put(this.urlWithEndpoint(endpoint), body, options)
        .toPromise();
  }

  patch(endpoint: string, data: object, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    let body = JSON.stringify(data);
    return this.http
        .patch(this.urlWithEndpoint(endpoint), body, options)
        .toPromise();
  }

  delete(endpoint: string, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    return this.http
        .delete(this.urlWithEndpoint(endpoint), options)
        .toPromise();
  }

  auth(data: object, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    let body = JSON.stringify(data);
    return this.http
        .post(this.apiURL + "/oauth", body, options)
        .toPromise();
  }

  revokeToken(data: {token: string, token_type_hint: string}, headers?: object) {
    let options = new RequestOptions({headers: this.getHeaders(headers)});
    let body = JSON.stringify(data);
    return this.http
        .post(this.apiURL + "/oauth/revoke", body, options)
        .toPromise();
  }

  refreshToken(data: any, headers?: object) {
    data.grant_type = "refresh_token";
    return this.auth(data, headers);
  }

  private urlWithEndpoint(endpoint: string) {
    let apiURI = this.apiURL + "/" + this.apiVersion;
    endpoint = endpoint.replace(apiURI, "");
    return apiURI + endpoint;
  }

  private jsonToUrlEnconded(obj: any) {
    var str = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
      }
    }
    return str.join("&");
  }

  private getHeaders(headers: object) {
    if (typeof headers === "undefined") {
      headers = {"Content-Type" : "application/json"};
    } else {
      headers["Content-Type"] = "application/json";
    }
    return new Headers(headers);
  }
}