import 'leaflet/dist/leaflet.css';
import '../css/map.css';
import { serialize } from './lib/serialize';
import { simplifyFactor } from './lib/simplifyFactor';
import '../css/vendor/L.Control.Zoominfo.css';
import './vendor/L.Control.Zoominfo';
import { Map, TileLayer, geoJSON, LayerGroup } from 'leaflet';

const API_BASE_PATH = "http://localhost:8080";

export const initMap = async () => {

    const respose = await fetch(`${API_BASE_PATH}/camadas`);

    const camadas = await respose.json();

    const map = Map('map', {
        zoominfoControl: true,
        zoomControl: false,
        center: [-15.897942, -47.966308],
        zoom: 6,
    });

    // Adicione um provedor de mapa de fundo OpenStreetMap
    TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    const PoligonosCustom = LayerGroup();
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

        PoligonosCustom.addLayer(geoJSON(data, {
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

}