// template_c9c74ob
// service_d0jhemc
// pzKixyN1PhnSzLVmX

function contact(event) {
    event.preventDefault();
    const loading = document.querySelector('modal__overlay--loading');
    const success = document.querySelector('modal__overlay--success');
    loading.classList += " modal__overlay--visible";

    emailjs
        .sendform(
            'service_d0jhemc',
            'template_c9c74ob',
            event.target,
            'pzKixyN1PhnSzLVmX'
        ).then(() => {
            loading.classList.remove("modal__overlay--visible");
            success.classList += " modal__overlay--visible";
        }).catch(() => {
            loading.classList.remove("modal__overlay--visible");
            alert(
                "The email service is temporarily unavailable. Please contact me directly at mark.waldron7string@gmail.com"
            );
        })
}