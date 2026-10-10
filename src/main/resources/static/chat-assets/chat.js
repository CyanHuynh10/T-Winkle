function Zy(i, r) {
  for (var s = 0; s < r.length; s++) {
    const o = r[s];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const d in o)
        if (d !== "default" && !(d in i)) {
          const m = Object.getOwnPropertyDescriptor(o, d);
          m && Object.defineProperty(i, d, m.get ? m : {
            enumerable: !0,
            get: () => o[d]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function Ky(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var rf = { exports: {} }, Pi = {};
var Ym;
function Jy() {
  if (Ym) return Pi;
  Ym = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.fragment");
  function s(o, d, m) {
    var _ = null;
    if (m !== void 0 && (_ = "" + m), d.key !== void 0 && (_ = "" + d.key), "key" in d) {
      m = {};
      for (var T in d)
        T !== "key" && (m[T] = d[T]);
    } else m = d;
    return d = m.ref, {
      $$typeof: i,
      type: o,
      key: _,
      ref: d !== void 0 ? d : null,
      props: m
    };
  }
  return Pi.Fragment = r, Pi.jsx = s, Pi.jsxs = s, Pi;
}
var Xm;
function Iy() {
  return Xm || (Xm = 1, rf.exports = Jy()), rf.exports;
}
var H = Iy(), of = { exports: {} }, Ct = {};
var Qm;
function Fy() {
  if (Qm) return Ct;
  Qm = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.portal"), s = /* @__PURE__ */ Symbol.for("react.fragment"), o = /* @__PURE__ */ Symbol.for("react.strict_mode"), d = /* @__PURE__ */ Symbol.for("react.profiler"), m = /* @__PURE__ */ Symbol.for("react.consumer"), _ = /* @__PURE__ */ Symbol.for("react.context"), T = /* @__PURE__ */ Symbol.for("react.forward_ref"), R = /* @__PURE__ */ Symbol.for("react.suspense"), B = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), g = /* @__PURE__ */ Symbol.for("react.activity"), N = /* @__PURE__ */ Symbol.for("react.view_transition"), F = Symbol.iterator;
  function X(b) {
    return b === null || typeof b != "object" ? null : (b = F && b[F] || b["@@iterator"], typeof b == "function" ? b : null);
  }
  var at = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Y = Object.assign, Q = {};
  function W(b, k, tt) {
    this.props = b, this.context = k, this.refs = Q, this.updater = tt || at;
  }
  W.prototype.isReactComponent = {}, W.prototype.setState = function(b, k) {
    if (typeof b != "object" && typeof b != "function" && b != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, b, k, "setState");
  }, W.prototype.forceUpdate = function(b) {
    this.updater.enqueueForceUpdate(this, b, "forceUpdate");
  };
  function nt() {
  }
  nt.prototype = W.prototype;
  function G(b, k, tt) {
    this.props = b, this.context = k, this.refs = Q, this.updater = tt || at;
  }
  var h = G.prototype = new nt();
  h.constructor = G, Y(h, W.prototype), h.isPureReactComponent = !0;
  var E = Array.isArray;
  function S() {
  }
  var j = { H: null, A: null, T: null, S: null }, K = Object.prototype.hasOwnProperty;
  function st(b, k, tt) {
    var rt = tt.ref;
    return {
      $$typeof: i,
      type: b,
      key: k,
      ref: rt !== void 0 ? rt : null,
      props: tt
    };
  }
  function et(b, k) {
    return st(b.type, k, b.props);
  }
  function V(b) {
    return typeof b == "object" && b !== null && b.$$typeof === i;
  }
  function ut(b) {
    var k = { "=": "=0", ":": "=2" };
    return "$" + b.replace(/[=:]/g, function(tt) {
      return k[tt];
    });
  }
  var mt = /\/+/g;
  function vt(b, k) {
    return typeof b == "object" && b !== null && b.key != null ? ut("" + b.key) : k.toString(36);
  }
  function I(b) {
    switch (b.status) {
      case "fulfilled":
        return b.value;
      case "rejected":
        throw b.reason;
      default:
        switch (typeof b.status == "string" ? b.then(S, S) : (b.status = "pending", b.then(
          function(k) {
            b.status === "pending" && (b.status = "fulfilled", b.value = k);
          },
          function(k) {
            b.status === "pending" && (b.status = "rejected", b.reason = k);
          }
        )), b.status) {
          case "fulfilled":
            return b.value;
          case "rejected":
            throw b.reason;
        }
    }
    throw b;
  }
  function P(b, k, tt, rt, Rt) {
    var zt = typeof b;
    (zt === "undefined" || zt === "boolean") && (b = null);
    var gt = !1;
    if (b === null) gt = !0;
    else
      switch (zt) {
        case "bigint":
        case "string":
        case "number":
          gt = !0;
          break;
        case "object":
          switch (b.$$typeof) {
            case i:
            case r:
              gt = !0;
              break;
            case U:
              return gt = b._init, P(
                gt(b._payload),
                k,
                tt,
                rt,
                Rt
              );
          }
      }
    if (gt)
      return Rt = Rt(b), gt = rt === "" ? "." + vt(b, 0) : rt, E(Rt) ? (tt = "", gt != null && (tt = gt.replace(mt, "$&/") + "/"), P(Rt, k, tt, "", function(Et) {
        return Et;
      })) : Rt != null && (V(Rt) && (Rt = et(
        Rt,
        tt + (Rt.key == null || b && b.key === Rt.key ? "" : ("" + Rt.key).replace(
          mt,
          "$&/"
        ) + "/") + gt
      )), k.push(Rt)), 1;
    gt = 0;
    var ct = rt === "" ? "." : rt + ":";
    if (E(b))
      for (var w = 0; w < b.length; w++)
        rt = b[w], zt = ct + vt(rt, w), gt += P(
          rt,
          k,
          tt,
          zt,
          Rt
        );
    else if (w = X(b), typeof w == "function")
      for (b = w.call(b), w = 0; !(rt = b.next()).done; )
        rt = rt.value, zt = ct + vt(rt, w++), gt += P(
          rt,
          k,
          tt,
          zt,
          Rt
        );
    else if (zt === "object") {
      if (typeof b.then == "function")
        return P(
          I(b),
          k,
          tt,
          rt,
          Rt
        );
      throw k = String(b), Error(
        "Objects are not valid as a React child (found: " + (k === "[object Object]" ? "object with keys {" + Object.keys(b).join(", ") + "}" : k) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return gt;
  }
  function lt(b, k, tt) {
    if (b == null) return b;
    var rt = [], Rt = 0;
    return P(b, rt, "", "", function(zt) {
      return k.call(tt, zt, Rt++);
    }), rt;
  }
  function At(b) {
    if (b._status === -1) {
      var k = b._result, tt = k();
      tt.then(
        function(rt) {
          (b._status === 0 || b._status === -1) && (b._status = 1, b._result = rt, tt.status === void 0 && (tt.status = "fulfilled", tt.value = rt));
        },
        function(rt) {
          (b._status === 0 || b._status === -1) && (b._status = 2, b._result = rt, tt.status === void 0 && (tt.status = "rejected", tt.reason = rt));
        }
      ), b._status === -1 && (b._status = 0, b._result = tt);
    }
    if (b._status === 1) return b._result.default;
    throw b._result;
  }
  var ft = typeof reportError == "function" ? reportError : function(b) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var k = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof b == "object" && b !== null && typeof b.message == "string" ? String(b.message) : String(b),
        error: b
      });
      if (!window.dispatchEvent(k)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", b);
      return;
    }
    console.error(b);
  };
  function Ht(b) {
    var k = j.T, tt = {};
    tt.types = k !== null ? k.types : null, j.T = tt;
    try {
      var rt = b(), Rt = j.S;
      Rt !== null && Rt(tt, rt), typeof rt == "object" && rt !== null && typeof rt.then == "function" && rt.then(S, ft);
    } catch (zt) {
      ft(zt);
    } finally {
      k !== null && tt.types !== null && (k.types = tt.types), j.T = k;
    }
  }
  function fe(b) {
    var k = j.T;
    if (k !== null) {
      var tt = k.types;
      tt === null ? k.types = [b] : tt.indexOf(b) === -1 && tt.push(b);
    } else Ht(fe.bind(null, b));
  }
  var ce = {
    map: lt,
    forEach: function(b, k, tt) {
      lt(
        b,
        function() {
          k.apply(this, arguments);
        },
        tt
      );
    },
    count: function(b) {
      var k = 0;
      return lt(b, function() {
        k++;
      }), k;
    },
    toArray: function(b) {
      return lt(b, function(k) {
        return k;
      }) || [];
    },
    only: function(b) {
      if (!V(b))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return b;
    }
  };
  return Ct.Activity = g, Ct.Children = ce, Ct.Component = W, Ct.Fragment = s, Ct.Profiler = d, Ct.PureComponent = G, Ct.StrictMode = o, Ct.Suspense = R, Ct.ViewTransition = N, Ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = j, Ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(b) {
      return j.H.useMemoCache(b);
    }
  }, Ct.addTransitionType = fe, Ct.cache = function(b) {
    return function() {
      return b.apply(null, arguments);
    };
  }, Ct.cacheSignal = function() {
    return null;
  }, Ct.cloneElement = function(b, k, tt) {
    if (b == null)
      throw Error(
        "The argument must be a React element, but you passed " + b + "."
      );
    var rt = Y({}, b.props), Rt = b.key;
    if (k != null)
      for (zt in k.key !== void 0 && (Rt = "" + k.key), k)
        !K.call(k, zt) || zt === "key" || zt === "__self" || zt === "__source" || zt === "ref" && k.ref === void 0 || (rt[zt] = k[zt]);
    var zt = arguments.length - 2;
    if (zt === 1) rt.children = tt;
    else if (1 < zt) {
      for (var gt = Array(zt), ct = 0; ct < zt; ct++)
        gt[ct] = arguments[ct + 2];
      rt.children = gt;
    }
    return st(b.type, Rt, rt);
  }, Ct.createContext = function(b) {
    return b = {
      $$typeof: _,
      _currentValue: b,
      _currentValue2: b,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, b.Provider = b, b.Consumer = {
      $$typeof: m,
      _context: b
    }, b;
  }, Ct.createElement = function(b, k, tt) {
    var rt, Rt = {}, zt = null;
    if (k != null)
      for (rt in k.key !== void 0 && (zt = "" + k.key), k)
        K.call(k, rt) && rt !== "key" && rt !== "__self" && rt !== "__source" && (Rt[rt] = k[rt]);
    var gt = arguments.length - 2;
    if (gt === 1) Rt.children = tt;
    else if (1 < gt) {
      for (var ct = Array(gt), w = 0; w < gt; w++)
        ct[w] = arguments[w + 2];
      Rt.children = ct;
    }
    if (b && b.defaultProps)
      for (rt in gt = b.defaultProps, gt)
        Rt[rt] === void 0 && (Rt[rt] = gt[rt]);
    return st(b, zt, Rt);
  }, Ct.createRef = function() {
    return { current: null };
  }, Ct.forwardRef = function(b) {
    return { $$typeof: T, render: b };
  }, Ct.isValidElement = V, Ct.lazy = function(b) {
    return {
      $$typeof: U,
      _payload: { _status: -1, _result: b },
      _init: At
    };
  }, Ct.memo = function(b, k) {
    return {
      $$typeof: B,
      type: b,
      compare: k === void 0 ? null : k
    };
  }, Ct.startTransition = Ht, Ct.unstable_useCacheRefresh = function() {
    return j.H.useCacheRefresh();
  }, Ct.use = function(b) {
    return j.H.use(b);
  }, Ct.useActionState = function(b, k, tt) {
    return j.H.useActionState(b, k, tt);
  }, Ct.useCallback = function(b, k) {
    return j.H.useCallback(b, k);
  }, Ct.useContext = function(b) {
    return j.H.useContext(b);
  }, Ct.useDebugValue = function() {
  }, Ct.useDeferredValue = function(b, k) {
    return j.H.useDeferredValue(b, k);
  }, Ct.useEffect = function(b, k) {
    return j.H.useEffect(b, k);
  }, Ct.useEffectEvent = function(b) {
    return j.H.useEffectEvent(b);
  }, Ct.useId = function() {
    return j.H.useId();
  }, Ct.useImperativeHandle = function(b, k, tt) {
    return j.H.useImperativeHandle(b, k, tt);
  }, Ct.useInsertionEffect = function(b, k) {
    return j.H.useInsertionEffect(b, k);
  }, Ct.useLayoutEffect = function(b, k) {
    return j.H.useLayoutEffect(b, k);
  }, Ct.useMemo = function(b, k) {
    return j.H.useMemo(b, k);
  }, Ct.useOptimistic = function(b, k) {
    return j.H.useOptimistic(b, k);
  }, Ct.useReducer = function(b, k, tt) {
    return j.H.useReducer(b, k, tt);
  }, Ct.useRef = function(b) {
    return j.H.useRef(b);
  }, Ct.useState = function(b) {
    return j.H.useState(b);
  }, Ct.useSyncExternalStore = function(b, k, tt) {
    return j.H.useSyncExternalStore(
      b,
      k,
      tt
    );
  }, Ct.useTransition = function() {
    return j.H.useTransition();
  }, Ct.version = "19.3.0", Ct;
}
var km;
function Uf() {
  return km || (km = 1, of.exports = Fy()), of.exports;
}
var y = Uf();
const g2 = /* @__PURE__ */ Ky(y), ac = /* @__PURE__ */ Zy({
  __proto__: null,
  default: g2
}, [y]);
var sf = { exports: {} }, tc = {}, ff = { exports: {} }, df = {};
var Zm;
function Wy() {
  return Zm || (Zm = 1, (function(i) {
    function r(I, P) {
      var lt = I.length;
      I.push(P);
      t: for (; 0 < lt; ) {
        var At = lt - 1 >>> 1, ft = I[At];
        if (0 < d(ft, P))
          I[At] = P, I[lt] = ft, lt = At;
        else break t;
      }
    }
    function s(I) {
      return I.length === 0 ? null : I[0];
    }
    function o(I) {
      if (I.length === 0) return null;
      var P = I[0], lt = I.pop();
      if (lt !== P) {
        I[0] = lt;
        t: for (var At = 0, ft = I.length, Ht = ft >>> 1; At < Ht; ) {
          var fe = 2 * (At + 1) - 1, ce = I[fe], b = fe + 1, k = I[b];
          if (0 > d(ce, lt))
            b < ft && 0 > d(k, ce) ? (I[At] = k, I[b] = lt, At = b) : (I[At] = ce, I[fe] = lt, At = fe);
          else if (b < ft && 0 > d(k, lt))
            I[At] = k, I[b] = lt, At = b;
          else break t;
        }
      }
      return P;
    }
    function d(I, P) {
      var lt = I.sortIndex - P.sortIndex;
      return lt !== 0 ? lt : I.id - P.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      i.unstable_now = function() {
        return m.now();
      };
    } else {
      var _ = Date, T = _.now();
      i.unstable_now = function() {
        return _.now() - T;
      };
    }
    var R = [], B = [], U = 1, g = null, N = 3, F = !1, X = !1, at = !1, Y = !1, Q = typeof setTimeout == "function" ? setTimeout : null, W = typeof clearTimeout == "function" ? clearTimeout : null, nt = typeof setImmediate < "u" ? setImmediate : null;
    function G(I) {
      for (var P = s(B); P !== null; ) {
        if (P.callback === null) o(B);
        else if (P.startTime <= I)
          o(B), P.sortIndex = P.expirationTime, r(R, P);
        else break;
        P = s(B);
      }
    }
    function h(I) {
      if (at = !1, G(I), !X)
        if (s(R) !== null)
          X = !0, E || (E = !0, V());
        else {
          var P = s(B);
          P !== null && vt(h, P.startTime - I);
        }
    }
    var E = !1, S = -1, j = 5, K = -1;
    function st() {
      return Y ? !0 : !(i.unstable_now() - K < j);
    }
    function et() {
      if (Y = !1, E) {
        var I = i.unstable_now();
        K = I;
        var P = !0;
        try {
          t: {
            X = !1, at && (at = !1, W(S), S = -1), F = !0;
            var lt = N;
            try {
              e: {
                for (G(I), g = s(R); g !== null && !(g.expirationTime > I && st()); ) {
                  var At = g.callback;
                  if (typeof At == "function") {
                    g.callback = null, N = g.priorityLevel;
                    var ft = At(
                      g.expirationTime <= I
                    );
                    if (I = i.unstable_now(), typeof ft == "function") {
                      g.callback = ft, G(I), P = !0;
                      break e;
                    }
                    g === s(R) && o(R), G(I);
                  } else o(R);
                  g = s(R);
                }
                if (g !== null) P = !0;
                else {
                  var Ht = s(B);
                  Ht !== null && vt(
                    h,
                    Ht.startTime - I
                  ), P = !1;
                }
              }
              break t;
            } finally {
              g = null, N = lt, F = !1;
            }
            P = void 0;
          }
        } finally {
          P ? V() : E = !1;
        }
      }
    }
    var V;
    if (typeof nt == "function")
      V = function() {
        nt(et);
      };
    else if (typeof MessageChannel < "u") {
      var ut = new MessageChannel(), mt = ut.port2;
      ut.port1.onmessage = et, V = function() {
        mt.postMessage(null);
      };
    } else
      V = function() {
        Q(et, 0);
      };
    function vt(I, P) {
      S = Q(function() {
        I(i.unstable_now());
      }, P);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, i.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : j = 0 < I ? Math.floor(1e3 / I) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, i.unstable_next = function(I) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var P = 3;
          break;
        default:
          P = N;
      }
      var lt = N;
      N = P;
      try {
        return I();
      } finally {
        N = lt;
      }
    }, i.unstable_requestPaint = function() {
      Y = !0;
    }, i.unstable_runWithPriority = function(I, P) {
      switch (I) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          I = 3;
      }
      var lt = N;
      N = I;
      try {
        return P();
      } finally {
        N = lt;
      }
    }, i.unstable_scheduleCallback = function(I, P, lt) {
      var At = i.unstable_now();
      switch (typeof lt == "object" && lt !== null ? (lt = lt.delay, lt = typeof lt == "number" && 0 < lt ? At + lt : At) : lt = At, I) {
        case 1:
          var ft = -1;
          break;
        case 2:
          ft = 250;
          break;
        case 5:
          ft = 1073741823;
          break;
        case 4:
          ft = 1e4;
          break;
        default:
          ft = 5e3;
      }
      return ft = lt + ft, I = {
        id: U++,
        callback: P,
        priorityLevel: I,
        startTime: lt,
        expirationTime: ft,
        sortIndex: -1
      }, lt > At ? (I.sortIndex = lt, r(B, I), s(R) === null && I === s(B) && (at ? (W(S), S = -1) : at = !0, vt(h, lt - At))) : (I.sortIndex = ft, r(R, I), X || F || (X = !0, E || (E = !0, V()))), I;
    }, i.unstable_shouldYield = st, i.unstable_wrapCallback = function(I) {
      var P = N;
      return function() {
        var lt = N;
        N = P;
        try {
          return I.apply(this, arguments);
        } finally {
          N = lt;
        }
      };
    };
  })(df)), df;
}
var Km;
function $y() {
  return Km || (Km = 1, ff.exports = Wy()), ff.exports;
}
var hf = { exports: {} }, Ye = {};
var Jm;
function Py() {
  if (Jm) return Ye;
  Jm = 1;
  var i = Uf();
  function r(U) {
    var g = "https://react.dev/errors/" + U;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var N = 2; N < arguments.length; N++)
        g += "&args[]=" + encodeURIComponent(arguments[N]);
    }
    return "Minified React error #" + U + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var o = {
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
  }, d = /* @__PURE__ */ Symbol.for("react.portal"), m = /* @__PURE__ */ Symbol.for("react.recoverable"), _ = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function T(U, g, N) {
    var F = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: F == null ? null : F === _ ? _ : "" + F,
      children: U,
      containerInfo: g,
      implementation: N
    };
  }
  var R = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function B(U, g) {
    if (U === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return Ye.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Ye.browser = function(U) {
    return { $$typeof: m, _reason: U };
  }, Ye.createPortal = function(U, g) {
    var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(r(299));
    return T(U, g, null, N);
  }, Ye.flushSync = function(U) {
    var g = R.T, N = o.p;
    try {
      if (R.T = null, o.p = 2, U) return U();
    } finally {
      R.T = g, o.p = N, o.d.f();
    }
  }, Ye.preconnect = function(U, g) {
    typeof U == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, o.d.C(U, g));
  }, Ye.prefetchDNS = function(U) {
    typeof U == "string" && o.d.D(U);
  }, Ye.preinit = function(U, g) {
    if (typeof U == "string" && g && typeof g.as == "string") {
      var N = g.as, F = B(N, g.crossOrigin), X = typeof g.integrity == "string" ? g.integrity : void 0, at = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      N === "style" ? o.d.S(
        U,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: F,
          integrity: X,
          fetchPriority: at
        }
      ) : N === "script" && o.d.X(U, {
        crossOrigin: F,
        integrity: X,
        fetchPriority: at,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, Ye.preinitModule = function(U, g) {
    if (typeof U == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var N = B(
            g.as,
            g.crossOrigin
          );
          o.d.M(U, {
            crossOrigin: N,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
          });
        }
      } else g == null && o.d.M(U);
  }, Ye.preload = function(U, g) {
    if (typeof U == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var N = g.as, F = B(N, g.crossOrigin);
      o.d.L(U, N, {
        crossOrigin: F,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, Ye.preloadModule = function(U, g) {
    if (typeof U == "string")
      if (g) {
        var N = B(g.as, g.crossOrigin);
        o.d.m(U, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: N,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
        });
      } else o.d.m(U);
  }, Ye.requestFormReset = function(U) {
    o.d.r(U);
  }, Ye.unstable_batchedUpdates = function(U, g) {
    return U(g);
  }, Ye.useFormState = function(U, g, N) {
    return R.H.useFormState(U, g, N);
  }, Ye.useFormStatus = function() {
    return R.H.useHostTransitionStatus();
  }, Ye.version = "19.3.0", Ye;
}
var Im;
function y2() {
  if (Im) return hf.exports;
  Im = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (r) {
        console.error(r);
      }
  }
  return i(), hf.exports = Py(), hf.exports;
}
var Fm;
function tb() {
  if (Fm) return tc;
  Fm = 1;
  var i = $y(), r = Uf(), s = y2();
  function o(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function m(t) {
    for (var e = t, n = e; n && !n.alternate; )
      e = n, (e.flags & 4098) !== 0 && (t = e.return), n = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function _(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function T(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function R(t) {
    if (m(t) !== t)
      throw Error(o(188));
  }
  function B(t) {
    var e = t.alternate;
    if (!e) {
      if (e = m(t), e === null) throw Error(o(188));
      return e !== t ? null : t;
    }
    for (var n = t, l = e; ; ) {
      var a = n.return;
      if (a === null) break;
      var u = a.alternate;
      if (u === null) {
        if (l = a.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (a.child === u.child) {
        for (u = a.child; u; ) {
          if (u === n) return R(a), t;
          if (u === l) return R(a), e;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== l.return) n = a, l = u;
      else {
        for (var c = !1, f = a.child; f; ) {
          if (f === n) {
            c = !0, n = a, l = u;
            break;
          }
          if (f === l) {
            c = !0, l = a, n = u;
            break;
          }
          f = f.sibling;
        }
        if (!c) {
          for (f = u.child; f; ) {
            if (f === n) {
              c = !0, n = u, l = a;
              break;
            }
            if (f === l) {
              c = !0, l = u, n = a;
              break;
            }
            f = f.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (n.alternate !== l) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? t : e;
  }
  function U(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = U(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function g(t, e, n, l, a, u) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && n(t, l, a, u) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && g(
        t.child,
        e,
        n,
        l,
        a,
        u
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function N(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function F(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function X(t) {
    var e = [null, null], n = N(t);
    return n === null || at(
      e,
      t,
      n.child,
      { foundSelf: !1 }
    ), e;
  }
  function at(t, e, n, l) {
    for (; n !== null; ) {
      if (n === e) l.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (l.foundSelf) return t[1] = n, !0;
        t[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && at(
        t,
        e,
        n.child,
        l
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function Y(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(o(559));
    }
  }
  var Q = null, W = null;
  function nt(t, e, n) {
    return t === n ? !0 : t === e ? (Q = t, !0) : !1;
  }
  function G(t, e, n) {
    return t === n ? (W = t, !1) : t === e ? (W !== null && (Q = t), !0) : !1;
  }
  function h(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function E(t, e, n) {
    for (var l = 0, a = t; a; a = n(a)) l++;
    a = 0;
    for (var u = e; u; u = n(u)) a++;
    for (; 0 < l - a; ) t = n(t), l--;
    for (; 0 < a - l; ) e = n(e), a--;
    for (; l--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = n(t), e = n(e);
    }
    return null;
  }
  var S = Object.assign, j = /* @__PURE__ */ Symbol.for("react.element"), K = /* @__PURE__ */ Symbol.for("react.transitional.element"), st = /* @__PURE__ */ Symbol.for("react.portal"), et = /* @__PURE__ */ Symbol.for("react.fragment"), V = /* @__PURE__ */ Symbol.for("react.strict_mode"), ut = /* @__PURE__ */ Symbol.for("react.profiler"), mt = /* @__PURE__ */ Symbol.for("react.consumer"), vt = /* @__PURE__ */ Symbol.for("react.context"), I = /* @__PURE__ */ Symbol.for("react.forward_ref"), P = /* @__PURE__ */ Symbol.for("react.suspense"), lt = /* @__PURE__ */ Symbol.for("react.suspense_list"), At = /* @__PURE__ */ Symbol.for("react.memo"), ft = /* @__PURE__ */ Symbol.for("react.lazy"), Ht = /* @__PURE__ */ Symbol.for("react.activity"), fe = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), ce = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), b = /* @__PURE__ */ Symbol.for("react.view_transition"), k = /* @__PURE__ */ Symbol.for("react.recoverable"), tt = Symbol.iterator;
  function rt(t) {
    return t === null || typeof t != "object" ? null : (t = tt && t[tt] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var Rt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function zt(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === Rt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case et:
        return "Fragment";
      case ut:
        return "Profiler";
      case V:
        return "StrictMode";
      case P:
        return "Suspense";
      case lt:
        return "SuspenseList";
      case Ht:
        return "Activity";
      case b:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case st:
          return "Portal";
        case vt:
          return t.displayName || "Context";
        case mt:
          return (t._context.displayName || "Context") + ".Consumer";
        case I:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case At:
          return e = t.displayName || null, e !== null ? e : zt(t.type) || "Memo";
        case ft:
          e = t._payload, t = t._init;
          try {
            return zt(t(e));
          } catch {
          }
      }
    return null;
  }
  var gt = Array.isArray, ct = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, w = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Et = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Mt = [], kt = -1;
  function ae(t) {
    return { current: t };
  }
  function ee(t) {
    0 > kt || (t.current = Mt[kt], Mt[kt] = null, kt--);
  }
  function jt(t, e) {
    kt++, Mt[kt] = t.current, t.current = e;
  }
  var Ze = ae(null), on = ae(null), _n = ae(null), hl = ae(null);
  function Bn(t, e) {
    switch (jt(_n, e), jt(on, t), jt(Ze, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Wh(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Wh(e), t = $h(e, t);
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
    ee(Ze), jt(Ze, t);
  }
  function Ln() {
    ee(Ze), ee(on), ee(_n);
  }
  function Bl(t) {
    var e = t.memoizedState;
    e !== null && (Wu._currentValue = e.memoizedState, jt(hl, t)), e = Ze.current;
    var n = $h(e, t.type);
    e !== n && (jt(on, t), jt(Ze, n));
  }
  function ml(t) {
    on.current === t && (ee(Ze), ee(on)), hl.current === t && (ee(hl), Wu._currentValue = Et);
  }
  var Ll, Ca;
  function Tn(t) {
    if (Ll === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        Ll = e && e[1] || "", Ca = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Ll + t + Ca;
  }
  var pt = !1;
  function _t(t, e) {
    if (!t || pt) return "";
    pt = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var q = function() {
                throw Error();
              };
              if (Object.defineProperty(q.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(q, []);
                } catch ($) {
                  var C = $;
                }
                Reflect.construct(t, [], q);
              } else {
                try {
                  q.call();
                } catch ($) {
                  C = $;
                }
                q = !1;
                try {
                  var D = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), q = !0, new t();
                } finally {
                  q && (D !== void 0 ? Object.defineProperty(t.prototype, "props", D) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch ($) {
                C = $;
              }
              (q = t()) && typeof q.catch == "function" && q.catch(function() {
              });
            }
          } catch ($) {
            if ($ && C && typeof $.stack == "string")
              return [$.stack, C.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var a = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      a && a.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = l.DetermineComponentFrameRoot(), c = u[0], f = u[1];
      if (c && f) {
        var v = c.split(`
`), O = f.split(`
`);
        for (a = l = 0; l < v.length && !v[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; a < O.length && !O[a].includes(
          "DetermineComponentFrameRoot"
        ); )
          a++;
        if (l === v.length || a === O.length)
          for (l = v.length - 1, a = O.length - 1; 1 <= l && 0 <= a && v[l] !== O[a]; )
            a--;
        for (; 1 <= l && 0 <= a; l--, a--)
          if (v[l] !== O[a]) {
            if (l !== 1 || a !== 1)
              do
                if (l--, a--, 0 > a || v[l] !== O[a]) {
                  var M = `
` + v[l].replace(" at new ", " at ");
                  return t.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", t.displayName)), M;
                }
              while (1 <= l && 0 <= a);
            break;
          }
      }
    } finally {
      pt = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? Tn(n) : "";
  }
  function Gt(t, e) {
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
        return _t(t.type, !1);
      case 11:
        return _t(t.type.render, !1);
      case 1:
        return _t(t.type, !0);
      case 31:
        return Tn("Activity");
      case 30:
        return Tn("ViewTransition");
      default:
        return "";
    }
  }
  function me(t) {
    try {
      var e = "", n = null;
      do
        e += Gt(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var Cn = Object.prototype.hasOwnProperty, Oe = i.unstable_scheduleCallback, uu = i.unstable_cancelCallback, iu = i.unstable_shouldYield, Xr = i.unstable_requestPaint, Ke = i.unstable_now, oc = i.unstable_getCurrentPriorityLevel, Vl = i.unstable_ImmediatePriority, cu = i.unstable_UserBlockingPriority, en = i.unstable_NormalPriority, sc = i.unstable_LowPriority, ui = i.unstable_IdlePriority, fc = i.log, dc = i.unstable_setDisableYieldValue, ql = null, Xe = null;
  function ye(t) {
    if (typeof fc == "function" && dc(t), Xe && typeof Xe.setStrictMode == "function")
      try {
        Xe.setStrictMode(ql, t);
      } catch {
      }
  }
  var Ne = Math.clz32 ? Math.clz32 : Xl, Gl = Math.log, Yl = Math.LN2;
  function Xl(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (Gl(t) / Yl | 0) | 0;
  }
  var vl = 256, $n = 262144, Vn = 4194304;
  function gl(t) {
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
  function qn(t, e, n) {
    var l = t.pendingLanes;
    if (l === 0) return 0;
    var a = 0, u = t.suspendedLanes, c = t.pingedLanes;
    t = t.warmLanes;
    var f = l & 134217727;
    return f !== 0 ? (l = f & ~u, l !== 0 ? a = gl(l) : (c &= f, c !== 0 ? a = gl(c) : n || (n = f & ~t, n !== 0 && (a = gl(n))))) : (f = l & ~u, f !== 0 ? a = gl(f) : c !== 0 ? a = gl(c) : n || (n = l & ~t, n !== 0 && (a = gl(n)))), a === 0 ? 0 : e !== 0 && e !== a && (e & u) === 0 && (u = a & -a, n = e & -e, u >= n || u === 32 && (n & 4194048) !== 0) ? e : a;
  }
  function Gn(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Ql(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var l = 31 - Ne(n), a = 1 << l;
        e |= t[l], n &= ~a;
      }
    return e;
  }
  function ii(t, e) {
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
  function Yn() {
    var t = Vn;
    return Vn <<= 1, (Vn & 62914560) === 0 && (Vn = 4194304), t;
  }
  function ru(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function yl(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function ou(t, e, n, l, a, u) {
    var c = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var f = t.entanglements, v = t.expirationTimes, O = t.hiddenUpdates;
    for (n = c & ~n; 0 < n; ) {
      var M = 31 - Ne(n), q = 1 << M;
      f[M] = 0, v[M] = -1;
      var C = O[M];
      if (C !== null)
        for (O[M] = null, M = 0; M < C.length; M++) {
          var D = C[M];
          D !== null && (D.lane &= -536870913);
        }
      n &= ~q;
    }
    l !== 0 && Xn(t, l, 0), u !== 0 && a === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e));
  }
  function Xn(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var l = 31 - Ne(e);
    t.entangledLanes |= e, t.entanglements[l] = t.entanglements[l] | 1073741824 | n & 261930;
  }
  function su(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var l = 31 - Ne(n), a = 1 << l;
      a & e | t[l] & e && (t[l] |= e), n &= ~a;
    }
  }
  function Aa(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : kl(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function kl(t) {
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
  function An(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function On() {
    var t = w.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Hm(t.type));
  }
  function Oa(t, e) {
    var n = w.p;
    try {
      return w.p = t, e();
    } finally {
      w.p = n;
    }
  }
  var ve = Math.random().toString(36).slice(2), re = "__reactFiber$" + ve, Ue = "__reactProps$" + ve, sn = "__reactContainer$" + ve, ci = "__reactEvents$" + ve, fu = "__reactListeners$" + ve, du = "__reactHandles$" + ve, Zl = "__reactResources$" + ve, Na = "__reactMarker$" + ve, hu = "__reactLoad$" + ve;
  function mu(t) {
    delete t[re], delete t[Ue], delete t[fu], delete t[du];
  }
  function Qn(t) {
    var e;
    if (e = t[re]) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[sn] || n[re]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = vm(t); t !== null; ) {
            if (n = t[re]) return n;
            t = vm(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function Ra(t) {
    if (t = t[re] || t[sn]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function x(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(o(33));
  }
  function Z(t) {
    var e = t[Zl];
    return e || (e = t[Zl] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function J(t) {
    t[Na] = !0;
  }
  function dt(t) {
    t[hu] = void 0;
  }
  var Ot = /* @__PURE__ */ new Set(), Tt = {};
  function wt(t, e) {
    $t(t, e), $t(t + "Capture", e);
  }
  function $t(t, e) {
    for (Tt[t] = e, t = 0; t < e.length; t++)
      Ot.add(e[t]);
  }
  var Kt = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), bt = {}, Nt = {};
  function Qt(t) {
    return Cn.call(Nt, t) ? !0 : Cn.call(bt, t) ? !1 : Kt.test(t) ? Nt[t] = !0 : (bt[t] = !0, !1);
  }
  var yt = !1;
  function Ce() {
    var t = yt;
    return yt = !1, t;
  }
  function oe(t, e, n) {
    if (Qt(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var l = e.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, n);
      }
  }
  function fn(t, e, n) {
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
  function be(t, e, n, l) {
    if (l === null) t.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, l);
    }
  }
  function pe(t) {
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
  function vu(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function ri(t, e, n) {
    var l = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var a = l.get, u = l.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return a.call(this);
        },
        set: function(c) {
          n = "" + c, u.call(this, c);
        }
      }), Object.defineProperty(t, e, {
        enumerable: l.enumerable
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
  function bl(t) {
    if (!t._valueTracker) {
      var e = vu(t) ? "checked" : "value";
      t._valueTracker = ri(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function gu(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), l = "";
    return t && (l = vu(t) ? t.checked ? "true" : "false" : t.value), t = l, t !== n ? (e.setValue(t), !0) : !1;
  }
  var hc = /[\n"\\]/g;
  function ue(t) {
    return t.replace(
      hc,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Qe(t, e, n, l, a, u, c, f) {
    t.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.type = c : t.removeAttribute("type"), e != null ? c === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + pe(e)) : t.value !== "" + pe(e) && (t.value = "" + pe(e)) : c !== "submit" && c !== "reset" || t.removeAttribute("value"), e != null ? c === "number" && t.value == e ? yu(t, pe(t.value)) : yu(t, pe(e)) : n != null ? yu(t, pe(n)) : l != null && t.removeAttribute("value"), a == null && u != null && (t.defaultChecked = !!u), a != null && (t.checked = a && typeof a != "function" && typeof a != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.name = "" + pe(f) : t.removeAttribute("name");
  }
  function Kl(t, e, n, l, a, u, c, f) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (t.type = u), e != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || e != null)) {
        bl(t);
        return;
      }
      n = n != null ? "" + pe(n) : "", e = e != null ? "" + pe(e) : n, f || e === t.value || (t.value = e), t.defaultValue = e;
    }
    l = l ?? a, l = typeof l != "function" && typeof l != "symbol" && !!l, t.checked = f ? t.checked : !!l, t.defaultChecked = !!l, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.name = c), bl(t);
  }
  function yu(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function nn(t, e, n, l) {
    if (t = t.options, e) {
      e = {};
      for (var a = 0; a < n.length; a++)
        e["$" + n[a]] = !0;
      for (n = 0; n < t.length; n++)
        a = e.hasOwnProperty("$" + t[n].value), t[n].selected !== a && (t[n].selected = a), a && l && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + pe(n), e = null, a = 0; a < t.length; a++) {
        if (t[a].value === n) {
          t[a].selected = !0, l && (t[a].defaultSelected = !0);
          return;
        }
        e !== null || t[a].disabled || (e = t[a]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function bu(t, e, n) {
    if (e != null && (e = "" + pe(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + pe(n) : "";
  }
  function dn(t, e, n, l) {
    if (e == null) {
      if (l != null) {
        if (n != null) throw Error(o(92));
        if (gt(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), e = n;
    }
    n = pe(e), t.defaultValue = n, l = t.textContent, l === n && l !== "" && l !== null && (t.value = l), bl(t);
  }
  function Je(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Jl = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function oi(t, e, n) {
    var l = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : l ? t.setProperty(e, n) : typeof n != "number" || n === 0 || Jl.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function hn(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(o(62));
    if (t = t.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || e != null && e.hasOwnProperty(l) || (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "", yt = !0);
      for (var a in e)
        l = e[a], e.hasOwnProperty(a) && n[a] !== l && (oi(t, a, l), yt = !0);
    } else
      for (var u in e)
        e.hasOwnProperty(u) && oi(t, u, e[u]);
  }
  function za(t) {
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
  var si = /* @__PURE__ */ new Map([
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
  ]), fi = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function He(t) {
    return fi.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function Ie() {
  }
  var Da = null;
  function xa(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Yt = null, Re = null;
  function Nn(t) {
    var e = Ra(t);
    if (e && (t = e.stateNode)) {
      var n = t[Ue] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Qe(
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
              'input[name="' + ue(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var l = n[e];
              if (l !== t && l.form === t.form) {
                var a = l[Ue] || null;
                if (!a) throw Error(o(90));
                Qe(
                  l,
                  a.value,
                  a.defaultValue,
                  a.defaultValue,
                  a.checked,
                  a.defaultChecked,
                  a.type,
                  a.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              l = n[e], l.form === t.form && gu(l);
          }
          break t;
        case "textarea":
          bu(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && nn(t, !!n.multiple, e, !1);
      }
    }
  }
  var mn = !1;
  function Ma(t, e, n) {
    if (mn) return t(e, n);
    mn = !0;
    try {
      var l = t(e);
      return l;
    } finally {
      if (mn = !1, (Yt !== null || Re !== null) && (hr(), Yt && (e = Yt, t = Re, Re = Yt = null, Nn(e), t)))
        for (e = 0; e < t.length; e++) Nn(t[e]);
    }
  }
  function pl(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var l = n[Ue] || null;
    if (l === null) return null;
    n = l[e];
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
        (l = !l.disabled) || (t = t.type, l = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !l;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        o(231, e, typeof n)
      );
    return n;
  }
  var je = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), wa = !1;
  if (je)
    try {
      var di = {};
      Object.defineProperty(di, "passive", {
        get: function() {
          wa = !0;
        }
      }), window.addEventListener("test", di, di), window.removeEventListener("test", di, di);
    } catch {
      wa = !1;
    }
  var Il = null, Qr = null, mc = null;
  function Kf() {
    if (mc) return mc;
    var t, e = Qr, n = e.length, l, a = "value" in Il ? Il.value : Il.textContent, u = a.length;
    for (t = 0; t < n && e[t] === a[t]; t++) ;
    var c = n - t;
    for (l = 1; l <= c && e[n - l] === a[u - l]; l++) ;
    return mc = a.slice(t, 1 < l ? 1 - l : void 0);
  }
  function vc(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function gc() {
    return !0;
  }
  function Jf() {
    return !1;
  }
  function Fe(t) {
    function e(n, l, a, u, c) {
      this._reactName = n, this._targetInst = a, this.type = l, this.nativeEvent = u, this.target = c, this.currentTarget = null;
      for (var f in t)
        t.hasOwnProperty(f) && (n = t[f], this[f] = n ? n(u) : u[f]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? gc : Jf, this.isPropagationStopped = Jf, this;
    }
    return S(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = gc);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = gc);
      },
      persist: function() {
      },
      isPersistent: gc
    }), e;
  }
  var Fl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, yc = Fe(Fl), hi = S({}, Fl, { view: 0, detail: 0 }), yv = Fe(hi), kr, Zr, mi, bc = S({}, hi, {
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
    getModifierState: Jr,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== mi && (mi && t.type === "mousemove" ? (kr = t.screenX - mi.screenX, Zr = t.screenY - mi.screenY) : Zr = kr = 0, mi = t), kr);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Zr;
    }
  }), If = Fe(bc), bv = S({}, bc, { dataTransfer: 0 }), pv = Fe(bv), Sv = S({}, hi, { relatedTarget: 0 }), Kr = Fe(Sv), Ev = S({}, Fl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), _v = Fe(Ev), Tv = S({}, Fl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), Cv = Fe(Tv), Av = S({}, Fl, { data: 0 }), Ff = Fe(Av), Ov = {
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
  }, Nv = {
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
  }, Rv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function zv(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = Rv[t]) ? !!e[t] : !1;
  }
  function Jr() {
    return zv;
  }
  var Dv = S({}, hi, {
    key: function(t) {
      if (t.key) {
        var e = Ov[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = vc(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Nv[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Jr,
    charCode: function(t) {
      return t.type === "keypress" ? vc(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? vc(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), xv = Fe(Dv), Mv = S({}, bc, {
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
  }), Wf = Fe(Mv), wv = S({}, Fl, { submitter: 0 }), Uv = Fe(wv), Hv = S({}, hi, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Jr
  }), jv = Fe(Hv), Bv = S({}, Fl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Lv = Fe(Bv), Vv = S({}, bc, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), qv = Fe(Vv), Gv = S({}, Fl, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Yv = Fe(Gv), Xv = [9, 13, 27, 32], Ir = je && "CompositionEvent" in window, vi = null;
  je && "documentMode" in document && (vi = document.documentMode);
  var Qv = je && "TextEvent" in window && !vi, $f = je && (!Ir || vi && 8 < vi && 11 >= vi), Pf = " ", td = !1;
  function ed(t, e) {
    switch (t) {
      case "keyup":
        return Xv.indexOf(e.keyCode) !== -1;
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
  function nd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var pu = !1;
  function kv(t, e) {
    switch (t) {
      case "compositionend":
        return nd(e);
      case "keypress":
        return e.which !== 32 ? null : (td = !0, Pf);
      case "textInput":
        return t = e.data, t === Pf && td ? null : t;
      default:
        return null;
    }
  }
  function Zv(t, e) {
    if (pu)
      return t === "compositionend" || !Ir && ed(t, e) ? (t = Kf(), mc = Qr = Il = null, pu = !1, t) : null;
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
        return $f && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Kv = {
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
  function ld(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Kv[t.type] : e === "textarea";
  }
  function ad(t, e, n, l) {
    Yt ? Re ? Re.push(l) : Re = [l] : Yt = l, e = pr(e, "onChange"), 0 < e.length && (n = new yc(
      "onChange",
      "change",
      null,
      n,
      l
    ), t.push({ event: n, listeners: e }));
  }
  var gi = null, yi = null;
  function Jv(t) {
    kh(t, 0);
  }
  function pc(t) {
    var e = x(t);
    if (gu(e)) return t;
  }
  function ud(t, e) {
    if (t === "change") return e;
  }
  var id = !1;
  if (je) {
    var Fr;
    if (je) {
      var Wr = "oninput" in document;
      if (!Wr) {
        var cd = document.createElement("div");
        cd.setAttribute("oninput", "return;"), Wr = typeof cd.oninput == "function";
      }
      Fr = Wr;
    } else Fr = !1;
    id = Fr && (!document.documentMode || 9 < document.documentMode);
  }
  function rd() {
    gi && (gi.detachEvent("onpropertychange", od), yi = gi = null);
  }
  function od(t) {
    if (t.propertyName === "value" && pc(yi)) {
      var e = [];
      ad(
        e,
        yi,
        t,
        xa(t)
      ), Ma(Jv, e);
    }
  }
  function Iv(t, e, n) {
    t === "focusin" ? (rd(), gi = e, yi = n, gi.attachEvent("onpropertychange", od)) : t === "focusout" && rd();
  }
  function Fv(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return pc(yi);
  }
  function Wv(t, e) {
    if (t === "click") return pc(e);
  }
  function $v(t, e) {
    if (t === "input" || t === "change")
      return pc(e);
  }
  function Pv(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var vn = typeof Object.is == "function" ? Object.is : Pv;
  function bi(t, e) {
    if (vn(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), l = Object.keys(e);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var a = n[l];
      if (!Cn.call(e, a) || !vn(t[a], e[a]))
        return !1;
    }
    return !0;
  }
  function $r(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function sd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function fd(t, e) {
    var n = sd(t);
    t = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (l = t + n.textContent.length, t <= e && l >= e)
          return { node: n, offset: e - t };
        t = l;
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
      n = sd(n);
    }
  }
  function dd(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? dd(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function hd(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = $r(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = $r(t.document);
    }
    return e;
  }
  function Pr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var tg = je && "documentMode" in document && 11 >= document.documentMode, Su = null, to = null, pi = null, eo = !1;
  function md(t, e, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    eo || Su == null || Su !== $r(l) || (l = Su, "selectionStart" in l && Pr(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), pi && bi(pi, l) || (pi = l, l = pr(to, "onSelect"), 0 < l.length && (e = new yc(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: l }), e.target = Su)));
  }
  function Ua(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var Eu = {
    animationend: Ua("Animation", "AnimationEnd"),
    animationiteration: Ua("Animation", "AnimationIteration"),
    animationstart: Ua("Animation", "AnimationStart"),
    transitionrun: Ua("Transition", "TransitionRun"),
    transitionstart: Ua("Transition", "TransitionStart"),
    transitioncancel: Ua("Transition", "TransitionCancel"),
    transitionend: Ua("Transition", "TransitionEnd")
  }, no = {}, vd = {};
  je && (vd = document.createElement("div").style, "AnimationEvent" in window || (delete Eu.animationend.animation, delete Eu.animationiteration.animation, delete Eu.animationstart.animation), "TransitionEvent" in window || delete Eu.transitionend.transition);
  function Ha(t) {
    if (no[t]) return no[t];
    if (!Eu[t]) return t;
    var e = Eu[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in vd)
        return no[t] = e[n];
    return t;
  }
  var gd = Ha("animationend"), yd = Ha("animationiteration"), bd = Ha("animationstart"), eg = Ha("transitionrun"), ng = Ha("transitionstart"), lg = Ha("transitioncancel"), pd = Ha("transitionend"), Sd = /* @__PURE__ */ new Map(), lo = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  lo.push("scrollEnd");
  function kn(t, e) {
    Sd.set(t, e), wt(e, [t]);
  }
  var ag = 0;
  function Sl(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = In.identifierPrefix;
    var n = ag++;
    return t = "_" + t + "t_" + n.toString(32) + "_", e.autoName = t;
  }
  function Ed(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, n = Gu;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var a = t[n[l]];
        if (a != null) {
          if (a === "none") return "none";
          e = e == null ? a : e + (" " + a);
        }
      }
    return e ?? t.default;
  }
  function El(t, e) {
    return t = Ed(t), e = Ed(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var Sc = typeof reportError == "function" ? reportError : function(t) {
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
  }, Rn = [], _u = 0, ao = 0;
  function Ec() {
    for (var t = _u, e = ao = _u = 0; e < t; ) {
      var n = Rn[e];
      Rn[e++] = null;
      var l = Rn[e];
      Rn[e++] = null;
      var a = Rn[e];
      Rn[e++] = null;
      var u = Rn[e];
      if (Rn[e++] = null, l !== null && a !== null) {
        var c = l.pending;
        c === null ? a.next = a : (a.next = c.next, c.next = a), l.pending = a;
      }
      u !== 0 && _d(n, a, u);
    }
  }
  function _c(t, e, n, l) {
    Rn[_u++] = t, Rn[_u++] = e, Rn[_u++] = n, Rn[_u++] = l, ao |= l, t.lanes |= l, t = t.alternate, t !== null && (t.lanes |= l);
  }
  function uo(t, e, n, l) {
    return _c(t, e, n, l), Tc(t);
  }
  function ja(t, e) {
    return _c(t, null, null, e), Tc(t);
  }
  function _d(t, e, n) {
    t.lanes |= n;
    var l = t.alternate;
    l !== null && (l.lanes |= n);
    for (var a = !1, u = t.return; u !== null; )
      u.childLanes |= n, l = u.alternate, l !== null && (l.childLanes |= n), u.tag === 22 && (t = u.stateNode, t === null || t._visibility & 1 || (a = !0)), t = u, u = u.return;
    return t.tag === 3 ? (u = t.stateNode, a && e !== null && (a = 31 - Ne(n), t = u.hiddenUpdates, l = t[a], l === null ? t[a] = [e] : l.push(e), e.lane = n | 536870912), u) : null;
  }
  function Tc(t) {
    if (50 < Gi)
      throw Gi = 0, dr = null, Error(o(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var Tu = {};
  function ug(t, e, n, l) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ln(t, e, n, l) {
    return new ug(t, e, n, l);
  }
  function io(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function _l(t, e) {
    var n = t.alternate;
    return n === null ? (n = ln(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 1206910976, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function Td(t, e) {
    t.flags &= 1206910978;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Cc(t, e, n, l, a, u) {
    var c = 0;
    if (l = t, typeof l == "function") io(l) && (c = 1);
    else if (typeof l == "string")
      c = wy(
        t,
        n,
        Ze.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (l) {
        case Ht:
          return t = ln(31, n, e, a), t.elementType = Ht, t.lanes = u, t;
        case et:
          return Ba(n.children, a, u, e);
        case V:
          c = 8, a |= 24;
          break;
        case ut:
          return t = ln(12, n, e, a | 2), t.elementType = ut, t.lanes = u, t;
        case P:
          return t = ln(13, n, e, a), t.elementType = P, t.lanes = u, t;
        case lt:
          return t = ln(19, n, e, a), t.elementType = lt, t.lanes = u, t;
        case fe:
        case b:
          return t = a | 32, t = ln(30, n, e, t), t.elementType = b, t.lanes = u, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case vt:
                c = 10;
                break t;
              case mt:
                c = 9;
                break t;
              case I:
                c = 11;
                break t;
              case At:
                c = 14;
                break t;
              case ft:
                c = 16, l = null;
                break t;
            }
          c = 29, n = Error(
            o(130, t === null ? "null" : typeof t, "")
          ), l = null;
      }
    return e = ln(c, n, e, a), e.elementType = t, e.type = l, e.lanes = u, e;
  }
  function Ba(t, e, n, l) {
    return t = ln(7, t, l, e), t.lanes = n, t;
  }
  function co(t, e, n) {
    return t = ln(6, t, null, e), t.lanes = n, t;
  }
  function Cd(t) {
    var e = ln(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function ro(t, e, n) {
    return e = ln(
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
  var Ad = /* @__PURE__ */ new WeakMap();
  function zn(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = Ad.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: me(e)
      }, Ad.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: me(e)
    };
  }
  var Cu = [], Au = 0, Ac = null, Si = 0, Dn = [], xn = 0, Wl = null, Pn = 1, tl = "";
  function Tl(t, e) {
    Cu[Au++] = Si, Cu[Au++] = Ac, Ac = t, Si = e;
  }
  function Od(t, e, n) {
    Dn[xn++] = Pn, Dn[xn++] = tl, Dn[xn++] = Wl, Wl = t;
    var l = Pn;
    t = tl;
    var a = 32 - Ne(l) - 1;
    l &= ~(1 << a), n += 1;
    var u = 32 - Ne(e) + a;
    if (30 < u) {
      var c = a - a % 5;
      u = (l & (1 << c) - 1).toString(32), l >>= c, a -= c, Pn = 1 << 32 - Ne(e) + a | n << a | l, tl = u + t;
    } else
      Pn = 1 << u | n << a | l, tl = t;
  }
  function Oc(t) {
    t.return !== null && (Tl(t, 1), Od(t, 1, 0));
  }
  function oo(t) {
    for (; t === Ac; )
      Ac = Cu[--Au], Cu[Au] = null, Si = Cu[--Au], Cu[Au] = null;
    for (; t === Wl; )
      Wl = Dn[--xn], Dn[xn] = null, tl = Dn[--xn], Dn[xn] = null, Pn = Dn[--xn], Dn[xn] = null;
  }
  function Nd(t, e) {
    Dn[xn++] = Pn, Dn[xn++] = tl, Dn[xn++] = Wl, Pn = e.id, tl = e.overflow, Wl = t;
  }
  var ze = null, ne = null, Ut = !1, $l = null, Mn = !1, so = Error(o(519));
  function Pl(t) {
    var e = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ei(zn(e, t)), so;
  }
  function Rd(t) {
    var e = t.stateNode, n = t.type, l = t.memoizedProps;
    switch (e[re] = t, e[Ue] = l, n) {
      case "dialog":
        Lt("cancel", e), Lt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        Lt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Xi.length; n++)
          Lt(Xi[n], e);
        break;
      case "source":
        Lt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        Lt("error", e), Lt("load", e);
        break;
      case "details":
        Lt("toggle", e);
        break;
      case "input":
        Lt("invalid", e), Kl(
          e,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        Lt("invalid", e);
        break;
      case "textarea":
        Lt("invalid", e), dn(e, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || l.suppressHydrationWarning === !0 || Ih(e.textContent, n) ? (l.popover != null && (Lt("beforetoggle", e), Lt("toggle", e)), l.onScroll != null && Lt("scroll", e), l.onScrollEnd != null && Lt("scrollend", e), l.onClick != null && (e.onclick = Ie), e = !0) : e = !1, e || Pl(t, !0);
  }
  function Nc(t) {
    for (ze = t.return; ze; )
      switch (ze.tag) {
        case 5:
        case 31:
        case 13:
          Mn = !1;
          return;
        case 27:
        case 3:
          Mn = !0;
          return;
        default:
          ze = ze.return;
      }
  }
  function Ou(t) {
    if (t !== ze) return !1;
    if (!Ut) return Nc(t), Ut = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Gs(t.type, t.memoizedProps)), n = !n), n && ne && Pl(t), Nc(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      ne = mm(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      ne = mm(t);
    } else
      e === 27 ? (e = ne, va(t.type) ? (t = Fs, Fs = null, ne = t) : ne = e) : ne = ze ? Un(t.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    ne = ze = null, Ut = !1;
  }
  function fo() {
    var t = $l;
    return t !== null && (cn === null ? cn = t : cn.push.apply(
      cn,
      t
    ), $l = null), t;
  }
  function Ei(t) {
    $l === null ? $l = [t] : $l.push(t);
  }
  var ho = ae(null), Va = null, Cl = null;
  function ta(t, e, n) {
    jt(ho, e._currentValue), e._currentValue = n;
  }
  function Al(t) {
    t._currentValue = ho.current, ee(ho);
  }
  function Rc(t, e, n) {
    for (; t !== null; ) {
      var l = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, l !== null && (l.childLanes |= e)) : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function mo(t, e, n, l) {
    var a = t.child;
    for (a !== null && (a.return = t); a !== null; ) {
      var u = a.dependencies;
      if (u !== null) {
        var c = a.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var f = u;
          u = a;
          for (var v = 0; v < e.length; v++)
            if (f.context === e[v]) {
              u.lanes |= n, f = u.alternate, f !== null && (f.lanes |= n), Rc(
                u.return,
                n,
                t
              ), l || (c = null);
              break t;
            }
          u = f.next;
        }
      } else if (a.tag === 18) {
        if (c = a.return, c === null) throw Error(o(341));
        c.lanes |= n, u = c.alternate, u !== null && (u.lanes |= n), Rc(c, n, t), c = null;
      } else
        a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, c = a.alternate, c !== null && (c.lanes |= n), Rc(
          a.return,
          n,
          t
        ), c = a.child, c = c !== null ? c.sibling : null) : c = a.child;
      if (c !== null) c.return = a;
      else
        for (c = a; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (a = c.sibling, a !== null) {
            a.return = c.return, c = a;
            break;
          }
          c = c.return;
        }
      a = c;
    }
  }
  function qa(t, e, n, l) {
    t = null;
    for (var a = e, u = !1; a !== null; ) {
      if (!u) {
        if ((a.flags & 524288) !== 0) u = !0;
        else if ((a.flags & 262144) !== 0) break;
      }
      if (a.tag === 10) {
        var c = a.alternate;
        if (c === null) throw Error(o(387));
        if (c = c.memoizedProps, c !== null) {
          var f = a.type;
          vn(a.pendingProps.value, c.value) || (t !== null ? t.push(f) : t = [f]);
        }
      } else if (a === hl.current) {
        if (c = a.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== a.memoizedState.memoizedState && (t !== null ? t.push(Wu) : t = [Wu]);
      }
      a = a.return;
    }
    return t !== null && mo(
      e,
      t,
      n,
      l
    ), e.flags |= 262144, t !== null;
  }
  function zc(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!vn(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Ga(t) {
    Va = t, Cl = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function Be(t) {
    return zd(Va, t);
  }
  function Dc(t, e) {
    return Va === null && Ga(t), zd(t, e);
  }
  function zd(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, Cl === null) {
      if (t === null) throw Error(o(308));
      Cl = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else Cl = Cl.next = e;
    return n;
  }
  var ig = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, l) {
        t.push(l);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, cg = i.unstable_scheduleCallback, rg = i.unstable_NormalPriority, Se = {
    $$typeof: vt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function vo() {
    return {
      controller: new ig(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function _i(t) {
    t.refCount--, t.refCount === 0 && cg(rg, function() {
      t.controller.abort();
    });
  }
  function Dd(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var n = t.transitionTypes;
      for (n === null && (n = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var l = e[t];
        n.indexOf(l) === -1 && n.push(l);
      }
    }
  }
  var Ti = null;
  function og(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var Ci = null, go = 0, Ya = 0, Nu = null;
  function sg(t, e) {
    if (Ci === null) {
      var n = Ci = [];
      go = 0, Ya = Ms(), Nu = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return go++, e.then(xd, xd), e;
  }
  function xd() {
    if (--go === 0 && (Ti = null, Ci !== null)) {
      Nu !== null && (Nu.status = "fulfilled");
      var t = Ci;
      Ci = null, Ya = 0, Nu = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function fg(t, e) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(a) {
        n.push(a);
      }
    };
    return t.then(
      function() {
        l.status = "fulfilled", l.value = e;
        for (var a = 0; a < n.length; a++) (0, n[a])(e);
      },
      function(a) {
        for (l.status = "rejected", l.reason = a, a = 0; a < n.length; a++)
          (0, n[a])(void 0);
      }
    ), l;
  }
  var Md = ct.S;
  ct.S = function(t, e) {
    if (Ch = Ke(), typeof e == "object" && e !== null && typeof e.then == "function" && sg(t, e), Ti !== null)
      for (var n = ku; n !== null; )
        Dd(n, Ti), n = n.next;
    if (n = t.types, n !== null) {
      for (var l = ku; l !== null; )
        Dd(l, n), l = l.next;
      if (Ya !== 0) {
        l = Ti, l === null && (l = Ti = []);
        for (var a = 0; a < n.length; a++) {
          var u = n[a];
          l.indexOf(u) === -1 && l.push(u);
        }
      }
    }
    Md !== null && Md(t, e);
  };
  var Xa = ae(null);
  function yo() {
    var t = Xa.current;
    return t !== null ? t : te.pooledCache;
  }
  function xc(t, e) {
    e === null ? jt(Xa, Xa.current) : jt(Xa, e.pool);
  }
  function wd() {
    var t = yo();
    return t === null ? null : { parent: Se._currentValue, pool: t };
  }
  var Ru = Error(o(460)), bo = Error(o(474)), Mc = Error(o(542)), wc = { then: function() {
  } };
  function Ud(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Hd(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(Ie, Ie), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, Bd(t), t === void 0 && !("reason" in e) ? Error(o(600)) : t;
      default:
        if (typeof e.status == "string") e.then(Ie, Ie);
        else {
          if (t = te, t !== null && 100 < t.shellSuspendCounter)
            throw Error(o(482));
          t = e, t.status = "pending", t.then(
            function(l) {
              if (e.status === "pending") {
                var a = e;
                a.status = "fulfilled", a.value = l;
              }
            },
            function(l) {
              if (e.status === "pending") {
                var a = e;
                a.status = "rejected", a.reason = l;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, Bd(t), t;
        }
        throw ka = e, Ru;
    }
  }
  function Qa(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (ka = n, Ru) : n;
    }
  }
  var ka = null;
  function jd() {
    if (ka === null) throw Error(o(459));
    var t = ka;
    return ka = null, t;
  }
  function Bd(t) {
    if (t === Ru || t === Mc)
      throw Error(o(483));
  }
  var zu = null, Ai = 0;
  function Uc(t) {
    var e = Ai;
    return Ai += 1, zu === null && (zu = []), Hd(zu, t, e);
  }
  function ea(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Hc(t, e) {
    throw e.$$typeof === j ? Error(o(525)) : (t = Object.prototype.toString.call(e), Error(
      o(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Ld(t) {
    function e(A, p) {
      if (t) {
        var z = A.deletions;
        z === null ? (A.deletions = [p], A.flags |= 16) : z.push(p);
      }
    }
    function n(A, p) {
      if (!t) return null;
      for (; p !== null; )
        e(A, p), p = p.sibling;
      return null;
    }
    function l(A) {
      for (var p = /* @__PURE__ */ new Map(); A !== null; )
        A.key === null ? p.set(A.index, A) : p.set(A.key, A), A = A.sibling;
      return p;
    }
    function a(A, p) {
      return A = _l(A, p), A.index = 0, A.sibling = null, A;
    }
    function u(A, p, z) {
      return A.index = z, t ? (z = A.alternate, z !== null ? (z = z.index, z < p ? (A.flags |= 2, p) : z) : (A.flags |= 134217730, p)) : (A.flags |= 1048576, p);
    }
    function c(A) {
      return t && A.alternate === null && (A.flags |= 134217730), A;
    }
    function f(A, p, z, L) {
      return p === null || p.tag !== 6 ? (p = co(z, A.mode, L), p.return = A, p) : (p = a(p, z), p.return = A, p);
    }
    function v(A, p, z, L) {
      var it = z.type;
      return it === et ? (A = M(
        A,
        p,
        z.props.children,
        L,
        z.key
      ), ea(A, z), A) : p !== null && (p.elementType === it || typeof it == "object" && it !== null && it.$$typeof === ft && Qa(it) === p.type) ? (p = a(p, z.props), ea(p, z), p.return = A, p) : (p = Cc(
        z.type,
        z.key,
        z.props,
        null,
        A.mode,
        L
      ), ea(p, z), p.return = A, p);
    }
    function O(A, p, z, L) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== z.containerInfo || p.stateNode.implementation !== z.implementation ? (p = ro(z, A.mode, L), p.return = A, p) : (p = a(p, z.children || []), p.return = A, p);
    }
    function M(A, p, z, L, it) {
      return p === null || p.tag !== 7 ? (p = Ba(
        z,
        A.mode,
        L,
        it
      ), p.return = A, p) : (p = a(p, z), p.return = A, p);
    }
    function q(A, p, z) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint")
        return p = co(
          "" + p,
          A.mode,
          z
        ), p.return = A, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case K:
            return z = Cc(
              p.type,
              p.key,
              p.props,
              null,
              A.mode,
              z
            ), ea(z, p), z.return = A, z;
          case st:
            return p = ro(
              p,
              A.mode,
              z
            ), p.return = A, p;
          case ft:
            return p = Qa(p), q(A, p, z);
        }
        if (gt(p) || rt(p))
          return p = Ba(
            p,
            A.mode,
            z,
            null
          ), p.return = A, p;
        if (typeof p.then == "function")
          return q(A, Uc(p), z);
        if (p.$$typeof === vt)
          return q(
            A,
            Dc(A, p),
            z
          );
        Hc(A, p);
      }
      return null;
    }
    function C(A, p, z, L) {
      var it = p !== null ? p.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint")
        return it !== null ? null : f(A, p, "" + z, L);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case K:
            return z.key === it ? v(A, p, z, L) : null;
          case st:
            return z.key === it ? O(A, p, z, L) : null;
          case ft:
            return z = Qa(z), C(A, p, z, L);
        }
        if (gt(z) || rt(z))
          return it !== null ? null : M(A, p, z, L, null);
        if (typeof z.then == "function")
          return C(
            A,
            p,
            Uc(z),
            L
          );
        if (z.$$typeof === vt)
          return C(
            A,
            p,
            Dc(A, z),
            L
          );
        Hc(A, z);
      }
      return null;
    }
    function D(A, p, z, L, it) {
      if (typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint")
        return A = A.get(z) || null, f(p, A, "" + L, it);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case K:
            return A = A.get(
              L.key === null ? z : L.key
            ) || null, v(p, A, L, it);
          case st:
            return A = A.get(
              L.key === null ? z : L.key
            ) || null, O(p, A, L, it);
          case ft:
            return L = Qa(L), D(
              A,
              p,
              z,
              L,
              it
            );
        }
        if (gt(L) || rt(L))
          return A = A.get(z) || null, M(p, A, L, it, null);
        if (typeof L.then == "function")
          return D(
            A,
            p,
            z,
            Uc(L),
            it
          );
        if (L.$$typeof === vt)
          return D(
            A,
            p,
            z,
            Dc(p, L),
            it
          );
        Hc(p, L);
      }
      return null;
    }
    function $(A, p, z, L) {
      for (var it = null, qt = null, ht = p, St = p = 0, Te = null; ht !== null && St < z.length; St++) {
        ht.index > St ? (Te = ht, ht = null) : Te = ht.sibling;
        var Xt = C(
          A,
          ht,
          z[St],
          L
        );
        if (Xt === null) {
          ht === null && (ht = Te);
          break;
        }
        t && ht && Xt.alternate === null && e(A, ht), p = u(Xt, p, St), qt === null ? it = Xt : qt.sibling = Xt, qt = Xt, ht = Te;
      }
      if (St === z.length)
        return n(A, ht), Ut && Tl(A, St), it;
      if (ht === null) {
        for (; St < z.length; St++)
          ht = q(A, z[St], L), ht !== null && (p = u(
            ht,
            p,
            St
          ), qt === null ? it = ht : qt.sibling = ht, qt = ht);
        return Ut && Tl(A, St), it;
      }
      for (ht = l(ht); St < z.length; St++)
        Te = D(
          ht,
          A,
          St,
          z[St],
          L
        ), Te !== null && (t && (Xt = Te.alternate, Xt !== null && ht.delete(Xt.key === null ? St : Xt.key)), p = u(
          Te,
          p,
          St
        ), qt === null ? it = Te : qt.sibling = Te, qt = Te);
      return t && ht.forEach(function(Sa) {
        return e(A, Sa);
      }), Ut && Tl(A, St), it;
    }
    function ot(A, p, z, L) {
      if (z == null) throw Error(o(151));
      for (var it = null, qt = null, ht = p, St = p = 0, Te = null, Xt = z.next(); ht !== null && !Xt.done; St++, Xt = z.next()) {
        ht.index > St ? (Te = ht, ht = null) : Te = ht.sibling;
        var Sa = C(A, ht, Xt.value, L);
        if (Sa === null) {
          ht === null && (ht = Te);
          break;
        }
        t && ht && Sa.alternate === null && e(A, ht), p = u(Sa, p, St), qt === null ? it = Sa : qt.sibling = Sa, qt = Sa, ht = Te;
      }
      if (Xt.done)
        return n(A, ht), Ut && Tl(A, St), it;
      if (ht === null) {
        for (; !Xt.done; St++, Xt = z.next())
          Xt = q(A, Xt.value, L), Xt !== null && (p = u(Xt, p, St), qt === null ? it = Xt : qt.sibling = Xt, qt = Xt);
        return Ut && Tl(A, St), it;
      }
      for (ht = l(ht); !Xt.done; St++, Xt = z.next())
        Xt = D(ht, A, St, Xt.value, L), Xt !== null && (t && (Te = Xt.alternate, Te !== null && ht.delete(
          Te.key === null ? St : Te.key
        )), p = u(Xt, p, St), qt === null ? it = Xt : qt.sibling = Xt, qt = Xt);
      return t && ht.forEach(function(ky) {
        return e(A, ky);
      }), Ut && Tl(A, St), it;
    }
    function xt(A, p, z, L) {
      if (typeof z == "object" && z !== null && z.type === et && z.key === null && z.props.ref === void 0 && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case K:
            t: {
              for (var it = z.key; p !== null; ) {
                if (p.key === it) {
                  if (it = z.type, it === et) {
                    if (p.tag === 7) {
                      n(
                        A,
                        p.sibling
                      ), L = a(
                        p,
                        z.props.children
                      ), ea(L, z), L.return = A, A = L;
                      break t;
                    }
                  } else if (p.elementType === it || typeof it == "object" && it !== null && it.$$typeof === ft && Qa(it) === p.type) {
                    n(
                      A,
                      p.sibling
                    ), L = a(p, z.props), ea(L, z), L.return = A, A = L;
                    break t;
                  }
                  n(A, p);
                  break;
                } else e(A, p);
                p = p.sibling;
              }
              z.type === et ? (L = Ba(
                z.props.children,
                A.mode,
                L,
                z.key
              ), ea(L, z), L.return = A, A = L) : (L = Cc(
                z.type,
                z.key,
                z.props,
                null,
                A.mode,
                L
              ), ea(L, z), L.return = A, A = L);
            }
            return c(A);
          case st:
            t: {
              for (it = z.key; p !== null; ) {
                if (p.key === it)
                  if (p.tag === 4 && p.stateNode.containerInfo === z.containerInfo && p.stateNode.implementation === z.implementation) {
                    n(
                      A,
                      p.sibling
                    ), L = a(p, z.children || []), L.return = A, A = L;
                    break t;
                  } else {
                    n(A, p);
                    break;
                  }
                else e(A, p);
                p = p.sibling;
              }
              L = ro(z, A.mode, L), L.return = A, A = L;
            }
            return c(A);
          case ft:
            return z = Qa(z), xt(
              A,
              p,
              z,
              L
            );
        }
        if (gt(z))
          return $(
            A,
            p,
            z,
            L
          );
        if (rt(z)) {
          if (it = rt(z), typeof it != "function") throw Error(o(150));
          return z = it.call(z), ot(
            A,
            p,
            z,
            L
          );
        }
        if (typeof z.then == "function")
          return xt(
            A,
            p,
            Uc(z),
            L
          );
        if (z.$$typeof === vt)
          return xt(
            A,
            p,
            Dc(A, z),
            L
          );
        Hc(A, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint" ? (z = "" + z, p !== null && p.tag === 6 ? (n(A, p.sibling), L = a(p, z), L.return = A, A = L) : (n(A, p), L = co(z, A.mode, L), L.return = A, A = L), c(A)) : n(A, p);
    }
    return function(A, p, z, L) {
      try {
        Ai = 0;
        var it = xt(
          A,
          p,
          z,
          L
        );
        return zu = null, it;
      } catch (ht) {
        if (ht === Ru || ht === Mc) throw ht;
        var qt = ln(29, ht, null, A.mode);
        return qt.lanes = L, qt.return = A, qt;
      }
    };
  }
  var Za = Ld(!0), Vd = Ld(!1), na = !1;
  function po(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function So(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function la(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function aa(t, e, n) {
    var l = t.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Zt & 2) !== 0) {
      var a = l.pending;
      return a === null ? e.next = e : (e.next = a.next, a.next = e), l.pending = e, e = Tc(t), _d(t, null, n), e;
    }
    return _c(t, l, e, n), Tc(t);
  }
  function Oi(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var l = e.lanes;
      l &= t.pendingLanes, n |= l, e.lanes = n, su(t, n);
    }
  }
  function Eo(t, e) {
    var n = t.updateQueue, l = t.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var a = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var c = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? a = u = c : u = u.next = c, n = n.next;
        } while (n !== null);
        u === null ? a = u = e : u = u.next = e;
      } else a = u = e;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var _o = !1;
  function Ni() {
    if (_o) {
      var t = Nu;
      if (t !== null) throw t;
    }
  }
  function Ri(t, e, n, l) {
    _o = !1;
    var a = t.updateQueue;
    na = !1;
    var u = a.firstBaseUpdate, c = a.lastBaseUpdate, f = a.shared.pending;
    if (f !== null) {
      a.shared.pending = null;
      var v = f, O = v.next;
      v.next = null, c === null ? u = O : c.next = O, c = v;
      var M = t.alternate;
      M !== null && (M = M.updateQueue, f = M.lastBaseUpdate, f !== c && (f === null ? M.firstBaseUpdate = O : f.next = O, M.lastBaseUpdate = v));
    }
    if (u !== null) {
      var q = a.baseState;
      c = 0, M = O = v = null, f = u;
      do {
        var C = f.lane & -536870913, D = C !== f.lane;
        if (D ? (Vt & C) === C : (l & C) === C) {
          C !== 0 && C === Ya && (_o = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          t: {
            var $ = t, ot = f;
            C = e;
            var xt = n;
            switch (ot.tag) {
              case 1:
                if ($ = ot.payload, typeof $ == "function") {
                  q = $.call(xt, q, C);
                  break t;
                }
                q = $;
                break t;
              case 3:
                $.flags = $.flags & -65537 | 128;
              case 0:
                if ($ = ot.payload, C = typeof $ == "function" ? $.call(xt, q, C) : $, C == null) break t;
                q = S({}, q, C);
                break t;
              case 2:
                na = !0;
            }
          }
          C = f.callback, C !== null && (t.flags |= 64, D && (t.flags |= 8192), D = a.callbacks, D === null ? a.callbacks = [C] : D.push(C));
        } else
          D = {
            lane: C,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, M === null ? (O = M = D, v = q) : M = M.next = D, c |= C;
        if (f = f.next, f === null) {
          if (f = a.shared.pending, f === null)
            break;
          D = f, f = D.next, D.next = null, a.lastBaseUpdate = D, a.shared.pending = null;
        }
      } while (!0);
      M === null && (v = q), a.baseState = v, a.firstBaseUpdate = O, a.lastBaseUpdate = M, u === null && (a.shared.lanes = 0), fa |= c, t.lanes = c, t.memoizedState = q;
    }
  }
  function qd(t, e) {
    if (typeof t != "function")
      throw Error(o(191, t));
    t.call(e);
  }
  function Gd(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        qd(n[t], e);
  }
  var ua = ae(null), jc = ae(0);
  function Yd(t, e) {
    t = Dl, jt(jc, t), jt(ua, e), Dl = t | e.baseLanes;
  }
  function To() {
    jt(jc, Dl), jt(ua, ua.current);
  }
  function Co() {
    Dl = jc.current, ee(ua), ee(jc);
  }
  var Le = ae(null), ke = null;
  function ia(t) {
    var e = t.alternate;
    jt(Ve, Ve.current & 1), jt(Le, t), ke === null && (e === null || ua.current !== null || e.memoizedState !== null) && (ke = t);
  }
  function Ao(t) {
    jt(Ve, Ve.current), jt(Le, t), ke === null && (ke = t);
  }
  function Xd(t) {
    t.tag === 22 ? (jt(Ve, Ve.current), jt(Le, t), ke === null && (ke = t)) : ca();
  }
  function ca() {
    jt(Ve, Ve.current), jt(Le, Le.current);
  }
  function gn(t) {
    ee(Le), ke === t && (ke = null), ee(Ve);
  }
  var Ve = ae(0);
  function zi(t, e) {
    jt(Le, Le.current), jt(Ve, e);
  }
  function Oo(t) {
    ee(Ve), ee(Le), ke === t && (ke = null);
  }
  function Bc(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Js(n) || Is(n)))
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
  var Ol = 0, Dt = null, Pt = null, Ee = null, Lc = !1, Du = !1, Ka = !1, Vc = 0, Di = 0, xu = null, dg = 0;
  function de() {
    throw Error(o(321));
  }
  function No(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!vn(t[n], e[n])) return !1;
    return !0;
  }
  function Ro(t, e, n, l, a, u) {
    return Ol = u, Dt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, ct.H = t === null || t.memoizedState === null ? O0 : N0, Ka = !1, u = n(l, a), Ka = !1, Du && (u = kd(
      e,
      n,
      l,
      a
    )), Qd(t), u;
  }
  function Qd(t) {
    ct.H = Zc;
    var e = Pt !== null && Pt.next !== null;
    if (Ol = 0, Ee = Pt = Dt = null, Lc = !1, Di = 0, xu = null, e) throw Error(o(300));
    t === null || _e || (t = t.dependencies, t !== null && zc(t) && (_e = !0));
  }
  function kd(t, e, n, l) {
    Dt = t;
    var a = 0;
    do {
      if (Du && (xu = null), Di = 0, Du = !1, 25 <= a) throw Error(o(301));
      if (a += 1, Ee = Pt = null, t.updateQueue != null) {
        var u = t.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      ct.H = Sg, u = e(n, l);
    } while (Du);
    return u;
  }
  function hg() {
    var t = ct.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? xi(e) : e, t = t.useState()[0], (Pt !== null ? Pt.memoizedState : null) !== t && (Dt.flags |= 1024), e;
  }
  function zo() {
    var t = Vc !== 0;
    return Vc = 0, t;
  }
  function Do(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function xo(t) {
    if (Lc) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Lc = !1;
    }
    Ol = 0, Ee = Pt = Dt = null, Du = !1, Di = Vc = 0, xu = null;
  }
  function We() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ee === null ? Dt.memoizedState = Ee = t : Ee = Ee.next = t, Ee;
  }
  function ge() {
    if (Pt === null) {
      var t = Dt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Pt.next;
    var e = Ee === null ? Dt.memoizedState : Ee.next;
    if (e !== null)
      Ee = e, Pt = t;
    else {
      if (t === null)
        throw Dt.alternate === null ? Error(o(467)) : Error(o(310));
      Pt = t, t = {
        memoizedState: Pt.memoizedState,
        baseState: Pt.baseState,
        baseQueue: Pt.baseQueue,
        queue: Pt.queue,
        next: null
      }, Ee === null ? Dt.memoizedState = Ee = t : Ee = Ee.next = t;
    }
    return Ee;
  }
  function qc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function xi(t) {
    var e = Di;
    return Di += 1, xu === null && (xu = []), t = Hd(xu, t, e), e = Dt, (Ee === null ? e.memoizedState : Ee.next) === null && (e = e.alternate, ct.H = e === null || e.memoizedState === null ? O0 : N0), t;
  }
  function Gc(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return xi(t);
      if (t.$$typeof === k) return;
      if (t.$$typeof === vt) return Be(t);
    }
    throw Error(o(438, String(t)));
  }
  function Mo(t) {
    var e = null, n = Dt.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var l = Dt.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (e = {
        data: l.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = qc(), Dt.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), l = 0; l < t; l++)
        n[l] = ce;
    return e.index++, n;
  }
  function Nl(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function Yc(t) {
    var e = ge();
    return wo(e, Pt, t);
  }
  function wo(t, e, n) {
    var l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = n;
    var a = t.baseQueue, u = l.pending;
    if (u !== null) {
      if (a !== null) {
        var c = a.next;
        a.next = u.next, u.next = c;
      }
      e.baseQueue = a = u, l.pending = null;
    }
    if (u = t.baseState, a === null) t.memoizedState = u;
    else {
      e = a.next;
      var f = c = null, v = null, O = e, M = !1;
      do {
        var q = O.lane & -536870913;
        if (q !== O.lane ? (Vt & q) === q : (Ol & q) === q) {
          var C = O.revertLane;
          if (C === 0)
            v !== null && (v = v.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null
            }), q === Ya && (M = !0);
          else if ((Ol & C) === C) {
            O = O.next, C === Ya && (M = !0);
            continue;
          } else
            q = {
              lane: 0,
              revertLane: O.revertLane,
              gesture: null,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null
            }, v === null ? (f = v = q, c = u) : v = v.next = q, Dt.lanes |= C, fa |= C;
          q = O.action, Ka && n(u, q), u = O.hasEagerState ? O.eagerState : n(u, q);
        } else
          C = {
            lane: q,
            revertLane: O.revertLane,
            gesture: O.gesture,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null
          }, v === null ? (f = v = C, c = u) : v = v.next = C, Dt.lanes |= q, fa |= q;
        O = O.next;
      } while (O !== null && O !== e);
      if (v === null ? c = u : v.next = f, !vn(u, t.memoizedState) && (_e = !0, M && (n = Nu, n !== null)))
        throw n;
      t.memoizedState = u, t.baseState = c, t.baseQueue = v, l.lastRenderedState = u;
    }
    return a === null && (l.lanes = 0), [t.memoizedState, l.dispatch];
  }
  function Uo(t) {
    var e = ge(), n = e.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = t;
    var l = n.dispatch, a = n.pending, u = e.memoizedState;
    if (a !== null) {
      n.pending = null;
      var c = a = a.next;
      do
        u = t(u, c.action), c = c.next;
      while (c !== a);
      vn(u, e.memoizedState) || (_e = !0), e.memoizedState = u, e.baseQueue === null && (e.baseState = u), n.lastRenderedState = u;
    }
    return [u, l];
  }
  function Zd(t, e, n) {
    var l = Dt, a = ge(), u = Ut;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = e();
    var c = !vn(
      (Pt || a).memoizedState,
      n
    );
    if (c && (a.memoizedState = n, _e = !0), a = a.queue, Bo(Id.bind(null, l, a, t), [
      t
    ]), t = a.getSnapshot !== e || c || Ee !== null && (Ee.memoizedState.tag & 1) !== 0, Mu(
      t ? 9 : 8,
      { destroy: void 0 },
      Jd.bind(null, l, a, n, e),
      null
    ), t) {
      if (l.flags |= 2048, te === null) throw Error(o(349));
      u || (Ol & 127) !== 0 || Kd(l, e, n);
    }
    return n;
  }
  function Kd(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = Dt.updateQueue, e === null ? (e = qc(), Dt.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function Jd(t, e, n, l) {
    e.value = n, e.getSnapshot = l, Fd(e) && Wd(t);
  }
  function Id(t, e, n) {
    return n(function() {
      Fd(e) && Wd(t);
    });
  }
  function Fd(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !vn(t, n);
    } catch {
      return !0;
    }
  }
  function Wd(t) {
    var e = ja(t, 2);
    e !== null && rn(e, t, 2);
  }
  function Ho(t) {
    var e = We();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), Ka) {
        ye(!0);
        try {
          n();
        } finally {
          ye(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Nl,
      lastRenderedState: t
    }, e;
  }
  function $d(t, e, n, l) {
    return t.baseState = n, wo(
      t,
      Pt,
      typeof l == "function" ? l : Nl
    );
  }
  function mg(t, e, n, l, a) {
    if (kc(t)) throw Error(o(485));
    if (t = e.action, t !== null) {
      var u = {
        payload: a,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          u.listeners.push(c);
        }
      };
      ct.T !== null ? n(!0) : u.isTransition = !1, l(u), n = e.pending, n === null ? (u.next = e.pending = u, Pd(e, u)) : (u.next = n.next, e.pending = n.next = u);
    }
  }
  function Pd(t, e) {
    var n = e.action, l = e.payload, a = t.state;
    if (e.isTransition) {
      var u = ct.T, c = {};
      c.types = u !== null ? u.types : null, ct.T = c;
      try {
        var f = n(a, l), v = ct.S;
        v !== null && v(c, f), t0(t, e, f);
      } catch (O) {
        jo(t, e, O);
      } finally {
        u !== null && c.types !== null && (u.types = c.types), ct.T = u;
      }
    } else
      try {
        u = n(a, l), t0(t, e, u);
      } catch (O) {
        jo(t, e, O);
      }
  }
  function t0(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        e0(t, e, l);
      },
      function(l) {
        return jo(t, e, l);
      }
    ) : e0(t, e, n);
  }
  function e0(t, e, n) {
    e.status = "fulfilled", e.value = n, n0(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, Pd(t, n)));
  }
  function jo(t, e, n) {
    var l = t.pending;
    if (t.pending = null, l !== null) {
      l = l.next;
      do
        e.status = "rejected", e.reason = n, n0(e), e = e.next;
      while (e !== l);
    }
    t.action = null;
  }
  function n0(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function l0(t, e) {
    return e;
  }
  function a0(t, e) {
    if (Ut) {
      var n = te.formState;
      if (n !== null) {
        t: {
          var l = Dt;
          if (Ut) {
            if (ne) {
              e: {
                for (var a = ne, u = Mn; a.nodeType !== 8; ) {
                  if (!u) {
                    a = null;
                    break e;
                  }
                  if (a = Un(
                    a.nextSibling
                  ), a === null) {
                    a = null;
                    break e;
                  }
                }
                u = a.data, a = u === "F!" || u === "F" ? a : null;
              }
              if (a) {
                ne = Un(
                  a.nextSibling
                ), l = a.data === "F!";
                break t;
              }
            }
            Pl(l);
          }
          l = !1;
        }
        l && (e = n[0]);
      }
    }
    return n = We(), n.memoizedState = n.baseState = e, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: l0,
      lastRenderedState: e
    }, n.queue = l, n = T0.bind(
      null,
      Dt,
      l
    ), l.dispatch = n, l = Ho(!1), u = Yo.bind(
      null,
      Dt,
      !1,
      l.queue
    ), l = We(), a = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, l.queue = a, n = mg.bind(
      null,
      Dt,
      a,
      u,
      n
    ), a.dispatch = n, l.memoizedState = t, [e, n, !1];
  }
  function u0(t) {
    var e = ge();
    return i0(e, Pt, t);
  }
  function i0(t, e, n) {
    if (e = wo(
      t,
      e,
      l0
    )[0], t = Yc(Nl)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var l = xi(e);
      } catch (c) {
        throw c === Ru ? Mc : c;
      }
    else l = e;
    e = ge();
    var a = e.queue, u = a.dispatch;
    return n !== e.memoizedState && (Dt.flags |= 2048, Mu(
      9,
      { destroy: void 0 },
      vg.bind(null, a, n),
      null
    )), [l, u, t];
  }
  function vg(t, e) {
    t.action = e;
  }
  function c0(t) {
    var e = ge(), n = Pt;
    if (n !== null)
      return i0(e, n, t);
    ge(), e = e.memoizedState, n = ge();
    var l = n.queue.dispatch;
    return n.memoizedState = t, [e, l, !1];
  }
  function Mu(t, e, n, l) {
    return t = { tag: t, create: n, deps: l, inst: e, next: null }, e = Dt.updateQueue, e === null && (e = qc(), Dt.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (l = n.next, n.next = t, t.next = l, e.lastEffect = t), t;
  }
  function r0() {
    return ge().memoizedState;
  }
  function Xc(t, e, n, l) {
    var a = We();
    Dt.flags |= t, a.memoizedState = Mu(
      1 | e,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function Qc(t, e, n, l) {
    var a = ge();
    l = l === void 0 ? null : l;
    var u = a.memoizedState.inst;
    Pt !== null && l !== null && No(l, Pt.memoizedState.deps) ? a.memoizedState = Mu(e, u, n, l) : (Dt.flags |= t, a.memoizedState = Mu(
      1 | e,
      u,
      n,
      l
    ));
  }
  function o0(t, e) {
    Xc(8390656, 8, t, e);
  }
  function Bo(t, e) {
    Qc(2048, 8, t, e);
  }
  function gg(t) {
    Dt.flags |= 4;
    var e = Dt.updateQueue;
    if (e === null)
      e = qc(), Dt.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function s0(t) {
    var e = ge().memoizedState;
    return gg({ ref: e, nextImpl: t }), function() {
      if ((Zt & 2) !== 0) throw Error(o(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function f0(t, e) {
    return Qc(4, 2, t, e);
  }
  function d0(t, e) {
    return Qc(4, 4, t, e);
  }
  function h0(t, e) {
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
  function m0(t, e, n) {
    n = n != null ? n.concat([t]) : null, Qc(4, 4, h0.bind(null, e, t), n);
  }
  function Lo() {
  }
  function v0(t, e) {
    var n = ge();
    e = e === void 0 ? null : e;
    var l = n.memoizedState;
    return e !== null && No(e, l[1]) ? l[0] : (n.memoizedState = [t, e], t);
  }
  function g0(t, e) {
    var n = ge();
    e = e === void 0 ? null : e;
    var l = n.memoizedState;
    if (e !== null && No(e, l[1]))
      return l[0];
    if (l = t(), Ka) {
      ye(!0);
      try {
        t();
      } finally {
        ye(!1);
      }
    }
    return n.memoizedState = [l, e], l;
  }
  function Vo(t, e, n) {
    return n === void 0 || (Ol & 1073741824) !== 0 && (Vt & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = Oh(), Dt.lanes |= t, fa |= t, n);
  }
  function y0(t, e, n, l) {
    return vn(n, e) ? n : ua.current !== null ? (t = Vo(t, n, l), vn(t, e) || (_e = !0), t) : (Ol & 106) === 0 || (Ol & 1073741824) !== 0 && (Vt & 261930) === 0 ? (_e = !0, t.memoizedState = n) : (t = Oh(), Dt.lanes |= t, fa |= t, e);
  }
  function b0(t, e, n, l, a) {
    var u = w.p;
    w.p = u !== 0 && 8 > u ? u : 8;
    var c = ct.T, f = {};
    f.types = c !== null ? c.types : null, ct.T = f, Yo(t, !1, e, n);
    try {
      var v = a(), O = ct.S;
      if (O !== null && O(f, v), v !== null && typeof v == "object" && typeof v.then == "function") {
        var M = fg(
          v,
          l
        );
        Mi(
          t,
          e,
          M,
          Sn(t)
        );
      } else
        Mi(
          t,
          e,
          l,
          Sn(t)
        );
    } catch (q) {
      Mi(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: q },
        Sn()
      );
    } finally {
      w.p = u, c !== null && f.types !== null && (c.types = f.types), ct.T = c;
    }
  }
  function yg() {
  }
  function qo(t, e, n, l) {
    if (t.tag !== 5) throw Error(o(476));
    var a = p0(t).queue;
    b0(
      t,
      a,
      e,
      Et,
      n === null ? yg : function() {
        return S0(t), n(l);
      }
    );
  }
  function p0(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Et,
      baseState: Et,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Nl,
        lastRenderedState: Et
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
        lastRenderedReducer: Nl,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function S0(t) {
    var e = p0(t);
    e.next === null && (e = t.alternate.memoizedState), Mi(
      t,
      e.next.queue,
      {},
      Sn()
    );
  }
  function Go() {
    return Be(Wu);
  }
  function E0() {
    return ge().memoizedState;
  }
  function _0() {
    return ge().memoizedState;
  }
  function bg(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Sn();
          t = la(n);
          var l = aa(e, t, n);
          l !== null && (rn(l, e, n), Oi(l, e, n)), e = { cache: vo() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function pg(t, e, n) {
    var l = Sn();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, kc(t) ? C0(e, n) : (n = uo(t, e, n, l), n !== null && (rn(n, t, l), A0(n, e, l)));
  }
  function T0(t, e, n) {
    var l = Sn();
    Mi(t, e, n, l);
  }
  function Mi(t, e, n, l) {
    var a = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (kc(t)) C0(e, a);
    else {
      var u = t.alternate;
      if (t.lanes === 0 && (u === null || u.lanes === 0) && (u = e.lastRenderedReducer, u !== null))
        try {
          var c = e.lastRenderedState, f = u(c, n);
          if (a.hasEagerState = !0, a.eagerState = f, vn(f, c))
            return _c(t, e, a, 0), te === null && Ec(), !1;
        } catch {
        }
      if (n = uo(t, e, a, l), n !== null)
        return rn(n, t, l), A0(n, e, l), !0;
    }
    return !1;
  }
  function Yo(t, e, n, l) {
    if (l = {
      lane: 2,
      revertLane: Ms(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, kc(t)) {
      if (e) throw Error(o(479));
    } else
      e = uo(
        t,
        n,
        l,
        2
      ), e !== null && rn(e, t, 2);
  }
  function kc(t) {
    var e = t.alternate;
    return t === Dt || e !== null && e === Dt;
  }
  function C0(t, e) {
    Du = Lc = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function A0(t, e, n) {
    if ((n & 4194048) !== 0) {
      var l = e.lanes;
      l &= t.pendingLanes, n |= l, e.lanes = n, su(t, n);
    }
  }
  var Zc = {
    readContext: Be,
    use: Gc,
    useCallback: de,
    useContext: de,
    useEffect: de,
    useImperativeHandle: de,
    useLayoutEffect: de,
    useInsertionEffect: de,
    useMemo: de,
    useReducer: de,
    useRef: de,
    useState: de,
    useDebugValue: de,
    useDeferredValue: de,
    useTransition: de,
    useSyncExternalStore: de,
    useId: de,
    useHostTransitionStatus: de,
    useFormState: de,
    useActionState: de,
    useOptimistic: de,
    useMemoCache: de,
    useCacheRefresh: de,
    useEffectEvent: de
  }, O0 = {
    readContext: Be,
    use: Gc,
    useCallback: function(t, e) {
      return We().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: Be,
    useEffect: o0,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, Xc(
        4194308,
        4,
        h0.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return Xc(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Xc(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = We();
      e = e === void 0 ? null : e;
      var l = t();
      if (Ka) {
        ye(!0);
        try {
          t();
        } finally {
          ye(!1);
        }
      }
      return n.memoizedState = [l, e], l;
    },
    useReducer: function(t, e, n) {
      var l = We();
      if (n !== void 0) {
        var a = n(e);
        if (Ka) {
          ye(!0);
          try {
            n(e);
          } finally {
            ye(!1);
          }
        }
      } else a = e;
      return l.memoizedState = l.baseState = a, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: a
      }, l.queue = t, t = t.dispatch = pg.bind(
        null,
        Dt,
        t
      ), [l.memoizedState, t];
    },
    useRef: function(t) {
      var e = We();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Ho(t);
      var e = t.queue, n = T0.bind(null, Dt, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: Lo,
    useDeferredValue: function(t, e) {
      var n = We();
      return Vo(n, t, e);
    },
    useTransition: function() {
      var t = Ho(!1);
      return t = b0.bind(
        null,
        Dt,
        t.queue,
        !0,
        !1
      ), We().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var l = Dt, a = We();
      if (Ut) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = e(), te === null)
          throw Error(o(349));
        (Vt & 127) !== 0 || Kd(l, e, n);
      }
      a.memoizedState = n;
      var u = { value: n, getSnapshot: e };
      return a.queue = u, o0(Id.bind(null, l, u, t), [
        t
      ]), l.flags |= 2048, Mu(
        9,
        { destroy: void 0 },
        Jd.bind(
          null,
          l,
          u,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = We(), e = te.identifierPrefix;
      if (Ut) {
        var n = tl, l = Pn;
        n = (l & ~(1 << 32 - Ne(l) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = Vc++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = dg++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Go,
    useFormState: a0,
    useActionState: a0,
    useOptimistic: function(t) {
      var e = We();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = Yo.bind(
        null,
        Dt,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: Mo,
    useCacheRefresh: function() {
      return We().memoizedState = bg.bind(
        null,
        Dt
      );
    },
    useEffectEvent: function(t) {
      var e = We(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((Zt & 2) !== 0)
          throw Error(o(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, N0 = {
    readContext: Be,
    use: Gc,
    useCallback: v0,
    useContext: Be,
    useEffect: Bo,
    useImperativeHandle: m0,
    useInsertionEffect: f0,
    useLayoutEffect: d0,
    useMemo: g0,
    useReducer: Yc,
    useRef: r0,
    useState: function() {
      return Yc(Nl);
    },
    useDebugValue: Lo,
    useDeferredValue: function(t, e) {
      var n = ge();
      return y0(
        n,
        Pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Yc(Nl)[0], e = ge().memoizedState;
      return [
        typeof t == "boolean" ? t : xi(t),
        e
      ];
    },
    useSyncExternalStore: Zd,
    useId: E0,
    useHostTransitionStatus: Go,
    useFormState: u0,
    useActionState: u0,
    useOptimistic: function(t, e) {
      var n = ge();
      return $d(n, Pt, t, e);
    },
    useMemoCache: Mo,
    useCacheRefresh: _0,
    useEffectEvent: s0
  }, Sg = {
    readContext: Be,
    use: Gc,
    useCallback: v0,
    useContext: Be,
    useEffect: Bo,
    useImperativeHandle: m0,
    useInsertionEffect: f0,
    useLayoutEffect: d0,
    useMemo: g0,
    useReducer: Uo,
    useRef: r0,
    useState: function() {
      return Uo(Nl);
    },
    useDebugValue: Lo,
    useDeferredValue: function(t, e) {
      var n = ge();
      return Pt === null ? Vo(n, t, e) : y0(
        n,
        Pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Uo(Nl)[0], e = ge().memoizedState;
      return [
        typeof t == "boolean" ? t : xi(t),
        e
      ];
    },
    useSyncExternalStore: Zd,
    useId: E0,
    useHostTransitionStatus: Go,
    useFormState: c0,
    useActionState: c0,
    useOptimistic: function(t, e) {
      var n = ge();
      return Pt !== null ? $d(n, Pt, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: Mo,
    useCacheRefresh: _0,
    useEffectEvent: s0
  };
  function Xo(t, e, n, l) {
    e = t.memoizedState, n = n(l, e), n = n == null ? e : S({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Qo = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var l = Sn(), a = la(l);
      a.payload = e, n != null && (a.callback = n), e = aa(t, a, l), e !== null && (rn(e, t, l), Oi(e, t, l));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var l = Sn(), a = la(l);
      a.tag = 1, a.payload = e, n != null && (a.callback = n), e = aa(t, a, l), e !== null && (rn(e, t, l), Oi(e, t, l));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = Sn(), l = la(n);
      l.tag = 2, e != null && (l.callback = e), e = aa(t, l, n), e !== null && (rn(e, t, n), Oi(e, t, n));
    }
  };
  function R0(t, e, n, l, a, u, c) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(l, u, c) : e.prototype && e.prototype.isPureReactComponent ? !bi(n, l) || !bi(a, u) : !0;
  }
  function z0(t, e, n, l) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, l), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, l), e.state !== t && Qo.enqueueReplaceState(e, e.state, null);
  }
  function Ja(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var l in e)
        l !== "ref" && (n[l] = e[l]);
    }
    if (t = t.defaultProps) {
      n === e && (n = S({}, n));
      for (var a in t)
        n[a] === void 0 && (n[a] = t[a]);
    }
    return n;
  }
  function D0(t) {
    Sc(t);
  }
  function x0(t) {
    console.error(t);
  }
  function M0(t) {
    Sc(t);
  }
  function Kc(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function w0(t, e, n) {
    try {
      var l = t.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function ko(t, e, n) {
    return n = la(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Kc(t, e);
    }, n;
  }
  function U0(t) {
    return t = la(t), t.tag = 3, t;
  }
  function H0(t, e, n, l) {
    var a = n.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var u = l.value;
      t.payload = function() {
        return a(u);
      }, t.callback = function() {
        w0(e, n, l);
      };
    }
    var c = n.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (t.callback = function() {
      w0(e, n, l), typeof a != "function" && (da === null ? da = /* @__PURE__ */ new Set([this]) : da.add(this));
      var f = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function Eg(t, e, n, l, a) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (e = n.alternate, e !== null && qa(
        e,
        n,
        a,
        !0
      ), n = Le.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return ke === null ? mr() : n.alternate === null && he === 0 && (he = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, l === wc ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : e.add(l), zs(t, l, a)), !1;
          case 22:
            return n.flags |= 65536, l === wc ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), zs(t, l, a)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return zs(t, l, a), mr(), !1;
    }
    if (Ut)
      return e = Le.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = a, l !== so && (t = Error(o(422), { cause: l }), Ei(zn(t, n)))) : (l !== so && (e = Error(o(423), {
        cause: l
      }), Ei(
        zn(e, n)
      )), t = t.current.alternate, t.flags |= 65536, a &= -a, t.lanes |= a, l = zn(l, n), a = ko(
        t.stateNode,
        l,
        a
      ), Eo(t, a), he !== 4 && (he = 2)), !1;
    var u = Error(o(520), { cause: l });
    if (u = zn(u, n), qi === null ? qi = [u] : qi.push(u), he !== 4 && (he = 2), e === null) return !0;
    l = zn(l, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = a & -a, n.lanes |= t, t = ko(n.stateNode, l, t), Eo(n, t), !1;
        case 1:
          if (e = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (da === null || !da.has(u))))
            return n.flags |= 65536, a &= -a, n.lanes |= a, a = U0(a), H0(
              a,
              t,
              n,
              l
            ), Eo(n, a), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Zo = Error(o(461)), _e = !1;
  function Ae(t, e, n, l) {
    e.child = t === null ? Vd(e, null, n, l) : Za(
      e,
      t.child,
      n,
      l
    );
  }
  function j0(t, e, n, l, a) {
    n = n.render;
    var u = e.ref;
    if ("ref" in l) {
      var c = {};
      for (var f in l)
        f !== "ref" && (c[f] = l[f]);
    } else c = l;
    return Ga(e), l = Ro(
      t,
      e,
      n,
      c,
      u,
      a
    ), f = zo(), t !== null && !_e ? (Do(t, e, a), Rl(t, e, a)) : (Ut && f && Oc(e), e.flags |= 1, Ae(t, e, l, a), e.child);
  }
  function B0(t, e, n, l, a) {
    if (t === null) {
      var u = n.type;
      return typeof u == "function" && !io(u) && u.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = u, L0(
        t,
        e,
        u,
        l,
        a
      )) : (t = Cc(
        n.type,
        null,
        l,
        e,
        e.mode,
        a
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (u = t.child, !ts(t, a)) {
      var c = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : bi, n(c, l) && t.ref === e.ref)
        return Rl(t, e, a);
    }
    return e.flags |= 1, t = _l(u, l), t.ref = e.ref, t.return = e, e.child = t;
  }
  function L0(t, e, n, l, a) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (bi(u, l) && t.ref === e.ref)
        if (_e = !1, e.pendingProps = l = u, ts(t, a))
          (t.flags & 131072) !== 0 && (_e = !0);
        else
          return e.lanes = t.lanes, Rl(t, e, a);
    }
    return Ko(
      t,
      e,
      n,
      l,
      a
    );
  }
  function V0(t, e, n, l) {
    var a = l.children, u = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | n : n, t !== null) {
          for (l = e.child = t.child, a = 0; l !== null; )
            a = a | l.lanes | l.childLanes, l = l.sibling;
          l = a & ~u;
        } else l = 0, e.child = null;
        return q0(
          t,
          e,
          u,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && xc(
          e,
          u !== null ? u.cachePool : null
        ), u !== null ? Yd(e, u) : To(), Xd(e);
      else
        return l = e.lanes = 536870912, q0(
          t,
          e,
          u !== null ? u.baseLanes | n : n,
          n,
          l
        );
    } else
      u !== null ? (xc(e, u.cachePool), Yd(e, u), ca(), e.memoizedState = null) : (t !== null && xc(e, null), To(), ca());
    return Ae(t, e, a, n), e.child;
  }
  function wi(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function q0(t, e, n, l, a) {
    var u = yo();
    return u = u === null ? null : { parent: Se._currentValue, pool: u }, e.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, t !== null && xc(e, null), To(), Xd(e), t !== null && qa(t, e, l, !0), e.childLanes = a, null;
  }
  function Jc(t, e) {
    return e = Ic(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function G0(t, e, n) {
    return Za(e, t.child, null, n), t = Jc(e, e.pendingProps), t.flags |= 2, gn(e), e.memoizedState = null, t;
  }
  function _g(t, e, n) {
    var l = e.pendingProps, a = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (Ut) {
        if (l.mode === "hidden")
          return t = Jc(e, l), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, wi(null, t);
        if (Ao(e), (t = ne) ? (t = hm(
          t,
          Mn
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Wl !== null ? { id: Pn, overflow: tl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Cd(t), n.return = e, e.child = n, ze = e, ne = null)) : t = null, t === null) throw Pl(e);
        return e.lanes = 536870912, null;
      }
      return Jc(e, l);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if (Ao(e), a)
        if (e.flags & 256)
          e.flags &= -257, e = G0(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(o(558));
      else if (_e || qa(t, e, n, !1), a = (n & t.childLanes) !== 0, _e || a) {
        if (ua.current === null) {
          if (l = te, l !== null && (c = Aa(l, n), c !== 0 && c !== u.retryLane))
            throw u.retryLane = c, ja(t, c), rn(l, t, c), Zo;
          mr();
        }
        e = G0(
          t,
          e,
          n
        );
      } else
        t = u.treeContext, ne = Un(c.nextSibling), ze = e, Ut = !0, $l = null, Mn = !1, t !== null && Nd(e, t), e = Jc(e, l), e.flags |= 134221824;
      return e;
    }
    return t = _l(t.child, {
      mode: l.mode,
      children: l.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function wu(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Ko(t, e, n, l, a) {
    return Ga(e), n = Ro(
      t,
      e,
      n,
      l,
      void 0,
      a
    ), l = zo(), t !== null && !_e ? (Do(t, e, a), Rl(t, e, a)) : (Ut && l && Oc(e), e.flags |= 1, Ae(t, e, n, a), e.child);
  }
  function Y0(t, e, n, l, a, u) {
    return Ga(e), e.updateQueue = null, n = kd(
      e,
      l,
      n,
      a
    ), Qd(t), l = zo(), t !== null && !_e ? (Do(t, e, u), Rl(t, e, u)) : (Ut && l && Oc(e), e.flags |= 1, Ae(t, e, n, u), e.child);
  }
  function X0(t, e, n, l, a) {
    if (Ga(e), e.stateNode === null) {
      var u = Tu, c = n.contextType;
      typeof c == "object" && c !== null && (u = Be(c)), u = new n(l, u), e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Qo, e.stateNode = u, u._reactInternals = e, u = e.stateNode, u.props = l, u.state = e.memoizedState, u.refs = {}, po(e), c = n.contextType, u.context = typeof c == "object" && c !== null ? Be(c) : Tu, u.state = e.memoizedState, c = n.getDerivedStateFromProps, typeof c == "function" && (Xo(
        e,
        n,
        c,
        l
      ), u.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (c = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), c !== u.state && Qo.enqueueReplaceState(u, u.state, null), Ri(e, l, u, a), Ni(), u.state = e.memoizedState), typeof u.componentDidMount == "function" && (e.flags |= 4194308), l = !0;
    } else if (t === null) {
      u = e.stateNode;
      var f = e.memoizedProps, v = Ja(n, f);
      u.props = v;
      var O = u.context, M = n.contextType;
      c = Tu, typeof M == "object" && M !== null && (c = Be(M));
      var q = n.getDerivedStateFromProps;
      M = typeof q == "function" || typeof u.getSnapshotBeforeUpdate == "function", f = e.pendingProps !== f, M || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f || O !== c) && z0(
        e,
        u,
        l,
        c
      ), na = !1;
      var C = e.memoizedState;
      u.state = C, Ri(e, l, u, a), Ni(), O = e.memoizedState, f || C !== O || na ? (typeof q == "function" && (Xo(
        e,
        n,
        q,
        l
      ), O = e.memoizedState), (v = na || R0(
        e,
        n,
        v,
        l,
        C,
        O,
        c
      )) ? (M || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = l, e.memoizedState = O), u.props = l, u.state = O, u.context = c, l = v) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), l = !1);
    } else {
      u = e.stateNode, So(t, e), c = e.memoizedProps, M = Ja(n, c), u.props = M, q = e.pendingProps, C = u.context, O = n.contextType, v = Tu, typeof O == "object" && O !== null && (v = Be(O)), f = n.getDerivedStateFromProps, (O = typeof f == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (c !== q || C !== v) && z0(
        e,
        u,
        l,
        v
      ), na = !1, C = e.memoizedState, u.state = C, Ri(e, l, u, a), Ni();
      var D = e.memoizedState;
      c !== q || C !== D || na || t !== null && t.dependencies !== null && zc(t.dependencies) ? (typeof f == "function" && (Xo(
        e,
        n,
        f,
        l
      ), D = e.memoizedState), (M = na || R0(
        e,
        n,
        M,
        l,
        C,
        D,
        v
      ) || t !== null && t.dependencies !== null && zc(t.dependencies)) ? (O || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, D, v), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        D,
        v
      )), typeof u.componentDidUpdate == "function" && (e.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && C === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && C === t.memoizedState || (e.flags |= 1024), e.memoizedProps = l, e.memoizedState = D), u.props = l, u.state = D, u.context = v, l = M) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && C === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && C === t.memoizedState || (e.flags |= 1024), l = !1);
    }
    return u = l, wu(t, e), l = (e.flags & 128) !== 0, u || l ? (u = e.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : u.render(), e.flags |= 1, t !== null && l ? (e.child = Za(
      e,
      t.child,
      null,
      a
    ), e.child = Za(
      e,
      null,
      n,
      a
    )) : Ae(t, e, n, a), e.memoizedState = u.state, t = e.child) : t = Rl(
      t,
      e,
      a
    ), t;
  }
  function Q0(t, e, n, l) {
    return La(), e.flags |= 256, Ae(t, e, n, l), e.child;
  }
  var Jo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Io(t) {
    return { baseLanes: t, cachePool: wd() };
  }
  function Fo(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= pn), t;
  }
  function k0(t, e, n) {
    var l = e.pendingProps, a = !1, u = (e.flags & 128) !== 0, c;
    if ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Ve.current & 2) !== 0), c && (a = !0, e.flags &= -129), c = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (Ut) {
        if (a ? ia(e) : ca(), (t = ne) ? (t = hm(
          t,
          Mn
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Wl !== null ? { id: Pn, overflow: tl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Cd(t), n.return = e, e.child = n, ze = e, ne = null)) : t = null, t === null) throw Pl(e);
        return Is(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return u = l.children, l = l.fallback, a ? (ca(), a = e.mode, u = Ic(
        { mode: "hidden", children: u },
        a
      ), l = Ba(
        l,
        a,
        n,
        null
      ), u.return = e, l.return = e, u.sibling = l, e.child = u, l = e.child, l.memoizedState = Io(n), l.childLanes = Fo(
        t,
        c,
        n
      ), e.memoizedState = Jo, wi(null, l)) : (ia(e), Wo(e, u));
    }
    var f = t.memoizedState;
    if (f !== null) {
      var v = f.dehydrated;
      if (v !== null)
        return Tg(
          t,
          e,
          u,
          c,
          l,
          v,
          f,
          n
        );
    }
    return a ? (ca(), a = l.fallback, u = e.mode, f = t.child, v = f.sibling, l = _l(f, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = f.subtreeFlags & 1206910976, v !== null ? a = _l(v, a) : (a = Ba(
      a,
      u,
      n,
      null
    ), a.flags |= 2), a.return = e, l.return = e, l.sibling = a, e.child = l, wi(null, l), l = e.child, a = t.child.memoizedState, a === null ? a = Io(n) : (u = a.cachePool, u !== null ? (f = Se._currentValue, u = u.parent !== f ? { parent: f, pool: f } : u) : u = wd(), a = {
      baseLanes: a.baseLanes | n,
      cachePool: u
    }), l.memoizedState = a, l.childLanes = Fo(
      t,
      c,
      n
    ), e.memoizedState = Jo, wi(t.child, l)) : (ia(e), n = t.child, t = n.sibling, n = _l(n, {
      mode: "visible",
      children: l.children
    }), n.return = e, n.sibling = null, t !== null && (c = e.deletions, c === null ? (e.deletions = [t], e.flags |= 16) : c.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function Wo(t, e) {
    return e = Ic(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Ic(t, e) {
    return t = ln(22, t, null, e), t.lanes = 0, t;
  }
  function Fc(t, e, n) {
    return Za(e, t.child, null, n), t = Wo(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function Tg(t, e, n, l, a, u, c, f) {
    if (n)
      return e.flags & 256 ? (ia(e), e.flags &= -257, Fc(
        t,
        e,
        f
      )) : e.memoizedState !== null ? (ca(), e.child = t.child, e.flags |= 128, null) : (ca(), u = a.fallback, c = e.mode, a = Ic(
        { mode: "visible", children: a.children },
        c
      ), u = Ba(
        u,
        c,
        f,
        null
      ), u.flags |= 2, a.return = e, u.return = e, a.sibling = u, e.child = a, Za(e, t.child, null, f), a = e.child, a.memoizedState = Io(f), a.childLanes = Fo(
        t,
        l,
        f
      ), e.memoizedState = Jo, wi(null, a));
    if (ia(e), Is(u)) {
      if (l = u.nextSibling && u.nextSibling.dataset, l) var v = l.dgst;
      return l = v, l !== "" && (a = Error(o(419)), a.stack = "", a.digest = l, Ei({ value: a, source: null, stack: null })), Fc(
        t,
        e,
        f
      );
    }
    if (_e || qa(t, e, f, !1), l = (f & t.childLanes) !== 0, _e || l) {
      if (ua.current !== null)
        return Fc(
          t,
          e,
          f
        );
      if (l = te, l !== null && (a = Aa(
        l,
        f
      ), a !== 0 && a !== c.retryLane))
        throw c.retryLane = a, ja(t, a), rn(l, t, a), Zo;
      return Js(u) || mr(), Fc(
        t,
        e,
        f
      );
    }
    return Js(u) ? (e.flags |= 192, e.child = t.child, null) : (t = c.treeContext, ne = Un(u.nextSibling), ze = e, Ut = !0, $l = null, Mn = !1, t !== null && Nd(e, t), e = Wo(
      e,
      a.children
    ), e.flags |= 134221824, e);
  }
  function Z0(t, e, n) {
    t.lanes |= e;
    var l = t.alternate;
    l !== null && (l.lanes |= e), Rc(t.return, e, n);
  }
  function K0(t) {
    for (var e = null; t !== null; ) {
      var n = t.alternate;
      n !== null && Bc(n) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function Wc(t, e, n, l, a, u) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: a,
      treeForkCount: u
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = l, c.tail = n, c.tailMode = a, c.treeForkCount = u);
  }
  function $o(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var n = e.sibling;
      e.sibling = t.child, t.child = e, e = n;
    }
  }
  function Po(t, e, n) {
    var l = e.pendingProps, a = l.revealOrder, u = l.tail;
    l = l.children;
    var c = Ve.current;
    if (e.flags & 128)
      return zi(e, c), null;
    var f = (c & 2) !== 0;
    if (f ? (c = c & 1 | 2, e.flags |= 128) : c &= 1, zi(e, c), a === "backwards" && t !== null ? ($o(t), Ae(t, e, l, n), $o(t)) : Ae(t, e, l, n), l = Ut ? Si : 0, !f && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && Z0(t, n, e);
        else if (t.tag === 19)
          Z0(t, n, e);
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
    switch (a) {
      case "backwards":
        n = K0(e.child), n === null ? (a = e.child, e.child = null) : (a = n.sibling, n.sibling = null, $o(e)), Wc(
          e,
          !0,
          a,
          null,
          u,
          l
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, a = e.child, e.child = null; a !== null; ) {
          if (t = a.alternate, t !== null && Bc(t) === null) {
            e.child = a;
            break;
          }
          t = a.sibling, a.sibling = n, n = a, a = t;
        }
        Wc(
          e,
          !0,
          n,
          null,
          u,
          l
        );
        break;
      case "together":
        Wc(
          e,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        n = K0(e.child), n === null ? (a = e.child, e.child = null) : (a = n.sibling, n.sibling = null), Wc(
          e,
          !1,
          a,
          n,
          u,
          l
        );
    }
    return e.child;
  }
  function J0(t, e, n) {
    var l = e.pendingProps;
    return ta(e, e.type, l.value), Ae(t, e, l.children, n), e.child;
  }
  function Rl(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), fa |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (qa(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(o(153));
    if (e.child !== null) {
      for (t = e.child, n = _l(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = _l(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function ts(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && zc(t)));
  }
  function Cg(t, e, n) {
    switch (e.tag) {
      case 3:
        Bn(e, e.stateNode.containerInfo), ta(e, Se, t.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        Bl(e);
        break;
      case 4:
        Bn(e, e.stateNode.containerInfo);
        break;
      case 10:
        ta(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Ao(e), null;
        break;
      case 13:
        var l = e.memoizedState;
        if (l !== null) {
          if (l.dehydrated !== null)
            return ia(e), e.flags |= 128, null;
          l = qa(
            t,
            e,
            n,
            !1
          );
          var a = e.child.childLanes;
          return l || (n & a) !== 0 ? k0(t, e, n) : (ia(e), t = Rl(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        }
        ia(e);
        break;
      case 19:
        if (e.flags & 128)
          return Po(
            t,
            e,
            n
          );
        if (a = (t.flags & 128) !== 0, l = (n & e.childLanes) !== 0, l || (qa(
          t,
          e,
          n,
          !1
        ), l = (n & e.childLanes) !== 0), a) {
          if (l)
            return Po(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (a = e.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), zi(e, Ve.current), l) break;
        return null;
      case 22:
        return e.lanes = 0, V0(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        ta(e, Se, t.memoizedState.cache);
    }
    return Rl(t, e, n);
  }
  function I0(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        _e = !0;
      else {
        if (!ts(t, n) && (e.flags & 128) === 0)
          return _e = !1, Cg(
            t,
            e,
            n
          );
        _e = (t.flags & 131072) !== 0;
      }
    else
      _e = !1, Ut && (e.flags & 1048576) !== 0 && Od(e, Si, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var l = e.pendingProps;
          if (t = Qa(e.elementType), e.type = t, typeof t == "function")
            io(t) ? (l = Ja(t, l), e.tag = 1, e = X0(
              null,
              e,
              t,
              l,
              n
            )) : (e.tag = 0, e = Ko(
              null,
              e,
              t,
              l,
              n
            ));
          else {
            if (t != null) {
              var a = t.$$typeof;
              if (a === I) {
                e.tag = 11, e = j0(
                  null,
                  e,
                  t,
                  l,
                  n
                );
                break t;
              } else if (a === At) {
                e.tag = 14, e = B0(
                  null,
                  e,
                  t,
                  l,
                  n
                );
                break t;
              } else if (a === vt) {
                e.tag = 10, e.type = t, e = J0(
                  null,
                  e,
                  n
                );
                break t;
              }
            }
            throw e = zt(t) || t, Error(o(306, e, ""));
          }
        }
        return e;
      case 0:
        return Ko(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return l = e.type, a = Ja(
          l,
          e.pendingProps
        ), X0(
          t,
          e,
          l,
          a,
          n
        );
      case 3:
        t: {
          if (Bn(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(o(387));
          l = e.pendingProps;
          var u = e.memoizedState;
          a = u.element, So(t, e), Ri(e, l, null, n);
          var c = e.memoizedState;
          if (l = c.cache, ta(e, Se, l), l !== u.cache && mo(
            e,
            [Se],
            n,
            !0
          ), Ni(), l = c.element, u.isDehydrated)
            if (u = {
              element: l,
              isDehydrated: !1,
              cache: c.cache
            }, e.updateQueue.baseState = u, e.memoizedState = u, e.flags & 256) {
              e = Q0(
                t,
                e,
                l,
                n
              );
              break t;
            } else if (l !== a) {
              a = zn(
                Error(o(424)),
                e
              ), Ei(a), e = Q0(
                t,
                e,
                l,
                n
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, ne = Un(t.firstChild), ze = e, Ut = !0, $l = null, Mn = !0, n = Vd(
                e,
                null,
                l,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
          else {
            if (La(), l === a) {
              e = Rl(
                t,
                e,
                n
              );
              break t;
            }
            Ae(t, e, l, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return wu(t, e), t === null ? (n = Sm(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : Ut || (e.stateNode = Ph(
          e.type,
          e.pendingProps,
          _n.current,
          e
        )) : e.memoizedState = Sm(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Bl(e), t === null && Ut && (l = e.stateNode = gm(
          e.type,
          e.pendingProps,
          _n.current
        ), ze = e, Mn = !0, a = ne, va(e.type) ? (Fs = a, ne = Un(l.firstChild)) : ne = a), Ae(
          t,
          e,
          e.pendingProps.children,
          n
        ), wu(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && Ut && ((a = l = ne) && (l = by(
          l,
          e.type,
          e.pendingProps,
          Mn
        ), l !== null ? (e.stateNode = l, ze = e, ne = Un(l.firstChild), Mn = !1, a = !0) : a = !1), a || Pl(e)), Bl(e), a = e.type, u = e.pendingProps, c = t !== null ? t.memoizedProps : null, l = u.children, Gs(a, u) ? l = null : c !== null && Gs(a, c) && (e.flags |= 32), e.memoizedState !== null && (a = Ro(
          t,
          e,
          hg,
          null,
          null,
          n
        ), Wu._currentValue = a), wu(t, e), Ae(t, e, l, n), e.child;
      case 6:
        return t === null && Ut && ((t = n = ne) && (n = py(
          n,
          e.pendingProps,
          Mn
        ), n !== null ? (e.stateNode = n, ze = e, ne = null, t = !0) : t = !1), t || Pl(e)), null;
      case 13:
        return k0(t, e, n);
      case 4:
        return Bn(
          e,
          e.stateNode.containerInfo
        ), l = e.pendingProps, t === null ? e.child = Za(
          e,
          null,
          l,
          n
        ) : Ae(t, e, l, n), e.child;
      case 11:
        return j0(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return l = e.pendingProps, wu(t, e), Ae(t, e, l, n), e.child;
      case 8:
        return Ae(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return Ae(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return J0(t, e, n);
      case 9:
        return a = e.type._context, l = e.pendingProps.children, Ga(e), a = Be(a), l = l(a), e.flags |= 1, Ae(t, e, l, n), e.child;
      case 14:
        return B0(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return L0(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return Po(t, e, n);
      case 31:
        return _g(t, e, n);
      case 22:
        return V0(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return Ga(e), l = Be(Se), t === null ? (a = yo(), a === null && (a = te, u = vo(), a.pooledCache = u, u.refCount++, u !== null && (a.pooledCacheLanes |= n), a = u), e.memoizedState = { parent: l, cache: a }, po(e), ta(e, Se, a)) : ((t.lanes & n) !== 0 && (So(t, e), Ri(e, null, null, n), Ni()), a = t.memoizedState, u = e.memoizedState, a.parent !== l ? (a = { parent: l, cache: l }, e.memoizedState = a, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a), ta(e, Se, l)) : (l = u.cache, ta(e, Se, l), l !== a.cache && mo(
          e,
          [Se],
          n,
          !0
        ))), Ae(
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
        }), l = e.pendingProps, l.name != null && l.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : Ut && Oc(e), t !== null && t.memoizedProps.name !== l.name ? e.flags |= 4194816 : wu(t, e), Ae(t, e, l.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(o(156, e.tag));
  }
  function zl(t) {
    t.flags |= 4;
  }
  function es(t, e, n, l, a) {
    var u;
    if ((u = (t.mode & 32) !== 0) && (u = n === null ? Cm(e, l) : Cm(e, l) && (l.src !== n.src || l.srcSet !== n.srcSet)), u) {
      if (t.flags |= 16777216, (a & 335544128) === a)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Dh()) t.flags |= 8192;
        else
          throw ka = wc, bo;
    } else t.flags &= -16777217;
  }
  function F0(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Am(e))
      if (Dh()) t.flags |= 8192;
      else
        throw ka = wc, bo;
  }
  function $c(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Yn() : 536870912, t.lanes |= e, Lu |= e);
  }
  function Ui(t, e) {
    if (!Ut)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = t.tail, l = null; n !== null; )
            n.alternate !== null && (l = n), n = n.sibling;
          l === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : l.sibling = null;
          break;
        default:
          for (e = t.tail, n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
      }
  }
  function le(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, l = 0;
    if (e)
      for (var a = t.child; a !== null; )
        n |= a.lanes | a.childLanes, l |= a.subtreeFlags & 1206910976, l |= a.flags & 1206910976, a.return = t, a = a.sibling;
    else
      for (a = t.child; a !== null; )
        n |= a.lanes | a.childLanes, l |= a.subtreeFlags, l |= a.flags, a.return = t, a = a.sibling;
    return t.subtreeFlags |= l, t.childLanes = n, e;
  }
  function Ag(t, e, n) {
    var l = e.pendingProps;
    switch (oo(e), e.tag) {
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
        return n = e.stateNode, l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), Al(Se), Ln(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (Ou(e) ? zl(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, fo())), le(e), null;
      case 26:
        var a = e.type, u = e.memoizedState;
        return t === null ? (zl(e), u !== null ? (le(e), F0(e, u)) : (le(e), es(
          e,
          a,
          null,
          l,
          n
        ))) : u ? u !== t.memoizedState ? (zl(e), le(e), F0(e, u)) : (le(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== l && zl(e), le(e), es(
          e,
          a,
          t,
          l,
          n
        )), null;
      case 27:
        if (ml(e), n = _n.current, a = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== l && zl(e);
        else {
          if (!l) {
            if (e.stateNode === null)
              throw Error(o(166));
            return le(e), e.subtreeFlags &= -33554433, null;
          }
          t = Ze.current, Ou(e) ? Rd(e) : (t = gm(a, l, n), e.stateNode = t, zl(e));
        }
        return le(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (ml(e), a = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== l && zl(e);
        else {
          if (!l) {
            if (e.stateNode === null)
              throw Error(o(166));
            return le(e), e.subtreeFlags &= -33554433, null;
          }
          if (u = Ze.current, Ou(e))
            Rd(e);
          else {
            var c = ki(
              _n.current
            );
            switch (u) {
              case 1:
                u = c.createElementNS(
                  "http://www.w3.org/2000/svg",
                  a
                );
                break;
              case 2:
                u = c.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  a
                );
                break;
              default:
                switch (a) {
                  case "svg":
                    u = c.createElementNS(
                      "http://www.w3.org/2000/svg",
                      a
                    );
                    break;
                  case "math":
                    u = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      a
                    );
                    break;
                  case "script":
                    u = c.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof l.is == "string" ? c.createElement("select", {
                      is: l.is
                    }) : c.createElement("select"), l.multiple ? u.multiple = !0 : l.size && (u.size = l.size);
                    break;
                  default:
                    u = typeof l.is == "string" ? c.createElement(a, { is: l.is }) : c.createElement(a);
                }
            }
            u[re] = e, u[Ue] = l;
            t: for (c = e.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                u.appendChild(c.stateNode);
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
            e.stateNode = u;
            t: switch (Ge(u, a, l), a) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break t;
              case "img":
                l = !0;
                break t;
              default:
                l = !1;
            }
            l && zl(e);
          }
        }
        return le(e), e.subtreeFlags &= -33554433, es(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== l && zl(e);
        else {
          if (typeof l != "string" && e.stateNode === null)
            throw Error(o(166));
          if (t = _n.current, Ou(e)) {
            if (t = e.stateNode, n = e.memoizedProps, l = null, a = ze, a !== null)
              switch (a.tag) {
                case 27:
                case 5:
                  l = a.memoizedProps;
              }
            t[re] = e, t = !!(t.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Ih(t.nodeValue, n)), t || Pl(e, !0);
          } else
            t = ki(t).createTextNode(
              l
            ), t[re] = e, e.stateNode = t;
        }
        return le(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (l = Ou(e), n !== null) {
            if (t === null) {
              if (!l) throw Error(o(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(557));
              t[re] = e;
            } else
              La(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            le(e), t = !1;
          } else
            n = fo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (gn(e), e) : (gn(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(o(558));
        }
        return le(e), null;
      case 13:
        if (l = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (a = Ou(e), l !== null && l.dehydrated !== null) {
            if (t === null) {
              if (!a) throw Error(o(318));
              if (a = e.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(o(317));
              a[re] = e;
            } else
              La(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            le(e), a = !1;
          } else
            a = fo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a), a = !0;
          if (!a)
            return e.flags & 256 ? (gn(e), e) : (gn(e), null);
        }
        return gn(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = l !== null, t = t !== null && t.memoizedState !== null, n && (l = e.child, a = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (a = l.alternate.memoizedState.cachePool.pool), u = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== a && (l.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), $c(e, e.updateQueue), le(e), null);
      case 4:
        return Ln(), t === null && js(e.stateNode.containerInfo), e.flags |= 67108864, le(e), null;
      case 10:
        return Al(e.type), le(e), null;
      case 19:
        if (Oo(e), l = e.memoizedState, l === null) return le(e), null;
        if (a = (e.flags & 128) !== 0, u = l.rendering, u === null)
          if (a) Ui(l, !1);
          else {
            if (he !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (u = Bc(t), u !== null) {
                  for (e.flags |= 128, Ui(l, !1), t = u.updateQueue, e.updateQueue = t, $c(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    Td(n, t), n = n.sibling;
                  return zi(
                    e,
                    Ve.current & 1 | 2
                  ), Ut && Tl(e, l.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            l.tail !== null && Ke() > sr && (e.flags |= 128, a = !0, Ui(l, !1), e.lanes = 4194304);
          }
        else {
          if (!a)
            if (t = Bc(u), t !== null) {
              if (e.flags |= 128, a = !0, t = t.updateQueue, e.updateQueue = t, $c(e, t), Ui(l, !0), l.tail === null && l.tailMode !== "collapsed" && l.tailMode !== "visible" && !u.alternate && !Ut)
                return le(e), null;
            } else
              2 * Ke() - l.renderingStartTime > sr && n !== 536870912 && (e.flags |= 128, a = !0, Ui(l, !1), e.lanes = 4194304);
          l.isBackwards ? (u.sibling = e.child, e.child = u) : (t = l.last, t !== null ? t.sibling = u : e.child = u, l.last = u);
        }
        if (l.tail !== null) {
          t = l.tail;
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
          return l.rendering = t, l.tail = t.sibling, l.renderingStartTime = Ke(), t.sibling = null, u = Ve.current, u = a ? u & 1 | 2 : u & 1, l.tailMode === "visible" || l.tailMode === "collapsed" || !n || Ut ? zi(e, u) : (n = u, jt(Le, e), jt(Ve, n), ke === null && (ke = e)), Ut && Tl(e, l.treeForkCount), t;
        }
        return le(e), null;
      case 22:
      case 23:
        return gn(e), Co(), l = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== l && (e.flags |= 8192) : l && (e.flags |= 8192), l ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (le(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : le(e), n = e.updateQueue, n !== null && $c(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), l = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), l !== n && (e.flags |= 2048), t !== null && ee(Xa), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Al(Se), le(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, le(e), null;
    }
    throw Error(o(156, e.tag));
  }
  function Og(t, e) {
    switch (oo(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return Al(Se), Ln(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return ml(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (gn(e), e.alternate === null)
            throw Error(o(340));
          La();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (gn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(o(340));
          La();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Oo(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return Ln(), null;
      case 10:
        return Al(e.type), null;
      case 22:
      case 23:
        return gn(e), Co(), t !== null && ee(Xa), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Al(Se), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function W0(t, e) {
    switch (oo(e), e.tag) {
      case 3:
        Al(Se), Ln();
        break;
      case 26:
      case 27:
      case 5:
        ml(e);
        break;
      case 4:
        Ln();
        break;
      case 31:
        e.memoizedState !== null && gn(e);
        break;
      case 13:
        gn(e);
        break;
      case 19:
        Oo(e);
        break;
      case 10:
        Al(e.type);
        break;
      case 22:
      case 23:
        gn(e), Co(), t !== null && ee(Xa);
        break;
      case 24:
        Al(Se);
    }
  }
  function Hi(t, e) {
    try {
      var n = e.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var a = l.next;
        n = a;
        do {
          if ((n.tag & t) === t) {
            l = void 0;
            var u = n.create, c = n.inst;
            l = u(), c.destroy = l;
          }
          n = n.next;
        } while (n !== a);
      }
    } catch (f) {
      Ft(e, e.return, f);
    }
  }
  function ra(t, e, n) {
    try {
      var l = e.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        l = u;
        do {
          if ((l.tag & t) === t) {
            var c = l.inst, f = c.destroy;
            if (f !== void 0) {
              c.destroy = void 0, a = e;
              var v = n, O = f;
              try {
                O();
              } catch (M) {
                Ft(
                  a,
                  v,
                  M
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (M) {
      Ft(e, e.return, M);
    }
  }
  function $0(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        Gd(e, n);
      } catch (l) {
        Ft(t, t.return, l);
      }
    }
  }
  function P0(t, e, n) {
    n.props = Ja(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      Ft(t, e, l);
    }
  }
  function el(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var l = t.stateNode;
            break;
          case 30:
            var a = t.stateNode, u = Sl(t.memoizedProps, a);
            (a.ref === null || a.ref.name !== u) && (a.ref = im(u)), l = a.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var c = new En(t);
              g(
                t.child,
                !1,
                gy,
                c,
                void 0,
                void 0
              ), t.stateNode = c;
            }
            l = t.stateNode;
            break;
          default:
            l = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(l) : n.current = l;
      }
    } catch (f) {
      Ft(t, e, f);
    }
  }
  function qe(t, e) {
    var n = t.ref, l = t.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (a) {
          Ft(t, e, a);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (a) {
          Ft(t, e, a);
        }
      else n.current = null;
  }
  function Pc(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var n = 0; n < e.length; n++)
        dm(
          t.stateNode,
          e[n]
        );
  }
  function th(t) {
    for (var e = t.return; e !== null && (ls(e) && dm(t.stateNode, e.stateNode), !ns(e)); )
      e = e.return;
  }
  function ji(t) {
    for (var e = t.return; e !== null && (ls(e) && yy(t.stateNode, e.stateNode), !ns(e)); )
      e = e.return;
  }
  function ns(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function ls(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function as(t) {
    var e = t.type, n = t.memoizedProps, l = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break t;
        case "img":
          n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (a) {
      Ft(t, t.return, a);
    }
  }
  function us(t, e, n) {
    try {
      var l = t.stateNode;
      $g(l, t.type, n, e), l[Ue] = e;
    } catch (a) {
      Ft(t, t.return, a);
    }
  }
  function eh(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && va(t.type) || t.tag === 4;
  }
  function is(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || eh(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && va(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function cs(t, e, n, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      a = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(a, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(a), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = Ie)), Pc(t, l), yt = !0;
    else if (a !== 4 && (a === 27 && (Pc(t, l), l = null, va(t.type) && (n = t.stateNode, e = null)), t = t.child, t !== null))
      for (cs(
        t,
        e,
        n,
        l
      ), t = t.sibling; t !== null; )
        cs(
          t,
          e,
          n,
          l
        ), t = t.sibling;
  }
  function tr(t, e, n, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      a = t.stateNode, e ? n.insertBefore(a, e) : n.appendChild(a), Pc(t, l), yt = !0;
    else if (a !== 4 && (a === 27 && (Pc(t, l), l = null, va(t.type) && (n = t.stateNode)), t = t.child, t !== null))
      for (tr(
        t,
        e,
        n,
        l
      ), t = t.sibling; t !== null; )
        tr(
          t,
          e,
          n,
          l
        ), t = t.sibling;
  }
  function nh(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var l = t.type, a = e.attributes; a.length; )
        e.removeAttributeNode(a[0]);
      Ge(e, l, n), e[re] = t, e[Ue] = n;
    } catch (u) {
      Ft(t, t.return, u);
    }
  }
  var er = !1, yn = null;
  function lh(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (er = !0);
  }
  var nl = null;
  function ah() {
    var t = nl;
    return nl = null, t;
  }
  var an = 0;
  function Uu(t, e, n, l, a) {
    return an = 0, uh(
      t.child,
      e,
      n,
      l,
      a
    );
  }
  function uh(t, e, n, l, a) {
    for (var u = !1; t !== null; ) {
      if (t.tag === 5) {
        var c = t.stateNode;
        if (l !== null) {
          var f = Qs(c);
          l.push(f), f.view && (u = !0);
        } else
          u || Qs(c).view && (u = !0);
        er = !0, am(
          c,
          an === 0 ? e : e + "_" + an,
          n
        ), an++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && a || uh(
        t.child,
        e,
        n,
        l,
        a
      ) && (u = !0));
      t = t.sibling;
    }
    return u;
  }
  function ll(t, e) {
    for (; t !== null; )
      t.tag === 5 ? um(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || ll(
        t.child,
        e
      )), t = t.sibling;
  }
  function nr(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (nr(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(o(544));
          var n = e.name;
          e = El(e.default, e.share), e !== "none" && (Uu(
            t,
            n,
            e,
            null,
            !1
          ) || ll(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function rs(t, e) {
    if (t.tag === 30) {
      var n = t.stateNode, l = t.memoizedProps, a = Sl(l, n), u = El(
        l.default,
        n.paired ? l.share : l.enter
      );
      u !== "none" ? Uu(t, a, u, null, !1) ? (nr(t), n.paired || e || Yu(t, l.onEnter)) : ll(t.child, !1) : nr(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        rs(t, e), t = t.sibling;
    else nr(t);
  }
  function os(t) {
    if (yn !== null && yn.size !== 0) {
      var e = yn;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var n = t.memoizedProps, l = n.name;
              if (l != null && l !== "auto") {
                var a = e.get(l);
                if (a !== void 0) {
                  var u = El(
                    n.default,
                    n.share
                  );
                  if (u !== "none" && (Uu(
                    t,
                    l,
                    u,
                    null,
                    !1
                  ) ? (u = t.stateNode, a.paired = u, u.paired = a, Yu(t, n.onShare)) : ll(t.child, !1)), e.delete(l), e.size === 0) break;
                }
              }
            }
            os(t);
          }
          t = t.sibling;
        }
    }
  }
  function ss(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, n = Sl(e, t.stateNode), l = yn !== null ? yn.get(n) : void 0, a = El(
        e.default,
        l !== void 0 ? e.share : e.exit
      );
      a !== "none" && (Uu(t, n, a, null, !1) ? l !== void 0 ? (a = t.stateNode, l.paired = a, a.paired = l, yn.delete(n), Yu(t, e.onShare)) : Yu(t, e.onExit) : ll(t.child, !1)), yn !== null && os(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        ss(t), t = t.sibling;
    else
      yn !== null && os(t);
  }
  function ih(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, n = Sl(e, t.stateNode);
        e = El(e.default, e.update), t.flags &= -5, e !== "none" && Uu(
          t,
          n,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && ih(t);
      t = t.sibling;
    }
  }
  function fs(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, ll(t.child, !1));
          }
          fs(t);
        }
        t = t.sibling;
      }
  }
  function lr(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, ll(t.child, !1), fs(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        lr(t), t = t.sibling;
    else fs(t);
  }
  function ch(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? ll(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && ch(t), t = t.sibling;
  }
  function ds(t, e, n, l, a, u, c) {
    for (var f = !1; e !== null; ) {
      if (e.tag === 5) {
        var v = e.stateNode;
        if (u !== null && an < u.length) {
          var O = u[an], M = Qs(v);
          (O.view || M.view) && (f = !0);
          var q;
          if (q = (t.flags & 4) === 0)
            if (M.clip) q = !0;
            else {
              q = O.rect;
              var C = M.rect;
              q = q.y !== C.y || q.x !== C.x || q.height !== C.height || q.width !== C.width;
            }
          q && (t.flags |= 4), M.abs ? M = !O.abs : (O = O.rect, M = M.rect, M = O.height !== M.height || O.width !== M.width), M && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && am(
          v,
          an === 0 ? n : n + "_" + an,
          a
        ), f && (t.flags & 4) !== 0 || (nl === null && (nl = []), nl.push(
          v,
          an === 0 ? l : l + "_" + an,
          e.memoizedProps
        )), an++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && c ? t.flags |= e.flags & 32 : ds(
        t,
        e.child,
        n,
        l,
        a,
        u,
        c
      ) && (f = !0));
      e = e.sibling;
    }
    return f;
  }
  function rh(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var n = t.memoizedProps, l = t.stateNode, a = Sl(n, l), u = El(n.default, n.update), c;
        c = t.memoizedState, t.memoizedState = null, l = t;
        var f = t.child;
        an = 0, a = ds(
          l,
          f,
          a,
          a,
          u,
          c,
          !1
        ), (t.flags & 4) !== 0 && a && Yu(t, n.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && rh(t);
      t = t.sibling;
    }
  }
  var De = !1, Jt = !1, al = !1, hs = !1, oh = typeof WeakSet == "function" ? WeakSet : Set, xe = null, ul = !1, Bi = !1, ar = !1, ms = !1;
  function Ng(t, e, n) {
    if (t = t.containerInfo, Vs = $u, t = hd(t), Pr(t)) {
      if ("selectionStart" in t)
        var l = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          l = (l = t.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var u = a.anchorOffset, c = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, c.nodeType;
            } catch {
              l = null;
              break t;
            }
            var f = 0, v = -1, O = -1, M = 0, q = 0, C = t, D = null;
            e: for (; ; ) {
              for (var $; C !== l || u !== 0 && C.nodeType !== 3 || (v = f + u), C !== c || a !== 0 && C.nodeType !== 3 || (O = f + a), C.nodeType === 3 && (f += C.nodeValue.length), ($ = C.firstChild) !== null; )
                D = C, C = $;
              for (; ; ) {
                if (C === t) break e;
                if (D === l && ++M === u && (v = f), D === c && ++q === a && (O = f), ($ = C.nextSibling) !== null) break;
                C = D, D = C.parentNode;
              }
              C = $;
            }
            l = v === -1 || O === -1 ? null : { start: v, end: O };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (qs = { focusedElem: t, selectionRange: l }, $u = !1, n = (n & 335544064) === n, xe = e, e = n ? 9270 : 1024; xe !== null; ) {
      if (t = xe, n && (l = t.deletions, l !== null))
        for (u = 0; u < l.length; u++)
          n && ss(l[u]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        n && lh(t), ur(n);
      else {
        if (t.tag === 22) {
          if (l = t.alternate, t.memoizedState !== null) {
            l !== null && l.memoizedState === null && n && ss(l), ur(n);
            continue;
          } else if (l !== null && l.memoizedState !== null) {
            n && lh(t), ur(n);
            continue;
          }
        }
        l = t.child, (t.subtreeFlags & e) !== 0 && l !== null ? (l.return = t, xe = l) : (n && ih(t), ur(n));
      }
    }
    yn = null;
  }
  function ur(t) {
    for (; xe !== null; ) {
      var e = xe, n = t, l = e.alternate, a = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((a & 1024) !== 0 && l !== null) {
            n = void 0, a = l.memoizedProps, l = l.memoizedState;
            var u = e.stateNode;
            try {
              var c = Ja(
                e.type,
                a
              );
              n = u.getSnapshotBeforeUpdate(
                c,
                l
              ), u.__reactInternalSnapshotBeforeUpdate = n;
            } catch (f) {
              Ft(e, e.return, f);
            }
          }
          break;
        case 3:
          if ((a & 1024) !== 0) {
            if (l = e.stateNode.containerInfo, n = l.nodeType, n === 9)
              Ks(l);
            else if (n === 1)
              switch (l.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Ks(l);
                  break;
                default:
                  l.textContent = "";
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
          n && l !== null && (n = Sl(
            l.memoizedProps,
            l.stateNode
          ), a = e.memoizedProps, a = El(a.default, a.update), a !== "none" && Uu(
            l,
            n,
            a,
            l.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((a & 1024) !== 0) throw Error(o(163));
      }
      if (l = e.sibling, l !== null) {
        l.return = e.return, xe = l;
        break;
      }
      xe = e.return;
    }
  }
  function sh(t, e, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        il(t, n), l & 4 && Hi(5, n);
        break;
      case 1:
        if (il(t, n), l & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (c) {
              Ft(n, n.return, c);
            }
          else {
            var a = Ja(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                a,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              Ft(
                n,
                n.return,
                c
              );
            }
          }
        l & 64 && $0(n), l & 512 && el(n, n.return);
        break;
      case 3:
        if (il(t, n), l & 64 && (t = n.updateQueue, t !== null)) {
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
            Gd(t, e);
          } catch (c) {
            Ft(n, n.return, c);
          }
        }
        break;
      case 27:
        e === null && l & 4 && nh(n);
      case 26:
      case 5:
        il(t, n), e === null && l & 4 && as(n), l & 512 && el(n, n.return);
        break;
      case 12:
        il(t, n);
        break;
      case 31:
        il(t, n), l & 4 && mh(t, n);
        break;
      case 13:
        il(t, n), l & 4 && vh(t, n), l & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = Vg.bind(
          null,
          n
        ), Sy(t, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || De, !l) {
          var u = e !== null && e.memoizedState !== null || Jt;
          e = De, a = Jt, De = l, (Jt = u) && !a ? (l = 2, (n.subtreeFlags & 8772) !== 0 && (l |= 1), Jn(
            t,
            n,
            l
          )) : il(t, n), De = e, Jt = a;
        }
        break;
      case 30:
        il(t, n), l & 512 && el(n, n.return);
        break;
      case 7:
        l & 512 && el(n, n.return);
      default:
        il(t, n);
    }
  }
  function vs(t, e) {
    for (t = t.child; t !== null; )
      fh(t, e), t = t.sibling;
  }
  function fh(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var n = t.stateNode;
          if (e) {
            var l = n.style;
            typeof l.setProperty == "function" ? l.setProperty("display", "none", "important") : l.display = "none";
          } else {
            var a = t.stateNode, u = t.memoizedProps.style, c = u != null && u.hasOwnProperty("display") ? u.display : null;
            a.style.display = c == null || typeof c == "boolean" ? "" : ("" + c).trim();
          }
        } catch (v) {
          Ft(t, t.return, v);
        }
        gs(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, yt = !0;
        } catch (v) {
          Ft(t, t.return, v);
        }
        break;
      case 18:
        try {
          var f = t.stateNode;
          e ? lm(f, !0) : lm(t.stateNode, !1);
        } catch (v) {
          Ft(t, t.return, v);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && vs(t, e);
        break;
      default:
        vs(t, e);
    }
  }
  function gs(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var n = t, l = e;
          switch (n.tag) {
            case 4:
              fh(n, l);
              break t;
            case 22:
              n.memoizedState === null && gs(n, l);
              break t;
            default:
              gs(n, l);
          }
        }
        t = t.sibling;
      }
  }
  function dh(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, dh(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && mu(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var ie = null, un = !1;
  function Zn(t, e, n) {
    for (n = n.child; n !== null; )
      hh(t, e, n), n = n.sibling;
  }
  function hh(t, e, n) {
    if (Xe && typeof Xe.onCommitFiberUnmount == "function")
      try {
        Xe.onCommitFiberUnmount(ql, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Jt || qe(n, e), Zn(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Jt && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Jt || qe(n, e), ji(n);
        var l = ie, a = un;
        va(n.type) && (ie = n.stateNode, un = !1), Zn(
          t,
          e,
          n
        ), ym(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), ie = l, un = a;
        break;
      case 5:
        Jt || qe(n, e), ji(n);
      case 6:
        if (n.tag === 6 && ji(n), l = ie, a = un, ie = null, Zn(
          t,
          e,
          n
        ), ie = l, un = a, ie !== null)
          if (un)
            try {
              (ie.nodeType === 9 ? ie.body : ie.nodeName === "HTML" ? ie.ownerDocument.body : ie).removeChild(n.stateNode), yt = !0;
            } catch (u) {
              Ft(
                n,
                e,
                u
              );
            }
          else
            try {
              ie.removeChild(n.stateNode), yt = !0;
            } catch (u) {
              Ft(
                n,
                e,
                u
              );
            }
        break;
      case 18:
        ie !== null && (un ? (t = ie, nm(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), Pu(t)) : nm(ie, n.stateNode));
        break;
      case 4:
        l = ie, a = un, ie = n.stateNode.containerInfo, un = !0, Zn(
          t,
          e,
          n
        ), ie = l, un = a;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ra(2, n, e), Jt || ra(4, n, e), Zn(
          t,
          e,
          n
        );
        break;
      case 1:
        Jt || (qe(n, e), l = n.stateNode, typeof l.componentWillUnmount == "function" && P0(
          n,
          e,
          l
        )), Zn(
          t,
          e,
          n
        );
        break;
      case 21:
        Zn(
          t,
          e,
          n
        );
        break;
      case 22:
        Jt = (l = Jt) || n.memoizedState !== null, Zn(
          t,
          e,
          n
        ), Jt = l;
        break;
      case 30:
        qe(n, e), Zn(
          t,
          e,
          n
        );
        break;
      case 7:
        Jt || qe(n, e), Zn(
          t,
          e,
          n
        );
        break;
      default:
        Zn(
          t,
          e,
          n
        );
    }
  }
  function mh(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Pu(t);
      } catch (n) {
        Ft(e, e.return, n);
      }
    }
  }
  function vh(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Pu(t);
      } catch (n) {
        Ft(e, e.return, n);
      }
  }
  function Rg(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new oh()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new oh()), e;
      default:
        throw Error(o(435, t.tag));
    }
  }
  function ir(t, e) {
    var n = Rg(t);
    e.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var a = qg.bind(null, t, l);
        l.then(a, a);
      }
    });
  }
  function $e(t, e, n) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a], c = t, f = e, v = f;
        t: for (; v !== null; ) {
          switch (v.tag) {
            case 27:
              if (va(v.type)) {
                ie = v.stateNode, un = !1;
                break t;
              }
              break;
            case 5:
              ie = v.stateNode, un = !1;
              break t;
            case 3:
            case 4:
              ie = v.stateNode.containerInfo, un = !0;
              break t;
          }
          v = v.return;
        }
        if (ie === null) throw Error(o(160));
        hh(c, f, u), ie = null, un = !1, c = u.alternate, c !== null && (c.return = null), u.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        gh(e, t, n), e = e.sibling;
  }
  var Kn = null;
  function gh(t, e, n) {
    var l = t.alternate, a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (a & 4 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
          for (var u = 0; u < l.length; u++) {
            var c = l[u];
            c.ref.impl = c.nextImpl;
          }
        $e(e, t, n), Pe(t), a & 4 && (ra(3, t, t.return), Hi(3, t), ra(5, t, t.return));
        break;
      case 1:
        $e(e, t, n), Pe(t), a & 512 && (Jt || l === null || qe(l, l.return)), a & 64 && De && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? e : n.concat(e))));
        break;
      case 26:
        if (u = Kn, $e(e, t, n), Pe(t), a & 512 && (Jt || l === null || qe(l, l.return)), a & 4)
          if (a = l !== null ? l.memoizedState : null, n = t.memoizedState, l === null)
            if (n === null)
              if (t.stateNode === null)
                if (De)
                  t.stateNode = Ph(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, n = t.memoizedProps, a = u.ownerDocument || u;
                    e: switch (e) {
                      case "title":
                        l = a.getElementsByTagName("title")[0], (!l || l[Na] || l[re] || l.namespaceURI === "http://www.w3.org/2000/svg" || l.hasAttribute("itemprop")) && (l = a.createElement(e), a.head.insertBefore(
                          l,
                          a.querySelector("head > title")
                        )), Ge(l, e, n), l[re] = t, J(l), e = l;
                        break t;
                      case "link":
                        if (u = Tm(
                          "link",
                          "href",
                          a
                        ).get(e + (n.href || ""))) {
                          for (c = 0; c < u.length; c++)
                            if (l = u[c], l.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && l.getAttribute("rel") === (n.rel == null ? null : n.rel) && l.getAttribute("title") === (n.title == null ? null : n.title) && l.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              u.splice(c, 1);
                              break e;
                            }
                        }
                        l = a.createElement(e), Ge(l, e, n), a.head.appendChild(l);
                        break;
                      case "meta":
                        if (u = Tm(
                          "meta",
                          "content",
                          a
                        ).get(e + (n.content || ""))) {
                          for (c = 0; c < u.length; c++)
                            if (l = u[c], l.getAttribute("content") === (n.content == null ? null : "" + n.content) && l.getAttribute("name") === (n.name == null ? null : n.name) && l.getAttribute("property") === (n.property == null ? null : n.property) && l.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && l.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              u.splice(c, 1);
                              break e;
                            }
                        }
                        l = a.createElement(e), Ge(l, e, n), a.head.appendChild(l);
                        break;
                      default:
                        throw Error(o(468, e));
                    }
                    l[re] = t, J(l), e = l;
                  }
                  t.stateNode = e;
                }
              else
                De || tf(u, t.type, t.stateNode);
            else
              t.stateNode = _m(
                u,
                n,
                t.memoizedProps
              );
          else
            a !== n ? (a === null ? (e = l.stateNode, e === null || Jt || e.parentNode.removeChild(e)) : a.count--, n === null ? De || tf(u, t.type, t.stateNode) : _m(u, n, t.memoizedProps)) : n === null && t.stateNode !== null && us(
              t,
              t.memoizedProps,
              l.memoizedProps
            );
        break;
      case 27:
        $e(e, t, n), Pe(t), a & 512 && (Jt || l === null || qe(l, l.return)), l !== null && a & 4 && us(
          t,
          t.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (u = al, al = !1, $e(e, t, n), al = u, Pe(t), a & 512 && (Jt || l === null || qe(l, l.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            Je(e, ""), yt = !0;
          } catch (M) {
            Ft(t, t.return, M);
          }
        }
        a & 4 && t.stateNode != null && (e = t.memoizedProps, us(
          t,
          e,
          l !== null ? l.memoizedProps : e
        )), a & 1024 && (hs = !0);
        break;
      case 6:
        if ($e(e, t, n), Pe(t), a & 4) {
          if (t.stateNode === null)
            throw Error(o(162));
          e = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = e, yt = !0;
          } catch (M) {
            Ft(t, t.return, M);
          }
        }
        break;
      case 3:
        if (yt = !1, Er = null, u = Kn, Kn = Zi(e.containerInfo), $e(e, t, n), Kn = u, Pe(t), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Pu(e.containerInfo);
          } catch (M) {
            Ft(t, t.return, M);
          }
        hs && (hs = !1, yh(t)), yt = !1;
        break;
      case 4:
        a = al, al = De, l = Ce(), u = Kn, Kn = Zi(
          t.stateNode.containerInfo
        ), $e(e, t, n), Pe(t), Kn = u, yt && Bi && (ar = !0), yt = l, al = a;
        break;
      case 12:
        $e(e, t, n), Pe(t);
        break;
      case 31:
        $e(e, t, n), Pe(t), a & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ir(t, e)));
        break;
      case 13:
        $e(e, t, n), Pe(t), t.child.flags & 8192 && t.memoizedState !== null != (l !== null && l.memoizedState !== null) && (or = Ke()), a & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ir(t, e)));
        break;
      case 22:
        u = t.memoizedState !== null, c = l !== null && l.memoizedState !== null;
        var f = De, v = Jt, O = al;
        De = f || u, al = O || u, Jt = v || c, $e(e, t, n), Jt = v, al = O, De = f, Pe(t), a & 8192 && (e = t.stateNode, e._visibility = u ? e._visibility & -2 : e._visibility | 1, !u || l === null || c || De || Jt || (e = c || Jt, n = De, l = Jt, De = u || De, Jt = e, oa(t, 2), De = n, Jt = l), !u && al || vs(t, u)), a & 4 && (e = t.updateQueue, e !== null && (n = e.retryQueue, n !== null && (e.retryQueue = null, ir(t, n))));
        break;
      case 19:
        $e(e, t, n), Pe(t), a & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ir(t, e)));
        break;
      case 30:
        a & 512 && (Jt || l === null || qe(l, l.return)), a = Ce(), u = Bi, c = (n & 335544064) === n, f = t.memoizedProps, Bi = c && El(
          f.default,
          f.update
        ) !== "none", $e(e, t, n), Pe(t), c && l !== null && yt && (t.flags |= 4), Bi = u, yt = a;
        break;
      case 21:
        break;
      case 7:
        a & 512 && (Jt || l === null || qe(l, l.return)), l && l.stateNode !== null && (l.stateNode._fragmentFiber = t);
      default:
        $e(e, t, n), Pe(t);
    }
  }
  function Pe(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, l = t.return; l !== null; ) {
          if (eh(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        l = null;
        for (var a = t.return; a !== null; ) {
          if (ls(a)) {
            var u = a.stateNode;
            l === null ? l = [u] : l.push(u);
          }
          if (ns(a)) break;
          a = a.return;
        }
        var c = l;
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var f = n.stateNode, v = is(t);
            tr(
              t,
              v,
              f,
              c
            );
            break;
          case 5:
            var O = n.stateNode;
            n.flags & 32 && (Je(O, ""), n.flags &= -33);
            var M = is(t);
            tr(
              t,
              M,
              O,
              c
            );
            break;
          case 3:
          case 4:
            var q = n.stateNode.containerInfo, C = is(t);
            cs(
              t,
              C,
              q,
              c
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (D) {
        Ft(t, t.return, D);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function yh(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        yh(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, $u = !0, e.reset(), $u = !1), t = t.sibling;
      }
  }
  function Hu(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        bh(e, t), e = e.sibling;
    else rh(e);
  }
  function bh(t, e) {
    var n = t.alternate;
    if (n === null) rs(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (ms = ul = !1, ah(), Hu(e, t), !ul && !ar) {
            if (t = nl, t !== null)
              for (var l = 0; l < t.length; l += 3) {
                n = t[l];
                var a = t[l + 1];
                um(n, t[l + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + a + ")"
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
            )), ms = !0;
          }
          nl = null;
          break;
        case 5:
          Hu(e, t);
          break;
        case 4:
          l = ul, ul = !1, Hu(e, t), ul && (ar = !0), ul = l;
          break;
        case 22:
          t.memoizedState === null && (n.memoizedState !== null ? rs(t, !1) : Hu(e, t));
          break;
        case 30:
          l = ul, a = ah(), ul = !1, Hu(e, t), ul && (t.flags |= 4);
          var u = t.memoizedProps, c = t.stateNode;
          e = Sl(u, c), c = Sl(n.memoizedProps, c);
          var f = El(u.default, u.update);
          f === "none" ? e = !1 : (u = n.memoizedState, n.memoizedState = null, n = t.child, an = 0, e = ds(
            t,
            n,
            e,
            c,
            f,
            u,
            !0
          ), an !== (u === null ? 0 : u.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (Yu(
            t,
            t.memoizedProps.onUpdate
          ), nl = a) : a !== null && (a.push.apply(a, nl), nl = a), ul = (t.flags & 32) !== 0 ? !0 : l;
          break;
        default:
          Hu(e, t);
      }
  }
  function il(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        sh(t, e.alternate, e), e = e.sibling;
  }
  function oa(t, e) {
    for (t = t.child; t !== null; ) {
      var n = t, l = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ra(4, n, n.return), oa(
            n,
            l
          );
          break;
        case 1:
          qe(n, n.return);
          var a = n.stateNode;
          typeof a.componentWillUnmount == "function" && P0(
            n,
            n.return,
            a
          ), oa(
            n,
            l
          );
          break;
        case 27:
          (l & 2) !== 0 && ym(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          qe(n, n.return), n.tag !== 5 && n.tag !== 27 || ji(n), oa(
            n,
            l
          );
          break;
        case 6:
          ji(n);
          break;
        case 26:
          qe(n, n.return), a = n.stateNode, n.memoizedState !== null || a === null || Jt || a.parentNode.removeChild(a), oa(
            n,
            l
          );
          break;
        case 22:
          n.memoizedState === null && oa(
            n,
            l
          );
          break;
        case 30:
          qe(n, n.return), oa(
            n,
            l
          );
          break;
        case 7:
          qe(n, n.return);
        default:
          oa(
            n,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Jn(t, e, n) {
    for (n = (e.subtreeFlags & 8772) !== 0 ? n : n & -2, e = e.child; e !== null; ) {
      var l = e.alternate, a = t, u = e, c = u.flags, f = (n & 1) !== 0;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Jn(
            a,
            u,
            n
          ), Hi(4, u);
          break;
        case 1:
          if (Jn(
            a,
            u,
            n
          ), l = u, a = l.stateNode, typeof a.componentDidMount == "function")
            try {
              a.componentDidMount();
            } catch (M) {
              Ft(l, l.return, M);
            }
          if (l = u, a = l.updateQueue, a !== null) {
            var v = l.stateNode;
            try {
              var O = a.shared.hiddenCallbacks;
              if (O !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < O.length; a++)
                  qd(O[a], v);
            } catch (M) {
              Ft(l, l.return, M);
            }
          }
          f && c & 64 && $0(u), el(u, u.return);
          break;
        case 27:
          (n & 2) !== 0 && nh(u);
        case 5:
          u.tag !== 5 && u.tag !== 27 || th(u), Jn(
            a,
            u,
            n
          ), f && l === null && c & 4 && as(u), el(u, u.return);
          break;
        case 6:
          th(u);
          break;
        case 26:
          v = u.stateNode, u.memoizedState !== null || v === null || De || tf(
            Zi(v.ownerDocument),
            u.type,
            v
          ), Jn(
            a,
            u,
            n
          ), f && l === null && c & 4 && as(u), el(u, u.return);
          break;
        case 12:
          Jn(
            a,
            u,
            n
          );
          break;
        case 31:
          Jn(
            a,
            u,
            n
          ), f && c & 4 && mh(a, u);
          break;
        case 13:
          Jn(
            a,
            u,
            n
          ), f && c & 4 && vh(a, u);
          break;
        case 22:
          u.memoizedState === null && Jn(
            a,
            u,
            n
          ), el(u, u.return);
          break;
        case 30:
          Jn(
            a,
            u,
            n
          ), el(u, u.return);
          break;
        case 7:
          el(u, u.return);
        default:
          Jn(
            a,
            u,
            n
          );
      }
      e = e.sibling;
    }
  }
  function ys(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && _i(n));
  }
  function bs(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && _i(t));
  }
  function wn(t, e, n, l) {
    var a = (n & 335544064) === n;
    if (e.subtreeFlags & (a ? 10262 : 10256))
      for (e = e.child; e !== null; )
        ph(
          t,
          e,
          n,
          l
        ), e = e.sibling;
    else a && ch(e);
  }
  function ph(t, e, n, l) {
    var a = (n & 335544064) === n;
    a && e.alternate === null && e.return !== null && e.return.alternate !== null && lr(e);
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        wn(
          t,
          e,
          n,
          l
        ), u & 2048 && Hi(9, e);
        break;
      case 1:
        wn(
          t,
          e,
          n,
          l
        );
        break;
      case 3:
        wn(
          t,
          e,
          n,
          l
        ), a && ms && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), u & 2048 && (u = null, e.alternate !== null && (u = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== u && (e.refCount++, u != null && _i(u)));
        break;
      case 12:
        if (u & 2048) {
          wn(
            t,
            e,
            n,
            l
          ), u = e.stateNode;
          try {
            var c = e.memoizedProps, f = c.id, v = c.onPostCommit;
            typeof v == "function" && v(
              f,
              e.alternate === null ? "mount" : "update",
              u.passiveEffectDuration,
              -0
            );
          } catch (O) {
            Ft(e, e.return, O);
          }
        } else
          wn(
            t,
            e,
            n,
            l
          );
        break;
      case 31:
        wn(
          t,
          e,
          n,
          l
        );
        break;
      case 13:
        wn(
          t,
          e,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        c = e.stateNode, f = e.alternate, e.memoizedState !== null ? (a && f !== null && f.memoizedState === null && lr(f), c._visibility & 2 ? wn(
          t,
          e,
          n,
          l
        ) : Li(
          t,
          e
        )) : (a && f !== null && f.memoizedState !== null && lr(e), c._visibility & 2 ? wn(
          t,
          e,
          n,
          l
        ) : (c._visibility |= 2, ju(
          t,
          e,
          n,
          l,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), u & 2048 && ys(f, e);
        break;
      case 24:
        wn(
          t,
          e,
          n,
          l
        ), u & 2048 && bs(e.alternate, e);
        break;
      case 30:
        a && (u = e.alternate, u !== null && (ll(u.child, !0), ll(e.child, !0))), wn(
          t,
          e,
          n,
          l
        );
        break;
      default:
        wn(
          t,
          e,
          n,
          l
        );
    }
  }
  function ju(t, e, n, l, a) {
    for (a = a && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t, c = e, f = n, v = l, O = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ju(
            u,
            c,
            f,
            v,
            a
          ), Hi(8, c);
          break;
        case 23:
          break;
        case 22:
          var M = c.stateNode;
          c.memoizedState !== null ? M._visibility & 2 ? ju(
            u,
            c,
            f,
            v,
            a
          ) : Li(
            u,
            c
          ) : (M._visibility |= 2, ju(
            u,
            c,
            f,
            v,
            a
          )), a && O & 2048 && ys(
            c.alternate,
            c
          );
          break;
        case 24:
          ju(
            u,
            c,
            f,
            v,
            a
          ), a && O & 2048 && bs(c.alternate, c);
          break;
        default:
          ju(
            u,
            c,
            f,
            v,
            a
          );
      }
      e = e.sibling;
    }
  }
  function Li(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, l = e, a = l.flags;
        switch (l.tag) {
          case 22:
            Li(n, l), a & 2048 && ys(
              l.alternate,
              l
            );
            break;
          case 24:
            Li(n, l), a & 2048 && bs(l.alternate, l);
            break;
          default:
            Li(n, l);
        }
        e = e.sibling;
      }
  }
  var Ia = 8192;
  function Fa(t, e, n) {
    if (t.subtreeFlags & Ia)
      for (t = t.child; t !== null; )
        Sh(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function Sh(t, e, n) {
    switch (t.tag) {
      case 26:
        Fa(
          t,
          e,
          n
        ), t.flags & Ia && (t.memoizedState !== null ? Uy(
          n,
          Kn,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && Nm(n, t)));
        break;
      case 5:
        Fa(
          t,
          e,
          n
        ), t.flags & Ia && (t = t.stateNode, (e & 335544128) === e && Nm(n, t));
        break;
      case 3:
      case 4:
        var l = Kn;
        Kn = Zi(t.stateNode.containerInfo), Fa(
          t,
          e,
          n
        ), Kn = l;
        break;
      case 22:
        t.memoizedState === null && (l = t.alternate, l !== null && l.memoizedState !== null ? (l = Ia, Ia = 16777216, Fa(
          t,
          e,
          n
        ), Ia = l) : Fa(
          t,
          e,
          n
        ));
        break;
      case 30:
        if ((t.flags & Ia) !== 0 && (l = t.memoizedProps.name, l != null && l !== "auto")) {
          var a = t.stateNode;
          a.paired = null, yn === null && (yn = /* @__PURE__ */ new Map()), yn.set(l, a);
        }
        Fa(
          t,
          e,
          n
        );
        break;
      default:
        Fa(
          t,
          e,
          n
        );
    }
  }
  function Eh(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Vi(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          xe = l, Th(
            l,
            t
          );
        }
      Eh(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        _h(t), t = t.sibling;
  }
  function _h(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Vi(t), t.flags & 2048 && ra(9, t, t.return);
        break;
      case 3:
        Vi(t);
        break;
      case 12:
        Vi(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, cr(t)) : Vi(t);
        break;
      default:
        Vi(t);
    }
  }
  function cr(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          xe = l, Th(
            l,
            t
          );
        }
      Eh(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          ra(8, e, e.return), cr(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, cr(e));
          break;
        default:
          cr(e);
      }
      t = t.sibling;
    }
  }
  function Th(t, e) {
    for (; xe !== null; ) {
      var n = xe;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ra(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          _i(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, xe = l;
      else
        t: for (n = t; xe !== null; ) {
          l = xe;
          var a = l.sibling, u = l.return;
          if (dh(l), l === n) {
            xe = null;
            break t;
          }
          if (a !== null) {
            a.return = u, xe = a;
            break t;
          }
          xe = u;
        }
    }
  }
  var zg = {
    getCacheForType: function(t) {
      var e = Be(Se), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return Be(Se).controller.signal;
    }
  }, Dg = typeof WeakMap == "function" ? WeakMap : Map, Zt = 0, te = null, Bt = null, Vt = 0, It = 0, bn = null, sa = !1, Bu = !1, ps = !1, Dl = 0, he = 0, fa = 0, Wa = 0, rr = 0, pn = 0, Lu = 0, qi = null, cn = null, Ss = !1, or = 0, Ch = 0, sr = 1 / 0, fr = null, da = null, se = 0, In = null, $a = null, cl = 0, Es = 0, _s = null, Ah = null, Vu = null, qu = null, Gu = null, Gi = 0, dr = null;
  function Sn() {
    return (Zt & 2) !== 0 && Vt !== 0 ? Vt & -Vt : ct.T !== null ? Ms() : On();
  }
  function Oh() {
    if (pn === 0)
      if ((Vt & 536870912) === 0 || Ut) {
        var t = $n;
        $n <<= 1, ($n & 3932160) === 0 && ($n = 262144), pn = t;
      } else pn = 536870912;
    return t = Le.current, t !== null && (t.flags |= 32), pn;
  }
  function Yu(t, e) {
    if (e != null) {
      var n = t.stateNode, l = n.ref;
      l === null && (l = n.ref = im(
        Sl(t.memoizedProps, n)
      )), qu === null && (qu = []), qu.push(e.bind(null, l));
    }
  }
  function rn(t, e, n) {
    (t === te && (It === 2 || It === 9) || t.cancelPendingCommit !== null) && (Xu(t, 0), ha(
      t,
      Vt,
      pn,
      !1
    )), yl(t, n), ((Zt & 2) === 0 || t !== te) && (t === te && ((Zt & 2) === 0 && (Wa |= n), he === 4 && ha(
      t,
      Vt,
      pn,
      !1
    )), rl(t));
  }
  function Nh(t, e, n) {
    if ((Zt & 6) !== 0) throw Error(o(327));
    var l = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || Gn(t, e), a = l ? wg(t, e) : Cs(t, e, !0), u = l;
    do {
      if (a === 0) {
        Bu && !l && ha(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, u && !xg(n)) {
          a = Cs(t, e, !1), u = !1;
          continue;
        }
        if (a === 2) {
          if (u = e, t.errorRecoveryDisabledLanes & u)
            var c = 0;
          else
            c = t.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            e = c;
            t: {
              var f = t;
              a = qi;
              var v = f.current.memoizedState.isDehydrated;
              if (v && (Xu(f, c).flags |= 256), c = Cs(
                f,
                c,
                !1
              ), c !== 2 && c !== 6) {
                if (ps && !v) {
                  f.errorRecoveryDisabledLanes |= u, Wa |= u, a = 4;
                  break t;
                }
                u = cn, cn = a, u !== null && (cn === null ? cn = u : cn.push.apply(
                  cn,
                  u
                ));
              }
              a = c;
            }
            if (u = !1, a !== 2) continue;
          }
        }
        if (a === 1) {
          Xu(t, 0), ha(t, e, 0, !0);
          break;
        }
        t: {
          switch (l = t, u = a, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              ha(
                l,
                e,
                pn,
                !sa
              );
              break t;
            case 2:
              cn = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((e & 62914560) === e && (a = or + 300 - Ke(), 10 < a)) {
            if (ha(
              l,
              e,
              pn,
              !sa
            ), qn(l, 0, !0) !== 0) break t;
            cl = e, l.timeoutHandle = Xs(
              Rh.bind(
                null,
                l,
                n,
                cn,
                fr,
                Ss,
                e,
                pn,
                Wa,
                Lu,
                sa,
                u,
                "Throttled",
                -0,
                0
              ),
              a
            );
            break t;
          }
          Rh(
            l,
            n,
            cn,
            fr,
            Ss,
            e,
            pn,
            Wa,
            Lu,
            sa,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    rl(t);
  }
  function Rh(t, e, n, l, a, u, c, f, v, O, M, q, C, D) {
    t.timeoutHandle = -1;
    var $ = e.subtreeFlags, ot = (u & 335544064) === u;
    if (q = null, (ot || $ & 8192 || ($ & 16785408) === 16785408) && (q = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Ie
    }, yn = null, Sh(
      e,
      u,
      q
    ), ot && ($ = q, ot = t.containerInfo, ot = (ot.nodeType === 9 ? ot : ot.ownerDocument).__reactViewTransition, ot != null && ($.count++, $.waitingForViewTransition = !0, $ = Ii.bind($), ot.finished.then($, $))), $ = (u & 62914560) === u ? or - Ke() : (u & 4194048) === u ? Ch - Ke() : 0, $ = Hy(
      q,
      $
    ), $ !== null)) {
      cl = u, t.cancelPendingCommit = $(
        jh.bind(
          null,
          t,
          e,
          u,
          n,
          l,
          a,
          c,
          f,
          v,
          O,
          M,
          q,
          null,
          C,
          D
        )
      ), ha(t, u, c, !O);
      return;
    }
    jh(
      t,
      e,
      u,
      n,
      l,
      a,
      c,
      f,
      v,
      O,
      M,
      q
    );
  }
  function xg(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var a = n[l], u = a.getSnapshot;
          a = a.value;
          try {
            if (!vn(u(), a)) return !1;
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
  function ha(t, e, n, l) {
    e = Ql(t, e), e &= ~rr, e &= ~Wa, t.suspendedLanes |= e, t.pingedLanes &= ~e, l && (t.warmLanes |= e), l = t.expirationTimes;
    for (var a = e; 0 < a; ) {
      var u = 31 - Ne(a), c = 1 << u;
      l[u] = -1, a &= ~c;
    }
    n !== 0 && Xn(t, n, e);
  }
  function hr() {
    return (Zt & 6) === 0 ? (Yi(0), !1) : !0;
  }
  function Ts() {
    if (Bt !== null) {
      if (It === 0)
        var t = Bt.return;
      else
        t = Bt, Cl = Va = null, xo(t), zu = null, Ai = 0, t = Bt;
      for (; t !== null; )
        W0(t.alternate, t), t = t.return;
      Bt = null;
    }
  }
  function Xu(t, e) {
    var n = t.timeoutHandle;
    return n !== -1 && (t.timeoutHandle = -1, ey(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), cl = 0, Ts(), te = t, Bt = n = _l(t.current, null), Vt = e, It = 0, bn = null, sa = !1, Bu = Gn(t, e), ps = !1, Lu = pn = rr = Wa = fa = he = 0, cn = qi = null, Ss = !1, Dl = Ql(t, e), Ec(), n;
  }
  function zh(t, e) {
    Dt = null, ct.H = Zc, e === Ru || e === Mc ? (e = jd(), It = 3) : e === bo ? (e = jd(), It = 4) : It = e === Zo ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, bn = e, Bt === null && (he = 1, Kc(
      t,
      zn(e, t.current)
    ));
  }
  function Dh() {
    var t = Le.current;
    return t === null ? !0 : (Vt & 4194048) === Vt ? ke === null : (Vt & 62914560) === Vt || (Vt & 536870912) !== 0 ? t === ke : !1;
  }
  function xh() {
    var t = ct.H;
    return ct.H = Zc, t === null ? Zc : t;
  }
  function Mh() {
    var t = ct.A;
    return ct.A = zg, t;
  }
  function mr() {
    he = 4, sa || (Vt & 4194048) !== Vt && Le.current !== null || (Bu = !0), (fa & 134217727) === 0 && (Wa & 134217727) === 0 || te === null || ha(
      te,
      Vt,
      pn,
      !1
    );
  }
  function Cs(t, e, n) {
    var l = Zt;
    Zt |= 2;
    var a = xh(), u = Mh();
    (te !== t || Vt !== e) && (fr = null, Xu(t, e)), e = !1;
    var c = he;
    t: do
      try {
        if (It !== 0 && Bt !== null) {
          var f = Bt, v = bn;
          switch (It) {
            case 8:
              Ts(), c = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Le.current === null && (e = !0);
              var O = It;
              if (It = 0, bn = null, Qu(t, f, v, O), n && Bu) {
                c = 0;
                break t;
              }
              break;
            default:
              O = It, It = 0, bn = null, Qu(t, f, v, O);
          }
        }
        Mg(), c = he;
        break;
      } catch (M) {
        zh(t, M);
      }
    while (!0);
    return e && t.shellSuspendCounter++, Cl = Va = null, Zt = l, ct.H = a, ct.A = u, Bt === null && (te = null, Vt = 0, Ec()), c;
  }
  function Mg() {
    for (; Bt !== null; ) wh(Bt);
  }
  function wg(t, e) {
    var n = Zt;
    Zt |= 2;
    var l = xh(), a = Mh();
    te !== t || Vt !== e ? (fr = null, sr = Ke() + 500, Xu(t, e)) : Bu = Gn(
      t,
      e
    );
    t: do
      try {
        if (It !== 0 && Bt !== null) {
          e = Bt;
          var u = bn;
          e: switch (It) {
            case 1:
              It = 0, bn = null, Qu(t, e, u, 1);
              break;
            case 2:
            case 9:
              if (Ud(u)) {
                It = 0, bn = null, Uh(e);
                break;
              }
              e = function() {
                It !== 2 && It !== 9 || te !== t || (It = 7), rl(t);
              }, u.then(e, e);
              break t;
            case 3:
              It = 7;
              break t;
            case 4:
              It = 5;
              break t;
            case 7:
              Ud(u) ? (It = 0, bn = null, Uh(e)) : (It = 0, bn = null, Qu(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (Bt.tag) {
                case 26:
                  c = Bt.memoizedState;
                case 5:
                case 27:
                  var f = Bt;
                  if (c ? Am(c) : f.stateNode.complete) {
                    It = 0, bn = null;
                    var v = f.sibling;
                    if (v !== null) Bt = v;
                    else {
                      var O = f.return;
                      O !== null ? (Bt = O, vr(O)) : Bt = null;
                    }
                    break e;
                  }
              }
              It = 0, bn = null, Qu(t, e, u, 5);
              break;
            case 6:
              It = 0, bn = null, Qu(t, e, u, 6);
              break;
            case 8:
              Ts(), he = 6;
              break t;
            default:
              throw Error(o(462));
          }
        }
        Ug();
        break;
      } catch (M) {
        zh(t, M);
      }
    while (!0);
    return Cl = Va = null, ct.H = l, ct.A = a, Zt = n, Bt !== null ? 0 : (te = null, Vt = 0, Ec(), he);
  }
  function Ug() {
    for (; Bt !== null && !iu(); )
      wh(Bt);
  }
  function wh(t) {
    var e = I0(t.alternate, t, Dl);
    t.memoizedProps = t.pendingProps, e === null ? vr(t) : Bt = e;
  }
  function Uh(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Y0(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Vt
        );
        break;
      case 11:
        e = Y0(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Vt
        );
        break;
      case 5:
        xo(e);
        var l = e;
        l === ze && (Ut ? (Nc(l), l.tag === 5 && l.stateNode != null && (ne = l.stateNode)) : (Nc(l), Ut = !0));
      default:
        W0(n, e), e = Bt = Td(e, Dl), e = I0(n, e, Dl);
    }
    t.memoizedProps = t.pendingProps, e === null ? vr(t) : Bt = e;
  }
  function Qu(t, e, n, l) {
    Cl = Va = null, xo(e), zu = null, Ai = 0;
    var a = e.return;
    try {
      if (Eg(
        t,
        a,
        e,
        n,
        Vt
      )) {
        he = 1, Kc(
          t,
          zn(n, t.current)
        ), Bt = null;
        return;
      }
    } catch (u) {
      if (a !== null) throw Bt = a, u;
      he = 1, Kc(
        t,
        zn(n, t.current)
      ), Bt = null;
      return;
    }
    e.flags & 32768 ? (Ut || l === 1 ? t = !0 : Bu || (Vt & 536870912) !== 0 ? t = !1 : (sa = t = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Le.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Hh(e, t)) : vr(e);
  }
  function vr(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Hh(
          e,
          sa
        );
        return;
      }
      t = e.return;
      var n = Ag(
        e.alternate,
        e,
        Dl
      );
      if (n !== null) {
        Bt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        Bt = e;
        return;
      }
      Bt = e = t;
    } while (e !== null);
    he === 0 && (he = 5);
  }
  function Hh(t, e) {
    do {
      var n = Og(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, Bt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        Bt = t;
        return;
      }
      Bt = t = n;
    } while (t !== null);
    he = 6, Bt = null;
  }
  function jh(t, e, n, l, a, u, c, f, v, O, M, q) {
    t.cancelPendingCommit = null;
    do
      gr();
    while (se !== 0);
    if ((Zt & 6) !== 0) throw Error(o(327));
    if (e !== null) {
      if (e === t.current) throw Error(o(177));
      t === te && (Bt = te = null, Vt = 0), $a = e, In = t, cl = n, _s = a, Ah = l, Hg(
        t,
        e,
        n,
        c,
        f,
        v,
        q
      );
    }
  }
  function Hg(t, e, n, l, a, u, c) {
    var f = e.lanes | e.childLanes;
    if (Es = f, f |= ao, ou(
      t,
      n,
      f,
      l,
      a,
      u
    ), qu = null, (n & 335544064) === n ? (Gu = og(t), l = 10262) : (Gu = null, l = 10256), (e.subtreeFlags & l) !== 0 || (e.flags & l) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Gg(en, function() {
      return Rs(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), er = !1, l = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || l) {
      l = ct.T, ct.T = null, a = w.p, w.p = 2, u = Zt, Zt |= 4;
      try {
        Ng(t, e, n);
      } finally {
        Zt = u, w.p = a, ct.T = l;
      }
    }
    se = 1, er ? Vu = cy(
      c,
      t.containerInfo,
      Gu,
      As,
      Os,
      Bg,
      Ns,
      Rs,
      jg
    ) : (As(), Os(), Ns());
  }
  function jg(t) {
    if (se !== 0) {
      var e = In.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function Bg() {
    se === 3 && (se = 0, bh($a, In), se = 4);
  }
  function As() {
    if (se === 1) {
      se = 0;
      var t = In, e = $a, n = cl, l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        l = ct.T, ct.T = null;
        var a = w.p;
        w.p = 2;
        var u = Zt;
        Zt |= 4;
        try {
          Bi = ar = !1, gh(e, t, n), n = qs;
          var c = hd(t.containerInfo), f = n.focusedElem, v = n.selectionRange;
          if (c !== f && f && f.ownerDocument && dd(
            f.ownerDocument.documentElement,
            f
          )) {
            if (v !== null && Pr(f)) {
              var O = v.start, M = v.end;
              if (M === void 0 && (M = O), "selectionStart" in f)
                f.selectionStart = O, f.selectionEnd = Math.min(
                  M,
                  f.value.length
                );
              else {
                var q = f.ownerDocument || document, C = q && q.defaultView || window;
                if (C.getSelection) {
                  var D = C.getSelection(), $ = f.textContent.length, ot = Math.min(v.start, $), xt = v.end === void 0 ? ot : Math.min(v.end, $);
                  !D.extend && ot > xt && (c = xt, xt = ot, ot = c);
                  var A = fd(
                    f,
                    ot
                  ), p = fd(
                    f,
                    xt
                  );
                  if (A && p && (D.rangeCount !== 1 || D.anchorNode !== A.node || D.anchorOffset !== A.offset || D.focusNode !== p.node || D.focusOffset !== p.offset)) {
                    var z = q.createRange();
                    z.setStart(A.node, A.offset), D.removeAllRanges(), ot > xt ? (D.addRange(z), D.extend(p.node, p.offset)) : (z.setEnd(p.node, p.offset), D.addRange(z));
                  }
                }
              }
            }
            for (q = [], D = f; D = D.parentNode; )
              D.nodeType === 1 && q.push({
                element: D,
                left: D.scrollLeft,
                top: D.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < q.length; f++) {
              var L = q[f];
              L.element.scrollLeft = L.left, L.element.scrollTop = L.top;
            }
          }
          $u = !!Vs, qs = Vs = null;
        } finally {
          Zt = u, w.p = a, ct.T = l;
        }
      }
      t.current = e, se = 2;
    }
  }
  function Os() {
    if (se === 2) {
      se = 0;
      var t = In, e = $a, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = ct.T, ct.T = null;
        var l = w.p;
        w.p = 2;
        var a = Zt;
        Zt |= 4;
        try {
          sh(t, e.alternate, e);
        } finally {
          Zt = a, w.p = l, ct.T = n;
        }
      }
      se = 3;
    }
  }
  function Ns() {
    if (se === 4 || se === 3) {
      se = 0;
      var t = Vu;
      Vu = null, Xr();
      var e = In, n = $a, l = cl, a = Ah, u = (l & 335544064) === l ? 10262 : 10256;
      if ((n.subtreeFlags & u) !== 0 || (n.flags & u) !== 0 ? se = 5 : (se = 0, $a = In = null, Bh(e, e.pendingLanes)), u = e.pendingLanes, u === 0 && (da = null), An(l), n = n.stateNode, Xe && typeof Xe.onCommitFiberRoot == "function")
        try {
          Xe.onCommitFiberRoot(
            ql,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        n = ct.T, u = w.p, w.p = 2, ct.T = null;
        try {
          for (var c = e.onRecoverableError, f = 0; f < a.length; f++) {
            var v = a[f];
            c(v.value, {
              componentStack: v.stack
            });
          }
        } finally {
          ct.T = n, w.p = u;
        }
      }
      if (a = qu, c = Gu, Gu = null, a !== null && (qu = null, c === null && (c = []), t !== null))
        for (v = 0; v < a.length; v++)
          n = (0, a[v])(
            c
          ), n !== void 0 && t.finished.finally(n);
      (cl & 3) !== 0 && gr(), rl(e), u = e.pendingLanes, (l & 261930) !== 0 && (u & 42) !== 0 ? e === dr ? Gi++ : (Gi = 0, dr = e) : (Gi = 0, dr = null), Yi(0);
    }
  }
  function Bh(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, _i(e)));
  }
  function gr() {
    return Vu !== null && (Vu.skipTransition(), Vu = null), As(), Os(), Ns(), Rs();
  }
  function Rs() {
    if (se !== 5) return !1;
    var t = In, e = Es;
    Es = 0;
    var n = An(cl), l = ct.T, a = w.p;
    try {
      w.p = 32 > n ? 32 : n, ct.T = null, n = _s, _s = null;
      var u = In, c = cl;
      if (se = 0, $a = In = null, cl = 0, (Zt & 6) !== 0) throw Error(o(331));
      var f = Zt;
      if (Zt |= 4, _h(u.current), ph(
        u,
        u.current,
        c,
        n
      ), Zt = f, Yi(0, !1), Xe && typeof Xe.onPostCommitFiberRoot == "function")
        try {
          Xe.onPostCommitFiberRoot(ql, u);
        } catch {
        }
      return !0;
    } finally {
      w.p = a, ct.T = l, Bh(t, e);
    }
  }
  function Lh(t, e, n) {
    e = zn(n, e), e = ko(t.stateNode, e, 2), t = aa(t, e, 2), t !== null && (yl(t, 2), rl(t));
  }
  function Ft(t, e, n) {
    if (t.tag === 3)
      Lh(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Lh(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var l = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (da === null || !da.has(l))) {
            t = zn(n, t), n = U0(2), l = aa(e, n, 2), l !== null && (H0(
              n,
              l,
              e,
              t
            ), yl(l, 2), rl(l));
            break;
          }
        }
        e = e.return;
      }
  }
  function zs(t, e, n) {
    var l = t.pingCache;
    if (l === null) {
      l = t.pingCache = new Dg();
      var a = /* @__PURE__ */ new Set();
      l.set(e, a);
    } else
      a = l.get(e), a === void 0 && (a = /* @__PURE__ */ new Set(), l.set(e, a));
    a.has(n) || (ps = !0, a.add(n), t = Lg.bind(null, t, e, n), e.then(t, t));
  }
  function Lg(t, e, n) {
    var l = t.pingCache;
    l !== null && l.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, te === t && (Vt & n) === n && ((he === 4 || he === 3 && (Vt & 62914560) === Vt && 300 > Ke() - or) && (Zt & 2) === 0 ? Xu(t, 0) : rr |= n, Lu === Vt && (Lu = 0)), rl(t);
  }
  function Vh(t, e) {
    e === 0 && (e = Yn()), t = ja(t, e), t !== null && (yl(t, e), rl(t));
  }
  function Vg(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), Vh(t, n);
  }
  function qg(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var l = t.stateNode, a = t.memoizedState;
        a !== null && (n = a.retryLane);
        break;
      case 19:
        l = t.stateNode;
        break;
      case 22:
        l = t.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    l !== null && l.delete(e), Vh(t, n);
  }
  function Gg(t, e) {
    return Oe(t, e);
  }
  var ku = null, Zu = null, Ds = !1, yr = !1, xs = !1, ma = 0;
  function rl(t) {
    t !== Zu && t.next === null && (Zu === null ? ku = Zu = t : Zu = Zu.next = t), yr = !0, Ds || (Ds = !0, Xg());
  }
  function Yi(t, e) {
    if (!xs && yr) {
      xs = !0;
      do
        for (var n = !1, l = ku; l !== null; ) {
          if (t !== 0) {
            var a = l.pendingLanes;
            if (a === 0) var u = 0;
            else {
              var c = l.suspendedLanes, f = l.pingedLanes;
              u = (1 << 31 - Ne(42 | t) + 1) - 1, u &= a & ~(c & ~f), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Xh(l, u));
          } else
            u = Vt, u = qn(
              l,
              l === te ? u : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (u & 3) === 0 || Gn(l, u) || (n = !0, Xh(l, u));
          l = l.next;
        }
      while (n);
      xs = !1;
    }
  }
  function Yg() {
    qh();
  }
  function qh() {
    yr = Ds = !1;
    var t = 0;
    ma !== 0 && ty() && (t = ma);
    for (var e = Ke(), n = null, l = ku; l !== null; ) {
      var a = l.next, u = Gh(l, e);
      u === 0 ? (l.next = null, n === null ? ku = a : n.next = a, a === null && (Zu = n)) : (n = l, (t !== 0 || (u & 3) !== 0) && (yr = !0)), l = a;
    }
    se !== 0 && se !== 5 || Yi(t), ma !== 0 && (ma = 0);
  }
  function Gh(t, e) {
    for (var n = t.suspendedLanes, l = t.pingedLanes, a = t.expirationTimes, u = t.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - Ne(u), f = 1 << c, v = a[c];
      v === -1 ? ((f & n) === 0 || (f & l) !== 0) && (a[c] = ii(f, e)) : v <= e && (t.expiredLanes |= f), u &= ~f;
    }
    if (e = te, n = Vt, n = qn(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), l = t.callbackNode, n === 0 || t === e && (It === 2 || It === 9) || t.cancelPendingCommit !== null)
      return l !== null && l !== null && uu(l), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || Gn(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (l !== null && uu(l), An(n)) {
        case 2:
        case 8:
          n = cu;
          break;
        case 32:
          n = en;
          break;
        case 268435456:
          n = ui;
          break;
        default:
          n = en;
      }
      return l = Yh.bind(null, t), n = Oe(n, l), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return l !== null && l !== null && uu(l), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Yh(t, e) {
    if (se !== 0 && se !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (gr() && t.callbackNode !== n)
      return null;
    var l = Vt;
    return l = qn(
      t,
      t === te ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), l === 0 ? null : (Nh(t, l, e), Gh(t, Ke()), t.callbackNode != null && t.callbackNode === n ? Yh.bind(null, t) : null);
  }
  function Xh(t, e) {
    if (gr()) return null;
    Nh(t, e, !0);
  }
  function Xg() {
    ny(function() {
      (Zt & 6) !== 0 ? Oe(
        Vl,
        Yg
      ) : qh();
    });
  }
  function Ms() {
    if (ma === 0) {
      var t = Ya;
      t === 0 && (t = vl, vl <<= 1, (vl & 261888) === 0 && (vl = 256)), ma = t;
    }
    return ma;
  }
  function Qh(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : He(t);
  }
  function Qg(t, e, n, l, a) {
    if (e === "submit" && n && n.stateNode === a) {
      var u = Qh(
        (a[Ue] || null).action
      ), c = l.submitter;
      c && (e = (e = c[Ue] || null) ? Qh(e.formAction) : c.getAttribute("formAction"), e !== null && (u = e, c = null));
      var f = new yc(
        "action",
        "action",
        null,
        l,
        a
      );
      t.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (ma !== 0) {
                  var v = new FormData(a, c);
                  qo(
                    n,
                    {
                      pending: !0,
                      data: v,
                      method: a.method,
                      action: u
                    },
                    null,
                    v
                  );
                }
              } else
                typeof u == "function" && (f.preventDefault(), v = new FormData(a, c), qo(
                  n,
                  {
                    pending: !0,
                    data: v,
                    method: a.method,
                    action: u
                  },
                  u,
                  v
                ));
            },
            currentTarget: a
          }
        ]
      });
    }
  }
  for (var ws = 0; ws < lo.length; ws++) {
    var Us = lo[ws], kg = Us.toLowerCase(), Zg = Us[0].toUpperCase() + Us.slice(1);
    kn(
      kg,
      "on" + Zg
    );
  }
  kn(gd, "onAnimationEnd"), kn(yd, "onAnimationIteration"), kn(bd, "onAnimationStart"), kn("dblclick", "onDoubleClick"), kn("focusin", "onFocus"), kn("focusout", "onBlur"), kn(eg, "onTransitionRun"), kn(ng, "onTransitionStart"), kn(lg, "onTransitionCancel"), kn(pd, "onTransitionEnd"), $t("onMouseEnter", ["mouseout", "mouseover"]), $t("onMouseLeave", ["mouseout", "mouseover"]), $t("onPointerEnter", ["pointerout", "pointerover"]), $t("onPointerLeave", ["pointerout", "pointerover"]), wt(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), wt(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), wt("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), wt(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), wt(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), wt(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Xi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Kg = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Xi)
  );
  function kh(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var l = t[n], a = l.event;
      l = l.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var c = l.length - 1; 0 <= c; c--) {
            var f = l[c], v = f.instance, O = f.currentTarget;
            if (f = f.listener, v !== u && a.isPropagationStopped())
              break t;
            u = f, a.currentTarget = O;
            try {
              u(a);
            } catch (M) {
              Sc(M);
            }
            a.currentTarget = null, u = v;
          }
        else
          for (c = 0; c < l.length; c++) {
            if (f = l[c], v = f.instance, O = f.currentTarget, f = f.listener, v !== u && a.isPropagationStopped())
              break t;
            u = f, a.currentTarget = O;
            try {
              u(a);
            } catch (M) {
              Sc(M);
            }
            a.currentTarget = null, u = v;
          }
      }
    }
  }
  function Lt(t, e) {
    var n = e[ci];
    n === void 0 && (n = e[ci] = /* @__PURE__ */ new Set());
    var l = t + "__bubble";
    n.has(l) || (Zh(e, t, 2, !1), n.add(l));
  }
  function Hs(t, e, n) {
    var l = 0;
    e && (l |= 4), Zh(
      n,
      t,
      l,
      e
    );
  }
  var br = "_reactListening" + Math.random().toString(36).slice(2);
  function js(t) {
    if (!t[br]) {
      t[br] = !0, Ot.forEach(function(n) {
        n !== "selectionchange" && (Kg.has(n) || Hs(n, !1, t), Hs(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[br] || (e[br] = !0, Hs("selectionchange", !1, e));
    }
  }
  function Zh(t, e, n, l) {
    switch (Hm(e)) {
      case 2:
        var a = Vy;
        break;
      case 8:
        a = qy;
        break;
      default:
        a = nf;
    }
    n = a.bind(
      null,
      e,
      n,
      t
    ), a = void 0, !wa || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (a = !0), l ? a !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: a
    }) : t.addEventListener(e, n, !0) : a !== void 0 ? t.addEventListener(e, n, {
      passive: a
    }) : t.addEventListener(e, n, !1);
  }
  function Bs(t, e, n, l, a) {
    var u = l;
    if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
      t: for (; ; ) {
        if (l === null) return;
        var c = l.tag;
        if (c === 3 || c === 4) {
          var f = l.stateNode.containerInfo;
          if (f === a) break;
          if (c === 4)
            for (c = l.return; c !== null; ) {
              var v = c.tag;
              if ((v === 3 || v === 4) && c.stateNode.containerInfo === a)
                return;
              c = c.return;
            }
          for (; f !== null; ) {
            if (c = Qn(f), c === null) return;
            if (v = c.tag, v === 5 || v === 6 || v === 26 || v === 27) {
              l = u = c;
              continue t;
            }
            f = f.parentNode;
          }
        }
        l = l.return;
      }
    Ma(function() {
      var O = u, M = xa(n), q = [];
      t: {
        var C = Sd.get(t);
        if (C !== void 0) {
          var D = yc, $ = t;
          switch (t) {
            case "keypress":
              if (vc(n) === 0) break t;
            case "keydown":
            case "keyup":
              D = xv;
              break;
            case "focusin":
              $ = "focus", D = Kr;
              break;
            case "focusout":
              $ = "blur", D = Kr;
              break;
            case "beforeblur":
            case "afterblur":
              D = Kr;
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
              D = If;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = pv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = jv;
              break;
            case gd:
            case yd:
            case bd:
              D = _v;
              break;
            case pd:
              D = Lv;
              break;
            case "scroll":
            case "scrollend":
              D = yv;
              break;
            case "wheel":
              D = qv;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = Cv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = Wf;
              break;
            case "submit":
              D = Uv;
              break;
            case "toggle":
            case "beforetoggle":
              D = Yv;
          }
          var ot = (e & 4) !== 0, xt = !ot && (t === "scroll" || t === "scrollend"), A = ot ? C !== null ? C + "Capture" : null : C;
          ot = [];
          for (var p = O, z; p !== null; ) {
            var L = p;
            if (z = L.stateNode, L = L.tag, L !== 5 && L !== 26 && L !== 27 || z === null || A === null || (L = pl(p, A), L != null && ot.push(
              Qi(p, L, z)
            )), xt) break;
            p = p.return;
          }
          0 < ot.length && (C = new D(
            C,
            $,
            null,
            n,
            M
          ), q.push({ event: C, listeners: ot }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (D = t === "mouseover" || t === "pointerover", C = t === "mouseout" || t === "pointerout", D && n !== Da && ($ = n.relatedTarget || n.fromElement) && (Qn($) || $[sn]))
            break t;
          (C || D) && ($ = M.window === M ? M : (D = M.ownerDocument) ? D.defaultView || D.parentWindow : window, C ? (D = n.relatedTarget || n.toElement, C = O, D = D ? Qn(D) : null, D !== null && (xt = m(D), ot = D.tag, D !== xt || ot !== 5 && ot !== 27 && ot !== 6) && (D = null)) : (C = null, D = O), C !== D && (ot = If, L = "onMouseLeave", A = "onMouseEnter", p = "mouse", (t === "pointerout" || t === "pointerover") && (ot = Wf, L = "onPointerLeave", A = "onPointerEnter", p = "pointer"), xt = C == null ? $ : x(C), z = D == null ? $ : x(D), $ = new ot(
            L,
            p + "leave",
            C,
            n,
            M
          ), $.target = xt, $.relatedTarget = z, L = null, Qn(M) === O && (ot = new ot(
            A,
            p + "enter",
            D,
            n,
            M
          ), ot.target = z, ot.relatedTarget = xt, L = ot), xt = L, ot = C && D ? E(
            C,
            D,
            Jg
          ) : null, C !== null && Kh(
            q,
            $,
            C,
            ot,
            !1
          ), D !== null && xt !== null && Kh(
            q,
            xt,
            D,
            ot,
            !0
          )));
        }
        t: {
          if (C = O ? x(O) : window, D = C.nodeName && C.nodeName.toLowerCase(), D === "select" || D === "input" && C.type === "file")
            var it = ud;
          else if (ld(C))
            if (id)
              it = $v;
            else {
              it = Fv;
              var qt = Iv;
            }
          else
            D = C.nodeName, !D || D.toLowerCase() !== "input" || C.type !== "checkbox" && C.type !== "radio" ? O && za(O.elementType) && (it = ud) : it = Wv;
          if (it && (it = it(t, O))) {
            ad(
              q,
              it,
              n,
              M
            );
            break t;
          }
          qt && qt(t, C, O);
        }
        switch (qt = O ? x(O) : window, t) {
          case "focusin":
            (ld(qt) || qt.contentEditable === "true") && (Su = qt, to = O, pi = null);
            break;
          case "focusout":
            pi = to = Su = null;
            break;
          case "mousedown":
            eo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            eo = !1, md(q, n, M);
            break;
          case "selectionchange":
            if (tg) break;
          case "keydown":
          case "keyup":
            md(q, n, M);
        }
        var ht;
        if (Ir)
          t: {
            switch (t) {
              case "compositionstart":
                var St = "onCompositionStart";
                break t;
              case "compositionend":
                St = "onCompositionEnd";
                break t;
              case "compositionupdate":
                St = "onCompositionUpdate";
                break t;
            }
            St = void 0;
          }
        else
          pu ? ed(t, n) && (St = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (St = "onCompositionStart");
        St && ($f && n.locale !== "ko" && (pu || St !== "onCompositionStart" ? St === "onCompositionEnd" && pu && (ht = Kf()) : (Il = M, Qr = "value" in Il ? Il.value : Il.textContent, pu = !0)), qt = pr(O, St), 0 < qt.length && (St = new Ff(
          St,
          t,
          null,
          n,
          M
        ), q.push({ event: St, listeners: qt }), ht ? St.data = ht : (ht = nd(n), ht !== null && (St.data = ht)))), (ht = Qv ? kv(t, n) : Zv(t, n)) && (St = pr(O, "onBeforeInput"), 0 < St.length && (qt = new Ff(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          M
        ), q.push({
          event: qt,
          listeners: St
        }), qt.data = ht)), Qg(
          q,
          t,
          O,
          n,
          M
        );
      }
      kh(q, e);
    });
  }
  function Qi(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function pr(t, e) {
    for (var n = e + "Capture", l = []; t !== null; ) {
      var a = t, u = a.stateNode;
      if (a = a.tag, a !== 5 && a !== 26 && a !== 27 || u === null || (a = pl(t, n), a != null && l.unshift(
        Qi(t, a, u)
      ), a = pl(t, e), a != null && l.push(
        Qi(t, a, u)
      )), t.tag === 3) return l;
      t = t.return;
    }
    return [];
  }
  function Jg(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Kh(t, e, n, l, a) {
    for (var u = e._reactName, c = []; n !== null && n !== l; ) {
      var f = n, v = f.alternate, O = f.stateNode;
      if (f = f.tag, v !== null && v === l) break;
      f !== 5 && f !== 26 && f !== 27 || O === null || (v = O, a ? (O = pl(n, u), O != null && c.unshift(
        Qi(n, O, v)
      )) : a || (O = pl(n, u), O != null && c.push(
        Qi(n, O, v)
      ))), n = n.return;
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Ig = /\r\n?/g, Fg = /\u0000|\uFFFD/g;
  function Jh(t) {
    return (typeof t == "string" ? t : "" + t).replace(Ig, `
`).replace(Fg, "");
  }
  function Ih(t, e) {
    return e = Jh(e), Jh(t) === e;
  }
  function Wt(t, e, n, l, a, u) {
    switch (n) {
      case "children":
        if (typeof l == "string")
          e === "body" || e === "textarea" && l === "" || Je(t, l);
        else if (typeof l == "number" || typeof l == "bigint")
          e !== "body" && Je(t, "" + l);
        else return;
        break;
      case "className":
        fn(t, "class", l);
        break;
      case "tabIndex":
        fn(t, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        fn(t, n, l);
        break;
      case "style":
        hn(t, l, u);
        return;
      case "data":
        if (e !== "object") {
          fn(t, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(n);
          break;
        }
        l = He(l), t.setAttribute(n, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (e !== "input" && Wt(t, e, "name", a.name, a, null), Wt(
            t,
            e,
            "formEncType",
            a.formEncType,
            a,
            null
          ), Wt(
            t,
            e,
            "formMethod",
            a.formMethod,
            a,
            null
          ), Wt(
            t,
            e,
            "formTarget",
            a.formTarget,
            a,
            null
          )) : (Wt(t, e, "encType", a.encType, a, null), Wt(t, e, "method", a.method, a, null), Wt(t, e, "target", a.target, a, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(n);
          break;
        }
        l = He(l), t.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (t.onclick = Ie);
        return;
      case "onScroll":
        l != null && Lt("scroll", t);
        return;
      case "onScrollEnd":
        l != null && Lt("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (n = l.__html, n != null) {
            if (a.children != null) throw Error(o(60));
            u?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "multiple":
        t.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        t.muted = l && typeof l != "function" && typeof l != "symbol";
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
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = He(l), t.setAttributeNS(
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
        l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, l) : t.removeAttribute(n);
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
        l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0 ? t.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, l) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? t.setAttribute(n, l) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? t.removeAttribute(n) : t.setAttribute(n, l);
        break;
      case "popover":
        Lt("beforetoggle", t), Lt("toggle", t), oe(t, "popover", l);
        break;
      case "xlinkActuate":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        be(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        be(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        be(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        be(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        oe(t, "is", l);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = si.get(n) || n, oe(t, n, l);
        else return;
    }
    yt = !0;
  }
  function Ls(t, e, n, l, a, u) {
    switch (n) {
      case "style":
        hn(t, l, u);
        return;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (n = l.__html, n != null) {
            if (a.children != null) throw Error(o(60));
            u?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof l == "string") Je(t, l);
        else if (typeof l == "number" || typeof l == "bigint")
          Je(t, "" + l);
        else return;
        break;
      case "onScroll":
        l != null && Lt("scroll", t);
        return;
      case "onScrollEnd":
        l != null && Lt("scrollend", t);
        return;
      case "onClick":
        l != null && (t.onclick = Ie);
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
        if (!Tt.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), u = n.slice(2, a ? n.length - 7 : void 0), e = t[Ue] || null, e = e != null ? e[n] : null, typeof e == "function" && t.removeEventListener(u, e, a), typeof l == "function")) {
              typeof e != "function" && e !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(u, l, a);
              break t;
            }
            yt = !0, n in t ? t[n] = l : l === !0 ? t.setAttribute(n, "") : oe(t, n, l);
          }
        return;
    }
    yt = !0;
  }
  function Ge(t, e, n) {
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
        Lt("error", t), Lt("load", t);
        var l = !1, a = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var c = n[u];
            if (c != null)
              switch (u) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  a = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, e));
                default:
                  Wt(t, e, u, c, n, null);
              }
          }
        a && Wt(t, e, "srcSet", n.srcSet, n, null), l && Wt(t, e, "src", n.src, n, null);
        return;
      case "input":
        Lt("invalid", t);
        var f = u = c = a = null, v = null, O = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var M = n[l];
            if (M != null)
              switch (l) {
                case "name":
                  a = M;
                  break;
                case "type":
                  c = M;
                  break;
                case "checked":
                  v = M;
                  break;
                case "defaultChecked":
                  O = M;
                  break;
                case "value":
                  u = M;
                  break;
                case "defaultValue":
                  f = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(o(137, e));
                  break;
                default:
                  Wt(t, e, l, M, n, null);
              }
          }
        Kl(
          t,
          u,
          f,
          v,
          O,
          c,
          a,
          !1
        );
        return;
      case "select":
        Lt("invalid", t), l = c = u = null;
        for (a in n)
          if (n.hasOwnProperty(a) && (f = n[a], f != null))
            switch (a) {
              case "value":
                u = f;
                break;
              case "defaultValue":
                c = f;
                break;
              case "multiple":
                l = f;
              default:
                Wt(t, e, a, f, n, null);
            }
        e = u, n = c, t.multiple = !!l, e != null ? nn(t, !!l, e, !1) : n != null && nn(t, !!l, n, !0);
        return;
      case "textarea":
        Lt("invalid", t), u = a = l = null;
        for (c in n)
          if (n.hasOwnProperty(c) && (f = n[c], f != null))
            switch (c) {
              case "value":
                l = f;
                break;
              case "defaultValue":
                a = f;
                break;
              case "children":
                u = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(o(91));
                break;
              default:
                Wt(t, e, c, f, n, null);
            }
        dn(t, l, a, u);
        return;
      case "option":
        for (v in n)
          n.hasOwnProperty(v) && (l = n[v], l != null) && (v === "selected" ? t.selected = l && typeof l != "function" && typeof l != "symbol" : Wt(t, e, v, l, n, null));
        return;
      case "dialog":
        Lt("beforetoggle", t), Lt("toggle", t), Lt("cancel", t), Lt("close", t);
        break;
      case "iframe":
      case "object":
        Lt("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Xi.length; l++)
          Lt(Xi[l], t);
        break;
      case "image":
        Lt("error", t), Lt("load", t);
        break;
      case "details":
        Lt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        Lt("error", t), Lt("load", t);
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
        for (O in n)
          if (n.hasOwnProperty(O) && (l = n[O], l != null))
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, e));
              default:
                Wt(t, e, O, l, n, null);
            }
        return;
      default:
        if (za(e)) {
          for (M in n)
            n.hasOwnProperty(M) && (l = n[M], l !== void 0 && Ls(
              t,
              e,
              M,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (f in n)
      n.hasOwnProperty(f) && (l = n[f], l != null && Wt(t, e, f, l, n, null));
  }
  var Wg = {};
  function $g(t, e, n, l) {
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
        var a = null, u = null, c = null, f = null, v = null, O = null, M = null;
        for (D in n) {
          var q = n[D];
          if (n.hasOwnProperty(D) && q != null)
            switch (D) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                v = q;
              default:
                l.hasOwnProperty(D) || Wt(t, e, D, null, l, q);
            }
        }
        for (var C in l) {
          var D = l[C];
          if (q = n[C], l.hasOwnProperty(C) && (D != null || q != null))
            switch (C) {
              case "type":
                D !== q && (yt = !0), u = D;
                break;
              case "name":
                D !== q && (yt = !0), a = D;
                break;
              case "checked":
                D !== q && (yt = !0), O = D;
                break;
              case "defaultChecked":
                D !== q && (yt = !0), M = D;
                break;
              case "value":
                D !== q && (yt = !0), c = D;
                break;
              case "defaultValue":
                D !== q && (yt = !0), f = D;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(o(137, e));
                break;
              default:
                D !== q && Wt(
                  t,
                  e,
                  C,
                  D,
                  l,
                  q
                );
            }
        }
        Qe(
          t,
          c,
          f,
          v,
          O,
          M,
          u,
          a
        );
        return;
      case "select":
        D = c = f = C = null;
        for (u in n)
          if (v = n[u], n.hasOwnProperty(u) && v != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                D = v;
              default:
                l.hasOwnProperty(u) || Wt(
                  t,
                  e,
                  u,
                  null,
                  l,
                  v
                );
            }
        for (a in l)
          if (u = l[a], v = n[a], l.hasOwnProperty(a) && (u != null || v != null))
            switch (a) {
              case "value":
                u !== v && (yt = !0), C = u;
                break;
              case "defaultValue":
                u !== v && (yt = !0), f = u;
                break;
              case "multiple":
                u !== v && (yt = !0), c = u;
              default:
                u !== v && Wt(
                  t,
                  e,
                  a,
                  u,
                  l,
                  v
                );
            }
        e = f, n = c, l = D, C != null ? nn(t, !!n, C, !1) : !!l != !!n && (e != null ? nn(t, !!n, e, !0) : nn(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        D = C = null;
        for (f in n)
          if (a = n[f], n.hasOwnProperty(f) && a != null && !l.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                Wt(t, e, f, null, l, a);
            }
        for (c in l)
          if (a = l[c], u = n[c], l.hasOwnProperty(c) && (a != null || u != null))
            switch (c) {
              case "value":
                a !== u && (yt = !0), C = a;
                break;
              case "defaultValue":
                a !== u && (yt = !0), D = a;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (a != null) throw Error(o(91));
                break;
              default:
                a !== u && Wt(t, e, c, a, l, u);
            }
        bu(t, C, D);
        return;
      case "option":
        for (var $ in n)
          C = n[$], n.hasOwnProperty($) && C != null && !l.hasOwnProperty($) && ($ === "selected" ? t.selected = !1 : Wt(
            t,
            e,
            $,
            null,
            l,
            C
          ));
        for (v in l)
          C = l[v], D = n[v], l.hasOwnProperty(v) && C !== D && (C != null || D != null) && (v === "selected" ? (C !== D && (yt = !0), t.selected = C && typeof C != "function" && typeof C != "symbol") : Wt(
            t,
            e,
            v,
            C,
            l,
            D
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
        for (var ot in n)
          C = n[ot], n.hasOwnProperty(ot) && C != null && !l.hasOwnProperty(ot) && Wt(t, e, ot, null, l, C);
        for (O in l)
          if (C = l[O], D = n[O], l.hasOwnProperty(O) && C !== D && (C != null || D != null))
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (C != null)
                  throw Error(o(137, e));
                break;
              default:
                Wt(
                  t,
                  e,
                  O,
                  C,
                  l,
                  D
                );
            }
        return;
      default:
        if (za(e)) {
          for (var xt in n)
            C = n[xt], n.hasOwnProperty(xt) && C !== void 0 && !l.hasOwnProperty(xt) && Ls(
              t,
              e,
              xt,
              void 0,
              l,
              C
            );
          for (M in l)
            C = l[M], D = n[M], !l.hasOwnProperty(M) || C === D || C === void 0 && D === void 0 || Ls(
              t,
              e,
              M,
              C,
              l,
              D
            );
          return;
        }
    }
    for (var A in n)
      C = n[A], n.hasOwnProperty(A) && C != null && !l.hasOwnProperty(A) && Wt(t, e, A, null, l, C);
    for (q in l)
      C = l[q], D = n[q], !l.hasOwnProperty(q) || C === D || C == null && D == null || Wt(t, e, q, C, l, D);
  }
  function Fh(t) {
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
  function Pg() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var a = n[l], u = a.transferSize, c = a.initiatorType, f = a.duration;
        if (u && f && Fh(c)) {
          for (c = 0, f = a.responseEnd, l += 1; l < n.length; l++) {
            var v = n[l], O = v.startTime;
            if (O > f) break;
            var M = v.transferSize, q = v.initiatorType;
            M && Fh(q) && (v = v.responseEnd, c += M * (v < f ? 1 : (f - O) / (v - O)));
          }
          if (--l, e += 8 * (u + c) / (a.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Vs = null, qs = null;
  function ki(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Wh(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function $h(t, e) {
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
  function Ph(t, e, n, l) {
    return n = ki(
      n
    ).createElement(t), n[re] = l, n[Ue] = e, Ge(n, t, e), J(n), n;
  }
  function Gs(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Ys = null;
  function ty() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Ys ? !1 : (Ys = t, !0) : (Ys = null, !1);
  }
  var Xs = typeof setTimeout == "function" ? setTimeout : void 0, ey = typeof clearTimeout == "function" ? clearTimeout : void 0, tm = typeof Promise == "function" ? Promise : void 0, em = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Xs, ny = typeof queueMicrotask == "function" ? queueMicrotask : typeof tm < "u" ? function(t) {
    return tm.resolve(null).then(t).catch(ly);
  } : Xs;
  function ly(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function va(t) {
    return t === "head";
  }
  function nm(t, e) {
    var n = e, l = 0;
    do {
      var a = n.nextSibling;
      if (t.removeChild(n), a && a.nodeType === 8)
        if (n = a.data, n === "/$" || n === "/&") {
          if (l === 0) {
            t.removeChild(a), Pu(e);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          Ws(
            t.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = t.ownerDocument.head, Ws(n);
          for (var u = n.firstChild; u; ) {
            var c = u.nextSibling, f = u.nodeName;
            u[Na] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = c;
          }
        } else
          n === "body" && Ws(t.ownerDocument.body);
      n = a;
    } while (n);
    Pu(e);
  }
  function lm(t, e) {
    var n = t;
    t = 0;
    do {
      var l = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), l && l.nodeType === 8)
        if (n = l.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = l;
    } while (n);
  }
  function am(t, e, n) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, n != null && (t.style.viewTransitionClass = n), n = getComputedStyle(t), n.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var l = 1;
      else
        for (var a = l = 0; a < e.length; a++) {
          var u = e[a];
          0 < u.width && 0 < u.height && l++;
        }
      l === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + n.paddingTop, t.marginBottom = "-" + n.paddingBottom);
    }
  }
  function um(t, e) {
    t = t.style, e = e.style;
    var n = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (n = e.display, t.display = n == null || typeof n == "boolean" ? "" : n, n = e.margin, n != null ? t.margin = n : (n = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = n == null || typeof n == "boolean" ? "" : n, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function ay(t, e, n) {
    return n = n.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= n.innerHeight && t.left <= n.innerWidth
    };
  }
  function Qs(t) {
    var e = t.getBoundingClientRect(), n = getComputedStyle(t);
    return ay(e, n, t);
  }
  function uy(t) {
    return t.documentElement.clientHeight;
  }
  function iy(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function cy(t, e, n, l, a, u, c, f, v) {
    var O = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var M = O.startViewTransition({
        update: function() {
          var C = O.defaultView, D = C.navigation && C.navigation.transition, $ = O.fonts.status;
          l();
          var ot = [];
          if ($ === "loaded" && (uy(O), O.fonts.status === "loading" && ot.push(O.fonts.ready)), $ = ot.length, t !== null)
            for (var xt = t.suspenseyImages, A = 0, p = 0; p < xt.length; p++) {
              var z = xt[p];
              if (!z.complete) {
                var L = z.getBoundingClientRect();
                if (0 < L.bottom && 0 < L.right && L.top < C.innerHeight && L.left < C.innerWidth) {
                  if (A += Om(z), A > _r) {
                    ot.length = $;
                    break;
                  }
                  z = new Promise(
                    iy.bind(z)
                  ), ot.push(z);
                }
              }
            }
          if (0 < ot.length)
            return C = Promise.race([
              Promise.all(ot),
              new Promise(function(it) {
                return setTimeout(it, 500);
              })
            ]).then(a, a), (D ? Promise.allSettled([D.finished, C]) : C).then(u, u);
          if (a(), D)
            return D.finished.then(
              u,
              u
            );
          u();
        },
        types: n
      });
      O.__reactViewTransition = M;
      var q = [];
      return M.ready.then(
        function() {
          for (var C = O.documentElement.getAnimations({
            subtree: !0
          }), D = 0; D < C.length; D++) {
            var $ = C[D], ot = $.effect, xt = ot.pseudoElement;
            if (xt != null && xt.startsWith("::view-transition")) {
              q.push($), $ = ot.getKeyframes();
              for (var A = xt = void 0, p = !0, z = 0; z < $.length; z++) {
                var L = $[z], it = L.width;
                if (xt === void 0) xt = it;
                else if (xt !== it) {
                  p = !1;
                  break;
                }
                if (it = L.height, A === void 0) A = it;
                else if (A !== it) {
                  p = !1;
                  break;
                }
                delete L.width, delete L.height, L.transform === "none" && delete L.transform;
              }
              p && xt !== void 0 && A !== void 0 && (ot.setKeyframes($), p = getComputedStyle(
                ot.target,
                ot.pseudoElement
              ), p.width !== xt || p.height !== A) && (p = $[0], p.width = xt, p.height = A, p = $[$.length - 1], p.width = xt, p.height = A, ot.setKeyframes($));
            }
          }
          c();
        },
        function(C) {
          O.__reactViewTransition === M && (O.__reactViewTransition = null);
          try {
            typeof C == "object" && C !== null && C.name === "InvalidStateError" && (C.message === "View transition was skipped because document visibility state is hidden." || C.message === "Skipping view transition because document visibility state has become hidden." || C.message === "Skipping view transition because viewport size changed." || C.message === "Transition was aborted because of invalid state") && (C = null), C !== null && v(C);
          } finally {
            l(), a(), c();
          }
        }
      ), M.finished.finally(function() {
        for (var C = 0; C < q.length; C++)
          q[C].cancel();
        O.__reactViewTransition === M && (O.__reactViewTransition = null), f();
      }), M;
    } catch {
      return l(), a(), c(), null;
    }
  }
  function Pa(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  Pa.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : S({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, Pa.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, n = t.getAnimations({ subtree: !0 }), l = [], a = 0; a < n.length; a++) {
      var u = n[a].effect;
      u !== null && u.target === t && u.pseudoElement === e && l.push(n[a]);
    }
    return l;
  }, Pa.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function im(t) {
    return {
      name: t,
      group: new Pa("group", t),
      imagePair: new Pa("image-pair", t),
      old: new Pa("old", t),
      new: new Pa("new", t)
    };
  }
  function En(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  En.prototype.addEventListener = function(t, e, n) {
    var l = null, a = null;
    if (!(n != null && typeof n != "boolean" && (l = n.signal || null, l !== null && l.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var u = this._eventListeners;
      if (rm(u, t, e, n) === -1) {
        var c = this, f = e;
        n != null && typeof n != "boolean" && n.once === !0 && (f = function(v) {
          c.removeEventListener(
            t,
            e,
            n
          ), typeof e == "function" ? e.call(this, v) : e.handleEvent(v);
        }), l !== null && (a = c.removeEventListener.bind(
          c,
          t,
          e,
          n
        ), l.addEventListener("abort", a, { once: !0 }), a = l.removeEventListener.bind(l, "abort", a)), l = Ku(n), u.push({
          type: t,
          listener: e,
          optionsOrUseCapture: n,
          attachedListener: f,
          cleanup: a
        }), g(
          this._fragmentFiber.child,
          !1,
          ry,
          t,
          f,
          l
        );
      }
      this._eventListeners = u;
    }
  };
  function ry(t, e, n, l) {
    return Y(t).addEventListener(
      e,
      n,
      l
    ), !1;
  }
  En.prototype.removeEventListener = function(t, e, n) {
    var l = this._eventListeners;
    if (l !== null && (e = rm(
      l,
      t,
      e,
      n
    ), e !== -1)) {
      var a = l[e];
      n = a.attachedListener;
      var u = a.cleanup;
      a = Ku(a.optionsOrUseCapture), g(
        this._fragmentFiber.child,
        !1,
        oy,
        t,
        n,
        a
      ), l.splice(e, 1), u !== null && u();
    }
  };
  function oy(t, e, n, l) {
    return Y(t).removeEventListener(
      e,
      n,
      l
    ), !1;
  }
  function Ku(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function cm(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function rm(t, e, n, l) {
    if (t.length === 0) return -1;
    l = cm(l);
    for (var a = 0; a < t.length; a++) {
      var u = t[a];
      if (u.type === e && u.listener === n && cm(u.optionsOrUseCapture) === l)
        return a;
    }
    return -1;
  }
  En.prototype.dispatchEvent = function(t) {
    var e = N(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = Y(e);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !t.bubbles) {
      var l = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (n)
        for (var a = 0; a < n.length; a++) {
          var u = n[a];
          l.addEventListener(
            u.type,
            u.attachedListener,
            Ku(u.optionsOrUseCapture)
          );
        }
      if (e.appendChild(l), t = l.dispatchEvent(t), n)
        for (a = 0; a < n.length; a++)
          u = n[a], l.removeEventListener(
            u.type,
            u.attachedListener,
            Ku(u.optionsOrUseCapture)
          );
      return e.removeChild(l), t;
    }
    return e.dispatchEvent(t);
  }, En.prototype.focus = function(t) {
    g(
      this._fragmentFiber.child,
      !0,
      om,
      t,
      void 0,
      void 0
    );
  };
  function om(t, e) {
    return t.tag === 6 ? !1 : (t = Y(t), Ey(t, e));
  }
  En.prototype.focusLast = function(t) {
    var e = [];
    g(
      this._fragmentFiber.child,
      !0,
      ks,
      e,
      void 0,
      void 0
    );
    for (var n = e.length - 1; 0 <= n && !om(e[n], t); n--) ;
  };
  function ks(t, e) {
    return e.push(t), !1;
  }
  En.prototype.blur = function() {
    var t = N(
      this._fragmentFiber
    );
    t !== null && (t = Y(t), t = ki(t).activeElement, t !== null && g(
      this._fragmentFiber.child,
      !1,
      sy,
      t,
      void 0,
      void 0
    ));
  };
  function sy(t, e) {
    return t.tag === 6 ? !1 : (t = Y(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  En.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), g(
      this._fragmentFiber.child,
      !1,
      fy,
      t,
      void 0,
      void 0
    );
  };
  function fy(t, e) {
    return t.tag === 6 || (t = Y(t), e.observe(t)), !1;
  }
  En.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), g(
        this._fragmentFiber.child,
        !1,
        dy,
        t,
        void 0,
        void 0
      );
      for (var n = e = 0; n < Fn.length; n++) {
        var l = Fn[n];
        l.fragmentInstance === this && l.observer === t ? t.unobserve(l.instance) : Fn[e++] = l;
      }
      Fn.length = e;
    }
  };
  function dy(t, e) {
    return t.tag === 6 || (t = Y(t), e.unobserve(t)), !1;
  }
  var Fn = [], Zs = !1;
  function hy(t, e, n) {
    Fn.push({
      fragmentInstance: t,
      observer: e,
      instance: n
    }), Zs || (Zs = !0, _y(function() {
      Zs = !1;
      var l = Fn;
      Fn = [];
      for (var a = 0; a < l.length; a++) {
        var u = l[a];
        u.observer.unobserve(u.instance);
      }
    }));
  }
  En.prototype.getClientRects = function() {
    var t = [];
    return g(
      this._fragmentFiber.child,
      !1,
      my,
      t,
      void 0,
      void 0
    ), t;
  };
  function my(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var n = t.ownerDocument.createRange();
      n.selectNodeContents(t), e.push.apply(e, n.getClientRects());
    } else
      t = Y(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  En.prototype.getRootNode = function(t) {
    var e = N(
      this._fragmentFiber
    );
    return e === null ? this : Y(e).getRootNode(t);
  }, En.prototype.compareDocumentPosition = function(t) {
    var e = N(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    g(
      this._fragmentFiber.child,
      !1,
      ks,
      n,
      void 0,
      void 0
    );
    var l = Y(e);
    if (n.length === 0) {
      if (n = l, F(this._fragmentFiber)) {
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
      var a = l = n.compareDocumentPosition(t);
      return n === t ? a = Node.DOCUMENT_POSITION_CONTAINS : l & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = X(e)[1], n === null ? a = Node.DOCUMENT_POSITION_PRECEDING : (t = Y(n).compareDocumentPosition(
        t
      ), a = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), a |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = Y(n[0]), a = Y(n[n.length - 1]);
    var u = F(this._fragmentFiber) ? e.parentElement : l;
    if (u == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    l = u.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, u = u.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var c = e.compareDocumentPosition(t), f = a.compareDocumentPosition(t), v = c & Node.DOCUMENT_POSITION_CONTAINED_BY || f & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return f = l && u && c & Node.DOCUMENT_POSITION_FOLLOWING && f & Node.DOCUMENT_POSITION_PRECEDING, e = l && e === t || u && a === t || v || f ? Node.DOCUMENT_POSITION_CONTAINED_BY : !l && e === t || !u && a === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : c, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || vy(
      e,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function vy(t, e, n, l, a) {
    var u = Qn(a);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!u)
        t: {
          for (; u !== null; ) {
            if (u.tag === 7 && (u === e || u.alternate === e)) {
              n = !0;
              break t;
            }
            u = u.return;
          }
          n = !1;
        }
      return n;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (u === null)
        return u = a.ownerDocument, a === u || a === u.documentElement || a === u.body;
      t: {
        for (u = e, e = N(e); u !== null; ) {
          if (!(u.tag !== 5 && u.tag !== 3 && u.tag !== 27 || u !== e && u.alternate !== e)) {
            u = !0;
            break t;
          }
          u = u.return;
        }
        u = !1;
      }
      return u;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!u) && !(e = u === n) && (e = E(
      n,
      u,
      h
    ), e === null ? e = !1 : (g(
      e,
      !0,
      nt,
      u,
      n
    ), u = Q, Q = null, e = u !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!u) && !(e = u === l) && (e = E(
      l,
      u,
      h
    ), e === null ? e = !1 : (g(
      e,
      !0,
      G,
      u,
      l
    ), u = Q, W = Q = null, e = u !== null)), e) : !1;
  }
  function sm(t, e) {
    var n = t.ownerDocument.createRange();
    n.selectNodeContents(t), t = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  En.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(o(566));
    var e = [];
    g(
      this._fragmentFiber.child,
      !1,
      ks,
      e,
      void 0,
      void 0
    );
    var n = t !== !1;
    if (e.length === 0) {
      var l = X(
        this._fragmentFiber
      );
      if (l = n ? l[1] || l[0] || N(this._fragmentFiber) : l[0] || l[1], l === null) return;
      if (l.tag === 6) {
        t = Y(l), sm(t, n);
        return;
      }
      if (l = Y(l), l.nodeType !== 9) {
        if (l.nodeType === 11) {
          n = "host" in l ? l.host : null, n !== null && n.scrollIntoView(t);
          return;
        }
        l.scrollIntoView(t);
      }
    }
    for (l = n ? e.length - 1 : 0; l !== (n ? -1 : e.length); ) {
      var a = e[l];
      a.tag === 6 ? (a = Y(a), sm(a, n)) : Y(a).scrollIntoView(t), l += n ? -1 : 1;
    }
  };
  function gy(t, e) {
    return t = Y(t), fm(t, e), !1;
  }
  function fm(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function dm(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var a = n[l];
        t.addEventListener(
          a.type,
          a.attachedListener,
          Ku(a.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(u) {
      for (var c = 0, f = 0; f < Fn.length; f++) {
        var v = Fn[f];
        (v.fragmentInstance !== e || v.observer !== u || v.instance !== t) && (Fn[c++] = v);
      }
      Fn.length = c, u.observe(t);
    }), fm(t, e));
  }
  function yy(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var a = n[l];
        t.removeEventListener(
          a.type,
          a.attachedListener,
          Ku(a.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(u) {
      typeof u.rootMargin == "string" ? hy(
        e,
        u,
        t
      ) : u.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Ks(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ks(n), mu(n);
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
  function by(t, e, n, l) {
    for (; t.nodeType === 1; ) {
      var a = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (l) {
        if (!t[Na])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (u = t.getAttribute("rel"), u === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (u !== a.rel || t.getAttribute("href") !== (a.href == null || a.href === "" ? null : a.href) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin) || t.getAttribute("title") !== (a.title == null ? null : a.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (u = t.getAttribute("src"), (u !== (a.src == null ? null : a.src) || t.getAttribute("type") !== (a.type == null ? null : a.type) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin)) && u && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var u = a.name == null ? null : "" + a.name;
        if (a.type === "hidden" && t.getAttribute("name") === u)
          return t;
      } else return t;
      if (t = Un(t.nextSibling), t === null) break;
    }
    return null;
  }
  function py(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = Un(t.nextSibling), t === null)) return null;
    return t;
  }
  function hm(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = Un(t.nextSibling), t === null)) return null;
    return t;
  }
  function Js(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Is(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function Sy(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var l = function() {
        e(), n.removeEventListener("DOMContentLoaded", l);
      };
      n.addEventListener("DOMContentLoaded", l), t._reactRetry = l;
    }
  }
  function Un(t) {
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
  var Fs = null;
  function mm(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return Un(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function vm(t) {
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
  function Ey(t, e) {
    function n() {
      l = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var l = !1;
    try {
      t.ownerDocument.addEventListener("focus", n, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", n, !0);
    }
    return l;
  }
  function _y(t) {
    em(function() {
      em(function(e) {
        return t(e);
      });
    });
  }
  function gm(t, e, n) {
    switch (e = ki(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(o(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(o(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(o(454));
        return t;
      default:
        throw Error(o(451));
    }
  }
  function ym(t, e, n) {
    for (var l in n) {
      var a = n[l];
      n.hasOwnProperty(l) && a != null && Wt(t, e, l, null, Wg, a);
    }
    n.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === Ie && (t.onclick = null), mu(t);
  }
  function Ws(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    mu(t);
  }
  var Hn = /* @__PURE__ */ new Map(), bm = /* @__PURE__ */ new Set();
  function Zi(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var xl = w.d;
  w.d = {
    f: Ty,
    r: Cy,
    D: Ay,
    C: Oy,
    L: Ny,
    m: Ry,
    X: Dy,
    S: zy,
    M: xy
  };
  function Ty() {
    var t = xl.f(), e = hr();
    return t || e;
  }
  function Cy(t) {
    var e = Ra(t);
    e !== null && e.tag === 5 && e.type === "form" ? S0(e) : xl.r(t);
  }
  var Ju = typeof document > "u" ? null : document;
  function pm(t, e, n) {
    var l = Ju;
    if (l && typeof e == "string" && e) {
      var a = ue(e);
      a = 'link[rel="' + t + '"][href="' + a + '"]', typeof n == "string" && (a += '[crossorigin="' + n + '"]'), bm.has(a) || (bm.add(a), t = { rel: t, crossOrigin: n, href: e }, l.querySelector(a) === null && (e = l.createElement("link"), Ge(e, "link", t), J(e), l.head.appendChild(e)));
    }
  }
  function Ay(t) {
    xl.D(t), pm("dns-prefetch", t, null);
  }
  function Oy(t, e) {
    xl.C(t, e), pm("preconnect", t, e);
  }
  function Ny(t, e, n) {
    xl.L(t, e, n);
    var l = Ju;
    if (l && t && e) {
      var a = 'link[rel="preload"][as="' + ue(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (a += '[imagesrcset="' + ue(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (a += '[imagesizes="' + ue(
        n.imageSizes
      ) + '"]')) : a += '[href="' + ue(t) + '"]';
      var u = a;
      switch (e) {
        case "style":
          u = Iu(t);
          break;
        case "script":
          u = Fu(t);
      }
      if (!(Hn.has(u) || (t = S(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), Hn.set(u, t), l.querySelector(a) !== null || e === "style" && l.querySelector(Ki(u)) || e === "script" && l.querySelector(Ji(u))))) {
        var c = l.createElement("link");
        Ge(c, "link", t), e === "style" && (c[hu] = !0, c.onload = c.onerror = function() {
          dt(c);
        }), J(c), l.head.appendChild(c);
      }
    }
  }
  function Ry(t, e) {
    xl.m(t, e);
    var n = Ju;
    if (n && t) {
      var l = e && typeof e.as == "string" ? e.as : "script", a = 'link[rel="modulepreload"][as="' + ue(l) + '"][href="' + ue(t) + '"]', u = a;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Fu(t);
      }
      if (!Hn.has(u) && (t = S({ rel: "modulepreload", href: t }, e), Hn.set(u, t), n.querySelector(a) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Ji(u)))
              return;
        }
        l = n.createElement("link"), Ge(l, "link", t), J(l), n.head.appendChild(l);
      }
    }
  }
  function zy(t, e, n) {
    xl.S(t, e, n);
    var l = Ju;
    if (l && t) {
      var a = Z(l).hoistableStyles, u = Iu(t);
      e = e || "default";
      var c = a.get(u);
      if (!c) {
        var f = { loading: 0, preload: null };
        if (c = l.querySelector(
          Ki(u)
        ))
          f.loading = 5;
        else {
          t = S(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = Hn.get(u)) && $s(t, n);
          var v = c = l.createElement("link");
          J(v), Ge(v, "link", t), v._p = new Promise(function(O, M) {
            v.onload = O, v.onerror = M;
          }), v.addEventListener("load", function() {
            f.loading |= 1;
          }), v.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Sr(c, e, l);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: f
        }, a.set(u, c);
      }
    }
  }
  function Dy(t, e) {
    xl.X(t, e);
    var n = Ju;
    if (n && t) {
      var l = Z(n).hoistableScripts, a = Fu(t), u = l.get(a);
      u || (u = n.querySelector(Ji(a)), u || (t = S({ src: t, async: !0 }, e), (e = Hn.get(a)) && Ps(t, e), u = n.createElement("script"), J(u), Ge(u, "link", t), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(a, u));
    }
  }
  function xy(t, e) {
    xl.M(t, e);
    var n = Ju;
    if (n && t) {
      var l = Z(n).hoistableScripts, a = Fu(t), u = l.get(a);
      u || (u = n.querySelector(Ji(a)), u || (t = S({ src: t, async: !0, type: "module" }, e), (e = Hn.get(a)) && Ps(t, e), u = n.createElement("script"), J(u), Ge(u, "link", t), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(a, u));
    }
  }
  function Sm(t, e, n, l) {
    var a = (a = _n.current) ? Zi(a) : null;
    if (!a) throw Error(o(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Iu(n.href), e = Z(
          a
        ).hoistableStyles, l = e.get(n), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = Iu(n.href);
          var u = Z(
            a
          ).hoistableStyles, c = u.get(t);
          if (c || (a = a.ownerDocument || a, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(t, c), (u = a.querySelector(
            Ki(t)
          )) ? u._p || (c.instance = u, c.state.loading = 5) : (u = Hn.get(t), u || (u = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Hn.set(t, u)), My(
            a,
            t,
            u,
            c.state
          ))), e && l === null)
            throw Error(o(528, ""));
          return c;
        }
        if (e && l !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (n = Fu(n), e = Z(
          a
        ).hoistableScripts, l = e.get(n), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, t));
    }
  }
  function Iu(t) {
    return 'href="' + ue(t) + '"';
  }
  function Ki(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Em(t) {
    return S({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function My(t, e, n, l) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[hu] !== !0) {
        l.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[hu] = !0, e.onload = e.onerror = dt.bind(null, e), Ge(e, "link", n), J(e), t.head.appendChild(e);
    l.preload = e, e.addEventListener("load", function() {
      return l.loading |= 1;
    }), e.addEventListener("error", function() {
      return l.loading |= 2;
    });
  }
  function Fu(t) {
    return '[src="' + ue(t) + '"]';
  }
  function Ji(t) {
    return "script[async]" + t;
  }
  function _m(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var l = t.querySelector(
            'style[data-href~="' + ue(n.href) + '"]'
          );
          if (l)
            return e.instance = l, J(l), l;
          var a = S({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (t.ownerDocument || t).createElement(
            "style"
          ), J(l), Ge(l, "style", a), Sr(l, n.precedence, t), e.instance = l;
        case "stylesheet":
          a = Iu(n.href);
          var u = t.querySelector(
            Ki(a)
          );
          if (u)
            return e.state.loading |= 4, e.instance = u, J(u), u;
          l = Em(n), (a = Hn.get(a)) && $s(l, a), u = (t.ownerDocument || t).createElement("link"), J(u);
          var c = u;
          return c._p = new Promise(function(f, v) {
            c.onload = f, c.onerror = v;
          }), Ge(u, "link", l), e.state.loading |= 4, Sr(u, n.precedence, t), e.instance = u;
        case "script":
          return u = Fu(n.src), (a = t.querySelector(
            Ji(u)
          )) ? (e.instance = a, J(a), a) : (l = n, (a = Hn.get(u)) && (l = S({}, n), Ps(l, a)), t = t.ownerDocument || t, a = t.createElement("script"), J(a), Ge(a, "link", l), t.head.appendChild(a), e.instance = a);
        case "void":
          return null;
        default:
          throw Error(o(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (l = e.instance, e.state.loading |= 4, Sr(l, n.precedence, t));
    return e.instance;
  }
  function Sr(t, e, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), a = l.length ? l[l.length - 1] : null, u = a, c = 0; c < l.length; c++) {
      var f = l[c];
      if (f.dataset.precedence === e) u = f;
      else if (u !== a) break;
    }
    u ? u.parentNode.insertBefore(t, u.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function $s(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Ps(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Er = null;
  function Tm(t, e, n) {
    if (Er === null) {
      var l = /* @__PURE__ */ new Map(), a = Er = /* @__PURE__ */ new Map();
      a.set(n, l);
    } else
      a = Er, l = a.get(n), l || (l = /* @__PURE__ */ new Map(), a.set(n, l));
    if (l.has(t)) return l;
    for (l.set(t, null), n = n.getElementsByTagName(t), a = 0; a < n.length; a++) {
      var u = n[a];
      if (!(u[Na] || u[re] || t === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = u.getAttribute(e) || "";
        c = t + c;
        var f = l.get(c);
        f ? f.push(u) : l.set(c, [u]);
      }
    }
    return l;
  }
  function tf(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function wy(t, e, n) {
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
  function Cm(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function Am(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Om(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Nm(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += Om(e), t.suspenseyImages.push(e)), t = jy.bind(t), e.decode().then(t, t));
  }
  function Uy(t, e, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var a = Iu(l.href), u = e.querySelector(
          Ki(a)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = Ii.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = u, J(u);
          return;
        }
        u = e.ownerDocument || e, l = Em(l), (a = Hn.get(a)) && $s(l, a), u = u.createElement("link"), J(u);
        var c = u;
        c._p = new Promise(function(f, v) {
          c.onload = f, c.onerror = v;
        }), Ge(u, "link", l), n.instance = u;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = Ii.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var _r = 0;
  function Hy(t, e) {
    return t.stylesheets && t.count === 0 && Cr(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (t.stylesheets && Cr(t, t.stylesheets), t.unsuspend) {
          var u = t.unsuspend;
          t.unsuspend = null, u();
        }
      }, 6e4 + e);
      0 < t.imgBytes && _r === 0 && (_r = 62500 * Pg());
      var a = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Cr(t, t.stylesheets), t.unsuspend)) {
            var u = t.unsuspend;
            t.unsuspend = null, u();
          }
        },
        (t.imgBytes > _r ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(l), clearTimeout(a);
      };
    } : null;
  }
  function Rm(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Cr(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function Ii() {
    this.count--, Rm(this);
  }
  function jy() {
    this.imgCount--, Rm(this);
  }
  var Tr = null;
  function Cr(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Tr = /* @__PURE__ */ new Map(), e.forEach(By, t), Tr = null, Ii.call(t));
  }
  function By(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Tr.get(t);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Tr.set(t, n);
        for (var a = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < a.length; u++) {
          var c = a[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (n.set(c.dataset.precedence, c), l = c);
        }
        l && n.set(null, l);
      }
      a = e.instance, c = a.getAttribute("data-precedence"), u = n.get(c) || l, u === l && n.set(null, a), n.set(c, a), this.count++, l = Ii.bind(this), a.addEventListener("load", l), a.addEventListener("error", l), u ? u.parentNode.insertBefore(a, u.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(a, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Wu = {
    $$typeof: vt,
    Provider: null,
    Consumer: null,
    _currentValue: Et,
    _currentValue2: Et,
    _threadCount: 0
  };
  function Ly(t, e, n, l, a, u, c, f, v) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ru(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ru(0), this.hiddenUpdates = ru(null), this.identifierPrefix = l, this.onUncaughtError = a, this.onCaughtError = u, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = v, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function zm(t, e, n, l, a, u, c, f, v, O, M, q) {
    return t = new Ly(
      t,
      e,
      n,
      c,
      v,
      O,
      M,
      q,
      f
    ), e = 1, u === !0 && (e |= 24), u = ln(3, null, null, e), t.current = u, u.stateNode = t, e = vo(), e.refCount++, t.pooledCache = e, e.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: e
    }, po(u), t;
  }
  function Dm(t) {
    return t ? (t = Tu, t) : Tu;
  }
  function xm(t, e, n, l, a, u) {
    a = Dm(a), l.context === null ? l.context = a : l.pendingContext = a, l = la(e), l.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (l.callback = u), n = aa(t, l, e), n !== null && (rn(n, t, e), Oi(n, t, e));
  }
  function Mm(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function ef(t, e) {
    Mm(t, e), (t = t.alternate) && Mm(t, e);
  }
  function wm(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ja(t, 67108864);
      e !== null && rn(e, t, 67108864), ef(t, 67108864);
    }
  }
  function Um(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Sn();
      e = kl(e);
      var n = ja(t, e);
      n !== null && rn(n, t, e), ef(t, e);
    }
  }
  var $u = !0;
  function Vy(t, e, n, l) {
    var a = ct.T;
    ct.T = null;
    var u = w.p;
    try {
      w.p = 2, nf(t, e, n, l);
    } finally {
      w.p = u, ct.T = a;
    }
  }
  function qy(t, e, n, l) {
    var a = ct.T;
    ct.T = null;
    var u = w.p;
    try {
      w.p = 8, nf(t, e, n, l);
    } finally {
      w.p = u, ct.T = a;
    }
  }
  function nf(t, e, n, l) {
    if ($u) {
      var a = lf(l);
      if (a === null)
        Bs(
          t,
          e,
          l,
          Ar,
          n
        ), jm(t, l);
      else if (Yy(
        a,
        t,
        e,
        n,
        l
      ))
        l.stopPropagation();
      else if (jm(t, l), e & 4 && -1 < Gy.indexOf(t)) {
        for (; a !== null; ) {
          var u = Ra(a);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var c = gl(u.pendingLanes);
                  if (c !== 0) {
                    var f = u;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var v = 1 << 31 - Ne(c);
                      f.entanglements[1] |= v, c &= ~v;
                    }
                    rl(u), (Zt & 6) === 0 && (sr = Ke() + 500, Yi(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = ja(u, 2), f !== null && rn(f, u, 2), hr(), ef(u, 2);
            }
          if (u = lf(l), u === null && Bs(
            t,
            e,
            l,
            Ar,
            n
          ), u === a) break;
          a = u;
        }
        a !== null && l.stopPropagation();
      } else
        Bs(
          t,
          e,
          l,
          null,
          n
        );
    }
  }
  function lf(t) {
    return t = xa(t), af(t);
  }
  var Ar = null;
  function af(t) {
    if (Ar = null, t = Qn(t), t !== null) {
      var e = m(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = _(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = T(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Ar = t, null;
  }
  function Hm(t) {
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
        switch (oc()) {
          case Vl:
            return 2;
          case cu:
            return 8;
          case en:
          case sc:
            return 32;
          case ui:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var uf = !1, ga = null, ya = null, ba = null, Fi = /* @__PURE__ */ new Map(), Wi = /* @__PURE__ */ new Map(), pa = [], Gy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function jm(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        ga = null;
        break;
      case "dragenter":
      case "dragleave":
        ya = null;
        break;
      case "mouseover":
      case "mouseout":
        ba = null;
        break;
      case "pointerover":
      case "pointerout":
        Fi.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Wi.delete(e.pointerId);
    }
  }
  function $i(t, e, n, l, a, u) {
    return t === null || t.nativeEvent !== u ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [a]
    }, e !== null && (e = Ra(e), e !== null && wm(e)), t) : (t.eventSystemFlags |= l, e = t.targetContainers, a !== null && e.indexOf(a) === -1 && e.push(a), t);
  }
  function Yy(t, e, n, l, a) {
    switch (e) {
      case "focusin":
        return ga = $i(
          ga,
          t,
          e,
          n,
          l,
          a
        ), !0;
      case "dragenter":
        return ya = $i(
          ya,
          t,
          e,
          n,
          l,
          a
        ), !0;
      case "mouseover":
        return ba = $i(
          ba,
          t,
          e,
          n,
          l,
          a
        ), !0;
      case "pointerover":
        var u = a.pointerId;
        return Fi.set(
          u,
          $i(
            Fi.get(u) || null,
            t,
            e,
            n,
            l,
            a
          )
        ), !0;
      case "gotpointercapture":
        return u = a.pointerId, Wi.set(
          u,
          $i(
            Wi.get(u) || null,
            t,
            e,
            n,
            l,
            a
          )
        ), !0;
    }
    return !1;
  }
  function Bm(t) {
    var e = Qn(t.target);
    if (e !== null) {
      var n = m(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = _(n), e !== null) {
            t.blockedOn = e, Oa(t.priority, function() {
              Um(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = T(n), e !== null) {
            t.blockedOn = e, Oa(t.priority, function() {
              Um(n);
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
  function Or(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = lf(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Da = l, n.target.dispatchEvent(l), Da = null;
      } else
        return e = Ra(n), e !== null && wm(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function Lm(t, e, n) {
    Or(t) && n.delete(e);
  }
  function Xy() {
    uf = !1, ga !== null && Or(ga) && (ga = null), ya !== null && Or(ya) && (ya = null), ba !== null && Or(ba) && (ba = null), Fi.forEach(Lm), Wi.forEach(Lm);
  }
  function Nr(t, e) {
    t.blockedOn === e && (t.blockedOn = null, uf || (uf = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      Xy
    )));
  }
  var Rr = null;
  function Vm(t) {
    Rr !== t && (Rr = t, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        Rr === t && (Rr = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], l = t[e + 1], a = t[e + 2];
          if (typeof l != "function") {
            if (af(l || n) === null)
              continue;
            break;
          }
          var u = Ra(n);
          u !== null && (t.splice(e, 3), e -= 3, qo(
            u,
            {
              pending: !0,
              data: a,
              method: n.method,
              action: l
            },
            l,
            a
          ));
        }
      }
    ));
  }
  function Pu(t) {
    function e(v) {
      return Nr(v, t);
    }
    ga !== null && Nr(ga, t), ya !== null && Nr(ya, t), ba !== null && Nr(ba, t), Fi.forEach(e), Wi.forEach(e);
    for (var n = 0; n < pa.length; n++) {
      var l = pa[n];
      l.blockedOn === t && (l.blockedOn = null);
    }
    for (; 0 < pa.length && (n = pa[0], n.blockedOn === null); )
      Bm(n), n.blockedOn === null && pa.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var a = n[l], u = n[l + 1], c = a[Ue] || null;
        if (typeof u == "function")
          c || Vm(n);
        else if (c) {
          var f = null;
          if (u && u.hasAttribute("formAction")) {
            if (a = u, c = u[Ue] || null)
              f = c.formAction;
            else if (af(a) !== null) continue;
          } else f = c.action;
          typeof f == "function" ? n[l + 1] = f : (n.splice(l, 3), l -= 3), Vm(n);
        }
      }
  }
  function qm() {
    function t(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(c) {
            return a = c;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      a !== null && (a(), a = null), l || setTimeout(n, 20);
    }
    function n() {
      if (!l && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, a = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        l = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), a !== null && (a(), a = null);
      };
    }
  }
  function cf(t) {
    this._internalRoot = t;
  }
  zr.prototype.render = cf.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(o(409));
    var n = e.current, l = Sn();
    xm(n, l, t, e, null, null);
  }, zr.prototype.unmount = cf.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      xm(t.current, 2, null, t, null, null), hr(), e[sn] = null;
    }
  };
  function zr(t) {
    this._internalRoot = t;
  }
  zr.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = On();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < pa.length && e !== 0 && e < pa[n].priority; n++) ;
      pa.splice(n, 0, t), n === 0 && Bm(t);
    }
  };
  var Gm = r.version;
  if (Gm !== "19.3.0")
    throw Error(
      o(
        527,
        Gm,
        "19.3.0"
      )
    );
  w.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","), Error(o(268, t)));
    return t = B(e), t = t !== null ? U(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Qy = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ct,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Dr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Dr.isDisabled && Dr.supportsFiber)
      try {
        ql = Dr.inject(
          Qy
        ), Xe = Dr;
      } catch {
      }
  }
  return tc.createRoot = function(t, e) {
    if (!d(t)) throw Error(o(299));
    var n = !1, l = "", a = D0, u = x0, c = M0;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (l = e.identifierPrefix), e.onUncaughtError !== void 0 && (a = e.onUncaughtError), e.onCaughtError !== void 0 && (u = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError)), e = zm(
      t,
      1,
      !1,
      null,
      null,
      n,
      l,
      null,
      a,
      u,
      c,
      qm
    ), t[sn] = e.current, js(t), new cf(e);
  }, tc.hydrateRoot = function(t, e, n) {
    if (!d(t)) throw Error(o(299));
    var l = !1, a = "", u = D0, c = x0, f = M0, v = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (a = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (f = n.onRecoverableError), n.formState !== void 0 && (v = n.formState)), e = zm(
      t,
      1,
      !0,
      e,
      n ?? null,
      l,
      a,
      v,
      u,
      c,
      f,
      qm
    ), e.context = Dm(null), n = e.current, l = Sn(), l = kl(l), a = la(l), a.callback = null, aa(n, a, l), n = l, e.current.lanes = n, yl(e, n), rl(e), t[sn] = e.current, js(t), new zr(e);
  }, tc.version = "19.3.0", tc;
}
var Wm;
function eb() {
  if (Wm) return sf.exports;
  Wm = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (r) {
        console.error(r);
      }
  }
  return i(), sf.exports = tb(), sf.exports;
}
var nb = eb(), b2 = y2(), lb = Object.defineProperty, Hf = (i, r) => lb(i, "name", { value: r, configurable: !0 });
function Sf(i, r) {
  if (typeof i == "function")
    return i(r);
  i != null && (i.current = r);
}
Hf(Sf, "setRef");
function p2(...i) {
  return (r) => {
    let s = !1;
    const o = i.map((d) => {
      const m = Sf(d, r);
      return !s && typeof m == "function" && (s = !0), m;
    });
    if (s)
      return () => {
        for (let d = 0; d < o.length; d++) {
          const m = o[d];
          typeof m == "function" ? m() : Sf(i[d], null);
        }
      };
  };
}
Hf(p2, "composeRefs");
function uc(...i) {
  return y.useCallback(p2(...i), i);
}
Hf(uc, "useComposedRefs");
var ab = Object.defineProperty, Wn = (i, r) => ab(i, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function jf(i) {
  const r = y.forwardRef((s, o) => {
    let { children: d, ...m } = s, _ = null, T = !1;
    const R = [];
    Ef(d) && typeof xr == "function" && (d = xr(d._payload)), y.Children.forEach(d, (N) => {
      if (T2(N)) {
        T = !0;
        const F = N;
        let X = "child" in F.props ? F.props.child : F.props.children;
        Ef(X) && typeof xr == "function" && (X = xr(X._payload)), _ = ib(F, X), R.push(_?.props?.children);
      } else
        R.push(N);
    }), _ ? _ = y.cloneElement(_, void 0, R) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !T && y.Children.count(d) === 1 && y.isValidElement(d) && (_ = d)
    );
    const B = _ ? _2(_) : void 0, U = uc(o, B);
    if (!_) {
      if (d || d === 0)
        throw new Error(
          T ? ob(i) : rb(i)
        );
      return d;
    }
    const g = E2(m, _.props ?? {});
    return _.type !== y.Fragment && (g.ref = o ? U : B), y.cloneElement(_, g);
  });
  return r.displayName = `${i}.Slot`, r;
}
Wn(jf, "createSlot");
var Bf = /* @__PURE__ */ jf("Slot"), S2 = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function ub(i) {
  const r = /* @__PURE__ */ Wn((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return r.displayName = `${i}.Slottable`, r.__radixId = S2, r;
}
Wn(ub, "createSlottable");
var ib = /* @__PURE__ */ Wn((i, r) => {
  if ("child" in i.props) {
    const s = i.props.child;
    return y.isValidElement(s) ? y.cloneElement(s, void 0, i.props.children(s.props.children)) : null;
  }
  return y.isValidElement(r) ? r : null;
}, "getSlottableElementFromSlottable");
function E2(i, r) {
  const s = { ...r };
  for (const o in r) {
    const d = i[o], m = r[o];
    /^on[A-Z]/.test(o) ? d && m ? s[o] = (...T) => {
      const R = m(...T);
      return d(...T), R;
    } : d && (s[o] = d) : o === "style" ? s[o] = { ...d, ...m } : o === "className" && (s[o] = [d, m].filter(Boolean).join(" "));
  }
  return { ...i, ...s };
}
Wn(E2, "mergeProps");
function _2(i) {
  let r = Object.getOwnPropertyDescriptor(i.props, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning;
  return s ? i.ref : (r = Object.getOwnPropertyDescriptor(i, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning, s ? i.props.ref : i.props.ref || i.ref);
}
Wn(_2, "getElementRef");
function T2(i) {
  return y.isValidElement(i) && typeof i.type == "function" && "__radixId" in i.type && i.type.__radixId === S2;
}
Wn(T2, "isSlottable");
var cb = /* @__PURE__ */ Symbol.for("react.lazy");
function Ef(i) {
  return i != null && typeof i == "object" && "$$typeof" in i && i.$$typeof === cb && "_payload" in i && C2(i._payload);
}
Wn(Ef, "isLazyComponent");
function C2(i) {
  return typeof i == "object" && i !== null && "then" in i;
}
Wn(C2, "isPromiseLike");
var rb = /* @__PURE__ */ Wn((i) => `${i} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), ob = /* @__PURE__ */ Wn((i) => `${i} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), xr = ac[" use ".trim().toString()], sb = Object.defineProperty, fb = (i, r) => sb(i, "name", { value: r, configurable: !0 }), db = [
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
], jl = db.reduce((i, r) => {
  const s = /* @__PURE__ */ jf(`Primitive.${r}`), o = y.forwardRef((d, m) => {
    const { asChild: _, ...T } = d, R = _ ? s : r;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ H.jsx(R, { ...T, ref: m });
  });
  return o.displayName = `Primitive.${r}`, { ...i, [r]: o };
}, {});
function A2(i, r) {
  i && b2.flushSync(() => i.dispatchEvent(r));
}
fb(A2, "dispatchDiscreteCustomEvent");
var hb = Object.defineProperty, jn = (i, r) => hb(i, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function mb(i, r) {
  const s = y.createContext(r);
  s.displayName = i + "Context";
  const o = /* @__PURE__ */ jn((m) => {
    const { children: _, ...T } = m, R = y.useMemo(() => T, Object.values(T));
    return /* @__PURE__ */ H.jsx(s.Provider, { value: R, children: _ });
  }, "Provider");
  o.displayName = i + "Provider";
  function d(m, _ = {}) {
    const { optional: T = !1 } = _, R = y.useContext(s);
    if (R) return R;
    if (r !== void 0) return r;
    if (!T)
      throw new Error(`\`${m}\` must be used within \`${i}\``);
  }
  return jn(d, "useContext"), [o, d];
}
jn(mb, "createContext");
// @__NO_SIDE_EFFECTS__
function Lf(i, r = []) {
  let s = [];
  function o(m, _) {
    const T = y.createContext(_);
    T.displayName = m + "Context";
    const R = s.length;
    s = [...s, _];
    const B = /* @__PURE__ */ jn((g) => {
      const { scope: N, children: F, ...X } = g, at = N?.[i]?.[R] || T, Y = y.useMemo(() => X, Object.values(X));
      return /* @__PURE__ */ H.jsx(at.Provider, { value: Y, children: F });
    }, "Provider");
    B.displayName = m + "Provider";
    function U(g, N, F = {}) {
      const { optional: X = !1 } = F, at = N?.[i]?.[R] || T, Y = y.useContext(at);
      if (Y) return Y;
      if (_ !== void 0) return _;
      if (!X)
        throw new Error(`\`${g}\` must be used within \`${m}\``);
    }
    return jn(U, "useContext"), [B, U];
  }
  jn(o, "createContext");
  const d = /* @__PURE__ */ jn(() => {
    const m = s.map((_) => y.createContext(_));
    return /* @__PURE__ */ jn(function(T) {
      const R = T?.[i] || m;
      return y.useMemo(
        () => ({ [`__scope${i}`]: { ...T, [i]: R } }),
        [T, R]
      );
    }, "useScope");
  }, "createScope");
  return d.scopeName = i, [o, O2(d, ...r)];
}
jn(Lf, "createContextScope");
function O2(...i) {
  const r = i[0];
  if (i.length === 1) return r;
  const s = /* @__PURE__ */ jn(() => {
    const o = i.map((d) => ({
      useScope: d(),
      scopeName: d.scopeName
    }));
    return /* @__PURE__ */ jn(function(m) {
      const _ = o.reduce((T, { useScope: R, scopeName: B }) => {
        const g = R(m)[`__scope${B}`];
        return { ...T, ...g };
      }, {});
      return y.useMemo(() => ({ [`__scope${r.scopeName}`]: _ }), [_]);
    }, "useComposedScopes");
  }, "createScope");
  return s.scopeName = r.scopeName, s;
}
jn(O2, "composeContextScopes");
var vb = Object.defineProperty, li = (i, r) => vb(i, "name", { value: r, configurable: !0 }), N2 = !!(typeof window < "u" && window.document && window.document.createElement);
function Ea(i, r, { checkForDefaultPrevented: s = !0 } = {}) {
  return /* @__PURE__ */ li(function(d) {
    if (i?.(d), s === !1 || !d || !d.defaultPrevented)
      return r?.(d);
  }, "handleEvent");
}
li(Ea, "composeEventHandlers");
function gb(i) {
  if (!N2)
    throw new Error("Cannot access window outside of the DOM");
  return i?.ownerDocument?.defaultView ?? window;
}
li(gb, "getOwnerWindow");
function _f(i) {
  if (!N2)
    throw new Error("Cannot access document outside of the DOM");
  return i?.ownerDocument ?? document;
}
li(_f, "getOwnerDocument");
function R2(i, r = !1) {
  const { activeElement: s } = _f(i);
  if (!s?.nodeName)
    return null;
  if (z2(s) && s.contentDocument)
    return R2(s.contentDocument.body, r);
  if (r) {
    const o = s.getAttribute("aria-activedescendant");
    if (o) {
      const d = _f(s).getElementById(o);
      if (d)
        return d;
    }
  }
  return s;
}
li(R2, "getActiveElement");
function z2(i) {
  return i.tagName === "IFRAME";
}
li(z2, "isFrame");
var sl = globalThis?.document ? y.useLayoutEffect : () => {
}, yb = Object.defineProperty, bb = (i, r) => yb(i, "name", { value: r, configurable: !0 }), $m = ac[" useEffectEvent ".trim().toString()], Pm = ac[" useInsertionEffect ".trim().toString()];
function D2(i) {
  if (typeof $m == "function")
    return $m(i);
  const r = y.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Pm == "function" ? Pm(() => {
    r.current = i;
  }) : sl(() => {
    r.current = i;
  }), y.useMemo(() => ((...s) => r.current?.(...s)), []);
}
bb(D2, "useEffectEvent");
var pb = Object.defineProperty, ic = (i, r) => pb(i, "name", { value: r, configurable: !0 }), Sb = ac[" useInsertionEffect ".trim().toString()] || sl;
function x2({
  prop: i,
  defaultProp: r,
  onChange: s = /* @__PURE__ */ ic(() => {
  }, "onChange"),
  caller: o
}) {
  const [d, m, _] = M2({
    defaultProp: r,
    onChange: s
  }), T = i !== void 0, R = T ? i : d, B = y.useCallback(
    (U) => {
      if (T) {
        const g = w2(U) ? U(i) : U;
        g !== i && _.current?.(g);
      } else
        m(U);
    },
    [T, i, m, _]
  );
  return [R, B];
}
ic(x2, "useControllableState");
function M2({
  defaultProp: i,
  onChange: r
}) {
  const [s, o] = y.useState(i), d = y.useRef(s), m = y.useRef(r);
  return Sb(() => {
    m.current = r;
  }, [r]), y.useEffect(() => {
    d.current !== s && (m.current?.(s), d.current = s);
  }, [s, d]), [s, o, m];
}
ic(M2, "useUncontrolledState");
function w2(i) {
  return typeof i == "function";
}
ic(w2, "isFunction");
var t2 = /* @__PURE__ */ Symbol("RADIX:SYNC_STATE");
function Eb(i, r, s, o) {
  const { prop: d, defaultProp: m, onChange: _, caller: T } = r, R = d !== void 0, B = D2(_), U = [{ ...s, state: m }];
  o && U.push(o);
  const [g, N] = y.useReducer(
    (Y, Q) => {
      if (Q.type === t2)
        return { ...Y, state: Q.state };
      const W = i(Y, Q);
      return R && !Object.is(W.state, Y.state) && B(W.state), W;
    },
    ...U
  ), F = g.state, X = y.useRef(F);
  y.useEffect(() => {
    X.current !== F && (X.current = F, R || B(F));
  }, [F, X, R]);
  const at = y.useMemo(() => d !== void 0 ? { ...g, state: d } : g, [g, d]);
  return y.useEffect(() => {
    R && !Object.is(d, g.state) && N({ type: t2, state: d });
  }, [d, g.state, R]), [at, N];
}
ic(Eb, "useControllableStateReducer");
var _b = Object.defineProperty, Ul = (i, r) => _b(i, "name", { value: r, configurable: !0 });
function U2(i, r) {
  return y.useReducer((s, o) => r[s][o] ?? s, i);
}
Ul(U2, "useStateMachine");
var H2 = /* @__PURE__ */ Ul((i) => {
  const { present: r, children: s } = i, o = j2(r), d = typeof s == "function" ? s({ present: o.isPresent }) : y.Children.only(s), m = B2(o.ref, L2(d));
  return typeof s == "function" || o.isPresent ? y.cloneElement(d, { ref: m }) : null;
}, "Presence");
function j2(i) {
  const [r, s] = y.useState(), o = y.useRef(null), d = y.useRef(i), m = y.useRef("none"), _ = y.useRef(void 0), T = i ? "mounted" : "unmounted", [R, B] = U2(T, {
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
  return y.useEffect(() => {
    R === "mounted" ? (m.current = _.current ?? ni(o.current), _.current = void 0) : m.current = "none";
  }, [R]), sl(() => {
    const U = o.current, g = d.current;
    if (g !== i) {
      const F = m.current, X = ni(U);
      i ? (_.current = X, B("MOUNT")) : X === "none" || U?.display === "none" ? B("UNMOUNT") : B(g && F !== X ? "ANIMATION_OUT" : "UNMOUNT"), d.current = i;
    }
  }, [i, B]), sl(() => {
    if (r) {
      let U;
      const g = r.ownerDocument.defaultView ?? window, N = /* @__PURE__ */ Ul((X) => {
        const Y = ni(o.current).includes(CSS.escape(X.animationName));
        if (X.target === r && Y && (B("ANIMATION_END"), !d.current)) {
          const Q = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", U = g.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = Q);
          });
        }
      }, "handleAnimationEnd"), F = /* @__PURE__ */ Ul((X) => {
        X.target === r && (m.current = ni(o.current));
      }, "handleAnimationStart");
      return r.addEventListener("animationstart", F), r.addEventListener("animationcancel", N), r.addEventListener("animationend", N), () => {
        g.clearTimeout(U), r.removeEventListener("animationstart", F), r.removeEventListener("animationcancel", N), r.removeEventListener("animationend", N);
      };
    } else
      B("ANIMATION_END");
  }, [r, B]), {
    isPresent: ["mounted", "unmountSuspended"].includes(R),
    ref: y.useCallback((U) => {
      if (U) {
        const g = getComputedStyle(U);
        o.current = g, _.current = ni(g);
      } else
        o.current = null;
      s(U);
    }, [])
  };
}
Ul(j2, "usePresence");
function Tf(i, r) {
  if (typeof i == "function")
    return i(r);
  i != null && (i.current = r);
}
Ul(Tf, "setRef");
function B2(...i) {
  const r = y.useRef(i);
  return r.current = i, y.useCallback((s) => {
    const o = r.current;
    let d = !1;
    const m = o.map((_) => {
      const T = Tf(_, s);
      return !d && typeof T == "function" && (d = !0), T;
    });
    if (d)
      return () => {
        for (let _ = 0; _ < m.length; _++) {
          const T = m[_];
          typeof T == "function" ? T() : Tf(o[_], null);
        }
      };
  }, []);
}
Ul(B2, "useStableComposedRefs");
function ni(i) {
  return i?.animationName || "none";
}
Ul(ni, "getAnimationName");
function L2(i) {
  let r = Object.getOwnPropertyDescriptor(i.props, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning;
  return s ? i.ref : (r = Object.getOwnPropertyDescriptor(i, "ref")?.get, s = r && "isReactWarning" in r && r.isReactWarning, s ? i.props.ref : i.props.ref || i.ref);
}
Ul(L2, "getElementRef");
var Tb = Object.defineProperty, Cb = (i, r) => Tb(i, "name", { value: r, configurable: !0 }), Ab = ac[" useId ".trim().toString()] || (() => {
}), Ob = 0;
function Hr(i) {
  const [r, s] = y.useState(Ab());
  return sl(() => {
    i || s((o) => o ?? String(Ob++));
  }, [i]), i || (r ? `radix-${r}` : "");
}
Cb(Hr, "useId");
var Nb = Object.defineProperty, Rb = (i, r) => Nb(i, "name", { value: r, configurable: !0 });
function lu(i) {
  const r = y.useRef(i);
  return y.useEffect(() => {
    r.current = i;
  }), y.useMemo(() => ((...s) => r.current?.(...s)), []);
}
Rb(lu, "useCallbackRef");
var zb = Object.defineProperty, Me = (i, r) => zb(i, "name", { value: r, configurable: !0 }), Cf = "dismissableLayer.update", Db = "dismissableLayer.pointerDownOutside", xb = "dismissableLayer.focusOutside", e2, V2 = y.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Mb = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Me(function(r, s) {
    const {
      disableOutsidePointerEvents: o = !1,
      deferPointerDownOutside: d = !1,
      onEscapeKeyDown: m,
      onPointerDownOutside: _,
      onFocusOutside: T,
      onInteractOutside: R,
      onDismiss: B,
      ...U
    } = r, g = y.useContext(V2), [N, F] = y.useState(null), X = N?.ownerDocument ?? globalThis?.document, [, at] = y.useState({}), Y = uc(s, F), Q = Array.from(g.layers), [W] = [
      ...g.layersWithOutsidePointerEventsDisabled
    ].slice(-1), nt = W ? Q.indexOf(W) : -1, G = N ? Q.indexOf(N) : -1, h = g.layersWithOutsidePointerEventsDisabled.size > 0, E = G >= nt, S = y.useRef(!1), j = q2(
      (V) => {
        _?.(V), R?.(V), V.defaultPrevented || B?.();
      },
      {
        ownerDocument: X,
        deferPointerDownOutside: d,
        isDeferredPointerDownOutsideRef: S,
        dismissableSurfaces: g.dismissableSurfaces,
        shouldHandlePointerDownOutside: y.useCallback(
          (V) => {
            if (!(V instanceof Node))
              return !1;
            const ut = [...g.branches].some(
              (mt) => mt.contains(V)
            );
            return E && !ut;
          },
          [g.branches, E]
        )
      }
    ), K = G2((V) => {
      if (d && S.current)
        return;
      const ut = V.target;
      [...g.branches].some((vt) => vt.contains(ut)) || (T?.(V), R?.(V), V.defaultPrevented || B?.());
    }, X), st = N ? G === Q.length - 1 : !1, et = lu((V) => {
      V.key === "Escape" && (m?.(V), !V.defaultPrevented && B && (V.preventDefault(), B()));
    });
    return y.useEffect(() => {
      if (st)
        return X.addEventListener("keydown", et, { capture: !0 }), () => X.removeEventListener("keydown", et, { capture: !0 });
    }, [X, st, et]), y.useEffect(() => {
      if (N)
        return o && (g.layersWithOutsidePointerEventsDisabled.size === 0 && (e2 = X.body.style.pointerEvents, X.body.style.pointerEvents = "none"), g.layersWithOutsidePointerEventsDisabled.add(N)), g.layers.add(N), Af(), () => {
          o && (g.layersWithOutsidePointerEventsDisabled.delete(N), g.layersWithOutsidePointerEventsDisabled.size === 0 && (X.body.style.pointerEvents = e2));
        };
    }, [N, X, o, g]), y.useEffect(() => () => {
      N && (g.layers.delete(N), g.layersWithOutsidePointerEventsDisabled.delete(N), Af());
    }, [N, g]), y.useEffect(() => {
      const V = /* @__PURE__ */ Me(() => at({}), "handleUpdate");
      return document.addEventListener(Cf, V), () => document.removeEventListener(Cf, V);
    }, []), /* @__PURE__ */ H.jsx(
      jl.div,
      {
        ...U,
        ref: Y,
        style: {
          pointerEvents: h ? E ? "auto" : "none" : void 0,
          ...r.style
        },
        onFocusCapture: Ea(r.onFocusCapture, K.onFocusCapture),
        onBlurCapture: Ea(r.onBlurCapture, K.onBlurCapture),
        onPointerDownCapture: Ea(
          r.onPointerDownCapture,
          j.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function wb() {
  const i = y.useContext(V2), [r, s] = y.useState(null);
  return y.useEffect(() => {
    if (r)
      return i.dismissableSurfaces.add(r), () => {
        i.dismissableSurfaces.delete(r);
      };
  }, [r, i.dismissableSurfaces]), s;
}
Me(wb, "useDismissableLayerSurface");
var Ub = /* @__PURE__ */ Me(() => !0, "IS_TRUE");
function q2(i, r) {
  const {
    ownerDocument: s = globalThis?.document,
    deferPointerDownOutside: o = !1,
    isDeferredPointerDownOutsideRef: d,
    dismissableSurfaces: m,
    shouldHandlePointerDownOutside: _ = Ub
  } = r, T = lu(i), R = y.useRef(!1), B = y.useRef(!1), U = y.useRef(/* @__PURE__ */ new Map()), g = y.useRef(() => {
  });
  return y.useEffect(() => {
    function N() {
      B.current = !1, d.current = !1, U.current.clear();
    }
    Me(N, "resetOutsideInteraction");
    function F() {
      return Array.from(U.current.values()).some(Boolean);
    }
    Me(F, "isOutsideInteractionIntercepted");
    function X(nt) {
      if (!B.current)
        return;
      const G = nt.target;
      G instanceof Node && [...m].some((E) => E.contains(G)) || U.current.set(nt.type, !0), nt.type === "click" && window.setTimeout(() => {
        B.current && g.current();
      }, 0);
    }
    Me(X, "handleInteractionCapture");
    function at(nt) {
      B.current && U.current.set(nt.type, !1);
    }
    Me(at, "handleInteractionBubble");
    const Y = /* @__PURE__ */ Me((nt) => {
      if (nt.target && !R.current) {
        let G = function() {
          s.removeEventListener("click", g.current);
          const E = F();
          N(), E || Vf(
            Db,
            T,
            h,
            { discrete: !0 }
          );
        };
        if (Me(G, "handleAndDispatchPointerDownOutsideEvent"), !_(nt.target)) {
          s.removeEventListener("click", g.current), N(), R.current = !1;
          return;
        }
        const h = { originalEvent: nt };
        B.current = !0, d.current = o && nt.button === 0, U.current.clear(), !o || nt.button !== 0 ? G() : (s.removeEventListener("click", g.current), g.current = G, s.addEventListener("click", g.current, { once: !0 }));
      } else
        s.removeEventListener("click", g.current), N();
      R.current = !1;
    }, "handlePointerDown"), Q = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const nt of Q)
      s.addEventListener(nt, X, !0), s.addEventListener(nt, at);
    const W = window.setTimeout(() => {
      s.addEventListener("pointerdown", Y);
    }, 0);
    return () => {
      window.clearTimeout(W), s.removeEventListener("pointerdown", Y), s.removeEventListener("click", g.current);
      for (const nt of Q)
        s.removeEventListener(nt, X, !0), s.removeEventListener(nt, at);
    };
  }, [
    s,
    T,
    o,
    d,
    m,
    _
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ Me(() => R.current = !0, "onPointerDownCapture")
  };
}
Me(q2, "usePointerDownOutside");
function G2(i, r = globalThis?.document) {
  const s = lu(i), o = y.useRef(!1);
  return y.useEffect(() => {
    const d = /* @__PURE__ */ Me((m) => {
      m.target && !o.current && Vf(xb, s, { originalEvent: m }, {
        discrete: !1
      });
    }, "handleFocus");
    return r.addEventListener("focusin", d), () => r.removeEventListener("focusin", d);
  }, [r, s]), {
    onFocusCapture: /* @__PURE__ */ Me(() => o.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ Me(() => o.current = !1, "onBlurCapture")
  };
}
Me(G2, "useFocusOutside");
function Af() {
  const i = new CustomEvent(Cf);
  document.dispatchEvent(i);
}
Me(Af, "dispatchUpdate");
function Vf(i, r, s, { discrete: o }) {
  const d = s.originalEvent.target, m = new CustomEvent(i, { bubbles: !1, cancelable: !0, detail: s });
  r && d.addEventListener(i, r, { once: !0 }), o ? A2(d, m) : d.dispatchEvent(m);
}
Me(Vf, "handleAndDispatchCustomEvent");
var Hb = Object.defineProperty, tn = (i, r) => Hb(i, "name", { value: r, configurable: !0 }), mf = "focusScope.autoFocusOnMount", vf = "focusScope.autoFocusOnUnmount", n2 = { bubbles: !1, cancelable: !0 }, jb = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ tn(function(r, s) {
    const {
      loop: o = !1,
      trapped: d = !1,
      onMountAutoFocus: m,
      onUnmountAutoFocus: _,
      ...T
    } = r, [R, B] = y.useState(null), U = lu(m), g = lu(_), N = y.useRef(null), F = uc(s, B), X = y.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    y.useEffect(() => {
      if (d) {
        let Y = function(G) {
          if (X.paused || !R) return;
          const h = G.target;
          R.contains(h) ? N.current = h : wl(N.current, { select: !0 });
        }, Q = function(G) {
          if (X.paused || !R) return;
          const h = G.relatedTarget;
          h !== null && (R.contains(h) || wl(N.current, { select: !0 }));
        }, W = function(G) {
          if (document.activeElement === document.body)
            for (const E of G)
              E.removedNodes.length > 0 && wl(R);
        };
        tn(Y, "handleFocusIn"), tn(Q, "handleFocusOut"), tn(W, "handleMutations"), document.addEventListener("focusin", Y), document.addEventListener("focusout", Q);
        const nt = new MutationObserver(W);
        return R && nt.observe(R, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", Y), document.removeEventListener("focusout", Q), nt.disconnect();
        };
      }
    }, [d, R, X.paused]), y.useEffect(() => {
      if (R) {
        l2.add(X);
        const Y = document.activeElement;
        if (!R.contains(Y)) {
          const W = new CustomEvent(mf, n2);
          R.addEventListener(mf, U), R.dispatchEvent(W), W.defaultPrevented || (Y2(K2(qf(R)), { select: !0 }), document.activeElement === Y && wl(R));
        }
        return () => {
          R.removeEventListener(mf, U), setTimeout(() => {
            const W = new CustomEvent(vf, n2);
            R.addEventListener(vf, g), R.dispatchEvent(W), W.defaultPrevented || wl(Y ?? document.body, { select: !0 }), R.removeEventListener(vf, g), l2.remove(X);
          }, 0);
        };
      }
    }, [R, U, g, X]);
    const at = y.useCallback(
      (Y) => {
        if (!o && !d || X.paused) return;
        const Q = Y.key === "Tab" && !Y.altKey && !Y.ctrlKey && !Y.metaKey, W = document.activeElement;
        if (Q && W) {
          const nt = Y.currentTarget, [G, h] = X2(nt);
          G && h ? !Y.shiftKey && W === h ? (Y.preventDefault(), o && wl(G, { select: !0 })) : Y.shiftKey && W === G && (Y.preventDefault(), o && wl(h, { select: !0 })) : W === nt && Y.preventDefault();
        }
      },
      [o, d, X.paused]
    );
    return /* @__PURE__ */ H.jsx(jl.div, { tabIndex: -1, ...T, ref: F, onKeyDown: at });
  }, "FocusScope")
);
function Y2(i, { select: r = !1 } = {}) {
  const s = document.activeElement;
  for (const o of i)
    if (wl(o, { select: r }), document.activeElement !== s) return;
}
tn(Y2, "focusFirst");
function X2(i) {
  const r = qf(i), s = Of(r, i), o = Of(r.reverse(), i);
  return [s, o];
}
tn(X2, "getTabbableEdges");
function qf(i) {
  const r = [], s = document.createTreeWalker(i, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ tn((o) => {
      const d = o.tagName === "INPUT" && o.type === "hidden";
      return o.disabled || o.hidden || d ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; s.nextNode(); ) r.push(s.currentNode);
  return r;
}
tn(qf, "getTabbableCandidates");
function Of(i, r) {
  const s = typeof r.checkVisibility == "function" && r.checkVisibility({ checkVisibilityCSS: !0 });
  for (const o of i)
    if (!(s ? !o.checkVisibility({ checkVisibilityCSS: !0 }) : Q2(o, { upTo: r })))
      return o;
}
tn(Of, "findVisible");
function Q2(i, { upTo: r }) {
  if (getComputedStyle(i).visibility === "hidden") return !0;
  for (; i; ) {
    if (r !== void 0 && i === r) return !1;
    if (getComputedStyle(i).display === "none") return !0;
    i = i.parentElement;
  }
  return !1;
}
tn(Q2, "isHidden");
function k2(i) {
  return i instanceof HTMLInputElement && "select" in i;
}
tn(k2, "isSelectableInput");
function wl(i, { select: r = !1 } = {}) {
  if (i && i.focus) {
    const s = document.activeElement;
    i.focus({ preventScroll: !0 }), i !== s && k2(i) && r && i.select();
  }
}
tn(wl, "focus");
var l2 = Z2();
function Z2() {
  let i = [];
  return {
    add(r) {
      const s = i[0];
      r !== s && s?.pause(), i = Nf(i, r), i.unshift(r);
    },
    remove(r) {
      i = Nf(i, r), i[0]?.resume();
    }
  };
}
tn(Z2, "createFocusScopesStack");
function Nf(i, r) {
  const s = [...i], o = s.indexOf(r);
  return o !== -1 && s.splice(o, 1), s;
}
tn(Nf, "arrayRemove");
function K2(i) {
  return i.filter((r) => r.tagName !== "A");
}
tn(K2, "removeLinks");
var Bb = Object.defineProperty, Lb = (i, r) => Bb(i, "name", { value: r, configurable: !0 }), Vb = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Lb(function(r, s) {
    const { container: o, ...d } = r, [m, _] = y.useState(!1);
    sl(() => _(!0), []);
    const T = o || m && globalThis?.document?.body;
    return T ? b2.createPortal(/* @__PURE__ */ H.jsx(jl.div, { ...d, ref: s }), T) : null;
  }, "Portal")
), qb = Object.defineProperty, Gf = (i, r) => qb(i, "name", { value: r, configurable: !0 }), Mr = 0, ti = null;
function Gb(i) {
  return Yf(), i.children;
}
Gf(Gb, "FocusGuards");
function Yf() {
  y.useEffect(() => {
    ti || (ti = { start: Rf(), end: Rf() });
    const { start: i, end: r } = ti;
    return document.body.firstElementChild !== i && document.body.insertAdjacentElement("afterbegin", i), document.body.lastElementChild !== r && document.body.insertAdjacentElement("beforeend", r), Mr++, () => {
      Mr === 1 && (ti?.start.remove(), ti?.end.remove(), ti = null), Mr = Math.max(0, Mr - 1);
    };
  }, []);
}
Gf(Yf, "useFocusGuards");
function Rf() {
  const i = document.createElement("span");
  return i.setAttribute("data-radix-focus-guard", ""), i.tabIndex = 0, i.style.outline = "none", i.style.opacity = "0", i.style.position = "fixed", i.style.pointerEvents = "none", i;
}
Gf(Rf, "createFocusGuard");
var Yb = function(i) {
  if (typeof document > "u")
    return null;
  var r = Array.isArray(i) ? i[0] : i;
  return r.ownerDocument.body;
}, ei = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new WeakMap(), Ur = {}, gf = 0, J2 = function(i) {
  return i && (i.host || J2(i.parentNode));
}, Xb = function(i, r) {
  return r.map(function(s) {
    if (i.contains(s))
      return s;
    var o = J2(s);
    return o && i.contains(o) ? o : (console.error("aria-hidden", s, "in not contained inside", i, ". Doing nothing"), null);
  }).filter(function(s) {
    return !!s;
  });
}, Qb = function(i, r, s, o) {
  var d = Xb(r, Array.isArray(i) ? i : [i]);
  Ur[s] || (Ur[s] = /* @__PURE__ */ new WeakMap());
  var m = Ur[s], _ = [], T = /* @__PURE__ */ new Set(), R = new Set(d), B = function(g) {
    !g || T.has(g) || (T.add(g), B(g.parentNode));
  };
  d.forEach(B);
  var U = function(g) {
    !g || R.has(g) || Array.prototype.forEach.call(g.children, function(N) {
      if (T.has(N))
        U(N);
      else
        try {
          var F = N.getAttribute(o), X = F !== null && F !== "false", at = (ei.get(N) || 0) + 1, Y = (m.get(N) || 0) + 1;
          ei.set(N, at), m.set(N, Y), _.push(N), at === 1 && X && wr.set(N, !0), Y === 1 && N.setAttribute(s, "true"), X || N.setAttribute(o, "true");
        } catch (Q) {
          console.error("aria-hidden: cannot operate on ", N, Q);
        }
    });
  };
  return U(r), T.clear(), gf++, function() {
    _.forEach(function(g) {
      var N = ei.get(g) - 1, F = m.get(g) - 1;
      ei.set(g, N), m.set(g, F), N || (wr.has(g) || g.removeAttribute(o), wr.delete(g)), F || g.removeAttribute(s);
    }), gf--, gf || (ei = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new WeakMap(), Ur = {});
  };
}, kb = function(i, r, s) {
  s === void 0 && (s = "data-aria-hidden");
  var o = Array.from(Array.isArray(i) ? i : [i]), d = Yb(i);
  return d ? (o.push.apply(o, Array.from(d.querySelectorAll("[aria-live], script"))), Qb(o, d, s, "aria-hidden")) : function() {
    return null;
  };
}, Zb = Object.defineProperty, fl = (i, r) => Zb(i, "name", { value: r, configurable: !0 }), Xf = "Dialog", [I2, fS] = /* @__PURE__ */ Lf(Xf), [Kb, Ta] = I2(Xf), Jb = /* @__PURE__ */ fl((i) => {
  const {
    __scopeDialog: r,
    children: s,
    open: o,
    defaultOpen: d,
    onOpenChange: m,
    modal: _ = !0
  } = i, T = y.useRef(null), R = y.useRef(null), [B, U] = x2({
    prop: o,
    defaultProp: d ?? !1,
    onChange: m,
    caller: Xf
  }), [g, N] = y.useState(0), [F, X] = y.useState(0);
  return /* @__PURE__ */ H.jsx(
    Kb,
    {
      scope: r,
      triggerRef: T,
      contentRef: R,
      contentId: Hr(),
      titleId: Hr(),
      descriptionId: Hr(),
      titlePresent: g > 0,
      descriptionPresent: F > 0,
      setTitleCount: N,
      setDescriptionCount: X,
      open: B,
      onOpenChange: U,
      onOpenToggle: y.useCallback(() => U((at) => !at), [U]),
      modal: _,
      children: s
    }
  );
}, "Dialog"), F2 = "DialogPortal", [Ib, Fb] = I2(F2, {
  forceMount: void 0
}), Wb = /* @__PURE__ */ fl((i) => {
  const { __scopeDialog: r, forceMount: s, children: o, container: d } = i, m = Ta(F2, r);
  return /* @__PURE__ */ H.jsx(Ib, { scope: r, forceMount: s, children: y.Children.map(o, (_) => /* @__PURE__ */ H.jsx(H2, { present: s || m.open, children: /* @__PURE__ */ H.jsx(Vb, { asChild: !0, container: d, children: _ }) })) });
}, "DialogPortal"), nc = "DialogContent", $b = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ fl(function(r, s) {
    const o = Fb(nc, r.__scopeDialog), { forceMount: d = o.forceMount, ...m } = r, _ = Ta(nc, r.__scopeDialog);
    return /* @__PURE__ */ H.jsx(H2, { present: d || _.open, children: _.modal ? /* @__PURE__ */ H.jsx(Pb, { ...m, ref: s }) : /* @__PURE__ */ H.jsx(t1, { ...m, ref: s }) });
  }, "DialogContent")
), Pb = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ fl(function(r, s) {
    const o = Ta(nc, r.__scopeDialog), d = y.useRef(null), m = uc(s, o.contentRef, d);
    return y.useEffect(() => {
      const _ = d.current;
      if (_) return kb(_);
    }, []), /* @__PURE__ */ H.jsx(
      W2,
      {
        ...r,
        ref: m,
        trapFocus: o.open,
        disableOutsidePointerEvents: o.open,
        onCloseAutoFocus: Ea(r.onCloseAutoFocus, (_) => {
          _.preventDefault(), o.triggerRef.current?.focus();
        }),
        onPointerDownOutside: Ea(r.onPointerDownOutside, (_) => {
          const T = _.detail.originalEvent, R = T.button === 0 && T.ctrlKey === !0;
          (T.button === 2 || R) && _.preventDefault();
        }),
        onFocusOutside: Ea(
          r.onFocusOutside,
          (_) => _.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), t1 = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ fl(function(r, s) {
    const o = Ta(nc, r.__scopeDialog), d = y.useRef(!1), m = y.useRef(!1);
    return /* @__PURE__ */ H.jsx(
      W2,
      {
        ...r,
        ref: s,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (_) => {
          r.onCloseAutoFocus?.(_), _.defaultPrevented || (d.current || o.triggerRef.current?.focus(), _.preventDefault()), d.current = !1, m.current = !1;
        },
        onInteractOutside: (_) => {
          r.onInteractOutside?.(_), _.defaultPrevented || (d.current = !0, _.detail.originalEvent.type === "pointerdown" && (m.current = !0));
          const T = _.target;
          o.triggerRef.current?.contains(T) && _.preventDefault(), _.detail.originalEvent.type === "focusin" && m.current && _.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), W2 = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ fl(function(r, s) {
    const { __scopeDialog: o, trapFocus: d, onOpenAutoFocus: m, onCloseAutoFocus: _, ...T } = r, R = Ta(nc, o);
    return Yf(), /* @__PURE__ */ H.jsx(H.Fragment, { children: /* @__PURE__ */ H.jsx(
      jb,
      {
        asChild: !0,
        loop: !0,
        trapped: d,
        onMountAutoFocus: m,
        onUnmountAutoFocus: _,
        children: /* @__PURE__ */ H.jsx(
          Mb,
          {
            role: "dialog",
            id: R.contentId,
            "aria-describedby": R.descriptionPresent ? R.descriptionId : void 0,
            "aria-labelledby": R.titlePresent ? R.titleId : void 0,
            "data-state": $2(R.open),
            ...T,
            ref: s,
            deferPointerDownOutside: !0,
            onDismiss: () => R.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), e1 = "DialogTitle", n1 = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ fl(function(r, s) {
    const { __scopeDialog: o, ...d } = r, m = Ta(e1, o), { setTitleCount: _ } = m;
    return sl(() => (_((T) => T + 1), () => _((T) => T - 1)), [_]), /* @__PURE__ */ H.jsx(jl.h2, { id: m.titleId, ...d, ref: s });
  }, "DialogTitle")
), l1 = "DialogDescription", a1 = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ fl(function(r, s) {
    const { __scopeDialog: o, ...d } = r, m = Ta(l1, o), { setDescriptionCount: _ } = m;
    return sl(() => (_((T) => T + 1), () => _((T) => T - 1)), [_]), /* @__PURE__ */ H.jsx(jl.p, { id: m.descriptionId, ...d, ref: s });
  }, "DialogDescription")
), u1 = "DialogClose", i1 = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ fl(function(r, s) {
    const { __scopeDialog: o, ...d } = r, m = Ta(u1, o);
    return /* @__PURE__ */ H.jsx(
      jl.button,
      {
        type: "button",
        ...d,
        ref: s,
        onClick: Ea(r.onClick, () => m.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function $2(i) {
  return i ? "open" : "closed";
}
fl($2, "getState");
var c1 = Object.defineProperty, Hl = (i, r) => c1(i, "name", { value: r, configurable: !0 }), P2 = "Avatar", [r1, dS] = /* @__PURE__ */ Lf(P2), o1 = [
  0,
  () => {
  }
], [s1, tv] = r1(P2), f1 = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Hl(function(r, s) {
    const { __scopeAvatar: o, ...d } = r, [m, _] = y.useState("idle"), [T, R] = nv();
    return /* @__PURE__ */ H.jsx(
      s1,
      {
        scope: o,
        imageLoadingStatus: m,
        setImageLoadingStatus: _,
        imageCount: T,
        setImageCount: R,
        children: /* @__PURE__ */ H.jsx(jl.span, { ...d, ref: s })
      }
    );
  }, "Avatar")
), d1 = "AvatarImage", h1 = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Hl(function(r, s) {
    const { __scopeAvatar: o, src: d, onLoadingStatusChange: m, ..._ } = r, T = tv(d1, o);
    T.setImageCount;
    const R = ev(d, {
      referrerPolicy: _.referrerPolicy,
      crossOrigin: _.crossOrigin,
      loadingStatus: T.imageLoadingStatus,
      setLoadingStatus: T.setImageLoadingStatus
    }), B = lu((g) => {
      m?.(g);
    }), U = y.useRef(R);
    return sl(() => {
      const g = U.current;
      U.current = R, R !== g && B(R);
    }, [R, B]), R === "loaded" ? /* @__PURE__ */ H.jsx(jl.img, { ..._, ref: s, src: d }) : null;
  }, "AvatarImage")
), m1 = "AvatarFallback", v1 = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Hl(function(r, s) {
    const { __scopeAvatar: o, delayMs: d, ...m } = r, _ = tv(m1, o), [T, R] = y.useState(d === void 0);
    return y.useEffect(() => {
      if (d !== void 0) {
        const B = window.setTimeout(() => R(!0), d);
        return () => window.clearTimeout(B);
      }
    }, [d]), T && _.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ H.jsx(jl.span, { ...m, ref: s }) : null;
  }, "AvatarFallback")
);
function ev(i, {
  loadingStatus: r,
  setLoadingStatus: s,
  referrerPolicy: o,
  crossOrigin: d
}) {
  return sl(() => {
    if (!i) {
      s("error");
      return;
    }
    const m = new window.Image(), _ = /* @__PURE__ */ Hl((R) => {
      const B = R.currentTarget;
      s(zf(B));
    }, "handleLoad"), T = /* @__PURE__ */ Hl(() => s("error"), "handleError");
    return m.addEventListener("load", _), m.addEventListener("error", T), o && (m.referrerPolicy = o), m.crossOrigin = d ?? null, m.src = i, s(zf(m)), () => {
      m.removeEventListener("load", _), m.removeEventListener("error", T), s("idle");
    };
  }, [i, d, o, s]), r;
}
Hl(ev, "useImageLoadingStatus");
function zf(i) {
  return i.complete ? i.naturalWidth > 0 ? "loaded" : "error" : "loading";
}
Hl(zf, "getImageLoadingStatus");
function nv() {
  return o1;
}
Hl(nv, "useImageCount");
function g1(i) {
}
Hl(g1, "useUpdateImageCount");
const y1 = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), lv = (...i) => i.filter((r, s, o) => !!r && r.trim() !== "" && o.indexOf(r) === s).join(" ").trim();
var b1 = {
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
const p1 = y.forwardRef(
  ({
    color: i = "currentColor",
    size: r = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: o,
    className: d = "",
    children: m,
    iconNode: _,
    ...T
  }, R) => y.createElement(
    "svg",
    {
      ref: R,
      ...b1,
      width: r,
      height: r,
      stroke: i,
      strokeWidth: o ? Number(s) * 24 / Number(r) : s,
      className: lv("lucide", d),
      ...T
    },
    [
      ..._.map(([B, U]) => y.createElement(B, U)),
      ...Array.isArray(m) ? m : [m]
    ]
  )
);
const au = (i, r) => {
  const s = y.forwardRef(
    ({ className: o, ...d }, m) => y.createElement(p1, {
      ref: m,
      iconNode: r,
      className: lv(`lucide-${y1(i)}`, o),
      ...d
    })
  );
  return s.displayName = `${i}`, s;
};
const S1 = au("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const a2 = au("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const E1 = au("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const _1 = au("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
const T1 = au("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);
const C1 = au("Store", [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
]);
const A1 = au("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
var ec = { exports: {} }, O1 = ec.exports, u2;
function N1() {
  return u2 || (u2 = 1, (function(i, r) {
    (function(s, o) {
      o(r);
    })(O1, (function(s) {
      function o(G, h) {
        G.terminate = function() {
          const E = () => {
          };
          this.onerror = E, this.onmessage = E, this.onopen = E;
          const S = /* @__PURE__ */ new Date(), j = Math.random().toString().substring(2, 8), K = this.onclose;
          this.onclose = (st) => {
            const et = (/* @__PURE__ */ new Date()).getTime() - S.getTime();
            h(`Discarded socket (#${j})  closed after ${et}ms, with code/reason: ${st.code}/${st.reason}`);
          }, this.close(), K?.call(G, {
            code: 4001,
            reason: `Quick discarding socket (#${j}) without waiting for the shutdown sequence.`,
            wasClean: !1
          });
        };
      }
      const d = {
        // LINEFEED byte (octet 10)
        LF: `
`,
        // NULL byte (octet 0)
        NULL: "\0"
      };
      class m {
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
        constructor(h) {
          const { command: E, headers: S, body: j, binaryBody: K, escapeHeaderValues: st, skipContentLengthHeader: et } = h;
          this.command = E, this.headers = Object.assign({}, S || {}), K ? (this._binaryBody = K, this.isBinaryBody = !0) : (this._body = j || "", this.isBinaryBody = !1), this.escapeHeaderValues = st || !1, this.skipContentLengthHeader = et || !1;
        }
        /**
         * deserialize a STOMP Frame from raw data.
         *
         * @internal
         */
        static fromRawFrame(h, E) {
          const S = {}, j = (K) => K.replace(/^\s+|\s+$/g, "");
          for (const K of h.headers.reverse()) {
            K.indexOf(":");
            const st = j(K[0]);
            let et = j(K[1]);
            E && h.command !== "CONNECT" && h.command !== "CONNECTED" && (et = m.hdrValueUnEscape(et)), S[st] = et;
          }
          return new m({
            command: h.command,
            headers: S,
            binaryBody: h.binaryBody,
            escapeHeaderValues: E
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
          const h = this.serializeCmdAndHeaders();
          return this.isBinaryBody ? m.toUnit8Array(h, this._binaryBody).buffer : h + this._body + d.NULL;
        }
        serializeCmdAndHeaders() {
          const h = [this.command];
          this.skipContentLengthHeader && delete this.headers["content-length"];
          for (const E of Object.keys(this.headers || {})) {
            const S = this.headers[E];
            this.escapeHeaderValues && this.command !== "CONNECT" && this.command !== "CONNECTED" ? h.push(`${E}:${m.hdrValueEscape(`${S}`)}`) : h.push(`${E}:${S}`);
          }
          return (this.isBinaryBody || !this.isBodyEmpty() && !this.skipContentLengthHeader) && h.push(`content-length:${this.bodyLength()}`), h.join(d.LF) + d.LF + d.LF;
        }
        isBodyEmpty() {
          return this.bodyLength() === 0;
        }
        bodyLength() {
          const h = this.binaryBody;
          return h ? h.length : 0;
        }
        /**
         * Compute the size of a UTF-8 string by counting its number of bytes
         * (and not the number of characters composing the string)
         */
        static sizeOfUTF8(h) {
          return h ? new TextEncoder().encode(h).length : 0;
        }
        static toUnit8Array(h, E) {
          const S = new TextEncoder().encode(h), j = new Uint8Array([0]), K = new Uint8Array(S.length + E.length + j.length);
          return K.set(S), K.set(E, S.length), K.set(j, S.length + E.length), K;
        }
        /**
         * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
         *
         * @internal
         */
        static marshall(h) {
          return new m(h).serialize();
        }
        /**
         *  Escape header values
         */
        static hdrValueEscape(h) {
          return h.replace(/\\/g, "\\\\").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/:/g, "\\c");
        }
        /**
         * UnEscape header values
         */
        static hdrValueUnEscape(h) {
          return h.replace(/\\r/g, "\r").replace(/\\n/g, `
`).replace(/\\c/g, ":").replace(/\\\\/g, "\\");
        }
      }
      const _ = 0, T = 10, R = 13, B = 58;
      class U {
        constructor(h, E) {
          this.onFrame = h, this.onIncomingPing = E, this._encoder = new TextEncoder(), this._decoder = new TextDecoder(), this._token = [], this._initState();
        }
        parseChunk(h, E = !1) {
          let S;
          if (typeof h == "string" ? S = this._encoder.encode(h) : S = new Uint8Array(h), E && S[S.length - 1] !== 0) {
            const j = new Uint8Array(S.length + 1);
            j.set(S, 0), j[S.length] = 0, S = j;
          }
          for (let j = 0; j < S.length; j++) {
            const K = S[j];
            this._onByte(K);
          }
        }
        // The following implements a simple Rec Descent Parser.
        // The grammar is simple and just one byte tells what should be the next state
        _collectFrame(h) {
          if (h !== _ && h !== R) {
            if (h === T) {
              this.onIncomingPing();
              return;
            }
            this._onByte = this._collectCommand, this._reinjectByte(h);
          }
        }
        _collectCommand(h) {
          if (h !== R) {
            if (h === T) {
              this._results.command = this._consumeTokenAsUTF8(), this._onByte = this._collectHeaders;
              return;
            }
            this._consumeByte(h);
          }
        }
        _collectHeaders(h) {
          if (h !== R) {
            if (h === T) {
              this._setupCollectBody();
              return;
            }
            this._onByte = this._collectHeaderKey, this._reinjectByte(h);
          }
        }
        _reinjectByte(h) {
          this._onByte(h);
        }
        _collectHeaderKey(h) {
          if (h === B) {
            this._headerKey = this._consumeTokenAsUTF8(), this._onByte = this._collectHeaderValue;
            return;
          }
          this._consumeByte(h);
        }
        _collectHeaderValue(h) {
          if (h !== R) {
            if (h === T) {
              this._results.headers.push([
                this._headerKey,
                this._consumeTokenAsUTF8()
              ]), this._headerKey = void 0, this._onByte = this._collectHeaders;
              return;
            }
            this._consumeByte(h);
          }
        }
        _setupCollectBody() {
          const h = this._results.headers.filter((E) => E[0] === "content-length")[0];
          h ? (this._bodyBytesRemaining = parseInt(h[1], 10), this._onByte = this._collectBodyFixedSize) : this._onByte = this._collectBodyNullTerminated;
        }
        _collectBodyNullTerminated(h) {
          if (h === _) {
            this._retrievedBody();
            return;
          }
          this._consumeByte(h);
        }
        _collectBodyFixedSize(h) {
          if (this._bodyBytesRemaining-- === 0) {
            this._retrievedBody();
            return;
          }
          this._consumeByte(h);
        }
        _retrievedBody() {
          this._results.binaryBody = this._consumeTokenAsRaw();
          try {
            this.onFrame(this._results);
          } catch (h) {
            console.log("Ignoring an exception thrown by a frame handler. Original exception: ", h);
          }
          this._initState();
        }
        // Rec Descent Parser helpers
        _consumeByte(h) {
          this._token.push(h);
        }
        _consumeTokenAsUTF8() {
          return this._decoder.decode(this._consumeTokenAsRaw());
        }
        _consumeTokenAsRaw() {
          const h = new Uint8Array(this._token);
          return this._token = [], h;
        }
        _initState() {
          this._results = {
            command: void 0,
            headers: [],
            binaryBody: void 0
          }, this._token = [], this._headerKey = void 0, this._onByte = this._collectFrame;
        }
      }
      s.StompSocketState = void 0, (function(G) {
        G[G.CONNECTING = 0] = "CONNECTING", G[G.OPEN = 1] = "OPEN", G[G.CLOSING = 2] = "CLOSING", G[G.CLOSED = 3] = "CLOSED";
      })(s.StompSocketState || (s.StompSocketState = {})), s.ActivationState = void 0, (function(G) {
        G[G.ACTIVE = 0] = "ACTIVE", G[G.DEACTIVATING = 1] = "DEACTIVATING", G[G.INACTIVE = 2] = "INACTIVE";
      })(s.ActivationState || (s.ActivationState = {})), s.ReconnectionTimeMode = void 0, (function(G) {
        G[G.LINEAR = 0] = "LINEAR", G[G.EXPONENTIAL = 1] = "EXPONENTIAL";
      })(s.ReconnectionTimeMode || (s.ReconnectionTimeMode = {})), s.TickerStrategy = void 0, (function(G) {
        G.Interval = "interval", G.Worker = "worker";
      })(s.TickerStrategy || (s.TickerStrategy = {}));
      class g {
        constructor(h, E = s.TickerStrategy.Interval, S) {
          this._interval = h, this._strategy = E, this._debug = S, this._workerScript = `
    var startTime = Date.now();
    setInterval(function() {
        self.postMessage(Date.now() - startTime);
    }, ${this._interval});
  `;
        }
        start(h) {
          this.stop(), this.shouldUseWorker() ? this.runWorker(h) : this.runInterval(h);
        }
        stop() {
          this.disposeWorker(), this.disposeInterval();
        }
        shouldUseWorker() {
          return typeof Worker < "u" && this._strategy === s.TickerStrategy.Worker;
        }
        runWorker(h) {
          this._debug("Using runWorker for outgoing pings"), this._worker || (this._worker = new Worker(URL.createObjectURL(new Blob([this._workerScript], { type: "text/javascript" }))), this._worker.onmessage = (E) => h(E.data));
        }
        runInterval(h) {
          if (this._debug("Using runInterval for outgoing pings"), !this._timer) {
            const E = Date.now();
            this._timer = setInterval(() => {
              h(Date.now() - E);
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
      class N {
        /**
         * Takes an array of versions, typical elements '1.2', '1.1', or '1.0'
         *
         * You will be creating an instance of this class if you want to override
         * supported versions to be declared during STOMP handshake.
         */
        constructor(h) {
          this.versions = h;
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
          return this.versions.map((h) => `v${h.replace(".", "")}.stomp`);
        }
      }
      N.V1_0 = "1.0", N.V1_1 = "1.1", N.V1_2 = "1.2", N.default = new N([
        N.V1_2,
        N.V1_1,
        N.V1_0
      ]);
      class F {
        get connectedVersion() {
          return this._connectedVersion;
        }
        get connected() {
          return this._connected;
        }
        constructor(h, E, S) {
          this._client = h, this._webSocket = E, this._connected = !1, this._serverFrameHandlers = {
            // [CONNECTED Frame](https://stomp.github.com/stomp-specification-1.2.html#CONNECTED_Frame)
            CONNECTED: (j) => {
              this.debug(`connected to server ${j.headers.server}`), this._connected = !0, this._connectedVersion = j.headers.version, this._connectedVersion === N.V1_2 && (this._escapeHeaderValues = !0), this._setupHeartbeat(j.headers), this.onConnect(j);
            },
            // [MESSAGE Frame](https://stomp.github.com/stomp-specification-1.2.html#MESSAGE)
            MESSAGE: (j) => {
              const K = j.headers.subscription, st = this._subscriptions[K] || this.onUnhandledMessage, et = j, V = this, ut = this._connectedVersion === N.V1_2 ? et.headers.ack : et.headers["message-id"];
              et.ack = (mt = {}) => V.ack(ut, K, mt), et.nack = (mt = {}) => V.nack(ut, K, mt), st(et);
            },
            // [RECEIPT Frame](https://stomp.github.com/stomp-specification-1.2.html#RECEIPT)
            RECEIPT: (j) => {
              const K = this._receiptWatchers[j.headers["receipt-id"]];
              K ? (K(j), delete this._receiptWatchers[j.headers["receipt-id"]]) : this.onUnhandledReceipt(j);
            },
            // [ERROR Frame](https://stomp.github.com/stomp-specification-1.2.html#ERROR)
            ERROR: (j) => {
              this.onStompError(j);
            }
          }, this._counter = 0, this._subscriptions = {}, this._receiptWatchers = {}, this._partialData = "", this._escapeHeaderValues = !1, this._lastServerActivityTS = Date.now(), this.debug = S.debug, this.stompVersions = S.stompVersions, this.connectHeaders = S.connectHeaders, this.disconnectHeaders = S.disconnectHeaders, this.heartbeatIncoming = S.heartbeatIncoming, this.heartbeatToleranceMultiplier = S.heartbeatGracePeriods, this.heartbeatOutgoing = S.heartbeatOutgoing, this.splitLargeFrames = S.splitLargeFrames, this.maxWebSocketChunkSize = S.maxWebSocketChunkSize, this.forceBinaryWSFrames = S.forceBinaryWSFrames, this.logRawCommunication = S.logRawCommunication, this.appendMissingNULLonIncoming = S.appendMissingNULLonIncoming, this.discardWebsocketOnCommFailure = S.discardWebsocketOnCommFailure, this.onConnect = S.onConnect, this.onDisconnect = S.onDisconnect, this.onStompError = S.onStompError, this.onWebSocketClose = S.onWebSocketClose, this.onWebSocketError = S.onWebSocketError, this.onUnhandledMessage = S.onUnhandledMessage, this.onUnhandledReceipt = S.onUnhandledReceipt, this.onUnhandledFrame = S.onUnhandledFrame, this.onHeartbeatReceived = S.onHeartbeatReceived, this.onHeartbeatLost = S.onHeartbeatLost;
        }
        start() {
          const h = new U(
            // On Frame
            (S) => {
              const j = m.fromRawFrame(S, this._escapeHeaderValues);
              this.logRawCommunication || this.debug(`<<< ${j}`), (this._serverFrameHandlers[j.command] || this.onUnhandledFrame)(j);
            },
            // On Incoming Ping
            () => {
              this.debug("<<< PONG"), this.onHeartbeatReceived();
            }
          );
          this._webSocket.onmessage = (S) => {
            if (this.debug("Received data"), this._lastServerActivityTS = Date.now(), this.logRawCommunication) {
              const j = S.data instanceof ArrayBuffer ? new TextDecoder().decode(S.data) : S.data;
              this.debug(`<<< ${j}`);
            }
            h.parseChunk(S.data, this.appendMissingNULLonIncoming);
          }, this._webSocket.onclose = (S) => {
            this.debug(`Connection closed to ${this._webSocket.url}`), this._cleanUp(), this.onWebSocketClose(S);
          }, this._webSocket.onerror = (S) => {
            this.onWebSocketError(S);
          };
          const E = () => {
            const S = Object.assign({}, this.connectHeaders);
            this.debug("Web Socket Opened..."), S["accept-version"] = this.stompVersions.supportedVersions(), S["heart-beat"] = [
              this.heartbeatOutgoing,
              this.heartbeatIncoming
            ].join(","), this._transmit({ command: "CONNECT", headers: S });
          };
          this._webSocket.readyState === s.StompSocketState.OPEN ? E() : this._webSocket.onopen = E;
        }
        _setupHeartbeat(h) {
          if (h.version !== N.V1_1 && h.version !== N.V1_2 || !h["heart-beat"])
            return;
          const [E, S] = h["heart-beat"].split(",").map((j) => parseInt(j, 10));
          if (this.heartbeatOutgoing !== 0 && S !== 0) {
            const j = Math.max(this.heartbeatOutgoing, S);
            this.debug(`send PING every ${j}ms`), this._pinger = new g(j, this._client.heartbeatStrategy, this.debug), this._pinger.start(() => {
              this._webSocket.readyState === s.StompSocketState.OPEN && (this._webSocket.send(d.LF), this.debug(">>> PING"));
            });
          }
          if (this.heartbeatIncoming !== 0 && E !== 0) {
            const j = Math.max(this.heartbeatIncoming, E);
            this.debug(`check PONG every ${j}ms`), this._ponger = setInterval(() => {
              const K = Date.now() - this._lastServerActivityTS;
              K > j * this.heartbeatToleranceMultiplier && (this.debug(`did not receive server activity for the last ${K}ms`), this.onHeartbeatLost(), this._closeOrDiscardWebsocket());
            }, j);
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
          typeof this._webSocket.terminate != "function" && o(this._webSocket, (h) => this.debug(h)), this._webSocket.terminate();
        }
        _transmit(h) {
          const { command: E, headers: S, body: j, binaryBody: K, skipContentLengthHeader: st } = h, et = new m({
            command: E,
            headers: S,
            body: j,
            binaryBody: K,
            escapeHeaderValues: this._escapeHeaderValues,
            skipContentLengthHeader: st
          });
          let V = et.serialize();
          if (this.logRawCommunication ? this.debug(`>>> ${V}`) : this.debug(`>>> ${et}`), this.forceBinaryWSFrames && typeof V == "string" && (V = new TextEncoder().encode(V)), typeof V != "string" || !this.splitLargeFrames)
            this._webSocket.send(V);
          else {
            let ut = V;
            for (; ut.length > 0; ) {
              const mt = ut.substring(0, this.maxWebSocketChunkSize);
              ut = ut.substring(this.maxWebSocketChunkSize), this._webSocket.send(mt), this.debug(`chunk sent = ${mt.length}, remaining = ${ut.length}`);
            }
          }
        }
        dispose() {
          if (this.connected)
            try {
              const h = Object.assign({}, this.disconnectHeaders);
              h.receipt || (h.receipt = `close-${this._counter++}`), this.watchForReceipt(h.receipt, (E) => {
                this._closeWebsocket(), this._cleanUp(), this.onDisconnect(E);
              }), this._transmit({ command: "DISCONNECT", headers: h });
            } catch (h) {
              this.debug(`Ignoring error during disconnect ${h}`);
            }
          else
            (this._webSocket.readyState === s.StompSocketState.CONNECTING || this._webSocket.readyState === s.StompSocketState.OPEN) && this._closeWebsocket();
        }
        _cleanUp() {
          this._connected = !1, this._pinger && (this._pinger.stop(), this._pinger = void 0), this._ponger && (clearInterval(this._ponger), this._ponger = void 0);
        }
        publish(h) {
          const { destination: E, headers: S, body: j, binaryBody: K, skipContentLengthHeader: st } = h, et = Object.assign({ destination: E }, S);
          this._transmit({
            command: "SEND",
            headers: et,
            body: j,
            binaryBody: K,
            skipContentLengthHeader: st
          });
        }
        watchForReceipt(h, E) {
          this._receiptWatchers[h] = E;
        }
        subscribe(h, E, S = {}) {
          S = Object.assign({}, S), S.id || (S.id = `sub-${this._counter++}`), S.destination = h, this._subscriptions[S.id] = E, this._transmit({ command: "SUBSCRIBE", headers: S });
          const j = this;
          return {
            id: S.id,
            unsubscribe(K) {
              return j.unsubscribe(S.id, K);
            }
          };
        }
        unsubscribe(h, E = {}) {
          E = Object.assign({}, E), delete this._subscriptions[h], E.id = h, this._transmit({ command: "UNSUBSCRIBE", headers: E });
        }
        begin(h) {
          const E = h || `tx-${this._counter++}`;
          this._transmit({
            command: "BEGIN",
            headers: {
              transaction: E
            }
          });
          const S = this;
          return {
            id: E,
            commit() {
              S.commit(E);
            },
            abort() {
              S.abort(E);
            }
          };
        }
        commit(h) {
          this._transmit({
            command: "COMMIT",
            headers: {
              transaction: h
            }
          });
        }
        abort(h) {
          this._transmit({
            command: "ABORT",
            headers: {
              transaction: h
            }
          });
        }
        ack(h, E, S = {}) {
          S = Object.assign({}, S), this._connectedVersion === N.V1_2 ? S.id = h : S["message-id"] = h, S.subscription = E, this._transmit({ command: "ACK", headers: S });
        }
        nack(h, E, S = {}) {
          return S = Object.assign({}, S), this._connectedVersion === N.V1_2 ? S.id = h : S["message-id"] = h, S.subscription = E, this._transmit({ command: "NACK", headers: S });
        }
      }
      class X {
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
        set disconnectHeaders(h) {
          this._disconnectHeaders = h, this._stompHandler && (this._stompHandler.disconnectHeaders = this._disconnectHeaders);
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
        _changeState(h) {
          this.state = h, this.onChangeState(h);
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
        constructor(h = {}) {
          this.stompVersions = N.default, this.connectionTimeout = 0, this.reconnectDelay = 5e3, this._nextReconnectDelay = 0, this.maxReconnectDelay = 900 * 1e3, this.reconnectTimeMode = s.ReconnectionTimeMode.LINEAR, this.heartbeatIncoming = 1e4, this.heartbeatToleranceMultiplier = 2, this.heartbeatOutgoing = 1e4, this.heartbeatStrategy = s.TickerStrategy.Interval, this.splitLargeFrames = !1, this.maxWebSocketChunkSize = 8 * 1024, this.forceBinaryWSFrames = !1, this.appendMissingNULLonIncoming = !1, this.discardWebsocketOnCommFailure = !1, this.state = s.ActivationState.INACTIVE;
          const E = () => {
          };
          this.debug = E, this.beforeConnect = E, this.onConnect = E, this.onDisconnect = E, this.onUnhandledMessage = E, this.onUnhandledReceipt = E, this.onUnhandledFrame = E, this.onHeartbeatReceived = E, this.onHeartbeatLost = E, this.onStompError = E, this.onWebSocketClose = E, this.onWebSocketError = E, this.logRawCommunication = !1, this.onChangeState = E, this.connectHeaders = {}, this._disconnectHeaders = {}, this.configure(h);
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
        configure(h) {
          Object.assign(this, h), this.maxReconnectDelay > 0 && this.maxReconnectDelay < this.reconnectDelay && (this.debug(`Warning: maxReconnectDelay (${this.maxReconnectDelay}ms) is less than reconnectDelay (${this.reconnectDelay}ms). Using reconnectDelay as the maxReconnectDelay delay.`), this.maxReconnectDelay = this.reconnectDelay);
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
          const h = () => {
            if (this.active) {
              this.debug("Already ACTIVE, ignoring request to activate");
              return;
            }
            this._changeState(s.ActivationState.ACTIVE), this._nextReconnectDelay = this.reconnectDelay, this._connect();
          };
          this.state === s.ActivationState.DEACTIVATING ? (this.debug("Waiting for deactivation to finish before activating"), this.deactivate().then(() => {
            h();
          })) : h();
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
          const h = this._createWebSocket();
          this._stompHandler = new F(this, h, {
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
            onConnect: (E) => {
              if (this._connectionWatcher && (clearTimeout(this._connectionWatcher), this._connectionWatcher = void 0), this._nextReconnectDelay = this.reconnectDelay, !this.active) {
                this.debug("STOMP got connected while deactivate was issued, will disconnect now"), this._disposeStompHandler();
                return;
              }
              this.onConnect(E);
            },
            onDisconnect: (E) => {
              this.onDisconnect(E);
            },
            onStompError: (E) => {
              this.onStompError(E);
            },
            onWebSocketClose: (E) => {
              this._stompHandler = void 0, this.state === s.ActivationState.DEACTIVATING && this._changeState(s.ActivationState.INACTIVE), this.onWebSocketClose(E), this.active && this._schedule_reconnect();
            },
            onWebSocketError: (E) => {
              this.onWebSocketError(E);
            },
            onUnhandledMessage: (E) => {
              this.onUnhandledMessage(E);
            },
            onUnhandledReceipt: (E) => {
              this.onUnhandledReceipt(E);
            },
            onUnhandledFrame: (E) => {
              this.onUnhandledFrame(E);
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
          let h;
          if (this.webSocketFactory)
            h = this.webSocketFactory();
          else if (this.brokerURL)
            h = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
          else
            throw new Error("Either brokerURL or webSocketFactory must be provided");
          return h.binaryType = "arraybuffer", h;
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
        async deactivate(h = {}) {
          const E = h.force || !1, S = this.active;
          let j;
          if (this.state === s.ActivationState.INACTIVE)
            return this.debug("Already INACTIVE, nothing more to do"), Promise.resolve();
          if (this._changeState(s.ActivationState.DEACTIVATING), this._nextReconnectDelay = 0, this._reconnector && (clearTimeout(this._reconnector), this._reconnector = void 0), this._stompHandler && // @ts-ignore - if there is a _stompHandler, there is the webSocket
          this.webSocket.readyState !== s.StompSocketState.CLOSED) {
            const K = this._stompHandler.onWebSocketClose;
            j = new Promise((st, et) => {
              this._stompHandler.onWebSocketClose = (V) => {
                K(V), st();
              };
            });
          } else
            return this._changeState(s.ActivationState.INACTIVE), Promise.resolve();
          return E ? this._stompHandler?.discardWebsocket() : S && this._disposeStompHandler(), j;
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
        publish(h) {
          this._checkConnection(), this._stompHandler.publish(h);
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
        watchForReceipt(h, E) {
          this._checkConnection(), this._stompHandler.watchForReceipt(h, E);
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
        subscribe(h, E, S = {}) {
          return this._checkConnection(), this._stompHandler.subscribe(h, E, S);
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
        unsubscribe(h, E = {}) {
          this._checkConnection(), this._stompHandler.unsubscribe(h, E);
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
        begin(h) {
          return this._checkConnection(), this._stompHandler.begin(h);
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
        commit(h) {
          this._checkConnection(), this._stompHandler.commit(h);
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
        abort(h) {
          this._checkConnection(), this._stompHandler.abort(h);
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
        ack(h, E, S = {}) {
          this._checkConnection(), this._stompHandler.ack(h, E, S);
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
        nack(h, E, S = {}) {
          this._checkConnection(), this._stompHandler.nack(h, E, S);
        }
      }
      class at {
      }
      class Y {
      }
      class Q {
        constructor(h) {
          this.client = h;
        }
        get outgoing() {
          return this.client.heartbeatOutgoing;
        }
        set outgoing(h) {
          this.client.heartbeatOutgoing = h;
        }
        get incoming() {
          return this.client.heartbeatIncoming;
        }
        set incoming(h) {
          this.client.heartbeatIncoming = h;
        }
      }
      class W extends X {
        /**
         * Available for backward compatibility, please shift to using {@link Client}
         * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
         *
         * **Deprecated**
         *
         * @internal
         */
        constructor(h) {
          super(), this.maxWebSocketFrameSize = 16 * 1024, this._heartbeatInfo = new Q(this), this.reconnect_delay = 0, this.webSocketFactory = h, this.debug = (...E) => {
            console.log(...E);
          };
        }
        _parseConnect(...h) {
          let E, S, j, K = {};
          if (h.length < 2)
            throw new Error("Connect requires at least 2 arguments");
          return typeof h[1] == "function" ? [K, S, j, E] = h : h.length === 6 ? [
            K.login,
            K.passcode,
            S,
            j,
            E,
            K.host
          ] = h : [
            K.login,
            K.passcode,
            S,
            j,
            E
          ] = h, [K, S, j, E];
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
        connect(...h) {
          const E = this._parseConnect(...h);
          E[0] && (this.connectHeaders = E[0]), E[1] && (this.onConnect = E[1]), E[2] && (this.onStompError = E[2]), E[3] && (this.onWebSocketClose = E[3]), super.activate();
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
        disconnect(h, E = {}) {
          h && (this.onDisconnect = h), this.disconnectHeaders = E, super.deactivate();
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
        send(h, E = {}, S = "") {
          E = Object.assign({}, E);
          const j = E["content-length"] === !1;
          j && delete E["content-length"], this.publish({
            destination: h,
            headers: E,
            body: S,
            skipContentLengthHeader: j
          });
        }
        /**
         * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
         *
         * **Deprecated**
         */
        set reconnect_delay(h) {
          this.reconnectDelay = h;
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
        set onreceive(h) {
          this.onUnhandledMessage = h;
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
        set onreceipt(h) {
          this.onUnhandledReceipt = h;
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
        set heartbeat(h) {
          this.heartbeatIncoming = h.incoming, this.heartbeatOutgoing = h.outgoing;
        }
      }
      class nt {
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
        static client(h, E) {
          E == null && (E = N.default.protocolVersions());
          const S = () => {
            const j = nt.WebSocketClass || WebSocket;
            return new j(h, E);
          };
          return new W(S);
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
        static over(h) {
          let E;
          return typeof h == "function" ? E = h : (console.warn("Stomp.over did not receive a factory, auto reconnect will not work. Please see https://stomp-js.github.io/api-docs/latest/classes/Stomp.html#over"), E = () => h), new W(E);
        }
      }
      nt.WebSocketClass = null, s.Client = X, s.CompatClient = W, s.FrameImpl = m, s.Parser = U, s.Stomp = nt, s.StompConfig = at, s.StompHeaders = Y, s.Versions = N;
    }));
  })(ec, ec.exports)), ec.exports;
}
var R1 = /* @__PURE__ */ N1();
const av = 48, dl = (i, r = 0) => {
  const s = new Int32Array(i.length);
  for (let o = 0; o < i.length; o++) s[o] = i.charCodeAt(o) - av - r;
  return s;
}, Yr = (i) => {
  const r = new Int32Array(i.length + 1);
  for (let s = 0; s < i.length; s++) r[s + 1] = r[s] + i[s];
  return r;
}, _a = (i) => {
  const r = new Int32Array(i.length);
  let s = 0;
  for (let o = 0; o < i.length; o++) {
    const d = i.charCodeAt(o) - av;
    s += d >>> 1 ^ -(d & 1), r[o] = s;
  }
  return r;
}, z1 = 384, D1 = [], nu = Yr(dl("E0500002005282000000002000150000020021820000011200000003022202000300004200120000200420001200021200301200010400162000010000220021010:2192001200220012000220012000200200200400010200040000000000400200108200110100000022010313000162002000020020012020080213000228200000000082000000000120002000120020020040101020300130001001010")), x1 = Yr(dl(":11111111211111119311546544411119731869:671397415686432441111111111161114151214313433415:78311132233313187211117221449443411141111151152226611131111112212518142224214215421421542142424242516171151615616347111111111197911327451111111111111111111113134714133513411111311111111111111111111112444411111342312715245411117:3")), M1 = "@containerabcdefghinlmoprstunderlineviawzccentlignnimatespectuto-colsrowsaglorightnessckdrop-sisbcontrastfiltergrayscalehue-rotateinvertopacityslurrightnessaturateepia-coniclinearpositionradialsizeockurrderttom-belrstxyespacing-xyaretoursorlnt-umnsendspantartainentrasteividerop-shadowurationcorationlay-xyasendillexontromlter-featuresstretchapr-xyayscaleidow-colsrowsue-rotatedentlinesetvert-beringsxyeshadoweiadingftnest-clamp-imageabein-lrstxyskx--b-coniclpositionrsizet-x-y-fromto-fromto-inearfromto-fromto-adialfromto-fromtofromtofromtofromtoblockhinlinew-screenesblockhinlinewbjectpacityrutlinederigin-offsetbelrstxyesrspective-originaceholderioghtng-offsettateundedw-xyz-belrstlreseslr-endspantartaturatecepiahizekewpace-taleroll-xyz-barmpbelrstxyesbelrstxyes-thumbrackadowrink-xyxyartrokeabextora-shadowpckingnsformitionlate-xyz-offsetill-changeoom", w1 = (() => {
  const i = nu.length - 1, r = new Int32Array(i);
  for (let d = i - 1; d >= 0; d--) {
    let m = 1, _ = d + 1;
    for (let T = nu[d]; T < nu[d + 1]; T++)
      m += r[_], _ += r[_];
    r[d] = m;
  }
  const s = new Int32Array(nu[i]);
  let o = 0;
  for (let d = 0; d < i; d++) {
    let m = d + 1;
    for (let _ = nu[d]; _ < nu[d + 1]; _++)
      s[o++] = m, m += r[m];
  }
  return s;
})(), U1 = dl("02000000000000900<=0?000B000F00F00ŏI0J0LNPRTVX0000]_a00000000000000000000000rst0000000zŏ00000000000ŏ0000000ŏ00000000000000000000000000000000000000000000000000000000000000Ë000000000000000000000Þ000000000000000000ð0000000ø0ùúûüýþÿĀāĂăĄąĆ000000000000000000000000000000000000000000ħ0ĨĪ00000000000000000000ļĽ00000Ŭ000000", 1), H1 = Yr(dl("123333359346463635126536711576")), j1 = dl("93203242332583253248325D>E?F@03263243255B:032523853:0325B:8GA032542H<C=12727B:0328432553;D>E?3257D>032585:0325B:;0328B:032"), B1 = dl("012113445661666666789111:5;;;;;;;;444;;;:62999<1161=62>>?61:21@ABCD4446996:64E:::;:?::64:F114GHHIHHHHIHH1HH1HH1HHHHHH::EEJ4444::EE4444441691;644444114244444:;K6666555555555555555999666664444444444444444444444226?6:66644L9M?D:111::::6DE199"), L1 = _a("020200202020020020020020020020200200200200200200200002020202001003040106000200200200200200200200200200200200200200200200200200200200200200200200200200200200020020020020020020002020200202002002002002002002002002002020002002020020200220200200200200200200200200200200020020020000200020002000200200200020020020002000200200200020020202002020202000200200020022000200200020020002002000200220002002000200W0Z00020020002002020002002000200g0j0002002000200200020020002002000200200020020002000200002000002002002002002000200020000200002002002002002002002020020020200200200200200200200200202020020020020020020020020002002002020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020002002002002002002000200200200200200200200200200020202020002000200020002002002002000020200200"), V1 = (() => {
  const i = (/* @__PURE__ */ new Int32Array(319)).fill(-1), r = _a("02422242:222222242224222242442222222422222244442242226224222426222422442462222422622222222626222462242622422622422424242422222222422222222242422222222222222222622442224222222222222224424442262222222222222222222226224222424242422224422422422222"), s = _a("02222222222222222222202222222222222222222222221422222222222222222222222222222222222Y\\222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222221422222222222222222222222222222222222222Ŀł222222222222222222");
  for (let o = 0; o < r.length; o++) i[r[o]] = s[o];
  return i;
})(), q1 = "container |break-after- all auto avoid avoid-page column left page right|break-before- all auto avoid avoid-page column left page right|break-inside-a uto void void-column void-page|box-decoration- clone slice|box- border content| contents flow-root hidden table table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group| not-sr-only sr-only|float- end left none right start|clear- both end left none right start|isolat e ion-auto|overflow- auto clip hidden scroll visible|overflow-x- auto clip hidden scroll visible|overflow-y- auto clip hidden scroll visible|overscroll- auto contain none|overscroll-x- auto contain none|overscroll-y- auto contain none| absolute fixed relative static sticky| collapse invisible visible|justify- around baseline between center center-safe end end-safe evenly normal start stretch|justify-items- center center-safe end end-safe normal start stretch|justify-self- auto center center-safe end end-safe start stretch|items- baseline baseline-last center center-safe end end-safe start stretch|self- auto baseline baseline-last center center-safe end end-safe start stretch|place-content- around baseline between center center-safe end end-safe evenly start stretch|place-items- baseline center center-safe end end-safe start stretch|place-self- auto center center-safe end end-safe start stretch| antialiased subpixel-antialiased| italic not-italic|normal-nums |ordinal |slashed-zero | lining-nums oldstyle-nums| proportional-nums tabular-nums| diagonal-fractions stacked-fractions| no-underline overline| capitalize lowercase normal-case uppercase|truncate |whitespace- break-spaces normal nowrap pre pre-line pre-wrap|break- all keep normal words|wrap- anywhere break-word normal|hyphens- auto manual none|mix-blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay plus-darker plus-lighter saturation screen soft-light|table- auto fixed|caption- bottom top|backface- hidden visible|appearance- auto none|scheme- dark light light-dark normal only-dark only-light|field-sizing- content fixed|pointer-events- auto none|resize  -none -x -y|snap- align-none center end start|snap- always normal|snap- both none x y|snap- mandatory proximity|touch- auto manipulation none|touch-pan- left right x|touch-pan- down up y|touch-pinch-zoom |select- all auto none text|forced-color-adjust- auto none| normal size| baseline bottom middle sub super text-bottom text-top top| bounce none ping pulse spin| auto square video| auto fr max min px|none | auto full px| fixed local scroll|clip- border content padding text|origin- border content padding| bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| no-repeat repeat repeat-round repeat-space repeat-x repeat-y| auto contain cover| gradient-to-b gradient-to-bl gradient-to-br gradient-to-l gradient-to-r gradient-to-t gradient-to-tl gradient-to-tr none|blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay saturation screen soft-light|to- b bl br l r t tl tr| auto dvh fit full lh lvh max min px screen svh| dashed dotted double hidden none solid| collapse separate|px |auto |full | content none strict| inline-size size|layout |paint |style | around baseline between center center-safe end end-safe evenly normal start stretch| alias all-scroll auto cell col-resize context-menu copy crosshair default e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize no-drop none not-allowed ns-resize nw-resize nwse-resize pointer progress row-resize s-resize se-resize sw-resize text vertical-text w-resize wait zoom-in zoom-out| dashed dotted double solid wavy| auto from-font|reverse |initial | in in-out initial linear out| col col-reverse row row-reverse| nowrap wrap wrap-reverse| auto initial none| black bold extrabold extralight light medium normal semibold thin| condensed expanded extra-condensed extra-expanded normal semi-condensed semi-expanded ultra-condensed ultra-expanded|flow- col col-dense dense row row-dense| none subgrid| auto dvh dvw fit full lh lvh lvw max min px screen svh svw| block flex grid table| auto dvw fit full lvw max min px screen svw| loose none normal px relaxed snug tight|through |item | inside outside| decimal disc none| auto px| clip-border clip-content clip-fill clip-padding clip-stroke clip-view no-clip| add exclude intersect subtract| alpha luminance match|origin- border content fill padding stroke view|type- alpha luminance| circle ellipse| closest-corner closest-side farthest-corner farthest-side|at- bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| dvh fit full lh lvh max min none px screen svh| auto dvh dvw fit full lh lvh lvw max min none px screen svh svw| dvw fit full lvw max min none px screen svw| auto dvh dvw fit full lvh lvw max min none prose px svh svw| auto dvh dvw fit full lvh lvw max min none px screen svh svw| contain cover fill none scale-down| first last none| distant dramatic midrange near none normal|inset | full none|3d | auto smooth|gutter- auto both stable| auto none thin| inner none| auto dvh dvw fit full lvh lvw max min px svh svw|base | center end justify left right start| clip ellipsis| balance nowrap pretty wrap| normal tight tighter wide wider widest| cpu gpu none| 3d flat| all colors none opacity shadow transform| discrete normal| full px| auto dvh dvw fit full lvh lvw max min px screen svh svw| auto contents scroll transform".split("|").map((i) => {
  const r = i.split(" "), s = r.shift();
  for (let o = 0; o < r.length; o++) r[o] = s + r[o];
  return r;
}), i2 = _a("0000000000000000000000000000000000000000000000000000000000000262242:6@200000006:240B428:4422400002046044222426220026642642462026224222824220022400000000\\00N222422242222222224062242222222422226264222422222222222222442804222422222222222222222222220<4<0204260002444020204224422"), G1 = _a("ɠ222222222222222222222222222222222222222222222222222222222222˕4222226>ʶ22ʷʺʷ2ʸʷ42ʴ2ʓ22>621422ɶ222ɹɼɷɺɷɺ22ɱ42222ɨ2ɧ26622ɘɓ244ƸƵ222]d24242ǖǓƚÄȫ2263ȨȥȨ2222222ǣ222222222222222222ǂƽ2ƾƵ2222222422222ƜƑ22222222222222222222144Ŧţ22Ţş222222222222222222222ĸ2ı68ĦģĦɡŰ4Ġ«®ĝ822ĔđĔ2ē2222622"), Y1 = _a("02222222222222222222222222222222222222222222222222222222222222222202022222222222EH2200IL021042222Y\\222IL0cf2e10j2222U00X202[^2y0000120|{~22:22|22222222222G000qOVI00000}2>40000B00000I¨©000¬00000000000000021M®­00°000000000000000000000222HGHa1º222¿2À2222ÉÌ000­°2±"), uv = /* @__PURE__ */ new Int32Array(995), iv = /* @__PURE__ */ new Int32Array(995), cv = /* @__PURE__ */ new Int32Array(995);
let Df = "";
const xf = /* @__PURE__ */ new Int32Array(1038);
{
  const i = /* @__PURE__ */ new Map();
  let r = 0, s = 0;
  for (let o = 0; o < i2.length; o++) for (const d of q1[Y1[o]]) {
    let m = i.get(d);
    m === void 0 && (m = r++, i.set(d, m), xf[m * 2] = Df.length, xf[m * 2 + 1] = d.length, Df += d), uv[s] = i2[o], iv[s] = G1[o], cv[s] = m, s++;
  }
}
const X1 = _a("0b2N:222@R>F@286¦2@H2D266226FB22B2>BD\\6N22222Z222D222p"), Q1 = Yr(dl("1::24444432:442:44:44>222222:44:4421322511111311111114")), k1 = _a("24A;33N=C@H4A;33N=C@<27;83:;8393NQ:3NQʰ222ˉºŴŽ2R2=18cƴÅŇ=cĞÛC1ƈǝȈ:ħ25=11D3A@4=<1;1DEr25;11B3?<6;:371BCn9@7=<8192>2E121@9@EHE@9>2T25511<398454131<=V25511<398454131<=ƧNž2Đå242L222290000f22500ɛ000ǘ222"), Z1 = dl("ĳ"), K1 = dl(""), J1 = dl("1"), I1 = "* ** after backdrop before details-content file first-letter first-line marker placeholder selection";
var F1 = {
  GROUP_COUNT: z1,
  customValidatorNames: D1,
  edgeStart: nu,
  labelStart: x1,
  labelText: M1,
  edgeTarget: w1,
  nodeGroup: U1,
  nodeVlist: V1,
  vlistPat: H1,
  vlistOps: j1,
  vlistRef: B1,
  vlistGroup: L1,
  litAnchor: uv,
  litGroup: iv,
  litPool: cv,
  poolOffsets: xf,
  poolText: Df,
  adjGid: X1,
  adjStart: Q1,
  adjTgt: k1,
  patGid: Z1,
  patTgt: K1,
  postfixLookupGroups: J1,
  orderSensitiveModifiers: I1
};
const W1 = "line" in /* @__PURE__ */ new Error(), ol = -1, tu = -1, yf = (i, r, s) => {
  let o = 2166136261;
  for (let d = r; d < s; d++) o = Math.imul(o ^ i.charCodeAt(d), 16777619);
  return o;
}, jr = (i, r, s) => {
  const o = s - r;
  let d = Math.imul(o, 2654435761) ^ i.charCodeAt(r);
  if (o > 3) {
    const m = o >> 2, _ = o >> 1;
    d = Math.imul(d ^ i.charCodeAt(r + 1) << 8 ^ i.charCodeAt(r + 2) << 16 ^ i.charCodeAt(r + m), 2246822507), d = Math.imul(d ^ i.charCodeAt(r + _) << 8 ^ i.charCodeAt(r + _ + m) << 16 ^ i.charCodeAt(s - 3), 3266489909), d ^= i.charCodeAt(s - 2) << 8 ^ i.charCodeAt(s - 1) << 16;
    for (let T = r + 3, R = s - 4; T < r + 8 && T < R; T++, R--) d = Math.imul(d ^ i.charCodeAt(T) ^ i.charCodeAt(R) << 8, 16777619);
  }
  return d ^ d >>> 15 | 0;
}, $1 = (i, r, s = {}) => {
  const { GROUP_COUNT: o, edgeStart: d, labelStart: m, labelText: _, edgeTarget: T, nodeGroup: R, nodeVlist: B, vlistPat: U, vlistOps: g, vlistRef: N, vlistGroup: F, litAnchor: X, litGroup: at, litPool: Y, poolOffsets: Q, poolText: W, adjGid: nt, adjStart: G, adjTgt: h, patGid: E, patTgt: S, postfixLookupGroups: j, customValidatorNames: K, orderSensitiveModifiers: st } = i, et = new Int32Array(o).fill(-1);
  for (let x = 0; x < nt.length; x++) et[nt[x]] = x;
  let V = 0;
  for (let x = 0; x + 1 < G.length; x++) {
    const Z = G[x + 1] - G[x];
    Z > V && (V = Z);
  }
  let ut = 32;
  for (; ut < 2 * (1 + V + E.length); ) ut <<= 1;
  const mt = new Int32Array(N.length + 1);
  for (let x = 0; x < N.length; x++) mt[x + 1] = mt[x] + U[N[x] + 1] - U[N[x]];
  const vt = new Uint8Array(o);
  for (let x = 0; x < j.length; x++) vt[j[x]] = 1;
  const I = d.length - 1, P = new Uint8Array(I);
  let lt = 0, At = !0;
  for (let x = 0; x < X.length; x++) {
    P[X[x]] = 1;
    const Z = Q[Y[x] * 2 + 1];
    Z > lt && (lt = Z);
    const J = W.charCodeAt(Q[Y[x] * 2]);
    (J === 91 || J === 40) && (At = !1);
  }
  let ft = 1;
  for (; ft < X.length * 2; ) ft <<= 1;
  const Ht = new Int32Array(ft).fill(-1);
  for (let x = 0; x < X.length; x++) {
    const Z = Q[Y[x] * 2];
    let J = (yf(W, Z, Z + Q[Y[x] * 2 + 1]) ^ Math.imul(X[x], 2654435761) | 0) & ft - 1;
    for (; Ht[J] !== -1; ) J = J + 1 & ft - 1;
    Ht[J] = x;
  }
  const fe = (x, Z, J, dt) => {
    let Ot = (yf(Z, J, dt) ^ Math.imul(x, 2654435761) | 0) & ft - 1;
    const Tt = dt - J;
    for (; ; ) {
      const wt = Ht[Ot];
      if (wt === -1) return -1;
      if (X[wt] === x && Q[Y[wt] * 2 + 1] === Tt) {
        const $t = Q[Y[wt] * 2];
        let Kt = !0;
        for (let bt = 0; bt < Tt; bt++) if (W.charCodeAt($t + bt) !== Z.charCodeAt(J + bt)) {
          Kt = !1;
          break;
        }
        if (Kt) return at[wt];
      }
      Ot = Ot + 1 & ft - 1;
    }
  }, ce = s.cacheSize ?? 8192, b = s.prefix ?? i.prefix ?? "", k = b === "" ? "" : b + ":", tt = k.length, rt = (K ?? []).map((x) => {
    throw new Error("cn: missing validator " + x);
  }), Rt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, zt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, gt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ct = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  let w = 0, Et = -1, Mt = -1, kt = -1, ae = -1;
  const ee = (x) => x >= 97 && x <= 122 || x >= 65 && x <= 90 || x >= 48 && x <= 57 || x === 95, jt = (x) => /\s/.test(String.fromCharCode(x)), Ze = (x, Z, J) => {
    if (w = 0, Et = -1, J - Z < 3) return;
    const dt = x.charCodeAt(Z), Ot = x.charCodeAt(J - 1);
    if (dt === 91 && Ot === 93) w = 1;
    else if (dt === 40 && Ot === 41) w = 2;
    else return;
    kt = Z + 1, ae = J - 1;
    let Tt = Z + 1;
    if (ee(x.charCodeAt(Tt))) {
      for (Tt++; Tt < J - 1; ) {
        const wt = x.charCodeAt(Tt);
        if (!ee(wt) && wt !== 45) break;
        Tt++;
      }
      Tt < J - 2 && x.charCodeAt(Tt) === 58 && (Et = Z + 1, Mt = Tt, kt = Tt + 1);
    }
  }, on = (x, Z, J, dt) => {
    if (J - Z !== dt.length) return !1;
    for (let Ot = 0; Ot < dt.length; Ot++) if (x.charCodeAt(Z + Ot) !== dt.charCodeAt(Ot)) return !1;
    return !0;
  }, _n = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, hl = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Bn = (x) => !!x && !Number.isNaN(Number(x)), Ln = (x, Z, J) => {
    if (J - Z < 11 || !on(x, Z, Z + 10, "@container")) return !1;
    if (x.charCodeAt(Z + 10) === 47) return J - Z >= 12;
    const dt = x.charCodeAt(Z + 11);
    return dt === 115 && J - Z >= 17 && on(x, Z + 10, Z + 16, "-size/") || dt === 110 && J - Z >= 19 && on(x, Z + 10, Z + 18, "-normal/");
  }, Bl = [
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
  ], ml = "length|number|number weight|family-name|position percentage|length size bg-size|image url|shadow|length|family-name|position percentage|length size bg-size|image url|shadow|number weight".split("|").map((x) => x.split(" ")), Ll = [
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
  ], Ca = (x, Z, J, dt) => {
    if (x >= 10) {
      if (x >= 25) return rt[x - 25](Z.slice(J, dt));
      const Ot = x - 10;
      if (w !== Bl[Ot]) return !1;
      if (Et >= 0) {
        for (const Tt of ml[Ot]) if (on(Z, Et, Mt, Tt)) return !0;
        return !1;
      }
      switch (Ll[Ot]) {
        case 0:
          return !1;
        case 1:
          return !0;
        case 2: {
          const Tt = Z.slice(kt, ae);
          return Rt.test(Tt) && !zt.test(Tt);
        }
        case 3:
          return Bn(Z.slice(kt, ae));
        case 4:
          return ct.test(Z.slice(kt, ae));
        default:
          return gt.test(Z.slice(kt, ae));
      }
    }
    switch (x) {
      case 0:
        return !0;
      case 1:
        return w === 0;
      case 2:
        return w === 1;
      case 3:
        return w === 2;
      case 4:
        return _n.test(Z.slice(J, dt));
      case 5:
        return Bn(Z.slice(J, dt));
      case 6: {
        const Ot = Z.slice(J, dt);
        return !!Ot && Number.isInteger(Number(Ot));
      }
      case 7:
        return dt > J && Z.charCodeAt(dt - 1) === 37 && Bn(Z.slice(J, dt - 1));
      case 8:
        return hl.test(Z.slice(J, dt));
      default:
        return Ln(Z, J, dt);
    }
  }, Tn = new Set(typeof st == "string" ? st.split(" ") : st), pt = (x, Z, J, dt, Ot, Tt) => {
    const wt = yf(Z, J, dt) ^ (Ot ? 2654435769 : 0) | 0;
    let $t = x.get(wt);
    if ($t !== void 0) t: for (let Nt = 0; Nt < $t.length; Nt++) {
      const Qt = $t[Nt];
      if (!(Qt.imp !== Ot || Qt.k.length !== dt - J)) {
        for (let yt = 0; yt < Qt.k.length; yt++) if (Qt.k.charCodeAt(yt) !== Z.charCodeAt(J + yt)) continue t;
        return Qt.id;
      }
    }
    else x.set(wt, $t = []);
    const Kt = Z.slice(J, dt), bt = Tt(Kt);
    return $t.push({
      k: Kt,
      imp: Ot,
      id: bt
    }), bt;
  };
  let _t = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), me = 2;
  const Cn = 4096, Oe = (x, Z) => {
    const J = [];
    let dt = 0, Ot = 0, Tt = 0;
    for (let bt = 0; bt < x.length; bt++) {
      const Nt = x.charCodeAt(bt);
      dt === 0 && Ot === 0 && Nt === 58 ? (J.push(x.slice(Tt, bt)), Tt = bt + 1) : Nt === 91 ? dt++ : Nt === 93 ? dt-- : Nt === 40 ? Ot++ : Nt === 41 && Ot--;
    }
    J.push(x.slice(Tt));
    let wt = J[0];
    if (J.length > 1) {
      const bt = [];
      let Nt = [];
      for (const Qt of J) Qt.charCodeAt(0) === 91 || Tn.has(Qt) ? (Nt.length && (bt.push(...Nt.sort()), Nt = []), bt.push(Qt)) : Nt.push(Qt);
      Nt.length && bt.push(...Nt.sort()), wt = bt.join(":");
    }
    const $t = Z ? wt + " !" : wt;
    let Kt = Gt.get($t);
    return Kt === void 0 && Gt.set($t, Kt = me++), Kt;
  };
  let uu = /* @__PURE__ */ new Map(), iu = o;
  const Xr = o + 4096, Ke = () => iu++, oc = 2097152, Vl = 8192, cu = new Int32Array(Vl), en = new Array(Vl).fill(null), sc = new Int32Array(Vl), ui = new Int32Array(Vl), fc = new Uint8Array(Vl);
  let dc = 0;
  const ql = (x, Z, J, dt, Ot, Tt, wt, $t) => {
    let Kt = x;
    if (en[x] !== null)
      if (en[x | 1] === null) Kt = x | 1;
      else if ((dc++ & 3) === 0) Kt = x | dc >> 2 & 1;
      else return;
    en[Kt] = Z.slice(J, dt), cu[Kt] = Ot, sc[Kt] = Tt, ui[Kt] = wt, fc[Kt] = $t;
  }, Xe = () => en.fill(null);
  let ye = 256, Ne = [
    new Int32Array(ye),
    new Int32Array(ye),
    new Int32Array(ye),
    new Int32Array(ye)
  ], [Gl, Yl, Xl, vl] = Ne, $n = new Uint8Array(ye), Vn = new Uint8Array(ye);
  const gl = () => {
    ye *= 2, Ne = Ne.map((Z) => {
      const J = new Int32Array(ye);
      return J.set(Z), J;
    }), [Gl, Yl, Xl, vl] = Ne;
    const x = new Uint8Array(ye);
    x.set($n), $n = x, Vn = new Uint8Array(ye);
  };
  let qn = 64, Gn = new Int32Array(qn), Ql = new Int32Array(qn);
  const ii = new Int32Array(o);
  let Yn = 2048, ru = 21, yl = new Float64Array(Yn), ou = new Int32Array(Yn), Xn = 0;
  const su = (x, Z) => {
    if (x === 0 && Z < o)
      return ii[Z] === Xn ? 1 : (ii[Z] = Xn, 0);
    const J = x * 2097152 + Z + 1;
    let dt = Math.imul(J, 2654435761) >>> ru;
    for (; ou[dt] === Xn; ) {
      if (yl[dt] === J) return 1;
      dt = dt + 1 & Yn - 1;
    }
    return yl[dt] = J, ou[dt] = Xn, 0;
  }, Aa = (x, Z, J, dt, Ot) => {
    if (J - Z >= 2 && x.charCodeAt(Z) === 91 && x.charCodeAt(J - 1) === 93) {
      let Tt = -1;
      for (let wt = Z + 1; wt < J - 1; wt++) if (x.charCodeAt(wt) === 58) {
        Tt = wt;
        break;
      }
      return Tt === -1 || Tt === Z + 1 ? ol : pt(uu, x, Z + 1, Tt, 0, Ke);
    }
    if (dt >= 0 && R[dt] >= 0) return R[dt];
    for (let Tt = Ot - 1; Tt >= 0; Tt--) {
      const wt = Ql[Tt];
      if (wt > J) continue;
      const $t = Gn[Tt], Kt = J - wt;
      if (P[$t] === 1 && Kt > 0 && Kt <= lt) {
        const oe = x.charCodeAt(wt);
        if (At === !1 || oe !== 91 && oe !== 40) {
          const fn = fe($t, x, wt, J);
          if (fn >= 0) return fn;
        }
      }
      const bt = B[$t];
      if (bt < 0) continue;
      const Nt = N[bt], Qt = U[Nt], yt = U[Nt + 1];
      if (Qt === yt) continue;
      Ze(x, wt, J);
      const Ce = mt[bt] - Qt;
      for (let oe = Qt; oe < yt; oe++) if (Ca(g[oe], x, wt, J)) return F[Ce + oe];
    }
    return ol;
  }, kl = (x) => {
    const Z = x.length;
    let J = 0, dt = 0, Ot = !1;
    (me > Cn || _t.size > Cn) && (_t = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), me = 2, Xe()), iu > Xr && (uu = /* @__PURE__ */ new Map(), iu = o, Xe());
    let Tt = 0;
    for (; Tt < Z; ) {
      let bt = x.charCodeAt(Tt);
      if (bt === 32 || bt >= 9 && bt <= 13 || bt >= 160 && jt(bt)) {
        bt !== 32 && (Ot = !0), Tt++;
        continue;
      }
      const Nt = Tt;
      let Qt = 0;
      for (; Tt < Z; ) {
        if (bt = x.charCodeAt(Tt), bt <= 32) {
          if (bt === 32) break;
          if (bt >= 9 && bt <= 13) {
            Ot = !0;
            break;
          }
        } else if (bt >= 160 && jt(bt)) {
          Ot = !0;
          break;
        }
        Qt = Math.imul(Qt ^ bt, 16777619), Tt++;
      }
      const yt = Tt, Ce = yt - Nt;
      J === ye && gl();
      const oe = J++;
      Gl[oe] = Nt, Yl[oe] = yt, dt += Ce, Qt ^= Math.imul(Ce, 2654435761);
      const fn = Qt ^ Qt >>> 15 | 0, be = fn & 8190;
      {
        let Yt = -1;
        if (cu[be] === fn && en[be] !== null && en[be].length === Ce ? Yt = be : cu[be | 1] === fn && en[be | 1] !== null && en[be | 1].length === Ce && (Yt = be | 1), Yt >= 0) {
          const Re = en[Yt];
          let Nn = !0;
          for (let mn = 0; mn < Ce; mn++) if (Re.charCodeAt(mn) !== x.charCodeAt(Nt + mn)) {
            Nn = !1;
            break;
          }
          if (Nn) {
            Xl[oe] = sc[Yt], vl[oe] = ui[Yt], $n[oe] = fc[Yt];
            continue;
          }
        }
      }
      let pe = Nt;
      if (tt !== 0) {
        if (yt - Nt <= tt || !x.startsWith(k, Nt)) {
          Xl[oe] = ol, ql(be, x, Nt, yt, fn, ol, 0, 0);
          continue;
        }
        pe = Nt + tt;
      }
      let vu = 0, ri = 0, bl = -1, gu = -1;
      for (let Yt = pe; Yt < yt; Yt++) {
        const Re = x.charCodeAt(Yt);
        if (vu === 0 && ri === 0) {
          if (Re === 58) {
            bl = Yt;
            continue;
          }
          if (Re === 47) {
            gu = Yt;
            continue;
          }
        }
        Re === 91 ? vu++ : Re === 93 ? vu-- : Re === 40 ? ri++ : Re === 41 && ri--;
      }
      const hc = bl >= pe ? bl + 1 : pe;
      let ue = hc, Qe = yt, Kl = !1, yu = 0;
      Qe > ue && x.charCodeAt(Qe - 1) === 33 ? (Kl = !0, Qe--) : Qe > ue && x.charCodeAt(ue) === 33 && (Kl = !0, ue++, yu = 1);
      let nn = -1;
      gu > hc && (nn = gu + yu, nn >= Qe && (nn = -1));
      let bu = ue;
      Qe - ue > 1 && x.charCodeAt(ue) === 45 && (bu = ue + 1);
      let dn = 0, Je = 0, Jl = 0, oi = -1, hn = 0;
      (B[0] >= 0 || P[0] === 1) && (Gn[0] = 0, Ql[0] = bu, hn = 1);
      let za = tu, si = 0;
      for (let Yt = bu; Yt < Qe; Yt++)
        if (Yt === nn && (za = Je < Jl ? tu : dn, si = hn), dn !== tu) {
          const Re = x.charCodeAt(Yt);
          let Nn = -1;
          if (Je < Jl)
            _.charCodeAt(Je) === Re ? (Je++, Je === Jl && (Nn = dn = oi)) : dn = tu;
          else {
            const mn = d[dn], Ma = d[dn + 1];
            let pl = tu;
            for (let je = mn; je < Ma; je++) {
              const wa = m[je];
              if (_.charCodeAt(wa) === Re) {
                m[je + 1] - wa === 1 ? Nn = pl = T[je] : (Je = wa + 1, Jl = m[je + 1], oi = T[je], pl = dn);
                break;
              }
            }
            dn = pl;
          }
          if (Nn >= 0 && (B[Nn] >= 0 || P[Nn] === 1) && Yt + 1 < Qe && x.charCodeAt(Yt + 1) === 45) {
            if (hn === qn) {
              qn *= 2;
              const mn = new Int32Array(qn);
              mn.set(Gn), Gn = mn;
              const Ma = new Int32Array(qn);
              Ma.set(Ql), Ql = Ma;
            }
            Gn[hn] = Nn, Ql[hn] = Yt + 2, hn++;
          }
        }
      nn === Qe && (za = Je < Jl ? tu : dn, si = hn);
      const fi = Je < Jl ? tu : dn;
      let He, Ie = !1;
      if (nn >= 0)
        if (Ie = !0, He = Aa(x, ue, nn, za, si), He !== ol && He < o && vt[He]) {
          const Yt = Aa(x, ue, Qe, fi, hn);
          Yt !== ol && Yt !== He && (He = Yt, Ie = !1);
        } else He === ol && (He = Aa(x, ue, Qe, fi, hn), Ie = !1);
      else He = Aa(x, ue, Qe, fi, hn);
      let Da = 0, xa = 0;
      He === ol ? Xl[oe] = ol : (xa = Ie ? 1 : 0, Da = pe >= bl ? Kl ? 1 : 0 : pt(_t, x, pe, bl, Kl ? 1 : 0, (Yt) => Oe(Yt, Kl)), Xl[oe] = He, $n[oe] = xa, vl[oe] = Da), ql(be, x, Nt, yt, fn, He, Da, xa);
    }
    if (J === 0) return "";
    if (J === 1) return Gl[0] === 0 && Yl[0] === Z ? x : x.slice(Gl[0], Yl[0]);
    if (J * ut > Yn) {
      for (; J * ut > Yn; )
        Yn <<= 1, ru--;
      yl = new Float64Array(Yn), ou = new Int32Array(Yn);
    }
    if (me >= oc || iu >= oc) throw new Error("cn: too many distinct classes in one merge");
    Xn = Xn + 1 | 0, Xn === 0 && (ii.fill(0), ou.fill(0), Xn = 1);
    let wt = !1;
    for (let bt = J - 1; bt >= 0; bt--) {
      const Nt = Xl[bt];
      if (Nt === ol) {
        Vn[bt] = 1;
        continue;
      }
      const Qt = vl[bt];
      if (su(Qt, Nt) === 1) {
        Vn[bt] = 0, wt = !0;
        continue;
      }
      if (Vn[bt] = 1, Nt < o) {
        const yt = et[Nt];
        if (yt >= 0) for (let Ce = G[yt]; Ce < G[yt + 1]; Ce++) su(Qt, h[Ce]);
        if ($n[bt] & 1)
          for (let Ce = 0; Ce < E.length; Ce++) E[Ce] === Nt && su(Qt, S[Ce]);
      }
    }
    if (!wt && !Ot && Z === dt + J - 1) return x;
    let $t = "", Kt = 0;
    for (; Kt < J; ) {
      if (!Vn[Kt]) {
        Kt++;
        continue;
      }
      const bt = Gl[Kt];
      let Nt = Yl[Kt], Qt = Kt + 1;
      for (; Qt < J && Vn[Qt] && Gl[Qt] === Nt + 1 && x.charCodeAt(Nt) === 32; )
        Nt = Yl[Qt], Qt++;
      $t.length > 0 && ($t += " "), $t += x.slice(bt, Nt), Kt = Qt;
    }
    return $t;
  }, An = 16384, On = new Int32Array(An * 2);
  let Oa = 0, ve = 1, re = /* @__PURE__ */ Object.create(null), Ue = /* @__PURE__ */ Object.create(null), sn = /* @__PURE__ */ new Map(), ci = /* @__PURE__ */ new Map(), fu = 0, du = 0;
  const Zl = () => {
    Oa ^= An, ve = ve + 1 | 0, du = 0;
  }, Na = (x) => {
    let Z = re[x];
    if (Z !== void 0) return Z;
    const J = jr(x, 0, x.length), dt = (J & 16383) + Oa, Ot = On[dt] === (J ^ ve) || On[dt ^ An] === (J ^ ve - 1);
    return Ot && (Z = Ue[x], Z !== void 0) ? (re[x] = Z, Z) : (Z = kl(x), Ot ? (re[x] = Z, ++fu > ce && (fu = 0, Ue = re, re = /* @__PURE__ */ Object.create(null), Zl())) : (On[dt] = J ^ ve, ++du > An && Zl()), Z);
  }, hu = (x) => {
    let Z = sn.get(x);
    if (Z !== void 0) return Z;
    const J = jr(x, 0, x.length), dt = (J & 16383) + Oa, Ot = On[dt] === (J ^ ve) || On[dt ^ An] === (J ^ ve - 1);
    return Ot && (Z = ci.get(x), Z !== void 0) ? (sn.set(x, Z), Z) : (Z = kl(x), Ot ? (sn.set(x, Z), ++fu > ce && (fu = 0, ci = sn, sn = /* @__PURE__ */ new Map(), Zl())) : (On[dt] = J ^ ve, ++du > An && Zl()), Z);
  }, mu = (x) => {
    const Z = jr(x, 0, x.length), J = (Z & 16383) + Oa;
    return On[J] === (Z ^ ve) || On[J ^ An] === (Z ^ ve - 1) ? !0 : (On[J] = Z ^ ve, ++du > An && Zl(), !1);
  }, Qn = ce === 0 ? kl : W1 ? (x) => {
    const Z = sn.get(x);
    return Z !== void 0 ? Z : hu(x);
  } : Na;
  return {
    merge: function() {
      return arguments.length === 1 && typeof arguments[0] == "string" ? Qn(arguments[0]) : Qn(tp.apply(null, arguments));
    },
    mergeString: Qn,
    seenBefore: ce === 0 ? () => !1 : mu,
    mergeUncached: kl
  };
}, Vr = (i, r) => {
  if (!i) return "";
  if (typeof i == "string") return i;
  let s = "";
  if (typeof i.length == "number" && (!r || Array.isArray(i))) {
    const o = i;
    for (let d = 0; d < o.length; d++) {
      const m = o[d];
      if (!m) continue;
      const _ = typeof m == "string" ? m : Vr(m, r);
      _ && (s && (s += " "), s += _);
    }
    return s;
  }
  if (r) {
    if (typeof i == "number") return "" + i;
    if (typeof i == "object")
      for (const o in i) i[o] && (s && (s += " "), s += o);
  }
  return s;
}, P1 = (i, r) => {
  let s = "";
  for (let o = 0; o < i.length; o++) {
    const d = i[o];
    if (!d) continue;
    const m = typeof d == "string" ? d : Vr(d, r);
    m && (s && (s += " "), s += m);
  }
  return s;
}, tp = function() {
  return P1(arguments, !1);
}, ep = 256, c2 = 16, np = 1024, bf = 4096, lp = (i, r) => {
  const s = r === void 0 ? () => !0 : r.seenBefore, o = r === void 0 ? i : r.mergeUncached;
  let d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), _ = 0, T = null, R = null, B = [], U = [], g = 0;
  const N = (Q, W, nt) => {
    R === null && (R = new Array(bf).fill(""), B = new Array(bf).fill(""), U = new Array(bf).fill(""));
    const G = jr(Q, 0, Q.length) & 4094;
    if (R[G] === Q && B[G] === W) return U[G];
    if (R[G | 1] === Q && B[G | 1] === W) return U[G | 1];
    const h = i(nt ? W + " " + Q : Q), E = R[G] === "" ? G : G | (R[G | 1] === "" ? 1 : g++ & 1);
    return R[E] = Q, B[E] = W, U[E] = h, h;
  }, F = (Q, W, nt, G) => {
    let h = 0;
    if (W) {
      if (W !== Q.a0) return !1;
      h = 1;
    }
    if (nt) {
      if (nt !== (h === 0 ? Q.a0 : Q.a1)) return !1;
      h++;
    }
    if (G) {
      if (G !== (h === 0 ? Q.a0 : h === 1 ? Q.a1 : Q.a2)) return !1;
      h++;
    }
    return h === Q.t;
  }, X = (Q, W) => {
    const nt = Q.a;
    let G = 0;
    for (let h = 0; h < W.length; h++) {
      const E = W[h];
      if (E) {
        if (E !== nt[G]) return !1;
        G++;
      }
    }
    return G === Q.t;
  }, at = (Q, W) => {
    const nt = Q.length, G = T === null ? null : T.n;
    if (!W) {
      if (G !== null && X(G, Q))
        return T = G, G.r;
      if (T !== null && T !== G && X(T, Q)) return T.r;
    }
    let h = "", E = -1, S = 0, j = !1;
    for (let et = 0; et < nt; et++) {
      let V = Q[et];
      if (V) {
        if (typeof V != "string") {
          if (V = Q[et] = Vr(V, !0), !V) continue;
          j = !0;
        }
        E < 0 && (h = V, E = et), S++;
      }
    }
    if (S === 0) return "";
    if (S === 1) return i(h);
    if (j) {
      if (G !== null && X(G, Q))
        return T = G, G.r;
      if (T !== null && T !== G && X(T, Q)) return T.r;
    }
    let K = d.get(h);
    K === void 0 && (K = m.get(h), K !== void 0 && d.set(h, K));
    let st = null;
    if (K !== void 0) {
      if (K.skip > 0) {
        K.skip--, T = null;
        let V = h;
        for (let ut = E + 1; ut < nt; ut++) {
          const mt = Q[ut];
          mt && (V += " " + mt);
        }
        return N(V, "", !1);
      }
      const et = K.e;
      t: for (let V = 0; V < et.length; V++) {
        const ut = et[V];
        if (ut.t !== S) continue;
        const mt = ut.a;
        let vt = 1;
        for (let I = E + 1; I < nt; I++) {
          const P = Q[I];
          if (P && P !== mt[vt++]) continue t;
        }
        st = ut;
        break;
      }
      st !== null && (K.miss = 0);
    }
    if (st === null) {
      let et = h;
      const V = [h];
      for (let mt = E + 1; mt < nt; mt++) {
        const vt = Q[mt];
        vt && (et += " " + vt, V.push(vt));
      }
      if (!s(et)) return o(et);
      st = {
        r: i(et),
        t: V.length,
        a0: V[0],
        a1: V[1],
        a2: V[2] ?? "",
        a: V,
        n: null
      }, K === void 0 ? d.set(h, K = {
        e: [],
        miss: 0,
        skip: 0,
        at: 0
      }) : ++K.miss > c2 && (K.miss = c2, K.skip = np, K.e.length = 0, K.at = 0);
      const ut = K.e;
      ut.length < ep ? ut.push(st) : (ut[K.at] = st, K.at = K.at + 1 & 255), ++_ > 1e3 && (_ = 0, m = d, d = /* @__PURE__ */ new Map());
    }
    return T !== null && T !== st && (T.n = st), T = st, st.r;
  }, Y = (Q) => Array.isArray(Q) ? at(Q.slice(), !1) : i(Vr(Q, !0));
  return function(Q, W, nt) {
    const G = arguments.length;
    if ((G | 1) === 3) {
      const S = T;
      if (S !== null) {
        const j = S.n;
        if (j !== null && F(j, Q, W, nt))
          return T = j, j.r;
        if (S !== j && F(S, Q, W, nt)) return S.r;
      }
      if (G === 2 && typeof W == "string" && W !== "") {
        const j = d.get(Q);
        if (j !== void 0 && j.skip > 0)
          return j.skip--, T = null, N(W, Q, !0);
      }
      return at([
        Q,
        W,
        nt
      ], !0);
    }
    if (G === 1) return typeof Q == "string" ? i(Q) : Y(Q);
    const h = T;
    if (h !== null) {
      const S = h.n;
      if (S !== null) {
        const j = S.a;
        let K = 0, st = !0;
        for (let et = 0; et < G; et++) {
          const V = arguments[et];
          if (V) {
            if (V !== j[K]) {
              st = !1;
              break;
            }
            K++;
          }
        }
        if (st && K === S.t)
          return T = S, S.r;
      }
      if (h !== S) {
        const j = h.a;
        let K = 0, st = !0;
        for (let et = 0; et < G; et++) {
          const V = arguments[et];
          if (V) {
            if (V !== j[K]) {
              st = !1;
              break;
            }
            K++;
          }
        }
        if (st && K === h.t) return h.r;
      }
    }
    const E = [];
    for (let S = 0; S < G; S++) E.push(arguments[S]);
    return at(E, !0);
  };
}, r2 = /* @__PURE__ */ $1(F1), we = /* @__PURE__ */ lp(r2.mergeString, r2);
function ap({
  className: i,
  align: r = "start",
  ...s
}) {
  return /* @__PURE__ */ H.jsx(
    "div",
    {
      "data-slot": "message",
      "data-align": r,
      className: we(
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        i
      ),
      ...s
    }
  );
}
function up({ className: i, ...r }) {
  return /* @__PURE__ */ H.jsx(
    "div",
    {
      "data-slot": "message-avatar",
      className: we(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        i
      ),
      ...r
    }
  );
}
function ip({ className: i, ...r }) {
  return /* @__PURE__ */ H.jsx(
    "div",
    {
      "data-slot": "message-content",
      className: we(
        "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        i
      ),
      ...r
    }
  );
}
function cp({ className: i, ...r }) {
  return /* @__PURE__ */ H.jsx(
    "div",
    {
      "data-slot": "message-header",
      className: we(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
        i
      ),
      ...r
    }
  );
}
function rp({ defaultTagName: i, props: r, render: s, state: o = {}, stateAttributesMapping: d }) {
  let m = Mf(op(o, d), r);
  if (!s) return y.createElement(i, m);
  if (typeof s == "function") return s(m, o);
  if (!y.isValidElement(s)) return null;
  let _ = s.props, T = { ...Mf(m, _), ref: cc(m.ref, _.ref) };
  return y.cloneElement(s, T);
}
function Mf(...i) {
  let r = {};
  for (let s of i) {
    if (!s) continue;
    let o = s;
    for (let d of Object.keys(o)) {
      let m = o[d];
      if (m === void 0) continue;
      let _ = r[d];
      d === "className" ? r[d] = [_, m].filter(Boolean).join(" ") : d === "style" ? r[d] = { ..._, ...m } : d === "ref" ? r[d] = cc(_, m) : fp(d) && typeof _ == "function" && typeof m == "function" ? r[d] = sp(m, _) : r[d] = m;
    }
  }
  return r;
}
function op(i, r) {
  let s = {};
  for (let o of Object.keys(i)) {
    let d = i[o], m = r?.[o]?.(d);
    if (m) {
      Object.assign(s, m);
      continue;
    }
    if (o === "slot") {
      s["data-slot"] = d;
      continue;
    }
    let _ = `data-${String(o).replace(/[A-Z]/g, (T) => `-${T.toLowerCase()}`)}`;
    typeof d == "boolean" ? s[_] = d ? "" : void 0 : d != null && (s[_] = String(d));
  }
  return s;
}
function sp(i, r) {
  return function(s) {
    i(s), s.defaultPrevented || r(s);
  };
}
function fp(i) {
  return /^on[A-Z]/.test(i);
}
function cc(...i) {
  let r = i.filter(Boolean);
  if (r.length !== 0) return (s) => {
    for (let o of r) typeof o == "function" ? o(s) : o && (o.current = s);
  };
}
var dp = 8, hp = 64, mp = 0, qr = 0.5, vp = 180, gp = /* @__PURE__ */ new Set(["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "]), rv = { start: !1, end: !1 }, yp = [], Gr = { currentAnchorId: null, visibleMessageIds: yp };
function bp({ content: i, scrollEdgeThreshold: r, spacer: s, viewport: o }) {
  if (!o || !i) return rv;
  let d = Qf({ content: i, spacer: s, viewport: o });
  return { start: o.scrollTop > r, end: d - o.scrollTop - o.clientHeight > r };
}
function pp({ content: i, scrollMargin: r, scrollPreviousItemPeek: s, spacer: o, viewport: d, visibleMessageIds: m }) {
  if (!i || !d) return Gr;
  let _ = d.getBoundingClientRect(), T = _.top + r + s, R = typeof IntersectionObserver > "u", B = [], U = null;
  for (let g of lc(i, o)) {
    let N = g.dataset.messageId;
    if (!N) continue;
    let F = g.dataset.scrollAnchor === "true", X = F || R ? g.getBoundingClientRect() : null;
    (R && X ? X.bottom > T && X.top < _.bottom : m.has(N)) && B.push(N), F && X && X.top <= T + qr && (U = N);
  }
  return B.length === 0 && U === null ? Gr : { currentAnchorId: U, visibleMessageIds: B };
}
function lc(i, r) {
  return Array.from(i.children).filter((s) => s instanceof HTMLElement && s !== r);
}
function Sp(i, r) {
  for (let s = r; s < i.length; s++) {
    let o = i[s];
    if (o?.dataset.scrollAnchor === "true") return o;
  }
  return null;
}
function Ep(i, r) {
  for (let s of i) if (s.dataset.scrollAnchor === "true" && !r.has(s)) return s;
  return null;
}
function _p(i, r) {
  let s = 0;
  for (let o = r; o < i.length; o++) if (i[o]?.dataset.scrollAnchor === "true" && (s += 1, s > 1)) return !0;
  return !1;
}
function Tp(i) {
  for (let r = i.length - 1; r >= 0; r--) {
    let s = i[r];
    if (s?.dataset.scrollAnchor === "true") return s;
  }
  return null;
}
function Cp({ content: i, spacer: r, viewport: s }) {
  let o = s.getBoundingClientRect();
  for (let d of lc(i, r)) {
    if (!d.dataset.messageId) continue;
    let m = d.getBoundingClientRect();
    if (m.bottom > o.top && m.top < o.bottom) return d;
  }
  return null;
}
function Ap({ align: i, element: r, scrollMargin: s, spacer: o, viewport: d }) {
  let m = ov(r, d), _ = r.getBoundingClientRect().height, T = Rp(o);
  if (i === "center") {
    let R = Math.max(0, d.clientHeight - T.start - T.end);
    return m - T.start - (R - _) / 2 - s;
  }
  if (i === "end") return m - d.clientHeight + _ + T.end + s;
  if (i === "nearest") {
    let R = m + _, B = d.scrollTop + T.start, U = d.scrollTop + d.clientHeight - T.end;
    return m >= B && R <= U ? d.scrollTop : m < B ? m - T.start - s : R - d.clientHeight + T.end + s;
  }
  return m - T.start - s;
}
function ov(i, r) {
  let s = i.getBoundingClientRect(), o = r.getBoundingClientRect();
  return s.top - o.top + r.scrollTop;
}
function Br(i, r) {
  return i.getBoundingClientRect().top - r.getBoundingClientRect().top;
}
function Op({ content: i, scrollTop: r, spacer: s, viewport: o }) {
  let d = Qf({ content: i, spacer: s, viewport: o });
  return r + o.clientHeight - d;
}
function Qf({ content: i, spacer: r, viewport: s }) {
  let o = lc(i, r), d = sv(i), m = s.getBoundingClientRect(), _ = s.scrollTop, T = d.start + d.end;
  for (let R of o) {
    let B = R.getBoundingClientRect();
    T = Math.max(T, B.bottom - m.top + _ + d.end);
  }
  return T;
}
function Np(i) {
  return Math.max(0, i.scrollHeight - i.clientHeight);
}
function sv(i) {
  let r = window.getComputedStyle(i);
  return { end: wf(r.paddingBlockEnd || r.paddingBottom), start: wf(r.paddingBlockStart || r.paddingTop) };
}
function Rp(i) {
  let r = i?.parentElement;
  return r ? sv(r) : { end: 0, start: 0 };
}
function zp(i) {
  if (!i) return 0;
  let r = window.getComputedStyle(i), s = r.rowGap === "normal" ? r.gap : r.rowGap;
  return wf(s);
}
function wf(i) {
  if (!i) return 0;
  let r = Number.parseFloat(i);
  return Number.isFinite(r) ? r : 0;
}
function fv(i, r) {
  let s = i, o = /* @__PURE__ */ new Set();
  return { getSnapshot: () => s, hasListeners: () => o.size > 0, setSnapshot: (d) => {
    r(s, d) || (s = d, o.forEach((m) => m()));
  }, subscribe: (d, m, _) => {
    let T = o.size === 0;
    return o.add(d), T && m?.(), () => {
      o.delete(d), o.size === 0 && _?.();
    };
  } };
}
function o2(i, r) {
  return fv(i, r);
}
function Dp() {
  return fv(Gr, Mp);
}
function xp(i, r) {
  return i.start === r.start && i.end === r.end;
}
function Mp(i, r) {
  return i.currentAnchorId !== r.currentAnchorId || i.visibleMessageIds.length !== r.visibleMessageIds.length ? !1 : i.visibleMessageIds.every((s, o) => s === r.visibleMessageIds[o]);
}
function wp({ autoScroll: i, defaultScrollPosition: r, scrollEdgeThreshold: s, scrollMargin: o, scrollPreviousItemPeek: d }) {
  let m = y.useRef(i), _ = y.useRef(!1), T = y.useRef(null), R = y.useRef(!1), B = y.useRef(s), U = y.useRef(0), g = y.useRef(null), N = y.useRef(0), F = y.useRef(i ? "following-bottom" : "free-scrolling"), X = y.useRef(/* @__PURE__ */ new Map()), at = y.useRef(null), Y = y.useRef(null), Q = y.useRef(null), W = y.useRef(d), nt = y.useRef(!0), G = y.useRef(null), h = y.useRef(o), E = y.useRef(null), S = y.useRef(0), j = y.useRef(0), K = y.useRef(null), st = y.useRef(null), et = y.useRef(null), V = y.useRef(null), ut = y.useRef(null), mt = y.useRef(null), vt = y.useRef(null), I = y.useRef(null), P = y.useRef(null), lt = y.useRef(/* @__PURE__ */ new Set()), At = y.useRef(/* @__PURE__ */ new WeakSet());
  return et.current === null && (et.current = o2(r === "end" || r === "last-anchor", (ft, Ht) => ft === Ht)), V.current === null && (V.current = o2(rv, xp)), P.current === null && (P.current = Dp()), m.current = i, B.current = s, h.current = o, W.current = d, { autoScrollRef: m, autoscrollingRef: _, autoscrollingTimeoutRef: ut, streamingTurnRef: Q, contentRef: T, defaultScrollPositionAppliedRef: R, firstItemRef: g, itemCountRef: U, lastScrollTopRef: N, messageElementsRef: X, modeRef: F, pendingScrollFrameRef: E, pendingScrollToMessageRef: at, prependRestoreRef: Y, preserveScrollOnPrependRef: nt, pendingDefaultScrollStore: et.current, rootRef: G, scrollEdgeThresholdRef: B, scrollMarginRef: h, scrollPreviousItemPeekRef: W, spacerGapRef: S, spacerHeightRef: j, spacerRef: K, stateFrameRef: st, stateStore: V.current, viewportRef: mt, visibilityFrameRef: vt, visibilityObserverRef: I, visibilityStore: P.current, visibleMessageIdsRef: lt, handledScrollAnchorsRef: At };
}
function dv(i) {
  i.pendingDefaultScrollStore.setSnapshot(!1);
}
function Lr(i) {
  i.defaultScrollPositionAppliedRef.current = !0, dv(i);
}
function Up({ refs: i, commitScrollState: r, scheduleStateCommit: s, scheduleVisibilitySync: o }) {
  let { streamingTurnRef: d, autoScrollRef: m, autoscrollingRef: _, autoscrollingTimeoutRef: T, contentRef: R, itemCountRef: B, messageElementsRef: U, modeRef: g, pendingScrollToMessageRef: N, prependRestoreRef: F, scrollMarginRef: X, scrollPreviousItemPeekRef: at, spacerGapRef: Y, spacerHeightRef: Q, spacerRef: W, viewportRef: nt } = i, G = y.useCallback((V) => {
    T.current !== null && (window.clearTimeout(T.current), T.current = null), _.current !== V && (_.current = V, r()), V && (T.current = window.setTimeout(() => {
      T.current = null, _.current = !1, r();
    }, vp));
  }, [r]), h = y.useCallback((V) => {
    let ut = W.current;
    if (!ut) return;
    let mt = Math.max(0, Math.ceil(V));
    Q.current !== mt && (Q.current = mt, ut.hidden = mt === 0, ut.style.height = `${mt}px`, ut.style.marginTop = mt > 0 ? `${-Y.current}px` : "");
  }, []), E = y.useCallback((V, { behavior: ut = "auto", autoscrolling: mt = !1 } = {}) => {
    let vt = nt.current;
    if (!vt) return;
    let I = Math.max(0, V);
    if (Math.abs(vt.scrollTop - I) <= qr) {
      vt.scrollTop = I, r();
      return;
    }
    mt && G(!0), vt.scrollTo({ top: I, behavior: ut }), s();
  }, [r, s, G]), S = y.useCallback(({ behavior: V = "auto" } = {}) => nt.current ? (h(0), d.current = null, g.current = "free-scrolling", E(0, { behavior: V }), o(), !0) : !1, [o, E, h]), j = y.useCallback(({ behavior: V = "auto" } = {}) => {
    let ut = nt.current;
    return ut ? (h(0), d.current = null, g.current = m.current ? "following-bottom" : "free-scrolling", E(Np(ut), { autoscrolling: !0, behavior: V }), o(), !0) : !1;
  }, [o, E, h]), K = y.useCallback((V, { align: ut = "start", behavior: mt = "auto", scrollMargin: vt = X.current } = {}, { keepPreviousPeek: I = !1 } = {}) => {
    let P = R.current, lt = nt.current;
    if (!P || !lt || !P.contains(V)) return !1;
    let At = Ap({ align: ut, element: V, scrollMargin: I ? vt + at.current : vt, spacer: W.current, viewport: lt }), ft = Op({ content: P, scrollTop: At, spacer: W.current, viewport: lt });
    return h(ft), F.current = { element: V, viewportTop: Br(V, lt) }, g.current = I ? "anchored-to-message" : "settling-jump", d.current = I ? V : null, E(At, { behavior: mt }), o(), !0;
  }, [o, E, h]), st = y.useCallback(() => {
    let V = d.current;
    return !V || !V.isConnected || g.current !== "anchored-to-message" ? !1 : K(V, { align: "start" }, { keepPreviousPeek: !0 });
  }, [K]), et = y.useCallback((V, ut) => {
    let mt = U.current.get(V);
    return mt ? (Lr(i), K(mt, ut) ? (N.current = null, !0) : (N.current = { messageId: V, options: ut }, !0)) : B.current === 0 ? (N.current = { messageId: V, options: ut }, Lr(i), !0) : !1;
  }, [K]);
  return { flushPendingScrollToMessage: y.useCallback(() => {
    let V = N.current;
    if (!V) return !1;
    let ut = U.current.get(V.messageId);
    return !ut || !K(ut, V.options) ? !1 : (N.current = null, Lr(i), !0);
  }, [K]), reanchorToAnchoredMessage: st, scrollToElement: K, scrollToEnd: j, scrollToMessage: et, scrollToStart: S };
}
function s2(i, r) {
  return y.useCallback((s) => {
    i.current = s, s && r();
  }, [i, r]);
}
function Hp({ autoScroll: i = !1, defaultScrollPosition: r = "end", scrollEdgeThreshold: s = dp, scrollPreviousItemPeek: o = hp, scrollMargin: d = mp }) {
  let m = wp({ autoScroll: i, defaultScrollPosition: r, scrollEdgeThreshold: s, scrollMargin: d, scrollPreviousItemPeek: o }), { streamingTurnRef: _, autoScrollRef: T, autoscrollingRef: R, autoscrollingTimeoutRef: B, contentRef: U, defaultScrollPositionAppliedRef: g, firstItemRef: N, itemCountRef: F, lastScrollTopRef: X, messageElementsRef: at, modeRef: Y, pendingScrollFrameRef: Q, pendingScrollToMessageRef: W, prependRestoreRef: nt, preserveScrollOnPrependRef: G, pendingDefaultScrollStore: h, rootRef: E, scrollEdgeThresholdRef: S, scrollMarginRef: j, scrollPreviousItemPeekRef: K, spacerGapRef: st, spacerHeightRef: et, spacerRef: V, stateFrameRef: ut, stateStore: mt, viewportRef: vt, visibilityFrameRef: I, visibilityObserverRef: P, visibilityStore: lt, visibleMessageIdsRef: At, handledScrollAnchorsRef: ft } = m, Ht = y.useRef(r);
  Ht.current !== r && (Ht.current = r, g.current = !1);
  let fe = y.useCallback((pt) => {
    let _t = E.current, Gt = vt.current, me = [pt.start && "start", pt.end && "end"].filter(Boolean).join(" "), Cn = R.current;
    for (let Oe of [_t, Gt]) Oe && (me ? Oe.setAttribute("data-scrollable", me) : Oe.removeAttribute("data-scrollable"), Oe.toggleAttribute("data-autoscrolling", Cn));
  }, []), ce = y.useCallback((pt) => {
    let _t = vt.current?.scrollTop ?? 0, Gt = _t < X.current - qr;
    X.current = _t, T.current && !pt.end && Y.current !== "settling-jump" && Y.current !== "anchored-to-message" ? Y.current = "following-bottom" : Y.current === "following-bottom" && pt.end && Gt && !R.current && (Y.current = "free-scrolling");
  }, []), b = y.useCallback(() => {
    let pt = bp({ content: U.current, scrollEdgeThreshold: S.current, spacer: V.current, viewport: vt.current });
    ce(pt);
    let _t = Y.current === "following-bottom" ? { ...pt, end: !1 } : pt;
    fe(_t), mt.setSnapshot(_t);
  }, [ce, mt, fe]), k = y.useCallback(() => {
    ut.current === null && (ut.current = window.requestAnimationFrame(() => {
      ut.current = null, b();
    }));
  }, [b]), tt = y.useCallback(() => {
    lt.hasListeners() && I.current === null && (I.current = window.requestAnimationFrame(() => {
      I.current = null, lt.hasListeners() && lt.setSnapshot(pp({ content: U.current, scrollMargin: j.current, scrollPreviousItemPeek: K.current, spacer: V.current, viewport: vt.current, visibleMessageIds: At.current }));
    }));
  }, [lt]), { flushPendingScrollToMessage: rt, reanchorToAnchoredMessage: Rt, scrollToElement: zt, scrollToEnd: gt, scrollToMessage: ct, scrollToStart: w } = Up({ refs: m, commitScrollState: b, scheduleStateCommit: k, scheduleVisibilitySync: tt }), Et = y.useCallback(() => {
    let pt = nt.current, _t = vt.current;
    if (!pt || !_t || !pt.element.isConnected) return !1;
    let Gt = Br(pt.element, _t) - pt.viewportTop;
    return Math.abs(Gt) <= qr ? !1 : (_t.scrollTop += Gt, pt.viewportTop = Br(pt.element, _t), k(), tt(), !0);
  }, [k, tt]), Mt = y.useCallback(() => {
    let pt = U.current, _t = vt.current;
    if (!pt || !_t) {
      nt.current = null;
      return;
    }
    let Gt = Cp({ content: pt, spacer: V.current, viewport: _t });
    nt.current = Gt ? { element: Gt, viewportTop: Br(Gt, _t) } : null;
  }, []), kt = y.useCallback(() => {
    Q.current === null && (Q.current = window.requestAnimationFrame(() => {
      Q.current = null, rt() && Mt();
    }));
  }, [Mt, rt]), ae = y.useCallback(() => {
    if (!r || g.current || F.current === 0) return !1;
    let pt = !1;
    if (r === "last-anchor") {
      let _t = U.current, Gt = vt.current, me = _t && Gt ? Tp(lc(_t, V.current)) : null;
      if (!_t || !Gt || !me) pt = gt({ behavior: "auto" });
      else {
        let Cn = ov(me, Gt);
        pt = Qf({ content: _t, spacer: V.current, viewport: Gt }) - Cn <= Gt.clientHeight ? gt({ behavior: "auto" }) : zt(me, { align: "start" }, { keepPreviousPeek: !0 });
      }
    } else pt = r === "end" ? gt({ behavior: "auto" }) : w({ behavior: "auto" });
    return pt ? (Lr(m), !0) : !1;
  }, [r, zt, gt, w]), ee = y.useCallback(() => {
    let pt = U.current;
    if (!pt) return;
    let _t = lc(pt, V.current), Gt = F.current, me = N.current;
    F.current = _t.length, N.current = _t[0] ?? null, (() => {
      if (rt()) return;
      if (Gt === 0) {
        if (ae() || _t.length > 0 && T.current && gt({ behavior: "auto" })) return;
        b(), tt();
        return;
      }
      let Cn = me ? _t.indexOf(me) : -1;
      if (G.current && Cn > 0) {
        Et();
        return;
      }
      if (_t.length > Gt) {
        let Oe = Sp(_t, Gt);
        if (Oe) {
          if (T.current && Y.current === "following-bottom" && _p(_t, Gt)) {
            gt({ behavior: "auto" });
            return;
          }
          zt(Oe, { align: "start" }, { keepPreviousPeek: !0 }), ft.current.add(Oe);
          return;
        }
      }
      if (_t.length === Gt) {
        let Oe = Ep(_t, ft.current);
        if (Oe) {
          zt(Oe, { align: "start" }, { keepPreviousPeek: !0 }), ft.current.add(Oe);
          return;
        }
      }
      Y.current === "following-bottom" && T.current ? gt({ behavior: "auto" }) : (b(), tt());
    })(), Mt();
  }, [ae, Mt, b, rt, Et, tt, zt, gt]), jt = y.useCallback(() => {
    if (Y.current === "following-bottom" && T.current) {
      gt({ behavior: "auto" });
      return;
    }
    let pt = et.current;
    if (Rt()) {
      T.current && pt > 0 && et.current === 0 && gt({ behavior: "auto" });
      return;
    }
    k(), tt();
  }, [Rt, k, tt, gt]), Ze = y.useCallback(() => {
    let pt = vt.current;
    if (!(!pt || !lt.hasListeners())) {
      if (typeof IntersectionObserver > "u") {
        tt();
        return;
      }
      P.current || (P.current = new IntersectionObserver((_t) => {
        for (let Gt of _t) {
          let me = Gt.target.dataset.messageId;
          me && (Gt.isIntersecting ? At.current.add(me) : At.current.delete(me));
        }
        tt();
      }, { root: pt, rootMargin: `${-(j.current + K.current)}px 0px 0px 0px`, threshold: [0, 0.01, 0.5, 1] })), at.current.forEach((_t) => {
        P.current?.observe(_t);
      }), tt();
    }
  }, [tt, lt]), on = y.useCallback(() => {
    I.current !== null && (window.cancelAnimationFrame(I.current), I.current = null), P.current?.disconnect(), P.current = null, At.current.clear(), lt.setSnapshot(Gr);
  }, [lt]), _n = y.useCallback((pt, _t, Gt) => {
    if (_t) {
      at.current.set(pt, _t), P.current?.observe(_t), tt(), W.current?.messageId === pt && kt();
      return;
    }
    Gt && at.current.get(pt) === Gt && (at.current.delete(pt), At.current.delete(pt), P.current?.unobserve(Gt), tt());
  }, [kt, tt]), hl = y.useCallback(() => {
    (Y.current === "following-bottom" || Y.current === "anchored-to-message" || Y.current === "settling-jump") && (_.current = null, Y.current = "free-scrolling");
  }, []), Bn = y.useCallback(() => fe(mt.getSnapshot()), [mt, fe]), Ln = s2(E, Bn), Bl = s2(vt, Bn), ml = y.useCallback((pt) => {
    U.current = pt;
  }, []), Ll = y.useCallback((pt) => {
    V.current = pt, st.current = zp(pt?.parentElement ?? null);
  }, []), Ca = y.useCallback(() => {
    b(), tt(), Mt();
  }, [Mt, b, tt]), Tn = y.useMemo(() => ({ handleContentChange: ee, handleResize: jt, observeVisibility: Ze, pendingDefaultScrollStore: h, preserveScrollOnPrependRef: G, scrollToEnd: gt, scrollToMessage: ct, scrollToStart: w, setContentElement: ml, setRootElement: Ln, setSpacerElement: Ll, setViewportElement: Bl, stateStore: mt, syncAfterScroll: Ca, unobserveVisibility: on, userScrollIntent: hl, viewportRef: vt, visibilityStore: lt }), [ee, jt, Ze, h, gt, ct, w, ml, Ln, Ll, Bl, mt, Ca, on, hl, lt]);
  return y.useLayoutEffect(() => {
    ae() || F.current === 0 && dv(m);
  }, [ae]), y.useEffect(() => () => {
    ut.current !== null && (window.cancelAnimationFrame(ut.current), ut.current = null), I.current !== null && (window.cancelAnimationFrame(I.current), I.current = null), B.current !== null && (window.clearTimeout(B.current), B.current = null), Q.current !== null && (window.cancelAnimationFrame(Q.current), Q.current = null), P.current?.disconnect(), P.current = null;
  }, []), y.useLayoutEffect(() => {
    if (i && Y.current === "following-bottom" && F.current > 0) {
      gt({ behavior: "auto" });
      return;
    }
    b();
  }, [i, b, gt]), { context: Tn, registerMessage: _n };
}
function jp(i) {
  let r = y.useRef(i);
  return r.current = i, r;
}
var hv = y.createContext(null), mv = y.createContext(null);
function rc() {
  let i = y.useContext(hv);
  if (!i) throw new Error("useMessageScroller must be used within a MessageScroller.");
  return i;
}
function Bp() {
  let i = y.useContext(mv);
  if (!i) throw new Error("MessageScrollerItem must be used within a MessageScroller.");
  return i;
}
function Lp({ autoScroll: i = !1, children: r, defaultScrollPosition: s = "end", scrollEdgeThreshold: o, scrollPreviousItemPeek: d, scrollMargin: m }) {
  let { context: _, registerMessage: T } = Hp({ autoScroll: i, defaultScrollPosition: s, scrollEdgeThreshold: o, scrollPreviousItemPeek: d, scrollMargin: m });
  return H.jsx(hv.Provider, { value: _, children: H.jsx(mv.Provider, { value: T, children: r }) });
}
function vv() {
  let { pendingDefaultScrollStore: i } = rc();
  return y.useSyncExternalStore(i.subscribe, i.getSnapshot, i.getSnapshot);
}
function Vp({ children: i, ...r }) {
  let { setRootElement: s } = rc(), o = vv();
  return H.jsx("div", { ref: s, ...r, ...o ? { "data-pending-scroll": "" } : null, children: i });
}
function qp({ "aria-label": i, children: r, onKeyDown: s, onScroll: o, onTouchMove: d, onWheel: m, preserveScrollOnPrepend: _ = !0, ref: T, role: R, tabIndex: B, ...U }) {
  let { handleResize: g, preserveScrollOnPrependRef: N, setViewportElement: F, syncAfterScroll: X, userScrollIntent: at, viewportRef: Y } = rc(), Q = vv();
  N.current = _;
  let W = y.useCallback((S) => {
    F(S), cc(T)?.(S);
  }, [T, F]);
  function nt(S) {
    X(), o?.(S);
  }
  function G(S) {
    at(), m?.(S);
  }
  function h(S) {
    at(), d?.(S);
  }
  function E(S) {
    gp.has(S.key) && at(), s?.(S);
  }
  return y.useEffect(() => {
    let S = Y.current;
    if (!S || typeof ResizeObserver > "u") return;
    let j = 0, K = new ResizeObserver(() => {
      window.cancelAnimationFrame(j), j = window.requestAnimationFrame(g);
    });
    return K.observe(S), () => {
      window.cancelAnimationFrame(j), K.disconnect();
    };
  }, [g, Y]), H.jsx("div", { ref: W, role: R ?? "region", "aria-label": i ?? "Messages", tabIndex: B ?? 0, onKeyDown: E, onScroll: nt, onTouchMove: h, onWheel: G, ...U, ...Q ? { "data-pending-scroll": "" } : null, children: r });
}
function Gp({ "aria-relevant": i, children: r, ref: s, role: o, spacerClassName: d, ...m }) {
  let { handleContentChange: _, handleResize: T, setContentElement: R, setSpacerElement: B } = rc(), U = y.useRef(null), g = y.useCallback((N) => {
    U.current = N, R(N), cc(s)?.(N);
  }, [s, R]);
  return y.useLayoutEffect(() => {
    let N = U.current;
    if (!N || (_(), typeof MutationObserver > "u")) return;
    let F = new MutationObserver(() => {
      _();
    });
    return F.observe(N, { childList: !0 }), () => F.disconnect();
  }, [_]), y.useEffect(() => {
    let N = U.current;
    if (!N || typeof ResizeObserver > "u") return;
    let F = 0, X = new ResizeObserver(() => {
      window.cancelAnimationFrame(F), F = window.requestAnimationFrame(T);
    });
    return X.observe(N), () => {
      window.cancelAnimationFrame(F), X.disconnect();
    };
  }, [T]), H.jsxs("div", { ref: g, role: o ?? "log", "aria-relevant": i ?? "additions", ...m, children: [r, H.jsx("div", { ref: B, "aria-hidden": "true", "data-message-scroller-spacer": "", hidden: !0, className: d })] });
}
function Yp({ messageId: i, ref: r, scrollAnchor: s = !1, ...o }) {
  let d = Bp(), m = y.useRef(null), _ = y.useCallback((T) => {
    let R = m.current;
    m.current = T, i && d(i, T, R), cc(r)?.(T);
  }, [i, r, d]);
  return H.jsx("div", { ref: _, "data-message-id": i, "data-scroll-anchor": s ? "true" : "false", ...o });
}
function Xp({ behavior: i = "smooth", children: r, direction: s = "end", onClick: o, render: d, tabIndex: m, type: _ = "button", ...T }) {
  let { scrollToEnd: R, scrollToStart: B, stateStore: U } = rc(), g = jp(o), N = y.useCallback((Y) => U.subscribe(Y), [U]), F = y.useCallback(() => {
    let Y = U.getSnapshot();
    return s === "start" ? Y.start : Y.end;
  }, [s, U]), X = y.useSyncExternalStore(N, F, F), at = y.useCallback((Y) => {
    X && (g.current?.(Y), Y.defaultPrevented || (Y.currentTarget.blur(), s === "start" ? B({ behavior: i }) : R({ behavior: i })));
  }, [i, s, X, g, R, B]);
  return rp({ defaultTagName: "button", props: Mf({ type: _, inert: !X, tabIndex: X ? m : -1, children: r ?? H.jsxs("span", { children: ["Scroll to ", s] }), onClick: at }, T), render: d, state: { active: X, direction: s }, stateAttributesMapping: { active: (Y) => ({ "data-active": Y ? "true" : "false" }) } });
}
var ai = { Provider: Lp, Root: Vp, Viewport: qp, Content: Gp, Item: Yp, Button: Xp };
function gv(i) {
  var r, s, o = "";
  if (typeof i == "string" || typeof i == "number") o += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var d = i.length;
    for (r = 0; r < d; r++) i[r] && (s = gv(i[r])) && (o && (o += " "), o += s);
  } else for (s in i) i[s] && (o && (o += " "), o += s);
  return o;
}
function Qp() {
  for (var i, r, s = 0, o = "", d = arguments.length; s < d; s++) (i = arguments[s]) && (r = gv(i)) && (o && (o += " "), o += r);
  return o;
}
const f2 = (i) => typeof i == "boolean" ? `${i}` : i === 0 ? "0" : i, d2 = Qp, kf = (i, r) => (s) => {
  var o;
  if (r?.variants == null) return d2(i, s?.class, s?.className);
  const { variants: d, defaultVariants: m } = r, _ = Object.keys(d).map((B) => {
    const U = s?.[B], g = m?.[B];
    if (U === null) return null;
    const N = f2(U) || f2(g);
    return d[B][N];
  }), T = s && Object.entries(s).reduce((B, U) => {
    let [g, N] = U;
    return N === void 0 || (B[g] = N), B;
  }, {}), R = r == null || (o = r.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((B, U) => {
    let { class: g, className: N, ...F } = U;
    return Object.entries(F).every((X) => {
      let [at, Y] = X;
      return Array.isArray(Y) ? Y.includes({
        ...m,
        ...T
      }[at]) : {
        ...m,
        ...T
      }[at] === Y;
    }) ? [
      ...B,
      g,
      N
    ] : B;
  }, []);
  return d2(i, _, R, s?.class, s?.className);
}, kp = kf(
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
function Zp({
  className: i,
  variant: r = "default",
  size: s = "default",
  asChild: o = !1,
  ...d
}) {
  const m = o ? Bf : "button";
  return /* @__PURE__ */ H.jsx(
    m,
    {
      "data-slot": "button",
      "data-variant": r,
      "data-size": s,
      className: we(kp({ variant: r, size: s, className: i })),
      ...d
    }
  );
}
function Kp(i) {
  return /* @__PURE__ */ H.jsx(ai.Provider, { ...i });
}
function Jp({
  className: i,
  ...r
}) {
  return /* @__PURE__ */ H.jsx(
    ai.Root,
    {
      "data-slot": "message-scroller",
      className: we(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        i
      ),
      ...r
    }
  );
}
function Ip({
  className: i,
  ...r
}) {
  return /* @__PURE__ */ H.jsx(
    ai.Viewport,
    {
      "data-slot": "message-scroller-viewport",
      className: we(
        "size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible",
        i
      ),
      ...r
    }
  );
}
function Fp({
  className: i,
  ...r
}) {
  return /* @__PURE__ */ H.jsx(
    ai.Content,
    {
      "data-slot": "message-scroller-content",
      className: we("flex h-max min-h-full flex-col gap-6", i),
      ...r
    }
  );
}
function Wp({
  className: i,
  scrollAnchor: r = !1,
  ...s
}) {
  return /* @__PURE__ */ H.jsx(
    ai.Item,
    {
      "data-slot": "message-scroller-item",
      scrollAnchor: r,
      className: we(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        i
      ),
      ...s
    }
  );
}
function $p({
  direction: i = "end",
  className: r,
  children: s,
  render: o,
  variant: d = "secondary",
  size: m = "icon-sm",
  ..._
}) {
  return /* @__PURE__ */ H.jsx(
    ai.Button,
    {
      "data-slot": "message-scroller-button",
      "data-direction": i,
      "data-variant": d,
      "data-size": m,
      direction: i,
      className: we(
        "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        r
      ),
      render: o ?? /* @__PURE__ */ H.jsx(Zp, { variant: d, size: m }),
      ..._,
      children: s ?? /* @__PURE__ */ H.jsxs(H.Fragment, { children: [
        /* @__PURE__ */ H.jsx(
          S1,
          {}
        ),
        /* @__PURE__ */ H.jsx("span", { className: "sr-only", children: i === "end" ? "Scroll to end" : "Scroll to start" })
      ] })
    }
  );
}
function Pp({
  className: i,
  size: r = "default",
  ...s
}) {
  return /* @__PURE__ */ H.jsx(
    f1,
    {
      "data-slot": "avatar",
      "data-size": r,
      className: we(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        i
      ),
      ...s
    }
  );
}
function tS({
  className: i,
  ...r
}) {
  return /* @__PURE__ */ H.jsx(
    h1,
    {
      "data-slot": "avatar-image",
      className: we(
        "aspect-square size-full rounded-full object-cover",
        i
      ),
      ...r
    }
  );
}
function eS({
  className: i,
  ...r
}) {
  return /* @__PURE__ */ H.jsx(
    v1,
    {
      "data-slot": "avatar-fallback",
      className: we(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        i
      ),
      ...r
    }
  );
}
const nS = kf(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default: "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary: "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted: "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted: "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline: "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost: "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive: "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function lS({
  variant: i = "default",
  align: r = "start",
  className: s,
  ...o
}) {
  return /* @__PURE__ */ H.jsx(
    "div",
    {
      "data-slot": "bubble",
      "data-variant": i,
      "data-align": r,
      className: we(nS({ variant: i }), s),
      ...o
    }
  );
}
function aS({
  asChild: i = !1,
  className: r,
  ...s
}) {
  const o = i ? Bf : "div";
  return /* @__PURE__ */ H.jsx(
    o,
    {
      "data-slot": "bubble-content",
      className: we(
        "w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
        r
      ),
      ...s
    }
  );
}
const uS = kf(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator: "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2"
      }
    }
  }
);
function h2({
  className: i,
  variant: r = "default",
  asChild: s = !1,
  ...o
}) {
  const d = s ? Bf : "div";
  return /* @__PURE__ */ H.jsx(
    d,
    {
      "data-slot": "marker",
      "data-variant": r,
      className: we(uS({ variant: r, className: i })),
      ...o
    }
  );
}
function iS({ className: i, ...r }) {
  return /* @__PURE__ */ H.jsx(
    "span",
    {
      "data-slot": "marker-icon",
      "aria-hidden": "true",
      className: we(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        i
      ),
      ...r
    }
  );
}
function m2({ className: i, ...r }) {
  return /* @__PURE__ */ H.jsx(
    "span",
    {
      "data-slot": "marker-content",
      className: we(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        i
      ),
      ...r
    }
  );
}
function Zf() {
  const i = document.querySelector('meta[name="_csrf"]')?.content || "";
  return { [document.querySelector('meta[name="_csrf_header"]')?.content || "X-CSRF-TOKEN"]: i };
}
async function Ml(i, r) {
  const s = await fetch(i, {
    credentials: "same-origin",
    headers: { ...Zf(), "Content-Type": "application/json" },
    method: r === void 0 ? "GET" : "POST",
    body: r === void 0 ? void 0 : JSON.stringify(r)
  });
  if (s.redirected || s.status === 401) throw new Error("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại");
  if (!s.ok) throw new Error(s.status === 429 ? "Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút" : s.status === 403 ? "Bạn không có quyền truy cập cuộc trò chuyện này" : "Chưa thể xử lý yêu cầu. Vui lòng kiểm tra thông tin và thử lại");
  return s.json();
}
async function cS(i, r) {
  const s = await fetch("/api/ai-chat/messages/stream", {
    method: "POST",
    credentials: "same-origin",
    headers: { ...Zf(), "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ content: i })
  });
  if (s.redirected) throw new Error("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại");
  if (!s.ok || !s.body) throw new Error(s.status === 429 ? "Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút" : "Chưa thể gửi tin nhắn. Vui lòng thử lại");
  const o = s.body.getReader(), d = new TextDecoder();
  let m = "", _ = !1;
  try {
    for (; ; ) {
      const { done: T, value: R } = await o.read();
      m += d.decode(R, { stream: !T }).replace(/\r\n/g, `
`);
      let B;
      for (; (B = m.indexOf(`

`)) >= 0; ) {
        const U = m.slice(0, B);
        m = m.slice(B + 2);
        const g = U.split(`
`), N = g.find((X) => X.startsWith("event:"))?.slice(6).trim() || "message", F = g.filter((X) => X.startsWith("data:")).map((X) => X.slice(5).trimStart()).join(`
`);
        F && (r(N, JSON.parse(F)), (N === "done" || N === "error") && (_ = !0));
      }
      if (T) break;
    }
    if (!_) throw new Error("Kết nối bị gián đoạn. Bạn có thể thử lại hoặc Chat với cửa hàng");
  } finally {
    o.releaseLock();
  }
}
const rS = `Xin chào! Mình là T-Winkle AI 👋

Mình có thể giúp bạn tìm sản phẩm, kiểm tra giá, size, màu sắc, tồn kho tại cửa hàng hoặc trạng thái đơn hàng.

Bạn đang tìm sản phẩm như thế nào?`, oS = "T-Winkle AI hiện chưa thể phản hồi. Bạn có thể thử lại hoặc chuyển sang Chat với cửa hàng";
function pf(i, r) {
  const s = new Map(i.map((o) => [String(o.id), o]));
  return r.forEach((o) => s.set(String(o.id), o)), [...s.values()].sort((o, d) => Number(o.id) - Number(d.id));
}
function v2({ src: i = "/images/T-Winkle.png", name: r = "T-Winkle AI" }) {
  return /* @__PURE__ */ H.jsxs(Pp, { size: "lg", children: [
    /* @__PURE__ */ H.jsx(tS, { src: i, alt: r }),
    /* @__PURE__ */ H.jsx(eS, { children: "TW" })
  ] });
}
function sS({ mode: i, conversationId: r, startStoreId: s }) {
  const o = location.pathname.startsWith("/chat"), d = y.useRef(!1);
  y.useEffect(() => {
    if (!o) return;
    const w = document.getElementById("twinkle-ai-chat-root"), Et = document.querySelector(".chat-page > div"), Mt = () => w.style.setProperty("--chat-top", `${w.getBoundingClientRect().top}px`), kt = new ResizeObserver(Mt);
    return Et && kt.observe(Et), window.addEventListener("resize", Mt), Mt(), () => {
      kt.disconnect(), window.removeEventListener("resize", Mt);
    };
  }, [o]);
  const [m, _] = y.useState(!r && !s), [T, R] = y.useState([]), [B, U] = y.useState(), [g, N] = y.useState([]), [F, X] = y.useState([]), [at, Y] = y.useState(""), [Q, W] = y.useState(!1), [nt, G] = y.useState(""), [h, E] = y.useState(""), [S, j] = y.useState(!0), [K, st] = y.useState(!1), [et, V] = y.useState(!1), [ut, mt] = y.useState(!1), [vt, I] = y.useState(!1), [P, lt] = y.useState(), At = y.useRef(null), ft = y.useRef(!1), Ht = y.useCallback((w) => E(w instanceof Error ? w.message : "Chưa thể tải cuộc trò chuyện"), []), fe = y.useCallback(async () => {
    if (ft.current) return;
    const w = await Ml("/api/ai-chat/session");
    R(w.messages), j(w.available), st(w.handoffRecommended);
  }, []), ce = y.useCallback(async () => {
    N(await Ml(i === "inbox" ? "/api/support/inbox" : "/api/support/conversations"));
  }, [i]);
  y.useEffect(() => {
    if (i === "ai") {
      fe().catch(Ht);
      const w = () => {
        fe().catch(Ht);
      };
      return window.addEventListener("focus", w), () => window.removeEventListener("focus", w);
    }
    (i === "inbox" || o) && ce().catch(Ht);
  }, [i, fe, ce, Ht]), y.useEffect(() => {
    if (i !== "support" && i !== "inbox" && !o) return;
    let w = !0;
    const Et = new R1.Client({
      brokerURL: (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws/chat",
      connectHeaders: Zf(),
      reconnectDelay: 4e3,
      heartbeatIncoming: 1e4,
      heartbeatOutgoing: 1e4,
      onConnect: async () => {
        if (w)
          try {
            if (Et.subscribe("/user/queue/support-errors", (Mt) => {
              Ht(new Error(JSON.parse(Mt.body).message)), W(!1), ft.current = !1;
            }), Et.subscribe("/user/queue/support-inbox", (Mt) => {
              const kt = JSON.parse(Mt.body);
              kt.event === "DELETED" && kt.conversationId === r ? location.assign("/chat") : ce().catch(Ht);
            }), await ce(), i === "support" && r) {
              Et.subscribe("/user/queue/support/" + r, (ae) => {
                const ee = JSON.parse(ae.body);
                R((jt) => pf(jt, [ee])), lt((jt) => jt?.clientMessageId === ee.clientMessageId ? void 0 : jt), W(!1), ft.current = !1;
              });
              const Mt = await Ml("/api/support/conversations/" + r), kt = await Ml("/api/support/conversations/" + r + "/messages");
              if (!w) return;
              U(Mt), R((ae) => pf(ae, kt)), I(kt.length === 50);
            }
            V(!0), E("");
          } catch (Mt) {
            Ht(Mt), await Et.deactivate();
          }
      },
      onWebSocketClose: () => {
        V(!1), W(!1), ft.current = !1;
      },
      onStompError: () => {
        V(!1), W(!1), ft.current = !1, E("Kết nối Chat chưa được chấp nhận. Tải lại trang để kiểm tra phiên đăng nhập");
      }
    });
    return At.current = Et, Et.activate(), () => {
      w = !1, At.current = null, Et.deactivate();
    };
  }, [i, r, Ht, ce]), y.useEffect(() => {
    if (i !== "support" || !r || !T.length) return;
    const w = Math.max(...T.map((Mt) => Number(Mt.id)).filter(Number.isFinite));
    if (!Number.isFinite(w) || w <= 0) return;
    const Et = () => {
      document.visibilityState === "visible" && Ml("/api/support/conversations/" + r + "/read", { lastReadMessageId: w }).then(ce).catch(Ht);
    };
    return Et(), document.addEventListener("visibilitychange", Et), () => document.removeEventListener("visibilitychange", Et);
  }, [i, r, B?.internal, T, Ht]);
  async function b(w) {
    if (ft.current || !w.trim()) return;
    ft.current = !0, W(!0), E(""), Y(""), R((Mt) => [...Mt, { id: crypto.randomUUID(), role: "user", content: w }]);
    let Et = !1;
    try {
      await cS(w, (Mt, kt) => {
        Mt === "status" && G(kt.label), Mt === "done" && (st(kt.handoffRecommended), j(!kt.unavailable), Et = !!kt.unavailable), Mt === "error" && (E(kt.message), Et = !0);
      });
    } catch (Mt) {
      Ht(Mt), Et = !0;
    } finally {
      ft.current = !1, W(!1), G(""), Et && Y(w), await fe().catch(Ht);
    }
  }
  function k() {
    if (!et || !r || ft.current || !P && !at.trim()) return;
    const w = P || { clientMessageId: crypto.randomUUID(), content: at.trim() };
    lt(w), ft.current = !0, W(!0), E(""), At.current?.publish({ destination: "/app/support/" + r + "/send", body: JSON.stringify(w) }), Y(""), window.setTimeout(() => {
      ft.current = !1, W(!1);
    }, 1e4);
  }
  async function tt() {
    E("");
    try {
      await Ml("/api/ai-chat/reset", {}), R([]), st(!1), Y(""), await fe();
    } catch (w) {
      Ht(w);
    }
  }
  async function rt() {
    E("");
    try {
      X(await Ml("/api/support/handoff-options")), st(!0);
    } catch (w) {
      Ht(w);
    }
  }
  async function Rt(w, Et = !1) {
    W(!0), E("");
    try {
      const Mt = await Ml("/api/support/conversations/" + (Et ? "direct" : "handoff"), { storeId: w });
      location.assign("/chat/store/" + Mt.id);
    } catch (Mt) {
      Ht(Mt), W(!1);
    }
  }
  y.useEffect(() => {
    s && !d.current && (d.current = !0, Rt(s, !0));
  }, [s]);
  async function zt() {
    if (!(!r || !T.length)) {
      W(!0);
      try {
        const w = await Ml("/api/support/conversations/" + r + "/messages?beforeId=" + T[0].id);
        R((Et) => pf(Et, w)), I(w.length === 50);
      } catch (w) {
        Ht(w);
      } finally {
        W(!1);
      }
    }
  }
  const gt = i === "ai" ? "T-Winkle AI" : i === "inbox" ? "Hỗ trợ cửa hàng" : B?.storeName || "Chat với cửa hàng", ct = i === "ai" && T.length === 0 ? [{ id: "welcome", role: "assistant", content: rS }] : T;
  return /* @__PURE__ */ H.jsxs("div", { className: "conversation-layout" + (o ? " customer-layout" : "") + (m ? " show-list" : ""), children: [
    o && /* @__PURE__ */ H.jsxs("aside", { className: "conversation-sidebar", children: [
      /* @__PURE__ */ H.jsx("h2", { children: "Cuộc trò chuyện" }),
      /* @__PURE__ */ H.jsxs("a", { href: "/chat", className: "conversation-row" + (i === "ai" ? " selected" : ""), onClick: (w) => {
        i === "ai" && (w.preventDefault(), _(!1));
      }, children: [
        /* @__PURE__ */ H.jsx("img", { src: "/images/T-Winkle.png", alt: "" }),
        /* @__PURE__ */ H.jsxs("span", { children: [
          /* @__PURE__ */ H.jsx("strong", { children: "T-Winkle AI" }),
          /* @__PURE__ */ H.jsx("small", { children: "Trợ lý mua sắm · Ghim" })
        ] })
      ] }),
      /* @__PURE__ */ H.jsxs("div", { className: "store-threads", children: [
        !g.length && /* @__PURE__ */ H.jsx("p", { className: "notice", children: "Chưa có cuộc trò chuyện với cửa hàng" }),
        g.map((w) => /* @__PURE__ */ H.jsxs("a", { className: "conversation-row" + (w.id === r ? " selected" : ""), href: "/chat/store/" + w.id, children: [
          /* @__PURE__ */ H.jsx("img", { src: w.storeAvatar || "/images/T-Winkle.png", alt: "" }),
          /* @__PURE__ */ H.jsxs("span", { children: [
            /* @__PURE__ */ H.jsx("strong", { children: w.storeName }),
            /* @__PURE__ */ H.jsx("small", { children: w.lastMessage || w.handoffSummary }),
            w.lastMessageAt && /* @__PURE__ */ H.jsx("time", { children: new Date(w.lastMessageAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) })
          ] }),
          !!w.unreadCount && /* @__PURE__ */ H.jsx("b", { className: "unread", "aria-label": w.unreadCount + " tin nhắn chưa đọc", children: w.unreadCount })
        ] }, w.id))
      ] })
    ] }),
    /* @__PURE__ */ H.jsxs("div", { className: "chat-frame", children: [
      /* @__PURE__ */ H.jsxs("header", { className: "chat-header", children: [
        o && /* @__PURE__ */ H.jsx("button", { className: "mobile-back", "aria-label": "Danh sách cuộc trò chuyện", onClick: () => _(!0), children: /* @__PURE__ */ H.jsx(a2, { size: 18 }) }),
        /* @__PURE__ */ H.jsx(v2, { src: B?.storeAvatar, name: gt }),
        /* @__PURE__ */ H.jsxs("div", { children: [
          /* @__PURE__ */ H.jsx("h1", { children: gt }),
          /* @__PURE__ */ H.jsx("p", { children: i === "ai" ? "AI Shopping Assistant" : i === "inbox" ? "Tin nhắn khách hàng" : et ? "Đã kết nối với cửa hàng" : "Đang kết nối lại…" })
        ] }),
        /* @__PURE__ */ H.jsx("div", { className: "actions", children: i === "ai" ? /* @__PURE__ */ H.jsxs(H.Fragment, { children: [
          /* @__PURE__ */ H.jsxs("button", { onClick: rt, disabled: Q, children: [
            /* @__PURE__ */ H.jsx(C1, { size: 16, "aria-hidden": !0 }),
            " Chat với cửa hàng"
          ] }),
          /* @__PURE__ */ H.jsxs("button", { onClick: tt, disabled: Q, children: [
            /* @__PURE__ */ H.jsx(_1, { size: 16, "aria-hidden": !0 }),
            " Cuộc trò chuyện mới"
          ] }),
          !o && /* @__PURE__ */ H.jsx("button", { onClick: () => {
            mt(!ut), ce().catch(Ht);
          }, children: "Chat cửa hàng đã lưu" })
        ] }) : !o && /* @__PURE__ */ H.jsxs("a", { className: "chat-link", href: B?.internal || i === "inbox" ? "/manager/support" : "/chat", children: [
          /* @__PURE__ */ H.jsx(a2, { size: 16, "aria-hidden": !0 }),
          " Quay lại"
        ] }) })
      ] }),
      i === "inbox" || ut ? /* @__PURE__ */ H.jsxs("div", { className: "inbox notice", children: [
        !g.length && /* @__PURE__ */ H.jsx("p", { children: "Chưa có cuộc trò chuyện" }),
        g.map((w) => /* @__PURE__ */ H.jsxs("a", { href: (i === "inbox" ? "/manager/support/" : "/chat/store/") + w.id, children: [
          /* @__PURE__ */ H.jsx("strong", { children: w.storeName }),
          " · ",
          w.status === "OPEN" ? "Đang mở" : "Đã đóng",
          /* @__PURE__ */ H.jsx("p", { children: w.handoffSummary })
        ] }, w.id))
      ] }) : null,
      i !== "inbox" && /* @__PURE__ */ H.jsx(Kp, { autoScroll: !0, children: /* @__PURE__ */ H.jsxs(Jp, { className: "flex-1", children: [
        /* @__PURE__ */ H.jsx(Ip, { children: /* @__PURE__ */ H.jsxs(Fp, { className: "p-6", children: [
          vt && /* @__PURE__ */ H.jsx("button", { onClick: zt, disabled: Q, children: "Tải tin nhắn trước" }),
          ct.map((w) => {
            const Et = i === "ai" ? w.role === "user" : B?.internal ? w.senderType === "STAFF" : w.senderType === "USER";
            return /* @__PURE__ */ H.jsx(Wp, { messageId: String(w.id), children: w.senderType === "SYSTEM" ? /* @__PURE__ */ H.jsx(h2, { variant: "separator", children: /* @__PURE__ */ H.jsx(m2, { children: w.content }) }) : /* @__PURE__ */ H.jsxs(ap, { align: Et ? "end" : "start", children: [
              !Et && /* @__PURE__ */ H.jsx(up, { children: /* @__PURE__ */ H.jsx(v2, { src: w.avatar, name: w.displayName }) }),
              /* @__PURE__ */ H.jsxs(ip, { children: [
                /* @__PURE__ */ H.jsxs(cp, { children: [
                  i === "ai" ? Et ? "Bạn" : "T-Winkle AI" : w.displayName,
                  w.staffName && /* @__PURE__ */ H.jsxs("span", { children: [
                    " · Gửi bởi ",
                    w.staffName
                  ] })
                ] }),
                /* @__PURE__ */ H.jsx(lS, { variant: Et ? "default" : "muted", align: Et ? "end" : "start", children: /* @__PURE__ */ H.jsx(aS, { className: "message-text", children: w.content }) })
              ] })
            ] }) }, w.id);
          }),
          Q && i === "ai" && /* @__PURE__ */ H.jsxs(h2, { role: "status", children: [
            /* @__PURE__ */ H.jsx(iS, { children: /* @__PURE__ */ H.jsx(E1, { className: "animate-spin" }) }),
            /* @__PURE__ */ H.jsx(m2, { children: nt || "Đang xử lý…" })
          ] })
        ] }) }),
        /* @__PURE__ */ H.jsx($p, { "aria-label": "Đến tin nhắn mới nhất" })
      ] }) }),
      B?.handoffSummary && /* @__PURE__ */ H.jsxs("div", { className: "notice", children: [
        B.orderCode && /* @__PURE__ */ H.jsxs(H.Fragment, { children: [
          "Đơn ",
          B.orderCode,
          " · "
        ] }),
        B.handoffSummary
      ] }),
      i === "ai" && !S && /* @__PURE__ */ H.jsx("div", { className: "notice", children: oS }),
      h && /* @__PURE__ */ H.jsx("div", { className: "notice error", role: "alert", children: h }),
      o && B?.status === "CLOSED" && /* @__PURE__ */ H.jsxs("div", { className: "notice", children: [
        "Cuộc trò chuyện đã đóng ",
        /* @__PURE__ */ H.jsx("button", { disabled: Q, onClick: () => Rt(B.storeId, !0), children: "Trò chuyện lại" })
      ] }),
      i === "ai" && K && /* @__PURE__ */ H.jsx("div", { className: "notice", children: "Nhân viên cửa hàng có thể hỗ trợ bạn trực tiếp" }),
      /* @__PURE__ */ H.jsx(Jb, { open: i === "ai" && F.length > 0, onOpenChange: (w) => {
        w || X([]);
      }, children: /* @__PURE__ */ H.jsx(Wb, { container: document.getElementById("twinkle-ai-chat-root"), children: /* @__PURE__ */ H.jsxs($b, { className: "store-options", children: [
        /* @__PURE__ */ H.jsx(n1, { children: "Chọn cửa hàng" }),
        /* @__PURE__ */ H.jsx(a1, { className: "sr-only", children: "Chọn cửa hàng để trò chuyện" }),
        /* @__PURE__ */ H.jsx(i1, { className: "store-dialog-close", "aria-label": "Đóng", children: /* @__PURE__ */ H.jsx(A1, { size: 18 }) }),
        F.map((w) => /* @__PURE__ */ H.jsxs("article", { children: [
          /* @__PURE__ */ H.jsxs("div", { children: [
            /* @__PURE__ */ H.jsx("strong", { children: w.storeName }),
            /* @__PURE__ */ H.jsx("p", { children: w.address }),
            /* @__PURE__ */ H.jsx("small", { className: w.status === "OPEN" ? "store-open" : "store-closed", children: w.status === "OPEN" ? "Đang mở" : "Đã đóng" })
          ] }),
          /* @__PURE__ */ H.jsx("button", { disabled: Q, onClick: () => Rt(w.storeId), children: "Chuyển" })
        ] }, w.storeId))
      ] }) }) }),
      i !== "inbox" && /* @__PURE__ */ H.jsxs("form", { className: "composer", onSubmit: (w) => {
        w.preventDefault(), i === "ai" ? b(at) : k();
      }, children: [
        /* @__PURE__ */ H.jsx(
          "textarea",
          {
            rows: 1,
            "aria-label": "Tin nhắn",
            placeholder: "Nhập tin nhắn của bạn…",
            maxLength: 2e3,
            value: at,
            onChange: (w) => Y(w.target.value),
            disabled: Q || B?.status === "CLOSED",
            onKeyDown: (w) => {
              w.key === "Enter" && !w.shiftKey && (w.preventDefault(), i === "ai" ? b(at) : k());
            }
          }
        ),
        /* @__PURE__ */ H.jsxs("button", { className: "send-button", type: "submit", disabled: Q || i === "support" && (!et || B?.status === "CLOSED") || !at.trim() && !P, children: [
          /* @__PURE__ */ H.jsx(T1, { size: 18, "aria-hidden": !0 }),
          " ",
          P ? "Thử gửi lại" : !S && at ? "Thử lại" : "Gửi"
        ] })
      ] })
    ] })
  ] });
}
const eu = document.getElementById("twinkle-ai-chat-root");
eu && nb.createRoot(eu).render(/* @__PURE__ */ H.jsx(g2.StrictMode, { children: /* @__PURE__ */ H.jsx(sS, { mode: eu.dataset.mode || "ai", conversationId: eu.dataset.conversationId ? Number(eu.dataset.conversationId) : void 0, startStoreId: eu.dataset.startStoreId ? Number(eu.dataset.startStoreId) : void 0 }) }));
