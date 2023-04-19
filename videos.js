//basic block that we are building
class House { //constructor is name of house and each has rooms 
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }
    //Method to add a room
    addRoom(name, area) {
        this.rooms.push(new Room(name,area));
    }
}
//console.log(House); tester
// room class will have name and the area of the room so the constructor will have in ()
class Room {
constructor(name, area) { //forgot curly brace and caused name to be lined out below
this.name = name; //name the user enters on the form for the second div
this.area = area;
}
}
//console.log(Room); tester
// next class is how we will send the http request, static is used to commuicate with api
//A static method in JavaScript is a method that has a static keyword prepended to itself
class HouseService {
    static url= 'https://ancient-taiga-31359.herokuapp.com/api/houses';//this the root url for end points we will call api

    static getAllHouses() {
        //Jquery to return  the url above to return all the houses
        return $.get(this.url);
    }
    //return a specific house
    static getHouse(id) {
        return $.get(this.url + `/${id}`)
    }
    // This is going to take a house from house class (name,rooms array) and post it to the url
    static createHouse(house) {
        return $.post(this.url, house);
    }
    //Let's us update the house this way you have to use ajax
    static updateHouse(house) {
      return $.ajax({
        url: this.url + `/${house._id}`, //_id is because that is value the database will automatically create for our house
        dataType: 'json', //
        data: JSON.stringify(house), // stringify takes an onject convert it to a JSON string before sending to a http request 
        //in this case its the house
        contentType: 'application/json', //
        type:'PUT' //type of request 
    });  
    }

    //delete the house we need is the id 
    static deleteHouse(id) {
    return $.ajax({
        url:this.url + `/${id}`,
        type:'DELETE'
    });
    }
}
// DOM manager class will do all the hard work everytime we render a new class
class DOMManager {
    static houses;

    static getAllHouses(){
        //Top down development calling methods we haven't yet created to do what they are suppose to do
        HouseService.getAllHouses().then(houses => this.render(houses));
}

static createHouse(name) {
    HouseService.createHouse(new House(name))
    .then(() => {
        return HouseService.getAllHouses();
    })
    .then((houses) => this.render(houses));
}
//delete a house then send another http request to get the new set of the new houses
static deleteHouse(id) {
   HouseService.deleteHouse(id)
   .then(() => {
    return HouseService.getAllHouses();
   })
   .then((houses) => this.render(houses)) 
}
//building the a add Room render 
static addRoom(id) {
    for (let house of this.houses) {
    if (house._id == id) {
        house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()));
        HouseService.updateHouse(house) 
        .then(() => {
            return HouseService.getAllHouses();
        })
        .then((houses) => this.render(houses));
        }
    }
    }

    //delete room render to be able to delete room in the house
    static deleteRoom(houseId, roomId) {
        for (let house of this.houses) {
            if (house._id == houseId) {
        for (let room of house.rooms) {
            if(room._id == roomId) {
                house.rooms.splice(house.rooms.indexOf(room), 1)
                HouseService.updateHouse(house)
                .then(() => {
                    return HouseService.getAllHouses();
                })
                .then((houses) => this.render(houses));
            }       
        }
            }
        }
    }

//building the render method going to take the houses and put them to the DOM layed out in seperate forms
static render(houses) {
this.houses = houses //which is the houses in the DOMManager() are = to whatever houses passing thur our render method 
$('#app').empty();//the app div is where everything will be rendered and it will be cleared everytime we enter a new house
//for loop to go over houses and render
for (let house of houses) {
//can append or prepend this way is prepend it this also were the html for every house will be built
//including creating rows for the room name and are starting at line 79
    $('#app').prepend(
`<div id="${house._id}" class="card">
    <div class = "card-header">
    <h2>${house.name}</h2>
    <button class="btn btn-danger" onClick="DOMManager.deleteHouse('${house._id}')">Delete</button>
    </div>
    <div class="card-body">
    <div class="card>
    <div class="row">
    <div class="col-sm">
        <input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
    </div>
    <div class="col-sm">
    <input type="text" id="${house._id}-room-area" class="form-control" placeholder="Room Area">
    </div>
    </div>
    <button id="${house._id}-new-room" onClick="DOMManager.addRoom('${house._id}')" class="btn btn-secondary form-control">Add</button>
    </div>
    </div>
    </div>
    </div><br>`
    );
    // this refers to the current house we are looking at
    for (let room of house.rooms) {
        $(`#${house._id}`).find('.card-body').append(
            `<p>
            <span id="name-${room._id}"><strong>Name: </strong>${room.name}</span>
            <span id="area-${room._id}"><strong>Name: </strong>${room.area}</span>
            <button class="btn btn-danger" onClick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`
            
            );
    }
}
}
}

$('#create-new-house').click(() => {
DOMManager.createHouse($('#new-house-name').val());
$('#new-house-name').val('');
});
DOMManager.getAllHouses();