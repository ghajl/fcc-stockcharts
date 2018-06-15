export default function IconLink(obj){
  const href = obj.href || '#top';
  const svgPath = obj.svgPath || 'M150 0 L75 200 L225 200 Z';
  const element = `
    <div class="element" >
        <a href=${href} target="_blank">
          <div class="item">
            <svg class="icon">
              <path d="${svgPath}" />
            </svg>
          </div>
        </a>
    </div>
  `;
  return element.trim();
}