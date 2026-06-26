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

## Review

Before considering the task complete:

- Review the generated diff.
- Verify that only the requested code changed.
- Stop if unrelated modifications appear.

## Build

When the project provides a build command:

- Build before proposing a commit.
- Stop if the build fails.

## Git

- Never commit automatically.
- Never push automatically.