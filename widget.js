function checkBook() {
  const element = document.querySelector(".SummaryPage__book button");
  if (element && !element.disabled) {
    element.click();
  }
  setTimeout(() => checkBook(), 100);
}

checkBook();
