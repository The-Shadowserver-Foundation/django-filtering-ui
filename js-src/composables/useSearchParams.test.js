import useSearchParams from "./useSearchParams";

test("mocking window.location", () => {
  // Mock for window.location
  const mockLocation = {
    _search: "",
    set search(params) {
      this._search = `${params}`;
    },
    get search() {
      return new URLSearchParams(this._search);
    },
  };

  // Mock assignment for window.location
  globalThis.location = mockLocation;

  // Assign testing data
  const values = {
    a: "0",
    b: "1",
    z: "25",
  };
  window.location.search = `?${Object.entries(values)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")}`;

  expect(Array.from(useSearchParams().entries())).toEqual(
    Array.from(Object.entries(values)),
  );
});
