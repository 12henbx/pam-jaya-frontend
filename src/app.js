/* eslint-disable */
import "bootstrap";
import "./style.css";
import { complaintData } from "./mockData.js";

import $ from "jquery";
import "leaflet";
import "leaflet.heat";
import "datatables.net";
import "datatables.net-dt";
import "datatables.net-bs5";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";
import "./assets/img/favico.png";
import "./assets/img/logo-pam.png";
import "./assets/img/logo-pam-2.png";
import "./assets/img/profile-ico.png";
import "./assets/svg/space_dashboard_black_24dp.svg";
import "./assets/svg/space_dashboard_blue_24dp.svg";
import "./assets/svg/history_black_24dp.svg";
import "./assets/svg/history_blue_24dp.svg";
import "./assets/svg/settings_black_24dp.svg";
import "./assets/svg/logout_black_24dp.svg";
import "./assets/svg/notifications_black_24dp.svg";
import "./assets/svg/download_black_24dp.svg";
import "./assets/svg/alert_box_black_24px.svg";
import "./assets/svg/leaderboard_black_24dp.svg";
import "./assets/svg/alert_box_blue_24px.svg";
import "./assets/svg/leaderboard_blue_24dp.svg";

const BASE_URL = "https://jsonplaceholder.typicode.com";

var mock = new MockAdapter(axios);

const getTodoItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/todos?_limit=5`);

    const todoItems = response.data;

    console.log(`GET: Here's the list of todos`, todoItems);

    return todoItems;
  } catch (errors) {
    console.error(errors);
  }
};

window.onload = function() {
  // Setting up Page 1
  document.getElementById("content-container-custom").style.display = "";
  document.getElementById("div-complaints-custom").style.display = "none";
  document.getElementById("div-history-custom").style.display = "none";

  // Making a map and tiles
  const mymap = L.map("issMap").setView([-7.8236176, 110.3678333], 13);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);

  // Mock axios

  mock.onGet("/users").reply(200, complaintData);
  var responseHeatmap;

  axios.get("/users").then(function(response) {
    console.log(response.data);
    responseHeatmap = response.data;
  });

  // Button Listener

  const heatmapMenu = document.getElementById("heatmap-menu");
  const complaintsMenu = document.getElementById("complaints-menu");
  const historyMenu = document.getElementById("history-menu");
  const performanceMenu = document.getElementById("performance-menu");
  const dkiJakarta = document.getElementById("dki-jakarta");
  const jakpus = document.getElementById("jakpus");
  const jakut = document.getElementById("jakut");
  const jaksel = document.getElementById("jaksel");
  const jakbar = document.getElementById("jakbar");
  const jaktim = document.getElementById("jaktim");
  const kepSeribu = document.getElementById("kep-seribu");

  // Event Listener Menu Sidebar

  heatmapMenu.addEventListener("click", function() {
    document.getElementById("content-container-custom").style.display = "";
    document.getElementById("div-complaints-custom").style.display = "none";
    document.getElementById("div-history-custom").style.display = "none";
    heatmapMenu.classList.add("active-nav-item");
    complaintsMenu.classList.remove("active-nav-item");
    historyMenu.classList.remove("active-nav-item");
    performanceMenu.classList.remove("active-nav-item");
    document.getElementById("heatmap-icon").src =
      "./space_dashboard_blue_24dp.svg";
    document.getElementById("complaints-icon").src =
      "./alert_box_black_24px.svg";
    document.getElementById("history-icon").src = "./history_black_24dp.svg";
    document.getElementById("performance-icon").src =
      "./leaderboard_black_24dp.svg";
  });

  complaintsMenu.addEventListener("click", function() {
    document.getElementById("content-container-custom").style.display = "none";
    document.getElementById("div-complaints-custom").style.display = "";
    document.getElementById("div-history-custom").style.display = "none";
    heatmapMenu.classList.remove("active-nav-item");
    complaintsMenu.classList.add("active-nav-item");
    historyMenu.classList.remove("active-nav-item");
    performanceMenu.classList.remove("active-nav-item");
    document.getElementById("heatmap-icon").src =
      "./space_dashboard_black_24dp.svg";
    document.getElementById("complaints-icon").src =
      "./alert_box_blue_24px.svg";
    document.getElementById("history-icon").src = "./history_black_24dp.svg";
    document.getElementById("performance-icon").src =
      "./leaderboard_black_24dp.svg";
  });

  historyMenu.addEventListener("click", function() {
    document.getElementById("content-container-custom").style.display = "none";
    document.getElementById("div-complaints-custom").style.display = "none";
    document.getElementById("div-history-custom").style.display = "";
    heatmapMenu.classList.remove("active-nav-item");
    complaintsMenu.classList.remove("active-nav-item");
    historyMenu.classList.add("active-nav-item");
    performanceMenu.classList.remove("active-nav-item");
    document.getElementById("heatmap-icon").src =
      "./space_dashboard_black_24dp.svg";
    document.getElementById("complaints-icon").src =
      "./alert_box_black_24px.svg";
    document.getElementById("history-icon").src = "./history_blue_24dp.svg";
    document.getElementById("performance-icon").src =
      "./leaderboard_black_24dp.svg";
  });

  performanceMenu.addEventListener("click", function() {});

  // Event Listener Province

  jakpus.addEventListener("click", function() {
    // responseHeatmap
    const heatJakpusFilter = L.heatLayer(
      [
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.8236176, 110.3678333],
        [-7.7959808, 110.3843038],
        [-7.7959808, 110.3843038],
        [-7.7959808, 110.3843038]
      ],
      { radius: 75 }
    ).addTo(mymap);
  });

  jakut.addEventListener("click", function() {});

  jaksel.addEventListener("click", function() {});

  jakbar.addEventListener("click", function() {});

  jaktim.addEventListener("click", function() {});

  kepSeribu.addEventListener("click", function() {});

  // DataTables complaint-frequency

  $(document).ready(function() {
    // Setup - add a text input to each footer cell
    $("#complaint-frequency thead tr")
      .clone(true)
      .addClass("filters")
      .appendTo("#complaint-frequency thead");

    var tableFrequency = $("#complaint-frequency").DataTable({
      orderCellsTop: true,
      scrollY: "320px",
      scrollCollapse: true,
      searching: false,
      paging: false,
      info: false,
      initComplete: function() {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function(colIdx) {
            // Set the header cell to contain the input element
            var cellComplaint = $(
              ".table-complaint-frequency thead .filters th"
            ).eq($(api.column(colIdx).header()).index());
            var titleComplaint = $(cellComplaint).text();
            $(cellComplaint).html(
              '<input type="text" placeholder="' + titleComplaint + '" />'
            );

            // On every keypress in this input
            $(
              "input",
              $(".table-complaint-frequency thead .filters th").eq(
                $(api.column(colIdx).header()).index()
              )
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
            var cell = $("#example thead .filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            $(
              "input",
              $("#example thead .filters th").eq(
                $(api.column(colIdx).header()).index()
              )
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

function isContentScrolledToBottom(element) {
  const rest = element.scrollHeight - element.scrollTop;
  return Math.abs(element.clientHeight - rest) < 1;
}
