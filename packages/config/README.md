# @gtmstack/config

Shared tooling configs. Everything else extends from here so we have one source of truth.

```
tsconfig/
  base.json    # strict, ES2022, bundler resolution, declaration maps on
  lib.json     # for packages — JSX, noEmit
  next.json    # for apps — Next.js plugin, DOM lib
eslint.base.cjs
tailwind.base.cjs  # base content/plugin config; theme tokens come from @gtmstack/ui/tailwind-preset
```
