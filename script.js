// Mul pole kuhugi kirja panna so...
/* 
1. Võtan nime
2. Annan nime järgi info kaardi kohta
(image, nimi, type, health, moves, hind)

3. Sisesta järgmine pokemon

4. Alustab kaklust
*/
let info;
let first_nums;
let second_nums;

document.querySelector(".first").disabled = true;
document.querySelector(".second").disabled = true;

async function get_info() 
{
    const url = "https://api.pokemontcg.io/v2/cards";
    const response = await fetch(url);
    const data = await response.json();
    info = data;
    console.log(info);
    document.querySelector("h1").innerHTML = "";

    document.querySelector(".first").disabled = false;
    document.querySelector(".second").disabled = false;
    for (item of data.data)
    {
        if (item.attacks != undefined || 0)
        {
            console.log(item.attacks)
        }
    }
    deal_damage(162, 69, "Water");
}
get_info();

const element = document.querySelector(".first");
element.addEventListener("keydown", function(event)
{
    if (event.key == "Enter" || event.key == "Tab")
    {
        let name = 
        event.target.value.charAt(0).toUpperCase()
        + event.target.value.substring(1).toLowerCase();

        
        main(name, info, ".input_card");
    }
});

const element_1 = document.querySelector(".second");
element_1.addEventListener("keydown", function(event)
{
    if (event.key == "Enter" || event.key == "Tab")
    {
        let name = 
        event.target.value.charAt(0).toUpperCase()
        + event.target.value.substring(1).toLowerCase();

        main(name, info, ".second_card");
    }
});



async function main(pokemon, data, id) 
{
    let input_pos = [undefined];
    let a = 0;
    for(let i = 0; i < data.count; i++)
    {
        if (data.data[i].name == pokemon)
        {
            input_pos[a] = i;
            a++;
        }
    }
    if (id == ".input_card"){first_nums = input_pos;}
    else {second_nums = input_pos;}

    const input_card = document.querySelector(id);
    
    input_card.innerHTML = "<h1>" + "Found: " + "</h1>";
    let num = 0;
    for (const item of input_pos)
    {
        let weak = "";
        let resistances = "";
        let types = "";
        const image = data.data[item].images.small;
        if (data.data[item].weaknesses != undefined)
        {
            for(a of data.data[item].weaknesses)
            {
                if (a.type != undefined)
                {
                    weak += a.type + " " + a.value + " ";
                }
            }
        }
        else
        {
            weaknesses = "None";
        }
        
        if (data.data[item].resistances != undefined)
        {
            for(a of data.data[item].resistances) 
            {
                resistances += a.type + " " + a.value + " ";
            }
        }
        else
        {
            resistances = "None";
        }
        for(type of data.data[item].types)
        {
            types += type + " ";
        }
        
        input_card.innerHTML += "<img id=" + num + " src='" + image + "'/>";
        input_card.innerHTML += 
        "<p>" + 
        "Artist: " + data.data[item].artist + "<br>" +
        "Name: " + data.data[item].name + "<br>" +
        "Evolves from: " + data.data[item].evolvesFrom + "<br>" +
        "Rairity: " + data.data[item].rarity + "<br>" +
        "Health: " + data.data[item].hp + "<br>" +
        "Type: " + types + "<br>" +
        "Weaknesses: " + weak + "<br>" +
        "Resistances: " + resistances + "<br>" +
        "Average sell price: " + data.data[item].cardmarket.prices.averageSellPrice + "<br>" +
        "Low price: " + data.data[item].cardmarket.prices.lowPrice + "<br>" +
        "</p>";
        num++;
    }
}

let pokemon_1_num;
let pokemon_2_num;

let image_element = document.querySelector(".input_card");
image_element.addEventListener("click", function(event)
{
    if (event.target.tagName == "IMG")
    {
        pokemon_1_num = first_nums[event.target.id];
        if(pokemon_2_num != undefined)
        {
            battle_prep();
        }
    }
});

let image_element_1 = document.querySelector(".second_card");
image_element_1.addEventListener("click", function(event)
{
    if (event.target.tagName == "IMG")
    {
        pokemon_2_num = second_nums[event.target.id];
        if(pokemon_1_num != undefined)
        {
            battle_prep();
        }
    }
});

function battle_prep()
{
    document.querySelector(".all").innerHTML = "";

    const buttons = document.querySelector(".prep_buttons");

    buttons.innerHTML = "<input type = 'button' class = "+
    "'prep_buttons' id = 'prep_left' value = 'Join game'/>";
    buttons.innerHTML += "<input type = 'button' class = "+
    "'prep_buttons' id = 'prep_right' value = 'Create game'/>";

    buttons.addEventListener("click", function(event) 
    {
        if (event.target.id == "prep_left")
        {
            ip_setup(false);
        }
        else
        {
            ip_setup(true);
        }
    });
}

function ip_setup(create)
{
    document.querySelector(".prep_buttons").innerHTML = "";

    const ip_prep = document.querySelector(".prep_ip")
    if (create)
    {
        ip_prep.innerHTML = "<input type = 'text' placeholder = 'Enter new ip' class = 'prep_ip'/>";
    }
    else
    {
        ip_prep.innerHTML = "<input type = 'text' placeholder = 'Enter ip' class = 'prep_ip'/>";
    }

    ip_prep.addEventListener("key_down", function(event)
    {
        if (event.target.key == "Enter")
        {
            load_battle(event.target.value, create, false) 
        }
    });
}

let url;
async function load_battle(ip, create, created)
{
    const searching_url = "https://kool.krister.ee/chat/ants_pokemon_search_ip_" + ip;
    if (create)
    {
        const info = 
        {
            available: true,
        }
        fetch(searching_url, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info)
        });
        create = false;
        created = true;
    }
    else if(created)
    {
        const response = await fetch(searching_url);
        const data = await response.json();

        if (data.available == undefined)
        {
            start_battle();
            url = searching_url;
        }
    }
    else
    {
        const response = await fetch(searching_url);
        const data = await response.json();

        if (data.available != undefined)
        {
            if (data.available = true)
            {
                fetch(searching_url, 
                {
                    method: "DELETE",
                })
                start_battle();
                url = searching_url;
            }
        }
    }
}

const moves = 
{
    "Second Strike": "if(hp < hp_max)" +
    "{deal_damage()}",
}

let def = [0, 0];
let hp_max;
let hp = hp_max;
let post_turn_effect;
let damage;

let first_abilties = [];
let second_abilities = [];
const ability_colors = 
{
    Fire: "red",
    Normal: "lightgray",
    Water: "lightblue",
    Electric: "yellow",
    Grass: "green",
    Ice: "lightblue",
    Fighting: "darkred",
    Poison: "purple",
    Ground: "burlywood",
    Flying: "mediumslateblue",
    Psychic: "rgb(255, 122, 144)",
    Bug: "limegreen",
    Rock: "darkkhaki",
    Ghost: "rgb(67, 0, 139)",
    Dragon: "rgb(87, 0, 193)",
    Dark: "rgb(87, 30, 30)",
    Metal: "rgba(211, 211, 211, 0.908)",
    Fairy: "pink"
}
const type_chart = {
    normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
    fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
    dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

function deal_damage(target, damage, atk_type)
{
    if (target == pokemon_1_num)
    {
        damage -= def[0];
    }
    else
    {
        damage -= def[1];
    }
    if(info.data[target].resistances != undefined)
    {
        for (item of info.data[target].resistances)
        {
            if (atk_type == item.type)
            {
                damage += Number(item.value);
            }
        }
    }
    if (info.data[target].weaknesses != undefined)
    {
        for (item of info.data[target].weaknesses)
        {
            if(atk_type == item.type)
            {
                if(item.type.charAt(0) == "+")
                {
                    damage += Number(item.value);
                }
                else
                {
                    damage *= Number(item.value.substring(1));
                }
            }
        }
    }
    for (item of info.data[target].types)
    {
        damage *= type_calculation(atk_type.toLowerCase(), item.toLowerCase());
    }
    console.log(damage)
}

function type_calculation(type_1, type_2)
{
    if (type_chart[type_1][type_2] != undefined)
    {
        return type_chart[type_1][type_2];
    }
    else
    {
        return 1;
    }
}

async function start_battle()
{
    let a = 0;
    for(item of info.data[pokemon_2_num].attacks)
    {
        second_abilities[a] = item;
        a++;
    }

    a = 0;
    for(item of info.data[pokemon_1_num].attacks)
    {
        first_abilties[a] = item;
        a++;
    }

    const response = await fetch(url);
    const data = await response.json();


    document.querySelector(".all").innerHTML = "";
    const l_button = document.querySelector(".left_button");
    const r_button = document.querySelector(".right_button");
    console.log(first_abilties[0].cost[0]);

    document.querySelector(".left_image").innerHTML = "<img src='" + info.data[pokemon_1_num].images.small + "'/>";
    document.querySelector(".right_image").innerHTML = "<img src='" + info.data[pokemon_2_num].images.small + "'/>";

    if(first_abilties[0] != undefined)
    {
        l_button.innerHTML += "<input class='left' id='left' type = 'button' value='" 
        + first_abilties[0].name + "'/>";
        document.getElementById("left").style.backgroundColor =
        ability_colors[first_abilties[0].cost[0]];    
    }

    if (first_abilties[1] != undefined)
    {
        r_button.innerHTML += "<input class='right' id='right' type = 'button' value='" 
        + first_abilties[1].name + "'/>";
        document.getElementById("right").style.backgroundColor =
        ability_colors[first_abilties[1].cost[0]];
    }
}