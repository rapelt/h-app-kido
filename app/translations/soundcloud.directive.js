(function () {
    'use strict';

    angular
        .module('app')
        .directive('soundCloud', function (){
            return {
                controller: function ($scope, $sce){
                    $scope.function = someFunction;
                    function someFunction(url){
                        url = url.substring(71, url.length);
                        url = url.substring(0, url.length -  136);
                        url = url + "&amp;color=ff5500&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false"
                        console.log(url);
                        return $sce.trustAsUrl(url);

                    }
                },
                template: function (){
                    return '<iframe width="65px" height="70px" scrolling="no" frameborder="no" ng-src="{{someFunction(translation.url)}}"></iframe>'

                }

        }

        });
})();



/*
return '<iframe ng-if="translation.loadSound" width="65px" height="70px" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/251782188%3Fsecret_token%3Ds-AlABk&amp;color=ff5500&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false"></iframe>';
*/
