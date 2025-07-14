/*
    Class:  Dom
    What:  A class which simplifies interactions with the dom, intended to be a lightweight alternate to JQuery.  What
           you are seeing here is just a first draft, but has been very useful in another project.  I expected to add
           class.  Looking for suggests of features to add.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  September 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class Dom implements Named {
    className: string;
    private __core: any;
    private __svgCache: object;
    static __components: object;
    // other member data goes here

    /*
     * Function:  constructor
     *
     * @param  any  The function handles, null, string, Strings, Dom and HTMLElement.  All others will be ignored.
     */
    constructor(ref: any = null) {
        this.className = "Dom";
        this.__core = null;
        ref = ref?.name === "Strings" ? ref.str() : ref;

        this.__svgCache = {};

        let refType = typeof ref;
        if (ref === null || ref === 'body') {
            let temp = document.getElementsByTagName('body');
            this.__core = temp[0];
        } else if (ref === 'head') {
            let temp = document.getElementsByTagName('head');
            this.__core = temp[0];
        } else if (refType === 'string') {
            let temp = document.getElementsByTagName(ref);
            this.__core = temp.length > 0 ? temp[0] : null; // In the constructor we assume the first
        } else if (ref?.className === 'Dom') {
            this.__core = ref.getCore();
        } else if (
            refType === 'object'
            && (
                (typeof ref.name === 'undefined')
                || (ref.name === '')
            )
            && typeof ref.ownerDocument !== 'undefined'
        ) {
            this.__core = ref;
        } else {
            window.console.error('Dom::constructor - Unrecognized ref', ref);
        }
    }

    /*
     * Function:  delete
     *
     * Description:  Removes the element from the dom.
     *
     * @param  none
     *
     * @return  boolean  Returns true for successfully removed and false if otherwise (example not in the dom).
     */
    public delete(): boolean {
        if (!this.__core) {
            return false;
        }

        this.__core.remove();
        delete this.__core;
        this.__core = null;

        return true;
    }

    /*
     * Function:  getCore
     *
     * Description:  An accessor for the wrapped array of Dom elements.
     *
     * @param  none
     *
     * @return  string  The wrapped array of Dom elements.
     */
    public getCore(): null|HTMLElement {
        return this.__core;
    }
    
    /*
     * Function:  innerHTML
     *
     * Description:  Wraps the HTMLElement attribute innerHTMl allowing content of the between the opening and closing
     *               tags to be manipulated.
     *
     * @param  newVal  When the parameter is null the innerHTML contents is returned as-is.  When the parameter is a
     *                 string the content of the innerHTML is replaced.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public innerHTML(newVal: null|string|Strings = null): Strings|Dom {
        if (newVal === null) {
            return new Strings(this.__core.innerHTML);
        }

        newVal = typeof newVal === 'string' ? newVal : newVal.str(); // Ensure eleID is a string

        this.__core.innerHTML = newVal;
        return this;
    }

    /*
     * Function:  innerHTMLPrepend
     *
     * Description:  Wraps the HTMLElement attribute innerHTMl allowing content of the between the opening and closing
     *               tags to be manipulated by prepending it with the content provided in the parameter.
     *
     * @param  newContent  The content to be added at the start of the innerHTML content.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public innerHTMLPrepend(newContent: string|Strings): Dom {
        newContent = typeof newContent === 'string' ? newContent : newContent.str(); // Ensure eleID is a string
        this.__core.innerHTML = newContent + this.__core.innerHTML;
        return this;
    }

    /*
     * Function:  innerHTMLAppend
     *
     * Description:  Wraps the HTMLElement attribute innerHTMl allowing content of the between the opening and closing
     *               tags to be manipulated by appending it with the content provided in the parameter.
     *
     * @param  newContent  The content to be added at the end of the innerHTML content.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public innerHTMLAppend(newContent: string|Strings): Dom {
        newContent = typeof newContent === 'string' ? newContent : newContent.str(); // Ensure eleID is a string
        this.__core.innerHTML = this.__core.innerHTML + newContent;
        return this;
    }

    /*
     * Function:  innerHTMLWipe
     *
     * Description:  Remove all contents between the opening and closing tags.
     *
     * @param  none
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public innerHTMLWipe(): Dom {
        this.innerHTML('');
        return this;
    }

    /*
     * Function:  find
     *
     * Description:  Searches the Dom for the element as specified by the parameter.  This is intended to be a
     *               replacement for document function querySelector.
     *
     * @param  string|Strings  The query selection specification.
     *
     * @return  DomCollection  The set of Dom elements matching the query specification.  On failure to match or other
     *                         error an empty collection is returned.
     */
    public find(eleID: string|Strings): DomCollection {
        eleID = typeof eleID === 'string' ? new Strings(eleID) : eleID; // Ensure eleID is a Strings
        eleID = eleID.trim().whitespaceCondense();

        // Error Check - Missing the eleID
        if (eleID.isEmpty()) {
            window.console.error('Dom::find - eleID empty');
            return new DomCollection([]);
        }

        // Error Check - More than one #
        let idCount = eleID.count('#');
        if (idCount > 1) {
            window.console.error('Dom::find - eleID has more than one #', eleID);
            return new DomCollection([]);
        }

        // Error Check - # not at start
        if (idCount === 1 && eleID.contains('#') && !eleID.starts('#')) {
            window.console.error('Dom::find - # in eleID is not at the start', eleID);
            return new DomCollection([]);
        }

        // Determine the next search element and the remainder
        let layerCount = eleID.count(' ') + 1;
        let searchEleId = new Strings('');
        let remainEleId = new Strings('');
        if (layerCount === 1) {
            searchEleId = eleID;
        } else {
            searchEleId = new Strings(eleID);
            remainEleId = new Strings(eleID);
            searchEleId.stripAfterTag(' ');
            remainEleId.stripBeforeTag(' ');
        }

        // Search
        let elements = null;
        let classCount = searchEleId.count('.');
        if (classCount > 1) {
            elements = this.__getMultiples(searchEleId);
        } else if (searchEleId.starts('#')) {
            elements = this.__getElementById(searchEleId);
        } else if (searchEleId.starts('.')) {
            elements = this.__getElementsByClassName(searchEleId);
        } else {
            elements = this.__getElementsByTagName(searchEleId);
        }
        elements = elements === null ? [] : elements;
        // Note:  At this point elements is an array of raw javascript dom elements

        // If we are on a leaf node then convert the array of JS dom elements to an array of Dom elements and return a DOM collection
        let found: Dom[] = [];
        if (remainEleId.equals('')) {
            for (let i=0; i<elements.length; i++) {
                found.push(new Dom(elements[i]));
            }
            return new DomCollection(found);
        }

        // Search into the next layer
        for(let j=0; j<elements.length; j++) {
            let anEle = new Dom(elements[j]);
            let findCollection = anEle.find(remainEleId);
            if (findCollection.getSize() > 0) {
                found = found.concat(findCollection.getCore());
            }
        }

        return new DomCollection(found);
    }

    /*
     * Function:  __getMultiples
     *
     * Description:  When
     *
     * @param  eleID  The remaining query specification.
     *
     * @return  null|HTMLElement[]  A null for an error, otherwise and array of HTMLElements are returned.
     */
    private __getMultiples(eleID: string|Strings): HTMLElement[] {
        eleID = typeof eleID === 'string' ? new Strings(eleID) : eleID; // Ensure eleID is a Strings
        eleID = eleID.trim().whitespaceCondense();

        let found: HTMLElement[] = [];

        eleID = eleID.rtrim('.').trim().rtrim('.');
        let firstEleIsAClass = eleID.starts('.');
        eleID = eleID.ltrim('.');

        // Error check
        if (eleID.contains(' ')) {
            window.console.error('Dom::__getMultiples - Invalid mulitiple identifier', eleID);
            return found;
        }

        // Compile the list of element class IDs
        let bits = eleID.explode('.');
        if (firstEleIsAClass) {
            bits[0] = bits[0].prepend('.');
        }
        let bitsSize = bits.length;
        let eleStrs = [];
        for (let i=0; i<bitsSize; i++) {
            let aBit = bits[i];
            if (!aBit.isEmpty()) {
                if (!aBit.starts('.')) {
                    aBit = aBit.prepend('.');
                }
                eleStrs.push(aBit);
            }
        }

        // If there are no resulting eles we can get out early
        let eleStrsSize = eleStrs.length;
        if (eleStrsSize === 0) {
            return found;
        }

        // Get a matching set for the first element
        let redux: any = this.find(eleStrs[0]).getCore(); // We specify any and not Dom[] since we may mark some of them as disqualified/null
        let reduxSize = redux.length;
        for (let reduxIndex=0; reduxIndex<reduxSize; reduxIndex++) {
            let reduxEle = redux[reduxIndex];
            if (reduxEle != null) { // Check to see if it has been disqualified already
                for (let eleStrsIndex=1; eleStrsIndex<eleStrsSize; eleStrsIndex++) {
                    let aClass = eleStrs[eleStrsIndex].ltrim('.');
                    if (!redux[reduxIndex].hasClass(aClass)) {
                        redux[reduxIndex] = null; // One of the children of the parent redux element does not match the patter, so we disquality the redux element
                        break;
                    }
                }
            }
        }

        // Package the return
        let ret = [];
        for (let reduxIndex=0; reduxIndex<reduxSize; reduxIndex++) {
            if (redux[reduxIndex] != null) {
                ret.push(redux[reduxIndex].getCore());
            }
        }

        // Done!
        return ret;
    }

    /*
     * Function:  __getElementById
     *
     * Description:  A support function to look for a match when a query spec element is a request for an id.
     *
     * @param  eleID  The requested id specified in the string.
     *
     * @return  null|HTMLElement[]  A null for an error, otherwise and array of HTMLElements are returned.
     */
    private __getElementById(eleID: string|Strings): null|HTMLElement[] {
        eleID = typeof eleID === 'string' ? new Strings(eleID) : eleID; // Ensure eleID is a Strings
        eleID = eleID.trim().whitespaceCondense();

        eleID = eleID.trim();
        if (!eleID.starts('#')) {
            window.console.error('Dom::__getElementById - Invalid eleID', eleID);
            return null;
        }
        eleID = eleID.ltrim('#');

        let ret = [];
        let searchResult = document.getElementById(eleID.str()); // Note:  By definition getElementById is not available to __core but rather document only.
        if (searchResult !== null) {
            ret.push(searchResult);
        }

        //Return the raw dom elements set of at most one
        return ret;
    }

    /*
     * Function:  __getElementsByClassName
     *
     * Description:  A support function to look for a match when a query spec element is a request for an class name.
     *
     * @param  eleID  The requested class name specified in the string.
     *
     * @return  null|HTMLElement[]  A null for an error, otherwise and array of HTMLElements are returned.
     */
    private __getElementsByClassName(eleID: string|Strings): null|HTMLElement[] {
        eleID = typeof eleID === 'string' ? new Strings(eleID) : eleID; // Ensure eleID is a Strings
        eleID = eleID.trim().whitespaceCondense();

        eleID = eleID.trim();
        if (!eleID.starts('.')) {
            window.console.error('Dom::__getElementsByClassName - Invalid eleID', eleID);
            return null;
        }
        eleID = eleID.ltrim('.');

        let ret = [];
        let searchResultArr  = this.__core.getElementsByClassName(eleID.str());
        let searchResultSize = searchResultArr.length;
        for (let i=0; i<searchResultSize; i++) {
            ret.push(searchResultArr[i]);
        }

        //Return the raw dom elements set
        return ret;
    }

    /*
     * Function:  __getElementsByTagName
     *
     * Description:  A support function to look for a match when a query spec element is a request for a tag type.
     *
     * @param  eleID  The requested tag type specified in the string.
     *
     * @return  null|HTMLElement[]  A null for an error, otherwise and array of HTMLElements are returned.
     */
    private __getElementsByTagName(eleID: string|Strings): null|HTMLElement[] {
        eleID = typeof eleID === 'string' ? new Strings(eleID) : eleID; // Ensure eleID is a Strings
        eleID = eleID.trim().whitespaceCondense();

        if (eleID.starts('#') || eleID.starts('.')) {
            window.console.error('Dom::__getElementsByTagName - Invalid eleID', eleID.str());
            return null;
        }

        let ret = [];
        let searchResultArr  = this.__core.getElementsByTagName(eleID.str());
        let searchResultSize = searchResultArr.length;
        for (let i=0; i<searchResultSize; i++) {
            ret.push(searchResultArr[i]);
        }

        //Return the raw dom elements set
        return ret;
    }

    /*
     * Function:  componentRegisterInit
     *
     * Description:  Utility function to ensure the components register is initialized.
     *
     * @return  void
     */
    private static componentRegisterInit(): void {
        if (typeof Dom.__components === 'undefined') {
            Dom.__components = {};
        }
    }

    /*
     * Function:  componentRegister
     *
     * Description:  A support function to register valid component names.
     *
     * @param  comps  The array of valid components
     *
     * @return  void
     */
    static componentRegister(comps: string[]|Strings[]): void {
        Dom.componentRegisterInit();
        comps.forEach((comp)=>{
            comp = typeof comp === 'string' ? comp : comp.str();
            // @ts-ignore - The following line is constructed correctly.
            Dom.__components[comp] = true;
        })
    }

    /*
     * Function:  componentValid
     *
     * Description:  A support function validate a component nane.
     *
     * @param  comp  The name of the component.
     *
     * @return  boolean  Return true if the component name is valid, false otherwise.
     */
    static componentValid(comp: string|Strings): boolean {
        Dom.componentRegisterInit();
        comp = typeof comp === 'string' ? comp : comp.str();
        // @ts-ignore - The following line is constructed correctly.
        return typeof Dom.__components[comp] !== 'undefined';
    }

    /*
     * Function:  componentFactory
     *
     * Description:  A support function to look for a match when a query spec element is a request for a tag type.
     *
     * @param  eleID  The requested tag type specified in the string.
     *
     * @return  null|HTMLElement[]  A null for an error, otherwise returns the requested component instance.
     */
    static componentFactory(comp: string|Strings, theParent: Dom, params: object = {}): any {
        window.console.error("Dom::componentFactory - This function must be overridden in the project class");
        return null;
    }











    /*
     * Function:  create
     *
     * Description:  A utility function to create a new Dom element that is, initially, not attached to the dom.  This
     *               is a static function called by Dom.create(...).
     *
     * @param  eleTag  The specification for the new element tag type, "div" for example.
     *         attributes  A object containing the attributes to be added to the new Dom element,
     *         "{class: 'stuff things'}", for example.
     *
     * @return  Dom  The new unattached Dom instance.
     */
    static create(eleTag: string|Strings, attributes: object = {}): Dom {
        eleTag = typeof eleTag === 'string' ? eleTag : eleTag.str();

        let newEle = document.createElement(eleTag);

        let keys = Object.keys(attributes);
        let aKey = null;
        for (let index=0; index<keys.length; index++) {
             aKey = keys[index];
             // @ts-ignore - The following line is constructed correctly.
             newEle.setAttribute(aKey, attributes[aKey]);
        }

        return new Dom(newEle);
    }

    /*
     * Function:  remove
     *
     * Description:  Removes the Dom element from the dom.
     *
     * @param  none
     *
     * @return  void  The element no longer exists so there is no point in returning anything.
     */
    public remove(): void {
        if (this.__core !== null) {
            this.__core.remove();
        }
        this.__core = null;
    }

    /*
     * Function:  att
     *
     * Description:  A function used for setting attributes on wrapped HTMLElement.
     *
     * @param  attName  A string representing the name of the attribute.
     * @param  attVal  A string representing the value of the attribute.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public att(attName: string|Strings, attVal: any): any {
        attName = typeof attName === 'string' ? attName : attName.str();

        if (typeof attVal === 'undefined') {
            return this.__core.getAttribute(attName);
        }
        this.__core.setAttribute(attName, attVal);
        return this;
    }

    /*
     * Function:  atts
     *
     * Description:  A function used for getting the attributes on a Dom element.
     *
     * @return  object  Returns an object containing the attribute values.
     */
    public atts(): object {
        let keys = [];
        let dict = {keys: null};

        let size = this.__core.attributes.length ?? 0;
        for(let index=0; index<size; index++) {
            let key = this.__core.attributes[index].localName;
            let val = new Strings(this.__core.attributes[key].nodeValue);

            if (val.isNumeric()) {
                // @ts-ignore - The following line is constructed correctly.
                dict[key] = val.number();
            } else if (val.isJSON()) {
                // @ts-ignore - The following line is constructed correctly.
                dict[key] = val.jsonParse();
            } else {
                // @ts-ignore - The following line is constructed correctly.
                dict[key] = val;//.str();
            }

            keys.push(key);
        }

        // @ts-ignore - The following line is constructed correctly.
        dict.keys = keys;
        return dict;
    }

    /*
     * Function:  prepend
     *
     * Description:  Wraps the HTMLElement function prepend.
     *
     * @param  child  The Dom element to be prepended.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public prepend(child: Dom): Dom {
        let childEle = child.getCore();
        this.__core.prepend(childEle);
        return this;
    }

    /*
     * Function:  append
     *
     * Description:  Wraps the HTMLElement function append.
     *
     * @param  child  The Dom element to be appended.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public append(child: Dom): Dom {
        let childEle = child.getCore();
        this.__core.append(childEle);
        return this;
    }

    /*
     * Function:  appendChild
     *
     * Description:  Wraps the HTMLElement function appendChild.
     *
     * @param  child  The Dom element to be appended.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public appendChild(child: Dom): Dom {
        let childEle = child.getCore();
        this.__core.appendChild(childEle);
        return this;
    }

    /*
     * Function:  val
     *
     * Description:  Sets the value attribute directly.
     *
     * @param  newVal  The value to be set on the HTMLElement attribute value.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public val(newVal: any = null): Dom {
        if (newVal === null) {
            return this.__core.value;
        }

        this.__core.value = newVal;

        return this;
    }



    /*
     * Function:  addClass
     *
     * Description:  Adds a new class specification to the end of the class list.
     *
     * @param  refClass  The new class name.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public addClass(refClass: string|Strings): Dom {
        refClass = typeof refClass !== 'string' ? refClass.str() : refClass;

        if (typeof this.__core?.classList?.add === 'undefined') {
            window.console.error("Dom::addClass - Class list add function not available");
            return this;
        }

        this.__core.classList.add(refClass);

        return this;
    }

    /*
     * Function:  removeClass
     *
     * Description:  Removes a class specification from the class list.
     *
     * @param  targetClass  The class name to be removed from the class list.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public removeClass(targetClass: string|Strings): Dom {
        targetClass = typeof targetClass !== 'string' ? targetClass.str() : targetClass;

        if (typeof this.__core?.classList?.remove === 'undefined') {
            window.console.error("Dom::removeClass - Class list remove function not available");
            return this;
        }

        this.__core.classList.remove(targetClass);

        return this;
    }

    /*
     * Function:  hasClass
     *
     * Description:  Determines if the class list contains a class name.
     *
     * @param  refClass  The class name for which we are searching in the class list.
     *
     * @return  bool  Returns true if the class name is found in the class list, false otherwise.
     */
    public hasClass(refClass: string|Strings): boolean {
        refClass = typeof refClass === 'string' ? new Strings(refClass) : refClass;
        refClass = refClass.trim().str();

        if (refClass === '') {
            window.console.error("Dom::hasClass - refClass parameter empty");
            return false;
        }

        if (typeof this.__core?.classList?.contains === 'undefined') {
            window.console.error("Dom::hasClass - Class list contains function not available");
            return false;
        }

        return this.__core.classList.contains(refClass);
    }

    /*
     * Function:  toggleClass
     *
     * Description:  Add a class if it is not already there, and if it is where then remove it.
     *
     * @param  refClass  The class name for which we are toggling.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public toggleClass(refClass: string|Strings): Dom {
        refClass = typeof refClass === 'string' ? new Strings(refClass) : refClass;
        refClass = refClass.trim().str();

        if (refClass === '') {
            window.console.error("Dom::toggleClass - refClass parameter empty");
        }

        if (this.hasClass(refClass)) {
            this.removeClass(refClass);
            return this;
        }

        this.addClass(refClass);
        return this;
    }

    /*
     * Function:  getClassList
     *
     * Description:  Returns the HTMLElement class list.
     *
     * @param  none
     *
     * @return  DOMTokenList  The DOMTokenList accessed via the classList parameter on the wrapped HTMLElement.
     */
    public getClassList(): number[]|DOMTokenList {
        if (typeof this.__core?.classList === 'undefined') {
            window.console.error("Dom::getClassList - The class list undefined");
            return []; // Not actually a number array, just want to return an empty countable
        }

        return this.__core.classList;
    }

    /*
     * Function:  getClassNth
     *
     * Description:  Return the nTH class name from the wrapped HTMLElement property classList.
     *
     * @param  n  A value representing the nTH element in the class list.
     *
     * @return  Strings  The name of the nTH class.
     */
    public getClassNth(n: number): Strings {
        let list = this.getClassList();
        if (n > list.length) {
            return new Strings('');
        }
        return new Strings(list[n - 1]); // one based
    }

    /*
     * Function:  hide
     *
     * Description:  Add the hidden name to the class list
     *
     * @param  none
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public hide(): Dom {
        return this.addClass('hidden');
    }

    /*
     * Function:  show
     *
     * Description:  Remove the hidden name from the class list
     *
     * @param  none
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public show(): Dom {
        return this.removeClass('hidden');
    }

    /*
     * Function:  __svg
     *
     * Description:  Support function to add the svg to the dom and add attributes.
     *
     * @param  content  SVG data.
     * @param  att  Attributes to be applied to the SVG.
     *
     * @return  Dom  Returns a Dom representing the new svg element.  In case of failure returns null.
     */
    private __svg(content: string|Strings, att={}): Dom|null {
        content = typeof content === 'string' ? content : content.str();

        // Add the SVG
        this.innerHTMLAppend(content);

        // Find the SVG that was just added
        let svg = this.find('svg').last();
        if (svg === null) {
            return null;
        }
        let svgCore = svg.getCore();
        if (svgCore === null) {
            return null;
        }

        // Then in turn apply the attributes
        let keys = Object.keys(att);
        let aKey = null;
        let anAtt = null;
        for (let index=0; index<keys.length; index++) {
            aKey = keys[index];
            // @ts-ignore - The following line is constructed correctly.
            anAtt = att[aKey];
            if (anAtt !== null) {
                svgCore.setAttribute(aKey, anAtt)
            }
        }

        return svg;
    }

    /*
     * Function:  svg
     *
     * Description:  Support function to add the svg to the dom and add attributes.
     *
     * @param  content  SVG data.
     * @param  att  Attributes to be applied to the SVG.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public svg(imageName: string|Strings, att={}) {
        imageName = typeof imageName === 'string' ? imageName : imageName.str();

        // If the cache does not exist create it
        this.__svgCache = typeof this.__svgCache === 'undefined' ? {} : this.__svgCache;

        // Case:  It is already in the cache
        // @ts-ignore - The following line is constructed correctly.
        if (typeof this.__svgCache[imageName] !== 'undefined') {
            // Sub-Case:  It is already resolved as a string
            // @ts-ignore - The following line is constructed correctly.
            if (typeof this.__svgCache[imageName] === 'string') {
                // @ts-ignore - The following line is constructed correctly.
                this.__svg(this.__svgCache[imageName], att);
            }

            // Sub-Case:  It has yet to be resolved
            else {
                // @ts-ignore - The following line is constructed correctly.
                this.__svgCache[imageName].then(() => {
                    // By the time we execute in here the cached promise has been replaced by a string
                    // @ts-ignore - The following line is constructed correctly.
                    this.__svg(this.__svgCache[imageName], att);
                });
            }
        }

        // Case:  It is new to the cache
        else {
            // @ts-ignore - The following line is constructed correctly.
            this.__svgCache[imageName] = new Promises();

            // @ts-ignore - Services is a global variable
            if (typeof Services === 'undefined') {
                window.console.error('Services not available');
                // @ts-ignore - The following line is constructed correctly.
                this.__svgCache[imageName].reject('Dom::svg - Services not available');
                // @ts-ignore - The following line is constructed correctly.
                delete this.__svgCache[imageName];
            } else {
                // @ts-ignore - Services is a global variable
                let startup = Services.get('startup');
                let imagePath = startup.relativeBase + 'images/' + imageName + '.svg';
                let svgPromise = Files.getContents(imagePath);
                svgPromise.then((contents: any) => {
                    // @ts-ignore - The following line is constructed correctly.
                    this.__svgCache[imageName].accept(`svg (${imageName}) placed`);
                    // @ts-ignore - The following line is constructed correctly.
                    this.__svgCache[imageName] = contents;
                    this.__svg(contents, att);
                }).catch(() => {
                    // @ts-ignore - The following line is constructed correctly.
                    this.__svgCache[imageName].reject(`svg (${imageName}) failed`);
                    // @ts-ignore - The following line is constructed correctly.
                    delete this.__svgCache[imageName];
                });
            }
        }

        return this;
    }

    /*
     * Function:  addAnimationEnd
     *
     * Description:  Detect the completion of an animation.
     *
     * @param  callback  Function to call when detected.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public addAnimationEnd(callback: any) {
        this.__core.addEventListener("webkitAnimationEnd", callback);
        this.__core.addEventListener("animationend", callback);
        return this;
    }

    /*
     * Function:  removeAnimationEnd
     *
     * Description:  Remove detection of the completion of an animation.
     *
     * @param  callback  Function that was called when detected.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public removeAnimationEnd(callback: any) {
        this.__core.removeEventListener("webkitAnimationEnd", callback);
        this.__core.removeEventListener("animationend", callback);
        return this;
    }

    /*
     * Function:  eventListen
     *
     * Description:  Add an event listener to the element.
     *
     * @param  event  The event type to be detected.
     * @param  callback  Function to call when the event is detected.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public eventListen(event: string|Strings, func: any) {
        event = typeof event === 'string' ? event : event.str();

        this.__core.addEventListener(event, func);
        return this;
    }

    /*
     * Function:  eventRemove
     *
     * Description:  Remove an event listener from the element.
     *
     * @param  event  The event type to be ignored.
     * @param  callback  Function that was added with the event listener.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public eventRemove(event: string|Strings, func: any) {
        event = typeof event === 'string' ? event : event.str();

        this.__core.removeEventListener(event, func);
        return this;
    }

    /*
     * Function:  eventTrigger
     *
     * Description:  Programmatically trigger an event.
     *
     * @param  event  The event type to be triggered.
     *
     * @return  Dom  Returns self to allow for chaining of commands.
     */
    public eventTrigger(event: string|Strings) {
        event = typeof event === 'string' ? event : event.str();

        this.__core.dispatchEvent(new CustomEvent(event));
        return this;
    }

    /*
     * Function:  height
     *
     * Description:  Set the height in styles.
     *
     * @param  newVal  When empty the height is returned and when defined the height is set.
     *
     * @return  Dom|string  Returns a Strings containing the height when newVal is empty, otherwise returns self (Dom).
     */
    public height(newVal: null|number|string|Strings = null): Strings|Dom {
        // Check for getting value
        if (newVal === null) {
            let ret = this.__core.style.height;
            if (typeof ret === 'string') {
                return new Strings(ret);
            }

            return new Strings(this.__core.clientHeight);
        }

        // Set prep
        newVal = new Strings(newVal);
        if (!(newVal.ends('px') || newVal.ends('em') || newVal.ends('%'))) {
            newVal.append('px'); // If no type assume pixels
        }

        // Set the value
        this.__core.style.height = newVal.str();

        // Returned modified element
        return this;
    }

    /*
     * Function:  width
     *
     * Description:  Set the width in styles.
     *
     * @param  newVal  When empty the width is returned and when defined the width is set.
     *
     * @return  Dom|string  Returns a Strings containing the width when newVal is empty, otherwise returns self (Dom).
     */
    public width(newVal: null|number|string|Strings = null): Strings|Dom {
        // Check for getting value
        if (newVal === null) {
            let ret = this.__core.style.width;
            if (typeof ret === 'string') {
                return new Strings(ret);
            }

            return new Strings(this.__core.clientWidth);
        }

        // Set prep
        newVal = new Strings(newVal);
        if (!(newVal.ends('px') || newVal.ends('em') || newVal.ends('%'))) {
            newVal.append('px'); // If no type assume pixels
        }

        // Set the value
        this.__core.style.width = newVal.str();

        // Returned modified element
        return this;
    }

    /*
     * Function:  css
     *
     * Description:  Gets or sets the style attributes.
     *
     * @param  att  The designation for the style to be retrieved or revised.
     * @param  val  The value to be set.  Do not specify if you wish to do a get.
     *
     * @return  Dom|string  Returns a Strings containing the value of the attribute when doing a retrieve, otherwise
     *          returns self (Dom).
     */
    public css(att: string|Strings, val: null|string|Strings = null): Dom {
        att = typeof att === 'string' ? att : att.str();

        if (val === null) {
            return this.__core.style[att];
        }

        val = typeof val === 'number' ? String(val) : val;
        val = typeof val === 'string' ? val : val.str();
        this.__core.style[att] = val;

        return this;
    }

    /*
     * Function:  focus
     *
     * Description:  This is a direct mapping to HTMLElement: focus().
     *
     * @param  options  Allows the user to specify preventScroll and/or focusVisible.
     *
     * @return  Returns self (Dom).
     */
    public focus(options: object|null): Dom {
        if (options === null) {
            this.__core.focus();
        } else {
            this.__core.focus(options);
        }

        return this;
    }

    /*
     * Function:  unfocus
     *
     * Description:  This is a direct mapping to HTMLElement: blur().
     *
     * @return  Returns self (Dom).
     */
    public unfocus(): Dom {
        this.__core.blur();

        return this;
    }

    /* PENDING DEVELOPMENT - CURRENTLY THERE IS NO WAY TO DETERMINE IF A SPECIFIC ELEMENT HAS FOCUS
     * Function:  hasfocus
     *
     * Description:  Determines if the specific element is in focus.
     *
     * @return  bool true if the element is in focus, false otherwise.
     */
    /*
    public hasfocus(): boolean {
        debugger;
        return document.activeElement === this.__core;
    }
     */
}



/* The following are rough drafts of future features
            function reactAdd(refClass) {
                const root = ReactDOM.createRoot(__core);
                const e = React.createElement;
                root.render(e(refClass));
            }

// The following were never implemented
function pic(imageName, att={}) {
    let newPic = create('picture');
    append(newPic);

    let imageNameSVG = 'images/' + imageName + '.svg';
    let newSVG = create('source', {type: 'image/svg+xml', srcset: imageNameSVG});
    newPic.append(newSVG);

    //        let imageNameWEBP = 'images/' + imageName + '.webp';
    //        let newWEBP = create('source', {type: 'image/webp', srcset: imageNameWEBP});
    //        newPic.append(newWEBP);

    let imageNamePNG = 'images/' + imageName + '.png';
    let newImgAlt = typeof att.alt === 'undefined' ? imageName : att.alt;
    let newImgPNG = create('img', {src: imageNamePNG, alt: newImgAlt});
    newPic.append(newImgPNG);

    //        let imageNameJPG = 'images/' + imageName + '.jpg';
    //        let newImgJPG = create('img', {src: imageNameJPG, alt: newImgAlt});
    //        newPic.append(newImgJPG);

    return newPic;
}

function svg(imageName, att={}) {
    att.type = 'svg';
    return pic(imageName, att);
}

function webp(imageName, att={}) {
    att.type = 'webp';
    return pic(imageName, att);
}

function png(imageName, att={}) {
    att.type = 'png';
    return pic(imageName, att);
}

function jpg(imageName, att={}) {
    att.type = 'jpg';
    return pic(imageName, att);
}
*/
