export default class Environment {
  _store = Object.create(null);

  get (name) {
    return this._store[name];
  }

  set (name, value) {
    return this._store[name] = value;
  }
}
