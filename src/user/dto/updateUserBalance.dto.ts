import { IsNumber } from 'class-validator';

export class UpdateUserBalanceDto {
  @IsNumber()
  balance: number;
}
