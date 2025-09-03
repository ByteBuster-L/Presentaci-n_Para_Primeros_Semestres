document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.getElementById("menu-icon");
    const menu = document.getElementById("menu");
    let lastScrollTop = 0;

    menuIcon.addEventListener("click", function() {
        menu.classList.toggle("active");
    });

    document.addEventListener("click", function(event) {
    // Si el menú está abierto y el clic NO es sobre el menú ni el icono
      if (
         menu.classList.contains("active") &&
         !menu.contains(event.target) &&
         event.target !== menuIcon
      ) {
        menu.classList.remove("active");
      }
    });

    // Cerrar menú al hacer clic en un enlace
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function() {
            menu.classList.remove("active");
        });
    });

    window.addEventListener("scroll", function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            document.querySelector('.navs').style.top = "-170px";
            gsap.from("navegacion", {
                
            })
        } else {
            document.querySelector('.navs').style.top = "0";
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});