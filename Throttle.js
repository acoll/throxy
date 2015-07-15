var Transform = require('stream').Transform;
var util = require('util');

function Throttle (bytesPerSecond) {
	this.intendedSpeed = bytesPerSecond || 1024 * 100;
	this.speed = 0;
	this.totalBytes = 0;

	Transform.call(this, {});
}

util.inherits(Throttle, Transform);

Throttle.prototype._transform = function (chunk, encoding, fn) {
	if(this.totalBytes === 0) this.start = process.hrtime();
	this.totalBytes += chunk.length;

	var delay = (chunk.length / this.intendedSpeed) * 1000;

	var delayedPush = function () {
		this.push(chunk);
		fn();
	}.bind(this);

	setTimeout(delayedPush, delay);

};

Throttle.prototype._flush = function (fn) {
	fn();
};

Throttle.prototype.calculateDelay = function (i) {
	return i / this.intendedSpeed
};

Throttle.prototype.calculateSpeed = function () {
	var elapsed = process.hrtime(this.start);

	var seconds = elapsed[0] + elapsed[1] / 1000000000;

	var bytesPerSecond = (this.totalBytes / seconds);
	return bytesPerSecond;
}

module.exports = Throttle;