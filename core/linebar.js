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

        this.target = target;
        func.getSettings(settings, defaults, attributes, target);

        if (settings.width)
            this.target.style.width = settings.width + "px";

        this.onChange = func.getCallBack(settings.onChange);
        this.onClick  = func.getCallBack(settings.onClick);
        this.onReady  = func.getCallBack(settings.onReady);

        // special values
        this.width = typeof settings.width == "number" ? settings.width : this.target.offsetWidth; // max right position
        this.absCoord = this._getAbsoluteCoord(); //absolute left position
        this.ration = (settings.max - settings.min) / this.width; // value per pixel
        this.step = settings.step ? settings.step / this.ration : 0; // value step converted to pixel step for moving
        this.carSize = settings.interact ? settings.radius * 2 : 0;

        // object of system state
        this._state = {
            minValue : settings.min,
            maxValue : settings.max,
            fromValue: settings.from,
            toValue  : settings.to,
            min      : 0,
            max      : this.width,
            from     : this._valueToPx(settings.from),
            to       : this._valueToPx(settings.to),
        }

        this.leftCar = new Carriage({
            radius : settings.radius,
            offset : this._state.from
        });

        this.rightCar = new Carriage({
            radius : settings.radius,
            offset : this._state.to
        });

        this.bar = new Bar({
            from : this._state.from,
            to   : this._state.to
        });

        if (settings.fields)
        {
            this.minField = new Field({
                value : settings.from || settings.min,
                onChange : function(value)
                {
                    self._updateFromPx({
                        from : self._valueToPx(value),
                    });
                }
            });
            this.maxField = new Field({
                value : settings.to || settings.max,
                onChange : function(value)
                {
                    self._updateFromPx({
                        to : self._valueToPx(value),
                    });
                }
            });
        }

        this._createElements(settings);
        this._listenEvents(settings);

        if (typeof this.onReady == "function")
            this.onReady(API.output(this.id)); // return API of this object
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
            self.absCoord = self._getAbsoluteCoord();
        });

        window.addEventListener("resize", function(){
            self.absCoord = self._getAbsoluteCoord();
        });
    }

    _updateFromEvent(e)
    {
        var offset = e.clientX - this.absCoord,
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
        {
            offset = this._filterValue(offset, {
                step : this.step,
                min  : this._state.min,
                max  : this._state.to - this.carSize
            });

            this._update({
                from : offset,
                to   : this._state.to
            });
        }
        else if (target == "right")
        {
            offset = this._filterValue(offset, {
                step : this.step,
                min  : this._state.from + this.carSize,
                max  : this._state.max
            });

            this._update({
                from : this._state.from,
                to   : offset
            });
        }

    }

    _updateFromPx(state)
    {
        if (state.from === undefined) state.from = this._state.from;
        if (state.to === undefined) state.to = this._state.to;
        if (state.to - state.from < this.carSize) state.to = state.from + this.carSize;

        state.to = this._filterValue(state.to, {
            min  : state.from + this.carSize,
            max  : this._state.max
        });

        state.from = this._filterValue(state.from, {
            min  : this._state.min,
            max  : state.to - this.carSize
        });

        this.leftCar.active = true;
        this.rightCar.active = true;

        this._update(state);

        this.leftCar.active = false;
        this.rightCar.active = false;
    }

    _update(state)
    {
        var fromValue = this._pxToValue(state.from),
            toValue = this._pxToValue(state.to);

        this.leftCar.move(state.from);
        this.rightCar.move(state.to);
        this.bar.setState(state);

        if (this.minField)
            this.minField.setValue(fromValue);

        if (this.maxField)
            this.maxField.setValue(toValue);

        this._state.from = state.from;
        this._state.to = state.to;
        this._state.fromValue = fromValue;
        this._state.toValue = toValue;

        if (typeof this.onChange == "function")
            this.onChange(this.getState());
    }

    setState(state)
    {
        this._updateFromPx({
            from : this._valueToPx(state.from),
            to   : this._valueToPx(state.to)
        });
    }

    getState()
    {
        return {
            min  : this._state.minValue,
            max  : this._state.maxValue,
            from : this._state.fromValue,
            to   : this._state.toValue
        }
    }

    _filterValue(value, data)
    {
        if (data.step)
            value = data.step * Math.round(value / data.step);

        if (value < data.min) value = data.min;
        else if (value > data.max) value = data.max;

        return value;
    }

    _pxToValue(px)
    {
        return px === undefined ? px : px * this.ration;
    }

    _valueToPx(val)
    {
        return val === undefined ? val : val / this.ration;
    }

    _getAbsoluteCoord()
    {
        return this.target.getBoundingClientRect().left;
    }
}