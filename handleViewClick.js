function handleDetailClick() {
	d3.select("#mapView").attr("class", "container-fluid d-none")
	d3.select("#mapActive").attr("class", "nav-item")
	
	d3.select("#detailView").attr("class", "container-fluid")
	d3.select("#detailActive").attr("class", "nav-item active")



	d3.select("#map-guide").attr("class", "list-group-item list-group-item-action bg-light d-none")
	d3.select("#detail-guide").attr("class", "list-group-item list-group-item-action bg-light")
}

function handleMapClick() {
	d3.select("#mapView").attr("class", "container-fluid")
	d3.select("#mapActive").attr("class", "nav-item active")

	d3.select("#detailView").attr("class", "container-fluid d-none")
	d3.select("#detailActive").attr("class", "nav-item")


	d3.select("#detail-guide").attr("class", "list-group-item list-group-item-action bg-light d-none")
	d3.select("#map-guide").attr("class", "list-group-item list-group-item-action bg-light")
}
