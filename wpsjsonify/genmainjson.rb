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

CSV.foreach('data.csv') do |row|
	elem = Hash[[:url, :name, :latlong].zip(row)]
	elem[:score]=get_score_from_url(elem[:url])
	data << elem
end

if ARGV[1] == "-p"
	puts JSON.pretty_generate(JSON.parse(data.to_json))
elsif ARGV[1] == "-s"
	saveFile = File.new("data.json",'w')
	saveFile.write(data.to_json)
	saveFile.close
else
	puts data.to_json
end