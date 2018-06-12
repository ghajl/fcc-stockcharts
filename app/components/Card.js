import getRandomColor from '../util/RandomColor';

export default function Card(data){
  const element = `
    <div id=${data.symbol} class="fcc-sc-card">
      <div class="fcc-sc-label">
        <div class="fcc-sc-symbol" style="color: ${data.color}">
          ${data.symbol}
        </div>
        <div class="fcc-sc-name">
          ${data.companyName}
        </div>
        <i class="fcc-sc-close material-icons md-18 gray">close</i>
      </div>
    </div>
  `;
  return element;
}