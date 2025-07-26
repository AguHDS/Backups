import "@testing-library/jest-dom";

// Mock to avoid errors with HeadlessUI
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
