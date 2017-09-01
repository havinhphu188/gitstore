// taken from http://ng.malsup.com/#!/counting-watchers
(function countAngularWatchers(angular) {
    var i, data, scope,
        count = 0,
        all = document.all,
        len = all.length,
        test = {};

    var mostWatchers = 0;

    function printWatcherName (watcher) {
      for (var i = 0; i < watcher.length; ++i) {
        if(angular.isString(watcher[i].exp))
          console.log(watcher[i].exp);
        else{
          console.log(watcher[i].exp.name);
        }
      }
    }

    function countScopeWatchers(scope, element) {
        test[scope.$id] = true;
        var n = scope.$$watchers.length;

        if(!n)
            return;
        count += n;

        //set true if you want to show all watchers
        var showAll = false;

        if (showAll) {
            console.info('Watchers:', n);
            console.log(element);
            printWatcherName(scope.$$watchers);
        } else {
            if (n > mostWatchers) {
              console.info('most watchers', n);
              console.log(element);
              printWatcherName(scope.$$watchers);
              mostWatchers = n;
            }
        }

    }

    // go through each element. Count watchers if it has scope or isolate scope
    for (i = 0; i < len; i += 1) {
        var el = angular.element(all[i]);
        data = el.data();
        scope = data.$scope || data.$isolateScope;
        if (scope && scope.$$watchers) {
            if (!test[scope.$id]) {
                countScopeWatchers(scope, el);
            }
        }
    }
    console.log('this page has', count, 'angular watchers');
    return count;
}(window.angular));
