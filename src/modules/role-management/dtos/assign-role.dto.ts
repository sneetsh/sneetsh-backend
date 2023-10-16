import { IsUUID } from "class-validator";

export class AssignRoleDTO {
  @IsUUID()
  user_id: string;

  @IsUUID(null, { each: true })
  role_ids: string[];
}
