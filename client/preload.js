var PRELOAD_IMAGE_CACHE = [];

function preloadImages() {
	for (var i of arguments) {
		var j = new Image();
		j.src = i;
		PRELOAD_IMAGE_CACHE.push(j);
	}
}