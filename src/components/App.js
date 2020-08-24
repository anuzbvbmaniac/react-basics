import React, {useState, useEffect} from 'react';
import RecipeList from "./RecipeList";
import {v4 as uuidv4} from 'uuid';

import '../assets/css/app.css'
import RecipeEdit from "./RecipeEdit";

export const RecipeContext = React.createContext();
const LOCAL_STORAGE_KEY = 'cookingWithReact.recipes'

function App() {
    const [selectedRecipeId, setSelectedRecipeId] = useState()
    const [recipes, setRecipes] = useState(sampleRecipe)
    const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId)

    useEffect(() => {
        const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (recipeJSON != null) {
            setRecipes(JSON.parse(recipeJSON))
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes))
    }, [recipes]);


    const recipeContextValue = {
        handleRecipeAdd,
        handleRecipeDelete,
        handleRecipeSelect,
        handleRecipeChange
    }

    function handleRecipeSelect(id) {
        setSelectedRecipeId(id);
    }

    function handleRecipeChange(id, recipe) {
        const newRecipe = [...recipes];
        const index = newRecipe.findIndex(r => r.id === id)
        newRecipe[index] = recipe;
        setRecipes(newRecipe);
    }

    function handleRecipeAdd() {
        const newRecipe = {
            id: uuidv4(),
            name: '',
            servings: 1,
            cookTime: '',
            instructions: '',
            ingredients: [
                {
                    id: uuidv4(),
                    name: '',
                    amount: ''
                },
            ]
        }
        setSelectedRecipeId(newRecipe.id)
        setRecipes([...recipes, newRecipe])
    }

    function handleRecipeDelete(id) {
        if (selectedRecipeId != null && selectedRecipeId === id) {
            setSelectedRecipeId(undefined);
        }
        setRecipes(recipes.filter(recipe => recipe.id !== id));
    }

    return (
        <RecipeContext.Provider value={recipeContextValue}>
            <RecipeList recipes={recipes} />
            {selectedRecipe && <RecipeEdit recipe={selectedRecipe} />}
        </RecipeContext.Provider>
    );
}

const sampleRecipe = [
    {
        id: 1,
        name: 'Plain Chicken',
        servings: 3,
        cookTime: '1:45',
        instructions: '1. Put salt on chicken.\n2. Put chicken into oven.\n3. Eat chicken.',
        ingredients: [
            {
                id: 1,
                name: 'Chicken',
                amount: '2 Pounds'
            },
            {
                id: 2,
                name: 'Salt',
                amount: '1 Tbs'
            }
        ]
    },
    {
        id: 2,
        name: 'Plain Pork',
        servings: 5,
        cookTime: '0:45',
        instructions: '1. Put paprika on chicken.\n2. Put pork into oven.\n3. Eat pork.',
        ingredients: [
            {
                id: 1,
                name: 'Pork',
                amount: '3 Pounds'
            },
            {
                id: 2,
                name: 'Paprika',
                amount: '2 Tbs'
            }
        ]
    }
]

export default App;
