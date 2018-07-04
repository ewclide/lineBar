import { createElement, isTouch } from "./functions";

export class Carriage
{
	constructor(radius)
	{
		var self = this;

		this.radius = radius;
		this.active = true;

		this.element = createElement(
			"div",
			"carriage",
			{ 
				position : "absolute",
				left     : 0,
				top      : 0,
				margin   : "auto",
				width    : (this.radius * 2) + "px",
				height   : (this.radius * 2) + "px"
			}
		);

		this.element.ondragstart = function(){ return false; }

		this._listenEvents();
	}

	_listenEvents()
	{
		var self = this;

		if (isTouch())
		{
			this.element.addEventListener("touchstart", function(e){
				self.active = true;
			});

			document.addEventListener("touchend", function(){
				self.active = false;
			});
		}
		else
		{
			this.element.addEventListener("mousedown", function(){
				self.active = true;
			});

			document.addEventListener("mouseup", function(){
				self.active = false;
			});
		}
	}

	move(offset)
	{
		if (this.active)
			this.element.style.transform = "translateX(" + (offset - this.radius) + "px)";
	}
}