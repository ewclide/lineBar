import * as func  from './functions';
import { Carriage } from './carriage';
import { Field } from './field';
import { Bar } from './bar';
import { API } from './api';

var defaults = {
    min      : 0,
    max      : 100,
    from     : 0,
    to       : 100,
    radius   : 10,
    interact : true,
    step     : 0,
    fields   : true,
    width    : "100%",
    onChange : null,
    onClick  : null,
    onReady  : null
}

var attributes = {
    onChange  : "on-change",
    onClick   : "on-click",
    onReady   : "on-ready",
}

export class Linebar
{
    constructor(target, settings = {})
    {
        var self = this;

        // add object to API
        this.id = API.add(this);

        func.getSettings(settings, defaults, attributes, target);

        this.width     = typeof settings.width == "number" ? settings.width + "px" : settings.width;
        this.carSize   = settings.interact ? settings.radius * 2 : 0;
        this.minValue  = settings.min;
        this.maxValue  = settings.max;
        this.fromValue = settings.from;
        this.toValue   = settings.to;
        this.step      = settings.step;

        this.target = target ? target : func.createElement("div");
        this.target.style.width = this.width;

        // special values
        this._special = this._calcSpecial();

        // state in pixels
        this._state = {
            min      : this._valueToPx(this.minValue),
            max      : this._valueToPx(this.maxValue),
            from     : this._valueToPx(this.fromValue),
            to       : this._valueToPx(this.toValue)
        }

        this.leftCar = new Carriage(settings.radius);
        this.rightCar = new Carriage(settings.radius);
        this.bar = new Bar();

        if (settings.fields)
        {
            this.minField = new Field();
            this.minField.onChange = function(value)
            {
                self._updateFromState({
                    from : self._valueToPx(value),
                });
            }

            this.maxField = new Field();
            this.maxField.onChange = function(value)
            {
                self._updateFromState({
                    to : self._valueToPx(value),
                });
            }
        }

        this.setState(settings);

        this.onChange = func.getCallBack(settings.onChange);
        this.onClick  = func.getCallBack(settings.onClick);
        this.onReady  = func.getCallBack(settings.onReady);

        this._createElements(settings);
        this._listenEvents(settings);

        if (typeof this.onReady == "function")
            this.onReady(API.output(this.id)); // return API of this object
    }

    _resize()
    {
        this.target.style.width = this.width;

        this._special = this._calcSpecial();

        this._state.max = this._valueToPx(this.maxValue);
        this._state.min = this._valueToPx(this.minValue);

        this._updateFromState({
            from : this._valueToPx(this.fromValue),
            to   : this._valueToPx(this.toValue)
        });
    }

    _calcSpecial()
    {
        var width = this.target.offsetWidth,
            ration = (this.maxValue - this.minValue) / width;

        return {
            width    : width,
            ration   : ration,
            absCoord : this.target.getBoundingClientRect().left,
            step     : this.step ? this.step / ration : 0
        }
    }

    _createElements(settings)
    {
        this.wrapper = func.createElement("div", "linebar-wrapper");

        var self = this,
            linebar = func.createElement("div", "linebar", { width : "100%" }),
            fields = func.createElement("div", "fields");

        if (settings.fields)
        {
            var fields = func.createElement("div", "fields"),
                apply = func.createElement("button", "apply");

            apply.innerText = "↵";
            apply.onclick = function(){
                self.onClick(self.getState());
            };

            fields.append(
                this.minField.element,
                this.maxField.element,
                apply
            );

            this.wrapper.append(fields);
        }

        linebar.append(
            this.leftCar.element,
            this.rightCar.element,
            this.bar.element
        );

        this.wrapper.append(linebar);
        this.target.append(this.wrapper);
    }

    _listenEvents(settings)
    {
        var self = this;

        document.addEventListener("mousemove", function(e){
            self._updateFromEvent(e);
        });

        if (func.isTouch)
            this.wrapper.addEventListener("touchmove", function(e){
                Array.prototype.forEach.call(
                    e.touches,
                    touch => self._updateFromEvent(touch)
                )
            });

        document.addEventListener("scroll", function(){
            self._special.absCoord = self.target.getBoundingClientRect().left
        });

        window.addEventListener("resize", function(){
            self._resize();
        });
    }

    _updateFromEvent(e)
    {
        var offset = e.clientX - this._special.absCoord,
            target = "";

        if (func.isTouch())
        {
            if (this.leftCar.element === e.target) target = "left";
            else if (this.rightCar.element === e.target) target = "right";
        }
        else
        {
            if (this.leftCar.active) target = "left";
            else if (this.rightCar.active) target = "right";
        }

        if (target == "left")
            this._update({ from : this._filterValue(offset) });

        else if (target == "right")
            this._update({ to : this._filterValue(offset) });
    }

    _updateFromState(state)
    {
        this.leftCar.active = true;
        this.rightCar.active = true;

        this._update(state, true);

        this.leftCar.active = false;
        this.rightCar.active = false;
    }

    _update(state)
    {
        state = this._filterState(state);

        var fromValue = this._pxToValue(state.from),
            toValue = this._pxToValue(state.to);

        this.leftCar.move(state.from);
        this.rightCar.move(state.to);
        this.bar.setState(state);

        this._state.from = state.from;
        this._state.to = state.to;

        if (fromValue != this.fromValue || this.toValue != toValue)
        {
            this.fromValue = fromValue;
            this.toValue = toValue;

            if (this.minField)
                this.minField.setValue(fromValue);

            if (this.maxField)
                this.maxField.setValue(toValue);

            if (typeof this.onChange == "function")
                this.onChange(this.getState());
        }
    }

    _filterValue(value)
    {
        return this._special.step
        ? this._special.step * Math.round(value / this._special.step)
        : value;
    }

    _filterState(state)
    {
        if (state.from === undefined) state.from = this._state.from;
        if (state.to === undefined) state.to = this._state.to;

        if (this.leftCar.active)
        {
            if (state.to - state.from < this.carSize)
                state.from = state.to - this.carSize;

            if (state.from < this._state.min)
                state.from = this._state.min;

            if (state.from > this._state.max - this.carSize)
                state.from = this._state.max - this.carSize;
        }

        if (this.rightCar.active)
        {
            if (state.to - state.from < this.carSize)
                state.to = state.from + this.carSize;

            if (state.to > this._state.max)
                state.to = this._state.max;

            if (state.to < this._state.min + this.carSize)
                state.to = this._state.min + this.carSize;
        }

        return state;
    }

    appendTo(element)
    {
        element = element.length ? element[0] : element;
        element.append(this.target);
        this._resize();
    }

    setState(state)
    {
        this._updateFromState({
            from : this._valueToPx(state.from),
            to   : this._valueToPx(state.to)
        });
    }

    getState()
    {
        return {
            min  : this.minValue,
            max  : this.maxValue,
            from : this.fromValue,
            to   : this.toValue
        }
    }

    _pxToValue(px)
    {
        if (px !== undefined)
            return px * this._special.ration + this.minValue;
    }

    _valueToPx(val)
    {
        if (val !== undefined)
            return (val - this.minValue) / this._special.ration;
    }
}