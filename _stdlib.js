window.el = (nme) => document.createElement(nme);
window.txt = (txt) => document.createTextNode(txt);
window.anychange = (itms, cb) => (itms.forEach(itm => itm.oninput = () => cb()), cb());
window.body = document.getElementById("maincontent") || document.body;
Node.prototype.attr = function(atrs) {Object.entries(atrs).forEach(([k, v]) => this.setAttribute(k, v)); return this;};
Node.prototype.adto = function(prnt) {prnt.appendChild(this); return this;};
Node.prototype.adch = function(chld) {this.appendChild(chld); return this;};
Node.prototype.atxt = function(txta) {this.appendChild(txt(txta)); return this;};
Node.prototype.onev = function(evnm, cb) {this.addEventListener(evnm, cb); return this;};
Node.prototype.drmv = function(defer) {defer(() => this.remove()); return this;};
Node.prototype.clss = function(clss) {clss.split(".").filter(q => q).map(itm => this.classList.add(itm)); return this;};
Object.prototype.dwth = function(cb) {cb(this); return this;};
Object.defineProperty(Array.prototype, "last", {get: function() {return this[this.length - 1]}});

window.makeDefer = () => {
	let list = [];
	let res = cb => {list.unshift(cb)};
	res.cleanup = () => {list.forEach(cb => cb())};
	return res;
};
