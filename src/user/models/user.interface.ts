// user.interface.ts
export interface User {
  id?: number;
  idNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
}
