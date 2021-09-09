import {get,set} from "local-storage";

export class BaseStorage<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public Set(val: T) {
    set(this.key, val)
  }
  public Get(): T {
    return get<T>(this.key);
  }
}

const Token = new BaseStorage<string>('token');

export { Token };
