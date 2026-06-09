import {
  CAPABILITIES,
  CARGOS,
  type Capability,
  type Cargo,
  type StaffPermissions,
  type User,
} from "@workspace/db";

export { CAPABILITIES, CARGOS };
export type { Capability, Cargo, StaffPermissions };

/**
 * Default capability templates applied when a staff member is created with a
 * given cargo. Individual toggles can still override these per user.
 */
export const CARGO_DEFAULTS: Record<Cargo, Capability[]> = {
  vereador: [...CAPABILITIES],
  chefe_gabinete: [...CAPABILITIES],
  assessor_parlamentar: [
    "canManageDemands",
    "canRespondDemands",
    "canManageProjects",
    "canManageAgenda",
    "canManageStats",
  ],
  assessor_juridico: ["canManageDemands", "canRespondDemands", "canManageProjects"],
  assessor_comunicacao: [
    "canManageNews",
    "canManageAgenda",
    "canManageVoters",
    "canMessageVoters",
  ],
  assessor_imprensa: ["canManageNews", "canMessageVoters"],
  atendimento: [
    "canManageDemands",
    "canRespondDemands",
    "canManageAppointments",
    "canManageVoters",
  ],
};

export function defaultPermissionsFor(cargo: Cargo): StaffPermissions {
  const perms: StaffPermissions = {};
  for (const cap of CARGO_DEFAULTS[cargo] ?? []) perms[cap] = true;
  return perms;
}

/** True if the user is gabinete staff (not a plain citizen) and active. */
export function isActiveStaff(user: User | null | undefined): boolean {
  return !!user && user.role !== "citizen" && user.active;
}

/**
 * Capability check. The vereador (role "admin") always passes. Inactive users
 * and citizens never pass. Staff pass when the toggle is explicitly enabled.
 */
export function hasCapability(
  user: User | null | undefined,
  cap: Capability,
): boolean {
  if (!user || !user.active) return false;
  if (user.role === "admin") return true;
  if (user.role === "citizen") return false;
  return user.permissions?.[cap] === true;
}
