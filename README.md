#LINEBAR - script for define range of values
-------------

### Description

	it allow define range of values

### Agruments

- min - min value
- max - max value
- from - from value
- to - to value
- step - move step
- radius - radius of arm element
- onchange - function
- onclick - function

-------------

	it have two way for initialize:
	1) create div element with class "linebar" and define attributes wich must begin from "data-linebar-" + option
	2) use javascript notation as you can see below

### Examples

```html
	<div class="linebar"
		 data-linebar-min="0"
		 data-linebar-max="20000"
		 data-linebar-from="5000"
		 data-linebar-to="15000"
		 data-linebar-step="3000"
		 data-linebar-onchange="function(e){ console.log(e); }"
		 data-linebar-onclick="doSomeThing"
	></div>
```

```js
	$('.someclass').linebar({
		min : 0,
		max : 20000,
		from : 5000,
		to : 15000,
		step : 2000,
		onclick : function(e)
		{
			console.log(e);
		},
		onchange : function(e)
		{
			console.log(e);
		}
	});
```

### Result

![linebar on page](linebar.jpg)

-------------
Thank's for using.
Developed by Ustinov Maxim - [ewclide](http://vk.com/ewclide)