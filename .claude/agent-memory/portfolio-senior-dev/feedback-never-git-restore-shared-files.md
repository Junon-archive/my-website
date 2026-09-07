---
name: feedback-never-git-restore-shared-files
description: Never use git checkout/restore to undo an edit in this repo while other agents have uncommitted work — it wipes their changes
metadata:
  type: feedback
---

Never run `git checkout -- <file>` / `git restore <file>` to undo one of my own edits in this repo.
Undo by editing the file back, or by reconstructing from a derived artifact.

**Why:** other agents work in parallel with *unstaged* changes. For an unstaged file the index equals
HEAD, so `git checkout` silently reverts the file to the last commit and destroys the other agent's
work. On 2026-09-07 I reformatted `lang/*.json` while inserting one key, ran `git checkout` to undo
the formatting, and wiped the i18n agent's complete rewrite of all three files (349 keys → the old
385-key version). It was recoverable only because `assets/js/lang-data.js` had just been generated
from them and check #4 had proven it byte-identical; regenerating the JSON from that bundle and
re-deriving the old bundle reproduced it byte for byte.

**How to apply:**
- Before any destructive git command, check `git status` for other agents' modifications.
- When editing a file another agent owns, make the *minimal textual* insertion and diff the result
  against a copy of the original before and after — do not parse-and-rewrite the whole file, since
  a formatter difference turns a one-line change into a whole-file diff that invites a bad "undo".
- Match the original writer exactly. `lang/*.json` is written as `JSON.stringify(obj, null, 2) + "\n"`
  (Node, not Python), so use Node to edit it.

See [[css-and-check-conventions]].
