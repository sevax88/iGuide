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
workingSpace.googleMaps = function() {
    var createMapObj = function(elementId, coords) {
        return{
            map: null,
            canvas: document.getElementById(elementId),
            coords: coords,
            name: elementId
        }
    }
    /*var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icon = {
            form: iconBase + 'schools_maps.png',
            shadow: iconBase + 'schools_maps.shadow.png'
    } */
    var icon = { form: 'img/pointer.png' }
    var map_options = function(latLng) {
        return {
            center: latLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "all",
                    stylers: [
                        { saturation: -80 }
                    ]
                },{
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [
                        { hue: "#00ffee" },
                        { saturation: 50 }
                    ]
                },{
                    featureType: "poi.business",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                },{
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                        { color: '#adc9b8' }
                    ]
                }
            ]
        }
    }

    var createGoogleMap = function(mapObj) {
        mapObj.map = new google.maps.Map(mapObj.canvas, map_options(mapObj.coords));
        var marker = new google.maps.Marker({
            position: mapObj.coords,
            icon: icon.form /*,
            shadow: {
                url: icon.shadow,
                anchor: new google.maps.Point(16, 34)
            }*/,
            map: mapObj.map
        });
        //marker.setAnimation(google.maps.Animation.BOUNCE);
        mapObj.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
            document.getElementById(mapObj.name + 'legend'));
        return mapObj;
    }

    var buenosaires = createGoogleMap(createMapObj('buenosairesmap', new google.maps.LatLng(-34.570861,-58.443943)));
    var miami = createGoogleMap(createMapObj('miamimap', new google.maps.LatLng(25.878261,-80.167669)));

    buenosaires.map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
    miami.map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});

    return {
        buenosairesmap: buenosaires.map,
        miamimap: miami.map
    }
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
    var hideAllMaps = function() {
        var l = map.collection.length;
        for(var i = 0; i < l; i++){
            workingSpace.managers.removeClass(map.collection[i], map.activeClass, true);
            workingSpace.managers.removeClass(map.collection[i] + "map", map.activeClass + "map", true);
            //$(map.collection[i] + "map").hide();
        }
    }
    var mapDisplay = function(element) {
        hideAllMaps();
        workingSpace.managers.addClass(element, map.activeClass);
        workingSpace.managers.addClass(element + "map", map.activeClass + "map");
        //$(element + "map").show();
    }

    $.each(map.collection, function(index, value) {
        $(value).click( function(){
            mapDisplay("#" + this.id);
        });
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