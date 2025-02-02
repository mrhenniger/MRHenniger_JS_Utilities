/*
    This is a module used for testing components.ts.
 */
class ComponentsTest extends Components {
    private __counter: number;

    constructor(theParent: Dom, newData: object = {}, newAttributes: object = {}) {
        super(theParent, 'ComponentsTest');
        this.__counter = 0;
        this.__template = new Strings(`<div class="inner">{{ label }}</div>`);

        // @ts-ignore - Creating property 'label' here
        newData.label = "SAMPLE LABEL";

        let newHandlers = {};
        // @ts-ignore - The following line is constructed correctly
        newHandlers.click = () => {
            this.__counter++;
            let newLabel = `Counter:  ${this.__counter}`;
            this.__reapplyData({
                label: newLabel
            });
            if (this.__counter === 10) {
                this.delete();
            }
        };

        this.__apply(newData, newAttributes, newHandlers);
    }
}
