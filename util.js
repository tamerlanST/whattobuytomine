function doHttpRequest(options, callback) {
	var url;

	if (typeof options === "string") {
		url = options;
		options = {};
	} else {
		if (!options) options = {};
		url = options.url;
	}

	var method = options.method || "GET",
	    headers = options.headers || [],
	    body = options.body,
	    dataType = options.dataType || "json",
	    timeout = options.timeout || 10000;

	var old_callback = callback;
	callback = function() {
		callback = function(){}; // ignore all non-first calls
		old_callback.apply(this, arguments);
	};

	var request = new XMLHttpRequest();

	setTimeout(function() {
		// ensure timeout
		callback({msg: "fetch_timeout", request: request, opts: options});
	}, timeout);

	request.addEventListener("load", function() {
		if (typeof request.responseText === "string") {
			if (dataType !== "json") {
				callback(null, request.responseText);
				return;
			}

			var parsed;

			try {
				parsed = JSON.parse(request.responseText);
			} catch (e) {
				callback(e);
				return;
			}

			if (parsed) {
				callback(null, parsed);
			} else {
				callback({msg: "bad response", request: request});
			}
		} else {
			callback({msg: "no response text", request: request});
		}
	});
	request.addEventListener("error", function() {
		callback({msg: "request_error", request: request});
	});

	request.open(method, url, true /*async*/);

	request.timeout = timeout;
	request.responseType = "";

	headers.forEach(function(header) {
		try {
			request.setRequestHeader(header[0], header[1]);
		} catch (e) {
			WialonHosting.Log.captureException(e);
		}
	});

	try {
		if (body) request.send(body);
		else request.send();
	} catch (e) {
		WialonHosting.Log.captureException(e);

		callback({exception: e, type: 'send'});
	}
};