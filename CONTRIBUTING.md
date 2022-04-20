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

If your work is not related to a specific issue, give your branch a clear name, but keep it as short as possible. 
For example, if you're working on design changes, use `design` as your branch name.

> The name of your branch will be used to spin up a review app on our Kubernetes cluster. 
> The URL to that review app will be `https://hhb-{branch-name}.nlx.reviews`.

## Merging your changes

When ready, create a [Merge Request](https://gitlab.com/commonground/huishoudboekje/app-new/-/merge_requests) and ask for a review.
Please describe your changes in the description, to make reviewing easier. Hint: use the title of the issue that your MR is related to as the title of your MR!

Also, please add a changeset using `npm run add-changeset` so that we can keep track of what's changed in our [changelog](./CHANGELOG.md).
If you want to read more about how to use changesets in this repository, check out the [documentation](./CONTRIBUTING.md#Changesets)

After approval, if you'd like to merge your branch, always merge **into** `develop`. 
If you're a few commits behind `develop`, please don't merge `develop` into your branch, pull and rebase onto `develop` instead. 
This is how we maintain a semi-linear history.

To make it easy for you, just setup your git so that this happens automatically by using the following command:
```bash
git config --global pull.rebase true
```

### Force pushing

You can force-push to your own branch, **but please bear in mind that you're overwriting changes**! \
Pushing directly to `develop` is disabled.

## Branches and deployment

We use a DTRAP setup (Develop, Test, Review, Acceptance, Production), linked to specific branches.
When you push, Gitlab CI will automatically deploy a new environment or update an existing one.

| Branch      | Environment       | URL                                       |
|-------------|-------------------|-------------------------------------------|
| your-branch | Review            | https://hhb-your-branch.nlx.reviews       |
| feature/420 | Review            | https://hhb-feature-420.nlx.reviews       |
| 999         | Review            | https://hhb-999.nlx.reviews               |
| develop     | Test              | https://test.huishoudboekje.demoground.nl |
| acceptance  | Acceptance        | https://acc.huishoudboekje.demoground.nl  |
| master      | Production (Demo) | https://huishoudboekje.demoground.nl      |

You might have noticed that the `Development` environment doesn't have a URL that it is deployed to. 
That's right, because it should be running on your own local machine!

# Changesets

We try hard to keep our users up to date about the changes that we make to our software. It is important that we keep track of all of these changes in a changelog.
To make this an easy process, we use [Changesets](https://github.com/changesets/changesets/tree/main/docs). 
Please make sure that every Merge Request that you create has a changeset attached:

```shell
npm run add-changeset
```

You will be asked for a _bump type_ (patch, minor or major) and to summarize the changes you've made. Once you've added a changeset, a file will be 
added to the `.changeset` directory. You have to add this file to your commit.

Once we release a new version of the application, we can bundle all of the changesets for that version in a changelog:

```shell
npm run version-changeset
```

This will bundle all of the changesets for the new version and prepend it to the [Changelog](./CHANGELOG.md).
You can then review the version changes to all the packages and make changes to the changelog if you wish.
Once you are confident that the new changelog is correct, you can commit it to the repository, and a new version will be released.

# License

By contributing your code to the this repository, you agree to license your contribution under the [current license](./LICENSE.md).