#!/usr/bin/env ruby
require 'json'

json = File.read('pretty.json')
sites = JSON.parse(json)

badness = {}
worst = 0

sites.each{ |site|
	name = site["name"]
	score = site["score"]

	worst = score if score > worst

	key = score.to_s.to_sym

	if not badness.has_key?(key)
		badness[key] = []
	end
	badness[key] << name
}

badness[:worst] = worst

puts worst
puts JSON.pretty_generate(JSON.parse(badness.to_json))

saveFile = File.new("badness.json",'w')
saveFile.write(badness.to_json)
saveFile.close