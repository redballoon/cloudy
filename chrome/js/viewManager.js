/* The ViewManager takes care of detecting whether the user uses the old or 
 * new Compose in Gmail. Once it finds out, it takes care of instantiating
 * the appropriate view (regularView or updatedView). 
 */
var ViewManager = function () {
    if (arguments.callee.singleton_instance) {
        return arguments.callee.singleton_instance;
    }

    arguments.callee.singleton_instance = new (function () {
        var observerCallbacks = [];
        var cloudy_view;
        var mytimer;
        var enabled;

        this.addViewObserver = function (fn) {
            observerCallbacks.push(fn);
        }

        this.getView = function(){
            return cloudy_view;
        }

        var checkCompose = function() {
            if (enabled && document.getElementsByName("subject").length) {
                if (!document.getElementsByName("from").length || 
                    document.getElementsByName("from")[0].tagName
                        .toLowerCase() !== "input") {
                    // Gmail's old interface
                    cloudy_view = new RegularView();
                } else {
                    // Gmail's new interface
                    cloudy_view = new UpdatedView();
                }
                for (var i = 0; i < observerCallbacks.length; i++) {
                    cloudy_view.addObserver(observerCallbacks[i]);
                }
                clearInterval(mytimer);
                enabled = false;
            }
        }

        var init = function() {
            mytimer = setInterval(checkCompose, 500);
            enabled = true;
        }

        init.call(this);
        return this;
    })();

    return arguments.callee.singleton_instance;
}
