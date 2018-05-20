export default function getRandomColor() {
    var cssHSL = "hsl(" + 360 * Math.random() + ',' +
                 (40 + 50 * Math.random()) + '%,' + 
                 (40 + 10 * Math.random()) + '%)';
	return cssHSL;
}