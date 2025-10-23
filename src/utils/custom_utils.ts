import { randomBytes } from "crypto";
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export class CustomUtils {
  static responseApi(mensaje: string, data?: any) {
    return {
      mensaje,
      data: data ?? null,
    };
  }

  static delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  static generateNumericCode(length: number = 6): string {
    const max = Math.pow(10, length) - 1;
    const min = Math.pow(10, length - 1);
    const randomBuffer = randomBytes(4);
    const randomInt = randomBuffer.readUInt32BE(0);
    const randomNumber = min + (randomInt % (max - min + 1));
    return randomNumber.toString().padStart(length, '0');
  }

  static async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  static async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  static sumarMinutos(date: Date, minutes: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  static formatEcuadorPhone(
    phoneNumber: string, 
    countryCode: string = '+593'
  ): string {
    if (!phoneNumber) {
      throw new Error('El número telefónico no puede estar vacío');
    }
    // Limpiar el número de cualquier carácter no numérico
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    // Validar que el número tenga entre 9 y 10 dígitos (dependiendo del código de área)
    if (cleanedPhone.length < 9 || cleanedPhone.length > 10) {
      throw new Error(`Número telefónico inválido: ${phoneNumber}`);
    }
    // Si el número ya tiene código de país, retornarlo tal cual
    if (cleanedPhone.startsWith('593')) {
      return `+${cleanedPhone}`;
    }
    // Si el número empieza con 0, reemplazarlo por el código de país
    if (cleanedPhone.startsWith('0')) {
      return `${countryCode}${cleanedPhone.substring(1)}`;
    }
    // Si el número no empieza con 0 pero tiene 9 dígitos, agregar código de país
    if (cleanedPhone.length === 9) {
      return `${countryCode}${cleanedPhone}`;
    }
    // Si el número tiene 10 dígitos y no empieza con 0, asumir que ya incluye código de área
    if (cleanedPhone.length === 10) {
      return `${countryCode}${cleanedPhone}`;
    }
    // Para cualquier otro caso, retornar con código de país
    return `${countryCode}${cleanedPhone}`;
  }

  static fechaHoraActualLegible(): string {
    moment.locale('es');
    const fecha = moment().format('LL [a las] LTS');
    return fecha;
  }

  static fechaActualLegible(): string {
    moment.locale('es');
    const fecha = moment().format('LL');
    return fecha;
  }
}
