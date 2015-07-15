# throxy

A very simple throttling proxy for simulating slow internet.

## Installation
    $ npm install -g acoll/throxy

## Usage
    
      Usage: throxy [options] <target>

      Options:

        -h, --help           output usage information
        -V, --version        output the version number
        -p, --port [port]    Run the proxy server on the specified port. [9000]
        -s, --speed [speed]  Throttle to the specified kB/s. [100kB]

      Examples:

        $ throxy --help
        $ throxy localhost:8080             # Proxies localhost:8080 behind default port 9000
        $ throxy localhost:8080 --speed 10  # Default port and override speed to 10kB/s
        $ throxy localhost:8080 --port 7000 # Override proxy server port

