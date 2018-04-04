export default function IconLink(obj){
	const href = obj.href || '#top';
	const svgPath = obj.svgPath || 'M150 0 L75 200 L225 200 Z';
	return `<div class="fcc-sc-element" >
                    <div class="fcc-sc-link">
                        <div>
                            <a href=${href} target="_blank" class="fcc-sc-a">
                            <div class="fcc-sc-item">
                                <svg class="fcc-sc-icon">
                                    <path d="${svgPath}" />
                                </svg>
                                
                            </div>
                            </a>
                        </div>    
                    </div>
                </div>`;
}