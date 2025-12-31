# Security notice — leaked Google API key

Detected a publicly committed Google API key. Follow these steps immediately:

1. Rotate and revoke the exposed key
   - Go to Google Cloud Console -> APIs & Services -> Credentials
   - Revoke/delete the exposed API key immediately (do this first)

2. Create a new API key with strict restrictions
   - Restrict by HTTP referrers to `https://carlosynaty.mx` (and `https://www.carlosynaty.mx`)
   - Limit APIs to only the required Firebase APIs

3. Purge the secret from git history (recommended)
   - Use the BFG Repo-Cleaner or git-filter-repo to remove the key from history.
   - Example (BFG):
     1. Install BFG (https://rtyley.github.io/bfg-repo-cleaner/)
     2. Run:
        `bfg --replace-text replacements.txt` (where `replacements.txt` lists the key)
     3. Follow with `git reflog expire --expire=now --all && git gc --prune=now --aggressive`

   - Example (git-filter-repo):
     `git filter-repo --invert-paths --path-glob '<file-containing-key>'` or use replacement options.

4. Check audit logs
   - Review Google Cloud logs for suspicious activity and usage spikes.

5. Update your deployment
   - Do NOT commit the new key to the repository.
   - For deployment, use a secrets manager or environment variables where possible.
   - If using GitHub Pages, restrict the API key by HTTP referrers in Google Cloud Console.

6. Close GitHub secret alert once revoked

If you want, I can:
- Help generate the replacement list for BFG / run git-filter-repo locally (requires confirmation).
- Add a runtime-config pattern to load the key from a safe source instead of committing it.
