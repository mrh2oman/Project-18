
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append('<div class="panel panel-default">' +
            '<div class="panel-heading" ><h3 class="panel-title" data-target="#myModal"' +
            'data-toggle="modal" id="artTitle" data-id="' + data[i]._id + '">' + data[i].title + '</h3>' +
            '</div><hr><div class="panel-body"><p id="artSummary">' + data[i].summary + '</p><a href="' +
            data[i].link + '" id="artLink" target="blank">' + data[i].link + '</a></div><br><button class="btn btn-success"' +
            ' data-id="' + data[i]._id + '"id="saveArt">Save Article</button></div>');
    }
});

$(document).on("click", "#saveArt", function() {
    $("#modalBodyA").empty();
    var articleIdToSave = $(this).attr("data-id");
    $("#myModal").modal('show');
    $("#modalBodyA").append("<h4> Article Saved </h4>");
    $.ajax({
        method: "POST",
        url: "/saved/" + articleIdToSave,
    }).done(function(saved) {
    });
});

$.getJSON("/saved", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#savedArticles").append('<div class="panel panel-default">' +
            '<div class="panel-heading" ><h3 class="panel-title" data-target="#myModal"' +
            'data-toggle="modal" id="artTitle" data-id="' + data[i]._id + '">' + data[i].title + '</h3>' +
            '</div><hr><div class="panel-body"><p id="artSummary">' + data[i].summary + '</p><a href="' +
            data[i].link + '" id="artLink" target="blank">' + data[i].link + '</a></div><br><button class="btn btn-danger"' +
            ' data-id="' + data[i]._id + '"id="deleteArt">Unsave Article</button><button class="btn btn-primary"' +
            ' id="noteBtn" data-id="' + data[i]._id + '">Article Notes</button></div>');
    }
});

$(document).on("click", "#noteBtn", function() {
    $("#modalBody").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .done(function(data) {
            $("#myModal").modal('show');
            $("#modalTitle").html('<h4 id="modalTitle">' + data.title + "</h4>");
            $("#modalBody").append("<input id='titleinput' name='title' >");
            $("#modalBody").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#savenote").attr("data-id", data._id);
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .done(function(data) {
            $("#myModal").modal('hide');
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#deleteArt", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/delete/" + thisId,
            saved: {
                saved: false
            },
        })
        .then(function(deleted) {
            window.location.reload();
        });
});