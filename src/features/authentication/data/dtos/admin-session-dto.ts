import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";

export type AdminSessionDto = {
  admin_id: string;
  email: string;
};

export function adminSessionToDomain(dto: AdminSessionDto): AdminSession {
  return {
    adminId: dto.admin_id,
    email: dto.email,
  };
}
