import { ESLint } from "eslint";
import path from "path";
import fs from "fs";
import { it, expect } from "vitest";

const supportedExtensions = [".js", ".ts", ".tsx"];

// grabs the rule meta for each of the rules in the config and asserts that they
// are not marked as deprecated. works by using the eslint node API
// https://eslint.org/docs/developer-guide/nodejs-api
it("is a valid config and doesn't include any deprecated rules", async () => {
  // used to consolidate the different rules while iterating
  const allRuleIds = new Set();
  const allRuleMetas = new Map();

  for (const extension of supportedExtensions) {
    // in order to pull the "rules meta" which contains the deprecated flag,
    // we have to initialize the linter for different file types so we iterate
    // through the supported extensions and ensure the file exists
    const filePath = path.resolve(__dirname, `_fake-file${extension}`);

    await fs.promises.writeFile(filePath, "// intentionally blank");

    const eslint = new ESLint();

    // this initializes the linter for the current extension.
    // note: this does return a list of results but we don't use them. we only
    // need to run `lintFiles` to make `getRulesMetaForResults` return the
    // appropriate meta data
    await eslint.lintFiles([filePath]);

    // this calculates the config file relative to the current extensions
    const config = await eslint.calculateConfigForFile(filePath);
    // config.rules is keyed by `ruleId`s
    const ruleIds = Object.keys(config.rules);

    // in order for `getRulesMetaForResults` to give us something, we need to
    // create some fake results, at the time of this writing, `ruleId` is the
    // only required key needed to grab rule meta
    // https://github.com/eslint/eslint/blob/808ad35f204c838cd5eb8d766807dc43692f42f9/lib/eslint/eslint.js#L525
    const fakeFile = {
      filePath,
      messages: ruleIds.map((ruleId) => ({ ruleId })),
    };

    const rulesMeta = eslint.getRulesMetaForResults([fakeFile]);

    for (const ruleId of ruleIds) {
      allRuleIds.add(ruleId);
    }

    for (const [ruleId, ruleMeta] of Object.entries(rulesMeta)) {
      allRuleMetas.set(ruleId, ruleMeta);
    }

    // clean up
    await fs.promises.rm(filePath);
  }

  // this ensures that all rule metas were grabbed
  expect(allRuleMetas.size).toBe(allRuleIds.size);

  for (const [ruleId, ruleMeta] of allRuleMetas) {
    if (ruleMeta?.deprecated) {
      // didn't use `expect` so the `ruleId` could be included in the error
      throw new Error(`${ruleId} is deprecated`);
    }
  }
});
