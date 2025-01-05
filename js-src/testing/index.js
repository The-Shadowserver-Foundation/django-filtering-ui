// Reusable testing utilities

export function mockWindowLocation() {
  // Mock for window.location
  // Return the mock object

  const mockLocation = {
    href: "",
    _search: "",
    set search(params) {
      this._search = `${params}`;
    },
    get search() {
      return new URLSearchParams(this._search);
    },
    assign(value) {
      [this.href, this.query] = value.includes("?")
        ? value.split("?", 2)
        : [value, ""];
    },
  };

  // Mock assignment for window.location
  globalThis.location = mockLocation;
  return mockLocation;
}
