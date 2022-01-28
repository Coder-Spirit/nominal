# Contributing Guidelines

## Code of Conduct
This project and everyone participating in it is governed by our
[Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior to
contact@coderspirit.xyz.

## How can I contribute?
- Reporting bugs
- Proposing new features or improvements
  - For bug reports & proposals, consider the following:
  - Always be respectful, and mind the [Code of Conduct](./CODE_OF_CONDUCT.md)
  - Check if someone else already reported that bug or proposed that idea.
  - Try to be thorough and detailed with your explanations, to help others to
    understand them and take proper action.
- Improving the current documentation
- Contributing code
  - Always be respectful, and mind the [Code of Conduct](./CODE_OF_CONDUCT.md)
  - Backwards compatibility is almost sacred, please try to preserve it.
  - Try to respect the current coding style, to avoid style inconsistencies.

## Code Contributions: Acceptance Criteria

In order for us to accept contributions, the merge request must fulfill certain
requirements:

### Style Guide

There is no "official" style guide, although we enforce style through automated
tools, such as [Prettier](https://prettier.io/) and
[ESLint](https://eslint.org/).

### Commit signatures
For security & regulations compliance, commits must be cryptographically signed
by [PGP](https://www.openpgp.org/)/[GPG](https://gnupg.org/), or SSH
([since git v2.34](https://github.blog/2021-11-15-highlights-from-git-2-34/)).
You can read more about this topic here:
  - [Git's documentation](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
  - [Github's documentation](https://help.github.com/en/github/authenticating-to-github/signing-commits)
  - [Gitlab's documentation](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/).
  - [Signing Git commits with your SSH key](https://calebhearth.com/sign-git-with-ssh)

### Commit messages

Commit messages must be properly formatted (following the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) rules).
The reasons behind this decision are many:
  - The project's history has to be "easy" to read.
  - It's easier to extract statistics from the commit logs.
  - It's easier to generate useful changelogs.
  - This practice enforces that committers think twice about the nature of their
    contributions.
  - It allows us to automate version numbering (following
    [Semantic Versioning](https://semver.org/) rules)

### Branch history

The merge request's commits have to present a "clean" history, `git rebase` is
your friend. This means:
  - linear history
  - commit messages matching what the commit does
  - no "experimental" commits + their revert commits
