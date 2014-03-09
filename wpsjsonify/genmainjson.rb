#!/usr/bin/env ruby

require 'json'
require 'csv'

def get_score_from_url(fileName)
	#nothing
	begin
		data = File.open(fileName, "r")
		data.each{ |line|
			if score = line[/"score":(\d+),/,1]
				return score.to_i
			end
		}
	rescue
		puts "Error in taking the score from: " + fileName
		return -1
	end
end

#customers = CSV.read('data.csv')
data = []

badness = {}

CSV.foreach('data.csv') do |row|
	elem = Hash[[:url, :name, :latlong].zip(row)]
	elem[:score]=get_score_from_url(elem[:url])

	if not badness.has_key?(elem[:score])
		badness[elem[:score]] = []
	end
	badness[elem[:score]] <<  elem[:name]
	data << elem
end

if ARGV[2] == "-b"
	what = badness
else
	what = data
end

if ARGV[1] == "-p"
	puts  JSON.pretty_generate(JSON.parse(what.to_json))
elsif ARGV[1] == "-s"
	saveFile = File.new("data.json",'w')
	saveFile.write(what.to_json)
	saveFile.close
else
	puts what.to_json
end