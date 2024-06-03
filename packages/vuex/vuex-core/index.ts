import {inject, type App} from 'vue'

interface StoreOptions<S> {
  state?: S;
  getters?: Getters<S, S>;
  mutations?: Mutations<S>;
  actions?: Actions<S, S>;
}
interface Getters<S, R> {
  [key: string]: Getter<S, R>;
}
type Getter<S, R> = (
  state: S,
  getters: any,
  rootState: R,
  rootGetters: any
) => any;

interface Mutations<S> {
  [key: string]: Mutation<S>;
}
type Mutation<S> = (state: S, payload?: any) => void;

interface Actions<S, R> {
  [key: string]: Action<S, R>;
}
type Action<S, R> = (context: ActionContext<S, R>, payload?: any) => any;
interface ActionContext<S, R> {
  state: S;
  dispatch: Dispatch;
  commit: Commit;
}
type Dispatch = (type: string, payload?: any) => any;
type Commit = (type: string, payload?: any) => any;

const StoreKey = Symbol('store')
/**
 * S => current store state
 * R => root store state
 */
class Store<S = any> {
  constructor(public options: StoreOptions<S>) {
    console.log(this.options);
  }

  install(app: App) {
    app.provide(StoreKey, this)
  }

  test() {
    console.log('vuex core')
    return 'vuex core'
  }
}

export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options);
}

export function useStore<S>(): Store<S> {
  return inject(StoreKey) as any
}
