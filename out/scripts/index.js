function assignAccordion(selector) {
    let toggleBtn = $(selector);
    toggleBtn.on("click", (e) => {
        $(e.target).next("div").slideToggle();
        $(e.target).toggleClass("open");
    });
}

$(() => {
    setTimeout(() => {
        assignAccordion("button.acc");
    }, 50);
    $("button.acc.open + div").slideDown();
    renderMathInElement(document.body, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
        ],
    });
});
