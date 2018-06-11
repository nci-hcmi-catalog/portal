# Contributing

* [Version Control](#version-control)
* [Your First Pull Request](#your-first-pull-request)

## Version Control

* [Master](#master)
* [Branches](#branches)
* [Commits](#commits)
* [Code Review](#code-review)

### Master

The `master` branch should be considered the most up-to-date version of the software. No active development should take place on directly `master`.

* To make a release, create a tag from the relevant commit on master then push to the remote:

```
git tag <version> <commit>
# example: git tag 0.2.0 d78412a21c527487b3c26f753ca918d23dbc072b

git push origin --tags
```

* [Hotfix](#hotfix) should be branched off of the tag which is currently deployed, and rebased back into master when completed.

```
git checkout <tag>
git checkout -b hotfix/<branch_name> <version>
# example: git checkout -b hotfix/12-chart-null-check 0.2.0
```

* Push the hotfix branch and [Code Review](#code-review) as necessary. **Do not merge hotfix branches into master!**. Create a new tag with a bumped version number and rebase master to include the commits in the correct order.

```
# create a new tag from hotfix branch
git tag <bumped_version>
# example: git tag 0.2.1

git push origin --tags

# rebase master to include hotfix
git checkout master
git rebase 0.2.1
```

Hotfixing a release should be the only time master is ever rebased! Syncing the remote master after a rebase may require an admin to temporarily disable branch protection.

### Branches

All development should happen on a branch off of `master`. Branch names should include a ticket number if possible: `##-couple-words` or `my-update`.

```
git checkout -b 11-my-feature
```

* Branches should be rebased with `master` if they get out of date.

* Branches should be [merged](#merge-branch) into `master` when they are completed.

### Commits

* Commit messages should make it easy for some one to scan through a commit log and understand the current state of the code.
* Start the commit message with an applicable emoji:

  * :tada: `:tada:` for the initial commit
  * :green_heart: `:green_heart:` when fixing the CI build
  * :white_check_mark: `:white_check_mark:` when adding tests
  * :arrow_up: `:arrow_up:` when upgrading dependencies
  * :arrow_down: `:arrow_down:` when downgrading dependencies
  * :shirt: `:shirt:` when removing linter warnings
  * :recycle: `:wrench:` when refactoring
  * :wrench: `:wrench:` when updating tooling

  start with one of the following emojis to add your commit to the change log:

  * :racehorse: `:racehorse:` when improving performance
  * :sparkles: `:sparkles:` when adding a new feature
  * :bug: `:bug:` when fixing a bug
  * :books: `:books:` when adding documentation
  * :globe_with_meridians: `:globe_with_meridians:` when adding internationalization

* you can use multiple emojis but only with first will be considered when generating the change log
* you can look at [gitmoji](https://gitmoji.carloscuesta.me/) for inspiration

#### Examples

Commits have the following structure:

```
:icon: one line description

Longer description
- list of changes
- one more thing
```

Examples of valid commits:

```
:sparkles: adds new page to that page

Adds new feature to do that thing that we wanted to do:
- That one thing it does
- that other thing it does
```

```
:bug: fixes bug with thing
```

```
:racehorse::wrench: better production mode
```

```
:shirt: fixes eslint in tests
```

### Code Review

* All branches should be pushed to Github for code review.

* All branches need to be reviewed and signed-off before they can be considered complete.

* Any branches containing significant changes will also need to be QA'ed.

### Merge Branch

After a branch has been [reviewed](#code-review) it can be merged.

When merging use the `Squash and Merge` option:

![alt text](https://github.com/knitjs/knit/raw/master/docs/squash.png)

Before merging you are free to squash commits locally if you want more control over the commit message.

https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits

https://github.com/blog/2141-squash-your-commits

## Your First Pull Request

0.  clone the repo
1.  create a new [branch](#branches)
1.  do some [work](#setup-development-environment)
1.  [commit](#commits) your changes
1.  push changes to Github for [review](#code-review)
1.  repeat as necessary
1.  rebase [master](#master) into your branch and deal with any conflicts.
1.  get someone to [review and sign-off](#code-review) on your branch
1.  wait for the CI system to test your branch
1.  [merge](#merge-branch) into [master](#master)
