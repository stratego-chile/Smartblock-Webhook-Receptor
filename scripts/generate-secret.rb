require 'securerandom'
require 'optparse'

DEFAULT_LENGTH = 20
DEFAULT_REPEAT = 1

begin
  options = { }

  length = DEFAULT_LENGTH
  repeat = DEFAULT_REPEAT

  OptionParser.new do |opt|
    opt.on('--length LENGTH') { |o| options[:length] = o } # Get `--length` flag value
    opt.on('--repeat REPEAT') { |o| options[:repeat] = o } # Get `--repeat` flag value
  end.parse!

  if options[:length]
    length_input = Integer(options[:length])
    if length_input > 0
      length = length_input
    end
  end

  if options[:repeat]
    repeat_input = Integer(options[:repeat])
    if repeat_input > 1
      repeat = repeat_input
    end
  end

  while repeat > 0
    puts SecureRandom.alphanumeric(length) # Generates a random string
    repeat -= 1
  end
rescue => exception
  puts 'Process exit caused by an unexpected input:', exception
end
