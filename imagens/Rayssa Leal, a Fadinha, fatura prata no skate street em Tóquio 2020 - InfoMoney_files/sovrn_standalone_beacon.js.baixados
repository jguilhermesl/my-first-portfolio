/* sovrn_stndalne_beacon v0.0.1 
Updated : 2020-03-06 */
//sovrn beacon standalone .js
window.sovrn = window.sovrn || {};
sovrn.auction = sovrn.auction || {};
beaconFlag = false;

sovrn.auction = {
    doNotTrack: function (nav, win) {
        nav = nav || navigator;
        win = win || window;
        var optOutCookie = sovrn.auction.readCookie('tracking_optout');
        return nav.doNotTrack === 'yes'
                || nav.doNotTrack === '1'
                || nav.msDoNotTrack === '1'
                || win.doNotTrack === '1'
                || optOutCookie === '1';
    },

    readCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    sendBeacon: function () {
        sovrn.auction.beaconConfig = sovrn.auction.getParams(sovrn.auction.getScriptTag());
        try {
            var id, beacon_frame, config;
            //Don't fire the beacon if it has already been fired
            if (beaconFlag) {
                return false;
            }
            id = 'sovrn_beacon';//this ends up being the iframe id for the beacon so could be anything not necessarily tied to a zone id
            beacon_frame = sovrn.auction.createiFrame(id, 1, 1);
            beacon_frame.src = sovrn.auction.getBeaconURL();
            document.body.appendChild(beacon_frame);
            beaconFlag = true;
        } catch (e) {
            return false;
        }
        return true;
    },

    getParams: function (currentScript) {
        var currentTagID = currentScript.getAttribute("id");
        var currentTag = document.getElementById(currentTagID);
        if (currentTag == null) {
            return false;
        }
        currentTagSRC = currentTag.src;
        //snag params from script_tags
        var query_string, qs_obj;
        qs_obj = {};
        query_string = currentTagSRC.split('?')[1] || '';
        query_string = query_string.split('#')[0] || ''; //Deal with hashes
        if (!query_string) return {};

        query_string.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {
                try {
                    qs_obj[$1] = decodeURIComponent($3);
                } catch (e) {
                    sovrn.ads.dbg(e);
                }
            }
        );
        qs_obj.currentTag = currentTagID;
        qs_obj.location = currentTag.parentNode.nodeName;
        return qs_obj;
        //
    },

    getScriptTag: function () {
        var tag_regex = /^(https?:)?\/\/.*\.lijit\.(com|dev)\/www\/sovrn_beacon_standalone\/sovrn_standalone_beacon(\.min)?\.js/i;
        //var tag_regex = /^(https?:)?\/\/.*\.lijit\.(com|dev)\/www\/delivery\/sovrn_stndalne_beacon(\.min)?\.js/i;
        var script_tags, i, cur_script,
            script_pattern = tag_regex;
        if ('currentScript' in document) {
            cur_script = document.currentScript;
            if (cur_script && script_pattern.test(cur_script.src)) {
                return cur_script;
            }
        }

        //Start from the last tag on the page and work backwards
        script_tags = document.getElementsByTagName('script');
        for (i = script_tags.length - 1; i >= 0; i--) {
            if (script_pattern.test(script_tags[i].src)) {
                return script_tags[i];
            }
        }
        return null;
    },
//
    createiFrame: function (id, w, h) {
        var ifr, iframe_style, i, j, attr, styles;
        ifr = document.createElement('iframe');
        iframe_style = ifr.style;

        attr = {
            id: id,
            margin: '0',
            padding: '0',
            frameborder: '0',
            width: w + '',
            height: h + '',
            scrolling: 'no',
            src: 'about:blank'
        };

        styles = {
            margin: '0px',
            padding: '0px',
            border: '0px none',
            width: w + 'px',
            height: h + 'px',
            overflow: 'hidden'
        };

        //Loop through the iframe attributes and set them
        for (i in attr) {
            if (attr.hasOwnProperty(i)) {
                ifr.setAttribute(i, attr[i]);
            }
        }

        //Loop through all the styles and apply them
        for (j in styles) {
            if (styles.hasOwnProperty(j)) {
                try {
                    iframe_style[j] = styles[j];
                } catch (e) {
                }
            }
        }

        return ifr;
    },//end create Iframe

    getBeaconURL: function () {

        var informerId = (sovrn.auction.beaconConfig.hasOwnProperty("iid")) ? sovrn.auction.beaconConfig.iid : "",
            gdprConsentString = sovrn.auction.gdprConsent || "",
            ccpaConsentString = sovrn.auction.ccpaConsent || "";

        return 'https://vpod1q.qa.lijit.com/beacon?informer=' +  informerId + '&gdpr_consent=' + gdprConsentString + '&us_privacy=' + ccpaConsentString;
    },

    sovrnReady: function (f) {
        /in/.test(document.readyState) ? setTimeout(function () {sovrn.auction.sovrnReady(f)}, 50) : f()
    },

  configureGdpr: function() {
    var _this = this;

    this.lookupIabConsent(
      function(cmpResponse) {
        sovrn.auction.gdprConsent = cmpResponse.getConsentData.consentData;
        _this.sendBeacon();
      },

      // ignoring errors for now - may want them to be tracked later
      function(e) {})
  },

  configureCcpa: function() {
    var _this = this;

    this.lookupCcpaConsent(
      function(apiResponse) {
        sovrn.auction.ccpaConsent = apiResponse.uspData;
        _this.sendBeacon();
      },

      // ignoring errors for now - may want them to be tracked later
      function(e) {
        _this.sendBeacon();
      })
  },

  callCmpFromSafeframe: function(commandName, dataName, callback) {
    var sfCallback = function(msgName, data) {
      if (msgName === 'cmpReturn') {
        callback(data[dataName]);
      }
    };

    window.$sf.ext.register(1, 1, sfCallback);
    window.$sf.ext.cmp(commandName);
  },

  cmpCallbacks: {},

  // Taken mostly from example from
  // Quantcast's CMP JS API Spec pdf
  // And from Prebid consent management module
  callCmpWhileInIframe: function(commandName, cmpFrame, callbackFunc) {
    var _this = this;
    // CMP needs to know the id of the iframe, so that it can post the result back to the iframe.
    var uniqueId = Math.random() + '';
    var iframeRegisterToCMPMsg = {
      __cmp: {
        command: 'registerIframeVendor',
        // need to confirm this is how to get the frame's id
        parameter: {"id": window.frameElement.id},
        callId: uniqueId
      }
    };

    // since multiple event listeners running simultaneously
    // use id to determine which callback to use
    sovrn.auction.cmpCallbacks[uniqueId] = callbackFunc;

    cmpFrame.postMessage(iframeRegisterToCMPMsg, '*');

    // call CMP to get consent data
    var messageToCMPWindow = {
      __cmpCall: {
        command: commandName,
        parameter: null,
        callId: uniqueId
      }
    };
    cmpFrame.postMessage(messageToCMPWindow, '*');

    // Event handler for response
    window.addEventListener("message", function(event) {
      if (event.data && event.data.__cmpReturn &&
        event.data.__cmpReturn.returnValue && event.data.__cmpReturn.callId) {
        _this.cmpCallbacks[event.data.__cmpReturn.callId](event.data.__cmpReturn.returnValue);
      }
    }, false);
  },

  /**
   * Find CMP if exists & read from it.
   *
   * @param cmpSuccess acts as a success callback when CMP returns a value
   * @param cmpError acts as an error callback, passes an error message
   */
  lookupIabConsent: function(cmpSuccess, cmpError) {
    var cmpResponse = {};
    function afterEach() {
      if (cmpResponse.getConsentData && cmpResponse.getVendorConsents) {
        cmpSuccess(cmpResponse);
      }
    }
    var consentDataCallback = function(consentResponse) {
      cmpResponse.getConsentData = consentResponse;
      afterEach();
    };
    var vendorConsentsCallback = function(consentResponse) {
      cmpResponse.getVendorConsents = consentResponse;
      afterEach();
    };

    var cmpFunction;
    try {
      cmpFunction = window.__cmp || window.top.__cmp;
    } catch (e) {
      cmpError(e)
    }

    if (typeof cmpFunction  === 'function') {
      cmpFunction('getConsentData', null, consentDataCallback);
      cmpFunction('getVendorConsents', null, vendorConsentsCallback);
    } else if (!!(window.$sf && window.$sf.ext) && typeof window.$sf.ext.cmp === 'function') {
      this.callCmpFromSafeframe('getConsentData', 'vendorConsentData', consentDataCallback);
      this.callCmpFromSafeframe('getVendorConsents', 'vendorConsents', vendorConsentsCallback);
    } else {
      var f = window;
      var cmpFrame;
      while (!cmpFrame) {
        try {
          if (f.frames['__cmpLocator']) {
            cmpFrame = f;
          }
        } catch (e) {
          cmpError(e)
        }
        if (f === window.top) {
          // No CMP found
          return;
        }
        f = f.parent;
      }
      this.callCmpWhileInIframe('getConsentData', cmpFrame, consentDataCallback);
      this.callCmpWhileInIframe('getVendorConsents', cmpFrame, vendorConsentsCallback);
    }
  },

  /**
   * Find CCPA API if it exists and query it
   *
   * @param apiSuccess acts as a success callback when CMP returns a value
   * @param apiError acts as an error callback, passes an error message
   */
  lookupCcpaConsent: function(apiSuccess, apiError) {
    var _this = this,
        apiFunction,
        apiCommand = 'getUSPData',
        apiVersion = 1,
        apiResponse = {
          uspData: '',
          success: false
        },

        apiCallback = function(uspData, success) {
          apiResponse.uspData = uspData && uspData.uspString || "";
          apiResponse.success = success;

          if (success) {
            apiSuccess(apiResponse);
          } else {
            apiError();
          }
        };

    try {
      apiFunction = window.__uspapi || window.top.__uspapi;
    } catch (e) {
      apiError(e)
    }

    if (typeof apiFunction  === 'function') {
      apiFunction(apiCommand, apiVersion, apiCallback);
    } else {
      // Assuming safeframes with no api proxy, or child iframe
      var f = window, apiFrame, uniqueId = (new Date()).getTime();

      while (!apiFrame) {
        try {
          if (f.frames['__uspapiLocator']) {
            apiFrame = f;
          }
        } catch (e) {
          apiError(e);
          return;
        }

        if (f === window.top) {
          apiError();
          return;
        }

        f = f.parent;
      }

      // Found frame to post a message to
      var messageToApiWindow = {
        __uspapiCall: {
          command: apiCommand,
          version: apiVersion,
          parameter: null,
          callId: uniqueId
        }
      };
      apiFrame.postMessage(messageToApiWindow, '*');

      // Event handler for response
      window.addEventListener("message", function(event) {
        if (event.data && event.data.__uspapiReturn && (event.data.__uspapiReturn.callId === uniqueId)) {
          if (event.data.__uspapiReturn.success) {
            apiSuccess(event.data.__uspapiReturn.returnValue)
          } else {
            apiError()
          }
        }
      }, false);
    }
  },

};

sovrn.auction.sovrnReady(function () {
    dnt = sovrn.auction.doNotTrack();
    if (dnt === false) {
        sovrn.auction.configureGdpr();
        if (typeof sovrn.auction.gdprConsent === 'undefined') {
          sovrn.auction.configureCcpa();
        }
    }
});
