function checkAndClearLocalStorage() {
    const siteVersion = localStorage.getItem('updatedVersion');
    const updateVersion = 1;
    if (siteVersion === null || parseInt(siteVersion) < updateVersion) {
        Swal.fire({
            title: "Update",
            text: "Hey New Update is Released <strong>Do You Want To Update</strong>",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Update",
            denyButtonText: `No`
        }).then((result) => {
            if (result.isConfirmed) {
                if(localStorage.getItem('lastSearch')){
                  var lastSearch=localStorage.getItem('lastSearch');
                }
                localStorage.clear();
                localStroage.setItem('updatedVersion',updateVersion);
                localStroage.setItem('lastSearch',lastSearch);
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
