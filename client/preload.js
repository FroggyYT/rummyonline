var PRELOAD_IMAGE_CACHE = [];

function preloadImage(url) {
	var j = new Image();
	j.src = url;
	PRELOAD_IMAGE_CACHE.push(j);
}
