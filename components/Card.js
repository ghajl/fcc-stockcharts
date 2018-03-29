import getRandomColor from '../util/RandomColor';

export default function Card(data){
	// console.log(data)
	// var cssHSL = "hsl(" + 360 * Math.random() + ',' +
 //                 (40 + 50 * Math.random()) + '%,' + 
 //                 (40 + 10 * Math.random()) + '%)';
	const cssHSL = getRandomColor();
	const element = `<div id=${data.symbol} class="card">
						<div class="label">
						<div class="symbol" style="color: ${cssHSL}">${data.symbol}</div>
						<div class="name">${data.name}</div>
						</div>
						<div class="close"><i class="material-icons md-18 gray">close</i></div>
					</div>`;
	return element;
}