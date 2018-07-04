import { createElement }  from './functions';

export class Bar
{
    constructor()
    {
        this.element = createElement("div", "bar");
        this.element.ondragstart = function(){ return false; }
    }

    setState(state)
    {
        this.element.style.left = state.from + "px";
        this.element.style.width = state.to - state.from + "px";
    }
}