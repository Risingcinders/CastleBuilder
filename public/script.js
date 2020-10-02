var score = 0;
var woodcost = 0;
var stonecost = 0;
var foodcost = 0;
var selected_building = "wall";

var resources = { wood: 5000, food: 2000, stone: 100 };

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
        "Wood: -" + woodcost + " Stone: -" + stonecost + " Food: -" + foodcost
    );
    $("#notification").fadeToggle(500);
    $("#notification").fadeToggle(5000);
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
            z: 180,
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
            "px;'></div>";
    }
    document.getElementById("buildings").innerHTML = output;
    // console.log(output);
}

function updateResources() {
    document.getElementById("resources").innerHTML =
        "Wood: " +
        resources.wood +
        " Food: " +
        resources.food +
        " Stone: " +
        resources.stone;
}

function getPos(e) {
    x = e.clientX;
    y = e.clientY;
    x = Math.floor(x / 50) * 50;
    y = Math.floor(y / 50) * 50;
}

function stopTracking() {}

document.onkeydown = function (e) {
    if (e.keyCode == 39 && hero.ratex < 3) {
        hero.ratex += 1;
    }
    if (e.keyCode == 38 && hero.ratey > -3) {
        hero.ratey -= 1;
    }
    if (e.keyCode == 37 && hero.ratex > -3) {
        hero.ratex -= 1;
    }
    if (e.keyCode == 40 && hero.ratey < 3) {
        hero.ratey += 1;
    }
    if (e.keyCode == 32) {
    }
};

$("#buildmenu").toggle();

function gamepaused() {
    console.log("pancake");
    clearInterval(gameLoop);
}

$("#menu").hover(function () {
    gamepaused();
});

build_toggle = 0;
bcounter = 0;
$("#build").click(function () {
    $("#buildmenu").toggle();
    // $("#buildmenu").html("<div id='tower'>Tower</div><div>Wall</div>");
    // $("#buildmenu").html("<div id='tower'>Tower</div><div>Wall</div>");
    bcounter++;
    build_toggle = bcounter % 2;
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
    console.log("REEEEEE");
    $(this).addClass("selected");
    $(".building").not(this).removeClass("selected");
    selected_id = $(".selected").attr("unitid");
    $("#selected_unit").html(
        "<img src='" +
        buildings[selected_id].type
        +".png'></img><h3>HP: " +
            buildings[selected_id].hp +
            "</h3><h3>Type: " +
            buildings[selected_id].type +
            "</h3>"
    );
    console.log(selected_id);
});

$("#buildtower").on("click", function (e) {
    e.stopPropagation();
    console.log("reeeees");
    selected_building = "tower";
});

$("#buildwall").on("click", function (e) {
    e.stopPropagation();
    selected_building = "wall";
});

$("#woodstock").on("click", function (e) {
    e.stopPropagation();
    resources.wood += 1000;
});

$("#quarry").on("click", function (e) {
    e.stopPropagation();
    resources.stone += 1000;
});

function gameLoop() {
    // moveEnemies();
    updateResources();
}
setInterval(gameLoop, 10);

displayBuildings();
