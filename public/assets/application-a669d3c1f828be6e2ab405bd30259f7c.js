/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );

var CKEDITOR_BASEPATH = '/assets/ckeditor/';
/*
Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function(){if(window.CKEDITOR&&window.CKEDITOR.dom)return;window.CKEDITOR||(window.CKEDITOR=function(){var b={timestamp:"D6IE",version:"4.2",revision:"f74e558",rnd:Math.floor(900*Math.random())+100,_:{pending:[]},status:"unloaded",basePath:function(){var a=window.CKEDITOR_BASEPATH||"";if(!a)for(var b=document.getElementsByTagName("script"),h=0;h<b.length;h++){var c=b[h].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(c){a=c[1];break}}-1==a.indexOf(":/")&&(a=0===a.indexOf("/")?location.href.match(/^.*?:\/\/[^\/]*/)[0]+a:location.href.match(/^[^\?]*\/(?:)/)[0]+
a);if(!a)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return a}(),getUrl:function(a){-1==a.indexOf(":/")&&0!==a.indexOf("/")&&(a=this.basePath+a);this.timestamp&&("/"!=a.charAt(a.length-1)&&!/[&?]t=/.test(a))&&(a+=(0<=a.indexOf("?")?"&":"?")+"t="+this.timestamp);return a},domReady:function(){function a(){try{document.addEventListener?(document.removeEventListener("DOMContentLoaded",a,
!1),b()):document.attachEvent&&"complete"===document.readyState&&(document.detachEvent("onreadystatechange",a),b())}catch(h){}}function b(){for(var a;a=h.shift();)a()}var h=[];return function(b){h.push(b);"complete"===document.readyState&&setTimeout(a,1);if(1==h.length)if(document.addEventListener)document.addEventListener("DOMContentLoaded",a,!1),window.addEventListener("load",a,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",a);window.attachEvent("onload",a);b=!1;try{b=
!window.frameElement}catch(d){}if(document.documentElement.doScroll&&b){var c=function(){try{document.documentElement.doScroll("left")}catch(b){setTimeout(c,1);return}a()};c()}}}}()},c=window.CKEDITOR_GETURL;if(c){var a=b.getUrl;b.getUrl=function(e){return c.call(b,e)||a.call(b,e)}}return b}());
CKEDITOR.event||(CKEDITOR.event=function(){},CKEDITOR.event.implementOn=function(b){var c=CKEDITOR.event.prototype,a;for(a in c)b[a]==void 0&&(b[a]=c[a])},CKEDITOR.event.prototype=function(){function b(e){var b=c(this);return b[e]||(b[e]=new a(e))}var c=function(a){a=a.getPrivate&&a.getPrivate()||a._||(a._={});return a.events||(a.events={})},a=function(a){this.name=a;this.listeners=[]};a.prototype={getListenerIndex:function(a){for(var b=0,h=this.listeners;b<h.length;b++)if(h[b].fn==a)return b;return-1}};
return{define:function(a,d){var h=b.call(this,a);CKEDITOR.tools.extend(h,d,true)},on:function(a,d,h,c,j){function i(b,g,n,o){b={name:a,sender:this,editor:b,data:g,listenerData:c,stop:n,cancel:o,removeListener:l};return d.call(h,b)===false?false:b.data}function l(){o.removeListener(a,d)}var n=b.call(this,a);if(n.getListenerIndex(d)<0){n=n.listeners;h||(h=this);isNaN(j)&&(j=10);var o=this;i.fn=d;i.priority=j;for(var q=n.length-1;q>=0;q--)if(n[q].priority<=j){n.splice(q+1,0,i);return{removeListener:l}}n.unshift(i)}return{removeListener:l}},
once:function(){var a=arguments[1];arguments[1]=function(b){b.removeListener();return a.apply(this,arguments)};return this.on.apply(this,arguments)},capture:function(){CKEDITOR.event.useCapture=1;var a=this.on.apply(this,arguments);CKEDITOR.event.useCapture=0;return a},fire:function(){var a=0,b=function(){a=1},h=0,f=function(){h=1};return function(j,i,l){var n=c(this)[j],j=a,o=h;a=h=0;if(n){var q=n.listeners;if(q.length)for(var q=q.slice(0),k,g=0;g<q.length;g++){if(n.errorProof)try{k=q[g].call(this,
l,i,b,f)}catch(p){}else k=q[g].call(this,l,i,b,f);k===false?h=1:typeof k!="undefined"&&(i=k);if(a||h)break}}i=h?false:typeof i=="undefined"?true:i;a=j;h=o;return i}}(),fireOnce:function(a,b,h){b=this.fire(a,b,h);delete c(this)[a];return b},removeListener:function(a,b){var h=c(this)[a];if(h){var f=h.getListenerIndex(b);f>=0&&h.listeners.splice(f,1)}},removeAllListeners:function(){var a=c(this),b;for(b in a)delete a[b]},hasListeners:function(a){return(a=c(this)[a])&&a.listeners.length>0}}}());
CKEDITOR.editor||(CKEDITOR.editor=function(){CKEDITOR._.pending.push([this,arguments]);CKEDITOR.event.call(this)},CKEDITOR.editor.prototype.fire=function(b,c){b in{instanceReady:1,loaded:1}&&(this[b]=true);return CKEDITOR.event.prototype.fire.call(this,b,c,this)},CKEDITOR.editor.prototype.fireOnce=function(b,c){b in{instanceReady:1,loaded:1}&&(this[b]=true);return CKEDITOR.event.prototype.fireOnce.call(this,b,c,this)},CKEDITOR.event.implementOn(CKEDITOR.editor.prototype));
CKEDITOR.env||(CKEDITOR.env=function(){var b=navigator.userAgent.toLowerCase(),c=window.opera,a={ie:eval("/*@cc_on!@*/false"),opera:!!c&&c.version,webkit:b.indexOf(" applewebkit/")>-1,air:b.indexOf(" adobeair/")>-1,mac:b.indexOf("macintosh")>-1,quirks:document.compatMode=="BackCompat",mobile:b.indexOf("mobile")>-1,iOS:/(ipad|iphone|ipod)/.test(b),isCustomDomain:function(){if(!this.ie)return false;var a=document.domain,e=window.location.hostname;return a!=e&&a!="["+e+"]"},secure:location.protocol==
"https:"};a.gecko=navigator.product=="Gecko"&&!a.webkit&&!a.opera;if(a.webkit)b.indexOf("chrome")>-1?a.chrome=true:a.safari=true;var e=0;if(a.ie){e=a.quirks||!document.documentMode?parseFloat(b.match(/msie (\d+)/)[1]):document.documentMode;a.ie9Compat=e==9;a.ie8Compat=e==8;a.ie7Compat=e==7;a.ie6Compat=e<7||a.quirks}if(a.gecko){var d=b.match(/rv:([\d\.]+)/);if(d){d=d[1].split(".");e=d[0]*1E4+(d[1]||0)*100+(d[2]||0)*1}}a.opera&&(e=parseFloat(c.version()));a.air&&(e=parseFloat(b.match(/ adobeair\/(\d+)/)[1]));
a.webkit&&(e=parseFloat(b.match(/ applewebkit\/(\d+)/)[1]));a.version=e;a.isCompatible=a.iOS&&e>=534||!a.mobile&&(a.ie&&e>6||a.gecko&&e>=10801||a.opera&&e>=9.5||a.air&&e>=1||a.webkit&&e>=522||false);a.hidpi=window.devicePixelRatio>=2;a.cssClass="cke_browser_"+(a.ie?"ie":a.gecko?"gecko":a.opera?"opera":a.webkit?"webkit":"unknown");if(a.quirks)a.cssClass=a.cssClass+" cke_browser_quirks";if(a.ie){a.cssClass=a.cssClass+(" cke_browser_ie"+(a.quirks||a.version<7?"6":a.version));if(a.quirks)a.cssClass=a.cssClass+
" cke_browser_iequirks"}if(a.gecko)if(e<10900)a.cssClass=a.cssClass+" cke_browser_gecko18";else if(e<=11E3)a.cssClass=a.cssClass+" cke_browser_gecko19";if(a.air)a.cssClass=a.cssClass+" cke_browser_air";if(a.iOS)a.cssClass=a.cssClass+" cke_browser_ios";if(a.hidpi)a.cssClass=a.cssClass+" cke_hidpi";return a}());
"unloaded"==CKEDITOR.status&&function(){CKEDITOR.event.implementOn(CKEDITOR);CKEDITOR.loadFullCore=function(){if(CKEDITOR.status!="basic_ready")CKEDITOR.loadFullCore._load=1;else{delete CKEDITOR.loadFullCore;var b=document.createElement("script");b.type="text/javascript";b.src=CKEDITOR.basePath+"ckeditor.js";document.getElementsByTagName("head")[0].appendChild(b)}};CKEDITOR.loadFullCoreTimeout=0;CKEDITOR.add=function(b){(this._.pending||(this._.pending=[])).push(b)};(function(){CKEDITOR.domReady(function(){var b=
CKEDITOR.loadFullCore,c=CKEDITOR.loadFullCoreTimeout;if(b){CKEDITOR.status="basic_ready";b&&b._load?b():c&&setTimeout(function(){CKEDITOR.loadFullCore&&CKEDITOR.loadFullCore()},c*1E3)}})})();CKEDITOR.status="basic_loaded"}();CKEDITOR.dom={};
(function(){var b=[],c=CKEDITOR.env.gecko?"-moz-":CKEDITOR.env.webkit?"-webkit-":CKEDITOR.env.opera?"-o-":CKEDITOR.env.ie?"-ms-":"";CKEDITOR.on("reset",function(){b=[]});CKEDITOR.tools={arrayCompare:function(a,e){if(!a&&!e)return true;if(!a||!e||a.length!=e.length)return false;for(var b=0;b<a.length;b++)if(a[b]!=e[b])return false;return true},clone:function(a){var e;if(a&&a instanceof Array){e=[];for(var b=0;b<a.length;b++)e[b]=CKEDITOR.tools.clone(a[b]);return e}if(a===null||typeof a!="object"||
a instanceof String||a instanceof Number||a instanceof Boolean||a instanceof Date||a instanceof RegExp)return a;e=new a.constructor;for(b in a)e[b]=CKEDITOR.tools.clone(a[b]);return e},capitalize:function(a){return a.charAt(0).toUpperCase()+a.substring(1).toLowerCase()},extend:function(a){var b=arguments.length,d,c;if(typeof(d=arguments[b-1])=="boolean")b--;else if(typeof(d=arguments[b-2])=="boolean"){c=arguments[b-1];b=b-2}for(var f=1;f<b;f++){var j=arguments[f],i;for(i in j)if(d===true||a[i]==void 0)if(!c||
i in c)a[i]=j[i]}return a},prototypedCopy:function(a){var b=function(){};b.prototype=a;return new b},copy:function(a){var b={},d;for(d in a)b[d]=a[d];return b},isArray:function(a){return!!a&&a instanceof Array},isEmpty:function(a){for(var b in a)if(a.hasOwnProperty(b))return false;return true},cssVendorPrefix:function(a,b,d){if(d)return c+a+":"+b+";"+a+":"+b;d={};d[a]=b;d[c+a]=b;return d},cssStyleToDomStyle:function(){var a=document.createElement("div").style,b=typeof a.cssFloat!="undefined"?"cssFloat":
typeof a.styleFloat!="undefined"?"styleFloat":"float";return function(a){return a=="float"?b:a.replace(/-./g,function(a){return a.substr(1).toUpperCase()})}}(),buildStyleHtml:function(a){for(var a=[].concat(a),b,d=[],c=0;c<a.length;c++)if(b=a[c])/@import|[{}]/.test(b)?d.push("<style>"+b+"</style>"):d.push('<link type="text/css" rel=stylesheet href="'+b+'">');return d.join("")},htmlEncode:function(a){return(""+a).replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;")},htmlEncodeAttr:function(a){return a.replace(/"/g,
"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},getNextNumber:function(){var a=0;return function(){return++a}}(),getNextId:function(){return"cke_"+this.getNextNumber()},override:function(a,b){var d=b(a);d.prototype=a.prototype;return d},setTimeout:function(a,b,d,c,f){f||(f=window);d||(d=f);return f.setTimeout(function(){c?a.apply(d,[].concat(c)):a.apply(d)},b||0)},trim:function(){var a=/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;return function(b){return b.replace(a,"")}}(),ltrim:function(){var a=/^[ \t\n\r]+/g;
return function(b){return b.replace(a,"")}}(),rtrim:function(){var a=/[ \t\n\r]+$/g;return function(b){return b.replace(a,"")}}(),indexOf:function(a,b){if(typeof b=="function")for(var d=0,c=a.length;d<c;d++){if(b(a[d]))return d}else{if(a.indexOf)return a.indexOf(b);d=0;for(c=a.length;d<c;d++)if(a[d]===b)return d}return-1},search:function(a,b){var d=CKEDITOR.tools.indexOf(a,b);return d>=0?a[d]:null},bind:function(a,b){return function(){return a.apply(b,arguments)}},createClass:function(a){var b=a.$,
d=a.base,c=a.privates||a._,f=a.proto,a=a.statics;!b&&(b=function(){d&&this.base.apply(this,arguments)});if(c)var j=b,b=function(){var a=this._||(this._={}),b;for(b in c){var e=c[b];a[b]=typeof e=="function"?CKEDITOR.tools.bind(e,this):e}j.apply(this,arguments)};if(d){b.prototype=this.prototypedCopy(d.prototype);b.prototype.constructor=b;b.base=d;b.baseProto=d.prototype;b.prototype.base=function(){this.base=d.prototype.base;d.apply(this,arguments);this.base=arguments.callee}}f&&this.extend(b.prototype,
f,true);a&&this.extend(b,a,true);return b},addFunction:function(a,e){return b.push(function(){return a.apply(e||this,arguments)})-1},removeFunction:function(a){b[a]=null},callFunction:function(a){var e=b[a];return e&&e.apply(window,Array.prototype.slice.call(arguments,1))},cssLength:function(){var a=/^-?\d+\.?\d*px$/,b;return function(d){b=CKEDITOR.tools.trim(d+"")+"px";return a.test(b)?b:d||""}}(),convertToPx:function(){var a;return function(b){if(!a){a=CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>',
CKEDITOR.document);CKEDITOR.document.getBody().append(a)}if(!/%$/.test(b)){a.setStyle("width",b);return a.$.clientWidth}return b}}(),repeat:function(a,b){return Array(b+1).join(a)},tryThese:function(){for(var a,b=0,d=arguments.length;b<d;b++){var c=arguments[b];try{a=c();break}catch(f){}}return a},genKey:function(){return Array.prototype.slice.call(arguments).join("-")},defer:function(a){return function(){var b=arguments,d=this;window.setTimeout(function(){a.apply(d,b)},0)}},normalizeCssText:function(a,
b){var d=[],c,f=CKEDITOR.tools.parseCssText(a,true,b);for(c in f)d.push(c+":"+f[c]);d.sort();return d.length?d.join(";")+";":""},convertRgbToHex:function(a){return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi,function(a,b,c,f){a=[b,c,f];for(b=0;b<3;b++)a[b]=("0"+parseInt(a[b],10).toString(16)).slice(-2);return"#"+a.join("")})},parseCssText:function(a,b,d){var c={};if(d){d=new CKEDITOR.dom.element("span");d.setAttribute("style",a);a=CKEDITOR.tools.convertRgbToHex(d.getAttribute("style")||
"")}if(!a||a==";")return c;a.replace(/&quot;/g,'"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(a,d,i){if(b){d=d.toLowerCase();d=="font-family"&&(i=i.toLowerCase().replace(/["']/g,"").replace(/\s*,\s*/g,","));i=CKEDITOR.tools.trim(i)}c[d]=i});return c},writeCssText:function(a,b){var d,c=[];for(d in a)c.push(d+":"+a[d]);b&&c.sort();return c.join("; ")},objectCompare:function(a,b,d){var c;if(!a&&!b)return true;if(!a||!b)return false;for(c in a)if(a[c]!=b[c])return false;if(!d)for(c in b)if(a[c]!=
b[c])return false;return true},objectKeys:function(a){var b=[],d;for(d in a)b.push(d);return b},convertArrayToObject:function(a,b){var d={};arguments.length==1&&(b=true);for(var c=0,f=a.length;c<f;++c)d[a[c]]=b;return d},fixDomain:function(){for(var a;;)try{a=window.parent.document.domain;break}catch(b){a=a?a.replace(/.+?(?:\.|$)/,""):document.domain;if(!a)break;document.domain=a}return!!a}}})();
CKEDITOR.dtd=function(){var b=CKEDITOR.tools.extend,c=function(a,b){for(var e=CKEDITOR.tools.clone(a),d=1;d<arguments.length;d++){var b=arguments[d],c;for(c in b)delete e[c]}return e},a={},e={},d={address:1,article:1,aside:1,blockquote:1,details:1,div:1,dl:1,fieldset:1,figure:1,footer:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,header:1,hgroup:1,hr:1,menu:1,nav:1,ol:1,p:1,pre:1,section:1,table:1,ul:1},h={command:1,link:1,meta:1,noscript:1,script:1,style:1},f={},j={"#":1},i={center:1,dir:1,noframes:1};
b(a,{a:1,abbr:1,area:1,audio:1,b:1,bdi:1,bdo:1,br:1,button:1,canvas:1,cite:1,code:1,command:1,datalist:1,del:1,dfn:1,em:1,embed:1,i:1,iframe:1,img:1,input:1,ins:1,kbd:1,keygen:1,label:1,map:1,mark:1,meter:1,noscript:1,object:1,output:1,progress:1,q:1,ruby:1,s:1,samp:1,script:1,select:1,small:1,span:1,strong:1,sub:1,sup:1,textarea:1,time:1,u:1,"var":1,video:1,wbr:1},j,{acronym:1,applet:1,basefont:1,big:1,font:1,isindex:1,strike:1,style:1,tt:1});b(e,d,a,i);c={a:c(a,{a:1,button:1}),abbr:a,address:e,
area:f,article:b({style:1},e),aside:b({style:1},e),audio:b({source:1,track:1},e),b:a,base:f,bdi:a,bdo:a,blockquote:e,body:e,br:f,button:c(a,{a:1,button:1}),canvas:a,caption:e,cite:a,code:a,col:f,colgroup:{col:1},command:f,datalist:b({option:1},a),dd:e,del:a,details:b({summary:1},e),dfn:a,div:b({style:1},e),dl:{dt:1,dd:1},dt:e,em:a,embed:f,fieldset:b({legend:1},e),figcaption:e,figure:b({figcaption:1},e),footer:e,form:e,h1:a,h2:a,h3:a,h4:a,h5:a,h6:a,head:b({title:1,base:1},h),header:e,hgroup:{h1:1,
h2:1,h3:1,h4:1,h5:1,h6:1},hr:f,html:b({head:1,body:1},e,h),i:a,iframe:j,img:f,input:f,ins:a,kbd:a,keygen:f,label:a,legend:a,li:e,link:f,map:e,mark:a,menu:b({li:1},e),meta:f,meter:c(a,{meter:1}),nav:e,noscript:b({link:1,meta:1,style:1},a),object:b({param:1},a),ol:{li:1},optgroup:{option:1},option:j,output:a,p:a,param:f,pre:a,progress:c(a,{progress:1}),q:a,rp:a,rt:a,ruby:b({rp:1,rt:1},a),s:a,samp:a,script:j,section:b({style:1},e),select:{optgroup:1,option:1},small:a,source:f,span:a,strong:a,style:j,
sub:a,summary:a,sup:a,table:{caption:1,colgroup:1,thead:1,tfoot:1,tbody:1,tr:1},tbody:{tr:1},td:e,textarea:j,tfoot:{tr:1},th:e,thead:{tr:1},time:c(a,{time:1}),title:j,tr:{th:1,td:1},track:f,u:a,ul:{li:1},"var":a,video:b({source:1,track:1},e),wbr:f,acronym:a,applet:b({param:1},e),basefont:f,big:a,center:e,dialog:f,dir:{li:1},font:a,isindex:f,noframes:e,strike:a,tt:a};b(c,{$block:b({audio:1,dd:1,dt:1,li:1,video:1},d,i),$blockLimit:{article:1,aside:1,audio:1,body:1,caption:1,details:1,dir:1,div:1,dl:1,
fieldset:1,figure:1,footer:1,form:1,header:1,hgroup:1,menu:1,nav:1,ol:1,section:1,table:1,td:1,th:1,tr:1,ul:1,video:1},$cdata:{script:1,style:1},$editable:{address:1,article:1,aside:1,blockquote:1,body:1,details:1,div:1,fieldset:1,footer:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,header:1,hgroup:1,nav:1,p:1,pre:1,section:1},$empty:{area:1,base:1,basefont:1,br:1,col:1,command:1,dialog:1,embed:1,hr:1,img:1,input:1,isindex:1,keygen:1,link:1,meta:1,param:1,source:1,track:1,wbr:1},$inline:a,$list:{dl:1,ol:1,
ul:1},$listItem:{dd:1,dt:1,li:1},$nonBodyContent:b({body:1,head:1,html:1},c.head),$nonEditable:{applet:1,audio:1,button:1,embed:1,iframe:1,map:1,object:1,option:1,param:1,script:1,textarea:1,video:1},$object:{applet:1,audio:1,button:1,hr:1,iframe:1,img:1,input:1,object:1,select:1,table:1,textarea:1,video:1},$removeEmpty:{abbr:1,acronym:1,b:1,bdi:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,mark:1,meter:1,output:1,q:1,ruby:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,
sub:1,sup:1,time:1,tt:1,u:1,"var":1},$tabIndex:{a:1,area:1,button:1,input:1,object:1,select:1,textarea:1},$tableContent:{caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1},$transparent:{a:1,audio:1,canvas:1,del:1,ins:1,map:1,noscript:1,object:1,video:1},$intermediate:{caption:1,colgroup:1,dd:1,dt:1,figcaption:1,legend:1,li:1,optgroup:1,option:1,rp:1,rt:1,summary:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1}});return c}();CKEDITOR.dom.event=function(b){this.$=b};
CKEDITOR.dom.event.prototype={getKey:function(){return this.$.keyCode||this.$.which},getKeystroke:function(){var b=this.getKey();if(this.$.ctrlKey||this.$.metaKey)b=b+CKEDITOR.CTRL;this.$.shiftKey&&(b=b+CKEDITOR.SHIFT);this.$.altKey&&(b=b+CKEDITOR.ALT);return b},preventDefault:function(b){var c=this.$;c.preventDefault?c.preventDefault():c.returnValue=false;b&&this.stopPropagation()},stopPropagation:function(){var b=this.$;b.stopPropagation?b.stopPropagation():b.cancelBubble=true},getTarget:function(){var b=
this.$.target||this.$.srcElement;return b?new CKEDITOR.dom.node(b):null},getPhase:function(){return this.$.eventPhase||2},getPageOffset:function(){var b=this.getTarget().getDocument().$;return{x:this.$.pageX||this.$.clientX+(b.documentElement.scrollLeft||b.body.scrollLeft),y:this.$.pageY||this.$.clientY+(b.documentElement.scrollTop||b.body.scrollTop)}}};CKEDITOR.CTRL=1114112;CKEDITOR.SHIFT=2228224;CKEDITOR.ALT=4456448;CKEDITOR.EVENT_PHASE_CAPTURING=1;CKEDITOR.EVENT_PHASE_AT_TARGET=2;
CKEDITOR.EVENT_PHASE_BUBBLING=3;CKEDITOR.dom.domObject=function(b){if(b)this.$=b};
CKEDITOR.dom.domObject.prototype=function(){var b=function(b,a){return function(e){typeof CKEDITOR!="undefined"&&b.fire(a,new CKEDITOR.dom.event(e))}};return{getPrivate:function(){var b;if(!(b=this.getCustomData("_")))this.setCustomData("_",b={});return b},on:function(c){var a=this.getCustomData("_cke_nativeListeners");if(!a){a={};this.setCustomData("_cke_nativeListeners",a)}if(!a[c]){a=a[c]=b(this,c);this.$.addEventListener?this.$.addEventListener(c,a,!!CKEDITOR.event.useCapture):this.$.attachEvent&&
this.$.attachEvent("on"+c,a)}return CKEDITOR.event.prototype.on.apply(this,arguments)},removeListener:function(b){CKEDITOR.event.prototype.removeListener.apply(this,arguments);if(!this.hasListeners(b)){var a=this.getCustomData("_cke_nativeListeners"),e=a&&a[b];if(e){this.$.removeEventListener?this.$.removeEventListener(b,e,false):this.$.detachEvent&&this.$.detachEvent("on"+b,e);delete a[b]}}},removeAllListeners:function(){var b=this.getCustomData("_cke_nativeListeners"),a;for(a in b){var e=b[a];this.$.detachEvent?
this.$.detachEvent("on"+a,e):this.$.removeEventListener&&this.$.removeEventListener(a,e,false);delete b[a]}}}}();
(function(b){var c={};CKEDITOR.on("reset",function(){c={}});b.equals=function(a){try{return a&&a.$===this.$}catch(b){return false}};b.setCustomData=function(a,b){var d=this.getUniqueId();(c[d]||(c[d]={}))[a]=b;return this};b.getCustomData=function(a){var b=this.$["data-cke-expando"];return(b=b&&c[b])&&a in b?b[a]:null};b.removeCustomData=function(a){var b=this.$["data-cke-expando"],b=b&&c[b],d,h;if(b){d=b[a];h=a in b;delete b[a]}return h?d:null};b.clearCustomData=function(){this.removeAllListeners();
var a=this.$["data-cke-expando"];a&&delete c[a]};b.getUniqueId=function(){return this.$["data-cke-expando"]||(this.$["data-cke-expando"]=CKEDITOR.tools.getNextNumber())};CKEDITOR.event.implementOn(b)})(CKEDITOR.dom.domObject.prototype);
CKEDITOR.dom.node=function(b){return b?new CKEDITOR.dom[b.nodeType==CKEDITOR.NODE_DOCUMENT?"document":b.nodeType==CKEDITOR.NODE_ELEMENT?"element":b.nodeType==CKEDITOR.NODE_TEXT?"text":b.nodeType==CKEDITOR.NODE_COMMENT?"comment":b.nodeType==CKEDITOR.NODE_DOCUMENT_FRAGMENT?"documentFragment":"domObject"](b):this};CKEDITOR.dom.node.prototype=new CKEDITOR.dom.domObject;CKEDITOR.NODE_ELEMENT=1;CKEDITOR.NODE_DOCUMENT=9;CKEDITOR.NODE_TEXT=3;CKEDITOR.NODE_COMMENT=8;CKEDITOR.NODE_DOCUMENT_FRAGMENT=11;
CKEDITOR.POSITION_IDENTICAL=0;CKEDITOR.POSITION_DISCONNECTED=1;CKEDITOR.POSITION_FOLLOWING=2;CKEDITOR.POSITION_PRECEDING=4;CKEDITOR.POSITION_IS_CONTAINED=8;CKEDITOR.POSITION_CONTAINS=16;
CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype,{appendTo:function(b,c){b.append(this,c);return b},clone:function(b,c){var a=this.$.cloneNode(b),e=function(a){a["data-cke-expando"]&&(a["data-cke-expando"]=false);if(a.nodeType==CKEDITOR.NODE_ELEMENT){c||a.removeAttribute("id",false);if(b)for(var a=a.childNodes,h=0;h<a.length;h++)e(a[h])}};e(a);return new CKEDITOR.dom.node(a)},hasPrevious:function(){return!!this.$.previousSibling},hasNext:function(){return!!this.$.nextSibling},insertAfter:function(b){b.$.parentNode.insertBefore(this.$,
b.$.nextSibling);return b},insertBefore:function(b){b.$.parentNode.insertBefore(this.$,b.$);return b},insertBeforeMe:function(b){this.$.parentNode.insertBefore(b.$,this.$);return b},getAddress:function(b){for(var c=[],a=this.getDocument().$.documentElement,e=this.$;e&&e!=a;){var d=e.parentNode;d&&c.unshift(this.getIndex.call({$:e},b));e=d}return c},getDocument:function(){return new CKEDITOR.dom.document(this.$.ownerDocument||this.$.parentNode.ownerDocument)},getIndex:function(b){var c=this.$,a=-1,
e;if(!this.$.parentNode)return a;do if(!b||!(c!=this.$&&c.nodeType==CKEDITOR.NODE_TEXT&&(e||!c.nodeValue))){a++;e=c.nodeType==CKEDITOR.NODE_TEXT}while(c=c.previousSibling);return a},getNextSourceNode:function(b,c,a){if(a&&!a.call)var e=a,a=function(a){return!a.equals(e)};var b=!b&&this.getFirst&&this.getFirst(),d;if(!b){if(this.type==CKEDITOR.NODE_ELEMENT&&a&&a(this,true)===false)return null;b=this.getNext()}for(;!b&&(d=(d||this).getParent());){if(a&&a(d,true)===false)return null;b=d.getNext()}return!b||
a&&a(b)===false?null:c&&c!=b.type?b.getNextSourceNode(false,c,a):b},getPreviousSourceNode:function(b,c,a){if(a&&!a.call)var e=a,a=function(a){return!a.equals(e)};var b=!b&&this.getLast&&this.getLast(),d;if(!b){if(this.type==CKEDITOR.NODE_ELEMENT&&a&&a(this,true)===false)return null;b=this.getPrevious()}for(;!b&&(d=(d||this).getParent());){if(a&&a(d,true)===false)return null;b=d.getPrevious()}return!b||a&&a(b)===false?null:c&&b.type!=c?b.getPreviousSourceNode(false,c,a):b},getPrevious:function(b){var c=
this.$,a;do a=(c=c.previousSibling)&&c.nodeType!=10&&new CKEDITOR.dom.node(c);while(a&&b&&!b(a));return a},getNext:function(b){var c=this.$,a;do a=(c=c.nextSibling)&&new CKEDITOR.dom.node(c);while(a&&b&&!b(a));return a},getParent:function(b){var c=this.$.parentNode;return c&&(c.nodeType==CKEDITOR.NODE_ELEMENT||b&&c.nodeType==CKEDITOR.NODE_DOCUMENT_FRAGMENT)?new CKEDITOR.dom.node(c):null},getParents:function(b){var c=this,a=[];do a[b?"push":"unshift"](c);while(c=c.getParent());return a},getCommonAncestor:function(b){if(b.equals(this))return this;
if(b.contains&&b.contains(this))return b;var c=this.contains?this:this.getParent();do if(c.contains(b))return c;while(c=c.getParent());return null},getPosition:function(b){var c=this.$,a=b.$;if(c.compareDocumentPosition)return c.compareDocumentPosition(a);if(c==a)return CKEDITOR.POSITION_IDENTICAL;if(this.type==CKEDITOR.NODE_ELEMENT&&b.type==CKEDITOR.NODE_ELEMENT){if(c.contains){if(c.contains(a))return CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_PRECEDING;if(a.contains(c))return CKEDITOR.POSITION_IS_CONTAINED+
CKEDITOR.POSITION_FOLLOWING}if("sourceIndex"in c)return c.sourceIndex<0||a.sourceIndex<0?CKEDITOR.POSITION_DISCONNECTED:c.sourceIndex<a.sourceIndex?CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_FOLLOWING}for(var c=this.getAddress(),b=b.getAddress(),a=Math.min(c.length,b.length),e=0;e<=a-1;e++)if(c[e]!=b[e]){if(e<a)return c[e]<b[e]?CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_FOLLOWING;break}return c.length<b.length?CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_IS_CONTAINED+
CKEDITOR.POSITION_FOLLOWING},getAscendant:function(b,c){var a=this.$,e;if(!c)a=a.parentNode;for(;a;){if(a.nodeName&&(e=a.nodeName.toLowerCase(),typeof b=="string"?e==b:e in b))return new CKEDITOR.dom.node(a);try{a=a.parentNode}catch(d){a=null}}return null},hasAscendant:function(b,c){var a=this.$;if(!c)a=a.parentNode;for(;a;){if(a.nodeName&&a.nodeName.toLowerCase()==b)return true;a=a.parentNode}return false},move:function(b,c){b.append(this.remove(),c)},remove:function(b){var c=this.$,a=c.parentNode;
if(a){if(b)for(;b=c.firstChild;)a.insertBefore(c.removeChild(b),c);a.removeChild(c)}return this},replace:function(b){this.insertBefore(b);b.remove()},trim:function(){this.ltrim();this.rtrim()},ltrim:function(){for(var b;this.getFirst&&(b=this.getFirst());){if(b.type==CKEDITOR.NODE_TEXT){var c=CKEDITOR.tools.ltrim(b.getText()),a=b.getLength();if(c){if(c.length<a){b.split(a-c.length);this.$.removeChild(this.$.firstChild)}}else{b.remove();continue}}break}},rtrim:function(){for(var b;this.getLast&&(b=
this.getLast());){if(b.type==CKEDITOR.NODE_TEXT){var c=CKEDITOR.tools.rtrim(b.getText()),a=b.getLength();if(c){if(c.length<a){b.split(c.length);this.$.lastChild.parentNode.removeChild(this.$.lastChild)}}else{b.remove();continue}}break}if(!CKEDITOR.env.ie&&!CKEDITOR.env.opera)(b=this.$.lastChild)&&(b.type==1&&b.nodeName.toLowerCase()=="br")&&b.parentNode.removeChild(b)},isReadOnly:function(){var b=this;this.type!=CKEDITOR.NODE_ELEMENT&&(b=this.getParent());if(b&&typeof b.$.isContentEditable!="undefined")return!(b.$.isContentEditable||
b.data("cke-editable"));for(;b;){if(b.data("cke-editable"))break;if(b.getAttribute("contentEditable")=="false")return true;if(b.getAttribute("contentEditable")=="true")break;b=b.getParent()}return!b}});CKEDITOR.dom.window=function(b){CKEDITOR.dom.domObject.call(this,b)};CKEDITOR.dom.window.prototype=new CKEDITOR.dom.domObject;
CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype,{focus:function(){this.$.focus()},getViewPaneSize:function(){var b=this.$.document,c=b.compatMode=="CSS1Compat";return{width:(c?b.documentElement.clientWidth:b.body.clientWidth)||0,height:(c?b.documentElement.clientHeight:b.body.clientHeight)||0}},getScrollPosition:function(){var b=this.$;if("pageXOffset"in b)return{x:b.pageXOffset||0,y:b.pageYOffset||0};b=b.document;return{x:b.documentElement.scrollLeft||b.body.scrollLeft||0,y:b.documentElement.scrollTop||
b.body.scrollTop||0}},getFrame:function(){var b=this.$.frameElement;return b?new CKEDITOR.dom.element.get(b):null}});CKEDITOR.dom.document=function(b){CKEDITOR.dom.domObject.call(this,b)};CKEDITOR.dom.document.prototype=new CKEDITOR.dom.domObject;
CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype,{type:CKEDITOR.NODE_DOCUMENT,appendStyleSheet:function(b){if(this.$.createStyleSheet)this.$.createStyleSheet(b);else{var c=new CKEDITOR.dom.element("link");c.setAttributes({rel:"stylesheet",type:"text/css",href:b});this.getHead().append(c)}},appendStyleText:function(b){if(this.$.createStyleSheet){var c=this.$.createStyleSheet("");c.cssText=b}else{var a=new CKEDITOR.dom.element("style",this);a.append(new CKEDITOR.dom.text(b,this));this.getHead().append(a)}return c||
a.$.sheet},createElement:function(b,c){var a=new CKEDITOR.dom.element(b,this);if(c){c.attributes&&a.setAttributes(c.attributes);c.styles&&a.setStyles(c.styles)}return a},createText:function(b){return new CKEDITOR.dom.text(b,this)},focus:function(){this.getWindow().focus()},getActive:function(){return new CKEDITOR.dom.element(this.$.activeElement)},getById:function(b){return(b=this.$.getElementById(b))?new CKEDITOR.dom.element(b):null},getByAddress:function(b,c){for(var a=this.$.documentElement,e=
0;a&&e<b.length;e++){var d=b[e];if(c)for(var h=-1,f=0;f<a.childNodes.length;f++){var j=a.childNodes[f];if(!(c===true&&j.nodeType==3&&j.previousSibling&&j.previousSibling.nodeType==3)){h++;if(h==d){a=j;break}}}else a=a.childNodes[d]}return a?new CKEDITOR.dom.node(a):null},getElementsByTag:function(b,c){if((!CKEDITOR.env.ie||document.documentMode>8)&&c)b=c+":"+b;return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(b))},getHead:function(){var b=this.$.getElementsByTagName("head")[0];return b=
b?new CKEDITOR.dom.element(b):this.getDocumentElement().append(new CKEDITOR.dom.element("head"),true)},getBody:function(){return new CKEDITOR.dom.element(this.$.body)},getDocumentElement:function(){return new CKEDITOR.dom.element(this.$.documentElement)},getWindow:function(){return new CKEDITOR.dom.window(this.$.parentWindow||this.$.defaultView)},write:function(b){this.$.open("text/html","replace");CKEDITOR.env.ie&&(b=b.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i,'$&\n<script data-cke-temp="1">('+CKEDITOR.tools.fixDomain+
")();<\/script>"));this.$.write(b);this.$.close()}});CKEDITOR.dom.nodeList=function(b){this.$=b};CKEDITOR.dom.nodeList.prototype={count:function(){return this.$.length},getItem:function(b){if(b<0||b>=this.$.length)return null;return(b=this.$[b])?new CKEDITOR.dom.node(b):null}};CKEDITOR.dom.element=function(b,c){typeof b=="string"&&(b=(c?c.$:document).createElement(b));CKEDITOR.dom.domObject.call(this,b)};
CKEDITOR.dom.element.get=function(b){return(b=typeof b=="string"?document.getElementById(b)||document.getElementsByName(b)[0]:b)&&(b.$?b:new CKEDITOR.dom.element(b))};CKEDITOR.dom.element.prototype=new CKEDITOR.dom.node;CKEDITOR.dom.element.createFromHtml=function(b,c){var a=new CKEDITOR.dom.element("div",c);a.setHtml(b);return a.getFirst().remove()};
CKEDITOR.dom.element.setMarker=function(b,c,a,e){var d=c.getCustomData("list_marker_id")||c.setCustomData("list_marker_id",CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),h=c.getCustomData("list_marker_names")||c.setCustomData("list_marker_names",{}).getCustomData("list_marker_names");b[d]=c;h[a]=1;return c.setCustomData(a,e)};CKEDITOR.dom.element.clearAllMarkers=function(b){for(var c in b)CKEDITOR.dom.element.clearMarkers(b,b[c],1)};
CKEDITOR.dom.element.clearMarkers=function(b,c,a){var e=c.getCustomData("list_marker_names"),d=c.getCustomData("list_marker_id"),h;for(h in e)c.removeCustomData(h);c.removeCustomData("list_marker_names");if(a){c.removeCustomData("list_marker_id");delete b[d]}};
(function(){function b(a){for(var b=0,d=0,h=c[a].length;d<h;d++)b=b+(parseInt(this.getComputedStyle(c[a][d])||0,10)||0);return b}CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype,{type:CKEDITOR.NODE_ELEMENT,addClass:function(a){var b=this.$.className;b&&(RegExp("(?:^|\\s)"+a+"(?:\\s|$)","").test(b)||(b=b+(" "+a)));this.$.className=b||a},removeClass:function(a){var b=this.getAttribute("class");if(b){a=RegExp("(?:^|\\s+)"+a+"(?=\\s|$)","i");if(a.test(b))(b=b.replace(a,"").replace(/^\s+/,""))?this.setAttribute("class",
b):this.removeAttribute("class")}return this},hasClass:function(a){return RegExp("(?:^|\\s+)"+a+"(?=\\s|$)","").test(this.getAttribute("class"))},append:function(a,b){typeof a=="string"&&(a=this.getDocument().createElement(a));b?this.$.insertBefore(a.$,this.$.firstChild):this.$.appendChild(a.$);return a},appendHtml:function(a){if(this.$.childNodes.length){var b=new CKEDITOR.dom.element("div",this.getDocument());b.setHtml(a);b.moveChildren(this)}else this.setHtml(a)},appendText:function(a){this.$.text!=
void 0?this.$.text=this.$.text+a:this.append(new CKEDITOR.dom.text(a))},appendBogus:function(){for(var a=this.getLast();a&&a.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.rtrim(a.getText());)a=a.getPrevious();if(!a||!a.is||!a.is("br")){a=CKEDITOR.env.opera?this.getDocument().createText(""):this.getDocument().createElement("br");CKEDITOR.env.gecko&&a.setAttribute("type","_moz");this.append(a)}},breakParent:function(a){var b=new CKEDITOR.dom.range(this.getDocument());b.setStartAfter(this);b.setEndAfter(a);
a=b.extractContents();b.insertNode(this.remove());a.insertAfterNode(this)},contains:CKEDITOR.env.ie||CKEDITOR.env.webkit?function(a){var b=this.$;return a.type!=CKEDITOR.NODE_ELEMENT?b.contains(a.getParent().$):b!=a.$&&b.contains(a.$)}:function(a){return!!(this.$.compareDocumentPosition(a.$)&16)},focus:function(){function a(){try{this.$.focus()}catch(a){}}return function(b){b?CKEDITOR.tools.setTimeout(a,100,this):a.call(this)}}(),getHtml:function(){var a=this.$.innerHTML;return CKEDITOR.env.ie?a.replace(/<\?[^>]*>/g,
""):a},getOuterHtml:function(){if(this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/,"");var a=this.$.ownerDocument.createElement("div");a.appendChild(this.$.cloneNode(true));return a.innerHTML},getClientRect:function(){var a=CKEDITOR.tools.extend({},this.$.getBoundingClientRect());!a.width&&(a.width=a.right-a.left);!a.height&&(a.height=a.bottom-a.top);return a},setHtml:function(){var a=function(a){return this.$.innerHTML=a};return CKEDITOR.env.ie&&CKEDITOR.env.version<9?function(a){try{return this.$.innerHTML=
a}catch(b){this.$.innerHTML="";var c=new CKEDITOR.dom.element("body",this.getDocument());c.$.innerHTML=a;for(c=c.getChildren();c.count();)this.append(c.getItem(0));return a}}:a}(),setText:function(a){CKEDITOR.dom.element.prototype.setText=this.$.innerText!=void 0?function(a){return this.$.innerText=a}:function(a){return this.$.textContent=a};return this.setText(a)},getAttribute:function(){var a=function(a){return this.$.getAttribute(a,2)};return CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)?
function(a){switch(a){case "class":a="className";break;case "http-equiv":a="httpEquiv";break;case "name":return this.$.name;case "tabindex":a=this.$.getAttribute(a,2);a!==0&&this.$.tabIndex===0&&(a=null);return a;case "checked":a=this.$.attributes.getNamedItem(a);return(a.specified?a.nodeValue:this.$.checked)?"checked":null;case "hspace":case "value":return this.$[a];case "style":return this.$.style.cssText;case "contenteditable":case "contentEditable":return this.$.attributes.getNamedItem("contentEditable").specified?
this.$.getAttribute("contentEditable"):null}return this.$.getAttribute(a,2)}:a}(),getChildren:function(){return new CKEDITOR.dom.nodeList(this.$.childNodes)},getComputedStyle:CKEDITOR.env.ie?function(a){return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]}:function(a){var b=this.getWindow().$.getComputedStyle(this.$,null);return b?b.getPropertyValue(a):""},getDtd:function(){var a=CKEDITOR.dtd[this.getName()];this.getDtd=function(){return a};return a},getElementsByTag:CKEDITOR.dom.document.prototype.getElementsByTag,
getTabIndex:CKEDITOR.env.ie?function(){var a=this.$.tabIndex;a===0&&(!CKEDITOR.dtd.$tabIndex[this.getName()]&&parseInt(this.getAttribute("tabindex"),10)!==0)&&(a=-1);return a}:CKEDITOR.env.webkit?function(){var a=this.$.tabIndex;if(a==void 0){a=parseInt(this.getAttribute("tabindex"),10);isNaN(a)&&(a=-1)}return a}:function(){return this.$.tabIndex},getText:function(){return this.$.textContent||this.$.innerText||""},getWindow:function(){return this.getDocument().getWindow()},getId:function(){return this.$.id||
null},getNameAtt:function(){return this.$.name||null},getName:function(){var a=this.$.nodeName.toLowerCase();if(CKEDITOR.env.ie&&!(document.documentMode>8)){var b=this.$.scopeName;b!="HTML"&&(a=b.toLowerCase()+":"+a)}return(this.getName=function(){return a})()},getValue:function(){return this.$.value},getFirst:function(a){var b=this.$.firstChild;(b=b&&new CKEDITOR.dom.node(b))&&(a&&!a(b))&&(b=b.getNext(a));return b},getLast:function(a){var b=this.$.lastChild;(b=b&&new CKEDITOR.dom.node(b))&&(a&&!a(b))&&
(b=b.getPrevious(a));return b},getStyle:function(a){return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]},is:function(){var a=this.getName();if(typeof arguments[0]=="object")return!!arguments[0][a];for(var b=0;b<arguments.length;b++)if(arguments[b]==a)return true;return false},isEditable:function(a){var b=this.getName();if(this.isReadOnly()||this.getComputedStyle("display")=="none"||this.getComputedStyle("visibility")=="hidden"||CKEDITOR.dtd.$nonEditable[b]||CKEDITOR.dtd.$empty[b]||this.is("a")&&
(this.data("cke-saved-name")||this.hasAttribute("name"))&&!this.getChildCount())return false;if(a!==false){a=CKEDITOR.dtd[b]||CKEDITOR.dtd.span;return!(!a||!a["#"])}return true},isIdentical:function(a){var b=this.clone(0,1),a=a.clone(0,1);b.removeAttributes(["_moz_dirty","data-cke-expando","data-cke-saved-href","data-cke-saved-name"]);a.removeAttributes(["_moz_dirty","data-cke-expando","data-cke-saved-href","data-cke-saved-name"]);if(b.$.isEqualNode){b.$.style.cssText=CKEDITOR.tools.normalizeCssText(b.$.style.cssText);
a.$.style.cssText=CKEDITOR.tools.normalizeCssText(a.$.style.cssText);return b.$.isEqualNode(a.$)}b=b.getOuterHtml();a=a.getOuterHtml();if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&this.is("a")){var d=this.getParent();if(d.type==CKEDITOR.NODE_ELEMENT){d=d.clone();d.setHtml(b);b=d.getHtml();d.setHtml(a);a=d.getHtml()}}return b==a},isVisible:function(){var a=(this.$.offsetHeight||this.$.offsetWidth)&&this.getComputedStyle("visibility")!="hidden",b,d;if(a&&(CKEDITOR.env.webkit||CKEDITOR.env.opera)){b=
this.getWindow();if(!b.equals(CKEDITOR.document.getWindow())&&(d=b.$.frameElement))a=(new CKEDITOR.dom.element(d)).isVisible()}return!!a},isEmptyInlineRemoveable:function(){if(!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;for(var a=this.getChildren(),b=0,d=a.count();b<d;b++){var c=a.getItem(b);if(!(c.type==CKEDITOR.NODE_ELEMENT&&c.data("cke-bookmark"))&&(c.type==CKEDITOR.NODE_ELEMENT&&!c.isEmptyInlineRemoveable()||c.type==CKEDITOR.NODE_TEXT&&CKEDITOR.tools.trim(c.getText())))return false}return true},
hasAttributes:CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)?function(){for(var a=this.$.attributes,b=0;b<a.length;b++){var d=a[b];switch(d.nodeName){case "class":if(this.getAttribute("class"))return true;case "data-cke-expando":continue;default:if(d.specified)return true}}return false}:function(){var a=this.$.attributes,b=a.length,d={"data-cke-expando":1,_moz_dirty:1};return b>0&&(b>2||!d[a[0].nodeName]||b==2&&!d[a[1].nodeName])},hasAttribute:function(){function a(a){a=this.$.attributes.getNamedItem(a);
return!(!a||!a.specified)}return CKEDITOR.env.ie&&CKEDITOR.env.version<8?function(b){return b=="name"?!!this.$.name:a.call(this,b)}:a}(),hide:function(){this.setStyle("display","none")},moveChildren:function(a,b){var d=this.$,a=a.$;if(d!=a){var c;if(b)for(;c=d.lastChild;)a.insertBefore(d.removeChild(c),a.firstChild);else for(;c=d.firstChild;)a.appendChild(d.removeChild(c))}},mergeSiblings:function(){function a(a,b,c){if(b&&b.type==CKEDITOR.NODE_ELEMENT){for(var f=[];b.data("cke-bookmark")||b.isEmptyInlineRemoveable();){f.push(b);
b=c?b.getNext():b.getPrevious();if(!b||b.type!=CKEDITOR.NODE_ELEMENT)return}if(a.isIdentical(b)){for(var j=c?a.getLast():a.getFirst();f.length;)f.shift().move(a,!c);b.moveChildren(a,!c);b.remove();j&&j.type==CKEDITOR.NODE_ELEMENT&&j.mergeSiblings()}}}return function(b){if(b===false||CKEDITOR.dtd.$removeEmpty[this.getName()]||this.is("a")){a(this,this.getNext(),true);a(this,this.getPrevious())}}}(),show:function(){this.setStyles({display:"",visibility:""})},setAttribute:function(){var a=function(a,
b){this.$.setAttribute(a,b);return this};return CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)?function(b,c){b=="class"?this.$.className=c:b=="style"?this.$.style.cssText=c:b=="tabindex"?this.$.tabIndex=c:b=="checked"?this.$.checked=c:b=="contenteditable"?a.call(this,"contentEditable",c):a.apply(this,arguments);return this}:CKEDITOR.env.ie8Compat&&CKEDITOR.env.secure?function(b,c){if(b=="src"&&c.match(/^http:\/\//))try{a.apply(this,arguments)}catch(h){}else a.apply(this,arguments);
return this}:a}(),setAttributes:function(a){for(var b in a)this.setAttribute(b,a[b]);return this},setValue:function(a){this.$.value=a;return this},removeAttribute:function(){var a=function(a){this.$.removeAttribute(a)};return CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)?function(a){a=="class"?a="className":a=="tabindex"?a="tabIndex":a=="contenteditable"&&(a="contentEditable");this.$.removeAttribute(a)}:a}(),removeAttributes:function(a){if(CKEDITOR.tools.isArray(a))for(var b=0;b<
a.length;b++)this.removeAttribute(a[b]);else for(b in a)a.hasOwnProperty(b)&&this.removeAttribute(b)},removeStyle:function(a){var b=this.$.style;if(!b.removeProperty&&(a=="border"||a=="margin"||a=="padding")){var c=["top","left","right","bottom"],h;a=="border"&&(h=["color","style","width"]);for(var b=[],f=0;f<c.length;f++)if(h)for(var j=0;j<h.length;j++)b.push([a,c[f],h[j]].join("-"));else b.push([a,c[f]].join("-"));for(a=0;a<b.length;a++)this.removeStyle(b[a])}else{b.removeProperty?b.removeProperty(a):
b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));this.$.style.cssText||this.removeAttribute("style")}},setStyle:function(a,b){this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]=b;return this},setStyles:function(a){for(var b in a)this.setStyle(b,a[b]);return this},setOpacity:function(a){if(CKEDITOR.env.ie&&CKEDITOR.env.version<9){a=Math.round(a*100);this.setStyle("filter",a>=100?"":"progid:DXImageTransform.Microsoft.Alpha(opacity="+a+")")}else this.setStyle("opacity",a)},unselectable:function(){this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select",
"none"));if(CKEDITOR.env.ie||CKEDITOR.env.opera){this.setAttribute("unselectable","on");for(var a,b=this.getElementsByTag("*"),c=0,h=b.count();c<h;c++){a=b.getItem(c);a.setAttribute("unselectable","on")}}},getPositionedAncestor:function(){for(var a=this;a.getName()!="html";){if(a.getComputedStyle("position")!="static")return a;a=a.getParent()}return null},getDocumentPosition:function(a){var b=0,c=0,h=this.getDocument(),f=h.getBody(),j=h.$.compatMode=="BackCompat";if(document.documentElement.getBoundingClientRect){var i=
this.$.getBoundingClientRect(),l=h.$.documentElement,n=l.clientTop||f.$.clientTop||0,o=l.clientLeft||f.$.clientLeft||0,q=true;if(CKEDITOR.env.ie){q=h.getDocumentElement().contains(this);h=h.getBody().contains(this);q=j&&h||!j&&q}if(q){b=i.left+(!j&&l.scrollLeft||f.$.scrollLeft);b=b-o;c=i.top+(!j&&l.scrollTop||f.$.scrollTop);c=c-n}}else{f=this;for(h=null;f&&!(f.getName()=="body"||f.getName()=="html");){b=b+(f.$.offsetLeft-f.$.scrollLeft);c=c+(f.$.offsetTop-f.$.scrollTop);if(!f.equals(this)){b=b+(f.$.clientLeft||
0);c=c+(f.$.clientTop||0)}for(;h&&!h.equals(f);){b=b-h.$.scrollLeft;c=c-h.$.scrollTop;h=h.getParent()}h=f;f=(i=f.$.offsetParent)?new CKEDITOR.dom.element(i):null}}if(a){f=this.getWindow();h=a.getWindow();if(!f.equals(h)&&f.$.frameElement){a=(new CKEDITOR.dom.element(f.$.frameElement)).getDocumentPosition(a);b=b+a.x;c=c+a.y}}if(!document.documentElement.getBoundingClientRect&&CKEDITOR.env.gecko&&!j){b=b+(this.$.clientLeft?1:0);c=c+(this.$.clientTop?1:0)}return{x:b,y:c}},scrollIntoView:function(a){var b=
this.getParent();if(b){do{(b.$.clientWidth&&b.$.clientWidth<b.$.scrollWidth||b.$.clientHeight&&b.$.clientHeight<b.$.scrollHeight)&&!b.is("body")&&this.scrollIntoParent(b,a,1);if(b.is("html")){var c=b.getWindow();try{var h=c.$.frameElement;h&&(b=new CKEDITOR.dom.element(h))}catch(f){}}}while(b=b.getParent())}},scrollIntoParent:function(a,b,c){var h,f,j,i;function l(b,g){if(/body|html/.test(a.getName()))a.getWindow().$.scrollBy(b,g);else{a.$.scrollLeft=a.$.scrollLeft+b;a.$.scrollTop=a.$.scrollTop+g}}
function n(a,b){var g={x:0,y:0};if(!a.is(q?"body":"html")){var c=a.$.getBoundingClientRect();g.x=c.left;g.y=c.top}c=a.getWindow();if(!c.equals(b)){c=n(CKEDITOR.dom.element.get(c.$.frameElement),b);g.x=g.x+c.x;g.y=g.y+c.y}return g}function o(a,b){return parseInt(a.getComputedStyle("margin-"+b)||0,10)||0}!a&&(a=this.getWindow());j=a.getDocument();var q=j.$.compatMode=="BackCompat";a instanceof CKEDITOR.dom.window&&(a=q?j.getBody():j.getDocumentElement());j=a.getWindow();f=n(this,j);var k=n(a,j),g=this.$.offsetHeight;
h=this.$.offsetWidth;var p=a.$.clientHeight,v=a.$.clientWidth;j=f.x-o(this,"left")-k.x||0;i=f.y-o(this,"top")-k.y||0;h=f.x+h+o(this,"right")-(k.x+v)||0;f=f.y+g+o(this,"bottom")-(k.y+p)||0;if(i<0||f>0)l(0,b===true?i:b===false?f:i<0?i:f);if(c&&(j<0||h>0))l(j<0?j:h,0)},setState:function(a,b,c){b=b||"cke";switch(a){case CKEDITOR.TRISTATE_ON:this.addClass(b+"_on");this.removeClass(b+"_off");this.removeClass(b+"_disabled");c&&this.setAttribute("aria-pressed",true);c&&this.removeAttribute("aria-disabled");
break;case CKEDITOR.TRISTATE_DISABLED:this.addClass(b+"_disabled");this.removeClass(b+"_off");this.removeClass(b+"_on");c&&this.setAttribute("aria-disabled",true);c&&this.removeAttribute("aria-pressed");break;default:this.addClass(b+"_off");this.removeClass(b+"_on");this.removeClass(b+"_disabled");c&&this.removeAttribute("aria-pressed");c&&this.removeAttribute("aria-disabled")}},getFrameDocument:function(){var a=this.$;try{a.contentWindow.document}catch(b){a.src=a.src}return a&&new CKEDITOR.dom.document(a.contentWindow.document)},
copyAttributes:function(a,b){for(var c=this.$.attributes,b=b||{},h=0;h<c.length;h++){var f=c[h],j=f.nodeName.toLowerCase(),i;if(!(j in b))if(j=="checked"&&(i=this.getAttribute(j)))a.setAttribute(j,i);else if(f.specified||CKEDITOR.env.ie&&f.nodeValue&&j=="value"){i=this.getAttribute(j);if(i===null)i=f.nodeValue;a.setAttribute(j,i)}}if(this.$.style.cssText!=="")a.$.style.cssText=this.$.style.cssText},renameNode:function(a){if(this.getName()!=a){var b=this.getDocument(),a=new CKEDITOR.dom.element(a,
b);this.copyAttributes(a);this.moveChildren(a);this.getParent()&&this.$.parentNode.replaceChild(a.$,this.$);a.$["data-cke-expando"]=this.$["data-cke-expando"];this.$=a.$}},getChild:function(){function a(a,b){var c=a.childNodes;if(b>=0&&b<c.length)return c[b]}return function(b){var c=this.$;if(b.slice)for(;b.length>0&&c;)c=a(c,b.shift());else c=a(c,b);return c?new CKEDITOR.dom.node(c):null}}(),getChildCount:function(){return this.$.childNodes.length},disableContextMenu:function(){this.on("contextmenu",
function(a){a.data.getTarget().hasClass("cke_enable_context_menu")||a.data.preventDefault()})},getDirection:function(a){return a?this.getComputedStyle("direction")||this.getDirection()||this.getParent()&&this.getParent().getDirection(1)||this.getDocument().$.dir||"ltr":this.getStyle("direction")||this.getAttribute("dir")},data:function(a,b){a="data-"+a;if(b===void 0)return this.getAttribute(a);b===false?this.removeAttribute(a):this.setAttribute(a,b);return null},getEditor:function(){var a=CKEDITOR.instances,
b,c;for(b in a){c=a[b];if(c.element.equals(this)&&c.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO)return c}return null}});var c={width:["border-left-width","border-right-width","padding-left","padding-right"],height:["border-top-width","border-bottom-width","padding-top","padding-bottom"]};CKEDITOR.dom.element.prototype.setSize=function(a,c,d){if(typeof c=="number"){if(d&&(!CKEDITOR.env.ie||!CKEDITOR.env.quirks))c=c-b.call(this,a);this.setStyle(a,c+"px")}};CKEDITOR.dom.element.prototype.getSize=function(a,
c){var d=Math.max(this.$["offset"+CKEDITOR.tools.capitalize(a)],this.$["client"+CKEDITOR.tools.capitalize(a)])||0;c&&(d=d-b.call(this,a));return d}})();CKEDITOR.dom.documentFragment=function(b){b=b||CKEDITOR.document;this.$=b.type==CKEDITOR.NODE_DOCUMENT?b.$.createDocumentFragment():b};
CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype,CKEDITOR.dom.element.prototype,{type:CKEDITOR.NODE_DOCUMENT_FRAGMENT,insertAfterNode:function(b){b=b.$;b.parentNode.insertBefore(this.$,b.nextSibling)}},!0,{append:1,appendBogus:1,getFirst:1,getLast:1,getParent:1,getNext:1,getPrevious:1,appendTo:1,moveChildren:1,insertBefore:1,insertAfterNode:1,replace:1,trim:1,type:1,ltrim:1,rtrim:1,getDocument:1,getChildCount:1,getChild:1,getChildren:1});
(function(){function b(a,b){var c=this.range;if(this._.end)return null;if(!this._.start){this._.start=1;if(c.collapsed){this.end();return null}c.optimize()}var d,n=c.startContainer;d=c.endContainer;var o=c.startOffset,e=c.endOffset,k,g=this.guard,p=this.type,h=a?"getPreviousSourceNode":"getNextSourceNode";if(!a&&!this._.guardLTR){var u=d.type==CKEDITOR.NODE_ELEMENT?d:d.getParent(),m=d.type==CKEDITOR.NODE_ELEMENT?d.getChild(e):d.getNext();this._.guardLTR=function(a,b){return(!b||!u.equals(a))&&(!m||
!a.equals(m))&&(a.type!=CKEDITOR.NODE_ELEMENT||!b||!a.equals(c.root))}}if(a&&!this._.guardRTL){var E=n.type==CKEDITOR.NODE_ELEMENT?n:n.getParent(),A=n.type==CKEDITOR.NODE_ELEMENT?o?n.getChild(o-1):null:n.getPrevious();this._.guardRTL=function(a,b){return(!b||!E.equals(a))&&(!A||!a.equals(A))&&(a.type!=CKEDITOR.NODE_ELEMENT||!b||!a.equals(c.root))}}var r=a?this._.guardRTL:this._.guardLTR;k=g?function(a,b){return r(a,b)===false?false:g(a,b)}:r;if(this.current)d=this.current[h](false,p,k);else{if(a)d.type==
CKEDITOR.NODE_ELEMENT&&(d=e>0?d.getChild(e-1):k(d,true)===false?null:d.getPreviousSourceNode(true,p,k));else{d=n;if(d.type==CKEDITOR.NODE_ELEMENT&&!(d=d.getChild(o)))d=k(n,true)===false?null:n.getNextSourceNode(true,p,k)}d&&k(d)===false&&(d=null)}for(;d&&!this._.end;){this.current=d;if(!this.evaluator||this.evaluator(d)!==false){if(!b)return d}else if(b&&this.evaluator)return false;d=d[h](false,p,k)}this.end();return this.current=null}function c(a){for(var c,d=null;c=b.call(this,a);)d=c;return d}
CKEDITOR.dom.walker=CKEDITOR.tools.createClass({$:function(a){this.range=a;this._={}},proto:{end:function(){this._.end=1},next:function(){return b.call(this)},previous:function(){return b.call(this,1)},checkForward:function(){return b.call(this,0,1)!==false},checkBackward:function(){return b.call(this,1,1)!==false},lastForward:function(){return c.call(this)},lastBackward:function(){return c.call(this,1)},reset:function(){delete this.current;this._={}}}});var a={block:1,"list-item":1,table:1,"table-row-group":1,
"table-header-group":1,"table-footer-group":1,"table-row":1,"table-column-group":1,"table-column":1,"table-cell":1,"table-caption":1};CKEDITOR.dom.element.prototype.isBlockBoundary=function(b){b=b?CKEDITOR.tools.extend({},CKEDITOR.dtd.$block,b||{}):CKEDITOR.dtd.$block;return this.getComputedStyle("float")=="none"&&a[this.getComputedStyle("display")]||b[this.getName()]};CKEDITOR.dom.walker.blockBoundary=function(a){return function(b){return!(b.type==CKEDITOR.NODE_ELEMENT&&b.isBlockBoundary(a))}};CKEDITOR.dom.walker.listItemBoundary=
function(){return this.blockBoundary({br:1})};CKEDITOR.dom.walker.bookmark=function(a,b){function c(a){return a&&a.getName&&a.getName()=="span"&&a.data("cke-bookmark")}return function(d){var n,o;n=d&&d.type!=CKEDITOR.NODE_ELEMENT&&(o=d.getParent())&&c(o);n=a?n:n||c(d);return!!(b^n)}};CKEDITOR.dom.walker.whitespaces=function(a){return function(b){var c;b&&b.type==CKEDITOR.NODE_TEXT&&(c=!CKEDITOR.tools.trim(b.getText())||CKEDITOR.env.webkit&&b.getText()=="​");return!!(a^c)}};CKEDITOR.dom.walker.invisible=
function(a){var b=CKEDITOR.dom.walker.whitespaces();return function(c){if(b(c))c=1;else{c.type==CKEDITOR.NODE_TEXT&&(c=c.getParent());c=!c.$.offsetHeight}return!!(a^c)}};CKEDITOR.dom.walker.nodeType=function(a,b){return function(c){return!!(b^c.type==a)}};CKEDITOR.dom.walker.bogus=function(a){function b(a){return!d(a)&&!h(a)}return function(c){var d=!CKEDITOR.env.ie?c.is&&c.is("br"):c.getText&&e.test(c.getText());if(d){d=c.getParent();c=c.getNext(b);d=d.isBlockBoundary()&&(!c||c.type==CKEDITOR.NODE_ELEMENT&&
c.isBlockBoundary())}return!!(a^d)}};var e=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/,d=CKEDITOR.dom.walker.whitespaces(),h=CKEDITOR.dom.walker.bookmark();CKEDITOR.dom.element.prototype.getBogus=function(){var a=this;do a=a.getPreviousSourceNode();while(h(a)||d(a)||a.type==CKEDITOR.NODE_ELEMENT&&a.getName()in CKEDITOR.dtd.$inline&&!(a.getName()in CKEDITOR.dtd.$empty));return a&&(!CKEDITOR.env.ie?a.is&&a.is("br"):a.getText&&e.test(a.getText()))?a:false}})();
CKEDITOR.dom.range=function(b){this.endOffset=this.endContainer=this.startOffset=this.startContainer=null;this.collapsed=true;var c=b instanceof CKEDITOR.dom.document;this.document=c?b:b.getDocument();this.root=c?b.getBody():b};
(function(){function b(){var a=false,b=CKEDITOR.dom.walker.whitespaces(),c=CKEDITOR.dom.walker.bookmark(true),k=CKEDITOR.dom.walker.bogus();return function(g){if(c(g)||b(g))return true;if(k(g)&&!a)return a=true;return g.type==CKEDITOR.NODE_TEXT&&(g.hasAscendant("pre")||CKEDITOR.tools.trim(g.getText()).length)||g.type==CKEDITOR.NODE_ELEMENT&&!g.is(h)?false:true}}function c(a){var b=CKEDITOR.dom.walker.whitespaces(),c=CKEDITOR.dom.walker.bookmark(1);return function(k){return c(k)||b(k)?true:!a&&f(k)||
k.type==CKEDITOR.NODE_ELEMENT&&k.is(CKEDITOR.dtd.$removeEmpty)}}function a(a){return!j(a)&&!i(a)}var e=function(a){a.collapsed=a.startContainer&&a.endContainer&&a.startContainer.equals(a.endContainer)&&a.startOffset==a.endOffset},d=function(a,b,c,k){a.optimizeBookmark();var g=a.startContainer,d=a.endContainer,e=a.startOffset,h=a.endOffset,f,i;if(d.type==CKEDITOR.NODE_TEXT)d=d.split(h);else if(d.getChildCount()>0)if(h>=d.getChildCount()){d=d.append(a.document.createText(""));i=true}else d=d.getChild(h);
if(g.type==CKEDITOR.NODE_TEXT){g.split(e);g.equals(d)&&(d=g.getNext())}else if(e)if(e>=g.getChildCount()){g=g.append(a.document.createText(""));f=true}else g=g.getChild(e).getPrevious();else{g=g.append(a.document.createText(""),1);f=true}var e=g.getParents(),h=d.getParents(),j,r,x;for(j=0;j<e.length;j++){r=e[j];x=h[j];if(!r.equals(x))break}for(var l=c,s,C,y,t=j;t<e.length;t++){s=e[t];l&&!s.equals(g)&&(C=l.append(s.clone()));for(s=s.getNext();s;){if(s.equals(h[t])||s.equals(d))break;y=s.getNext();
if(b==2)l.append(s.clone(true));else{s.remove();b==1&&l.append(s)}s=y}l&&(l=C)}l=c;for(c=j;c<h.length;c++){s=h[c];b>0&&!s.equals(d)&&(C=l.append(s.clone()));if(!e[c]||s.$.parentNode!=e[c].$.parentNode)for(s=s.getPrevious();s;){if(s.equals(e[c])||s.equals(g))break;y=s.getPrevious();if(b==2)l.$.insertBefore(s.$.cloneNode(true),l.$.firstChild);else{s.remove();b==1&&l.$.insertBefore(s.$,l.$.firstChild)}s=y}l&&(l=C)}if(b==2){r=a.startContainer;if(r.type==CKEDITOR.NODE_TEXT){r.$.data=r.$.data+r.$.nextSibling.data;
r.$.parentNode.removeChild(r.$.nextSibling)}a=a.endContainer;if(a.type==CKEDITOR.NODE_TEXT&&a.$.nextSibling){a.$.data=a.$.data+a.$.nextSibling.data;a.$.parentNode.removeChild(a.$.nextSibling)}}else{if(r&&x&&(g.$.parentNode!=r.$.parentNode||d.$.parentNode!=x.$.parentNode)){b=x.getIndex();f&&x.$.parentNode==g.$.parentNode&&b--;if(k&&r.type==CKEDITOR.NODE_ELEMENT){k=CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',a.document);k.insertAfter(r);r.mergeSiblings(false);
a.moveToBookmark({startNode:k})}else a.setStart(x.getParent(),b)}a.collapse(true)}f&&g.remove();i&&d.$.parentNode&&d.remove()},h={abbr:1,acronym:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,"var":1},f=CKEDITOR.dom.walker.bogus(),j=new CKEDITOR.dom.walker.whitespaces,i=new CKEDITOR.dom.walker.bookmark,l=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/;CKEDITOR.dom.range.prototype={clone:function(){var a=new CKEDITOR.dom.range(this.root);
a.startContainer=this.startContainer;a.startOffset=this.startOffset;a.endContainer=this.endContainer;a.endOffset=this.endOffset;a.collapsed=this.collapsed;return a},collapse:function(a){if(a){this.endContainer=this.startContainer;this.endOffset=this.startOffset}else{this.startContainer=this.endContainer;this.startOffset=this.endOffset}this.collapsed=true},cloneContents:function(){var a=new CKEDITOR.dom.documentFragment(this.document);this.collapsed||d(this,2,a);return a},deleteContents:function(a){this.collapsed||
d(this,0,null,a)},extractContents:function(a){var b=new CKEDITOR.dom.documentFragment(this.document);this.collapsed||d(this,1,b,a);return b},createBookmark:function(a){var b,c,d,g,p=this.collapsed;b=this.document.createElement("span");b.data("cke-bookmark",1);b.setStyle("display","none");b.setHtml("&nbsp;");if(a){d="cke_bm_"+CKEDITOR.tools.getNextNumber();b.setAttribute("id",d+(p?"C":"S"))}if(!p){c=b.clone();c.setHtml("&nbsp;");a&&c.setAttribute("id",d+"E");g=this.clone();g.collapse();g.insertNode(c)}g=
this.clone();g.collapse(true);g.insertNode(b);if(c){this.setStartAfter(b);this.setEndBefore(c)}else this.moveToPosition(b,CKEDITOR.POSITION_AFTER_END);return{startNode:a?d+(p?"C":"S"):b,endNode:a?d+"E":c,serializable:a,collapsed:p}},createBookmark2:function(a){var b=this.startContainer,c=this.endContainer,d=this.startOffset,g=this.endOffset,p=this.collapsed,e,h;if(!b||!c)return{start:0,end:0};if(a){if(b.type==CKEDITOR.NODE_ELEMENT){if((e=b.getChild(d))&&e.type==CKEDITOR.NODE_TEXT&&d>0&&e.getPrevious().type==
CKEDITOR.NODE_TEXT){b=e;d=0}e&&e.type==CKEDITOR.NODE_ELEMENT&&(d=e.getIndex(1))}for(;b.type==CKEDITOR.NODE_TEXT&&(h=b.getPrevious())&&h.type==CKEDITOR.NODE_TEXT;){b=h;d=d+h.getLength()}if(!p){if(c.type==CKEDITOR.NODE_ELEMENT){if((e=c.getChild(g))&&e.type==CKEDITOR.NODE_TEXT&&g>0&&e.getPrevious().type==CKEDITOR.NODE_TEXT){c=e;g=0}e&&e.type==CKEDITOR.NODE_ELEMENT&&(g=e.getIndex(1))}for(;c.type==CKEDITOR.NODE_TEXT&&(h=c.getPrevious())&&h.type==CKEDITOR.NODE_TEXT;){c=h;g=g+h.getLength()}}}return{start:b.getAddress(a),
end:p?null:c.getAddress(a),startOffset:d,endOffset:g,normalized:a,collapsed:p,is2:true}},moveToBookmark:function(a){if(a.is2){var b=this.document.getByAddress(a.start,a.normalized),c=a.startOffset,d=a.end&&this.document.getByAddress(a.end,a.normalized),a=a.endOffset;this.setStart(b,c);d?this.setEnd(d,a):this.collapse(true)}else{b=(c=a.serializable)?this.document.getById(a.startNode):a.startNode;a=c?this.document.getById(a.endNode):a.endNode;this.setStartBefore(b);b.remove();if(a){this.setEndBefore(a);
a.remove()}else this.collapse(true)}},getBoundaryNodes:function(){var a=this.startContainer,b=this.endContainer,c=this.startOffset,d=this.endOffset,g;if(a.type==CKEDITOR.NODE_ELEMENT){g=a.getChildCount();if(g>c)a=a.getChild(c);else if(g<1)a=a.getPreviousSourceNode();else{for(a=a.$;a.lastChild;)a=a.lastChild;a=new CKEDITOR.dom.node(a);a=a.getNextSourceNode()||a}}if(b.type==CKEDITOR.NODE_ELEMENT){g=b.getChildCount();if(g>d)b=b.getChild(d).getPreviousSourceNode(true);else if(g<1)b=b.getPreviousSourceNode();
else{for(b=b.$;b.lastChild;)b=b.lastChild;b=new CKEDITOR.dom.node(b)}}a.getPosition(b)&CKEDITOR.POSITION_FOLLOWING&&(a=b);return{startNode:a,endNode:b}},getCommonAncestor:function(a,b){var c=this.startContainer,d=this.endContainer,c=c.equals(d)?a&&c.type==CKEDITOR.NODE_ELEMENT&&this.startOffset==this.endOffset-1?c.getChild(this.startOffset):c:c.getCommonAncestor(d);return b&&!c.is?c.getParent():c},optimize:function(){var a=this.startContainer,b=this.startOffset;a.type!=CKEDITOR.NODE_ELEMENT&&(b?b>=
a.getLength()&&this.setStartAfter(a):this.setStartBefore(a));a=this.endContainer;b=this.endOffset;a.type!=CKEDITOR.NODE_ELEMENT&&(b?b>=a.getLength()&&this.setEndAfter(a):this.setEndBefore(a))},optimizeBookmark:function(){var a=this.startContainer,b=this.endContainer;a.is&&(a.is("span")&&a.data("cke-bookmark"))&&this.setStartAt(a,CKEDITOR.POSITION_BEFORE_START);b&&(b.is&&b.is("span")&&b.data("cke-bookmark"))&&this.setEndAt(b,CKEDITOR.POSITION_AFTER_END)},trim:function(a,b){var c=this.startContainer,
d=this.startOffset,g=this.collapsed;if((!a||g)&&c&&c.type==CKEDITOR.NODE_TEXT){if(d)if(d>=c.getLength()){d=c.getIndex()+1;c=c.getParent()}else{var e=c.split(d),d=c.getIndex()+1,c=c.getParent();if(this.startContainer.equals(this.endContainer))this.setEnd(e,this.endOffset-this.startOffset);else if(c.equals(this.endContainer))this.endOffset=this.endOffset+1}else{d=c.getIndex();c=c.getParent()}this.setStart(c,d);if(g){this.collapse(true);return}}c=this.endContainer;d=this.endOffset;if(!b&&!g&&c&&c.type==
CKEDITOR.NODE_TEXT){if(d){d>=c.getLength()||c.split(d);d=c.getIndex()+1}else d=c.getIndex();c=c.getParent();this.setEnd(c,d)}},enlarge:function(a,b){switch(a){case CKEDITOR.ENLARGE_INLINE:var c=1;case CKEDITOR.ENLARGE_ELEMENT:if(this.collapsed)break;var d=this.getCommonAncestor(),g=this.root,e,h,f,m,i,j=false,r,x;r=this.startContainer;x=this.startOffset;if(r.type==CKEDITOR.NODE_TEXT){if(x){r=!CKEDITOR.tools.trim(r.substring(0,x)).length&&r;j=!!r}if(r&&!(m=r.getPrevious()))f=r.getParent()}else{x&&
(m=r.getChild(x-1)||r.getLast());m||(f=r)}for(;f||m;){if(f&&!m){!i&&f.equals(d)&&(i=true);if(c?f.isBlockBoundary():!g.contains(f))break;if(!j||f.getComputedStyle("display")!="inline"){j=false;i?e=f:this.setStartBefore(f)}m=f.getPrevious()}for(;m;){r=false;if(m.type==CKEDITOR.NODE_COMMENT)m=m.getPrevious();else{if(m.type==CKEDITOR.NODE_TEXT){x=m.getText();/[^\s\ufeff]/.test(x)&&(m=null);r=/[\s\ufeff]$/.test(x)}else if((m.$.offsetWidth>0||b&&m.is("br"))&&!m.data("cke-bookmark"))if(j&&CKEDITOR.dtd.$removeEmpty[m.getName()]){x=
m.getText();if(/[^\s\ufeff]/.test(x))m=null;else for(var l=m.$.getElementsByTagName("*"),s=0,C;C=l[s++];)if(!CKEDITOR.dtd.$removeEmpty[C.nodeName.toLowerCase()]){m=null;break}m&&(r=!!x.length)}else m=null;r&&(j?i?e=f:f&&this.setStartBefore(f):j=true);if(m){r=m.getPrevious();if(!f&&!r){f=m;m=null;break}m=r}else f=null}}f&&(f=f.getParent())}r=this.endContainer;x=this.endOffset;f=m=null;i=j=false;if(r.type==CKEDITOR.NODE_TEXT){r=!CKEDITOR.tools.trim(r.substring(x)).length&&r;j=!(r&&r.getLength());if(r&&
!(m=r.getNext()))f=r.getParent()}else(m=r.getChild(x))||(f=r);for(;f||m;){if(f&&!m){!i&&f.equals(d)&&(i=true);if(c?f.isBlockBoundary():!g.contains(f))break;if(!j||f.getComputedStyle("display")!="inline"){j=false;i?h=f:f&&this.setEndAfter(f)}m=f.getNext()}for(;m;){r=false;if(m.type==CKEDITOR.NODE_TEXT){x=m.getText();/[^\s\ufeff]/.test(x)&&(m=null);r=/^[\s\ufeff]/.test(x)}else if(m.type==CKEDITOR.NODE_ELEMENT){if((m.$.offsetWidth>0||b&&m.is("br"))&&!m.data("cke-bookmark"))if(j&&CKEDITOR.dtd.$removeEmpty[m.getName()]){x=
m.getText();if(/[^\s\ufeff]/.test(x))m=null;else{l=m.$.getElementsByTagName("*");for(s=0;C=l[s++];)if(!CKEDITOR.dtd.$removeEmpty[C.nodeName.toLowerCase()]){m=null;break}}m&&(r=!!x.length)}else m=null}else r=1;r&&j&&(i?h=f:this.setEndAfter(f));if(m){r=m.getNext();if(!f&&!r){f=m;m=null;break}m=r}else f=null}f&&(f=f.getParent())}if(e&&h){d=e.contains(h)?h:e;this.setStartBefore(d);this.setEndAfter(d)}break;case CKEDITOR.ENLARGE_BLOCK_CONTENTS:case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:f=new CKEDITOR.dom.range(this.root);
g=this.root;f.setStartAt(g,CKEDITOR.POSITION_AFTER_START);f.setEnd(this.startContainer,this.startOffset);f=new CKEDITOR.dom.walker(f);var y,t,w=CKEDITOR.dom.walker.blockBoundary(a==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS?{br:1}:null),I=function(a){var b=w(a);b||(y=a);return b},c=function(a){var b=I(a);!b&&(a.is&&a.is("br"))&&(t=a);return b};f.guard=I;f=f.lastBackward();y=y||g;this.setStartAt(y,!y.is("br")&&(!f&&this.checkStartOfBlock()||f&&y.contains(f))?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_AFTER_END);
if(a==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS){f=this.clone();f=new CKEDITOR.dom.walker(f);var G=CKEDITOR.dom.walker.whitespaces(),D=CKEDITOR.dom.walker.bookmark();f.evaluator=function(a){return!G(a)&&!D(a)};if((f=f.previous())&&f.type==CKEDITOR.NODE_ELEMENT&&f.is("br"))break}f=this.clone();f.collapse();f.setEndAt(g,CKEDITOR.POSITION_BEFORE_END);f=new CKEDITOR.dom.walker(f);f.guard=a==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS?c:I;y=null;f=f.lastForward();y=y||g;this.setEndAt(y,!f&&this.checkEndOfBlock()||f&&
y.contains(f)?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_BEFORE_START);t&&this.setEndAfter(t)}},shrink:function(a,b,c){if(!this.collapsed){var a=a||CKEDITOR.SHRINK_TEXT,d=this.clone(),g=this.startContainer,f=this.endContainer,e=this.startOffset,h=this.endOffset,m=1,i=1;if(g&&g.type==CKEDITOR.NODE_TEXT)if(e)if(e>=g.getLength())d.setStartAfter(g);else{d.setStartBefore(g);m=0}else d.setStartBefore(g);if(f&&f.type==CKEDITOR.NODE_TEXT)if(h)if(h>=f.getLength())d.setEndAfter(f);else{d.setEndAfter(f);
i=0}else d.setEndBefore(f);var d=new CKEDITOR.dom.walker(d),j=CKEDITOR.dom.walker.bookmark();d.evaluator=function(b){return b.type==(a==CKEDITOR.SHRINK_ELEMENT?CKEDITOR.NODE_ELEMENT:CKEDITOR.NODE_TEXT)};var r;d.guard=function(b,g){if(j(b))return true;if(a==CKEDITOR.SHRINK_ELEMENT&&b.type==CKEDITOR.NODE_TEXT||g&&b.equals(r)||c===false&&b.type==CKEDITOR.NODE_ELEMENT&&b.isBlockBoundary())return false;!g&&b.type==CKEDITOR.NODE_ELEMENT&&(r=b);return true};if(m)(g=d[a==CKEDITOR.SHRINK_ELEMENT?"lastForward":
"next"]())&&this.setStartAt(g,b?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_BEFORE_START);if(i){d.reset();(d=d[a==CKEDITOR.SHRINK_ELEMENT?"lastBackward":"previous"]())&&this.setEndAt(d,b?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_AFTER_END)}return!(!m&&!i)}},insertNode:function(a){this.optimizeBookmark();this.trim(false,true);var b=this.startContainer,c=b.getChild(this.startOffset);c?a.insertBefore(c):b.append(a);a.getParent()&&a.getParent().equals(this.endContainer)&&this.endOffset++;this.setStartBefore(a)},
moveToPosition:function(a,b){this.setStartAt(a,b);this.collapse(true)},moveToRange:function(a){this.setStart(a.startContainer,a.startOffset);this.setEnd(a.endContainer,a.endOffset)},selectNodeContents:function(a){this.setStart(a,0);this.setEnd(a,a.type==CKEDITOR.NODE_TEXT?a.getLength():a.getChildCount())},setStart:function(a,b){if(a.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$empty[a.getName()]){b=a.getIndex();a=a.getParent()}this.startContainer=a;this.startOffset=b;if(!this.endContainer){this.endContainer=
a;this.endOffset=b}e(this)},setEnd:function(a,b){if(a.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$empty[a.getName()]){b=a.getIndex()+1;a=a.getParent()}this.endContainer=a;this.endOffset=b;if(!this.startContainer){this.startContainer=a;this.startOffset=b}e(this)},setStartAfter:function(a){this.setStart(a.getParent(),a.getIndex()+1)},setStartBefore:function(a){this.setStart(a.getParent(),a.getIndex())},setEndAfter:function(a){this.setEnd(a.getParent(),a.getIndex()+1)},setEndBefore:function(a){this.setEnd(a.getParent(),
a.getIndex())},setStartAt:function(a,b){switch(b){case CKEDITOR.POSITION_AFTER_START:this.setStart(a,0);break;case CKEDITOR.POSITION_BEFORE_END:a.type==CKEDITOR.NODE_TEXT?this.setStart(a,a.getLength()):this.setStart(a,a.getChildCount());break;case CKEDITOR.POSITION_BEFORE_START:this.setStartBefore(a);break;case CKEDITOR.POSITION_AFTER_END:this.setStartAfter(a)}e(this)},setEndAt:function(a,b){switch(b){case CKEDITOR.POSITION_AFTER_START:this.setEnd(a,0);break;case CKEDITOR.POSITION_BEFORE_END:a.type==
CKEDITOR.NODE_TEXT?this.setEnd(a,a.getLength()):this.setEnd(a,a.getChildCount());break;case CKEDITOR.POSITION_BEFORE_START:this.setEndBefore(a);break;case CKEDITOR.POSITION_AFTER_END:this.setEndAfter(a)}e(this)},fixBlock:function(a,b){var c=this.createBookmark(),d=this.document.createElement(b);this.collapse(a);this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);this.extractContents().appendTo(d);d.trim();CKEDITOR.env.ie||d.appendBogus();this.insertNode(d);this.moveToBookmark(c);return d},splitBlock:function(a){var b=
new CKEDITOR.dom.elementPath(this.startContainer,this.root),c=new CKEDITOR.dom.elementPath(this.endContainer,this.root),d=b.block,g=c.block,f=null;if(!b.blockLimit.equals(c.blockLimit))return null;if(a!="br"){if(!d){d=this.fixBlock(true,a);g=(new CKEDITOR.dom.elementPath(this.endContainer,this.root)).block}g||(g=this.fixBlock(false,a))}a=d&&this.checkStartOfBlock();b=g&&this.checkEndOfBlock();this.deleteContents();if(d&&d.equals(g))if(b){f=new CKEDITOR.dom.elementPath(this.startContainer,this.root);
this.moveToPosition(g,CKEDITOR.POSITION_AFTER_END);g=null}else if(a){f=new CKEDITOR.dom.elementPath(this.startContainer,this.root);this.moveToPosition(d,CKEDITOR.POSITION_BEFORE_START);d=null}else{g=this.splitElement(d);!CKEDITOR.env.ie&&!d.is("ul","ol")&&d.appendBogus()}return{previousBlock:d,nextBlock:g,wasStartOfBlock:a,wasEndOfBlock:b,elementPath:f}},splitElement:function(a){if(!this.collapsed)return null;this.setEndAt(a,CKEDITOR.POSITION_BEFORE_END);var b=this.extractContents(),c=a.clone(false);
b.appendTo(c);c.insertAfter(a);this.moveToPosition(a,CKEDITOR.POSITION_AFTER_END);return c},removeEmptyBlocksAtEnd:function(){function a(d){return function(a){return b(a)||(c(a)||a.type==CKEDITOR.NODE_ELEMENT&&a.isEmptyInlineRemoveable())||d.is("table")&&a.is("caption")?false:true}}var b=CKEDITOR.dom.walker.whitespaces(),c=CKEDITOR.dom.walker.bookmark(false);return function(b){for(var c=this.createBookmark(),d=this[b?"endPath":"startPath"](),f=d.block||d.blockLimit,e;f&&!f.equals(d.root)&&!f.getFirst(a(f));){e=
f.getParent();this[b?"setEndAt":"setStartAt"](f,CKEDITOR.POSITION_AFTER_END);f.remove(1);f=e}this.moveToBookmark(c)}}(),startPath:function(){return new CKEDITOR.dom.elementPath(this.startContainer,this.root)},endPath:function(){return new CKEDITOR.dom.elementPath(this.endContainer,this.root)},checkBoundaryOfElement:function(a,b){var d=b==CKEDITOR.START,f=this.clone();f.collapse(d);f[d?"setStartAt":"setEndAt"](a,d?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_BEFORE_END);f=new CKEDITOR.dom.walker(f);
f.evaluator=c(d);return f[d?"checkBackward":"checkForward"]()},checkStartOfBlock:function(){var a=this.startContainer,c=this.startOffset;if(CKEDITOR.env.ie&&c&&a.type==CKEDITOR.NODE_TEXT){a=CKEDITOR.tools.ltrim(a.substring(0,c));l.test(a)&&this.trim(0,1)}this.trim();a=new CKEDITOR.dom.elementPath(this.startContainer,this.root);c=this.clone();c.collapse(true);c.setStartAt(a.block||a.blockLimit,CKEDITOR.POSITION_AFTER_START);a=new CKEDITOR.dom.walker(c);a.evaluator=b();return a.checkBackward()},checkEndOfBlock:function(){var a=
this.endContainer,c=this.endOffset;if(CKEDITOR.env.ie&&a.type==CKEDITOR.NODE_TEXT){a=CKEDITOR.tools.rtrim(a.substring(c));l.test(a)&&this.trim(1,0)}this.trim();a=new CKEDITOR.dom.elementPath(this.endContainer,this.root);c=this.clone();c.collapse(false);c.setEndAt(a.block||a.blockLimit,CKEDITOR.POSITION_BEFORE_END);a=new CKEDITOR.dom.walker(c);a.evaluator=b();return a.checkForward()},getPreviousNode:function(a,b,c){var d=this.clone();d.collapse(1);d.setStartAt(c||this.root,CKEDITOR.POSITION_AFTER_START);
c=new CKEDITOR.dom.walker(d);c.evaluator=a;c.guard=b;return c.previous()},getNextNode:function(a,b,c){var d=this.clone();d.collapse();d.setEndAt(c||this.root,CKEDITOR.POSITION_BEFORE_END);c=new CKEDITOR.dom.walker(d);c.evaluator=a;c.guard=b;return c.next()},checkReadOnly:function(){function a(b,c){for(;b;){if(b.type==CKEDITOR.NODE_ELEMENT){if(b.getAttribute("contentEditable")=="false"&&!b.data("cke-editable"))return 0;if(b.is("html")||b.getAttribute("contentEditable")=="true"&&(b.contains(c)||b.equals(c)))break}b=
b.getParent()}return 1}return function(){var b=this.startContainer,c=this.endContainer;return!(a(b,c)&&a(c,b))}}(),moveToElementEditablePosition:function(b,c){if(b.type==CKEDITOR.NODE_ELEMENT&&!b.isEditable(false)){this.moveToPosition(b,c?CKEDITOR.POSITION_AFTER_END:CKEDITOR.POSITION_BEFORE_START);return true}for(var d=0;b;){if(b.type==CKEDITOR.NODE_TEXT){c&&this.checkEndOfBlock()&&l.test(b.getText())?this.moveToPosition(b,CKEDITOR.POSITION_BEFORE_START):this.moveToPosition(b,c?CKEDITOR.POSITION_AFTER_END:
CKEDITOR.POSITION_BEFORE_START);d=1;break}if(b.type==CKEDITOR.NODE_ELEMENT)if(b.isEditable()){this.moveToPosition(b,c?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_AFTER_START);d=1}else c&&(b.is("br")&&this.checkEndOfBlock())&&this.moveToPosition(b,CKEDITOR.POSITION_BEFORE_START);var f=b,g=d,e=void 0;f.type==CKEDITOR.NODE_ELEMENT&&f.isEditable(false)&&(e=f[c?"getLast":"getFirst"](a));!g&&!e&&(e=f[c?"getPrevious":"getNext"](a));b=e}return!!d},moveToElementEditStart:function(a){return this.moveToElementEditablePosition(a)},
moveToElementEditEnd:function(a){return this.moveToElementEditablePosition(a,true)},getEnclosedNode:function(){var a=this.clone();a.optimize();if(a.startContainer.type!=CKEDITOR.NODE_ELEMENT||a.endContainer.type!=CKEDITOR.NODE_ELEMENT)return null;var a=new CKEDITOR.dom.walker(a),b=CKEDITOR.dom.walker.bookmark(false,true),c=CKEDITOR.dom.walker.whitespaces(true);a.evaluator=function(a){return c(a)&&b(a)};var d=a.next();a.reset();return d&&d.equals(a.previous())?d:null},getTouchedStartNode:function(){var a=
this.startContainer;return this.collapsed||a.type!=CKEDITOR.NODE_ELEMENT?a:a.getChild(this.startOffset)||a},getTouchedEndNode:function(){var a=this.endContainer;return this.collapsed||a.type!=CKEDITOR.NODE_ELEMENT?a:a.getChild(this.endOffset-1)||a},scrollIntoView:function(){var a=new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>",this.document),b,c,d,g=this.clone();g.optimize();if(d=g.startContainer.type==CKEDITOR.NODE_TEXT){c=g.startContainer.getText();b=g.startContainer.split(g.startOffset);
a.insertAfter(g.startContainer)}else g.insertNode(a);a.scrollIntoView();if(d){g.startContainer.setText(c);b.remove()}a.remove()}}})();CKEDITOR.POSITION_AFTER_START=1;CKEDITOR.POSITION_BEFORE_END=2;CKEDITOR.POSITION_BEFORE_START=3;CKEDITOR.POSITION_AFTER_END=4;CKEDITOR.ENLARGE_ELEMENT=1;CKEDITOR.ENLARGE_BLOCK_CONTENTS=2;CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS=3;CKEDITOR.ENLARGE_INLINE=4;CKEDITOR.START=1;CKEDITOR.END=2;CKEDITOR.SHRINK_ELEMENT=1;CKEDITOR.SHRINK_TEXT=2;
(function(){function b(a){if(!(arguments.length<1)){this.range=a;this.forceBrBreak=0;this.enlargeBr=1;this.enforceRealBlocks=0;this._||(this._={})}}function c(a,b,c){for(a=a.getNextSourceNode(b,null,c);!e(a);)a=a.getNextSourceNode(b,null,c);return a}var a=/^[\r\n\t ]+$/,e=CKEDITOR.dom.walker.bookmark(false,true),d=CKEDITOR.dom.walker.whitespaces(true),h=function(a){return e(a)&&d(a)};b.prototype={getNextParagraph:function(b){b=b||"p";if(!CKEDITOR.dtd[this.range.root.getName()][b])return null;var d,
i,l,n,o,q;if(!this._.started){i=this.range.clone();i.shrink(CKEDITOR.NODE_ELEMENT,true);n=i.endContainer.hasAscendant("pre",true)||i.startContainer.hasAscendant("pre",true);i.enlarge(this.forceBrBreak&&!n||!this.enlargeBr?CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:CKEDITOR.ENLARGE_BLOCK_CONTENTS);if(!i.collapsed){n=new CKEDITOR.dom.walker(i.clone());var k=CKEDITOR.dom.walker.bookmark(true,true);n.evaluator=k;this._.nextNode=n.next();n=new CKEDITOR.dom.walker(i.clone());n.evaluator=k;n=n.previous();this._.lastNode=
n.getNextSourceNode(true);if(this._.lastNode&&this._.lastNode.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.trim(this._.lastNode.getText())&&this._.lastNode.getParent().isBlockBoundary()){k=this.range.clone();k.moveToPosition(this._.lastNode,CKEDITOR.POSITION_AFTER_END);if(k.checkEndOfBlock()){k=new CKEDITOR.dom.elementPath(k.endContainer,k.root);this._.lastNode=(k.block||k.blockLimit).getNextSourceNode(true)}}if(!this._.lastNode){this._.lastNode=this._.docEndMarker=i.document.createText("");this._.lastNode.insertAfter(n)}i=
null}this._.started=1}k=this._.nextNode;n=this._.lastNode;for(this._.nextNode=null;k;){var g=0,p=k.hasAscendant("pre"),v=k.type!=CKEDITOR.NODE_ELEMENT,u=0;if(v)k.type==CKEDITOR.NODE_TEXT&&a.test(k.getText())&&(v=0);else{var m=k.getName();if(k.isBlockBoundary(this.forceBrBreak&&!p&&{br:1})){if(m=="br")v=1;else if(!i&&!k.getChildCount()&&m!="hr"){d=k;l=k.equals(n);break}if(i){i.setEndAt(k,CKEDITOR.POSITION_BEFORE_START);if(m!="br")this._.nextNode=k}g=1}else{if(k.getFirst()){if(!i){i=this.range.clone();
i.setStartAt(k,CKEDITOR.POSITION_BEFORE_START)}k=k.getFirst();continue}v=1}}if(v&&!i){i=this.range.clone();i.setStartAt(k,CKEDITOR.POSITION_BEFORE_START)}l=(!g||v)&&k.equals(n);if(i&&!g)for(;!k.getNext(h)&&!l;){m=k.getParent();if(m.isBlockBoundary(this.forceBrBreak&&!p&&{br:1})){g=1;v=0;l||m.equals(n);i.setEndAt(m,CKEDITOR.POSITION_BEFORE_END);break}k=m;v=1;l=k.equals(n);u=1}v&&i.setEndAt(k,CKEDITOR.POSITION_AFTER_END);k=c(k,u,n);if((l=!k)||g&&i)break}if(!d){if(!i){this._.docEndMarker&&this._.docEndMarker.remove();
return this._.nextNode=null}d=new CKEDITOR.dom.elementPath(i.startContainer,i.root);k=d.blockLimit;g={div:1,th:1,td:1};d=d.block;if(!d&&k&&!this.enforceRealBlocks&&g[k.getName()]&&i.checkStartOfBlock()&&i.checkEndOfBlock()&&!k.equals(i.root))d=k;else if(!d||this.enforceRealBlocks&&d.getName()=="li"){d=this.range.document.createElement(b);i.extractContents().appendTo(d);d.trim();i.insertNode(d);o=q=true}else if(d.getName()!="li"){if(!i.checkStartOfBlock()||!i.checkEndOfBlock()){d=d.clone(false);i.extractContents().appendTo(d);
d.trim();q=i.splitBlock();o=!q.wasStartOfBlock;q=!q.wasEndOfBlock;i.insertNode(d)}}else if(!l)this._.nextNode=d.equals(n)?null:c(i.getBoundaryNodes().endNode,1,n)}if(o)(i=d.getPrevious())&&i.type==CKEDITOR.NODE_ELEMENT&&(i.getName()=="br"?i.remove():i.getLast()&&i.getLast().$.nodeName.toLowerCase()=="br"&&i.getLast().remove());if(q)(i=d.getLast())&&i.type==CKEDITOR.NODE_ELEMENT&&i.getName()=="br"&&(CKEDITOR.env.ie||i.getPrevious(e)||i.getNext(e))&&i.remove();if(!this._.nextNode)this._.nextNode=l||
d.equals(n)||!n?null:c(d,1,n);return d}};CKEDITOR.dom.range.prototype.createIterator=function(){return new b(this)}})();
CKEDITOR.command=function(b,c){this.uiItems=[];this.exec=function(a){if(this.state==CKEDITOR.TRISTATE_DISABLED||!this.checkAllowed())return false;this.editorFocus&&b.focus();return this.fire("exec")===false?true:c.exec.call(this,b,a)!==false};this.refresh=function(a,b){if(!this.readOnly&&a.readOnly)return true;if(this.context&&!b.isContextFor(this.context)){this.disable();return true}this.enable();return this.fire("refresh",{editor:a,path:b})===false?true:c.refresh&&c.refresh.apply(this,arguments)!==
false};var a;this.checkAllowed=function(){return typeof a=="boolean"?a:a=b.filter.checkFeature(this)};CKEDITOR.tools.extend(this,c,{modes:{wysiwyg:1},editorFocus:1,contextSensitive:!!c.context,state:CKEDITOR.TRISTATE_DISABLED});CKEDITOR.event.call(this)};
CKEDITOR.command.prototype={enable:function(){this.state==CKEDITOR.TRISTATE_DISABLED&&this.checkAllowed()&&this.setState(!this.preserveState||typeof this.previousState=="undefined"?CKEDITOR.TRISTATE_OFF:this.previousState)},disable:function(){this.setState(CKEDITOR.TRISTATE_DISABLED)},setState:function(b){if(this.state==b||!this.checkAllowed())return false;this.previousState=this.state;this.state=b;this.fire("state");return true},toggleState:function(){this.state==CKEDITOR.TRISTATE_OFF?this.setState(CKEDITOR.TRISTATE_ON):
this.state==CKEDITOR.TRISTATE_ON&&this.setState(CKEDITOR.TRISTATE_OFF)}};CKEDITOR.event.implementOn(CKEDITOR.command.prototype);CKEDITOR.ENTER_P=1;CKEDITOR.ENTER_BR=2;CKEDITOR.ENTER_DIV=3;
CKEDITOR.config={customConfig:"config.js",autoUpdateElement:!0,language:"",defaultLanguage:"en",contentsLangDirection:"",enterMode:CKEDITOR.ENTER_P,forceEnterMode:!1,shiftEnterMode:CKEDITOR.ENTER_BR,docType:"<!DOCTYPE html>",bodyId:"",bodyClass:"",fullPage:!1,height:200,extraPlugins:"",removePlugins:"",protectedSource:[],tabIndex:0,width:"",baseFloatZIndex:1E4,blockedKeystrokes:[CKEDITOR.CTRL+66,CKEDITOR.CTRL+73,CKEDITOR.CTRL+85]};
(function(){function b(a,b,g,f,e){var h=b.name;if((f||typeof a.elements!="function"||a.elements(h))&&(!a.match||a.match(b))){if(f=!e){a:if(a.nothingRequired)f=true;else{if(e=a.requiredClasses){h=b.classes;for(f=0;f<e.length;++f)if(CKEDITOR.tools.indexOf(h,e[f])==-1){f=false;break a}}f=d(b.styles,a.requiredStyles)&&d(b.attributes,a.requiredAttributes)}f=!f}if(!f){if(!a.propertiesOnly)g.valid=true;if(!g.allAttributes)g.allAttributes=c(a.attributes,b.attributes,g.validAttributes);if(!g.allStyles)g.allStyles=
c(a.styles,b.styles,g.validStyles);if(!g.allClasses){a=a.classes;b=b.classes;f=g.validClasses;if(a)if(a===true)b=true;else{for(var e=0,h=b.length,p;e<h;++e){p=b[e];f[p]||(f[p]=a(p))}b=false}else b=false;g.allClasses=b}}}}function c(a,b,c){if(!a)return false;if(a===true)return true;for(var d in b)c[d]||(c[d]=a(d,b[d]));return false}function a(a,b){if(!a)return false;if(a===true)return a;if(typeof a=="string"){a=x(a);return a=="*"?true:CKEDITOR.tools.convertArrayToObject(a.split(b))}if(CKEDITOR.tools.isArray(a))return a.length?
CKEDITOR.tools.convertArrayToObject(a):false;var c={},d=0,g;for(g in a){c[g]=a[g];d++}return d?c:false}function e(a){if(a._.filterFunction)return a._.filterFunction;var c=/^cke:(object|embed|param)$/,d=/^(object|embed|param)$/;return a._.filterFunction=function(g,f,e,h,k,m,t){var o=g.name,v,u=false;if(k)g.name=o=o.replace(c,"$1");if(e=e&&e[o]){i(g);for(o=0;o<e.length;++o)p(a,g,e[o]);l(g)}if(f){var o=g.name,e=f.elements[o],j=f.generic,f={valid:false,validAttributes:{},validClasses:{},validStyles:{},
allAttributes:false,allClasses:false,allStyles:false};if(!e&&!j){h.push(g);return true}i(g);if(e){o=0;for(v=e.length;o<v;++o)b(e[o],g,f,true,m)}if(j){o=0;for(v=j.length;o<v;++o)b(j[o],g,f,false,m)}if(!f.valid){h.push(g);return true}m=f.validAttributes;o=f.validStyles;e=f.validClasses;v=g.attributes;var j=g.styles,r=v["class"],w=v.style,q,x,A=[],s=[],E=/^data-cke-/,z=false;delete v.style;delete v["class"];if(!f.allAttributes)for(q in v)if(!m[q])if(E.test(q)){if(q!=(x=q.replace(/^data-cke-saved-/,""))&&
!m[x]){delete v[q];z=true}}else{delete v[q];z=true}if(f.allStyles){if(w)v.style=w}else{for(q in j)o[q]?A.push(q+":"+j[q]):z=true;if(A.length)v.style=A.sort().join("; ")}if(f.allClasses)r&&(v["class"]=r);else{for(q in e)e[q]&&s.push(q);s.length&&(v["class"]=s.sort().join(" "));r&&s.length<r.split(/\s+/).length&&(z=true)}z&&(u=true);if(!t&&!n(g)){h.push(g);return true}}if(k)g.name=g.name.replace(d,"cke:$1");return u}}function d(a,b){if(!b)return true;for(var c=0;c<b.length;++c)if(!(b[c]in a))return false;
return true}function h(a){if(!a)return{};for(var a=a.split(/\s*,\s*/).sort(),b={};a.length;)b[a.shift()]=z;return b}function f(a){for(var b,c,g,d,f={},e=1,a=x(a);b=a.match(y);){if(c=b[2]){g=j(c,"styles");d=j(c,"attrs");c=j(c,"classes")}else g=d=c=null;f["$"+e++]={elements:b[1],classes:c,styles:g,attributes:d};a=a.slice(b[0].length)}return f}function j(a,b){var c=a.match(t[b]);return c?x(c[1]):null}function i(a){if(!a.styles)a.styles=CKEDITOR.tools.parseCssText(a.attributes.style||"",1);if(!a.classes)a.classes=
a.attributes["class"]?a.attributes["class"].split(/\s+/):[]}function l(a){var b=a.attributes,c;delete b.style;delete b["class"];if(c=CKEDITOR.tools.writeCssText(a.styles,true))b.style=c;a.classes.length&&(b["class"]=a.classes.sort().join(" "))}function n(a){switch(a.name){case "a":if(!a.children.length&&!a.attributes.name)return false;break;case "img":if(!a.attributes.src)return false}return true}function o(a){return!a?false:a===true?true:function(b){return b in a}}function q(){return new CKEDITOR.htmlParser.element("br")}
function k(a){return a.type==CKEDITOR.NODE_ELEMENT&&(a.name=="br"||A.$block[a.name])}function g(a,b,c){var g=a.name;if(A.$empty[g]||!a.children.length)if(g=="hr"&&b=="br")a.replaceWith(q());else{a.parent&&c.push({check:"it",el:a.parent});a.remove()}else if(A.$block[g]||g=="tr")if(b=="br"){if(a.previous&&!k(a.previous)){b=q();b.insertBefore(a)}if(a.next&&!k(a.next)){b=q();b.insertAfter(a)}a.replaceWithChildren()}else{var g=a.children,d;b:{d=A[b];for(var f=0,e=g.length,h;f<e;++f){h=g[f];if(h.type==
CKEDITOR.NODE_ELEMENT&&!d[h.name]){d=false;break b}}d=true}if(d){a.name=b;a.attributes={};c.push({check:"parent-down",el:a})}else{d=a.parent;for(var f=d.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT||d.name=="body",p,e=g.length;e>0;){h=g[--e];if(f&&(h.type==CKEDITOR.NODE_TEXT||h.type==CKEDITOR.NODE_ELEMENT&&A.$inline[h.name])){if(!p){p=new CKEDITOR.htmlParser.element(b);p.insertAfter(a);c.push({check:"parent-down",el:p})}p.add(h,0)}else{p=null;h.insertAfter(a);d.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&(h.type==
CKEDITOR.NODE_ELEMENT&&!A[d.name][h.name])&&c.push({check:"el-up",el:h})}}a.remove()}}else if(g=="style")a.remove();else{a.parent&&c.push({check:"it",el:a.parent});a.replaceWithChildren()}}function p(a,b,c){var g,d;for(g=0;g<c.length;++g){d=c[g];if((!d.check||a.check(d.check,false))&&(!d.left||d.left(b))){d.right(b,w);break}}}function v(a,b){var c=b.getDefinition(),g=c.attributes,d=c.styles,f,e,h,p;if(a.name!=c.element)return false;for(f in g)if(f=="class"){c=g[f].split(/\s+/);for(h=a.classes.join("|");p=
c.pop();)if(h.indexOf(p)==-1)return false}else if(a.attributes[f]!=g[f])return false;for(e in d)if(a.styles[e]!=d[e])return false;return true}function u(a,b){var c,g;if(typeof a=="string")c=a;else if(a instanceof CKEDITOR.style)g=a;else{c=a[0];g=a[1]}return[{element:c,left:g,right:function(a,c){c.transform(a,b)}}]}function m(a){return function(b){return v(b,a)}}function E(a){return function(b,c){c[a](b)}}var A=CKEDITOR.dtd,r=CKEDITOR.tools.copy,x=CKEDITOR.tools.trim,z="cke-test";CKEDITOR.filter=function(a){this.allowedContent=
[];this.disabled=false;this.editor=null;this.enterMode=CKEDITOR.ENTER_P;this._={rules:{},transformations:{},cachedTests:{}};if(a instanceof CKEDITOR.editor){var b=this.editor=a;this.customConfig=true;var a=b.config.allowedContent,c;if(a===true)this.disabled=true;else{if(!a)this.customConfig=false;this.enterMode=c=b.blockless?CKEDITOR.ENTER_BR:b.config.enterMode;var g=["br"],d=b.blockless?CKEDITOR.ENTER_BR:b.config.shiftEnterMode;(c==CKEDITOR.ENTER_P||d==CKEDITOR.ENTER_P)&&g.push("p");(c==CKEDITOR.ENTER_DIV||
d==CKEDITOR.ENTER_DIV)&&g.push("div");this.allow(g.join(" "),"default",1);this.allow(a,"config",1);this.allow(b.config.extraAllowedContent,"extra",1);this._.toHtmlListener=b.on("toHtml",function(a){this.applyTo(a.data.dataValue,true,a.data.dontFilter)&&b.fire("dataFiltered")},this,null,6);this._.toDataFormatListener=b.on("toDataFormat",function(a){this.applyTo(a.data.dataValue,false,true)},this,null,11)}}else{this.customConfig=false;this.allow(a,"default",1)}};CKEDITOR.filter.prototype={allow:function(b,
c,g){if(this.disabled||this.customConfig&&!g||!b)return false;this._.cachedChecks={};var d,e;if(typeof b=="string")b=f(b);else if(b instanceof CKEDITOR.style){e=b.getDefinition();g={};b=e.attributes;g[e.element]=e={styles:e.styles,requiredStyles:e.styles&&CKEDITOR.tools.objectKeys(e.styles)};if(b){b=r(b);e.classes=b["class"]?b["class"].split(/\s+/):null;e.requiredClasses=e.classes;delete b["class"];e.attributes=b;e.requiredAttributes=b&&CKEDITOR.tools.objectKeys(b)}b=g}else if(CKEDITOR.tools.isArray(b)){for(d=
0;d<b.length;++d)e=this.allow(b[d],c,g);return e}var h,g=[];for(h in b){e=b[h];e=typeof e=="boolean"?{}:typeof e=="function"?{match:e}:r(e);if(h.charAt(0)!="$")e.elements=h;if(c)e.featureName=c.toLowerCase();var p=e;p.elements=a(p.elements,/\s+/)||null;p.propertiesOnly=p.propertiesOnly||p.elements===true;var k=/\s*,\s*/,m=void 0;for(m in s){p[m]=a(p[m],k)||null;var t=p,i=C[m],v=a(p[C[m]],k),j=p[m],u=[],q=true,w=void 0;v?q=false:v={};for(w in j)if(w.charAt(0)=="!"){w=w.slice(1);u.push(w);v[w]=true;
q=false}for(;w=u.pop();){j[w]=j["!"+w];delete j["!"+w]}t[i]=(q?false:v)||null}p.match=p.match||null;this.allowedContent.push(e);g.push(e)}c=this._.rules;h=c.elements||{};b=c.generic||[];e=0;for(p=g.length;e<p;++e){k=r(g[e]);m=k.classes===true||k.styles===true||k.attributes===true;t=k;i=void 0;for(i in s)t[i]=o(t[i]);v=true;for(i in C){i=C[i];t[i]=CKEDITOR.tools.objectKeys(t[i]);t[i]&&(v=false)}t.nothingRequired=v;if(k.elements===true||k.elements===null){k.elements=o(k.elements);b[m?"unshift":"push"](k)}else{t=
k.elements;delete k.elements;for(d in t)if(h[d])h[d][m?"unshift":"push"](k);else h[d]=[k]}}c.elements=h;c.generic=b.length?b:null;return true},applyTo:function(a,b,c){var d=[],f=!c&&this._.rules,h=this._.transformations,p=e(this),k=this.editor&&this.editor.config.protectedSource,m=false;a.forEach(function(a){if(a.type==CKEDITOR.NODE_ELEMENT){if(!b||!(a.name=="span"&&~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-")))p(a,f,h,d,b)&&(m=true)}else if(a.type==CKEDITOR.NODE_COMMENT&&
a.value.match(/^\{cke_protected\}(?!\{C\})/)){var c;a:{var g=decodeURIComponent(a.value.replace(/^\{cke_protected\}/,""));c=[];var e,o,t;if(k)for(o=0;o<k.length;++o)if((t=g.match(k[o]))&&t[0].length==g.length){c=true;break a}g=CKEDITOR.htmlParser.fragment.fromHtml(g);g.children.length==1&&(e=g.children[0]).type==CKEDITOR.NODE_ELEMENT&&p(e,f,h,c,b);c=!c.length}c||d.push(a)}},null,true);d.length&&(m=true);for(var o,t,a=[],c=["p","br","div"][this.enterMode-1];o=d.pop();)o.type==CKEDITOR.NODE_ELEMENT?
g(o,c,a):o.remove();for(;t=a.pop();){o=t.el;if(o.parent)switch(t.check){case "it":A.$removeEmpty[o.name]&&!o.children.length?g(o,c,a):n(o)||g(o,c,a);break;case "el-up":o.parent.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&!A[o.parent.name][o.name]&&g(o,c,a);break;case "parent-down":o.parent.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&!A[o.parent.name][o.name]&&g(o.parent,c,a)}}return m},checkFeature:function(a){if(this.disabled||!a)return true;a.toFeature&&(a=a.toFeature(this.editor));return!a.requiredContent||
this.check(a.requiredContent)},disable:function(){this.disabled=true;this._.toHtmlListener&&this._.toHtmlListener.removeListener();this._.toDataFormatListener&&this._.toDataFormatListener.removeListener()},addContentForms:function(a){if(!this.disabled&&a){var b,c,g=[],d;for(b=0;b<a.length&&!d;++b){c=a[b];if((typeof c=="string"||c instanceof CKEDITOR.style)&&this.check(c))d=c}if(d){for(b=0;b<a.length;++b)g.push(u(a[b],d));this.addTransformations(g)}}},addFeature:function(a){if(this.disabled||!a)return true;
a.toFeature&&(a=a.toFeature(this.editor));this.allow(a.allowedContent,a.name);this.addTransformations(a.contentTransformations);this.addContentForms(a.contentForms);return this.customConfig&&a.requiredContent?this.check(a.requiredContent):true},addTransformations:function(a){var b,c;if(!this.disabled&&a){var g=this._.transformations,d;for(d=0;d<a.length;++d){b=a[d];var e=void 0,f=void 0,h=void 0,p=void 0,k=void 0,o=void 0;c=[];for(f=0;f<b.length;++f){h=b[f];if(typeof h=="string"){h=h.split(/\s*:\s*/);
p=h[0];k=null;o=h[1]}else{p=h.check;k=h.left;o=h.right}if(!e){e=h;e=e.element?e.element:p?p.match(/^([a-z0-9]+)/i)[0]:e.left.getDefinition().element}k instanceof CKEDITOR.style&&(k=m(k));c.push({check:p==e?null:p,left:k,right:typeof o=="string"?E(o):o})}b=e;g[b]||(g[b]=[]);g[b].push(c)}}},check:function(a,b,c){if(this.disabled)return true;if(CKEDITOR.tools.isArray(a)){for(var g=a.length;g--;)if(this.check(a[g],b,c))return true;return false}var d,k;if(typeof a=="string"){k=a+"<"+(b===false?"0":"1")+
(c?"1":"0")+">";if(k in this._.cachedChecks)return this._.cachedChecks[k];g=f(a).$1;d=g.styles;var o=g.classes;g.name=g.elements;g.classes=o=o?o.split(/\s*,\s*/):[];g.styles=h(d);g.attributes=h(g.attributes);g.children=[];o.length&&(g.attributes["class"]=o.join(" "));if(d)g.attributes.style=CKEDITOR.tools.writeCssText(g.styles);d=g}else{g=a.getDefinition();d=g.styles;o=g.attributes||{};if(d){d=r(d);o.style=CKEDITOR.tools.writeCssText(d,true)}else d={};d={name:g.element,attributes:o,classes:o["class"]?
o["class"].split(/\s+/):[],styles:d,children:[]}}var o=CKEDITOR.tools.clone(d),m=[],t;if(b!==false&&(t=this._.transformations[d.name])){for(g=0;g<t.length;++g)p(this,d,t[g]);l(d)}e(this)(o,this._.rules,b===false?false:this._.transformations,m,false,!c,!c);b=m.length>0?false:CKEDITOR.tools.objectCompare(d.attributes,o.attributes,true)?true:false;typeof a=="string"&&(this._.cachedChecks[k]=b);return b}};var s={styles:1,attributes:1,classes:1},C={styles:"requiredStyles",attributes:"requiredAttributes",
classes:"requiredClasses"},y=/^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,t={styles:/{([^}]+)}/,attrs:/\[([^\]]+)\]/,classes:/\(([^\)]+)\)/},w=CKEDITOR.filter.transformationsTools={sizeToStyle:function(a){this.lengthToStyle(a,"width");this.lengthToStyle(a,"height")},sizeToAttribute:function(a){this.lengthToAttribute(a,"width");this.lengthToAttribute(a,"height")},lengthToStyle:function(a,b,c){c=c||b;if(!(c in a.styles)){var g=a.attributes[b];
if(g){/^\d+$/.test(g)&&(g=g+"px");a.styles[c]=g}}delete a.attributes[b]},lengthToAttribute:function(a,b,c){c=c||b;if(!(c in a.attributes)){var g=a.styles[b],d=g&&g.match(/^(\d+)(?:\.\d*)?px$/);d?a.attributes[c]=d[1]:g==z&&(a.attributes[c]=z)}delete a.styles[b]},alignmentToStyle:function(a){if(!("float"in a.styles)){var b=a.attributes.align;if(b=="left"||b=="right")a.styles["float"]=b}delete a.attributes.align},alignmentToAttribute:function(a){if(!("align"in a.attributes)){var b=a.styles["float"];
if(b=="left"||b=="right")a.attributes.align=b}delete a.styles["float"]},matchesStyle:v,transform:function(a,b){if(typeof b=="string")a.name=b;else{var c=b.getDefinition(),g=c.styles,d=c.attributes,e,f,h,p;a.name=c.element;for(e in d)if(e=="class"){c=a.classes.join("|");for(h=d[e].split(/\s+/);p=h.pop();)c.indexOf(p)==-1&&a.classes.push(p)}else a.attributes[e]=d[e];for(f in g)a.styles[f]=g[f]}}}})();
(function(){CKEDITOR.focusManager=function(b){if(b.focusManager)return b.focusManager;this.hasFocus=false;this.currentActive=null;this._={editor:b};return this};CKEDITOR.focusManager._={blurDelay:200};CKEDITOR.focusManager.prototype={focus:function(){this._.timer&&clearTimeout(this._.timer);if(!this.hasFocus&&!this._.locked){var b=CKEDITOR.currentInstance;b&&b.focusManager.blur(1);this.hasFocus=true;(b=this._.editor.container)&&b.addClass("cke_focus");this._.editor.fire("focus")}},lock:function(){this._.locked=
1},unlock:function(){delete this._.locked},blur:function(b){function c(){if(this.hasFocus){this.hasFocus=false;var a=this._.editor.container;a&&a.removeClass("cke_focus");this._.editor.fire("blur")}}if(!this._.locked){this._.timer&&clearTimeout(this._.timer);var a=CKEDITOR.focusManager._.blurDelay;b||!a?c.call(this):this._.timer=CKEDITOR.tools.setTimeout(function(){delete this._.timer;c.call(this)},a,this)}},add:function(b,c){var a=b.getCustomData("focusmanager");if(!a||a!=this){a&&a.remove(b);var a=
"focus",e="blur";if(c)if(CKEDITOR.env.ie){a="focusin";e="focusout"}else CKEDITOR.event.useCapture=1;var d={blur:function(){b.equals(this.currentActive)&&this.blur()},focus:function(){this.currentActive=b;this.focus()}};b.on(a,d.focus,this);b.on(e,d.blur,this);if(c)CKEDITOR.event.useCapture=0;b.setCustomData("focusmanager",this);b.setCustomData("focusmanager_handlers",d)}},remove:function(b){b.removeCustomData("focusmanager");var c=b.removeCustomData("focusmanager_handlers");b.removeListener("blur",
c.blur);b.removeListener("focus",c.focus)}}})();CKEDITOR.keystrokeHandler=function(b){if(b.keystrokeHandler)return b.keystrokeHandler;this.keystrokes={};this.blockedKeystrokes={};this._={editor:b};return this};
(function(){var b,c=function(a){var a=a.data,c=a.getKeystroke(),h=this.keystrokes[c],f=this._.editor;b=f.fire("key",{keyCode:c})===false;if(!b){h&&(b=f.execCommand(h,{from:"keystrokeHandler"})!==false);b||(b=!!this.blockedKeystrokes[c])}b&&a.preventDefault(true);return!b},a=function(a){if(b){b=false;a.data.preventDefault(true)}};CKEDITOR.keystrokeHandler.prototype={attach:function(b){b.on("keydown",c,this);if(CKEDITOR.env.opera||CKEDITOR.env.gecko&&CKEDITOR.env.mac)b.on("keypress",a,this)}}})();
(function(){CKEDITOR.lang={languages:{af:1,ar:1,bg:1,bn:1,bs:1,ca:1,cs:1,cy:1,da:1,de:1,el:1,"en-au":1,"en-ca":1,"en-gb":1,en:1,eo:1,es:1,et:1,eu:1,fa:1,fi:1,fo:1,"fr-ca":1,fr:1,gl:1,gu:1,he:1,hi:1,hr:1,hu:1,id:1,is:1,it:1,ja:1,ka:1,km:1,ko:1,ku:1,lt:1,lv:1,mk:1,mn:1,ms:1,nb:1,nl:1,no:1,pl:1,"pt-br":1,pt:1,ro:1,ru:1,si:1,sk:1,sl:1,sq:1,"sr-latn":1,sr:1,sv:1,th:1,tr:1,ug:1,uk:1,vi:1,"zh-cn":1,zh:1},load:function(b,c,a){if(!b||!CKEDITOR.lang.languages[b])b=this.detect(c,b);this[b]?a(b,this[b]):CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/"+
b+".js"),function(){a(b,this[b])},this)},detect:function(b,c){var a=this.languages,c=c||navigator.userLanguage||navigator.language||b,e=c.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),d=e[1],e=e[2];a[d+"-"+e]?d=d+"-"+e:a[d]||(d=null);CKEDITOR.lang.detect=d?function(){return d}:function(a){return a};return d||b}}})();
CKEDITOR.scriptLoader=function(){var b={},c={};return{load:function(a,e,d,h){var f=typeof a=="string";f&&(a=[a]);d||(d=CKEDITOR);var j=a.length,i=[],l=[],n=function(a){e&&(f?e.call(d,a):e.call(d,i,l))};if(j===0)n(true);else{var o=function(a,b){(b?i:l).push(a);if(--j<=0){h&&CKEDITOR.document.getDocumentElement().removeStyle("cursor");n(b)}},q=function(a,g){b[a]=1;var d=c[a];delete c[a];for(var f=0;f<d.length;f++)d[f](a,g)},k=function(a){if(b[a])o(a,true);else{var g=c[a]||(c[a]=[]);g.push(o);if(!(g.length>
1)){var d=new CKEDITOR.dom.element("script");d.setAttributes({type:"text/javascript",src:a});if(e)if(CKEDITOR.env.ie)d.$.onreadystatechange=function(){if(d.$.readyState=="loaded"||d.$.readyState=="complete"){d.$.onreadystatechange=null;q(a,true)}};else{d.$.onload=function(){setTimeout(function(){q(a,true)},0)};d.$.onerror=function(){q(a,false)}}d.appendTo(CKEDITOR.document.getHead())}}};h&&CKEDITOR.document.getDocumentElement().setStyle("cursor","wait");for(var g=0;g<j;g++)k(a[g])}},queue:function(){function a(){var a;
(a=b[0])&&this.load(a.scriptUrl,a.callback,CKEDITOR,0)}var b=[];return function(c,h){var f=this;b.push({scriptUrl:c,callback:function(){h&&h.apply(this,arguments);b.shift();a.call(f)}});b.length==1&&a.call(this)}}()}}();CKEDITOR.resourceManager=function(b,c){this.basePath=b;this.fileName=c;this.registered={};this.loaded={};this.externals={};this._={waitingList:{}}};
CKEDITOR.resourceManager.prototype={add:function(b,c){if(this.registered[b])throw'[CKEDITOR.resourceManager.add] The resource name "'+b+'" is already registered.';var a=this.registered[b]=c||{};a.name=b;a.path=this.getPath(b);CKEDITOR.fire(b+CKEDITOR.tools.capitalize(this.fileName)+"Ready",a);return this.get(b)},get:function(b){return this.registered[b]||null},getPath:function(b){var c=this.externals[b];return CKEDITOR.getUrl(c&&c.dir||this.basePath+b+"/")},getFilePath:function(b){var c=this.externals[b];
return CKEDITOR.getUrl(this.getPath(b)+(c&&typeof c.file=="string"?c.file:this.fileName+".js"))},addExternal:function(b,c,a){for(var b=b.split(","),e=0;e<b.length;e++)this.externals[b[e]]={dir:c,file:a}},load:function(b,c,a){CKEDITOR.tools.isArray(b)||(b=b?[b]:[]);for(var e=this.loaded,d=this.registered,h=[],f={},j={},i=0;i<b.length;i++){var l=b[i];if(l)if(!e[l]&&!d[l]){var n=this.getFilePath(l);h.push(n);n in f||(f[n]=[]);f[n].push(l)}else j[l]=this.get(l)}CKEDITOR.scriptLoader.load(h,function(b,
d){if(d.length)throw'[CKEDITOR.resourceManager.load] Resource name "'+f[d[0]].join(",")+'" was not found at "'+d[0]+'".';for(var h=0;h<b.length;h++)for(var g=f[b[h]],p=0;p<g.length;p++){var i=g[p];j[i]=this.get(i);e[i]=1}c.call(a,j)},this)}};CKEDITOR.plugins=new CKEDITOR.resourceManager("plugins/","plugin");
CKEDITOR.plugins.load=CKEDITOR.tools.override(CKEDITOR.plugins.load,function(b){var c={};return function(a,e,d){var h={},f=function(a){b.call(this,a,function(a){CKEDITOR.tools.extend(h,a);var b=[],j;for(j in a){var o=a[j],q=o&&o.requires;if(!c[j]){if(o.icons)for(var k=o.icons.split(","),g=k.length;g--;)CKEDITOR.skin.addIcon(k[g],o.path+"icons/"+(CKEDITOR.env.hidpi&&o.hidpi?"hidpi/":"")+k[g]+".png");c[j]=1}if(q){q.split&&(q=q.split(","));for(o=0;o<q.length;o++)h[q[o]]||b.push(q[o])}}if(b.length)f.call(this,
b);else{for(j in h){o=h[j];if(o.onLoad&&!o.onLoad._called){o.onLoad()===false&&delete h[j];o.onLoad._called=1}}e&&e.call(d||window,h)}},this)};f.call(this,a)}});CKEDITOR.plugins.setLang=function(b,c,a){var e=this.get(b),b=e.langEntries||(e.langEntries={}),e=e.lang||(e.lang=[]);e.split&&(e=e.split(","));CKEDITOR.tools.indexOf(e,c)==-1&&e.push(c);b[c]=a};CKEDITOR.ui=function(b){if(b.ui)return b.ui;this.items={};this.instances={};this.editor=b;this._={handlers:{}};return this};
CKEDITOR.ui.prototype={add:function(b,c,a){a.name=b.toLowerCase();var e=this.items[b]={type:c,command:a.command||null,args:Array.prototype.slice.call(arguments,2)};CKEDITOR.tools.extend(e,a)},get:function(b){return this.instances[b]},create:function(b){var c=this.items[b],a=c&&this._.handlers[c.type],e=c&&c.command&&this.editor.getCommand(c.command),a=a&&a.create.apply(this,c.args);this.instances[b]=a;e&&e.uiItems.push(a);if(a&&!a.type)a.type=c.type;return a},addHandler:function(b,c){this._.handlers[b]=
c},space:function(b){return CKEDITOR.document.getById(this.spaceId(b))},spaceId:function(b){return this.editor.id+"_"+b}};CKEDITOR.event.implementOn(CKEDITOR.ui);
(function(){function b(b,e,h){CKEDITOR.event.call(this);b=b&&CKEDITOR.tools.clone(b);if(e!==void 0){if(e instanceof CKEDITOR.dom.element){if(!h)throw Error("One of the element modes must be specified.");}else throw Error("Expect element of type CKEDITOR.dom.element.");if(CKEDITOR.env.ie&&CKEDITOR.env.quirks&&h==CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");if(!(h==CKEDITOR.ELEMENT_MODE_INLINE?e.is(CKEDITOR.dtd.$editable)||e.is("textarea"):h==CKEDITOR.ELEMENT_MODE_REPLACE?
!e.is(CKEDITOR.dtd.$nonBodyContent):1))throw Error('The specified element mode is not supported on element: "'+e.getName()+'".');this.element=e;this.elementMode=h;this.name=this.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO&&(e.getId()||e.getNameAtt())}else this.elementMode=CKEDITOR.ELEMENT_MODE_NONE;this._={};this.commands={};this.templates={};this.name=this.name||c();this.id=CKEDITOR.tools.getNextId();this.status="unloaded";this.config=CKEDITOR.tools.prototypedCopy(CKEDITOR.config);this.ui=new CKEDITOR.ui(this);
this.focusManager=new CKEDITOR.focusManager(this);this.keystrokeHandler=new CKEDITOR.keystrokeHandler(this);this.on("readOnly",a);this.on("selectionChange",d);this.on("mode",a);this.on("instanceReady",function(){this.config.startupFocus&&this.focus()});CKEDITOR.fire("instanceCreated",null,this);CKEDITOR.add(this);CKEDITOR.tools.setTimeout(function(){f(this,b)},0,this)}function c(){do var a="editor"+ ++q;while(CKEDITOR.instances[a]);return a}function a(){var a=this.commands,b;for(b in a)e(this,a[b])}
function e(a,b){b[b.startDisabled?"disable":a.readOnly&&!b.readOnly?"disable":b.modes[a.mode]?"enable":"disable"]()}function d(a){var b=this.commands,c=a.editor,d=a.data.path,e;for(e in b){a=b[e];a.contextSensitive&&a.refresh(c,d)}}function h(a){var b=a.config.customConfig;if(!b)return false;var b=CKEDITOR.getUrl(b),c=k[b]||(k[b]={});if(c.fn){c.fn.call(a,a.config);(CKEDITOR.getUrl(a.config.customConfig)==b||!h(a))&&a.fireOnce("customConfigLoaded")}else CKEDITOR.scriptLoader.queue(b,function(){c.fn=
CKEDITOR.editorConfig?CKEDITOR.editorConfig:function(){};h(a)});return true}function f(a,b){a.on("customConfigLoaded",function(){if(b){if(b.on)for(var c in b.on)a.on(c,b.on[c]);CKEDITOR.tools.extend(a.config,b,true);delete a.config.on}a.readOnly=!(!a.config.readOnly&&!(a.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?a.element.is("textarea")?a.element.hasAttribute("disabled"):a.element.isReadOnly():a.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE&&a.element.hasAttribute("disabled")));a.blockless=a.elementMode==
CKEDITOR.ELEMENT_MODE_INLINE?!(a.element.is("textarea")||CKEDITOR.dtd[a.element.getName()].p):false;a.tabIndex=a.config.tabIndex||a.element&&a.element.getAttribute("tabindex")||0;if(a.config.skin)CKEDITOR.skinName=a.config.skin;a.fireOnce("configLoaded");a.dataProcessor=new CKEDITOR.htmlDataProcessor(a);a.filter=new CKEDITOR.filter(a);j(a)});if(b&&b.customConfig!=void 0)a.config.customConfig=b.customConfig;h(a)||a.fireOnce("customConfigLoaded")}function j(a){CKEDITOR.skin.loadPart("editor",function(){i(a)})}
function i(a){CKEDITOR.lang.load(a.config.language,a.config.defaultLanguage,function(b,c){var d=a.config.title;a.langCode=b;a.lang=CKEDITOR.tools.prototypedCopy(c);a.title=typeof d=="string"||d===false?d:[a.lang.editor,a.name].join(", ");if(CKEDITOR.env.gecko&&CKEDITOR.env.version<10900&&a.lang.dir=="rtl")a.lang.dir="ltr";if(!a.config.contentsLangDirection)a.config.contentsLangDirection=a.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?a.element.getDirection(1):a.lang.dir;a.fire("langLoaded");l(a)})}function l(a){a.getStylesSet(function(b){a.once("loaded",
function(){a.fire("stylesSet",{styles:b})},null,null,1);n(a)})}function n(a){var b=a.config,c=b.plugins,d=b.extraPlugins,e=b.removePlugins;if(d)var f=RegExp("(?:^|,)(?:"+d.replace(/\s*,\s*/g,"|")+")(?=,|$)","g"),c=c.replace(f,""),c=c+(","+d);if(e)var h=RegExp("(?:^|,)(?:"+e.replace(/\s*,\s*/g,"|")+")(?=,|$)","g"),c=c.replace(h,"");CKEDITOR.env.air&&(c=c+",adobeair");CKEDITOR.plugins.load(c.split(","),function(c){var d=[],e=[],f=[];a.plugins=c;for(var k in c){var o=c[k],m=o.lang,i=null,j=o.requires,
v;CKEDITOR.tools.isArray(j)&&(j=j.join(","));if(j&&(v=j.match(h)))for(;j=v.pop();)CKEDITOR.tools.setTimeout(function(a,b){throw Error('Plugin "'+a.replace(",","")+'" cannot be removed from the plugins list, because it\'s required by "'+b+'" plugin.');},0,null,[j,k]);if(m&&!a.lang[k]){m.split&&(m=m.split(","));if(CKEDITOR.tools.indexOf(m,a.langCode)>=0)i=a.langCode;else{i=a.langCode.replace(/-.*/,"");i=i!=a.langCode&&CKEDITOR.tools.indexOf(m,i)>=0?i:CKEDITOR.tools.indexOf(m,"en")>=0?"en":m[0]}if(!o.langEntries||
!o.langEntries[i])f.push(CKEDITOR.getUrl(o.path+"lang/"+i+".js"));else{a.lang[k]=o.langEntries[i];i=null}}e.push(i);d.push(o)}CKEDITOR.scriptLoader.load(f,function(){for(var c=["beforeInit","init","afterInit"],f=0;f<c.length;f++)for(var h=0;h<d.length;h++){var k=d[h];f===0&&(e[h]&&k.lang&&k.langEntries)&&(a.lang[k.name]=k.langEntries[e[h]]);if(k[c[f]])k[c[f]](a)}a.fireOnce("pluginsLoaded");b.keystrokes&&a.setKeystroke(a.config.keystrokes);for(h=0;h<a.config.blockedKeystrokes.length;h++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[h]]=
1;a.status="loaded";a.fireOnce("loaded");CKEDITOR.fire("instanceLoaded",null,a)})})}function o(){var a=this.element;if(a&&this.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO){var b=this.getData();this.config.htmlEncodeOutput&&(b=CKEDITOR.tools.htmlEncode(b));a.is("textarea")?a.setValue(b):a.setHtml(b);return true}return false}b.prototype=CKEDITOR.editor.prototype;CKEDITOR.editor=b;var q=0,k={};CKEDITOR.tools.extend(CKEDITOR.editor.prototype,{addCommand:function(a,b){b.name=a.toLowerCase();var c=new CKEDITOR.command(this,
b);this.mode&&e(this,c);return this.commands[a]=c},_attachToForm:function(){var a=this,b=a.element,c=new CKEDITOR.dom.element(b.$.form);if(b.is("textarea")&&c){var d=function(c){a.updateElement();a._.required&&(!b.getValue()&&a.fire("required")===false)&&c.data.preventDefault()};c.on("submit",d);if(!c.$.submit.nodeName&&!c.$.submit.length)c.$.submit=CKEDITOR.tools.override(c.$.submit,function(a){return function(b){d(new CKEDITOR.dom.event(b));a.apply?a.apply(this,arguments):a()}});a.on("destroy",
function(){c.removeListener("submit",d)})}},destroy:function(a){this.fire("beforeDestroy");!a&&o.call(this);this.editable(null);this.status="destroyed";this.fire("destroy");this.removeAllListeners();CKEDITOR.remove(this);CKEDITOR.fire("instanceDestroyed",null,this)},elementPath:function(a){return(a=a||this.getSelection().getStartElement())?new CKEDITOR.dom.elementPath(a,this.editable()):null},createRange:function(){var a=this.editable();return a?new CKEDITOR.dom.range(a):null},execCommand:function(a,
b){var c=this.getCommand(a),d={name:a,commandData:b,command:c};if(c&&c.state!=CKEDITOR.TRISTATE_DISABLED&&this.fire("beforeCommandExec",d)!==true){d.returnValue=c.exec(d.commandData);if(!c.async&&this.fire("afterCommandExec",d)!==true)return d.returnValue}return false},getCommand:function(a){return this.commands[a]},getData:function(a){!a&&this.fire("beforeGetData");var b=this._.data;if(typeof b!="string")b=(b=this.element)&&this.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE?b.is("textarea")?b.getValue():
b.getHtml():"";b={dataValue:b};!a&&this.fire("getData",b);return b.dataValue},getSnapshot:function(){var a=this.fire("getSnapshot");if(typeof a!="string"){var b=this.element;b&&this.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE&&(a=b.is("textarea")?b.getValue():b.getHtml())}return a},loadSnapshot:function(a){this.fire("loadSnapshot",a)},setData:function(a,b,c){if(b)this.on("dataReady",function(a){a.removeListener();b.call(a.editor)});a={dataValue:a};!c&&this.fire("setData",a);this._.data=a.dataValue;
!c&&this.fire("afterSetData",a)},setReadOnly:function(a){a=a==void 0||a;if(this.readOnly!=a){this.readOnly=a;this.keystrokeHandler.blockedKeystrokes[8]=+a;this.editable().setReadOnly(a);this.fire("readOnly")}},insertHtml:function(a,b){this.fire("insertHtml",{dataValue:a,mode:b})},insertText:function(a){this.fire("insertText",a)},insertElement:function(a){this.fire("insertElement",a)},focus:function(){this.fire("beforeFocus")},checkDirty:function(){return this.status=="ready"&&this._.previousValue!==
this.getSnapshot()},resetDirty:function(){this._.previousValue=this.getSnapshot()},updateElement:function(){return o.call(this)},setKeystroke:function(){for(var a=this.keystrokeHandler.keystrokes,b=CKEDITOR.tools.isArray(arguments[0])?arguments[0]:[[].slice.call(arguments,0)],c,d,f=b.length;f--;){c=b[f];d=0;if(CKEDITOR.tools.isArray(c)){d=c[1];c=c[0]}d?a[c]=d:delete a[c]}},addFeature:function(a){return this.filter.addFeature(a)}})})();CKEDITOR.ELEMENT_MODE_NONE=0;CKEDITOR.ELEMENT_MODE_REPLACE=1;
CKEDITOR.ELEMENT_MODE_APPENDTO=2;CKEDITOR.ELEMENT_MODE_INLINE=3;CKEDITOR.htmlParser=function(){this._={htmlPartsRegex:RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))","g")}};
(function(){var b=/([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,c={checked:1,compact:1,declare:1,defer:1,disabled:1,ismap:1,multiple:1,nohref:1,noresize:1,noshade:1,nowrap:1,readonly:1,selected:1};CKEDITOR.htmlParser.prototype={onTagOpen:function(){},onTagClose:function(){},onText:function(){},onCDATA:function(){},onComment:function(){},parse:function(a){for(var e,d,h=0,f;e=this._.htmlPartsRegex.exec(a);){d=e.index;if(d>h){h=a.substring(h,d);if(f)f.push(h);else this.onText(h)}h=
this._.htmlPartsRegex.lastIndex;if(d=e[1]){d=d.toLowerCase();if(f&&CKEDITOR.dtd.$cdata[d]){this.onCDATA(f.join(""));f=null}if(!f){this.onTagClose(d);continue}}if(f)f.push(e[0]);else if(d=e[3]){d=d.toLowerCase();if(!/="/.test(d)){var j={},i;e=e[4];var l=!!(e&&e.charAt(e.length-1)=="/");if(e)for(;i=b.exec(e);){var n=i[1].toLowerCase();i=i[2]||i[3]||i[4]||"";j[n]=!i&&c[n]?n:i}this.onTagOpen(d,j,l);!f&&CKEDITOR.dtd.$cdata[d]&&(f=[])}}else if(d=e[2])this.onComment(d)}if(a.length>h)this.onText(a.substring(h,
a.length))}}})();
CKEDITOR.htmlParser.basicWriter=CKEDITOR.tools.createClass({$:function(){this._={output:[]}},proto:{openTag:function(b){this._.output.push("<",b)},openTagClose:function(b,c){c?this._.output.push(" />"):this._.output.push(">")},attribute:function(b,c){typeof c=="string"&&(c=CKEDITOR.tools.htmlEncodeAttr(c));this._.output.push(" ",b,'="',c,'"')},closeTag:function(b){this._.output.push("</",b,">")},text:function(b){this._.output.push(b)},comment:function(b){this._.output.push("<\!--",b,"--\>")},write:function(b){this._.output.push(b)},
reset:function(){this._.output=[];this._.indent=false},getHtml:function(b){var c=this._.output.join("");b&&this.reset();return c}}});"use strict";
(function(){CKEDITOR.htmlParser.node=function(){};CKEDITOR.htmlParser.node.prototype={remove:function(){var b=this.parent.children,c=CKEDITOR.tools.indexOf(b,this),a=this.previous,e=this.next;a&&(a.next=e);e&&(e.previous=a);b.splice(c,1);this.parent=null},replaceWith:function(b){var c=this.parent.children,a=CKEDITOR.tools.indexOf(c,this),e=b.previous=this.previous,d=b.next=this.next;e&&(e.next=b);d&&(d.previous=b);c[a]=b;b.parent=this.parent;this.parent=null},insertAfter:function(b){var c=b.parent.children,
a=CKEDITOR.tools.indexOf(c,b),e=b.next;c.splice(a+1,0,this);this.next=b.next;this.previous=b;b.next=this;e&&(e.previous=this);this.parent=b.parent},insertBefore:function(b){var c=b.parent.children,a=CKEDITOR.tools.indexOf(c,b);c.splice(a,0,this);this.next=b;(this.previous=b.previous)&&(b.previous.next=this);b.previous=this;this.parent=b.parent}}})();"use strict";CKEDITOR.htmlParser.comment=function(b){this.value=b;this._={isBlockLike:false}};
CKEDITOR.htmlParser.comment.prototype=CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,{type:CKEDITOR.NODE_COMMENT,filter:function(b){var c=this.value;if(!(c=b.onComment(c,this))){this.remove();return false}if(typeof c!="string"){this.replaceWith(c);return false}this.value=c;return true},writeHtml:function(b,c){c&&this.filter(c);b.comment(this.value)}});"use strict";
(function(){CKEDITOR.htmlParser.text=function(b){this.value=b;this._={isBlockLike:false}};CKEDITOR.htmlParser.text.prototype=CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,{type:CKEDITOR.NODE_TEXT,filter:function(b){if(!(this.value=b.onText(this.value,this))){this.remove();return false}},writeHtml:function(b,c){c&&this.filter(c);b.text(this.value)}})})();"use strict";
(function(){CKEDITOR.htmlParser.cdata=function(b){this.value=b};CKEDITOR.htmlParser.cdata.prototype=CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,{type:CKEDITOR.NODE_TEXT,filter:function(){},writeHtml:function(b){b.write(this.value)}})})();"use strict";CKEDITOR.htmlParser.fragment=function(){this.children=[];this.parent=null;this._={isBlockLike:true,hasInlineStarted:false}};
(function(){function b(a){return a.name=="a"&&a.attributes.href||CKEDITOR.dtd.$removeEmpty[a.name]}var c=CKEDITOR.tools.extend({table:1,ul:1,ol:1,dl:1},CKEDITOR.dtd.table,CKEDITOR.dtd.ul,CKEDITOR.dtd.ol,CKEDITOR.dtd.dl),a={ol:1,ul:1},e=CKEDITOR.tools.extend({},{html:1},CKEDITOR.dtd.html,CKEDITOR.dtd.body,CKEDITOR.dtd.head,{style:1,script:1});CKEDITOR.htmlParser.fragment.fromHtml=function(d,h,f){function j(a){var b;if(p.length>0)for(var c=0;c<p.length;c++){var d=p[c],g=d.name,f=CKEDITOR.dtd[g],e=u.name&&
CKEDITOR.dtd[u.name];if((!e||e[g])&&(!a||!f||f[a]||!CKEDITOR.dtd[a])){if(!b){i();b=1}d=d.clone();d.parent=u;u=d;p.splice(c,1);c--}else if(g==u.name){n(u,u.parent,1);c--}}}function i(){for(;v.length;)n(v.shift(),u)}function l(a){if(a._.isBlockLike&&a.name!="pre"&&a.name!="textarea"){var b=a.children.length,c=a.children[b-1],d;if(c&&c.type==CKEDITOR.NODE_TEXT)(d=CKEDITOR.tools.rtrim(c.value))?c.value=d:a.children.length=b-1}}function n(a,c,d){var c=c||u||g,e=u;if(a.previous===void 0){if(o(c,a)){u=c;
k.onTagOpen(f,{});a.returnPoint=c=u}l(a);(!b(a)||a.children.length)&&c.add(a);a.name=="pre"&&(E=false);a.name=="textarea"&&(m=false)}if(a.returnPoint){u=a.returnPoint;delete a.returnPoint}else u=d?c:e}function o(a,b){if((a==g||a.name=="body")&&f&&(!a.name||CKEDITOR.dtd[a.name][f])){var c,d;return(c=b.attributes&&(d=b.attributes["data-cke-real-element-type"])?d:b.name)&&c in CKEDITOR.dtd.$inline&&!(c in CKEDITOR.dtd.head)&&!b.isOrphan||b.type==CKEDITOR.NODE_TEXT}}function q(a,b){return a in CKEDITOR.dtd.$listItem||
a in CKEDITOR.dtd.$tableContent?a==b||a=="dt"&&b=="dd"||a=="dd"&&b=="dt":false}var k=new CKEDITOR.htmlParser,g=h instanceof CKEDITOR.htmlParser.element?h:typeof h=="string"?new CKEDITOR.htmlParser.element(h):new CKEDITOR.htmlParser.fragment,p=[],v=[],u=g,m=g.name=="textarea",E=g.name=="pre";k.onTagOpen=function(d,g,f,h){g=new CKEDITOR.htmlParser.element(d,g);if(g.isUnknown&&f)g.isEmpty=true;g.isOptionalClose=h;if(b(g))p.push(g);else{if(d=="pre")E=true;else{if(d=="br"&&E){u.add(new CKEDITOR.htmlParser.text("\n"));
return}d=="textarea"&&(m=true)}if(d=="br")v.push(g);else{for(;;){h=(f=u.name)?CKEDITOR.dtd[f]||(u._.isBlockLike?CKEDITOR.dtd.div:CKEDITOR.dtd.span):e;if(!g.isUnknown&&!u.isUnknown&&!h[d])if(u.isOptionalClose)k.onTagClose(f);else if(d in a&&f in a){f=u.children;(f=f[f.length-1])&&f.name=="li"||n(f=new CKEDITOR.htmlParser.element("li"),u);!g.returnPoint&&(g.returnPoint=u);u=f}else if(d in CKEDITOR.dtd.$listItem&&!q(d,f))k.onTagOpen(d=="li"?"ul":"dl",{},0,1);else if(f in c&&!q(d,f)){!g.returnPoint&&
(g.returnPoint=u);u=u.parent}else{f in CKEDITOR.dtd.$inline&&p.unshift(u);if(u.parent)n(u,u.parent,1);else{g.isOrphan=1;break}}else break}j(d);i();g.parent=u;g.isEmpty?n(g):u=g}}};k.onTagClose=function(a){for(var b=p.length-1;b>=0;b--)if(a==p[b].name){p.splice(b,1);return}for(var c=[],d=[],e=u;e!=g&&e.name!=a;){e._.isBlockLike||d.unshift(e);c.push(e);e=e.returnPoint||e.parent}if(e!=g){for(b=0;b<c.length;b++){var h=c[b];n(h,h.parent)}u=e;e._.isBlockLike&&i();n(e,e.parent);if(e==u)u=u.parent;p=p.concat(d)}a==
"body"&&(f=false)};k.onText=function(b){if((!u._.hasInlineStarted||v.length)&&!E&&!m){b=CKEDITOR.tools.ltrim(b);if(b.length===0)return}var d=u.name,g=d?CKEDITOR.dtd[d]||(u._.isBlockLike?CKEDITOR.dtd.div:CKEDITOR.dtd.span):e;if(!m&&!g["#"]&&d in c){k.onTagOpen(d in a?"li":d=="dl"?"dd":d=="table"?"tr":d=="tr"?"td":"");k.onText(b)}else{i();j();!E&&!m&&(b=b.replace(/[\t\r\n ]{2,}|[\t\r\n]/g," "));b=new CKEDITOR.htmlParser.text(b);if(o(u,b))this.onTagOpen(f,{},0,1);u.add(b)}};k.onCDATA=function(a){u.add(new CKEDITOR.htmlParser.cdata(a))};
k.onComment=function(a){i();j();u.add(new CKEDITOR.htmlParser.comment(a))};k.parse(d);for(i(!CKEDITOR.env.ie&&1);u!=g;)n(u,u.parent,1);l(g);return g};CKEDITOR.htmlParser.fragment.prototype={type:CKEDITOR.NODE_DOCUMENT_FRAGMENT,add:function(a,b){isNaN(b)&&(b=this.children.length);var c=b>0?this.children[b-1]:null;if(c){if(a._.isBlockLike&&c.type==CKEDITOR.NODE_TEXT){c.value=CKEDITOR.tools.rtrim(c.value);if(c.value.length===0){this.children.pop();this.add(a);return}}c.next=a}a.previous=c;a.parent=this;
this.children.splice(b,0,a);if(!this._.hasInlineStarted)this._.hasInlineStarted=a.type==CKEDITOR.NODE_TEXT||a.type==CKEDITOR.NODE_ELEMENT&&!a._.isBlockLike},filter:function(a){a.onRoot(this);this.filterChildren(a)},filterChildren:function(a,b){if(this.childrenFilteredBy!=a.id){if(b&&!this.parent)a.onRoot(this);this.childrenFilteredBy=a.id;for(var c=0;c<this.children.length;c++)this.children[c].filter(a)===false&&c--}},writeHtml:function(a,b){b&&this.filter(b);this.writeChildrenHtml(a)},writeChildrenHtml:function(a,
b,c){if(c&&!this.parent&&b)b.onRoot(this);b&&this.filterChildren(b);for(var b=0,c=this.children,e=c.length;b<e;b++)c[b].writeHtml(a)},forEach:function(a,b,c){!c&&(!b||this.type==b)&&a(this);for(var c=this.children,e,i=0,l=c.length;i<l;i++){e=c[i];e.type==CKEDITOR.NODE_ELEMENT?e.forEach(a,b):(!b||e.type==b)&&a(e)}}}})();
(function(){function b(a,b){for(var c=0;a&&c<b.length;c++)var d=b[c],a=a.replace(d[0],d[1]);return a}function c(a,b,c){typeof b=="function"&&(b=[b]);var d,e;e=a.length;var n=b&&b.length;if(n){for(d=0;d<e&&a[d].pri<=c;d++);for(e=n-1;e>=0;e--)if(n=b[e]){n.pri=c;a.splice(d,0,n)}}}function a(a,b,c){if(b)for(var d in b){var l=a[d];a[d]=e(l,b[d],c);l||a.$length++}}function e(a,b,e){if(b){b.pri=e;if(a){if(a.splice)c(a,b,e);else{a=a.pri>e?[b,a]:[a,b];a.filter=d}return a}return b.filter=b}}function d(a){for(var b=
a.type||a instanceof CKEDITOR.htmlParser.fragment,c=0;c<this.length;c++){if(b)var d=a.type,e=a.name;var n=this[c].apply(window,arguments);if(n===false)return n;if(b){if(n&&(n.name!=e||n.type!=d))return n}else if(typeof n!="string")return n;n!=void 0&&(a=n)}return a}CKEDITOR.htmlParser.filter=CKEDITOR.tools.createClass({$:function(a){this.id=CKEDITOR.tools.getNextNumber();this._={elementNames:[],attributeNames:[],elements:{$length:0},attributes:{$length:0}};a&&this.addRules(a,10)},proto:{addRules:function(b,
d){typeof d!="number"&&(d=10);c(this._.elementNames,b.elementNames,d);c(this._.attributeNames,b.attributeNames,d);a(this._.elements,b.elements,d);a(this._.attributes,b.attributes,d);this._.text=e(this._.text,b.text,d)||this._.text;this._.comment=e(this._.comment,b.comment,d)||this._.comment;this._.root=e(this._.root,b.root,d)||this._.root},applyTo:function(a){a.filter(this)},onElementName:function(a){return b(a,this._.elementNames)},onAttributeName:function(a){return b(a,this._.attributeNames)},onText:function(a){var b=
this._.text;return b?b.filter(a):a},onComment:function(a,b){var c=this._.comment;return c?c.filter(a,b):a},onRoot:function(a){var b=this._.root;return b?b.filter(a):a},onElement:function(a){for(var b=[this._.elements["^"],this._.elements[a.name],this._.elements.$],c,d=0;d<3;d++)if(c=b[d]){c=c.filter(a,this);if(c===false)return null;if(c&&c!=a)return this.onNode(c);if(a.parent&&!a.name)break}return a},onNode:function(a){var b=a.type;return b==CKEDITOR.NODE_ELEMENT?this.onElement(a):b==CKEDITOR.NODE_TEXT?
new CKEDITOR.htmlParser.text(this.onText(a.value)):b==CKEDITOR.NODE_COMMENT?new CKEDITOR.htmlParser.comment(this.onComment(a.value)):null},onAttribute:function(a,b,c){if(b=this._.attributes[b]){a=b.filter(c,a,this);if(a===false)return false;if(typeof a!="undefined")return a}return c}}})})();
(function(){function b(b,c){function g(a){return a||CKEDITOR.env.ie?new CKEDITOR.htmlParser.text(" "):new CKEDITOR.htmlParser.element("br",{"data-cke-bogus":1})}function k(b,c){return function(d){if(d.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT){var f=[],k=a(d),p,t;if(k)for(o(k,1)&&f.push(k);k;){if(h(k)&&(p=e(k))&&o(p))if((t=e(p))&&!h(t))f.push(p);else{var q=p,j=g(m),w=q.parent.children,B=CKEDITOR.tools.indexOf(w,q);w.splice(B+1,0,j);w=q.next;q.next=j;j.previous=q;j.parent=q.parent;j.next=w;i(p)}k=k.previous}for(k=
0;k<f.length;k++)i(f[k]);if(f=CKEDITOR.env.opera&&!b||(typeof c=="function"?c(d)!==false:c))if(!m&&CKEDITOR.env.ie&&d.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT)f=false;else if(!m&&CKEDITOR.env.ie&&(document.documentMode>7||d.name in CKEDITOR.dtd.tr||d.name in CKEDITOR.dtd.$listItem))f=false;else{f=a(d);f=!f||d.name=="form"&&f.name=="input"}f&&d.add(g(b))}}}function o(a,b){if((!m||!CKEDITOR.env.ie)&&a.type==CKEDITOR.NODE_ELEMENT&&a.name=="br"&&!a.attributes["data-cke-eol"])return true;var c;if(a.type==
CKEDITOR.NODE_TEXT&&(c=a.value.match(E))){if(c.index){f(a,new CKEDITOR.htmlParser.text(a.value.substring(0,c.index)));a.value=c[0]}if(CKEDITOR.env.ie&&m&&(!b||a.parent.name in t))return true;if(!m)if((c=a.previous)&&c.name=="br"||!c||h(c))return true}return false}var p={elements:{}},m=c=="html",t=CKEDITOR.tools.extend({},z),q;for(q in t)"#"in r[q]||delete t[q];for(q in t)p.elements[q]=k(m,b.config.fillEmptyBlocks!==false);p.root=k(m);p.elements.br=function(a){return function(b){if(b.parent.type!=
CKEDITOR.NODE_DOCUMENT_FRAGMENT){var c=b.attributes;if("data-cke-bogus"in c||"data-cke-eol"in c)delete c["data-cke-bogus"];else{for(c=b.next;c&&d(c);)c=c.next;var k=e(b);!c&&h(b.parent)?j(b.parent,g(a)):h(c)&&(k&&!h(k))&&f(c,g(a))}}}}(m);return p}function c(a){return a.enterMode!=CKEDITOR.ENTER_BR&&a.autoParagraph!==false?a.enterMode==CKEDITOR.ENTER_DIV?"div":"p":false}function a(a){for(a=a.children[a.children.length-1];a&&d(a);)a=a.previous;return a}function e(a){for(a=a.previous;a&&d(a);)a=a.previous;
return a}function d(a){return a.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.trim(a.value)||a.type==CKEDITOR.NODE_ELEMENT&&a.attributes["data-cke-bookmark"]}function h(a){return a&&(a.type==CKEDITOR.NODE_ELEMENT&&a.name in z||a.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT)}function f(a,b){var c=a.parent.children,d=CKEDITOR.tools.indexOf(c,a);c.splice(d,0,b);c=a.previous;a.previous=b;b.next=a;b.parent=a.parent;if(c){b.previous=c;c.next=b}}function j(a,b){var c=a.children[a.children.length-1];a.children.push(b);
b.parent=a;if(c){c.next=b;b.previous=c}}function i(a){var b=a.parent.children,c=CKEDITOR.tools.indexOf(b,a),d=a.previous,a=a.next;d&&(d.next=a);a&&(a.previous=d);b.splice(c,1)}function l(a){var b=a.parent;return b?CKEDITOR.tools.indexOf(b.children,a):-1}function n(a){a=a.attributes;a.contenteditable!="false"&&(a["data-cke-editable"]=a.contenteditable?"true":1);a.contenteditable="false"}function o(a){a=a.attributes;switch(a["data-cke-editable"]){case "true":a.contenteditable="true";break;case "1":delete a.contenteditable}}
function q(a){return a.replace(t,function(a,b,c){return"<"+b+c.replace(w,function(a,b){if(!/^on/.test(b)&&c.indexOf("data-cke-saved-"+b)==-1){a=a.slice(1);return" data-cke-saved-"+a+" data-cke-"+CKEDITOR.rnd+"-"+a}return a})+">"})}function k(a,b){return a.replace(b,function(a,b,c){a.indexOf("<textarea")===0&&(a=b+v(c).replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</textarea>");return"<cke:encoded>"+encodeURIComponent(a)+"</cke:encoded>"})}function g(a){return a.replace(D,function(a,b){return decodeURIComponent(b)})}
function p(a){return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g,function(a){return"<\!--"+A+"{C}"+encodeURIComponent(a).replace(/--/g,"%2D%2D")+"--\>"})}function v(a){return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g,function(a,b){return decodeURIComponent(b)})}function u(a,b){var c=b._.dataStore;return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g,function(a,b){return decodeURIComponent(b)}).replace(/\{cke_protected_(\d+)\}/g,function(a,b){return c&&c[b]||""})}function m(a,
b){for(var c=[],d=b.config.protectedSource,g=b._.dataStore||(b._.dataStore={id:1}),e=/<\!--\{cke_temp(comment)?\}(\d*?)--\>/g,d=[/<script[\s\S]*?<\/script>/gi,/<noscript[\s\S]*?<\/noscript>/gi].concat(d),a=a.replace(/<\!--[\s\S]*?--\>/g,function(a){return"<\!--{cke_tempcomment}"+(c.push(a)-1)+"--\>"}),f=0;f<d.length;f++)a=a.replace(d[f],function(a){a=a.replace(e,function(a,b,d){return c[d]});return/cke_temp(comment)?/.test(a)?a:"<\!--{cke_temp}"+(c.push(a)-1)+"--\>"});a=a.replace(e,function(a,b,d){return"<\!--"+
A+(b?"{C}":"")+encodeURIComponent(c[d]).replace(/--/g,"%2D%2D")+"--\>"});return a.replace(/(['"]).*?\1/g,function(a){return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g,function(a,b){g[g.id]=decodeURIComponent(b);return"{cke_protected_"+g.id++ +"}"})})}CKEDITOR.htmlDataProcessor=function(a){var d,e,f=this;this.editor=a;this.dataFilter=d=new CKEDITOR.htmlParser.filter;this.htmlFilter=e=new CKEDITOR.htmlParser.filter;this.writer=new CKEDITOR.htmlParser.basicWriter;d.addRules(s);d.addRules(b(a,
"data"));e.addRules(C);e.addRules(b(a,"html"));a.on("toHtml",function(b){var b=b.data,d=b.dataValue,d=m(d,a),d=k(d,G),d=q(d),d=k(d,I),d=d.replace(Q,"$1cke:$2"),d=d.replace(F,"<cke:$1$2></cke:$1>"),d=CKEDITOR.env.opera?d:d.replace(/(<pre\b[^>]*>)(\r\n|\n)/g,"$1$2$2"),e=b.context||a.editable().getName(),f;if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&e=="pre"){e="div";d="<pre>"+d+"</pre>";f=1}e=a.document.createElement(e);e.setHtml("a"+d);d=e.getHtml().substr(1);d=d.replace(RegExp(" data-cke-"+CKEDITOR.rnd+
"-","ig")," ");f&&(d=d.replace(/^<pre>|<\/pre>$/gi,""));d=d.replace(L,"$1$2");d=g(d);d=v(d);b.dataValue=CKEDITOR.htmlParser.fragment.fromHtml(d,b.context,b.fixForBody===false?false:c(a.config))},null,null,5);a.on("toHtml",function(a){a.data.dataValue.filterChildren(f.dataFilter,true)},null,null,10);a.on("toHtml",function(a){var a=a.data,b=a.dataValue,c=new CKEDITOR.htmlParser.basicWriter;b.writeChildrenHtml(c);b=c.getHtml(true);a.dataValue=p(b)},null,null,15);a.on("toDataFormat",function(b){b.data.dataValue=
CKEDITOR.htmlParser.fragment.fromHtml(b.data.dataValue,a.editable().getName(),c(a.config))},null,null,5);a.on("toDataFormat",function(a){a.data.dataValue.filterChildren(f.htmlFilter,true)},null,null,10);a.on("toDataFormat",function(b){var c=b.data.dataValue,d=f.writer;d.reset();c.writeChildrenHtml(d);c=d.getHtml(true);c=v(c);c=u(c,a);b.data.dataValue=c},null,null,15)};CKEDITOR.htmlDataProcessor.prototype={toHtml:function(a,b,c,d){var g=this.editor;!b&&b!==null&&(b=g.editable().getName());return g.fire("toHtml",
{dataValue:a,context:b,fixForBody:c,dontFilter:!!d}).dataValue},toDataFormat:function(a){return this.editor.fire("toDataFormat",{dataValue:a}).dataValue}};var E=/(?:&nbsp;|\xa0)$/,A="{cke_protected}",r=CKEDITOR.dtd,x=["caption","colgroup","col","thead","tfoot","tbody"],z=CKEDITOR.tools.extend({},r.$blockLimit,r.$block),s={elements:{},attributeNames:[[/^on/,"data-cke-pa-on"]]},C={elementNames:[[/^cke:/,""],[/^\?xml:namespace$/,""]],attributeNames:[[/^data-cke-(saved|pa)-/,""],[/^data-cke-.*/,""],["hidefocus",
""]],elements:{$:function(a){var b=a.attributes;if(b){if(b["data-cke-temp"])return false;for(var c=["name","href","src"],d,g=0;g<c.length;g++){d="data-cke-saved-"+c[g];d in b&&delete b[c[g]]}}return a},table:function(a){a.children.slice(0).sort(function(a,b){var c,d;if(a.type==CKEDITOR.NODE_ELEMENT&&b.type==a.type){c=CKEDITOR.tools.indexOf(x,a.name);d=CKEDITOR.tools.indexOf(x,b.name)}if(!(c>-1&&d>-1&&c!=d)){c=l(a);d=l(b)}return c>d?1:-1})},embed:function(a){var b=a.parent;if(b&&b.name=="object"){var c=
b.attributes.width,b=b.attributes.height;c&&(a.attributes.width=c);b&&(a.attributes.height=b)}},param:function(a){a.children=[];a.isEmpty=true;return a},a:function(a){if(!a.children.length&&!a.attributes.name&&!a.attributes["data-cke-saved-name"])return false},span:function(a){a.attributes["class"]=="Apple-style-span"&&delete a.name},html:function(a){delete a.attributes.contenteditable;delete a.attributes["class"]},body:function(a){delete a.attributes.spellcheck;delete a.attributes.contenteditable},
style:function(a){var b=a.children[0];b&&b.value&&(b.value=CKEDITOR.tools.trim(b.value));if(!a.attributes.type)a.attributes.type="text/css"},title:function(a){var b=a.children[0];!b&&j(a,b=new CKEDITOR.htmlParser.text);b.value=a.attributes["data-cke-title"]||""}},attributes:{"class":function(a){return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g,""))||false}}};if(CKEDITOR.env.ie)C.attributes.style=function(a){return a.replace(/(^|;)([^\:]+)/g,function(a){return a.toLowerCase()})};for(var y in{input:1,
textarea:1}){s.elements[y]=n;C.elements[y]=o}var t=/<(a|area|img|input|source)\b([^>]*)>/gi,w=/\s(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,I=/(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,G=/(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,D=/<cke:encoded>([^<]*)<\/cke:encoded>/gi,Q=/(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,L=/(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,F=/<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi})();
"use strict";CKEDITOR.htmlParser.element=function(b,c){this.name=b;this.attributes=c||{};this.children=[];var a=b||"",e=a.match(/^cke:(.*)/);e&&(a=e[1]);a=!(!CKEDITOR.dtd.$nonBodyContent[a]&&!CKEDITOR.dtd.$block[a]&&!CKEDITOR.dtd.$listItem[a]&&!CKEDITOR.dtd.$tableContent[a]&&!(CKEDITOR.dtd.$nonEditable[a]||a=="br"));this.isEmpty=!!CKEDITOR.dtd.$empty[b];this.isUnknown=!CKEDITOR.dtd[b];this._={isBlockLike:a,hasInlineStarted:this.isEmpty||!a}};
CKEDITOR.htmlParser.cssStyle=function(b){var c={};((b instanceof CKEDITOR.htmlParser.element?b.attributes.style:b)||"").replace(/&quot;/g,'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(a,b,d){b=="font-family"&&(d=d.replace(/["']/g,""));c[b.toLowerCase()]=d});return{rules:c,populate:function(a){var b=this.toString();if(b)a instanceof CKEDITOR.dom.element?a.setAttribute("style",b):a instanceof CKEDITOR.htmlParser.element?a.attributes.style=b:a.style=b},toString:function(){var a=[],b;
for(b in c)c[b]&&a.push(b,":",c[b],";");return a.join("")}}};
(function(){var b=function(a,b){a=a[0];b=b[0];return a<b?-1:a>b?1:0},c=CKEDITOR.htmlParser.fragment.prototype;CKEDITOR.htmlParser.element.prototype=CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,{type:CKEDITOR.NODE_ELEMENT,add:c.add,clone:function(){return new CKEDITOR.htmlParser.element(this.name,this.attributes)},filter:function(a){var b=this,c,h;if(!b.parent)a.onRoot(b);for(;;){c=b.name;if(!(h=a.onElementName(c))){this.remove();return false}b.name=h;if(!(b=a.onElement(b))){this.remove();return false}if(b!==
this){this.replaceWith(b);return false}if(b.name==c)break;if(b.type!=CKEDITOR.NODE_ELEMENT){this.replaceWith(b);return false}if(!b.name){this.replaceWithChildren();return false}}c=b.attributes;var f,j;for(f in c){j=f;for(h=c[f];;)if(j=a.onAttributeName(f))if(j!=f){delete c[f];f=j}else break;else{delete c[f];break}j&&((h=a.onAttribute(b,j,h))===false?delete c[j]:c[j]=h)}b.isEmpty||this.filterChildren(a);return true},filterChildren:c.filterChildren,writeHtml:function(a,c){c&&this.filter(c);var d=this.name,
h=[],f=this.attributes,j,i;a.openTag(d,f);for(j in f)h.push([j,f[j]]);a.sortAttributes&&h.sort(b);j=0;for(i=h.length;j<i;j++){f=h[j];a.attribute(f[0],f[1])}a.openTagClose(d,this.isEmpty);this.writeChildrenHtml(a);this.isEmpty||a.closeTag(d)},writeChildrenHtml:c.writeChildrenHtml,replaceWithChildren:function(){for(var a=this.children,b=a.length;b;)a[--b].insertAfter(this);this.remove()},forEach:c.forEach})})();
(function(){var b={};CKEDITOR.template=function(c){if(b[c])this.output=b[c];else{var a=c.replace(/'/g,"\\'").replace(/{([^}]+)}/g,function(a,b){return"',data['"+b+"']==undefined?'{"+b+"}':data['"+b+"'],'"});this.output=b[c]=Function("data","buffer","return buffer?buffer.push('"+a+"'):['"+a+"'].join('');")}}})();delete CKEDITOR.loadFullCore;CKEDITOR.instances={};CKEDITOR.document=new CKEDITOR.dom.document(document);
CKEDITOR.add=function(b){CKEDITOR.instances[b.name]=b;b.on("focus",function(){if(CKEDITOR.currentInstance!=b){CKEDITOR.currentInstance=b;CKEDITOR.fire("currentInstance")}});b.on("blur",function(){if(CKEDITOR.currentInstance==b){CKEDITOR.currentInstance=null;CKEDITOR.fire("currentInstance")}});CKEDITOR.fire("instance",null,b)};CKEDITOR.remove=function(b){delete CKEDITOR.instances[b.name]};
(function(){var b={};CKEDITOR.addTemplate=function(c,a){var e=b[c];if(e)return e;e={name:c,source:a};CKEDITOR.fire("template",e);return b[c]=new CKEDITOR.template(e.source)};CKEDITOR.getTemplate=function(c){return b[c]}})();(function(){var b=[];CKEDITOR.addCss=function(c){b.push(c)};CKEDITOR.getCss=function(){return b.join("\n")}})();CKEDITOR.on("instanceDestroyed",function(){CKEDITOR.tools.isEmpty(this.instances)&&CKEDITOR.fire("reset")});CKEDITOR.TRISTATE_ON=1;CKEDITOR.TRISTATE_OFF=2;
CKEDITOR.TRISTATE_DISABLED=0;
(function(){CKEDITOR.inline=function(b,c){if(!CKEDITOR.env.isCompatible)return null;b=CKEDITOR.dom.element.get(b);if(b.getEditor())throw'The editor instance "'+b.getEditor().name+'" is already attached to the provided element.';var a=new CKEDITOR.editor(c,b,CKEDITOR.ELEMENT_MODE_INLINE),e=b.is("textarea")?b:null;if(e){a.setData(e.getValue(),null,true);b=CKEDITOR.dom.element.createFromHtml('<div contenteditable="'+!!a.readOnly+'" class="cke_textarea_inline">'+e.getValue()+"</div>",CKEDITOR.document);
b.insertAfter(e);e.hide();e.$.form&&a._attachToForm()}else a.setData(b.getHtml(),null,true);a.on("loaded",function(){a.fire("uiReady");a.editable(b);a.container=b;a.setData(a.getData(1));a.resetDirty();a.fire("contentDom");a.mode="wysiwyg";a.fire("mode");a.status="ready";a.fireOnce("instanceReady");CKEDITOR.fire("instanceReady",null,a)},null,null,1E4);a.on("destroy",function(){if(e){a.container.clearCustomData();a.container.remove();e.show()}a.element.clearCustomData();delete a.element});return a};
CKEDITOR.inlineAll=function(){var b,c,a;for(a in CKEDITOR.dtd.$editable)for(var e=CKEDITOR.document.getElementsByTag(a),d=0,h=e.count();d<h;d++){b=e.getItem(d);if(b.getAttribute("contenteditable")=="true"){c={element:b,config:{}};CKEDITOR.fire("inline",c)!==false&&CKEDITOR.inline(b,c.config)}}};CKEDITOR.domReady(function(){!CKEDITOR.disableAutoInline&&CKEDITOR.inlineAll()})})();CKEDITOR.replaceClass="ckeditor";
(function(){function b(b,e,f,j){if(!CKEDITOR.env.isCompatible)return null;b=CKEDITOR.dom.element.get(b);if(b.getEditor())throw'The editor instance "'+b.getEditor().name+'" is already attached to the provided element.';var i=new CKEDITOR.editor(e,b,j);if(j==CKEDITOR.ELEMENT_MODE_REPLACE){b.setStyle("visibility","hidden");i._.required=b.hasAttribute("required");b.removeAttribute("required")}f&&i.setData(f,null,true);i.on("loaded",function(){a(i);j==CKEDITOR.ELEMENT_MODE_REPLACE&&(i.config.autoUpdateElement&&
b.$.form)&&i._attachToForm();i.setMode(i.config.startupMode,function(){i.resetDirty();i.status="ready";i.fireOnce("instanceReady");CKEDITOR.fire("instanceReady",null,i)})});i.on("destroy",c);return i}function c(){var a=this.container,b=this.element;if(a){a.clearCustomData();a.remove()}if(b){b.clearCustomData();if(this.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE){b.show();this._.required&&b.setAttribute("required","required")}delete this.element}}function a(a){var b=a.name,c=a.element,j=a.elementMode,
i=a.fire("uiSpace",{space:"top",html:""}).html,l=a.fire("uiSpace",{space:"bottom",html:""}).html;e||(e=CKEDITOR.addTemplate("maincontainer",'<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} '+CKEDITOR.env.cssClass+'"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
b=CKEDITOR.dom.element.createFromHtml(e.output({id:a.id,name:b,langDir:a.lang.dir,langCode:a.langCode,voiceLabel:[a.lang.editor,a.name].join(", "),topHtml:i?'<span id="'+a.ui.spaceId("top")+'" class="cke_top cke_reset_all" role="presentation" style="height:auto">'+i+"</span>":"",contentId:a.ui.spaceId("contents"),bottomHtml:l?'<span id="'+a.ui.spaceId("bottom")+'" class="cke_bottom cke_reset_all" role="presentation">'+l+"</span>":"",outerEl:CKEDITOR.env.ie?"span":"div"}));if(j==CKEDITOR.ELEMENT_MODE_REPLACE){c.hide();
b.insertAfter(c)}else c.append(b);a.container=b;i&&a.ui.space("top").unselectable();l&&a.ui.space("bottom").unselectable();c=a.config.width;j=a.config.height;c&&b.setStyle("width",CKEDITOR.tools.cssLength(c));j&&a.ui.space("contents").setStyle("height",CKEDITOR.tools.cssLength(j));b.disableContextMenu();CKEDITOR.env.webkit&&b.on("focus",function(){a.focus()});a.fireOnce("uiReady")}CKEDITOR.replace=function(a,c){return b(a,c,null,CKEDITOR.ELEMENT_MODE_REPLACE)};CKEDITOR.appendTo=function(a,c,e){return b(a,
c,e,CKEDITOR.ELEMENT_MODE_APPENDTO)};CKEDITOR.replaceAll=function(){for(var a=document.getElementsByTagName("textarea"),b=0;b<a.length;b++){var c=null,e=a[b];if(e.name||e.id){if(typeof arguments[0]=="string"){if(!RegExp("(?:^|\\s)"+arguments[0]+"(?:$|\\s)").test(e.className))continue}else if(typeof arguments[0]=="function"){c={};if(arguments[0](e,c)===false)continue}this.replace(e,c)}}};CKEDITOR.editor.prototype.addMode=function(a,b){(this._.modes||(this._.modes={}))[a]=b};CKEDITOR.editor.prototype.setMode=
function(a,b){var c=this,e=this._.modes;if(!(a==c.mode||!e||!e[a])){c.fire("beforeSetMode",a);if(c.mode){var i=c.checkDirty();c._.previousMode=c.mode;c.fire("beforeModeUnload");c.editable(0);c.ui.space("contents").setHtml("");c.mode=""}this._.modes[a](function(){c.mode=a;i!==void 0&&!i&&c.resetDirty();setTimeout(function(){c.fire("mode");b&&b.call(c)},0)})}};CKEDITOR.editor.prototype.resize=function(a,b,c,e){var i=this.container,l=this.ui.space("contents"),n=CKEDITOR.env.webkit&&this.document&&this.document.getWindow().$.frameElement,
e=e?i.getChild(1):i;e.setSize("width",a,true);n&&(n.style.width="1%");l.setStyle("height",Math.max(b-(c?0:(e.$.offsetHeight||0)-(l.$.clientHeight||0)),0)+"px");n&&(n.style.width="100%");this.fire("resize")};CKEDITOR.editor.prototype.getResizable=function(a){return a?this.ui.space("contents"):this.container};var e;CKEDITOR.domReady(function(){CKEDITOR.replaceClass&&CKEDITOR.replaceAll(CKEDITOR.replaceClass)})})();CKEDITOR.config.startupMode="wysiwyg";
(function(){function b(b){var c=b.editor,d=c.editable(),g=b.data.path,e=g.blockLimit,f=b.data.selection.getRanges()[0],h=c.config.enterMode;if(CKEDITOR.env.gecko){var m=g.block||g.blockLimit||g.root,i=m&&m.getLast(a);m&&(m.isBlockBoundary()&&(!i||!(i.type==CKEDITOR.NODE_ELEMENT&&i.isBlockBoundary()))&&!m.is("pre")&&!m.getBogus())&&m.appendBogus()}if(c.config.autoParagraph!==false&&h!=CKEDITOR.ENTER_BR&&f.collapsed&&d.equals(e)&&!g.block){d=f.clone();d.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);g=new CKEDITOR.dom.walker(d);
g.guard=function(b){return!a(b)||b.type==CKEDITOR.NODE_COMMENT||b.isReadOnly()};if(!g.checkForward()||d.checkStartOfBlock()&&d.checkEndOfBlock()){c=f.fixBlock(true,c.config.enterMode==CKEDITOR.ENTER_DIV?"div":"p");if(CKEDITOR.env.ie)(c=c.getFirst(a))&&(c.type==CKEDITOR.NODE_TEXT&&CKEDITOR.tools.trim(c.getText()).match(/^(?:&nbsp;|\xa0)$/))&&c.remove();f.select();b.cancel()}}}function c(a){var b=a.data.getTarget();if(b.is("input")){b=b.getAttribute("type");(b=="submit"||b=="reset")&&a.data.preventDefault()}}
function a(a){return i(a)&&l(a)}function e(a,b){return function(c){var d=CKEDITOR.dom.element.get(c.data.$.toElement||c.data.$.fromElement||c.data.$.relatedTarget);(!d||!b.equals(d)&&!b.contains(d))&&a.call(this,c)}}function d(b){var c,d=b.getRanges()[0],b=b.root,g=d.startPath(),e={table:1,ul:1,ol:1,dl:1},f=CKEDITOR.dom.walker.bogus();if(g.contains(e)){var h=d.clone();h.collapse(1);h.setStartAt(b,CKEDITOR.POSITION_AFTER_START);h=new CKEDITOR.dom.walker(h);g=function(b,d){return function(b,g){g&&(b.type==
CKEDITOR.NODE_ELEMENT&&b.is(e))&&(c=b);if(a(b)&&!g&&(!d||!f(b)))return false}};h.guard=g(h);h.checkBackward();if(c){h=d.clone();h.collapse();h.setEndAt(b,CKEDITOR.POSITION_BEFORE_END);h=new CKEDITOR.dom.walker(h);h.guard=g(h,1);c=0;h.checkForward();return c}}return null}function h(a){a.editor.focus();a.editor.fire("saveSnapshot")}function f(a,b){var c=a.editor;!b&&c.getSelection().scrollIntoView();setTimeout(function(){c.fire("saveSnapshot")},0)}CKEDITOR.editable=CKEDITOR.tools.createClass({base:CKEDITOR.dom.element,
$:function(a,b){this.base(b.$||b);this.editor=a;this.hasFocus=false;this.setup()},proto:{focus:function(){this.$[CKEDITOR.env.ie&&this.getDocument().equals(CKEDITOR.document)?"setActive":"focus"]();CKEDITOR.env.safari&&!this.isInline()&&(CKEDITOR.document.getActive().equals(this.getWindow().getFrame())||this.getWindow().focus())},on:function(a,b){var c=Array.prototype.slice.call(arguments,0);if(CKEDITOR.env.ie&&/^focus|blur$/.exec(a)){a=a=="focus"?"focusin":"focusout";b=e(b,this);c[0]=a;c[1]=b}return CKEDITOR.dom.element.prototype.on.apply(this,
c)},attachListener:function(a,b,c,d,e,f){!this._.listeners&&(this._.listeners=[]);var h=Array.prototype.slice.call(arguments,1);this._.listeners.push(a.on.apply(a,h))},clearListeners:function(){var a=this._.listeners;try{for(;a.length;)a.pop().removeListener()}catch(b){}},restoreAttrs:function(){var a=this._.attrChanges,b,c;for(c in a)if(a.hasOwnProperty(c)){b=a[c];b!==null?this.setAttribute(c,b):this.removeAttribute(c)}},attachClass:function(a){var b=this.getCustomData("classes");if(!this.hasClass(a)){!b&&
(b=[]);b.push(a);this.setCustomData("classes",b);this.addClass(a)}},changeAttr:function(a,b){var c=this.getAttribute(a);if(b!==c){!this._.attrChanges&&(this._.attrChanges={});a in this._.attrChanges||(this._.attrChanges[a]=c);this.setAttribute(a,b)}},insertHtml:function(a,b){h(this);n(this,b||"html",a)},insertText:function(a){h(this);var b=this.editor,c=b.getSelection().getStartElement().hasAscendant("pre",true)?CKEDITOR.ENTER_BR:b.config.enterMode,b=c==CKEDITOR.ENTER_BR,d=CKEDITOR.tools,a=d.htmlEncode(a.replace(/\r\n/g,
"\n")),a=a.replace(/\t/g,"&nbsp;&nbsp; &nbsp;"),c=c==CKEDITOR.ENTER_P?"p":"div";if(!b){var e=/\n{2}/g;if(e.test(a))var f="<"+c+">",i="</"+c+">",a=f+a.replace(e,function(){return i+f})+i}a=a.replace(/\n/g,"<br>");b||(a=a.replace(RegExp("<br>(?=</"+c+">)"),function(a){return d.repeat(a,2)}));a=a.replace(/^ | $/g,"&nbsp;");a=a.replace(/(>|\s) /g,function(a,b){return b+"&nbsp;"}).replace(/ (?=<)/g,"&nbsp;");n(this,"text",a)},insertElement:function(b){h(this);for(var c=this.editor,d=c.config.enterMode,
g=c.getSelection(),e=g.getRanges(),i=b.getName(),j=CKEDITOR.dtd.$block[i],m,n,l,r=e.length-1;r>=0;r--){m=e[r];if(!m.checkReadOnly()){m.deleteContents(1);n=!r&&b||b.clone(1);var x,z;if(j)for(;(x=m.getCommonAncestor(0,1))&&(z=CKEDITOR.dtd[x.getName()])&&(!z||!z[i]);)if(x.getName()in CKEDITOR.dtd.span)m.splitElement(x);else if(m.checkStartOfBlock()&&m.checkEndOfBlock()){m.setStartBefore(x);m.collapse(true);x.remove()}else m.splitBlock(d==CKEDITOR.ENTER_DIV?"div":"p",c.editable());m.insertNode(n);l||
(l=n)}}if(l){m.moveToPosition(l,CKEDITOR.POSITION_AFTER_END);if(j)if((b=l.getNext(a))&&b.type==CKEDITOR.NODE_ELEMENT&&b.is(CKEDITOR.dtd.$block))b.getDtd()["#"]?m.moveToElementEditStart(b):m.moveToElementEditEnd(l);else if(!b&&d!=CKEDITOR.ENTER_BR){b=m.fixBlock(true,d==CKEDITOR.ENTER_DIV?"div":"p");m.moveToElementEditStart(b)}}g.selectRanges([m]);f(this,CKEDITOR.env.opera)},setData:function(a,b){!b&&this.editor.dataProcessor&&(a=this.editor.dataProcessor.toHtml(a));this.setHtml(a);this.editor.fire("dataReady")},
getData:function(a){var b=this.getHtml();!a&&this.editor.dataProcessor&&(b=this.editor.dataProcessor.toDataFormat(b));return b},setReadOnly:function(a){this.setAttribute("contenteditable",!a)},detach:function(){this.removeClass("cke_editable");var a=this.editor;this._.detach();delete a.document;delete a.window},isInline:function(){return this.getDocument().equals(CKEDITOR.document)},setup:function(){var a=this.editor;this.attachListener(a,"beforeGetData",function(){var b=this.getData();this.is("textarea")||
a.config.ignoreEmptyParagraph!==false&&(b=b.replace(j,function(a,b){return b}));a.setData(b,null,1)},this);this.attachListener(a,"getSnapshot",function(a){a.data=this.getData(1)},this);this.attachListener(a,"afterSetData",function(){this.setData(a.getData(1))},this);this.attachListener(a,"loadSnapshot",function(a){this.setData(a.data,1)},this);this.attachListener(a,"beforeFocus",function(){var b=a.getSelection();(b=b&&b.getNative())&&b.type=="Control"||this.focus()},this);this.attachListener(a,"insertHtml",
function(a){this.insertHtml(a.data.dataValue,a.data.mode)},this);this.attachListener(a,"insertElement",function(a){this.insertElement(a.data)},this);this.attachListener(a,"insertText",function(a){this.insertText(a.data)},this);this.setReadOnly(a.readOnly);this.attachClass("cke_editable");this.attachClass(a.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?"cke_editable_inline":a.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE||a.elementMode==CKEDITOR.ELEMENT_MODE_APPENDTO?"cke_editable_themed":"");this.attachClass("cke_contents_"+
a.config.contentsLangDirection);a.keystrokeHandler.blockedKeystrokes[8]=+a.readOnly;a.keystrokeHandler.attach(this);this.on("blur",function(a){CKEDITOR.env.opera&&CKEDITOR.document.getActive().equals(this.isInline()?this:this.getWindow().getFrame())?a.cancel():this.hasFocus=false},null,null,-1);this.on("focus",function(){this.hasFocus=true},null,null,-1);a.focusManager.add(this);if(this.equals(CKEDITOR.document.getActive())){this.hasFocus=true;a.once("contentDom",function(){a.focusManager.focus()})}this.isInline()&&
this.changeAttr("tabindex",a.tabIndex);if(!this.is("textarea")){a.document=this.getDocument();a.window=this.getWindow();var b=a.document;this.changeAttr("spellcheck",!a.config.disableNativeSpellChecker);var e=a.config.contentsLangDirection;this.getDirection(1)!=e&&this.changeAttr("dir",e);var g=CKEDITOR.getCss();if(g){e=b.getHead();if(!e.getCustomData("stylesheet")){g=b.appendStyleText(g);g=new CKEDITOR.dom.element(g.ownerNode||g.owningElement);e.setCustomData("stylesheet",g);g.data("cke-temp",1)}}e=
b.getCustomData("stylesheet_ref")||0;b.setCustomData("stylesheet_ref",e+1);this.setCustomData("cke_includeReadonly",!a.config.disableReadonlyStyling);this.attachListener(this,"click",function(a){var a=a.data,b=a.getTarget();b.is("a")&&(a.$.button!=2&&b.isReadOnly())&&a.preventDefault()});this.attachListener(a,"key",function(b){if(a.readOnly)return true;var c=b.data.keyCode,g;if(c in{8:1,46:1}){var e=a.getSelection(),b=e.getRanges()[0],f=b.startPath(),k,h,j,c=c==8;if(e=d(e)){a.fire("saveSnapshot");
b.moveToPosition(e,CKEDITOR.POSITION_BEFORE_START);e.remove();b.select();a.fire("saveSnapshot");g=1}else if(b.collapsed)if((k=f.block)&&b[c?"checkStartOfBlock":"checkEndOfBlock"]()&&(j=k[c?"getPrevious":"getNext"](i))&&j.is("table")){a.fire("saveSnapshot");b[c?"checkEndOfBlock":"checkStartOfBlock"]()&&k.remove();b["moveToElementEdit"+(c?"End":"Start")](j);b.select();a.fire("saveSnapshot");g=1}else if(f.blockLimit&&f.blockLimit.is("td")&&(h=f.blockLimit.getAscendant("table"))&&b.checkBoundaryOfElement(h,
c?CKEDITOR.START:CKEDITOR.END)&&(j=h[c?"getPrevious":"getNext"](i))){a.fire("saveSnapshot");b["moveToElementEdit"+(c?"End":"Start")](j);b.checkStartOfBlock()&&b.checkEndOfBlock()?j.remove():b.select();a.fire("saveSnapshot");g=1}else if((h=f.contains(["td","th","caption"]))&&b.checkBoundaryOfElement(h,c?CKEDITOR.START:CKEDITOR.END))g=1}return!g});CKEDITOR.env.ie&&this.attachListener(this,"click",c);!CKEDITOR.env.ie&&!CKEDITOR.env.opera&&this.attachListener(this,"mousedown",function(b){var c=b.data.getTarget();
if(c.is("img","hr","input","textarea","select")){a.getSelection().selectElement(c);c.is("input","textarea","select")&&b.data.preventDefault()}});CKEDITOR.env.gecko&&this.attachListener(this,"mouseup",function(b){if(b.data.$.button==2){b=b.data.getTarget();if(!b.getOuterHtml().replace(j,"")){var c=a.createRange();c.moveToElementEditStart(b);c.select(true)}}});if(CKEDITOR.env.webkit){this.attachListener(this,"click",function(a){a.data.getTarget().is("input","select")&&a.data.preventDefault()});this.attachListener(this,
"mouseup",function(a){a.data.getTarget().is("input","textarea")&&a.data.preventDefault()})}}}},_:{detach:function(){this.editor.setData(this.editor.getData(),0,1);this.clearListeners();this.restoreAttrs();var a;if(a=this.removeCustomData("classes"))for(;a.length;)this.removeClass(a.pop());a=this.getDocument();var b=a.getHead();if(b.getCustomData("stylesheet")){var c=a.getCustomData("stylesheet_ref");if(--c)a.setCustomData("stylesheet_ref",c);else{a.removeCustomData("stylesheet_ref");b.removeCustomData("stylesheet").remove()}}delete this.editor}}});
CKEDITOR.editor.prototype.editable=function(a){var b=this._.editable;if(b&&a)return 0;if(arguments.length)b=this._.editable=a?a instanceof CKEDITOR.editable?a:new CKEDITOR.editable(this,a):(b&&b.detach(),null);return b};var j=/(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,i=CKEDITOR.dom.walker.whitespaces(true),l=CKEDITOR.dom.walker.bookmark(false,true);CKEDITOR.on("instanceLoaded",function(a){var c=a.editor;c.on("insertElement",
function(a){a=a.data;if(a.type==CKEDITOR.NODE_ELEMENT&&(a.is("input")||a.is("textarea"))){a.getAttribute("contentEditable")!="false"&&a.data("cke-editable",a.hasAttribute("contenteditable")?"true":"1");a.setAttribute("contentEditable",false)}});c.on("selectionChange",function(a){if(!c.readOnly){var d=c.getSelection();if(d&&!d.isLocked){d=c.checkDirty();c.fire("lockSnapshot");b(a);c.fire("unlockSnapshot");!d&&c.resetDirty()}}})});CKEDITOR.on("instanceCreated",function(a){var b=a.editor;b.on("mode",
function(){var a=b.editable();if(a&&a.isInline()){var c=b.title;a.changeAttr("role","textbox");a.changeAttr("aria-label",c);c&&a.changeAttr("title",c);if(c=this.ui.space(this.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?"top":"contents")){var d=CKEDITOR.tools.getNextId(),e=CKEDITOR.dom.element.createFromHtml('<span id="'+d+'" class="cke_voice_label">'+this.lang.common.editorHelp+"</span>");c.append(e);a.changeAttr("aria-describedby",d)}}})});CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
var n=function(){function b(a){return a.type==CKEDITOR.NODE_ELEMENT}function c(a,d){var g,e,f,h,k=[],m=d.range.startContainer;g=d.range.startPath();for(var m=i[m.getName()],p=0,j=a.getChildren(),n=j.count(),l=-1,v=-1,E=0,A=g.contains(i.$list);p<n;++p){g=j.getItem(p);if(b(g)){f=g.getName();if(A&&f in CKEDITOR.dtd.$list)k=k.concat(c(g,d));else{h=!!m[f];if(f=="br"&&g.data("cke-eol")&&(!p||p==n-1)){E=(e=p?k[p-1].node:j.getItem(p+1))&&(!b(e)||!e.is("br"));e=e&&b(e)&&i.$block[e.getName()]}l==-1&&!h&&(l=
p);h||(v=p);k.push({isElement:1,isLineBreak:E,isBlock:g.isBlockBoundary(),hasBlockSibling:e,node:g,name:f,allowed:h});e=E=0}}else k.push({isElement:0,node:g,allowed:1})}if(l>-1)k[l].firstNotAllowed=1;if(v>-1)k[v].lastNotAllowed=1;return k}function d(a,c){var g=[],e=a.getChildren(),f=e.count(),h,m=0,p=i[c],j=!a.is(i.$inline)||a.is("br");for(j&&g.push(" ");m<f;m++){h=e.getItem(m);b(h)&&!h.is(p)?g=g.concat(d(h,c)):g.push(h)}j&&g.push(" ");return g}function g(a){return a&&b(a)&&(a.is(i.$removeEmpty)||
a.is("a")&&!a.isBlockBoundary())}function e(a,c,d,g){var f=a.clone(),h,k;f.setEndAt(c,CKEDITOR.POSITION_BEFORE_END);if((h=(new CKEDITOR.dom.walker(f)).next())&&b(h)&&m[h.getName()]&&(k=h.getPrevious())&&b(k)&&!k.getParent().equals(a.startContainer)&&d.contains(k)&&g.contains(h)&&h.isIdentical(k)){h.moveChildren(k);h.remove();e(a,c,d,g)}}function h(a,c){function d(a,c){if(c.isBlock&&c.isElement&&!c.node.is("br")&&b(a)&&a.is("br")){a.remove();return 1}}var g=c.endContainer.getChild(c.endOffset),e=c.endContainer.getChild(c.endOffset-
1);g&&d(g,a[a.length-1]);if(e&&d(e,a[0])){c.setEnd(c.endContainer,c.endOffset-1);c.collapse()}}var i=CKEDITOR.dtd,m={p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,ul:1,ol:1,li:1,pre:1,dl:1,blockquote:1},j={p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1},n=CKEDITOR.tools.extend({},i.$inline);delete n.br;return function(m,l,z){var s=m.editor;m.getDocument();var C=s.getSelection().getRanges()[0],y=false;if(l=="unfiltered_html"){l="html";y=true}if(!C.checkReadOnly()){var t=(new CKEDITOR.dom.elementPath(C.startContainer,
C.root)).blockLimit||C.root,l={type:l,dontFilter:y,editable:m,editor:s,range:C,blockLimit:t,mergeCandidates:[],zombies:[]},s=l.range,y=l.mergeCandidates,w,I,G,D;if(l.type=="text"&&s.shrink(CKEDITOR.SHRINK_ELEMENT,true,false)){w=CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>",s.document);s.insertNode(w);s.setStartAfter(w)}I=new CKEDITOR.dom.elementPath(s.startContainer);l.endPath=G=new CKEDITOR.dom.elementPath(s.endContainer);if(!s.collapsed){var t=G.block||G.blockLimit,Q=s.getCommonAncestor();
t&&(!t.equals(Q)&&!t.contains(Q)&&s.checkEndOfBlock())&&l.zombies.push(t);s.deleteContents()}for(;(D=b(s.startContainer)&&s.startContainer.getChild(s.startOffset-1))&&b(D)&&D.isBlockBoundary()&&I.contains(D);)s.moveToPosition(D,CKEDITOR.POSITION_BEFORE_END);e(s,l.blockLimit,I,G);if(w){s.setEndBefore(w);s.collapse();w.remove()}w=s.startPath();if(t=w.contains(g,false,1)){s.splitElement(t);l.inlineStylesRoot=t;l.inlineStylesPeak=w.lastElement}w=s.createBookmark();(t=w.startNode.getPrevious(a))&&b(t)&&
g(t)&&y.push(t);(t=w.startNode.getNext(a))&&b(t)&&g(t)&&y.push(t);for(t=w.startNode;(t=t.getParent())&&g(t);)y.push(t);s.moveToBookmark(w);if(w=z){w=l.range;if(l.type=="text"&&l.inlineStylesRoot){D=l.inlineStylesPeak;s=D.getDocument().createText("{cke-peak}");for(y=l.inlineStylesRoot.getParent();!D.equals(y);){s=s.appendTo(D.clone());D=D.getParent()}z=s.getOuterHtml().split("{cke-peak}").join(z)}D=l.blockLimit.getName();if(/^\s+|\s+$/.test(z)&&"span"in CKEDITOR.dtd[D])var L='<span data-cke-marker="1">&nbsp;</span>',
z=L+z+L;z=l.editor.dataProcessor.toHtml(z,null,false,l.dontFilter);D=w.document.createElement("body");D.setHtml(z);if(L){D.getFirst().remove();D.getLast().remove()}if((L=w.startPath().block)&&!(L.getChildCount()==1&&L.getBogus()))a:{var F;if(D.getChildCount()==1&&b(F=D.getFirst())&&F.is(j)){L=F.getElementsByTag("*");w=0;for(y=L.count();w<y;w++){s=L.getItem(w);if(!s.is(n))break a}F.moveChildren(F.getParent(1));F.remove()}}l.dataWrapper=D;w=z}if(w){F=l.range;var L=F.document,B,z=l.blockLimit;w=0;var J;
D=[];var H,N,y=s=0,K,O;I=F.startContainer;var t=l.endPath.elements[0],P;G=t.getPosition(I);Q=!!t.getCommonAncestor(I)&&G!=CKEDITOR.POSITION_IDENTICAL&&!(G&CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_IS_CONTAINED);I=c(l.dataWrapper,l);for(h(I,F);w<I.length;w++){G=I[w];if(B=G.isLineBreak){B=F;K=z;var M=void 0,R=void 0;if(G.hasBlockSibling)B=1;else{M=B.startContainer.getAscendant(i.$block,1);if(!M||!M.is({div:1,p:1}))B=0;else{R=M.getPosition(K);if(R==CKEDITOR.POSITION_IDENTICAL||R==CKEDITOR.POSITION_CONTAINS)B=
0;else{K=B.splitElement(M);B.moveToPosition(K,CKEDITOR.POSITION_AFTER_START);B=1}}}}if(B)y=w>0;else{B=F.startPath();if(!G.isBlock&&(N=l.editor.config.enterMode!=CKEDITOR.ENTER_BR&&l.editor.config.autoParagraph!==false?l.editor.config.enterMode==CKEDITOR.ENTER_DIV?"div":"p":false)&&!B.block&&B.blockLimit&&B.blockLimit.equals(F.root)){N=L.createElement(N);!CKEDITOR.env.ie&&N.appendBogus();F.insertNode(N);!CKEDITOR.env.ie&&(J=N.getBogus())&&J.remove();F.moveToPosition(N,CKEDITOR.POSITION_BEFORE_END)}if((B=
F.startPath().block)&&!B.equals(H)){if(J=B.getBogus()){J.remove();D.push(B)}H=B}G.firstNotAllowed&&(s=1);if(s&&G.isElement){B=F.startContainer;for(K=null;B&&!i[B.getName()][G.name];){if(B.equals(z)){B=null;break}K=B;B=B.getParent()}if(B){if(K){O=F.splitElement(K);l.zombies.push(O);l.zombies.push(K)}}else{K=z.getName();P=!w;B=w==I.length-1;K=d(G.node,K);for(var M=[],R=K.length,T=0,U=void 0,V=0,W=-1;T<R;T++){U=K[T];if(U==" "){if(!V&&(!P||T)){M.push(new CKEDITOR.dom.text(" "));W=M.length}V=1}else{M.push(U);
V=0}}B&&W==M.length&&M.pop();P=M}}if(P){for(;B=P.pop();)F.insertNode(B);P=0}else F.insertNode(G.node);if(G.lastNotAllowed&&w<I.length-1){(O=Q?t:O)&&F.setEndAt(O,CKEDITOR.POSITION_AFTER_START);s=0}F.collapse()}}l.dontMoveCaret=y;l.bogusNeededBlocks=D}J=l.range;var S;O=l.bogusNeededBlocks;for(P=J.createBookmark();H=l.zombies.pop();)if(H.getParent()){N=J.clone();N.moveToElementEditStart(H);N.removeEmptyBlocksAtEnd()}if(O)for(;H=O.pop();)H.append(CKEDITOR.env.ie?J.document.createText(" "):J.document.createElement("br"));
for(;H=l.mergeCandidates.pop();)H.mergeSiblings();J.moveToBookmark(P);if(!l.dontMoveCaret){for(H=b(J.startContainer)&&J.startContainer.getChild(J.startOffset-1);H&&b(H)&&!H.is(i.$empty);){if(H.isBlockBoundary())J.moveToPosition(H,CKEDITOR.POSITION_BEFORE_END);else{if(g(H)&&H.getHtml().match(/(\s|&nbsp;)$/g)){S=null;break}S=J.clone();S.moveToPosition(H,CKEDITOR.POSITION_BEFORE_END)}H=H.getLast(a)}S&&J.moveToRange(S)}C.select();f(m)}}}()})();
(function(){function b(){var a=this.getSelection(1);if(a.getType()!=CKEDITOR.SELECTION_NONE){this.fire("selectionCheck",a);var b=this.elementPath();if(!b.compare(this._.selectionPreviousPath)){this._.selectionPreviousPath=b;this.fire("selectionChange",{selection:a,path:b})}}}function c(){l=true;if(!i){a.call(this);i=CKEDITOR.tools.setTimeout(a,200,this)}}function a(){i=null;if(l){CKEDITOR.tools.setTimeout(b,0,this);l=false}}function e(a){function b(c,d){return!c||c.type==CKEDITOR.NODE_TEXT?false:
a.clone()["moveToElementEdit"+(d?"End":"Start")](c)}if(!(a.root instanceof CKEDITOR.editable))return false;var c=a.startContainer,d=a.getPreviousNode(n,null,c),e=a.getNextNode(n,null,c);return b(d)||b(e,1)||!d&&!e&&!(c.type==CKEDITOR.NODE_ELEMENT&&c.isBlockBoundary()&&c.getBogus())?true:false}function d(a){return a.getCustomData("cke-fillingChar")}function h(a,b){var c=a&&a.removeCustomData("cke-fillingChar");if(c){if(b!==false){var d,e=a.getDocument().getSelection().getNative(),h=e&&e.type!="None"&&
e.getRangeAt(0);if(c.getLength()>1&&h&&h.intersectsNode(c.$)){d=[e.anchorOffset,e.focusOffset];h=e.focusNode==c.$&&e.focusOffset>0;e.anchorNode==c.$&&e.anchorOffset>0&&d[0]--;h&&d[1]--;var i;h=e;if(!h.isCollapsed){i=h.getRangeAt(0);i.setStart(h.anchorNode,h.anchorOffset);i.setEnd(h.focusNode,h.focusOffset);i=i.collapsed}i&&d.unshift(d.pop())}}c.setText(f(c.getText()));if(d){c=e.getRangeAt(0);c.setStart(c.startContainer,d[0]);c.setEnd(c.startContainer,d[1]);e.removeAllRanges();e.addRange(c)}}}function f(a){return a.replace(/\u200B( )?/g,
function(a){return a[1]?" ":""})}function j(a,b,c){var d=a.on("focus",function(a){a.cancel()},null,null,-100);if(CKEDITOR.env.ie)var e=a.getDocument().on("selectionchange",function(a){a.cancel()},null,null,-100);else{var f=new CKEDITOR.dom.range(a);f.moveToElementEditStart(a);var h=a.getDocument().$.createRange();h.setStart(f.startContainer.$,f.startOffset);h.collapse(1);b.removeAllRanges();b.addRange(h)}c&&a.focus();d.removeListener();e&&e.removeListener()}var i,l,n=CKEDITOR.dom.walker.invisible(1);
CKEDITOR.on("instanceCreated",function(a){function d(){var a=e.getSelection();a&&a.removeAllRanges()}var e=a.editor;e.define("selectionChange",{errorProof:1});e.on("contentDom",function(){var a=e.document,d=CKEDITOR.document,g=e.editable(),f=a.getBody(),k=a.getDocumentElement(),i=g.isInline(),j;CKEDITOR.env.gecko&&g.attachListener(g,"focus",function(a){a.removeListener();if(j!==0){a=e.getSelection().getNative();if(a.isCollapsed&&a.anchorNode==g.$){a=e.createRange();a.moveToElementEditStart(g);a.select()}}},
null,null,-2);g.attachListener(g,"focus",function(){e.unlockSelection(j);j=0},null,null,-1);g.attachListener(g,"mousedown",function(){j=0});if(CKEDITOR.env.ie||CKEDITOR.env.opera||i){var l,n=function(){l=e.getSelection(1);l.lock()};o?g.attachListener(g,"beforedeactivate",n,null,null,-1):g.attachListener(e,"selectionCheck",n,null,null,-1);g.attachListener(g,"blur",function(){e.lockSelection(l);j=1},null,null,-1)}if(CKEDITOR.env.ie&&!i){var q;g.attachListener(g,"mousedown",function(a){a.data.$.button==
2&&e.document.$.selection.type=="None"&&(q=e.window.getScrollPosition())});g.attachListener(g,"mouseup",function(a){if(a.data.$.button==2&&q){e.document.$.documentElement.scrollLeft=q.x;e.document.$.documentElement.scrollTop=q.y}q=null});if(a.$.compatMode!="BackCompat"){if(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)k.on("mousedown",function(a){function b(a){a=a.data.$;if(e){var c=f.$.createTextRange();try{c.moveToPoint(a.x,a.y)}catch(d){}e.setEndPoint(h.compareEndPoints("StartToStart",c)<0?"EndToEnd":
"StartToStart",c);e.select()}}function c(){k.removeListener("mousemove",b);d.removeListener("mouseup",c);k.removeListener("mouseup",c);e.select()}a=a.data;if(a.getTarget().is("html")&&a.$.y<k.$.clientHeight&&a.$.x<k.$.clientWidth){var e=f.$.createTextRange();try{e.moveToPoint(a.$.x,a.$.y)}catch(g){}var h=e.duplicate();k.on("mousemove",b);d.on("mouseup",c);k.on("mouseup",c)}});if(CKEDITOR.env.version>7){k.on("mousedown",function(a){if(a.data.getTarget().is("html")){d.on("mouseup",y);k.on("mouseup",
y)}});var y=function(){d.removeListener("mouseup",y);k.removeListener("mouseup",y);var b=CKEDITOR.document.$.selection,c=b.createRange();b.type!="None"&&c.parentElement().ownerDocument==a.$&&c.select()}}}}g.attachListener(g,"selectionchange",b,e);g.attachListener(g,"keyup",c,e);g.attachListener(g,"focus",function(){e.forceNextSelectionCheck();e.selectionChange(1)});if(i?CKEDITOR.env.webkit||CKEDITOR.env.gecko:CKEDITOR.env.opera){var t;g.attachListener(g,"mousedown",function(){t=1});g.attachListener(a.getDocumentElement(),
"mouseup",function(){t&&c.call(e);t=0})}else g.attachListener(CKEDITOR.env.ie?g:a.getDocumentElement(),"mouseup",c,e);CKEDITOR.env.webkit&&g.attachListener(a,"keydown",function(a){switch(a.data.getKey()){case 13:case 33:case 34:case 35:case 36:case 37:case 39:case 8:case 45:case 46:h(g)}},null,null,-1)});e.on("contentDomUnload",e.forceNextSelectionCheck,e);e.on("dataReady",function(){e.selectionChange(1)});CKEDITOR.env.ie9Compat&&e.on("beforeDestroy",d,null,null,9);CKEDITOR.env.webkit&&e.on("setData",
d);e.on("contentDomUnload",function(){e.unlockSelection()})});CKEDITOR.on("instanceReady",function(a){var b=a.editor;if(CKEDITOR.env.webkit){b.on("selectionChange",function(){var a=b.editable(),c=d(a);c&&(c.getCustomData("ready")?h(a):c.setCustomData("ready",1))},null,null,-1);b.on("beforeSetMode",function(){h(b.editable())},null,null,-1);var c,e,a=function(){var a=b.editable();if(a)if(a=d(a)){var h=b.document.$.defaultView.getSelection();h.type=="Caret"&&h.anchorNode==a.$&&(e=1);c=a.getText();a.setText(f(c))}},
i=function(){var a=b.editable();if(a)if(a=d(a)){a.setText(c);if(e){b.document.$.defaultView.getSelection().setPosition(a.$,a.getLength());e=0}}};b.on("beforeUndoImage",a);b.on("afterUndoImage",i);b.on("beforeGetData",a,null,null,0);b.on("getData",i)}});CKEDITOR.editor.prototype.selectionChange=function(a){(a?b:c).call(this)};CKEDITOR.editor.prototype.getSelection=function(a){if(this._.savedSelection&&!a)return this._.savedSelection;return(a=this.editable())?new CKEDITOR.dom.selection(a):null};CKEDITOR.editor.prototype.lockSelection=
function(a){a=a||this.getSelection(1);if(a.getType()!=CKEDITOR.SELECTION_NONE){!a.isLocked&&a.lock();this._.savedSelection=a;return true}return false};CKEDITOR.editor.prototype.unlockSelection=function(a){var b=this._.savedSelection;if(b){b.unlock(a);delete this._.savedSelection;return true}return false};CKEDITOR.editor.prototype.forceNextSelectionCheck=function(){delete this._.selectionPreviousPath};CKEDITOR.dom.document.prototype.getSelection=function(){return new CKEDITOR.dom.selection(this)};
CKEDITOR.dom.range.prototype.select=function(){var a=this.root instanceof CKEDITOR.editable?this.root.editor.getSelection():new CKEDITOR.dom.selection(this.root);a.selectRanges([this]);return a};CKEDITOR.SELECTION_NONE=1;CKEDITOR.SELECTION_TEXT=2;CKEDITOR.SELECTION_ELEMENT=3;var o=typeof window.getSelection!="function";CKEDITOR.dom.selection=function(a){var b=a instanceof CKEDITOR.dom.element;this.document=a instanceof CKEDITOR.dom.document?a:a.getDocument();this.root=a=b?a:this.document.getBody();
this.isLocked=0;this._={cache:{}};b=o?this.document.$.selection:this.document.getWindow().$.getSelection();if(CKEDITOR.env.webkit)(b.type=="None"&&this.document.getActive().equals(a)||b.type=="Caret"&&b.anchorNode.nodeType==CKEDITOR.NODE_DOCUMENT)&&j(a,b);else if(CKEDITOR.env.gecko)b&&(this.document.getActive().equals(a)&&b.anchorNode&&b.anchorNode.nodeType==CKEDITOR.NODE_DOCUMENT)&&j(a,b,true);else if(CKEDITOR.env.ie){var c;try{c=this.document.getActive()}catch(d){}if(o)b.type=="None"&&(c&&c.equals(this.document.getDocumentElement()))&&
j(a,null,true);else{(b=b&&b.anchorNode)&&(b=new CKEDITOR.dom.node(b));c&&(c.equals(this.document.getDocumentElement())&&b&&(a.equals(b)||a.contains(b)))&&j(a,null,true)}}c=this.getNative();var e,f;if(c)if(c.getRangeAt)e=(f=c.rangeCount&&c.getRangeAt(0))&&new CKEDITOR.dom.node(f.commonAncestorContainer);else{try{f=c.createRange()}catch(h){}e=f&&CKEDITOR.dom.element.get(f.item&&f.item(0)||f.parentElement())}if(!e||!a.equals(e)&&!a.contains(e)){this._.cache.type=CKEDITOR.SELECTION_NONE;this._.cache.startElement=
null;this._.cache.selectedElement=null;this._.cache.selectedText="";this._.cache.ranges=new CKEDITOR.dom.rangeList}return this};var q={img:1,hr:1,li:1,table:1,tr:1,td:1,th:1,embed:1,object:1,ol:1,ul:1,a:1,input:1,form:1,select:1,textarea:1,button:1,fieldset:1,thead:1,tfoot:1};CKEDITOR.dom.selection.prototype={getNative:function(){return this._.cache.nativeSel!==void 0?this._.cache.nativeSel:this._.cache.nativeSel=o?this.document.$.selection:this.document.getWindow().$.getSelection()},getType:o?function(){var a=
this._.cache;if(a.type)return a.type;var b=CKEDITOR.SELECTION_NONE;try{var c=this.getNative(),d=c.type;if(d=="Text")b=CKEDITOR.SELECTION_TEXT;if(d=="Control")b=CKEDITOR.SELECTION_ELEMENT;if(c.createRange().parentElement())b=CKEDITOR.SELECTION_TEXT}catch(e){}return a.type=b}:function(){var a=this._.cache;if(a.type)return a.type;var b=CKEDITOR.SELECTION_TEXT,c=this.getNative();if(!c||!c.rangeCount)b=CKEDITOR.SELECTION_NONE;else if(c.rangeCount==1){var c=c.getRangeAt(0),d=c.startContainer;if(d==c.endContainer&&
d.nodeType==1&&c.endOffset-c.startOffset==1&&q[d.childNodes[c.startOffset].nodeName.toLowerCase()])b=CKEDITOR.SELECTION_ELEMENT}return a.type=b},getRanges:function(){var a=o?function(){function a(b){return(new CKEDITOR.dom.node(b)).getIndex()}var b=function(b,c){b=b.duplicate();b.collapse(c);var d=b.parentElement(),e=d.ownerDocument;if(!d.hasChildNodes())return{container:d,offset:0};for(var f=d.children,h,i,k=b.duplicate(),j=0,l=f.length-1,n=-1,t,o;j<=l;){n=Math.floor((j+l)/2);h=f[n];k.moveToElementText(h);
t=k.compareEndPoints("StartToStart",b);if(t>0)l=n-1;else if(t<0)j=n+1;else{if(CKEDITOR.env.ie9Compat&&h.tagName=="BR"){f=e.defaultView.getSelection();return{container:f[c?"anchorNode":"focusNode"],offset:f[c?"anchorOffset":"focusOffset"]}}return{container:d,offset:a(h)}}}if(n==-1||n==f.length-1&&t<0){k.moveToElementText(d);k.setEndPoint("StartToStart",b);e=k.text.replace(/(\r\n|\r)/g,"\n").length;f=d.childNodes;if(!e){h=f[f.length-1];return h.nodeType!=CKEDITOR.NODE_TEXT?{container:d,offset:f.length}:
{container:h,offset:h.nodeValue.length}}for(d=f.length;e>0&&d>0;){i=f[--d];if(i.nodeType==CKEDITOR.NODE_TEXT){o=i;e=e-i.nodeValue.length}}return{container:o,offset:-e}}k.collapse(t>0?true:false);k.setEndPoint(t>0?"StartToStart":"EndToStart",b);e=k.text.replace(/(\r\n|\r)/g,"\n").length;if(!e)return{container:d,offset:a(h)+(t>0?0:1)};for(;e>0;)try{i=h[t>0?"previousSibling":"nextSibling"];if(i.nodeType==CKEDITOR.NODE_TEXT){e=e-i.nodeValue.length;o=i}h=i}catch(p){return{container:d,offset:a(h)}}return{container:o,
offset:t>0?-e:o.nodeValue.length+e}};return function(){var a=this.getNative(),c=a&&a.createRange(),d=this.getType();if(!a)return[];if(d==CKEDITOR.SELECTION_TEXT){a=new CKEDITOR.dom.range(this.root);d=b(c,true);a.setStart(new CKEDITOR.dom.node(d.container),d.offset);d=b(c);a.setEnd(new CKEDITOR.dom.node(d.container),d.offset);a.endContainer.getPosition(a.startContainer)&CKEDITOR.POSITION_PRECEDING&&a.endOffset<=a.startContainer.getIndex()&&a.collapse();return[a]}if(d==CKEDITOR.SELECTION_ELEMENT){for(var d=
[],e=0;e<c.length;e++){for(var g=c.item(e),f=g.parentNode,h=0,a=new CKEDITOR.dom.range(this.root);h<f.childNodes.length&&f.childNodes[h]!=g;h++);a.setStart(new CKEDITOR.dom.node(f),h);a.setEnd(new CKEDITOR.dom.node(f),h+1);d.push(a)}return d}return[]}}():function(){var a=[],b,c=this.getNative();if(!c)return a;for(var d=0;d<c.rangeCount;d++){var e=c.getRangeAt(d);b=new CKEDITOR.dom.range(this.root);b.setStart(new CKEDITOR.dom.node(e.startContainer),e.startOffset);b.setEnd(new CKEDITOR.dom.node(e.endContainer),
e.endOffset);a.push(b)}return a};return function(b){var c=this._.cache;if(c.ranges&&!b)return c.ranges;if(!c.ranges)c.ranges=new CKEDITOR.dom.rangeList(a.call(this));if(b)for(var d=c.ranges,e=0;e<d.length;e++){var f=d[e];f.getCommonAncestor().isReadOnly()&&d.splice(e,1);if(!f.collapsed){if(f.startContainer.isReadOnly())for(var b=f.startContainer,h;b;){if((h=b.type==CKEDITOR.NODE_ELEMENT)&&b.is("body")||!b.isReadOnly())break;h&&b.getAttribute("contentEditable")=="false"&&f.setStartAfter(b);b=b.getParent()}b=
f.startContainer;h=f.endContainer;var i=f.startOffset,j=f.endOffset,l=f.clone();b&&b.type==CKEDITOR.NODE_TEXT&&(i>=b.getLength()?l.setStartAfter(b):l.setStartBefore(b));h&&h.type==CKEDITOR.NODE_TEXT&&(j?l.setEndAfter(h):l.setEndBefore(h));b=new CKEDITOR.dom.walker(l);b.evaluator=function(a){if(a.type==CKEDITOR.NODE_ELEMENT&&a.isReadOnly()){var b=f.clone();f.setEndBefore(a);f.collapsed&&d.splice(e--,1);if(!(a.getPosition(l.endContainer)&CKEDITOR.POSITION_CONTAINS)){b.setStartAfter(a);b.collapsed||
d.splice(e+1,0,b)}return true}return false};b.next()}}return c.ranges}}(),getStartElement:function(){var a=this._.cache;if(a.startElement!==void 0)return a.startElement;var b;switch(this.getType()){case CKEDITOR.SELECTION_ELEMENT:return this.getSelectedElement();case CKEDITOR.SELECTION_TEXT:var c=this.getRanges()[0];if(c){if(c.collapsed){b=c.startContainer;b.type!=CKEDITOR.NODE_ELEMENT&&(b=b.getParent())}else{for(c.optimize();;){b=c.startContainer;if(c.startOffset==(b.getChildCount?b.getChildCount():
b.getLength())&&!b.isBlockBoundary())c.setStartAfter(b);else break}b=c.startContainer;if(b.type!=CKEDITOR.NODE_ELEMENT)return b.getParent();b=b.getChild(c.startOffset);if(!b||b.type!=CKEDITOR.NODE_ELEMENT)b=c.startContainer;else for(c=b.getFirst();c&&c.type==CKEDITOR.NODE_ELEMENT;){b=c;c=c.getFirst()}}b=b.$}}return a.startElement=b?new CKEDITOR.dom.element(b):null},getSelectedElement:function(){var a=this._.cache;if(a.selectedElement!==void 0)return a.selectedElement;var b=this,c=CKEDITOR.tools.tryThese(function(){return b.getNative().createRange().item(0)},
function(){for(var a=b.getRanges()[0],c,d,e=2;e&&(!(c=a.getEnclosedNode())||!(c.type==CKEDITOR.NODE_ELEMENT&&q[c.getName()]&&(d=c)));e--)a.shrink(CKEDITOR.SHRINK_ELEMENT);return d.$});return a.selectedElement=c?new CKEDITOR.dom.element(c):null},getSelectedText:function(){var a=this._.cache;if(a.selectedText!==void 0)return a.selectedText;var b=this.getNative(),b=o?b.type=="Control"?"":b.createRange().text:b.toString();return a.selectedText=b},lock:function(){this.getRanges();this.getStartElement();
this.getSelectedElement();this.getSelectedText();this._.cache.nativeSel=null;this.isLocked=1},unlock:function(a){if(this.isLocked){if(a)var b=this.getSelectedElement(),c=!b&&this.getRanges();this.isLocked=0;this.reset();if(a)(a=b||c[0]&&c[0].getCommonAncestor())&&a.getAscendant("body",1)&&(b?this.selectElement(b):this.selectRanges(c))}},reset:function(){this._.cache={}},selectElement:function(a){var b=new CKEDITOR.dom.range(this.root);b.setStartBefore(a);b.setEndAfter(a);this.selectRanges([b])},selectRanges:function(a){if(a.length)if(this.isLocked){var b=
CKEDITOR.document.getActive();this.unlock();this.selectRanges(a);this.lock();!b.equals(this.root)&&b.focus()}else{if(o){var c=CKEDITOR.dom.walker.whitespaces(true),d=/\ufeff|\u00a0/,f={table:1,tbody:1,tr:1};if(a.length>1){b=a[a.length-1];a[0].setEnd(b.endContainer,b.endOffset)}var b=a[0],a=b.collapsed,i,j,l,n=b.getEnclosedNode();if(n&&n.type==CKEDITOR.NODE_ELEMENT&&n.getName()in q&&(!n.is("a")||!n.getText()))try{l=n.$.createControlRange();l.addElement(n.$);l.select();return}catch(x){}(b.startContainer.type==
CKEDITOR.NODE_ELEMENT&&b.startContainer.getName()in f||b.endContainer.type==CKEDITOR.NODE_ELEMENT&&b.endContainer.getName()in f)&&b.shrink(CKEDITOR.NODE_ELEMENT,true);l=b.createBookmark();var f=l.startNode,z;if(!a)z=l.endNode;l=b.document.$.body.createTextRange();l.moveToElementText(f.$);l.moveStart("character",1);if(z){d=b.document.$.body.createTextRange();d.moveToElementText(z.$);l.setEndPoint("EndToEnd",d);l.moveEnd("character",-1)}else{i=f.getNext(c);j=f.hasAscendant("pre");i=!(i&&i.getText&&
i.getText().match(d))&&(j||!f.hasPrevious()||f.getPrevious().is&&f.getPrevious().is("br"));j=b.document.createElement("span");j.setHtml("&#65279;");j.insertBefore(f);i&&b.document.createText("﻿").insertBefore(f)}b.setStartBefore(f);f.remove();if(a){if(i){l.moveStart("character",-1);l.select();b.document.$.selection.clear()}else l.select();b.moveToPosition(j,CKEDITOR.POSITION_BEFORE_START);j.remove()}else{b.setEndBefore(z);z.remove();l.select()}}else{z=this.getNative();if(!z)return;if(CKEDITOR.env.opera){b=
this.document.$.createRange();b.selectNodeContents(this.root.$);z.addRange(b)}this.removeAllRanges();for(d=0;d<a.length;d++){if(d<a.length-1){b=a[d];l=a[d+1];j=b.clone();j.setStart(b.endContainer,b.endOffset);j.setEnd(l.startContainer,l.startOffset);if(!j.collapsed){j.shrink(CKEDITOR.NODE_ELEMENT,true);i=j.getCommonAncestor();j=j.getEnclosedNode();if(i.isReadOnly()||j&&j.isReadOnly()){l.setStart(b.startContainer,b.startOffset);a.splice(d--,1);continue}}}b=a[d];l=this.document.$.createRange();i=b.startContainer;
if(CKEDITOR.env.opera&&b.collapsed&&i.type==CKEDITOR.NODE_ELEMENT){j=i.getChild(b.startOffset-1);c=i.getChild(b.startOffset);if(!j&&!c&&i.is(CKEDITOR.dtd.$removeEmpty)||j&&j.type==CKEDITOR.NODE_ELEMENT||c&&c.type==CKEDITOR.NODE_ELEMENT){b.insertNode(this.document.createText(""));b.collapse(1)}}if(b.collapsed&&CKEDITOR.env.webkit&&e(b)){i=this.root;h(i,false);j=i.getDocument().createText("​");i.setCustomData("cke-fillingChar",j);b.insertNode(j);if((i=j.getNext())&&!j.getPrevious()&&i.type==CKEDITOR.NODE_ELEMENT&&
i.getName()=="br"){h(this.root);b.moveToPosition(i,CKEDITOR.POSITION_BEFORE_START)}else b.moveToPosition(j,CKEDITOR.POSITION_AFTER_END)}l.setStart(b.startContainer.$,b.startOffset);try{l.setEnd(b.endContainer.$,b.endOffset)}catch(s){if(s.toString().indexOf("NS_ERROR_ILLEGAL_VALUE")>=0){b.collapse(1);l.setEnd(b.endContainer.$,b.endOffset)}else throw s;}z.addRange(l)}}this.reset();this.root.fire("selectionchange")}},createBookmarks:function(a){return this.getRanges().createBookmarks(a)},createBookmarks2:function(a){return this.getRanges().createBookmarks2(a)},
selectBookmarks:function(a){for(var b=[],c=0;c<a.length;c++){var d=new CKEDITOR.dom.range(this.root);d.moveToBookmark(a[c]);b.push(d)}this.selectRanges(b);return this},getCommonAncestor:function(){var a=this.getRanges();return a[0].startContainer.getCommonAncestor(a[a.length-1].endContainer)},scrollIntoView:function(){this.type!=CKEDITOR.SELECTION_NONE&&this.getRanges()[0].scrollIntoView()},removeAllRanges:function(){var a=this.getNative();try{a&&a[o?"empty":"removeAllRanges"]()}catch(b){}this.reset()}}})();
CKEDITOR.editor.prototype.attachStyleStateChange=function(b,c){var a=this._.styleStateChangeCallbacks;if(!a){a=this._.styleStateChangeCallbacks=[];this.on("selectionChange",function(b){for(var c=0;c<a.length;c++){var h=a[c],f=h.style.checkActive(b.data.path)?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF;h.fn.call(this,f)}})}a.push({style:b,fn:c})};CKEDITOR.STYLE_BLOCK=1;CKEDITOR.STYLE_INLINE=2;CKEDITOR.STYLE_OBJECT=3;
(function(){function b(a,b){for(var c,d;a=a.getParent();){if(a.equals(b))break;if(a.getAttribute("data-nostyle"))c=a;else if(!d){var e=a.getAttribute("contentEditable");e=="false"?c=a:e=="true"&&(d=1)}}return c}function c(a){var c=a.document;if(a.collapsed){c=p(this,c);a.insertNode(c);a.moveToPosition(c,CKEDITOR.POSITION_BEFORE_END)}else{var d=this.element,e=this._.definition,f,g=e.ignoreReadonly,h=g||e.includeReadonly;h==void 0&&(h=a.root.getCustomData("cke_includeReadonly"));var i=CKEDITOR.dtd[d]||
(f=true,CKEDITOR.dtd.span);a.enlarge(CKEDITOR.ENLARGE_INLINE,1);a.trim();var j=a.createBookmark(),l=j.startNode,k=j.endNode,n=l,o;if(!g){var m=a.getCommonAncestor(),g=b(l,m),m=b(k,m);g&&(n=g.getNextSourceNode(true));m&&(k=m)}for(n.getPosition(k)==CKEDITOR.POSITION_FOLLOWING&&(n=0);n;){g=false;if(n.equals(k)){n=null;g=true}else{var r=n.type,s=r==CKEDITOR.NODE_ELEMENT?n.getName():null,m=s&&n.getAttribute("contentEditable")=="false",u=s&&n.getAttribute("data-nostyle");if(s&&n.data("cke-bookmark")){n=
n.getNextSourceNode(true);continue}if(!s||i[s]&&!u&&(!m||h)&&(n.getPosition(k)|CKEDITOR.POSITION_PRECEDING|CKEDITOR.POSITION_IDENTICAL|CKEDITOR.POSITION_IS_CONTAINED)==CKEDITOR.POSITION_PRECEDING+CKEDITOR.POSITION_IDENTICAL+CKEDITOR.POSITION_IS_CONTAINED&&(!e.childRule||e.childRule(n))){var v=n.getParent();if(v&&((v.getDtd()||CKEDITOR.dtd.span)[d]||f)&&(!e.parentRule||e.parentRule(v))){if(!o&&(!s||!CKEDITOR.dtd.$removeEmpty[s]||(n.getPosition(k)|CKEDITOR.POSITION_PRECEDING|CKEDITOR.POSITION_IDENTICAL|
CKEDITOR.POSITION_IS_CONTAINED)==CKEDITOR.POSITION_PRECEDING+CKEDITOR.POSITION_IDENTICAL+CKEDITOR.POSITION_IS_CONTAINED)){o=a.clone();o.setStartBefore(n)}if(r==CKEDITOR.NODE_TEXT||m||r==CKEDITOR.NODE_ELEMENT&&!n.getChildCount()){for(var r=n,x;(g=!r.getNext(C))&&(x=r.getParent(),i[x.getName()])&&(x.getPosition(l)|CKEDITOR.POSITION_FOLLOWING|CKEDITOR.POSITION_IDENTICAL|CKEDITOR.POSITION_IS_CONTAINED)==CKEDITOR.POSITION_FOLLOWING+CKEDITOR.POSITION_IDENTICAL+CKEDITOR.POSITION_IS_CONTAINED&&(!e.childRule||
e.childRule(x));)r=x;o.setEndAfter(r)}}else g=true}else g=true;n=n.getNextSourceNode(u||m&&!h)}if(g&&o&&!o.collapsed){for(var g=p(this,c),m=g.hasAttributes(),u=o.getCommonAncestor(),r={},s={},v={},z={},y,A,E;g&&u;){if(u.getName()==d){for(y in e.attributes)if(!z[y]&&(E=u.getAttribute(A)))g.getAttribute(y)==E?s[y]=1:z[y]=1;for(A in e.styles)if(!v[A]&&(E=u.getStyle(A)))g.getStyle(A)==E?r[A]=1:v[A]=1}u=u.getParent()}for(y in s)g.removeAttribute(y);for(A in r)g.removeStyle(A);m&&!g.hasAttributes()&&(g=
null);if(g){o.extractContents().appendTo(g);q.call(this,g);o.insertNode(g);g.mergeSiblings();CKEDITOR.env.ie||g.$.normalize()}else{g=new CKEDITOR.dom.element("span");o.extractContents().appendTo(g);o.insertNode(g);q.call(this,g);g.remove(true)}o=null}}a.moveToBookmark(j);a.shrink(CKEDITOR.SHRINK_TEXT)}}function a(a){a.enlarge(CKEDITOR.ENLARGE_INLINE,1);var b=a.createBookmark(),c=b.startNode;if(a.collapsed){for(var d=new CKEDITOR.dom.elementPath(c.getParent(),a.root),e,f=0,g;f<d.elements.length&&(g=
d.elements[f]);f++){if(g==d.block||g==d.blockLimit)break;if(this.checkElementRemovable(g)){var h;if(a.collapsed&&(a.checkBoundaryOfElement(g,CKEDITOR.END)||(h=a.checkBoundaryOfElement(g,CKEDITOR.START)))){e=g;e.match=h?"start":"end"}else{g.mergeSiblings();g.getName()==this.element?o.call(this,g):k(g,m(this)[g.getName()])}}}if(e){g=c;for(f=0;;f++){h=d.elements[f];if(h.equals(e))break;else if(h.match)continue;else h=h.clone();h.append(g);g=h}g[e.match=="start"?"insertBefore":"insertAfter"](e)}}else{var i=
b.endNode,j=this,d=function(){for(var a=new CKEDITOR.dom.elementPath(c.getParent()),b=new CKEDITOR.dom.elementPath(i.getParent()),d=null,e=null,f=0;f<a.elements.length;f++){var g=a.elements[f];if(g==a.block||g==a.blockLimit)break;j.checkElementRemovable(g)&&(d=g)}for(f=0;f<b.elements.length;f++){g=b.elements[f];if(g==b.block||g==b.blockLimit)break;j.checkElementRemovable(g)&&(e=g)}e&&i.breakParent(e);d&&c.breakParent(d)};d();for(e=c;!e.equals(i);){f=e.getNextSourceNode();if(e.type==CKEDITOR.NODE_ELEMENT&&
this.checkElementRemovable(e)){e.getName()==this.element?o.call(this,e):k(e,m(this)[e.getName()]);if(f.type==CKEDITOR.NODE_ELEMENT&&f.contains(c)){d();f=c.getNext()}}e=f}}a.moveToBookmark(b)}function e(a){var b=a.getEnclosedNode()||a.getCommonAncestor(false,true);(a=(new CKEDITOR.dom.elementPath(b,a.root)).contains(this.element,1))&&!a.isReadOnly()&&v(a,this)}function d(a){var b=a.getCommonAncestor(true,true);if(a=(new CKEDITOR.dom.elementPath(b,a.root)).contains(this.element,1)){var b=this._.definition,
c=b.attributes;if(c)for(var d in c)a.removeAttribute(d,c[d]);if(b.styles)for(var e in b.styles)b.styles.hasOwnProperty(e)&&a.removeStyle(e)}}function h(a){var b=a.createBookmark(true),c=a.createIterator();c.enforceRealBlocks=true;if(this._.enterMode)c.enlargeBr=this._.enterMode!=CKEDITOR.ENTER_BR;for(var d,e=a.document;d=c.getNextParagraph();)if(!d.isReadOnly()){var f=p(this,e,d);j(d,f)}a.moveToBookmark(b)}function f(a){var b=a.createBookmark(1),c=a.createIterator();c.enforceRealBlocks=true;c.enlargeBr=
this._.enterMode!=CKEDITOR.ENTER_BR;for(var d;d=c.getNextParagraph();)if(this.checkElementRemovable(d))if(d.is("pre")){var e=this._.enterMode==CKEDITOR.ENTER_BR?null:a.document.createElement(this._.enterMode==CKEDITOR.ENTER_P?"p":"div");e&&d.copyAttributes(e);j(d,e)}else o.call(this,d);a.moveToBookmark(b)}function j(a,b){var c=!b;if(c){b=a.getDocument().createElement("div");a.copyAttributes(b)}var d=b&&b.is("pre"),e=a.is("pre"),f=!d&&e;if(d&&!e){e=b;(f=a.getBogus())&&f.remove();f=a.getHtml();f=l(f,
/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g,"");f=f.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi,"$1");f=f.replace(/([ \t\n\r]+|&nbsp;)/g," ");f=f.replace(/<br\b[^>]*>/gi,"\n");if(CKEDITOR.env.ie){var h=a.getDocument().createElement("div");h.append(e);e.$.outerHTML="<pre>"+f+"</pre>";e.copyAttributes(h.getFirst());e=h.getFirst().remove()}else e.setHtml(f);b=e}else f?b=n(c?[a.getHtml()]:i(a),b):a.moveChildren(b);b.replace(a);if(d){var c=b,j;if((j=c.getPrevious(y))&&j.is&&j.is("pre")){d=l(j.getHtml(),/\n$/,"")+
"\n\n"+l(c.getHtml(),/^\n/,"");CKEDITOR.env.ie?c.$.outerHTML="<pre>"+d+"</pre>":c.setHtml(d);j.remove()}}else c&&g(b)}function i(a){a.getName();var b=[];l(a.getOuterHtml(),/(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,function(a,b,c){return b+"</pre>"+c+"<pre>"}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi,function(a,c){b.push(c)});return b}function l(a,b,c){var d="",e="",a=a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi,function(a,
b,c){b&&(d=b);c&&(e=c);return""});return d+a.replace(b,c)+e}function n(a,b){var c;a.length>1&&(c=new CKEDITOR.dom.documentFragment(b.getDocument()));for(var d=0;d<a.length;d++){var e=a[d],e=e.replace(/(\r\n|\r)/g,"\n"),e=l(e,/^[ \t]*\n/,""),e=l(e,/\n$/,""),e=l(e,/^[ \t]+|[ \t]+$/g,function(a,b){return a.length==1?"&nbsp;":b?" "+CKEDITOR.tools.repeat("&nbsp;",a.length-1):CKEDITOR.tools.repeat("&nbsp;",a.length-1)+" "}),e=e.replace(/\n/g,"<br>"),e=e.replace(/[ \t]{2,}/g,function(a){return CKEDITOR.tools.repeat("&nbsp;",
a.length-1)+" "});if(c){var f=b.clone();f.setHtml(e);c.append(f)}else b.setHtml(e)}return c||b}function o(a){var b=this._.definition,c=b.attributes,b=b.styles,d=m(this)[a.getName()],e=CKEDITOR.tools.isEmpty(c)&&CKEDITOR.tools.isEmpty(b),f;for(f in c)if(!((f=="class"||this._.definition.fullMatch)&&a.getAttribute(f)!=E(f,c[f]))){e=a.hasAttribute(f);a.removeAttribute(f)}for(var h in b)if(!(this._.definition.fullMatch&&a.getStyle(h)!=E(h,b[h],true))){e=e||!!a.getStyle(h);a.removeStyle(h)}k(a,d,r[a.getName()]);
e&&(this._.definition.alwaysRemoveElement?g(a,1):!CKEDITOR.dtd.$block[a.getName()]||this._.enterMode==CKEDITOR.ENTER_BR&&!a.hasAttributes()?g(a):a.renameNode(this._.enterMode==CKEDITOR.ENTER_P?"p":"div"))}function q(a){for(var b=m(this),c=a.getElementsByTag(this.element),d=c.count();--d>=0;)o.call(this,c.getItem(d));for(var e in b)if(e!=this.element){c=a.getElementsByTag(e);for(d=c.count()-1;d>=0;d--){var f=c.getItem(d);k(f,b[e])}}}function k(a,b,c){if(b=b&&b.attributes)for(var d=0;d<b.length;d++){var e=
b[d][0],f;if(f=a.getAttribute(e)){var h=b[d][1];(h===null||h.test&&h.test(f)||typeof h=="string"&&f==h)&&a.removeAttribute(e)}}c||g(a)}function g(a,b){if(!a.hasAttributes()||b)if(CKEDITOR.dtd.$block[a.getName()]){var c=a.getPrevious(y),d=a.getNext(y);c&&(c.type==CKEDITOR.NODE_TEXT||!c.isBlockBoundary({br:1}))&&a.append("br",1);d&&(d.type==CKEDITOR.NODE_TEXT||!d.isBlockBoundary({br:1}))&&a.append("br");a.remove(true)}else{c=a.getFirst();d=a.getLast();a.remove(true);if(c){c.type==CKEDITOR.NODE_ELEMENT&&
c.mergeSiblings();d&&(!c.equals(d)&&d.type==CKEDITOR.NODE_ELEMENT)&&d.mergeSiblings()}}}function p(a,b,c){var d;d=a.element;d=="*"&&(d="span");d=new CKEDITOR.dom.element(d,b);c&&c.copyAttributes(d);d=v(d,a);b.getCustomData("doc_processing_style")&&d.hasAttribute("id")?d.removeAttribute("id"):b.setCustomData("doc_processing_style",1);return d}function v(a,b){var c=b._.definition,d=c.attributes,c=CKEDITOR.style.getStyleText(c);if(d)for(var e in d)a.setAttribute(e,d[e]);c&&a.setAttribute("style",c);
return a}function u(a,b){for(var c in a)a[c]=a[c].replace(s,function(a,c){return b[c]})}function m(a){if(a._.overrides)return a._.overrides;var b=a._.overrides={},c=a._.definition.overrides;if(c){CKEDITOR.tools.isArray(c)||(c=[c]);for(var d=0;d<c.length;d++){var e=c[d],f,g;if(typeof e=="string")f=e.toLowerCase();else{f=e.element?e.element.toLowerCase():a.element;g=e.attributes}e=b[f]||(b[f]={});if(g){var e=e.attributes=e.attributes||[],h;for(h in g)e.push([h.toLowerCase(),g[h]])}}}return b}function E(a,
b,c){var d=new CKEDITOR.dom.element("span");d[c?"setStyle":"setAttribute"](a,b);return d[c?"getStyle":"getAttribute"](a)}function A(a,b){for(var c=a.document,d=a.getRanges(),e=b?this.removeFromRange:this.applyToRange,f,g=d.createIterator();f=g.getNextRange();)e.call(this,f);a.selectRanges(d);c.removeCustomData("doc_processing_style")}var r={address:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,
keygen:1,output:1,progress:1,details:1,datagrid:1,datalist:1},x={a:1,embed:1,hr:1,img:1,li:1,object:1,ol:1,table:1,td:1,tr:1,th:1,ul:1,dl:1,dt:1,dd:1,form:1,audio:1,video:1},z=/\s*(?:;\s*|$)/,s=/#\((.+?)\)/g,C=CKEDITOR.dom.walker.bookmark(0,1),y=CKEDITOR.dom.walker.whitespaces(1);CKEDITOR.style=function(a,b){var c=a.attributes;if(c&&c.style){a.styles=CKEDITOR.tools.extend({},a.styles,CKEDITOR.tools.parseCssText(c.style));delete c.style}if(b){a=CKEDITOR.tools.clone(a);u(a.attributes,b);u(a.styles,
b)}c=this.element=a.element?typeof a.element=="string"?a.element.toLowerCase():a.element:"*";this.type=a.type||(r[c]?CKEDITOR.STYLE_BLOCK:x[c]?CKEDITOR.STYLE_OBJECT:CKEDITOR.STYLE_INLINE);if(typeof this.element=="object")this.type=CKEDITOR.STYLE_OBJECT;this._={definition:a}};CKEDITOR.editor.prototype.applyStyle=function(a){A.call(a,this.getSelection())};CKEDITOR.editor.prototype.removeStyle=function(a){A.call(a,this.getSelection(),1)};CKEDITOR.style.prototype={apply:function(a){A.call(this,a.getSelection())},
remove:function(a){A.call(this,a.getSelection(),1)},applyToRange:function(a){return(this.applyToRange=this.type==CKEDITOR.STYLE_INLINE?c:this.type==CKEDITOR.STYLE_BLOCK?h:this.type==CKEDITOR.STYLE_OBJECT?e:null).call(this,a)},removeFromRange:function(b){return(this.removeFromRange=this.type==CKEDITOR.STYLE_INLINE?a:this.type==CKEDITOR.STYLE_BLOCK?f:this.type==CKEDITOR.STYLE_OBJECT?d:null).call(this,b)},applyToObject:function(a){v(a,this)},checkActive:function(a){switch(this.type){case CKEDITOR.STYLE_BLOCK:return this.checkElementRemovable(a.block||
a.blockLimit,true);case CKEDITOR.STYLE_OBJECT:case CKEDITOR.STYLE_INLINE:for(var b=a.elements,c=0,d;c<b.length;c++){d=b[c];if(!(this.type==CKEDITOR.STYLE_INLINE&&(d==a.block||d==a.blockLimit))){if(this.type==CKEDITOR.STYLE_OBJECT){var e=d.getName();if(!(typeof this.element=="string"?e==this.element:e in this.element))continue}if(this.checkElementRemovable(d,true))return true}}}return false},checkApplicable:function(a){switch(this.type){case CKEDITOR.STYLE_OBJECT:return a.contains(this.element)}return true},
checkElementMatch:function(a,b){var c=this._.definition;if(!a||!c.ignoreReadonly&&a.isReadOnly())return false;var d=a.getName();if(typeof this.element=="string"?d==this.element:d in this.element){if(!b&&!a.hasAttributes())return true;if(d=c._AC)c=d;else{var d={},e=0,f=c.attributes;if(f)for(var g in f){e++;d[g]=f[g]}if(g=CKEDITOR.style.getStyleText(c)){d.style||e++;d.style=g}d._length=e;c=c._AC=d}if(c._length){for(var h in c)if(h!="_length"){e=a.getAttribute(h)||"";if(h=="style")a:{d=c[h];typeof d==
"string"&&(d=CKEDITOR.tools.parseCssText(d));typeof e=="string"&&(e=CKEDITOR.tools.parseCssText(e,true));g=void 0;for(g in d)if(!(g in e&&(e[g]==d[g]||d[g]=="inherit"||e[g]=="inherit"))){d=false;break a}d=true}else d=c[h]==e;if(d){if(!b)return true}else if(b)return false}if(b)return true}else return true}return false},checkElementRemovable:function(a,b){if(this.checkElementMatch(a,b))return true;var c=m(this)[a.getName()];if(c){var d;if(!(c=c.attributes))return true;for(var e=0;e<c.length;e++){d=
c[e][0];if(d=a.getAttribute(d)){var f=c[e][1];if(f===null||typeof f=="string"&&d==f||f.test(d))return true}}}return false},buildPreview:function(a){var b=this._.definition,c=[],d=b.element;d=="bdo"&&(d="span");var c=["<",d],e=b.attributes;if(e)for(var f in e)c.push(" ",f,'="',e[f],'"');(e=CKEDITOR.style.getStyleText(b))&&c.push(' style="',e,'"');c.push(">",a||b.name,"</",d,">");return c.join("")},getDefinition:function(){return this._.definition}};CKEDITOR.style.getStyleText=function(a){var b=a._ST;
if(b)return b;var b=a.styles,c=a.attributes&&a.attributes.style||"",d="";c.length&&(c=c.replace(z,";"));for(var e in b){var f=b[e],g=(e+":"+f).replace(z,";");f=="inherit"?d=d+g:c=c+g}c.length&&(c=CKEDITOR.tools.normalizeCssText(c,true));return a._ST=c+d}})();CKEDITOR.styleCommand=function(b,c){this.requiredContent=this.allowedContent=this.style=b;CKEDITOR.tools.extend(this,c,true)};
CKEDITOR.styleCommand.prototype.exec=function(b){b.focus();this.state==CKEDITOR.TRISTATE_OFF?b.applyStyle(this.style):this.state==CKEDITOR.TRISTATE_ON&&b.removeStyle(this.style)};CKEDITOR.stylesSet=new CKEDITOR.resourceManager("","stylesSet");CKEDITOR.addStylesSet=CKEDITOR.tools.bind(CKEDITOR.stylesSet.add,CKEDITOR.stylesSet);CKEDITOR.loadStylesSet=function(b,c,a){CKEDITOR.stylesSet.addExternal(b,c,"");CKEDITOR.stylesSet.load(b,a)};
CKEDITOR.editor.prototype.getStylesSet=function(b){if(this._.stylesDefinitions)b(this._.stylesDefinitions);else{var c=this,a=c.config.stylesCombo_stylesSet||c.config.stylesSet;if(a===false)b(null);else if(a instanceof Array){c._.stylesDefinitions=a;b(a)}else{a||(a="default");var a=a.split(":"),e=a[0];CKEDITOR.stylesSet.addExternal(e,a[1]?a.slice(1).join(":"):CKEDITOR.getUrl("styles.js"),"");CKEDITOR.stylesSet.load(e,function(a){c._.stylesDefinitions=a[e];b(c._.stylesDefinitions)})}}};
CKEDITOR.dom.comment=function(b,c){typeof b=="string"&&(b=(c?c.$:document).createComment(b));CKEDITOR.dom.domObject.call(this,b)};CKEDITOR.dom.comment.prototype=new CKEDITOR.dom.node;CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype,{type:CKEDITOR.NODE_COMMENT,getOuterHtml:function(){return"<\!--"+this.$.nodeValue+"--\>"}});
(function(){var b={},c;for(c in CKEDITOR.dtd.$blockLimit)c in CKEDITOR.dtd.$list||(b[c]=1);var a={};for(c in CKEDITOR.dtd.$block)c in CKEDITOR.dtd.$blockLimit||c in CKEDITOR.dtd.$empty||(a[c]=1);CKEDITOR.dom.elementPath=function(c,d){var h=null,f=null,j=[],d=d||c.getDocument().getBody(),i=c;do if(i.type==CKEDITOR.NODE_ELEMENT){j.push(i);if(!this.lastElement){this.lastElement=i;if(i.is(CKEDITOR.dtd.$object))continue}var l=i.getName();if(!f){!h&&a[l]&&(h=i);if(b[l]){var n;if(n=!h){if(l=l=="div"){a:{l=
i.getChildren();n=0;for(var o=l.count();n<o;n++){var q=l.getItem(n);if(q.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$block[q.getName()]){l=true;break a}}l=false}l=!l&&!i.equals(d)}n=l}n?h=i:f=i}}if(i.equals(d))break}while(i=i.getParent());this.block=h;this.blockLimit=f;this.root=d;this.elements=j}})();
CKEDITOR.dom.elementPath.prototype={compare:function(b){var c=this.elements,b=b&&b.elements;if(!b||c.length!=b.length)return false;for(var a=0;a<c.length;a++)if(!c[a].equals(b[a]))return false;return true},contains:function(b,c,a){var e;typeof b=="string"&&(e=function(a){return a.getName()==b});b instanceof CKEDITOR.dom.element?e=function(a){return a.equals(b)}:CKEDITOR.tools.isArray(b)?e=function(a){return CKEDITOR.tools.indexOf(b,a.getName())>-1}:typeof b=="function"?e=b:typeof b=="object"&&(e=
function(a){return a.getName()in b});var d=this.elements,h=d.length;c&&h--;if(a){d=Array.prototype.slice.call(d,0);d.reverse()}for(c=0;c<h;c++)if(e(d[c]))return d[c];return null},isContextFor:function(b){var c;if(b in CKEDITOR.dtd.$block){c=this.contains(CKEDITOR.dtd.$intermediate)||this.root.equals(this.block)&&this.block||this.blockLimit;return!!c.getDtd()[b]}return true},direction:function(){return(this.block||this.blockLimit||this.root).getDirection(1)}};
CKEDITOR.dom.text=function(b,c){typeof b=="string"&&(b=(c?c.$:document).createTextNode(b));this.$=b};CKEDITOR.dom.text.prototype=new CKEDITOR.dom.node;
CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype,{type:CKEDITOR.NODE_TEXT,getLength:function(){return this.$.nodeValue.length},getText:function(){return this.$.nodeValue},setText:function(b){this.$.nodeValue=b},split:function(b){var c=this.$.parentNode,a=c.childNodes.length,e=this.getLength(),d=this.getDocument(),h=new CKEDITOR.dom.text(this.$.splitText(b),d);if(c.childNodes.length==a)if(b>=e){h=d.createText("");h.insertAfter(this)}else{b=d.createText("");b.insertAfter(h);b.remove()}return h},substring:function(b,
c){return typeof c!="number"?this.$.nodeValue.substr(b):this.$.nodeValue.substring(b,c)}});
(function(){function b(a,b,c){var h=a.serializable,f=b[c?"endContainer":"startContainer"],j=c?"endOffset":"startOffset",i=h?b.document.getById(a.startNode):a.startNode,a=h?b.document.getById(a.endNode):a.endNode;if(f.equals(i.getPrevious())){b.startOffset=b.startOffset-f.getLength()-a.getPrevious().getLength();f=a.getNext()}else if(f.equals(a.getPrevious())){b.startOffset=b.startOffset-f.getLength();f=a.getNext()}f.equals(i.getParent())&&b[j]++;f.equals(a.getParent())&&b[j]++;b[c?"endContainer":"startContainer"]=
f;return b}CKEDITOR.dom.rangeList=function(a){if(a instanceof CKEDITOR.dom.rangeList)return a;a?a instanceof CKEDITOR.dom.range&&(a=[a]):a=[];return CKEDITOR.tools.extend(a,c)};var c={createIterator:function(){var a=this,b=CKEDITOR.dom.walker.bookmark(),c=[],h;return{getNextRange:function(f){h=h==void 0?0:h+1;var j=a[h];if(j&&a.length>1){if(!h)for(var i=a.length-1;i>=0;i--)c.unshift(a[i].createBookmark(true));if(f)for(var l=0;a[h+l+1];){for(var n=j.document,f=0,i=n.getById(c[l].endNode),n=n.getById(c[l+
1].startNode);;){i=i.getNextSourceNode(false);if(n.equals(i))f=1;else if(b(i)||i.type==CKEDITOR.NODE_ELEMENT&&i.isBlockBoundary())continue;break}if(!f)break;l++}for(j.moveToBookmark(c.shift());l--;){i=a[++h];i.moveToBookmark(c.shift());j.setEnd(i.endContainer,i.endOffset)}}return j}}},createBookmarks:function(a){for(var c=[],d,h=0;h<this.length;h++){c.push(d=this[h].createBookmark(a,true));for(var f=h+1;f<this.length;f++){this[f]=b(d,this[f]);this[f]=b(d,this[f],true)}}return c},createBookmarks2:function(a){for(var b=
[],c=0;c<this.length;c++)b.push(this[c].createBookmark2(a));return b},moveToBookmarks:function(a){for(var b=0;b<this.length;b++)this[b].moveToBookmark(a[b])}}})();
(function(){function b(){return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1]||"skins/"+CKEDITOR.skinName.split(",")[0]+"/")}function c(a){var c=CKEDITOR.skin["ua_"+a],d=CKEDITOR.env;if(c)for(var c=c.split(",").sort(function(a,b){return a>b?-1:1}),e=0,f;e<c.length;e++){f=c[e];if(d.ie&&(f.replace(/^ie/,"")==d.version||d.quirks&&f=="iequirks"))f="ie";if(d[f]){a=a+("_"+c[e]);break}}return CKEDITOR.getUrl(b()+a+".css")}function a(a,b){if(!h[a]){CKEDITOR.document.appendStyleSheet(c(a));h[a]=1}b&&b()}
function e(a){var b=a.getById(f);if(!b){b=a.getHead().append("style");b.setAttribute("id",f);b.setAttribute("type","text/css")}return b}function d(a,b,c){var d,e,f;if(CKEDITOR.env.webkit){b=b.split("}").slice(0,-1);for(e=0;e<b.length;e++)b[e]=b[e].split("{")}for(var h=0;h<a.length;h++)if(CKEDITOR.env.webkit)for(e=0;e<b.length;e++){f=b[e][1];for(d=0;d<c.length;d++)f=f.replace(c[d][0],c[d][1]);a[h].$.sheet.addRule(b[e][0],f)}else{f=b;for(d=0;d<c.length;d++)f=f.replace(c[d][0],c[d][1]);CKEDITOR.env.ie?
a[h].$.styleSheet.cssText=a[h].$.styleSheet.cssText+f:a[h].$.innerHTML=a[h].$.innerHTML+f}}var h={};CKEDITOR.skin={path:b,loadPart:function(c,d){CKEDITOR.skin.name!=CKEDITOR.skinName.split(",")[0]?CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(b()+"skin.js"),function(){a(c,d)}):a(c,d)},getPath:function(a){return CKEDITOR.getUrl(c(a))},icons:{},addIcon:function(a,b,c,d){a=a.toLowerCase();this.icons[a]||(this.icons[a]={path:b,offset:c||0,bgsize:d||"16px"})},getIconStyle:function(a,b,c,d,e){var f;if(a){a=
a.toLowerCase();b&&(f=this.icons[a+"-rtl"]);f||(f=this.icons[a])}a=c||f&&f.path||"";d=d||f&&f.offset;e=e||f&&f.bgsize||"16px";return a&&"background-image:url("+CKEDITOR.getUrl(a)+");background-position:0 "+d+"px;background-size:"+e+";"}};CKEDITOR.tools.extend(CKEDITOR.editor.prototype,{getUiColor:function(){return this.uiColor},setUiColor:function(a){var b=e(CKEDITOR.document);return(this.setUiColor=function(a){var c=CKEDITOR.skin.chameleon,e=[[i,a]];this.uiColor=a;d([b],c(this,"editor"),e);d(j,c(this,
"panel"),e)}).call(this,a)}});var f="cke_ui_color",j=[],i=/\$color/g;CKEDITOR.on("instanceLoaded",function(a){if(!CKEDITOR.env.ie||!CKEDITOR.env.quirks){var b=a.editor,a=function(a){a=(a.data[0]||a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();if(!a.getById("cke_ui_color")){a=e(a);j.push(a);var c=b.getUiColor();c&&d([a],CKEDITOR.skin.chameleon(b,"panel"),[[i,c]])}};b.on("panelShow",a);b.on("menuShow",a);b.config.uiColor&&b.setUiColor(b.config.uiColor)}})})();
(function(){if(CKEDITOR.env.webkit)CKEDITOR.env.hc=false;else{var b=CKEDITOR.dom.element.createFromHtml('<div style="width:0px;height:0px;position:absolute;left:-10000px;border: 1px solid;border-color: red blue;"></div>',CKEDITOR.document);b.appendTo(CKEDITOR.document.getHead());try{CKEDITOR.env.hc=b.getComputedStyle("border-top-color")==b.getComputedStyle("border-right-color")}catch(c){CKEDITOR.env.hc=false}b.remove()}if(CKEDITOR.env.hc)CKEDITOR.env.cssClass=CKEDITOR.env.cssClass+" cke_hc";CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
CKEDITOR.status="loaded";CKEDITOR.fireOnce("loaded");if(b=CKEDITOR._.pending){delete CKEDITOR._.pending;for(var a=0;a<b.length;a++){CKEDITOR.editor.prototype.constructor.apply(b[a][0],b[a][1]);CKEDITOR.add(b[a][0])}}})();/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.skin.name="moono";CKEDITOR.skin.ua_editor="ie,iequirks,ie7,ie8,gecko";CKEDITOR.skin.ua_dialog="ie,iequirks,ie7,ie8,opera";
CKEDITOR.skin.chameleon=function(){var b=function(){return function(b,e){for(var a=b.match(/[^#]./g),c=0;3>c;c++){var f=a,h=c,d;d=parseInt(a[c],16);d=("0"+(0>e?0|d*(1+e):0|d+(255-d)*e).toString(16)).slice(-2);f[h]=d}return"#"+a.join("")}}(),c=function(){var b=new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");return function(c,
a){return b.output({from:c,to:a})}}(),f={editor:new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
panel:new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")};
return function(g,e){var a=g.uiColor,a={id:"."+g.id,defaultBorder:b(a,-0.1),defaultGradient:c(b(a,0.9),a),lightGradient:c(b(a,1),b(a,0.7)),mediumGradient:c(b(a,0.8),b(a,0.5)),ckeButtonOn:c(b(a,0.6),b(a,0.7)),ckeResizer:b(a,-0.4),ckeToolbarSeparator:b(a,0.5),ckeColorauto:b(a,0.8),dialogBody:b(a,0.7),dialogTabSelected:c("#FFFFFF","#FFFFFF"),dialogTabSelectedBorder:"#FFF",elementsPathColor:b(a,-0.6),elementsPathBg:a,menubuttonIcon:b(a,0.5),menubuttonIconHover:b(a,0.3)};return f[e].output(a).replace(/\[/g,
"{").replace(/\]/g,"}")}}();CKEDITOR.plugins.add("dialogui",{onLoad:function(){var i=function(b){this._||(this._={});this._["default"]=this._.initValue=b["default"]||"";this._.required=b.required||!1;for(var a=[this._],d=1;d<arguments.length;d++)a.push(arguments[d]);a.push(!0);CKEDITOR.tools.extend.apply(CKEDITOR.tools,a);return this._},r={build:function(b,a,d){return new CKEDITOR.ui.dialog.textInput(b,a,d)}},l={build:function(b,a,d){return new CKEDITOR.ui.dialog[a.type](b,a,d)}},n={isChanged:function(){return this.getValue()!=
this.getInitValue()},reset:function(b){this.setValue(this.getInitValue(),b)},setInitValue:function(){this._.initValue=this.getValue()},resetInitValue:function(){this._.initValue=this._["default"]},getInitValue:function(){return this._.initValue}},o=CKEDITOR.tools.extend({},CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors,{onChange:function(b,a){this._.domOnChangeRegistered||(b.on("load",function(){this.getInputElement().on("change",function(){b.parts.dialog.isVisible()&&this.fire("change",{value:this.getValue()})},
this)},this),this._.domOnChangeRegistered=!0);this.on("change",a)}},!0),s=/^on([A-Z]\w+)/,p=function(b){for(var a in b)(s.test(a)||"title"==a||"type"==a)&&delete b[a];return b};CKEDITOR.tools.extend(CKEDITOR.ui.dialog,{labeledElement:function(b,a,d,e){if(!(4>arguments.length)){var c=i.call(this,a);c.labelId=CKEDITOR.tools.getNextId()+"_label";this._.children=[];CKEDITOR.ui.dialog.uiElement.call(this,b,a,d,"div",null,{role:"presentation"},function(){var f=[],d=a.required?" cke_required":"";"horizontal"!=
a.labelLayout?f.push('<label class="cke_dialog_ui_labeled_label'+d+'" ',' id="'+c.labelId+'"',c.inputId?' for="'+c.inputId+'"':"",(a.labelStyle?' style="'+a.labelStyle+'"':"")+">",a.label,"</label>",'<div class="cke_dialog_ui_labeled_content"'+(a.controlStyle?' style="'+a.controlStyle+'"':"")+' role="presentation">',e.call(this,b,a),"</div>"):(d={type:"hbox",widths:a.widths,padding:0,children:[{type:"html",html:'<label class="cke_dialog_ui_labeled_label'+d+'" id="'+c.labelId+'" for="'+c.inputId+'"'+
(a.labelStyle?' style="'+a.labelStyle+'"':"")+">"+CKEDITOR.tools.htmlEncode(a.label)+"</span>"},{type:"html",html:'<span class="cke_dialog_ui_labeled_content"'+(a.controlStyle?' style="'+a.controlStyle+'"':"")+">"+e.call(this,b,a)+"</span>"}]},CKEDITOR.dialog._.uiElementBuilders.hbox.build(b,d,f));return f.join("")})}},textInput:function(b,a,d){if(!(3>arguments.length)){i.call(this,a);var e=this._.inputId=CKEDITOR.tools.getNextId()+"_textInput",c={"class":"cke_dialog_ui_input_"+a.type,id:e,type:a.type};
a.validate&&(this.validate=a.validate);a.maxLength&&(c.maxlength=a.maxLength);a.size&&(c.size=a.size);a.inputStyle&&(c.style=a.inputStyle);var f=this,h=!1;b.on("load",function(){f.getInputElement().on("keydown",function(a){a.data.getKeystroke()==13&&(h=true)});f.getInputElement().on("keyup",function(a){if(a.data.getKeystroke()==13&&h){b.getButton("ok")&&setTimeout(function(){b.getButton("ok").click()},0);h=false}},null,null,1E3)});CKEDITOR.ui.dialog.labeledElement.call(this,b,a,d,function(){var b=
['<div class="cke_dialog_ui_input_',a.type,'" role="presentation"'];a.width&&b.push('style="width:'+a.width+'" ');b.push("><input ");c["aria-labelledby"]=this._.labelId;this._.required&&(c["aria-required"]=this._.required);for(var d in c)b.push(d+'="'+c[d]+'" ');b.push(" /></div>");return b.join("")})}},textarea:function(b,a,d){if(!(3>arguments.length)){i.call(this,a);var e=this,c=this._.inputId=CKEDITOR.tools.getNextId()+"_textarea",f={};a.validate&&(this.validate=a.validate);f.rows=a.rows||5;f.cols=
a.cols||20;f["class"]="cke_dialog_ui_input_textarea "+(a["class"]||"");"undefined"!=typeof a.inputStyle&&(f.style=a.inputStyle);a.dir&&(f.dir=a.dir);CKEDITOR.ui.dialog.labeledElement.call(this,b,a,d,function(){f["aria-labelledby"]=this._.labelId;this._.required&&(f["aria-required"]=this._.required);var a=['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="',c,'" '],b;for(b in f)a.push(b+'="'+CKEDITOR.tools.htmlEncode(f[b])+'" ');a.push(">",CKEDITOR.tools.htmlEncode(e._["default"]),
"</textarea></div>");return a.join("")})}},checkbox:function(b,a,d){if(!(3>arguments.length)){var e=i.call(this,a,{"default":!!a["default"]});a.validate&&(this.validate=a.validate);CKEDITOR.ui.dialog.uiElement.call(this,b,a,d,"span",null,null,function(){var c=CKEDITOR.tools.extend({},a,{id:a.id?a.id+"_checkbox":CKEDITOR.tools.getNextId()+"_checkbox"},true),d=[],h=CKEDITOR.tools.getNextId()+"_label",g={"class":"cke_dialog_ui_checkbox_input",type:"checkbox","aria-labelledby":h};p(c);if(a["default"])g.checked=
"checked";if(typeof c.inputStyle!="undefined")c.style=c.inputStyle;e.checkbox=new CKEDITOR.ui.dialog.uiElement(b,c,d,"input",null,g);d.push(' <label id="',h,'" for="',g.id,'"'+(a.labelStyle?' style="'+a.labelStyle+'"':"")+">",CKEDITOR.tools.htmlEncode(a.label),"</label>");return d.join("")})}},radio:function(b,a,d){if(!(3>arguments.length)){i.call(this,a);this._["default"]||(this._["default"]=this._.initValue=a.items[0][1]);a.validate&&(this.validate=a.valdiate);var e=[],c=this;CKEDITOR.ui.dialog.labeledElement.call(this,
b,a,d,function(){for(var d=[],h=[],g=a.id?a.id+"_radio":CKEDITOR.tools.getNextId()+"_radio",k=0;k<a.items.length;k++){var j=a.items[k],i=j[2]!==void 0?j[2]:j[0],l=j[1]!==void 0?j[1]:j[0],m=CKEDITOR.tools.getNextId()+"_radio_input",n=m+"_label",m=CKEDITOR.tools.extend({},a,{id:m,title:null,type:null},true),i=CKEDITOR.tools.extend({},m,{title:i},true),o={type:"radio","class":"cke_dialog_ui_radio_input",name:g,value:l,"aria-labelledby":n},q=[];if(c._["default"]==l)o.checked="checked";p(m);p(i);if(typeof m.inputStyle!=
"undefined")m.style=m.inputStyle;e.push(new CKEDITOR.ui.dialog.uiElement(b,m,q,"input",null,o));q.push(" ");new CKEDITOR.ui.dialog.uiElement(b,i,q,"label",null,{id:n,"for":o.id},j[0]);d.push(q.join(""))}new CKEDITOR.ui.dialog.hbox(b,e,d,h);return h.join("")});this._.children=e}},button:function(b,a,d){if(arguments.length){"function"==typeof a&&(a=a(b.getParentEditor()));i.call(this,a,{disabled:a.disabled||!1});CKEDITOR.event.implementOn(this);var e=this;b.on("load",function(){var a=this.getElement();
(function(){a.on("click",e.click,e);a.on("keydown",function(a){a.data.getKeystroke()in{32:1}&&(e.click(),a.data.preventDefault())})})();a.unselectable()},this);var c=CKEDITOR.tools.extend({},a);delete c.style;var f=CKEDITOR.tools.getNextId()+"_label";CKEDITOR.ui.dialog.uiElement.call(this,b,c,d,"a",null,{style:a.style,href:"javascript:void(0)",title:a.label,hidefocus:"true","class":a["class"],role:"button","aria-labelledby":f},'<span id="'+f+'" class="cke_dialog_ui_button">'+CKEDITOR.tools.htmlEncode(a.label)+
"</span>")}},select:function(b,a,d){if(!(3>arguments.length)){var e=i.call(this,a);a.validate&&(this.validate=a.validate);e.inputId=CKEDITOR.tools.getNextId()+"_select";CKEDITOR.ui.dialog.labeledElement.call(this,b,a,d,function(){var c=CKEDITOR.tools.extend({},a,{id:a.id?a.id+"_select":CKEDITOR.tools.getNextId()+"_select"},true),d=[],h=[],g={id:e.inputId,"class":"cke_dialog_ui_input_select","aria-labelledby":this._.labelId};d.push('<div class="cke_dialog_ui_input_',a.type,'" role="presentation"');
a.width&&d.push('style="width:'+a.width+'" ');d.push(">");if(a.size!=void 0)g.size=a.size;if(a.multiple!=void 0)g.multiple=a.multiple;p(c);for(var k=0,j;k<a.items.length&&(j=a.items[k]);k++)h.push('<option value="',CKEDITOR.tools.htmlEncode(j[1]!==void 0?j[1]:j[0]).replace(/"/g,"&quot;"),'" /> ',CKEDITOR.tools.htmlEncode(j[0]));if(typeof c.inputStyle!="undefined")c.style=c.inputStyle;e.select=new CKEDITOR.ui.dialog.uiElement(b,c,d,"select",null,g,h.join(""));d.push("</div>");return d.join("")})}},
file:function(b,a,d){if(!(3>arguments.length)){void 0===a["default"]&&(a["default"]="");var e=CKEDITOR.tools.extend(i.call(this,a),{definition:a,buttons:[]});a.validate&&(this.validate=a.validate);b.on("load",function(){CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file")});CKEDITOR.ui.dialog.labeledElement.call(this,b,a,d,function(){e.frameId=CKEDITOR.tools.getNextId()+"_fileInput";var b=['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="',
e.frameId,'" title="',a.label,'" src="javascript:void('];b.push(CKEDITOR.env.ie?"(function(){"+encodeURIComponent("document.open();("+CKEDITOR.tools.fixDomain+")();document.close();")+"})()":"0");b.push(')"></iframe>');return b.join("")})}},fileButton:function(b,a,d){if(!(3>arguments.length)){i.call(this,a);var e=this;a.validate&&(this.validate=a.validate);var c=CKEDITOR.tools.extend({},a),f=c.onClick;c.className=(c.className?c.className+" ":"")+"cke_dialog_ui_button";c.onClick=function(c){var d=
a["for"];if(!f||f.call(this,c)!==false){b.getContentElement(d[0],d[1]).submit();this.disable()}};b.on("load",function(){b.getContentElement(a["for"][0],a["for"][1])._.buttons.push(e)});CKEDITOR.ui.dialog.button.call(this,b,c,d)}},html:function(){var b=/^\s*<[\w:]+\s+([^>]*)?>/,a=/^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,d=/\/$/;return function(e,c,f){if(!(3>arguments.length)){var h=[],g=c.html;"<"!=g.charAt(0)&&(g="<span>"+g+"</span>");var k=c.focus;if(k){var j=this.focus;this.focus=function(){("function"==
typeof k?k:j).call(this);this.fire("focus")};c.isFocusable&&(this.isFocusable=this.isFocusable);this.keyboardFocusable=!0}CKEDITOR.ui.dialog.uiElement.call(this,e,c,h,"span",null,null,"");h=h.join("").match(b);g=g.match(a)||["","",""];d.test(g[1])&&(g[1]=g[1].slice(0,-1),g[2]="/"+g[2]);f.push([g[1]," ",h[1]||"",g[2]].join(""))}}}(),fieldset:function(b,a,d,e,c){var f=c.label;this._={children:a};CKEDITOR.ui.dialog.uiElement.call(this,b,c,e,"fieldset",null,null,function(){var a=[];f&&a.push("<legend"+
(c.labelStyle?' style="'+c.labelStyle+'"':"")+">"+f+"</legend>");for(var b=0;b<d.length;b++)a.push(d[b]);return a.join("")})}},!0);CKEDITOR.ui.dialog.html.prototype=new CKEDITOR.ui.dialog.uiElement;CKEDITOR.ui.dialog.labeledElement.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,{setLabel:function(b){var a=CKEDITOR.document.getById(this._.labelId);1>a.getChildCount()?(new CKEDITOR.dom.text(b,CKEDITOR.document)).appendTo(a):a.getChild(0).$.nodeValue=b;return this},getLabel:function(){var b=
CKEDITOR.document.getById(this._.labelId);return!b||1>b.getChildCount()?"":b.getChild(0).getText()},eventProcessors:o},!0);CKEDITOR.ui.dialog.button.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,{click:function(){return!this._.disabled?this.fire("click",{dialog:this._.dialog}):!1},enable:function(){this._.disabled=!1;var b=this.getElement();b&&b.removeClass("cke_disabled")},disable:function(){this._.disabled=!0;this.getElement().addClass("cke_disabled")},isVisible:function(){return this.getElement().getFirst().isVisible()},
isEnabled:function(){return!this._.disabled},eventProcessors:CKEDITOR.tools.extend({},CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors,{onClick:function(b,a){this.on("click",function(){a.apply(this,arguments)})}},!0),accessKeyUp:function(){this.click()},accessKeyDown:function(){this.focus()},keyboardFocusable:!0},!0);CKEDITOR.ui.dialog.textInput.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement,{getInputElement:function(){return CKEDITOR.document.getById(this._.inputId)},
focus:function(){var b=this.selectParentTab();setTimeout(function(){var a=b.getInputElement();a&&a.$.focus()},0)},select:function(){var b=this.selectParentTab();setTimeout(function(){var a=b.getInputElement();a&&(a.$.focus(),a.$.select())},0)},accessKeyUp:function(){this.select()},setValue:function(b){!b&&(b="");return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this,arguments)},keyboardFocusable:!0},n,!0);CKEDITOR.ui.dialog.textarea.prototype=new CKEDITOR.ui.dialog.textInput;CKEDITOR.ui.dialog.select.prototype=
CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement,{getInputElement:function(){return this._.select.getElement()},add:function(b,a,d){var e=new CKEDITOR.dom.element("option",this.getDialog().getParentEditor().document),c=this.getInputElement().$;e.$.text=b;e.$.value=void 0===a||null===a?b:a;void 0===d||null===d?CKEDITOR.env.ie?c.add(e.$):c.add(e.$,null):c.add(e.$,d);return this},remove:function(b){this.getInputElement().$.remove(b);return this},clear:function(){for(var b=this.getInputElement().$;0<
b.length;)b.remove(0);return this},keyboardFocusable:!0},n,!0);CKEDITOR.ui.dialog.checkbox.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,{getInputElement:function(){return this._.checkbox.getElement()},setValue:function(b,a){this.getInputElement().$.checked=b;!a&&this.fire("change",{value:b})},getValue:function(){return this.getInputElement().$.checked},accessKeyUp:function(){this.setValue(!this.getValue())},eventProcessors:{onChange:function(b,a){if(!CKEDITOR.env.ie||8<CKEDITOR.env.version)return o.onChange.apply(this,
arguments);b.on("load",function(){var a=this._.checkbox.getElement();a.on("propertychange",function(b){b=b.data.$;"checked"==b.propertyName&&this.fire("change",{value:a.$.checked})},this)},this);this.on("change",a);return null}},keyboardFocusable:!0},n,!0);CKEDITOR.ui.dialog.radio.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,{setValue:function(b,a){for(var d=this._.children,e,c=0;c<d.length&&(e=d[c]);c++)e.getElement().$.checked=e.getValue()==b;!a&&this.fire("change",{value:b})},
getValue:function(){for(var b=this._.children,a=0;a<b.length;a++)if(b[a].getElement().$.checked)return b[a].getValue();return null},accessKeyUp:function(){var b=this._.children,a;for(a=0;a<b.length;a++)if(b[a].getElement().$.checked){b[a].getElement().focus();return}b[0].getElement().focus()},eventProcessors:{onChange:function(b,a){if(CKEDITOR.env.ie)b.on("load",function(){for(var a=this._.children,b=this,c=0;c<a.length;c++)a[c].getElement().on("propertychange",function(a){a=a.data.$;"checked"==a.propertyName&&
this.$.checked&&b.fire("change",{value:this.getAttribute("value")})})},this),this.on("change",a);else return o.onChange.apply(this,arguments);return null}},keyboardFocusable:!0},n,!0);CKEDITOR.ui.dialog.file.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement,n,{getInputElement:function(){var b=CKEDITOR.document.getById(this._.frameId).getFrameDocument();return 0<b.$.forms.length?new CKEDITOR.dom.element(b.$.forms[0].elements[0]):this.getElement()},submit:function(){this.getInputElement().getParent().$.submit();
return this},getAction:function(){return this.getInputElement().getParent().$.action},registerEvents:function(b){var a=/^on([A-Z]\w+)/,d,e=function(a,b,c,d){a.on("formLoaded",function(){a.getInputElement().on(c,d,a)})},c;for(c in b)if(d=c.match(a))this.eventProcessors[c]?this.eventProcessors[c].call(this,this._.dialog,b[c]):e(this,this._.dialog,d[1].toLowerCase(),b[c]);return this},reset:function(){function b(){d.$.open();var b="";e.size&&(b=e.size-(CKEDITOR.env.ie?7:0));var i=a.frameId+"_input";
d.$.write(['<html dir="'+g+'" lang="'+k+'"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">','<form enctype="multipart/form-data" method="POST" dir="'+g+'" lang="'+k+'" action="',CKEDITOR.tools.htmlEncode(e.action),'"><label id="',a.labelId,'" for="',i,'" style="display:none">',CKEDITOR.tools.htmlEncode(e.label),'</label><input id="',i,'" aria-labelledby="',a.labelId,'" type="file" name="',CKEDITOR.tools.htmlEncode(e.id||"cke_upload"),'" size="',CKEDITOR.tools.htmlEncode(0<
b?b:""),'" /></form></body></html><script>',CKEDITOR.env.ie?"("+CKEDITOR.tools.fixDomain+")();":"","window.parent.CKEDITOR.tools.callFunction("+f+");","window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction("+h+")}","<\/script>"].join(""));d.$.close();for(b=0;b<c.length;b++)c[b].enable()}var a=this._,d=CKEDITOR.document.getById(a.frameId).getFrameDocument(),e=a.definition,c=a.buttons,f=this.formLoadedNumber,h=this.formUnloadNumber,g=a.dialog._.editor.lang.dir,k=a.dialog._.editor.langCode;
f||(f=this.formLoadedNumber=CKEDITOR.tools.addFunction(function(){this.fire("formLoaded")},this),h=this.formUnloadNumber=CKEDITOR.tools.addFunction(function(){this.getInputElement().clearCustomData()},this),this.getDialog()._.editor.on("destroy",function(){CKEDITOR.tools.removeFunction(f);CKEDITOR.tools.removeFunction(h)}));CKEDITOR.env.gecko?setTimeout(b,500):b()},getValue:function(){return this.getInputElement().$.value||""},setInitValue:function(){this._.initValue=""},eventProcessors:{onChange:function(b,
a){this._.domOnChangeRegistered||(this.on("formLoaded",function(){this.getInputElement().on("change",function(){this.fire("change",{value:this.getValue()})},this)},this),this._.domOnChangeRegistered=!0);this.on("change",a)}},keyboardFocusable:!0},!0);CKEDITOR.ui.dialog.fileButton.prototype=new CKEDITOR.ui.dialog.button;CKEDITOR.ui.dialog.fieldset.prototype=CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);CKEDITOR.dialog.addUIElement("text",r);CKEDITOR.dialog.addUIElement("password",r);CKEDITOR.dialog.addUIElement("textarea",
l);CKEDITOR.dialog.addUIElement("checkbox",l);CKEDITOR.dialog.addUIElement("radio",l);CKEDITOR.dialog.addUIElement("button",l);CKEDITOR.dialog.addUIElement("select",l);CKEDITOR.dialog.addUIElement("file",l);CKEDITOR.dialog.addUIElement("fileButton",l);CKEDITOR.dialog.addUIElement("html",l);CKEDITOR.dialog.addUIElement("fieldset",{build:function(b,a,d){for(var e=a.children,c,f=[],h=[],g=0;g<e.length&&(c=e[g]);g++){var i=[];f.push(i);h.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(b,c,i))}return new CKEDITOR.ui.dialog[a.type](b,
h,f,d,a)}})}});CKEDITOR.DIALOG_RESIZE_NONE=0;CKEDITOR.DIALOG_RESIZE_WIDTH=1;CKEDITOR.DIALOG_RESIZE_HEIGHT=2;CKEDITOR.DIALOG_RESIZE_BOTH=3;
(function(){function p(){for(var a=this._.tabIdList.length,b=CKEDITOR.tools.indexOf(this._.tabIdList,this._.currentTabId)+a,c=b-1;c>b-a;c--)if(this._.tabs[this._.tabIdList[c%a]][0].$.offsetHeight)return this._.tabIdList[c%a];return null}function u(){for(var a=this._.tabIdList.length,b=CKEDITOR.tools.indexOf(this._.tabIdList,this._.currentTabId),c=b+1;c<b+a;c++)if(this._.tabs[this._.tabIdList[c%a]][0].$.offsetHeight)return this._.tabIdList[c%a];return null}function q(a,b){for(var c=a.$.getElementsByTagName("input"),
d=0,e=c.length;d<e;d++){var g=new CKEDITOR.dom.element(c[d]);"text"==g.getAttribute("type").toLowerCase()&&(b?(g.setAttribute("value",g.getCustomData("fake_value")||""),g.removeCustomData("fake_value")):(g.setCustomData("fake_value",g.getAttribute("value")),g.setAttribute("value","")))}}function P(a,b){var c=this.getInputElement();c&&(a?c.removeAttribute("aria-invalid"):c.setAttribute("aria-invalid",!0));a||(this.select?this.select():this.focus());b&&alert(b);this.fire("validated",{valid:a,msg:b})}
function Q(){var a=this.getInputElement();a&&a.removeAttribute("aria-invalid")}function R(a){var a=CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog",S).output({id:CKEDITOR.tools.getNextNumber(),editorId:a.id,langDir:a.lang.dir,langCode:a.langCode,editorDialogClass:"cke_editor_"+a.name.replace(/\./g,"\\.")+"_dialog",closeTitle:a.lang.common.close,hidpi:CKEDITOR.env.hidpi?"cke_hidpi":""})),b=a.getChild([0,0,0,0,0]),c=b.getChild(0),d=b.getChild(1);if(CKEDITOR.env.ie&&!CKEDITOR.env.ie6Compat){var e=
"javascript:void(function(){"+encodeURIComponent("document.open();("+CKEDITOR.tools.fixDomain+")();document.close();")+"}())";CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="'+e+'" tabIndex="-1"></iframe>').appendTo(b.getParent())}c.unselectable();d.unselectable();return{element:a,parts:{dialog:a.getChild(0),title:c,close:d,tabs:b.getChild(2),contents:b.getChild([3,0,0,0]),footer:b.getChild([3,0,1,0])}}}function H(a,b,c){this.element=b;this.focusIndex=c;this.tabIndex=
0;this.isFocusable=function(){return!b.getAttribute("disabled")&&b.isVisible()};this.focus=function(){a._.currentFocusIndex=this.focusIndex;this.element.focus()};b.on("keydown",function(a){a.data.getKeystroke()in{32:1,13:1}&&this.fire("click")});b.on("focus",function(){this.fire("mouseover")});b.on("blur",function(){this.fire("mouseout")})}function T(a){function b(){a.layout()}var c=CKEDITOR.document.getWindow();c.on("resize",b);a.on("hide",function(){c.removeListener("resize",b)})}function I(a,b){this._=
{dialog:a};CKEDITOR.tools.extend(this,b)}function U(a){function b(b){var c=a.getSize(),h=CKEDITOR.document.getWindow().getViewPaneSize(),o=b.data.$.screenX,i=b.data.$.screenY,n=o-d.x,l=i-d.y;d={x:o,y:i};e.x+=n;e.y+=l;a.move(e.x+k[3]<f?-k[3]:e.x-k[1]>h.width-c.width-f?h.width-c.width+("rtl"==g.lang.dir?0:k[1]):e.x,e.y+k[0]<f?-k[0]:e.y-k[2]>h.height-c.height-f?h.height-c.height+k[2]:e.y,1);b.data.preventDefault()}function c(){CKEDITOR.document.removeListener("mousemove",b);CKEDITOR.document.removeListener("mouseup",
c);if(CKEDITOR.env.ie6Compat){var a=r.getChild(0).getFrameDocument();a.removeListener("mousemove",b);a.removeListener("mouseup",c)}}var d=null,e=null;a.getElement().getFirst();var g=a.getParentEditor(),f=g.config.dialog_magnetDistance,k=CKEDITOR.skin.margins||[0,0,0,0];"undefined"==typeof f&&(f=20);a.parts.title.on("mousedown",function(f){d={x:f.data.$.screenX,y:f.data.$.screenY};CKEDITOR.document.on("mousemove",b);CKEDITOR.document.on("mouseup",c);e=a.getPosition();if(CKEDITOR.env.ie6Compat){var j=
r.getChild(0).getFrameDocument();j.on("mousemove",b);j.on("mouseup",c)}f.data.preventDefault()},a)}function V(a){var b,c;function d(e){var d="rtl"==k.lang.dir,i=o.width,D=o.height,E=i+(e.data.$.screenX-b)*(d?-1:1)*(a._.moved?1:2),n=D+(e.data.$.screenY-c)*(a._.moved?1:2),x=a._.element.getFirst(),x=d&&x.getComputedStyle("right"),y=a.getPosition();y.y+n>h.height&&(n=h.height-y.y);if((d?x:y.x)+E>h.width)E=h.width-(d?x:y.x);if(f==CKEDITOR.DIALOG_RESIZE_WIDTH||f==CKEDITOR.DIALOG_RESIZE_BOTH)i=Math.max(g.minWidth||
0,E-m);if(f==CKEDITOR.DIALOG_RESIZE_HEIGHT||f==CKEDITOR.DIALOG_RESIZE_BOTH)D=Math.max(g.minHeight||0,n-j);a.resize(i,D);a._.moved||a.layout();e.data.preventDefault()}function e(){CKEDITOR.document.removeListener("mouseup",e);CKEDITOR.document.removeListener("mousemove",d);i&&(i.remove(),i=null);if(CKEDITOR.env.ie6Compat){var a=r.getChild(0).getFrameDocument();a.removeListener("mouseup",e);a.removeListener("mousemove",d)}}var g=a.definition,f=g.resizable;if(f!=CKEDITOR.DIALOG_RESIZE_NONE){var k=a.getParentEditor(),
m,j,h,o,i,n=CKEDITOR.tools.addFunction(function(f){o=a.getSize();var g=a.parts.contents;g.$.getElementsByTagName("iframe").length&&(i=CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'),g.append(i));j=o.height-a.parts.contents.getSize("height",!(CKEDITOR.env.gecko||CKEDITOR.env.opera||CKEDITOR.env.ie&&CKEDITOR.env.quirks));m=o.width-a.parts.contents.getSize("width",1);b=f.screenX;c=f.screenY;h=CKEDITOR.document.getWindow().getViewPaneSize();
CKEDITOR.document.on("mousemove",d);CKEDITOR.document.on("mouseup",e);CKEDITOR.env.ie6Compat&&(g=r.getChild(0).getFrameDocument(),g.on("mousemove",d),g.on("mouseup",e));f.preventDefault&&f.preventDefault()});a.on("load",function(){var b="";f==CKEDITOR.DIALOG_RESIZE_WIDTH?b=" cke_resizer_horizontal":f==CKEDITOR.DIALOG_RESIZE_HEIGHT&&(b=" cke_resizer_vertical");b=CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer'+b+" cke_resizer_"+k.lang.dir+'" title="'+CKEDITOR.tools.htmlEncode(k.lang.common.resize)+
'" onmousedown="CKEDITOR.tools.callFunction('+n+', event )">'+("ltr"==k.lang.dir?"◢":"◣")+"</div>");a.parts.footer.append(b,1)});k.on("destroy",function(){CKEDITOR.tools.removeFunction(n)})}}function F(a){a.data.preventDefault(1)}function J(a){var b=CKEDITOR.document.getWindow(),c=a.config,d=c.dialog_backgroundCoverColor||"white",e=c.dialog_backgroundCoverOpacity,g=c.baseFloatZIndex,c=CKEDITOR.tools.genKey(d,e,g),f=w[c];f?f.show():(g=['<div tabIndex="-1" style="position: ',CKEDITOR.env.ie6Compat?
"absolute":"fixed","; z-index: ",g,"; top: 0px; left: 0px; ",!CKEDITOR.env.ie6Compat?"background-color: "+d:"",'" class="cke_dialog_background_cover">'],CKEDITOR.env.ie6Compat&&(d="<html><body style=\\'background-color:"+d+";\\'></body></html>",g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:'),g.push("void((function(){"+encodeURIComponent("document.open();("+CKEDITOR.tools.fixDomain+")();document.write( '"+d+"' );document.close();")+"})())"),g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')),
g.push("</div>"),f=CKEDITOR.dom.element.createFromHtml(g.join("")),f.setOpacity(void 0!=e?e:0.5),f.on("keydown",F),f.on("keypress",F),f.on("keyup",F),f.appendTo(CKEDITOR.document.getBody()),w[c]=f);a.focusManager.add(f);r=f;var a=function(){var a=b.getViewPaneSize();f.setStyles({width:a.width+"px",height:a.height+"px"})},k=function(){var a=b.getScrollPosition(),c=CKEDITOR.dialog._.currentTop;f.setStyles({left:a.x+"px",top:a.y+"px"});if(c){do{a=c.getPosition();c.move(a.x,a.y)}while(c=c._.parentDialog)
}};G=a;b.on("resize",a);a();(!CKEDITOR.env.mac||!CKEDITOR.env.webkit)&&f.focus();if(CKEDITOR.env.ie6Compat){var m=function(){k();arguments.callee.prevScrollHandler.apply(this,arguments)};b.$.setTimeout(function(){m.prevScrollHandler=window.onscroll||function(){};window.onscroll=m},0);k()}}function K(a){r&&(a.focusManager.remove(r),a=CKEDITOR.document.getWindow(),r.hide(),a.removeListener("resize",G),CKEDITOR.env.ie6Compat&&a.$.setTimeout(function(){window.onscroll=window.onscroll&&window.onscroll.prevScrollHandler||
null},0),G=null)}var s=CKEDITOR.tools.cssLength,S='<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog '+CKEDITOR.env.cssClass+' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
CKEDITOR.dialog=function(a,b){function c(){var a=l._.focusList;a.sort(function(a,b){return a.tabIndex!=b.tabIndex?b.tabIndex-a.tabIndex:a.focusIndex-b.focusIndex});for(var b=a.length,c=0;c<b;c++)a[c].focusIndex=c}function d(a){var b=l._.focusList,a=a||0;if(!(1>b.length)){var c=l._.currentFocusIndex;try{b[c].getInputElement().$.blur()}catch(f){}for(var d=c=(c+a+b.length)%b.length;a&&!b[d].isFocusable()&&!(d=(d+a+b.length)%b.length,d==c););b[d].focus();"text"==b[d].type&&b[d].select()}}function e(b){if(l==
CKEDITOR.dialog._.currentTop){var c=b.data.getKeystroke(),f="rtl"==a.lang.dir;o=i=0;if(9==c||c==CKEDITOR.SHIFT+9)c=c==CKEDITOR.SHIFT+9,l._.tabBarMode?(c=c?p.call(l):u.call(l),l.selectPage(c),l._.tabs[c][0].focus()):d(c?-1:1),o=1;else if(c==CKEDITOR.ALT+121&&!l._.tabBarMode&&1<l.getPageCount())l._.tabBarMode=!0,l._.tabs[l._.currentTabId][0].focus(),o=1;else if((37==c||39==c)&&l._.tabBarMode)c=c==(f?39:37)?p.call(l):u.call(l),l.selectPage(c),l._.tabs[c][0].focus(),o=1;else if((13==c||32==c)&&l._.tabBarMode)this.selectPage(this._.currentTabId),
this._.tabBarMode=!1,this._.currentFocusIndex=-1,d(1),o=1;else if(13==c){c=b.data.getTarget();if(!c.is("a","button","select","textarea")&&(!c.is("input")||"button"!=c.$.type))(c=this.getButton("ok"))&&CKEDITOR.tools.setTimeout(c.click,0,c),o=1;i=1}else if(27==c)(c=this.getButton("cancel"))?CKEDITOR.tools.setTimeout(c.click,0,c):!1!==this.fire("cancel",{hide:!0}).hide&&this.hide(),i=1;else return;g(b)}}function g(a){o?a.data.preventDefault(1):i&&a.data.stopPropagation()}var f=CKEDITOR.dialog._.dialogDefinitions[b],
k=CKEDITOR.tools.clone(W),m=a.config.dialog_buttonsOrder||"OS",j=a.lang.dir,h={},o,i;("OS"==m&&CKEDITOR.env.mac||"rtl"==m&&"ltr"==j||"ltr"==m&&"rtl"==j)&&k.buttons.reverse();f=CKEDITOR.tools.extend(f(a),k);f=CKEDITOR.tools.clone(f);f=new L(this,f);k=R(a);this._={editor:a,element:k.element,name:b,contentSize:{width:0,height:0},size:{width:0,height:0},contents:{},buttons:{},accessKeyMap:{},tabs:{},tabIdList:[],currentTabId:null,currentTabIndex:null,pageCount:0,lastTab:null,tabBarMode:!1,focusList:[],
currentFocusIndex:0,hasFocus:!1};this.parts=k.parts;CKEDITOR.tools.setTimeout(function(){a.fire("ariaWidget",this.parts.contents)},0,this);k={position:CKEDITOR.env.ie6Compat?"absolute":"fixed",top:0,visibility:"hidden"};k["rtl"==j?"right":"left"]=0;this.parts.dialog.setStyles(k);CKEDITOR.event.call(this);this.definition=f=CKEDITOR.fire("dialogDefinition",{name:b,definition:f},a).definition;if(!("removeDialogTabs"in a._)&&a.config.removeDialogTabs){k=a.config.removeDialogTabs.split(";");for(j=0;j<
k.length;j++)if(m=k[j].split(":"),2==m.length){var n=m[0];h[n]||(h[n]=[]);h[n].push(m[1])}a._.removeDialogTabs=h}if(a._.removeDialogTabs&&(h=a._.removeDialogTabs[b]))for(j=0;j<h.length;j++)f.removeContents(h[j]);if(f.onLoad)this.on("load",f.onLoad);if(f.onShow)this.on("show",f.onShow);if(f.onHide)this.on("hide",f.onHide);if(f.onOk)this.on("ok",function(b){a.fire("saveSnapshot");setTimeout(function(){a.fire("saveSnapshot")},0);!1===f.onOk.call(this,b)&&(b.data.hide=!1)});if(f.onCancel)this.on("cancel",
function(a){!1===f.onCancel.call(this,a)&&(a.data.hide=!1)});var l=this,C=function(a){var b=l._.contents,c=!1,d;for(d in b)for(var f in b[d])if(c=a.call(this,b[d][f]))return};this.on("ok",function(a){C(function(b){if(b.validate){var c=b.validate(this),d="string"==typeof c||!1===c;d&&(a.data.hide=!1,a.stop());P.call(b,!d,"string"==typeof c?c:void 0);return d}})},this,null,0);this.on("cancel",function(b){C(function(c){if(c.isChanged())return confirm(a.lang.common.confirmCancel)||(b.data.hide=!1),!0})},
this,null,0);this.parts.close.on("click",function(a){!1!==this.fire("cancel",{hide:!0}).hide&&this.hide();a.data.preventDefault()},this);this.changeFocus=d;var v=this._.element;a.focusManager.add(v,1);this.on("show",function(){v.on("keydown",e,this);if(CKEDITOR.env.opera||CKEDITOR.env.gecko)v.on("keypress",g,this)});this.on("hide",function(){v.removeListener("keydown",e);(CKEDITOR.env.opera||CKEDITOR.env.gecko)&&v.removeListener("keypress",g);C(function(a){Q.apply(a)})});this.on("iframeAdded",function(a){(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown",
e,this,null,0)});this.on("show",function(){c();if(a.config.dialog_startupFocusTab&&1<l._.pageCount)l._.tabBarMode=!0,l._.tabs[l._.currentTabId][0].focus();else if(!this._.hasFocus)if(this._.currentFocusIndex=-1,f.onFocus){var b=f.onFocus.call(this);b&&b.focus()}else d(1)},this,null,4294967295);if(CKEDITOR.env.ie6Compat)this.on("load",function(){var a=this.getElement(),b=a.getFirst();b.remove();b.appendTo(a)},this);U(this);V(this);(new CKEDITOR.dom.text(f.title,CKEDITOR.document)).appendTo(this.parts.title);
for(j=0;j<f.contents.length;j++)(h=f.contents[j])&&this.addPage(h);this.parts.tabs.on("click",function(a){var b=a.data.getTarget();b.hasClass("cke_dialog_tab")&&(b=b.$.id,this.selectPage(b.substring(4,b.lastIndexOf("_"))),this._.tabBarMode&&(this._.tabBarMode=!1,this._.currentFocusIndex=-1,d(1)),a.data.preventDefault())},this);j=[];h=CKEDITOR.dialog._.uiElementBuilders.hbox.build(this,{type:"hbox",className:"cke_dialog_footer_buttons",widths:[],children:f.buttons},j).getChild();this.parts.footer.setHtml(j.join(""));
for(j=0;j<h.length;j++)this._.buttons[h[j].id]=h[j]};CKEDITOR.dialog.prototype={destroy:function(){this.hide();this._.element.remove()},resize:function(){return function(a,b){if(!this._.contentSize||!(this._.contentSize.width==a&&this._.contentSize.height==b))CKEDITOR.dialog.fire("resize",{dialog:this,width:a,height:b},this._.editor),this.fire("resize",{width:a,height:b},this._.editor),this.parts.contents.setStyles({width:a+"px",height:b+"px"}),"rtl"==this._.editor.lang.dir&&this._.position&&(this._.position.x=
CKEDITOR.document.getWindow().getViewPaneSize().width-this._.contentSize.width-parseInt(this._.element.getFirst().getStyle("right"),10)),this._.contentSize={width:a,height:b}}}(),getSize:function(){var a=this._.element.getFirst();return{width:a.$.offsetWidth||0,height:a.$.offsetHeight||0}},move:function(a,b,c){var d=this._.element.getFirst(),e="rtl"==this._.editor.lang.dir,g="fixed"==d.getComputedStyle("position");CKEDITOR.env.ie&&d.setStyle("zoom","100%");if(!g||!this._.position||!(this._.position.x==
a&&this._.position.y==b))this._.position={x:a,y:b},g||(g=CKEDITOR.document.getWindow().getScrollPosition(),a+=g.x,b+=g.y),e&&(g=this.getSize(),a=CKEDITOR.document.getWindow().getViewPaneSize().width-g.width-a),b={top:(0<b?b:0)+"px"},b[e?"right":"left"]=(0<a?a:0)+"px",d.setStyles(b),c&&(this._.moved=1)},getPosition:function(){return CKEDITOR.tools.extend({},this._.position)},show:function(){var a=this._.element,b=this.definition;!a.getParent()||!a.getParent().equals(CKEDITOR.document.getBody())?a.appendTo(CKEDITOR.document.getBody()):
a.setStyle("display","block");if(CKEDITOR.env.gecko&&10900>CKEDITOR.env.version){var c=this.parts.dialog;c.setStyle("position","absolute");setTimeout(function(){c.setStyle("position","fixed")},0)}this.resize(this._.contentSize&&this._.contentSize.width||b.width||b.minWidth,this._.contentSize&&this._.contentSize.height||b.height||b.minHeight);this.reset();this.selectPage(this.definition.contents[0].id);null===CKEDITOR.dialog._.currentZIndex&&(CKEDITOR.dialog._.currentZIndex=this._.editor.config.baseFloatZIndex);
this._.element.getFirst().setStyle("z-index",CKEDITOR.dialog._.currentZIndex+=10);null===CKEDITOR.dialog._.currentTop?(CKEDITOR.dialog._.currentTop=this,this._.parentDialog=null,J(this._.editor)):(this._.parentDialog=CKEDITOR.dialog._.currentTop,this._.parentDialog.getElement().getFirst().$.style.zIndex-=Math.floor(this._.editor.config.baseFloatZIndex/2),CKEDITOR.dialog._.currentTop=this);a.on("keydown",M);a.on(CKEDITOR.env.opera?"keypress":"keyup",N);this._.hasFocus=!1;CKEDITOR.tools.setTimeout(function(){this.layout();
T(this);this.parts.dialog.setStyle("visibility","");this.fireOnce("load",{});CKEDITOR.ui.fire("ready",this);this.fire("show",{});this._.editor.fire("dialogShow",this);this._.parentDialog||this._.editor.focusManager.lock();this.foreach(function(a){a.setInitValue&&a.setInitValue()})},100,this)},layout:function(){var a=this.parts.dialog,b=this.getSize(),c=CKEDITOR.document.getWindow().getViewPaneSize(),d=(c.width-b.width)/2,e=(c.height-b.height)/2;CKEDITOR.env.ie6Compat||(b.height+(0<e?e:0)>c.height||
b.width+(0<d?d:0)>c.width?a.setStyle("position","absolute"):a.setStyle("position","fixed"));this.move(this._.moved?this._.position.x:d,this._.moved?this._.position.y:e)},foreach:function(a){for(var b in this._.contents)for(var c in this._.contents[b])a.call(this,this._.contents[b][c]);return this},reset:function(){var a=function(a){a.reset&&a.reset(1)};return function(){this.foreach(a);return this}}(),setupContent:function(){var a=arguments;this.foreach(function(b){b.setup&&b.setup.apply(b,a)})},
commitContent:function(){var a=arguments;this.foreach(function(b){CKEDITOR.env.ie&&this._.currentFocusIndex==b.focusIndex&&b.getInputElement().$.blur();b.commit&&b.commit.apply(b,a)})},hide:function(){if(this.parts.dialog.isVisible()){this.fire("hide",{});this._.editor.fire("dialogHide",this);this.selectPage(this._.tabIdList[0]);var a=this._.element;a.setStyle("display","none");this.parts.dialog.setStyle("visibility","hidden");for(X(this);CKEDITOR.dialog._.currentTop!=this;)CKEDITOR.dialog._.currentTop.hide();
if(this._.parentDialog){var b=this._.parentDialog.getElement().getFirst();b.setStyle("z-index",parseInt(b.$.style.zIndex,10)+Math.floor(this._.editor.config.baseFloatZIndex/2))}else K(this._.editor);if(CKEDITOR.dialog._.currentTop=this._.parentDialog)CKEDITOR.dialog._.currentZIndex-=10;else{CKEDITOR.dialog._.currentZIndex=null;a.removeListener("keydown",M);a.removeListener(CKEDITOR.env.opera?"keypress":"keyup",N);var c=this._.editor;c.focus();setTimeout(function(){c.focusManager.unlock()},0)}delete this._.parentDialog;
this.foreach(function(a){a.resetInitValue&&a.resetInitValue()})}},addPage:function(a){if(!a.requiredContent||this._.editor.filter.check(a.requiredContent)){for(var b=[],c=a.label?' title="'+CKEDITOR.tools.htmlEncode(a.label)+'"':"",d=CKEDITOR.dialog._.uiElementBuilders.vbox.build(this,{type:"vbox",className:"cke_dialog_page_contents",children:a.elements,expand:!!a.expand,padding:a.padding,style:a.style||"width: 100%;"},b),e=this._.contents[a.id]={},g=d.getChild(),f=0;d=g.shift();)!d.notAllowed&&("hbox"!=
d.type&&"vbox"!=d.type)&&f++,e[d.id]=d,"function"==typeof d.getChild&&g.push.apply(g,d.getChild());f||(a.hidden=!0);b=CKEDITOR.dom.element.createFromHtml(b.join(""));b.setAttribute("role","tabpanel");d=CKEDITOR.env;e="cke_"+a.id+"_"+CKEDITOR.tools.getNextNumber();c=CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"',0<this._.pageCount?" cke_last":"cke_first",c,a.hidden?' style="display:none"':"",' id="',e,'"',d.gecko&&10900<=d.version&&!d.hc?"":' href="javascript:void(0)"',' tabIndex="-1" hidefocus="true" role="tab">',
a.label,"</a>"].join(""));b.setAttribute("aria-labelledby",e);this._.tabs[a.id]=[c,b];this._.tabIdList.push(a.id);!a.hidden&&this._.pageCount++;this._.lastTab=c;this.updateStyle();b.setAttribute("name",a.id);b.appendTo(this.parts.contents);c.unselectable();this.parts.tabs.append(c);a.accessKey&&(O(this,this,"CTRL+"+a.accessKey,Y,Z),this._.accessKeyMap["CTRL+"+a.accessKey]=a.id)}},selectPage:function(a){if(this._.currentTabId!=a&&!0!==this.fire("selectPage",{page:a,currentPage:this._.currentTabId})){for(var b in this._.tabs){var c=
this._.tabs[b][0],d=this._.tabs[b][1];b!=a&&(c.removeClass("cke_dialog_tab_selected"),d.hide());d.setAttribute("aria-hidden",b!=a)}var e=this._.tabs[a];e[0].addClass("cke_dialog_tab_selected");CKEDITOR.env.ie6Compat||CKEDITOR.env.ie7Compat?(q(e[1]),e[1].show(),setTimeout(function(){q(e[1],1)},0)):e[1].show();this._.currentTabId=a;this._.currentTabIndex=CKEDITOR.tools.indexOf(this._.tabIdList,a)}},updateStyle:function(){this.parts.dialog[(1===this._.pageCount?"add":"remove")+"Class"]("cke_single_page")},
hidePage:function(a){var b=this._.tabs[a]&&this._.tabs[a][0];b&&(1!=this._.pageCount&&b.isVisible())&&(a==this._.currentTabId&&this.selectPage(p.call(this)),b.hide(),this._.pageCount--,this.updateStyle())},showPage:function(a){if(a=this._.tabs[a]&&this._.tabs[a][0])a.show(),this._.pageCount++,this.updateStyle()},getElement:function(){return this._.element},getName:function(){return this._.name},getContentElement:function(a,b){var c=this._.contents[a];return c&&c[b]},getValueOf:function(a,b){return this.getContentElement(a,
b).getValue()},setValueOf:function(a,b,c){return this.getContentElement(a,b).setValue(c)},getButton:function(a){return this._.buttons[a]},click:function(a){return this._.buttons[a].click()},disableButton:function(a){return this._.buttons[a].disable()},enableButton:function(a){return this._.buttons[a].enable()},getPageCount:function(){return this._.pageCount},getParentEditor:function(){return this._.editor},getSelectedElement:function(){return this.getParentEditor().getSelection().getSelectedElement()},
addFocusable:function(a,b){if("undefined"==typeof b)b=this._.focusList.length,this._.focusList.push(new H(this,a,b));else{this._.focusList.splice(b,0,new H(this,a,b));for(var c=b+1;c<this._.focusList.length;c++)this._.focusList[c].focusIndex++}}};CKEDITOR.tools.extend(CKEDITOR.dialog,{add:function(a,b){if(!this._.dialogDefinitions[a]||"function"==typeof b)this._.dialogDefinitions[a]=b},exists:function(a){return!!this._.dialogDefinitions[a]},getCurrent:function(){return CKEDITOR.dialog._.currentTop},
isTabEnabled:function(a,b,c){a=a.config.removeDialogTabs;return!(a&&a.match(RegExp("(?:^|;)"+b+":"+c+"(?:$|;)","i")))},okButton:function(){var a=function(a,c){c=c||{};return CKEDITOR.tools.extend({id:"ok",type:"button",label:a.lang.common.ok,"class":"cke_dialog_ui_button_ok",onClick:function(a){a=a.data.dialog;!1!==a.fire("ok",{hide:!0}).hide&&a.hide()}},c,!0)};a.type="button";a.override=function(b){return CKEDITOR.tools.extend(function(c){return a(c,b)},{type:"button"},!0)};return a}(),cancelButton:function(){var a=
function(a,c){c=c||{};return CKEDITOR.tools.extend({id:"cancel",type:"button",label:a.lang.common.cancel,"class":"cke_dialog_ui_button_cancel",onClick:function(a){a=a.data.dialog;!1!==a.fire("cancel",{hide:!0}).hide&&a.hide()}},c,!0)};a.type="button";a.override=function(b){return CKEDITOR.tools.extend(function(c){return a(c,b)},{type:"button"},!0)};return a}(),addUIElement:function(a,b){this._.uiElementBuilders[a]=b}});CKEDITOR.dialog._={uiElementBuilders:{},dialogDefinitions:{},currentTop:null,currentZIndex:null};
CKEDITOR.event.implementOn(CKEDITOR.dialog);CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);var W={resizable:CKEDITOR.DIALOG_RESIZE_BOTH,minWidth:600,minHeight:400,buttons:[CKEDITOR.dialog.okButton,CKEDITOR.dialog.cancelButton]},z=function(a,b,c){for(var d=0,e;e=a[d];d++)if(e.id==b||c&&e[c]&&(e=z(e[c],b,c)))return e;return null},A=function(a,b,c,d,e){if(c){for(var g=0,f;f=a[g];g++){if(f.id==c)return a.splice(g,0,b),b;if(d&&f[d]&&(f=A(f[d],b,c,d,!0)))return f}if(e)return null}a.push(b);return b},
B=function(a,b,c){for(var d=0,e;e=a[d];d++){if(e.id==b)return a.splice(d,1);if(c&&e[c]&&(e=B(e[c],b,c)))return e}return null},L=function(a,b){this.dialog=a;for(var c=b.contents,d=0,e;e=c[d];d++)c[d]=e&&new I(a,e);CKEDITOR.tools.extend(this,b)};L.prototype={getContents:function(a){return z(this.contents,a)},getButton:function(a){return z(this.buttons,a)},addContents:function(a,b){return A(this.contents,a,b)},addButton:function(a,b){return A(this.buttons,a,b)},removeContents:function(a){B(this.contents,
a)},removeButton:function(a){B(this.buttons,a)}};I.prototype={get:function(a){return z(this.elements,a,"children")},add:function(a,b){return A(this.elements,a,b,"children")},remove:function(a){B(this.elements,a,"children")}};var G,w={},r,t={},M=function(a){var b=a.data.$.ctrlKey||a.data.$.metaKey,c=a.data.$.altKey,d=a.data.$.shiftKey,e=String.fromCharCode(a.data.$.keyCode);if((b=t[(b?"CTRL+":"")+(c?"ALT+":"")+(d?"SHIFT+":"")+e])&&b.length)b=b[b.length-1],b.keydown&&b.keydown.call(b.uiElement,b.dialog,
b.key),a.data.preventDefault()},N=function(a){var b=a.data.$.ctrlKey||a.data.$.metaKey,c=a.data.$.altKey,d=a.data.$.shiftKey,e=String.fromCharCode(a.data.$.keyCode);if((b=t[(b?"CTRL+":"")+(c?"ALT+":"")+(d?"SHIFT+":"")+e])&&b.length)b=b[b.length-1],b.keyup&&(b.keyup.call(b.uiElement,b.dialog,b.key),a.data.preventDefault())},O=function(a,b,c,d,e){(t[c]||(t[c]=[])).push({uiElement:a,dialog:b,key:c,keyup:e||a.accessKeyUp,keydown:d||a.accessKeyDown})},X=function(a){for(var b in t){for(var c=t[b],d=c.length-
1;0<=d;d--)(c[d].dialog==a||c[d].uiElement==a)&&c.splice(d,1);0===c.length&&delete t[b]}},Z=function(a,b){a._.accessKeyMap[b]&&a.selectPage(a._.accessKeyMap[b])},Y=function(){};(function(){CKEDITOR.ui.dialog={uiElement:function(a,b,c,d,e,g,f){if(!(4>arguments.length)){var k=(d.call?d(b):d)||"div",m=["<",k," "],j=(e&&e.call?e(b):e)||{},h=(g&&g.call?g(b):g)||{},o=(f&&f.call?f.call(this,a,b):f)||"",i=this.domId=h.id||CKEDITOR.tools.getNextId()+"_uiElement";this.id=b.id;b.requiredContent&&!a.getParentEditor().filter.check(b.requiredContent)&&
(j.display="none",this.notAllowed=!0);h.id=i;var n={};b.type&&(n["cke_dialog_ui_"+b.type]=1);b.className&&(n[b.className]=1);b.disabled&&(n.cke_disabled=1);for(var l=h["class"]&&h["class"].split?h["class"].split(" "):[],i=0;i<l.length;i++)l[i]&&(n[l[i]]=1);l=[];for(i in n)l.push(i);h["class"]=l.join(" ");b.title&&(h.title=b.title);n=(b.style||"").split(";");b.align&&(l=b.align,j["margin-left"]="left"==l?0:"auto",j["margin-right"]="right"==l?0:"auto");for(i in j)n.push(i+":"+j[i]);b.hidden&&n.push("display:none");
for(i=n.length-1;0<=i;i--)""===n[i]&&n.splice(i,1);0<n.length&&(h.style=(h.style?h.style+"; ":"")+n.join("; "));for(i in h)m.push(i+'="'+CKEDITOR.tools.htmlEncode(h[i])+'" ');m.push(">",o,"</",k,">");c.push(m.join(""));(this._||(this._={})).dialog=a;"boolean"==typeof b.isChanged&&(this.isChanged=function(){return b.isChanged});"function"==typeof b.isChanged&&(this.isChanged=b.isChanged);"function"==typeof b.setValue&&(this.setValue=CKEDITOR.tools.override(this.setValue,function(a){return function(c){a.call(this,
b.setValue.call(this,c))}}));"function"==typeof b.getValue&&(this.getValue=CKEDITOR.tools.override(this.getValue,function(a){return function(){return b.getValue.call(this,a.call(this))}}));CKEDITOR.event.implementOn(this);this.registerEvents(b);this.accessKeyUp&&(this.accessKeyDown&&b.accessKey)&&O(this,a,"CTRL+"+b.accessKey);var p=this;a.on("load",function(){var b=p.getInputElement();if(b){var c=p.type in{checkbox:1,ratio:1}&&CKEDITOR.env.ie&&CKEDITOR.env.version<8?"cke_dialog_ui_focused":"";b.on("focus",
function(){a._.tabBarMode=false;a._.hasFocus=true;p.fire("focus");c&&this.addClass(c)});b.on("blur",function(){p.fire("blur");c&&this.removeClass(c)})}});this.keyboardFocusable&&(this.tabIndex=b.tabIndex||0,this.focusIndex=a._.focusList.push(this)-1,this.on("focus",function(){a._.currentFocusIndex=p.focusIndex}));CKEDITOR.tools.extend(this,b)}},hbox:function(a,b,c,d,e){if(!(4>arguments.length)){this._||(this._={});var g=this._.children=b,f=e&&e.widths||null,k=e&&e.height||null,m,j={role:"presentation"};
e&&e.align&&(j.align=e.align);CKEDITOR.ui.dialog.uiElement.call(this,a,e||{type:"hbox"},d,"table",{},j,function(){var a=['<tbody><tr class="cke_dialog_ui_hbox">'];for(m=0;m<c.length;m++){var b="cke_dialog_ui_hbox_child",d=[];0===m&&(b="cke_dialog_ui_hbox_first");m==c.length-1&&(b="cke_dialog_ui_hbox_last");a.push('<td class="',b,'" role="presentation" ');f?f[m]&&d.push("width:"+s(f[m])):d.push("width:"+Math.floor(100/c.length)+"%");k&&d.push("height:"+s(k));e&&void 0!=e.padding&&d.push("padding:"+
s(e.padding));CKEDITOR.env.ie&&(CKEDITOR.env.quirks&&g[m].align)&&d.push("text-align:"+g[m].align);0<d.length&&a.push('style="'+d.join("; ")+'" ');a.push(">",c[m],"</td>")}a.push("</tr></tbody>");return a.join("")})}},vbox:function(a,b,c,d,e){if(!(3>arguments.length)){this._||(this._={});var g=this._.children=b,f=e&&e.width||null,k=e&&e.heights||null;CKEDITOR.ui.dialog.uiElement.call(this,a,e||{type:"vbox"},d,"div",null,{role:"presentation"},function(){var b=['<table role="presentation" cellspacing="0" border="0" '];
b.push('style="');e&&e.expand&&b.push("height:100%;");b.push("width:"+s(f||"100%"),";");CKEDITOR.env.webkit&&b.push("float:none;");b.push('"');b.push('align="',CKEDITOR.tools.htmlEncode(e&&e.align||("ltr"==a.getParentEditor().lang.dir?"left":"right")),'" ');b.push("><tbody>");for(var d=0;d<c.length;d++){var h=[];b.push('<tr><td role="presentation" ');f&&h.push("width:"+s(f||"100%"));k?h.push("height:"+s(k[d])):e&&e.expand&&h.push("height:"+Math.floor(100/c.length)+"%");e&&void 0!=e.padding&&h.push("padding:"+
s(e.padding));CKEDITOR.env.ie&&(CKEDITOR.env.quirks&&g[d].align)&&h.push("text-align:"+g[d].align);0<h.length&&b.push('style="',h.join("; "),'" ');b.push(' class="cke_dialog_ui_vbox_child">',c[d],"</td></tr>")}b.push("</tbody></table>");return b.join("")})}}}})();CKEDITOR.ui.dialog.uiElement.prototype={getElement:function(){return CKEDITOR.document.getById(this.domId)},getInputElement:function(){return this.getElement()},getDialog:function(){return this._.dialog},setValue:function(a,b){this.getInputElement().setValue(a);
!b&&this.fire("change",{value:a});return this},getValue:function(){return this.getInputElement().getValue()},isChanged:function(){return!1},selectParentTab:function(){for(var a=this.getInputElement();(a=a.getParent())&&-1==a.$.className.search("cke_dialog_page_contents"););if(!a)return this;a=a.getAttribute("name");this._.dialog._.currentTabId!=a&&this._.dialog.selectPage(a);return this},focus:function(){this.selectParentTab().getInputElement().focus();return this},registerEvents:function(a){var b=
/^on([A-Z]\w+)/,c,d=function(a,b,c,d){b.on("load",function(){a.getInputElement().on(c,d,a)})},e;for(e in a)if(c=e.match(b))this.eventProcessors[e]?this.eventProcessors[e].call(this,this._.dialog,a[e]):d(this,this._.dialog,c[1].toLowerCase(),a[e]);return this},eventProcessors:{onLoad:function(a,b){a.on("load",b,this)},onShow:function(a,b){a.on("show",b,this)},onHide:function(a,b){a.on("hide",b,this)}},accessKeyDown:function(){this.focus()},accessKeyUp:function(){},disable:function(){var a=this.getElement();
this.getInputElement().setAttribute("disabled","true");a.addClass("cke_disabled")},enable:function(){var a=this.getElement();this.getInputElement().removeAttribute("disabled");a.removeClass("cke_disabled")},isEnabled:function(){return!this.getElement().hasClass("cke_disabled")},isVisible:function(){return this.getInputElement().isVisible()},isFocusable:function(){return!this.isEnabled()||!this.isVisible()?!1:!0}};CKEDITOR.ui.dialog.hbox.prototype=CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,
{getChild:function(a){if(1>arguments.length)return this._.children.concat();a.splice||(a=[a]);return 2>a.length?this._.children[a[0]]:this._.children[a[0]]&&this._.children[a[0]].getChild?this._.children[a[0]].getChild(a.slice(1,a.length)):null}},!0);CKEDITOR.ui.dialog.vbox.prototype=new CKEDITOR.ui.dialog.hbox;(function(){var a={build:function(a,c,d){for(var e=c.children,g,f=[],k=[],m=0;m<e.length&&(g=e[m]);m++){var j=[];f.push(j);k.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a,g,j))}return new CKEDITOR.ui.dialog[c.type](a,
k,f,d,c)}};CKEDITOR.dialog.addUIElement("hbox",a);CKEDITOR.dialog.addUIElement("vbox",a)})();CKEDITOR.dialogCommand=function(a,b){this.dialogName=a;CKEDITOR.tools.extend(this,b,!0)};CKEDITOR.dialogCommand.prototype={exec:function(a){CKEDITOR.env.opera?CKEDITOR.tools.setTimeout(function(){a.openDialog(this.dialogName)},0,this):a.openDialog(this.dialogName)},canUndo:!1,editorFocus:1};(function(){var a=/^([a]|[^a])+$/,b=/^\d*$/,c=/^\d*(?:\.\d+)?$/,d=/^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,e=/^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
g=/^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;CKEDITOR.VALIDATE_OR=1;CKEDITOR.VALIDATE_AND=2;CKEDITOR.dialog.validate={functions:function(){var a=arguments;return function(){var b=this&&this.getValue?this.getValue():a[0],c=void 0,d=CKEDITOR.VALIDATE_AND,e=[],g;for(g=0;g<a.length;g++)if("function"==typeof a[g])e.push(a[g]);else break;g<a.length&&"string"==typeof a[g]&&(c=a[g],g++);g<a.length&&"number"==typeof a[g]&&(d=a[g]);var i=d==CKEDITOR.VALIDATE_AND?!0:!1;for(g=0;g<e.length;g++)i=d==CKEDITOR.VALIDATE_AND?
i&&e[g](b):i||e[g](b);return!i?c:!0}},regex:function(a,b){return function(c){c=this&&this.getValue?this.getValue():c;return!a.test(c)?b:!0}},notEmpty:function(b){return this.regex(a,b)},integer:function(a){return this.regex(b,a)},number:function(a){return this.regex(c,a)},cssLength:function(a){return this.functions(function(a){return e.test(CKEDITOR.tools.trim(a))},a)},htmlLength:function(a){return this.functions(function(a){return d.test(CKEDITOR.tools.trim(a))},a)},inlineStyle:function(a){return this.functions(function(a){return g.test(CKEDITOR.tools.trim(a))},
a)},equals:function(a,b){return this.functions(function(b){return b==a},b)},notEqual:function(a,b){return this.functions(function(b){return b!=a},b)}};CKEDITOR.on("instanceDestroyed",function(a){if(CKEDITOR.tools.isEmpty(CKEDITOR.instances)){for(var b;b=CKEDITOR.dialog._.currentTop;)b.hide();for(var c in w)w[c].remove();w={}}var a=a.editor._.storedDialogs,d;for(d in a)a[d].destroy()})})();CKEDITOR.tools.extend(CKEDITOR.editor.prototype,{openDialog:function(a,b){var c=null,d=CKEDITOR.dialog._.dialogDefinitions[a];
null===CKEDITOR.dialog._.currentTop&&J(this);if("function"==typeof d)c=this._.storedDialogs||(this._.storedDialogs={}),c=c[a]||(c[a]=new CKEDITOR.dialog(this,a)),b&&b.call(c,c),c.show();else{if("failed"==d)throw K(this),Error('[CKEDITOR.dialog.openDialog] Dialog "'+a+'" failed when loading definition.');"string"==typeof d&&CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d),function(){"function"!=typeof CKEDITOR.dialog._.dialogDefinitions[a]&&(CKEDITOR.dialog._.dialogDefinitions[a]="failed");this.openDialog(a,
b)},this,0,1)}CKEDITOR.skin.loadPart("dialog");return c}})})();CKEDITOR.plugins.add("dialog",{requires:"dialogui",init:function(p){p.on("contentDom",function(){var u=p.editable();u.attachListener(u,"dblclick",function(q){if(p.readOnly)return!1;q={element:q.data.getTarget()};p.fire("doubleclick",q);q.dialog&&p.openDialog(q.dialog);return 1})})}});CKEDITOR.plugins.add("about",{requires:"dialog",init:function(a){var b=a.addCommand("about",new CKEDITOR.dialogCommand("about"));b.modes={wysiwyg:1,source:1};b.canUndo=!1;b.readOnly=1;a.ui.addButton&&a.ui.addButton("About",{label:a.lang.about.title,command:"about",toolbar:"about"});CKEDITOR.dialog.add("about",this.path+"dialogs/about.js")}});(function(){CKEDITOR.plugins.add("a11yhelp",{requires:"dialog",availableLangs:{ar:1,bg:1,ca:1,cs:1,cy:1,da:1,de:1,el:1,en:1,eo:1,es:1,et:1,fa:1,fi:1,fr:1,"fr-ca":1,gl:1,gu:1,he:1,hi:1,hr:1,hu:1,id:1,it:1,ja:1,km:1,ku:1,lt:1,lv:1,mk:1,mn:1,nb:1,nl:1,no:1,pl:1,pt:1,"pt-br":1,ro:1,ru:1,si:1,sk:1,sl:1,sq:1,sr:1,"sr-latn":1,sv:1,th:1,tr:1,ug:1,uk:1,vi:1,"zh-cn":1},init:function(b){var c=this;b.addCommand("a11yHelp",{exec:function(){var a=b.langCode,a=c.availableLangs[a]?a:c.availableLangs[a.replace(/-.*/,
"")]?a.replace(/-.*/,""):"en";CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path+"dialogs/lang/"+a+".js"),function(){b.lang.a11yhelp=c.langEntries[a];b.openDialog("a11yHelp")})},modes:{wysiwyg:1,source:1},readOnly:1,canUndo:!1});b.setKeystroke(CKEDITOR.ALT+48,"a11yHelp");CKEDITOR.dialog.add("a11yHelp",this.path+"dialogs/a11yhelp.js")}})})();(function(){function f(c){var a=this.att,c=c&&c.hasAttribute(a)&&c.getAttribute(a)||"";void 0!==c&&this.setValue(c)}function g(){for(var c,a=0;a<arguments.length;a++)if(arguments[a]instanceof CKEDITOR.dom.element){c=arguments[a];break}if(c){var a=this.att,b=this.getValue();b?c.setAttribute(a,b):c.removeAttribute(a,b)}}var i={id:1,dir:1,classes:1,styles:1};CKEDITOR.plugins.add("dialogadvtab",{requires:"dialog",allowedContent:function(c){c||(c=i);var a=[];c.id&&a.push("id");c.dir&&a.push("dir");var b=
"";a.length&&(b+="["+a.join(",")+"]");c.classes&&(b+="(*)");c.styles&&(b+="{*}");return b},createAdvancedTab:function(c,a,b){a||(a=i);var d=c.lang.common,h={id:"advanced",label:d.advancedTab,title:d.advancedTab,elements:[{type:"vbox",padding:1,children:[]}]},e=[];if(a.id||a.dir)a.id&&e.push({id:"advId",att:"id",type:"text",requiredContent:b?b+"[id]":null,label:d.id,setup:f,commit:g}),a.dir&&e.push({id:"advLangDir",att:"dir",type:"select",requiredContent:b?b+"[dir]":null,label:d.langDir,"default":"",
style:"width:100%",items:[[d.notSet,""],[d.langDirLTR,"ltr"],[d.langDirRTL,"rtl"]],setup:f,commit:g}),h.elements[0].children.push({type:"hbox",widths:["50%","50%"],children:[].concat(e)});if(a.styles||a.classes)e=[],a.styles&&e.push({id:"advStyles",att:"style",type:"text",requiredContent:b?b+"{cke-xyz}":null,label:d.styles,"default":"",validate:CKEDITOR.dialog.validate.inlineStyle(d.invalidInlineStyle),onChange:function(){},getStyle:function(a,c){var b=this.getValue().match(RegExp("(?:^|;)\\s*"+a+
"\\s*:\\s*([^;]*)","i"));return b?b[1]:c},updateStyle:function(a,b){var d=this.getValue(),e=c.document.createElement("span");e.setAttribute("style",d);e.setStyle(a,b);d=CKEDITOR.tools.normalizeCssText(e.getAttribute("style"));this.setValue(d,1)},setup:f,commit:g}),a.classes&&e.push({type:"hbox",widths:["45%","55%"],children:[{id:"advCSSClasses",att:"class",type:"text",requiredContent:b?b+"(cke-xyz)":null,label:d.cssClasses,"default":"",setup:f,commit:g}]}),h.elements[0].children.push({type:"hbox",
widths:["50%","50%"],children:[].concat(e)});return h}})})();CKEDITOR.plugins.add("basicstyles",{init:function(c){var e=0,d=function(g,d,b,a){if(a){var a=new CKEDITOR.style(a),f=h[b];f.unshift(a);c.attachStyleStateChange(a,function(a){!c.readOnly&&c.getCommand(b).setState(a)});c.addCommand(b,new CKEDITOR.styleCommand(a,{contentForms:f}));c.ui.addButton&&c.ui.addButton(g,{label:d,command:b,toolbar:"basicstyles,"+(e+=10)})}},h={bold:["strong","b",["span",function(a){a=a.styles["font-weight"];return"bold"==a||700<=+a}]],italic:["em","i",["span",function(a){return"italic"==
a.styles["font-style"]}]],underline:["u",["span",function(a){return"underline"==a.styles["text-decoration"]}]],strike:["s","strike",["span",function(a){return"line-through"==a.styles["text-decoration"]}]],subscript:["sub"],superscript:["sup"]},b=c.config,a=c.lang.basicstyles;d("Bold",a.bold,"bold",b.coreStyles_bold);d("Italic",a.italic,"italic",b.coreStyles_italic);d("Underline",a.underline,"underline",b.coreStyles_underline);d("Strike",a.strike,"strike",b.coreStyles_strike);d("Subscript",a.subscript,
"subscript",b.coreStyles_subscript);d("Superscript",a.superscript,"superscript",b.coreStyles_superscript);c.setKeystroke([[CKEDITOR.CTRL+66,"bold"],[CKEDITOR.CTRL+73,"italic"],[CKEDITOR.CTRL+85,"underline"]])}});CKEDITOR.config.coreStyles_bold={element:"strong",overrides:"b"};CKEDITOR.config.coreStyles_italic={element:"em",overrides:"i"};CKEDITOR.config.coreStyles_underline={element:"u"};CKEDITOR.config.coreStyles_strike={element:"s",overrides:"strike"};CKEDITOR.config.coreStyles_subscript={element:"sub"};
CKEDITOR.config.coreStyles_superscript={element:"sup"};(function(){function n(a,f,d,b){if(!a.isReadOnly()&&!a.equals(d.editable())){CKEDITOR.dom.element.setMarker(b,a,"bidi_processed",1);for(var b=a,c=d.editable();(b=b.getParent())&&!b.equals(c);)if(b.getCustomData("bidi_processed")){a.removeStyle("direction");a.removeAttribute("dir");return}b="useComputedState"in d.config?d.config.useComputedState:1;if((b?a.getComputedStyle("direction"):a.getStyle("direction")||a.hasAttribute("dir"))!=f)a.removeStyle("direction"),b?(a.removeAttribute("dir"),f!=a.getComputedStyle("direction")&&
a.setAttribute("dir",f)):a.setAttribute("dir",f),d.forceNextSelectionCheck()}}function r(a,f,d){var b=a.getCommonAncestor(!1,!0),a=a.clone();a.enlarge(d==CKEDITOR.ENTER_BR?CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:CKEDITOR.ENLARGE_BLOCK_CONTENTS);if(a.checkBoundaryOfElement(b,CKEDITOR.START)&&a.checkBoundaryOfElement(b,CKEDITOR.END)){for(var c;b&&b.type==CKEDITOR.NODE_ELEMENT&&(c=b.getParent())&&1==c.getChildCount()&&!(b.getName()in f);)b=c;return b.type==CKEDITOR.NODE_ELEMENT&&b.getName()in f&&b}}function m(a){return{context:"p",
allowedContent:{"h1 h2 h3 h4 h5 h6 table ul ol blockquote div tr p div li td":{propertiesOnly:!0,attributes:"dir"}},requiredContent:"p[dir]",refresh:function(a,d){var b=a.config.useComputedState,c,b=void 0===b||b;if(!b){c=d.lastElement;for(var h=a.editable();c&&!(c.getName()in q||c.equals(h));){var e=c.getParent();if(!e)break;c=e}}c=c||d.block||d.blockLimit;c.equals(a.editable())&&(h=a.getSelection().getRanges()[0].getEnclosedNode())&&h.type==CKEDITOR.NODE_ELEMENT&&(c=h);c&&(b=b?c.getComputedStyle("direction"):
c.getStyle("direction")||c.getAttribute("dir"),a.getCommand("bidirtl").setState("rtl"==b?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF),a.getCommand("bidiltr").setState("ltr"==b?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF));b=(d.block||d.blockLimit||a.editable()).getDirection(1);if(b!=(a._.selDir||a.lang.dir))a._.selDir=b,a.fire("contentDirChanged",b)},exec:function(f){var d=f.getSelection(),b=f.config.enterMode,c=d.getRanges();if(c&&c.length){for(var h={},e=d.createBookmarks(),c=c.createIterator(),g,
j=0;g=c.getNextRange(1);){var i=g.getEnclosedNode();if(!i||i&&!(i.type==CKEDITOR.NODE_ELEMENT&&i.getName()in o))i=r(g,p,b);i&&n(i,a,f,h);var k=new CKEDITOR.dom.walker(g),l=e[j].startNode,m=e[j++].endNode;k.evaluator=function(a){return!!(a.type==CKEDITOR.NODE_ELEMENT&&a.getName()in p&&!(a.getName()==(b==CKEDITOR.ENTER_P?"p":"div")&&a.getParent().type==CKEDITOR.NODE_ELEMENT&&"blockquote"==a.getParent().getName())&&a.getPosition(l)&CKEDITOR.POSITION_FOLLOWING&&(a.getPosition(m)&CKEDITOR.POSITION_PRECEDING+
CKEDITOR.POSITION_CONTAINS)==CKEDITOR.POSITION_PRECEDING)};for(;i=k.next();)n(i,a,f,h);g=g.createIterator();for(g.enlargeBr=b!=CKEDITOR.ENTER_BR;i=g.getNextParagraph(b==CKEDITOR.ENTER_P?"p":"div");)n(i,a,f,h)}CKEDITOR.dom.element.clearAllMarkers(h);f.forceNextSelectionCheck();d.selectBookmarks(e);f.focus()}}}}function s(a){var f=a==j.setAttribute,d=a==j.removeAttribute,b=/\bdirection\s*:\s*(.*?)\s*(:?$|;)/;return function(c,h){if(!this.isReadOnly()){var e;if(e=c==(f||d?"dir":"direction")||"style"==
c&&(d||b.test(h))){a:{e=this;for(var g=e.getDocument().getBody().getParent();e;){if(e.equals(g)){e=!1;break a}e=e.getParent()}e=!0}e=!e}if(e&&(e=this.getDirection(1),g=a.apply(this,arguments),e!=this.getDirection(1)))return this.getDocument().fire("dirChanged",this),g}return a.apply(this,arguments)}}var p={table:1,ul:1,ol:1,blockquote:1,div:1},o={},q={};CKEDITOR.tools.extend(o,p,{tr:1,p:1,div:1,li:1});CKEDITOR.tools.extend(q,o,{td:1});CKEDITOR.plugins.add("bidi",{init:function(a){function f(b,c,d,
e,f){a.addCommand(d,new CKEDITOR.command(a,e));a.ui.addButton&&a.ui.addButton(b,{label:c,command:d,toolbar:"bidi,"+f})}if(!a.blockless){var d=a.lang.bidi;a.ui.addToolbarGroup&&a.ui.addToolbarGroup("bidi","align","paragraph");f("BidiLtr",d.ltr,"bidiltr",m("ltr"),10);f("BidiRtl",d.rtl,"bidirtl",m("rtl"),20);a.on("contentDom",function(){a.document.on("dirChanged",function(b){a.fire("dirChanged",{node:b.data,dir:b.data.getDirection(1)})})});a.on("contentDirChanged",function(b){var b=(a.lang.dir!=b.data?
"add":"remove")+"Class",c=a.ui.space(a.config.toolbarLocation);if(c)c[b]("cke_mixed_dir_content")})}}});for(var j=CKEDITOR.dom.element.prototype,l=["setStyle","removeStyle","setAttribute","removeAttribute"],k=0;k<l.length;k++)j[l[k]]=CKEDITOR.tools.override(j[l[k]],s)})();(function(){var k={exec:function(g){var a=g.getCommand("blockquote").state,i=g.getSelection(),c=i&&i.getRanges(!0)[0];if(c){var h=i.createBookmarks();if(CKEDITOR.env.ie){var e=h[0].startNode,b=h[0].endNode,d;if(e&&"blockquote"==e.getParent().getName())for(d=e;d=d.getNext();)if(d.type==CKEDITOR.NODE_ELEMENT&&d.isBlockBoundary()){e.move(d,!0);break}if(b&&"blockquote"==b.getParent().getName())for(d=b;d=d.getPrevious();)if(d.type==CKEDITOR.NODE_ELEMENT&&d.isBlockBoundary()){b.move(d);break}}var f=c.createIterator();
f.enlargeBr=g.config.enterMode!=CKEDITOR.ENTER_BR;if(a==CKEDITOR.TRISTATE_OFF){for(e=[];a=f.getNextParagraph();)e.push(a);1>e.length&&(a=g.document.createElement(g.config.enterMode==CKEDITOR.ENTER_P?"p":"div"),b=h.shift(),c.insertNode(a),a.append(new CKEDITOR.dom.text("﻿",g.document)),c.moveToBookmark(b),c.selectNodeContents(a),c.collapse(!0),b=c.createBookmark(),e.push(a),h.unshift(b));d=e[0].getParent();c=[];for(b=0;b<e.length;b++)a=e[b],d=d.getCommonAncestor(a.getParent());for(a={table:1,tbody:1,
tr:1,ol:1,ul:1};a[d.getName()];)d=d.getParent();for(b=null;0<e.length;){for(a=e.shift();!a.getParent().equals(d);)a=a.getParent();a.equals(b)||c.push(a);b=a}for(;0<c.length;)if(a=c.shift(),"blockquote"==a.getName()){for(b=new CKEDITOR.dom.documentFragment(g.document);a.getFirst();)b.append(a.getFirst().remove()),e.push(b.getLast());b.replace(a)}else e.push(a);c=g.document.createElement("blockquote");for(c.insertBefore(e[0]);0<e.length;)a=e.shift(),c.append(a)}else if(a==CKEDITOR.TRISTATE_ON){b=[];
for(d={};a=f.getNextParagraph();){for(e=c=null;a.getParent();){if("blockquote"==a.getParent().getName()){c=a.getParent();e=a;break}a=a.getParent()}c&&(e&&!e.getCustomData("blockquote_moveout"))&&(b.push(e),CKEDITOR.dom.element.setMarker(d,e,"blockquote_moveout",!0))}CKEDITOR.dom.element.clearAllMarkers(d);a=[];e=[];for(d={};0<b.length;)f=b.shift(),c=f.getParent(),f.getPrevious()?f.getNext()?(f.breakParent(f.getParent()),e.push(f.getNext())):f.remove().insertAfter(c):f.remove().insertBefore(c),c.getCustomData("blockquote_processed")||
(e.push(c),CKEDITOR.dom.element.setMarker(d,c,"blockquote_processed",!0)),a.push(f);CKEDITOR.dom.element.clearAllMarkers(d);for(b=e.length-1;0<=b;b--){c=e[b];a:{d=c;for(var f=0,k=d.getChildCount(),j=void 0;f<k&&(j=d.getChild(f));f++)if(j.type==CKEDITOR.NODE_ELEMENT&&j.isBlockBoundary()){d=!1;break a}d=!0}d&&c.remove()}if(g.config.enterMode==CKEDITOR.ENTER_BR)for(c=!0;a.length;)if(f=a.shift(),"div"==f.getName()){b=new CKEDITOR.dom.documentFragment(g.document);c&&(f.getPrevious()&&!(f.getPrevious().type==
CKEDITOR.NODE_ELEMENT&&f.getPrevious().isBlockBoundary()))&&b.append(g.document.createElement("br"));for(c=f.getNext()&&!(f.getNext().type==CKEDITOR.NODE_ELEMENT&&f.getNext().isBlockBoundary());f.getFirst();)f.getFirst().remove().appendTo(b);c&&b.append(g.document.createElement("br"));b.replace(f);c=!1}}i.selectBookmarks(h);g.focus()}},refresh:function(g,a){this.setState(g.elementPath(a.block||a.blockLimit).contains("blockquote",1)?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)},context:"blockquote",
allowedContent:"blockquote",requiredContent:"blockquote"};CKEDITOR.plugins.add("blockquote",{init:function(g){g.blockless||(g.addCommand("blockquote",k),g.ui.addButton&&g.ui.addButton("Blockquote",{label:g.lang.blockquote.toolbar,command:"blockquote",toolbar:"blocks,10"}))}})})();(function(){function w(a){function b(){var d=a.editable();d.on(q,function(a){(!CKEDITOR.env.ie||!m)&&u(a)});CKEDITOR.env.ie&&d.on("paste",function(d){r||(f(),d.data.preventDefault(),u(d),k("paste")||a.openDialog("paste"))});CKEDITOR.env.ie&&(d.on("contextmenu",h,null,null,0),d.on("beforepaste",function(a){a.data&&!a.data.$.ctrlKey&&h()},null,null,0));d.on("beforecut",function(){!m&&l(a)});var v;d.attachListener(CKEDITOR.env.ie?d:a.document.getDocumentElement(),"mouseup",function(){v=setTimeout(function(){s()},
0)});a.on("destroy",function(){clearTimeout(v)});d.on("keyup",s)}function e(d){return{type:d,canUndo:"cut"==d,startDisabled:!0,exec:function(){"cut"==this.type&&l();var d;var b=this.type;if(CKEDITOR.env.ie)d=k(b);else try{d=a.document.$.execCommand(b,!1,null)}catch(c){d=!1}d||alert(a.lang.clipboard[this.type+"Error"]);return d}}}function c(){return{canUndo:!1,async:!0,exec:function(a,b){var c=function(b,c){b&&g(b.type,b.dataValue,!!c);a.fire("afterCommandExec",{name:"paste",command:e,returnValue:!!b})},
e=this;"string"==typeof b?c({type:"auto",dataValue:b},1):a.getClipboardData(c)}}}function f(){r=1;setTimeout(function(){r=0},100)}function h(){m=1;setTimeout(function(){m=0},10)}function k(d){var b=a.document,c=b.getBody(),e=!1,l=function(){e=!0};c.on(d,l);(7<CKEDITOR.env.version?b.$:b.$.selection.createRange()).execCommand(d);c.removeListener(d,l);return e}function g(d,b,c){d={type:d};if(c&&!a.fire("beforePaste",d)||!b)return!1;d.dataValue=b;return a.fire("paste",d)}function l(){if(CKEDITOR.env.ie&&
!CKEDITOR.env.quirks){var d=a.getSelection(),b,c,e;if(d.getType()==CKEDITOR.SELECTION_ELEMENT&&(b=d.getSelectedElement()))c=d.getRanges()[0],e=a.document.createText(""),e.insertBefore(b),c.setStartBefore(e),c.setEndAfter(b),d.selectRanges([c]),setTimeout(function(){b.getParent()&&(e.remove(),d.selectElement(b))},0)}}function i(d,b){var c=a.document,e=a.editable(),l=function(a){a.cancel()},i=CKEDITOR.env.gecko&&10902>=CKEDITOR.env.version,f;if(!c.getById("cke_pastebin")){var h=a.getSelection(),o=h.createBookmarks(),
j=new CKEDITOR.dom.element((CKEDITOR.env.webkit||e.is("body"))&&!CKEDITOR.env.ie&&!CKEDITOR.env.opera?"body":"div",c);j.setAttribute("id","cke_pastebin");CKEDITOR.env.opera&&j.appendBogus();var g=0,c=c.getWindow();i?(j.insertAfter(o[0].startNode),j.setStyle("display","inline")):(CKEDITOR.env.webkit?(e.append(j),j.addClass("cke_editable"),e.is("body")||(i="static"!=e.getComputedStyle("position")?e:CKEDITOR.dom.element.get(e.$.offsetParent),g=i.getDocumentPosition().y)):e.getAscendant(CKEDITOR.env.ie||
CKEDITOR.env.opera?"body":"html",1).append(j),j.setStyles({position:"absolute",top:c.getScrollPosition().y-g+10+"px",width:"1px",height:Math.max(1,c.getViewPaneSize().height-20)+"px",overflow:"hidden",margin:0,padding:0}));(i=j.getParent().isReadOnly())?(j.setOpacity(0),j.setAttribute("contenteditable",!0)):j.setStyle("ltr"==a.config.contentsLangDirection?"left":"right","-1000px");a.on("selectionChange",l,null,null,0);CKEDITOR.env.webkit&&(f=e.once("blur",l,null,null,-100));i&&j.focus();i=new CKEDITOR.dom.range(j);
i.selectNodeContents(j);var k=i.select();CKEDITOR.env.ie&&(f=e.once("blur",function(){a.lockSelection(k)}));var m=CKEDITOR.document.getWindow().getScrollPosition().y;setTimeout(function(){if(CKEDITOR.env.webkit||CKEDITOR.env.opera)CKEDITOR.document[CKEDITOR.env.webkit?"getBody":"getDocumentElement"]().$.scrollTop=m;f&&f.removeListener();CKEDITOR.env.ie&&e.focus();h.selectBookmarks(o);j.remove();var d;if(CKEDITOR.env.webkit&&(d=j.getFirst())&&d.is&&d.hasClass("Apple-style-span"))j=d;a.removeListener("selectionChange",
l);b(j.getHtml())},0)}}function o(){if(CKEDITOR.env.ie){a.focus();f();var d=a.focusManager;d.lock();if(a.editable().fire(q)&&!k("paste"))return d.unlock(),!1;d.unlock()}else try{if(a.editable().fire(q)&&!a.document.$.execCommand("Paste",!1,null))throw 0;}catch(b){return!1}return!0}function p(d){if("wysiwyg"==a.mode)switch(d.data.keyCode){case CKEDITOR.CTRL+86:case CKEDITOR.SHIFT+45:d=a.editable();f();!CKEDITOR.env.ie&&d.fire("beforepaste");(CKEDITOR.env.opera||CKEDITOR.env.gecko&&10900>CKEDITOR.env.version)&&
d.fire("paste");break;case CKEDITOR.CTRL+88:case CKEDITOR.SHIFT+46:a.fire("saveSnapshot"),setTimeout(function(){a.fire("saveSnapshot")},0)}}function u(d){var b={type:"auto"},c=a.fire("beforePaste",b);i(d,function(a){a=a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig,"");c&&g(b.type,a,0,1)})}function s(){if("wysiwyg"==a.mode){var b=n("Paste");a.getCommand("cut").setState(n("Cut"));a.getCommand("copy").setState(n("Copy"));a.getCommand("paste").setState(b);a.fire("pasteState",b)}}function n(b){var c;
if(t&&b in{Paste:1,Cut:1})return CKEDITOR.TRISTATE_DISABLED;if("Paste"==b){CKEDITOR.env.ie&&(m=1);try{c=a.document.$.queryCommandEnabled(b)||CKEDITOR.env.webkit}catch(e){}m=0}else b=a.getSelection(),c=b.getRanges(),c=b.getType()!=CKEDITOR.SELECTION_NONE&&!(1==c.length&&c[0].collapsed);return c?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED}var m=0,r=0,t=0,q=CKEDITOR.env.ie?"beforepaste":"paste";(function(){a.on("key",p);a.on("contentDom",b);a.on("selectionChange",function(a){t=a.data.selection.getRanges()[0].checkReadOnly();
s()});a.contextMenu&&a.contextMenu.addListener(function(a,b){t=b.getRanges()[0].checkReadOnly();return{cut:n("Cut"),copy:n("Copy"),paste:n("Paste")}})})();(function(){function b(c,e,d,l,i){var f=a.lang.clipboard[e];a.addCommand(e,d);a.ui.addButton&&a.ui.addButton(c,{label:f,command:e,toolbar:"clipboard,"+l});a.addMenuItems&&a.addMenuItem(e,{label:f,command:e,group:"clipboard",order:i})}b("Cut","cut",e("cut"),10,1);b("Copy","copy",e("copy"),20,4);b("Paste","paste",c(),30,8)})();a.getClipboardData=
function(b,c){function e(a){a.removeListener();a.cancel();c(a.data)}function l(a){a.removeListener();a.cancel();g=!0;c({type:h,dataValue:a.data})}function i(){this.customTitle=b&&b.title}var f=!1,h="auto",g=!1;c||(c=b,b=null);a.on("paste",e,null,null,0);a.on("beforePaste",function(a){a.removeListener();f=true;h=a.data.type},null,null,1E3);!1===o()&&(a.removeListener("paste",e),f&&a.fire("pasteDialog",i)?(a.on("pasteDialogCommit",l),a.on("dialogHide",function(a){a.removeListener();a.data.removeListener("pasteDialogCommit",
l);setTimeout(function(){g||c(null)},10)})):c(null))}}function x(a){if(CKEDITOR.env.webkit){if(!a.match(/^[^<]*$/g)&&!a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return"html"}else if(CKEDITOR.env.ie){if(!a.match(/^([^<]|<br( ?\/)?>)*$/gi)&&!a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return"html"}else if(CKEDITOR.env.gecko||CKEDITOR.env.opera){if(!a.match(/^([^<]|<br( ?\/)?>)*$/gi))return"html"}else return"html";return"htmlifiedtext"}function y(a,b){function e(a){return CKEDITOR.tools.repeat("</p><p>",
~~(a/2))+(1==a%2?"<br>":"")}b=b.replace(/\s+/g," ").replace(/> +</g,"><").replace(/<br ?\/>/gi,"<br>");b=b.replace(/<\/?[A-Z]+>/g,function(a){return a.toLowerCase()});if(b.match(/^[^<]$/))return b;CKEDITOR.env.webkit&&-1<b.indexOf("<div>")&&(b=b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g,"<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g,"<div></div>"),b.match(/<div>(<br>|)<\/div>/)&&(b="<p>"+b.replace(/(<div>(<br>|)<\/div>)+/g,function(a){return e(a.split("</div><div>").length+1)})+
"</p>"),b=b.replace(/<\/div><div>/g,"<br>"),b=b.replace(/<\/?div>/g,""));if((CKEDITOR.env.gecko||CKEDITOR.env.opera)&&a.enterMode!=CKEDITOR.ENTER_BR)CKEDITOR.env.gecko&&(b=b.replace(/^<br><br>$/,"<br>")),-1<b.indexOf("<br><br>")&&(b="<p>"+b.replace(/(<br>){2,}/g,function(a){return e(a.length/4)})+"</p>");return p(a,b)}function z(){var a=new CKEDITOR.htmlParser.filter,b={blockquote:1,dl:1,fieldset:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,ol:1,p:1,table:1,ul:1},e=CKEDITOR.tools.extend({br:0},CKEDITOR.dtd.$inline),
c={p:1,br:1,"cke:br":1},f=CKEDITOR.dtd,h=CKEDITOR.tools.extend({area:1,basefont:1,embed:1,iframe:1,map:1,object:1,param:1},CKEDITOR.dtd.$nonBodyContent,CKEDITOR.dtd.$cdata),k=function(a){delete a.name;a.add(new CKEDITOR.htmlParser.text(" "))},g=function(a){for(var b=a,c;(b=b.next)&&b.name&&b.name.match(/^h\d$/);){c=new CKEDITOR.htmlParser.element("cke:br");c.isEmpty=!0;for(a.add(c);c=b.children.shift();)a.add(c)}};a.addRules({elements:{h1:g,h2:g,h3:g,h4:g,h5:g,h6:g,img:function(a){var a=CKEDITOR.tools.trim(a.attributes.alt||
""),b=" ";a&&!a.match(/(^http|\.(jpe?g|gif|png))/i)&&(b=" ["+a+"] ");return new CKEDITOR.htmlParser.text(b)},td:k,th:k,$:function(a){var i=a.name,g;if(h[i])return!1;delete a.attributes;if("br"==i)return a;if(b[i])a.name="p";else if(e[i])delete a.name;else if(f[i]){g=new CKEDITOR.htmlParser.element("cke:br");g.isEmpty=!0;if(CKEDITOR.dtd.$empty[i])return g;a.add(g,0);g=g.clone();g.isEmpty=!0;a.add(g);delete a.name}c[a.name]||delete a.name;return a}}});return a}function A(a,b,e){var b=new CKEDITOR.htmlParser.fragment.fromHtml(b),
c=new CKEDITOR.htmlParser.basicWriter;b.writeHtml(c,e);var b=c.getHtml(),b=b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g,"$1").replace(/(<cke:br \/>){2,}/g,"<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g,"$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g,"$1").replace(/<(cke:)?br( \/)?>/g,"<br>").replace(/<p><\/p>/g,""),f=0,b=b.replace(/<\/?p>/g,function(a){if("<p>"==a){if(1<++f)return"</p><p>"}else if(0<--f)return"</p><p>";return a}).replace(/<p><\/p>/g,"");return p(a,b)}function p(a,b){a.enterMode==
CKEDITOR.ENTER_BR?b=b.replace(/(<\/p><p>)+/g,function(a){return CKEDITOR.tools.repeat("<br>",2*(a.length/7))}).replace(/<\/?p>/g,""):a.enterMode==CKEDITOR.ENTER_DIV&&(b=b.replace(/<(\/)?p>/g,"<$1div>"));return b}CKEDITOR.plugins.add("clipboard",{requires:"dialog",init:function(a){var b;w(a);CKEDITOR.dialog.add("paste",CKEDITOR.getUrl(this.path+"dialogs/paste.js"));a.on("paste",function(a){var b=a.data.dataValue,f=CKEDITOR.dtd.$block;-1<b.indexOf("Apple-")&&(b=b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi,
" "),"html"!=a.data.type&&(b=b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi,function(a,b){return b.replace(/\t/g,"&nbsp;&nbsp; &nbsp;")})),-1<b.indexOf('<br class="Apple-interchange-newline">')&&(a.data.startsWithEOL=1,a.data.preSniffing="html",b=b.replace(/<br class="Apple-interchange-newline">/,"")),b=b.replace(/(<[^>]+) class="Apple-[^"]*"/gi,"$1"));if(b.match(/^<[^<]+cke_(editable|contents)/i)){var h,k,g=new CKEDITOR.dom.element("div");for(g.setHtml(b);1==g.getChildCount()&&(h=
g.getFirst())&&h.type==CKEDITOR.NODE_ELEMENT&&(h.hasClass("cke_editable")||h.hasClass("cke_contents"));)g=k=h;k&&(b=k.getHtml().replace(/<br>$/i,""))}CKEDITOR.env.ie?b=b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g,function(b,c){if(c.toLowerCase()in f){a.data.preSniffing="html";return"<"+c}return b}):CKEDITOR.env.webkit?b=b.replace(/<\/(\w+)><div><br><\/div>$/,function(b,c){if(c in f){a.data.endsWithEOL=1;return"</"+c+">"}return b}):CKEDITOR.env.gecko&&(b=b.replace(/(\s)<br>$/,"$1"));a.data.dataValue=b},null,
null,3);a.on("paste",function(e){var e=e.data,c=e.type,f=e.dataValue,h,k=a.config.clipboard_defaultContentType||"html";h="html"==c||"html"==e.preSniffing?"html":x(f);"htmlifiedtext"==h?f=y(a.config,f):"text"==c&&"html"==h&&(f=A(a.config,f,b||(b=z(a))));e.startsWithEOL&&(f='<br data-cke-eol="1">'+f);e.endsWithEOL&&(f+='<br data-cke-eol="1">');"auto"==c&&(c="html"==h||"html"==k?"html":"text");e.type=c;e.dataValue=f;delete e.preSniffing;delete e.startsWithEOL;delete e.endsWithEOL},null,null,6);a.on("paste",
function(b){b=b.data;a.insertHtml(b.dataValue,b.type);setTimeout(function(){a.fire("afterPaste")},0)},null,null,1E3);a.on("pasteDialog",function(b){setTimeout(function(){a.openDialog("paste",b.data)},0)})}})})();(function(){var c='<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"'+(CKEDITOR.env.gecko&&10900<=CKEDITOR.env.version&&!CKEDITOR.env.hc?"":'" href="javascript:void(\'{titleJs}\')"')+' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}"';if(CKEDITOR.env.opera||CKEDITOR.env.gecko&&CKEDITOR.env.mac)c+=' onkeypress="return false;"';CKEDITOR.env.gecko&&(c+=' onblur="this.style.cssText = this.style.cssText;"');var c=
c+(' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"  onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);" '+(CKEDITOR.env.ie?'onclick="return false;" onmouseup':"onclick")+'="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),c=c+'>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label">{label}</span>{arrowHtml}</a>',
m=CKEDITOR.addTemplate("buttonArrow",'<span class="cke_button_arrow">'+(CKEDITOR.env.hc?"&#9660;":"")+"</span>"),n=CKEDITOR.addTemplate("button",c);CKEDITOR.plugins.add("button",{beforeInit:function(a){a.ui.addHandler(CKEDITOR.UI_BUTTON,CKEDITOR.ui.button.handler)}});CKEDITOR.UI_BUTTON="button";CKEDITOR.ui.button=function(a){CKEDITOR.tools.extend(this,a,{title:a.label,click:a.click||function(b){b.execCommand(a.command)}});this._={}};CKEDITOR.ui.button.handler={create:function(a){return new CKEDITOR.ui.button(a)}};
CKEDITOR.ui.button.prototype={render:function(a,b){var c=CKEDITOR.env,i=this._.id=CKEDITOR.tools.getNextId(),f="",e=this.command,l;this._.editor=a;var d={id:i,button:this,editor:a,focus:function(){CKEDITOR.document.getById(i).focus()},execute:function(){this.button.click(a)},attach:function(a){this.button.attach(a)}},o=CKEDITOR.tools.addFunction(function(a){if(d.onkey)return a=new CKEDITOR.dom.event(a),!1!==d.onkey(d,a.getKeystroke())}),p=CKEDITOR.tools.addFunction(function(a){var b;d.onfocus&&(b=
!1!==d.onfocus(d,new CKEDITOR.dom.event(a)));CKEDITOR.env.gecko&&10900>CKEDITOR.env.version&&a.preventBubble();return b}),j=0,q=CKEDITOR.tools.addFunction(function(){if(CKEDITOR.env.opera){var b=a.editable();b.isInline()&&b.hasFocus&&(a.lockSelection(),j=1)}});d.clickFn=l=CKEDITOR.tools.addFunction(function(){j&&(a.unlockSelection(1),j=0);d.execute()});if(this.modes){var k={},g=function(){var b=a.mode;b&&(b=this.modes[b]?void 0!=k[b]?k[b]:CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,this.setState(a.readOnly&&
!this.readOnly?CKEDITOR.TRISTATE_DISABLED:b))};a.on("beforeModeUnload",function(){a.mode&&this._.state!=CKEDITOR.TRISTATE_DISABLED&&(k[a.mode]=this._.state)},this);a.on("mode",g,this);!this.readOnly&&a.on("readOnly",g,this)}else if(e&&(e=a.getCommand(e)))e.on("state",function(){this.setState(e.state)},this),f+=e.state==CKEDITOR.TRISTATE_ON?"on":e.state==CKEDITOR.TRISTATE_DISABLED?"disabled":"off";if(this.directional)a.on("contentDirChanged",function(b){var c=CKEDITOR.document.getById(this._.id),d=
c.getFirst(),b=b.data;b!=a.lang.dir?c.addClass("cke_"+b):c.removeClass("cke_ltr").removeClass("cke_rtl");d.setAttribute("style",CKEDITOR.skin.getIconStyle(h,"rtl"==b,this.icon,this.iconOffset))},this);e||(f+="off");var h=g=this.name||this.command;this.icon&&!/\./.test(this.icon)&&(h=this.icon,this.icon=null);c={id:i,name:g,iconName:h,label:this.label,cls:this.className||"",state:f,title:this.title,titleJs:c.gecko&&10900<=c.version&&!c.hc?"":(this.title||"").replace("'",""),hasArrow:this.hasArrow?
"true":"false",keydownFn:o,mousedownFn:q,focusFn:p,clickFn:l,style:CKEDITOR.skin.getIconStyle(h,"rtl"==a.lang.dir,this.icon,this.iconOffset),arrowHtml:this.hasArrow?m.output():""};n.output(c,b);if(this.onRender)this.onRender();return d},setState:function(a){if(this._.state==a)return!1;this._.state=a;var b=CKEDITOR.document.getById(this._.id);return b?(b.setState(a,"cke_button"),a==CKEDITOR.TRISTATE_DISABLED?b.setAttribute("aria-disabled",!0):b.removeAttribute("aria-disabled"),a==CKEDITOR.TRISTATE_ON?
b.setAttribute("aria-pressed",!0):b.removeAttribute("aria-pressed"),!0):!1},toFeature:function(a){if(this._.feature)return this._.feature;var b=this;!this.allowedContent&&(!this.requiredContent&&this.command)&&(b=a.getCommand(this.command)||b);return this._.feature=b}};CKEDITOR.ui.prototype.addButton=function(a,b){this.add(a,CKEDITOR.UI_BUTTON,b)}})();CKEDITOR.plugins.add("panelbutton",{requires:"button",onLoad:function(){function e(c){var a=this._;a.state!=CKEDITOR.TRISTATE_DISABLED&&(this.createPanel(c),a.on?a.panel.hide():a.panel.showBlock(this._.id,this.document.getById(this._.id),4))}CKEDITOR.ui.panelButton=CKEDITOR.tools.createClass({base:CKEDITOR.ui.button,$:function(c){var a=c.panel||{};delete c.panel;this.base(c);this.document=a.parent&&a.parent.getDocument()||CKEDITOR.document;a.block={attributes:a.attributes};this.hasArrow=a.toolbarRelated=
!0;this.click=e;this._={panelDefinition:a}},statics:{handler:{create:function(c){return new CKEDITOR.ui.panelButton(c)}}},proto:{createPanel:function(c){var a=this._;if(!a.panel){var f=this._.panelDefinition,e=this._.panelDefinition.block,g=f.parent||CKEDITOR.document.getBody(),d=this._.panel=new CKEDITOR.ui.floatPanel(c,g,f),f=d.addBlock(a.id,e),b=this;d.onShow=function(){b.className&&this.element.addClass(b.className+"_panel");b.setState(CKEDITOR.TRISTATE_ON);a.on=1;b.editorFocus&&c.focus();if(b.onOpen)b.onOpen()};
d.onHide=function(d){b.className&&this.element.getFirst().removeClass(b.className+"_panel");b.setState(b.modes&&b.modes[c.mode]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED);a.on=0;if(!d&&b.onClose)b.onClose()};d.onEscape=function(){d.hide(1);b.document.getById(a.id).focus()};if(this.onBlock)this.onBlock(d,f);f.onHide=function(){a.on=0;b.setState(CKEDITOR.TRISTATE_OFF)}}}}})},beforeInit:function(e){e.ui.addHandler(CKEDITOR.UI_PANELBUTTON,CKEDITOR.ui.panelButton.handler)}});
CKEDITOR.UI_PANELBUTTON="panelbutton";(function(){CKEDITOR.plugins.add("panel",{beforeInit:function(a){a.ui.addHandler(CKEDITOR.UI_PANEL,CKEDITOR.ui.panel.handler)}});CKEDITOR.UI_PANEL="panel";CKEDITOR.ui.panel=function(a,b){b&&CKEDITOR.tools.extend(this,b);CKEDITOR.tools.extend(this,{className:"",css:[]});this.id=CKEDITOR.tools.getNextId();this.document=a;this.isFramed=this.forceIFrame||this.css.length;this._={blocks:{}}};CKEDITOR.ui.panel.handler={create:function(a){return new CKEDITOR.ui.panel(a)}};var e=CKEDITOR.addTemplate("panel",
'<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),f=CKEDITOR.addTemplate("panel-frame",'<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),g=CKEDITOR.addTemplate("panel-frame-inner",'<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
CKEDITOR.ui.panel.prototype={render:function(a,b){this.getHolderElement=function(){var a=this._.holder;if(!a){if(this.isFramed){var a=this.document.getById(this.id+"_frame"),b=a.getParent(),a=a.getFrameDocument();CKEDITOR.env.iOS&&b.setStyles({overflow:"scroll","-webkit-overflow-scrolling":"touch"});b=CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function(){this.isLoaded=!0;if(this.onLoad)this.onLoad()},this));a.write(g.output(CKEDITOR.tools.extend({css:CKEDITOR.tools.buildStyleHtml(this.css),onload:"window.parent.CKEDITOR.tools.callFunction("+
b+");"},c)));a.getWindow().$.CKEDITOR=CKEDITOR;a.on("key"+(CKEDITOR.env.opera?"press":"down"),function(a){var b=a.data.getKeystroke(),c=this.document.getById(this.id).getAttribute("dir");this._.onKeyDown&&!1===this._.onKeyDown(b)?a.data.preventDefault():(27==b||b==("rtl"==c?39:37))&&this.onEscape&&!1===this.onEscape(b)&&a.data.preventDefault()},this);a=a.getBody();a.unselectable();CKEDITOR.env.air&&CKEDITOR.tools.callFunction(b)}else a=this.document.getById(this.id);this._.holder=a}return a};var c=
{editorId:a.id,id:this.id,langCode:a.langCode,dir:a.lang.dir,cls:this.className,frame:"",env:CKEDITOR.env.cssClass,"z-index":a.config.baseFloatZIndex+1};if(this.isFramed){var d=CKEDITOR.env.air?"javascript:void(0)":CKEDITOR.env.ie?"javascript:void(function(){"+encodeURIComponent("document.open();("+CKEDITOR.tools.fixDomain+")();document.close();")+"}())":"";c.frame=f.output({id:this.id+"_frame",src:d})}d=e.output(c);b&&b.push(d);return d},addBlock:function(a,b){b=this._.blocks[a]=b instanceof CKEDITOR.ui.panel.block?
b:new CKEDITOR.ui.panel.block(this.getHolderElement(),b);this._.currentBlock||this.showBlock(a);return b},getBlock:function(a){return this._.blocks[a]},showBlock:function(a){var a=this._.blocks[a],b=this._.currentBlock,c=!this.forceIFrame||CKEDITOR.env.ie?this._.holder:this.document.getById(this.id+"_frame");b&&(c.removeAttributes(b.attributes),b.hide());this._.currentBlock=a;c.setAttributes(a.attributes);CKEDITOR.fire("ariaWidget",c);a._.focusIndex=-1;this._.onKeyDown=a.onKeyDown&&CKEDITOR.tools.bind(a.onKeyDown,
a);a.show();return a},destroy:function(){this.element&&this.element.remove()}};CKEDITOR.ui.panel.block=CKEDITOR.tools.createClass({$:function(a,b){this.element=a.append(a.getDocument().createElement("div",{attributes:{tabIndex:-1,"class":"cke_panel_block",role:"presentation",tabindex:0},styles:{display:"none"}}));b&&CKEDITOR.tools.extend(this,b);this.element.setAttributes({"aria-label":this.attributes["aria-label"],title:this.attributes.title||this.attributes["aria-label"]});delete this.attributes["aria-label"];
delete this.attributes.title;this.keys={};this._.focusIndex=-1;this.element.disableContextMenu()},_:{markItem:function(a){-1!=a&&(a=this.element.getElementsByTag("a").getItem(this._.focusIndex=a),(CKEDITOR.env.webkit||CKEDITOR.env.opera)&&a.getDocument().getWindow().focus(),a.focus(),this.onMark&&this.onMark(a))}},proto:{show:function(){this.element.setStyle("display","")},hide:function(){(!this.onHide||!0!==this.onHide.call(this))&&this.element.setStyle("display","none")},onKeyDown:function(a){var b=
this.keys[a];switch(b){case "next":for(var a=this._.focusIndex,b=this.element.getElementsByTag("a"),c;c=b.getItem(++a);)if(c.getAttribute("_cke_focus")&&c.$.offsetWidth){this._.focusIndex=a;c.focus();break}return!1;case "prev":a=this._.focusIndex;for(b=this.element.getElementsByTag("a");0<a&&(c=b.getItem(--a));)if(c.getAttribute("_cke_focus")&&c.$.offsetWidth){this._.focusIndex=a;c.focus();break}return!1;case "click":case "mouseup":return a=this._.focusIndex,(c=0<=a&&this.element.getElementsByTag("a").getItem(a))&&
(c.$[b]?c.$[b]():c.$["on"+b]()),!1}return!0}}})})();CKEDITOR.plugins.add("floatpanel",{requires:"panel"});
(function(){function o(a,b,c,h,g){var g=CKEDITOR.tools.genKey(b.getUniqueId(),c.getUniqueId(),a.lang.dir,a.uiColor||"",h.css||"",g||""),e=i[g];e||(e=i[g]=new CKEDITOR.ui.panel(b,h),e.element=c.append(CKEDITOR.dom.element.createFromHtml(e.render(a),b)),e.element.setStyles({display:"none",position:"absolute"}));return e}var i={};CKEDITOR.ui.floatPanel=CKEDITOR.tools.createClass({$:function(a,b,c,h){function g(){j.hide()}c.forceIFrame=1;c.toolbarRelated&&a.elementMode==CKEDITOR.ELEMENT_MODE_INLINE&&
(b=CKEDITOR.document.getById("cke_"+a.name));var e=b.getDocument(),h=o(a,e,b,c,h||0),k=h.element,d=k.getFirst(),j=this;k.disableContextMenu();this.element=k;this._={editor:a,panel:h,parentElement:b,definition:c,document:e,iframe:d,children:[],dir:a.lang.dir};a.on("mode",g);a.on("resize",g);e.getWindow().on("resize",g)},proto:{addBlock:function(a,b){return this._.panel.addBlock(a,b)},addListBlock:function(a,b){return this._.panel.addListBlock(a,b)},getBlock:function(a){return this._.panel.getBlock(a)},
showBlock:function(a,b,c,h,g){var e=this._.panel,k=e.showBlock(a);this.allowBlur(!1);a=this._.editor.editable();this._.returnFocus=a.hasFocus?a:new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);var d=this.element,a=this._.iframe,a=CKEDITOR.env.ie?a:new CKEDITOR.dom.window(a.$.contentWindow),j=d.getDocument(),i=this._.parentElement.getPositionedAncestor(),n=b.getDocumentPosition(j),j=i?i.getDocumentPosition(j):{x:0,y:0},m="rtl"==this._.dir,f=n.x+(h||0)-j.x,l=n.y+(g||0)-j.y;if(m&&(1==c||4==
c))f+=b.$.offsetWidth;else if(!m&&(2==c||3==c))f+=b.$.offsetWidth-1;if(3==c||4==c)l+=b.$.offsetHeight-1;this._.panel._.offsetParentId=b.getId();d.setStyles({top:l+"px",left:0,display:""});d.setOpacity(0);d.getFirst().removeStyle("width");this._.editor.focusManager.add(a);this._.blurSet||(CKEDITOR.event.useCapture=!0,a.on("blur",function(a){this.allowBlur()&&a.data.getPhase()==CKEDITOR.EVENT_PHASE_AT_TARGET&&(this.visible&&!this._.activeChild)&&(delete this._.returnFocus,this.hide())},this),a.on("focus",
function(){this._.focused=!0;this.hideChild();this.allowBlur(!0)},this),CKEDITOR.event.useCapture=!1,this._.blurSet=1);e.onEscape=CKEDITOR.tools.bind(function(a){if(this.onEscape&&this.onEscape(a)===false)return false},this);CKEDITOR.tools.setTimeout(function(){var a=CKEDITOR.tools.bind(function(){d.removeStyle("width");if(k.autoSize){var a=k.element.getDocument(),a=(CKEDITOR.env.webkit?k.element:a.getBody()).$.scrollWidth;CKEDITOR.env.ie&&(CKEDITOR.env.quirks&&a>0)&&(a=a+((d.$.offsetWidth||0)-(d.$.clientWidth||
0)+3));d.setStyle("width",a+10+"px");a=k.element.$.scrollHeight;CKEDITOR.env.ie&&(CKEDITOR.env.quirks&&a>0)&&(a=a+((d.$.offsetHeight||0)-(d.$.clientHeight||0)+3));d.setStyle("height",a+"px");e._.currentBlock.element.setStyle("display","none").removeStyle("display")}else d.removeStyle("height");m&&(f=f-d.$.offsetWidth);d.setStyle("left",f+"px");var b=e.element.getWindow(),a=d.$.getBoundingClientRect(),b=b.getViewPaneSize(),c=a.width||a.right-a.left,g=a.height||a.bottom-a.top,h=m?a.right:b.width-a.left,
i=m?b.width-a.right:a.left;m?h<c&&(f=i>c?f+c:b.width>c?f-a.left:f-a.right+b.width):h<c&&(f=i>c?f-c:b.width>c?f-a.right+b.width:f-a.left);c=a.top;b.height-a.top<g&&(l=c>g?l-g:b.height>g?l-a.bottom+b.height:l-a.top);if(CKEDITOR.env.ie){b=a=new CKEDITOR.dom.element(d.$.offsetParent);b.getName()=="html"&&(b=b.getDocument().getBody());b.getComputedStyle("direction")=="rtl"&&(f=CKEDITOR.env.ie8Compat?f-d.getDocument().getDocumentElement().$.scrollLeft*2:f-(a.$.scrollWidth-a.$.clientWidth))}var a=d.getFirst(),
j;(j=a.getCustomData("activePanel"))&&j.onHide&&j.onHide.call(this,1);a.setCustomData("activePanel",this);d.setStyles({top:l+"px",left:f+"px"});d.setOpacity(1)},this);e.isLoaded?a():e.onLoad=a;CKEDITOR.tools.setTimeout(function(){this.focus();this.allowBlur(true);this._.editor.fire("panelShow",this)},0,this)},CKEDITOR.env.air?200:0,this);this.visible=1;this.onShow&&this.onShow.call(this)},focus:function(){if(CKEDITOR.env.webkit){var a=CKEDITOR.document.getActive();!a.equals(this._.iframe)&&a.$.blur()}(this._.lastFocused||
this._.iframe.getFrameDocument().getWindow()).focus()},blur:function(){var a=this._.iframe.getFrameDocument().getActive();a.is("a")&&(this._.lastFocused=a)},hide:function(a){if(this.visible&&(!this.onHide||!0!==this.onHide.call(this))){this.hideChild();CKEDITOR.env.gecko&&this._.iframe.getFrameDocument().$.activeElement.blur();this.element.setStyle("display","none");this.visible=0;this.element.getFirst().removeCustomData("activePanel");if(a=a&&this._.returnFocus)CKEDITOR.env.webkit&&a.type&&a.getWindow().$.focus(),
a.focus();delete this._.lastFocused;this._.editor.fire("panelHide",this)}},allowBlur:function(a){var b=this._.panel;void 0!=a&&(b.allowBlur=a);return b.allowBlur},showAsChild:function(a,b,c,h,g,e){this._.activeChild==a&&a._.panel._.offsetParentId==c.getId()||(this.hideChild(),a.onHide=CKEDITOR.tools.bind(function(){CKEDITOR.tools.setTimeout(function(){this._.focused||this.hide()},0,this)},this),this._.activeChild=a,this._.focused=!1,a.showBlock(b,c,h,g,e),this.blur(),(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)&&
setTimeout(function(){a.element.getChild(0).$.style.cssText+=""},100))},hideChild:function(a){var b=this._.activeChild;b&&(delete b.onHide,delete this._.activeChild,b.hide(),a&&this.focus())}}});CKEDITOR.on("instanceDestroyed",function(){var a=CKEDITOR.tools.isEmpty(CKEDITOR.instances),b;for(b in i){var c=i[b];a?c.destroy():c.element.hide()}a&&(i={})})})();CKEDITOR.plugins.add("colorbutton",{requires:"panelbutton,floatpanel",init:function(c){function m(l,g,e,h){var k=new CKEDITOR.style(i["colorButton_"+g+"Style"]),j=CKEDITOR.tools.getNextId()+"_colorBox";c.ui.add(l,CKEDITOR.UI_PANELBUTTON,{label:e,title:e,modes:{wysiwyg:1},editorFocus:1,toolbar:"colors,"+h,allowedContent:k,requiredContent:k,panel:{css:CKEDITOR.skin.getPath("editor"),attributes:{role:"listbox","aria-label":f.panelTitle}},onBlock:function(a,b){b.autoSize=!0;b.element.addClass("cke_colorblock");
b.element.setHtml(o(a,g,j));b.element.getDocument().getBody().setStyle("overflow","hidden");CKEDITOR.ui.fire("ready",this);var d=b.keys,e="rtl"==c.lang.dir;d[e?37:39]="next";d[40]="next";d[9]="next";d[e?39:37]="prev";d[38]="prev";d[CKEDITOR.SHIFT+9]="prev";d[32]="click"},onOpen:function(){var a=c.getSelection(),a=a&&a.getStartElement(),a=c.elementPath(a),b,a=a.block||a.blockLimit||c.document.getBody();do b=a&&a.getComputedStyle("back"==g?"background-color":"color")||"transparent";while("back"==g&&
"transparent"==b&&a&&(a=a.getParent()));if(!b||"transparent"==b)b="#ffffff";this._.panel._.iframe.getFrameDocument().getById(j).setStyle("background-color",b);return b}})}function o(l,g,e){var h=[],k=i.colorButton_colors.split(","),j=CKEDITOR.tools.addFunction(function(a,b){if("?"==a){var e=arguments.callee,d=function(a){this.removeListener("ok",d);this.removeListener("cancel",d);"ok"==a.name&&e(this.getContentElement("picker","selectedColor").getValue(),b)};c.openDialog("colordialog",function(){this.on("ok",
d);this.on("cancel",d)})}else{c.focus();l.hide();c.fire("saveSnapshot");c.removeStyle(new CKEDITOR.style(i["colorButton_"+b+"Style"],{color:"inherit"}));if(a){var f=i["colorButton_"+b+"Style"];f.childRule="back"==b?function(a){return n(a)}:function(a){return!(a.is("a")||a.getElementsByTag("a").count())||n(a)};c.applyStyle(new CKEDITOR.style(f,{color:a}))}c.fire("saveSnapshot")}});h.push('<a class="cke_colorauto" _cke_focus=1 hidefocus=true title="',f.auto,'" onclick="CKEDITOR.tools.callFunction(',
j,",null,'",g,"');return false;\" href=\"javascript:void('",f.auto,'\')" role="option"><table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tr><td><span class="cke_colorbox" id="',e,'"></span></td><td colspan=7 align=center>',f.auto,'</td></tr></table></a><table role="presentation" cellspacing=0 cellpadding=0 width="100%">');for(e=0;e<k.length;e++){0===e%8&&h.push("</tr><tr>");var a=k[e].split("/"),b=a[0],d=a[1]||b;a[1]||(b="#"+b.replace(/^(.)(.)(.)$/,"$1$1$2$2$3$3"));a=c.lang.colorbutton.colors[d]||
d;h.push('<td><a class="cke_colorbox" _cke_focus=1 hidefocus=true title="',a,'" onclick="CKEDITOR.tools.callFunction(',j,",'",b,"','",g,"'); return false;\" href=\"javascript:void('",a,'\')" role="option"><span class="cke_colorbox" style="background-color:#',d,'"></span></a></td>')}(c.plugins.colordialog&&void 0===i.colorButton_enableMore||i.colorButton_enableMore)&&h.push('</tr><tr><td colspan=8 align=center><a class="cke_colormore" _cke_focus=1 hidefocus=true title="',f.more,'" onclick="CKEDITOR.tools.callFunction(',
j,",'?','",g,"');return false;\" href=\"javascript:void('",f.more,"')\"",' role="option">',f.more,"</a></td>");h.push("</tr></table>");return h.join("")}function n(c){return"false"==c.getAttribute("contentEditable")||c.getAttribute("data-nostyle")}var i=c.config,f=c.lang.colorbutton;CKEDITOR.env.hc||(m("TextColor","fore",f.textColorTitle,10),m("BGColor","back",f.bgColorTitle,20))}});CKEDITOR.config.colorButton_colors="000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF";
CKEDITOR.config.colorButton_foreStyle={element:"span",styles:{color:"#(color)"},overrides:[{element:"font",attributes:{color:null}}]};CKEDITOR.config.colorButton_backStyle={element:"span",styles:{"background-color":"#(color)"}};CKEDITOR.plugins.colordialog={requires:"dialog",init:function(b){b.addCommand("colordialog",new CKEDITOR.dialogCommand("colordialog"));CKEDITOR.dialog.add("colordialog",this.path+"dialogs/colordialog.js");b.getColorFromDialog=function(e,f){var c=function(a){this.removeListener("ok",c);this.removeListener("cancel",c);a="ok"==a.name?this.getValueOf("picker","selectedColor"):null;e.call(f,a)},d=function(a){a.on("ok",c);a.on("cancel",c)};b.execCommand("colordialog");if(b._.storedDialogs&&b._.storedDialogs.colordialog)d(b._.storedDialogs.colordialog);
else CKEDITOR.on("dialogDefinition",function(a){if("colordialog"==a.data.name){var b=a.data.definition;a.removeListener();b.onLoad=CKEDITOR.tools.override(b.onLoad,function(a){return function(){d(this);b.onLoad=a;"function"==typeof a&&a.call(this)}})}})}}};CKEDITOR.plugins.add("colordialog",CKEDITOR.plugins.colordialog);(function(){CKEDITOR.plugins.add("templates",{requires:"dialog",init:function(a){CKEDITOR.dialog.add("templates",CKEDITOR.getUrl(this.path+"dialogs/templates.js"));a.addCommand("templates",new CKEDITOR.dialogCommand("templates"));a.ui.addButton&&a.ui.addButton("Templates",{label:a.lang.templates.button,command:"templates",toolbar:"doctools,10"})}});var c={},f={};CKEDITOR.addTemplates=function(a,d){c[a]=d};CKEDITOR.getTemplates=function(a){return c[a]};CKEDITOR.loadTemplates=function(a,d){for(var e=
[],b=0,c=a.length;b<c;b++)f[a[b]]||(e.push(a[b]),f[a[b]]=1);e.length?CKEDITOR.scriptLoader.load(e,d):setTimeout(d,0)}})();CKEDITOR.config.templates_files=[CKEDITOR.getUrl("plugins/templates/templates/default.js")];CKEDITOR.config.templates_replaceContent=!0;CKEDITOR.plugins.add("menu",{requires:"floatpanel",beforeInit:function(k){for(var g=k.config.menu_groups.split(","),m=k._.menuGroups={},l=k._.menuItems={},a=0;a<g.length;a++)m[g[a]]=a+1;k.addMenuGroup=function(b,a){m[b]=a||100};k.addMenuItem=function(a,c){m[c.group]&&(l[a]=new CKEDITOR.menuItem(this,a,c))};k.addMenuItems=function(a){for(var c in a)this.addMenuItem(c,a[c])};k.getMenuItem=function(a){return l[a]};k.removeMenuItem=function(a){delete l[a]}}});
(function(){function k(a){a.sort(function(a,c){return a.group<c.group?-1:a.group>c.group?1:a.order<c.order?-1:a.order>c.order?1:0})}var g='<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="menuitem" aria-haspopup="{hasPopup}" aria-disabled="{disabled}"';if(CKEDITOR.env.opera||CKEDITOR.env.gecko&&CKEDITOR.env.mac)g+=' onkeypress="return false;"';CKEDITOR.env.gecko&&
(g+=' onblur="this.style.cssText = this.style.cssText;"');var g=g+(' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" '+(CKEDITOR.env.ie?'onclick="return false;" onmouseup':"onclick")+'="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),m=CKEDITOR.addTemplate("menuItem",g+'<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
l=CKEDITOR.addTemplate("menuArrow",'<span class="cke_menuarrow"><span>{label}</span></span>');CKEDITOR.menu=CKEDITOR.tools.createClass({$:function(a,b){b=this._.definition=b||{};this.id=CKEDITOR.tools.getNextId();this.editor=a;this.items=[];this._.listeners=[];this._.level=b.level||1;var c=CKEDITOR.tools.extend({},b.panel,{css:[CKEDITOR.skin.getPath("editor")],level:this._.level-1,block:{}}),j=c.block.attributes=c.attributes||{};!j.role&&(j.role="menu");this._.panelDefinition=c},_:{onShow:function(){var a=
this.editor.getSelection(),b=a&&a.getStartElement(),c=this.editor.elementPath(),j=this._.listeners;this.removeAll();for(var e=0;e<j.length;e++){var i=j[e](b,a,c);if(i)for(var f in i){var h=this.editor.getMenuItem(f);if(h&&(!h.command||this.editor.getCommand(h.command).state))h.state=i[f],this.add(h)}}},onClick:function(a){this.hide();if(a.onClick)a.onClick();else a.command&&this.editor.execCommand(a.command)},onEscape:function(a){var b=this.parent;b?b._.panel.hideChild(1):27==a&&this.hide(1);return!1},
onHide:function(){this.onHide&&this.onHide()},showSubMenu:function(a){var b=this._.subMenu,c=this.items[a];if(c=c.getItems&&c.getItems()){b?b.removeAll():(b=this._.subMenu=new CKEDITOR.menu(this.editor,CKEDITOR.tools.extend({},this._.definition,{level:this._.level+1},!0)),b.parent=this,b._.onClick=CKEDITOR.tools.bind(this._.onClick,this));for(var j in c){var e=this.editor.getMenuItem(j);e&&(e.state=c[j],b.add(e))}var i=this._.panel.getBlock(this.id).element.getDocument().getById(this.id+(""+a));setTimeout(function(){b.show(i,
2)},0)}else this._.panel.hideChild(1)}},proto:{add:function(a){a.order||(a.order=this.items.length);this.items.push(a)},removeAll:function(){this.items=[]},show:function(a,b,c,j){if(!this.parent&&(this._.onShow(),!this.items.length))return;var b=b||("rtl"==this.editor.lang.dir?2:1),e=this.items,i=this.editor,f=this._.panel,h=this._.element;if(!f){f=this._.panel=new CKEDITOR.ui.floatPanel(this.editor,CKEDITOR.document.getBody(),this._.panelDefinition,this._.level);f.onEscape=CKEDITOR.tools.bind(function(a){if(!1===
this._.onEscape(a))return!1},this);f.onShow=function(){f._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")};f.onHide=CKEDITOR.tools.bind(function(){this._.onHide&&this._.onHide()},this);h=f.addBlock(this.id,this._.panelDefinition.block);h.autoSize=!0;var d=h.keys;d[40]="next";d[9]="next";d[38]="prev";d[CKEDITOR.SHIFT+9]="prev";d["rtl"==i.lang.dir?37:39]=CKEDITOR.env.ie?"mouseup":"click";d[32]=CKEDITOR.env.ie?"mouseup":"click";CKEDITOR.env.ie&&(d[13]="mouseup");h=this._.element=
h.element;d=h.getDocument();d.getBody().setStyle("overflow","hidden");d.getElementsByTag("html").getItem(0).setStyle("overflow","hidden");this._.itemOverFn=CKEDITOR.tools.addFunction(function(a){clearTimeout(this._.showSubTimeout);this._.showSubTimeout=CKEDITOR.tools.setTimeout(this._.showSubMenu,i.config.menu_subMenuDelay||400,this,[a])},this);this._.itemOutFn=CKEDITOR.tools.addFunction(function(){clearTimeout(this._.showSubTimeout)},this);this._.itemClickFn=CKEDITOR.tools.addFunction(function(a){var b=
this.items[a];if(b.state==CKEDITOR.TRISTATE_DISABLED)this.hide(1);else if(b.getItems)this._.showSubMenu(a);else this._.onClick(b)},this)}k(e);for(var d=i.elementPath(),d=['<div class="cke_menu'+(d&&d.direction()!=i.lang.dir?" cke_mixed_dir_content":"")+'" role="presentation">'],g=e.length,m=g&&e[0].group,l=0;l<g;l++){var n=e[l];m!=n.group&&(d.push('<div class="cke_menuseparator" role="separator"></div>'),m=n.group);n.render(this,l,d)}d.push("</div>");h.setHtml(d.join(""));CKEDITOR.ui.fire("ready",
this);this.parent?this.parent._.panel.showAsChild(f,this.id,a,b,c,j):f.showBlock(this.id,a,b,c,j);i.fire("menuShow",[f])},addListener:function(a){this._.listeners.push(a)},hide:function(a){this._.onHide&&this._.onHide();this._.panel&&this._.panel.hide(a)}}});CKEDITOR.menuItem=CKEDITOR.tools.createClass({$:function(a,b,c){CKEDITOR.tools.extend(this,c,{order:0,className:"cke_menubutton__"+b});this.group=a._.menuGroups[this.group];this.editor=a;this.name=b},proto:{render:function(a,b,c){var g=a.id+(""+
b),e="undefined"==typeof this.state?CKEDITOR.TRISTATE_OFF:this.state,i=e==CKEDITOR.TRISTATE_ON?"on":e==CKEDITOR.TRISTATE_DISABLED?"disabled":"off",f=this.getItems,h="&#"+("rtl"==this.editor.lang.dir?"9668":"9658")+";",d=this.name;this.icon&&!/\./.test(this.icon)&&(d=this.icon);a={id:g,name:this.name,iconName:d,label:this.label,cls:this.className||"",state:i,hasPopup:f?"true":"false",disabled:e==CKEDITOR.TRISTATE_DISABLED,title:this.label,href:"javascript:void('"+(this.label||"").replace("'")+"')",
hoverFn:a._.itemOverFn,moveOutFn:a._.itemOutFn,clickFn:a._.itemClickFn,index:b,iconStyle:CKEDITOR.skin.getIconStyle(d,"rtl"==this.editor.lang.dir,d==this.icon?null:this.icon,this.iconOffset),arrowHtml:f?l.output({label:h}):""};m.output(a,c)}}})})();CKEDITOR.config.menu_groups="clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";CKEDITOR.plugins.add("contextmenu",{requires:"menu",onLoad:function(){CKEDITOR.plugins.contextMenu=CKEDITOR.tools.createClass({base:CKEDITOR.menu,$:function(b){this.base.call(this,b,{panel:{className:"cke_menu_panel",attributes:{"aria-label":b.lang.contextmenu.options}}})},proto:{addTarget:function(b,d){if(CKEDITOR.env.opera&&!("oncontextmenu"in document.body)){var c;b.on("mousedown",function(a){a=a.data;if(2!=a.$.button)a.getKeystroke()==CKEDITOR.CTRL+1&&b.fire("contextmenu",a);else if(!d||!(CKEDITOR.env.mac?
a.$.metaKey:a.$.ctrlKey)){var g=a.getTarget();c||(g=g.getDocument(),c=g.createElement("input"),c.$.type="button",g.getBody().append(c));c.setAttribute("style","position:absolute;top:"+(a.$.clientY-2)+"px;left:"+(a.$.clientX-2)+"px;width:5px;height:5px;opacity:0.01")}});b.on("mouseup",function(a){c&&(c.remove(),c=void 0,b.fire("contextmenu",a.data))})}b.on("contextmenu",function(a){a=a.data;if(!d||!(CKEDITOR.env.webkit?e:CKEDITOR.env.mac?a.$.metaKey:a.$.ctrlKey)){a.preventDefault();var b=a.getTarget().getDocument(),
c=a.getTarget().getDocument().getDocumentElement(),f=!b.equals(CKEDITOR.document),b=b.getWindow().getScrollPosition(),h=f?a.$.clientX:a.$.pageX||b.x+a.$.clientX,i=f?a.$.clientY:a.$.pageY||b.y+a.$.clientY;CKEDITOR.tools.setTimeout(function(){this.open(c,null,h,i)},CKEDITOR.env.ie?200:0,this)}},this);if(CKEDITOR.env.opera)b.on("keypress",function(a){a=a.data;0===a.$.keyCode&&a.preventDefault()});if(CKEDITOR.env.webkit){var e,f=function(){e=0};b.on("keydown",function(a){e=CKEDITOR.env.mac?a.data.$.metaKey:
a.data.$.ctrlKey});b.on("keyup",f);b.on("contextmenu",f)}},open:function(b,d,c,e){this.editor.focus();b=b||CKEDITOR.document.getDocumentElement();this.editor.selectionChange(1);this.show(b,d,c,e)}}})},beforeInit:function(b){var d=b.contextMenu=new CKEDITOR.plugins.contextMenu(b);b.on("contentDom",function(){d.addTarget(b.editable(),!1!==b.config.browserContextMenuOnCtrl)});b.addCommand("contextMenu",{exec:function(){b.contextMenu.open(b.document.getBody())}});b.setKeystroke(CKEDITOR.SHIFT+121,"contextMenu");
b.setKeystroke(CKEDITOR.CTRL+CKEDITOR.SHIFT+121,"contextMenu")}});(function(){CKEDITOR.plugins.add("div",{requires:"dialog",init:function(a){if(!a.blockless){var c=a.lang.div,b="div(*)";CKEDITOR.dialog.isTabEnabled(a,"editdiv","advanced")&&(b+=";div[dir,id,lang,title]{*}");a.addCommand("creatediv",new CKEDITOR.dialogCommand("creatediv",{allowedContent:b,requiredContent:"div",contextSensitive:!0,refresh:function(a,c){this.setState("div"in(a.config.div_wrapTable?c.root:c.blockLimit).getDtd()?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED)}}));a.addCommand("editdiv",
new CKEDITOR.dialogCommand("editdiv",{requiredContent:"div"}));a.addCommand("removediv",{requiredContent:"div",exec:function(a){function c(b){if((b=CKEDITOR.plugins.div.getSurroundDiv(a,b))&&!b.data("cke-div-added"))f.push(b),b.data("cke-div-added")}for(var b=a.getSelection(),g=b&&b.getRanges(),e,h=b.createBookmarks(),f=[],d=0;d<g.length;d++)e=g[d],e.collapsed?c(b.getStartElement()):(e=new CKEDITOR.dom.walker(e),e.evaluator=c,e.lastForward());for(d=0;d<f.length;d++)f[d].remove(!0);b.selectBookmarks(h)}});
a.ui.addButton&&a.ui.addButton("CreateDiv",{label:c.toolbar,command:"creatediv",toolbar:"blocks,50"});a.addMenuItems&&(a.addMenuItems({editdiv:{label:c.edit,command:"editdiv",group:"div",order:1},removediv:{label:c.remove,command:"removediv",group:"div",order:5}}),a.contextMenu&&a.contextMenu.addListener(function(b){return!b||b.isReadOnly()?null:CKEDITOR.plugins.div.getSurroundDiv(a)?{editdiv:CKEDITOR.TRISTATE_OFF,removediv:CKEDITOR.TRISTATE_OFF}:null}));CKEDITOR.dialog.add("creatediv",this.path+
"dialogs/div.js");CKEDITOR.dialog.add("editdiv",this.path+"dialogs/div.js")}}});CKEDITOR.plugins.div={getSurroundDiv:function(a,c){var b=a.elementPath(c);return a.elementPath(b.blockLimit).contains("div",1)}}})();CKEDITOR.plugins.add("resize",{init:function(b){var f,g,n,o,a=b.config,q=b.ui.spaceId("resizer"),h=b.element?b.element.getDirection(1):"ltr";!a.resize_dir&&(a.resize_dir="vertical");void 0==a.resize_maxWidth&&(a.resize_maxWidth=3E3);void 0==a.resize_maxHeight&&(a.resize_maxHeight=3E3);void 0==a.resize_minWidth&&(a.resize_minWidth=750);void 0==a.resize_minHeight&&(a.resize_minHeight=250);if(!1!==a.resize_enabled){var c=null,i=("both"==a.resize_dir||"horizontal"==a.resize_dir)&&a.resize_minWidth!=a.resize_maxWidth,
l=("both"==a.resize_dir||"vertical"==a.resize_dir)&&a.resize_minHeight!=a.resize_maxHeight,j=function(d){var e=f,m=g,c=e+(d.data.$.screenX-n)*("rtl"==h?-1:1),d=m+(d.data.$.screenY-o);i&&(e=Math.max(a.resize_minWidth,Math.min(c,a.resize_maxWidth)));l&&(m=Math.max(a.resize_minHeight,Math.min(d,a.resize_maxHeight)));b.resize(i?e:null,m)},k=function(){CKEDITOR.document.removeListener("mousemove",j);CKEDITOR.document.removeListener("mouseup",k);b.document&&(b.document.removeListener("mousemove",j),b.document.removeListener("mouseup",
k))},p=CKEDITOR.tools.addFunction(function(d){c||(c=b.getResizable());f=c.$.offsetWidth||0;g=c.$.offsetHeight||0;n=d.screenX;o=d.screenY;a.resize_minWidth>f&&(a.resize_minWidth=f);a.resize_minHeight>g&&(a.resize_minHeight=g);CKEDITOR.document.on("mousemove",j);CKEDITOR.document.on("mouseup",k);b.document&&(b.document.on("mousemove",j),b.document.on("mouseup",k));d.preventDefault&&d.preventDefault()});b.on("destroy",function(){CKEDITOR.tools.removeFunction(p)});b.on("uiSpace",function(a){if("bottom"==
a.data.space){var e="";i&&!l&&(e=" cke_resizer_horizontal");!i&&l&&(e=" cke_resizer_vertical");var c='<span id="'+q+'" class="cke_resizer'+e+" cke_resizer_"+h+'" title="'+CKEDITOR.tools.htmlEncode(b.lang.common.resize)+'" onmousedown="CKEDITOR.tools.callFunction('+p+', event)">'+("ltr"==h?"◢":"◣")+"</span>";"ltr"==h&&"ltr"==e?a.data.html+=c:a.data.html=c+a.data.html}},b,null,100);b.on("maximize",function(a){b.ui.space("resizer")[a.data==CKEDITOR.TRISTATE_ON?"hide":"show"]()})}}});(function(){function w(a){function d(){for(var b=i(),e=CKEDITOR.tools.clone(a.config.toolbarGroups)||n(a),f=0;f<e.length;f++){var k=e[f];if("/"!=k){"string"==typeof k&&(k=e[f]={name:k});var j,d=k.groups;if(d)for(var h=0;h<d.length;h++)j=d[h],(j=b[j])&&c(k,j);(j=b[k.name])&&c(k,j)}}return e}function i(){var b={},c,f,e;for(c in a.ui.items)f=a.ui.items[c],e=f.toolbar||"others",e=e.split(","),f=e[0],e=parseInt(e[1]||-1,10),b[f]||(b[f]=[]),b[f].push({name:c,order:e});for(f in b)b[f]=b[f].sort(function(b,
a){return b.order==a.order?0:0>a.order?-1:0>b.order?1:b.order<a.order?-1:1});return b}function c(c,e){if(e.length){c.items?c.items.push(a.ui.create("-")):c.items=[];for(var f;f=e.shift();)if(f="string"==typeof f?f:f.name,!b||-1==CKEDITOR.tools.indexOf(b,f))(f=a.ui.create(f))&&a.addFeature(f)&&c.items.push(f)}}function h(b){var a=[],e,d,h;for(e=0;e<b.length;++e)d=b[e],h={},"/"==d?a.push(d):CKEDITOR.tools.isArray(d)?(c(h,CKEDITOR.tools.clone(d)),a.push(h)):d.items&&(c(h,CKEDITOR.tools.clone(d.items)),
h.name=d.name,a.push(h));return a}var b=a.config.removeButtons,b=b&&b.split(","),e=a.config.toolbar;"string"==typeof e&&(e=a.config["toolbar_"+e]);return a.toolbar=e?h(e):d()}function n(a){return a._.toolbarGroups||(a._.toolbarGroups=[{name:"document",groups:["mode","document","doctools"]},{name:"clipboard",groups:["clipboard","undo"]},{name:"editing",groups:["find","selection","spellchecker"]},{name:"forms"},"/",{name:"basicstyles",groups:["basicstyles","cleanup"]},{name:"paragraph",groups:["list",
"indent","blocks","align"]},{name:"links"},{name:"insert"},"/",{name:"styles"},{name:"colors"},{name:"tools"},{name:"others"},{name:"about"}])}var t=function(){this.toolbars=[];this.focusCommandExecuted=!1};t.prototype.focus=function(){for(var a=0,d;d=this.toolbars[a++];)for(var i=0,c;c=d.items[i++];)if(c.focus){c.focus();return}};var x={modes:{wysiwyg:1,source:1},readOnly:1,exec:function(a){a.toolbox&&(a.toolbox.focusCommandExecuted=!0,CKEDITOR.env.ie||CKEDITOR.env.air?setTimeout(function(){a.toolbox.focus()},
100):a.toolbox.focus())}};CKEDITOR.plugins.add("toolbar",{requires:"button",init:function(a){var d,i=function(c,h){var b,e="rtl"==a.lang.dir,g=a.config.toolbarGroupCycling,g=void 0===g||g;switch(h){case 9:case CKEDITOR.SHIFT+9:for(;!b||!b.items.length;)if(b=9==h?(b?b.next:c.toolbar.next)||a.toolbox.toolbars[0]:(b?b.previous:c.toolbar.previous)||a.toolbox.toolbars[a.toolbox.toolbars.length-1],b.items.length)for(c=b.items[d?b.items.length-1:0];c&&!c.focus;)(c=d?c.previous:c.next)||(b=0);c&&c.focus();
return!1;case e?37:39:case 40:b=c;do b=b.next,!b&&g&&(b=c.toolbar.items[0]);while(b&&!b.focus);b?b.focus():i(c,9);return!1;case e?39:37:case 38:b=c;do b=b.previous,!b&&g&&(b=c.toolbar.items[c.toolbar.items.length-1]);while(b&&!b.focus);b?b.focus():(d=1,i(c,CKEDITOR.SHIFT+9),d=0);return!1;case 27:return a.focus(),!1;case 13:case 32:return c.execute(),!1}return!0};a.on("uiSpace",function(c){if(c.data.space==a.config.toolbarLocation){c.removeListener();a.toolbox=new t;var d=CKEDITOR.tools.getNextId(),
b=['<span id="',d,'" class="cke_voice_label">',a.lang.toolbar.toolbars,"</span>",'<span id="'+a.ui.spaceId("toolbox")+'" class="cke_toolbox" role="group" aria-labelledby="',d,'" onmousedown="return false;">'],d=!1!==a.config.toolbarStartupExpanded,e,g;a.config.toolbarCanCollapse&&a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE&&b.push('<span class="cke_toolbox_main"'+(d?">":' style="display:none">'));for(var n=a.toolbox.toolbars,f=w(a),k=0;k<f.length;k++){var j,l=0,q,m=f[k],r;if(m)if(e&&(b.push("</span>"),
g=e=0),"/"===m)b.push('<span class="cke_toolbar_break"></span>');else{r=m.items||m;for(var s=0;s<r.length;s++){var o=r[s],u;if(o)if(o.type==CKEDITOR.UI_SEPARATOR)g=e&&o;else{u=!1!==o.canGroup;if(!l){j=CKEDITOR.tools.getNextId();l={id:j,items:[]};q=m.name&&(a.lang.toolbar.toolbarGroups[m.name]||m.name);b.push('<span id="',j,'" class="cke_toolbar"',q?' aria-labelledby="'+j+'_label"':"",' role="toolbar">');q&&b.push('<span id="',j,'_label" class="cke_voice_label">',q,"</span>");b.push('<span class="cke_toolbar_start"></span>');
var p=n.push(l)-1;0<p&&(l.previous=n[p-1],l.previous.next=l)}u?e||(b.push('<span class="cke_toolgroup" role="presentation">'),e=1):e&&(b.push("</span>"),e=0);j=function(c){c=c.render(a,b);p=l.items.push(c)-1;if(p>0){c.previous=l.items[p-1];c.previous.next=c}c.toolbar=l;c.onkey=i;c.onfocus=function(){a.toolbox.focusCommandExecuted||a.focus()}};g&&(j(g),g=0);j(o)}}e&&(b.push("</span>"),g=e=0);l&&b.push('<span class="cke_toolbar_end"></span></span>')}}a.config.toolbarCanCollapse&&b.push("</span>");if(a.config.toolbarCanCollapse&&
a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE){var v=CKEDITOR.tools.addFunction(function(){a.execCommand("toolbarCollapse")});a.on("destroy",function(){CKEDITOR.tools.removeFunction(v)});a.addCommand("toolbarCollapse",{readOnly:1,exec:function(b){var a=b.ui.space("toolbar_collapser"),c=a.getPrevious(),e=b.ui.space("contents"),d=c.getParent(),f=parseInt(e.$.style.height,10),h=d.$.offsetHeight,g=a.hasClass("cke_toolbox_collapser_min");g?(c.show(),a.removeClass("cke_toolbox_collapser_min"),a.setAttribute("title",
b.lang.toolbar.toolbarCollapse)):(c.hide(),a.addClass("cke_toolbox_collapser_min"),a.setAttribute("title",b.lang.toolbar.toolbarExpand));a.getFirst().setText(g?"▲":"◀");e.setStyle("height",f-(d.$.offsetHeight-h)+"px");b.fire("resize")},modes:{wysiwyg:1,source:1}});a.setKeystroke(CKEDITOR.ALT+(CKEDITOR.env.ie||CKEDITOR.env.webkit?189:109),"toolbarCollapse");b.push('<a title="'+(d?a.lang.toolbar.toolbarCollapse:a.lang.toolbar.toolbarExpand)+'" id="'+a.ui.spaceId("toolbar_collapser")+'" tabIndex="-1" class="cke_toolbox_collapser');
d||b.push(" cke_toolbox_collapser_min");b.push('" onclick="CKEDITOR.tools.callFunction('+v+')">','<span class="cke_arrow">&#9650;</span>',"</a>")}b.push("</span>");c.data.html+=b.join("")}});a.on("destroy",function(){if(this.toolbox){var a,d=0,b,e,g;for(a=this.toolbox.toolbars;d<a.length;d++){e=a[d].items;for(b=0;b<e.length;b++)g=e[b],g.clickFn&&CKEDITOR.tools.removeFunction(g.clickFn),g.keyDownFn&&CKEDITOR.tools.removeFunction(g.keyDownFn)}}});a.on("uiReady",function(){var c=a.ui.space("toolbox");
c&&a.focusManager.add(c,1)});a.addCommand("toolbarFocus",x);a.setKeystroke(CKEDITOR.ALT+121,"toolbarFocus");a.ui.add("-",CKEDITOR.UI_SEPARATOR,{});a.ui.addHandler(CKEDITOR.UI_SEPARATOR,{create:function(){return{render:function(a,d){d.push('<span class="cke_toolbar_separator" role="separator"></span>');return{}}}}})}});CKEDITOR.ui.prototype.addToolbarGroup=function(a,d,i){var c=n(this.editor),h=0===d,b={name:a};if(i){if(i=CKEDITOR.tools.search(c,function(a){return a.name==i})){!i.groups&&(i.groups=
[]);if(d&&(d=CKEDITOR.tools.indexOf(i.groups,d),0<=d)){i.groups.splice(d+1,0,a);return}h?i.groups.splice(0,0,a):i.groups.push(a);return}d=null}d&&(d=CKEDITOR.tools.indexOf(c,function(a){return a.name==d}));h?c.splice(0,0,a):"number"==typeof d?c.splice(d+1,0,b):c.push(a)}})();CKEDITOR.UI_SEPARATOR="separator";CKEDITOR.config.toolbarLocation="top";(function(){var h;function m(a,d){function o(b){b=a._.elementsPath.list[b];if(b.equals(a.editable())){var e=a.createRange();e.selectNodeContents(b);e.select()}else a.getSelection().selectElement(b);a.focus()}function p(){i&&i.setHtml(n);delete a._.elementsPath.list}var l=a.ui.spaceId("path"),i,q="cke_elementspath_"+CKEDITOR.tools.getNextNumber()+"_";a._.elementsPath={idBase:q,filters:[]};d.html+='<span id="'+l+'_label" class="cke_voice_label">'+a.lang.elementspath.eleLabel+'</span><span id="'+l+'" class="cke_path" role="group" aria-labelledby="'+
l+'_label">'+n+"</span>";a.on("uiReady",function(){var b=a.ui.space("path");b&&a.focusManager.add(b,1)});var m=CKEDITOR.tools.addFunction(o),r=CKEDITOR.tools.addFunction(function(b,e){var c=a._.elementsPath.idBase,f,e=new CKEDITOR.dom.event(e);f="rtl"==a.lang.dir;switch(e.getKeystroke()){case f?39:37:case 9:return(f=CKEDITOR.document.getById(c+(b+1)))||(f=CKEDITOR.document.getById(c+"0")),f.focus(),!1;case f?37:39:case CKEDITOR.SHIFT+9:return(f=CKEDITOR.document.getById(c+(b-1)))||(f=CKEDITOR.document.getById(c+
(a._.elementsPath.list.length-1))),f.focus(),!1;case 27:return a.focus(),!1;case 13:case 32:return o(b),!1}return!0});a.on("selectionChange",function(b){for(var e=a.editable(),c=b.data.selection.getStartElement(),b=[],f=a._.elementsPath.list=[],d=a._.elementsPath.filters;c;){var j=0,g;g=c.data("cke-display-name")?c.data("cke-display-name"):c.data("cke-real-element-type")?c.data("cke-real-element-type"):c.getName();for(var k=0;k<d.length;k++){var h=d[k](c,g);if(!1===h){j=1;break}g=h||g}j||(j=f.push(c)-
1,k=a.lang.elementspath.eleTitle.replace(/%1/,g),g=s.output({id:q+j,label:k,text:g,jsTitle:"javascript:void('"+g+"')",index:j,keyDownFn:r,clickFn:m}),b.unshift(g));if(c.equals(e))break;c=c.getParent()}i||(i=CKEDITOR.document.getById(l));e=i;e.setHtml(b.join("")+n);a.fire("elementsPathUpdate",{space:e})});a.on("readOnly",p);a.on("contentDomUnload",p);a.addCommand("elementsPathFocus",h);a.setKeystroke(CKEDITOR.ALT+122,"elementsPathFocus")}h={editorFocus:!1,readOnly:1,exec:function(a){(a=CKEDITOR.document.getById(a._.elementsPath.idBase+
"0"))&&a.focus(CKEDITOR.env.ie||CKEDITOR.env.air)}};var n='<span class="cke_path_empty">&nbsp;</span>',d="";if(CKEDITOR.env.opera||CKEDITOR.env.gecko&&CKEDITOR.env.mac)d+=' onkeypress="return false;"';CKEDITOR.env.gecko&&(d+=' onblur="this.style.cssText = this.style.cssText;"');var s=CKEDITOR.addTemplate("pathItem",'<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"'+(CKEDITOR.env.gecko&&10900>CKEDITOR.env.version?' onfocus="event.preventBubble();"':"")+d+' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
CKEDITOR.plugins.add("elementspath",{init:function(a){a.on("uiSpace",function(d){"bottom"==d.data.space&&m(a,d.data)})}})})();(function(){function l(e,c,b){b=e.config.forceEnterMode||b;if("wysiwyg"!=e.mode)return!1;c||(c=e.config.enterMode);e.elementPath().isContextFor("p")||(c=CKEDITOR.ENTER_BR,b=1);e.fire("saveSnapshot");c==CKEDITOR.ENTER_BR?o(e,c,null,b):p(e,c,null,b);e.fire("saveSnapshot");return!0}function q(e){for(var e=e.getSelection().getRanges(!0),c=e.length-1;0<c;c--)e[c].deleteContents();return e[0]}CKEDITOR.plugins.add("enterkey",{init:function(e){e.addCommand("enter",{modes:{wysiwyg:1},editorFocus:!1,exec:function(c){l(c)}});
e.addCommand("shiftEnter",{modes:{wysiwyg:1},editorFocus:!1,exec:function(c){"wysiwyg"==c.mode&&l(c,c.config.shiftEnterMode,1)}});e.setKeystroke([[13,"enter"],[CKEDITOR.SHIFT+13,"shiftEnter"]])}});var t=CKEDITOR.dom.walker.whitespaces(),u=CKEDITOR.dom.walker.bookmark();CKEDITOR.plugins.enterkey={enterBlock:function(e,c,b,i){if(b=b||q(e)){var f=b.document,j=b.checkStartOfBlock(),h=b.checkEndOfBlock(),a=e.elementPath(b.startContainer).block,k=c==CKEDITOR.ENTER_DIV?"div":"p",d;if(j&&h){if(a&&(a.is("li")||
a.getParent().is("li"))){b=a.getParent();d=b.getParent();var i=!a.hasPrevious(),m=!a.hasNext(),k=e.getSelection(),g=k.createBookmarks(),j=a.getDirection(1),h=a.getAttribute("class"),n=a.getAttribute("style"),l=d.getDirection(1)!=j,e=e.config.enterMode!=CKEDITOR.ENTER_BR||l||n||h;if(d.is("li"))if(i||m)a[i?"insertBefore":"insertAfter"](d);else a.breakParent(d);else{if(e)if(d=f.createElement(c==CKEDITOR.ENTER_P?"p":"div"),l&&d.setAttribute("dir",j),n&&d.setAttribute("style",n),h&&d.setAttribute("class",
h),a.moveChildren(d),i||m)d[i?"insertBefore":"insertAfter"](b);else a.breakParent(b),d.insertAfter(b);else if(a.appendBogus(),i||m)for(;f=a[i?"getFirst":"getLast"]();)f[i?"insertBefore":"insertAfter"](b);else for(a.breakParent(b);f=a.getLast();)f.insertAfter(b);a.remove()}k.selectBookmarks(g);return}if(a&&a.getParent().is("blockquote")){a.breakParent(a.getParent());a.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1))||a.getPrevious().remove();a.getNext().getFirst(CKEDITOR.dom.walker.invisible(1))||
a.getNext().remove();b.moveToElementEditStart(a);b.select();return}}else if(a&&a.is("pre")&&!h){o(e,c,b,i);return}if(h=b.splitBlock(k)){c=h.previousBlock;a=h.nextBlock;e=h.wasStartOfBlock;j=h.wasEndOfBlock;if(a)g=a.getParent(),g.is("li")&&(a.breakParent(g),a.move(a.getNext(),1));else if(c&&(g=c.getParent())&&g.is("li"))c.breakParent(g),g=c.getNext(),b.moveToElementEditStart(g),c.move(c.getPrevious());if(!e&&!j)a.is("li")&&(d=b.clone(),d.selectNodeContents(a),d=new CKEDITOR.dom.walker(d),d.evaluator=
function(a){return!(u(a)||t(a)||a.type==CKEDITOR.NODE_ELEMENT&&a.getName()in CKEDITOR.dtd.$inline&&!(a.getName()in CKEDITOR.dtd.$empty))},(g=d.next())&&(g.type==CKEDITOR.NODE_ELEMENT&&g.is("ul","ol"))&&(CKEDITOR.env.ie?f.createText(" "):f.createElement("br")).insertBefore(g)),a&&b.moveToElementEditStart(a);else{if(c){if(c.is("li")||!r.test(c.getName())&&!c.is("pre"))d=c.clone()}else a&&(d=a.clone());d?i&&!d.is("li")&&d.renameNode(k):g&&g.is("li")?d=g:(d=f.createElement(k),c&&(m=c.getDirection())&&
d.setAttribute("dir",m));if(f=h.elementPath){i=0;for(k=f.elements.length;i<k;i++){g=f.elements[i];if(g.equals(f.block)||g.equals(f.blockLimit))break;CKEDITOR.dtd.$removeEmpty[g.getName()]&&(g=g.clone(),d.moveChildren(g),d.append(g))}}CKEDITOR.env.ie||d.appendBogus();d.getParent()||b.insertNode(d);d.is("li")&&d.removeAttribute("value");if(CKEDITOR.env.ie&&e&&(!j||!c.getChildCount()))b.moveToElementEditStart(j?c:d),b.select();b.moveToElementEditStart(e&&!j?a:d)}b.select();b.scrollIntoView()}}},enterBr:function(e,
c,b,i){if(b=b||q(e)){var f=b.document,j=b.checkEndOfBlock(),h=new CKEDITOR.dom.elementPath(e.getSelection().getStartElement()),a=h.block,h=a&&h.block.getName();!i&&"li"==h?p(e,c,b,i):(!i&&j&&r.test(h)?(j=a.getDirection())?(f=f.createElement("div"),f.setAttribute("dir",j),f.insertAfter(a),b.setStart(f,0)):(f.createElement("br").insertAfter(a),CKEDITOR.env.gecko&&f.createText("").insertAfter(a),b.setStartAt(a.getNext(),CKEDITOR.env.ie?CKEDITOR.POSITION_BEFORE_START:CKEDITOR.POSITION_AFTER_START)):(a=
"pre"==h&&CKEDITOR.env.ie&&8>CKEDITOR.env.version?f.createText("\r"):f.createElement("br"),b.deleteContents(),b.insertNode(a),CKEDITOR.env.ie?b.setStartAt(a,CKEDITOR.POSITION_AFTER_END):(f.createText("﻿").insertAfter(a),j&&a.getParent().appendBogus(),a.getNext().$.nodeValue="",b.setStartAt(a.getNext(),CKEDITOR.POSITION_AFTER_START))),b.collapse(!0),b.select(),b.scrollIntoView())}}};var s=CKEDITOR.plugins.enterkey,o=s.enterBr,p=s.enterBlock,r=/^h[1-6]$/})();(function(){function j(a,b){var d={},e=[],f={nbsp:" ",shy:"­",gt:">",lt:"<",amp:"&",apos:"'",quot:'"'},a=a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g,function(a,h){var c=b?"&"+h+";":f[h];d[c]=b?f[h]:"&"+h+";";e.push(c);return""});if(!b&&a){var a=a.split(","),c=document.createElement("div"),g;c.innerHTML="&"+a.join(";&")+";";g=c.innerHTML;c=null;for(c=0;c<g.length;c++){var i=g.charAt(c);d[i]="&"+a[c]+";";e.push(i)}}d.regex=e.join(b?"|":"");return d}CKEDITOR.plugins.add("entities",{afterInit:function(a){var b=
a.config;if(a=(a=a.dataProcessor)&&a.htmlFilter){var d=[];!1!==b.basicEntities&&d.push("nbsp,gt,lt,amp");b.entities&&(d.length&&d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"),
b.entities_latin&&d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"),b.entities_greek&&d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"),
b.entities_additional&&d.push(b.entities_additional));var e=j(d.join(",")),f=e.regex?"["+e.regex+"]":"a^";delete e.regex;b.entities&&b.entities_processNumerical&&(f="[^ -~]|"+f);var f=RegExp(f,"g"),c=function(a){return b.entities_processNumerical=="force"||!e[a]?"&#"+a.charCodeAt(0)+";":e[a]},g=j("nbsp,gt,lt,amp,shy",!0),i=RegExp(g.regex,"g"),k=function(a){return g[a]};a.addRules({text:function(a){return a.replace(i,k).replace(f,c)}})}}})})();CKEDITOR.config.basicEntities=!0;
CKEDITOR.config.entities=!0;CKEDITOR.config.entities_latin=!0;CKEDITOR.config.entities_greek=!0;CKEDITOR.config.entities_additional="#39";CKEDITOR.plugins.add("popup");
CKEDITOR.tools.extend(CKEDITOR.editor.prototype,{popup:function(e,a,b,d){a=a||"80%";b=b||"70%";"string"==typeof a&&(1<a.length&&"%"==a.substr(a.length-1,1))&&(a=parseInt(window.screen.width*parseInt(a,10)/100,10));"string"==typeof b&&(1<b.length&&"%"==b.substr(b.length-1,1))&&(b=parseInt(window.screen.height*parseInt(b,10)/100,10));640>a&&(a=640);420>b&&(b=420);var f=parseInt((window.screen.height-b)/2,10),g=parseInt((window.screen.width-a)/2,10),d=(d||"location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes")+",width="+
a+",height="+b+",top="+f+",left="+g,c=window.open("",null,d,!0);if(!c)return!1;try{-1==navigator.userAgent.toLowerCase().indexOf(" chrome/")&&(c.moveTo(g,f),c.resizeTo(a,b)),c.focus(),c.location.href=e}catch(h){window.open(e,null,d,!0)}return!0}});(function(){function g(a,c){var d=[];if(c)for(var b in c)d.push(b+"="+encodeURIComponent(c[b]));else return a;return a+(-1!=a.indexOf("?")?"&":"?")+d.join("&")}function i(a){a+="";return a.charAt(0).toUpperCase()+a.substr(1)}function k(){var a=this.getDialog(),c=a.getParentEditor();c._.filebrowserSe=this;var d=c.config["filebrowser"+i(a.getName())+"WindowWidth"]||c.config.filebrowserWindowWidth||"80%",a=c.config["filebrowser"+i(a.getName())+"WindowHeight"]||c.config.filebrowserWindowHeight||"70%",
b=this.filebrowser.params||{};b.CKEditor=c.name;b.CKEditorFuncNum=c._.filebrowserFn;b.langCode||(b.langCode=c.langCode);b=g(this.filebrowser.url,b);c.popup(b,d,a,c.config.filebrowserWindowFeatures||c.config.fileBrowserWindowFeatures)}function l(){var a=this.getDialog();a.getParentEditor()._.filebrowserSe=this;return!a.getContentElement(this["for"][0],this["for"][1]).getInputElement().$.value||!a.getContentElement(this["for"][0],this["for"][1]).getAction()?!1:!0}function m(a,c,d){var b=d.params||{};
b.CKEditor=a.name;b.CKEditorFuncNum=a._.filebrowserFn;b.langCode||(b.langCode=a.langCode);c.action=g(d.url,b);c.filebrowser=d}function j(a,c,d,b){if(b&&b.length)for(var e,g=b.length;g--;)if(e=b[g],("hbox"==e.type||"vbox"==e.type||"fieldset"==e.type)&&j(a,c,d,e.children),e.filebrowser)if("string"==typeof e.filebrowser&&(e.filebrowser={action:"fileButton"==e.type?"QuickUpload":"Browse",target:e.filebrowser}),"Browse"==e.filebrowser.action){var f=e.filebrowser.url;void 0===f&&(f=a.config["filebrowser"+
i(c)+"BrowseUrl"],void 0===f&&(f=a.config.filebrowserBrowseUrl));f&&(e.onClick=k,e.filebrowser.url=f,e.hidden=!1)}else if("QuickUpload"==e.filebrowser.action&&e["for"]&&(f=e.filebrowser.url,void 0===f&&(f=a.config["filebrowser"+i(c)+"UploadUrl"],void 0===f&&(f=a.config.filebrowserUploadUrl)),f)){var h=e.onClick;e.onClick=function(a){var b=a.sender;return h&&h.call(b,a)===false?false:l.call(b,a)};e.filebrowser.url=f;e.hidden=!1;m(a,d.getContents(e["for"][0]).get(e["for"][1]),e.filebrowser)}}function h(a,
c,d){if(-1!==d.indexOf(";")){for(var d=d.split(";"),b=0;b<d.length;b++)if(h(a,c,d[b]))return!0;return!1}return(a=a.getContents(c).get(d).filebrowser)&&a.url}function n(a,c){var d=this._.filebrowserSe.getDialog(),b=this._.filebrowserSe["for"],e=this._.filebrowserSe.filebrowser.onSelect;b&&d.getContentElement(b[0],b[1]).reset();if(!("function"==typeof c&&!1===c.call(this._.filebrowserSe))&&!(e&&!1===e.call(this._.filebrowserSe,a,c))&&("string"==typeof c&&c&&alert(c),a&&(b=this._.filebrowserSe,d=b.getDialog(),
b=b.filebrowser.target||null)))if(b=b.split(":"),e=d.getContentElement(b[0],b[1]))e.setValue(a),d.selectPage(b[0])}CKEDITOR.plugins.add("filebrowser",{requires:"popup",init:function(a){a._.filebrowserFn=CKEDITOR.tools.addFunction(n,a);a.on("destroy",function(){CKEDITOR.tools.removeFunction(this._.filebrowserFn)})}});CKEDITOR.on("dialogDefinition",function(a){for(var c=a.data.definition,d,b=0;b<c.contents.length;++b)if(d=c.contents[b])j(a.editor,a.data.name,c,d.elements),d.hidden&&d.filebrowser&&(d.hidden=
!h(c,d.id,d.filebrowser))})})();CKEDITOR.plugins.add("find",{requires:"dialog",init:function(a){var b=a.addCommand("find",new CKEDITOR.dialogCommand("find"));b.canUndo=!1;b.readOnly=1;a.addCommand("replace",new CKEDITOR.dialogCommand("replace")).canUndo=!1;a.ui.addButton&&(a.ui.addButton("Find",{label:a.lang.find.find,command:"find",toolbar:"find,10"}),a.ui.addButton("Replace",{label:a.lang.find.replace,command:"replace",toolbar:"find,20"}));CKEDITOR.dialog.add("find",this.path+"dialogs/find.js");CKEDITOR.dialog.add("replace",this.path+
"dialogs/find.js")}});CKEDITOR.config.find_highlight={element:"span",styles:{"background-color":"#004",color:"#fff"}};(function(){function g(a,b){var c=j.exec(a),d=j.exec(b);if(c){if(!c[2]&&"px"==d[2])return d[1];if("px"==c[2]&&!d[2])return d[1]+"px"}return b}var i=CKEDITOR.htmlParser.cssStyle,h=CKEDITOR.tools.cssLength,j=/^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,l={elements:{$:function(a){var b=a.attributes;if((b=(b=(b=b&&b["data-cke-realelement"])&&new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b)))&&b.children[0])&&a.attributes["data-cke-resizable"]){var c=(new i(a)).rules,a=b.attributes,d=c.width,c=
c.height;d&&(a.width=g(a.width,d));c&&(a.height=g(a.height,c))}return b}}},k=CKEDITOR.plugins.add("fakeobjects",{afterInit:function(a){(a=(a=a.dataProcessor)&&a.htmlFilter)&&a.addRules(l)}});CKEDITOR.editor.prototype.createFakeElement=function(a,b,c,d){var e=this.lang.fakeobjects,e=e[c]||e.unknown,b={"class":b,"data-cke-realelement":encodeURIComponent(a.getOuterHtml()),"data-cke-real-node-type":a.type,alt:e,title:e,align:a.getAttribute("align")||""};CKEDITOR.env.hc||(b.src=CKEDITOR.getUrl(k.path+
"images/spacer.gif"));c&&(b["data-cke-real-element-type"]=c);d&&(b["data-cke-resizable"]=d,c=new i,d=a.getAttribute("width"),a=a.getAttribute("height"),d&&(c.rules.width=h(d)),a&&(c.rules.height=h(a)),c.populate(b));return this.document.createElement("img",{attributes:b})};CKEDITOR.editor.prototype.createFakeParserElement=function(a,b,c,d){var e=this.lang.fakeobjects,e=e[c]||e.unknown,f;f=new CKEDITOR.htmlParser.basicWriter;a.writeHtml(f);f=f.getHtml();b={"class":b,"data-cke-realelement":encodeURIComponent(f),
"data-cke-real-node-type":a.type,alt:e,title:e,align:a.attributes.align||""};CKEDITOR.env.hc||(b.src=CKEDITOR.getUrl(k.path+"images/spacer.gif"));c&&(b["data-cke-real-element-type"]=c);d&&(b["data-cke-resizable"]=d,d=a.attributes,a=new i,c=d.width,d=d.height,void 0!=c&&(a.rules.width=h(c)),void 0!=d&&(a.rules.height=h(d)),a.populate(b));return new CKEDITOR.htmlParser.element("img",b)};CKEDITOR.editor.prototype.restoreRealElement=function(a){if(a.data("cke-real-node-type")!=CKEDITOR.NODE_ELEMENT)return null;
var b=CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")),this.document);if(a.data("cke-resizable")){var c=a.getStyle("width"),a=a.getStyle("height");c&&b.setAttribute("width",g(b.getAttribute("width"),c));a&&b.setAttribute("height",g(b.getAttribute("height"),a))}return b}})();(function(){function d(a){a=a.attributes;return"application/x-shockwave-flash"==a.type||f.test(a.src||"")}function e(a,b){return a.createFakeParserElement(b,"cke_flash","flash",!0)}var f=/\.swf(?:$|\?)/i;CKEDITOR.plugins.add("flash",{requires:"dialog,fakeobjects",onLoad:function(){CKEDITOR.addCss("img.cke_flash{background-image: url("+CKEDITOR.getUrl(this.path+"images/placeholder.png")+");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")},
init:function(a){var b="object[classid,codebase,height,hspace,vspace,width];param[name,value];embed[height,hspace,pluginspage,src,type,vspace,width]";CKEDITOR.dialog.isTabEnabled(a,"flash","properties")&&(b+=";object[align]; embed[allowscriptaccess,quality,scale,wmode]");CKEDITOR.dialog.isTabEnabled(a,"flash","advanced")&&(b+=";object[id]{*}; embed[bgcolor]{*}(*)");a.addCommand("flash",new CKEDITOR.dialogCommand("flash",{allowedContent:b,requiredContent:"embed"}));a.ui.addButton&&a.ui.addButton("Flash",
{label:a.lang.common.flash,command:"flash",toolbar:"insert,20"});CKEDITOR.dialog.add("flash",this.path+"dialogs/flash.js");a.addMenuItems&&a.addMenuItems({flash:{label:a.lang.flash.properties,command:"flash",group:"flash"}});a.on("doubleclick",function(a){var b=a.data.element;b.is("img")&&"flash"==b.data("cke-real-element-type")&&(a.data.dialog="flash")});a.contextMenu&&a.contextMenu.addListener(function(a){if(a&&a.is("img")&&!a.isReadOnly()&&"flash"==a.data("cke-real-element-type"))return{flash:CKEDITOR.TRISTATE_OFF}})},
afterInit:function(a){var b=a.dataProcessor;(b=b&&b.dataFilter)&&b.addRules({elements:{"cke:object":function(b){var c=b.attributes;if((!c.classid||!(""+c.classid).toLowerCase())&&!d(b)){for(c=0;c<b.children.length;c++)if("cke:embed"==b.children[c].name){if(!d(b.children[c]))break;return e(a,b)}return null}return e(a,b)},"cke:embed":function(b){return!d(b)?null:e(a,b)}}},5)}})})();CKEDITOR.tools.extend(CKEDITOR.config,{flashEmbedTagOnly:!1,flashAddEmbedTag:!0,flashConvertOnEdit:!1});(function(){function t(a){var e="left"==a?"pageXOffset":"pageYOffset";return e in g.$?g.$[e]:CKEDITOR.document.$.documentElement["left"==a?"scrollLeft":"scrollTop"]}function p(a){var e,f=a.config,p=f.floatSpaceDockedOffsetX||0,o=f.floatSpaceDockedOffsetY||0,u=f.floatSpacePinnedOffsetX||0,q=f.floatSpacePinnedOffsetY||0,i=function(c){function f(a,c,b){d.setStyle(c,s(b));d.setStyle("position",a)}function j(a){var c=r.getDocumentPosition();switch(a){case "top":f("absolute","top",c.y-l-o);break;case "pin":f("fixed",
"top",q);break;case "bottom":f("absolute","top",c.y+(b.height||b.bottom-b.top)+o)}e=a}var r=a.editable();if(r){"focus"==c.name&&d.show();d.removeStyle("left");d.removeStyle("right");var k=d.getClientRect(),b=r.getClientRect(),l=k.height,n=t("left");if(e){"top"==e&&k.top<q?j("pin"):"pin"==e?b.top>o+l?j("top"):b.bottom-k.bottom<l&&j("bottom"):"bottom"==e&&(b.top>o+l?j("top"):b.bottom>2*l+q&&j("pin"));var c=g.getViewPaneSize(),h=c.width/2,h=0<b.left&&b.right<c.width&&b.width>k.width?"rtl"==a.config.contentsLangDirection?
"right":"left":h-b.left>b.right-h?"left":"right",m;k.width>c.width?(h="left",m=0):(m="left"==h?0<b.left?b.left:0:b.right<c.width?c.width-b.right:0,m+k.width>c.width&&(h="left"==h?"right":"left",m=0));d.setStyle(h,s(("pin"==e?u:p)+m+("pin"==e?0:"left"==h?n:-n)))}else e="pin",j("pin"),i(c)}},f=CKEDITOR.document.getBody(),v={id:a.id,name:a.name,langDir:a.lang.dir,langCode:a.langCode},n=a.fire("uiSpace",{space:"top",html:""}).html;if(n){var d=f.append(CKEDITOR.dom.element.createFromHtml(w.output(CKEDITOR.tools.extend({topId:a.ui.spaceId("top"),
content:n,style:"display:none;z-index:"+(a.config.baseFloatZIndex-1)},v))));d.unselectable();d.on("mousedown",function(a){a=a.data;a.getTarget().hasAscendant("a",1)||a.preventDefault()});a.on("focus",function(a){i(a);g.on("scroll",i);g.on("resize",i)});a.on("blur",function(){d.hide();g.removeListener("scroll",i);g.removeListener("resize",i)});a.on("destroy",function(){g.removeListener("scroll",i);g.removeListener("resize",i);d.clearCustomData();d.remove()});a.focusManager.hasFocus&&d.show();a.focusManager.add(d,
1)}}var w=CKEDITOR.addTemplate("floatcontainer",'<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} '+CKEDITOR.env.cssClass+'" dir="{langDir}" title="'+(CKEDITOR.env.gecko?" ":"")+'" lang="{langCode}" role="application" style="{style}"><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>');CKEDITOR.plugins.add("floatingspace",{init:function(a){a.on("loaded",function(){p(a)},null,null,20)}});var g=
CKEDITOR.document.getWindow(),s=CKEDITOR.tools.cssLength})();CKEDITOR.plugins.add("listblock",{requires:"panel",onLoad:function(){var e=CKEDITOR.addTemplate("panel-list",'<ul role="presentation" class="cke_panel_list">{items}</ul>'),f=CKEDITOR.addTemplate("panel-list-item",'<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),g=CKEDITOR.addTemplate("panel-list-group",
'<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>');CKEDITOR.ui.panel.prototype.addListBlock=function(a,b){return this.addBlock(a,new CKEDITOR.ui.listBlock(this.getHolderElement(),b))};CKEDITOR.ui.listBlock=CKEDITOR.tools.createClass({base:CKEDITOR.ui.panel.block,$:function(a,b){var b=b||{},c=b.attributes||(b.attributes={});(this.multiSelect=!!b.multiSelect)&&(c["aria-multiselectable"]=!0);!c.role&&(c.role="listbox");this.base.apply(this,arguments);this.element.setAttribute("role",
c.role);c=this.keys;c[40]="next";c[9]="next";c[38]="prev";c[CKEDITOR.SHIFT+9]="prev";c[32]=CKEDITOR.env.ie?"mouseup":"click";CKEDITOR.env.ie&&(c[13]="mouseup");this._.pendingHtml=[];this._.pendingList=[];this._.items={};this._.groups={}},_:{close:function(){if(this._.started){var a=e.output({items:this._.pendingList.join("")});this._.pendingList=[];this._.pendingHtml.push(a);delete this._.started}},getClick:function(){this._.click||(this._.click=CKEDITOR.tools.addFunction(function(a){var b=this.toggle(a);
if(this.onClick)this.onClick(a,b)},this));return this._.click}},proto:{add:function(a,b,c){var d=CKEDITOR.tools.getNextId();this._.started||(this._.started=1,this._.size=this._.size||0);this._.items[a]=d;a={id:d,val:a,onclick:CKEDITOR.env.ie?'onclick="return false;" onmouseup':"onclick",clickFn:this._.getClick(),title:c||a,text:b||a};this._.pendingList.push(f.output(a))},startGroup:function(a){this._.close();var b=CKEDITOR.tools.getNextId();this._.groups[a]=b;this._.pendingHtml.push(g.output({id:b,
label:a}))},commit:function(){this._.close();this.element.appendHtml(this._.pendingHtml.join(""));delete this._.size;this._.pendingHtml=[]},toggle:function(a){var b=this.isMarked(a);b?this.unmark(a):this.mark(a);return!b},hideGroup:function(a){var b=(a=this.element.getDocument().getById(this._.groups[a]))&&a.getNext();a&&(a.setStyle("display","none"),b&&"ul"==b.getName()&&b.setStyle("display","none"))},hideItem:function(a){this.element.getDocument().getById(this._.items[a]).setStyle("display","none")},
showAll:function(){var a=this._.items,b=this._.groups,c=this.element.getDocument(),d;for(d in a)c.getById(a[d]).setStyle("display","");for(var e in b)a=c.getById(b[e]),d=a.getNext(),a.setStyle("display",""),d&&"ul"==d.getName()&&d.setStyle("display","")},mark:function(a){this.multiSelect||this.unmarkAll();var a=this._.items[a],b=this.element.getDocument().getById(a);b.addClass("cke_selected");this.element.getDocument().getById(a+"_option").setAttribute("aria-selected",!0);this.onMark&&this.onMark(b)},
unmark:function(a){var b=this.element.getDocument(),a=this._.items[a],c=b.getById(a);c.removeClass("cke_selected");b.getById(a+"_option").removeAttribute("aria-selected");this.onUnmark&&this.onUnmark(c)},unmarkAll:function(){var a=this._.items,b=this.element.getDocument(),c;for(c in a){var d=a[c];b.getById(d).removeClass("cke_selected");b.getById(d+"_option").removeAttribute("aria-selected")}this.onUnmark&&this.onUnmark()},isMarked:function(a){return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")},
focus:function(a){this._.focusIndex=-1;var b=this.element.getElementsByTag("a"),c,d=-1;if(a)for(c=this.element.getDocument().getById(this._.items[a]).getFirst();a=b.getItem(++d);){if(a.equals(c)){this._.focusIndex=d;break}}else this.element.focus();c&&setTimeout(function(){c.focus()},0)}}})}});CKEDITOR.plugins.add("richcombo",{requires:"floatpanel,listblock,button",beforeInit:function(c){c.ui.addHandler(CKEDITOR.UI_RICHCOMBO,CKEDITOR.ui.richCombo.handler)}});
(function(){var c='<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" hidefocus=true title="{title}" tabindex="-1"'+(CKEDITOR.env.gecko&&10900<=CKEDITOR.env.version&&!CKEDITOR.env.hc?"":'" href="javascript:void(\'{titleJs}\')"')+' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';if(CKEDITOR.env.opera||CKEDITOR.env.gecko&&CKEDITOR.env.mac)c+=' onkeypress="return false;"';
CKEDITOR.env.gecko&&(c+=' onblur="this.style.cssText = this.style.cssText;"');var c=c+(' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);"  onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" '+(CKEDITOR.env.ie?'onclick="return false;" onmouseup':"onclick")+'="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">'+
(CKEDITOR.env.hc?"&#9660;":CKEDITOR.env.air?"&nbsp;":"")+"</span></span></a></span>"),h=CKEDITOR.addTemplate("combo",c);CKEDITOR.UI_RICHCOMBO="richcombo";CKEDITOR.ui.richCombo=CKEDITOR.tools.createClass({$:function(a){CKEDITOR.tools.extend(this,a,{canGroup:!1,title:a.label,modes:{wysiwyg:1},editorFocus:1});a=this.panel||{};delete this.panel;this.id=CKEDITOR.tools.getNextNumber();this.document=a.parent&&a.parent.getDocument()||CKEDITOR.document;a.className="cke_combopanel";a.block={multiSelect:a.multiSelect,
attributes:a.attributes};a.toolbarRelated=!0;this._={panelDefinition:a,items:{}}},proto:{renderHtml:function(a){var b=[];this.render(a,b);return b.join("")},render:function(a,b){function j(){var d=this.modes[a.mode]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED;this.setState(a.readOnly&&!this.readOnly?CKEDITOR.TRISTATE_DISABLED:d);this.setValue("")}var c=CKEDITOR.env,g="cke_"+this.id,e=CKEDITOR.tools.addFunction(function(b){i&&(a.unlockSelection(1),i=0);d.execute(b)},this),f=this,d={id:g,combo:this,
focus:function(){CKEDITOR.document.getById(g).getChild(1).focus()},execute:function(d){var b=f._;if(b.state!=CKEDITOR.TRISTATE_DISABLED)if(f.createPanel(a),b.on)b.panel.hide();else{f.commit();var c=f.getValue();c?b.list.mark(c):b.list.unmarkAll();b.panel.showBlock(f.id,new CKEDITOR.dom.element(d),4)}},clickFn:e};a.on("mode",j,this);!this.readOnly&&a.on("readOnly",j,this);var k=CKEDITOR.tools.addFunction(function(a,b){var a=new CKEDITOR.dom.event(a),c=a.getKeystroke();switch(c){case 13:case 32:case 40:CKEDITOR.tools.callFunction(e,
b);break;default:d.onkey(d,c)}a.preventDefault()}),l=CKEDITOR.tools.addFunction(function(){d.onfocus&&d.onfocus()}),i=0,m=CKEDITOR.tools.addFunction(function(){if(CKEDITOR.env.opera){var b=a.editable();b.isInline()&&b.hasFocus&&(a.lockSelection(),i=1)}});d.keyDownFn=k;c={id:g,name:this.name||this.command,label:this.label,title:this.title,cls:this.className||"",titleJs:c.gecko&&10900<=c.version&&!c.hc?"":(this.title||"").replace("'",""),keydownFn:k,mousedownFn:m,focusFn:l,clickFn:e};h.output(c,b);
if(this.onRender)this.onRender();return d},createPanel:function(a){if(!this._.panel){var b=this._.panelDefinition,c=this._.panelDefinition.block,h=b.parent||CKEDITOR.document.getBody(),g="cke_combopanel__"+this.name,e=new CKEDITOR.ui.floatPanel(a,h,b),f=e.addListBlock(this.id,c),d=this;e.onShow=function(){this.element.addClass(g);d.setState(CKEDITOR.TRISTATE_ON);d._.on=1;d.editorFocus&&a.focus();if(d.onOpen)d.onOpen();f.focus(!f.multiSelect&&d.getValue())};e.onHide=function(b){this.element.removeClass(g);
d.setState(d.modes&&d.modes[a.mode]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED);d._.on=0;if(!b&&d.onClose)d.onClose()};e.onEscape=function(){e.hide(1)};f.onClick=function(a,b){d.onClick&&d.onClick.call(d,a,b);e.hide()};this._.panel=e;this._.list=f;e.getBlock(this.id).onHide=function(){d._.on=0;d.setState(CKEDITOR.TRISTATE_OFF)};this.init&&this.init()}},setValue:function(a,b){this._.value=a;var c=this.document.getById("cke_"+this.id+"_text");c&&(!a&&!b?(b=this.label,c.addClass("cke_combo_inlinelabel")):
c.removeClass("cke_combo_inlinelabel"),c.setText("undefined"!=typeof b?b:a))},getValue:function(){return this._.value||""},unmarkAll:function(){this._.list.unmarkAll()},mark:function(a){this._.list.mark(a)},hideItem:function(a){this._.list.hideItem(a)},hideGroup:function(a){this._.list.hideGroup(a)},showAll:function(){this._.list.showAll()},add:function(a,b,c){this._.items[a]=c||a;this._.list.add(a,b,c)},startGroup:function(a){this._.list.startGroup(a)},commit:function(){this._.committed||(this._.list.commit(),
this._.committed=1,CKEDITOR.ui.fire("ready",this));this._.committed=1},setState:function(a){if(this._.state!=a){var b=this.document.getById("cke_"+this.id);b.setState(a,"cke_combo");a==CKEDITOR.TRISTATE_DISABLED?b.setAttribute("aria-disabled",!0):b.removeAttribute("aria-disabled");this._.state=a}},enable:function(){this._.state==CKEDITOR.TRISTATE_DISABLED&&this.setState(this._.lastState)},disable:function(){this._.state!=CKEDITOR.TRISTATE_DISABLED&&(this._.lastState=this._.state,this.setState(CKEDITOR.TRISTATE_DISABLED))}},
statics:{handler:{create:function(a){return new CKEDITOR.ui.richCombo(a)}}}});CKEDITOR.ui.prototype.addRichCombo=function(a,b){this.add(a,CKEDITOR.UI_RICHCOMBO,b)}})();(function(){function g(a,b,g,h,j,n,k,o){for(var p=a.config,l=new CKEDITOR.style(k),c=j.split(";"),j=[],f={},d=0;d<c.length;d++){var e=c[d];if(e){var e=e.split("/"),m={},i=c[d]=e[0];m[g]=j[d]=e[1]||i;f[i]=new CKEDITOR.style(k,m);f[i]._.definition.name=i}else c.splice(d--,1)}a.ui.addRichCombo(b,{label:h.label,title:h.panelTitle,toolbar:"styles,"+o,allowedContent:l,requiredContent:l,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(p.contentsCss),multiSelect:!1,attributes:{"aria-label":h.panelTitle}},
init:function(){this.startGroup(h.panelTitle);for(var a=0;a<c.length;a++){var b=c[a];this.add(b,f[b].buildPreview(),b)}},onClick:function(b){a.focus();a.fire("saveSnapshot");var c=f[b];a[this.getValue()==b?"removeStyle":"applyStyle"](c);a.fire("saveSnapshot")},onRender:function(){a.on("selectionChange",function(a){for(var b=this.getValue(),a=a.data.path.elements,c=0,d;c<a.length;c++){d=a[c];for(var e in f)if(f[e].checkElementMatch(d,!0)){e!=b&&this.setValue(e);return}}this.setValue("",n)},this)}})}
CKEDITOR.plugins.add("font",{requires:"richcombo",init:function(a){var b=a.config;g(a,"Font","family",a.lang.font,b.font_names,b.font_defaultLabel,b.font_style,30);g(a,"FontSize","size",a.lang.font.fontSize,b.fontSize_sizes,b.fontSize_defaultLabel,b.fontSize_style,40)}})})();CKEDITOR.config.font_names="Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif";
CKEDITOR.config.font_defaultLabel="";CKEDITOR.config.font_style={element:"span",styles:{"font-family":"#(family)"},overrides:[{element:"font",attributes:{face:null}}]};CKEDITOR.config.fontSize_sizes="8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px";CKEDITOR.config.fontSize_defaultLabel="";CKEDITOR.config.fontSize_style={element:"span",styles:{"font-size":"#(size)"},overrides:[{element:"font",attributes:{size:null}}]};CKEDITOR.plugins.add("forms",{requires:"dialog,fakeobjects",onLoad:function(){CKEDITOR.addCss(".cke_editable form{border: 1px dotted #FF0000;padding: 2px;}\n");CKEDITOR.addCss("img.cke_hidden{background-image: url("+CKEDITOR.getUrl(this.path+"images/hiddenfield.gif")+");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 16px !important;height: 16px !important;}")},init:function(b){var a=b.lang,e=0,h={email:1,password:1,search:1,tel:1,text:1,url:1},j={checkbox:"input[type,name,checked]",
radio:"input[type,name,checked]",textfield:"input[type,name,value,size,maxlength]",textarea:"textarea[cols,rows,name]",select:"select[name,size,multiple]; option[value,selected]",button:"input[type,name,value]",form:"form[action,name,id,enctype,target,method]",hiddenfield:"input[type,name,value]",imagebutton:"input[type,alt,src]{width,height,border,border-width,border-style,margin,float}"},k={checkbox:"input",radio:"input",textfield:"input",textarea:"textarea",select:"select",button:"input",form:"form",
hiddenfield:"input",imagebutton:"input"},d=function(g,c,h){var d={allowedContent:j[c],requiredContent:k[c]};"form"==c&&(d.context="form");b.addCommand(c,new CKEDITOR.dialogCommand(c,d));b.ui.addButton&&b.ui.addButton(g,{label:a.common[g.charAt(0).toLowerCase()+g.slice(1)],command:c,toolbar:"forms,"+(e+=10)});CKEDITOR.dialog.add(c,h)},f=this.path+"dialogs/";!b.blockless&&d("Form","form",f+"form.js");d("Checkbox","checkbox",f+"checkbox.js");d("Radio","radio",f+"radio.js");d("TextField","textfield",
f+"textfield.js");d("Textarea","textarea",f+"textarea.js");d("Select","select",f+"select.js");d("Button","button",f+"button.js");var i=CKEDITOR.plugins.get("image");i&&d("ImageButton","imagebutton",CKEDITOR.plugins.getPath("image")+"dialogs/image.js");d("HiddenField","hiddenfield",f+"hiddenfield.js");b.addMenuItems&&(d={checkbox:{label:a.forms.checkboxAndRadio.checkboxTitle,command:"checkbox",group:"checkbox"},radio:{label:a.forms.checkboxAndRadio.radioTitle,command:"radio",group:"radio"},textfield:{label:a.forms.textfield.title,
command:"textfield",group:"textfield"},hiddenfield:{label:a.forms.hidden.title,command:"hiddenfield",group:"hiddenfield"},imagebutton:{label:a.image.titleButton,command:"imagebutton",group:"imagebutton"},button:{label:a.forms.button.title,command:"button",group:"button"},select:{label:a.forms.select.title,command:"select",group:"select"},textarea:{label:a.forms.textarea.title,command:"textarea",group:"textarea"}},!b.blockless&&(d.form={label:a.forms.form.menu,command:"form",group:"form"}),b.addMenuItems(d));
b.contextMenu&&(!b.blockless&&b.contextMenu.addListener(function(g,c,a){if((g=a.contains("form",1))&&!g.isReadOnly())return{form:CKEDITOR.TRISTATE_OFF}}),b.contextMenu.addListener(function(a){if(a&&!a.isReadOnly()){var c=a.getName();if(c=="select")return{select:CKEDITOR.TRISTATE_OFF};if(c=="textarea")return{textarea:CKEDITOR.TRISTATE_OFF};if(c=="input"){var b=a.getAttribute("type")||"text";switch(b){case "button":case "submit":case "reset":return{button:CKEDITOR.TRISTATE_OFF};case "checkbox":return{checkbox:CKEDITOR.TRISTATE_OFF};
case "radio":return{radio:CKEDITOR.TRISTATE_OFF};case "image":return i?{imagebutton:CKEDITOR.TRISTATE_OFF}:null}if(h[b])return{textfield:CKEDITOR.TRISTATE_OFF}}if(c=="img"&&a.data("cke-real-element-type")=="hiddenfield")return{hiddenfield:CKEDITOR.TRISTATE_OFF}}}));b.on("doubleclick",function(a){var c=a.data.element;if(!b.blockless&&c.is("form"))a.data.dialog="form";else if(c.is("select"))a.data.dialog="select";else if(c.is("textarea"))a.data.dialog="textarea";else if(c.is("img")&&c.data("cke-real-element-type")==
"hiddenfield")a.data.dialog="hiddenfield";else if(c.is("input")){c=c.getAttribute("type")||"text";switch(c){case "button":case "submit":case "reset":a.data.dialog="button";break;case "checkbox":a.data.dialog="checkbox";break;case "radio":a.data.dialog="radio";break;case "image":a.data.dialog="imagebutton"}if(h[c])a.data.dialog="textfield"}})},afterInit:function(b){var a=b.dataProcessor,e=a&&a.htmlFilter,a=a&&a.dataFilter;CKEDITOR.env.ie&&e&&e.addRules({elements:{input:function(a){var a=a.attributes,
b=a.type;b||(a.type="text");("checkbox"==b||"radio"==b)&&"on"==a.value&&delete a.value}}});a&&a.addRules({elements:{input:function(a){if("hidden"==a.attributes.type)return b.createFakeParserElement(a,"cke_hidden","hiddenfield")}}})}});
CKEDITOR.env.ie&&(CKEDITOR.dom.element.prototype.hasAttribute=CKEDITOR.tools.override(CKEDITOR.dom.element.prototype.hasAttribute,function(b){return function(a){this.$.attributes.getNamedItem(a);if("input"==this.getName())switch(a){case "class":return 0<this.$.className.length;case "checked":return!!this.$.checked;case "value":var e=this.getAttribute("type");return"checkbox"==e||"radio"==e?"on"!=this.$.value:this.$.value}return b.apply(this,arguments)}}));CKEDITOR.plugins.add("format",{requires:"richcombo",init:function(a){if(!a.blockless){for(var g=a.config,c=a.lang.format,k=g.format_tags.split(";"),d={},l=0,m=[],h=0;h<k.length;h++){var i=k[h],j=new CKEDITOR.style(g["format_"+i]);if(!a.filter.customConfig||a.filter.check(j))l++,d[i]=j,d[i]._.enterMode=a.config.enterMode,m.push(j)}0!==l&&a.ui.addRichCombo("Format",{label:c.label,title:c.panelTitle,toolbar:"styles,20",allowedContent:m,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(g.contentsCss),
multiSelect:!1,attributes:{"aria-label":c.panelTitle}},init:function(){this.startGroup(c.panelTitle);for(var a in d){var e=c["tag_"+a];this.add(a,d[a].buildPreview(e),e)}},onClick:function(b){a.focus();a.fire("saveSnapshot");var b=d[b],e=a.elementPath();a[b.checkActive(e)?"removeStyle":"applyStyle"](b);setTimeout(function(){a.fire("saveSnapshot")},0)},onRender:function(){a.on("selectionChange",function(b){var e=this.getValue(),b=b.data.path,c=!a.readOnly&&b.isContextFor("p");this[c?"enable":"disable"]();
if(c){for(var f in d)if(d[f].checkActive(b)){f!=e&&this.setValue(f,a.lang.format["tag_"+f]);return}this.setValue("")}},this)}})}}});CKEDITOR.config.format_tags="p;h1;h2;h3;h4;h5;h6;pre;address;div";CKEDITOR.config.format_p={element:"p"};CKEDITOR.config.format_div={element:"div"};CKEDITOR.config.format_pre={element:"pre"};CKEDITOR.config.format_address={element:"address"};CKEDITOR.config.format_h1={element:"h1"};CKEDITOR.config.format_h2={element:"h2"};CKEDITOR.config.format_h3={element:"h3"};
CKEDITOR.config.format_h4={element:"h4"};CKEDITOR.config.format_h5={element:"h5"};CKEDITOR.config.format_h6={element:"h6"};CKEDITOR.plugins.add("htmlwriter",{init:function(b){var a=new CKEDITOR.htmlWriter;a.forceSimpleAmpersand=b.config.forceSimpleAmpersand;a.indentationChars=b.config.dataIndentationChars||"\t";b.dataProcessor.writer=a}});
CKEDITOR.htmlWriter=CKEDITOR.tools.createClass({base:CKEDITOR.htmlParser.basicWriter,$:function(){this.base();this.indentationChars="\t";this.selfClosingEnd=" />";this.lineBreakChars="\n";this.sortAttributes=1;this._.indent=0;this._.indentation="";this._.inPre=0;this._.rules={};var b=CKEDITOR.dtd,a;for(a in CKEDITOR.tools.extend({},b.$nonBodyContent,b.$block,b.$listItem,b.$tableContent))this.setRules(a,{indent:!b[a]["#"],breakBeforeOpen:1,breakBeforeClose:!b[a]["#"],breakAfterClose:1,needsSpace:a in
b.$block&&!(a in{li:1,dt:1,dd:1})});this.setRules("br",{breakAfterOpen:1});this.setRules("title",{indent:0,breakAfterOpen:0});this.setRules("style",{indent:0,breakBeforeClose:1});this.setRules("pre",{breakAfterOpen:1,indent:0})},proto:{openTag:function(b){var a=this._.rules[b];this._.afterCloser&&(a&&a.needsSpace&&this._.needsSpace)&&this._.output.push("\n");this._.indent?this.indentation():a&&a.breakBeforeOpen&&(this.lineBreak(),this.indentation());this._.output.push("<",b);this._.afterCloser=0},
openTagClose:function(b,a){var c=this._.rules[b];a?(this._.output.push(this.selfClosingEnd),c&&c.breakAfterClose&&(this._.needsSpace=c.needsSpace)):(this._.output.push(">"),c&&c.indent&&(this._.indentation+=this.indentationChars));c&&c.breakAfterOpen&&this.lineBreak();"pre"==b&&(this._.inPre=1)},attribute:function(b,a){"string"==typeof a&&(this.forceSimpleAmpersand&&(a=a.replace(/&amp;/g,"&")),a=CKEDITOR.tools.htmlEncodeAttr(a));this._.output.push(" ",b,'="',a,'"')},closeTag:function(b){var a=this._.rules[b];
a&&a.indent&&(this._.indentation=this._.indentation.substr(this.indentationChars.length));this._.indent?this.indentation():a&&a.breakBeforeClose&&(this.lineBreak(),this.indentation());this._.output.push("</",b,">");"pre"==b&&(this._.inPre=0);a&&a.breakAfterClose&&(this.lineBreak(),this._.needsSpace=a.needsSpace);this._.afterCloser=1},text:function(b){this._.indent&&(this.indentation(),!this._.inPre&&(b=CKEDITOR.tools.ltrim(b)));this._.output.push(b)},comment:function(b){this._.indent&&this.indentation();
this._.output.push("<\!--",b,"--\>")},lineBreak:function(){!this._.inPre&&0<this._.output.length&&this._.output.push(this.lineBreakChars);this._.indent=1},indentation:function(){!this._.inPre&&this._.indentation&&this._.output.push(this._.indentation);this._.indent=0},reset:function(){this._.output=[];this._.indent=0;this._.indentation="";this._.afterCloser=0;this._.inPre=0},setRules:function(b,a){var c=this._.rules[b];c?CKEDITOR.tools.extend(c,a,!0):this._.rules[b]=a}}});(function(){var b={canUndo:!1,exec:function(a){var b=a.document.createElement("hr");a.insertElement(b)},allowedContent:"hr",requiredContent:"hr"};CKEDITOR.plugins.add("horizontalrule",{init:function(a){a.blockless||(a.addCommand("horizontalrule",b),a.ui.addButton&&a.ui.addButton("HorizontalRule",{label:a.lang.horizontalrule.toolbar,command:"horizontalrule",toolbar:"insert,40"}))}})})();(function(){CKEDITOR.plugins.add("iframe",{requires:"dialog,fakeobjects",onLoad:function(){CKEDITOR.addCss("img.cke_iframe{background-image: url("+CKEDITOR.getUrl(this.path+"images/placeholder.png")+");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")},init:function(a){var b=a.lang.iframe,c="iframe[align,longdesc,frameborder,height,name,scrolling,src,title,width]";a.plugins.dialogadvtab&&(c+=";iframe"+a.plugins.dialogadvtab.allowedContent({id:1,
classes:1,styles:1}));CKEDITOR.dialog.add("iframe",this.path+"dialogs/iframe.js");a.addCommand("iframe",new CKEDITOR.dialogCommand("iframe",{allowedContent:c,requiredContent:"iframe"}));a.ui.addButton&&a.ui.addButton("Iframe",{label:b.toolbar,command:"iframe",toolbar:"insert,80"});a.on("doubleclick",function(a){var b=a.data.element;b.is("img")&&"iframe"==b.data("cke-real-element-type")&&(a.data.dialog="iframe")});a.addMenuItems&&a.addMenuItems({iframe:{label:b.title,command:"iframe",group:"image"}});
a.contextMenu&&a.contextMenu.addListener(function(a){if(a&&a.is("img")&&"iframe"==a.data("cke-real-element-type"))return{iframe:CKEDITOR.TRISTATE_OFF}})},afterInit:function(a){var b=a.dataProcessor;(b=b&&b.dataFilter)&&b.addRules({elements:{iframe:function(b){return a.createFakeParserElement(b,"cke_iframe","iframe",!0)}}})}})})();(function(){function k(a){var d=this.editor,b=a.document,c=b.body;(a=b.getElementById("cke_actscrpt"))&&a.parentNode.removeChild(a);(a=b.getElementById("cke_shimscrpt"))&&a.parentNode.removeChild(a);CKEDITOR.env.gecko&&(c.contentEditable=!1,2E4>CKEDITOR.env.version&&(c.innerHTML=c.innerHTML.replace(/^.*<\!-- cke-content-start --\>/,""),setTimeout(function(){var a=new CKEDITOR.dom.range(new CKEDITOR.dom.document(b));a.setStart(new CKEDITOR.dom.node(c),0);d.getSelection().selectRanges([a])},0)));c.contentEditable=
!0;CKEDITOR.env.ie&&(c.hideFocus=!0,c.disabled=!0,c.removeAttribute("disabled"));delete this._.isLoadingData;this.$=c;b=new CKEDITOR.dom.document(b);this.setup();CKEDITOR.env.ie&&(b.getDocumentElement().addClass(b.$.compatMode),d.config.enterMode!=CKEDITOR.ENTER_P&&b.on("selectionchange",function(){var a=b.getBody(),c=d.getSelection(),e=c&&c.getRanges()[0];e&&(a.getHtml().match(/^<p>&nbsp;<\/p>$/i)&&e.startContainer.equals(a))&&setTimeout(function(){e=d.getSelection().getRanges()[0];if(!e.startContainer.equals("body")){a.getFirst().remove(1);
e.moveToElementEditEnd(a);e.select()}},0)}));try{d.document.$.execCommand("2D-position",!1,!0)}catch(e){}try{d.document.$.execCommand("enableInlineTableEditing",!1,!d.config.disableNativeTableHandles)}catch(g){}if(d.config.disableObjectResizing)try{this.getDocument().$.execCommand("enableObjectResizing",!1,!1)}catch(f){this.attachListener(this,CKEDITOR.env.ie?"resizestart":"resize",function(a){a.data.preventDefault()})}(CKEDITOR.env.gecko||CKEDITOR.env.ie&&"CSS1Compat"==d.document.$.compatMode)&&
this.attachListener(this,"keydown",function(a){var b=a.data.getKeystroke();if(b==33||b==34)if(CKEDITOR.env.ie)setTimeout(function(){d.getSelection().scrollIntoView()},0);else if(d.window.$.innerHeight>this.$.offsetHeight){var c=d.createRange();c[b==33?"moveToElementEditStart":"moveToElementEditEnd"](this);c.select();a.data.preventDefault()}});CKEDITOR.env.ie&&this.attachListener(b,"blur",function(){try{b.$.selection.empty()}catch(a){}});d.document.getElementsByTag("title").getItem(0).data("cke-title",
d.document.$.title);CKEDITOR.env.ie&&(d.document.$.title=this._.docTitle);CKEDITOR.tools.setTimeout(function(){d.fire("contentDom");if(this._.isPendingFocus){d.focus();this._.isPendingFocus=false}setTimeout(function(){d.fire("dataReady")},0);CKEDITOR.env.ie&&setTimeout(function(){if(d.document){var a=d.document.$.body;a.runtimeStyle.marginBottom="0px";a.runtimeStyle.marginBottom=""}},1E3)},0,this)}function l(){var a=[];if(8<=CKEDITOR.document.$.documentMode){a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
var d=[],b;for(b in CKEDITOR.dtd.$removeEmpty)d.push("html.CSS1Compat "+b+"[contenteditable=false]");a.push(d.join(",")+"{display:inline-block}")}else CKEDITOR.env.gecko&&(a.push("html{height:100% !important}"),a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));a.push("html{cursor:text;*cursor:auto}");a.push("img,input,textarea{cursor:default}");return a.join("\n")}CKEDITOR.plugins.add("wysiwygarea",{init:function(a){a.config.fullPage&&a.addFeature({allowedContent:"html head title; style [media,type]; body (*)[id]; meta link [*]",
requiredContent:"body"});a.addMode("wysiwyg",function(d){function b(b){b&&b.removeListener();a.editable(new j(a,e.$.contentWindow.document.body));a.setData(a.getData(1),d)}var c="document.open();"+(CKEDITOR.env.ie?"("+CKEDITOR.tools.fixDomain+")();":"")+"document.close();",c=CKEDITOR.env.air?"javascript:void(0)":CKEDITOR.env.ie?"javascript:void(function(){"+encodeURIComponent(c)+"}())":"",e=CKEDITOR.dom.element.createFromHtml('<iframe src="'+c+'" frameBorder="0"></iframe>');e.setStyles({width:"100%",
height:"100%"});e.addClass("cke_wysiwyg_frame cke_reset");var g=a.ui.space("contents");g.append(e);if(c=CKEDITOR.env.ie||CKEDITOR.env.gecko)e.on("load",b);var f=a.title,h=a.lang.common.editorHelp;f&&(CKEDITOR.env.ie&&(f+=", "+h),e.setAttribute("title",f));var f=CKEDITOR.tools.getNextId(),i=CKEDITOR.dom.element.createFromHtml('<span id="'+f+'" class="cke_voice_label">'+h+"</span>");g.append(i,1);a.on("beforeModeUnload",function(a){a.removeListener();i.remove()});e.setAttributes({"aria-describedby":f,
tabIndex:a.tabIndex,allowTransparency:"true"});!c&&b();CKEDITOR.env.webkit&&(c=function(){g.setStyle("width","100%");e.hide();e.setSize("width",g.getSize("width"));g.removeStyle("width");e.show()},e.setCustomData("onResize",c),CKEDITOR.document.getWindow().on("resize",c));a.fire("ariaWidget",e)})}});var j=CKEDITOR.tools.createClass({$:function(a){this.base.apply(this,arguments);this._.frameLoadedHandler=CKEDITOR.tools.addFunction(function(a){CKEDITOR.tools.setTimeout(k,0,this,a)},this);this._.docTitle=
this.getWindow().getFrame().getAttribute("title")},base:CKEDITOR.editable,proto:{setData:function(a,d){var b=this.editor;if(d)this.setHtml(a),b.fire("dataReady");else{this._.isLoadingData=!0;b._.dataStore={id:1};var c=b.config,e=c.fullPage,g=c.docType,f=CKEDITOR.tools.buildStyleHtml(l()).replace(/<style>/,'<style data-cke-temp="1">');e||(f+=CKEDITOR.tools.buildStyleHtml(b.config.contentsCss));var h=c.baseHref?'<base href="'+c.baseHref+'" data-cke-temp="1" />':"";e&&(a=a.replace(/<!DOCTYPE[^>]*>/i,
function(a){b.docType=g=a;return""}).replace(/<\?xml\s[^\?]*\?>/i,function(a){b.xmlDeclaration=a;return""}));b.dataProcessor&&(a=b.dataProcessor.toHtml(a));e?(/<body[\s|>]/.test(a)||(a="<body>"+a),/<html[\s|>]/.test(a)||(a="<html>"+a+"</html>"),/<head[\s|>]/.test(a)?/<title[\s|>]/.test(a)||(a=a.replace(/<head[^>]*>/,"$&<title></title>")):a=a.replace(/<html[^>]*>/,"$&<head><title></title></head>"),h&&(a=a.replace(/<head>/,"$&"+h)),a=a.replace(/<\/head\s*>/,f+"$&"),a=g+a):a=c.docType+'<html dir="'+
c.contentsLangDirection+'" lang="'+(c.contentsLanguage||b.langCode)+'"><head><title>'+this._.docTitle+"</title>"+h+f+"</head><body"+(c.bodyId?' id="'+c.bodyId+'"':"")+(c.bodyClass?' class="'+c.bodyClass+'"':"")+">"+a+"</body></html>";CKEDITOR.env.gecko&&(a=a.replace(/<body/,'<body contenteditable="true" '),2E4>CKEDITOR.env.version&&(a=a.replace(/<body[^>]*>/,"$&<\!-- cke-content-start --\>")));c='<script id="cke_actscrpt" type="text/javascript"'+(CKEDITOR.env.ie?' defer="defer" ':"")+">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction("+
this._.frameLoadedHandler+",window);wasLoaded=1;}"+(CKEDITOR.env.ie?"onload();":'document.addEventListener("DOMContentLoaded", onload, false );')+"<\/script>";CKEDITOR.env.ie&&9>CKEDITOR.env.version&&(c+='<script id="cke_shimscrpt">(function(){var e="abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video".split(","),i=e.length;while(i--){document.createElement(e[i])}})()<\/script>');a=a.replace(/(?=\s*<\/(:?head)>)/,
c);this.clearCustomData();this.clearListeners();b.fire("contentDomUnload");var i=this.getDocument();try{i.write(a)}catch(j){setTimeout(function(){i.write(a)},0)}}},getData:function(a){if(a)return this.getHtml();var a=this.editor,d=a.config,b=d.fullPage,c=b&&a.docType,e=b&&a.xmlDeclaration,g=this.getDocument(),b=b?g.getDocumentElement().getOuterHtml():g.getBody().getHtml();CKEDITOR.env.gecko&&d.enterMode!=CKEDITOR.ENTER_BR&&(b=b.replace(/<br>(?=\s*(:?$|<\/body>))/,""));a.dataProcessor&&(b=a.dataProcessor.toDataFormat(b));
e&&(b=e+"\n"+b);c&&(b=c+"\n"+b);return b},focus:function(){this._.isLoadingData?this._.isPendingFocus=!0:j.baseProto.focus.call(this)},detach:function(){var a=this.editor,d=a.document,b=a.window.getFrame();j.baseProto.detach.call(this);this.clearCustomData();d.getDocumentElement().clearCustomData();b.clearCustomData();CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);(d=b.removeCustomData("onResize"))&&d.removeListener();a.fire("contentDomUnload");b.remove()}}})})();
CKEDITOR.config.disableObjectResizing=!1;CKEDITOR.config.disableNativeTableHandles=!0;CKEDITOR.config.disableNativeSpellChecker=!0;CKEDITOR.config.contentsCss=CKEDITOR.basePath+"contents.css";(function(){function e(b,a){a||(a=b.getSelection().getSelectedElement());if(a&&a.is("img")&&!a.data("cke-realelement")&&!a.isReadOnly())return a}function f(b){var a=b.getStyle("float");if("inherit"==a||"none"==a)a=0;a||(a=b.getAttribute("align"));return a}CKEDITOR.plugins.add("image",{requires:"dialog",init:function(b){CKEDITOR.dialog.add("image",this.path+"dialogs/image.js");var a="img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
CKEDITOR.dialog.isTabEnabled(b,"image","advanced")&&(a="img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");b.addCommand("image",new CKEDITOR.dialogCommand("image",{allowedContent:a,requiredContent:"img[alt,src]",contentTransformations:[["img{width}: sizeToStyle","img[width]: sizeToAttribute"],["img{float}: alignmentToStyle","img[align]: alignmentToAttribute"]]}));b.ui.addButton&&b.ui.addButton("Image",{label:b.lang.common.image,command:"image",toolbar:"insert,10"});b.on("doubleclick",function(a){var b=
a.data.element;b.is("img")&&(!b.data("cke-realelement")&&!b.isReadOnly())&&(a.data.dialog="image")});b.addMenuItems&&b.addMenuItems({image:{label:b.lang.image.menu,command:"image",group:"image"}});b.contextMenu&&b.contextMenu.addListener(function(a){if(e(b,a))return{image:CKEDITOR.TRISTATE_OFF}})},afterInit:function(b){function a(a){var d=b.getCommand("justify"+a);if(d){if("left"==a||"right"==a)d.on("exec",function(d){var c=e(b),g;c&&(g=f(c),g==a?(c.removeStyle("float"),a==f(c)&&c.removeAttribute("align")):
c.setStyle("float",a),d.cancel())});d.on("refresh",function(d){var c=e(b);c&&(c=f(c),this.setState(c==a?CKEDITOR.TRISTATE_ON:"right"==a||"left"==a?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED),d.cancel())})}}a("left");a("right");a("center");a("block")}})})();CKEDITOR.config.image_removeLinkByEmptyURL=!0;(function(){function k(a,b){var e,f;b.on("refresh",function(a){var b=[j],c;for(c in a.data.states)b.push(a.data.states[c]);this.setState(CKEDITOR.tools.search(b,m)?m:j)},b,null,100);b.on("exec",function(b){e=a.getSelection();f=e.createBookmarks(1);b.data||(b.data={});b.data.done=!1},b,null,0);b.on("exec",function(){a.forceNextSelectionCheck();e.selectBookmarks(f)},b,null,100)}var j=CKEDITOR.TRISTATE_DISABLED,m=CKEDITOR.TRISTATE_OFF;CKEDITOR.plugins.add("indent",{init:function(a){var b=CKEDITOR.plugins.indent.genericDefinition;
k(a,a.addCommand("indent",new b(!0)));k(a,a.addCommand("outdent",new b));a.ui.addButton&&(a.ui.addButton("Indent",{label:a.lang.indent.indent,command:"indent",directional:!0,toolbar:"indent,20"}),a.ui.addButton("Outdent",{label:a.lang.indent.outdent,command:"outdent",directional:!0,toolbar:"indent,10"}));a.on("dirChanged",function(b){var f=a.createRange(),i=b.data.node;f.setStartBefore(i);f.setEndAfter(i);for(var l=new CKEDITOR.dom.walker(f),c;c=l.next();)if(c.type==CKEDITOR.NODE_ELEMENT)if(!c.equals(i)&&
c.getDirection()){f.setStartAfter(c);l=new CKEDITOR.dom.walker(f)}else{var d=a.config.indentClasses;if(d)for(var g=b.data.dir=="ltr"?["_rtl",""]:["","_rtl"],h=0;h<d.length;h++)if(c.hasClass(d[h]+g[0])){c.removeClass(d[h]+g[0]);c.addClass(d[h]+g[1])}d=c.getStyle("margin-right");g=c.getStyle("margin-left");d?c.setStyle("margin-left",d):c.removeStyle("margin-left");g?c.setStyle("margin-right",g):c.removeStyle("margin-right")}})}});CKEDITOR.plugins.indent={genericDefinition:function(a){this.isIndent=
!!a;this.startDisabled=!this.isIndent},specificDefinition:function(a,b,e){this.name=b;this.editor=a;this.jobs={};this.enterBr=a.config.enterMode==CKEDITOR.ENTER_BR;this.isIndent=!!e;this.relatedGlobal=e?"indent":"outdent";this.indentKey=e?9:CKEDITOR.SHIFT+9;this.database={}},registerCommands:function(a,b){a.on("pluginsLoaded",function(){for(var a in b)(function(a,b){var e=a.getCommand(b.relatedGlobal),c;for(c in b.jobs)e.on("exec",function(d){d.data.done||(a.fire("lockSnapshot"),b.execJob(a,c)&&(d.data.done=
!0),a.fire("unlockSnapshot"),CKEDITOR.dom.element.clearAllMarkers(b.database))},this,null,c),e.on("refresh",function(d){d.data.states||(d.data.states={});d.data.states[b.name+"@"+c]=b.refreshJob(a,c,d.data.path)},this,null,c);a.addFeature(b)})(this,b[a])})}};CKEDITOR.plugins.indent.genericDefinition.prototype={context:"p",exec:function(){}};CKEDITOR.plugins.indent.specificDefinition.prototype={execJob:function(a,b){var e=this.jobs[b];if(e.state!=j)return e.exec.call(this,a)},refreshJob:function(a,
b,e){b=this.jobs[b];b.state=b.refresh.call(this,a,e);return b.state},getContext:function(a){return a.contains(this.context)}}})();(function(){function h(b,c,a){if(!b.getCustomData("indent_processed")){var d=this.editor,f=this.isIndent;if(c){d=b.$.className.match(this.classNameRegex);a=0;d&&(d=d[1],a=CKEDITOR.tools.indexOf(c,d)+1);if(0>(a+=f?1:-1))return;a=Math.min(a,c.length);a=Math.max(a,0);b.$.className=CKEDITOR.tools.ltrim(b.$.className.replace(this.classNameRegex,""));0<a&&b.addClass(c[a-1])}else{var c=i(b,a),a=parseInt(b.getStyle(c),10),g=d.config.indentOffset||40;isNaN(a)&&(a=0);a+=(f?1:-1)*g;if(0>a)return;a=Math.max(a,
0);a=Math.ceil(a/g)*g;b.setStyle(c,a?a+(d.config.indentUnit||"px"):"");""===b.getAttribute("style")&&b.removeAttribute("style")}CKEDITOR.dom.element.setMarker(this.database,b,"indent_processed",1)}}function i(b,c){return"ltr"==(c||b.getComputedStyle("direction"))?"margin-left":"margin-right"}var j=CKEDITOR.dtd.$listItem,l=CKEDITOR.dtd.$list,f=CKEDITOR.TRISTATE_DISABLED,k=CKEDITOR.TRISTATE_OFF;CKEDITOR.plugins.add("indentblock",{requires:"indent",init:function(b){function c(b,c){a.specificDefinition.apply(this,
arguments);this.allowedContent={"div h1 h2 h3 h4 h5 h6 ol p pre ul":{propertiesOnly:!0,styles:!d?"margin-left,margin-right":null,classes:d||null}};this.enterBr&&(this.allowedContent.div=!0);this.requiredContent=(this.enterBr?"div":"p")+(d?"("+d.join(",")+")":"{margin-left}");this.jobs={20:{refresh:function(a,b){var e=b.block||b.blockLimit;if(e.is(j))e=e.getParent();else if(e.getAscendant(j))return f;if(!this.enterBr&&!this.getContext(b))return f;if(d){var c;c=d;var e=e.$.className.match(this.classNameRegex),
g=this.isIndent;c=e?g?e[1]!=c.slice(-1):true:g;return c?k:f}return this.isIndent?k:e?CKEDITOR[(parseInt(e.getStyle(i(e)),10)||0)<=0?"TRISTATE_DISABLED":"TRISTATE_OFF"]:f},exec:function(a){var b=a.getSelection(),b=b&&b.getRanges(1)[0],c;if(c=a.elementPath().contains(l))h.call(this,c,d);else{b=b.createIterator();a=a.config.enterMode;b.enforceRealBlocks=true;for(b.enlargeBr=a!=CKEDITOR.ENTER_BR;c=b.getNextParagraph(a==CKEDITOR.ENTER_P?"p":"div");)h.call(this,c,d)}return true}}}}var a=CKEDITOR.plugins.indent,
d=b.config.indentClasses;a.registerCommands(b,{indentblock:new c(b,"indentblock",!0),outdentblock:new c(b,"outdentblock")});CKEDITOR.tools.extend(c.prototype,a.specificDefinition.prototype,{context:{div:1,dl:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,ul:1,ol:1,p:1,pre:1,table:1},classNameRegex:d?RegExp("(?:^|\\s+)("+d.join("|")+")(?=$|\\s)"):null})}})})();(function(){function s(e){function g(b){for(var f=d.startContainer,a=d.endContainer;f&&!f.getParent().equals(b);)f=f.getParent();for(;a&&!a.getParent().equals(b);)a=a.getParent();if(!f||!a)return!1;for(var h=f,f=[],c=!1;!c;)h.equals(a)&&(c=!0),f.push(h),h=h.getNext();if(1>f.length)return!1;h=b.getParents(!0);for(a=0;a<h.length;a++)if(h[a].getName&&k[h[a].getName()]){b=h[a];break}for(var h=n.isIndent?1:-1,a=f[0],f=f[f.length-1],c=CKEDITOR.plugins.list.listToArray(b,o),g=c[f.getCustomData("listarray_index")].indent,
a=a.getCustomData("listarray_index");a<=f.getCustomData("listarray_index");a++)if(c[a].indent+=h,0<h){var l=c[a].parent;c[a].parent=new CKEDITOR.dom.element(l.getName(),l.getDocument())}for(a=f.getCustomData("listarray_index")+1;a<c.length&&c[a].indent>g;a++)c[a].indent+=h;f=CKEDITOR.plugins.list.arrayToList(c,o,null,e.config.enterMode,b.getDirection());if(!n.isIndent){var i;if((i=b.getParent())&&i.is("li"))for(var h=f.listNode.getChildren(),m=[],j,a=h.count()-1;0<=a;a--)(j=h.getItem(a))&&(j.is&&
j.is("li"))&&m.push(j)}f&&f.listNode.replace(b);if(m&&m.length)for(a=0;a<m.length;a++){for(j=b=m[a];(j=j.getNext())&&j.is&&j.getName()in k;)CKEDITOR.env.ie&&!b.getFirst(function(a){return t(a)&&u(a)})&&b.append(d.document.createText(" ")),b.append(j);b.insertAfter(i)}return!0}for(var n=this,o=this.database,k=this.context,l=e.getSelection(),l=(l&&l.getRanges(1)).createIterator(),d;d=l.getNextRange();){for(var b=d.getCommonAncestor();b&&!(b.type==CKEDITOR.NODE_ELEMENT&&k[b.getName()]);)b=b.getParent();
b||(b=d.startPath().contains(k))&&d.setEndAt(b,CKEDITOR.POSITION_BEFORE_END);if(!b){var c=d.getEnclosedNode();c&&(c.type==CKEDITOR.NODE_ELEMENT&&c.getName()in k)&&(d.setStartAt(c,CKEDITOR.POSITION_AFTER_START),d.setEndAt(c,CKEDITOR.POSITION_BEFORE_END),b=c)}b&&(d.startContainer.type==CKEDITOR.NODE_ELEMENT&&d.startContainer.getName()in k)&&(c=new CKEDITOR.dom.walker(d),c.evaluator=i,d.startContainer=c.next());b&&(d.endContainer.type==CKEDITOR.NODE_ELEMENT&&d.endContainer.getName()in k)&&(c=new CKEDITOR.dom.walker(d),
c.evaluator=i,d.endContainer=c.previous());if(b)return g(b)}return 0}function p(e,g){g||(g=e.contains(this.context));return g&&e.block&&e.block.equals(g.getFirst(i))}function i(e){return e.type==CKEDITOR.NODE_ELEMENT&&e.is("li")}var t=CKEDITOR.dom.walker.whitespaces(!0),u=CKEDITOR.dom.walker.bookmark(!1,!0),q=CKEDITOR.TRISTATE_DISABLED,r=CKEDITOR.TRISTATE_OFF;CKEDITOR.plugins.add("indentlist",{requires:"indent",init:function(e){function g(e,g){i.specificDefinition.apply(this,arguments);this.requiredContent=
["ul","ol"];e.on("key",function(g){if("wysiwyg"==e.mode&&g.data.keyCode==this.indentKey){var d=this.getContext(e.elementPath());if(d&&(!this.isIndent||!p.call(this,e.elementPath(),d)))e.execCommand(this.relatedGlobal),g.cancel()}},this);this.jobs[this.isIndent?10:30]={refresh:this.isIndent?function(e,d){var b=this.getContext(d),c=p.call(this,d,b);return!b||!this.isIndent||c?q:r}:function(e,d){return!this.getContext(d)||this.isIndent?q:r},exec:CKEDITOR.tools.bind(s,this)}}var i=CKEDITOR.plugins.indent;
i.registerCommands(e,{indentlist:new g(e,"indentlist",!0),outdentlist:new g(e,"outdentlist")});CKEDITOR.tools.extend(g.prototype,i.specificDefinition.prototype,{context:{ol:1,ul:1}})}})})();CKEDITOR.plugins.add("smiley",{requires:"dialog",init:function(a){a.config.smiley_path=a.config.smiley_path||this.path+"images/";a.addCommand("smiley",new CKEDITOR.dialogCommand("smiley",{allowedContent:"img[alt,height,!src,title,width]",requiredContent:"img"}));a.ui.addButton&&a.ui.addButton("Smiley",{label:a.lang.smiley.toolbar,command:"smiley",toolbar:"insert,50"});CKEDITOR.dialog.add("smiley",this.path+"dialogs/smiley.js")}});CKEDITOR.config.smiley_images="regular_smile.gif sad_smile.gif wink_smile.gif teeth_smile.gif confused_smile.gif tongue_smile.gif embarrassed_smile.gif omg_smile.gif whatchutalkingabout_smile.gif angry_smile.gif angel_smile.gif shades_smile.gif devil_smile.gif cry_smile.gif lightbulb.gif thumbs_down.gif thumbs_up.gif heart.gif broken_heart.gif kiss.gif envelope.gif".split(" ");
CKEDITOR.config.smiley_descriptions="smiley;sad;wink;laugh;frown;cheeky;blush;surprise;indecision;angry;angel;cool;devil;crying;enlightened;no;yes;heart;broken heart;kiss;mail".split(";");(function(){function l(a,c){var c=void 0===c||c,b;if(c)b=a.getComputedStyle("text-align");else{for(;!a.hasAttribute||!a.hasAttribute("align")&&!a.getStyle("text-align");){b=a.getParent();if(!b)break;a=b}b=a.getStyle("text-align")||a.getAttribute("align")||""}b&&(b=b.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i,""));!b&&c&&(b="rtl"==a.getComputedStyle("direction")?"right":"left");return b}function f(a,c,b){this.editor=a;this.name=c;this.value=b;this.context="p";var c=a.config.justifyClasses,g=a.config.enterMode==
CKEDITOR.ENTER_P?"p":"div";if(c){switch(b){case "left":this.cssClassName=c[0];break;case "center":this.cssClassName=c[1];break;case "right":this.cssClassName=c[2];break;case "justify":this.cssClassName=c[3]}this.cssClassRegex=RegExp("(?:^|\\s+)(?:"+c.join("|")+")(?=$|\\s)");this.requiredContent=g+"("+this.cssClassName+")"}else this.requiredContent=g+"{text-align}";this.allowedContent={"caption div h1 h2 h3 h4 h5 h6 p pre td th li":{propertiesOnly:!0,styles:this.cssClassName?null:"text-align",classes:this.cssClassName||
null}};a.config.enterMode==CKEDITOR.ENTER_BR&&(this.allowedContent.div=!0)}function j(a){var c=a.editor,b=c.createRange();b.setStartBefore(a.data.node);b.setEndAfter(a.data.node);for(var g=new CKEDITOR.dom.walker(b),d;d=g.next();)if(d.type==CKEDITOR.NODE_ELEMENT)if(!d.equals(a.data.node)&&d.getDirection())b.setStartAfter(d),g=new CKEDITOR.dom.walker(b);else{var e=c.config.justifyClasses;e&&(d.hasClass(e[0])?(d.removeClass(e[0]),d.addClass(e[2])):d.hasClass(e[2])&&(d.removeClass(e[2]),d.addClass(e[0])));
e=d.getStyle("text-align");"left"==e?d.setStyle("text-align","right"):"right"==e&&d.setStyle("text-align","left")}}f.prototype={exec:function(a){var c=a.getSelection(),b=a.config.enterMode;if(c){for(var g=c.createBookmarks(),d=c.getRanges(!0),e=this.cssClassName,f,h,i=a.config.useComputedState,i=void 0===i||i,k=d.length-1;0<=k;k--){f=d[k].createIterator();for(f.enlargeBr=b!=CKEDITOR.ENTER_BR;h=f.getNextParagraph(b==CKEDITOR.ENTER_P?"p":"div");){h.removeAttribute("align");h.removeStyle("text-align");
var j=e&&(h.$.className=CKEDITOR.tools.ltrim(h.$.className.replace(this.cssClassRegex,""))),m=this.state==CKEDITOR.TRISTATE_OFF&&(!i||l(h,!0)!=this.value);e?m?h.addClass(e):j||h.removeAttribute("class"):m&&h.setStyle("text-align",this.value)}}a.focus();a.forceNextSelectionCheck();c.selectBookmarks(g)}},refresh:function(a,c){var b=c.block||c.blockLimit;this.setState("body"!=b.getName()&&l(b,this.editor.config.useComputedState)==this.value?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)}};CKEDITOR.plugins.add("justify",
{init:function(a){if(!a.blockless){var c=new f(a,"justifyleft","left"),b=new f(a,"justifycenter","center"),g=new f(a,"justifyright","right"),d=new f(a,"justifyblock","justify");a.addCommand("justifyleft",c);a.addCommand("justifycenter",b);a.addCommand("justifyright",g);a.addCommand("justifyblock",d);a.ui.addButton&&(a.ui.addButton("JustifyLeft",{label:a.lang.justify.left,command:"justifyleft",toolbar:"align,10"}),a.ui.addButton("JustifyCenter",{label:a.lang.justify.center,command:"justifycenter",
toolbar:"align,20"}),a.ui.addButton("JustifyRight",{label:a.lang.justify.right,command:"justifyright",toolbar:"align,30"}),a.ui.addButton("JustifyBlock",{label:a.lang.justify.block,command:"justifyblock",toolbar:"align,40"}));a.on("dirChanged",j)}}})})();CKEDITOR.plugins.add("link",{requires:"dialog,fakeobjects",onLoad:function(){function b(b){return d.replace(/%1/g,"rtl"==b?"right":"left").replace(/%2/g,"cke_contents_"+b)}var a="background:url("+CKEDITOR.getUrl(this.path+"images"+(CKEDITOR.env.hidpi?"/hidpi":"")+"/anchor.png")+") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",d=".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{"+a+"padding-%1:18px;cursor:auto;}"+(CKEDITOR.env.ie?
"a.cke_anchor_empty{display:inline-block;}":"")+".%2 img.cke_anchor{"+a+"width:16px;min-height:15px;height:1.15em;vertical-align:"+(CKEDITOR.env.opera?"middle":"text-bottom")+";}";CKEDITOR.addCss(b("ltr")+b("rtl"))},init:function(b){var a="a[!href]";CKEDITOR.dialog.isTabEnabled(b,"link","advanced")&&(a=a.replace("]",",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));CKEDITOR.dialog.isTabEnabled(b,"link","target")&&(a=a.replace("]",",target,onclick]"));b.addCommand("link",new CKEDITOR.dialogCommand("link",
{allowedContent:a,requiredContent:"a[href]"}));b.addCommand("anchor",new CKEDITOR.dialogCommand("anchor",{allowedContent:"a[!name,id]",requiredContent:"a[name]"}));b.addCommand("unlink",new CKEDITOR.unlinkCommand);b.addCommand("removeAnchor",new CKEDITOR.removeAnchorCommand);b.setKeystroke(CKEDITOR.CTRL+76,"link");b.ui.addButton&&(b.ui.addButton("Link",{label:b.lang.link.toolbar,command:"link",toolbar:"links,10"}),b.ui.addButton("Unlink",{label:b.lang.link.unlink,command:"unlink",toolbar:"links,20"}),
b.ui.addButton("Anchor",{label:b.lang.link.anchor.toolbar,command:"anchor",toolbar:"links,30"}));CKEDITOR.dialog.add("link",this.path+"dialogs/link.js");CKEDITOR.dialog.add("anchor",this.path+"dialogs/anchor.js");b.on("doubleclick",function(a){var c=CKEDITOR.plugins.link.getSelectedLink(b)||a.data.element;if(!c.isReadOnly())if(c.is("a")){a.data.dialog=c.getAttribute("name")&&(!c.getAttribute("href")||!c.getChildCount())?"anchor":"link";b.getSelection().selectElement(c)}else if(CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
c))a.data.dialog="anchor"});b.addMenuItems&&b.addMenuItems({anchor:{label:b.lang.link.anchor.menu,command:"anchor",group:"anchor",order:1},removeAnchor:{label:b.lang.link.anchor.remove,command:"removeAnchor",group:"anchor",order:5},link:{label:b.lang.link.menu,command:"link",group:"link",order:1},unlink:{label:b.lang.link.unlink,command:"unlink",group:"link",order:5}});b.contextMenu&&b.contextMenu.addListener(function(a){if(!a||a.isReadOnly())return null;a=CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
a);if(!a&&!(a=CKEDITOR.plugins.link.getSelectedLink(b)))return null;var c={};a.getAttribute("href")&&a.getChildCount()&&(c={link:CKEDITOR.TRISTATE_OFF,unlink:CKEDITOR.TRISTATE_OFF});if(a&&a.hasAttribute("name"))c.anchor=c.removeAnchor=CKEDITOR.TRISTATE_OFF;return c})},afterInit:function(b){var a=b.dataProcessor,d=a&&a.dataFilter,a=a&&a.htmlFilter,c=b._.elementsPath&&b._.elementsPath.filters;d&&d.addRules({elements:{a:function(a){var c=a.attributes;if(!c.name)return null;var d=!a.children.length;if(CKEDITOR.plugins.link.synAnchorSelector){var a=
d?"cke_anchor_empty":"cke_anchor",e=c["class"];if(c.name&&(!e||0>e.indexOf(a)))c["class"]=(e||"")+" "+a;d&&CKEDITOR.plugins.link.emptyAnchorFix&&(c.contenteditable="false",c["data-cke-editable"]=1)}else if(CKEDITOR.plugins.link.fakeAnchor&&d)return b.createFakeParserElement(a,"cke_anchor","anchor");return null}}});CKEDITOR.plugins.link.emptyAnchorFix&&a&&a.addRules({elements:{a:function(a){delete a.attributes.contenteditable}}});c&&c.push(function(a,c){if("a"==c&&(CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
a)||a.getAttribute("name")&&(!a.getAttribute("href")||!a.getChildCount())))return"anchor"})}});
CKEDITOR.plugins.link={getSelectedLink:function(b){var a=b.getSelection(),d=a.getSelectedElement();return d&&d.is("a")?d:(a=a.getRanges(!0)[0])?(a.shrink(CKEDITOR.SHRINK_TEXT),b.elementPath(a.getCommonAncestor()).contains("a",1)):null},fakeAnchor:CKEDITOR.env.opera||CKEDITOR.env.webkit,synAnchorSelector:CKEDITOR.env.ie,emptyAnchorFix:CKEDITOR.env.ie&&8>CKEDITOR.env.version,tryRestoreFakeAnchor:function(b,a){if(a&&a.data("cke-real-element-type")&&"anchor"==a.data("cke-real-element-type")){var d=b.restoreRealElement(a);
if(d.data("cke-saved-name"))return d}}};CKEDITOR.unlinkCommand=function(){};CKEDITOR.unlinkCommand.prototype={exec:function(b){var a=new CKEDITOR.style({element:"a",type:CKEDITOR.STYLE_INLINE,alwaysRemoveElement:1});b.removeStyle(a)},refresh:function(b,a){var d=a.lastElement&&a.lastElement.getAscendant("a",!0);d&&"a"==d.getName()&&d.getAttribute("href")&&d.getChildCount()?this.setState(CKEDITOR.TRISTATE_OFF):this.setState(CKEDITOR.TRISTATE_DISABLED)},contextSensitive:1,startDisabled:1,requiredContent:"a[href]"};
CKEDITOR.removeAnchorCommand=function(){};CKEDITOR.removeAnchorCommand.prototype={exec:function(b){var a=b.getSelection(),d=a.createBookmarks(),c;if(a&&(c=a.getSelectedElement())&&(CKEDITOR.plugins.link.fakeAnchor&&!c.getChildCount()?CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,c):c.is("a")))c.remove(1);else if(c=CKEDITOR.plugins.link.getSelectedLink(b))c.hasAttribute("href")?(c.removeAttributes({name:1,"data-cke-saved-name":1}),c.removeClass("cke_anchor")):c.remove(1);a.selectBookmarks(d)},requiredContent:"a[name]"};
CKEDITOR.tools.extend(CKEDITOR.config,{linkShowAdvancedTab:!0,linkShowTargetTab:!0});(function(){function C(c,j,f){function b(b){if((d=a[b?"getFirst":"getLast"]())&&(!d.is||!d.isBlockBoundary())&&(m=j.root[b?"getPrevious":"getNext"](CKEDITOR.dom.walker.invisible(!0)))&&(!m.is||!m.isBlockBoundary({br:1})))c.document.createElement("br")[b?"insertBefore":"insertAfter"](d)}for(var i=CKEDITOR.plugins.list.listToArray(j.root,f),e=[],h=0;h<j.contents.length;h++){var g=j.contents[h];if((g=g.getAscendant("li",!0))&&!g.getCustomData("list_item_processed"))e.push(g),CKEDITOR.dom.element.setMarker(f,
g,"list_item_processed",!0)}g=null;for(h=0;h<e.length;h++)g=e[h].getCustomData("listarray_index"),i[g].indent=-1;for(h=g+1;h<i.length;h++)if(i[h].indent>i[h-1].indent+1){e=i[h-1].indent+1-i[h].indent;for(g=i[h].indent;i[h]&&i[h].indent>=g;)i[h].indent+=e,h++;h--}var a=CKEDITOR.plugins.list.arrayToList(i,f,null,c.config.enterMode,j.root.getAttribute("dir")).listNode,d,m;b(!0);b();a.replace(j.root)}function x(c,j){this.name=c;this.context=this.type=j;this.allowedContent=j+" li";this.requiredContent=
j}function y(c,j,f,b){for(var i,e;i=c[b?"getLast":"getFirst"](D);)(e=i.getDirection(1))!==j.getDirection(1)&&i.setAttribute("dir",e),i.remove(),f?i[b?"insertBefore":"insertAfter"](f):j.append(i,b)}function A(c){var j;(j=function(f){var b=c[f?"getPrevious":"getNext"](q);b&&(b.type==CKEDITOR.NODE_ELEMENT&&b.is(c.getName()))&&(y(c,b,null,!f),c.remove(),c=b)})();j(1)}function B(c){return c.type==CKEDITOR.NODE_ELEMENT&&(c.getName()in CKEDITOR.dtd.$block||c.getName()in CKEDITOR.dtd.$listItem)&&CKEDITOR.dtd[c.getName()]["#"]}
function v(c,j,f){c.fire("saveSnapshot");f.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);var b=f.extractContents();j.trim(!1,!0);var i=j.createBookmark(),e=new CKEDITOR.dom.elementPath(j.startContainer),h=e.block,e=e.lastElement.getAscendant("li",1)||h,g=new CKEDITOR.dom.elementPath(f.startContainer),a=g.contains(CKEDITOR.dtd.$listItem),g=g.contains(CKEDITOR.dtd.$list);h?(h=h.getBogus())&&h.remove():g&&(h=g.getPrevious(q))&&u(h)&&h.remove();(h=b.getLast())&&(h.type==CKEDITOR.NODE_ELEMENT&&h.is("br"))&&
h.remove();(h=j.startContainer.getChild(j.startOffset))?b.insertBefore(h):j.startContainer.append(b);if(a&&(b=w(a)))e.contains(a)?(y(b,a.getParent(),a),b.remove()):e.append(b);for(;f.checkStartOfBlock()&&f.checkEndOfBlock();)g=f.startPath(),b=g.block,b.is("li")&&(e=b.getParent(),b.equals(e.getLast(q))&&b.equals(e.getFirst(q))&&(b=e)),f.moveToPosition(b,CKEDITOR.POSITION_BEFORE_START),b.remove();f=f.clone();b=c.editable();f.setEndAt(b,CKEDITOR.POSITION_BEFORE_END);f=new CKEDITOR.dom.walker(f);f.evaluator=
function(a){return q(a)&&!u(a)};(f=f.next())&&(f.type==CKEDITOR.NODE_ELEMENT&&f.getName()in CKEDITOR.dtd.$list)&&A(f);j.moveToBookmark(i);j.select();c.fire("saveSnapshot")}function w(c){return(c=c.getLast(q))&&c.type==CKEDITOR.NODE_ELEMENT&&c.getName()in r?c:null}var r={ol:1,ul:1},E=CKEDITOR.dom.walker.whitespaces(),F=CKEDITOR.dom.walker.bookmark(),q=function(c){return!(E(c)||F(c))},u=CKEDITOR.dom.walker.bogus();CKEDITOR.plugins.list={listToArray:function(c,j,f,b,i){if(!r[c.getName()])return[];b||
(b=0);f||(f=[]);for(var e=0,h=c.getChildCount();e<h;e++){var g=c.getChild(e);g.type==CKEDITOR.NODE_ELEMENT&&g.getName()in CKEDITOR.dtd.$list&&CKEDITOR.plugins.list.listToArray(g,j,f,b+1);if("li"==g.$.nodeName.toLowerCase()){var a={parent:c,indent:b,element:g,contents:[]};i?a.grandparent=i:(a.grandparent=c.getParent(),a.grandparent&&"li"==a.grandparent.$.nodeName.toLowerCase()&&(a.grandparent=a.grandparent.getParent()));j&&CKEDITOR.dom.element.setMarker(j,g,"listarray_index",f.length);f.push(a);for(var d=
0,m=g.getChildCount(),k;d<m;d++)k=g.getChild(d),k.type==CKEDITOR.NODE_ELEMENT&&r[k.getName()]?CKEDITOR.plugins.list.listToArray(k,j,f,b+1,a.grandparent):a.contents.push(k)}}return f},arrayToList:function(c,j,f,b,i){f||(f=0);if(!c||c.length<f+1)return null;for(var e,h=c[f].parent.getDocument(),g=new CKEDITOR.dom.documentFragment(h),a=null,d=f,m=Math.max(c[f].indent,0),k=null,n,l,p=b==CKEDITOR.ENTER_P?"p":"div";;){var o=c[d];e=o.grandparent;n=o.element.getDirection(1);if(o.indent==m){if(!a||c[d].parent.getName()!=
a.getName())a=c[d].parent.clone(!1,1),i&&a.setAttribute("dir",i),g.append(a);k=a.append(o.element.clone(0,1));n!=a.getDirection(1)&&k.setAttribute("dir",n);for(e=0;e<o.contents.length;e++)k.append(o.contents[e].clone(1,1));d++}else if(o.indent==Math.max(m,0)+1)l=c[d-1].element.getDirection(1),d=CKEDITOR.plugins.list.arrayToList(c,null,d,b,l!=n?n:null),!k.getChildCount()&&(CKEDITOR.env.ie&&!(7<h.$.documentMode))&&k.append(h.createText(" ")),k.append(d.listNode),d=d.nextIndex;else if(-1==o.indent&&
!f&&e){r[e.getName()]?(k=o.element.clone(!1,!0),n!=e.getDirection(1)&&k.setAttribute("dir",n)):k=new CKEDITOR.dom.documentFragment(h);var a=e.getDirection(1)!=n,s=o.element,z=s.getAttribute("class"),u=s.getAttribute("style"),w=k.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT&&(b!=CKEDITOR.ENTER_BR||a||u||z),t,x=o.contents.length;for(e=0;e<x;e++){t=o.contents[e];if(t.type==CKEDITOR.NODE_ELEMENT&&t.isBlockBoundary()){a&&!t.getDirection()&&t.setAttribute("dir",n);var v=t,y=s.getAttribute("style");y&&v.setAttribute("style",
y.replace(/([^;])$/,"$1;")+(v.getAttribute("style")||""));z&&t.addClass(z)}else w&&(l||(l=h.createElement(p),a&&l.setAttribute("dir",n)),u&&l.setAttribute("style",u),z&&l.setAttribute("class",z),l.append(t.clone(1,1)));k.append(l||t.clone(1,1))}k.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT&&d!=c.length-1&&((n=k.getLast())&&(n.type==CKEDITOR.NODE_ELEMENT&&"_moz"==n.getAttribute("type"))&&n.remove(),(!k.getLast(q)||!(n.type==CKEDITOR.NODE_ELEMENT&&n.getName()in CKEDITOR.dtd.$block))&&k.append(h.createElement("br")));
n=k.$.nodeName.toLowerCase();!CKEDITOR.env.ie&&("div"==n||"p"==n)&&k.appendBogus();g.append(k);a=null;d++}else return null;l=null;if(c.length<=d||Math.max(c[d].indent,0)<m)break}if(j)for(c=g.getFirst();c;){if(c.type==CKEDITOR.NODE_ELEMENT&&(CKEDITOR.dom.element.clearMarkers(j,c),c.getName()in CKEDITOR.dtd.$listItem&&(f=c,h=i=b=void 0,b=f.getDirection()))){for(i=f.getParent();i&&!(h=i.getDirection());)i=i.getParent();b==h&&f.removeAttribute("dir")}c=c.getNextSourceNode()}return{listNode:g,nextIndex:d}}};
var G=/^h[1-6]$/,D=CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);x.prototype={exec:function(c){this.refresh(c,c.elementPath());var j=c.config,f=c.getSelection(),b=f&&f.getRanges(!0);if(this.state==CKEDITOR.TRISTATE_OFF){var i=c.editable();if(i.getFirst(q)){var e=1==b.length&&b[0];(j=e&&e.getEnclosedNode())&&(j.is&&this.type==j.getName())&&this.setState(CKEDITOR.TRISTATE_ON)}else j.enterMode==CKEDITOR.ENTER_BR?i.appendBogus():b[0].fixBlock(1,j.enterMode==CKEDITOR.ENTER_P?"p":"div"),f.selectRanges(b)}for(var j=
f.createBookmarks(!0),i=[],h={},b=b.createIterator(),g=0;(e=b.getNextRange())&&++g;){var a=e.getBoundaryNodes(),d=a.startNode,m=a.endNode;d.type==CKEDITOR.NODE_ELEMENT&&"td"==d.getName()&&e.setStartAt(a.startNode,CKEDITOR.POSITION_AFTER_START);m.type==CKEDITOR.NODE_ELEMENT&&"td"==m.getName()&&e.setEndAt(a.endNode,CKEDITOR.POSITION_BEFORE_END);e=e.createIterator();for(e.forceBrBreak=this.state==CKEDITOR.TRISTATE_OFF;a=e.getNextParagraph();)if(!a.getCustomData("list_block")){CKEDITOR.dom.element.setMarker(h,
a,"list_block",1);for(var k=c.elementPath(a),d=k.elements,m=0,k=k.blockLimit,n,l=d.length-1;0<=l&&(n=d[l]);l--)if(r[n.getName()]&&k.contains(n)){k.removeCustomData("list_group_object_"+g);(d=n.getCustomData("list_group_object"))?d.contents.push(a):(d={root:n,contents:[a]},i.push(d),CKEDITOR.dom.element.setMarker(h,n,"list_group_object",d));m=1;break}m||(m=k,m.getCustomData("list_group_object_"+g)?m.getCustomData("list_group_object_"+g).contents.push(a):(d={root:m,contents:[a]},CKEDITOR.dom.element.setMarker(h,
m,"list_group_object_"+g,d),i.push(d)))}}for(n=[];0<i.length;)if(d=i.shift(),this.state==CKEDITOR.TRISTATE_OFF)if(r[d.root.getName()]){a=c;b=d;d=h;g=n;m=CKEDITOR.plugins.list.listToArray(b.root,d);k=[];for(e=0;e<b.contents.length;e++)if(l=b.contents[e],(l=l.getAscendant("li",!0))&&!l.getCustomData("list_item_processed"))k.push(l),CKEDITOR.dom.element.setMarker(d,l,"list_item_processed",!0);for(var l=b.root.getDocument(),p=void 0,o=void 0,e=0;e<k.length;e++){var s=k[e].getCustomData("listarray_index"),
p=m[s].parent;p.is(this.type)||(o=l.createElement(this.type),p.copyAttributes(o,{start:1,type:1}),o.removeStyle("list-style-type"),m[s].parent=o)}a=CKEDITOR.plugins.list.arrayToList(m,d,null,a.config.enterMode);d=void 0;m=a.listNode.getChildCount();for(e=0;e<m&&(d=a.listNode.getChild(e));e++)d.getName()==this.type&&g.push(d);a.listNode.replace(b.root)}else{m=c;a=d;e=n;k=a.contents;b=a.root.getDocument();g=[];1==k.length&&k[0].equals(a.root)&&(d=b.createElement("div"),k[0].moveChildren&&k[0].moveChildren(d),
k[0].append(d),k[0]=d);a=a.contents[0].getParent();for(l=0;l<k.length;l++)a=a.getCommonAncestor(k[l].getParent());p=m.config.useComputedState;m=d=void 0;p=void 0===p||p;for(l=0;l<k.length;l++)for(o=k[l];s=o.getParent();){if(s.equals(a)){g.push(o);!m&&o.getDirection()&&(m=1);o=o.getDirection(p);null!==d&&(d=d&&d!=o?null:o);break}o=s}if(!(1>g.length)){k=g[g.length-1].getNext();l=b.createElement(this.type);e.push(l);for(p=e=void 0;g.length;)e=g.shift(),p=b.createElement("li"),e.is("pre")||G.test(e.getName())?
e.appendTo(p):(e.copyAttributes(p),d&&e.getDirection()&&(p.removeStyle("direction"),p.removeAttribute("dir")),e.moveChildren(p),e.remove()),p.appendTo(l);d&&m&&l.setAttribute("dir",d);k?l.insertBefore(k):l.appendTo(a)}}else this.state==CKEDITOR.TRISTATE_ON&&r[d.root.getName()]&&C.call(this,c,d,h);for(l=0;l<n.length;l++)A(n[l]);CKEDITOR.dom.element.clearAllMarkers(h);f.selectBookmarks(j);c.focus()},refresh:function(c,j){var f=j.contains(r,1),b=j.blockLimit||j.root;f&&b.contains(f)?this.setState(f.is(this.type)?
CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF):this.setState(CKEDITOR.TRISTATE_OFF)}};CKEDITOR.plugins.add("list",{requires:"indentlist",init:function(c){c.blockless||(c.addCommand("numberedlist",new x("numberedlist","ol")),c.addCommand("bulletedlist",new x("bulletedlist","ul")),c.ui.addButton&&(c.ui.addButton("NumberedList",{label:c.lang.list.numberedlist,command:"numberedlist",directional:!0,toolbar:"list,10"}),c.ui.addButton("BulletedList",{label:c.lang.list.bulletedlist,command:"bulletedlist",directional:!0,
toolbar:"list,20"})),c.on("key",function(j){var f=j.data.keyCode;if(c.mode=="wysiwyg"&&f in{8:1,46:1}){var b=c.getSelection().getRanges()[0],i=b.startPath();if(b.collapsed){var i=new CKEDITOR.dom.elementPath(b.startContainer),e=f==8,h=c.editable(),g=new CKEDITOR.dom.walker(b.clone());g.evaluator=function(a){return q(a)&&!u(a)};g.guard=function(a,b){return!(b&&a.type==CKEDITOR.NODE_ELEMENT&&a.is("table"))};f=b.clone();if(e){var a,d;if((a=i.contains(r))&&b.checkBoundaryOfElement(a,CKEDITOR.START)&&
(a=a.getParent())&&a.is("li")&&(a=w(a))){d=a;a=a.getPrevious(q);f.moveToPosition(a&&u(a)?a:d,CKEDITOR.POSITION_BEFORE_START)}else{g.range.setStartAt(h,CKEDITOR.POSITION_AFTER_START);g.range.setEnd(b.startContainer,b.startOffset);if((a=g.previous())&&a.type==CKEDITOR.NODE_ELEMENT&&(a.getName()in r||a.is("li"))){if(!a.is("li")){g.range.selectNodeContents(a);g.reset();g.evaluator=B;a=g.previous()}d=a;f.moveToElementEditEnd(d)}}if(d){v(c,f,b);j.cancel()}else if((f=i.contains(r))&&b.checkBoundaryOfElement(f,
CKEDITOR.START)){d=f.getFirst(q);if(b.checkBoundaryOfElement(d,CKEDITOR.START)){a=f.getPrevious(q);if(w(d)){if(a){b.moveToElementEditEnd(a);b.select()}}else c.execCommand("outdent");j.cancel()}}}else if(d=i.contains("li")){g.range.setEndAt(h,CKEDITOR.POSITION_BEFORE_END);h=(i=d.getLast(q))&&B(i)?i:d;d=0;if((a=g.next())&&a.type==CKEDITOR.NODE_ELEMENT&&a.getName()in r&&a.equals(i)){d=1;a=g.next()}else b.checkBoundaryOfElement(h,CKEDITOR.END)&&(d=1);if(d&&a){b=b.clone();b.moveToElementEditStart(a);v(c,
f,b);j.cancel()}}else{g.range.setEndAt(h,CKEDITOR.POSITION_BEFORE_END);if((a=g.next())&&a.type==CKEDITOR.NODE_ELEMENT&&a.is(r)){a=a.getFirst(q);if(i.block&&b.checkStartOfBlock()&&b.checkEndOfBlock()){i.block.remove();b.moveToElementEditStart(a);b.select()}else if(w(a)){b.moveToElementEditStart(a);b.select()}else{b=b.clone();b.moveToElementEditStart(a);v(c,f,b)}j.cancel()}}setTimeout(function(){c.selectionChange(1)})}}}))}})})();(function(){CKEDITOR.plugins.liststyle={requires:"dialog,contextmenu",init:function(a){if(!a.blockless){var b;b=new CKEDITOR.dialogCommand("numberedListStyle",{requiredContent:"ol",allowedContent:"ol{list-style-type}[start]"});b=a.addCommand("numberedListStyle",b);a.addFeature(b);CKEDITOR.dialog.add("numberedListStyle",this.path+"dialogs/liststyle.js");b=new CKEDITOR.dialogCommand("bulletedListStyle",{requiredContent:"ul",allowedContent:"ul{list-style-type}"});b=a.addCommand("bulletedListStyle",b);
a.addFeature(b);CKEDITOR.dialog.add("bulletedListStyle",this.path+"dialogs/liststyle.js");a.addMenuGroup("list",108);a.addMenuItems({numberedlist:{label:a.lang.liststyle.numberedTitle,group:"list",command:"numberedListStyle"},bulletedlist:{label:a.lang.liststyle.bulletedTitle,group:"list",command:"bulletedListStyle"}});a.contextMenu.addListener(function(a){if(!a||a.isReadOnly())return null;for(;a;){var b=a.getName();if("ol"==b)return{numberedlist:CKEDITOR.TRISTATE_OFF};if("ul"==b)return{bulletedlist:CKEDITOR.TRISTATE_OFF};
a=a.getParent()}return null})}}};CKEDITOR.plugins.add("liststyle",CKEDITOR.plugins.liststyle)})();(function(){function O(a,b,d){return m(b)&&m(d)&&d.equals(b.getNext(function(a){return!(z(a)||A(a)||p(a))}))}function u(a){this.upper=a[0];this.lower=a[1];this.set.apply(this,a.slice(2))}function I(a){var b=a.element,d;return b&&m(b)?(d=b.getAscendant(a.triggers,!0))&&!d.contains(a.editable)&&!d.equals(a.editable)?d:null:null}function ca(a,b,d){o(a,b);o(a,d);a=b.size.bottom;d=d.size.top;return a&&d?0|(a+d)/2:a||d}function r(a,b,d){return b=b[d?"getPrevious":"getNext"](function(b){return b&&b.type==
CKEDITOR.NODE_TEXT&&!z(b)||m(b)&&!p(b)&&!v(a,b)})}function da(a){var b=a.doc,d=B('<span contenteditable="false" style="'+J+"position:absolute;border-top:1px dashed "+a.boxColor+'"></span>',b),e=this.path+"images/"+(n.hidpi?"hidpi/":"")+"icon.png";q(d,{attach:function(){this.wrap.getParent()||this.wrap.appendTo(a.editable,!0);return this},lineChildren:[q(B('<span title="'+a.editor.lang.magicline.title+'" contenteditable="false">&#8629;</span>',b),{base:J+"height:17px;width:17px;"+(a.rtl?"left":"right")+
":17px;background:url("+e+") center no-repeat "+a.boxColor+";cursor:pointer;"+(n.hc?"font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;":"")+(n.hidpi?"background-size: 9px 10px;":""),looks:["top:-8px;"+CKEDITOR.tools.cssVendorPrefix("border-radius","2px",1),"top:-17px;"+CKEDITOR.tools.cssVendorPrefix("border-radius","2px 2px 0px 0px",1),"top:-1px;"+CKEDITOR.tools.cssVendorPrefix("border-radius","0px 0px 2px 2px",1)]}),q(B(P,b),{base:Q+"left:0px;border-left-color:"+a.boxColor+
";",looks:["border-width:8px 0 8px 8px;top:-8px","border-width:8px 0 0 8px;top:-8px","border-width:0 0 8px 8px;top:0px"]}),q(B(P,b),{base:Q+"right:0px;border-right-color:"+a.boxColor+";",looks:["border-width:8px 8px 8px 0;top:-8px","border-width:8px 8px 0 0;top:-8px","border-width:0 8px 8px 0;top:0px"]})],detach:function(){this.wrap.getParent()&&this.wrap.remove();return this},mouseNear:function(){o(a,this);var b=a.holdDistance,c=this.size;return c&&a.mouse.y>c.top-b&&a.mouse.y<c.bottom+b&&a.mouse.x>
c.left-b&&a.mouse.x<c.right+b?!0:!1},place:function(){var b=a.view,c=a.editable,d=a.trigger,e=d.upper,g=d.lower,i=e||g,l=i.getParent(),k={};this.trigger=d;e&&o(a,e,!0);g&&o(a,g,!0);o(a,l,!0);a.inInlineMode&&C(a,!0);l.equals(c)?(k.left=b.scroll.x,k.right=-b.scroll.x,k.width=""):(k.left=i.size.left-i.size.margin.left+b.scroll.x-(a.inInlineMode?b.editable.left+b.editable.border.left:0),k.width=i.size.outerWidth+i.size.margin.left+i.size.margin.right+b.scroll.x,k.right="");e&&g?k.top=e.size.margin.bottom===
g.size.margin.top?0|e.size.bottom+e.size.margin.bottom/2:e.size.margin.bottom<g.size.margin.top?e.size.bottom+e.size.margin.bottom:e.size.bottom+e.size.margin.bottom-g.size.margin.top:e?g||(k.top=e.size.bottom+e.size.margin.bottom):k.top=g.size.top-g.size.margin.top;d.is(x)||k.top>b.scroll.y-15&&k.top<b.scroll.y+5?(k.top=a.inInlineMode?0:b.scroll.y,this.look(x)):d.is(y)||k.top>b.pane.bottom-5&&k.top<b.pane.bottom+15?(k.top=a.inInlineMode?b.editable.height+b.editable.padding.top+b.editable.padding.bottom:
b.pane.bottom-1,this.look(y)):(a.inInlineMode&&(k.top-=b.editable.top+b.editable.border.top),this.look(s));a.inInlineMode&&(k.top--,k.top+=b.editable.scroll.top,k.left+=b.editable.scroll.left);for(var R in k)k[R]=CKEDITOR.tools.cssLength(k[R]);this.setStyles(k)},look:function(a){if(this.oldLook!=a){for(var b=this.lineChildren.length,d;b--;)(d=this.lineChildren[b]).setAttribute("style",d.base+d.looks[0|a/2]);this.oldLook=a}},wrap:new K("span",a.doc)});for(b=d.lineChildren.length;b--;)d.lineChildren[b].appendTo(d);
d.look(s);d.appendTo(d.wrap);d.unselectable();d.lineChildren[0].on("mouseup",function(b){d.detach();L(a,function(b){var d=a.line.trigger;b[d.is(D)?"insertBefore":"insertAfter"](d.is(D)?d.lower:d.upper)},!0);a.editor.focus();!n.ie&&a.enterMode!=CKEDITOR.ENTER_BR&&a.hotNode.scrollIntoView();b.data.preventDefault(!0)});d.on("mousedown",function(a){a.data.preventDefault(!0)});a.line=d}function L(a,b,d){var e=new CKEDITOR.dom.range(a.doc),f=a.editor,c;n.ie&&a.enterMode==CKEDITOR.ENTER_BR?c=a.doc.createText(E):
(c=new K(a.enterBehavior,a.doc),a.enterMode!=CKEDITOR.ENTER_BR&&a.doc.createText(E).appendTo(c));d&&f.fire("saveSnapshot");b(c);e.moveToPosition(c,CKEDITOR.POSITION_AFTER_START);f.getSelection().selectRanges([e]);a.hotNode=c;d&&f.fire("saveSnapshot")}function S(a,b){return{canUndo:!0,modes:{wysiwyg:1},exec:function(){function d(d){var f=n.ie&&9>n.version?" ":E,c=a.hotNode&&a.hotNode.getText()==f&&a.element.equals(a.hotNode)&&a.lastCmdDirection===!!b;L(a,function(f){c&&a.hotNode&&a.hotNode.remove();
f[b?"insertAfter":"insertBefore"](d);f.setAttributes({"data-cke-magicline-hot":1,"data-cke-magicline-dir":!!b});a.lastCmdDirection=!!b});!n.ie&&a.enterMode!=CKEDITOR.ENTER_BR&&a.hotNode.scrollIntoView();a.line.detach()}return function(e){e=e.getSelection().getStartElement();if((e=e.getAscendant(T,1))&&!e.equals(a.editable)&&!e.contains(a.editable)){a.element=e;var f=r(a,e,!b),c;m(f)&&f.is(a.triggers)&&f.is(ea)&&(!r(a,f,!b)||(c=r(a,f,!b))&&m(c)&&c.is(a.triggers))?d(f):(c=I(a,e),m(c)&&(r(a,c,!b)?(e=
r(a,c,!b))&&(m(e)&&e.is(a.triggers))&&d(c):d(c)))}}}()}}function v(a,b){if(!b||!(b.type==CKEDITOR.NODE_ELEMENT&&b.$))return!1;var d=a.line;return d.wrap.equals(b)||d.wrap.contains(b)}function m(a){return a&&a.type==CKEDITOR.NODE_ELEMENT&&a.$}function p(a){if(!m(a))return!1;var b;if(!(b=U(a)))m(a)?(b={left:1,right:1,center:1},b=!(!b[a.getComputedStyle("float")]&&!b[a.getAttribute("align")])):b=!1;return b}function U(a){return!!{absolute:1,fixed:1,relative:1}[a.getComputedStyle("position")]}function F(a,
b){return m(b)?b.is(a.triggers):null}function fa(a,b,d){b=b[d?"getLast":"getFirst"](function(b){return a.isRelevant(b)&&!b.is(ga)});if(!b)return!1;o(a,b);return d?b.size.top>a.mouse.y:b.size.bottom<a.mouse.y}function V(a){var b=a.editable,d=a.mouse,e=a.view,f=a.triggerOffset;C(a);var c=d.y>(a.inInlineMode?e.editable.top+e.editable.height/2:Math.min(e.editable.height,e.pane.height)/2),b=b[c?"getLast":"getFirst"](function(a){return!(z(a)||A(a))});if(!b)return null;v(a,b)&&(b=a.line.wrap[c?"getPrevious":
"getNext"](function(a){return!(z(a)||A(a))}));if(!m(b)||p(b)||!F(a,b))return null;o(a,b);return!c&&0<=b.size.top&&0<d.y&&d.y<b.size.top+f?(a=a.inInlineMode||0===e.scroll.y?x:s,new u([null,b,D,G,a])):c&&b.size.bottom<=e.pane.height&&d.y>b.size.bottom-f&&d.y<e.pane.height?(a=a.inInlineMode||b.size.bottom>e.pane.height-f&&b.size.bottom<e.pane.height?y:s,new u([b,null,W,G,a])):null}function X(a){var b=a.mouse,d=a.view,e=a.triggerOffset,f=I(a);if(!f)return null;o(a,f);var e=Math.min(e,0|f.size.outerHeight/
2),c=[],h,j;if(b.y>f.size.top-1&&b.y<f.size.top+e)j=!1;else if(b.y>f.size.bottom-e&&b.y<f.size.bottom+1)j=!0;else return null;if(p(f)||fa(a,f,j)||f.getParent().is(Y))return null;var g=r(a,f,!j);if(g){if(g&&g.type==CKEDITOR.NODE_TEXT)return null;if(m(g)){if(p(g)||!F(a,g)||g.getParent().is(Y))return null;c=[g,f][j?"reverse":"concat"]().concat([M,G])}}else f.equals(a.editable[j?"getLast":"getFirst"](a.isRelevant))?(C(a),j&&b.y>f.size.bottom-e&&b.y<d.pane.height&&f.size.bottom>d.pane.height-e&&f.size.bottom<
d.pane.height?h=y:0<b.y&&b.y<f.size.top+e&&(h=x)):h=s,c=[null,f][j?"reverse":"concat"]().concat([j?W:D,G,h,f.equals(a.editable[j?"getLast":"getFirst"](a.isRelevant))?j?y:x:s]);return 0 in c?new u(c):null}function N(a,b,d,e){for(var f=function(){var d=n.ie?b.$.currentStyle:a.win.$.getComputedStyle(b.$,"");return n.ie?function(a){return d[CKEDITOR.tools.cssStyleToDomStyle(a)]}:function(a){return d.getPropertyValue(a)}}(),c=b.getDocumentPosition(),h={},j={},g={},i={},l=t.length;l--;)h[t[l]]=parseInt(f("border-"+
t[l]+"-width"),10)||0,g[t[l]]=parseInt(f("padding-"+t[l]),10)||0,j[t[l]]=parseInt(f("margin-"+t[l]),10)||0;(!d||e)&&H(a,e);i.top=c.y-(d?0:a.view.scroll.y);i.left=c.x-(d?0:a.view.scroll.x);i.outerWidth=b.$.offsetWidth;i.outerHeight=b.$.offsetHeight;i.height=i.outerHeight-(g.top+g.bottom+h.top+h.bottom);i.width=i.outerWidth-(g.left+g.right+h.left+h.right);i.bottom=i.top+i.outerHeight;i.right=i.left+i.outerWidth;a.inInlineMode&&(i.scroll={top:b.$.scrollTop,left:b.$.scrollLeft});return q({border:h,padding:g,
margin:j,ignoreScroll:d},i,!0)}function o(a,b,d){if(!m(b))return b.size=null;if(b.size){if(b.size.ignoreScroll==d&&b.size.date>new Date-Z)return null}else b.size={};return q(b.size,N(a,b,d),{date:+new Date},!0)}function C(a,b){a.view.editable=N(a,a.editable,b,!0)}function H(a,b){a.view||(a.view={});var d=a.view;if(b||!(d&&d.date>new Date-Z)){var e=a.win,d=e.getScrollPosition(),e=e.getViewPaneSize();q(a.view,{scroll:{x:d.x,y:d.y,width:a.doc.$.documentElement.scrollWidth-e.width,height:a.doc.$.documentElement.scrollHeight-
e.height},pane:{width:e.width,height:e.height,bottom:e.height+d.y},date:+new Date},!0)}}function ha(a,b,d,e){for(var f=e,c=e,h=0,j=!1,g=!1,i=a.view.pane.height,l=a.mouse;l.y+h<i&&0<l.y-h;){j||(j=b(f,e));g||(g=b(c,e));!j&&0<l.y-h&&(f=d(a,{x:l.x,y:l.y-h}));!g&&l.y+h<i&&(c=d(a,{x:l.x,y:l.y+h}));if(j&&g)break;h+=2}return new u([f,c,null,null])}CKEDITOR.plugins.add("magicline",{init:function(a){var b={};b[CKEDITOR.ENTER_BR]="br";b[CKEDITOR.ENTER_P]="p";b[CKEDITOR.ENTER_DIV]="div";var d=a.config,e=d.magicline_triggerOffset||
30,f=d.enterMode,c={editor:a,enterBehavior:b[f],enterMode:f,triggerOffset:e,holdDistance:0|e*(d.magicline_holdDistance||0.5),boxColor:d.magicline_color||"#ff0000",rtl:"rtl"==d.contentsLangDirection,triggers:d.magicline_everywhere?T:{table:1,hr:1,div:1,ul:1,ol:1,dl:1,form:1,blockquote:1}},h,j,g;c.isRelevant=function(a){return m(a)&&!v(c,a)&&!p(a)};a.on("contentDom",function(){var b=a.editable(),e=a.document,f=a.window;q(c,{editable:b,inInlineMode:b.isInline(),doc:e,win:f},!0);c.boundary=c.inInlineMode?
c.editable:c.doc.getDocumentElement();b.is(w.$inline)||(c.inInlineMode&&!U(b)&&b.setStyles({position:"relative",top:null,left:null}),da.call(this,c),H(c),b.attachListener(a,"beforeUndoImage",function(){c.line.detach()}),b.attachListener(a,"beforeGetData",function(){c.line.wrap.getParent()&&(c.line.detach(),a.once("getData",function(){c.line.attach()},null,null,1E3))},null,null,0),b.attachListener(c.inInlineMode?e:e.getWindow().getFrame(),"mouseout",function(b){if("wysiwyg"==a.mode)if(c.inInlineMode){var d=
b.data.$.clientX,b=b.data.$.clientY;H(c);C(c,!0);var e=c.view.editable,f=c.view.scroll;if(!(d>e.left-f.x&&d<e.right-f.x)||!(b>e.top-f.y&&b<e.bottom-f.y))clearTimeout(g),g=null,c.line.detach()}else clearTimeout(g),g=null,c.line.detach()}),b.attachListener(b,"keyup",function(){c.hiddenMode=0}),b.attachListener(b,"keydown",function(b){if("wysiwyg"==a.mode)switch(b=b.data.getKeystroke(),a.getSelection().getStartElement(),b){case 2228240:case 16:c.hiddenMode=1,c.line.detach()}}),b.attachListener(c.inInlineMode?
b:e,"mousemove",function(b){j=!0;if(!("wysiwyg"!=a.mode||a.readOnly||g)){var d={x:b.data.$.clientX,y:b.data.$.clientY};g=setTimeout(function(){c.mouse=d;g=c.trigger=null;H(c);if(j&&!c.hiddenMode&&a.focusManager.hasFocus&&!c.line.mouseNear()&&(c.element=$(c,!0)))(c.trigger=V(c)||X(c)||aa(c))?c.line.attach().place():(c.trigger=null,c.line.detach()),j=!1},30)}}),b.attachListener(f,"scroll",function(){"wysiwyg"==a.mode&&(c.line.detach(),n.webkit&&(c.hiddenMode=1,clearTimeout(h),h=setTimeout(function(){c.hiddenMode=
0},50)))}),b.attachListener(f,"mousedown",function(){"wysiwyg"==a.mode&&(c.line.detach(),c.hiddenMode=1)}),b.attachListener(f,"mouseup",function(){c.hiddenMode=0}),a.addCommand("accessPreviousSpace",S(c)),a.addCommand("accessNextSpace",S(c,!0)),a.setKeystroke([[d.magicline_keystrokePrevious,"accessPreviousSpace"],[d.magicline_keystrokeNext,"accessNextSpace"]]),a.on("loadSnapshot",function(){for(var b=a.document.getElementsByTag(c.enterBehavior),d,e=b.count();e--;)if((d=b.getItem(e)).hasAttribute("data-cke-magicline-hot")){c.hotNode=
d;c.lastCmdDirection="true"===d.getAttribute("data-cke-magicline-dir")?!0:!1;break}}),this.backdoor={accessFocusSpace:L,boxTrigger:u,isLine:v,getAscendantTrigger:I,getNonEmptyNeighbour:r,getSize:N,that:c,triggerEdge:X,triggerEditable:V,triggerExpand:aa})},this)}});var q=CKEDITOR.tools.extend,K=CKEDITOR.dom.element,B=K.createFromHtml,n=CKEDITOR.env,w=CKEDITOR.dtd,D=128,W=64,M=32,G=16,ba=8,x=4,y=2,s=1,E=" ",Y=w.$listItem,ga=w.$tableContent,ea=q({},w.$nonEditable,w.$empty),T=w.$block,Z=100,J="width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
Q=J+"border-color:transparent;display:block;border-style:solid;",P="<span>"+E+"</span>";u.prototype={set:function(a,b,d){this.properties=a+b+(d||s);return this},is:function(a){return(this.properties&a)==a}};var $=function(){return function(a,b,d){if(!a.mouse)return null;var e=a.doc,f=a.line.wrap,d=d||a.mouse,c=new CKEDITOR.dom.element(e.$.elementFromPoint(d.x,d.y));b&&v(a,c)&&(f.hide(),c=new CKEDITOR.dom.element(e.$.elementFromPoint(d.x,d.y)),f.show());return!c||!(c.type==CKEDITOR.NODE_ELEMENT&&c.$)||
n.ie&&9>n.version&&!a.boundary.equals(c)&&!a.boundary.contains(c)?null:c}}(),z=CKEDITOR.dom.walker.whitespaces(),A=CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),aa=function(){function a(a){var e=a.element,f,c,h;if(!m(e)||e.contains(a.editable))return null;h=ha(a,function(a,b){return!b.equals(a)},function(a,b){return $(a,!0,b)},e);f=h.upper;c=h.lower;if(O(a,f,c))return h.set(M,ba);if(f&&e.contains(f))for(;!f.getParent().equals(e);)f=f.getParent();else f=e.getFirst(function(c){return b(a,c)});
if(c&&e.contains(c))for(;!c.getParent().equals(e);)c=c.getParent();else c=e.getLast(function(c){return b(a,c)});if(!f||!c)return null;o(a,f);o(a,c);if(!(a.mouse.y>f.size.top&&a.mouse.y<c.size.bottom))return null;for(var e=Number.MAX_VALUE,j,g,i,l;c&&!c.equals(f)&&(g=f.getNext(a.isRelevant));)j=Math.abs(ca(a,f,g)-a.mouse.y),j<e&&(e=j,i=f,l=g),f=g,o(a,f);if(!i||!l||!(a.mouse.y>i.size.top&&a.mouse.y<l.size.bottom))return null;h.upper=i;h.lower=l;return h.set(M,ba)}function b(a,b){return!(b&&b.type==
CKEDITOR.NODE_TEXT||A(b)||p(b)||v(a,b)||b.type==CKEDITOR.NODE_ELEMENT&&b.$&&b.is("br"))}return function(b){var e=a(b),f;if(f=e){f=e.upper;var c=e.lower;f=!f||!c||p(c)||p(f)||c.equals(f)||f.equals(c)||c.contains(f)||f.contains(c)?!1:F(b,f)&&F(b,c)&&O(b,f,c)?!0:!1}return f?e:null}}(),t=["top","left","right","bottom"]})();CKEDITOR.config.magicline_keystrokePrevious=CKEDITOR.CTRL+CKEDITOR.SHIFT+219;CKEDITOR.config.magicline_keystrokeNext=CKEDITOR.CTRL+CKEDITOR.SHIFT+221;(function(){function l(a){if(!a||a.type!=CKEDITOR.NODE_ELEMENT||"form"!=a.getName())return[];for(var e=[],f=["style","className"],b=0;b<f.length;b++){var d=a.$.elements.namedItem(f[b]);d&&(d=new CKEDITOR.dom.element(d),e.push([d,d.nextSibling]),d.remove())}return e}function o(a,e){if(a&&!(a.type!=CKEDITOR.NODE_ELEMENT||"form"!=a.getName())&&0<e.length)for(var f=e.length-1;0<=f;f--){var b=e[f][0],d=e[f][1];d?b.insertBefore(d):b.appendTo(a)}}function n(a,e){var f=l(a),b={},d=a.$;e||(b["class"]=d.className||
"",d.className="");b.inline=d.style.cssText||"";e||(d.style.cssText="position: static; overflow: visible");o(f);return b}function p(a,e){var f=l(a),b=a.$;"class"in e&&(b.className=e["class"]);"inline"in e&&(b.style.cssText=e.inline);o(f)}function q(a){if(!a.editable().isInline()){var e=CKEDITOR.instances,f;for(f in e){var b=e[f];"wysiwyg"==b.mode&&!b.readOnly&&(b=b.document.getBody(),b.setAttribute("contentEditable",!1),b.setAttribute("contentEditable",!0))}a.editable().hasFocus&&(a.toolbox.focus(),
a.focus())}}CKEDITOR.plugins.add("maximize",{init:function(a){function e(){var b=d.getViewPaneSize();a.resize(b.width,b.height,null,!0)}if(a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE){var f=a.lang,b=CKEDITOR.document,d=b.getWindow(),j,k,m,l=CKEDITOR.TRISTATE_OFF;a.addCommand("maximize",{modes:{wysiwyg:!CKEDITOR.env.iOS,source:!CKEDITOR.env.iOS},readOnly:1,editorFocus:!1,exec:function(){var h=a.container.getChild(1),g=a.ui.space("contents");if("wysiwyg"==a.mode){var c=a.getSelection();j=c&&c.getRanges();
k=d.getScrollPosition()}else{var i=a.editable().$;j=!CKEDITOR.env.ie&&[i.selectionStart,i.selectionEnd];k=[i.scrollLeft,i.scrollTop]}if(this.state==CKEDITOR.TRISTATE_OFF){d.on("resize",e);m=d.getScrollPosition();for(c=a.container;c=c.getParent();)c.setCustomData("maximize_saved_styles",n(c)),c.setStyle("z-index",a.config.baseFloatZIndex-5);g.setCustomData("maximize_saved_styles",n(g,!0));h.setCustomData("maximize_saved_styles",n(h,!0));g={overflow:CKEDITOR.env.webkit?"":"hidden",width:0,height:0};
b.getDocumentElement().setStyles(g);!CKEDITOR.env.gecko&&b.getDocumentElement().setStyle("position","fixed");(!CKEDITOR.env.gecko||!CKEDITOR.env.quirks)&&b.getBody().setStyles(g);CKEDITOR.env.ie?setTimeout(function(){d.$.scrollTo(0,0)},0):d.$.scrollTo(0,0);h.setStyle("position",CKEDITOR.env.gecko&&CKEDITOR.env.quirks?"fixed":"absolute");h.$.offsetLeft;h.setStyles({"z-index":a.config.baseFloatZIndex-5,left:"0px",top:"0px"});h.addClass("cke_maximized");e();g=h.getDocumentPosition();h.setStyles({left:-1*
g.x+"px",top:-1*g.y+"px"});CKEDITOR.env.gecko&&q(a)}else if(this.state==CKEDITOR.TRISTATE_ON){d.removeListener("resize",e);g=[g,h];for(c=0;c<g.length;c++)p(g[c],g[c].getCustomData("maximize_saved_styles")),g[c].removeCustomData("maximize_saved_styles");for(c=a.container;c=c.getParent();)p(c,c.getCustomData("maximize_saved_styles")),c.removeCustomData("maximize_saved_styles");CKEDITOR.env.ie?setTimeout(function(){d.$.scrollTo(m.x,m.y)},0):d.$.scrollTo(m.x,m.y);h.removeClass("cke_maximized");CKEDITOR.env.webkit&&
(h.setStyle("display","inline"),setTimeout(function(){h.setStyle("display","block")},0));a.fire("resize")}this.toggleState();if(c=this.uiItems[0])g=this.state==CKEDITOR.TRISTATE_OFF?f.maximize.maximize:f.maximize.minimize,c=CKEDITOR.document.getById(c._.id),c.getChild(1).setHtml(g),c.setAttribute("title",g),c.setAttribute("href",'javascript:void("'+g+'");');"wysiwyg"==a.mode?j?(CKEDITOR.env.gecko&&q(a),a.getSelection().selectRanges(j),(i=a.getSelection().getStartElement())&&i.scrollIntoView(!0)):
d.$.scrollTo(k.x,k.y):(j&&(i.selectionStart=j[0],i.selectionEnd=j[1]),i.scrollLeft=k[0],i.scrollTop=k[1]);j=k=null;l=this.state;a.fire("maximize",this.state)},canUndo:!1});a.ui.addButton&&a.ui.addButton("Maximize",{label:f.maximize.maximize,command:"maximize",toolbar:"tools,10"});a.on("mode",function(){var b=a.getCommand("maximize");b.setState(b.state==CKEDITOR.TRISTATE_DISABLED?CKEDITOR.TRISTATE_DISABLED:l)},null,null,100)}}})})();CKEDITOR.plugins.add("newpage",{init:function(a){a.addCommand("newpage",{modes:{wysiwyg:1,source:1},exec:function(b){var a=this;b.setData(b.config.newpage_html||"",function(){b.focus();setTimeout(function(){b.fire("afterCommandExec",{name:"newpage",command:a});b.selectionChange()},200)})},async:!0});a.ui.addButton&&a.ui.addButton("NewPage",{label:a.lang.newpage.toolbar,command:"newpage",toolbar:"document,20"})}});CKEDITOR.plugins.add("pagebreak",{requires:"fakeobjects",onLoad:function(){var a=["{","background: url("+CKEDITOR.getUrl(this.path+"images/pagebreak.gif")+") no-repeat center center;","clear: both;width:100%; _width:99.9%;border-top: #999999 1px dotted;border-bottom: #999999 1px dotted;padding:0;height: 5px;cursor: default;}"].join("").replace(/;/g," !important;");CKEDITOR.addCss("div.cke_pagebreak"+a)},init:function(a){a.blockless||(a.addCommand("pagebreak",CKEDITOR.plugins.pagebreakCmd),a.ui.addButton&&
a.ui.addButton("PageBreak",{label:a.lang.pagebreak.toolbar,command:"pagebreak",toolbar:"insert,70"}),CKEDITOR.env.opera&&a.on("contentDom",function(){a.document.on("click",function(b){b=b.data.getTarget();b.is("div")&&b.hasClass("cke_pagebreak")&&a.getSelection().selectElement(b)})}))},afterInit:function(a){var b=a.lang.pagebreak.alt,c=a.dataProcessor,a=c&&c.dataFilter;(c=c&&c.htmlFilter)&&c.addRules({attributes:{"class":function(a,b){var c=a.replace("cke_pagebreak","");if(c!=a){var d=CKEDITOR.htmlParser.fragment.fromHtml('<span style="display: none;">&nbsp;</span>').children[0];
b.children.length=0;b.add(d);d=b.attributes;delete d["aria-label"];delete d.contenteditable;delete d.title}return c}}},5);a&&a.addRules({elements:{div:function(a){var c=a.attributes,e=c&&c.style,d=e&&1==a.children.length&&a.children[0];if((d=d&&"span"==d.name&&d.attributes.style)&&/page-break-after\s*:\s*always/i.test(e)&&/display\s*:\s*none/i.test(d))c.contenteditable="false",c["class"]="cke_pagebreak",c["data-cke-display-name"]="pagebreak",c["aria-label"]=b,c.title=b,a.children.length=0}}})}});
CKEDITOR.plugins.pagebreakCmd={exec:function(a){var b=a.lang.pagebreak.alt,b=CKEDITOR.dom.element.createFromHtml('<div style="page-break-after: always;"contenteditable="false" title="'+b+'" aria-label="'+b+'" data-cke-display-name="pagebreak" class="cke_pagebreak"></div>',a.document);a.insertElement(b)},context:"div",allowedContent:{div:{styles:"!page-break-after"},span:{match:function(a){return(a=a.parent)&&"div"==a.name&&a.styles["page-break-after"]},styles:"display"}},requiredContent:"div{page-break-after}"};(function(){var c={canUndo:!1,async:!0,exec:function(a){a.getClipboardData({title:a.lang.pastetext.title},function(b){b&&a.fire("paste",{type:"text",dataValue:b.dataValue});a.fire("afterCommandExec",{name:"pastetext",command:c,returnValue:!!b})})}};CKEDITOR.plugins.add("pastetext",{requires:"clipboard",init:function(a){a.addCommand("pastetext",c);a.ui.addButton&&a.ui.addButton("PasteText",{label:a.lang.pastetext.button,command:"pastetext",toolbar:"clipboard,40"});if(a.config.forcePasteAsPlainText)a.on("beforePaste",
function(a){"html"!=a.data.type&&(a.data.type="text")});a.on("pasteState",function(b){a.getCommand("pastetext").setState(b.data)})}})})();(function(){function h(a,d,f){var b=CKEDITOR.cleanWord;b?f():(a=CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile||d+"filter/default.js"),CKEDITOR.scriptLoader.load(a,f,null,!0));return!b}function i(a){a.data.type="html"}CKEDITOR.plugins.add("pastefromword",{requires:"clipboard",init:function(a){var d=0,f=this.path;a.addCommand("pastefromword",{canUndo:!1,async:!0,exec:function(a){var e=this;d=1;a.once("beforePaste",i);a.getClipboardData({title:a.lang.pastefromword.title},function(c){c&&a.fire("paste",
{type:"html",dataValue:c.dataValue});a.fire("afterCommandExec",{name:"pastefromword",command:e,returnValue:!!c})})}});a.ui.addButton&&a.ui.addButton("PasteFromWord",{label:a.lang.pastefromword.toolbar,command:"pastefromword",toolbar:"clipboard,50"});a.on("pasteState",function(b){a.getCommand("pastefromword").setState(b.data)});a.on("paste",function(b){var e=b.data,c=e.dataValue;if(c&&(d||/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(c))){var g=h(a,f,function(){if(g)a.fire("paste",e);
else if(!a.config.pasteFromWordPromptCleanup||d||confirm(a.lang.pastefromword.confirmCleanup))e.dataValue=CKEDITOR.cleanWord(c,a)});g&&b.cancel()}},null,null,3)}})})();(function(){var h,i={modes:{wysiwyg:1,source:1},canUndo:!1,readOnly:1,exec:function(a){var g,b=a.config,e=b.baseHref?'<base href="'+b.baseHref+'"/>':"";if(b.fullPage)g=a.getData().replace(/<head>/,"$&"+e).replace(/[^>]*(?=<\/title>)/,"$& &mdash; "+a.lang.preview.preview);else{var b="<body ",d=a.document&&a.document.getBody();d&&(d.getAttribute("id")&&(b+='id="'+d.getAttribute("id")+'" '),d.getAttribute("class")&&(b+='class="'+d.getAttribute("class")+'" '));g=a.config.docType+'<html dir="'+a.config.contentsLangDirection+
'"><head>'+e+"<title>"+a.lang.preview.preview+"</title>"+CKEDITOR.tools.buildStyleHtml(a.config.contentsCss)+"</head>"+(b+">")+a.getData()+"</body></html>"}e=640;b=420;d=80;try{var c=window.screen,e=Math.round(0.8*c.width),b=Math.round(0.7*c.height),d=Math.round(0.1*c.width)}catch(i){}if(!a.fire("contentPreview",a={dataValue:g}))return!1;c="";CKEDITOR.env.ie&&(window._cke_htmlToLoad=a.dataValue,c="javascript:void( (function(){document.open();"+("("+CKEDITOR.tools.fixDomain+")();").replace(/\/\/.*?\n/g,
"").replace(/parent\./g,"window.opener.")+"document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )");CKEDITOR.env.gecko&&(window._cke_htmlToLoad=a.dataValue,c=h+"preview.html");c=window.open(c,null,"toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width="+e+",height="+b+",left="+d);if(!CKEDITOR.env.ie&&!CKEDITOR.env.gecko){var f=c.document;f.open();f.write(a.dataValue);f.close();CKEDITOR.env.webkit&&setTimeout(function(){f.body.innerHTML=
f.body.innerHTML+""},0)}return!0}};CKEDITOR.plugins.add("preview",{init:function(a){a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE&&(h=this.path,a.addCommand("preview",i),a.ui.addButton&&a.ui.addButton("Preview",{label:a.lang.preview.preview,command:"preview",toolbar:"document,40"}))}})})();CKEDITOR.plugins.add("print",{init:function(a){a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE&&(a.addCommand("print",CKEDITOR.plugins.print),a.ui.addButton&&a.ui.addButton("Print",{label:a.lang.print.toolbar,command:"print",toolbar:"document,50"}))}});CKEDITOR.plugins.print={exec:function(a){CKEDITOR.env.opera||(CKEDITOR.env.gecko?a.window.$.print():a.document.$.execCommand("Print"))},canUndo:!1,readOnly:1,modes:{wysiwyg:!CKEDITOR.env.opera}};CKEDITOR.plugins.add("removeformat",{init:function(a){a.addCommand("removeFormat",CKEDITOR.plugins.removeformat.commands.removeformat);a.ui.addButton&&a.ui.addButton("RemoveFormat",{label:a.lang.removeformat.toolbar,command:"removeFormat",toolbar:"cleanup,10"})}});
CKEDITOR.plugins.removeformat={commands:{removeformat:{exec:function(a){for(var h=a._.removeFormatRegex||(a._.removeFormatRegex=RegExp("^(?:"+a.config.removeFormatTags.replace(/,/g,"|")+")$","i")),e=a._.removeAttributes||(a._.removeAttributes=a.config.removeFormatAttributes.split(",")),f=CKEDITOR.plugins.removeformat.filter,k=a.getSelection().getRanges(1),l=k.createIterator(),c;c=l.getNextRange();){c.collapsed||c.enlarge(CKEDITOR.ENLARGE_ELEMENT);var i=c.createBookmark(),b=i.startNode,j=i.endNode,
d=function(b){for(var c=a.elementPath(b),e=c.elements,d=1,g;(g=e[d])&&!g.equals(c.block)&&!g.equals(c.blockLimit);d++)h.test(g.getName())&&f(a,g)&&b.breakParent(g)};d(b);if(j){d(j);for(b=b.getNextSourceNode(!0,CKEDITOR.NODE_ELEMENT);b&&!b.equals(j);)d=b.getNextSourceNode(!1,CKEDITOR.NODE_ELEMENT),!("img"==b.getName()&&b.data("cke-realelement"))&&f(a,b)&&(h.test(b.getName())?b.remove(1):(b.removeAttributes(e),a.fire("removeFormatCleanup",b))),b=d}c.moveToBookmark(i)}a.forceNextSelectionCheck();a.getSelection().selectRanges(k)}}},
filter:function(a,h){for(var e=a._.removeFormatFilters||[],f=0;f<e.length;f++)if(!1===e[f](h))return!1;return!0}};CKEDITOR.editor.prototype.addRemoveFormatFilter=function(a){this._.removeFormatFilters||(this._.removeFormatFilters=[]);this._.removeFormatFilters.push(a)};CKEDITOR.config.removeFormatTags="b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var";CKEDITOR.config.removeFormatAttributes="class,style,lang,width,height,align,hspace,valign";(function(){var b={readOnly:1,exec:function(a){if(a.fire("save")&&(a=a.element.$.form))try{a.submit()}catch(b){a.submit.click&&a.submit.click()}}};CKEDITOR.plugins.add("save",{init:function(a){a.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE&&(a.addCommand("save",b).modes={wysiwyg:!!a.element.$.form},a.ui.addButton&&a.ui.addButton("Save",{label:a.lang.save.toolbar,command:"save",toolbar:"document,10"}))}})})();(function(){CKEDITOR.plugins.add("selectall",{init:function(b){b.addCommand("selectAll",{modes:{wysiwyg:1,source:1},exec:function(a){var b=a.editable();if(b.is("textarea"))a=b.$,CKEDITOR.env.ie?a.createTextRange().execCommand("SelectAll"):(a.selectionStart=0,a.selectionEnd=a.value.length),a.focus();else{if(b.is("body"))a.document.$.execCommand("SelectAll",!1,null);else{var c=a.createRange();c.selectNodeContents(b);c.select()}a.forceNextSelectionCheck();a.selectionChange()}},canUndo:!1});b.ui.addButton&&
b.ui.addButton("SelectAll",{label:b.lang.selectall.toolbar,command:"selectAll",toolbar:"selection,10"})}})})();(function(){var d={readOnly:1,preserveState:!0,editorFocus:!1,exec:function(a){this.toggleState();this.refresh(a)},refresh:function(a){if(a.document){var b=this.state==CKEDITOR.TRISTATE_ON&&(a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE||a.focusManager.hasFocus)?"attachClass":"removeClass";a.editable()[b]("cke_show_blocks")}}};CKEDITOR.plugins.add("showblocks",{onLoad:function(){function a(a){return".%1.%2 p,.%1.%2 div,.%1.%2 pre,.%1.%2 address,.%1.%2 blockquote,.%1.%2 h1,.%1.%2 h2,.%1.%2 h3,.%1.%2 h4,.%1.%2 h5,.%1.%2 h6{background-position: top %3;padding-%3: 8px;}".replace(/%1/g,
"cke_show_blocks").replace(/%2/g,"cke_contents_"+a).replace(/%3/g,"rtl"==a?"right":"left")}CKEDITOR.addCss(".%2 p,.%2 div,.%2 pre,.%2 address,.%2 blockquote,.%2 h1,.%2 h2,.%2 h3,.%2 h4,.%2 h5,.%2 h6{background-repeat: no-repeat;border: 1px dotted gray;padding-top: 8px;}.%2 p{%1p.png);}.%2 div{%1div.png);}.%2 pre{%1pre.png);}.%2 address{%1address.png);}.%2 blockquote{%1blockquote.png);}.%2 h1{%1h1.png);}.%2 h2{%1h2.png);}.%2 h3{%1h3.png);}.%2 h4{%1h4.png);}.%2 h5{%1h5.png);}.%2 h6{%1h6.png);}".replace(/%1/g,
"background-image: url("+CKEDITOR.getUrl(this.path)+"images/block_").replace(/%2/g,"cke_show_blocks ")+a("ltr")+a("rtl"))},init:function(a){if(!a.blockless){var b=a.addCommand("showblocks",d);b.canUndo=!1;a.config.startupOutlineBlocks&&b.setState(CKEDITOR.TRISTATE_ON);a.ui.addButton&&a.ui.addButton("ShowBlocks",{label:a.lang.showblocks.toolbar,command:"showblocks",toolbar:"tools,20"});a.on("mode",function(){b.state!=CKEDITOR.TRISTATE_DISABLED&&b.refresh(a)});if(a.elementMode==CKEDITOR.ELEMENT_MODE_INLINE){var c=
function(){b.refresh(a)};a.on("focus",c);a.on("blur",c)}a.on("contentDom",function(){b.state!=CKEDITOR.TRISTATE_DISABLED&&b.refresh(a)})}}})})();(function(){var f={preserveState:!0,editorFocus:!1,readOnly:1,exec:function(a){this.toggleState();this.refresh(a)},refresh:function(a){if(a.document){var b=this.state==CKEDITOR.TRISTATE_ON?"attachClass":"removeClass";a.editable()[b]("cke_show_borders")}}};CKEDITOR.plugins.add("showborders",{modes:{wysiwyg:1},onLoad:function(){var a;a=(CKEDITOR.env.ie6Compat?[".%1 table.%2,",".%1 table.%2 td, .%1 table.%2 th","{","border : #d3d3d3 1px dotted","}"]:".%1 table.%2,;.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,;.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,;.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,;.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th;{;border : #d3d3d3 1px dotted;}".split(";")).join("").replace(/%2/g,
"cke_show_border").replace(/%1/g,"cke_show_borders ");CKEDITOR.addCss(a)},init:function(a){var b=a.addCommand("showborders",f);b.canUndo=!1;!1!==a.config.startupShowBorders&&b.setState(CKEDITOR.TRISTATE_ON);a.on("mode",function(){b.state!=CKEDITOR.TRISTATE_DISABLED&&b.refresh(a)},null,null,100);a.on("contentDom",function(){b.state!=CKEDITOR.TRISTATE_DISABLED&&b.refresh(a)});a.on("removeFormatCleanup",function(d){d=d.data;a.getCommand("showborders").state==CKEDITOR.TRISTATE_ON&&(d.is("table")&&(!d.hasAttribute("border")||
0>=parseInt(d.getAttribute("border"),10)))&&d.addClass("cke_show_border")})},afterInit:function(a){var b=a.dataProcessor,a=b&&b.dataFilter,b=b&&b.htmlFilter;a&&a.addRules({elements:{table:function(a){var a=a.attributes,b=a["class"],c=parseInt(a.border,10);if((!c||0>=c)&&(!b||-1==b.indexOf("cke_show_border")))a["class"]=(b||"")+" cke_show_border"}}});b&&b.addRules({elements:{table:function(a){var a=a.attributes,b=a["class"];b&&(a["class"]=b.replace("cke_show_border","").replace(/\s{2}/," ").replace(/^\s+|\s+$/,
""))}}})}});CKEDITOR.on("dialogDefinition",function(a){var b=a.data.name;if("table"==b||"tableProperties"==b)if(a=a.data.definition,b=a.getContents("info").get("txtBorder"),b.commit=CKEDITOR.tools.override(b.commit,function(a){return function(b,c){a.apply(this,arguments);var e=parseInt(this.getValue(),10);c[!e||0>=e?"addClass":"removeClass"]("cke_show_border")}}),a=(a=a.getContents("advanced"))&&a.get("advCSSClasses"))a.setup=CKEDITOR.tools.override(a.setup,function(a){return function(){a.apply(this,
arguments);this.setValue(this.getValue().replace(/cke_show_border/,""))}}),a.commit=CKEDITOR.tools.override(a.commit,function(a){return function(b,c){a.apply(this,arguments);parseInt(c.getAttribute("border"),10)||c.addClass("cke_show_border")}})})})();(function(){CKEDITOR.plugins.add("sourcearea",{init:function(a){function d(){this.hide();this.setStyle("height",this.getParent().$.clientHeight+"px");this.setStyle("width",this.getParent().$.clientWidth+"px");this.show()}if(a.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE){var e=CKEDITOR.plugins.sourcearea;a.addMode("source",function(e){var b=a.ui.space("contents").getDocument().createElement("textarea");b.setStyles(CKEDITOR.tools.extend({width:CKEDITOR.env.ie7Compat?"99%":"100%",height:"100%",resize:"none",
outline:"none","text-align":"left"},CKEDITOR.tools.cssVendorPrefix("tab-size",a.config.sourceAreaTabSize||4)));b.setAttribute("dir","ltr");b.addClass("cke_source cke_reset cke_enable_context_menu");a.ui.space("contents").append(b);b=a.editable(new c(a,b));b.setData(a.getData(1));CKEDITOR.env.ie&&(b.attachListener(a,"resize",d,b),b.attachListener(CKEDITOR.document.getWindow(),"resize",d,b),CKEDITOR.tools.setTimeout(d,0,b));a.fire("ariaWidget",this);e()});a.addCommand("source",e.commands.source);a.ui.addButton&&
a.ui.addButton("Source",{label:a.lang.sourcearea.toolbar,command:"source",toolbar:"mode,10"});a.on("mode",function(){a.getCommand("source").setState("source"==a.mode?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)})}}});var c=CKEDITOR.tools.createClass({base:CKEDITOR.editable,proto:{setData:function(a){this.setValue(a);this.editor.fire("dataReady")},getData:function(){return this.getValue()},insertHtml:function(){},insertElement:function(){},insertText:function(){},setReadOnly:function(a){this[(a?"set":
"remove")+"Attribute"]("readOnly","readonly")},detach:function(){c.baseProto.detach.call(this);this.clearCustomData();this.remove()}}})})();CKEDITOR.plugins.sourcearea={commands:{source:{modes:{wysiwyg:1,source:1},editorFocus:!1,readOnly:1,exec:function(c){"wysiwyg"==c.mode&&c.fire("saveSnapshot");c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);c.setMode("source"==c.mode?"wysiwyg":"source")},canUndo:!1}}};CKEDITOR.plugins.add("specialchar",{availableLangs:{ar:1,bg:1,ca:1,cs:1,cy:1,de:1,el:1,en:1,eo:1,es:1,et:1,fa:1,fi:1,fr:1,"fr-ca":1,gl:1,he:1,hr:1,hu:1,id:1,it:1,ja:1,ku:1,lv:1,nb:1,nl:1,no:1,pl:1,pt:1,"pt-br":1,ru:1,si:1,sk:1,sl:1,sq:1,sv:1,th:1,tr:1,ug:1,uk:1,vi:1,"zh-cn":1},requires:"dialog",init:function(a){var c=this;CKEDITOR.dialog.add("specialchar",this.path+"dialogs/specialchar.js");a.addCommand("specialchar",{exec:function(){var b=a.langCode,b=c.availableLangs[b]?b:c.availableLangs[b.replace(/-.*/,
"")]?b.replace(/-.*/,""):"en";CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path+"dialogs/lang/"+b+".js"),function(){CKEDITOR.tools.extend(a.lang.specialchar,c.langEntries[b]);a.openDialog("specialchar")})},modes:{wysiwyg:1},canUndo:!1});a.ui.addButton&&a.ui.addButton("SpecialChar",{label:a.lang.specialchar.toolbar,command:"specialchar",toolbar:"insert,50"})}});CKEDITOR.config.specialChars="! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" ");CKEDITOR.plugins.add("menubutton",{requires:"button,menu",onLoad:function(){var d=function(a){var b=this._;if(b.state!==CKEDITOR.TRISTATE_DISABLED){b.previousState=b.state;var c=b.menu;c||(c=b.menu=new CKEDITOR.menu(a,{panel:{className:"cke_menu_panel",attributes:{"aria-label":a.lang.common.options}}}),c.onHide=CKEDITOR.tools.bind(function(){this.setState(this.modes&&this.modes[a.mode]?b.previousState:CKEDITOR.TRISTATE_DISABLED)},this),this.onMenu&&c.addListener(this.onMenu));b.on?c.hide():(this.setState(CKEDITOR.TRISTATE_ON),
setTimeout(function(){c.show(CKEDITOR.document.getById(b.id),4)},0))}};CKEDITOR.ui.menuButton=CKEDITOR.tools.createClass({base:CKEDITOR.ui.button,$:function(a){delete a.panel;this.base(a);this.hasArrow=!0;this.click=d},statics:{handler:{create:function(a){return new CKEDITOR.ui.menuButton(a)}}}})},beforeInit:function(d){d.ui.addHandler(CKEDITOR.UI_MENUBUTTON,CKEDITOR.ui.menuButton.handler)}});CKEDITOR.UI_MENUBUTTON="menubutton";(function(){function k(a,c){var b=0,d;for(d in c)if(c[d]==a){b=1;break}return b}var i="",r=function(){function a(){b.once("focus",f);b.once("blur",c)}function c(b){var b=b.editor,c=d.getScayt(b),f=b.elementMode==CKEDITOR.ELEMENT_MODE_INLINE;c&&(d.setPaused(b,!c.disabled),d.setControlId(b,c.id),c.destroy(!0),delete d.instances[b.name],f&&a())}var b=this,f=function(){if(!("undefined"!=typeof d.instances[b.name]||null!=d.instances[b.name])){var a=b.config,c={};c.srcNodeRef="BODY"==b.editable().$.nodeName?
b.document.getWindow().$.frameElement:b.editable().$;c.assocApp="CKEDITOR."+CKEDITOR.version+"@"+CKEDITOR.revision;c.customerid=a.scayt_customerid||"1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2";c.customDictionaryIds=a.scayt_customDictionaryIds||"";c.userDictionaryName=a.scayt_userDictionaryName||"";c.sLang=a.scayt_sLang||"en_US";c.onLoad=function(){CKEDITOR.env.ie&&8>CKEDITOR.env.version||this.addStyle(this.selectorCss(),"padding-bottom: 2px !important;");b.editable().hasFocus&&
!d.isControlRestored(b)&&this.focus()};c.onBeforeChange=function(){d.getScayt(b)&&!b.checkDirty()&&setTimeout(function(){b.resetDirty()},0)};a=window.scayt_custom_params;if("object"==typeof a)for(var f in a)c[f]=a[f];d.getControlId(b)&&(c.id=d.getControlId(b));var o=new window.scayt(c);o.afterMarkupRemove.push(function(a){(new CKEDITOR.dom.element(a,o.document)).mergeSiblings()});if(c=d.instances[b.name])o.sLang=c.sLang,o.option(c.option()),o.paused=c.paused;d.instances[b.name]=o;try{o.setDisabled(!1===
d.isPaused(b))}catch(e){}b.fire("showScaytState")}};b.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?a():b.on("contentDom",f);b.on("contentDomUnload",function(){for(var a=CKEDITOR.document.getElementsByTag("script"),b=/^dojoIoScript(\d+)$/i,c=/^https?:\/\/svc\.webspellchecker\.net\/spellcheck\/script\/ssrv\.cgi/i,d=0;d<a.count();d++){var f=a.getItem(d),e=f.getId(),h=f.getAttribute("src");e&&(h&&e.match(b)&&h.match(c))&&f.remove()}});b.on("beforeCommandExec",function(a){"source"==a.data.name&&"source"==
b.mode&&d.markControlRestore(b)});b.on("afterCommandExec",function(a){d.isScaytEnabled(b)&&"wysiwyg"==b.mode&&("undo"==a.data.name||"redo"==a.data.name)&&window.setTimeout(function(){d.getScayt(b).refresh()},10)});b.on("destroy",c);b.on("setData",c);b.on("insertElement",function(){var a=d.getScayt(b);d.isScaytEnabled(b)&&(CKEDITOR.env.ie&&b.getSelection().unlock(!0),window.setTimeout(function(){a.focus();a.refresh()},10))},this,null,50);b.on("insertHtml",function(){var a=d.getScayt(b);d.isScaytEnabled(b)&&
(CKEDITOR.env.ie&&b.getSelection().unlock(!0),window.setTimeout(function(){a.focus();a.refresh()},10))},this,null,50);b.on("scaytDialog",function(a){a.data.djConfig=window.djConfig;a.data.scayt_control=d.getScayt(b);a.data.tab=i;a.data.scayt=window.scayt});var e=b.dataProcessor;(e=e&&e.htmlFilter)&&e.addRules({elements:{span:function(a){if(a.attributes["data-scayt_word"]&&a.attributes["data-scaytid"])return delete a.name,a}}});e=CKEDITOR.plugins.undo.Image.prototype;e.equalsContent=CKEDITOR.tools.override(e.equalsContent,
function(a){return function(b){var c=this.contents,f=b.contents,e=d.getScayt(this.editor);e&&d.isScaytReady(this.editor)&&(this.contents=e.reset(c)||"",b.contents=e.reset(f)||"");e=a.apply(this,arguments);this.contents=c;b.contents=f;return e}});b.document&&(b.elementMode!=CKEDITOR.ELEMENT_MODE_INLINE||b.focusManager.hasFocus)&&f()};CKEDITOR.plugins.scayt={engineLoaded:!1,instances:{},controlInfo:{},setControlInfo:function(a,c){a&&(a.name&&"object"!=typeof this.controlInfo[a.name])&&(this.controlInfo[a.name]=
{});for(var b in c)this.controlInfo[a.name][b]=c[b]},isControlRestored:function(a){return a&&a.name&&this.controlInfo[a.name]?this.controlInfo[a.name].restored:!1},markControlRestore:function(a){this.setControlInfo(a,{restored:!0})},setControlId:function(a,c){this.setControlInfo(a,{id:c})},getControlId:function(a){return a&&a.name&&this.controlInfo[a.name]&&this.controlInfo[a.name].id?this.controlInfo[a.name].id:null},setPaused:function(a,c){this.setControlInfo(a,{paused:c})},isPaused:function(a){if(a&&
a.name&&this.controlInfo[a.name])return this.controlInfo[a.name].paused},getScayt:function(a){return this.instances[a.name]},isScaytReady:function(a){return!0===this.engineLoaded&&"undefined"!==typeof window.scayt&&this.getScayt(a)},isScaytEnabled:function(a){return(a=this.getScayt(a))?!1===a.disabled:!1},getUiTabs:function(a){var c=[],b=a.config.scayt_uiTabs||"1,1,1",b=b.split(",");b[3]="1";for(var d=0;4>d;d++)c[d]="undefined"!=typeof window.scayt&&"undefined"!=typeof window.scayt.uiTags?parseInt(b[d],
10)&&window.scayt.uiTags[d]:parseInt(b[d],10);"object"==typeof a.plugins.wsc?c.push(1):c.push(0);return c},loadEngine:function(a){if(CKEDITOR.env.gecko&&10900>CKEDITOR.env.version||CKEDITOR.env.opera||CKEDITOR.env.air)return a.fire("showScaytState");if(!0===this.engineLoaded)return r.apply(a);if(-1==this.engineLoaded)return CKEDITOR.on("scaytReady",function(){r.apply(a)});CKEDITOR.on("scaytReady",r,a);CKEDITOR.on("scaytReady",function(){this.engineLoaded=!0},this,null,0);this.engineLoaded=-1;var c=
document.location.protocol,c=-1!=c.search(/https?:/)?c:"http:",c=a.config.scayt_srcUrl||c+"//svc.webspellchecker.net/scayt26/loader__base.js",b=d.parseUrl(c).path+"/";void 0==window.scayt?(CKEDITOR._djScaytConfig={baseUrl:b,addOnLoad:[function(){CKEDITOR.fireOnce("scaytReady")}],isDebug:!1},CKEDITOR.document.getHead().append(CKEDITOR.document.createElement("script",{attributes:{type:"text/javascript",async:"true",src:c}}))):CKEDITOR.fireOnce("scaytReady");return null},parseUrl:function(a){var c;return a.match&&
(c=a.match(/(.*)[\/\\](.*?\.\w+)$/))?{path:c[1],file:c[2]}:a}};var d=CKEDITOR.plugins.scayt,s=function(a,c,b,d,e,k,g){a.addCommand(d,e);a.addMenuItem(d,{label:b,command:d,group:k,order:g})},v={preserveState:!0,editorFocus:!1,canUndo:!1,exec:function(a){if(d.isScaytReady(a)){var c=d.isScaytEnabled(a);this.setState(c?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_ON);a=d.getScayt(a);a.focus();a.setDisabled(c)}else!a.config.scayt_autoStartup&&0<=d.engineLoaded&&(a.focus(),this.setState(CKEDITOR.TRISTATE_DISABLED),
d.loadEngine(a))}};CKEDITOR.plugins.add("scayt",{requires:"menubutton,dialog",beforeInit:function(a){var c=a.config.scayt_contextMenuItemsOrder||"suggest|moresuggest|control",b="";if((c=c.split("|"))&&c.length)for(var d=0;d<c.length;d++)b+="scayt_"+c[d]+(c.length!=parseInt(d,10)+1?",":"");a.config.menu_groups=b+","+a.config.menu_groups},checkEnvironment:function(){return CKEDITOR.env.opera||CKEDITOR.env.air?0:1},init:function(a){var c=a.dataProcessor&&a.dataProcessor.dataFilter,b={elements:{span:function(a){var b=
a.attributes;b&&b["data-scaytid"]&&delete a.name}}};c&&c.addRules(b);var f={},e={},p=a.addCommand("scaytcheck",v);CKEDITOR.dialog.add("scaytcheck",CKEDITOR.getUrl(this.path+"dialogs/options.js"));c=d.getUiTabs(a);a.addMenuGroup("scaytButton");a.addMenuGroup("scayt_suggest",-10);a.addMenuGroup("scayt_moresuggest",-9);a.addMenuGroup("scayt_control",-8);var b={},g=a.lang.scayt;b.scaytToggle={label:g.enable,command:"scaytcheck",group:"scaytButton"};1==c[0]&&(b.scaytOptions={label:g.options,group:"scaytButton",
onClick:function(){i="options";a.openDialog("scaytcheck")}});1==c[1]&&(b.scaytLangs={label:g.langs,group:"scaytButton",onClick:function(){i="langs";a.openDialog("scaytcheck")}});1==c[2]&&(b.scaytDict={label:g.dictionariesTab,group:"scaytButton",onClick:function(){i="dictionaries";a.openDialog("scaytcheck")}});b.scaytAbout={label:a.lang.scayt.about,group:"scaytButton",onClick:function(){i="about";a.openDialog("scaytcheck")}};1==c[4]&&(b.scaytWSC={label:a.lang.wsc.toolbar,group:"scaytButton",command:"checkspell"});
a.addMenuItems(b);a.ui.add("Scayt",CKEDITOR.UI_MENUBUTTON,{label:g.title,title:CKEDITOR.env.opera?g.opera_title:g.title,modes:{wysiwyg:this.checkEnvironment()},toolbar:"spellchecker,20",onRender:function(){p.on("state",function(){this.setState(p.state)},this)},onMenu:function(){var b=d.isScaytEnabled(a);a.getMenuItem("scaytToggle").label=g[b?"disable":"enable"];var c=d.getUiTabs(a);return{scaytToggle:CKEDITOR.TRISTATE_OFF,scaytOptions:b&&c[0]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,scaytLangs:b&&
c[1]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,scaytDict:b&&c[2]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,scaytAbout:b&&c[3]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,scaytWSC:c[4]?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED}}});a.contextMenu&&a.addMenuItems&&a.contextMenu.addListener(function(b,c){if(!d.isScaytEnabled(a)||c.getRanges()[0].checkReadOnly())return null;var l=d.getScayt(a),q=l.getScaytNode();if(!q)return null;var h=l.getWord(q);if(!h)return null;var i=l.getLang(),
m=a.config.scayt_contextCommands||"all",h=window.scayt.getSuggestion(h,i),m=m.split("|"),n;for(n in f){delete a._.menuItems[n];delete a.commands[n]}for(n in e){delete a._.menuItems[n];delete a.commands[n]}if(!h||!h.length){s(a,"no_sugg",g.noSuggestions,"scayt_no_sugg",{exec:function(){}},"scayt_control",1,true);e.scayt_no_sugg=CKEDITOR.TRISTATE_OFF}else{f={};e={};n=a.config.scayt_moreSuggestions||"on";var i=false,u=a.config.scayt_maxSuggestions;typeof u!="number"&&(u=5);!u&&(u=h.length);for(var j=
0,p=h.length;j<p;j=j+1){var t="scayt_suggestion_"+h[j].replace(" ","_"),r=function(a,b){return{exec:function(){l.replace(a,b)}}}(q,h[j]);if(j<u){s(a,"button_"+t,h[j],t,r,"scayt_suggest",j+1);e[t]=CKEDITOR.TRISTATE_OFF}else if(n=="on"){s(a,"button_"+t,h[j],t,r,"scayt_moresuggest",j+1);f[t]=CKEDITOR.TRISTATE_OFF;i=true}}if(i){a.addMenuItem("scayt_moresuggest",{label:g.moreSuggestions,group:"scayt_moresuggest",order:10,getItems:function(){return f}});e.scayt_moresuggest=CKEDITOR.TRISTATE_OFF}}if(k("all",
m)||k("ignore",m)){s(a,"ignore",g.ignore,"scayt_ignore",{exec:function(){l.ignore(q)}},"scayt_control",2);e.scayt_ignore=CKEDITOR.TRISTATE_OFF}if(k("all",m)||k("ignoreall",m)){s(a,"ignore_all",g.ignoreAll,"scayt_ignore_all",{exec:function(){l.ignoreAll(q)}},"scayt_control",3);e.scayt_ignore_all=CKEDITOR.TRISTATE_OFF}if(k("all",m)||k("add",m)){s(a,"add_word",g.addWord,"scayt_add_word",{exec:function(){window.scayt.addWordToUserDictionary(q)}},"scayt_control",4);e.scayt_add_word=CKEDITOR.TRISTATE_OFF}l.fireOnContextMenu&&
l.fireOnContextMenu(a);return e});c=function(b){b.removeListener();CKEDITOR.env.opera||CKEDITOR.env.air?p.setState(CKEDITOR.TRISTATE_DISABLED):p.setState(d.isScaytEnabled(a)?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)};a.on("showScaytState",c);a.on("instanceReady",c);if(a.config.scayt_autoStartup)a.on("instanceReady",function(){d.loadEngine(a)})},afterInit:function(a){var c,b=function(a){if(a.hasAttribute("data-scaytid"))return!1};a._.elementsPath&&(c=a._.elementsPath.filters)&&c.push(b);a.addRemoveFormatFilter&&
a.addRemoveFormatFilter(b)}})})();(function(){CKEDITOR.plugins.add("stylescombo",{requires:"richcombo",init:function(c){var j=c.config,f=c.lang.stylescombo,g={},i=[],k=[];c.on("stylesSet",function(b){if(b=b.data.styles){for(var a,h,d=0,e=b.length;d<e;d++)if(a=b[d],!(c.blockless&&a.element in CKEDITOR.dtd.$block)&&(h=a.name,a=new CKEDITOR.style(a),!c.filter.customConfig||c.filter.check(a)))a._name=h,a._.enterMode=j.enterMode,a._.weight=d+1E3*(a.type==CKEDITOR.STYLE_OBJECT?1:a.type==CKEDITOR.STYLE_BLOCK?2:3),g[h]=a,i.push(a),k.push(a);
i.sort(function(a,b){return a._.weight-b._.weight})}});c.ui.addRichCombo("Styles",{label:f.label,title:f.panelTitle,toolbar:"styles,10",allowedContent:k,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(j.contentsCss),multiSelect:!0,attributes:{"aria-label":f.panelTitle}},init:function(){var b,a,c,d,e,g;e=0;for(g=i.length;e<g;e++)b=i[e],a=b._name,d=b.type,d!=c&&(this.startGroup(f["panelTitle"+d]),c=d),this.add(a,b.type==CKEDITOR.STYLE_OBJECT?a:b.buildPreview(),a);this.commit()},onClick:function(b){c.focus();
c.fire("saveSnapshot");var b=g[b],a=c.elementPath();c[b.checkActive(a)?"removeStyle":"applyStyle"](b);c.fire("saveSnapshot")},onRender:function(){c.on("selectionChange",function(b){for(var a=this.getValue(),b=b.data.path.elements,c=0,d=b.length,e;c<d;c++){e=b[c];for(var f in g)if(g[f].checkElementRemovable(e,!0)){f!=a&&this.setValue(f);return}}this.setValue("")},this)},onOpen:function(){var b=c.getSelection().getSelectedElement(),b=c.elementPath(b),a=[0,0,0,0];this.showAll();this.unmarkAll();for(var h in g){var d=
g[h],e=d.type;e==CKEDITOR.STYLE_BLOCK&&!b.isContextFor(d.element)?this.hideItem(h):(d.checkActive(b)?this.mark(h):e==CKEDITOR.STYLE_OBJECT&&!d.checkApplicable(b)&&(this.hideItem(h),a[e]--),a[e]++)}a[CKEDITOR.STYLE_BLOCK]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_BLOCK]);a[CKEDITOR.STYLE_INLINE]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_INLINE]);a[CKEDITOR.STYLE_OBJECT]||this.hideGroup(f["panelTitle"+CKEDITOR.STYLE_OBJECT])},reset:function(){g={};i=[]}})}})})();(function(){function i(c){return{editorFocus:!1,canUndo:!1,modes:{wysiwyg:1},exec:function(d){if(d.editable().hasFocus){var e=d.getSelection(),b;if(b=(new CKEDITOR.dom.elementPath(e.getCommonAncestor(),e.root)).contains({td:1,th:1},1)){var e=d.createRange(),a=CKEDITOR.tools.tryThese(function(){var a=b.getParent().$.cells[b.$.cellIndex+(c?-1:1)];a.parentNode.parentNode;return a},function(){var a=b.getParent(),a=a.getAscendant("table").$.rows[a.$.rowIndex+(c?-1:1)];return a.cells[c?a.cells.length-1:
0]});if(!a&&!c){for(var f=b.getAscendant("table").$,a=b.getParent().$.cells,f=new CKEDITOR.dom.element(f.insertRow(-1),d.document),g=0,h=a.length;g<h;g++){var i=f.append((new CKEDITOR.dom.element(a[g],d.document)).clone(!1,!1));!CKEDITOR.env.ie&&i.appendBogus()}e.moveToElementEditStart(f)}else if(a)a=new CKEDITOR.dom.element(a),e.moveToElementEditStart(a),(!e.checkStartOfBlock()||!e.checkEndOfBlock())&&e.selectNodeContents(a);else return!0;e.select(!0);return!0}}return!1}}}var h={editorFocus:!1,modes:{wysiwyg:1,
source:1}},g={exec:function(c){c.container.focusNext(!0,c.tabIndex)}},f={exec:function(c){c.container.focusPrevious(!0,c.tabIndex)}};CKEDITOR.plugins.add("tab",{init:function(c){for(var d=!1!==c.config.enableTabKeyTools,e=c.config.tabSpaces||0,b="";e--;)b+=" ";if(b)c.on("key",function(a){9==a.data.keyCode&&(c.insertHtml(b),a.cancel())});if(d)c.on("key",function(a){(9==a.data.keyCode&&c.execCommand("selectNextCell")||a.data.keyCode==CKEDITOR.SHIFT+9&&c.execCommand("selectPreviousCell"))&&a.cancel()});
c.addCommand("blur",CKEDITOR.tools.extend(g,h));c.addCommand("blurBack",CKEDITOR.tools.extend(f,h));c.addCommand("selectNextCell",i());c.addCommand("selectPreviousCell",i(!0))}})})();
CKEDITOR.dom.element.prototype.focusNext=function(i,h){var g=void 0===h?this.getTabIndex():h,f,c,d,e,b,a;if(0>=g)for(b=this.getNextSourceNode(i,CKEDITOR.NODE_ELEMENT);b;){if(b.isVisible()&&0===b.getTabIndex()){d=b;break}b=b.getNextSourceNode(!1,CKEDITOR.NODE_ELEMENT)}else for(b=this.getDocument().getBody().getFirst();b=b.getNextSourceNode(!1,CKEDITOR.NODE_ELEMENT);){if(!f)if(!c&&b.equals(this)){if(c=!0,i){if(!(b=b.getNextSourceNode(!0,CKEDITOR.NODE_ELEMENT)))break;f=1}}else c&&!this.contains(b)&&
(f=1);if(b.isVisible()&&!(0>(a=b.getTabIndex()))){if(f&&a==g){d=b;break}a>g&&(!d||!e||a<e)?(d=b,e=a):!d&&0===a&&(d=b,e=a)}}d&&d.focus()};
CKEDITOR.dom.element.prototype.focusPrevious=function(i,h){for(var g=void 0===h?this.getTabIndex():h,f,c,d,e=0,b,a=this.getDocument().getBody().getLast();a=a.getPreviousSourceNode(!1,CKEDITOR.NODE_ELEMENT);){if(!f)if(!c&&a.equals(this)){if(c=!0,i){if(!(a=a.getPreviousSourceNode(!0,CKEDITOR.NODE_ELEMENT)))break;f=1}}else c&&!this.contains(a)&&(f=1);if(a.isVisible()&&!(0>(b=a.getTabIndex())))if(0>=g){if(f&&0===b){d=a;break}b>e&&(d=a,e=b)}else{if(f&&b==g){d=a;break}if(b<g&&(!d||b>e))d=a,e=b}}d&&d.focus()};CKEDITOR.plugins.add("table",{requires:"dialog",init:function(a){function d(a){return CKEDITOR.tools.extend(a||{},{contextSensitive:1,refresh:function(a,e){this.setState(e.contains("table",1)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED)}})}if(!a.blockless){var b=a.lang.table;a.addCommand("table",new CKEDITOR.dialogCommand("table",{context:"table",allowedContent:"table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];"+(a.plugins.dialogadvtab?
"table"+a.plugins.dialogadvtab.allowedContent():""),requiredContent:"table",contentTransformations:[["table{width}: sizeToStyle","table[width]: sizeToAttribute"]]}));a.addCommand("tableProperties",new CKEDITOR.dialogCommand("tableProperties",d()));a.addCommand("tableDelete",d({exec:function(a){var c=a.elementPath().contains("table",1);if(c){var b=c.getParent();1==b.getChildCount()&&!b.is("body","td","th")&&(c=b);a=a.createRange();a.moveToPosition(c,CKEDITOR.POSITION_BEFORE_START);c.remove();a.select()}}}));
a.ui.addButton&&a.ui.addButton("Table",{label:b.toolbar,command:"table",toolbar:"insert,30"});CKEDITOR.dialog.add("table",this.path+"dialogs/table.js");CKEDITOR.dialog.add("tableProperties",this.path+"dialogs/table.js");a.addMenuItems&&a.addMenuItems({table:{label:b.menu,command:"tableProperties",group:"table",order:5},tabledelete:{label:b.deleteTable,command:"tableDelete",group:"table",order:1}});a.on("doubleclick",function(a){a.data.element.is("table")&&(a.data.dialog="tableProperties")});a.contextMenu&&
a.contextMenu.addListener(function(){return{tabledelete:CKEDITOR.TRISTATE_OFF,table:CKEDITOR.TRISTATE_OFF}})}}});(function(){function p(e){function d(a){!(0<b.length)&&(a.type==CKEDITOR.NODE_ELEMENT&&y.test(a.getName())&&!a.getCustomData("selected_cell"))&&(CKEDITOR.dom.element.setMarker(c,a,"selected_cell",!0),b.push(a))}for(var e=e.getRanges(),b=[],c={},a=0;a<e.length;a++){var f=e[a];if(f.collapsed)f=f.getCommonAncestor(),(f=f.getAscendant("td",!0)||f.getAscendant("th",!0))&&b.push(f);else{var f=new CKEDITOR.dom.walker(f),g;for(f.guard=d;g=f.next();)if(g.type!=CKEDITOR.NODE_ELEMENT||!g.is(CKEDITOR.dtd.table))if((g=
g.getAscendant("td",!0)||g.getAscendant("th",!0))&&!g.getCustomData("selected_cell"))CKEDITOR.dom.element.setMarker(c,g,"selected_cell",!0),b.push(g)}}CKEDITOR.dom.element.clearAllMarkers(c);return b}function o(e,d){for(var b=p(e),c=b[0],a=c.getAscendant("table"),c=c.getDocument(),f=b[0].getParent(),g=f.$.rowIndex,b=b[b.length-1],h=b.getParent().$.rowIndex+b.$.rowSpan-1,b=new CKEDITOR.dom.element(a.$.rows[h]),g=d?g:h,f=d?f:b,b=CKEDITOR.tools.buildTableMap(a),a=b[g],g=d?b[g-1]:b[g+1],b=b[0].length,
c=c.createElement("tr"),h=0;a[h]&&h<b;h++){var i;1<a[h].rowSpan&&g&&a[h]==g[h]?(i=a[h],i.rowSpan+=1):(i=(new CKEDITOR.dom.element(a[h])).clone(),i.removeAttribute("rowSpan"),!CKEDITOR.env.ie&&i.appendBogus(),c.append(i),i=i.$);h+=i.colSpan-1}d?c.insertBefore(f):c.insertAfter(f)}function q(e){if(e instanceof CKEDITOR.dom.selection){for(var d=p(e),b=d[0].getAscendant("table"),c=CKEDITOR.tools.buildTableMap(b),e=d[0].getParent().$.rowIndex,d=d[d.length-1],a=d.getParent().$.rowIndex+d.$.rowSpan-1,d=[],
f=e;f<=a;f++){for(var g=c[f],h=new CKEDITOR.dom.element(b.$.rows[f]),i=0;i<g.length;i++){var j=new CKEDITOR.dom.element(g[i]),l=j.getParent().$.rowIndex;1==j.$.rowSpan?j.remove():(j.$.rowSpan-=1,l==f&&(l=c[f+1],l[i-1]?j.insertAfter(new CKEDITOR.dom.element(l[i-1])):(new CKEDITOR.dom.element(b.$.rows[f+1])).append(j,1)));i+=j.$.colSpan-1}d.push(h)}c=b.$.rows;b=new CKEDITOR.dom.element(c[a+1]||(0<e?c[e-1]:null)||b.$.parentNode);for(f=d.length;0<=f;f--)q(d[f]);return b}e instanceof CKEDITOR.dom.element&&
(b=e.getAscendant("table"),1==b.$.rows.length?b.remove():e.remove());return null}function r(e,d){for(var b=d?Infinity:0,c=0;c<e.length;c++){var a;a=e[c];for(var f=d,g=a.getParent().$.cells,h=0,i=0;i<g.length;i++){var j=g[i],h=h+(f?1:j.colSpan);if(j==a.$)break}a=h-1;if(d?a<b:a>b)b=a}return b}function k(e,d){for(var b=p(e),c=b[0].getAscendant("table"),a=r(b,1),b=r(b),a=d?a:b,f=CKEDITOR.tools.buildTableMap(c),c=[],b=[],g=f.length,h=0;h<g;h++)c.push(f[h][a]),b.push(d?f[h][a-1]:f[h][a+1]);for(h=0;h<g;h++)c[h]&&
(1<c[h].colSpan&&b[h]==c[h]?(a=c[h],a.colSpan+=1):(a=(new CKEDITOR.dom.element(c[h])).clone(),a.removeAttribute("colSpan"),!CKEDITOR.env.ie&&a.appendBogus(),a[d?"insertBefore":"insertAfter"].call(a,new CKEDITOR.dom.element(c[h])),a=a.$),h+=a.rowSpan-1)}function u(e,d){var b=e.getStartElement();if(b=b.getAscendant("td",1)||b.getAscendant("th",1)){var c=b.clone();CKEDITOR.env.ie||c.appendBogus();d?c.insertBefore(b):c.insertAfter(b)}}function t(e){if(e instanceof CKEDITOR.dom.selection){var e=p(e),d=
e[0]&&e[0].getAscendant("table"),b;a:{var c=0;b=e.length-1;for(var a={},f,g;f=e[c++];)CKEDITOR.dom.element.setMarker(a,f,"delete_cell",!0);for(c=0;f=e[c++];)if((g=f.getPrevious())&&!g.getCustomData("delete_cell")||(g=f.getNext())&&!g.getCustomData("delete_cell")){CKEDITOR.dom.element.clearAllMarkers(a);b=g;break a}CKEDITOR.dom.element.clearAllMarkers(a);g=e[0].getParent();(g=g.getPrevious())?b=g.getLast():(g=e[b].getParent(),b=(g=g.getNext())?g.getChild(0):null)}for(g=e.length-1;0<=g;g--)t(e[g]);
b?m(b,!0):d&&d.remove()}else e instanceof CKEDITOR.dom.element&&(d=e.getParent(),1==d.getChildCount()?d.remove():e.remove())}function m(e,d){var b=new CKEDITOR.dom.range(e.getDocument());if(!b["moveToElementEdit"+(d?"End":"Start")](e))b.selectNodeContents(e),b.collapse(d?!1:!0);b.select(!0)}function v(e,d,b){e=e[d];if("undefined"==typeof b)return e;for(d=0;e&&d<e.length;d++){if(b.is&&e[d]==b.$)return d;if(d==b)return new CKEDITOR.dom.element(e[d])}return b.is?-1:null}function s(e,d,b){var c=p(e),
a;if((d?1!=c.length:2>c.length)||(a=e.getCommonAncestor())&&a.type==CKEDITOR.NODE_ELEMENT&&a.is("table"))return!1;var f,e=c[0];a=e.getAscendant("table");var g=CKEDITOR.tools.buildTableMap(a),h=g.length,i=g[0].length,j=e.getParent().$.rowIndex,l=v(g,j,e);if(d){var n;try{var m=parseInt(e.getAttribute("rowspan"),10)||1;f=parseInt(e.getAttribute("colspan"),10)||1;n=g["up"==d?j-m:"down"==d?j+m:j]["left"==d?l-f:"right"==d?l+f:l]}catch(z){return!1}if(!n||e.$==n)return!1;c["up"==d||"left"==d?"unshift":"push"](new CKEDITOR.dom.element(n))}for(var d=
e.getDocument(),o=j,m=n=0,q=!b&&new CKEDITOR.dom.documentFragment(d),s=0,d=0;d<c.length;d++){f=c[d];var k=f.getParent(),t=f.getFirst(),r=f.$.colSpan,u=f.$.rowSpan,k=k.$.rowIndex,w=v(g,k,f),s=s+r*u,m=Math.max(m,w-l+r);n=Math.max(n,k-j+u);if(!b){r=f;(u=r.getBogus())&&u.remove();r.trim();if(f.getChildren().count()){if(k!=o&&t&&(!t.isBlockBoundary||!t.isBlockBoundary({br:1})))(o=q.getLast(CKEDITOR.dom.walker.whitespaces(!0)))&&(!o.is||!o.is("br"))&&q.append("br");f.moveChildren(q)}d?f.remove():f.setHtml("")}o=
k}if(b)return n*m==s;q.moveChildren(e);CKEDITOR.env.ie||e.appendBogus();m>=i?e.removeAttribute("rowSpan"):e.$.rowSpan=n;n>=h?e.removeAttribute("colSpan"):e.$.colSpan=m;b=new CKEDITOR.dom.nodeList(a.$.rows);c=b.count();for(d=c-1;0<=d;d--)a=b.getItem(d),a.$.cells.length||(a.remove(),c++);return e}function w(e,d){var b=p(e);if(1<b.length)return!1;if(d)return!0;var b=b[0],c=b.getParent(),a=c.getAscendant("table"),f=CKEDITOR.tools.buildTableMap(a),g=c.$.rowIndex,h=v(f,g,b),i=b.$.rowSpan,j;if(1<i){j=Math.ceil(i/
2);for(var i=Math.floor(i/2),c=g+j,a=new CKEDITOR.dom.element(a.$.rows[c]),f=v(f,c),l,c=b.clone(),g=0;g<f.length;g++)if(l=f[g],l.parentNode==a.$&&g>h){c.insertBefore(new CKEDITOR.dom.element(l));break}else l=null;l||a.append(c,!0)}else{i=j=1;a=c.clone();a.insertAfter(c);a.append(c=b.clone());l=v(f,g);for(h=0;h<l.length;h++)l[h].rowSpan++}CKEDITOR.env.ie||c.appendBogus();b.$.rowSpan=j;c.$.rowSpan=i;1==j&&b.removeAttribute("rowSpan");1==i&&c.removeAttribute("rowSpan");return c}function x(e,d){var b=
p(e);if(1<b.length)return!1;if(d)return!0;var b=b[0],c=b.getParent(),a=c.getAscendant("table"),a=CKEDITOR.tools.buildTableMap(a),f=v(a,c.$.rowIndex,b),g=b.$.colSpan;if(1<g)c=Math.ceil(g/2),g=Math.floor(g/2);else{for(var g=c=1,h=[],i=0;i<a.length;i++){var j=a[i];h.push(j[f]);1<j[f].rowSpan&&(i+=j[f].rowSpan-1)}for(a=0;a<h.length;a++)h[a].colSpan++}a=b.clone();a.insertAfter(b);CKEDITOR.env.ie||a.appendBogus();b.$.colSpan=c;a.$.colSpan=g;1==c&&b.removeAttribute("colSpan");1==g&&a.removeAttribute("colSpan");
return a}var y=/^(?:td|th)$/;CKEDITOR.plugins.tabletools={requires:"table,dialog,contextmenu",init:function(e){function d(a){return CKEDITOR.tools.extend(a||{},{contextSensitive:1,refresh:function(a,b){this.setState(b.contains({td:1,th:1},1)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED)}})}function b(a,b){var c=e.addCommand(a,b);e.addFeature(c)}var c=e.lang.table;b("cellProperties",new CKEDITOR.dialogCommand("cellProperties",d({allowedContent:"td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
requiredContent:"table"})));CKEDITOR.dialog.add("cellProperties",this.path+"dialogs/tableCell.js");b("rowDelete",d({requiredContent:"table",exec:function(a){a=a.getSelection();m(q(a))}}));b("rowInsertBefore",d({requiredContent:"table",exec:function(a){a=a.getSelection();o(a,!0)}}));b("rowInsertAfter",d({requiredContent:"table",exec:function(a){a=a.getSelection();o(a)}}));b("columnDelete",d({requiredContent:"table",exec:function(a){for(var a=a.getSelection(),a=p(a),b=a[0],c=a[a.length-1],a=b.getAscendant("table"),
d=CKEDITOR.tools.buildTableMap(a),e,j,l=[],n=0,o=d.length;n<o;n++)for(var k=0,q=d[n].length;k<q;k++)d[n][k]==b.$&&(e=k),d[n][k]==c.$&&(j=k);for(n=e;n<=j;n++)for(k=0;k<d.length;k++)c=d[k],b=new CKEDITOR.dom.element(a.$.rows[k]),c=new CKEDITOR.dom.element(c[n]),c.$&&(1==c.$.colSpan?c.remove():c.$.colSpan-=1,k+=c.$.rowSpan-1,b.$.cells.length||l.push(b));j=a.$.rows[0]&&a.$.rows[0].cells;e=new CKEDITOR.dom.element(j[e]||(e?j[e-1]:a.$.parentNode));l.length==o&&a.remove();e&&m(e,!0)}}));b("columnInsertBefore",
d({requiredContent:"table",exec:function(a){a=a.getSelection();k(a,!0)}}));b("columnInsertAfter",d({requiredContent:"table",exec:function(a){a=a.getSelection();k(a)}}));b("cellDelete",d({requiredContent:"table",exec:function(a){a=a.getSelection();t(a)}}));b("cellMerge",d({allowedContent:"td[colspan,rowspan]",requiredContent:"td[colspan,rowspan]",exec:function(a){m(s(a.getSelection()),!0)}}));b("cellMergeRight",d({allowedContent:"td[colspan]",requiredContent:"td[colspan]",exec:function(a){m(s(a.getSelection(),
"right"),!0)}}));b("cellMergeDown",d({allowedContent:"td[rowspan]",requiredContent:"td[rowspan]",exec:function(a){m(s(a.getSelection(),"down"),!0)}}));b("cellVerticalSplit",d({allowedContent:"td[rowspan]",requiredContent:"td[rowspan]",exec:function(a){m(w(a.getSelection()))}}));b("cellHorizontalSplit",d({allowedContent:"td[colspan]",requiredContent:"td[colspan]",exec:function(a){m(x(a.getSelection()))}}));b("cellInsertBefore",d({requiredContent:"table",exec:function(a){a=a.getSelection();u(a,!0)}}));
b("cellInsertAfter",d({requiredContent:"table",exec:function(a){a=a.getSelection();u(a)}}));e.addMenuItems&&e.addMenuItems({tablecell:{label:c.cell.menu,group:"tablecell",order:1,getItems:function(){var a=e.getSelection(),b=p(a);return{tablecell_insertBefore:CKEDITOR.TRISTATE_OFF,tablecell_insertAfter:CKEDITOR.TRISTATE_OFF,tablecell_delete:CKEDITOR.TRISTATE_OFF,tablecell_merge:s(a,null,!0)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,tablecell_merge_right:s(a,"right",!0)?CKEDITOR.TRISTATE_OFF:
CKEDITOR.TRISTATE_DISABLED,tablecell_merge_down:s(a,"down",!0)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,tablecell_split_vertical:w(a,!0)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,tablecell_split_horizontal:x(a,!0)?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED,tablecell_properties:0<b.length?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED}}},tablecell_insertBefore:{label:c.cell.insertBefore,group:"tablecell",command:"cellInsertBefore",order:5},tablecell_insertAfter:{label:c.cell.insertAfter,
group:"tablecell",command:"cellInsertAfter",order:10},tablecell_delete:{label:c.cell.deleteCell,group:"tablecell",command:"cellDelete",order:15},tablecell_merge:{label:c.cell.merge,group:"tablecell",command:"cellMerge",order:16},tablecell_merge_right:{label:c.cell.mergeRight,group:"tablecell",command:"cellMergeRight",order:17},tablecell_merge_down:{label:c.cell.mergeDown,group:"tablecell",command:"cellMergeDown",order:18},tablecell_split_horizontal:{label:c.cell.splitHorizontal,group:"tablecell",
command:"cellHorizontalSplit",order:19},tablecell_split_vertical:{label:c.cell.splitVertical,group:"tablecell",command:"cellVerticalSplit",order:20},tablecell_properties:{label:c.cell.title,group:"tablecellproperties",command:"cellProperties",order:21},tablerow:{label:c.row.menu,group:"tablerow",order:1,getItems:function(){return{tablerow_insertBefore:CKEDITOR.TRISTATE_OFF,tablerow_insertAfter:CKEDITOR.TRISTATE_OFF,tablerow_delete:CKEDITOR.TRISTATE_OFF}}},tablerow_insertBefore:{label:c.row.insertBefore,
group:"tablerow",command:"rowInsertBefore",order:5},tablerow_insertAfter:{label:c.row.insertAfter,group:"tablerow",command:"rowInsertAfter",order:10},tablerow_delete:{label:c.row.deleteRow,group:"tablerow",command:"rowDelete",order:15},tablecolumn:{label:c.column.menu,group:"tablecolumn",order:1,getItems:function(){return{tablecolumn_insertBefore:CKEDITOR.TRISTATE_OFF,tablecolumn_insertAfter:CKEDITOR.TRISTATE_OFF,tablecolumn_delete:CKEDITOR.TRISTATE_OFF}}},tablecolumn_insertBefore:{label:c.column.insertBefore,
group:"tablecolumn",command:"columnInsertBefore",order:5},tablecolumn_insertAfter:{label:c.column.insertAfter,group:"tablecolumn",command:"columnInsertAfter",order:10},tablecolumn_delete:{label:c.column.deleteColumn,group:"tablecolumn",command:"columnDelete",order:15}});e.contextMenu&&e.contextMenu.addListener(function(a,b,c){return(a=c.contains({td:1,th:1},1))&&!a.isReadOnly()?{tablecell:CKEDITOR.TRISTATE_OFF,tablerow:CKEDITOR.TRISTATE_OFF,tablecolumn:CKEDITOR.TRISTATE_OFF}:null})},getSelectedCells:p};
CKEDITOR.plugins.add("tabletools",CKEDITOR.plugins.tabletools)})();CKEDITOR.tools.buildTableMap=function(p){for(var p=p.$.rows,o=-1,q=[],r=0;r<p.length;r++){o++;!q[o]&&(q[o]=[]);for(var k=-1,u=0;u<p[r].cells.length;u++){var t=p[r].cells[u];for(k++;q[o][k];)k++;for(var m=isNaN(t.colSpan)?1:t.colSpan,t=isNaN(t.rowSpan)?1:t.rowSpan,v=0;v<t;v++){q[o+v]||(q[o+v]=[]);for(var s=0;s<m;s++)q[o+v][k+s]=p[r].cells[u]}k+=m-1}}return q};(function(){function g(a){this.editor=a;this.reset()}CKEDITOR.plugins.add("undo",{init:function(a){function c(a){b.enabled&&!1!==a.data.command.canUndo&&b.save()}function d(){b.enabled=a.readOnly?!1:"wysiwyg"==a.mode;b.onChange()}var b=new g(a),e=a.addCommand("undo",{exec:function(){b.undo()&&(a.selectionChange(),this.fire("afterUndo"))},state:CKEDITOR.TRISTATE_DISABLED,canUndo:!1}),f=a.addCommand("redo",{exec:function(){b.redo()&&(a.selectionChange(),this.fire("afterRedo"))},state:CKEDITOR.TRISTATE_DISABLED,
canUndo:!1});a.setKeystroke([[CKEDITOR.CTRL+90,"undo"],[CKEDITOR.CTRL+89,"redo"],[CKEDITOR.CTRL+CKEDITOR.SHIFT+90,"redo"]]);b.onChange=function(){e.setState(b.undoable()?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED);f.setState(b.redoable()?CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED)};a.on("beforeCommandExec",c);a.on("afterCommandExec",c);a.on("saveSnapshot",function(a){b.save(a.data&&a.data.contentOnly)});a.on("contentDom",function(){a.editable().on("keydown",function(a){a=a.data.getKey();
(8==a||46==a)&&b.type(a,0)});a.editable().on("keypress",function(a){b.type(a.data.getKey(),1)})});a.on("beforeModeUnload",function(){"wysiwyg"==a.mode&&b.save(!0)});a.on("mode",d);a.on("readOnly",d);a.ui.addButton&&(a.ui.addButton("Undo",{label:a.lang.undo.undo,command:"undo",toolbar:"undo,10"}),a.ui.addButton("Redo",{label:a.lang.undo.redo,command:"redo",toolbar:"undo,20"}));a.resetUndo=function(){b.reset();a.fire("saveSnapshot")};a.on("updateSnapshot",function(){b.currentImage&&b.update()});a.on("lockSnapshot",
b.lock,b);a.on("unlockSnapshot",b.unlock,b)}});CKEDITOR.plugins.undo={};var f=CKEDITOR.plugins.undo.Image=function(a){this.editor=a;a.fire("beforeUndoImage");var c=a.getSnapshot(),d=c&&a.getSelection();CKEDITOR.env.ie&&c&&(c=c.replace(/\s+data-cke-expando=".*?"/g,""));this.contents=c;this.bookmarks=d&&d.createBookmarks2(!0);a.fire("afterUndoImage")},h=/\b(?:href|src|name)="[^"]*?"/gi;f.prototype={equalsContent:function(a){var c=this.contents,a=a.contents;if(CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||
CKEDITOR.env.ie6Compat))c=c.replace(h,""),a=a.replace(h,"");return c!=a?!1:!0},equalsSelection:function(a){var c=this.bookmarks,a=a.bookmarks;if(c||a){if(!c||!a||c.length!=a.length)return!1;for(var d=0;d<c.length;d++){var b=c[d],e=a[d];if(b.startOffset!=e.startOffset||b.endOffset!=e.endOffset||!CKEDITOR.tools.arrayCompare(b.start,e.start)||!CKEDITOR.tools.arrayCompare(b.end,e.end))return!1}}return!0}};g.prototype={type:function(a,c){var d=!c&&a!=this.lastKeystroke,b=this.editor;if(!this.typing||c&&
!this.wasCharacter||d){var e=new f(b),g=this.snapshots.length;CKEDITOR.tools.setTimeout(function(){var a=b.getSnapshot();CKEDITOR.env.ie&&(a=a.replace(/\s+data-cke-expando=".*?"/g,""));e.contents!=a&&g==this.snapshots.length&&(this.typing=!0,this.save(!1,e,!1)||this.snapshots.splice(this.index+1,this.snapshots.length-this.index-1),this.hasUndo=!0,this.hasRedo=!1,this.modifiersCount=this.typesCount=1,this.onChange())},0,this)}this.lastKeystroke=a;(this.wasCharacter=c)?(this.modifiersCount=0,this.typesCount++,
25<this.typesCount?(this.save(!1,null,!1),this.typesCount=1):setTimeout(function(){b.fire("change")},0)):(this.typesCount=0,this.modifiersCount++,25<this.modifiersCount?(this.save(!1,null,!1),this.modifiersCount=1):setTimeout(function(){b.fire("change")},0))},reset:function(){this.lastKeystroke=0;this.snapshots=[];this.index=-1;this.limit=this.editor.config.undoStackSize||20;this.currentImage=null;this.hasRedo=this.hasUndo=!1;this.locked=null;this.resetType()},resetType:function(){this.typing=!1;
delete this.lastKeystroke;this.modifiersCount=this.typesCount=0},fireChange:function(){this.hasUndo=!!this.getNextImage(!0);this.hasRedo=!!this.getNextImage(!1);this.resetType();this.onChange()},save:function(a,c,d){if(this.locked)return!1;var b=this.snapshots;c||(c=new f(this.editor));if(!1===c.contents)return!1;if(this.currentImage)if(c.equalsContent(this.currentImage)){if(a||c.equalsSelection(this.currentImage))return!1}else this.editor.fire("change");b.splice(this.index+1,b.length-this.index-
1);b.length==this.limit&&b.shift();this.index=b.push(c)-1;this.currentImage=c;!1!==d&&this.fireChange();return!0},restoreImage:function(a){var c=this.editor,d;a.bookmarks&&(c.focus(),d=c.getSelection());this.locked=1;this.editor.loadSnapshot(a.contents);a.bookmarks?d.selectBookmarks(a.bookmarks):CKEDITOR.env.ie&&(d=this.editor.document.getBody().$.createTextRange(),d.collapse(!0),d.select());this.locked=0;this.index=a.index;this.update();this.fireChange();c.fire("change")},getNextImage:function(a){var c=
this.snapshots,d=this.currentImage,b;if(d)if(a)for(b=this.index-1;0<=b;b--){if(a=c[b],!d.equalsContent(a))return a.index=b,a}else for(b=this.index+1;b<c.length;b++)if(a=c[b],!d.equalsContent(a))return a.index=b,a;return null},redoable:function(){return this.enabled&&this.hasRedo},undoable:function(){return this.enabled&&this.hasUndo},undo:function(){if(this.undoable()){this.save(!0);var a=this.getNextImage(!0);if(a)return this.restoreImage(a),!0}return!1},redo:function(){if(this.redoable()&&(this.save(!0),
this.redoable())){var a=this.getNextImage(!1);if(a)return this.restoreImage(a),!0}return!1},update:function(){this.locked||this.snapshots.splice(this.index,1,this.currentImage=new f(this.editor))},lock:function(){if(this.locked)this.locked.level++;else{var a=new f(this.editor);this.locked={update:this.currentImage&&this.currentImage.equalsContent(a)?a:null,level:1}}},unlock:function(){if(this.locked&&!--this.locked.level){var a=this.locked.update;this.locked=null;a&&!a.equalsContent(new f(this.editor))&&
this.update()}}}})();CKEDITOR.plugins.add("wsc",{requires:"dialog",parseConfig:function(a){a.config.wsc_onFinish="function"===typeof a.config.wsc_onFinish?a.config.wsc_onFinish:function(){};a.config.wsc_onClose="function"===typeof a.config.wsc_onClose?a.config.wsc_onClose:function(){};CKEDITOR.config.wsc_stack.push(a)},init:function(a){a.addCommand("checkspell",new CKEDITOR.dialogCommand("checkspell")).modes={wysiwyg:!CKEDITOR.env.opera&&!CKEDITOR.env.air&&document.domain==window.location.hostname};"undefined"==typeof a.plugins.scayt&&
a.ui.addButton&&a.ui.addButton("SpellChecker",{label:a.lang.wsc.toolbar,command:"checkspell",toolbar:"spellchecker,10"});CKEDITOR.dialog.add("checkspell",this.path+(CKEDITOR.env.ie&&8>=CKEDITOR.env.version?"dialogs/wsc_ie.js":window.postMessage?"dialogs/wsc.js":"dialogs/wsc_ie.js"))},beforeInit:function(a){this.parseConfig(a)}});CKEDITOR.config.wsc_stack=[];CKEDITOR.config.wsc_customerId=CKEDITOR.config.wsc_customerId||"1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
CKEDITOR.config.wsc_customDictionaryIds=CKEDITOR.config.wsc_customDictionaryIds||"";CKEDITOR.config.wsc_userDictionaryName=CKEDITOR.config.wsc_userDictionaryName||"";CKEDITOR.config.wsc_cmd=CKEDITOR.config.wsc_cmd||"spell";CKEDITOR.config.plugins='dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,htmlwriter,horizontalrule,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';CKEDITOR.config.skin='moono';(function() {var setIcons = function(icons, strip) {var path = CKEDITOR.getUrl( 'plugins/' + strip );icons = icons.split( ',' );for ( var i = 0; i < icons.length; i++ )CKEDITOR.skin.icons[ icons[ i ] ] = { path: path, offset: -icons[ ++i ], bgsize : icons[ ++i ] };};if (CKEDITOR.env.hidpi) setIcons('about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,bidiltr,168,,bidirtl,192,,blockquote,216,,copy-rtl,240,,copy,264,,cut-rtl,288,,cut,312,,paste-rtl,336,,paste,360,,bgcolor,384,,textcolor,408,,templates-rtl,432,,templates,456,,creatediv,480,,find-rtl,504,,find,528,,replace,552,,flash,576,,button,600,,checkbox,624,,form,648,,hiddenfield,672,,imagebutton,696,,radio,720,,select-rtl,744,,select,768,,textarea-rtl,792,,textarea,816,,textfield-rtl,840,,textfield,864,,horizontalrule,888,,iframe,912,,image,936,,indent-rtl,960,,indent,984,,outdent-rtl,1008,,outdent,1032,,smiley,1056,,justifyblock,1080,,justifycenter,1104,,justifyleft,1128,,justifyright,1152,,anchor-rtl,1176,,anchor,1200,,link,1224,,unlink,1248,,bulletedlist-rtl,1272,,bulletedlist,1296,,numberedlist-rtl,1320,,numberedlist,1344,,maximize,1368,,newpage-rtl,1392,,newpage,1416,,pagebreak-rtl,1440,,pagebreak,1464,,pastetext-rtl,1488,,pastetext,1512,,pastefromword-rtl,1536,,pastefromword,1560,,preview-rtl,1584,,preview,1608,,print,1632,,removeformat,1656,,save,1680,,selectall,1704,,showblocks-rtl,1728,,showblocks,1752,,source-rtl,1776,,source,1800,,specialchar,1824,,scayt,1848,,table,1872,,redo-rtl,1896,,redo,1920,,undo-rtl,1944,,undo,1968,,spellchecker,1992,','icons_hidpi.png');else setIcons('about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,bidiltr,168,auto,bidirtl,192,auto,blockquote,216,auto,copy-rtl,240,auto,copy,264,auto,cut-rtl,288,auto,cut,312,auto,paste-rtl,336,auto,paste,360,auto,bgcolor,384,auto,textcolor,408,auto,templates-rtl,432,auto,templates,456,auto,creatediv,480,auto,find-rtl,504,auto,find,528,auto,replace,552,auto,flash,576,auto,button,600,auto,checkbox,624,auto,form,648,auto,hiddenfield,672,auto,imagebutton,696,auto,radio,720,auto,select-rtl,744,auto,select,768,auto,textarea-rtl,792,auto,textarea,816,auto,textfield-rtl,840,auto,textfield,864,auto,horizontalrule,888,auto,iframe,912,auto,image,936,auto,indent-rtl,960,auto,indent,984,auto,outdent-rtl,1008,auto,outdent,1032,auto,smiley,1056,auto,justifyblock,1080,auto,justifycenter,1104,auto,justifyleft,1128,auto,justifyright,1152,auto,anchor-rtl,1176,auto,anchor,1200,auto,link,1224,auto,unlink,1248,auto,bulletedlist-rtl,1272,auto,bulletedlist,1296,auto,numberedlist-rtl,1320,auto,numberedlist,1344,auto,maximize,1368,auto,newpage-rtl,1392,auto,newpage,1416,auto,pagebreak-rtl,1440,auto,pagebreak,1464,auto,pastetext-rtl,1488,auto,pastetext,1512,auto,pastefromword-rtl,1536,auto,pastefromword,1560,auto,preview-rtl,1584,auto,preview,1608,auto,print,1632,auto,removeformat,1656,auto,save,1680,auto,selectall,1704,auto,showblocks-rtl,1728,auto,showblocks,1752,auto,source-rtl,1776,auto,source,1800,auto,specialchar,1824,auto,scayt,1848,auto,table,1872,auto,redo-rtl,1896,auto,redo,1920,auto,undo-rtl,1944,auto,undo,1968,auto,spellchecker,1992,auto','icons.png');})();CKEDITOR.lang.languages={"af":1,"sq":1,"ar":1,"eu":1,"bn":1,"bs":1,"bg":1,"ca":1,"zh-cn":1,"zh":1,"hr":1,"cs":1,"da":1,"nl":1,"en":1,"en-au":1,"en-ca":1,"en-gb":1,"eo":1,"et":1,"fo":1,"fi":1,"fr":1,"fr-ca":1,"gl":1,"ka":1,"de":1,"el":1,"gu":1,"he":1,"hi":1,"hu":1,"is":1,"id":1,"it":1,"ja":1,"km":1,"ko":1,"ku":1,"lv":1,"lt":1,"mk":1,"ms":1,"mn":1,"no":1,"nb":1,"fa":1,"pl":1,"pt-br":1,"pt":1,"ro":1,"ru":1,"sr":1,"sr-latn":1,"si":1,"sk":1,"sl":1,"es":1,"sv":1,"th":1,"tr":1,"ug":1,"uk":1,"vi":1,"cy":1};}());
/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/


(function(){CKEDITOR.config.jqueryOverrideVal=typeof CKEDITOR.config.jqueryOverrideVal=='undefined'?true:CKEDITOR.config.jqueryOverrideVal;var a=window.jQuery;if(typeof a=='undefined')return;a.extend(a.fn,{ckeditorGet:function(){var b=this.eq(0).data('ckeditorInstance');if(!b)throw 'CKEditor not yet initialized, use ckeditor() with callback.';return b;},ckeditor:function(b,c){if(!CKEDITOR.env.isCompatible)return this;if(!a.isFunction(b)){var d=c;c=b;b=d;}c=c||{};this.filter('textarea, div, p').each(function(){var e=a(this),f=e.data('ckeditorInstance'),g=e.data('_ckeditorInstanceLock'),h=this;if(f&&!g){if(b)b.apply(f,[this]);}else if(!g){if(c.autoUpdateElement||typeof c.autoUpdateElement=='undefined'&&CKEDITOR.config.autoUpdateElement)c.autoUpdateElementJquery=true;c.autoUpdateElement=false;e.data('_ckeditorInstanceLock',true);f=CKEDITOR.replace(h,c);e.data('ckeditorInstance',f);f.on('instanceReady',function(i){var j=i.editor;setTimeout(function(){if(!j.element){setTimeout(arguments.callee,100);return;}i.removeListener('instanceReady',this.callee);j.on('dataReady',function(){e.trigger('setData.ckeditor',[j]);});j.on('getData',function(l){e.trigger('getData.ckeditor',[j,l.data]);},999);j.on('destroy',function(){e.trigger('destroy.ckeditor',[j]);});if(j.config.autoUpdateElementJquery&&e.is('textarea')&&e.parents('form').length){var k=function(){e.ckeditor(function(){j.updateElement();});};e.parents('form').submit(k);e.parents('form').bind('form-pre-serialize',k);e.bind('destroy.ckeditor',function(){e.parents('form').unbind('submit',k);e.parents('form').unbind('form-pre-serialize',k);});}j.on('destroy',function(){e.data('ckeditorInstance',null);});e.data('_ckeditorInstanceLock',null);e.trigger('instanceReady.ckeditor',[j]);if(b)b.apply(j,[h]);},0);},null,null,9999);}else CKEDITOR.on('instanceReady',function(i){var j=i.editor;setTimeout(function(){if(!j.element){setTimeout(arguments.callee,100);return;}if(j.element.$==h)if(b)b.apply(j,[h]);},0);},null,null,9999);});return this;}});if(CKEDITOR.config.jqueryOverrideVal)a.fn.val=CKEDITOR.tools.override(a.fn.val,function(b){return function(c,d){var e=typeof c!='undefined',f;this.each(function(){var g=a(this),h=g.data('ckeditorInstance');if(!d&&g.is('textarea')&&h){if(e)h.setData(c);else{f=h.getData();return null;}}else if(e)b.call(g,c);else{f=b.call(g);return null;}return true;});return e?this:f;};});})();



(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
/*

Holder - 2.0 - client side image placeholders
(c) 2012-2013 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/


var Holder = Holder || {};
(function (app, win) {

var preempted = false,
fallback = false,
canvas = document.createElement('canvas');

//getElementsByClassName polyfill
document.getElementsByClassName||(document.getElementsByClassName=function(e){var t=document,n,r,i,s=[];if(t.querySelectorAll)return t.querySelectorAll("."+e);if(t.evaluate){r=".//*[contains(concat(' ', @class, ' '), ' "+e+" ')]",n=t.evaluate(r,t,null,0,null);while(i=n.iterateNext())s.push(i)}else{n=t.getElementsByTagName("*"),r=new RegExp("(^|\\s)"+e+"(\\s|$)");for(i=0;i<n.length;i++)r.test(n[i].className)&&s.push(n[i])}return s})

//getComputedStyle polyfill
window.getComputedStyle||(window.getComputedStyle=function(e,t){return this.el=e,this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;return t=="float"&&(t="styleFloat"),n.test(t)&&(t=t.replace(n,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null},this})

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
function contentLoaded(n,t){var l="complete",s="readystatechange",u=!1,h=u,c=!0,i=n.document,a=i.documentElement,e=i.addEventListener?"addEventListener":"attachEvent",v=i.addEventListener?"removeEventListener":"detachEvent",f=i.addEventListener?"":"on",r=function(e){(e.type!=s||i.readyState==l)&&((e.type=="load"?n:i)[v](f+e.type,r,u),!h&&(h=!0)&&t.call(n,null))},o=function(){try{a.doScroll("left")}catch(n){setTimeout(o,50);return}r("poll")};if(i.readyState==l)t.call(n,"lazy");else{if(i.createEventObject&&a.doScroll){try{c=!n.frameElement}catch(y){}c&&o()}i[e](f+"DOMContentLoaded",r,u),i[e](f+s,r,u),n[e](f+"load",r,u)}};

//https://gist.github.com/991057 by Jed Schmidt with modifications
function selector(a){
	a=a.match(/^(\W)?(.*)/);var b=document["getElement"+(a[1]?a[1]=="#"?"ById":"sByClassName":"sByTagName")](a[2]);
	var ret=[];	b!=null&&(b.length?ret=b:b.length==0?ret=b:ret=[b]);	return ret;
}

//shallow object property extend
function extend(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c}

//hasOwnProperty polyfill
if (!Object.prototype.hasOwnProperty)
	Object.prototype.hasOwnProperty = function(prop) {
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	}

function text_size(width, height, template) {
	height = parseInt(height,10);
	width = parseInt(width,10);
	var bigSide = Math.max(height, width)
	var smallSide = Math.min(height, width)
	var scale = 1 / 12;
	var newHeight = Math.min(smallSide * 0.75, 0.75 * bigSide * scale);
	return {
		height: Math.round(Math.max(template.size, newHeight))
	}
}

function draw(ctx, dimensions, template, ratio) {
	var ts = text_size(dimensions.width, dimensions.height, template);
	var text_height = ts.height;
	var width = dimensions.width * ratio,
		height = dimensions.height * ratio;
	var font = template.font ? template.font : "sans-serif";
	canvas.width = width;
	canvas.height = height;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = template.background;
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = template.foreground;
	ctx.font = "bold " + text_height + "px " + font;
	var text = template.text ? template.text : (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	var text_width = ctx.measureText(text).width;
	if (text_width / width >= 0.75) {
		text_height = Math.floor(text_height * 0.75 * (width/text_width));
	}
	//Resetting font size if necessary
	ctx.font = "bold " + (text_height * ratio) + "px " + font;
	ctx.fillText(text, (width / 2), (height / 2), width);
	return canvas.toDataURL("image/png");
}

function render(mode, el, holder, src) {
	var dimensions = holder.dimensions,
		theme = holder.theme,
		text = holder.text ? decodeURIComponent(holder.text) : holder.text;
	var dimensions_caption = dimensions.width + "x" + dimensions.height;
	theme = (text ? extend(theme, {
		text: text
	}) : theme);
	theme = (holder.font ? extend(theme, {
		font: holder.font
	}) : theme);
	if (mode == "image") {
		el.setAttribute("data-src", src);
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
		if (fallback || !holder.auto) {
			el.style.width = dimensions.width + "px";
			el.style.height = dimensions.height + "px";
		}
		if (fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			el.setAttribute("src", draw(ctx, dimensions, theme, ratio));
		}
	} else if (mode == "background") {
		if (!fallback) {
			el.style.backgroundImage = "url(" + draw(ctx, dimensions, theme, ratio) + ")";
			el.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";
		}
	} else if (mode == "fluid") {
		el.setAttribute("data-src", src);
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
		if (dimensions.height.substr(-1) == "%") {
			el.style.height = dimensions.height
		} else {
			el.style.height = dimensions.height + "px"
		}
		if (dimensions.width.substr(-1) == "%") {
			el.style.width = dimensions.width
		} else {
			el.style.width = dimensions.width + "px"
		}
		if (el.style.display == "inline" || el.style.display == "") {
			el.style.display = "block";
		}
		if (fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			el.holderData = holder;
			fluid_images.push(el);
			fluid_update(el);
		}
	}
};

function fluid_update(element) {
	var images;
	if (element.nodeType == null) {
		images = fluid_images;
	} else {
		images = [element]
	}
	for (i in images) {
		var el = images[i]
		if (el.holderData) {
			var holder = el.holderData;
			el.setAttribute("src", draw(ctx, {
				height: el.clientHeight,
				width: el.clientWidth
			}, holder.theme, ratio));
		}
	}
}

function parse_flags(flags, options) {

	var ret = {
		theme: settings.themes.gray
	}, render = false;

	for (sl = flags.length, j = 0; j < sl; j++) {
		var flag = flags[j];
		if (app.flags.dimensions.match(flag)) {
			render = true;
			ret.dimensions = app.flags.dimensions.output(flag);
		} else if (app.flags.fluid.match(flag)) {
			render = true;
			ret.dimensions = app.flags.fluid.output(flag);
			ret.fluid = true;
		} else if (app.flags.colors.match(flag)) {
			ret.theme = app.flags.colors.output(flag);
		} else if (options.themes[flag]) {
			//If a theme is specified, it will override custom colors
			ret.theme = options.themes[flag];
		} else if (app.flags.text.match(flag)) {
			ret.text = app.flags.text.output(flag);
		} else if (app.flags.font.match(flag)) {
			ret.font = app.flags.font.output(flag);
		} else if (app.flags.auto.match(flag)) {
			ret.auto = true;
		}
	}

	return render ? ret : false;

};



if (!canvas.getContext) {
	fallback = true;
} else {
	if (canvas.toDataURL("image/png")
		.indexOf("data:image/png") < 0) {
		//Android doesn't support data URI
		fallback = true;
	} else {
		var ctx = canvas.getContext("2d");
	}
}

var dpr = 1, bsr = 1;

if(!fallback){
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
}

var ratio = dpr / bsr;

var fluid_images = [];

var settings = {
	domain: "holder.js",
	images: "img",
	bgnodes: ".holderjs",
	themes: {
		"gray": {
			background: "#eee",
			foreground: "#aaa",
			size: 12
		},
		"social": {
			background: "#3a5a97",
			foreground: "#fff",
			size: 12
		},
		"industrial": {
			background: "#434A52",
			foreground: "#C2F200",
			size: 12
		}
	},
	stylesheet: ".holderjs-fluid {font-size:16px;font-weight:bold;text-align:center;font-family:sans-serif;margin:0}"
};


app.flags = {
	dimensions: {
		regex: /^(\d+)x(\d+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: +exec[1],
				height: +exec[2]
			}
		}
	},
	fluid: {
		regex: /^([0-9%]+)x([0-9%]+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: exec[1],
				height: exec[2]
			}
		}
	},
	colors: {
		regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				size: settings.themes.gray.size,
				foreground: "#" + exec[2],
				background: "#" + exec[1]
			}
		}
	},
	text: {
		regex: /text\:(.*)/,
		output: function (val) {
			return this.regex.exec(val)[1];
		}
	},
	font: {
		regex: /font\:(.*)/,
		output: function (val) {
			return this.regex.exec(val)[1];
		}
	},
	auto: {
		regex: /^auto$/
	}
}

for (var flag in app.flags) {
	if (!app.flags.hasOwnProperty(flag)) continue;
	app.flags[flag].match = function (val) {
		return val.match(this.regex)
	}
}

app.add_theme = function (name, theme) {
	name != null && theme != null && (settings.themes[name] = theme);
	return app;
};

app.add_image = function (src, el) {
	var node = selector(el);
	if (node.length) {
		for (var i = 0, l = node.length; i < l; i++) {
			var img = document.createElement("img")
			img.setAttribute("data-src", src);
			node[i].appendChild(img);
		}
	}
	return app;
};

app.run = function (o) {
	var options = extend(settings, o),
	    images = [], imageNodes = [], bgnodes = [];

	if(typeof(options.images) == "string"){
	    imageNodes = selector(options.images);
	}
	else if (window.NodeList && options.images instanceof window.NodeList) {
		imageNodes = options.images;
	} else if (window.Node && options.images instanceof window.Node) {
		imageNodes = [options.images];
	}

	if(typeof(options.bgnodes) == "string"){
	    bgnodes = selector(options.bgnodes);
	} else if (window.NodeList && options.elements instanceof window.NodeList) {
		bgnodes = options.bgnodes;
	} else if (window.Node && options.bgnodes instanceof window.Node) {
		bgnodes = [options.bgnodes];
	}

	preempted = true;

	for (i = 0, l = imageNodes.length; i < l; i++) images.push(imageNodes[i]);

	var holdercss = document.getElementById("holderjs-style");
	if (!holdercss) {
		holdercss = document.createElement("style");
		holdercss.setAttribute("id", "holderjs-style");
		holdercss.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(holdercss);
	}

	if (!options.nocss) {
	    if (holdercss.styleSheet) {
		    holdercss.styleSheet.cssText += options.stylesheet;
	    } else {
		    holdercss.appendChild(document.createTextNode(options.stylesheet));
	    }
	}

	var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");

	for (var l = bgnodes.length, i = 0; i < l; i++) {
		var src = window.getComputedStyle(bgnodes[i], null)
			.getPropertyValue("background-image");
		var flags = src.match(cssregex);
		var bgsrc = bgnodes[i].getAttribute("data-background-src");

		if (flags) {
			var holder = parse_flags(flags[1].split("/"), options);
			if (holder) {
				render("background", bgnodes[i], holder, src);
			}
		}
		else if(bgsrc != null){
		    var holder = parse_flags(bgsrc.substr(bgsrc.lastIndexOf(options.domain) + options.domain.length + 1)
				.split("/"), options);
		    if(holder){
			render("background", bgnodes[i], holder, src);
		    }
		}
	}

	for (l = images.length, i = 0; i < l; i++) {

		var attr_src = attr_data_src = src = null;

		try{
		    attr_src = images[i].getAttribute("src");
		    attr_datasrc = images[i].getAttribute("data-src");
		}catch(e){}

		if (attr_datasrc == null && !! attr_src && attr_src.indexOf(options.domain) >= 0) {
			src = attr_src;
		} else if ( !! attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
			src = attr_datasrc;
		}

		if (src) {
			var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1)
				.split("/"), options);
			if (holder) {
				if (holder.fluid) {
					render("fluid", images[i], holder, src)
				} else {
					render("image", images[i], holder, src);
				}
			}
		}
	}
	return app;
};

contentLoaded(win, function () {
	if (window.addEventListener) {
		window.addEventListener("resize", fluid_update, false);
		window.addEventListener("orientationchange", fluid_update, false);
	} else {
		window.attachEvent("onresize", fluid_update)
	}
	preempted || app.run();
});

if (typeof define === "function" && define.amd) {
	define("Holder", [], function () {
		return app;
	});
}

})(Holder, window);













(function() {
  console.log('woot');

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//






;
