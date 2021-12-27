//DOM
const $ = document.querySelector.bind(document);
const API_UPLOAD_FILE = "http://localhost:8080/api/excel/upload";
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

    $("#drop").classList.add("hidden");
    $("footer").classList.add("hasFiles");
    $(".importar").classList.add("active");
    setTimeout(() => {
      $(".list-files").innerHTML = template;
    }, 1000);

    Object.keys(files).forEach((file) => {
      let load = 1000 + file * 1000; // fake load
      setTimeout(() => {
        uploadFile(files[file])
          .then((res) => {
            $(`.file--${file}`)
              .querySelector(".progress")
              .classList.remove("active");
            $(`.file--${file}`).querySelector(".done").classList.add("anim");
            $(`.file--${file}`).querySelector(".done").querySelector(".success").classList.remove("hidden");
            console.log(res);
          })
          .catch((error) => {
            if (error && error.message) {
              $(`.file--${file}`).querySelector(".message-error").innerText =
                error.message;
            }
            $(`.file--${file}`).classList.add("error");
            $(`.file--${file}`)
              .querySelector(".progress")
              .classList.remove("active");
            $(`.file--${file}`)
              .querySelector(".progress")
              .classList.add("error");
            $(`.file--${file}`).querySelector(".done").classList.add("anim");
            $(`.file--${file}`).querySelector(".done").querySelector(".error").classList.remove("hidden");
            console.log(error);
          });
      }, load);
      //   let load = 2000 + file * 2000; // fake load
      //   setTimeout(() => {}, load);
    });
  }

  // send file to server
  const uploadFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);

    const handellerError = (error) => {
      console.warn(error);
      return new Response(
        JSON.stringify({
          code: 400,
          message: "Stupid network Error",
        })
      );
    };

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

  // trigger input
  $("#triggerFile").addEventListener("click", (evt) => {
    evt.preventDefault();
    $("input[type=file]").click();
  });

  // drop events
  $("#drop").ondragleave = (evt) => {
    $("#drop").classList.remove("active");
    evt.preventDefault();
  };
  $("#drop").ondragover = $("#drop").ondragenter = (evt) => {
    $("#drop").classList.add("active");
    evt.preventDefault();
  };
  $("#drop").ondrop = (evt) => {
    $("input[type=file]").files = evt.dataTransfer.files;
    $("footer").classList.add("hasFiles");
    $("#drop").classList.remove("active");
    evt.preventDefault();
  };

  //upload more
  $(".importar").addEventListener("click", () => {
    $(".list-files").innerHTML = "";
    $("footer").classList.remove("hasFiles");
    $(".importar").classList.remove("active");
    setTimeout(() => {
      $("#drop").classList.remove("hidden");
    }, 500);
  });

  // input change
  $("input[type=file]").addEventListener("change", handleFileSelect);

  
})();
