# MRHenniger_JS_Utilities
 Utilities for HTML/CSS/JS written by Mike R Henniger

This is a collection of utilities written me, Mike Henniger, to make working with vanilla JS and avoid bloated 
frameworks with frequent updates which make hobby projects difficult to keep current.

I originally wrote some of these utilities in JavaScript (see some files with _Original in the name), but this seemed a 
good project with which to build my TypeScript chops. So I am refactoring EVERYTHING.  This is a work in progress.

I would be interested to hear what you have to say about what you see here.  Constructive criticism is always well 
received.

Regards,
Mike Henniger
https://www.linkedin.com/in/mikehenniger/



Revision log...

V8 - February 2  - Adding initial support for reactive components.  This is only a first draft and will take much more
                   development.

2025:  Happy new year!!!!!!!

V7 - November 17  - Adding support to Dom to allow for the insertion of SVG files into the dom.  Also added event
                    handling to the Dom class.  In addition create a new class, Files, which is intended to allow for 
                    the reading of local files accessible to the app, and files via URL.  THIS NEW CLASS IS STILL 
                    UNDERDEVELOPMENT AND SHOULD NOT BE TRUSTED!

V6 - October 27   - Adding a json file which includes a list of files available for use in other projects.

V5 - October 27   - Add the new class Times to provide the basis of date/time manipulation.  There isn't much to this
                    yet, and it should be expected that functionality will be added.

V4 - October 7    - Cleaned out some old now unneeded files.

V3 - October 7    - Added the new class Promises to provide extended functionality to the native Promise.  You can use
                    this like a stand Promise or use it as a flagging system where you can resolve and reject the 
                    promise directly.  It also includes a memory feature so the Promise can be linked back to a specific
                    item in a collection of items returned from a service.

V2 - September 29 - Added the new classes Dom and DomCollection to aid in the manipulation of the dom.  These 
                    utilities are intended to be a lightweight alternative to the JQuery library.  There isn't too much
                    to them yet, but they have been proven useful in another project.  I expect to develop them both 
                    further.  Look for the tests in test_dom.html for examples of how these utility classes may be used.

V1 - September 15 - First draft of the TypeScript version of my Strings class in strings.js.  Look for the tests in 
                    test_strings.html for examples of how these string utilities may be used.

V0 - September 13 - Just getting the original JS files under source control.  They won't make much sense without the 
                    tests to go with them.
