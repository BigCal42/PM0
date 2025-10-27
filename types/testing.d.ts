declare module 'vitest' {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: (actual: unknown) => {
    toBe: (expected: unknown) => void;
    toEqual: (expected: unknown) => void;
    toMatchObject: (expected: Record<string, unknown>) => void;
    toThrowError: (expected?: unknown) => void;
    toHaveLength: (expected: number) => void;
  };
}

declare module '@playwright/test' {
  export interface Page {
    goto: (url: string) => Promise<void>;
    getByLabel: (label: string) => Locator;
    getByRole: (role: { name: string } | string, options?: Record<string, unknown>) => Locator;
    getByText: (text: string | RegExp) => Locator;
    getByTestId: (testId: string) => Locator;
  }

  export interface Locator {
    fill: (value: string) => Promise<void>;
    click: () => Promise<void>;
    selectOption: (value: string | { label: string }) => Promise<void>;
    toBeVisible?: () => Promise<void>;
    toContainText?: (text: string | string[]) => Promise<void>;
    getAttribute: (name: string) => Promise<string | null>;
  }

  export const test: (
    name: string,
    handler: (args: { page: Page }) => Promise<void>,
  ) => void;

  export const expect: (locator: Locator) => {
    toBeVisible: () => Promise<void>;
    toContainText: (text: string | string[]) => Promise<void>;
    toHaveAttribute: (name: string, value: string) => Promise<void>;
  };
}
