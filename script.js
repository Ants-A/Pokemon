// Mul pole kuhugi kirja panna so...
/* 
1. Võtan nime
2. Annan nime järgi info kaardi kohta
(image, nimi, type, health, moves, hind)

3. Annab need, kelle vastu ta tugev

4. Annab need kelle vastu ta nõrk
*/

const element = document.querySelector("input");
element.addEventListener("keydown", function(event)
{
    if (event.key == "Enter" || event.key == "Tab")
    {
        let name = 
        event.target.value.charAt(0).toUpperCase()
        + event.target.value.substring(1).toLowerCase();
        main(name);
    }
});

async function main(pokemon) 
{
    const url = "https://api.pokemontcg.io/v2/cards";
    const response = await fetch(url);
    const data = await response.json();

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
    console.log(input_pos)

    const input_card = document.querySelector(".input_card");
    input_card.innerHTML = "";
    for (const item of input_pos)
    {
        const image = data.data[item].images.small;
        for(a of data.data[item].weaknesses)
        {
            weak = a.type + " " + a.value;
        }
        input_card.innerHTML += "<img src='"+ image +"'/>";
        input_card.innerHTML += 
        "<p>" + 
        "Name: " + data.data[item].name + "<br>" +
        "Evolves from: " + data.data[item].evolvesFrom + "<br>" +
        "Rairity: " + data.data[item].rarity + "<br>" +
        "Type: " + data.data[item].types + "<br>" +
        "Weaknesses: " + weak + "<br>" +
        "Average sell price: " + data.data[item].cardmarket.prices.averageSellPrice + "<br>" +
        "Low price: " + data.data[item].cardmarket.prices.lowPrice + "<br>" +
        "</p>";
    }
}