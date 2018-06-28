import { Linebar } from './linebar';
import { API } from './api';

API.setMethods(["setState", "getState", "setup"]);

$.fn.linebar = function(settings)
{
	this.each(function(){
		var linebar = new Linebar(this, settings);
		this._linebarId = linebar.id;
	});
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

