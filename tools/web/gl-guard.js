// WebGL guard for three.js or raw WebGL pages. Load it first, as a plain script in <head>:
//   <script src="js/gl-guard.js"></script>
// Browsers keep only about 16 live WebGL contexts, shared by every open tab of the site, so canvases on later
// pages can die. This frees them when a page is hidden or closed, and reloads a page restored from the
// back/forward cache instead of showing dead canvases.
//   if (window.__glOK()) { const r = window.__glTrack(new THREE.WebGLRenderer({ canvas })); ... }
// When __glOK() is false, leave the still image showing: every 3D scene needs a still behind it.
(function () {
  var list = [];
  var KEY = 'gl-guard-had-gl';
  window.__glTrack = function (r) { if (r && list.indexOf(r) < 0) list.push(r); return r; };
  // Feature probe that does not keep a context alive.
  window.__glOK = function () {
    try {
      var c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
      if (!g) return false;
      var x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext();
      return true;
    } catch (e) { return false; }
  };
  addEventListener('pagehide', function () {
    list.forEach(function (r) { try { r.dispose(); r.forceContextLoss(); } catch (e) {} });
    if (list.length) { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
    list.length = 0;
  });
  addEventListener('pageshow', function (e) {
    var had = false; try { had = sessionStorage.getItem(KEY) === '1'; } catch (x) {}
    if (e.persisted && had) location.reload();
  });
})();
