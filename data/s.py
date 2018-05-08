import wikipedia
import json
import sys

descriptions = {}

with open('descriptions.json', 'r') as file:
	openings = json.load(file)
	for key in openings:
		if "King's Gambit Accepted, Muzio Gambit" in key:
			continue
		if ":" in key:
			continue
		sys.stdout.flush()
		try:
			descriptions[key] = openings[key]
		except:
			pass

with open('descriptions.json', 'w') as file:
	json.dump(descriptions, file)
