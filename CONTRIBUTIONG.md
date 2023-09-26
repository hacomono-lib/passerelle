# Contribution Guidelines

We appreciate your interest in contributing to our project! To ensure a smooth contribution process, please follow these guidelines.

## Getting Started

1. Make sure you have the appropriate permissions to contribute to the repository.
1. Clone the repository to your local machine using `git clone https://github.com/hacomono-lib/type-assurer.git.`
1. Install the project dependencies by running yarn install.
1. (optional) Install [pre-commit}(https://pre-commit.com)

## Development Workflow

1. Create a new branch for your changes: `git checkout -b your-feature-branch`.
1. Make your changes and commit them with a descriptive commit message.
1. Run tests to ensure your changes don't introduce any regressions: `yarn test`.
1. Push your changes to the repository on GitHub.

## Using Changesets

We use Changesets to manage our changelog and versioning. Follow these steps to create a changeset for your changes:

1. Run `yarn changeset` in the project root.
1. Follow the CLI prompts to choose the affected packages and the appropriate version bump (major, minor, or patch) based on your changes.
1. Commit the generated changeset file along with your changes.

## Creating a Pull Request

1. Push your feature branch to the repository on GitHub.
1. Create a new Pull Request targeting the main branch.
1. In your Pull Request description, provide a brief summary of your changes and any additional context.
1. Ensure that any required status checks pass before requesting a review.

Thank you for contributing to our project! We look forward to reviewing your changes and collaborating with you.
