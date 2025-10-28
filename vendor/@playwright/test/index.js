const notAvailableMessage =
  'Playwright is unavailable because the corporate allow-list blocks the @playwright scope. ' +
  'Install the real package in an environment with direct registry access to execute end-to-end tests.';

function createLocator() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(notAvailableMessage);
      },
      apply() {
        throw new Error(notAvailableMessage);
      },
    },
  );
}

function createPage() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(notAvailableMessage);
      },
    },
  );
}

export const expect = () => ({
  toBeVisible: async () => {
    throw new Error(notAvailableMessage);
  },
  toContainText: async () => {
    throw new Error(notAvailableMessage);
  },
  toHaveAttribute: async () => {
    throw new Error(notAvailableMessage);
  },
});

export const test = Object.assign(
  (_name, _handler) => {
    console.warn(notAvailableMessage);
  },
  {
    describe: (_name, _handler) => {
      console.warn(notAvailableMessage);
    },
    skip: (_name, _handler) => {
      console.warn(notAvailableMessage);
    },
  },
);

test.extend = () => ({
  use: () => {
    throw new Error(notAvailableMessage);
  },
});

test.beforeEach = () => {
  console.warn(notAvailableMessage);
};

test.afterEach = () => {
  console.warn(notAvailableMessage);
};

export const chromium = {
  launch: async () => {
    throw new Error(notAvailableMessage);
  },
};

export const page = createPage();
export const locator = createLocator();

export default {
  test,
  expect,
};
