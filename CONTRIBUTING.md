# Contributing
Thank you for showing interest to contribute to Huishoudboekje!

When it comes to open source, there are different ways you can contribute, all of which are valuable.
Here's a few guidelines that should help you as you prepare your contribution.

## Commit convention

We don't really have one yet. Just be clear about what you're changing.

## Git Flow

We use Git for version management. We try to maintain a [semi-linear history](https://stackoverflow.com/questions/20348629/what-are-advantages-of-keeping-linear-history-in-git):
- Every merge creates a merge commit.
- Fast-forward merges only.
- When there is a merge conflict, the user is given the option to rebase.

![Example of a semi-linear merge](https://i.stack.imgur.com/yJpjE.gif "Example of a semi-linear merge")
Example of a semi-linear merge.

The advantage of a [semi-linear history](https://stackoverflow.com/a/59714422) is that we can easily rollback one feature if 
something goes wrong, while keeping other changes in tact.

When you start working on something, make sure to create a branch off `develop` (don't forget to `git pull` first so that you're on the latest version).
If you are a developer on the team, you can directly push your branch to the repository. If not, create a fork.

If you're working on a specific issue, the name of your branch should be the number of the issue.
> If you're working on [this issue](https://gitlab.com/commonground/huishoudboekje/app-new/-/issues/469), you're working on branch `469`.

If your work is not related to a specific issue, give your branch a clear name, but keep it as short a possible. 
For example, if you're working on design changes, use `design` as your branch name.

> The name of your branch will be used to spin up a review app on our Kubernetes cluster. 
> The URL to that review app will be `https://hhb-{branch-name}.nlx.reviews`.

When ready, create a [Merge Request](https://gitlab.com/commonground/huishoudboekje/app-new/-/merge_requests) and ask for a review.
Please describe your changes in the description, to make reviewing easier.

After approval, if you'd like to merge your branch, always merge **into** `develop`. 
If you're a few commits behind `develop`, please don't merge `develop` into your branch, pull and rebase onto `develop` instead. 
This is how we maintain a semi-linear history.

Pushing directly to `develop` is disabled. You can force-push to your own branch, **but please bear in mind that you're overwriting changes**!

## Branches and deployment

We use a DTRAP setup (Develop, Test, Review, Acceptance, Production), linked to specific branches.
When you push, a Gitlab CI will automatically deploy a new or update an existing environment.

| Branch      | Environment       | URL                                       |
|-------------|-------------------|-------------------------------------------|
| your-branch | Review            | https://hhb-your-branch.nlx.reviews       |
| feature/420 | Review            | https://hhb-feature-420.nlx.reviews       |
| develop     | Test              | https://test.huishoudboekje.demoground.nl |
| acceptance  | Acceptance        | https://acc.huishoudboekje.demoground.nl  |
| master      | Production (Demo) | https://huishoudboekje.demoground.nl      |

# License

By contributing your code to the this repository, you agree to license your contribution under the [current license](./LICENSE.md).