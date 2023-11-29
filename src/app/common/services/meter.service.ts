import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_VERSION, BASE_PATH } from '../variable';
import { Observable } from 'rxjs';
import { Meter, MeterResponse } from '../models/meter';

@Injectable({
  providedIn: 'root'
})
export class MeterService {

  protected basePath = "/";
  protected apiVersion = "1";
  constructor(
    protected httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string,
    @Inject(API_VERSION) apiVersion: string,
  ) { 
    this.basePath = basePath;
    this.apiVersion = apiVersion;    
  }

  getMeters(search?: string, pageNumber?: number, pageSize?: number): Observable<MeterResponse> 
  {
   let queryParameters = new HttpParams();

   if (search !== undefined && search !== null)
   {
    queryParameters = queryParameters.set('searchKey', search);
   }
  if (pageNumber !== undefined && pageNumber !== null)
   {
    queryParameters = queryParameters.set('pageNumber', pageNumber);
   }
   if (pageSize !== undefined && pageSize !== null)
   {
    queryParameters = queryParameters.set('pageSize', pageSize);
   }

   console.log('queryParameters',queryParameters)
    return this.httpClient.get<MeterResponse>
    (`${this.basePath}/api/v${this.apiVersion}/administration/meter`, {params: queryParameters});
  }

  postMeters(meter: Meter): Observable<any> {
    return this.httpClient.post<any>
    (`${this.basePath}/api/v${this.apiVersion}/administration/meter`, meter)
  }

  putMeters(meter: Meter): Observable<any> {
    return this.httpClient.put<any>
    (`${this.basePath}/api/v${this.apiVersion}/administration/meter/${meter.id}`, meter)
  }

  getMetersById(id: number): Observable<any> {
    return this.httpClient.get<any>
    (`${this.basePath}/api/v${this.apiVersion}/administration/meter/${id}`)
  }

  deleteMeters(id: number): Observable<any> {
    return this.httpClient.delete<any>
    (`${this.basePath}/api/v${this.apiVersion}/administration/meter/${id}`)
  }
}
