# Security Policy

## Reporting a Vulnerability
If you discover a vulnerability, please email [security@pm0.dev](mailto:security@pm0.dev) with a detailed description, steps to reproduce, and any available mitigation ideas. We will acknowledge receipt within two business days and provide status updates until the issue is resolved. Please avoid creating public GitHub issues for security findings.

## Supported Versions
Security fixes are applied to the `main` branch and backported to the latest tagged release when practical. Older releases will not receive fixes unless a customer contract explicitly requires it.

## Handling Supabase Secrets
- Supabase service-role keys, JWT secrets, and database passwords must **never** appear in the repository, sample configs, screenshots, or logs.
- Store secrets in Vercel environment variables or local `.env` files that are ignored by Git.
- Rotate secrets immediately if they are exposed during development or support activities and document the rotation in the internal runbook.

## Row Level Security (RLS)
- All Supabase tables must enforce RLS. New tables require policies before they can be referenced by the frontend.
- When debugging, prefer RLS helper functions or dedicated admin roles rather than disabling policies.
- Test queries using both privileged and anonymous roles to ensure policies gate data correctly.
- Document any policy changes, including rationale and rollback steps, in the pull request description.

## Responsible Disclosure Expectations
We ask researchers to avoid exploits that could compromise patient data or availability. Do not run automated scanners against production deployments without written permission. We appreciate coordinated disclosure and will credit reporters publicly if they desire.
