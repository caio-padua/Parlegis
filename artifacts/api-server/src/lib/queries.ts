import { eq } from "drizzle-orm";
import {
  db,
  demandsTable,
  categoriesTable,
  neighborhoodsTable,
} from "@workspace/db";

export const demandColumns = {
  id: demandsTable.id,
  protocol: demandsTable.protocol,
  title: demandsTable.title,
  description: demandsTable.description,
  status: demandsTable.status,
  categoryId: demandsTable.categoryId,
  categoryName: categoriesTable.name,
  neighborhoodId: demandsTable.neighborhoodId,
  neighborhoodName: neighborhoodsTable.name,
  photoUrl: demandsTable.photoUrl,
  citizenName: demandsTable.citizenName,
  citizenEmail: demandsTable.citizenEmail,
  citizenPhone: demandsTable.citizenPhone,
  createdAt: demandsTable.createdAt,
  updatedAt: demandsTable.updatedAt,
};

export function demandsQuery() {
  return db
    .select(demandColumns)
    .from(demandsTable)
    .leftJoin(categoriesTable, eq(demandsTable.categoryId, categoriesTable.id))
    .leftJoin(
      neighborhoodsTable,
      eq(demandsTable.neighborhoodId, neighborhoodsTable.id),
    );
}

export function makeProtocol(prefix: string): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${rand}`;
}
