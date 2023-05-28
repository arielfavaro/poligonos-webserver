(async function () {
    function serialize(params) {
        let data = '';

        for (let key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                let param = params[key];
                let type = Object.prototype.toString.call(param);
                let value;

                if (data.length) {
                    data += '&';
                }

                if (type === '[object Array]') {
                    value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
                } else if (type === '[object Object]') {
                    value = JSON.stringify(param);
                } else if (type === '[object Date]') {
                    value = param.valueOf();
                } else {
                    value = param;
                }

                data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }

        return data;
    }

    function simplifyFactor(map, factor) {
        var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
        return (mapWidth / map.getSize().y) * factor;
    }

    const API_BASE_PATH = "http://localhost:8080";

    const respose = await fetch(`${API_BASE_PATH}/camadas`);

    const camadas = await respose.json();

    const map = L.map('map', {
        zoominfoControl: true,
        zoomControl: false,
        center: [-15.897942, -47.966308],
        zoom: 6,
    });

    // Adicione um provedor de mapa de fundo OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    const PoligonosCustom = L.layerGroup();
    PoligonosCustom.addTo(map);

    const getData = async (camada, cor) => {

        const bounds = map.getBounds()

        const searchParams = serialize({
            geometry: {
                xmin: bounds._southWest.lng,
                ymin: bounds._southWest.lat,
                xmax: bounds._northEast.lng,
                ymax: bounds._northEast.lat,
            },
            simplify: simplifyFactor(map, 0.5),
            limit: 2000,
        });

        const respose = await fetch(`${API_BASE_PATH}/${camada}/query?${searchParams}`);

        const data = await respose.json();

        PoligonosCustom.addLayer(L.geoJSON(data, {
            style: {
                color: cor,
                fillColor: cor,
            }
        }));
    }

    const updateData = () => {
        // if(map.getZoom() > 13) return

        PoligonosCustom.clearLayers();

        for (const camada of camadas) {
            getData(camada.identificador, camada.cor_preenchimento);
        }
    }

    map.on('dragend', async function (e) {
        updateData()
    });

    map.on('zoomend', async function (e) {
        updateData()
    });

    map.on('click', (e) => {
        console.log('map click', e.latlng);
    });

})();