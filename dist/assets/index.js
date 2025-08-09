(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray$1(a);
  bValidType = isArray$1(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed2 = false) {
  sub.flags |= 8;
  if (isComputed2) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  const dep = computed2.dep;
  computed2.flags |= 2;
  if (dep.version > 0 && !computed2.isSSR && computed2.deps && !isDirty(computed2)) {
    computed2.flags &= -3;
    return;
  }
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = Symbol(
  ""
);
const ARRAY_ITERATE_KEY = Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray$1(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function getDepFromReactive(object, key) {
  const depMap = targetMap.get(object);
  return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
  const raw = toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive);
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toReactive(value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
  },
  find(fn, thisArg) {
    return apply(this, "find", fn, thisArg, toReactive, arguments);
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(this, "findLast", fn, thisArg, toReactive, arguments);
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", toReactive);
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (result.value) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toReactive(item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  let wrappedFn = fn;
  if (arr !== self2) {
    if (!isShallow(self2)) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  return arr[method](wrappedFn, ...args);
}
function searchProxy(self2, method, args) {
  const arr = toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = toRaw(self2)[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    );
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
    newValue = useDirectValue ? newValue : toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this["__v_isRef"] = true;
    this._value = void 0;
    const dep = this.dep = new Dep();
    const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
    this._get = get;
    this._set = set;
  }
  get value() {
    return this._value = this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this["__v_isRef"] = true;
    this._value = void 0;
  }
  get value() {
    const val = this._object[this._key];
    return this._value = val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this["__v_isRef"] = true;
    this["__v_isReadonly"] = true;
    this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
          oldValue = newValue;
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray$1(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError$1(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError$1(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex$1(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex$1(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
    return hasOwn(rawSetupState, key);
  };
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray$1(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && isReactive(source);
    let needsWrap = false;
    if (sourceIsReactiveArray) {
      needsWrap = !isShallow(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
    return openBlock(), createBlock(
      Fragment,
      null,
      [createVNode("slot", props, fallback)],
      64
    );
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  validSlotContent && validSlotContent.key;
  const rendered = createBlock(
    Fragment,
    {
      key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
      ""
    },
    validSlotContent || [],
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app2._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app2._instance,
            16
          );
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray$1(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce) {
            root.ce._injectChildStyle(type);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchSyncEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    { flush: "sync" }
  );
}
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function useModel(props, name, options = EMPTY_OBJ) {
  const i = getCurrentInstance();
  const camelizedName = camelize(name);
  const hyphenatedName = hyphenate(name);
  const modifiers = getModelModifiers(props, camelizedName);
  const res = customRef((track2, trigger2) => {
    let localValue;
    let prevSetValue = EMPTY_OBJ;
    let prevEmittedValue;
    watchSyncEffect(() => {
      const propValue = props[camelizedName];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger2();
      }
    });
    return {
      get() {
        track2();
        return options.get ? options.get(localValue) : localValue;
      },
      set(value) {
        const emittedValue = options.set ? options.set(value) : value;
        if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) {
          return;
        }
        const rawProps = i.vnode.props;
        if (!(rawProps && // check if parent has passed v-model
        (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
          localValue = value;
          trigger2();
        }
        i.emit(`update:${name}`, emittedValue);
        if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) {
          trigger2();
        }
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      }
    };
  });
  res[Symbol.iterator] = () => {
    let i2 = 0;
    return {
      next() {
        if (i2 < 2) {
          return { value: i2++ ? modifiers || EMPTY_OBJ : res, done: false };
        } else {
          return { done: true };
        }
      }
    };
  };
  return res;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event2, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event2.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event2.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event2)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event2))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event2))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.5.13";
/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event2, handler, options) {
  el.addEventListener(event2, handler, options);
}
function removeEventListener(el, event2, handler, options) {
  el.removeEventListener(event2, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event2 = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event2, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el[assignKey];
      if (isArray$1(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray$1(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue) return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el[assignKey](getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
        (o) => number ? looseToNumber(getValue(o)) : getValue(o)
      );
      el[assignKey](
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el._assigning = true;
      nextTick(() => {
        el._assigning = false;
      });
    });
    el[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    if (!el._assigning) {
      setSelected(el, value);
    }
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  const isArrayValue = isArray$1(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v) => String(v) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i) el.selectedIndex = i;
      return;
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const vModelDynamic = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "created");
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "mounted");
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "updated");
  }
};
function resolveDynamicModel(tagName, type) {
  switch (tagName) {
    case "SELECT":
      return vModelSelect;
    case "TEXTAREA":
      return vModelText;
    default:
      switch (type) {
        case "checkbox":
          return vModelCheckbox;
        case "radio":
          return vModelRadio;
        default:
          return vModelText;
      }
  }
}
function callModelHook(el, binding, vnode, prevVNode, hook) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type
  );
  const fn = modelToUse[hook];
  fn && fn(el, binding, vnode, prevVNode);
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event2, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event2, modifiers)) return;
    }
    return fn(event2, ...args);
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
/*!
 * pinia v3.0.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      pinia._a = app2;
      app2.provide(piniaSymbol, pinia);
      app2.config.globalProperties.$pinia = pinia;
      toBeInstalled.forEach((plugin) => _p.push(plugin));
      toBeInstalled = [];
    },
    use(plugin) {
      if (!this._a) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$1 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      pinia.state.value[id] = state ? state() : {};
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign$1(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$1({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    pinia.state.value[$id] = {};
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$1($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop$1
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$1({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        pinia.state.value[$id][key] = prop;
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      setupStore[key] = actionValue;
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  assign$1(store, setupStore);
  assign$1(toRaw(store), setupStore);
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign$1($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign$1(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(id, setup, setupOptions) {
  let options;
  const isSetupStore = typeof setup === "function";
  options = isSetupStore ? setupOptions : setup;
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  const rawStore = toRaw(store);
  const refs = {};
  for (const key in rawStore) {
    const value = rawStore[key];
    if (value.effect) {
      refs[key] = // ...
      computed({
        get: () => store[key],
        set(value2) {
          store[key] = value2;
        }
      });
    } else if (isRef(value) || isReactive(value)) {
      refs[key] = // ---
      toRef(store, key);
    }
  }
  return refs;
}
function logDebug(...args) {
  return;
}
function logInfo(...args) {
  console.log("Info", ...args);
}
function logError(...args) {
  console.log("Error", ...args);
}
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false, "VITE_APP_BUILD": "..e156c5", "VITE_APP_VERSION": "0.8-beta" };
const useGlobalStore = /* @__PURE__ */ defineStore("global", {
  state: () => {
    return {
      id: "",
      platform: "",
      board: "",
      app_ver: "",
      app_build: "",
      firmware_file: "",
      feature: {
        tft: false,
        sd: false
      },
      initialized: false,
      disabled: false,
      configChanged: false,
      messageError: "",
      messageWarning: "",
      messageSuccess: "",
      messageInfo: "",
      fetchTimout: 8e3,
      url: void 0
    };
  },
  getters: {
    isError() {
      return this.messageError != "" ? true : false;
    },
    isWarning() {
      return this.messageWarning != "" ? true : false;
    },
    isSuccess() {
      return this.messageSuccess != "" ? true : false;
    },
    isInfo() {
      return this.messageInfo != "" ? true : false;
    },
    token() {
      return "Bearer " + this.id;
    },
    baseURL() {
      if (this.url !== void 0) return this.url;
      {
        logInfo(
          "configStore:baseURL()",
          "Using base URL from browser",
          window.location.href,
          __vite_import_meta_env__
        );
        this.url = window.location.href;
      }
      return this.url;
    },
    uiVersion() {
      return "0.8-beta";
    },
    uiBuild() {
      return "..e156c5";
    },
    disabled32() {
      if (this.disabled) return true;
      if (this.platform !== "esp8266") return false;
      return true;
    }
  },
  actions: {
    clearMessages() {
      this.messageError = "";
      this.messageWarning = "";
      this.messageSuccess = "";
      this.messageInfo = "";
    },
    load(callback) {
      logInfo("globalStore.load()", "Fetching /api/feature");
      fetch(this.baseURL + "api/feature", {
        signal: AbortSignal.timeout(this.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        this.board = json.board.toUpperCase();
        this.app_ver = json.app_ver;
        this.app_build = json.app_build;
        this.platform = json.platform.toUpperCase();
        this.firmware_file = json.firmware_file.toLowerCase();
        this.feature.tft = json.tft;
        this.feature.sd = json.sd;
        logInfo("globalStore.load()", "Fetching /api/feature completed");
        callback(true);
      }).catch((err) => {
        logError("globalStore.load()", err);
        callback(false);
      });
    }
  }
});
const useStatusStore = /* @__PURE__ */ defineStore("status", {
  state: () => {
    return {
      id: "",
      rssi: 0,
      mdns: "",
      wifi_ssid: "",
      ip: "",
      total_heap: 0,
      free_heap: 0,
      wifi_setup: false,
      gravity_device: [],
      pressure_device: [],
      temperature_device: [],
      uptime_seconds: 0,
      uptime_minutes: 0,
      uptime_hours: 0,
      uptime_days: 0,
      sd_enbled: false,
      // Values that are not updated but needed for format template viewer
      angle: 35,
      gravity: 1.015,
      pressure: 1.23,
      temp: 20.1,
      battery: 4
    };
  },
  getters: {},
  actions: {
    load(callback) {
      logInfo("statusStore.load()", "Fetching /api/status");
      fetch(global$1.baseURL + "api/status", {
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        this.id = json.id;
        this.rssi = json.rssi;
        this.mdns = json.mdns;
        this.wifi_ssid = json.wifi_ssid;
        this.ip = json.ip;
        this.total_heap = json.total_heap;
        this.free_heap = json.free_heap;
        this.wifi_setup = json.wifi_setup;
        this.gravity_device = json.gravity_device;
        this.pressure_device = json.pressure_device;
        this.temperature_device = json.temperature_device;
        this.uptime_seconds = json.uptime_seconds;
        this.uptime_minutes = json.uptime_minutes;
        this.uptime_hours = json.uptime_hours;
        this.uptime_days = json.uptime_days;
        this.sd_mounted = json.sd_mounted;
        this.total_heap = Math.round(this.total_heap / 1024).toFixed(0);
        this.free_heap = Math.round(this.free_heap / 1024).toFixed(0);
        logInfo("statusStore.load()", "Fetching /api/status completed");
        callback(true);
      }).catch((err) => {
        logError("statusStore.load()", err);
        callback(false);
      });
    },
    auth(callback) {
      logInfo("statusStore.auth()", "Fetching /api/auth");
      var base = btoa("gravitymon:password");
      fetch(global$1.baseURL + "api/auth", {
        method: "GET",
        headers: { Authorization: "Basic " + base },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("statusStore.auth()", "Fetching /api/auth completed");
        callback(true, json);
      }).catch((err) => {
        logError("statusStore.auth()", err);
        callback(false);
      });
    }
  }
});
const httpHeaderOptions = ref([
  { label: "JSON data", value: "Content-Type: application/json" },
  { label: "Form data", value: "Content-Type: x-www-form-urlencoded" },
  { label: "Authorization", value: "Authorization: Basic {enter token here}" },
  { label: "No Cache", value: "Pragma: no-cache" },
  { label: "User agent", value: "User-Agent: gravitymon" }
]);
const httpPostUrlOptions = ref([
  { label: "Brewfather ispindel", value: "http://log.brewfather.net/ispindel?id=<yourid>" },
  { label: "Brewfather stream", value: "http://log.brewfather.net/stream?id=<yourid>" },
  {
    label: "UBI dots",
    value: "http://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>"
  },
  {
    label: "UBI dots secure",
    value: "https://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>"
  },
  { label: "Brewersfriend (P)", value: "http://log.brewersfriend.com/ispindel/[API KEY]" },
  { label: "Brewersfriend (SG)", value: "http://log.brewersfriend.com/ispindel_sg/[API KEY]" },
  { label: "Brewspy", value: "http://brew-spy.com/api/ispindel" },
  { label: "Thingsspeak", value: "http://api.thingspeak.com/update.json" },
  { label: "Blynk", value: "http://blynk.cloud/external/api/batch/update" },
  { label: "Bierdot bricks", value: "https://brewbricks.com/api/iot/v1" }
]);
const httpGetUrlOptions = ref([{ label: "-blank-", value: "" }]);
const gravityHttpPostFormatOptions = ref([
  {
    label: "GravityMon",
    value: "%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%2C%20%22corr-gravity%22%3A%20%24%7Bcorr-gravity%7D%2C%20%22gravity-unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%7D"
  },
  {
    label: "iSpindle",
    value: "%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D"
  },
  {
    label: "BrewFatherCustom",
    value: "%7B%20%20%20%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%20%20%22temp%22%3A%20%24%7Btemp%7D%2C%20%20%20%22aux_temp%22%3A%200%2C%20%20%20%22ext_temp%22%3A%200%2C%20%20%20%22temp_unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22gravity_unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%20%20%22pressure%22%3A%200%2C%20%20%20%22pressure_unit%22%3A%20%22PSI%22%2C%20%20%20%22ph%22%3A%200%2C%20%20%20%22bpm%22%3A%200%2C%20%20%20%22comment%22%3A%20%22%22%2C%20%20%20%22beer%22%3A%20%22%22%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%7D"
  },
  {
    label: "UBIDots",
    value: "%7B%20%20%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%20%20%22rssi%22%3A%20%24%7Brssi%7D%7D"
  }
]);
const gravityHttpGetFormatOptions = ref([
  {
    label: "GravityMon",
    value: "%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temp-units%3D%24%7Btemp-unit%7D%26gravity%3D%24%7Bgravity%7D%26angle%3D%24%7Bangle%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26corr-gravity%3D%24%7Bcorr-gravity%7D%26gravity-unit%3D%24%7Bgravity-unit%7D%26run-time%3D%24%7Brun-time%7D"
  }
]);
const gravityInfluxdb2FormatOptions = ref([
  {
    label: "GravityMon",
    value: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A"
  }
]);
const gravityMqttFormatOptions = ref([
  {
    label: "iSpindle",
    value: "ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp_units%3A%24%7Btemp-unit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
  },
  {
    label: "HomeAssistant",
    value: "gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7C"
  },
  {
    label: "HomeAssistant 2",
    value: "gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftemperature%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_temp%22%2C%22name%22%3A%22temperature%22%2C%22dev_cla%22%3A%22temperature%22%2C%22unit_of_meas%22%3A%22%C2%B0%24%7Btemp-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftemperature%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fgravity%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_grav%22%2C%22name%22%3A%22gravity%22%2C%22unit_of_meas%22%3A%22%20%24%7Bgravity-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fgravity%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Frssi%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_rssi%22%2C%22name%22%3A%22rssi%22%2C%22dev_cla%22%3A%22signal_strength%22%2C%22unit_of_meas%22%3A%22dBm%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Frssi%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftilt%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_tilt%22%2C%22name%22%3A%22tilt%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftilt%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fbattery%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_batt%22%2C%22name%22%3A%22battery%22%2C%22dev_cla%22%3A%22voltage%22%2C%22unit_of_meas%22%3A%22V%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fbattery%22%7D%7C"
  },
  {
    label: "Brewblox",
    value: "brewcast%2Fhistory%3A%7B%22key%22%3A%22%24%7Bmdns%7D%22%2C%22data%22%3A%7B%22Temperature%5BdegC%5D%22%3A%20%24%7Btemp-c%7D%2C%22Temperature%5BdegF%5D%22%3A%20%24%7Btemp-f%7D%2C%22Battery%5BV%5D%22%3A%24%7Bbattery%7D%2C%22Tilt%5Bdeg%5D%22%3A%24%7Bangle%7D%2C%22Rssi%5BdBm%5D%22%3A%24%7Brssi%7D%2C%22SG%22%3A%24%7Bgravity-sg%7D%2C%22Plato%22%3A%24%7Bgravity-plato%7D%7D%7D%7C"
  },
  {
    label: "PressureMon",
    value: "%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature%2Dunit%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure%2Dunit%22%3A%20%22%24%7Bpressure%2Dunit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D"
  }
]);
const pressureHttpPostFormatOptions = ref([
  {
    label: "-- none --",
    value: ""
  },
  {
    label: "Pressuremon (Single)",
    value: "%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature%2Dunit%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure%2Dunit%22%3A%20%22%24%7Bpressure%2Dunit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D"
  },
  {
    label: "Pressuremon (Dual)",
    value: "%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature-unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%20%7D"
  }
]);
const pressureHttpGetFormatOptions = ref([
  {
    label: "-- none --",
    value: ""
  },
  {
    label: "Pressuremon (Single)",
    value: "%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep%2Dinterval%7D%26temperature%3D%24%7Btemp%7D%26temperature%2Dunit%3D%24%7Btemp%2Dunit%7D%26pressure%3D%24%7Bpressure%7D%26pressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run%2Dtime%3D%24%7Brun%2Dtime%7D"
  },
  {
    label: "Pressuremon (Dual)",
    value: "%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temperature-unit%3D%24%7Btemp-unit%7D%26pressure%3D%24%7Bpressure%7D%26pressure1%3D%24%7Bpressure1%7D%26pressure-unit%3D%24%7Bpressure-unit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run-time%3D%24%7Brun-time%7D"
  }
]);
const pressureInfluxdb2FormatOptions = ref([
  {
    label: "-- none --",
    value: ""
  },
  {
    label: "Pressuremon (Single)",
    value: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature%2Dunit%3D%24%7Btemp%2Dunit%7D%2Cpressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%20pressure%3D%24%7Bpressure%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A"
  },
  {
    label: "Pressuremon (Dual)",
    value: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature-unit%3D%24%7Btemp-unit%7D%2Cpressure-unit%3D%24%7Bpressure-unit%7D%20pressure%3D%24%7Bpressure%7D%2Cpressure1%3D%24%7Bpressure1%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A"
  }
]);
const pressureMqttFormatOptions = ref([
  {
    label: "-- none --",
    value: ""
  },
  {
    label: "Pressuremon (Single)",
    value: "pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature%2Dunit%3A%24%7Btemp%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%2Dunit%3A%24%7Bpressure%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
  },
  {
    label: "Pressuremon (Dual)",
    value: "pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature-unit%3A%24%7Btemp-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure1%3A%24%7Bpressure1%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure-unit%3A%24%7Bpressure-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
  },
  {
    label: "Brewblox (Single)",
    value: "brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C"
  },
  {
    label: "Brewblox (Dual)",
    value: "brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C"
  }
]);
function validateCurrentForm() {
  let valid = true;
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false;
    form.classList.add("was-validated");
  });
  return valid;
}
function tempToF(c) {
  return c * 1.8 + 32;
}
function tempToC(f) {
  return (f - 32) / 1.8;
}
function psiToBar(p2) {
  return p2 * 0.0689475729;
}
function psiToKPa(p2) {
  return p2 * 68.947572932 * 1e3;
}
function barToPsi(p2) {
  return p2;
}
function kpaToPsi(p2) {
  return p2;
}
function applyTemplate(status2, config2, template) {
  var s = template;
  s = s.replaceAll("${temp}", status2.temp);
  var c = status2.temp;
  var f = status2.temp;
  if (config2.temp_unit === "C") {
    f = tempToF(status2.temp);
  } else {
    c = tempToC(status2.temp);
  }
  s = s.replaceAll("${temp-c}", c);
  s = s.replaceAll("${temp-f}", f);
  s = s.replaceAll("${angle}", status2.angle);
  s = s.replaceAll("${tilt}", status2.angle);
  s = s.replaceAll("${app-ver}", global$1.app_ver);
  s = s.replaceAll("${app-build}", global$1.app_build);
  s = s.replaceAll("${rssi}", status2.rssi);
  s = s.replaceAll("${battery}", status2.battery);
  if (config2.gravity_unit === "G") {
    var sg = status2.gravity;
    s = s.replaceAll("${gravity}", sg);
    s = s.replaceAll("${gravity-sg}", sg);
    s = s.replaceAll("${corr-gravity}", sg);
    s = s.replaceAll("${corr-gravity-sg}", sg);
    var plato = 259 - (259 - sg);
    s = s.replaceAll("${gravity-plato}", plato);
    s = s.replaceAll("${corr-gravity-plato}", sg);
  } else {
    plato = status2.gravity;
    s = s.replaceAll("${gravity}", plato);
    s = s.replaceAll("${corr-gravity}", plato);
    s = s.replaceAll("${corr-gravity-plato}", plato);
    s = s.replaceAll("${gravity-plato}", plato);
    sg = 259 / (259 - plato);
    s = s.replaceAll("${corr-gravity-sg}", plato);
    s = s.replaceAll("${gravity-sg}", sg);
  }
  s = s.replaceAll("${velocity}", 1.01);
  s = s.replaceAll("${mdns}", config2.mdns);
  s = s.replaceAll("${id}", config2.id);
  s = s.replaceAll("${sleep-interval}", config2.sleep_interval);
  s = s.replaceAll("${token}", config2.token);
  s = s.replaceAll("${temp-unit}", config2.temp_unit);
  s = s.replaceAll("${gravity-unit}", config2.gravity_unit);
  s = s.replaceAll("${run-time}", 1);
  var p2 = status2.pressure;
  if (status2.isKPa) {
    p2 = kpaToPsi(p2);
  } else if (status2.isBar) {
    p2 = barToPsi(p2);
  }
  s = s.replaceAll("${pressure}", p2);
  s = s.replaceAll("${pressure-psi}", p2);
  s = s.replaceAll("${pressure-bar}", psiToBar(p2));
  s = s.replaceAll("${pressure-kpa}", psiToKPa(p2));
  s = s.replaceAll("${pressure1}", p2);
  s = s.replaceAll("${pressure1-psi}", p2);
  s = s.replaceAll("${pressure1-bar}", psiToBar(p2));
  s = s.replaceAll("${pressure1-kpa}", psiToKPa(p2));
  s = s.replaceAll("${app-ver}", global$1.app_ver);
  s = s.replaceAll("${app-build}", global$1.app_build);
  s = s.replaceAll("${battery-percent}", 100);
  s = s.replaceAll("${rssi}", status2.rssi);
  s = s.replaceAll("${run-time}", status2.runtime_average);
  s = s.replaceAll("${corr-gravity}", status2.gravity);
  s = s.replaceAll("${battery}", status2.battery);
  s = s.replaceAll("${mdns}", config2.mdns);
  s = s.replaceAll("${id}", config2.id);
  s = s.replaceAll("${sleep-interval}", config2.sleep_interval);
  s = s.replaceAll("${token}", config2.token);
  s = s.replaceAll("${token2}", config2.token2);
  s = s.replaceAll("${temp-unit}", config2.temp_unit);
  s = s.replaceAll("${pressure-unit}", config2.pressure_unit);
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    logError("utils.applyTemplate()", "Not a valid json document, returning string");
  }
  return s;
}
function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s));
    return true;
  } catch {
  }
  return false;
}
function isValidFormData(s) {
  if (s.startsWith("?")) return true;
  return false;
}
function isValidMqttData(s) {
  if (s.indexOf("|") >= 0) return true;
  return false;
}
function getErrorString(code) {
  switch (code) {
    case 200:
      return "Success (200)";
    case 401:
      return "Access denied (401)";
    case 404:
      return "Endpoint not found (404)";
    case 422:
      return "Paylod cannot be parsed, check format and http headers";
  }
  return "Unknown code, check documentation (" + code + ")";
}
function restart() {
  global$1.clearMessages();
  global$1.disabled = true;
  fetch(global$1.baseURL + "api/restart", {
    headers: { Authorization: global$1.token },
    signal: AbortSignal.timeout(global$1.fetchTimout)
  }).then((res) => res.json()).then((json) => {
    if (json.status == true) {
      global$1.messageSuccess = json.message + " Redirecting to http://" + config.mdns + ".local in 8 seconds.";
      logInfo("utils.restart()", "Scheduling refresh of UI");
      setTimeout(() => {
        location.href = "http://" + config.mdns + ".local";
      }, 8e3);
    } else {
      global$1.messageError = json.message;
      global$1.disabled = false;
    }
  }).catch((err) => {
    logError("utils.restart()", err);
    global$1.messageError = "Failed to do restart";
    global$1.disabled = false;
  });
}
const useConfigStore = /* @__PURE__ */ defineStore("config", {
  state: () => {
    return {
      // Device
      id: "",
      mdns: "",
      temp_unit: "",
      gravity_unit: "",
      pressure_unit: "",
      dark_mode: false,
      // Hardware
      ble_enable: true,
      ble_active_scan: false,
      ble_scan_time: 5,
      timezone: "",
      // Wifi
      wifi_portal_timeout: 0,
      wifi_connect_timeout: 0,
      wifi_ssid: "",
      wifi_ssid2: "",
      wifi_pass: "",
      wifi_pass2: "",
      wifi_direct_ssid: "",
      wifi_direct_pass: "",
      // Push - Generic
      token: "",
      push_timeout: 0,
      push_resend_time: 300,
      // Push - Http Post 1
      http_post_target: "",
      http_post_header1: "",
      http_post_header2: "",
      http_post_format_gravity: "",
      http_post_format_pressure: "",
      // Push - Http Post 2
      http_post2_target: "",
      http_post2_header1: "",
      http_post2_header2: "",
      http_post2_format_gravity: "",
      http_post2_format_pressure: "",
      // Push - Http Get
      http_get_target: "",
      http_get_header1: "",
      http_get_header2: "",
      http_get_format_gravity: "",
      http_get_format_pressure: "",
      // Push - Influx
      influxdb2_target: "",
      influxdb2_org: "",
      influxdb2_bucket: "",
      influxdb2_token: "",
      influxdb2_format_gravity: "",
      influxdb2_format_pressure: "",
      // Push - MQTT
      mqtt_target: "",
      mqtt_port: "",
      mqtt_user: "",
      mqtt_pass: "",
      mqtt_format_gravity: "",
      mqtt_format_pressure: "",
      // Push
      http_post_gravity: true,
      http_post_pressure: true,
      http_post2_gravity: true,
      http_post2_pressure: true,
      http_get_gravity: true,
      http_get_pressure: true,
      influxdb2_gravity: true,
      influxdb2_pressure: true,
      mqtt_gravity: true,
      mqtt_pressure: true,
      // Values that are not updated but needed for format template viewer
      sleep_interval: 900
    };
  },
  actions: {
    toJson() {
      logInfo("configStore.toJSON()");
      var dest = {};
      for (var key in this.$state) {
        if (!key.startsWith("$")) {
          dest[key] = this[key];
        }
      }
      logInfo("configStore.toJSON()", dest);
      return JSON.stringify(dest, null, 2);
    },
    load(callback) {
      global$1.disabled = true;
      logInfo("configStore.load()", "Fetching /api/config");
      fetch(global$1.baseURL + "api/config", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        global$1.disabled = false;
        this.id = json.id;
        this.mdns = json.mdns;
        this.temp_unit = json.temp_unit;
        this.gravity_unit = json.gravity_unit;
        this.pressure_unit = json.pressure_unit;
        this.dark_mode = json.dark_mode;
        this.ble_enable = json.ble_enable;
        this.ble_active_scan = json.ble_active_scan;
        this.ble_scan_time = json.ble_scan_time;
        this.timezone = json.timezone;
        this.wifi_portal_timeout = json.wifi_portal_timeout;
        this.wifi_connect_timeout = json.wifi_connect_timeout;
        this.wifi_ssid = json.wifi_ssid;
        this.wifi_ssid2 = json.wifi_ssid2;
        this.wifi_pass = json.wifi_pass;
        this.wifi_pass2 = json.wifi_pass2;
        this.wifi_direct_ssid = json.wifi_direct_ssid;
        this.wifi_direct_pass = json.wifi_direct_pass;
        this.token = json.token;
        this.push_timeout = json.push_timeout;
        this.push_resend_time = json.push_resend_time;
        this.http_post_target = json.http_post_target;
        this.http_post_header1 = json.http_post_header1;
        this.http_post_header2 = json.http_post_header2;
        this.http_post2_target = json.http_post2_target;
        this.http_post2_header1 = json.http_post2_header1;
        this.http_post2_header2 = json.http_post2_header2;
        this.http_get_target = json.http_get_target;
        this.http_get_header1 = json.http_get_header1;
        this.http_get_header2 = json.http_get_header2;
        this.influxdb2_target = json.influxdb2_target;
        this.influxdb2_org = json.influxdb2_org;
        this.influxdb2_bucket = json.influxdb2_bucket;
        this.influxdb2_token = json.influxdb2_token;
        this.mqtt_target = json.mqtt_target;
        this.mqtt_port = json.mqtt_port;
        this.mqtt_user = json.mqtt_user;
        this.mqtt_pass = json.mqtt_pass;
        this.http_post_gravity = json.http_post_gravity;
        this.http_post_pressure = json.http_post_pressure;
        this.ttp_post2_gravity = json.http_post2_gravity;
        this.http_post2_pressure = json.http_post2_pressure;
        this.http_get_gravity = json.http_get_gravity;
        this.http_get_pressure = json.http_get_pressure;
        this.influxdb2_gravity = json.influxdb2_gravity;
        this.influxdb2_pressure = json.influxdb2_pressure;
        this.mqtt_gravity = json.mqtt_gravity;
        this.mqtt_pressure = json.mqtt_pressure;
        callback(true);
      }).catch((err) => {
        global$1.disabled = false;
        logError("configStore.load()", err);
        callback(false);
      });
    },
    loadFormat(callback) {
      global$1.disabled = true;
      logInfo("configStore.loadFormat()", "Fetching /api/format");
      fetch(global$1.baseURL + "api/format", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        global$1.disabled = false;
        this.http_post_format_gravity = decodeURIComponent(json.http_post_format_gravity);
        this.http_post2_format_gravity = decodeURIComponent(json.http_post2_format_gravity);
        this.http_get_format_gravity = decodeURIComponent(json.http_get_format_gravity);
        this.influxdb2_format_gravity = decodeURIComponent(json.influxdb2_format_gravity);
        this.mqtt_format_gravity = decodeURIComponent(json.mqtt_format_gravity);
        this.http_post_format_pressure = decodeURIComponent(json.http_post_format_pressure);
        this.http_post2_format_pressure = decodeURIComponent(json.http_post2_format_pressure);
        this.http_get_format_pressure = decodeURIComponent(json.http_get_format_pressure);
        this.influxdb2_format_pressure = decodeURIComponent(json.influxdb2_format_pressure);
        this.mqtt_format_pressure = decodeURIComponent(json.mqtt_format_pressure);
        callback(true);
      }).catch((err) => {
        global$1.disabled = false;
        logError("configStore.loadFormat()", err);
        callback(false);
      });
    },
    sendConfig(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendConfig()", "Sending /api/config");
      var data = getConfigChanges();
      delete data.http_post_format_gravity;
      delete data.http_post2_format_gravity;
      delete data.http_get_format_gravity;
      delete data.influxdb2_format_gravity;
      delete data.mqtt_format_gravity;
      delete data.http_post_format_pressure;
      delete data.http_post2_format_pressure;
      delete data.http_get_format_pressure;
      delete data.influxdb2_format_pressure;
      delete data.mqtt_format_pressure;
      if (JSON.stringify(data).length == 2) {
        logInfo("configStore.sendConfig()", "No config data to store, skipping step");
        global$1.disabled = false;
        callback(true);
        return;
      }
      fetch(global$1.baseURL + "api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: global$1.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        global$1.disabled = false;
        if (res.status != 200) {
          logError("configStore.sendConfig()", "Sending /api/config failed", res.status);
          callback(false);
        } else {
          logInfo("configStore.sendConfig()", "Sending /api/config completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendConfig()", err);
        callback(false);
        global$1.disabled = false;
      });
    },
    sendFormat(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendFormat()", "Sending /api/format");
      var data2 = getConfigChanges();
      var data = {};
      var cnt = 0;
      data = data2.http_post_format_gravity !== void 0 ? { http_post_format_gravity: encodeURIComponent(data2.http_post_format_gravity) } : {};
      this.sendOneFormat(data, (success) => {
        if (success) cnt += 1;
        data = data2.http_post2_format_gravity !== void 0 ? { http_post2_format_gravity: encodeURIComponent(data2.http_post2_format_gravity) } : {};
        this.sendOneFormat(data, (success2) => {
          if (success2) cnt += 1;
          data = data2.http_get_format_gravity !== void 0 ? { http_get_format_gravity: encodeURIComponent(data2.http_get_format_gravity) } : {};
          this.sendOneFormat(data, (success3) => {
            if (success3) cnt += 1;
            data = data2.influxdb2_format_gravity !== void 0 ? { influxdb2_format_gravity: encodeURIComponent(data2.influxdb2_format_gravity) } : {};
            this.sendOneFormat(data, (success4) => {
              if (success4) cnt += 1;
              if (data2.mqtt_format_gravity !== void 0) {
                data2.mqtt_format_gravity = data2.mqtt_format_gravity.replaceAll("\n", "");
                data2.mqtt_format_gravity = data2.mqtt_format_gravity.replaceAll("\r", "");
              }
              data = data2.mqtt_format_gravity !== void 0 ? { mqtt_format_gravity: encodeURIComponent(data2.mqtt_format_gravity) } : {};
              this.sendOneFormat(data, (success5) => {
                if (success5) cnt += 1;
                data = data2.http_post_format_pressure !== void 0 ? {
                  http_post_format_pressure: encodeURIComponent(
                    data2.http_post_format_pressure
                  )
                } : {};
                this.sendOneFormat(data, (success6) => {
                  if (success6) cnt += 1;
                  data = data2.http_post2_format_pressure !== void 0 ? {
                    http_post2_format_pressure: encodeURIComponent(
                      data2.http_post2_format_pressure
                    )
                  } : {};
                  this.sendOneFormat(data, (success7) => {
                    if (success7) cnt += 1;
                    data = data2.http_get_format_pressure !== void 0 ? {
                      http_get_format_pressure: encodeURIComponent(
                        data2.http_get_format_pressure
                      )
                    } : {};
                    this.sendOneFormat(data, (success8) => {
                      if (success8) cnt += 1;
                      data = data2.influxdb2_format_pressure !== void 0 ? {
                        influxdb2_format_pressure: encodeURIComponent(
                          data2.influxdb2_format_pressure
                        )
                      } : {};
                      this.sendOneFormat(data, (success9) => {
                        if (success9) cnt += 1;
                        if (data2.mqtt_format_pressure !== void 0) {
                          data2.mqtt_format_pressure = data2.mqtt_format_pressure.replaceAll(
                            "\n",
                            ""
                          );
                          data2.mqtt_format_pressure = data2.mqtt_format_pressure.replaceAll(
                            "\r",
                            ""
                          );
                        }
                        data = data2.mqtt_format_pressure !== void 0 ? {
                          mqtt_format_pressure: encodeURIComponent(data2.mqtt_format_pressure)
                        } : {};
                        this.sendOneFormat(data, (success10) => {
                          if (success10) cnt += 1;
                          if (cnt == 10) callback(true);
                          else callback(false);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    },
    sendOneFormat(data, callback) {
      logInfo("configStore.sendOneFormat()", "Sending /api/format", data);
      if (JSON.stringify(data).length == 2) {
        logInfo("configStore.sendOneFormat()", "No format data to store, skipping step");
        callback(true);
        return;
      }
      fetch(global$1.baseURL + "api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: global$1.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        global$1.disabled = false;
        if (res.status != 200) {
          logError("configStore.sendOneFormat()", "Sending /api/format failed");
          callback(false);
        } else {
          logInfo("configStore.sendOneFormat()", "Sending /api/format completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendOneFormat()", err);
        callback(false);
      });
    },
    sendPushTest(data, callback) {
      global$1.disabled = true;
      logInfo("configStore.sendPushTest()", "Sending /api/push");
      fetch(global$1.baseURL + "api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: global$1.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          logError("configStore.sendPushTest()", "Sending /api/push failed");
          callback(false);
        } else {
          logInfo("configStore.sendPushTest()", "Sending /api/push completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendPushTest()", err);
        callback(false);
      });
    },
    getPushTestStatus(callback) {
      logInfo("configStore.getPushTest()", "Fetching /api/push/status");
      fetch(global$1.baseURL + "api/push/status", {
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("configStore.getPushTest()", "Fetching /api/push/status completed");
        callback(true, json);
      }).catch((err) => {
        logError("configStore.getPushTest()", err);
        callback(false, null);
      });
    },
    sendWifiScan(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendWifiScan()", "Sending /api/wifi");
      fetch(global$1.baseURL + "api/wifi", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          logError("configStore.sendWifiScan()", "Sending /api/wifi failed");
          callback(false);
        } else {
          logInfo("configStore.sendWifiScan()", "Sending /api/wifi completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendWifiScan()", err);
        callback(false);
      });
    },
    getWifiScanStatus(callback) {
      logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status");
      fetch(global$1.baseURL + "api/wifi/status", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status completed");
        callback(true, json);
      }).catch((err) => {
        logError("configStore.getWifiScanStatus()", err);
        callback(false, null);
      });
    },
    saveAll() {
      global$1.clearMessages();
      global$1.disabled = true;
      this.sendConfig((success) => {
        if (!success) {
          global$1.disabled = false;
          global$1.messageError = "Failed to store configuration to device";
        } else {
          this.sendFormat((success2) => {
            global$1.disabled = false;
            if (!success2) {
              global$1.messageError = "Failed to store format to device";
            } else {
              global$1.messageSuccess = "Configuration has been saved to device";
              saveConfigState();
            }
          });
        }
      });
    },
    sendFilesystemRequest(data, callback) {
      global$1.disabled = true;
      logInfo("configStore.sendFilesystemRequest()", "Sending /api/filesystem");
      fetch(global$1.baseURL + "api/filesystem", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: global$1.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.text()).then((text) => {
        callback(true, text);
      }).catch((err) => {
        logError("configStore.sendFilesystemRequest()", err);
        callback(false, "");
      });
    },
    runPushTest(data, callback) {
      global$1.disabled = true;
      this.sendPushTest(data, (success) => {
        if (success) {
          var check = setInterval(() => {
            this.getPushTestStatus((success2, data2) => {
              if (success2) {
                if (data2.status) ;
                else {
                  global$1.disabled = false;
                  if (!data2.push_enabled) {
                    global$1.messageWarning = "No endpoint is defined for this target. Cannot run test.";
                  } else if (!data2.success) {
                    global$1.messageError = "Test failed with error code " + getErrorString(data2.last_error);
                  } else {
                    global$1.messageSuccess = "Test was successful";
                  }
                  callback(true);
                  clearInterval(check);
                }
              } else {
                global$1.disabled = false;
                global$1.messageError = "Failed to get push test status";
                callback(false);
                clearInterval(check);
              }
            });
          }, 2e3);
        } else {
          global$1.messageError = "Failed to start push test";
          global$1.disabled = false;
          callback(false);
        }
      });
    },
    runWifiScan(callback) {
      global$1.disabled = true;
      this.sendWifiScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getWifiScanStatus((success2, data) => {
              if (success2) {
                if (data.status) ;
                else {
                  global$1.disabled = false;
                  callback(data.success, data);
                  clearInterval(check);
                }
              } else {
                global$1.disabled = false;
                global$1.messageError = "Failed to get wifi scan status";
                callback(false);
                clearInterval(check);
              }
            });
          }, 2e3);
        } else {
          global$1.disabled = false;
          global$1.messageError = "Failed to start wifi scan";
          callback(false);
        }
      });
    }
  }
});
class TiltData {
  constructor({ type, source, created, id, color, tempC, gravity, txPower, rssi }) {
    this.type = type;
    this.source = source;
    this.created = new Date(created);
    this.id = id;
    this.color = color;
    this.tempC = tempC;
    this.gravity = gravity;
    this.txPower = txPower;
    this.rssi = rssi;
    this.isPro = type === "Tilt Pro";
  }
  getType() {
    return this.type;
  }
  getSource() {
    return this.source;
  }
  getCreated() {
    return this.created;
  }
  getId() {
    return this.id;
  }
  getColor() {
    return this.color;
  }
  getTempC() {
    return this.tempC;
  }
  getGravity() {
    return this.gravity;
  }
  getTxPower() {
    return this.txPower;
  }
  getRssi() {
    return this.rssi;
  }
  getIsPro() {
    return this.isPro;
  }
  static isTiltDataCsv(line) {
    const parts = line.split(",");
    return parts.length >= 2 && parts[0] === "1" && (parts[1] === "Tilt" || parts[1] === "Tilt Pro");
  }
  // Example: 1,Tilt,BLE Beacon,2025-07-06 12:34:56,Red,Red,20.00,1.0500,-59,-70,,,,
  // Example: 1,Tilt Pro,BLE Beacon,2025-07-06 12:34:56,Red,Red,20.00,1.0500,-59,-70,,,,
  static fromCsvLine(line) {
    const parts = line.split(",");
    if (parts.length < 10) {
      logError("TiltData.fromCsvLine", "Invalid TiltData CSV line", line);
      return;
    }
    if (parts[0] !== "1") {
      logError("TiltData.fromCsvLine", "Unsupported TiltData CSV version:", parts[0], line);
      return;
    }
    if (parts[1] !== "Tilt" && parts[1] !== "Tilt Pro") {
      logError("TiltData.fromCsvLine", "CSV line is not for TiltData:", parts[1], line);
      return;
    }
    return new TiltData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      // Will be parsed to Date in constructor
      id: parts[4],
      color: parts[5],
      tempC: parseFloat(parts[6]),
      gravity: parseFloat(parts[7]),
      txPower: parseInt(parts[8], 10),
      rssi: parseInt(parts[9], 10)
    });
  }
}
class PressureData {
  constructor({
    type,
    source,
    created,
    id,
    name,
    token,
    tempC,
    pressure,
    pressure1,
    battery,
    txPower,
    rssi,
    interval
  }) {
    this.type = type;
    this.source = source;
    this.created = new Date(created);
    this.id = id;
    this.name = name;
    this.token = token;
    this.tempC = tempC;
    this.pressure = pressure;
    this.pressure1 = pressure1;
    this.battery = battery;
    this.txPower = txPower;
    this.rssi = rssi;
    this.interval = interval;
  }
  getType() {
    return this.type;
  }
  getSource() {
    return this.source;
  }
  getCreated() {
    return this.created;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getToken() {
    return this.token;
  }
  getTempC() {
    return this.tempC;
  }
  getPressure() {
    return this.pressure;
  }
  getPressure1() {
    return this.pressure1;
  }
  getBattery() {
    return this.battery;
  }
  getTxPower() {
    return this.txPower;
  }
  getRssi() {
    return this.rssi;
  }
  getInterval() {
    return this.interval;
  }
  static isPressureDataCsv(line) {
    const parts = line.split(",");
    return parts.length >= 2 && parts[0] === "1" && parts[1] === "Pressuremon";
  }
  // Example: 1,Pressuremon,BLE Beacon,2025-07-06 12:34:56,ID,Name,Token,20.00,1.0000,1.0000,3.70,-59,-70,60
  static fromCsvLine(line) {
    const parts = line.split(",");
    if (parts.length < 14) {
      logError("PressureData.fromCsvLine", "Invalid PressureData CSV line", line);
      return;
    }
    if (parts[0] !== "1") {
      logError("PressureData.fromCsvLine", "Unsupported PressureData CSV version:", parts[0], line);
      return;
    }
    if (parts[1] !== "Pressuremon") {
      logError("PressureData.fromCsvLine", "CSV line is not for PressureData:", parts[1], line);
      return;
    }
    return new PressureData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      name: parts[5],
      token: parts[6],
      tempC: parseFloat(parts[7]),
      pressure: parseFloat(parts[8]),
      pressure1: parseFloat(parts[9]),
      battery: parseFloat(parts[10]),
      txPower: parseInt(parts[11], 10),
      rssi: parseInt(parts[12], 10),
      interval: parseInt(parts[13], 10)
    });
  }
}
class GravityData {
  constructor({
    type,
    source,
    created,
    id,
    name,
    token,
    tempC,
    gravity,
    angle,
    battery,
    txPower,
    rssi,
    interval
  }) {
    this.type = type;
    this.source = source;
    this.created = new Date(created);
    this.id = id;
    this.name = name;
    this.token = token;
    this.tempC = tempC;
    this.gravity = gravity;
    this.angle = angle;
    this.battery = battery;
    this.txPower = txPower;
    this.rssi = rssi;
    this.interval = interval;
  }
  getType() {
    return this.type;
  }
  getSource() {
    return this.source;
  }
  getCreated() {
    return this.created;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getToken() {
    return this.token;
  }
  getTempC() {
    return this.tempC;
  }
  getGravity() {
    return this.gravity;
  }
  getAngle() {
    return this.angle;
  }
  getBattery() {
    return this.battery;
  }
  getTxPower() {
    return this.txPower;
  }
  getRssi() {
    return this.rssi;
  }
  getInterval() {
    return this.interval;
  }
  static isGravityDataCsv(line) {
    const parts = line.split(",");
    return parts.length >= 2 && parts[0] === "1" && parts[1] === "Gravitymon";
  }
  // Example: 1,Gravitymon,BLE Beacon,2025-07-06 12:34:56,ID,Name,Token,20.00,1.0500,45.00,3.70,-59,-70,60
  static fromCsvLine(line) {
    const parts = line.split(",");
    if (parts.length < 14) {
      logError("GravityData.fromCsvLine", "Invalid GravityData CSV line", line);
      return;
    }
    if (parts[0] !== "1") {
      logError("GravityData.fromCsvLine", "Unsupported GravityData CSV version:", parts[0], line);
      return;
    }
    if (parts[1] !== "Gravitymon") {
      logError("GravityData.fromCsvLine", "CSV line is not for GravityData:", parts[1], line);
      return;
    }
    return new GravityData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      name: parts[5],
      token: parts[6],
      tempC: parseFloat(parts[7]),
      gravity: parseFloat(parts[8]),
      angle: parseFloat(parts[9]),
      battery: parseFloat(parts[10]),
      txPower: parseInt(parts[11], 10),
      rssi: parseInt(parts[12], 10),
      interval: parseInt(parts[13], 10)
    });
  }
}
class ChamberData {
  constructor({ type, source, created, id, chamberTempC, beerTempC, rssi }) {
    this.type = type;
    this.source = source;
    this.created = new Date(created);
    this.id = id;
    this.chamberTempC = chamberTempC;
    this.beerTempC = beerTempC;
    this.rssi = rssi;
  }
  getType() {
    return this.type;
  }
  getSource() {
    return this.source;
  }
  getCreated() {
    return this.created;
  }
  getId() {
    return this.id;
  }
  getChamberTempC() {
    return this.chamberTempC;
  }
  getBeerTempC() {
    return this.beerTempC;
  }
  getRssi() {
    return this.rssi;
  }
  static isChamberDataCsv(line) {
    const parts = line.split(",");
    return parts.length >= 2 && parts[0] === "1" && parts[1] === "Chamber Controller";
  }
  // Example: 1,Chamber Controller,BLE Beacon,2025-07-06 12:34:56,ID,20.00,19.00,-70,,,,,,
  static fromCsvLine(line) {
    const parts = line.split(",");
    if (parts.length < 8) {
      logError("ChamberData.fromCsvLine", "Invalid ChamberData CSV line", line);
      return;
    }
    if (parts[0] !== "1") {
      logError("ChamberData.fromCsvLine", "Unsupported ChamberData CSV version:", parts[0], line);
      return;
    }
    if (parts[1] !== "Chamber Controller") {
      logError("ChamberData.fromCsvLine", "CSV line is not for ChamberData:", parts[1], line);
      return;
    }
    return new ChamberData({
      type: parts[1],
      source: parts[2],
      created: parts[3],
      id: parts[4],
      chamberTempC: parseFloat(parts[5]),
      beerTempC: parseFloat(parts[6]),
      rssi: parseInt(parts[7], 10)
    });
  }
}
const useMeasurementStore = /* @__PURE__ */ defineStore("measurement", {
  state: () => {
    return {
      files: [],
      gravitymonData: [],
      pressuremonData: [],
      tiltData: [],
      chamberControllerData: []
    };
  },
  getters: {},
  actions: {
    async fetchAllMeasurementFiles(callback) {
      if (!this.files || this.files.length === 0) return;
      const fetchFile = (file) => new Promise((resolve2) => {
        this.fetchSecureDiskFile(file, (success, text) => {
          resolve2(success && text ? text : "");
        });
      });
      const fileContents = await Promise.all(this.files.map(fetchFile));
      const allLines = fileContents.map((content) => content.split(/\r?\n/).filter((line) => line.trim().length > 0)).flat();
      logInfo("measurementStore.fetchAllMeasurementFiles()", allLines);
      this.tiltData = [];
      this.gravitymonData = [];
      this.pressuremonData = [];
      this.chamberControllerData = [];
      for (const line of allLines) {
        if (!line.trim()) continue;
        if (TiltData.isTiltDataCsv(line)) {
          const obj = TiltData.fromCsvLine(line);
          if (obj) this.tiltData.push(obj);
        } else if (GravityData.isGravityDataCsv(line)) {
          const obj = GravityData.fromCsvLine(line);
          if (obj) this.gravitymonData.push(obj);
        } else if (PressureData.isPressureDataCsv(line)) {
          const obj = PressureData.fromCsvLine(line);
          if (obj) this.pressuremonData.push(obj);
        } else if (ChamberData.isChamberDataCsv(line)) {
          const obj = ChamberData.fromCsvLine(line);
          if (obj) this.chamberControllerData.push(obj);
        } else {
          logError("parseMeasurementFileLines", "Unknown CSV line type", line);
        }
      }
      const getTime = (entry) => entry.getCreated() instanceof Date ? entry.getCreated().getTime() : new Date(entry.getCreated()).getTime();
      this.gravitymonData.sort((a, b) => getTime(a) - getTime(b));
      this.pressuremonData.sort((a, b) => getTime(a) - getTime(b));
      this.tiltData.sort((a, b) => getTime(a) - getTime(b));
      this.chamberControllerData.sort((a, b) => getTime(a) - getTime(b));
      callback();
    },
    updateMeasurementFiles(callback) {
      logInfo("measurementStore.updateMeasurementFiles()", "Updating measurement files");
      var data = {
        command: "dir"
      };
      this.files = [];
      this.sendSecureDiskRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          logInfo("measurementStore.updateMeasurementFiles()", json);
          for (const f of json.files) {
            if (f.file.endsWith(".csv") && f.file.startsWith("/data")) this.files.push(f.file);
          }
          logInfo("measurementStore.updateMeasurementFiles()", this.files);
          callback(true);
        } else {
          logError("measurementStore.updateMeasurementFiles()", "Failed to fetch measurement files");
          callback(false);
        }
      });
    },
    sendSecureDiskRequest(data, callback) {
      global$1.disabled = true;
      logInfo("dataStore.sendSecureDiskRequest()", "Sending /api/sd");
      fetch(global$1.baseURL + "api/sd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: global$1.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.text()).then((text) => {
        global$1.disabled = false;
        callback(true, text);
      }).catch((err) => {
        logError("dataStore.sendSecureDiskRequest()", err);
        global$1.disabled = false;
        callback(false, "");
      });
    },
    fetchSecureDiskFile(fileName, callback) {
      global$1.disabled = true;
      logInfo("dataStore.fetchSecureDiskFile()", "Fetching file from /sd");
      fetch(global$1.baseURL + "sd" + fileName, {
        method: "GET",
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.text()).then((text) => {
        global$1.disabled = false;
        callback(true, text);
      }).catch((err) => {
        logError("dataStore.fetchSecureDiskFile()", err);
        global$1.disabled = false;
        callback(false, "");
      });
    }
  }
});
const piniaInstance = createPinia();
const config = useConfigStore(piniaInstance);
const global$1 = useGlobalStore(piniaInstance);
const status = useStatusStore(piniaInstance);
const measurement = useMeasurementStore(piniaInstance);
const configCompare = ref(null);
const saveConfigState = () => {
  logInfo("pinia.saveConfigState()", "Saving state");
  configCompare.value = {};
  for (var key in config) {
    if (typeof config[key] !== "function" && key !== "$id") {
      configCompare.value[key] = config[key];
    }
  }
  logInfo("pinia.saveConfigState()", "Saved state: ", configCompare.value);
  global$1.configChanged = false;
};
const getConfigChanges = () => {
  var changes = {};
  if (configCompare.value === null) {
    logInfo("pinia.getConfigChanges()", "configState not saved");
    return changes;
  }
  for (var key in configCompare.value) {
    if (configCompare.value[key] != config[key]) {
      changes[key] = config[key];
    }
  }
  return changes;
};
config.$subscribe(() => {
  if (!global$1.initialized) return;
  var changes = getConfigChanges();
  logInfo("pinia.subscribe()", "State change on configStore", changes);
  if (JSON.stringify(changes).length > 2) {
    global$1.configChanged = true;
    logInfo("pinia.subscribe()", "Changed properties:", changes);
  } else {
    global$1.configChanged = false;
  }
});
/*!
  * vue-router v4.5.0
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof document !== "undefined";
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module" || // support CF with dynamic imports that do not
  // add the Module string tag
  obj.default && isRouteComponent(obj.default);
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash: decode(hash)
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true
  });
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history2.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor, and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(
      historyState.value.back,
      // keep back and forward entries but override current position
      to,
      historyState.value.forward,
      true
    ), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    // it's overridden right after
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict && !pattern.endsWith("/"))
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [mainNormalizedRecord];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          normalizeRouteRecord(assign({}, mainNormalizedRecord, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            // we might be the child of an alias
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }))
        );
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher)) {
          removeRoute(record.name);
        }
      }
      if (isMatchable(matcher)) {
        insertMatcher(matcher);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    const index = findInsertionIndex(matcher, matchers);
    matchers.splice(index, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if (location2.path != null) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  function clearRoutes() {
    matchers.length = 0;
    matcherMap.clear();
  }
  return {
    addRoute,
    resolve: resolve2,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher
  };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  const normalized = {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: record.aliasOf,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    // must be declared afterwards
    // mods: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
  Object.defineProperty(normalized, "mods", {
    value: {}
  });
  return normalized;
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function findInsertionIndex(matcher, matchers) {
  let lower = 0;
  let upper = matchers.length;
  while (lower !== upper) {
    const mid = lower + upper >> 1;
    const sortOrder = comparePathParserScore(matcher, matchers[mid]);
    if (sortOrder < 0) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  const insertionAncestor = getInsertionAncestor(matcher);
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
  }
  return upper;
}
function getInsertionAncestor(matcher) {
  let ancestor = matcher;
  while (ancestor = ancestor.parent) {
    if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) {
      return ancestor;
    }
  }
  return;
}
function isMatchable({ record }) {
  return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.mods[name] = resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
        }));
      }
    }
  }
  return guards;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => {
    const to = unref(props.to);
    return router2.resolve(to);
  });
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      const p2 = router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
      if (props.viewTransition && typeof document !== "undefined" && "startViewTransition" in document) {
        document.startViewTransition(() => p2);
      }
      return p2;
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
function preferSingleVNode(vnodes) {
  return vnodes.length === 1 ? vnodes[0] : vnodes;
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && preferSingleVNode(slots.default(link));
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if (rawLocation.path != null) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: newTargetLocation.path != null ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true, force: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            assign(locationAsObject(error.to), {
              force: true
            }),
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve22, reject) => {
      readyHandlers.add([resolve22, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router22 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router22;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router22);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function deviceBadge() {
  return deviceSettingBadge() + deviceHardwareBadge() + deviceWifiBadge();
}
function deviceSettingBadge() {
  return deviceMdnsBadge();
}
function deviceHardwareBadge() {
  return false;
}
function deviceMdnsBadge() {
  return config.mdns === "" ? 1 : 0;
}
function deviceWifiBadge() {
  return deviceWifi1Badge() | deviceWifi2Badge() ? 1 : 0;
}
function deviceWifi1Badge() {
  if (config.wifi_ssid === "") return 1;
  return 0;
}
function deviceWifi2Badge() {
  if (config.wifi_ssid2 === "" && config.wifi_ssid === "") return 1;
  return 0;
}
function pushBadge() {
  return pushSettingBadge() + pushHttpPost1Badge() + pushHttpPost2Badge() + pushHttpGetBadge() + pushHttpInfluxdb2Badge() + pushHttpMqttBadge();
}
function pushTargetCount() {
  var cnt = 0;
  cnt += config.http_post_target === "" ? 0 : 1;
  cnt += config.http_post2_target === "" ? 0 : 1;
  cnt += config.http_get_target === "" ? 0 : 1;
  cnt += config.influxdb2_target === "" ? 0 : 1;
  cnt += config.mqtt_target === "" ? 0 : 1;
  return cnt;
}
function pushSettingBadge() {
  return 0;
}
function pushHttpPost1Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpPost2Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpGetBadge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpMqttBadge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
const _hoisted_1$F = { class: "container" };
const _hoisted_2$A = {
  key: 0,
  class: "container overflow-hidden text-center"
};
const _hoisted_3$u = { class: "row gy-4" };
const _hoisted_4$q = { class: "text-center" };
const _hoisted_5$m = { class: "badge bg-primary" };
const _hoisted_6$m = { class: "badge bg-primary" };
const _hoisted_7$l = { class: "text-center" };
const _hoisted_8$j = { class: "badge bg-primary" };
const _hoisted_9$g = { class: "badge bg-primary" };
const _hoisted_10$f = { class: "text-center" };
const _hoisted_11$c = { class: "badge bg-primary" };
const _hoisted_12$c = { class: "badge bg-primary" };
const _hoisted_13$b = { class: "col-md-4" };
const _hoisted_14$a = { class: "text-center" };
const _hoisted_15$8 = { class: "col-md-4" };
const _hoisted_16$7 = { class: "text-center" };
const _hoisted_17$7 = { class: "col-md-4" };
const _hoisted_18$7 = { class: "text-center" };
const _hoisted_19$5 = { class: "col-md-4" };
const _hoisted_20$3 = { class: "text-center" };
const _hoisted_21$1 = { class: "col-md-4" };
const _hoisted_22$1 = { class: "badge bg-secondary" };
const _hoisted_23$1 = { class: "badge bg-secondary" };
const _hoisted_24 = { class: "col-md-4" };
const _hoisted_25 = { class: "text-center" };
const _hoisted_26 = { class: "col-md-4" };
const _hoisted_27 = { class: "text-center" };
const _sfc_main$T = {
  __name: "HomeView",
  setup(__props) {
    const polling = ref(null);
    function formatTime(t) {
      if (t < 60)
        return new Number(t).toFixed(0) + "s";
      if (t < 60 * 60)
        return new Number(t / 60).toFixed(0) + "m";
      if (t < 60 * 60 * 24)
        return new Number(t / (60 * 60)).toFixed(0) + "h";
      return new Number(t / (60 * 60 * 24)).toFixed(0) + "d";
    }
    function formatGravity(g) {
      return config.gravity_unit === "G" ? new Number(g).toFixed(3) : new Number(g).toFixed(1);
    }
    function formatPressure(p2) {
      return config.pressure_unit === "PSI" ? new Number(p2).toFixed(3) : config.pressure_unit === "kPa" ? new Number(psiToKPa(p2)).toFixed(2) : new Number(psiToBar(p2)).toFixed(2);
    }
    function formatTemp(t) {
      return config.temp_unit === "C" ? new Number(t).toFixed(2) : new Number(t).toFixed(1);
    }
    function refresh() {
      status.load(() => {
      });
    }
    onBeforeMount(() => {
      refresh();
      polling.value = setInterval(refresh, 1e4);
    });
    onBeforeUnmount(() => {
      clearInterval(polling.value);
    });
    return (_ctx, _cache) => {
      const _component_BsCard = resolveComponent("BsCard");
      return openBlock(), createElementBlock("div", _hoisted_1$F, [
        _cache[5] || (_cache[5] = createBaseVNode("p", null, null, -1)),
        unref(status) ? (openBlock(), createElementBlock("div", _hoisted_2$A, [
          createBaseVNode("div", _hoisted_3$u, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(status).gravity_device, (g) => {
              return openBlock(), createElementBlock("div", {
                key: g.device,
                class: "col-md-4"
              }, [
                createVNode(_component_BsCard, {
                  header: "Gravity Device: " + g.device,
                  color: "info",
                  title: g.name + " (" + formatTime(g.update_time) + " / " + formatTime(g.push_time) + ")"
                }, {
                  default: withCtx(() => [
                    createBaseVNode("p", _hoisted_4$q, " Gravity: " + toDisplayString(formatGravity(g.gravity)) + " " + toDisplayString(unref(config).gravity_unit === "G" ? " SG" : " P") + " Temperature: " + toDisplayString(formatTemp(g.temp)) + " " + toDisplayString(unref(config).temp_unit), 1),
                    createBaseVNode("span", _hoisted_5$m, toDisplayString(g.source), 1),
                    _cache[0] || (_cache[0] = createTextVNode("  ")),
                    createBaseVNode("span", _hoisted_6$m, toDisplayString(g.type), 1)
                  ]),
                  _: 2
                }, 1032, ["header", "title"])
              ]);
            }), 128)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(status).pressure_device, (p2) => {
              return openBlock(), createElementBlock("div", {
                key: p2.device,
                class: "col-md-4"
              }, [
                createVNode(_component_BsCard, {
                  header: "Pressure Device: " + p2.device,
                  color: "info",
                  title: p2.name + " (" + formatTime(p2.update_time) + " / " + formatTime(p2.push_time) + ")"
                }, {
                  default: withCtx(() => [
                    createBaseVNode("p", _hoisted_7$l, " Pressure: " + toDisplayString(formatPressure(p2.pressure)) + " " + toDisplayString(unref(config).pressure_unit === "PSI" ? " psi" : unref(config).pressure_unit === "kPa" ? " kPa" : " Bar") + " Temperature: " + toDisplayString(formatTemp(p2.temp)) + " " + toDisplayString(unref(config).temp_unit), 1),
                    createBaseVNode("span", _hoisted_8$j, toDisplayString(p2.source), 1),
                    _cache[1] || (_cache[1] = createTextVNode("  ")),
                    createBaseVNode("span", _hoisted_9$g, toDisplayString(p2.type), 1)
                  ]),
                  _: 2
                }, 1032, ["header", "title"])
              ]);
            }), 128)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(status).temperature_device, (t) => {
              return openBlock(), createElementBlock("div", {
                key: t.device,
                class: "col-md-4"
              }, [
                createVNode(_component_BsCard, {
                  header: "Temperature Device",
                  color: "secondary",
                  title: t.device + " (" + formatTime(t.update_time) + ")"
                }, {
                  default: withCtx(() => [
                    createBaseVNode("p", _hoisted_10$f, " Chamber: " + toDisplayString(formatTemp(t.chamber_temp)) + " " + toDisplayString(unref(config).temp_unit) + ", Beer: " + toDisplayString(formatTemp(t.beer_temp)) + " " + toDisplayString(unref(config).temp_unit), 1),
                    createBaseVNode("span", _hoisted_11$c, toDisplayString(t.source), 1),
                    _cache[2] || (_cache[2] = createTextVNode("  ")),
                    createBaseVNode("span", _hoisted_12$c, toDisplayString(t.type), 1)
                  ]),
                  _: 2
                }, 1032, ["title"])
              ]);
            }), 128)),
            createBaseVNode("div", _hoisted_13$b, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "WIFI"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_14$a, toDisplayString(unref(status).rssi) + " dBm - " + toDisplayString(unref(status).wifi_ssid), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_15$8, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "IP Address"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_16$7, toDisplayString(unref(status).ip), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_17$7, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Memory"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_18$7, " Free: " + toDisplayString(unref(status).free_heap) + " kb, Total: " + toDisplayString(unref(status).total_heap) + " kb ", 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_19$5, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Software version"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_20$3, " Firmware: " + toDisplayString(unref(global$1).app_ver) + " (" + toDisplayString(unref(global$1).app_build) + ") UI: " + toDisplayString(unref(global$1).uiVersion) + " (" + toDisplayString(unref(global$1).uiBuild) + ") ", 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_21$1, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Platform"
              }, {
                default: withCtx(() => [
                  _cache[3] || (_cache[3] = createTextVNode(" Platform: ")),
                  createBaseVNode("span", _hoisted_22$1, toDisplayString(unref(global$1).platform), 1),
                  _cache[4] || (_cache[4] = createTextVNode(" Board: ")),
                  createBaseVNode("span", _hoisted_23$1, toDisplayString(unref(global$1).board), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_24, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Device ID"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_25, toDisplayString(unref(status).id), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_26, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Uptime"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_27, toDisplayString(unref(status).uptime_days) + " days " + toDisplayString(unref(status).uptime_hours) + " hours " + toDisplayString(unref(status).uptime_minutes) + " minutes " + toDisplayString(unref(status).uptime_seconds) + " seconds ", 1)
                ]),
                _: 1
              })
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$E = { class: "container" };
const _hoisted_2$z = { class: "row" };
const _hoisted_3$t = { class: "col-md-12" };
const _hoisted_4$p = { class: "col-md-3" };
const _hoisted_5$l = { class: "col-md-3" };
const _hoisted_6$l = { class: "col-md-3" };
const _hoisted_7$k = { class: "col-md-3" };
const _hoisted_8$i = { class: "row gy-2" };
const _hoisted_9$f = { class: "col-md-12" };
const _hoisted_10$e = ["disabled"];
const _hoisted_11$b = ["hidden"];
const _hoisted_12$b = ["disabled"];
const _hoisted_13$a = ["hidden"];
const _hoisted_14$9 = ["disabled"];
const _hoisted_15$7 = ["hidden"];
const _sfc_main$S = {
  __name: "DeviceSettingsView",
  setup(__props) {
    const tempOptions = ref([
      { label: "Celsius °C", value: "C" },
      { label: "Fahrenheit °F", value: "F" }
    ]);
    const gravityOptions = ref([
      { label: "Specific Gravity", value: "G" },
      { label: "Plato", value: "P" }
    ]);
    const uiOptions = ref([
      { label: "Day mode", value: false },
      { label: "Dark mode", value: true }
    ]);
    const pressureOptions = ref([
      { label: "PSI", value: "PSI" },
      { label: "kPA", value: "kPa" },
      { label: "Bar", value: "Bar" }
    ]);
    const factory = () => {
      global$1.clearMessages();
      logInfo("DeviceSettingsView.factory()", "Sending /api/calibrate");
      global$1.disabled = true;
      fetch(global$1.baseURL + "api/factory", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        if (json.success == true) {
          global$1.messageSuccess = json.message;
          setTimeout(() => {
            location.reload(true);
          }, 2e3);
        } else {
          global$1.messageFailed = json.message;
          global$1.disabled = false;
        }
      }).catch((err) => {
        logError("DeviceSettingsView.factory()", err);
        global$1.messageError = "Failed to do factory restore";
        global$1.disabled = false;
      });
    };
    const saveSettings = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      return openBlock(), createElementBlock("div", _hoisted_1$E, [
        _cache[14] || (_cache[14] = createBaseVNode("p", null, null, -1)),
        _cache[15] || (_cache[15] = createBaseVNode("p", { class: "h2" }, "Device - Settings", -1)),
        _cache[16] || (_cache[16] = createBaseVNode("hr", null, null, -1)),
        unref(config).mdns === "" ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => _cache[6] || (_cache[6] = [
            createTextVNode(" You need to define a mdns name for the device ")
          ])),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(saveSettings, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$z, [
            createBaseVNode("div", _hoisted_3$t, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mdns,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).mdns = $event),
                maxlength: "63",
                minlength: "1",
                label: "MDNS",
                help: "Enter device name used on the network, the suffix .local will be added to this name",
                badge: deviceMdnsBadge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "badge", "disabled"])
            ]),
            _cache[7] || (_cache[7] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_4$p, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).temp_unit,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).temp_unit = $event),
                options: tempOptions.value,
                label: "Temperature Format",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$l, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).gravity_unit,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).gravity_unit = $event),
                options: gravityOptions.value,
                label: "Gravity Format",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$l, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).pressure_unit,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).pressure_unit = $event),
                options: pressureOptions.value,
                label: "Pressure Units",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$k, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).dark_mode,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).dark_mode = $event),
                options: uiOptions.value,
                label: "User Interface",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_8$i, [
            _cache[13] || (_cache[13] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_9$f, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_11$b),
                _cache[8] || (_cache[8] = createTextVNode("  Save"))
              ], 8, _hoisted_10$e),
              _cache[11] || (_cache[11] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: _cache[5] || (_cache[5] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_13$a),
                _cache[9] || (_cache[9] = createTextVNode("  Restart device"))
              ], 8, _hoisted_12$b),
              _cache[12] || (_cache[12] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: factory,
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_15$7),
                _cache[10] || (_cache[10] = createTextVNode("  Restore factory defaults "))
              ], 8, _hoisted_14$9)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _sfc_main$R = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconWifi",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049" }, null, -1),
        createBaseVNode("path", { d: "M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z" }, null, -1)
      ]), 16);
    };
  }
});
const _hoisted_1$D = ["disabled"];
const _hoisted_2$y = ["value"];
const _hoisted_3$s = ["value"];
const _sfc_main$Q = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsSelect",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:options", "update:disabled", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const options = useModel(__props, "options");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("select", mergeProps({
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
            class: "form-select",
            disabled: disabled.value
          }, _ctx.$attrs), [
            (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
              return openBlock(), createElementBlock(Fragment, {
                key: o.value
              }, [
                o.value === model.value ? (openBlock(), createElementBlock("option", {
                  key: 0,
                  selected: "",
                  value: o.value
                }, [
                  createVNode(_sfc_main$R),
                  createTextVNode(toDisplayString(o.label), 1)
                ], 8, _hoisted_2$y)) : (openBlock(), createElementBlock("option", {
                  key: 1,
                  value: o.value
                }, toDisplayString(o.label), 9, _hoisted_3$s))
              ], 64);
            }), 128))
          ], 16, _hoisted_1$D), [
            [vModelSelect, model.value]
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$C = { class: "container" };
const _hoisted_2$x = { class: "row" };
const _hoisted_3$r = { class: "col-md-3" };
const _hoisted_4$o = { class: "col-md-3" };
const _hoisted_5$k = { class: "col-md-3" };
const _hoisted_6$k = { class: "col-md-3" };
const _hoisted_7$j = { class: "col-md-12" };
const _hoisted_8$h = { class: "fw-normal" };
const _hoisted_9$e = { class: "row gy-2" };
const _hoisted_10$d = { class: "col-md-12" };
const _hoisted_11$a = ["disabled"];
const _hoisted_12$a = ["hidden"];
const _hoisted_13$9 = ["disabled"];
const _hoisted_14$8 = ["hidden"];
const _sfc_main$P = {
  __name: "DeviceHardwareView",
  setup(__props) {
    const bleScanOptions = ref([
      { label: "Active", value: true },
      { label: "Passive", value: false }
    ]);
    const timezoneOptions = ref([
      { label: "America/Los Angeles", value: "PST8PDT,M3.2.0,M11.1.0" },
      { label: "America/Phoenix", value: "MST7" },
      { label: "America/Denver", value: "MST7MDT,M3.2.0,M11.1.0" },
      { label: "America/Chicago", value: "CST6CDT,M3.2.0,M11.1.0" },
      { label: "America/New York", value: "EST5EDT,M3.2.0,M11.1.0" },
      { label: "Europe/London", value: "GMT0BST,M3.5.0/1,M10.5.0" },
      { label: "Europe/Stockholm", value: "CET-1CEST,M3.5.0,M10.5.0/3" },
      { label: "Europe/Helsinki", value: "EET-2EEST,M3.5.0/3,M10.5.0/4" },
      { label: "Africa/Johannesburg", value: "SAST-2" },
      { label: "Asia/Singapore", value: "<+08>-8" },
      { label: "Asia/Tokyo", value: "JST-9" },
      { label: "Australia/Perth", value: "AWST-8" },
      { label: "Australia/Sydney", value: "AEST-10AEDT,M10.1.0,M4.1.0/3" },
      { label: "Pacific/Auckland", value: "NZST-12NZDT,M9.5.0,M4.1.0/3" },
      { label: "Pacific/Honolulu", value: "HST10" }
      //{ label: '', value: "" },
      //{ label: '', value: "" },
    ]);
    const save = () => {
      if (!validateCurrentForm()) return;
      global$1.clearMessages();
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_lu = resolveComponent("lu");
      return openBlock(), createElementBlock("div", _hoisted_1$C, [
        _cache[14] || (_cache[14] = createBaseVNode("p", null, null, -1)),
        _cache[15] || (_cache[15] = createBaseVNode("p", { class: "h3" }, "Device - Hardware", -1)),
        _cache[16] || (_cache[16] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$x, [
            createBaseVNode("div", _hoisted_3$r, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).ble_enable,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).ble_enable = $event),
                label: "Enable Bluetooth",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_4$o, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).ble_active_scan,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).ble_active_scan = $event),
                options: bleScanOptions.value,
                label: "Scan Mode",
                width: "",
                disabled: unref(global$1).disabled || !unref(config).ble_enable
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$k, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).ble_scan_time,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).ble_scan_time = $event),
                unit: "s",
                label: "Scanning Time",
                width: "5",
                disabled: unref(global$1).disabled || !unref(config).ble_enable
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$k, [
              createVNode(_sfc_main$Q, {
                modelValue: unref(config).timezone,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).timezone = $event),
                options: timezoneOptions.value,
                label: "Timezone",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$j, [
              _cache[7] || (_cache[7] = createBaseVNode("p", null, " ", -1)),
              _cache[8] || (_cache[8] = createBaseVNode("p", { class: "fw-normal" }, "Enable/Disable bluetooth requires a restart of the device.", -1)),
              createBaseVNode("p", _hoisted_8$h, [
                _cache[6] || (_cache[6] = createTextVNode(" Supporting the following GravityMon BLE transmission options: ")),
                createVNode(_component_lu, null, {
                  default: withCtx(() => _cache[5] || (_cache[5] = [
                    createBaseVNode("li", null, [
                      createTextVNode("Gravitymon iBeacon ("),
                      createBaseVNode("b", null, "Passive scanning"),
                      createTextVNode(")")
                    ], -1),
                    createBaseVNode("li", null, [
                      createTextVNode("Gravitymon EddyStone ("),
                      createBaseVNode("b", null, "Active scanning, Require BLE 5.0, i.e. ESP32 S3"),
                      createTextVNode(")")
                    ], -1),
                    createBaseVNode("li", null, [
                      createTextVNode("Pressuremon iBeacon ("),
                      createBaseVNode("b", null, "Passive scanning"),
                      createTextVNode(")")
                    ], -1)
                  ])),
                  _: 1
                })
              ]),
              _cache[9] || (_cache[9] = createBaseVNode("p", { class: "fw-normal" }, "If you want to use the Tilt options I recommend TiltBridge!", -1))
            ])
          ]),
          createBaseVNode("div", _hoisted_9$e, [
            _cache[13] || (_cache[13] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_10$d, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_12$a),
                _cache[10] || (_cache[10] = createTextVNode("  Save"))
              ], 8, _hoisted_11$a),
              _cache[12] || (_cache[12] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: _cache[4] || (_cache[4] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_14$8),
                _cache[11] || (_cache[11] = createTextVNode("  Restart device "))
              ], 8, _hoisted_13$9)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$B = { class: "container" };
const _hoisted_2$w = { class: "row" };
const _hoisted_3$q = { class: "col-md-6" };
const _hoisted_4$n = { class: "col-md-6" };
const _hoisted_5$j = { class: "col-md-6" };
const _hoisted_6$j = { class: "col-md-6" };
const _hoisted_7$i = { class: "col-md-6" };
const _hoisted_8$g = { class: "col-md-6" };
const _hoisted_9$d = { class: "col-md-3" };
const _hoisted_10$c = ["disabled"];
const _hoisted_11$9 = { class: "col-md-6" };
const _hoisted_12$9 = { class: "col-md-6" };
const _hoisted_13$8 = { class: "row gy-2" };
const _hoisted_14$7 = { class: "col-md-12" };
const _hoisted_15$6 = ["disabled"];
const _hoisted_16$6 = ["hidden"];
const _hoisted_17$6 = ["disabled"];
const _hoisted_18$6 = ["hidden"];
const _sfc_main$O = {
  __name: "DeviceWifiView",
  setup(__props) {
    const scanning = ref(false);
    const networks = ref([]);
    function wifiName(label, rssi, encr) {
      var l = label;
      if (encr) l += " 🔒";
      if (rssi > -50) l += " (Excellent)";
      else if (rssi > -60) l += " (Good)";
      else if (rssi > -67) l += " (Minium)";
      else l += " (Poor)";
      return l;
    }
    onMounted(() => {
      scanning.value = true;
      config.runWifiScan((success, data) => {
        if (success) {
          networks.value = [{ label: "-blank-", value: "", rssi: 0, encryption: 0, channel: 0 }];
          for (var n in data.networks) {
            var d = data.networks[n];
            var o = {
              label: wifiName(d.wifi_ssid, d.rssi, d.encryption),
              value: d.wifi_ssid,
              rssi: d.rssi,
              encryption: data.networks[n].encryption,
              channel: d.channel
            };
            var f = networks.value.filter((obj) => {
              return obj.value === d.wifi_ssid;
            });
            logDebug("DeviceWifiView.onMounted()", "result:", f, d.wifi_ssid);
            if (f.length === 0) networks.value.push(o);
          }
          scanning.value = false;
        }
      });
    });
    function generate() {
      config.wifi_direct_ssid = "gw-" + status.id;
      let strings = window.crypto.getRandomValues(new BigUint64Array(2));
      config.wifi_direct_pass = (strings[0].toString(36) + strings[1].toString(36).toUpperCase()).substring(0, 10);
    }
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
      global$1.messageInfo = "If WIFI settings are changed, restart the device and enter the new URL of the device!";
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsSelect = resolveComponent("BsSelect");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      return openBlock(), createElementBlock("div", _hoisted_1$B, [
        _cache[19] || (_cache[19] = createBaseVNode("p", null, null, -1)),
        _cache[20] || (_cache[20] = createBaseVNode("p", { class: "h3" }, "Device - WIFI", -1)),
        _cache[21] || (_cache[21] = createBaseVNode("hr", null, null, -1)),
        scanning.value ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: false,
          message: "Scanning for wifi networks in range",
          alert: "info"
        })) : createCommentVNode("", true),
        unref(config).wifi_ssid === "" && unref(config).wifi_ssid2 === "" ? (openBlock(), createBlock(_component_BsMessage, {
          key: 1,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => _cache[10] || (_cache[10] = [
            createTextVNode(" You need to define at least one wifi network ")
          ])),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$w, [
            createBaseVNode("div", _hoisted_3$q, [
              createVNode(_component_BsSelect, {
                modelValue: unref(config).wifi_ssid,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).wifi_ssid = $event),
                label: "SSID #1",
                options: networks.value,
                badge: deviceWifi1Badge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "badge", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_4$n, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_pass,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).wifi_pass = $event),
                type: "password",
                maxlength: "50",
                label: "Password #1",
                help: "Enter password for the first wifi network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$j, [
              createVNode(_component_BsSelect, {
                modelValue: unref(config).wifi_ssid2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).wifi_ssid2 = $event),
                label: "SSID #2",
                options: networks.value,
                badge: deviceWifi2Badge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "badge", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$j, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_pass2,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).wifi_pass2 = $event),
                type: "password",
                maxlength: "50",
                label: "Password #2",
                help: "Enter password for the first wifi network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _cache[12] || (_cache[12] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            _cache[13] || (_cache[13] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("p", null, " Wifi Direct allows a device to directly connect with the gateway and bypass the access points. This allows for direct link between the two. Can be useful to ensure that the closest access point is used. The gateway will broadcast this SSID for use by other devices. ")
            ], -1)),
            createBaseVNode("div", _hoisted_7$i, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_direct_ssid,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).wifi_direct_ssid = $event),
                label: "Direct SSID",
                help: "Enter the SSID for the wifi direct functionallity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$g, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_direct_pass,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).wifi_direct_pass = $event),
                type: "password",
                maxlength: "50",
                label: "Direct Password",
                help: "Enter password for the wifi direct network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$d, [
              _cache[11] || (_cache[11] = createBaseVNode("p", null, null, -1)),
              createBaseVNode("button", {
                onClick: _cache[6] || (_cache[6] = ($event) => generate()),
                type: "button",
                class: "btn btn-secondary w-2",
                disabled: unref(global$1).disabled
              }, "  Generate ", 8, _hoisted_10$c)
            ]),
            _cache[14] || (_cache[14] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_11$9, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).wifi_portal_timeout,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).wifi_portal_timeout = $event),
                unit: "seconds",
                label: "Portal timeout",
                min: "10",
                max: "240",
                step: "1",
                width: "5",
                help: "Max time the wifi portal is idle (10 to 240)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$9, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).wifi_connect_timeout,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(config).wifi_connect_timeout = $event),
                unit: "seconds",
                label: "Connection timeout",
                min: "1",
                max: "60",
                step: "1",
                width: "5",
                help: "Max time waiting for a wifi connection (1 to 60)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_13$8, [
            _cache[18] || (_cache[18] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_14$7, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_16$6),
                _cache[15] || (_cache[15] = createTextVNode("  Save"))
              ], 8, _hoisted_15$6),
              _cache[17] || (_cache[17] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: _cache[9] || (_cache[9] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$6),
                _cache[16] || (_cache[16] = createTextVNode("  Restart device "))
              ], 8, _hoisted_17$6)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$A = { class: "container" };
const _hoisted_2$v = { class: "row" };
const _hoisted_3$p = { class: "col-md-6" };
const _hoisted_4$m = { class: "col-md-6" };
const _hoisted_5$i = { class: "col-md-6" };
const _hoisted_6$i = { class: "row gy-2" };
const _hoisted_7$h = { class: "col-md-3" };
const _hoisted_8$f = ["disabled"];
const _hoisted_9$c = ["hidden"];
const _sfc_main$N = {
  __name: "PushSettingsView",
  setup(__props) {
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      return openBlock(), createElementBlock("div", _hoisted_1$A, [
        _cache[5] || (_cache[5] = createBaseVNode("p", null, null, -1)),
        _cache[6] || (_cache[6] = createBaseVNode("p", { class: "h3" }, "Push - Settings", -1)),
        _cache[7] || (_cache[7] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$v, [
            createBaseVNode("div", _hoisted_3$p, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).token,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).token = $event),
                maxlength: "50",
                label: "Token",
                help: "Token can be used in the format template as a variable, some services use this for authentication",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_4$m, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).push_timeout,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).push_timeout = $event),
                label: "Push timeout",
                unit: "s",
                min: "10",
                max: "60",
                step: "1",
                width: "5",
                help: "The number of seconds that the device will wait until a remote service accepts the connection",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$i, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).push_resend_time,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).push_resend_time = $event),
                label: "Push minimum resend time",
                unit: "s",
                min: "10",
                max: "1800",
                step: "1",
                width: "5",
                help: "The number of seconds before a value can be resent to a push target",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_6$i, [
            _cache[4] || (_cache[4] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_7$h, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_9$c),
                _cache[3] || (_cache[3] = createTextVNode("  Save "))
              ], 8, _hoisted_8$f)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$z = { class: "container" };
const _hoisted_2$u = { class: "row" };
const _hoisted_3$o = { class: "col-md-9" };
const _hoisted_4$l = { class: "col-md-3" };
const _hoisted_5$h = { class: "col-md-9" };
const _hoisted_6$h = { class: "col-md-3" };
const _hoisted_7$g = { class: "col-md-9" };
const _hoisted_8$e = { class: "col-md-3" };
const _hoisted_9$b = { class: "col-md-9" };
const _hoisted_10$b = { class: "col-md-3" };
const _hoisted_11$8 = { class: "col-md-9" };
const _hoisted_12$8 = { class: "col-md-3" };
const _hoisted_13$7 = { class: "row gy-2" };
const _hoisted_14$6 = { class: "col-md-12" };
const _hoisted_15$5 = ["disabled"];
const _hoisted_16$5 = ["hidden"];
const _hoisted_17$5 = ["disabled"];
const _hoisted_18$5 = ["hidden"];
const _hoisted_19$4 = ["disabled"];
const _hoisted_20$2 = ["hidden"];
const _sfc_main$M = {
  __name: "PushHttpPost1View",
  setup(__props) {
    const render = ref("");
    const runTestGravity = () => {
      const data = {
        push_format: "http_post_format_gravity"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const runTestPressure = () => {
      const data = {
        push_format: "http_post_format_pressure"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_post_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_post_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_post_header2 = opt;
    };
    const gravityHttpFormatCallback = (opt) => {
      config.http_post_format_gravity = decodeURIComponent(opt);
    };
    const pressureHttpFormatCallback = (opt) => {
      config.http_post_format_pressure = decodeURIComponent(opt);
    };
    const gravityRenderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post_format_gravity);
    };
    const pressureRenderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post_format_pressure);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$z, [
        _cache[15] || (_cache[15] = createBaseVNode("p", null, null, -1)),
        _cache[16] || (_cache[16] = createBaseVNode("p", { class: "h3" }, "Push - HTTP Post", -1)),
        _cache[17] || (_cache[17] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$u, [
            createBaseVNode("div", _hoisted_3$o, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_post_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_4$l, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpPostUrlOptions),
                callback: httpUrlCallback,
                disabled: unref(global$1).disabled
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$h, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_post_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$h, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: unref(global$1).disabled
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$g, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_post_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$e, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: unref(global$1).disabled
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$b, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post_format_gravity,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_post_format_gravity = $event),
                rows: "6",
                label: "Gravity Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: unref(global$1).disabled || !unref(config).http_post_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$b, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_post_gravity,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_post_gravity = $event),
                label: "Enable gravity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(gravityHttpPostFormatOptions),
                callback: gravityHttpFormatCallback,
                disabled: unref(global$1).disabled || !unref(config).http_post_gravity
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: gravityRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                json: true,
                title: "Format preview",
                button: "Preview format",
                disabled: unref(global$1).disabled || !unref(config).http_post_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$8, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post_format_pressure,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).http_post_format_pressure = $event),
                rows: "6",
                label: "Pressure Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: unref(global$1).disabled || !unref(config).http_post_pressure
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$8, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_post_pressure,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).http_post_pressure = $event),
                label: "Enable pressure",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(pressureHttpPostFormatOptions),
                callback: pressureHttpFormatCallback,
                disabled: unref(global$1).disabled || !unref(config).http_post_pressure
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: pressureRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => render.value = $event),
                code: true,
                json: true,
                title: "Format preview",
                button: "Preview format",
                disabled: unref(global$1).disabled || !unref(config).http_post_pressure
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_13$7, [
            _cache[14] || (_cache[14] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_14$6, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_16$5),
                _cache[9] || (_cache[9] = createTextVNode("  Save"))
              ], 8, _hoisted_15$5),
              _cache[12] || (_cache[12] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestGravity,
                type: "button",
                class: "btn btn-secondary",
                disabled: _ctx.pushDisabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$5),
                _cache[10] || (_cache[10] = createTextVNode("  Run push gravity test"))
              ], 8, _hoisted_17$5),
              _cache[13] || (_cache[13] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestPressure,
                type: "button",
                class: "btn btn-secondary",
                disabled: _ctx.pushDisabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_20$2),
                _cache[11] || (_cache[11] = createTextVNode("  Run push pressure test "))
              ], 8, _hoisted_19$4)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$y = { class: "container" };
const _hoisted_2$t = ["disabled"];
const _hoisted_3$n = { class: "row" };
const _hoisted_4$k = { class: "col-md-9" };
const _hoisted_5$g = { class: "col-md-3" };
const _hoisted_6$g = { class: "col-md-9" };
const _hoisted_7$f = { class: "col-md-3" };
const _hoisted_8$d = { class: "col-md-9" };
const _hoisted_9$a = { class: "col-md-3" };
const _hoisted_10$a = { class: "row" };
const _hoisted_11$7 = { class: "col-md-9" };
const _hoisted_12$7 = { class: "col-md-3" };
const _hoisted_13$6 = { class: "row" };
const _hoisted_14$5 = { class: "col-md-9" };
const _hoisted_15$4 = { class: "col-md-3" };
const _hoisted_16$4 = { class: "row gy-2" };
const _hoisted_17$4 = { class: "col-md-12" };
const _hoisted_18$4 = ["disabled"];
const _hoisted_19$3 = ["hidden"];
const _hoisted_20$1 = ["disabled"];
const _hoisted_21 = ["hidden"];
const _hoisted_22 = ["disabled"];
const _hoisted_23 = ["hidden"];
const _sfc_main$L = {
  __name: "PushHttpPost2View",
  setup(__props) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTestGravity = () => {
      const data = {
        push_format: "http_post2_format_gravity"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const runTestPressure = () => {
      const data = {
        push_format: "http_post2_format_pressure"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_post2_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_post2_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_post2_header2 = opt;
    };
    const gravityHttpFormatCallback = (opt) => {
      config.http_post2_format_gravity = decodeURIComponent(opt);
    };
    const pressureHttpFormatCallback = (opt) => {
      config.http_post2_format_pressure = decodeURIComponent(opt);
    };
    const gravityRenderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post2_format_gravity);
    };
    const pressureRenderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post2_format_pressure);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$y, [
        _cache[15] || (_cache[15] = createBaseVNode("p", null, null, -1)),
        _cache[16] || (_cache[16] = createBaseVNode("p", { class: "h3" }, "Push - HTTP Post #2", -1)),
        _cache[17] || (_cache[17] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_3$n, [
            createBaseVNode("div", _hoisted_4$k, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_post2_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$g, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpPostUrlOptions),
                callback: httpUrlCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$g, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_post2_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$f, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$d, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_post2_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$a, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_10$a, [
            createBaseVNode("div", _hoisted_11$7, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post2_format_gravity,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_post2_format_gravity = $event),
                rows: "6",
                label: "Gravity Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).http_post_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$7, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_post2_gravity,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_post2_gravity = $event),
                label: "Enable gravity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(gravityHttpPostFormatOptions),
                callback: gravityHttpFormatCallback,
                disabled: pushDisabled.value || !unref(config).http_post2_gravity
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: gravityRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                json: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).http_post2_gravity
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_13$6, [
            createBaseVNode("div", _hoisted_14$5, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post2_format_pressure,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).http_post2_format_pressure = $event),
                rows: "6",
                label: "Pressure Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).http_post2_pressure
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_15$4, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_post2_pressure,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).http_post2_pressure = $event),
                label: "Enable pressure",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(pressureHttpPostFormatOptions),
                callback: pressureHttpFormatCallback,
                disabled: pushDisabled.value || !unref(config).http_post2_pressure
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: pressureRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => render.value = $event),
                code: true,
                json: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).http_post2_pressure
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_16$4, [
            _cache[14] || (_cache[14] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_17$4, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_19$3),
                _cache[9] || (_cache[9] = createTextVNode("  Save"))
              ], 8, _hoisted_18$4),
              _cache[12] || (_cache[12] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestGravity,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21),
                _cache[10] || (_cache[10] = createTextVNode("  Run push gravity test"))
              ], 8, _hoisted_20$1),
              _cache[13] || (_cache[13] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestPressure,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_23),
                _cache[11] || (_cache[11] = createTextVNode("  Run push pressure test "))
              ], 8, _hoisted_22)
            ])
          ])
        ], 40, _hoisted_2$t)
      ]);
    };
  }
};
const _hoisted_1$x = { class: "container" };
const _hoisted_2$s = { class: "row" };
const _hoisted_3$m = { class: "col-md-9" };
const _hoisted_4$j = { class: "col-md-3" };
const _hoisted_5$f = { class: "col-md-9" };
const _hoisted_6$f = { class: "col-md-3" };
const _hoisted_7$e = { class: "col-md-9" };
const _hoisted_8$c = { class: "col-md-3" };
const _hoisted_9$9 = { class: "col-md-9" };
const _hoisted_10$9 = { class: "col-md-3" };
const _hoisted_11$6 = { class: "col-md-9" };
const _hoisted_12$6 = { class: "col-md-3" };
const _hoisted_13$5 = { class: "row gy-2" };
const _hoisted_14$4 = { class: "col-md-12" };
const _hoisted_15$3 = ["disabled"];
const _hoisted_16$3 = ["hidden"];
const _hoisted_17$3 = ["disabled"];
const _hoisted_18$3 = ["hidden"];
const _hoisted_19$2 = ["disabled"];
const _hoisted_20 = ["hidden"];
const _sfc_main$K = {
  __name: "PushHttpGetView",
  setup(__props) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTestGravity = () => {
      const data = {
        push_format: "http_get_format_gravity"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const runTestPressure = () => {
      const data = {
        push_format: "http_get_format_pressure"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_get_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_get_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_get_header2 = opt;
    };
    const gravityHttpFormatCallback = (opt) => {
      config.http_get_format_gravity = decodeURIComponent(opt);
    };
    const pressureHttpFormatCallback = (opt) => {
      config.http_get_format_pressure = decodeURIComponent(opt);
    };
    const gravityRenderFormat = () => {
      var s = applyTemplate(status, config, config.http_get_format_gravity);
      render.value = s.replaceAll("&", "&");
    };
    const pressureRenderFormat = () => {
      var s = applyTemplate(status, config, config.http_get_format_pressure);
      render.value = s.replaceAll("&", "&");
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$x, [
        _cache[15] || (_cache[15] = createBaseVNode("p", null, null, -1)),
        _cache[16] || (_cache[16] = createBaseVNode("p", { class: "h3" }, "Push - HTTP Get", -1)),
        _cache[17] || (_cache[17] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_2$s, [
            createBaseVNode("div", _hoisted_3$m, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_get_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_4$j, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpGetUrlOptions),
                callback: httpUrlCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$f, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_get_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$f, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$e, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_get_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$c, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$9, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_get_format_gravity,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_get_format_gravity = $event),
                rows: "6",
                label: "Gravity Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).http_get_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$9, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_get_gravity,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_get_gravity = $event),
                label: "Enable gravity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(gravityHttpGetFormatOptions),
                callback: gravityHttpFormatCallback,
                disabled: pushDisabled.value || !unref(config).http_get_gravity
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: gravityRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).http_get_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$6, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_get_format_pressure,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).http_get_format_pressure = $event),
                rows: "6",
                label: "Pressure Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).http_get_pressure
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$6, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).http_get_pressure,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).http_get_pressure = $event),
                label: "Enable pressure",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(pressureHttpGetFormatOptions),
                callback: pressureHttpFormatCallback,
                disabled: pushDisabled.value || !unref(config).http_get_pressure
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: pressureRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).http_get_pressure
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_13$5, [
            _cache[14] || (_cache[14] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_14$4, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_16$3),
                _cache[9] || (_cache[9] = createTextVNode("  Save"))
              ], 8, _hoisted_15$3),
              _cache[12] || (_cache[12] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestGravity,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$3),
                _cache[10] || (_cache[10] = createTextVNode("  Run push gravity test"))
              ], 8, _hoisted_17$3),
              _cache[13] || (_cache[13] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestPressure,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_20),
                _cache[11] || (_cache[11] = createTextVNode("  Run push pressure test "))
              ], 8, _hoisted_19$2)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$w = { class: "container" };
const _hoisted_2$r = ["disabled"];
const _hoisted_3$l = { class: "row" };
const _hoisted_4$i = { class: "col-md-12" };
const _hoisted_5$e = { class: "col-md-6" };
const _hoisted_6$e = { class: "col-md-6" };
const _hoisted_7$d = { class: "col-md-6" };
const _hoisted_8$b = { class: "col-md-9" };
const _hoisted_9$8 = { class: "col-md-3 gy-2" };
const _hoisted_10$8 = { class: "col-md-9" };
const _hoisted_11$5 = { class: "col-md-3 gy-2" };
const _hoisted_12$5 = { class: "row gy-2" };
const _hoisted_13$4 = { class: "col-sm-12" };
const _hoisted_14$3 = ["disabled"];
const _hoisted_15$2 = ["hidden"];
const _hoisted_16$2 = ["disabled"];
const _hoisted_17$2 = ["hidden"];
const _hoisted_18$2 = ["disabled"];
const _hoisted_19$1 = ["hidden"];
const _sfc_main$J = {
  __name: "PushInfluxdbView",
  setup(__props) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTestGravity = () => {
      const data = {
        push_format: "influxdb2_format_gravity"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const runTestPressure = () => {
      const data = {
        push_format: "influxdb2_format_pressure"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const gravityInfluxdb2FormatCallback = (opt) => {
      config.influxdb2_format_gravity = decodeURIComponent(opt);
    };
    const pressureInfluxdb2FormatCallback = (opt) => {
      config.influxdb2_format_pressure = decodeURIComponent(opt);
    };
    const gravityRenderFormat = () => {
      render.value = applyTemplate(status, config, config.influxdb2_format_gravity);
    };
    const pressureRenderFormat = () => {
      render.value = applyTemplate(status, config, config.influxdb2_format_pressure);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$w, [
        _cache[16] || (_cache[16] = createBaseVNode("p", null, null, -1)),
        _cache[17] || (_cache[17] = createBaseVNode("p", { class: "h3" }, "Push - Influxdb v2", -1)),
        _cache[18] || (_cache[18] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_3$l, [
            createBaseVNode("div", _hoisted_4$i, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).influxdb2_target = $event),
                type: "url",
                maxlength: "120",
                label: "Server",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$e, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_org,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).influxdb2_org = $event),
                maxlength: "50",
                label: "Organisation",
                help: "Identifier to what organisation to use",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$e, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_bucket,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).influxdb2_bucket = $event),
                maxlength: "50",
                label: "Bucket",
                help: "Identifier for the data bucket to use",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$d, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_token,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).influxdb2_token = $event),
                type: "password",
                maxlength: "100",
                label: "Authentication token",
                help: "Authentication token for accessing data bucket",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$b, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).influxdb2_format_gravity,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).influxdb2_format_gravity = $event),
                rows: "6",
                label: "Gravity Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).influxdb2_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$8, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).influxdb2_gravity,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).influxdb2_gravity = $event),
                label: "Enable gravity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(gravityInfluxdb2FormatOptions),
                callback: gravityInfluxdb2FormatCallback,
                disabled: pushDisabled.value || !unref(config).influxdb2_gravity
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: gravityRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).influxdb2_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$8, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).influxdb2_format_pressure,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).influxdb2_format_pressure = $event),
                rows: "6",
                label: "Pressure Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).influxdb2_pressure
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$5, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).influxdb2_pressure,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(config).influxdb2_pressure = $event),
                label: "Enable pressure",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(pressureInfluxdb2FormatOptions),
                callback: pressureInfluxdb2FormatCallback,
                disabled: pushDisabled.value || !unref(config).influxdb2_pressure
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: pressureRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).influxdb2_pressure
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_12$5, [
            _cache[15] || (_cache[15] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_13$4, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_15$2),
                _cache[10] || (_cache[10] = createTextVNode("  Save"))
              ], 8, _hoisted_14$3),
              _cache[13] || (_cache[13] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestGravity,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_17$2),
                _cache[11] || (_cache[11] = createTextVNode("  Run push gravity test"))
              ], 8, _hoisted_16$2),
              _cache[14] || (_cache[14] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestPressure,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_19$1),
                _cache[12] || (_cache[12] = createTextVNode("  Run push pressure test "))
              ], 8, _hoisted_18$2)
            ])
          ])
        ], 40, _hoisted_2$r)
      ]);
    };
  }
};
const _hoisted_1$v = { class: "container" };
const _hoisted_2$q = ["disabled"];
const _hoisted_3$k = { class: "row" };
const _hoisted_4$h = { class: "col-md-9" };
const _hoisted_5$d = { class: "col-md-3" };
const _hoisted_6$d = { class: "col-md-6" };
const _hoisted_7$c = { class: "col-md-6" };
const _hoisted_8$a = { class: "col-md-9" };
const _hoisted_9$7 = { class: "col-md-3" };
const _hoisted_10$7 = { class: "col-md-9" };
const _hoisted_11$4 = { class: "col-md-3" };
const _hoisted_12$4 = { class: "row gy-2" };
const _hoisted_13$3 = { class: "col-md-12" };
const _hoisted_14$2 = ["disabled"];
const _hoisted_15$1 = ["hidden"];
const _hoisted_16$1 = ["disabled"];
const _hoisted_17$1 = ["hidden"];
const _hoisted_18$1 = ["disabled"];
const _hoisted_19 = ["hidden"];
const _sfc_main$I = {
  __name: "PushMqttView",
  setup(__props) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTestGravity = () => {
      const data = {
        push_format: "mqtt_format_gravity"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const runTestPressure = () => {
      const data = {
        push_format: "mqtt_format_pressure"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const gravityMqttFormatCallback = (opt) => {
      config.mqtt_format_gravity = decodeURIComponent(opt);
      config.mqtt_format_gravity = config.mqtt_format_gravity.replaceAll("|", "|\n");
    };
    const pressureMqttFormatCallback = (opt) => {
      config.mqtt_format_pressure = decodeURIComponent(opt);
      config.mqtt_format_pressure = config.mqtt_format_pressure.replaceAll("|", "|\n");
    };
    const gravityRenderFormat = () => {
      render.value = applyTemplate(status, config, config.mqtt_format_gravity);
    };
    const pressureRenderFormat = () => {
      render.value = applyTemplate(status, config, config.mqtt_format_pressure);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$v, [
        _cache[16] || (_cache[16] = createBaseVNode("p", null, null, -1)),
        _cache[17] || (_cache[17] = createBaseVNode("p", { class: "h3" }, "Push - MQTT", -1)),
        _cache[18] || (_cache[18] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_3$k, [
            createBaseVNode("div", _hoisted_4$h, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).mqtt_target = $event),
                maxlength: "120",
                label: "Server",
                help: "Name of server to connect to, use format servername.com",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_5$d, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).mqtt_port,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).mqtt_port = $event),
                label: "Port",
                min: "0",
                max: "65535",
                help: "Port number, 1883 is standard. Ports above 8000 means SSL",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_6$d, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_user,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).mqtt_user = $event),
                maxlength: "20",
                label: "User name",
                help: "Username to use. Leave blank if authentication is disabled",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$c, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_pass,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).mqtt_pass = $event),
                type: "password",
                maxlength: "20",
                label: "Password",
                help: "Password to use. Leave blank if authentication is disabled",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$a, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).mqtt_format_gravity,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).mqtt_format_gravity = $event),
                rows: "6",
                label: "Gravity Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).mqtt_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$7, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).mqtt_gravity,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).mqtt_gravity = $event),
                label: "Enable gavity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(gravityMqttFormatOptions),
                callback: gravityMqttFormatCallback,
                disabled: pushDisabled.value || !unref(config).mqtt_gravity
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: gravityRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => render.value = $event),
                code: true,
                json: true,
                mqtt: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).mqtt_gravity
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$7, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).mqtt_format_pressure,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).mqtt_format_pressure = $event),
                rows: "6",
                label: "Pressure Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value || !unref(config).mqtt_pressure
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$4, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).mqtt_pressure,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(config).mqtt_pressure = $event),
                label: "Enable pressure",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(pressureMqttFormatOptions),
                callback: pressureMqttFormatCallback,
                disabled: pushDisabled.value || !unref(config).mqtt_pressure
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: pressureRenderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => render.value = $event),
                code: true,
                json: true,
                mqtt: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value || !unref(config).mqtt_pressure
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_12$4, [
            _cache[15] || (_cache[15] = createBaseVNode("div", { class: "col-md-12" }, [
              createBaseVNode("hr")
            ], -1)),
            createBaseVNode("div", _hoisted_13$3, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_15$1),
                _cache[10] || (_cache[10] = createTextVNode("  Save"))
              ], 8, _hoisted_14$2),
              _cache[13] || (_cache[13] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestGravity,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_17$1),
                _cache[11] || (_cache[11] = createTextVNode("  Run push gravity test"))
              ], 8, _hoisted_16$1),
              _cache[14] || (_cache[14] = createTextVNode("  ")),
              createBaseVNode("button", {
                onClick: runTestPressure,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_19),
                _cache[12] || (_cache[12] = createTextVNode("  Run push pressure test "))
              ], 8, _hoisted_18$1)
            ])
          ])
        ], 40, _hoisted_2$q)
      ]);
    };
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$H = {};
const _hoisted_1$u = { class: "container" };
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$u, _cache[0] || (_cache[0] = [
    createStaticVNode('<p></p><p class="h3">About - Gravitymon Gateway</p><hr><p class="fw-normal"> This is a software that can be used to relay Gravitymon 2.0 BLE data to one or more endpoints, this was created to handle the new custom formats introduced in GravityMon 2.0 which can send more data than TILT. </p><p class="fw-normal"> It also supports the Wifi Direct option so it can act as a relay to ensure the gravity device always have good wifi connection. </p><p class="h4">MIT License</p><p class="fw-normal"> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. </p>', 7)
  ]));
}
const AboutView = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$1]]);
const _hoisted_1$t = { class: "container" };
const _hoisted_2$p = { class: "row" };
const _hoisted_3$j = { style: {} };
const _hoisted_4$g = { class: "badge bg-secondary" };
const _hoisted_5$c = { class: "badge bg-secondary" };
const _hoisted_6$c = { class: "badge bg-secondary" };
const _hoisted_7$b = { class: "badge bg-secondary" };
const _hoisted_8$9 = { class: "col-md-12" };
const _hoisted_9$6 = { class: "col-md-3" };
const _hoisted_10$6 = ["disabled"];
const _hoisted_11$3 = ["hidden"];
const _hoisted_12$3 = {
  key: 0,
  class: "col-md-12"
};
const _sfc_main$G = {
  __name: "FirmwareView",
  setup(__props) {
    const progress = ref(0);
    function upload() {
      const fileElement = document.getElementById("upload");
      function errorAction(e) {
        logError("FirmwareView.upload()", e.type);
        global$1.messageFailed = "File upload failed!";
        global$1.disabled = false;
      }
      if (fileElement.files.length === 0) {
        global$1.messageFailed = "You need to select one file with firmware to upload";
      } else {
        global$1.disabled = true;
        logDebug("FirmwareView.upload()", "Selected file: " + fileElement.files[0].name);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1e3 * 180;
        progress.value = 0;
        xhr.onabort = function(e) {
          errorAction(e);
        };
        xhr.onerror = function(e) {
          errorAction(e);
        };
        xhr.ontimeout = function(e) {
          errorAction(e);
        };
        xhr.onloadstart = function() {
        };
        xhr.onloadend = function() {
          progress.value = 100;
          if (xhr.status == 200) {
            global$1.messageSuccess = "File upload completed, waiting for device to restart before doing refresh!";
            global$1.messageFailed = "";
          }
          setTimeout(() => {
            location.href = location.href.replace("/other/firmware", "");
          }, 1e4);
        };
        xhr.upload.addEventListener(
          "progress",
          (e) => {
            progress.value = e.loaded / e.total * 100;
          },
          false
        );
        const fileData = new FormData();
        fileData.onprogress = function(e) {
          logDebug("FirmwareView.upload()", "progress2: " + e.loaded + "," + e.total + "," + xhr.status);
        };
        fileData.append("file", fileElement.files[0]);
        xhr.open("POST", global$1.baseURL + "api/firmware");
        xhr.setRequestHeader("Authorization", global$1.token);
        xhr.send(fileData);
      }
    }
    return (_ctx, _cache) => {
      const _component_BsFileUpload = resolveComponent("BsFileUpload");
      const _component_BsProgress = resolveComponent("BsProgress");
      return openBlock(), createElementBlock("div", _hoisted_1$t, [
        _cache[6] || (_cache[6] = createBaseVNode("p", null, null, -1)),
        _cache[7] || (_cache[7] = createBaseVNode("p", { class: "h3" }, "Firmware Upload", -1)),
        _cache[8] || (_cache[8] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", _hoisted_2$p, [
          createBaseVNode("form", {
            onSubmit: withModifiers(upload, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_3$j, [
              createBaseVNode("p", null, [
                _cache[0] || (_cache[0] = createTextVNode(" Selet the firmware file that matches your device. Platform: ")),
                createBaseVNode("span", _hoisted_4$g, toDisplayString(unref(global$1).platform), 1),
                _cache[1] || (_cache[1] = createTextVNode(" , Version: ")),
                createBaseVNode("span", _hoisted_5$c, toDisplayString(unref(global$1).app_ver), 1),
                createTextVNode(" (" + toDisplayString(unref(global$1).app_build) + ") , Board: ", 1),
                createBaseVNode("span", _hoisted_6$c, toDisplayString(unref(global$1).board), 1),
                _cache[2] || (_cache[2] = createTextVNode(" , Firmware file: ")),
                createBaseVNode("span", _hoisted_7$b, toDisplayString(unref(global$1).firmware_file), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_8$9, [
              createVNode(_component_BsFileUpload, {
                name: "upload",
                id: "upload",
                label: "Select firmware file",
                accept: ".bin",
                help: "Choose the firmware file that will be used to update the device",
                disabled: unref(global$1).disabled
              }, null, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$6, [
              _cache[4] || (_cache[4] = createBaseVNode("p", null, null, -1)),
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary",
                id: "upload-btn",
                value: "upload",
                "data-bs-toggle": "tooltip",
                title: "Update the device with the selected firmware",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_11$3),
                _cache[3] || (_cache[3] = createTextVNode("  Flash firmware "))
              ], 8, _hoisted_10$6)
            ]),
            progress.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_12$3, [
              _cache[5] || (_cache[5] = createBaseVNode("p", null, null, -1)),
              createVNode(_component_BsProgress, { progress: progress.value }, null, 8, ["progress"])
            ])) : createCommentVNode("", true)
          ], 32)
        ])
      ]);
    };
  }
};
const _hoisted_1$s = { class: "container" };
const _hoisted_2$o = { class: "row" };
const _hoisted_3$i = { class: "col" };
const _hoisted_4$f = { class: "badge bg-secondary" };
const _hoisted_5$b = { class: "badge bg-secondary" };
const _hoisted_6$b = { class: "badge bg-secondary" };
const _hoisted_7$a = { class: "row" };
const _hoisted_8$8 = { class: "col-md-12" };
const _hoisted_9$5 = ["disabled"];
const _hoisted_10$5 = ["hidden"];
const _hoisted_11$2 = ["disabled"];
const _hoisted_12$2 = ["hidden"];
const _hoisted_13$2 = { class: "row" };
const _hoisted_14$1 = { class: "col" };
const _sfc_main$F = {
  __name: "SupportView",
  setup(__props) {
    const logData = ref("");
    function fetchLog(file, callback) {
      var data = {
        command: "get",
        file
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var list = text.split("\n");
          list.forEach(function(item) {
            if (item.length) logData.value = item + "\n" + logData.value;
          });
          callback(true);
        } else {
          callback(false);
        }
      });
    }
    function removeLog(file, callback) {
      var data = {
        command: "del",
        file
      };
      config.sendFilesystemRequest(data, (success) => {
        callback(success);
      });
    }
    function viewLogs() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      fetchLog("/error2.log", () => {
        fetchLog("/error.log", () => {
          global$1.disabled = false;
        });
      });
    }
    function removeLogs() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      removeLog("/error2.log", () => {
        removeLog("/error.log", () => {
          global$1.messageSuccess = "Requested logs to be deleted";
          global$1.disabled = false;
        });
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$s, [
        _cache[7] || (_cache[7] = createStaticVNode('<p></p><p class="h3">Links and device logs</p><hr><div class="row"><p> If you need support, want to discuss the software or request any new features you can do that on github.com or homebrewtalk.com. </p></div><div class="row"><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://github.com/mp-se/gravitymon" target="_blank">Report issues on github.com</a></div><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://www.homebrewtalk.com/" target="_blank">Discuss on homebrewtalk.com</a></div><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://www.gravitymon.com/" target="_blank">Read docs on gravitymon.com</a></div></div><hr>', 6)),
        createBaseVNode("div", _hoisted_2$o, [
          createBaseVNode("div", _hoisted_3$i, [
            createBaseVNode("p", null, [
              _cache[0] || (_cache[0] = createTextVNode(" Platform: ")),
              createBaseVNode("span", _hoisted_4$f, toDisplayString(unref(global$1).platform), 1),
              _cache[1] || (_cache[1] = createTextVNode(" Firmware: ")),
              createBaseVNode("span", _hoisted_5$b, toDisplayString(unref(global$1).app_ver) + " (" + toDisplayString(unref(global$1).app_build) + ")", 1),
              _cache[2] || (_cache[2] = createTextVNode(" User interface: ")),
              createBaseVNode("span", _hoisted_6$b, toDisplayString(unref(global$1).uiVersion) + " (" + toDisplayString(unref(global$1).uiBuild) + ")", 1)
            ])
          ])
        ]),
        _cache[8] || (_cache[8] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", _hoisted_7$a, [
          createBaseVNode("div", _hoisted_8$8, [
            createBaseVNode("button", {
              onClick: viewLogs,
              type: "button",
              class: "btn btn-primary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_10$5),
              _cache[3] || (_cache[3] = createTextVNode("  View device logs"))
            ], 8, _hoisted_9$5),
            _cache[5] || (_cache[5] = createTextVNode("  ")),
            createBaseVNode("button", {
              onClick: removeLogs,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_12$2),
              _cache[4] || (_cache[4] = createTextVNode("  Erase device logs "))
            ], 8, _hoisted_11$2)
          ])
        ]),
        _cache[9] || (_cache[9] = createBaseVNode("div", { class: "row" }, [
          createBaseVNode("div", { class: "col" }, [
            createBaseVNode("p")
          ])
        ], -1)),
        createBaseVNode("div", _hoisted_13$2, [
          createBaseVNode("div", _hoisted_14$1, [
            createBaseVNode("pre", null, toDisplayString(logData.value), 1)
          ]),
          _cache[6] || (_cache[6] = createBaseVNode("div", { class: "form-text" }, "Starts with the latest log entry first.", -1))
        ])
      ]);
    };
  }
};
const _hoisted_1$r = { class: "container" };
const _hoisted_2$n = { class: "h3" };
const _hoisted_3$h = { class: "row gy-2" };
const _hoisted_4$e = { class: "col-md-12" };
const _hoisted_5$a = ["disabled"];
const _hoisted_6$a = ["disabled"];
const maxLines = 50;
const _sfc_main$E = {
  __name: "SerialView",
  setup(__props) {
    const socket = ref(null);
    const serial = ref("");
    function clear() {
      serial.value = "";
    }
    onUnmounted(() => {
      if (socket.value) socket.value.close();
      socket.value = null;
    });
    const isConnected = computed(() => {
      return socket.value === null ? false : true;
    });
    const connected = computed(() => {
      return socket.value === null ? "Not connected" : "Connected";
    });
    function connect() {
      serial.value = "Attempting to connect to websocket\n";
      var host = global$1.baseURL.replaceAll("http://", "ws://");
      socket.value = new WebSocket(host + "serialws");
      socket.value.onopen = function() {
        serial.value += "Websocket established\n";
      };
      socket.value.onmessage = function() {
        var list = serial.value.split("\n");
        while (list.length > maxLines) {
          list.shift();
        }
        serial.value = list.join("\n");
        serial.value += event.data;
      };
      socket.value.onclose = function() {
        serial.value += "Socket closed\n";
        socket.value = null;
      };
    }
    onMounted(() => {
      connect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$r, [
        _cache[2] || (_cache[2] = createBaseVNode("p", null, null, -1)),
        createBaseVNode("p", _hoisted_2$n, "Serial console (" + toDisplayString(connected.value) + ")", 1),
        _cache[3] || (_cache[3] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("pre", null, toDisplayString(serial.value), 1),
        createBaseVNode("div", _hoisted_3$h, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "col-md-12" }, [
            createBaseVNode("hr")
          ], -1)),
          createBaseVNode("div", _hoisted_4$e, [
            createBaseVNode("button", {
              onClick: clear,
              type: "button",
              class: "btn btn-primary w-2",
              disabled: !isConnected.value
            }, " Clear", 8, _hoisted_5$a),
            _cache[0] || (_cache[0] = createTextVNode("  ")),
            createBaseVNode("button", {
              onClick: connect,
              type: "button",
              class: "btn btn-secondary w-2",
              disabled: isConnected.value
            }, " Connect ", 8, _hoisted_6$a)
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$q = { class: "row gy-4" };
const _hoisted_2$m = { class: "col-md-3" };
const _hoisted_3$g = ["disabled"];
const _hoisted_4$d = ["hidden"];
const _hoisted_5$9 = { class: "col-md-6" };
const _hoisted_6$9 = { class: "button-group" };
const _hoisted_7$9 = ["onClick", "disabled"];
const _hoisted_8$7 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_9$4 = {
  key: 1,
  class: "col-md-12"
};
const _hoisted_10$4 = { class: "border p-2" };
const _sfc_main$D = {
  __name: "ListFilesFragment",
  setup(__props) {
    const filesystemUsage = ref(null);
    const filesystemUsageText = ref(null);
    const filesView = ref([]);
    const fileData = ref(null);
    const viewFile = (f) => {
      global$1.disabled = true;
      global$1.clearMessages();
      fileData.value = null;
      var data = {
        command: "get",
        file: f
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          if (isValidJson(text)) fileData.value = JSON.stringify(JSON.parse(text), null, 2);
          else if (isValidFormData(text)) fileData.value = text.replaceAll("&", "&\n\r");
          else if (isValidMqttData(text)) fileData.value = text.replaceAll("|", "|\n\r");
          else fileData.value = text;
        }
        global$1.disabled = false;
      });
    };
    const listFilesView = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesView.value = [];
      var data = {
        command: "dir"
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          filesystemUsage.value = json.used / json.total * 100;
          filesystemUsageText.value = "Total space " + json.total / 1024 + "kb, Free space " + json.free / 1024 + "kb, Used space " + json.used / 1024 + "kb";
          for (var f in json.files) {
            filesView.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    return (_ctx, _cache) => {
      const _component_BsProgress = resolveComponent("BsProgress");
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[5] || (_cache[5] = createBaseVNode("h5", null, "Explore the internal file system", -1)),
        createBaseVNode("div", _hoisted_1$q, [
          createBaseVNode("div", _hoisted_2$m, [
            createBaseVNode("button", {
              onClick: listFilesView,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_4$d),
              _cache[0] || (_cache[0] = createTextVNode("  List files"))
            ], 8, _hoisted_3$g),
            _cache[1] || (_cache[1] = createTextVNode("  "))
          ]),
          createBaseVNode("div", _hoisted_5$9, [
            createBaseVNode("div", _hoisted_6$9, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesView.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => viewFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_7$9),
                  _cache[2] || (_cache[2] = createTextVNode("  "))
                ], 64);
              }), 128))
            ])
          ])
        ]),
        filesystemUsage.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$7, [
          _cache[3] || (_cache[3] = createBaseVNode("h6", null, "File system usage", -1)),
          createVNode(_component_BsProgress, { progress: filesystemUsage.value }, null, 8, ["progress"]),
          createBaseVNode("p", null, toDisplayString(filesystemUsageText.value), 1)
        ])) : createCommentVNode("", true),
        fileData.value !== null ? (openBlock(), createElementBlock("div", _hoisted_9$4, [
          _cache[4] || (_cache[4] = createBaseVNode("h6", null, "File contents", -1)),
          createBaseVNode("pre", _hoisted_10$4, toDisplayString(fileData.value), 1)
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const _hoisted_1$p = { class: "row gy-4" };
const _hoisted_2$l = { class: "col-md-12" };
const _hoisted_3$f = { class: "col-md-3" };
const _hoisted_4$c = ["disabled"];
const _hoisted_5$8 = ["hidden"];
const _hoisted_6$8 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_7$8 = { class: "row gy-4" };
const _hoisted_8$6 = { class: "col-md-3" };
const _hoisted_9$3 = ["disabled"];
const _hoisted_10$3 = ["hidden"];
const _hoisted_11$1 = { class: "col-md-6" };
const _hoisted_12$1 = { class: "button-group" };
const _hoisted_13$1 = ["onClick", "disabled"];
const _sfc_main$C = {
  __name: "AdvancedFilesFragment",
  setup(__props) {
    const fileData = ref(null);
    const filesDelete = ref([]);
    const confirmDeleteMessage = ref(null);
    const confirmDeleteFile = ref(null);
    const confirmDeleteCallback = (result) => {
      if (result) {
        global$1.disabled = true;
        global$1.clearMessages();
        fileData.value = null;
        var data = {
          command: "del",
          file: confirmDeleteFile.value
        };
        config.sendFilesystemRequest(data, (success, text) => {
          filesDelete.value = [];
          global$1.disabled = false;
        });
      }
    };
    const deleteFile = (f) => {
      confirmDeleteMessage.value = "Do you really want to delete file " + f;
      confirmDeleteFile.value = f;
      document.getElementById("deleteFile").click();
    };
    const listFilesDelete = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesDelete.value = [];
      var data = {
        command: "dir"
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          for (var f in json.files) {
            filesDelete.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    const progress = ref(0);
    function upload() {
      const fileElement = document.getElementById("upload");
      function errorAction(e) {
        logError("AdancedFilesFragment.upload()", e.type);
        global$1.messageFailed = "File upload failed!";
        global$1.disabled = false;
      }
      if (fileElement.files.length === 0) {
        global$1.messageFailed = "You need to select one file with firmware to upload";
      } else {
        global$1.disabled = true;
        logDebug("AdancedFilesFragment.upload()", "Selected file: " + fileElement.files[0].name);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 4e4;
        progress.value = 0;
        xhr.onabort = function(e) {
          errorAction(e);
        };
        xhr.onerror = function(e) {
          errorAction(e);
        };
        xhr.ontimeout = function(e) {
          errorAction(e);
        };
        xhr.onloadstart = function() {
        };
        xhr.onloadend = function() {
          progress.value = 100;
          if (xhr.status == 200) {
            global$1.messageSuccess = "File upload completed!";
            global$1.messageFailed = "";
          }
          global$1.disabled = false;
          filesDelete.value = [];
        };
        xhr.upload.addEventListener(
          "progress",
          (e) => {
            progress.value = e.loaded / e.total * 100;
          },
          false
        );
        const fileData2 = new FormData();
        fileData2.onprogress = function(e) {
          logDebug(
            "AdancedFilesFragment.upload()",
            "progress2: " + e.loaded + "," + e.total + "," + xhr.status
          );
        };
        fileData2.append("file", fileElement.files[0]);
        xhr.open("POST", global$1.baseURL + "api/filesystem/upload");
        xhr.setRequestHeader("Authorization", global$1.token);
        xhr.send(fileData2);
      }
    }
    return (_ctx, _cache) => {
      const _component_BsFileUpload = resolveComponent("BsFileUpload");
      const _component_BsProgress = resolveComponent("BsProgress");
      const _component_BsModalConfirm = resolveComponent("BsModalConfirm");
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[4] || (_cache[4] = createBaseVNode("h5", null, "Upload files to internal file system", -1)),
        createBaseVNode("div", _hoisted_1$p, [
          createBaseVNode("form", {
            onSubmit: withModifiers(upload, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_2$l, [
              createVNode(_component_BsFileUpload, {
                name: "upload",
                id: "upload",
                label: "Select firmware file",
                accept: "",
                help: "Choose a file to upload to the file system",
                disabled: unref(global$1).disabled
              }, null, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_3$f, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-secondary",
                id: "upload-btn",
                value: "upload",
                "data-bs-toggle": "tooltip",
                title: "Update the device with the selected firmware",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_5$8),
                _cache[0] || (_cache[0] = createTextVNode("  Upload file "))
              ], 8, _hoisted_4$c)
            ]),
            progress.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_6$8, [
              _cache[1] || (_cache[1] = createTextVNode("   ")),
              createVNode(_component_BsProgress, { progress: progress.value }, null, 8, ["progress"])
            ])) : createCommentVNode("", true)
          ], 32)
        ]),
        _cache[5] || (_cache[5] = createBaseVNode("div", { class: "row gy-4" }, [
          createTextVNode("   "),
          createBaseVNode("hr")
        ], -1)),
        _cache[6] || (_cache[6] = createBaseVNode("h5", null, "Delete files from internal file system", -1)),
        createBaseVNode("div", _hoisted_7$8, [
          createBaseVNode("div", _hoisted_8$6, [
            createBaseVNode("button", {
              onClick: listFilesDelete,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_10$3),
              _cache[2] || (_cache[2] = createTextVNode("  List files "))
            ], 8, _hoisted_9$3)
          ]),
          createBaseVNode("div", _hoisted_11$1, [
            createBaseVNode("div", _hoisted_12$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesDelete.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => deleteFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_13$1),
                  _cache[3] || (_cache[3] = createTextVNode("  "))
                ], 64);
              }), 128))
            ])
          ]),
          createVNode(_component_BsModalConfirm, {
            callback: confirmDeleteCallback,
            message: confirmDeleteMessage.value,
            id: "deleteFile",
            title: "Delete file",
            disabled: unref(global$1).disabled
          }, null, 8, ["message", "disabled"])
        ])
      ], 64);
    };
  }
};
const _hoisted_1$o = { class: "row gy-4" };
const _hoisted_2$k = { class: "col-md-3" };
const _hoisted_3$e = ["disabled"];
const _hoisted_4$b = ["hidden"];
const _hoisted_5$7 = { class: "col-md-6" };
const _hoisted_6$7 = { class: "button-group" };
const _hoisted_7$7 = ["onClick", "disabled"];
const _sfc_main$B = {
  __name: "AdvancedSecureDiskFragment",
  setup(__props) {
    const fileData = ref(null);
    const filesDelete = ref([]);
    const confirmDeleteMessage = ref(null);
    const confirmDeleteFile = ref(null);
    const confirmDeleteCallback = (result) => {
      if (result) {
        global$1.disabled = true;
        global$1.clearMessages();
        fileData.value = null;
        var data = {
          command: "del",
          file: confirmDeleteFile.value
        };
        measurement.sendSecureDiskRequest(data, (success, text) => {
          filesDelete.value = [];
          global$1.disabled = false;
        });
      }
    };
    const deleteFile = (f) => {
      confirmDeleteMessage.value = "Do you really want to delete file " + f;
      confirmDeleteFile.value = f;
      document.getElementById("deleteSecureDiskFile").click();
    };
    const listFilesDelete = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesDelete.value = [];
      var data = {
        command: "dir"
      };
      measurement.sendSecureDiskRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          for (var f in json.files) {
            filesDelete.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    return (_ctx, _cache) => {
      const _component_BsModalConfirm = resolveComponent("BsModalConfirm");
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[2] || (_cache[2] = createBaseVNode("h5", null, "Delete files from SD file system", -1)),
        createBaseVNode("div", _hoisted_1$o, [
          createBaseVNode("div", _hoisted_2$k, [
            createBaseVNode("button", {
              onClick: listFilesDelete,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_4$b),
              _cache[0] || (_cache[0] = createTextVNode("  List files "))
            ], 8, _hoisted_3$e)
          ]),
          createBaseVNode("div", _hoisted_5$7, [
            createBaseVNode("div", _hoisted_6$7, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesDelete.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => deleteFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_7$7),
                  _cache[1] || (_cache[1] = createTextVNode("  "))
                ], 64);
              }), 128))
            ])
          ]),
          createVNode(_component_BsModalConfirm, {
            callback: confirmDeleteCallback,
            message: confirmDeleteMessage.value,
            id: "deleteSecureDiskFile",
            title: "Delete file",
            disabled: unref(global$1).disabled
          }, null, 8, ["message", "disabled"])
        ])
      ], 64);
    };
  }
};
const _hoisted_1$n = { class: "row gy-4" };
const _hoisted_2$j = { class: "col-md-3" };
const _hoisted_3$d = ["disabled"];
const _hoisted_4$a = ["hidden"];
const _hoisted_5$6 = { class: "col-md-6" };
const _hoisted_6$6 = { class: "button-group" };
const _hoisted_7$6 = ["onClick", "disabled"];
const _hoisted_8$5 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_9$2 = {
  key: 1,
  class: "col-md-12"
};
const _hoisted_10$2 = { class: "border p-2" };
const _sfc_main$A = {
  __name: "ListSecureDiskFragment",
  setup(__props) {
    const filesystemUsage = ref(null);
    const filesystemUsageText = ref(null);
    const filesView = ref([]);
    const fileData = ref(null);
    const viewFile = (f) => {
      global$1.disabled = true;
      global$1.clearMessages();
      fileData.value = null;
      measurement.fetchSecureDiskFile(f, (success, text) => {
        if (success) {
          if (isValidJson(text)) fileData.value = JSON.stringify(JSON.parse(text), null, 2);
          else if (isValidFormData(text)) fileData.value = text.replaceAll("&", "&\n\r");
          else if (isValidMqttData(text)) fileData.value = text.replaceAll("|", "|\n\r");
          else fileData.value = text;
        }
        global$1.disabled = false;
      });
    };
    const listFilesView = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesView.value = [];
      var data = {
        command: "dir"
      };
      measurement.sendSecureDiskRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          filesystemUsage.value = json.used / json.total * 100;
          filesystemUsageText.value = "Total space " + json.total / 1024 + "kb, Free space " + json.free / 1024 + "kb, Used space " + json.used / 1024 + "kb";
          for (var f in json.files) {
            filesView.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    return (_ctx, _cache) => {
      const _component_BsProgress = resolveComponent("BsProgress");
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[5] || (_cache[5] = createBaseVNode("h5", null, "Explore the SD file system", -1)),
        createBaseVNode("div", _hoisted_1$n, [
          createBaseVNode("div", _hoisted_2$j, [
            createBaseVNode("button", {
              onClick: listFilesView,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_4$a),
              _cache[0] || (_cache[0] = createTextVNode("  List SD files"))
            ], 8, _hoisted_3$d),
            _cache[1] || (_cache[1] = createTextVNode("  "))
          ]),
          createBaseVNode("div", _hoisted_5$6, [
            createBaseVNode("div", _hoisted_6$6, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesView.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => viewFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_7$6),
                  _cache[2] || (_cache[2] = createTextVNode("  "))
                ], 64);
              }), 128))
            ])
          ])
        ]),
        filesystemUsage.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$5, [
          _cache[3] || (_cache[3] = createBaseVNode("h6", null, "File system usage", -1)),
          createVNode(_component_BsProgress, { progress: filesystemUsage.value }, null, 8, ["progress"]),
          createBaseVNode("p", null, toDisplayString(filesystemUsageText.value), 1)
        ])) : createCommentVNode("", true),
        fileData.value !== null ? (openBlock(), createElementBlock("div", _hoisted_9$2, [
          _cache[4] || (_cache[4] = createBaseVNode("h6", null, "File contents", -1)),
          createBaseVNode("pre", _hoisted_10$2, toDisplayString(fileData.value), 1)
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const _hoisted_1$m = { class: "row gy-4" };
const _hoisted_2$i = { class: "col-md-3" };
const _hoisted_3$c = ["disabled"];
const _hoisted_4$9 = ["hidden"];
const _sfc_main$z = {
  __name: "EnableCorsFragment",
  setup(__props) {
    const enableCors = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      var data = {
        cors_allowed: true
      };
      fetch(global$1.baseURL + "api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        global$1.disabled = false;
        if (res.status != 200) {
          logError("EnableCorsFragment.enableCors()", "Sending /api/config failed", res.status);
          global$1.messageError = "Failed to enable CORS.";
        } else {
          logInfo("EnableCorsFragment.enableCors()", "Sending /api/config completed");
          global$1.messageSuccess = "CORS enabled in configuration, reboot to take effect.";
        }
        global$1.disabled = false;
      }).catch((err) => {
        logError("EnableCorsFragment.enableCors()", err);
        global$1.disabled = false;
      });
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[2] || (_cache[2] = createBaseVNode("h5", null, "Developer settings", -1)),
        createBaseVNode("div", _hoisted_1$m, [
          createBaseVNode("div", _hoisted_2$i, [
            createBaseVNode("button", {
              onClick: enableCors,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_4$9),
              _cache[0] || (_cache[0] = createTextVNode("  Enable CORS"))
            ], 8, _hoisted_3$c),
            _cache[1] || (_cache[1] = createTextVNode("  "))
          ])
        ])
      ], 64);
    };
  }
};
const _hoisted_1$l = { class: "container" };
const _hoisted_2$h = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_3$b = {
  key: 1,
  class: "row gy-4"
};
const _hoisted_4$8 = {
  key: 1,
  class: "row gy-4"
};
const _hoisted_5$5 = {
  key: 3,
  class: "row gy-4"
};
const _hoisted_6$5 = { class: "col-md-2" };
const _hoisted_7$5 = ["disabled"];
const _hoisted_8$4 = ["hidden"];
const _sfc_main$y = {
  __name: "ToolsView",
  setup(__props) {
    const hideAdvanced = ref(true);
    const fileSystem = ref(0);
    const fileSystemOptions = ref([
      { label: "Internal Flash", value: 0 },
      { label: "Secure Digital (SD)", value: 1 }
    ]);
    function enableAdvanced() {
      hideAdvanced.value = !hideAdvanced.value;
    }
    return (_ctx, _cache) => {
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      return openBlock(), createElementBlock("div", _hoisted_1$l, [
        _cache[7] || (_cache[7] = createBaseVNode("p", null, null, -1)),
        _cache[8] || (_cache[8] = createBaseVNode("p", { class: "h3" }, "Tools", -1)),
        unref(status).sd_mounted ? (openBlock(), createElementBlock("div", _hoisted_2$h, [
          createVNode(_component_BsInputRadio, {
            modelValue: fileSystem.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => fileSystem.value = $event),
            options: fileSystemOptions.value,
            label: "Select File System",
            width: ""
          }, null, 8, ["modelValue", "options"])
        ])) : createCommentVNode("", true),
        _cache[9] || (_cache[9] = createBaseVNode("hr", null, null, -1)),
        fileSystem.value == 0 ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createVNode(_sfc_main$D),
          _cache[3] || (_cache[3] = createBaseVNode("div", { class: "row gy-4" }, [
            createTextVNode("   "),
            createBaseVNode("hr")
          ], -1)),
          !hideAdvanced.value ? (openBlock(), createBlock(_sfc_main$C, { key: 0 })) : createCommentVNode("", true),
          !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_3$b, _cache[2] || (_cache[2] = [
            createTextVNode("   "),
            createBaseVNode("hr", null, null, -1)
          ]))) : createCommentVNode("", true)
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createVNode(_sfc_main$A),
          _cache[5] || (_cache[5] = createBaseVNode("div", { class: "row gy-4" }, [
            createTextVNode("   "),
            createBaseVNode("hr")
          ], -1)),
          !hideAdvanced.value ? (openBlock(), createBlock(_sfc_main$B, { key: 0 })) : createCommentVNode("", true),
          !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_4$8, _cache[4] || (_cache[4] = [
            createTextVNode("   "),
            createBaseVNode("hr", null, null, -1)
          ]))) : createCommentVNode("", true)
        ], 64)),
        hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_5$5, [
          createBaseVNode("div", _hoisted_6$5, [
            createBaseVNode("button", {
              onClick: _cache[1] || (_cache[1] = ($event) => enableAdvanced()),
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_8$4),
              _cache[6] || (_cache[6] = createTextVNode("  Enable Advanced "))
            ], 8, _hoisted_7$5)
          ])
        ])) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createBlock(_sfc_main$z, { key: 4 })) : createCommentVNode("", true)
      ]);
    };
  }
};
const _sfc_main$x = {};
const _hoisted_1$k = { class: "fw-bold" };
function _sfc_render(_ctx, _cache) {
  const _component_BsMessage = resolveComponent("BsMessage");
  return openBlock(), createBlock(_component_BsMessage, {
    dismissable: false,
    alert: "danger"
  }, {
    default: withCtx(() => [
      _cache[0] || (_cache[0] = createTextVNode(" Page not found! ")),
      createBaseVNode("span", _hoisted_1$k, toDisplayString(this.$route.path), 1),
      _cache[1] || (_cache[1] = createTextVNode(" is not a valid URL for this application! "))
    ]),
    _: 1
  });
}
const NotFoundView = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render]]);
const _hoisted_1$j = {
  class: "btn-group",
  role: "group"
};
const _hoisted_2$g = ["value", "name", "id", "disabled"];
const _hoisted_3$a = ["for"];
const _sfc_main$w = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputRadio",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:options", "update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const options = useModel(__props, "options");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$j, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
              return openBlock(), createElementBlock(Fragment, {
                key: o.value
              }, [
                withDirectives(createBaseVNode("input", {
                  type: "radio",
                  class: "btn-check",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
                  value: o.value,
                  name: "radio" + _ctx.$.uid,
                  id: "radio" + _ctx.$.uid + o.value,
                  disabled: disabled.value
                }, null, 8, _hoisted_2$g), [
                  [vModelRadio, model.value]
                ]),
                createBaseVNode("label", {
                  class: "btn btn-outline-primary",
                  for: "radio" + _ctx.$.uid + o.value
                }, toDisplayString(o.label), 9, _hoisted_3$a)
              ], 64);
            }), 128))
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$i = { class: "table-responsive shadow-sm" };
const _hoisted_2$f = { class: "table table-sm table-bordered table-hover" };
const _hoisted_3$9 = { class: "table-primary sticky-top" };
const _hoisted_4$7 = { class: "table-group-divider" };
const _hoisted_5$4 = { class: "text-center text-muted fw-light" };
const _hoisted_6$4 = { class: "text-nowrap small" };
const _hoisted_7$4 = {
  key: 0,
  class: "text-center py-4 text-muted"
};
const _sfc_main$v = {
  __name: "MeasurementTableFragment",
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(__props) {
    const formatCellValue = (entry, column) => {
      const value = entry[column.method]();
      if (column.format === "temperature") {
        return `${value}°C`;
      } else if (column.format === "voltage") {
        return `${value}V`;
      } else if (column.format === "seconds") {
        return `${value}s`;
      } else if (column.format === "boolean") {
        return value ? "Yes" : "No";
      }
      return value;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$i, [
        createBaseVNode("table", _hoisted_2$f, [
          createBaseVNode("thead", _hoisted_3$9, [
            createBaseVNode("tr", null, [
              _cache[0] || (_cache[0] = createBaseVNode("th", {
                scope: "col",
                class: "text-center"
              }, "#", -1)),
              _cache[1] || (_cache[1] = createBaseVNode("th", {
                scope: "col",
                class: "text-nowrap"
              }, "Created", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.columns, (column) => {
                return openBlock(), createElementBlock("th", {
                  key: column.key,
                  scope: "col",
                  class: "text-nowrap"
                }, toDisplayString(column.label), 1);
              }), 128))
            ])
          ]),
          createBaseVNode("tbody", _hoisted_4$7, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.data, (entry, idx) => {
              return openBlock(), createElementBlock("tr", {
                key: idx,
                class: "align-middle"
              }, [
                createBaseVNode("td", _hoisted_5$4, toDisplayString(idx + 1), 1),
                createBaseVNode("td", _hoisted_6$4, toDisplayString(entry.getCreated() instanceof Date ? `${entry.getCreated().getFullYear()}-${String(entry.getCreated().getMonth() + 1).padStart(2, "0")}-${String(entry.getCreated().getDate()).padStart(2, "0")} ${String(entry.getCreated().getHours()).padStart(2, "0")}:${String(entry.getCreated().getMinutes()).padStart(2, "0")}` : entry.getCreated()), 1),
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.columns, (column) => {
                  return openBlock(), createElementBlock("td", {
                    key: column.key,
                    class: "text-nowrap"
                  }, toDisplayString(formatCellValue(entry, column)), 1);
                }), 128))
              ]);
            }), 128))
          ])
        ]),
        __props.data.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7$4, _cache[2] || (_cache[2] = [
          createBaseVNode("p", { class: "mb-0" }, "No measurement data available", -1)
        ]))) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$h = { class: "container" };
const _hoisted_2$e = {
  key: 0,
  class: "row"
};
const _hoisted_3$8 = {
  key: 1,
  class: "row"
};
const _hoisted_4$6 = { class: "col-md-12" };
const _hoisted_5$3 = { class: "col-md-12" };
const _hoisted_6$3 = { class: "col-md-12" };
const _hoisted_7$3 = { class: "col-md-12" };
const _hoisted_8$3 = { class: "col-md-12" };
const _sfc_main$u = {
  __name: "MeasurementView",
  setup(__props) {
    const deviceType = ref(-1);
    const deviceTypeOptions = ref([
      //  { label: 'Text', value: 0 },
    ]);
    const gravitymonDevice = ref("");
    const tiltDevice = ref("");
    const pressuremonDevice = ref("");
    const chamberControllerDevice = ref("");
    const gravitymonDeviceOptions = ref([]);
    const tiltDeviceOptions = ref([]);
    const pressuremonDeviceOptions = ref([]);
    const chamberControllerDeviceOptions = ref([]);
    const gravitymonColumns = ref([
      { key: "id", label: "ID", method: "getId" },
      { key: "name", label: "Name", method: "getName" },
      { key: "token", label: "Token", method: "getToken" },
      { key: "temp", label: "Temp", method: "getTempC", format: "temperature" },
      { key: "gravity", label: "Gravity", method: "getGravity" },
      { key: "angle", label: "Angle", method: "getAngle" },
      { key: "battery", label: "Battery", method: "getBattery", format: "voltage" },
      { key: "txPower", label: "Tx Power", method: "getTxPower" },
      { key: "rssi", label: "RSSI", method: "getRssi" },
      { key: "interval", label: "Interval", method: "getInterval", format: "seconds" }
    ]);
    const tiltColumns = ref([
      // { key: 'id', label: 'ID', method: 'getId' },
      { key: "color", label: "Color", method: "getColor" },
      { key: "temp", label: "Temp", method: "getTempC", format: "temperature" },
      { key: "gravity", label: "Gravity", method: "getGravity" },
      { key: "txPower", label: "Tx Power", method: "getTxPower" },
      { key: "rssi", label: "RSSI", method: "getRssi" },
      { key: "isPro", label: "Is Pro", method: "getIsPro", format: "boolean" }
    ]);
    const pressuremonColumns = ref([
      { key: "id", label: "ID", method: "getId" },
      { key: "name", label: "Name", method: "getName" },
      { key: "token", label: "Token", method: "getToken" },
      { key: "temp", label: "Temp", method: "getTempC", format: "temperature" },
      { key: "pressure", label: "Pressure", method: "getPressure" },
      { key: "pressure1", label: "Pressure1", method: "getPressure1" },
      { key: "battery", label: "Battery", method: "getBattery", format: "voltage" },
      { key: "txPower", label: "Tx Power", method: "getTxPower" },
      { key: "rssi", label: "RSSI", method: "getRssi" },
      { key: "interval", label: "Interval", method: "getInterval", format: "seconds" }
    ]);
    const chamberControllerColumns = ref([
      { key: "id", label: "ID", method: "getId" },
      { key: "chamberTemp", label: "Chamber Temp", method: "getChamberTempC", format: "temperature" },
      { key: "beerTemp", label: "Beer Temp", method: "getBeerTempC", format: "temperature" },
      { key: "rssi", label: "RSSI", method: "getRssi" }
    ]);
    onBeforeMount(() => {
      measurement.updateMeasurementFiles((success) => {
        if (success) {
          measurement.fetchAllMeasurementFiles(() => {
            if (measurement.gravitymonData.length > 0) {
              deviceTypeOptions.value.push({ label: "Gravitymon", value: 0 });
              const seenIds = /* @__PURE__ */ new Set();
              gravitymonDeviceOptions.value = measurement.gravitymonData.filter((entry) => {
                if (seenIds.has(entry.getId())) return false;
                seenIds.add(entry.getId());
                return true;
              }).map((entry) => ({
                label: entry.getId() + " - " + entry.getName(),
                value: entry.getId()
              }));
              gravitymonDeviceOptions.value.push({ label: "All devices", value: "" });
            }
            if (measurement.tiltData.length > 0) {
              deviceTypeOptions.value.push({ label: "Tilt", value: 1 });
              const seenTiltIds = /* @__PURE__ */ new Set();
              tiltDeviceOptions.value = measurement.tiltData.filter((entry) => {
                if (seenTiltIds.has(entry.getId())) return false;
                seenTiltIds.add(entry.getId());
                return true;
              }).map((entry) => ({
                label: entry.getId() + " - " + entry.getColor(),
                value: entry.getId()
              }));
              tiltDeviceOptions.value.push({ label: "All devices", value: "" });
            }
            if (measurement.pressuremonData.length > 0) {
              deviceTypeOptions.value.push({ label: "Pressuremon", value: 2 });
              const seenPressureIds = /* @__PURE__ */ new Set();
              pressuremonDeviceOptions.value = measurement.pressuremonData.filter((entry) => {
                if (seenPressureIds.has(entry.getId())) return false;
                seenPressureIds.add(entry.getId());
                return true;
              }).map((entry) => ({
                label: entry.getId() + " - " + entry.getName(),
                value: entry.getId()
              }));
              pressuremonDeviceOptions.value.push({ label: "All devices", value: "" });
            }
            if (measurement.chamberControllerData.length > 0) {
              deviceTypeOptions.value.push({ label: "Chamber Controller", value: 3 });
              const seenChamberIds = /* @__PURE__ */ new Set();
              chamberControllerDeviceOptions.value = measurement.chamberControllerData.filter((entry) => {
                if (seenChamberIds.has(entry.getId())) return false;
                seenChamberIds.add(entry.getId());
                return true;
              }).map((entry) => ({
                // label: entry.getId() + ' - ' + entry.getName(),
                label: entry.getId(),
                value: entry.getId()
              }));
              chamberControllerDeviceOptions.value.push({ label: "All devices", value: "" });
            }
          });
        } else {
          global$1.errorMessage = "Failed to fetch list of measurement files";
        }
      });
    });
    onBeforeUnmount(() => {
    });
    watch(deviceType, (newValue) => {
    });
    const filteredGravitymonData = computed(() => {
      if (!gravitymonDevice.value) return measurement.gravitymonData;
      return measurement.gravitymonData.filter((entry) => entry.getId() === gravitymonDevice.value);
    });
    const filteredTiltData = computed(() => {
      if (!tiltDevice.value) return measurement.tiltData;
      return measurement.tiltData.filter((entry) => entry.getId() === tiltDevice.value);
    });
    const filteredPressuremonData = computed(() => {
      if (!pressuremonDevice.value) return measurement.pressuremonData;
      return measurement.pressuremonData.filter((entry) => entry.getId() === pressuremonDevice.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$h, [
        _cache[11] || (_cache[11] = createBaseVNode("p", null, null, -1)),
        _cache[12] || (_cache[12] = createBaseVNode("p", { class: "h3" }, "Measurements", -1)),
        _cache[13] || (_cache[13] = createBaseVNode("hr", null, null, -1)),
        !unref(status).sd_mounted ? (openBlock(), createElementBlock("div", _hoisted_2$e, _cache[5] || (_cache[5] = [
          createBaseVNode("p", null, "No SD card attached so this feature is not available.", -1)
        ]))) : createCommentVNode("", true),
        unref(status).sd_mounted ? (openBlock(), createElementBlock("div", _hoisted_3$8, [
          createBaseVNode("div", _hoisted_4$6, [
            createVNode(_sfc_main$w, {
              modelValue: deviceType.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => deviceType.value = $event),
              options: deviceTypeOptions.value,
              label: "Device Type",
              width: ""
            }, null, 8, ["modelValue", "options"])
          ]),
          _cache[10] || (_cache[10] = createBaseVNode("div", { class: "col-md-12" }, " ", -1)),
          deviceType.value === 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createBaseVNode("div", _hoisted_5$3, [
              createVNode(_sfc_main$Q, {
                modelValue: gravitymonDevice.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => gravitymonDevice.value = $event),
                options: gravitymonDeviceOptions.value,
                label: "Device",
                width: "5"
              }, null, 8, ["modelValue", "options"])
            ]),
            _cache[6] || (_cache[6] = createBaseVNode("div", { class: "col-md-12" }, " ", -1)),
            createVNode(_sfc_main$v, {
              data: filteredGravitymonData.value,
              columns: gravitymonColumns.value
            }, null, 8, ["data", "columns"])
          ], 64)) : createCommentVNode("", true),
          deviceType.value === 1 ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createBaseVNode("div", _hoisted_6$3, [
              createVNode(_sfc_main$Q, {
                modelValue: tiltDevice.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => tiltDevice.value = $event),
                options: tiltDeviceOptions.value,
                label: "Device",
                width: "5"
              }, null, 8, ["modelValue", "options"])
            ]),
            _cache[7] || (_cache[7] = createBaseVNode("div", { class: "col-md-12" }, " ", -1)),
            createVNode(_sfc_main$v, {
              data: filteredTiltData.value,
              columns: tiltColumns.value
            }, null, 8, ["data", "columns"])
          ], 64)) : createCommentVNode("", true),
          deviceType.value === 2 ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createBaseVNode("div", _hoisted_7$3, [
              createVNode(_sfc_main$Q, {
                modelValue: pressuremonDevice.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => pressuremonDevice.value = $event),
                options: pressuremonDeviceOptions.value,
                label: "Device",
                width: "5"
              }, null, 8, ["modelValue", "options"])
            ]),
            _cache[8] || (_cache[8] = createBaseVNode("div", { class: "col-md-12" }, " ", -1)),
            createVNode(_sfc_main$v, {
              data: filteredPressuremonData.value,
              columns: pressuremonColumns.value
            }, null, 8, ["data", "columns"])
          ], 64)) : createCommentVNode("", true),
          deviceType.value === 3 ? (openBlock(), createElementBlock(Fragment, { key: 3 }, [
            createBaseVNode("div", _hoisted_8$3, [
              createVNode(_sfc_main$Q, {
                modelValue: chamberControllerDevice.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => chamberControllerDevice.value = $event),
                options: chamberControllerDeviceOptions.value,
                label: "Device",
                width: "5"
              }, null, 8, ["modelValue", "options"])
            ]),
            _cache[9] || (_cache[9] = createBaseVNode("div", { class: "col-md-12" }, " ", -1)),
            createVNode(_sfc_main$v, {
              data: unref(measurement).chamberControllerData,
              columns: chamberControllerColumns.value
            }, null, 8, ["data", "columns"])
          ], 64)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const routes = [
  {
    path: "/",
    name: "home",
    component: _sfc_main$T
  },
  {
    path: "/device/settings",
    name: "device-settings",
    component: _sfc_main$S
  },
  {
    path: "/device/hardware",
    name: "device-hardware",
    component: _sfc_main$P
  },
  {
    path: "/device/wifi",
    name: "device-wifi",
    component: _sfc_main$O
  },
  {
    path: "/data",
    name: "measurement",
    component: _sfc_main$u
  },
  {
    path: "/other/firmware",
    name: "firmware",
    component: _sfc_main$G
  },
  {
    path: "/push/settings",
    name: "push-settings",
    component: _sfc_main$N
  },
  {
    path: "/push/http-post1",
    name: "push-http-post1",
    component: _sfc_main$M
  },
  {
    path: "/push/http-post2",
    name: "push-http-post2",
    component: _sfc_main$L
  },
  {
    path: "/push/http-get",
    name: "push-http-get",
    component: _sfc_main$K
  },
  {
    path: "/push/influxdb",
    name: "push-influxdb",
    component: _sfc_main$J
  },
  {
    path: "/push/mqtt",
    name: "push-Mqtt",
    component: _sfc_main$I
  },
  {
    path: "/other/support",
    name: "support",
    component: _sfc_main$F
  },
  {
    path: "/other/tools",
    name: "tools",
    component: _sfc_main$y
  },
  {
    path: "/other/serial",
    name: "serial",
    component: _sfc_main$E
  },
  {
    path: "/other/about",
    name: "about",
    component: AboutView
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: NotFoundView
  }
];
const router = createRouter({
  history: createWebHistory("/"),
  routes
});
router.beforeEach(() => {
  if (global$1.disabled) return false;
  if (!validateCurrentForm()) return false;
  global$1.clearMessages();
  return true;
});
const items = ref([
  {
    label: "Home",
    icon: "IconHome",
    path: "/",
    subs: []
  },
  {
    label: "Device",
    icon: "IconCpu",
    path: "/device",
    badge: deviceBadge,
    subs: [
      {
        label: "Settings",
        badge: deviceSettingBadge,
        path: "/device/settings"
      },
      {
        label: "Hardware",
        badge: deviceHardwareBadge,
        path: "/device/hardware"
      },
      {
        label: "Wifi",
        badge: deviceWifiBadge,
        path: "/device/wifi"
      }
    ]
  },
  {
    label: "Measurements",
    icon: "IconData",
    path: "/data",
    subs: []
  },
  {
    label: "Push targets",
    icon: "IconCloudUpArrow",
    path: "/push",
    badge: pushBadge,
    subs: [
      {
        label: "Settings",
        badge: pushSettingBadge,
        path: "/push/settings"
      },
      {
        label: "HTTP Post",
        badge: pushHttpPost1Badge,
        path: "/push/http-post1"
      },
      {
        label: "HTTP Post 2",
        badge: pushHttpPost2Badge,
        path: "/push/http-post2"
      },
      {
        label: "HTTP Get",
        badge: pushHttpGetBadge,
        path: "/push/http-get"
      },
      {
        label: "Influxdb v2",
        badge: pushHttpInfluxdb2Badge,
        path: "/push/influxdb"
      },
      {
        label: "MQTT",
        badge: pushHttpMqttBadge,
        path: "/push/mqtt"
      }
    ]
  },
  {
    label: "Other",
    icon: "IconTools",
    path: "/other",
    subs: [
      {
        label: "Serial console",
        path: "/other/serial"
      },
      {
        label: "Firmware update",
        path: "/other/firmware"
      },
      {
        label: "Support",
        path: "/other/support"
      },
      {
        label: "Tools",
        path: "/other/tools"
      },
      {
        label: "About",
        path: "/other/about"
      }
    ]
  }
]);
const _hoisted_1$g = { class: "navbar navbar-expand-lg navbar-dark bg-primary" };
const _hoisted_2$d = { class: "container-fluid align-center" };
const _hoisted_3$7 = { class: "navbar-brand" };
const _hoisted_4$5 = {
  class: "collapse navbar-collapse",
  id: "navbar"
};
const _hoisted_5$2 = { class: "navbar-nav" };
const _hoisted_6$2 = {
  key: 0,
  class: "nav-item"
};
const _hoisted_7$2 = {
  key: 1,
  class: "nav-item dropdown"
};
const _hoisted_8$2 = ["id", "disabled"];
const _hoisted_9$1 = {
  key: 1,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_10$1 = ["aria-labelledby"];
const _hoisted_11 = {
  key: 0,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_12 = { class: "text-white" };
const _hoisted_13 = { key: 0 };
const _hoisted_14 = {
  key: 1,
  class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white"
};
const _hoisted_15 = { class: "p-2" };
const _hoisted_16 = ["hidden"];
const _hoisted_17 = { class: "p-2" };
const _hoisted_18 = { class: "form-check form-switch" };
const _sfc_main$t = {
  __name: "BsMenuBar",
  props: {
    "disabled": {},
    "disabledModifiers": {},
    "brand": {},
    "brandModifiers": {}
  },
  emits: ["update:disabled", "update:brand"],
  setup(__props) {
    const disabled = useModel(__props, "disabled");
    const brand = useModel(__props, "brand");
    const { dark_mode } = storeToRefs(config);
    onMounted(() => {
      setMode();
    });
    watch(dark_mode, () => {
      setMode();
    });
    function setMode() {
      if (config.dark_mode) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
    }
    const subMenuClicked = () => {
      const dnList = document.getElementsByClassName("dropdown-menu show");
      for (var i = 0; i < dnList.length; i++) {
        dnList[i].classList.remove("show");
      }
    };
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("nav", _hoisted_1$g, [
        createBaseVNode("div", _hoisted_2$d, [
          _cache[5] || (_cache[5] = createBaseVNode("button", {
            class: "navbar-toggler",
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": "#navbar",
            "aria-controls": "navbarNav",
            "aria-expanded": "false",
            "aria-label": "Toggle navigation"
          }, [
            createBaseVNode("span", { class: "navbar-toggler-icon" })
          ], -1)),
          createBaseVNode("div", _hoisted_3$7, toDisplayString(brand.value), 1),
          _cache[6] || (_cache[6] = createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1)),
          createBaseVNode("div", _hoisted_4$5, [
            createBaseVNode("ul", _hoisted_5$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(items), (item, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  !item.subs.length ? (openBlock(), createElementBlock("li", _hoisted_6$2, [
                    createVNode(_component_router_link, {
                      class: normalizeClass([
                        "nav-link",
                        _ctx.$router.currentRoute.value.path.split("/")[1] === item.path.split("/")[1] ? " active fw-bold" : ""
                      ]),
                      to: item.path,
                      disabled: disabled.value
                    }, {
                      default: withCtx(() => [
                        item.icon !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                          key: 0,
                          width: "1rem",
                          height: "1rem",
                          style: { "color": "white" }
                        })) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(item.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["class", "to", "disabled"])
                  ])) : (openBlock(), createElementBlock("li", _hoisted_7$2, [
                    createBaseVNode("a", {
                      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.menuClicked && _ctx.menuClicked(...args)),
                      class: normalizeClass([
                        "nav-link",
                        "dropdown-toggle",
                        _ctx.$router.currentRoute.value.path.split("/")[1] === item.path.split("/")[1] ? " active fw-bold" : ""
                      ]),
                      id: "navbarDropdown" + item.label,
                      role: "button",
                      "data-bs-toggle": "dropdown",
                      "aria-expanded": "false",
                      "data-bs-auto-close": "true",
                      disabled: disabled.value
                    }, [
                      item.icon !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                        key: 0,
                        width: "1rem",
                        height: "1rem",
                        style: { "color": "white" }
                      })) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(item.label) + " ", 1),
                      item.badge !== void 0 && item.badge() > 0 ? (openBlock(), createElementBlock("span", _hoisted_9$1, toDisplayString(item.badge()), 1)) : createCommentVNode("", true)
                    ], 10, _hoisted_8$2),
                    createBaseVNode("ul", {
                      class: "dropdown-menu",
                      "aria-labelledby": "navbarDropdown" + item.label
                    }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(item.subs, (dn) => {
                        return openBlock(), createElementBlock("li", {
                          key: dn.path
                        }, [
                          createVNode(_component_router_link, {
                            onClick: subMenuClicked,
                            class: "dropdown-item",
                            to: dn.path,
                            disabled: disabled.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(dn.label) + " ", 1),
                              dn.badge !== void 0 && dn.badge() > 0 ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(dn.badge()), 1)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1032, ["to", "disabled"])
                        ]);
                      }), 128))
                    ], 8, _hoisted_10$1)
                  ]))
                ], 64);
              }), 128))
            ])
          ]),
          _cache[7] || (_cache[7] = createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1)),
          createBaseVNode("div", _hoisted_12, toDisplayString(unref(config).mdns), 1),
          _cache[8] || (_cache[8] = createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1)),
          unref(global$1).configChanged ? (openBlock(), createElementBlock("div", _hoisted_13, _cache[2] || (_cache[2] = [
            createBaseVNode("span", { class: "badge bg-danger fs-6" }, "Save needed  ", -1)
          ]))) : createCommentVNode("", true),
          unref(global$1).configChanged ? (openBlock(), createElementBlock("div", _hoisted_14)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", {
              class: "spinner-border gx-4",
              role: "status",
              style: { "color": "white" },
              hidden: !disabled.value
            }, _cache[3] || (_cache[3] = [
              createBaseVNode("span", { class: "visually-hidden" }, "Loading...", -1)
            ]), 8, _hoisted_16)
          ]),
          createBaseVNode("div", _hoisted_17, [
            createBaseVNode("div", _hoisted_18, [
              _cache[4] || (_cache[4] = createTextVNode("  ")),
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).dark_mode = $event),
                class: "form-check-input",
                type: "checkbox",
                role: "switch",
                style: { "border-color": "white" }
              }, null, 512), [
                [vModelCheckbox, unref(config).dark_mode]
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$f = { class: "container-fluid" };
const _hoisted_2$c = {
  class: "text-light text-center rounded-pill bg-primary",
  style: { "height": "30px" }
};
const _sfc_main$s = {
  __name: "BsFooter",
  props: {
    "text": {},
    "textModifiers": {}
  },
  emits: ["update:text"],
  setup(__props) {
    const text = useModel(__props, "text");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { style: { "height": "20px" } }, null, -1)),
        createBaseVNode("div", _hoisted_2$c, toDisplayString(text.value), 1)
      ]);
    };
  }
};
const _hoisted_1$e = {
  key: 0,
  class: "container text-center"
};
const _hoisted_2$b = { class: "container" };
const _sfc_main$r = {
  __name: "App",
  setup(__props) {
    const { disabled } = storeToRefs(global$1);
    const close = (alert) => {
      if (alert == "danger") global$1.messageError = "";
      else if (alert == "warning") global$1.messageWarning = "";
      else if (alert == "success") global$1.messageSuccess = "";
      else if (alert == "info") global$1.messageInfo = "";
    };
    watch(disabled, () => {
      if (global$1.disabled) document.body.style.cursor = "wait";
      else document.body.style.cursor = "default";
    });
    onMounted(() => {
      if (!global$1.initialized) {
        showSpinner();
        status.auth((success, data) => {
          if (success) {
            global$1.id = data.token;
            global$1.load((success2) => {
              if (success2) {
                status.load((success3) => {
                  if (success3) {
                    config.load((success4) => {
                      if (success4) {
                        config.loadFormat((success5) => {
                          if (success5) {
                            saveConfigState();
                            global$1.initialized = true;
                          } else {
                            global$1.messageError = "Failed to load format templates from device, please try to reload page!";
                          }
                          hideSpinner();
                        });
                      } else {
                        global$1.messageError = "Failed to load configuration data from device, please try to reload page!";
                        hideSpinner();
                      }
                    });
                  } else {
                    global$1.messageError = "Failed to load status from device, please try to reload page!";
                    hideSpinner();
                  }
                });
              } else {
                global$1.messageError = "Failed to load feature flags from device, please try to reload page!";
              }
            });
          } else {
            global$1.messageError = "Failed to authenticate with device, please try to reload page!";
            hideSpinner();
          }
        });
      }
    });
    function showSpinner() {
      document.querySelector("#spinner").showModal();
    }
    function hideSpinner() {
      document.querySelector("#spinner").close();
    }
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[5] || (_cache[5] = createBaseVNode("dialog", {
          id: "spinner",
          class: "loading"
        }, [
          createBaseVNode("div", { class: "container text-center" }, [
            createBaseVNode("div", {
              class: "row align-items-center",
              style: { "height": "170px" }
            }, [
              createBaseVNode("div", { class: "col" }, [
                createBaseVNode("div", {
                  class: "spinner-border",
                  role: "status",
                  style: { "width": "5rem", "height": "5rem" }
                }, [
                  createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
                ])
              ])
            ])
          ])
        ], -1)),
        !unref(global$1).initialized ? (openBlock(), createElementBlock("div", _hoisted_1$e, [
          createVNode(_component_BsMessage, {
            message: "Initalizing GravityMon Gateway Web interface",
            class: "h2",
            dismissable: false,
            alert: "info"
          })
        ])) : createCommentVNode("", true),
        unref(global$1).initialized ? (openBlock(), createBlock(_sfc_main$t, {
          key: 1,
          disabled: unref(global$1).disabled,
          brand: "Gateway"
        }, null, 8, ["disabled"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_2$b, [
          _cache[4] || (_cache[4] = createBaseVNode("div", null, [
            createBaseVNode("p")
          ], -1)),
          unref(global$1).isError ? (openBlock(), createBlock(_component_BsMessage, {
            key: 0,
            close,
            dismissable: true,
            message: unref(global$1).messageError,
            alert: "danger"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isWarning ? (openBlock(), createBlock(_component_BsMessage, {
            key: 1,
            close,
            dismissable: true,
            message: unref(global$1).messageWarning,
            alert: "warning"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isSuccess ? (openBlock(), createBlock(_component_BsMessage, {
            key: 2,
            close,
            dismissable: true,
            message: unref(global$1).messageSuccess,
            alert: "success"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isInfo ? (openBlock(), createBlock(_component_BsMessage, {
            key: 3,
            close,
            dismissable: true,
            message: unref(global$1).messageInfo,
            alert: "info"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(status).wifi_setup && unref(global$1).initialized ? (openBlock(), createBlock(_component_BsMessage, {
            key: 4,
            dismissable: false,
            alert: "info"
          }, {
            default: withCtx(() => [
              _cache[1] || (_cache[1] = createTextVNode(" Running in WIFI setup mode. Go to the ")),
              createVNode(_component_router_link, {
                class: "alert-link",
                to: "/device/wifi"
              }, {
                default: withCtx(() => _cache[0] || (_cache[0] = [
                  createTextVNode("wifi settings")
                ])),
                _: 1
              }),
              _cache[2] || (_cache[2] = createTextVNode(" meny and select wifi. Restart device after settings are selected. "))
            ]),
            _: 1
          })) : createCommentVNode("", true),
          !unref(config).ble_active_scan && unref(global$1).initialized ? (openBlock(), createBlock(_component_BsMessage, {
            key: 5,
            dismissable: true,
            alert: "warning"
          }, {
            default: withCtx(() => _cache[3] || (_cache[3] = [
              createTextVNode(" Running BLE scanner in Passive mode will not detect Eddy Stone Beacons. ")
            ])),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        unref(global$1).initialized ? (openBlock(), createBlock(_component_router_view, { key: 2 })) : createCommentVNode("", true),
        unref(global$1).initialized ? (openBlock(), createBlock(_sfc_main$s, {
          key: 3,
          text: "(c) 2024-2025 Magnus Persson"
        })) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const _sfc_main$q = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconXCircle",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1),
        createBaseVNode("path", { d: "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$p = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconCheckCircle",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1),
        createBaseVNode("path", { d: "m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$o = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconInfoCircle",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1),
        createBaseVNode("path", { d: "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$n = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconExclamationTriangle",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" }, null, -1),
        createBaseVNode("path", { d: "M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" }, null, -1)
      ]), 16);
    };
  }
});
const _hoisted_1$d = {
  key: 5,
  type: "button",
  class: "btn-close",
  "data-bs-dismiss": "alert",
  "aria-label": "Close"
};
const _sfc_main$m = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsMessage",
  props: {
    "message": {},
    "messageModifiers": {},
    "dismissable": {},
    "dismissableModifiers": {},
    "alert": {},
    "alertModifiers": {},
    "close": {},
    "closeModifiers": {}
  },
  emits: ["update:message", "update:dismissable", "update:alert", "update:close"],
  setup(__props) {
    const message = useModel(__props, "message");
    const dismissable = useModel(__props, "dismissable");
    const alert = useModel(__props, "alert");
    const close = useModel(__props, "close");
    function classNames() {
      const cn = dismissable.value ? "alert alert-" + alert.value + " align-items-center alert-dismissible fade show" : "alert alert-" + alert.value + " align-items-center";
      return cn;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(classNames()),
        role: "alert"
      }, [
        alert.value === "danger" ? (openBlock(), createBlock(_sfc_main$q, {
          key: 0,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "warning" ? (openBlock(), createBlock(_sfc_main$n, {
          key: 1,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "info" ? (openBlock(), createBlock(_sfc_main$o, {
          key: 2,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "success" ? (openBlock(), createBlock(_sfc_main$p, {
          key: 3,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        createTextVNode("  " + toDisplayString(message.value) + " ", 1),
        renderSlot(_ctx.$slots, "default"),
        dismissable.value && close.value !== void 0 ? (openBlock(), createElementBlock("button", {
          key: 4,
          onClick: _cache[0] || (_cache[0] = ($event) => close.value(alert.value)),
          type: "button",
          class: "btn-close",
          "aria-label": "Close"
        })) : createCommentVNode("", true),
        dismissable.value && close.value === void 0 ? (openBlock(), createElementBlock("button", _hoisted_1$d)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const _hoisted_1$c = { class: "card" };
const _hoisted_2$a = { class: "card-body" };
const _hoisted_3$6 = { class: "card-title" };
const _hoisted_4$4 = { class: "card-text" };
const _sfc_main$l = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsCard",
  props: {
    "header": {},
    "headerModifiers": {},
    "title": {},
    "titleModifiers": {},
    "icon": {},
    "iconModifiers": {},
    "iserr": {},
    "iserrModifiers": {},
    "color": {},
    "colorModifiers": {}
  },
  emits: ["update:header", "update:title", "update:icon", "update:iserr", "update:color"],
  setup(__props) {
    const header = useModel(__props, "header");
    const title = useModel(__props, "title");
    const icon = useModel(__props, "icon");
    const iserr = useModel(__props, "iserr");
    const headerColor = useModel(__props, "color");
    function headerStyle() {
      if (iserr.value !== void 0 && iserr.value) return "card-header bg-danger-subtle";
      if (headerColor.value === void 0) return "card-header bg-primary-subtle";
      return "card-header bg-" + headerColor.value + "-subtle";
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$c, [
        createBaseVNode("div", {
          class: normalizeClass(headerStyle())
        }, toDisplayString(header.value), 3),
        createBaseVNode("div", _hoisted_2$a, [
          createBaseVNode("h5", _hoisted_3$6, [
            icon.value !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(icon.value), {
              key: 0,
              width: "16",
              height: "16"
            })) : createCommentVNode("", true),
            createTextVNode(" " + toDisplayString(title.value), 1)
          ]),
          createBaseVNode("p", _hoisted_4$4, [
            renderSlot(_ctx.$slots, "default")
          ])
        ])
      ]);
    };
  }
});
const _hoisted_1$b = {
  class: "btn-group",
  role: "group"
};
const _hoisted_2$9 = ["disabled"];
const _sfc_main$k = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsFileUpload",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props) {
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$b, [
            createBaseVNode("input", mergeProps({
              class: "form-control",
              type: "file"
            }, _ctx.$attrs, { disabled: disabled.value }), null, 16, _hoisted_2$9)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$a = {
  class: "progress",
  style: { "height": "20px" }
};
const _sfc_main$j = {
  __name: "BsProgress",
  props: {
    "progress": {},
    "progressModifiers": {}
  },
  emits: ["update:progress"],
  setup(__props) {
    const progress = useModel(__props, "progress");
    const progressStyle = computed(() => {
      return "width: " + progress.value + "%";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, [
        createBaseVNode("div", {
          class: "progress-bar",
          role: "progressbar",
          style: normalizeStyle(progressStyle.value)
        }, null, 4)
      ]);
    };
  }
};
const _hoisted_1$9 = { class: "has-validation pt-2" };
const _hoisted_2$8 = {
  key: 0,
  class: "form-label fw-bold"
};
const _hoisted_3$5 = {
  key: 1,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_4$3 = { class: "form-text" };
const _sfc_main$i = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputBase",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:badge"],
  setup(__props) {
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        label.value !== void 0 ? (openBlock(), createElementBlock("label", _hoisted_2$8, toDisplayString(label.value), 1)) : createCommentVNode("", true),
        _cache[0] || (_cache[0] = createTextVNode("  ")),
        badge.value ? (openBlock(), createElementBlock("span", _hoisted_3$5, "1")) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass([width.value === void 0 ? "" : "col-" + width.value])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2),
        createBaseVNode("div", _hoisted_4$3, toDisplayString(help.value), 1)
      ]);
    };
  }
});
const _sfc_main$h = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconEyeSlash",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" }, null, -1),
        createBaseVNode("path", { d: "M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" }, null, -1),
        createBaseVNode("path", { d: "M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$g = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconEye",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" }, null, -1),
        createBaseVNode("path", { d: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" }, null, -1)
      ]), 16);
    };
  }
});
const _hoisted_1$8 = { class: "input-group" };
const _hoisted_2$7 = ["type", "data-bs-title"];
const _hoisted_3$4 = {
  key: 0,
  class: "input-group-text"
};
const _sfc_main$f = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputText",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "type": {},
    "typeModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:type", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const type = useModel(__props, "type");
    const badge = useModel(__props, "badge");
    const flag = ref(false);
    function toggle() {
      flag.value = !flag.value;
    }
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$8, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: type.value === void 0 || flag.value ? "text" : type.value
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$7), [
              [vModelDynamic, model.value]
            ]),
            type.value === "password" ? (openBlock(), createElementBlock("span", _hoisted_3$4, [
              !flag.value ? (openBlock(), createBlock(_sfc_main$g, {
                key: 0,
                onClick: toggle,
                width: "1rem",
                height: "1rem"
              })) : createCommentVNode("", true),
              flag.value ? (openBlock(), createBlock(_sfc_main$h, {
                key: 1,
                onClick: toggle,
                width: "1rem",
                height: "1rem"
              })) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$7 = { class: "input-group" };
const _hoisted_2$6 = ["data-bs-title"];
const _sfc_main$e = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputReadonly",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$7, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control-plaintext",
              readonly: "",
              type: "text"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$6), [
              [vModelText, model.value]
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help"]);
    };
  }
});
const _hoisted_1$6 = ["data-bs-title"];
const _sfc_main$d = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputTextArea",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("textarea", mergeProps({
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
            class: "form-control",
            type: "text"
          }, _ctx.$attrs, {
            "data-bs-toggle": "tooltip",
            "data-bs-custom-class": "custom-tooltip",
            "data-bs-title": help.value
          }), null, 16, _hoisted_1$6), [
            [vModelText, model.value]
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$5 = { class: "input-group" };
const _hoisted_2$5 = ["data-bs-title", "disabled"];
const _hoisted_3$3 = {
  key: 0,
  class: "input-group-text"
};
const _sfc_main$c = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputNumber",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "unit": {},
    "unitModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:unit", "update:disabled", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const unit = useModel(__props, "unit");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$5, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: "number"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value,
              disabled: disabled.value
            }), null, 16, _hoisted_2$5), [
              [vModelText, model.value]
            ]),
            unit.value !== void 0 ? (openBlock(), createElementBlock("span", _hoisted_3$3, toDisplayString(unit.value), 1)) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$4 = {
  class: "form-check form-switch",
  style: { "height": "38px" }
};
const _hoisted_2$4 = ["disabled", "data-bs-title"];
const _sfc_main$b = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputSwitch",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$4, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-check-input",
              type: "checkbox",
              role: "switch"
            }, _ctx.$attrs, {
              disabled: disabled.value,
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$4), [
              [vModelCheckbox, model.value]
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$3 = { class: "dropdown" };
const _hoisted_2$3 = ["disabled"];
const _hoisted_3$2 = { class: "dropdown-menu" };
const _hoisted_4$2 = ["onClick"];
const _sfc_main$a = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsDropdown",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "button": {},
    "buttonModifiers": {},
    "callback": {},
    "callbackModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:options", "update:button", "update:callback", "update:disabled", "update:badge"],
  setup(__props) {
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const options = useModel(__props, "options");
    const button = useModel(__props, "button");
    const callback = useModel(__props, "callback");
    const disabled = useModel(__props, "disabled");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$3, [
            createBaseVNode("button", {
              class: "btn btn-outline-secondary dropdown-toggle",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
              disabled: disabled.value
            }, toDisplayString(button.value), 9, _hoisted_2$3),
            createBaseVNode("ul", _hoisted_3$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
                return openBlock(), createElementBlock("li", {
                  key: o.value
                }, [
                  createBaseVNode("a", {
                    class: "dropdown-item",
                    onClick: ($event) => callback.value(o.value)
                  }, toDisplayString(o.label), 9, _hoisted_4$2)
                ]);
              }), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  const INDENT = Symbol.for("indent");
  const NEWLINE = Symbol.for("newline");
  const DEFAULT_NEWLINE = "\n";
  const DEFAULT_INDENT = "  ";
  const BOM = /^\uFEFF/;
  const FORMAT = /^\s*[{[]((?:\r?\n)+)([\s\t]*)/;
  const EMPTY = /^(?:\{\}|\[\])((?:\r?\n)+)?$/;
  const UNEXPECTED_TOKEN = /^Unexpected token '?(.)'?(,)? /i;
  const hexify = (char) => {
    const h2 = char.charCodeAt(0).toString(16).toUpperCase();
    return `0x${h2.length % 2 ? "0" : ""}${h2}`;
  };
  const stripBOM = (txt) => String(txt).replace(BOM, "");
  const makeParsedError = (msg, parsing, position = 0) => ({
    message: `${msg} while parsing ${parsing}`,
    position
  });
  const parseError = (e, txt, context = 20) => {
    let msg = e.message;
    if (!txt) {
      return makeParsedError(msg, "empty string");
    }
    const badTokenMatch = msg.match(UNEXPECTED_TOKEN);
    const badIndexMatch = msg.match(/ position\s+(\d+)/i);
    if (badTokenMatch) {
      msg = msg.replace(
        UNEXPECTED_TOKEN,
        `Unexpected token ${JSON.stringify(badTokenMatch[1])} (${hexify(badTokenMatch[1])})$2 `
      );
    }
    let errIdx;
    if (badIndexMatch) {
      errIdx = +badIndexMatch[1];
    } else if (msg.match(/^Unexpected end of JSON.*/i)) {
      errIdx = txt.length - 1;
    }
    if (errIdx == null) {
      return makeParsedError(msg, `'${txt.slice(0, context * 2)}'`);
    }
    const start = errIdx <= context ? 0 : errIdx - context;
    const end = errIdx + context >= txt.length ? txt.length : errIdx + context;
    const slice = `${start ? "..." : ""}${txt.slice(start, end)}${end === txt.length ? "" : "..."}`;
    return makeParsedError(
      msg,
      `${txt === slice ? "" : "near "}${JSON.stringify(slice)}`,
      errIdx
    );
  };
  class JSONParseError extends SyntaxError {
    constructor(er, txt, context, caller) {
      const metadata = parseError(er, txt, context);
      super(metadata.message);
      Object.assign(this, metadata);
      this.code = "EJSONPARSE";
      this.systemError = er;
      Error.captureStackTrace(this, caller || this.constructor);
    }
    get name() {
      return this.constructor.name;
    }
    set name(n) {
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
  }
  const parseJson2 = (txt, reviver) => {
    const result = JSON.parse(txt, reviver);
    if (result && typeof result === "object") {
      const match = txt.match(EMPTY) || txt.match(FORMAT) || [null, "", ""];
      result[NEWLINE] = match[1] ?? DEFAULT_NEWLINE;
      result[INDENT] = match[2] ?? DEFAULT_INDENT;
    }
    return result;
  };
  const parseJsonError = (raw, reviver, context) => {
    const txt = stripBOM(raw);
    try {
      return parseJson2(txt, reviver);
    } catch (e) {
      if (typeof raw !== "string" && !Buffer.isBuffer(raw)) {
        const msg = Array.isArray(raw) && raw.length === 0 ? "an empty array" : String(raw);
        throw Object.assign(
          new TypeError(`Cannot parse ${msg}`),
          { code: "EJSONPARSE", systemError: e }
        );
      }
      throw new JSONParseError(e, txt, context, parseJsonError);
    }
  };
  lib = parseJsonError;
  parseJsonError.JSONParseError = JSONParseError;
  parseJsonError.noExceptions = (raw, reviver) => {
    try {
      return parseJson2(stripBOM(raw), reviver);
    } catch {
    }
  };
  return lib;
}
var libExports = requireLib();
const parseJson = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const _hoisted_1$2 = ["data-bs-target"];
const _hoisted_2$2 = ["id"];
const _hoisted_3$1 = { class: "modal-dialog" };
const _hoisted_4$1 = { class: "modal-content p-4" };
const _hoisted_5$1 = { class: "modal-header" };
const _hoisted_6$1 = { class: "modal-title fs-5" };
const _hoisted_7$1 = { class: "modal-body" };
const _hoisted_8$1 = { key: 0 };
const _hoisted_9 = { key: 2 };
const _hoisted_10 = { class: "text-danger" };
const _sfc_main$9 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsModal",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "button": {},
    "buttonModifiers": {},
    "title": {},
    "titleModifiers": {},
    "json": {},
    "jsonModifiers": {},
    "mqtt": {},
    "mqttModifiers": {}
  },
  emits: ["update:modelValue", "update:button", "update:title", "update:json", "update:mqtt"],
  setup(__props) {
    const jsonError = ref("");
    const model = useModel(__props, "modelValue");
    const button = useModel(__props, "button");
    const title = useModel(__props, "title");
    const json = useModel(__props, "json");
    const mqtt = useModel(__props, "mqtt");
    const format = (s) => {
      if (mqtt.value) return s;
      if (isValidJson(model.value)) return JSON.stringify(JSON.parse(s), null, 2);
      if (isValidFormData(model.value)) return s.replaceAll("&", "&\n\r");
      return s;
    };
    const checkCode = () => {
      jsonError.value = "";
      if (mqtt.value) {
        if (json.value) {
          var input = model.value;
          var arr = input.replaceAll("\n", "").split("|");
          arr.forEach((value) => {
            const data = value.substring(value.indexOf(":") + 1);
            if (data.indexOf("{") >= 0 && data.indexOf("}") > 0) {
              try {
                parseJson(data);
              } catch (e) {
                jsonError.value = e.message;
              }
            }
          });
        }
        return true;
      }
      if (isValidFormData(model.value)) return true;
      if (isValidJson(model.value)) {
        return true;
      } else if (json.value) {
        try {
          parseJson(model.value);
        } catch (e) {
          jsonError.value = e.message;
        }
      }
      return false;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("button", mergeProps(_ctx.$attrs, {
          type: "button",
          class: "btn btn-secondary",
          "data-bs-toggle": "modal",
          "data-bs-target": "#modal" + _ctx.$.uid
        }), toDisplayString(button.value), 17, _hoisted_1$2),
        createBaseVNode("div", {
          class: "modal fade modal-lg",
          id: "modal" + _ctx.$.uid,
          tabindex: "-1",
          "aria-hidden": "true"
        }, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("div", _hoisted_4$1, [
              createBaseVNode("div", _hoisted_5$1, [
                createBaseVNode("h1", _hoisted_6$1, toDisplayString(title.value), 1),
                _cache[0] || (_cache[0] = createBaseVNode("button", {
                  type: "button",
                  class: "btn-close",
                  "data-bs-dismiss": "modal",
                  "aria-label": "Close"
                }, null, -1))
              ]),
              createBaseVNode("div", _hoisted_7$1, [
                checkCode() ? (openBlock(), createElementBlock("pre", _hoisted_8$1, toDisplayString(format(model.value)), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createTextVNode(toDisplayString(model.value), 1)
                ], 64)),
                jsonError.value != "" ? (openBlock(), createElementBlock("div", _hoisted_9, [
                  _cache[1] || (_cache[1] = createBaseVNode("hr", null, null, -1)),
                  createBaseVNode("p", _hoisted_10, toDisplayString(jsonError.value), 1)
                ])) : createCommentVNode("", true)
              ]),
              _cache[2] || (_cache[2] = createBaseVNode("div", { class: "modal-footer" }, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  "data-bs-dismiss": "modal"
                }, "Close")
              ], -1))
            ])
          ])
        ], 8, _hoisted_2$2)
      ], 64);
    };
  }
});
const _hoisted_1$1 = ["id", "data-bs-target"];
const _hoisted_2$1 = ["id"];
const _hoisted_3 = { class: "modal-dialog" };
const _hoisted_4 = { class: "modal-content p-4" };
const _hoisted_5 = { class: "modal-header" };
const _hoisted_6 = { class: "modal-title fs-5" };
const _hoisted_7 = { class: "modal-body" };
const _hoisted_8 = { class: "modal-footer" };
const _sfc_main$8 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsModalConfirm",
  props: {
    "callback": {},
    "callbackModifiers": {},
    "message": {},
    "messageModifiers": {},
    "id": {},
    "idModifiers": {},
    "title": {},
    "titleModifiers": {}
  },
  emits: ["update:callback", "update:message", "update:id", "update:title"],
  setup(__props) {
    const callback = useModel(__props, "callback");
    const message = useModel(__props, "message");
    const id = useModel(__props, "id");
    const title = useModel(__props, "title");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("button", {
          id: id.value,
          type: "button",
          class: "btn btn-secondary",
          hidden: "",
          "data-bs-toggle": "modal",
          "data-bs-target": "#modal" + _ctx.$.uid
        }, " Testing ", 8, _hoisted_1$1),
        createBaseVNode("div", {
          class: "modal fade modal-lg",
          id: "modal" + _ctx.$.uid,
          tabindex: "-1",
          "aria-hidden": "true"
        }, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("h1", _hoisted_6, toDisplayString(title.value), 1)
              ]),
              createBaseVNode("div", _hoisted_7, toDisplayString(message.value), 1),
              createBaseVNode("div", _hoisted_8, [
                createBaseVNode("button", {
                  onClick: _cache[0] || (_cache[0] = ($event) => callback.value(true)),
                  type: "button",
                  class: "btn btn-primary",
                  "data-bs-dismiss": "modal"
                }, " Confirm "),
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => callback.value(false)),
                  type: "button",
                  class: "btn btn-secondary",
                  "data-bs-dismiss": "modal"
                }, " Cancel ")
              ])
            ])
          ])
        ], 8, _hoisted_2$1)
      ], 64);
    };
  }
});
const _hoisted_1 = ["data-bs-title"];
const _hoisted_2 = ["onClick"];
const _sfc_main$7 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputTextAreaFormat",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:badge"],
  setup(__props) {
    const contextMenuOptions = ref([
      { label: "Cancel", value: "" },
      { label: "Network name, ${mdns}", value: "${mdns}" },
      { label: "Chip ID, ${id}", value: "${id}" },
      { label: "Sleep interval, ${sleep-interval}", value: "${sleep-interval}" },
      { label: "Token, ${token}", value: "${token}" },
      { label: "Token 2, ${token2}", value: "${token2}" },
      { label: "Current angle/tilt, ${angle}", value: "${angle}" },
      { label: "Current angle/tilt, ${tilt}", value: "${tilt}" },
      { label: "Temperature (C), ${temp-c}", value: "${temp-c}" },
      { label: "Temperature (F), ${temp-f}", value: "${temp-f}" },
      { label: "Temperature Unit, ${temp-unit}", value: "${temp-unit}" },
      { label: "Application version, ${app-ver}", value: "${app-ver}" },
      { label: "Application build, ${app-build}", value: "${app-build}" },
      { label: "Battery (V), ${battery}", value: "${battery}" },
      { label: "Battery (%), ${battery-percent}", value: "${battery-percent}" },
      { label: "Wifi signal strength, ${rssi}", value: "${rssi}" },
      { label: "Time for measurement, ${run-time}", value: "${run-time}" },
      { label: "Gravity, ${gravity}", value: "${gravity}" },
      { label: "Gravity (SG), ${gravity-sg}", value: "${gravity-sg}" },
      { label: "Gravity (Plato), ${gravity-plato}", value: "${gravity-plato}" },
      { label: "Gravity unit, ${gravity-unit}", value: "${gravity-unit}" },
      { label: "Corrected gravity, ${corr-gravity}", value: "${corr-gravity}" },
      {
        label: "Corrected Gravity (SG), ${corr-gravity-sg}",
        value: "${corr-gravity-sg}"
      },
      {
        label: "Corrected Gravity (Plato), ${corr-gravity-plato}",
        value: "${corr-gravity-plato}"
      }
    ]);
    function insertText(value) {
      if (value.length > 0) {
        var obj = document.getElementById("textArea");
        model.value = obj.value.substring(0, obj.selectionStart) + value + obj.value.substring(obj.selectionEnd, obj.value.length);
      }
      var menu = document.getElementById("contextMenu");
      menu.style.display = "none";
    }
    const openContextMenu = (event2) => {
      var menu = document.getElementById("contextMenu");
      menu.style.display = "block";
      menu.style.left = event2.pageX + "px";
      menu.style.top = event2.pageY + "px";
    };
    const model = useModel(__props, "modelValue");
    const label = useModel(__props, "label");
    const help = useModel(__props, "help");
    const width = useModel(__props, "width");
    const badge = useModel(__props, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_component_BsInputBase, {
          width: width.value,
          label: label.value,
          help: help.value,
          badge: badge.value
        }, {
          default: withCtx(() => [
            withDirectives(createBaseVNode("textarea", mergeProps({
              onContextmenu: withModifiers(openContextMenu, ["right", "prevent"]),
              id: "textArea",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: "text"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_1), [
              [vModelText, model.value]
            ])
          ]),
          _: 1
        }, 8, ["width", "label", "help", "badge"]),
        createBaseVNode("div", {
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.closeContextMenu && _ctx.closeContextMenu(...args)),
          id: "contextMenu",
          class: "dropdown-menu"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(contextMenuOptions.value, (o) => {
            return openBlock(), createElementBlock("a", {
              key: o.value,
              class: "dropdown-item",
              onClick: ($event) => insertText(o.value)
            }, toDisplayString(o.label), 9, _hoisted_2);
          }), 128))
        ])
      ], 64);
    };
  }
});
const _sfc_main$6 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconHome",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$5 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconTools",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$4 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconGraphUpArrow",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          "fill-rule": "evenodd",
          d: "M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
        }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconCloudUpArrow",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          "fill-rule": "evenodd",
          d: "M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"
        }, null, -1),
        createBaseVNode("path", { d: "M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconUpArrow",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          "fill-rule": "evenodd",
          d: "M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
        }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconCpu",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("path", { d: "M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" }, null, -1)
      ]), 16);
    };
  }
});
const _sfc_main = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconData",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _cache[0] || (_cache[0] = [
        createBaseVNode("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          fill: "currentColor",
          class: "bi bi-database",
          viewBox: "0 0 16 16"
        }, [
          createBaseVNode("path", { d: "M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" })
        ], -1)
      ]), 16);
    };
  }
});
var bootstrap_bundle$1 = { exports: {} };
/*!
  * Bootstrap v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
var bootstrap_bundle = bootstrap_bundle$1.exports;
var hasRequiredBootstrap_bundle;
function requireBootstrap_bundle() {
  if (hasRequiredBootstrap_bundle) return bootstrap_bundle$1.exports;
  hasRequiredBootstrap_bundle = 1;
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(bootstrap_bundle, function() {
      const elementMap = /* @__PURE__ */ new Map();
      const Data = {
        set(element, key, instance) {
          if (!elementMap.has(element)) {
            elementMap.set(element, /* @__PURE__ */ new Map());
          }
          const instanceMap = elementMap.get(element);
          if (!instanceMap.has(key) && instanceMap.size !== 0) {
            console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
            return;
          }
          instanceMap.set(key, instance);
        },
        get(element, key) {
          if (elementMap.has(element)) {
            return elementMap.get(element).get(key) || null;
          }
          return null;
        },
        remove(element, key) {
          if (!elementMap.has(element)) {
            return;
          }
          const instanceMap = elementMap.get(element);
          instanceMap.delete(key);
          if (instanceMap.size === 0) {
            elementMap.delete(element);
          }
        }
      };
      const MAX_UID = 1e6;
      const MILLISECONDS_MULTIPLIER = 1e3;
      const TRANSITION_END = "transitionend";
      const parseSelector = (selector) => {
        if (selector && window.CSS && window.CSS.escape) {
          selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
        }
        return selector;
      };
      const toType = (object) => {
        if (object === null || object === void 0) {
          return `${object}`;
        }
        return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
      };
      const getUID = (prefix) => {
        do {
          prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix));
        return prefix;
      };
      const getTransitionDurationFromElement = (element) => {
        if (!element) {
          return 0;
        }
        let {
          transitionDuration,
          transitionDelay
        } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay);
        if (!floatTransitionDuration && !floatTransitionDelay) {
          return 0;
        }
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
      };
      const triggerTransitionEnd = (element) => {
        element.dispatchEvent(new Event(TRANSITION_END));
      };
      const isElement$1 = (object) => {
        if (!object || typeof object !== "object") {
          return false;
        }
        if (typeof object.jquery !== "undefined") {
          object = object[0];
        }
        return typeof object.nodeType !== "undefined";
      };
      const getElement = (object) => {
        if (isElement$1(object)) {
          return object.jquery ? object[0] : object;
        }
        if (typeof object === "string" && object.length > 0) {
          return document.querySelector(parseSelector(object));
        }
        return null;
      };
      const isVisible = (element) => {
        if (!isElement$1(element) || element.getClientRects().length === 0) {
          return false;
        }
        const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
        const closedDetails = element.closest("details:not([open])");
        if (!closedDetails) {
          return elementIsVisible;
        }
        if (closedDetails !== element) {
          const summary = element.closest("summary");
          if (summary && summary.parentNode !== closedDetails) {
            return false;
          }
          if (summary === null) {
            return false;
          }
        }
        return elementIsVisible;
      };
      const isDisabled = (element) => {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          return true;
        }
        if (element.classList.contains("disabled")) {
          return true;
        }
        if (typeof element.disabled !== "undefined") {
          return element.disabled;
        }
        return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
      };
      const findShadowRoot = (element) => {
        if (!document.documentElement.attachShadow) {
          return null;
        }
        if (typeof element.getRootNode === "function") {
          const root = element.getRootNode();
          return root instanceof ShadowRoot ? root : null;
        }
        if (element instanceof ShadowRoot) {
          return element;
        }
        if (!element.parentNode) {
          return null;
        }
        return findShadowRoot(element.parentNode);
      };
      const noop2 = () => {
      };
      const reflow = (element) => {
        element.offsetHeight;
      };
      const getjQuery = () => {
        if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
          return window.jQuery;
        }
        return null;
      };
      const DOMContentLoadedCallbacks = [];
      const onDOMContentLoaded = (callback) => {
        if (document.readyState === "loading") {
          if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener("DOMContentLoaded", () => {
              for (const callback2 of DOMContentLoadedCallbacks) {
                callback2();
              }
            });
          }
          DOMContentLoadedCallbacks.push(callback);
        } else {
          callback();
        }
      };
      const isRTL = () => document.documentElement.dir === "rtl";
      const defineJQueryPlugin = (plugin) => {
        onDOMContentLoaded(() => {
          const $ = getjQuery();
          if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
              $.fn[name] = JQUERY_NO_CONFLICT;
              return plugin.jQueryInterface;
            };
          }
        });
      };
      const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
        return typeof possibleCallback === "function" ? possibleCallback(...args) : defaultValue;
      };
      const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
        if (!waitForTransition) {
          execute(callback);
          return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({
          target
        }) => {
          if (target !== transitionElement) {
            return;
          }
          called = true;
          transitionElement.removeEventListener(TRANSITION_END, handler);
          execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(() => {
          if (!called) {
            triggerTransitionEnd(transitionElement);
          }
        }, emulatedDuration);
      };
      const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
        const listLength = list.length;
        let index = list.indexOf(activeElement);
        if (index === -1) {
          return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
        }
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) {
          index = (index + listLength) % listLength;
        }
        return list[Math.max(0, Math.min(index, listLength - 1))];
      };
      const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
      const stripNameRegex = /\..*/;
      const stripUidRegex = /::\d+$/;
      const eventRegistry = {};
      let uidEvent = 1;
      const customEvents = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
      };
      const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
      function makeEventUid(element, uid2) {
        return uid2 && `${uid2}::${uidEvent++}` || element.uidEvent || uidEvent++;
      }
      function getElementEvents(element) {
        const uid2 = makeEventUid(element);
        element.uidEvent = uid2;
        eventRegistry[uid2] = eventRegistry[uid2] || {};
        return eventRegistry[uid2];
      }
      function bootstrapHandler(element, fn) {
        return function handler(event2) {
          hydrateObj(event2, {
            delegateTarget: element
          });
          if (handler.oneOff) {
            EventHandler.off(element, event2.type, fn);
          }
          return fn.apply(element, [event2]);
        };
      }
      function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event2) {
          const domElements = element.querySelectorAll(selector);
          for (let {
            target
          } = event2; target && target !== this; target = target.parentNode) {
            for (const domElement of domElements) {
              if (domElement !== target) {
                continue;
              }
              hydrateObj(event2, {
                delegateTarget: target
              });
              if (handler.oneOff) {
                EventHandler.off(element, event2.type, selector, fn);
              }
              return fn.apply(target, [event2]);
            }
          }
        };
      }
      function findHandler(events, callable, delegationSelector = null) {
        return Object.values(events).find((event2) => event2.callable === callable && event2.delegationSelector === delegationSelector);
      }
      function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
        const isDelegated = typeof handler === "string";
        const callable = isDelegated ? delegationFunction : handler || delegationFunction;
        let typeEvent = getTypeEvent(originalTypeEvent);
        if (!nativeEvents.has(typeEvent)) {
          typeEvent = originalTypeEvent;
        }
        return [isDelegated, callable, typeEvent];
      }
      function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
        if (typeof originalTypeEvent !== "string" || !element) {
          return;
        }
        let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        if (originalTypeEvent in customEvents) {
          const wrapFunction = (fn2) => {
            return function(event2) {
              if (!event2.relatedTarget || event2.relatedTarget !== event2.delegateTarget && !event2.delegateTarget.contains(event2.relatedTarget)) {
                return fn2.call(this, event2);
              }
            };
          };
          callable = wrapFunction(callable);
        }
        const events = getElementEvents(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
        if (previousFunction) {
          previousFunction.oneOff = previousFunction.oneOff && oneOff;
          return;
        }
        const uid2 = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
        const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
        fn.delegationSelector = isDelegated ? handler : null;
        fn.callable = callable;
        fn.oneOff = oneOff;
        fn.uidEvent = uid2;
        handlers[uid2] = fn;
        element.addEventListener(typeEvent, fn, isDelegated);
      }
      function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) {
          return;
        }
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
      }
      function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        for (const [handlerKey, event2] of Object.entries(storeElementEvent)) {
          if (handlerKey.includes(namespace)) {
            removeHandler(element, events, typeEvent, event2.callable, event2.delegationSelector);
          }
        }
      }
      function getTypeEvent(event2) {
        event2 = event2.replace(stripNameRegex, "");
        return customEvents[event2] || event2;
      }
      const EventHandler = {
        on(element, event2, handler, delegationFunction) {
          addHandler(element, event2, handler, delegationFunction, false);
        },
        one(element, event2, handler, delegationFunction) {
          addHandler(element, event2, handler, delegationFunction, true);
        },
        off(element, originalTypeEvent, handler, delegationFunction) {
          if (typeof originalTypeEvent !== "string" || !element) {
            return;
          }
          const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
          const inNamespace = typeEvent !== originalTypeEvent;
          const events = getElementEvents(element);
          const storeElementEvent = events[typeEvent] || {};
          const isNamespace = originalTypeEvent.startsWith(".");
          if (typeof callable !== "undefined") {
            if (!Object.keys(storeElementEvent).length) {
              return;
            }
            removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
            return;
          }
          if (isNamespace) {
            for (const elementEvent of Object.keys(events)) {
              removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            }
          }
          for (const [keyHandlers, event2] of Object.entries(storeElementEvent)) {
            const handlerKey = keyHandlers.replace(stripUidRegex, "");
            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
              removeHandler(element, events, typeEvent, event2.callable, event2.delegationSelector);
            }
          }
        },
        trigger(element, event2, args) {
          if (typeof event2 !== "string" || !element) {
            return null;
          }
          const $ = getjQuery();
          const typeEvent = getTypeEvent(event2);
          const inNamespace = event2 !== typeEvent;
          let jQueryEvent = null;
          let bubbles = true;
          let nativeDispatch = true;
          let defaultPrevented = false;
          if (inNamespace && $) {
            jQueryEvent = $.Event(event2, args);
            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
          }
          const evt = hydrateObj(new Event(event2, {
            bubbles,
            cancelable: true
          }), args);
          if (defaultPrevented) {
            evt.preventDefault();
          }
          if (nativeDispatch) {
            element.dispatchEvent(evt);
          }
          if (evt.defaultPrevented && jQueryEvent) {
            jQueryEvent.preventDefault();
          }
          return evt;
        }
      };
      function hydrateObj(obj, meta = {}) {
        for (const [key, value] of Object.entries(meta)) {
          try {
            obj[key] = value;
          } catch (_unused) {
            Object.defineProperty(obj, key, {
              configurable: true,
              get() {
                return value;
              }
            });
          }
        }
        return obj;
      }
      function normalizeData(value) {
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }
        if (value === Number(value).toString()) {
          return Number(value);
        }
        if (value === "" || value === "null") {
          return null;
        }
        if (typeof value !== "string") {
          return value;
        }
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (_unused) {
          return value;
        }
      }
      function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
      }
      const Manipulator = {
        setDataAttribute(element, key, value) {
          element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute(element, key) {
          element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes(element) {
          if (!element) {
            return {};
          }
          const attributes = {};
          const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
          for (const key of bsKeys) {
            let pureKey = key.replace(/^bs/, "");
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
            attributes[pureKey] = normalizeData(element.dataset[key]);
          }
          return attributes;
        },
        getDataAttribute(element, key) {
          return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        }
      };
      class Config {
        // Getters
        static get Default() {
          return {};
        }
        static get DefaultType() {
          return {};
        }
        static get NAME() {
          throw new Error('You have to implement the static method "NAME", for each component!');
        }
        _getConfig(config2) {
          config2 = this._mergeConfigObj(config2);
          config2 = this._configAfterMerge(config2);
          this._typeCheckConfig(config2);
          return config2;
        }
        _configAfterMerge(config2) {
          return config2;
        }
        _mergeConfigObj(config2, element) {
          const jsonConfig = isElement$1(element) ? Manipulator.getDataAttribute(element, "config") : {};
          return {
            ...this.constructor.Default,
            ...typeof jsonConfig === "object" ? jsonConfig : {},
            ...isElement$1(element) ? Manipulator.getDataAttributes(element) : {},
            ...typeof config2 === "object" ? config2 : {}
          };
        }
        _typeCheckConfig(config2, configTypes = this.constructor.DefaultType) {
          for (const [property, expectedTypes] of Object.entries(configTypes)) {
            const value = config2[property];
            const valueType = isElement$1(value) ? "element" : toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
            }
          }
        }
      }
      const VERSION = "5.3.3";
      class BaseComponent extends Config {
        constructor(element, config2) {
          super();
          element = getElement(element);
          if (!element) {
            return;
          }
          this._element = element;
          this._config = this._getConfig(config2);
          Data.set(this._element, this.constructor.DATA_KEY, this);
        }
        // Public
        dispose() {
          Data.remove(this._element, this.constructor.DATA_KEY);
          EventHandler.off(this._element, this.constructor.EVENT_KEY);
          for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
          }
        }
        _queueCallback(callback, element, isAnimated = true) {
          executeAfterTransition(callback, element, isAnimated);
        }
        _getConfig(config2) {
          config2 = this._mergeConfigObj(config2, this._element);
          config2 = this._configAfterMerge(config2);
          this._typeCheckConfig(config2);
          return config2;
        }
        // Static
        static getInstance(element) {
          return Data.get(getElement(element), this.DATA_KEY);
        }
        static getOrCreateInstance(element, config2 = {}) {
          return this.getInstance(element) || new this(element, typeof config2 === "object" ? config2 : null);
        }
        static get VERSION() {
          return VERSION;
        }
        static get DATA_KEY() {
          return `bs.${this.NAME}`;
        }
        static get EVENT_KEY() {
          return `.${this.DATA_KEY}`;
        }
        static eventName(name) {
          return `${name}${this.EVENT_KEY}`;
        }
      }
      const getSelector = (element) => {
        let selector = element.getAttribute("data-bs-target");
        if (!selector || selector === "#") {
          let hrefAttribute = element.getAttribute("href");
          if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
            return null;
          }
          if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
            hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
          }
          selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
        }
        return selector ? selector.split(",").map((sel) => parseSelector(sel)).join(",") : null;
      };
      const SelectorEngine = {
        find(selector, element = document.documentElement) {
          return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne(selector, element = document.documentElement) {
          return Element.prototype.querySelector.call(element, selector);
        },
        children(element, selector) {
          return [].concat(...element.children).filter((child) => child.matches(selector));
        },
        parents(element, selector) {
          const parents = [];
          let ancestor = element.parentNode.closest(selector);
          while (ancestor) {
            parents.push(ancestor);
            ancestor = ancestor.parentNode.closest(selector);
          }
          return parents;
        },
        prev(element, selector) {
          let previous = element.previousElementSibling;
          while (previous) {
            if (previous.matches(selector)) {
              return [previous];
            }
            previous = previous.previousElementSibling;
          }
          return [];
        },
        // TODO: this is now unused; remove later along with prev()
        next(element, selector) {
          let next = element.nextElementSibling;
          while (next) {
            if (next.matches(selector)) {
              return [next];
            }
            next = next.nextElementSibling;
          }
          return [];
        },
        focusableChildren(element) {
          const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
          return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
        },
        getSelectorFromElement(element) {
          const selector = getSelector(element);
          if (selector) {
            return SelectorEngine.findOne(selector) ? selector : null;
          }
          return null;
        },
        getElementFromSelector(element) {
          const selector = getSelector(element);
          return selector ? SelectorEngine.findOne(selector) : null;
        },
        getMultipleElementsFromSelector(element) {
          const selector = getSelector(element);
          return selector ? SelectorEngine.find(selector) : [];
        }
      };
      const enableDismissTrigger = (component, method = "hide") => {
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event2) {
          if (["A", "AREA"].includes(this.tagName)) {
            event2.preventDefault();
          }
          if (isDisabled(this)) {
            return;
          }
          const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
          const instance = component.getOrCreateInstance(target);
          instance[method]();
        });
      };
      const NAME$f = "alert";
      const DATA_KEY$a = "bs.alert";
      const EVENT_KEY$b = `.${DATA_KEY$a}`;
      const EVENT_CLOSE = `close${EVENT_KEY$b}`;
      const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
      const CLASS_NAME_FADE$5 = "fade";
      const CLASS_NAME_SHOW$8 = "show";
      class Alert extends BaseComponent {
        // Getters
        static get NAME() {
          return NAME$f;
        }
        // Public
        close() {
          const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
          if (closeEvent.defaultPrevented) {
            return;
          }
          this._element.classList.remove(CLASS_NAME_SHOW$8);
          const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
          this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
        }
        // Private
        _destroyElement() {
          this._element.remove();
          EventHandler.trigger(this._element, EVENT_CLOSED);
          this.dispose();
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Alert.getOrCreateInstance(this);
            if (typeof config2 !== "string") {
              return;
            }
            if (data[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2](this);
          });
        }
      }
      enableDismissTrigger(Alert, "close");
      defineJQueryPlugin(Alert);
      const NAME$e = "button";
      const DATA_KEY$9 = "bs.button";
      const EVENT_KEY$a = `.${DATA_KEY$9}`;
      const DATA_API_KEY$6 = ".data-api";
      const CLASS_NAME_ACTIVE$3 = "active";
      const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
      const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
      class Button extends BaseComponent {
        // Getters
        static get NAME() {
          return NAME$e;
        }
        // Public
        toggle() {
          this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Button.getOrCreateInstance(this);
            if (config2 === "toggle") {
              data[config2]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event2) => {
        event2.preventDefault();
        const button = event2.target.closest(SELECTOR_DATA_TOGGLE$5);
        const data = Button.getOrCreateInstance(button);
        data.toggle();
      });
      defineJQueryPlugin(Button);
      const NAME$d = "swipe";
      const EVENT_KEY$9 = ".bs.swipe";
      const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
      const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
      const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
      const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
      const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
      const POINTER_TYPE_TOUCH = "touch";
      const POINTER_TYPE_PEN = "pen";
      const CLASS_NAME_POINTER_EVENT = "pointer-event";
      const SWIPE_THRESHOLD = 40;
      const Default$c = {
        endCallback: null,
        leftCallback: null,
        rightCallback: null
      };
      const DefaultType$c = {
        endCallback: "(function|null)",
        leftCallback: "(function|null)",
        rightCallback: "(function|null)"
      };
      class Swipe extends Config {
        constructor(element, config2) {
          super();
          this._element = element;
          if (!element || !Swipe.isSupported()) {
            return;
          }
          this._config = this._getConfig(config2);
          this._deltaX = 0;
          this._supportPointerEvents = Boolean(window.PointerEvent);
          this._initEvents();
        }
        // Getters
        static get Default() {
          return Default$c;
        }
        static get DefaultType() {
          return DefaultType$c;
        }
        static get NAME() {
          return NAME$d;
        }
        // Public
        dispose() {
          EventHandler.off(this._element, EVENT_KEY$9);
        }
        // Private
        _start(event2) {
          if (!this._supportPointerEvents) {
            this._deltaX = event2.touches[0].clientX;
            return;
          }
          if (this._eventIsPointerPenTouch(event2)) {
            this._deltaX = event2.clientX;
          }
        }
        _end(event2) {
          if (this._eventIsPointerPenTouch(event2)) {
            this._deltaX = event2.clientX - this._deltaX;
          }
          this._handleSwipe();
          execute(this._config.endCallback);
        }
        _move(event2) {
          this._deltaX = event2.touches && event2.touches.length > 1 ? 0 : event2.touches[0].clientX - this._deltaX;
        }
        _handleSwipe() {
          const absDeltaX = Math.abs(this._deltaX);
          if (absDeltaX <= SWIPE_THRESHOLD) {
            return;
          }
          const direction = absDeltaX / this._deltaX;
          this._deltaX = 0;
          if (!direction) {
            return;
          }
          execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
        }
        _initEvents() {
          if (this._supportPointerEvents) {
            EventHandler.on(this._element, EVENT_POINTERDOWN, (event2) => this._start(event2));
            EventHandler.on(this._element, EVENT_POINTERUP, (event2) => this._end(event2));
            this._element.classList.add(CLASS_NAME_POINTER_EVENT);
          } else {
            EventHandler.on(this._element, EVENT_TOUCHSTART, (event2) => this._start(event2));
            EventHandler.on(this._element, EVENT_TOUCHMOVE, (event2) => this._move(event2));
            EventHandler.on(this._element, EVENT_TOUCHEND, (event2) => this._end(event2));
          }
        }
        _eventIsPointerPenTouch(event2) {
          return this._supportPointerEvents && (event2.pointerType === POINTER_TYPE_PEN || event2.pointerType === POINTER_TYPE_TOUCH);
        }
        // Static
        static isSupported() {
          return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
        }
      }
      const NAME$c = "carousel";
      const DATA_KEY$8 = "bs.carousel";
      const EVENT_KEY$8 = `.${DATA_KEY$8}`;
      const DATA_API_KEY$5 = ".data-api";
      const ARROW_LEFT_KEY$1 = "ArrowLeft";
      const ARROW_RIGHT_KEY$1 = "ArrowRight";
      const TOUCHEVENT_COMPAT_WAIT = 500;
      const ORDER_NEXT = "next";
      const ORDER_PREV = "prev";
      const DIRECTION_LEFT = "left";
      const DIRECTION_RIGHT = "right";
      const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
      const EVENT_SLID = `slid${EVENT_KEY$8}`;
      const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
      const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
      const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
      const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
      const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
      const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
      const CLASS_NAME_CAROUSEL = "carousel";
      const CLASS_NAME_ACTIVE$2 = "active";
      const CLASS_NAME_SLIDE = "slide";
      const CLASS_NAME_END = "carousel-item-end";
      const CLASS_NAME_START = "carousel-item-start";
      const CLASS_NAME_NEXT = "carousel-item-next";
      const CLASS_NAME_PREV = "carousel-item-prev";
      const SELECTOR_ACTIVE = ".active";
      const SELECTOR_ITEM = ".carousel-item";
      const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
      const SELECTOR_ITEM_IMG = ".carousel-item img";
      const SELECTOR_INDICATORS = ".carousel-indicators";
      const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
      const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
      const KEY_TO_DIRECTION = {
        [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
        [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
      };
      const Default$b = {
        interval: 5e3,
        keyboard: true,
        pause: "hover",
        ride: false,
        touch: true,
        wrap: true
      };
      const DefaultType$b = {
        interval: "(number|boolean)",
        // TODO:v6 remove boolean support
        keyboard: "boolean",
        pause: "(string|boolean)",
        ride: "(boolean|string)",
        touch: "boolean",
        wrap: "boolean"
      };
      class Carousel extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._interval = null;
          this._activeElement = null;
          this._isSliding = false;
          this.touchTimeout = null;
          this._swipeHelper = null;
          this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
          this._addEventListeners();
          if (this._config.ride === CLASS_NAME_CAROUSEL) {
            this.cycle();
          }
        }
        // Getters
        static get Default() {
          return Default$b;
        }
        static get DefaultType() {
          return DefaultType$b;
        }
        static get NAME() {
          return NAME$c;
        }
        // Public
        next() {
          this._slide(ORDER_NEXT);
        }
        nextWhenVisible() {
          if (!document.hidden && isVisible(this._element)) {
            this.next();
          }
        }
        prev() {
          this._slide(ORDER_PREV);
        }
        pause() {
          if (this._isSliding) {
            triggerTransitionEnd(this._element);
          }
          this._clearInterval();
        }
        cycle() {
          this._clearInterval();
          this._updateInterval();
          this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
        }
        _maybeEnableCycle() {
          if (!this._config.ride) {
            return;
          }
          if (this._isSliding) {
            EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
            return;
          }
          this.cycle();
        }
        to(index) {
          const items2 = this._getItems();
          if (index > items2.length - 1 || index < 0) {
            return;
          }
          if (this._isSliding) {
            EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
            return;
          }
          const activeIndex = this._getItemIndex(this._getActive());
          if (activeIndex === index) {
            return;
          }
          const order2 = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
          this._slide(order2, items2[index]);
        }
        dispose() {
          if (this._swipeHelper) {
            this._swipeHelper.dispose();
          }
          super.dispose();
        }
        // Private
        _configAfterMerge(config2) {
          config2.defaultInterval = config2.interval;
          return config2;
        }
        _addEventListeners() {
          if (this._config.keyboard) {
            EventHandler.on(this._element, EVENT_KEYDOWN$1, (event2) => this._keydown(event2));
          }
          if (this._config.pause === "hover") {
            EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
            EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
          }
          if (this._config.touch && Swipe.isSupported()) {
            this._addTouchEventListeners();
          }
        }
        _addTouchEventListeners() {
          for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
            EventHandler.on(img, EVENT_DRAG_START, (event2) => event2.preventDefault());
          }
          const endCallBack = () => {
            if (this._config.pause !== "hover") {
              return;
            }
            this.pause();
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout);
            }
            this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
          };
          const swipeConfig = {
            leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
            rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
            endCallback: endCallBack
          };
          this._swipeHelper = new Swipe(this._element, swipeConfig);
        }
        _keydown(event2) {
          if (/input|textarea/i.test(event2.target.tagName)) {
            return;
          }
          const direction = KEY_TO_DIRECTION[event2.key];
          if (direction) {
            event2.preventDefault();
            this._slide(this._directionToOrder(direction));
          }
        }
        _getItemIndex(element) {
          return this._getItems().indexOf(element);
        }
        _setActiveIndicatorElement(index) {
          if (!this._indicatorsElement) {
            return;
          }
          const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
          activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
          activeIndicator.removeAttribute("aria-current");
          const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
          if (newActiveIndicator) {
            newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
            newActiveIndicator.setAttribute("aria-current", "true");
          }
        }
        _updateInterval() {
          const element = this._activeElement || this._getActive();
          if (!element) {
            return;
          }
          const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
          this._config.interval = elementInterval || this._config.defaultInterval;
        }
        _slide(order2, element = null) {
          if (this._isSliding) {
            return;
          }
          const activeElement = this._getActive();
          const isNext = order2 === ORDER_NEXT;
          const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
          if (nextElement === activeElement) {
            return;
          }
          const nextElementIndex = this._getItemIndex(nextElement);
          const triggerEvent = (eventName) => {
            return EventHandler.trigger(this._element, eventName, {
              relatedTarget: nextElement,
              direction: this._orderToDirection(order2),
              from: this._getItemIndex(activeElement),
              to: nextElementIndex
            });
          };
          const slideEvent = triggerEvent(EVENT_SLIDE);
          if (slideEvent.defaultPrevented) {
            return;
          }
          if (!activeElement || !nextElement) {
            return;
          }
          const isCycling = Boolean(this._interval);
          this.pause();
          this._isSliding = true;
          this._setActiveIndicatorElement(nextElementIndex);
          this._activeElement = nextElement;
          const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
          const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
          nextElement.classList.add(orderClassName);
          reflow(nextElement);
          activeElement.classList.add(directionalClassName);
          nextElement.classList.add(directionalClassName);
          const completeCallBack = () => {
            nextElement.classList.remove(directionalClassName, orderClassName);
            nextElement.classList.add(CLASS_NAME_ACTIVE$2);
            activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
            this._isSliding = false;
            triggerEvent(EVENT_SLID);
          };
          this._queueCallback(completeCallBack, activeElement, this._isAnimated());
          if (isCycling) {
            this.cycle();
          }
        }
        _isAnimated() {
          return this._element.classList.contains(CLASS_NAME_SLIDE);
        }
        _getActive() {
          return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
        }
        _getItems() {
          return SelectorEngine.find(SELECTOR_ITEM, this._element);
        }
        _clearInterval() {
          if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
          }
        }
        _directionToOrder(direction) {
          if (isRTL()) {
            return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
          }
          return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
        }
        _orderToDirection(order2) {
          if (isRTL()) {
            return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }
          return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Carousel.getOrCreateInstance(this, config2);
            if (typeof config2 === "number") {
              data.to(config2);
              return;
            }
            if (typeof config2 === "string") {
              if (data[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
                throw new TypeError(`No method named "${config2}"`);
              }
              data[config2]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function(event2) {
        const target = SelectorEngine.getElementFromSelector(this);
        if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
          return;
        }
        event2.preventDefault();
        const carousel = Carousel.getOrCreateInstance(target);
        const slideIndex = this.getAttribute("data-bs-slide-to");
        if (slideIndex) {
          carousel.to(slideIndex);
          carousel._maybeEnableCycle();
          return;
        }
        if (Manipulator.getDataAttribute(this, "slide") === "next") {
          carousel.next();
          carousel._maybeEnableCycle();
          return;
        }
        carousel.prev();
        carousel._maybeEnableCycle();
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
        const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
        for (const carousel of carousels) {
          Carousel.getOrCreateInstance(carousel);
        }
      });
      defineJQueryPlugin(Carousel);
      const NAME$b = "collapse";
      const DATA_KEY$7 = "bs.collapse";
      const EVENT_KEY$7 = `.${DATA_KEY$7}`;
      const DATA_API_KEY$4 = ".data-api";
      const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
      const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
      const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
      const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
      const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
      const CLASS_NAME_SHOW$7 = "show";
      const CLASS_NAME_COLLAPSE = "collapse";
      const CLASS_NAME_COLLAPSING = "collapsing";
      const CLASS_NAME_COLLAPSED = "collapsed";
      const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
      const CLASS_NAME_HORIZONTAL = "collapse-horizontal";
      const WIDTH = "width";
      const HEIGHT = "height";
      const SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
      const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
      const Default$a = {
        parent: null,
        toggle: true
      };
      const DefaultType$a = {
        parent: "(null|element)",
        toggle: "boolean"
      };
      class Collapse extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._isTransitioning = false;
          this._triggerArray = [];
          const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
          for (const elem of toggleList) {
            const selector = SelectorEngine.getSelectorFromElement(elem);
            const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
            if (selector !== null && filterElement.length) {
              this._triggerArray.push(elem);
            }
          }
          this._initializeChildren();
          if (!this._config.parent) {
            this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
          }
          if (this._config.toggle) {
            this.toggle();
          }
        }
        // Getters
        static get Default() {
          return Default$a;
        }
        static get DefaultType() {
          return DefaultType$a;
        }
        static get NAME() {
          return NAME$b;
        }
        // Public
        toggle() {
          if (this._isShown()) {
            this.hide();
          } else {
            this.show();
          }
        }
        show() {
          if (this._isTransitioning || this._isShown()) {
            return;
          }
          let activeChildren = [];
          if (this._config.parent) {
            activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => Collapse.getOrCreateInstance(element, {
              toggle: false
            }));
          }
          if (activeChildren.length && activeChildren[0]._isTransitioning) {
            return;
          }
          const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
          if (startEvent.defaultPrevented) {
            return;
          }
          for (const activeInstance of activeChildren) {
            activeInstance.hide();
          }
          const dimension = this._getDimension();
          this._element.classList.remove(CLASS_NAME_COLLAPSE);
          this._element.classList.add(CLASS_NAME_COLLAPSING);
          this._element.style[dimension] = 0;
          this._addAriaAndCollapsedClass(this._triggerArray, true);
          this._isTransitioning = true;
          const complete = () => {
            this._isTransitioning = false;
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
            this._element.style[dimension] = "";
            EventHandler.trigger(this._element, EVENT_SHOWN$6);
          };
          const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
          const scrollSize = `scroll${capitalizedDimension}`;
          this._queueCallback(complete, this._element, true);
          this._element.style[dimension] = `${this._element[scrollSize]}px`;
        }
        hide() {
          if (this._isTransitioning || !this._isShown()) {
            return;
          }
          const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
          if (startEvent.defaultPrevented) {
            return;
          }
          const dimension = this._getDimension();
          this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_COLLAPSING);
          this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
          for (const trigger2 of this._triggerArray) {
            const element = SelectorEngine.getElementFromSelector(trigger2);
            if (element && !this._isShown(element)) {
              this._addAriaAndCollapsedClass([trigger2], false);
            }
          }
          this._isTransitioning = true;
          const complete = () => {
            this._isTransitioning = false;
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE);
            EventHandler.trigger(this._element, EVENT_HIDDEN$6);
          };
          this._element.style[dimension] = "";
          this._queueCallback(complete, this._element, true);
        }
        _isShown(element = this._element) {
          return element.classList.contains(CLASS_NAME_SHOW$7);
        }
        // Private
        _configAfterMerge(config2) {
          config2.toggle = Boolean(config2.toggle);
          config2.parent = getElement(config2.parent);
          return config2;
        }
        _getDimension() {
          return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
        }
        _initializeChildren() {
          if (!this._config.parent) {
            return;
          }
          const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
          for (const element of children) {
            const selected = SelectorEngine.getElementFromSelector(element);
            if (selected) {
              this._addAriaAndCollapsedClass([element], this._isShown(selected));
            }
          }
        }
        _getFirstLevelChildren(selector) {
          const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
          return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
        }
        _addAriaAndCollapsedClass(triggerArray, isOpen) {
          if (!triggerArray.length) {
            return;
          }
          for (const element of triggerArray) {
            element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
            element.setAttribute("aria-expanded", isOpen);
          }
        }
        // Static
        static jQueryInterface(config2) {
          const _config = {};
          if (typeof config2 === "string" && /show|hide/.test(config2)) {
            _config.toggle = false;
          }
          return this.each(function() {
            const data = Collapse.getOrCreateInstance(this, _config);
            if (typeof config2 === "string") {
              if (typeof data[config2] === "undefined") {
                throw new TypeError(`No method named "${config2}"`);
              }
              data[config2]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event2) {
        if (event2.target.tagName === "A" || event2.delegateTarget && event2.delegateTarget.tagName === "A") {
          event2.preventDefault();
        }
        for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
          Collapse.getOrCreateInstance(element, {
            toggle: false
          }).toggle();
        }
      });
      defineJQueryPlugin(Collapse);
      var top = "top";
      var bottom = "bottom";
      var right = "right";
      var left = "left";
      var auto = "auto";
      var basePlacements = [top, bottom, right, left];
      var start = "start";
      var end = "end";
      var clippingParents = "clippingParents";
      var viewport = "viewport";
      var popper = "popper";
      var reference = "reference";
      var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
        return acc.concat([placement + "-" + start, placement + "-" + end]);
      }, []);
      var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
        return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
      }, []);
      var beforeRead = "beforeRead";
      var read = "read";
      var afterRead = "afterRead";
      var beforeMain = "beforeMain";
      var main = "main";
      var afterMain = "afterMain";
      var beforeWrite = "beforeWrite";
      var write = "write";
      var afterWrite = "afterWrite";
      var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
      function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
      }
      function getWindow(node) {
        if (node == null) {
          return window;
        }
        if (node.toString() !== "[object Window]") {
          var ownerDocument = node.ownerDocument;
          return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
      }
      function isElement(node) {
        var OwnElement = getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
      }
      function isHTMLElement(node) {
        var OwnElement = getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
      }
      function isShadowRoot(node) {
        if (typeof ShadowRoot === "undefined") {
          return false;
        }
        var OwnElement = getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
      }
      function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach(function(name) {
          var style = state.styles[name] || {};
          var attributes = state.attributes[name] || {};
          var element = state.elements[name];
          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }
          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function(name2) {
            var value = attributes[name2];
            if (value === false) {
              element.removeAttribute(name2);
            } else {
              element.setAttribute(name2, value === true ? "" : value);
            }
          });
        });
      }
      function effect$2(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
          popper: {
            position: state.options.strategy,
            left: "0",
            top: "0",
            margin: "0"
          },
          arrow: {
            position: "absolute"
          },
          reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) {
          Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
        return function() {
          Object.keys(state.elements).forEach(function(name) {
            var element = state.elements[name];
            var attributes = state.attributes[name] || {};
            var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
            var style = styleProperties.reduce(function(style2, property) {
              style2[property] = "";
              return style2;
            }, {});
            if (!isHTMLElement(element) || !getNodeName(element)) {
              return;
            }
            Object.assign(element.style, style);
            Object.keys(attributes).forEach(function(attribute) {
              element.removeAttribute(attribute);
            });
          });
        };
      }
      const applyStyles$1 = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: effect$2,
        requires: ["computeStyles"]
      };
      function getBasePlacement(placement) {
        return placement.split("-")[0];
      }
      var max = Math.max;
      var min = Math.min;
      var round = Math.round;
      function getUAString() {
        var uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
          return uaData.brands.map(function(item) {
            return item.brand + "/" + item.version;
          }).join(" ");
        }
        return navigator.userAgent;
      }
      function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
      }
      function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        if (includeScale === void 0) {
          includeScale = false;
        }
        if (isFixedStrategy === void 0) {
          isFixedStrategy = false;
        }
        var clientRect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
          scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
          scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
        }
        var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
          width,
          height,
          top: y,
          right: x + width,
          bottom: y + height,
          left: x,
          x,
          y
        };
      }
      function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) {
          width = clientRect.width;
        }
        if (Math.abs(clientRect.height - height) <= 1) {
          height = clientRect.height;
        }
        return {
          x: element.offsetLeft,
          y: element.offsetTop,
          width,
          height
        };
      }
      function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) {
          return true;
        } else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;
          do {
            if (next && parent.isSameNode(next)) {
              return true;
            }
            next = next.parentNode || next.host;
          } while (next);
        }
        return false;
      }
      function getComputedStyle$1(element) {
        return getWindow(element).getComputedStyle(element);
      }
      function isTableElement(element) {
        return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
      }
      function getDocumentElement(element) {
        return ((isElement(element) ? element.ownerDocument : (
          // $FlowFixMe[prop-missing]
          element.document
        )) || window.document).documentElement;
      }
      function getParentNode(element) {
        if (getNodeName(element) === "html") {
          return element;
        }
        return (
          // this is a quicker (but less type safe) way to save quite some bytes from the bundle
          // $FlowFixMe[incompatible-return]
          // $FlowFixMe[prop-missing]
          element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
          element.parentNode || // DOM Element detected
          (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
          // $FlowFixMe[incompatible-call]: HTMLElement is a Node
          getDocumentElement(element)
        );
      }
      function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
        getComputedStyle$1(element).position === "fixed") {
          return null;
        }
        return element.offsetParent;
      }
      function getContainingBlock(element) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element)) {
          var elementCss = getComputedStyle$1(element);
          if (elementCss.position === "fixed") {
            return null;
          }
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) {
          currentNode = currentNode.host;
        }
        while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
          var css = getComputedStyle$1(currentNode);
          if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
            return currentNode;
          } else {
            currentNode = currentNode.parentNode;
          }
        }
        return null;
      }
      function getOffsetParent(element) {
        var window2 = getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
          offsetParent = getTrueOffsetParent(offsetParent);
        }
        if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
          return window2;
        }
        return offsetParent || getContainingBlock(element) || window2;
      }
      function getMainAxisFromPlacement(placement) {
        return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
      }
      function within(min$1, value, max$1) {
        return max(min$1, min(value, max$1));
      }
      function withinMaxClamp(min2, value, max2) {
        var v = within(min2, value, max2);
        return v > max2 ? max2 : v;
      }
      function getFreshSideObject() {
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      }
      function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
      }
      function expandToHashMap(value, keys) {
        return keys.reduce(function(hashMap, key) {
          hashMap[key] = value;
          return hashMap;
        }, {});
      }
      var toPaddingObject = function toPaddingObject2(padding, state) {
        padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
          placement: state.placement
        })) : padding;
        return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
      };
      function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [left, right].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets2) {
          return;
        }
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = axis === "y" ? top : left;
        var maxProp = axis === "y" ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
        var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min2 = paddingObject[minProp];
        var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset2 = within(min2, center, max2);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
      }
      function effect$1(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
        if (arrowElement == null) {
          return;
        }
        if (typeof arrowElement === "string") {
          arrowElement = state.elements.popper.querySelector(arrowElement);
          if (!arrowElement) {
            return;
          }
        }
        if (!contains(state.elements.popper, arrowElement)) {
          return;
        }
        state.elements.arrow = arrowElement;
      }
      const arrow$1 = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: effect$1,
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"]
      };
      function getVariation(placement) {
        return placement.split("-")[1];
      }
      var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
      };
      function roundOffsetsByDPR(_ref, win) {
        var x = _ref.x, y = _ref.y;
        var dpr = win.devicePixelRatio || 1;
        return {
          x: round(x * dpr) / dpr || 0,
          y: round(y * dpr) / dpr || 0
        };
      }
      function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
        var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
          x,
          y
        }) : {
          x,
          y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = top;
        var win = window;
        if (adaptive) {
          var offsetParent = getOffsetParent(popper2);
          var heightProp = "clientHeight";
          var widthProp = "clientWidth";
          if (offsetParent === getWindow(popper2)) {
            offsetParent = getDocumentElement(popper2);
            if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
              heightProp = "scrollHeight";
              widthProp = "scrollWidth";
            }
          }
          offsetParent = offsetParent;
          if (placement === top || (placement === left || placement === right) && variation === end) {
            sideY = bottom;
            var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
              // $FlowFixMe[prop-missing]
              offsetParent[heightProp]
            );
            y -= offsetY - popperRect.height;
            y *= gpuAcceleration ? 1 : -1;
          }
          if (placement === left || (placement === top || placement === bottom) && variation === end) {
            sideX = right;
            var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
              // $FlowFixMe[prop-missing]
              offsetParent[widthProp]
            );
            x -= offsetX - popperRect.width;
            x *= gpuAcceleration ? 1 : -1;
          }
        }
        var commonStyles = Object.assign({
          position
        }, adaptive && unsetSides);
        var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
          x,
          y
        }, getWindow(popper2)) : {
          x,
          y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
          var _Object$assign;
          return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
      }
      function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
        var commonStyles = {
          placement: getBasePlacement(state.placement),
          variation: getVariation(state.placement),
          popper: state.elements.popper,
          popperRect: state.rects.popper,
          gpuAcceleration,
          isFixed: state.options.strategy === "fixed"
        };
        if (state.modifiersData.popperOffsets != null) {
          state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
          })));
        }
        if (state.modifiersData.arrow != null) {
          state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
          })));
        }
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-placement": state.placement
        });
      }
      const computeStyles$1 = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
      };
      var passive = {
        passive: true
      };
      function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
        var window2 = getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) {
          scrollParents.forEach(function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
          });
        }
        if (resize) {
          window2.addEventListener("resize", instance.update, passive);
        }
        return function() {
          if (scroll) {
            scrollParents.forEach(function(scrollParent) {
              scrollParent.removeEventListener("scroll", instance.update, passive);
            });
          }
          if (resize) {
            window2.removeEventListener("resize", instance.update, passive);
          }
        };
      }
      const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {
        },
        effect,
        data: {}
      };
      var hash$1 = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
      };
      function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, function(matched) {
          return hash$1[matched];
        });
      }
      var hash = {
        start: "end",
        end: "start"
      };
      function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, function(matched) {
          return hash[matched];
        });
      }
      function getWindowScroll(node) {
        var win = getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
          scrollLeft,
          scrollTop
        };
      }
      function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
      }
      function getViewportRect(element, strategy) {
        var win = getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
          width = visualViewport.width;
          height = visualViewport.height;
          var layoutViewport = isLayoutViewport();
          if (layoutViewport || !layoutViewport && strategy === "fixed") {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
          }
        }
        return {
          width,
          height,
          x: x + getWindowScrollBarX(element),
          y
        };
      }
      function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
        var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if (getComputedStyle$1(body || html).direction === "rtl") {
          x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
        }
        return {
          width,
          height,
          x,
          y
        };
      }
      function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
      }
      function getScrollParent(node) {
        if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
          return node.ownerDocument.body;
        }
        if (isHTMLElement(node) && isScrollParent(node)) {
          return node;
        }
        return getScrollParent(getParentNode(node));
      }
      function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (list === void 0) {
          list = [];
        }
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
        var win = getWindow(scrollParent);
        var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : (
          // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
          updatedList.concat(listScrollParents(getParentNode(target)))
        );
      }
      function rectToClientRect(rect) {
        return Object.assign({}, rect, {
          left: rect.x,
          top: rect.y,
          right: rect.x + rect.width,
          bottom: rect.y + rect.height
        });
      }
      function getInnerBoundingClientRect(element, strategy) {
        var rect = getBoundingClientRect(element, false, strategy === "fixed");
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
      }
      function getClientRectFromMixedType(element, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
      }
      function getClippingParents(element) {
        var clippingParents2 = listScrollParents(getParentNode(element));
        var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) {
          return [];
        }
        return clippingParents2.filter(function(clippingParent) {
          return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
        });
      }
      function getClippingRect(element, boundary, rootBoundary, strategy) {
        var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
        var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
        var firstClippingParent = clippingParents2[0];
        var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
          var rect = getClientRectFromMixedType(element, clippingParent, strategy);
          accRect.top = max(rect.top, accRect.top);
          accRect.right = min(rect.right, accRect.right);
          accRect.bottom = min(rect.bottom, accRect.bottom);
          accRect.left = max(rect.left, accRect.left);
          return accRect;
        }, getClientRectFromMixedType(element, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
      }
      function computeOffsets(_ref) {
        var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference2.x + reference2.width / 2 - element.width / 2;
        var commonY = reference2.y + reference2.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case top:
            offsets = {
              x: commonX,
              y: reference2.y - element.height
            };
            break;
          case bottom:
            offsets = {
              x: commonX,
              y: reference2.y + reference2.height
            };
            break;
          case right:
            offsets = {
              x: reference2.x + reference2.width,
              y: commonY
            };
            break;
          case left:
            offsets = {
              x: reference2.x - element.width,
              y: commonY
            };
            break;
          default:
            offsets = {
              x: reference2.x,
              y: reference2.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
          var len = mainAxis === "y" ? "height" : "width";
          switch (variation) {
            case start:
              offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
              break;
            case end:
              offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
              break;
          }
        }
        return offsets;
      }
      function detectOverflow(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
        var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets2 = computeOffsets({
          reference: referenceClientRect,
          element: popperRect,
          placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
          top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
          bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
          left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
          right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
          var offset2 = offsetData[placement];
          Object.keys(overflowOffsets).forEach(function(key) {
            var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
            var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
            overflowOffsets[key] += offset2[axis] * multiply;
          });
        }
        return overflowOffsets;
      }
      function computeAutoPlacement(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
          return getVariation(placement2) === variation;
        }) : basePlacements;
        var allowedPlacements = placements$1.filter(function(placement2) {
          return allowedAutoPlacements.indexOf(placement2) >= 0;
        });
        if (allowedPlacements.length === 0) {
          allowedPlacements = placements$1;
        }
        var overflows = allowedPlacements.reduce(function(acc, placement2) {
          acc[placement2] = detectOverflow(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding
          })[getBasePlacement(placement2)];
          return acc;
        }, {});
        return Object.keys(overflows).sort(function(a, b) {
          return overflows[a] - overflows[b];
        });
      }
      function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) {
          return [];
        }
        var oppositePlacement = getOppositePlacement(placement);
        return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
      }
      function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) {
          return;
        }
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
        var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
          return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding,
            flipVariations,
            allowedAutoPlacements
          }) : placement2);
        }, []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = /* @__PURE__ */ new Map();
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements2[0];
        for (var i = 0; i < placements2.length; i++) {
          var placement = placements2[i];
          var _basePlacement = getBasePlacement(placement);
          var isStartVariation = getVariation(placement) === start;
          var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
          var len = isVertical ? "width" : "height";
          var overflow = detectOverflow(state, {
            placement,
            boundary,
            rootBoundary,
            altBoundary,
            padding
          });
          var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
          if (referenceRect[len] > popperRect[len]) {
            mainVariationSide = getOppositePlacement(mainVariationSide);
          }
          var altVariationSide = getOppositePlacement(mainVariationSide);
          var checks = [];
          if (checkMainAxis) {
            checks.push(overflow[_basePlacement] <= 0);
          }
          if (checkAltAxis) {
            checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
          }
          if (checks.every(function(check) {
            return check;
          })) {
            firstFittingPlacement = placement;
            makeFallbackChecks = false;
            break;
          }
          checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
          var numberOfChecks = flipVariations ? 3 : 1;
          var _loop = function _loop2(_i2) {
            var fittingPlacement = placements2.find(function(placement2) {
              var checks2 = checksMap.get(placement2);
              if (checks2) {
                return checks2.slice(0, _i2).every(function(check) {
                  return check;
                });
              }
            });
            if (fittingPlacement) {
              firstFittingPlacement = fittingPlacement;
              return "break";
            }
          };
          for (var _i = numberOfChecks; _i > 0; _i--) {
            var _ret = _loop(_i);
            if (_ret === "break") break;
          }
        }
        if (state.placement !== firstFittingPlacement) {
          state.modifiersData[name]._skip = true;
          state.placement = firstFittingPlacement;
          state.reset = true;
        }
      }
      const flip$1 = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: ["offset"],
        data: {
          _skip: false
        }
      };
      function getSideOffsets(overflow, rect, preventedOffsets) {
        if (preventedOffsets === void 0) {
          preventedOffsets = {
            x: 0,
            y: 0
          };
        }
        return {
          top: overflow.top - rect.height - preventedOffsets.y,
          right: overflow.right - rect.width + preventedOffsets.x,
          bottom: overflow.bottom - rect.height + preventedOffsets.y,
          left: overflow.left - rect.width - preventedOffsets.x
        };
      }
      function isAnySideFullyClipped(overflow) {
        return [top, right, bottom, left].some(function(side) {
          return overflow[side] >= 0;
        });
      }
      function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
          elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
          altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
          referenceClippingOffsets,
          popperEscapeOffsets,
          isReferenceHidden,
          hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-reference-hidden": isReferenceHidden,
          "data-popper-escaped": hasPopperEscaped
        });
      }
      const hide$1 = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: hide
      };
      function distanceAndSkiddingToXY(placement, rects, offset2) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
          placement
        })) : offset2, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [left, right].indexOf(basePlacement) >= 0 ? {
          x: distance,
          y: skidding
        } : {
          x: skidding,
          y: distance
        };
      }
      function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
        var data = placements.reduce(function(acc, placement) {
          acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
          return acc;
        }, {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (state.modifiersData.popperOffsets != null) {
          state.modifiersData.popperOffsets.x += x;
          state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
      }
      const offset$1 = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: ["popperOffsets"],
        fn: offset
      };
      function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
          reference: state.rects.reference,
          element: state.rects.popper,
          placement: state.placement
        });
      }
      const popperOffsets$1 = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
      };
      function getAltAxis(axis) {
        return axis === "x" ? "y" : "x";
      }
      function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
          boundary,
          rootBoundary,
          padding,
          altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
          placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
          mainAxis: tetherOffsetValue,
          altAxis: tetherOffsetValue
        } : Object.assign({
          mainAxis: 0,
          altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
          x: 0,
          y: 0
        };
        if (!popperOffsets2) {
          return;
        }
        if (checkMainAxis) {
          var _offsetModifierState$;
          var mainSide = mainAxis === "y" ? top : left;
          var altSide = mainAxis === "y" ? bottom : right;
          var len = mainAxis === "y" ? "height" : "width";
          var offset2 = popperOffsets2[mainAxis];
          var min$1 = offset2 + overflow[mainSide];
          var max$1 = offset2 - overflow[altSide];
          var additive = tether ? -popperRect[len] / 2 : 0;
          var minLen = variation === start ? referenceRect[len] : popperRect[len];
          var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
          var arrowElement = state.elements.arrow;
          var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
            width: 0,
            height: 0
          };
          var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
          var arrowPaddingMin = arrowPaddingObject[mainSide];
          var arrowPaddingMax = arrowPaddingObject[altSide];
          var arrowLen = within(0, referenceRect[len], arrowRect[len]);
          var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
          var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
          var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
          var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
          var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
          var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
          var tetherMax = offset2 + maxOffset - offsetModifierValue;
          var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
          popperOffsets2[mainAxis] = preventedOffset;
          data[mainAxis] = preventedOffset - offset2;
        }
        if (checkAltAxis) {
          var _offsetModifierState$2;
          var _mainSide = mainAxis === "x" ? top : left;
          var _altSide = mainAxis === "x" ? bottom : right;
          var _offset = popperOffsets2[altAxis];
          var _len = altAxis === "y" ? "height" : "width";
          var _min = _offset + overflow[_mainSide];
          var _max = _offset - overflow[_altSide];
          var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
          var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
          var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
          var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
          var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
          popperOffsets2[altAxis] = _preventedOffset;
          data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
      }
      const preventOverflow$1 = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: ["offset"]
      };
      function getHTMLElementScroll(element) {
        return {
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop
        };
      }
      function getNodeScroll(node) {
        if (node === getWindow(node) || !isHTMLElement(node)) {
          return getWindowScroll(node);
        } else {
          return getHTMLElementScroll(node);
        }
      }
      function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return scaleX !== 1 || scaleY !== 1;
      }
      function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (isFixed === void 0) {
          isFixed = false;
        }
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
          scrollLeft: 0,
          scrollTop: 0
        };
        var offsets = {
          x: 0,
          y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
          if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
          isScrollParent(documentElement)) {
            scroll = getNodeScroll(offsetParent);
          }
          if (isHTMLElement(offsetParent)) {
            offsets = getBoundingClientRect(offsetParent, true);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
          } else if (documentElement) {
            offsets.x = getWindowScrollBarX(documentElement);
          }
        }
        return {
          x: rect.left + scroll.scrollLeft - offsets.x,
          y: rect.top + scroll.scrollTop - offsets.y,
          width: rect.width,
          height: rect.height
        };
      }
      function order(modifiers) {
        var map = /* @__PURE__ */ new Map();
        var visited = /* @__PURE__ */ new Set();
        var result = [];
        modifiers.forEach(function(modifier) {
          map.set(modifier.name, modifier);
        });
        function sort(modifier) {
          visited.add(modifier.name);
          var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
          requires.forEach(function(dep) {
            if (!visited.has(dep)) {
              var depModifier = map.get(dep);
              if (depModifier) {
                sort(depModifier);
              }
            }
          });
          result.push(modifier);
        }
        modifiers.forEach(function(modifier) {
          if (!visited.has(modifier.name)) {
            sort(modifier);
          }
        });
        return result;
      }
      function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce(function(acc, phase) {
          return acc.concat(orderedModifiers.filter(function(modifier) {
            return modifier.phase === phase;
          }));
        }, []);
      }
      function debounce(fn) {
        var pending;
        return function() {
          if (!pending) {
            pending = new Promise(function(resolve2) {
              Promise.resolve().then(function() {
                pending = void 0;
                resolve2(fn());
              });
            });
          }
          return pending;
        };
      }
      function mergeByName(modifiers) {
        var merged = modifiers.reduce(function(merged2, current) {
          var existing = merged2[current.name];
          merged2[current.name] = existing ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data)
          }) : current;
          return merged2;
        }, {});
        return Object.keys(merged).map(function(key) {
          return merged[key];
        });
      }
      var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
      };
      function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return !args.some(function(element) {
          return !(element && typeof element.getBoundingClientRect === "function");
        });
      }
      function popperGenerator(generatorOptions) {
        if (generatorOptions === void 0) {
          generatorOptions = {};
        }
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper2(reference2, popper2, options) {
          if (options === void 0) {
            options = defaultOptions;
          }
          var state = {
            placement: "bottom",
            orderedModifiers: [],
            options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
            modifiersData: {},
            elements: {
              reference: reference2,
              popper: popper2
            },
            attributes: {},
            styles: {}
          };
          var effectCleanupFns = [];
          var isDestroyed = false;
          var instance = {
            state,
            setOptions: function setOptions(setOptionsAction) {
              var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
              cleanupModifierEffects();
              state.options = Object.assign({}, defaultOptions, state.options, options2);
              state.scrollParents = {
                reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
                popper: listScrollParents(popper2)
              };
              var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
              state.orderedModifiers = orderedModifiers.filter(function(m) {
                return m.enabled;
              });
              runModifierEffects();
              return instance.update();
            },
            // Sync update – it will always be executed, even if not necessary. This
            // is useful for low frequency updates where sync behavior simplifies the
            // logic.
            // For high frequency updates (e.g. `resize` and `scroll` events), always
            // prefer the async Popper#update method
            forceUpdate: function forceUpdate() {
              if (isDestroyed) {
                return;
              }
              var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
              if (!areValidElements(reference3, popper3)) {
                return;
              }
              state.rects = {
                reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
                popper: getLayoutRect(popper3)
              };
              state.reset = false;
              state.placement = state.options.placement;
              state.orderedModifiers.forEach(function(modifier) {
                return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
              });
              for (var index = 0; index < state.orderedModifiers.length; index++) {
                if (state.reset === true) {
                  state.reset = false;
                  index = -1;
                  continue;
                }
                var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                if (typeof fn === "function") {
                  state = fn({
                    state,
                    options: _options,
                    name,
                    instance
                  }) || state;
                }
              }
            },
            // Async and optimistically optimized update – it will not be executed if
            // not necessary (debounced to run at most once-per-tick)
            update: debounce(function() {
              return new Promise(function(resolve2) {
                instance.forceUpdate();
                resolve2(state);
              });
            }),
            destroy: function destroy() {
              cleanupModifierEffects();
              isDestroyed = true;
            }
          };
          if (!areValidElements(reference2, popper2)) {
            return instance;
          }
          instance.setOptions(options).then(function(state2) {
            if (!isDestroyed && options.onFirstUpdate) {
              options.onFirstUpdate(state2);
            }
          });
          function runModifierEffects() {
            state.orderedModifiers.forEach(function(_ref) {
              var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
              if (typeof effect2 === "function") {
                var cleanupFn = effect2({
                  state,
                  name,
                  instance,
                  options: options2
                });
                var noopFn = function noopFn2() {
                };
                effectCleanupFns.push(cleanupFn || noopFn);
              }
            });
          }
          function cleanupModifierEffects() {
            effectCleanupFns.forEach(function(fn) {
              return fn();
            });
            effectCleanupFns = [];
          }
          return instance;
        };
      }
      var createPopper$2 = /* @__PURE__ */ popperGenerator();
      var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
      var createPopper$1 = /* @__PURE__ */ popperGenerator({
        defaultModifiers: defaultModifiers$1
      });
      var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
      var createPopper = /* @__PURE__ */ popperGenerator({
        defaultModifiers
      });
      const Popper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        afterMain,
        afterRead,
        afterWrite,
        applyStyles: applyStyles$1,
        arrow: arrow$1,
        auto,
        basePlacements,
        beforeMain,
        beforeRead,
        beforeWrite,
        bottom,
        clippingParents,
        computeStyles: computeStyles$1,
        createPopper,
        createPopperBase: createPopper$2,
        createPopperLite: createPopper$1,
        detectOverflow,
        end,
        eventListeners,
        flip: flip$1,
        hide: hide$1,
        left,
        main,
        modifierPhases,
        offset: offset$1,
        placements,
        popper,
        popperGenerator,
        popperOffsets: popperOffsets$1,
        preventOverflow: preventOverflow$1,
        read,
        reference,
        right,
        start,
        top,
        variationPlacements,
        viewport,
        write
      }, Symbol.toStringTag, { value: "Module" }));
      const NAME$a = "dropdown";
      const DATA_KEY$6 = "bs.dropdown";
      const EVENT_KEY$6 = `.${DATA_KEY$6}`;
      const DATA_API_KEY$3 = ".data-api";
      const ESCAPE_KEY$2 = "Escape";
      const TAB_KEY$1 = "Tab";
      const ARROW_UP_KEY$1 = "ArrowUp";
      const ARROW_DOWN_KEY$1 = "ArrowDown";
      const RIGHT_MOUSE_BUTTON = 2;
      const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
      const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
      const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
      const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
      const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const CLASS_NAME_SHOW$6 = "show";
      const CLASS_NAME_DROPUP = "dropup";
      const CLASS_NAME_DROPEND = "dropend";
      const CLASS_NAME_DROPSTART = "dropstart";
      const CLASS_NAME_DROPUP_CENTER = "dropup-center";
      const CLASS_NAME_DROPDOWN_CENTER = "dropdown-center";
      const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
      const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
      const SELECTOR_MENU = ".dropdown-menu";
      const SELECTOR_NAVBAR = ".navbar";
      const SELECTOR_NAVBAR_NAV = ".navbar-nav";
      const SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
      const PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
      const PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
      const PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
      const PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
      const PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
      const PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
      const PLACEMENT_TOPCENTER = "top";
      const PLACEMENT_BOTTOMCENTER = "bottom";
      const Default$9 = {
        autoClose: true,
        boundary: "clippingParents",
        display: "dynamic",
        offset: [0, 2],
        popperConfig: null,
        reference: "toggle"
      };
      const DefaultType$9 = {
        autoClose: "(boolean|string)",
        boundary: "(string|element)",
        display: "string",
        offset: "(array|string|function)",
        popperConfig: "(null|object|function)",
        reference: "(string|element|object)"
      };
      class Dropdown extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._popper = null;
          this._parent = this._element.parentNode;
          this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
          this._inNavbar = this._detectNavbar();
        }
        // Getters
        static get Default() {
          return Default$9;
        }
        static get DefaultType() {
          return DefaultType$9;
        }
        static get NAME() {
          return NAME$a;
        }
        // Public
        toggle() {
          return this._isShown() ? this.hide() : this.show();
        }
        show() {
          if (isDisabled(this._element) || this._isShown()) {
            return;
          }
          const relatedTarget = {
            relatedTarget: this._element
          };
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
          if (showEvent.defaultPrevented) {
            return;
          }
          this._createPopper();
          if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.on(element, "mouseover", noop2);
            }
          }
          this._element.focus();
          this._element.setAttribute("aria-expanded", true);
          this._menu.classList.add(CLASS_NAME_SHOW$6);
          this._element.classList.add(CLASS_NAME_SHOW$6);
          EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
        }
        hide() {
          if (isDisabled(this._element) || !this._isShown()) {
            return;
          }
          const relatedTarget = {
            relatedTarget: this._element
          };
          this._completeHide(relatedTarget);
        }
        dispose() {
          if (this._popper) {
            this._popper.destroy();
          }
          super.dispose();
        }
        update() {
          this._inNavbar = this._detectNavbar();
          if (this._popper) {
            this._popper.update();
          }
        }
        // Private
        _completeHide(relatedTarget) {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
          if (hideEvent.defaultPrevented) {
            return;
          }
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.off(element, "mouseover", noop2);
            }
          }
          if (this._popper) {
            this._popper.destroy();
          }
          this._menu.classList.remove(CLASS_NAME_SHOW$6);
          this._element.classList.remove(CLASS_NAME_SHOW$6);
          this._element.setAttribute("aria-expanded", "false");
          Manipulator.removeDataAttribute(this._menu, "popper");
          EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
        }
        _getConfig(config2) {
          config2 = super._getConfig(config2);
          if (typeof config2.reference === "object" && !isElement$1(config2.reference) && typeof config2.reference.getBoundingClientRect !== "function") {
            throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
          }
          return config2;
        }
        _createPopper() {
          if (typeof Popper === "undefined") {
            throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
          }
          let referenceElement = this._element;
          if (this._config.reference === "parent") {
            referenceElement = this._parent;
          } else if (isElement$1(this._config.reference)) {
            referenceElement = getElement(this._config.reference);
          } else if (typeof this._config.reference === "object") {
            referenceElement = this._config.reference;
          }
          const popperConfig = this._getPopperConfig();
          this._popper = createPopper(referenceElement, this._menu, popperConfig);
        }
        _isShown() {
          return this._menu.classList.contains(CLASS_NAME_SHOW$6);
        }
        _getPlacement() {
          const parentDropdown = this._parent;
          if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
            return PLACEMENT_RIGHT;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
            return PLACEMENT_LEFT;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
            return PLACEMENT_TOPCENTER;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
            return PLACEMENT_BOTTOMCENTER;
          }
          const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
          if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
            return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
          }
          return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
        }
        _detectNavbar() {
          return this._element.closest(SELECTOR_NAVBAR) !== null;
        }
        _getOffset() {
          const {
            offset: offset2
          } = this._config;
          if (typeof offset2 === "string") {
            return offset2.split(",").map((value) => Number.parseInt(value, 10));
          }
          if (typeof offset2 === "function") {
            return (popperData) => offset2(popperData, this._element);
          }
          return offset2;
        }
        _getPopperConfig() {
          const defaultBsPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [{
              name: "preventOverflow",
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: "offset",
              options: {
                offset: this._getOffset()
              }
            }]
          };
          if (this._inNavbar || this._config.display === "static") {
            Manipulator.setDataAttribute(this._menu, "popper", "static");
            defaultBsPopperConfig.modifiers = [{
              name: "applyStyles",
              enabled: false
            }];
          }
          return {
            ...defaultBsPopperConfig,
            ...execute(this._config.popperConfig, [defaultBsPopperConfig])
          };
        }
        _selectMenuItem({
          key,
          target
        }) {
          const items2 = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => isVisible(element));
          if (!items2.length) {
            return;
          }
          getNextActiveElement(items2, target, key === ARROW_DOWN_KEY$1, !items2.includes(target)).focus();
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Dropdown.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (typeof data[config2] === "undefined") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2]();
          });
        }
        static clearMenus(event2) {
          if (event2.button === RIGHT_MOUSE_BUTTON || event2.type === "keyup" && event2.key !== TAB_KEY$1) {
            return;
          }
          const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
          for (const toggle of openToggles) {
            const context = Dropdown.getInstance(toggle);
            if (!context || context._config.autoClose === false) {
              continue;
            }
            const composedPath = event2.composedPath();
            const isMenuTarget = composedPath.includes(context._menu);
            if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) {
              continue;
            }
            if (context._menu.contains(event2.target) && (event2.type === "keyup" && event2.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event2.target.tagName))) {
              continue;
            }
            const relatedTarget = {
              relatedTarget: context._element
            };
            if (event2.type === "click") {
              relatedTarget.clickEvent = event2;
            }
            context._completeHide(relatedTarget);
          }
        }
        static dataApiKeydownHandler(event2) {
          const isInput = /input|textarea/i.test(event2.target.tagName);
          const isEscapeEvent = event2.key === ESCAPE_KEY$2;
          const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event2.key);
          if (!isUpOrDownEvent && !isEscapeEvent) {
            return;
          }
          if (isInput && !isEscapeEvent) {
            return;
          }
          event2.preventDefault();
          const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event2.delegateTarget.parentNode);
          const instance = Dropdown.getOrCreateInstance(getToggleButton);
          if (isUpOrDownEvent) {
            event2.stopPropagation();
            instance.show();
            instance._selectMenuItem(event2);
            return;
          }
          if (instance._isShown()) {
            event2.stopPropagation();
            instance.hide();
            getToggleButton.focus();
          }
        }
      }
      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event2) {
        event2.preventDefault();
        Dropdown.getOrCreateInstance(this).toggle();
      });
      defineJQueryPlugin(Dropdown);
      const NAME$9 = "backdrop";
      const CLASS_NAME_FADE$4 = "fade";
      const CLASS_NAME_SHOW$5 = "show";
      const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
      const Default$8 = {
        className: "modal-backdrop",
        clickCallback: null,
        isAnimated: false,
        isVisible: true,
        // if false, we use the backdrop helper without adding any element to the dom
        rootElement: "body"
        // give the choice to place backdrop under different elements
      };
      const DefaultType$8 = {
        className: "string",
        clickCallback: "(function|null)",
        isAnimated: "boolean",
        isVisible: "boolean",
        rootElement: "(element|string)"
      };
      class Backdrop extends Config {
        constructor(config2) {
          super();
          this._config = this._getConfig(config2);
          this._isAppended = false;
          this._element = null;
        }
        // Getters
        static get Default() {
          return Default$8;
        }
        static get DefaultType() {
          return DefaultType$8;
        }
        static get NAME() {
          return NAME$9;
        }
        // Public
        show(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }
          this._append();
          const element = this._getElement();
          if (this._config.isAnimated) {
            reflow(element);
          }
          element.classList.add(CLASS_NAME_SHOW$5);
          this._emulateAnimation(() => {
            execute(callback);
          });
        }
        hide(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }
          this._getElement().classList.remove(CLASS_NAME_SHOW$5);
          this._emulateAnimation(() => {
            this.dispose();
            execute(callback);
          });
        }
        dispose() {
          if (!this._isAppended) {
            return;
          }
          EventHandler.off(this._element, EVENT_MOUSEDOWN);
          this._element.remove();
          this._isAppended = false;
        }
        // Private
        _getElement() {
          if (!this._element) {
            const backdrop = document.createElement("div");
            backdrop.className = this._config.className;
            if (this._config.isAnimated) {
              backdrop.classList.add(CLASS_NAME_FADE$4);
            }
            this._element = backdrop;
          }
          return this._element;
        }
        _configAfterMerge(config2) {
          config2.rootElement = getElement(config2.rootElement);
          return config2;
        }
        _append() {
          if (this._isAppended) {
            return;
          }
          const element = this._getElement();
          this._config.rootElement.append(element);
          EventHandler.on(element, EVENT_MOUSEDOWN, () => {
            execute(this._config.clickCallback);
          });
          this._isAppended = true;
        }
        _emulateAnimation(callback) {
          executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
        }
      }
      const NAME$8 = "focustrap";
      const DATA_KEY$5 = "bs.focustrap";
      const EVENT_KEY$5 = `.${DATA_KEY$5}`;
      const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
      const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
      const TAB_KEY = "Tab";
      const TAB_NAV_FORWARD = "forward";
      const TAB_NAV_BACKWARD = "backward";
      const Default$7 = {
        autofocus: true,
        trapElement: null
        // The element to trap focus inside of
      };
      const DefaultType$7 = {
        autofocus: "boolean",
        trapElement: "element"
      };
      class FocusTrap extends Config {
        constructor(config2) {
          super();
          this._config = this._getConfig(config2);
          this._isActive = false;
          this._lastTabNavDirection = null;
        }
        // Getters
        static get Default() {
          return Default$7;
        }
        static get DefaultType() {
          return DefaultType$7;
        }
        static get NAME() {
          return NAME$8;
        }
        // Public
        activate() {
          if (this._isActive) {
            return;
          }
          if (this._config.autofocus) {
            this._config.trapElement.focus();
          }
          EventHandler.off(document, EVENT_KEY$5);
          EventHandler.on(document, EVENT_FOCUSIN$2, (event2) => this._handleFocusin(event2));
          EventHandler.on(document, EVENT_KEYDOWN_TAB, (event2) => this._handleKeydown(event2));
          this._isActive = true;
        }
        deactivate() {
          if (!this._isActive) {
            return;
          }
          this._isActive = false;
          EventHandler.off(document, EVENT_KEY$5);
        }
        // Private
        _handleFocusin(event2) {
          const {
            trapElement
          } = this._config;
          if (event2.target === document || event2.target === trapElement || trapElement.contains(event2.target)) {
            return;
          }
          const elements = SelectorEngine.focusableChildren(trapElement);
          if (elements.length === 0) {
            trapElement.focus();
          } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
            elements[elements.length - 1].focus();
          } else {
            elements[0].focus();
          }
        }
        _handleKeydown(event2) {
          if (event2.key !== TAB_KEY) {
            return;
          }
          this._lastTabNavDirection = event2.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
        }
      }
      const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
      const SELECTOR_STICKY_CONTENT = ".sticky-top";
      const PROPERTY_PADDING = "padding-right";
      const PROPERTY_MARGIN = "margin-right";
      class ScrollBarHelper {
        constructor() {
          this._element = document.body;
        }
        // Public
        getWidth() {
          const documentWidth = document.documentElement.clientWidth;
          return Math.abs(window.innerWidth - documentWidth);
        }
        hide() {
          const width = this.getWidth();
          this._disableOverFlow();
          this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
        }
        reset() {
          this._resetElementAttributes(this._element, "overflow");
          this._resetElementAttributes(this._element, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
        }
        isOverflowing() {
          return this.getWidth() > 0;
        }
        // Private
        _disableOverFlow() {
          this._saveInitialAttribute(this._element, "overflow");
          this._element.style.overflow = "hidden";
        }
        _setElementAttributes(selector, styleProperty, callback) {
          const scrollbarWidth = this.getWidth();
          const manipulationCallBack = (element) => {
            if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
              return;
            }
            this._saveInitialAttribute(element, styleProperty);
            const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
            element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
          };
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _saveInitialAttribute(element, styleProperty) {
          const actualValue = element.style.getPropertyValue(styleProperty);
          if (actualValue) {
            Manipulator.setDataAttribute(element, styleProperty, actualValue);
          }
        }
        _resetElementAttributes(selector, styleProperty) {
          const manipulationCallBack = (element) => {
            const value = Manipulator.getDataAttribute(element, styleProperty);
            if (value === null) {
              element.style.removeProperty(styleProperty);
              return;
            }
            Manipulator.removeDataAttribute(element, styleProperty);
            element.style.setProperty(styleProperty, value);
          };
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _applyManipulationCallback(selector, callBack) {
          if (isElement$1(selector)) {
            callBack(selector);
            return;
          }
          for (const sel of SelectorEngine.find(selector, this._element)) {
            callBack(sel);
          }
        }
      }
      const NAME$7 = "modal";
      const DATA_KEY$4 = "bs.modal";
      const EVENT_KEY$4 = `.${DATA_KEY$4}`;
      const DATA_API_KEY$2 = ".data-api";
      const ESCAPE_KEY$1 = "Escape";
      const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
      const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
      const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
      const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
      const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
      const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
      const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
      const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
      const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
      const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
      const CLASS_NAME_OPEN = "modal-open";
      const CLASS_NAME_FADE$3 = "fade";
      const CLASS_NAME_SHOW$4 = "show";
      const CLASS_NAME_STATIC = "modal-static";
      const OPEN_SELECTOR$1 = ".modal.show";
      const SELECTOR_DIALOG = ".modal-dialog";
      const SELECTOR_MODAL_BODY = ".modal-body";
      const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
      const Default$6 = {
        backdrop: true,
        focus: true,
        keyboard: true
      };
      const DefaultType$6 = {
        backdrop: "(boolean|string)",
        focus: "boolean",
        keyboard: "boolean"
      };
      class Modal extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();
          this._isShown = false;
          this._isTransitioning = false;
          this._scrollBar = new ScrollBarHelper();
          this._addEventListeners();
        }
        // Getters
        static get Default() {
          return Default$6;
        }
        static get DefaultType() {
          return DefaultType$6;
        }
        static get NAME() {
          return NAME$7;
        }
        // Public
        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }
        show(relatedTarget) {
          if (this._isShown || this._isTransitioning) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
            relatedTarget
          });
          if (showEvent.defaultPrevented) {
            return;
          }
          this._isShown = true;
          this._isTransitioning = true;
          this._scrollBar.hide();
          document.body.classList.add(CLASS_NAME_OPEN);
          this._adjustDialog();
          this._backdrop.show(() => this._showElement(relatedTarget));
        }
        hide() {
          if (!this._isShown || this._isTransitioning) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
          if (hideEvent.defaultPrevented) {
            return;
          }
          this._isShown = false;
          this._isTransitioning = true;
          this._focustrap.deactivate();
          this._element.classList.remove(CLASS_NAME_SHOW$4);
          this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
        }
        dispose() {
          EventHandler.off(window, EVENT_KEY$4);
          EventHandler.off(this._dialog, EVENT_KEY$4);
          this._backdrop.dispose();
          this._focustrap.deactivate();
          super.dispose();
        }
        handleUpdate() {
          this._adjustDialog();
        }
        // Private
        _initializeBackDrop() {
          return new Backdrop({
            isVisible: Boolean(this._config.backdrop),
            // 'static' option will be translated to true, and booleans will keep their value,
            isAnimated: this._isAnimated()
          });
        }
        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }
        _showElement(relatedTarget) {
          if (!document.body.contains(this._element)) {
            document.body.append(this._element);
          }
          this._element.style.display = "block";
          this._element.removeAttribute("aria-hidden");
          this._element.setAttribute("aria-modal", true);
          this._element.setAttribute("role", "dialog");
          this._element.scrollTop = 0;
          const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
          if (modalBody) {
            modalBody.scrollTop = 0;
          }
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_SHOW$4);
          const transitionComplete = () => {
            if (this._config.focus) {
              this._focustrap.activate();
            }
            this._isTransitioning = false;
            EventHandler.trigger(this._element, EVENT_SHOWN$4, {
              relatedTarget
            });
          };
          this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
        }
        _addEventListeners() {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event2) => {
            if (event2.key !== ESCAPE_KEY$1) {
              return;
            }
            if (this._config.keyboard) {
              this.hide();
              return;
            }
            this._triggerBackdropTransition();
          });
          EventHandler.on(window, EVENT_RESIZE$1, () => {
            if (this._isShown && !this._isTransitioning) {
              this._adjustDialog();
            }
          });
          EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event2) => {
            EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event22) => {
              if (this._element !== event2.target || this._element !== event22.target) {
                return;
              }
              if (this._config.backdrop === "static") {
                this._triggerBackdropTransition();
                return;
              }
              if (this._config.backdrop) {
                this.hide();
              }
            });
          });
        }
        _hideModal() {
          this._element.style.display = "none";
          this._element.setAttribute("aria-hidden", true);
          this._element.removeAttribute("aria-modal");
          this._element.removeAttribute("role");
          this._isTransitioning = false;
          this._backdrop.hide(() => {
            document.body.classList.remove(CLASS_NAME_OPEN);
            this._resetAdjustments();
            this._scrollBar.reset();
            EventHandler.trigger(this._element, EVENT_HIDDEN$4);
          });
        }
        _isAnimated() {
          return this._element.classList.contains(CLASS_NAME_FADE$3);
        }
        _triggerBackdropTransition() {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
          if (hideEvent.defaultPrevented) {
            return;
          }
          const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
          const initialOverflowY = this._element.style.overflowY;
          if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) {
            return;
          }
          if (!isModalOverflowing) {
            this._element.style.overflowY = "hidden";
          }
          this._element.classList.add(CLASS_NAME_STATIC);
          this._queueCallback(() => {
            this._element.classList.remove(CLASS_NAME_STATIC);
            this._queueCallback(() => {
              this._element.style.overflowY = initialOverflowY;
            }, this._dialog);
          }, this._dialog);
          this._element.focus();
        }
        /**
         * The following methods are used to handle overflowing modals
         */
        _adjustDialog() {
          const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
          const scrollbarWidth = this._scrollBar.getWidth();
          const isBodyOverflowing = scrollbarWidth > 0;
          if (isBodyOverflowing && !isModalOverflowing) {
            const property = isRTL() ? "paddingLeft" : "paddingRight";
            this._element.style[property] = `${scrollbarWidth}px`;
          }
          if (!isBodyOverflowing && isModalOverflowing) {
            const property = isRTL() ? "paddingRight" : "paddingLeft";
            this._element.style[property] = `${scrollbarWidth}px`;
          }
        }
        _resetAdjustments() {
          this._element.style.paddingLeft = "";
          this._element.style.paddingRight = "";
        }
        // Static
        static jQueryInterface(config2, relatedTarget) {
          return this.each(function() {
            const data = Modal.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (typeof data[config2] === "undefined") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2](relatedTarget);
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event2) {
        const target = SelectorEngine.getElementFromSelector(this);
        if (["A", "AREA"].includes(this.tagName)) {
          event2.preventDefault();
        }
        EventHandler.one(target, EVENT_SHOW$4, (showEvent) => {
          if (showEvent.defaultPrevented) {
            return;
          }
          EventHandler.one(target, EVENT_HIDDEN$4, () => {
            if (isVisible(this)) {
              this.focus();
            }
          });
        });
        const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
        if (alreadyOpen) {
          Modal.getInstance(alreadyOpen).hide();
        }
        const data = Modal.getOrCreateInstance(target);
        data.toggle(this);
      });
      enableDismissTrigger(Modal);
      defineJQueryPlugin(Modal);
      const NAME$6 = "offcanvas";
      const DATA_KEY$3 = "bs.offcanvas";
      const EVENT_KEY$3 = `.${DATA_KEY$3}`;
      const DATA_API_KEY$1 = ".data-api";
      const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
      const ESCAPE_KEY = "Escape";
      const CLASS_NAME_SHOW$3 = "show";
      const CLASS_NAME_SHOWING$1 = "showing";
      const CLASS_NAME_HIDING = "hiding";
      const CLASS_NAME_BACKDROP = "offcanvas-backdrop";
      const OPEN_SELECTOR = ".offcanvas.show";
      const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
      const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
      const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
      const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
      const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
      const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
      const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
      const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
      const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
      const Default$5 = {
        backdrop: true,
        keyboard: true,
        scroll: false
      };
      const DefaultType$5 = {
        backdrop: "(boolean|string)",
        keyboard: "boolean",
        scroll: "boolean"
      };
      class Offcanvas extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._isShown = false;
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();
          this._addEventListeners();
        }
        // Getters
        static get Default() {
          return Default$5;
        }
        static get DefaultType() {
          return DefaultType$5;
        }
        static get NAME() {
          return NAME$6;
        }
        // Public
        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }
        show(relatedTarget) {
          if (this._isShown) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
            relatedTarget
          });
          if (showEvent.defaultPrevented) {
            return;
          }
          this._isShown = true;
          this._backdrop.show();
          if (!this._config.scroll) {
            new ScrollBarHelper().hide();
          }
          this._element.setAttribute("aria-modal", true);
          this._element.setAttribute("role", "dialog");
          this._element.classList.add(CLASS_NAME_SHOWING$1);
          const completeCallBack = () => {
            if (!this._config.scroll || this._config.backdrop) {
              this._focustrap.activate();
            }
            this._element.classList.add(CLASS_NAME_SHOW$3);
            this._element.classList.remove(CLASS_NAME_SHOWING$1);
            EventHandler.trigger(this._element, EVENT_SHOWN$3, {
              relatedTarget
            });
          };
          this._queueCallback(completeCallBack, this._element, true);
        }
        hide() {
          if (!this._isShown) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
          if (hideEvent.defaultPrevented) {
            return;
          }
          this._focustrap.deactivate();
          this._element.blur();
          this._isShown = false;
          this._element.classList.add(CLASS_NAME_HIDING);
          this._backdrop.hide();
          const completeCallback = () => {
            this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
            this._element.removeAttribute("aria-modal");
            this._element.removeAttribute("role");
            if (!this._config.scroll) {
              new ScrollBarHelper().reset();
            }
            EventHandler.trigger(this._element, EVENT_HIDDEN$3);
          };
          this._queueCallback(completeCallback, this._element, true);
        }
        dispose() {
          this._backdrop.dispose();
          this._focustrap.deactivate();
          super.dispose();
        }
        // Private
        _initializeBackDrop() {
          const clickCallback = () => {
            if (this._config.backdrop === "static") {
              EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
              return;
            }
            this.hide();
          };
          const isVisible2 = Boolean(this._config.backdrop);
          return new Backdrop({
            className: CLASS_NAME_BACKDROP,
            isVisible: isVisible2,
            isAnimated: true,
            rootElement: this._element.parentNode,
            clickCallback: isVisible2 ? clickCallback : null
          });
        }
        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }
        _addEventListeners() {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event2) => {
            if (event2.key !== ESCAPE_KEY) {
              return;
            }
            if (this._config.keyboard) {
              this.hide();
              return;
            }
            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          });
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Offcanvas.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (data[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2](this);
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event2) {
        const target = SelectorEngine.getElementFromSelector(this);
        if (["A", "AREA"].includes(this.tagName)) {
          event2.preventDefault();
        }
        if (isDisabled(this)) {
          return;
        }
        EventHandler.one(target, EVENT_HIDDEN$3, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
        const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
        if (alreadyOpen && alreadyOpen !== target) {
          Offcanvas.getInstance(alreadyOpen).hide();
        }
        const data = Offcanvas.getOrCreateInstance(target);
        data.toggle(this);
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
        for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
          Offcanvas.getOrCreateInstance(selector).show();
        }
      });
      EventHandler.on(window, EVENT_RESIZE, () => {
        for (const element of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]")) {
          if (getComputedStyle(element).position !== "fixed") {
            Offcanvas.getOrCreateInstance(element).hide();
          }
        }
      });
      enableDismissTrigger(Offcanvas);
      defineJQueryPlugin(Offcanvas);
      const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
      const DefaultAllowlist = {
        // Global attributes allowed on any supplied element below.
        "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        dd: [],
        div: [],
        dl: [],
        dt: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "srcset", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
      };
      const uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
      const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
      const allowedAttribute = (attribute, allowedAttributeList) => {
        const attributeName = attribute.nodeName.toLowerCase();
        if (allowedAttributeList.includes(attributeName)) {
          if (uriAttributes.has(attributeName)) {
            return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
          }
          return true;
        }
        return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
      };
      function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
        if (!unsafeHtml.length) {
          return unsafeHtml;
        }
        if (sanitizeFunction && typeof sanitizeFunction === "function") {
          return sanitizeFunction(unsafeHtml);
        }
        const domParser = new window.DOMParser();
        const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
        const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
        for (const element of elements) {
          const elementName = element.nodeName.toLowerCase();
          if (!Object.keys(allowList).includes(elementName)) {
            element.remove();
            continue;
          }
          const attributeList = [].concat(...element.attributes);
          const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
          for (const attribute of attributeList) {
            if (!allowedAttribute(attribute, allowedAttributes)) {
              element.removeAttribute(attribute.nodeName);
            }
          }
        }
        return createdDocument.body.innerHTML;
      }
      const NAME$5 = "TemplateFactory";
      const Default$4 = {
        allowList: DefaultAllowlist,
        content: {},
        // { selector : text ,  selector2 : text2 , }
        extraClass: "",
        html: false,
        sanitize: true,
        sanitizeFn: null,
        template: "<div></div>"
      };
      const DefaultType$4 = {
        allowList: "object",
        content: "object",
        extraClass: "(string|function)",
        html: "boolean",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        template: "string"
      };
      const DefaultContentType = {
        entry: "(string|element|function|null)",
        selector: "(string|element)"
      };
      class TemplateFactory extends Config {
        constructor(config2) {
          super();
          this._config = this._getConfig(config2);
        }
        // Getters
        static get Default() {
          return Default$4;
        }
        static get DefaultType() {
          return DefaultType$4;
        }
        static get NAME() {
          return NAME$5;
        }
        // Public
        getContent() {
          return Object.values(this._config.content).map((config2) => this._resolvePossibleFunction(config2)).filter(Boolean);
        }
        hasContent() {
          return this.getContent().length > 0;
        }
        changeContent(content) {
          this._checkContent(content);
          this._config.content = {
            ...this._config.content,
            ...content
          };
          return this;
        }
        toHtml() {
          const templateWrapper = document.createElement("div");
          templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
          for (const [selector, text] of Object.entries(this._config.content)) {
            this._setContent(templateWrapper, text, selector);
          }
          const template = templateWrapper.children[0];
          const extraClass = this._resolvePossibleFunction(this._config.extraClass);
          if (extraClass) {
            template.classList.add(...extraClass.split(" "));
          }
          return template;
        }
        // Private
        _typeCheckConfig(config2) {
          super._typeCheckConfig(config2);
          this._checkContent(config2.content);
        }
        _checkContent(arg) {
          for (const [selector, content] of Object.entries(arg)) {
            super._typeCheckConfig({
              selector,
              entry: content
            }, DefaultContentType);
          }
        }
        _setContent(template, content, selector) {
          const templateElement = SelectorEngine.findOne(selector, template);
          if (!templateElement) {
            return;
          }
          content = this._resolvePossibleFunction(content);
          if (!content) {
            templateElement.remove();
            return;
          }
          if (isElement$1(content)) {
            this._putElementInTemplate(getElement(content), templateElement);
            return;
          }
          if (this._config.html) {
            templateElement.innerHTML = this._maybeSanitize(content);
            return;
          }
          templateElement.textContent = content;
        }
        _maybeSanitize(arg) {
          return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
        }
        _resolvePossibleFunction(arg) {
          return execute(arg, [this]);
        }
        _putElementInTemplate(element, templateElement) {
          if (this._config.html) {
            templateElement.innerHTML = "";
            templateElement.append(element);
            return;
          }
          templateElement.textContent = element.textContent;
        }
      }
      const NAME$4 = "tooltip";
      const DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]);
      const CLASS_NAME_FADE$2 = "fade";
      const CLASS_NAME_MODAL = "modal";
      const CLASS_NAME_SHOW$2 = "show";
      const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
      const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
      const EVENT_MODAL_HIDE = "hide.bs.modal";
      const TRIGGER_HOVER = "hover";
      const TRIGGER_FOCUS = "focus";
      const TRIGGER_CLICK = "click";
      const TRIGGER_MANUAL = "manual";
      const EVENT_HIDE$2 = "hide";
      const EVENT_HIDDEN$2 = "hidden";
      const EVENT_SHOW$2 = "show";
      const EVENT_SHOWN$2 = "shown";
      const EVENT_INSERTED = "inserted";
      const EVENT_CLICK$1 = "click";
      const EVENT_FOCUSIN$1 = "focusin";
      const EVENT_FOCUSOUT$1 = "focusout";
      const EVENT_MOUSEENTER = "mouseenter";
      const EVENT_MOUSELEAVE = "mouseleave";
      const AttachmentMap = {
        AUTO: "auto",
        TOP: "top",
        RIGHT: isRTL() ? "left" : "right",
        BOTTOM: "bottom",
        LEFT: isRTL() ? "right" : "left"
      };
      const Default$3 = {
        allowList: DefaultAllowlist,
        animation: true,
        boundary: "clippingParents",
        container: false,
        customClass: "",
        delay: 0,
        fallbackPlacements: ["top", "right", "bottom", "left"],
        html: false,
        offset: [0, 6],
        placement: "top",
        popperConfig: null,
        sanitize: true,
        sanitizeFn: null,
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        title: "",
        trigger: "hover focus"
      };
      const DefaultType$3 = {
        allowList: "object",
        animation: "boolean",
        boundary: "(string|element)",
        container: "(string|element|boolean)",
        customClass: "(string|function)",
        delay: "(number|object)",
        fallbackPlacements: "array",
        html: "boolean",
        offset: "(array|string|function)",
        placement: "(string|function)",
        popperConfig: "(null|object|function)",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        selector: "(string|boolean)",
        template: "string",
        title: "(string|element|function)",
        trigger: "string"
      };
      class Tooltip extends BaseComponent {
        constructor(element, config2) {
          if (typeof Popper === "undefined") {
            throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
          }
          super(element, config2);
          this._isEnabled = true;
          this._timeout = 0;
          this._isHovered = null;
          this._activeTrigger = {};
          this._popper = null;
          this._templateFactory = null;
          this._newContent = null;
          this.tip = null;
          this._setListeners();
          if (!this._config.selector) {
            this._fixTitle();
          }
        }
        // Getters
        static get Default() {
          return Default$3;
        }
        static get DefaultType() {
          return DefaultType$3;
        }
        static get NAME() {
          return NAME$4;
        }
        // Public
        enable() {
          this._isEnabled = true;
        }
        disable() {
          this._isEnabled = false;
        }
        toggleEnabled() {
          this._isEnabled = !this._isEnabled;
        }
        toggle() {
          if (!this._isEnabled) {
            return;
          }
          this._activeTrigger.click = !this._activeTrigger.click;
          if (this._isShown()) {
            this._leave();
            return;
          }
          this._enter();
        }
        dispose() {
          clearTimeout(this._timeout);
          EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
          if (this._element.getAttribute("data-bs-original-title")) {
            this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title"));
          }
          this._disposePopper();
          super.dispose();
        }
        show() {
          if (this._element.style.display === "none") {
            throw new Error("Please use show on visible elements");
          }
          if (!(this._isWithContent() && this._isEnabled)) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
          const shadowRoot = findShadowRoot(this._element);
          const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
          if (showEvent.defaultPrevented || !isInTheDom) {
            return;
          }
          this._disposePopper();
          const tip = this._getTipElement();
          this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
          const {
            container
          } = this._config;
          if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
            container.append(tip);
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
          }
          this._popper = this._createPopper(tip);
          tip.classList.add(CLASS_NAME_SHOW$2);
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.on(element, "mouseover", noop2);
            }
          }
          const complete = () => {
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
            if (this._isHovered === false) {
              this._leave();
            }
            this._isHovered = false;
          };
          this._queueCallback(complete, this.tip, this._isAnimated());
        }
        hide() {
          if (!this._isShown()) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
          if (hideEvent.defaultPrevented) {
            return;
          }
          const tip = this._getTipElement();
          tip.classList.remove(CLASS_NAME_SHOW$2);
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.off(element, "mouseover", noop2);
            }
          }
          this._activeTrigger[TRIGGER_CLICK] = false;
          this._activeTrigger[TRIGGER_FOCUS] = false;
          this._activeTrigger[TRIGGER_HOVER] = false;
          this._isHovered = null;
          const complete = () => {
            if (this._isWithActiveTrigger()) {
              return;
            }
            if (!this._isHovered) {
              this._disposePopper();
            }
            this._element.removeAttribute("aria-describedby");
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
          };
          this._queueCallback(complete, this.tip, this._isAnimated());
        }
        update() {
          if (this._popper) {
            this._popper.update();
          }
        }
        // Protected
        _isWithContent() {
          return Boolean(this._getTitle());
        }
        _getTipElement() {
          if (!this.tip) {
            this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
          }
          return this.tip;
        }
        _createTipElement(content) {
          const tip = this._getTemplateFactory(content).toHtml();
          if (!tip) {
            return null;
          }
          tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
          tip.classList.add(`bs-${this.constructor.NAME}-auto`);
          const tipId = getUID(this.constructor.NAME).toString();
          tip.setAttribute("id", tipId);
          if (this._isAnimated()) {
            tip.classList.add(CLASS_NAME_FADE$2);
          }
          return tip;
        }
        setContent(content) {
          this._newContent = content;
          if (this._isShown()) {
            this._disposePopper();
            this.show();
          }
        }
        _getTemplateFactory(content) {
          if (this._templateFactory) {
            this._templateFactory.changeContent(content);
          } else {
            this._templateFactory = new TemplateFactory({
              ...this._config,
              // the `content` var has to be after `this._config`
              // to override config.content in case of popover
              content,
              extraClass: this._resolvePossibleFunction(this._config.customClass)
            });
          }
          return this._templateFactory;
        }
        _getContentForTemplate() {
          return {
            [SELECTOR_TOOLTIP_INNER]: this._getTitle()
          };
        }
        _getTitle() {
          return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
        }
        // Private
        _initializeOnDelegatedTarget(event2) {
          return this.constructor.getOrCreateInstance(event2.delegateTarget, this._getDelegateConfig());
        }
        _isAnimated() {
          return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
        }
        _isShown() {
          return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
        }
        _createPopper(tip) {
          const placement = execute(this._config.placement, [this, tip, this._element]);
          const attachment = AttachmentMap[placement.toUpperCase()];
          return createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
        _getOffset() {
          const {
            offset: offset2
          } = this._config;
          if (typeof offset2 === "string") {
            return offset2.split(",").map((value) => Number.parseInt(value, 10));
          }
          if (typeof offset2 === "function") {
            return (popperData) => offset2(popperData, this._element);
          }
          return offset2;
        }
        _resolvePossibleFunction(arg) {
          return execute(arg, [this._element]);
        }
        _getPopperConfig(attachment) {
          const defaultBsPopperConfig = {
            placement: attachment,
            modifiers: [{
              name: "flip",
              options: {
                fallbackPlacements: this._config.fallbackPlacements
              }
            }, {
              name: "offset",
              options: {
                offset: this._getOffset()
              }
            }, {
              name: "preventOverflow",
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: "arrow",
              options: {
                element: `.${this.constructor.NAME}-arrow`
              }
            }, {
              name: "preSetPlacement",
              enabled: true,
              phase: "beforeMain",
              fn: (data) => {
                this._getTipElement().setAttribute("data-popper-placement", data.state.placement);
              }
            }]
          };
          return {
            ...defaultBsPopperConfig,
            ...execute(this._config.popperConfig, [defaultBsPopperConfig])
          };
        }
        _setListeners() {
          const triggers = this._config.trigger.split(" ");
          for (const trigger2 of triggers) {
            if (trigger2 === "click") {
              EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, (event2) => {
                const context = this._initializeOnDelegatedTarget(event2);
                context.toggle();
              });
            } else if (trigger2 !== TRIGGER_MANUAL) {
              const eventIn = trigger2 === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
              const eventOut = trigger2 === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
              EventHandler.on(this._element, eventIn, this._config.selector, (event2) => {
                const context = this._initializeOnDelegatedTarget(event2);
                context._activeTrigger[event2.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
                context._enter();
              });
              EventHandler.on(this._element, eventOut, this._config.selector, (event2) => {
                const context = this._initializeOnDelegatedTarget(event2);
                context._activeTrigger[event2.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event2.relatedTarget);
                context._leave();
              });
            }
          }
          this._hideModalHandler = () => {
            if (this._element) {
              this.hide();
            }
          };
          EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
        }
        _fixTitle() {
          const title = this._element.getAttribute("title");
          if (!title) {
            return;
          }
          if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) {
            this._element.setAttribute("aria-label", title);
          }
          this._element.setAttribute("data-bs-original-title", title);
          this._element.removeAttribute("title");
        }
        _enter() {
          if (this._isShown() || this._isHovered) {
            this._isHovered = true;
            return;
          }
          this._isHovered = true;
          this._setTimeout(() => {
            if (this._isHovered) {
              this.show();
            }
          }, this._config.delay.show);
        }
        _leave() {
          if (this._isWithActiveTrigger()) {
            return;
          }
          this._isHovered = false;
          this._setTimeout(() => {
            if (!this._isHovered) {
              this.hide();
            }
          }, this._config.delay.hide);
        }
        _setTimeout(handler, timeout) {
          clearTimeout(this._timeout);
          this._timeout = setTimeout(handler, timeout);
        }
        _isWithActiveTrigger() {
          return Object.values(this._activeTrigger).includes(true);
        }
        _getConfig(config2) {
          const dataAttributes = Manipulator.getDataAttributes(this._element);
          for (const dataAttribute of Object.keys(dataAttributes)) {
            if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
              delete dataAttributes[dataAttribute];
            }
          }
          config2 = {
            ...dataAttributes,
            ...typeof config2 === "object" && config2 ? config2 : {}
          };
          config2 = this._mergeConfigObj(config2);
          config2 = this._configAfterMerge(config2);
          this._typeCheckConfig(config2);
          return config2;
        }
        _configAfterMerge(config2) {
          config2.container = config2.container === false ? document.body : getElement(config2.container);
          if (typeof config2.delay === "number") {
            config2.delay = {
              show: config2.delay,
              hide: config2.delay
            };
          }
          if (typeof config2.title === "number") {
            config2.title = config2.title.toString();
          }
          if (typeof config2.content === "number") {
            config2.content = config2.content.toString();
          }
          return config2;
        }
        _getDelegateConfig() {
          const config2 = {};
          for (const [key, value] of Object.entries(this._config)) {
            if (this.constructor.Default[key] !== value) {
              config2[key] = value;
            }
          }
          config2.selector = false;
          config2.trigger = "manual";
          return config2;
        }
        _disposePopper() {
          if (this._popper) {
            this._popper.destroy();
            this._popper = null;
          }
          if (this.tip) {
            this.tip.remove();
            this.tip = null;
          }
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Tooltip.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (typeof data[config2] === "undefined") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2]();
          });
        }
      }
      defineJQueryPlugin(Tooltip);
      const NAME$3 = "popover";
      const SELECTOR_TITLE = ".popover-header";
      const SELECTOR_CONTENT = ".popover-body";
      const Default$2 = {
        ...Tooltip.Default,
        content: "",
        offset: [0, 8],
        placement: "right",
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        trigger: "click"
      };
      const DefaultType$2 = {
        ...Tooltip.DefaultType,
        content: "(null|string|element|function)"
      };
      class Popover extends Tooltip {
        // Getters
        static get Default() {
          return Default$2;
        }
        static get DefaultType() {
          return DefaultType$2;
        }
        static get NAME() {
          return NAME$3;
        }
        // Overrides
        _isWithContent() {
          return this._getTitle() || this._getContent();
        }
        // Private
        _getContentForTemplate() {
          return {
            [SELECTOR_TITLE]: this._getTitle(),
            [SELECTOR_CONTENT]: this._getContent()
          };
        }
        _getContent() {
          return this._resolvePossibleFunction(this._config.content);
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Popover.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (typeof data[config2] === "undefined") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2]();
          });
        }
      }
      defineJQueryPlugin(Popover);
      const NAME$2 = "scrollspy";
      const DATA_KEY$2 = "bs.scrollspy";
      const EVENT_KEY$2 = `.${DATA_KEY$2}`;
      const DATA_API_KEY = ".data-api";
      const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
      const EVENT_CLICK = `click${EVENT_KEY$2}`;
      const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
      const CLASS_NAME_DROPDOWN_ITEM = "dropdown-item";
      const CLASS_NAME_ACTIVE$1 = "active";
      const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
      const SELECTOR_TARGET_LINKS = "[href]";
      const SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
      const SELECTOR_NAV_LINKS = ".nav-link";
      const SELECTOR_NAV_ITEMS = ".nav-item";
      const SELECTOR_LIST_ITEMS = ".list-group-item";
      const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
      const SELECTOR_DROPDOWN = ".dropdown";
      const SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle";
      const Default$1 = {
        offset: null,
        // TODO: v6 @deprecated, keep it for backwards compatibility reasons
        rootMargin: "0px 0px -25%",
        smoothScroll: false,
        target: null,
        threshold: [0.1, 0.5, 1]
      };
      const DefaultType$1 = {
        offset: "(number|null)",
        // TODO v6 @deprecated, keep it for backwards compatibility reasons
        rootMargin: "string",
        smoothScroll: "boolean",
        target: "element",
        threshold: "array"
      };
      class ScrollSpy extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._targetLinks = /* @__PURE__ */ new Map();
          this._observableSections = /* @__PURE__ */ new Map();
          this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element;
          this._activeTarget = null;
          this._observer = null;
          this._previousScrollData = {
            visibleEntryTop: 0,
            parentScrollTop: 0
          };
          this.refresh();
        }
        // Getters
        static get Default() {
          return Default$1;
        }
        static get DefaultType() {
          return DefaultType$1;
        }
        static get NAME() {
          return NAME$2;
        }
        // Public
        refresh() {
          this._initializeTargetsAndObservables();
          this._maybeEnableSmoothScroll();
          if (this._observer) {
            this._observer.disconnect();
          } else {
            this._observer = this._getNewObserver();
          }
          for (const section of this._observableSections.values()) {
            this._observer.observe(section);
          }
        }
        dispose() {
          this._observer.disconnect();
          super.dispose();
        }
        // Private
        _configAfterMerge(config2) {
          config2.target = getElement(config2.target) || document.body;
          config2.rootMargin = config2.offset ? `${config2.offset}px 0px -30%` : config2.rootMargin;
          if (typeof config2.threshold === "string") {
            config2.threshold = config2.threshold.split(",").map((value) => Number.parseFloat(value));
          }
          return config2;
        }
        _maybeEnableSmoothScroll() {
          if (!this._config.smoothScroll) {
            return;
          }
          EventHandler.off(this._config.target, EVENT_CLICK);
          EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event2) => {
            const observableSection = this._observableSections.get(event2.target.hash);
            if (observableSection) {
              event2.preventDefault();
              const root = this._rootElement || window;
              const height = observableSection.offsetTop - this._element.offsetTop;
              if (root.scrollTo) {
                root.scrollTo({
                  top: height,
                  behavior: "smooth"
                });
                return;
              }
              root.scrollTop = height;
            }
          });
        }
        _getNewObserver() {
          const options = {
            root: this._rootElement,
            threshold: this._config.threshold,
            rootMargin: this._config.rootMargin
          };
          return new IntersectionObserver((entries) => this._observerCallback(entries), options);
        }
        // The logic of selection
        _observerCallback(entries) {
          const targetElement = (entry) => this._targetLinks.get(`#${entry.target.id}`);
          const activate = (entry) => {
            this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
            this._process(targetElement(entry));
          };
          const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
          const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
          this._previousScrollData.parentScrollTop = parentScrollTop;
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              this._activeTarget = null;
              this._clearActiveClass(targetElement(entry));
              continue;
            }
            const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
            if (userScrollsDown && entryIsLowerThanPrevious) {
              activate(entry);
              if (!parentScrollTop) {
                return;
              }
              continue;
            }
            if (!userScrollsDown && !entryIsLowerThanPrevious) {
              activate(entry);
            }
          }
        }
        _initializeTargetsAndObservables() {
          this._targetLinks = /* @__PURE__ */ new Map();
          this._observableSections = /* @__PURE__ */ new Map();
          const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
          for (const anchor of targetLinks) {
            if (!anchor.hash || isDisabled(anchor)) {
              continue;
            }
            const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);
            if (isVisible(observableSection)) {
              this._targetLinks.set(decodeURI(anchor.hash), anchor);
              this._observableSections.set(anchor.hash, observableSection);
            }
          }
        }
        _process(target) {
          if (this._activeTarget === target) {
            return;
          }
          this._clearActiveClass(this._config.target);
          this._activeTarget = target;
          target.classList.add(CLASS_NAME_ACTIVE$1);
          this._activateParents(target);
          EventHandler.trigger(this._element, EVENT_ACTIVATE, {
            relatedTarget: target
          });
        }
        _activateParents(target) {
          if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
            SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
            return;
          }
          for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
            for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
              item.classList.add(CLASS_NAME_ACTIVE$1);
            }
          }
        }
        _clearActiveClass(parent) {
          parent.classList.remove(CLASS_NAME_ACTIVE$1);
          const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
          for (const node of activeNodes) {
            node.classList.remove(CLASS_NAME_ACTIVE$1);
          }
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = ScrollSpy.getOrCreateInstance(this, config2);
            if (typeof config2 !== "string") {
              return;
            }
            if (data[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2]();
          });
        }
      }
      EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
        for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
          ScrollSpy.getOrCreateInstance(spy);
        }
      });
      defineJQueryPlugin(ScrollSpy);
      const NAME$1 = "tab";
      const DATA_KEY$1 = "bs.tab";
      const EVENT_KEY$1 = `.${DATA_KEY$1}`;
      const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
      const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
      const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
      const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
      const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
      const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
      const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
      const ARROW_LEFT_KEY = "ArrowLeft";
      const ARROW_RIGHT_KEY = "ArrowRight";
      const ARROW_UP_KEY = "ArrowUp";
      const ARROW_DOWN_KEY = "ArrowDown";
      const HOME_KEY = "Home";
      const END_KEY = "End";
      const CLASS_NAME_ACTIVE = "active";
      const CLASS_NAME_FADE$1 = "fade";
      const CLASS_NAME_SHOW$1 = "show";
      const CLASS_DROPDOWN = "dropdown";
      const SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
      const SELECTOR_DROPDOWN_MENU = ".dropdown-menu";
      const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
      const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
      const SELECTOR_OUTER = ".nav-item, .list-group-item";
      const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
      const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
      const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
      const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
      class Tab extends BaseComponent {
        constructor(element) {
          super(element);
          this._parent = this._element.closest(SELECTOR_TAB_PANEL);
          if (!this._parent) {
            return;
          }
          this._setInitialAttributes(this._parent, this._getChildren());
          EventHandler.on(this._element, EVENT_KEYDOWN, (event2) => this._keydown(event2));
        }
        // Getters
        static get NAME() {
          return NAME$1;
        }
        // Public
        show() {
          const innerElem = this._element;
          if (this._elemIsActive(innerElem)) {
            return;
          }
          const active = this._getActiveElem();
          const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
            relatedTarget: innerElem
          }) : null;
          const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
            relatedTarget: active
          });
          if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
            return;
          }
          this._deactivate(active, innerElem);
          this._activate(innerElem, active);
        }
        // Private
        _activate(element, relatedElem) {
          if (!element) {
            return;
          }
          element.classList.add(CLASS_NAME_ACTIVE);
          this._activate(SelectorEngine.getElementFromSelector(element));
          const complete = () => {
            if (element.getAttribute("role") !== "tab") {
              element.classList.add(CLASS_NAME_SHOW$1);
              return;
            }
            element.removeAttribute("tabindex");
            element.setAttribute("aria-selected", true);
            this._toggleDropDown(element, true);
            EventHandler.trigger(element, EVENT_SHOWN$1, {
              relatedTarget: relatedElem
            });
          };
          this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
        }
        _deactivate(element, relatedElem) {
          if (!element) {
            return;
          }
          element.classList.remove(CLASS_NAME_ACTIVE);
          element.blur();
          this._deactivate(SelectorEngine.getElementFromSelector(element));
          const complete = () => {
            if (element.getAttribute("role") !== "tab") {
              element.classList.remove(CLASS_NAME_SHOW$1);
              return;
            }
            element.setAttribute("aria-selected", false);
            element.setAttribute("tabindex", "-1");
            this._toggleDropDown(element, false);
            EventHandler.trigger(element, EVENT_HIDDEN$1, {
              relatedTarget: relatedElem
            });
          };
          this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
        }
        _keydown(event2) {
          if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event2.key)) {
            return;
          }
          event2.stopPropagation();
          event2.preventDefault();
          const children = this._getChildren().filter((element) => !isDisabled(element));
          let nextActiveElement;
          if ([HOME_KEY, END_KEY].includes(event2.key)) {
            nextActiveElement = children[event2.key === HOME_KEY ? 0 : children.length - 1];
          } else {
            const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event2.key);
            nextActiveElement = getNextActiveElement(children, event2.target, isNext, true);
          }
          if (nextActiveElement) {
            nextActiveElement.focus({
              preventScroll: true
            });
            Tab.getOrCreateInstance(nextActiveElement).show();
          }
        }
        _getChildren() {
          return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
        }
        _getActiveElem() {
          return this._getChildren().find((child) => this._elemIsActive(child)) || null;
        }
        _setInitialAttributes(parent, children) {
          this._setAttributeIfNotExists(parent, "role", "tablist");
          for (const child of children) {
            this._setInitialAttributesOnChild(child);
          }
        }
        _setInitialAttributesOnChild(child) {
          child = this._getInnerElement(child);
          const isActive = this._elemIsActive(child);
          const outerElem = this._getOuterElement(child);
          child.setAttribute("aria-selected", isActive);
          if (outerElem !== child) {
            this._setAttributeIfNotExists(outerElem, "role", "presentation");
          }
          if (!isActive) {
            child.setAttribute("tabindex", "-1");
          }
          this._setAttributeIfNotExists(child, "role", "tab");
          this._setInitialAttributesOnTargetPanel(child);
        }
        _setInitialAttributesOnTargetPanel(child) {
          const target = SelectorEngine.getElementFromSelector(child);
          if (!target) {
            return;
          }
          this._setAttributeIfNotExists(target, "role", "tabpanel");
          if (child.id) {
            this._setAttributeIfNotExists(target, "aria-labelledby", `${child.id}`);
          }
        }
        _toggleDropDown(element, open) {
          const outerElem = this._getOuterElement(element);
          if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
            return;
          }
          const toggle = (selector, className) => {
            const element2 = SelectorEngine.findOne(selector, outerElem);
            if (element2) {
              element2.classList.toggle(className, open);
            }
          };
          toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
          toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
          outerElem.setAttribute("aria-expanded", open);
        }
        _setAttributeIfNotExists(element, attribute, value) {
          if (!element.hasAttribute(attribute)) {
            element.setAttribute(attribute, value);
          }
        }
        _elemIsActive(elem) {
          return elem.classList.contains(CLASS_NAME_ACTIVE);
        }
        // Try to get the inner element (usually the .nav-link)
        _getInnerElement(elem) {
          return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
        }
        // Try to get the outer element (usually the .nav-item)
        _getOuterElement(elem) {
          return elem.closest(SELECTOR_OUTER) || elem;
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Tab.getOrCreateInstance(this);
            if (typeof config2 !== "string") {
              return;
            }
            if (data[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
              throw new TypeError(`No method named "${config2}"`);
            }
            data[config2]();
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event2) {
        if (["A", "AREA"].includes(this.tagName)) {
          event2.preventDefault();
        }
        if (isDisabled(this)) {
          return;
        }
        Tab.getOrCreateInstance(this).show();
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
        for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
          Tab.getOrCreateInstance(element);
        }
      });
      defineJQueryPlugin(Tab);
      const NAME = "toast";
      const DATA_KEY = "bs.toast";
      const EVENT_KEY = `.${DATA_KEY}`;
      const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
      const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
      const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
      const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
      const EVENT_HIDE = `hide${EVENT_KEY}`;
      const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
      const EVENT_SHOW = `show${EVENT_KEY}`;
      const EVENT_SHOWN = `shown${EVENT_KEY}`;
      const CLASS_NAME_FADE = "fade";
      const CLASS_NAME_HIDE = "hide";
      const CLASS_NAME_SHOW = "show";
      const CLASS_NAME_SHOWING = "showing";
      const DefaultType = {
        animation: "boolean",
        autohide: "boolean",
        delay: "number"
      };
      const Default = {
        animation: true,
        autohide: true,
        delay: 5e3
      };
      class Toast extends BaseComponent {
        constructor(element, config2) {
          super(element, config2);
          this._timeout = null;
          this._hasMouseInteraction = false;
          this._hasKeyboardInteraction = false;
          this._setListeners();
        }
        // Getters
        static get Default() {
          return Default;
        }
        static get DefaultType() {
          return DefaultType;
        }
        static get NAME() {
          return NAME;
        }
        // Public
        show() {
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
          if (showEvent.defaultPrevented) {
            return;
          }
          this._clearTimeout();
          if (this._config.animation) {
            this._element.classList.add(CLASS_NAME_FADE);
          }
          const complete = () => {
            this._element.classList.remove(CLASS_NAME_SHOWING);
            EventHandler.trigger(this._element, EVENT_SHOWN);
            this._maybeScheduleHide();
          };
          this._element.classList.remove(CLASS_NAME_HIDE);
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
          this._queueCallback(complete, this._element, this._config.animation);
        }
        hide() {
          if (!this.isShown()) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
          if (hideEvent.defaultPrevented) {
            return;
          }
          const complete = () => {
            this._element.classList.add(CLASS_NAME_HIDE);
            this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
            EventHandler.trigger(this._element, EVENT_HIDDEN);
          };
          this._element.classList.add(CLASS_NAME_SHOWING);
          this._queueCallback(complete, this._element, this._config.animation);
        }
        dispose() {
          this._clearTimeout();
          if (this.isShown()) {
            this._element.classList.remove(CLASS_NAME_SHOW);
          }
          super.dispose();
        }
        isShown() {
          return this._element.classList.contains(CLASS_NAME_SHOW);
        }
        // Private
        _maybeScheduleHide() {
          if (!this._config.autohide) {
            return;
          }
          if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
            return;
          }
          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }
        _onInteraction(event2, isInteracting) {
          switch (event2.type) {
            case "mouseover":
            case "mouseout": {
              this._hasMouseInteraction = isInteracting;
              break;
            }
            case "focusin":
            case "focusout": {
              this._hasKeyboardInteraction = isInteracting;
              break;
            }
          }
          if (isInteracting) {
            this._clearTimeout();
            return;
          }
          const nextElement = event2.relatedTarget;
          if (this._element === nextElement || this._element.contains(nextElement)) {
            return;
          }
          this._maybeScheduleHide();
        }
        _setListeners() {
          EventHandler.on(this._element, EVENT_MOUSEOVER, (event2) => this._onInteraction(event2, true));
          EventHandler.on(this._element, EVENT_MOUSEOUT, (event2) => this._onInteraction(event2, false));
          EventHandler.on(this._element, EVENT_FOCUSIN, (event2) => this._onInteraction(event2, true));
          EventHandler.on(this._element, EVENT_FOCUSOUT, (event2) => this._onInteraction(event2, false));
        }
        _clearTimeout() {
          clearTimeout(this._timeout);
          this._timeout = null;
        }
        // Static
        static jQueryInterface(config2) {
          return this.each(function() {
            const data = Toast.getOrCreateInstance(this, config2);
            if (typeof config2 === "string") {
              if (typeof data[config2] === "undefined") {
                throw new TypeError(`No method named "${config2}"`);
              }
              data[config2](this);
            }
          });
        }
      }
      enableDismissTrigger(Toast);
      defineJQueryPlugin(Toast);
      const index_umd = {
        Alert,
        Button,
        Carousel,
        Collapse,
        Dropdown,
        Modal,
        Offcanvas,
        Popover,
        ScrollSpy,
        Tab,
        Toast,
        Tooltip
      };
      return index_umd;
    });
  })(bootstrap_bundle$1);
  return bootstrap_bundle$1.exports;
}
requireBootstrap_bundle();
const app = createApp(_sfc_main$r);
app.use(piniaInstance);
app.use(router);
app.component("BsMessage", _sfc_main$m);
app.component("BsDropdown", _sfc_main$a);
app.component("BsCard", _sfc_main$l);
app.component("BsModal", _sfc_main$9);
app.component("BsModalConfirm", _sfc_main$8);
app.component("BsFileUpload", _sfc_main$k);
app.component("BsProgress", _sfc_main$j);
app.component("BsInputBase", _sfc_main$i);
app.component("BsInputText", _sfc_main$f);
app.component("BsInputReadonly", _sfc_main$e);
app.component("BsSelect", _sfc_main$Q);
app.component("BsInputTextArea", _sfc_main$d);
app.component("BsInputTextAreaFormat", _sfc_main$7);
app.component("BsInputNumber", _sfc_main$c);
app.component("BsInputRadio", _sfc_main$w);
app.component("BsInputSwitch", _sfc_main$b);
app.component("IconHome", _sfc_main$6);
app.component("IconTools", _sfc_main$5);
app.component("IconGraphUpArrow", _sfc_main$4);
app.component("IconCloudUpArrow", _sfc_main$3);
app.component("IconUpArrow", _sfc_main$2);
app.component("IconCpu", _sfc_main$1);
app.component("IconData", _sfc_main);
app.mount("#app");
