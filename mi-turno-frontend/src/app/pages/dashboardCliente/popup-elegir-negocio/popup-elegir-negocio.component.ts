import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';

@Component({
  selector: 'app-popup-elegir-negocio',
  standalone: true,
  imports: [MatIcon,RouterModule],
  templateUrl: './popup-elegir-negocio.component.html',
  styleUrl: './popup-elegir-negocio.component.css'
})
export class PopupElegirNegocioComponent implements OnInit {
  @Input() listadoNegocios:NegocioInterface[] =[];
  @Output() clickBoton: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {
    console.log("popup levantado");
  }

  negocioElegido(idNegocio:number){
    this.clickBoton.emit(idNegocio);
  }

  cerrarPopup(){
    this.clickBoton.emit(0)
  }




}
