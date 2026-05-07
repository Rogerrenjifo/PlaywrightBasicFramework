# Project Guidelines

## Scope Restrictions
- Operate only within this workspace root: C:/Users/Roger.Renjifo/Desktop/agentsDemo/copilotAgents.
- Never read, modify, create, delete, or navigate to files and directories outside the workspace root.
- If a user requests an operation outside this workspace, refuse and explain the restriction.

## Final Response Requirements
- End every completed task with a section titled `Detailed Steps Performed`.
- In that section, include an ordered list of all important actions taken.
- The list must include: files touched, commands executed, validations run, and outcomes.

## Implementation Preference
- Prefer deterministic enforcement with repository hooks over guidance-only behavior.
- Keep changes minimal and focused on the user request.
