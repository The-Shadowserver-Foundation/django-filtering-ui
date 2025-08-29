import { flattenChoicesReducer, flattenChoiceOptionsReducer } from "./choices";

describe("Test choices utilities", () => {
  test("flattening array of choices", () => {
    const choices = [
      ["baz", "Baz"],
      ["foo-l", "FooL"],
      ["foo-z", "FooZ"],
      ["bar-b", "BarB"],
      ["bar-k", "BarK"],
    ];
    expect(choices.reduce(flattenChoicesReducer, [])).toEqual(choices);
  });

  test("flattening array of grouped choices", () => {
    const choices = [
      ["baz", "Baz"],
      [
        "Foo",
        [
          ["foo-l", "FooL"],
          ["foo-z", "FooZ"],
        ],
      ],
      [
        "Bar",
        [
          ["bar-b", "BarB"],
          ["bar-k", "BarK"],
        ],
      ],
    ];
    const expectedChoices = [
      ["baz", "Baz"],
      ["foo-l", "FooL"],
      ["foo-z", "FooZ"],
      ["bar-b", "BarB"],
      ["bar-k", "BarK"],
    ];
    expect(choices.reduce(flattenChoicesReducer, [])).toEqual(expectedChoices);
  });

  test("flatten option choices", () => {
    const options = [
      { value: "foo", label: "Foo", disabled: false },
      { value: "bar", label: "Bar", disabled: true },
      { value: "baz", label: "Baz", disabled: true },
    ];
    expect(options.reduce(flattenChoiceOptionsReducer, [])).toEqual(options);
  });

  test("flatten grouped option choices", () => {
    const options = [
      { value: "baz", label: "Baz", disabled: false },
      {
        label: "Foo",
        value: [
          { value: "foo-l", label: "FooL", disabled: false },
          { value: "foo-z", label: "FooZ", disabled: false },
        ],
      },
      {
        label: "Bar",
        value: [
          { value: "bar-b", label: "BarB", disabled: false },
          { value: "bar-k", label: "BarK", disabled: true },
        ],
      },
    ];
    const expectedOptions = [
      { value: "baz", label: "Baz", disabled: false },
      { value: "foo-l", label: "FooL", disabled: false },
      { value: "foo-z", label: "FooZ", disabled: false },
      { value: "bar-b", label: "BarB", disabled: false },
      { value: "bar-k", label: "BarK", disabled: true },
    ];
    expect(options.reduce(flattenChoiceOptionsReducer, [])).toEqual(
      expectedOptions,
    );
  });
});
