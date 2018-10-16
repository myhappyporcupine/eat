# eat
A simulation of creatures that eat each other

White cells are empty cells.
Green cells are plants.
Blue cells are herbivores.
Red cells are carnivores.

There are three stages of each frame:
1) Populating the world with plants.
2) Herbivore interaction.
3) Carnivore interaction.

Herbivores will move to plants, if they are neighboring any. After eating a plant, they have a chance to reproduce.
They will otherwise move to an empty cell and not reproduce.
And if there aren't plants or empty cell neighbors to go to, they will stay in place.

Carnivores will move to herbivores, if they are neighboring any. After eating a herbivore, they have a chance to reproduce.
They will otherwise move to a cell with a carnivore, if they are neighboring any. After killing another carnivore, a plant will appear (as if through decomposition of the body).
Otherwise they will move to an empty cell.
Else they will stay in place.
