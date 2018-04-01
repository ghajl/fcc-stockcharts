export default function MessageDialog(){
	return `<div class="modal fade" id="messageDialog" tabindex="-1" role="dialog" aria-labelledby="messageDialog" aria-hidden="true">
			  <div class="modal-dialog modal-sm" role="document">
			    <div class="modal-content">
			      <div class="modal-body">
			        <p id="text"></p>
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
			      </div>
			    </div>
			  </div>
			</div>`;
}

