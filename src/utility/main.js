//DOM
const $d = document.querySelector.bind(document);
const API_UPLOAD_FILE = "http://localhost:8080/api/excel/upload";
const API_DATA_UPLOADTED = "http://localhost:8080/api/excel/preApprovals";
//APP
let App = {};
App.init = (function () {
  //Init
  function handleFileSelect(evt) {
    const files = evt.target.files; // FileList object

    //files template
    let template = `${Object.keys(files)
      .map(
        (file) => `<div class="file file--${file}">
     <div class="name"><span>${files[file].name}</span></div>
     <div class="progress active">
     <div class="message-error"></div> 
     </div>
     <div class="done">
	<a href="" target="_blank">
      <svg class="success hidden" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000">
		<g><path id="path" d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z"</g>
	  </svg>
	  <svg class="error hidden" viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g id="Group-2" transform="translate(1.000000, 1.000000)">
						<circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
						<circle  class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
							<path class="ui-error-line1" d="M22.244224,22 L60.4279902,60.1837662" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
							<path class="ui-error-line2" d="M60.755776,21 L23.244224,59.8443492" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
					</g>
			</g>
	  </svg>
	</a>
     </div>
    </div>`
      )
      .join("")}`;

    $d("#drop").classList.add("hidden");
    $d("footer").classList.add("hasFiles");
    $d(".importar").classList.add("active");
    localStorage.removeItem("timeStart");
    setTimeout(() => {
      $d(".list-files").innerHTML = template;
    }, 1000);
    let numSuccess = 0;
    Object.keys(files).forEach((file, indexFile) => {
      let load = 1000 + file * 1000; // fake load
      setTimeout(() => {
        uploadFile(files[file])
          .then((res) => {
            $d(`.file--${file}`)
              .querySelector(".progress")
              .classList.remove("active");
            $d(`.file--${file}`).querySelector(".done").classList.add("anim");
            $d(`.file--${file}`)
              .querySelector(".done")
              .querySelector(".success")
              .classList.remove("hidden");
            if (res.timeStart && !numSuccess) {
              localStorage.setItem("timeStart", res.timeStart);
            }
            numSuccess++;
          })
          .catch((error) => {
            if (error && error.message) {
              $d(`.file--${file}`).querySelector(".message-error").innerText =
                error.message;
            }
            $d(`.file--${file}`).classList.add("error");
            $d(`.file--${file}`)
              .querySelector(".progress")
              .classList.remove("active");
            $d(`.file--${file}`)
              .querySelector(".progress")
              .classList.add("error");
            $d(`.file--${file}`).querySelector(".done").classList.add("anim");
            $d(`.file--${file}`)
              .querySelector(".done")
              .querySelector(".error")
              .classList.remove("hidden");
            console.log(error);
          })
          .finally(() => {
            if (indexFile + 1 == files.length && numSuccess) {
              handleGetData();
            }
            console.log("Experiment completed");
            $(evt.target).val(null);
          });
      }, load);
    });
  }

  const handleGetData = (page = 0, size = 5, filterBy = "", sortBy = "") => {
    const table = $(".data-table");

    const loading = () => {
      const loadEl = $(".loader__wrap");
      const show = () => {
        setTimeout(() => {
          loadEl.removeClass("hidden");
        }, 200);
      };
      const hidden = () => {
        loadEl.addClass("hidden");
      };
      return { show, hidden };
    };

    // build pagination
    const buildPagination = (totalPage, currentPage = 1) => {
      let pagination = $(".pagination");
      $(pagination).empty();
      if (!totalPage) {
        return;
      }
      // add previous button
      let previousBtn = document.createElement("span");
      $(previousBtn).html("&laquo;");
      $(previousBtn).on("click", (event) => {
        event.preventDefault();
        let active = $(pagination).attr("item-active");
        if (active > 0) {
          active--;
          let { size, filterBy, sortBy } = getDataFilter();
          handleGetData(active, size, filterBy, sortBy);
        }
      });
      $(pagination).append(previousBtn);
      // add item page btn
      $(pagination).removeClass("hidden");
      for (let index = 1; index <= totalPage; index++) {
        let page = document.createElement("span");
        let currentIndex = index - 1;
        $(page).text(index);
        $(page).on("click", (event) => {
          event.preventDefault();
          let { size, filterBy, sortBy } = getDataFilter();
          handleGetData(currentIndex, size, filterBy, sortBy);
        });
        if (currentIndex == currentPage) {
          $(page).addClass("active");
          $(pagination).attr("item-active", currentIndex);
        }
        $(pagination).append(page);
      }
      // add next btn
      let nextBtn = document.createElement("span");
      $(nextBtn).html("&raquo;");
      $(nextBtn).on("click", (event) => {
        event.preventDefault();
        let active = $(pagination).attr("item-active");
        if (active) {
          active++;
          if (active < totalPage) {
            let { size, filterBy, sortBy } = getDataFilter();
            handleGetData(active, size, filterBy, sortBy);
          }
        }
      });
      $(pagination).append(nextBtn);
    };

    // build data table
    const buildDataTable = (lstHeaders, details, totalItems = 0, sortBy) => {
      let tempTableBody = $(".data-table-body");
      let temTableHeader = $(".data-table-header");
      $(temTableHeader).empty();
      $(tempTableBody).empty();
      $(table).removeClass("hidden");

      // build header
      let head = document.createElement("tr");
      let keyHeader = lstHeaders.map((item) => {
        // item["key"];
        $(head).addClass("row100 head");
        let th = document.createElement("th");
        $(th).text(item["display"]);
        if (sortBy) {
          if (item.key == sortBy.column) {
            if (sortBy.value == "DESC") {
              $(th).append('<i class="fa fa-chevron-down"/>');
            } else {
              $(th).append('<i class="fa fa-chevron-up"/>');
            }
          }
        }
        $(th).on("click", (event) => {
          event.preventDefault();
          let { page, size, filterBy } = getDataFilter();
          let sortBy = {};
          let header = $(".data-table-header");
          let isSort = $(th).find("i").length ? true : false;
          sortBy.column = item["key"];
          if (isSort) {
            if ($(th).find("i").hasClass("fa-chevron-down")) {
              $(th).find("i").remove();
              $(th).append('<i class="fa fa-chevron-up"/>');
              sortBy.value = "ASC";
              $(header).attr("order-column", item.key);
              $(header).attr("order-value", "ASC");
            } else {
              $(th).find("i").remove();
              $(th).append('<i class="fa fa-chevron-down"/>');
              sortBy.value = "DESC";
              $(header).attr("order-column", item.key);
              $(header).attr("order-value", "DESC");
            }
          } else {
            sortBy.value = "DESC";
            $(header).find("i").remove();
            $(th).append('<i class="fa fa-chevron-down"></i>');
            $(header).attr("order-column", item.key);
            $(header).attr("order-value", "DESC");
          }
          handleGetData(0, size, filterBy, sortBy);
        });
        $(head).append(th);
        $(temTableHeader).append(head);
        return item;
      });

      // build data table
      details.forEach((data) => {
        if (keyHeader && keyHeader.length) {
          let row = document.createElement("tr");
          keyHeader.forEach((header, index) => {
            $(row).addClass("row100 body");
            $(row).append(`<td class="cell100">${data[header["key"]]}</td>`);
            $(tempTableBody).append(row);
          });
        }
      });

      $(".toltal-record").text(`Toltal number of data: ${totalItems}`);
    };

    // build filter by column name
    const buildFilterColumn = (lstHeaders, filterBy) => {
      let selectBoxFilterColumn = $(".filter-column");
      $(selectBoxFilterColumn).empty();
      $(selectBoxFilterColumn).append(
        '<option value="">Select column</option>'
      );
      if (lstHeaders && lstHeaders.length) {
        lstHeaders.forEach((item, index) => {
          let elOption = document.createElement("option");
          $(elOption).attr("value", item["key"]);
          $(elOption).text(item["display"]);
          $(selectBoxFilterColumn).append(elOption);
        });
      } else {
        $(selectBoxFilterColumn).append("<option>No data selected</option>");
      }
      if (filterBy) {
        $(selectBoxFilterColumn).val(filterBy["column"]);
      }
    };

    loading().show();

    getData(page, size, filterBy, sortBy)
      .then((res) => {
        setTimeout(() => {
          buildDataTable(
            res.lstHeaders,
            res.details,
            res.totalItems,
            res.sortBy
          );
          buildPagination(res.totalPages, res.currentPage);
          buildFilterColumn(res.lstHeaders, res.filterBy);
          if (res && res.details && res.details.length) {
            $(".no-data").addClass("hidden");
          } else {
            $(".no-data").removeClass("hidden");
          }
          loading().hidden();
          $(table).removeClass("hidden");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        table.removeClass("hidden");
      })
      .finally(() => {
        setTimeout(() => {
          loading().hidden();
        }, 1000);
      });
  };

  const handellerError = (error) => {
    console.warn(error);
    return new Response(
      JSON.stringify({
        code: 400,
        message: "Stupid network Error",
      })
    );
  };

  // send file to server
  const uploadFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_UPLOAD_FILE, {
      body: formData,
      method: "post",
    }).catch(handellerError);

    const myjson = await response.json().catch(handellerError);

    if (response.ok) {
      return myjson;
    } else {
      return Promise.reject(myjson);
    }
  };

  // get data hasbeen upload
  const getData = async (page, size, filterBy, sortBy) => {
    let timeStart = localStorage.getItem("timeStart");
    const response = await fetch(API_DATA_UPLOADTED, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        size: size,
        timeStart: timeStart ? timeStart : "",
        filterBy,
        sortBy,
      }),
    }).catch(handellerError);

    const myjson = await response.json().catch(handellerError);

    if (response.ok) {
      return myjson;
    } else {
      return Promise.reject(myjson);
    }
  };

  const getDataFilter = () => {
    let columnTitle = $(".filter-column").val();
    let columnValue = $(".filter-search").val();
    let activePage = $(".pagination").attr("item-active");
    let header = $(".data-table-header");
    let numFilterRows = $(".filter-row").val();
    let sortBy = {};
    let filterBy = {};
    sortBy.column = $(header).attr("order-column");
    sortBy.value = $(header).attr("order-value");
    if (columnValue && columnTitle) {
      filterBy.column = columnTitle;
      filterBy.value = columnValue;
    }
    if (isEmpty(filterBy)) {
      filterBy = "";
    }
    if (isEmpty(sortBy)) {
      sortBy = "";
    }
    return { page: activePage, size: numFilterRows, filterBy, sortBy };
  };

  const isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  // trigger input
  $d("#triggerFile").addEventListener("click", (evt) => {
    evt.preventDefault();
    $d("input[type=file]").click();
  });

  // drop events
  $d("#drop").ondragleave = (evt) => {
    $d("#drop").classList.remove("active");
    evt.preventDefault();
  };
  $d("#drop").ondragover = $d("#drop").ondragenter = (evt) => {
    $d("#drop").classList.add("active");
    evt.preventDefault();
  };
  $d("#drop").ondrop = (evt) => {
    $d("input[type=file]").files = evt.dataTransfer.files;
    $d("footer").classList.add("hasFiles");
    $d("#drop").classList.remove("active");
    evt.preventDefault();
  };

  //upload more
  $d(".importar").addEventListener("click", () => {
    $d(".list-files").innerHTML = "";
    $d("footer").classList.remove("hasFiles");
    $d(".importar").classList.remove("active");
    setTimeout(() => {
      $d("#drop").classList.remove("hidden");
    }, 500);
  });

  // input change
  $d("input[type=file]").addEventListener("change", handleFileSelect);

  // select filter row on selected
  $(".filter-row").on("change", (event) => {
    event.preventDefault();
    let selectBox = event.target;
    let { filterBy, sortBy } = getDataFilter();
    handleGetData(0, selectBox.value, filterBy, sortBy);
  });

  // on click btn filter by column
  $(".filter-btn").on("click", (event) => {
    event.preventDefault();
    let { page, size, filterBy, sortBy } = getDataFilter();
    handleGetData(0, size, filterBy, sortBy);
  });
})();
