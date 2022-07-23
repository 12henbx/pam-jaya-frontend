/* eslint-disable */
import "bootstrap";
import "./style.css";
import { complaintData, complaintList } from "./mockData.js";

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
import "./assets/svg/show-btn.svg";
import "./assets/svg/handle-btn.svg";
import "./assets/svg/handled-btn.svg";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// var mock = new MockAdapter(axios);
var responseHeatmap,
  responseComplaint,
  selectedResponseComplaint,
  responseHistory,
  selectedResponseHistory,
  jakutFreq,
  jakselFreq,
  uncategorizedFreq,
  jakpusFreq,
  jaktimFreq,
  jakbarFreq,
  kepSeribuFreq;

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
  const mymap = L.map("issMap").setView([-6.2212643, 106.7893274], 13);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);

  // Mock axios

  // mock.onGet("/users").reply(200, complaintData);
  // mock.onGet("/complaints").reply(200, complaintList);

  axios
    .get(
      "https://hackwater-backend-service.herokuapp.com/dashboard/complaint?page=1&limit=100",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJleHAiOjE2NTg4Njc3Njh9.sotZD_AxdUTkrCHbgn6LEo2XGRYvMs1PRyup9fp9FZ8"
        }
      }
    )
    .then(function(response) {
      console.log(response.data);
      responseComplaint = response.data.data;
      for (let i = 0; i < responseComplaint.length; i++) {
        let action = `<img src="./show-btn.svg" alt="show"><span>      </span><img ${(onclick = complaintsModal(
          i
        ))} data-coreui-toggle="modal" data-coreui-target="#complaintsModal" src="./handle-btn.svg" alt="hanlde">`;
        var t = $("#example").DataTable();
        t.row
          .add([
            responseComplaint[i].complaint_id,
            timeDifferenceNow(responseComplaint[i].created_at),
            responseComplaint[i].username,
            responseComplaint[i].platform,
            responseComplaint[i].location,
            responseComplaint[i].category,
            responseComplaint[i].status,
            action
          ])
          .draw(false);
      }
    })
    .catch(error => {
      console.log(error);
    });

  var assignTicketBtn = document.getElementById("assign-ticket-btn");
  assignTicketBtn.addEventListener("click", assignTicketApi, false);

  // My History API
  axios
    .get(
      "https://hackwater-backend-service.herokuapp.com/dashboard/history?page=1&limit=100",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uIFNub3ciLCJlbWFpbCI6ImpvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiZXhwIjoxNjU4ODYxNTc3fQ.gxnHs31bLXb7qP3sS4b09ubiWd4ZS-3Xp99782LjXV0"
        }
      }
    )
    .then(function(response) {
      console.log(response.data);
      responseHistory = response.data.data;
      for (let i = 0; i < responseHistory.length; i++) {
        let action = `<img src="./show-btn.svg" alt="show"><span>      </span><img ${(onclick = historyModal(
          i
        ))} data-coreui-toggle="modal" data-coreui-target="#historyModal" src="./handle-btn.svg" alt="hanlde">`;
        var t = $("#history-table").DataTable();
        t.row
          .add([
            responseHistory[i].complaint_id,
            timeDifferenceNow(responseHistory[i].solve_at),
            responseHistory[i].username,
            responseHistory[i].platform,
            responseHistory[i].location,
            responseHistory[i].category,
            responseHistory[i].status,
            action
          ])
          .draw(false);
      }
    })
    .catch(error => {
      console.log(error);
    });

  var solveTicketBtn = document.getElementById("solve-ticket-btn");
  solveTicketBtn.addEventListener("click", solveTicketApi, false);

  // Heatmap

  axios
    .get(
      "https://hackwater-backend-service.herokuapp.com/dashboard/heatmap?start=2022-07-21T08:30:31.000Z&end=2022-07-24T22:45:39.000Z",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJleHAiOjE2NTg4Njc3Njh9.sotZD_AxdUTkrCHbgn6LEo2XGRYvMs1PRyup9fp9FZ8"
        }
      }
    )
    .then(function(response) {
      console.log(response.data);
      responseHeatmap = response.data.data;
      for (let i = 0; i < Object.keys(responseHeatmap).length; i++) {
        if ("Jakarta Utara" === Object.keys(responseHeatmap)[i]) {
          jakutFreq = responseHeatmap["Jakarta Utara"];
          console.log(jakutFreq);
        } else if ("uncategorized" === Object.keys(responseHeatmap)[i]) {
          uncategorizedFreq = responseHeatmap["uncategorized"];
        } else if ("Jakarta Selatan" === Object.keys(responseHeatmap)[i]) {
          jakselFreq = responseHeatmap["Jakarta Selatan"];
        }
        jakpusFreq = responseHeatmap["Jakarta Selatan"];
        jaktimFreq = responseHeatmap["Jakarta Utara"];
        jakbarFreq = responseHeatmap["uncategorized"];
        kepSeribuFreq = responseHeatmap["uncategorized"];
      }
    })
    .catch(error => {
      console.log(error);
    });

  // axios.get("/complaints").then(function(response) {
  //   console.log(response.data);
  // var table = document.getElementById("example");
  // var row = table.insertRow(0);
  // var complaintId = row.insertCell(0);
  // var created = row.insertCell(1);
  // var username = row.insertCell(2);
  // var platform = row.insertCell(3);
  // var location = row.insertCell(4);
  // var category = row.insertCell(5);
  // var status = row.insertCell(6);

  // var t = $('#example').DataTable();
  // t.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);

  // complaintId.innerHTML = response.data.data.complaint_id;
  // created.innerHTML = response.data.data.created_at;
  // username.innerHTML = response.data.data.username;
  // platform.innerHTML = response.data.data.platform;
  // location.innerHTML = response.data.data.location;
  // category.innerHTML = response.data.data.category;
  // status.innerHTML = response.data.data.status;
  // });

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

  var heatmapProvince = L.heatLayer([], { radius: 50 }).addTo(mymap),
    draw = true;

  dkiJakarta.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < jakpusFreq.length; i++) {
      Object.keys(jakpusFreq[i]).forEach((value, index) => {
        t.row.add([value, jakpusFreq[i][value].frequency]).draw(false);
      });
    }
    for (let i = 0; i < jakutFreq.length; i++) {
      Object.keys(jakutFreq[i]).forEach((value, index) => {
        t.row.add([value, jakutFreq[i][value].frequency]).draw(false);
      });
    }
    for (let i = 0; i < jakselFreq.length; i++) {
      Object.keys(jakselFreq[i]).forEach((value, index) => {
        t.row.add([value, jakselFreq[i][value].frequency]).draw(false);
      });
    }
    for (let i = 0; i < jakbarFreq.length; i++) {
      Object.keys(jakbarFreq[i]).forEach((value, index) => {
        t.row.add([value, jakbarFreq[i][value].frequency]).draw(false);
      });
    }
  });

  jakpus.addEventListener("click", function() {
    for (let i = 0; i < jakpusFreq.length; i++) {
      Object.keys(jakpusFreq[i]).forEach((value, index) => {
        for (let j = 0; j < 50; j++)
          heatmapProvince.addLatLng([
            jakpusFreq[i][value].data[0].lat,
            jakpusFreq[i][value].data[0].long
          ]);
      });
    }

    var t = $("#complaint-frequency").DataTable();
    console.log(jakpusFreq);
    t.clear();
    for (let i = 0; i < jakpusFreq.length; i++) {
      Object.keys(jakpusFreq[i]).forEach((value, index) => {
        t.row.add([value, jakpusFreq[i][value].frequency]).draw(false);
      });
    }
  });

  jakut.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < jakutFreq.length; i++) {
      Object.keys(jakutFreq[i]).forEach((value, index) => {
        t.row.add([value, jakutFreq[i][value].frequency]).draw(false);
      });
    }
  });

  jaksel.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < jakselFreq.length; i++) {
      Object.keys(jakselFreq[i]).forEach((value, index) => {
        t.row.add([value, jakselFreq[i][value].frequency]).draw(false);
      });
    }
  });

  jakbar.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < jakbarFreq.length; i++) {
      Object.keys(jakbarFreq[i]).forEach((value, index) => {
        t.row.add([value, jakbarFreq[i][value].frequency]).draw(false);
      });
    }
  });

  jaktim.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < jaktimFreq.length; i++) {
      Object.keys(jaktimFreq[i]).forEach((value, index) => {
        t.row.add([value, jaktimFreq[i][value].frequency]).draw(false);
      });
    }
  });

  kepSeribu.addEventListener("click", function() {
    var t = $("#complaint-frequency").DataTable();
    t.clear();
    for (let i = 0; i < kepSeribuFreq.length; i++) {
      Object.keys(kepSeribuFreq[i]).forEach((value, index) => {
        t.row.add([value, kepSeribuFreq[i][value].frequency]).draw(false);
      });
    }
  });

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
                // $(this)
                //   .focus()[0]
                //   .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      }
    });
  });

  // Table bottom Comaplints

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
            if (colIdx < 7) {
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
                  // $(this)
                  //   .focus()[0]
                  //   .setSelectionRange(cursorPosition, cursorPosition);
                });
            }
          });
      }
    });

    $("#example").on("click", "tbody tr", function(index) {
      // var row = table.row($(this)).data();
      var rowIndex = table.row($(this)).index();
      complaintsModal(rowIndex);
    });
  });

  // Table history

  $(document).ready(function() {
    // Setup - add a text input to each footer cell
    $("#history-table thead tr")
      .clone(true)
      .addClass("filters")
      .appendTo("#history-table thead");

    var table = $("#history-table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function() {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function(colIdx) {
            if (colIdx < 7) {
              // Set the header cell to contain the input element
              var cell = $("#history-table thead .filters th").eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="text" placeholder="' + title + '" />');

              // On every keypress in this input
              $(
                "input",
                $("#history-table thead .filters th").eq(
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
                  // $(this)
                  //   .focus()[0]
                  //   .setSelectionRange(cursorPosition, cursorPosition);
                });
            }
          });
      }
    });
    $("#history-table").on("click", "tbody tr", function(index) {
      // var row = table.row($(this)).data();
      var rowIndexHistory = table.row($(this)).index();
      console.log(rowIndexHistory);
      historyModal(rowIndexHistory);
    });
  });

  function assignTicketApi() {
    console.log("test");
    axios
      .post(
        `https://hackwater-backend-service.herokuapp.com/dashboard/complaint/assign?complaint_id=${selectedResponseComplaint.complaint_id}`,
        null,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uIFNub3ciLCJlbWFpbCI6ImpvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiZXhwIjoxNjU4ODYxNTc3fQ.gxnHs31bLXb7qP3sS4b09ubiWd4ZS-3Xp99782LjXV0"
          }
        }
      )
      .then(function(response) {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    var complaintTableVar = $("#example").DataTable();
    complaintTableVar.clear();
    axios
      .get(
        "https://hackwater-backend-service.herokuapp.com/dashboard/complaint?page=1&limit=100",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJleHAiOjE2NTg4Njc3Njh9.sotZD_AxdUTkrCHbgn6LEo2XGRYvMs1PRyup9fp9FZ8"
          }
        }
      )
      .then(function(response) {
        console.log(response.data);
        responseComplaint = response.data.data;
        for (let i = 0; i < responseComplaint.length; i++) {
          let action = `<img src="./show-btn.svg" alt="show"><span>      </span><img ${(onclick = complaintsModal(
            i
          ))} data-coreui-toggle="modal" data-coreui-target="#complaintsModal" src="./handle-btn.svg" alt="hanlde">`;
          var t = $("#example").DataTable();
          t.row
            .add([
              responseComplaint[i].complaint_id,
              timeDifferenceNow(responseComplaint[i].created_at),
              responseComplaint[i].username,
              responseComplaint[i].platform,
              responseComplaint[i].location,
              responseComplaint[i].category,
              responseComplaint[i].status,
              action
            ])
            .draw(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function solveTicketApi() {
    console.log("test");
    axios
      .post(
        `https://hackwater-backend-service.herokuapp.com/dashboard/history/solve?complaint_id=${selectedResponseHistory.complaint_id}`,
        null,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uIFNub3ciLCJlbWFpbCI6ImpvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiZXhwIjoxNjU4ODYxNTc3fQ.gxnHs31bLXb7qP3sS4b09ubiWd4ZS-3Xp99782LjXV0"
          }
        }
      )
      .then(function(response) {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    var historyTableVar = $("#history-table").DataTable();
    historyTableVar.clear();
    axios
      .get(
        "https://hackwater-backend-service.herokuapp.com/dashboard/history?page=1&limit=100",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uIFNub3ciLCJlbWFpbCI6ImpvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiZXhwIjoxNjU4ODYxNTc3fQ.gxnHs31bLXb7qP3sS4b09ubiWd4ZS-3Xp99782LjXV0"
          }
        }
      )
      .then(function(response) {
        console.log(response.data);
        responseHistory = response.data.data;
        for (let i = 0; i < responseHistory.length; i++) {
          let action = `<img src="./show-btn.svg" alt="show"><span>      </span><img ${(onclick = historyModal(
            i
          ))} data-coreui-toggle="modal" data-coreui-target="#historyModal" src="./handle-btn.svg" alt="hanlde">`;
          var t = $("#history-table").DataTable();
          t.row
            .add([
              responseHistory[i].complaint_id,
              timeDifferenceNow(responseHistory[i].solve_at),
              responseHistory[i].username,
              responseHistory[i].platform,
              responseHistory[i].location,
              responseHistory[i].category,
              responseHistory[i].status,
              action
            ])
            .draw(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

function isContentScrolledToBottom(element) {
  const rest = element.scrollHeight - element.scrollTop;
  return Math.abs(element.clientHeight - rest) < 1;
}

function timeDifferenceNow(date2) {
  // var difference = date1.getTime() - date2.getTime();
  var difference = new Date().getTime() - new Date(date2).getTime();

  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  var secondsDifference = Math.floor(difference / 1000);

  if (daysDifference > 0) {
    return daysDifference.toString() + " days ago";
  } else if (hoursDifference > 0) {
    return hoursDifference.toString() + " hours ago";
  } else if (minutesDifference > 0) {
    return minutesDifference.toString() + " minutes ago";
  } else {
    return secondsDifference.toString() + " seconds ago";
  }
}

function complaintsModal(idx) {
  selectedResponseComplaint = responseComplaint[idx];
  document.getElementById("complaint-id-modal").innerHTML =
    responseComplaint[idx].complaint_id;
  document.getElementById("username-modal").innerHTML =
    responseComplaint[idx].username;
  document.getElementById("location-modal").innerHTML =
    responseComplaint[idx].location;
  document.getElementById("status-modal").innerHTML =
    responseComplaint[idx].status;
  document.getElementById("assigned-time-modal").innerHTML =
    responseComplaint[idx].assigned_at;
  document.getElementById(
    "complaint-created-modal"
  ).innerHTML = timeDifferenceNow(responseComplaint[idx].created_at);
  document.getElementById("platform-modal").innerHTML =
    responseComplaint[idx].platform;
  document.getElementById("category-modal").innerHTML =
    responseComplaint[idx].category;
  document.getElementById("handler-modal").innerHTML =
    responseComplaint[idx].assigned_at;
  document.getElementById("solved-time-modal").innerHTML =
    responseComplaint[idx].solved_at;
  document.getElementById("complaint-message-modal").innerHTML =
    responseComplaint[idx].message;
}

function historyModal(idx) {
  console.log(idx);
  selectedResponseHistory = responseHistory[idx];
  document.getElementById("complaint-id-history-modal").innerHTML =
    responseHistory[idx].complaint_id;
  document.getElementById("username-history-modal").innerHTML =
    responseHistory[idx].username;
  document.getElementById("location-history-modal").innerHTML =
    responseHistory[idx].location;
  document.getElementById("status-history-modal").innerHTML =
    responseHistory[idx].status;
  document.getElementById("assigned-time-history-modal").innerHTML =
    responseHistory[idx].assigned_at;
  document.getElementById(
    "complaint-created-history-modal"
  ).innerHTML = timeDifferenceNow(responseHistory[idx].created_at);
  document.getElementById("platform-history-modal").innerHTML =
    responseHistory[idx].platform;
  document.getElementById("category-history-modal").innerHTML =
    responseHistory[idx].category;
  document.getElementById("handler-history-modal").innerHTML =
    responseHistory[idx].assigned_at;
  document.getElementById("solved-time-history-modal").innerHTML =
    responseHistory[idx].solved_at;
  document.getElementById("complaint-message-history-modal").innerHTML =
    responseHistory[idx].message;
}
