require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query, checkSchema, validationResult } = require('express-validator');
const app = express();
const db = require('./models');

const PORT = process.env.PORT || 8080;

// TODO implementar
const corsOptions = {
    // origin: 'http://example.com',
    origin: function (origin, callback) {
        // db.loadOrigins is an example call to load
        // a list of origins from a backing database
        db.loadOrigins(function (error, origins) {
            callback(error, origins)
        })
    }
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello')
});

app.get('/camadas', async (req, res) => {
    const camadas = await db.Camadas.findAll({
        attributes: [
            'nome',
            'identificador',
            'cor_borda',
            'cor_preenchimento',
            'limite',
        ],
        where: {
            ativo: true,
        }
    });

    res.send(camadas);
});

const queryValidationChain = () => {
    const schema = {
        'geometry.xmin': {
            notEmpty: true,
        },
        'geometry.ymin': {
            notEmpty: true,
        },
        'geometry.xmax': {
            notEmpty: true,
        },
        'geometry.ymax': {
            notEmpty: true,
        },
        limit: {
            isInt: {
                options: {
                    min: 1,
                    max: 2000,
                },
            },
        },
        simplify: {
            isFloat: true,
            // notEmpty: true
        },
    };

    return checkSchema(schema, ['query']);
}

app.get('/:identificadorCamada/query', queryValidationChain(), async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).send({
            errors: result.errors,
        });
    }

    const identificadorCamada = req.params.identificadorCamada;

    const camada = await db.Camadas.findOne({
        where: {
            identificador: identificadorCamada
        }
    });

    if (!camada) {
        return res.status(400).send({
            error: 'Camada não inválida'
        });
    }

    const { tabela } = camada;

    const { geometry, simplify, limit } = req.query

    // const simplify = req.query?.simplify || 0

    // TODO implementar where fields
    // TODO verificar sobre sql injection

    const {
        xmin = 0,
        ymin = 0,
        xmax = 0,
        ymax = 0 } = JSON.parse(geometry);

    /**
     * TODO verificar cast de multipolygon para polygon ou ao contrario
     * Para evitar ter que tratar os dados na tabela entre cada camada
     */
    const query = `
        SELECT
            id,
            ST_GeometryType(geom) type,
            JSON_EXTRACT(ST_ASGEOJSON(ST_SIMPLIFY(geom, ${simplify})), '$.coordinates') AS coordinates

            FROM ${tabela}

            WHERE ST_Intersects(
                geom,
                ST_ENVELOPE(ST_GEOMFROMTEXT('LineString(${xmin} ${ymin}, ${xmax} ${ymax})', 4326))
            )

            LIMIT ${limit}
    `;

    const types = {
        "POINT": "Point",
        "MULTIPOINT": "MultiPoint",
        "LINESTRING": "LineString",
        "MULTILINESTRING": "MultiLineString",
        "POLYGON" : "Polygon",
        "MULTIPOLYGON" : "MultiPolygon",
    };

    const [results, metadata] = await db.sequelize.query(query);

    const data = {
        type: "FeatureCollection",
        crs: {
            type: "name",
            properties: {
                name: "EPSG:4326"
            }
        },
        features: results.map(result => ({
            type: "Feature",
            id: result.id,
            geometry: {
                type: types[result.type] ?? '',
                coordinates: result.coordinates,
            },
            properties: {
                ObjectId: result.id,
                nome: "TODO",
            },
        }))
    };

    res.send(data);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});