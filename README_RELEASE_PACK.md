# PM0 Release Pack (semantic-release)

Automates versioning, changelog, and GitHub releases using Conventional Commits.

## Install
```bash
npm i -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github @semantic-release/commit-analyzer @semantic-release/release-notes-generator
```
## Usage
- Merge PRs with Conventional Commit messages (feat:, fix:, chore:, docs:, refactor:)
- Push to main → CI runs `semantic-release`, bumps version, updates CHANGELOG.md, creates a GitHub release.
