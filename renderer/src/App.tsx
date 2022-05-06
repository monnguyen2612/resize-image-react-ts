import React, { useState, useEffect } from "react";
import { IpcRenderer, IpcMessageEvent } from "electron";
const electron = window.require("electron"); // require electron like this in all the files. Don't Use import from 'electron' syntax for importing IpcRender from electron.

let ipcRenderer: IpcRenderer = electron.ipcRenderer;

ipcRenderer.on("response", (event: IpcMessageEvent, args: any) => {
  console.log(args);
});

const App: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);

  const resizeImage = () => {
        // var reader = new FileReader();
        // reader.onload = function(e) {
        //     var canvas = document.createElement("canvas");
        //     var ctx = canvas.getContext("2d");
        //     ctx?.drawImage(img, 0, 0);

        //     var MAX_WIDTH = 400;
        //     var MAX_HEIGHT = 400;
        //     var width = img.width;
        //     var height = img.height;

        //     if (width > height) {
        //         if (width > MAX_WIDTH) {
        //             height *= MAX_WIDTH / width;
        //             width = MAX_WIDTH;
        //         }
        //     } else {
        //         if (height > MAX_HEIGHT) {
        //             width *= MAX_HEIGHT / height;
        //             height = MAX_HEIGHT;
        //         }
        //     }
        //     canvas.width = width;
        //     canvas.height = height;
        //     var ctx = canvas.getContext("2d");
        //     ctx?.drawImage(img, 0, 0, width, height);

        //     let dataurl = canvas.toDataURL(file.type);
        // }
        // reader.readAsDataURL(file);
        Array.from(files || []).forEach((img) => {
          var reader = new FileReader();
          reader.onload = function (e) {
              let img: HTMLImageElement = document.createElement("img");
              img.onload = async function (event) {
                  // Dynamically create a canvas element
                  let canvas = document.createElement("canvas");

                  // var canvas = document.getElementById("canvas");
                  canvas.width = 1280;
                  canvas.height = img.height * (1280/img.width);
                  let ctx = canvas.getContext("2d");


                  // Actual resizing
                  ctx!.drawImage(img, 0, 0,  1280, img.height * (1280/img.width));
                  
                  // Show resized image in preview element
                  var dataurl = await canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

                  downloadURI(dataurl, 'resized-file');
                  console.log(dataurl)
              }
              img.src = reader.result as string;
            }
          reader.readAsDataURL(img);
        })
  };

  const downloadURI = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const showFileOnConsole = () => {
    console.log(files);
  };

  return (
    <div className="App">
      <div>
        <form action="/action_page.php">
          <label htmlFor="img">Select image: </label>
          <input
            onChange={(e) => setFiles(e.target.files as FileList)}
            multiple
            type="file"
            id="img"
            name="img"
            accept="image/*"
          />
          <div>
          <label htmlFor="res">Choose a res: </label>
          <select name="resolution" id="res">
            <option value="1280">lg</option>
            <option value="640">md</option>
            <option value="320">sm</option>
          </select>
          </div>
        </form>
      </div>
      <div>
        {Array.from(files || []).map((image, index) => (
          <a href=""><img
            style={{ width: "200px", height: "200px" }}
            key={index}
            src={URL.createObjectURL(image)}
          /></a>
        ))}
      </div>
      <div>
        <label htmlFor="location">Choose a location to save: </label>
        <input type="text" name="location" placeholder="D:/" />
      </div>
      <div>
        <button onClick={() => resizeImage()}>Save as webp</button>
        <button
          onClick={(e) =>
            ipcRenderer.send("channel", {
              title: "hi",
              content: "hello this is my message",
            })
          }
        >
          Save as jpg
        </button>

        <button
          onClick={(e) =>
            ipcRenderer.send("channel", {
              title: "hi",
              content: "hello this is my message",
            })
          }
        >
          Save as avif
        </button>
      </div>
    </div>
  );
};

export default App;
