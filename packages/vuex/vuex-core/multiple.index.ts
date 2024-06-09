import { reactive, inject, type App, type UnwrapNestedRefs } from "vue";

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
  state: UnwrapNestedRefs<S>,
  getters?: any,
  rootState?: UnwrapNestedRefs<R>,
  rootGetters?: any
) => any;

interface Mutations<S> {
  [key: string]: Mutation<S>;
}
type Mutation<S> = (state: UnwrapNestedRefs<S>, payload?: any) => void;

interface Actions<S, R> {
  [key: string]: Action<S, R>;
}
type Action<S, R> = (context: ActionContext<S, R>, payload?: any) => any;
interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: UnwrapNestedRefs<S>;
  rootState?: UnwrapNestedRefs<R>;
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
  public getters!: Getters<any, S>;
  public mutations!: Mutations<S>;
  public actions!: Actions<any, S>;
  public commit!: Commit;
  public dispatch!: Dispatch;

  constructor(public options: StoreOptions<S>) {
    this.getters = options.getters || Object.create(null);
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
    if (!this.mutations[type]) {
      console.error("[vuex] unknown mutation type: " + type);
    }
    this.mutations[type](payload);
  }

  _dispatch(type: string, payload?: any) {
    if (!this.actions[type]) {
      console.error("[vuex] unknown dispatch type: " + type);
    }
    this.actions[type](payload);
  }
}

/**
 * 封装管理单模块 => modulewrapper
 */
class ModuleController<S, R> {
  /** current module open namespace */
  public namespace: boolean;
  /** current module state */
  public state: UnwrapNestedRefs<S>;
  public getters!: Getters<any, S>;
  public mutations!: Mutations<S>;
  public actions!: Actions<any, S>;
  /** current module */
  public raw: Module<any, R>;
  /** children modules, defualt: {} */
  public children: Record<string, ModuleController<any, R>> =
    Object.create(null);

  constructor(rawModule: Module<any, R>) {
    this.namespace = rawModule.namespace || false;
    this.state = reactive(rawModule.state || Object.create(null));
    this.getters = rawModule.getters || Object.create(null);
    this.mutations = rawModule.mutations || Object.create(null);
    this.actions = rawModule.actions || Object.create(null);
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
    this.installModule([], store, this.rootRaw.state, this.rootRaw);
  }

  getNamespace(paths: string[]) {
    return paths.at(-1);
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
      const moduleNamespace = this.getNamespace(paths); // paths 最后一位即当前模块的名称
      if (moduleNamespace && parentRawModule) {
        parentRawModule.addChildrenModule(moduleNamespace, _module);
      }
    }

    if (rawModule.modules && Object.keys(rawModule.modules).length > 0) {
      for (const [moduleNamespace, moduleValue] of Object.entries(
        rawModule.modules
      )) {
        this.mountedModules(
          paths.concat(moduleNamespace),
          moduleValue,
          _module
        );
      }
    }
  }

  /**
   * 安装模块
   * 1. 将各个模块按照父子关系将 state 全部收敛至根模块下
   * 2. 将各个模块的 getter 收敛至根模块下
   * @param paths
   * @param store
   * @param rootState
   * @param rawModule
   */
  installModule(
    paths: string[],
    store: Store<R>,
    rootState: UnwrapNestedRefs<R>,
    rawModule: ModuleController<any, R>,
    parentRawModule?: ModuleController<any, R>
  ) {
    if (paths.length !== 0) {
      const moduleNamespace = this.getNamespace(paths); // paths 最后一位即当前模块的名称
      if (moduleNamespace) {
        // 挂载子模块 state 至父模块的 state 中
        if (parentRawModule) {
          parentRawModule.state[`${moduleNamespace}`] = rawModule.state
        }

        // 将 getter 挂载至根模块
        if (rawModule.getters && Object.keys(rawModule.getters).length > 0) {
          for (const [getterName, getterFunction] of Object.entries(
            rawModule.getters
          )) {
            Object.defineProperty(
              store.getters,
              `${moduleNamespace}/${getterName}`,
              {
                get() {
                  return getterFunction(rawModule.state);
                },
              }
            );
          }
        }
        // TODO: use proxy perf
        // if (rawModule.getters && Object.keys(rawModule.getters).length > 0) {
        //   new Proxy(store.getters, {
        //     get(target, getterName) {
        //       const getterFunction = target[getterName as string]
        //       return getterFunction(rawModule.state)
        //     },
        //   })
        // }

        // 将 mutation 挂载至根模块
        if (
          rawModule.mutations &&
          Object.keys(rawModule.mutations).length > 0
        ) {
          for (const [mutationName, mutationFunction] of Object.entries(
            rawModule.mutations
          )) {
            store.mutations[`${moduleNamespace}/${mutationName}`] = function (
              payload: any
            ) {
              // mutationFunction(rawModule.state, payload)
              mutationFunction.call(store, rawModule.state, payload);
            };
          }
        }

        // 将 action 挂载至根模块
        if (rawModule.actions && Object.keys(rawModule.actions).length > 0) {
          for (const [actionName, actionFunction] of Object.entries(
            rawModule.actions
          )) {
            const actionContext = this.moduleActionContextBuilder(
              moduleNamespace,
              store,
              rawModule
            );
            store.actions[`${moduleNamespace}/${actionName}`] = function (
              payload: any
            ) {
              // actionFunction(actionContext, payload);
              actionFunction.call(store, actionContext, payload);
            };
          }
        }
      }
    }

    if (rawModule.children && Object.keys(rawModule.children).length > 0) {
      for (const [moduleNamespace, moduleValue] of Object.entries(
        rawModule.children
      )) {
        this.installModule(
          paths.concat(moduleNamespace),
          store,
          rootState,
          moduleValue,
          rawModule
        );
      }
    }
  }

  moduleActionContextBuilder<R>(
    namespace: string,
    store: Store<R>,
    rawModule: ModuleController<any, R>
  ) {
    const isRootStore = namespace === "";
    const actionContext: ActionContext<any, R> = {
      commit: isRootStore
        ? store.commit
        : function (type: string, payload?: any) {
            store.commit(`${namespace}/${type}`, payload);
          },
      dispatch: store.dispatch,
      state: rawModule.state,
    };

    return actionContext;
  }
}

export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options);
}

export function useStore<S>(): Store<S> {
  return inject(StoreKey) as any;
}
