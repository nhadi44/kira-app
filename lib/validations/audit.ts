import { z } from "zod";

export const scanModeSchema = z.enum(["Quick", "Deep"]);

export const auditSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters").max(100),
  codeSnippet: z
    .string()
    .min(10, "Code snippet is too short")
    .max(100000, "Code input exceeds limit"), // Increased for projects
  scanMode: scanModeSchema.default("Deep"),
});

export type AuditInput = z.infer<typeof auditSchema>;

export const severitySchema = z.enum(["Critical", "High", "Medium", "Low"]);

export const findingSchema = z.object({
  type: z.string(),
  severity: severitySchema,
  description: z.string(),
  remediation: z.string(),
  file: z.string().optional(),
  line: z.number().optional(),
  impact: z.string().optional(),
  confidence: z.string().optional().transform((val) => {
    const allowed = ["High", "Medium", "Low"];
    return (allowed.includes(val || "") ? val : "Medium") as "High" | "Medium" | "Low";
  }).default("Medium"),
  attackScenario: z.string().optional(),
  category: z.string().optional().transform((val) => {
    const allowed = ["Authentication", "Infrastructure", "Dependency", "PII Exposure", "Access Control", "Configuration", "Injection", "Others"];
    return allowed.includes(val || "") ? val : "Others";
  }).default("Others"),
  vulnerableCode: z.string().optional(),
  exploitabilityReasoning: z.string().optional(),
  validationTest: z.string().optional(),
  testFramework: z.string().optional().transform((val) => {
    const allowed = ["Jest", "Vitest", "PHPUnit", "Pytest", "Go test"];
    return allowed.includes(val || "") ? val : undefined;
  }),
  // Phase 9: Enterprise Taxonomy
  owasp: z.string().optional(),
  cwe: z.string().optional(),
  exploitability: z.enum(["Low", "Moderate", "High", "Critical"]).optional().default("Moderate"),
  affectedComponent: z.string().optional(),
  executiveRisk: z.string().optional(),
  whyItMatters: z.string().optional(),
  structuredRemediation: z.object({
    immediateFix: z.string(),
    recommendedPattern: z.string(),
    validationRecommendation: z.string(),
    regressionProtection: z.string(),
  }).optional(),
});

export const auditResponseSchema = z.object({
  score: z.number().min(0).max(100),
  executiveSummary: z.string().optional().default("Analysis completed. No critical overview provided by engine."),
  findings: z.array(findingSchema),
  metadata: z.object({
    filesScanned: z.number().optional(),
    scanDuration: z.string().optional(),
  }).optional(),
});

export type AuditFinding = z.infer<typeof findingSchema>;
export type AuditResponse = z.infer<typeof auditResponseSchema>;
export type SeverityLevel = z.infer<typeof severitySchema>;
export type ScanMode = z.infer<typeof scanModeSchema>;
