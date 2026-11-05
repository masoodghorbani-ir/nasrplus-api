import { Model, Types } from 'mongoose';
import { ApiError } from './api-error';

export interface ReferenceUsage {
  model: Model<any>;
  field: string;
  label: string;
}

/**
 * Rejects deletion when the given id is stored on another collection.
 * Call this before every delete of base data or any related record.
 */
export async function assertNotReferenced(id: string, usages: ReferenceUsage[]): Promise<void> {
  if (!Types.ObjectId.isValid(id) || usages.length === 0) {
    return;
  }

  const objectId = new Types.ObjectId(id);
  const matches = await Promise.all(
    usages.map(async (usage) => {
      const found = await usage.model.exists({ [usage.field]: objectId });
      return found ? usage.label : null;
    })
  );

  const referencedBy = [...new Set(matches.filter((label): label is string => Boolean(label)))];
  if (referencedBy.length > 0) {
    throw ApiError.conflict(
      `Cannot delete this record because it is used by: ${referencedBy.join(', ')}`
    );
  }
}
