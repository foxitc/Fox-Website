/*!
 * FoxArcMedia — the canonical Fox ITC three-arc signature component.
 *
 * It renders the three arcs using the EXACT alpha masks extracted from the
 * supplied master artwork (assets/fox-arcs-original.png). The arcs are never
 * redrawn with CSS borders or SVG strokes — each layer is CSS-masked by its
 * mask PNG, and all three share one fixed 1:1 coordinate box so they stay in
 * perfect register. Rotation / mirroring is applied to the GROUP, not to the
 * individual arcs.
 *
 * Usage:
 *   <script src="/brand-system/components/fox-arc-media.js"></script>
 *   <fox-arc-media mode="solid" fill="#FB471B" style="width:120px"></fox-arc-media>
 *   <fox-arc-media mode="photo" src="/hero.jpg" rotate="90"></fox-arc-media>
 *   <fox-arc-media mode="watermark" fill="#15213A" opacity="0.06"></fox-arc-media>
 *   <fox-arc-media mode="pulse"></fox-arc-media>
 *   <fox-arc-media mode="photo" src-outer="a.jpg" src-middle="b.jpg" src-inner="c.jpg"></fox-arc-media>
 *
 * Attributes:
 *   mode      solid | photo | watermark | outline | pulse        (default solid)
 *   fill      CSS colour for solid/watermark/outline/pulse        (default #FB471B)
 *   rotate    0 | 90 | 180 | 270   (group transform)              (default 0)
 *   flip      none | h | v         (group mirror)                 (default none)
 *   opacity   0..1   (whole motif)                                (default 1)
 *   src       photo for all arcs (photo mode)
 *   src-outer / src-middle / src-inner   per-arc photo (overrides src)
 *   focal / focal-outer / focal-middle / focal-inner   background-position (default 50% 50%)
 *   overlay   CSS gradient/colour laid over the photo (optional)
 *   base      mask asset base path   (default /brand-system/assets/masks)
 *   label     accessible label; omit/empty => decorative (aria-hidden)
 */
(function () {
  if (customElements.get("fox-arc-media")) return;
  var ARCS = ["outer", "middle", "inner"];
  var DEFAULT_BASE = "/brand-system/assets/masks";

  function maskCss(url) {
    return "-webkit-mask:url('" + url + "') no-repeat center/contain;" +
           "mask:url('" + url + "') no-repeat center/contain;";
  }

  class FoxArcMedia extends HTMLElement {
    static get observedAttributes() {
      return ["mode","fill","rotate","flip","opacity","src","src-outer","src-middle",
              "src-inner","focal","focal-outer","focal-middle","focal-inner","overlay","base","label"];
    }
    connectedCallback() { if (!this.shadowRoot) this.attachShadow({ mode: "open" }); this.render(); }
    attributeChangedCallback() { if (this.shadowRoot) this.render(); }

    render() {
      var a = (n, d) => this.getAttribute(n) != null ? this.getAttribute(n) : d;
      var mode = a("mode", "solid");
      var fill = a("fill", "#FB471B");
      var base = a("base", DEFAULT_BASE);
      var rotate = parseInt(a("rotate", "0"), 10) || 0;
      var flip = a("flip", "none");
      var opacity = a("opacity", mode === "watermark" ? "0.06" : "1");
      var overlay = a("overlay", "");
      var label = a("label", "");
      var suffix = mode === "outline" ? "-outline" : "";

      var sx = flip === "h" ? -1 : 1, sy = flip === "v" ? -1 : 1;
      var groupTransform = "rotate(" + rotate + "deg) scale(" + sx + "," + sy + ")";

      var layers = ARCS.map(function (arc) {
        var url = base + "/fox-arc-" + arc + suffix + ".png";
        var bg = "";
        if (mode === "photo") {
          var src = a("src-" + arc, a("src", ""));
          var focal = a("focal-" + arc, a("focal", "50% 50%"));
          var img = overlay ? (overlay + ",url('" + src + "')") : "url('" + src + "')";
          bg = "background:" + (src ? img : fill) + ";background-size:cover;background-position:" + focal + ";";
        } else {
          bg = "background:" + fill + ";";
        }
        var pulseCls = mode === "pulse" ? (" pulse pulse-" + arc) : "";
        return '<i class="arc' + pulseCls + '" style="' + bg + maskCss(url) + '"></i>';
      }).join("");

      var decorative = !label;
      this.setAttribute("role", decorative ? "presentation" : "img");
      if (decorative) this.setAttribute("aria-hidden", "true");
      else { this.removeAttribute("aria-hidden"); this.setAttribute("aria-label", label); }

      this.shadowRoot.innerHTML =
        '<style>' +
        ':host{display:inline-block;width:120px;aspect-ratio:1/1;line-height:0;opacity:' + opacity + ';}' +
        '.group{position:relative;width:100%;height:100%;transform:' + groupTransform + ';transform-origin:50% 50%;}' +
        '.arc{position:absolute;inset:0;display:block;}' +
        '@keyframes foxpulse{0%,70%,100%{opacity:.25}20%{opacity:1}}' +
        '.pulse{opacity:.25;animation:foxpulse 2.4s ease-in-out infinite;}' +
        '.pulse-outer{animation-delay:0s}.pulse-middle{animation-delay:.25s}.pulse-inner{animation-delay:.5s}' +
        '@media (prefers-reduced-motion: reduce){.pulse{animation:none;opacity:1;}}' +
        '</style>' +
        '<div class="group" part="group">' + layers + '</div>';
    }
  }
  customElements.define("fox-arc-media", FoxArcMedia);
})();
