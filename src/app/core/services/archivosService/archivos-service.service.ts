import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosServiceService {

  private urlBase:string = 'http://localhost:8080/archivos';
  private http:HttpClient = inject(HttpClient);

  public postArchivoUsuario(id:number, archivo:File):Observable<Boolean>{
    const formData = new FormData();
    formData.append('id', id.toString());  // Convertimos el ID a string
    formData.append('archivo', archivo);   // Agregamos el archivo

    return this.http.post<Boolean>(`${this.urlBase}/subirArchivoUsuario`, formData);
  }


  public postArchivoServicio(idServicio:number, idNegocio:number ,archivo:File):Observable<Boolean>{
    const formData = new FormData();
    formData.append('idServicio', idServicio.toString());  // Convertimos el ID a string
    formData.append('idNegocio', idNegocio.toString()); // Agregamos la entidad si es un usuario o servicio
    formData.append('archivo', archivo);   // Agregamos el archivo
    return this.http.post<Boolean>(`${this.urlBase}/subirArchivoServicio`, formData);
  }

  public eliminarArchivoUsuario(id:number):Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.urlBase}/eliminarArchivoUsuario`, {params: {id: id.toString()}});
  }

  public eliminarArchivoServicio(id:number):Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.urlBase}/eliminarArchivoServicio`, {params: {id: id.toString()}});
  }

  public getArchivoUsuario(id:number):Observable<Blob>{
    return this.http.get(`${this.urlBase}/${id}`, {responseType: 'blob'});
  }

  public getArchivoServicio(idServicio:number, idNegocio:number):Observable<Blob>{
    return this.http.get(`${this.urlBase}/${idNegocio}/${idServicio}`, {responseType: 'blob'});
  }

}
