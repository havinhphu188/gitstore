var translations = {
  HEADLINE: 'What an awesome module!',
  PARAGRAPH: 'Srsly!',
  NAMESPACE: {
    PARAGRAPH: 'And it comes with awesome features!'
  }
};

var app = angular.module('myApp', ['pascalprecht.translate']);

app.config(['$translateProvider', function ($translateProvider) {
  // add translation table
  $translateProvider
    .translations('en', translations)
    .preferredLanguage('en');
}]);

/*app.controller('Ctrl', ['$scope', '$translate', function ($scope, $translate) {
  // expose translation via `$translate` service
  $translate('HEADLINE').then(function (headline) {
    $scope.headline = headline;
  });
  $translate('PARAGRAPH').then(function (paragraph) {
    $scope.paragraph = paragraph;
  });
  $translate('NAMESPACE.PARAGRAPH').then(function (anotherOne) {
    $scope.namespaced_paragraph = anotherOne;
  });
}]);
*/
app.controller('Ctrl', ['$scope', '$translate', function ($scope, $translate) {
	  $translate(['HEADLINE', 'PARAGRAPH', 'NAMESPACE.PARAGRAPH']).then(function (translations) {
	    $scope.headline = translations.HEADLINE;
	    $scope.paragraph = translations.PARAGRAPH;
	    $scope.namespaced_paragraph = translations['NAMESPACE.PARAGRAPH'];
	  });
	}]);