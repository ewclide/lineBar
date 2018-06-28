import { createElement }  from './functions';

export class Bar
{
    constructor(options)
    {
        this.element = createElement("div", "bar");
        this.setState(options);
    }

    setState(state)
    {
        this.element.style.left = state.from + "px";
        this.element.style.width = state.to - state.from + "px";
    }
}