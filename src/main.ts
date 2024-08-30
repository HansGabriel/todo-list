document.getElementById("state-button")!.addEventListener("click", () => {
  const h1Element = document.getElementById("state-display");
  const text = h1Element?.textContent;

  if (text === "Off") {
    h1Element!.textContent = "On";
  } else {
    h1Element!.textContent = "Off";
  }
});
