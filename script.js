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

    document.querySelector(".first").disabled = false;
    document.querySelector(".second").disabled = false;
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
    console.log(data);
    console.log(pokemon);
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
        
        if (data.data[item].types != undefined)
        {
            for(let a = 0; a < data.data[item].types.length; a++)
            {
                types += data.data[item].types[a] + " "
            }
        }
        else
        {
            types = "None";
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
    }
});

let image_element_1 = document.querySelector(".second_card");
image_element_1.addEventListener("click", function(event)
{
    if (event.target.tagName == "IMG")
    {
        pokemon_2_num = second_nums[event.target.id];
    }
});


