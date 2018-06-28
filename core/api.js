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

	_call(target, name, data)
	{
		var result = [];

		target._listId.forEach((id) => {

			let value, subObject = this._listId[id];

			if (subObject && typeof subObject[name] == "function")
				value = subObject[name](data);

			if (value !== undefined)
				result.push(value);

		});

		return result.length == 1 ? result[0] : result;
	}

	setMethods(methods)
	{
		var self = this;

		methods.forEach(method => {
			Output.prototype[method] = function(data){
				return self._call(this, method, data);
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

export var API = new APIClass;