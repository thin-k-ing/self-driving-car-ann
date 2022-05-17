function lerp(A, B, t) {
	return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
	const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
	const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
	const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

	if (bottom != 0) {
		const t = tTop / bottom;
		const u = uTop / bottom;

		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
			return {
				x: lerp(A.x, B.x, t),
				y: lerp(A.y, B.y, t),
				offset: t,
			};
		}
	}

	return null;
}

function polysIntersect(polyA, polyB) {
	for (let i = 0; i < polyA.length; i++) {
		for (let j = 0; j < polyB.length; j++) {
			const touch = getIntersection(
				polyA[i],
				polyA[(i + 1) % polyA.length],
				polyB[j],
				polyB[(j + 1) % polyB.length]
			);

			// console.log(touch);

			if (touch) {
				return true;
			}
		}
	}

	return false;
}

function getRGBA(value) {
	const alpha = Math.abs(value);
	const R = value < 0 ? 0 : 255;
	const G = R;
	const B = value > 0 ? 0 : 255;

	return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
