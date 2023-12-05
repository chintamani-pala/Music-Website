function checkAndClearLocalStorage() {
    const siteVersion = localStorage.getItem('updatedVersion');
    const localStorageLength = localStorage.length;
    const updateVersion = 1;
    if (localStorageLength != 0 && (siteVersion === null || parseInt(siteVersion) < updateVersion)) {
        Swal.fire({
            title: "Update",
            html: `Hey New Update is Released <strong>Do You Want To Update</strong>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Update",
            denyButtonText: `No`
        }).then((result) => {
            if (result.isConfirmed) {
                if (localStorage.getItem('lastSearch')) {
                    var lastSearch = localStorage.getItem('lastSearch');
                }
                localStorage.clear();
                localStorage.setItem('updatedVersion', updateVersion);
                localStorage.setItem('lastSearch', lastSearch);
                Swal.fire("<strong>Site is Updated</strong>", "", "success");
            } else if (result.isDenied) {
                Swal.fire("<strong>Site is not Updated</strong>", "", "warning");
            }
        });
        console.log('localStorage data cleared.');
    } else {
        console.log('site is updated no need to update');
    }
}
window.onload = function() {
    checkAndClearLocalStorage();
};
