import '/@fs/rbd/pnpm-volume/b35178e4-d221-4afc-bda6-36275e2af39f/node_modules/vite/dist/client/env.mjs';

const base$1 = "/" || '/';
// set :host styles to make playwright detect the element as visible
const template = /*html*/ `
<style>
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  width: 800px;
  color: var(--window-color);
  margin: 30px auto;
  padding: 25px 40px;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<div class="backdrop" part="backdrop">
  <div class="window" part="window">
    <pre class="message" part="message"><span class="plugin"></span><span class="message-body"></span></pre>
    <pre class="file" part="file"></pre>
    <pre class="frame" part="frame"></pre>
    <pre class="stack" part="stack"></pre>
    <div class="tip" part="tip">
      Click outside or fix the code to dismiss.<br>
      You can also disable this overlay by setting
      <code>server.hmr.overlay</code> to <code>false</code> in <code>vite.config.js.</code>
    </div>
  </div>
</div>
`;
const fileRE = /(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g;
const codeframeRE = /^(?:>?\s+\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm;
// Allow `ErrorOverlay` to extend `HTMLElement` even in environments where
// `HTMLElement` was not originally defined.
const { HTMLElement = class {
} } = globalThis;
class ErrorOverlay extends HTMLElement {
    constructor(err, links = true) {
        var _a;
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = template;
        codeframeRE.lastIndex = 0;
        const hasFrame = err.frame && codeframeRE.test(err.frame);
        const message = hasFrame
            ? err.message.replace(codeframeRE, '')
            : err.message;
        if (err.plugin) {
            this.text('.plugin', `[plugin:${err.plugin}] `);
        }
        this.text('.message-body', message.trim());
        const [file] = (((_a = err.loc) === null || _a === void 0 ? void 0 : _a.file) || err.id || 'unknown file').split(`?`);
        if (err.loc) {
            this.text('.file', `${file}:${err.loc.line}:${err.loc.column}`, links);
        }
        else if (err.id) {
            this.text('.file', file);
        }
        if (hasFrame) {
            this.text('.frame', err.frame.trim());
        }
        this.text('.stack', err.stack, links);
        this.root.querySelector('.window').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        this.addEventListener('click', () => {
            this.close();
        });
    }
    text(selector, text, linkFiles = false) {
        const el = this.root.querySelector(selector);
        if (!linkFiles) {
            el.textContent = text;
        }
        else {
            let curIndex = 0;
            let match;
            fileRE.lastIndex = 0;
            while ((match = fileRE.exec(text))) {
                const { 0: file, index } = match;
                if (index != null) {
                    const frag = text.slice(curIndex, index);
                    el.appendChild(document.createTextNode(frag));
                    const link = document.createElement('a');
                    link.textContent = file;
                    link.className = 'file-link';
                    link.onclick = () => {
                        fetch(`${base$1}__open-in-editor?file=` + encodeURIComponent(file));
                    };
                    el.appendChild(link);
                    curIndex += frag.length + file.length;
                }
            }
        }
    }
    close() {
        var _a;
        (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this);
    }
}
const overlayId = 'vite-error-overlay';
const { customElements } = globalThis; // Ensure `customElements` is defined before the next line.
if (customElements && !customElements.get(overlayId)) {
    customElements.define(overlayId, ErrorOverlay);
}

console.debug('[vite] connecting...');
const importMetaUrl = new URL(import.meta.url);
// use server configuration, then fallback to inference
const serverHost = "localhost:3000/";
const socketProtocol = null || (location.protocol === 'https:' ? 'wss' : 'ws');
const hmrPort = 443;
const socketHost = `${null || importMetaUrl.hostname}:${hmrPort || importMetaUrl.port}${"/"}`;
const directSocketHost = "localhost:3000/";
const base = "/" || '/';
const messageBuffer = [];
let socket;
try {
    let fallback;
    // only use fallback when port is inferred to prevent confusion
    if (!hmrPort) {
        fallback = () => {
            // fallback to connecting directly to the hmr server
            // for servers which does not support proxying websocket
            socket = setupWebSocket(socketProtocol, directSocketHost, () => {
                const currentScriptHostURL = new URL(import.meta.url);
                const currentScriptHost = currentScriptHostURL.host +
                    currentScriptHostURL.pathname.replace(/@vite\/client$/, '');
                console.error('[vite] failed to connect to websocket.\n' +
                    'your current setup:\n' +
                    `  (browser) ${currentScriptHost} <--[HTTP]--> ${serverHost} (server)\n` +
                    `  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)\n` +
                    'Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .');
            });
            socket.addEventListener('open', () => {
                console.info('[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.');
            }, { once: true });
        };
    }
    socket = setupWebSocket(socketProtocol, socketHost, fallback);
}
catch (error) {
    console.error(`[vite] failed to connect to websocket (${error}). `);
}
function setupWebSocket(protocol, hostAndPath, onCloseWithoutOpen) {
    const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');
    let isOpened = false;
    socket.addEventListener('open', () => {
        isOpened = true;
    }, { once: true });
    // Listen for messages
    socket.addEventListener('message', async ({ data }) => {
        handleMessage(JSON.parse(data));
    });
    // ping server
    socket.addEventListener('close', async ({ wasClean }) => {
        if (wasClean)
            return;
        if (!isOpened && onCloseWithoutOpen) {
            onCloseWithoutOpen();
            return;
        }
        console.log(`[vite] server connection lost. polling for restart...`);
        await waitForSuccessfulPing(protocol, hostAndPath);
        location.reload();
    });
    return socket;
}
function warnFailedFetch(err, path) {
    if (!err.message.match('fetch')) {
        console.error(err);
    }
    console.error(`[hmr] Failed to reload ${path}. ` +
        `This could be due to syntax errors or importing non-existent ` +
        `modules. (see errors above)`);
}
function cleanUrl(pathname) {
    const url = new URL(pathname, location.toString());
    url.searchParams.delete('direct');
    return url.pathname + url.search;
}
let isFirstUpdate = true;
const outdatedLinkTags = new WeakSet();
async function handleMessage(payload) {
    switch (payload.type) {
        case 'connected':
            console.debug(`[vite] connected.`);
            sendMessageBuffer();
            // proxy(nginx, docker) hmr ws maybe caused timeout,
            // so send ping package let ws keep alive.
            setInterval(() => {
                if (socket.readyState === socket.OPEN) {
                    socket.send('{"type":"ping"}');
                }
            }, 30000);
            break;
        case 'update':
            notifyListeners('vite:beforeUpdate', payload);
            // if this is the first update and there's already an error overlay, it
            // means the page opened with existing server compile error and the whole
            // module script failed to load (since one of the nested imports is 500).
            // in this case a normal update won't work and a full reload is needed.
            if (isFirstUpdate && hasErrorOverlay()) {
                window.location.reload();
                return;
            }
            else {
                clearErrorOverlay();
                isFirstUpdate = false;
            }
            await Promise.all(payload.updates.map(async (update) => {
                if (update.type === 'js-update') {
                    return queueUpdate(fetchUpdate(update));
                }
                // css-update
                // this is only sent when a css file referenced with <link> is updated
                const { path, timestamp } = update;
                const searchUrl = cleanUrl(path);
                // can't use querySelector with `[href*=]` here since the link may be
                // using relative paths so we need to use link.href to grab the full
                // URL for the include check.
                const el = Array.from(document.querySelectorAll('link')).find((e) => !outdatedLinkTags.has(e) && cleanUrl(e.href).includes(searchUrl));
                if (!el) {
                    return;
                }
                const newPath = `${base}${searchUrl.slice(1)}${searchUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
                // rather than swapping the href on the existing tag, we will
                // create a new link tag. Once the new stylesheet has loaded we
                // will remove the existing link tag. This removes a Flash Of
                // Unstyled Content that can occur when swapping out the tag href
                // directly, as the new stylesheet has not yet been loaded.
                return new Promise((resolve) => {
                    const newLinkTag = el.cloneNode();
                    newLinkTag.href = new URL(newPath, el.href).href;
                    const removeOldEl = () => {
                        el.remove();
                        console.debug(`[vite] css hot updated: ${searchUrl}`);
                        resolve();
                    };
                    newLinkTag.addEventListener('load', removeOldEl);
                    newLinkTag.addEventListener('error', removeOldEl);
                    outdatedLinkTags.add(el);
                    el.after(newLinkTag);
                });
            }));
            notifyListeners('vite:afterUpdate', payload);
            break;
        case 'custom': {
            notifyListeners(payload.event, payload.data);
            break;
        }
        case 'full-reload':
            notifyListeners('vite:beforeFullReload', payload);
            if (payload.path && payload.path.endsWith('.html')) {
                // if html file is edited, only reload the page if the browser is
                // currently on that page.
                const pagePath = decodeURI(location.pathname);
                const payloadPath = base + payload.path.slice(1);
                if (pagePath === payloadPath ||
                    payload.path === '/index.html' ||
                    (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)) {
                    location.reload();
                }
                return;
            }
            else {
                location.reload();
            }
            break;
        case 'prune':
            notifyListeners('vite:beforePrune', payload);
            // After an HMR update, some modules are no longer imported on the page
            // but they may have left behind side effects that need to be cleaned up
            // (.e.g style injections)
            // TODO Trigger their dispose callbacks.
            payload.paths.forEach((path) => {
                const fn = pruneMap.get(path);
                if (fn) {
                    fn(dataMap.get(path));
                }
            });
            break;
        case 'error': {
            notifyListeners('vite:error', payload);
            const err = payload.err;
            if (enableOverlay) {
                createErrorOverlay(err);
            }
            else {
                console.error(`[vite] Internal Server Error\n${err.message}\n${err.stack}`);
            }
            break;
        }
        default: {
            const check = payload;
            return check;
        }
    }
}
function notifyListeners(event, data) {
    const cbs = customListenersMap.get(event);
    if (cbs) {
        cbs.forEach((cb) => cb(data));
    }
}
const enableOverlay = true;
function createErrorOverlay(err) {
    if (!enableOverlay)
        return;
    clearErrorOverlay();
    document.body.appendChild(new ErrorOverlay(err));
}
function clearErrorOverlay() {
    document
        .querySelectorAll(overlayId)
        .forEach((n) => n.close());
}
function hasErrorOverlay() {
    return document.querySelectorAll(overlayId).length;
}
let pending = false;
let queued = [];
/**
 * buffer multiple hot updates triggered by the same src change
 * so that they are invoked in the same order they were sent.
 * (otherwise the order may be inconsistent because of the http request round trip)
 */
async function queueUpdate(p) {
    queued.push(p);
    if (!pending) {
        pending = true;
        await Promise.resolve();
        pending = false;
        const loading = [...queued];
        queued = [];
        (await Promise.all(loading)).forEach((fn) => fn && fn());
    }
}
async function waitForSuccessfulPing(socketProtocol, hostAndPath, ms = 1000) {
    const pingHostProtocol = socketProtocol === 'wss' ? 'https' : 'http';
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // A fetch on a websocket URL will return a successful promise with status 400,
            // but will reject a networking error.
            // When running on middleware mode, it returns status 426, and an cors error happens if mode is not no-cors
            await fetch(`${pingHostProtocol}://${hostAndPath}`, {
                mode: 'no-cors',
            });
            break;
        }
        catch (e) {
            // wait ms before attempting to ping again
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
}
const sheetsMap = new Map();
function updateStyle(id, content) {
    let style = sheetsMap.get(id);
    {
        if (style && !(style instanceof HTMLStyleElement)) {
            removeStyle(id);
            style = undefined;
        }
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.setAttribute('data-vite-dev-id', id);
            style.textContent = content;
            document.head.appendChild(style);
        }
        else {
            style.textContent = content;
        }
    }
    sheetsMap.set(id, style);
}
function removeStyle(id) {
    const style = sheetsMap.get(id);
    if (style) {
        if (style instanceof CSSStyleSheet) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== style);
        }
        else {
            document.head.removeChild(style);
        }
        sheetsMap.delete(id);
    }
}
async function fetchUpdate({ path, acceptedPath, timestamp, explicitImportRequired, }) {
    const mod = hotModulesMap.get(path);
    if (!mod) {
        // In a code-splitting project,
        // it is common that the hot-updating module is not loaded yet.
        // https://github.com/vitejs/vite/issues/721
        return;
    }
    let fetchedModule;
    const isSelfUpdate = path === acceptedPath;
    // determine the qualified callbacks before we re-import the modules
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => deps.includes(acceptedPath));
    if (isSelfUpdate || qualifiedCallbacks.length > 0) {
        const disposer = disposeMap.get(acceptedPath);
        if (disposer)
            await disposer(dataMap.get(acceptedPath));
        const [acceptedPathWithoutQuery, query] = acceptedPath.split(`?`);
        try {
            fetchedModule = await import(
            /* @vite-ignore */
            base +
                acceptedPathWithoutQuery.slice(1) +
                `?${explicitImportRequired ? 'import&' : ''}t=${timestamp}${query ? `&${query}` : ''}`);
        }
        catch (e) {
            warnFailedFetch(e, acceptedPath);
        }
    }
    return () => {
        for (const { deps, fn } of qualifiedCallbacks) {
            fn(deps.map((dep) => (dep === acceptedPath ? fetchedModule : undefined)));
        }
        const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.debug(`[vite] hot updated: ${loggedPath}`);
    };
}
function sendMessageBuffer() {
    if (socket.readyState === 1) {
        messageBuffer.forEach((msg) => socket.send(msg));
        messageBuffer.length = 0;
    }
}
const hotModulesMap = new Map();
const disposeMap = new Map();
const pruneMap = new Map();
const dataMap = new Map();
const customListenersMap = new Map();
const ctxToListenersMap = new Map();
function createHotContext(ownerPath) {
    if (!dataMap.has(ownerPath)) {
        dataMap.set(ownerPath, {});
    }
    // when a file is hot updated, a new context is created
    // clear its stale callbacks
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    }
    // clear stale custom event listeners
    const staleListeners = ctxToListenersMap.get(ownerPath);
    if (staleListeners) {
        for (const [event, staleFns] of staleListeners) {
            const listeners = customListenersMap.get(event);
            if (listeners) {
                customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
            }
        }
    }
    const newListeners = new Map();
    ctxToListenersMap.set(ownerPath, newListeners);
    function acceptDeps(deps, callback = () => { }) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: [],
        };
        mod.callbacks.push({
            deps,
            fn: callback,
        });
        hotModulesMap.set(ownerPath, mod);
    }
    const hot = {
        get data() {
            return dataMap.get(ownerPath);
        },
        accept(deps, callback) {
            if (typeof deps === 'function' || !deps) {
                // self-accept: hot.accept(() => {})
                acceptDeps([ownerPath], ([mod]) => deps === null || deps === void 0 ? void 0 : deps(mod));
            }
            else if (typeof deps === 'string') {
                // explicit deps
                acceptDeps([deps], ([mod]) => callback === null || callback === void 0 ? void 0 : callback(mod));
            }
            else if (Array.isArray(deps)) {
                acceptDeps(deps, callback);
            }
            else {
                throw new Error(`invalid hot.accept() usage.`);
            }
        },
        // export names (first arg) are irrelevant on the client side, they're
        // extracted in the server for propagation
        acceptExports(_, callback) {
            acceptDeps([ownerPath], ([mod]) => callback === null || callback === void 0 ? void 0 : callback(mod));
        },
        dispose(cb) {
            disposeMap.set(ownerPath, cb);
        },
        prune(cb) {
            pruneMap.set(ownerPath, cb);
        },
        // Kept for backward compatibility (#11036)
        // @ts-expect-error untyped
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        decline() { },
        // tell the server to re-perform hmr propagation from this module as root
        invalidate(message) {
            notifyListeners('vite:invalidate', { path: ownerPath, message });
            this.send('vite:invalidate', { path: ownerPath, message });
            console.debug(`[vite] invalidate ${ownerPath}${message ? `: ${message}` : ''}`);
        },
        // custom events
        on(event, cb) {
            const addToMap = (map) => {
                const existing = map.get(event) || [];
                existing.push(cb);
                map.set(event, existing);
            };
            addToMap(customListenersMap);
            addToMap(newListeners);
        },
        send(event, data) {
            messageBuffer.push(JSON.stringify({ type: 'custom', event, data }));
            sendMessageBuffer();
        },
    };
    return hot;
}
/**
 * urls here are dynamic import() urls that couldn't be statically analyzed
 */
function injectQuery(url, queryToInject) {
    // skip urls that won't be handled by vite
    if (!url.startsWith('.') && !url.startsWith('/')) {
        return url;
    }
    // can't use pathname from URL since it may be relative like ../
    const pathname = url.replace(/#.*$/, '').replace(/\?.*$/, '');
    const { search, hash } = new URL(url, 'http://vitejs.dev');
    return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ''}${hash || ''}`;
}

export { ErrorOverlay, createHotContext, injectQuery, removeStyle, updateStyle };
                                   

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC9vdmVybGF5LnRzIiwiLi4vLi4vc3JjL2NsaWVudC9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFcnJvclBheWxvYWQgfSBmcm9tICd0eXBlcy9obXJQYXlsb2FkJ1xuXG4vLyBpbmplY3RlZCBieSB0aGUgaG1yIHBsdWdpbiB3aGVuIHNlcnZlZFxuZGVjbGFyZSBjb25zdCBfX0JBU0VfXzogc3RyaW5nXG5cbmNvbnN0IGJhc2UgPSBfX0JBU0VfXyB8fCAnLydcblxuLy8gc2V0IDpob3N0IHN0eWxlcyB0byBtYWtlIHBsYXl3cmlnaHQgZGV0ZWN0IHRoZSBlbGVtZW50IGFzIHZpc2libGVcbmNvbnN0IHRlbXBsYXRlID0gLypodG1sKi8gYFxuPHN0eWxlPlxuOmhvc3Qge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgei1pbmRleDogOTk5OTk7XG4gIC0tbW9ub3NwYWNlOiAnU0ZNb25vLVJlZ3VsYXInLCBDb25zb2xhcyxcbiAgJ0xpYmVyYXRpb24gTW9ubycsIE1lbmxvLCBDb3VyaWVyLCBtb25vc3BhY2U7XG4gIC0tcmVkOiAjZmY1NTU1O1xuICAtLXllbGxvdzogI2UyYWE1MztcbiAgLS1wdXJwbGU6ICNjZmE0ZmY7XG4gIC0tY3lhbjogIzJkZDlkYTtcbiAgLS1kaW06ICNjOWM5Yzk7XG5cbiAgLS13aW5kb3ctYmFja2dyb3VuZDogIzE4MTgxODtcbiAgLS13aW5kb3ctY29sb3I6ICNkOGQ4ZDg7XG59XG5cbi5iYWNrZHJvcCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogOTk5OTk7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICBtYXJnaW46IDA7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC42Nik7XG59XG5cbi53aW5kb3cge1xuICBmb250LWZhbWlseTogdmFyKC0tbW9ub3NwYWNlKTtcbiAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgd2lkdGg6IDgwMHB4O1xuICBjb2xvcjogdmFyKC0td2luZG93LWNvbG9yKTtcbiAgbWFyZ2luOiAzMHB4IGF1dG87XG4gIHBhZGRpbmc6IDI1cHggNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS13aW5kb3ctYmFja2dyb3VuZCk7XG4gIGJvcmRlci1yYWRpdXM6IDZweCA2cHggOHB4IDhweDtcbiAgYm94LXNoYWRvdzogMCAxOXB4IDM4cHggcmdiYSgwLDAsMCwwLjMwKSwgMCAxNXB4IDEycHggcmdiYSgwLDAsMCwwLjIyKTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyLXRvcDogOHB4IHNvbGlkIHZhcigtLXJlZCk7XG4gIGRpcmVjdGlvbjogbHRyO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG5wcmUge1xuICBmb250LWZhbWlseTogdmFyKC0tbW9ub3NwYWNlKTtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBtYXJnaW4tdG9wOiAwO1xuICBtYXJnaW4tYm90dG9tOiAxZW07XG4gIG92ZXJmbG93LXg6IHNjcm9sbDtcbiAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xufVxuXG5wcmU6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLm1lc3NhZ2Uge1xuICBsaW5lLWhlaWdodDogMS4zO1xuICBmb250LXdlaWdodDogNjAwO1xuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG59XG5cbi5tZXNzYWdlLWJvZHkge1xuICBjb2xvcjogdmFyKC0tcmVkKTtcbn1cblxuLnBsdWdpbiB7XG4gIGNvbG9yOiB2YXIoLS1wdXJwbGUpO1xufVxuXG4uZmlsZSB7XG4gIGNvbG9yOiB2YXIoLS1jeWFuKTtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG59XG5cbi5mcmFtZSB7XG4gIGNvbG9yOiB2YXIoLS15ZWxsb3cpO1xufVxuXG4uc3RhY2sge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGNvbG9yOiB2YXIoLS1kaW0pO1xufVxuXG4udGlwIHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogIzk5OTtcbiAgYm9yZGVyLXRvcDogMXB4IGRvdHRlZCAjOTk5O1xuICBwYWRkaW5nLXRvcDogMTNweDtcbn1cblxuY29kZSB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC1mYW1pbHk6IHZhcigtLW1vbm9zcGFjZSk7XG4gIGNvbG9yOiB2YXIoLS15ZWxsb3cpO1xufVxuXG4uZmlsZS1saW5rIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbjwvc3R5bGU+XG48ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiBwYXJ0PVwiYmFja2Ryb3BcIj5cbiAgPGRpdiBjbGFzcz1cIndpbmRvd1wiIHBhcnQ9XCJ3aW5kb3dcIj5cbiAgICA8cHJlIGNsYXNzPVwibWVzc2FnZVwiIHBhcnQ9XCJtZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJwbHVnaW5cIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJtZXNzYWdlLWJvZHlcIj48L3NwYW4+PC9wcmU+XG4gICAgPHByZSBjbGFzcz1cImZpbGVcIiBwYXJ0PVwiZmlsZVwiPjwvcHJlPlxuICAgIDxwcmUgY2xhc3M9XCJmcmFtZVwiIHBhcnQ9XCJmcmFtZVwiPjwvcHJlPlxuICAgIDxwcmUgY2xhc3M9XCJzdGFja1wiIHBhcnQ9XCJzdGFja1wiPjwvcHJlPlxuICAgIDxkaXYgY2xhc3M9XCJ0aXBcIiBwYXJ0PVwidGlwXCI+XG4gICAgICBDbGljayBvdXRzaWRlIG9yIGZpeCB0aGUgY29kZSB0byBkaXNtaXNzLjxicj5cbiAgICAgIFlvdSBjYW4gYWxzbyBkaXNhYmxlIHRoaXMgb3ZlcmxheSBieSBzZXR0aW5nXG4gICAgICA8Y29kZT5zZXJ2ZXIuaG1yLm92ZXJsYXk8L2NvZGU+IHRvIDxjb2RlPmZhbHNlPC9jb2RlPiBpbiA8Y29kZT52aXRlLmNvbmZpZy5qcy48L2NvZGU+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5gXG5cbmNvbnN0IGZpbGVSRSA9IC8oPzpbYS16QS1aXTpcXFxcfFxcLykuKj86XFxkKzpcXGQrL2dcbmNvbnN0IGNvZGVmcmFtZVJFID0gL14oPzo+P1xccytcXGQrXFxzK1xcfC4qfFxccytcXHxcXHMqXFxeLiopXFxyP1xcbi9nbVxuXG4vLyBBbGxvdyBgRXJyb3JPdmVybGF5YCB0byBleHRlbmQgYEhUTUxFbGVtZW50YCBldmVuIGluIGVudmlyb25tZW50cyB3aGVyZVxuLy8gYEhUTUxFbGVtZW50YCB3YXMgbm90IG9yaWdpbmFsbHkgZGVmaW5lZC5cbmNvbnN0IHsgSFRNTEVsZW1lbnQgPSBjbGFzcyB7fSBhcyB0eXBlb2YgZ2xvYmFsVGhpcy5IVE1MRWxlbWVudCB9ID0gZ2xvYmFsVGhpc1xuZXhwb3J0IGNsYXNzIEVycm9yT3ZlcmxheSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgcm9vdDogU2hhZG93Um9vdFxuXG4gIGNvbnN0cnVjdG9yKGVycjogRXJyb3JQYXlsb2FkWydlcnInXSwgbGlua3MgPSB0cnVlKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMucm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG4gICAgdGhpcy5yb290LmlubmVySFRNTCA9IHRlbXBsYXRlXG5cbiAgICBjb2RlZnJhbWVSRS5sYXN0SW5kZXggPSAwXG4gICAgY29uc3QgaGFzRnJhbWUgPSBlcnIuZnJhbWUgJiYgY29kZWZyYW1lUkUudGVzdChlcnIuZnJhbWUpXG4gICAgY29uc3QgbWVzc2FnZSA9IGhhc0ZyYW1lXG4gICAgICA/IGVyci5tZXNzYWdlLnJlcGxhY2UoY29kZWZyYW1lUkUsICcnKVxuICAgICAgOiBlcnIubWVzc2FnZVxuICAgIGlmIChlcnIucGx1Z2luKSB7XG4gICAgICB0aGlzLnRleHQoJy5wbHVnaW4nLCBgW3BsdWdpbjoke2Vyci5wbHVnaW59XSBgKVxuICAgIH1cbiAgICB0aGlzLnRleHQoJy5tZXNzYWdlLWJvZHknLCBtZXNzYWdlLnRyaW0oKSlcblxuICAgIGNvbnN0IFtmaWxlXSA9IChlcnIubG9jPy5maWxlIHx8IGVyci5pZCB8fCAndW5rbm93biBmaWxlJykuc3BsaXQoYD9gKVxuICAgIGlmIChlcnIubG9jKSB7XG4gICAgICB0aGlzLnRleHQoJy5maWxlJywgYCR7ZmlsZX06JHtlcnIubG9jLmxpbmV9OiR7ZXJyLmxvYy5jb2x1bW59YCwgbGlua3MpXG4gICAgfSBlbHNlIGlmIChlcnIuaWQpIHtcbiAgICAgIHRoaXMudGV4dCgnLmZpbGUnLCBmaWxlKVxuICAgIH1cblxuICAgIGlmIChoYXNGcmFtZSkge1xuICAgICAgdGhpcy50ZXh0KCcuZnJhbWUnLCBlcnIuZnJhbWUhLnRyaW0oKSlcbiAgICB9XG4gICAgdGhpcy50ZXh0KCcuc3RhY2snLCBlcnIuc3RhY2ssIGxpbmtzKVxuXG4gICAgdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKSEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoKVxuICAgIH0pXG4gIH1cblxuICB0ZXh0KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgbGlua0ZpbGVzID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSFcbiAgICBpZiAoIWxpbmtGaWxlcykge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSB0ZXh0XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjdXJJbmRleCA9IDBcbiAgICAgIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbFxuICAgICAgZmlsZVJFLmxhc3RJbmRleCA9IDBcbiAgICAgIHdoaWxlICgobWF0Y2ggPSBmaWxlUkUuZXhlYyh0ZXh0KSkpIHtcbiAgICAgICAgY29uc3QgeyAwOiBmaWxlLCBpbmRleCB9ID0gbWF0Y2hcbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBmcmFnID0gdGV4dC5zbGljZShjdXJJbmRleCwgaW5kZXgpXG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZnJhZykpXG4gICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICAgIGxpbmsudGV4dENvbnRlbnQgPSBmaWxlXG4gICAgICAgICAgbGluay5jbGFzc05hbWUgPSAnZmlsZS1saW5rJ1xuICAgICAgICAgIGxpbmsub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIGZldGNoKGAke2Jhc2V9X19vcGVuLWluLWVkaXRvcj9maWxlPWAgKyBlbmNvZGVVUklDb21wb25lbnQoZmlsZSkpXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGxpbmspXG4gICAgICAgICAgY3VySW5kZXggKz0gZnJhZy5sZW5ndGggKyBmaWxlLmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCh0aGlzKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBvdmVybGF5SWQgPSAndml0ZS1lcnJvci1vdmVybGF5J1xuY29uc3QgeyBjdXN0b21FbGVtZW50cyB9ID0gZ2xvYmFsVGhpcyAvLyBFbnN1cmUgYGN1c3RvbUVsZW1lbnRzYCBpcyBkZWZpbmVkIGJlZm9yZSB0aGUgbmV4dCBsaW5lLlxuaWYgKGN1c3RvbUVsZW1lbnRzICYmICFjdXN0b21FbGVtZW50cy5nZXQob3ZlcmxheUlkKSkge1xuICBjdXN0b21FbGVtZW50cy5kZWZpbmUob3ZlcmxheUlkLCBFcnJvck92ZXJsYXkpXG59XG4iLCJpbXBvcnQgdHlwZSB7IEVycm9yUGF5bG9hZCwgSE1SUGF5bG9hZCwgVXBkYXRlIH0gZnJvbSAndHlwZXMvaG1yUGF5bG9hZCdcbmltcG9ydCB0eXBlIHsgTW9kdWxlTmFtZXNwYWNlLCBWaXRlSG90Q29udGV4dCB9IGZyb20gJ3R5cGVzL2hvdCdcbmltcG9ydCB0eXBlIHsgSW5mZXJDdXN0b21FdmVudFBheWxvYWQgfSBmcm9tICd0eXBlcy9jdXN0b21FdmVudCdcbmltcG9ydCB7IEVycm9yT3ZlcmxheSwgb3ZlcmxheUlkIH0gZnJvbSAnLi9vdmVybGF5J1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tbWlzc2luZy1pbXBvcnRcbmltcG9ydCAnQHZpdGUvZW52J1xuXG4vLyBpbmplY3RlZCBieSB0aGUgaG1yIHBsdWdpbiB3aGVuIHNlcnZlZFxuZGVjbGFyZSBjb25zdCBfX0JBU0VfXzogc3RyaW5nXG5kZWNsYXJlIGNvbnN0IF9fU0VSVkVSX0hPU1RfXzogc3RyaW5nXG5kZWNsYXJlIGNvbnN0IF9fSE1SX1BST1RPQ09MX186IHN0cmluZyB8IG51bGxcbmRlY2xhcmUgY29uc3QgX19ITVJfSE9TVE5BTUVfXzogc3RyaW5nIHwgbnVsbFxuZGVjbGFyZSBjb25zdCBfX0hNUl9QT1JUX186IG51bWJlciB8IG51bGxcbmRlY2xhcmUgY29uc3QgX19ITVJfRElSRUNUX1RBUkdFVF9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19ITVJfQkFTRV9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19ITVJfVElNRU9VVF9fOiBudW1iZXJcbmRlY2xhcmUgY29uc3QgX19ITVJfRU5BQkxFX09WRVJMQVlfXzogYm9vbGVhblxuXG5jb25zb2xlLmRlYnVnKCdbdml0ZV0gY29ubmVjdGluZy4uLicpXG5cbmNvbnN0IGltcG9ydE1ldGFVcmwgPSBuZXcgVVJMKGltcG9ydC5tZXRhLnVybClcblxuLy8gdXNlIHNlcnZlciBjb25maWd1cmF0aW9uLCB0aGVuIGZhbGxiYWNrIHRvIGluZmVyZW5jZVxuY29uc3Qgc2VydmVySG9zdCA9IF9fU0VSVkVSX0hPU1RfX1xuY29uc3Qgc29ja2V0UHJvdG9jb2wgPVxuICBfX0hNUl9QUk9UT0NPTF9fIHx8IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnd3NzJyA6ICd3cycpXG5jb25zdCBobXJQb3J0ID0gX19ITVJfUE9SVF9fXG5jb25zdCBzb2NrZXRIb3N0ID0gYCR7X19ITVJfSE9TVE5BTUVfXyB8fCBpbXBvcnRNZXRhVXJsLmhvc3RuYW1lfToke1xuICBobXJQb3J0IHx8IGltcG9ydE1ldGFVcmwucG9ydFxufSR7X19ITVJfQkFTRV9ffWBcbmNvbnN0IGRpcmVjdFNvY2tldEhvc3QgPSBfX0hNUl9ESVJFQ1RfVEFSR0VUX19cbmNvbnN0IGJhc2UgPSBfX0JBU0VfXyB8fCAnLydcbmNvbnN0IG1lc3NhZ2VCdWZmZXI6IHN0cmluZ1tdID0gW11cblxubGV0IHNvY2tldDogV2ViU29ja2V0XG50cnkge1xuICBsZXQgZmFsbGJhY2s6ICgoKSA9PiB2b2lkKSB8IHVuZGVmaW5lZFxuICAvLyBvbmx5IHVzZSBmYWxsYmFjayB3aGVuIHBvcnQgaXMgaW5mZXJyZWQgdG8gcHJldmVudCBjb25mdXNpb25cbiAgaWYgKCFobXJQb3J0KSB7XG4gICAgZmFsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAvLyBmYWxsYmFjayB0byBjb25uZWN0aW5nIGRpcmVjdGx5IHRvIHRoZSBobXIgc2VydmVyXG4gICAgICAvLyBmb3Igc2VydmVycyB3aGljaCBkb2VzIG5vdCBzdXBwb3J0IHByb3h5aW5nIHdlYnNvY2tldFxuICAgICAgc29ja2V0ID0gc2V0dXBXZWJTb2NrZXQoc29ja2V0UHJvdG9jb2wsIGRpcmVjdFNvY2tldEhvc3QsICgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFNjcmlwdEhvc3RVUkwgPSBuZXcgVVJMKGltcG9ydC5tZXRhLnVybClcbiAgICAgICAgY29uc3QgY3VycmVudFNjcmlwdEhvc3QgPVxuICAgICAgICAgIGN1cnJlbnRTY3JpcHRIb3N0VVJMLmhvc3QgK1xuICAgICAgICAgIGN1cnJlbnRTY3JpcHRIb3N0VVJMLnBhdGhuYW1lLnJlcGxhY2UoL0B2aXRlXFwvY2xpZW50JC8sICcnKVxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdbdml0ZV0gZmFpbGVkIHRvIGNvbm5lY3QgdG8gd2Vic29ja2V0LlxcbicgK1xuICAgICAgICAgICAgJ3lvdXIgY3VycmVudCBzZXR1cDpcXG4nICtcbiAgICAgICAgICAgIGAgIChicm93c2VyKSAke2N1cnJlbnRTY3JpcHRIb3N0fSA8LS1bSFRUUF0tLT4gJHtzZXJ2ZXJIb3N0fSAoc2VydmVyKVxcbmAgK1xuICAgICAgICAgICAgYCAgKGJyb3dzZXIpICR7c29ja2V0SG9zdH0gPC0tW1dlYlNvY2tldCAoZmFpbGluZyldLS0+ICR7ZGlyZWN0U29ja2V0SG9zdH0gKHNlcnZlcilcXG5gICtcbiAgICAgICAgICAgICdDaGVjayBvdXQgeW91ciBWaXRlIC8gbmV0d29yayBjb25maWd1cmF0aW9uIGFuZCBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL3NlcnZlci1vcHRpb25zLmh0bWwjc2VydmVyLWhtciAuJyxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnb3BlbicsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmluZm8oXG4gICAgICAgICAgICAnW3ZpdGVdIERpcmVjdCB3ZWJzb2NrZXQgY29ubmVjdGlvbiBmYWxsYmFjay4gQ2hlY2sgb3V0IGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvc2VydmVyLW9wdGlvbnMuaHRtbCNzZXJ2ZXItaG1yIHRvIHJlbW92ZSB0aGUgcHJldmlvdXMgY29ubmVjdGlvbiBlcnJvci4nLFxuICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH0sXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgc29ja2V0ID0gc2V0dXBXZWJTb2NrZXQoc29ja2V0UHJvdG9jb2wsIHNvY2tldEhvc3QsIGZhbGxiYWNrKVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS5lcnJvcihgW3ZpdGVdIGZhaWxlZCB0byBjb25uZWN0IHRvIHdlYnNvY2tldCAoJHtlcnJvcn0pLiBgKVxufVxuXG5mdW5jdGlvbiBzZXR1cFdlYlNvY2tldChcbiAgcHJvdG9jb2w6IHN0cmluZyxcbiAgaG9zdEFuZFBhdGg6IHN0cmluZyxcbiAgb25DbG9zZVdpdGhvdXRPcGVuPzogKCkgPT4gdm9pZCxcbikge1xuICBjb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGAke3Byb3RvY29sfTovLyR7aG9zdEFuZFBhdGh9YCwgJ3ZpdGUtaG1yJylcbiAgbGV0IGlzT3BlbmVkID0gZmFsc2VcblxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAnb3BlbicsXG4gICAgKCkgPT4ge1xuICAgICAgaXNPcGVuZWQgPSB0cnVlXG4gICAgfSxcbiAgICB7IG9uY2U6IHRydWUgfSxcbiAgKVxuXG4gIC8vIExpc3RlbiBmb3IgbWVzc2FnZXNcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBhc3luYyAoeyBkYXRhIH0pID0+IHtcbiAgICBoYW5kbGVNZXNzYWdlKEpTT04ucGFyc2UoZGF0YSkpXG4gIH0pXG5cbiAgLy8gcGluZyBzZXJ2ZXJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgYXN5bmMgKHsgd2FzQ2xlYW4gfSkgPT4ge1xuICAgIGlmICh3YXNDbGVhbikgcmV0dXJuXG5cbiAgICBpZiAoIWlzT3BlbmVkICYmIG9uQ2xvc2VXaXRob3V0T3Blbikge1xuICAgICAgb25DbG9zZVdpdGhvdXRPcGVuKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBbdml0ZV0gc2VydmVyIGNvbm5lY3Rpb24gbG9zdC4gcG9sbGluZyBmb3IgcmVzdGFydC4uLmApXG4gICAgYXdhaXQgd2FpdEZvclN1Y2Nlc3NmdWxQaW5nKHByb3RvY29sLCBob3N0QW5kUGF0aClcbiAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICB9KVxuXG4gIHJldHVybiBzb2NrZXRcbn1cblxuZnVuY3Rpb24gd2FybkZhaWxlZEZldGNoKGVycjogRXJyb3IsIHBhdGg6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gIGlmICghZXJyLm1lc3NhZ2UubWF0Y2goJ2ZldGNoJykpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfVxuICBjb25zb2xlLmVycm9yKFxuICAgIGBbaG1yXSBGYWlsZWQgdG8gcmVsb2FkICR7cGF0aH0uIGAgK1xuICAgICAgYFRoaXMgY291bGQgYmUgZHVlIHRvIHN5bnRheCBlcnJvcnMgb3IgaW1wb3J0aW5nIG5vbi1leGlzdGVudCBgICtcbiAgICAgIGBtb2R1bGVzLiAoc2VlIGVycm9ycyBhYm92ZSlgLFxuICApXG59XG5cbmZ1bmN0aW9uIGNsZWFuVXJsKHBhdGhuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKHBhdGhuYW1lLCBsb2NhdGlvbi50b1N0cmluZygpKVxuICB1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZSgnZGlyZWN0JylcbiAgcmV0dXJuIHVybC5wYXRobmFtZSArIHVybC5zZWFyY2hcbn1cblxubGV0IGlzRmlyc3RVcGRhdGUgPSB0cnVlXG5jb25zdCBvdXRkYXRlZExpbmtUYWdzID0gbmV3IFdlYWtTZXQ8SFRNTExpbmtFbGVtZW50PigpXG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UocGF5bG9hZDogSE1SUGF5bG9hZCkge1xuICBzd2l0Y2ggKHBheWxvYWQudHlwZSkge1xuICAgIGNhc2UgJ2Nvbm5lY3RlZCc6XG4gICAgICBjb25zb2xlLmRlYnVnKGBbdml0ZV0gY29ubmVjdGVkLmApXG4gICAgICBzZW5kTWVzc2FnZUJ1ZmZlcigpXG4gICAgICAvLyBwcm94eShuZ2lueCwgZG9ja2VyKSBobXIgd3MgbWF5YmUgY2F1c2VkIHRpbWVvdXQsXG4gICAgICAvLyBzbyBzZW5kIHBpbmcgcGFja2FnZSBsZXQgd3Mga2VlcCBhbGl2ZS5cbiAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKHNvY2tldC5yZWFkeVN0YXRlID09PSBzb2NrZXQuT1BFTikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCd7XCJ0eXBlXCI6XCJwaW5nXCJ9JylcbiAgICAgICAgfVxuICAgICAgfSwgX19ITVJfVElNRU9VVF9fKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1cGRhdGUnOlxuICAgICAgbm90aWZ5TGlzdGVuZXJzKCd2aXRlOmJlZm9yZVVwZGF0ZScsIHBheWxvYWQpXG4gICAgICAvLyBpZiB0aGlzIGlzIHRoZSBmaXJzdCB1cGRhdGUgYW5kIHRoZXJlJ3MgYWxyZWFkeSBhbiBlcnJvciBvdmVybGF5LCBpdFxuICAgICAgLy8gbWVhbnMgdGhlIHBhZ2Ugb3BlbmVkIHdpdGggZXhpc3Rpbmcgc2VydmVyIGNvbXBpbGUgZXJyb3IgYW5kIHRoZSB3aG9sZVxuICAgICAgLy8gbW9kdWxlIHNjcmlwdCBmYWlsZWQgdG8gbG9hZCAoc2luY2Ugb25lIG9mIHRoZSBuZXN0ZWQgaW1wb3J0cyBpcyA1MDApLlxuICAgICAgLy8gaW4gdGhpcyBjYXNlIGEgbm9ybWFsIHVwZGF0ZSB3b24ndCB3b3JrIGFuZCBhIGZ1bGwgcmVsb2FkIGlzIG5lZWRlZC5cbiAgICAgIGlmIChpc0ZpcnN0VXBkYXRlICYmIGhhc0Vycm9yT3ZlcmxheSgpKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsZWFyRXJyb3JPdmVybGF5KClcbiAgICAgICAgaXNGaXJzdFVwZGF0ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgcGF5bG9hZC51cGRhdGVzLm1hcChhc3luYyAodXBkYXRlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS50eXBlID09PSAnanMtdXBkYXRlJykge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlVXBkYXRlKGZldGNoVXBkYXRlKHVwZGF0ZSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gY3NzLXVwZGF0ZVxuICAgICAgICAgIC8vIHRoaXMgaXMgb25seSBzZW50IHdoZW4gYSBjc3MgZmlsZSByZWZlcmVuY2VkIHdpdGggPGxpbms+IGlzIHVwZGF0ZWRcbiAgICAgICAgICBjb25zdCB7IHBhdGgsIHRpbWVzdGFtcCB9ID0gdXBkYXRlXG4gICAgICAgICAgY29uc3Qgc2VhcmNoVXJsID0gY2xlYW5VcmwocGF0aClcbiAgICAgICAgICAvLyBjYW4ndCB1c2UgcXVlcnlTZWxlY3RvciB3aXRoIGBbaHJlZio9XWAgaGVyZSBzaW5jZSB0aGUgbGluayBtYXkgYmVcbiAgICAgICAgICAvLyB1c2luZyByZWxhdGl2ZSBwYXRocyBzbyB3ZSBuZWVkIHRvIHVzZSBsaW5rLmhyZWYgdG8gZ3JhYiB0aGUgZnVsbFxuICAgICAgICAgIC8vIFVSTCBmb3IgdGhlIGluY2x1ZGUgY2hlY2suXG4gICAgICAgICAgY29uc3QgZWwgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MTGlua0VsZW1lbnQ+KCdsaW5rJyksXG4gICAgICAgICAgKS5maW5kKFxuICAgICAgICAgICAgKGUpID0+XG4gICAgICAgICAgICAgICFvdXRkYXRlZExpbmtUYWdzLmhhcyhlKSAmJiBjbGVhblVybChlLmhyZWYpLmluY2x1ZGVzKHNlYXJjaFVybCksXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbmV3UGF0aCA9IGAke2Jhc2V9JHtzZWFyY2hVcmwuc2xpY2UoMSl9JHtcbiAgICAgICAgICAgIHNlYXJjaFVybC5pbmNsdWRlcygnPycpID8gJyYnIDogJz8nXG4gICAgICAgICAgfXQ9JHt0aW1lc3RhbXB9YFxuXG4gICAgICAgICAgLy8gcmF0aGVyIHRoYW4gc3dhcHBpbmcgdGhlIGhyZWYgb24gdGhlIGV4aXN0aW5nIHRhZywgd2Ugd2lsbFxuICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBsaW5rIHRhZy4gT25jZSB0aGUgbmV3IHN0eWxlc2hlZXQgaGFzIGxvYWRlZCB3ZVxuICAgICAgICAgIC8vIHdpbGwgcmVtb3ZlIHRoZSBleGlzdGluZyBsaW5rIHRhZy4gVGhpcyByZW1vdmVzIGEgRmxhc2ggT2ZcbiAgICAgICAgICAvLyBVbnN0eWxlZCBDb250ZW50IHRoYXQgY2FuIG9jY3VyIHdoZW4gc3dhcHBpbmcgb3V0IHRoZSB0YWcgaHJlZlxuICAgICAgICAgIC8vIGRpcmVjdGx5LCBhcyB0aGUgbmV3IHN0eWxlc2hlZXQgaGFzIG5vdCB5ZXQgYmVlbiBsb2FkZWQuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdMaW5rVGFnID0gZWwuY2xvbmVOb2RlKCkgYXMgSFRNTExpbmtFbGVtZW50XG4gICAgICAgICAgICBuZXdMaW5rVGFnLmhyZWYgPSBuZXcgVVJMKG5ld1BhdGgsIGVsLmhyZWYpLmhyZWZcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZU9sZEVsID0gKCkgPT4ge1xuICAgICAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBbdml0ZV0gY3NzIGhvdCB1cGRhdGVkOiAke3NlYXJjaFVybH1gKVxuICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0xpbmtUYWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlbW92ZU9sZEVsKVxuICAgICAgICAgICAgbmV3TGlua1RhZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlbW92ZU9sZEVsKVxuICAgICAgICAgICAgb3V0ZGF0ZWRMaW5rVGFncy5hZGQoZWwpXG4gICAgICAgICAgICBlbC5hZnRlcihuZXdMaW5rVGFnKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgICAgbm90aWZ5TGlzdGVuZXJzKCd2aXRlOmFmdGVyVXBkYXRlJywgcGF5bG9hZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnY3VzdG9tJzoge1xuICAgICAgbm90aWZ5TGlzdGVuZXJzKHBheWxvYWQuZXZlbnQsIHBheWxvYWQuZGF0YSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNhc2UgJ2Z1bGwtcmVsb2FkJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVGdWxsUmVsb2FkJywgcGF5bG9hZClcbiAgICAgIGlmIChwYXlsb2FkLnBhdGggJiYgcGF5bG9hZC5wYXRoLmVuZHNXaXRoKCcuaHRtbCcpKSB7XG4gICAgICAgIC8vIGlmIGh0bWwgZmlsZSBpcyBlZGl0ZWQsIG9ubHkgcmVsb2FkIHRoZSBwYWdlIGlmIHRoZSBicm93c2VyIGlzXG4gICAgICAgIC8vIGN1cnJlbnRseSBvbiB0aGF0IHBhZ2UuXG4gICAgICAgIGNvbnN0IHBhZ2VQYXRoID0gZGVjb2RlVVJJKGxvY2F0aW9uLnBhdGhuYW1lKVxuICAgICAgICBjb25zdCBwYXlsb2FkUGF0aCA9IGJhc2UgKyBwYXlsb2FkLnBhdGguc2xpY2UoMSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBhZ2VQYXRoID09PSBwYXlsb2FkUGF0aCB8fFxuICAgICAgICAgIHBheWxvYWQucGF0aCA9PT0gJy9pbmRleC5odG1sJyB8fFxuICAgICAgICAgIChwYWdlUGF0aC5lbmRzV2l0aCgnLycpICYmIHBhZ2VQYXRoICsgJ2luZGV4Lmh0bWwnID09PSBwYXlsb2FkUGF0aClcbiAgICAgICAgKSB7XG4gICAgICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3BydW5lJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVQcnVuZScsIHBheWxvYWQpXG4gICAgICAvLyBBZnRlciBhbiBITVIgdXBkYXRlLCBzb21lIG1vZHVsZXMgYXJlIG5vIGxvbmdlciBpbXBvcnRlZCBvbiB0aGUgcGFnZVxuICAgICAgLy8gYnV0IHRoZXkgbWF5IGhhdmUgbGVmdCBiZWhpbmQgc2lkZSBlZmZlY3RzIHRoYXQgbmVlZCB0byBiZSBjbGVhbmVkIHVwXG4gICAgICAvLyAoLmUuZyBzdHlsZSBpbmplY3Rpb25zKVxuICAgICAgLy8gVE9ETyBUcmlnZ2VyIHRoZWlyIGRpc3Bvc2UgY2FsbGJhY2tzLlxuICAgICAgcGF5bG9hZC5wYXRocy5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZuID0gcHJ1bmVNYXAuZ2V0KHBhdGgpXG4gICAgICAgIGlmIChmbikge1xuICAgICAgICAgIGZuKGRhdGFNYXAuZ2V0KHBhdGgpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlcnJvcic6IHtcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTplcnJvcicsIHBheWxvYWQpXG4gICAgICBjb25zdCBlcnIgPSBwYXlsb2FkLmVyclxuICAgICAgaWYgKGVuYWJsZU92ZXJsYXkpIHtcbiAgICAgICAgY3JlYXRlRXJyb3JPdmVybGF5KGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYFt2aXRlXSBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcXG4ke2Vyci5tZXNzYWdlfVxcbiR7ZXJyLnN0YWNrfWAsXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IGNoZWNrOiBuZXZlciA9IHBheWxvYWRcbiAgICAgIHJldHVybiBjaGVja1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBub3RpZnlMaXN0ZW5lcnM8VCBleHRlbmRzIHN0cmluZz4oXG4gIGV2ZW50OiBULFxuICBkYXRhOiBJbmZlckN1c3RvbUV2ZW50UGF5bG9hZDxUPixcbik6IHZvaWRcbmZ1bmN0aW9uIG5vdGlmeUxpc3RlbmVycyhldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpOiB2b2lkIHtcbiAgY29uc3QgY2JzID0gY3VzdG9tTGlzdGVuZXJzTWFwLmdldChldmVudClcbiAgaWYgKGNicykge1xuICAgIGNicy5mb3JFYWNoKChjYikgPT4gY2IoZGF0YSkpXG4gIH1cbn1cblxuY29uc3QgZW5hYmxlT3ZlcmxheSA9IF9fSE1SX0VOQUJMRV9PVkVSTEFZX19cblxuZnVuY3Rpb24gY3JlYXRlRXJyb3JPdmVybGF5KGVycjogRXJyb3JQYXlsb2FkWydlcnInXSkge1xuICBpZiAoIWVuYWJsZU92ZXJsYXkpIHJldHVyblxuICBjbGVhckVycm9yT3ZlcmxheSgpXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobmV3IEVycm9yT3ZlcmxheShlcnIpKVxufVxuXG5mdW5jdGlvbiBjbGVhckVycm9yT3ZlcmxheSgpIHtcbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbChvdmVybGF5SWQpXG4gICAgLmZvckVhY2goKG4pID0+IChuIGFzIEVycm9yT3ZlcmxheSkuY2xvc2UoKSlcbn1cblxuZnVuY3Rpb24gaGFzRXJyb3JPdmVybGF5KCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvdmVybGF5SWQpLmxlbmd0aFxufVxuXG5sZXQgcGVuZGluZyA9IGZhbHNlXG5sZXQgcXVldWVkOiBQcm9taXNlPCgoKSA9PiB2b2lkKSB8IHVuZGVmaW5lZD5bXSA9IFtdXG5cbi8qKlxuICogYnVmZmVyIG11bHRpcGxlIGhvdCB1cGRhdGVzIHRyaWdnZXJlZCBieSB0aGUgc2FtZSBzcmMgY2hhbmdlXG4gKiBzbyB0aGF0IHRoZXkgYXJlIGludm9rZWQgaW4gdGhlIHNhbWUgb3JkZXIgdGhleSB3ZXJlIHNlbnQuXG4gKiAob3RoZXJ3aXNlIHRoZSBvcmRlciBtYXkgYmUgaW5jb25zaXN0ZW50IGJlY2F1c2Ugb2YgdGhlIGh0dHAgcmVxdWVzdCByb3VuZCB0cmlwKVxuICovXG5hc3luYyBmdW5jdGlvbiBxdWV1ZVVwZGF0ZShwOiBQcm9taXNlPCgoKSA9PiB2b2lkKSB8IHVuZGVmaW5lZD4pIHtcbiAgcXVldWVkLnB1c2gocClcbiAgaWYgKCFwZW5kaW5nKSB7XG4gICAgcGVuZGluZyA9IHRydWVcbiAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKVxuICAgIHBlbmRpbmcgPSBmYWxzZVxuICAgIGNvbnN0IGxvYWRpbmcgPSBbLi4ucXVldWVkXVxuICAgIHF1ZXVlZCA9IFtdXG4gICAgOyhhd2FpdCBQcm9taXNlLmFsbChsb2FkaW5nKSkuZm9yRWFjaCgoZm4pID0+IGZuICYmIGZuKCkpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd2FpdEZvclN1Y2Nlc3NmdWxQaW5nKFxuICBzb2NrZXRQcm90b2NvbDogc3RyaW5nLFxuICBob3N0QW5kUGF0aDogc3RyaW5nLFxuICBtcyA9IDEwMDAsXG4pIHtcbiAgY29uc3QgcGluZ0hvc3RQcm90b2NvbCA9IHNvY2tldFByb3RvY29sID09PSAnd3NzJyA/ICdodHRwcycgOiAnaHR0cCdcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEEgZmV0Y2ggb24gYSB3ZWJzb2NrZXQgVVJMIHdpbGwgcmV0dXJuIGEgc3VjY2Vzc2Z1bCBwcm9taXNlIHdpdGggc3RhdHVzIDQwMCxcbiAgICAgIC8vIGJ1dCB3aWxsIHJlamVjdCBhIG5ldHdvcmtpbmcgZXJyb3IuXG4gICAgICAvLyBXaGVuIHJ1bm5pbmcgb24gbWlkZGxld2FyZSBtb2RlLCBpdCByZXR1cm5zIHN0YXR1cyA0MjYsIGFuZCBhbiBjb3JzIGVycm9yIGhhcHBlbnMgaWYgbW9kZSBpcyBub3Qgbm8tY29yc1xuICAgICAgYXdhaXQgZmV0Y2goYCR7cGluZ0hvc3RQcm90b2NvbH06Ly8ke2hvc3RBbmRQYXRofWAsIHtcbiAgICAgICAgbW9kZTogJ25vLWNvcnMnLFxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gd2FpdCBtcyBiZWZvcmUgYXR0ZW1wdGluZyB0byBwaW5nIGFnYWluXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpXG4gICAgfVxuICB9XG59XG5cbi8vIGh0dHBzOi8vd2ljZy5naXRodWIuaW8vY29uc3RydWN0LXN0eWxlc2hlZXRzXG5jb25zdCBzdXBwb3J0c0NvbnN0cnVjdGVkU2hlZXQgPSAoKCkgPT4ge1xuICAvLyBUT0RPOiByZS1lbmFibGUgdGhpcyB0cnkgYmxvY2sgb25jZSBDaHJvbWUgZml4ZXMgdGhlIHBlcmZvcm1hbmNlIG9mXG4gIC8vIHJ1bGUgaW5zZXJ0aW9uIGluIHJlYWxseSBiaWcgc3R5bGVzaGVldHNcbiAgLy8gdHJ5IHtcbiAgLy8gICBuZXcgQ1NTU3R5bGVTaGVldCgpXG4gIC8vICAgcmV0dXJuIHRydWVcbiAgLy8gfSBjYXRjaCAoZSkge31cbiAgcmV0dXJuIGZhbHNlXG59KSgpXG5cbmNvbnN0IHNoZWV0c01hcCA9IG5ldyBNYXA8XG4gIHN0cmluZyxcbiAgSFRNTFN0eWxlRWxlbWVudCB8IENTU1N0eWxlU2hlZXQgfCB1bmRlZmluZWRcbj4oKVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU3R5bGUoaWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdm9pZCB7XG4gIGxldCBzdHlsZSA9IHNoZWV0c01hcC5nZXQoaWQpXG4gIGlmIChzdXBwb3J0c0NvbnN0cnVjdGVkU2hlZXQgJiYgIWNvbnRlbnQuaW5jbHVkZXMoJ0BpbXBvcnQnKSkge1xuICAgIGlmIChzdHlsZSAmJiAhKHN0eWxlIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCkpIHtcbiAgICAgIHJlbW92ZVN0eWxlKGlkKVxuICAgICAgc3R5bGUgPSB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBpZiAoIXN0eWxlKSB7XG4gICAgICBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KClcbiAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNvbnRlbnQpXG4gICAgICBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBzdHlsZV1cbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY29udGVudClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN0eWxlICYmICEoc3R5bGUgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KSkge1xuICAgICAgcmVtb3ZlU3R5bGUoaWQpXG4gICAgICBzdHlsZSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGlmICghc3R5bGUpIHtcbiAgICAgIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJylcbiAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS12aXRlLWRldi1pZCcsIGlkKVxuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBjb250ZW50XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGNvbnRlbnRcbiAgICB9XG4gIH1cbiAgc2hlZXRzTWFwLnNldChpZCwgc3R5bGUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdHlsZShpZDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHN0eWxlID0gc2hlZXRzTWFwLmdldChpZClcbiAgaWYgKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCkge1xuICAgICAgZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzID0gZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLmZpbHRlcihcbiAgICAgICAgKHM6IENTU1N0eWxlU2hlZXQpID0+IHMgIT09IHN0eWxlLFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHN0eWxlKVxuICAgIH1cbiAgICBzaGVldHNNYXAuZGVsZXRlKGlkKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVXBkYXRlKHtcbiAgcGF0aCxcbiAgYWNjZXB0ZWRQYXRoLFxuICB0aW1lc3RhbXAsXG4gIGV4cGxpY2l0SW1wb3J0UmVxdWlyZWQsXG59OiBVcGRhdGUpIHtcbiAgY29uc3QgbW9kID0gaG90TW9kdWxlc01hcC5nZXQocGF0aClcbiAgaWYgKCFtb2QpIHtcbiAgICAvLyBJbiBhIGNvZGUtc3BsaXR0aW5nIHByb2plY3QsXG4gICAgLy8gaXQgaXMgY29tbW9uIHRoYXQgdGhlIGhvdC11cGRhdGluZyBtb2R1bGUgaXMgbm90IGxvYWRlZCB5ZXQuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy83MjFcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCBmZXRjaGVkTW9kdWxlOiBNb2R1bGVOYW1lc3BhY2UgfCB1bmRlZmluZWRcbiAgY29uc3QgaXNTZWxmVXBkYXRlID0gcGF0aCA9PT0gYWNjZXB0ZWRQYXRoXG5cbiAgLy8gZGV0ZXJtaW5lIHRoZSBxdWFsaWZpZWQgY2FsbGJhY2tzIGJlZm9yZSB3ZSByZS1pbXBvcnQgdGhlIG1vZHVsZXNcbiAgY29uc3QgcXVhbGlmaWVkQ2FsbGJhY2tzID0gbW9kLmNhbGxiYWNrcy5maWx0ZXIoKHsgZGVwcyB9KSA9PlxuICAgIGRlcHMuaW5jbHVkZXMoYWNjZXB0ZWRQYXRoKSxcbiAgKVxuXG4gIGlmIChpc1NlbGZVcGRhdGUgfHwgcXVhbGlmaWVkQ2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBkaXNwb3NlciA9IGRpc3Bvc2VNYXAuZ2V0KGFjY2VwdGVkUGF0aClcbiAgICBpZiAoZGlzcG9zZXIpIGF3YWl0IGRpc3Bvc2VyKGRhdGFNYXAuZ2V0KGFjY2VwdGVkUGF0aCkpXG4gICAgY29uc3QgW2FjY2VwdGVkUGF0aFdpdGhvdXRRdWVyeSwgcXVlcnldID0gYWNjZXB0ZWRQYXRoLnNwbGl0KGA/YClcbiAgICB0cnkge1xuICAgICAgZmV0Y2hlZE1vZHVsZSA9IGF3YWl0IGltcG9ydChcbiAgICAgICAgLyogQHZpdGUtaWdub3JlICovXG4gICAgICAgIGJhc2UgK1xuICAgICAgICAgIGFjY2VwdGVkUGF0aFdpdGhvdXRRdWVyeS5zbGljZSgxKSArXG4gICAgICAgICAgYD8ke2V4cGxpY2l0SW1wb3J0UmVxdWlyZWQgPyAnaW1wb3J0JicgOiAnJ310PSR7dGltZXN0YW1wfSR7XG4gICAgICAgICAgICBxdWVyeSA/IGAmJHtxdWVyeX1gIDogJydcbiAgICAgICAgICB9YFxuICAgICAgKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHdhcm5GYWlsZWRGZXRjaChlLCBhY2NlcHRlZFBhdGgpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHsgZGVwcywgZm4gfSBvZiBxdWFsaWZpZWRDYWxsYmFja3MpIHtcbiAgICAgIGZuKGRlcHMubWFwKChkZXApID0+IChkZXAgPT09IGFjY2VwdGVkUGF0aCA/IGZldGNoZWRNb2R1bGUgOiB1bmRlZmluZWQpKSlcbiAgICB9XG4gICAgY29uc3QgbG9nZ2VkUGF0aCA9IGlzU2VsZlVwZGF0ZSA/IHBhdGggOiBgJHthY2NlcHRlZFBhdGh9IHZpYSAke3BhdGh9YFxuICAgIGNvbnNvbGUuZGVidWcoYFt2aXRlXSBob3QgdXBkYXRlZDogJHtsb2dnZWRQYXRofWApXG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZE1lc3NhZ2VCdWZmZXIoKSB7XG4gIGlmIChzb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIG1lc3NhZ2VCdWZmZXIuZm9yRWFjaCgobXNnKSA9PiBzb2NrZXQuc2VuZChtc2cpKVxuICAgIG1lc3NhZ2VCdWZmZXIubGVuZ3RoID0gMFxuICB9XG59XG5cbmludGVyZmFjZSBIb3RNb2R1bGUge1xuICBpZDogc3RyaW5nXG4gIGNhbGxiYWNrczogSG90Q2FsbGJhY2tbXVxufVxuXG5pbnRlcmZhY2UgSG90Q2FsbGJhY2sge1xuICAvLyB0aGUgZGVwZW5kZW5jaWVzIG11c3QgYmUgZmV0Y2hhYmxlIHBhdGhzXG4gIGRlcHM6IHN0cmluZ1tdXG4gIGZuOiAobW9kdWxlczogQXJyYXk8TW9kdWxlTmFtZXNwYWNlIHwgdW5kZWZpbmVkPikgPT4gdm9pZFxufVxuXG50eXBlIEN1c3RvbUxpc3RlbmVyc01hcCA9IE1hcDxzdHJpbmcsICgoZGF0YTogYW55KSA9PiB2b2lkKVtdPlxuXG5jb25zdCBob3RNb2R1bGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIEhvdE1vZHVsZT4oKVxuY29uc3QgZGlzcG9zZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCAoZGF0YTogYW55KSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPj4oKVxuY29uc3QgcHJ1bmVNYXAgPSBuZXcgTWFwPHN0cmluZywgKGRhdGE6IGFueSkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4+KClcbmNvbnN0IGRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZywgYW55PigpXG5jb25zdCBjdXN0b21MaXN0ZW5lcnNNYXA6IEN1c3RvbUxpc3RlbmVyc01hcCA9IG5ldyBNYXAoKVxuY29uc3QgY3R4VG9MaXN0ZW5lcnNNYXAgPSBuZXcgTWFwPHN0cmluZywgQ3VzdG9tTGlzdGVuZXJzTWFwPigpXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVIb3RDb250ZXh0KG93bmVyUGF0aDogc3RyaW5nKTogVml0ZUhvdENvbnRleHQge1xuICBpZiAoIWRhdGFNYXAuaGFzKG93bmVyUGF0aCkpIHtcbiAgICBkYXRhTWFwLnNldChvd25lclBhdGgsIHt9KVxuICB9XG5cbiAgLy8gd2hlbiBhIGZpbGUgaXMgaG90IHVwZGF0ZWQsIGEgbmV3IGNvbnRleHQgaXMgY3JlYXRlZFxuICAvLyBjbGVhciBpdHMgc3RhbGUgY2FsbGJhY2tzXG4gIGNvbnN0IG1vZCA9IGhvdE1vZHVsZXNNYXAuZ2V0KG93bmVyUGF0aClcbiAgaWYgKG1vZCkge1xuICAgIG1vZC5jYWxsYmFja3MgPSBbXVxuICB9XG5cbiAgLy8gY2xlYXIgc3RhbGUgY3VzdG9tIGV2ZW50IGxpc3RlbmVyc1xuICBjb25zdCBzdGFsZUxpc3RlbmVycyA9IGN0eFRvTGlzdGVuZXJzTWFwLmdldChvd25lclBhdGgpXG4gIGlmIChzdGFsZUxpc3RlbmVycykge1xuICAgIGZvciAoY29uc3QgW2V2ZW50LCBzdGFsZUZuc10gb2Ygc3RhbGVMaXN0ZW5lcnMpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IGN1c3RvbUxpc3RlbmVyc01hcC5nZXQoZXZlbnQpXG4gICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIGN1c3RvbUxpc3RlbmVyc01hcC5zZXQoXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgbGlzdGVuZXJzLmZpbHRlcigobCkgPT4gIXN0YWxlRm5zLmluY2x1ZGVzKGwpKSxcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5ld0xpc3RlbmVyczogQ3VzdG9tTGlzdGVuZXJzTWFwID0gbmV3IE1hcCgpXG4gIGN0eFRvTGlzdGVuZXJzTWFwLnNldChvd25lclBhdGgsIG5ld0xpc3RlbmVycylcblxuICBmdW5jdGlvbiBhY2NlcHREZXBzKGRlcHM6IHN0cmluZ1tdLCBjYWxsYmFjazogSG90Q2FsbGJhY2tbJ2ZuJ10gPSAoKSA9PiB7fSkge1xuICAgIGNvbnN0IG1vZDogSG90TW9kdWxlID0gaG90TW9kdWxlc01hcC5nZXQob3duZXJQYXRoKSB8fCB7XG4gICAgICBpZDogb3duZXJQYXRoLFxuICAgICAgY2FsbGJhY2tzOiBbXSxcbiAgICB9XG4gICAgbW9kLmNhbGxiYWNrcy5wdXNoKHtcbiAgICAgIGRlcHMsXG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgfSlcbiAgICBob3RNb2R1bGVzTWFwLnNldChvd25lclBhdGgsIG1vZClcbiAgfVxuXG4gIGNvbnN0IGhvdDogVml0ZUhvdENvbnRleHQgPSB7XG4gICAgZ2V0IGRhdGEoKSB7XG4gICAgICByZXR1cm4gZGF0YU1hcC5nZXQob3duZXJQYXRoKVxuICAgIH0sXG5cbiAgICBhY2NlcHQoZGVwcz86IGFueSwgY2FsbGJhY2s/OiBhbnkpIHtcbiAgICAgIGlmICh0eXBlb2YgZGVwcyA9PT0gJ2Z1bmN0aW9uJyB8fCAhZGVwcykge1xuICAgICAgICAvLyBzZWxmLWFjY2VwdDogaG90LmFjY2VwdCgoKSA9PiB7fSlcbiAgICAgICAgYWNjZXB0RGVwcyhbb3duZXJQYXRoXSwgKFttb2RdKSA9PiBkZXBzPy4obW9kKSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlcHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0IGRlcHNcbiAgICAgICAgYWNjZXB0RGVwcyhbZGVwc10sIChbbW9kXSkgPT4gY2FsbGJhY2s/Lihtb2QpKVxuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRlcHMpKSB7XG4gICAgICAgIGFjY2VwdERlcHMoZGVwcywgY2FsbGJhY2spXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgaG90LmFjY2VwdCgpIHVzYWdlLmApXG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIGV4cG9ydCBuYW1lcyAoZmlyc3QgYXJnKSBhcmUgaXJyZWxldmFudCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZXkncmVcbiAgICAvLyBleHRyYWN0ZWQgaW4gdGhlIHNlcnZlciBmb3IgcHJvcGFnYXRpb25cbiAgICBhY2NlcHRFeHBvcnRzKF8sIGNhbGxiYWNrKSB7XG4gICAgICBhY2NlcHREZXBzKFtvd25lclBhdGhdLCAoW21vZF0pID0+IGNhbGxiYWNrPy4obW9kKSlcbiAgICB9LFxuXG4gICAgZGlzcG9zZShjYikge1xuICAgICAgZGlzcG9zZU1hcC5zZXQob3duZXJQYXRoLCBjYilcbiAgICB9LFxuXG4gICAgcHJ1bmUoY2IpIHtcbiAgICAgIHBydW5lTWFwLnNldChvd25lclBhdGgsIGNiKVxuICAgIH0sXG5cbiAgICAvLyBLZXB0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5ICgjMTEwMzYpXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bnR5cGVkXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICAgIGRlY2xpbmUoKSB7fSxcblxuICAgIC8vIHRlbGwgdGhlIHNlcnZlciB0byByZS1wZXJmb3JtIGhtciBwcm9wYWdhdGlvbiBmcm9tIHRoaXMgbW9kdWxlIGFzIHJvb3RcbiAgICBpbnZhbGlkYXRlKG1lc3NhZ2UpIHtcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTppbnZhbGlkYXRlJywgeyBwYXRoOiBvd25lclBhdGgsIG1lc3NhZ2UgfSlcbiAgICAgIHRoaXMuc2VuZCgndml0ZTppbnZhbGlkYXRlJywgeyBwYXRoOiBvd25lclBhdGgsIG1lc3NhZ2UgfSlcbiAgICAgIGNvbnNvbGUuZGVidWcoXG4gICAgICAgIGBbdml0ZV0gaW52YWxpZGF0ZSAke293bmVyUGF0aH0ke21lc3NhZ2UgPyBgOiAke21lc3NhZ2V9YCA6ICcnfWAsXG4gICAgICApXG4gICAgfSxcblxuICAgIC8vIGN1c3RvbSBldmVudHNcbiAgICBvbihldmVudCwgY2IpIHtcbiAgICAgIGNvbnN0IGFkZFRvTWFwID0gKG1hcDogTWFwPHN0cmluZywgYW55W10+KSA9PiB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbWFwLmdldChldmVudCkgfHwgW11cbiAgICAgICAgZXhpc3RpbmcucHVzaChjYilcbiAgICAgICAgbWFwLnNldChldmVudCwgZXhpc3RpbmcpXG4gICAgICB9XG4gICAgICBhZGRUb01hcChjdXN0b21MaXN0ZW5lcnNNYXApXG4gICAgICBhZGRUb01hcChuZXdMaXN0ZW5lcnMpXG4gICAgfSxcblxuICAgIHNlbmQoZXZlbnQsIGRhdGEpIHtcbiAgICAgIG1lc3NhZ2VCdWZmZXIucHVzaChKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdjdXN0b20nLCBldmVudCwgZGF0YSB9KSlcbiAgICAgIHNlbmRNZXNzYWdlQnVmZmVyKClcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIGhvdFxufVxuXG4vKipcbiAqIHVybHMgaGVyZSBhcmUgZHluYW1pYyBpbXBvcnQoKSB1cmxzIHRoYXQgY291bGRuJ3QgYmUgc3RhdGljYWxseSBhbmFseXplZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0UXVlcnkodXJsOiBzdHJpbmcsIHF1ZXJ5VG9JbmplY3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIHNraXAgdXJscyB0aGF0IHdvbid0IGJlIGhhbmRsZWQgYnkgdml0ZVxuICBpZiAoIXVybC5zdGFydHNXaXRoKCcuJykgJiYgIXVybC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gdXJsXG4gIH1cblxuICAvLyBjYW4ndCB1c2UgcGF0aG5hbWUgZnJvbSBVUkwgc2luY2UgaXQgbWF5IGJlIHJlbGF0aXZlIGxpa2UgLi4vXG4gIGNvbnN0IHBhdGhuYW1lID0gdXJsLnJlcGxhY2UoLyMuKiQvLCAnJykucmVwbGFjZSgvXFw/LiokLywgJycpXG4gIGNvbnN0IHsgc2VhcmNoLCBoYXNoIH0gPSBuZXcgVVJMKHVybCwgJ2h0dHA6Ly92aXRlanMuZGV2JylcblxuICByZXR1cm4gYCR7cGF0aG5hbWV9PyR7cXVlcnlUb0luamVjdH0ke3NlYXJjaCA/IGAmYCArIHNlYXJjaC5zbGljZSgxKSA6ICcnfSR7XG4gICAgaGFzaCB8fCAnJ1xuICB9YFxufVxuXG5leHBvcnQgeyBFcnJvck92ZXJsYXkg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