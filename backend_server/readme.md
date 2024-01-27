## Ler
- https://www.pgadmin.org/docs/pgadmin4/latest/container_deployment.html

- https://postgis.net/documentation/tips/lon-lat-or-lat-lon/

```json
{
    "xmin": -48.64952087402344,
    "ymin": -15.912470282559344,
    "xmax": -47.331161499023445,
    "ymax": -15.57938790814887,
    "spatialReference": {
        "wkid": 4326
    }
}
```

https://gis.stackexchange.com/questions/83387/performing-bounding-box-query-in-postgis
long / lat
```sql
select * from geometrias
where geometria && st_makeEnvelope(-15.912470282559344, -48.64952087402344, -15.57938790814887, -47.331161499023445);


SELECT
    ST_ASGEOJSON(poligono)::json->'coordinates' as coordinates
    FROM poligonos_urbanos
    WHERE poligono && ST_MAKEENVELOPE(-15.912470282559344, -48.64952087402344, -15.57938790814887, -47.331161499023445)
```

verificar otimização
```sql
ST_AsGeoJSON(ST_Simplify(ST_Force2D("geom"), ${simplify}, true)::geometry(MultiPolygon, 4326))::json->'coordinates' AS coordinates
```

## Requests
http://localhost:3000/teste/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&token=tQahVpQgiZj03KWkltzOCGHRMEq3aKtrfAspvpbZnAIYwiKwrT7Wc0GtDyCG7EbQe2ClD5XX96Qs6eq9c7ou3V4Qg4wfMiJ75S2k9h4pMmXozM9YtZcowhccNW2sQcWkf02JUM391IBc4a3teIKC5w..&inSR=4326&geometry=%7B%22xmin%22%3A-48.64952087402344%2C%22ymin%22%3A-15.912470282559344%2C%22xmax%22%3A-47.331161499023445%2C%22ymax%22%3A-15.57938790814887%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultRecordCount=200&f=geojson