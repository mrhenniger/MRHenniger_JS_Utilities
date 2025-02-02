"use strict";
/*
    Class:  Components
    What:  A class for generating reactive components in the dom using vanilla Javascript and therefore avoiding the
           need for compiled frameworks.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  January 2025

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  This is only and start, a work in progress.  I plan to add to this class as I have ideas and/or
                     find the need.  If you would like to suggest additional features, I would very much like to hear
                     from you.
 */
class Components {
    /*
     * Function:  constructor
     *
     * @param  theParent  The element to which this new element is attached.
     * @param  newClassName  Used to identify the component family.
     * @param  newMods    The values to be installed in the template.
     * @param  newAttributes  Attributes to be applied to the instance of this component.
     */
    constructor(theParent, newClassName = 'Components') {
        this.__parent = theParent;
        this.className = typeof newClassName === 'string' ? newClassName : newClassName.str();
        this.__template = null;
        this.__core = null;
        this.__data = null;
        this.__attributes = null;
        this.__handlers = null;
        if (this.className === 'Components') {
            let errorMessage = 'Components::constructor - The base class should not be instantiated';
            window.console.error(errorMessage);
        }
    }
    /*
     * Function:  addListeners
     *
     * Description:  Apply a listener for each handler.
     *
     * @param  none
     *
     * @return  boolean  Returns true for successfully removed and false if otherwise (example not in the dom).
     */
    addListeners() {
        if (this.__handlers === null) {
            return false;
        }
        Object.keys(this.__handlers).forEach(event => {
            // @ts-ignore - The following line is constructed correctly
            this.__core.eventListen(event, this.__handlers[event]);
        });
        return true;
    }
    /*
     * Function:  removeListeners
     *
     * Description:  Remove the listener for each handler.
     *
     * @param  none
     *
     * @return  boolean  Returns true for successfully removed and false if otherwise (example not in the dom).
     */
    removeListeners() {
        if (this.__handlers === null) {
            return false;
        }
        Object.keys(this.__handlers).forEach(event => {
            // @ts-ignore - The following line is constructed correctly
            this.__core.eventRemove(event, this.__handlers[event]);
        });
        return true;
    }
    /*
     * Function:  __apply
     *
     * Description:  Install the component in the dom along with the attributes and event handlers.
     *
     * @param  none
     *
     * @return  boolean  Returns true for successfully removed and false if otherwise (example not in the dom).
     */
    __apply(newData = {}, newAttributes = {}, newHandlers = {}) {
        var _a;
        if (this.__parent === null) {
            window.console.error(`Components::__apply - No parent for ${this.className}`);
            return false;
        }
        if (((_a = this.__template) === null || _a === void 0 ? void 0 : _a.className) !== 'Strings') {
            window.console.error(`Components::__apply - Template is not an instance of Strings for ${this.className}`);
            return false;
        }
        // Add to the dom
        this.__attributes = newAttributes;
        this.__core = Dom.create(this.className, this.__attributes);
        if (this.__core) {
            this.__reapplyData(newData);
            // @ts-ignore - Checked for null on this.__parent above
            this.__parent.innerHTMLWipe().append(this.__core);
            // Setup listeners
            this.__handlers = newHandlers;
            this.addListeners();
        }
        else {
            window.console.error(`Components::__apply - Failed to create ${this.className}`);
            return false;
        }
        return true;
    }
    /*
     * Function:  __reapplyData
     *
     * Description:  Render the data in the dom.
     *
     * @param  none
     *
     * @return  boolean  Returns true if the data is successfully rendered with the template, false otherwise.
     */
    __reapplyData(newData = null) {
        var _a;
        if (((_a = this.__template) === null || _a === void 0 ? void 0 : _a.className) !== 'Strings') {
            window.console.error(`Components::__reapplyData - Template is not an instance of Strings for ${this.className}`);
            return false;
        }
        if (newData !== null) {
            this.__data = newData;
        }
        this.__data = this.__data === null ? {} : this.__data;
        let templateCopy = this.__template.duplicate().replace('{{ ', '{{').replace(' }}', '}}');
        Object.keys(this.__data).forEach(key => {
            let findStr = `{{${key}}}`;
            // @ts-ignore - The following line is constructed correctly
            let replaceStr = this.__data[key];
            templateCopy.replace(findStr, replaceStr);
        });
        this.__core.innerHTML(templateCopy);
        return true;
    }
    /*
     * Function:  delete
     *
     * Description:  Remove the component from the dom.
     *
     * @param  none
     *
     * @return  boolean  Returns false if the component is not in the dom and returns true if the component was
     *                   successfully removed.
     */
    delete() {
        // If not in the dom do nothing
        if (this.__core === null) {
            return false;
        }
        // Remove the events
        let status = this.removeListeners();
        // Remove from the dom
        // @ts-ignore - The following line is constructed correctly
        this.__core.delete();
        return status;
    }
}
