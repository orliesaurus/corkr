#!/usr/bin/env ruby

require 'json'

################ GLOBALS ################

useful_names = {
	'URL' => 'url',
	'Interesting header' => 'headers',
	'Started' => 'date'
}

############### LOGIC ####################

def add_to_data(hash, key, value)
	if hash[key.to_sym].kind_of?(Array)
		hash[key.to_sym] << value
	else
		hash[key.to_sym] = value
	end
end

def get_vuln_hash(infos)
	vuln={}
	vuln["references".to_sym] = []

	infos.each { |info|
		name, content = info.match(/^([A-Za-z\-\.\s]*):(.*)/).captures
		name = name.downcase.strip
		name = name+'s' if name == 'reference'
		name = 'fixed' if name == 'fixed in'

		add_to_data(vuln, name, content.strip)
	}

	return vuln
end

def get_plugin_hash(infos)
	infos = infos.split(/\n\|/)
	infos[0] = "name: " + infos[0]

	plugin = {}
	plugin["warning".to_sym] = {}
	score = 0

	infos.each { |info|
		warn, name, content = info.match(/^(@)?([^:]*):(.*)/).captures
		score += 1 if warn

		name = name.downcase.strip
		if ["name", "location"].include?(name)
			add_to_data(plugin, name, content.strip) 
		else
			plugin["warning".to_sym][name.gsub(/\s+/,'_').to_sym] = content.strip
		end
	}

	return plugin, score
end

def parse_wp_vulnerability(output, information)
	vulnerabilities = information.split(/\|\s*$/)
	vulnerabilities.delete_at(0)
	vulnerabilities.each { |problem|
		infos = problem.split(/\|\*/).delete_if{ |value| value == "\n"}
		vuln = get_vuln_hash(infos)
		output[:score] += 1
		output["wp_vulnerability".to_sym] << vuln
	}
end

def parse_plugin_vulnerability(output, information)
	plugins = information.split(/\|Name:\s/)
	plugins.delete_at(0)

	plugins.each { |plugin|
		plugin_data = plugin.split(/\n\|\n/)

		plugin_hash, score = get_plugin_hash(plugin_data[0])
		output[:score] += score if score != 0

		plugin_data.delete_at(0)

		plugin_vulnerability = []

		plugin_data.each{ |problem|
			infos = problem.split(/\|\*/)
			infos.delete_at(0)

			if infos
				vuln = get_vuln_hash(infos)

				begin
					fixed = vuln["fixed".to_sym]
					if fixed
						name = plugin_hash["name".to_sym]
					  version = name[/\sv?([\d\.?]+)\s?/,1]
					  if version
							broken = Gem::Version.new(fixed) > Gem::Version.new(version)
							if broken
								vuln["broken".to_sym] = true 
								output[:score] += 1
							end
						end
					end
				rescue
					#No problem if it fails...
				end

				plugin_vulnerability << vuln
			end
		}

		plugin_hash["vulnerability".to_sym] = plugin_vulnerability

		output["plugin_vulnerability".to_sym] << plugin_hash
	}
end

def elaborate(data, useful_names)
	output = {}
	output[:score] = 0
	output["headers".to_sym] = []
	output["wp_vulnerability".to_sym] = []
	output["plugin_vulnerability".to_sym] = []

	data = data.join("\n").split(/[+!]/).delete_if{ |value| value == "" }

	data.each { |information|

		if information.include?('|')
			if information[/^\d*\svulnerabilities\sidentified/]
				parse_wp_vulnerability(output, information)
			else
				parse_plugin_vulnerability(output, information)
			end
		else
			if information[/^[A-Za-z\-\.\s]*:/]
				name, content = information.match(/^([A-Za-z\-\.\s]*):(.*)/).captures

				if useful_names.has_key?(name)
					key_name = useful_names[name]
					add_to_data(output, key_name, content.strip)
				end
			else
				if version = information[/^WordPress\sversion\s([\d\.]+)\s/,1]
			 		output["wp_version".to_sym] = version
				end
			end
		end
	}

	return output
end

################ CORE ################

stringfile = ARGV[0]
fileData = File.open(stringfile,'r')
data = []

fileData.each { |line|
	line = line.gsub(/\x1B\[([0-9]{1,3}((;[0-9]{1,3})*)?)?[m|K]/,'')

	if content = line[/^(\s\|\s)?(\[[+!]\]|\s\|)\s(.*)/,3]
		if line[/^(\s\|\s)?(\[[+!]\]|\s\|)\s(.*)/,1]
			content = '@' + content
		end
		data << line[1] + content
	end
}

fileData.close

output = elaborate(data, useful_names)

if ARGV[1] == "-p"
	puts JSON.pretty_generate(JSON.parse(output.to_json))
elsif ARGV[1] == "-s"
	saveFile = File.new(stringfile.gsub(/(.*)\..*$/,'\1.json'),'w')
	saveFile.write(output.to_json)
	saveFile.close
else
	puts output.to_json
end
