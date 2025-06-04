// :A: tldr Zod schemas for runtime validation
import { z } from 'zod';

// :A: api Base schemas for reusability
const markerSchema = z.string()
  .min(1, 'Marker cannot be empty')
  .max(50, 'Marker too long')
  .regex(/^[a-zA-Z0-9_@-]+(\([^)]*\))?$/, 'Invalid marker format');

const lineNumberSchema = z.number()
  .int('Line number must be an integer')
  .positive('Line number must be positive');

const columnNumberSchema = z.number()
  .int('Column number must be an integer')
  .positive('Column number must be positive');

// :A: api Magic Anchor schema
export const magicAnchorSchema = z.object({
  line: lineNumberSchema,
  column: columnNumberSchema,
  raw: z.string().min(1, 'Raw line cannot be empty'),
  markers: z.array(markerSchema).min(1, 'At least one marker required'),
  prose: z.string().optional(),
  file: z.string().optional(),
});

export type MagicAnchorValidated = z.infer<typeof magicAnchorSchema>;

// :A: api Parse Error schema
export const parseErrorSchema = z.object({
  line: lineNumberSchema,
  column: columnNumberSchema,
  message: z.string().min(1, 'Error message cannot be empty'),
  raw: z.string(),
});

export type ParseErrorValidated = z.infer<typeof parseErrorSchema>;

// :A: api Parse Result schema
export const parseResultSchema = z.object({
  anchors: z.array(magicAnchorSchema),
  errors: z.array(parseErrorSchema),
});

export type ParseResultValidated = z.infer<typeof parseResultSchema>;

// :A: api Search Options schema
export const searchOptionsSchema = z.object({
  markers: z.array(markerSchema).optional(),
  files: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  context: z.number().int().nonnegative().optional(),
  recursive: z.boolean().optional(),
  respectGitignore: z.boolean().optional(),
});

export type SearchOptionsValidated = z.infer<typeof searchOptionsSchema>;

// :A: api output format options
export const outputFormatSchema = z.enum(['terminal', 'json', 'csv']);

// :A: api CLI command schemas
export const parseCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  verbose: z.boolean().optional(),
  format: outputFormatSchema.optional(),
});

export const searchCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  context: z.string().regex(/^\d+$/, 'Context must be a number').optional(),
  format: outputFormatSchema.optional(),
  // Controls whether to respect .gitignore files during search
  // Default: true (respects .gitignore)
  // CLI flag --no-gitignore sets this to false
  gitignore: z.boolean().default(true),
});

export const listCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  markers: z.boolean().optional(),
  format: outputFormatSchema.optional(),
  // Controls whether to respect .gitignore files during listing
  // Default: true (respects .gitignore)
  // CLI flag --no-gitignore sets this to false
  gitignore: z.boolean().default(true),
});

// :A: api File path validation
export const filePathSchema = z.string()
  .min(1, 'File path cannot be empty')
  .refine((path) => !path.includes('\0'), 'File path cannot contain null bytes');

// :A: api Anchor payload validation
export const anchorPayloadSchema = z.string()
  .min(1, 'Anchor payload cannot be empty')
  .refine((payload) => {
    // Must have at least one non-whitespace character
    return payload.trim().length > 0;
  }, 'Anchor payload must contain non-whitespace characters');

// :A: api Create validated parse input
export const parseInputSchema = z.object({
  content: z.string(),
  filename: filePathSchema.optional(),
});

export type ParseInputValidated = z.infer<typeof parseInputSchema>;