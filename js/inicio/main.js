$(function(){
    var capaBase = "https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24";
    var paramBase = {
        minZoom: 0,
        maxZoom: 20,
        subdomains: "1234",
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    };
    var paramMapBase = {
        center: new L.LatLng(19.46496362329332, -99.18272495269775),
        zoom: 16,
        minZoom: 0,
        maxZoom: 20
    };
    var map = 'divMapMain';
    var user ={
        user: 'sacmex'
    };
    var viz = {
        user_name: 'sacmex',
        api_key: '56635b51b5ff72d28460bff1b04dca3a6cfcc84f',
        maps_api_template:"http://67.205.167.66:90/user/{user}",
        sql_api_template:"http://67.205.167.66:90/user/{user}",
        tiler_protocol:"http",
        tiler_domain:"67.205.167.66",
        tiler_port:"90",
        filter:"mapnik",
        type:"cartodb",
        sublayers: [{
            sql: "select * from sacmex_manzanas",
            cartocss: `
                #sacmex_manzanas{
                    polygon-fill: #2167AB;
                    polygon-opacity: 0.05;
                    line-color: #000000;
                    line-width: 1;
                    line-opacity: 1;
                }
            `,
            interactivity: "cartodb_id"
        },{
            sql: "select * from reporte_fugas",
            cartocss: `
                #layer {
                    marker-width: 7;
                    marker-fill: ramp([status], (#7F3C8D, #11A579, #A5AA99), ("1", "2"), "=");
                    marker-fill-opacity: 1;
                    marker-allow-overlap: true;
                    marker-line-width: 1;
                    marker-line-color: #FFFFFF;
                    marker-line-opacity: 1;
                }
            `,
            interactivity: "cartodb_id,ticket,descripcion,status,orden_fugas_id"
        }]
    };
    var objMap = new cdmxCarto(capaBase,viz,map,user,paramBase,paramMapBase);
    var callBack = function(layer){
        lyrMain = layer;
        mainMap = objMap._map;
        mainMap.on("click",onClickMap);
    };
    objMap.renderMap(callBack);
});
