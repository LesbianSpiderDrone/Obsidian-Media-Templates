<%*
/*
 * ═══════════════════════════════════════════════════════════
 *  Media Templates — Shared Context Helper
 *  Include at the top of every template with:
 *    <%* tp.user.mt_context() _%>
 *  OR copy this block directly into the template.
 * ═══════════════════════════════════════════════════════════
 *
 *  Runtime detection order:
 *    1. QuickAdd macro  — variables were substituted before Templater ran
 *    2. Plugin API      — window.MediaTemplates exposes the media library
 *    3. Manual prompts  — fallback for standalone Templater use
 */

// If QuickAdd has run its User Script, {{VALUE:x}} has already been replaced
// by literal values. If Templater is running standalone, the string still
// contains the literal "{{VALUE:...}}" text — so we can detect which case we're in.
const _qa_test = `{{VALUE:mediaTitle}}`;
const _fromQA  = !_qa_test.startsWith("{{VALUE");

let _mt_media      = null;   // full Media object (if plugin available)
let _mediaTitle    = "";
let _mediaSlug     = "";
let _mediaType     = "";
let _mediaGenres   = "";
let _mediaYear     = "";
let _mediaStatus   = "";

if (_fromQA) {
    // Values set by scripts/MediaNote.js QuickAdd user script
    _mediaTitle   = `{{VALUE:mediaTitle}}`;
    _mediaSlug    = `{{VALUE:mediaSlug}}`;
    _mediaType    = `{{VALUE:mediaType}}`;
    _mediaGenres  = `{{VALUE:mediaGenres}}`;
    _mediaYear    = `{{VALUE:mediaYear}}`;
    _mediaStatus  = `{{VALUE:mediaStatus}}`;
} else {
    // Not from QuickAdd — try plugin API, then fall back to prompts
    const _plugin = window?.MediaTemplates?.api;
    if (_plugin) {
        const _list = _plugin.getMediaList();
        if (_list.length > 0) {
            _mt_media = await tp.system.suggester(
                _list.map(m => `${m.title}  [${m.type}]${m.status === "watching" ? " ▶" : ""}`),
                _list,
                false,
                "Select media:"
            );
        }
    }
    if (_mt_media) {
        _mediaTitle  = _mt_media.title;
        _mediaType   = _mt_media.type;
        _mediaGenres = (_mt_media.genres ?? []).join(", ");
        _mediaYear   = _mt_media.year ? String(_mt_media.year) : "";
        _mediaStatus = _mt_media.status ?? "";
    } else {
        _mediaTitle  = await tp.system.prompt("Media title:", "");
        _mediaType   = "unknown";
        _mediaGenres = "";
        _mediaYear   = "";
        _mediaStatus = "";
    }
    _mediaSlug = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
_%>
