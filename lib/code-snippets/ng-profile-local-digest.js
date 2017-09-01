/* measures how long an idle digest cycle (nothing has changed, just running all
dirty checking watchers) takes for a scope surrounding given selector.
Use: run this code snippet, then profileDirectiveDigest('#foo'); to measure
watchers in the #foo element (and its children along the scope tree).
*/

//in console log, type profileDirectiveDigest('body') - for companionApp
//profileDirectiveDigest('div[ng-controller="MyFirstPortletCtrl"]') - for v3 portal
(function (window) {
  var performance = window.performance;

  function getDiff(start, end) {
    return (end - start).toFixed(4);
  }

  function profileDirectiveDigest(selector) {
    console.assert(selector && typeof selector === 'string', 'expected selector', selector);
    var el = document.querySelector(selector);
    console.assert(el, 'cannot find element with selector', selector);

    /* global angular */
    var ngEl = angular.element(el);
    var scope = ngEl.scope() || ngEl.isolateScope();
    var startTime;
    var endTime;

    console.assert(scope, 'cannot find scope from element', selector);
    startTime = performance.now();
    scope.$digest();
    endTime = performance.now();
    console.log(selector, ': A digest took ' + getDiff(startTime, endTime) + 'ms');
  }

  window.profileDirectiveDigest = profileDirectiveDigest;
}(window));
