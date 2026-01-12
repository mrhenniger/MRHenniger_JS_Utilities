"use strict";
/*
    Class:  Components
    What:  A class for generating reactive components in the dom using vanilla Javascript and web components and
           therefore avoiding the need for compiled frameworks.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  January 2025

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  This is only and start, a work in progress.  I plan to add to this class as I have ideas and/or
                     find the need.  If you would like to suggest additional features, I would very much like to hear
                     from you.
 */
class Components extends HTMLElement {
    /*
     * Function:  constructor
     *
     * @param  theParent  The element to which this new element is attached.
     * @param  core          The Dom element of an already established component.
     * @param  newClassName  Used to identify the component family.
     */
    constructor(theParent = null, params = {}, core = null, newClassName = 'Components') {
        // Initialize element properties, attach shadow DOM, etc.
        super();
        this.__createType = theParent === null ? 'dom' : 'js';
        this.__parent = theParent === null ? new Dom(this.parentElement) : theParent;
        // @ts-ignore - Checking for undefined class name
        if (typeof this.className === 'undefined') {
            this.className = typeof newClassName === 'string' ? newClassName : newClassName.str();
        }
        this.__template = null;
        this.__core = null;
        this.__data = {};
        this.__attributes = {};
        this.__handlers = {};
        if (this.className === 'Components') {
            let errorMessage = 'Components::constructor - The base class should not be instantiated';
            window.console.error(errorMessage);
        }
        this.__setTemplate();
        this.__setHandlers();
        // Construction Method #1:  Creating by JS command
        if (theParent !== null) {
            this.__constructParent(theParent, params);
        }
        // Construction Method #2:  Attaching to what is already in the dom
        //                          <input-text class='it-medium it-blue'><input value="${val}" required readonly minLen="1" maxLen="10" len="5" spellcheck="true" placeholder="stuff"/></input-text>
        else if (core !== null) {
            this.__constructCore(core);
        }
        // Construction Method #3:  DOM Instantiated
        //                          <input-text class="1a2b3c4de5" val="abc123" req="false" ro="false" minlen="1" maxlen="10" len="5" spell="true" ph="stuff" size="it-medium" style="it-blue"/>`;
        else {
            this.__constructDom();
        }
    }
    __constructParent(theParent, params) {
        window.console.error('Components::__constructParent - Must be overwritten in the specialized class');
    }
    __constructCore(core) {
        window.console.error('Components::__constructCore - Must be overwritten in the specialized class');
    }
    __constructDom() {
        window.console.error('Components::__constructDom - Must be overwritten in the specialized class');
    }
    connectedCallback() {
        // Called when the element is inserted into the DOM
    }
    disconnectedCallback() {
        // Called when the element is removed from the DOM
        this.delete();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Called when an observed attribute changes
    }
    static get observedAttributes() {
        // Specify which attributes to observe for changes
        //return ['attribute-name'];
        return [''];
    }
    /*
     * Function:  setTemplate
     *
     * Description:  Define the template.  This function must be overwritten in the specialized class.
     *
     * @param  none
     *
     * @return  void
     */
    __setTemplate() {
        window.console.error('Components::__setTemplate must be overwritten in the specialized class');
    }
    /*
     * Function:  setHandlers
     *
     * Description:  Define the handlers.
     *
     * @param  none
     *
     * @return  void
     */
    __setHandlers() {
        window.console.error('Components::__setHandlers must be overwritten in the specialized class');
    }
    /*
     * Function:  addHandlers
     *
     * Description:  Add or modify a handler in the collection.
     *
     * @param  theHandlers  An object containing then handlers to be added to the collection of handlers.
     *
     * @return  void
     */
    addHandlers(theHandlers) {
        this.removeListeners();
        Object.keys(theHandlers).forEach(key => {
            // @ts-ignore - The following line is constructed correctly
            this.__handlers[key] = theHandlers[key];
        });
        this.addListeners();
    }
    /*
     * Function:  parseSubjectAndAction
     *
     * Description:  Extract the subject and action.
     *
     * @param  event The data elements to be revised.
     *
     * @return  object  Returns and object with the subject and action Strings defined.
     */
    parseSubjectAndAction(event) {
        event = typeof event === 'string' ? new Strings(event) : event;
        // Get the action
        let bits = event.explode('_');
        const action = bits[0];
        // Start with the base subject
        let subject = this.__core;
        // Determine if there is a signature to follow to lead to the actual subject
        const size = bits.length;
        if (size > 1 && !bits[1].equals('root')) {
            let signature = new Strings('');
            for (let index = 1; index < size; index++) {
                signature = signature.append(bits[index].prepend(' .'));
            }
            signature = signature.trim();
            // Follow the signature to find the actual subject
            if (!signature.isEmpty()) {
                subject = this.__core.find(signature).first();
            }
        }
        return { subject: subject, action: action };
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
            const target = this.parseSubjectAndAction(event);
            // @ts-ignore - The following line is constructed correctly
            if (!!(target.subject)) {
                // @ts-ignore - The following line is constructed correctly
                target.subject.eventListen(target.action, this.__handlers[event]);
            }
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
            const target = this.parseSubjectAndAction(event);
            // @ts-ignore - The following line is constructed correctly
            if (!!(target.subject)) {
                // @ts-ignore - The following line is constructed correctly
                target.subject.eventRemove(target.action, this.__handlers[event]);
            }
        });
        return true;
    }
    /*
     * Function:  __apply
     *
     * Description:  Install the component in the dom along with the attributes and event handlers.
     *
     * @param  newData  An object containing the data to be applied to the template.
     * @param  newAttributes   An object containing the attributes to be applied to the component.
     * @param  newHandlers  An object containing the handlers for elements in the component.
     *
     * @return  boolean  Returns true for successfully applied and false if otherwise (example not in the dom).
     */
    __apply(newData = {}) {
        if (this.__parent === null) {
            window.console.error(`Components::__apply - No parent for ${this.className}`);
            return false;
        }
        if (this.__createType === 'dom') {
            this.__core = new Dom(this);
        }
        else { // create type is js
            this.__core = Dom.create(this.className, this.__attributes);
            this.__parent.append(this.__core);
        }
        this.removeListeners();
        this.__reapplyData(newData);
        this.addListeners();
        return true;
    }
    /*
     * Function:  __reapplyData
     *
     * Description:  Render the data in the dom.
     *
     * @param  newData  An object containing the data to be applied to the template.
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
     * Function:  reviseData
     *
     * Description:  Allows an individual element, or a set of data elements, to be revised.
     *
     * @param  newData The data elements to be revised.
     *
     * @return  boolean  Returns true at least one item was revised, false otherwise.
     */
    reviseData(newData) {
        let newKeys = Object.keys(newData);
        if (newKeys.length === 0) {
            return false;
        }
        let copy = this.__data;
        newKeys.forEach(key => {
            // @ts-ignore - The following line is constructed correctly
            copy[key] = newData[key];
        });
        this.removeListeners();
        this.__reapplyData(copy);
        this.addListeners();
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
    /*
     * Function:  destroy
     *
     * Description:  Alias for delete.
     *
     * @param  none
     *
     * @return  boolean  Returns false if the component is not in the dom and returns true if the component was
     *                   successfully removed.
     */
    destroy() {
        return this.delete();
    }
    /*
     * Function:  __clearAttributes
     *
     * Description:  Remove all attributes on the dom object other than the class.
     *
     * @param  none
     *
     * @return  void
     */
    __clearAttributes() {
        let atts = [...this.attributes].filter((attr) => attr.name !== 'class');
        while (atts.length > 0) {
            this.removeAttribute(atts[0].name);
            atts = [...this.attributes].filter((attr) => attr.name !== 'class');
        }
    }
    /*
     * Function:  __getAttribute
     *
     * Description:  Return a selected attribute value or a specified default
     *
     * @param  attName  The attribution designation for which the value to be retrieved.
     * @param  dft  The default value to be returned if the attribute does not exist.
     *
     * @return  string  The desired attribute value.
     */
    __getAttribute(attName, dflt = '') {
        var _a;
        attName = typeof attName === 'string' ? attName : attName.str();
        const attArr = [...this.attributes].filter((attr) => attr.nodeName === attName);
        return (attArr.length > 0) ? ((_a = attArr[0].nodeValue) !== null && _a !== void 0 ? _a : dflt) : dflt;
    }
    /*
     * Function:  getCore
     *
     * Description:  Return the contained Dom object.
     *
     * @param  none
     *
     * @return  Dom  The contained Dom object is returned.
     */
    getCore() {
        return this.__core;
    }
    /*
     * Function:  __generateIdentifier
     *
     * Description:  Return the contained Dom object.
     *
     * @param  none
     *
     * @return  string  A string of 10 random upper and lower case alpha characters.
     */
    __generateIdentifier() {
        return new Strings().random(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').str();
    }
}
