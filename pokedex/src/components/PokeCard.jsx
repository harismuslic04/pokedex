import { useEffect, useState } from "react";
import React from "react";
import { getPokedexNumber } from "../utils";

export default function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if loading, exit logic
    if (loading || !localStorage) {
      return;
    }
    // check if the selected pokemon information is available in the cache
    // 1. define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

    if (selectedPokemon in cache) {
      //read from cache
      setData(cache[selectedPokemon]);
      console.log("Found pokemon in cache");
      return;
    }

    // we passed all the cache stuff to no avail and now need to fetch the data from the api
    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        console.log("Fetched pokemon data");
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
    //if we fetch from api,make sure to save the information to the cashe for next time
  }, [selectedPokemon]);

  return <div></div>;
}
