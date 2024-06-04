import { inject, type App } from "vue";

interface StoreOptions<S> {
  state?: S;
  getters?: Getters<S, S>;
  mutations?: Mutations<S>;
  actions?: Actions<S, S>;
  modules?: Modules<S>;
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

interface Modules<R> {
  [key: string]: Module<any, R>;
}
interface Module<S, R> {
  namespace?: boolean;
  state?: S;
  getters?: Getters<S, R>;
  mutations?: Mutations<S>;
  actions?: Actions<S, R>;
  modules?: Modules<S>;
}

const StoreKey = Symbol("multiple-store");
/**
 * S => current store state
 * R => root store state
 */
class Store<S = any> {
  public modulesController!: ModulesController<S>;
  public mutations!: Mutations<S>;
  public actions!: Actions<any, S>;
  public commit!: Commit;
  public dispatch!: Dispatch;

  constructor(public options: StoreOptions<S>) {
    this.mutations = options.mutations || Object.create(null);
    this.actions = options.actions || Object.create(null);
    this.modulesController = new ModulesController<S>(this.options, this);

    this.bindProps();
  }

  install(app: App) {
    app.provide(StoreKey, this);
  }

  test() {
    console.log("vuex core");
    return "vuex core";
  }

  /**
   * 通过属性执行方法
   */
  bindProps() {
    const storeInstance = this;
    const commit = storeInstance._commit;
    const dispatch = storeInstance._dispatch;

    function bindCommit(type: string, payload?: any) {
      commit.call(storeInstance, type, payload);
    }
    this.commit = bindCommit;

    function bindDispatch(type: string, payload?: any) {
      dispatch.call(storeInstance, type, payload);
    }
    this.dispatch = bindDispatch;
  }

  _commit(type: string, payload?: any) {
    this.mutations[type]?.(payload);
  }

  _dispatch(type: string, payload?: any) {
    this.actions[type]?.(payload);
  }
}

/**
 * 封装管理单模块 => modulewrapper
 */
class ModuleController<S, R> {
  /** current module open namespace */
  public namespace: boolean;
  /** current module state */
  public state: S;
  /** current module */
  public raw: Module<any, R>;
  /** children modules, defualt: {} */
  public children: Record<string, ModuleController<any, R>> =
    Object.create(null);

  constructor(rawModule: Module<any, R>) {
    this.namespace = rawModule.namespace || false;
    this.state = rawModule.state || Object.create(null);
    this.raw = rawModule;
  }

  addChildrenModule(key: string, moduleController: ModuleController<any, R>) {
    this.children[key] = moduleController;
  }

  getChildrenModule(key: string) {
    return this.children[key];
  }
}

/**
 * 封装管理多模块 => modulecollection
 */
class ModulesController<R> {
  public rootRaw!: ModuleController<any, R>;

  constructor(rootRawModule: Module<any, R>, store: Store<R>) {
    this.mountedModules([], rootRawModule);
    this.mountedModulesState([], store, this.rootRaw.state, this.rootRaw);
    console.log('root state: ', this.rootRaw.state)
  }

  /**
   * 将各个模块按照父子关系挂载至对应的 children 中，最终收敛至 ModulesController 中
   * @param paths
   * @param rawModule
   * @param parentRawModule
   */
  mountedModules(
    paths: string[],
    rawModule: Module<any, R>,
    parentRawModule?: ModuleController<any, R>
  ) {
    const _module = new ModuleController<any, R>(rawModule); // 实例化当前模块，paths 为 0 时充当根模块，不为 0 时充当父模块

    if (paths.length === 0) {
      // 挂载根模块
      this.rootRaw = _module;
    } else {
      // 挂载子模块至父模块的 children 中
      const moduleNamespaceKey = paths.at(-1); // paths 最后一位即当前模块的名称
      if (moduleNamespaceKey) {
        parentRawModule?.addChildrenModule(moduleNamespaceKey, _module);
      }
    }

    if (rawModule.modules) {
      for (const [namespaceKey, moduleValue] of Object.entries(
        rawModule.modules
      )) {
        this.mountedModules(paths.concat(namespaceKey), moduleValue, _module);
      }
    }
  }

  /**
   * 将各个模块按照父子关系将 state 全部收敛至根模块下
   * @param paths
   * @param store
   * @param rootState
   * @param rawModule
   */
  mountedModulesState(
    paths: string[],
    store: Store<R>,
    rootState: R,
    rawModule: ModuleController<any, R>,
    parentRawModule?: ModuleController<any, R>
  ) {
    console.log("paths: ", paths);

    if (paths.length !== 0) {
      // 挂载子模块 state 至父模块的 state 中
      const moduleNamespaceKey = paths.at(-1); // paths 最后一位即当前模块的名称
      if (moduleNamespaceKey && parentRawModule) {
        parentRawModule.state[`${moduleNamespaceKey}`] = rawModule.state;
      }
    }

    if (Object.keys(rawModule.children).length > 0) {
      for (const [namespaceKey, moduleValue] of Object.entries(
        rawModule.children
      )) {
        this.mountedModulesState(
          paths.concat(namespaceKey),
          store,
          rootState,
          moduleValue,
          rawModule
        );
      }
    }
  }
}

export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options);
}

export function useStore<S>(): Store<S> {
  return inject(StoreKey) as any;
}
