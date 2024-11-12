let info;
let first_nums;
let second_nums;
let all_attacks = {data: []};

async function get_info() 
{
    const url = "https://api.pokemontcg.io/v2/cards";
    const response = await fetch(url);
    const data = await response.json();
    info = data;
    console.log(info);

    let i = 0;
    for (item of data.data)
    {
        if (item.attacks != undefined || 0)
        {
            all_attacks.data[i] = item.attacks;
            i++;
        }
    }
    console.log(all_attacks);

    if (fetching)
    {
        document.querySelector(".fetch").innerHTML = "";
    }
}
get_info();
let fetching = false;
function poke_search_bars()
{
    document.querySelector(".prep_buttons").innerHTML = "";

    const div_class = document.querySelector(".inputs");
    div_class.innerHTML += "<input class = 'first' placeholder = 'Enter your pokemon name' type = 'tekst'/>";
    div_class.innerHTML += "<input class = 'second' placeholder = 'Enter your enemy pokemon name' type = 'tekst'/>"

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

    if (info == undefined)
    {
        fetching = true;
        document.querySelector(".fetch").innerHTML = "Fetching data...";
    }
}


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

let created_lobby = false;

let image_element = document.querySelector(".input_card");
image_element.addEventListener("click", function(event)
{
    if (event.target.tagName == "IMG")
    {
        pokemon_1_num = first_nums[event.target.id];
        if(pokemon_2_num != undefined)
        {
            if (created_lobby)
            {
                ip_setup(true);
                document.querySelector(".all").innerHTML = "";
            }
            else
            {
                battle_prep();
            }
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
            if (created_lobby)
            {
                ip_setup(true);
                document.querySelector(".all").innerHTML = "";
            }
            else
            {
                battle_prep();
            }
        }
    }
});

function battle_prep()
{
   const buttons = document.querySelector(".prep_buttons");

    buttons.innerHTML = "<input type = 'button' class = "+
    "'prep_buttons' id = 'prep_left' value = 'Join game'/>";
    buttons.innerHTML += "<input type = 'button' class = "+
    "'prep_buttons' id = 'prep_right' value = 'Create game'/>";

    buttons.addEventListener("click", function(event) 
    {
        if (info != undefined)
        {
            if (event.target.id == "prep_left")
            {
                ip_setup(false);
            }
            else
            {
                poke_search_bars();
                created_lobby = true;
            }
        } else
        {
            fetching = true;
            document.querySelector(".fetch").innerHTML = "Fetching data...";
        }
    });
}
battle_prep();

function ip_setup(create)
{
    document.querySelector(".prep_buttons").innerHTML = "";

    const ip_prep = document.querySelector(".prep_ip")
    if (create)
    {
        ip_prep.innerHTML = "<input type = 'text' placeholder = 'Enter new ip' class = 'prepare_ip' id = 'prepare_ip'/>";
    }
    else
    {
        ip_prep.innerHTML = "<input type = 'text' placeholder = 'Enter ip' class = 'prepare_ip' id = 'prepare_ip'/>";
    }

    document.getElementById("prepare_ip").addEventListener("keydown", function(event)
    {
        if (event.key == "Enter")
        {
            load_battle(event.target.value, create, false) 
        }
    });
}

let url;
async function load_battle(ip, create, created)
{
    console.log(ip);
    let found = false;
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

        const num = data.length - 1;
        if (data[num].available == false)
        {
            url = searching_url;
            found = true;
            start_battle();
        }
    }
    else
    {
        const response = await fetch(searching_url);
        const data = await response.json();

        const num = data.length - 1;
        if (data[num].available != undefined)
        {
            if (data[num].available == true)
            {
                url = searching_url;
                found = true;
                start_battle();
                const info = {
                    available: false,
                }
                fetch(url,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(info)
                });
            }
        }
    }
    if (!found)
    {
        setTimeout(load_battle, 1000, ip, create, created);
    }
}

const moves = 
{
    "Second Strike": function(){},
}

let def = [0, 0];
let hp_max;
let hp = hp_max;
let post_turn_effect;
let damage;

let first_abilties = [];
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
    hp -= damage;
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

let started_battle = false;
async function start_battle()
{
    let downloaded = false;
    if(created_lobby)
    {
            let a = 0;
            for(item of info.data[pokemon_1_num].attacks)
            {
                first_abilties[a] = item;
                a++;
            }
            
            const info = {
                pokemon_1_num: pokemon_1_num,
                pokemon_2_num: pokemon_2_num,
                creator_move: true,
                cr_moved: false, // cr = creator
                en_moved: false, // en = enemy
                cr_action: "",
                en_action: "",
            }

            hp_max = info.data[pokemon_1_num].hp;
            hp = hp_max;

            fetch(url,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(info)
                }
            )
        }
        else
        {
            downloaded = data_download();
        }


        if (downloaded)
        {
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
        started_battle = true;
    }
}

async function data_download()
{
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);


    pokemon_1_num = data.pokemon_1_num;
    pokemon_2_num = data.pokemon_2_num;

    for(item of info.data[pokemon_2_num].attacks)
    {
        first_abilties[a] = item;
        a++;
    }

    hp_max = info.data[pokemon_2_num].hp;
    hp = hp_max;

    if (data != undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function battle() 
{
    if (started_battle)
    {
        const response = await fetch(url);
        const raw_data = await response.json();
        const data = raw_data[raw_data.length - 1];

        if (created_lobby)
        {
            if (data.en_moved)
            {
                if (moves[data.en_action] != undefined)
                {
                    moves[data.en_action]();
                }
                else
                {
                    for(item of all_attacks.data)
                    {
                        for(attack of item)
                        {
                            if (attack.name == data.en_action)
                            {
                                deal_damage(pokemon_1_num, attack.damage, attack.cost[0]);
                            }
                        }
                    }
                }
            }
        }
        else
        {
            if (data.cr_moved)
            {
                if (moves[data.en_action] != undefined)
                {
                    moves[data.en_action]();
                }
                else
                {
                    for(item of all_attacks.data)
                    {
                        for(attack of item)
                        {
                            if (attack.name == data.en_action)
                            {
                                deal_damage(pokemon_1_num, attack.damage, attack.cost[0]);
                            }
                        }
                    }
                }
            }
        }
    }
}

setInterval(battle, 500);