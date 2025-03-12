// Reusable testing utilities

export function mockWindowLocation() {
  // Mock for window.location
  // Return the mock object

  const mockLocation = {
    _default_href: "http://example.com",
    href: "http://example.com",
    _search: "",
    set search(params) {
      this._search = `${params}`;
    },
    get search() {
      return new URLSearchParams(this._search);
    },
    assign(value) {
      [this.href, this.search] = value.toString().includes("?")
        ? value.toString().split("?", 2)
        : [value.toString(), ""];
      if (!this.href) {
        this.href = this._default_href;
      }
    },
    // Stringification to enable the use of this object
    // with `new URL(mockLocation)`
    toString() {
      return `${this.href}${this.search.size >= 1 ? "?" : ""}${this.search}`;
    },
  };

  // Mock assignment for window.location
  globalThis.location = mockLocation;
  return mockLocation;
}
