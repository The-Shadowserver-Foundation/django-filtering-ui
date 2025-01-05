import useCsrfToken from "./useCsrfToken";

test("retrieves csrf cookie value", () => {
  const token = "8IoV2wi7VFkZOS28rcTSxPYeixTHeUL6";
  const cookies = [`csrftoken=${token}`, "traku=false", "foo=bar"];
  document.cookie = cookies.join("; ");

  expect(useCsrfToken()).toEqual(token);
});
