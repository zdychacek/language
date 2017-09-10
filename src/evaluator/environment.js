const EXPORTS_KEY = Symbol('$$exports$$');

export default class Environment {
  _store = Object.create(null);
  _outer = null;

  constructor () {
    this._store[EXPORTS_KEY] = Object.create(null);
  }

  extend () {
    const env = new Environment();

    env._outer = this;

    return env;
  }

  get (name) {
    const result = this._store[name];

    if (!result && this._outer) {
      return this._outer.get(name);
    }

    return result;
  }

  assign (name, value) {
    return this._store[name] = value;
  }

  set (name, value) {
    let env = this;

    while (env) {
      if (env._store[name]) {
        return env.assign(name, value);
      }

      env = env._outer;
    }

    return null;
  }

  has (name) {
    return Boolean(this._store[name]);
  }

  assignExport (name, value) {
    return this._store[EXPORTS_KEY][name] = value;
  }

  getAll () {
    return this._store;
  }

  getExports () {
    return this._store[EXPORTS_KEY];
  }
}
