import { IsInt, IsArray } from 'class-validator';

export class AssignBadgesDto {
  @IsInt()
  usuario_id: number;

  @IsArray()
  @IsInt({ each: true })
  insignia_ids: number[];
}