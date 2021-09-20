# Smartblock Webhook Receptor

A simple GitHub REST API built with ExpressJS and TypeScript

This project is based on the [GitHub Webhooks documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks)

## Built-in scripts

- Secret Token Generator

  ```bash
  yarn generate:secret
  ```

  Add the `--length LENGTH` flag. The default value is 20. Example: `yarn generate:secret --length 50`

## TODO

- Webhook event action adapter (currently, push events are supported only)
- Save logger outputs (morgan + winston) [#1](https://github.com/SmartblockTech/Webhook-Receptor/issues/1)
- Sync workflow
