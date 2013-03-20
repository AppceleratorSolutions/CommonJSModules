/**
 * TimeLogger
 * Enhanced logger, with information about the current timestamp and the time passed before the previous event.
 *
 * @author Davide Cassenti <davide.cassenti@gmail.com>
 *
 */

(function() {
	var loggers = [];

	/**
	 * TimeLogger
	 * Create a TimeLogger object
	 *
	 * @param id The ID of the logger (it will be printed out as well)
	 */
	function TimeLogger(id) {
		if (!id)
			id = "default";

		if (loggers[id])
			return loggers[id];

		var logger = {};

		logger.timestamp = [];
		// keep track of the different timestamps

		/**
		 * log
		 * Log a message
		 *
		 * @param type Can be either info, warn or error
		 * @param message The message to log
		 */
		logger.log = function(type, message) {
			var now = (new Date()).getTime();

			var diff = 0;
			if (this.timestamp[type] && this.timestamp[type] > 0) {
				diff = now - this.timestamp[type];
			}

			this.timestamp[type] = now;

			// get line number (Android only, iOS does not support the stack apparently)
			var lineNumber = "";
			try {
				throw new Error('');
			} catch(e) {
				if (e.stack) {
					var stack = e.stack.split("\n");
					if (stack[3]) {
						var e = stack[3];
						var start = e.indexOf('(');
						var end = e.indexOf(')');

						if (start >= 0 && end >= 0 && end > start)
							lineNumber = e.substring(start, end + 1);
					}
				} else if (e.backtrace) {
					Ti.API.info(e.backtrace);
					var stack = e.backtrace.split("\n");
					var e = stack[stack.length-1];
					var start = e.lastIndexOf('/');

					if (start >= 0) {
						lineNumber = e.substring(start+1);
					}
				}
			}

			message = "[TimeLogger][" + id + "][" + lineNumber + "][" + now + "][" + diff + "ms]" + ": " + message;

			switch (type) {
				case "info":
					Ti.API.info(message);
					break;
				case "warn":
					Ti.API.warn(message);
					break;
				case "error":
					Ti.API.error(message);
					break;
			}
		}
		/**
		 * info
		 *
		 * @param message The information message to print out
		 */
		logger.info = function(message) {
			this.log('info', message);
		}
		/**
		 * warn
		 *
		 * @param message The warning message to print out
		 */
		logger.warn = function(message) {
			this.log('warn', message);
		}
		/**
		 * error
		 *
		 * @param message The error message to print out
		 */
		logger.error = function(message) {
			this.log('error', message);
		}
		loggers[id] = logger;

		return logger;
	}


	module.exports = TimeLogger;
})();
