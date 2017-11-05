
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append('<div class="panel panel-default">' +
            '<div class="panel-heading" ><h3 class="panel-title" data-target="#popUp"' +
            'data-toggle="modal"  data-id="' + data[i]._id + '">' + data[i].title + '</h3>' +
            '</div><hr><div class="panel-body"><p>' + data[i].summary + '</p><a href="' +
            data[i].link + ' target="blank">' + data[i].link + '</a></div><br><button class="btn btn-success"' +
            ' data-id="' + data[i]._id + '"id="save">Save Article</button></div>');
    }
});

$(document).on("click", "#save", function() {
    $("#modalNotesA").empty();
    var articleIdToSave = $(this).attr("data-id");
    $("#popUp").modal('show');
    $("#modalConfirm").append("<h4> Your Article has been saved. Please click the save link to view. </h4>");
    $("#modalConfirm").append("<a href='saved.html'> View Saved Articles </a>");
    $.ajax({
        method: "POST",
        url: "/saved/" + articleIdToSave,
    }).done(function(saved) {
    });
});

$.getJSON("/saved", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#savedArticles").append('<div class="panel panel-default">' +
            '<div class="panel-heading" ><h3 class="panel-title" data-target="#popUp"' +
            'data-toggle="modal" data-id="' + data[i]._id + '">' + data[i].title + '</h3>' +
            '</div><hr><div class="panel-body"><p>' + data[i].summary + '</p><a href="' +
            data[i].link + ' target="blank">' + data[i].link + '</a></div><br><button class="btn btn-danger"' +
            ' data-id="' + data[i]._id + '"id="articleDelete">Unsave Article</button><button class="btn btn-primary"' +
            ' id="noteBtn" data-id="' + data[i]._id + '">Article Notes</button></div>');
    }
});

$(document).on("click", "#noteBtn", function() {
    $("#modalNotes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .done(function(data) {
            $("#popUp").modal('show');
            $("#modalTitle").html('<h4 id="modalTitle">' + data.title + "</h4>");
            $("#modalNotes").append("<input class='form-control' placeholder='Note Title' >");
            $("#modalNotes").append("<textarea class='form-control' placeholder='Insert Note'></textarea>");
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
            $("#popUp").modal('hide');
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#articleDelete", function() {
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