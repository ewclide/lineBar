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

	it have two way for initialize:
	1) create div element with class "linebar" and define attributes wich must begin "from data-linebar-" + option
	2) use javascript notation as you can see below

### Examples

```js
	$('.someclass').linebar({
		min : 0,
        max : 20000,
        from : 5000,
        to : 15000,
        step : 2000
	});
```

### Result

![linebar on page](linebar.jpg)

-------------
Thank's for using.
Developed by [ewclide](http://vk.com/ewclide)