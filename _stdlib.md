`el("div")` - `document.createElement` alias

`txt("some text")` - `document.createTextNode` alias

`anychange([one, two, three], e => {})` - sets .oninput of each  item in the list to the callback

`body` - the main element to add things to. `#maincontent || document.body`.

---

(all chainable)

`Node.attr(attributes)` - set attributes, chainable. eg `el("input").attr({placeholder: "hi"})`.

`Node.adto(parent)` - add node as a child to parent, chainable. eg: `el("div").adto(body)`.

`Node.adch(child)` - add child as a child to node, chainable. eg: `body.adch(el("div"))`.

`Node.atxt(text)` - append text node, chainable. eg: `el("button").atxt("+")`.

`Node.onev(evnme, cb)` - shortcut to addEventListener. bubbling active only. eg: `el("button").onev("click", e => {})`.

`Node.drmv(defer)` - defer removal of this node. chainable. eg: `el("button").adto(body).drmv(defer)`.

`Node.clss(class)` - set node classes. eg: `el("button").clss(".clickable.down.click")`

`Object.dwth(wtd)` - do something with an object, return the object. eg: `({a: 1}).dwth(obj => obj.a = 2)`

`Array.last` - get the last item of an array. eg: `[1, 2, 3].last === 3`

---

(complicated)

> `makeDefer()`
> 
> example:
> 
> ```js
> let defer = makeDefer();
> defer(() => console.log("2"));
> defer(() => console.log("1"));
> defer.cleanup();
> ```
> 
> output:
> 
> ```
> 1
> 2
> ```
> 
> deferred things will cleanup in reverse order.
> make sure to call defer.cleanup() at every return.
