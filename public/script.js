var build_toggle = 0;
var bcounter = 0;
var score = 0;
var woodcost = 0;
var stonecost = 0;
var foodcost = 0;
var selected_building = "wall";
var placementz = 0;

// var resources = { wood: 5000, food: 2000, stone: 100 };
var resources = { wood: 5000000, food: 200000, stone: 100000 };

var building_types = [
    { btype: "wall", cost: { wood: 500, food: 0, stone: 0 }, hp: 3 },
    { btype: "tower", cost: { wood: 1000, stone: 10, food: 0 }, hp: 5 },
];

var buildings = [];

function getcost(item) {
    woodcost = item.cost.wood;
    stonecost = item.cost.stone;
    foodcost = item.cost.food;
}

function checkcost() {
    return (
        woodcost <= resources.wood &&
        stonecost <= resources.stone &&
        foodcost <= resources.food
    );
}

function spendresources() {
    resources.wood -= woodcost;
    resources.food -= foodcost;
    resources.stone -= stonecost;
    $("#notification").text(
        "Wood: -" +
            woodcost +
            " \nStone: -" +
            stonecost +
            " \nFood: -" +
            foodcost
    );
    $("#notification").css("top", y);
    $("#notification").css("left", x + 55);
    $("#notification").show(500).delay(500);
    $("#notification").fadeToggle(500);
}

function build(xpos, ypos, building_type) {
    for (var i = 0; i < building_types.length; i++) {
        if (building_types[i].btype == building_type) {
            getcost(building_types[i]);
            building_hp = building_types[i].hp;
            break;
        }
    }

    if (checkcost()) {
        buildings.push({
            x: xpos,
            y: ypos,
            z: placementz,
            hp: building_hp,
            type: building_type,
        });
        spendresources();
    }
}

function displayBuildings() {
    var output = "";
    for (i = 0; i < buildings.length; i++) {
        output +=
            "<div class='building " +
            buildings[i].type +
            "' unitid='" +
            i +
            "' style='top: " +
            buildings[i].y +
            "px; left: " +
            buildings[i].x +
            "px; transform: rotate(" +
            buildings[i].z +
            "deg);'></div>";
    }
    document.getElementById("buildings").innerHTML = output;
    // console.log(output);
}

function ghost_building() {
    if (build_toggle == 1) {
        $("#prebuild").css("display", "block");
        $("#prebuild").css("background", "url(" + selected_building + ".png)");
        $("#prebuild").css("opacity", ".5");
        $("#prebuild").css("top", y);
        $("#prebuild").css("left", x);
        $("#prebuild").css("transform", "rotate(" + placementz + "deg)");
    } else {
        $("#prebuild").css("display", "none");
    }
}

function updateResources() {
    document.getElementById("resources").innerHTML =
        "<h3>Wood: " +
        resources.wood +
        "</h3><h3> Food: " +
        resources.food +
        " </h3><h3>Stone: " +
        resources.stone +
        "</h3>";
}

function getPos(e) {
    x = e.clientX;
    y = e.clientY;
    x = Math.floor(x / 50) * 50;
    y = Math.floor(y / 50) * 50;
}

function stopTracking() {}

document.onkeydown = function (e) {
    if (e.keyCode == 82) {
        placementz += 90;
        if (placementz == 360) {
            placementz = 0;
        }
    }
    console.log(placementz);
    // console.log(e.keyCode)
};

$("#buildmenu").toggle();

function gamepaused() {
    console.log("pancake");
    clearInterval(gameLoop);
}

$("#menu").hover(function () {
    gamepaused();
});


$("#build").click(function () {
    $("#buildmenu").toggle();
    bcounter++;
    build_toggle = bcounter % 2;
    if (build_toggle != 1) { 
        $("#build").css("filter", 'grayscale(50%)');
    } else {
        $("#build").css("filter", 'none');
    }
    console.log(build_toggle);
});

$("#container").on("click", function () {
    if (build_toggle == 1) {
        build(x, y, selected_building);
    }
    displayBuildings();
});

var selected_id = 1;
$("#buildings").on("click", ".building", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $(this).addClass("selected");
    $("div").not(this).removeClass("selected");
    selected_id = $(".selected").attr("unitid");
    $("#selected_unit").html(
        "<img src='" +
            buildings[selected_id].type +
            ".png'></img><h3>HP: " +
            buildings[selected_id].hp +
            "</h3><h3>Type: " +
            buildings[selected_id].type +
            "</h3>"
    );
    console.log(selected_id);
});

$("#buildmenu div").on("click", function (event) {
    selected_building = $(this).attr('bldgtype');
    $(this).addClass("selected");
    $("div").not(this).removeClass("selected");
    $("#selected_unit").html(
        "<img src='" +
            selected_building +
            ".png'></img><h3>HP: " +
            "</h3><h3>Type: " +
            selected_building +
            "</h3>"
    );
});

$("#pizza").on("click", function (e) {
    resources.food += 1000;
});

$("#woodstock").on("click", function (e) {
    resources.wood += 1000;
});

$("#quarry").on("click", function (e) {
    resources.stone += 1000;
});

function gameLoop() {
    // moveEnemies();
    updateResources();
    ghost_building();
}

setInterval(gameLoop, 10);

displayBuildings();
