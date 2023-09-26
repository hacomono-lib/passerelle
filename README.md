# passerelle

The passerelle package is a library that facilitates cross-communication via iframes for Single Page Application (SPA) development.
This library simplifies the redevelopment of applications in an incremental manner and supports the creation of lightweight micro-frontends when combined with JavaScript frameworks like Vue, React, Angular, and more.

## Definitions

### Enclosure

The `@passerelle/enclosure` package is used on the parent-side of the application.
It manages iframes within the parent application and establishes communication with child components.
It also provides features for accurately transmitting SPA transition information, parent window size, iframe position, and other relevant details.

### Insider

The @passerelle/insider package is used on the child-side of the application.
It is responsible for configuring communication with the parent, receiving information from the parent, and sending data.
Like the enclosure, it ensures accurate transmission of SPA transition information, parent window size, iframe position, and other essential details.
Please note that the insider package is optional and may not be required for all application configurations.

## Installation

To install the necessary packages:

For the parent-side (enclosure), use the following command:

```bash
npm install @passerelle/enclosure
```

For the child-side (insider), use the following command:

```bash
npm install @passerelle/insider
```

## Usage

Detailed usage instructions and API documentation for @passerelle/enclosure and @passerelle/insider are available in separate documents.
The passerelle package can be used in conjunction with various SPA frameworks, simplifying information exchange between parent and child components and streamlining SPA development processes.

## Documentation

WIP

## Contribution

If you're interested in contributing to this project, please check our GitHub repository. We welcome bug reports and pull requests. For more details, refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
