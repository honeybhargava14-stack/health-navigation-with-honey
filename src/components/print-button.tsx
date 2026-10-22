"use client";

import { Button } from "@health/ui";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()}>
      Save as PDF
    </Button>
  );
}
