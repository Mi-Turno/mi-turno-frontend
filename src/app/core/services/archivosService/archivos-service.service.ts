import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosServiceService {

  private urlBase:string = 'http://localhost:8080/archivos';
  private http:HttpClient = inject(HttpClient);

  public postArchivo(id:number, archivo:File, entidad:string):Observable<Boolean>{
    const formData = new FormData();
    formData.append('id', id.toString());  // Convertimos el ID a string
    formData.append('entidad', entidad); // Agregamos la entidad si es un usuario o servicio
    formData.append('archivo', archivo);   // Agregamos el archivo

    console.log("ENTIDAD"+ entidad.toString());
    console.log("ENTIDAD FORM DATA: "+ formData.get('entidad'));

    
    return this.http.post<Boolean>(`${this.urlBase}/subir`, formData);
  }

  public eliminarArchivo(id:number):Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.urlBase}/eliminar`, {params: {id: id.toString()}});
  }

  public getArchivo(id:number):Observable<Blob>{
    return this.http.get(`${this.urlBase}/${id}`, {responseType: 'blob'});
  }

}
