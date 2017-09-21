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

            this.parent = options.parent;
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

        listenEvents()
        {
            
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
            this.elem.addEventListener("change", function(e){
                //action
            });
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
                formValue = options.from || parseInt(this.elem.attr("data-linebar-from")) || 0,
                toValue = options.to || parseInt(this.elem.attr("data-linebar-to")) || 100,
                radius = options.radius || parseInt(this.elem.attr("data-linebar-arm-radius")) || 10,
                step = options.step || parseInt(this.elem.attr("data-linebar-step")) || 0;
            
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
                from : this.valueToPx(formValue),
                to : this.valueToPx(toValue),
                min : 0,
                max : this.width
            }
            
            // active components
            this.leftArm = new Arm({
                radius : radius,
                parent : this,
                pos : this.state.from
            });
            this.rightArm = new Arm({
                radius : radius,
                parent : this,
                pos : this.state.to
            });
            this.bar = new Bar({
                from : this.state.from,
                to : this.state.to
            });
            this.minField = new Field(formValue || minValue);
            this.maxField = new Field(toValue || maxValue);

            this.mousePos = 0;

            document.addEventListener("mousemove", function(e){

                /*var increment = e.clientX - self.mousePos,
                    radius = self.leftArm.radius,
                    data = {
                        from : self.state.from,
                        to : self.state.to
                    }

                self.mousePos = e.clientX;

                if (self.leftArm.active)
                {
                    increment = self.filterInctrement({
                        value : self.state.from,
                        increment : increment,
                        step : self.step,
                        border : {
                            from : self.state.min,
                            to : self.state.to - radius * 2
                        }
                    });

                    data.from += increment;

                    self.update(data);
                }
                else if (self.rightArm.active)
                {
                    increment = self.filterInctrement({
                        value : self.state.to,
                        increment : increment,
                        step : self.step,
                        border : {
                            from : self.state.from + radius * 2,
                            to : self.state.max
                        }
                    });

                    data.to += increment;

                    self.update(data);
                }*/

                var distance = e.clientX - self.absCoord,
                    radius = self.leftArm.radius,
                    data = {
                        from : self.state.from,
                        to : self.state.to
                    };

                if (self.leftArm.active)
                {
                    distance = self.filterValue({
                        distance : distance,
                        step : self.step,
                        border : {
                            from : self.state.min,
                            to : self.state.to - radius * 2
                        }
                    });

                    data.from = distance;

                    self.update(data);
                }
                else if (self.rightArm.active)
                {
                    distance = self.filterValue({
                        distance : distance,
                        step : self.step,
                        border : {
                            from : self.state.from + radius * 2,
                            to : self.state.max
                        }
                    });

                    data.to = distance;

                    self.update(data);
                }
            });

            document.addEventListener("scroll", function(){
                self.absCoord = self.wrapper.getBoundingClientRect().left;
            });

            window.addEventListener("resize", function(){
                self.absCoord = self.wrapper.getBoundingClientRect().left;
            });

            this.create();
        }

        filterValue(data)
        {
            var distance = data.distance;

            if (data.step) distance = data.step * Math.round(distance / data.step);

            if (distance < data.border.from) distance = data.border.from;
            else if (distance > data.border.to) distance = data.border.to;

            return distance;
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

        update(data)
        {
            this.leftArm.move(data.from);
            this.rightArm.move(data.to);
            this.bar.setState(data);
            this.minField.setValue(this.pxToValue(data.from));
            this.maxField.setValue(this.pxToValue(data.to));
            this.state.from = data.from;
            this.state.to = data.to;
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
            this.multyAppend(fields, [ this.minField.elem, this.maxField.elem ]);
        }

        multyAppend(place, elems)
        {
            elems.forEach(function(elem){
                place.append(elem);
            });
        }
    }

    $.fn.linebar = function(options)
    {
        console.log(options)
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
