## 2.3.1

- Update verified version to 12.327

## 2.3.0

- Fix an issue in Foundry V11 where links to compendiums with LIMITED visibility where being hidden.
- Make the module V11-only, due to the change in how compendium visibility is handled.

## 2.2.3

- Update verified version to 11.299

## 2.2.2

- Update verified version to 10.291
- Change warning into a debug message which is only output when enabled (thus only for players)

## 2.2.1

Remove "compatibility.maximum" flag from module.json so that it will work in Foundry 11

## 2.2

Ensure it works on Foundry V10 for journal pages (and using fromUuidSync for efficiency).

## 2.1

Reinstate the V9 flags so that Foundry provides a better error.

## 2.0

Update module.json to match the new Foundry 10 format.

Change logic to work with new features available in Foundry 10.

## 1.1

The Github action wasn't putting the .mjs file into the module!

## 1.0

Make its own module, separated out from the realm-works-import module
