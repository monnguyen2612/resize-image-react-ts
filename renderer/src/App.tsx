import React, { useState, useEffect } from "react";
import { IpcRenderer, IpcMessageEvent } from "electron";
const electron = window.require("electron"); // require electron like this in all the files. Don't Use import from 'electron' syntax for importing IpcRender from electron.
const fs = window.require("fs");

let ipcRenderer: IpcRenderer = electron.ipcRenderer;

ipcRenderer.on("response", (event: IpcMessageEvent, args: any) => {
  console.log(args);
});

const resolution = {
  lg: 1280,
  md: 640,
  sm: 320,
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [folderToSaved, setFolderToSaved] = useState<string>("");
  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
      ref.current.setAttribute("mozdirectory", "");
      ref.current.setAttribute("msdirectory", "");
      ref.current.setAttribute("odirectory", "");
    }
  }, [ref]);

  const resizeImage = () => {
    let fileName = 0;
    Array.from(files || []).forEach((img) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        let img: HTMLImageElement = document.createElement("img");
        img.onload = async function (event) {
          fileName++;
          // Dynamically create a canvas element
          Object.entries(resolution).forEach(([key, value]) => {
            let canvas = document.createElement("canvas");

            canvas.width = value;
            canvas.height = img.height * (value / img.width);
            let ctx = canvas.getContext("2d");

            // Actual resizing
            ctx!.drawImage(img, 0, 0, value, img.height * (value / img.width));

            const base64Data = canvas
              .toDataURL("image/jpg", 0.8)
              .replace(/^data:image\/png;base64,/, "");
            fs.writeFile(
              folderToSaved + `/${fileName}-${key}.webp`,
              base64Data,
              "base64",
              function (err: any) {
                console.log(err);
              }
            );
            fs.writeFile(
              folderToSaved + `/${fileName}-${key}.avif`,
              base64Data,
              "base64",
              function (err: any) {
                console.log(err);
              }
            );
            fs.writeFile(
              folderToSaved + `/${fileName}-${key}.jpg`,
              base64Data,
              "base64",
              function (err: any) {
                console.log(err);
              }
            );
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(img);
    });
  };

  const getfolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    var files = e.target.files;
    var path = files[0].path;
    return path ? setFolderToSaved(path) : null;
  };

  return (
    <div className="App p-8">
      <div>
        <form>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="img"
            >
              Select image:
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="img"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      className="sr-only"
                      onChange={(e) => setFiles(e.target.files as FileList)}
                      multiple
                      type="file"
                      id="img"
                      name="img"
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          {/* <div className="col-span-6 sm:col-span-3">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="res"
            >
              Choose a res:{" "}
            </label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="resolution"
              id="res"
            >
              <option value="1280">lg</option>
              <option value="640">md</option>
              <option value="320">sm</option>
            </select>
          </div> */}
        </form>
      </div>
      <div>
        <section className="overflow-hidden text-gray-700 ">
          <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
            <div className="flex flex-wrap -m-1 md:-m-2">
              {Array.from(files || []).map((image, i) => (
                <div className="flex flex-wrap w-1/3">
                  <div className="w-full p-1 md:p-2">
                    <img
                      src={URL.createObjectURL(image)}
                      className="block object-cover object-center w-full h-56 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div>
        <label
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          htmlFor="location"
        >
          <div>
            {folderToSaved != "" ? (
              <span aria-hidden="true">{folderToSaved}</span>
            ) : (
              <p className="w-48 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Choose a location to save
              </p>
            )}
          </div>
          <input
            style={{ display: "none" }}
            type="file"
            id="location"
            onChange={(e) => getfolder(e)}
            ref={ref}
            multiple
          />
        </label>
      </div>
      <div className="mt-3">
        <button
          className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => resizeImage()}
        >
          Convert Images
        </button>
      </div>
    </div>
  );
};

export default App;
