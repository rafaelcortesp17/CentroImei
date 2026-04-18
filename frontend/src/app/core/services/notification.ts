import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Notification {

  private snackBar = inject(MatSnackBar);

  releaseStatement(mensaje: string, clase: string) {
    this.snackBar.open(mensaje, 'Entendido', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: [clase]
    });
  }

  showSuccess(mensaje: string) {
    this.releaseStatement(mensaje, 'success-snackbar');
  }

  showError(mensaje: string) {
    this.releaseStatement(mensaje, 'error-snackbar');
  }

}
