import { createElement }  from './functions';

export class Field
{
    constructor(settings)
    {
        var self = this;

        this.element = createElement("input", { type : "text", value : settings.value });
        this._onChange = settings.onChange;

        this.element.addEventListener("input", function(){
            var value = self.element.value;
            if (isNaN(+value)) value = value.slice(0, -1);
            self.element.value = value;
        });

        this.element.addEventListener("change", function(e){
            self._onChange(self.element.value);
        });
    }

    setValue(value)
    {
        value = Math.round(value);
        this.element.value = value;
    }
}