class FileManager {

    //----------------------------------------------------------
    // Guardar GRAFCET
    //----------------------------------------------------------

    static async save(diagram, renderer, filename = "grafcet.json", fileHandle = null) {

        const data = Serializer.serialize(

            diagram,
            renderer

        );

        const json = JSON.stringify(

            data,
            null,
            4

        );

        //------------------------------------------------------
        // Sobrescribir un archivo ya abierto
        //------------------------------------------------------

        if (fileHandle) {

            const writable = await fileHandle.createWritable();

            await writable.write(json);
            await writable.close();

            return fileHandle;

        }

        //------------------------------------------------------
        // Selector de archivos: permite elegir el archivo a
        // sobrescribir y devuelve un handle para futuros guardados
        //------------------------------------------------------

        if (window.showSaveFilePicker) {

            try {

                const handle = await window.showSaveFilePicker({

                    suggestedName: filename,

                    types: [{

                        description: "GRAFCET JSON",
                        accept: { "application/json": [".json"] }

                    }]

                });

                const writable = await handle.createWritable();

                await writable.write(json);
                await writable.close();

                return handle;

            }
            catch (error) {

                // El usuario canceló el selector
                if (error.name !== "AbortError") {

                    throw error;

                }

                return null;

            }

        }

        //------------------------------------------------------
        // Navegador sin File System Access API: descarga clásica
        //------------------------------------------------------

        const blob = new Blob(

            [json],

            {

                type: "application/json"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        return null;

    }

    //----------------------------------------------------------
    // Cargar GRAFCET
    //----------------------------------------------------------

    static async load(callback) {

        //------------------------------------------------------
        // Selector de archivos (File System Access API): devuelve
        // un handle que permite sobrescribir el archivo después
        //------------------------------------------------------

        if (window.showOpenFilePicker) {

            try {

                const [handle] = await window.showOpenFilePicker({

                    types: [{

                        description: "GRAFCET JSON",
                        accept: { "application/json": [".json"] }

                    }]

                });

                const file = await handle.getFile();

                const text = await file.text();

                try {

                    const json = JSON.parse(text);

                    const result = Serializer.deserialize(json);

                    callback(result, file.name, handle);

                }
                catch (error) {

                    alert(

                        "El fichero no es un GRAFCET válido."

                    );

                    console.error(error);

                }

            }
            catch (error) {

                // El usuario canceló el selector
                if (error.name !== "AbortError") {

                    console.error(error);

                }

            }

            return;

        }

        //------------------------------------------------------
        // Navegador sin File System Access API: <input type="file">
        // (sin handle, no se puede sobrescribir)
        //------------------------------------------------------

        const input = document.createElement("input");

        input.type = "file";
        input.accept = ".json";

        input.onchange = event => {

            const file = event.target.files[0];

            if (!file) {

                return;

            }

            const reader = new FileReader();

            reader.onload = e => {

                try {

                    const json = JSON.parse(

                        e.target.result

                    );

                    const result =

                        Serializer.deserialize(json);

                    callback(result, file.name, null);

                }

                catch (error) {

                    alert(

                        "El fichero no es un GRAFCET válido."

                    );

                    console.error(error);

                }

            };

            reader.readAsText(file);

        };

        input.click();

    }

}