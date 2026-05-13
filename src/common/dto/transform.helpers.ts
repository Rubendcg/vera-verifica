import { TransformFnParams } from 'class-transformer';

export function toOptionalTrimmedString({ value }: TransformFnParams) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function toUppercaseTrimmedString(params: TransformFnParams) {
  const normalized = toOptionalTrimmedString(params);
  return typeof normalized === 'string' ? normalized.toUpperCase() : normalized;
}

export function toBooleanLike({ value }: TransformFnParams) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  return value;
}

export function toNumberLike({ value }: TransformFnParams) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}
