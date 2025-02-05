import { ChangeDetectionStrategy, Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { BotonComponent } from '../boton/boton.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-pregunta',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './modal-pregunta.component.html',
  styleUrl: './modal-pregunta.component.css'
})
export class ModalPreguntaComponent {
  @Input() pregunta:string = '';
  @Input() tituloPregunta: string = "";
  @Input() botonPositivo: string = "";
  @Input() botonNegativo: string = "";
  @Output() respuesta = new EventEmitter<boolean>(); // Emitimos la respuesta al padre

  readonly dialog = inject(MatDialog);

   public openDialog(): void {
    const dialogRef = this.dialog.open(DialogPregunta, {
      width: '250px',
      data: {pregunta: this.pregunta, tituloPregunta: this.tituloPregunta, botonPositivo: this.botonPositivo, botonNegativo: this.botonNegativo}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.respuesta.emit(result);
    });
  }
}

@Component({
  selector: 'dialog-pregunta',
  templateUrl: './dialog-pregunta.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPregunta {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { pregunta: string; tituloPregunta: string; botonPositivo: string, botonNegativo: string }) {}
  readonly dialogRef = inject(MatDialogRef<DialogPregunta>);
@Input() tituloModal = "";
@Input() pregunta = "";

cerrar(respuesta: boolean) {
  this.dialogRef.close(respuesta);
}
}

