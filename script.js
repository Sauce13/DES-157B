(function () {
  "use strict";

  const button = document.querySelector("button");
  const body = document.querySelector("body");
  const banner = document.querySelector("#banner");
  const sections = document.querySelectorAll("section");
  const hearts = document.querySelectorAll(".heart");

  let mode = "dark";
  let mouse = 1;
  let counter = 0;

  button.addEventListener("click", function () {
    if (mode === "dark") {
      body.className = "switch";
      banner.className = "switch";
      button.className = "switch";
      hearts.forEach((heart) => {
        heart.className = "heart switch";
      });
      for (const section of sections) {
        section.className = "switch";
      }

      mode = "light";
    } else {
      body.removeAttribute("class");
      banner.removeAttribute("class");
      button.removeAttribute("class");
      hearts.forEach((heart) => {
        heart.className = "heart";
      });
      for (const section of sections) {
        section.removeAttribute("class");
      }
      mode = "dark";
    }
  });

  button.addEventListener("mousedown", () => {
    if (mouse === 1) {
      mouse = setInterval(whileMouseDown, 10);
    }
  });

  button.addEventListener("mouseup", () => {
    banner.style.width = `1100px`;
    banner.style.height = `250px`;
    banner.style.boxShadow = `0px 0px 0px`;

    hearts.forEach((heart) => {
      heart.style.setProperty("--heartHeight", "100px");
      heart.style.setProperty("--heartWidth", "100px");
      heart.style.height = "100px";
      heart.style.width = "100px";
    });
 
    clearInterval(mouse);
    mouse = 1;

  });

  function whileMouseDown() {
    counter++;
    banner.style.width = `1200px`;
    banner.style.height = `300px`;
    banner.style.boxShadow = `10px 5px 5px ${
      mode === "dark" ? "red" : "lightblue"
    }`;

    hearts.forEach((heart) => {
      heart.style.setProperty("--heartHeight", "120px");
      heart.style.setProperty("--heartWidth", "120px");
      heart.style.height = "120px";
      heart.style.width = "120px";
      heart.style.transform = `rotate(${counter * 3}deg)`;
    });
  }
})();
