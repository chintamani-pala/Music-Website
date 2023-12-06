function checkAndClearLocalStorage() {
    const siteVersion = localStorage.getItem('updatedVersion');
    const localStorageLength = localStorage.length;
    const updateVersion = 9;
    if(localStorageLength == 0){
        localStorage.setItem('updatedVersion', updateVersion);
    }
    if (localStorageLength != 0 && (siteVersion === null || parseInt(siteVersion) < updateVersion)) {
        Swal.fire({
            title: "Update",
            html: `Hey New Update is Released <br><strong>Do You Want To Update?</strong>`,
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
    } else {
        console.log('site is updated no need to update');
    }
}
window.onload = function() {
    checkAndClearLocalStorage();
};
window.onscroll = function() {
    const nav = document.querySelector('nav');
    if (window.pageYOffset > document.body.scrollHeight*0.1) {
        nav.classList.add('fixed-nav');
    } else {
        nav.classList.remove('fixed-nav');
    }
};
