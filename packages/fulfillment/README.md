# @gtmstack/fulfillment

Adapter pattern. Each pharmacy, supplement supplier, and fulfillment partner is an adapter conforming to a shared interface. A router picks the adapter per order based on product type, operator state, and patient state.

New partners are added by writing a new adapter file in `src/adapters/`, never by modifying core order flow.

```
src/
  types.ts             # FulfillmentAdapter interface
  router.ts            # routeOrder(order) -> adapter
  adapters/
    <partner-name>.ts
```
