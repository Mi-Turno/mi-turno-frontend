import { Component, computed, EventEmitter, inject, model, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatIcon } from '@angular/material/icon';

interface DialogData {
  horario: string;
}

@Component({
  selector: 'app-dialogo-horarios-profesional',
  standalone: true,
  imports: [],
  templateUrl: './dialogo-horarios-profesional.component.html',
})
export class DialogoHorariosProfesionalComponent {
  iconos = ICONOS;

  readonly dialog = inject(MatDialog);

  @Output() respuesta = new EventEmitter<string>();
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogoPreguntaHorarios, {
      width: '300px',
      height: '230px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.respuesta.emit(result);
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialogo-pregunta-horarios.html',
  styleUrl: './dialogo-horarios-profesional.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
  ],
})
export class DialogoPreguntaHorarios {
  readonly dialogRef = inject(MatDialogRef<DialogoPreguntaHorarios>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly horario = model(this.data.horario);
  readonly horarioInvalido = computed(() => !this.esHorarioValido(this.horario()));


  iconos = ICONOS;


  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmarHorario() {
    if (this.esHorarioValido(this.horario())) {
      this.dialogRef.close(this.horario()); // Cierra el diálogo si el horario es válido
    }
  }

  //Verifica que el horario esté en los parametros requeridos 
  esHorarioValido(horario: string): boolean {
    console.log(horario);
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(horario);
  }

  mostrarMensajeError(): string {
    return 'La hora debe ser entre 00:00 y 23:59';
  }


}
