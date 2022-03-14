let activeDate = null;

function bindOutsideWindow() {
  const elements = document.getElementsByClassName("date");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element.__bound) {
      element.__bound = true;
    } else {
      continue;
    }
    element.addEventListener(
      "click",
      () => {
        const date = angular.element(element).scope().day.dateString;
        angular
          .element(element)
          .injector()
          .get("ResySearch", element)
          .setSelectedDate(date);
        activeDate = date;
        console.log(date);
      },
      true
    );
  }
}

function isVenuePage() {
  return document.getElementsByClassName("page-venue-details").length > 0;
}

(function () {
  if (isVenuePage()) {
    angular
      .element(document.body)
      .injector()
      .get("$rootScope")
      .$watch(function () {
        bindOutsideWindow();
      });

    let interval = null;
    const trigger = document.createElement("button");
    trigger.innerText = "Autobook";
    trigger.addEventListener("click", () => {
      interval = setInterval(() => {
        console.log(activeDate);
        if (!activeDate) {
          return;
        }
        if (document.querySelector("resy-loader[aria-hidden=false]")) {
          return;
        }
        const reservations = document.querySelectorAll(
          "resy-reservation-button"
        );
        const orders = ["7", "6", "8"];
        for (const order of orders) {
          for (let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i].innerText;
            if (reservation.includes(order)) {
              reservations[i].querySelector("button").click();
              clearInterval(interval);
              return;
            }
          }
        }
        if (reservations.length > 0) {
          reservations[0].querySelector("button").click();
        }
        angular
          .element(document.body)
          .injector()
          .get("$rootScope")
          .$broadcast(
            "SELECTED_DATE_UPDATED",
            moment(activeDate).toDate(),
            moment(activeDate).toDate()
          );
      }, 150);
    });
    const stop = document.createElement("button");
    stop.innerText = "Stop";
    stop.addEventListener("click", () => {
      clearInterval(interval);
    });
    console.log(document.querySelector("resy-inline-booking"));
    document
      .querySelector("resy-inline-booking")
      .insertAdjacentElement("afterend", stop);
    document
      .querySelector("resy-inline-booking")
      .insertAdjacentElement("afterend", trigger);
  } else {
    console.log("NOT THE PAGE");
  }
})();
