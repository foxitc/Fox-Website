/* Fox ITC — UTM attribution shim.
 * Captures the platform a visitor arrived from (utm_source/medium/campaign),
 * remembers it first-touch, and injects it into lead-form POSTs so Fox 360 can
 * attribute every enquiry/download/quiz to the channel it came from — without
 * needing to touch the (prebuilt) app bundles. Safe + best-effort throughout.
 */
(function () {
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('utm_source')) {
      localStorage.setItem('fox_utm', JSON.stringify({
        s: q.get('utm_source'), m: q.get('utm_medium') || '', c: q.get('utm_campaign') || ''
      }));
    }
  } catch (e) {}

  function getUtm() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('utm_source')) {
        return { s: q.get('utm_source'), m: q.get('utm_medium') || '', c: q.get('utm_campaign') || '' };
      }
      var st = JSON.parse(localStorage.getItem('fox_utm') || '{}');
      if (st && st.s) return st;
    } catch (e) {}
    return { s: '', m: '', c: '' };
  }

  var LEAD_API = /\/api\/(contact|download|readiness|enquiry|lead|signup|book)/i;
  var _fetch = window.fetch;
  if (typeof _fetch !== 'function') return;

  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var method = (init && init.method) || (typeof input === 'object' && input && input.method) || 'GET';
      if (String(method).toUpperCase() === 'POST' && LEAD_API.test(url) &&
          init && typeof init.body === 'string') {
        var u = getUtm();
        if (u.s) {
          var b = JSON.parse(init.body);
          if (b && typeof b === 'object' && !Array.isArray(b)) {
            if (!b.utm_source) b.utm_source = u.s;
            if (!b.utm_medium) b.utm_medium = u.m;
            if (!b.utm_campaign) b.utm_campaign = u.c;
            init = Object.assign({}, init, { body: JSON.stringify(b) });
          }
        }
      }
    } catch (e) { /* never break a real submit */ }
    return _fetch.call(this, input, init);
  };
})();
