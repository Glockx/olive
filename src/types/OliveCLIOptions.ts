import z from "zod";

export interface OliveCLIOptions {
  count: number;
  width: number;
  height: number;
  size?: number;
  type: "solid" | "gradient" | "text";
  color: string;
  startColor: string;
  endColor: string;
  direction: "horizontal" | "vertical";
  text: string;
  font: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  format: "png" | "jpeg";
  quality: number;
  output: string;
  prefix: string;
  verbose: boolean;
  fontFile?: string;
}

export const optsSchema = z.object({
  count: z.number().int().min(1, { message: "Count must be at least 1" }),
  width: z.number().int().min(1, { message: "Width must be positive" }),
  height: z.number().int().min(1, { message: "Height must be positive" }),
  size: z.number().int().min(1).optional().nullable(),
  type: z.enum(["solid", "gradient", "text"]),
  color: z.string(),
  startColor: z.string(),
  endColor: z.string(),
  direction: z.enum(["horizontal", "vertical"]),
  text: z.string(),
  font: z.string(),
  fontSize: z.number().int().min(1),
  textColor: z.string(),
  backgroundColor: z.string(),
  format: z.enum(["png", "jpeg"]),
  quality: z.number().int().min(0).max(100),
  output: z.string(),
  prefix: z.string(),
  verbose: z.boolean(),
  fontFile: z.string().optional().nullable(),
});
