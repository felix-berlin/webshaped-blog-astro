export default (() => {
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const id = (event.target as HTMLElement)?.getAttribute("href");

      if (id === "#") return;

      document.querySelector(String(id))?.scrollIntoView({
        block: "start",
        behavior: "smooth",
        inline: "start",
      });

      // window.scrollTo({
      //   behavior: 'smooth',
      //   top:
      //     document.querySelector(id).getBoundingClientRect().top -
      //     document.body.getBoundingClientRect().top -
      //     90,
      // })
    });
  });
})();
