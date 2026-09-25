// Lambert conformal conic projection shared by the build script (Node) and the browser.
// Output units are kilometres, y grows downwards (SVG), origin shifted to the map view.
(function (root) {
  "use strict";
  var RAD = Math.PI / 180;
  var PARAMS = { lon0: 18, lat0: 58, lat1: 52, lat2: 66, R: 6371 };

  function makeLcc(p) {
    var t = function (phi) { return Math.tan(Math.PI / 4 + phi / 2); };
    var p1 = p.lat1 * RAD, p2 = p.lat2 * RAD, p0 = p.lat0 * RAD;
    var n = Math.log(Math.cos(p1) / Math.cos(p2)) / Math.log(t(p2) / t(p1));
    var F = Math.cos(p1) * Math.pow(t(p1), n) / n;
    var rho0 = p.R * F / Math.pow(t(p0), n);
    return function (lon, lat) {
      var rho = p.R * F / Math.pow(t(lat * RAD), n);
      var theta = n * (lon - p.lon0) * RAD;
      return [rho * Math.sin(theta), -(rho0 - rho * Math.cos(theta))];
    };
  }

  var raw = makeLcc(PARAMS);
  var api = {
    params: PARAMS,
    raw: raw,
    // origin is filled in from the generated geo data so the browser matches the build exactly
    origin: [0, 0],
    project: function (lon, lat) {
      var p = raw(lon, lat);
      return [p[0] - api.origin[0], p[1] - api.origin[1]];
    }
  };
  root.SM = root.SM || {};
  root.SM.projection = api;
})(typeof window !== "undefined" ? window : globalThis);
