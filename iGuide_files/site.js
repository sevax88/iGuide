;
//se more maps at https://developers.google.com/maps/tutorials/fundamentals/adding-a-google-map
var workingSpace = workingSpace || {};
workingSpace.options = {
    isSimplePageSlice: true,
    /* See more effects at http://easings.net/ */
    easingSelectedEffect: 'easeInOutExpo'//'easeOutBack'
}
workingSpace.currentBrowser = function() {
    var br;
    if(!!window.opera || navigator.userAgent.indexOf('Opera') >= 0)
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        br = "opera";
    else if(typeof InstallTrigger !== 'undefined')
        // Firefox 1.0+
        br = "firefox";
    else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
        // At least Safari 3+: "[object HTMLElementConstructor]"
        br = "safari";
    else if(!!window.chrome)
        // Chrome 1+
        br = "chrome";
    else if (/*@cc_on!@*/false)
    // At least IE6
        br = "ie";
    return br;
}();
workingSpace.managers = function(){
    var getObjCollection = function(sectionSplitter) {
        var collection = [];
        $(sectionSplitter).each(function(){ collection.push("#"+$(this).attr('id')); });
        return collection;
    }
    var initObjCollection = function(splitter, activeClass) {
        var collection = getObjCollection(splitter);
        return {
            collection: collection,
            splitter: splitter,
            activeClass: activeClass,
            last: collection.length > 0 ? collection[0] : null
        }
    }
    var hideBodyScroll = function() {
        $("body").css("overflow", "hidden");
    }
    var showBodyScroll = function() {
        $("body").css("overflow", "visible");
    }
    var manageClass = function(element, className, hasToremove) {
        if(hasToremove && $(element).hasClass(className))
            $(element).removeClass(className);
        else if(!hasToremove && !$(element).hasClass(className))
            $(element).addClass(className);
    }
    var addClass = function(element, className){
        manageClass(element, className, false);
    }
    var removeClass = function(element, className){
        manageClass(element, className, true);
    }
    var elementContainerByBrowser = function(){
        var ct;
        switch(workingSpace.currentBrowser){
            case "firefox":
            case "ie":
                ct = 'html';
                break;
            case "chrome":
            case "safari":
                ct = 'html body';
                break;
            default:
                ct = 'html, body';
        }
        return ct;
    }();
    var oPublic = {
        getObjCollection: getObjCollection,
        initObjCollection: initObjCollection,
        hideBodyScroll: hideBodyScroll,
        showBodyScroll: showBodyScroll,
        addClass: addClass,
        removeClass: removeClass,
        elementContainerByBrowser: elementContainerByBrowser
    }
    return oPublic;
}();
workingSpace.principal = function() {
    var map = workingSpace.managers.initObjCollection(".city li","active");
    var section = workingSpace.managers.initObjCollection("section","active");

    var showAllSections = function() {
        var l = section.collection.length;
        for(var i = 0; i < l; i++){
            $(section.collection[i]).show();
        };
    }
    var hideOtherSections = function(currentSection) {
        var l = section.collection.length;
        for(var i = 0; i < l; i++){
        if(section.collection[i] != currentSection)
            $(section.collection[i]).hide();
        };
    }
    var displayFooter = function(selectedSection){
        $("footer").css('display', selectedSection == "#section4" ? 'none' : 'block');
    }
    $('footer ul li').bind('click',function(event){
        $('ul.nav a[href$="section4"]').click();
    });
    var slicePageSimple = function(currentHref) {
        var ctnr = workingSpace.managers.elementContainerByBrowser;
        $.waypoints('disable');
        $(ctnr).stop().animate({
            scrollTop: $(currentHref).offset().top
        }, 1500,workingSpace.options.easingSelectedEffect, function() {
            $.waypoints('enable');
        });
    }
    var slicePageComplex = function(currentHref) {
        workingSpace.waypointsEnabled = false;
        $.waypoints('disable');
        showAllSections();
        var ctnr = workingSpace.managers.elementContainerByBrowser;
        $(ctnr).stop().animate({ //fast to relative position in relation to the (now) showed sections
            scrollTop: $(section.last).offset().top
        }, 0, function() {
            $(ctnr).stop().animate({ //show user the movement to the section selected
                scrollTop: $(currentHref).offset().top
            }, 1500,workingSpace.options.easingSelectedEffect, function() { //check for others easings!!
                hideOtherSections(currentHref);
                section.last = currentHref;
                $(ctnr).stop().animate({ //fast to top after hidding other sections
                    scrollTop: $(section.last).offset().top
                }, 0, function() {
                    workingSpace.managers.showBodyScroll();
                    $.waypoints('enable');
                });
            })
        });
    }
    var refreshNav = function(activeClass, currentSection) {
        $('ul.nav a').parent().removeClass(activeClass);
        $('ul.nav a[href=' + currentSection + ']').parent().addClass(activeClass);
        displayFooter(currentSection);
    }
    $('ul.nav a').bind('click',function(event){
        var currentHref = $(this).attr('href');
        refreshNav(section.activeClass, currentHref);
        workingSpace.options.isSimplePageSlice ? slicePageSimple(currentHref) : slicePageComplex(currentHref);
        event.preventDefault();
    });
    

    $.each(section.collection, function(index, value){
        $(value).waypoint(function(direction) {
            refreshNav(section.activeClass, value);
        });
    });

    if(!workingSpace.options.isSimplePageSlice){
        workingSpace.managers.hideBodyScroll();
        hideOtherSections(section.last); //starts only with the default section
        workingSpace.managers.showBodyScroll();
    }
    $(map.last).click();

    var oPublic = {
        sections: [],
        maps: []
    }
    return oPublic;
}();
;