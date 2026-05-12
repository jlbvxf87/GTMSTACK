export * from "./tokens";
export * from "./theme-provider";
export * from "./components";

// Demo brand seed content (Prime Wellness, ApexRX, Iron Reserve). Shipped from
// @gtmstack/ui so apps can render canonical demo pages without copy-pasting
// content. Per doctrine, Prime Wellness is the canonical demo brand for the
// whole platform.
export {
  primeWellness,
  apexRx,
  ironReserve,
  demoBrands,
} from "./components/__fixtures__/demo-brands";
export type { DemoBrand } from "./components/__fixtures__/demo-brands";
