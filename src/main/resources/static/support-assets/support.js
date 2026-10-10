function y1(l, r) {
  for (var s = 0; s < r.length; s++) {
    const u = r[s];
    if (typeof u != "string" && !Array.isArray(u)) {
      for (const f in u)
        if (f !== "default" && !(f in l)) {
          const d = Object.getOwnPropertyDescriptor(u, f);
          d && Object.defineProperty(l, f, d.get ? d : {
            enumerable: !0,
            get: () => u[f]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(l, Symbol.toStringTag, { value: "Module" }));
}
function $v(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var rd = { exports: {} }, Ur = {};
var uv;
function b1() {
  if (uv) return Ur;
  uv = 1;
  var l = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.fragment");
  function s(u, f, d) {
    var m = null;
    if (d !== void 0 && (m = "" + d), f.key !== void 0 && (m = "" + f.key), "key" in f) {
      d = {};
      for (var v in f)
        v !== "key" && (d[v] = f[v]);
    } else d = f;
    return f = d.ref, {
      $$typeof: l,
      type: u,
      key: m,
      ref: f !== void 0 ? f : null,
      props: d
    };
  }
  return Ur.Fragment = r, Ur.jsx = s, Ur.jsxs = s, Ur;
}
var cv;
function S1() {
  return cv || (cv = 1, rd.exports = b1()), rd.exports;
}
var y = S1(), sd = { exports: {} }, Ct = {};
var fv;
function x1() {
  if (fv) return Ct;
  fv = 1;
  var l = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.portal"), s = /* @__PURE__ */ Symbol.for("react.fragment"), u = /* @__PURE__ */ Symbol.for("react.strict_mode"), f = /* @__PURE__ */ Symbol.for("react.profiler"), d = /* @__PURE__ */ Symbol.for("react.consumer"), m = /* @__PURE__ */ Symbol.for("react.context"), v = /* @__PURE__ */ Symbol.for("react.forward_ref"), b = /* @__PURE__ */ Symbol.for("react.suspense"), x = /* @__PURE__ */ Symbol.for("react.memo"), _ = /* @__PURE__ */ Symbol.for("react.lazy"), h = /* @__PURE__ */ Symbol.for("react.activity"), E = /* @__PURE__ */ Symbol.for("react.view_transition"), R = Symbol.iterator;
  function O(A) {
    return A === null || typeof A != "object" ? null : (A = R && A[R] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var M = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, H = Object.assign, D = {};
  function X(A, z, P) {
    this.props = A, this.context = z, this.refs = D, this.updater = P || M;
  }
  X.prototype.isReactComponent = {}, X.prototype.setState = function(A, z) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, z, "setState");
  }, X.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function Q() {
  }
  Q.prototype = X.prototype;
  function B(A, z, P) {
    this.props = A, this.context = z, this.refs = D, this.updater = P || M;
  }
  var p = B.prototype = new Q();
  p.constructor = B, H(p, X.prototype), p.isPureReactComponent = !0;
  var w = Array.isArray;
  function C() {
  }
  var k = { H: null, A: null, T: null, S: null }, K = Object.prototype.hasOwnProperty;
  function lt(A, z, P) {
    var it = P.ref;
    return {
      $$typeof: l,
      type: A,
      key: z,
      ref: it !== void 0 ? it : null,
      props: P
    };
  }
  function at(A, z) {
    return lt(A.type, z, A.props);
  }
  function tt(A) {
    return typeof A == "object" && A !== null && A.$$typeof === l;
  }
  function ct(A) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function(P) {
      return z[P];
    });
  }
  var I = /\/+/g;
  function vt(A, z) {
    return typeof A == "object" && A !== null && A.key != null ? ct("" + A.key) : z.toString(36);
  }
  function Z(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(C, C) : (A.status = "pending", A.then(
          function(z) {
            A.status === "pending" && (A.status = "fulfilled", A.value = z);
          },
          function(z) {
            A.status === "pending" && (A.status = "rejected", A.reason = z);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function nt(A, z, P, it, bt) {
    var st = typeof A;
    (st === "undefined" || st === "boolean") && (A = null);
    var St = !1;
    if (A === null) St = !0;
    else
      switch (st) {
        case "bigint":
        case "string":
        case "number":
          St = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case l:
            case r:
              St = !0;
              break;
            case _:
              return St = A._init, nt(
                St(A._payload),
                z,
                P,
                it,
                bt
              );
          }
      }
    if (St)
      return bt = bt(A), St = it === "" ? "." + vt(A, 0) : it, w(bt) ? (P = "", St != null && (P = St.replace(I, "$&/") + "/"), nt(bt, z, P, "", function(he) {
        return he;
      })) : bt != null && (tt(bt) && (bt = at(
        bt,
        P + (bt.key == null || A && A.key === bt.key ? "" : ("" + bt.key).replace(
          I,
          "$&/"
        ) + "/") + St
      )), z.push(bt)), 1;
    St = 0;
    var ut = it === "" ? "." : it + ":";
    if (w(A))
      for (var gt = 0; gt < A.length; gt++)
        it = A[gt], st = ut + vt(it, gt), St += nt(
          it,
          z,
          P,
          st,
          bt
        );
    else if (gt = O(A), typeof gt == "function")
      for (A = gt.call(A), gt = 0; !(it = A.next()).done; )
        it = it.value, st = ut + vt(it, gt++), St += nt(
          it,
          z,
          P,
          st,
          bt
        );
    else if (st === "object") {
      if (typeof A.then == "function")
        return nt(
          Z(A),
          z,
          P,
          it,
          bt
        );
      throw z = String(A), Error(
        "Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return St;
  }
  function et(A, z, P) {
    if (A == null) return A;
    var it = [], bt = 0;
    return nt(A, it, "", "", function(st) {
      return z.call(P, st, bt++);
    }), it;
  }
  function ft(A) {
    if (A._status === -1) {
      var z = A._result, P = z();
      P.then(
        function(it) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = it, P.status === void 0 && (P.status = "fulfilled", P.value = it));
        },
        function(it) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = it, P.status === void 0 && (P.status = "rejected", P.reason = it));
        }
      ), A._status === -1 && (A._status = 0, A._result = P);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var mt = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var z = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(z)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  };
  function Vt(A) {
    var z = k.T, P = {};
    P.types = z !== null ? z.types : null, k.T = P;
    try {
      var it = A(), bt = k.S;
      bt !== null && bt(P, it), typeof it == "object" && it !== null && typeof it.then == "function" && it.then(C, mt);
    } catch (st) {
      mt(st);
    } finally {
      z !== null && P.types !== null && (z.types = P.types), k.T = z;
    }
  }
  function $t(A) {
    var z = k.T;
    if (z !== null) {
      var P = z.types;
      P === null ? z.types = [A] : P.indexOf(A) === -1 && P.push(A);
    } else Vt($t.bind(null, A));
  }
  var re = {
    map: et,
    forEach: function(A, z, P) {
      et(
        A,
        function() {
          z.apply(this, arguments);
        },
        P
      );
    },
    count: function(A) {
      var z = 0;
      return et(A, function() {
        z++;
      }), z;
    },
    toArray: function(A) {
      return et(A, function(z) {
        return z;
      }) || [];
    },
    only: function(A) {
      if (!tt(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  };
  return Ct.Activity = h, Ct.Children = re, Ct.Component = X, Ct.Fragment = s, Ct.Profiler = f, Ct.PureComponent = B, Ct.StrictMode = u, Ct.Suspense = b, Ct.ViewTransition = E, Ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, Ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(A) {
      return k.H.useMemoCache(A);
    }
  }, Ct.addTransitionType = $t, Ct.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, Ct.cacheSignal = function() {
    return null;
  }, Ct.cloneElement = function(A, z, P) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var it = H({}, A.props), bt = A.key;
    if (z != null)
      for (st in z.key !== void 0 && (bt = "" + z.key), z)
        !K.call(z, st) || st === "key" || st === "__self" || st === "__source" || st === "ref" && z.ref === void 0 || (it[st] = z[st]);
    var st = arguments.length - 2;
    if (st === 1) it.children = P;
    else if (1 < st) {
      for (var St = Array(st), ut = 0; ut < st; ut++)
        St[ut] = arguments[ut + 2];
      it.children = St;
    }
    return lt(A.type, bt, it);
  }, Ct.createContext = function(A) {
    return A = {
      $$typeof: m,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: d,
      _context: A
    }, A;
  }, Ct.createElement = function(A, z, P) {
    var it, bt = {}, st = null;
    if (z != null)
      for (it in z.key !== void 0 && (st = "" + z.key), z)
        K.call(z, it) && it !== "key" && it !== "__self" && it !== "__source" && (bt[it] = z[it]);
    var St = arguments.length - 2;
    if (St === 1) bt.children = P;
    else if (1 < St) {
      for (var ut = Array(St), gt = 0; gt < St; gt++)
        ut[gt] = arguments[gt + 2];
      bt.children = ut;
    }
    if (A && A.defaultProps)
      for (it in St = A.defaultProps, St)
        bt[it] === void 0 && (bt[it] = St[it]);
    return lt(A, st, bt);
  }, Ct.createRef = function() {
    return { current: null };
  }, Ct.forwardRef = function(A) {
    return { $$typeof: v, render: A };
  }, Ct.isValidElement = tt, Ct.lazy = function(A) {
    return {
      $$typeof: _,
      _payload: { _status: -1, _result: A },
      _init: ft
    };
  }, Ct.memo = function(A, z) {
    return {
      $$typeof: x,
      type: A,
      compare: z === void 0 ? null : z
    };
  }, Ct.startTransition = Vt, Ct.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, Ct.use = function(A) {
    return k.H.use(A);
  }, Ct.useActionState = function(A, z, P) {
    return k.H.useActionState(A, z, P);
  }, Ct.useCallback = function(A, z) {
    return k.H.useCallback(A, z);
  }, Ct.useContext = function(A) {
    return k.H.useContext(A);
  }, Ct.useDebugValue = function() {
  }, Ct.useDeferredValue = function(A, z) {
    return k.H.useDeferredValue(A, z);
  }, Ct.useEffect = function(A, z) {
    return k.H.useEffect(A, z);
  }, Ct.useEffectEvent = function(A) {
    return k.H.useEffectEvent(A);
  }, Ct.useId = function() {
    return k.H.useId();
  }, Ct.useImperativeHandle = function(A, z, P) {
    return k.H.useImperativeHandle(A, z, P);
  }, Ct.useInsertionEffect = function(A, z) {
    return k.H.useInsertionEffect(A, z);
  }, Ct.useLayoutEffect = function(A, z) {
    return k.H.useLayoutEffect(A, z);
  }, Ct.useMemo = function(A, z) {
    return k.H.useMemo(A, z);
  }, Ct.useOptimistic = function(A, z) {
    return k.H.useOptimistic(A, z);
  }, Ct.useReducer = function(A, z, P) {
    return k.H.useReducer(A, z, P);
  }, Ct.useRef = function(A) {
    return k.H.useRef(A);
  }, Ct.useState = function(A) {
    return k.H.useState(A);
  }, Ct.useSyncExternalStore = function(A, z, P) {
    return k.H.useSyncExternalStore(
      A,
      z,
      P
    );
  }, Ct.useTransition = function() {
    return k.H.useTransition();
  }, Ct.version = "19.3.0", Ct;
}
var dv;
function Gd() {
  return dv || (dv = 1, sd.exports = x1()), sd.exports;
}
var S = Gd();
const ot = /* @__PURE__ */ $v(S), Xr = /* @__PURE__ */ y1({
  __proto__: null,
  default: ot
}, [S]);
var ud = { exports: {} }, Br = {}, cd = { exports: {} }, fd = {};
var hv;
function E1() {
  return hv || (hv = 1, (function(l) {
    function r(Z, nt) {
      var et = Z.length;
      Z.push(nt);
      t: for (; 0 < et; ) {
        var ft = et - 1 >>> 1, mt = Z[ft];
        if (0 < f(mt, nt))
          Z[ft] = nt, Z[et] = mt, et = ft;
        else break t;
      }
    }
    function s(Z) {
      return Z.length === 0 ? null : Z[0];
    }
    function u(Z) {
      if (Z.length === 0) return null;
      var nt = Z[0], et = Z.pop();
      if (et !== nt) {
        Z[0] = et;
        t: for (var ft = 0, mt = Z.length, Vt = mt >>> 1; ft < Vt; ) {
          var $t = 2 * (ft + 1) - 1, re = Z[$t], A = $t + 1, z = Z[A];
          if (0 > f(re, et))
            A < mt && 0 > f(z, re) ? (Z[ft] = z, Z[A] = et, ft = A) : (Z[ft] = re, Z[$t] = et, ft = $t);
          else if (A < mt && 0 > f(z, et))
            Z[ft] = z, Z[A] = et, ft = A;
          else break t;
        }
      }
      return nt;
    }
    function f(Z, nt) {
      var et = Z.sortIndex - nt.sortIndex;
      return et !== 0 ? et : Z.id - nt.id;
    }
    if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      l.unstable_now = function() {
        return d.now();
      };
    } else {
      var m = Date, v = m.now();
      l.unstable_now = function() {
        return m.now() - v;
      };
    }
    var b = [], x = [], _ = 1, h = null, E = 3, R = !1, O = !1, M = !1, H = !1, D = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, Q = typeof setImmediate < "u" ? setImmediate : null;
    function B(Z) {
      for (var nt = s(x); nt !== null; ) {
        if (nt.callback === null) u(x);
        else if (nt.startTime <= Z)
          u(x), nt.sortIndex = nt.expirationTime, r(b, nt);
        else break;
        nt = s(x);
      }
    }
    function p(Z) {
      if (M = !1, B(Z), !O)
        if (s(b) !== null)
          O = !0, w || (w = !0, tt());
        else {
          var nt = s(x);
          nt !== null && vt(p, nt.startTime - Z);
        }
    }
    var w = !1, C = -1, k = 5, K = -1;
    function lt() {
      return H ? !0 : !(l.unstable_now() - K < k);
    }
    function at() {
      if (H = !1, w) {
        var Z = l.unstable_now();
        K = Z;
        var nt = !0;
        try {
          t: {
            O = !1, M && (M = !1, X(C), C = -1), R = !0;
            var et = E;
            try {
              e: {
                for (B(Z), h = s(b); h !== null && !(h.expirationTime > Z && lt()); ) {
                  var ft = h.callback;
                  if (typeof ft == "function") {
                    h.callback = null, E = h.priorityLevel;
                    var mt = ft(
                      h.expirationTime <= Z
                    );
                    if (Z = l.unstable_now(), typeof mt == "function") {
                      h.callback = mt, B(Z), nt = !0;
                      break e;
                    }
                    h === s(b) && u(b), B(Z);
                  } else u(b);
                  h = s(b);
                }
                if (h !== null) nt = !0;
                else {
                  var Vt = s(x);
                  Vt !== null && vt(
                    p,
                    Vt.startTime - Z
                  ), nt = !1;
                }
              }
              break t;
            } finally {
              h = null, E = et, R = !1;
            }
            nt = void 0;
          }
        } finally {
          nt ? tt() : w = !1;
        }
      }
    }
    var tt;
    if (typeof Q == "function")
      tt = function() {
        Q(at);
      };
    else if (typeof MessageChannel < "u") {
      var ct = new MessageChannel(), I = ct.port2;
      ct.port1.onmessage = at, tt = function() {
        I.postMessage(null);
      };
    } else
      tt = function() {
        D(at, 0);
      };
    function vt(Z, nt) {
      C = D(function() {
        Z(l.unstable_now());
      }, nt);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(Z) {
      Z.callback = null;
    }, l.unstable_forceFrameRate = function(Z) {
      0 > Z || 125 < Z ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : k = 0 < Z ? Math.floor(1e3 / Z) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return E;
    }, l.unstable_next = function(Z) {
      switch (E) {
        case 1:
        case 2:
        case 3:
          var nt = 3;
          break;
        default:
          nt = E;
      }
      var et = E;
      E = nt;
      try {
        return Z();
      } finally {
        E = et;
      }
    }, l.unstable_requestPaint = function() {
      H = !0;
    }, l.unstable_runWithPriority = function(Z, nt) {
      switch (Z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Z = 3;
      }
      var et = E;
      E = Z;
      try {
        return nt();
      } finally {
        E = et;
      }
    }, l.unstable_scheduleCallback = function(Z, nt, et) {
      var ft = l.unstable_now();
      switch (typeof et == "object" && et !== null ? (et = et.delay, et = typeof et == "number" && 0 < et ? ft + et : ft) : et = ft, Z) {
        case 1:
          var mt = -1;
          break;
        case 2:
          mt = 250;
          break;
        case 5:
          mt = 1073741823;
          break;
        case 4:
          mt = 1e4;
          break;
        default:
          mt = 5e3;
      }
      return mt = et + mt, Z = {
        id: _++,
        callback: nt,
        priorityLevel: Z,
        startTime: et,
        expirationTime: mt,
        sortIndex: -1
      }, et > ft ? (Z.sortIndex = et, r(x, Z), s(b) === null && Z === s(x) && (M ? (X(C), C = -1) : M = !0, vt(p, et - ft))) : (Z.sortIndex = mt, r(b, Z), O || R || (O = !0, w || (w = !0, tt()))), Z;
    }, l.unstable_shouldYield = lt, l.unstable_wrapCallback = function(Z) {
      var nt = E;
      return function() {
        var et = E;
        E = nt;
        try {
          return Z.apply(this, arguments);
        } finally {
          E = et;
        }
      };
    };
  })(fd)), fd;
}
var mv;
function _1() {
  return mv || (mv = 1, cd.exports = E1()), cd.exports;
}
var dd = { exports: {} }, Fe = {};
var gv;
function T1() {
  if (gv) return Fe;
  gv = 1;
  var l = Gd();
  function r(_) {
    var h = "https://react.dev/errors/" + _;
    if (1 < arguments.length) {
      h += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var E = 2; E < arguments.length; E++)
        h += "&args[]=" + encodeURIComponent(arguments[E]);
    }
    return "Minified React error #" + _ + "; visit " + h + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var u = {
    d: {
      f: s,
      r: function() {
        throw Error(r(522));
      },
      D: s,
      C: s,
      L: s,
      m: s,
      X: s,
      S: s,
      M: s
    },
    p: 0,
    findDOMNode: null
  }, f = /* @__PURE__ */ Symbol.for("react.portal"), d = /* @__PURE__ */ Symbol.for("react.recoverable"), m = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function v(_, h, E) {
    var R = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: R == null ? null : R === m ? m : "" + R,
      children: _,
      containerInfo: h,
      implementation: E
    };
  }
  var b = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(_, h) {
    if (_ === "font") return "";
    if (typeof h == "string")
      return h === "use-credentials" ? h : "";
  }
  return Fe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, Fe.browser = function(_) {
    return { $$typeof: d, _reason: _ };
  }, Fe.createPortal = function(_, h) {
    var E = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!h || h.nodeType !== 1 && h.nodeType !== 9 && h.nodeType !== 11)
      throw Error(r(299));
    return v(_, h, null, E);
  }, Fe.flushSync = function(_) {
    var h = b.T, E = u.p;
    try {
      if (b.T = null, u.p = 2, _) return _();
    } finally {
      b.T = h, u.p = E, u.d.f();
    }
  }, Fe.preconnect = function(_, h) {
    typeof _ == "string" && (h ? (h = h.crossOrigin, h = typeof h == "string" ? h === "use-credentials" ? h : "" : void 0) : h = null, u.d.C(_, h));
  }, Fe.prefetchDNS = function(_) {
    typeof _ == "string" && u.d.D(_);
  }, Fe.preinit = function(_, h) {
    if (typeof _ == "string" && h && typeof h.as == "string") {
      var E = h.as, R = x(E, h.crossOrigin), O = typeof h.integrity == "string" ? h.integrity : void 0, M = typeof h.fetchPriority == "string" ? h.fetchPriority : void 0;
      E === "style" ? u.d.S(
        _,
        typeof h.precedence == "string" ? h.precedence : void 0,
        {
          crossOrigin: R,
          integrity: O,
          fetchPriority: M
        }
      ) : E === "script" && u.d.X(_, {
        crossOrigin: R,
        integrity: O,
        fetchPriority: M,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0
      });
    }
  }, Fe.preinitModule = function(_, h) {
    if (typeof _ == "string")
      if (typeof h == "object" && h !== null) {
        if (h.as == null || h.as === "script") {
          var E = x(
            h.as,
            h.crossOrigin
          );
          u.d.M(_, {
            crossOrigin: E,
            integrity: typeof h.integrity == "string" ? h.integrity : void 0,
            nonce: typeof h.nonce == "string" ? h.nonce : void 0,
            fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0
          });
        }
      } else h == null && u.d.M(_);
  }, Fe.preload = function(_, h) {
    if (typeof _ == "string" && typeof h == "object" && h !== null && typeof h.as == "string") {
      var E = h.as, R = x(E, h.crossOrigin);
      u.d.L(_, E, {
        crossOrigin: R,
        integrity: typeof h.integrity == "string" ? h.integrity : void 0,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0,
        type: typeof h.type == "string" ? h.type : void 0,
        fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0,
        referrerPolicy: typeof h.referrerPolicy == "string" ? h.referrerPolicy : void 0,
        imageSrcSet: typeof h.imageSrcSet == "string" ? h.imageSrcSet : void 0,
        imageSizes: typeof h.imageSizes == "string" ? h.imageSizes : void 0,
        media: typeof h.media == "string" ? h.media : void 0
      });
    }
  }, Fe.preloadModule = function(_, h) {
    if (typeof _ == "string")
      if (h) {
        var E = x(h.as, h.crossOrigin);
        u.d.m(_, {
          as: typeof h.as == "string" && h.as !== "script" ? h.as : void 0,
          crossOrigin: E,
          integrity: typeof h.integrity == "string" ? h.integrity : void 0,
          nonce: typeof h.nonce == "string" ? h.nonce : void 0,
          fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0
        });
      } else u.d.m(_);
  }, Fe.requestFormReset = function(_) {
    u.d.r(_);
  }, Fe.unstable_batchedUpdates = function(_, h) {
    return _(h);
  }, Fe.useFormState = function(_, h, E) {
    return b.H.useFormState(_, h, E);
  }, Fe.useFormStatus = function() {
    return b.H.useHostTransitionStatus();
  }, Fe.version = "19.3.0", Fe;
}
var vv;
function Pv() {
  if (vv) return dd.exports;
  vv = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (r) {
        console.error(r);
      }
  }
  return l(), dd.exports = T1(), dd.exports;
}
var pv;
function w1() {
  if (pv) return Br;
  pv = 1;
  var l = _1(), r = Gd(), s = Pv();
  function u(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function d(t) {
    for (var e = t, n = e; n && !n.alternate; )
      e = n, (e.flags & 4098) !== 0 && (t = e.return), n = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function m(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function v(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function b(t) {
    if (d(t) !== t)
      throw Error(u(188));
  }
  function x(t) {
    var e = t.alternate;
    if (!e) {
      if (e = d(t), e === null) throw Error(u(188));
      return e !== t ? null : t;
    }
    for (var n = t, a = e; ; ) {
      var i = n.return;
      if (i === null) break;
      var o = i.alternate;
      if (o === null) {
        if (a = i.return, a !== null) {
          n = a;
          continue;
        }
        break;
      }
      if (i.child === o.child) {
        for (o = i.child; o; ) {
          if (o === n) return b(i), t;
          if (o === a) return b(i), e;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== a.return) n = i, a = o;
      else {
        for (var c = !1, g = i.child; g; ) {
          if (g === n) {
            c = !0, n = i, a = o;
            break;
          }
          if (g === a) {
            c = !0, a = i, n = o;
            break;
          }
          g = g.sibling;
        }
        if (!c) {
          for (g = o.child; g; ) {
            if (g === n) {
              c = !0, n = o, a = i;
              break;
            }
            if (g === a) {
              c = !0, a = o, n = i;
              break;
            }
            g = g.sibling;
          }
          if (!c) throw Error(u(189));
        }
      }
      if (n.alternate !== a) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? t : e;
  }
  function _(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = _(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function h(t, e, n, a, i, o) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && n(t, a, i, o) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && h(
        t.child,
        e,
        n,
        a,
        i,
        o
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function E(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function R(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function O(t) {
    var e = [null, null], n = E(t);
    return n === null || M(
      e,
      t,
      n.child,
      { foundSelf: !1 }
    ), e;
  }
  function M(t, e, n, a) {
    for (; n !== null; ) {
      if (n === e) a.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (a.foundSelf) return t[1] = n, !0;
        t[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && M(
        t,
        e,
        n.child,
        a
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function H(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(u(559));
    }
  }
  var D = null, X = null;
  function Q(t, e, n) {
    return t === n ? !0 : t === e ? (D = t, !0) : !1;
  }
  function B(t, e, n) {
    return t === n ? (X = t, !1) : t === e ? (X !== null && (D = t), !0) : !1;
  }
  function p(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function w(t, e, n) {
    for (var a = 0, i = t; i; i = n(i)) a++;
    i = 0;
    for (var o = e; o; o = n(o)) i++;
    for (; 0 < a - i; ) t = n(t), a--;
    for (; 0 < i - a; ) e = n(e), i--;
    for (; a--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = n(t), e = n(e);
    }
    return null;
  }
  var C = Object.assign, k = /* @__PURE__ */ Symbol.for("react.element"), K = /* @__PURE__ */ Symbol.for("react.transitional.element"), lt = /* @__PURE__ */ Symbol.for("react.portal"), at = /* @__PURE__ */ Symbol.for("react.fragment"), tt = /* @__PURE__ */ Symbol.for("react.strict_mode"), ct = /* @__PURE__ */ Symbol.for("react.profiler"), I = /* @__PURE__ */ Symbol.for("react.consumer"), vt = /* @__PURE__ */ Symbol.for("react.context"), Z = /* @__PURE__ */ Symbol.for("react.forward_ref"), nt = /* @__PURE__ */ Symbol.for("react.suspense"), et = /* @__PURE__ */ Symbol.for("react.suspense_list"), ft = /* @__PURE__ */ Symbol.for("react.memo"), mt = /* @__PURE__ */ Symbol.for("react.lazy"), Vt = /* @__PURE__ */ Symbol.for("react.activity"), $t = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), re = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), A = /* @__PURE__ */ Symbol.for("react.view_transition"), z = /* @__PURE__ */ Symbol.for("react.recoverable"), P = Symbol.iterator;
  function it(t) {
    return t === null || typeof t != "object" ? null : (t = P && t[P] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var bt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function st(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === bt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case at:
        return "Fragment";
      case ct:
        return "Profiler";
      case tt:
        return "StrictMode";
      case nt:
        return "Suspense";
      case et:
        return "SuspenseList";
      case Vt:
        return "Activity";
      case A:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case lt:
          return "Portal";
        case vt:
          return t.displayName || "Context";
        case I:
          return (t._context.displayName || "Context") + ".Consumer";
        case Z:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case ft:
          return e = t.displayName || null, e !== null ? e : st(t.type) || "Memo";
        case mt:
          e = t._payload, t = t._init;
          try {
            return st(t(e));
          } catch {
          }
      }
    return null;
  }
  var St = Array.isArray, ut = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, gt = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, he = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, kn = [], xe = -1;
  function Ne(t) {
    return { current: t };
  }
  function ee(t) {
    0 > xe || (t.current = kn[xe], kn[xe] = null, xe--);
  }
  function Gt(t, e) {
    xe++, kn[xe] = t.current, t.current = e;
  }
  var me = Ne(null), qn = Ne(null), Gn = Ne(null), ge = Ne(null);
  function aa(t, e) {
    switch (Gt(Gn, e), Gt(qn, t), Gt(me, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? yg(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = yg(e), t = bg(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    ee(me), Gt(me, t);
  }
  function nn() {
    ee(me), ee(qn), ee(Gn);
  }
  function ei(t) {
    var e = t.memoizedState;
    e !== null && (No._currentValue = e.memoizedState, Gt(ge, t)), e = me.current;
    var n = bg(e, t.type);
    e !== n && (Gt(qn, t), Gt(me, n));
  }
  function hl(t) {
    qn.current === t && (ee(me), ee(qn)), ge.current === t && (ee(ge), No._currentValue = he);
  }
  var ya, Li;
  function Tn(t) {
    if (ya === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        ya = e && e[1] || "", Li = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ya + t + Li;
  }
  var ba = !1;
  function dn(t, e) {
    if (!t || ba) return "";
    ba = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var F = function() {
                throw Error();
              };
              if (Object.defineProperty(F.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(F, []);
                } catch (rt) {
                  var j = rt;
                }
                Reflect.construct(t, [], F);
              } else {
                try {
                  F.call();
                } catch (rt) {
                  j = rt;
                }
                F = !1;
                try {
                  var Y = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), F = !0, new t();
                } finally {
                  F && (Y !== void 0 ? Object.defineProperty(t.prototype, "props", Y) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (rt) {
                j = rt;
              }
              (F = t()) && typeof F.catch == "function" && F.catch(function() {
              });
            }
          } catch (rt) {
            if (rt && j && typeof rt.stack == "string")
              return [rt.stack, j.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      i && i.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var o = a.DetermineComponentFrameRoot(), c = o[0], g = o[1];
      if (c && g) {
        var T = c.split(`
`), L = g.split(`
`);
        for (i = a = 0; a < T.length && !T[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; i < L.length && !L[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (a === T.length || i === L.length)
          for (a = T.length - 1, i = L.length - 1; 1 <= a && 0 <= i && T[a] !== L[i]; )
            i--;
        for (; 1 <= a && 0 <= i; a--, i--)
          if (T[a] !== L[i]) {
            if (a !== 1 || i !== 1)
              do
                if (a--, i--, 0 > i || T[a] !== L[i]) {
                  var G = `
` + T[a].replace(" at new ", " at ");
                  return t.displayName && G.includes("<anonymous>") && (G = G.replace("<anonymous>", t.displayName)), G;
                }
              while (1 <= a && 0 <= i);
            break;
          }
      }
    } finally {
      ba = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? Tn(n) : "";
  }
  function ml(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Tn(t.type);
      case 16:
        return Tn("Lazy");
      case 13:
        return t.child !== e && e !== null ? Tn("Suspense Fallback") : Tn("Suspense");
      case 19:
        return Tn("SuspenseList");
      case 0:
      case 15:
        return dn(t.type, !1);
      case 11:
        return dn(t.type.render, !1);
      case 1:
        return dn(t.type, !0);
      case 31:
        return Tn("Activity");
      case 30:
        return Tn("ViewTransition");
      default:
        return "";
    }
  }
  function hn(t) {
    try {
      var e = "", n = null;
      do
        e += ml(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var gl = Object.prototype.hasOwnProperty, ni = l.unstable_scheduleCallback, La = l.unstable_cancelCallback, Va = l.unstable_shouldYield, mn = l.unstable_requestPaint, Ye = l.unstable_now, vl = l.unstable_getCurrentPriorityLevel, ke = l.unstable_ImmediatePriority, Ya = l.unstable_UserBlockingPriority, $e = l.unstable_NormalPriority, ai = l.unstable_LowPriority, pl = l.unstable_IdlePriority, Tt = l.log, ue = l.unstable_setDisableYieldValue, ie = null, Xt = null;
  function ne(t) {
    if (typeof Tt == "function" && ue(t), Xt && typeof Xt.setStrictMode == "function")
      try {
        Xt.setStrictMode(ie, t);
      } catch {
      }
  }
  var Ut = Math.clz32 ? Math.clz32 : Xn, ye = Math.log, De = Math.LN2;
  function Xn(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (ye(t) / De | 0) | 0;
  }
  var Ee = 256, gn = 262144, la = 4194304;
  function ka(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function ia(t, e, n) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var i = 0, o = t.suspendedLanes, c = t.pingedLanes;
    t = t.warmLanes;
    var g = a & 134217727;
    return g !== 0 ? (a = g & ~o, a !== 0 ? i = ka(a) : (c &= g, c !== 0 ? i = ka(c) : n || (n = g & ~t, n !== 0 && (i = ka(n))))) : (g = a & ~o, g !== 0 ? i = ka(g) : c !== 0 ? i = ka(c) : n || (n = a & ~t, n !== 0 && (i = ka(n)))), i === 0 ? 0 : e !== 0 && e !== i && (e & o) === 0 && (o = i & -i, n = e & -e, o >= n || o === 32 && (n & 4194048) !== 0) ? e : i;
  }
  function oa(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function yl(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var a = 31 - Ut(n), i = 1 << a;
        e |= t[a], n &= ~i;
      }
    return e;
  }
  function Go(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ra() {
    var t = la;
    return la <<= 1, (la & 62914560) === 0 && (la = 4194304), t;
  }
  function Vi(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function qa(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function Yi(t, e, n, a, i, o) {
    var c = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var g = t.entanglements, T = t.expirationTimes, L = t.hiddenUpdates;
    for (n = c & ~n; 0 < n; ) {
      var G = 31 - Ut(n), F = 1 << G;
      g[G] = 0, T[G] = -1;
      var j = L[G];
      if (j !== null)
        for (L[G] = null, G = 0; G < j.length; G++) {
          var Y = j[G];
          Y !== null && (Y.lane &= -536870913);
        }
      n &= ~F;
    }
    a !== 0 && sa(t, a, 0), o !== 0 && i === 0 && t.tag !== 0 && (t.suspendedLanes |= o & ~(c & ~e));
  }
  function sa(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var a = 31 - Ut(e);
    t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | n & 261930;
  }
  function ki(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var a = 31 - Ut(n), i = 1 << a;
      i & e | t[a] & e && (t[a] |= e), n &= ~i;
    }
  }
  function li(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : bl(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function bl(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Qn(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Zn() {
    var t = gt.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : nv(t.type));
  }
  function ii(t, e) {
    var n = gt.p;
    try {
      return gt.p = t, e();
    } finally {
      gt.p = n;
    }
  }
  var be = Math.random().toString(36).slice(2), ce = "__reactFiber$" + be, qe = "__reactProps$" + be, wn = "__reactContainer$" + be, Xo = "__reactEvents$" + be, qi = "__reactListeners$" + be, Gi = "__reactHandles$" + be, Sl = "__reactResources$" + be, oi = "__reactMarker$" + be, Xi = "__reactLoad$" + be;
  function Qi(t) {
    delete t[ce], delete t[qe], delete t[qi], delete t[Gi];
  }
  function ua(t) {
    var e;
    if (e = t[ce]) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[wn] || n[ce]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = Ug(t); t !== null; ) {
            if (n = t[ce]) return n;
            t = Ug(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function ri(t) {
    if (t = t[ce] || t[wn]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function q(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(u(33));
  }
  function $(t) {
    var e = t[Sl];
    return e || (e = t[Sl] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function W(t) {
    t[oi] = !0;
  }
  function pt(t) {
    t[Xi] = void 0;
  }
  var Ot = /* @__PURE__ */ new Set(), wt = {};
  function zt(t, e) {
    Pt(t, e), Pt(t + "Capture", e);
  }
  function Pt(t, e) {
    for (wt[t] = e, t = 0; t < e.length; t++)
      Ot.add(e[t]);
  }
  var Zt = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Et = {}, Nt = {};
  function qt(t) {
    return gl.call(Nt, t) ? !0 : gl.call(Et, t) ? !1 : Zt.test(t) ? Nt[t] = !0 : (Et[t] = !0, !1);
  }
  var xt = !1;
  function Re() {
    var t = xt;
    return xt = !1, t;
  }
  function fe(t, e, n) {
    if (qt(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, n);
      }
  }
  function Cn(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, n);
    }
  }
  function _e(t, e, n, a) {
    if (a === null) t.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, a);
    }
  }
  function Te(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Zi(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Qo(t, e, n) {
    var a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var i = a.get, o = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return i.call(this);
        },
        set: function(c) {
          n = "" + c, o.call(this, c);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(c) {
          n = "" + c;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Ga(t) {
    if (!t._valueTracker) {
      var e = Zi(t) ? "checked" : "value";
      t._valueTracker = Qo(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function Ki(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), a = "";
    return t && (a = Zi(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== n ? (e.setValue(t), !0) : !1;
  }
  var Ir = /[\n"\\]/g;
  function oe(t) {
    return t.replace(
      Ir,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Pe(t, e, n, a, i, o, c, g) {
    t.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.type = c : t.removeAttribute("type"), e != null ? c === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Te(e)) : t.value !== "" + Te(e) && (t.value = "" + Te(e)) : c !== "submit" && c !== "reset" || t.removeAttribute("value"), e != null ? c === "number" && t.value == e ? Ii(t, Te(t.value)) : Ii(t, Te(e)) : n != null ? Ii(t, Te(n)) : a != null && t.removeAttribute("value"), i == null && o != null && (t.defaultChecked = !!o), i != null && (t.checked = i && typeof i != "function" && typeof i != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.name = "" + Te(g) : t.removeAttribute("name");
  }
  function xl(t, e, n, a, i, o, c, g) {
    if (o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (t.type = o), e != null || n != null) {
      if (!(o !== "submit" && o !== "reset" || e != null)) {
        Ga(t);
        return;
      }
      n = n != null ? "" + Te(n) : "", e = e != null ? "" + Te(e) : n, g || e === t.value || (t.value = e), t.defaultValue = e;
    }
    a = a ?? i, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = g ? t.checked : !!a, t.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.name = c), Ga(t);
  }
  function Ii(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function vn(t, e, n, a) {
    if (t = t.options, e) {
      e = {};
      for (var i = 0; i < n.length; i++)
        e["$" + n[i]] = !0;
      for (n = 0; n < t.length; n++)
        i = e.hasOwnProperty("$" + t[n].value), t[n].selected !== i && (t[n].selected = i), i && a && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + Te(n), e = null, i = 0; i < t.length; i++) {
        if (t[i].value === n) {
          t[i].selected = !0, a && (t[i].defaultSelected = !0);
          return;
        }
        e !== null || t[i].disabled || (e = t[i]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function Ji(t, e, n) {
    if (e != null && (e = "" + Te(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + Te(n) : "";
  }
  function An(t, e, n, a) {
    if (e == null) {
      if (a != null) {
        if (n != null) throw Error(u(92));
        if (St(a)) {
          if (1 < a.length) throw Error(u(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), e = n;
    }
    n = Te(e), t.defaultValue = n, a = t.textContent, a === n && a !== "" && a !== null && (t.value = a), Ga(t);
  }
  function an(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var El = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Zo(t, e, n) {
    var a = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, n) : typeof n != "number" || n === 0 || El.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function On(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(u(62));
    if (t = t.style, n != null) {
      for (var a in n)
        !n.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "", xt = !0);
      for (var i in e)
        a = e[i], e.hasOwnProperty(i) && n[i] !== a && (Zo(t, i, a), xt = !0);
    } else
      for (var o in e)
        e.hasOwnProperty(o) && Zo(t, o, e[o]);
  }
  function si(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Ko = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Io = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ge(t) {
    return Io.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function ln() {
  }
  var ui = null;
  function ci(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Yt = null, je = null;
  function Kn(t) {
    var e = ri(t);
    if (e && (t = e.stateNode)) {
      var n = t[qe] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Pe(
            t,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + oe(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var a = n[e];
              if (a !== t && a.form === t.form) {
                var i = a[qe] || null;
                if (!i) throw Error(u(90));
                Pe(
                  a,
                  i.value,
                  i.defaultValue,
                  i.defaultValue,
                  i.checked,
                  i.defaultChecked,
                  i.type,
                  i.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              a = n[e], a.form === t.form && Ki(a);
          }
          break t;
        case "textarea":
          Ji(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && vn(t, !!n.multiple, e, !1);
      }
    }
  }
  var Nn = !1;
  function fi(t, e, n) {
    if (Nn) return t(e, n);
    Nn = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (Nn = !1, (Yt !== null || je !== null) && (Is(), Yt && (e = Yt, t = je, je = Yt = null, Kn(e), t)))
        for (e = 0; e < t.length; e++) Kn(t[e]);
    }
  }
  function Xa(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var a = n[qe] || null;
    if (a === null) return null;
    n = a[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        u(231, e, typeof n)
      );
    return n;
  }
  var Xe = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), di = !1;
  if (Xe)
    try {
      var Jo = {};
      Object.defineProperty(Jo, "passive", {
        get: function() {
          di = !0;
        }
      }), window.addEventListener("test", Jo, Jo), window.removeEventListener("test", Jo, Jo);
    } catch {
      di = !1;
    }
  var _l = null, Xu = null, Jr = null;
  function m0() {
    if (Jr) return Jr;
    var t, e = Xu, n = e.length, a, i = "value" in _l ? _l.value : _l.textContent, o = i.length;
    for (t = 0; t < n && e[t] === i[t]; t++) ;
    var c = n - t;
    for (a = 1; a <= c && e[n - a] === i[o - a]; a++) ;
    return Jr = i.slice(t, 1 < a ? 1 - a : void 0);
  }
  function Fr(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function $r() {
    return !0;
  }
  function g0() {
    return !1;
  }
  function on(t) {
    function e(n, a, i, o, c) {
      this._reactName = n, this._targetInst = i, this.type = a, this.nativeEvent = o, this.target = c, this.currentTarget = null;
      for (var g in t)
        t.hasOwnProperty(g) && (n = t[g], this[g] = n ? n(o) : o[g]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? $r : g0, this.isPropagationStopped = g0, this;
    }
    return C(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = $r);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = $r);
      },
      persist: function() {
      },
      isPersistent: $r
    }), e;
  }
  var Tl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Pr = on(Tl), Fo = C({}, Tl, { view: 0, detail: 0 }), G2 = on(Fo), Qu, Zu, $o, Wr = C({}, Fo, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Iu,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== $o && ($o && t.type === "mousemove" ? (Qu = t.screenX - $o.screenX, Zu = t.screenY - $o.screenY) : Zu = Qu = 0, $o = t), Qu);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Zu;
    }
  }), v0 = on(Wr), X2 = C({}, Wr, { dataTransfer: 0 }), Q2 = on(X2), Z2 = C({}, Fo, { relatedTarget: 0 }), Ku = on(Z2), K2 = C({}, Tl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), I2 = on(K2), J2 = C({}, Tl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), F2 = on(J2), $2 = C({}, Tl, { data: 0 }), p0 = on($2), P2 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, W2 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, ty = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function ey(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = ty[t]) ? !!e[t] : !1;
  }
  function Iu() {
    return ey;
  }
  var ny = C({}, Fo, {
    key: function(t) {
      if (t.key) {
        var e = P2[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Fr(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? W2[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Iu,
    charCode: function(t) {
      return t.type === "keypress" ? Fr(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Fr(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), ay = on(ny), ly = C({}, Wr, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), y0 = on(ly), iy = C({}, Tl, { submitter: 0 }), oy = on(iy), ry = C({}, Fo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Iu
  }), sy = on(ry), uy = C({}, Tl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), cy = on(uy), fy = C({}, Wr, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), dy = on(fy), hy = C({}, Tl, {
    newState: 0,
    oldState: 0,
    source: 0
  }), my = on(hy), gy = [9, 13, 27, 32], Ju = Xe && "CompositionEvent" in window, Po = null;
  Xe && "documentMode" in document && (Po = document.documentMode);
  var vy = Xe && "TextEvent" in window && !Po, b0 = Xe && (!Ju || Po && 8 < Po && 11 >= Po), S0 = " ", x0 = !1;
  function E0(t, e) {
    switch (t) {
      case "keyup":
        return gy.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function _0(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Fi = !1;
  function py(t, e) {
    switch (t) {
      case "compositionend":
        return _0(e);
      case "keypress":
        return e.which !== 32 ? null : (x0 = !0, S0);
      case "textInput":
        return t = e.data, t === S0 && x0 ? null : t;
      default:
        return null;
    }
  }
  function yy(t, e) {
    if (Fi)
      return t === "compositionend" || !Ju && E0(t, e) ? (t = m0(), Jr = Xu = _l = null, Fi = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return b0 && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var by = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function T0(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!by[t.type] : e === "textarea";
  }
  function w0(t, e, n, a) {
    Yt ? je ? je.push(a) : je = [a] : Yt = a, e = tu(e, "onChange"), 0 < e.length && (n = new Pr(
      "onChange",
      "change",
      null,
      n,
      a
    ), t.push({ event: n, listeners: e }));
  }
  var Wo = null, tr = null;
  function Sy(t) {
    dg(t, 0);
  }
  function ts(t) {
    var e = q(t);
    if (Ki(e)) return t;
  }
  function C0(t, e) {
    if (t === "change") return e;
  }
  var A0 = !1;
  if (Xe) {
    var Fu;
    if (Xe) {
      var $u = "oninput" in document;
      if (!$u) {
        var O0 = document.createElement("div");
        O0.setAttribute("oninput", "return;"), $u = typeof O0.oninput == "function";
      }
      Fu = $u;
    } else Fu = !1;
    A0 = Fu && (!document.documentMode || 9 < document.documentMode);
  }
  function N0() {
    Wo && (Wo.detachEvent("onpropertychange", D0), tr = Wo = null);
  }
  function D0(t) {
    if (t.propertyName === "value" && ts(tr)) {
      var e = [];
      w0(
        e,
        tr,
        t,
        ci(t)
      ), fi(Sy, e);
    }
  }
  function xy(t, e, n) {
    t === "focusin" ? (N0(), Wo = e, tr = n, Wo.attachEvent("onpropertychange", D0)) : t === "focusout" && N0();
  }
  function Ey(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ts(tr);
  }
  function _y(t, e) {
    if (t === "click") return ts(e);
  }
  function Ty(t, e) {
    if (t === "input" || t === "change")
      return ts(e);
  }
  function wy(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var Dn = typeof Object.is == "function" ? Object.is : wy;
  function er(t, e) {
    if (Dn(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), a = Object.keys(e);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var i = n[a];
      if (!gl.call(e, i) || !Dn(t[i], e[i]))
        return !1;
    }
    return !0;
  }
  function Pu(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function R0(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function z0(t, e) {
    var n = R0(t);
    t = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (a = t + n.textContent.length, t <= e && a >= e)
          return { node: n, offset: e - t };
        t = a;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = R0(n);
    }
  }
  function M0(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? M0(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function j0(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Pu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = Pu(t.document);
    }
    return e;
  }
  function Wu(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var Cy = Xe && "documentMode" in document && 11 >= document.documentMode, $i = null, tc = null, nr = null, ec = !1;
  function H0(t, e, n) {
    var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    ec || $i == null || $i !== Pu(a) || (a = $i, "selectionStart" in a && Wu(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), nr && er(nr, a) || (nr = a, a = tu(tc, "onSelect"), 0 < a.length && (e = new Pr(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: a }), e.target = $i)));
  }
  function hi(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var Pi = {
    animationend: hi("Animation", "AnimationEnd"),
    animationiteration: hi("Animation", "AnimationIteration"),
    animationstart: hi("Animation", "AnimationStart"),
    transitionrun: hi("Transition", "TransitionRun"),
    transitionstart: hi("Transition", "TransitionStart"),
    transitioncancel: hi("Transition", "TransitionCancel"),
    transitionend: hi("Transition", "TransitionEnd")
  }, nc = {}, U0 = {};
  Xe && (U0 = document.createElement("div").style, "AnimationEvent" in window || (delete Pi.animationend.animation, delete Pi.animationiteration.animation, delete Pi.animationstart.animation), "TransitionEvent" in window || delete Pi.transitionend.transition);
  function mi(t) {
    if (nc[t]) return nc[t];
    if (!Pi[t]) return t;
    var e = Pi[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in U0)
        return nc[t] = e[n];
    return t;
  }
  var B0 = mi("animationend"), L0 = mi("animationiteration"), V0 = mi("animationstart"), Ay = mi("transitionrun"), Oy = mi("transitionstart"), Ny = mi("transitioncancel"), Y0 = mi("transitionend"), k0 = /* @__PURE__ */ new Map(), ac = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  ac.push("scrollEnd");
  function ca(t, e) {
    k0.set(t, e), zt(e, [t]);
  }
  var Dy = 0;
  function Qa(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = ma.identifierPrefix;
    var n = Dy++;
    return t = "_" + t + "t_" + n.toString(32) + "_", e.autoName = t;
  }
  function q0(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, n = bo;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var i = t[n[a]];
        if (i != null) {
          if (i === "none") return "none";
          e = e == null ? i : e + (" " + i);
        }
      }
    return e ?? t.default;
  }
  function Za(t, e) {
    return t = q0(t), e = q0(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var es = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, In = [], Wi = 0, lc = 0;
  function ns() {
    for (var t = Wi, e = lc = Wi = 0; e < t; ) {
      var n = In[e];
      In[e++] = null;
      var a = In[e];
      In[e++] = null;
      var i = In[e];
      In[e++] = null;
      var o = In[e];
      if (In[e++] = null, a !== null && i !== null) {
        var c = a.pending;
        c === null ? i.next = i : (i.next = c.next, c.next = i), a.pending = i;
      }
      o !== 0 && G0(n, i, o);
    }
  }
  function as(t, e, n, a) {
    In[Wi++] = t, In[Wi++] = e, In[Wi++] = n, In[Wi++] = a, lc |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function ic(t, e, n, a) {
    return as(t, e, n, a), ls(t);
  }
  function gi(t, e) {
    return as(t, null, null, e), ls(t);
  }
  function G0(t, e, n) {
    t.lanes |= n;
    var a = t.alternate;
    a !== null && (a.lanes |= n);
    for (var i = !1, o = t.return; o !== null; )
      o.childLanes |= n, a = o.alternate, a !== null && (a.childLanes |= n), o.tag === 22 && (t = o.stateNode, t === null || t._visibility & 1 || (i = !0)), t = o, o = o.return;
    return t.tag === 3 ? (o = t.stateNode, i && e !== null && (i = 31 - Ut(n), t = o.hiddenUpdates, a = t[i], a === null ? t[i] = [e] : a.push(e), e.lane = n | 536870912), o) : null;
  }
  function ls(t) {
    if (50 < Tr)
      throw Tr = 0, Ks = null, Error(u(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var to = {};
  function Ry(t, e, n, a) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function pn(t, e, n, a) {
    return new Ry(t, e, n, a);
  }
  function oc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Ka(t, e) {
    var n = t.alternate;
    return n === null ? (n = pn(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 1206910976, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function X0(t, e) {
    t.flags &= 1206910978;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function is(t, e, n, a, i, o) {
    var c = 0;
    if (a = t, typeof a == "function") oc(a) && (c = 1);
    else if (typeof a == "string")
      c = i1(
        t,
        n,
        me.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (a) {
        case Vt:
          return t = pn(31, n, e, i), t.elementType = Vt, t.lanes = o, t;
        case at:
          return vi(n.children, i, o, e);
        case tt:
          c = 8, i |= 24;
          break;
        case ct:
          return t = pn(12, n, e, i | 2), t.elementType = ct, t.lanes = o, t;
        case nt:
          return t = pn(13, n, e, i), t.elementType = nt, t.lanes = o, t;
        case et:
          return t = pn(19, n, e, i), t.elementType = et, t.lanes = o, t;
        case $t:
        case A:
          return t = i | 32, t = pn(30, n, e, t), t.elementType = A, t.lanes = o, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case vt:
                c = 10;
                break t;
              case I:
                c = 9;
                break t;
              case Z:
                c = 11;
                break t;
              case ft:
                c = 14;
                break t;
              case mt:
                c = 16, a = null;
                break t;
            }
          c = 29, n = Error(
            u(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return e = pn(c, n, e, i), e.elementType = t, e.type = a, e.lanes = o, e;
  }
  function vi(t, e, n, a) {
    return t = pn(7, t, a, e), t.lanes = n, t;
  }
  function rc(t, e, n) {
    return t = pn(6, t, null, e), t.lanes = n, t;
  }
  function Q0(t) {
    var e = pn(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function sc(t, e, n) {
    return e = pn(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var Z0 = /* @__PURE__ */ new WeakMap();
  function Jn(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = Z0.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: hn(e)
      }, Z0.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: hn(e)
    };
  }
  var eo = [], no = 0, os = null, ar = 0, Fn = [], $n = 0, wl = null, Sa = 1, xa = "";
  function Ia(t, e) {
    eo[no++] = ar, eo[no++] = os, os = t, ar = e;
  }
  function K0(t, e, n) {
    Fn[$n++] = Sa, Fn[$n++] = xa, Fn[$n++] = wl, wl = t;
    var a = Sa;
    t = xa;
    var i = 32 - Ut(a) - 1;
    a &= ~(1 << i), n += 1;
    var o = 32 - Ut(e) + i;
    if (30 < o) {
      var c = i - i % 5;
      o = (a & (1 << c) - 1).toString(32), a >>= c, i -= c, Sa = 1 << 32 - Ut(e) + i | n << i | a, xa = o + t;
    } else
      Sa = 1 << o | n << i | a, xa = t;
  }
  function rs(t) {
    t.return !== null && (Ia(t, 1), K0(t, 1, 0));
  }
  function uc(t) {
    for (; t === os; )
      os = eo[--no], eo[no] = null, ar = eo[--no], eo[no] = null;
    for (; t === wl; )
      wl = Fn[--$n], Fn[$n] = null, xa = Fn[--$n], Fn[$n] = null, Sa = Fn[--$n], Fn[$n] = null;
  }
  function I0(t, e) {
    Fn[$n++] = Sa, Fn[$n++] = xa, Fn[$n++] = wl, Sa = e.id, xa = e.overflow, wl = t;
  }
  var He = null, ae = null, Mt = !1, Cl = null, Pn = !1, cc = Error(u(519));
  function Al(t) {
    var e = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw lr(Jn(e, t)), cc;
  }
  function J0(t) {
    var e = t.stateNode, n = t.type, a = t.memoizedProps;
    switch (e[ce] = t, e[qe] = a, n) {
      case "dialog":
        Ht("cancel", e), Ht("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ht("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Cr.length; n++)
          Ht(Cr[n], e);
        break;
      case "source":
        Ht("error", e);
        break;
      case "img":
      case "image":
      case "link":
        Ht("error", e), Ht("load", e);
        break;
      case "details":
        Ht("toggle", e);
        break;
      case "input":
        Ht("invalid", e), xl(
          e,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        Ht("invalid", e);
        break;
      case "textarea":
        Ht("invalid", e), An(e, a.value, a.defaultValue, a.children);
    }
    n = a.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || a.suppressHydrationWarning === !0 || vg(e.textContent, n) ? (a.popover != null && (Ht("beforetoggle", e), Ht("toggle", e)), a.onScroll != null && Ht("scroll", e), a.onScrollEnd != null && Ht("scrollend", e), a.onClick != null && (e.onclick = ln), e = !0) : e = !1, e || Al(t, !0);
  }
  function ss(t) {
    for (He = t.return; He; )
      switch (He.tag) {
        case 5:
        case 31:
        case 13:
          Pn = !1;
          return;
        case 27:
        case 3:
          Pn = !0;
          return;
        default:
          He = He.return;
      }
  }
  function ao(t) {
    if (t !== He) return !1;
    if (!Mt) return ss(t), Mt = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || kf(t.type, t.memoizedProps)), n = !n), n && ae && Al(t), ss(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(317));
      ae = Hg(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(317));
      ae = Hg(t);
    } else
      e === 27 ? (e = ae, Gl(t.type) ? (t = Ff, Ff = null, ae = t) : ae = e) : ae = He ? ta(t.stateNode.nextSibling) : null;
    return !0;
  }
  function pi() {
    ae = He = null, Mt = !1;
  }
  function fc() {
    var t = Cl;
    return t !== null && (Sn === null ? Sn = t : Sn.push.apply(
      Sn,
      t
    ), Cl = null), t;
  }
  function lr(t) {
    Cl === null ? Cl = [t] : Cl.push(t);
  }
  var dc = Ne(null), yi = null, Ja = null;
  function Ol(t, e, n) {
    Gt(dc, e._currentValue), e._currentValue = n;
  }
  function Fa(t) {
    t._currentValue = dc.current, ee(dc);
  }
  function us(t, e, n) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function hc(t, e, n, a) {
    var i = t.child;
    for (i !== null && (i.return = t); i !== null; ) {
      var o = i.dependencies;
      if (o !== null) {
        var c = i.child;
        o = o.firstContext;
        t: for (; o !== null; ) {
          var g = o;
          o = i;
          for (var T = 0; T < e.length; T++)
            if (g.context === e[T]) {
              o.lanes |= n, g = o.alternate, g !== null && (g.lanes |= n), us(
                o.return,
                n,
                t
              ), a || (c = null);
              break t;
            }
          o = g.next;
        }
      } else if (i.tag === 18) {
        if (c = i.return, c === null) throw Error(u(341));
        c.lanes |= n, o = c.alternate, o !== null && (o.lanes |= n), us(c, n, t), c = null;
      } else
        i.tag === 13 && i.memoizedState !== null && i.memoizedState.dehydrated === null ? (i.lanes |= n, c = i.alternate, c !== null && (c.lanes |= n), us(
          i.return,
          n,
          t
        ), c = i.child, c = c !== null ? c.sibling : null) : c = i.child;
      if (c !== null) c.return = i;
      else
        for (c = i; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (i = c.sibling, i !== null) {
            i.return = c.return, c = i;
            break;
          }
          c = c.return;
        }
      i = c;
    }
  }
  function bi(t, e, n, a) {
    t = null;
    for (var i = e, o = !1; i !== null; ) {
      if (!o) {
        if ((i.flags & 524288) !== 0) o = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var c = i.alternate;
        if (c === null) throw Error(u(387));
        if (c = c.memoizedProps, c !== null) {
          var g = i.type;
          Dn(i.pendingProps.value, c.value) || (t !== null ? t.push(g) : t = [g]);
        }
      } else if (i === ge.current) {
        if (c = i.alternate, c === null) throw Error(u(387));
        c.memoizedState.memoizedState !== i.memoizedState.memoizedState && (t !== null ? t.push(No) : t = [No]);
      }
      i = i.return;
    }
    return t !== null && hc(
      e,
      t,
      n,
      a
    ), e.flags |= 262144, t !== null;
  }
  function cs(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!Dn(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Si(t) {
    yi = t, Ja = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function Qe(t) {
    return F0(yi, t);
  }
  function fs(t, e) {
    return yi === null && Si(t), F0(t, e);
  }
  function F0(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, Ja === null) {
      if (t === null) throw Error(u(308));
      Ja = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else Ja = Ja.next = e;
    return n;
  }
  var zy = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, a) {
        t.push(a);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, My = l.unstable_scheduleCallback, jy = l.unstable_NormalPriority, we = {
    $$typeof: vt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function mc() {
    return {
      controller: new zy(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function ir(t) {
    t.refCount--, t.refCount === 0 && My(jy, function() {
      t.controller.abort();
    });
  }
  function $0(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var n = t.transitionTypes;
      for (n === null && (n = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var a = e[t];
        n.indexOf(a) === -1 && n.push(a);
      }
    }
  }
  var or = null;
  function Hy(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var rr = null, gc = 0, xi = 0, lo = null;
  function Uy(t, e) {
    if (rr === null) {
      var n = rr = [];
      gc = 0, xi = zf(), lo = {
        status: "pending",
        value: void 0,
        then: function(a) {
          n.push(a);
        }
      };
    }
    return gc++, e.then(P0, P0), e;
  }
  function P0() {
    if (--gc === 0 && (or = null, rr !== null)) {
      lo !== null && (lo.status = "fulfilled");
      var t = rr;
      rr = null, xi = 0, lo = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function By(t, e) {
    var n = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(i) {
        n.push(i);
      }
    };
    return t.then(
      function() {
        a.status = "fulfilled", a.value = e;
        for (var i = 0; i < n.length; i++) (0, n[i])(e);
      },
      function(i) {
        for (a.status = "rejected", a.reason = i, i = 0; i < n.length; i++)
          (0, n[i])(void 0);
      }
    ), a;
  }
  var W0 = ut.S;
  ut.S = function(t, e) {
    if (Qm = Ye(), typeof e == "object" && e !== null && typeof e.then == "function" && Uy(t, e), or !== null)
      for (var n = _o; n !== null; )
        $0(n, or), n = n.next;
    if (n = t.types, n !== null) {
      for (var a = _o; a !== null; )
        $0(a, n), a = a.next;
      if (xi !== 0) {
        a = or, a === null && (a = or = []);
        for (var i = 0; i < n.length; i++) {
          var o = n[i];
          a.indexOf(o) === -1 && a.push(o);
        }
      }
    }
    W0 !== null && W0(t, e);
  };
  var Ei = Ne(null);
  function vc() {
    var t = Ei.current;
    return t !== null ? t : te.pooledCache;
  }
  function ds(t, e) {
    e === null ? Gt(Ei, Ei.current) : Gt(Ei, e.pool);
  }
  function th() {
    var t = vc();
    return t === null ? null : { parent: we._currentValue, pool: t };
  }
  var io = Error(u(460)), pc = Error(u(474)), hs = Error(u(542)), ms = { then: function() {
  } };
  function eh(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function nh(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(ln, ln), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, lh(t), t === void 0 && !("reason" in e) ? Error(u(600)) : t;
      default:
        if (typeof e.status == "string") e.then(ln, ln);
        else {
          if (t = te, t !== null && 100 < t.shellSuspendCounter)
            throw Error(u(482));
          t = e, t.status = "pending", t.then(
            function(a) {
              if (e.status === "pending") {
                var i = e;
                i.status = "fulfilled", i.value = a;
              }
            },
            function(a) {
              if (e.status === "pending") {
                var i = e;
                i.status = "rejected", i.reason = a;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, lh(t), t;
        }
        throw Ti = e, io;
    }
  }
  function _i(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Ti = n, io) : n;
    }
  }
  var Ti = null;
  function ah() {
    if (Ti === null) throw Error(u(459));
    var t = Ti;
    return Ti = null, t;
  }
  function lh(t) {
    if (t === io || t === hs)
      throw Error(u(483));
  }
  var oo = null, sr = 0;
  function gs(t) {
    var e = sr;
    return sr += 1, oo === null && (oo = []), nh(oo, t, e);
  }
  function Nl(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function vs(t, e) {
    throw e.$$typeof === k ? Error(u(525)) : (t = Object.prototype.toString.call(e), Error(
      u(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function ih(t) {
    function e(U, N) {
      if (t) {
        var V = U.deletions;
        V === null ? (U.deletions = [N], U.flags |= 16) : V.push(N);
      }
    }
    function n(U, N) {
      if (!t) return null;
      for (; N !== null; )
        e(U, N), N = N.sibling;
      return null;
    }
    function a(U) {
      for (var N = /* @__PURE__ */ new Map(); U !== null; )
        U.key === null ? N.set(U.index, U) : N.set(U.key, U), U = U.sibling;
      return N;
    }
    function i(U, N) {
      return U = Ka(U, N), U.index = 0, U.sibling = null, U;
    }
    function o(U, N, V) {
      return U.index = V, t ? (V = U.alternate, V !== null ? (V = V.index, V < N ? (U.flags |= 2, N) : V) : (U.flags |= 134217730, N)) : (U.flags |= 1048576, N);
    }
    function c(U) {
      return t && U.alternate === null && (U.flags |= 134217730), U;
    }
    function g(U, N, V, J) {
      return N === null || N.tag !== 6 ? (N = rc(V, U.mode, J), N.return = U, N) : (N = i(N, V), N.return = U, N);
    }
    function T(U, N, V, J) {
      var dt = V.type;
      return dt === at ? (U = G(
        U,
        N,
        V.props.children,
        J,
        V.key
      ), Nl(U, V), U) : N !== null && (N.elementType === dt || typeof dt == "object" && dt !== null && dt.$$typeof === mt && _i(dt) === N.type) ? (N = i(N, V.props), Nl(N, V), N.return = U, N) : (N = is(
        V.type,
        V.key,
        V.props,
        null,
        U.mode,
        J
      ), Nl(N, V), N.return = U, N);
    }
    function L(U, N, V, J) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== V.containerInfo || N.stateNode.implementation !== V.implementation ? (N = sc(V, U.mode, J), N.return = U, N) : (N = i(N, V.children || []), N.return = U, N);
    }
    function G(U, N, V, J, dt) {
      return N === null || N.tag !== 7 ? (N = vi(
        V,
        U.mode,
        J,
        dt
      ), N.return = U, N) : (N = i(N, V), N.return = U, N);
    }
    function F(U, N, V) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = rc(
          "" + N,
          U.mode,
          V
        ), N.return = U, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case K:
            return V = is(
              N.type,
              N.key,
              N.props,
              null,
              U.mode,
              V
            ), Nl(V, N), V.return = U, V;
          case lt:
            return N = sc(
              N,
              U.mode,
              V
            ), N.return = U, N;
          case mt:
            return N = _i(N), F(U, N, V);
        }
        if (St(N) || it(N))
          return N = vi(
            N,
            U.mode,
            V,
            null
          ), N.return = U, N;
        if (typeof N.then == "function")
          return F(U, gs(N), V);
        if (N.$$typeof === vt)
          return F(
            U,
            fs(U, N),
            V
          );
        vs(U, N);
      }
      return null;
    }
    function j(U, N, V, J) {
      var dt = N !== null ? N.key : null;
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return dt !== null ? null : g(U, N, "" + V, J);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case K:
            return V.key === dt ? T(U, N, V, J) : null;
          case lt:
            return V.key === dt ? L(U, N, V, J) : null;
          case mt:
            return V = _i(V), j(U, N, V, J);
        }
        if (St(V) || it(V))
          return dt !== null ? null : G(U, N, V, J, null);
        if (typeof V.then == "function")
          return j(
            U,
            N,
            gs(V),
            J
          );
        if (V.$$typeof === vt)
          return j(
            U,
            N,
            fs(U, V),
            J
          );
        vs(U, V);
      }
      return null;
    }
    function Y(U, N, V, J, dt) {
      if (typeof J == "string" && J !== "" || typeof J == "number" || typeof J == "bigint")
        return U = U.get(V) || null, g(N, U, "" + J, dt);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case K:
            return U = U.get(
              J.key === null ? V : J.key
            ) || null, T(N, U, J, dt);
          case lt:
            return U = U.get(
              J.key === null ? V : J.key
            ) || null, L(N, U, J, dt);
          case mt:
            return J = _i(J), Y(
              U,
              N,
              V,
              J,
              dt
            );
        }
        if (St(J) || it(J))
          return U = U.get(V) || null, G(N, U, J, dt, null);
        if (typeof J.then == "function")
          return Y(
            U,
            N,
            V,
            gs(J),
            dt
          );
        if (J.$$typeof === vt)
          return Y(
            U,
            N,
            V,
            fs(N, J),
            dt
          );
        vs(N, J);
      }
      return null;
    }
    function rt(U, N, V, J) {
      for (var dt = null, Lt = null, yt = N, _t = N = 0, Oe = null; yt !== null && _t < V.length; _t++) {
        yt.index > _t ? (Oe = yt, yt = null) : Oe = yt.sibling;
        var kt = j(
          U,
          yt,
          V[_t],
          J
        );
        if (kt === null) {
          yt === null && (yt = Oe);
          break;
        }
        t && yt && kt.alternate === null && e(U, yt), N = o(kt, N, _t), Lt === null ? dt = kt : Lt.sibling = kt, Lt = kt, yt = Oe;
      }
      if (_t === V.length)
        return n(U, yt), Mt && Ia(U, _t), dt;
      if (yt === null) {
        for (; _t < V.length; _t++)
          yt = F(U, V[_t], J), yt !== null && (N = o(
            yt,
            N,
            _t
          ), Lt === null ? dt = yt : Lt.sibling = yt, Lt = yt);
        return Mt && Ia(U, _t), dt;
      }
      for (yt = a(yt); _t < V.length; _t++)
        Oe = Y(
          yt,
          U,
          _t,
          V[_t],
          J
        ), Oe !== null && (t && (kt = Oe.alternate, kt !== null && yt.delete(kt.key === null ? _t : kt.key)), N = o(
          Oe,
          N,
          _t
        ), Lt === null ? dt = Oe : Lt.sibling = Oe, Lt = Oe);
      return t && yt.forEach(function(Il) {
        return e(U, Il);
      }), Mt && Ia(U, _t), dt;
    }
    function ht(U, N, V, J) {
      if (V == null) throw Error(u(151));
      for (var dt = null, Lt = null, yt = N, _t = N = 0, Oe = null, kt = V.next(); yt !== null && !kt.done; _t++, kt = V.next()) {
        yt.index > _t ? (Oe = yt, yt = null) : Oe = yt.sibling;
        var Il = j(U, yt, kt.value, J);
        if (Il === null) {
          yt === null && (yt = Oe);
          break;
        }
        t && yt && Il.alternate === null && e(U, yt), N = o(Il, N, _t), Lt === null ? dt = Il : Lt.sibling = Il, Lt = Il, yt = Oe;
      }
      if (kt.done)
        return n(U, yt), Mt && Ia(U, _t), dt;
      if (yt === null) {
        for (; !kt.done; _t++, kt = V.next())
          kt = F(U, kt.value, J), kt !== null && (N = o(kt, N, _t), Lt === null ? dt = kt : Lt.sibling = kt, Lt = kt);
        return Mt && Ia(U, _t), dt;
      }
      for (yt = a(yt); !kt.done; _t++, kt = V.next())
        kt = Y(yt, U, _t, kt.value, J), kt !== null && (t && (Oe = kt.alternate, Oe !== null && yt.delete(
          Oe.key === null ? _t : Oe.key
        )), N = o(kt, N, _t), Lt === null ? dt = kt : Lt.sibling = kt, Lt = kt);
      return t && yt.forEach(function(p1) {
        return e(U, p1);
      }), Mt && Ia(U, _t), dt;
    }
    function Rt(U, N, V, J) {
      if (typeof V == "object" && V !== null && V.type === at && V.key === null && V.props.ref === void 0 && (V = V.props.children), typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case K:
            t: {
              for (var dt = V.key; N !== null; ) {
                if (N.key === dt) {
                  if (dt = V.type, dt === at) {
                    if (N.tag === 7) {
                      n(
                        U,
                        N.sibling
                      ), J = i(
                        N,
                        V.props.children
                      ), Nl(J, V), J.return = U, U = J;
                      break t;
                    }
                  } else if (N.elementType === dt || typeof dt == "object" && dt !== null && dt.$$typeof === mt && _i(dt) === N.type) {
                    n(
                      U,
                      N.sibling
                    ), J = i(N, V.props), Nl(J, V), J.return = U, U = J;
                    break t;
                  }
                  n(U, N);
                  break;
                } else e(U, N);
                N = N.sibling;
              }
              V.type === at ? (J = vi(
                V.props.children,
                U.mode,
                J,
                V.key
              ), Nl(J, V), J.return = U, U = J) : (J = is(
                V.type,
                V.key,
                V.props,
                null,
                U.mode,
                J
              ), Nl(J, V), J.return = U, U = J);
            }
            return c(U);
          case lt:
            t: {
              for (dt = V.key; N !== null; ) {
                if (N.key === dt)
                  if (N.tag === 4 && N.stateNode.containerInfo === V.containerInfo && N.stateNode.implementation === V.implementation) {
                    n(
                      U,
                      N.sibling
                    ), J = i(N, V.children || []), J.return = U, U = J;
                    break t;
                  } else {
                    n(U, N);
                    break;
                  }
                else e(U, N);
                N = N.sibling;
              }
              J = sc(V, U.mode, J), J.return = U, U = J;
            }
            return c(U);
          case mt:
            return V = _i(V), Rt(
              U,
              N,
              V,
              J
            );
        }
        if (St(V))
          return rt(
            U,
            N,
            V,
            J
          );
        if (it(V)) {
          if (dt = it(V), typeof dt != "function") throw Error(u(150));
          return V = dt.call(V), ht(
            U,
            N,
            V,
            J
          );
        }
        if (typeof V.then == "function")
          return Rt(
            U,
            N,
            gs(V),
            J
          );
        if (V.$$typeof === vt)
          return Rt(
            U,
            N,
            fs(U, V),
            J
          );
        vs(U, V);
      }
      return typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint" ? (V = "" + V, N !== null && N.tag === 6 ? (n(U, N.sibling), J = i(N, V), J.return = U, U = J) : (n(U, N), J = rc(V, U.mode, J), J.return = U, U = J), c(U)) : n(U, N);
    }
    return function(U, N, V, J) {
      try {
        sr = 0;
        var dt = Rt(
          U,
          N,
          V,
          J
        );
        return oo = null, dt;
      } catch (yt) {
        if (yt === io || yt === hs) throw yt;
        var Lt = pn(29, yt, null, U.mode);
        return Lt.lanes = J, Lt.return = U, Lt;
      }
    };
  }
  var wi = ih(!0), oh = ih(!1), Dl = !1;
  function yc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function bc(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Rl(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function zl(t, e, n) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Qt & 2) !== 0) {
      var i = a.pending;
      return i === null ? e.next = e : (e.next = i.next, i.next = e), a.pending = e, e = ls(t), G0(t, null, n), e;
    }
    return as(t, a, e, n), ls(t);
  }
  function ur(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var a = e.lanes;
      a &= t.pendingLanes, n |= a, e.lanes = n, ki(t, n);
    }
  }
  function Sc(t, e) {
    var n = t.updateQueue, a = t.alternate;
    if (a !== null && (a = a.updateQueue, n === a)) {
      var i = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var c = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          o === null ? i = o = c : o = o.next = c, n = n.next;
        } while (n !== null);
        o === null ? i = o = e : o = o.next = e;
      } else i = o = e;
      n = {
        baseState: a.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: o,
        shared: a.shared,
        callbacks: a.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var xc = !1;
  function cr() {
    if (xc) {
      var t = lo;
      if (t !== null) throw t;
    }
  }
  function fr(t, e, n, a) {
    xc = !1;
    var i = t.updateQueue;
    Dl = !1;
    var o = i.firstBaseUpdate, c = i.lastBaseUpdate, g = i.shared.pending;
    if (g !== null) {
      i.shared.pending = null;
      var T = g, L = T.next;
      T.next = null, c === null ? o = L : c.next = L, c = T;
      var G = t.alternate;
      G !== null && (G = G.updateQueue, g = G.lastBaseUpdate, g !== c && (g === null ? G.firstBaseUpdate = L : g.next = L, G.lastBaseUpdate = T));
    }
    if (o !== null) {
      var F = i.baseState;
      c = 0, G = L = T = null, g = o;
      do {
        var j = g.lane & -536870913, Y = j !== g.lane;
        if (Y ? (Bt & j) === j : (a & j) === j) {
          j !== 0 && j === xi && (xc = !0), G !== null && (G = G.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          t: {
            var rt = t, ht = g;
            j = e;
            var Rt = n;
            switch (ht.tag) {
              case 1:
                if (rt = ht.payload, typeof rt == "function") {
                  F = rt.call(Rt, F, j);
                  break t;
                }
                F = rt;
                break t;
              case 3:
                rt.flags = rt.flags & -65537 | 128;
              case 0:
                if (rt = ht.payload, j = typeof rt == "function" ? rt.call(Rt, F, j) : rt, j == null) break t;
                F = C({}, F, j);
                break t;
              case 2:
                Dl = !0;
            }
          }
          j = g.callback, j !== null && (t.flags |= 64, Y && (t.flags |= 8192), Y = i.callbacks, Y === null ? i.callbacks = [j] : Y.push(j));
        } else
          Y = {
            lane: j,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, G === null ? (L = G = Y, T = F) : G = G.next = Y, c |= j;
        if (g = g.next, g === null) {
          if (g = i.shared.pending, g === null)
            break;
          Y = g, g = Y.next, Y.next = null, i.lastBaseUpdate = Y, i.shared.pending = null;
        }
      } while (!0);
      G === null && (T = F), i.baseState = T, i.firstBaseUpdate = L, i.lastBaseUpdate = G, o === null && (i.shared.lanes = 0), Vl |= c, t.lanes = c, t.memoizedState = F;
    }
  }
  function rh(t, e) {
    if (typeof t != "function")
      throw Error(u(191, t));
    t.call(e);
  }
  function sh(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        rh(n[t], e);
  }
  var Ml = Ne(null), ps = Ne(0);
  function uh(t, e) {
    t = el, Gt(ps, t), Gt(Ml, e), el = t | e.baseLanes;
  }
  function Ec() {
    Gt(ps, el), Gt(Ml, Ml.current);
  }
  function _c() {
    el = ps.current, ee(Ml), ee(ps);
  }
  var Ze = Ne(null), We = null;
  function jl(t) {
    var e = t.alternate;
    Gt(Ke, Ke.current & 1), Gt(Ze, t), We === null && (e === null || Ml.current !== null || e.memoizedState !== null) && (We = t);
  }
  function Tc(t) {
    Gt(Ke, Ke.current), Gt(Ze, t), We === null && (We = t);
  }
  function ch(t) {
    t.tag === 22 ? (Gt(Ke, Ke.current), Gt(Ze, t), We === null && (We = t)) : Hl();
  }
  function Hl() {
    Gt(Ke, Ke.current), Gt(Ze, Ze.current);
  }
  function Rn(t) {
    ee(Ze), We === t && (We = null), ee(Ke);
  }
  var Ke = Ne(0);
  function dr(t, e) {
    Gt(Ze, Ze.current), Gt(Ke, e);
  }
  function wc(t) {
    ee(Ke), ee(Ze), We === t && (We = null);
  }
  function ys(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || If(n) || Jf(n)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var $a = 0, Dt = null, Wt = null, Ce = null, bs = !1, ro = !1, Ci = !1, Ss = 0, hr = 0, so = null, Ly = 0;
  function ve() {
    throw Error(u(321));
  }
  function Cc(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!Dn(t[n], e[n])) return !1;
    return !0;
  }
  function Ac(t, e, n, a, i, o) {
    return $a = o, Dt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, ut.H = t === null || t.memoizedState === null ? Kh : Ih, Ci = !1, o = n(a, i), Ci = !1, ro && (o = dh(
      e,
      n,
      a,
      i
    )), fh(t), o;
  }
  function fh(t) {
    ut.H = As;
    var e = Wt !== null && Wt.next !== null;
    if ($a = 0, Ce = Wt = Dt = null, bs = !1, hr = 0, so = null, e) throw Error(u(300));
    t === null || Ae || (t = t.dependencies, t !== null && cs(t) && (Ae = !0));
  }
  function dh(t, e, n, a) {
    Dt = t;
    var i = 0;
    do {
      if (ro && (so = null), hr = 0, ro = !1, 25 <= i) throw Error(u(301));
      if (i += 1, Ce = Wt = null, t.updateQueue != null) {
        var o = t.updateQueue;
        o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
      }
      ut.H = Zy, o = e(n, a);
    } while (ro);
    return o;
  }
  function Vy() {
    var t = ut.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? mr(e) : e, t = t.useState()[0], (Wt !== null ? Wt.memoizedState : null) !== t && (Dt.flags |= 1024), e;
  }
  function Oc() {
    var t = Ss !== 0;
    return Ss = 0, t;
  }
  function Nc(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Dc(t) {
    if (bs) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      bs = !1;
    }
    $a = 0, Ce = Wt = Dt = null, ro = !1, hr = Ss = 0, so = null;
  }
  function rn() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ce === null ? Dt.memoizedState = Ce = t : Ce = Ce.next = t, Ce;
  }
  function Se() {
    if (Wt === null) {
      var t = Dt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Wt.next;
    var e = Ce === null ? Dt.memoizedState : Ce.next;
    if (e !== null)
      Ce = e, Wt = t;
    else {
      if (t === null)
        throw Dt.alternate === null ? Error(u(467)) : Error(u(310));
      Wt = t, t = {
        memoizedState: Wt.memoizedState,
        baseState: Wt.baseState,
        baseQueue: Wt.baseQueue,
        queue: Wt.queue,
        next: null
      }, Ce === null ? Dt.memoizedState = Ce = t : Ce = Ce.next = t;
    }
    return Ce;
  }
  function xs() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function mr(t) {
    var e = hr;
    return hr += 1, so === null && (so = []), t = nh(so, t, e), e = Dt, (Ce === null ? e.memoizedState : Ce.next) === null && (e = e.alternate, ut.H = e === null || e.memoizedState === null ? Kh : Ih), t;
  }
  function Es(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return mr(t);
      if (t.$$typeof === z) return;
      if (t.$$typeof === vt) return Qe(t);
    }
    throw Error(u(438, String(t)));
  }
  function Rc(t) {
    var e = null, n = Dt.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var a = Dt.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (e = {
        data: a.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = xs(), Dt.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), a = 0; a < t; a++)
        n[a] = re;
    return e.index++, n;
  }
  function Pa(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function _s(t) {
    var e = Se();
    return zc(e, Wt, t);
  }
  function zc(t, e, n) {
    var a = t.queue;
    if (a === null) throw Error(u(311));
    a.lastRenderedReducer = n;
    var i = t.baseQueue, o = a.pending;
    if (o !== null) {
      if (i !== null) {
        var c = i.next;
        i.next = o.next, o.next = c;
      }
      e.baseQueue = i = o, a.pending = null;
    }
    if (o = t.baseState, i === null) t.memoizedState = o;
    else {
      e = i.next;
      var g = c = null, T = null, L = e, G = !1;
      do {
        var F = L.lane & -536870913;
        if (F !== L.lane ? (Bt & F) === F : ($a & F) === F) {
          var j = L.revertLane;
          if (j === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: L.action,
              hasEagerState: L.hasEagerState,
              eagerState: L.eagerState,
              next: null
            }), F === xi && (G = !0);
          else if (($a & j) === j) {
            L = L.next, j === xi && (G = !0);
            continue;
          } else
            F = {
              lane: 0,
              revertLane: L.revertLane,
              gesture: null,
              action: L.action,
              hasEagerState: L.hasEagerState,
              eagerState: L.eagerState,
              next: null
            }, T === null ? (g = T = F, c = o) : T = T.next = F, Dt.lanes |= j, Vl |= j;
          F = L.action, Ci && n(o, F), o = L.hasEagerState ? L.eagerState : n(o, F);
        } else
          j = {
            lane: F,
            revertLane: L.revertLane,
            gesture: L.gesture,
            action: L.action,
            hasEagerState: L.hasEagerState,
            eagerState: L.eagerState,
            next: null
          }, T === null ? (g = T = j, c = o) : T = T.next = j, Dt.lanes |= F, Vl |= F;
        L = L.next;
      } while (L !== null && L !== e);
      if (T === null ? c = o : T.next = g, !Dn(o, t.memoizedState) && (Ae = !0, G && (n = lo, n !== null)))
        throw n;
      t.memoizedState = o, t.baseState = c, t.baseQueue = T, a.lastRenderedState = o;
    }
    return i === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Mc(t) {
    var e = Se(), n = e.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = t;
    var a = n.dispatch, i = n.pending, o = e.memoizedState;
    if (i !== null) {
      n.pending = null;
      var c = i = i.next;
      do
        o = t(o, c.action), c = c.next;
      while (c !== i);
      Dn(o, e.memoizedState) || (Ae = !0), e.memoizedState = o, e.baseQueue === null && (e.baseState = o), n.lastRenderedState = o;
    }
    return [o, a];
  }
  function hh(t, e, n) {
    var a = Dt, i = Se(), o = Mt;
    if (o) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else n = e();
    var c = !Dn(
      (Wt || i).memoizedState,
      n
    );
    if (c && (i.memoizedState = n, Ae = !0), i = i.queue, Uc(vh.bind(null, a, i, t), [
      t
    ]), t = i.getSnapshot !== e || c || Ce !== null && (Ce.memoizedState.tag & 1) !== 0, uo(
      t ? 9 : 8,
      { destroy: void 0 },
      gh.bind(null, a, i, n, e),
      null
    ), t) {
      if (a.flags |= 2048, te === null) throw Error(u(349));
      o || ($a & 127) !== 0 || mh(a, e, n);
    }
    return n;
  }
  function mh(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = Dt.updateQueue, e === null ? (e = xs(), Dt.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function gh(t, e, n, a) {
    e.value = n, e.getSnapshot = a, ph(e) && yh(t);
  }
  function vh(t, e, n) {
    return n(function() {
      ph(e) && yh(t);
    });
  }
  function ph(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !Dn(t, n);
    } catch {
      return !0;
    }
  }
  function yh(t) {
    var e = gi(t, 2);
    e !== null && xn(e, t, 2);
  }
  function jc(t) {
    var e = rn();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), Ci) {
        ne(!0);
        try {
          n();
        } finally {
          ne(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Pa,
      lastRenderedState: t
    }, e;
  }
  function bh(t, e, n, a) {
    return t.baseState = n, zc(
      t,
      Wt,
      typeof a == "function" ? a : Pa
    );
  }
  function Yy(t, e, n, a, i) {
    if (Cs(t)) throw Error(u(485));
    if (t = e.action, t !== null) {
      var o = {
        payload: i,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          o.listeners.push(c);
        }
      };
      ut.T !== null ? n(!0) : o.isTransition = !1, a(o), n = e.pending, n === null ? (o.next = e.pending = o, Sh(e, o)) : (o.next = n.next, e.pending = n.next = o);
    }
  }
  function Sh(t, e) {
    var n = e.action, a = e.payload, i = t.state;
    if (e.isTransition) {
      var o = ut.T, c = {};
      c.types = o !== null ? o.types : null, ut.T = c;
      try {
        var g = n(i, a), T = ut.S;
        T !== null && T(c, g), xh(t, e, g);
      } catch (L) {
        Hc(t, e, L);
      } finally {
        o !== null && c.types !== null && (o.types = c.types), ut.T = o;
      }
    } else
      try {
        o = n(i, a), xh(t, e, o);
      } catch (L) {
        Hc(t, e, L);
      }
  }
  function xh(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(a) {
        Eh(t, e, a);
      },
      function(a) {
        return Hc(t, e, a);
      }
    ) : Eh(t, e, n);
  }
  function Eh(t, e, n) {
    e.status = "fulfilled", e.value = n, _h(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, Sh(t, n)));
  }
  function Hc(t, e, n) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        e.status = "rejected", e.reason = n, _h(e), e = e.next;
      while (e !== a);
    }
    t.action = null;
  }
  function _h(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Th(t, e) {
    return e;
  }
  function wh(t, e) {
    if (Mt) {
      var n = te.formState;
      if (n !== null) {
        t: {
          var a = Dt;
          if (Mt) {
            if (ae) {
              e: {
                for (var i = ae, o = Pn; i.nodeType !== 8; ) {
                  if (!o) {
                    i = null;
                    break e;
                  }
                  if (i = ta(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break e;
                  }
                }
                o = i.data, i = o === "F!" || o === "F" ? i : null;
              }
              if (i) {
                ae = ta(
                  i.nextSibling
                ), a = i.data === "F!";
                break t;
              }
            }
            Al(a);
          }
          a = !1;
        }
        a && (e = n[0]);
      }
    }
    return n = rn(), n.memoizedState = n.baseState = e, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Th,
      lastRenderedState: e
    }, n.queue = a, n = Xh.bind(
      null,
      Dt,
      a
    ), a.dispatch = n, a = jc(!1), o = kc.bind(
      null,
      Dt,
      !1,
      a.queue
    ), a = rn(), i = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = i, n = Yy.bind(
      null,
      Dt,
      i,
      o,
      n
    ), i.dispatch = n, a.memoizedState = t, [e, n, !1];
  }
  function Ch(t) {
    var e = Se();
    return Ah(e, Wt, t);
  }
  function Ah(t, e, n) {
    if (e = zc(
      t,
      e,
      Th
    )[0], t = _s(Pa)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var a = mr(e);
      } catch (c) {
        throw c === io ? hs : c;
      }
    else a = e;
    e = Se();
    var i = e.queue, o = i.dispatch;
    return n !== e.memoizedState && (Dt.flags |= 2048, uo(
      9,
      { destroy: void 0 },
      ky.bind(null, i, n),
      null
    )), [a, o, t];
  }
  function ky(t, e) {
    t.action = e;
  }
  function Oh(t) {
    var e = Se(), n = Wt;
    if (n !== null)
      return Ah(e, n, t);
    Se(), e = e.memoizedState, n = Se();
    var a = n.queue.dispatch;
    return n.memoizedState = t, [e, a, !1];
  }
  function uo(t, e, n, a) {
    return t = { tag: t, create: n, deps: a, inst: e, next: null }, e = Dt.updateQueue, e === null && (e = xs(), Dt.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (a = n.next, n.next = t, t.next = a, e.lastEffect = t), t;
  }
  function Nh() {
    return Se().memoizedState;
  }
  function Ts(t, e, n, a) {
    var i = rn();
    Dt.flags |= t, i.memoizedState = uo(
      1 | e,
      { destroy: void 0 },
      n,
      a === void 0 ? null : a
    );
  }
  function ws(t, e, n, a) {
    var i = Se();
    a = a === void 0 ? null : a;
    var o = i.memoizedState.inst;
    Wt !== null && a !== null && Cc(a, Wt.memoizedState.deps) ? i.memoizedState = uo(e, o, n, a) : (Dt.flags |= t, i.memoizedState = uo(
      1 | e,
      o,
      n,
      a
    ));
  }
  function Dh(t, e) {
    Ts(8390656, 8, t, e);
  }
  function Uc(t, e) {
    ws(2048, 8, t, e);
  }
  function qy(t) {
    Dt.flags |= 4;
    var e = Dt.updateQueue;
    if (e === null)
      e = xs(), Dt.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function Rh(t) {
    var e = Se().memoizedState;
    return qy({ ref: e, nextImpl: t }), function() {
      if ((Qt & 2) !== 0) throw Error(u(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function zh(t, e) {
    return ws(4, 2, t, e);
  }
  function Mh(t, e) {
    return ws(4, 4, t, e);
  }
  function jh(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function Hh(t, e, n) {
    n = n != null ? n.concat([t]) : null, ws(4, 4, jh.bind(null, e, t), n);
  }
  function Bc() {
  }
  function Uh(t, e) {
    var n = Se();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    return e !== null && Cc(e, a[1]) ? a[0] : (n.memoizedState = [t, e], t);
  }
  function Bh(t, e) {
    var n = Se();
    e = e === void 0 ? null : e;
    var a = n.memoizedState;
    if (e !== null && Cc(e, a[1]))
      return a[0];
    if (a = t(), Ci) {
      ne(!0);
      try {
        t();
      } finally {
        ne(!1);
      }
    }
    return n.memoizedState = [a, e], a;
  }
  function Lc(t, e, n) {
    return n === void 0 || ($a & 1073741824) !== 0 && (Bt & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = Km(), Dt.lanes |= t, Vl |= t, n);
  }
  function Lh(t, e, n, a) {
    return Dn(n, e) ? n : Ml.current !== null ? (t = Lc(t, n, a), Dn(t, e) || (Ae = !0), t) : ($a & 106) === 0 || ($a & 1073741824) !== 0 && (Bt & 261930) === 0 ? (Ae = !0, t.memoizedState = n) : (t = Km(), Dt.lanes |= t, Vl |= t, e);
  }
  function Vh(t, e, n, a, i) {
    var o = gt.p;
    gt.p = o !== 0 && 8 > o ? o : 8;
    var c = ut.T, g = {};
    g.types = c !== null ? c.types : null, ut.T = g, kc(t, !1, e, n);
    try {
      var T = i(), L = ut.S;
      if (L !== null && L(g, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var G = By(
          T,
          a
        );
        gr(
          t,
          e,
          G,
          Hn(t)
        );
      } else
        gr(
          t,
          e,
          a,
          Hn(t)
        );
    } catch (F) {
      gr(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: F },
        Hn()
      );
    } finally {
      gt.p = o, c !== null && g.types !== null && (c.types = g.types), ut.T = c;
    }
  }
  function Gy() {
  }
  function Vc(t, e, n, a) {
    if (t.tag !== 5) throw Error(u(476));
    var i = Yh(t).queue;
    Vh(
      t,
      i,
      e,
      he,
      n === null ? Gy : function() {
        return kh(t), n(a);
      }
    );
  }
  function Yh(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: he,
      baseState: he,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Pa,
        lastRenderedState: he
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Pa,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function kh(t) {
    var e = Yh(t);
    e.next === null && (e = t.alternate.memoizedState), gr(
      t,
      e.next.queue,
      {},
      Hn()
    );
  }
  function Yc() {
    return Qe(No);
  }
  function qh() {
    return Se().memoizedState;
  }
  function Gh() {
    return Se().memoizedState;
  }
  function Xy(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Hn();
          t = Rl(n);
          var a = zl(e, t, n);
          a !== null && (xn(a, e, n), ur(a, e, n)), e = { cache: mc() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function Qy(t, e, n) {
    var a = Hn();
    n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Cs(t) ? Qh(e, n) : (n = ic(t, e, n, a), n !== null && (xn(n, t, a), Zh(n, e, a)));
  }
  function Xh(t, e, n) {
    var a = Hn();
    gr(t, e, n, a);
  }
  function gr(t, e, n, a) {
    var i = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Cs(t)) Qh(e, i);
    else {
      var o = t.alternate;
      if (t.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer, o !== null))
        try {
          var c = e.lastRenderedState, g = o(c, n);
          if (i.hasEagerState = !0, i.eagerState = g, Dn(g, c))
            return as(t, e, i, 0), te === null && ns(), !1;
        } catch {
        }
      if (n = ic(t, e, i, a), n !== null)
        return xn(n, t, a), Zh(n, e, a), !0;
    }
    return !1;
  }
  function kc(t, e, n, a) {
    if (a = {
      lane: 2,
      revertLane: zf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Cs(t)) {
      if (e) throw Error(u(479));
    } else
      e = ic(
        t,
        n,
        a,
        2
      ), e !== null && xn(e, t, 2);
  }
  function Cs(t) {
    var e = t.alternate;
    return t === Dt || e !== null && e === Dt;
  }
  function Qh(t, e) {
    ro = bs = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function Zh(t, e, n) {
    if ((n & 4194048) !== 0) {
      var a = e.lanes;
      a &= t.pendingLanes, n |= a, e.lanes = n, ki(t, n);
    }
  }
  var As = {
    readContext: Qe,
    use: Es,
    useCallback: ve,
    useContext: ve,
    useEffect: ve,
    useImperativeHandle: ve,
    useLayoutEffect: ve,
    useInsertionEffect: ve,
    useMemo: ve,
    useReducer: ve,
    useRef: ve,
    useState: ve,
    useDebugValue: ve,
    useDeferredValue: ve,
    useTransition: ve,
    useSyncExternalStore: ve,
    useId: ve,
    useHostTransitionStatus: ve,
    useFormState: ve,
    useActionState: ve,
    useOptimistic: ve,
    useMemoCache: ve,
    useCacheRefresh: ve,
    useEffectEvent: ve
  }, Kh = {
    readContext: Qe,
    use: Es,
    useCallback: function(t, e) {
      return rn().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: Qe,
    useEffect: Dh,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, Ts(
        4194308,
        4,
        jh.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return Ts(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Ts(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = rn();
      e = e === void 0 ? null : e;
      var a = t();
      if (Ci) {
        ne(!0);
        try {
          t();
        } finally {
          ne(!1);
        }
      }
      return n.memoizedState = [a, e], a;
    },
    useReducer: function(t, e, n) {
      var a = rn();
      if (n !== void 0) {
        var i = n(e);
        if (Ci) {
          ne(!0);
          try {
            n(e);
          } finally {
            ne(!1);
          }
        }
      } else i = e;
      return a.memoizedState = a.baseState = i, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: i
      }, a.queue = t, t = t.dispatch = Qy.bind(
        null,
        Dt,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var e = rn();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = jc(t);
      var e = t.queue, n = Xh.bind(null, Dt, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: Bc,
    useDeferredValue: function(t, e) {
      var n = rn();
      return Lc(n, t, e);
    },
    useTransition: function() {
      var t = jc(!1);
      return t = Vh.bind(
        null,
        Dt,
        t.queue,
        !0,
        !1
      ), rn().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var a = Dt, i = rn();
      if (Mt) {
        if (n === void 0)
          throw Error(u(407));
        n = n();
      } else {
        if (n = e(), te === null)
          throw Error(u(349));
        (Bt & 127) !== 0 || mh(a, e, n);
      }
      i.memoizedState = n;
      var o = { value: n, getSnapshot: e };
      return i.queue = o, Dh(vh.bind(null, a, o, t), [
        t
      ]), a.flags |= 2048, uo(
        9,
        { destroy: void 0 },
        gh.bind(
          null,
          a,
          o,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = rn(), e = te.identifierPrefix;
      if (Mt) {
        var n = xa, a = Sa;
        n = (a & ~(1 << 32 - Ut(a) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = Ss++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = Ly++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Yc,
    useFormState: wh,
    useActionState: wh,
    useOptimistic: function(t) {
      var e = rn();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = kc.bind(
        null,
        Dt,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: Rc,
    useCacheRefresh: function() {
      return rn().memoizedState = Xy.bind(
        null,
        Dt
      );
    },
    useEffectEvent: function(t) {
      var e = rn(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((Qt & 2) !== 0)
          throw Error(u(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Ih = {
    readContext: Qe,
    use: Es,
    useCallback: Uh,
    useContext: Qe,
    useEffect: Uc,
    useImperativeHandle: Hh,
    useInsertionEffect: zh,
    useLayoutEffect: Mh,
    useMemo: Bh,
    useReducer: _s,
    useRef: Nh,
    useState: function() {
      return _s(Pa);
    },
    useDebugValue: Bc,
    useDeferredValue: function(t, e) {
      var n = Se();
      return Lh(
        n,
        Wt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = _s(Pa)[0], e = Se().memoizedState;
      return [
        typeof t == "boolean" ? t : mr(t),
        e
      ];
    },
    useSyncExternalStore: hh,
    useId: qh,
    useHostTransitionStatus: Yc,
    useFormState: Ch,
    useActionState: Ch,
    useOptimistic: function(t, e) {
      var n = Se();
      return bh(n, Wt, t, e);
    },
    useMemoCache: Rc,
    useCacheRefresh: Gh,
    useEffectEvent: Rh
  }, Zy = {
    readContext: Qe,
    use: Es,
    useCallback: Uh,
    useContext: Qe,
    useEffect: Uc,
    useImperativeHandle: Hh,
    useInsertionEffect: zh,
    useLayoutEffect: Mh,
    useMemo: Bh,
    useReducer: Mc,
    useRef: Nh,
    useState: function() {
      return Mc(Pa);
    },
    useDebugValue: Bc,
    useDeferredValue: function(t, e) {
      var n = Se();
      return Wt === null ? Lc(n, t, e) : Lh(
        n,
        Wt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Mc(Pa)[0], e = Se().memoizedState;
      return [
        typeof t == "boolean" ? t : mr(t),
        e
      ];
    },
    useSyncExternalStore: hh,
    useId: qh,
    useHostTransitionStatus: Yc,
    useFormState: Oh,
    useActionState: Oh,
    useOptimistic: function(t, e) {
      var n = Se();
      return Wt !== null ? bh(n, Wt, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: Rc,
    useCacheRefresh: Gh,
    useEffectEvent: Rh
  };
  function qc(t, e, n, a) {
    e = t.memoizedState, n = n(a, e), n = n == null ? e : C({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Gc = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var a = Hn(), i = Rl(a);
      i.payload = e, n != null && (i.callback = n), e = zl(t, i, a), e !== null && (xn(e, t, a), ur(e, t, a));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var a = Hn(), i = Rl(a);
      i.tag = 1, i.payload = e, n != null && (i.callback = n), e = zl(t, i, a), e !== null && (xn(e, t, a), ur(e, t, a));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = Hn(), a = Rl(n);
      a.tag = 2, e != null && (a.callback = e), e = zl(t, a, n), e !== null && (xn(e, t, n), ur(e, t, n));
    }
  };
  function Jh(t, e, n, a, i, o, c) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, o, c) : e.prototype && e.prototype.isPureReactComponent ? !er(n, a) || !er(i, o) : !0;
  }
  function Fh(t, e, n, a) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, a), e.state !== t && Gc.enqueueReplaceState(e, e.state, null);
  }
  function Ai(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var a in e)
        a !== "ref" && (n[a] = e[a]);
    }
    if (t = t.defaultProps) {
      n === e && (n = C({}, n));
      for (var i in t)
        n[i] === void 0 && (n[i] = t[i]);
    }
    return n;
  }
  function $h(t) {
    es(t);
  }
  function Ph(t) {
    console.error(t);
  }
  function Wh(t) {
    es(t);
  }
  function Os(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function tm(t, e, n) {
    try {
      var a = t.onCaughtError;
      a(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function Xc(t, e, n) {
    return n = Rl(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Os(t, e);
    }, n;
  }
  function em(t) {
    return t = Rl(t), t.tag = 3, t;
  }
  function nm(t, e, n, a) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var o = a.value;
      t.payload = function() {
        return i(o);
      }, t.callback = function() {
        tm(e, n, a);
      };
    }
    var c = n.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (t.callback = function() {
      tm(e, n, a), typeof i != "function" && (Yl === null ? Yl = /* @__PURE__ */ new Set([this]) : Yl.add(this));
      var g = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function Ky(t, e, n, a, i) {
    if (n.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (e = n.alternate, e !== null && bi(
        e,
        n,
        i,
        !0
      ), n = Ze.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return We === null ? Js() : n.alternate === null && pe === 0 && (pe = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, a === ms ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([a]) : e.add(a), Nf(t, a, i)), !1;
          case 22:
            return n.flags |= 65536, a === ms ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([a]) : n.add(a)), Nf(t, a, i)), !1;
        }
        throw Error(u(435, n.tag));
      }
      return Nf(t, a, i), Js(), !1;
    }
    if (Mt)
      return e = Ze.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = i, a !== cc && (t = Error(u(422), { cause: a }), lr(Jn(t, n)))) : (a !== cc && (e = Error(u(423), {
        cause: a
      }), lr(
        Jn(e, n)
      )), t = t.current.alternate, t.flags |= 65536, i &= -i, t.lanes |= i, a = Jn(a, n), i = Xc(
        t.stateNode,
        a,
        i
      ), Sc(t, i), pe !== 4 && (pe = 2)), !1;
    var o = Error(u(520), { cause: a });
    if (o = Jn(o, n), _r === null ? _r = [o] : _r.push(o), pe !== 4 && (pe = 2), e === null) return !0;
    a = Jn(a, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = i & -i, n.lanes |= t, t = Xc(n.stateNode, a, t), Sc(n, t), !1;
        case 1:
          if (e = n.type, o = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (Yl === null || !Yl.has(o))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = em(i), nm(
              i,
              t,
              n,
              a
            ), Sc(n, i), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Qc = Error(u(461)), Ae = !1;
  function ze(t, e, n, a) {
    e.child = t === null ? oh(e, null, n, a) : wi(
      e,
      t.child,
      n,
      a
    );
  }
  function am(t, e, n, a, i) {
    n = n.render;
    var o = e.ref;
    if ("ref" in a) {
      var c = {};
      for (var g in a)
        g !== "ref" && (c[g] = a[g]);
    } else c = a;
    return Si(e), a = Ac(
      t,
      e,
      n,
      c,
      o,
      i
    ), g = Oc(), t !== null && !Ae ? (Nc(t, e, i), Wa(t, e, i)) : (Mt && g && rs(e), e.flags |= 1, ze(t, e, a, i), e.child);
  }
  function lm(t, e, n, a, i) {
    if (t === null) {
      var o = n.type;
      return typeof o == "function" && !oc(o) && o.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = o, im(
        t,
        e,
        o,
        a,
        i
      )) : (t = is(
        n.type,
        null,
        a,
        e,
        e.mode,
        i
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (o = t.child, !Wc(t, i)) {
      var c = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : er, n(c, a) && t.ref === e.ref)
        return Wa(t, e, i);
    }
    return e.flags |= 1, t = Ka(o, a), t.ref = e.ref, t.return = e, e.child = t;
  }
  function im(t, e, n, a, i) {
    if (t !== null) {
      var o = t.memoizedProps;
      if (er(o, a) && t.ref === e.ref)
        if (Ae = !1, e.pendingProps = a = o, Wc(t, i))
          (t.flags & 131072) !== 0 && (Ae = !0);
        else
          return e.lanes = t.lanes, Wa(t, e, i);
    }
    return Zc(
      t,
      e,
      n,
      a,
      i
    );
  }
  function om(t, e, n, a) {
    var i = a.children, o = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (o = o !== null ? o.baseLanes | n : n, t !== null) {
          for (a = e.child = t.child, i = 0; a !== null; )
            i = i | a.lanes | a.childLanes, a = a.sibling;
          a = i & ~o;
        } else a = 0, e.child = null;
        return rm(
          t,
          e,
          o,
          n,
          a
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && ds(
          e,
          o !== null ? o.cachePool : null
        ), o !== null ? uh(e, o) : Ec(), ch(e);
      else
        return a = e.lanes = 536870912, rm(
          t,
          e,
          o !== null ? o.baseLanes | n : n,
          n,
          a
        );
    } else
      o !== null ? (ds(e, o.cachePool), uh(e, o), Hl(), e.memoizedState = null) : (t !== null && ds(e, null), Ec(), Hl());
    return ze(t, e, i, n), e.child;
  }
  function vr(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function rm(t, e, n, a, i) {
    var o = vc();
    return o = o === null ? null : { parent: we._currentValue, pool: o }, e.memoizedState = {
      baseLanes: n,
      cachePool: o
    }, t !== null && ds(e, null), Ec(), ch(e), t !== null && bi(t, e, a, !0), e.childLanes = i, null;
  }
  function Ns(t, e) {
    return e = Ds(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function sm(t, e, n) {
    return wi(e, t.child, null, n), t = Ns(e, e.pendingProps), t.flags |= 2, Rn(e), e.memoizedState = null, t;
  }
  function Iy(t, e, n) {
    var a = e.pendingProps, i = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (Mt) {
        if (a.mode === "hidden")
          return t = Ns(e, a), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, vr(null, t);
        if (Tc(e), (t = ae) ? (t = jg(
          t,
          Pn
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: wl !== null ? { id: Sa, overflow: xa } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Q0(t), n.return = e, e.child = n, He = e, ae = null)) : t = null, t === null) throw Al(e);
        return e.lanes = 536870912, null;
      }
      return Ns(e, a);
    }
    var o = t.memoizedState;
    if (o !== null) {
      var c = o.dehydrated;
      if (Tc(e), i)
        if (e.flags & 256)
          e.flags &= -257, e = sm(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(u(558));
      else if (Ae || bi(t, e, n, !1), i = (n & t.childLanes) !== 0, Ae || i) {
        if (Ml.current === null) {
          if (a = te, a !== null && (c = li(a, n), c !== 0 && c !== o.retryLane))
            throw o.retryLane = c, gi(t, c), xn(a, t, c), Qc;
          Js();
        }
        e = sm(
          t,
          e,
          n
        );
      } else
        t = o.treeContext, ae = ta(c.nextSibling), He = e, Mt = !0, Cl = null, Pn = !1, t !== null && I0(e, t), e = Ns(e, a), e.flags |= 134221824;
      return e;
    }
    return t = Ka(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function co(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(u(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Zc(t, e, n, a, i) {
    return Si(e), n = Ac(
      t,
      e,
      n,
      a,
      void 0,
      i
    ), a = Oc(), t !== null && !Ae ? (Nc(t, e, i), Wa(t, e, i)) : (Mt && a && rs(e), e.flags |= 1, ze(t, e, n, i), e.child);
  }
  function um(t, e, n, a, i, o) {
    return Si(e), e.updateQueue = null, n = dh(
      e,
      a,
      n,
      i
    ), fh(t), a = Oc(), t !== null && !Ae ? (Nc(t, e, o), Wa(t, e, o)) : (Mt && a && rs(e), e.flags |= 1, ze(t, e, n, o), e.child);
  }
  function cm(t, e, n, a, i) {
    if (Si(e), e.stateNode === null) {
      var o = to, c = n.contextType;
      typeof c == "object" && c !== null && (o = Qe(c)), o = new n(a, o), e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = Gc, e.stateNode = o, o._reactInternals = e, o = e.stateNode, o.props = a, o.state = e.memoizedState, o.refs = {}, yc(e), c = n.contextType, o.context = typeof c == "object" && c !== null ? Qe(c) : to, o.state = e.memoizedState, c = n.getDerivedStateFromProps, typeof c == "function" && (qc(
        e,
        n,
        c,
        a
      ), o.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (c = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), c !== o.state && Gc.enqueueReplaceState(o, o.state, null), fr(e, a, o, i), cr(), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308), a = !0;
    } else if (t === null) {
      o = e.stateNode;
      var g = e.memoizedProps, T = Ai(n, g);
      o.props = T;
      var L = o.context, G = n.contextType;
      c = to, typeof G == "object" && G !== null && (c = Qe(G));
      var F = n.getDerivedStateFromProps;
      G = typeof F == "function" || typeof o.getSnapshotBeforeUpdate == "function", g = e.pendingProps !== g, G || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (g || L !== c) && Fh(
        e,
        o,
        a,
        c
      ), Dl = !1;
      var j = e.memoizedState;
      o.state = j, fr(e, a, o, i), cr(), L = e.memoizedState, g || j !== L || Dl ? (typeof F == "function" && (qc(
        e,
        n,
        F,
        a
      ), L = e.memoizedState), (T = Dl || Jh(
        e,
        n,
        T,
        a,
        j,
        L,
        c
      )) ? (G || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = L), o.props = a, o.state = L, o.context = c, a = T) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), a = !1);
    } else {
      o = e.stateNode, bc(t, e), c = e.memoizedProps, G = Ai(n, c), o.props = G, F = e.pendingProps, j = o.context, L = n.contextType, T = to, typeof L == "object" && L !== null && (T = Qe(L)), g = n.getDerivedStateFromProps, (L = typeof g == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (c !== F || j !== T) && Fh(
        e,
        o,
        a,
        T
      ), Dl = !1, j = e.memoizedState, o.state = j, fr(e, a, o, i), cr();
      var Y = e.memoizedState;
      c !== F || j !== Y || Dl || t !== null && t.dependencies !== null && cs(t.dependencies) ? (typeof g == "function" && (qc(
        e,
        n,
        g,
        a
      ), Y = e.memoizedState), (G = Dl || Jh(
        e,
        n,
        G,
        a,
        j,
        Y,
        T
      ) || t !== null && t.dependencies !== null && cs(t.dependencies)) ? (L || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(a, Y, T), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(
        a,
        Y,
        T
      )), typeof o.componentDidUpdate == "function" && (e.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || c === t.memoizedProps && j === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && j === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = Y), o.props = a, o.state = Y, o.context = T, a = G) : (typeof o.componentDidUpdate != "function" || c === t.memoizedProps && j === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && j === t.memoizedState || (e.flags |= 1024), a = !1);
    }
    return o = a, co(t, e), a = (e.flags & 128) !== 0, o || a ? (o = e.stateNode, n = a && typeof n.getDerivedStateFromError != "function" ? null : o.render(), e.flags |= 1, t !== null && a ? (e.child = wi(
      e,
      t.child,
      null,
      i
    ), e.child = wi(
      e,
      null,
      n,
      i
    )) : ze(t, e, n, i), e.memoizedState = o.state, t = e.child) : t = Wa(
      t,
      e,
      i
    ), t;
  }
  function fm(t, e, n, a) {
    return pi(), e.flags |= 256, ze(t, e, n, a), e.child;
  }
  var Kc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Ic(t) {
    return { baseLanes: t, cachePool: th() };
  }
  function Jc(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= jn), t;
  }
  function dm(t, e, n) {
    var a = e.pendingProps, i = !1, o = (e.flags & 128) !== 0, c;
    if ((c = o) || (c = t !== null && t.memoizedState === null ? !1 : (Ke.current & 2) !== 0), c && (i = !0, e.flags &= -129), c = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (Mt) {
        if (i ? jl(e) : Hl(), (t = ae) ? (t = jg(
          t,
          Pn
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: wl !== null ? { id: Sa, overflow: xa } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Q0(t), n.return = e, e.child = n, He = e, ae = null)) : t = null, t === null) throw Al(e);
        return Jf(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return o = a.children, a = a.fallback, i ? (Hl(), i = e.mode, o = Ds(
        { mode: "hidden", children: o },
        i
      ), a = vi(
        a,
        i,
        n,
        null
      ), o.return = e, a.return = e, o.sibling = a, e.child = o, a = e.child, a.memoizedState = Ic(n), a.childLanes = Jc(
        t,
        c,
        n
      ), e.memoizedState = Kc, vr(null, a)) : (jl(e), Fc(e, o));
    }
    var g = t.memoizedState;
    if (g !== null) {
      var T = g.dehydrated;
      if (T !== null)
        return Jy(
          t,
          e,
          o,
          c,
          a,
          T,
          g,
          n
        );
    }
    return i ? (Hl(), i = a.fallback, o = e.mode, g = t.child, T = g.sibling, a = Ka(g, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = g.subtreeFlags & 1206910976, T !== null ? i = Ka(T, i) : (i = vi(
      i,
      o,
      n,
      null
    ), i.flags |= 2), i.return = e, a.return = e, a.sibling = i, e.child = a, vr(null, a), a = e.child, i = t.child.memoizedState, i === null ? i = Ic(n) : (o = i.cachePool, o !== null ? (g = we._currentValue, o = o.parent !== g ? { parent: g, pool: g } : o) : o = th(), i = {
      baseLanes: i.baseLanes | n,
      cachePool: o
    }), a.memoizedState = i, a.childLanes = Jc(
      t,
      c,
      n
    ), e.memoizedState = Kc, vr(t.child, a)) : (jl(e), n = t.child, t = n.sibling, n = Ka(n, {
      mode: "visible",
      children: a.children
    }), n.return = e, n.sibling = null, t !== null && (c = e.deletions, c === null ? (e.deletions = [t], e.flags |= 16) : c.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function Fc(t, e) {
    return e = Ds(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Ds(t, e) {
    return t = pn(22, t, null, e), t.lanes = 0, t;
  }
  function Rs(t, e, n) {
    return wi(e, t.child, null, n), t = Fc(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function Jy(t, e, n, a, i, o, c, g) {
    if (n)
      return e.flags & 256 ? (jl(e), e.flags &= -257, Rs(
        t,
        e,
        g
      )) : e.memoizedState !== null ? (Hl(), e.child = t.child, e.flags |= 128, null) : (Hl(), o = i.fallback, c = e.mode, i = Ds(
        { mode: "visible", children: i.children },
        c
      ), o = vi(
        o,
        c,
        g,
        null
      ), o.flags |= 2, i.return = e, o.return = e, i.sibling = o, e.child = i, wi(e, t.child, null, g), i = e.child, i.memoizedState = Ic(g), i.childLanes = Jc(
        t,
        a,
        g
      ), e.memoizedState = Kc, vr(null, i));
    if (jl(e), Jf(o)) {
      if (a = o.nextSibling && o.nextSibling.dataset, a) var T = a.dgst;
      return a = T, a !== "" && (i = Error(u(419)), i.stack = "", i.digest = a, lr({ value: i, source: null, stack: null })), Rs(
        t,
        e,
        g
      );
    }
    if (Ae || bi(t, e, g, !1), a = (g & t.childLanes) !== 0, Ae || a) {
      if (Ml.current !== null)
        return Rs(
          t,
          e,
          g
        );
      if (a = te, a !== null && (i = li(
        a,
        g
      ), i !== 0 && i !== c.retryLane))
        throw c.retryLane = i, gi(t, i), xn(a, t, i), Qc;
      return If(o) || Js(), Rs(
        t,
        e,
        g
      );
    }
    return If(o) ? (e.flags |= 192, e.child = t.child, null) : (t = c.treeContext, ae = ta(o.nextSibling), He = e, Mt = !0, Cl = null, Pn = !1, t !== null && I0(e, t), e = Fc(
      e,
      i.children
    ), e.flags |= 134221824, e);
  }
  function hm(t, e, n) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), us(t.return, e, n);
  }
  function mm(t) {
    for (var e = null; t !== null; ) {
      var n = t.alternate;
      n !== null && ys(n) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function zs(t, e, n, a, i, o) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: n,
      tailMode: i,
      treeForkCount: o
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = a, c.tail = n, c.tailMode = i, c.treeForkCount = o);
  }
  function $c(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var n = e.sibling;
      e.sibling = t.child, t.child = e, e = n;
    }
  }
  function Pc(t, e, n) {
    var a = e.pendingProps, i = a.revealOrder, o = a.tail;
    a = a.children;
    var c = Ke.current;
    if (e.flags & 128)
      return dr(e, c), null;
    var g = (c & 2) !== 0;
    if (g ? (c = c & 1 | 2, e.flags |= 128) : c &= 1, dr(e, c), i === "backwards" && t !== null ? ($c(t), ze(t, e, a, n), $c(t)) : ze(t, e, a, n), a = Mt ? ar : 0, !g && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && hm(t, n, e);
        else if (t.tag === 19)
          hm(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (i) {
      case "backwards":
        n = mm(e.child), n === null ? (i = e.child, e.child = null) : (i = n.sibling, n.sibling = null, $c(e)), zs(
          e,
          !0,
          i,
          null,
          o,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, i = e.child, e.child = null; i !== null; ) {
          if (t = i.alternate, t !== null && ys(t) === null) {
            e.child = i;
            break;
          }
          t = i.sibling, i.sibling = n, n = i, i = t;
        }
        zs(
          e,
          !0,
          n,
          null,
          o,
          a
        );
        break;
      case "together":
        zs(
          e,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        n = mm(e.child), n === null ? (i = e.child, e.child = null) : (i = n.sibling, n.sibling = null), zs(
          e,
          !1,
          i,
          n,
          o,
          a
        );
    }
    return e.child;
  }
  function gm(t, e, n) {
    var a = e.pendingProps;
    return Ol(e, e.type, a.value), ze(t, e, a.children, n), e.child;
  }
  function Wa(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), Vl |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (bi(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(u(153));
    if (e.child !== null) {
      for (t = e.child, n = Ka(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = Ka(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function Wc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && cs(t)));
  }
  function Fy(t, e, n) {
    switch (e.tag) {
      case 3:
        aa(e, e.stateNode.containerInfo), Ol(e, we, t.memoizedState.cache), pi();
        break;
      case 27:
      case 5:
        ei(e);
        break;
      case 4:
        aa(e, e.stateNode.containerInfo);
        break;
      case 10:
        Ol(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Tc(e), null;
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return jl(e), e.flags |= 128, null;
          a = bi(
            t,
            e,
            n,
            !1
          );
          var i = e.child.childLanes;
          return a || (n & i) !== 0 ? dm(t, e, n) : (jl(e), t = Wa(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        }
        jl(e);
        break;
      case 19:
        if (e.flags & 128)
          return Pc(
            t,
            e,
            n
          );
        if (i = (t.flags & 128) !== 0, a = (n & e.childLanes) !== 0, a || (bi(
          t,
          e,
          n,
          !1
        ), a = (n & e.childLanes) !== 0), i) {
          if (a)
            return Pc(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (i = e.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), dr(e, Ke.current), a) break;
        return null;
      case 22:
        return e.lanes = 0, om(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        Ol(e, we, t.memoizedState.cache);
    }
    return Wa(t, e, n);
  }
  function vm(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Ae = !0;
      else {
        if (!Wc(t, n) && (e.flags & 128) === 0)
          return Ae = !1, Fy(
            t,
            e,
            n
          );
        Ae = (t.flags & 131072) !== 0;
      }
    else
      Ae = !1, Mt && (e.flags & 1048576) !== 0 && K0(e, ar, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (t = _i(e.elementType), e.type = t, typeof t == "function")
            oc(t) ? (a = Ai(t, a), e.tag = 1, e = cm(
              null,
              e,
              t,
              a,
              n
            )) : (e.tag = 0, e = Zc(
              null,
              e,
              t,
              a,
              n
            ));
          else {
            if (t != null) {
              var i = t.$$typeof;
              if (i === Z) {
                e.tag = 11, e = am(
                  null,
                  e,
                  t,
                  a,
                  n
                );
                break t;
              } else if (i === ft) {
                e.tag = 14, e = lm(
                  null,
                  e,
                  t,
                  a,
                  n
                );
                break t;
              } else if (i === vt) {
                e.tag = 10, e.type = t, e = gm(
                  null,
                  e,
                  n
                );
                break t;
              }
            }
            throw e = st(t) || t, Error(u(306, e, ""));
          }
        }
        return e;
      case 0:
        return Zc(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return a = e.type, i = Ai(
          a,
          e.pendingProps
        ), cm(
          t,
          e,
          a,
          i,
          n
        );
      case 3:
        t: {
          if (aa(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(u(387));
          a = e.pendingProps;
          var o = e.memoizedState;
          i = o.element, bc(t, e), fr(e, a, null, n);
          var c = e.memoizedState;
          if (a = c.cache, Ol(e, we, a), a !== o.cache && hc(
            e,
            [we],
            n,
            !0
          ), cr(), a = c.element, o.isDehydrated)
            if (o = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = fm(
                t,
                e,
                a,
                n
              );
              break t;
            } else if (a !== i) {
              i = Jn(
                Error(u(424)),
                e
              ), lr(i), e = fm(
                t,
                e,
                a,
                n
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, ae = ta(t.firstChild), He = e, Mt = !0, Cl = null, Pn = !0, n = oh(
                e,
                null,
                a,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
          else {
            if (pi(), a === i) {
              e = Wa(
                t,
                e,
                n
              );
              break t;
            }
            ze(t, e, a, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return co(t, e), t === null ? (n = kg(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : Mt || (e.stateNode = Sg(
          e.type,
          e.pendingProps,
          Gn.current,
          e
        )) : e.memoizedState = kg(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return ei(e), t === null && Mt && (a = e.stateNode = Bg(
          e.type,
          e.pendingProps,
          Gn.current
        ), He = e, Pn = !0, i = ae, Gl(e.type) ? (Ff = i, ae = ta(a.firstChild)) : ae = i), ze(
          t,
          e,
          e.pendingProps.children,
          n
        ), co(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && Mt && ((i = a = ae) && (a = Xb(
          a,
          e.type,
          e.pendingProps,
          Pn
        ), a !== null ? (e.stateNode = a, He = e, ae = ta(a.firstChild), Pn = !1, i = !0) : i = !1), i || Al(e)), ei(e), i = e.type, o = e.pendingProps, c = t !== null ? t.memoizedProps : null, a = o.children, kf(i, o) ? a = null : c !== null && kf(i, c) && (e.flags |= 32), e.memoizedState !== null && (i = Ac(
          t,
          e,
          Vy,
          null,
          null,
          n
        ), No._currentValue = i), co(t, e), ze(t, e, a, n), e.child;
      case 6:
        return t === null && Mt && ((t = n = ae) && (n = Qb(
          n,
          e.pendingProps,
          Pn
        ), n !== null ? (e.stateNode = n, He = e, ae = null, t = !0) : t = !1), t || Al(e)), null;
      case 13:
        return dm(t, e, n);
      case 4:
        return aa(
          e,
          e.stateNode.containerInfo
        ), a = e.pendingProps, t === null ? e.child = wi(
          e,
          null,
          a,
          n
        ) : ze(t, e, a, n), e.child;
      case 11:
        return am(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return a = e.pendingProps, co(t, e), ze(t, e, a, n), e.child;
      case 8:
        return ze(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return ze(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return gm(t, e, n);
      case 9:
        return i = e.type._context, a = e.pendingProps.children, Si(e), i = Qe(i), a = a(i), e.flags |= 1, ze(t, e, a, n), e.child;
      case 14:
        return lm(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return im(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return Pc(t, e, n);
      case 31:
        return Iy(t, e, n);
      case 22:
        return om(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return Si(e), a = Qe(we), t === null ? (i = vc(), i === null && (i = te, o = mc(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), e.memoizedState = { parent: a, cache: i }, yc(e), Ol(e, we, i)) : ((t.lanes & n) !== 0 && (bc(t, e), fr(e, null, null, n), cr()), i = t.memoizedState, o = e.memoizedState, i.parent !== a ? (i = { parent: a, cache: a }, e.memoizedState = i, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = i), Ol(e, we, a)) : (a = o.cache, Ol(e, we, a), a !== i.cache && hc(
          e,
          [we],
          n,
          !0
        ))), ze(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 30:
        return e.stateNode === null && (e.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = e.pendingProps, a.name != null && a.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : Mt && rs(e), t !== null && t.memoizedProps.name !== a.name ? e.flags |= 4194816 : co(t, e), ze(t, e, a.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(u(156, e.tag));
  }
  function tl(t) {
    t.flags |= 4;
  }
  function tf(t, e, n, a, i) {
    var o;
    if ((o = (t.mode & 32) !== 0) && (o = n === null ? Qg(e, a) : Qg(e, a) && (a.src !== n.src || a.srcSet !== n.srcSet)), o) {
      if (t.flags |= 16777216, (i & 335544128) === i)
        if (t.stateNode.complete) t.flags |= 8192;
        else if ($m()) t.flags |= 8192;
        else
          throw Ti = ms, pc;
    } else t.flags &= -16777217;
  }
  function pm(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Zg(e))
      if ($m()) t.flags |= 8192;
      else
        throw Ti = ms, pc;
  }
  function Ms(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? ra() : 536870912, t.lanes |= e, vo |= e);
  }
  function pr(t, e) {
    if (!Mt)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = t.tail, a = null; n !== null; )
            n.alternate !== null && (a = n), n = n.sibling;
          a === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (e = t.tail, n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
      }
  }
  function le(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, a = 0;
    if (e)
      for (var i = t.child; i !== null; )
        n |= i.lanes | i.childLanes, a |= i.subtreeFlags & 1206910976, a |= i.flags & 1206910976, i.return = t, i = i.sibling;
    else
      for (i = t.child; i !== null; )
        n |= i.lanes | i.childLanes, a |= i.subtreeFlags, a |= i.flags, i.return = t, i = i.sibling;
    return t.subtreeFlags |= a, t.childLanes = n, e;
  }
  function $y(t, e, n) {
    var a = e.pendingProps;
    switch (uc(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return le(e), null;
      case 1:
        return le(e), null;
      case 3:
        return n = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), Fa(we), nn(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (ao(e) ? tl(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, fc())), le(e), null;
      case 26:
        var i = e.type, o = e.memoizedState;
        return t === null ? (tl(e), o !== null ? (le(e), pm(e, o)) : (le(e), tf(
          e,
          i,
          null,
          a,
          n
        ))) : o ? o !== t.memoizedState ? (tl(e), le(e), pm(e, o)) : (le(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && tl(e), le(e), tf(
          e,
          i,
          t,
          a,
          n
        )), null;
      case 27:
        if (hl(e), n = Gn.current, i = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(u(166));
            return le(e), e.subtreeFlags &= -33554433, null;
          }
          t = me.current, ao(e) ? J0(e) : (t = Bg(i, a, n), e.stateNode = t, tl(e));
        }
        return le(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (hl(e), i = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(u(166));
            return le(e), e.subtreeFlags &= -33554433, null;
          }
          if (o = me.current, ao(e))
            J0(e);
          else {
            var c = Or(
              Gn.current
            );
            switch (o) {
              case 1:
                o = c.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                o = c.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    o = c.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    o = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    o = c.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(
                      o.firstChild
                    );
                    break;
                  case "select":
                    o = typeof a.is == "string" ? c.createElement("select", {
                      is: a.is
                    }) : c.createElement("select"), a.multiple ? o.multiple = !0 : a.size && (o.size = a.size);
                    break;
                  default:
                    o = typeof a.is == "string" ? c.createElement(i, { is: a.is }) : c.createElement(i);
                }
            }
            o[ce] = e, o[qe] = a;
            t: for (c = e.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                o.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                c.child.return = c, c = c.child;
                continue;
              }
              if (c === e) break t;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === e)
                  break t;
                c = c.return;
              }
              c.sibling.return = c.return, c = c.sibling;
            }
            e.stateNode = o;
            t: switch (Je(o, i, a), i) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && tl(e);
          }
        }
        return le(e), e.subtreeFlags &= -33554433, tf(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (typeof a != "string" && e.stateNode === null)
            throw Error(u(166));
          if (t = Gn.current, ao(e)) {
            if (t = e.stateNode, n = e.memoizedProps, a = null, i = He, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  a = i.memoizedProps;
              }
            t[ce] = e, t = !!(t.nodeValue === n || a !== null && a.suppressHydrationWarning === !0 || vg(t.nodeValue, n)), t || Al(e, !0);
          } else
            t = Or(t).createTextNode(
              a
            ), t[ce] = e, e.stateNode = t;
        }
        return le(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (a = ao(e), n !== null) {
            if (t === null) {
              if (!a) throw Error(u(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(557));
              t[ce] = e;
            } else
              pi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            le(e), t = !1;
          } else
            n = fc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (Rn(e), e) : (Rn(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(u(558));
        }
        return le(e), null;
      case 13:
        if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (i = ao(e), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!i) throw Error(u(318));
              if (i = e.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(u(317));
              i[ce] = e;
            } else
              pi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            le(e), i = !1;
          } else
            i = fc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = i), i = !0;
          if (!i)
            return e.flags & 256 ? (Rn(e), e) : (Rn(e), null);
        }
        return Rn(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = a !== null, t = t !== null && t.memoizedState !== null, n && (a = e.child, i = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (i = a.alternate.memoizedState.cachePool.pool), o = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (o = a.memoizedState.cachePool.pool), o !== i && (a.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Ms(e, e.updateQueue), le(e), null);
      case 4:
        return nn(), t === null && Uf(e.stateNode.containerInfo), e.flags |= 67108864, le(e), null;
      case 10:
        return Fa(e.type), le(e), null;
      case 19:
        if (wc(e), a = e.memoizedState, a === null) return le(e), null;
        if (i = (e.flags & 128) !== 0, o = a.rendering, o === null)
          if (i) pr(a, !1);
          else {
            if (pe !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (o = ys(t), o !== null) {
                  for (e.flags |= 128, pr(a, !1), t = o.updateQueue, e.updateQueue = t, Ms(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    X0(n, t), n = n.sibling;
                  return dr(
                    e,
                    Ke.current & 1 | 2
                  ), Mt && Ia(e, a.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && Ye() > Qs && (e.flags |= 128, i = !0, pr(a, !1), e.lanes = 4194304);
          }
        else {
          if (!i)
            if (t = ys(o), t !== null) {
              if (e.flags |= 128, i = !0, t = t.updateQueue, e.updateQueue = t, Ms(e, t), pr(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !o.alternate && !Mt)
                return le(e), null;
            } else
              2 * Ye() - a.renderingStartTime > Qs && n !== 536870912 && (e.flags |= 128, i = !0, pr(a, !1), e.lanes = 4194304);
          a.isBackwards ? (o.sibling = e.child, e.child = o) : (t = a.last, t !== null ? t.sibling = o : e.child = o, a.last = o);
        }
        if (a.tail !== null) {
          t = a.tail;
          t: {
            for (n = t; n !== null; ) {
              if (n.alternate !== null) {
                n = !1;
                break t;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Ye(), t.sibling = null, o = Ke.current, o = i ? o & 1 | 2 : o & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !n || Mt ? dr(e, o) : (n = o, Gt(Ze, e), Gt(Ke, n), We === null && (We = e)), Mt && Ia(e, a.treeForkCount), t;
        }
        return le(e), null;
      case 22:
      case 23:
        return Rn(e), _c(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (le(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : le(e), n = e.updateQueue, n !== null && Ms(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== n && (e.flags |= 2048), t !== null && ee(Ei), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Fa(we), le(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, le(e), null;
    }
    throw Error(u(156, e.tag));
  }
  function Py(t, e) {
    switch (uc(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return Fa(we), nn(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return hl(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Rn(e), e.alternate === null)
            throw Error(u(340));
          pi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Rn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(u(340));
          pi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return wc(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return nn(), null;
      case 10:
        return Fa(e.type), null;
      case 22:
      case 23:
        return Rn(e), _c(), t !== null && ee(Ei), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Fa(we), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ym(t, e) {
    switch (uc(e), e.tag) {
      case 3:
        Fa(we), nn();
        break;
      case 26:
      case 27:
      case 5:
        hl(e);
        break;
      case 4:
        nn();
        break;
      case 31:
        e.memoizedState !== null && Rn(e);
        break;
      case 13:
        Rn(e);
        break;
      case 19:
        wc(e);
        break;
      case 10:
        Fa(e.type);
        break;
      case 22:
      case 23:
        Rn(e), _c(), t !== null && ee(Ei);
        break;
      case 24:
        Fa(we);
    }
  }
  function yr(t, e) {
    try {
      var n = e.updateQueue, a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var i = a.next;
        n = i;
        do {
          if ((n.tag & t) === t) {
            a = void 0;
            var o = n.create, c = n.inst;
            a = o(), c.destroy = a;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (g) {
      Jt(e, e.return, g);
    }
  }
  function Ul(t, e, n) {
    try {
      var a = e.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next;
        a = o;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst, g = c.destroy;
            if (g !== void 0) {
              c.destroy = void 0, i = e;
              var T = n, L = g;
              try {
                L();
              } catch (G) {
                Jt(
                  i,
                  T,
                  G
                );
              }
            }
          }
          a = a.next;
        } while (a !== o);
      }
    } catch (G) {
      Jt(e, e.return, G);
    }
  }
  function bm(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        sh(e, n);
      } catch (a) {
        Jt(t, t.return, a);
      }
    }
  }
  function Sm(t, e, n) {
    n.props = Ai(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (a) {
      Jt(t, e, a);
    }
  }
  function Ea(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            var i = t.stateNode, o = Qa(t.memoizedProps, i);
            (i.ref === null || i.ref.name !== o) && (i.ref = Ag(o)), a = i.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var c = new Un(t);
              h(
                t.child,
                !1,
                qb,
                c,
                void 0,
                void 0
              ), t.stateNode = c;
            }
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(a) : n.current = a;
      }
    } catch (g) {
      Jt(t, e, g);
    }
  }
  function Ie(t, e) {
    var n = t.ref, a = t.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (i) {
          Jt(t, e, i);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          Jt(t, e, i);
        }
      else n.current = null;
  }
  function js(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var n = 0; n < e.length; n++)
        Mg(
          t.stateNode,
          e[n]
        );
  }
  function xm(t) {
    for (var e = t.return; e !== null && (nf(e) && Mg(t.stateNode, e.stateNode), !ef(e)); )
      e = e.return;
  }
  function br(t) {
    for (var e = t.return; e !== null && (nf(e) && Gb(t.stateNode, e.stateNode), !ef(e)); )
      e = e.return;
  }
  function ef(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function nf(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function af(t) {
    var e = t.type, n = t.memoizedProps, a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break t;
        case "img":
          n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (i) {
      Jt(t, t.return, i);
    }
  }
  function lf(t, e, n) {
    try {
      var a = t.stateNode;
      Tb(a, t.type, n, e), a[qe] = e;
    } catch (i) {
      Jt(t, t.return, i);
    }
  }
  function Em(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Gl(t.type) || t.tag === 4;
  }
  function of(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Em(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && Gl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function rf(t, e, n, a) {
    var i = t.tag;
    if (i === 5 || i === 6)
      i = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(i), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = ln)), js(t, a), xt = !0;
    else if (i !== 4 && (i === 27 && (js(t, a), a = null, Gl(t.type) && (n = t.stateNode, e = null)), t = t.child, t !== null))
      for (rf(
        t,
        e,
        n,
        a
      ), t = t.sibling; t !== null; )
        rf(
          t,
          e,
          n,
          a
        ), t = t.sibling;
  }
  function Hs(t, e, n, a) {
    var i = t.tag;
    if (i === 5 || i === 6)
      i = t.stateNode, e ? n.insertBefore(i, e) : n.appendChild(i), js(t, a), xt = !0;
    else if (i !== 4 && (i === 27 && (js(t, a), a = null, Gl(t.type) && (n = t.stateNode)), t = t.child, t !== null))
      for (Hs(
        t,
        e,
        n,
        a
      ), t = t.sibling; t !== null; )
        Hs(
          t,
          e,
          n,
          a
        ), t = t.sibling;
  }
  function _m(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var a = t.type, i = e.attributes; i.length; )
        e.removeAttributeNode(i[0]);
      Je(e, a, n), e[ce] = t, e[qe] = n;
    } catch (o) {
      Jt(t, t.return, o);
    }
  }
  var Us = !1, zn = null;
  function Tm(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (Us = !0);
  }
  var _a = null;
  function wm() {
    var t = _a;
    return _a = null, t;
  }
  var yn = 0;
  function fo(t, e, n, a, i) {
    return yn = 0, Cm(
      t.child,
      e,
      n,
      a,
      i
    );
  }
  function Cm(t, e, n, a, i) {
    for (var o = !1; t !== null; ) {
      if (t.tag === 5) {
        var c = t.stateNode;
        if (a !== null) {
          var g = Xf(c);
          a.push(g), g.view && (o = !0);
        } else
          o || Xf(c).view && (o = !0);
        Us = !0, wg(
          c,
          yn === 0 ? e : e + "_" + yn,
          n
        ), yn++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i || Cm(
        t.child,
        e,
        n,
        a,
        i
      ) && (o = !0));
      t = t.sibling;
    }
    return o;
  }
  function Ta(t, e) {
    for (; t !== null; )
      t.tag === 5 ? Cg(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || Ta(
        t.child,
        e
      )), t = t.sibling;
  }
  function Bs(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (Bs(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(u(544));
          var n = e.name;
          e = Za(e.default, e.share), e !== "none" && (fo(
            t,
            n,
            e,
            null,
            !1
          ) || Ta(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function sf(t, e) {
    if (t.tag === 30) {
      var n = t.stateNode, a = t.memoizedProps, i = Qa(a, n), o = Za(
        a.default,
        n.paired ? a.share : a.enter
      );
      o !== "none" ? fo(t, i, o, null, !1) ? (Bs(t), n.paired || e || So(t, a.onEnter)) : Ta(t.child, !1) : Bs(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        sf(t, e), t = t.sibling;
    else Bs(t);
  }
  function uf(t) {
    if (zn !== null && zn.size !== 0) {
      var e = zn;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var n = t.memoizedProps, a = n.name;
              if (a != null && a !== "auto") {
                var i = e.get(a);
                if (i !== void 0) {
                  var o = Za(
                    n.default,
                    n.share
                  );
                  if (o !== "none" && (fo(
                    t,
                    a,
                    o,
                    null,
                    !1
                  ) ? (o = t.stateNode, i.paired = o, o.paired = i, So(t, n.onShare)) : Ta(t.child, !1)), e.delete(a), e.size === 0) break;
                }
              }
            }
            uf(t);
          }
          t = t.sibling;
        }
    }
  }
  function cf(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, n = Qa(e, t.stateNode), a = zn !== null ? zn.get(n) : void 0, i = Za(
        e.default,
        a !== void 0 ? e.share : e.exit
      );
      i !== "none" && (fo(t, n, i, null, !1) ? a !== void 0 ? (i = t.stateNode, a.paired = i, i.paired = a, zn.delete(n), So(t, e.onShare)) : So(t, e.onExit) : Ta(t.child, !1)), zn !== null && uf(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        cf(t), t = t.sibling;
    else
      zn !== null && uf(t);
  }
  function Am(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, n = Qa(e, t.stateNode);
        e = Za(e.default, e.update), t.flags &= -5, e !== "none" && fo(
          t,
          n,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && Am(t);
      t = t.sibling;
    }
  }
  function ff(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, Ta(t.child, !1));
          }
          ff(t);
        }
        t = t.sibling;
      }
  }
  function Ls(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, Ta(t.child, !1), ff(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        Ls(t), t = t.sibling;
    else ff(t);
  }
  function Om(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? Ta(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && Om(t), t = t.sibling;
  }
  function df(t, e, n, a, i, o, c) {
    for (var g = !1; e !== null; ) {
      if (e.tag === 5) {
        var T = e.stateNode;
        if (o !== null && yn < o.length) {
          var L = o[yn], G = Xf(T);
          (L.view || G.view) && (g = !0);
          var F;
          if (F = (t.flags & 4) === 0)
            if (G.clip) F = !0;
            else {
              F = L.rect;
              var j = G.rect;
              F = F.y !== j.y || F.x !== j.x || F.height !== j.height || F.width !== j.width;
            }
          F && (t.flags |= 4), G.abs ? G = !L.abs : (L = L.rect, G = G.rect, G = L.height !== G.height || L.width !== G.width), G && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && wg(
          T,
          yn === 0 ? n : n + "_" + yn,
          i
        ), g && (t.flags & 4) !== 0 || (_a === null && (_a = []), _a.push(
          T,
          yn === 0 ? a : a + "_" + yn,
          e.memoizedProps
        )), yn++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && c ? t.flags |= e.flags & 32 : df(
        t,
        e.child,
        n,
        a,
        i,
        o,
        c
      ) && (g = !0));
      e = e.sibling;
    }
    return g;
  }
  function Nm(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var n = t.memoizedProps, a = t.stateNode, i = Qa(n, a), o = Za(n.default, n.update), c;
        c = t.memoizedState, t.memoizedState = null, a = t;
        var g = t.child;
        yn = 0, i = df(
          a,
          g,
          i,
          i,
          o,
          c,
          !1
        ), (t.flags & 4) !== 0 && i && So(t, n.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && Nm(t);
      t = t.sibling;
    }
  }
  var Ue = !1, Kt = !1, wa = !1, hf = !1, Dm = typeof WeakSet == "function" ? WeakSet : Set, Be = null, Ca = !1, Sr = !1, Vs = !1, mf = !1;
  function Wy(t, e, n) {
    if (t = t.containerInfo, Vf = Do, t = j0(t), Wu(t)) {
      if ("selectionStart" in t)
        var a = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          a = (a = t.ownerDocument) && a.defaultView || window;
          var i = a.getSelection && a.getSelection();
          if (i && i.rangeCount !== 0) {
            a = i.anchorNode;
            var o = i.anchorOffset, c = i.focusNode;
            i = i.focusOffset;
            try {
              a.nodeType, c.nodeType;
            } catch {
              a = null;
              break t;
            }
            var g = 0, T = -1, L = -1, G = 0, F = 0, j = t, Y = null;
            e: for (; ; ) {
              for (var rt; j !== a || o !== 0 && j.nodeType !== 3 || (T = g + o), j !== c || i !== 0 && j.nodeType !== 3 || (L = g + i), j.nodeType === 3 && (g += j.nodeValue.length), (rt = j.firstChild) !== null; )
                Y = j, j = rt;
              for (; ; ) {
                if (j === t) break e;
                if (Y === a && ++G === o && (T = g), Y === c && ++F === i && (L = g), (rt = j.nextSibling) !== null) break;
                j = Y, Y = j.parentNode;
              }
              j = rt;
            }
            a = T === -1 || L === -1 ? null : { start: T, end: L };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Yf = { focusedElem: t, selectionRange: a }, Do = !1, n = (n & 335544064) === n, Be = e, e = n ? 9270 : 1024; Be !== null; ) {
      if (t = Be, n && (a = t.deletions, a !== null))
        for (o = 0; o < a.length; o++)
          n && cf(a[o]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        n && Tm(t), Ys(n);
      else {
        if (t.tag === 22) {
          if (a = t.alternate, t.memoizedState !== null) {
            a !== null && a.memoizedState === null && n && cf(a), Ys(n);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            n && Tm(t), Ys(n);
            continue;
          }
        }
        a = t.child, (t.subtreeFlags & e) !== 0 && a !== null ? (a.return = t, Be = a) : (n && Am(t), Ys(n));
      }
    }
    zn = null;
  }
  function Ys(t) {
    for (; Be !== null; ) {
      var e = Be, n = t, a = e.alternate, i = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((i & 1024) !== 0 && a !== null) {
            n = void 0, i = a.memoizedProps, a = a.memoizedState;
            var o = e.stateNode;
            try {
              var c = Ai(
                e.type,
                i
              );
              n = o.getSnapshotBeforeUpdate(
                c,
                a
              ), o.__reactInternalSnapshotBeforeUpdate = n;
            } catch (g) {
              Jt(e, e.return, g);
            }
          }
          break;
        case 3:
          if ((i & 1024) !== 0) {
            if (a = e.stateNode.containerInfo, n = a.nodeType, n === 9)
              Kf(a);
            else if (n === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Kf(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n && a !== null && (n = Qa(
            a.memoizedProps,
            a.stateNode
          ), i = e.memoizedProps, i = Za(i.default, i.update), i !== "none" && fo(
            a,
            n,
            i,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((i & 1024) !== 0) throw Error(u(163));
      }
      if (a = e.sibling, a !== null) {
        a.return = e.return, Be = a;
        break;
      }
      Be = e.return;
    }
  }
  function Rm(t, e, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Aa(t, n), a & 4 && yr(5, n);
        break;
      case 1:
        if (Aa(t, n), a & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (c) {
              Jt(n, n.return, c);
            }
          else {
            var i = Ai(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                i,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              Jt(
                n,
                n.return,
                c
              );
            }
          }
        a & 64 && bm(n), a & 512 && Ea(n, n.return);
        break;
      case 3:
        if (Aa(t, n), a & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            sh(t, e);
          } catch (c) {
            Jt(n, n.return, c);
          }
        }
        break;
      case 27:
        e === null && a & 4 && _m(n);
      case 26:
      case 5:
        Aa(t, n), e === null && a & 4 && af(n), a & 512 && Ea(n, n.return);
        break;
      case 12:
        Aa(t, n);
        break;
      case 31:
        Aa(t, n), a & 4 && Hm(t, n);
        break;
      case 13:
        Aa(t, n), a & 4 && Um(t, n), a & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = fb.bind(
          null,
          n
        ), Zb(t, n))));
        break;
      case 22:
        if (a = n.memoizedState !== null || Ue, !a) {
          var o = e !== null && e.memoizedState !== null || Kt;
          e = Ue, i = Kt, Ue = a, (Kt = o) && !i ? (a = 2, (n.subtreeFlags & 8772) !== 0 && (a |= 1), ha(
            t,
            n,
            a
          )) : Aa(t, n), Ue = e, Kt = i;
        }
        break;
      case 30:
        Aa(t, n), a & 512 && Ea(n, n.return);
        break;
      case 7:
        a & 512 && Ea(n, n.return);
      default:
        Aa(t, n);
    }
  }
  function gf(t, e) {
    for (t = t.child; t !== null; )
      zm(t, e), t = t.sibling;
  }
  function zm(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var n = t.stateNode;
          if (e) {
            var a = n.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var i = t.stateNode, o = t.memoizedProps.style, c = o != null && o.hasOwnProperty("display") ? o.display : null;
            i.style.display = c == null || typeof c == "boolean" ? "" : ("" + c).trim();
          }
        } catch (T) {
          Jt(t, t.return, T);
        }
        vf(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, xt = !0;
        } catch (T) {
          Jt(t, t.return, T);
        }
        break;
      case 18:
        try {
          var g = t.stateNode;
          e ? Tg(g, !0) : Tg(t.stateNode, !1);
        } catch (T) {
          Jt(t, t.return, T);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && gf(t, e);
        break;
      default:
        gf(t, e);
    }
  }
  function vf(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var n = t, a = e;
          switch (n.tag) {
            case 4:
              zm(n, a);
              break t;
            case 22:
              n.memoizedState === null && vf(n, a);
              break t;
            default:
              vf(n, a);
          }
        }
        t = t.sibling;
      }
  }
  function Mm(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Mm(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Qi(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var se = null, bn = !1;
  function fa(t, e, n) {
    for (n = n.child; n !== null; )
      jm(t, e, n), n = n.sibling;
  }
  function jm(t, e, n) {
    if (Xt && typeof Xt.onCommitFiberUnmount == "function")
      try {
        Xt.onCommitFiberUnmount(ie, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Kt || Ie(n, e), fa(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Kt && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Kt || Ie(n, e), br(n);
        var a = se, i = bn;
        Gl(n.type) && (se = n.stateNode, bn = !1), fa(
          t,
          e,
          n
        ), Lg(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), se = a, bn = i;
        break;
      case 5:
        Kt || Ie(n, e), br(n);
      case 6:
        if (n.tag === 6 && br(n), a = se, i = bn, se = null, fa(
          t,
          e,
          n
        ), se = a, bn = i, se !== null)
          if (bn)
            try {
              (se.nodeType === 9 ? se.body : se.nodeName === "HTML" ? se.ownerDocument.body : se).removeChild(n.stateNode), xt = !0;
            } catch (o) {
              Jt(
                n,
                e,
                o
              );
            }
          else
            try {
              se.removeChild(n.stateNode), xt = !0;
            } catch (o) {
              Jt(
                n,
                e,
                o
              );
            }
        break;
      case 18:
        se !== null && (bn ? (t = se, _g(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), Ro(t)) : _g(se, n.stateNode));
        break;
      case 4:
        a = se, i = bn, se = n.stateNode.containerInfo, bn = !0, fa(
          t,
          e,
          n
        ), se = a, bn = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ul(2, n, e), Kt || Ul(4, n, e), fa(
          t,
          e,
          n
        );
        break;
      case 1:
        Kt || (Ie(n, e), a = n.stateNode, typeof a.componentWillUnmount == "function" && Sm(
          n,
          e,
          a
        )), fa(
          t,
          e,
          n
        );
        break;
      case 21:
        fa(
          t,
          e,
          n
        );
        break;
      case 22:
        Kt = (a = Kt) || n.memoizedState !== null, fa(
          t,
          e,
          n
        ), Kt = a;
        break;
      case 30:
        Ie(n, e), fa(
          t,
          e,
          n
        );
        break;
      case 7:
        Kt || Ie(n, e), fa(
          t,
          e,
          n
        );
        break;
      default:
        fa(
          t,
          e,
          n
        );
    }
  }
  function Hm(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Ro(t);
      } catch (n) {
        Jt(e, e.return, n);
      }
    }
  }
  function Um(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Ro(t);
      } catch (n) {
        Jt(e, e.return, n);
      }
  }
  function tb(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Dm()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Dm()), e;
      default:
        throw Error(u(435, t.tag));
    }
  }
  function ks(t, e) {
    var n = tb(t);
    e.forEach(function(a) {
      if (!n.has(a)) {
        n.add(a);
        var i = db.bind(null, t, a);
        a.then(i, i);
      }
    });
  }
  function sn(t, e, n) {
    var a = e.deletions;
    if (a !== null)
      for (var i = 0; i < a.length; i++) {
        var o = a[i], c = t, g = e, T = g;
        t: for (; T !== null; ) {
          switch (T.tag) {
            case 27:
              if (Gl(T.type)) {
                se = T.stateNode, bn = !1;
                break t;
              }
              break;
            case 5:
              se = T.stateNode, bn = !1;
              break t;
            case 3:
            case 4:
              se = T.stateNode.containerInfo, bn = !0;
              break t;
          }
          T = T.return;
        }
        if (se === null) throw Error(u(160));
        jm(c, g, o), se = null, bn = !1, c = o.alternate, c !== null && (c.return = null), o.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        Bm(e, t, n), e = e.sibling;
  }
  var da = null;
  function Bm(t, e, n) {
    var a = t.alternate, i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (i & 4 && (a = t.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var o = 0; o < a.length; o++) {
            var c = a[o];
            c.ref.impl = c.nextImpl;
          }
        sn(e, t, n), un(t), i & 4 && (Ul(3, t, t.return), yr(3, t), Ul(5, t, t.return));
        break;
      case 1:
        sn(e, t, n), un(t), i & 512 && (Kt || a === null || Ie(a, a.return)), i & 64 && Ue && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? e : n.concat(e))));
        break;
      case 26:
        if (o = da, sn(e, t, n), un(t), i & 512 && (Kt || a === null || Ie(a, a.return)), i & 4)
          if (i = a !== null ? a.memoizedState : null, n = t.memoizedState, a === null)
            if (n === null)
              if (t.stateNode === null)
                if (Ue)
                  t.stateNode = Sg(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, n = t.memoizedProps, i = o.ownerDocument || o;
                    e: switch (e) {
                      case "title":
                        a = i.getElementsByTagName("title")[0], (!a || a[oi] || a[ce] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = i.createElement(e), i.head.insertBefore(
                          a,
                          i.querySelector("head > title")
                        )), Je(a, e, n), a[ce] = t, W(a), e = a;
                        break t;
                      case "link":
                        if (o = Xg(
                          "link",
                          "href",
                          i
                        ).get(e + (n.href || ""))) {
                          for (c = 0; c < o.length; c++)
                            if (a = o[c], a.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && a.getAttribute("rel") === (n.rel == null ? null : n.rel) && a.getAttribute("title") === (n.title == null ? null : n.title) && a.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              o.splice(c, 1);
                              break e;
                            }
                        }
                        a = i.createElement(e), Je(a, e, n), i.head.appendChild(a);
                        break;
                      case "meta":
                        if (o = Xg(
                          "meta",
                          "content",
                          i
                        ).get(e + (n.content || ""))) {
                          for (c = 0; c < o.length; c++)
                            if (a = o[c], a.getAttribute("content") === (n.content == null ? null : "" + n.content) && a.getAttribute("name") === (n.name == null ? null : n.name) && a.getAttribute("property") === (n.property == null ? null : n.property) && a.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && a.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              o.splice(c, 1);
                              break e;
                            }
                        }
                        a = i.createElement(e), Je(a, e, n), i.head.appendChild(a);
                        break;
                      default:
                        throw Error(u(468, e));
                    }
                    a[ce] = t, W(a), e = a;
                  }
                  t.stateNode = e;
                }
              else
                Ue || td(o, t.type, t.stateNode);
            else
              t.stateNode = Gg(
                o,
                n,
                t.memoizedProps
              );
          else
            i !== n ? (i === null ? (e = a.stateNode, e === null || Kt || e.parentNode.removeChild(e)) : i.count--, n === null ? Ue || td(o, t.type, t.stateNode) : Gg(o, n, t.memoizedProps)) : n === null && t.stateNode !== null && lf(
              t,
              t.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        sn(e, t, n), un(t), i & 512 && (Kt || a === null || Ie(a, a.return)), a !== null && i & 4 && lf(
          t,
          t.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (o = wa, wa = !1, sn(e, t, n), wa = o, un(t), i & 512 && (Kt || a === null || Ie(a, a.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            an(e, ""), xt = !0;
          } catch (G) {
            Jt(t, t.return, G);
          }
        }
        i & 4 && t.stateNode != null && (e = t.memoizedProps, lf(
          t,
          e,
          a !== null ? a.memoizedProps : e
        )), i & 1024 && (hf = !0);
        break;
      case 6:
        if (sn(e, t, n), un(t), i & 4) {
          if (t.stateNode === null)
            throw Error(u(162));
          e = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = e, xt = !0;
          } catch (G) {
            Jt(t, t.return, G);
          }
        }
        break;
      case 3:
        if (xt = !1, nu = null, o = da, da = Nr(e.containerInfo), sn(e, t, n), da = o, un(t), i & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Ro(e.containerInfo);
          } catch (G) {
            Jt(t, t.return, G);
          }
        hf && (hf = !1, Lm(t)), xt = !1;
        break;
      case 4:
        i = wa, wa = Ue, a = Re(), o = da, da = Nr(
          t.stateNode.containerInfo
        ), sn(e, t, n), un(t), da = o, xt && Sr && (Vs = !0), xt = a, wa = i;
        break;
      case 12:
        sn(e, t, n), un(t);
        break;
      case 31:
        sn(e, t, n), un(t), i & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ks(t, e)));
        break;
      case 13:
        sn(e, t, n), un(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Xs = Ye()), i & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ks(t, e)));
        break;
      case 22:
        o = t.memoizedState !== null, c = a !== null && a.memoizedState !== null;
        var g = Ue, T = Kt, L = wa;
        Ue = g || o, wa = L || o, Kt = T || c, sn(e, t, n), Kt = T, wa = L, Ue = g, un(t), i & 8192 && (e = t.stateNode, e._visibility = o ? e._visibility & -2 : e._visibility | 1, !o || a === null || c || Ue || Kt || (e = c || Kt, n = Ue, a = Kt, Ue = o || Ue, Kt = e, Bl(t, 2), Ue = n, Kt = a), !o && wa || gf(t, o)), i & 4 && (e = t.updateQueue, e !== null && (n = e.retryQueue, n !== null && (e.retryQueue = null, ks(t, n))));
        break;
      case 19:
        sn(e, t, n), un(t), i & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ks(t, e)));
        break;
      case 30:
        i & 512 && (Kt || a === null || Ie(a, a.return)), i = Re(), o = Sr, c = (n & 335544064) === n, g = t.memoizedProps, Sr = c && Za(
          g.default,
          g.update
        ) !== "none", sn(e, t, n), un(t), c && a !== null && xt && (t.flags |= 4), Sr = o, xt = i;
        break;
      case 21:
        break;
      case 7:
        i & 512 && (Kt || a === null || Ie(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = t);
      default:
        sn(e, t, n), un(t);
    }
  }
  function un(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, a = t.return; a !== null; ) {
          if (Em(a)) {
            n = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var i = t.return; i !== null; ) {
          if (nf(i)) {
            var o = i.stateNode;
            a === null ? a = [o] : a.push(o);
          }
          if (ef(i)) break;
          i = i.return;
        }
        var c = a;
        if (n == null) throw Error(u(160));
        switch (n.tag) {
          case 27:
            var g = n.stateNode, T = of(t);
            Hs(
              t,
              T,
              g,
              c
            );
            break;
          case 5:
            var L = n.stateNode;
            n.flags & 32 && (an(L, ""), n.flags &= -33);
            var G = of(t);
            Hs(
              t,
              G,
              L,
              c
            );
            break;
          case 3:
          case 4:
            var F = n.stateNode.containerInfo, j = of(t);
            rf(
              t,
              j,
              F,
              c
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch (Y) {
        Jt(t, t.return, Y);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Lm(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Lm(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, Do = !0, e.reset(), Do = !1), t = t.sibling;
      }
  }
  function ho(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        Vm(e, t), e = e.sibling;
    else Nm(e);
  }
  function Vm(t, e) {
    var n = t.alternate;
    if (n === null) sf(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (mf = Ca = !1, wm(), ho(e, t), !Ca && !Vs) {
            if (t = _a, t !== null)
              for (var a = 0; a < t.length; a += 3) {
                n = t[a];
                var i = t[a + 1];
                Cg(n, t[a + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + i + ")"
                  }
                );
              }
            t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), mf = !0;
          }
          _a = null;
          break;
        case 5:
          ho(e, t);
          break;
        case 4:
          a = Ca, Ca = !1, ho(e, t), Ca && (Vs = !0), Ca = a;
          break;
        case 22:
          t.memoizedState === null && (n.memoizedState !== null ? sf(t, !1) : ho(e, t));
          break;
        case 30:
          a = Ca, i = wm(), Ca = !1, ho(e, t), Ca && (t.flags |= 4);
          var o = t.memoizedProps, c = t.stateNode;
          e = Qa(o, c), c = Qa(n.memoizedProps, c);
          var g = Za(o.default, o.update);
          g === "none" ? e = !1 : (o = n.memoizedState, n.memoizedState = null, n = t.child, yn = 0, e = df(
            t,
            n,
            e,
            c,
            g,
            o,
            !0
          ), yn !== (o === null ? 0 : o.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (So(
            t,
            t.memoizedProps.onUpdate
          ), _a = i) : i !== null && (i.push.apply(i, _a), _a = i), Ca = (t.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          ho(e, t);
      }
  }
  function Aa(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        Rm(t, e.alternate, e), e = e.sibling;
  }
  function Bl(t, e) {
    for (t = t.child; t !== null; ) {
      var n = t, a = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ul(4, n, n.return), Bl(
            n,
            a
          );
          break;
        case 1:
          Ie(n, n.return);
          var i = n.stateNode;
          typeof i.componentWillUnmount == "function" && Sm(
            n,
            n.return,
            i
          ), Bl(
            n,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && Lg(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          Ie(n, n.return), n.tag !== 5 && n.tag !== 27 || br(n), Bl(
            n,
            a
          );
          break;
        case 6:
          br(n);
          break;
        case 26:
          Ie(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || Kt || i.parentNode.removeChild(i), Bl(
            n,
            a
          );
          break;
        case 22:
          n.memoizedState === null && Bl(
            n,
            a
          );
          break;
        case 30:
          Ie(n, n.return), Bl(
            n,
            a
          );
          break;
        case 7:
          Ie(n, n.return);
        default:
          Bl(
            n,
            a
          );
      }
      t = t.sibling;
    }
  }
  function ha(t, e, n) {
    for (n = (e.subtreeFlags & 8772) !== 0 ? n : n & -2, e = e.child; e !== null; ) {
      var a = e.alternate, i = t, o = e, c = o.flags, g = (n & 1) !== 0;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          ha(
            i,
            o,
            n
          ), yr(4, o);
          break;
        case 1:
          if (ha(
            i,
            o,
            n
          ), a = o, i = a.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (G) {
              Jt(a, a.return, G);
            }
          if (a = o, i = a.updateQueue, i !== null) {
            var T = a.stateNode;
            try {
              var L = i.shared.hiddenCallbacks;
              if (L !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < L.length; i++)
                  rh(L[i], T);
            } catch (G) {
              Jt(a, a.return, G);
            }
          }
          g && c & 64 && bm(o), Ea(o, o.return);
          break;
        case 27:
          (n & 2) !== 0 && _m(o);
        case 5:
          o.tag !== 5 && o.tag !== 27 || xm(o), ha(
            i,
            o,
            n
          ), g && a === null && c & 4 && af(o), Ea(o, o.return);
          break;
        case 6:
          xm(o);
          break;
        case 26:
          T = o.stateNode, o.memoizedState !== null || T === null || Ue || td(
            Nr(T.ownerDocument),
            o.type,
            T
          ), ha(
            i,
            o,
            n
          ), g && a === null && c & 4 && af(o), Ea(o, o.return);
          break;
        case 12:
          ha(
            i,
            o,
            n
          );
          break;
        case 31:
          ha(
            i,
            o,
            n
          ), g && c & 4 && Hm(i, o);
          break;
        case 13:
          ha(
            i,
            o,
            n
          ), g && c & 4 && Um(i, o);
          break;
        case 22:
          o.memoizedState === null && ha(
            i,
            o,
            n
          ), Ea(o, o.return);
          break;
        case 30:
          ha(
            i,
            o,
            n
          ), Ea(o, o.return);
          break;
        case 7:
          Ea(o, o.return);
        default:
          ha(
            i,
            o,
            n
          );
      }
      e = e.sibling;
    }
  }
  function pf(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && ir(n));
  }
  function yf(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && ir(t));
  }
  function Wn(t, e, n, a) {
    var i = (n & 335544064) === n;
    if (e.subtreeFlags & (i ? 10262 : 10256))
      for (e = e.child; e !== null; )
        Ym(
          t,
          e,
          n,
          a
        ), e = e.sibling;
    else i && Om(e);
  }
  function Ym(t, e, n, a) {
    var i = (n & 335544064) === n;
    i && e.alternate === null && e.return !== null && e.return.alternate !== null && Ls(e);
    var o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Wn(
          t,
          e,
          n,
          a
        ), o & 2048 && yr(9, e);
        break;
      case 1:
        Wn(
          t,
          e,
          n,
          a
        );
        break;
      case 3:
        Wn(
          t,
          e,
          n,
          a
        ), i && mf && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), o & 2048 && (o = null, e.alternate !== null && (o = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== o && (e.refCount++, o != null && ir(o)));
        break;
      case 12:
        if (o & 2048) {
          Wn(
            t,
            e,
            n,
            a
          ), o = e.stateNode;
          try {
            var c = e.memoizedProps, g = c.id, T = c.onPostCommit;
            typeof T == "function" && T(
              g,
              e.alternate === null ? "mount" : "update",
              o.passiveEffectDuration,
              -0
            );
          } catch (L) {
            Jt(e, e.return, L);
          }
        } else
          Wn(
            t,
            e,
            n,
            a
          );
        break;
      case 31:
        Wn(
          t,
          e,
          n,
          a
        );
        break;
      case 13:
        Wn(
          t,
          e,
          n,
          a
        );
        break;
      case 23:
        break;
      case 22:
        c = e.stateNode, g = e.alternate, e.memoizedState !== null ? (i && g !== null && g.memoizedState === null && Ls(g), c._visibility & 2 ? Wn(
          t,
          e,
          n,
          a
        ) : xr(
          t,
          e
        )) : (i && g !== null && g.memoizedState !== null && Ls(e), c._visibility & 2 ? Wn(
          t,
          e,
          n,
          a
        ) : (c._visibility |= 2, mo(
          t,
          e,
          n,
          a,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), o & 2048 && pf(g, e);
        break;
      case 24:
        Wn(
          t,
          e,
          n,
          a
        ), o & 2048 && yf(e.alternate, e);
        break;
      case 30:
        i && (o = e.alternate, o !== null && (Ta(o.child, !0), Ta(e.child, !0))), Wn(
          t,
          e,
          n,
          a
        );
        break;
      default:
        Wn(
          t,
          e,
          n,
          a
        );
    }
  }
  function mo(t, e, n, a, i) {
    for (i = i && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var o = t, c = e, g = n, T = a, L = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          mo(
            o,
            c,
            g,
            T,
            i
          ), yr(8, c);
          break;
        case 23:
          break;
        case 22:
          var G = c.stateNode;
          c.memoizedState !== null ? G._visibility & 2 ? mo(
            o,
            c,
            g,
            T,
            i
          ) : xr(
            o,
            c
          ) : (G._visibility |= 2, mo(
            o,
            c,
            g,
            T,
            i
          )), i && L & 2048 && pf(
            c.alternate,
            c
          );
          break;
        case 24:
          mo(
            o,
            c,
            g,
            T,
            i
          ), i && L & 2048 && yf(c.alternate, c);
          break;
        default:
          mo(
            o,
            c,
            g,
            T,
            i
          );
      }
      e = e.sibling;
    }
  }
  function xr(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, a = e, i = a.flags;
        switch (a.tag) {
          case 22:
            xr(n, a), i & 2048 && pf(
              a.alternate,
              a
            );
            break;
          case 24:
            xr(n, a), i & 2048 && yf(a.alternate, a);
            break;
          default:
            xr(n, a);
        }
        e = e.sibling;
      }
  }
  var Oi = 8192;
  function Ni(t, e, n) {
    if (t.subtreeFlags & Oi)
      for (t = t.child; t !== null; )
        km(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function km(t, e, n) {
    switch (t.tag) {
      case 26:
        Ni(
          t,
          e,
          n
        ), t.flags & Oi && (t.memoizedState !== null ? o1(
          n,
          da,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && Ig(n, t)));
        break;
      case 5:
        Ni(
          t,
          e,
          n
        ), t.flags & Oi && (t = t.stateNode, (e & 335544128) === e && Ig(n, t));
        break;
      case 3:
      case 4:
        var a = da;
        da = Nr(t.stateNode.containerInfo), Ni(
          t,
          e,
          n
        ), da = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = Oi, Oi = 16777216, Ni(
          t,
          e,
          n
        ), Oi = a) : Ni(
          t,
          e,
          n
        ));
        break;
      case 30:
        if ((t.flags & Oi) !== 0 && (a = t.memoizedProps.name, a != null && a !== "auto")) {
          var i = t.stateNode;
          i.paired = null, zn === null && (zn = /* @__PURE__ */ new Map()), zn.set(a, i);
        }
        Ni(
          t,
          e,
          n
        );
        break;
      default:
        Ni(
          t,
          e,
          n
        );
    }
  }
  function qm(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Er(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          Be = a, Xm(
            a,
            t
          );
        }
      qm(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Gm(t), t = t.sibling;
  }
  function Gm(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Er(t), t.flags & 2048 && Ul(9, t, t.return);
        break;
      case 3:
        Er(t);
        break;
      case 12:
        Er(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, qs(t)) : Er(t);
        break;
      default:
        Er(t);
    }
  }
  function qs(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var a = e[n];
          Be = a, Xm(
            a,
            t
          );
        }
      qm(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          Ul(8, e, e.return), qs(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, qs(e));
          break;
        default:
          qs(e);
      }
      t = t.sibling;
    }
  }
  function Xm(t, e) {
    for (; Be !== null; ) {
      var n = Be;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Ul(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          ir(n.memoizedState.cache);
      }
      if (a = n.child, a !== null) a.return = n, Be = a;
      else
        t: for (n = t; Be !== null; ) {
          a = Be;
          var i = a.sibling, o = a.return;
          if (Mm(a), a === n) {
            Be = null;
            break t;
          }
          if (i !== null) {
            i.return = o, Be = i;
            break t;
          }
          Be = o;
        }
    }
  }
  var eb = {
    getCacheForType: function(t) {
      var e = Qe(we), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return Qe(we).controller.signal;
    }
  }, nb = typeof WeakMap == "function" ? WeakMap : Map, Qt = 0, te = null, jt = null, Bt = 0, It = 0, Mn = null, Ll = !1, go = !1, bf = !1, el = 0, pe = 0, Vl = 0, Di = 0, Gs = 0, jn = 0, vo = 0, _r = null, Sn = null, Sf = !1, Xs = 0, Qm = 0, Qs = 1 / 0, Zs = null, Yl = null, de = 0, ma = null, Ri = null, Oa = 0, xf = 0, Ef = null, Zm = null, po = null, yo = null, bo = null, Tr = 0, Ks = null;
  function Hn() {
    return (Qt & 2) !== 0 && Bt !== 0 ? Bt & -Bt : ut.T !== null ? zf() : Zn();
  }
  function Km() {
    if (jn === 0)
      if ((Bt & 536870912) === 0 || Mt) {
        var t = gn;
        gn <<= 1, (gn & 3932160) === 0 && (gn = 262144), jn = t;
      } else jn = 536870912;
    return t = Ze.current, t !== null && (t.flags |= 32), jn;
  }
  function So(t, e) {
    if (e != null) {
      var n = t.stateNode, a = n.ref;
      a === null && (a = n.ref = Ag(
        Qa(t.memoizedProps, n)
      )), yo === null && (yo = []), yo.push(e.bind(null, a));
    }
  }
  function xn(t, e, n) {
    (t === te && (It === 2 || It === 9) || t.cancelPendingCommit !== null) && (xo(t, 0), kl(
      t,
      Bt,
      jn,
      !1
    )), qa(t, n), ((Qt & 2) === 0 || t !== te) && (t === te && ((Qt & 2) === 0 && (Di |= n), pe === 4 && kl(
      t,
      Bt,
      jn,
      !1
    )), Na(t));
  }
  function Im(t, e, n) {
    if ((Qt & 6) !== 0) throw Error(u(327));
    var a = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || oa(t, e), i = a ? ib(t, e) : Tf(t, e, !0), o = a;
    do {
      if (i === 0) {
        go && !a && kl(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, o && !ab(n)) {
          i = Tf(t, e, !1), o = !1;
          continue;
        }
        if (i === 2) {
          if (o = e, t.errorRecoveryDisabledLanes & o)
            var c = 0;
          else
            c = t.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            e = c;
            t: {
              var g = t;
              i = _r;
              var T = g.current.memoizedState.isDehydrated;
              if (T && (xo(g, c).flags |= 256), c = Tf(
                g,
                c,
                !1
              ), c !== 2 && c !== 6) {
                if (bf && !T) {
                  g.errorRecoveryDisabledLanes |= o, Di |= o, i = 4;
                  break t;
                }
                o = Sn, Sn = i, o !== null && (Sn === null ? Sn = o : Sn.push.apply(
                  Sn,
                  o
                ));
              }
              i = c;
            }
            if (o = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          xo(t, 0), kl(t, e, 0, !0);
          break;
        }
        t: {
          switch (a = t, o = i, o) {
            case 0:
            case 1:
              throw Error(u(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              kl(
                a,
                e,
                jn,
                !Ll
              );
              break t;
            case 2:
              Sn = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((e & 62914560) === e && (i = Xs + 300 - Ye(), 10 < i)) {
            if (kl(
              a,
              e,
              jn,
              !Ll
            ), ia(a, 0, !0) !== 0) break t;
            Oa = e, a.timeoutHandle = Gf(
              Jm.bind(
                null,
                a,
                n,
                Sn,
                Zs,
                Sf,
                e,
                jn,
                Di,
                vo,
                Ll,
                o,
                "Throttled",
                -0,
                0
              ),
              i
            );
            break t;
          }
          Jm(
            a,
            n,
            Sn,
            Zs,
            Sf,
            e,
            jn,
            Di,
            vo,
            Ll,
            o,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Na(t);
  }
  function Jm(t, e, n, a, i, o, c, g, T, L, G, F, j, Y) {
    t.timeoutHandle = -1;
    var rt = e.subtreeFlags, ht = (o & 335544064) === o;
    if (F = null, (ht || rt & 8192 || (rt & 16785408) === 16785408) && (F = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: ln
    }, zn = null, km(
      e,
      o,
      F
    ), ht && (rt = F, ht = t.containerInfo, ht = (ht.nodeType === 9 ? ht : ht.ownerDocument).__reactViewTransition, ht != null && (rt.count++, rt.waitingForViewTransition = !0, rt = zr.bind(rt), ht.finished.then(rt, rt))), rt = (o & 62914560) === o ? Xs - Ye() : (o & 4194048) === o ? Qm - Ye() : 0, rt = r1(
      F,
      rt
    ), rt !== null)) {
      Oa = o, t.cancelPendingCommit = rt(
        ag.bind(
          null,
          t,
          e,
          o,
          n,
          a,
          i,
          c,
          g,
          T,
          L,
          G,
          F,
          null,
          j,
          Y
        )
      ), kl(t, o, c, !L);
      return;
    }
    ag(
      t,
      e,
      o,
      n,
      a,
      i,
      c,
      g,
      T,
      L,
      G,
      F
    );
  }
  function ab(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var a = 0; a < n.length; a++) {
          var i = n[a], o = i.getSnapshot;
          i = i.value;
          try {
            if (!Dn(o(), i)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null)
        n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function kl(t, e, n, a) {
    e = yl(t, e), e &= ~Gs, e &= ~Di, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
    for (var i = e; 0 < i; ) {
      var o = 31 - Ut(i), c = 1 << o;
      a[o] = -1, i &= ~c;
    }
    n !== 0 && sa(t, n, e);
  }
  function Is() {
    return (Qt & 6) === 0 ? (wr(0), !1) : !0;
  }
  function _f() {
    if (jt !== null) {
      if (It === 0)
        var t = jt.return;
      else
        t = jt, Ja = yi = null, Dc(t), oo = null, sr = 0, t = jt;
      for (; t !== null; )
        ym(t.alternate, t), t = t.return;
      jt = null;
    }
  }
  function xo(t, e) {
    var n = t.timeoutHandle;
    return n !== -1 && (t.timeoutHandle = -1, Ab(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), Oa = 0, _f(), te = t, jt = n = Ka(t.current, null), Bt = e, It = 0, Mn = null, Ll = !1, go = oa(t, e), bf = !1, vo = jn = Gs = Di = Vl = pe = 0, Sn = _r = null, Sf = !1, el = yl(t, e), ns(), n;
  }
  function Fm(t, e) {
    Dt = null, ut.H = As, e === io || e === hs ? (e = ah(), It = 3) : e === pc ? (e = ah(), It = 4) : It = e === Qc ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Mn = e, jt === null && (pe = 1, Os(
      t,
      Jn(e, t.current)
    ));
  }
  function $m() {
    var t = Ze.current;
    return t === null ? !0 : (Bt & 4194048) === Bt ? We === null : (Bt & 62914560) === Bt || (Bt & 536870912) !== 0 ? t === We : !1;
  }
  function Pm() {
    var t = ut.H;
    return ut.H = As, t === null ? As : t;
  }
  function Wm() {
    var t = ut.A;
    return ut.A = eb, t;
  }
  function Js() {
    pe = 4, Ll || (Bt & 4194048) !== Bt && Ze.current !== null || (go = !0), (Vl & 134217727) === 0 && (Di & 134217727) === 0 || te === null || kl(
      te,
      Bt,
      jn,
      !1
    );
  }
  function Tf(t, e, n) {
    var a = Qt;
    Qt |= 2;
    var i = Pm(), o = Wm();
    (te !== t || Bt !== e) && (Zs = null, xo(t, e)), e = !1;
    var c = pe;
    t: do
      try {
        if (It !== 0 && jt !== null) {
          var g = jt, T = Mn;
          switch (It) {
            case 8:
              _f(), c = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Ze.current === null && (e = !0);
              var L = It;
              if (It = 0, Mn = null, Eo(t, g, T, L), n && go) {
                c = 0;
                break t;
              }
              break;
            default:
              L = It, It = 0, Mn = null, Eo(t, g, T, L);
          }
        }
        lb(), c = pe;
        break;
      } catch (G) {
        Fm(t, G);
      }
    while (!0);
    return e && t.shellSuspendCounter++, Ja = yi = null, Qt = a, ut.H = i, ut.A = o, jt === null && (te = null, Bt = 0, ns()), c;
  }
  function lb() {
    for (; jt !== null; ) tg(jt);
  }
  function ib(t, e) {
    var n = Qt;
    Qt |= 2;
    var a = Pm(), i = Wm();
    te !== t || Bt !== e ? (Zs = null, Qs = Ye() + 500, xo(t, e)) : go = oa(
      t,
      e
    );
    t: do
      try {
        if (It !== 0 && jt !== null) {
          e = jt;
          var o = Mn;
          e: switch (It) {
            case 1:
              It = 0, Mn = null, Eo(t, e, o, 1);
              break;
            case 2:
            case 9:
              if (eh(o)) {
                It = 0, Mn = null, eg(e);
                break;
              }
              e = function() {
                It !== 2 && It !== 9 || te !== t || (It = 7), Na(t);
              }, o.then(e, e);
              break t;
            case 3:
              It = 7;
              break t;
            case 4:
              It = 5;
              break t;
            case 7:
              eh(o) ? (It = 0, Mn = null, eg(e)) : (It = 0, Mn = null, Eo(t, e, o, 7));
              break;
            case 5:
              var c = null;
              switch (jt.tag) {
                case 26:
                  c = jt.memoizedState;
                case 5:
                case 27:
                  var g = jt;
                  if (c ? Zg(c) : g.stateNode.complete) {
                    It = 0, Mn = null;
                    var T = g.sibling;
                    if (T !== null) jt = T;
                    else {
                      var L = g.return;
                      L !== null ? (jt = L, Fs(L)) : jt = null;
                    }
                    break e;
                  }
              }
              It = 0, Mn = null, Eo(t, e, o, 5);
              break;
            case 6:
              It = 0, Mn = null, Eo(t, e, o, 6);
              break;
            case 8:
              _f(), pe = 6;
              break t;
            default:
              throw Error(u(462));
          }
        }
        ob();
        break;
      } catch (G) {
        Fm(t, G);
      }
    while (!0);
    return Ja = yi = null, ut.H = a, ut.A = i, Qt = n, jt !== null ? 0 : (te = null, Bt = 0, ns(), pe);
  }
  function ob() {
    for (; jt !== null && !Va(); )
      tg(jt);
  }
  function tg(t) {
    var e = vm(t.alternate, t, el);
    t.memoizedProps = t.pendingProps, e === null ? Fs(t) : jt = e;
  }
  function eg(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = um(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Bt
        );
        break;
      case 11:
        e = um(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Bt
        );
        break;
      case 5:
        Dc(e);
        var a = e;
        a === He && (Mt ? (ss(a), a.tag === 5 && a.stateNode != null && (ae = a.stateNode)) : (ss(a), Mt = !0));
      default:
        ym(n, e), e = jt = X0(e, el), e = vm(n, e, el);
    }
    t.memoizedProps = t.pendingProps, e === null ? Fs(t) : jt = e;
  }
  function Eo(t, e, n, a) {
    Ja = yi = null, Dc(e), oo = null, sr = 0;
    var i = e.return;
    try {
      if (Ky(
        t,
        i,
        e,
        n,
        Bt
      )) {
        pe = 1, Os(
          t,
          Jn(n, t.current)
        ), jt = null;
        return;
      }
    } catch (o) {
      if (i !== null) throw jt = i, o;
      pe = 1, Os(
        t,
        Jn(n, t.current)
      ), jt = null;
      return;
    }
    e.flags & 32768 ? (Mt || a === 1 ? t = !0 : go || (Bt & 536870912) !== 0 ? t = !1 : (Ll = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Ze.current, a !== null && a.tag === 13 && (a.flags |= 16384))), ng(e, t)) : Fs(e);
  }
  function Fs(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        ng(
          e,
          Ll
        );
        return;
      }
      t = e.return;
      var n = $y(
        e.alternate,
        e,
        el
      );
      if (n !== null) {
        jt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        jt = e;
        return;
      }
      jt = e = t;
    } while (e !== null);
    pe === 0 && (pe = 5);
  }
  function ng(t, e) {
    do {
      var n = Py(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, jt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        jt = t;
        return;
      }
      jt = t = n;
    } while (t !== null);
    pe = 6, jt = null;
  }
  function ag(t, e, n, a, i, o, c, g, T, L, G, F) {
    t.cancelPendingCommit = null;
    do
      $s();
    while (de !== 0);
    if ((Qt & 6) !== 0) throw Error(u(327));
    if (e !== null) {
      if (e === t.current) throw Error(u(177));
      t === te && (jt = te = null, Bt = 0), Ri = e, ma = t, Oa = n, Ef = i, Zm = a, rb(
        t,
        e,
        n,
        c,
        g,
        T,
        F
      );
    }
  }
  function rb(t, e, n, a, i, o, c) {
    var g = e.lanes | e.childLanes;
    if (xf = g, g |= lc, Yi(
      t,
      n,
      g,
      a,
      i,
      o
    ), yo = null, (n & 335544064) === n ? (bo = Hy(t), a = 10262) : (bo = null, a = 10256), (e.subtreeFlags & a) !== 0 || (e.flags & a) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, hb($e, function() {
      return Of(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), Us = !1, a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
      a = ut.T, ut.T = null, i = gt.p, gt.p = 2, o = Qt, Qt |= 4;
      try {
        Wy(t, e, n);
      } finally {
        Qt = o, gt.p = i, ut.T = a;
      }
    }
    de = 1, Us ? po = Mb(
      c,
      t.containerInfo,
      bo,
      wf,
      Cf,
      ub,
      Af,
      Of,
      sb
    ) : (wf(), Cf(), Af());
  }
  function sb(t) {
    if (de !== 0) {
      var e = ma.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function ub() {
    de === 3 && (de = 0, Vm(Ri, ma), de = 4);
  }
  function wf() {
    if (de === 1) {
      de = 0;
      var t = ma, e = Ri, n = Oa, a = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || a) {
        a = ut.T, ut.T = null;
        var i = gt.p;
        gt.p = 2;
        var o = Qt;
        Qt |= 4;
        try {
          Sr = Vs = !1, Bm(e, t, n), n = Yf;
          var c = j0(t.containerInfo), g = n.focusedElem, T = n.selectionRange;
          if (c !== g && g && g.ownerDocument && M0(
            g.ownerDocument.documentElement,
            g
          )) {
            if (T !== null && Wu(g)) {
              var L = T.start, G = T.end;
              if (G === void 0 && (G = L), "selectionStart" in g)
                g.selectionStart = L, g.selectionEnd = Math.min(
                  G,
                  g.value.length
                );
              else {
                var F = g.ownerDocument || document, j = F && F.defaultView || window;
                if (j.getSelection) {
                  var Y = j.getSelection(), rt = g.textContent.length, ht = Math.min(T.start, rt), Rt = T.end === void 0 ? ht : Math.min(T.end, rt);
                  !Y.extend && ht > Rt && (c = Rt, Rt = ht, ht = c);
                  var U = z0(
                    g,
                    ht
                  ), N = z0(
                    g,
                    Rt
                  );
                  if (U && N && (Y.rangeCount !== 1 || Y.anchorNode !== U.node || Y.anchorOffset !== U.offset || Y.focusNode !== N.node || Y.focusOffset !== N.offset)) {
                    var V = F.createRange();
                    V.setStart(U.node, U.offset), Y.removeAllRanges(), ht > Rt ? (Y.addRange(V), Y.extend(N.node, N.offset)) : (V.setEnd(N.node, N.offset), Y.addRange(V));
                  }
                }
              }
            }
            for (F = [], Y = g; Y = Y.parentNode; )
              Y.nodeType === 1 && F.push({
                element: Y,
                left: Y.scrollLeft,
                top: Y.scrollTop
              });
            for (typeof g.focus == "function" && g.focus(), g = 0; g < F.length; g++) {
              var J = F[g];
              J.element.scrollLeft = J.left, J.element.scrollTop = J.top;
            }
          }
          Do = !!Vf, Yf = Vf = null;
        } finally {
          Qt = o, gt.p = i, ut.T = a;
        }
      }
      t.current = e, de = 2;
    }
  }
  function Cf() {
    if (de === 2) {
      de = 0;
      var t = ma, e = Ri, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = ut.T, ut.T = null;
        var a = gt.p;
        gt.p = 2;
        var i = Qt;
        Qt |= 4;
        try {
          Rm(t, e.alternate, e);
        } finally {
          Qt = i, gt.p = a, ut.T = n;
        }
      }
      de = 3;
    }
  }
  function Af() {
    if (de === 4 || de === 3) {
      de = 0;
      var t = po;
      po = null, mn();
      var e = ma, n = Ri, a = Oa, i = Zm, o = (a & 335544064) === a ? 10262 : 10256;
      if ((n.subtreeFlags & o) !== 0 || (n.flags & o) !== 0 ? de = 5 : (de = 0, Ri = ma = null, lg(e, e.pendingLanes)), o = e.pendingLanes, o === 0 && (Yl = null), Qn(a), n = n.stateNode, Xt && typeof Xt.onCommitFiberRoot == "function")
        try {
          Xt.onCommitFiberRoot(
            ie,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (i !== null) {
        n = ut.T, o = gt.p, gt.p = 2, ut.T = null;
        try {
          for (var c = e.onRecoverableError, g = 0; g < i.length; g++) {
            var T = i[g];
            c(T.value, {
              componentStack: T.stack
            });
          }
        } finally {
          ut.T = n, gt.p = o;
        }
      }
      if (i = yo, c = bo, bo = null, i !== null && (yo = null, c === null && (c = []), t !== null))
        for (T = 0; T < i.length; T++)
          n = (0, i[T])(
            c
          ), n !== void 0 && t.finished.finally(n);
      (Oa & 3) !== 0 && $s(), Na(e), o = e.pendingLanes, (a & 261930) !== 0 && (o & 42) !== 0 ? e === Ks ? Tr++ : (Tr = 0, Ks = e) : (Tr = 0, Ks = null), wr(0);
    }
  }
  function lg(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, ir(e)));
  }
  function $s() {
    return po !== null && (po.skipTransition(), po = null), wf(), Cf(), Af(), Of();
  }
  function Of() {
    if (de !== 5) return !1;
    var t = ma, e = xf;
    xf = 0;
    var n = Qn(Oa), a = ut.T, i = gt.p;
    try {
      gt.p = 32 > n ? 32 : n, ut.T = null, n = Ef, Ef = null;
      var o = ma, c = Oa;
      if (de = 0, Ri = ma = null, Oa = 0, (Qt & 6) !== 0) throw Error(u(331));
      var g = Qt;
      if (Qt |= 4, Gm(o.current), Ym(
        o,
        o.current,
        c,
        n
      ), Qt = g, wr(0, !1), Xt && typeof Xt.onPostCommitFiberRoot == "function")
        try {
          Xt.onPostCommitFiberRoot(ie, o);
        } catch {
        }
      return !0;
    } finally {
      gt.p = i, ut.T = a, lg(t, e);
    }
  }
  function ig(t, e, n) {
    e = Jn(n, e), e = Xc(t.stateNode, e, 2), t = zl(t, e, 2), t !== null && (qa(t, 2), Na(t));
  }
  function Jt(t, e, n) {
    if (t.tag === 3)
      ig(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          ig(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Yl === null || !Yl.has(a))) {
            t = Jn(n, t), n = em(2), a = zl(e, n, 2), a !== null && (nm(
              n,
              a,
              e,
              t
            ), qa(a, 2), Na(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function Nf(t, e, n) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new nb();
      var i = /* @__PURE__ */ new Set();
      a.set(e, i);
    } else
      i = a.get(e), i === void 0 && (i = /* @__PURE__ */ new Set(), a.set(e, i));
    i.has(n) || (bf = !0, i.add(n), t = cb.bind(null, t, e, n), e.then(t, t));
  }
  function cb(t, e, n) {
    var a = t.pingCache;
    a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, te === t && (Bt & n) === n && ((pe === 4 || pe === 3 && (Bt & 62914560) === Bt && 300 > Ye() - Xs) && (Qt & 2) === 0 ? xo(t, 0) : Gs |= n, vo === Bt && (vo = 0)), Na(t);
  }
  function og(t, e) {
    e === 0 && (e = ra()), t = gi(t, e), t !== null && (qa(t, e), Na(t));
  }
  function fb(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), og(t, n);
  }
  function db(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode, i = t.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(u(314));
    }
    a !== null && a.delete(e), og(t, n);
  }
  function hb(t, e) {
    return ni(t, e);
  }
  var _o = null, To = null, Df = !1, Ps = !1, Rf = !1, ql = 0;
  function Na(t) {
    t !== To && t.next === null && (To === null ? _o = To = t : To = To.next = t), Ps = !0, Df || (Df = !0, gb());
  }
  function wr(t, e) {
    if (!Rf && Ps) {
      Rf = !0;
      do
        for (var n = !1, a = _o; a !== null; ) {
          if (t !== 0) {
            var i = a.pendingLanes;
            if (i === 0) var o = 0;
            else {
              var c = a.suspendedLanes, g = a.pingedLanes;
              o = (1 << 31 - Ut(42 | t) + 1) - 1, o &= i & ~(c & ~g), o = o & 201326741 ? o & 201326741 | 1 : o ? o | 2 : 0;
            }
            o !== 0 && (n = !0, cg(a, o));
          } else
            o = Bt, o = ia(
              a,
              a === te ? o : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (o & 3) === 0 || oa(a, o) || (n = !0, cg(a, o));
          a = a.next;
        }
      while (n);
      Rf = !1;
    }
  }
  function mb() {
    rg();
  }
  function rg() {
    Ps = Df = !1;
    var t = 0;
    ql !== 0 && Cb() && (t = ql);
    for (var e = Ye(), n = null, a = _o; a !== null; ) {
      var i = a.next, o = sg(a, e);
      o === 0 ? (a.next = null, n === null ? _o = i : n.next = i, i === null && (To = n)) : (n = a, (t !== 0 || (o & 3) !== 0) && (Ps = !0)), a = i;
    }
    de !== 0 && de !== 5 || wr(t), ql !== 0 && (ql = 0);
  }
  function sg(t, e) {
    for (var n = t.suspendedLanes, a = t.pingedLanes, i = t.expirationTimes, o = t.pendingLanes & -62914561; 0 < o; ) {
      var c = 31 - Ut(o), g = 1 << c, T = i[c];
      T === -1 ? ((g & n) === 0 || (g & a) !== 0) && (i[c] = Go(g, e)) : T <= e && (t.expiredLanes |= g), o &= ~g;
    }
    if (e = te, n = Bt, n = ia(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, n === 0 || t === e && (It === 2 || It === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && La(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || oa(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (a !== null && La(a), Qn(n)) {
        case 2:
        case 8:
          n = Ya;
          break;
        case 32:
          n = $e;
          break;
        case 268435456:
          n = pl;
          break;
        default:
          n = $e;
      }
      return a = ug.bind(null, t), n = ni(n, a), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return a !== null && a !== null && La(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function ug(t, e) {
    if (de !== 0 && de !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if ($s() && t.callbackNode !== n)
      return null;
    var a = Bt;
    return a = ia(
      t,
      t === te ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (Im(t, a, e), sg(t, Ye()), t.callbackNode != null && t.callbackNode === n ? ug.bind(null, t) : null);
  }
  function cg(t, e) {
    if ($s()) return null;
    Im(t, e, !0);
  }
  function gb() {
    Ob(function() {
      (Qt & 6) !== 0 ? ni(
        ke,
        mb
      ) : rg();
    });
  }
  function zf() {
    if (ql === 0) {
      var t = xi;
      t === 0 && (t = Ee, Ee <<= 1, (Ee & 261888) === 0 && (Ee = 256)), ql = t;
    }
    return ql;
  }
  function fg(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ge(t);
  }
  function vb(t, e, n, a, i) {
    if (e === "submit" && n && n.stateNode === i) {
      var o = fg(
        (i[qe] || null).action
      ), c = a.submitter;
      c && (e = (e = c[qe] || null) ? fg(e.formAction) : c.getAttribute("formAction"), e !== null && (o = e, c = null));
      var g = new Pr(
        "action",
        "action",
        null,
        a,
        i
      );
      t.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (ql !== 0) {
                  var T = new FormData(i, c);
                  Vc(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: i.method,
                      action: o
                    },
                    null,
                    T
                  );
                }
              } else
                typeof o == "function" && (g.preventDefault(), T = new FormData(i, c), Vc(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: i.method,
                    action: o
                  },
                  o,
                  T
                ));
            },
            currentTarget: i
          }
        ]
      });
    }
  }
  for (var Mf = 0; Mf < ac.length; Mf++) {
    var jf = ac[Mf], pb = jf.toLowerCase(), yb = jf[0].toUpperCase() + jf.slice(1);
    ca(
      pb,
      "on" + yb
    );
  }
  ca(B0, "onAnimationEnd"), ca(L0, "onAnimationIteration"), ca(V0, "onAnimationStart"), ca("dblclick", "onDoubleClick"), ca("focusin", "onFocus"), ca("focusout", "onBlur"), ca(Ay, "onTransitionRun"), ca(Oy, "onTransitionStart"), ca(Ny, "onTransitionCancel"), ca(Y0, "onTransitionEnd"), Pt("onMouseEnter", ["mouseout", "mouseover"]), Pt("onMouseLeave", ["mouseout", "mouseover"]), Pt("onPointerEnter", ["pointerout", "pointerover"]), Pt("onPointerLeave", ["pointerout", "pointerover"]), zt(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), zt(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), zt("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), zt(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), zt(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), zt(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Cr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), bb = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Cr)
  );
  function dg(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var a = t[n], i = a.event;
      a = a.listeners;
      t: {
        var o = void 0;
        if (e)
          for (var c = a.length - 1; 0 <= c; c--) {
            var g = a[c], T = g.instance, L = g.currentTarget;
            if (g = g.listener, T !== o && i.isPropagationStopped())
              break t;
            o = g, i.currentTarget = L;
            try {
              o(i);
            } catch (G) {
              es(G);
            }
            i.currentTarget = null, o = T;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (g = a[c], T = g.instance, L = g.currentTarget, g = g.listener, T !== o && i.isPropagationStopped())
              break t;
            o = g, i.currentTarget = L;
            try {
              o(i);
            } catch (G) {
              es(G);
            }
            i.currentTarget = null, o = T;
          }
      }
    }
  }
  function Ht(t, e) {
    var n = e[Xo];
    n === void 0 && (n = e[Xo] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    n.has(a) || (hg(e, t, 2, !1), n.add(a));
  }
  function Hf(t, e, n) {
    var a = 0;
    e && (a |= 4), hg(
      n,
      t,
      a,
      e
    );
  }
  var Ws = "_reactListening" + Math.random().toString(36).slice(2);
  function Uf(t) {
    if (!t[Ws]) {
      t[Ws] = !0, Ot.forEach(function(n) {
        n !== "selectionchange" && (bb.has(n) || Hf(n, !1, t), Hf(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Ws] || (e[Ws] = !0, Hf("selectionchange", !1, e));
    }
  }
  function hg(t, e, n, a) {
    switch (nv(e)) {
      case 2:
        var i = f1;
        break;
      case 8:
        i = d1;
        break;
      default:
        i = nd;
    }
    n = i.bind(
      null,
      e,
      n,
      t
    ), i = void 0, !di || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (i = !0), a ? i !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: i
    }) : t.addEventListener(e, n, !0) : i !== void 0 ? t.addEventListener(e, n, {
      passive: i
    }) : t.addEventListener(e, n, !1);
  }
  function Bf(t, e, n, a, i) {
    var o = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var g = a.stateNode.containerInfo;
          if (g === i) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var T = c.tag;
              if ((T === 3 || T === 4) && c.stateNode.containerInfo === i)
                return;
              c = c.return;
            }
          for (; g !== null; ) {
            if (c = ua(g), c === null) return;
            if (T = c.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              a = o = c;
              continue t;
            }
            g = g.parentNode;
          }
        }
        a = a.return;
      }
    fi(function() {
      var L = o, G = ci(n), F = [];
      t: {
        var j = k0.get(t);
        if (j !== void 0) {
          var Y = Pr, rt = t;
          switch (t) {
            case "keypress":
              if (Fr(n) === 0) break t;
            case "keydown":
            case "keyup":
              Y = ay;
              break;
            case "focusin":
              rt = "focus", Y = Ku;
              break;
            case "focusout":
              rt = "blur", Y = Ku;
              break;
            case "beforeblur":
            case "afterblur":
              Y = Ku;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Y = v0;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Y = Q2;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Y = sy;
              break;
            case B0:
            case L0:
            case V0:
              Y = I2;
              break;
            case Y0:
              Y = cy;
              break;
            case "scroll":
            case "scrollend":
              Y = G2;
              break;
            case "wheel":
              Y = dy;
              break;
            case "copy":
            case "cut":
            case "paste":
              Y = F2;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Y = y0;
              break;
            case "submit":
              Y = oy;
              break;
            case "toggle":
            case "beforetoggle":
              Y = my;
          }
          var ht = (e & 4) !== 0, Rt = !ht && (t === "scroll" || t === "scrollend"), U = ht ? j !== null ? j + "Capture" : null : j;
          ht = [];
          for (var N = L, V; N !== null; ) {
            var J = N;
            if (V = J.stateNode, J = J.tag, J !== 5 && J !== 26 && J !== 27 || V === null || U === null || (J = Xa(N, U), J != null && ht.push(
              Ar(N, J, V)
            )), Rt) break;
            N = N.return;
          }
          0 < ht.length && (j = new Y(
            j,
            rt,
            null,
            n,
            G
          ), F.push({ event: j, listeners: ht }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (Y = t === "mouseover" || t === "pointerover", j = t === "mouseout" || t === "pointerout", Y && n !== ui && (rt = n.relatedTarget || n.fromElement) && (ua(rt) || rt[wn]))
            break t;
          (j || Y) && (rt = G.window === G ? G : (Y = G.ownerDocument) ? Y.defaultView || Y.parentWindow : window, j ? (Y = n.relatedTarget || n.toElement, j = L, Y = Y ? ua(Y) : null, Y !== null && (Rt = d(Y), ht = Y.tag, Y !== Rt || ht !== 5 && ht !== 27 && ht !== 6) && (Y = null)) : (j = null, Y = L), j !== Y && (ht = v0, J = "onMouseLeave", U = "onMouseEnter", N = "mouse", (t === "pointerout" || t === "pointerover") && (ht = y0, J = "onPointerLeave", U = "onPointerEnter", N = "pointer"), Rt = j == null ? rt : q(j), V = Y == null ? rt : q(Y), rt = new ht(
            J,
            N + "leave",
            j,
            n,
            G
          ), rt.target = Rt, rt.relatedTarget = V, J = null, ua(G) === L && (ht = new ht(
            U,
            N + "enter",
            Y,
            n,
            G
          ), ht.target = V, ht.relatedTarget = Rt, J = ht), Rt = J, ht = j && Y ? w(
            j,
            Y,
            Sb
          ) : null, j !== null && mg(
            F,
            rt,
            j,
            ht,
            !1
          ), Y !== null && Rt !== null && mg(
            F,
            Rt,
            Y,
            ht,
            !0
          )));
        }
        t: {
          if (j = L ? q(L) : window, Y = j.nodeName && j.nodeName.toLowerCase(), Y === "select" || Y === "input" && j.type === "file")
            var dt = C0;
          else if (T0(j))
            if (A0)
              dt = Ty;
            else {
              dt = Ey;
              var Lt = xy;
            }
          else
            Y = j.nodeName, !Y || Y.toLowerCase() !== "input" || j.type !== "checkbox" && j.type !== "radio" ? L && si(L.elementType) && (dt = C0) : dt = _y;
          if (dt && (dt = dt(t, L))) {
            w0(
              F,
              dt,
              n,
              G
            );
            break t;
          }
          Lt && Lt(t, j, L);
        }
        switch (Lt = L ? q(L) : window, t) {
          case "focusin":
            (T0(Lt) || Lt.contentEditable === "true") && ($i = Lt, tc = L, nr = null);
            break;
          case "focusout":
            nr = tc = $i = null;
            break;
          case "mousedown":
            ec = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ec = !1, H0(F, n, G);
            break;
          case "selectionchange":
            if (Cy) break;
          case "keydown":
          case "keyup":
            H0(F, n, G);
        }
        var yt;
        if (Ju)
          t: {
            switch (t) {
              case "compositionstart":
                var _t = "onCompositionStart";
                break t;
              case "compositionend":
                _t = "onCompositionEnd";
                break t;
              case "compositionupdate":
                _t = "onCompositionUpdate";
                break t;
            }
            _t = void 0;
          }
        else
          Fi ? E0(t, n) && (_t = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (_t = "onCompositionStart");
        _t && (b0 && n.locale !== "ko" && (Fi || _t !== "onCompositionStart" ? _t === "onCompositionEnd" && Fi && (yt = m0()) : (_l = G, Xu = "value" in _l ? _l.value : _l.textContent, Fi = !0)), Lt = tu(L, _t), 0 < Lt.length && (_t = new p0(
          _t,
          t,
          null,
          n,
          G
        ), F.push({ event: _t, listeners: Lt }), yt ? _t.data = yt : (yt = _0(n), yt !== null && (_t.data = yt)))), (yt = vy ? py(t, n) : yy(t, n)) && (_t = tu(L, "onBeforeInput"), 0 < _t.length && (Lt = new p0(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          G
        ), F.push({
          event: Lt,
          listeners: _t
        }), Lt.data = yt)), vb(
          F,
          t,
          L,
          n,
          G
        );
      }
      dg(F, e);
    });
  }
  function Ar(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function tu(t, e) {
    for (var n = e + "Capture", a = []; t !== null; ) {
      var i = t, o = i.stateNode;
      if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || o === null || (i = Xa(t, n), i != null && a.unshift(
        Ar(t, i, o)
      ), i = Xa(t, e), i != null && a.push(
        Ar(t, i, o)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function Sb(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function mg(t, e, n, a, i) {
    for (var o = e._reactName, c = []; n !== null && n !== a; ) {
      var g = n, T = g.alternate, L = g.stateNode;
      if (g = g.tag, T !== null && T === a) break;
      g !== 5 && g !== 26 && g !== 27 || L === null || (T = L, i ? (L = Xa(n, o), L != null && c.unshift(
        Ar(n, L, T)
      )) : i || (L = Xa(n, o), L != null && c.push(
        Ar(n, L, T)
      ))), n = n.return;
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var xb = /\r\n?/g, Eb = /\u0000|\uFFFD/g;
  function gg(t) {
    return (typeof t == "string" ? t : "" + t).replace(xb, `
`).replace(Eb, "");
  }
  function vg(t, e) {
    return e = gg(e), gg(t) === e;
  }
  function Ft(t, e, n, a, i, o) {
    switch (n) {
      case "children":
        if (typeof a == "string")
          e === "body" || e === "textarea" && a === "" || an(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          e !== "body" && an(t, "" + a);
        else return;
        break;
      case "className":
        Cn(t, "class", a);
        break;
      case "tabIndex":
        Cn(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Cn(t, n, a);
        break;
      case "style":
        On(t, a, o);
        return;
      case "data":
        if (e !== "object") {
          Cn(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(n);
          break;
        }
        a = Ge(a), t.setAttribute(n, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof o == "function" && (n === "formAction" ? (e !== "input" && Ft(t, e, "name", i.name, i, null), Ft(
            t,
            e,
            "formEncType",
            i.formEncType,
            i,
            null
          ), Ft(
            t,
            e,
            "formMethod",
            i.formMethod,
            i,
            null
          ), Ft(
            t,
            e,
            "formTarget",
            i.formTarget,
            i,
            null
          )) : (Ft(t, e, "encType", i.encType, i, null), Ft(t, e, "method", i.method, i, null), Ft(t, e, "target", i.target, i, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(n);
          break;
        }
        a = Ge(a), t.setAttribute(n, a);
        break;
      case "onClick":
        a != null && (t.onclick = ln);
        return;
      case "onScroll":
        a != null && Ht("scroll", t);
        return;
      case "onScrollEnd":
        a != null && Ht("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(u(61));
          if (n = a.__html, n != null) {
            if (i.children != null) throw Error(u(60));
            o?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = Ge(a), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, a) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0 ? t.setAttribute(n, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, a) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(n, a) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(n) : t.setAttribute(n, a);
        break;
      case "popover":
        Ht("beforetoggle", t), Ht("toggle", t), fe(t, "popover", a);
        break;
      case "xlinkActuate":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        _e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        _e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        _e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        _e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        fe(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = Ko.get(n) || n, fe(t, n, a);
        else return;
    }
    xt = !0;
  }
  function Lf(t, e, n, a, i, o) {
    switch (n) {
      case "style":
        On(t, a, o);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(u(61));
          if (n = a.__html, n != null) {
            if (i.children != null) throw Error(u(60));
            o?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof a == "string") an(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          an(t, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && Ht("scroll", t);
        return;
      case "onScrollEnd":
        a != null && Ht("scrollend", t);
        return;
      case "onClick":
        a != null && (t.onclick = ln);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!wt.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), o = n.slice(2, i ? n.length - 7 : void 0), e = t[qe] || null, e = e != null ? e[n] : null, typeof e == "function" && t.removeEventListener(o, e, i), typeof a == "function")) {
              typeof e != "function" && e !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(o, a, i);
              break t;
            }
            xt = !0, n in t ? t[n] = a : a === !0 ? t.setAttribute(n, "") : fe(t, n, a);
          }
        return;
    }
    xt = !0;
  }
  function Je(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Ht("error", t), Ht("load", t);
        var a = !1, i = !1, o;
        for (o in n)
          if (n.hasOwnProperty(o)) {
            var c = n[o];
            if (c != null)
              switch (o) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(u(137, e));
                default:
                  Ft(t, e, o, c, n, null);
              }
          }
        i && Ft(t, e, "srcSet", n.srcSet, n, null), a && Ft(t, e, "src", n.src, n, null);
        return;
      case "input":
        Ht("invalid", t);
        var g = o = c = i = null, T = null, L = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var G = n[a];
            if (G != null)
              switch (a) {
                case "name":
                  i = G;
                  break;
                case "type":
                  c = G;
                  break;
                case "checked":
                  T = G;
                  break;
                case "defaultChecked":
                  L = G;
                  break;
                case "value":
                  o = G;
                  break;
                case "defaultValue":
                  g = G;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (G != null)
                    throw Error(u(137, e));
                  break;
                default:
                  Ft(t, e, a, G, n, null);
              }
          }
        xl(
          t,
          o,
          g,
          T,
          L,
          c,
          i,
          !1
        );
        return;
      case "select":
        Ht("invalid", t), a = c = o = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (g = n[i], g != null))
            switch (i) {
              case "value":
                o = g;
                break;
              case "defaultValue":
                c = g;
                break;
              case "multiple":
                a = g;
              default:
                Ft(t, e, i, g, n, null);
            }
        e = o, n = c, t.multiple = !!a, e != null ? vn(t, !!a, e, !1) : n != null && vn(t, !!a, n, !0);
        return;
      case "textarea":
        Ht("invalid", t), o = i = a = null;
        for (c in n)
          if (n.hasOwnProperty(c) && (g = n[c], g != null))
            switch (c) {
              case "value":
                a = g;
                break;
              case "defaultValue":
                i = g;
                break;
              case "children":
                o = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(u(91));
                break;
              default:
                Ft(t, e, c, g, n, null);
            }
        An(t, a, i, o);
        return;
      case "option":
        for (T in n)
          n.hasOwnProperty(T) && (a = n[T], a != null) && (T === "selected" ? t.selected = a && typeof a != "function" && typeof a != "symbol" : Ft(t, e, T, a, n, null));
        return;
      case "dialog":
        Ht("beforetoggle", t), Ht("toggle", t), Ht("cancel", t), Ht("close", t);
        break;
      case "iframe":
      case "object":
        Ht("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Cr.length; a++)
          Ht(Cr[a], t);
        break;
      case "image":
        Ht("error", t), Ht("load", t);
        break;
      case "details":
        Ht("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        Ht("error", t), Ht("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (L in n)
          if (n.hasOwnProperty(L) && (a = n[L], a != null))
            switch (L) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, e));
              default:
                Ft(t, e, L, a, n, null);
            }
        return;
      default:
        if (si(e)) {
          for (G in n)
            n.hasOwnProperty(G) && (a = n[G], a !== void 0 && Lf(
              t,
              e,
              G,
              a,
              n,
              void 0
            ));
          return;
        }
    }
    for (g in n)
      n.hasOwnProperty(g) && (a = n[g], a != null && Ft(t, e, g, a, n, null));
  }
  var _b = {};
  function Tb(t, e, n, a) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var i = null, o = null, c = null, g = null, T = null, L = null, G = null;
        for (Y in n) {
          var F = n[Y];
          if (n.hasOwnProperty(Y) && F != null)
            switch (Y) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = F;
              default:
                a.hasOwnProperty(Y) || Ft(t, e, Y, null, a, F);
            }
        }
        for (var j in a) {
          var Y = a[j];
          if (F = n[j], a.hasOwnProperty(j) && (Y != null || F != null))
            switch (j) {
              case "type":
                Y !== F && (xt = !0), o = Y;
                break;
              case "name":
                Y !== F && (xt = !0), i = Y;
                break;
              case "checked":
                Y !== F && (xt = !0), L = Y;
                break;
              case "defaultChecked":
                Y !== F && (xt = !0), G = Y;
                break;
              case "value":
                Y !== F && (xt = !0), c = Y;
                break;
              case "defaultValue":
                Y !== F && (xt = !0), g = Y;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (Y != null)
                  throw Error(u(137, e));
                break;
              default:
                Y !== F && Ft(
                  t,
                  e,
                  j,
                  Y,
                  a,
                  F
                );
            }
        }
        Pe(
          t,
          c,
          g,
          T,
          L,
          G,
          o,
          i
        );
        return;
      case "select":
        Y = c = g = j = null;
        for (o in n)
          if (T = n[o], n.hasOwnProperty(o) && T != null)
            switch (o) {
              case "value":
                break;
              case "multiple":
                Y = T;
              default:
                a.hasOwnProperty(o) || Ft(
                  t,
                  e,
                  o,
                  null,
                  a,
                  T
                );
            }
        for (i in a)
          if (o = a[i], T = n[i], a.hasOwnProperty(i) && (o != null || T != null))
            switch (i) {
              case "value":
                o !== T && (xt = !0), j = o;
                break;
              case "defaultValue":
                o !== T && (xt = !0), g = o;
                break;
              case "multiple":
                o !== T && (xt = !0), c = o;
              default:
                o !== T && Ft(
                  t,
                  e,
                  i,
                  o,
                  a,
                  T
                );
            }
        e = g, n = c, a = Y, j != null ? vn(t, !!n, j, !1) : !!a != !!n && (e != null ? vn(t, !!n, e, !0) : vn(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        Y = j = null;
        for (g in n)
          if (i = n[g], n.hasOwnProperty(g) && i != null && !a.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ft(t, e, g, null, a, i);
            }
        for (c in a)
          if (i = a[c], o = n[c], a.hasOwnProperty(c) && (i != null || o != null))
            switch (c) {
              case "value":
                i !== o && (xt = !0), j = i;
                break;
              case "defaultValue":
                i !== o && (xt = !0), Y = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(u(91));
                break;
              default:
                i !== o && Ft(t, e, c, i, a, o);
            }
        Ji(t, j, Y);
        return;
      case "option":
        for (var rt in n)
          j = n[rt], n.hasOwnProperty(rt) && j != null && !a.hasOwnProperty(rt) && (rt === "selected" ? t.selected = !1 : Ft(
            t,
            e,
            rt,
            null,
            a,
            j
          ));
        for (T in a)
          j = a[T], Y = n[T], a.hasOwnProperty(T) && j !== Y && (j != null || Y != null) && (T === "selected" ? (j !== Y && (xt = !0), t.selected = j && typeof j != "function" && typeof j != "symbol") : Ft(
            t,
            e,
            T,
            j,
            a,
            Y
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ht in n)
          j = n[ht], n.hasOwnProperty(ht) && j != null && !a.hasOwnProperty(ht) && Ft(t, e, ht, null, a, j);
        for (L in a)
          if (j = a[L], Y = n[L], a.hasOwnProperty(L) && j !== Y && (j != null || Y != null))
            switch (L) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (j != null)
                  throw Error(u(137, e));
                break;
              default:
                Ft(
                  t,
                  e,
                  L,
                  j,
                  a,
                  Y
                );
            }
        return;
      default:
        if (si(e)) {
          for (var Rt in n)
            j = n[Rt], n.hasOwnProperty(Rt) && j !== void 0 && !a.hasOwnProperty(Rt) && Lf(
              t,
              e,
              Rt,
              void 0,
              a,
              j
            );
          for (G in a)
            j = a[G], Y = n[G], !a.hasOwnProperty(G) || j === Y || j === void 0 && Y === void 0 || Lf(
              t,
              e,
              G,
              j,
              a,
              Y
            );
          return;
        }
    }
    for (var U in n)
      j = n[U], n.hasOwnProperty(U) && j != null && !a.hasOwnProperty(U) && Ft(t, e, U, null, a, j);
    for (F in a)
      j = a[F], Y = n[F], !a.hasOwnProperty(F) || j === Y || j == null && Y == null || Ft(t, e, F, j, a, Y);
  }
  function pg(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function wb() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), a = 0; a < n.length; a++) {
        var i = n[a], o = i.transferSize, c = i.initiatorType, g = i.duration;
        if (o && g && pg(c)) {
          for (c = 0, g = i.responseEnd, a += 1; a < n.length; a++) {
            var T = n[a], L = T.startTime;
            if (L > g) break;
            var G = T.transferSize, F = T.initiatorType;
            G && pg(F) && (T = T.responseEnd, c += G * (T < g ? 1 : (g - L) / (T - L)));
          }
          if (--a, e += 8 * (o + c) / (i.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Vf = null, Yf = null;
  function Or(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function yg(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function bg(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Sg(t, e, n, a) {
    return n = Or(
      n
    ).createElement(t), n[ce] = a, n[qe] = e, Je(n, t, e), W(n), n;
  }
  function kf(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var qf = null;
  function Cb() {
    var t = window.event;
    return t && t.type === "popstate" ? t === qf ? !1 : (qf = t, !0) : (qf = null, !1);
  }
  var Gf = typeof setTimeout == "function" ? setTimeout : void 0, Ab = typeof clearTimeout == "function" ? clearTimeout : void 0, xg = typeof Promise == "function" ? Promise : void 0, Eg = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Gf, Ob = typeof queueMicrotask == "function" ? queueMicrotask : typeof xg < "u" ? function(t) {
    return xg.resolve(null).then(t).catch(Nb);
  } : Gf;
  function Nb(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Gl(t) {
    return t === "head";
  }
  function _g(t, e) {
    var n = e, a = 0;
    do {
      var i = n.nextSibling;
      if (t.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$" || n === "/&") {
          if (a === 0) {
            t.removeChild(i), Ro(e);
            return;
          }
          a--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          a++;
        else if (n === "html")
          $f(
            t.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = t.ownerDocument.head, $f(n);
          for (var o = n.firstChild; o; ) {
            var c = o.nextSibling, g = o.nodeName;
            o[oi] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && o.rel.toLowerCase() === "stylesheet" || n.removeChild(o), o = c;
          }
        } else
          n === "body" && $f(t.ownerDocument.body);
      n = i;
    } while (n);
    Ro(e);
  }
  function Tg(t, e) {
    var n = t;
    t = 0;
    do {
      var a = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), a && a.nodeType === 8)
        if (n = a.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = a;
    } while (n);
  }
  function wg(t, e, n) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, n != null && (t.style.viewTransitionClass = n), n = getComputedStyle(t), n.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var a = 1;
      else
        for (var i = a = 0; i < e.length; i++) {
          var o = e[i];
          0 < o.width && 0 < o.height && a++;
        }
      a === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + n.paddingTop, t.marginBottom = "-" + n.paddingBottom);
    }
  }
  function Cg(t, e) {
    t = t.style, e = e.style;
    var n = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (n = e.display, t.display = n == null || typeof n == "boolean" ? "" : n, n = e.margin, n != null ? t.margin = n : (n = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = n == null || typeof n == "boolean" ? "" : n, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function Db(t, e, n) {
    return n = n.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= n.innerHeight && t.left <= n.innerWidth
    };
  }
  function Xf(t) {
    var e = t.getBoundingClientRect(), n = getComputedStyle(t);
    return Db(e, n, t);
  }
  function Rb(t) {
    return t.documentElement.clientHeight;
  }
  function zb(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function Mb(t, e, n, a, i, o, c, g, T) {
    var L = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var G = L.startViewTransition({
        update: function() {
          var j = L.defaultView, Y = j.navigation && j.navigation.transition, rt = L.fonts.status;
          a();
          var ht = [];
          if (rt === "loaded" && (Rb(L), L.fonts.status === "loading" && ht.push(L.fonts.ready)), rt = ht.length, t !== null)
            for (var Rt = t.suspenseyImages, U = 0, N = 0; N < Rt.length; N++) {
              var V = Rt[N];
              if (!V.complete) {
                var J = V.getBoundingClientRect();
                if (0 < J.bottom && 0 < J.right && J.top < j.innerHeight && J.left < j.innerWidth) {
                  if (U += Kg(V), U > au) {
                    ht.length = rt;
                    break;
                  }
                  V = new Promise(
                    zb.bind(V)
                  ), ht.push(V);
                }
              }
            }
          if (0 < ht.length)
            return j = Promise.race([
              Promise.all(ht),
              new Promise(function(dt) {
                return setTimeout(dt, 500);
              })
            ]).then(i, i), (Y ? Promise.allSettled([Y.finished, j]) : j).then(o, o);
          if (i(), Y)
            return Y.finished.then(
              o,
              o
            );
          o();
        },
        types: n
      });
      L.__reactViewTransition = G;
      var F = [];
      return G.ready.then(
        function() {
          for (var j = L.documentElement.getAnimations({
            subtree: !0
          }), Y = 0; Y < j.length; Y++) {
            var rt = j[Y], ht = rt.effect, Rt = ht.pseudoElement;
            if (Rt != null && Rt.startsWith("::view-transition")) {
              F.push(rt), rt = ht.getKeyframes();
              for (var U = Rt = void 0, N = !0, V = 0; V < rt.length; V++) {
                var J = rt[V], dt = J.width;
                if (Rt === void 0) Rt = dt;
                else if (Rt !== dt) {
                  N = !1;
                  break;
                }
                if (dt = J.height, U === void 0) U = dt;
                else if (U !== dt) {
                  N = !1;
                  break;
                }
                delete J.width, delete J.height, J.transform === "none" && delete J.transform;
              }
              N && Rt !== void 0 && U !== void 0 && (ht.setKeyframes(rt), N = getComputedStyle(
                ht.target,
                ht.pseudoElement
              ), N.width !== Rt || N.height !== U) && (N = rt[0], N.width = Rt, N.height = U, N = rt[rt.length - 1], N.width = Rt, N.height = U, ht.setKeyframes(rt));
            }
          }
          c();
        },
        function(j) {
          L.__reactViewTransition === G && (L.__reactViewTransition = null);
          try {
            typeof j == "object" && j !== null && j.name === "InvalidStateError" && (j.message === "View transition was skipped because document visibility state is hidden." || j.message === "Skipping view transition because document visibility state has become hidden." || j.message === "Skipping view transition because viewport size changed." || j.message === "Transition was aborted because of invalid state") && (j = null), j !== null && T(j);
          } finally {
            a(), i(), c();
          }
        }
      ), G.finished.finally(function() {
        for (var j = 0; j < F.length; j++)
          F[j].cancel();
        L.__reactViewTransition === G && (L.__reactViewTransition = null), g();
      }), G;
    } catch {
      return a(), i(), c(), null;
    }
  }
  function zi(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  zi.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : C({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, zi.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, n = t.getAnimations({ subtree: !0 }), a = [], i = 0; i < n.length; i++) {
      var o = n[i].effect;
      o !== null && o.target === t && o.pseudoElement === e && a.push(n[i]);
    }
    return a;
  }, zi.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Ag(t) {
    return {
      name: t,
      group: new zi("group", t),
      imagePair: new zi("image-pair", t),
      old: new zi("old", t),
      new: new zi("new", t)
    };
  }
  function Un(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  Un.prototype.addEventListener = function(t, e, n) {
    var a = null, i = null;
    if (!(n != null && typeof n != "boolean" && (a = n.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var o = this._eventListeners;
      if (Ng(o, t, e, n) === -1) {
        var c = this, g = e;
        n != null && typeof n != "boolean" && n.once === !0 && (g = function(T) {
          c.removeEventListener(
            t,
            e,
            n
          ), typeof e == "function" ? e.call(this, T) : e.handleEvent(T);
        }), a !== null && (i = c.removeEventListener.bind(
          c,
          t,
          e,
          n
        ), a.addEventListener("abort", i, { once: !0 }), i = a.removeEventListener.bind(a, "abort", i)), a = wo(n), o.push({
          type: t,
          listener: e,
          optionsOrUseCapture: n,
          attachedListener: g,
          cleanup: i
        }), h(
          this._fragmentFiber.child,
          !1,
          jb,
          t,
          g,
          a
        );
      }
      this._eventListeners = o;
    }
  };
  function jb(t, e, n, a) {
    return H(t).addEventListener(
      e,
      n,
      a
    ), !1;
  }
  Un.prototype.removeEventListener = function(t, e, n) {
    var a = this._eventListeners;
    if (a !== null && (e = Ng(
      a,
      t,
      e,
      n
    ), e !== -1)) {
      var i = a[e];
      n = i.attachedListener;
      var o = i.cleanup;
      i = wo(i.optionsOrUseCapture), h(
        this._fragmentFiber.child,
        !1,
        Hb,
        t,
        n,
        i
      ), a.splice(e, 1), o !== null && o();
    }
  };
  function Hb(t, e, n, a) {
    return H(t).removeEventListener(
      e,
      n,
      a
    ), !1;
  }
  function wo(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function Og(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function Ng(t, e, n, a) {
    if (t.length === 0) return -1;
    a = Og(a);
    for (var i = 0; i < t.length; i++) {
      var o = t[i];
      if (o.type === e && o.listener === n && Og(o.optionsOrUseCapture) === a)
        return i;
    }
    return -1;
  }
  Un.prototype.dispatchEvent = function(t) {
    var e = E(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = H(e);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !t.bubbles) {
      var a = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (n)
        for (var i = 0; i < n.length; i++) {
          var o = n[i];
          a.addEventListener(
            o.type,
            o.attachedListener,
            wo(o.optionsOrUseCapture)
          );
        }
      if (e.appendChild(a), t = a.dispatchEvent(t), n)
        for (i = 0; i < n.length; i++)
          o = n[i], a.removeEventListener(
            o.type,
            o.attachedListener,
            wo(o.optionsOrUseCapture)
          );
      return e.removeChild(a), t;
    }
    return e.dispatchEvent(t);
  }, Un.prototype.focus = function(t) {
    h(
      this._fragmentFiber.child,
      !0,
      Dg,
      t,
      void 0,
      void 0
    );
  };
  function Dg(t, e) {
    return t.tag === 6 ? !1 : (t = H(t), Kb(t, e));
  }
  Un.prototype.focusLast = function(t) {
    var e = [];
    h(
      this._fragmentFiber.child,
      !0,
      Qf,
      e,
      void 0,
      void 0
    );
    for (var n = e.length - 1; 0 <= n && !Dg(e[n], t); n--) ;
  };
  function Qf(t, e) {
    return e.push(t), !1;
  }
  Un.prototype.blur = function() {
    var t = E(
      this._fragmentFiber
    );
    t !== null && (t = H(t), t = Or(t).activeElement, t !== null && h(
      this._fragmentFiber.child,
      !1,
      Ub,
      t,
      void 0,
      void 0
    ));
  };
  function Ub(t, e) {
    return t.tag === 6 ? !1 : (t = H(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  Un.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), h(
      this._fragmentFiber.child,
      !1,
      Bb,
      t,
      void 0,
      void 0
    );
  };
  function Bb(t, e) {
    return t.tag === 6 || (t = H(t), e.observe(t)), !1;
  }
  Un.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), h(
        this._fragmentFiber.child,
        !1,
        Lb,
        t,
        void 0,
        void 0
      );
      for (var n = e = 0; n < ga.length; n++) {
        var a = ga[n];
        a.fragmentInstance === this && a.observer === t ? t.unobserve(a.instance) : ga[e++] = a;
      }
      ga.length = e;
    }
  };
  function Lb(t, e) {
    return t.tag === 6 || (t = H(t), e.unobserve(t)), !1;
  }
  var ga = [], Zf = !1;
  function Vb(t, e, n) {
    ga.push({
      fragmentInstance: t,
      observer: e,
      instance: n
    }), Zf || (Zf = !0, Ib(function() {
      Zf = !1;
      var a = ga;
      ga = [];
      for (var i = 0; i < a.length; i++) {
        var o = a[i];
        o.observer.unobserve(o.instance);
      }
    }));
  }
  Un.prototype.getClientRects = function() {
    var t = [];
    return h(
      this._fragmentFiber.child,
      !1,
      Yb,
      t,
      void 0,
      void 0
    ), t;
  };
  function Yb(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var n = t.ownerDocument.createRange();
      n.selectNodeContents(t), e.push.apply(e, n.getClientRects());
    } else
      t = H(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  Un.prototype.getRootNode = function(t) {
    var e = E(
      this._fragmentFiber
    );
    return e === null ? this : H(e).getRootNode(t);
  }, Un.prototype.compareDocumentPosition = function(t) {
    var e = E(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    h(
      this._fragmentFiber.child,
      !1,
      Qf,
      n,
      void 0,
      void 0
    );
    var a = H(e);
    if (n.length === 0) {
      if (n = a, R(this._fragmentFiber)) {
        t: {
          for (e = this._fragmentFiber.return; e !== null; ) {
            if (e.tag === 4) {
              e = e.stateNode.containerInfo;
              break t;
            }
            if (e.tag === 3 || e.tag === 5 || e.tag === 27)
              break;
            e = e.return;
          }
          e = null;
        }
        e != null && (n = e);
      }
      e = this._fragmentFiber;
      var i = a = n.compareDocumentPosition(t);
      return n === t ? i = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = O(e)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (t = H(n).compareDocumentPosition(
        t
      ), i = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = H(n[0]), i = H(n[n.length - 1]);
    var o = R(this._fragmentFiber) ? e.parentElement : a;
    if (o == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = o.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, o = o.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var c = e.compareDocumentPosition(t), g = i.compareDocumentPosition(t), T = c & Node.DOCUMENT_POSITION_CONTAINED_BY || g & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return g = a && o && c & Node.DOCUMENT_POSITION_FOLLOWING && g & Node.DOCUMENT_POSITION_PRECEDING, e = a && e === t || o && i === t || T || g ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && e === t || !o && i === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : c, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || kb(
      e,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function kb(t, e, n, a, i) {
    var o = ua(i);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!o)
        t: {
          for (; o !== null; ) {
            if (o.tag === 7 && (o === e || o.alternate === e)) {
              n = !0;
              break t;
            }
            o = o.return;
          }
          n = !1;
        }
      return n;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (o === null)
        return o = i.ownerDocument, i === o || i === o.documentElement || i === o.body;
      t: {
        for (o = e, e = E(e); o !== null; ) {
          if (!(o.tag !== 5 && o.tag !== 3 && o.tag !== 27 || o !== e && o.alternate !== e)) {
            o = !0;
            break t;
          }
          o = o.return;
        }
        o = !1;
      }
      return o;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!o) && !(e = o === n) && (e = w(
      n,
      o,
      p
    ), e === null ? e = !1 : (h(
      e,
      !0,
      Q,
      o,
      n
    ), o = D, D = null, e = o !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!o) && !(e = o === a) && (e = w(
      a,
      o,
      p
    ), e === null ? e = !1 : (h(
      e,
      !0,
      B,
      o,
      a
    ), o = D, X = D = null, e = o !== null)), e) : !1;
  }
  function Rg(t, e) {
    var n = t.ownerDocument.createRange();
    n.selectNodeContents(t), t = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  Un.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(u(566));
    var e = [];
    h(
      this._fragmentFiber.child,
      !1,
      Qf,
      e,
      void 0,
      void 0
    );
    var n = t !== !1;
    if (e.length === 0) {
      var a = O(
        this._fragmentFiber
      );
      if (a = n ? a[1] || a[0] || E(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        t = H(a), Rg(t, n);
        return;
      }
      if (a = H(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          n = "host" in a ? a.host : null, n !== null && n.scrollIntoView(t);
          return;
        }
        a.scrollIntoView(t);
      }
    }
    for (a = n ? e.length - 1 : 0; a !== (n ? -1 : e.length); ) {
      var i = e[a];
      i.tag === 6 ? (i = H(i), Rg(i, n)) : H(i).scrollIntoView(t), a += n ? -1 : 1;
    }
  };
  function qb(t, e) {
    return t = H(t), zg(t, e), !1;
  }
  function zg(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function Mg(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var i = n[a];
        t.addEventListener(
          i.type,
          i.attachedListener,
          wo(i.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(o) {
      for (var c = 0, g = 0; g < ga.length; g++) {
        var T = ga[g];
        (T.fragmentInstance !== e || T.observer !== o || T.instance !== t) && (ga[c++] = T);
      }
      ga.length = c, o.observe(t);
    }), zg(t, e));
  }
  function Gb(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var i = n[a];
        t.removeEventListener(
          i.type,
          i.attachedListener,
          wo(i.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(o) {
      typeof o.rootMargin == "string" ? Vb(
        e,
        o,
        t
      ) : o.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Kf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Kf(n), Qi(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function Xb(t, e, n, a) {
    for (; t.nodeType === 1; ) {
      var i = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[oi])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (o = t.getAttribute("rel"), o === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (o !== i.rel || t.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || t.getAttribute("title") !== (i.title == null ? null : i.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (o = t.getAttribute("src"), (o !== (i.src == null ? null : i.src) || t.getAttribute("type") !== (i.type == null ? null : i.type) || t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && o && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var o = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && t.getAttribute("name") === o)
          return t;
      } else return t;
      if (t = ta(t.nextSibling), t === null) break;
    }
    return null;
  }
  function Qb(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = ta(t.nextSibling), t === null)) return null;
    return t;
  }
  function jg(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = ta(t.nextSibling), t === null)) return null;
    return t;
  }
  function If(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Jf(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function Zb(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var a = function() {
        e(), n.removeEventListener("DOMContentLoaded", a);
      };
      n.addEventListener("DOMContentLoaded", a), t._reactRetry = a;
    }
  }
  function ta(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Ff = null;
  function Hg(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return ta(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Ug(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Kb(t, e) {
    function n() {
      a = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var a = !1;
    try {
      t.ownerDocument.addEventListener("focus", n, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", n, !0);
    }
    return a;
  }
  function Ib(t) {
    Eg(function() {
      Eg(function(e) {
        return t(e);
      });
    });
  }
  function Bg(t, e, n) {
    switch (e = Or(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(u(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(u(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(u(454));
        return t;
      default:
        throw Error(u(451));
    }
  }
  function Lg(t, e, n) {
    for (var a in n) {
      var i = n[a];
      n.hasOwnProperty(a) && i != null && Ft(t, e, a, null, _b, i);
    }
    n.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === ln && (t.onclick = null), Qi(t);
  }
  function $f(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Qi(t);
  }
  var ea = /* @__PURE__ */ new Map(), Vg = /* @__PURE__ */ new Set();
  function Nr(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var nl = gt.d;
  gt.d = {
    f: Jb,
    r: Fb,
    D: $b,
    C: Pb,
    L: Wb,
    m: t1,
    X: n1,
    S: e1,
    M: a1
  };
  function Jb() {
    var t = nl.f(), e = Is();
    return t || e;
  }
  function Fb(t) {
    var e = ri(t);
    e !== null && e.tag === 5 && e.type === "form" ? kh(e) : nl.r(t);
  }
  var Co = typeof document > "u" ? null : document;
  function Yg(t, e, n) {
    var a = Co;
    if (a && typeof e == "string" && e) {
      var i = oe(e);
      i = 'link[rel="' + t + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), Vg.has(i) || (Vg.add(i), t = { rel: t, crossOrigin: n, href: e }, a.querySelector(i) === null && (e = a.createElement("link"), Je(e, "link", t), W(e), a.head.appendChild(e)));
    }
  }
  function $b(t) {
    nl.D(t), Yg("dns-prefetch", t, null);
  }
  function Pb(t, e) {
    nl.C(t, e), Yg("preconnect", t, e);
  }
  function Wb(t, e, n) {
    nl.L(t, e, n);
    var a = Co;
    if (a && t && e) {
      var i = 'link[rel="preload"][as="' + oe(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + oe(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + oe(
        n.imageSizes
      ) + '"]')) : i += '[href="' + oe(t) + '"]';
      var o = i;
      switch (e) {
        case "style":
          o = Ao(t);
          break;
        case "script":
          o = Oo(t);
      }
      if (!(ea.has(o) || (t = C(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), ea.set(o, t), a.querySelector(i) !== null || e === "style" && a.querySelector(Dr(o)) || e === "script" && a.querySelector(Rr(o))))) {
        var c = a.createElement("link");
        Je(c, "link", t), e === "style" && (c[Xi] = !0, c.onload = c.onerror = function() {
          pt(c);
        }), W(c), a.head.appendChild(c);
      }
    }
  }
  function t1(t, e) {
    nl.m(t, e);
    var n = Co;
    if (n && t) {
      var a = e && typeof e.as == "string" ? e.as : "script", i = 'link[rel="modulepreload"][as="' + oe(a) + '"][href="' + oe(t) + '"]', o = i;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          o = Oo(t);
      }
      if (!ea.has(o) && (t = C({ rel: "modulepreload", href: t }, e), ea.set(o, t), n.querySelector(i) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Rr(o)))
              return;
        }
        a = n.createElement("link"), Je(a, "link", t), W(a), n.head.appendChild(a);
      }
    }
  }
  function e1(t, e, n) {
    nl.S(t, e, n);
    var a = Co;
    if (a && t) {
      var i = $(a).hoistableStyles, o = Ao(t);
      e = e || "default";
      var c = i.get(o);
      if (!c) {
        var g = { loading: 0, preload: null };
        if (c = a.querySelector(
          Dr(o)
        ))
          g.loading = 5;
        else {
          t = C(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = ea.get(o)) && Pf(t, n);
          var T = c = a.createElement("link");
          W(T), Je(T, "link", t), T._p = new Promise(function(L, G) {
            T.onload = L, T.onerror = G;
          }), T.addEventListener("load", function() {
            g.loading |= 1;
          }), T.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, eu(c, e, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: g
        }, i.set(o, c);
      }
    }
  }
  function n1(t, e) {
    nl.X(t, e);
    var n = Co;
    if (n && t) {
      var a = $(n).hoistableScripts, i = Oo(t), o = a.get(i);
      o || (o = n.querySelector(Rr(i)), o || (t = C({ src: t, async: !0 }, e), (e = ea.get(i)) && Wf(t, e), o = n.createElement("script"), W(o), Je(o, "link", t), n.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, a.set(i, o));
    }
  }
  function a1(t, e) {
    nl.M(t, e);
    var n = Co;
    if (n && t) {
      var a = $(n).hoistableScripts, i = Oo(t), o = a.get(i);
      o || (o = n.querySelector(Rr(i)), o || (t = C({ src: t, async: !0, type: "module" }, e), (e = ea.get(i)) && Wf(t, e), o = n.createElement("script"), W(o), Je(o, "link", t), n.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, a.set(i, o));
    }
  }
  function kg(t, e, n, a) {
    var i = (i = Gn.current) ? Nr(i) : null;
    if (!i) throw Error(u(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Ao(n.href), e = $(
          i
        ).hoistableStyles, a = e.get(n), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = Ao(n.href);
          var o = $(
            i
          ).hoistableStyles, c = o.get(t);
          if (c || (i = i.ownerDocument || i, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, o.set(t, c), (o = i.querySelector(
            Dr(t)
          )) ? o._p || (c.instance = o, c.state.loading = 5) : (o = ea.get(t), o || (o = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, ea.set(t, o)), l1(
            i,
            t,
            o,
            c.state
          ))), e && a === null)
            throw Error(u(528, ""));
          return c;
        }
        if (e && a !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (n = Oo(n), e = $(
          i
        ).hoistableScripts, a = e.get(n), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(u(444, t));
    }
  }
  function Ao(t) {
    return 'href="' + oe(t) + '"';
  }
  function Dr(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function qg(t) {
    return C({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function l1(t, e, n, a) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[Xi] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[Xi] = !0, e.onload = e.onerror = pt.bind(null, e), Je(e, "link", n), W(e), t.head.appendChild(e);
    a.preload = e, e.addEventListener("load", function() {
      return a.loading |= 1;
    }), e.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function Oo(t) {
    return '[src="' + oe(t) + '"]';
  }
  function Rr(t) {
    return "script[async]" + t;
  }
  function Gg(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + oe(n.href) + '"]'
          );
          if (a)
            return e.instance = a, W(a), a;
          var i = C({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), W(a), Je(a, "style", i), eu(a, n.precedence, t), e.instance = a;
        case "stylesheet":
          i = Ao(n.href);
          var o = t.querySelector(
            Dr(i)
          );
          if (o)
            return e.state.loading |= 4, e.instance = o, W(o), o;
          a = qg(n), (i = ea.get(i)) && Pf(a, i), o = (t.ownerDocument || t).createElement("link"), W(o);
          var c = o;
          return c._p = new Promise(function(g, T) {
            c.onload = g, c.onerror = T;
          }), Je(o, "link", a), e.state.loading |= 4, eu(o, n.precedence, t), e.instance = o;
        case "script":
          return o = Oo(n.src), (i = t.querySelector(
            Rr(o)
          )) ? (e.instance = i, W(i), i) : (a = n, (i = ea.get(o)) && (a = C({}, n), Wf(a, i)), t = t.ownerDocument || t, i = t.createElement("script"), W(i), Je(i, "link", a), t.head.appendChild(i), e.instance = i);
        case "void":
          return null;
        default:
          throw Error(u(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, eu(a, n.precedence, t));
    return e.instance;
  }
  function eu(t, e, n) {
    for (var a = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = a.length ? a[a.length - 1] : null, o = i, c = 0; c < a.length; c++) {
      var g = a[c];
      if (g.dataset.precedence === e) o = g;
      else if (o !== i) break;
    }
    o ? o.parentNode.insertBefore(t, o.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function Pf(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Wf(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var nu = null;
  function Xg(t, e, n) {
    if (nu === null) {
      var a = /* @__PURE__ */ new Map(), i = nu = /* @__PURE__ */ new Map();
      i.set(n, a);
    } else
      i = nu, a = i.get(n), a || (a = /* @__PURE__ */ new Map(), i.set(n, a));
    if (a.has(t)) return a;
    for (a.set(t, null), n = n.getElementsByTagName(t), i = 0; i < n.length; i++) {
      var o = n[i];
      if (!(o[oi] || o[ce] || t === "link" && o.getAttribute("rel") === "stylesheet") && o.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = o.getAttribute(e) || "";
        c = t + c;
        var g = a.get(c);
        g ? g.push(o) : a.set(c, [o]);
      }
    }
    return a;
  }
  function td(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function i1(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        return e.rel === "stylesheet" ? (t = e.disabled, typeof e.precedence == "string" && t == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function Qg(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function Zg(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Kg(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Ig(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += Kg(e), t.suspenseyImages.push(e)), t = s1.bind(t), e.decode().then(t, t));
  }
  function o1(t, e, n, a) {
    if (n.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var i = Ao(a.href), o = e.querySelector(
          Dr(i)
        );
        if (o) {
          e = o._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = zr.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = o, W(o);
          return;
        }
        o = e.ownerDocument || e, a = qg(a), (i = ea.get(i)) && Pf(a, i), o = o.createElement("link"), W(o);
        var c = o;
        c._p = new Promise(function(g, T) {
          c.onload = g, c.onerror = T;
        }), Je(o, "link", a), n.instance = o;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = zr.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var au = 0;
  function r1(t, e) {
    return t.stylesheets && t.count === 0 && iu(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var a = setTimeout(function() {
        if (t.stylesheets && iu(t, t.stylesheets), t.unsuspend) {
          var o = t.unsuspend;
          t.unsuspend = null, o();
        }
      }, 6e4 + e);
      0 < t.imgBytes && au === 0 && (au = 62500 * wb());
      var i = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && iu(t, t.stylesheets), t.unsuspend)) {
            var o = t.unsuspend;
            t.unsuspend = null, o();
          }
        },
        (t.imgBytes > au ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(i);
      };
    } : null;
  }
  function Jg(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) iu(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function zr() {
    this.count--, Jg(this);
  }
  function s1() {
    this.imgCount--, Jg(this);
  }
  var lu = null;
  function iu(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, lu = /* @__PURE__ */ new Map(), e.forEach(u1, t), lu = null, zr.call(t));
  }
  function u1(t, e) {
    if (!(e.state.loading & 4)) {
      var n = lu.get(t);
      if (n) var a = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), lu.set(t, n);
        for (var i = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), o = 0; o < i.length; o++) {
          var c = i[o];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (n.set(c.dataset.precedence, c), a = c);
        }
        a && n.set(null, a);
      }
      i = e.instance, c = i.getAttribute("data-precedence"), o = n.get(c) || a, o === a && n.set(null, i), n.set(c, i), this.count++, a = zr.bind(this), i.addEventListener("load", a), i.addEventListener("error", a), o ? o.parentNode.insertBefore(i, o.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(i, t.firstChild)), e.state.loading |= 4;
    }
  }
  var No = {
    $$typeof: vt,
    Provider: null,
    Consumer: null,
    _currentValue: he,
    _currentValue2: he,
    _threadCount: 0
  };
  function c1(t, e, n, a, i, o, c, g, T) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Vi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Vi(0), this.hiddenUpdates = Vi(null), this.identifierPrefix = a, this.onUncaughtError = i, this.onCaughtError = o, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Fg(t, e, n, a, i, o, c, g, T, L, G, F) {
    return t = new c1(
      t,
      e,
      n,
      c,
      T,
      L,
      G,
      F,
      g
    ), e = 1, o === !0 && (e |= 24), o = pn(3, null, null, e), t.current = o, o.stateNode = t, e = mc(), e.refCount++, t.pooledCache = e, e.refCount++, o.memoizedState = {
      element: a,
      isDehydrated: n,
      cache: e
    }, yc(o), t;
  }
  function $g(t) {
    return t ? (t = to, t) : to;
  }
  function Pg(t, e, n, a, i, o) {
    i = $g(i), a.context === null ? a.context = i : a.pendingContext = i, a = Rl(e), a.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (a.callback = o), n = zl(t, a, e), n !== null && (xn(n, t, e), ur(n, t, e));
  }
  function Wg(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function ed(t, e) {
    Wg(t, e), (t = t.alternate) && Wg(t, e);
  }
  function tv(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = gi(t, 67108864);
      e !== null && xn(e, t, 67108864), ed(t, 67108864);
    }
  }
  function ev(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Hn();
      e = bl(e);
      var n = gi(t, e);
      n !== null && xn(n, t, e), ed(t, e);
    }
  }
  var Do = !0;
  function f1(t, e, n, a) {
    var i = ut.T;
    ut.T = null;
    var o = gt.p;
    try {
      gt.p = 2, nd(t, e, n, a);
    } finally {
      gt.p = o, ut.T = i;
    }
  }
  function d1(t, e, n, a) {
    var i = ut.T;
    ut.T = null;
    var o = gt.p;
    try {
      gt.p = 8, nd(t, e, n, a);
    } finally {
      gt.p = o, ut.T = i;
    }
  }
  function nd(t, e, n, a) {
    if (Do) {
      var i = ad(a);
      if (i === null)
        Bf(
          t,
          e,
          a,
          ou,
          n
        ), av(t, a);
      else if (m1(
        i,
        t,
        e,
        n,
        a
      ))
        a.stopPropagation();
      else if (av(t, a), e & 4 && -1 < h1.indexOf(t)) {
        for (; i !== null; ) {
          var o = ri(i);
          if (o !== null)
            switch (o.tag) {
              case 3:
                if (o = o.stateNode, o.current.memoizedState.isDehydrated) {
                  var c = ka(o.pendingLanes);
                  if (c !== 0) {
                    var g = o;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; c; ) {
                      var T = 1 << 31 - Ut(c);
                      g.entanglements[1] |= T, c &= ~T;
                    }
                    Na(o), (Qt & 6) === 0 && (Qs = Ye() + 500, wr(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = gi(o, 2), g !== null && xn(g, o, 2), Is(), ed(o, 2);
            }
          if (o = ad(a), o === null && Bf(
            t,
            e,
            a,
            ou,
            n
          ), o === i) break;
          i = o;
        }
        i !== null && a.stopPropagation();
      } else
        Bf(
          t,
          e,
          a,
          null,
          n
        );
    }
  }
  function ad(t) {
    return t = ci(t), ld(t);
  }
  var ou = null;
  function ld(t) {
    if (ou = null, t = ua(t), t !== null) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = m(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = v(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ou = t, null;
  }
  function nv(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (vl()) {
          case ke:
            return 2;
          case Ya:
            return 8;
          case $e:
          case ai:
            return 32;
          case pl:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var id = !1, Xl = null, Ql = null, Zl = null, Mr = /* @__PURE__ */ new Map(), jr = /* @__PURE__ */ new Map(), Kl = [], h1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function av(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Xl = null;
        break;
      case "dragenter":
      case "dragleave":
        Ql = null;
        break;
      case "mouseover":
      case "mouseout":
        Zl = null;
        break;
      case "pointerover":
      case "pointerout":
        Mr.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        jr.delete(e.pointerId);
    }
  }
  function Hr(t, e, n, a, i, o) {
    return t === null || t.nativeEvent !== o ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: a,
      nativeEvent: o,
      targetContainers: [i]
    }, e !== null && (e = ri(e), e !== null && tv(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, i !== null && e.indexOf(i) === -1 && e.push(i), t);
  }
  function m1(t, e, n, a, i) {
    switch (e) {
      case "focusin":
        return Xl = Hr(
          Xl,
          t,
          e,
          n,
          a,
          i
        ), !0;
      case "dragenter":
        return Ql = Hr(
          Ql,
          t,
          e,
          n,
          a,
          i
        ), !0;
      case "mouseover":
        return Zl = Hr(
          Zl,
          t,
          e,
          n,
          a,
          i
        ), !0;
      case "pointerover":
        var o = i.pointerId;
        return Mr.set(
          o,
          Hr(
            Mr.get(o) || null,
            t,
            e,
            n,
            a,
            i
          )
        ), !0;
      case "gotpointercapture":
        return o = i.pointerId, jr.set(
          o,
          Hr(
            jr.get(o) || null,
            t,
            e,
            n,
            a,
            i
          )
        ), !0;
    }
    return !1;
  }
  function lv(t) {
    var e = ua(t.target);
    if (e !== null) {
      var n = d(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = m(n), e !== null) {
            t.blockedOn = e, ii(t.priority, function() {
              ev(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = v(n), e !== null) {
            t.blockedOn = e, ii(t.priority, function() {
              ev(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function ru(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = ad(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var a = new n.constructor(
          n.type,
          n
        );
        ui = a, n.target.dispatchEvent(a), ui = null;
      } else
        return e = ri(n), e !== null && tv(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function iv(t, e, n) {
    ru(t) && n.delete(e);
  }
  function g1() {
    id = !1, Xl !== null && ru(Xl) && (Xl = null), Ql !== null && ru(Ql) && (Ql = null), Zl !== null && ru(Zl) && (Zl = null), Mr.forEach(iv), jr.forEach(iv);
  }
  function su(t, e) {
    t.blockedOn === e && (t.blockedOn = null, id || (id = !0, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      g1
    )));
  }
  var uu = null;
  function ov(t) {
    uu !== t && (uu = t, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      function() {
        uu === t && (uu = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], a = t[e + 1], i = t[e + 2];
          if (typeof a != "function") {
            if (ld(a || n) === null)
              continue;
            break;
          }
          var o = ri(n);
          o !== null && (t.splice(e, 3), e -= 3, Vc(
            o,
            {
              pending: !0,
              data: i,
              method: n.method,
              action: a
            },
            a,
            i
          ));
        }
      }
    ));
  }
  function Ro(t) {
    function e(T) {
      return su(T, t);
    }
    Xl !== null && su(Xl, t), Ql !== null && su(Ql, t), Zl !== null && su(Zl, t), Mr.forEach(e), jr.forEach(e);
    for (var n = 0; n < Kl.length; n++) {
      var a = Kl[n];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Kl.length && (n = Kl[0], n.blockedOn === null); )
      lv(n), n.blockedOn === null && Kl.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (a = 0; a < n.length; a += 3) {
        var i = n[a], o = n[a + 1], c = i[qe] || null;
        if (typeof o == "function")
          c || ov(n);
        else if (c) {
          var g = null;
          if (o && o.hasAttribute("formAction")) {
            if (i = o, c = o[qe] || null)
              g = c.formAction;
            else if (ld(i) !== null) continue;
          } else g = c.action;
          typeof g == "function" ? n[a + 1] = g : (n.splice(a, 3), a -= 3), ov(n);
        }
      }
  }
  function rv() {
    function t(o) {
      o.canIntercept && o.info === "react-transition" && o.intercept({
        handler: function() {
          return new Promise(function(c) {
            return i = c;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      i !== null && (i(), i = null), a || setTimeout(n, 20);
    }
    function n() {
      if (!a && !navigation.transition) {
        var o = navigation.currentEntry;
        o && o.url != null && navigation.navigate(o.url, {
          state: o.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, i = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), i !== null && (i(), i = null);
      };
    }
  }
  function od(t) {
    this._internalRoot = t;
  }
  cu.prototype.render = od.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(u(409));
    var n = e.current, a = Hn();
    Pg(n, a, t, e, null, null);
  }, cu.prototype.unmount = od.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      Pg(t.current, 2, null, t, null, null), Is(), e[wn] = null;
    }
  };
  function cu(t) {
    this._internalRoot = t;
  }
  cu.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Zn();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < Kl.length && e !== 0 && e < Kl[n].priority; n++) ;
      Kl.splice(n, 0, t), n === 0 && lv(t);
    }
  };
  var sv = r.version;
  if (sv !== "19.3.0")
    throw Error(
      u(
        527,
        sv,
        "19.3.0"
      )
    );
  gt.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(u(188)) : (t = Object.keys(t).join(","), Error(u(268, t)));
    return t = x(e), t = t !== null ? _(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var v1 = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ut,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var fu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!fu.isDisabled && fu.supportsFiber)
      try {
        ie = fu.inject(
          v1
        ), Xt = fu;
      } catch {
      }
  }
  return Br.createRoot = function(t, e) {
    if (!f(t)) throw Error(u(299));
    var n = !1, a = "", i = $h, o = Ph, c = Wh;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (i = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError)), e = Fg(
      t,
      1,
      !1,
      null,
      null,
      n,
      a,
      null,
      i,
      o,
      c,
      rv
    ), t[wn] = e.current, Uf(t), new od(e);
  }, Br.hydrateRoot = function(t, e, n) {
    if (!f(t)) throw Error(u(299));
    var a = !1, i = "", o = $h, c = Ph, g = Wh, T = null;
    return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (o = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), e = Fg(
      t,
      1,
      !0,
      e,
      n ?? null,
      a,
      i,
      T,
      o,
      c,
      g,
      rv
    ), e.context = $g(null), n = e.current, a = Hn(), a = bl(a), i = Rl(a), i.callback = null, zl(n, i, a), n = a, e.current.lanes = n, qa(e, n), Na(e), t[wn] = e.current, Uf(t), new cu(e);
  }, Br.version = "19.3.0", Br;
}
var yv;
function C1() {
  if (yv) return ud.exports;
  yv = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (r) {
        console.error(r);
      }
  }
  return l(), ud.exports = w1(), ud.exports;
}
var A1 = C1();
const O1 = (l) => l.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Wv = (...l) => l.filter((r, s, u) => !!r && r.trim() !== "" && u.indexOf(r) === s).join(" ").trim();
var N1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const D1 = S.forwardRef(
  ({
    color: l = "currentColor",
    size: r = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: u,
    className: f = "",
    children: d,
    iconNode: m,
    ...v
  }, b) => S.createElement(
    "svg",
    {
      ref: b,
      ...N1,
      width: r,
      height: r,
      stroke: l,
      strokeWidth: u ? Number(s) * 24 / Number(r) : s,
      className: Wv("lucide", f),
      ...v
    },
    [
      ...m.map(([x, _]) => S.createElement(x, _)),
      ...Array.isArray(d) ? d : [d]
    ]
  )
);
const Ln = (l, r) => {
  const s = S.forwardRef(
    ({ className: u, ...f }, d) => S.createElement(D1, {
      ref: d,
      iconNode: r,
      className: Wv(`lucide-${O1(l)}`, u),
      ...f
    })
  );
  return s.displayName = `${l}`, s;
};
const R1 = Ln("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const z1 = Ln("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const M1 = Ln("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const j1 = Ln("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const H1 = Ln("LogOut", [
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ["polyline", { points: "16 17 21 12 16 7", key: "1gabdz" }],
  ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "1uyos4" }]
]);
const U1 = Ln("MessagesSquare", [
  ["path", { d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z", key: "p1xzt8" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1", key: "1cx29u" }]
]);
const B1 = Ln("OctagonX", [
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
      key: "2d38gg"
    }
  ],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
const L1 = Ln("PanelLeft", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
]);
const V1 = Ln("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);
const Y1 = Ln("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
const k1 = Ln("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
const q1 = Ln("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const tp = Ln("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function ep(l) {
  var r, s, u = "";
  if (typeof l == "string" || typeof l == "number") u += l;
  else if (typeof l == "object") if (Array.isArray(l)) {
    var f = l.length;
    for (r = 0; r < f; r++) l[r] && (s = ep(l[r])) && (u && (u += " "), u += s);
  } else for (s in l) l[s] && (u && (u += " "), u += s);
  return u;
}
function G1() {
  for (var l, r, s = 0, u = "", f = arguments.length; s < f; s++) (l = arguments[s]) && (r = ep(l)) && (u && (u += " "), u += r);
  return u;
}
const bv = (l) => typeof l == "boolean" ? `${l}` : l === 0 ? "0" : l, Sv = G1, Xd = (l, r) => (s) => {
  var u;
  if (r?.variants == null) return Sv(l, s?.class, s?.className);
  const { variants: f, defaultVariants: d } = r, m = Object.keys(f).map((x) => {
    const _ = s?.[x], h = d?.[x];
    if (_ === null) return null;
    const E = bv(_) || bv(h);
    return f[x][E];
  }), v = s && Object.entries(s).reduce((x, _) => {
    let [h, E] = _;
    return E === void 0 || (x[h] = E), x;
  }, {}), b = r == null || (u = r.compoundVariants) === null || u === void 0 ? void 0 : u.reduce((x, _) => {
    let { class: h, className: E, ...R } = _;
    return Object.entries(R).every((O) => {
      let [M, H] = O;
      return Array.isArray(H) ? H.includes({
        ...d,
        ...v
      }[M]) : {
        ...d,
        ...v
      }[M] === H;
    }) ? [
      ...x,
      h,
      E
    ] : x;
  }, []);
  return Sv(l, m, b, s?.class, s?.className);
}, np = 48, Ba = (l, r = 0) => {
  const s = new Int32Array(l.length);
  for (let u = 0; u < l.length; u++) s[u] = l.charCodeAt(u) - np - r;
  return s;
}, Du = (l) => {
  const r = new Int32Array(l.length + 1);
  for (let s = 0; s < l.length; s++) r[s + 1] = r[s] + l[s];
  return r;
}, Fl = (l) => {
  const r = new Int32Array(l.length);
  let s = 0;
  for (let u = 0; u < l.length; u++) {
    const f = l.charCodeAt(u) - np;
    s += f >>> 1 ^ -(f & 1), r[u] = s;
  }
  return r;
}, X1 = 384, Q1 = [], Hi = Du(Ba("E0500002005282000000002000150000020021820000011200000003022202000300004200120000200420001200021200301200010400162000010000220021010:2192001200220012000220012000200200200400010200040000000000400200108200110100000022010313000162002000020020012020080213000228200000000082000000000120002000120020020040101020300130001001010")), Z1 = Du(Ba(":11111111211111119311546544411119731869:671397415686432441111111111161114151214313433415:78311132233313187211117221449443411141111151152226611131111112212518142224214215421421542142424242516171151615616347111111111197911327451111111111111111111113134714133513411111311111111111111111111112444411111342312715245411117:3")), K1 = "@containerabcdefghinlmoprstunderlineviawzccentlignnimatespectuto-colsrowsaglorightnessckdrop-sisbcontrastfiltergrayscalehue-rotateinvertopacityslurrightnessaturateepia-coniclinearpositionradialsizeockurrderttom-belrstxyespacing-xyaretoursorlnt-umnsendspantartainentrasteividerop-shadowurationcorationlay-xyasendillexontromlter-featuresstretchapr-xyayscaleidow-colsrowsue-rotatedentlinesetvert-beringsxyeshadoweiadingftnest-clamp-imageabein-lrstxyskx--b-coniclpositionrsizet-x-y-fromto-fromto-inearfromto-fromto-adialfromto-fromtofromtofromtofromtoblockhinlinew-screenesblockhinlinewbjectpacityrutlinederigin-offsetbelrstxyesrspective-originaceholderioghtng-offsettateundedw-xyz-belrstlreseslr-endspantartaturatecepiahizekewpace-taleroll-xyz-barmpbelrstxyesbelrstxyes-thumbrackadowrink-xyxyartrokeabextora-shadowpckingnsformitionlate-xyz-offsetill-changeoom", I1 = (() => {
  const l = Hi.length - 1, r = new Int32Array(l);
  for (let f = l - 1; f >= 0; f--) {
    let d = 1, m = f + 1;
    for (let v = Hi[f]; v < Hi[f + 1]; v++)
      d += r[m], m += r[m];
    r[f] = d;
  }
  const s = new Int32Array(Hi[l]);
  let u = 0;
  for (let f = 0; f < l; f++) {
    let d = f + 1;
    for (let m = Hi[f]; m < Hi[f + 1]; m++)
      s[u++] = d, d += r[d];
  }
  return s;
})(), J1 = Ba("02000000000000900<=0?000B000F00F00ŏI0J0LNPRTVX0000]_a00000000000000000000000rst0000000zŏ00000000000ŏ0000000ŏ00000000000000000000000000000000000000000000000000000000000000Ë000000000000000000000Þ000000000000000000ð0000000ø0ùúûüýþÿĀāĂăĄąĆ000000000000000000000000000000000000000000ħ0ĨĪ00000000000000000000ļĽ00000Ŭ000000", 1), F1 = Du(Ba("123333359346463635126536711576")), $1 = Ba("93203242332583253248325D>E?F@03263243255B:032523853:0325B:8GA032542H<C=12727B:0328432553;D>E?3257D>032585:0325B:;0328B:032"), P1 = Ba("012113445661666666789111:5;;;;;;;;444;;;:62999<1161=62>>?61:21@ABCD4446996:64E:::;:?::64:F114GHHIHHHHIHH1HH1HH1HHHHHH::EEJ4444::EE4444441691;644444114244444:;K6666555555555555555999666664444444444444444444444226?6:66644L9M?D:111::::6DE199"), W1 = Fl("020200202020020020020020020020200200200200200200200002020202001003040106000200200200200200200200200200200200200200200200200200200200200200200200200200200200020020020020020020002020200202002002002002002002002002002020002002020020200220200200200200200200200200200200020020020000200020002000200200200020020020002000200200200020020202002020202000200200020022000200200020020002002000200220002002000200W0Z00020020002002020002002000200g0j0002002000200200020020002002000200200020020002000200002000002002002002002000200020000200002002002002002002002020020020200200200200200200200200202020020020020020020020020002002002020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020002002002002002002000200200200200200200200200200020202020002000200020002002002002000020200200"), tS = (() => {
  const l = (/* @__PURE__ */ new Int32Array(319)).fill(-1), r = Fl("02422242:222222242224222242442222222422222244442242226224222426222422442462222422622222222626222462242622422622422424242422222222422222222242422222222222222222622442224222222222222224424442262222222222222222222226224222424242422224422422422222"), s = Fl("02222222222222222222202222222222222222222222221422222222222222222222222222222222222Y\\222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222221422222222222222222222222222222222222222Ŀł222222222222222222");
  for (let u = 0; u < r.length; u++) l[r[u]] = s[u];
  return l;
})(), eS = "container |break-after- all auto avoid avoid-page column left page right|break-before- all auto avoid avoid-page column left page right|break-inside-a uto void void-column void-page|box-decoration- clone slice|box- border content| contents flow-root hidden table table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group| not-sr-only sr-only|float- end left none right start|clear- both end left none right start|isolat e ion-auto|overflow- auto clip hidden scroll visible|overflow-x- auto clip hidden scroll visible|overflow-y- auto clip hidden scroll visible|overscroll- auto contain none|overscroll-x- auto contain none|overscroll-y- auto contain none| absolute fixed relative static sticky| collapse invisible visible|justify- around baseline between center center-safe end end-safe evenly normal start stretch|justify-items- center center-safe end end-safe normal start stretch|justify-self- auto center center-safe end end-safe start stretch|items- baseline baseline-last center center-safe end end-safe start stretch|self- auto baseline baseline-last center center-safe end end-safe start stretch|place-content- around baseline between center center-safe end end-safe evenly start stretch|place-items- baseline center center-safe end end-safe start stretch|place-self- auto center center-safe end end-safe start stretch| antialiased subpixel-antialiased| italic not-italic|normal-nums |ordinal |slashed-zero | lining-nums oldstyle-nums| proportional-nums tabular-nums| diagonal-fractions stacked-fractions| no-underline overline| capitalize lowercase normal-case uppercase|truncate |whitespace- break-spaces normal nowrap pre pre-line pre-wrap|break- all keep normal words|wrap- anywhere break-word normal|hyphens- auto manual none|mix-blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay plus-darker plus-lighter saturation screen soft-light|table- auto fixed|caption- bottom top|backface- hidden visible|appearance- auto none|scheme- dark light light-dark normal only-dark only-light|field-sizing- content fixed|pointer-events- auto none|resize  -none -x -y|snap- align-none center end start|snap- always normal|snap- both none x y|snap- mandatory proximity|touch- auto manipulation none|touch-pan- left right x|touch-pan- down up y|touch-pinch-zoom |select- all auto none text|forced-color-adjust- auto none| normal size| baseline bottom middle sub super text-bottom text-top top| bounce none ping pulse spin| auto square video| auto fr max min px|none | auto full px| fixed local scroll|clip- border content padding text|origin- border content padding| bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| no-repeat repeat repeat-round repeat-space repeat-x repeat-y| auto contain cover| gradient-to-b gradient-to-bl gradient-to-br gradient-to-l gradient-to-r gradient-to-t gradient-to-tl gradient-to-tr none|blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay saturation screen soft-light|to- b bl br l r t tl tr| auto dvh fit full lh lvh max min px screen svh| dashed dotted double hidden none solid| collapse separate|px |auto |full | content none strict| inline-size size|layout |paint |style | around baseline between center center-safe end end-safe evenly normal start stretch| alias all-scroll auto cell col-resize context-menu copy crosshair default e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize no-drop none not-allowed ns-resize nw-resize nwse-resize pointer progress row-resize s-resize se-resize sw-resize text vertical-text w-resize wait zoom-in zoom-out| dashed dotted double solid wavy| auto from-font|reverse |initial | in in-out initial linear out| col col-reverse row row-reverse| nowrap wrap wrap-reverse| auto initial none| black bold extrabold extralight light medium normal semibold thin| condensed expanded extra-condensed extra-expanded normal semi-condensed semi-expanded ultra-condensed ultra-expanded|flow- col col-dense dense row row-dense| none subgrid| auto dvh dvw fit full lh lvh lvw max min px screen svh svw| block flex grid table| auto dvw fit full lvw max min px screen svw| loose none normal px relaxed snug tight|through |item | inside outside| decimal disc none| auto px| clip-border clip-content clip-fill clip-padding clip-stroke clip-view no-clip| add exclude intersect subtract| alpha luminance match|origin- border content fill padding stroke view|type- alpha luminance| circle ellipse| closest-corner closest-side farthest-corner farthest-side|at- bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| dvh fit full lh lvh max min none px screen svh| auto dvh dvw fit full lh lvh lvw max min none px screen svh svw| dvw fit full lvw max min none px screen svw| auto dvh dvw fit full lvh lvw max min none prose px svh svw| auto dvh dvw fit full lvh lvw max min none px screen svh svw| contain cover fill none scale-down| first last none| distant dramatic midrange near none normal|inset | full none|3d | auto smooth|gutter- auto both stable| auto none thin| inner none| auto dvh dvw fit full lvh lvw max min px svh svw|base | center end justify left right start| clip ellipsis| balance nowrap pretty wrap| normal tight tighter wide wider widest| cpu gpu none| 3d flat| all colors none opacity shadow transform| discrete normal| full px| auto dvh dvw fit full lvh lvw max min px screen svh svw| auto contents scroll transform".split("|").map((l) => {
  const r = l.split(" "), s = r.shift();
  for (let u = 0; u < r.length; u++) r[u] = s + r[u];
  return r;
}), xv = Fl("0000000000000000000000000000000000000000000000000000000000000262242:6@200000006:240B428:4422400002046044222426220026642642462026224222824220022400000000\\00N222422242222222224062242222222422226264222422222222222222442804222422222222222222222222220<4<0204260002444020204224422"), nS = Fl("ɠ222222222222222222222222222222222222222222222222222222222222˕4222226>ʶ22ʷʺʷ2ʸʷ42ʴ2ʓ22>621422ɶ222ɹɼɷɺɷɺ22ɱ42222ɨ2ɧ26622ɘɓ244ƸƵ222]d24242ǖǓƚÄȫ2263ȨȥȨ2222222ǣ222222222222222222ǂƽ2ƾƵ2222222422222ƜƑ22222222222222222222144Ŧţ22Ţş222222222222222222222ĸ2ı68ĦģĦɡŰ4Ġ«®ĝ822ĔđĔ2ē2222622"), aS = Fl("02222222222222222222222222222222222222222222222222222222222222222202022222222222EH2200IL021042222Y\\222IL0cf2e10j2222U00X202[^2y0000120|{~22:22|22222222222G000qOVI00000}2>40000B00000I¨©000¬00000000000000021M®­00°000000000000000000000222HGHa1º222¿2À2222ÉÌ000­°2±"), ap = /* @__PURE__ */ new Int32Array(995), lp = /* @__PURE__ */ new Int32Array(995), ip = /* @__PURE__ */ new Int32Array(995);
let wd = "";
const Cd = /* @__PURE__ */ new Int32Array(1038);
{
  const l = /* @__PURE__ */ new Map();
  let r = 0, s = 0;
  for (let u = 0; u < xv.length; u++) for (const f of eS[aS[u]]) {
    let d = l.get(f);
    d === void 0 && (d = r++, l.set(f, d), Cd[d * 2] = wd.length, Cd[d * 2 + 1] = f.length, wd += f), ap[s] = xv[u], lp[s] = nS[u], ip[s] = d, s++;
  }
}
const lS = Fl("0b2N:222@R>F@286¦2@H2D266226FB22B2>BD\\6N22222Z222D222p"), iS = Du(Ba("1::24444432:442:44:44>222222:44:4421322511111311111114")), oS = Fl("24A;33N=C@H4A;33N=C@<27;83:;8393NQ:3NQʰ222ˉºŴŽ2R2=18cƴÅŇ=cĞÛC1ƈǝȈ:ħ25=11D3A@4=<1;1DEr25;11B3?<6;:371BCn9@7=<8192>2E121@9@EHE@9>2T25511<398454131<=V25511<398454131<=ƧNž2Đå242L222290000f22500ɛ000ǘ222"), rS = Ba("ĳ"), sS = Ba(""), uS = Ba("1"), cS = "* ** after backdrop before details-content file first-letter first-line marker placeholder selection";
var fS = {
  GROUP_COUNT: X1,
  customValidatorNames: Q1,
  edgeStart: Hi,
  labelStart: Z1,
  labelText: K1,
  edgeTarget: I1,
  nodeGroup: J1,
  nodeVlist: tS,
  vlistPat: F1,
  vlistOps: $1,
  vlistRef: P1,
  vlistGroup: W1,
  litAnchor: ap,
  litGroup: lp,
  litPool: ip,
  poolOffsets: Cd,
  poolText: wd,
  adjGid: lS,
  adjStart: iS,
  adjTgt: oS,
  patGid: rS,
  patTgt: sS,
  postfixLookupGroups: uS,
  orderSensitiveModifiers: cS
};
const dS = "line" in /* @__PURE__ */ new Error(), Da = -1, Mi = -1, hd = (l, r, s) => {
  let u = 2166136261;
  for (let f = r; f < s; f++) u = Math.imul(u ^ l.charCodeAt(f), 16777619);
  return u;
}, xu = (l, r, s) => {
  const u = s - r;
  let f = Math.imul(u, 2654435761) ^ l.charCodeAt(r);
  if (u > 3) {
    const d = u >> 2, m = u >> 1;
    f = Math.imul(f ^ l.charCodeAt(r + 1) << 8 ^ l.charCodeAt(r + 2) << 16 ^ l.charCodeAt(r + d), 2246822507), f = Math.imul(f ^ l.charCodeAt(r + m) << 8 ^ l.charCodeAt(r + m + d) << 16 ^ l.charCodeAt(s - 3), 3266489909), f ^= l.charCodeAt(s - 2) << 8 ^ l.charCodeAt(s - 1) << 16;
    for (let v = r + 3, b = s - 4; v < r + 8 && v < b; v++, b--) f = Math.imul(f ^ l.charCodeAt(v) ^ l.charCodeAt(b) << 8, 16777619);
  }
  return f ^ f >>> 15 | 0;
}, hS = (l, r, s = {}) => {
  const { GROUP_COUNT: u, edgeStart: f, labelStart: d, labelText: m, edgeTarget: v, nodeGroup: b, nodeVlist: x, vlistPat: _, vlistOps: h, vlistRef: E, vlistGroup: R, litAnchor: O, litGroup: M, litPool: H, poolOffsets: D, poolText: X, adjGid: Q, adjStart: B, adjTgt: p, patGid: w, patTgt: C, postfixLookupGroups: k, customValidatorNames: K, orderSensitiveModifiers: lt } = l, at = new Int32Array(u).fill(-1);
  for (let q = 0; q < Q.length; q++) at[Q[q]] = q;
  let tt = 0;
  for (let q = 0; q + 1 < B.length; q++) {
    const $ = B[q + 1] - B[q];
    $ > tt && (tt = $);
  }
  let ct = 32;
  for (; ct < 2 * (1 + tt + w.length); ) ct <<= 1;
  const I = new Int32Array(E.length + 1);
  for (let q = 0; q < E.length; q++) I[q + 1] = I[q] + _[E[q] + 1] - _[E[q]];
  const vt = new Uint8Array(u);
  for (let q = 0; q < k.length; q++) vt[k[q]] = 1;
  const Z = f.length - 1, nt = new Uint8Array(Z);
  let et = 0, ft = !0;
  for (let q = 0; q < O.length; q++) {
    nt[O[q]] = 1;
    const $ = D[H[q] * 2 + 1];
    $ > et && (et = $);
    const W = X.charCodeAt(D[H[q] * 2]);
    (W === 91 || W === 40) && (ft = !1);
  }
  let mt = 1;
  for (; mt < O.length * 2; ) mt <<= 1;
  const Vt = new Int32Array(mt).fill(-1);
  for (let q = 0; q < O.length; q++) {
    const $ = D[H[q] * 2];
    let W = (hd(X, $, $ + D[H[q] * 2 + 1]) ^ Math.imul(O[q], 2654435761) | 0) & mt - 1;
    for (; Vt[W] !== -1; ) W = W + 1 & mt - 1;
    Vt[W] = q;
  }
  const $t = (q, $, W, pt) => {
    let Ot = (hd($, W, pt) ^ Math.imul(q, 2654435761) | 0) & mt - 1;
    const wt = pt - W;
    for (; ; ) {
      const zt = Vt[Ot];
      if (zt === -1) return -1;
      if (O[zt] === q && D[H[zt] * 2 + 1] === wt) {
        const Pt = D[H[zt] * 2];
        let Zt = !0;
        for (let Et = 0; Et < wt; Et++) if (X.charCodeAt(Pt + Et) !== $.charCodeAt(W + Et)) {
          Zt = !1;
          break;
        }
        if (Zt) return M[zt];
      }
      Ot = Ot + 1 & mt - 1;
    }
  }, re = s.cacheSize ?? 8192, A = s.prefix ?? l.prefix ?? "", z = A === "" ? "" : A + ":", P = z.length, it = (K ?? []).map((q) => {
    throw new Error("cn: missing validator " + q);
  }), bt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, st = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, St = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ut = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  let gt = 0, he = -1, kn = -1, xe = -1, Ne = -1;
  const ee = (q) => q >= 97 && q <= 122 || q >= 65 && q <= 90 || q >= 48 && q <= 57 || q === 95, Gt = (q) => /\s/.test(String.fromCharCode(q)), me = (q, $, W) => {
    if (gt = 0, he = -1, W - $ < 3) return;
    const pt = q.charCodeAt($), Ot = q.charCodeAt(W - 1);
    if (pt === 91 && Ot === 93) gt = 1;
    else if (pt === 40 && Ot === 41) gt = 2;
    else return;
    xe = $ + 1, Ne = W - 1;
    let wt = $ + 1;
    if (ee(q.charCodeAt(wt))) {
      for (wt++; wt < W - 1; ) {
        const zt = q.charCodeAt(wt);
        if (!ee(zt) && zt !== 45) break;
        wt++;
      }
      wt < W - 2 && q.charCodeAt(wt) === 58 && (he = $ + 1, kn = wt, xe = wt + 1);
    }
  }, qn = (q, $, W, pt) => {
    if (W - $ !== pt.length) return !1;
    for (let Ot = 0; Ot < pt.length; Ot++) if (q.charCodeAt($ + Ot) !== pt.charCodeAt(Ot)) return !1;
    return !0;
  }, Gn = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, ge = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, aa = (q) => !!q && !Number.isNaN(Number(q)), nn = (q, $, W) => {
    if (W - $ < 11 || !qn(q, $, $ + 10, "@container")) return !1;
    if (q.charCodeAt($ + 10) === 47) return W - $ >= 12;
    const pt = q.charCodeAt($ + 11);
    return pt === 115 && W - $ >= 17 && qn(q, $ + 10, $ + 16, "-size/") || pt === 110 && W - $ >= 19 && qn(q, $ + 10, $ + 18, "-normal/");
  }, ei = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2
  ], hl = "length|number|number weight|family-name|position percentage|length size bg-size|image url|shadow|length|family-name|position percentage|length size bg-size|image url|shadow|number weight".split("|").map((q) => q.split(" ")), ya = [
    2,
    3,
    1,
    0,
    0,
    0,
    4,
    5,
    0,
    0,
    0,
    0,
    0,
    1,
    1
  ], Li = (q, $, W, pt) => {
    if (q >= 10) {
      if (q >= 25) return it[q - 25]($.slice(W, pt));
      const Ot = q - 10;
      if (gt !== ei[Ot]) return !1;
      if (he >= 0) {
        for (const wt of hl[Ot]) if (qn($, he, kn, wt)) return !0;
        return !1;
      }
      switch (ya[Ot]) {
        case 0:
          return !1;
        case 1:
          return !0;
        case 2: {
          const wt = $.slice(xe, Ne);
          return bt.test(wt) && !st.test(wt);
        }
        case 3:
          return aa($.slice(xe, Ne));
        case 4:
          return ut.test($.slice(xe, Ne));
        default:
          return St.test($.slice(xe, Ne));
      }
    }
    switch (q) {
      case 0:
        return !0;
      case 1:
        return gt === 0;
      case 2:
        return gt === 1;
      case 3:
        return gt === 2;
      case 4:
        return Gn.test($.slice(W, pt));
      case 5:
        return aa($.slice(W, pt));
      case 6: {
        const Ot = $.slice(W, pt);
        return !!Ot && Number.isInteger(Number(Ot));
      }
      case 7:
        return pt > W && $.charCodeAt(pt - 1) === 37 && aa($.slice(W, pt - 1));
      case 8:
        return ge.test($.slice(W, pt));
      default:
        return nn($, W, pt);
    }
  }, Tn = new Set(typeof lt == "string" ? lt.split(" ") : lt), ba = (q, $, W, pt, Ot, wt) => {
    const zt = hd($, W, pt) ^ (Ot ? 2654435769 : 0) | 0;
    let Pt = q.get(zt);
    if (Pt !== void 0) t: for (let Nt = 0; Nt < Pt.length; Nt++) {
      const qt = Pt[Nt];
      if (!(qt.imp !== Ot || qt.k.length !== pt - W)) {
        for (let xt = 0; xt < qt.k.length; xt++) if (qt.k.charCodeAt(xt) !== $.charCodeAt(W + xt)) continue t;
        return qt.id;
      }
    }
    else q.set(zt, Pt = []);
    const Zt = $.slice(W, pt), Et = wt(Zt);
    return Pt.push({
      k: Zt,
      imp: Ot,
      id: Et
    }), Et;
  };
  let dn = /* @__PURE__ */ new Map(), ml = /* @__PURE__ */ new Map(), hn = 2;
  const gl = 4096, ni = (q, $) => {
    const W = [];
    let pt = 0, Ot = 0, wt = 0;
    for (let Et = 0; Et < q.length; Et++) {
      const Nt = q.charCodeAt(Et);
      pt === 0 && Ot === 0 && Nt === 58 ? (W.push(q.slice(wt, Et)), wt = Et + 1) : Nt === 91 ? pt++ : Nt === 93 ? pt-- : Nt === 40 ? Ot++ : Nt === 41 && Ot--;
    }
    W.push(q.slice(wt));
    let zt = W[0];
    if (W.length > 1) {
      const Et = [];
      let Nt = [];
      for (const qt of W) qt.charCodeAt(0) === 91 || Tn.has(qt) ? (Nt.length && (Et.push(...Nt.sort()), Nt = []), Et.push(qt)) : Nt.push(qt);
      Nt.length && Et.push(...Nt.sort()), zt = Et.join(":");
    }
    const Pt = $ ? zt + " !" : zt;
    let Zt = ml.get(Pt);
    return Zt === void 0 && ml.set(Pt, Zt = hn++), Zt;
  };
  let La = /* @__PURE__ */ new Map(), Va = u;
  const mn = u + 4096, Ye = () => Va++, vl = 2097152, ke = 8192, Ya = new Int32Array(ke), $e = new Array(ke).fill(null), ai = new Int32Array(ke), pl = new Int32Array(ke), Tt = new Uint8Array(ke);
  let ue = 0;
  const ie = (q, $, W, pt, Ot, wt, zt, Pt) => {
    let Zt = q;
    if ($e[q] !== null)
      if ($e[q | 1] === null) Zt = q | 1;
      else if ((ue++ & 3) === 0) Zt = q | ue >> 2 & 1;
      else return;
    $e[Zt] = $.slice(W, pt), Ya[Zt] = Ot, ai[Zt] = wt, pl[Zt] = zt, Tt[Zt] = Pt;
  }, Xt = () => $e.fill(null);
  let ne = 256, Ut = [
    new Int32Array(ne),
    new Int32Array(ne),
    new Int32Array(ne),
    new Int32Array(ne)
  ], [ye, De, Xn, Ee] = Ut, gn = new Uint8Array(ne), la = new Uint8Array(ne);
  const ka = () => {
    ne *= 2, Ut = Ut.map(($) => {
      const W = new Int32Array(ne);
      return W.set($), W;
    }), [ye, De, Xn, Ee] = Ut;
    const q = new Uint8Array(ne);
    q.set(gn), gn = q, la = new Uint8Array(ne);
  };
  let ia = 64, oa = new Int32Array(ia), yl = new Int32Array(ia);
  const Go = new Int32Array(u);
  let ra = 2048, Vi = 21, qa = new Float64Array(ra), Yi = new Int32Array(ra), sa = 0;
  const ki = (q, $) => {
    if (q === 0 && $ < u)
      return Go[$] === sa ? 1 : (Go[$] = sa, 0);
    const W = q * 2097152 + $ + 1;
    let pt = Math.imul(W, 2654435761) >>> Vi;
    for (; Yi[pt] === sa; ) {
      if (qa[pt] === W) return 1;
      pt = pt + 1 & ra - 1;
    }
    return qa[pt] = W, Yi[pt] = sa, 0;
  }, li = (q, $, W, pt, Ot) => {
    if (W - $ >= 2 && q.charCodeAt($) === 91 && q.charCodeAt(W - 1) === 93) {
      let wt = -1;
      for (let zt = $ + 1; zt < W - 1; zt++) if (q.charCodeAt(zt) === 58) {
        wt = zt;
        break;
      }
      return wt === -1 || wt === $ + 1 ? Da : ba(La, q, $ + 1, wt, 0, Ye);
    }
    if (pt >= 0 && b[pt] >= 0) return b[pt];
    for (let wt = Ot - 1; wt >= 0; wt--) {
      const zt = yl[wt];
      if (zt > W) continue;
      const Pt = oa[wt], Zt = W - zt;
      if (nt[Pt] === 1 && Zt > 0 && Zt <= et) {
        const fe = q.charCodeAt(zt);
        if (ft === !1 || fe !== 91 && fe !== 40) {
          const Cn = $t(Pt, q, zt, W);
          if (Cn >= 0) return Cn;
        }
      }
      const Et = x[Pt];
      if (Et < 0) continue;
      const Nt = E[Et], qt = _[Nt], xt = _[Nt + 1];
      if (qt === xt) continue;
      me(q, zt, W);
      const Re = I[Et] - qt;
      for (let fe = qt; fe < xt; fe++) if (Li(h[fe], q, zt, W)) return R[Re + fe];
    }
    return Da;
  }, bl = (q) => {
    const $ = q.length;
    let W = 0, pt = 0, Ot = !1;
    (hn > gl || dn.size > gl) && (dn = /* @__PURE__ */ new Map(), ml = /* @__PURE__ */ new Map(), hn = 2, Xt()), Va > mn && (La = /* @__PURE__ */ new Map(), Va = u, Xt());
    let wt = 0;
    for (; wt < $; ) {
      let Et = q.charCodeAt(wt);
      if (Et === 32 || Et >= 9 && Et <= 13 || Et >= 160 && Gt(Et)) {
        Et !== 32 && (Ot = !0), wt++;
        continue;
      }
      const Nt = wt;
      let qt = 0;
      for (; wt < $; ) {
        if (Et = q.charCodeAt(wt), Et <= 32) {
          if (Et === 32) break;
          if (Et >= 9 && Et <= 13) {
            Ot = !0;
            break;
          }
        } else if (Et >= 160 && Gt(Et)) {
          Ot = !0;
          break;
        }
        qt = Math.imul(qt ^ Et, 16777619), wt++;
      }
      const xt = wt, Re = xt - Nt;
      W === ne && ka();
      const fe = W++;
      ye[fe] = Nt, De[fe] = xt, pt += Re, qt ^= Math.imul(Re, 2654435761);
      const Cn = qt ^ qt >>> 15 | 0, _e = Cn & 8190;
      {
        let Yt = -1;
        if (Ya[_e] === Cn && $e[_e] !== null && $e[_e].length === Re ? Yt = _e : Ya[_e | 1] === Cn && $e[_e | 1] !== null && $e[_e | 1].length === Re && (Yt = _e | 1), Yt >= 0) {
          const je = $e[Yt];
          let Kn = !0;
          for (let Nn = 0; Nn < Re; Nn++) if (je.charCodeAt(Nn) !== q.charCodeAt(Nt + Nn)) {
            Kn = !1;
            break;
          }
          if (Kn) {
            Xn[fe] = ai[Yt], Ee[fe] = pl[Yt], gn[fe] = Tt[Yt];
            continue;
          }
        }
      }
      let Te = Nt;
      if (P !== 0) {
        if (xt - Nt <= P || !q.startsWith(z, Nt)) {
          Xn[fe] = Da, ie(_e, q, Nt, xt, Cn, Da, 0, 0);
          continue;
        }
        Te = Nt + P;
      }
      let Zi = 0, Qo = 0, Ga = -1, Ki = -1;
      for (let Yt = Te; Yt < xt; Yt++) {
        const je = q.charCodeAt(Yt);
        if (Zi === 0 && Qo === 0) {
          if (je === 58) {
            Ga = Yt;
            continue;
          }
          if (je === 47) {
            Ki = Yt;
            continue;
          }
        }
        je === 91 ? Zi++ : je === 93 ? Zi-- : je === 40 ? Qo++ : je === 41 && Qo--;
      }
      const Ir = Ga >= Te ? Ga + 1 : Te;
      let oe = Ir, Pe = xt, xl = !1, Ii = 0;
      Pe > oe && q.charCodeAt(Pe - 1) === 33 ? (xl = !0, Pe--) : Pe > oe && q.charCodeAt(oe) === 33 && (xl = !0, oe++, Ii = 1);
      let vn = -1;
      Ki > Ir && (vn = Ki + Ii, vn >= Pe && (vn = -1));
      let Ji = oe;
      Pe - oe > 1 && q.charCodeAt(oe) === 45 && (Ji = oe + 1);
      let An = 0, an = 0, El = 0, Zo = -1, On = 0;
      (x[0] >= 0 || nt[0] === 1) && (oa[0] = 0, yl[0] = Ji, On = 1);
      let si = Mi, Ko = 0;
      for (let Yt = Ji; Yt < Pe; Yt++)
        if (Yt === vn && (si = an < El ? Mi : An, Ko = On), An !== Mi) {
          const je = q.charCodeAt(Yt);
          let Kn = -1;
          if (an < El)
            m.charCodeAt(an) === je ? (an++, an === El && (Kn = An = Zo)) : An = Mi;
          else {
            const Nn = f[An], fi = f[An + 1];
            let Xa = Mi;
            for (let Xe = Nn; Xe < fi; Xe++) {
              const di = d[Xe];
              if (m.charCodeAt(di) === je) {
                d[Xe + 1] - di === 1 ? Kn = Xa = v[Xe] : (an = di + 1, El = d[Xe + 1], Zo = v[Xe], Xa = An);
                break;
              }
            }
            An = Xa;
          }
          if (Kn >= 0 && (x[Kn] >= 0 || nt[Kn] === 1) && Yt + 1 < Pe && q.charCodeAt(Yt + 1) === 45) {
            if (On === ia) {
              ia *= 2;
              const Nn = new Int32Array(ia);
              Nn.set(oa), oa = Nn;
              const fi = new Int32Array(ia);
              fi.set(yl), yl = fi;
            }
            oa[On] = Kn, yl[On] = Yt + 2, On++;
          }
        }
      vn === Pe && (si = an < El ? Mi : An, Ko = On);
      const Io = an < El ? Mi : An;
      let Ge, ln = !1;
      if (vn >= 0)
        if (ln = !0, Ge = li(q, oe, vn, si, Ko), Ge !== Da && Ge < u && vt[Ge]) {
          const Yt = li(q, oe, Pe, Io, On);
          Yt !== Da && Yt !== Ge && (Ge = Yt, ln = !1);
        } else Ge === Da && (Ge = li(q, oe, Pe, Io, On), ln = !1);
      else Ge = li(q, oe, Pe, Io, On);
      let ui = 0, ci = 0;
      Ge === Da ? Xn[fe] = Da : (ci = ln ? 1 : 0, ui = Te >= Ga ? xl ? 1 : 0 : ba(dn, q, Te, Ga, xl ? 1 : 0, (Yt) => ni(Yt, xl)), Xn[fe] = Ge, gn[fe] = ci, Ee[fe] = ui), ie(_e, q, Nt, xt, Cn, Ge, ui, ci);
    }
    if (W === 0) return "";
    if (W === 1) return ye[0] === 0 && De[0] === $ ? q : q.slice(ye[0], De[0]);
    if (W * ct > ra) {
      for (; W * ct > ra; )
        ra <<= 1, Vi--;
      qa = new Float64Array(ra), Yi = new Int32Array(ra);
    }
    if (hn >= vl || Va >= vl) throw new Error("cn: too many distinct classes in one merge");
    sa = sa + 1 | 0, sa === 0 && (Go.fill(0), Yi.fill(0), sa = 1);
    let zt = !1;
    for (let Et = W - 1; Et >= 0; Et--) {
      const Nt = Xn[Et];
      if (Nt === Da) {
        la[Et] = 1;
        continue;
      }
      const qt = Ee[Et];
      if (ki(qt, Nt) === 1) {
        la[Et] = 0, zt = !0;
        continue;
      }
      if (la[Et] = 1, Nt < u) {
        const xt = at[Nt];
        if (xt >= 0) for (let Re = B[xt]; Re < B[xt + 1]; Re++) ki(qt, p[Re]);
        if (gn[Et] & 1)
          for (let Re = 0; Re < w.length; Re++) w[Re] === Nt && ki(qt, C[Re]);
      }
    }
    if (!zt && !Ot && $ === pt + W - 1) return q;
    let Pt = "", Zt = 0;
    for (; Zt < W; ) {
      if (!la[Zt]) {
        Zt++;
        continue;
      }
      const Et = ye[Zt];
      let Nt = De[Zt], qt = Zt + 1;
      for (; qt < W && la[qt] && ye[qt] === Nt + 1 && q.charCodeAt(Nt) === 32; )
        Nt = De[qt], qt++;
      Pt.length > 0 && (Pt += " "), Pt += q.slice(Et, Nt), Zt = qt;
    }
    return Pt;
  }, Qn = 16384, Zn = new Int32Array(Qn * 2);
  let ii = 0, be = 1, ce = /* @__PURE__ */ Object.create(null), qe = /* @__PURE__ */ Object.create(null), wn = /* @__PURE__ */ new Map(), Xo = /* @__PURE__ */ new Map(), qi = 0, Gi = 0;
  const Sl = () => {
    ii ^= Qn, be = be + 1 | 0, Gi = 0;
  }, oi = (q) => {
    let $ = ce[q];
    if ($ !== void 0) return $;
    const W = xu(q, 0, q.length), pt = (W & 16383) + ii, Ot = Zn[pt] === (W ^ be) || Zn[pt ^ Qn] === (W ^ be - 1);
    return Ot && ($ = qe[q], $ !== void 0) ? (ce[q] = $, $) : ($ = bl(q), Ot ? (ce[q] = $, ++qi > re && (qi = 0, qe = ce, ce = /* @__PURE__ */ Object.create(null), Sl())) : (Zn[pt] = W ^ be, ++Gi > Qn && Sl()), $);
  }, Xi = (q) => {
    let $ = wn.get(q);
    if ($ !== void 0) return $;
    const W = xu(q, 0, q.length), pt = (W & 16383) + ii, Ot = Zn[pt] === (W ^ be) || Zn[pt ^ Qn] === (W ^ be - 1);
    return Ot && ($ = Xo.get(q), $ !== void 0) ? (wn.set(q, $), $) : ($ = bl(q), Ot ? (wn.set(q, $), ++qi > re && (qi = 0, Xo = wn, wn = /* @__PURE__ */ new Map(), Sl())) : (Zn[pt] = W ^ be, ++Gi > Qn && Sl()), $);
  }, Qi = (q) => {
    const $ = xu(q, 0, q.length), W = ($ & 16383) + ii;
    return Zn[W] === ($ ^ be) || Zn[W ^ Qn] === ($ ^ be - 1) ? !0 : (Zn[W] = $ ^ be, ++Gi > Qn && Sl(), !1);
  }, ua = re === 0 ? bl : dS ? (q) => {
    const $ = wn.get(q);
    return $ !== void 0 ? $ : Xi(q);
  } : oi;
  return {
    merge: function() {
      return arguments.length === 1 && typeof arguments[0] == "string" ? ua(arguments[0]) : ua(gS.apply(null, arguments));
    },
    mergeString: ua,
    seenBefore: re === 0 ? () => !1 : Qi,
    mergeUncached: bl
  };
}, wu = (l, r) => {
  if (!l) return "";
  if (typeof l == "string") return l;
  let s = "";
  if (typeof l.length == "number" && (!r || Array.isArray(l))) {
    const u = l;
    for (let f = 0; f < u.length; f++) {
      const d = u[f];
      if (!d) continue;
      const m = typeof d == "string" ? d : wu(d, r);
      m && (s && (s += " "), s += m);
    }
    return s;
  }
  if (r) {
    if (typeof l == "number") return "" + l;
    if (typeof l == "object")
      for (const u in l) l[u] && (s && (s += " "), s += u);
  }
  return s;
}, mS = (l, r) => {
  let s = "";
  for (let u = 0; u < l.length; u++) {
    const f = l[u];
    if (!f) continue;
    const d = typeof f == "string" ? f : wu(f, r);
    d && (s && (s += " "), s += d);
  }
  return s;
}, gS = function() {
  return mS(arguments, !1);
}, vS = 256, Ev = 16, pS = 1024, md = 4096, yS = (l, r) => {
  const s = r === void 0 ? () => !0 : r.seenBefore, u = r === void 0 ? l : r.mergeUncached;
  let f = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), m = 0, v = null, b = null, x = [], _ = [], h = 0;
  const E = (D, X, Q) => {
    b === null && (b = new Array(md).fill(""), x = new Array(md).fill(""), _ = new Array(md).fill(""));
    const B = xu(D, 0, D.length) & 4094;
    if (b[B] === D && x[B] === X) return _[B];
    if (b[B | 1] === D && x[B | 1] === X) return _[B | 1];
    const p = l(Q ? X + " " + D : D), w = b[B] === "" ? B : B | (b[B | 1] === "" ? 1 : h++ & 1);
    return b[w] = D, x[w] = X, _[w] = p, p;
  }, R = (D, X, Q, B) => {
    let p = 0;
    if (X) {
      if (X !== D.a0) return !1;
      p = 1;
    }
    if (Q) {
      if (Q !== (p === 0 ? D.a0 : D.a1)) return !1;
      p++;
    }
    if (B) {
      if (B !== (p === 0 ? D.a0 : p === 1 ? D.a1 : D.a2)) return !1;
      p++;
    }
    return p === D.t;
  }, O = (D, X) => {
    const Q = D.a;
    let B = 0;
    for (let p = 0; p < X.length; p++) {
      const w = X[p];
      if (w) {
        if (w !== Q[B]) return !1;
        B++;
      }
    }
    return B === D.t;
  }, M = (D, X) => {
    const Q = D.length, B = v === null ? null : v.n;
    if (!X) {
      if (B !== null && O(B, D))
        return v = B, B.r;
      if (v !== null && v !== B && O(v, D)) return v.r;
    }
    let p = "", w = -1, C = 0, k = !1;
    for (let at = 0; at < Q; at++) {
      let tt = D[at];
      if (tt) {
        if (typeof tt != "string") {
          if (tt = D[at] = wu(tt, !0), !tt) continue;
          k = !0;
        }
        w < 0 && (p = tt, w = at), C++;
      }
    }
    if (C === 0) return "";
    if (C === 1) return l(p);
    if (k) {
      if (B !== null && O(B, D))
        return v = B, B.r;
      if (v !== null && v !== B && O(v, D)) return v.r;
    }
    let K = f.get(p);
    K === void 0 && (K = d.get(p), K !== void 0 && f.set(p, K));
    let lt = null;
    if (K !== void 0) {
      if (K.skip > 0) {
        K.skip--, v = null;
        let tt = p;
        for (let ct = w + 1; ct < Q; ct++) {
          const I = D[ct];
          I && (tt += " " + I);
        }
        return E(tt, "", !1);
      }
      const at = K.e;
      t: for (let tt = 0; tt < at.length; tt++) {
        const ct = at[tt];
        if (ct.t !== C) continue;
        const I = ct.a;
        let vt = 1;
        for (let Z = w + 1; Z < Q; Z++) {
          const nt = D[Z];
          if (nt && nt !== I[vt++]) continue t;
        }
        lt = ct;
        break;
      }
      lt !== null && (K.miss = 0);
    }
    if (lt === null) {
      let at = p;
      const tt = [p];
      for (let I = w + 1; I < Q; I++) {
        const vt = D[I];
        vt && (at += " " + vt, tt.push(vt));
      }
      if (!s(at)) return u(at);
      lt = {
        r: l(at),
        t: tt.length,
        a0: tt[0],
        a1: tt[1],
        a2: tt[2] ?? "",
        a: tt,
        n: null
      }, K === void 0 ? f.set(p, K = {
        e: [],
        miss: 0,
        skip: 0,
        at: 0
      }) : ++K.miss > Ev && (K.miss = Ev, K.skip = pS, K.e.length = 0, K.at = 0);
      const ct = K.e;
      ct.length < vS ? ct.push(lt) : (ct[K.at] = lt, K.at = K.at + 1 & 255), ++m > 1e3 && (m = 0, d = f, f = /* @__PURE__ */ new Map());
    }
    return v !== null && v !== lt && (v.n = lt), v = lt, lt.r;
  }, H = (D) => Array.isArray(D) ? M(D.slice(), !1) : l(wu(D, !0));
  return function(D, X, Q) {
    const B = arguments.length;
    if ((B | 1) === 3) {
      const C = v;
      if (C !== null) {
        const k = C.n;
        if (k !== null && R(k, D, X, Q))
          return v = k, k.r;
        if (C !== k && R(C, D, X, Q)) return C.r;
      }
      if (B === 2 && typeof X == "string" && X !== "") {
        const k = f.get(D);
        if (k !== void 0 && k.skip > 0)
          return k.skip--, v = null, E(X, D, !0);
      }
      return M([
        D,
        X,
        Q
      ], !0);
    }
    if (B === 1) return typeof D == "string" ? l(D) : H(D);
    const p = v;
    if (p !== null) {
      const C = p.n;
      if (C !== null) {
        const k = C.a;
        let K = 0, lt = !0;
        for (let at = 0; at < B; at++) {
          const tt = arguments[at];
          if (tt) {
            if (tt !== k[K]) {
              lt = !1;
              break;
            }
            K++;
          }
        }
        if (lt && K === C.t)
          return v = C, C.r;
      }
      if (p !== C) {
        const k = p.a;
        let K = 0, lt = !0;
        for (let at = 0; at < B; at++) {
          const tt = arguments[at];
          if (tt) {
            if (tt !== k[K]) {
              lt = !1;
              break;
            }
            K++;
          }
        }
        if (lt && K === p.t) return p.r;
      }
    }
    const w = [];
    for (let C = 0; C < B; C++) w.push(arguments[C]);
    return M(w, !0);
  };
}, _v = /* @__PURE__ */ hS(fS), At = /* @__PURE__ */ yS(_v.mergeString, _v);
var Ru = Pv();
const bS = /* @__PURE__ */ $v(Ru);
var SS = Object.defineProperty, Qd = (l, r) => SS(l, "name", { value: r, configurable: !0 });
function Ad(l, r) {
  if (typeof l == "function")
    return l(r);
  l != null && (l.current = r);
}
Qd(Ad, "setRef");
function op(...l) {
  return (r) => {
    let s = !1;
    const u = l.map((f) => {
      const d = Ad(f, r);
      return !s && typeof d == "function" && (s = !0), d;
    });
    if (s)
      return () => {
        for (let f = 0; f < u.length; f++) {
          const d = u[f];
          typeof d == "function" ? d() : Ad(l[f], null);
        }
      };
  };
}
Qd(op, "composeRefs");
function Vn(...l) {
  return S.useCallback(op(...l), l);
}
Qd(Vn, "useComposedRefs");
var xS = Object.defineProperty, va = (l, r) => xS(l, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function zu(l) {
  const r = S.forwardRef((s, u) => {
    let { children: f, ...d } = s, m = null, v = !1;
    const b = [];
    Od(f) && typeof du == "function" && (f = du(f._payload)), S.Children.forEach(f, (E) => {
      if (fp(E)) {
        v = !0;
        const R = E;
        let O = "child" in R.props ? R.props.child : R.props.children;
        Od(O) && typeof du == "function" && (O = du(O._payload)), m = ES(R, O), b.push(m?.props?.children);
      } else
        b.push(E);
    }), m ? m = S.cloneElement(m, void 0, b) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !v && S.Children.count(f) === 1 && S.isValidElement(f) && (m = f)
    );
    const x = m ? cp(m) : void 0, _ = Vn(u, x);
    if (!m) {
      if (f || f === 0)
        throw new Error(
          v ? wS(l) : TS(l)
        );
      return f;
    }
    const h = up(d, m.props ?? {});
    return m.type !== S.Fragment && (h.ref = u ? _ : x), S.cloneElement(m, h);
  });
  return r.displayName = `${l}.Slot`, r;
}
va(zu, "createSlot");
var Zd = /* @__PURE__ */ zu("Slot"), rp = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function sp(l) {
  const r = /* @__PURE__ */ va((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return r.displayName = `${l}.Slottable`, r.__radixId = rp, r;
}
va(sp, "createSlottable");
var ES = /* @__PURE__ */ va((l, r) => {
  if ("child" in l.props) {
    const s = l.props.child;
    return S.isValidElement(s) ? S.cloneElement(s, void 0, l.props.children(s.props.children)) : null;
  }
  return S.isValidElement(r) ? r : null;
}, "getSlottableElementFromSlottable");
function up(l, r) {
  const s = { ...r };
  for (const u in r) {
    const f = l[u], d = r[u];
    /^on[A-Z]/.test(u) ? f && d ? s[u] = (...v) => {
      const b = d(...v);
      return f(...v), b;
    } : f && (s[u] = f) : u === "style" ? s[u] = { ...f, ...d } : u === "className" && (s[u] = [f, d].filter(Boolean).join(" "));
  }
  return { ...l, ...s };
}
va(up, "mergeProps");
function cp(l) {
  let r = Object.getOwnPropertyDescriptor(l.props, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning;
  return s ? l.ref : (r = Object.getOwnPropertyDescriptor(l, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning, s ? l.props.ref : l.props.ref || l.ref);
}
va(cp, "getElementRef");
function fp(l) {
  return S.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === rp;
}
va(fp, "isSlottable");
var _S = /* @__PURE__ */ Symbol.for("react.lazy");
function Od(l) {
  return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === _S && "_payload" in l && dp(l._payload);
}
va(Od, "isLazyComponent");
function dp(l) {
  return typeof l == "object" && l !== null && "then" in l;
}
va(dp, "isPromiseLike");
var TS = /* @__PURE__ */ va((l) => `${l} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), wS = /* @__PURE__ */ va((l) => `${l} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), du = Xr[" use ".trim().toString()], CS = Object.defineProperty, AS = (l, r) => CS(l, "name", { value: r, configurable: !0 }), OS = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], en = OS.reduce((l, r) => {
  const s = /* @__PURE__ */ zu(`Primitive.${r}`), u = S.forwardRef((f, d) => {
    const { asChild: m, ...v } = f, b = m ? s : r;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y.jsx(b, { ...v, ref: d });
  });
  return u.displayName = `Primitive.${r}`, { ...l, [r]: u };
}, {});
function hp(l, r) {
  l && Ru.flushSync(() => l.dispatchEvent(r));
}
AS(hp, "dispatchDiscreteCustomEvent");
var NS = Object.defineProperty, DS = (l, r) => NS(l, "name", { value: r, configurable: !0 }), RS = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), zS = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ DS(function(r, s) {
    return /* @__PURE__ */ y.jsx(
      en.span,
      {
        ...r,
        ref: s,
        style: { ...RS, ...r.style }
      }
    );
  }, "VisuallyHidden")
), MS = zS, jS = Object.defineProperty, na = (l, r) => jS(l, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function HS(l, r) {
  const s = S.createContext(r);
  s.displayName = l + "Context";
  const u = /* @__PURE__ */ na((d) => {
    const { children: m, ...v } = d, b = S.useMemo(() => v, Object.values(v));
    return /* @__PURE__ */ y.jsx(s.Provider, { value: b, children: m });
  }, "Provider");
  u.displayName = l + "Provider";
  function f(d, m = {}) {
    const { optional: v = !1 } = m, b = S.useContext(s);
    if (b) return b;
    if (r !== void 0) return r;
    if (!v)
      throw new Error(`\`${d}\` must be used within \`${l}\``);
  }
  return na(f, "useContext"), [u, f];
}
na(HS, "createContext");
// @__NO_SIDE_EFFECTS__
function Vo(l, r = []) {
  let s = [];
  function u(d, m) {
    const v = S.createContext(m);
    v.displayName = d + "Context";
    const b = s.length;
    s = [...s, m];
    const x = /* @__PURE__ */ na((h) => {
      const { scope: E, children: R, ...O } = h, M = E?.[l]?.[b] || v, H = S.useMemo(() => O, Object.values(O));
      return /* @__PURE__ */ y.jsx(M.Provider, { value: H, children: R });
    }, "Provider");
    x.displayName = d + "Provider";
    function _(h, E, R = {}) {
      const { optional: O = !1 } = R, M = E?.[l]?.[b] || v, H = S.useContext(M);
      if (H) return H;
      if (m !== void 0) return m;
      if (!O)
        throw new Error(`\`${h}\` must be used within \`${d}\``);
    }
    return na(_, "useContext"), [x, _];
  }
  na(u, "createContext");
  const f = /* @__PURE__ */ na(() => {
    const d = s.map((m) => S.createContext(m));
    return /* @__PURE__ */ na(function(v) {
      const b = v?.[l] || d;
      return S.useMemo(
        () => ({ [`__scope${l}`]: { ...v, [l]: b } }),
        [v, b]
      );
    }, "useScope");
  }, "createScope");
  return f.scopeName = l, [u, mp(f, ...r)];
}
na(Vo, "createContextScope");
function mp(...l) {
  const r = l[0];
  if (l.length === 1) return r;
  const s = /* @__PURE__ */ na(() => {
    const u = l.map((f) => ({
      useScope: f(),
      scopeName: f.scopeName
    }));
    return /* @__PURE__ */ na(function(d) {
      const m = u.reduce((v, { useScope: b, scopeName: x }) => {
        const h = b(d)[`__scope${x}`];
        return { ...v, ...h };
      }, {});
      return S.useMemo(() => ({ [`__scope${r.scopeName}`]: m }), [m]);
    }, "useComposedScopes");
  }, "createScope");
  return s.scopeName = r.scopeName, s;
}
na(mp, "composeContextScopes");
var US = Object.defineProperty, Yo = (l, r) => US(l, "name", { value: r, configurable: !0 }), gp = !!(typeof window < "u" && window.document && window.document.createElement);
function tn(l, r, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ Yo(function(f) {
    if (l?.(f), s === !1 || !f || !f.defaultPrevented)
      return r?.(f);
  }, "handleEvent");
}
Yo(tn, "composeEventHandlers");
function BS(l) {
  if (!gp)
    throw new Error("Cannot access window outside of the DOM");
  return l?.ownerDocument?.defaultView ?? window;
}
Yo(BS, "getOwnerWindow");
function Nd(l) {
  if (!gp)
    throw new Error("Cannot access document outside of the DOM");
  return l?.ownerDocument ?? document;
}
Yo(Nd, "getOwnerDocument");
function vp(l, r = !1) {
  const { activeElement: s } = Nd(l);
  if (!s?.nodeName)
    return null;
  if (pp(s) && s.contentDocument)
    return vp(s.contentDocument.body, r);
  if (r) {
    const u = s.getAttribute("aria-activedescendant");
    if (u) {
      const f = Nd(s).getElementById(u);
      if (f)
        return f;
    }
  }
  return s;
}
Yo(vp, "getActiveElement");
function pp(l) {
  return l.tagName === "IFRAME";
}
Yo(pp, "isFrame");
var fn = globalThis?.document ? S.useLayoutEffect : () => {
}, LS = Object.defineProperty, VS = (l, r) => LS(l, "name", { value: r, configurable: !0 }), Tv = Xr[" useEffectEvent ".trim().toString()], wv = Xr[" useInsertionEffect ".trim().toString()];
function yp(l) {
  if (typeof Tv == "function")
    return Tv(l);
  const r = S.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof wv == "function" ? wv(() => {
    r.current = l;
  }) : fn(() => {
    r.current = l;
  }), S.useMemo(() => ((...s) => r.current?.(...s)), []);
}
VS(yp, "useEffectEvent");
var YS = Object.defineProperty, Qr = (l, r) => YS(l, "name", { value: r, configurable: !0 }), kS = Xr[" useInsertionEffect ".trim().toString()] || fn;
function Kd({
  prop: l,
  defaultProp: r,
  onChange: s = /* @__PURE__ */ Qr(() => {
  }, "onChange"),
  caller: u
}) {
  const [f, d, m] = bp({
    defaultProp: r,
    onChange: s
  }), v = l !== void 0, b = v ? l : f, x = S.useCallback(
    (_) => {
      if (v) {
        const h = Sp(_) ? _(l) : _;
        h !== l && m.current?.(h);
      } else
        d(_);
    },
    [v, l, d, m]
  );
  return [b, x];
}
Qr(Kd, "useControllableState");
function bp({
  defaultProp: l,
  onChange: r
}) {
  const [s, u] = S.useState(l), f = S.useRef(s), d = S.useRef(r);
  return kS(() => {
    d.current = r;
  }, [r]), S.useEffect(() => {
    f.current !== s && (d.current?.(s), f.current = s);
  }, [s, f]), [s, u, d];
}
Qr(bp, "useUncontrolledState");
function Sp(l) {
  return typeof l == "function";
}
Qr(Sp, "isFunction");
var Cv = /* @__PURE__ */ Symbol("RADIX:SYNC_STATE");
function qS(l, r, s, u) {
  const { prop: f, defaultProp: d, onChange: m, caller: v } = r, b = f !== void 0, x = yp(m), _ = [{ ...s, state: d }];
  u && _.push(u);
  const [h, E] = S.useReducer(
    (H, D) => {
      if (D.type === Cv)
        return { ...H, state: D.state };
      const X = l(H, D);
      return b && !Object.is(X.state, H.state) && x(X.state), X;
    },
    ..._
  ), R = h.state, O = S.useRef(R);
  S.useEffect(() => {
    O.current !== R && (O.current = R, b || x(R));
  }, [R, O, b]);
  const M = S.useMemo(() => f !== void 0 ? { ...h, state: f } : h, [h, f]);
  return S.useEffect(() => {
    b && !Object.is(f, h.state) && E({ type: Cv, state: f });
  }, [f, h.state, b]), [M, E];
}
Qr(qS, "useControllableStateReducer");
var GS = Object.defineProperty, rl = (l, r) => GS(l, "name", { value: r, configurable: !0 });
function xp(l, r) {
  return S.useReducer((s, u) => r[s][u] ?? s, l);
}
rl(xp, "useStateMachine");
var Zr = /* @__PURE__ */ rl((l) => {
  const { present: r, children: s } = l, u = Ep(r), f = typeof s == "function" ? s({ present: u.isPresent }) : S.Children.only(s), d = _p(u.ref, Tp(f));
  return typeof s == "function" || u.isPresent ? S.cloneElement(f, { ref: d }) : null;
}, "Presence");
function Ep(l) {
  const [r, s] = S.useState(), u = S.useRef(null), f = S.useRef(l), d = S.useRef("none"), m = S.useRef(void 0), v = l ? "mounted" : "unmounted", [b, x] = xp(v, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return S.useEffect(() => {
    b === "mounted" ? (d.current = m.current ?? Uo(u.current), m.current = void 0) : d.current = "none";
  }, [b]), fn(() => {
    const _ = u.current, h = f.current;
    if (h !== l) {
      const R = d.current, O = Uo(_);
      l ? (m.current = O, x("MOUNT")) : O === "none" || _?.display === "none" ? x("UNMOUNT") : x(h && R !== O ? "ANIMATION_OUT" : "UNMOUNT"), f.current = l;
    }
  }, [l, x]), fn(() => {
    if (r) {
      let _;
      const h = r.ownerDocument.defaultView ?? window, E = /* @__PURE__ */ rl((O) => {
        const H = Uo(u.current).includes(CSS.escape(O.animationName));
        if (O.target === r && H && (x("ANIMATION_END"), !f.current)) {
          const D = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", _ = h.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = D);
          });
        }
      }, "handleAnimationEnd"), R = /* @__PURE__ */ rl((O) => {
        O.target === r && (d.current = Uo(u.current));
      }, "handleAnimationStart");
      return r.addEventListener("animationstart", R), r.addEventListener("animationcancel", E), r.addEventListener("animationend", E), () => {
        h.clearTimeout(_), r.removeEventListener("animationstart", R), r.removeEventListener("animationcancel", E), r.removeEventListener("animationend", E);
      };
    } else
      x("ANIMATION_END");
  }, [r, x]), {
    isPresent: ["mounted", "unmountSuspended"].includes(b),
    ref: S.useCallback((_) => {
      if (_) {
        const h = getComputedStyle(_);
        u.current = h, m.current = Uo(h);
      } else
        u.current = null;
      s(_);
    }, [])
  };
}
rl(Ep, "usePresence");
function Dd(l, r) {
  if (typeof l == "function")
    return l(r);
  l != null && (l.current = r);
}
rl(Dd, "setRef");
function _p(...l) {
  const r = S.useRef(l);
  return r.current = l, S.useCallback((s) => {
    const u = r.current;
    let f = !1;
    const d = u.map((m) => {
      const v = Dd(m, s);
      return !f && typeof v == "function" && (f = !0), v;
    });
    if (f)
      return () => {
        for (let m = 0; m < d.length; m++) {
          const v = d[m];
          typeof v == "function" ? v() : Dd(u[m], null);
        }
      };
  }, []);
}
rl(_p, "useStableComposedRefs");
function Uo(l) {
  return l?.animationName || "none";
}
rl(Uo, "getAnimationName");
function Tp(l) {
  let r = Object.getOwnPropertyDescriptor(l.props, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning;
  return s ? l.ref : (r = Object.getOwnPropertyDescriptor(l, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning, s ? l.props.ref : l.props.ref || l.ref);
}
rl(Tp, "getElementRef");
var XS = Object.defineProperty, QS = (l, r) => XS(l, "name", { value: r, configurable: !0 }), ZS = Xr[" useId ".trim().toString()] || (() => {
}), KS = 0;
function Vr(l) {
  const [r, s] = S.useState(ZS());
  return fn(() => {
    l || s((u) => u ?? String(KS++));
  }, [l]), l || (r ? `radix-${r}` : "");
}
QS(Vr, "useId");
var IS = Object.defineProperty, JS = (l, r) => IS(l, "name", { value: r, configurable: !0 });
function $l(l) {
  const r = S.useRef(l);
  return S.useEffect(() => {
    r.current = l;
  }), S.useMemo(() => ((...s) => r.current?.(...s)), []);
}
JS($l, "useCallbackRef");
var FS = Object.defineProperty, Le = (l, r) => FS(l, "name", { value: r, configurable: !0 }), Rd = "dismissableLayer.update", $S = "dismissableLayer.pointerDownOutside", PS = "dismissableLayer.focusOutside", Av, wp = S.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Cp = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Le(function(r, s) {
    const {
      disableOutsidePointerEvents: u = !1,
      deferPointerDownOutside: f = !1,
      onEscapeKeyDown: d,
      onPointerDownOutside: m,
      onFocusOutside: v,
      onInteractOutside: b,
      onDismiss: x,
      ..._
    } = r, h = S.useContext(wp), [E, R] = S.useState(null), O = E?.ownerDocument ?? globalThis?.document, [, M] = S.useState({}), H = Vn(s, R), D = Array.from(h.layers), [X] = [
      ...h.layersWithOutsidePointerEventsDisabled
    ].slice(-1), Q = X ? D.indexOf(X) : -1, B = E ? D.indexOf(E) : -1, p = h.layersWithOutsidePointerEventsDisabled.size > 0, w = B >= Q, C = S.useRef(!1), k = Op(
      (tt) => {
        m?.(tt), b?.(tt), tt.defaultPrevented || x?.();
      },
      {
        ownerDocument: O,
        deferPointerDownOutside: f,
        isDeferredPointerDownOutsideRef: C,
        dismissableSurfaces: h.dismissableSurfaces,
        shouldHandlePointerDownOutside: S.useCallback(
          (tt) => {
            if (!(tt instanceof Node))
              return !1;
            const ct = [...h.branches].some(
              (I) => I.contains(tt)
            );
            return w && !ct;
          },
          [h.branches, w]
        )
      }
    ), K = Np((tt) => {
      if (f && C.current)
        return;
      const ct = tt.target;
      [...h.branches].some((vt) => vt.contains(ct)) || (v?.(tt), b?.(tt), tt.defaultPrevented || x?.());
    }, O), lt = E ? B === D.length - 1 : !1, at = $l((tt) => {
      tt.key === "Escape" && (d?.(tt), !tt.defaultPrevented && x && (tt.preventDefault(), x()));
    });
    return S.useEffect(() => {
      if (lt)
        return O.addEventListener("keydown", at, { capture: !0 }), () => O.removeEventListener("keydown", at, { capture: !0 });
    }, [O, lt, at]), S.useEffect(() => {
      if (E)
        return u && (h.layersWithOutsidePointerEventsDisabled.size === 0 && (Av = O.body.style.pointerEvents, O.body.style.pointerEvents = "none"), h.layersWithOutsidePointerEventsDisabled.add(E)), h.layers.add(E), zd(), () => {
          u && (h.layersWithOutsidePointerEventsDisabled.delete(E), h.layersWithOutsidePointerEventsDisabled.size === 0 && (O.body.style.pointerEvents = Av));
        };
    }, [E, O, u, h]), S.useEffect(() => () => {
      E && (h.layers.delete(E), h.layersWithOutsidePointerEventsDisabled.delete(E), zd());
    }, [E, h]), S.useEffect(() => {
      const tt = /* @__PURE__ */ Le(() => M({}), "handleUpdate");
      return document.addEventListener(Rd, tt), () => document.removeEventListener(Rd, tt);
    }, []), /* @__PURE__ */ y.jsx(
      en.div,
      {
        ..._,
        ref: H,
        style: {
          pointerEvents: p ? w ? "auto" : "none" : void 0,
          ...r.style
        },
        onFocusCapture: tn(r.onFocusCapture, K.onFocusCapture),
        onBlurCapture: tn(r.onBlurCapture, K.onBlurCapture),
        onPointerDownCapture: tn(
          r.onPointerDownCapture,
          k.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function Ap() {
  const l = S.useContext(wp), [r, s] = S.useState(null);
  return S.useEffect(() => {
    if (r)
      return l.dismissableSurfaces.add(r), () => {
        l.dismissableSurfaces.delete(r);
      };
  }, [r, l.dismissableSurfaces]), s;
}
Le(Ap, "useDismissableLayerSurface");
var WS = /* @__PURE__ */ Le(() => !0, "IS_TRUE");
function Op(l, r) {
  const {
    ownerDocument: s = globalThis?.document,
    deferPointerDownOutside: u = !1,
    isDeferredPointerDownOutsideRef: f,
    dismissableSurfaces: d,
    shouldHandlePointerDownOutside: m = WS
  } = r, v = $l(l), b = S.useRef(!1), x = S.useRef(!1), _ = S.useRef(/* @__PURE__ */ new Map()), h = S.useRef(() => {
  });
  return S.useEffect(() => {
    function E() {
      x.current = !1, f.current = !1, _.current.clear();
    }
    Le(E, "resetOutsideInteraction");
    function R() {
      return Array.from(_.current.values()).some(Boolean);
    }
    Le(R, "isOutsideInteractionIntercepted");
    function O(Q) {
      if (!x.current)
        return;
      const B = Q.target;
      B instanceof Node && [...d].some((w) => w.contains(B)) || _.current.set(Q.type, !0), Q.type === "click" && window.setTimeout(() => {
        x.current && h.current();
      }, 0);
    }
    Le(O, "handleInteractionCapture");
    function M(Q) {
      x.current && _.current.set(Q.type, !1);
    }
    Le(M, "handleInteractionBubble");
    const H = /* @__PURE__ */ Le((Q) => {
      if (Q.target && !b.current) {
        let B = function() {
          s.removeEventListener("click", h.current);
          const w = R();
          E(), w || Id(
            $S,
            v,
            p,
            { discrete: !0 }
          );
        };
        if (Le(B, "handleAndDispatchPointerDownOutsideEvent"), !m(Q.target)) {
          s.removeEventListener("click", h.current), E(), b.current = !1;
          return;
        }
        const p = { originalEvent: Q };
        x.current = !0, f.current = u && Q.button === 0, _.current.clear(), !u || Q.button !== 0 ? B() : (s.removeEventListener("click", h.current), h.current = B, s.addEventListener("click", h.current, { once: !0 }));
      } else
        s.removeEventListener("click", h.current), E();
      b.current = !1;
    }, "handlePointerDown"), D = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const Q of D)
      s.addEventListener(Q, O, !0), s.addEventListener(Q, M);
    const X = window.setTimeout(() => {
      s.addEventListener("pointerdown", H);
    }, 0);
    return () => {
      window.clearTimeout(X), s.removeEventListener("pointerdown", H), s.removeEventListener("click", h.current);
      for (const Q of D)
        s.removeEventListener(Q, O, !0), s.removeEventListener(Q, M);
    };
  }, [
    s,
    v,
    u,
    f,
    d,
    m
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ Le(() => b.current = !0, "onPointerDownCapture")
  };
}
Le(Op, "usePointerDownOutside");
function Np(l, r = globalThis?.document) {
  const s = $l(l), u = S.useRef(!1);
  return S.useEffect(() => {
    const f = /* @__PURE__ */ Le((d) => {
      d.target && !u.current && Id(PS, s, { originalEvent: d }, {
        discrete: !1
      });
    }, "handleFocus");
    return r.addEventListener("focusin", f), () => r.removeEventListener("focusin", f);
  }, [r, s]), {
    onFocusCapture: /* @__PURE__ */ Le(() => u.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ Le(() => u.current = !1, "onBlurCapture")
  };
}
Le(Np, "useFocusOutside");
function zd() {
  const l = new CustomEvent(Rd);
  document.dispatchEvent(l);
}
Le(zd, "dispatchUpdate");
function Id(l, r, s, { discrete: u }) {
  const f = s.originalEvent.target, d = new CustomEvent(l, { bubbles: !1, cancelable: !0, detail: s });
  r && f.addEventListener(l, r, { once: !0 }), u ? hp(f, d) : f.dispatchEvent(d);
}
Le(Id, "handleAndDispatchCustomEvent");
var tx = Object.defineProperty, cn = (l, r) => tx(l, "name", { value: r, configurable: !0 }), gd = "focusScope.autoFocusOnMount", vd = "focusScope.autoFocusOnUnmount", Ov = { bubbles: !1, cancelable: !0 }, ex = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ cn(function(r, s) {
    const {
      loop: u = !1,
      trapped: f = !1,
      onMountAutoFocus: d,
      onUnmountAutoFocus: m,
      ...v
    } = r, [b, x] = S.useState(null), _ = $l(d), h = $l(m), E = S.useRef(null), R = Vn(s, x), O = S.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    S.useEffect(() => {
      if (f) {
        let H = function(B) {
          if (O.paused || !b) return;
          const p = B.target;
          b.contains(p) ? E.current = p : al(E.current, { select: !0 });
        }, D = function(B) {
          if (O.paused || !b) return;
          const p = B.relatedTarget;
          p !== null && (b.contains(p) || al(E.current, { select: !0 }));
        }, X = function(B) {
          if (document.activeElement === document.body)
            for (const w of B)
              w.removedNodes.length > 0 && al(b);
        };
        cn(H, "handleFocusIn"), cn(D, "handleFocusOut"), cn(X, "handleMutations"), document.addEventListener("focusin", H), document.addEventListener("focusout", D);
        const Q = new MutationObserver(X);
        return b && Q.observe(b, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", H), document.removeEventListener("focusout", D), Q.disconnect();
        };
      }
    }, [f, b, O.paused]), S.useEffect(() => {
      if (b) {
        Nv.add(O);
        const H = document.activeElement;
        if (!b.contains(H)) {
          const X = new CustomEvent(gd, Ov);
          b.addEventListener(gd, _), b.dispatchEvent(X), X.defaultPrevented || (Dp(Hp(Jd(b)), { select: !0 }), document.activeElement === H && al(b));
        }
        return () => {
          b.removeEventListener(gd, _), setTimeout(() => {
            const X = new CustomEvent(vd, Ov);
            b.addEventListener(vd, h), b.dispatchEvent(X), X.defaultPrevented || al(H ?? document.body, { select: !0 }), b.removeEventListener(vd, h), Nv.remove(O);
          }, 0);
        };
      }
    }, [b, _, h, O]);
    const M = S.useCallback(
      (H) => {
        if (!u && !f || O.paused) return;
        const D = H.key === "Tab" && !H.altKey && !H.ctrlKey && !H.metaKey, X = document.activeElement;
        if (D && X) {
          const Q = H.currentTarget, [B, p] = Rp(Q);
          B && p ? !H.shiftKey && X === p ? (H.preventDefault(), u && al(B, { select: !0 })) : H.shiftKey && X === B && (H.preventDefault(), u && al(p, { select: !0 })) : X === Q && H.preventDefault();
        }
      },
      [u, f, O.paused]
    );
    return /* @__PURE__ */ y.jsx(en.div, { tabIndex: -1, ...v, ref: R, onKeyDown: M });
  }, "FocusScope")
);
function Dp(l, { select: r = !1 } = {}) {
  const s = document.activeElement;
  for (const u of l)
    if (al(u, { select: r }), document.activeElement !== s) return;
}
cn(Dp, "focusFirst");
function Rp(l) {
  const r = Jd(l), s = Md(r, l), u = Md(r.reverse(), l);
  return [s, u];
}
cn(Rp, "getTabbableEdges");
function Jd(l) {
  const r = [], s = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ cn((u) => {
      const f = u.tagName === "INPUT" && u.type === "hidden";
      return u.disabled || u.hidden || f ? NodeFilter.FILTER_SKIP : u.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; s.nextNode(); ) r.push(s.currentNode);
  return r;
}
cn(Jd, "getTabbableCandidates");
function Md(l, r) {
  const s = typeof r.checkVisibility == "function" && r.checkVisibility({ checkVisibilityCSS: !0 });
  for (const u of l)
    if (!(s ? !u.checkVisibility({ checkVisibilityCSS: !0 }) : zp(u, { upTo: r })))
      return u;
}
cn(Md, "findVisible");
function zp(l, { upTo: r }) {
  if (getComputedStyle(l).visibility === "hidden") return !0;
  for (; l; ) {
    if (r !== void 0 && l === r) return !1;
    if (getComputedStyle(l).display === "none") return !0;
    l = l.parentElement;
  }
  return !1;
}
cn(zp, "isHidden");
function Mp(l) {
  return l instanceof HTMLInputElement && "select" in l;
}
cn(Mp, "isSelectableInput");
function al(l, { select: r = !1 } = {}) {
  if (l && l.focus) {
    const s = document.activeElement;
    l.focus({ preventScroll: !0 }), l !== s && Mp(l) && r && l.select();
  }
}
cn(al, "focus");
var Nv = jp();
function jp() {
  let l = [];
  return {
    add(r) {
      const s = l[0];
      r !== s && s?.pause(), l = jd(l, r), l.unshift(r);
    },
    remove(r) {
      l = jd(l, r), l[0]?.resume();
    }
  };
}
cn(jp, "createFocusScopesStack");
function jd(l, r) {
  const s = [...l], u = s.indexOf(r);
  return u !== -1 && s.splice(u, 1), s;
}
cn(jd, "arrayRemove");
function Hp(l) {
  return l.filter((r) => r.tagName !== "A");
}
cn(Hp, "removeLinks");
var nx = Object.defineProperty, ax = (l, r) => nx(l, "name", { value: r, configurable: !0 }), Up = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ ax(function(r, s) {
    const { container: u, ...f } = r, [d, m] = S.useState(!1);
    fn(() => m(!0), []);
    const v = u || d && globalThis?.document?.body;
    return v ? Ru.createPortal(/* @__PURE__ */ y.jsx(en.div, { ...f, ref: s }), v) : null;
  }, "Portal")
), lx = Object.defineProperty, Fd = (l, r) => lx(l, "name", { value: r, configurable: !0 }), hu = 0, zo = null;
function ix(l) {
  return $d(), l.children;
}
Fd(ix, "FocusGuards");
function $d() {
  S.useEffect(() => {
    zo || (zo = { start: Hd(), end: Hd() });
    const { start: l, end: r } = zo;
    return document.body.firstElementChild !== l && document.body.insertAdjacentElement("afterbegin", l), document.body.lastElementChild !== r && document.body.insertAdjacentElement("beforeend", r), hu++, () => {
      hu === 1 && (zo?.start.remove(), zo?.end.remove(), zo = null), hu = Math.max(0, hu - 1);
    };
  }, []);
}
Fd($d, "useFocusGuards");
function Hd() {
  const l = document.createElement("span");
  return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
}
Fd(Hd, "createFocusGuard");
var Ma = function() {
  return Ma = Object.assign || function(r) {
    for (var s, u = 1, f = arguments.length; u < f; u++) {
      s = arguments[u];
      for (var d in s) Object.prototype.hasOwnProperty.call(s, d) && (r[d] = s[d]);
    }
    return r;
  }, Ma.apply(this, arguments);
};
function Bp(l, r) {
  var s = {};
  for (var u in l) Object.prototype.hasOwnProperty.call(l, u) && r.indexOf(u) < 0 && (s[u] = l[u]);
  if (l != null && typeof Object.getOwnPropertySymbols == "function")
    for (var f = 0, u = Object.getOwnPropertySymbols(l); f < u.length; f++)
      r.indexOf(u[f]) < 0 && Object.prototype.propertyIsEnumerable.call(l, u[f]) && (s[u[f]] = l[u[f]]);
  return s;
}
function ox(l, r, s) {
  if (s || arguments.length === 2) for (var u = 0, f = r.length, d; u < f; u++)
    (d || !(u in r)) && (d || (d = Array.prototype.slice.call(r, 0, u)), d[u] = r[u]);
  return l.concat(d || Array.prototype.slice.call(r));
}
var Eu = "right-scroll-bar-position", _u = "width-before-scroll-bar", rx = "with-scroll-bars-hidden", sx = "--removed-body-scroll-bar-size";
function pd(l, r) {
  return typeof l == "function" ? l(r) : l && (l.current = r), l;
}
function ux(l, r) {
  var s = S.useState(function() {
    return {
      // value
      value: l,
      // last callback
      callback: r,
      // "memoized" public interface
      facade: {
        get current() {
          return s.value;
        },
        set current(u) {
          var f = s.value;
          f !== u && (s.value = u, s.callback(u, f));
        }
      }
    };
  })[0];
  return s.callback = r, s.facade;
}
var cx = typeof window < "u" ? S.useLayoutEffect : S.useEffect, Dv = /* @__PURE__ */ new WeakMap();
function fx(l, r) {
  var s = ux(null, function(u) {
    return l.forEach(function(f) {
      return pd(f, u);
    });
  });
  return cx(function() {
    var u = Dv.get(s);
    if (u) {
      var f = new Set(u), d = new Set(l), m = s.current;
      f.forEach(function(v) {
        d.has(v) || pd(v, null);
      }), d.forEach(function(v) {
        f.has(v) || pd(v, m);
      });
    }
    Dv.set(s, l);
  }, [l]), s;
}
function dx(l) {
  return l;
}
function hx(l, r) {
  r === void 0 && (r = dx);
  var s = [], u = !1, f = {
    read: function() {
      if (u)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return s.length ? s[s.length - 1] : l;
    },
    useMedium: function(d) {
      var m = r(d, u);
      return s.push(m), function() {
        s = s.filter(function(v) {
          return v !== m;
        });
      };
    },
    assignSyncMedium: function(d) {
      for (u = !0; s.length; ) {
        var m = s;
        s = [], m.forEach(d);
      }
      s = {
        push: function(v) {
          return d(v);
        },
        filter: function() {
          return s;
        }
      };
    },
    assignMedium: function(d) {
      u = !0;
      var m = [];
      if (s.length) {
        var v = s;
        s = [], v.forEach(d), m = s;
      }
      var b = function() {
        var _ = m;
        m = [], _.forEach(d);
      }, x = function() {
        return Promise.resolve().then(b);
      };
      x(), s = {
        push: function(_) {
          m.push(_), x();
        },
        filter: function(_) {
          return m = m.filter(_), s;
        }
      };
    }
  };
  return f;
}
function mx(l) {
  l === void 0 && (l = {});
  var r = hx(null);
  return r.options = Ma({ async: !0, ssr: !1 }, l), r;
}
var Lp = function(l) {
  var r = l.sideCar, s = Bp(l, ["sideCar"]);
  if (!r)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var u = r.read();
  if (!u)
    throw new Error("Sidecar medium not found");
  return S.createElement(u, Ma({}, s));
};
Lp.isSideCarExport = !0;
function gx(l, r) {
  return l.useMedium(r), Lp;
}
var Vp = mx(), yd = function() {
}, Mu = S.forwardRef(function(l, r) {
  var s = S.useRef(null), u = S.useState({
    onScrollCapture: yd,
    onWheelCapture: yd,
    onTouchMoveCapture: yd
  }), f = u[0], d = u[1], m = l.forwardProps, v = l.children, b = l.className, x = l.removeScrollBar, _ = l.enabled, h = l.shards, E = l.sideCar, R = l.noRelative, O = l.noIsolation, M = l.inert, H = l.allowPinchZoom, D = l.as, X = D === void 0 ? "div" : D, Q = l.gapMode, B = Bp(l, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), p = E, w = fx([s, r]), C = Ma(Ma({}, B), f);
  return S.createElement(
    S.Fragment,
    null,
    _ && S.createElement(p, { sideCar: Vp, removeScrollBar: x, shards: h, noRelative: R, noIsolation: O, inert: M, setCallbacks: d, allowPinchZoom: !!H, lockRef: s, gapMode: Q }),
    m ? S.cloneElement(S.Children.only(v), Ma(Ma({}, C), { ref: w })) : S.createElement(X, Ma({}, C, { className: b, ref: w }), v)
  );
});
Mu.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Mu.classNames = {
  fullWidth: _u,
  zeroRight: Eu
};
var vx = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function px() {
  if (!document)
    return null;
  var l = document.createElement("style");
  l.type = "text/css";
  var r = vx();
  return r && l.setAttribute("nonce", r), l;
}
function yx(l, r) {
  l.styleSheet ? l.styleSheet.cssText = r : l.appendChild(document.createTextNode(r));
}
function bx(l) {
  var r = document.head || document.getElementsByTagName("head")[0];
  r.appendChild(l);
}
var Sx = function() {
  var l = 0, r = null;
  return {
    add: function(s) {
      l == 0 && (r = px()) && (yx(r, s), bx(r)), l++;
    },
    remove: function() {
      l--, !l && r && (r.parentNode && r.parentNode.removeChild(r), r = null);
    }
  };
}, xx = function() {
  var l = Sx();
  return function(r, s) {
    S.useEffect(function() {
      return l.add(r), function() {
        l.remove();
      };
    }, [r && s]);
  };
}, Yp = function() {
  var l = xx(), r = function(s) {
    var u = s.styles, f = s.dynamic;
    return l(u, f), null;
  };
  return r;
}, Ex = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, bd = function(l) {
  return parseInt(l || "", 10) || 0;
}, _x = function(l) {
  var r = window.getComputedStyle(document.body), s = r[l === "padding" ? "paddingLeft" : "marginLeft"], u = r[l === "padding" ? "paddingTop" : "marginTop"], f = r[l === "padding" ? "paddingRight" : "marginRight"];
  return [bd(s), bd(u), bd(f)];
}, Tx = function(l) {
  if (l === void 0 && (l = "margin"), typeof window > "u")
    return Ex;
  var r = _x(l), s = document.documentElement.clientWidth, u = window.innerWidth;
  return {
    left: r[0],
    top: r[1],
    right: r[2],
    gap: Math.max(0, u - s + r[2] - r[0])
  };
}, wx = Yp(), Bo = "data-scroll-locked", Cx = function(l, r, s, u) {
  var f = l.left, d = l.top, m = l.right, v = l.gap;
  return s === void 0 && (s = "margin"), `
  .`.concat(rx, ` {
   overflow: hidden `).concat(u, `;
   padding-right: `).concat(v, "px ").concat(u, `;
  }
  body[`).concat(Bo, `] {
    overflow: hidden `).concat(u, `;
    overscroll-behavior: contain;
    `).concat([
    r && "position: relative ".concat(u, ";"),
    s === "margin" && `
    padding-left: `.concat(f, `px;
    padding-top: `).concat(d, `px;
    padding-right: `).concat(m, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(v, "px ").concat(u, `;
    `),
    s === "padding" && "padding-right: ".concat(v, "px ").concat(u, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Eu, ` {
    right: `).concat(v, "px ").concat(u, `;
  }
  
  .`).concat(_u, ` {
    margin-right: `).concat(v, "px ").concat(u, `;
  }
  
  .`).concat(Eu, " .").concat(Eu, ` {
    right: 0 `).concat(u, `;
  }
  
  .`).concat(_u, " .").concat(_u, ` {
    margin-right: 0 `).concat(u, `;
  }
  
  body[`).concat(Bo, `] {
    `).concat(sx, ": ").concat(v, `px;
  }
`);
}, Rv = function() {
  var l = parseInt(document.body.getAttribute(Bo) || "0", 10);
  return isFinite(l) ? l : 0;
}, Ax = function() {
  S.useEffect(function() {
    return document.body.setAttribute(Bo, (Rv() + 1).toString()), function() {
      var l = Rv() - 1;
      l <= 0 ? document.body.removeAttribute(Bo) : document.body.setAttribute(Bo, l.toString());
    };
  }, []);
}, Ox = function(l) {
  var r = l.noRelative, s = l.noImportant, u = l.gapMode, f = u === void 0 ? "margin" : u;
  Ax();
  var d = S.useMemo(function() {
    return Tx(f);
  }, [f]);
  return S.createElement(wx, { styles: Cx(d, !r, f, s ? "" : "!important") });
}, Ud = !1;
if (typeof window < "u")
  try {
    var mu = Object.defineProperty({}, "passive", {
      get: function() {
        return Ud = !0, !0;
      }
    });
    window.addEventListener("test", mu, mu), window.removeEventListener("test", mu, mu);
  } catch {
    Ud = !1;
  }
var Mo = Ud ? { passive: !1 } : !1, Nx = function(l) {
  return l.tagName === "TEXTAREA";
}, kp = function(l, r) {
  if (!(l instanceof Element))
    return !1;
  var s = window.getComputedStyle(l);
  return (
    // not-not-scrollable
    s[r] !== "hidden" && // contains scroll inside self
    !(s.overflowY === s.overflowX && !Nx(l) && s[r] === "visible")
  );
}, Dx = function(l) {
  return kp(l, "overflowY");
}, Rx = function(l) {
  return kp(l, "overflowX");
}, zv = function(l, r) {
  var s = r.ownerDocument, u = r;
  do {
    typeof ShadowRoot < "u" && u instanceof ShadowRoot && (u = u.host);
    var f = qp(l, u);
    if (f) {
      var d = Gp(l, u), m = d[1], v = d[2];
      if (m > v)
        return !0;
    }
    u = u.parentNode;
  } while (u && u !== s.body);
  return !1;
}, zx = function(l) {
  var r = l.scrollTop, s = l.scrollHeight, u = l.clientHeight;
  return [
    r,
    s,
    u
  ];
}, Mx = function(l) {
  var r = l.scrollLeft, s = l.scrollWidth, u = l.clientWidth;
  return [
    r,
    s,
    u
  ];
}, qp = function(l, r) {
  return l === "v" ? Dx(r) : Rx(r);
}, Gp = function(l, r) {
  return l === "v" ? zx(r) : Mx(r);
}, jx = function(l, r) {
  return l === "h" && r === "rtl" ? -1 : 1;
}, Hx = function(l, r, s, u, f) {
  var d = jx(l, window.getComputedStyle(r).direction), m = d * u, v = s.target, b = r.contains(v), x = !1, _ = m > 0, h = 0, E = 0;
  do {
    if (!v)
      break;
    var R = Gp(l, v), O = R[0], M = R[1], H = R[2], D = M - H - d * O;
    (O || D) && qp(l, v) && (h += D, E += O);
    var X = v.parentNode;
    v = X && X.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? X.host : X;
  } while (
    // portaled content
    !b && v !== document.body || // self content
    b && (r.contains(v) || r === v)
  );
  return (_ && Math.abs(h) < 1 || !_ && Math.abs(E) < 1) && (x = !0), x;
}, gu = function(l) {
  return "changedTouches" in l ? [l.changedTouches[0].clientX, l.changedTouches[0].clientY] : [0, 0];
}, Mv = function(l) {
  return [l.deltaX, l.deltaY];
}, jv = function(l) {
  return l && "current" in l ? l.current : l;
}, Ux = function(l, r) {
  return l[0] === r[0] && l[1] === r[1];
}, Bx = function(l) {
  return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
}, Lx = 0, jo = [];
function Vx(l) {
  var r = S.useRef([]), s = S.useRef([0, 0]), u = S.useRef(), f = S.useState(Lx++)[0], d = S.useState(Yp)[0], m = S.useRef(l);
  S.useEffect(function() {
    m.current = l;
  }, [l]), S.useEffect(function() {
    if (l.inert) {
      document.body.classList.add("block-interactivity-".concat(f));
      var M = ox([l.lockRef.current], (l.shards || []).map(jv), !0).filter(Boolean);
      return M.forEach(function(H) {
        return H.classList.add("allow-interactivity-".concat(f));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(f)), M.forEach(function(H) {
          return H.classList.remove("allow-interactivity-".concat(f));
        });
      };
    }
  }, [l.inert, l.lockRef.current, l.shards]);
  var v = S.useCallback(function(M, H) {
    if ("touches" in M && M.touches.length === 2 || M.type === "wheel" && M.ctrlKey)
      return !m.current.allowPinchZoom;
    var D = gu(M), X = s.current, Q = "deltaX" in M ? M.deltaX : X[0] - D[0], B = "deltaY" in M ? M.deltaY : X[1] - D[1], p, w = M.target, C = Math.abs(Q) > Math.abs(B) ? "h" : "v";
    if ("touches" in M && C === "h" && w.type === "range")
      return !1;
    var k = window.getSelection(), K = k && k.anchorNode, lt = K ? K === w || K.contains(w) : !1;
    if (lt)
      return !1;
    var at = zv(C, w);
    if (!at)
      return !0;
    if (at ? p = C : (p = C === "v" ? "h" : "v", at = zv(C, w)), !at)
      return !1;
    if (!u.current && "changedTouches" in M && (Q || B) && (u.current = p), !p)
      return !0;
    var tt = u.current || p;
    return Hx(tt, H, M, tt === "h" ? Q : B);
  }, []), b = S.useCallback(function(M) {
    var H = M;
    if (!(!jo.length || jo[jo.length - 1] !== d)) {
      var D = "deltaY" in H ? Mv(H) : gu(H), X = r.current.filter(function(p) {
        return p.name === H.type && (p.target === H.target || H.target === p.shadowParent) && Ux(p.delta, D);
      })[0];
      if (X && X.should) {
        H.cancelable && H.preventDefault();
        return;
      }
      if (!X) {
        var Q = (m.current.shards || []).map(jv).filter(Boolean).filter(function(p) {
          return p.contains(H.target);
        }), B = Q.length > 0 ? v(H, Q[0]) : !m.current.noIsolation;
        B && H.cancelable && H.preventDefault();
      }
    }
  }, []), x = S.useCallback(function(M, H, D, X) {
    var Q = { name: M, delta: H, target: D, should: X, shadowParent: Yx(D) };
    r.current.push(Q), setTimeout(function() {
      r.current = r.current.filter(function(B) {
        return B !== Q;
      });
    }, 1);
  }, []), _ = S.useCallback(function(M) {
    s.current = gu(M), u.current = void 0;
  }, []), h = S.useCallback(function(M) {
    x(M.type, Mv(M), M.target, v(M, l.lockRef.current));
  }, []), E = S.useCallback(function(M) {
    x(M.type, gu(M), M.target, v(M, l.lockRef.current));
  }, []);
  S.useEffect(function() {
    return jo.push(d), l.setCallbacks({
      onScrollCapture: h,
      onWheelCapture: h,
      onTouchMoveCapture: E
    }), document.addEventListener("wheel", b, Mo), document.addEventListener("touchmove", b, Mo), document.addEventListener("touchstart", _, Mo), function() {
      jo = jo.filter(function(M) {
        return M !== d;
      }), document.removeEventListener("wheel", b, Mo), document.removeEventListener("touchmove", b, Mo), document.removeEventListener("touchstart", _, Mo);
    };
  }, []);
  var R = l.removeScrollBar, O = l.inert;
  return S.createElement(
    S.Fragment,
    null,
    O ? S.createElement(d, { styles: Bx(f) }) : null,
    R ? S.createElement(Ox, { noRelative: l.noRelative, gapMode: l.gapMode }) : null
  );
}
function Yx(l) {
  for (var r = null; l !== null; )
    l instanceof ShadowRoot && (r = l.host, l = l.host), l = l.parentNode;
  return r;
}
const kx = gx(Vp, Vx);
var Xp = S.forwardRef(function(l, r) {
  return S.createElement(Mu, Ma({}, l, { ref: r, sideCar: kx }));
});
Xp.classNames = Mu.classNames;
var qx = function(l) {
  if (typeof document > "u")
    return null;
  var r = Array.isArray(l) ? l[0] : l;
  return r.ownerDocument.body;
}, Ho = /* @__PURE__ */ new WeakMap(), vu = /* @__PURE__ */ new WeakMap(), pu = {}, Sd = 0, Qp = function(l) {
  return l && (l.host || Qp(l.parentNode));
}, Gx = function(l, r) {
  return r.map(function(s) {
    if (l.contains(s))
      return s;
    var u = Qp(s);
    return u && l.contains(u) ? u : (console.error("aria-hidden", s, "in not contained inside", l, ". Doing nothing"), null);
  }).filter(function(s) {
    return !!s;
  });
}, Xx = function(l, r, s, u) {
  var f = Gx(r, Array.isArray(l) ? l : [l]);
  pu[s] || (pu[s] = /* @__PURE__ */ new WeakMap());
  var d = pu[s], m = [], v = /* @__PURE__ */ new Set(), b = new Set(f), x = function(h) {
    !h || v.has(h) || (v.add(h), x(h.parentNode));
  };
  f.forEach(x);
  var _ = function(h) {
    !h || b.has(h) || Array.prototype.forEach.call(h.children, function(E) {
      if (v.has(E))
        _(E);
      else
        try {
          var R = E.getAttribute(u), O = R !== null && R !== "false", M = (Ho.get(E) || 0) + 1, H = (d.get(E) || 0) + 1;
          Ho.set(E, M), d.set(E, H), m.push(E), M === 1 && O && vu.set(E, !0), H === 1 && E.setAttribute(s, "true"), O || E.setAttribute(u, "true");
        } catch (D) {
          console.error("aria-hidden: cannot operate on ", E, D);
        }
    });
  };
  return _(r), v.clear(), Sd++, function() {
    m.forEach(function(h) {
      var E = Ho.get(h) - 1, R = d.get(h) - 1;
      Ho.set(h, E), d.set(h, R), E || (vu.has(h) || h.removeAttribute(u), vu.delete(h)), R || h.removeAttribute(s);
    }), Sd--, Sd || (Ho = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ new WeakMap(), vu = /* @__PURE__ */ new WeakMap(), pu = {});
  };
}, Qx = function(l, r, s) {
  s === void 0 && (s = "data-aria-hidden");
  var u = Array.from(Array.isArray(l) ? l : [l]), f = qx(l);
  return f ? (u.push.apply(u, Array.from(f.querySelectorAll("[aria-live], script"))), Xx(u, f, s, "aria-hidden")) : function() {
    return null;
  };
}, Zx = Object.defineProperty, Yn = (l, r) => Zx(l, "name", { value: r, configurable: !0 }), Pd = "Dialog", [Zp, Kp] = /* @__PURE__ */ Vo(Pd), [Kx, pa] = Zp(Pd), Wd = /* @__PURE__ */ Yn((l) => {
  const {
    __scopeDialog: r,
    children: s,
    open: u,
    defaultOpen: f,
    onOpenChange: d,
    modal: m = !0
  } = l, v = S.useRef(null), b = S.useRef(null), [x, _] = Kd({
    prop: u,
    defaultProp: f ?? !1,
    onChange: d,
    caller: Pd
  }), [h, E] = S.useState(0), [R, O] = S.useState(0);
  return /* @__PURE__ */ y.jsx(
    Kx,
    {
      scope: r,
      triggerRef: v,
      contentRef: b,
      contentId: Vr(),
      titleId: Vr(),
      descriptionId: Vr(),
      titlePresent: h > 0,
      descriptionPresent: R > 0,
      setTitleCount: E,
      setDescriptionCount: O,
      open: x,
      onOpenChange: _,
      onOpenToggle: S.useCallback(() => _((M) => !M), [_]),
      modal: m,
      children: s
    }
  );
}, "Dialog"), Ix = "DialogTrigger", Jx = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, ...f } = r, d = pa(Ix, u), m = Vn(s, d.triggerRef);
    return /* @__PURE__ */ y.jsx(
      en.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": d.open,
        "aria-controls": d.open ? d.contentId : void 0,
        "data-state": Hu(d.open),
        ...f,
        ref: m,
        onClick: tn(r.onClick, d.onOpenToggle)
      }
    );
  }, "DialogTrigger")
), Ip = "DialogPortal", [Fx, Jp] = Zp(Ip, {
  forceMount: void 0
}), t0 = /* @__PURE__ */ Yn((l) => {
  const { __scopeDialog: r, forceMount: s, children: u, container: f } = l, d = pa(Ip, r);
  return /* @__PURE__ */ y.jsx(Fx, { scope: r, forceMount: s, children: S.Children.map(u, (m) => /* @__PURE__ */ y.jsx(Zr, { present: s || d.open, children: /* @__PURE__ */ y.jsx(Up, { asChild: !0, container: f, children: m }) })) });
}, "DialogPortal"), Bd = "DialogOverlay", e0 = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Yn(function(r, s) {
    const u = Jp(Bd, r.__scopeDialog), { forceMount: f = u.forceMount, ...d } = r, m = pa(Bd, r.__scopeDialog);
    return m.modal ? /* @__PURE__ */ y.jsx(Zr, { present: f || m.open, children: /* @__PURE__ */ y.jsx(Px, { ...d, ref: s }) }) : null;
  }, "DialogOverlay")
), $x = /* @__PURE__ */ zu("DialogOverlay.RemoveScroll"), Px = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, ...f } = r, d = pa(Bd, u), m = Ap(), v = Vn(s, m);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y.jsx(Xp, { as: $x, allowPinchZoom: !0, shards: [d.contentRef], children: /* @__PURE__ */ y.jsx(
        en.div,
        {
          "data-state": Hu(d.open),
          ...f,
          ref: v,
          style: { pointerEvents: "auto", ...f.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), Yr = "DialogContent", n0 = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Yn(function(r, s) {
    const u = Jp(Yr, r.__scopeDialog), { forceMount: f = u.forceMount, ...d } = r, m = pa(Yr, r.__scopeDialog);
    return /* @__PURE__ */ y.jsx(Zr, { present: f || m.open, children: m.modal ? /* @__PURE__ */ y.jsx(Wx, { ...d, ref: s }) : /* @__PURE__ */ y.jsx(tE, { ...d, ref: s }) });
  }, "DialogContent")
), Wx = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Yn(function(r, s) {
    const u = pa(Yr, r.__scopeDialog), f = S.useRef(null), d = Vn(s, u.contentRef, f);
    return S.useEffect(() => {
      const m = f.current;
      if (m) return Qx(m);
    }, []), /* @__PURE__ */ y.jsx(
      Fp,
      {
        ...r,
        ref: d,
        trapFocus: u.open,
        disableOutsidePointerEvents: u.open,
        onCloseAutoFocus: tn(r.onCloseAutoFocus, (m) => {
          m.preventDefault(), u.triggerRef.current?.focus();
        }),
        onPointerDownOutside: tn(r.onPointerDownOutside, (m) => {
          const v = m.detail.originalEvent, b = v.button === 0 && v.ctrlKey === !0;
          (v.button === 2 || b) && m.preventDefault();
        }),
        onFocusOutside: tn(
          r.onFocusOutside,
          (m) => m.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), tE = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Yn(function(r, s) {
    const u = pa(Yr, r.__scopeDialog), f = S.useRef(!1), d = S.useRef(!1);
    return /* @__PURE__ */ y.jsx(
      Fp,
      {
        ...r,
        ref: s,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (m) => {
          r.onCloseAutoFocus?.(m), m.defaultPrevented || (f.current || u.triggerRef.current?.focus(), m.preventDefault()), f.current = !1, d.current = !1;
        },
        onInteractOutside: (m) => {
          r.onInteractOutside?.(m), m.defaultPrevented || (f.current = !0, m.detail.originalEvent.type === "pointerdown" && (d.current = !0));
          const v = m.target;
          u.triggerRef.current?.contains(v) && m.preventDefault(), m.detail.originalEvent.type === "focusin" && d.current && m.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), Fp = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, trapFocus: f, onOpenAutoFocus: d, onCloseAutoFocus: m, ...v } = r, b = pa(Yr, u);
    return $d(), /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx(
      ex,
      {
        asChild: !0,
        loop: !0,
        trapped: f,
        onMountAutoFocus: d,
        onUnmountAutoFocus: m,
        children: /* @__PURE__ */ y.jsx(
          Cp,
          {
            role: "dialog",
            id: b.contentId,
            "aria-describedby": b.descriptionPresent ? b.descriptionId : void 0,
            "aria-labelledby": b.titlePresent ? b.titleId : void 0,
            "data-state": Hu(b.open),
            ...v,
            ref: s,
            deferPointerDownOutside: !0,
            onDismiss: () => b.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), eE = "DialogTitle", a0 = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, ...f } = r, d = pa(eE, u), { setTitleCount: m } = d;
    return fn(() => (m((v) => v + 1), () => m((v) => v - 1)), [m]), /* @__PURE__ */ y.jsx(en.h2, { id: d.titleId, ...f, ref: s });
  }, "DialogTitle")
), nE = "DialogDescription", l0 = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, ...f } = r, d = pa(nE, u), { setDescriptionCount: m } = d;
    return fn(() => (m((v) => v + 1), () => m((v) => v - 1)), [m]), /* @__PURE__ */ y.jsx(en.p, { id: d.descriptionId, ...f, ref: s });
  }, "DialogDescription")
), aE = "DialogClose", ju = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Yn(function(r, s) {
    const { __scopeDialog: u, ...f } = r, d = pa(aE, u);
    return /* @__PURE__ */ y.jsx(
      en.button,
      {
        type: "button",
        ...f,
        ref: s,
        onClick: tn(r.onClick, () => d.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function Hu(l) {
  return l ? "open" : "closed";
}
Yn(Hu, "getState");
var lE = Object.defineProperty, cl = (l, r) => lE(l, "name", { value: r, configurable: !0 }), iE = "AlertDialog", [oE, cC] = /* @__PURE__ */ Vo(iE, [
  Kp
]), fl = Kp(), rE = /* @__PURE__ */ cl((l) => {
  const { __scopeAlertDialog: r, ...s } = l, u = fl(r);
  return /* @__PURE__ */ y.jsx(Wd, { ...u, ...s, modal: !0 });
}, "AlertDialog");
S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, ...f } = r, d = fl(u);
    return /* @__PURE__ */ y.jsx(Jx, { ...d, ...f, ref: s });
  }, "AlertDialogTrigger")
);
var sE = /* @__PURE__ */ cl((l) => {
  const { __scopeAlertDialog: r, ...s } = l, u = fl(r);
  return /* @__PURE__ */ y.jsx(t0, { ...u, ...s });
}, "AlertDialogPortal"), uE = S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, ...f } = r, d = fl(u);
    return /* @__PURE__ */ y.jsx(e0, { ...d, ...f, ref: s });
  }, "AlertDialogOverlay")
), cE = "AlertDialogContent", [fE, dE] = oE(cE), hE = S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, children: f, ...d } = r, m = fl(u), v = S.useRef(null), b = Vn(s, v), x = S.useRef(null);
    return /* @__PURE__ */ y.jsx(fE, { scope: u, cancelRef: x, children: /* @__PURE__ */ y.jsx(
      n0,
      {
        role: "alertdialog",
        ...m,
        ...d,
        ref: b,
        onOpenAutoFocus: tn(d.onOpenAutoFocus, (_) => {
          _.preventDefault(), x.current?.focus({ preventScroll: !0 });
        }),
        onPointerDownOutside: (_) => _.preventDefault(),
        onInteractOutside: (_) => _.preventDefault(),
        children: f
      }
    ) });
  }, "AlertDialogContent")
), mE = S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, ...f } = r, d = fl(u);
    return /* @__PURE__ */ y.jsx(a0, { ...d, ...f, ref: s });
  }, "AlertDialogTitle")
), gE = S.forwardRef(/* @__PURE__ */ cl(function(r, s) {
  const { __scopeAlertDialog: u, ...f } = r, d = fl(u);
  return /* @__PURE__ */ y.jsx(l0, { ...d, ...f, ref: s });
}, "AlertDialogDescription")), vE = S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, ...f } = r, d = fl(u);
    return /* @__PURE__ */ y.jsx(ju, { ...d, ...f, ref: s });
  }, "AlertDialogAction")
), pE = "AlertDialogCancel", yE = S.forwardRef(
  /* @__PURE__ */ cl(function(r, s) {
    const { __scopeAlertDialog: u, ...f } = r, { cancelRef: d } = dE(pE, u), m = fl(u), v = Vn(s, d);
    return /* @__PURE__ */ y.jsx(ju, { ...m, ...f, ref: v });
  }, "AlertDialogCancel")
), bE = rE, SE = sE, xE = uE, EE = hE, _E = vE, TE = yE, wE = mE, CE = gE, AE = Object.defineProperty, sl = (l, r) => AE(l, "name", { value: r, configurable: !0 }), $p = "Avatar", [OE, fC] = /* @__PURE__ */ Vo($p), NE = [
  0,
  () => {
  }
], [DE, Pp] = OE($p), RE = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ sl(function(r, s) {
    const { __scopeAvatar: u, ...f } = r, [d, m] = S.useState("idle"), [v, b] = t2();
    return /* @__PURE__ */ y.jsx(
      DE,
      {
        scope: u,
        imageLoadingStatus: d,
        setImageLoadingStatus: m,
        imageCount: v,
        setImageCount: b,
        children: /* @__PURE__ */ y.jsx(en.span, { ...f, ref: s })
      }
    );
  }, "Avatar")
), zE = "AvatarImage", ME = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ sl(function(r, s) {
    const { __scopeAvatar: u, src: f, onLoadingStatusChange: d, ...m } = r, v = Pp(zE, u);
    v.setImageCount;
    const b = Wp(f, {
      referrerPolicy: m.referrerPolicy,
      crossOrigin: m.crossOrigin,
      loadingStatus: v.imageLoadingStatus,
      setLoadingStatus: v.setImageLoadingStatus
    }), x = $l((h) => {
      d?.(h);
    }), _ = S.useRef(b);
    return fn(() => {
      const h = _.current;
      _.current = b, b !== h && x(b);
    }, [b, x]), b === "loaded" ? /* @__PURE__ */ y.jsx(en.img, { ...m, ref: s, src: f }) : null;
  }, "AvatarImage")
), jE = "AvatarFallback", HE = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ sl(function(r, s) {
    const { __scopeAvatar: u, delayMs: f, ...d } = r, m = Pp(jE, u), [v, b] = S.useState(f === void 0);
    return S.useEffect(() => {
      if (f !== void 0) {
        const x = window.setTimeout(() => b(!0), f);
        return () => window.clearTimeout(x);
      }
    }, [f]), v && m.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ y.jsx(en.span, { ...d, ref: s }) : null;
  }, "AvatarFallback")
);
function Wp(l, {
  loadingStatus: r,
  setLoadingStatus: s,
  referrerPolicy: u,
  crossOrigin: f
}) {
  return fn(() => {
    if (!l) {
      s("error");
      return;
    }
    const d = new window.Image(), m = /* @__PURE__ */ sl((b) => {
      const x = b.currentTarget;
      s(Ld(x));
    }, "handleLoad"), v = /* @__PURE__ */ sl(() => s("error"), "handleError");
    return d.addEventListener("load", m), d.addEventListener("error", v), u && (d.referrerPolicy = u), d.crossOrigin = f ?? null, d.src = l, s(Ld(d)), () => {
      d.removeEventListener("load", m), d.removeEventListener("error", v), s("idle");
    };
  }, [l, f, u, s]), r;
}
sl(Wp, "useImageLoadingStatus");
function Ld(l) {
  return l.complete ? l.naturalWidth > 0 ? "loaded" : "error" : "loading";
}
sl(Ld, "getImageLoadingStatus");
function t2() {
  return NE;
}
sl(t2, "useImageCount");
function UE(l) {
}
sl(UE, "useUpdateImageCount");
var BE = Object.defineProperty, LE = (l, r) => BE(l, "name", { value: r, configurable: !0 });
function e2(l) {
  const [r, s] = S.useState(void 0);
  return fn(() => {
    if (l) {
      s({ width: l.offsetWidth, height: l.offsetHeight });
      const u = new ResizeObserver((f) => {
        if (!Array.isArray(f) || !f.length)
          return;
        const d = f[0];
        let m, v;
        if ("borderBoxSize" in d) {
          const b = d.borderBoxSize, x = Array.isArray(b) ? b[0] : b;
          m = x.inlineSize, v = x.blockSize;
        } else
          m = l.offsetWidth, v = l.offsetHeight;
        s({ width: m, height: v });
      });
      return u.observe(l, { box: "border-box" }), () => u.unobserve(l);
    } else
      s(void 0);
  }, [l]), r;
}
LE(e2, "useSize");
const VE = ["top", "right", "bottom", "left"], Pl = Math.min, ll = Math.max, Cu = Math.round, yu = Math.floor, il = (l) => ({
  x: l,
  y: l
}), YE = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function n2(l, r, s) {
  return ll(l, Pl(r, s));
}
function ul(l, r) {
  return typeof l == "function" ? l(r) : l;
}
function Wl(l) {
  return l.split("-")[0];
}
function ko(l) {
  return l.split("-")[1];
}
function i0(l) {
  return l === "x" ? "y" : "x";
}
function o0(l) {
  return l === "y" ? "height" : "width";
}
function ja(l) {
  const r = l[0];
  return r === "t" || r === "b" ? "y" : "x";
}
function r0(l) {
  return i0(ja(l));
}
function kE(l, r, s) {
  s === void 0 && (s = !1);
  const u = ko(l), f = r0(l), d = o0(f);
  let m = f === "x" ? u === (s ? "end" : "start") ? "right" : "left" : u === "start" ? "bottom" : "top";
  return r.reference[d] > r.floating[d] && (m = Au(m)), [m, Au(m)];
}
function qE(l) {
  const r = Au(l);
  return [Vd(l), r, Vd(r)];
}
function Vd(l) {
  return l.includes("start") ? l.replace("start", "end") : l.replace("end", "start");
}
const Hv = ["left", "right"], Uv = ["right", "left"], GE = ["top", "bottom"], XE = ["bottom", "top"];
function QE(l, r, s) {
  switch (l) {
    case "top":
    case "bottom":
      return s ? r ? Uv : Hv : r ? Hv : Uv;
    case "left":
    case "right":
      return r ? GE : XE;
    default:
      return [];
  }
}
function ZE(l, r, s, u) {
  const f = ko(l);
  let d = QE(Wl(l), s === "start", u);
  return f && (d = d.map((m) => m + "-" + f), r && (d = d.concat(d.map(Vd)))), d;
}
function Au(l) {
  const r = Wl(l);
  return YE[r] + l.slice(r.length);
}
function KE(l) {
  var r, s, u, f;
  return {
    top: (r = l.top) != null ? r : 0,
    right: (s = l.right) != null ? s : 0,
    bottom: (u = l.bottom) != null ? u : 0,
    left: (f = l.left) != null ? f : 0
  };
}
function a2(l) {
  return typeof l != "number" ? KE(l) : {
    top: l,
    right: l,
    bottom: l,
    left: l
  };
}
function Ou(l) {
  const {
    x: r,
    y: s,
    width: u,
    height: f
  } = l;
  return {
    width: u,
    height: f,
    top: s,
    left: r,
    right: r + u,
    bottom: s + f,
    x: r,
    y: s
  };
}
function Bv(l, r, s) {
  let {
    reference: u,
    floating: f
  } = l;
  const d = ja(r), m = r0(r), v = o0(m), b = Wl(r), x = d === "y", _ = u.x + u.width / 2 - f.width / 2, h = u.y + u.height / 2 - f.height / 2, E = u[v] / 2 - f[v] / 2;
  let R;
  switch (b) {
    case "top":
      R = {
        x: _,
        y: u.y - f.height
      };
      break;
    case "bottom":
      R = {
        x: _,
        y: u.y + u.height
      };
      break;
    case "right":
      R = {
        x: u.x + u.width,
        y: h
      };
      break;
    case "left":
      R = {
        x: u.x - f.width,
        y: h
      };
      break;
    default:
      R = {
        x: u.x,
        y: u.y
      };
  }
  const O = ko(r);
  return O && (R[m] += E * (O === "end" ? 1 : -1) * (s && x ? -1 : 1)), R;
}
async function IE(l, r) {
  var s;
  r === void 0 && (r = {});
  const {
    x: u,
    y: f,
    platform: d,
    rects: m,
    elements: v,
    strategy: b
  } = l, {
    boundary: x = "clippingAncestors",
    rootBoundary: _ = "viewport",
    elementContext: h = "floating",
    altBoundary: E = !1,
    padding: R = 0
  } = ul(r, l), O = a2(R), H = v[E ? h === "floating" ? "reference" : "floating" : h], D = Ou(await d.getClippingRect({
    element: (s = await (d.isElement == null ? void 0 : d.isElement(H))) == null || s ? H : H.contextElement || await (d.getDocumentElement == null ? void 0 : d.getDocumentElement(v.floating)),
    boundary: x,
    rootBoundary: _,
    strategy: b
  })), X = h === "floating" ? {
    x: u,
    y: f,
    width: m.floating.width,
    height: m.floating.height
  } : m.reference, Q = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(v.floating)), B = await (d.isElement == null ? void 0 : d.isElement(Q)) && await (d.getScale == null ? void 0 : d.getScale(Q)) || {
    x: 1,
    y: 1
  }, p = Ou(d.convertOffsetParentRelativeRectToViewportRelativeRect ? await d.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: v,
    rect: X,
    offsetParent: Q,
    strategy: b
  }) : X);
  return {
    top: (D.top - p.top + O.top) / B.y,
    bottom: (p.bottom - D.bottom + O.bottom) / B.y,
    left: (D.left - p.left + O.left) / B.x,
    right: (p.right - D.right + O.right) / B.x
  };
}
const JE = 50, FE = async (l, r, s) => {
  const {
    placement: u = "bottom",
    strategy: f = "absolute",
    middleware: d = [],
    platform: m
  } = s, v = m.detectOverflow ? m : {
    ...m,
    detectOverflow: IE
  }, b = await (m.isRTL == null ? void 0 : m.isRTL(r));
  let x = await m.getElementRects({
    reference: l,
    floating: r,
    strategy: f
  }), {
    x: _,
    y: h
  } = Bv(x, u, b), E = u, R = 0;
  const O = {};
  for (let M = 0; M < d.length; M++) {
    const H = d[M];
    if (!H)
      continue;
    const {
      name: D,
      fn: X
    } = H, {
      x: Q,
      y: B,
      data: p,
      reset: w
    } = await X({
      x: _,
      y: h,
      initialPlacement: u,
      placement: E,
      strategy: f,
      middlewareData: O,
      rects: x,
      platform: v,
      elements: {
        reference: l,
        floating: r
      }
    });
    _ = Q ?? _, h = B ?? h, O[D] = {
      ...O[D],
      ...p
    }, w && R < JE && (R++, typeof w == "object" && (w.placement && (E = w.placement), w.rects && (x = w.rects === !0 ? await m.getElementRects({
      reference: l,
      floating: r,
      strategy: f
    }) : w.rects), {
      x: _,
      y: h
    } = Bv(x, E, b)), M = -1);
  }
  return {
    x: _,
    y: h,
    placement: E,
    strategy: f,
    middlewareData: O
  };
}, $E = (l) => ({
  name: "arrow",
  options: l,
  async fn(r) {
    const {
      x: s,
      y: u,
      placement: f,
      rects: d,
      platform: m,
      elements: v,
      middlewareData: b
    } = r, {
      element: x,
      padding: _ = 0
    } = ul(l, r) || {};
    if (x == null)
      return {};
    const h = a2(_), E = {
      x: s,
      y: u
    }, R = r0(f), O = o0(R), M = await m.getDimensions(x), H = R === "y", D = H ? "top" : "left", X = H ? "bottom" : "right", Q = H ? "clientHeight" : "clientWidth", B = d.reference[O] + d.reference[R] - E[R] - d.floating[O], p = E[R] - d.reference[R], w = await (m.getOffsetParent == null ? void 0 : m.getOffsetParent(x));
    let C = w ? w[Q] : 0;
    (!C || !await (m.isElement == null ? void 0 : m.isElement(w))) && (C = v.floating[Q] || d.floating[O]);
    const k = B / 2 - p / 2, K = C / 2 - M[O] / 2 - 1, lt = Pl(h[D], K), at = Pl(h[X], K), tt = C - M[O] - at, ct = C / 2 - M[O] / 2 + k, I = n2(lt, ct, tt), vt = !b.arrow && ko(f) != null && ct !== I && d.reference[O] / 2 - (ct < lt ? lt : at) - M[O] / 2 < 0, Z = vt ? ct < lt ? ct - lt : ct - tt : 0;
    return {
      [R]: E[R] + Z,
      data: {
        [R]: I,
        centerOffset: ct - I - Z,
        ...vt && {
          alignmentOffset: Z
        }
      },
      reset: vt
    };
  }
}), PE = function(l) {
  return l === void 0 && (l = {}), {
    name: "flip",
    options: l,
    async fn(r) {
      var s, u;
      const {
        placement: f,
        middlewareData: d,
        rects: m,
        initialPlacement: v,
        platform: b,
        elements: x
      } = r, {
        mainAxis: _ = !0,
        crossAxis: h = !0,
        fallbackPlacements: E,
        fallbackStrategy: R = "bestFit",
        fallbackAxisSideDirection: O = "none",
        flipAlignment: M = !0,
        ...H
      } = ul(l, r);
      if ((s = d.arrow) != null && s.alignmentOffset)
        return {};
      const D = Wl(f), X = ja(v), Q = Wl(v) === v, B = await (b.isRTL == null ? void 0 : b.isRTL(x.floating)), p = E || (Q || !M ? [Au(v)] : qE(v)), w = O !== "none";
      !E && w && p.push(...ZE(v, M, O, B));
      const C = [v, ...p], k = await b.detectOverflow(r, H), K = [];
      let lt = ((u = d.flip) == null ? void 0 : u.overflows) || [];
      if (_ && K.push(k[D]), h) {
        const I = kE(f, m, B);
        K.push(k[I[0]], k[I[1]]);
      }
      if (lt = [...lt, {
        placement: f,
        overflows: K
      }], !K.every((I) => I <= 0)) {
        var at, tt;
        const I = (((at = d.flip) == null ? void 0 : at.index) || 0) + 1, vt = C[I];
        if (vt && (!(h === "alignment" ? X !== ja(vt) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        lt.every((et) => ja(et.placement) === X ? et.overflows[0] > 0 : !0)))
          return {
            data: {
              index: I,
              overflows: lt
            },
            reset: {
              placement: vt
            }
          };
        let Z = (tt = lt.filter((nt) => nt.overflows[0] <= 0).sort((nt, et) => nt.overflows[1] - et.overflows[1])[0]) == null ? void 0 : tt.placement;
        if (!Z)
          switch (R) {
            case "bestFit": {
              var ct;
              const nt = (ct = lt.filter((et) => {
                if (w) {
                  const ft = ja(et.placement);
                  return ft === X || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ft === "y";
                }
                return !0;
              }).map((et) => [et.placement, et.overflows.filter((ft) => ft > 0).reduce((ft, mt) => ft + mt, 0)]).sort((et, ft) => et[1] - ft[1])[0]) == null ? void 0 : ct[0];
              nt && (Z = nt);
              break;
            }
            case "initialPlacement":
              Z = v;
              break;
          }
        if (f !== Z)
          return {
            reset: {
              placement: Z
            }
          };
      }
      return {};
    }
  };
};
function Lv(l, r) {
  return {
    top: l.top - r.height,
    right: l.right - r.width,
    bottom: l.bottom - r.height,
    left: l.left - r.width
  };
}
function Vv(l) {
  return VE.some((r) => l[r] >= 0);
}
const WE = function(l) {
  return l === void 0 && (l = {}), {
    name: "hide",
    options: l,
    async fn(r) {
      const {
        rects: s,
        platform: u
      } = r, {
        strategy: f = "referenceHidden",
        ...d
      } = ul(l, r);
      switch (f) {
        case "referenceHidden": {
          const m = await u.detectOverflow(r, {
            ...d,
            elementContext: "reference"
          }), v = Lv(m, s.reference);
          return {
            data: {
              referenceHiddenOffsets: v,
              referenceHidden: Vv(v)
            }
          };
        }
        case "escaped": {
          const m = await u.detectOverflow(r, {
            ...d,
            altBoundary: !0
          }), v = Lv(m, s.floating);
          return {
            data: {
              escapedOffsets: v,
              escaped: Vv(v)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, l2 = /* @__PURE__ */ new Set(["left", "top"]);
async function t_(l, r) {
  const {
    placement: s,
    platform: u,
    elements: f
  } = l, d = await (u.isRTL == null ? void 0 : u.isRTL(f.floating)), m = Wl(s), v = ko(s), b = ja(s) === "y", x = l2.has(m) ? -1 : 1, _ = d && b ? -1 : 1, h = ul(r, l);
  let {
    mainAxis: E,
    crossAxis: R,
    alignmentAxis: O
  } = typeof h == "number" ? {
    mainAxis: h,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: h.mainAxis || 0,
    crossAxis: h.crossAxis || 0,
    alignmentAxis: h.alignmentAxis
  };
  return v && typeof O == "number" && (R = v === "end" ? O * -1 : O), b ? {
    x: R * _,
    y: E * x
  } : {
    x: E * x,
    y: R * _
  };
}
const e_ = function(l) {
  return l === void 0 && (l = 0), {
    name: "offset",
    options: l,
    async fn(r) {
      var s, u;
      const {
        x: f,
        y: d,
        placement: m,
        middlewareData: v
      } = r, b = await t_(r, l);
      return m === ((s = v.offset) == null ? void 0 : s.placement) && (u = v.arrow) != null && u.alignmentOffset ? {} : {
        x: f + b.x,
        y: d + b.y,
        data: {
          ...b,
          placement: m
        }
      };
    }
  };
}, n_ = function(l) {
  return l === void 0 && (l = {}), {
    name: "shift",
    options: l,
    async fn(r) {
      const {
        x: s,
        y: u,
        placement: f,
        platform: d
      } = r, {
        mainAxis: m = !0,
        crossAxis: v = !1,
        limiter: b = {
          fn: (X) => {
            let {
              x: Q,
              y: B
            } = X;
            return {
              x: Q,
              y: B
            };
          }
        },
        ...x
      } = ul(l, r), _ = {
        x: s,
        y: u
      }, h = await d.detectOverflow(r, x), E = ja(f), R = i0(E);
      let O = _[R], M = _[E];
      const H = (X, Q) => n2(Q + h[X === "y" ? "top" : "left"], Q, Q - h[X === "y" ? "bottom" : "right"]);
      m && (O = H(R, O)), v && (M = H(E, M));
      const D = b.fn({
        ...r,
        [R]: O,
        [E]: M
      });
      return {
        ...D,
        data: {
          x: D.x - s,
          y: D.y - u,
          enabled: {
            [R]: m,
            [E]: v
          }
        }
      };
    }
  };
}, a_ = function(l) {
  return l === void 0 && (l = {}), {
    options: l,
    fn(r) {
      var s, u;
      const {
        x: f,
        y: d,
        placement: m,
        rects: v,
        middlewareData: b
      } = r, {
        offset: x = 0,
        mainAxis: _ = !0,
        crossAxis: h = !0
      } = ul(l, r), E = {
        x: f,
        y: d
      }, R = ja(m), O = i0(R);
      let M = E[O], H = E[R];
      const D = ul(x, r), X = typeof D == "number" ? {
        mainAxis: D,
        crossAxis: 0
      } : {
        mainAxis: (s = D.mainAxis) != null ? s : 0,
        crossAxis: (u = D.crossAxis) != null ? u : 0
      };
      if (_) {
        const p = O === "y" ? "height" : "width", w = v.reference[O] - v.floating[p] + X.mainAxis, C = v.reference[O] + v.reference[p] - X.mainAxis;
        M < w ? M = w : M > C && (M = C);
      }
      if (h) {
        var Q, B;
        const p = O === "y" ? "width" : "height", w = l2.has(Wl(m)), C = v.reference[R] - v.floating[p] + (w && ((Q = b.offset) == null ? void 0 : Q[R]) || 0) + (w ? 0 : X.crossAxis), k = v.reference[R] + v.reference[p] + (w ? 0 : ((B = b.offset) == null ? void 0 : B[R]) || 0) - (w ? X.crossAxis : 0);
        H < C ? H = C : H > k && (H = k);
      }
      return {
        [O]: M,
        [R]: H
      };
    }
  };
}, l_ = function(l) {
  return l === void 0 && (l = {}), {
    name: "size",
    options: l,
    async fn(r) {
      const {
        placement: s,
        rects: u,
        platform: f,
        elements: d
      } = r, {
        apply: m = () => {
        },
        ...v
      } = ul(l, r), b = await f.detectOverflow(r, v), x = Wl(s), _ = ko(s), h = ja(s) === "y", {
        width: E,
        height: R
      } = u.floating;
      let O, M;
      x === "top" || x === "bottom" ? (O = x, M = _ === (await (f.isRTL == null ? void 0 : f.isRTL(d.floating)) ? "start" : "end") ? "left" : "right") : (M = x, O = _ === "end" ? "top" : "bottom");
      const H = R - b.top - b.bottom, D = E - b.left - b.right, X = Pl(R - b[O], H), Q = Pl(E - b[M], D), B = r.middlewareData.shift, p = !B;
      let w = X, C = Q;
      B != null && B.enabled.x && (C = D), B != null && B.enabled.y && (w = H), p && !_ && (h ? C = E - 2 * ll(b.left, b.right) : w = R - 2 * ll(b.top, b.bottom)), await m({
        ...r,
        availableWidth: C,
        availableHeight: w
      });
      const k = await f.getDimensions(d.floating);
      return E !== k.width || R !== k.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Uu() {
  return typeof window < "u";
}
function qo(l) {
  return i2(l) ? (l.nodeName || "").toLowerCase() : "#document";
}
function _n(l) {
  var r;
  return (l == null || (r = l.ownerDocument) == null ? void 0 : r.defaultView) || window;
}
function dl(l) {
  var r;
  return (r = (i2(l) ? l.ownerDocument : l.document) || window.document) == null ? void 0 : r.documentElement;
}
function i2(l) {
  return Uu() ? l instanceof Node || l instanceof _n(l).Node : !1;
}
function Ha(l) {
  return Uu() ? l instanceof Element || l instanceof _n(l).Element : !1;
}
function ti(l) {
  return Uu() ? l instanceof HTMLElement || l instanceof _n(l).HTMLElement : !1;
}
function Yv(l) {
  return !Uu() || typeof ShadowRoot > "u" ? !1 : l instanceof ShadowRoot || l instanceof _n(l).ShadowRoot;
}
function Bu(l) {
  const {
    overflow: r,
    overflowX: s,
    overflowY: u,
    display: f
  } = Ua(l);
  return /auto|scroll|overlay|hidden|clip/.test(r + u + s) && f !== "inline" && f !== "contents";
}
function i_(l) {
  return /^(table|td|th)$/.test(qo(l));
}
function Lu(l) {
  try {
    if (l.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return l.matches(":modal");
  } catch {
    return !1;
  }
}
const o_ = /transform|translate|scale|rotate|perspective|filter/, r_ = /paint|layout|strict|content/, ji = (l) => !!l && l !== "none";
let xd;
function s0(l) {
  const r = Ha(l) ? Ua(l) : l;
  return ji(r.transform) || ji(r.translate) || ji(r.scale) || ji(r.rotate) || ji(r.perspective) || !u0() && (ji(r.backdropFilter) || ji(r.filter)) || o_.test(r.willChange || "") || r_.test(r.contain || "");
}
function s_(l) {
  let r = Ui(l);
  for (; ti(r) && !kr(r); ) {
    if (s0(r))
      return r;
    if (Lu(r))
      return null;
    r = Ui(r);
  }
  return null;
}
function u0() {
  return xd == null && (xd = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), xd;
}
function kr(l) {
  return /^(html|body|#document)$/.test(qo(l));
}
function Ua(l) {
  return _n(l).getComputedStyle(l);
}
function Vu(l) {
  return Ha(l) ? {
    scrollLeft: l.scrollLeft,
    scrollTop: l.scrollTop
  } : {
    scrollLeft: l.scrollX,
    scrollTop: l.scrollY
  };
}
function Ui(l) {
  if (qo(l) === "html")
    return l;
  const r = (
    // Step into the shadow DOM of the parent of a slotted node.
    l.assignedSlot || // DOM Element detected.
    l.parentNode || // ShadowRoot detected.
    Yv(l) && l.host || // Fallback.
    dl(l)
  );
  return Yv(r) ? r.host : r;
}
function o2(l) {
  const r = Ui(l);
  return kr(r) ? (l.ownerDocument || l).body : ti(r) && Bu(r) ? r : o2(r);
}
function qr(l, r, s) {
  var u;
  r === void 0 && (r = []), s === void 0 && (s = !0);
  const f = o2(l), d = f === ((u = l.ownerDocument) == null ? void 0 : u.body), m = _n(f);
  if (d) {
    const v = Yd(m);
    return r.concat(m, m.visualViewport || [], Bu(f) ? f : [], v && s ? qr(v) : []);
  } else
    return r.concat(f, qr(f, [], s));
}
function Yd(l) {
  return l.parent && Object.getPrototypeOf(l.parent) ? l.frameElement : null;
}
function r2(l) {
  const r = Ua(l);
  let s = parseFloat(r.width) || 0, u = parseFloat(r.height) || 0;
  const f = ti(l), d = f ? l.offsetWidth : s, m = f ? l.offsetHeight : u, v = Cu(s) !== d || Cu(u) !== m;
  return v && (s = d, u = m), {
    width: s,
    height: u,
    $: v
  };
}
function c0(l) {
  return Ha(l) ? l : l.contextElement;
}
function Lo(l) {
  const r = c0(l);
  if (!ti(r))
    return il(1);
  const s = r.getBoundingClientRect(), {
    width: u,
    height: f,
    $: d
  } = r2(r);
  let m = (d ? Cu(s.width) : s.width) / u, v = (d ? Cu(s.height) : s.height) / f;
  return (!m || !Number.isFinite(m)) && (m = 1), (!v || !Number.isFinite(v)) && (v = 1), {
    x: m,
    y: v
  };
}
const u_ = /* @__PURE__ */ il(0);
function s2(l) {
  const r = _n(l);
  return !u0() || !r.visualViewport ? u_ : {
    x: r.visualViewport.offsetLeft,
    y: r.visualViewport.offsetTop
  };
}
function c_(l, r, s) {
  return r === void 0 && (r = !1), !!s && r && s === _n(l);
}
function Bi(l, r, s, u) {
  r === void 0 && (r = !1), s === void 0 && (s = !1);
  const f = l.getBoundingClientRect(), d = c0(l);
  let m = il(1);
  r && (u ? Ha(u) && (m = Lo(u)) : m = Lo(l));
  const v = c_(d, s, u) ? s2(d) : il(0);
  let b = (f.left + v.x) / m.x, x = (f.top + v.y) / m.y, _ = f.width / m.x, h = f.height / m.y;
  if (d && u) {
    const E = _n(d), R = Ha(u) ? _n(u) : u;
    let O = E, M = Yd(O);
    for (; M && R !== O; ) {
      const H = Lo(M), D = M.getBoundingClientRect(), X = Ua(M), Q = D.left + (M.clientLeft + parseFloat(X.paddingLeft)) * H.x, B = D.top + (M.clientTop + parseFloat(X.paddingTop)) * H.y;
      b *= H.x, x *= H.y, _ *= H.x, h *= H.y, b += Q, x += B, O = _n(M), M = Yd(O);
    }
  }
  return Ou({
    width: _,
    height: h,
    x: b,
    y: x
  });
}
function Yu(l, r) {
  const s = Vu(l).scrollLeft;
  return r ? r.left + s : Bi(dl(l)).left + s;
}
function u2(l, r) {
  const s = l.getBoundingClientRect(), u = s.left + r.scrollLeft - Yu(l, s), f = s.top + r.scrollTop;
  return {
    x: u,
    y: f
  };
}
function f_(l) {
  let {
    elements: r,
    rect: s,
    offsetParent: u,
    strategy: f
  } = l;
  const d = f === "fixed", m = dl(u), v = r ? Lu(r.floating) : !1;
  if (u === m || v && d)
    return s;
  let b = {
    scrollLeft: 0,
    scrollTop: 0
  }, x = il(1);
  const _ = il(0), h = ti(u);
  if ((h || !d) && ((qo(u) !== "body" || Bu(m)) && (b = Vu(u)), h)) {
    const R = Bi(u);
    x = Lo(u), _.x = R.x + u.clientLeft, _.y = R.y + u.clientTop;
  }
  const E = m && !h && !d ? u2(m, b) : il(0);
  return {
    width: s.width * x.x,
    height: s.height * x.y,
    x: s.x * x.x - b.scrollLeft * x.x + _.x + E.x,
    y: s.y * x.y - b.scrollTop * x.y + _.y + E.y
  };
}
function d_(l) {
  return l.getClientRects ? Array.from(l.getClientRects()) : [];
}
function h_(l) {
  const r = Vu(l), s = l.ownerDocument.body, u = ll(l.scrollWidth, l.clientWidth, s.scrollWidth, s.clientWidth), f = ll(l.scrollHeight, l.clientHeight, s.scrollHeight, s.clientHeight);
  let d = -r.scrollLeft + Yu(l);
  const m = -r.scrollTop;
  return Ua(s).direction === "rtl" && (d += ll(l.clientWidth, s.clientWidth) - u), {
    width: u,
    height: f,
    x: d,
    y: m
  };
}
const m_ = 25;
function g_(l, r, s) {
  s === void 0 && (s = "viewport");
  const u = s === "layoutViewport", f = _n(l), d = dl(l), m = f.visualViewport;
  let v = d.clientWidth, b = d.clientHeight, x = 0, _ = 0;
  if (m) {
    const E = !u0() || r === "fixed";
    u ? E || (x = -m.offsetLeft, _ = -m.offsetTop) : (v = m.width, b = m.height, E && (x = m.offsetLeft, _ = m.offsetTop));
  }
  if (Yu(d) <= 0) {
    const E = d.ownerDocument, R = E.body, O = getComputedStyle(R), M = E.compatMode === "CSS1Compat" && parseFloat(O.marginLeft) + parseFloat(O.marginRight) || 0, H = Math.abs(d.clientWidth - R.clientWidth - M), D = getComputedStyle(d).scrollbarGutter === "stable both-edges" ? H / 2 : H;
    D <= m_ && (v -= D);
  }
  return {
    width: v,
    height: b,
    x,
    y: _
  };
}
function v_(l, r) {
  const s = Bi(l, !0, r === "fixed"), u = s.top + l.clientTop, f = s.left + l.clientLeft, d = Lo(l), m = l.clientWidth * d.x, v = l.clientHeight * d.y, b = f * d.x, x = u * d.y;
  return {
    width: m,
    height: v,
    x: b,
    y: x
  };
}
function kv(l, r, s) {
  let u;
  if (r === "viewport" || r === "layoutViewport")
    u = g_(l, s, r);
  else if (r === "document")
    u = h_(dl(l));
  else if (Ha(r))
    u = v_(r, s);
  else {
    const f = s2(l);
    u = {
      x: r.x - f.x,
      y: r.y - f.y,
      width: r.width,
      height: r.height
    };
  }
  return Ou(u);
}
function p_(l, r) {
  const s = r.get(l);
  if (s)
    return s;
  let u = qr(l, [], !1).filter((v) => Ha(v) && qo(v) !== "body"), f = null;
  const d = Ua(l).position === "fixed";
  let m = d ? Ui(l) : l;
  for (; Ha(m) && !kr(m); ) {
    const v = Ua(m), b = s0(m), x = f ? f.position : d ? "fixed" : "";
    !b && (x === "fixed" || x === "absolute" && v.position === "static") ? u = u.filter((h) => h !== m) : f = v, m = Ui(m);
  }
  return r.set(l, u), u;
}
function y_(l) {
  let {
    element: r,
    boundary: s,
    rootBoundary: u,
    strategy: f
  } = l;
  const m = [...s === "clippingAncestors" ? Lu(r) ? [] : p_(r, this._c) : [].concat(s), u], v = kv(r, m[0], f);
  let b = v.top, x = v.right, _ = v.bottom, h = v.left;
  for (let E = 1; E < m.length; E++) {
    const R = kv(r, m[E], f);
    b = ll(R.top, b), x = Pl(R.right, x), _ = Pl(R.bottom, _), h = ll(R.left, h);
  }
  return {
    width: x - h,
    height: _ - b,
    x: h,
    y: b
  };
}
function b_(l) {
  const {
    width: r,
    height: s
  } = r2(l);
  return {
    width: r,
    height: s
  };
}
function S_(l, r, s) {
  const u = ti(r), f = dl(r), d = s === "fixed", m = Bi(l, !0, d, r);
  let v = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const b = il(0);
  if ((u || !d) && ((qo(r) !== "body" || Bu(f)) && (v = Vu(r)), u)) {
    const E = Bi(r, !0, d, r);
    b.x = E.x + r.clientLeft, b.y = E.y + r.clientTop;
  }
  !u && f && (b.x = Yu(f));
  const x = f && !u && !d ? u2(f, v) : il(0), _ = m.left + v.scrollLeft - b.x - x.x, h = m.top + v.scrollTop - b.y - x.y;
  return {
    x: _,
    y: h,
    width: m.width,
    height: m.height
  };
}
function Ed(l) {
  return Ua(l).position === "static";
}
function qv(l, r) {
  if (!ti(l) || Ua(l).position === "fixed")
    return null;
  if (r)
    return r(l);
  let s = l.offsetParent;
  return dl(l) === s && (s = s.ownerDocument.body), s;
}
function c2(l, r) {
  const s = _n(l);
  if (Lu(l))
    return s;
  if (!ti(l)) {
    let f = Ui(l);
    for (; f && !kr(f); ) {
      if (Ha(f) && !Ed(f))
        return f;
      f = Ui(f);
    }
    return s;
  }
  let u = qv(l, r);
  for (; u && i_(u) && Ed(u); )
    u = qv(u, r);
  return u && kr(u) && Ed(u) && !s0(u) ? s : u || s_(l) || s;
}
const x_ = async function(l) {
  const r = this.getOffsetParent || c2, s = this.getDimensions, u = await s(l.floating);
  return {
    reference: S_(l.reference, await r(l.floating), l.strategy),
    floating: {
      x: 0,
      y: 0,
      width: u.width,
      height: u.height
    }
  };
};
function E_(l) {
  return Ua(l).direction === "rtl";
}
const __ = {
  convertOffsetParentRelativeRectToViewportRelativeRect: f_,
  getDocumentElement: dl,
  getClippingRect: y_,
  getOffsetParent: c2,
  getElementRects: x_,
  getClientRects: d_,
  getDimensions: b_,
  getScale: Lo,
  isElement: Ha,
  isRTL: E_
};
function f2(l, r) {
  return l.x === r.x && l.y === r.y && l.width === r.width && l.height === r.height;
}
function T_(l, r, s) {
  let u = null, f;
  const d = dl(l);
  function m() {
    var _;
    clearTimeout(f), (_ = u) == null || _.disconnect(), u = null;
  }
  function v(_, h) {
    _ === void 0 && (_ = !1), h === void 0 && (h = 1), m();
    const E = l.getBoundingClientRect(), {
      left: R,
      top: O,
      width: M,
      height: H
    } = E;
    if (_ || r(), !M || !H)
      return;
    const D = yu(O), X = yu(d.clientWidth - (R + M)), Q = yu(d.clientHeight - (O + H)), B = yu(R), w = {
      rootMargin: -D + "px " + -X + "px " + -Q + "px " + -B + "px",
      threshold: ll(0, Pl(1, h)) || 1
    };
    let C = !0;
    function k(K) {
      const lt = K[0].intersectionRatio;
      if (!f2(E, l.getBoundingClientRect()))
        return v();
      if (lt !== h) {
        if (!C)
          return v();
        lt ? v(!1, lt) : f = setTimeout(() => {
          v(!1, 1e-7);
        }, 1e3);
      }
      C = !1;
    }
    try {
      u = new IntersectionObserver(k, {
        ...w,
        // Handle <iframe>s
        root: d.ownerDocument
      });
    } catch {
      u = new IntersectionObserver(k, w);
    }
    u.observe(l);
  }
  const b = _n(l), x = () => v(s);
  return b.addEventListener("resize", x), v(!0), () => {
    b.removeEventListener("resize", x), m();
  };
}
function w_(l, r, s, u) {
  u === void 0 && (u = {});
  const {
    ancestorScroll: f = !0,
    ancestorResize: d = !0,
    elementResize: m = typeof ResizeObserver == "function",
    layoutShift: v = typeof IntersectionObserver == "function",
    animationFrame: b = !1
  } = u, x = c0(l), _ = f || d ? [...x ? qr(x) : [], ...r ? qr(r) : []] : [];
  _.forEach((D) => {
    f && D.addEventListener("scroll", s), d && D.addEventListener("resize", s);
  });
  const h = x && v ? T_(x, s, d) : null;
  let E = -1, R = null;
  m && (R = new ResizeObserver((D) => {
    let [X] = D;
    X && X.target === x && R && r && (R.unobserve(r), cancelAnimationFrame(E), E = requestAnimationFrame(() => {
      var Q;
      (Q = R) == null || Q.observe(r);
    })), s();
  }), x && !b && R.observe(x), r && R.observe(r));
  let O, M = b ? Bi(l) : null;
  b && H();
  function H() {
    const D = Bi(l);
    M && !f2(M, D) && s(), M = D, O = requestAnimationFrame(H);
  }
  return s(), () => {
    var D;
    _.forEach((X) => {
      f && X.removeEventListener("scroll", s), d && X.removeEventListener("resize", s);
    }), h?.(), (D = R) == null || D.disconnect(), R = null, b && cancelAnimationFrame(O);
  };
}
const C_ = e_, A_ = n_, O_ = PE, N_ = l_, D_ = WE, Gv = $E, R_ = a_, z_ = (l, r, s) => {
  const u = /* @__PURE__ */ new Map(), f = s ?? {}, d = {
    ...__,
    ...f.platform,
    _c: u
  };
  return FE(l, r, {
    ...f,
    platform: d
  });
};
var M_ = typeof document < "u", j_ = function() {
}, Tu = M_ ? S.useLayoutEffect : j_;
function Nu(l, r) {
  if (l === r)
    return !0;
  if (typeof l != typeof r)
    return !1;
  if (typeof l == "function" && l.toString() === r.toString())
    return !0;
  let s, u, f;
  if (l && r && typeof l == "object") {
    if (Array.isArray(l)) {
      if (s = l.length, s !== r.length) return !1;
      for (u = s; u-- !== 0; )
        if (!Nu(l[u], r[u]))
          return !1;
      return !0;
    }
    if (f = Object.keys(l), s = f.length, s !== Object.keys(r).length)
      return !1;
    for (u = s; u-- !== 0; )
      if (!{}.hasOwnProperty.call(r, f[u]))
        return !1;
    for (u = s; u-- !== 0; ) {
      const d = f[u];
      if (!(d === "_owner" && l.$$typeof) && !Nu(l[d], r[d]))
        return !1;
    }
    return !0;
  }
  return l !== l && r !== r;
}
function d2(l) {
  return typeof window > "u" ? 1 : (l.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Xv(l, r) {
  const s = d2(l);
  return Math.round(r * s) / s;
}
function _d(l) {
  const r = S.useRef(l);
  return Tu(() => {
    r.current = l;
  }), r;
}
function H_(l) {
  l === void 0 && (l = {});
  const {
    placement: r = "bottom",
    strategy: s = "absolute",
    middleware: u = [],
    platform: f,
    elements: {
      reference: d,
      floating: m
    } = {},
    transform: v = !0,
    whileElementsMounted: b,
    open: x
  } = l, [_, h] = S.useState({
    x: 0,
    y: 0,
    strategy: s,
    placement: r,
    middlewareData: {},
    isPositioned: !1
  }), [E, R] = S.useState(u);
  Nu(E, u) || R(u);
  const [O, M] = S.useState(null), [H, D] = S.useState(null), X = S.useCallback((et) => {
    et !== w.current && (w.current = et, M(et));
  }, []), Q = S.useCallback((et) => {
    et !== C.current && (C.current = et, D(et));
  }, []), B = d || O, p = m || H, w = S.useRef(null), C = S.useRef(null), k = S.useRef(_), K = b != null, lt = _d(b), at = _d(f), tt = _d(x), ct = S.useCallback(() => {
    if (!w.current || !C.current)
      return;
    const et = {
      placement: r,
      strategy: s,
      middleware: E
    };
    at.current && (et.platform = at.current), z_(w.current, C.current, et).then((ft) => {
      const mt = {
        ...ft,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: tt.current !== !1
      };
      I.current && !Nu(k.current, mt) && (k.current = mt, Ru.flushSync(() => {
        h(mt);
      }));
    });
  }, [E, r, s, at, tt]);
  Tu(() => {
    x === !1 && k.current.isPositioned && (k.current.isPositioned = !1, h((et) => ({
      ...et,
      isPositioned: !1
    })));
  }, [x]);
  const I = S.useRef(!1);
  Tu(() => (I.current = !0, () => {
    I.current = !1;
  }), []), Tu(() => {
    if (B && (w.current = B), p && (C.current = p), B && p) {
      if (lt.current)
        return lt.current(B, p, ct);
      ct();
    }
  }, [B, p, ct, lt, K]);
  const vt = S.useMemo(() => ({
    reference: w,
    floating: C,
    setReference: X,
    setFloating: Q
  }), [X, Q]), Z = S.useMemo(() => ({
    reference: B,
    floating: p
  }), [B, p]), nt = S.useMemo(() => {
    const et = {
      position: s,
      left: 0,
      top: 0
    };
    if (!Z.floating)
      return et;
    const ft = Xv(Z.floating, _.x), mt = Xv(Z.floating, _.y);
    return v ? {
      ...et,
      transform: "translate(" + ft + "px, " + mt + "px)",
      ...d2(Z.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: s,
      left: ft,
      top: mt
    };
  }, [s, v, Z.floating, _.x, _.y]);
  return S.useMemo(() => ({
    ..._,
    update: ct,
    refs: vt,
    elements: Z,
    floatingStyles: nt
  }), [_, ct, vt, Z, nt]);
}
const U_ = (l) => {
  function r(s) {
    return {}.hasOwnProperty.call(s, "current");
  }
  return {
    name: "arrow",
    options: l,
    fn(s) {
      const {
        element: u,
        padding: f
      } = typeof l == "function" ? l(s) : l;
      return u && r(u) ? u.current != null ? Gv({
        element: u.current,
        padding: f
      }).fn(s) : {} : u ? Gv({
        element: u,
        padding: f
      }).fn(s) : {};
    }
  };
}, B_ = (l, r) => {
  const s = C_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
}, L_ = (l, r) => {
  const s = A_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
}, V_ = (l, r) => ({
  fn: R_(l).fn,
  options: [l, r]
}), Y_ = (l, r) => {
  const s = O_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
}, k_ = (l, r) => {
  const s = N_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
}, q_ = (l, r) => {
  const s = D_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
}, G_ = (l, r) => {
  const s = U_(l);
  return {
    name: s.name,
    fn: s.fn,
    options: [l, r]
  };
};
var X_ = Object.defineProperty, Q_ = (l, r) => X_(l, "name", { value: r, configurable: !0 }), Z_ = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Q_(function(r, s) {
    const { children: u, width: f = 10, height: d = 5, ...m } = r;
    return /* @__PURE__ */ y.jsx(
      en.svg,
      {
        ...m,
        ref: s,
        width: f,
        height: d,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: r.asChild ? u : /* @__PURE__ */ y.jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  }, "Arrow")
), K_ = Z_, I_ = Object.defineProperty, ol = (l, r) => I_(l, "name", { value: r, configurable: !0 }), h2 = "Popper", [m2, g2] = /* @__PURE__ */ Vo(h2), [J_, v2] = m2(h2), F_ = /* @__PURE__ */ ol((l) => {
  const { __scopePopper: r, children: s } = l, [u, f] = S.useState(null), [d, m] = S.useState(void 0);
  return /* @__PURE__ */ y.jsx(
    J_,
    {
      scope: r,
      anchor: u,
      onAnchorChange: f,
      placementState: d,
      setPlacementState: m,
      children: s
    }
  );
}, "Popper"), $_ = "PopperAnchor", P_ = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ ol(function(r, s) {
    const { __scopePopper: u, virtualRef: f, ...d } = r, m = v2($_, u), v = S.useRef(null), b = m.onAnchorChange, x = S.useCallback(
      (M) => {
        v.current = M, M && b(M);
      },
      [b]
    ), _ = Vn(s, x), h = S.useRef(null);
    S.useEffect(() => {
      if (!f)
        return;
      const M = h.current;
      h.current = f.current, M !== h.current && b(h.current);
    });
    const E = m.placementState && ku(m.placementState), R = E?.[0], O = E?.[1];
    return f ? null : /* @__PURE__ */ y.jsx(
      en.div,
      {
        "data-radix-popper-side": R,
        "data-radix-popper-align": O,
        ...d,
        ref: _
      }
    );
  }, "PopperAnchor")
), p2 = "PopperContent", [W_, tT] = m2(p2), eT = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ ol(function(r, s) {
    const {
      __scopePopper: u,
      side: f = "bottom",
      sideOffset: d = 0,
      align: m = "center",
      alignOffset: v = 0,
      arrowPadding: b = 0,
      avoidCollisions: x = !0,
      collisionBoundary: _ = [],
      collisionPadding: h = 0,
      sticky: E = "partial",
      hideWhenDetached: R = !1,
      updatePositionStrategy: O = "optimized",
      onPlaced: M,
      ...H
    } = r, D = v2(p2, u), [X, Q] = S.useState(null), B = Vn(s, Q), [p, w] = S.useState(null), C = e2(p), k = C?.width ?? 0, K = C?.height ?? 0, lt = f + (m !== "center" ? "-" + m : ""), at = typeof h == "number" ? h : { top: 0, right: 0, bottom: 0, left: 0, ...h }, tt = Array.isArray(_) ? _ : [_], ct = tt.length > 0, I = {
      padding: at,
      boundary: tt.filter(y2),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: ct
    }, { refs: vt, floatingStyles: Z, placement: nt, isPositioned: et, middlewareData: ft } = H_({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: lt,
      whileElementsMounted: /* @__PURE__ */ ol((...st) => w_(...st, {
        animationFrame: O === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: D.anchor
      },
      middleware: [
        B_({ mainAxis: d + K, alignmentAxis: v }),
        x && L_({
          mainAxis: !0,
          crossAxis: !1,
          limiter: E === "partial" ? V_() : void 0,
          ...I
        }),
        x && Y_({ ...I }),
        k_({
          ...I,
          apply: /* @__PURE__ */ ol(({ elements: st, rects: St, availableWidth: ut, availableHeight: gt }) => {
            const { width: he, height: kn } = St.reference, xe = st.floating.style;
            xe.setProperty("--radix-popper-available-width", `${ut}px`), xe.setProperty("--radix-popper-available-height", `${gt}px`), xe.setProperty("--radix-popper-anchor-width", `${he}px`), xe.setProperty("--radix-popper-anchor-height", `${kn}px`);
          }, "apply")
        }),
        p && G_({ element: p, padding: b }),
        iT({ arrowWidth: k, arrowHeight: K }),
        R && q_({
          strategy: "referenceHidden",
          ...I,
          // `hide` detects whether the anchor (reference) is clipped, so when
          // no explicit `collisionBoundary` is set we fall back to Floating
          // UI's default clipping ancestors (e.g. a scrollable menu). This
          // lets an occluded submenu hide once its anchor scrolls out of view
          // (#3237). The collision/size middlewares deliberately keep the
          // viewport-based default to avoid clamping content rendered inside
          // transformed or overflow-clipping portal containers.
          boundary: ct ? I.boundary : void 0
        })
      ]
    }), mt = D.setPlacementState;
    fn(() => (mt(nt), () => {
      mt(void 0);
    }), [nt, mt]);
    const [Vt, $t] = ku(nt), re = $l(M);
    fn(() => {
      et && re?.();
    }, [et, re]);
    const A = ft.arrow?.x, z = ft.arrow?.y, P = ft.arrow?.centerOffset !== 0, [it, bt] = S.useState();
    return fn(() => {
      X && bt(window.getComputedStyle(X).zIndex);
    }, [X]), /* @__PURE__ */ y.jsx(
      "div",
      {
        ref: vt.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...Z,
          transform: et ? Z.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: it,
          "--radix-popper-transform-origin": [
            ft.transformOrigin?.x,
            ft.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...ft.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: r.dir,
        children: /* @__PURE__ */ y.jsx(
          W_,
          {
            scope: u,
            placedSide: Vt,
            placedAlign: $t,
            onArrowChange: w,
            arrowX: A,
            arrowY: z,
            shouldHideArrow: P,
            children: /* @__PURE__ */ y.jsx(
              en.div,
              {
                "data-side": Vt,
                "data-align": $t,
                ...H,
                ref: B,
                style: {
                  ...H.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: et ? H.style?.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
), nT = "PopperArrow", aT = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, lT = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ ol(function(r, s) {
    const { __scopePopper: u, ...f } = r, d = tT(nT, u), m = aT[d.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ y.jsx(
        "span",
        {
          ref: d.onArrowChange,
          style: {
            position: "absolute",
            left: d.arrowX,
            top: d.arrowY,
            [m]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[d.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: "rotate(180deg)",
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[d.placedSide],
            visibility: d.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ y.jsx(
            K_,
            {
              ...f,
              ref: s,
              style: {
                ...f.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  }, "PopperArrow")
);
function y2(l) {
  return l !== null;
}
ol(y2, "isNotNull");
var iT = /* @__PURE__ */ ol((l) => ({
  name: "transformOrigin",
  options: l,
  fn(r) {
    const { placement: s, rects: u, middlewareData: f } = r, m = f.arrow?.centerOffset !== 0, v = m ? 0 : l.arrowWidth, b = m ? 0 : l.arrowHeight, [x, _] = ku(s), h = { start: "0%", center: "50%", end: "100%" }[_], E = (f.arrow?.x ?? 0) + v / 2, R = (f.arrow?.y ?? 0) + b / 2;
    let O = "", M = "";
    return x === "bottom" ? (O = m ? h : `${E}px`, M = `${-b}px`) : x === "top" ? (O = m ? h : `${E}px`, M = `${u.floating.height + b}px`) : x === "right" ? (O = `${-b}px`, M = m ? h : `${R}px`) : x === "left" && (O = `${u.floating.width + b}px`, M = m ? h : `${R}px`), { data: { x: O, y: M } };
  }
}), "transformOrigin");
function ku(l) {
  const [r, s = "center"] = l.split("-");
  return [r, s];
}
ol(ku, "getSideAndAlignFromPlacement");
var oT = F_, rT = P_, sT = eT, uT = lT, cT = Object.defineProperty, Me = (l, r) => cT(l, "name", { value: r, configurable: !0 }), [f0, dC] = /* @__PURE__ */ Vo("Tooltip", [
  g2
]), qu = g2(), fT = "TooltipProvider", dT = 700, kd = "tooltip.open", [hT, d0] = f0(fT), mT = /* @__PURE__ */ Me((l) => {
  const {
    __scopeTooltip: r,
    delayDuration: s = dT,
    skipDelayDuration: u = 300,
    disableHoverableContent: f = !1,
    children: d
  } = l, m = S.useRef(!0), v = S.useRef(!1), b = S.useRef(0);
  return S.useEffect(() => {
    const x = b.current;
    return () => window.clearTimeout(x);
  }, []), /* @__PURE__ */ y.jsx(
    hT,
    {
      scope: r,
      isOpenDelayedRef: m,
      delayDuration: s,
      onOpen: S.useCallback(() => {
        u <= 0 || (window.clearTimeout(b.current), m.current = !1);
      }, [u]),
      onClose: S.useCallback(() => {
        u <= 0 || (window.clearTimeout(b.current), b.current = window.setTimeout(
          () => m.current = !0,
          u
        ));
      }, [u]),
      isPointerInTransitRef: v,
      onPointerInTransitChange: S.useCallback((x) => {
        v.current = x;
      }, []),
      disableHoverableContent: f,
      children: d
    }
  );
}, "TooltipProvider"), qd = "Tooltip", [gT, Kr] = f0(qd), vT = /* @__PURE__ */ Me((l) => {
  const {
    __scopeTooltip: r,
    children: s,
    open: u,
    defaultOpen: f,
    onOpenChange: d,
    disableHoverableContent: m,
    delayDuration: v
  } = l, b = d0(qd, l.__scopeTooltip), x = qu(r), [_, h] = S.useState(null), [E, R] = S.useState(void 0), O = Vr(), M = S.useRef(0), H = m ?? b.disableHoverableContent, D = v ?? b.delayDuration, X = S.useRef(!1), [Q, B] = Kd({
    prop: u,
    defaultProp: f ?? !1,
    onChange: /* @__PURE__ */ Me((lt) => {
      lt ? (b.onOpen(), document.dispatchEvent(new CustomEvent(kd))) : b.onClose(), d?.(lt);
    }, "onChange"),
    caller: qd
  }), p = S.useMemo(() => Q ? X.current ? "delayed-open" : "instant-open" : "closed", [Q]), w = S.useCallback(() => {
    window.clearTimeout(M.current), M.current = 0, X.current = !1, B(!0);
  }, [B]), C = S.useCallback(() => {
    window.clearTimeout(M.current), M.current = 0, B(!1);
  }, [B]), k = S.useCallback(() => {
    window.clearTimeout(M.current), M.current = window.setTimeout(() => {
      X.current = !0, B(!0), M.current = 0;
    }, D);
  }, [D, B]);
  S.useEffect(() => () => {
    M.current && (window.clearTimeout(M.current), M.current = 0);
  }, []);
  const K = E ?? O;
  return /* @__PURE__ */ y.jsx(oT, { ...x, children: /* @__PURE__ */ y.jsx(
    gT,
    {
      scope: r,
      contentId: K,
      setContentId: R,
      open: Q,
      stateAttribute: p,
      trigger: _,
      onTriggerChange: h,
      onTriggerEnter: S.useCallback(() => {
        b.isOpenDelayedRef.current ? k() : w();
      }, [b.isOpenDelayedRef, k, w]),
      onTriggerLeave: S.useCallback(() => {
        H ? C() : (window.clearTimeout(M.current), M.current = 0);
      }, [C, H]),
      onOpen: w,
      onClose: C,
      disableHoverableContent: H,
      children: s
    }
  ) });
}, "Tooltip"), Qv = "TooltipTrigger", pT = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Me(function(r, s) {
    const { __scopeTooltip: u, ...f } = r, d = Kr(Qv, u), m = d0(Qv, u), v = qu(u), b = S.useRef(null), x = Vn(s, b, d.onTriggerChange), _ = S.useRef(!1), h = S.useRef(!1), E = S.useCallback(() => _.current = !1, []);
    return S.useEffect(() => () => document.removeEventListener("pointerup", E), [E]), /* @__PURE__ */ y.jsx(rT, { asChild: !0, ...v, children: /* @__PURE__ */ y.jsx(
      en.button,
      {
        "aria-describedby": d.open ? d.contentId : void 0,
        "data-state": d.stateAttribute,
        ...f,
        ref: x,
        onPointerMove: tn(r.onPointerMove, (R) => {
          R.pointerType !== "touch" && !h.current && !m.isPointerInTransitRef.current && (d.onTriggerEnter(), h.current = !0);
        }),
        onPointerLeave: tn(r.onPointerLeave, () => {
          d.onTriggerLeave(), h.current = !1;
        }),
        onPointerDown: tn(r.onPointerDown, () => {
          d.open && d.onClose(), _.current = !0, document.addEventListener("pointerup", E, { once: !0 });
        }),
        onFocus: tn(r.onFocus, () => {
          _.current || d.onOpen();
        }),
        onBlur: tn(r.onBlur, d.onClose),
        onClick: tn(r.onClick, d.onClose)
      }
    ) });
  }, "TooltipTrigger")
), b2 = "TooltipPortal", [yT, bT] = f0(b2, {
  forceMount: void 0
}), ST = /* @__PURE__ */ Me((l) => {
  const { __scopeTooltip: r, forceMount: s, children: u, container: f } = l, d = Kr(b2, r);
  return /* @__PURE__ */ y.jsx(yT, { scope: r, forceMount: s, children: /* @__PURE__ */ y.jsx(Zr, { present: s || d.open, children: /* @__PURE__ */ y.jsx(Up, { asChild: !0, container: f, children: u }) }) });
}, "TooltipPortal"), Gr = "TooltipContent", xT = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Me(function(r, s) {
    const u = bT(Gr, r.__scopeTooltip), { forceMount: f = u.forceMount, side: d = "top", ...m } = r, v = Kr(Gr, r.__scopeTooltip);
    return /* @__PURE__ */ y.jsx(Zr, { present: f || v.open, children: v.disableHoverableContent ? /* @__PURE__ */ y.jsx(S2, { side: d, ...m, ref: s }) : /* @__PURE__ */ y.jsx(ET, { side: d, ...m, ref: s }) });
  }, "TooltipContent")
), ET = /* @__PURE__ */ S.forwardRef(/* @__PURE__ */ Me(function(r, s) {
  const u = Kr(Gr, r.__scopeTooltip), f = d0(Gr, r.__scopeTooltip), d = S.useRef(null), m = Vn(s, d), [v, b] = S.useState(null), { trigger: x, onClose: _ } = u, h = d.current, { onPointerInTransitChange: E } = f, R = S.useCallback(() => {
    b(null), E(!1);
  }, [E]), O = S.useCallback(
    (M, H) => {
      const D = M.currentTarget, X = { x: M.clientX, y: M.clientY }, Q = x2(X, D.getBoundingClientRect()), B = E2(X, Q), p = _2(H.getBoundingClientRect()), w = w2([...B, ...p]);
      b(w), E(!0);
    },
    [E]
  );
  return S.useEffect(() => () => R(), [R]), S.useEffect(() => {
    if (x && h) {
      const M = /* @__PURE__ */ Me((D) => O(D, h), "handleTriggerLeave"), H = /* @__PURE__ */ Me((D) => O(D, x), "handleContentLeave");
      return x.addEventListener("pointerleave", M), h.addEventListener("pointerleave", H), () => {
        x.removeEventListener("pointerleave", M), h.removeEventListener("pointerleave", H);
      };
    }
  }, [x, h, O, R]), S.useEffect(() => {
    if (v) {
      const M = /* @__PURE__ */ Me((H) => {
        const D = H.target, X = { x: H.clientX, y: H.clientY }, Q = x?.contains(D) || h?.contains(D), B = !T2(X, v);
        Q ? R() : B && (R(), _());
      }, "handleTrackPointerGrace");
      return document.addEventListener("pointermove", M), () => document.removeEventListener("pointermove", M);
    }
  }, [x, h, v, _, R]), /* @__PURE__ */ y.jsx(S2, { ...r, ref: m });
}, "TooltipContentHoverable")), _T = /* @__PURE__ */ sp("TooltipContent"), S2 = /* @__PURE__ */ S.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Me(function(r, s) {
    const {
      __scopeTooltip: u,
      children: f,
      "aria-label": d,
      id: m,
      onEscapeKeyDown: v,
      onPointerDownOutside: b,
      ...x
    } = r, _ = Kr(Gr, u), h = qu(u), { onClose: E } = _;
    S.useEffect(() => (document.addEventListener(kd, E), () => document.removeEventListener(kd, E)), [E]), S.useEffect(() => {
      if (_.trigger) {
        const O = /* @__PURE__ */ Me((M) => {
          M.target instanceof Node && M.target.contains(_.trigger) && E();
        }, "handleScroll");
        return window.addEventListener("scroll", O, { capture: !0 }), () => window.removeEventListener("scroll", O, { capture: !0 });
      }
    }, [_.trigger, E]);
    const { setContentId: R } = _;
    return fn(() => (R(m), () => {
      R(void 0);
    }), [m, R]), /* @__PURE__ */ y.jsx(
      Cp,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: v,
        onPointerDownOutside: b,
        onFocusOutside: (O) => O.preventDefault(),
        onDismiss: E,
        children: /* @__PURE__ */ y.jsxs(
          sT,
          {
            "data-state": _.stateAttribute,
            role: d ? void 0 : "tooltip",
            id: d ? void 0 : _.contentId,
            ...h,
            ...x,
            ref: s,
            style: {
              ...x.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ y.jsx(_T, { children: f }),
              d ? /* @__PURE__ */ y.jsx(MS, { id: _.contentId, role: "tooltip", children: d }) : null
            ]
          }
        )
      }
    );
  }, "TooltipContentImpl")
), TT = /* @__PURE__ */ S.forwardRef(
  /* @__PURE__ */ Me(function(r, s) {
    const { __scopeTooltip: u, ...f } = r, d = qu(u);
    return /* @__PURE__ */ y.jsx(uT, { ...d, ...f, ref: s });
  }, "TooltipArrow")
);
function x2(l, r) {
  const s = Math.abs(r.top - l.y), u = Math.abs(r.bottom - l.y), f = Math.abs(r.right - l.x), d = Math.abs(r.left - l.x);
  switch (Math.min(s, u, f, d)) {
    case d:
      return "left";
    case f:
      return "right";
    case s:
      return "top";
    case u:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
Me(x2, "getExitSideFromRect");
function E2(l, r, s = 5) {
  const u = [];
  switch (r) {
    case "top":
      u.push(
        { x: l.x - s, y: l.y + s },
        { x: l.x + s, y: l.y + s }
      );
      break;
    case "bottom":
      u.push(
        { x: l.x - s, y: l.y - s },
        { x: l.x + s, y: l.y - s }
      );
      break;
    case "left":
      u.push(
        { x: l.x + s, y: l.y - s },
        { x: l.x + s, y: l.y + s }
      );
      break;
    case "right":
      u.push(
        { x: l.x - s, y: l.y - s },
        { x: l.x - s, y: l.y + s }
      );
      break;
  }
  return u;
}
Me(E2, "getPaddedExitPoints");
function _2(l) {
  const { top: r, right: s, bottom: u, left: f } = l;
  return [
    { x: f, y: r },
    { x: s, y: r },
    { x: s, y: u },
    { x: f, y: u }
  ];
}
Me(_2, "getPointsFromRect");
function T2(l, r) {
  const { x: s, y: u } = l;
  let f = !1;
  for (let d = 0, m = r.length - 1; d < r.length; m = d++) {
    const v = r[d], b = r[m], x = v.x, _ = v.y, h = b.x, E = b.y;
    _ > u != E > u && s < (h - x) * (u - _) / (E - _) + x && (f = !f);
  }
  return f;
}
Me(T2, "isPointInPolygon");
function w2(l) {
  const r = l.slice();
  return r.sort((s, u) => s.x < u.x ? -1 : s.x > u.x ? 1 : s.y < u.y ? -1 : s.y > u.y ? 1 : 0), C2(r);
}
Me(w2, "getHull");
function C2(l) {
  if (l.length <= 1) return l.slice();
  const r = [];
  for (let u = 0; u < l.length; u++) {
    const f = l[u];
    for (; r.length >= 2; ) {
      const d = r[r.length - 1], m = r[r.length - 2];
      if ((d.x - m.x) * (f.y - m.y) >= (d.y - m.y) * (f.x - m.x)) r.pop();
      else break;
    }
    r.push(f);
  }
  r.pop();
  const s = [];
  for (let u = l.length - 1; u >= 0; u--) {
    const f = l[u];
    for (; s.length >= 2; ) {
      const d = s[s.length - 1], m = s[s.length - 2];
      if ((d.x - m.x) * (f.y - m.y) >= (d.y - m.y) * (f.x - m.x)) s.pop();
      else break;
    }
    s.push(f);
  }
  return s.pop(), r.length === 1 && s.length === 1 && r[0].x === s[0].x && r[0].y === s[0].y ? r : r.concat(s);
}
Me(C2, "getHullPresorted");
var wT = mT, CT = vT, AT = pT, OT = ST, NT = xT, DT = TT;
const Td = 768;
function RT() {
  const [l, r] = S.useState(void 0);
  return S.useEffect(() => {
    const s = window.matchMedia(`(max-width: ${Td - 1}px)`), u = () => {
      r(window.innerWidth < Td);
    };
    return s.addEventListener("change", u), r(window.innerWidth < Td), () => s.removeEventListener("change", u);
  }, []), !!l;
}
const zT = Xd(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Ve({
  className: l,
  variant: r = "default",
  size: s = "default",
  asChild: u = !1,
  ...f
}) {
  const d = u ? Zd : "button";
  return /* @__PURE__ */ y.jsx(
    d,
    {
      "data-slot": "button",
      "data-variant": r,
      "data-size": s,
      className: At(zT({ variant: r, size: s, className: l })),
      ...f
    }
  );
}
function MT({ className: l, type: r, ...s }) {
  return /* @__PURE__ */ y.jsx(
    "input",
    {
      type: r,
      "data-slot": "input",
      className: At(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        l
      ),
      ...s
    }
  );
}
function A2({ ...l }) {
  return /* @__PURE__ */ y.jsx(Wd, { "data-slot": "sheet", ...l });
}
function jT({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(t0, { container: document.getElementById("manager-root") || document.getElementById("support-root"), "data-slot": "sheet-portal", ...l });
}
function HT({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    e0,
    {
      "data-slot": "sheet-overlay",
      className: At(
        "fixed inset-0 z-50 bg-black/10 duration-100  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        l
      ),
      ...r
    }
  );
}
function O2({
  className: l,
  children: r,
  side: s = "right",
  showCloseButton: u = !0,
  ...f
}) {
  return /* @__PURE__ */ y.jsxs(jT, { children: [
    /* @__PURE__ */ y.jsx(HT, {}),
    /* @__PURE__ */ y.jsxs(
      n0,
      {
        "data-slot": "sheet-content",
        "data-side": s,
        className: At(
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[side=bottom]:data-[state=open]:slide-in-from-bottom-10 data-[side=left]:data-[state=open]:slide-in-from-left-10 data-[side=right]:data-[state=open]:slide-in-from-right-10 data-[side=top]:data-[state=open]:slide-in-from-top-10 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-10 data-[side=left]:data-[state=closed]:slide-out-to-left-10 data-[side=right]:data-[state=closed]:slide-out-to-right-10 data-[side=top]:data-[state=closed]:slide-out-to-top-10",
          l
        ),
        ...f,
        children: [
          r,
          u && /* @__PURE__ */ y.jsx(ju, { "data-slot": "sheet-close", asChild: !0, children: /* @__PURE__ */ y.jsxs(
            Ve,
            {
              variant: "ghost",
              className: "absolute top-3 right-3",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ y.jsx(
                  tp,
                  {}
                ),
                /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function N2({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: At("flex flex-col gap-0.5 p-4", l),
      ...r
    }
  );
}
function D2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    a0,
    {
      "data-slot": "sheet-title",
      className: At(
        "text-base font-medium text-foreground",
        l
      ),
      ...r
    }
  );
}
function R2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    l0,
    {
      "data-slot": "sheet-description",
      className: At("text-sm text-muted-foreground", l),
      ...r
    }
  );
}
function Zv({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: At("animate-pulse rounded-md bg-muted", l),
      ...r
    }
  );
}
function UT({
  delayDuration: l = 0,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    wT,
    {
      "data-slot": "tooltip-provider",
      delayDuration: l,
      ...r
    }
  );
}
function BT({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(CT, { "data-slot": "tooltip", ...l });
}
function LT({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(AT, { "data-slot": "tooltip-trigger", ...l });
}
function VT({
  className: l,
  sideOffset: r = 0,
  children: s,
  ...u
}) {
  return /* @__PURE__ */ y.jsx(OT, { container: document.getElementById("manager-root") || document.getElementById("support-root"), children: /* @__PURE__ */ y.jsxs(
    NT,
    {
      "data-slot": "tooltip-content",
      sideOffset: r,
      className: At(
        "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        l
      ),
      ...u,
      children: [
        s,
        /* @__PURE__ */ y.jsx(DT, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}
const YT = "sidebar_state", kT = 3600 * 24 * 7, qT = "16rem", GT = "18rem", XT = "3rem", QT = "b", z2 = S.createContext(null);
function Gu() {
  const l = S.useContext(z2);
  if (!l)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return l;
}
function ZT({
  defaultOpen: l = !0,
  open: r,
  onOpenChange: s,
  className: u,
  style: f,
  children: d,
  ...m
}) {
  const v = RT(), [b, x] = S.useState(!1), [_, h] = S.useState(l), E = r ?? _, R = S.useCallback(
    (D) => {
      const X = typeof D == "function" ? D(E) : D;
      s ? s(X) : h(X), document.cookie = `${YT}=${X}; path=/; max-age=${kT}`;
    },
    [s, E]
  ), O = S.useCallback(() => v ? x((D) => !D) : R((D) => !D), [v, R, x]);
  S.useEffect(() => {
    const D = (X) => {
      X.key === QT && (X.metaKey || X.ctrlKey) && (X.preventDefault(), O());
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [O]);
  const M = E ? "expanded" : "collapsed", H = S.useMemo(
    () => ({
      state: M,
      open: E,
      setOpen: R,
      isMobile: v,
      openMobile: b,
      setOpenMobile: x,
      toggleSidebar: O
    }),
    [M, E, R, v, b, x, O]
  );
  return /* @__PURE__ */ y.jsx(z2.Provider, { value: H, children: /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": qT,
        "--sidebar-width-icon": XT,
        ...f
      },
      className: At(
        "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
        u
      ),
      ...m,
      children: d
    }
  ) });
}
function KT({
  side: l = "left",
  variant: r = "sidebar",
  collapsible: s = "offcanvas",
  className: u,
  children: f,
  dir: d,
  ...m
}) {
  const { isMobile: v, state: b, openMobile: x, setOpenMobile: _ } = Gu();
  return s === "none" ? /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sidebar",
      className: At(
        "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
        u
      ),
      ...m,
      children: f
    }
  ) : v ? /* @__PURE__ */ y.jsx(A2, { open: x, onOpenChange: _, ...m, children: /* @__PURE__ */ y.jsxs(
    O2,
    {
      dir: d,
      "data-sidebar": "sidebar",
      "data-slot": "sidebar",
      "data-mobile": "true",
      className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
      style: {
        "--sidebar-width": GT
      },
      side: l,
      children: [
        /* @__PURE__ */ y.jsxs(N2, { className: "sr-only", children: [
          /* @__PURE__ */ y.jsx(D2, { children: "Sidebar" }),
          /* @__PURE__ */ y.jsx(R2, { children: "Displays the mobile sidebar." })
        ] }),
        /* @__PURE__ */ y.jsx("div", { className: "flex h-full w-full flex-col", children: f })
      ]
    }
  ) }) : /* @__PURE__ */ y.jsxs(
    "div",
    {
      className: "group peer hidden text-sidebar-foreground md:block",
      "data-state": b,
      "data-collapsible": b === "collapsed" ? s : "",
      "data-variant": r,
      "data-side": l,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ y.jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: At(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              r === "floating" || r === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ y.jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            "data-side": l,
            className: At(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
              // Adjust the padding for floating and inset variants.
              r === "floating" || r === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              u
            ),
            ...m,
            children: /* @__PURE__ */ y.jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
                children: f
              }
            )
          }
        )
      ]
    }
  );
}
function IT({
  className: l,
  onClick: r,
  ...s
}) {
  const { toggleSidebar: u } = Gu();
  return /* @__PURE__ */ y.jsxs(
    Ve,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon-sm",
      className: At(l),
      onClick: (f) => {
        r?.(f), u();
      },
      ...s,
      children: [
        /* @__PURE__ */ y.jsx(L1, {}),
        /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function JT({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: At(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        l
      ),
      ...r
    }
  );
}
function FT({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: At("flex flex-col gap-2 p-2", l),
      ...r
    }
  );
}
function $T({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: At("flex flex-col gap-2 p-2", l),
      ...r
    }
  );
}
function PT({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: At(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        l
      ),
      ...r
    }
  );
}
function WT({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: At("flex w-full min-w-0 flex-col gap-0", l),
      ...r
    }
  );
}
function tw({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: At("group/menu-item relative", l),
      ...r
    }
  );
}
const ew = Xd(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function nw({
  asChild: l = !1,
  isActive: r = !1,
  variant: s = "default",
  size: u = "default",
  tooltip: f,
  className: d,
  ...m
}) {
  const v = l ? Zd : "button", { isMobile: b, state: x } = Gu(), _ = /* @__PURE__ */ y.jsx(
    v,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": u,
      "data-active": r || void 0,
      className: At(ew({ variant: s, size: u }), d),
      ...m
    }
  );
  return f ? (typeof f == "string" && (f = {
    children: f
  }), /* @__PURE__ */ y.jsxs(BT, { children: [
    /* @__PURE__ */ y.jsx(LT, { asChild: !0, children: _ }),
    /* @__PURE__ */ y.jsx(
      VT,
      {
        side: "right",
        align: "center",
        hidden: x !== "collapsed" || b,
        ...f
      }
    )
  ] })) : _;
}
function aw({
  className: l,
  size: r = "default",
  ...s
}) {
  return /* @__PURE__ */ y.jsx(
    RE,
    {
      "data-slot": "avatar",
      "data-size": r,
      className: At(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        l
      ),
      ...s
    }
  );
}
function lw({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    ME,
    {
      "data-slot": "avatar-image",
      className: At(
        "aspect-square size-full rounded-full object-cover",
        l
      ),
      ...r
    }
  );
}
function iw({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    HE,
    {
      "data-slot": "avatar-fallback",
      className: At(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        l
      ),
      ...r
    }
  );
}
var ow = (l, r, s, u, f, d, m, v) => {
  let b = document.documentElement, x = ["light", "dark"];
  function _(R) {
    (Array.isArray(l) ? l : [l]).forEach((O) => {
      let M = O === "class", H = M && d ? f.map((D) => d[D] || D) : f;
      M ? (b.classList.remove(...H), b.classList.add(d && d[R] ? d[R] : R)) : b.setAttribute(O, R);
    }), h(R);
  }
  function h(R) {
    v && x.includes(R) && (b.style.colorScheme = R);
  }
  function E() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (u) _(u);
  else try {
    let R = localStorage.getItem(r) || s, O = m && R === "system" ? E() : R;
    _(O);
  } catch {
  }
}, rw = S.createContext(void 0), sw = { setTheme: (l) => {
}, themes: [] }, uw = () => {
  var l;
  return (l = S.useContext(rw)) != null ? l : sw;
};
S.memo(({ forcedTheme: l, storageKey: r, attribute: s, enableSystem: u, enableColorScheme: f, defaultTheme: d, value: m, themes: v, nonce: b, scriptProps: x }) => {
  let _ = JSON.stringify([s, r, d, l, v, m, u, f]).slice(1, -1);
  return S.createElement("script", { ...x, suppressHydrationWarning: !0, nonce: typeof window > "u" ? b : "", dangerouslySetInnerHTML: { __html: `(${ow.toString()})(${_})` } });
});
function cw(l) {
  if (typeof document > "u") return;
  let r = document.head || document.getElementsByTagName("head")[0], s = document.createElement("style");
  s.type = "text/css", r.appendChild(s), s.styleSheet ? s.styleSheet.cssText = l : s.appendChild(document.createTextNode(l));
}
const fw = (l) => {
  switch (l) {
    case "success":
      return mw;
    case "info":
      return vw;
    case "warning":
      return gw;
    case "error":
      return pw;
    default:
      return null;
  }
}, dw = Array(12).fill(0), hw = ({ visible: l, className: r }) => /* @__PURE__ */ ot.createElement("div", {
  className: [
    "sonner-loading-wrapper",
    r
  ].filter(Boolean).join(" "),
  "data-visible": l
}, /* @__PURE__ */ ot.createElement("div", {
  className: "sonner-spinner"
}, dw.map((s, u) => /* @__PURE__ */ ot.createElement("div", {
  className: "sonner-loading-bar",
  key: `spinner-bar-${u}`
})))), mw = /* @__PURE__ */ ot.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ ot.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
})), gw = /* @__PURE__ */ ot.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ ot.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
})), vw = /* @__PURE__ */ ot.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ ot.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
})), pw = /* @__PURE__ */ ot.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ ot.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
})), yw = /* @__PURE__ */ ot.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /* @__PURE__ */ ot.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ ot.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})), bw = () => {
  const [l, r] = ot.useState(document.hidden);
  return ot.useEffect(() => {
    const s = () => {
      r(document.hidden);
    };
    return document.addEventListener("visibilitychange", s), () => document.removeEventListener("visibilitychange", s);
  }, []), l;
};
let Sw = 1;
const xw = 100, Kv = (l) => {
  var r;
  return typeof l?.id == "number" || (l == null || (r = l.id) == null ? void 0 : r.length) > 0 ? l.id : Sw++;
};
class Ew {
  constructor() {
    this.subscribe = (r) => (this.subscribers.push(r), this.getActiveToasts().forEach((s) => r(s)), () => {
      const s = this.subscribers.indexOf(r);
      this.subscribers.splice(s, 1);
    }), this.publish = (r) => {
      this.subscribers.forEach((s) => s(r));
    }, this.addToast = (r) => {
      this.publish(r), this.toasts = [
        ...this.toasts,
        r
      ], this.trimHistory();
    }, this.trimHistory = () => {
      let r = this.toasts.length - xw;
      r <= 0 || (this.toasts = this.toasts.filter((s) => r > 0 && this.dismissedToasts.has(s.id) ? (this.dismissedToasts.delete(s.id), r--, !1) : !0));
    }, this.create = (r) => {
      const { message: s, ...u } = r, f = Kv(r), d = this.pendingDismissals.get(f);
      d !== void 0 && (cancelAnimationFrame(d), this.pendingDismissals.delete(f), this.dismissedToasts.delete(f));
      const m = this.dismissedToasts.has(f), v = r.dismissible === void 0 ? !0 : r.dismissible;
      return m && (this.dismissedToasts.delete(f), this.toasts = this.toasts.filter((x) => x.id !== f)), (m ? void 0 : this.toasts.find((x) => x.id === f)) ? this.toasts = this.toasts.map((x) => x.id === f ? (this.publish({
        ...x,
        ...r,
        id: f,
        title: s
      }), {
        ...x,
        ...r,
        id: f,
        dismissible: v,
        title: s
      }) : x) : this.addToast({
        title: s,
        ...u,
        dismissible: v,
        id: f
      }), f;
    }, this.dismiss = (r) => {
      if (r == null)
        return this.getActiveToasts().forEach((u) => {
          this.dismissedToasts.add(u.id), this.subscribers.forEach((f) => f({
            id: u.id,
            dismiss: !0
          }));
        }), r;
      this.dismissedToasts.add(r);
      const s = this.pendingDismissals.get(r);
      return s !== void 0 && cancelAnimationFrame(s), this.pendingDismissals.set(r, requestAnimationFrame(() => {
        this.pendingDismissals.delete(r), this.subscribers.forEach((u) => u({
          id: r,
          dismiss: !0
        }));
      })), r;
    }, this.message = (r, s) => this.create({
      ...s,
      message: r,
      type: void 0
    }), this.error = (r, s) => this.create({
      ...s,
      message: r,
      type: "error"
    }), this.success = (r, s) => this.create({
      ...s,
      type: "success",
      message: r
    }), this.info = (r, s) => this.create({
      ...s,
      type: "info",
      message: r
    }), this.warning = (r, s) => this.create({
      ...s,
      type: "warning",
      message: r
    }), this.loading = (r, s) => this.create({
      ...s,
      type: "loading",
      message: r
    }), this.promise = (r, s) => {
      if (!s)
        return;
      let u;
      s.loading !== void 0 && (u = this.create({
        ...s,
        promise: r,
        type: "loading",
        message: s.loading,
        description: typeof s.description != "function" ? s.description : void 0
      }));
      const f = Promise.resolve(r instanceof Function ? r() : r);
      let d = u !== void 0, m;
      const v = f.then(async (x) => {
        if (m = [
          "resolve",
          x
        ], ot.isValidElement(x))
          d = !1, this.create({
            id: u,
            type: "default",
            message: x
          });
        else if (Tw(x) && !x.ok) {
          d = !1;
          const h = typeof s.error == "function" ? await s.error(`HTTP error! status: ${x.status}`) : s.error, E = typeof s.description == "function" ? await s.description(`HTTP error! status: ${x.status}`) : s.description, O = typeof h == "object" && !ot.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: u,
            type: "error",
            description: E,
            ...O
          });
        } else if (x instanceof Error) {
          d = !1;
          const h = typeof s.error == "function" ? await s.error(x) : s.error, E = typeof s.description == "function" ? await s.description(x) : s.description, O = typeof h == "object" && !ot.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: u,
            type: "error",
            description: E,
            ...O
          });
        } else if (s.success !== void 0) {
          d = !1;
          const h = typeof s.success == "function" ? await s.success(x) : s.success, E = typeof s.description == "function" ? await s.description(x) : s.description, O = typeof h == "object" && !ot.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: u,
            type: "success",
            description: E,
            ...O
          });
        }
      }).catch(async (x) => {
        if (m = [
          "reject",
          x
        ], s.error !== void 0) {
          d = !1;
          const _ = typeof s.error == "function" ? await s.error(x) : s.error, h = typeof s.description == "function" ? await s.description(x) : s.description, R = typeof _ == "object" && !ot.isValidElement(_) ? _ : {
            message: _
          };
          this.create({
            id: u,
            type: "error",
            description: h,
            ...R
          });
        }
      }).finally(() => {
        d && (this.dismiss(u), u = void 0), s.finally == null || s.finally.call(s);
      }), b = () => new Promise((x, _) => v.then(() => m[0] === "reject" ? _(m[1]) : x(m[1])).catch(_));
      return typeof u != "string" && typeof u != "number" ? {
        unwrap: b
      } : Object.assign(u, {
        unwrap: b
      });
    }, this.custom = (r, s) => {
      const u = Kv(s);
      return this.create({
        ...s,
        jsx: r(u),
        id: u,
        type: void 0
      }), u;
    }, this.getActiveToasts = () => this.toasts.filter((r) => !this.dismissedToasts.has(r.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set(), this.pendingDismissals = /* @__PURE__ */ new Map();
  }
}
const En = new Ew(), _w = (l, r) => En.message(l, r), Tw = (l) => l && typeof l == "object" && "ok" in l && typeof l.ok == "boolean" && "status" in l && typeof l.status == "number", ww = _w, Cw = () => En.toasts, Aw = () => En.getActiveToasts(), Jl = Object.assign(ww, {
  success: En.success,
  info: En.info,
  warning: En.warning,
  error: En.error,
  custom: En.custom,
  message: En.message,
  promise: En.promise,
  dismiss: En.dismiss,
  loading: En.loading
}, {
  getHistory: Cw,
  getToasts: Aw
});
cw("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--normal-text);background:var(--normal-bg);border:1px solid var(--normal-border);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{-webkit-user-select:none;user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function bu(l) {
  return l.label !== void 0;
}
const Ow = 3, Nw = "24px", Dw = "16px", Iv = 4e3, Rw = 356, zw = 14, Mw = 45, jw = 200;
function Ra(...l) {
  return l.filter(Boolean).join(" ");
}
function Hw(l) {
  const [r, s] = l.split("-"), u = [];
  return r && u.push(r), s && u.push(s), u;
}
const Uw = (l) => {
  var r, s, u, f, d, m, v, b, x;
  const { invert: _, toast: h, unstyled: E, interacting: R, setHeights: O, visibleToasts: M, heights: H, index: D, toasts: X, expanded: Q, removeToast: B, defaultRichColors: p, closeButton: w, style: C, cancelButtonStyle: k, actionButtonStyle: K, className: lt = "", descriptionClassName: at = "", duration: tt, position: ct, gap: I, expandByDefault: vt, classNames: Z, icons: nt, closeButtonAriaLabel: et = "Close toast" } = l, [ft, mt] = ot.useState(null), [Vt, $t] = ot.useState(null), [re, A] = ot.useState(!1), [z, P] = ot.useState(!1), [it, bt] = ot.useState(!1), [st, St] = ot.useState(!1), [ut, gt] = ot.useState(!1), [he, kn] = ot.useState(0), [xe, Ne] = ot.useState(0), ee = ot.useRef(h.duration || tt || Iv), Gt = ot.useRef(null), me = ot.useRef(null), qn = D === 0, Gn = D + 1 <= M, ge = h.type, aa = ge ?? "default", nn = h.dismissible !== !1, ei = h.className || "", hl = h.descriptionClassName || "", ya = ot.useMemo(() => H.findIndex((Tt) => Tt.toastId === h.id) || 0, [
    H,
    h.id
  ]), Li = ot.useMemo(() => {
    var Tt;
    return (Tt = h.closeButton) != null ? Tt : w;
  }, [
    h.closeButton,
    w
  ]), Tn = ot.useMemo(() => h.duration || tt || Iv, [
    h.duration,
    tt
  ]), ba = ot.useRef(0), dn = ot.useRef(0), ml = ot.useRef(0), hn = ot.useRef(null), [gl, ni] = ct.split("-"), La = ot.useMemo(() => H.reduce((Tt, ue, ie) => ie >= ya ? Tt : Tt + ue.height, 0), [
    H,
    ya
  ]), Va = bw(), mn = ot.useMemo(() => {
    var Tt;
    return (Tt = l.swipeDirections) != null ? Tt : Hw(ct);
  }, [
    l.swipeDirections,
    ct
  ]), Ye = h.invert || _, vl = ge === "loading";
  dn.current = ot.useMemo(() => ya * I + La, [
    ya,
    La
  ]), ot.useEffect(() => {
    ee.current = Tn;
  }, [
    Tn
  ]), ot.useEffect(() => {
    A(!0);
  }, []), ot.useEffect(() => {
    const Tt = me.current;
    if (Tt) {
      const ue = Tt.getBoundingClientRect().height;
      return Ne(ue), O((ie) => [
        {
          toastId: h.id,
          height: ue,
          position: h.position
        },
        ...ie
      ]), () => O((ie) => ie.filter((Xt) => Xt.toastId !== h.id));
    }
  }, [
    O,
    h.id
  ]), ot.useLayoutEffect(() => {
    if (!re) return;
    const Tt = me.current, ue = Tt.style.height;
    Tt.style.height = "auto";
    const ie = Tt.getBoundingClientRect().height;
    Tt.style.height = ue, Ne(ie), O((Xt) => Xt.find((Ut) => Ut.toastId === h.id) ? Xt.map((Ut) => Ut.toastId === h.id ? {
      ...Ut,
      height: ie
    } : Ut) : [
      {
        toastId: h.id,
        height: ie,
        position: h.position
      },
      ...Xt
    ]);
  }, [
    re,
    h.title,
    h.description,
    O,
    h.id,
    h.jsx,
    h.action,
    h.cancel
  ]);
  const ke = ot.useCallback(() => {
    P(!0), kn(dn.current), O((Tt) => Tt.filter((ue) => ue.toastId !== h.id)), setTimeout(() => {
      B(h);
    }, jw);
  }, [
    h,
    B,
    O,
    dn
  ]);
  ot.useEffect(() => {
    if (h.promise && ge === "loading" || h.duration === 1 / 0 || h.type === "loading") return;
    let Tt;
    return Q || R || Va ? (() => {
      if (ml.current < ba.current) {
        const Xt = (/* @__PURE__ */ new Date()).getTime() - ba.current;
        ee.current = ee.current - Xt;
      }
      ml.current = (/* @__PURE__ */ new Date()).getTime();
    })() : ee.current !== 1 / 0 && (ba.current = (/* @__PURE__ */ new Date()).getTime(), Tt = setTimeout(() => {
      h.onAutoClose == null || h.onAutoClose.call(h, h), ke();
    }, ee.current)), () => clearTimeout(Tt);
  }, [
    Q,
    R,
    h,
    ge,
    Va,
    ke
  ]), ot.useEffect(() => {
    h.delete && (ke(), h.onDismiss == null || h.onDismiss.call(h, h));
  }, [
    ke,
    h.delete
  ]);
  function Ya() {
    var Tt;
    if (nt?.loading) {
      var ue;
      return /* @__PURE__ */ ot.createElement("div", {
        className: Ra(Z?.loader, h == null || (ue = h.classNames) == null ? void 0 : ue.loader, "sonner-loader"),
        "data-visible": ge === "loading"
      }, nt.loading);
    }
    return /* @__PURE__ */ ot.createElement(hw, {
      className: Ra(Z?.loader, h == null || (Tt = h.classNames) == null ? void 0 : Tt.loader),
      visible: ge === "loading"
    });
  }
  const $e = h.icon || nt?.[ge] || fw(ge);
  var ai, pl;
  return /* @__PURE__ */ ot.createElement("li", {
    tabIndex: 0,
    ref: me,
    className: Ra(lt, ei, Z?.toast, h == null || (r = h.classNames) == null ? void 0 : r.toast, Z?.[aa], h == null || (s = h.classNames) == null ? void 0 : s[aa]),
    "data-sonner-toast": "",
    "data-rich-colors": (ai = h.richColors) != null ? ai : p,
    "data-styled": !(h.jsx || h.unstyled || E),
    "data-mounted": re,
    "data-promise": !!h.promise,
    "data-swiped": ut,
    "data-removed": z,
    "data-visible": Gn,
    "data-y-position": gl,
    "data-x-position": ni,
    "data-index": D,
    "data-front": qn,
    "data-swiping": it,
    "data-dismissible": nn,
    "data-type": ge,
    "data-invert": Ye,
    "data-swipe-out": st,
    "data-swipe-direction": Vt,
    "data-expanded": !!(Q || vt && re),
    "data-testid": h.testId,
    style: {
      "--index": D,
      "--toasts-before": D,
      "--z-index": X.length - D,
      "--offset": `${z ? he : dn.current}px`,
      "--initial-height": vt ? "auto" : `${xe}px`,
      ...C,
      ...h.style
    },
    onDragEnd: () => {
      bt(!1), mt(null), hn.current = null;
    },
    onPointerDown: (Tt) => {
      Tt.button !== 2 && (vl || !nn || (Gt.current = /* @__PURE__ */ new Date(), kn(dn.current), Tt.target.setPointerCapture(Tt.pointerId), Tt.target.tagName !== "BUTTON" && (bt(!0), hn.current = {
        x: Tt.clientX,
        y: Tt.clientY
      })));
    },
    onPointerUp: () => {
      var Tt, ue, ie;
      if (st || !nn) return;
      hn.current = null;
      const Xt = Number(((Tt = me.current) == null ? void 0 : Tt.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), ne = Number(((ue = me.current) == null ? void 0 : ue.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), Ut = (/* @__PURE__ */ new Date()).getTime() - ((ie = Gt.current) == null ? void 0 : ie.getTime()), ye = ft === "x" ? Xt : ne, De = Math.abs(ye) / Ut;
      if ((ft === "x" ? mn.includes(Xt > 0 ? "right" : "left") : mn.includes(ne > 0 ? "bottom" : "top")) && (Math.abs(ye) >= Mw || De > 0.11)) {
        kn(dn.current), h.onDismiss == null || h.onDismiss.call(h, h), $t(ft === "x" ? Xt > 0 ? "right" : "left" : ne > 0 ? "down" : "up"), ke(), St(!0);
        return;
      } else {
        var Ee, gn;
        (Ee = me.current) == null || Ee.style.setProperty("--swipe-amount-x", "0px"), (gn = me.current) == null || gn.style.setProperty("--swipe-amount-y", "0px");
      }
      gt(!1), bt(!1), mt(null);
    },
    onPointerMove: (Tt) => {
      var ue, ie, Xt;
      if (!hn.current || !nn || ((ue = window.getSelection()) == null ? void 0 : ue.toString().length) > 0) return;
      const Ut = Tt.clientY - hn.current.y, ye = Tt.clientX - hn.current.x;
      !ft && (Math.abs(ye) > 1 || Math.abs(Ut) > 1) && mt(Math.abs(ye) > Math.abs(Ut) ? "x" : "y");
      let De = {
        x: 0,
        y: 0
      };
      const Xn = (Ee) => 1 / (1.5 + Math.abs(Ee) / 20);
      if (ft === "y") {
        if (mn.includes("top") || mn.includes("bottom"))
          if (mn.includes("top") && Ut < 0 || mn.includes("bottom") && Ut > 0)
            De.y = Ut;
          else {
            const Ee = Ut * Xn(Ut);
            De.y = Math.abs(Ee) < Math.abs(Ut) ? Ee : Ut;
          }
      } else if (ft === "x" && (mn.includes("left") || mn.includes("right")))
        if (mn.includes("left") && ye < 0 || mn.includes("right") && ye > 0)
          De.x = ye;
        else {
          const Ee = ye * Xn(ye);
          De.x = Math.abs(Ee) < Math.abs(ye) ? Ee : ye;
        }
      (Math.abs(De.x) > 0 || Math.abs(De.y) > 0) && gt(!0), (ie = me.current) == null || ie.style.setProperty("--swipe-amount-x", `${De.x}px`), (Xt = me.current) == null || Xt.style.setProperty("--swipe-amount-y", `${De.y}px`);
    }
  }, Li && !h.jsx && ge !== "loading" ? /* @__PURE__ */ ot.createElement("button", {
    "aria-label": et,
    "data-disabled": vl,
    "data-close-button": !0,
    onClick: vl || !nn ? () => {
    } : () => {
      ke(), h.onDismiss == null || h.onDismiss.call(h, h);
    },
    className: Ra(Z?.closeButton, h == null || (u = h.classNames) == null ? void 0 : u.closeButton)
  }, (pl = nt?.close) != null ? pl : yw) : null, (ge || h.icon || h.promise) && h.icon !== null && (nt?.[ge] !== null || h.icon) ? /* @__PURE__ */ ot.createElement("div", {
    "data-icon": "",
    className: Ra(Z?.icon, h == null || (f = h.classNames) == null ? void 0 : f.icon)
  }, ge === "loading" ? h.icon || Ya() : h.promise ? Ya() : null, ge !== "loading" ? $e : null) : null, /* @__PURE__ */ ot.createElement("div", {
    "data-content": "",
    className: Ra(Z?.content, h == null || (d = h.classNames) == null ? void 0 : d.content)
  }, /* @__PURE__ */ ot.createElement("div", {
    "data-title": "",
    className: Ra(Z?.title, h == null || (m = h.classNames) == null ? void 0 : m.title)
  }, h.jsx ? h.jsx : typeof h.title == "function" ? h.title() : h.title), h.description ? /* @__PURE__ */ ot.createElement("div", {
    "data-description": "",
    className: Ra(at, hl, Z?.description, h == null || (v = h.classNames) == null ? void 0 : v.description)
  }, typeof h.description == "function" ? h.description() : h.description) : null), /* @__PURE__ */ ot.isValidElement(h.cancel) ? h.cancel : h.cancel && bu(h.cancel) ? /* @__PURE__ */ ot.createElement("button", {
    "data-button": !0,
    "data-cancel": !0,
    style: h.cancelButtonStyle || k,
    onClick: (Tt) => {
      bu(h.cancel) && nn && (h.cancel.onClick == null || h.cancel.onClick.call(h.cancel, Tt), ke());
    },
    className: Ra(Z?.cancelButton, h == null || (b = h.classNames) == null ? void 0 : b.cancelButton)
  }, h.cancel.label) : null, /* @__PURE__ */ ot.isValidElement(h.action) ? h.action : h.action && bu(h.action) ? /* @__PURE__ */ ot.createElement("button", {
    "data-button": !0,
    "data-action": !0,
    style: h.actionButtonStyle || K,
    onClick: (Tt) => {
      bu(h.action) && (h.action.onClick == null || h.action.onClick.call(h.action, Tt), !Tt.defaultPrevented && ke());
    },
    className: Ra(Z?.actionButton, h == null || (x = h.classNames) == null ? void 0 : x.actionButton)
  }, h.action.label) : null);
};
function Jv() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const l = document.documentElement.getAttribute("dir");
  return l === "auto" || !l ? window.getComputedStyle(document.documentElement).direction : l;
}
function Bw(l, r) {
  const s = {};
  return [
    l,
    r
  ].forEach((u, f) => {
    const d = f === 1, m = d ? "--mobile-offset" : "--offset", v = d ? Dw : Nw;
    function b(x) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((_) => {
        s[`${m}-${_}`] = typeof x == "number" ? `${x}px` : x;
      });
    }
    typeof u == "number" || typeof u == "string" ? b(u) : typeof u == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((x) => {
      u[x] === void 0 ? s[`${m}-${x}`] = v : s[`${m}-${x}`] = typeof u[x] == "number" ? `${u[x]}px` : u[x];
    }) : b(v);
  }), s;
}
const Lw = /* @__PURE__ */ ot.forwardRef(function(r, s) {
  const { id: u, invert: f, position: d = "bottom-right", hotkey: m = [
    "altKey",
    "KeyT"
  ], expand: v, closeButton: b, className: x, offset: _, mobileOffset: h, theme: E = "light", richColors: R, duration: O, style: M, visibleToasts: H = Ow, toastOptions: D, dir: X = Jv(), gap: Q = zw, icons: B, customAriaLabel: p, containerAriaLabel: w = "Notifications" } = r, [C, k] = ot.useState([]), K = ot.useMemo(() => u ? C.filter((A) => A.toasterId === u) : C.filter((A) => !A.toasterId), [
    C,
    u
  ]), lt = ot.useMemo(() => Array.from(new Set([
    d
  ].concat(K.filter((A) => A.position).map((A) => A.position)))), [
    K,
    d
  ]), [at, tt] = ot.useState([]), [ct, I] = ot.useState(!1), [vt, Z] = ot.useState(!1), [nt, et] = ot.useState(E !== "system" ? E : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), ft = ot.useRef(null), mt = m.join("+").replace(/Key/g, "").replace(/Digit/g, ""), Vt = ot.useRef(null), $t = ot.useRef(!1), re = ot.useCallback((A) => {
    k((z) => {
      var P;
      return (P = z.find((it) => it.id === A.id)) != null && P.delete || En.dismiss(A.id), z.filter(({ id: it }) => it !== A.id);
    });
  }, []);
  return ot.useEffect(() => En.subscribe((A) => {
    if (A.dismiss) {
      requestAnimationFrame(() => {
        k((z) => z.map((P) => P.id === A.id ? {
          ...P,
          delete: !0
        } : P));
      });
      return;
    }
    setTimeout(() => {
      bS.flushSync(() => {
        k((z) => {
          const P = z.findIndex((it) => it.id === A.id);
          return P !== -1 ? [
            ...z.slice(0, P),
            {
              ...z[P],
              ...A
            },
            ...z.slice(P + 1)
          ] : [
            A,
            ...z
          ];
        });
      });
    });
  }), []), ot.useEffect(() => {
    if (E !== "system") {
      et(E);
      return;
    }
    if (E === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? et("dark") : et("light")), typeof window > "u") return;
    const A = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      A.addEventListener("change", ({ matches: z }) => {
        et(z ? "dark" : "light");
      });
    } catch {
      A.addListener(({ matches: P }) => {
        try {
          et(P ? "dark" : "light");
        } catch (it) {
          console.error(it);
        }
      });
    }
  }, [
    E
  ]), ot.useEffect(() => {
    C.length <= 1 && I(!1);
  }, [
    C
  ]), ot.useEffect(() => {
    const A = (z) => {
      var P;
      if (m.length > 0 && m.every((st) => z[st] || z.code === st)) {
        var bt;
        I(!0), (bt = ft.current) == null || bt.focus();
      }
      z.code === "Escape" && (document.activeElement === ft.current || (P = ft.current) != null && P.contains(document.activeElement)) && I(!1);
    };
    return document.addEventListener("keydown", A), () => document.removeEventListener("keydown", A);
  }, [
    m
  ]), ot.useEffect(() => {
    if (ft.current)
      return () => {
        Vt.current && (Vt.current.focus({
          preventScroll: !0
        }), Vt.current = null, $t.current = !1);
      };
  }, [
    ft.current
  ]), // Remove item from normal navigation flow, only available via hotkey
  /* @__PURE__ */ ot.createElement("section", {
    ref: s,
    "aria-label": p ?? `${w} ${mt}`,
    tabIndex: -1,
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-atomic": "false",
    suppressHydrationWarning: !0,
    "data-react-aria-top-layer": !0
  }, lt.map((A, z) => {
    var P;
    const [it, bt] = A.split("-");
    return K.length ? /* @__PURE__ */ ot.createElement("ol", {
      key: A,
      dir: X === "auto" ? Jv() : X,
      tabIndex: -1,
      ref: ft,
      className: x,
      "data-sonner-toaster": !0,
      "data-sonner-theme": nt,
      "data-y-position": it,
      "data-x-position": bt,
      style: {
        "--front-toast-height": `${((P = at[0]) == null ? void 0 : P.height) || 0}px`,
        "--width": `${Rw}px`,
        "--gap": `${Q}px`,
        ...M,
        ...Bw(_, h)
      },
      onBlur: (st) => {
        $t.current && !st.currentTarget.contains(st.relatedTarget) && ($t.current = !1, Vt.current && (Vt.current.focus({
          preventScroll: !0
        }), Vt.current = null));
      },
      onFocus: (st) => {
        st.target instanceof HTMLElement && st.target.dataset.dismissible === "false" || $t.current || ($t.current = !0, Vt.current = st.relatedTarget);
      },
      onMouseEnter: () => I(!0),
      onMouseMove: () => I(!0),
      onMouseLeave: () => {
        vt || I(!1);
      },
      onDragEnd: () => I(!1),
      onPointerDown: (st) => {
        st.target instanceof HTMLElement && st.target.dataset.dismissible === "false" || Z(!0);
      },
      onPointerUp: () => Z(!1)
    }, K.filter((st) => !st.position && z === 0 || st.position === A).map((st, St) => {
      var ut, gt;
      return /* @__PURE__ */ ot.createElement(Uw, {
        key: st.id,
        icons: B,
        index: St,
        toast: st,
        defaultRichColors: R,
        duration: (ut = D?.duration) != null ? ut : O,
        className: D?.className,
        descriptionClassName: D?.descriptionClassName,
        invert: f,
        visibleToasts: H,
        closeButton: (gt = D?.closeButton) != null ? gt : b,
        interacting: vt,
        position: A,
        style: D?.style,
        unstyled: D?.unstyled,
        classNames: D?.classNames,
        cancelButtonStyle: D?.cancelButtonStyle,
        actionButtonStyle: D?.actionButtonStyle,
        closeButtonAriaLabel: D?.closeButtonAriaLabel,
        removeToast: re,
        toasts: K.filter((he) => he.position == st.position),
        heights: at.filter((he) => he.position == st.position),
        setHeights: tt,
        expandByDefault: v,
        gap: Q,
        expanded: ct,
        swipeDirections: r.swipeDirections
      });
    })) : null;
  }));
}), Vw = ({ ...l }) => {
  const { theme: r = "system" } = uw();
  return /* @__PURE__ */ y.jsx(
    Lw,
    {
      theme: r,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ y.jsx(z1, { className: "size-4" }),
        info: /* @__PURE__ */ y.jsx(M1, { className: "size-4" }),
        warning: /* @__PURE__ */ y.jsx(q1, { className: "size-4" }),
        error: /* @__PURE__ */ y.jsx(B1, { className: "size-4" }),
        loading: /* @__PURE__ */ y.jsx(j1, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      toastOptions: {
        classNames: {
          toast: "cn-toast"
        }
      },
      ...l
    }
  );
};
function M2({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(bE, { "data-slot": "alert-dialog", ...l });
}
function Yw({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(SE, { container: document.getElementById("manager-root") || document.getElementById("support-root"), "data-slot": "alert-dialog-portal", ...l });
}
function kw({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    xE,
    {
      "data-slot": "alert-dialog-overlay",
      className: At(
        "fixed inset-0 z-50 bg-black/10 duration-100  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        l
      ),
      ...r
    }
  );
}
function j2({
  className: l,
  size: r = "default",
  ...s
}) {
  return /* @__PURE__ */ y.jsxs(Yw, { children: [
    /* @__PURE__ */ y.jsx(kw, {}),
    /* @__PURE__ */ y.jsx(
      EE,
      {
        "data-slot": "alert-dialog-content",
        "data-size": r,
        className: At(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          l
        ),
        ...s
      }
    )
  ] });
}
function H2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: At(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        l
      ),
      ...r
    }
  );
}
function U2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: At(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        l
      ),
      ...r
    }
  );
}
function B2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    wE,
    {
      "data-slot": "alert-dialog-title",
      className: At(
        "text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        l
      ),
      ...r
    }
  );
}
function L2({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    CE,
    {
      "data-slot": "alert-dialog-description",
      className: At(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        l
      ),
      ...r
    }
  );
}
function V2({
  className: l,
  variant: r = "default",
  size: s = "default",
  ...u
}) {
  return /* @__PURE__ */ y.jsx(Ve, { variant: r, size: s, asChild: !0, children: /* @__PURE__ */ y.jsx(
    _E,
    {
      "data-slot": "alert-dialog-action",
      className: At(l),
      ...u
    }
  ) });
}
function Y2({
  className: l,
  variant: r = "outline",
  size: s = "default",
  ...u
}) {
  return /* @__PURE__ */ y.jsx(Ve, { variant: r, size: s, asChild: !0, children: /* @__PURE__ */ y.jsx(
    TE,
    {
      "data-slot": "alert-dialog-cancel",
      className: At(l),
      ...u
    }
  ) });
}
function qw(l, r) {
  const s = Math.max(1, Math.ceil(r / 30));
  return [.../* @__PURE__ */ new Set([0, s - 1, l - 1, l, l + 1])].filter((f) => f >= 0 && f < s).sort((f, d) => f - d);
}
function k2({ page: l, total: r, onChange: s, busy: u = !1 }) {
  const f = qw(l, r), d = Math.max(1, Math.ceil(r / 30));
  return /* @__PURE__ */ y.jsxs("nav", { "aria-label": "Phân trang", className: "flex flex-wrap items-center gap-1", children: [
    /* @__PURE__ */ y.jsx(Ve, { variant: "outline", size: "sm", disabled: u || l === 0, onClick: () => s(l - 1), "aria-label": "Trang trước", children: "‹" }),
    f.map((m, v) => /* @__PURE__ */ y.jsxs("span", { className: "flex items-center gap-1", children: [
      v > 0 && m > f[v - 1] + 1 && /* @__PURE__ */ y.jsx("span", { "aria-hidden": !0, className: "px-2", children: "…" }),
      /* @__PURE__ */ y.jsx(Ve, { size: "sm", variant: m === l ? "default" : "outline", "aria-current": m === l ? "page" : void 0, "aria-label": "Trang " + (m + 1), disabled: u, onClick: () => s(m), children: m + 1 })
    ] }, m)),
    /* @__PURE__ */ y.jsx(Ve, { variant: "outline", size: "sm", disabled: u || l >= d - 1, onClick: () => s(l + 1), "aria-label": "Trang sau", children: "›" })
  ] });
}
var Lr = { exports: {} }, Gw = Lr.exports, Fv;
function Xw() {
  return Fv || (Fv = 1, (function(l, r) {
    (function(s, u) {
      u(r);
    })(Gw, (function(s) {
      function u(B, p) {
        B.terminate = function() {
          const w = () => {
          };
          this.onerror = w, this.onmessage = w, this.onopen = w;
          const C = /* @__PURE__ */ new Date(), k = Math.random().toString().substring(2, 8), K = this.onclose;
          this.onclose = (lt) => {
            const at = (/* @__PURE__ */ new Date()).getTime() - C.getTime();
            p(`Discarded socket (#${k})  closed after ${at}ms, with code/reason: ${lt.code}/${lt.reason}`);
          }, this.close(), K?.call(B, {
            code: 4001,
            reason: `Quick discarding socket (#${k}) without waiting for the shutdown sequence.`,
            wasClean: !1
          });
        };
      }
      const f = {
        // LINEFEED byte (octet 10)
        LF: `
`,
        // NULL byte (octet 0)
        NULL: "\0"
      };
      class d {
        /**
         * body of the frame
         */
        get body() {
          return !this._body && this.isBinaryBody && (this._body = new TextDecoder().decode(this._binaryBody)), this._body || "";
        }
        /**
         * body as Uint8Array
         */
        get binaryBody() {
          return !this._binaryBody && !this.isBinaryBody && (this._binaryBody = new TextEncoder().encode(this._body)), this._binaryBody;
        }
        /**
         * Frame constructor. `command`, `headers` and `body` are available as properties.
         *
         * @internal
         */
        constructor(p) {
          const { command: w, headers: C, body: k, binaryBody: K, escapeHeaderValues: lt, skipContentLengthHeader: at } = p;
          this.command = w, this.headers = Object.assign({}, C || {}), K ? (this._binaryBody = K, this.isBinaryBody = !0) : (this._body = k || "", this.isBinaryBody = !1), this.escapeHeaderValues = lt || !1, this.skipContentLengthHeader = at || !1;
        }
        /**
         * deserialize a STOMP Frame from raw data.
         *
         * @internal
         */
        static fromRawFrame(p, w) {
          const C = {}, k = (K) => K.replace(/^\s+|\s+$/g, "");
          for (const K of p.headers.reverse()) {
            K.indexOf(":");
            const lt = k(K[0]);
            let at = k(K[1]);
            w && p.command !== "CONNECT" && p.command !== "CONNECTED" && (at = d.hdrValueUnEscape(at)), C[lt] = at;
          }
          return new d({
            command: p.command,
            headers: C,
            binaryBody: p.binaryBody,
            escapeHeaderValues: w
          });
        }
        /**
         * @internal
         */
        toString() {
          return this.serializeCmdAndHeaders();
        }
        /**
         * serialize this Frame in a format suitable to be passed to WebSocket.
         * If the body is string the output will be string.
         * If the body is binary (i.e. of type Unit8Array) it will be serialized to ArrayBuffer.
         *
         * @internal
         */
        serialize() {
          const p = this.serializeCmdAndHeaders();
          return this.isBinaryBody ? d.toUnit8Array(p, this._binaryBody).buffer : p + this._body + f.NULL;
        }
        serializeCmdAndHeaders() {
          const p = [this.command];
          this.skipContentLengthHeader && delete this.headers["content-length"];
          for (const w of Object.keys(this.headers || {})) {
            const C = this.headers[w];
            this.escapeHeaderValues && this.command !== "CONNECT" && this.command !== "CONNECTED" ? p.push(`${w}:${d.hdrValueEscape(`${C}`)}`) : p.push(`${w}:${C}`);
          }
          return (this.isBinaryBody || !this.isBodyEmpty() && !this.skipContentLengthHeader) && p.push(`content-length:${this.bodyLength()}`), p.join(f.LF) + f.LF + f.LF;
        }
        isBodyEmpty() {
          return this.bodyLength() === 0;
        }
        bodyLength() {
          const p = this.binaryBody;
          return p ? p.length : 0;
        }
        /**
         * Compute the size of a UTF-8 string by counting its number of bytes
         * (and not the number of characters composing the string)
         */
        static sizeOfUTF8(p) {
          return p ? new TextEncoder().encode(p).length : 0;
        }
        static toUnit8Array(p, w) {
          const C = new TextEncoder().encode(p), k = new Uint8Array([0]), K = new Uint8Array(C.length + w.length + k.length);
          return K.set(C), K.set(w, C.length), K.set(k, C.length + w.length), K;
        }
        /**
         * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
         *
         * @internal
         */
        static marshall(p) {
          return new d(p).serialize();
        }
        /**
         *  Escape header values
         */
        static hdrValueEscape(p) {
          return p.replace(/\\/g, "\\\\").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/:/g, "\\c");
        }
        /**
         * UnEscape header values
         */
        static hdrValueUnEscape(p) {
          return p.replace(/\\r/g, "\r").replace(/\\n/g, `
`).replace(/\\c/g, ":").replace(/\\\\/g, "\\");
        }
      }
      const m = 0, v = 10, b = 13, x = 58;
      class _ {
        constructor(p, w) {
          this.onFrame = p, this.onIncomingPing = w, this._encoder = new TextEncoder(), this._decoder = new TextDecoder(), this._token = [], this._initState();
        }
        parseChunk(p, w = !1) {
          let C;
          if (typeof p == "string" ? C = this._encoder.encode(p) : C = new Uint8Array(p), w && C[C.length - 1] !== 0) {
            const k = new Uint8Array(C.length + 1);
            k.set(C, 0), k[C.length] = 0, C = k;
          }
          for (let k = 0; k < C.length; k++) {
            const K = C[k];
            this._onByte(K);
          }
        }
        // The following implements a simple Rec Descent Parser.
        // The grammar is simple and just one byte tells what should be the next state
        _collectFrame(p) {
          if (p !== m && p !== b) {
            if (p === v) {
              this.onIncomingPing();
              return;
            }
            this._onByte = this._collectCommand, this._reinjectByte(p);
          }
        }
        _collectCommand(p) {
          if (p !== b) {
            if (p === v) {
              this._results.command = this._consumeTokenAsUTF8(), this._onByte = this._collectHeaders;
              return;
            }
            this._consumeByte(p);
          }
        }
        _collectHeaders(p) {
          if (p !== b) {
            if (p === v) {
              this._setupCollectBody();
              return;
            }
            this._onByte = this._collectHeaderKey, this._reinjectByte(p);
          }
        }
        _reinjectByte(p) {
          this._onByte(p);
        }
        _collectHeaderKey(p) {
          if (p === x) {
            this._headerKey = this._consumeTokenAsUTF8(), this._onByte = this._collectHeaderValue;
            return;
          }
          this._consumeByte(p);
        }
        _collectHeaderValue(p) {
          if (p !== b) {
            if (p === v) {
              this._results.headers.push([
                this._headerKey,
                this._consumeTokenAsUTF8()
              ]), this._headerKey = void 0, this._onByte = this._collectHeaders;
              return;
            }
            this._consumeByte(p);
          }
        }
        _setupCollectBody() {
          const p = this._results.headers.filter((w) => w[0] === "content-length")[0];
          p ? (this._bodyBytesRemaining = parseInt(p[1], 10), this._onByte = this._collectBodyFixedSize) : this._onByte = this._collectBodyNullTerminated;
        }
        _collectBodyNullTerminated(p) {
          if (p === m) {
            this._retrievedBody();
            return;
          }
          this._consumeByte(p);
        }
        _collectBodyFixedSize(p) {
          if (this._bodyBytesRemaining-- === 0) {
            this._retrievedBody();
            return;
          }
          this._consumeByte(p);
        }
        _retrievedBody() {
          this._results.binaryBody = this._consumeTokenAsRaw();
          try {
            this.onFrame(this._results);
          } catch (p) {
            console.log("Ignoring an exception thrown by a frame handler. Original exception: ", p);
          }
          this._initState();
        }
        // Rec Descent Parser helpers
        _consumeByte(p) {
          this._token.push(p);
        }
        _consumeTokenAsUTF8() {
          return this._decoder.decode(this._consumeTokenAsRaw());
        }
        _consumeTokenAsRaw() {
          const p = new Uint8Array(this._token);
          return this._token = [], p;
        }
        _initState() {
          this._results = {
            command: void 0,
            headers: [],
            binaryBody: void 0
          }, this._token = [], this._headerKey = void 0, this._onByte = this._collectFrame;
        }
      }
      s.StompSocketState = void 0, (function(B) {
        B[B.CONNECTING = 0] = "CONNECTING", B[B.OPEN = 1] = "OPEN", B[B.CLOSING = 2] = "CLOSING", B[B.CLOSED = 3] = "CLOSED";
      })(s.StompSocketState || (s.StompSocketState = {})), s.ActivationState = void 0, (function(B) {
        B[B.ACTIVE = 0] = "ACTIVE", B[B.DEACTIVATING = 1] = "DEACTIVATING", B[B.INACTIVE = 2] = "INACTIVE";
      })(s.ActivationState || (s.ActivationState = {})), s.ReconnectionTimeMode = void 0, (function(B) {
        B[B.LINEAR = 0] = "LINEAR", B[B.EXPONENTIAL = 1] = "EXPONENTIAL";
      })(s.ReconnectionTimeMode || (s.ReconnectionTimeMode = {})), s.TickerStrategy = void 0, (function(B) {
        B.Interval = "interval", B.Worker = "worker";
      })(s.TickerStrategy || (s.TickerStrategy = {}));
      class h {
        constructor(p, w = s.TickerStrategy.Interval, C) {
          this._interval = p, this._strategy = w, this._debug = C, this._workerScript = `
    var startTime = Date.now();
    setInterval(function() {
        self.postMessage(Date.now() - startTime);
    }, ${this._interval});
  `;
        }
        start(p) {
          this.stop(), this.shouldUseWorker() ? this.runWorker(p) : this.runInterval(p);
        }
        stop() {
          this.disposeWorker(), this.disposeInterval();
        }
        shouldUseWorker() {
          return typeof Worker < "u" && this._strategy === s.TickerStrategy.Worker;
        }
        runWorker(p) {
          this._debug("Using runWorker for outgoing pings"), this._worker || (this._worker = new Worker(URL.createObjectURL(new Blob([this._workerScript], { type: "text/javascript" }))), this._worker.onmessage = (w) => p(w.data));
        }
        runInterval(p) {
          if (this._debug("Using runInterval for outgoing pings"), !this._timer) {
            const w = Date.now();
            this._timer = setInterval(() => {
              p(Date.now() - w);
            }, this._interval);
          }
        }
        disposeWorker() {
          this._worker && (this._worker.terminate(), delete this._worker, this._debug("Outgoing ping disposeWorker"));
        }
        disposeInterval() {
          this._timer && (clearInterval(this._timer), delete this._timer, this._debug("Outgoing ping disposeInterval"));
        }
      }
      class E {
        /**
         * Takes an array of versions, typical elements '1.2', '1.1', or '1.0'
         *
         * You will be creating an instance of this class if you want to override
         * supported versions to be declared during STOMP handshake.
         */
        constructor(p) {
          this.versions = p;
        }
        /**
         * Used as part of CONNECT STOMP Frame
         */
        supportedVersions() {
          return this.versions.join(",");
        }
        /**
         * Used while creating a WebSocket
         */
        protocolVersions() {
          return this.versions.map((p) => `v${p.replace(".", "")}.stomp`);
        }
      }
      E.V1_0 = "1.0", E.V1_1 = "1.1", E.V1_2 = "1.2", E.default = new E([
        E.V1_2,
        E.V1_1,
        E.V1_0
      ]);
      class R {
        get connectedVersion() {
          return this._connectedVersion;
        }
        get connected() {
          return this._connected;
        }
        constructor(p, w, C) {
          this._client = p, this._webSocket = w, this._connected = !1, this._serverFrameHandlers = {
            // [CONNECTED Frame](https://stomp.github.com/stomp-specification-1.2.html#CONNECTED_Frame)
            CONNECTED: (k) => {
              this.debug(`connected to server ${k.headers.server}`), this._connected = !0, this._connectedVersion = k.headers.version, this._connectedVersion === E.V1_2 && (this._escapeHeaderValues = !0), this._setupHeartbeat(k.headers), this.onConnect(k);
            },
            // [MESSAGE Frame](https://stomp.github.com/stomp-specification-1.2.html#MESSAGE)
            MESSAGE: (k) => {
              const K = k.headers.subscription, lt = this._subscriptions[K] || this.onUnhandledMessage, at = k, tt = this, ct = this._connectedVersion === E.V1_2 ? at.headers.ack : at.headers["message-id"];
              at.ack = (I = {}) => tt.ack(ct, K, I), at.nack = (I = {}) => tt.nack(ct, K, I), lt(at);
            },
            // [RECEIPT Frame](https://stomp.github.com/stomp-specification-1.2.html#RECEIPT)
            RECEIPT: (k) => {
              const K = this._receiptWatchers[k.headers["receipt-id"]];
              K ? (K(k), delete this._receiptWatchers[k.headers["receipt-id"]]) : this.onUnhandledReceipt(k);
            },
            // [ERROR Frame](https://stomp.github.com/stomp-specification-1.2.html#ERROR)
            ERROR: (k) => {
              this.onStompError(k);
            }
          }, this._counter = 0, this._subscriptions = {}, this._receiptWatchers = {}, this._partialData = "", this._escapeHeaderValues = !1, this._lastServerActivityTS = Date.now(), this.debug = C.debug, this.stompVersions = C.stompVersions, this.connectHeaders = C.connectHeaders, this.disconnectHeaders = C.disconnectHeaders, this.heartbeatIncoming = C.heartbeatIncoming, this.heartbeatToleranceMultiplier = C.heartbeatGracePeriods, this.heartbeatOutgoing = C.heartbeatOutgoing, this.splitLargeFrames = C.splitLargeFrames, this.maxWebSocketChunkSize = C.maxWebSocketChunkSize, this.forceBinaryWSFrames = C.forceBinaryWSFrames, this.logRawCommunication = C.logRawCommunication, this.appendMissingNULLonIncoming = C.appendMissingNULLonIncoming, this.discardWebsocketOnCommFailure = C.discardWebsocketOnCommFailure, this.onConnect = C.onConnect, this.onDisconnect = C.onDisconnect, this.onStompError = C.onStompError, this.onWebSocketClose = C.onWebSocketClose, this.onWebSocketError = C.onWebSocketError, this.onUnhandledMessage = C.onUnhandledMessage, this.onUnhandledReceipt = C.onUnhandledReceipt, this.onUnhandledFrame = C.onUnhandledFrame, this.onHeartbeatReceived = C.onHeartbeatReceived, this.onHeartbeatLost = C.onHeartbeatLost;
        }
        start() {
          const p = new _(
            // On Frame
            (C) => {
              const k = d.fromRawFrame(C, this._escapeHeaderValues);
              this.logRawCommunication || this.debug(`<<< ${k}`), (this._serverFrameHandlers[k.command] || this.onUnhandledFrame)(k);
            },
            // On Incoming Ping
            () => {
              this.debug("<<< PONG"), this.onHeartbeatReceived();
            }
          );
          this._webSocket.onmessage = (C) => {
            if (this.debug("Received data"), this._lastServerActivityTS = Date.now(), this.logRawCommunication) {
              const k = C.data instanceof ArrayBuffer ? new TextDecoder().decode(C.data) : C.data;
              this.debug(`<<< ${k}`);
            }
            p.parseChunk(C.data, this.appendMissingNULLonIncoming);
          }, this._webSocket.onclose = (C) => {
            this.debug(`Connection closed to ${this._webSocket.url}`), this._cleanUp(), this.onWebSocketClose(C);
          }, this._webSocket.onerror = (C) => {
            this.onWebSocketError(C);
          };
          const w = () => {
            const C = Object.assign({}, this.connectHeaders);
            this.debug("Web Socket Opened..."), C["accept-version"] = this.stompVersions.supportedVersions(), C["heart-beat"] = [
              this.heartbeatOutgoing,
              this.heartbeatIncoming
            ].join(","), this._transmit({ command: "CONNECT", headers: C });
          };
          this._webSocket.readyState === s.StompSocketState.OPEN ? w() : this._webSocket.onopen = w;
        }
        _setupHeartbeat(p) {
          if (p.version !== E.V1_1 && p.version !== E.V1_2 || !p["heart-beat"])
            return;
          const [w, C] = p["heart-beat"].split(",").map((k) => parseInt(k, 10));
          if (this.heartbeatOutgoing !== 0 && C !== 0) {
            const k = Math.max(this.heartbeatOutgoing, C);
            this.debug(`send PING every ${k}ms`), this._pinger = new h(k, this._client.heartbeatStrategy, this.debug), this._pinger.start(() => {
              this._webSocket.readyState === s.StompSocketState.OPEN && (this._webSocket.send(f.LF), this.debug(">>> PING"));
            });
          }
          if (this.heartbeatIncoming !== 0 && w !== 0) {
            const k = Math.max(this.heartbeatIncoming, w);
            this.debug(`check PONG every ${k}ms`), this._ponger = setInterval(() => {
              const K = Date.now() - this._lastServerActivityTS;
              K > k * this.heartbeatToleranceMultiplier && (this.debug(`did not receive server activity for the last ${K}ms`), this.onHeartbeatLost(), this._closeOrDiscardWebsocket());
            }, k);
          }
        }
        _closeOrDiscardWebsocket() {
          this.discardWebsocketOnCommFailure ? (this.debug("Discarding websocket, the underlying socket may linger for a while"), this.discardWebsocket()) : (this.debug("Issuing close on the websocket"), this._closeWebsocket());
        }
        forceDisconnect() {
          this._webSocket && (this._webSocket.readyState === s.StompSocketState.CONNECTING || this._webSocket.readyState === s.StompSocketState.OPEN) && this._closeOrDiscardWebsocket();
        }
        _closeWebsocket() {
          this._webSocket.onmessage = () => {
          }, this._webSocket.close();
        }
        discardWebsocket() {
          typeof this._webSocket.terminate != "function" && u(this._webSocket, (p) => this.debug(p)), this._webSocket.terminate();
        }
        _transmit(p) {
          const { command: w, headers: C, body: k, binaryBody: K, skipContentLengthHeader: lt } = p, at = new d({
            command: w,
            headers: C,
            body: k,
            binaryBody: K,
            escapeHeaderValues: this._escapeHeaderValues,
            skipContentLengthHeader: lt
          });
          let tt = at.serialize();
          if (this.logRawCommunication ? this.debug(`>>> ${tt}`) : this.debug(`>>> ${at}`), this.forceBinaryWSFrames && typeof tt == "string" && (tt = new TextEncoder().encode(tt)), typeof tt != "string" || !this.splitLargeFrames)
            this._webSocket.send(tt);
          else {
            let ct = tt;
            for (; ct.length > 0; ) {
              const I = ct.substring(0, this.maxWebSocketChunkSize);
              ct = ct.substring(this.maxWebSocketChunkSize), this._webSocket.send(I), this.debug(`chunk sent = ${I.length}, remaining = ${ct.length}`);
            }
          }
        }
        dispose() {
          if (this.connected)
            try {
              const p = Object.assign({}, this.disconnectHeaders);
              p.receipt || (p.receipt = `close-${this._counter++}`), this.watchForReceipt(p.receipt, (w) => {
                this._closeWebsocket(), this._cleanUp(), this.onDisconnect(w);
              }), this._transmit({ command: "DISCONNECT", headers: p });
            } catch (p) {
              this.debug(`Ignoring error during disconnect ${p}`);
            }
          else
            (this._webSocket.readyState === s.StompSocketState.CONNECTING || this._webSocket.readyState === s.StompSocketState.OPEN) && this._closeWebsocket();
        }
        _cleanUp() {
          this._connected = !1, this._pinger && (this._pinger.stop(), this._pinger = void 0), this._ponger && (clearInterval(this._ponger), this._ponger = void 0);
        }
        publish(p) {
          const { destination: w, headers: C, body: k, binaryBody: K, skipContentLengthHeader: lt } = p, at = Object.assign({ destination: w }, C);
          this._transmit({
            command: "SEND",
            headers: at,
            body: k,
            binaryBody: K,
            skipContentLengthHeader: lt
          });
        }
        watchForReceipt(p, w) {
          this._receiptWatchers[p] = w;
        }
        subscribe(p, w, C = {}) {
          C = Object.assign({}, C), C.id || (C.id = `sub-${this._counter++}`), C.destination = p, this._subscriptions[C.id] = w, this._transmit({ command: "SUBSCRIBE", headers: C });
          const k = this;
          return {
            id: C.id,
            unsubscribe(K) {
              return k.unsubscribe(C.id, K);
            }
          };
        }
        unsubscribe(p, w = {}) {
          w = Object.assign({}, w), delete this._subscriptions[p], w.id = p, this._transmit({ command: "UNSUBSCRIBE", headers: w });
        }
        begin(p) {
          const w = p || `tx-${this._counter++}`;
          this._transmit({
            command: "BEGIN",
            headers: {
              transaction: w
            }
          });
          const C = this;
          return {
            id: w,
            commit() {
              C.commit(w);
            },
            abort() {
              C.abort(w);
            }
          };
        }
        commit(p) {
          this._transmit({
            command: "COMMIT",
            headers: {
              transaction: p
            }
          });
        }
        abort(p) {
          this._transmit({
            command: "ABORT",
            headers: {
              transaction: p
            }
          });
        }
        ack(p, w, C = {}) {
          C = Object.assign({}, C), this._connectedVersion === E.V1_2 ? C.id = p : C["message-id"] = p, C.subscription = w, this._transmit({ command: "ACK", headers: C });
        }
        nack(p, w, C = {}) {
          return C = Object.assign({}, C), this._connectedVersion === E.V1_2 ? C.id = p : C["message-id"] = p, C.subscription = w, this._transmit({ command: "NACK", headers: C });
        }
      }
      class O {
        /**
         * Provides access to the underlying WebSocket instance.
         * This property is **read-only**.
         *
         * Example:
         * ```javascript
         * const webSocket = client.webSocket;
         * if (webSocket) {
         *   console.log('WebSocket is connected:', webSocket.readyState === WebSocket.OPEN);
         * }
         * ```
         *
         * **Caution:**
         * Directly interacting with the WebSocket instance (e.g., sending or receiving frames)
         * can interfere with the proper functioning of this library. Such actions may cause
         * unexpected behavior, disconnections, or invalid state in the library's internal mechanisms.
         *
         * Instead, use the library's provided methods to manage STOMP communication.
         *
         * @returns The WebSocket instance used by the STOMP handler, or `undefined` if not connected.
         */
        get webSocket() {
          return this._stompHandler?._webSocket;
        }
        /**
         * Allows customization of the disconnection headers.
         *
         * Any changes made during an active session will also be applied immediately.
         *
         * Example:
         * ```javascript
         * client.disconnectHeaders = {
         *   receipt: 'custom-receipt-id'
         * };
         * ```
         */
        get disconnectHeaders() {
          return this._disconnectHeaders;
        }
        set disconnectHeaders(p) {
          this._disconnectHeaders = p, this._stompHandler && (this._stompHandler.disconnectHeaders = this._disconnectHeaders);
        }
        /**
         * Indicates whether there is an active connection to the STOMP broker.
         *
         * Usage:
         * ```javascript
         * if (client.connected) {
         *   console.log('Client is connected to the broker.');
         * } else {
         *   console.log('No connection to the broker.');
         * }
         * ```
         *
         * @returns `true` if the client is currently connected, `false` otherwise.
         */
        get connected() {
          return !!this._stompHandler && this._stompHandler.connected;
        }
        /**
         * The version of the STOMP protocol negotiated with the server during connection.
         *
         * This is a **read-only** property and reflects the negotiated protocol version after
         * a successful connection.
         *
         * Example:
         * ```javascript
         * console.log('Connected STOMP version:', client.connectedVersion);
         * ```
         *
         * @returns The negotiated STOMP protocol version or `undefined` if not connected.
         */
        get connectedVersion() {
          return this._stompHandler ? this._stompHandler.connectedVersion : void 0;
        }
        /**
         * Indicates whether the client is currently active.
         *
         * A client is considered active if it is connected or actively attempting to reconnect.
         *
         * Example:
         * ```javascript
         * if (client.active) {
         *   console.log('The client is active.');
         * } else {
         *   console.log('The client is inactive.');
         * }
         * ```
         *
         * @returns `true` if the client is active, otherwise `false`.
         */
        get active() {
          return this.state === s.ActivationState.ACTIVE;
        }
        _changeState(p) {
          this.state = p, this.onChangeState(p);
        }
        /**
         * Constructs a new STOMP client instance.
         *
         * The constructor initializes default values and sets up no-op callbacks for all events.
         * Configuration can be passed during construction, or updated later using `configure`.
         *
         * Example:
         * ```javascript
         * const client = new Client({
         *   brokerURL: 'wss://broker.example.com',
         *   reconnectDelay: 5000
         * });
         * ```
         *
         * @param conf Optional configuration object to initialize the client with.
         */
        constructor(p = {}) {
          this.stompVersions = E.default, this.connectionTimeout = 0, this.reconnectDelay = 5e3, this._nextReconnectDelay = 0, this.maxReconnectDelay = 900 * 1e3, this.reconnectTimeMode = s.ReconnectionTimeMode.LINEAR, this.heartbeatIncoming = 1e4, this.heartbeatToleranceMultiplier = 2, this.heartbeatOutgoing = 1e4, this.heartbeatStrategy = s.TickerStrategy.Interval, this.splitLargeFrames = !1, this.maxWebSocketChunkSize = 8 * 1024, this.forceBinaryWSFrames = !1, this.appendMissingNULLonIncoming = !1, this.discardWebsocketOnCommFailure = !1, this.state = s.ActivationState.INACTIVE;
          const w = () => {
          };
          this.debug = w, this.beforeConnect = w, this.onConnect = w, this.onDisconnect = w, this.onUnhandledMessage = w, this.onUnhandledReceipt = w, this.onUnhandledFrame = w, this.onHeartbeatReceived = w, this.onHeartbeatLost = w, this.onStompError = w, this.onWebSocketClose = w, this.onWebSocketError = w, this.logRawCommunication = !1, this.onChangeState = w, this.connectHeaders = {}, this._disconnectHeaders = {}, this.configure(p);
        }
        /**
         * Updates the client's configuration.
         *
         * All properties in the provided configuration object will override the current settings.
         *
         * Additionally, a warning is logged if `maxReconnectDelay` is configured to a
         * value lower than `reconnectDelay`, and `maxReconnectDelay` is adjusted to match `reconnectDelay`.
         *
         * Example:
         * ```javascript
         * client.configure({
         *   reconnectDelay: 3000,
         *   maxReconnectDelay: 10000
         * });
         * ```
         *
         * @param conf Configuration object containing the new settings.
         */
        configure(p) {
          Object.assign(this, p), this.maxReconnectDelay > 0 && this.maxReconnectDelay < this.reconnectDelay && (this.debug(`Warning: maxReconnectDelay (${this.maxReconnectDelay}ms) is less than reconnectDelay (${this.reconnectDelay}ms). Using reconnectDelay as the maxReconnectDelay delay.`), this.maxReconnectDelay = this.reconnectDelay);
        }
        /**
         * Activates the client, initiating a connection to the STOMP broker.
         *
         * On activation, the client attempts to connect and sets its state to `ACTIVE`. If the connection
         * is lost, it will automatically retry based on `reconnectDelay` or `maxReconnectDelay`. If
         * `reconnectTimeMode` is set to `EXPONENTIAL`, the reconnect delay increases exponentially.
         *
         * To stop reconnection attempts and disconnect, call [Client#deactivate]{@link Client#deactivate}.
         *
         * Example:
         * ```javascript
         * client.activate(); // Connect to the broker
         * ```
         *
         * If the client is currently `DEACTIVATING`, connection is delayed until the deactivation process completes.
         */
        activate() {
          const p = () => {
            if (this.active) {
              this.debug("Already ACTIVE, ignoring request to activate");
              return;
            }
            this._changeState(s.ActivationState.ACTIVE), this._nextReconnectDelay = this.reconnectDelay, this._connect();
          };
          this.state === s.ActivationState.DEACTIVATING ? (this.debug("Waiting for deactivation to finish before activating"), this.deactivate().then(() => {
            p();
          })) : p();
        }
        async _connect() {
          if (await this.beforeConnect(this), this._stompHandler) {
            this.debug("There is already a stompHandler, skipping the call to connect");
            return;
          }
          if (!this.active) {
            this.debug("Client has been marked inactive, will not attempt to connect");
            return;
          }
          this.connectionTimeout > 0 && (this._connectionWatcher && clearTimeout(this._connectionWatcher), this._connectionWatcher = setTimeout(() => {
            this.connected || (this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`), this.forceDisconnect());
          }, this.connectionTimeout)), this.debug("Opening Web Socket...");
          const p = this._createWebSocket();
          this._stompHandler = new R(this, p, {
            debug: this.debug,
            stompVersions: this.stompVersions,
            connectHeaders: this.connectHeaders,
            disconnectHeaders: this._disconnectHeaders,
            heartbeatIncoming: this.heartbeatIncoming,
            heartbeatGracePeriods: this.heartbeatToleranceMultiplier,
            heartbeatOutgoing: this.heartbeatOutgoing,
            heartbeatStrategy: this.heartbeatStrategy,
            splitLargeFrames: this.splitLargeFrames,
            maxWebSocketChunkSize: this.maxWebSocketChunkSize,
            forceBinaryWSFrames: this.forceBinaryWSFrames,
            logRawCommunication: this.logRawCommunication,
            appendMissingNULLonIncoming: this.appendMissingNULLonIncoming,
            discardWebsocketOnCommFailure: this.discardWebsocketOnCommFailure,
            onConnect: (w) => {
              if (this._connectionWatcher && (clearTimeout(this._connectionWatcher), this._connectionWatcher = void 0), this._nextReconnectDelay = this.reconnectDelay, !this.active) {
                this.debug("STOMP got connected while deactivate was issued, will disconnect now"), this._disposeStompHandler();
                return;
              }
              this.onConnect(w);
            },
            onDisconnect: (w) => {
              this.onDisconnect(w);
            },
            onStompError: (w) => {
              this.onStompError(w);
            },
            onWebSocketClose: (w) => {
              this._stompHandler = void 0, this.state === s.ActivationState.DEACTIVATING && this._changeState(s.ActivationState.INACTIVE), this.onWebSocketClose(w), this.active && this._schedule_reconnect();
            },
            onWebSocketError: (w) => {
              this.onWebSocketError(w);
            },
            onUnhandledMessage: (w) => {
              this.onUnhandledMessage(w);
            },
            onUnhandledReceipt: (w) => {
              this.onUnhandledReceipt(w);
            },
            onUnhandledFrame: (w) => {
              this.onUnhandledFrame(w);
            },
            onHeartbeatReceived: () => {
              this.onHeartbeatReceived();
            },
            onHeartbeatLost: () => {
              this.onHeartbeatLost();
            }
          }), this._stompHandler.start();
        }
        _createWebSocket() {
          let p;
          if (this.webSocketFactory)
            p = this.webSocketFactory();
          else if (this.brokerURL)
            p = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
          else
            throw new Error("Either brokerURL or webSocketFactory must be provided");
          return p.binaryType = "arraybuffer", p;
        }
        _schedule_reconnect() {
          this._nextReconnectDelay > 0 && (this.debug(`STOMP: scheduling reconnection in ${this._nextReconnectDelay}ms`), this._reconnector = setTimeout(() => {
            this.reconnectTimeMode === s.ReconnectionTimeMode.EXPONENTIAL && (this._nextReconnectDelay = this._nextReconnectDelay * 2, this.maxReconnectDelay !== 0 && (this._nextReconnectDelay = Math.min(this._nextReconnectDelay, this.maxReconnectDelay))), this._connect();
          }, this._nextReconnectDelay));
        }
        /**
         * Disconnects the client and stops the automatic reconnection loop.
         *
         * If there is an active STOMP connection at the time of invocation, the appropriate callbacks
         * will be triggered during the shutdown sequence. Once deactivated, the client will enter the
         * `INACTIVE` state, and no further reconnection attempts will be made.
         *
         * **Behavior**:
         * - If there is no active WebSocket connection, this method resolves immediately.
         * - If there is an active connection, the method waits for the underlying WebSocket
         *   to properly close before resolving.
         * - Multiple calls to this method are safe. Each invocation resolves upon completion.
         * - To reactivate, call [Client#activate]{@link Client#activate}.
         *
         * **Experimental Option:**
         * - By specifying the `force: true` option, the WebSocket connection is discarded immediately,
         *   bypassing both the STOMP and WebSocket shutdown sequences.
         * - **Caution:** Using `force: true` may leave the WebSocket in an inconsistent state,
         *   and brokers may not immediately detect the termination.
         *
         * Example:
         * ```javascript
         * // Graceful disconnect
         * await client.deactivate();
         *
         * // Forced disconnect to speed up shutdown when the connection is stale
         * await client.deactivate({ force: true });
         * ```
         *
         * @param options Configuration options for deactivation. Use `force: true` for immediate shutdown.
         * @returns A Promise that resolves when the deactivation process completes.
         */
        async deactivate(p = {}) {
          const w = p.force || !1, C = this.active;
          let k;
          if (this.state === s.ActivationState.INACTIVE)
            return this.debug("Already INACTIVE, nothing more to do"), Promise.resolve();
          if (this._changeState(s.ActivationState.DEACTIVATING), this._nextReconnectDelay = 0, this._reconnector && (clearTimeout(this._reconnector), this._reconnector = void 0), this._stompHandler && // @ts-ignore - if there is a _stompHandler, there is the webSocket
          this.webSocket.readyState !== s.StompSocketState.CLOSED) {
            const K = this._stompHandler.onWebSocketClose;
            k = new Promise((lt, at) => {
              this._stompHandler.onWebSocketClose = (tt) => {
                K(tt), lt();
              };
            });
          } else
            return this._changeState(s.ActivationState.INACTIVE), Promise.resolve();
          return w ? this._stompHandler?.discardWebsocket() : C && this._disposeStompHandler(), k;
        }
        /**
         * Forces a disconnect by directly closing the WebSocket.
         *
         * Unlike a normal disconnect, this does not send a DISCONNECT sequence to the broker but
         * instead closes the WebSocket connection directly. After forcing a disconnect, the client
         * will automatically attempt to reconnect based on its `reconnectDelay` configuration.
         *
         * **Note:** To prevent further reconnect attempts, call [Client#deactivate]{@link Client#deactivate}.
         *
         * Example:
         * ```javascript
         * client.forceDisconnect();
         * ```
         */
        forceDisconnect() {
          this._stompHandler && this._stompHandler.forceDisconnect();
        }
        _disposeStompHandler() {
          this._stompHandler && this._stompHandler.dispose();
        }
        /**
         * Sends a message to the specified destination on the STOMP broker.
         *
         * The `body` must be a `string`. For non-string payloads (e.g., JSON), encode it as a string before sending.
         * If sending binary data, use the `binaryBody` parameter as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
         *
         * **Content-Length Behavior**:
         * - For non-binary messages, the `content-length` header is added by default.
         * - The `content-length` header can be skipped for text frames by setting `skipContentLengthHeader: true` in the parameters.
         * - For binary messages, the `content-length` header is always included.
         *
         * **Notes**:
         * - Ensure that brokers support binary frames before using `binaryBody`.
         * - Sending messages with NULL octets and missing `content-length` headers can cause brokers to disconnect and throw errors.
         *
         * Example:
         * ```javascript
         * // Basic text message
         * client.publish({ destination: "/queue/test", body: "Hello, STOMP" });
         *
         * // Text message with additional headers
         * client.publish({ destination: "/queue/test", headers: { priority: 9 }, body: "Hello, STOMP" });
         *
         * // Skip content-length header
         * client.publish({ destination: "/queue/test", body: "Hello, STOMP", skipContentLengthHeader: true });
         *
         * // Binary message
         * const binaryData = new Uint8Array([1, 2, 3, 4]);
         * client.publish({
         *   destination: '/topic/special',
         *   binaryBody: binaryData,
         *   headers: { 'content-type': 'application/octet-stream' }
         * });
         * ```
         */
        publish(p) {
          this._checkConnection(), this._stompHandler.publish(p);
        }
        _checkConnection() {
          if (!this.connected)
            throw new TypeError("There is no underlying STOMP connection");
        }
        /**
         * Monitors for a receipt acknowledgment from the broker for specific operations.
         *
         * Add a `receipt` header to the operation (like subscribe or publish), and use this method with
         * the same receipt ID to detect when the broker has acknowledged the operation's completion.
         *
         * The callback is invoked with the corresponding {@link IFrame} when the receipt is received.
         *
         * Example:
         * ```javascript
         * const receiptId = "unique-receipt-id";
         *
         * client.watchForReceipt(receiptId, (frame) => {
         *   console.log("Operation acknowledged by the broker:", frame);
         * });
         *
         * // Attach the receipt header to an operation
         * client.publish({ destination: "/queue/test", headers: { receipt: receiptId }, body: "Hello" });
         * ```
         *
         * @param receiptId Unique identifier for the receipt.
         * @param callback Callback function invoked on receiving the RECEIPT frame.
         */
        watchForReceipt(p, w) {
          this._checkConnection(), this._stompHandler.watchForReceipt(p, w);
        }
        /**
         * Subscribes to a destination on the STOMP broker.
         *
         * The callback is triggered for each message received from the subscribed destination. The message
         * is passed as an {@link IMessage} instance.
         *
         * **Subscription ID**:
         * - If no `id` is provided in `headers`, the library generates a unique subscription ID automatically.
         * - Provide an explicit `id` in `headers` if you wish to manage the subscription ID manually.
         *
         * Example:
         * ```javascript
         * const callback = (message) => {
         *   console.log("Received message:", message.body);
         * };
         *
         * // Auto-generated subscription ID
         * const subscription = client.subscribe("/queue/test", callback);
         *
         * // Explicit subscription ID
         * const mySubId = "my-subscription-id";
         * const subscription = client.subscribe("/queue/test", callback, { id: mySubId });
         * ```
         *
         * @param destination Destination to subscribe to.
         * @param callback Function invoked for each received message.
         * @param headers Optional headers for subscription, such as `id`.
         * @returns A {@link StompSubscription} which can be used to manage the subscription.
         */
        subscribe(p, w, C = {}) {
          return this._checkConnection(), this._stompHandler.subscribe(p, w, C);
        }
        /**
         * Unsubscribes from a subscription on the STOMP broker.
         *
         * Prefer using the `unsubscribe` method directly on the {@link StompSubscription} returned from `subscribe` for cleaner management:
         * ```javascript
         * const subscription = client.subscribe("/queue/test", callback);
         * // Unsubscribe using the subscription object
         * subscription.unsubscribe();
         * ```
         *
         * This method can also be used directly with the subscription ID.
         *
         * Example:
         * ```javascript
         * client.unsubscribe("my-subscription-id");
         * ```
         *
         * @param id Subscription ID to unsubscribe.
         * @param headers Optional headers to pass for the UNSUBSCRIBE frame.
         */
        unsubscribe(p, w = {}) {
          this._checkConnection(), this._stompHandler.unsubscribe(p, w);
        }
        /**
         * Starts a new transaction. The returned {@link ITransaction} object provides
         * methods for [commit]{@link ITransaction#commit} and [abort]{@link ITransaction#abort}.
         *
         * If `transactionId` is not provided, the library generates a unique ID internally.
         *
         * Example:
         * ```javascript
         * const tx = client.begin(); // Auto-generated ID
         *
         * // Or explicitly specify a transaction ID
         * const tx = client.begin("my-transaction-id");
         * ```
         *
         * @param transactionId Optional transaction ID.
         * @returns An instance of {@link ITransaction}.
         */
        begin(p) {
          return this._checkConnection(), this._stompHandler.begin(p);
        }
        /**
         * Commits a transaction.
         *
         * It is strongly recommended to call [commit]{@link ITransaction#commit} on
         * the transaction object returned by [client#begin]{@link Client#begin}.
         *
         * Example:
         * ```javascript
         * const tx = client.begin();
         * // Perform operations under this transaction
         * tx.commit();
         * ```
         *
         * @param transactionId The ID of the transaction to commit.
         */
        commit(p) {
          this._checkConnection(), this._stompHandler.commit(p);
        }
        /**
         * Aborts a transaction.
         *
         * It is strongly recommended to call [abort]{@link ITransaction#abort} directly
         * on the transaction object returned by [client#begin]{@link Client#begin}.
         *
         * Example:
         * ```javascript
         * const tx = client.begin();
         * // Perform operations under this transaction
         * tx.abort(); // Abort the transaction
         * ```
         *
         * @param transactionId The ID of the transaction to abort.
         */
        abort(p) {
          this._checkConnection(), this._stompHandler.abort(p);
        }
        /**
         * Acknowledges receipt of a message. Typically, this should be done by calling
         * [ack]{@link IMessage#ack} directly on the {@link IMessage} instance passed
         * to the subscription callback.
         *
         * Example:
         * ```javascript
         * const callback = (message) => {
         *   // Process the message
         *   message.ack(); // Acknowledge the message
         * };
         *
         * client.subscribe("/queue/example", callback, { ack: "client" });
         * ```
         *
         * @param messageId The ID of the message to acknowledge.
         * @param subscriptionId The ID of the subscription.
         * @param headers Optional headers for the acknowledgment frame.
         */
        ack(p, w, C = {}) {
          this._checkConnection(), this._stompHandler.ack(p, w, C);
        }
        /**
         * Rejects a message (negative acknowledgment). Like acknowledgments, this should
         * typically be done by calling [nack]{@link IMessage#nack} directly on the {@link IMessage}
         * instance passed to the subscription callback.
         *
         * Example:
         * ```javascript
         * const callback = (message) => {
         *   // Process the message
         *   if (isError(message)) {
         *     message.nack(); // Reject the message
         *   }
         * };
         *
         * client.subscribe("/queue/example", callback, { ack: "client" });
         * ```
         *
         * @param messageId The ID of the message to negatively acknowledge.
         * @param subscriptionId The ID of the subscription.
         * @param headers Optional headers for the NACK frame.
         */
        nack(p, w, C = {}) {
          this._checkConnection(), this._stompHandler.nack(p, w, C);
        }
      }
      class M {
      }
      class H {
      }
      class D {
        constructor(p) {
          this.client = p;
        }
        get outgoing() {
          return this.client.heartbeatOutgoing;
        }
        set outgoing(p) {
          this.client.heartbeatOutgoing = p;
        }
        get incoming() {
          return this.client.heartbeatIncoming;
        }
        set incoming(p) {
          this.client.heartbeatIncoming = p;
        }
      }
      class X extends O {
        /**
         * Available for backward compatibility, please shift to using {@link Client}
         * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
         *
         * **Deprecated**
         *
         * @internal
         */
        constructor(p) {
          super(), this.maxWebSocketFrameSize = 16 * 1024, this._heartbeatInfo = new D(this), this.reconnect_delay = 0, this.webSocketFactory = p, this.debug = (...w) => {
            console.log(...w);
          };
        }
        _parseConnect(...p) {
          let w, C, k, K = {};
          if (p.length < 2)
            throw new Error("Connect requires at least 2 arguments");
          return typeof p[1] == "function" ? [K, C, k, w] = p : p.length === 6 ? [
            K.login,
            K.passcode,
            C,
            k,
            w,
            K.host
          ] = p : [
            K.login,
            K.passcode,
            C,
            k,
            w
          ] = p, [K, C, k, w];
        }
        /**
         * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
         *
         * **Deprecated**
         *
         * The `connect` method accepts different number of arguments and types. See the Overloads list. Use the
         * version with headers to pass your broker specific options.
         *
         * overloads:
         * - connect(headers, connectCallback)
         * - connect(headers, connectCallback, errorCallback)
         * - connect(login, passcode, connectCallback)
         * - connect(login, passcode, connectCallback, errorCallback)
         * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback)
         * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback, host)
         *
         * params:
         * - headers, see [Client#connectHeaders]{@link Client#connectHeaders}
         * - connectCallback, see [Client#onConnect]{@link Client#onConnect}
         * - errorCallback, see [Client#onStompError]{@link Client#onStompError}
         * - closeEventCallback, see [Client#onWebSocketClose]{@link Client#onWebSocketClose}
         * - login [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
         * - passcode [String], [Client#connectHeaders](../classes/Client.html#connectHeaders)
         * - host [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        connect(...p) {
          const w = this._parseConnect(...p);
          w[0] && (this.connectHeaders = w[0]), w[1] && (this.onConnect = w[1]), w[2] && (this.onStompError = w[2]), w[3] && (this.onWebSocketClose = w[3]), super.activate();
        }
        /**
         * Available for backward compatibility, please shift to using [Client#deactivate]{@link Client#deactivate}.
         *
         * **Deprecated**
         *
         * See:
         * [Client#onDisconnect]{@link Client#onDisconnect}, and
         * [Client#disconnectHeaders]{@link Client#disconnectHeaders}
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        disconnect(p, w = {}) {
          p && (this.onDisconnect = p), this.disconnectHeaders = w, super.deactivate();
        }
        /**
         * Available for backward compatibility, use [Client#publish]{@link Client#publish}.
         *
         * Send a message to a named destination. Refer to your STOMP broker documentation for types
         * and naming of destinations. The headers will, typically, be available to the subscriber.
         * However, there may be special purpose headers corresponding to your STOMP broker.
         *
         *  **Deprecated**, use [Client#publish]{@link Client#publish}
         *
         * Note: Body must be String. You will need to covert the payload to string in case it is not string (e.g. JSON)
         *
         * ```javascript
         *        client.send("/queue/test", {priority: 9}, "Hello, STOMP");
         *
         *        // If you want to send a message with a body, you must also pass the headers argument.
         *        client.send("/queue/test", {}, "Hello, STOMP");
         * ```
         *
         * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
         */
        send(p, w = {}, C = "") {
          w = Object.assign({}, w);
          const k = w["content-length"] === !1;
          k && delete w["content-length"], this.publish({
            destination: p,
            headers: w,
            body: C,
            skipContentLengthHeader: k
          });
        }
        /**
         * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
         *
         * **Deprecated**
         */
        set reconnect_delay(p) {
          this.reconnectDelay = p;
        }
        /**
         * Available for backward compatibility, renamed to [Client#webSocket]{@link Client#webSocket}.
         *
         * **Deprecated**
         */
        get ws() {
          return this.webSocket;
        }
        /**
         * Available for backward compatibility, renamed to [Client#connectedVersion]{@link Client#connectedVersion}.
         *
         * **Deprecated**
         */
        get version() {
          return this.connectedVersion;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        get onreceive() {
          return this.onUnhandledMessage;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        set onreceive(p) {
          this.onUnhandledMessage = p;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         * Prefer using [Client#watchForReceipt]{@link Client#watchForReceipt}.
         *
         * **Deprecated**
         */
        get onreceipt() {
          return this.onUnhandledReceipt;
        }
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         *
         * **Deprecated**
         */
        set onreceipt(p) {
          this.onUnhandledReceipt = p;
        }
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        get heartbeat() {
          return this._heartbeatInfo;
        }
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        set heartbeat(p) {
          this.heartbeatIncoming = p.incoming, this.heartbeatOutgoing = p.outgoing;
        }
      }
      class Q {
        /**
         * This method creates a WebSocket client that is connected to
         * the STOMP server located at the url.
         *
         * ```javascript
         *        var url = "ws://localhost:61614/stomp";
         *        var client = Stomp.client(url);
         * ```
         *
         * **Deprecated**
         *
         * It will be removed in next major version. Please switch to {@link Client}
         * using [Client#brokerURL]{@link Client#brokerURL}.
         */
        static client(p, w) {
          w == null && (w = E.default.protocolVersions());
          const C = () => {
            const k = Q.WebSocketClass || WebSocket;
            return new k(p, w);
          };
          return new X(C);
        }
        /**
         * This method is an alternative to [Stomp#client]{@link Stomp#client} to let the user
         * specify the WebSocket to use (either a standard HTML5 WebSocket or
         * a similar object).
         *
         * In order to support reconnection, the function Client._connect should be callable more than once.
         * While reconnecting
         * a new instance of underlying transport (TCP Socket, WebSocket or SockJS) will be needed. So, this function
         * alternatively allows passing a function that should return a new instance of the underlying socket.
         *
         * ```javascript
         *        var client = Stomp.over(function(){
         *          return new WebSocket('ws://localhost:15674/ws')
         *        });
         * ```
         *
         * **Deprecated**
         *
         * It will be removed in next major version. Please switch to {@link Client}
         * using [Client#webSocketFactory]{@link Client#webSocketFactory}.
         */
        static over(p) {
          let w;
          return typeof p == "function" ? w = p : (console.warn("Stomp.over did not receive a factory, auto reconnect will not work. Please see https://stomp-js.github.io/api-docs/latest/classes/Stomp.html#over"), w = () => p), new X(w);
        }
      }
      Q.WebSocketClass = null, s.Client = O, s.CompatClient = X, s.FrameImpl = d, s.Parser = _, s.Stomp = Q, s.StompConfig = M, s.StompHeaders = H, s.Versions = E;
    }));
  })(Lr, Lr.exports)), Lr.exports;
}
var Qw = Xw();
function Zw({
  className: l,
  size: r = "default",
  ...s
}) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "card",
      "data-size": r,
      className: At(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        l
      ),
      ...s
    }
  );
}
const Kw = Xd(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Iw({
  className: l,
  variant: r = "default",
  asChild: s = !1,
  ...u
}) {
  const f = s ? Zd : "span";
  return /* @__PURE__ */ y.jsx(
    f,
    {
      "data-slot": "badge",
      "data-variant": r,
      className: At(Kw({ variant: r }), l),
      ...u
    }
  );
}
function q2({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: At(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        l
      ),
      ...r
    }
  );
}
function h0() {
  return { [document.querySelector('meta[name="_csrf_header"]')?.content || "X-CSRF-TOKEN"]: document.querySelector('meta[name="_csrf"]')?.content || "" };
}
async function Bn(l, r) {
  const s = await fetch(l, { credentials: "same-origin", method: r === void 0 ? "GET" : "POST", headers: { ...h0(), "Content-Type": "application/json" }, body: r === void 0 ? void 0 : JSON.stringify(r) });
  if (s.redirected || s.status === 401) throw Error("Phiên đăng nhập đã kết thúc");
  if (!s.ok) {
    const u = await s.json().catch(() => ({}));
    throw Error(u.message || (s.status === 403 ? "Bạn không có quyền thực hiện thao tác này" : "Chưa thể xử lý yêu cầu"));
  }
  return s.json();
}
function Jw({ role: l = "manager" }) {
  const [r, s] = S.useState(""), [u, f] = S.useState([]), [d, m] = S.useState(!1), [v, b] = S.useState(!1);
  S.useEffect(() => {
    Bn("/api/support/context").then((z) => f(z.stores)).catch((z) => C(z.message));
  }, []);
  const x = async () => {
    if (O) {
      b(!0);
      try {
        await Bn("/api/support/conversations/" + O + "/delete", {}), M(void 0), m(!1), R(0), Vt(), Jl.success("Đã xóa cuộc hội thoại");
      } catch (z) {
        Jl.error(z.message);
      } finally {
        b(!1);
      }
    }
  }, [_, h] = S.useState(), [E, R] = S.useState(0), [O, M] = S.useState(() => Number(location.pathname.split("/")[3]) || void 0), [H, D] = S.useState(), [X, Q] = S.useState([]), [B, p] = S.useState(""), [w, C] = S.useState(""), [k, K] = S.useState(!1), [lt, at] = S.useState(!1), [tt, ct] = S.useState(!1), [I, vt] = S.useState(!1), Z = S.useRef(void 0), nt = S.useRef(void 0), et = S.useRef(null), ft = S.useRef(null), mt = S.useRef(void 0), Vt = () => Bn("/api/support/staff-inbox?page=" + E + "&size=30" + (r ? "&storeId=" + r : "")).then(h).catch((z) => C(z.message));
  S.useEffect(() => {
    Vt();
  }, [E, r]);
  const $t = (z, P) => {
    P.length && document.visibilityState === "visible" && Bn("/api/support/conversations/" + z + "/read", { lastReadMessageId: P[P.length - 1].id }).then(Vt).catch((it) => C(it.message));
  };
  S.useEffect(() => {
    let z = !0;
    if (nt.current = O, Q([]), D(void 0), p(""), mt.current = void 0, ft.current = null, vt(!1), C(""), !!O)
      return K(!0), Promise.all([Bn("/api/support/conversations/" + O), Bn("/api/support/conversations/" + O + "/messages")]).then(([P, it]) => {
        z && (D(P), Q((bt) => [...new Map([...it, ...bt].map((St) => [St.id, St])).values()].sort((St, ut) => St.id - ut.id)), vt(it.length === 50), $t(O, it));
      }).catch((P) => {
        z && C(P.message);
      }).finally(() => {
        z && K(!1);
      }), () => {
        z = !1;
      };
  }, [O]), S.useEffect(() => {
    const z = new Qw.Client({ brokerURL: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/chat`, connectHeaders: h0(), reconnectDelay: 3e3, onConnect: () => {
      ct(!0), z.subscribe("/user/queue/support-inbox", (P) => {
        const it = JSON.parse(P.body);
        it.event === "DELETED" && nt.current === it.conversationId && M(void 0), Vt();
      }), z.subscribe("/user/queue/support-errors", (P) => Jl.error(JSON.parse(P.body).message));
    }, onWebSocketClose: () => ct(!1), onStompError: () => {
      ct(!1), C("Kết nối trực tiếp bị gián đoạn. Vui lòng tải lại");
    } });
    return Z.current = z, z.activate(), () => {
      z.deactivate(), Z.current = void 0;
    };
  }, [E, r]), S.useEffect(() => {
    const z = Z.current;
    if (!tt || !z || !O) return;
    const P = z.subscribe("/user/queue/support/" + O, (it) => {
      if (nt.current !== O) return;
      const bt = JSON.parse(it.body);
      Q((st) => st.some((St) => St.id === bt.id) ? st : [...st, bt].sort((St, ut) => St.id - ut.id)), $t(O, [bt]);
    });
    return () => P.unsubscribe();
  }, [O, tt, E]), S.useEffect(() => {
    const z = et.current?.parentElement;
    z && (z.scrollTop = ft.current === null ? z.scrollHeight : z.scrollHeight - ft.current, ft.current = null);
  }, [X.length]), S.useEffect(() => {
    const z = () => {
      O && $t(O, X);
    };
    return document.addEventListener("visibilitychange", z), () => document.removeEventListener("visibilitychange", z);
  }, [O, X]);
  const re = async () => {
    if (!O || !B.trim()) return;
    at(!0);
    const z = mt.current?.content === B.trim() ? mt.current : { clientMessageId: crypto.randomUUID(), content: B.trim() };
    mt.current = z;
    try {
      if (await Bn("/api/support/conversations/" + O + "/messages", z), nt.current !== O) return;
      mt.current = void 0, p("");
      const P = await Bn("/api/support/conversations/" + O + "/messages");
      if (nt.current !== O) return;
      Q((it) => [...new Map([...it, ...P].map((st) => [st.id, st])).values()].sort((st, St) => st.id - St.id)), $t(O, P), Jl.success("Đã gửi tin nhắn");
    } catch (P) {
      Jl.error(P.message);
    } finally {
      at(!1);
    }
  }, A = async () => {
    if (!(!O || !X.length))
      try {
        const z = await Bn("/api/support/conversations/" + O + "/messages?beforeId=" + X[0].id);
        if (nt.current !== O) return;
        vt(z.length === 50);
        const P = et.current?.parentElement;
        P && (ft.current = P.scrollHeight - P.scrollTop), Q((it) => [...z, ...it]);
      } catch (z) {
        Jl.error(z.message);
      }
  };
  return /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
    /* @__PURE__ */ y.jsxs("div", { className: "mb-0 flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white p-3", children: [
      /* @__PURE__ */ y.jsx("strong", { children: "Hội thoại" }),
      l !== "manager" && /* @__PURE__ */ y.jsxs("select", { className: "max-w-full rounded border bg-white p-2 text-sm", "aria-label": "Cửa hàng hội thoại", value: r, onChange: (z) => {
        s(z.target.value), R(0), M(void 0);
      }, children: [
        /* @__PURE__ */ y.jsx("option", { value: "", children: l === "admin" ? "Tất cả cửa hàng" : "Cửa hàng được phân công" }),
        u.map((z) => /* @__PURE__ */ y.jsx("option", { value: z.id, children: z.name }, z.id))
      ] })
    ] }),
    /* @__PURE__ */ y.jsxs(Zw, { className: "grid h-[calc(100dvh-275px)] min-h-0 gap-0 overflow-hidden rounded-t-none py-0 md:grid-cols-[300px_1fr]", children: [
      w && /* @__PURE__ */ y.jsxs("div", { role: "alert", className: "border-b bg-red-50 p-4 text-red-800 md:col-span-2", children: [
        w,
        /* @__PURE__ */ y.jsx(Ve, { variant: "outline", size: "sm", className: "ml-2", onClick: () => {
          C(""), Vt();
        }, children: "Thử lại" })
      ] }),
      /* @__PURE__ */ y.jsxs("aside", { className: (O ? "hidden md:flex" : "flex") + " min-h-0 flex-col border-r", children: [
        /* @__PURE__ */ y.jsx("div", { className: "border-b p-4 font-semibold", children: "Cuộc trò chuyện" }),
        /* @__PURE__ */ y.jsx("div", { className: "min-h-0 flex-1 overflow-auto", children: _ ? _.items.length ? _.items.map((z) => /* @__PURE__ */ y.jsxs("button", { className: "w-full border-b p-4 text-left hover:bg-muted " + (O === z.id ? "bg-accent " : "") + (z.unreadCount ? "bg-indigo-50 font-semibold" : ""), onClick: () => M(z.id), children: [
          /* @__PURE__ */ y.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ y.jsxs("span", { children: [
              "Khách hàng · #",
              z.id
            ] }),
            z.unreadCount > 0 && /* @__PURE__ */ y.jsx(Iw, { children: z.unreadCount })
          ] }),
          /* @__PURE__ */ y.jsx("p", { className: "mt-2 truncate text-sm text-muted-foreground", children: z.lastMessage || z.handoffSummary }),
          /* @__PURE__ */ y.jsx("small", { className: "text-muted-foreground", children: z.status === "OPEN" ? "Đang mở" : "Đã đóng" })
        ] }, z.id)) : /* @__PURE__ */ y.jsx("p", { className: "p-6 text-muted-foreground", children: l === "support" && !u.length ? "Chưa được phân công cửa hàng" : "Chưa có cuộc trò chuyện" }) : /* @__PURE__ */ y.jsx(Zv, { className: "m-4 h-40" }) }),
        /* @__PURE__ */ y.jsx(k2, { page: E, total: _?.total || 0, onChange: R })
      ] }),
      /* @__PURE__ */ y.jsx("section", { className: (O ? "flex" : "hidden md:flex") + " min-h-0 min-w-0 flex-col", children: O ? /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
        /* @__PURE__ */ y.jsxs("header", { className: "flex items-center gap-3 border-b p-4", children: [
          /* @__PURE__ */ y.jsx(Ve, { className: "md:hidden", variant: "ghost", size: "icon", "aria-label": "Quay lại cuộc trò chuyện", onClick: () => M(void 0), children: /* @__PURE__ */ y.jsx(R1, { size: 18 }) }),
          /* @__PURE__ */ y.jsxs("div", { children: [
            /* @__PURE__ */ y.jsxs("strong", { children: [
              "Khách hàng · #",
              O
            ] }),
            /* @__PURE__ */ y.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              tt ? "● Kết nối trực tiếp" : "Đang kết nối…",
              " · ",
              H?.orderCode || H?.storeName
            ] })
          ] }),
          l !== "support" && /* @__PURE__ */ y.jsx(Ve, { className: "ml-auto", variant: "ghost", size: "icon", "aria-label": "Xóa cuộc hội thoại", onClick: () => m(!0), children: /* @__PURE__ */ y.jsx(k1, { size: 18 }) })
        ] }),
        /* @__PURE__ */ y.jsx("div", { className: "min-h-0 flex-1 overflow-auto p-5", "aria-live": "polite", children: k ? /* @__PURE__ */ y.jsx(Zv, { className: "h-40" }) : /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
          I && /* @__PURE__ */ y.jsx(Ve, { variant: "outline", size: "sm", onClick: A, children: "Tin nhắn trước" }),
          H?.handoffSummary && /* @__PURE__ */ y.jsx("p", { className: "mb-5 rounded bg-muted p-3 text-sm", children: H.handoffSummary }),
          X.map((z) => /* @__PURE__ */ y.jsxs("div", { className: "mb-4 max-w-[85%] " + (z.senderType === "STAFF" ? "ml-auto" : ""), children: [
            /* @__PURE__ */ y.jsxs("p", { className: "mb-1 text-xs text-muted-foreground", children: [
              z.displayName,
              z.staffName ? " · " + z.staffName : ""
            ] }),
            /* @__PURE__ */ y.jsx("p", { className: "rounded-lg border px-4 py-3 whitespace-pre-wrap break-words " + (z.senderType === "STAFF" ? "border-indigo-100 bg-indigo-50" : "bg-white"), children: z.content }),
            /* @__PURE__ */ y.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: new Date(z.createdAt).toLocaleString("vi-VN") })
          ] }, z.id)),
          /* @__PURE__ */ y.jsx("div", { ref: et })
        ] }) }),
        /* @__PURE__ */ y.jsxs("form", { className: "flex items-end gap-3 border-t p-4", onSubmit: (z) => {
          z.preventDefault(), re();
        }, children: [
          /* @__PURE__ */ y.jsx(q2, { "aria-label": "Tin nhắn cho khách hàng", maxLength: 2e3, rows: 1, className: "h-[46px] min-h-[46px] flex-1 resize-none", value: B, disabled: H?.status !== "OPEN", placeholder: "Nhập tin nhắn…", onChange: (z) => p(z.target.value) }),
          /* @__PURE__ */ y.jsxs(Ve, { className: "h-[46px] shrink-0", type: "submit", disabled: lt || k || !B.trim() || H?.status !== "OPEN", "aria-label": "Gửi tin nhắn", children: [
            /* @__PURE__ */ y.jsx(V1, { size: 16 }),
            /* @__PURE__ */ y.jsx("span", { children: "Gửi" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ y.jsx("div", { className: "m-auto p-8 text-muted-foreground", children: "Chọn cuộc trò chuyện để xem lịch sử và trả lời" }) })
    ] }),
    /* @__PURE__ */ y.jsx(M2, { open: d, onOpenChange: m, children: /* @__PURE__ */ y.jsxs(j2, { children: [
      /* @__PURE__ */ y.jsxs(H2, { children: [
        /* @__PURE__ */ y.jsx(B2, { children: "Xóa cuộc hội thoại" }),
        /* @__PURE__ */ y.jsx(L2, { children: "Xóa cuộc hội thoại và toàn bộ tin nhắn liên quan" })
      ] }),
      /* @__PURE__ */ y.jsxs(U2, { children: [
        /* @__PURE__ */ y.jsx(Y2, { disabled: v, children: "Hủy" }),
        /* @__PURE__ */ y.jsx(V2, { disabled: v, onClick: (z) => {
          z.preventDefault(), x();
        }, children: "Xác nhận" })
      ] })
    ] }) })
  ] });
}
function Fw({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ y.jsx(
        "table",
        {
          "data-slot": "table",
          className: At("w-full caption-bottom text-sm", l),
          ...r
        }
      )
    }
  );
}
function $w({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: At("[&_tr]:border-b", l),
      ...r
    }
  );
}
function Pw({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: At("[&_tr:last-child]:border-0", l),
      ...r
    }
  );
}
function Su({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: At(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        l
      ),
      ...r
    }
  );
}
function Ww({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: At(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        l
      ),
      ...r
    }
  );
}
function za({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: At(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        l
      ),
      ...r
    }
  );
}
function tC({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(Wd, { "data-slot": "dialog", ...l });
}
function eC({
  ...l
}) {
  return /* @__PURE__ */ y.jsx(t0, { container: document.getElementById("manager-root") || document.getElementById("support-root"), "data-slot": "dialog-portal", ...l });
}
function nC({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    e0,
    {
      "data-slot": "dialog-overlay",
      className: At(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        l
      ),
      ...r
    }
  );
}
function aC({
  className: l,
  children: r,
  showCloseButton: s = !0,
  ...u
}) {
  return /* @__PURE__ */ y.jsxs(eC, { children: [
    /* @__PURE__ */ y.jsx(nC, {}),
    /* @__PURE__ */ y.jsxs(
      n0,
      {
        "data-slot": "dialog-content",
        className: At(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          l
        ),
        ...u,
        children: [
          r,
          s && /* @__PURE__ */ y.jsx(ju, { "data-slot": "dialog-close", asChild: !0, children: /* @__PURE__ */ y.jsxs(
            Ve,
            {
              variant: "ghost",
              className: "absolute top-2 right-2",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ y.jsx(
                  tp,
                  {}
                ),
                /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function lC({ className: l, ...r }) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: At("flex flex-col gap-2", l),
      ...r
    }
  );
}
function iC({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    a0,
    {
      "data-slot": "dialog-title",
      className: At(
        "text-base leading-none font-medium",
        l
      ),
      ...r
    }
  );
}
function oC({
  className: l,
  ...r
}) {
  return /* @__PURE__ */ y.jsx(
    l0,
    {
      "data-slot": "dialog-description",
      className: At(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        l
      ),
      ...r
    }
  );
}
function rC({ role: l }) {
  const [r, s] = S.useState(), [u, f] = S.useState(0), [d, m] = S.useState(""), [v, b] = S.useState(""), [x, _] = S.useState(""), [h, E] = S.useState(""), [R, O] = S.useState([]), [M, H] = S.useState(""), [D, X] = S.useState(0), [Q, B] = S.useState(), [p, w] = S.useState(), [C, k] = S.useState(""), [K, lt] = S.useState(), [at, tt] = S.useState(!1);
  S.useEffect(() => {
    l === "admin" && Bn("/api/support/context").then((I) => O(I.stores)).catch((I) => H(I.message));
  }, [l]), S.useEffect(() => {
    let I = !0;
    s(void 0);
    const vt = setTimeout(() => {
      const Z = new URLSearchParams({ page: String(u), search: d, replied: x });
      v && Z.set("rating", v), h && Z.set("storeId", h), Bn("/api/" + l + "/reviews?" + Z).then((nt) => {
        I && (s(nt), H(""));
      }).catch((nt) => {
        I && H(nt.message);
      });
    }, 200);
    return () => {
      I = !1, clearTimeout(vt);
    };
  }, [l, u, d, v, x, h, D]);
  const ct = async (I = !1) => {
    tt(!0);
    try {
      await Bn("/api/" + l + "/reviews/" + (I ? K?.id : p?.id) + (I ? "/delete" : "/reply"), I ? {} : { content: C }), Jl.success(I ? "Đã xóa đánh giá" : "Đã lưu phản hồi"), w(void 0), lt(void 0), B(void 0), X((vt) => vt + 1);
    } catch (vt) {
      Jl.error(vt.message);
    } finally {
      tt(!1);
    }
  };
  return /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
    /* @__PURE__ */ y.jsxs("div", { className: "mb-4 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ y.jsx(MT, { className: "max-w-xs", "aria-label": "Tìm đánh giá", placeholder: "Tìm sản phẩm hoặc nội dung…", value: d, onChange: (I) => {
        m(I.target.value), f(0);
      } }),
      /* @__PURE__ */ y.jsxs("select", { className: "rounded border bg-white p-2", "aria-label": "Số sao", value: v, onChange: (I) => {
        b(I.target.value), f(0);
      }, children: [
        /* @__PURE__ */ y.jsx("option", { value: "", children: "Tất cả số sao" }),
        [1, 2, 3, 4, 5].map((I) => /* @__PURE__ */ y.jsxs("option", { value: I, children: [
          I,
          " sao"
        ] }, I))
      ] }),
      /* @__PURE__ */ y.jsxs("select", { className: "rounded border bg-white p-2", "aria-label": "Phản hồi đánh giá", value: x, onChange: (I) => {
        _(I.target.value), f(0);
      }, children: [
        /* @__PURE__ */ y.jsx("option", { value: "", children: "Tất cả phản hồi" }),
        /* @__PURE__ */ y.jsx("option", { value: "yes", children: "Đã phản hồi" }),
        /* @__PURE__ */ y.jsx("option", { value: "no", children: "Chưa phản hồi" })
      ] }),
      l === "admin" && /* @__PURE__ */ y.jsxs("select", { className: "rounded border bg-white p-2", "aria-label": "Cửa hàng đánh giá", value: h, onChange: (I) => {
        E(I.target.value), f(0);
      }, children: [
        /* @__PURE__ */ y.jsx("option", { value: "", children: "Tất cả cửa hàng" }),
        R.map((I) => /* @__PURE__ */ y.jsx("option", { value: I.id, children: I.name }, I.id))
      ] })
    ] }),
    M && /* @__PURE__ */ y.jsx("p", { role: "alert", className: "mb-4 rounded border p-4", children: M }),
    /* @__PURE__ */ y.jsx("div", { className: "overflow-auto rounded border bg-white", children: /* @__PURE__ */ y.jsxs(Fw, { children: [
      /* @__PURE__ */ y.jsx($w, { children: /* @__PURE__ */ y.jsx(Su, { children: ["Sản phẩm", "Cửa hàng", "Khách hàng", "Đánh giá", "Nội dung", "Phản hồi", "Ngày đánh giá", "Thao tác"].map((I) => /* @__PURE__ */ y.jsx(Ww, { children: I }, I)) }) }),
      /* @__PURE__ */ y.jsx(Pw, { children: r ? r.items.length ? r.items.map((I) => /* @__PURE__ */ y.jsxs(Su, { children: [
        /* @__PURE__ */ y.jsx(za, { children: I.product }),
        /* @__PURE__ */ y.jsx(za, { children: I.store || "Chưa xác định" }),
        /* @__PURE__ */ y.jsx(za, { children: I.customer }),
        /* @__PURE__ */ y.jsxs(za, { children: [
          I.rating,
          " ★"
        ] }),
        /* @__PURE__ */ y.jsx(za, { className: "max-w-48 truncate", children: I.comment || "—" }),
        /* @__PURE__ */ y.jsxs(za, { className: "max-w-48", children: [
          /* @__PURE__ */ y.jsx("p", { className: "truncate", children: I.response || "Chưa phản hồi" }),
          I.response && /* @__PURE__ */ y.jsxs("small", { className: "block text-muted-foreground", children: [
            I.responder,
            " · ",
            I.responder_role?.replaceAll("ROLE_", "")
          ] })
        ] }),
        /* @__PURE__ */ y.jsx(za, { children: new Date(I.created_at).toLocaleDateString("vi-VN") }),
        /* @__PURE__ */ y.jsx(za, { children: /* @__PURE__ */ y.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ y.jsx(Ve, { size: "sm", variant: "outline", onClick: () => B(I), children: "Chi tiết" }),
          /* @__PURE__ */ y.jsx(Ve, { size: "sm", disabled: !I.store_id, onClick: () => {
            w(I), k(I.response || "");
          }, children: "Phản hồi" }),
          l !== "support" && /* @__PURE__ */ y.jsx(Ve, { size: "sm", variant: "outline", onClick: () => lt(I), children: "Xóa" })
        ] }) })
      ] }, I.id)) : /* @__PURE__ */ y.jsx(Su, { children: /* @__PURE__ */ y.jsx(za, { colSpan: 8, className: "h-32 text-center", children: l === "support" ? "Chưa có đánh giá thuộc cửa hàng được phân công" : "Chưa có đánh giá phù hợp" }) }) : /* @__PURE__ */ y.jsx(Su, { children: /* @__PURE__ */ y.jsx(za, { colSpan: 8, children: "Đang tải…" }) }) })
    ] }) }),
    /* @__PURE__ */ y.jsxs("div", { className: "mt-4 flex justify-between", children: [
      /* @__PURE__ */ y.jsxs("span", { children: [
        r?.total || 0,
        " đánh giá"
      ] }),
      /* @__PURE__ */ y.jsx(k2, { page: u, total: r?.total || 0, onChange: f })
    ] }),
    /* @__PURE__ */ y.jsx(A2, { open: !!Q, onOpenChange: (I) => {
      I || B(void 0);
    }, children: /* @__PURE__ */ y.jsxs(O2, { className: "overflow-y-auto p-6", children: [
      /* @__PURE__ */ y.jsxs(N2, { children: [
        /* @__PURE__ */ y.jsx(D2, { children: Q?.product }),
        /* @__PURE__ */ y.jsxs(R2, { children: [
          Q?.store,
          " · ",
          Q?.rating,
          " sao"
        ] })
      ] }),
      /* @__PURE__ */ y.jsx("p", { className: "my-5 whitespace-pre-wrap break-words", children: Q?.comment }),
      Q?.response && /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
        /* @__PURE__ */ y.jsx("strong", { children: Q.store }),
        /* @__PURE__ */ y.jsx("p", { className: "my-3 whitespace-pre-wrap break-words", children: Q.response }),
        /* @__PURE__ */ y.jsxs("small", { children: [
          Q.responder,
          " · ",
          Q.responder_role
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ y.jsx(tC, { open: !!p, onOpenChange: (I) => {
      !I && !at && w(void 0);
    }, children: /* @__PURE__ */ y.jsxs(aC, { children: [
      /* @__PURE__ */ y.jsxs(lC, { children: [
        /* @__PURE__ */ y.jsx(iC, { children: "Phản hồi đánh giá" }),
        /* @__PURE__ */ y.jsxs(oC, { children: [
          p?.product,
          " · ",
          p?.store
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("form", { className: "space-y-4", onSubmit: (I) => {
        I.preventDefault(), ct();
      }, children: [
        /* @__PURE__ */ y.jsx(q2, { "aria-label": "Nội dung phản hồi", required: !0, maxLength: 2e3, value: C, onChange: (I) => k(I.target.value) }),
        /* @__PURE__ */ y.jsx(Ve, { disabled: at || !C.trim(), children: "Lưu phản hồi" })
      ] })
    ] }) }),
    /* @__PURE__ */ y.jsx(M2, { open: !!K, onOpenChange: (I) => {
      !I && !at && lt(void 0);
    }, children: /* @__PURE__ */ y.jsxs(j2, { children: [
      /* @__PURE__ */ y.jsxs(H2, { children: [
        /* @__PURE__ */ y.jsx(B2, { children: "Xóa đánh giá" }),
        /* @__PURE__ */ y.jsx(L2, { children: "Xóa đánh giá và phản hồi cửa hàng liên quan" })
      ] }),
      /* @__PURE__ */ y.jsxs(U2, { children: [
        /* @__PURE__ */ y.jsx(Y2, { disabled: at, children: "Hủy" }),
        /* @__PURE__ */ y.jsx(V2, { disabled: at, onClick: (I) => {
          I.preventDefault(), ct(!0);
        }, children: "Xác nhận" })
      ] })
    ] }) })
  ] });
}
function sC({ page: l, go: r }) {
  const s = Gu();
  return /* @__PURE__ */ y.jsx(WT, { children: [["", "Hội thoại", U1], ["reviews", "Đánh giá", Y1]].map(([u, f, d]) => /* @__PURE__ */ y.jsx(tw, { children: /* @__PURE__ */ y.jsxs(nw, { isActive: l === u, onClick: () => {
    r(String(u)), s.setOpenMobile(!1);
  }, children: [
    /* @__PURE__ */ y.jsx(d, {}),
    /* @__PURE__ */ y.jsx("span", { children: String(f) })
  ] }) }, String(u))) });
}
function uC() {
  const [l, r] = S.useState(location.pathname === "/support/reviews" ? "reviews" : ""), [s, u] = S.useState(), [f, d] = S.useState("");
  S.useEffect(() => {
    Bn("/api/support/context").then(u).catch((x) => d(x.message));
    const b = () => r(location.pathname === "/support/reviews" ? "reviews" : "");
    return addEventListener("popstate", b), () => removeEventListener("popstate", b);
  }, []);
  const m = (b) => {
    history.pushState({}, "", "/support" + (b ? "/" + b : "")), r(b);
  }, v = () => {
    const b = document.createElement("form");
    b.method = "POST", b.action = "/logout";
    const x = document.createElement("input");
    x.name = "_csrf", x.value = Object.values(h0())[0], b.append(x), document.body.append(b), b.submit();
  };
  return /* @__PURE__ */ y.jsxs(UT, { children: [
    /* @__PURE__ */ y.jsxs(ZT, { children: [
      /* @__PURE__ */ y.jsxs(KT, { collapsible: "offcanvas", children: [
        /* @__PURE__ */ y.jsx(FT, { className: "border-b p-5", children: /* @__PURE__ */ y.jsxs("a", { href: "/support", className: "flex items-center gap-3 font-semibold", children: [
          /* @__PURE__ */ y.jsx("img", { src: "/T-Winkle_LogoNoBG.png", alt: "", className: "h-9 w-9" }),
          "T-Winkle - Support"
        ] }) }),
        /* @__PURE__ */ y.jsx(PT, { className: "p-3 pt-5", children: /* @__PURE__ */ y.jsx(sC, { page: l, go: m }) }),
        /* @__PURE__ */ y.jsxs($T, { className: "border-t p-3", children: [
          /* @__PURE__ */ y.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
            /* @__PURE__ */ y.jsxs(aw, { children: [
              /* @__PURE__ */ y.jsx(lw, { src: s?.avatar_url }),
              /* @__PURE__ */ y.jsx(iw, { children: "TW" })
            ] }),
            /* @__PURE__ */ y.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ y.jsx("strong", { className: "block truncate", children: s?.name || "Support" }),
              /* @__PURE__ */ y.jsx("small", { className: "block truncate", children: s?.email })
            ] })
          ] }),
          /* @__PURE__ */ y.jsxs(Ve, { variant: "ghost", onClick: v, children: [
            /* @__PURE__ */ y.jsx(H1, { size: 16 }),
            "Đăng xuất"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs(JT, { className: "min-w-0", children: [
        /* @__PURE__ */ y.jsxs("header", { className: "flex h-16 items-center gap-3 border-b px-5", children: [
          /* @__PURE__ */ y.jsx(IT, {}),
          /* @__PURE__ */ y.jsxs("span", { children: [
            "Support / ",
            l === "reviews" ? "Đánh giá" : "Hội thoại"
          ] })
        ] }),
        /* @__PURE__ */ y.jsxs("main", { className: "min-w-0 p-4 md:p-7", children: [
          /* @__PURE__ */ y.jsx("h1", { className: "mb-6 text-2xl font-semibold", children: l === "reviews" ? "Đánh giá" : "Hội thoại" }),
          f ? /* @__PURE__ */ y.jsx("p", { role: "alert", children: f }) : l === "reviews" ? /* @__PURE__ */ y.jsx(rC, { role: "support" }) : /* @__PURE__ */ y.jsx(Jw, { role: "support" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ y.jsx(Vw, { richColors: !0, position: "bottom-right" })
  ] });
}
A1.createRoot(document.getElementById("support-root")).render(/* @__PURE__ */ y.jsx(uC, {}));
