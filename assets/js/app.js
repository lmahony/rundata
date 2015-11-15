$(document).ready(function() {

    function init() {
        if ($("#activities-table")) {
            //$("#activities-table").tablesorter();
            $("#activities-table").DataTable();
        }
    }
    init();

});