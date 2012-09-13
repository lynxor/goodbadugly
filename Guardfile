guard 'shell' do
  watch(%r"tests/.*test\..*") {|m|
	`node bgtests.js`
  }
  watch(%r"js/.*js") {|m|
	`node bgtests.js`
  }
end

