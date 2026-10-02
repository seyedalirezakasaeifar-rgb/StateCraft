/* STATECRAFT — bootstrap */
(function () {
  function boot() {
    try {
      SC.loadSettings();
      SC.loadMods();
      SC.build();
      if (SC.reg.errors.length) console.warn('Data validation errors', SC.reg.errors);
      SC.UI.applySettings();
      SC.UI.showMenu();
    } catch (e) {
      console.error(e);
      document.getElementById('app').innerHTML = '<pre style="color:#ff8a8a;padding:20px;white-space:pre-wrap">Failed to start: ' + SC.esc(e.stack || e.message) + '</pre>';
    }
  }
  window.addEventListener('error', e => console.error('Uncaught', e.message));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* Autosave when the app goes to the background (called by the Android shell and by the page lifecycle) */
SC.onPause = function () { try { if (SC.UI && SC.UI.G && !SC.UI.busy && !SC.UI.G.over) SC.autosave(SC.UI.G); } catch (e) { } };
document.addEventListener('visibilitychange', function () { if (document.hidden) SC.onPause(); });
