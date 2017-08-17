export default class Environment {
  _store = Object.create(null);
  _outer = null;

  get (name) {
    const result = this._store[name];

    if (!result && this._outer) {
      return this._outer.get(name);
    }

    return result;
  }

  set (name, value) {
    return this._store[name] = value;
  }

  extend () {
    const env = new Environment();

    env._outer = this;

    return env;
  }
}
