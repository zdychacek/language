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

  extend () {
    const env = new Environment();

    env._outer = this;

    return env;
  }

  getAllBindings () {
    return this._store;
  }
}
