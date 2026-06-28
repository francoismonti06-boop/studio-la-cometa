# Workflow

## Purpose

Follow a predictable workflow.
Do not skip steps.

## Standard workflow

Read

↓

Analyze

↓

Plan

↓

Edit

↓

Review

↓

Build

↓

Commit

## Editing

For localized code changes:

- Never edit an entire file if only one block must change.
- Prefer Edit mode on the selected code.
- Generate the smallest possible patch.
- Preserve the existing architecture.

## Context

Prefer explicit context over implicit search.

Use:

- @Current File
- @Files

Avoid relying on generic workspace searches when specific files are known.

## Agent Execution

For large files:

- Ask the agent to work incrementally.
- One logical change per diff.
- Review each diff before continuing.
- Reject any unrelated modification before proceeding.
- If the agent encounters ambiguous replacements, require it to narrow the context before editing instead of broad replacements.

## Review

Before considering the task complete:

- Review the generated diff.
- Verify that only the requested code changed.
- Verify that braces, brackets and object/array closures are still correct around the edited block.
- When migrating Sanity fields to custom localized types, check incompatible native properties such as rows, options, list, or layout before keeping them.
- Distinguish editorial fields from internal fields. Do not localize identifiers, slugs, or other technical fields unless explicitly required.
- Stop if unrelated modifications appear.

## Build

When the project provides a build command:

- Build before proposing a commit.
- Stop if the build fails.

## Git

- Never commit automatically.
- Never push automatically.