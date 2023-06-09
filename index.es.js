var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function _mergeNamespaces(n, m) {
  m.forEach(function(e) {
    e && typeof e !== "string" && !Array.isArray(e) && Object.keys(e).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
class Theme {
  constructor(theme) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "cnName");
    __publicField(this, "data");
    __publicField(this, "extends");
    __publicField(this, "isDark");
    __publicField(this, "isPreview");
    __publicField(this, "isExtendable");
    __publicField(this, "extra");
    this.id = theme.id;
    this.name = theme.name;
    this.cnName = theme.cnName || this.name;
    this.data = theme.data;
    this.extends = theme.extends || null;
    this.isDark = theme.isDark || void 0;
    this.isPreview = theme.isPreview || false;
    this.isExtendable = theme.isExtendable || true;
  }
}
/*!
 * css-vars-ponyfill
 * v2.4.7
 * https://jhildenbiddle.github.io/css-vars-ponyfill/
 * (c) 2018-2021 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
/*!
 * get-css-data
 * v2.0.2
 * https://github.com/jhildenbiddle/get-css-data
 * (c) 2018-2021 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
function getUrls(urls) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var settings = {
    mimeType: options.mimeType || null,
    onBeforeSend: options.onBeforeSend || Function.prototype,
    onSuccess: options.onSuccess || Function.prototype,
    onError: options.onError || Function.prototype,
    onComplete: options.onComplete || Function.prototype
  };
  var urlArray = Array.isArray(urls) ? urls : [urls];
  var urlQueue = Array.apply(null, Array(urlArray.length)).map(function(x) {
    return null;
  });
  function isValidCss(text) {
    var isString = typeof text === "string";
    var isHTML = isString && text.trim().charAt(0) === "<";
    return isString && !isHTML;
  }
  function onError2(xhr, urlIndex) {
    settings.onError(xhr, urlArray[urlIndex], urlIndex);
  }
  function onSuccess2(responseText, urlIndex) {
    var returnVal = settings.onSuccess(responseText, urlArray[urlIndex], urlIndex);
    responseText = returnVal === false ? "" : returnVal || responseText;
    urlQueue[urlIndex] = responseText;
    if (urlQueue.indexOf(null) === -1) {
      settings.onComplete(urlQueue);
    }
  }
  var parser = document.createElement("a");
  urlArray.forEach(function(url, i) {
    parser.setAttribute("href", url);
    parser.href = String(parser.href);
    var isIElte9 = Boolean(document.all && !window.atob);
    var isIElte9CORS = isIElte9 && parser.host.split(":")[0] !== location.host.split(":")[0];
    if (isIElte9CORS) {
      var isSameProtocol = parser.protocol === location.protocol;
      if (isSameProtocol) {
        var xdr = new XDomainRequest();
        xdr.open("GET", url);
        xdr.timeout = 0;
        xdr.onprogress = Function.prototype;
        xdr.ontimeout = Function.prototype;
        xdr.onload = function() {
          var text = xdr.responseText;
          if (isValidCss(text)) {
            onSuccess2(text, i);
          } else {
            onError2(xdr, i);
          }
        };
        xdr.onerror = function(err) {
          onError2(xdr, i);
        };
        setTimeout(function() {
          xdr.send();
        }, 0);
      } else {
        console.warn("Internet Explorer 9 Cross-Origin (CORS) requests must use the same protocol (".concat(url, ")"));
        onError2(null, i);
      }
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if (settings.mimeType && xhr.overrideMimeType) {
        xhr.overrideMimeType(settings.mimeType);
      }
      settings.onBeforeSend(xhr, url, i);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var text = xhr.responseText;
          if (xhr.status < 400 && isValidCss(text)) {
            onSuccess2(text, i);
          } else if (xhr.status === 0 && isValidCss(text)) {
            onSuccess2(text, i);
          } else {
            onError2(xhr, i);
          }
        }
      };
      xhr.send();
    }
  });
}
/**
 * Gets CSS data from <style> and <link> nodes (including @imports), then
 * returns data in order processed by DOM. Allows specifying nodes to
 * include/exclude and filtering CSS data using RegEx.
 *
 * @preserve
 * @param {object}   [options] The options object
 * @param {object}   [options.rootElement=document] Root element to traverse for
 *                   <link> and <style> nodes.
 * @param {string}   [options.include] CSS selector matching <link> and <style>
 *                   nodes to include
 * @param {string}   [options.exclude] CSS selector matching <link> and <style>
 *                   nodes to exclude
 * @param {object}   [options.filter] Regular expression used to filter node CSS
 *                   data. Each block of CSS data is tested against the filter,
 *                   and only matching data is included.
 * @param {boolean}  [options.skipDisabled=true] Determines if disabled
 *                   stylesheets will be skipped while collecting CSS data.
 * @param {boolean}  [options.useCSSOM=false] Determines if CSS data will be
 *                   collected from a stylesheet's runtime values instead of its
 *                   text content. This is required to get accurate CSS data
 *                   when a stylesheet has been modified using the deleteRule()
 *                   or insertRule() methods because these modifications will
 *                   not be reflected in the stylesheet's text content.
 * @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
 *                   1) the XHR object, 2) source node reference, and 3) the
 *                   source URL as arguments.
 * @param {function} [options.onSuccess] Callback on each CSS node read. Passes
 *                   1) CSS text, 2) source node reference, and 3) the source
 *                   URL as arguments.
 * @param {function} [options.onError] Callback on each error. Passes 1) the XHR
 *                   object for inspection, 2) soure node reference, and 3) the
 *                   source URL that failed (either a <link> href or an @import)
 *                   as arguments
 * @param {function} [options.onComplete] Callback after all nodes have been
 *                   processed. Passes 1) concatenated CSS text, 2) an array of
 *                   CSS text in DOM order, and 3) an array of nodes in DOM
 *                   order as arguments.
 *
 * @example
 *
 *   getCssData({
 *     rootElement : document,
 *     include     : 'style,link[rel="stylesheet"]',
 *     exclude     : '[href="skip.css"]',
 *     filter      : /red/,
 *     skipDisabled: true,
 *     useCSSOM    : false,
 *     onBeforeSend(xhr, node, url) {
 *       // ...
 *     }
 *     onSuccess(cssText, node, url) {
 *       // ...
 *     }
 *     onError(xhr, node, url) {
 *       // ...
 *     },
 *     onComplete(cssText, cssArray, nodeArray) {
 *       // ...
 *     }
 *   });
 */
function getCssData(options) {
  var regex2 = {
    cssComments: /\/\*[\s\S]+?\*\//g,
    cssImports: /(?:@import\s*)(?:url\(\s*)?(?:['"])([^'"]*)(?:['"])(?:\s*\))?(?:[^;]*;)/g
  };
  var settings = {
    rootElement: options.rootElement || document,
    include: options.include || 'style,link[rel="stylesheet"]',
    exclude: options.exclude || null,
    filter: options.filter || null,
    skipDisabled: options.skipDisabled !== false,
    useCSSOM: options.useCSSOM || false,
    onBeforeSend: options.onBeforeSend || Function.prototype,
    onSuccess: options.onSuccess || Function.prototype,
    onError: options.onError || Function.prototype,
    onComplete: options.onComplete || Function.prototype
  };
  var sourceNodes = Array.apply(null, settings.rootElement.querySelectorAll(settings.include)).filter(function(node) {
    return !matchesSelector(node, settings.exclude);
  });
  var cssArray = Array.apply(null, Array(sourceNodes.length)).map(function(x) {
    return null;
  });
  function handleComplete() {
    var isComplete = cssArray.indexOf(null) === -1;
    if (isComplete) {
      cssArray.reduce(function(skipIndices, value, i) {
        if (value === "") {
          skipIndices.push(i);
        }
        return skipIndices;
      }, []).reverse().forEach(function(skipIndex) {
        return [sourceNodes, cssArray].forEach(function(arr) {
          return arr.splice(skipIndex, 1);
        });
      });
      var cssText = cssArray.join("");
      settings.onComplete(cssText, cssArray, sourceNodes);
    }
  }
  function handleSuccess(cssText, cssIndex, node, sourceUrl) {
    var returnVal = settings.onSuccess(cssText, node, sourceUrl);
    cssText = returnVal !== void 0 && Boolean(returnVal) === false ? "" : returnVal || cssText;
    resolveImports(cssText, node, sourceUrl, function(resolvedCssText, errorData) {
      if (cssArray[cssIndex] === null) {
        errorData.forEach(function(data) {
          return settings.onError(data.xhr, node, data.url);
        });
        if (!settings.filter || settings.filter.test(resolvedCssText)) {
          cssArray[cssIndex] = resolvedCssText;
        } else {
          cssArray[cssIndex] = "";
        }
        handleComplete();
      }
    });
  }
  function parseImportData(cssText, baseUrl) {
    var ignoreRules = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    var importData = {};
    importData.rules = (cssText.replace(regex2.cssComments, "").match(regex2.cssImports) || []).filter(function(rule) {
      return ignoreRules.indexOf(rule) === -1;
    });
    importData.urls = importData.rules.map(function(rule) {
      return rule.replace(regex2.cssImports, "$1");
    });
    importData.absoluteUrls = importData.urls.map(function(url) {
      return getFullUrl$1(url, baseUrl);
    });
    importData.absoluteRules = importData.rules.map(function(rule, i) {
      var oldUrl = importData.urls[i];
      var newUrl = getFullUrl$1(importData.absoluteUrls[i], baseUrl);
      return rule.replace(oldUrl, newUrl);
    });
    return importData;
  }
  function resolveImports(cssText, node, baseUrl, callbackFn) {
    var __errorData = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [];
    var __errorRules = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [];
    var importData = parseImportData(cssText, baseUrl, __errorRules);
    if (importData.rules.length) {
      getUrls(importData.absoluteUrls, {
        onBeforeSend: function onBeforeSend2(xhr, url, urlIndex) {
          settings.onBeforeSend(xhr, node, url);
        },
        onSuccess: function onSuccess2(cssText2, url, urlIndex) {
          var returnVal = settings.onSuccess(cssText2, node, url);
          cssText2 = returnVal === false ? "" : returnVal || cssText2;
          var responseImportData = parseImportData(cssText2, url, __errorRules);
          responseImportData.rules.forEach(function(rule, i) {
            cssText2 = cssText2.replace(rule, responseImportData.absoluteRules[i]);
          });
          return cssText2;
        },
        onError: function onError2(xhr, url, urlIndex) {
          __errorData.push({
            xhr,
            url
          });
          __errorRules.push(importData.rules[urlIndex]);
          resolveImports(cssText, node, baseUrl, callbackFn, __errorData, __errorRules);
        },
        onComplete: function onComplete2(responseArray) {
          responseArray.forEach(function(importText, i) {
            cssText = cssText.replace(importData.rules[i], importText);
          });
          resolveImports(cssText, node, baseUrl, callbackFn, __errorData, __errorRules);
        }
      });
    } else {
      callbackFn(cssText, __errorData);
    }
  }
  if (sourceNodes.length) {
    sourceNodes.forEach(function(node, i) {
      var linkHref = node.getAttribute("href");
      var linkRel = node.getAttribute("rel");
      var isLink = node.nodeName.toLowerCase() === "link" && linkHref && linkRel && linkRel.toLowerCase().indexOf("stylesheet") !== -1;
      var isSkip = settings.skipDisabled === false ? false : node.disabled;
      var isStyle = node.nodeName.toLowerCase() === "style";
      if (isLink && !isSkip) {
        getUrls(linkHref, {
          mimeType: "text/css",
          onBeforeSend: function onBeforeSend2(xhr, url, urlIndex) {
            settings.onBeforeSend(xhr, node, url);
          },
          onSuccess: function onSuccess2(cssText2, url, urlIndex) {
            var sourceUrl = getFullUrl$1(linkHref);
            handleSuccess(cssText2, i, node, sourceUrl);
          },
          onError: function onError2(xhr, url, urlIndex) {
            cssArray[i] = "";
            settings.onError(xhr, node, url);
            handleComplete();
          }
        });
      } else if (isStyle && !isSkip) {
        var cssText = node.textContent;
        if (settings.useCSSOM) {
          cssText = Array.apply(null, node.sheet.cssRules).map(function(rule) {
            return rule.cssText;
          }).join("");
        }
        handleSuccess(cssText, i, node, location.href);
      } else {
        cssArray[i] = "";
        handleComplete();
      }
    });
  } else {
    settings.onComplete("", []);
  }
}
function getFullUrl$1(url, base) {
  var d = document.implementation.createHTMLDocument("");
  var b = d.createElement("base");
  var a = d.createElement("a");
  d.head.appendChild(b);
  d.body.appendChild(a);
  b.href = base || document.baseURI || (document.querySelector("base") || {}).href || location.href;
  a.href = url;
  return a.href;
}
function matchesSelector(elm, selector) {
  var matches = elm.matches || elm.matchesSelector || elm.webkitMatchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector || elm.oMatchesSelector;
  return matches.call(elm, selector);
}
var balancedMatch = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp)
    a = maybeMatch(a, str);
  if (b instanceof RegExp)
    b = maybeMatch(b, str);
  var r = range(a, b, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}
function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}
balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [begs.pop(), bi];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length) {
      result = [left, right];
    }
  }
  return result;
}
function parseCss(css) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var defaults2 = {
    preserveStatic: true,
    removeComments: false
  };
  var settings = _extends({}, defaults2, options);
  var errors = [];
  function error(msg) {
    throw new Error("CSS parse error: ".concat(msg));
  }
  function match(re) {
    var m = re.exec(css);
    if (m) {
      css = css.slice(m[0].length);
      return m;
    }
  }
  function open() {
    return match(/^{\s*/);
  }
  function close() {
    return match(/^}/);
  }
  function whitespace() {
    match(/^\s*/);
  }
  function comment() {
    whitespace();
    if (css[0] !== "/" || css[1] !== "*") {
      return;
    }
    var i = 2;
    while (css[i] && (css[i] !== "*" || css[i + 1] !== "/")) {
      i++;
    }
    if (!css[i]) {
      return error("end of comment is missing");
    }
    var str = css.slice(2, i);
    css = css.slice(i + 2);
    return {
      type: "comment",
      comment: str
    };
  }
  function comments() {
    var cmnts = [];
    var c;
    while (c = comment()) {
      cmnts.push(c);
    }
    return settings.removeComments ? [] : cmnts;
  }
  function selector() {
    whitespace();
    while (css[0] === "}") {
      error("extra closing bracket");
    }
    var m = match(/^(("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^{])+)/);
    if (m) {
      var _selector = m[0].trim();
      var selectorItems;
      var hasComment = /\/\*/.test(_selector);
      if (hasComment) {
        _selector = _selector.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "");
      }
      var hasCommaInQuotes = /["']\w*,\w*["']/.test(_selector);
      if (hasCommaInQuotes) {
        _selector = _selector.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m2) {
          return m2.replace(/,/g, "\u200C");
        });
      }
      var hasMultipleSelectors = /,/.test(_selector);
      if (hasMultipleSelectors) {
        selectorItems = _selector.split(/\s*(?![^(]*\)),\s*/);
      } else {
        selectorItems = [_selector];
      }
      if (hasCommaInQuotes) {
        selectorItems = selectorItems.map(function(s) {
          return s.replace(/\u200C/g, ",");
        });
      }
      return selectorItems;
    }
  }
  function declaration() {
    if (css[0] === "@") {
      return at_rule();
    }
    match(/^([;\s]*)+/);
    var comment_regexp = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
    var prop = match(/^(\*?[-#/*\\\w.]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) {
      return;
    }
    prop = prop[0].trim();
    if (!match(/^:\s*/)) {
      return error("property missing ':'");
    }
    var val = match(/^((?:\/\*.*?\*\/|'(?:\\'|.)*?'|"(?:\\"|.)*?"|\((\s*'(?:\\'|.)*?'|"(?:\\"|.)*?"|[^)]*?)\s*\)|[^};])+)/);
    var ret = {
      type: "declaration",
      property: prop.replace(comment_regexp, ""),
      value: val ? val[0].replace(comment_regexp, "").trim() : ""
    };
    match(/^[;\s]*/);
    return ret;
  }
  function declarations() {
    if (!open()) {
      return error("missing '{'");
    }
    var d;
    var decls = comments();
    while (d = declaration()) {
      decls.push(d);
      decls = decls.concat(comments());
    }
    if (!close()) {
      return error("missing '}'");
    }
    return decls;
  }
  function keyframe() {
    whitespace();
    var vals = [];
    var m;
    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }
    if (vals.length) {
      return {
        type: "keyframe",
        values: vals,
        declarations: declarations()
      };
    }
  }
  function at_keyframes() {
    var m = match(/^@([-\w]+)?keyframes\s*/);
    if (!m) {
      return;
    }
    var vendor = m[1];
    m = match(/^([-\w]+)\s*/);
    if (!m) {
      return error("@keyframes missing name");
    }
    var name = m[1];
    if (!open()) {
      return error("@keyframes missing '{'");
    }
    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }
    if (!close()) {
      return error("@keyframes missing '}'");
    }
    return {
      type: "keyframes",
      name,
      vendor,
      keyframes: frames
    };
  }
  function at_page() {
    var m = match(/^@page */);
    if (m) {
      var sel = selector() || [];
      return {
        type: "page",
        selectors: sel,
        declarations: declarations()
      };
    }
  }
  function at_page_margin_box() {
    var m = match(/@(top|bottom|left|right)-(left|center|right|top|middle|bottom)-?(corner)?\s*/);
    if (m) {
      var name = "".concat(m[1], "-").concat(m[2]) + (m[3] ? "-".concat(m[3]) : "");
      return {
        type: "page-margin-box",
        name,
        declarations: declarations()
      };
    }
  }
  function at_fontface() {
    var m = match(/^@font-face\s*/);
    if (m) {
      return {
        type: "font-face",
        declarations: declarations()
      };
    }
  }
  function at_supports() {
    var m = match(/^@supports *([^{]+)/);
    if (m) {
      return {
        type: "supports",
        supports: m[1].trim(),
        rules: rules()
      };
    }
  }
  function at_host() {
    var m = match(/^@host\s*/);
    if (m) {
      return {
        type: "host",
        rules: rules()
      };
    }
  }
  function at_media() {
    var m = match(/^@media([^{]+)*/);
    if (m) {
      return {
        type: "media",
        media: (m[1] || "").trim(),
        rules: rules()
      };
    }
  }
  function at_custom_m() {
    var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
    if (m) {
      return {
        type: "custom-media",
        name: m[1].trim(),
        media: m[2].trim()
      };
    }
  }
  function at_document() {
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (m) {
      return {
        type: "document",
        document: m[2].trim(),
        vendor: m[1] ? m[1].trim() : null,
        rules: rules()
      };
    }
  }
  function at_x() {
    var m = match(/^@(import|charset|namespace)\s*([^;]+);/);
    if (m) {
      return {
        type: m[1],
        name: m[2].trim()
      };
    }
  }
  function at_rule() {
    whitespace();
    if (css[0] === "@") {
      var ret = at_x() || at_fontface() || at_media() || at_keyframes() || at_supports() || at_document() || at_custom_m() || at_host() || at_page() || at_page_margin_box();
      if (ret && !settings.preserveStatic) {
        var hasVarFunc = false;
        if (ret.declarations) {
          hasVarFunc = ret.declarations.some(function(decl) {
            return /var\(/.test(decl.value);
          });
        } else {
          var arr = ret.keyframes || ret.rules || [];
          hasVarFunc = arr.some(function(obj) {
            return (obj.declarations || []).some(function(decl) {
              return /var\(/.test(decl.value);
            });
          });
        }
        return hasVarFunc ? ret : {};
      }
      return ret;
    }
  }
  function rule() {
    if (!settings.preserveStatic) {
      var balancedMatch$1 = balancedMatch("{", "}", css);
      if (balancedMatch$1) {
        var hasVarDecl = /:(?:root|host)(?![.:#(])/.test(balancedMatch$1.pre) && /--\S*\s*:/.test(balancedMatch$1.body);
        var hasVarFunc = /var\(/.test(balancedMatch$1.body);
        if (!hasVarDecl && !hasVarFunc) {
          css = css.slice(balancedMatch$1.end + 1);
          return {};
        }
      }
    }
    var sel = selector() || [];
    var decls = settings.preserveStatic ? declarations() : declarations().filter(function(decl) {
      var hasVarDecl2 = sel.some(function(s) {
        return /:(?:root|host)(?![.:#(])/.test(s);
      }) && /^--\S/.test(decl.property);
      var hasVarFunc2 = /var\(/.test(decl.value);
      return hasVarDecl2 || hasVarFunc2;
    });
    if (!sel.length) {
      error("selector missing");
    }
    return {
      type: "rule",
      selectors: sel,
      declarations: decls
    };
  }
  function rules(core) {
    if (!core && !open()) {
      return error("missing '{'");
    }
    var node;
    var rules2 = comments();
    while (css.length && (core || css[0] !== "}") && (node = at_rule() || rule())) {
      if (node.type) {
        rules2.push(node);
      }
      rules2 = rules2.concat(comments());
    }
    if (!core && !close()) {
      return error("missing '}'");
    }
    return rules2;
  }
  return {
    type: "stylesheet",
    stylesheet: {
      rules: rules(true),
      errors
    }
  };
}
function parseVars(cssData) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var defaults2 = {
    parseHost: false,
    store: {},
    onWarning: function onWarning2() {
    }
  };
  var settings = _extends({}, defaults2, options);
  var reVarDeclSelectors = new RegExp(":".concat(settings.parseHost ? "host" : "root", "$"));
  if (typeof cssData === "string") {
    cssData = parseCss(cssData, settings);
  }
  cssData.stylesheet.rules.forEach(function(rule) {
    if (rule.type !== "rule" || !rule.selectors.some(function(s) {
      return reVarDeclSelectors.test(s);
    })) {
      return;
    }
    rule.declarations.forEach(function(decl, i) {
      var prop = decl.property;
      var value = decl.value;
      if (prop && prop.indexOf("--") === 0) {
        settings.store[prop] = value;
      }
    });
  });
  return settings.store;
}
function stringifyCss(tree) {
  var delim = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  var cb = arguments.length > 2 ? arguments[2] : void 0;
  var renderMethods = {
    charset: function charset(node) {
      return "@charset " + node.name + ";";
    },
    comment: function comment(node) {
      return node.comment.indexOf("__CSSVARSPONYFILL") === 0 ? "/*" + node.comment + "*/" : "";
    },
    "custom-media": function customMedia(node) {
      return "@custom-media " + node.name + " " + node.media + ";";
    },
    declaration: function declaration(node) {
      return node.property + ":" + node.value + ";";
    },
    document: function document2(node) {
      return "@" + (node.vendor || "") + "document " + node.document + "{" + visit(node.rules) + "}";
    },
    "font-face": function fontFace(node) {
      return "@font-face{" + visit(node.declarations) + "}";
    },
    host: function host(node) {
      return "@host{" + visit(node.rules) + "}";
    },
    import: function _import(node) {
      return "@import " + node.name + ";";
    },
    keyframe: function keyframe(node) {
      return node.values.join(",") + "{" + visit(node.declarations) + "}";
    },
    keyframes: function keyframes(node) {
      return "@" + (node.vendor || "") + "keyframes " + node.name + "{" + visit(node.keyframes) + "}";
    },
    media: function media(node) {
      return "@media " + node.media + "{" + visit(node.rules) + "}";
    },
    namespace: function namespace(node) {
      return "@namespace " + node.name + ";";
    },
    page: function page(node) {
      return "@page " + (node.selectors.length ? node.selectors.join(", ") : "") + "{" + visit(node.declarations) + "}";
    },
    "page-margin-box": function pageMarginBox(node) {
      return "@" + node.name + "{" + visit(node.declarations) + "}";
    },
    rule: function rule(node) {
      var decls = node.declarations;
      if (decls.length) {
        return node.selectors.join(",") + "{" + visit(decls) + "}";
      }
    },
    supports: function supports(node) {
      return "@supports " + node.supports + "{" + visit(node.rules) + "}";
    }
  };
  function visit(nodes) {
    var buf = "";
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (cb) {
        cb(n);
      }
      var txt = renderMethods[n.type](n);
      if (txt) {
        buf += txt;
        if (txt.length && n.selectors) {
          buf += delim;
        }
      }
    }
    return buf;
  }
  return visit(tree.stylesheet.rules);
}
function walkCss(node, fn) {
  node.rules.forEach(function(rule) {
    if (rule.rules) {
      walkCss(rule, fn);
      return;
    }
    if (rule.keyframes) {
      rule.keyframes.forEach(function(keyframe) {
        if (keyframe.type === "keyframe") {
          fn(keyframe.declarations, rule);
        }
      });
      return;
    }
    if (!rule.declarations) {
      return;
    }
    fn(rule.declarations, node);
  });
}
var VAR_PROP_IDENTIFIER = "--";
var VAR_FUNC_IDENTIFIER = "var";
function transformCss(cssData) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var defaults2 = {
    preserveStatic: true,
    preserveVars: false,
    variables: {},
    onWarning: function onWarning2() {
    }
  };
  var settings = _extends({}, defaults2, options);
  if (typeof cssData === "string") {
    cssData = parseCss(cssData, settings);
  }
  walkCss(cssData.stylesheet, function(declarations, node) {
    for (var i = 0; i < declarations.length; i++) {
      var decl = declarations[i];
      var type = decl.type;
      var prop = decl.property;
      var value = decl.value;
      if (type !== "declaration") {
        continue;
      }
      if (!settings.preserveVars && prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
        declarations.splice(i, 1);
        i--;
        continue;
      }
      if (value.indexOf(VAR_FUNC_IDENTIFIER + "(") !== -1) {
        var resolvedValue = resolveValue(value, settings);
        if (resolvedValue !== decl.value) {
          resolvedValue = fixNestedCalc(resolvedValue);
          if (!settings.preserveVars) {
            decl.value = resolvedValue;
          } else {
            declarations.splice(i, 0, {
              type,
              property: prop,
              value: resolvedValue
            });
            i++;
          }
        }
      }
    }
  });
  return stringifyCss(cssData);
}
function fixNestedCalc(value) {
  var reCalcVal = /calc\(([^)]+)\)/g;
  (value.match(reCalcVal) || []).forEach(function(match) {
    var newVal = "calc".concat(match.split("calc").join(""));
    value = value.replace(match, newVal);
  });
  return value;
}
function resolveValue(value) {
  var settings = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var __recursiveFallback = arguments.length > 2 ? arguments[2] : void 0;
  if (value.indexOf("var(") === -1) {
    return value;
  }
  var valueData = balancedMatch("(", ")", value);
  function resolveFunc(value2) {
    var name = value2.split(",")[0].replace(/[\s\n\t]/g, "");
    var fallback = (value2.match(/(?:\s*,\s*){1}(.*)?/) || [])[1];
    var match = Object.prototype.hasOwnProperty.call(settings.variables, name) ? String(settings.variables[name]) : void 0;
    var replacement = match || (fallback ? String(fallback) : void 0);
    var unresolvedFallback = __recursiveFallback || value2;
    if (!match) {
      settings.onWarning('variable "'.concat(name, '" is undefined'));
    }
    if (replacement && replacement !== "undefined" && replacement.length > 0) {
      return resolveValue(replacement, settings, unresolvedFallback);
    } else {
      return "var(".concat(unresolvedFallback, ")");
    }
  }
  if (!valueData) {
    if (value.indexOf("var(") !== -1) {
      settings.onWarning('missing closing ")" in the value "'.concat(value, '"'));
    }
    return value;
  } else if (valueData.pre.slice(-3) === "var") {
    var isEmptyVarFunc = valueData.body.trim().length === 0;
    if (isEmptyVarFunc) {
      settings.onWarning("var() must contain a non-whitespace string");
      return value;
    } else {
      return valueData.pre.slice(0, -3) + resolveFunc(valueData.body) + resolveValue(valueData.post, settings);
    }
  } else {
    return valueData.pre + "(".concat(resolveValue(valueData.body, settings), ")") + resolveValue(valueData.post, settings);
  }
}
var isBrowser = typeof window !== "undefined";
var isNativeSupport = isBrowser && window.CSS && window.CSS.supports && window.CSS.supports("(--a: 0)");
var counters = {
  group: 0,
  job: 0
};
var defaults = {
  rootElement: isBrowser ? document : null,
  shadowDOM: false,
  include: "style,link[rel=stylesheet]",
  exclude: "",
  variables: {},
  onlyLegacy: true,
  preserveStatic: true,
  preserveVars: false,
  silent: false,
  updateDOM: true,
  updateURLs: true,
  watch: null,
  onBeforeSend: function onBeforeSend() {
  },
  onError: function onError() {
  },
  onWarning: function onWarning() {
  },
  onSuccess: function onSuccess() {
  },
  onComplete: function onComplete() {
  },
  onFinally: function onFinally() {
  }
};
var regex = {
  cssComments: /\/\*[\s\S]+?\*\//g,
  cssKeyframes: /@(?:-\w*-)?keyframes/,
  cssMediaQueries: /@media[^{]+\{([\s\S]+?})\s*}/g,
  cssUrls: /url\((?!['"]?(?:data|http|\/\/):)['"]?([^'")]*)['"]?\)/g,
  cssVarDeclRules: /(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^}]*})/g,
  cssVarDecls: /(?:[\s;]*)(-{2}\w[\w-]*)(?:\s*:\s*)([^;]*);/g,
  cssVarFunc: /var\(\s*--[\w-]/,
  cssVars: /(?:(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^;]*;*\s*)|(?:var\(\s*))(--[^:)]+)(?:\s*[:)])/
};
var variableStore = {
  dom: {},
  job: {},
  user: {}
};
var cssVarsIsRunning = false;
var cssVarsObserver = null;
var cssVarsSrcNodeCount = 0;
var debounceTimer = null;
var isShadowDOMReady = false;
/**
 * Fetches, parses, and transforms CSS custom properties from specified
 * <style> and <link> elements into static values, then appends a new <style>
 * element with static values to the DOM to provide CSS custom property
 * compatibility for legacy browsers. Also provides a single interface for
 * live updates of runtime values in both modern and legacy browsers.
 *
 * @preserve
 * @param {object}   [options] Options object
 * @param {object}   [options.rootElement=document] Root element to traverse for
 *                   <link> and <style> nodes
 * @param {boolean}  [options.shadowDOM=false] Determines if shadow DOM <link>
 *                   and <style> nodes will be processed.
 * @param {string}   [options.include="style,link[rel=stylesheet]"] CSS selector
 *                   matching <link re="stylesheet"> and <style> nodes to
 *                   process
 * @param {string}   [options.exclude] CSS selector matching <link
 *                   rel="stylehseet"> and <style> nodes to exclude from those
 *                   matches by options.include
 * @param {object}   [options.variables] A map of custom property name/value
 *                   pairs. Property names can omit or include the leading
 *                   double-hyphen (—), and values specified will override
 *                   previous values
 * @param {boolean}  [options.onlyLegacy=true] Determines if the ponyfill will
 *                   only generate legacy-compatible CSS in browsers that lack
 *                   native support (i.e., legacy browsers)
 * @param {boolean}  [options.preserveStatic=true] Determines if CSS
 *                   declarations that do not reference a custom property will
 *                   be preserved in the transformed CSS
 * @param {boolean}  [options.preserveVars=false] Determines if CSS custom
 *                   property declarations will be preserved in the transformed
 *                   CSS
 * @param {boolean}  [options.silent=false] Determines if warning and error
 *                   messages will be displayed on the console
 * @param {boolean}  [options.updateDOM=true] Determines if the ponyfill will
 *                   update the DOM after processing CSS custom properties
 * @param {boolean}  [options.updateURLs=true] Determines if relative url()
 *                   paths will be converted to absolute urls in external CSS
 * @param {boolean}  [options.watch=false] Determines if a MutationObserver will
 *                   be created that will execute the ponyfill when a <link> or
 *                   <style> DOM mutation is observed
 * @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
 *                   1) the XHR object, 2) source node reference, and 3) the
 *                   source URL as arguments
 * @param {function} [options.onError] Callback after a CSS parsing error has
 *                   occurred or an XHR request has failed. Passes 1) an error
 *                   message, and 2) source node reference, 3) xhr, and 4 url as
 *                   arguments.
 * @param {function} [options.onWarning] Callback after each CSS parsing warning
 *                   has occurred. Passes 1) a warning message as an argument.
 * @param {function} [options.onSuccess] Callback after CSS data has been
 *                   collected from each node and before CSS custom properties
 *                   have been transformed. Allows modifying the CSS data before
 *                   it is transformed by returning any string value (or false
 *                   to skip). Passes 1) CSS text, 2) source node reference, and
 *                   3) the source URL as arguments.
 * @param {function} [options.onComplete] Callback after all CSS has been
 *                   processed, legacy-compatible CSS has been generated, and
 *                   (optionally) the DOM has been updated. Passes 1) a CSS
 *                   string with CSS variable values resolved, 2) an array of
 *                   output <style> node references that have been appended to
 *                   the DOM, 3) an object containing all custom properies names
 *                   and values, and 4) the ponyfill execution time in
 *                   milliseconds.
 * @param {function} [options.onFinally] Callback in modern and legacy browsers
 *                   after the ponyfill has finished all tasks. Passes 1) a
 *                   boolean indicating if the last ponyfill call resulted in a
 *                   style change, 2) a boolean indicating if the current
 *                   browser provides native support for CSS custom properties,
 *                   and 3) the ponyfill execution time in milliseconds.
 * @example
 *
 *   cssVars({
 *     rootElement   : document,
 *     shadowDOM     : false,
 *     include       : 'style,link[rel="stylesheet"]',
 *     exclude       : '',
 *     variables     : {},
 *     onlyLegacy    : true,
 *     preserveStatic: true,
 *     preserveVars  : false,
 *     silent        : false,
 *     updateDOM     : true,
 *     updateURLs    : true,
 *     watch         : false,
 *     onBeforeSend(xhr, node, url) {},
 *     onError(message, node, xhr, url) {},
 *     onWarning(message) {},
 *     onSuccess(cssText, node, url) {},
 *     onComplete(cssText, styleNode, cssVariables, benchmark) {},
 *     onFinally(hasChanged, hasNativeSupport, benchmark)
 *   });
 */
function cssVars() {
  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var msgPrefix = "cssVars(): ";
  var settings = _extends({}, defaults, options);
  function handleError(message, sourceNode, xhr, url) {
    if (!settings.silent && window.console) {
      console.error("".concat(msgPrefix).concat(message, "\n"), sourceNode);
    }
    settings.onError(message, sourceNode, xhr, url);
  }
  function handleWarning(message) {
    if (!settings.silent && window.console) {
      console.warn("".concat(msgPrefix).concat(message));
    }
    settings.onWarning(message);
  }
  function handleFinally(hasChanged) {
    settings.onFinally(Boolean(hasChanged), isNativeSupport, getTimeStamp() - settings.__benchmark);
  }
  if (!isBrowser) {
    return;
  }
  if (settings.watch) {
    settings.watch = defaults.watch;
    addMutationObserver(settings);
    cssVars(settings);
    return;
  } else if (settings.watch === false && cssVarsObserver) {
    cssVarsObserver.disconnect();
    cssVarsObserver = null;
  }
  if (!settings.__benchmark) {
    if (cssVarsIsRunning === settings.rootElement) {
      cssVarsDebounced(options);
      return;
    }
    var srcNodes = [].slice.call(settings.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])'));
    settings.__benchmark = getTimeStamp();
    settings.exclude = [cssVarsObserver ? '[data-cssvars]:not([data-cssvars=""])' : '[data-cssvars="out"]', "link[disabled]:not([data-cssvars])", settings.exclude].filter(function(selector) {
      return selector;
    }).join(",");
    settings.variables = fixVarNames(settings.variables);
    srcNodes.forEach(function(srcNode) {
      var hasStyleCache = srcNode.nodeName.toLowerCase() === "style" && srcNode.__cssVars.text;
      var hasStyleChanged = hasStyleCache && srcNode.textContent !== srcNode.__cssVars.text;
      if (hasStyleCache && hasStyleChanged) {
        srcNode.sheet && (srcNode.sheet.disabled = false);
        srcNode.setAttribute("data-cssvars", "");
      }
    });
    if (!cssVarsObserver) {
      var outNodes = [].slice.call(settings.rootElement.querySelectorAll('[data-cssvars="out"]'));
      outNodes.forEach(function(outNode) {
        var dataGroup = outNode.getAttribute("data-cssvars-group");
        var srcNode = dataGroup ? settings.rootElement.querySelector('[data-cssvars="src"][data-cssvars-group="'.concat(dataGroup, '"]')) : null;
        if (!srcNode) {
          outNode.parentNode.removeChild(outNode);
        }
      });
      if (cssVarsSrcNodeCount && srcNodes.length < cssVarsSrcNodeCount) {
        cssVarsSrcNodeCount = srcNodes.length;
        variableStore.dom = {};
      }
    }
  }
  if (document.readyState !== "loading") {
    if (isNativeSupport && settings.onlyLegacy) {
      var hasVarChange = false;
      if (settings.updateDOM) {
        var targetElm = settings.rootElement.host || (settings.rootElement === document ? document.documentElement : settings.rootElement);
        Object.keys(settings.variables).forEach(function(key) {
          var varValue = settings.variables[key];
          hasVarChange = hasVarChange || varValue !== getComputedStyle(targetElm).getPropertyValue(key);
          targetElm.style.setProperty(key, varValue);
        });
      }
      handleFinally(hasVarChange);
    } else if (!isShadowDOMReady && (settings.shadowDOM || settings.rootElement.shadowRoot || settings.rootElement.host)) {
      getCssData({
        rootElement: defaults.rootElement,
        include: defaults.include,
        exclude: settings.exclude,
        skipDisabled: false,
        onSuccess: function onSuccess2(cssText, node, url) {
          var isUserDisabled = (node.sheet || {}).disabled && !node.__cssVars;
          if (isUserDisabled) {
            return false;
          }
          cssText = cssText.replace(regex.cssComments, "").replace(regex.cssMediaQueries, "");
          cssText = (cssText.match(regex.cssVarDeclRules) || []).join("");
          return cssText || false;
        },
        onComplete: function onComplete2(cssText, cssArray, nodeArray) {
          parseVars(cssText, {
            store: variableStore.dom,
            onWarning: handleWarning
          });
          isShadowDOMReady = true;
          cssVars(settings);
        }
      });
    } else {
      cssVarsIsRunning = settings.rootElement;
      getCssData({
        rootElement: settings.rootElement,
        include: settings.include,
        exclude: settings.exclude,
        skipDisabled: false,
        onBeforeSend: settings.onBeforeSend,
        onError: function onError2(xhr, node, url) {
          var responseUrl = xhr.responseURL || getFullUrl(url, location.href);
          var statusText = xhr.statusText ? "(".concat(xhr.statusText, ")") : "Unspecified Error" + (xhr.status === 0 ? " (possibly CORS related)" : "");
          var errorMsg = "CSS XHR Error: ".concat(responseUrl, " ").concat(xhr.status, " ").concat(statusText);
          handleError(errorMsg, node, xhr, responseUrl);
        },
        onSuccess: function onSuccess2(cssText, node, url) {
          var isUserDisabled = (node.sheet || {}).disabled && !node.__cssVars;
          if (isUserDisabled) {
            return false;
          }
          var isLink = node.nodeName.toLowerCase() === "link";
          var isStyleImport = node.nodeName.toLowerCase() === "style" && cssText !== node.textContent;
          var returnVal = settings.onSuccess(cssText, node, url);
          cssText = returnVal !== void 0 && Boolean(returnVal) === false ? "" : returnVal || cssText;
          if (settings.updateURLs && (isLink || isStyleImport)) {
            cssText = fixRelativeCssUrls(cssText, url);
          }
          return cssText;
        },
        onComplete: function onComplete2(cssText, cssArray) {
          var nodeArray = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
          var currentVars = _extends({}, variableStore.dom, variableStore.user);
          var hasVarChange2 = false;
          variableStore.job = {};
          nodeArray.forEach(function(node, i2) {
            var nodeCSS = cssArray[i2];
            node.__cssVars = node.__cssVars || {};
            node.__cssVars.text = nodeCSS;
            if (regex.cssVars.test(nodeCSS)) {
              try {
                var cssTree = parseCss(nodeCSS, {
                  preserveStatic: settings.preserveStatic,
                  removeComments: true
                });
                parseVars(cssTree, {
                  parseHost: Boolean(settings.rootElement.host),
                  store: variableStore.dom,
                  onWarning: handleWarning
                });
                node.__cssVars.tree = cssTree;
              } catch (err) {
                handleError(err.message, node);
              }
            }
          });
          _extends(variableStore.job, variableStore.dom);
          if (settings.updateDOM) {
            _extends(variableStore.user, settings.variables);
            _extends(variableStore.job, variableStore.user);
          } else {
            _extends(variableStore.job, variableStore.user, settings.variables);
            _extends(currentVars, settings.variables);
          }
          hasVarChange2 = counters.job > 0 && Boolean(Object.keys(variableStore.job).length > Object.keys(currentVars).length || Boolean(Object.keys(currentVars).length && Object.keys(variableStore.job).some(function(key) {
            return variableStore.job[key] !== currentVars[key];
          })));
          if (hasVarChange2) {
            resetCssNodes(settings.rootElement);
            cssVars(settings);
          } else {
            var outCssArray = [];
            var outNodeArray = [];
            var hasKeyframesWithVars = false;
            if (settings.updateDOM) {
              counters.job++;
            }
            nodeArray.forEach(function(node, i2) {
              var isSkip = !node.__cssVars.tree;
              if (node.__cssVars.tree) {
                try {
                  transformCss(node.__cssVars.tree, _extends({}, settings, {
                    variables: variableStore.job,
                    onWarning: handleWarning
                  }));
                  var outCss = stringifyCss(node.__cssVars.tree);
                  if (settings.updateDOM) {
                    var nodeCSS = cssArray[i2];
                    var hasCSSVarFunc = regex.cssVarFunc.test(nodeCSS);
                    if (!node.getAttribute("data-cssvars")) {
                      node.setAttribute("data-cssvars", "src");
                    }
                    if (outCss.length && hasCSSVarFunc) {
                      var dataGroup = node.getAttribute("data-cssvars-group") || ++counters.group;
                      var outCssNoSpaces = outCss.replace(/\s/g, "");
                      var outNode = settings.rootElement.querySelector('[data-cssvars="out"][data-cssvars-group="'.concat(dataGroup, '"]')) || document.createElement("style");
                      hasKeyframesWithVars = hasKeyframesWithVars || regex.cssKeyframes.test(outCss);
                      if (settings.preserveStatic) {
                        node.sheet && (node.sheet.disabled = true);
                      }
                      if (!outNode.hasAttribute("data-cssvars")) {
                        outNode.setAttribute("data-cssvars", "out");
                      }
                      if (outCssNoSpaces === node.textContent.replace(/\s/g, "")) {
                        isSkip = true;
                        if (outNode && outNode.parentNode) {
                          node.removeAttribute("data-cssvars-group");
                          outNode.parentNode.removeChild(outNode);
                        }
                      } else if (outCssNoSpaces !== outNode.textContent.replace(/\s/g, "")) {
                        [node, outNode].forEach(function(n) {
                          n.setAttribute("data-cssvars-job", counters.job);
                          n.setAttribute("data-cssvars-group", dataGroup);
                        });
                        outNode.textContent = outCss;
                        outCssArray.push(outCss);
                        outNodeArray.push(outNode);
                        if (!outNode.parentNode) {
                          node.parentNode.insertBefore(outNode, node.nextSibling);
                        }
                      }
                    }
                  } else {
                    if (node.textContent.replace(/\s/g, "") !== outCss) {
                      outCssArray.push(outCss);
                    }
                  }
                } catch (err) {
                  handleError(err.message, node);
                }
              }
              if (isSkip) {
                node.setAttribute("data-cssvars", "skip");
              }
              if (!node.hasAttribute("data-cssvars-job")) {
                node.setAttribute("data-cssvars-job", counters.job);
              }
            });
            cssVarsSrcNodeCount = settings.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])').length;
            if (settings.shadowDOM) {
              var elms = [].concat(settings.rootElement).concat([].slice.call(settings.rootElement.querySelectorAll("*")));
              for (var i = 0, elm; elm = elms[i]; ++i) {
                if (elm.shadowRoot && elm.shadowRoot.querySelector("style")) {
                  var shadowSettings = _extends({}, settings, {
                    rootElement: elm.shadowRoot
                  });
                  cssVars(shadowSettings);
                }
              }
            }
            if (settings.updateDOM && hasKeyframesWithVars) {
              fixKeyframes(settings.rootElement);
            }
            cssVarsIsRunning = false;
            settings.onComplete(outCssArray.join(""), outNodeArray, JSON.parse(JSON.stringify(variableStore.job)), getTimeStamp() - settings.__benchmark);
            handleFinally(outNodeArray.length);
          }
        }
      });
    }
  } else {
    document.addEventListener("DOMContentLoaded", function init(evt) {
      cssVars(options);
      document.removeEventListener("DOMContentLoaded", init);
    });
  }
}
cssVars.reset = function() {
  counters.job = 0;
  counters.group = 0;
  cssVarsIsRunning = false;
  if (cssVarsObserver) {
    cssVarsObserver.disconnect();
    cssVarsObserver = null;
  }
  cssVarsSrcNodeCount = 0;
  debounceTimer = null;
  isShadowDOMReady = false;
  for (var prop in variableStore) {
    variableStore[prop] = {};
  }
};
function addMutationObserver(settings) {
  function isDisabled(node) {
    var isDisabledAttr = isLink(node) && node.hasAttribute("disabled");
    var isDisabledSheet = (node.sheet || {}).disabled;
    return isDisabledAttr || isDisabledSheet;
  }
  function isLink(node) {
    var isStylesheet = node.nodeName.toLowerCase() === "link" && (node.getAttribute("rel") || "").indexOf("stylesheet") !== -1;
    return isStylesheet;
  }
  function isStyle(node) {
    return node.nodeName.toLowerCase() === "style";
  }
  function isValidAttributeMutation(mutation) {
    var isValid = false;
    if (mutation.type === "attributes" && isLink(mutation.target) && !isDisabled(mutation.target)) {
      var isEnabledMutation = mutation.attributeName === "disabled";
      var isHrefMutation = mutation.attributeName === "href";
      var isSkipNode = mutation.target.getAttribute("data-cssvars") === "skip";
      var isSrcNode = mutation.target.getAttribute("data-cssvars") === "src";
      if (isEnabledMutation) {
        isValid = !isSkipNode && !isSrcNode;
      } else if (isHrefMutation) {
        if (isSkipNode) {
          mutation.target.setAttribute("data-cssvars", "");
        } else if (isSrcNode) {
          resetCssNodes(settings.rootElement, true);
        }
        isValid = true;
      }
    }
    return isValid;
  }
  function isValidStyleTextMutation(mutation) {
    var isValid = false;
    if (mutation.type === "childList") {
      var isStyleElm = isStyle(mutation.target);
      var isOutNode = mutation.target.getAttribute("data-cssvars") === "out";
      isValid = isStyleElm && !isOutNode;
    }
    return isValid;
  }
  function isValidAddMutation(mutation) {
    var isValid = false;
    if (mutation.type === "childList") {
      isValid = [].slice.call(mutation.addedNodes).some(function(node) {
        var isElm = node.nodeType === 1;
        var hasAttr = isElm && node.hasAttribute("data-cssvars");
        var isStyleWithVars = isStyle(node) && regex.cssVars.test(node.textContent);
        var isValid2 = !hasAttr && (isLink(node) || isStyleWithVars);
        return isValid2 && !isDisabled(node);
      });
    }
    return isValid;
  }
  function isValidRemoveMutation(mutation) {
    var isValid = false;
    if (mutation.type === "childList") {
      isValid = [].slice.call(mutation.removedNodes).some(function(node) {
        var isElm = node.nodeType === 1;
        var isOutNode = isElm && node.getAttribute("data-cssvars") === "out";
        var isSrcNode = isElm && node.getAttribute("data-cssvars") === "src";
        var isValid2 = isSrcNode;
        if (isSrcNode || isOutNode) {
          var dataGroup = node.getAttribute("data-cssvars-group");
          var orphanNode = settings.rootElement.querySelector('[data-cssvars-group="'.concat(dataGroup, '"]'));
          if (isSrcNode) {
            resetCssNodes(settings.rootElement, true);
          }
          if (orphanNode) {
            orphanNode.parentNode.removeChild(orphanNode);
          }
        }
        return isValid2;
      });
    }
    return isValid;
  }
  if (!window.MutationObserver) {
    return;
  }
  if (cssVarsObserver) {
    cssVarsObserver.disconnect();
    cssVarsObserver = null;
  }
  cssVarsObserver = new MutationObserver(function(mutations) {
    var hasValidMutation = mutations.some(function(mutation) {
      return isValidAttributeMutation(mutation) || isValidStyleTextMutation(mutation) || isValidAddMutation(mutation) || isValidRemoveMutation(mutation);
    });
    if (hasValidMutation) {
      cssVars(settings);
    }
  });
  cssVarsObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["disabled", "href"],
    childList: true,
    subtree: true
  });
}
function cssVarsDebounced(settings) {
  var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function() {
    settings.__benchmark = null;
    cssVars(settings);
  }, delay);
}
function fixKeyframes(rootElement) {
  var animationNameProp = ["animation-name", "-moz-animation-name", "-webkit-animation-name"].filter(function(prop) {
    return getComputedStyle(document.body)[prop];
  })[0];
  if (animationNameProp) {
    var allNodes = rootElement.getElementsByTagName("*");
    var keyframeNodes = [];
    var nameMarker = "__CSSVARSPONYFILL-KEYFRAMES__";
    for (var i = 0, len = allNodes.length; i < len; i++) {
      var node = allNodes[i];
      var animationName = getComputedStyle(node)[animationNameProp];
      if (animationName !== "none") {
        node.style[animationNameProp] += nameMarker;
        keyframeNodes.push(node);
      }
    }
    void document.body.offsetHeight;
    for (var _i = 0, _len = keyframeNodes.length; _i < _len; _i++) {
      var nodeStyle = keyframeNodes[_i].style;
      nodeStyle[animationNameProp] = nodeStyle[animationNameProp].replace(nameMarker, "");
    }
  }
}
function fixRelativeCssUrls(cssText, baseUrl) {
  var cssUrls = cssText.replace(regex.cssComments, "").match(regex.cssUrls) || [];
  cssUrls.forEach(function(cssUrl) {
    var oldUrl = cssUrl.replace(regex.cssUrls, "$1");
    var newUrl = getFullUrl(oldUrl, baseUrl);
    cssText = cssText.replace(cssUrl, cssUrl.replace(oldUrl, newUrl));
  });
  return cssText;
}
function fixVarNames() {
  var varObj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var reLeadingHyphens = /^-{2}/;
  return Object.keys(varObj).reduce(function(obj, value) {
    var key = reLeadingHyphens.test(value) ? value : "--".concat(value.replace(/^-+/, ""));
    obj[key] = varObj[value];
    return obj;
  }, {});
}
function getFullUrl(url) {
  var base = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : location.href;
  var d = document.implementation.createHTMLDocument("");
  var b = d.createElement("base");
  var a = d.createElement("a");
  d.head.appendChild(b);
  d.body.appendChild(a);
  b.href = base;
  a.href = url;
  return a.href;
}
function getTimeStamp() {
  return isBrowser && (window.performance || {}).now ? window.performance.now() : new Date().getTime();
}
function resetCssNodes(rootElement) {
  var resetDOMVariableStore = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var resetNodes = [].slice.call(rootElement.querySelectorAll('[data-cssvars="skip"],[data-cssvars="src"]'));
  resetNodes.forEach(function(node) {
    return node.setAttribute("data-cssvars", "");
  });
  if (resetDOMVariableStore) {
    variableStore.dom = {};
  }
}
const THEME_KEY = {
  userLastPreferTheme: "user-custom-theme",
  userLastPreferThemeData: "user-custom-theme-data",
  currentTheme: "devuiCurrentTheme",
  themeCollection: "devuiThemes",
  styleElementId: "devuiThemeVariables",
  transitionStyleElementId: "devuiThemeColorTransition",
  uiThemeAttributeName: "ui-theme",
  themeService: "devuiThemeService"
};
const devuiLightTheme = new Theme({
  id: "b-light-theme",
  name: "Light Mode",
  data: {
    "b-global-bg": "#f3f6f8",
    "b-global-bg-normal": "#ffffff",
    "b-base-bg": "#ffffff",
    "b-base-bg-dark": "#333854",
    "b-brand": "#5e7ce0",
    "b-brand-foil": "#859bff",
    "b-brand-hover": "#7693f5",
    "b-brand-active": "#526ecc",
    "b-brand-active-focus": "#344899",
    "b-contrast": "#c7000b",
    "b-text": "#252b3a",
    "b-text-weak": "#575d6c",
    "b-aide-text": "#8a8e99",
    "b-aide-text-stress": "#575d6c",
    "b-placeholder": "#8a8e99",
    "b-light-text": "#ffffff",
    "b-dark-text": "#252b3a",
    "b-link": "#526ecc",
    "b-link-active": "#526ecc",
    "b-link-light": "#96adfa",
    "b-link-light-active": "#beccfa",
    "b-line": "#adb0b8",
    "b-dividing-line": "#dfe1e6",
    "b-block": "#ffffff",
    "b-area": "#f8f8f8",
    "b-danger": "#f66f6a",
    "b-warning": "#fac20a",
    "b-waiting": "#9faad7",
    "b-success": "#50d4ab",
    "b-info": "#5e7ce0",
    "b-initial": "#e9edfa",
    "b-unavailable": "#f5f5f6",
    "b-shadow": "rgba(37, 43, 58, 0.2)",
    "b-light-shadow": "rgba(37, 43, 58, 0.1)",
    "b-icon-text": "#252b3a",
    "b-icon-bg": "#ffffff",
    "b-icon-fill": "#71757f",
    "b-icon-fill-hover": "#252b3a",
    "b-icon-fill-active": "#252b3a",
    "b-icon-fill-active-hover": "#526ecc",
    "b-form-control-line": "#adb0b8",
    "b-form-control-line-hover": "#575d6c",
    "b-form-control-line-active": "#5e7ce0",
    "b-form-control-line-active-hover": "#344899",
    "b-list-item-active-bg": "#5e7ce0",
    "b-list-item-active-text": "#ffffff",
    "b-list-item-active-hover-bg": "#526ecc",
    "b-list-item-hover-bg": "#f2f5fc",
    "b-list-item-hover-text": "#526ecc",
    "b-list-item-selected-bg": "#e9edfa",
    "b-list-item-strip-bg": "#f2f5fc",
    "b-disabled-bg": "#f5f5f6",
    "b-disabled-line": "#dfe1e6",
    "b-disabled-text": "#adb0b8",
    "b-primary-disabled": "#beccfa",
    "b-icon-fill-active-disabled": "#beccfa",
    "b-label-bg": "#eef0f5",
    "b-connected-overlay-bg": "#ffffff",
    "b-connected-overlay-line": "#526ecc",
    "b-fullscreen-overlay-bg": "#ffffff",
    "b-feedback-overlay-bg": "#464d6e",
    "b-feedback-overlay-text": "#dfe1e6",
    "b-embed-search-bg": "#f2f5fc",
    "b-embed-search-bg-hover": "#eef0f5",
    "b-float-block-shadow": "rgba(94, 124, 224, 0.3)",
    "b-highlight-overlay": "rgba(255, 255, 255, 0.8)",
    "b-range-item-hover-bg": "#e9edfa",
    "b-primary": "#5e7ce0",
    "b-primary-hover": "#7693f5",
    "b-primary-active": "#344899",
    "b-contrast-hover": "#d64a52",
    "b-contrast-active": "#b12220",
    "b-danger-line": "#f66f6a",
    "b-danger-bg": "#ffeeed",
    "b-warning-line": "#fa9841",
    "b-warning-bg": "#fff3e8",
    "b-info-line": "#5e7ce0",
    "b-info-bg": "#f2f5fc",
    "b-success-line": "#50d4ab",
    "b-success-bg": "#edfff9",
    "b-primary-line": "#5e7ce0",
    "b-primary-bg": "#f2f5fc",
    "b-default-line": "#5e7ce0",
    "b-default-bg": "#f3f6f8",
    "b-font-size": "12px",
    "b-font-size-card-title": "14px",
    "b-font-size-page-title": "16px",
    "b-font-size-modal-title": "18px",
    "b-font-size-price": "20px",
    "b-font-size-data-overview": "24px",
    "b-font-size-icon": "16px",
    "b-font-size-sm": "12px",
    "b-font-size-md": "12px",
    "b-font-size-lg": "14px",
    "b-font-title-weight": "bold",
    "b-font-content-weight": "normal",
    "b-line-height-base": "1.5",
    "b-border-radius": "2px",
    "b-border-radius-feedback": "4px",
    "b-border-radius-card": "6px",
    "b-shadow-length-base": "0 1px 4px 0",
    "b-shadow-length-slide-left": "-2px 0 8px 0",
    "b-shadow-length-slide-right": "2px 0 8px 0",
    "b-shadow-length-connected-overlay": "0 2px 8px 0",
    "b-shadow-length-hover": "0 4px 16px 0",
    "b-shadow-length-feedback-overlay": "0 4px 16px 0",
    "b-shadow-fullscreen-overlay": "0 8px 40px 0",
    "b-animation-duration-slow": "300ms",
    "b-animation-duration-base": "200ms",
    "b-animation-duration-fast": "100ms",
    "b-animation-ease-in": "cubic-bezier(0.5, 0, 0.84, 0.25)",
    "b-animation-ease-out": "cubic-bezier(0.16, 0.75, 0.5, 1)",
    "b-animation-ease-in-out": "cubic-bezier(0.5, 0.05, 0.5, 0.95)",
    "b-animation-ease-in-out-smooth": "cubic-bezier(0.645, 0.045, 0.355, 1)",
    "b-animation-linear": "cubic-bezier(0, 0, 1, 1)",
    "b-z-index-full-page-overlay": "1080",
    "b-z-index-pop-up": "1060",
    "b-z-index-dropdown": "1052",
    "b-z-index-modal": "1050",
    "b-z-index-drawer": "1040",
    "b-z-index-framework": "1000",
    "b-menu-item": "#252b3a",
    "b-menu-item-sub": "#6C6C6C",
    "b-menu-item-hover": "#0f0f0f",
    "b-menu-disabled": "#919191"
  },
  isDark: false
});
const devuiGreenTheme = new Theme({
  id: "b-green-theme",
  name: "Green - Light Mode",
  data: __spreadProps(__spreadValues({}, devuiLightTheme.data), {
    "b-global-bg": "#f3f8f7",
    "b-brand": "#3DCCA6",
    "b-brand-foil": "#7fdac1",
    "b-brand-hover": "#6DDEBB",
    "b-brand-active": "#07c693",
    "b-brand-active-focus": "#369676",
    "b-link": "#07c693",
    "b-link-active": "#07c693",
    "b-link-light": "#96fac8",
    "b-link-light-active": "#befade",
    "b-info": "#079CCD",
    "b-initial": "#CCCCCC",
    "b-icon-fill-active": "#3DCCA6",
    "b-icon-fill-active-hover": "#07c693",
    "b-form-control-line-active": "#3DCCA6",
    "b-form-control-line-active-hover": "#2EB28A",
    "b-list-item-active-bg": "#3DCCA6",
    "b-list-item-active-hover-bg": "#07c693",
    "b-list-item-hover-bg": "#f3fef9",
    "b-list-item-hover-text": "#07c693",
    "b-list-item-selected-bg": "#f3fef9",
    "b-list-item-strip-bg": "#f3fef9",
    "b-connected-overlay-line": "#07c693",
    "b-embed-search-bg": "#f3fef9",
    "b-float-block-shadow": "rgba(94, 224, 181, 0.3)",
    "b-primary": "#3DCCA6",
    "b-primary-hover": "#6DDEBB",
    "b-primary-active": "#369676",
    "b-info-line": "#0486b1",
    "b-info-bg": "#e3f0f5",
    "b-success-line": "#50d492",
    "b-success-bg": "#edfff9",
    "b-primary-line": "#3DCCA6",
    "b-primary-bg": "#f3fef9",
    "b-default-line": "#3DCCA6",
    "b-default-bg": "#f3f8f7",
    "b-primary-disabled": "#c5f0e5",
    "b-icon-fill-active-disabled": "#c5f0e5",
    "b-range-item-hover-bg": "#d8f9ea"
  }),
  extends: "b-light-theme",
  isDark: false
});
const devuiDarkTheme = new Theme({
  id: "b-dark-theme",
  name: "Dark Mode",
  data: {
    "b-global-bg": "#202124",
    "b-global-bg-normal": "#202124",
    "b-base-bg": "#2E2F31",
    "b-base-bg-dark": "#2e2f31",
    "b-brand": "#5e7ce0",
    "b-brand-foil": "#313a61",
    "b-brand-hover": "#425288",
    "b-brand-active": "#526ecc",
    "b-brand-active-focus": "#344899",
    "b-contrast": "#C7000B",
    "b-text": "#E8E8E8",
    "b-text-weak": "#A0A0A0",
    "b-aide-text": "#909090",
    "b-aide-text-stress": "#A0A0A0",
    "b-placeholder": "#8A8A8A",
    "b-light-text": "#ffffff",
    "b-dark-text": "#252b3a",
    "b-link": "#526ECC",
    "b-link-active": "#344899",
    "b-link-light": "#96adfa",
    "b-link-light-active": "#beccfa",
    "b-line": "#505153",
    "b-dividing-line": "#3D3E40",
    "b-block": "#606061",
    "b-area": "#34363A",
    "b-danger": "#f66f6a",
    "b-warning": "#fac20a",
    "b-waiting": "#5e6580",
    "b-success": "#50d4ab",
    "b-info": "#5e7ce0",
    "b-initial": "#64676e",
    "b-unavailable": "#5b5b5c",
    "b-shadow": "rgba(17, 18, 19, 0.4)",
    "b-light-shadow": "rgba(17, 18, 19, 0.5)",
    "b-icon-text": "#E8E8E8",
    "b-icon-bg": "#2E2F31",
    "b-icon-fill": "#606061",
    "b-icon-fill-hover": "#73788a",
    "b-icon-fill-active": "#5e7ce0",
    "b-icon-fill-active-hover": "#526ecc",
    "b-form-control-line": "#505153",
    "b-form-control-line-hover": "#909090",
    "b-form-control-line-active": "#5e7ce0",
    "b-form-control-line-active-hover": "#344899",
    "b-list-item-active-bg": "#5e7ce0",
    "b-list-item-active-text": "#ffffff",
    "b-list-item-active-hover-bg": "#526ecc",
    "b-list-item-hover-bg": "#383838",
    "b-list-item-hover-text": "#526ecc",
    "b-list-item-selected-bg": "#454545",
    "b-list-item-strip-bg": "#383838",
    "b-disabled-bg": "#3D3E44",
    "b-disabled-line": "#505153",
    "b-disabled-text": "#7D7D7D",
    "b-primary-disabled": "#2B3458",
    "b-icon-fill-active-disabled": "#2B3458",
    "b-label-bg": "#46443F",
    "b-connected-overlay-bg": "#2F2F2F",
    "b-connected-overlay-line": "#526ecc",
    "b-fullscreen-overlay-bg": "#2E2F31",
    "b-feedback-overlay-bg": "#4C4C4C",
    "b-feedback-overlay-text": "#DFE1E6",
    "b-embed-search-bg": "#383838",
    "b-embed-search-bg-hover": "#3D3E40",
    "b-float-block-shadow": "rgba(94, 124, 224, 0.3)",
    "b-highlight-overlay": "rgba(255, 255, 255, 0.1)",
    "b-range-item-hover-bg": "#454545",
    "b-primary": "#5e7ce0",
    "b-primary-hover": "#425288",
    "b-primary-active": "#344899",
    "b-contrast-hover": "#D64A52",
    "b-contrast-active": "#B12220",
    "b-danger-line": "#985C5A",
    "b-danger-bg": "#4B3A39",
    "b-warning-line": "#8D6138",
    "b-warning-bg": "#554434",
    "b-info-line": "#546BB7",
    "b-info-bg": "#383D4F",
    "b-success-line": "#5D887D",
    "b-success-bg": "#304642",
    "b-primary-line": "#546BB7",
    "b-primary-bg": "#383D4F",
    "b-default-line": "#5e7ce0",
    "b-default-bg": "#383838",
    "b-menu-item": "#dcdcdc",
    "b-menu-item-sub": "#c6c6c6",
    "b-menu-item-hover": "#fff",
    "b-menu-disabled": "#919191"
  },
  extends: "b-light-theme",
  isDark: true
});
const devuiGreenDarkTheme = new Theme({
  id: "b-green-dark-theme",
  name: "Green - Dark Mode",
  data: __spreadProps(__spreadValues({}, devuiDarkTheme.data), {
    "b-brand": "#3DCCA6",
    "b-brand-foil": "#395e54",
    "b-brand-hover": "#4c9780",
    "b-brand-active": "#07c693",
    "b-brand-active-focus": "#297058",
    "b-link": "#07c693",
    "b-link-active": "#08a57b",
    "b-info": "#046788",
    "b-initial": "#64676e",
    "b-icon-fill-active": "#3DCCA6",
    "b-icon-fill-active-hover": "#07c693",
    "b-form-control-line-active": "#3DCCA6",
    "b-form-control-line-active-hover": "#297058",
    "b-list-item-active-bg": "#3DCCA6",
    "b-list-item-active-hover-bg": "#07c693",
    "b-list-item-hover-text": "#07c693",
    "b-connected-overlay-line": "#07c693",
    "b-embed-search-bg": "#3f4241",
    "b-float-block-shadow": "rgba(94, 224, 181, 0.3)",
    "b-primary": "#3DCCA6",
    "b-primary-hover": "#6DDEBB",
    "b-primary-active": "#369676",
    "b-info-line": "#035e7c",
    "b-info-bg": "#383c3d",
    "b-primary-line": "#3DCCA6",
    "b-primary-bg": "#3f4241",
    "b-default-line": "#3DCCA6",
    "b-default-bg": "#383838",
    "b-primary-disabled": "#28544B",
    "b-icon-fill-active-disabled": "#28544B"
  }),
  extends: "b-dark-theme",
  isDark: true
});
const infinityTheme = new Theme({
  id: "infinity-theme",
  name: "\u65E0\u9650\u4E3B\u9898",
  data: __spreadProps(__spreadValues({}, devuiLightTheme.data), {
    "b-brand-foil": "#F2F2F3",
    "b-global-bg": "#F8F8FA",
    "b-base-bg": "#ffffff",
    "b-text": "#252B3A",
    "b-aide-text": "#71757f",
    "b-placeholder": "#babbc0",
    "b-disabled-text": "#cfd0d3",
    "b-disabled-bg": "#f5f5f5",
    "b-line": "#D7D8DA",
    "b-dividing-line": "#F2F2F3",
    "b-area": "#f5f5f5",
    "b-list-item-hover-bg": "#F2F2F3",
    "b-list-item-active-bg": "#F2F5FC",
    "b-list-item-active-hover-bg": "#F2F5FC",
    "b-list-item-selected-bg": "#F2F5FC",
    "b-list-item-hover-text": "#252b3a",
    "b-list-item-active-text": "#252B3A",
    "b-form-control-line-hover": "#9b9fa8",
    "b-form-control-line": "#D7D8DA",
    "b-form-control-bg": "#ffffff",
    "b-icon-text": "#71757f",
    "b-icon-fill": "#71757f",
    "b-icon-fill-weak": "#babbc0",
    "b-icon-fill-hover": "#252b3a",
    "b-icon-fill-active": "#252b3a",
    "b-icon-fill-active-hover": "#252b3a",
    "b-label-bg": "#E9EDFA",
    "b-border-radius": "4px",
    "b-font-size": "14px",
    "b-font-size-md": "14px",
    "b-font-size-card-title": "16px",
    "b-shadow-length-fullscreen-overlay": "0 0 6px 0",
    "b-border-radius-card": "8px",
    "b-border-radius-full": "100px",
    "b-waiting": "#beccfa",
    "b-danger-bg": "#ffd5d4",
    "b-shape-icon-fill": "#d7d8da",
    "b-shape-icon-fill-hover": "#babbc0",
    "b-shape-icon-fill-active": "#babbc0",
    "b-shape-icon-fill-disabled": "#f5f5f5",
    "b-btn-padding": "0 16px",
    "b-btn-common-bg": "#ebebeb",
    "b-btn-common-bg-hover": "#d1d1d1",
    "b-btn-common-bg-active": "#bdbdbd",
    "b-btn-common-color-hover": "#252b3a",
    "b-btn-common-color-active": "#252b3a",
    "b-btn-common-border-color": "transparent",
    "b-btn-common-border-color-hover": "transparent",
    "b-btn-common-border-color-active": "transparent",
    "b-btn-sm-padding": "0 12px",
    "b-btn-lg-padding": "0 20px"
  }),
  extends: "devui-light-theme",
  isDark: false
});
const provenceTheme = new Theme({
  id: "provence-theme",
  name: "\u7D2B\u7F57\u5170\u4E3B\u9898",
  data: __spreadProps(__spreadValues({}, infinityTheme.data), {
    "b-brand": "#7B69EE",
    "b-brand-foil": "#F5F5F9",
    "b-brand-active-focus": "#7B69EE",
    "b-primary-active": "#7B69EE",
    "b-brand-hover": "#7B69EE",
    "b-global-bg": "#f9fafb",
    "b-base-bg": "#ffffff",
    "b-text": "#070036",
    "b-aide-text": "#717087",
    "b-placeholder": "#babbc0",
    "b-disabled-text": "#cfd0d3",
    "b-disabled-bg": "#f5f5f6",
    "b-line": "#E2E2E5",
    "b-dividing-line": "#F2F2F3",
    "b-list-item-hover-bg": "#F5F5F9",
    "b-list-item-active-bg": "#7B69EE",
    "b-list-item-active-hover-bg": "#7B69EE",
    "b-list-item-selected-bg": "#F4F2FF",
    "b-list-item-hover-text": "#252b3a",
    "b-list-item-active-text": "#ffffff",
    "b-form-control-line-hover": "#A3A6AC",
    "b-form-control-line": "#D7D8DA",
    "b-icon-text": "#babbc0",
    "b-brand-active": "#7B69EE",
    "b-primary": "#7B69EE",
    "b-primary-hover": "#7B69EE",
    "b-form-control-line-active": "#7B69EE",
    "b-form-control-line-active-hover": "#7B69EE",
    "b-icon-fill-active": "#7B69EE",
    "b-icon-fill-active-hover": "#7B69EE",
    "b-label-bg": "#F4F2FF",
    "b-embed-search-bg": "#F4F2FF",
    "b-connected-overlay-line": "#7B69EE",
    "b-primary-disabled": "#d8d2fa",
    "b-icon-fill-active-disabled": "#d8d2fa"
  }),
  extends: "infinity-theme",
  isDark: false
});
const sweetTheme = new Theme({
  id: "sweet-theme",
  name: "\u871C\u7CD6\u4E3B\u9898",
  data: __spreadProps(__spreadValues({}, infinityTheme.data), {
    "b-brand": "#ec66ab",
    "b-brand-foil": "#f8f1f5",
    "b-brand-active-focus": "#ec66ab",
    "b-primary-active": "#ec66ab",
    "b-brand-hover": "#ec66ab",
    "b-global-bg": "#f9fafb",
    "b-base-bg": "#ffffff",
    "b-text": "#2f272f",
    "b-aide-text": "#827d82",
    "b-placeholder": "#bdb8bd",
    "b-disabled-text": "#cbcacb",
    "b-disabled-bg": "#f6f6f6",
    "b-line": "#aea6ad",
    "b-dividing-line": "#eae7e9",
    "b-list-item-hover-bg": "#f8f1f5",
    "b-list-item-active-bg": "#ffdcee",
    "b-list-item-active-hover-bg": "#ffdcee",
    "b-list-item-selected-bg": "#ffdcee",
    "b-list-item-hover-text": "#252b3a",
    "b-list-item-active-text": "#252b3a",
    "b-form-control-line-hover": "#A3A6AC",
    "b-form-control-line": "#D7D8DA",
    "b-icon-text": "#babbc0",
    "b-brand-active": "#ec66ab",
    "b-primary": "#ec66ab",
    "b-primary-hover": "#ec66ab",
    "b-form-control-line-active": "#ec66ab",
    "b-form-control-line-active-hover": "#ec66ab",
    "b-icon-fill-active": "#ec66ab",
    "b-icon-fill-active-hover": "#ec66ab",
    "b-label-bg": "#ffdcee",
    "b-embed-search-bg": "#ffdcee",
    "b-connected-overlay-line": "#ec66ab",
    "b-primary-disabled": "#fad1e6",
    "b-icon-fill-active-disabled": "#fad1e6"
  }),
  extends: "infinity-theme",
  isDark: false
});
const deepTheme = new Theme({
  id: "deep-theme",
  name: "\u6DF1\u9083\u591C\u7A7A\u4E3B\u9898",
  data: __spreadProps(__spreadValues({}, infinityTheme.data), {
    "b-brand": "#252b3a",
    "b-brand-foil": "#f3f4f7",
    "b-brand-active-focus": "#252b3a",
    "b-primary-active": "#252b3a",
    "b-brand-active": "#252b3a",
    "b-brand-hover": "#252b3a",
    "b-global-bg": "#f7f8fa",
    "b-base-bg": "#ffffff",
    "b-text": "#252b3a",
    "b-aide-text": "#505c7c",
    "b-placeholder": "#9ba6bf",
    "b-disabled-text": "#a8b1c7",
    "b-disabled-bg": "#f7f8fa",
    "b-line": "#cdd2df",
    "b-dividing-line": "#e6e9ef",
    "b-list-item-hover-bg": "#f3f4f7",
    "b-list-item-active-bg": "#252b3a",
    "b-list-item-active-hover-bg": "#252b3a",
    "b-list-item-selected-bg": "#252b3a",
    "b-list-item-hover-text": "#252b3a",
    "b-list-item-active-text": "#ffffff",
    "b-form-control-line-hover": "#A3A6AC",
    "b-form-control-line": "#D7D8DA",
    "b-icon-text": "#babbc0",
    "b-primary": "#252b3a",
    "b-primary-hover": "#252b3a",
    "b-form-control-line-active": "#252b3a",
    "b-form-control-line-active-hover": "#252b3a",
    "b-icon-fill-active": "#252b3a",
    "b-icon-fill-active-hover": "#252b3a",
    "b-connected-overlay-line": "#252b3a",
    "b-primary-disabled": "#bebfc4",
    "b-icon-fill-active-disabled": "#bebfc4"
  }),
  extends: "infinity-theme",
  isDark: false
});
const galaxyTheme = new Theme({
  id: "galaxy-theme",
  name: "\u8FFD\u5149\u4E3B\u9898",
  data: __spreadProps(__spreadValues({}, devuiDarkTheme.data), {
    "b-brand-foil": "#F2F2F3",
    "b-global-bg": "#000000",
    "b-base-bg": "#1F1F1F",
    "b-text": "#F5F5F5",
    "b-aide-text": "#A3A3A3",
    "b-placeholder": "#616161",
    "b-disabled-text": "#838383",
    "b-disabled-bg": "#3F3F3F",
    "b-line": "#565656",
    "b-dividing-line": "#303030",
    "b-list-item-hover-bg": "#313131",
    "b-list-item-active-bg": "#30333D",
    "b-list-item-active-hover-bg": "#30333D",
    "b-list-item-selected-bg": "#30333D",
    "b-list-item-hover-text": "#F5F5F5",
    "b-list-item-active-text": "#526ECC",
    "b-primary-disabled": "#3f3f3f",
    "b-form-control-bg": "#292a2e",
    "b-form-control-line": "#565656",
    "b-icon-text": "#A3A3A3",
    "b-connected-overlay-bg": "#282828",
    "b-fullscreen-overlay-bg": "#282828",
    "b-warning-line": "#a2622a",
    "b-warning-bg": "#4b2e14",
    "b-success-line": "#27846b ",
    "b-success-bg": "#123d32",
    "b-danger-line": "#9f4844",
    "b-danger-bg": "#4a2120",
    "b-info-line": "#3c5091",
    "b-info-bg": "#1c2543",
    "b-default-bg": "#313131",
    "b-border-radius": "4px",
    "b-font-size": "14px",
    "b-font-size-md": "14px",
    "b-font-size-card-title": "16px",
    "b-shadow-length-fullscreen-overlay": "0 0 6px 0",
    "b-border-radius-card": "4px"
  }),
  extends: "devui-dark-theme",
  isDark: true
});
function QueryHandler$1(options) {
  this.options = options;
  !options.deferSetup && this.setup();
}
QueryHandler$1.prototype = {
  constructor: QueryHandler$1,
  setup: function() {
    if (this.options.setup) {
      this.options.setup();
    }
    this.initialised = true;
  },
  on: function() {
    !this.initialised && this.setup();
    this.options.match && this.options.match();
  },
  off: function() {
    this.options.unmatch && this.options.unmatch();
  },
  destroy: function() {
    this.options.destroy ? this.options.destroy() : this.off();
  },
  equals: function(target) {
    return this.options === target || this.options.match === target;
  }
};
var QueryHandler_1 = QueryHandler$1;
function each$2(collection, fn) {
  var i = 0, length = collection.length, cont;
  for (i; i < length; i++) {
    cont = fn(collection[i], i);
    if (cont === false) {
      break;
    }
  }
}
function isArray$1(target) {
  return Object.prototype.toString.apply(target) === "[object Array]";
}
function isFunction$2(target) {
  return typeof target === "function";
}
var Util$1 = {
  isFunction: isFunction$2,
  isArray: isArray$1,
  each: each$2
};
var QueryHandler = QueryHandler_1;
var each$1 = Util$1.each;
function MediaQuery$1(query, isUnconditional) {
  this.query = query;
  this.isUnconditional = isUnconditional;
  this.handlers = [];
  this.mql = window.matchMedia(query);
  var self = this;
  this.listener = function(mql) {
    self.mql = mql.currentTarget || mql;
    self.assess();
  };
  this.mql.addListener(this.listener);
}
MediaQuery$1.prototype = {
  constuctor: MediaQuery$1,
  addHandler: function(handler) {
    var qh = new QueryHandler(handler);
    this.handlers.push(qh);
    this.matches() && qh.on();
  },
  removeHandler: function(handler) {
    var handlers = this.handlers;
    each$1(handlers, function(h, i) {
      if (h.equals(handler)) {
        h.destroy();
        return !handlers.splice(i, 1);
      }
    });
  },
  matches: function() {
    return this.mql.matches || this.isUnconditional;
  },
  clear: function() {
    each$1(this.handlers, function(handler) {
      handler.destroy();
    });
    this.mql.removeListener(this.listener);
    this.handlers.length = 0;
  },
  assess: function() {
    var action = this.matches() ? "on" : "off";
    each$1(this.handlers, function(handler) {
      handler[action]();
    });
  }
};
var MediaQuery_1 = MediaQuery$1;
var MediaQuery = MediaQuery_1;
var Util = Util$1;
var each = Util.each;
var isFunction$1 = Util.isFunction;
var isArray = Util.isArray;
function MediaQueryDispatch$1() {
  if (typeof window === "undefined") {
    return;
  }
  if (!window.matchMedia) {
    throw new Error("matchMedia not present, legacy browsers require a polyfill");
  }
  this.queries = {};
  this.browserIsIncapable = !window.matchMedia("only all").matches;
}
MediaQueryDispatch$1.prototype = {
  constructor: MediaQueryDispatch$1,
  register: function(q, options, shouldDegrade) {
    var queries = this.queries, isUnconditional = shouldDegrade && this.browserIsIncapable;
    if (!queries[q]) {
      queries[q] = new MediaQuery(q, isUnconditional);
    }
    if (isFunction$1(options)) {
      options = { match: options };
    }
    if (!isArray(options)) {
      options = [options];
    }
    each(options, function(handler) {
      if (isFunction$1(handler)) {
        handler = { match: handler };
      }
      queries[q].addHandler(handler);
    });
    return this;
  },
  unregister: function(q, handler) {
    var query = this.queries[q];
    if (query) {
      if (handler) {
        query.removeHandler(handler);
      } else {
        query.clear();
        delete this.queries[q];
      }
    }
    return this;
  }
};
var MediaQueryDispatch_1 = MediaQueryDispatch$1;
var MediaQueryDispatch = MediaQueryDispatch_1;
var src = new MediaQueryDispatch();
var enquire = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": src
}, [src]));
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function isFunction(value) {
  return typeof value === "function";
}
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._teardowns = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                _a.call(_parentage_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialTeardown = this.initialTeardown;
      if (isFunction(initialTeardown)) {
        try {
          initialTeardown();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _teardowns = this._teardowns;
      if (_teardowns) {
        this._teardowns = null;
        try {
          for (var _teardowns_1 = __values(_teardowns), _teardowns_1_1 = _teardowns_1.next(); !_teardowns_1_1.done; _teardowns_1_1 = _teardowns_1.next()) {
            var teardown_1 = _teardowns_1_1.value;
            try {
              execTeardown(teardown_1);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_teardowns_1_1 && !_teardowns_1_1.done && (_b = _teardowns_1.return))
              _b.call(_teardowns_1);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execTeardown(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _teardowns = this._teardowns;
    _teardowns && arrRemove(_teardowns, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execTeardown(teardown) {
  if (isFunction(teardown)) {
    teardown();
  } else {
    teardown.unsubscribe();
  }
}
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};
var timeoutProvider = {
  setTimeout: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout).apply(void 0, __spreadArray([], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    {
      throw err;
    }
  });
}
function noop() {
}
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped)
      ;
    else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped)
      ;
    else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped)
      ;
    else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
function identity(x) {
  return x;
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        var copy = _this.observers.slice();
        try {
          for (var copy_1 = __values(copy), copy_1_1 = copy_1.next(); !copy_1_1.done; copy_1_1 = copy_1.next()) {
            var observer = copy_1_1.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (copy_1_1 && !copy_1_1.done && (_a = copy_1.return))
              _a.call(copy_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    return hasError || isStopped ? EMPTY_SUBSCRIPTION : (observers.push(subscriber), new Subscription(function() {
      return arrRemove(observers, subscriber);
    }));
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last = i;
      }
      last && _buffer.splice(0, last + 1);
    }
  };
  return ReplaySubject2;
}(Subject);
const _PrefersColorSchemeMediaQuery = class {
  constructor() {
    __publicField(this, "prefersColorSchemeSubject", new ReplaySubject(1));
    __publicField(this, "prefersColorSchemeChange", this.prefersColorSchemeSubject.asObservable());
    __publicField(this, "handleColorSchemeChange", (value) => {
      this.prefersColorSchemeSubject.next(value);
    });
  }
  register() {
    _PrefersColorSchemeMediaQuery.enquire.register.bind(enquire)(_PrefersColorSchemeMediaQuery.Query.light, {
      match: () => {
        this.handleColorSchemeChange("light");
      }
    }).register(_PrefersColorSchemeMediaQuery.Query.dark, {
      match: () => {
        this.handleColorSchemeChange("dark");
      }
    });
    this.prefersColorSchemeSubject.next(this.getInitValue());
  }
  unregister() {
    _PrefersColorSchemeMediaQuery.enquire.unregister(_PrefersColorSchemeMediaQuery.Query.light).unregister(_PrefersColorSchemeMediaQuery.Query.dark);
    this.prefersColorSchemeSubject.complete();
  }
  getInitValue() {
    if (typeof window === "undefined") {
      return "light";
    }
    return window.matchMedia(_PrefersColorSchemeMediaQuery.Query.light).matches && "light" || window.matchMedia(_PrefersColorSchemeMediaQuery.Query.dark).matches && "dark" || "no-preference";
  }
};
let PrefersColorSchemeMediaQuery = _PrefersColorSchemeMediaQuery;
__publicField(PrefersColorSchemeMediaQuery, "enquire", enquire);
((PrefersColorSchemeMediaQuery2) => {
  ((Query2) => {
    Query2["light"] = "screen and (prefers-color-scheme: light)";
    Query2["dark"] = "screen and (prefers-color-scheme: dark)";
    Query2["noPreferences"] = "screen and (prefers-color-scheme: light)";
  })(PrefersColorSchemeMediaQuery2.Query || (PrefersColorSchemeMediaQuery2.Query = {}));
})(PrefersColorSchemeMediaQuery || (PrefersColorSchemeMediaQuery = {}));
class EventBus {
  constructor() {
    __publicField(this, "eventBusCore", []);
  }
  areFuncEqual(a, b) {
    return a.toString() === b.toString();
  }
  isKeyValueObjInArr(arr, key, val) {
    const filteredArr = arr.filter((entry) => {
      return entry[key] === val;
    });
    return filteredArr.length > 0;
  }
  removeFuncInFuncArr(arr, fn) {
    for (let z = 0; z < arr.length; z++) {
      if (this.areFuncEqual(arr[z], fn)) {
        arr.splice(z, 1);
      }
    }
    return arr;
  }
  getKeyValueObjInArr(arr, key, val) {
    const filteredArr = arr.filter((entry) => {
      return entry[key] === val;
    });
    return filteredArr[0];
  }
  addEvent(eventName, eventFunc) {
    if (!this.isKeyValueObjInArr(this.eventBusCore, "eventName", eventName)) {
      this.eventBusCore.push({ eventName, eventFuncArr: [eventFunc] });
    } else {
      this.eventBusCore = this.eventBusCore.map((event) => {
        if (event["eventName"] === eventName) {
          event.eventFuncArr.push(eventFunc);
        }
        return event;
      });
    }
  }
  add(eventName, callbacks) {
    if (!eventName) {
      return;
    }
    if (typeof callbacks === "function") {
      for (let i = 1; i < arguments.length; i++) {
        this.addEvent(eventName, arguments[i]);
      }
    }
    if (typeof callbacks === "object" && callbacks.forEach) {
      callbacks.forEach((fn) => {
        this.addEvent(eventName, fn);
      });
    }
  }
  remove(eventName, callbacks) {
    if (!eventName) {
      return;
    }
    for (let i = 0; i < this.eventBusCore.length; i++) {
      if (this.eventBusCore[i].eventName === eventName) {
        if (arguments.length === 1) {
          return this.eventBusCore.splice(i, 1);
        }
        const removedEvent = this.eventBusCore.splice(i, 1)[0];
        if (typeof callbacks === "function") {
          for (let k = 1; k < arguments.length; k++) {
            removedEvent.eventFuncArr = this.removeFuncInFuncArr(removedEvent.eventFuncArr, arguments[k]);
          }
        }
        if (typeof callbacks === "object" && callbacks.length) {
          for (let x = 0; x < callbacks.length; x++) {
            removedEvent.eventFuncArr = this.removeFuncInFuncArr(removedEvent.eventFuncArr, callbacks[x]);
          }
        }
        this.eventBusCore.push(removedEvent);
      }
    }
  }
  trigger(eventName, data) {
    const event = this.getKeyValueObjInArr(this.eventBusCore, "eventName", eventName);
    if (event) {
      (event.eventFuncArr || []).forEach((fn) => {
        fn.apply(this, data);
      });
    }
  }
}
class ContextService {
  getDataFromNameSpace(nameSpace) {
    if (typeof window === "undefined") {
      return null;
    }
    return window[nameSpace];
  }
  setDataFromNameSpace(nameSpace, value) {
    if (typeof window === "undefined") {
      return;
    }
    window[nameSpace] = value;
  }
}
class StorageService {
  tryGetLocalStorage(key) {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(key);
  }
  trySetLocalStorage(key, value) {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(key, value);
  }
}
class ThemeService {
  constructor(eventBus, storage, context2) {
    __publicField(this, "eventBus");
    __publicField(this, "storage");
    __publicField(this, "context");
    __publicField(this, "currentTheme");
    __publicField(this, "contentElement");
    __publicField(this, "colorTransitionElement");
    __publicField(this, "extraData");
    __publicField(this, "_appendedClasses");
    __publicField(this, "mediaQuery");
    this.eventBus = eventBus === void 0 ? new EventBus() : eventBus;
    this.storage = storage === void 0 ? new StorageService() : storage;
    this.context = context2 === void 0 ? new ContextService() : context2;
  }
  set appendClasses(classes) {
    if (this._appendedClasses) {
      this.removeAppendedClass(this._appendedClasses);
    }
    if (classes) {
      this.addAppendClass(classes);
    }
    this._appendedClasses = classes;
  }
  get appendClasses() {
    return this._appendedClasses;
  }
  initializeTheme(specificThemeId, allowDynamicTheme) {
    const themeId = specificThemeId || this.storage.tryGetLocalStorage(THEME_KEY.userLastPreferTheme) || this.context.getDataFromNameSpace(THEME_KEY.currentTheme);
    let theme;
    if (themeId) {
      const themes = this.context.getDataFromNameSpace(THEME_KEY.themeCollection);
      if (themes && Object.keys(themes).length > 0) {
        theme = themes[themeId];
      }
    }
    this.currentTheme = theme || infinityTheme;
    this.createColorTransition();
    if (!theme && allowDynamicTheme) {
      return;
    }
    this.applyTheme(this.currentTheme);
  }
  formatCSSVariables(themeData) {
    return Object.keys(themeData).map((cssVar) => "--" + cssVar + ":" + themeData[cssVar]).join(";");
  }
  applyTheme(theme) {
    this.addColorTransition();
    this.currentTheme = theme;
    if (!this.contentElement) {
      const styleElement = document.getElementById(THEME_KEY.styleElementId);
      if (styleElement) {
        this.contentElement = styleElement;
      } else {
        this.contentElement = document.createElement("style");
        this.contentElement.id = THEME_KEY.styleElementId;
        document.head.appendChild(this.contentElement);
      }
    }
    this.contentElement.innerText = ":root { " + this.formatCSSVariables(theme.data) + " }";
    this.contentElement.setAttribute(THEME_KEY.uiThemeAttributeName, this.currentTheme.id);
    document.body.setAttribute(THEME_KEY.uiThemeAttributeName, this.currentTheme.id);
    this.applyExtraData();
    this.saveCustomTheme(this.currentTheme);
    this.notify(theme, "themeChanged");
    setTimeout(() => {
      this.removeColorTransition();
    }, 500);
  }
  saveCustomTheme(customTheme) {
    this.storage.trySetLocalStorage(THEME_KEY.userLastPreferTheme, customTheme.id);
    this.storage.trySetLocalStorage(THEME_KEY.userLastPreferThemeData, JSON.stringify(customTheme.data));
    this.context.setDataFromNameSpace(THEME_KEY.currentTheme, customTheme.id);
  }
  notify(theme, eventType) {
    if (!this.eventBus) {
      return;
    }
    this.eventBus.trigger(eventType, theme);
  }
  setEventBus(eb) {
    this.eventBus = eb;
  }
  addAppendClass(classNames) {
    document.body.classList.add(...classNames);
  }
  removeAppendedClass(classNames) {
    document.body.classList.remove(...classNames);
  }
  setExtraData(data, apply = false) {
    this.extraData = data;
    if (apply) {
      this.applyExtraData();
    }
  }
  applyExtraData() {
    const theme = this.currentTheme;
    if (this.extraData && this.extraData[theme.id] && this.extraData[theme.id].cssVariables) {
      this.contentElement.innerText = ":root { " + this.formatCSSVariables(theme.data) + " }:root { " + this.formatCSSVariables(this.extraData[theme.id].cssVariables) + " }";
    }
    if (this.extraData && this.extraData[theme.id] && this.extraData[theme.id].appendClasses) {
      this.appendClasses = this.extraData[theme.id].appendClasses;
    } else {
      this.appendClasses = void 0;
    }
  }
  unloadTheme() {
    if (this.contentElement && document.contains(this.contentElement)) {
      this.contentElement.parentElement.removeChild(this.contentElement);
    }
    if (this.appendClasses) {
      this.appendClasses = void 0;
    }
  }
  registerMediaQuery() {
    if (!this.mediaQuery) {
      this.mediaQuery = new PrefersColorSchemeMediaQuery();
    }
    this.mediaQuery.register();
  }
  unregisterMediaQuery() {
    if (!this.mediaQuery) {
      return;
    }
    this.mediaQuery.unregister();
    this.mediaQuery = void 0;
  }
  createColorTransition() {
    this.colorTransitionElement = document.createElement("style");
    this.colorTransitionElement.id = THEME_KEY.transitionStyleElementId;
    this.colorTransitionElement.innerText = `
      * { transition: background .3s ease-out, background-color .3s ease-out,
                    border .3s ease-out, border-color .3s ease-out,
                    box-shadow .3s ease-out, box-shadow-color .3s ease-out}
    `;
  }
  addColorTransition() {
    document.head.appendChild(this.colorTransitionElement);
  }
  removeColorTransition() {
    if (!this.colorTransitionElement.parentElement) {
      return;
    }
    this.colorTransitionElement.parentElement.removeChild(this.colorTransitionElement);
  }
}
function ThemeServiceInit(themes, defaultThemeName, extraData, ieSupport = false, allowDynamicTheme = false) {
  if (typeof window === "undefined") {
    return null;
  }
  window[THEME_KEY.themeCollection] = themes || {
    "b-light-theme": devuiLightTheme,
    "b-dark-theme": devuiDarkTheme
  };
  window[THEME_KEY.currentTheme] = defaultThemeName || "b-light-theme";
  const eventBus = window["globalEventBus"] || new EventBus();
  const themeService = new ThemeService(eventBus);
  window[THEME_KEY.themeService] = themeService;
  themeService.setExtraData(extraData || {
    "b-dark-theme": {
      appendClasses: ["dark-mode"]
    }
  });
  themeService.initializeTheme(void 0, allowDynamicTheme);
  if (ieSupport) {
    ieSupportCssVar();
  }
  return themeService;
}
function ThemeServiceFollowSystemOn(themeConfig) {
  if (typeof window === "undefined") {
    return null;
  }
  const themeService = window[THEME_KEY.themeService];
  themeService.registerMediaQuery();
  return themeService.mediaQuery.prefersColorSchemeChange.subscribe((value) => {
    if (value === "dark") {
      themeService.applyTheme(window[THEME_KEY.themeCollection][themeConfig && themeConfig.darkThemeName || "b-dark-theme"]);
    } else {
      themeService.applyTheme(window[THEME_KEY.themeCollection][themeConfig && themeConfig.lightThemeName || "b-light-theme"]);
    }
  });
}
function ThemeServiceFollowSystemOff(sub) {
  if (typeof window === "undefined") {
    return null;
  }
  if (sub) {
    sub.unsubscribe();
  }
  const themeService = window[THEME_KEY.themeService];
  themeService.unregisterMediaQuery();
}
function ieSupportCssVar() {
  if (typeof window === "undefined") {
    return null;
  }
  const isNativeSupport2 = window["CSS"] && CSS.supports && CSS.supports("(--a: 0)") || false;
  if (isNativeSupport2) {
    return;
  }
  cssVars({ watch: true, silent: true });
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      cssVars({ watch: false, silent: true });
      cssVars({ watch: true, silent: true });
    });
  });
  const config2 = { attributes: true, attributeFilter: [THEME_KEY.uiThemeAttributeName] };
  observer.observe(document.querySelector(`#${THEME_KEY.styleElementId}`), config2);
}
export { ContextService, EventBus, StorageService, Theme, ThemeService, ThemeServiceFollowSystemOff, ThemeServiceFollowSystemOn, ThemeServiceInit, deepTheme, devuiDarkTheme, devuiGreenDarkTheme, devuiGreenTheme, devuiLightTheme, galaxyTheme, ieSupportCssVar, infinityTheme, provenceTheme, sweetTheme };
