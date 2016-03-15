/* global SC */
angular.module('soundcloud-widget', ['ng'])
.service ('soundcloudWidgetUtils', ['$rootScope', function ($rootScope) {

	var Service = {};
	
	Service.ready = false;

	(function () {

		var validProtocols = ['http:', 'https:'];
		var url = '//w.soundcloud.com/player/api.js';

		// We'd prefer a protocol relative url, but let's
		// fallback to `http:` for invalid protocols
		if (validProtocols.indexOf(window.location.protocol) < 0) {
			url = 'http:' + url;
		}
		var tag = document.createElement('script');
		tag.src = url;
		tag.onload = function() {
	        $rootScope.$apply(function () {
				Service.ready = true;
			});
		};
		
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	}());
	
	return Service;

}])
.directive('soundcloudTrack', ['soundcloudWidgetUtils', '$compile', function(soundcloudWidgetUtils, $compile) {
	
	var uniqId = 1;
	
	var eventPrefix = "soundcloud.player.";
	
	return {
		restrict: 'A',
		scope: {
			trackUrl: '=?',
			player: '=?',
			playerVars: '=?'
		},
		transclude: true,
		link: function(scope, element, attrs) {

			// allows us to $watch `ready`
			scope.utils = soundcloudWidgetUtils;

			// player-id attr > id attr > directive-generated ID
			var playerId = scope.playerId || element[0].id || 'unique-soundcloud-widget-id-' + uniqId++;
			element[0].id = playerId;

			var serialize = function(obj) {
				var str = [];
				for(var p in obj)
					if (obj.hasOwnProperty(p)) {
						str.push(p + "=" + obj[p]);
					}
				return str.join("&");
			};

			// Defaults for variables
			scope.playerVars = scope.playerVars || {};
			
			function createPlayer() {
								
				var player_events = [
					SC.Widget.Events.LOAD_PROGRESS,
					SC.Widget.Events.PLAY_PROGRESS,
					SC.Widget.Events.PLAY,
					SC.Widget.Events.PAUSE,
					SC.Widget.Events.FINISH,
					SC.Widget.Events.SEEK,
					SC.Widget.Events.READY,
					SC.Widget.Events.CLICK_DOWNLOAD,
					SC.Widget.Events.CLICK_BUY,
					SC.Widget.Events.OPEN_SHARE_PANEL,
					SC.Widget.Events.ERROR
				];
				
				var iframe = document.createElement('iframe');
				iframe.src = "https://w.soundcloud.com/player/?url=" + scope.trackUrl + "&" + serialize(scope.playerVars);
				iframe.id = playerId;
				element.empty().append($compile(iframe)(scope));
				var player = SC.Widget(iframe);
				player.id = playerId;
				
				player_events.forEach(function(event) {
					player.bind(event, function(){
						var args = Array.prototype.slice.call(arguments);
						args.unshift(eventPrefix + event, scope.player);
						scope.$emit.apply(scope, args);
					});
				});
				
				return player;
			};
			
			function loadPlayer () {
				if(playerId && scope.trackUrl) {
					scope.player = createPlayer();
				}
			}
			
			var stopWatchingReady = scope.$watch(
				function () {
					return scope.utils.ready && scope.trackUrl !== undefined;
				},
				function (ready) {
					if(ready) {
						stopWatchingReady();
						scope.$watch('trackUrl', function(url) {
							loadPlayer();
						});
					}
				}
			);

		}
	};
}]);
