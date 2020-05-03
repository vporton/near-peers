// https://www.geodatasource.com/developers/javascript
export function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export function latitudeToI64(latitude) {
    return String(Math.floor((latitude + 90) / 180 * 2**64));
}

export function longtitudeToI64(longtitude) {
    return String(Math.floor((longtitude + 180) / 360 * 2**64));
}

export function i64ToLatitude(x) {
    return (x / 2**64) * 180 - 90;
}

export function i64ToLongtitude(y) {
    return (y / 2**64) * 360 - 180;
}

