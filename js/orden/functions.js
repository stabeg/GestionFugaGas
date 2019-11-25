var mainMap;
var layerBase;
var markerFuga = null;
var popup = null;


var fn_newgeomJson = function (GeoJson) {
	var SqlJson = {
		'type' : '',
		'coordinates' : []
	};
	SqlJson.type = GeoJson.geometry.type;
	SqlJson.coordinates = GeoJson.geometry.coordinates;
	var geom = "ST_SetSRID(ST_GeomFromGeoJSON('" + JSON.stringify(SqlJson) + "'),4326)";
	return geom;
}

var fn_datainfo = function(geom, radius) {
	var sqlSelFilter = '';

	var sql = new cartodb.SQL({
		user : 'sacmex',
        sql_api_template:"http://67.205.167.66:90/user/{user}"
	});
	if (radius != 0){
		geom = "ST_Buffer(" + geom + "::geography," + radius + ")::geometry"
	}

	//var strsql = "select string_agg(idintervencion::text, ',') as idintervencion from (SELECT idintervencion FROM agu_digitarpunto dl where (ST_contains(" + geom + ",dl.the_geom) or ST_Intersects(" + geom + ",the_geom)) and dl.idintervencion in ("+sqlSelFilter+")" ;
	//strsql += " union SELECT idintervencion  FROM agu_digitarlinea dl where (ST_contains(" + geom + ",the_geom) or ST_Intersects(" + geom + ",dl.the_geom)) and  dl.idintervencion in ("+sqlSelFilter+")) info ";

    var strsql = "select * from reporte_fugas fugas where ST_Contains("+geom+",fugas.the_geom) and fugas.status = 1";
    sql.execute(strsql).done(function(data) {
        var $ul = $("<ul />",{"class":"list-group"});
        for (var idx in data.rows){
            $("<li />",{"class":"list-group-item", "text":data.rows[idx].ticket})
            .appendTo($ul);
        }
        $(".card-body").html($ul);
	}).error(function(errors) {
		$("#loadingMap").hide();
		console.log("errors:" + errors);
	});
}

var onReporte = function(evt){





    var NorthEast = mainMap.getBounds().getNorthEast();
    var NorthWest = mainMap.getBounds().getNorthWest();
    var SouthWest = mainMap.getBounds().getSouthWest();
    var SouthEast = mainMap.getBounds().getSouthEast();

    var SqlJson = {
        geometry:{
		    'type' : 'Polygon',
		    'coordinates' : [[
                [NorthEast.lng,NorthEast.lat],
                [NorthWest.lng,NorthWest.lat],
                [SouthWest.lng,SouthWest.lat],
                [SouthEast.lng,SouthEast.lat],
                [NorthEast.lng,NorthEast.lat]
            ]]
	    }
    };

    var geom =  fn_newgeomJson(SqlJson);

    var sql = new cartodb.SQL({
		user : 'sacmex',
        sql_api_template:"http://67.205.167.66:90/user/{user}"
	});

    var strsql = "select * from reporte_fugas fugas where ST_Contains("+geom+",fugas.the_geom) and fugas.status = 1";
    sql.execute(strsql).done(function(data) {
        var $ul = $("<ul />",{"class":"list-group"});
        for (var idx in data.rows){
            $li = $("<li />",{"class":"list-group-item", "text":data.rows[idx].ticket});
            $("<input />",{"type":"checkbox","class":"justify-content-end","value":data.rows[idx].ticket}).appendTo($li);
            $li.appendTo($ul);
        }
        $(".card-body #lstReporte").html($ul);
	}).error(function(errors) {
		$("#loadingMap").hide();
		console.log("errors:" + errors);
	});
}
