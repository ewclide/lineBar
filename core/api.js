class Output
{
	constructor(id)
	{
		this._listId = [].concat(id);
	}
}

class APIClass
{
	constructor()
	{
		this._listId = {};
	}

	_call(target, name, args)
	{
		var result = [];

		target._listId.forEach((id) => {

			let value, obj = this._listId[id];

			if (obj && typeof obj[name] == "function")
				value = obj[name].apply(obj, args);

			if (value !== undefined)
				result.push(value);
		});

		return result.length == 1 ? result[0] : result;
	}

	setMethods(methods)
	{
		var self = this;

		methods.forEach(method => {
			Output.prototype[method] = function(){
				return self._call(this, method, arguments);
			}
		});
	}

	add(target)
	{
		var id = Math.random();
		this._listId[id] = target;
		return id;
	}

	output(id)
	{
		return new Output(id);
	}
}

export var API = new APIClass();