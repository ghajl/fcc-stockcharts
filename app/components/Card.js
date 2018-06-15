export default function Card(data){
  const element = `
    <div id=${data.symbol} class="card">
      <div class="wrapper">
        <div class="symbol" style="color: ${data.color}">
          ${data.symbol}
        </div>
        <div class="company_name">
          ${data.companyName}
        </div>
        <i class="close material-icons md-18 gray">close</i>
      </div>
    </div>
  `;
  return element.trim();
}