import { reactive } from "vue";

function makeId() {
  /* Creates a random ascii string of 6 chars */
  return Math.random().toString(36).substring(2, 8);
}

export class Condition {
  constructor(identifier, relative, value) {
    this.id = makeId();
    this.identifier = identifier;
    this.relative = relative;
    if (typeof value === "undefined") {
      this._value = value;
    } else {
      this.value = value;
    }
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
  }
  toObject() {
    return [this.identifier, { lookup: this.relative, value: this.value }];
  }
  validate() {
    if (!this.identifier || this.value == undefined) {
      return false;
    }
    return true;
  }
}

export class Grouping {
  constructor(operation, conditions) {
    this.id = makeId();
    this.state = reactive({
      operation: operation || "and",
      conditions: conditions || [],
    });
  }
  toObject() {
    /* Conversion to the format the backend uses. */
    return [
      this.operation.toLowerCase(),
      [...this.conditions.map((x) => x.toObject())],
    ];
  }
  static fromObject(obj) {
    /* Conversion from the format the backend uses. */
    const conditions = obj[1].map((x) => {
      return new Condition(x[0], x[1]["lookup"], x[1]["value"]);
    });
    return new Grouping(obj[0], conditions);
  }
  get operation() {
    return this.state.operation;
  }
  set operation(value) {
    this.state.operation = value;
  }
  get conditions() {
    return this.state.conditions;
  }
  set conditions(value) {
    this.state.conditions = value;
  }
  addConditions(...conditions) {
    this.state.conditions.push(...conditions);
  }
  addConditionsAfter(conditionBefore, ...conditions) {
    const indexBefore = this.state.conditions.findIndex((c) => {
      return c.id == conditionBefore.id;
    });
    const index = indexBefore + 1;
    this.state.conditions.splice(index, 0, ...conditions);
  }
  removeConditions(...conditions) {
    const ids = conditions.map((c) => c.id);
    this.state.conditions = this.state.conditions.filter((c) => {
      if (!ids.includes(c.id)) {
        return c;
      }
    });
  }
}
