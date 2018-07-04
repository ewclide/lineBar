import { Linebar } from './linebar';
import { API } from './api';

API.setMethods(["setState", "getState", "appendTo"]);

$.fn.linebar = function(settings)
{
	var list = [];

	if (this.length)
		this.each(function(){
			var linebar = new Linebar(this, settings);
			this._linebarId = linebar.id;
			list.push(linebar.id);
		});
	
	else
	{
		var linebar = new Linebar(null, settings);
		list.push(linebar.id);
	}

	return API.output(list);
}

$('[data-linebar]').linebar();
	
$.linebar = function(query)
{
	var list = [];

	$(query).each(function(){
		if (this._linebarId) list.push(this._linebarId)
	});

	return API.output(list);
}

