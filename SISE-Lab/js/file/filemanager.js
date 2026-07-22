class FileManager {

    //----------------------------------------------------------
    // Guardar GRAFCET
    //----------------------------------------------------------

    static save(diagram, renderer, filename = "grafcet.json") {

        const data = Serializer.serialize(

            diagram,
            renderer

        );

        const json = JSON.stringify(

            data,
            null,
            4

        );

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

    }

    //----------------------------------------------------------
    // Cargar GRAFCET
    //----------------------------------------------------------

    static load(callback) {

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

                    callback(result);

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