# Tests that read every module

These tests sweep all the modules at once, so they live here and not in `components/modules`. HubSpot's build runs
`validate-fields` on every entry of `components/modules` as if it were a module: a test file there gives FATAL
MODULE_NOT_FOUND (measured 22/10/2026). A test of one module stays inside its own folder.
