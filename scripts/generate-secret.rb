require 'securerandom'
require 'optparse'

begin
  options = { }
  OptionParser.new do |opt|
    opt.on('--length LENGTH') { |o| options[:length] = o } # Get `--length` flag value
  end.parse!
  inline_length = Integer(options[:length]) if options[:length]
  puts SecureRandom.hex(inline_length || 20) # Generate an hexadecimal based string
rescue => exception
  puts 'Process exit caused by an input error:', exception
end
