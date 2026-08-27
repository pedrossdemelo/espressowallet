import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// The whole app tree is mounted as children of LocalizationProvider in
// src/index.tsx. @mui/lab's LocalizationProvider became a deprecation stub
// that warns and returns null, which silently rendered a blank page with no
// errors: children were dropped, so no route ever mounted. Guard the one
// property that matters — the provider renders whatever it wraps.
describe("LocalizationProvider", () => {
  it("renders its children", () => {
    const markup = renderToStaticMarkup(
      createElement(
        LocalizationProvider,
        { dateAdapter: AdapterDateFns },
        createElement("main", { id: "app-tree" }, "mounted"),
      ),
    );

    expect(markup).toContain('id="app-tree"');
    expect(markup).toContain("mounted");
  });
});
