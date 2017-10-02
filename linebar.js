(function(){

    function isTouch()
    {
        return ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;
    }

    class Arm
    {
        constructor(options)
        {
            var self = this;

            this.elem = document.createElement("div");
            this.elem.setAttribute('class', 'arm');

            this.radius = options.radius;
            this.pos = options.pos;

            this.touch = false;
            this.active = true;

            this.elem.style.width = this.radius * 2 + "px";
            this.elem.style.height = this.radius * 2 + "px";

            this.listenEvents();

            this.move(options.pos);
            this.active = false;
        }

        listenEvents()
        {
            var self = this;

            this.elem.ondragstart = function()
            {
                return false;
            }

            if (isTouch())
            {
                this.elem.addEventListener("touchstart", function(e){
                    self.active = true;
                    self.touch = e.touches[0];
                });

                document.addEventListener("touchend", function(){
                    self.active = false;
                    self.touch = false;
                });
            }
            else
            {
                this.elem.addEventListener("mousedown", function(){
                    self.active = true;
                });

                document.addEventListener("mouseup", function(){
                    self.active = false;
                });
            }
        }

        move(pos)
        {
            if (this.active)
            {
                this.elem.style.left = pos - this.radius + "px";
                this.pos = pos;
            }
        }
    }

    class Bar
    {
        constructor(options)
        {
            this.elem = document.createElement("div");
            this.elem.setAttribute('class', 'bar');
            this.from = options.from;
            this.to = options.to;
            this.setState(options);
        }

        setState(state)
        {
            this.elem.style.left = state.from + "px";
            this.elem.style.width = state.to - state.from + "px";
            this.from = state.from;
            this.to = state.to;
        }
    }

    class Field
    {
        constructor(value)
        {
            var self = this;
            this.value = value;
            this.elem = document.createElement("input");
            this.elem.setAttribute('type', 'text');
            this.elem.value = value;
        }

        setValue(value)
        {
            value = Math.round(value);
            this.elem.value = value;
            this.value = value;
        }
    }

    class LineBar
    {
        constructor(options)
        {
            

            var self = this;

            this.elem = options.elem;

            // options
            var minValue = options.min || parseInt(this.elem.attr("data-linebar-min")) || 0,
                maxValue = options.max || parseInt(this.elem.attr("data-linebar-max")) || 100,
                formValue = options.from || parseInt(this.elem.attr("data-linebar-from")) || minValue,
                toValue = options.to || parseInt(this.elem.attr("data-linebar-to")) || maxValue,
                radius = options.radius || parseInt(this.elem.attr("data-linebar-arm-radius")) || 10,
                step = options.step || parseInt(this.elem.attr("data-linebar-step")) || 0,
                changeFunc = options.onchange || this.elem.attr("data-linebar-onchange") || false,
                clickFunc = options.onclick || this.elem.attr("data-linebar-onclick") || false;

                //console.log(changeFunc)

            if (typeof changeFunc == "string")
                changeFunc = eval("(function(){ return " + this.elem.attr("data-linebar-onchange") + "})()");
            
            if (typeof clickFunc == "string")
                clickFunc = eval("(function(){ return " + this.elem.attr("data-linebar-onclick") + "})()");
            
            // append main wrapper
            this.wrapper = document.createElement("div");
            this.wrapper.setAttribute('class', 'linebar-wrapper');
            this.wrapper.style.width = "100%";
            this.elem.append(this.wrapper);

            // special values
            this.width = this.wrapper.getBoundingClientRect().width; // max right position
            this.absCoord = this.wrapper.getBoundingClientRect().left; //absolute left position
            this.ration = (maxValue - minValue) / this.width; // value per pixel
            this.step = step ? step / this.ration : 0; // value step converted to pixel step for moving

            // object of system state
            this.state = {
                maxValue : maxValue,
                minValue : minValue,
                min : 0,
                max : this.width,
                fromValue : formValue,
                toValue : toValue,
                from : this.valueToPx(formValue),
                to : this.valueToPx(toValue),
            }
            
            // active components
            this.leftArm = new Arm({
                radius : radius,
                pos : this.state.from
            });
            this.rightArm = new Arm({
                radius : radius,
                pos : this.state.to
            });
            this.bar = new Bar({
                from : this.state.from,
                to : this.state.to
            });
            this.minField = new Field(formValue || minValue);
            this.maxField = new Field(toValue || maxValue);

            this.mousePos = 0;

            // add apply button
            if (clickFunc && typeof clickFunc == "function")
            {
                this.button = document.createElement("button");
                this.button.innerText = '↵';
                this.button.onclick = function()
                {
                    clickFunc(self.state);
                }
            }

            document.addEventListener("mousemove", function(e){
                self.updateFromEvent({
                    pos : e.clientX,
                    change : changeFunc
                });
            });

            document.addEventListener("touchmove", function(e){
                for (var i = 0; i < e.touches.length; i++)
                    self.updateFromEvent({
                        pos : e.touches[i].clientX,
                        target : e.touches[i].target,
                        change : changeFunc
                    });
            });

            this.minField.elem.addEventListener("change", function(e){
                self.updateFromState({
                    from : self.valueToPx(e.target.value),
                    change : changeFunc
                });
            });

            this.maxField.elem.addEventListener("change", function(e){
                self.updateFromState({
                    to : self.valueToPx(e.target.value),
                    change : changeFunc
                });
            });

            document.addEventListener("scroll", function(){
                self.absCoord = self.wrapper.getBoundingClientRect().left;
            });

            window.addEventListener("resize", function(){
                self.absCoord = self.wrapper.getBoundingClientRect().left;
            });

            this.create();
        }

        /*filterInctrement(data)
        {
            var increment = data.increment;

            if (data.step)
            {
                if (increment > 0) increment = data.step;
                else if (increment < 0) increment = -data.step;
            }

            if (increment + data.value < data.border.from) increment = data.value - data.border.from;
            else if (increment + data.value > data.border.to) increment = data.border.to - data.value;
            else if (increment + data.value == data.border.from || increment + data.value == data.border.to) increment = 0;

            return increment;
        }*/

        filterValue(data)
        {
            var distance = data.distance;

            if (data.step) distance = data.step * Math.round(distance / data.step);

            if (distance < data.border.from) distance = data.border.from;
            else if (distance > data.border.to) distance = data.border.to;

            return distance;
        }

        updateFromState(opt)
        {
            var radius = this.leftArm.radius,
                data = {
                    from : this.state.from,
                    to : this.state.to,
                    change : opt.change
                };

            if (opt.from)
                data.from = this.filterValue({
                    distance : opt.from,
                    step : this.step,
                    border : {
                        from : this.state.min,
                        to : this.state.to - radius * 2
                    }
                });

            if (opt.to)
                data.to = this.filterValue({
                    distance : opt.to,
                    step : this.step,
                    border : {
                        from : this.state.from + radius * 2,
                        to : this.state.max
                    }
                });

            this.leftArm.active = true;
            this.rightArm.active = true;

            this.update(data);

            this.leftArm.active = false;
            this.rightArm.active = false;
        }

        updateFromEvent(opt)
        {
            var distance = opt.pos - this.absCoord,
                    radius = this.leftArm.radius,
                    target = "",
                    data = {
                        from : this.state.from,
                        to : this.state.to,
                        change : opt.change
                    };

            if (opt.target)
            {
                if (this.leftArm.elem === opt.target) target = "left";
                else if (this.rightArm.elem === opt.target) target = "right";
            }
            else
            {
                if (this.leftArm.active) target = "left";
                else if (this.rightArm.active) target = "right";
            }

            if (target == "left")
            {
                distance = this.filterValue({
                    distance : distance,
                    step : this.step,
                    border : {
                        from : this.state.min,
                        to : this.state.to - radius * 2
                    }
                });

                data.from = distance;

                this.update(data);
            }
            else if (target == "right")
            {
                distance = this.filterValue({
                    distance : distance,
                    step : this.step,
                    border : {
                        from : this.state.from + radius * 2,
                        to : this.state.max
                    }
                });

                data.to = distance;

                this.update(data);
            }

            // ************* INCREMENT MODE ****************
            /*var increment = e.clientX - this.mousePos,
                    radius = this.leftArm.radius,
                    data = {
                        from : this.state.from,
                        to : this.state.to
                    }

                this.mousePos = e.clientX;

                if (this.leftArm.active)
                {
                    increment = this.filterInctrement({
                        value : this.state.from,
                        increment : increment,
                        step : this.step,
                        border : {
                            from : this.state.min,
                            to : this.state.to - radius * 2
                        }
                    });

                    data.from += increment;

                    this.update(data);
                }
                else if (this.rightArm.active)
                {
                    increment = this.filterInctrement({
                        value : this.state.to,
                        increment : increment,
                        step : this.step,
                        border : {
                            from : this.state.from + radius * 2,
                            to : this.state.max
                        }
                    });

                    data.to += increment;

                    this.update(data);
                }*/
        }

        update(data)
        {
            this.leftArm.move(data.from);
            this.rightArm.move(data.to);
            this.bar.setState(data);
            this.minField.setValue(this.pxToValue(data.from));
            this.maxField.setValue(this.pxToValue(data.to));
            this.state.from = data.from;
            this.state.to = data.to;
            this.state.fromValue = this.minField.value;
            this.state.toValue = this.maxField.value;

            if (typeof data.change == "function")
                data.change({
                    max : this.state.maxValue,
                    min : this.state.minValue,
                    from : this.state.fromValue,
                    to : this.state.toValue
                });
        }

        pxToValue(px)
        {
            return px * this.ration;
        }

        valueToPx(val)
        {
            return val / this.ration;
        }

        create()
        {
            var self = this;

            var box = document.createElement("div");
                box.setAttribute('class', 'linebar-box');

            var line = document.createElement("div");
                line.setAttribute('class', 'line');

            var fields = document.createElement("div");
                fields.setAttribute('class', 'linebar-fields');

            this.wrapper.append(fields);
            this.wrapper.append(box);

            this.multyAppend(box, [ this.leftArm.elem, this.rightArm.elem, this.bar.elem, line ]);
            this.multyAppend(fields, [ this.minField.elem, this.maxField.elem, this.button ]);
        }

        multyAppend(place, elems)
        {
            elems.forEach(function(elem){
                if (elem !== undefined)
                    place.append(elem);
            });
        }
    }

    $.fn.linebar = function(options)
    {
        this.each(function(){
            if (options) options.elem = $(this);
            else options = { elem: $(this) };
            this.linebar = new LineBar(options);
        });
    }

    $(document).ready(function(){
        $('.linebar').linebar();
    });

})();
