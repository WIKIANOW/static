function showAlert(type, mess, $target) {
    console.log(mess);
    const target = $target instanceof jQuery ? $target : $($target || document.body);
    const $alert = $(`
        <div>
            <div class="d-flex justify-content-between">
                <p class="mb-0">${mess}</p>
                <button type="button" class="ms-2 btn-close" data-mdb-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    `);
    $alert.addClass('alert fade ' + type);
    target.after($alert);
    const alertInstance = new mdb.Alert($alert, {
        stacking: true,
        hidden: true,
        position: 'top-right',
        autohide: true,
        delay: 3000,
    });
    alertInstance.show();
    setTimeout(() => $alert.remove(), 3100);
}

function cookieset($target) {
    const target = $target instanceof jQuery ? $target : $($target || document.body);
    const $model = $(`
        <div class="modal frame fade bottom" aria-hidden="true">
            <div class="modal-dialog modal-frame modal-bottom">
                <div class="modal-content rounded-0">
                    <div class="modal-body py-1">
                        <div class="d-flex justify-content-center align-items-center my-3">
                            <p class="mb-0">We use cookies to improve your website experience</p>
                            <button type="button" class="btn btn-success btn-sm ms-2" data-mdb-dismiss="modal">Ok, thanks</button>
                            <button type="button" class="btn btn-primary btn-sm ms-2">Learn more</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    target.after($model);
    const modalInstance = new mdb.Modal($model)
    modalInstance.show()
}