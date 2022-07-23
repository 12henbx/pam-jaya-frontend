/* eslint-disable */
import "bootstrap";
import "./style.css";

import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";
import "./assets/img/favico.png";
import "./assets/img/logo-pam.png";
import "./assets/img/logo-pam-2.png";
import "./assets/img/profile-ico.png";
import "./assets/svg/space_dashboard_black_24dp.svg";
import "./assets/svg/history_black_24dp.svg";
import "./assets/svg/settings_black_24dp.svg";
import "./assets/svg/logout_black_24dp.svg";
import "./assets/svg/notifications_black_24dp.svg";
import "./assets/svg/download_black_24dp.svg";
import "./assets/svg/alert_box_24px.svg";
import "./assets/svg/leaderboard_black_24dp.svg";

window.onload = function() {
  // Making a map and tiles
  const mymap = L.map("issMap").setView([51.505, -0.09], 13);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);

  // Making a marker with a custom icon
  const issIcon = L.icon({
    iconUrl: "iss200.png",
    iconSize: [50, 32],
    iconAnchor: [25, 16]
  });
  const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);

  // var heat = L.heatLayer().addTo(mymap);

  // Table bottom

  $(document).ready(function() {
    // Setup - add a text input to each footer cell
    $("#example thead tr")
      .clone(true)
      .addClass("filters")
      .appendTo("#example thead");

    var table = $("#example").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function() {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function(colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            $(
              "input",
              $(".filters th").eq($(api.column(colIdx).header()).index())
            )
              .off("keyup change")
              .on("change", function(e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                var cursorPosition = this.selectionStart;
                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function(e) {
                e.stopPropagation();

                $(this).trigger("change");
                $(this)
                  .focus()[0]
                  .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      }
    });
  });
};
