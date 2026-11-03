import assert from "node:assert/strict";
import { generateExamQuestions } from "../lib/ai";
import { defaultCpmks, defaultMaterials, profile } from "../lib/mock-data";
import type { ApiKeySetting, AssessmentScope } from "../lib/types";

async function main() {
  const scope: AssessmentScope = {
    courseId: "eko-bisnis",
    type: "uts",
    sessionFrom: 1,
    sessionTo: 7,
    cpmkCodes: ["CPMK 1", "CPMK 2"],
  };

  const dummySetting: ApiKeySetting = {
    provider: "gemini",
    key: "",
    model: "gemini-1.5-flash",
    status: "unset",
    lastCheckedAt: null,
  };

  const res = await generateExamQuestions(
    {
      scope,
      cpmks: defaultCpmks["eko-bisnis"],
      materials: defaultMaterials,
      profile,
      style: "interest",
      format: "multiple-choice",
      count: 3,
    },
    dummySetting
  );

  assert.equal(res.source, "curated", "Should fallback to curated when no key is set");
  assert.ok(res.questions.length > 0, "Should return curated questions");
  assert.equal(res.questions[0].format, "multiple-choice");
  assert.ok(res.questions[0].options?.length === 4, "MCQ must have 4 options");
  assert.ok(res.questions[0].correctOptionId, "Must have correct option");
  console.log("✓ testOfflineFallback passed with", res.questions.length, "questions");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
