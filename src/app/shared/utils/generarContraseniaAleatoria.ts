export default function generarContraseniaAleatoria(longitud: number, incluirNumeros = true, incluirMayusculas = true, incluirMinusculas = true, incluirEspeciales = true): string {
  const numeros = '0123456789';
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const especiales = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let caracteresPermitidos = '';
  if (incluirNumeros) caracteresPermitidos += numeros;
  if (incluirMayusculas) caracteresPermitidos += mayusculas;
  if (incluirMinusculas) caracteresPermitidos += minusculas;
  if (incluirEspeciales) caracteresPermitidos += especiales;

  if (caracteresPermitidos.length === 0) {
      throw new Error("Debe seleccionar al menos un tipo de carácter.");
  }

  let contrasenia = '';
  for (let i = 0; i < longitud; i++) {
      const randomIndex = Math.floor(Math.random() * caracteresPermitidos.length);
      contrasenia += caracteresPermitidos[randomIndex];
  }

  return contrasenia;
}
