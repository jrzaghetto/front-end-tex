
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/AddPoke.svelte generated by Svelte v3.29.4 */

    const file = "src/components/AddPoke.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let form;
    	let input;
    	let t0;
    	let button;
    	let svg0;
    	let use;
    	let t1;
    	let div2;
    	let t2;
    	let svg1;
    	let symbol;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			svg0 = svg_element("svg");
    			use = svg_element("use");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			svg1 = svg_element("svg");
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			attr_dev(input, "id", "pesquisa");
    			attr_dev(input, "class", "effect-1 svelte-14uenyv");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Adicione um PokeMão...");
    			attr_dev(input, "name", "search");
    			add_location(input, file, 80, 6, 1294);
    			xlink_attr(use, "xlink:href", "#bike");
    			attr_dev(use, "class", "svelte-14uenyv");
    			add_location(use, file, 82, 8, 1438);
    			attr_dev(svg0, "class", "svelte-14uenyv");
    			add_location(svg0, file, 81, 28, 1424);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-14uenyv");
    			add_location(button, file, 81, 6, 1402);
    			attr_dev(form, "class", "svelte-14uenyv");
    			add_location(form, file, 79, 4, 1256);
    			attr_dev(div0, "class", "search-container svelte-14uenyv");
    			add_location(div0, file, 78, 2, 1221);
    			attr_dev(div1, "class", "pesquisa svelte-14uenyv");
    			add_location(div1, file, 77, 0, 1196);
    			attr_dev(div2, "class", "svelte-14uenyv");
    			add_location(div2, file, 89, 0, 1521);
    			attr_dev(path, "d", "M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z");
    			attr_dev(path, "class", "svelte-14uenyv");
    			add_location(path, file, 96, 0, 1639);
    			attr_dev(symbol, "width", "40");
    			attr_dev(symbol, "height", "40");
    			attr_dev(symbol, "fill", "#ff9f1c");
    			attr_dev(symbol, "viewBox", "0 0 24 24");
    			attr_dev(symbol, "id", "bike");
    			attr_dev(symbol, "class", "svelte-14uenyv");
    			add_location(symbol, file, 95, 2, 1562);
    			attr_dev(svg1, "display", "none");
    			attr_dev(svg1, "class", "svelte-14uenyv");
    			add_location(svg1, file, 94, 0, 1539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, form);
    			append_dev(form, input);
    			append_dev(form, t0);
    			append_dev(form, button);
    			append_dev(button, svg0);
    			append_dev(svg0, use);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, svg1, anchor);
    			append_dev(svg1, symbol);
    			append_dev(symbol, path);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[0]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(svg1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AddPoke", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddPoke> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	return [submit_handler];
    }

    class AddPoke extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddPoke",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /*! MIT License © Sindre Sorhus */

    const globals = {};

    const getGlobal = property => {
    	/* istanbul ignore next */
    	if (typeof self !== 'undefined' && self && property in self) {
    		return self;
    	}

    	/* istanbul ignore next */
    	if (typeof window !== 'undefined' && window && property in window) {
    		return window;
    	}

    	if (typeof global !== 'undefined' && global && property in global) {
    		return global;
    	}

    	/* istanbul ignore next */
    	if (typeof globalThis !== 'undefined' && globalThis) {
    		return globalThis;
    	}
    };

    const globalProperties = [
    	'Headers',
    	'Request',
    	'Response',
    	'ReadableStream',
    	'fetch',
    	'AbortController',
    	'FormData'
    ];

    for (const property of globalProperties) {
    	Object.defineProperty(globals, property, {
    		get() {
    			const globalObject = getGlobal(property);
    			const value = globalObject && globalObject[property];
    			return typeof value === 'function' ? value.bind(globalObject) : value;
    		}
    	});
    }

    const isObject = value => value !== null && typeof value === 'object';
    const supportsAbortController = typeof globals.AbortController === 'function';
    const supportsStreams = typeof globals.ReadableStream === 'function';
    const supportsFormData = typeof globals.FormData === 'function';

    const mergeHeaders = (source1, source2) => {
    	const result = new globals.Headers(source1 || {});
    	const isHeadersInstance = source2 instanceof globals.Headers;
    	const source = new globals.Headers(source2 || {});

    	for (const [key, value] of source) {
    		if ((isHeadersInstance && value === 'undefined') || value === undefined) {
    			result.delete(key);
    		} else {
    			result.set(key, value);
    		}
    	}

    	return result;
    };

    const deepMerge = (...sources) => {
    	let returnValue = {};
    	let headers = {};

    	for (const source of sources) {
    		if (Array.isArray(source)) {
    			if (!(Array.isArray(returnValue))) {
    				returnValue = [];
    			}

    			returnValue = [...returnValue, ...source];
    		} else if (isObject(source)) {
    			for (let [key, value] of Object.entries(source)) {
    				if (isObject(value) && Reflect.has(returnValue, key)) {
    					value = deepMerge(returnValue[key], value);
    				}

    				returnValue = {...returnValue, [key]: value};
    			}

    			if (isObject(source.headers)) {
    				headers = mergeHeaders(headers, source.headers);
    			}
    		}

    		returnValue.headers = headers;
    	}

    	return returnValue;
    };

    const requestMethods = [
    	'get',
    	'post',
    	'put',
    	'patch',
    	'head',
    	'delete'
    ];

    const responseTypes = {
    	json: 'application/json',
    	text: 'text/*',
    	formData: 'multipart/form-data',
    	arrayBuffer: '*/*',
    	blob: '*/*'
    };

    const retryMethods = [
    	'get',
    	'put',
    	'head',
    	'delete',
    	'options',
    	'trace'
    ];

    const retryStatusCodes = [
    	408,
    	413,
    	429,
    	500,
    	502,
    	503,
    	504
    ];

    const retryAfterStatusCodes = [
    	413,
    	429,
    	503
    ];

    const stop = Symbol('stop');

    class HTTPError extends Error {
    	constructor(response) {
    		// Set the message to the status text, such as Unauthorized,
    		// with some fallbacks. This message should never be undefined.
    		super(
    			response.statusText ||
    			String(
    				(response.status === 0 || response.status) ?
    					response.status : 'Unknown response error'
    			)
    		);
    		this.name = 'HTTPError';
    		this.response = response;
    	}
    }

    class TimeoutError extends Error {
    	constructor(request) {
    		super('Request timed out');
    		this.name = 'TimeoutError';
    		this.request = request;
    	}
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // `Promise.race()` workaround (#91)
    const timeout = (request, abortController, options) =>
    	new Promise((resolve, reject) => {
    		const timeoutID = setTimeout(() => {
    			if (abortController) {
    				abortController.abort();
    			}

    			reject(new TimeoutError(request));
    		}, options.timeout);

    		/* eslint-disable promise/prefer-await-to-then */
    		options.fetch(request)
    			.then(resolve)
    			.catch(reject)
    			.then(() => {
    				clearTimeout(timeoutID);
    			});
    		/* eslint-enable promise/prefer-await-to-then */
    	});

    const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

    const defaultRetryOptions = {
    	limit: 2,
    	methods: retryMethods,
    	statusCodes: retryStatusCodes,
    	afterStatusCodes: retryAfterStatusCodes
    };

    const normalizeRetryOptions = (retry = {}) => {
    	if (typeof retry === 'number') {
    		return {
    			...defaultRetryOptions,
    			limit: retry
    		};
    	}

    	if (retry.methods && !Array.isArray(retry.methods)) {
    		throw new Error('retry.methods must be an array');
    	}

    	if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    		throw new Error('retry.statusCodes must be an array');
    	}

    	return {
    		...defaultRetryOptions,
    		...retry,
    		afterStatusCodes: retryAfterStatusCodes
    	};
    };

    // The maximum value of a 32bit int (see issue #117)
    const maxSafeTimeout = 2147483647;

    class Ky {
    	constructor(input, options = {}) {
    		this._retryCount = 0;
    		this._input = input;
    		this._options = {
    			// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
    			credentials: this._input.credentials || 'same-origin',
    			...options,
    			headers: mergeHeaders(this._input.headers, options.headers),
    			hooks: deepMerge({
    				beforeRequest: [],
    				beforeRetry: [],
    				afterResponse: []
    			}, options.hooks),
    			method: normalizeRequestMethod(options.method || this._input.method),
    			prefixUrl: String(options.prefixUrl || ''),
    			retry: normalizeRetryOptions(options.retry),
    			throwHttpErrors: options.throwHttpErrors !== false,
    			timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
    			fetch: options.fetch || globals.fetch
    		};

    		if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
    			throw new TypeError('`input` must be a string, URL, or Request');
    		}

    		if (this._options.prefixUrl && typeof this._input === 'string') {
    			if (this._input.startsWith('/')) {
    				throw new Error('`input` must not begin with a slash when using `prefixUrl`');
    			}

    			if (!this._options.prefixUrl.endsWith('/')) {
    				this._options.prefixUrl += '/';
    			}

    			this._input = this._options.prefixUrl + this._input;
    		}

    		if (supportsAbortController) {
    			this.abortController = new globals.AbortController();
    			if (this._options.signal) {
    				this._options.signal.addEventListener('abort', () => {
    					this.abortController.abort();
    				});
    			}

    			this._options.signal = this.abortController.signal;
    		}

    		this.request = new globals.Request(this._input, this._options);

    		if (this._options.searchParams) {
    			const searchParams = '?' + new URLSearchParams(this._options.searchParams).toString();
    			const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

    			// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
    			if (((supportsFormData && this._options.body instanceof globals.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
    				this.request.headers.delete('content-type');
    			}

    			this.request = new globals.Request(new globals.Request(url, this.request), this._options);
    		}

    		if (this._options.json !== undefined) {
    			this._options.body = JSON.stringify(this._options.json);
    			this.request.headers.set('content-type', 'application/json');
    			this.request = new globals.Request(this.request, {body: this._options.body});
    		}

    		const fn = async () => {
    			if (this._options.timeout > maxSafeTimeout) {
    				throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
    			}

    			await delay(1);
    			let response = await this._fetch();

    			for (const hook of this._options.hooks.afterResponse) {
    				// eslint-disable-next-line no-await-in-loop
    				const modifiedResponse = await hook(
    					this.request,
    					this._options,
    					this._decorateResponse(response.clone())
    				);

    				if (modifiedResponse instanceof globals.Response) {
    					response = modifiedResponse;
    				}
    			}

    			this._decorateResponse(response);

    			if (!response.ok && this._options.throwHttpErrors) {
    				throw new HTTPError(response);
    			}

    			// If `onDownloadProgress` is passed, it uses the stream API internally
    			/* istanbul ignore next */
    			if (this._options.onDownloadProgress) {
    				if (typeof this._options.onDownloadProgress !== 'function') {
    					throw new TypeError('The `onDownloadProgress` option must be a function');
    				}

    				if (!supportsStreams) {
    					throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
    				}

    				return this._stream(response.clone(), this._options.onDownloadProgress);
    			}

    			return response;
    		};

    		const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
    		const result = isRetriableMethod ? this._retry(fn) : fn();

    		for (const [type, mimeType] of Object.entries(responseTypes)) {
    			result[type] = async () => {
    				this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

    				const response = (await result).clone();

    				if (type === 'json') {
    					if (response.status === 204) {
    						return '';
    					}

    					if (options.parseJson) {
    						return options.parseJson(await response.text());
    					}
    				}

    				return response[type]();
    			};
    		}

    		return result;
    	}

    	_calculateRetryDelay(error) {
    		this._retryCount++;

    		if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
    			if (error instanceof HTTPError) {
    				if (!this._options.retry.statusCodes.includes(error.response.status)) {
    					return 0;
    				}

    				const retryAfter = error.response.headers.get('Retry-After');
    				if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
    					let after = Number(retryAfter);
    					if (Number.isNaN(after)) {
    						after = Date.parse(retryAfter) - Date.now();
    					} else {
    						after *= 1000;
    					}

    					if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
    						return 0;
    					}

    					return after;
    				}

    				if (error.response.status === 413) {
    					return 0;
    				}
    			}

    			const BACKOFF_FACTOR = 0.3;
    			return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
    		}

    		return 0;
    	}

    	_decorateResponse(response) {
    		if (this._options.parseJson) {
    			response.json = async () => {
    				return this._options.parseJson(await response.text());
    			};
    		}

    		return response;
    	}

    	async _retry(fn) {
    		try {
    			return await fn();
    		} catch (error) {
    			const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
    			if (ms !== 0 && this._retryCount > 0) {
    				await delay(ms);

    				for (const hook of this._options.hooks.beforeRetry) {
    					// eslint-disable-next-line no-await-in-loop
    					const hookResult = await hook({
    						request: this.request,
    						options: this._options,
    						error,
    						retryCount: this._retryCount
    					});

    					// If `stop` is returned from the hook, the retry process is stopped
    					if (hookResult === stop) {
    						return;
    					}
    				}

    				return this._retry(fn);
    			}

    			if (this._options.throwHttpErrors) {
    				throw error;
    			}
    		}
    	}

    	async _fetch() {
    		for (const hook of this._options.hooks.beforeRequest) {
    			// eslint-disable-next-line no-await-in-loop
    			const result = await hook(this.request, this._options);

    			if (result instanceof Request) {
    				this.request = result;
    				break;
    			}

    			if (result instanceof Response) {
    				return result;
    			}
    		}

    		if (this._options.timeout === false) {
    			return this._options.fetch(this.request.clone());
    		}

    		return timeout(this.request.clone(), this.abortController, this._options);
    	}

    	/* istanbul ignore next */
    	_stream(response, onDownloadProgress) {
    		const totalBytes = Number(response.headers.get('content-length')) || 0;
    		let transferredBytes = 0;

    		return new globals.Response(
    			new globals.ReadableStream({
    				start(controller) {
    					const reader = response.body.getReader();

    					if (onDownloadProgress) {
    						onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
    					}

    					async function read() {
    						const {done, value} = await reader.read();
    						if (done) {
    							controller.close();
    							return;
    						}

    						if (onDownloadProgress) {
    							transferredBytes += value.byteLength;
    							const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
    							onDownloadProgress({percent, transferredBytes, totalBytes}, value);
    						}

    						controller.enqueue(value);
    						read();
    					}

    					read();
    				}
    			})
    		);
    	}
    }

    const validateAndMerge = (...sources) => {
    	for (const source of sources) {
    		if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
    			throw new TypeError('The `options` argument must be an object');
    		}
    	}

    	return deepMerge({}, ...sources);
    };

    const createInstance = defaults => {
    	const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

    	for (const method of requestMethods) {
    		ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
    	}

    	ky.HTTPError = HTTPError;
    	ky.TimeoutError = TimeoutError;
    	ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
    	ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
    	ky.stop = stop;

    	return ky;
    };

    var ky = createInstance();

    /* src/components/DetalhesPokemaos.svelte generated by Svelte v3.29.4 */
    const file$1 = "src/components/DetalhesPokemaos.svelte";

    function create_fragment$1(ctx) {
    	let div46;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div18;
    	let div1;
    	let h20;
    	let t1_value = /*pokemon*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let div17;
    	let div4;
    	let div2;
    	let span0;
    	let t4;
    	let div3;
    	let span1;
    	let t5_value = /*pokemon*/ ctx[1].nationalN + "";
    	let t5;
    	let t6;
    	let div7;
    	let div5;
    	let span2;
    	let t8;
    	let div6;
    	let span3;
    	let t9_value = /*pokemon*/ ctx[1].type + "";
    	let t9;
    	let t10;
    	let div10;
    	let div8;
    	let span4;
    	let t12;
    	let div9;
    	let span5;
    	let t13_value = /*pokemon*/ ctx[1].species + "";
    	let t13;
    	let t14;
    	let div13;
    	let div11;
    	let span6;
    	let t16;
    	let div12;
    	let span7;
    	let t17_value = /*pokemon*/ ctx[1].height + "";
    	let t17;
    	let t18;
    	let t19;
    	let div16;
    	let div14;
    	let span8;
    	let t21;
    	let div15;
    	let span9;
    	let t22_value = /*pokemon*/ ctx[1].weight + "";
    	let t22;
    	let t23;
    	let t24;
    	let div45;
    	let div19;
    	let h21;
    	let t26;
    	let div44;
    	let div23;
    	let div20;
    	let span10;
    	let t28;
    	let div21;
    	let span11;
    	let t29_value = /*pokemon*/ ctx[1].hp + "";
    	let t29;
    	let t30;
    	let div22;
    	let span12;
    	let t31;
    	let div27;
    	let div24;
    	let span13;
    	let t33;
    	let div25;
    	let span14;
    	let t34_value = /*pokemon*/ ctx[1].attack + "";
    	let t34;
    	let t35;
    	let div26;
    	let span15;
    	let t36;
    	let div31;
    	let div28;
    	let span16;
    	let t38;
    	let div29;
    	let span17;
    	let t39_value = /*pokemon*/ ctx[1].defense + "";
    	let t39;
    	let t40;
    	let div30;
    	let span18;
    	let t41;
    	let div35;
    	let div32;
    	let span19;
    	let t43;
    	let div33;
    	let span20;
    	let t44_value = /*pokemon*/ ctx[1].specialAttack + "";
    	let t44;
    	let t45;
    	let div34;
    	let span21;
    	let t46;
    	let div39;
    	let div36;
    	let span22;
    	let t48;
    	let div37;
    	let span23;
    	let t49_value = /*pokemon*/ ctx[1].specialDefense + "";
    	let t49;
    	let t50;
    	let div38;
    	let span24;
    	let t51;
    	let div43;
    	let div40;
    	let span25;
    	let t53;
    	let div41;
    	let span26;
    	let t54_value = /*pokemon*/ ctx[1].speed + "";
    	let t54;
    	let t55;
    	let div42;
    	let span27;

    	const block = {
    		c: function create() {
    			div46 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div18 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			div17 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = "National N";
    			t4 = space();
    			div3 = element("div");
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div7 = element("div");
    			div5 = element("div");
    			span2 = element("span");
    			span2.textContent = "Type";
    			t8 = space();
    			div6 = element("div");
    			span3 = element("span");
    			t9 = text(t9_value);
    			t10 = space();
    			div10 = element("div");
    			div8 = element("div");
    			span4 = element("span");
    			span4.textContent = "Species";
    			t12 = space();
    			div9 = element("div");
    			span5 = element("span");
    			t13 = text(t13_value);
    			t14 = space();
    			div13 = element("div");
    			div11 = element("div");
    			span6 = element("span");
    			span6.textContent = "Height";
    			t16 = space();
    			div12 = element("div");
    			span7 = element("span");
    			t17 = text(t17_value);
    			t18 = text(" m");
    			t19 = space();
    			div16 = element("div");
    			div14 = element("div");
    			span8 = element("span");
    			span8.textContent = "Weight";
    			t21 = space();
    			div15 = element("div");
    			span9 = element("span");
    			t22 = text(t22_value);
    			t23 = text(" kg");
    			t24 = space();
    			div45 = element("div");
    			div19 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Status Básicos";
    			t26 = space();
    			div44 = element("div");
    			div23 = element("div");
    			div20 = element("div");
    			span10 = element("span");
    			span10.textContent = "HP";
    			t28 = space();
    			div21 = element("div");
    			span11 = element("span");
    			t29 = text(t29_value);
    			t30 = space();
    			div22 = element("div");
    			span12 = element("span");
    			t31 = space();
    			div27 = element("div");
    			div24 = element("div");
    			span13 = element("span");
    			span13.textContent = "Attack";
    			t33 = space();
    			div25 = element("div");
    			span14 = element("span");
    			t34 = text(t34_value);
    			t35 = space();
    			div26 = element("div");
    			span15 = element("span");
    			t36 = space();
    			div31 = element("div");
    			div28 = element("div");
    			span16 = element("span");
    			span16.textContent = "Defense";
    			t38 = space();
    			div29 = element("div");
    			span17 = element("span");
    			t39 = text(t39_value);
    			t40 = space();
    			div30 = element("div");
    			span18 = element("span");
    			t41 = space();
    			div35 = element("div");
    			div32 = element("div");
    			span19 = element("span");
    			span19.textContent = "Special-Attack";
    			t43 = space();
    			div33 = element("div");
    			span20 = element("span");
    			t44 = text(t44_value);
    			t45 = space();
    			div34 = element("div");
    			span21 = element("span");
    			t46 = space();
    			div39 = element("div");
    			div36 = element("div");
    			span22 = element("span");
    			span22.textContent = "Special-Defense";
    			t48 = space();
    			div37 = element("div");
    			span23 = element("span");
    			t49 = text(t49_value);
    			t50 = space();
    			div38 = element("div");
    			span24 = element("span");
    			t51 = space();
    			div43 = element("div");
    			div40 = element("div");
    			span25 = element("span");
    			span25.textContent = "Speed";
    			t53 = space();
    			div41 = element("div");
    			span26 = element("span");
    			t54 = text(t54_value);
    			t55 = space();
    			div42 = element("div");
    			span27 = element("span");
    			if (img.src !== (img_src_value = /*pokemonSpriteGrande*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "bulbasaur");
    			attr_dev(img, "height", "230");
    			add_location(img, file$1, 185, 8, 3872);
    			attr_dev(div0, "class", "imagem-pokemon svelte-1h0h5cp");
    			add_location(div0, file$1, 184, 6, 3835);
    			add_location(h20, file$1, 192, 10, 4067);
    			attr_dev(div1, "class", "titulo-pokemon capitalize svelte-1h0h5cp");
    			add_location(div1, file$1, 191, 8, 4017);
    			add_location(span0, file$1, 197, 14, 4218);
    			attr_dev(div2, "class", "titulos svelte-1h0h5cp");
    			add_location(div2, file$1, 196, 12, 4182);
    			add_location(span1, file$1, 200, 14, 4308);
    			attr_dev(div3, "class", "textos svelte-1h0h5cp");
    			add_location(div3, file$1, 199, 12, 4273);
    			attr_dev(div4, "class", "grid-inline svelte-1h0h5cp");
    			add_location(div4, file$1, 195, 10, 4144);
    			add_location(span2, file$1, 205, 14, 4461);
    			attr_dev(div5, "class", "titulos svelte-1h0h5cp");
    			add_location(div5, file$1, 204, 12, 4425);
    			add_location(span3, file$1, 208, 14, 4556);
    			attr_dev(div6, "class", "textos capitalize svelte-1h0h5cp");
    			add_location(div6, file$1, 207, 12, 4510);
    			attr_dev(div7, "class", "grid-inline svelte-1h0h5cp");
    			add_location(div7, file$1, 203, 10, 4387);
    			add_location(span4, file$1, 213, 14, 4704);
    			attr_dev(div8, "class", "titulos svelte-1h0h5cp");
    			add_location(div8, file$1, 212, 12, 4668);
    			add_location(span5, file$1, 216, 14, 4791);
    			attr_dev(div9, "class", "textos svelte-1h0h5cp");
    			add_location(div9, file$1, 215, 12, 4756);
    			attr_dev(div10, "class", "grid-inline svelte-1h0h5cp");
    			add_location(div10, file$1, 211, 10, 4630);
    			add_location(span6, file$1, 221, 14, 4942);
    			attr_dev(div11, "class", "titulos svelte-1h0h5cp");
    			add_location(div11, file$1, 220, 12, 4906);
    			add_location(span7, file$1, 224, 14, 5028);
    			attr_dev(div12, "class", "textos svelte-1h0h5cp");
    			add_location(div12, file$1, 223, 12, 4993);
    			attr_dev(div13, "class", "grid-inline svelte-1h0h5cp");
    			add_location(div13, file$1, 219, 10, 4868);
    			add_location(span8, file$1, 229, 14, 5180);
    			attr_dev(div14, "class", "titulos svelte-1h0h5cp");
    			add_location(div14, file$1, 228, 12, 5144);
    			add_location(span9, file$1, 232, 14, 5266);
    			attr_dev(div15, "class", "textos svelte-1h0h5cp");
    			add_location(div15, file$1, 231, 12, 5231);
    			attr_dev(div16, "class", "grid-inline svelte-1h0h5cp");
    			add_location(div16, file$1, 227, 10, 5106);
    			attr_dev(div17, "class", "infos svelte-1h0h5cp");
    			add_location(div17, file$1, 194, 8, 4114);
    			attr_dev(div18, "class", "detalhes-pokemon svelte-1h0h5cp");
    			add_location(div18, file$1, 190, 6, 3978);
    			attr_dev(h21, "class", "svelte-1h0h5cp");
    			add_location(h21, file$1, 239, 10, 5445);
    			attr_dev(div19, "class", "titulo-pokemon");
    			add_location(div19, file$1, 238, 8, 5406);
    			add_location(span10, file$1, 244, 14, 5608);
    			attr_dev(div20, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div20, file$1, 243, 12, 5565);
    			add_location(span11, file$1, 247, 14, 5697);
    			attr_dev(div21, "class", "textos-status svelte-1h0h5cp");
    			add_location(div21, file$1, 246, 12, 5655);
    			add_location(span12, file$1, 250, 14, 5808);
    			attr_dev(div22, "class", "barra svelte-1h0h5cp");
    			set_style(div22, "width", "45%");
    			add_location(div22, file$1, 249, 12, 5754);
    			attr_dev(div23, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div23, file$1, 242, 10, 5522);
    			add_location(span13, file$1, 255, 14, 5954);
    			attr_dev(div24, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div24, file$1, 254, 12, 5911);
    			add_location(span14, file$1, 258, 14, 6047);
    			attr_dev(div25, "class", "textos-status svelte-1h0h5cp");
    			add_location(div25, file$1, 257, 12, 6005);
    			add_location(span15, file$1, 261, 14, 6162);
    			attr_dev(div26, "class", "barra svelte-1h0h5cp");
    			set_style(div26, "width", "49%");
    			add_location(div26, file$1, 260, 12, 6108);
    			attr_dev(div27, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div27, file$1, 253, 10, 5868);
    			add_location(span16, file$1, 266, 14, 6308);
    			attr_dev(div28, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div28, file$1, 265, 12, 6265);
    			add_location(span17, file$1, 269, 14, 6402);
    			attr_dev(div29, "class", "textos-status svelte-1h0h5cp");
    			add_location(div29, file$1, 268, 12, 6360);
    			add_location(span18, file$1, 272, 14, 6518);
    			attr_dev(div30, "class", "barra svelte-1h0h5cp");
    			set_style(div30, "width", "49%");
    			add_location(div30, file$1, 271, 12, 6464);
    			attr_dev(div31, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div31, file$1, 264, 10, 6222);
    			add_location(span19, file$1, 277, 14, 6664);
    			attr_dev(div32, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div32, file$1, 276, 12, 6621);
    			add_location(span20, file$1, 280, 14, 6765);
    			attr_dev(div33, "class", "textos-status svelte-1h0h5cp");
    			add_location(div33, file$1, 279, 12, 6723);
    			add_location(span21, file$1, 283, 14, 6925);
    			attr_dev(div34, "class", "barra svelte-1h0h5cp");
    			set_style(div34, "background-color", "#ffdd57", 1);
    			set_style(div34, "width", "65%");
    			add_location(div34, file$1, 282, 12, 6833);
    			attr_dev(div35, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div35, file$1, 275, 10, 6578);
    			add_location(span22, file$1, 288, 14, 7071);
    			attr_dev(div36, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div36, file$1, 287, 12, 7028);
    			add_location(span23, file$1, 291, 14, 7173);
    			attr_dev(div37, "class", "textos-status svelte-1h0h5cp");
    			add_location(div37, file$1, 290, 12, 7131);
    			add_location(span24, file$1, 294, 14, 7334);
    			attr_dev(div38, "class", "barra svelte-1h0h5cp");
    			set_style(div38, "background-color", "#ffdd57", 1);
    			set_style(div38, "width", "65%");
    			add_location(div38, file$1, 293, 12, 7242);
    			attr_dev(div39, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div39, file$1, 286, 10, 6985);
    			add_location(span25, file$1, 299, 14, 7480);
    			attr_dev(div40, "class", "titulos-status svelte-1h0h5cp");
    			add_location(div40, file$1, 298, 12, 7437);
    			add_location(span26, file$1, 302, 14, 7572);
    			attr_dev(div41, "class", "textos-status svelte-1h0h5cp");
    			add_location(div41, file$1, 301, 12, 7530);
    			add_location(span27, file$1, 305, 14, 7686);
    			attr_dev(div42, "class", "barra svelte-1h0h5cp");
    			set_style(div42, "width", "45%");
    			add_location(div42, file$1, 304, 12, 7632);
    			attr_dev(div43, "class", "grid-inline-tres svelte-1h0h5cp");
    			add_location(div43, file$1, 297, 10, 7394);
    			attr_dev(div44, "class", "infos svelte-1h0h5cp");
    			add_location(div44, file$1, 241, 8, 5492);
    			attr_dev(div45, "class", "status-pokemon svelte-1h0h5cp");
    			add_location(div45, file$1, 237, 6, 5369);
    			attr_dev(div46, "class", "pokemon-detalhes svelte-1h0h5cp");
    			add_location(div46, file$1, 183, 4, 3798);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div46, anchor);
    			append_dev(div46, div0);
    			append_dev(div0, img);
    			append_dev(div46, t0);
    			append_dev(div46, div18);
    			append_dev(div18, div1);
    			append_dev(div1, h20);
    			append_dev(h20, t1);
    			append_dev(div18, t2);
    			append_dev(div18, div17);
    			append_dev(div17, div4);
    			append_dev(div4, div2);
    			append_dev(div2, span0);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, span1);
    			append_dev(span1, t5);
    			append_dev(div17, t6);
    			append_dev(div17, div7);
    			append_dev(div7, div5);
    			append_dev(div5, span2);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, span3);
    			append_dev(span3, t9);
    			append_dev(div17, t10);
    			append_dev(div17, div10);
    			append_dev(div10, div8);
    			append_dev(div8, span4);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, span5);
    			append_dev(span5, t13);
    			append_dev(div17, t14);
    			append_dev(div17, div13);
    			append_dev(div13, div11);
    			append_dev(div11, span6);
    			append_dev(div13, t16);
    			append_dev(div13, div12);
    			append_dev(div12, span7);
    			append_dev(span7, t17);
    			append_dev(span7, t18);
    			append_dev(div17, t19);
    			append_dev(div17, div16);
    			append_dev(div16, div14);
    			append_dev(div14, span8);
    			append_dev(div16, t21);
    			append_dev(div16, div15);
    			append_dev(div15, span9);
    			append_dev(span9, t22);
    			append_dev(span9, t23);
    			append_dev(div46, t24);
    			append_dev(div46, div45);
    			append_dev(div45, div19);
    			append_dev(div19, h21);
    			append_dev(div45, t26);
    			append_dev(div45, div44);
    			append_dev(div44, div23);
    			append_dev(div23, div20);
    			append_dev(div20, span10);
    			append_dev(div23, t28);
    			append_dev(div23, div21);
    			append_dev(div21, span11);
    			append_dev(span11, t29);
    			append_dev(div23, t30);
    			append_dev(div23, div22);
    			append_dev(div22, span12);
    			append_dev(div44, t31);
    			append_dev(div44, div27);
    			append_dev(div27, div24);
    			append_dev(div24, span13);
    			append_dev(div27, t33);
    			append_dev(div27, div25);
    			append_dev(div25, span14);
    			append_dev(span14, t34);
    			append_dev(div27, t35);
    			append_dev(div27, div26);
    			append_dev(div26, span15);
    			append_dev(div44, t36);
    			append_dev(div44, div31);
    			append_dev(div31, div28);
    			append_dev(div28, span16);
    			append_dev(div31, t38);
    			append_dev(div31, div29);
    			append_dev(div29, span17);
    			append_dev(span17, t39);
    			append_dev(div31, t40);
    			append_dev(div31, div30);
    			append_dev(div30, span18);
    			append_dev(div44, t41);
    			append_dev(div44, div35);
    			append_dev(div35, div32);
    			append_dev(div32, span19);
    			append_dev(div35, t43);
    			append_dev(div35, div33);
    			append_dev(div33, span20);
    			append_dev(span20, t44);
    			append_dev(div35, t45);
    			append_dev(div35, div34);
    			append_dev(div34, span21);
    			append_dev(div44, t46);
    			append_dev(div44, div39);
    			append_dev(div39, div36);
    			append_dev(div36, span22);
    			append_dev(div39, t48);
    			append_dev(div39, div37);
    			append_dev(div37, span23);
    			append_dev(span23, t49);
    			append_dev(div39, t50);
    			append_dev(div39, div38);
    			append_dev(div38, span24);
    			append_dev(div44, t51);
    			append_dev(div44, div43);
    			append_dev(div43, div40);
    			append_dev(div40, span25);
    			append_dev(div43, t53);
    			append_dev(div43, div41);
    			append_dev(div41, span26);
    			append_dev(span26, t54);
    			append_dev(div43, t55);
    			append_dev(div43, div42);
    			append_dev(div42, span27);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pokemonSpriteGrande*/ 1 && img.src !== (img_src_value = /*pokemonSpriteGrande*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*pokemon*/ 2 && t1_value !== (t1_value = /*pokemon*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*pokemon*/ 2 && t5_value !== (t5_value = /*pokemon*/ ctx[1].nationalN + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*pokemon*/ 2 && t9_value !== (t9_value = /*pokemon*/ ctx[1].type + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*pokemon*/ 2 && t13_value !== (t13_value = /*pokemon*/ ctx[1].species + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*pokemon*/ 2 && t17_value !== (t17_value = /*pokemon*/ ctx[1].height + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*pokemon*/ 2 && t22_value !== (t22_value = /*pokemon*/ ctx[1].weight + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*pokemon*/ 2 && t29_value !== (t29_value = /*pokemon*/ ctx[1].hp + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*pokemon*/ 2 && t34_value !== (t34_value = /*pokemon*/ ctx[1].attack + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*pokemon*/ 2 && t39_value !== (t39_value = /*pokemon*/ ctx[1].defense + "")) set_data_dev(t39, t39_value);
    			if (dirty & /*pokemon*/ 2 && t44_value !== (t44_value = /*pokemon*/ ctx[1].specialAttack + "")) set_data_dev(t44, t44_value);
    			if (dirty & /*pokemon*/ 2 && t49_value !== (t49_value = /*pokemon*/ ctx[1].specialDefense + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*pokemon*/ 2 && t54_value !== (t54_value = /*pokemon*/ ctx[1].speed + "")) set_data_dev(t54, t54_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div46);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DetalhesPokemaos", slots, []);
    	let id = 12;
    	let pokemon = {};
    	let { pokemonSpriteGrande = pokemon.spriteGrande } = $$props;

    	async function getPokemon(id) {
    		const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    		const pokemonSpecieURL = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    		const pokemonGeneral = await ky.get(pokemonURL).json();
    		const pokemonSpecie = await ky.get(pokemonSpecieURL).json();

    		const { // id,
    		name, types, sprites, abilities, stats, height, weight } = pokemonGeneral;

    		const { genera } = pokemonSpecie;
    		const typesTratado = [];

    		for (var i = 0; i < types.length; i++) {
    			typesTratado.push(types[i].type["name"]);
    		}

    		const abilitiesTratado = [];

    		for (var i = 0; i < abilities.length; i++) {
    			abilitiesTratado.push(abilities[i].ability["name"]);
    		}

    		const statsTratado = {};

    		for (var i = 0; i < stats.length; i++) {
    			statsTratado[stats[i].stat["name"]] = stats[i].base_stat;
    		}

    		const speciesTratado = [genera[7].genus];
    		const heightTratado = height / 10;
    		const weightTratado = weight / 10;
    		const spriteGrande = sprites.other.dream_world.front_default;
    		const spriteAnimado = sprites.versions["generation-v"]["black-white"].animated.front_default;
    		const hp = statsTratado.hp;
    		const attack = statsTratado.attack;
    		const defense = statsTratado.defense;
    		const specialAttack = statsTratado["special-attack"];
    		const specialDefense = statsTratado["special-defense"];
    		const speed = statsTratado.speed;

    		return $$invalidate(1, pokemon = {
    			"nationalN": id,
    			name,
    			hp,
    			attack,
    			defense,
    			specialAttack,
    			specialDefense,
    			speed,
    			"type": typesTratado,
    			"species": speciesTratado,
    			sprites,
    			spriteGrande,
    			spriteAnimado,
    			"abilities": abilitiesTratado,
    			"height": heightTratado,
    			"weight": weightTratado
    		});
    	}

    	const writable_props = ["pokemonSpriteGrande"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DetalhesPokemaos> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("pokemonSpriteGrande" in $$props) $$invalidate(0, pokemonSpriteGrande = $$props.pokemonSpriteGrande);
    	};

    	$$self.$capture_state = () => ({
    		ky,
    		id,
    		pokemon,
    		pokemonSpriteGrande,
    		getPokemon
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("pokemon" in $$props) $$invalidate(1, pokemon = $$props.pokemon);
    		if ("pokemonSpriteGrande" in $$props) $$invalidate(0, pokemonSpriteGrande = $$props.pokemonSpriteGrande);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 getPokemon(id);
    	return [pokemonSpriteGrande, pokemon];
    }

    class DetalhesPokemaos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { pokemonSpriteGrande: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DetalhesPokemaos",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get pokemonSpriteGrande() {
    		throw new Error("<DetalhesPokemaos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemonSpriteGrande(value) {
    		throw new Error("<DetalhesPokemaos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PokemonBox.svelte generated by Svelte v3.29.4 */
    const file$2 = "src/components/PokemonBox.svelte";

    // (249:4) {#if pokemon.type2 != undefined}
    function create_if_block(ctx) {
    	let span;
    	let t_value = /*pokemon*/ ctx[0].type2 + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*pokemon*/ ctx[0].type2) + " svelte-1sw2l7m"));
    			add_location(span, file$2, 249, 4, 5103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pokemon*/ 1 && t_value !== (t_value = /*pokemon*/ ctx[0].type2 + "")) set_data_dev(t, t_value);

    			if (dirty & /*pokemon*/ 1 && span_class_value !== (span_class_value = "" + (null_to_empty(/*pokemon*/ ctx[0].type2) + " svelte-1sw2l7m"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(249:4) {#if pokemon.type2 != undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let span0;
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*pokemon*/ ctx[0]["name"] + "";
    	let t3;
    	let t4;
    	let div1;
    	let span2;
    	let t5_value = /*pokemon*/ ctx[0].type1 + "";
    	let t5;
    	let span2_class_value;
    	let t6;
    	let t7;
    	let div2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let div3_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*pokemon*/ ctx[0].type2 != undefined && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text("N° ");
    			t1 = text(/*id*/ ctx[1]);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			div2 = element("div");
    			img = element("img");
    			attr_dev(span0, "class", "id-pokemon svelte-1sw2l7m");
    			add_location(span0, file$2, 242, 4, 4830);
    			attr_dev(span1, "class", "nome-pokemon svelte-1sw2l7m");
    			add_location(span1, file$2, 243, 4, 4874);
    			attr_dev(div0, "class", "texto-box svelte-1sw2l7m");
    			add_location(div0, file$2, 241, 2, 4802);
    			attr_dev(span2, "class", span2_class_value = "" + (null_to_empty(/*pokemon*/ ctx[0].type1) + " svelte-1sw2l7m"));
    			add_location(span2, file$2, 247, 4, 5011);
    			attr_dev(div1, "class", "tipos-pokemon svelte-1sw2l7m");
    			add_location(div1, file$2, 245, 2, 4937);
    			if (img.src !== (img_src_value = /*pokemon*/ ctx[0].spriteAnimado)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*pokemon*/ ctx[0]["name"]);
    			attr_dev(img, "height", "40px");
    			add_location(img, file$2, 254, 4, 5225);
    			attr_dev(div2, "class", "imagem-box svelte-1sw2l7m");
    			add_location(div2, file$2, 253, 2, 5196);
    			attr_dev(div3, "class", div3_class_value = "pokemon-box " + /*current*/ ctx[2] + " svelte-1sw2l7m");
    			add_location(div3, file$2, 240, 0, 4755);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(span1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(span2, t5);
    			append_dev(div1, t6);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, img);

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 2) set_data_dev(t1, /*id*/ ctx[1]);
    			if (dirty & /*pokemon*/ 1 && t3_value !== (t3_value = /*pokemon*/ ctx[0]["name"] + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*pokemon*/ 1 && t5_value !== (t5_value = /*pokemon*/ ctx[0].type1 + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*pokemon*/ 1 && span2_class_value !== (span2_class_value = "" + (null_to_empty(/*pokemon*/ ctx[0].type1) + " svelte-1sw2l7m"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (/*pokemon*/ ctx[0].type2 != undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*pokemon*/ 1 && img.src !== (img_src_value = /*pokemon*/ ctx[0].spriteAnimado)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*pokemon*/ 1 && img_alt_value !== (img_alt_value = /*pokemon*/ ctx[0]["name"])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*current*/ 4 && div3_class_value !== (div3_class_value = "pokemon-box " + /*current*/ ctx[2] + " svelte-1sw2l7m")) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PokemonBox", slots, []);
    	let { id = 12 } = $$props;
    	let { pokemon = {} } = $$props;
    	let { current = "bar" } = $$props;

    	async function getPokemon(id) {
    		const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    		const pokemonSpecieURL = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    		const pokemonGeneral = await ky.get(pokemonURL).json();
    		const pokemonSpecie = await ky.get(pokemonSpecieURL).json();

    		const { // id,
    		name, types, sprites, abilities, stats, height, weight } = pokemonGeneral;

    		const { genera } = pokemonSpecie;
    		const typesTratado = [];

    		for (var i = 0; i < types.length; i++) {
    			typesTratado.push(types[i].type["name"]);
    		}

    		const abilitiesTratado = [];

    		for (var i = 0; i < abilities.length; i++) {
    			abilitiesTratado.push(abilities[i].ability["name"]);
    		}

    		const statsTratado = {};

    		for (var i = 0; i < stats.length; i++) {
    			statsTratado[stats[i].stat["name"]] = stats[i].base_stat;
    		}

    		const speciesTratado = [genera[7].genus];
    		const heightTratado = height / 10;
    		const weightTratado = weight / 10;
    		const spriteGrande = sprites.other.dream_world.front_default;
    		const spriteAnimado = sprites.versions["generation-v"]["black-white"].animated.front_default;
    		const hp = statsTratado.hp;
    		const attack = statsTratado.attack;
    		const defense = statsTratado.defense;
    		const specialAttack = statsTratado["special-attack"];
    		const specialDefense = statsTratado["special-defense"];
    		const speed = statsTratado.speed;

    		return $$invalidate(0, pokemon = {
    			"nationalN": id,
    			name,
    			hp,
    			attack,
    			defense,
    			specialAttack,
    			specialDefense,
    			speed,
    			"type1": typesTratado[0],
    			"type2": typesTratado[1],
    			"species": speciesTratado,
    			sprites,
    			spriteGrande,
    			spriteAnimado,
    			"abilities": abilitiesTratado,
    			"height": heightTratado,
    			"weight": weightTratado
    		});
    	}

    	const writable_props = ["id", "pokemon", "current"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PokemonBox> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("pokemon" in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    	};

    	$$self.$capture_state = () => ({
    		ky,
    		DetalhesPokemaos,
    		id,
    		pokemon,
    		current,
    		getPokemon
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("pokemon" in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 2) {
    			 getPokemon(id);
    		}
    	};

    	return [pokemon, id, current, click_handler];
    }

    class PokemonBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 1, pokemon: 0, current: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PokemonBox",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get id() {
    		throw new Error("<PokemonBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PokemonBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pokemon() {
    		throw new Error("<PokemonBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemon(value) {
    		throw new Error("<PokemonBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<PokemonBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<PokemonBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/components/ListaPokemaos.svelte generated by Svelte v3.29.4 */
    const file$3 = "src/components/ListaPokemaos.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (298:6) {#each pokes as poke}
    function create_each_block(ctx) {
    	let pokemonbox;
    	let current;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[4](/*poke*/ ctx[7], ...args);
    	}

    	pokemonbox = new PokemonBox({
    			props: { id: /*poke*/ ctx[7] },
    			$$inline: true
    		});

    	pokemonbox.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			create_component(pokemonbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pokemonbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const pokemonbox_changes = {};
    			if (dirty & /*pokes*/ 1) pokemonbox_changes.id = /*poke*/ ctx[7];
    			pokemonbox.$set(pokemonbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pokemonbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pokemonbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pokemonbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(298:6) {#each pokes as poke}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div49;
    	let div0;
    	let h50;
    	let t1;
    	let t2;
    	let div48;
    	let h51;
    	let t4;
    	let div47;
    	let div1;
    	let img;
    	let img_src_value;
    	let t5;
    	let div19;
    	let div2;
    	let h20;
    	let t6_value = /*pokemon*/ ctx[1].name + "";
    	let t6;
    	let t7;
    	let div18;
    	let div5;
    	let div3;
    	let span0;
    	let t9;
    	let div4;
    	let span1;
    	let t10_value = /*pokemon*/ ctx[1].nationalN + "";
    	let t10;
    	let t11;
    	let div8;
    	let div6;
    	let span2;
    	let t13;
    	let div7;
    	let span3;
    	let t14_value = /*pokemon*/ ctx[1].type + "";
    	let t14;
    	let t15;
    	let div11;
    	let div9;
    	let span4;
    	let t17;
    	let div10;
    	let span5;
    	let t18_value = /*pokemon*/ ctx[1].species + "";
    	let t18;
    	let t19;
    	let div14;
    	let div12;
    	let span6;
    	let t21;
    	let div13;
    	let span7;
    	let t22_value = /*pokemon*/ ctx[1].height + "";
    	let t22;
    	let t23;
    	let t24;
    	let div17;
    	let div15;
    	let span8;
    	let t26;
    	let div16;
    	let span9;
    	let t27_value = /*pokemon*/ ctx[1].weight + "";
    	let t27;
    	let t28;
    	let t29;
    	let div46;
    	let div20;
    	let h21;
    	let t31;
    	let div45;
    	let div24;
    	let div21;
    	let span10;
    	let t33;
    	let div22;
    	let span11;
    	let t34_value = /*pokemon*/ ctx[1].hp + "";
    	let t34;
    	let t35;
    	let div23;
    	let span12;
    	let t36;
    	let div28;
    	let div25;
    	let span13;
    	let t38;
    	let div26;
    	let span14;
    	let t39_value = /*pokemon*/ ctx[1].attack + "";
    	let t39;
    	let t40;
    	let div27;
    	let span15;
    	let t41;
    	let div32;
    	let div29;
    	let span16;
    	let t43;
    	let div30;
    	let span17;
    	let t44_value = /*pokemon*/ ctx[1].defense + "";
    	let t44;
    	let t45;
    	let div31;
    	let span18;
    	let t46;
    	let div36;
    	let div33;
    	let span19;
    	let t48;
    	let div34;
    	let span20;
    	let t49_value = /*pokemon*/ ctx[1].specialAttack + "";
    	let t49;
    	let t50;
    	let div35;
    	let span21;
    	let t51;
    	let div40;
    	let div37;
    	let span22;
    	let t53;
    	let div38;
    	let span23;
    	let t54_value = /*pokemon*/ ctx[1].specialDefense + "";
    	let t54;
    	let t55;
    	let div39;
    	let span24;
    	let t56;
    	let div44;
    	let div41;
    	let span25;
    	let t58;
    	let div42;
    	let span26;
    	let t59_value = /*pokemon*/ ctx[1].speed + "";
    	let t59;
    	let t60;
    	let div43;
    	let span27;
    	let current;
    	let each_value = /*pokes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div49 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Lista de Pokemãos";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div48 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Detalhes";
    			t4 = space();
    			div47 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t5 = space();
    			div19 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			t6 = text(t6_value);
    			t7 = space();
    			div18 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			span0 = element("span");
    			span0.textContent = "National N";
    			t9 = space();
    			div4 = element("div");
    			span1 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			div8 = element("div");
    			div6 = element("div");
    			span2 = element("span");
    			span2.textContent = "Type";
    			t13 = space();
    			div7 = element("div");
    			span3 = element("span");
    			t14 = text(t14_value);
    			t15 = space();
    			div11 = element("div");
    			div9 = element("div");
    			span4 = element("span");
    			span4.textContent = "Species";
    			t17 = space();
    			div10 = element("div");
    			span5 = element("span");
    			t18 = text(t18_value);
    			t19 = space();
    			div14 = element("div");
    			div12 = element("div");
    			span6 = element("span");
    			span6.textContent = "Height";
    			t21 = space();
    			div13 = element("div");
    			span7 = element("span");
    			t22 = text(t22_value);
    			t23 = text(" m");
    			t24 = space();
    			div17 = element("div");
    			div15 = element("div");
    			span8 = element("span");
    			span8.textContent = "Weight";
    			t26 = space();
    			div16 = element("div");
    			span9 = element("span");
    			t27 = text(t27_value);
    			t28 = text(" kg");
    			t29 = space();
    			div46 = element("div");
    			div20 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Status Básicos";
    			t31 = space();
    			div45 = element("div");
    			div24 = element("div");
    			div21 = element("div");
    			span10 = element("span");
    			span10.textContent = "HP";
    			t33 = space();
    			div22 = element("div");
    			span11 = element("span");
    			t34 = text(t34_value);
    			t35 = space();
    			div23 = element("div");
    			span12 = element("span");
    			t36 = space();
    			div28 = element("div");
    			div25 = element("div");
    			span13 = element("span");
    			span13.textContent = "Attack";
    			t38 = space();
    			div26 = element("div");
    			span14 = element("span");
    			t39 = text(t39_value);
    			t40 = space();
    			div27 = element("div");
    			span15 = element("span");
    			t41 = space();
    			div32 = element("div");
    			div29 = element("div");
    			span16 = element("span");
    			span16.textContent = "Defense";
    			t43 = space();
    			div30 = element("div");
    			span17 = element("span");
    			t44 = text(t44_value);
    			t45 = space();
    			div31 = element("div");
    			span18 = element("span");
    			t46 = space();
    			div36 = element("div");
    			div33 = element("div");
    			span19 = element("span");
    			span19.textContent = "Special-Attack";
    			t48 = space();
    			div34 = element("div");
    			span20 = element("span");
    			t49 = text(t49_value);
    			t50 = space();
    			div35 = element("div");
    			span21 = element("span");
    			t51 = space();
    			div40 = element("div");
    			div37 = element("div");
    			span22 = element("span");
    			span22.textContent = "Special-Defense";
    			t53 = space();
    			div38 = element("div");
    			span23 = element("span");
    			t54 = text(t54_value);
    			t55 = space();
    			div39 = element("div");
    			span24 = element("span");
    			t56 = space();
    			div44 = element("div");
    			div41 = element("div");
    			span25 = element("span");
    			span25.textContent = "Speed";
    			t58 = space();
    			div42 = element("div");
    			span26 = element("span");
    			t59 = text(t59_value);
    			t60 = space();
    			div43 = element("div");
    			span27 = element("span");
    			attr_dev(h50, "class", "svelte-o1xohw");
    			add_location(h50, file$3, 294, 4, 5618);
    			add_location(div0, file$3, 293, 2, 5608);
    			attr_dev(h51, "class", "svelte-o1xohw");
    			add_location(h51, file$3, 304, 4, 5925);
    			if (img.src !== (img_src_value = /*pokemon*/ ctx[1].spriteGrande)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "bulbasaur");
    			attr_dev(img, "height", "230");
    			set_style(img, "max-width", "230px");
    			add_location(img, file$3, 307, 8, 6021);
    			attr_dev(div1, "class", "imagem-pokemon svelte-o1xohw");
    			add_location(div1, file$3, 306, 6, 5984);
    			add_location(h20, file$3, 315, 10, 6251);
    			attr_dev(div2, "class", "titulo-pokemon capitalize svelte-o1xohw");
    			add_location(div2, file$3, 314, 8, 6201);
    			add_location(span0, file$3, 320, 14, 6402);
    			attr_dev(div3, "class", "titulos svelte-o1xohw");
    			add_location(div3, file$3, 319, 12, 6366);
    			add_location(span1, file$3, 323, 14, 6492);
    			attr_dev(div4, "class", "textos svelte-o1xohw");
    			add_location(div4, file$3, 322, 12, 6457);
    			attr_dev(div5, "class", "grid-inline svelte-o1xohw");
    			add_location(div5, file$3, 318, 10, 6328);
    			add_location(span2, file$3, 328, 14, 6645);
    			attr_dev(div6, "class", "titulos svelte-o1xohw");
    			add_location(div6, file$3, 327, 12, 6609);
    			add_location(span3, file$3, 331, 14, 6740);
    			attr_dev(div7, "class", "textos capitalize svelte-o1xohw");
    			add_location(div7, file$3, 330, 12, 6694);
    			attr_dev(div8, "class", "grid-inline svelte-o1xohw");
    			add_location(div8, file$3, 326, 10, 6571);
    			add_location(span4, file$3, 336, 14, 6888);
    			attr_dev(div9, "class", "titulos svelte-o1xohw");
    			add_location(div9, file$3, 335, 12, 6852);
    			add_location(span5, file$3, 339, 14, 6975);
    			attr_dev(div10, "class", "textos svelte-o1xohw");
    			add_location(div10, file$3, 338, 12, 6940);
    			attr_dev(div11, "class", "grid-inline svelte-o1xohw");
    			add_location(div11, file$3, 334, 10, 6814);
    			add_location(span6, file$3, 344, 14, 7126);
    			attr_dev(div12, "class", "titulos svelte-o1xohw");
    			add_location(div12, file$3, 343, 12, 7090);
    			add_location(span7, file$3, 347, 14, 7212);
    			attr_dev(div13, "class", "textos svelte-o1xohw");
    			add_location(div13, file$3, 346, 12, 7177);
    			attr_dev(div14, "class", "grid-inline svelte-o1xohw");
    			add_location(div14, file$3, 342, 10, 7052);
    			add_location(span8, file$3, 352, 14, 7364);
    			attr_dev(div15, "class", "titulos svelte-o1xohw");
    			add_location(div15, file$3, 351, 12, 7328);
    			add_location(span9, file$3, 355, 14, 7450);
    			attr_dev(div16, "class", "textos svelte-o1xohw");
    			add_location(div16, file$3, 354, 12, 7415);
    			attr_dev(div17, "class", "grid-inline svelte-o1xohw");
    			add_location(div17, file$3, 350, 10, 7290);
    			attr_dev(div18, "class", "infos svelte-o1xohw");
    			add_location(div18, file$3, 317, 8, 6298);
    			attr_dev(div19, "class", "detalhes-pokemon svelte-o1xohw");
    			add_location(div19, file$3, 313, 6, 6162);
    			attr_dev(h21, "class", "svelte-o1xohw");
    			add_location(h21, file$3, 362, 10, 7629);
    			attr_dev(div20, "class", "titulo-pokemon");
    			add_location(div20, file$3, 361, 8, 7590);
    			add_location(span10, file$3, 367, 14, 7792);
    			attr_dev(div21, "class", "titulos-status svelte-o1xohw");
    			add_location(div21, file$3, 366, 12, 7749);
    			add_location(span11, file$3, 370, 14, 7881);
    			attr_dev(div22, "class", "textos-status svelte-o1xohw");
    			add_location(div22, file$3, 369, 12, 7839);
    			add_location(span12, file$3, 373, 14, 8015);
    			attr_dev(div23, "class", "barra svelte-o1xohw");
    			set_style(div23, "width", /*pokemon*/ ctx[1].hp / 180 * 100 + "%");
    			add_location(div23, file$3, 372, 12, 7938);
    			attr_dev(div24, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div24, file$3, 365, 10, 7706);
    			add_location(span13, file$3, 378, 14, 8161);
    			attr_dev(div25, "class", "titulos-status svelte-o1xohw");
    			add_location(div25, file$3, 377, 12, 8118);
    			add_location(span14, file$3, 381, 14, 8254);
    			attr_dev(div26, "class", "textos-status svelte-o1xohw");
    			add_location(div26, file$3, 380, 12, 8212);
    			add_location(span15, file$3, 384, 14, 8396);
    			attr_dev(div27, "class", "barra svelte-o1xohw");
    			set_style(div27, "width", /*pokemon*/ ctx[1].attack / 180 * 100 + "%");
    			add_location(div27, file$3, 383, 12, 8315);
    			attr_dev(div28, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div28, file$3, 376, 10, 8075);
    			add_location(span16, file$3, 389, 14, 8542);
    			attr_dev(div29, "class", "titulos-status svelte-o1xohw");
    			add_location(div29, file$3, 388, 12, 8499);
    			add_location(span17, file$3, 392, 14, 8636);
    			attr_dev(div30, "class", "textos-status svelte-o1xohw");
    			add_location(div30, file$3, 391, 12, 8594);
    			add_location(span18, file$3, 395, 14, 8780);
    			attr_dev(div31, "class", "barra svelte-o1xohw");
    			set_style(div31, "width", /*pokemon*/ ctx[1].defense / 180 * 100 + "%");
    			add_location(div31, file$3, 394, 12, 8698);
    			attr_dev(div32, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div32, file$3, 387, 10, 8456);
    			add_location(span19, file$3, 400, 14, 8926);
    			attr_dev(div33, "class", "titulos-status svelte-o1xohw");
    			add_location(div33, file$3, 399, 12, 8883);
    			add_location(span20, file$3, 403, 14, 9027);
    			attr_dev(div34, "class", "textos-status svelte-o1xohw");
    			add_location(div34, file$3, 402, 12, 8985);
    			add_location(span21, file$3, 406, 14, 9183);
    			attr_dev(div35, "class", "barra svelte-o1xohw");
    			set_style(div35, "width", /*pokemon*/ ctx[1].specialAttack / 180 * 100 + "%");
    			add_location(div35, file$3, 405, 12, 9095);
    			attr_dev(div36, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div36, file$3, 398, 10, 8840);
    			add_location(span22, file$3, 411, 14, 9329);
    			attr_dev(div37, "class", "titulos-status svelte-o1xohw");
    			add_location(div37, file$3, 410, 12, 9286);
    			add_location(span23, file$3, 414, 14, 9431);
    			attr_dev(div38, "class", "textos-status svelte-o1xohw");
    			add_location(div38, file$3, 413, 12, 9389);
    			add_location(span24, file$3, 417, 14, 9589);
    			attr_dev(div39, "class", "barra svelte-o1xohw");
    			set_style(div39, "width", /*pokemon*/ ctx[1].specialDefense / 180 * 100 + "%");
    			add_location(div39, file$3, 416, 12, 9500);
    			attr_dev(div40, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div40, file$3, 409, 10, 9243);
    			add_location(span25, file$3, 422, 14, 9735);
    			attr_dev(div41, "class", "titulos-status svelte-o1xohw");
    			add_location(div41, file$3, 421, 12, 9692);
    			add_location(span26, file$3, 425, 14, 9827);
    			attr_dev(div42, "class", "textos-status svelte-o1xohw");
    			add_location(div42, file$3, 424, 12, 9785);
    			add_location(span27, file$3, 428, 14, 9967);
    			attr_dev(div43, "class", "barra svelte-o1xohw");
    			set_style(div43, "width", /*pokemon*/ ctx[1].speed / 180 * 100 + "%");
    			add_location(div43, file$3, 427, 12, 9887);
    			attr_dev(div44, "class", "grid-inline-tres svelte-o1xohw");
    			add_location(div44, file$3, 420, 10, 9649);
    			attr_dev(div45, "class", "infos svelte-o1xohw");
    			add_location(div45, file$3, 364, 8, 7676);
    			attr_dev(div46, "class", "status-pokemon svelte-o1xohw");
    			add_location(div46, file$3, 360, 6, 7553);
    			attr_dev(div47, "class", "pokemon-detalhes svelte-o1xohw");
    			add_location(div47, file$3, 305, 4, 5947);
    			add_location(div48, file$3, 303, 2, 5915);
    			attr_dev(div49, "class", "conteudo svelte-o1xohw");
    			add_location(div49, file$3, 292, 0, 5583);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div49, anchor);
    			append_dev(div49, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div49, t2);
    			append_dev(div49, div48);
    			append_dev(div48, h51);
    			append_dev(div48, t4);
    			append_dev(div48, div47);
    			append_dev(div47, div1);
    			append_dev(div1, img);
    			append_dev(div47, t5);
    			append_dev(div47, div19);
    			append_dev(div19, div2);
    			append_dev(div2, h20);
    			append_dev(h20, t6);
    			append_dev(div19, t7);
    			append_dev(div19, div18);
    			append_dev(div18, div5);
    			append_dev(div5, div3);
    			append_dev(div3, span0);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, span1);
    			append_dev(span1, t10);
    			append_dev(div18, t11);
    			append_dev(div18, div8);
    			append_dev(div8, div6);
    			append_dev(div6, span2);
    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div7, span3);
    			append_dev(span3, t14);
    			append_dev(div18, t15);
    			append_dev(div18, div11);
    			append_dev(div11, div9);
    			append_dev(div9, span4);
    			append_dev(div11, t17);
    			append_dev(div11, div10);
    			append_dev(div10, span5);
    			append_dev(span5, t18);
    			append_dev(div18, t19);
    			append_dev(div18, div14);
    			append_dev(div14, div12);
    			append_dev(div12, span6);
    			append_dev(div14, t21);
    			append_dev(div14, div13);
    			append_dev(div13, span7);
    			append_dev(span7, t22);
    			append_dev(span7, t23);
    			append_dev(div18, t24);
    			append_dev(div18, div17);
    			append_dev(div17, div15);
    			append_dev(div15, span8);
    			append_dev(div17, t26);
    			append_dev(div17, div16);
    			append_dev(div16, span9);
    			append_dev(span9, t27);
    			append_dev(span9, t28);
    			append_dev(div47, t29);
    			append_dev(div47, div46);
    			append_dev(div46, div20);
    			append_dev(div20, h21);
    			append_dev(div46, t31);
    			append_dev(div46, div45);
    			append_dev(div45, div24);
    			append_dev(div24, div21);
    			append_dev(div21, span10);
    			append_dev(div24, t33);
    			append_dev(div24, div22);
    			append_dev(div22, span11);
    			append_dev(span11, t34);
    			append_dev(div24, t35);
    			append_dev(div24, div23);
    			append_dev(div23, span12);
    			append_dev(div45, t36);
    			append_dev(div45, div28);
    			append_dev(div28, div25);
    			append_dev(div25, span13);
    			append_dev(div28, t38);
    			append_dev(div28, div26);
    			append_dev(div26, span14);
    			append_dev(span14, t39);
    			append_dev(div28, t40);
    			append_dev(div28, div27);
    			append_dev(div27, span15);
    			append_dev(div45, t41);
    			append_dev(div45, div32);
    			append_dev(div32, div29);
    			append_dev(div29, span16);
    			append_dev(div32, t43);
    			append_dev(div32, div30);
    			append_dev(div30, span17);
    			append_dev(span17, t44);
    			append_dev(div32, t45);
    			append_dev(div32, div31);
    			append_dev(div31, span18);
    			append_dev(div45, t46);
    			append_dev(div45, div36);
    			append_dev(div36, div33);
    			append_dev(div33, span19);
    			append_dev(div36, t48);
    			append_dev(div36, div34);
    			append_dev(div34, span20);
    			append_dev(span20, t49);
    			append_dev(div36, t50);
    			append_dev(div36, div35);
    			append_dev(div35, span21);
    			append_dev(div45, t51);
    			append_dev(div45, div40);
    			append_dev(div40, div37);
    			append_dev(div37, span22);
    			append_dev(div40, t53);
    			append_dev(div40, div38);
    			append_dev(div38, span23);
    			append_dev(span23, t54);
    			append_dev(div40, t55);
    			append_dev(div40, div39);
    			append_dev(div39, span24);
    			append_dev(div45, t56);
    			append_dev(div45, div44);
    			append_dev(div44, div41);
    			append_dev(div41, span25);
    			append_dev(div44, t58);
    			append_dev(div44, div42);
    			append_dev(div42, span26);
    			append_dev(span26, t59);
    			append_dev(div44, t60);
    			append_dev(div44, div43);
    			append_dev(div43, span27);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pokes, getPokemon*/ 5) {
    				each_value = /*pokes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*pokemon*/ 2 && img.src !== (img_src_value = /*pokemon*/ ctx[1].spriteGrande)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t6_value !== (t6_value = /*pokemon*/ ctx[1].name + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t10_value !== (t10_value = /*pokemon*/ ctx[1].nationalN + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t14_value !== (t14_value = /*pokemon*/ ctx[1].type + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t18_value !== (t18_value = /*pokemon*/ ctx[1].species + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t22_value !== (t22_value = /*pokemon*/ ctx[1].height + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t27_value !== (t27_value = /*pokemon*/ ctx[1].weight + "")) set_data_dev(t27, t27_value);
    			if ((!current || dirty & /*pokemon*/ 2) && t34_value !== (t34_value = /*pokemon*/ ctx[1].hp + "")) set_data_dev(t34, t34_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div23, "width", /*pokemon*/ ctx[1].hp / 180 * 100 + "%");
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t39_value !== (t39_value = /*pokemon*/ ctx[1].attack + "")) set_data_dev(t39, t39_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div27, "width", /*pokemon*/ ctx[1].attack / 180 * 100 + "%");
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t44_value !== (t44_value = /*pokemon*/ ctx[1].defense + "")) set_data_dev(t44, t44_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div31, "width", /*pokemon*/ ctx[1].defense / 180 * 100 + "%");
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t49_value !== (t49_value = /*pokemon*/ ctx[1].specialAttack + "")) set_data_dev(t49, t49_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div35, "width", /*pokemon*/ ctx[1].specialAttack / 180 * 100 + "%");
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t54_value !== (t54_value = /*pokemon*/ ctx[1].specialDefense + "")) set_data_dev(t54, t54_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div39, "width", /*pokemon*/ ctx[1].specialDefense / 180 * 100 + "%");
    			}

    			if ((!current || dirty & /*pokemon*/ 2) && t59_value !== (t59_value = /*pokemon*/ ctx[1].speed + "")) set_data_dev(t59, t59_value);

    			if (!current || dirty & /*pokemon*/ 2) {
    				set_style(div43, "width", /*pokemon*/ ctx[1].speed / 180 * 100 + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div49);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ListaPokemaos", slots, []);
    	let id = 1;
    	let pokemon = {};
    	let { test = 1 } = $$props;
    	const progress = tweened(30, { duration: 400, easing: cubicOut });
    	let { pokes = [1] } = $$props;

    	async function getPokemon(id) {
    		const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    		const pokemonSpecieURL = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    		const pokemonGeneral = await ky.get(pokemonURL).json();
    		const pokemonSpecie = await ky.get(pokemonSpecieURL).json();

    		const { // id,
    		name, types, sprites, abilities, stats, height, weight } = pokemonGeneral;

    		const { genera } = pokemonSpecie;
    		const typesTratado = [];

    		for (var i = 0; i < types.length; i++) {
    			typesTratado.push(types[i].type["name"]);
    		}

    		const abilitiesTratado = [];

    		for (var i = 0; i < abilities.length; i++) {
    			abilitiesTratado.push(abilities[i].ability["name"]);
    		}

    		const statsTratado = {};

    		for (var i = 0; i < stats.length; i++) {
    			statsTratado[stats[i].stat["name"]] = stats[i].base_stat;
    		}

    		const speciesTratado = [genera[7].genus];
    		const heightTratado = height / 10;
    		const weightTratado = weight / 10;
    		const spriteGrande = sprites.other.dream_world.front_default;
    		const spriteAnimado = sprites.versions["generation-v"]["black-white"].animated.front_default;
    		const hp = statsTratado.hp;
    		const attack = statsTratado.attack;
    		const defense = statsTratado.defense;
    		const specialAttack = statsTratado["special-attack"];
    		const specialDefense = statsTratado["special-defense"];
    		const speed = statsTratado.speed;

    		return $$invalidate(1, pokemon = {
    			"nationalN": id,
    			name,
    			hp,
    			attack,
    			defense,
    			specialAttack,
    			specialDefense,
    			speed,
    			"type": typesTratado,
    			"species": speciesTratado,
    			sprites,
    			spriteGrande,
    			spriteAnimado,
    			"abilities": abilitiesTratado,
    			"height": heightTratado,
    			"weight": weightTratado
    		});
    	}

    	const writable_props = ["test", "pokes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ListaPokemaos> was created with unknown prop '${key}'`);
    	});

    	const click_handler = poke => getPokemon(poke);

    	$$self.$$set = $$props => {
    		if ("test" in $$props) $$invalidate(3, test = $$props.test);
    		if ("pokes" in $$props) $$invalidate(0, pokes = $$props.pokes);
    	};

    	$$self.$capture_state = () => ({
    		ky,
    		PokemonBox,
    		tweened,
    		cubicOut,
    		id,
    		pokemon,
    		test,
    		progress,
    		pokes,
    		getPokemon
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(5, id = $$props.id);
    		if ("pokemon" in $$props) $$invalidate(1, pokemon = $$props.pokemon);
    		if ("test" in $$props) $$invalidate(3, test = $$props.test);
    		if ("pokes" in $$props) $$invalidate(0, pokes = $$props.pokes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 getPokemon(id);
    	return [pokes, pokemon, getPokemon, test, click_handler];
    }

    class ListaPokemaos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { test: 3, pokes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListaPokemaos",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get test() {
    		throw new Error("<ListaPokemaos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set test(value) {
    		throw new Error("<ListaPokemaos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pokes() {
    		throw new Error("<ListaPokemaos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokes(value) {
    		throw new Error("<ListaPokemaos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Nav.svelte generated by Svelte v3.29.4 */

    const file$4 = "src/components/Nav.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let form;
    	let button;
    	let i;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			form = element("form");
    			button = element("button");
    			i = element("i");
    			t1 = space();
    			input = element("input");
    			if (img.src !== (img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "asd");
    			attr_dev(img, "width", "80px");
    			attr_dev(img, "class", "svelte-sa7b1t");
    			add_location(img, file$4, 87, 2, 1432);
    			attr_dev(i, "class", "fa fa-search svelte-sa7b1t");
    			add_location(i, file$4, 90, 28, 1557);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-sa7b1t");
    			add_location(button, file$4, 90, 6, 1535);
    			attr_dev(input, "class", "effect-1 svelte-sa7b1t");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Pesquise um PokeMão...");
    			attr_dev(input, "name", "search");
    			add_location(input, file$4, 91, 6, 1601);
    			attr_dev(form, "class", "svelte-sa7b1t");
    			add_location(form, file$4, 89, 4, 1504);
    			attr_dev(div0, "class", "search-container svelte-sa7b1t");
    			add_location(div0, file$4, 88, 2, 1469);
    			attr_dev(div1, "class", "topnav svelte-sa7b1t");
    			add_location(div1, file$4, 86, 0, 1409);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, form);
    			append_dev(form, button);
    			append_dev(button, i);
    			append_dev(form, t1);
    			append_dev(form, input);

    			if (!mounted) {
    				dispose = listen_dev(form, "click", alerta, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function alerta() {
    	alert("Não implementei a pesquisa :(");
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	let src = "images/logo.svg";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ src, alerta });

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.29.4 */
    const file$5 = "src/App.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t2;
    	let div;
    	let nav;
    	let t3;
    	let addpoke;
    	let t4;
    	let listapokemaos;
    	let current;
    	nav = new Nav({ $$inline: true });
    	addpoke = new AddPoke({ $$inline: true });
    	addpoke.$on("submit", /*changePokes*/ ctx[1]);

    	listapokemaos = new ListaPokemaos({
    			props: { pokes: /*pokesSelecionados*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "--";
    			t2 = space();
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t3 = space();
    			create_component(addpoke.$$.fragment);
    			t4 = space();
    			create_component(listapokemaos.$$.fragment);
    			if (img.src !== (img_src_value = "images/pokemaos.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$5, 29, 1, 1017);
    			add_location(p, file$5, 30, 1, 1061);
    			attr_dev(div, "id", "container");
    			attr_dev(div, "class", "svelte-13vx2d3");
    			add_location(div, file$5, 32, 1, 1073);
    			attr_dev(main, "class", "svelte-13vx2d3");
    			add_location(main, file$5, 27, 0, 980);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, img);
    			append_dev(main, t0);
    			append_dev(main, p);
    			append_dev(main, t2);
    			append_dev(main, div);
    			mount_component(nav, div, null);
    			append_dev(div, t3);
    			mount_component(addpoke, div, null);
    			append_dev(div, t4);
    			mount_component(listapokemaos, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const listapokemaos_changes = {};
    			if (dirty & /*pokesSelecionados*/ 1) listapokemaos_changes.pokes = /*pokesSelecionados*/ ctx[0];
    			listapokemaos.$set(listapokemaos_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(addpoke.$$.fragment, local);
    			transition_in(listapokemaos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(addpoke.$$.fragment, local);
    			transition_out(listapokemaos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(addpoke);
    			destroy_component(listapokemaos);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let name = "World";
    	let pokesSelecionados = [1];

    	function changePokes() {
    		if (document.getElementById("pesquisa").value > 649) {
    			alert("Acima do 649 os pokemons estão com problemas nas imagens");
    			document.getElementById("pesquisa").value = "";
    		} else if (document.getElementById("pesquisa").value < 1) {
    			alert("Coloque números entre 1 e 649");
    			document.getElementById("pesquisa").value = "";
    		} else if (Number.isInteger(parseInt(document.getElementById("pesquisa").value)) != true) {
    			alert("Coloque apenas o número, não implementei com string :)");
    			document.getElementById("pesquisa").value = "";
    		} else {
    			$$invalidate(0, pokesSelecionados = [...pokesSelecionados, document.getElementById("pesquisa").value]);
    			document.getElementById("pesquisa").value = "";
    			return pokesSelecionados;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AddPoke,
    		ListaPokemaos,
    		Nav,
    		name,
    		pokesSelecionados,
    		changePokes
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) name = $$props.name;
    		if ("pokesSelecionados" in $$props) $$invalidate(0, pokesSelecionados = $$props.pokesSelecionados);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pokesSelecionados, changePokes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
