import { IsInt } from 'class-validator';

export class AssignLevelDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  nivel_id: number;
}