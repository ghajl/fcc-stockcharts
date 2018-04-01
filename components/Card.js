import getRandomColor from '../util/RandomColor';

export default function Card(data){
	// console.log(data)
	// var cssHSL = "hsl(" + 360 * Math.random() + ',' +
 //                 (40 + 50 * Math.random()) + '%,' + 
 //                 (40 + 10 * Math.random()) + '%)';
	const cssHSL = getRandomColor();
	const element = `<div id=${data.symbol} class="fcc-sc-card">
						<div class="fcc-sc-label">
						<div class="fcc-sc-symbol" style="color: ${cssHSL}">${data.symbol}</div>
						<div class="fcc-sc-name">${data.name}</div>
						</div>
						<div class="fcc-sc-close"><i class="material-icons md-18 gray">close</i></div>
					</div>`;
	return element;
}