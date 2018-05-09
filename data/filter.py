import json
import sys

descriptions = {}

taboo_phrases = ["King's Gambit Accepted, Muzio Gambit", "Accepted", "Declined", "Slav Indian", "Queen's Indian Accelerated", "Yusupov-Rubinstein System", "Guatemala Defense", "Rubinstein Opening", "Bronstein Gambit", "Duras Gambit", "Paleface Attack", "Franco-Benoni Defense", "Pterodactyl Defense", "Fried Fox Defense", "Australian Defense", "Robatsch Defense", "Old Benoni Defense", "English Orangutan", "Barnes Defense", "Valencia Opening", "Montevideo Defense", "Czech Defense", "Crab Opening", "Venezolana Opening", "RÃ©ti Opening", "Lemming Defense", "Global Opening", "Lasker Simul Special", "Ware Defense", "Vulture Defense"]

with open('opening_descriptions.json', 'r') as file:
	openings = json.load(file)
	for key in openings:
		contains_taboo_word = False
		for taboo_phrase in taboo_phrases:
			contains_taboo_word |= taboo_phrase in key

		if contains_taboo_word:
			continue

		if key == "Gedult's Opening":
			descriptions["Barnes Opening"] = openings[key]
		elif key == "Norwegian Defense":
			descriptions["Modern Defense"] = openings[key]
		elif key == "Van Geet Opening":
			descriptions["Dunst Opening"] = openings[key]
		else:
			descriptions[key] = openings[key]

print(len(descriptions))

with open('opening_descriptions.json', 'w') as file:
	json.dump(descriptions, file)
