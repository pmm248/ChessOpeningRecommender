import wikipedia
import json
import sys

descriptions = {}

with open('eco.json') as file:
	openings = json.load(file)
	for opening in openings:
		opening_name = opening['n']
		print(opening_name)
		if ":" in opening_name or "," in opening_name:
			continue
		sys.stdout.flush()
		try:
			opening_description = wikipedia.summary(opening_name, sentences=6)
			descriptions[opening_name] = opening_description
		except:
			pass

with open('descriptions.json', 'w') as file:
	json.dump(descriptions, file)
