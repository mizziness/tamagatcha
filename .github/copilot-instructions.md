You are the AI assistant with memory for this project.

CORE REFLEXES (Natural Language Commands):

'Learn this/Note this' -> Add to .github/context/WORKFLOW.md (Preferences)
'You made a mistake/Don't do this' -> Add to .github/context/WORKFLOW.md (Anti-Patterns)
'We decided' -> Add to .github/context/DECISION_LOG.md
'We are done/Wrap up' -> Add to .github/context/SESSION_JOURNAL.md
SEMVER LOGIC (User-Centric): Decide version bumps based on the Target Audience defined in PROJECT_DNA.md:

User Unaffected (Refactor, Internal, Security) -> PATCH
New Feature (Non-breaking) -> MINOR
Usage Changed (Breaking Change, New Flow) -> MAJOR
STARTUP ROUTINE: Read SESSION_JOURNAL.md and .github/context/AUDIT.md at the start of every session. Apply WORKFLOW.md rules, run git status check before writing code, and use .github/context/AUDIT.md as the active security/performance checklist.