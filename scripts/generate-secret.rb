require 'securerandom'
require 'optparse'

begin
  options = { }
  DEFAULT_LENGTH = 20
  OptionParser.new do |opt|
    opt.on('--length LENGTH') { |o| options[:length] = o } # Get `--length` flag value
  end.parse!
  inline_length = Integer(options[:length]) if options[:length]
  length = (inline_length and inline_length > 0) ? inline_length : DEFAULT_LENGTH
  puts SecureRandom.alphanumeric(length) # Generates a random string
rescue => exception
  puts 'Process exit caused by an unexpected input:', exception
end
