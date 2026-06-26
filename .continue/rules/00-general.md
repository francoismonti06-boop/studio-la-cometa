# General Development Rules

## Core principles

- Make the smallest possible change.
- Preserve the existing architecture.
- Never refactor unless explicitly requested.
- Never modify multiple files unless explicitly requested.
- Do not rename files, folders or symbols without permission.
- Preserve the existing coding style of the project.

## Project isolation

Before performing any task:

- Verify the current workspace.
- Verify the current Git repository.
- Verify the current branch.
- Ignore every previous conversation that belongs to another project.
- Never use context from another project unless explicitly provided in the current task.
- If the current request belongs to a different project, stop and ask for confirmation before modifying any file.

## Safety

- Do not invent APIs.
- Do not remove existing validations.
- Do not change business logic unless requested.
- Do not introduce new dependencies unless requested.
- Do not change configuration files unless requested.

## Code modifications

- Modify only the requested section.
- Keep existing formatting whenever possible.
- Prefer extending existing code instead of rewriting it.
- Reuse existing components, helpers and utilities before creating new ones.

## Before finishing

Always report:

- Files modified.
- Summary of changes.
- Possible risks.
- Commands to verify the result.
- If assumptions were made, state them explicitly.

## Git

Never execute or suggest automatically:

- git add
- git commit
- git push
- git reset
- git rebase

Wait for explicit user confirmation.

## Communication

If the request is ambiguous:

- Ask for clarification.
- Do not guess.

If several approaches exist:

- Explain the trade-offs briefly.
- Recommend the safest option.